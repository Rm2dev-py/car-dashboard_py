# =============================
# 📁 main_ws.py (remplace main.py)
# =============================

# main_ws.py (extrait corrigé)

import asyncio
import json
import websockets
import atexit

from simu import set_inputs_simulation, en_mode_simulation
import i_o_real
from grafcet import evaluate_grafcet
from etat_global import get_etat, maj_etat
from config_io import SORTIES_GPIO

clients = set()
spi = None
if not en_mode_simulation():
    spi = i_o_real.init_hardware()

@atexit.register
def cleanup():
    if spi:
        i_o_real.cleanup(spi)

async def handle_message(message):
    data = json.loads(message)
    if en_mode_simulation():
        set_inputs_simulation(data)
    else:
        for key, val in data.items():
            if key in SORTIES_GPIO:
                import RPi.GPIO as GPIO
                GPIO.setmode(GPIO.BCM)
                GPIO.setup(SORTIES_GPIO[key], GPIO.OUT)
                GPIO.output(SORTIES_GPIO[key], val)
                maj_etat(key, val)

async def sync_reel():
    from config_io import TOR_ENTREES, ANA_ENTREES, SORTIES_GPIO
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
        clients.remove(websocket)

async def main_loop():
    async with websockets.serve(handler, "0.0.0.0", 5050):
        print("🟢 Serveur WebSocket sur ws://0.0.0.0:5050")
        while True:
            if not en_mode_simulation():
                await sync_reel()
            evaluate_grafcet()
            state = get_etat()
            for client in clients:
                await client.send(json.dumps(state))
            await asyncio.sleep(0.2)

if __name__ == "__main__":
    asyncio.run(main_loop())
