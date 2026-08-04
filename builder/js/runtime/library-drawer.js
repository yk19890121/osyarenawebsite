/* BLENCI BUILDER — bottom library drawer: LAYOUTS / GIMMICKS / FONTS / PRESETS. */
window.Builder = window.Builder || {};

(() => {
  "use strict";
  let root = null;
  let panel = null;
  let activeDrawer = null;

  function mount(rootEl, panelEl) {
    root = rootEl;
    panel = panelEl;
    root.querySelectorAll("[data-drawer]").forEach((btn) => {
      btn.addEventListener("click", () => toggle(btn.dataset.drawer));
    });
  }

  function toggle(name) {
    if (activeDrawer === name) { close(); return; }
    open(name);
  }

  function open(name) {
    activeDrawer = name;
    root.querySelectorAll("[data-drawer]").forEach((b) => b.classList.toggle("active", b.dataset.drawer === name));
    panel.classList.add("open");
    if (name === "layouts") renderLayouts();
    if (name === "gimmicks") renderGimmicks();
    if (name === "fonts") renderFonts();
    if (name === "presets") renderPresets();
  }

  function close() {
    activeDrawer = null;
    root.querySelectorAll("[data-drawer]").forEach((b) => b.classList.remove("active"));
    panel.classList.remove("open");
    panel.innerHTML = "";
  }

  function renderLayouts() {
    panel.innerHTML = `<div class="bp-drawer-grid">
      ${BUILDER_LAYOUTS.map((l) => `
        <div class="bp-drawer-card">
          <div class="bp-drawer-thumb" style="background-image:url(${l.thumbnail})"></div>
          <p class="bp-drawer-card-name">${l.name}</p>
          <p class="bp-drawer-card-desc">${l.description}</p>
          <p class="bp-drawer-card-meta">${l.sectionCount} section · ${l.objectCount} objects</p>
          <button type="button" class="bp-mini-btn bp-use-layout" data-id="${l.id}">USE LAYOUT</button>
        </div>
      `).join("")}
    </div>`;
    panel.querySelectorAll(".bp-use-layout").forEach((btn) => btn.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("bp:use-layout", { detail: btn.dataset.id }));
      close();
    }));
  }

  function renderGimmicks() {
    const selectedId = Builder.state.getSelected();
    const obj = selectedId && Builder.state.getObject(selectedId);
    if (!obj) {
      panel.innerHTML = `<p class="bp-hint bp-drawer-empty">プレビューでオブジェクトを選択すると、適用できるギミックが表示されます。</p>`;
      return;
    }
    const applicable = BUILDER_GIMMICKS.filter((g) => g.applicableTo.includes(obj.type));
    panel.innerHTML = `<p class="bp-drawer-context">対象: ${obj.label}</p><div class="bp-drawer-grid">
      ${applicable.map((g) => `
        <div class="bp-drawer-card">
          <p class="bp-drawer-card-name">${g.name}</p>
          <p class="bp-drawer-card-desc">${g.desc}</p>
          <p class="bp-drawer-card-meta">${g.event.toUpperCase()} · ${g.performance} · mobile: ${g.mobileSupport}</p>
          <button type="button" class="bp-mini-btn bp-apply-gimmick" data-id="${g.id}" data-event="${g.event}">APPLY</button>
        </div>
      `).join("")}
    </div>`;
    panel.querySelectorAll(".bp-apply-gimmick").forEach((btn) => btn.addEventListener("click", () => {
      Builder.state.setEffect(selectedId, btn.dataset.event, btn.dataset.id);
      window.dispatchEvent(new CustomEvent("bp:effect-applied", { detail: { id: selectedId } }));
    }));
  }

  function renderFonts() {
    panel.innerHTML = `
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
    panel.querySelectorAll(".bp-apply-font").forEach((btn) => btn.addEventListener("click", () => {
      const target = panel.querySelector("#bp-font-target").value;
      window.dispatchEvent(new CustomEvent("bp:apply-font", { detail: { fontId: btn.dataset.id, target } }));
    }));
  }

  function renderPresets() {
    panel.innerHTML = `<div class="bp-drawer-grid">
      ${BUILDER_PRESETS.map((p) => `
        <div class="bp-drawer-card">
          <p class="bp-drawer-card-name">${p.name}</p>
          <p class="bp-drawer-card-meta">${BUILDER_FONTS_BY_ID[p.fonts.heading].name} / ${BUILDER_FONTS_BY_ID[p.fonts.body].name}</p>
          <p class="bp-drawer-card-meta">Accent ${p.palette.accent}</p>
          <button type="button" class="bp-mini-btn bp-apply-preset" data-id="${p.id}">APPLY PRESET</button>
        </div>
      `).join("")}
    </div>`;
    panel.querySelectorAll(".bp-apply-preset").forEach((btn) => btn.addEventListener("click", () => {
      window.dispatchEvent(new CustomEvent("bp:use-preset", { detail: btn.dataset.id }));
      close();
    }));
  }

  window.Builder.libraryDrawer = { mount, open, close };
})();
