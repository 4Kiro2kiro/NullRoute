// ─── State ────────────────────────────────────────────────────────────────────

let targetIp    = localStorage.getItem("nullroute_target_ip") || "";
let favorites   = [];
let doneNodes   = new Set();
let recentNodes = [];

// ─── Favorites ────────────────────────────────────────────────────────────────

function isFavorite(id) { return favorites.includes(id); }

function toggleFavorite(id) {
  if (isFavorite(id)) {
    favorites = favorites.filter(f => f !== id);
  } else {
    favorites.unshift(id);
  }
  saveFavorites();
  renderNode(currentNodeId);
}

function saveFavorites() {
  try { localStorage.setItem("nullroute_favorites", JSON.stringify(favorites)); } catch(e) {}
}

function loadFavorites() {
  try {
    const raw = localStorage.getItem("nullroute_favorites");
    if (raw) favorites = JSON.parse(raw);
  } catch(e) {}
}

function renderFavorites() {
  const el = document.getElementById("fav-content");
  if (!el) return;
  if (favorites.length === 0) {
    el.innerHTML = `<div class="fav-empty">${t("fav.empty")}</div>`;
    return;
  }
  el.innerHTML = `<div class="fav-grid">${
    favorites.map(id => {
      const n = NODES[id];
      if (!n) return "";
      const style = getCategoryStyle(n.category);
      const title = (LANG === "en" && n.title_en) ? n.title_en : n.title;
      return `<button class="fav-item" style="border-color:${style.border}" onclick="selectFav('${id}')">
        <span class="fav-item-icon">${n.icon || ""}</span>
        <span class="fav-item-title">${escHtml(title)}</span>
        <span class="fav-item-cat" style="color:${style.badge}">${n.category}</span>
      </button>`;
    }).join("")
  }</div>`;
}

function selectFav(id) {
  const n = NODES[id];
  if (!n) return;
  toggleFavPanel();
  const title = (LANG === "en" && n.title_en) ? n.title_en : n.title;
  goTo(id, title);
}

function toggleFavPanel() {
  const overlay = document.getElementById("fav-overlay");
  if (!overlay) return;
  if (overlay.classList.contains("hidden")) {
    renderFavorites();
    overlay.classList.remove("hidden");
  } else {
    overlay.classList.add("hidden");
  }
}

// ─── Done Nodes ───────────────────────────────────────────────────────────────

function isDone(id) { return doneNodes.has(id); }

function toggleDone(id) {
  if (isDone(id)) {
    doneNodes.delete(id);
  } else {
    doneNodes.add(id);
  }
  saveDoneNodes();
  renderNode(currentNodeId);
}

function saveDoneNodes() {
  try { localStorage.setItem("nullroute_done", JSON.stringify([...doneNodes])); } catch(e) {}
}

function loadDoneNodes() {
  try {
    const raw = localStorage.getItem("nullroute_done");
    if (raw) doneNodes = new Set(JSON.parse(raw));
  } catch(e) {}
}

// ─── Recent Nodes ─────────────────────────────────────────────────────────────

function addRecent(id) {
  if (id === "start") return;
  recentNodes = [id, ...recentNodes.filter(r => r !== id)].slice(0, 8);
  saveRecent();
}

function saveRecent() {
  try { localStorage.setItem("nullroute_recent", JSON.stringify(recentNodes)); } catch(e) {}
}

