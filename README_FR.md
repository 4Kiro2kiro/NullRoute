<p align="right">
  <a href="README.md">🇬🇧 Read in English</a>
</p>

<div align="center">

# NullRoute

**Méthodologie Pentest & CTF Interactive — 100% navigateur, zéro dépendance**

[![Made by 4Kiro2kiro](https://img.shields.io/badge/made%20by-4Kiro2kiro-blueviolet?style=flat-square)](https://github.com/4Kiro2kiro)
[![Live Demo](https://img.shields.io/badge/demo%20en%20ligne-GitHub%20Pages-brightgreen?style=flat-square)](https://4kiro2kiro.github.io/NullRoute/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-blue?style=flat-square)](docker-compose.yml)
[![Language: FR/EN](https://img.shields.io/badge/lang-FR%20%7C%20EN-orange?style=flat-square)](#)

</div>

---

## C'est quoi NullRoute ?

**NullRoute** est un outil pentest hors-ligne, auto-hébergé, qui tourne entièrement dans le navigateur.  
Il te guide à travers un arbre de décision — du premier scan de ports jusqu'à l'obtention des droits root — avec des commandes prêtes à l'emploi, des conseils, et un glossaire intégré. Le tout dans un seul onglet.

Pas d'internet requis. Pas de backend. Pas de compte. Tu ouvres et tu hack.

---

## Fonctionnalités

| | Fonctionnalité |
|---|---|
| 🌳 | **Arbre de décision** — 100+ nœuds couvrant Web, Réseau, PrivEsc, Active Directory, CTF, Forensics, Crypto, Reverse Engineering, et plus encore |
| ⚡ | **Commandes** — Commandes prêtes à l'emploi avec copie en un clic |
| 🎯 | **TARGET_IP** — Tape ton IP cible une fois, elle se remplace automatiquement dans toutes les commandes |
| 📚 | **Glossaire** — 70+ termes CTF/Pentest avec définitions, exemples, et références cliquables |
| 🐧 | **GTFOBins** — Browse 478 binaires Linux exploitables (Shell, Sudo, SUID, Capabilities, Lecture/Écriture de fichiers) |
| 🪟 | **LOLBAS** — Browse 235 binaires Windows légitimes pour téléchargement, exécution, et bypass de défenses |
| 💥 | **Payloads** — Listes de payloads organisées par type de vulnérabilité |
| 🗺️ | **Carte complète** — Vue d'ensemble visuelle de tous les nœuds et leurs catégories |
| 🔍 | **Recherche globale** — `Ctrl+K` pour chercher n'importe quel nœud, commande ou terme dans tout l'arbre |
| 🌐 | **Bilingue** — Interface complète Français / Anglais, switchable en un clic |

---

## Démo en ligne

**[https://4kiro2kiro.github.io/NullRoute/](https://4kiro2kiro.github.io/NullRoute/)**  
Hébergé gratuitement sur GitHub Pages — aucune installation, tu ouvres et c'est parti.

---

## Démarrage rapide

### Avec Docker (recommandé)

```bash
git clone https://github.com/4Kiro2kiro/NullRoute.git
cd NullRoute
docker compose up -d
```

Ouvre **http://localhost:8888** dans ton navigateur.

### Sans Docker

```bash
git clone https://github.com/4Kiro2kiro/NullRoute.git
cd NullRoute
# Ouvre index.html directement dans ton navigateur
```

> Aucune étape de build — c'est du HTML, CSS et JS vanilla pur.

---

## Structure du projet

```
NullRoute/
├── index.html                  # Point d'entrée
├── css/
│   └── style.css               # Thème sombre
├── js/
│   ├── app.js                  # Logique principale (navigation, rendu, recherche)
│   ├── i18n.js                 # Système de traduction FR/EN
│   ├── data.js                 # Nœuds principaux (~62 nœuds)
│   ├── data_extra.js           # Services étendus (LDAP, WinRM, Redis, AD…)
│   ├── data_ctf_techniques.js  # Techniques CTF (Stégo, Crypto, Pwn…)
│   ├── data_methodology.js     # Méthodologie pentest structurée
│   ├── data_cheatsheets.js     # Cheatsheets par catégorie
│   ├── data_advanced.js        # Exploitation avancée (Conteneurs, Cloud…)
│   ├── data_macos_web3.js      # Nœuds macOS & Web3
│   ├── docs.js                 # Glossaire (70+ termes) + rendu
│   ├── gtfobins.js             # Données GTFOBins + panel
│   ├── lolbas.js               # Données LOLBAS + panel
│   ├── payloads.js             # Listes de payloads + panel
│   └── panels.js               # Logique des panneaux latéraux
├── docker-compose.yml
├── Dockerfile
└── nginx.conf
```

---

## Sources & Crédits

NullRoute est construit sur la connaissance collective de la communauté sécurité.  
Les 7 projets open-source suivants constituent la colonne vertébrale de son contenu :

---

### 🐧 GTFOBins
> **[GTFOBins/GTFOBins.github.io](https://github.com/GTFOBins/GTFOBins.github.io)**

Une liste de binaires Unix pouvant être utilisés pour contourner les restrictions de sécurité locales dans des systèmes mal configurés. NullRoute intègre un browser offline interrogeable de toutes les entrées GTFOBins, filtrable par technique : Shell, Sudo, SUID, Capabilities, Lecture/Écriture de fichiers, Reverse Shell.

---

### 🪟 LOLBAS
> **[LOLBAS-Project/LOLBAS](https://github.com/LOLBAS-Project/LOLBAS)**

Living Off The Land Binaries, Scripts and Libraries — exécutables Windows légitimes pouvant être détournés à des fins malveillantes. NullRoute embarque un panel offline pour rechercher toutes les entrées LOLBAS par fonction : Execute, Download, Upload, Compile, Bypass…

---

### 💥 PayloadsAllTheThings
> **[swisskyrepo/PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings)**

Une liste exhaustive de payloads utiles et de techniques de bypass pour la sécurité des applications web et le pentest/CTF. NullRoute organise ces payloads par type de vulnérabilité (SQLi, XSS, SSTI, SSRF, XXE, LFI, Upload, Désérialisation…) dans un panel toujours accessible.

---

### 📖 HackTricks
> **[HackTricks-wiki/hacktricks](https://github.com/HackTricks-wiki/hacktricks)**

Le wiki pentest le plus complet d'internet, maintenu par [@carlospolop](https://github.com/carlospolop). HackTricks est la référence principale pour les techniques, descriptions d'attaques, et nœuds de méthodologie tout au long de l'arbre de décision NullRoute.

---

### 📋 Cheatsheet-God
> **[OlivierLaflamme/Cheatsheet-God](https://github.com/OlivierLaflamme/Cheatsheet-God)**

Une collection étendue de cheatsheets pentest couvrant les services réseau, Active Directory, l'exploitation web, et la post-exploitation. Le module cheatsheets de NullRoute s'inspire largement de ce travail.

---

### ⭐ Awesome Pentest
> **[enaqx/awesome-pentest](https://github.com/enaqx/awesome-pentest)**

Une collection triée de ressources, outils et frameworks de pentest. Utilisé comme référence pour la sélection et la catégorisation des outils dans NullRoute.

---

### 🎯 CTFs
> **[Adamkadaban/CTFs](https://github.com/Adamkadaban/CTFs)**

Un repo CTF bien organisé couvrant la crypto, le forensics, l'exploitation binaire, la stéganographie, et plus encore. Référencé pour les techniques et outillage spécifiques aux CTFs dans les nœuds de NullRoute.

---

## Auteur

**Gabriel Freiss** — [@4Kiro2kiro](https://github.com/4Kiro2kiro)  
Étudiant en tech passionné de cybersécurité — Paris 🇫🇷

---

## Licence

MIT — fais ce que tu veux, enlève juste pas les crédits.
