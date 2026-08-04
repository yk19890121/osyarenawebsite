/* BLENCI BUILDER — layout picker preview. Renders an actual scaled-down,
   cropped snapshot of each layout (real HTML + real CSS, default sample
   content baked in) instead of an abstract mockup, so the picker thumbnail
   genuinely matches what you get after selecting it. No motion/JS runs
   inside — it's a static same-origin iframe, scaled down and cropped by
   the container's overflow:hidden (a portrait "window" onto the top of the
   real, wider desktop layout).
   Deliberately uses CSS `zoom` rather than `transform:scale` to shrink the
   iframe: Chromium composites a transformed <iframe> on its own GPU layer,
   which can bleed a sliver of content past an ancestor's overflow:hidden +
   border-radius clip. `zoom` rescales at the layout level instead, so the
   ancestor's rounded clip is respected with no edge bleed. */
window.Builder = window.Builder || {};

(() => {
  "use strict";
  const BASE_WIDTH = 1280;

  function escapeHtml(s) { return String(s || "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }

  function bakeHtml(layout, tpl) {
    const doc = new DOMParser().parseFromString(`<div id="bp-root">${tpl.html}</div>`, "text/html");
    layout.objects.forEach((obj) => {
      const seed = (layout.defaults && layout.defaults[obj.id]) || {};
      const el = doc.querySelector(`[data-object-id="${obj.id}"]`);
      if (!el) return;
      if (obj.type === "heading" || obj.type === "text") {
        el.textContent = seed.content || "";
      } else if (obj.type === "button") {
        el.innerHTML = `<span class="es-button__fill"></span><span class="es-button__label">${escapeHtml(seed.content || "")}</span><span class="es-button__underline"></span>`;
        el.setAttribute("href", "#");
      } else if (obj.type === "image") {
        const img = el.querySelector("img");
        if (img) { img.setAttribute("src", seed.source || ""); img.setAttribute("alt", ""); }
      }
    });
    return doc.getElementById("bp-root").innerHTML;
  }

  function buildSrcdoc(layoutId) {
    const layout = BUILDER_LAYOUTS.find((l) => l.id === layoutId);
    const tpl = BUILDER_LAYOUT_TEMPLATES[layoutId];
    if (!layout || !tpl) return "";
    const html = bakeHtml(layout, tpl);
    return `<!doctype html><html><head><meta charset="utf-8"><style>${tpl.css}
      html,body{overflow:hidden;}
      </style></head><body>${html}</body></html>`;
  }

  function mountInto(containerEl, layoutId, widthPx, heightPx) {
    containerEl.classList.add("bp-layout-preview");
    containerEl.style.width = widthPx + "px";
    containerEl.style.height = heightPx + "px";
    containerEl.style.overflow = "hidden";
    const scale = widthPx / BASE_WIDTH;
    const iframe = document.createElement("iframe");
    iframe.tabIndex = -1;
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.display = "block";
    iframe.style.width = BASE_WIDTH + "px";
    iframe.style.height = Math.ceil(heightPx / scale) + "px";
    iframe.style.border = "0";
    iframe.style.pointerEvents = "none";
    iframe.style.zoom = String(scale);
    containerEl.appendChild(iframe);
    iframe.srcdoc = buildSrcdoc(layoutId);
  }

  // Depth-parallax hover — ported from gimmicks #88 "DEPTH-PARALLAX GRID"
  // (gimmicks/js/main.js initDepthGrid): tiles near the cursor lift toward
  // the viewer via scale + translateZ, tiles far from the cursor stay flat.
  // Two deviations from the original, needed because these tiles are large
  // portrait cards with a caption underneath (not a dense grid of bare
  // photos): the falloff radius is tied to each tile's own width so only
  // the tile actually under the cursor responds (neighbors stay resting
  // flat instead of all partially puffing up at once), and the scale
  // pivots from the bottom edge so a lifted tile grows upward/outward
  // instead of downward into its own caption text.
  function enableDepthHover(containerEl, tileSelector) {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduced || !window.gsap) return;
    const tiles = [...containerEl.querySelectorAll(tileSelector)];
    if (!tiles.length) return;
    containerEl.addEventListener("mousemove", (e) => {
      tiles.forEach((tile) => {
        const r = tile.getBoundingClientRect();
        const dist = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
        const reach = r.width * 1.1;
        const scale = gsap.utils.clamp(1, 1.1, 1.1 - dist / reach);
        gsap.to(tile, { scale, z: (scale - 1) * 100, duration: 0.3, overwrite: "auto" });
      });
    });
    containerEl.addEventListener("mouseleave", () => gsap.to(tiles, { scale: 1, z: 0, duration: 0.4 }));
  }

  window.Builder.layoutPreview = { mountInto, enableDepthHover };
})();
