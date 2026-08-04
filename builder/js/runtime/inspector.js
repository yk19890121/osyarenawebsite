/* BLENCI BUILDER — INSPECTOR panel: CONTENT / STYLE / MOTION tabs. */
window.Builder = window.Builder || {};

(() => {
  "use strict";
  let root = null;
  let activeTab = "content";

  const EVENTS_BY_TYPE = {
    heading: ["entrance"], text: ["entrance"], image: ["entrance", "hover", "scroll"],
    button: ["hover"], background: ["continuous"],
  };
  const EVENT_LABEL = { entrance: "ENTRANCE", scroll: "SCROLL", hover: "HOVER", click: "CLICK", continuous: "CONTINUOUS" };
  const OPTION_LABEL = { duration: "Duration (s)", delay: "Delay (s)", direction: "Direction", easing: "Easing", intensity: "Intensity", scale: "Scale", distance: "Distance (px)" };

  function mount(rootEl) { root = rootEl; }

  function render(objectId) {
    if (!objectId) { root.innerHTML = `<p class="bp-inspector-empty">プレビュー内の要素、または左のSTRUCTUREから選択してください。</p>`; return; }
    const obj = Builder.state.getObject(objectId);
    if (!obj) { root.innerHTML = ""; return; }
    root.innerHTML = `
      <div class="bp-inspector-head">
        <p class="bp-inspector-eyebrow">${obj.role || obj.type}</p>
        <p class="bp-inspector-label">${obj.label}</p>
      </div>
      <div class="bp-tabs" role="tablist">
        <button class="bp-tab ${activeTab === "content" ? "active" : ""}" data-tab="content">CONTENT</button>
        <button class="bp-tab ${activeTab === "style" ? "active" : ""}" data-tab="style">STYLE</button>
        <button class="bp-tab ${activeTab === "motion" ? "active" : ""}" data-tab="motion">MOTION</button>
      </div>
      <div class="bp-inspector-body" id="bp-inspector-body"></div>
    `;
    root.querySelectorAll(".bp-tab").forEach((btn) => btn.addEventListener("click", () => { activeTab = btn.dataset.tab; render(objectId); }));
    const body = root.querySelector("#bp-inspector-body");
    if (activeTab === "content") renderContent(body, objectId, obj);
    if (activeTab === "style") renderStyle(body, objectId, obj);
    if (activeTab === "motion") renderMotion(body, objectId, obj);
  }

  // ---------------- CONTENT ----------------
  function renderContent(body, id, obj) {
    if (obj.type === "heading" || obj.type === "text") {
      body.innerHTML = `
        <label class="bp-field">
          <span class="bp-field-label">テキスト</span>
          <textarea class="bp-textarea" rows="${obj.type === "heading" ? 3 : 4}">${escapeHtml(obj.content)}</textarea>
        </label>
        <p class="bp-hint">${obj.content.length}文字 ${obj.type === "heading" ? "(推奨 10〜28文字)" : "(推奨 40〜100文字)"}</p>
      `;
      body.querySelector("textarea").addEventListener("input", (e) => {
        Builder.state.updateObject(id, { content: e.target.value });
      });
    } else if (obj.type === "button") {
      body.innerHTML = `
        <label class="bp-field"><span class="bp-field-label">ラベル</span><input class="bp-input" type="text" value="${escapeAttr(obj.content)}" data-k="content"></label>
        <label class="bp-field"><span class="bp-field-label">リンクURL</span><input class="bp-input" type="text" value="${escapeAttr(obj.url)}" data-k="url"></label>
      `;
      body.querySelectorAll("[data-k]").forEach((input) => {
        input.addEventListener("input", (e) => Builder.state.updateObject(id, { [e.target.dataset.k]: e.target.value }));
      });
    } else if (obj.type === "image") {
      body.innerHTML = `
        <label class="bp-field">
          <span class="bp-field-label">画像を選択</span>
          <input class="bp-file" type="file" accept="image/*">
        </label>
        <label class="bp-field"><span class="bp-field-label">ALTテキスト</span><input class="bp-input" type="text" value="${escapeAttr(obj.alt)}"></label>
        <label class="bp-field">
          <span class="bp-field-label">フォーカルポイント</span>
          <select class="bp-select" data-k="objectPosition">
            <option value="center 15%">上寄り(顔)</option>
            <option value="center">中央</option>
            <option value="center 85%">下寄り</option>
          </select>
        </label>
        <p class="bp-hint">推奨アスペクト比 4:5 / 最小幅 1200px</p>
      `;
      body.querySelector(".bp-file").addEventListener("change", (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const url = URL.createObjectURL(file);
        Builder.state.updateObject(id, { source: url });
      });
      body.querySelector("input[type=text]").addEventListener("input", (e) => Builder.state.updateObject(id, { alt: e.target.value }));
      const posSelect = body.querySelector("select");
      posSelect.value = (obj.style && obj.style.objectPosition) || "center 15%";
      posSelect.addEventListener("change", (e) => Builder.state.updateObjectStyle(id, { objectPosition: e.target.value }));
    } else {
      body.innerHTML = `<p class="bp-hint">背景オブジェクトにテキストコンテンツはありません。色はSTYLEタブで設定してください。</p>`;
    }
  }

  // ---------------- STYLE ----------------
  function renderStyle(body, id, obj) {
    if (obj.type === "background") {
      const p = Builder.state.get().palette;
      body.innerHTML = `
        ${colorField("背景色 (Background)", p.background, "palette-background")}
        ${colorField("文字色 (Text)", p.text, "palette-text")}
        ${colorField("アクセントカラー (Accent)", p.accent, "palette-accent")}
      `;
      bindColor(body, "palette-background", (v) => Builder.state.setPalette({ background: v }));
      bindColor(body, "palette-text", (v) => Builder.state.setPalette({ text: v }));
      bindColor(body, "palette-accent", (v) => Builder.state.setPalette({ accent: v }));
      return;
    }
    const fonts = Builder.state.get().fonts;
    const isText = obj.type === "heading" || obj.type === "text" || obj.type === "button";
    body.innerHTML = `
      ${isText ? fontField(obj.type === "heading" ? fonts.heading : fonts.body) : ""}
      ${isText ? sizeField(obj.style.fontSize || (obj.type === "heading" ? "64px" : "16px")) : ""}
      ${isText ? colorField("文字色", obj.style.color || "var(--bp-text)", "obj-color") : ""}
      ${isText ? alignField(obj.style.textAlign || "left") : ""}
      <details class="bp-advanced"><summary>ADVANCED</summary>
        ${isText ? textField("letterSpacing", "字間 (em)", obj.style.letterSpacing || "") : ""}
        ${isText ? textField("lineHeight", "行間", obj.style.lineHeight || "") : ""}
      </details>
    `;
    if (isText) {
      body.querySelector(".bp-font-select").addEventListener("change", (e) => {
        const font = BUILDER_FONTS_BY_ID[e.target.value];
        Builder.state.updateObjectStyle(id, { fontFamily: font.family });
      });
      body.querySelector(".bp-size-input").addEventListener("input", (e) => Builder.state.updateObjectStyle(id, { fontSize: e.target.value + "px" }));
      bindColor(body, "obj-color", (v) => Builder.state.updateObjectStyle(id, { color: v }));
      body.querySelectorAll(".bp-align-btn").forEach((btn) => btn.addEventListener("click", () => Builder.state.updateObjectStyle(id, { textAlign: btn.dataset.align })));
      body.querySelectorAll("[data-style-k]").forEach((input) => {
        input.addEventListener("input", (e) => Builder.state.updateObjectStyle(id, { [e.target.dataset.styleK]: e.target.value }));
      });
    }
  }

  function fontField(currentId) {
    return `<label class="bp-field"><span class="bp-field-label">Font</span>
      <select class="bp-select bp-font-select">
        ${BUILDER_FONTS.map((f) => `<option value="${f.id}" ${f.id === currentId ? "selected" : ""}>${f.name}</option>`).join("")}
      </select></label>`;
  }
  function sizeField(current) {
    const n = parseInt(current, 10) || 16;
    return `<label class="bp-field"><span class="bp-field-label">Font Size</span><input class="bp-input bp-size-input" type="number" value="${n}" min="10" max="160"></label>`;
  }
  function colorField(label, current, cls) {
    return `<label class="bp-field"><span class="bp-field-label">${label}</span>
      <div class="bp-color-row"><input class="bp-color ${cls}" type="color" value="${toHex(current)}"><input class="bp-input bp-color-text ${cls}-text" type="text" value="${current}"></div></label>`;
  }
  function alignField(current) {
    return `<div class="bp-field"><span class="bp-field-label">Alignment</span>
      <div class="bp-align-group">
        ${["left", "center", "right"].map((a) => `<button type="button" class="bp-align-btn ${current === a ? "active" : ""}" data-align="${a}">${a[0].toUpperCase()}</button>`).join("")}
      </div></div>`;
  }
  function textField(key, label, value) {
    return `<label class="bp-field"><span class="bp-field-label">${label}</span><input class="bp-input" type="text" data-style-k="${key}" value="${escapeAttr(value)}"></label>`;
  }
  function bindColor(body, cls, onChange) {
    const picker = body.querySelector("." + cls);
    const text = body.querySelector("." + cls + "-text");
    if (!picker) return;
    picker.addEventListener("input", (e) => { text.value = e.target.value; onChange(e.target.value); });
    text.addEventListener("change", (e) => { picker.value = toHex(e.target.value); onChange(e.target.value); });
  }
  function toHex(v) {
    if (/^#/.test(v)) return v;
    return "#111111";
  }

  // ---------------- MOTION ----------------
  function renderMotion(body, id, obj) {
    const events = EVENTS_BY_TYPE[obj.type] || [];
    body.innerHTML = events.map((event) => {
      const options = BUILDER_GIMMICKS.filter((g) => g.applicableTo.includes(obj.type) && g.event === event);
      const current = obj.effects[event];
      return `
        <div class="bp-motion-block" data-event="${event}">
          <p class="bp-motion-event">${EVENT_LABEL[event]}</p>
          <select class="bp-select bp-motion-select" data-event="${event}">
            <option value="">None</option>
            ${options.map((g) => `<option value="${g.id}" ${current && current.id === g.id ? "selected" : ""}>${g.name}</option>`).join("")}
          </select>
          <div class="bp-motion-options" data-event="${event}">${current ? optionInputs(event, current) : ""}</div>
          <div class="bp-motion-actions" data-event="${event}">
            ${event === "entrance" && current ? `<button type="button" class="bp-mini-btn bp-replay-one" data-obj="${id}">REPLAY ↻</button>` : ""}
          </div>
        </div>
      `;
    }).join("");

    body.querySelectorAll(".bp-motion-select").forEach((select) => {
      select.addEventListener("change", (e) => {
        const event = e.target.dataset.event;
        const gimmickId = e.target.value || null;
        Builder.state.setEffect(id, event, gimmickId);
        render(id); // rebuild option inputs for the newly chosen gimmick
        Builder.renderer.markSelection(id);
        Builder.motion.applyObjectEffects(Builder.renderer.win(), Builder.renderer.doc(), id, Builder.state.getObject(id).effects, Builder.state.get().reducedMotion);
      });
    });
    body.querySelectorAll(".bp-opt-input").forEach((input) => {
      input.addEventListener("input", (e) => {
        const event = e.target.closest(".bp-motion-options").dataset.event;
        const key = e.target.dataset.opt;
        const val = e.target.type === "number" ? Number(e.target.value) : e.target.value;
        Builder.state.updateEffectOptions(id, event, { [key]: val });
        Builder.motion.applyObjectEffects(Builder.renderer.win(), Builder.renderer.doc(), id, Builder.state.getObject(id).effects, Builder.state.get().reducedMotion);
      });
    });
    body.querySelectorAll(".bp-replay-one").forEach((btn) => {
      btn.addEventListener("click", () => {
        Builder.motion.applyObjectEffects(Builder.renderer.win(), Builder.renderer.doc(), id, Builder.state.getObject(id).effects, Builder.state.get().reducedMotion);
      });
    });
  }

  function optionInputs(event, effect) {
    const meta = BUILDER_GIMMICKS_BY_ID[effect.id];
    if (!meta) return "";
    const keys = Object.keys(meta.defaultOptions).filter((k) => k !== "direction" && k !== "easing");
    if (!keys.length) return "";
    return keys.map((k) => {
      const val = effect[k] != null ? effect[k] : meta.defaultOptions[k];
      const step = k === "duration" || k === "delay" ? "0.1" : k === "intensity" ? "0.05" : "0.01";
      return `<label class="bp-field bp-field-inline"><span class="bp-field-label">${OPTION_LABEL[k] || k}</span>
        <input class="bp-input bp-opt-input" type="number" step="${step}" data-opt="${k}" value="${val}"></label>`;
    }).join("");
  }

  function escapeHtml(s) { return String(s || "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }
  function escapeAttr(s) { return String(s || "").replace(/"/g, "&quot;"); }

  window.Builder.inspector = { mount, render };
})();
