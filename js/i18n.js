// ─── i18n — Bilingual FR/EN ──────────────────────────────────────────────────

let LANG = localStorage.getItem("nullroute_lang") || "en";

function setLang(l) {
  LANG = l;
  localStorage.setItem("nullroute_lang", l);
  document.getElementById("lang-fr").classList.toggle("active", l === "fr");
  document.getElementById("lang-en").classList.toggle("active", l === "en");
  // Re-render current node and UI
  if (typeof renderNode === "function") renderNode(currentNodeId);
  if (typeof updateBreadcrumb === "function") updateBreadcrumb();
  if (typeof renderDocList === "function") renderDocList();
  if (typeof renderMap === "function") {
    const mapOverlay = document.getElementById("map-overlay");
    if (mapOverlay && !mapOverlay.classList.contains("hidden")) renderMap();
  }
  applyLang();
}

function t(key) {
  return (I18N[LANG] && I18N[LANG][key]) ? I18N[LANG][key] : (I18N["en"][key] || key);
}

function applyLang() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = t(key);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    el.placeholder = t(el.getAttribute("data-i18n-placeholder"));
  });
  document.querySelectorAll("[data-i18n-title]").forEach(el => {
    el.title = t(el.getAttribute("data-i18n-title"));
  });
}

const I18N = {
  fr: {
    // Header
    "btn.back": "← Retour",
    "btn.home": "🏠 Départ",
    "btn.map": "🗺️ Carte",
    "btn.docs": "📚 Docs",
    "btn.gtfobins": "🐧 GTFOBins",
    "btn.lolbas": "🪟 LOLBAS",
    "btn.payloads": "💥 Payloads",
    "search.placeholder": "Rechercher… (Ctrl+K)  ex: sqlmap, nmap, privesc, suid…",
    // Sections
    "section.commands": "⚡ Commandes",
    "section.lookfor": "🔍 Ce qu'il faut chercher",
    "section.tips": "💡 Conseils",
    "section.choices": "👉 Qu'est-ce que vous avez trouvé ?",
    "section.related": "📖 Termes liés",
    // Map
    "map.title": "🗺️ Carte complète — Tous les nœuds",
    "map.close": "✕ Fermer",
    // Docs
    "docs.title": "📚 Glossaire NullRoute / Pentest",
    "docs.search": "Rechercher un terme… (SQLi, SUID, Reverse Shell…)",
    "docs.close": "✕ Fermer",
    // GTFOBins
    "gtfo.title": "🐧 GTFOBins — Escalade Linux",
    "gtfo.subtitle": "478 binaires Linux exploitables pour shell, SUID, sudo, lecture/écriture de fichiers",
    "gtfo.search": "Rechercher un binaire… (bash, python3, vim, find, curl…)",
    "gtfo.close": "✕ Fermer",
    "gtfo.shell": "Shell",
    "gtfo.sudo": "Sudo",
    "gtfo.suid": "SUID",
    "gtfo.revshell": "Rev Shell",
    "gtfo.fileread": "Lecture",
    "gtfo.filewrite": "Écriture",
    "gtfo.capabilities": "Capabilities",
    "gtfo.noresult": "Aucun binaire trouvé",
    // LOLBAS
    "lolbas.title": "🪟 LOLBAS — Living Off The Land Windows",
    "lolbas.subtitle": "235 binaires Windows légitimes pour download, exécution, bypass défenses",
    "lolbas.search": "Rechercher un binaire… (certutil, powershell, mshta, bitsadmin…)",
    "lolbas.close": "✕ Fermer",
    "lolbas.noresult": "Aucun binaire trouvé",
    // Payloads
    "payloads.title": "💥 Payloads — PayloadsAllTheThings",
    "payloads.subtitle": "Payloads organisés par type de vulnérabilité",
    "payloads.search": "Rechercher une vuln… (SQLi, XSS, SSRF, SSTI…)",
    "payloads.close": "✕ Fermer",
    "payloads.copy": "Copier",
    "payloads.copied": "✓",
    "payloads.tools": "🔧 Outils",
    "payloads.detection": "🔍 Détection",
    // Docs content
    "docs.definition": "Définition",
    "docs.example": "Exemple",
    "docs.tools": "Outils associés",
    "docs.refs": "Références",
    "docs.placeholder": "Sélectionne un terme dans la liste ou utilise la recherche.",
    "docs.noresult": "Aucun résultat pour",
    "docs.related": "Termes liés — cliquer pour définition",
    "docs.cat.web": "🌐 Web",
    "docs.cat.exploit": "💥 Exploit",
    "docs.cat.network": "🔌 Réseau",
    "docs.cat.privesc": "⬆️ PrivEsc",
    "docs.cat.tool": "🔧 Outils",
    "docs.cat.ctf": "🎯 CTF / Crypto",
    "docs.cat.general": "📖 Général",
    // Map categories
    "map.cat.recon":    "🔍 Reconnaissance",
    "map.cat.web":      "🌐 Web",
    "map.cat.network":  "🔌 Réseau",
    "map.cat.exploit":  "💥 Exploitation",
    "map.cat.privesc":  "⬆️ PrivEsc",
    "map.cat.post":     "🏆 Post-Exploitation",
    "map.cat.password": "🔑 Mots de passe",
    "map.cat.ctf":      "🎯 CTF / Crypto",
    // Favorites
    "btn.favorites": "⭐ Favs",
    "btn.shortcuts": "⌨",
    "fav.title": "⭐ Favoris",
    "fav.close": "✕ Fermer",
    "fav.empty": "Aucun favori enregistré. Clique sur ☆ sur un nœud pour l'ajouter.",
    "fav.add": "Ajouter aux favoris",
    "fav.remove": "Retirer des favoris",
    "done.mark": "Marquer comme fait",
    "done.unmark": "Marquer comme non fait",
    "node.copyall": "Copier tout",
    "toast.favorited": "⭐ Ajouté aux favoris",
    "toast.unfavorited": "Retiré des favoris",
    "toast.done": "✓ Marqué comme fait",
    "toast.undone": "Marqué comme non fait",
    "toast.copyall": "Toutes les commandes copiées !",
    "recent.title": "🕐 Récents",
    "shortcuts.title": "⌨ Raccourcis clavier",
    "shortcuts.close": "✕ Fermer",
    "map.progress": "nœuds complétés",
    // Misc
    "breadcrumb.home": "🏠 Départ",
    "toast.notfound": "Nœud non trouvé :",
    "copy.btn": "⎘",
    "search.noresult": "Aucun résultat pour",
  },
  en: {
    // Header
    "btn.back": "← Back",
    "btn.home": "🏠 Start",
    "btn.map": "🗺️ Map",
    "btn.docs": "📚 Docs",
    "btn.gtfobins": "🐧 GTFOBins",
    "btn.lolbas": "🪟 LOLBAS",
    "btn.payloads": "💥 Payloads",
    "search.placeholder": "Search… (Ctrl+K)  e.g.: sqlmap, nmap, privesc, suid…",
    // Sections
    "section.commands": "⚡ Commands",
    "section.lookfor": "🔍 What to look for",
    "section.tips": "💡 Tips",
    "section.choices": "👉 What did you find?",
    "section.related": "📖 Related terms",
    // Map
    "map.title": "🗺️ Full Map — All nodes",
    "map.close": "✕ Close",
    // Docs
    "docs.title": "📚 NullRoute / Pentest Glossary",
    "docs.search": "Search a term… (SQLi, SUID, Reverse Shell…)",
    "docs.close": "✕ Close",
    // GTFOBins
    "gtfo.title": "🐧 GTFOBins — Linux Privilege Escalation",
    "gtfo.subtitle": "478 exploitable Linux binaries for shell, SUID, sudo, file read/write",
    "gtfo.search": "Search a binary… (bash, python3, vim, find, curl…)",
    "gtfo.close": "✕ Close",
    "gtfo.shell": "Shell",
    "gtfo.sudo": "Sudo",
    "gtfo.suid": "SUID",
    "gtfo.revshell": "Rev Shell",
    "gtfo.fileread": "File Read",
    "gtfo.filewrite": "File Write",
    "gtfo.capabilities": "Capabilities",
    "gtfo.noresult": "No binary found",
    // LOLBAS
    "lolbas.title": "🪟 LOLBAS — Living Off The Land Windows",
    "lolbas.subtitle": "235 legitimate Windows binaries for download, execution, defense bypass",
    "lolbas.search": "Search a binary… (certutil, powershell, mshta, bitsadmin…)",
    "lolbas.close": "✕ Close",
    "lolbas.noresult": "No binary found",
    // Payloads
    "payloads.title": "💥 Payloads — PayloadsAllTheThings",
    "payloads.subtitle": "Payloads organized by vulnerability type",
    "payloads.search": "Search a vuln… (SQLi, XSS, SSRF, SSTI…)",
    "payloads.close": "✕ Close",
    "payloads.copy": "Copy",
    "payloads.copied": "✓",
    "payloads.tools": "🔧 Tools",
    "payloads.detection": "🔍 Detection",
    // Docs content
    "docs.definition": "Definition",
    "docs.example": "Example",
    "docs.tools": "Associated Tools",
    "docs.refs": "References",
    "docs.placeholder": "Select a term from the list or use the search.",
    "docs.noresult": "No results for",
    "docs.related": "Related terms — click for definition",
    "docs.cat.web": "🌐 Web",
    "docs.cat.exploit": "💥 Exploit",
    "docs.cat.network": "🔌 Network",
    "docs.cat.privesc": "⬆️ PrivEsc",
    "docs.cat.tool": "🔧 Tools",
    "docs.cat.ctf": "🎯 CTF / Crypto",
    "docs.cat.general": "📖 General",
    // Map categories
    "map.cat.recon":    "🔍 Reconnaissance",
    "map.cat.web":      "🌐 Web",
    "map.cat.network":  "🔌 Network",
    "map.cat.exploit":  "💥 Exploitation",
    "map.cat.privesc":  "⬆️ PrivEsc",
    "map.cat.post":     "🏆 Post-Exploitation",
    "map.cat.password": "🔑 Passwords",
    "map.cat.ctf":      "🎯 CTF / Crypto",
    // Favorites
    "btn.favorites": "⭐ Favs",
    "btn.shortcuts": "⌨",
    "fav.title": "⭐ Favorites",
    "fav.close": "✕ Close",
    "fav.empty": "No favorites saved yet. Click ☆ on any node to bookmark it.",
    "fav.add": "Add to favorites",
    "fav.remove": "Remove from favorites",
    "done.mark": "Mark as done",
    "done.unmark": "Mark as not done",
    "node.copyall": "Copy all",
    "toast.favorited": "⭐ Added to favorites",
    "toast.unfavorited": "Removed from favorites",
    "toast.done": "✓ Marked as done",
    "toast.undone": "Marked as not done",
    "toast.copyall": "All commands copied!",
    "recent.title": "🕐 Recent",
    "shortcuts.title": "⌨ Keyboard Shortcuts",
    "shortcuts.close": "✕ Close",
    "map.progress": "nodes done",
    // Misc
    "breadcrumb.home": "🏠 Start",
    "toast.notfound": "Node not found:",
    "copy.btn": "⎘",
    "search.noresult": "No results for",
  }
};
