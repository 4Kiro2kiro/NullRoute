<p align="right">
  <a href="README_FR.md">🇫🇷 Lire en Français</a>
</p>

<div align="center">

# NullRoute

**Interactive Pentest & CTF Methodology: Browser-based, zero dependencies**

[![Made by 4Kiro2kiro](https://img.shields.io/badge/made%20by-4Kiro2kiro-blueviolet?style=flat-square)](https://github.com/4Kiro2kiro)
[![Live Demo](https://img.shields.io/badge/live%20demo-GitHub%20Pages-brightgreen?style=flat-square)](https://4kiro2kiro.github.io/NullRoute/)
[![License: MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![Docker](https://img.shields.io/badge/docker-ready-blue?style=flat-square)](docker-compose.yml)
[![Language: FR/EN](https://img.shields.io/badge/lang-FR%20%7C%20EN-orange?style=flat-square)](#)

</div>

## What is NullRoute?

**NullRoute** is an offline, self-hosted pentest companion running entirely in the browser.
It guides you through a decision tree from the first port scan to root: with commands, tips, and a built-in glossary: all in one tab.

No internet required. No backend. No account. Just open and hack.

## Features

| | Feature |
|---|---|
| 🌳 | **Decision tree**: 100+ nodes covering Web, Network, PrivEsc, Active Directory, CTF, Forensics, Crypto, Reverse Engineering, and more |
| ⚡ | **Commands**: Ready-to-use commands with one-click copy |
| 🎯 | **TARGET_IP**: Type your target IP once, it replaces itself in every command automatically |
| 📚 | **Glossary**: 70+ CTF/Pentest terms with definitions, examples, and clickable references |
| 🐧 | **GTFOBins**: Browse 478 exploitable Linux binaries (Shell, Sudo, SUID, Capabilities, File Read/Write) |
| 🪟 | **LOLBAS**: Browse 235 legitimate Windows binaries for download, execution, and defense bypass |
| 💥 | **Payloads**: Curated payload lists organized by vulnerability type |
| 🗺️ | **Full Map**: Visual overview of all nodes and categories |
| 🔍 | **Global Search**: `Ctrl+K` to search any node, command, or term across the whole tree |
| 🌐 | **Bilingual**: Full French / English interface, switchable in one click |

## Live Demo

**[https://4kiro2kiro.github.io/NullRoute/](https://4kiro2kiro.github.io/NullRoute/)**
Hosted for free on GitHub Pages: no install needed, just open and use.

## Getting Started

### With Docker (recommended)

```bash
git clone https://github.com/4Kiro2kiro/NullRoute.git
cd NullRoute
docker compose up -d
```

Open **http://localhost:8888** in your browser.

### Without Docker

```bash
git clone https://github.com/4Kiro2kiro/NullRoute.git
cd NullRoute
# Open index.html directly in your browser
```

> No build step needed: it's pure HTML, CSS, and vanilla JS.

## Project Structure

```
NullRoute/
├── index.html                  # Entry point
├── css/
│   └── style.css               # Dark theme styling
├── js/
│   ├── app.js                  # Core app logic (navigation, rendering, search)
│   ├── i18n.js                 # FR/EN translation system
│   ├── data.js                 # Core decision tree nodes (~62 nodes)
│   ├── data_extra.js           # Extended services (LDAP, WinRM, Redis, AD…)
│   ├── data_ctf_techniques.js  # CTF-specific techniques (Stego, Crypto, Pwn…)
│   ├── data_methodology.js     # Structured pentest methodology
│   ├── data_cheatsheets.js     # Command cheatsheets by category
│   ├── data_advanced.js        # Advanced exploitation (Container, Cloud…)
│   ├── data_macos_web3.js      # macOS & Web3 nodes
│   ├── docs.js                 # Glossary (70+ terms) + rendering
│   ├── gtfobins.js             # GTFOBins data + panel
│   ├── lolbas.js               # LOLBAS data + panel
│   ├── payloads.js             # Payload lists + panel
│   └── panels.js               # Side panel logic
├── docker-compose.yml
├── Dockerfile
└── nginx.conf
```

## Sources & Credits

NullRoute is built on top of the collective knowledge of the security community.
The following 7 open-source projects are the backbone of its content:

### 🐧 GTFOBins
> **[GTFOBins/GTFOBins.github.io](https://github.com/GTFOBins/GTFOBins.github.io)**

A curated list of Unix binaries that can be used to bypass local security restrictions in misconfigured systems. NullRoute embeds a fully searchable offline browser of all GTFOBins entries, filterable by technique: Shell, Sudo, SUID, Capabilities, File Read, File Write, Reverse Shell.

### 🪟 LOLBAS
> **[LOLBAS-Project/LOLBAS](https://github.com/LOLBAS-Project/LOLBAS)**

Living Off The Land Binaries, Scripts and Libraries: legitimate Windows executables that can be abused for malicious purposes. NullRoute ships an offline panel to search all LOLBAS entries by function: Execute, Download, Upload, Compile, Bypass…

### 💥 PayloadsAllTheThings
> **[swisskyrepo/PayloadsAllTheThings](https://github.com/swisskyrepo/PayloadsAllTheThings)**

A comprehensive list of useful payloads and bypass techniques for web application security and pentest/CTF. NullRoute organizes these payloads by vulnerability type (SQLi, XSS, SSTI, SSRF, XXE, LFI, File Upload, Deserialization…) in a dedicated always-accessible panel.

### 📖 HackTricks
> **[HackTricks-wiki/hacktricks](https://github.com/HackTricks-wiki/hacktricks)**

The most comprehensive pentest wiki on the internet, maintained by [@carlospolop](https://github.com/carlospolop). HackTricks is the primary reference for techniques, attack descriptions, and methodology nodes throughout NullRoute's decision tree.

### 📋 Cheatsheet-God
> **[OlivierLaflamme/Cheatsheet-God](https://github.com/OlivierLaflamme/Cheatsheet-God)**

An extensive collection of pentest cheatsheets covering network services, Active Directory, web exploitation, and post-exploitation. NullRoute's cheatsheet module is heavily inspired by and references this work.

### ⭐ Awesome Pentest
> **[enaqx/awesome-pentest](https://github.com/enaqx/awesome-pentest)**

A curated collection of awesome penetration testing resources, tools, and frameworks. Used as a reference for tool selection and categorization throughout NullRoute.

### 🎯 CTFs
> **[Adamkadaban/CTFs](https://github.com/Adamkadaban/CTFs)**

A well-organized CTF reference repository covering crypto, forensics, binary exploitation, steganography, and more. Referenced for CTF-specific techniques and tooling in NullRoute's CTF nodes.

## Author

**Gabriel Freiss**: [@4Kiro2kiro](https://github.com/4Kiro2kiro)
19 y/o tech student, passionate about cybersecurity: Paris 🇫🇷

## License

MIT: do whatever you want, just don't remove the credits.
