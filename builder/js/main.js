/* BLENCI BUILDER — boot: first-run flow + top bar + wiring between modules. */
(() => {
  "use strict";
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const app = document.getElementById("bp-app");
  const overlay = document.getElementById("bp-overlay");
  const toast = document.getElementById("bp-toast");

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2200);
  }

  // ---------------- first-run flow ----------------
  let pendingLayout = null;

  function startFlow() {
    if (Builder.state.hasSavedSession()) { renderContinuePrompt(); return; }
    renderStep1();
  }

  function renderContinuePrompt() {
    overlay.innerHTML = `
      <div class="bp-overlay-step">
        <p class="bp-overlay-eyebrow">A — WELCOME BACK</p>
        <h1 class="bp-overlay-title">前回の続きから始めますか？</h1>
        <div class="bp-step-grid" style="max-width:520px;">
          <div class="bp-step-card" id="bp-continue"><p class="bp-step-card-name">CONTINUE PREVIOUS SESSION</p><p class="bp-step-card-desc">保存済みの編集内容を復元します。</p></div>
          <div class="bp-step-card" id="bp-startnew"><p class="bp-step-card-name">START NEW</p><p class="bp-step-card-desc">レイアウト選択からやり直します。</p></div>
        </div>
      </div>`;
    document.getElementById("bp-continue").addEventListener("click", () => {
      Builder.state.loadSaved();
      launchBuilder();
    });
    document.getElementById("bp-startnew").addEventListener("click", () => { Builder.state.clearSaved(); renderStep1(); });
  }

  function renderStep1() {
    overlay.innerHTML = `
      <div class="bp-overlay-step">
        <p class="bp-overlay-eyebrow">STEP 1 / 3 — SELECT A LAYOUT</p>
        <h1 class="bp-overlay-title">まずレイアウトを選んでください</h1>
        <div class="bp-hgallery" id="bp-step-hgallery">
          <div class="bp-hgallery-track">
            ${BUILDER_LAYOUTS.map((l) => `
              <div class="bp-step-card bp-step-card--portrait" data-id="${l.id}">
                <div class="bp-step-thumb bp-step-thumb--portrait" data-layout-preview="${l.id}"></div>
                <p class="bp-step-card-name">${l.name}</p>
                <p class="bp-step-card-desc">${l.description}</p>
                <p class="bp-step-card-meta">${l.sectionCount} section · ${l.objectCount} objects</p>
                <p class="bp-step-card-meta">Best for: ${l.use}</p>
                <button type="button" class="bp-btn bp-step-select-btn">SELECT</button>
              </div>
            `).join("")}
          </div>
        </div>
      </div>`;
    overlay.querySelectorAll("[data-layout-preview]").forEach((el) => {
      Builder.layoutPreview.mountInto(el, el.dataset.layoutPreview);
    });
    const stepGallery = document.getElementById("bp-step-hgallery");
    enableWheelHorizontal(stepGallery);
    Builder.layoutPreview.enableDepthHover(stepGallery, ".bp-layout-preview");
    overlay.querySelectorAll(".bp-step-card").forEach((card) => {
      card.addEventListener("click", () => { pendingLayout = card.dataset.id; renderStep2(); });
    });
  }

  function enableWheelHorizontal(el) {
    if (!el) return;
    el.addEventListener("wheel", (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    }, { passive: false });
  }

  function renderStep2() {
    overlay.innerHTML = `
      <div class="bp-overlay-step">
        <p class="bp-overlay-eyebrow">STEP 2 / 3 — SELECT A PRESET</p>
        <h1 class="bp-overlay-title">デザインプリセットを選んでください</h1>
        <div class="bp-step-grid">
          ${BUILDER_PRESETS.map((p) => `
            <div class="bp-step-card" data-id="${p.id}">
              <div class="bp-step-swatch" style="background:linear-gradient(135deg, ${p.palette.background}, ${p.palette.accent})"></div>
              <p class="bp-step-card-name">${p.name}</p>
              <p class="bp-step-card-meta">${BUILDER_FONTS_BY_ID[p.fonts.heading].name} / ${BUILDER_FONTS_BY_ID[p.fonts.body].name}</p>
              <button type="button" class="bp-btn bp-step-select-btn">SELECT</button>
            </div>
          `).join("")}
        </div>
      </div>`;
    overlay.querySelectorAll(".bp-step-card").forEach((card) => {
      card.addEventListener("click", () => { renderStep3(pendingLayout, card.dataset.id); });
    });
  }

  function renderStep3(layoutId, presetId) {
    overlay.innerHTML = `<div class="bp-overlay-step"><p class="bp-overlay-eyebrow">STEP 3 / 3</p><h1 class="bp-overlay-title">サンプルを準備しています…</h1></div>`;
    Builder.state.init(layoutId, presetId);
    setTimeout(() => launchBuilder(), REDUCED ? 0 : 500);
  }

  // ---------------- builder shell ----------------
  function launchBuilder() {
    overlay.style.display = "none";
    app.hidden = false;
    const state = Builder.state.get();

    Builder.renderer.mount(document.getElementById("bp-preview"), (id) => Builder.state.select(id));
    Builder.structurePanel.mount(document.getElementById("bp-structure-panel"), (id) => Builder.state.select(id));
    Builder.inspector.mount(document.getElementById("bp-inspector-panel"));
    Builder.libraryDrawer.mount(document.getElementById("bp-bottombar"), document.getElementById("bp-drawer-panel"));

    Builder.structurePanel.render(state.layout);
    Builder.renderer.load(state.layout, () => {
      Builder.renderer.renderFull(Builder.state.get());
      Builder.renderer.setDevice(Builder.state.get().device);
    });
    Builder.inspector.render(null);

    Builder.state.subscribe((s, reason) => {
      if (!Builder.renderer.isReady()) return;
      if (reason === "select") {
        Builder.renderer.markSelection(s ? Builder.state.getSelected() : null);
        Builder.structurePanel.setSelected(Builder.state.getSelected());
        Builder.inspector.render(Builder.state.getSelected());
        return;
      }
      if (reason.startsWith("object:") || reason.startsWith("style:")) {
        const id = reason.split(":")[1];
        Builder.renderer.applyContent(id, Builder.state.getObject(id));
        return;
      }
      if (reason.startsWith("motion:")) return; // inspector applies motion directly
      if (reason === "palette") { Builder.renderer.applyPalette(s.palette); return; }
      if (reason === "fonts") { Builder.renderer.applyFonts(s.fonts); return; }
      if (reason === "device") { Builder.renderer.setDevice(s.device); return; }
      if (reason === "reducedMotion") { Builder.renderer.renderFull(s); return; }
      if (reason === "init") {
        Builder.structurePanel.render(s.layout);
        Builder.renderer.load(s.layout, () => { Builder.renderer.renderFull(Builder.state.get()); Builder.renderer.setDevice(Builder.state.get().device); });
        Builder.inspector.render(null);
      }
    });

    window.addEventListener("bp:use-layout", (e) => { Builder.state.init(e.detail, Builder.state.get().preset); showToast("レイアウトを変更しました"); });
    window.addEventListener("bp:use-preset", (e) => { Builder.state.init(Builder.state.get().layout, e.detail); showToast("プリセットを適用しました"); });
    window.addEventListener("bp:effect-applied", (e) => {
      Builder.inspector.render(e.detail.id);
      Builder.motion.applyObjectEffects(Builder.renderer.win(), Builder.renderer.doc(), e.detail.id, Builder.state.getObject(e.detail.id).effects, Builder.state.get().reducedMotion);
      showToast("ギミックを適用しました");
    });
    window.addEventListener("bp:apply-font", (e) => applyFontTarget(e.detail.fontId, e.detail.target));

    // top bar
    document.querySelectorAll(".bp-device-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".bp-device-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        Builder.state.setDevice(btn.dataset.device);
      });
    });
    document.getElementById("bp-btn-play").addEventListener("click", () => {
      Builder.motion.replayEntrances(Builder.renderer.win(), Builder.renderer.doc(), Builder.state.get());
    });
    document.getElementById("bp-btn-save").addEventListener("click", () => {
      showToast(Builder.state.save() ? "保存しました" : "保存に失敗しました");
    });
    document.getElementById("bp-btn-reset").addEventListener("click", () => {
      const id = Builder.state.getSelected();
      if (id && confirm("選択中のオブジェクトをリセットしますか？")) {
        Builder.state.resetObject(id);
        Builder.renderer.applyContent(id, Builder.state.getObject(id));
        Builder.motion.applyObjectEffects(Builder.renderer.win(), Builder.renderer.doc(), id, Builder.state.getObject(id).effects, Builder.state.get().reducedMotion);
        Builder.inspector.render(id);
      } else if (!id && confirm("サンプル全体をリセットしますか？")) {
        Builder.state.resetAll();
      }
    });
    document.getElementById("bp-btn-spec").addEventListener("click", openSpecModal);
    document.getElementById("bp-btn-export").addEventListener("click", runExport);

    // mobile actions menu ("...") — PLAY/SAVE/RESET/SPEC/EXPORT collapse
    // into this below 768px instead of overflowing the top bar (see
    // .bp-topbar-actions in builder.css).
    const menuToggle = document.getElementById("bp-menu-toggle");
    const topbarActions = document.getElementById("bp-topbar-actions");
    if (menuToggle && topbarActions) {
      const closeMenu = () => { topbarActions.classList.remove("is-open"); menuToggle.setAttribute("aria-expanded", "false"); };
      const openMenu = () => { topbarActions.classList.add("is-open"); menuToggle.setAttribute("aria-expanded", "true"); };
      menuToggle.addEventListener("click", () => {
        if (topbarActions.classList.contains("is-open")) closeMenu(); else openMenu();
      });
      document.addEventListener("click", (e) => {
        if (!topbarActions.classList.contains("is-open")) return;
        if (topbarActions.contains(e.target) || menuToggle.contains(e.target)) return;
        closeMenu();
      }, true);
      document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
      topbarActions.querySelectorAll(".bp-btn").forEach((btn) => btn.addEventListener("click", closeMenu));
    }
  }

  function applyFontTarget(fontId, target) {
    const state = Builder.state.get();
    const font = BUILDER_FONTS_BY_ID[fontId];
    if (target === "page") { Builder.state.setFonts({ heading: fontId, body: fontId }); return; }
    if (target === "headings") { Builder.state.setFonts({ heading: fontId }); return; }
    if (target === "body") { Builder.state.setFonts({ body: fontId }); return; }
    const id = Builder.state.getSelected();
    if (!id) { showToast("先にオブジェクトを選択してください"); return; }
    Builder.state.updateObjectStyle(id, { fontFamily: font.family });
    Builder.renderer.applyStyle(id, Builder.state.getObject(id));
  }

  // ---------------- SPEC modal ----------------
  function openSpecModal() {
    const state = Builder.state.get();
    let format = "text";
    const backdrop = document.createElement("div");
    backdrop.className = "bp-modal-backdrop";
    function content() {
      if (format === "text") return Builder.specGenerator.toPlainText(state);
      if (format === "markdown") return Builder.specGenerator.toMarkdown(state);
      return Builder.specGenerator.toJSON(state);
    }
    function render() {
      backdrop.innerHTML = `
        <div class="bp-modal">
          <div class="bp-modal-head"><h2>DESIGN SPEC</h2>
            <div class="bp-tabs" style="margin:0;min-width:220px;">
              ${["text", "markdown", "json"].map((f) => `<button class="bp-tab ${format === f ? "active" : ""}" data-f="${f}">${f.toUpperCase()}</button>`).join("")}
            </div>
          </div>
          <div class="bp-modal-body"><pre>${escapeHtml(content())}</pre></div>
          <div class="bp-modal-actions">
            <button type="button" class="bp-btn bp-btn-primary" id="bp-spec-copy">COPY</button>
            <button type="button" class="bp-btn" id="bp-spec-close">CLOSE</button>
          </div>
        </div>`;
      backdrop.querySelectorAll("[data-f]").forEach((b) => b.addEventListener("click", () => { format = b.dataset.f; render(); }));
      backdrop.querySelector("#bp-spec-close").addEventListener("click", () => backdrop.remove());
      backdrop.querySelector("#bp-spec-copy").addEventListener("click", () => {
        navigator.clipboard.writeText(content()).then(() => showToast("コピーしました"));
      });
    }
    render();
    document.body.appendChild(backdrop);
  }

  function escapeHtml(s) { return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }

  // ---------------- export ----------------
  async function runExport() {
    const btn = document.getElementById("bp-btn-export");
    const original = btn.textContent;
    try {
      await Builder.blueprintExporter.exportBlueprint((msg) => { btn.textContent = msg; });
      showToast("blenci-blueprint.zip を書き出しました");
    } catch (err) {
      console.error(err);
      showToast("書き出しに失敗しました");
    } finally {
      btn.textContent = original;
    }
  }

  startFlow();
})();
