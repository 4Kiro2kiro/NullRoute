// ─── GTFOBins Panel ──────────────────────────────────────────────────────────

let gtfoOpen = false;
let lolbasOpen = false;
let payloadsOpen = false;

// Defined locally so panels.js has no load-order dependency on app.js
var PANEL_COPY_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
var PANEL_CHECK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';

function panelCopyBtn(text) {
  return `<button class="copy-btn" data-copy="${encodeURIComponent(text)}" onclick="copyFromData(this)" title="Copy">${PANEL_COPY_SVG}</button>`;
}

const FUNC_COLORS = {
  "shell":                      "#4caf50",
  "sudo":                       "#ff9800",
  "suid":                       "#f44336",
  "reverse-shell":              "#e91e63",
  "non-interactive-reverse-shell": "#e91e63",
  "bind-shell":                 "#9c27b0",
  "non-interactive-bind-shell": "#9c27b0",
  "file-read":                  "#00b4d8",
  "file-write":                 "#00bcd4",
  "upload":                     "#3f51b5",
  "download":                   "#2196f3",
  "library-load":               "#795548",
  "capabilities":               "#607d8b",
  "command":                    "#8bc34a",
};

const FUNC_LABELS_FR = {
  "shell": "Shell", "sudo": "Sudo", "suid": "SUID",
  "reverse-shell": "Rev Shell", "non-interactive-reverse-shell": "Rev Shell NI",
  "bind-shell": "Bind Shell", "non-interactive-bind-shell": "Bind Shell NI",
  "file-read": "Lecture", "file-write": "Écriture",
  "upload": "Upload", "download": "Download",
  "library-load": "Lib Load", "capabilities": "Cap", "command": "Cmd",
};
const FUNC_LABELS_EN = {
  "shell": "Shell", "sudo": "Sudo", "suid": "SUID",
  "reverse-shell": "Rev Shell", "non-interactive-reverse-shell": "Rev Shell NI",
  "bind-shell": "Bind Shell", "non-interactive-bind-shell": "Bind Shell NI",
  "file-read": "File Read", "file-write": "File Write",
  "upload": "Upload", "download": "Download",
  "library-load": "Lib Load", "capabilities": "Cap", "command": "Cmd",
};

function funcLabel(fn) {
  return (LANG === "fr" ? FUNC_LABELS_FR : FUNC_LABELS_EN)[fn] || fn;
}

// ── GTFOBins ──────────────────────────────────────────────────────────────────

function toggleGTFO() {
  const overlay = document.getElementById("gtfo-overlay");
  const panel   = document.getElementById("gtfo-panel");
  gtfoOpen = !gtfoOpen;
  overlay.classList.toggle("hidden", !gtfoOpen);
  panel.classList.toggle("open", gtfoOpen);
  if (gtfoOpen) {
    document.getElementById("gtfo-search").focus();
    renderGTFOList("");
  }
}

function closeGTFO() {
  gtfoOpen = false;
  document.getElementById("gtfo-overlay").classList.add("hidden");
  document.getElementById("gtfo-panel").classList.remove("open");
}

function renderGTFOList(query) {
  if (typeof GTFOBINS === "undefined") {
    document.getElementById("gtfo-list").innerHTML = '<div class="panel-loading">Chargement GTFOBins…</div>';
    return;
  }
  const q = query.toLowerCase().trim();
  const entries = Object.values(GTFOBINS).filter(b =>
    !q || b.name.toLowerCase().includes(q)
  ).sort((a, b) => a.name.localeCompare(b.name));

  if (entries.length === 0) {
    document.getElementById("gtfo-list").innerHTML = `<div class="no-results">${t("gtfo.noresult")}</div>`;
    return;
  }
  document.getElementById("gtfo-list").innerHTML = entries.map(b => `
    <div class="gtfo-item" onclick="selectGTFO('${b.name}')">
      <span class="gtfo-name">${escHtml(b.name)}</span>
      <div class="gtfo-tags">
        ${b.functions.map(fn => `<span class="func-tag" style="background:${FUNC_COLORS[fn]||'#555'}">${funcLabel(fn)}</span>`).join("")}
      </div>
    </div>
  `).join("");
}

