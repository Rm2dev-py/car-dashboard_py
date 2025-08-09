# =============================
# 📁 i_o_real.py
# =============================

import RPi.GPIO as GPIO
import spidev
from config_io import TOR_ENTREES, ANA_ENTREES, SORTIES_GPIO
from etat_global import maj_etat

# 🧰 Initialisation complète du matériel GPIO + SPI
def init_hardware():
    GPIO.setmode(GPIO.BCM)

    for name, pin in TOR_ENTREES.items():
        GPIO.setup(pin, GPIO.IN)

    for name, pin in SORTIES_GPIO.items():
        GPIO.setup(pin, GPIO.OUT)

    spi = spidev.SpiDev()
    spi.open(0, 0)
    spi.max_speed_hz = 1350000
    return spi

def read_digital(name):
    pin = TOR_ENTREES[name]
    val = GPIO.input(pin)
    maj_etat(name, val)
    return val

def read_analog(name, spi):
    channel = ANA_ENTREES[name]
    cmd = 0b11 << 6 | (channel & 0x07) << 3
    resp = spi.xfer2([cmd, 0, 0])
    value = ((resp[1] & 0x0F) << 8) | resp[2]
    maj_etat(name, value)
    return value

def read_output(name):
    pin = SORTIES_GPIO[name]
    val = GPIO.input(pin)
    maj_etat(name, val)
    return val

def cleanup(spi):
    if spi:
        spi.close()
    GPIO.cleanup()