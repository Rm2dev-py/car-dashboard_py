# =============================
# 📁 grafcet.py
# =============================

from etat_global import get_etat, maj_etat

ASSOCIATIONS_IO = {
    "contact": "led_etat",
    "frein": "voyant_frein",
    "cligno_g": "voyant_cligno_g",
    "cligno_d": "voyant_cligno_d",
    "warning": "voyant_warning",
    "feux_code": "voyant_code",
    "feux_route": "voyant_pleinphare",
    "Oil": "voyant_oil",
    "essuie_glace": "voyant_temp",
    "marche_arriere": "voyant_batterie",
    "ceinture": "voyant_ceinture",
    "antibrouillard": "voyant_antibrouillard",
    "antibrouillardarr": "voyant_antibrouillard_arr"

}

def evaluate_grafcet():
    etat = get_etat()

    # ✅ 1. Logique clignotants (priorité warning)
    if int(etat.get("warning", 0)) == 1:
        maj_etat("voyant_cligno_g", 1)
        maj_etat("voyant_cligno_d", 1)
    else:
        maj_etat("voyant_cligno_g", int(etat.get("cligno_g", 0)))
        maj_etat("voyant_cligno_d", int(etat.get("cligno_d", 0)))

    # ✅ 2. Réplication automatique des autres associations
    for entree, sortie in ASSOCIATIONS_IO.items():
        if sortie not in ["voyant_cligno_g", "voyant_cligno_d"]:
            val_entree = etat.get(entree, 0)
            if etat.get(sortie) != val_entree:
                maj_etat(sortie, val_entree)