function selectGTFO(name) {
  const b = GTFOBINS[name];
  if (!b) return;
  const detail = document.getElementById("gtfo-detail");

  const sections = b.functions.map(fn => {
    const variants = b[fn] || [];
    if (!variants.length) return "";
    return `
      <div class="gtfo-section">
        <div class="gtfo-fn-title" style="border-color:${FUNC_COLORS[fn]||'#555'}">
          <span class="func-tag" style="background:${FUNC_COLORS[fn]||'#555'}">${funcLabel(fn)}</span>
        </div>
        ${variants.map((v) => `
          <div class="gtfo-variant">
            ${v.comment ? `<div class="gtfo-comment">${escHtml(v.comment)}</div>` : ""}
            <div class="command-code-wrap">
              <pre class="command-code">${escHtml(v.code)}</pre>
              ${panelCopyBtn(v.code)}
            </div>
            ${v.sudo_code ? `<div class="gtfo-ctx-label">Sudo:</div><div class="command-code-wrap"><pre class="command-code">${escHtml(v.sudo_code)}</pre>${panelCopyBtn(v.sudo_code)}</div>` : ""}
            ${v.suid_code ? `<div class="gtfo-ctx-label">SUID:</div><div class="command-code-wrap"><pre class="command-code">${escHtml(v.suid_code)}</pre>${panelCopyBtn(v.suid_code)}</div>` : ""}
          </div>
        `).join("")}
      </div>`;
  }).join("");

  detail.innerHTML = `
    <div class="gtfo-detail-header">
      <h2 class="gtfo-detail-name">${escHtml(b.name)}</h2>
      <div class="gtfo-tags">${b.functions.map(fn => `<span class="func-tag" style="background:${FUNC_COLORS[fn]||'#555'}">${funcLabel(fn)}</span>`).join("")}</div>
    </div>
    ${sections}`;

  document.querySelectorAll(".gtfo-item.selected").forEach(el => el.classList.remove("selected"));
  document.querySelectorAll(".gtfo-item").forEach(el => {
    if (el.querySelector(".gtfo-name")?.textContent === name) el.classList.add("selected");
  });
}

// ── LOLBAS ────────────────────────────────────────────────────────────────────

const LOLBAS_CAT_COLORS = {
  "Download":          "#2196f3",
  "Execute":           "#f44336",
  "AWL Bypass":        "#e91e63",
  "Dump":              "#ff5722",
  "Tunnel":            "#00bcd4",
  "Encode":            "#ff9800",
  "Decode":            "#ff9800",
  "ADS":               "#9c27b0",
  "Bypass":            "#e91e63",
  "Compile":           "#4caf50",
  "Copy":              "#00b4d8",
  "Credentials":       "#795548",
  "Lateral movement":  "#607d8b",
  "Reconnaissance":    "#3f51b5",
  "UAC bypass":        "#ff5722",
};

function toggleLOLBAS() {
  const overlay = document.getElementById("lolbas-overlay");
  const panel   = document.getElementById("lolbas-panel");
  lolbasOpen = !lolbasOpen;
  overlay.classList.toggle("hidden", !lolbasOpen);
  panel.classList.toggle("open", lolbasOpen);
  if (lolbasOpen) {
    document.getElementById("lolbas-search").focus();
    renderLOLBASList("");
  }
}

function closeLOLBAS() {
  lolbasOpen = false;
  document.getElementById("lolbas-overlay").classList.add("hidden");
  document.getElementById("lolbas-panel").classList.remove("open");
}

