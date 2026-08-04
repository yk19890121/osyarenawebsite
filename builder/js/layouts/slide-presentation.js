/* BLENCI BUILDER — "Slide Deck Presentation" layout: a title-slide cover
   followed by a row of slide cards. Good for pitch decks, lookbooks, or any
   page introducing a slide-based presentation. */
window.BUILDER_LAYOUT_TEMPLATES = window.BUILDER_LAYOUT_TEMPLATES || {};

(() => {
  "use strict";
  function slideHtml(n) {
    return `
    <article class="sp-slide">
      <p class="sp-slide-num">0${n}</p>
      <figure class="sp-slide-visual" data-object-id="sp-slide-${n}-visual" data-object-type="image" data-object-role="slide-visual" data-object-label="Slide ${n} Image">
        <img alt="">
      </figure>
      <h3 class="sp-slide-title" data-object-id="sp-slide-${n}-title" data-object-type="heading" data-object-role="slide-title" data-object-label="Slide ${n} Title"></h3>
      <p class="sp-slide-body" data-object-id="sp-slide-${n}-body" data-object-type="text" data-object-role="slide-body" data-object-label="Slide ${n} Body"></p>
    </article>
  `;
  }

  window.BUILDER_LAYOUT_TEMPLATES["slide-presentation"] = {
    html: `
    <section class="sp-cover" data-object-id="sp-background" data-object-type="background" data-object-role="primary-background" data-object-label="Background">
      <div class="es-noise" data-motion-slot="sp-background:continuous"></div>
      <div class="sp-cover-inner">
        <p class="sp-eyebrow" data-object-id="sp-eyebrow" data-object-type="text" data-object-role="eyebrow" data-object-label="Eyebrow"></p>
        <h1 class="sp-title" data-object-id="sp-title" data-object-type="heading" data-object-role="primary-heading" data-object-label="Deck Title"></h1>
        <p class="sp-subtitle" data-object-id="sp-subtitle" data-object-type="text" data-object-role="body-copy" data-object-label="Deck Subtitle"></p>
      </div>
    </section>
    <section class="sp-slides">
      ${slideHtml(1)}
      ${slideHtml(2)}
      ${slideHtml(3)}
    </section>
  `,
    css: `
    :root{
      --bp-bg:#111111; --bp-surface:#181818; --bp-text:#F3EFE6; --bp-accent:#8B1E2D;
      --bp-ff-heading:'Bodoni Moda', serif; --bp-ff-body:'Noto Sans JP', sans-serif;
      --bp-ease:cubic-bezier(.16,1,.3,1);
    }
    *,*::before,*::after{box-sizing:border-box;}
    html,body{margin:0;}
    body{background:var(--bp-bg);color:var(--bp-text);font-family:var(--bp-ff-body);-webkit-font-smoothing:antialiased;overflow-x:hidden;}
    a{color:inherit;}
    .sp-cover{position:relative;min-height:72vh;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden;padding:clamp(28px,6vw,64px);border-bottom:1px solid color-mix(in srgb, var(--bp-text) 12%, transparent);}
    .es-noise{position:absolute;inset:0;opacity:0;pointer-events:none;mix-blend-mode:overlay;
      background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
      background-size:160px;}
    .es-noise.on{opacity:.35;}
    .sp-cover-inner{position:relative;z-index:1;max-width:760px;display:flex;flex-direction:column;align-items:center;gap:16px;}
    .sp-eyebrow{margin:0;font-family:var(--bp-ff-body);font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--bp-accent);outline-offset:4px;}
    .sp-title{margin:0;font-family:var(--bp-ff-heading);font-weight:700;font-size:clamp(38px,6vw,72px);line-height:1.05;outline-offset:4px;}
    .sp-subtitle{margin:0;font-size:15px;line-height:1.8;max-width:46ch;color:color-mix(in srgb, var(--bp-text) 74%, transparent);outline-offset:4px;}
    .sp-slides{max-width:1240px;margin:0 auto;padding:clamp(48px,7vw,88px) clamp(24px,5vw,64px);
      display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(24px,3vw,36px);}
    .sp-slide{position:relative;display:flex;flex-direction:column;gap:12px;padding:18px;border:1px solid color-mix(in srgb, var(--bp-text) 14%, transparent);border-radius:4px;}
    .sp-slide-num{margin:0;font-family:var(--bp-ff-body);font-size:11px;letter-spacing:.12em;color:color-mix(in srgb, var(--bp-text) 50%, transparent);}
    .sp-slide-visual{margin:0;position:relative;aspect-ratio:16/9;overflow:hidden;background:var(--bp-surface);outline-offset:4px;}
    .sp-slide-visual img{width:100%;height:100%;object-fit:cover;display:block;}
    .sp-slide-title{margin:0;font-family:var(--bp-ff-heading);font-weight:700;font-size:clamp(18px,2vw,22px);line-height:1.2;outline-offset:4px;}
    .sp-slide-body{margin:0;font-size:13px;line-height:1.7;color:color-mix(in srgb, var(--bp-text) 68%, transparent);outline-offset:4px;}
    @media (max-width:860px){
      .sp-slides{grid-template-columns:1fr;max-width:480px;}
    }
    [data-builder-selected]{outline:1px solid var(--bp-accent, #ff7847);}
    @media (prefers-reduced-motion: reduce){ *{animation-duration:.001ms !important;transition-duration:.001ms !important;} }
  `,
  };
})();
