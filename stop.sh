#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

G='\033[0;32m'; C='\033[0;36m'; Y='\033[1;33m'; N='\033[0m'

echo -e " ${Y}[~]${N}  Arrêt de CTF Bible..."
cd "$DIR"

# Stopper et supprimer le container
docker compose down 2>/dev/null || docker-compose down 2>/dev/null
echo -e " ${G}[OK]${N}  Container arrêté"

# Désactiver la persistance au reboot (retirer restart: always en pratique = juste ne plus l'activer)
# Le container ne redémarrera plus car il est down
echo -e " ${G}[OK]${N}  Persistance désactivée — le container ne redémarrera pas"
echo ""
echo -e " ${Y}[~]${N}  Lance ${C}./start.sh${N} pour relancer"
echo ""