function renderLOLBASList(query) {
  if (typeof LOLBAS === "undefined") {
    document.getElementById("lolbas-list").innerHTML = '<div class="panel-loading">Chargement LOLBAS…</div>';
    return;
  }
  const q = query.toLowerCase().trim();
  const entries = Object.entries(LOLBAS)
    .filter(([, b]) => !q || b.name.toLowerCase().includes(q) || b.description.toLowerCase().includes(q))
    .sort(([, a], [, b]) => a.name.localeCompare(b.name));

  if (entries.length === 0) {
    document.getElementById("lolbas-list").innerHTML = `<div class="no-results">${t("lolbas.noresult")}</div>`;
    return;
  }

  document.getElementById("lolbas-list").innerHTML = entries.map(([key, b]) => {
    const cats = [...new Set(b.commands.map(c => c.category || "Other"))];
    return `
      <div class="gtfo-item" onclick="selectLOLBAS('${escHtml(key)}')">
        <span class="gtfo-name">${escHtml(b.name)}</span>
        <div class="gtfo-tags">
          ${cats.map(c => `<span class="func-tag" style="background:${LOLBAS_CAT_COLORS[c]||'#555'}">${escHtml(c)}</span>`).join("")}
        </div>
      </div>`;
  }).join("");
}

function selectLOLBAS(key) {
  const b = LOLBAS[key];
  if (!b) return;
  const detail = document.getElementById("lolbas-detail");

  const pathsHtml = b.path && b.path.length ? `
    <div class="gtfo-section">
      <div class="gtfo-fn-title" style="border-color:#607d8b"><span class="func-tag" style="background:#607d8b">Paths</span></div>
      ${b.path.map(p => `<div class="command-code-wrap"><pre class="command-code">${escHtml(p)}</pre>${panelCopyBtn(p)}</div>`).join("")}
    </div>` : "";

  const cmdsHtml = b.commands.map(c => {
    const color = LOLBAS_CAT_COLORS[c.category] || "#555";
    return `
      <div class="gtfo-section">
        <div class="gtfo-fn-title" style="border-color:${color}">
          <span class="func-tag" style="background:${color}">${escHtml(c.category||"Cmd")}</span>
          <span class="lolbas-usecase">${escHtml(c.usecase||"")}</span>
          ${c.mitre ? `<span class="mitre-badge">${escHtml(c.mitre)}</span>` : ""}
        </div>
        <div class="gtfo-comment">${escHtml(c.desc||"")}</div>
        <div class="command-code-wrap">
          <pre class="command-code">${escHtml(c.cmd)}</pre>
          ${panelCopyBtn(c.cmd)}
        </div>
        ${c.privileges ? `<div class="gtfo-ctx-label">Privileges: ${escHtml(c.privileges)}</div>` : ""}
      </div>`;
  }).join("");

  detail.innerHTML = `
    <div class="gtfo-detail-header">
      <h2 class="gtfo-detail-name">${escHtml(b.name)}</h2>
      <p class="gtfo-desc">${escHtml(b.description)}</p>
    </div>
    ${pathsHtml}
    ${cmdsHtml}`;

  document.querySelectorAll("#lolbas-list .gtfo-item.selected").forEach(el => el.classList.remove("selected"));
  document.querySelectorAll("#lolbas-list .gtfo-item").forEach(el => {
    if (el.querySelector(".gtfo-name")?.textContent === b.name) el.classList.add("selected");
  });
}

// ── Payloads Panel ────────────────────────────────────────────────────────────

let payloadCurrentId = null;

function togglePayloads() {
  const overlay = document.getElementById("payloads-overlay");
  const panel   = document.getElementById("payloads-panel");
  payloadsOpen = !payloadsOpen;
  overlay.classList.toggle("hidden", !payloadsOpen);
  panel.classList.toggle("open", payloadsOpen);
  if (payloadsOpen) {
    document.getElementById("payloads-search").focus();
    renderPayloadsList("");
  }
}

function closePayloads() {
  payloadsOpen = false;
  document.getElementById("payloads-overlay").classList.add("hidden");
  document.getElementById("payloads-panel").classList.remove("open");
}

