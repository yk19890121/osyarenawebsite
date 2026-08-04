/* BLENCI BUILDER — "Fullscreen Hero" layout: a single full-bleed photo with
   a big statement, two CTAs and a scroll cue. Good for landing pages that
   need one strong opening moment rather than a lot of content up front. */
window.BUILDER_LAYOUT_TEMPLATES = window.BUILDER_LAYOUT_TEMPLATES || {};

window.BUILDER_LAYOUT_TEMPLATES["fullscreen-hero"] = {
  html: `
    <section class="fh-hero" data-object-id="fh-background" data-object-type="background" data-object-role="primary-background" data-object-label="Background">
      <div class="es-noise" data-motion-slot="fh-background:continuous"></div>
      <figure class="fh-photo" data-object-id="fh-photo" data-object-type="image" data-object-role="primary-visual" data-object-label="Fullscreen Photo">
        <img alt="">
      </figure>
      <div class="fh-scrim"></div>
      <div class="fh-content">
        <p class="fh-eyebrow" data-object-id="fh-eyebrow" data-object-type="text" data-object-role="eyebrow" data-object-label="Eyebrow"></p>
        <h1 class="fh-title" data-object-id="fh-title" data-object-type="heading" data-object-role="primary-heading" data-object-label="Main Title"></h1>
        <p class="fh-subtitle" data-object-id="fh-subtitle" data-object-type="text" data-object-role="body-copy" data-object-label="Subtitle"></p>
        <div class="fh-actions">
          <a class="fh-cta" data-object-id="fh-cta" data-object-type="button" data-object-role="primary-cta" data-object-label="Primary CTA" href="#"></a>
          <a class="fh-cta fh-cta--ghost" data-object-id="fh-cta-secondary" data-object-type="button" data-object-role="secondary-cta" data-object-label="Secondary CTA" href="#"></a>
        </div>
      </div>
      <p class="fh-scroll-cue" data-object-id="fh-scroll-cue" data-object-type="text" data-object-role="scroll-cue" data-object-label="Scroll Cue"></p>
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
    .fh-hero{position:relative;min-height:100vh;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;}
    .es-noise{position:absolute;inset:0;opacity:0;pointer-events:none;mix-blend-mode:overlay;z-index:1;
      background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
      background-size:160px;}
    .es-noise.on{opacity:.4;}
    .fh-photo{position:absolute;inset:0;margin:0;}
    .fh-photo img{width:100%;height:100%;object-fit:cover;display:block;}
    .fh-scrim{position:absolute;inset:0;background:linear-gradient(180deg, color-mix(in srgb, var(--bp-bg) 10%, transparent) 0%, color-mix(in srgb, var(--bp-bg) 78%, transparent) 100%);z-index:1;}
    .fh-content{position:relative;z-index:2;padding:clamp(28px,6vw,80px);padding-top:clamp(120px,26vw,320px);max-width:900px;display:flex;flex-direction:column;gap:18px;}
    .fh-eyebrow{margin:0;font-family:var(--bp-ff-body);font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--bp-accent);outline-offset:4px;}
    .fh-title{margin:0;font-family:var(--bp-ff-heading);font-weight:700;font-size:clamp(48px,8vw,108px);line-height:.98;white-space:pre-line;outline-offset:4px;}
    .fh-subtitle{margin:0;font-size:16px;line-height:1.8;max-width:52ch;color:color-mix(in srgb, var(--bp-text) 78%, transparent);outline-offset:4px;}
    .fh-actions{display:flex;flex-wrap:wrap;gap:14px;margin-top:8px;}
    .fh-cta{display:inline-block;position:relative;padding:15px 32px;font-family:var(--bp-ff-body);font-size:12px;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;border:1px solid var(--bp-text);overflow:hidden;outline-offset:4px;}
    .fh-cta--ghost{border-color:color-mix(in srgb, var(--bp-text) 40%, transparent);}
    .es-button__fill{position:absolute;inset:0;background:var(--bp-text);transform:translateY(101%);z-index:0;}
    .es-button__label{position:relative;z-index:1;}
    .es-button__underline{position:absolute;left:32px;right:32px;bottom:11px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:left;}
    .fh-scroll-cue{position:relative;z-index:2;margin:0;align-self:center;padding-bottom:28px;font-family:var(--bp-ff-body);font-size:10px;letter-spacing:.2em;color:color-mix(in srgb, var(--bp-text) 60%, transparent);outline-offset:4px;}
    @media (max-width:640px){
      .fh-actions{flex-direction:column;align-items:flex-start;}
    }
    [data-builder-selected]{outline:1px solid var(--bp-accent, #ff7847);}
    @media (prefers-reduced-motion: reduce){ *{animation-duration:.001ms !important;transition-duration:.001ms !important;} }
  `,
};
