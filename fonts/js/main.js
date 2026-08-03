/* BLENCI LAB — Font Catalogue */
(() => {
  "use strict";

  const FINE_POINTER = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  const FONTS = [
    { name: "Space Grotesk", family: "'Space Grotesk', sans-serif", cat: "SANS-SERIF", desc: "幾何学的でテック感のあるサンセリフ", sample: "BLENCI 2026" },
    { name: "Inter", family: "'Inter', sans-serif", cat: "SANS-SERIF", desc: "UI・本文に強い、高い可読性の定番", sample: "Design System" },
    { name: "Poppins", family: "'Poppins', sans-serif", cat: "SANS-SERIF", desc: "丸みのあるジオメトリック", sample: "Friendly Grotesk" },
    { name: "Playfair Display", family: "'Playfair Display', serif", cat: "SERIF", desc: "ハイコントラストなハイファッション系", sample: "Vogue Editorial" },
    { name: "Lora", family: "'Lora', serif", cat: "SERIF", desc: "長文でも読みやすい柔らかな本文セリフ", sample: "Reading Comfort" },
    { name: "Cormorant", family: "'Cormorant', serif", cat: "SERIF", desc: "繊細で優美なディスプレイセリフ", sample: "Delicate Luxury" },
    { name: "Bebas Neue", family: "'Bebas Neue', sans-serif", cat: "DISPLAY", desc: "縦長で圧の強い見出し向け", sample: "IMPACT TITLE" },
    { name: "Anton", family: "'Anton', sans-serif", cat: "DISPLAY", desc: "極太でスポーティな存在感", sample: "BOLD STATEMENT" },
    { name: "Archivo Black", family: "'Archivo Black', sans-serif", cat: "DISPLAY", desc: "がっしりとした安定感のある極太", sample: "HEAVY WEIGHT" },
    { name: "JetBrains Mono", family: "'JetBrains Mono', monospace", cat: "MONOSPACE", desc: "コード表示向けの等幅", sample: "const x = 1;" },
    { name: "Space Mono", family: "'Space Mono', monospace", cat: "MONOSPACE", desc: "レトロでクセのある等幅", sample: "01001 CODE" },
    { name: "Caveat", family: "'Caveat', cursive", cat: "HANDWRITING", desc: "自然な手書き風スクリプト", sample: "Just a note" },
    { name: "Kalam", family: "'Kalam', cursive", cat: "HANDWRITING", desc: "カジュアルな手書き", sample: "Sketch it out" },
    { name: "Zen Kaku Gothic New", family: "'Zen Kaku Gothic New', sans-serif", cat: "日本語", desc: "モダンな角ゴシック", sample: "境界線をドラッグ" },
    { name: "Shippori Mincho", family: "'Shippori Mincho', serif", cat: "日本語", desc: "エディトリアルな明朝体", sample: "余白をデザインする" },
    { name: "Zen Maru Gothic", family: "'Zen Maru Gothic', sans-serif", cat: "日本語", desc: "やわらかい丸ゴシック", sample: "やさしい書体です" },
  ];

  function buildGroups() {
    const root = document.getElementById("font-groups");
    const cats = [...new Set(FONTS.map((f) => f.cat))];
    root.innerHTML = cats
      .map((cat) => {
        const items = FONTS.filter((f) => f.cat === cat);
        return `<section class="font-group">
          <h2 class="font-group-title">${cat}</h2>
          ${items
            .map(
              (f) => `<div class="font-card">
                <div class="font-meta">
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
    buildGroups();
    initEyeTracking();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
