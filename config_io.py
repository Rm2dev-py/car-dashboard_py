# =============================
# 📁 config_io.py
# =============================

# === TOR (Entrées) ===
TOR_ENTREES = {
    "contact": 4,
    "frein": 17,
    "cligno_g": 27,
    "cligno_d": 22,
    "warning": 5,
    "feux_code": 6,
    "feux_route": 13,
    "essuie_glace": 19,
    "Oil": 26,
    "marche_arriere": 21,
    "ceinture": 9,
    "antibrouillard": 11,
    "antibrouillardarr": 7,
}

# === ANA (via MCP3008) ===
ANA_ENTREES = {
    "temp_moteur": 0,
    "niveau_carbu": 1,
    "batt_voltage": 2,
    "vitesse": 3,
    "rpm_moteur": 4,
}

# === GPIO sorties ===
SORTIES_GPIO = {
    "led_etat": 18,
    "buzzer": 23,
    "voyant_frein": 24,
    "voyant_batterie": 25,
    "voyant_temp": 12,
    "voyant_cligno_g": 16,
    "voyant_cligno_d": 20,
    "voyant_warning": 8,
    "voyant_code": 7,
    "voyant_pleinphare": 14,
    "voyant_ceinture": 15,
    "voyant_antibrouillard": 10,
    "voyant_antibrouillard_arr": 6,
}

# === États initiaux ===
ETATS_SIMULES_INITIAUX = {
    # TOR
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

    # ANA
    "temp_moteur": 0,
    "niveau_carbu": 0,
    "batt_voltage": 0,
    "vitesse": 0,
    "rpm_moteur": 0,

    # GPIO OUT
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

    # Mode global — RÉEL PAR DÉFAUT
    "mode": 1,  # 0 = REEL, 1 = SIMU
}
