# =============================
# 📁 main_ws.py — serveur WS unique (5050) + GPS intégré
# =============================
import asyncio, json, atexit, time, threading, signal, os
import websockets

import i_o_real
from simu import set_inputs_simulation
from grafcet import evaluate_grafcet
from etat_global import get_etat, maj_etat, remplacer_etat
from config_io import SORTIES_GPIO, TOR_ENTREES, ANA_ENTREES, ETATS_SIMULES_INITIAUX

# ---- gpsd (optionnel, robuste si non installé) ----
GPS_ENABLED = True
try:
    import gpsd  # pip install gpsd-py3
except Exception:
    print("⚠️ gpsd-py3 non disponible → GPS désactivé (pip install gpsd-py3).")
    GPS_ENABLED = False

clients = set()
spi = None

# --- Mode & epoch controller ---
_current_mode = get_etat().get("mode", 1)  # 1 = SIMU par défaut
_mode_changed_at = 0.0
_IGNORE_WINDOW_MS = 500
_state_epoch = 0  # version globale de l'état pour forcer remount front

# --- GPS thread control ---
_gps_thread = None
_gps_stop = threading.Event()


# ========== Diffusion état ==========
async def _broadcast_state():
    state = get_etat().copy()
    state["_server_ts"] = time.time()
    state["state_epoch"] = _state_epoch
    dead = []
    for c in clients:
        try:
            await c.send(json.dumps(state))
        except Exception:
            dead.append(c)
    for d in dead:
        clients.discard(d)


# ========== Reset d'état ==========
def _reset_state_defaults(preserve_mode: int | None = None, write_hw: bool = False):
    fresh = ETATS_SIMULES_INITIAUX.copy()
    if preserve_mode is not None:
        fresh["mode"] = int(preserve_mode)
    remplacer_etat(fresh)
    if write_hw:
        try:
            for name in SORTIES_GPIO:
                # i_o_real.write_output peut ne pas exister selon ta version → protège
                if hasattr(i_o_real, "write_output"):
                    i_o_real.write_output(name, 0)
        except Exception as e:
            print(f"⚠️ reset sorties physiques failed: {e}")


# ========== Switch RÉEL / SIMU ==========
def switch_mode(new_mode: int):
    global spi, _current_mode, _mode_changed_at, _state_epoch
    try:
        nm = int(new_mode)
    except Exception:
        print(f"⚠️ switch_mode: invalid mode {new_mode}")
        return

    if nm == _current_mode:
        return

    if nm == 0:
        # -> RÉEL : init + reset + outputs LOW + epoch++
        try:
            spi = i_o_real.init_hardware()
            _reset_state_defaults(preserve_mode=0, write_hw=True)
            _state_epoch += 1
            print("✅ Passage en RÉEL (GPIO init + état reset + epoch++)")
        except Exception as e:
            print(f"⚠️ init_hardware failed: {e} — fallback SIMU")
            nm = 1
    else:
        # -> SIMU : libère
        try:
            i_o_real.cleanup(spi)
        except Exception:
            pass
        spi = None
        maj_etat("mode", 1)
        print("✅ Passage en SIMU (GPIO libérés)")

    _current_mode = nm
    maj_etat("mode", nm)
    _mode_changed_at = time.time() * 1000.0


@atexit.register
def _cleanup_all():
    if spi:
        i_o_real.cleanup(spi)
    # stop GPS thread si actif
    try:
        _gps_stop.set()
        if _gps_thread and _gps_thread.is_alive():
            _gps_thread.join(timeout=1.0)
    except Exception:
        pass


