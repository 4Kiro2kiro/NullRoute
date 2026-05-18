#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

G='\033[0;32m'; C='\033[0;36m'; Y='\033[1;33m'; R='\033[0;31m'; N='\033[0m'

echo -e "${C}"
echo "  ██████╗████████╗███████╗    ██████╗ ██╗██████╗ ██╗     ███████╗"
echo " ██╔════╝╚══██╔══╝██╔════╝    ██╔══██╗██║██╔══██╗██║     ██╔════╝"
echo " ██║        ██║   █████╗      ██████╔╝██║██████╔╝██║     █████╗  "
echo " ██║        ██║   ██╔══╝      ██╔══██╗██║██╔══██╗██║     ██╔══╝  "
echo " ╚██████╗   ██║   ██║         ██████╔╝██║██████╔╝███████╗███████╗"
echo "  ╚═════╝   ╚═╝   ╚═╝         ╚═════╝ ╚═╝╚═════╝ ╚══════╝╚══════╝"
echo -e "${N}"
echo -e " ${Y}Guide Interactif Pentest / CTF  —  Docker Edition${N}"
echo ""

# ── Vérifier Docker ────────────────────────────────────────────────────────────
if ! command -v docker &>/dev/null; then
    echo -e " ${R}[ERR]${N} Docker non trouvé. Installe-le avec : sudo apt install docker.io"
    exit 1
fi

# ── Activer Docker au démarrage ────────────────────────────────────────────────
echo -e " ${Y}[~]${N}  Activation Docker au démarrage..."
sudo systemctl enable docker 2>/dev/null && echo -e " ${G}[OK]${N}  Docker persistant au reboot" || echo -e " ${Y}[!]${N}  Activation manuelle requise"

# ── Démarrer le service Docker si pas actif ────────────────────────────────────
if ! sudo systemctl is-active --quiet docker 2>/dev/null; then
    echo -e " ${Y}[~]${N}  Démarrage du service Docker..."
    sudo systemctl start docker
fi

# ── Construire et lancer le container ─────────────────────────────────────────
echo -e " ${Y}[~]${N}  Construction de l'image CTF Bible..."
cd "$DIR"
docker compose build --quiet 2>/dev/null || docker-compose build --quiet 2>/dev/null

echo -e " ${Y}[~]${N}  Lancement du container (persistant)..."
docker compose up -d 2>/dev/null || docker-compose up -d 2>/dev/null

# Attendre que le container soit prêt
for i in {1..15}; do
    sleep 0.5
    if curl -s "http://localhost:8888" &>/dev/null; then break; fi
done

URL="http://localhost:8888"
echo -e " ${G}[OK]${N}  CTF Bible disponible : ${C}$URL${N}"
echo -e " ${G}[OK]${N}  Container persistant — survit aux redémarrages"
echo ""

# ── Ouvrir le navigateur ───────────────────────────────────────────────────────
if command -v xdg-open &>/dev/null; then
    xdg-open "$URL" &>/dev/null &
elif command -v firefox &>/dev/null; then
    firefox "$URL" &>/dev/null &
elif command -v chromium &>/dev/null; then
    chromium "$URL" &>/dev/null &
elif command -v google-chrome &>/dev/null; then
    google-chrome "$URL" &>/dev/null &
else
    echo -e " ${Y}[!]${N}  Ouvre manuellement : $URL"
fi

echo -e " ${Y}[~]${N}  Lance ${C}./stop.sh${N} pour tout stopper et désactiver la persistance"
echo ""
