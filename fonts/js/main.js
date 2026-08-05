/* BLENCI LAB — Font Catalogue */
(() => {
  "use strict";

  const FINE_POINTER = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const pad = (n) => String(n).padStart(2, "0");

  // GIMMICK 43 — SCROLL COLOR MORPH: one muted tone per font category,
  // ported from gimmicks/js/main.js initColorMorphV1 (same ScrollTrigger
  // enter/leave pattern, applied to the page background instead of a
  // small demo box).
  const CAT_COLORS = {
    "SANS-SERIF": "#151f2b",
    "SERIF": "#241615",
    "DISPLAY": "#241a0c",
    "MONOSPACE": "#0e211c",
    "HANDWRITING": "#20141f",
    "日本語": "#1c1210",
  };

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

  const FONTS = [
    { name: "Space Grotesk", family: "'Space Grotesk', sans-serif", cat: "SANS-SERIF", desc: "幾何学的でテック感のあるサンセリフ", sample: "BLENCI 2026" },
    { name: "Inter", family: "'Inter', sans-serif", cat: "SANS-SERIF", desc: "UI・本文に強い、高い可読性の定番", sample: "Design System" },
    { name: "Poppins", family: "'Poppins', sans-serif", cat: "SANS-SERIF", desc: "丸みのあるジオメトリック", sample: "Friendly Grotesk" },
    { name: "Manrope", family: "'Manrope', sans-serif", cat: "SANS-SERIF", desc: "すっきりとモダンな汎用サンセリフ", sample: "Clean & Modern" },
    { name: "Outfit", family: "'Outfit', sans-serif", cat: "SANS-SERIF", desc: "シンプルで柔らかいUIフォント", sample: "Outfit Grotesk" },
    { name: "Work Sans", family: "'Work Sans', sans-serif", cat: "SANS-SERIF", desc: "中立的で読みやすい実務向け", sample: "Work In Progress" },
    { name: "Sora", family: "'Sora', sans-serif", cat: "SANS-SERIF", desc: "やや丸みのある近未来的サンセリフ", sample: "Future Forward" },
    { name: "DM Sans", family: "'DM Sans', sans-serif", cat: "SANS-SERIF", desc: "低コントラストで扱いやすい定番", sample: "Material Sans" },
    { name: "Plus Jakarta Sans", family: "'Plus Jakarta Sans', sans-serif", cat: "SANS-SERIF", desc: "親しみやすいジオメトリック", sample: "Jakarta Nights" },
    { name: "Karla", family: "'Karla', sans-serif", cat: "SANS-SERIF", desc: "グロテスク系の温かみあるサンセリフ", sample: "Warm Grotesk" },

    { name: "Playfair Display", family: "'Playfair Display', serif", cat: "SERIF", desc: "ハイコントラストなハイファッション系", sample: "Vogue Editorial" },
    { name: "Lora", family: "'Lora', serif", cat: "SERIF", desc: "長文でも読みやすい柔らかな本文セリフ", sample: "Reading Comfort" },
    { name: "Cormorant", family: "'Cormorant', serif", cat: "SERIF", desc: "繊細で優美なディスプレイセリフ", sample: "Delicate Luxury" },
    { name: "Fraunces", family: "'Fraunces', serif", cat: "SERIF", desc: "個性的なウェットインクのセリフ", sample: "Wet Ink Serif" },
    { name: "Bodoni Moda", family: "'Bodoni Moda', serif", cat: "SERIF", desc: "極端なコントラストのモダンセリフ", sample: "Fashion Bodoni" },
    { name: "Libre Baskerville", family: "'Libre Baskerville', serif", cat: "SERIF", desc: "印刷物のような伝統的セリフ", sample: "Classic Print" },
    { name: "EB Garamond", family: "'EB Garamond', serif", cat: "SERIF", desc: "歴史あるオールドスタイルセリフ", sample: "Old Style Text" },
    { name: "Crimson Text", family: "'Crimson Text', serif", cat: "SERIF", desc: "学術書のような端正なセリフ", sample: "Scholarly Text" },
    { name: "Newsreader", family: "'Newsreader', serif", cat: "SERIF", desc: "新聞のような可読性重視のセリフ", sample: "News Reader" },
    { name: "Spectral", family: "'Spectral', serif", cat: "SERIF", desc: "画面表示に最適化されたセリフ", sample: "Screen Serif" },

    { name: "Bebas Neue", family: "'Bebas Neue', sans-serif", cat: "DISPLAY", desc: "縦長で圧の強い見出し向け", sample: "IMPACT TITLE" },
    { name: "Anton", family: "'Anton', sans-serif", cat: "DISPLAY", desc: "極太でスポーティな存在感", sample: "BOLD STATEMENT" },
    { name: "Archivo Black", family: "'Archivo Black', sans-serif", cat: "DISPLAY", desc: "がっしりとした安定感のある極太", sample: "HEAVY WEIGHT" },
    { name: "Oswald", family: "'Oswald', sans-serif", cat: "DISPLAY", desc: "縦長コンデンスなグロテスク", sample: "CONDENSED IMPACT" },
    { name: "Fjalla One", family: "'Fjalla One', sans-serif", cat: "DISPLAY", desc: "シャープな北欧系コンデンス", sample: "NORDIC EDGE" },
    { name: "Bungee", family: "'Bungee', sans-serif", cat: "DISPLAY", desc: "ポップでアーバンな極太", sample: "URBAN POP" },
    { name: "Righteous", family: "'Righteous', sans-serif", cat: "DISPLAY", desc: "レトロでカジュアルな見出し", sample: "RETRO VIBES" },
    { name: "Alfa Slab One", family: "'Alfa Slab One', serif", cat: "DISPLAY", desc: "重厚なスラブセリフの極太", sample: "HEAVY SLAB" },
    { name: "Passion One", family: "'Passion One', sans-serif", cat: "DISPLAY", desc: "丸みのあるポップな極太", sample: "PASSION POP" },

    { name: "JetBrains Mono", family: "'JetBrains Mono', monospace", cat: "MONOSPACE", desc: "コード表示向けの等幅", sample: "const x = 1;" },
    { name: "Space Mono", family: "'Space Mono', monospace", cat: "MONOSPACE", desc: "レトロでクセのある等幅", sample: "01001 CODE" },
    { name: "IBM Plex Mono", family: "'IBM Plex Mono', monospace", cat: "MONOSPACE", desc: "エンジニアリング感のある等幅", sample: "System.out" },
    { name: "Fira Code", family: "'Fira Code', monospace", cat: "MONOSPACE", desc: "リガチャが美しいコード用", sample: "=> lambda" },
    { name: "Roboto Mono", family: "'Roboto Mono', monospace", cat: "MONOSPACE", desc: "Android標準の等幅", sample: "android_mono" },
    { name: "Source Code Pro", family: "'Source Code Pro', monospace", cat: "MONOSPACE", desc: "Adobe製の定番コード用", sample: "source.code" },

    { name: "Caveat", family: "'Caveat', cursive", cat: "HANDWRITING", desc: "自然な手書き風スクリプト", sample: "Just a note" },
    { name: "Kalam", family: "'Kalam', cursive", cat: "HANDWRITING", desc: "カジュアルな手書き", sample: "Sketch it out" },
    { name: "Dancing Script", family: "'Dancing Script', cursive", cat: "HANDWRITING", desc: "流れるような筆記体", sample: "Elegant Script" },
    { name: "Pacifico", family: "'Pacifico', cursive", cat: "HANDWRITING", desc: "丸くポップな筆記体", sample: "Surf Vibes" },
    { name: "Indie Flower", family: "'Indie Flower', cursive", cat: "HANDWRITING", desc: "素朴でゆるい手書き", sample: "Doodle Notes" },
    { name: "Shadows Into Light", family: "'Shadows Into Light', cursive", cat: "HANDWRITING", desc: "軽やかな手書き風", sample: "Light Shadow" },

    { name: "Zen Kaku Gothic New", family: "'Zen Kaku Gothic New', sans-serif", cat: "日本語", desc: "モダンな角ゴシック", sample: "境界線をドラッグ" },
    { name: "Shippori Mincho", family: "'Shippori Mincho', serif", cat: "日本語", desc: "エディトリアルな明朝体", sample: "余白をデザインする" },
    { name: "Zen Maru Gothic", family: "'Zen Maru Gothic', sans-serif", cat: "日本語", desc: "やわらかい丸ゴシック", sample: "やさしい書体です" },
    { name: "Noto Sans JP", family: "'Noto Sans JP', sans-serif", cat: "日本語", desc: "汎用的な標準ゴシック", sample: "標準的な文字組み" },
    { name: "Noto Serif JP", family: "'Noto Serif JP', serif", cat: "日本語", desc: "汎用的な明朝体", sample: "伝統と革新の明朝" },
    { name: "M PLUS 1p", family: "'M PLUS 1p', sans-serif", cat: "日本語", desc: "視認性の高いゴシック", sample: "視認性重視の書体" },
    { name: "M PLUS Rounded 1c", family: "'M PLUS Rounded 1c', sans-serif", cat: "日本語", desc: "丸みのある親しみやすいゴシック", sample: "まるくてやさしい" },
    { name: "Kosugi Maru", family: "'Kosugi Maru', sans-serif", cat: "日本語", desc: "カジュアルな丸ゴシック", sample: "ポップな丸文字" },
    { name: "Yuji Syuku", family: "'Yuji Syuku', serif", cat: "日本語", desc: "筆致を感じる縦書き向け明朝", sample: "筆致を感じる書体" },
  ];

  function buildGroups() {
    const root = document.getElementById("font-groups");
    const cats = [...new Set(FONTS.map((f) => f.cat))];
    root.innerHTML = cats
      .map((cat) => {
        const items = FONTS.filter((f) => f.cat === cat);
        return `<section class="font-group" data-color="${CAT_COLORS[cat] || ""}">
          <h2 class="font-group-title">${cat}</h2>
          ${items
            .map(
              (f) => `<div class="font-card">
                <div class="font-meta">
                  <p class="font-num-row"><span class="tag-num">${pad(FONTS.indexOf(f) + 1)}</span></p>
                  <span class="font-name">${f.name}</span>
                  <span class="font-desc">${f.desc}</span>
                </div>
                <p class="font-sample" style="font-family:${f.family}">${[...f.sample]
                  .map((c) => (c === " " ? " " : `<span class="eye-char">${c}</span>`))
                  .join("")}</p>
              </div>`
            )
            .join("")}
        </section>`;
      })
      .join("");
  }

  function initColorMorph() {
    if (REDUCED || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const root = document.getElementById("font-groups");
    const sections = [...document.querySelectorAll(".font-group[data-color]")];
    if (!root || !sections.length) return;

    // Each category section is much taller than the viewport (up to 10
    // cards), so a per-section onLeave that reset the background to ""
    // left a gap between "this section's trigger ends" and "the next
    // section's trigger starts" -- during that gap the background fell
    // back to the near-black page default, reading as a flash to black
    // between every color instead of a clean handoff. Fix: sections only
    // ever SET the color on enter (no reset), so whichever category was
    // entered most recently just stays until the next one overwrites it.
    // A single separate trigger spanning all sections handles reverting
    // to the default once you've scrolled above the first one or below
    // the last one (hero / footer).
    sections.forEach((section) => {
      const color = section.dataset.color;
      if (!color) return;
      ScrollTrigger.create({
        trigger: section, start: "top center", end: "bottom center",
        onEnter: () => (document.body.style.backgroundColor = color),
        onEnterBack: () => (document.body.style.backgroundColor = color),
      });
    });
    ScrollTrigger.create({
      trigger: root, start: "top bottom", end: "bottom top",
      onLeave: () => (document.body.style.backgroundColor = ""),
      onLeaveBack: () => (document.body.style.backgroundColor = ""),
    });

    // Web fonts finishing to load after the initial layout pass can shift
    // section heights enough to make the trigger boundaries computed above
    // stale; recompute them once everything has settled.
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }
  }

  function initEyeTracking() {
    if (!FINE_POINTER) return;
    let positions = [];
    let measureQueued = false;
    function measure() {
      positions = [...document.querySelectorAll(".eye-char")].map((el) => {
        const r = el.getBoundingClientRect();
        return { el, cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
      });
      measureQueued = false;
    }
    function queueMeasure() {
      if (measureQueued) return;
      measureQueued = true;
      requestAnimationFrame(measure);
    }
    measure();
    window.addEventListener("resize", queueMeasure);
    window.addEventListener("scroll", queueMeasure, { passive: true });
    const RADIUS = 160;
    window.addEventListener("mousemove", (e) => {
      positions.forEach((p) => {
        const dist = Math.hypot(e.clientX - p.cx, e.clientY - p.cy);
        if (dist > RADIUS) { p.el.style.transform = "rotate(0deg)"; return; }
        const angle = (Math.atan2(e.clientY - p.cy, e.clientX - p.cx) * 180) / Math.PI;
        const clamped = Math.max(-28, Math.min(28, angle / 4));
        const falloff = 1 - dist / RADIUS;
        p.el.style.transform = `rotate(${clamped * falloff}deg)`;
      });
    });
  }

  function boot() {
    initBgCrossfade();
    buildGroups();
    initColorMorph();
    initEyeTracking();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
