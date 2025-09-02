# config_io.py

# === TOR (Tout ou Rien) - Entrées ===
TOR_ENTREES = {
    "contact": 4,             # GPIO4  - Pin 7
    "frein": 17,              # GPIO17 - Pin 11
    "cligno_g": 27,           # GPIO27 - Pin 13
    "cligno_d": 22,           # GPIO22 - Pin 15
    "warning": 5,             # GPIO5  - Pin 29
    "feux_code": 6,           # GPIO6  - Pin 31
    "feux_route": 13,         # GPIO13 - Pin 33
    "essuie_glace": 19,       # GPIO19 - Pin 35
    "Oil": 26,                # GPIO26 - Pin 37
    "marche_arriere": 21,     # GPIO21 - Pin 40
    "ceinture": 9,            # GPIO9  - Pin 21
    "antibrouillard": 11,     # GPIO11 - Pin 23
    "antibrouillardarr": 7    # GPIO7  - Pin 26


}

# === ANA - Entrées analogiques via MCP3008 (canaux 0 à 7) ===
ANA_ENTREES = {
    "temp_moteur": 0,         # Canal 0 - sonde température
    "niveau_carbu": 1,        # Canal 1 - jauge carburant
    "batt_voltage": 2,        # Canal 2 - tension batterie
    "vitesse": 3,             # Canal 3 - capteur de vitesse
    "rpm_moteur": 4           # Canal 4 - régime moteur
}

# === GPIO - Sorties TOR (voyants, LED, buzzer, etc.) ===
SORTIES_GPIO = {
    "led_etat": 18,           # GPIO18 - Pin 12
    "buzzer": 23,             # GPIO23 - Pin 16
    "voyant_frein": 24,       # GPIO24 - Pin 18
    "voyant_batterie": 25,    # GPIO25 - Pin 22
    "voyant_temp": 12,        # GPIO12 - Pin 32
    "voyant_cligno_g": 16,    # GPIO16 - Pin 36
    "voyant_cligno_d": 20,    # GPIO20 - Pin 38
    "voyant_warning": 8,      # GPIO8  - Pin 24
    "voyant_code": 7,         # GPIO7  - Pin 26
    "voyant_pleinphare": 14,   # GPIO14 - Pin 8
    "voyant_ceinture": 15,       # GPIO15 - Pin 10
    "voyant_antibrouillard": 10,  # GPIO10 - Pin 19
    "voyant_antibrouillard_arr": 6  # GPIO6 - Pin 31 (ajouté)

}

# === États simulés initiaux (TOR + ANA + GPIO + mode) ===
ETATS_SIMULES_INITIAUX = {
    # Entrées TOR
    "contact": 0,
    "frein": 0,
    "cligno_g": 0,
    "cligno_d": 0,
    "warning": 0,
    "feux_code": 0,
    "feux_route": 0,
    "essuie_glace": 0,
    "klaxon": 0,
    "marche_arriere": 0,
    "voyant_ceinture": 0,
    "voyant_antibrouillard": 0,
    "voyant_antibrouillard_arr": 0,
    "voyant_oil": 0,

    # Entrées analogiques
    "temp_moteur": 0,
    "niveau_carbu": 0,
    "batt_voltage": 0,
    "vitesse": 0,
    "rpm_moteur": 0,

    # Sorties GPIO
    "led_etat": 0,
    "buzzer": 0,
    "voyant_frein": 0,
    "voyant_batterie": 0,
    "voyant_temp": 0,
    "voyant_cligno_g": 0,
    "voyant_cligno_d": 0,
    "voyant_warning": 0,
    "voyant_code": 0,
    "voyant_pleinphare": 0,
    "voyant_ceinture": 0,
    "voyant_antibrouillard": 0,
    "voyant_antibrouillard_arr": 0,

    # Mode global
    "mode": 1  # 1 = SIMU, 0 = REEL
}
