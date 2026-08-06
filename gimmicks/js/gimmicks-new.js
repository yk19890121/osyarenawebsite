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

  /* ---------------- T — STICKER POP TEXT ---------------- */
  NEW_GIMMICKS["STICKER POP TEXT"] = {
    render: () => demoShell("n-sticker-pop", "STICKER POP TEXT",
      "見出しにステッカーのような影がポンと飛び出す",
      "画面に入ると、フラットだった見出しに硬いオフセット影がついて飛び出します。",
      `<h4 class="spt-heading">MADE TO STAND OUT.</h4>`),
    init(articleEl) {
      const heading = articleEl.querySelector(".spt-heading");
      if (!heading) return;
      if (REDUCED) { heading.classList.add("pop"); return; }
      new IntersectionObserver((entries, obs) => {
        entries.forEach((e) => { if (e.isIntersecting) { heading.classList.add("pop"); obs.disconnect(); } });
      }, { threshold: 0.6 }).observe(heading);
    },
  };

  /* ---------------- I — PARALLAX TILT IMAGE ---------------- */
  NEW_GIMMICKS["PARALLAX TILT IMAGE"] = {
    render: () => demoShell("n-tilt-image", "PARALLAX TILT IMAGE",
      "カーソルに合わせて画像が傾き、光沢が動く",
      "下の画像にカーソルを乗せて動かしてみてください。わずかに傾き、ガラスのような光沢が追従します。",
      `<div class="pti-box" id="n-pti-box">
        <img class="pti-img" src="../assets/img/look-07-0.webp" alt="">
        <div class="pti-glare"></div>
      </div>`),
    init(articleEl) {
      const box = articleEl.querySelector("#n-pti-box");
      if (!box || !FINE_POINTER) return;
      box.style.perspective = "800px";
      box.addEventListener("mousemove", (e) => {
        const r = box.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        box.style.setProperty("--rx", ((0.5 - py) * 10).toFixed(2) + "deg");
        box.style.setProperty("--ry", ((px - 0.5) * 10).toFixed(2) + "deg");
        box.style.setProperty("--mx", (px * 100) + "%");
        box.style.setProperty("--my", (py * 100) + "%");
      });
      box.addEventListener("mouseleave", () => {
        box.style.setProperty("--rx", "0deg");
        box.style.setProperty("--ry", "0deg");
      });
    },
  };

  /* ---------------- G — MASONRY HOVER SPREAD ---------------- */
  NEW_GIMMICKS["MASONRY HOVER SPREAD"] = {
    render: () => {
      const looks = ["look-03-0", "look-08-1", "look-11-0", "look-15-2", "look-17-0"];
      const items = looks.map((l) => `<div class="mhs-item" style="background-image:url(../assets/img/${l}-thumb.webp)"></div>`).join("");
      return demoShell("n-masonry-spread", "MASONRY HOVER SPREAD",
        "ホバーした画像だけが広がる横並びギャラリー",
        "下の画像のどれかにカーソルを乗せてみてください。その1枚だけが広がり、両隣が押しやられます。",
        `<div class="mhs-row" id="n-mhs-row">${items}</div>`);
    },
    init(articleEl) {
      const row = articleEl.querySelector("#n-mhs-row");
      const items = [...articleEl.querySelectorAll(".mhs-item")];
      if (!row || !FINE_POINTER) return;
      items.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          items.forEach((other) => (other.style.flex = other === el ? "3" : "0.6"));
        });
      });
      row.addEventListener("mouseleave", () => items.forEach((el) => (el.style.flex = "1")));
    },
  };

  /* ---------------- C — CARD STACK PEEK ---------------- */
  NEW_GIMMICKS["CARD STACK PEEK"] = {
    render: () => demoShell("n-card-stack", "CARD STACK PEEK",
      "重なったカードをホバーでずらして下を覗く",
      "カードの束にカーソルを乗せる（タッチはタップ）と、一番上がずれて下のカードが覗きます。",
      `<div class="csp-stack" id="n-csp-stack">
        <div class="csp-card csp-card-3">LOOK 03</div>
        <div class="csp-card csp-card-2">LOOK 02</div>
        <div class="csp-card csp-card-1">LOOK 01</div>
      </div>`),
    init(articleEl) {
      const stack = articleEl.querySelector("#n-csp-stack");
      if (!stack) return;
      stack.addEventListener("click", () => stack.classList.toggle("open"));
    },
  };

  /* ---------------- S — SCROLL PIN LABEL ---------------- */
  NEW_GIMMICKS["SCROLL PIN LABEL"] = {
    render: () => {
      const names = ["LOOK 01 — OUTERWEAR", "LOOK 02 — KNITWEAR", "LOOK 03 — DENIM", "LOOK 04 — ACCESSORIES"];
      const items = names.map((n) => `<div class="spl-item" data-name="${n}"><span>${n}</span></div>`).join("");
      return demoShell("n-scroll-pin-label", "SCROLL PIN LABEL",
        "スクロール中の項目名がラベルに表示され続ける",
        "下の枠内をスクロールしてください。上のラベルが、いま見えている項目の名前に切り替わります。",
        `<div class="spl-box" id="n-spl-box">
          <div class="spl-label" id="n-spl-label">${names[0]}</div>
          <div class="spl-items">${items}</div>
        </div>`);
    },
    init(articleEl) {
      const box = articleEl.querySelector("#n-spl-box");
      const label = articleEl.querySelector("#n-spl-label");
      const items = [...articleEl.querySelectorAll(".spl-item")];
      if (!box || !label || !items.length) return;
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting && e.intersectionRatio > 0.5) label.textContent = e.target.dataset.name; });
      }, { root: box, threshold: [0.5] });
      items.forEach((el) => io.observe(el));
    },
  };

  /* ---------------- U — CURSOR TRAIL RIBBON ---------------- */
  NEW_GIMMICKS["CURSOR TRAIL RIBBON"] = {
    render: () => demoShell("n-trail-ribbon", "CURSOR TRAIL RIBBON",
      "カーソルの軌跡が絹のようなリボンになって尾を引く",
      "下の枠にマウスを入れて動かしてみてください。軌跡が滑らかなリボン状の帯として残ります。",
      `<div class="trb-box local-cursor" id="n-trb-box"><canvas id="n-trb-canvas"></canvas><p class="trb-hint">MOVE CURSOR HERE</p></div>`),
    init(articleEl) {
      const box = articleEl.querySelector("#n-trb-box");
      const canvas = articleEl.querySelector("#n-trb-canvas");
      if (!box || !canvas || !FINE_POINTER || REDUCED) return;
      const ctx = canvas.getContext("2d");
      let points = [];
      function resize() { canvas.width = box.clientWidth; canvas.height = box.clientHeight; }
      resize();
      window.addEventListener("resize", resize);
      box.addEventListener("mousemove", (e) => {
        const r = box.getBoundingClientRect();
        points.push({ x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() });
        if (points.length > 18) points.shift();
      });
      function tick() {
        const now = performance.now();
        points = points.filter((p) => now - p.t < 500);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(points[0].x, points[0].y);
          for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y);
          ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--accent") || "#ff7847";
          ctx.lineCap = "round";
          ctx.lineJoin = "round";
          ctx.lineWidth = 10;
          ctx.globalAlpha = 0.55;
          ctx.stroke();
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    },
  };

  /* ---------------- B — NOISE GRAIN DRIFT ---------------- */
  NEW_GIMMICKS["NOISE GRAIN DRIFT"] = {
    render: () => demoShell("n-noise-drift", "NOISE GRAIN DRIFT",
      "細かい粒状ノイズがゆっくり流れ続ける",
      "静止したノイズ模様ではなく、常にわずかに流れ続けるフィルム質感の背景です。",
      `<div class="ngd-box" id="n-ngd-box"></div>`),
    init(articleEl) {
      const box = articleEl.querySelector("#n-ngd-box");
      if (!box) return;
      const tile = document.createElement("canvas");
      tile.width = 96; tile.height = 96;
      const tctx = tile.getContext("2d");
      const imgData = tctx.createImageData(96, 96);
      for (let i = 0; i < imgData.data.length; i += 4) {
        const v = Math.random() * 255;
        imgData.data[i] = imgData.data[i + 1] = imgData.data[i + 2] = v;
        imgData.data[i + 3] = 255;
      }
      tctx.putImageData(imgData, 0, 0);
      box.style.backgroundImage = `url(${tile.toDataURL()})`;
    },
  };

  /* ---------------- A — SPLIT FILL BUTTON ---------------- */
  NEW_GIMMICKS["SPLIT FILL BUTTON"] = {
    render: () => demoShell("n-split-fill", "SPLIT FILL BUTTON",
      "右下から斜めの塗りが広がって埋まる",
      "下のボタンにホバーすると、右下の角から斜めに切れた塗りがボタン全体へ広がります。",
      `<button type="button" class="sfb-btn"><span class="sfb-fill"></span><span class="sfb-label">GET STARTED</span></button>`),
    init() {},
  };

  /* ---------------- N — UNDERLINE FOLLOW NAV ---------------- */
  NEW_GIMMICKS["UNDERLINE FOLLOW NAV"] = {
    render: () => {
      const labels = ["HOME", "COLLECTION", "JOURNAL", "STORES"];
      const items = labels.map((l, i) => `<a href="#" class="ufn-link${i === 0 ? " active" : ""}">${l}</a>`).join("");
      return demoShell("n-underline-nav", "UNDERLINE FOLLOW NAV",
        "共有の下線がホバーした項目へ滑らかに移動する",
        "ナビ項目にホバーしてみてください。下線が個別にではなく、1本のインジケーターとして滑らかに移動します。",
        `<nav class="ufn-nav" id="n-ufn-nav">${items}<span class="ufn-indicator" id="n-ufn-indicator"></span></nav>`);
    },
    init(articleEl) {
      const nav = articleEl.querySelector("#n-ufn-nav");
      const indicator = articleEl.querySelector("#n-ufn-indicator");
      const links = [...articleEl.querySelectorAll(".ufn-link")];
      if (!nav || !indicator || !links.length) return;
      function moveTo(el) {
        indicator.style.left = el.offsetLeft + "px";
        indicator.style.width = el.offsetWidth + "px";
      }
      requestAnimationFrame(() => moveTo(links[0]));
      links.forEach((link) => link.addEventListener("mouseenter", () => moveTo(link)));
      nav.addEventListener("mouseleave", () => moveTo(nav.querySelector(".ufn-link.active") || links[0]));
    },
  };

  /* ---------------- R — SHUTTER SLICE TRANSITION ---------------- */
  NEW_GIMMICKS["SHUTTER SLICE TRANSITION"] = {
    render: () => {
      const slices = Array.from({ length: 6 }, () => `<span></span>`).join("");
      return demoShell("n-shutter-slice", "SHUTTER SLICE TRANSITION",
        "縦のスライスが交互に開いて次を見せる",
        "下のボタンをクリックすると、縦のスライスが交互に上下へ開いて画像を切り替えます。",
        `<div class="sst-box" id="n-sst-box">
          <img src="../assets/img/look-16-0.webp" alt="">
          <div class="sst-slices" id="n-sst-slices">${slices}</div>
          <button type="button" class="sst-trigger">OPEN SHUTTER</button>
        </div>`);
    },
    init(articleEl) {
      const slicesEl = articleEl.querySelector("#n-sst-slices");
      const btn = articleEl.querySelector(".sst-trigger");
      if (!slicesEl || !btn) return;
      const spans = [...slicesEl.children];
      spans.forEach((s, i) => {
        s.style.transitionDelay = (i * 0.05) + "s";
        s.classList.add(i % 2 === 0 ? "sst-up" : "sst-down");
      });
      btn.addEventListener("click", () => slicesEl.classList.toggle("open"));
    },
  };

  /* ---------------- P — SPRING DRAG CARD ---------------- */
  NEW_GIMMICKS["SPRING DRAG CARD"] = {
    render: () => demoShell("n-spring-drag", "SPRING DRAG CARD",
      "ドラッグして離すとバネのように弾んで戻る",
      "下のカードを好きな方向にドラッグして離してみてください。バネのように弾んで元の位置に戻ります。",
      `<div class="sdc-box"><div class="sdc-card" id="n-sdc-card">DRAG ME</div></div>`),
    init(articleEl) {
      const card = articleEl.querySelector("#n-sdc-card");
      if (!card || typeof Draggable === "undefined" || REDUCED) return;
      Draggable.create(card, {
        type: "x,y",
        onDragEnd() {
          gsap.to(this.target, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.4)" });
        },
      });
    },
  };

  /* ---------------- T — WORD SWAP CYCLER ---------------- */
  NEW_GIMMICKS["WORD SWAP CYCLER"] = {
    render: () => demoShell("n-word-swap", "WORD SWAP CYCLER",
      "文中の1単語だけが一定間隔で入れ替わる",
      "見出しの一部分だけが数秒おきに別の単語へクロスフェードで切り替わり続けます。",
      `<p class="wsc-line">WE MAKE <span class="wsc-cycler" id="n-wsc-cycler">CLOTHES</span></p>`),
    init(articleEl) {
      const el = articleEl.querySelector("#n-wsc-cycler");
      if (!el || REDUCED) return;
      const words = ["CLOTHES", "STORIES", "STATEMENTS", "ARCHIVES"];
      let i = 0;
      setInterval(() => {
        el.classList.add("out");
        setTimeout(() => {
          i = (i + 1) % words.length;
          el.textContent = words[i];
          el.classList.remove("out");
        }, 300);
      }, 1800);
    },
  };

  /* ---------------- T — HIGHLIGHT MARKER SWEEP ---------------- */
  NEW_GIMMICKS["HIGHLIGHT MARKER SWEEP"] = {
    render: () => demoShell("n-highlight-marker", "HIGHLIGHT MARKER SWEEP",
      "蛍光マーカーで線を引くように背景色が伸びる",
      "画面に入ると、蛍光マーカーで下線を引くように色帯が左から右へ伸びます。",
      `<h4 class="hms-heading"><span class="hms-mark">DESIGNED TO LAST</span></h4>`),
    init(articleEl) {
      const mark = articleEl.querySelector(".hms-mark");
      if (!mark) return;
      if (REDUCED) { mark.classList.add("run"); return; }
      new IntersectionObserver((entries, obs) => {
        entries.forEach((e) => { if (e.isIntersecting) { mark.classList.add("run"); obs.disconnect(); } });
      }, { threshold: 0.6 }).observe(mark);
    },
  };

  /* ---------------- I — FOCUS BLUR REVEAL ---------------- */
  NEW_GIMMICKS["FOCUS BLUR REVEAL"] = {
    render: () => demoShell("n-focus-blur", "FOCUS BLUR REVEAL",
      "ぼやけた画像がピントを合わせて現れる",
      "画面に入ると、最初はぼやけていた画像が滑らかにピントを合わせて鮮明になります。",
      `<div class="fbr-box"><img class="fbr-img" src="../assets/img/look-09-0.webp" alt=""></div>`),
    init(articleEl) {
      const img = articleEl.querySelector(".fbr-img");
      if (!img) return;
      if (REDUCED) { img.classList.add("in"); return; }
      new IntersectionObserver((entries, obs) => {
        entries.forEach((e) => { if (e.isIntersecting) { img.classList.add("in"); obs.disconnect(); } });
      }, { threshold: 0.4 }).observe(img);
    },
  };

  /* ---------------- I — COLOR WASH REVEAL ---------------- */
  NEW_GIMMICKS["COLOR WASH REVEAL"] = {
    render: () => demoShell("n-color-wash", "COLOR WASH REVEAL",
      "単色の塗りが消えて写真が現れる",
      "画面に入ると、画像を覆う単色の塗りが左から右へ消えていき、下の写真が現れます。",
      `<div class="cwr-box"><img class="cwr-img" src="../assets/img/look-13-0.webp" alt=""><div class="cwr-wash"></div></div>`),
    init(articleEl) {
      const wash = articleEl.querySelector(".cwr-wash");
      if (!wash) return;
      if (REDUCED) { wash.classList.add("done"); return; }
      new IntersectionObserver((entries, obs) => {
        entries.forEach((e) => { if (e.isIntersecting) { setTimeout(() => wash.classList.add("done"), 200); obs.disconnect(); } });
      }, { threshold: 0.4 }).observe(wash);
    },
  };

  /* ---------------- G — INFINITE LOOP CAROUSEL ---------------- */
  NEW_GIMMICKS["INFINITE LOOP CAROUSEL"] = {
    render: () => {
      const looks = ["look-01-0", "look-04-1", "look-07-0", "look-10-2", "look-14-1", "look-17-0"];
      const set = looks.map((l) => `<img src="../assets/img/${l}-thumb.webp" alt="">`).join("");
      return demoShell("n-infinite-carousel", "INFINITE LOOP CAROUSEL",
        "画像列が途切れなく流れ続ける",
        "画像列が継ぎ目なく横へ流れ続けます。ホバーすると流れが止まります。",
        `<div class="ilc-viewport"><div class="ilc-track">${set}${set}</div></div>`);
    },
    init() {},
  };

  /* ---------------- G — GRID TO FULLSCREEN MORPH ---------------- */
  NEW_GIMMICKS["GRID TO FULLSCREEN MORPH"] = {
    render: () => {
      const looks = ["look-02-1", "look-05-0", "look-08-2", "look-11-0"];
      const items = looks.map((l, i) => `<img class="gfm-item" src="../assets/img/${l}-thumb.webp" alt="" data-i="${i}">`).join("");
      return demoShell("n-grid-morph", "GRID TO FULLSCREEN MORPH",
        "同じ要素のまま全画面へ拡大する",
        "グリッドの画像をクリックすると、複製ではなく同じ要素のまま全画面へ拡大します。もう一度クリックで戻ります。",
        `<div class="gfm-grid" id="n-gfm-grid">${items}</div><div class="gfm-overlay" id="n-gfm-overlay"></div>`);
    },
    init(articleEl) {
      const grid = articleEl.querySelector("#n-gfm-grid");
      const overlay = articleEl.querySelector("#n-gfm-overlay");
      if (!grid || !overlay || typeof Flip === "undefined") return;
      grid.querySelectorAll(".gfm-item").forEach((img) => {
        img.addEventListener("click", () => {
          if (img.classList.contains("is-full")) {
            const state = Flip.getState(img);
            grid.appendChild(img);
            img.classList.remove("is-full");
            overlay.classList.remove("open");
            Flip.from(state, { duration: REDUCED ? 0 : 0.6, ease: "power3.inOut" });
          } else {
            const state = Flip.getState(img);
            overlay.appendChild(img);
            img.classList.add("is-full");
            overlay.classList.add("open");
            Flip.from(state, { duration: REDUCED ? 0 : 0.6, ease: "power3.inOut" });
          }
        });
      });
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) overlay.querySelector(".gfm-item.is-full")?.dispatchEvent(new Event("click"));
      });
    },
  };

  /* ---------------- C — PROGRESS RING CARD ---------------- */
  NEW_GIMMICKS["PROGRESS RING CARD"] = {
    render: () => demoShell("n-progress-ring", "PROGRESS RING CARD",
      "円形プログレスリングが目標値まで伸びる",
      "画面に入ると、カードを囲む円形のリングが0から72%まで伸びます。",
      `<div class="prc-card">
        <svg class="prc-ring" viewBox="0 0 100 100" aria-hidden="true">
          <circle class="prc-track" cx="50" cy="50" r="45"></circle>
          <circle class="prc-fill" id="n-prc-fill" cx="50" cy="50" r="45"></circle>
        </svg>
        <div class="prc-inner"><p>LIMITED STOCK</p><span>72%</span></div>
      </div>`),
    init(articleEl) {
      const fill = articleEl.querySelector("#n-prc-fill");
      if (!fill) return;
      const circumference = 2 * Math.PI * 45;
      fill.style.strokeDasharray = String(circumference);
      fill.style.strokeDashoffset = String(circumference);
      function run() { fill.style.strokeDashoffset = String(circumference * (1 - 0.72)); }
      if (REDUCED) { run(); return; }
      new IntersectionObserver((entries, obs) => {
        entries.forEach((e) => { if (e.isIntersecting) { run(); obs.disconnect(); } });
      }, { threshold: 0.4 }).observe(fill);
    },
  };

  /* ---------------- C — CARD CONTENT SLIDE SWAP ---------------- */
  NEW_GIMMICKS["CARD CONTENT SLIDE SWAP"] = {
    render: () => demoShell("n-content-swap", "CARD CONTENT SLIDE SWAP",
      "ホバーで内容が上下に入れ替わる",
      "カードにホバーすると、表示中の内容が上へ抜け、別の内容が下から入れ替わりに現れます。",
      `<div class="css-card">
        <div class="css-face css-face-a"><p>SPRING 2026</p><span>VIEW COLLECTION →</span></div>
        <div class="css-face css-face-b"><p>NEW ARRIVALS WEEKLY</p><span>SHOP NOW →</span></div>
      </div>`),
    init() {},
  };

  /* ---------------- S — SCROLL ROTATE REVEAL ---------------- */
  NEW_GIMMICKS["SCROLL ROTATE REVEAL"] = {
    render: () => demoShell("n-scroll-rotate", "SCROLL ROTATE REVEAL",
      "寝た状態から起き上がるように現れる",
      "見出しが手前に倒れた状態から、画面に入ると起き上がるように回転しながら現れます。",
      `<div class="srr-wrap"><h4 class="srr-heading">TAILORED PRECISION</h4></div>`),
    init(articleEl) {
      const heading = articleEl.querySelector(".srr-heading");
      if (!heading) return;
      if (REDUCED) { heading.classList.add("in"); return; }
      new IntersectionObserver((entries, obs) => {
        entries.forEach((e) => { if (e.isIntersecting) { heading.classList.add("in"); obs.disconnect(); } });
      }, { threshold: 0.5 }).observe(heading);
    },
  };

  /* ---------------- S — SCROLL LINE DRAW PROGRESS ---------------- */
  NEW_GIMMICKS["SCROLL LINE DRAW PROGRESS"] = {
    render: () => demoShell("n-scroll-line-draw", "SCROLL LINE DRAW PROGRESS",
      "スクロール量に応じて曲線が描かれる",
      "このセクションをスクロールする量に応じて、下の曲線が少しずつ描かれていきます。",
      `<div class="sld-box"><svg class="sld-svg" viewBox="0 0 300 80" aria-hidden="true"><path id="n-sld-path" d="M10,40 C80,10 120,70 150,40 S250,10 290,40" fill="none"></path></svg></div>`),
    init(articleEl) {
      const path = articleEl.querySelector("#n-sld-path");
      const box = articleEl.querySelector(".sld-box");
      if (!path || !box) return;
      const len = path.getTotalLength();
      path.style.strokeDasharray = String(len);
      if (REDUCED) { path.style.strokeDashoffset = "0"; return; }
      path.style.strokeDashoffset = String(len);
      function update() {
        const r = box.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight + r.height)));
        path.style.strokeDashoffset = String(len * (1 - progress));
      }
      window.addEventListener("scroll", update, { passive: true });
      update();
    },
  };

  /* ---------------- B — FLOATING SHAPES DRIFT ---------------- */
  NEW_GIMMICKS["FLOATING SHAPES DRIFT"] = {
    render: () => demoShell("n-floating-shapes", "FLOATING SHAPES DRIFT",
      "輪郭図形がゆっくり漂う背景",
      "円や三角形の輪郭図形が、それぞれ違う速さでゆっくり漂い回転し続けます。",
      `<div class="fsd-box">
        <span class="fsd-shape fsd-1"></span>
        <span class="fsd-shape fsd-2 fsd-triangle"></span>
        <span class="fsd-shape fsd-3"></span>
        <span class="fsd-shape fsd-4 fsd-triangle"></span>
      </div>`),
    init() {},
  };

  /* ---------------- B — SPOTLIGHT SCROLL FOLLOW ---------------- */
  NEW_GIMMICKS["SPOTLIGHT SCROLL FOLLOW"] = {
    render: () => demoShell("n-spotlight-scroll", "SPOTLIGHT SCROLL FOLLOW",
      "光の玉がスクロール位置に追従する",
      "下の枠内をスクロールしてください。柔らかい光の玉がスクロール位置に合わせて縦方向に移動します。",
      `<div class="ssf-box" id="n-ssf-box"><div class="ssf-spot" id="n-ssf-spot"></div><div class="ssf-track"></div></div>`),
    init(articleEl) {
      const box = articleEl.querySelector("#n-ssf-box");
      const spot = articleEl.querySelector("#n-ssf-spot");
      if (!box || !spot) return;
      function update() {
        const max = box.scrollHeight - box.clientHeight;
        const progress = max > 0 ? box.scrollTop / max : 0;
        spot.style.transform = `translateY(${progress * (box.clientHeight - 60)}px)`;
      }
      box.addEventListener("scroll", update, { passive: true });
      update();
    },
  };

  /* ---------------- U — CURSOR LABEL FOLLOW ---------------- */
  NEW_GIMMICKS["CURSOR LABEL FOLLOW"] = {
    render: () => demoShell("n-cursor-label", "CURSOR LABEL FOLLOW",
      "エリア内でラベルがカーソルに追従する",
      "下の枠にカーソルを乗せて動かしてみてください。「VIEW」というラベルがカーソルに追従します。",
      `<div class="clf-box local-cursor" id="n-clf-box"><div class="clf-label" id="n-clf-label">VIEW</div><p>HOVER THIS AREA</p></div>`),
    init(articleEl) {
      const box = articleEl.querySelector("#n-clf-box");
      const label = articleEl.querySelector("#n-clf-label");
      if (!box || !label || !FINE_POINTER) return;
      box.addEventListener("mousemove", (e) => {
        const r = box.getBoundingClientRect();
        label.style.left = (e.clientX - r.left) + "px";
        label.style.top = (e.clientY - r.top) + "px";
      });
    },
  };

  /* ---------------- A — ICON SWAP BUTTON ---------------- */
  NEW_GIMMICKS["ICON SWAP BUTTON"] = {
    render: () => demoShell("n-icon-swap", "ICON SWAP BUTTON",
      "ホバーでアイコンが回転しながら入れ替わる",
      "ボタンにホバーすると、矢印アイコンが回転しながらチェックマークに入れ替わります。",
      `<button type="button" class="isb-btn"><span class="isb-icons"><span class="isb-icon isb-icon-a">→</span><span class="isb-icon isb-icon-b">✓</span></span><span>ADD TO BAG</span></button>`),
    init() {},
  };

  /* ---------------- A — PRESS DEPTH BUTTON ---------------- */
  NEW_GIMMICKS["PRESS DEPTH BUTTON"] = {
    render: () => demoShell("n-press-depth", "PRESS DEPTH BUTTON",
      "押すと沈み込む物理ボタン",
      "下のボタンを押している間、影が縮んでボタンが沈み込みます。",
      `<button type="button" class="pdb-btn">PLACE ORDER</button>`),
    init() {},
  };

  /* ---------------- N — MEGA MENU DROP REVEAL ---------------- */
  NEW_GIMMICKS["MEGA MENU DROP REVEAL"] = {
    render: () => demoShell("n-mega-menu", "MEGA MENU DROP REVEAL",
      "ホバーでリンク一覧のパネルが下へ展開する",
      "「SHOP」にホバーしてみてください。リンク一覧を含むパネルが下方向に展開します。",
      `<div class="mmd-wrap">
        <button type="button" class="mmd-trigger">SHOP ▾</button>
        <div class="mmd-panel"><a href="#">Outerwear</a><a href="#">Knitwear</a><a href="#">Accessories</a><a href="#">Footwear</a></div>
      </div>`),
    init() {},
  };

  /* ---------------- N — BREADCRUMB TRAIL FADE ---------------- */
  NEW_GIMMICKS["BREADCRUMB TRAIL FADE"] = {
    render: () => demoShell("n-breadcrumb-fade", "BREADCRUMB TRAIL FADE",
      "パンくずの各項目が順番に現れる",
      "画面に入ると、パンくずリストの各項目が左から順番にフェード＋スライドインします。",
      `<nav class="btf-crumbs" id="n-btf-crumbs"><a href="#">HOME</a><span>/</span><a href="#">WOMEN</a><span>/</span><a href="#">OUTERWEAR</a><span>/</span><span class="current">WOOL COAT</span></nav>`),
    init(articleEl) {
      const crumbs = articleEl.querySelector("#n-btf-crumbs");
      if (!crumbs) return;
      const parts = [...crumbs.children];
      if (REDUCED) { parts.forEach((p) => p.classList.add("in")); return; }
      parts.forEach((p, i) => (p.style.transitionDelay = (i * 0.08) + "s"));
      new IntersectionObserver((entries, obs) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          parts.forEach((p) => p.classList.add("in"));
          obs.disconnect();
        });
      }, { threshold: 0.6 }).observe(crumbs);
    },
  };

  /* ---------------- R — CROSSFADE ZOOM TRANSITION ---------------- */
  NEW_GIMMICKS["CROSSFADE ZOOM TRANSITION"] = {
    render: () => demoShell("n-crossfade-zoom", "CROSSFADE ZOOM TRANSITION",
      "次の状態がズームしながらクロスフェードする",
      "下のボタンをクリックすると、次の画像がわずかに拡大した状態からクロスフェードで重なります。",
      `<div class="czt-box" id="n-czt-box">
        <img class="czt-a" src="../assets/img/look-06-0.webp" alt="">
        <img class="czt-b" src="../assets/img/look-15-1.webp" alt="">
        <button type="button" class="czt-trigger">NEXT LOOK</button>
      </div>`),
    init(articleEl) {
      const b = articleEl.querySelector(".czt-b");
      const btn = articleEl.querySelector(".czt-trigger");
      if (!b || !btn) return;
      btn.addEventListener("click", () => b.classList.toggle("show"));
    },
  };

  /* ---------------- P — BOUNCY LIST REORDER ---------------- */
  NEW_GIMMICKS["BOUNCY LIST REORDER"] = {
    render: () => {
      const names = ["LOOK 01", "LOOK 02", "LOOK 03", "LOOK 04"];
      const items = names.map((n) => `<li class="blr-item">${n}</li>`).join("");
      return demoShell("n-bouncy-reorder", "BOUNCY LIST REORDER",
        "ドラッグすると他の項目がバネで席を譲る",
        "項目をドラッグして別の位置へ動かしてみてください。押しのけられた項目がバネのように弾んで新しい位置へ移動します。",
        `<ul class="blr-list" id="n-blr-list">${items}</ul>`);
    },
    init(articleEl) {
      const list = articleEl.querySelector("#n-blr-list");
      if (!list || typeof Draggable === "undefined" || REDUCED) return;
      const ROW = 50;
      let order = [...list.children];
      order.forEach((el, i) => gsap.set(el, { y: i * ROW }));
      order.forEach((el) => {
        Draggable.create(el, {
          type: "y",
          bounds: { minY: 0, maxY: ROW * (order.length - 1) },
          onDrag() {
            const fromIndex = order.indexOf(el);
            const toIndex = Math.min(order.length - 1, Math.max(0, Math.round(this.y / ROW)));
            if (toIndex !== fromIndex) {
              order.splice(fromIndex, 1);
              order.splice(toIndex, 0, el);
              order.forEach((item) => { if (item !== el) gsap.to(item, { y: order.indexOf(item) * ROW, duration: 0.4, ease: "elastic.out(1, 0.6)" }); });
            }
          },
          onDragEnd() {
            gsap.to(el, { y: order.indexOf(el) * ROW, duration: 0.5, ease: "elastic.out(1, 0.5)" });
          },
        });
      });
    },
  };

  window.NEW_GIMMICKS = NEW_GIMMICKS;
})();
