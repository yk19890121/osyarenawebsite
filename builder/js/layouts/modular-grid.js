/* BLENCI BUILDER — "Modular Card Grid" layout: a header statement followed
   by a 3-up card grid. Good for services, product lines, or feature lists. */
window.BUILDER_LAYOUT_TEMPLATES = window.BUILDER_LAYOUT_TEMPLATES || {};

(() => {
  "use strict";
  function cardHtml(n) {
    return `
    <article class="mg-card">
      <figure class="mg-card-visual" data-object-id="mg-card-${n}-visual" data-object-type="image" data-object-role="card-visual" data-object-label="Card ${n} Image">
        <img alt="">
      </figure>
      <h3 class="mg-card-title" data-object-id="mg-card-${n}-title" data-object-type="heading" data-object-role="card-heading" data-object-label="Card ${n} Title"></h3>
      <p class="mg-card-body" data-object-id="mg-card-${n}-body" data-object-type="text" data-object-role="card-body" data-object-label="Card ${n} Body"></p>
    </article>
  `;
  }

  window.BUILDER_LAYOUT_TEMPLATES["modular-grid"] = {
  html: `
    <section class="mg-page" data-object-id="mg-background" data-object-type="background" data-object-role="primary-background" data-object-label="Background">
      <div class="es-noise" data-motion-slot="mg-background:continuous"></div>
      <header class="mg-header">
        <p class="mg-eyebrow" data-object-id="mg-eyebrow" data-object-type="text" data-object-role="eyebrow" data-object-label="Eyebrow"></p>
        <h1 class="mg-title" data-object-id="mg-title" data-object-type="heading" data-object-role="primary-heading" data-object-label="Section Title"></h1>
        <p class="mg-description" data-object-id="mg-description" data-object-type="text" data-object-role="body-copy" data-object-label="Section Description"></p>
      </header>
      <div class="mg-grid">
        ${cardHtml(1)}
        ${cardHtml(2)}
        ${cardHtml(3)}
      </div>
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
    .mg-page{position:relative;min-height:100vh;padding:clamp(28px,6vw,88px);}
    .es-noise{position:absolute;inset:0;opacity:0;pointer-events:none;mix-blend-mode:overlay;
      background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
      background-size:160px;}
    .es-noise.on{opacity:.35;}
    .mg-header{position:relative;z-index:1;max-width:760px;margin:0 auto;text-align:center;display:flex;flex-direction:column;align-items:center;gap:16px;}
    .mg-eyebrow{margin:0;font-family:var(--bp-ff-body);font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--bp-accent);outline-offset:4px;}
    .mg-title{margin:0;font-family:var(--bp-ff-heading);font-weight:700;font-size:clamp(34px,5vw,58px);line-height:1.08;outline-offset:4px;}
    .mg-description{margin:0;font-size:15px;line-height:1.8;max-width:52ch;color:color-mix(in srgb, var(--bp-text) 70%, transparent);outline-offset:4px;}
    .mg-grid{position:relative;z-index:1;margin-top:clamp(40px,6vw,72px);max-width:1240px;margin-left:auto;margin-right:auto;
      display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(24px,3vw,40px);}
    .mg-card{display:flex;flex-direction:column;gap:14px;}
    .mg-card-visual{margin:0;position:relative;aspect-ratio:4/5;overflow:hidden;background:var(--bp-surface);outline-offset:4px;}
    .mg-card-visual img{width:100%;height:100%;object-fit:cover;display:block;}
    .mg-card-title{margin:0;font-family:var(--bp-ff-heading);font-weight:700;font-size:clamp(19px,2vw,24px);outline-offset:4px;}
    .mg-card-body{margin:0;font-size:14px;line-height:1.75;color:color-mix(in srgb, var(--bp-text) 68%, transparent);outline-offset:4px;}
    @media (max-width:860px){
      .mg-grid{grid-template-columns:1fr;max-width:480px;}
    }
    [data-builder-selected]{outline:1px solid var(--bp-accent, #ff7847);}
    @media (prefers-reduced-motion: reduce){ *{animation-duration:.001ms !important;transition-duration:.001ms !important;} }
  `,
  };
})();
