/* BLENCI BUILDER — layout picker preview. Renders an actual scaled-down,
   cropped snapshot of each layout (real HTML + real CSS, default sample
   content baked in) instead of an abstract mockup, so the picker thumbnail
   genuinely matches what you get after selecting it. No motion/JS runs
   inside — it's a static same-origin iframe, scaled down and cropped by
   the container's overflow:hidden.

   Scaling uses `transform:scale`, not CSS `zoom`: zoom is non-standard and
   its behavior on <iframe> elements specifically is unreliable on WebKit/
   Safari (mobile in particular), where it was leaving the iframe rendered
   at full, unscaled size -- only the top-left corner showed through the
   small clipped container, with the rest reading as blank space. Chromium
   has a separate quirk where a *transformed* iframe composites on its own
   GPU layer and can bleed past an ancestor's overflow:hidden + border-
   radius clip; `contain:paint` on the container (see builder.css
   .bp-layout-preview) forces proper clipping there without relying on zoom.

   The container's box size is driven entirely by CSS (fixed portrait card
   on desktop, full-width on mobile via media queries) -- this module just
   reads that size back and computes the iframe's scale/source-height to
   exactly fill it, re-measuring via ResizeObserver whenever it changes
   (viewport resize, orientation change, or a drawer/card layout shift). */
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

  function mountInto(containerEl, layoutId) {
    containerEl.classList.add("bp-layout-preview");
    const iframe = document.createElement("iframe");
    iframe.tabIndex = -1;
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.position = "absolute";
    iframe.style.top = "0";
    iframe.style.left = "0";
    iframe.style.width = BASE_WIDTH + "px";
    iframe.style.border = "0";
    iframe.style.pointerEvents = "none";
    iframe.style.transformOrigin = "top left";
    containerEl.appendChild(iframe);
    iframe.srcdoc = buildSrcdoc(layoutId);

    function applyScale() {
      const w = containerEl.clientWidth;
      const h = containerEl.clientHeight;
      if (!w || !h) return;
      const scale = w / BASE_WIDTH;
      iframe.style.height = Math.ceil(h / scale) + "px";
      iframe.style.transform = `scale(${scale})`;
    }
    applyScale();
    if (window.ResizeObserver) {
      new ResizeObserver(applyScale).observe(containerEl);
    } else {
      window.addEventListener("resize", applyScale);
    }
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
