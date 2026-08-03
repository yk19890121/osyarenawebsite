/* BLENCI LAB — Layout Catalogue */
(() => {
  "use strict";

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pad = (n) => String(n).padStart(2, "0");

  const LAYOUTS = [
    {
      name: "HERO + GRID",
      frame: "lf-hero-grid",
      blocks: `<div class="lf-block ga-hero lf-b-accent"></div><div class="lf-block ga-a"></div><div class="lf-block ga-b"></div><div class="lf-block ga-c"></div>`,
      desc: "単一の主張を大きく見せてから、選択肢を並べる。視線を迷わせない、もっとも基本的な型。",
      use: "LANDING PAGE / PRODUCT PAGE",
    },
    {
      name: "SPLIT SCREEN",
      frame: "lf-split",
      blocks: `<div class="lf-block ga-left lf-b-accent"></div><div class="lf-block ga-right lf-b-accent2"></div>`,
      desc: "2つの選択肢や対比を、同じ重みで並べて見せる。どちらかに誘導しすぎない構成。",
      use: "COMPARISON / DUAL CTA",
    },
    {
      name: "MAGAZINE / EDITORIAL",
      frame: "lf-magazine",
      blocks: `<div class="lf-block ga-feature lf-b-accent3"></div><div class="lf-block ga-side1"></div><div class="lf-block ga-side2"></div><div class="lf-block ga-cap lf-b-accent2"></div>`,
      desc: "非対称な段組みで視線に緩急をつける。写真とキャプションが呼吸する読み物向けの型。",
      use: "EDITORIAL / BLOG / STORY",
    },
    {
      name: "SIDEBAR + CONTENT",
      frame: "lf-sidebar",
      blocks: `<div class="lf-block ga-nav lf-b-accent2"></div><div class="lf-block ga-content1 lf-b-accent"></div><div class="lf-block ga-content2"></div><div class="lf-block ga-content3"></div>`,
      desc: "常に見えるナビゲーションと、切り替わるコンテンツ。位置を見失わせない安定感が武器。",
      use: "DOCS / DASHBOARD / ADMIN",
    },
    {
      name: "MASONRY GRID",
      frame: "lf-masonry",
      blocks: `<div class="lf-block lf-b-accent" style="height:70px"></div><div class="lf-block" style="height:44px"></div><div class="lf-block lf-b-accent3" style="height:90px"></div><div class="lf-block" style="height:56px"></div><div class="lf-block lf-b-accent2" style="height:64px"></div><div class="lf-block" style="height:40px"></div>`,
      desc: "高さの異なるカードを隙間なく敷き詰める。量の多さそのものが説得力になる型。",
      use: "GALLERY / PORTFOLIO",
    },
    {
      name: "FULL-BLEED SLIDESHOW",
      frame: "lf-fullbleed",
      blocks: `<div class="lf-block lf-b-accent"></div><div class="lf-fullbleed-dots"><span></span><span></span><span></span></div>`,
      desc: "一枚の画像に語らせる。情報を削ぎ落とし、世界観そのものを見せる型。",
      use: "BRAND SITE / FASHION",
    },
    {
      name: "Z-PATTERN LANDING",
      frame: "lf-zpattern",
      blocks: `<div class="lf-block ga-img1 lf-b-accent"></div><div class="lf-block ga-txt1"></div><div class="lf-block ga-txt2"></div><div class="lf-block ga-img2 lf-b-accent2"></div><div class="lf-block ga-img3 lf-b-accent3"></div><div class="lf-block ga-txt3"></div>`,
      desc: "視線の自然な動き(Z型)に沿って、画像とテキストを交互に配置していく型。",
      use: "STORYTELLING LP",
    },
    {
      name: "BENTO GRID",
      frame: "lf-bento",
      blocks: `<div class="lf-block ga-a lf-b-accent"></div><div class="lf-block ga-b"></div><div class="lf-block ga-c lf-b-accent3"></div><div class="lf-block ga-d lf-b-accent2"></div><div class="lf-block ga-e"></div><div class="lf-block ga-f"></div>`,
      desc: "大小さまざまなカードを一つの盤面にまとめる。最近よく見る、機能を並列に見せる型。",
      use: "FEATURES / DASHBOARD",
    },
  ];

  function buildCoverflow() {
    const track = document.getElementById("coverflow-layout-track");
    const dotsWrap = document.getElementById("cfl-dots");
    track.innerHTML = LAYOUTS.map(
      (l, i) => `<div class="cfl-item" data-index="${i}">
        <div class="layout-frame ${l.frame}">${l.blocks}</div>
        <span class="cfl-item-name">${pad(i + 1)} — ${l.name}</span>
      </div>`
    ).join("");
    dotsWrap.innerHTML = LAYOUTS.map((_, i) => `<span class="cfl-dot" data-index="${i}"></span>`).join("");

    const items = [...track.querySelectorAll(".cfl-item")];
    const dots = [...dotsWrap.querySelectorAll(".cfl-dot")];
    let active = 0;

    function renderDetail() {
      const l = LAYOUTS[active];
      document.getElementById("detail-index").textContent = `${pad(active + 1)} / ${pad(LAYOUTS.length)}`;
      document.getElementById("detail-name").textContent = l.name;
      document.getElementById("detail-desc").textContent = l.desc;
      document.getElementById("detail-use").textContent = l.use;
    }

    function layout() {
      items.forEach((el, i) => {
        const offset = i - active;
        const abs = Math.abs(offset);
        gsap.to(el, {
          x: offset * 190,
          z: -abs * 160,
          rotateY: offset * -32,
          scale: 1 - abs * 0.12,
          opacity: abs > 3 ? 0 : 1,
          zIndex: 100 - abs,
          duration: REDUCED ? 0 : 0.6,
          ease: "power3.out",
        });
      });
      dots.forEach((d, i) => d.classList.toggle("active", i === active));
      renderDetail();
    }

    function go(i) {
      active = gsap.utils.clamp(0, LAYOUTS.length - 1, i);
      layout();
    }

    document.getElementById("cfl-prev").addEventListener("click", () => go(active - 1));
    document.getElementById("cfl-next").addEventListener("click", () => go(active + 1));
    items.forEach((el, i) => el.addEventListener("click", () => go(i)));
    dots.forEach((d, i) => d.addEventListener("click", () => go(i)));
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") go(active - 1);
      if (e.key === "ArrowRight") go(active + 1);
    });

    layout();
  }

  function boot() { buildCoverflow(); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
