/* BLENCI BUILDER — iframe preview renderer. Same-origin, so it talks to
   iframe.contentDocument/contentWindow directly (no postMessage). */
window.Builder = window.Builder || {};

(() => {
  "use strict";
  let iframe = null;
  let ready = false;
  let onSelectCallback = null;

  const DEVICE_WIDTH = { desktop: "100%", tablet: "768px", mobile: "390px" };

  function mount(iframeEl, onSelect) {
    iframe = iframeEl;
    onSelectCallback = onSelect;
  }

  function buildDocument(layoutId) {
    const tpl = BUILDER_LAYOUT_TEMPLATES[layoutId];
    return `<!doctype html><html><head><meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <style>${tpl.css}</style>
      </head><body>${tpl.html}
      <script src="../js/vendor/gsap.min.js"><\/script>
      <script src="../js/vendor/ScrollTrigger.min.js"><\/script>
      </body></html>`;
  }

  function load(layoutId, cb) {
    ready = false;
    iframe.srcdoc = buildDocument(layoutId);
    iframe.addEventListener("load", function onLoad() {
      iframe.removeEventListener("load", onLoad);
      if (win().gsap && win().ScrollTrigger) win().gsap.registerPlugin(win().ScrollTrigger);
      ready = true;
      bindSelection();
      if (cb) cb();
    });
  }

  function doc() { return iframe.contentDocument; }
  function win() { return iframe.contentWindow; }

  function bindSelection() {
    doc().querySelectorAll("[data-object-id]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onSelectCallback) onSelectCallback(el.dataset.objectId);
      });
    });
  }

  function markSelection(objectId) {
    if (!ready) return;
    doc().querySelectorAll("[data-builder-selected]").forEach((el) => el.removeAttribute("data-builder-selected"));
    if (!objectId) return;
    const el = doc().querySelector(`[data-object-id="${objectId}"]`);
    if (el) el.setAttribute("data-builder-selected", "");
  }

  function applyContent(objectId, obj) {
    if (!ready) return;
    const el = doc().querySelector(`[data-object-id="${objectId}"]`);
    if (!el) return;
    if (obj.type === "heading" || obj.type === "text") {
      el.__bpRawText = obj.content;
      el.textContent = obj.content;
    } else if (obj.type === "button") {
      el.innerHTML = `<span class="es-button__fill"></span><span class="es-button__label">${escapeHtml(obj.content)}</span><span class="es-button__underline"></span>`;
      el.setAttribute("href", obj.url || "#");
    } else if (obj.type === "image") {
      const img = el.querySelector("img");
      if (img) { img.src = obj.source || ""; img.alt = obj.alt || ""; }
    }
    applyStyle(objectId, obj);
  }

  function escapeHtml(s) { return String(s || "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }

  function applyStyle(objectId, obj) {
    const el = doc().querySelector(`[data-object-id="${objectId}"]`);
    if (!el) return;
    const s = obj.style || {};
    if (s.fontFamily) el.style.fontFamily = s.fontFamily;
    if (s.fontSize) el.style.fontSize = s.fontSize;
    if (s.color) el.style.color = s.color;
    if (s.backgroundColor) el.style.backgroundColor = s.backgroundColor;
    if (s.textAlign) el.style.textAlign = s.textAlign;
    if (s.objectPosition && el.querySelector("img")) el.querySelector("img").style.objectPosition = s.objectPosition;
  }

  function applyPalette(palette) {
    if (!ready) return;
    const root = doc().documentElement;
    root.style.setProperty("--bp-bg", palette.background);
    root.style.setProperty("--bp-surface", palette.surface || palette.background);
    root.style.setProperty("--bp-text", palette.text);
    root.style.setProperty("--bp-accent", palette.accent);
  }

  function applyFonts(fonts) {
    if (!ready) return;
    const headingFont = BUILDER_FONTS_BY_ID[fonts.heading];
    const bodyFont = BUILDER_FONTS_BY_ID[fonts.body];
    const root = doc().documentElement;
    if (headingFont) root.style.setProperty("--bp-ff-heading", headingFont.family);
    if (bodyFont) root.style.setProperty("--bp-ff-body", bodyFont.family);
    ensureFontLink(fonts);
  }

  function ensureFontLink(fonts) {
    const families = [fonts.heading, fonts.body]
      .map((id) => BUILDER_FONTS_BY_ID[id])
      .filter(Boolean)
      .map((f) => f.name.replace(/ /g, "+") + ":wght@400;500;700;900");
    const href = "https://fonts.googleapis.com/css2?" + families.map((f) => "family=" + f).join("&") + "&display=swap";
    let link = doc().getElementById("bp-font-link");
    if (!link) {
      link = doc().createElement("link");
      link.rel = "stylesheet";
      link.id = "bp-font-link";
      doc().head.appendChild(link);
    }
    if (link.href !== href) link.href = href;
  }

  function renderFull(state) {
    Object.keys(state.objects).forEach((id) => applyContent(id, state.objects[id]));
    applyPalette(state.palette);
    applyFonts(state.fonts);
    Builder.motion.applyAll(win(), doc(), state);
  }

  function setDevice(device) {
    // Sizing the FRAME (not the iframe itself) matters: the iframe's own
    // width:100% (see .bp-stage iframe in builder.css) resolves against
    // its containing block, which is this frame div. The frame is a flex
    // item with no width of its own (shrink-to-fit), so previously
    // "desktop" (iframe width:100%) had nothing concrete to resolve
    // against and collapsed to a narrow, wrong-looking box -- narrower
    // than "tablet"'s explicit 768px. Giving the frame itself an explicit
    // width fixes that for every device size, desktop included.
    iframe.parentElement.style.width = DEVICE_WIDTH[device] || "100%";
  }

  function isReady() { return ready; }

  window.Builder.renderer = {
    mount, load, renderFull, applyContent, applyStyle, applyPalette, applyFonts,
    markSelection, setDevice, isReady, doc, win,
  };
})();
