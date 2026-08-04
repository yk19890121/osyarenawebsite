/* BLENCI LAB — Layout Catalogue */
(() => {
  "use strict";

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pad = (n) => String(n).padStart(2, "0");

  function initBgCrossfade() {
    const slides = document.querySelectorAll(".bg-slide");
    if (slides.length < 2 || REDUCED) return;
    let i = 0;
    setInterval(() => {
      slides[i].classList.remove("active");
      i = (i + 1) % slides.length;
      slides[i].classList.add("active");
    }, 4500);
  }

  const IMG = (n) => `../assets/img/look-${String(n).padStart(2, "0")}-0.webp`;

  const LAYOUTS = [
    {
      name: "HERO + GRID",
      frame: "lf-hero-grid",
      blocks: `<div class="lf-block ga-hero lf-photo" style="background-image:url(${IMG(1)})"></div><div class="lf-block ga-a"></div><div class="lf-block ga-b"></div><div class="lf-block ga-c"></div>`,
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
      blocks: `<div class="lf-block ga-nav lf-b-accent2"></div><div class="lf-block ga-content1 lf-photo" style="background-image:url(${IMG(13)})"></div><div class="lf-block ga-content2"></div><div class="lf-block ga-content3"></div>`,
      desc: "常に見えるナビゲーションと、切り替わるコンテンツ。位置を見失わせない安定感が武器。",
      use: "DOCS / DASHBOARD / ADMIN",
    },
    {
      name: "MASONRY GRID",
      frame: "lf-masonry",
      blocks: `<div class="lf-block lf-photo" style="height:70px;background-image:url(${IMG(2)})"></div><div class="lf-block" style="height:44px"></div><div class="lf-block lf-photo" style="height:90px;background-image:url(${IMG(14)})"></div><div class="lf-block" style="height:56px"></div><div class="lf-block lf-photo" style="height:64px;background-image:url(${IMG(10)})"></div><div class="lf-block" style="height:40px"></div>`,
      desc: "高さの異なるカードを隙間なく敷き詰める。量の多さそのものが説得力になる型。",
      use: "GALLERY / PORTFOLIO",
    },
    {
      name: "FULL-BLEED SLIDESHOW",
      frame: "lf-fullbleed",
      blocks: `<div class="lf-block lf-photo" style="background-image:url(${IMG(14)})"></div><div class="lf-fullbleed-dots"><span></span><span></span><span></span></div>`,
      desc: "一枚の画像に語らせる。情報を削ぎ落とし、世界観そのものを見せる型。",
      use: "BRAND SITE / FASHION",
    },
    {
      name: "Z-PATTERN LANDING",
      frame: "lf-zpattern",
      blocks: `<div class="lf-block ga-img1 lf-photo" style="background-image:url(${IMG(1)})"></div><div class="lf-block ga-txt1"></div><div class="lf-block ga-txt2"></div><div class="lf-block ga-img2 lf-photo" style="background-image:url(${IMG(8)})"></div><div class="lf-block ga-img3 lf-photo" style="background-image:url(${IMG(17)})"></div><div class="lf-block ga-txt3"></div>`,
      desc: "視線の自然な動き(Z型)に沿って、画像とテキストを交互に配置していく型。",
      use: "STORYTELLING LP",
    },
    {
      name: "BENTO GRID",
      frame: "lf-bento",
      blocks: `<div class="lf-block ga-a lf-photo" style="background-image:url(${IMG(5)})"></div><div class="lf-block ga-b"></div><div class="lf-block ga-c lf-photo" style="background-image:url(${IMG(12)})"></div><div class="lf-block ga-d lf-b-accent2"></div><div class="lf-block ga-e"></div><div class="lf-block ga-f"></div>`,
      desc: "大小さまざまなカードを一つの盤面にまとめる。最近よく見る、機能を並列に見せる型。",
      use: "FEATURES / DASHBOARD",
    },
    {
      name: "CARD GRID",
      frame: "lf-cardgrid",
      blocks: `<div class="lf-block lf-b-accent"></div><div class="lf-block"></div><div class="lf-block lf-b-accent2"></div><div class="lf-block"></div><div class="lf-block lf-b-accent3"></div><div class="lf-block"></div>`,
      desc: "同じ形・同じ重みのカードを均等に並べる。もっとも素直で公平な一覧表示。",
      use: "PRODUCT LIST / BLOG INDEX",
    },
    {
      name: "STICKY SCROLL STORY",
      frame: "lf-sticky",
      blocks: `<div class="lf-block ga-img lf-photo" style="background-image:url(${IMG(1)})"></div><div class="lf-block ga-content1 lf-b-accent2"></div><div class="lf-block ga-content2"></div><div class="lf-block ga-content3"></div>`,
      desc: "画像を貼りつけたまま、隣のテキストだけがスクロールで進む。物語を段階的に語る型。",
      use: "PRODUCT STORY / SCROLLYTELLING",
    },
    {
      name: "CENTERED ARTICLE",
      frame: "lf-article",
      blocks: `<div class="lf-block lf-photo" style="background-image:url(${IMG(17)})"></div><div class="lf-block lf-b-accent2"></div><div class="lf-block"></div><div class="lf-block"></div>`,
      desc: "余白をたっぷり取った、中央寄せの一本道レイアウト。読むことに集中させる型。",
      use: "ARTICLE / BLOG POST",
    },
    {
      name: "HOLY GRAIL",
      frame: "lf-holygrail",
      blocks: `<div class="lf-block ga-head lf-b-accent2"></div><div class="lf-block ga-nav"></div><div class="lf-block ga-main lf-photo" style="background-image:url(${IMG(16)})"></div><div class="lf-block ga-aside"></div><div class="lf-block ga-foot lf-b-accent3"></div>`,
      desc: "ヘッダー・フッター・ナビ・本文・補足の5領域を持つ、Webの原点とも言える定番構成。",
      use: "PORTAL SITE / FORUM",
    },
    {
      name: "OFF-CANVAS DRAWER",
      frame: "lf-offcanvas",
      blocks: `<div class="lf-block ga-drawer lf-b-accent2"></div><div class="lf-block ga-main lf-photo" style="background-image:url(${IMG(16)})"></div>`,
      desc: "普段は隠れているメニューが横から滑り出てくる。画面を広く使いたいアプリ向け。",
      use: "MOBILE APP / WEB APP",
    },
    {
      name: "HORIZONTAL CARD SCROLL",
      frame: "lf-hscroll",
      blocks: `<div class="lf-block lf-b-accent"></div><div class="lf-block lf-b-accent2"></div><div class="lf-block lf-b-accent3"></div>`,
      desc: "縦のスクロールとは別に、カードだけが横に流れる。一覧性と省スペースを両立。",
      use: "RECOMMENDATIONS / CATEGORY LIST",
    },
    {
      name: "DIAGONAL SPLIT",
      frame: "lf-diagonal",
      blocks: `<div class="lf-block diag-a lf-photo" style="background-image:url(${IMG(18)})"></div><div class="lf-block diag-b lf-b-accent2"></div>`,
      desc: "水平・垂直をあえて崩し、斜めの線で画面を分割する。動きと緊張感を演出する型。",
      use: "SPORTS / CAMPAIGN LP",
    },
    {
      name: "VERTICAL TIMELINE",
      frame: "lf-timeline",
      blocks: `<div class="lf-block lf-b-accent"></div><div class="lf-block lf-b-accent2"></div><div class="lf-block lf-b-accent3"></div><div class="lf-block"></div>`,
      desc: "中央の線を軸に、左右交互に出来事を並べる。時系列・沿革ページの定番。",
      use: "COMPANY HISTORY / ROADMAP",
    },
    {
      name: "DASHBOARD WIDGETS",
      frame: "lf-dashboard",
      blocks: `<div class="lf-block lf-b-accent"></div><div class="lf-block lf-b-accent2"></div><div class="lf-block"></div><div class="lf-block lf-b-accent3"></div>`,
      desc: "大きさの異なる複数のパネルを、盤面のように組み合わせる。管理画面の定石。",
      use: "ADMIN / ANALYTICS",
    },
    {
      name: "PRICING TABLE",
      frame: "lf-pricing",
      blocks: `<div class="lf-block" style="height:60%"></div><div class="lf-block lf-b-accent" style="height:80%"></div><div class="lf-block" style="height:60%"></div>`,
      desc: "3つのプランを横並びで比較させる。真ん中を目立たせて視線を誘導する型。",
      use: "PRICING / PLAN COMPARISON",
    },
    {
      name: "STICKY NAV BAR",
      frame: "lf-stickynav",
      blocks: `<div class="lf-block ga-head lf-b-accent2"></div><div class="lf-block ga-main lf-photo" style="background-image:url(${IMG(3)})"></div>`,
      desc: "細いヘッダーだけが常に画面上部に張りつく、もっとも一般的なナビゲーション。",
      use: "ALMOST ANY WEBSITE",
    },
    {
      name: "TEXT OVER IMAGE",
      frame: "lf-textoverimage",
      blocks: `<div class="lf-block lf-photo" style="background-image:url(${IMG(18)})"></div><div class="lf-overlay-bar"></div>`,
      desc: "画像の上に直接テキストを重ねる。余白で区切らず、写真とコピーを一体化させる型。",
      use: "CAMPAIGN BANNER / POSTER",
    },
    {
      name: "ACCORDION STACK",
      frame: "lf-accordion",
      blocks: `<div class="lf-block lf-b-accent2"></div><div class="lf-block lf-b-accent"></div><div class="lf-block"></div><div class="lf-block"></div>`,
      desc: "見出しをクリックすると中身が開く、縦積みの省スペースリスト。",
      use: "FAQ / SPEC LIST",
    },
    {
      name: "TABBED PANELS",
      frame: "lf-tabs",
      blocks: `<div class="tab-row"><div class="lf-block lf-b-accent"></div><div class="lf-block"></div><div class="lf-block"></div></div><div class="tab-content lf-block lf-photo" style="background-image:url(${IMG(15)})"></div>`,
      desc: "タブを切り替えて、同じ場所に違う中身を出し入れする。画面を圧迫しない情報整理。",
      use: "PRODUCT SPEC / SETTINGS",
    },
    {
      name: "SOCIAL FEED",
      frame: "lf-feed",
      blocks: `<div class="feed-post"><div class="lf-block feed-avatar lf-b-accent"></div><div class="lf-block feed-body"></div></div><div class="feed-post"><div class="lf-block feed-avatar lf-b-accent2"></div><div class="lf-block feed-body"></div></div><div class="feed-post"><div class="lf-block feed-avatar lf-b-accent3"></div><div class="lf-block feed-body"></div></div>`,
      desc: "投稿が縦一列に積み上がっていく、タイムライン形式のフィード。",
      use: "SNS / COMMUNITY / NEWS FEED",
    },
    {
      name: "THUMBNAIL GRID",
      frame: "lf-thumbgrid",
      blocks: [1, 2, 8, 10, 12, 16, 13, 15].map((n) => `<div class="lf-block lf-photo" style="background-image:url(${IMG(n)})"></div>`).join(""),
      desc: "同じ大きさのサムネイルを規則正しく並べる。写真そのものを主役にする型。",
      use: "PHOTO GALLERY / INSTAGRAM GRID",
    },
    {
      name: "VIDEO HERO",
      frame: "lf-videohero",
      blocks: `<div class="lf-block lf-photo" style="background-image:url(${IMG(12)})"></div><div class="play-btn"></div>`,
      desc: "全画面の背景に再生ボタンを添えるだけの、削ぎ落とされたヒーロー。",
      use: "BRAND FILM / SHOWREEL",
    },
    {
      name: "MEGA FOOTER",
      frame: "lf-megafooter",
      blocks: Array.from({ length: 4 })
        .map(
          () =>
            `<div class="lf-block foot-head lf-b-accent2"></div><div class="lf-block"></div><div class="lf-block"></div><div class="lf-block"></div>`
        )
        .join(""),
      desc: "リンクを多段組みで並べる、情報量の多い巨大フッター。サイト全体の目次になる。",
      use: "CORPORATE SITE / EC",
    },
    {
      name: "BEFORE / AFTER SLIDER",
      frame: "lf-beforeafter",
      blocks: `<div class="lf-block ba-before lf-photo" style="background-image:url(${IMG(2)})"></div><div class="lf-block ba-after lf-photo" style="background-image:url(${IMG(8)})"></div><div class="ba-divider"></div><div class="ba-handle"></div>`,
      desc: "1枚の画像を境界線でドラッグして比較させる。変化や違いを直感的に伝える型。",
      use: "BEFORE/AFTER / RENOVATION",
    },
    {
      name: "ASYMMETRIC HERO",
      frame: "lf-asymhero",
      blocks: `<div class="lf-block ga-img lf-photo" style="background-image:url(${IMG(12)})"></div><div class="lf-block ga-text1 lf-b-accent2"></div><div class="lf-block ga-text2"></div>`,
      desc: "画像とテキストを50/50ではなく、あえて非対称な比率で組む。動きのある印象に。",
      use: "MAGAZINE-STYLE LANDING",
    },
    {
      name: "SLIDE DECK VIEWER",
      frame: "lf-slidedeck",
      blocks: `<div class="lf-block ga-main lf-photo" style="background-image:url(${IMG(2)})"></div><div class="slide-strip ga-strip"><div class="lf-block lf-b-accent"></div><div class="lf-block"></div><div class="lf-block"></div><div class="lf-block"></div></div>`,
      desc: "大きなメインスライドの下に、サムネイルのフィルムストリップを並べる。今どこを見ているかを常に示す型。",
      use: "SLIDE DECK / PRESENTATION VIEWER",
    },
    {
      name: "FULLSCREEN SLIDE CAROUSEL",
      frame: "lf-slidefull",
      blocks: `<div class="lf-block lf-photo" style="background-image:url(${IMG(15)})"><span class="slide-counter">03 / 12</span></div><div class="slide-progress"></div>`,
      desc: "1枚のスライドを画面いっぱいに映し、下端の進行バーだけで枚数を示す。発表そのものに集中させる型。",
      use: "KEYNOTE / PITCH DECK",
    },
    {
      name: "SPLIT SLIDE + OUTLINE",
      frame: "lf-slideoutline",
      blocks: `<div class="lf-block ga-main lf-photo" style="background-image:url(${IMG(17)})"></div><div class="outline-list ga-outline"><div class="lf-block lf-b-accent"></div><div class="lf-block"></div><div class="lf-block"></div><div class="lf-block"></div><div class="lf-block"></div></div>`,
      desc: "メインスライドの横に、全体の構成が一覧できるアウトラインを添える。編集画面のような使い方もできる型。",
      use: "SLIDE EDITOR / TRAINING MATERIAL",
    },
    {
      name: "HEADLINE + RANKING LIST",
      frame: "lf-newsheadline",
      blocks: `<div class="lf-block ga-headline lf-photo" style="background-image:url(${IMG(1)})"></div><div class="ga-rank1"><div class="lf-block lf-b-accent"></div></div><div class="ga-rank2"><div class="lf-block"></div></div><div class="ga-rank3"><div class="lf-block"></div></div>`,
      desc: "一番大きなニュースを写真ごと主役にして、横に順位つきのランキングリストを添える。ポータルサイトの定番トップ。",
      use: "NEWS PORTAL / CURATION TOP",
    },
    {
      name: "CATEGORY TABS NEWS GRID",
      frame: "lf-newsgrid",
      blocks: `<div class="news-tabs"><div class="lf-block lf-b-accent"></div><div class="lf-block"></div><div class="lf-block"></div><div class="lf-block"></div></div><div class="news-cards"><div class="lf-block lf-photo" style="background-image:url(${IMG(3)})"></div><div class="lf-block lf-photo" style="background-image:url(${IMG(13)})"></div><div class="lf-block lf-b-accent2"></div><div class="lf-block"></div></div>`,
      desc: "カテゴリのタブで絞り込んでから、記事カードを格子状に並べる。ジャンルの多いキュレーションサイト向け。",
      use: "NEWS CURATION / TOPIC GRID",
    },
    {
      name: "TICKER + MULTI-COLUMN NEWS",
      frame: "lf-newsticker",
      blocks: `<div class="lf-block ticker-bar lf-b-accent"></div><div class="news-columns"><div class="news-col"><div class="lf-block"></div><div class="lf-block"></div><div class="lf-block"></div></div><div class="news-col"><div class="lf-block"></div><div class="lf-block"></div><div class="lf-block"></div></div><div class="news-col"><div class="lf-block"></div><div class="lf-block"></div><div class="lf-block"></div></div></div>`,
      desc: "速報ティッカーの下に、見出しだけの記事を3段組みで詰め込む。情報密度を優先した古典的なポータル型。",
      use: "NEWS AGGREGATOR / WIRE SERVICE",
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

  function boot() { initBgCrossfade(); buildCoverflow(); }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
