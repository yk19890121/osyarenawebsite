/* BLENCI BUILDER — "Storytelling Landing" layout: a hero statement, two
   alternating image/text story blocks, and a closing CTA. Good for brand
   narratives, "about" pages, or campaign landing pages. */
window.BUILDER_LAYOUT_TEMPLATES = window.BUILDER_LAYOUT_TEMPLATES || {};

(() => {
  "use strict";
  function storyHtml(n, reverse) {
    return `
    <div class="sl-story ${reverse ? "sl-story--reverse" : ""}">
      <figure class="sl-story-visual" data-object-id="sl-story-${n}-visual" data-object-type="image" data-object-role="story-visual" data-object-label="Story ${n} Image">
        <img alt="">
      </figure>
      <div class="sl-story-text">
        <h2 class="sl-story-heading" data-object-id="sl-story-${n}-heading" data-object-type="heading" data-object-role="story-heading" data-object-label="Story ${n} Heading"></h2>
        <p class="sl-story-body" data-object-id="sl-story-${n}-body" data-object-type="text" data-object-role="story-body" data-object-label="Story ${n} Body"></p>
      </div>
    </div>
  `;
  }

  window.BUILDER_LAYOUT_TEMPLATES["storytelling-landing"] = {
    html: `
    <section class="sl-hero" data-object-id="sl-background" data-object-type="background" data-object-role="primary-background" data-object-label="Background">
      <div class="es-noise" data-motion-slot="sl-background:continuous"></div>
      <div class="sl-hero-inner">
        <p class="sl-eyebrow" data-object-id="sl-eyebrow" data-object-type="text" data-object-role="eyebrow" data-object-label="Eyebrow"></p>
        <h1 class="sl-title" data-object-id="sl-title" data-object-type="heading" data-object-role="primary-heading" data-object-label="Main Title"></h1>
        <p class="sl-subtitle" data-object-id="sl-subtitle" data-object-type="text" data-object-role="body-copy" data-object-label="Subtitle"></p>
        <a class="sl-cta" data-object-id="sl-cta" data-object-type="button" data-object-role="primary-cta" data-object-label="CTA Button" href="#"></a>
      </div>
    </section>
    <section class="sl-story-section">
      ${storyHtml(1, false)}
      ${storyHtml(2, true)}
    </section>
    <section class="sl-closing">
      <h2 class="sl-closing-heading" data-object-id="sl-closing-heading" data-object-type="heading" data-object-role="secondary-heading" data-object-label="Closing Heading"></h2>
      <a class="sl-closing-cta" data-object-id="sl-closing-cta" data-object-type="button" data-object-role="secondary-cta" data-object-label="Closing CTA" href="#"></a>
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
    .sl-hero{position:relative;min-height:82vh;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden;padding:clamp(28px,6vw,64px);}
    .es-noise{position:absolute;inset:0;opacity:0;pointer-events:none;mix-blend-mode:overlay;
      background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
      background-size:160px;}
    .es-noise.on{opacity:.35;}
    .sl-hero-inner{position:relative;z-index:1;max-width:760px;display:flex;flex-direction:column;align-items:center;gap:18px;}
    .sl-eyebrow{margin:0;font-family:var(--bp-ff-body);font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:var(--bp-accent);outline-offset:4px;}
    .sl-title{margin:0;font-family:var(--bp-ff-heading);font-weight:700;font-size:clamp(38px,6vw,72px);line-height:1.05;outline-offset:4px;}
    .sl-subtitle{margin:0;font-size:16px;line-height:1.85;max-width:52ch;color:color-mix(in srgb, var(--bp-text) 76%, transparent);outline-offset:4px;}
    .sl-cta, .sl-closing-cta{display:inline-block;position:relative;margin-top:6px;padding:14px 30px;font-family:var(--bp-ff-body);font-size:12px;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;border:1px solid var(--bp-text);overflow:hidden;outline-offset:4px;}
    .es-button__fill{position:absolute;inset:0;background:var(--bp-text);transform:translateY(101%);z-index:0;}
    .es-button__label{position:relative;z-index:1;}
    .es-button__underline{position:absolute;left:30px;right:30px;bottom:10px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:left;}
    .sl-story-section{max-width:1160px;margin:0 auto;padding:clamp(48px,8vw,120px) clamp(24px,5vw,64px);display:flex;flex-direction:column;gap:clamp(56px,10vw,120px);}
    .sl-story{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,5vw,64px);align-items:center;}
    .sl-story--reverse{direction:rtl;}
    .sl-story--reverse .sl-story-text{direction:ltr;}
    .sl-story-visual{margin:0;position:relative;aspect-ratio:5/4;overflow:hidden;background:var(--bp-surface);outline-offset:4px;}
    .sl-story-visual img{width:100%;height:100%;object-fit:cover;display:block;}
    .sl-story-text{direction:ltr;display:flex;flex-direction:column;gap:14px;}
    .sl-story-heading{margin:0;font-family:var(--bp-ff-heading);font-weight:700;font-size:clamp(26px,3vw,38px);line-height:1.15;outline-offset:4px;}
    .sl-story-body{margin:0;font-size:15px;line-height:1.85;color:color-mix(in srgb, var(--bp-text) 72%, transparent);max-width:46ch;outline-offset:4px;}
    .sl-closing{padding:clamp(56px,10vw,120px) clamp(24px,5vw,64px);text-align:center;display:flex;flex-direction:column;align-items:center;gap:22px;border-top:1px solid color-mix(in srgb, var(--bp-text) 12%, transparent);}
    .sl-closing-heading{margin:0;font-family:var(--bp-ff-heading);font-weight:700;font-size:clamp(28px,4vw,46px);max-width:20ch;outline-offset:4px;}
    @media (max-width:820px){
      .sl-story{grid-template-columns:1fr;}
      .sl-story--reverse{direction:ltr;}
    }
    [data-builder-selected]{outline:1px solid var(--bp-accent, #ff7847);}
    @media (prefers-reduced-motion: reduce){ *{animation-duration:.001ms !important;transition-duration:.001ms !important;} }
  `,
  };
})();