function renderPayloadsList(query) {
  if (typeof PAYLOADS === "undefined") {
    document.getElementById("payloads-list").innerHTML = '<div class="panel-loading">Chargement Payloads…</div>';
    return;
  }
  const q = query.toLowerCase().trim();
  const entries = Object.values(PAYLOADS).filter(p =>
    !q ||
    p.name.toLowerCase().includes(q) ||
    (p.name_fr && p.name_fr.toLowerCase().includes(q)) ||
    p.id.toLowerCase().includes(q)
  );

  document.getElementById("payloads-list").innerHTML = entries.map(p => `
    <div class="gtfo-item ${payloadCurrentId === p.id ? 'selected' : ''}" onclick="selectPayload('${p.id}')">
      <span class="payload-icon">${p.icon || "💥"}</span>
      <span class="gtfo-name">${LANG === "fr" && p.name_fr ? escHtml(p.name_fr) : escHtml(p.name)}</span>
    </div>
  `).join("");
}

function selectPayload(id) {
  const p = PAYLOADS[id];
  if (!p) return;
  payloadCurrentId = id;
  const detail = document.getElementById("payloads-detail");
  detail.innerHTML = "";

  // Build a safe code+copy block using DOM APIs (textContent = XSS-proof)
  function makeCodeWrap(text, extraClass) {
    const wrap = document.createElement("div");
    wrap.className = "command-code-wrap";
    const pre = document.createElement("pre");
    pre.className = "command-code" + (extraClass ? " " + extraClass : "");
    pre.textContent = text; // textContent never interprets HTML — 100% XSS-safe
    const btn = document.createElement("button");
    btn.className = "copy-btn";
    btn.dataset.copy = encodeURIComponent(text);
    btn.title = "Copy";
    btn.innerHTML = PANEL_COPY_SVG;
    btn.onclick = function() { copyFromData(this); };
    wrap.appendChild(pre);
    wrap.appendChild(btn);
    return wrap;
  }

  // Header
  const hdr = document.createElement("div");
  hdr.className = "gtfo-detail-header";
  const h2 = document.createElement("h2");
  h2.className = "gtfo-detail-name";
  h2.textContent = (p.icon || "💥") + " " + (LANG === "fr" && p.name_fr ? p.name_fr : p.name);
  hdr.appendChild(h2);
  detail.appendChild(hdr);

  // Payload sections
  (p.sections || []).forEach(sec => {
    const section = document.createElement("div");
    section.className = "payload-section";
    const h4 = document.createElement("h4");
    h4.className = "payload-sec-title";
    h4.textContent = LANG === "fr" && sec.title_fr ? sec.title_fr : sec.title;
    section.appendChild(h4);
    const list = document.createElement("div");
    list.className = "payload-list";
    (sec.payloads || []).forEach(pl => list.appendChild(makeCodeWrap(pl, "payload-code")));
    section.appendChild(list);
    detail.appendChild(section);
  });

  // Tools section
  if (p.tools && p.tools.length) {
    const section = document.createElement("div");
    section.className = "payload-section";
    const h4 = document.createElement("h4");
    h4.className = "payload-sec-title";
    h4.textContent = t("payloads.tools");
    section.appendChild(h4);
    p.tools.forEach(tool => section.appendChild(makeCodeWrap(tool, "")));
    detail.appendChild(section);
  }

  // Detection section
  if (p.detection && p.detection.length) {
    const section = document.createElement("div");
    section.className = "payload-section";
    const h4 = document.createElement("h4");
    h4.className = "payload-sec-title";
    h4.textContent = t("payloads.detection");
    section.appendChild(h4);
    const ul = document.createElement("ul");
    p.detection.forEach(d => {
      const li = document.createElement("li");
      li.textContent = d;
      ul.appendChild(li);
    });
    section.appendChild(ul);
    detail.appendChild(section);
  }

  renderPayloadsList(document.getElementById("payloads-search").value);
}

// ── Shared utils ──────────────────────────────────────────────────────────────

function copyText(btn, text) {
  navigator.clipboard.writeText(text).then(() => {
    btn.innerHTML = PANEL_CHECK_SVG;
    btn.classList.add("copied");
    setTimeout(() => { btn.innerHTML = PANEL_COPY_SVG; btn.classList.remove("copied"); }, 1500);
  }).catch(() => {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    btn.innerHTML = PANEL_CHECK_SVG;
    btn.classList.add("copied");
    setTimeout(() => { btn.innerHTML = PANEL_COPY_SVG; btn.classList.remove("copied"); }, 1500);
  });
}