function loadRecent() {
  try {
    const raw = localStorage.getItem("nullroute_recent");
    if (raw) recentNodes = JSON.parse(raw);
  } catch(e) {}
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function goTo(nodeId, choiceLabel) {
  if (!NODES[nodeId]) {
    showToast(t("toast.notfound") + " " + nodeId);
    return;
  }
  if (currentNodeId && choiceLabel) {
    history.push({ nodeId: currentNodeId, choiceLabel });
  }
  currentNodeId = nodeId;
  addRecent(nodeId);
  renderNode(nodeId);
  updateBreadcrumb();
  window.scrollTo({ top: 0, behavior: "smooth" });
  saveState();
}

function goBack() {
  if (history.length === 0) return;
  const prev = history.pop();
  currentNodeId = prev.nodeId;
  renderNode(prev.nodeId);
  updateBreadcrumb();
  window.scrollTo({ top: 0, behavior: "smooth" });
  saveState();
}

function goHome() {
  history = [];
  currentNodeId = "start";
  renderNode("start");
  updateBreadcrumb();
  window.scrollTo({ top: 0, behavior: "smooth" });
  saveState();
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const COPY_SVG  = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
const CHECK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;

// ─── Target IP ────────────────────────────────────────────────────────────────

function applyTargetIp(cmd) {
  return targetIp ? cmd.replace(/TARGET_IP/g, targetIp) : cmd;
}

function highlightTargetIp(html) {
  if (targetIp) {
    return html.replace(/TARGET_IP/g, `<span class="cmd-target-ip">${escHtml(targetIp)}</span>`);
  }
  return html.replace(/TARGET_IP/g, `<span class="cmd-target-ip-empty">TARGET_IP</span>`);
}

// ─── Syntax highlight ─────────────────────────────────────────────────────────

function highlightCmd(cmd) {
  return cmd.split('\n').map(line => {
    const trimmed = line.trimStart();
    if (trimmed === '') return '<span class="cmd-line"> </span>';
    if (trimmed.startsWith('# ===') || trimmed.startsWith('# ───') || trimmed.startsWith('# ---')) {
      return `<span class="cmd-section">${escHtml(line)}</span>`;
    }
    if (trimmed.startsWith('#')) {
      return `<span class="cmd-comment">${escHtml(line)}</span>`;
    }
    return `<span class="cmd-line">${escHtml(line)}</span>`;
  }).join('\n');
}

// ─── Copy All Commands ────────────────────────────────────────────────────────

function copyAllCommands(nodeId) {
  const node = NODES[nodeId];
  if (!node || !node.commands || node.commands.length === 0) return;
  const text = node.commands.map(c => applyTargetIp(c.cmd)).join("\n\n");
  navigator.clipboard.writeText(text).then(() => {
    showToast(t("toast.copyall"));
  }).catch(() => {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    showToast(t("toast.copyall"));
  });
}

// ─── Render ───────────────────────────────────────────────────────────────────

const CATEGORY_COLORS = {
  recon:    { bg: "#0d3a4a", border: "#00b4d8", badge: "#00b4d8" },
  web:      { bg: "#1a2f1a", border: "#4caf50", badge: "#4caf50" },
  network:  { bg: "#2a1a3a", border: "#9c27b0", badge: "#9c27b0" },
  exploit:  { bg: "#3a1a1a", border: "#f44336", badge: "#f44336" },
  privesc:  { bg: "#3a2a0a", border: "#ff9800", badge: "#ff9800" },
  post:     { bg: "#1a1a2a", border: "#3f51b5", badge: "#3f51b5" },
  password: { bg: "#2a1a2a", border: "#e91e63", badge: "#e91e63" },
  ctf:      { bg: "#1a2a2a", border: "#00bcd4", badge: "#00bcd4" },
};

function getCategoryStyle(cat) {
  return CATEGORY_COLORS[cat] || { bg: "#1a1a1a", border: "#555", badge: "#888" };
}

function renderNode(nodeId) {
  const node = NODES[nodeId];
  if (!node) return;
  const style = getCategoryStyle(node.category);
  const mainContent = document.getElementById("main-content");

  const nodeTitle   = LANG === "en" && node.title_en       ? node.title_en       : node.title;
  const nodeDesc    = LANG === "en" && node.description_en  ? node.description_en  : node.description;
  const nodeLookfor = LANG === "en" && node.lookfor_en      ? node.lookfor_en      : (node.lookfor || []);
  const nodeTips    = LANG === "en" && node.tips_en         ? node.tips_en         : (node.tips    || []);

  const favActive  = isFavorite(nodeId);
  const doneActive = isDone(nodeId);

  let commandsHtml = "";
  if (node.commands && node.commands.length > 0) {
    commandsHtml = `
      <div class="section">
        <div class="section-header">
          <h3><span class="section-icon">⚡</span> ${t("section.commands").replace("⚡ ","")}</h3>
          <button class="copy-all-btn" onclick="copyAllCommands('${nodeId}')">${t("node.copyall")}</button>
        </div>
        ${node.commands.map((c, i) => `
          <div class="command-block">
            <div class="command-label">${escHtml(LANG === "en" && c.label_en ? c.label_en : c.label)}</div>
            <div class="command-code-wrap">
              <pre class="command-code">${highlightTargetIp(highlightCmd(c.cmd))}</pre>
              <button class="copy-btn" data-copy="${encodeURIComponent(applyTargetIp(c.cmd))}" onclick="copyFromData(this)" title="Copy">${COPY_SVG}</button>
            </div>
          </div>
        `).join("")}
      </div>`;
  }

  let lookforHtml = "";
  if (nodeLookfor.length > 0) {
    lookforHtml = `
      <div class="section lookfor-section">
        <h3><span class="section-icon">🔍</span> ${t("section.lookfor").replace("🔍 ","")}</h3>
        <ul>${nodeLookfor.map(l => `<li>${escHtml(l)}</li>`).join("")}</ul>
      </div>`;
  }

  let tipsHtml = "";
  if (nodeTips.length > 0) {
    tipsHtml = `
      <div class="section tips-section">
        <h3><span class="section-icon">💡</span> ${t("section.tips").replace("💡 ","")}</h3>
        <ul>${nodeTips.map(tp => `<li>${escHtml(tp)}</li>`).join("")}</ul>
      </div>`;
  }

  let recentHtml = "";
  if (nodeId === "start" && recentNodes.length > 0) {
    const recentItems = recentNodes.map(id => NODES[id]).filter(Boolean).slice(0, 6);
    if (recentItems.length > 0) {
      recentHtml = `
        <div class="section recent-section">
          <h3><span class="section-icon">🕐</span> ${t("recent.title")}</h3>
          <div class="recent-grid">
            ${recentItems.map(n => {
              const rStyle = getCategoryStyle(n.category);
              const rTitle = (LANG === "en" && n.title_en) ? n.title_en : n.title;
              return `<button class="recent-item" style="border-color:${rStyle.border}" onclick="goTo('${n.id}', '${escHtml(rTitle)}')">
                ${n.icon || ""} ${escHtml(rTitle)}
                ${isDone(n.id) ? '<span class="done-badge">✓</span>' : ''}
              </button>`;
            }).join("")}
          </div>
        </div>`;
    }
  }

  let choicesHtml = "";
  if (node.choices && node.choices.length > 0) {
    choicesHtml = `
      <div class="section choices-section">
        <h3><span class="section-icon">👉</span> ${t("section.choices").replace("👉 ","")}</h3>
        <div class="choices-grid">
          ${node.choices.map(ch => {
            const chLabel = LANG === "en" && ch.label_en ? ch.label_en : ch.label;
            return `
            <button class="choice-btn" onclick="goTo('${ch.next}', '${escHtml(chLabel)}')">
              <span class="choice-icon">${ch.icon || "➤"}</span>
              <span class="choice-text">${escHtml(chLabel)}</span>
            </button>`;
          }).join("")}
        </div>
      </div>`;
  }

  mainContent.innerHTML = `
    <div class="node-card" style="border-color:${style.border}">
      <div class="node-header" style="background:${style.bg}; border-bottom:1px solid ${style.border}">
        <div class="node-meta">
          <span class="category-badge" style="background:${style.badge}">${node.category.toUpperCase()}</span>
          <span class="node-icon-title">${node.icon || ""} ${escHtml(nodeTitle)}</span>
        </div>
        <div class="node-actions">
          <button class="action-btn fav-node-btn${favActive ? ' active' : ''}"
            onclick="toggleFavorite('${nodeId}')"
            title="${favActive ? t('fav.remove') : t('fav.add')}">
            ${favActive ? '⭐' : '☆'}
          </button>
          <button class="action-btn done-node-btn${doneActive ? ' active' : ''}"
            onclick="toggleDone('${nodeId}')"
            title="${doneActive ? t('done.unmark') : t('done.mark')}">
            ${doneActive ? '✓' : '○'}
          </button>
        </div>
      </div>
      <div class="node-description">${escHtml(nodeDesc)}</div>
      ${commandsHtml}
      ${lookforHtml}
      ${tipsHtml}
      ${recentHtml}
      ${choicesHtml}
      ${typeof renderRelatedTerms === "function" ? renderRelatedTerms(node) : ""}
    </div>`;
}

function updateBreadcrumb() {
  const bc = document.getElementById("breadcrumb");
  let parts = [{ nodeId: "start", label: t("breadcrumb.home") }];
  history.forEach(h => {
    parts.push({ nodeId: h.nodeId, label: h.choiceLabel });
  });
  bc.innerHTML = parts.map((p, i) => {
    const isLast = i === parts.length - 1;
    return isLast
      ? `<span class="bc-current">${escHtml(p.label.length > 40 ? p.label.slice(0, 40) + "…" : p.label)}</span>`
      : `<button class="bc-item" onclick="jumpTo(${i})">${escHtml(p.label.length > 30 ? p.label.slice(0, 30) + "…" : p.label)}</button><span class="bc-sep">›</span>`;
  }).join("");
}

function jumpTo(historyIndex) {
  if (historyIndex === 0) {
    goHome();
    return;
  }
  history = history.slice(0, historyIndex);
  currentNodeId = history[history.length - 1]?.nodeId || "start";
  renderNode(currentNodeId);
  updateBreadcrumb();
  saveState();
}

// ─── Search ───────────────────────────────────────────────────────────────────

function searchNodes(query) {
  const q = query.toLowerCase().trim();
  if (!q) {
    document.getElementById("search-results").classList.add("hidden");
    return;
  }
  const results = Object.values(NODES).filter(n => {
    return n.title.toLowerCase().includes(q) ||
      (n.title_en && n.title_en.toLowerCase().includes(q)) ||
      n.description.toLowerCase().includes(q) ||
      (n.description_en && n.description_en.toLowerCase().includes(q)) ||
      (n.commands || []).some(c =>
        c.cmd.toLowerCase().includes(q) ||
        c.label.toLowerCase().includes(q) ||
        (c.label_en && c.label_en.toLowerCase().includes(q))
      ) ||
      (n.tips || []).some(tip => tip.toLowerCase().includes(q)) ||
      (n.tips_en || []).some(tip => tip.toLowerCase().includes(q)) ||
      n.category.toLowerCase().includes(q);
  });
  const panel = document.getElementById("search-results");
  if (results.length === 0) {
    panel.innerHTML = `<div class="no-results">${t("search.noresult")} "${escHtml(query)}"</div>`;
  } else {
    panel.innerHTML = results.map(n => {
      const style = getCategoryStyle(n.category);
      const title = (LANG === "en" && n.title_en) ? n.title_en : n.title;
      return `<div class="search-item" onclick="selectSearch('${n.id}')">
        <span class="search-badge" style="background:${style.badge}">${n.category}</span>
        <span class="search-icon">${n.icon || ""}</span>
        <span class="search-title">${escHtml(title)}</span>
      </div>`;
    }).join("");
  }
  panel.classList.remove("hidden");
}

function selectSearch(nodeId) {
  document.getElementById("search-input").value = "";
  document.getElementById("search-results").classList.add("hidden");
  const n = NODES[nodeId];
  const title = n ? ((LANG === "en" && n.title_en) ? n.title_en : n.title) : nodeId;
  goTo(nodeId, title);
}

// ─── Clipboard ────────────────────────────────────────────────────────────────

function copyFromData(btn) {
  const text = decodeURIComponent(btn.dataset.copy || "");
  navigator.clipboard.writeText(text).then(() => {
    btn.innerHTML = CHECK_SVG;
    btn.classList.add("copied");
    setTimeout(() => { btn.innerHTML = COPY_SVG; btn.classList.remove("copied"); }, 1500);
  }).catch(() => {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    btn.innerHTML = CHECK_SVG;
    btn.classList.add("copied");
    setTimeout(() => { btn.innerHTML = COPY_SVG; btn.classList.remove("copied"); }, 1500);
  });
}

function copyCmd(btn, cmdIndex, nodeId) {
  const node = NODES[nodeId];
  if (!node) return;
  copyFromData(Object.assign(btn, { dataset: { copy: encodeURIComponent(node.commands[cmdIndex].cmd) } }));
}

function showToast(msg) {
  const el = document.createElement("div");
  el.className = "toast";
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2500);
}

// ─── Persistence ──────────────────────────────────────────────────────────────

function saveState() {
  try {
    localStorage.setItem("nullroute_node", currentNodeId);
    localStorage.setItem("nullroute_history", JSON.stringify(history));
    localStorage.setItem("nullroute_target_ip", targetIp);
  } catch(e) {}
}

function loadState() {
  try {
    const node = localStorage.getItem("nullroute_node");
    const hist = localStorage.getItem("nullroute_history");
    if (node && NODES[node]) {
      currentNodeId = node;
      history = hist ? JSON.parse(hist) : [];
    }
  } catch(e) {}
}

// ─── Map View ─────────────────────────────────────────────────────────────────

function toggleMap() {
  const overlay = document.getElementById("map-overlay");
  if (overlay.classList.contains("hidden")) {
    renderMap();
    overlay.classList.remove("hidden");
  } else {
    overlay.classList.add("hidden");
  }
}

function renderMap() {
  const container = document.getElementById("map-content");
  const categories = {};
  Object.values(NODES).forEach(n => {
    if (!categories[n.category]) categories[n.category] = [];
    categories[n.category].push(n);
  });

  const total = Object.keys(NODES).length;
  const done  = [...doneNodes].filter(id => NODES[id]).length;

  const progressHtml = `<div class="map-progress">
    <span class="map-progress-count">${done} / ${total}</span>
    <span class="map-progress-label">${t("map.progress")}</span>
    <div class="map-progress-bar"><div class="map-progress-fill" style="width:${Math.round(done/total*100)}%"></div></div>
  </div>`;

  container.innerHTML = progressHtml + Object.entries(categories).map(([cat, nodes]) => {
    const style = getCategoryStyle(cat);
    const catLabel = t("map.cat." + cat) || cat.toUpperCase();
    return `<div class="map-category">
      <h3 style="color:${style.badge}">${catLabel}</h3>
      <div class="map-nodes">
        ${nodes.map(n => {
          const title = (LANG === "en" && n.title_en) ? n.title_en : n.title;
          const doneCls = isDone(n.id) ? " done" : "";
          const favCls  = isFavorite(n.id) ? " fav" : "";
          return `<button class="map-node-btn${doneCls}${favCls}" style="border-color:${style.border}" onclick="selectMapNode('${n.id}')">
            ${isDone(n.id) ? '<span class="map-done-check">✓</span>' : ''}
            ${n.icon || ""} ${escHtml(title)}
          </button>`;
        }).join("")}
      </div>
    </div>`;
  }).join("");
}

function selectMapNode(nodeId) {
  document.getElementById("map-overlay").classList.add("hidden");
  const n = NODES[nodeId];
  const title = n ? ((LANG === "en" && n.title_en) ? n.title_en : n.title) : nodeId;
  goTo(nodeId, title);
}

// ─── Shortcuts Overlay ────────────────────────────────────────────────────────

function showShortcuts() {
  const overlay = document.getElementById("shortcuts-overlay");
  if (overlay) overlay.classList.remove("hidden");
}

function hideShortcuts() {
  const overlay = document.getElementById("shortcuts-overlay");
  if (overlay) overlay.classList.add("hidden");
}

// ─── Utils ────────────────────────────────────────────────────────────────────

function escHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ─── Init ─────────────────────────────────────────────────────────────────────

document.addEventListener("DOMContentLoaded", () => {
  loadFavorites();
  loadDoneNodes();
  loadRecent();
  loadState();
  renderNode(currentNodeId);
  updateBreadcrumb();

  const targetIpInput = document.getElementById("target-ip-input");
  if (targetIpInput) {
    targetIpInput.value = targetIp;
    targetIpInput.addEventListener("input", e => {
      targetIp = e.target.value.trim();
      saveState();
      renderNode(currentNodeId);
    });
  }

  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", e => searchNodes(e.target.value));
  searchInput.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      searchInput.value = "";
      document.getElementById("search-results").classList.add("hidden");
    }
  });

  document.addEventListener("click", e => {
    if (!e.target.closest("#search-container")) {
      document.getElementById("search-results").classList.add("hidden");
    }
    if (!e.target.closest("#fav-overlay") && !e.target.closest("[onclick*='toggleFavPanel']")) {
      const favOverlay = document.getElementById("fav-overlay");
      if (favOverlay && !favOverlay.classList.contains("hidden")) {
        favOverlay.classList.add("hidden");
      }
    }
  });

  document.addEventListener("keydown", e => {
    const inInput = e.target.matches("input, textarea");
    if (e.key === "Backspace" && !inInput) goBack();
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      searchInput.focus();
    }
    if (e.key === "?" && !inInput) {
      e.preventDefault();
      showShortcuts();
    }
    if (e.key === "Escape") {
      document.getElementById("map-overlay").classList.add("hidden");
      document.getElementById("fav-overlay")?.classList.add("hidden");
      hideShortcuts();
      if (typeof closeDocs === "function") closeDocs();
    }
  });

  if (typeof renderDocList === "function") {
    renderDocList();
    renderDocDetail(null);
  }

  // Apply initial language
  if (typeof applyLang === "function") applyLang();
  if (typeof LANG !== "undefined") {
    const fr = document.getElementById("lang-fr");
    const en = document.getElementById("lang-en");
    if (fr) fr.classList.toggle("active", LANG === "fr");
    if (en) en.classList.toggle("active", LANG === "en");
  }

  // Keyboard: close side panels on Escape
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      if (typeof closeGTFO    === "function" && document.getElementById("gtfo-panel")?.classList.contains("open"))    closeGTFO();
      else if (typeof closeLOLBAS  === "function" && document.getElementById("lolbas-panel")?.classList.contains("open"))  closeLOLBAS();
      else if (typeof closePayloads === "function" && document.getElementById("payloads-panel")?.classList.contains("open")) closePayloads();
    }
  });
});
