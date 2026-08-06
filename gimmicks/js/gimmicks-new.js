/* BLENCI LAB — newly added, original gimmicks (OriginKit-inspired, independently
   implemented). Each entry in window.NEW_GIMMICKS is keyed by the gimmick's
   `name` field in js/data/catalog.js and provides:
     render() -> outerHTML string for the <article class="demo"> block
                 (no tag-code badge -- catalog-loader.js injects that uniformly)
     init(articleEl) -> wires up the live behaviour once the article is in the DOM
   catalog-loader.js calls render()+init() for every isNew:true catalog entry. */
(() => {
  "use strict";

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE_POINTER = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function demoShell(id, tagName, heading, desc, bodyHtml) {
    return `<article class="demo" id="${id}">
      <p class="tag"><span class="tag-name">${tagName}</span></p>
      <h3>${heading}</h3>
      <p class="demo-desc">${desc}</p>
      ${bodyHtml}
    </article>`;
  }

  const NEW_GIMMICKS = {};

  /* ---------------- T — GRADIENT SWEEP TEXT ---------------- */
  NEW_GIMMICKS["GRADIENT SWEEP TEXT"] = {
    render: () => demoShell("n-gradient-sweep", "GRADIENT SWEEP TEXT",
      "見出しの上を光が一度だけ通り過ぎる",
      "画面に入ると、見出しの上をグラデーションのハイライトが左から右へ一度だけ流れます。",
      `<h4 class="gst-heading">QUIET LUXURY, LOUD DETAIL.</h4>`),
    init(articleEl) {
      const heading = articleEl.querySelector(".gst-heading");
      if (!heading) return;
      if (REDUCED) { heading.classList.add("run"); return; }
      new IntersectionObserver((entries, obs) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          heading.classList.add("run");
          obs.disconnect();
        });
      }, { threshold: 0.6 }).observe(heading);
    },
  };

  /* ---------------- I — DUOTONE HOVER REVEAL ---------------- */
  NEW_GIMMICKS["DUOTONE HOVER REVEAL"] = {
    render: () => demoShell("n-duotone-reveal", "DUOTONE HOVER REVEAL",
      "デュオトーンからフルカラーへ",
      "通常はブランドカラーの2色調で表示し、ホバー（タッチはタップ）するとフルカラー写真に切り替わります。",
      `<div class="dhr-box" id="n-dhr-box"><img class="dhr-img" src="../assets/img/look-05-0.webp" alt=""></div>`),
    init(articleEl) {
      const box = articleEl.querySelector("#n-dhr-box");
      if (!box) return;
      box.addEventListener("click", () => box.classList.toggle("active"));
    },
  };

  /* ---------------- G — BENTO GRID REVEAL ---------------- */
  NEW_GIMMICKS["BENTO GRID REVEAL"] = {
    render: () => {
      const looks = ["look-02-0", "look-06-1", "look-09-0", "look-12-2", "look-14-0", "look-16-1"];
      const spans = ["gc-wide gc-tall", "gc-tall", "", "", "gc-wide", ""];
      const items = looks.map((l, i) => `<div class="bento-item ${spans[i]}" style="background-image:url(../assets/img/${l}-thumb.webp)"></div>`).join("");
      return demoShell("n-bento-grid", "BENTO GRID REVEAL",
        "升目ごとに順番に現れるベントーグリッド",
        "大小不揃いのグリッドに作品を並べ、スクロールで画面に入るごとに升目単位で現れます。",
        `<div class="bento-grid" id="n-bento-grid">${items}</div>`);
    },
    init(articleEl) {
      const items = [...articleEl.querySelectorAll(".bento-item")];
      if (REDUCED) { items.forEach((el) => el.classList.add("in")); return; }
      items.forEach((el, i) => (el.style.transitionDelay = (i * 0.08) + "s"));
      const io = new IntersectionObserver((entries, obs) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("in"); obs.unobserve(e.target); } });
      }, { threshold: 0.2 });
      items.forEach((el) => io.observe(el));
    },
  };

  /* ---------------- C — EDGE GLOW CARD ---------------- */
  NEW_GIMMICKS["EDGE GLOW CARD"] = {
    render: () => demoShell("n-edge-glow", "EDGE GLOW CARD",
      "カーソルに合わせて縁だけが柔らかく光る",
      "カード内でカーソルを動かすと、その位置に応じてカードの外周だけが柔らかく発光します。",
      `<div class="egc-card" id="n-egc-card">
        <div class="egc-glow"></div>
        <div class="egc-inner"><p class="egc-title">EDGE GLOW</p><p class="egc-desc">カーソルをこのカードの上で動かしてみてください。</p></div>
      </div>`),
    init(articleEl) {
      const card = articleEl.querySelector("#n-egc-card");
      if (!card || !FINE_POINTER) return;
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
        card.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
      });
    },
  };

  /* ---------------- S — SCROLL SCRUB COUNTER ---------------- */
  NEW_GIMMICKS["SCROLL SCRUB COUNTER"] = {
    render: () => demoShell("n-scroll-scrub", "SCROLL SCRUB COUNTER",
      "スクロール位置そのものに連動する数字",
      "下の枠内をスクロールしてください。一度きりのカウントアップではなく、スクロール位置に数字が直接連動します。",
      `<div class="ssc-box" id="n-ssc-box">
        <div class="ssc-track"><div class="ssc-spacer"></div></div>
        <div class="ssc-readout"><span id="n-ssc-value">0</span><span class="ssc-unit">%</span></div>
      </div>`),
    init(articleEl) {
      const box = articleEl.querySelector("#n-ssc-box");
      const value = articleEl.querySelector("#n-ssc-value");
      if (!box || !value) return;
      function update() {
        const max = box.scrollHeight - box.clientHeight;
        const progress = max > 0 ? box.scrollTop / max : 0;
        value.textContent = Math.round(progress * 100);
      }
      box.addEventListener("scroll", update, { passive: true });
      update();
    },
  };

  /* ---------------- U — CURSOR ORBIT DOTS ---------------- */
  NEW_GIMMICKS["CURSOR ORBIT DOTS"] = {
    render: () => demoShell("n-cursor-orbit", "CURSOR ORBIT DOTS",
      "カーソルの周りを衛星のように回る粒",
      "下の枠にマウスを入れて動かしてみてください。小さな粒がカーソルを中心に緩やかに公転します。",
      `<div class="orbit-box local-cursor" id="n-orbit-box">
        <div class="orbit-dot" data-i="0"></div><div class="orbit-dot" data-i="1"></div>
        <div class="orbit-dot" data-i="2"></div><div class="orbit-dot" data-i="3"></div>
        <p class="orbit-hint">MOVE CURSOR HERE</p>
      </div>`),
    init(articleEl) {
      const box = articleEl.querySelector("#n-orbit-box");
      const dots = [...articleEl.querySelectorAll(".orbit-dot")];
      if (!box || !dots.length || !FINE_POINTER || REDUCED) return;
      let cx = 0, cy = 0, active = false, t = 0;
      box.addEventListener("mouseenter", () => (active = true));
      box.addEventListener("mouseleave", () => (active = false));
      box.addEventListener("mousemove", (e) => {
        const r = box.getBoundingClientRect();
        cx = e.clientX - r.left;
        cy = e.clientY - r.top;
      });
      function tick() {
        if (active) {
          t += 0.035;
          dots.forEach((d, i) => {
            const angle = t + (i / dots.length) * Math.PI * 2;
            const radius = 22;
            d.style.opacity = "1";
            d.style.transform = `translate(${cx + Math.cos(angle) * radius}px, ${cy + Math.sin(angle) * radius}px)`;
          });
        } else {
          dots.forEach((d) => (d.style.opacity = "0"));
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    },
  };

  /* ---------------- B — AURORA DRIFT ---------------- */
  NEW_GIMMICKS["AURORA DRIFT"] = {
    render: () => demoShell("n-aurora-drift", "AURORA DRIFT",
      "淡い光の帯が漂うアンビエント背景",
      "canvasを使わず、CSSのグラデーションとぼかしだけでオーロラのような光の帯を表現しています。",
      `<div class="aurora-box"><div class="aurora-band a1"></div><div class="aurora-band a2"></div><div class="aurora-band a3"></div></div>`),
    init() {},
  };

  /* ---------------- A — OUTLINE TRACE BUTTON ---------------- */
  NEW_GIMMICKS["OUTLINE TRACE BUTTON"] = {
    render: () => demoShell("n-outline-trace", "OUTLINE TRACE BUTTON",
      "ホバーで枠線がペンでなぞるように描かれる",
      "通常は枠線のないテキストボタンです。ホバーすると四辺の枠線が一筆書きのように現れます。",
      `<button type="button" class="otb-btn">
        <svg class="otb-outline" viewBox="0 0 220 58" preserveAspectRatio="none" aria-hidden="true"><rect x="1" y="1" width="218" height="56" rx="29"></rect></svg>
        <span>VIEW DETAILS</span>
      </button>`),
    init(articleEl) {
      const rect = articleEl.querySelector(".otb-outline rect");
      if (!rect || !rect.getTotalLength) return;
      const len = rect.getTotalLength();
      rect.style.strokeDasharray = String(len);
      rect.style.strokeDashoffset = String(len);
    },
  };

  /* ---------------- N — STACKED LABEL MENU ---------------- */
  NEW_GIMMICKS["STACKED LABEL MENU"] = {
    render: () => {
      const labels = ["ABOUT", "COLLECTION", "JOURNAL", "CONTACT"];
      const items = labels.map((l) => `<a href="#" class="slm-item" tabindex="0"><span class="slm-stack"><span class="slm-line">${l}</span><span class="slm-line">${l}</span></span></a>`).join("");
      return demoShell("n-stacked-label", "STACKED LABEL MENU",
        "ホバーでラベルが上下にスライドして切り替わる",
        "メニュー項目にホバー（またはフォーカス）すると、同じラベルが上下2段でスライドして切り替わります。",
        `<nav class="slm-menu">${items}</nav>`);
    },
    init() {},
  };

  /* ---------------- R — IRIS WIPE TRANSITION ---------------- */
  NEW_GIMMICKS["IRIS WIPE TRANSITION"] = {
    render: () => demoShell("n-iris-wipe", "IRIS WIPE TRANSITION",
      "円形の絞りが広がって次の状態を見せる",
      "下のボタンをクリックすると、クリックした位置を中心に円形の絞りが広がって画像が切り替わります。もう一度クリックで戻ります。",
      `<div class="iwt-box" id="n-iwt-box">
        <img class="iwt-a" src="../assets/img/look-04-0.webp" alt="">
        <img class="iwt-b" src="../assets/img/look-13-1.webp" alt="">
        <button type="button" class="iwt-trigger">CLICK TO REVEAL</button>
      </div>`),
    init(articleEl) {
      const box = articleEl.querySelector("#n-iwt-box");
      const b = articleEl.querySelector(".iwt-b");
      const btn = articleEl.querySelector(".iwt-trigger");
      if (!box || !b || !btn) return;
      btn.addEventListener("click", (e) => {
        const r = box.getBoundingClientRect();
        box.style.setProperty("--cx", (e.clientX - r.left) + "px");
        box.style.setProperty("--cy", (e.clientY - r.top) + "px");
        b.classList.toggle("open");
      });
    },
  };

  /* ---------------- P — MAGNET FIELD BUTTONS ---------------- */
  NEW_GIMMICKS["MAGNET FIELD BUTTONS"] = {
    render: () => {
      const labels = ["SHOP", "LOOKBOOK", "STORY", "VISIT"];
      const btns = labels.map((l) => `<button type="button" class="mfb-btn">${l}</button>`).join("");
      return demoShell("n-magnet-field", "MAGNET FIELD BUTTONS",
        "ボタン群がひとつの磁場のように反応する",
        "カーソルに近いボタンほど強く、遠いボタンほど弱く引き寄せられます。単体の吸着ではなく、グループ全体が連動します。",
        `<div class="mfb-group" id="n-mfb-group">${btns}</div>`);
    },
    init(articleEl) {
      const group = articleEl.querySelector("#n-mfb-group");
      const btns = [...articleEl.querySelectorAll(".mfb-btn")];
      if (!group || !btns.length || !FINE_POINTER || REDUCED) return;
      const RADIUS = 220, INTENSITY = 0.3;
      const movers = btns.map((b) => gsap.quickTo(b, "x", { duration: 0.5, ease: "power3" }));
      const moversY = btns.map((b) => gsap.quickTo(b, "y", { duration: 0.5, ease: "power3" }));
      group.addEventListener("mousemove", (e) => {
        btns.forEach((b, i) => {
          const r = b.getBoundingClientRect();
          const bx = r.left + r.width / 2, by = r.top + r.height / 2;
          const dx = e.clientX - bx, dy = e.clientY - by;
          const dist = Math.hypot(dx, dy);
          const strength = Math.max(0, 1 - dist / RADIUS) * INTENSITY;
          movers[i](dx * strength);
          moversY[i](dy * strength);
        });
      });
      group.addEventListener("mouseleave", () => {
        btns.forEach((b, i) => { movers[i](0); moversY[i](0); });
      });
    },
  };

  window.NEW_GIMMICKS = NEW_GIMMICKS;
})();
