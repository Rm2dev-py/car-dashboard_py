# =============================
# 📁 simu.py
# =============================

from config_io import TOR_ENTREES, ANA_ENTREES
from etat_global import maj_etat, get_etat

# 🔁 Vérifie si le mode actuel est simulation (1 = SIMU)
def en_mode_simulation():
    return get_etat().get("mode", 1) == 1

# 🧠 Mise à jour des entrées uniquement
def set_inputs_simulation(data):
    for key, val in data.items():
        if key == "mode":
            maj_etat("mode", val)
            print(f"🔄 Mode changé → {'SIMU' if val == 1 else 'REEL'}")
            continue

        if key in TOR_ENTREES or key in ANA_ENTREES:
            maj_etat(key, val)
            print(f"✏️ Entrée simulée mise à jour : {key} = {val}")