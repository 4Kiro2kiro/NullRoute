// ─── CTF Bible — Reversing Avancé & Mobile Pentesting ────────────────────────
// Sources: HackTricks (reversing-tools-basic-methods, angr, z3, common-api-malware,
//          android-app-pentesting, android-anti-instrumentation-ssl-pinning-bypass,
//          ios-pentesting)

Object.assign(NODES, {

  // ── REVERSING AVANCÉ ──────────────────────────────────────────────────────────
  "reversing_advanced": {
    id: "reversing_advanced", title: "Reversing Avancé (angr / Frida / Z3)", title_en: "Advanced Reversing (angr / Frida / Z3)", category: "ctf", icon: "🔬",
    description: "Outils RE avancés: Ghidra scripts, angr symbolic execution, Frida dynamic instrumentation, Z3/SMT solver, YARA, anti-debug bypass, MBA obfuscation.",
    description_en: "Advanced RE tools: Ghidra scripts, angr symbolic execution, Frida dynamic instrumentation, Z3/SMT solver, YARA, anti-debug bypass, MBA obfuscation.",
    commands: [
      { label: "angr — installer et charger un binaire", label_en: "angr — install and load a binary", cmd: "pip install angr\npython3 -c \"\nimport angr\nproj = angr.Project('./binary')\nprint(proj.arch.name, hex(proj.entry))\n\"" },
      { label: "angr — exécution symbolique (trouver un input valide)", label_en: "angr — symbolic execution (find a valid input)", cmd: "python3 << 'EOF'\nimport angr\nproj = angr.Project('./binary', auto_load_libs=False)\nstate = proj.factory.entry_state()\nsimgr = proj.factory.simulation_manager(state)\n# Aller vers l'adresse de succès, éviter l'adresse d'échec\nsimgr.explore(find=0x4007f0, avoid=0x400780)\nif simgr.found:\n    print(simgr.found[0].posix.dumps(0))\nEOF" },
      { label: "angr — appeler une fonction précise", label_en: "angr — call a specific function", cmd: "python3 << 'EOF'\nimport angr, claripy\nproj = angr.Project('./binary', auto_load_libs=False)\narg = claripy.BVS('arg', 8*20)  # 20 bytes symboliques\nstate = proj.factory.call_state(0x401234, arg)\nsimgr = proj.factory.simulation_manager(state)\nsimgr.run()\nEOF" },
      { label: "Z3 — résoudre des contraintes (CTF crypto/rev)", label_en: "Z3 — solve constraints (CTF crypto/rev)", cmd: "python3 << 'EOF'\nfrom z3 import *\nx = BitVec('x', 32)\ny = BitVec('y', 32)\ns = Solver()\ns.add(x + y == 0x1337)\ns.add(x * 2 == y)\nif s.check() == sat:\n    m = s.model()\n    print('x =', m[x], 'y =', m[y])\nEOF" },
      { label: "Z3 — vérifier une équation booléenne", label_en: "Z3 — verify a boolean equation", cmd: "python3 << 'EOF'\nfrom z3 import *\nx = Bool('x'); y = Bool('y'); z = Bool('z')\ns = Solver()\ns.add(And(Or(x, y, Not(z)), y))\nprint(s.check())  # sat\nprint(s.model())\nEOF" },
      { label: "Frida — hooker une fonction native (Linux/Android)", label_en: "Frida — hook a native function (Linux/Android)", cmd: "# Attacher à un process\nfrida -U -f com.example.app -l hook.js\n\n# hook.js :\n# Interceptor.attach(Module.findExportByName(null, 'strcmp'), {\n#   onEnter: function(args) {\n#     console.log('strcmp:', args[0].readUtf8String(), args[1].readUtf8String());\n#   }\n# });" },
      { label: "Frida — lire/écrire la mémoire d'un process", label_en: "Frida — read/write a process's memory", cmd: "# Lire 16 octets à une adresse\nvar addr = ptr('0x401234');\nconsole.log(hexdump(addr, { length: 16 }));\n// Patcher une instruction (NOP)\nMemory.patchCode(addr, 1, function(code) {\n  code.writeU8(0x90);  // NOP\n});" },
      { label: "CoBRA — simplifier de l'obfuscation MBA", label_en: "CoBRA — simplify MBA obfuscation", cmd: "pip install cobra-cli\n# Simplifier une expression MBA\ncobra-cli --mba \"(x&y)+(x|y)\"\n# => x + y\n\n# Avec vérification Z3 et largeur de bits\ncobra-cli --mba \"(a^b)+(a&b)+(a&b)\" --bitwidth 32 --verify" },
      { label: "YARA — créer et scanner une règle", label_en: "YARA — create and scan a rule", cmd: "# Règle YARA basique\ncat > rule.yar << 'EOF'\nrule Detect_Flag {\n  strings:\n    $s1 = \"CTF{\" ascii\n    $s2 = { 43 54 46 7B }  // CTF{ en hex\n  condition:\n    any of them\n}\nEOF\nyara rule.yar ./binary\nyara -r rule.yar ./directory/" },
      { label: "Anti-debug bypass — ptrace classique (Linux)", label_en: "Anti-debug bypass — classic ptrace (Linux)", cmd: "# Patcher le binaire pour ignorer ptrace anti-debug\n# Dans GDB :\n# catch syscall ptrace\n# commands\n# set ($rax) = 0\n# continue\n# end\n\n# Avec Frida :\n# Interceptor.attach(Module.findExportByName(null, 'ptrace'), {\n#   onLeave: function(ret) { ret.replace(0); }\n# });" },
      { label: "Ghidra — script Python pour automatiser l'analyse", label_en: "Ghidra — Python script to automate analysis", cmd: "# Dans Ghidra Script Manager (Window > Script Manager)\n# New Script > Python\n\n# Exemple : lister toutes les fonctions\nfm = currentProgram.getFunctionManager()\nfor func in fm.getFunctions(True):\n    print(func.getName(), func.getEntryPoint())" },
      { label: "demovfuscator — désofusquer mov-only binary", label_en: "demovfuscator — deobfuscate mov-only binary", cmd: "apt-get install libcapstone-dev libz3-dev\n# compiler demovfuscator depuis github.com/kirschju/demovfuscator\n./demovfuscator -o output_binary movfuscated_binary" }
    ],
    lookfor: [
      "Boucles de vérification d'input → candidat parfait pour angr (find/avoid)",
      "Comparaisons binaires complexes → Z3 BitVec pour résoudre les contraintes",
      "Appels ptrace/IsDebuggerPresent → anti-debug à bypasser",
      "Expressions MBA dans le décompilateur → CoBRA pour simplifier",
      "Strings encodées / XOR → FLOSS ou Frida pour dumper à runtime"
    ],
    lookfor_en: [
      "Input verification loops → perfect candidate for angr (find/avoid)",
      "Complex binary comparisons → Z3 BitVec to solve constraints",
      "ptrace/IsDebuggerPresent calls → anti-debug to bypass",
      "MBA expressions in the decompiler → CoBRA to simplify",
      "Encoded strings / XOR → FLOSS or Frida to dump at runtime"
    ],
    tips: [
      "angr : toujours utiliser auto_load_libs=False pour éviter de charger toutes les libc",
      "Z3 : utiliser BitVec (pas Int) pour les calculs sur registres (overflow modular correct)",
      "Frida : préférer -f (spawn) à -n (attach) pour hooker dès le démarrage",
      "CoBRA : spécifier --bitwidth explicitement quand l'expression vient de registres 32/64 bits",
      "Pour les binaires Rust : chercher ::main dans Ghidra, les noms de fonctions sont verbeux mais informatifs"
    ],
    tips_en: [
      "angr: always use auto_load_libs=False to avoid loading all libc",
      "Z3: use BitVec (not Int) for register calculations (correct modular overflow)",
      "Frida: prefer -f (spawn) over -n (attach) to hook from startup",
      "CoBRA: explicitly specify --bitwidth when the expression comes from 32/64-bit registers",
      "For Rust binaries: look for ::main in Ghidra, function names are verbose but informative"
    ],
    choices: [
      { label: "Flag trouvé !", label_en: "Flag found!", next: "flag_found", icon: "🏁" },
      { label: "Analyse de malware", label_en: "Malware Analysis", next: "reversing_malware", icon: "🦠" },
      { label: "Pentest Android", label_en: "Android Pentesting", next: "android_pentest", icon: "🤖" }
    ]
  },

  // ── ANALYSE DE MALWARE ────────────────────────────────────────────────────────
  "reversing_malware": {
    id: "reversing_malware", title: "Analyse de Malware", title_en: "Malware Analysis", category: "ctf", icon: "🦠",
    description: "Analyse de malware: WinAPI communs (networking, persistence, stealth), sandbox evasion, FLOSS, PE analysis, dynamic analysis avec x64dbg/Frida.",
    description_en: "Malware analysis: common WinAPI (networking, persistence, stealth), sandbox evasion, FLOSS, PE analysis, dynamic analysis with x64dbg/Frida.",
    commands: [
      { label: "FLOSS — extraire les strings obfusquées", label_en: "FLOSS — extract obfuscated strings", cmd: "# FLOSS : FLARE Obfuscated String Solver\npip install flare-floss\nfloss malware.exe\nfloss --no-static malware.exe  # seulement dynamic/stack strings" },
      { label: "PE analysis — examiner les imports/sections", label_en: "PE analysis — inspect imports/sections", cmd: "# Avec pestudio (Windows) ou pefile (Python)\npip install pefile\npython3 -c \"\nimport pefile\npe = pefile.PE('malware.exe')\nfor entry in pe.DIRECTORY_ENTRY_IMPORT:\n    print(entry.dll.decode())\n    for imp in entry.imports:\n        print(' ', imp.name)\n\"" },
      { label: "APKiD — identifier packer/obfuscateur", label_en: "APKiD — identify packer/obfuscator", cmd: "pip install apkid\napkid malware.apk\napkid malware.exe  # fonctionne aussi sur PE" },
      { label: "scdbg — analyser un shellcode statiquement", label_en: "scdbg — statically analyze a shellcode", cmd: "scdbg.exe -f shellcode          # info de base\nscdbg.exe -f shellcode -r       # rapport d'analyse\nscdbg.exe -f shellcode -d       # dump shellcode décodé\nscdbg.exe -f shellcode /findsc  # trouver l'offset de départ" },
      { label: "x64dbg — analyser un DLL malveillant", label_en: "x64dbg — analyze a malicious DLL", cmd: "# 1. Charger rundll32.exe dans x64dbg\n# 2. File > Change Command Line :\n#    C:\\Windows\\SysWOW64\\rundll32.exe malware.dll,DLLMain\n# 3. Options > Settings > cocher 'DLL Entry'\n# 4. F9 pour run, s'arrête à DllMain\n# 5. Poser des breakpoints sur les fonctions suspectes" },
      { label: "Blobrunner — déboguer un shellcode", label_en: "Blobrunner — debug a shellcode", cmd: "# 1. Lancer Blobrunner avec le shellcode\nblobrunner.exe shellcode.bin\n# 2. Note l'adresse mémoire affichée\n# 3. Attacher x64dbg au process blobrunner\n# 4. Poser un breakpoint à l'adresse indiquée\n# 5. F9 pour exécuter le shellcode" },
      { label: "WinAPI — détecter comportements réseau malveillants", label_en: "WinAPI — detect malicious network behavior", cmd: "# APIs réseau suspectes à surveiller :\n# WSAStartup, connect, recv, send\n# InternetOpen, InternetOpenUrl, InternetReadFile\n# WinHttpOpen, WinHttpConnect\n\n# Avec Procmon (Sysinternals) : filtrer sur Process Name = malware.exe\n# Avec Wireshark : capturer tout le trafic" },
      { label: "WinAPI — détecter persistance/injection", label_en: "WinAPI — detect persistence/injection", cmd: "# Persistance :\n# RegCreateKeyEx, RegSetValueEx → clés Run/RunOnce\n# CreateService, OpenSCManager → service Windows\n# GetTempPath, CopyFile → copie vers temp\n\n# Injection :\n# VirtualAllocEx + WriteProcessMemory + CreateRemoteThread\n# NtWriteVirtualMemory + NtCreateThreadEx (variante stealth)\n# QueueUserAPC (APC injection)" },
      { label: "Sandbox evasion — détecter les techniques", label_en: "Sandbox evasion — detect techniques", cmd: "# Checks anti-VM courants :\n# IsDebuggerPresent(), CheckRemoteDebuggerPresent()\n# CPUID (bit hypervisor), IN instruction\n# GetSystemInfo, GlobalMemoryStatusEx (RAM < 4GB ?)\n# GetVersion (OS anachronique ?)\n# CreateToolhelp32Snapshot (chercher av/sandbox processes)\n\n# Sleep evasion :\n# timeout /t %RANDOM% > nul  (attendre 10-30 min)\n# Argument gatekeeping : /i:--type=renderer requis" },
      { label: "Anti-analyse locale — locale/keyboard checks", label_en: "Local anti-analysis — locale/keyboard checks", cmd: "# GetKeyboardLayout → bloquer CIS countries\n# GetLocaleInfoA/W → country/region codes\n# GetSystemDefaultLangID, GetUserDefaultLangID\n\n# En Frida — hooker pour bypasser :\n# Interceptor.attach(Module.findExportByName('kernel32', 'GetSystemDefaultLangID'), {\n#   onLeave: function(ret) { ret.replace(0x0409); }  // forcer en-US\n# });" },
      { label: "DLL Injection — reconstruire le processus", label_en: "DLL Injection — reconstruct the process", cmd: "# 1. Lister processes : CreateToolhelp32Snapshot + Process32First/Next\n# 2. Ouvrir process cible : OpenProcess\n# 3. Allouer mémoire : VirtualAllocEx\n# 4. Écrire path DLL : WriteProcessMemory\n# 5. Créer thread : CreateRemoteThread(LoadLibrary)\n\n# Reflective DLL Injection :\n# DLL se mappe elle-même, résout imports, fixe relocations, appelle DllMain\n# Pas d'appel à LoadLibrary → invisible pour la plupart des AV" }
    ],
    lookfor: [
      "Imports : VirtualAllocEx + WriteProcessMemory + CreateRemoteThread → injection classique",
      "IsDebuggerPresent / CPUID / GetSystemInfo → anti-VM/sandbox",
      "RegSetValueEx sur HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run → persistance",
      "InternetOpen + InternetOpenUrl → C2 communication basique",
      "GetKeyboardLayout / GetLocaleInfoA → exécution conditionnelle selon la région"
    ],
    lookfor_en: [
      "Imports: VirtualAllocEx + WriteProcessMemory + CreateRemoteThread → classic injection",
      "IsDebuggerPresent / CPUID / GetSystemInfo → anti-VM/sandbox checks",
      "RegSetValueEx on HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run → persistence",
      "InternetOpen + InternetOpenUrl → basic C2 communication",
      "GetKeyboardLayout / GetLocaleInfoA → conditional execution based on region"
    ],
    tips: [
      "FLOSS révèle les strings XOR/stack-based que 'strings' ne voit pas",
      "Toujours analyser dans une VM isolée (réseau coupé ou simulé avec INetSim/FakeNet-NG)",
      "x64dbg + ScyllaHide plugin pour bypasser les anti-debug les plus courants",
      "Procmon + Wireshark en parallèle pour capturer filesystem + réseau simultanément",
      "Reflective DLL Injection : chercher MZ/PE header dans un buffer alloué avec VirtualAlloc"
    ],
    tips_en: [
      "FLOSS reveals XOR/stack-based strings that 'strings' misses",
      "Always analyze in an isolated VM (network cut or simulated with INetSim/FakeNet-NG)",
      "x64dbg + ScyllaHide plugin to bypass the most common anti-debug techniques",
      "Procmon + Wireshark in parallel to capture filesystem + network simultaneously",
      "Reflective DLL Injection: look for MZ/PE header in a buffer allocated with VirtualAlloc"
    ],
    choices: [
      { label: "Reversing avancé (angr/Z3)", label_en: "Advanced Reversing (angr/Z3)", next: "reversing_advanced", icon: "🔬" },
      { label: "Flag trouvé !", label_en: "Flag found!", next: "flag_found", icon: "🏁" },
      { label: "Retour Reverse Engineering", label_en: "Back to Reverse Engineering", next: "reverse_eng", icon: "⚙️" }
    ]
  },

  // ── ANDROID PENTEST ───────────────────────────────────────────────────────────
  "android_pentest": {
    id: "android_pentest", title: "Android App Pentesting", title_en: "Android App Pentesting", category: "ctf", icon: "🤖",
    description: "Android pentest: APK decompile (jadx/apktool), ADB shell, SSL pinning bypass, Frida dynamic instrumentation, intent injection, analyse statique du Manifest.",
    description_en: "Android pentest: APK decompile (jadx/apktool), ADB shell, SSL pinning bypass, Frida dynamic instrumentation, intent injection, static Manifest analysis.",
    commands: [
      { label: "ADB — connexion et extraction d'APK", label_en: "ADB — connect and extract APK", cmd: "# Lister les packages installés\nadb shell pm list packages | grep target\n\n# Trouver le chemin de l'APK\nadb shell pm path com.example.app\n# => package:/data/app/com.example.app-.../base.apk\n\n# Extraire l'APK\nadb pull /data/app/com.example.app-.../base.apk ./app.apk" },
      { label: "jadx — décompiler un APK en Java", label_en: "jadx — decompile APK to Java", cmd: "jadx -d output_dir app.apk\n# Interface graphique\njadx-gui app.apk\n\n# Chercher des secrets dans le code\ngrep -r 'password\\|api_key\\|secret\\|token\\|firebase' output_dir/" },
      { label: "apktool — décompiler/recompiler (Smali)", label_en: "apktool — decompile/recompile (Smali)", cmd: "# Décompiler\napktool d app.apk -o output_dir\n\n# Modifier le Smali, puis recompiler\napktool b output_dir -o app_modified.apk\n\n# Signer l'APK modifié\njava -jar uber-apk-signer.jar -a app_modified.apk --allowResign -o signed/" },
      { label: "Analyse statique — Manifest.xml", label_en: "Static analysis — Manifest.xml", cmd: "# Chercher des vulnérabilités dans le manifest :\n# debuggable=\"true\" → connexion ADB au process\n# android:allowBackup=\"true\" → backup via ADB\n# exported=\"true\" sur Activity/Service → accessible à d'autres apps\n# android:networkSecurityConfig → config TLS\n\n# Extraire le manifest (via apktool)\napktool d app.apk -o out/\ncat out/AndroidManifest.xml | grep -E 'debuggable|exported|allowBackup'" },
      { label: "Frida — bypass SSL pinning (OkHttp/TrustManager)", label_en: "Frida — bypass SSL pinning (OkHttp/TrustManager)", cmd: "# Script universel SSL unpinning\nfrida -U -f com.example.app -l ssl_unpinning.js\n\n# ssl_unpinning.js (OkHttp CertificatePinner) :\n# Java.perform(() => {\n#   const CertPinner = Java.use('okhttp3.CertificatePinner');\n#   CertPinner.check.overload('java.lang.String', 'java.util.List')\n#     .implementation = function(hostname, certs) {\n#       console.log('SSL pinning bypassed for', hostname);\n#     };\n# });" },
      { label: "Frida — bypass root detection", label_en: "Frida — bypass root detection", cmd: "# Bypasser isDeviceRooted() générique\nJava.perform(() => {\n  try {\n    const RootChecker = Java.use('com.target.security.RootCheck');\n    RootChecker.isDeviceRooted.implementation = function () {\n      console.log('[*] isDeviceRooted() -> false');\n      return false;\n    };\n  } catch (e) { console.log(e); }\n\n  // Neutraliser Debug.isDebuggerConnected\n  const Debug = Java.use('android.os.Debug');\n  Debug.isDebuggerConnected.implementation = function () { return false; };\n});" },
      { label: "Frida — dumper un DEX chargé en mémoire", label_en: "Frida — dump an in-memory DEX", cmd: "# Hooker InMemoryDexClassLoader pour capturer les DEX fileless\nJava.perform(() => {\n  const IM = Java.use('dalvik.system.InMemoryDexClassLoader');\n  IM.$init.overload('java.nio.ByteBuffer','java.lang.ClassLoader')\n    .implementation = function(buf, parent) {\n      const arr = Java.array('byte', buf.array());\n      const fos = Java.use('java.io.FileOutputStream').$new('/sdcard/memdex.dex');\n      fos.write(arr); fos.close();\n      console.log('[*] DEX dumped to /sdcard/memdex.dex');\n      return this.$init(buf, parent);\n    };\n});" },
      { label: "Objection — explorer l'app à la volée", label_en: "Objection — explore the app on the fly", cmd: "# Attacher objection\nobjection -g com.example.app explore\n\n# Commandes utiles dans la console objection :\n# android hooking list classes\n# android hooking watch class com.example.security.PinningManager\n# android ssl pinning disable\n# android root disable\n# env  (chemins de l'app)\n# file download /data/data/com.example.app/shared_prefs/settings.xml settings.xml" },
      { label: "MobSF — analyse statique automatique (APK)", label_en: "MobSF — automated static analysis (APK)", cmd: "# Lancer MobSF (Docker)\ndocker run -it --rm -p 8000:8000 opensecurity/mobile-security-framework-mobsf\n\n# Uploader l'APK sur http://localhost:8000\n# Le rapport couvre : manifest, permissions, hardcoded secrets, TLS, code analysis" },
      { label: "Intent injection — tester les composants exportés", label_en: "Intent injection — test exported components", cmd: "# Lancer une Activity exportée\nadb shell am start -n com.example.app/.VulnerableActivity\n\n# Envoyer un broadcast\nadb shell am broadcast -a com.example.CUSTOM_ACTION --es key value\n\n# Tester un deeplink / URL scheme\nadb shell am start -a android.intent.action.VIEW \\\n  -d 'example://auth?token=INJECTED'" },
      { label: "phantom-frida — Frida stealth (anti-détection)", label_en: "phantom-frida — stealth Frida (anti-detection)", cmd: "# Frida patchée pour éviter la détection\npython3 build.py --version 17.7.2 --name myserver --port 27142 --extended --verify\nadb push output/myserver-server-17.7.2-android-arm64 /data/local/tmp/myserver-server\nadb shell chmod 755 /data/local/tmp/myserver-server\nadb shell /data/local/tmp/myserver-server -D &\nadb forward tcp:27142 tcp:27142\nfrida -H 127.0.0.1:27142 -f com.example.app" }
    ],
    lookfor: [
      "debuggable=true dans le Manifest → connexion ADB au process en mode debug",
      "exported=true sur Activity/ContentProvider → injection d'intent possible",
      "SharedPreferences / SQLite en clair : /data/data/<pkg>/shared_prefs/ et /databases/",
      "Hardcoded API keys, Firebase URLs dans strings.xml ou le code Java décompilé",
      "OkHttp CertificatePinner / TrustManager custom → cible pour SSL unpinning Frida"
    ],
    lookfor_en: [
      "debuggable=true in the Manifest → ADB connection to the process in debug mode",
      "exported=true on Activity/ContentProvider → intent injection possible",
      "SharedPreferences / SQLite in plaintext: /data/data/<pkg>/shared_prefs/ and /databases/",
      "Hardcoded API keys, Firebase URLs in strings.xml or decompiled Java code",
      "OkHttp CertificatePinner / custom TrustManager → target for Frida SSL unpinning"
    ],
    tips: [
      "Toujours commencer par MobSF (analyse statique auto) avant l'analyse manuelle",
      "jadx-gui permet de chercher du texte dans tout le code décompilé en un clic",
      "Magisk DenyList suffit souvent pour les apps avec root detection basique",
      "Objection = wrapper Frida avec des commandes haut niveau prêtes à l'emploi",
      "Pour les apps React Native : le bundle JS est dans assets/index.android.bundle"
    ],
    tips_en: [
      "Always start with MobSF (automated static analysis) before manual analysis",
      "jadx-gui lets you search text across all decompiled code in one click",
      "Magisk DenyList is often enough for apps with basic root detection",
      "Objection = Frida wrapper with ready-to-use high-level commands",
      "For React Native apps: the JS bundle is in assets/index.android.bundle"
    ],
    choices: [
      { label: "iOS Pentesting", label_en: "iOS Pentesting", next: "ios_pentest", icon: "🍎" },
      { label: "Outils mobiles (MobSF, drozer...)", label_en: "Mobile Tools (MobSF, drozer...)", next: "mobile_tools", icon: "🛠️" },
      { label: "Reversing avancé (angr, Frida, Z3)", label_en: "Advanced Reversing (angr, Frida, Z3)", next: "reversing_advanced", icon: "🔬" }
    ]
  },

  // ── iOS PENTEST ───────────────────────────────────────────────────────────────
  "ios_pentest": {
    id: "ios_pentest", title: "iOS App Pentesting", title_en: "iOS App Pentesting", category: "ctf", icon: "🍎",
    description: "iOS pentest: IPA analysis (otool, MobSF), Frida on iOS, jailbreak detection bypass, objection, SSL pinning bypass, analyse des protections binaires.",
    description_en: "iOS pentest: IPA analysis (otool, MobSF), Frida on iOS, jailbreak detection bypass, objection, SSL pinning bypass, binary protection analysis.",
    commands: [
      { label: "otool — vérifier les protections du binaire", label_en: "otool — check binary protections", cmd: "# PIE (Address Space Layout Randomization)\notool -hv <app-binary> | grep PIE\n\n# Stack Canaries\notool -I -v <app-binary> | grep stack_chk\n\n# ARC (Automatic Reference Counting)\notool -I -v <app-binary> | grep objc_release\n\n# Chiffrement du binaire (cryptid doit être 1)\notool -arch all -Vl <app-binary> | grep -A5 LC_ENCRYPT" },
      { label: "otool — détecter les fonctions dangereuses", label_en: "otool — detect dangerous functions", cmd: "# Fonctions de hashing faibles\notool -Iv <app> | grep -w '_CC_MD5'\notool -Iv <app> | grep -w '_CC_SHA1'\n\n# Fonctions mémoire dangereuses\notool -Iv <app> | grep -w '_gets'\notool -Iv <app> | grep -w '_memcpy'\notool -Iv <app> | grep -w '_sprintf'\notool -Iv <app> | grep -w '_vsprintf'\n\n# Random functions non sécurisées\notool -Iv <app> | grep -w '_random'\notool -Iv <app> | grep -w '_rand'" },
      { label: "Frida — lister les apps installées (iOS)", label_en: "Frida — list installed apps (iOS)", cmd: "# Lister toutes les apps avec leur bundle ID\nfrida-ps -Uai\n\n# Exemple de sortie :\n# PID  Name        Identifier\n# 6847 Calendar    com.apple.mobilecal\n# -    iGoat-Swift OWASP.iGoat-Swift" },
      { label: "Frida — hooker des méthodes Objective-C", label_en: "Frida — hook Objective-C methods", cmd: "# Attacher à une app iOS\nfrida -U -f com.example.app -l hook_ios.js\n\n# hook_ios.js :\n# ObjC.schedule(ObjC.mainQueue, () => {\n#   const ViewController = ObjC.classes.ViewController;\n#   const orig = ViewController['- checkPin:'];\n#   ObjC.implement(orig, (self, sel, pin) => {\n#     console.log('[*] checkPin called with:', pin);\n#     return orig.call(self, sel, '1234');  // forcer un pin valide\n#   });\n# });" },
      { label: "Objection (iOS) — explorer et hooker", label_en: "Objection (iOS) — explore and hook", cmd: "# Attacher objection à une app iOS\nobjection -g com.example.app explore\n\n# Commandes iOS utiles :\n# ios hooking list classes\n# ios hooking watch method \"-[ViewController checkPin:]\" --dump-args --dump-return\n# ios ssl pinning disable\n# ios jailbreak disable\n# ios keychain dump\n# ios pasteboard monitor" },
      { label: "Bypass jailbreak detection — vecteurs courants", label_en: "Bypass jailbreak detection — common vectors", cmd: "# En Frida — hooker les checks de jailbreak :\n# 1. FileManager.fileExists (Cydia.app, MobileSubstrate, etc.)\n# 2. canOpenURL('cydia://')\n# 3. fork() / system() retournant succès\n# 4. DYLD_INSERT_LIBRARIES dans l'env\n# 5. ProcessInfo.processInfo.environment\n\n# Script Objection :\n# ios jailbreak disable" },
      { label: "Bypass anti-debug iOS — ptrace + sysctl", label_en: "Bypass iOS anti-debug — ptrace + sysctl", cmd: "# ptrace(PT_DENY_ATTACH) est la technique la plus courante\n# En Frida : hooker ptrace pour qu'il ne bloque pas\n# Interceptor.attach(Module.findExportByName(null, 'ptrace'), {\n#   onEnter: function(args) {\n#     if (args[0].toInt32() === 31) {  // PT_DENY_ATTACH = 31\n#       args[0] = ptr(0);\n#       console.log('[*] ptrace(PT_DENY_ATTACH) neutralisé');\n#     }\n#   }\n# });\n\n# sysctl check (debugger attached) :\n# Interceptor.attach(Module.findExportByName(null, 'sysctl'), {\n#   onLeave: function(ret) { ret.replace(0); }\n# });" },
      { label: "SSL Pinning bypass — iOS (URLSession / Alamofire)", label_en: "SSL Pinning bypass — iOS (URLSession / Alamofire)", cmd: "# Via objection :\n# ios ssl pinning disable\n\n# Via Frida — hooker NSURLSession:\n# var NSURLSession = ObjC.classes.NSURLSession;\n# Interceptor.attach(ObjC.classes.NSURLSessionConfiguration[\n#   '+ defaultSessionConfiguration'].implementation, {\n#   onLeave: function(ret) {\n#     var conf = new ObjC.Object(ret);\n#     conf.TLSMinimumSupportedProtocol = 0;\n#   }\n# });\n\n# Configurer un proxy Burp + Certificat Burp dans les profils iOS" },
      { label: "MobSF — analyse statique IPA", label_en: "MobSF — static IPA analysis", cmd: "# Lancer MobSF\ndocker run -it --rm -p 8000:8000 opensecurity/mobile-security-framework-mobsf\n\n# Uploader le fichier .ipa sur http://localhost:8000\n# Le rapport couvre :\n# - Protections binaires (PIE, ARC, Stack Canary, BitCode)\n# - Entitlements\n# - Strings et secrets hardcodés\n# - Permissions demandées\n# - Transport Security" },
      { label: "Keychain dump — extraire les credentials stockés", label_en: "Keychain dump — extract stored credentials", cmd: "# Via objection :\n# ios keychain dump\n\n# Ou avec keychain-dumper (sur device jailbreaké) :\n# ./keychain-dumper\n\n# Chercher : passwords, tokens, certificats, clés privées" }
    ],
    lookfor: [
      "cryptid=0 dans LC_ENCRYPT → binaire non chiffré, directement analysable avec Ghidra",
      "Absence de stack_chk_guard → pas de canary, stack overflow potentiel",
      "ptrace(PT_DENY_ATTACH) dans le binaire → anti-debug à bypasser",
      "canOpenURL('cydia://') ou fileExists('/Applications/Cydia.app') → détection jailbreak",
      "Données sensibles dans le Keychain sans kSecAttrAccessibleAlways → bonne pratique à vérifier"
    ],
    lookfor_en: [
      "cryptid=0 in LC_ENCRYPT → unencrypted binary, directly analyzable with Ghidra",
      "Missing stack_chk_guard → no canary, potential stack overflow",
      "ptrace(PT_DENY_ATTACH) in the binary → anti-debug to bypass",
      "canOpenURL('cydia://') or fileExists('/Applications/Cydia.app') → jailbreak detection",
      "Sensitive data in Keychain without kSecAttrAccessibleAlways → good practice to verify"
    ],
    tips: [
      "otool est l'équivalent iOS de readelf/objdump — indispensable pour l'analyse statique",
      "frida-ps -Uai affiche tous les bundle IDs même si l'app n'est pas en cours d'exécution",
      "Les apps sécurisées utilisent souvent plusieurs couches de détection : jailbreak + anti-debug + certificate pinning",
      "Malimite (LaurieWired) est un bon décompilateur Swift/ObjC alternatif à Ghidra pour iOS",
      "Toujours tester avec et sans le mode spawn (-f) : certains checks n'existent qu'au démarrage"
    ],
    tips_en: [
      "otool is the iOS equivalent of readelf/objdump — essential for static analysis",
      "frida-ps -Uai displays all bundle IDs even if the app is not currently running",
      "Secure apps often use multiple detection layers: jailbreak + anti-debug + certificate pinning",
      "Malimite (LaurieWired) is a good Swift/ObjC decompiler alternative to Ghidra for iOS",
      "Always test with and without spawn mode (-f): some checks only exist at startup"
    ],
    choices: [
      { label: "Android Pentesting", label_en: "Android Pentesting", next: "android_pentest", icon: "🤖" },
      { label: "Outils mobiles (MobSF, drozer...)", label_en: "Mobile Tools (MobSF, drozer...)", next: "mobile_tools", icon: "🛠️" },
      { label: "Flag trouvé !", label_en: "Flag found!", next: "flag_found", icon: "🏁" }
    ]
  },

  // ── OUTILS MOBILES ────────────────────────────────────────────────────────────
  "mobile_tools": {
    id: "mobile_tools", title: "Outils Mobiles", title_en: "Mobile Tools", category: "ctf", icon: "🛠️",
    description: "Outils mobiles: MobSF (static+dynamic), drozer (Android attack framework), objection, Frida, APKTool, jadx, ADB commands essentiels.",
    description_en: "Mobile tools: MobSF (static+dynamic), drozer (Android attack framework), objection, Frida, APKTool, jadx, essential ADB commands.",
    commands: [
      { label: "MobSF — analyse statique + dynamique", label_en: "MobSF — static + dynamic analysis", cmd: "# Installation Docker\ndocker run -it --rm -p 8000:8000 opensecurity/mobile-security-framework-mobsf\n\n# API REST pour automatiser\ncurl -F 'file=@app.apk' http://localhost:8000/api/v1/upload \\\n  -H 'Authorization: YOUR_API_KEY'\n\n# Analyse statique : uploader APK/IPA/APPX\n# Analyse dynamique : nécessite un émulateur ou device connecté\n# Rapport JSON : http://localhost:8000/api/v1/report_json" },
      { label: "drozer — framework d'attaque Android", label_en: "drozer — Android attack framework", cmd: "# Installer drozer sur le device\nadb install drozer-agent.apk\n\n# Forwarder le port\nadb forward tcp:31415 tcp:31415\n\n# Connexion\ndrozer console connect\n\n# Commandes essentielles :\n# run app.package.list -f target\n# run app.package.info -a com.example.app\n# run app.activity.info -a com.example.app\n# run app.activity.start --component com.example.app .VulnerableActivity\n# run app.provider.info -a com.example.app\n# run scanner.provider.injection -a com.example.app" },
      { label: "objection — Frida wrapper haut niveau", label_en: "objection — high-level Frida wrapper", cmd: "# Android\nobjection -g com.example.app explore\n\n# iOS\nobjection -g com.example.ios.app explore\n\n# Commandes universelles :\n# env                          (paths de l'app)\n# memory list modules          (librairies chargées)\n# android hooking list classes\n# android ssl pinning disable\n# android root disable\n# ios keychain dump\n# ios ssl pinning disable\n# import script.js             (charger un script Frida custom)" },
      { label: "Frida — commandes de base cross-platform", label_en: "Frida — basic cross-platform commands", cmd: "# Lister les devices disponibles\nfrida-ls-devices\n\n# Lister les processes (USB device)\nfrida-ps -U\n\n# Lister les apps installées avec bundle ID\nfrida-ps -Uai\n\n# Attacher à une app (spawn)\nfrida -U -f com.example.app -l script.js\n\n# Attacher à un process en cours\nfrida -U -n com.example.app -l script.js\n\n# Mode REPL interactif\nfrida -U -f com.example.app" },
      { label: "APKTool — workflow complet décompile/recompile", label_en: "APKTool — full decompile/recompile workflow", cmd: "# Décompiler\napktool d app.apk -o decompiled/\n\n# Inspecter et modifier les fichiers Smali\n# decompiled/smali/com/example/... (code)\n# decompiled/res/values/strings.xml\n# decompiled/AndroidManifest.xml\n\n# Recompiler\napktool b decompiled/ -o app_patched.apk\n\n# Aligner\nzipalign -v 4 app_patched.apk app_aligned.apk\n\n# Signer (debug key)\njava -jar uber-apk-signer.jar -a app_aligned.apk --allowResign -o output/" },
      { label: "jadx — décompiler et chercher des secrets", label_en: "jadx — decompile and search for secrets", cmd: "# CLI\njadx -d output/ app.apk\n\n# GUI\njadx-gui app.apk\n\n# Recherche de secrets dans le code décompilé\ngrep -rn 'api_key\\|secret\\|password\\|token\\|firebase\\|AWS\\|private' output/\n\n# Trouver les URLs hardcodées\ngrep -rn 'http\\|https' output/sources/ | grep -v '//'" },
      { label: "ADB — commandes essentielles pentest", label_en: "ADB — essential pentest commands", cmd: "# Shell interactif\nadb shell\n\n# Installer une APK\nadb install -r app.apk\n\n# Copier des fichiers\nadb pull /data/data/com.example.app/databases/ ./\nadb push payload.sh /data/local/tmp/\n\n# Logs de l'app\nadb logcat | grep com.example.app\nadb logcat -s 'TAG'\n\n# Capture réseau (tcpdump)\nadb shell tcpdump -i any -w /sdcard/capture.pcap\nadb pull /sdcard/capture.pcap\n\n# Screen recording\nadb shell screenrecord /sdcard/record.mp4" },
      { label: "Medusa — framework Frida 90+ modules", label_en: "Medusa — Frida framework with 90+ modules", cmd: "git clone https://github.com/Ch0pin/medusa\ncd medusa\npip install -r requirements.txt\npython medusa.py\n\n# Dans la console Medusa :\n# show categories\n# use http_communications/multiple_unpinner\n# use root_detection/universal_root_detection_bypass\n# run com.target.app" },
      { label: "justapk — télécharger APK multi-sources", label_en: "justapk — download APK from multiple sources", cmd: "pip install justapk  # Python 3.11+\n\n# Télécharger avec fallback automatique\njustapk download com.example.app\n\n# Forcer une source\njustapk download com.example.app -s apkpure\n\n# Info sur un package\njustapk info org.telegram.messenger\n\n# Convertir un XAPK en APK (merge + resign debug)\njustapk convert app.xapk -o output/" },
      { label: "Auto-Frida — bypass automatique des protections", label_en: "Auto-Frida — automatic protection bypass", cmd: "git clone https://github.com/ommirkute/Auto-Frida.git\ncd Auto-Frida\npip install -r requirements.txt\npython auto_frida.py\n\n# Auto-Frida :\n# - Détecte automatiquement les protections (SSL pinning, root, anti-Frida)\n# - Génère un script de bypass consolidé\n# - Supporte le spawn-mode pour hooker dès Application.onCreate()" }
    ],
    lookfor: [
      "MobSF score de sécurité bas → points d'entrée faciles identifiés automatiquement",
      "drozer app.provider.info → ContentProviders potentiellement exploitables (SQL injection)",
      "jadx strings.xml + sources → API keys, tokens, Firebase URLs hardcodés",
      "ADB logcat → parfois des credentials ou tokens loggés en clair",
      "APKTool AndroidManifest → activités exportées sans permission requise"
    ],
    lookfor_en: [
      "Low MobSF security score → easy entry points automatically identified",
      "drozer app.provider.info → potentially exploitable ContentProviders (SQL injection)",
      "jadx strings.xml + sources → hardcoded API keys, tokens, Firebase URLs",
      "ADB logcat → credentials or tokens sometimes logged in plaintext",
      "APKTool AndroidManifest → exported activities without required permission"
    ],
    tips: [
      "MobSF est le meilleur point de départ : rapport complet en quelques minutes",
      "drozer est idéal pour tester les ContentProviders et les Intents exportés interactivement",
      "objection ssl pinning disable fonctionne sur 80% des apps sans écrire de script custom",
      "jadx-gui : utiliser Edit > Find (Ctrl+F) pour chercher dans tout le code décompilé",
      "ADB logcat -v time > logcat.txt : toujours capturer les logs dès le début des tests"
    ],
    tips_en: [
      "MobSF is the best starting point: complete report in a few minutes",
      "drozer is ideal for interactively testing ContentProviders and exported Intents",
      "objection ssl pinning disable works on 80% of apps without writing a custom script",
      "jadx-gui: use Edit > Find (Ctrl+F) to search across all decompiled code",
      "ADB logcat -v time > logcat.txt: always capture logs from the start of testing"
    ],
    choices: [
      { label: "Android Pentesting approfondi", label_en: "In-depth Android Pentesting", next: "android_pentest", icon: "🤖" },
      { label: "iOS Pentesting", label_en: "iOS Pentesting", next: "ios_pentest", icon: "🍎" },
      { label: "Reversing avancé (angr, Frida, Z3)", label_en: "Advanced Reversing (angr, Frida, Z3)", next: "reversing_advanced", icon: "🔬" }
    ]
  }

});

// ─── Patch des noeuds existants ────────────────────────────────────────────────

NODES["reverse_eng"].choices.push(
  { label: "Reversing avancé (angr, Frida, Z3)", label_en: "Advanced Reversing (angr, Frida, Z3)", next: "reversing_advanced", icon: "🔬" },
  { label: "Analyse malware", label_en: "Malware Analysis", next: "reversing_malware", icon: "🦠" }
);

NODES["start"].choices.push(
  { label: "Pentest Mobile (Android / iOS)", label_en: "Mobile Pentesting (Android / iOS)", next: "android_pentest", icon: "📱" }
);
