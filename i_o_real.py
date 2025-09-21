# =============================
# 📁 i_o_real.py — SAFE version
# =============================
import os

USE_GPIO = os.getenv("IO_DISABLE", "0") != "1"  # IO_DISABLE=1 => force no-GPIO

# Try import RPi.GPIO
GPIO = None
if USE_GPIO:
    try:
        import RPi.GPIO as _GPIO
        GPIO = _GPIO
    except Exception as e:
        print(f"⚠️  GPIO indisponible ({e}). Backend en NO-OP.")
        GPIO = None
else:
    print("ℹ️  IO_DISABLE=1 → GPIO désactivé (no-op).")
    GPIO = None

class DummySPI:
    def close(self): pass

def init_hardware():
    """
    Initialise les GPIO si dispo. En cas d'échec, ne crash jamais.
    """
    if GPIO is None:
        print("ℹ️  init_hardware: pas de GPIO → no-op.")
        return None
    try:
        GPIO.setmode(GPIO.BCM)
        GPIO.setwarnings(False)
        from config_io import TOR_ENTREES, SORTIES_GPIO
        # Entrées TOR
        for _, pin in TOR_ENTREES.items():
            GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
        # Sorties
        for _, pin in SORTIES_GPIO.items():
            GPIO.setup(pin, GPIO.OUT)
            GPIO.output(pin, GPIO.LOW)
        print("✅ GPIO initialisés.")
        return DummySPI()  # remplace par ton objet SPI réel si tu branches un MCP3008
    except Exception as e:
        print(f"⚠️  init_hardware: échec init GPIO ({e}). Mode no-op.")
        return None

def cleanup(spi):
    if GPIO:
        try:
            GPIO.cleanup()
        except Exception:
            pass
    if spi and hasattr(spi, "close"):
        try:
            spi.close()
        except Exception:
            pass

def read_digital(name):
    if GPIO is None:
        return 0
    try:
        from config_io import TOR_ENTREES
        pin = TOR_ENTREES[name]
        return 1 if GPIO.input(pin) else 0
    except Exception:
        return 0

def read_analog(name, spi):
    # TODO: implémenter MCP3008 si présent. Valeur neutre pour l'instant.
    return 0.0

def read_output(name):
    if GPIO is None:
        return 0
    try:
        from config_io import SORTIES_GPIO
        _ = SORTIES_GPIO[name]
        # RPi.GPIO n'a pas de readback d'output. Retour neutre.
        return 0
    except Exception:
        return 0

def write_output(name, value):
    """
    Ecrit une sortie GPIO si dispo, sinon no-op. Jamais de crash.
    """
    if GPIO is None:
        return
    try:
        from config_io import SORTIES_GPIO
        pin = SORTIES_GPIO[name]
        GPIO.output(pin, GPIO.HIGH if value else GPIO.LOW)
    except Exception as e:
        print(f"⚠️ write_output({name}) failed: {e}")