# ========== GPS LOOP (thread) ==========
def _gps_loop():
    """
    Lit gpsd (localhost:2947) en boucle et met à jour etat_global
    Clés mises à jour:
      gps_mode (0/1/2/3), gps_lat, gps_lon, gps_speed_kmh, gps_heading, gps_sats, gps_ts
    """
    if not GPS_ENABLED:
        return

    # Env optionnel pour désactiver le GPS facilement (ex: IO_DISABLE_GPS=1)
    if os.getenv("IO_DISABLE_GPS", "0") == "1":
        print("ℹ️ IO_DISABLE_GPS=1 → GPS désactivé.")
        return

    # Connexion gpsd
    while not _gps_stop.is_set():
        try:
            gpsd.connect(host="127.0.0.1", port=2947)
            print("✅ Connecté à gpsd 127.0.0.1:2947 (thread GPS)")
            break
        except Exception as e:
            print(f"⚠️ gpsd non joignable ({e}). Retry dans 2s…")
            if _gps_stop.wait(2.0):
                return

    # Lecture continue
    while not _gps_stop.is_set():
        try:
            p = gpsd.get_current()
            mode = int(p.mode or 0)
            maj_etat("gps_mode", mode)
            if mode >= 2:
                # lat/lon
                try:
                    lat = getattr(p, "lat", None)
                    lon = getattr(p, "lon", None)
                    if lat is not None:
                        maj_etat("gps_lat", float(lat))
                    if lon is not None:
                        maj_etat("gps_lon", float(lon))
                except Exception:
                    pass
                # speed m/s -> km/h
                try:
                    spd = getattr(p, "hspeed", 0.0) or 0.0
                    maj_etat("gps_speed_kmh", float(spd) * 3.6)
                except Exception:
                    pass
                # heading (track)
                try:
                    maj_etat("gps_heading", getattr(p, "track", None))
                except Exception:
                    pass
                # sats
                try:
                    sats = getattr(p, "sats", None)
                    maj_etat("gps_sats", len(sats) if sats else None)
                except Exception:
                    maj_etat("gps_sats", None)
            # timestamp
            maj_etat("gps_ts", time.time())

        except Exception:
            # Ne jamais crasher le thread GPS
            pass

        if _gps_stop.wait(0.2):
            break


def _start_gps_thread_once():
    global _gps_thread
    if not GPS_ENABLED:
        return
    if _gps_thread and _gps_thread.is_alive():
        return
    _gps_stop.clear()
    _gps_thread = threading.Thread(target=_gps_loop, daemon=True)
    _gps_thread.start()


# ========== WS handlers ==========
async def handle_message(message: str):
    global _mode_changed_at
    if message == '{"ping":1}':
        return

    data = json.loads(message)

    # 1) Switch prioritaire
    if "mode" in data:
        switch_mode(data["mode"])
        data.pop("mode", None)
        # Broadcast immédiat de l'état reset/epoch
        await _broadcast_state()
        return

    # 2) Fenêtre d'ignorance après switch (anti-rebond des vieux états front)
    now_ms = time.time() * 1000.0
    if (now_ms - _mode_changed_at) < _IGNORE_WINDOW_MS:
        return

    # 3) Traitement selon mode
    if _current_mode == 1:  # SIMU
        set_inputs_simulation(data)
        return

    # 4) RÉEL : sorties ONLY via i_o_real
    for key, val in data.items():
        if key in SORTIES_GPIO:
            try:
                if hasattr(i_o_real, "write_output"):
                    i_o_real.write_output(key, 1 if val else 0)
            except Exception as e:
                print(f"⚠️ write_output({key}) failed: {e}")
            finally:
                maj_etat(key, 1 if val else 0)


async def sync_reel():
    if _current_mode != 0:
        return
    for name in TOR_ENTREES:
        i_o_real.read_digital(name)
    for name in ANA_ENTREES:
        i_o_real.read_analog(name, spi)
    for name in SORTIES_GPIO:
        i_o_real.read_output(name)


async def handler(websocket, path):
    clients.add(websocket)
    try:
        async for message in websocket:
            await handle_message(message)
    finally:
        clients.discard(websocket)


async def main_loop():
    # démarre le thread GPS au lancement du serveur
    _start_gps_thread_once()

    async with websockets.serve(handler, "0.0.0.0", 5050):
        print("🟢 Serveur WebSocket sur ws://0.0.0.0:5050 (GPS inclus)")
        while True:
            if _current_mode == 0:
                await sync_reel()
            evaluate_grafcet()
            await _broadcast_state()
            await asyncio.sleep(0.2)


# ========== Entrée ==========
if __name__ == "__main__":
    # arrêt propre au Ctrl+C
    def _sigint(_sig, _frm):
        try:
            _gps_stop.set()
        except Exception:
            pass
        raise SystemExit(0)

    try:
        signal.signal(signal.SIGINT, _sigint)
    except Exception:
        pass

    asyncio.run(main_loop())
