# =============================
# 📁 etat_global.py
# =============================

from config_io import ETATS_SIMULES_INITIAUX

# 🧠 Dictionnaire centralisé partagé entre tous les modules
etat_courant = ETATS_SIMULES_INITIAUX.copy()

# ✅ Getter de l'état actuel
def get_etat():
    return etat_courant

# ✅ Setter sur une ou plusieurs variables
def maj_etat(cle, valeur):
    etat_courant[cle] = valeur

# ✅ Setter complet si nécessaire
def remplacer_etat(d):
    etat_courant.clear()
    etat_courant.update(d)
