/* BLENCI BUILDER — bottom library drawer: LAYOUTS / GIMMICKS / FONTS / PRESETS. */
window.Builder = window.Builder || {};

(() => {
  "use strict";
  let root = null;
  let panelEl = null;   // the outer #bp-drawer-panel — set once, never reassigned
  let contentEl = null; // inner container that render*() functions fill — rebuilt every open()
  let activeDrawer = null;
  let catalogFilter = "";

  function mount(rootEl, panelElArg) {
    root = rootEl;
    panelEl = panelElArg;
    root.querySelectorAll("[data-drawer]").forEach((btn) => {
      btn.addEventListener("click", () => toggle(btn.dataset.drawer));
    });
    // Capture phase: this must evaluate e.target's DOM position BEFORE any
    // bubble-phase click handler on the clicked element runs — several
    // buttons in this drawer (e.g. catalogue ADD/REMOVE) re-render their own
    // container's innerHTML on click, which detaches the clicked element
    // from the document. A bubble-phase listener would then see a detached
    // e.target and wrongly treat it as an outside click.
    document.addEventListener("click", (e) => {
      if (!activeDrawer) return;
      if (panelEl.contains(e.target) || root.contains(e.target)) return;
      close();
    }, true);
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && activeDrawer) close(); });
  }

  function toggle(name) {
    if (activeDrawer === name) { close(); return; }
    open(name);
  }

  function open(name) {
    activeDrawer = name;
    catalogFilter = "";
    root.querySelectorAll("[data-drawer]").forEach((b) => b.classList.toggle("active", b.dataset.drawer === name));
    panelEl.classList.add("open");
    panelEl.innerHTML = "";
    const bar = document.createElement("div");
    bar.className = "bp-drawer-closebar";
    bar.innerHTML = `<span class="bp-drawer-title">${name.toUpperCase()}</span><button type="button" class="bp-mini-btn bp-drawer-close">CLOSE ✕</button>`;
    panelEl.appendChild(bar);
    bar.querySelector(".bp-drawer-close").addEventListener("click", close);
    contentEl = document.createElement("div");
    contentEl.className = "bp-drawer-content";
    panelEl.appendChild(contentEl);
    if (name === "layouts") renderLayouts();
    if (name === "gimmicks") renderGimmicks();
    if (name === "fonts") renderFonts();
    if (name === "presets") renderPresets();
  }

  function close() {
    activeDrawer = null;
    root.querySelectorAll("[data-drawer]").forEach((b) => b.classList.remove("active"));
    panelEl.classList.remove("open");
    panelEl.innerHTML = "";
    contentEl = null;
  }

  function renderLayouts() {
    contentEl.innerHTML = `<div class="bp-hgallery bp-hgallery--drawer" id="bp-drawer-hgallery">
      <div class="bp-hgallery-track">
        ${BUILDER_LAYOUTS.map((l) => `
          <div class="bp-drawer-card bp-drawer-card--portrait">
            <div class="bp-drawer-thumb bp-drawer-thumb--portrait" data-layout-preview="${l.id}"></div>
            <p class="bp-drawer-card-name">${l.name}</p>
            <p class="bp-drawer-card-desc">${l.description}</p>
            <p class="bp-drawer-card-meta">${l.sectionCount} section · ${l.objectCount} objects</p>
            <button type="button" class="bp-mini-btn bp-use-layout" data-id="${l.id}">USE LAYOUT</button>
          </div>
        `).join("")}
      </div>
    </div>`;
    contentEl.querySelectorAll("[data-layout-preview]").forEach((el) => {
      Builder.layoutPreview.mountInto(el, el.dataset.layoutPreview);
    });
    const gallery = contentEl.querySelector("#bp-drawer-hgallery");
    gallery.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      gallery.scrollLeft += e.deltaY;
    }, { passive: false });
    Builder.layoutPreview.enableDepthHover(gallery, ".bp-layout-preview");
    contentEl.querySelectorAll(".bp-use-layout").forEach((btn) => btn.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("bp:use-layout", { detail: btn.dataset.id }));
      close();
    }));
  }

  function renderGimmicks() {
    const selectedId = Builder.state.getSelected();
    const obj = selectedId && Builder.state.getObject(selectedId);
    if (!obj) {
      contentEl.innerHTML = `<p class="bp-hint bp-drawer-empty">プレビューでオブジェクトを選択すると、適用できるギミックが表示されます。</p>`;
      return;
    }
    const applicable = BUILDER_GIMMICKS.filter((g) => g.applicableTo.includes(obj.type));
    contentEl.innerHTML = `<p class="bp-drawer-context">対象: ${obj.label}</p><div class="bp-drawer-grid">
      ${applicable.map((g) => `
        <div class="bp-drawer-card">
          <p class="bp-drawer-card-name">${g.name}</p>
          <p class="bp-drawer-card-desc">${g.desc}</p>
          <p class="bp-drawer-card-meta">${g.event.toUpperCase()} · ${g.performance} · mobile: ${g.mobileSupport}</p>
          <button type="button" class="bp-mini-btn bp-apply-gimmick" data-id="${g.id}" data-event="${g.event}">APPLY</button>
        </div>
      `).join("")}
    </div>
    <div class="bp-catalog-section">
      <p class="bp-catalog-heading">GIMMICK カタログから指定（参考・このプレビューでは再生されません）</p>
      <p class="bp-hint">120種類のカタログから、このオブジェクトに使ってほしいギミックを選んでおけます。選んだ内容はEXPORT BLUEPRINTの引き継ぎ資料に、開発担当への指示として記載されます。</p>
      <div class="bp-catalog-selected" id="bp-catalog-selected"></div>
      <input type="text" class="bp-input bp-catalog-search" id="bp-catalog-search" placeholder="番号または名前で検索…" value="${escapeAttr(catalogFilter)}">
      <div class="bp-catalog-list" id="bp-catalog-list"></div>
    </div>`;
    contentEl.querySelectorAll(".bp-apply-gimmick").forEach((btn) => btn.addEventListener("click", () => {
      Builder.state.setEffect(selectedId, btn.dataset.event, btn.dataset.id);
      window.dispatchEvent(new CustomEvent("bp:effect-applied", { detail: { id: selectedId } }));
    }));
    renderCatalogSelected(selectedId, obj);
    renderCatalogList(selectedId, obj);
    const search = contentEl.querySelector("#bp-catalog-search");
    search.addEventListener("input", (e) => {
      catalogFilter = e.target.value;
      renderCatalogList(selectedId, Builder.state.getObject(selectedId));
    });
  }

  function renderCatalogSelected(objectId, obj) {
    const holder = contentEl.querySelector("#bp-catalog-selected");
    if (!holder) return;
    const list = obj.catalogGimmicks || [];
    if (!list.length) { holder.innerHTML = `<p class="bp-hint">未選択</p>`; return; }
    holder.innerHTML = list.map((g) => `
      <span class="bp-catalog-chip">#${g.num} ${g.name}<button type="button" class="bp-catalog-chip-remove" data-num="${escapeAttr(g.num)}" aria-label="削除">✕</button></span>
    `).join("");
    holder.querySelectorAll(".bp-catalog-chip-remove").forEach((btn) => btn.addEventListener("click", () => {
      const entry = list.find((g) => g.num === btn.dataset.num);
      Builder.state.toggleCatalogGimmick(objectId, entry);
      renderCatalogSelected(objectId, Builder.state.getObject(objectId));
      renderCatalogList(objectId, Builder.state.getObject(objectId));
    }));
  }

  function renderCatalogList(objectId, obj) {
    const holder = contentEl.querySelector("#bp-catalog-list");
    if (!holder) return;
    const q = catalogFilter.trim().toLowerCase();
    const selectedNums = new Set((obj.catalogGimmicks || []).map((g) => g.num));
    const items = BUILDER_GIMMICK_CATALOG.filter((g) => !q || g.num.toLowerCase().includes(q) || g.name.toLowerCase().includes(q));
    if (!items.length) { holder.innerHTML = `<p class="bp-hint">該当するギミックがありません。</p>`; return; }
    let lastGroup = null;
    let html = "";
    items.forEach((g) => {
      if (g.group !== lastGroup) { html += `<p class="bp-catalog-group">${g.group}</p>`; lastGroup = g.group; }
      const added = selectedNums.has(g.num);
      html += `<div class="bp-catalog-row">
        <span class="bp-catalog-num">#${g.num}</span>
        <span class="bp-catalog-name">${g.name}</span>
        <button type="button" class="bp-mini-btn bp-catalog-toggle ${added ? "added" : ""}" data-num="${escapeAttr(g.num)}">${added ? "✓ ADDED" : "+ ADD"}</button>
      </div>`;
    });
    holder.innerHTML = html;
    holder.querySelectorAll(".bp-catalog-toggle").forEach((btn) => btn.addEventListener("click", () => {
      const entry = BUILDER_GIMMICK_CATALOG.find((g) => g.num === btn.dataset.num);
      Builder.state.toggleCatalogGimmick(objectId, entry);
      renderCatalogSelected(objectId, Builder.state.getObject(objectId));
      renderCatalogList(objectId, Builder.state.getObject(objectId));
    }));
  }

  function renderFonts() {
    contentEl.innerHTML = `
      <div class="bp-font-target-row">
        <span class="bp-field-label">適用範囲</span>
        <select class="bp-select" id="bp-font-target">
          <option value="selected">Selected Object</option>
          <option value="headings">All Headings</option>
          <option value="body">All Body Text</option>
          <option value="page">Entire Page</option>
        </select>
      </div>
      <div class="bp-drawer-grid bp-font-grid">
        ${BUILDER_FONTS.map((f) => `
          <div class="bp-drawer-card">
            <p class="bp-drawer-card-name" style="font-family:${f.family};font-size:22px;">${f.name}</p>
            <p class="bp-drawer-card-meta">${f.category}</p>
            <button type="button" class="bp-mini-btn bp-apply-font" data-id="${f.id}">APPLY</button>
          </div>
        `).join("")}
      </div>
    `;
    contentEl.querySelectorAll(".bp-apply-font").forEach((btn) => btn.addEventListener("click", () => {
      const target = contentEl.querySelector("#bp-font-target").value;
      window.dispatchEvent(new CustomEvent("bp:apply-font", { detail: { fontId: btn.dataset.id, target } }));
    }));
  }

  function renderPresets() {
    contentEl.innerHTML = `<div class="bp-drawer-grid">
      ${BUILDER_PRESETS.map((p) => `
        <div class="bp-drawer-card">
          <p class="bp-drawer-card-name">${p.name}</p>
          <p class="bp-drawer-card-meta">${BUILDER_FONTS_BY_ID[p.fonts.heading].name} / ${BUILDER_FONTS_BY_ID[p.fonts.body].name}</p>
          <p class="bp-drawer-card-meta">Accent ${p.palette.accent}</p>
          <button type="button" class="bp-mini-btn bp-apply-preset" data-id="${p.id}">APPLY PRESET</button>
        </div>
      `).join("")}
    </div>`;
    contentEl.querySelectorAll(".bp-apply-preset").forEach((btn) => btn.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("bp:use-preset", { detail: btn.dataset.id }));
      close();
    }));
  }

  function escapeAttr(s) { return String(s || "").replace(/"/g, "&quot;"); }

  window.Builder.libraryDrawer = { mount, open, close };
})();
