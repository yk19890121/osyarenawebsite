/* BLENCI BUILDER — "News Curation" layout: a masthead, one featured story,
   and a 3-up article grid below it. Good for news/editorial curation sites
   and magazine-style content hubs. */
window.BUILDER_LAYOUT_TEMPLATES = window.BUILDER_LAYOUT_TEMPLATES || {};

(() => {
  "use strict";
  function articleHtml(n) {
    return `
    <article class="nc-article">
      <figure class="nc-article-visual" data-object-id="nc-article-${n}-visual" data-object-type="image" data-object-role="article-visual" data-object-label="Article ${n} Image">
        <img alt="">
      </figure>
      <h3 class="nc-article-heading" data-object-id="nc-article-${n}-heading" data-object-type="heading" data-object-role="article-heading" data-object-label="Article ${n} Heading"></h3>
      <p class="nc-article-summary" data-object-id="nc-article-${n}-summary" data-object-type="text" data-object-role="article-summary" data-object-label="Article ${n} Summary"></p>
    </article>
  `;
  }

  window.BUILDER_LAYOUT_TEMPLATES["news-curation"] = {
    html: `
    <section class="nc-page" data-object-id="nc-background" data-object-type="background" data-object-role="primary-background" data-object-label="Background">
      <div class="es-noise" data-motion-slot="nc-background:continuous"></div>
      <header class="nc-masthead">
        <p class="nc-sitename" data-object-id="nc-sitename" data-object-type="text" data-object-role="site-name" data-object-label="Site Name"></p>
        <p class="nc-tagline" data-object-id="nc-tagline" data-object-type="text" data-object-role="tagline" data-object-label="Tagline"></p>
      </header>
      <section class="nc-featured">
        <figure class="nc-featured-visual" data-object-id="nc-featured-visual" data-object-type="image" data-object-role="featured-visual" data-object-label="Featured Image">
          <img alt="">
        </figure>
        <div class="nc-featured-text">
          <h1 class="nc-featured-heading" data-object-id="nc-featured-heading" data-object-type="heading" data-object-role="featured-heading" data-object-label="Featured Heading"></h1>
          <p class="nc-featured-body" data-object-id="nc-featured-body" data-object-type="text" data-object-role="featured-body" data-object-label="Featured Body"></p>
          <a class="nc-featured-cta" data-object-id="nc-featured-cta" data-object-type="button" data-object-role="featured-cta" data-object-label="Featured CTA" href="#"></a>
        </div>
      </section>
      <section class="nc-articles">
        ${articleHtml(1)}
        ${articleHtml(2)}
        ${articleHtml(3)}
      </section>
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
    .nc-page{position:relative;padding:clamp(24px,5vw,56px);}
    .es-noise{position:absolute;inset:0;opacity:0;pointer-events:none;mix-blend-mode:overlay;
      background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
      background-size:160px;}
    .es-noise.on{opacity:.3;}
    .nc-masthead{position:relative;z-index:1;max-width:1240px;margin:0 auto;padding-bottom:22px;border-bottom:1px solid color-mix(in srgb, var(--bp-text) 16%, transparent);display:flex;flex-direction:column;gap:6px;}
    .nc-sitename{margin:0;font-family:var(--bp-ff-heading);font-weight:700;font-size:clamp(22px,3vw,30px);letter-spacing:.02em;outline-offset:4px;}
    .nc-tagline{margin:0;font-size:12px;letter-spacing:.06em;color:color-mix(in srgb, var(--bp-text) 62%, transparent);outline-offset:4px;}
    .nc-featured{position:relative;z-index:1;max-width:1240px;margin:0 auto;margin-top:clamp(28px,4vw,44px);
      display:grid;grid-template-columns:1.3fr 1fr;gap:clamp(24px,4vw,48px);align-items:center;}
    .nc-featured-visual{margin:0;position:relative;aspect-ratio:16/10;overflow:hidden;background:var(--bp-surface);outline-offset:4px;}
    .nc-featured-visual img{width:100%;height:100%;object-fit:cover;display:block;}
    .nc-featured-text{display:flex;flex-direction:column;gap:16px;}
    .nc-featured-heading{margin:0;font-family:var(--bp-ff-heading);font-weight:700;font-size:clamp(28px,4vw,44px);line-height:1.1;outline-offset:4px;}
    .nc-featured-body{margin:0;font-size:15px;line-height:1.85;color:color-mix(in srgb, var(--bp-text) 74%, transparent);max-width:46ch;outline-offset:4px;}
    .nc-featured-cta{align-self:flex-start;position:relative;padding:13px 26px;font-family:var(--bp-ff-body);font-size:11px;letter-spacing:.1em;text-transform:uppercase;text-decoration:none;border:1px solid var(--bp-text);overflow:hidden;outline-offset:4px;}
    .es-button__fill{position:absolute;inset:0;background:var(--bp-text);transform:translateY(101%);z-index:0;}
    .es-button__label{position:relative;z-index:1;}
    .es-button__underline{position:absolute;left:26px;right:26px;bottom:9px;height:1px;background:currentColor;transform:scaleX(0);transform-origin:left;}
    .nc-articles{position:relative;z-index:1;max-width:1240px;margin:0 auto;margin-top:clamp(44px,6vw,72px);
      display:grid;grid-template-columns:repeat(3,1fr);gap:clamp(22px,3vw,36px);padding-top:32px;border-top:1px solid color-mix(in srgb, var(--bp-text) 12%, transparent);}
    .nc-article{display:flex;flex-direction:column;gap:12px;}
    .nc-article-visual{margin:0;position:relative;aspect-ratio:3/2;overflow:hidden;background:var(--bp-surface);outline-offset:4px;}
    .nc-article-visual img{width:100%;height:100%;object-fit:cover;display:block;}
    .nc-article-heading{margin:0;font-family:var(--bp-ff-heading);font-weight:700;font-size:clamp(17px,2vw,21px);line-height:1.25;outline-offset:4px;}
    .nc-article-summary{margin:0;font-size:13px;line-height:1.7;color:color-mix(in srgb, var(--bp-text) 66%, transparent);outline-offset:4px;}
    @media (max-width:860px){
      .nc-featured{grid-template-columns:1fr;}
      .nc-articles{grid-template-columns:1fr;max-width:480px;}
    }
    [data-builder-selected]{outline:1px solid var(--bp-accent, #ff7847);}
    @media (prefers-reduced-motion: reduce){ *{animation-duration:.001ms !important;transition-duration:.001ms !important;} }
  `,
  };
})();
