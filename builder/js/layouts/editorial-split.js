/* BLENCI BUILDER — "Editorial Split" layout: structural HTML + CSS.
   Layout decides structure/spacing/ratios; content, style and motion are
   applied on top by the renderer from state. Do not hardcode copy here
   beyond the initial placeholder text in data/layouts.js `defaults`. */
window.BUILDER_LAYOUT_TEMPLATES = window.BUILDER_LAYOUT_TEMPLATES || {};

window.BUILDER_LAYOUT_TEMPLATES["editorial-split"] = {
  html: `
    <section class="es-hero" data-object-id="hero-background" data-object-type="background" data-object-role="primary-background" data-object-label="Background">
      <div class="es-noise" data-motion-slot="hero-background:continuous"></div>
      <div class="es-inner">
        <div class="es-text">
          <p class="es-eyebrow" data-object-id="eyebrow" data-object-type="text" data-object-role="eyebrow" data-object-label="Eyebrow"></p>
          <h1 class="es-title" data-object-id="hero-title" data-object-type="heading" data-object-role="primary-heading" data-object-label="Main Title"></h1>
          <p class="es-description" data-object-id="hero-description" data-object-type="text" data-object-role="body-copy" data-object-label="Description"></p>
          <a class="es-button" data-object-id="hero-button" data-object-type="button" data-object-role="primary-cta" data-object-label="CTA Button" href="#"></a>
        </div>
        <figure class="es-visual" data-object-id="hero-image" data-object-type="image" data-object-role="primary-visual" data-object-label="Main Image">
          <img alt="">
        </figure>
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
    html,body{margin:0;height:100%;}
    body{background:var(--bp-bg);color:var(--bp-text);font-family:var(--bp-ff-body);-webkit-font-smoothing:antialiased;overflow-x:hidden;}
    a{color:inherit;}
    .es-hero{position:relative;min-height:100vh;display:flex;align-items:center;overflow:hidden;padding:clamp(28px,6vw,96px);}
    .es-noise{position:absolute;inset:0;opacity:0;pointer-events:none;mix-blend-mode:overlay;
      background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
      background-size:160px;}
    .es-noise.on{opacity:.4;}
    .es-inner{position:relative;z-index:1;width:100%;max-width:1240px;margin:0 auto;display:grid;grid-template-columns:1.1fr 1fr;gap:clamp(32px,6vw,96px);align-items:center;}
    .es-text{display:flex;flex-direction:column;align-items:flex-start;gap:20px;}
    .es-eyebrow{margin:0;font-family:var(--bp-ff-body);font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--bp-accent);outline-offset:4px;}
    .es-title{margin:0;font-family:var(--bp-ff-heading);font-weight:700;font-size:clamp(40px,6vw,80px);line-height:1.05;white-space:pre-line;outline-offset:4px;}
    .es-description{margin:0;font-size:16px;line-height:1.9;color:color-mix(in srgb, var(--bp-text) 72%, transparent);max-width:46ch;outline-offset:4px;}
    .es-button{display:inline-block;position:relative;margin-top:8px;padding:14px 30px;font-family:var(--bp-ff-body);font-size:12px;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;border:1px solid var(--bp-text);overflow:hidden;outline-offset:4px;}
    .es-button__fill{position:absolute;inset:0;background:var(--bp-text);transform:translateY(101%);z-index:0;}
    .es-button__label{position:relative;z-index:1;}
    .es-button__underline{position:absolute;left:30px;right:30px;bottom:10px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:left;}
    .es-visual{margin:0;position:relative;aspect-ratio:4/5;overflow:hidden;background:var(--bp-surface);outline-offset:4px;}
    .es-visual img{width:100%;height:100%;object-fit:cover;display:block;}
    @media (max-width:860px){
      .es-inner{grid-template-columns:1fr;}
      .es-visual{order:-1;aspect-ratio:5/4;}
    }
    [data-builder-selected]{outline:1px solid var(--bp-accent, #ff7847);}
    @media (prefers-reduced-motion: reduce){ *{animation-duration:.001ms !important;transition-duration:.001ms !important;} }
  `,
};
