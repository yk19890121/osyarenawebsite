/* BLENCI LAB — 30 gimmicks, one function per gimmick. */
(() => {
  "use strict";

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE_POINTER = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const pad = (n) => String(n).padStart(2, "0");
  const whenReady = (fn) => {
    if (document.readyState === "complete") fn();
    else window.addEventListener("load", fn, { once: true });
  };

  gsap.registerPlugin(ScrollTrigger, Draggable, Flip, Observer);

  /* ---------- shared: flash a section when jumped to (gimmick 05) ---------- */
  function flashElement(el) {
    if (!el) return;
    el.classList.remove("flash-pulse");
    void el.offsetWidth; // restart animation
    el.classList.add("flash-pulse");
    setTimeout(() => el.classList.remove("flash-pulse"), 900);
  }

  /* ============================ 01 — scroll progress bar ============================ */
  function initScrollProgress() {
    const fill = document.getElementById("scroll-progress-fill");
    function update() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      fill.style.width = (max > 0 ? (doc.scrollTop / max) * 100 : 0) + "%";
    }
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  /* ============================ 02 — side dot nav (+ 05 flash) ============================ */
  function initDotNav() {
    const dots = [...document.querySelectorAll("#dot-nav .dot")];
    const targets = dots.map((d) => document.querySelector(d.getAttribute("href")));

    function onScroll() {
      const scrollPos = window.scrollY + window.innerHeight * 0.4;
      let current = targets[0];
      targets.forEach((t) => { if (t && t.offsetTop <= scrollPos) current = t; });
      dots.forEach((d, i) => d.classList.toggle("active", targets[i] === current));
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    dots.forEach((d, i) => {
      d.addEventListener("click", (e) => {
        e.preventDefault();
        const target = targets[i];
        target.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" });
        setTimeout(() => flashElement(target), REDUCED ? 0 : 400);
      });
    });
  }

  /* ============================ 04 — scroll velocity skew ============================ */
  function initSkew() {
    const strip = document.getElementById("skew-strip");
    if (!strip || REDUCED) return;
    let lastY = window.scrollY;
    let current = 0;
    let target = 0;

    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      target = gsap.utils.clamp(-16, 16, (y - lastY) * 0.8);
      lastY = y;
    }, { passive: true });

    gsap.ticker.add(() => {
      current += (target - current) * 0.15;
      target += (0 - target) * 0.08; // decay
      if (Math.abs(current) > 0.02) gsap.set(strip, { skewX: current });
    });
  }

  /* ============================ 06 — spotlight cursor ============================ */
  function initSpotlight() {
    const box = document.getElementById("spotlight-box");
    if (!box) return;
    const setPos = (x, y) => {
      const r = box.getBoundingClientRect();
      box.style.setProperty("--mx", x - r.left + "px");
      box.style.setProperty("--my", y - r.top + "px");
    };
    box.addEventListener("mousemove", (e) => setPos(e.clientX, e.clientY));
    box.addEventListener("mouseleave", () => { box.style.setProperty("--mx", "50%"); box.style.setProperty("--my", "50%"); });
    box.addEventListener("touchmove", (e) => { const t = e.touches[0]; if (t) setPos(t.clientX, t.clientY); }, { passive: true });
  }

  /* ============================ 07 — mouse parallax layers ============================ */
  function initParallax() {
    const scene = document.getElementById("parallax-scene");
    if (!scene || !FINE_POINTER) return;
    const setters = [...scene.querySelectorAll(".pl-layer")].map((l) => ({
      x: gsap.quickTo(l, "x", { duration: 0.6, ease: "power3" }),
      y: gsap.quickTo(l, "y", { duration: 0.6, ease: "power3" }),
      depth: parseFloat(l.dataset.depth) || 20,
    }));
    scene.addEventListener("mousemove", (e) => {
      const r = scene.getBoundingClientRect();
      const relX = (e.clientX - r.left) / r.width - 0.5;
      const relY = (e.clientY - r.top) / r.height - 0.5;
      setters.forEach((s) => { s.x(relX * s.depth); s.y(relY * s.depth); });
    });
    scene.addEventListener("mouseleave", () => setters.forEach((s) => { s.x(0); s.y(0); }));
  }

  /* ============================ 08/09 — 3D tilt card (shine is pure CSS) ============================ */
  function initTilt() {
    if (!FINE_POINTER) return;
    document.querySelectorAll(".tilt-card").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, { rotateY: px * 18, rotateX: -py * 18, duration: 0.5, ease: "power3", overwrite: "auto" });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.5, ease: "power3", overwrite: "auto" });
      });
    });
  }

  /* ============================ 10 — drag-scroll gallery ============================ */
  function buildDragGallery() {
    const track = document.getElementById("drag-track");
    if (!track) return;
    track.innerHTML = LOOKS.map((look, i) =>
      `<img src="../assets/img/${look.variants[0].thumb}" alt="LOOK ${pad(i + 1)}">`
    ).join("");

    whenReady(() => {
      const gallery = track.parentElement;
      const minX = Math.min(0, gallery.clientWidth - track.scrollWidth);
      Draggable.create(track, {
        type: "x",
        bounds: { minX, maxX: 0 },
        edgeResistance: 0.7,
        inertia: false,
        cursor: "grab",
        activeCursor: "grabbing",
      });
    });
  }

  /* ============================ 11 — before/after slider ============================ */
  function initCompare() {
    const wrap = document.getElementById("compare");
    const handle = document.getElementById("compare-handle");
    const beforeWrap = document.getElementById("compare-before-wrap");
    if (!wrap) return;
    const beforeImg = beforeWrap.querySelector("img");

    function setPos(clientX) {
      const r = wrap.getBoundingClientRect();
      const pct = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
      beforeWrap.style.width = pct * 100 + "%";
      handle.style.left = pct * 100 + "%";
      beforeImg.style.width = r.width + "px";
    }
    function syncWidth() {
      const r = wrap.getBoundingClientRect();
      beforeImg.style.width = r.width + "px";
    }
    let dragging = false;
    handle.addEventListener("pointerdown", (e) => { dragging = true; handle.setPointerCapture(e.pointerId); });
    window.addEventListener("pointermove", (e) => { if (dragging) setPos(e.clientX); });
    window.addEventListener("pointerup", () => (dragging = false));
    wrap.addEventListener("click", (e) => setPos(e.clientX));
    window.addEventListener("resize", syncWidth);
    syncWidth();
  }

  /* ============================ 12 — text scramble ============================ */
  function initScramble() {
    const el = document.querySelector(".scramble-target");
    if (!el) return;
    const finalText = el.dataset.text || el.textContent;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#%&+=*";
    let started = false;

    function run() {
      if (started) return;
      started = true;
      const totalFrames = 26;
      let frame = 0;
      const timer = setInterval(() => {
        frame++;
        let out = "";
        for (let i = 0; i < finalText.length; i++) {
          if (finalText[i] === " ") { out += " "; continue; }
          const revealAt = (i / finalText.length) * totalFrames + totalFrames * 0.35;
          out += frame >= revealAt ? finalText[i] : chars[(Math.random() * chars.length) | 0];
        }
        el.textContent = out;
        if (frame >= totalFrames) { clearInterval(timer); el.textContent = finalText; }
      }, 35);
    }
    if (REDUCED) { el.textContent = finalText; return; }
    new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && run()), { threshold: 0.6 }).observe(el);
  }

  /* ============================ 13 — typewriter ============================ */
  function initTypewriter() {
    const el = document.getElementById("typewriter");
    if (!el) return;
    if (REDUCED) { el.textContent = "BLENCI SS26."; return; }
    const phrases = ["BLENCI SS26.", "FORM FOLLOWS FUNCTION.", "LESS, BUT BETTER.", "BETWEEN BODY AND CLOTH."];
    let pIndex = 0, chIndex = 0, deleting = false;
    function tick() {
      const phrase = phrases[pIndex];
      chIndex += deleting ? -1 : 1;
      el.textContent = phrase.slice(0, chIndex);
      let delay = deleting ? 40 : 70;
      if (!deleting && chIndex === phrase.length) { deleting = true; delay = 1400; }
      else if (deleting && chIndex === 0) { deleting = false; pIndex = (pIndex + 1) % phrases.length; delay = 300; }
      setTimeout(tick, delay);
    }
    tick();
  }

  /* ============================ 15 — SVG line drawing ============================ */
  function initDrawLogo() {
    const svg = document.getElementById("draw-logo");
    if (!svg) return;
    whenReady(() => {
      const paths = [...svg.querySelectorAll("path")];
      paths.forEach((p) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = len;
        p.style.strokeDashoffset = REDUCED ? 0 : len;
      });
      if (REDUCED) return;
      new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            gsap.to(paths, { strokeDashoffset: 0, duration: 1.6, ease: "power2.inOut", stagger: 0.15 });
          }
        });
      }, { threshold: 0.4 }).observe(svg);
    });
  }

  /* ============================ 16 — sticky stacking cards ============================ */
  function initStack() {
    if (REDUCED) return;
    whenReady(() => {
      const cards = [...document.querySelectorAll(".stack-card")];
      cards.forEach((card, i) => {
        const next = cards[i + 1];
        if (!next) return;
        ScrollTrigger.create({
          trigger: next,
          start: "top bottom",
          end: "top top",
          scrub: true,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(card, { scale: 1 - p * 0.06, filter: `brightness(${1 - p * 0.25})` });
          },
        });
      });
    });
  }

  /* ============================ 17 — FLIP card expand ============================ */
  function initFlipCards() {
    const overlay = document.getElementById("flip-overlay");
    const detail = document.getElementById("flip-detail");
    const closeBtn = document.getElementById("flip-close");
    if (!overlay) return;
    let activeImg = null, originalParent = null;

    document.querySelectorAll(".flip-card").forEach((card) => {
      card.addEventListener("click", () => {
        const img = card.querySelector("img");
        activeImg = img; originalParent = card;
        const state = Flip.getState(img);
        detail.appendChild(img);
        overlay.classList.add("open");
        overlay.setAttribute("aria-hidden", "false");
        Flip.from(state, { duration: 0.6, ease: "power3.inOut", absolute: true, scale: true });
      });
    });

    function close() {
      if (!activeImg) return;
      const state = Flip.getState(activeImg);
      originalParent.appendChild(activeImg);
      overlay.classList.remove("open");
      overlay.setAttribute("aria-hidden", "true");
      Flip.from(state, { duration: 0.5, ease: "power3.inOut", absolute: true, scale: true });
      activeImg = null;
    }
    closeBtn.addEventListener("click", close);
    overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  /* ============================ 18 — accordion ============================ */
  function initAccordion() {
    document.querySelectorAll(".accordion-item").forEach((item) => {
      item.querySelector(".accordion-head").addEventListener("click", () => {
        const wasOpen = item.classList.contains("open");
        item.parentElement.querySelectorAll(".accordion-item.open").forEach((o) => o.classList.remove("open"));
        item.classList.toggle("open", !wasOpen);
      });
    });
  }

  /* ============================ 19 — custom dropdown ============================ */
  function initCustomSelect() {
    const root = document.getElementById("custom-select");
    if (!root) return;
    const trigger = document.getElementById("cs-trigger");
    const label = document.getElementById("cs-trigger-label");
    const optionsList = document.getElementById("cs-options");
    const previewImg = document.getElementById("cs-preview-img");

    optionsList.innerHTML = LOOKS.map((look, i) => {
      const n = i + 1;
      return `<li class="cs-option" data-look="${n}" role="option"><img src="../assets/img/${look.variants[0].thumb}" alt="">LOOK ${pad(n)}</li>`;
    }).join("");

    trigger.addEventListener("click", () => {
      const open = root.classList.toggle("open");
      trigger.setAttribute("aria-expanded", String(open));
    });
    optionsList.querySelectorAll(".cs-option").forEach((opt) => {
      opt.addEventListener("click", () => {
        const n = opt.dataset.look;
        label.textContent = `LOOK ${pad(n)} を選択`;
        previewImg.src = `../assets/img/${LOOKS[n - 1].variants[0].thumb}`;
        root.classList.remove("open");
        trigger.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("click", (e) => { if (!root.contains(e.target)) root.classList.remove("open"); });
  }

  /* ============================ 20 — click ripple ============================ */
  function initRipple() {
    const btn = document.getElementById("ripple-btn");
    if (!btn) return;
    btn.addEventListener("click", (e) => {
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width, r.height) * 2;
      const span = document.createElement("span");
      span.className = "ripple";
      span.style.width = span.style.height = size + "px";
      span.style.left = e.clientX - r.left - size / 2 + "px";
      span.style.top = e.clientY - r.top - size / 2 + "px";
      btn.appendChild(span);
      span.addEventListener("animationend", () => span.remove());
    });
  }

  /* ============================ 22 — toast (also used by 21) ============================ */
  function showToast(msg) {
    const root = document.getElementById("toast-root");
    if (!root) return;
    const el = document.createElement("div");
    el.className = "toast";
    el.innerHTML = `<span>${msg}</span><button aria-label="閉じる">✕</button>`;
    root.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    const remove = () => { el.classList.remove("show"); setTimeout(() => el.remove(), 450); };
    el.querySelector("button").addEventListener("click", remove);
    setTimeout(remove, 3500);
  }
  function initToastBtn() {
    const btn = document.getElementById("toast-btn");
    if (btn) btn.addEventListener("click", () => showToast("トーストが表示されました。"));
  }

  /* ============================ 21 — confetti burst ============================ */
  function initConfetti() {
    const btn = document.getElementById("confetti-btn");
    if (!btn) return;
    const colors = ["#d8471f", "#1c6b5a", "#e8c34a", "#6a7fd1", "#ff7847"];
    btn.addEventListener("click", () => {
      const r = btn.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      for (let i = 0; i < 26; i++) {
        const piece = document.createElement("span");
        piece.className = "confetti-piece";
        piece.style.background = colors[i % colors.length];
        piece.style.left = cx + "px";
        piece.style.top = cy + "px";
        document.body.appendChild(piece);
        const angle = Math.random() * Math.PI * 2;
        const dist = 80 + Math.random() * 140;
        gsap.to(piece, {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist - 60,
          rotation: Math.random() * 360,
          opacity: 0,
          duration: 0.9 + Math.random() * 0.5,
          ease: "power2.out",
          onComplete: () => piece.remove(),
        });
      }
      showToast("ウィッシュリストに追加しました ♡");
    });
  }

  /* ============================ 23 — skeleton loading ============================ */
  function initSkeleton() {
    document.querySelectorAll(".skeleton-item").forEach((item, i) => {
      const src = item.dataset.src;
      const img = new Image();
      img.alt = "";
      setTimeout(() => {
        img.src = src;
        img.onload = () => {
          item.appendChild(img);
          requestAnimationFrame(() => item.classList.add("loaded"));
        };
      }, 400 + i * 350);
    });
  }

  /* ============================ 24 — hover flipbook ============================ */
  function initFlipbook() {
    document.querySelectorAll(".flipbook-card").forEach((card) => {
      const n = Number(card.dataset.look);
      const variants = LOOKS[n - 1].variants;
      card.innerHTML = variants
        .map((v, i) => `<img src="../assets/img/${v.thumb}" alt="" class="${i === 0 ? "active" : ""}">`)
        .join("");
      const imgs = [...card.querySelectorAll("img")];
      let idx = 0, timer = null;
      card.addEventListener("mouseenter", () => {
        timer = setInterval(() => {
          imgs[idx].classList.remove("active");
          idx = (idx + 1) % imgs.length;
          imgs[idx].classList.add("active");
        }, 260);
      });
      card.addEventListener("mouseleave", () => {
        clearInterval(timer);
        imgs.forEach((im, i) => im.classList.toggle("active", i === 0));
        idx = 0;
      });
    });
  }

  /* ============================ 25 — odometer counter ============================ */
  function buildOdometerDigits(el, targetStr) {
    el.innerHTML = "";
    const strips = [];
    for (let i = 0; i < targetStr.length; i++) {
      const digitBox = document.createElement("div");
      digitBox.className = "odometer-digit";
      const strip = document.createElement("div");
      strip.className = "odometer-digit-strip";
      for (let n = 0; n < 10; n++) {
        const s = document.createElement("span");
        s.textContent = String(n);
        strip.appendChild(s);
      }
      digitBox.appendChild(strip);
      el.appendChild(digitBox);
      strips.push({ strip, target: Number(targetStr[i]) });
    }
    return strips;
  }
  function initOdometers() {
    document.querySelectorAll(".odometer").forEach((el) => {
      const targetStr = el.dataset.target;
      const strips = buildOdometerDigits(el, targetStr);
      new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          strips.forEach((s, i) => {
            gsap.to(s.strip, { y: -s.target * 60, duration: 1.2, delay: i * 0.12, ease: "power2.inOut" });
          });
        });
      }, { threshold: 0.6 }).observe(el);
    });
  }

  /* ============================ 26 — particle network canvas ============================ */
  function initParticles() {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0, h = 0, particles = [];
    const COUNT = 55;
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      w = canvas.width = canvas.clientWidth * DPR;
      h = canvas.height = canvas.clientHeight * DPR;
    }
    function seed() {
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.5, vy: (Math.random() - 0.5) * 0.5,
      }));
    }
    canvas.addEventListener("mousemove", (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = (e.clientX - r.left) * DPR;
      mouse.y = (e.clientY - r.top) * DPR;
    });
    canvas.addEventListener("mouseleave", () => { mouse.x = -9999; mouse.y = -9999; });

    function draw() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        const dx = p.x - mouse.x, dy = p.y - mouse.y, dist = Math.hypot(dx, dy);
        if (dist < 100 * DPR) { p.x += (dx / dist) * 0.7; p.y += (dy / dist) * 0.7; }
      });
      ctx.fillStyle = "rgba(255,255,255,.85)";
      particles.forEach((p) => { ctx.beginPath(); ctx.arc(p.x, p.y, 1.6 * DPR, 0, Math.PI * 2); ctx.fill(); });
      const linkDist = 110 * DPR;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);
          if (dist < linkDist) {
            ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / linkDist) * 0.35})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }
    function loop() { draw(); requestAnimationFrame(loop); }

    new ResizeObserver(resize).observe(canvas);
    resize();
    seed();
    if (REDUCED) draw(); else loop();
  }

  /* ============================ 30 — theme toggle ============================ */
  function initThemeToggle() {
    const btn = document.getElementById("theme-toggle");
    const label = btn.querySelector(".toggle-text");
    const preferDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    let theme = localStorage.getItem("blenci-lab-theme") || (preferDark ? "dark" : "light");

    function apply(t) {
      document.documentElement.setAttribute("data-theme", t);
      label.textContent = t.toUpperCase();
      localStorage.setItem("blenci-lab-theme", t);
    }
    apply(theme);
    btn.addEventListener("click", () => { theme = theme === "light" ? "dark" : "light"; apply(theme); });
  }

  /* ============================ shared: lenis instances ============================ */
  const lenisInstances = [];
  gsap.ticker.add((time) => lenisInstances.forEach((l) => l.raf(time * 1000)));

  /* ============================ shared: magnetic ============================ */
  function initMagnetic() {
    if (!FINE_POINTER || REDUCED) return;
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const setX = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
      const setY = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        setX((e.clientX - (r.left + r.width / 2)) * 0.35);
        setY((e.clientY - (r.top + r.height / 2)) * 0.35);
      });
      el.addEventListener("mouseleave", () => { setX(0); setY(0); });
    });
  }

  /* ============================ 31 — mini progress loader ============================ */
  function initMiniLoader() {
    const countEl = document.getElementById("mini-loader-count");
    const fillEl = document.getElementById("mini-loader-fill");
    const btn = document.getElementById("replay-loader");
    if (!countEl) return;
    function play() {
      const start = performance.now();
      const dur = 1300;
      function tick() {
        const p = Math.min(1, (performance.now() - start) / dur);
        const n = Math.floor(p * 100);
        countEl.textContent = pad(n);
        fillEl.style.width = n + "%";
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    play();
    if (btn) btn.addEventListener("click", play);
  }

  /* ============================ 32 — scoped custom cursor ============================ */
  function initScopedCursor() {
    const box = document.getElementById("cursor-demo-box");
    if (!box || !FINE_POINTER) return;
    const dot = document.getElementById("scoped-dot");
    const ring = document.getElementById("scoped-ring");
    box.addEventListener("mousemove", (e) => {
      const r = box.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      dot.style.left = ring.style.left = x + "px";
      dot.style.top = ring.style.top = y + "px";
    });
  }

  /* ============================ 33 — cursor-follow preview ============================ */
  function initPreviewListV1() {
    const box = document.getElementById("preview-list-box");
    if (!box) return;
    const follow = document.getElementById("preview-follow");
    const img = follow.querySelector("img");
    box.addEventListener("mousemove", (e) => { follow.style.left = e.clientX + "px"; follow.style.top = e.clientY + "px"; });
    box.querySelectorAll(".preview-row").forEach((row) => {
      row.addEventListener("mouseenter", () => { img.src = row.dataset.img; follow.classList.add("visible"); });
      row.addEventListener("mouseleave", () => follow.classList.remove("visible"));
    });
  }

  /* ============================ 35 — text mask reveal ============================ */
  function initMaskReveal() {
    const lines = document.querySelectorAll("#mask-reveal-text .mr-line > span");
    const btn = document.getElementById("replay-mask");
    if (!lines.length) return;
    function play() {
      gsap.set(lines, { yPercent: 115 });
      gsap.to(lines, { yPercent: 0, duration: 0.9, stagger: 0.15, ease: "power4.out" });
    }
    play();
    if (btn) btn.addEventListener("click", play);
  }

  /* ============================ 36 — split character reveal ============================ */
  function initSplitChar() {
    const el = document.getElementById("split-char-text");
    const btn = document.getElementById("replay-split");
    if (!el) return;
    el.innerHTML = [...el.textContent].map((c) => `<span class="sc-char">${c}</span>`).join("");
    const chars = el.querySelectorAll(".sc-char");
    function play() { gsap.fromTo(chars, { yPercent: 115 }, { yPercent: 0, duration: 0.7, stagger: 0.05, ease: "power4.out" }); }
    play();
    if (btn) btn.addEventListener("click", play);
  }

  /* ============================ 37 — background crossfade ============================ */
  function initCrossfadeV1() {
    const slides = document.querySelectorAll("#g37 .crossfade-slide");
    if (!slides.length || REDUCED) return;
    let i = 0;
    setInterval(() => { slides[i].classList.remove("active"); i = (i + 1) % slides.length; slides[i].classList.add("active"); }, 2600);
  }

  /* ============================ 39 — scoped Lenis smooth scroll ============================ */
  function initScopedLenis() {
    const wrap = document.getElementById("lenis-demo-wrap");
    if (!wrap || REDUCED) return;
    const content = wrap.querySelector(".smooth-content");
    lenisInstances.push(new Lenis({ wrapper: wrap, content, duration: 1 }));
  }

  /* ============================ 40 — pinned horizontal gallery (v1) ============================ */
  function initV1Pin() {
    const track = document.getElementById("v1-pin-track");
    const wrap = document.querySelector(".v1-pin-wrap");
    if (!track || !wrap || REDUCED) return;
    ScrollTrigger.matchMedia({
      "(min-width: 761px)": function () {
        const distance = () => track.scrollWidth - wrap.clientWidth + 60;
        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: wrap, start: "top top+=80", end: () => "+=" + distance(),
            scrub: 0.6, pin: ".v1-pin", invalidateOnRefresh: true,
          },
        });
        return () => tween.scrollTrigger && tween.scrollTrigger.kill();
      },
    });
  }

  /* ============================ 41 — scroll parallax scale ============================ */
  function initParallaxScaleV1() {
    const img = document.getElementById("parallax-scale-img");
    if (!img || REDUCED) return;
    gsap.to(img, { scale: 1, ease: "none", scrollTrigger: { trigger: img.closest(".demo"), start: "top bottom", end: "bottom top", scrub: true } });
  }

  /* ============================ 42 — clip-path wipe reveal ============================ */
  function initClipWipeV1() {
    const img = document.getElementById("clip-wipe-img");
    const box = img && img.closest(".clip-wipe-box");
    if (!img) return;
    gsap.set(box, { clipPath: "inset(0% 0% 100% 0%)" });
    ScrollTrigger.create({ trigger: box, start: "top 80%", once: true, onEnter: () => gsap.to(box, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.2, ease: "power4.out" }) });
  }

  /* ============================ 43 — scroll color morph ============================ */
  function initColorMorphV1() {
    document.querySelectorAll("#color-morph-box .color-morph-panel").forEach((p) => {
      ScrollTrigger.create({
        trigger: p, start: "top 60%", end: "bottom 40%",
        onEnter: () => (p.style.backgroundColor = p.dataset.color),
        onEnterBack: () => (p.style.backgroundColor = p.dataset.color),
        onLeave: () => (p.style.backgroundColor = ""),
        onLeaveBack: () => (p.style.backgroundColor = ""),
      });
    });
  }

  /* ============================ 44 — count-up number ============================ */
  function initCountUpV1() {
    document.querySelectorAll(".countup[data-target]").forEach((el) => {
      const target = Number(el.dataset.target);
      const obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: "top 88%", once: true,
        onEnter: () => gsap.to(obj, { v: target, duration: 1.6, ease: "power2.out", onUpdate: () => (el.textContent = Math.floor(obj.v)) }),
      });
    });
  }

  /* ============================ 45 — staggered fade-in grid ============================ */
  function initStaggerGridV1() {
    const items = [...document.querySelectorAll("#stagger-grid .stagger-item")];
    if (!items.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          setTimeout(() => e.target.classList.add("in-view"), items.indexOf(e.target) * 90);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.2 });
    items.forEach((el) => io.observe(el));
  }

  /* ============================ 46 — simple lightbox ============================ */
  function initSimpleLightbox() {
    const thumbs = document.querySelectorAll(".lightbox-thumbs img");
    if (!thumbs.length) return;
    const overlay = document.createElement("div");
    overlay.className = "simple-lightbox";
    overlay.innerHTML = `<button class="simple-lightbox-close">CLOSE ✕</button><img alt="">`;
    document.body.appendChild(overlay);
    const bigImg = overlay.querySelector("img");
    thumbs.forEach((t) => t.addEventListener("click", () => { bigImg.src = t.dataset.full; overlay.classList.add("open"); }));
    overlay.querySelector(".simple-lightbox-close").addEventListener("click", () => overlay.classList.remove("open"));
    overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("open"); });
  }

  /* ============================ 47 — fullscreen nav menu ============================ */
  function initFsMenu() {
    const openBtn = document.getElementById("open-fs-menu");
    const menu = document.getElementById("fs-menu");
    const closeBtn = document.getElementById("fs-menu-close");
    if (!openBtn) return;
    openBtn.addEventListener("click", () => menu.classList.add("open"));
    closeBtn.addEventListener("click", () => menu.classList.remove("open"));
    menu.querySelectorAll(".fs-menu-link").forEach((a) => a.addEventListener("click", (e) => { e.preventDefault(); menu.classList.remove("open"); }));
  }

  /* ============================ 48 — grain overlay toggle ============================ */
  function initGrainToggle() {
    const btn = document.getElementById("grain-toggle-btn");
    const layer = document.querySelector("#grain-toggle-box .grain-layer");
    if (!btn || !layer) return;
    btn.addEventListener("click", () => layer.classList.toggle("on"));
  }

  /* ============================ 49 — header scroll blur (scoped) ============================ */
  function initMiniBrowser() {
    const scrollEl = document.getElementById("mini-browser-scroll");
    const header = document.getElementById("mini-browser-header");
    if (!scrollEl) return;
    scrollEl.addEventListener("scroll", () => header.classList.toggle("scrolled", scrollEl.scrollTop > 10), { passive: true });
  }

  /* ============================ 50 — repel dot grid ============================ */
  function initRepelGrid() {
    const canvas = document.getElementById("repel-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const GAP = 24;
    let w, h, dots = [];
    function seed() {
      dots = [];
      for (let y = GAP * DPR / 2; y < h; y += GAP * DPR)
        for (let x = GAP * DPR / 2; x < w; x += GAP * DPR) dots.push({ ox: x, oy: y, x, y });
    }
    function resize() { w = canvas.width = canvas.clientWidth * DPR; h = canvas.height = canvas.clientHeight * DPR; seed(); }
    const mouse = { x: -9999, y: -9999 };
    canvas.addEventListener("mousemove", (e) => { const r = canvas.getBoundingClientRect(); mouse.x = (e.clientX - r.left) * DPR; mouse.y = (e.clientY - r.top) * DPR; });
    canvas.addEventListener("mouseleave", () => { mouse.x = -9999; mouse.y = -9999; });
    function render() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(255,255,255,.55)";
      dots.forEach((d) => {
        const dx = d.ox - mouse.x, dy = d.oy - mouse.y, dist = Math.hypot(dx, dy);
        const force = Math.max(0, 1 - dist / (70 * DPR));
        const tx = d.ox + (dist ? dx / dist : 0) * force * 22 * DPR;
        const ty = d.oy + (dist ? dy / dist : 0) * force * 22 * DPR;
        d.x += (tx - d.x) * 0.2; d.y += (ty - d.y) * 0.2;
        ctx.beginPath(); ctx.arc(d.x, d.y, 2 * DPR, 0, Math.PI * 2); ctx.fill();
      });
    }
    function loop() { render(); requestAnimationFrame(loop); }
    new ResizeObserver(resize).observe(canvas);
    resize();
    if (!REDUCED) loop(); else render();
  }

  /* ============================ 51 — elastic connector line ============================ */
  function initElastic() {
    const box = document.getElementById("elastic-box");
    if (!box) return;
    const line = document.getElementById("elastic-line");
    const anchor = document.getElementById("elastic-anchor");
    function reset() {
      const r = box.getBoundingClientRect();
      line.setAttribute("x1", r.width / 2); line.setAttribute("y1", r.height / 2);
      line.setAttribute("x2", r.width / 2); line.setAttribute("y2", r.height / 2);
    }
    reset();
    box.addEventListener("mousemove", (e) => {
      const r = box.getBoundingClientRect();
      const ax = r.width / 2, ay = r.height / 2;
      let mx = e.clientX - r.left, my = e.clientY - r.top;
      const dx = mx - ax, dy = my - ay, dist = Math.hypot(dx, dy), max = 110;
      if (dist > max) { mx = ax + (dx / dist) * max; my = ay + (dy / dist) * max; }
      line.setAttribute("x1", ax); line.setAttribute("y1", ay);
      line.setAttribute("x2", mx); line.setAttribute("y2", my);
    });
    box.addEventListener("mouseleave", reset);
    void anchor;
  }

  /* ============================ 52 — rope chain follow ============================ */
  function initRopeChain() {
    const canvas = document.getElementById("rope-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let w, h;
    function resize() { w = canvas.width = canvas.clientWidth * DPR; h = canvas.height = canvas.clientHeight * DPR; }
    new ResizeObserver(resize).observe(canvas);
    resize();
    const N = 14;
    const points = Array.from({ length: N }, () => ({ x: w / 2, y: h / 2 }));
    const target = { x: w / 2, y: h / 2 };
    canvas.addEventListener("mousemove", (e) => { const r = canvas.getBoundingClientRect(); target.x = (e.clientX - r.left) * DPR; target.y = (e.clientY - r.top) * DPR; });
    function draw() {
      points[0].x += (target.x - points[0].x) * 0.35;
      points[0].y += (target.y - points[0].y) * 0.35;
      for (let i = 1; i < N; i++) {
        points[i].x += (points[i - 1].x - points[i].x) * 0.35;
        points[i].y += (points[i - 1].y - points[i].y) * 0.35;
      }
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = "rgba(216,71,31,.85)"; ctx.lineWidth = 3 * DPR; ctx.lineCap = "round";
      ctx.beginPath();
      points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();
      requestAnimationFrame(draw);
    }
    if (!REDUCED) draw();
  }

  /* ============================ 53 — swipe card deck ============================ */
  function initSwipeDeck() {
    const deck = document.getElementById("swipe-deck");
    if (!deck) return;
    let cards = [...deck.querySelectorAll(".swipe-card")];
    cards.forEach((c, i) => { c.style.backgroundImage = `url(${c.dataset.img})`; c.style.zIndex = cards.length - i; gsap.set(c, { scale: 1 - i * 0.04, y: i * 8 }); });

    function attach(card) {
      let startX = 0, dx = 0, dragging = false;
      card.addEventListener("pointerdown", (e) => { dragging = true; startX = e.clientX; card.setPointerCapture(e.pointerId); });
      card.addEventListener("pointermove", (e) => {
        if (!dragging) return;
        dx = e.clientX - startX;
        gsap.set(card, { x: dx, rotation: dx * 0.05 });
      });
      card.addEventListener("pointerup", () => {
        dragging = false;
        if (Math.abs(dx) > 90) {
          gsap.to(card, {
            x: dx * 3, opacity: 0, duration: 0.4,
            onComplete: () => {
              deck.appendChild(card);
              cards.push(cards.shift());
              cards.forEach((c, i) => { c.style.zIndex = cards.length - i; gsap.set(c, { x: 0, rotation: 0, opacity: 1, y: i * 8, scale: 1 - i * 0.04 }); });
            },
          });
        } else {
          gsap.to(card, { x: 0, rotation: 0, duration: 0.4 });
        }
        dx = 0;
      });
    }
    cards.forEach(attach);
  }

  /* ============================ 54 — gravity drop text ============================ */
  function initGravityText() {
    const el = document.getElementById("gravity-text");
    const btn = document.getElementById("replay-gravity");
    if (!el) return;
    el.innerHTML = [...el.textContent].map((c) => `<span class="gv-char">${c === " " ? "&nbsp;" : c}</span>`).join("");
    const chars = el.querySelectorAll(".gv-char");
    function play() { gsap.fromTo(chars, { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "bounce.out", stagger: 0.06 }); }
    play();
    if (btn) btn.addEventListener("click", play);
  }

  /* ============================ 55 — cursor water distortion ============================ */
  function initWaterDistort() {
    const box = document.getElementById("distort-box");
    const disp = document.getElementById("water-disp");
    if (!box || !disp) return;
    box.addEventListener("mouseenter", () => gsap.to(disp, { attr: { scale: 40 }, duration: 0.4 }));
    box.addEventListener("mouseleave", () => gsap.to(disp, { attr: { scale: 0 }, duration: 0.6 }));
  }

  /* ============================ 56 — chromatic aberration on scroll ============================ */
  function initChroma() {
    const box = document.querySelector(".chroma-box");
    if (!box || REDUCED) return;
    const r = box.querySelector(".chroma-r");
    const b = box.querySelector(".chroma-b");
    let lastY = window.scrollY, target = 0, current = 0;
    window.addEventListener("scroll", () => { const y = window.scrollY; target = gsap.utils.clamp(-14, 14, (y - lastY) * 0.7); lastY = y; }, { passive: true });
    gsap.ticker.add(() => {
      current += (target - current) * 0.15;
      target += (0 - target) * 0.08;
      gsap.set(r, { x: current, y: -current * 0.3 });
      gsap.set(b, { x: -current, y: current * 0.3 });
    });
  }

  /* ============================ 57 — click screen ripple distortion ============================ */
  function initClickRipple() {
    const box = document.getElementById("ripple-img-box");
    const disp = document.getElementById("click-disp");
    if (!box || !disp) return;
    box.addEventListener("click", () => {
      gsap.fromTo(disp, { attr: { scale: 0 } }, { attr: { scale: 60 }, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.out" });
    });
  }

  /* ============================ 58 — morphing liquid blob ============================ */
  function initBlobMorph() {
    const path = document.getElementById("morph-blob");
    if (!path) return;
    const blobs = [
      "M100,30 C150,30 170,80 165,120 C160,160 120,175 90,170 C50,165 25,130 30,90 C35,50 60,30 100,30 Z",
      "M100,25 C140,20 175,55 170,95 C168,140 135,180 95,175 C55,172 20,145 25,100 C28,60 65,30 100,25 Z",
      "M105,35 C145,40 165,75 160,115 C158,150 125,170 90,165 C55,160 30,125 35,85 C40,45 70,28 105,35 Z",
    ];
    path.setAttribute("d", blobs[0]);
    if (REDUCED) return;
    let i = 0;
    function next() { i = (i + 1) % blobs.length; gsap.to(path, { duration: 3, ease: "sine.inOut", attr: { d: blobs[i] }, onComplete: next }); }
    next();
  }

  /* ============================ 59 — variable font morph ============================ */
  function initVarFont() {
    const el = document.getElementById("varfont-text");
    if (!el) return;
    el.addEventListener("mousemove", (e) => {
      const r = el.getBoundingClientRect();
      const pct = gsap.utils.clamp(0, 1, (e.clientX - r.left) / r.width);
      el.style.fontVariationSettings = `'wght' ${Math.round(200 + pct * 700)}`;
    });
    el.addEventListener("mouseleave", () => (el.style.fontVariationSettings = `'wght' 300`));
  }

  /* ============================ 60 — morphing cursor shape ============================ */
  function initMorphCursor() {
    const box = document.getElementById("morph-cursor-box");
    if (!box || !FINE_POINTER) return;
    const cursor = document.getElementById("mc-cursor");
    box.addEventListener("mousemove", (e) => { cursor.style.left = e.clientX + "px"; cursor.style.top = e.clientY + "px"; });
    box.addEventListener("mouseenter", () => cursor.classList.add("show"));
    box.addEventListener("mouseleave", () => { cursor.className = "mc-cursor"; });
    box.querySelectorAll(".mc-zone").forEach((zone) => {
      zone.addEventListener("mouseenter", () => (cursor.className = "mc-cursor show shape-" + zone.dataset.shape));
      zone.addEventListener("mouseleave", () => (cursor.className = "mc-cursor show"));
    });
  }

  /* ============================ 61 — ink blot trail ============================ */
  function initInkTrail() {
    const box = document.getElementById("ink-trail-box");
    if (!box || !FINE_POINTER) return;
    let last = 0;
    box.addEventListener("mousemove", (e) => {
      const now = performance.now();
      if (now - last < 45) return;
      last = now;
      const r = box.getBoundingClientRect();
      const piece = document.createElement("span");
      piece.className = "ink-piece";
      const size = 18 + Math.random() * 22;
      piece.style.width = piece.style.height = size + "px";
      piece.style.left = e.clientX - r.left + "px";
      piece.style.top = e.clientY - r.top + "px";
      box.appendChild(piece);
      gsap.to(piece, { scale: 2, opacity: 0, duration: 1, ease: "power1.out", onComplete: () => piece.remove() });
    });
  }

  /* ============================ 62 — sparkle trail ============================ */
  function initSparkleTrail() {
    const box = document.getElementById("sparkle-trail-box");
    if (!box || !FINE_POINTER) return;
    let last = 0;
    box.addEventListener("mousemove", (e) => {
      const now = performance.now();
      if (now - last < 55) return;
      last = now;
      const r = box.getBoundingClientRect();
      const piece = document.createElement("span");
      piece.className = "sparkle-piece";
      piece.textContent = "✦";
      piece.style.left = e.clientX - r.left + "px";
      piece.style.top = e.clientY - r.top + "px";
      box.appendChild(piece);
      gsap.fromTo(piece, { scale: 0, rotation: 0, opacity: 1 }, { scale: 1.4, rotation: 90, opacity: 0, duration: 0.9, ease: "power1.out", onComplete: () => piece.remove() });
    });
  }

  /* ============================ 63 — magnifier lens ============================ */
  function initMagnifier() {
    const box = document.getElementById("magnifier-box");
    const lens = document.getElementById("magnifier-lens");
    if (!box || !lens) return;
    lens.style.backgroundImage = box.style.backgroundImage;
    const ZOOM = 2;
    box.addEventListener("mousemove", (e) => {
      const r = box.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      lens.style.left = x + "px"; lens.style.top = y + "px";
      lens.style.backgroundSize = r.width * ZOOM + "px " + r.height * ZOOM + "px";
      lens.style.backgroundPosition = `-${x * ZOOM - 60}px -${y * ZOOM - 60}px`;
      lens.classList.add("show");
    });
    box.addEventListener("mouseleave", () => lens.classList.remove("show"));
  }

  /* ============================ 64 — motion ghost trail ============================ */
  function initGhostTrail() {
    const box = document.getElementById("ghost-box");
    const card = document.getElementById("ghost-card");
    if (!box || !card) return;
    let dragging = false, last = 0;
    card.addEventListener("pointerdown", (e) => { dragging = true; card.setPointerCapture(e.pointerId); });
    card.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const r = box.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      card.style.position = "absolute";
      card.style.left = x + "px"; card.style.top = y + "px";
      const now = performance.now();
      if (now - last > 60) {
        last = now;
        const ghost = document.createElement("div");
        ghost.className = "ghost-piece";
        ghost.style.left = x + "px"; ghost.style.top = y + "px";
        box.appendChild(ghost);
        gsap.to(ghost, { opacity: 0, scale: 0.8, duration: 0.6, onComplete: () => ghost.remove() });
      }
    });
    window.addEventListener("pointerup", () => (dragging = false));
  }

  /* ============================ 65 — 3D coverflow carousel ============================ */
  function initCoverflow() {
    const track = document.getElementById("coverflow-track");
    const prevBtn = document.getElementById("coverflow-prev");
    const nextBtn = document.getElementById("coverflow-next");
    if (!track) return;
    const order = [1, 4, 8, 11, 15, 17];
    track.innerHTML = order.map((n) => `<div class="cf-item"><img src="../assets/img/${LOOKS[n - 1].variants[0].thumb}" alt="LOOK ${pad(n)}"></div>`).join("");
    const items = [...track.querySelectorAll(".cf-item")];
    let active = 0;
    function layout() {
      items.forEach((el, i) => {
        const offset = i - active, abs = Math.abs(offset);
        gsap.to(el, { x: offset * 120, z: -abs * 140, rotateY: offset * -35, scale: 1 - abs * 0.15, opacity: abs > 2 ? 0 : 1, zIndex: 10 - abs, duration: 0.6, ease: "power3.out" });
      });
    }
    layout();
    prevBtn.addEventListener("click", () => { active = Math.max(0, active - 1); layout(); });
    nextBtn.addEventListener("click", () => { active = Math.min(items.length - 1, active + 1); layout(); });
  }

  /* ============================ 67 — origami fold-out ============================ */
  function initOrigami() {
    const btn = document.getElementById("replay-origami");
    const panels = document.querySelectorAll("#origami .origami-panel");
    if (!btn) return;
    let open = false;
    btn.addEventListener("click", () => {
      open = !open;
      gsap.to(panels, { rotateY: open ? 0 : -90, duration: 0.7, stagger: 0.15, ease: "power3.out", transformOrigin: "left center" });
    });
  }

  /* ============================ 68 — 3D character flip-in ============================ */
  function initFlip3D() {
    const el = document.getElementById("flip3d-text");
    const btn = document.getElementById("replay-flip3d");
    if (!el) return;
    el.innerHTML = [...el.textContent].map((c) => `<span class="f3-char">${c}</span>`).join("");
    const chars = el.querySelectorAll(".f3-char");
    function play() { gsap.fromTo(chars, { rotateX: -100, opacity: 0 }, { rotateX: 0, opacity: 1, duration: 0.7, stagger: 0.06, ease: "back.out(1.7)", transformOrigin: "50% 100%" }); }
    play();
    if (btn) btn.addEventListener("click", play);
  }

  /* ============================ 69 — perspective scroll tunnel (scoped) ============================ */
  function initTunnel() {
    const box = document.getElementById("tunnel-box");
    const lines = document.querySelectorAll("#tunnel-scene .tunnel-line");
    if (!box || !lines.length) return;
    lines.forEach((l, i) => (l.style.top = i * 160 + "px"));
    function update() {
      const scrollTop = box.scrollTop;
      lines.forEach((l, i) => {
        const dist = i * 160 - scrollTop;
        gsap.set(l, { z: -dist * 1.2, opacity: gsap.utils.clamp(0, 1, 1 - Math.abs(dist) / 500), scale: gsap.utils.clamp(0.3, 1.6, 1 - dist / 500) });
      });
    }
    box.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ============================ 70 — torn paper reveal ============================ */
  function initTornPaper() {
    const img = document.getElementById("torn-img");
    const box = img && img.closest(".torn-box");
    if (!img) return;
    const hidden = "polygon(0% 98%,8% 94%,16% 99%,24% 93%,32% 98%,40% 92%,48% 97%,56% 93%,64% 98%,72% 94%,80% 99%,88% 93%,100% 97%,100% 100%,0% 100%)";
    const full = "polygon(0% 0%,8% 0%,16% 0%,24% 0%,32% 0%,40% 0%,48% 0%,56% 0%,64% 0%,72% 0%,80% 0%,88% 0%,100% 0%,100% 100%,0% 100%)";
    gsap.set(box, { clipPath: hidden });
    ScrollTrigger.create({ trigger: box, start: "top 80%", once: true, onEnter: () => gsap.to(box, { clipPath: full, duration: 1.4, ease: "power3.inOut" }) });
  }

  /* ============================ 71 — exploded view diagram ============================ */
  function initExploded() {
    const box = document.getElementById("exploded-box");
    if (!box) return;
    const parts = box.querySelectorAll(".exploded-part");
    gsap.set(parts, { xPercent: -50, yPercent: -50 });
    function explode() { parts.forEach((p) => gsap.to(p, { x: Number(p.dataset.x), y: Number(p.dataset.y), duration: 0.6, ease: "power3.out" })); }
    function assemble() { parts.forEach((p) => gsap.to(p, { x: 0, y: 0, duration: 0.5, ease: "power3.inOut" })); }
    box.addEventListener("mouseenter", explode);
    box.addEventListener("mouseleave", assemble);
    new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && explode()), { threshold: 0.5 }).observe(box);
  }

  /* ============================ 72 — particle text formation ============================ */
  function initParticleText() {
    const canvas = document.getElementById("particle-text-canvas");
    const btn = document.getElementById("replay-particle-text");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let w, h, particles = [];
    function resize() { w = canvas.width = canvas.clientWidth * DPR; h = canvas.height = canvas.clientHeight * DPR; }
    new ResizeObserver(resize).observe(canvas);

    function sample(text) {
      const off = document.createElement("canvas");
      off.width = w; off.height = h;
      const octx = off.getContext("2d");
      octx.fillStyle = "#fff";
      octx.font = `bold ${Math.floor(h * 0.4)}px monospace`;
      octx.textAlign = "center"; octx.textBaseline = "middle";
      octx.fillText(text, w / 2, h / 2);
      const data = octx.getImageData(0, 0, w, h).data;
      const pts = [];
      const step = Math.max(2, Math.floor(DPR * 3));
      for (let y = 0; y < h; y += step) for (let x = 0; x < w; x += step) if (data[(y * w + x) * 4 + 3] > 128) pts.push({ x, y });
      return pts;
    }
    function play() {
      resize();
      const targets = sample("BLENCI");
      particles = targets.map((t) => ({ x: Math.random() * w, y: Math.random() * h, tx: t.x, ty: t.y }));
    }
    function renderOnce() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(216,71,31,.9)";
      particles.forEach((p) => { ctx.beginPath(); ctx.arc(p.tx, p.ty, 1.6 * DPR, 0, Math.PI * 2); ctx.fill(); });
    }
    function loop() {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgba(216,71,31,.9)";
      particles.forEach((p) => { p.x += (p.tx - p.x) * 0.08; p.y += (p.ty - p.y) * 0.08; ctx.beginPath(); ctx.arc(p.x, p.y, 1.6 * DPR, 0, Math.PI * 2); ctx.fill(); });
      requestAnimationFrame(loop);
    }
    resize();
    play();
    if (!REDUCED) loop(); else renderOnce();
    if (btn) btn.addEventListener("click", () => { play(); if (REDUCED) renderOnce(); });
  }

  /* ============================ 73 — liquid fill indicator ============================ */
  function initLiquidFill() {
    const rect = document.getElementById("liquid-rect");
    const label = document.getElementById("liquid-label");
    const svg = rect && rect.closest(".liquid-fill-svg");
    if (!rect) return;
    ScrollTrigger.create({
      trigger: svg, start: "top 85%", end: "bottom 60%", scrub: true,
      onUpdate: (self) => { const p = self.progress; rect.setAttribute("y", 120 - 120 * p); label.textContent = Math.round(p * 100) + "%"; },
    });
  }

  /* ============================ 74 — motion path scroll ============================ */
  function initMotionPath() {
    const path = document.getElementById("motion-path");
    const dot = document.getElementById("motion-path-dot");
    const box = dot && dot.closest(".motion-path-box");
    if (!path || !dot) return;
    const length = path.getTotalLength();
    function place(progress) {
      const pt = path.getPointAtLength(progress * length);
      const svgRect = path.ownerSVGElement.getBoundingClientRect();
      const boxRect = box.getBoundingClientRect();
      const sx = svgRect.width / 400, sy = svgRect.height / 160;
      dot.style.left = svgRect.left - boxRect.left + pt.x * sx + "px";
      dot.style.top = svgRect.top - boxRect.top + pt.y * sy + "px";
    }
    place(0);
    ScrollTrigger.create({ trigger: box, start: "top 80%", end: "bottom 30%", scrub: true, onUpdate: (self) => place(self.progress) });
  }

  /* ============================ 75 — ambient floating icons ============================ */
  function initAmbient() {
    const box = document.getElementById("ambient-box");
    if (!box || REDUCED) return;
    const state = [...box.querySelectorAll(".ambient-icon")].map((el) => ({
      el, x: Math.random() * 80 + 10, y: Math.random() * 80 + 10, vx: (Math.random() - 0.5) * 0.15, vy: (Math.random() - 0.5) * 0.15,
    }));
    const mouse = { x: -999, y: -999 };
    box.addEventListener("mousemove", (e) => { const r = box.getBoundingClientRect(); mouse.x = ((e.clientX - r.left) / r.width) * 100; mouse.y = ((e.clientY - r.top) / r.height) * 100; });
    box.addEventListener("mouseleave", () => { mouse.x = -999; mouse.y = -999; });
    function loop() {
      state.forEach((s) => {
        const dx = s.x - mouse.x, dy = s.y - mouse.y, dist = Math.hypot(dx, dy);
        let mult = 1;
        if (dist < 25) { mult = 3; s.x += (dx / dist) * 0.4; s.y += (dy / dist) * 0.4; }
        s.x += s.vx * mult; s.y += s.vy * mult;
        if (s.x < 0 || s.x > 100) s.vx *= -1;
        if (s.y < 0 || s.y > 100) s.vy *= -1;
        s.el.style.left = s.x + "%"; s.el.style.top = s.y + "%";
      });
      requestAnimationFrame(loop);
    }
    loop();
  }

  /* ============================ 76 — animated bar chart ============================ */
  function initBarChart() {
    const container = document.getElementById("bar-chart");
    const bars = container && container.querySelectorAll(".bar-fill");
    if (!bars || !bars.length) return;
    new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) gsap.to(bars, { width: (i, el) => el.dataset.value + "%", duration: 1.2, stagger: 0.1, ease: "power3.out" });
      });
    }, { threshold: 0.4 }).observe(container);
  }

  /* ============================ 77 — glitch slice hover ============================ */
  function initGlitchSlice() {
    const box = document.getElementById("glitch-box");
    if (!box) return;
    const bgUrl = box.style.backgroundImage;
    box.style.backgroundImage = "none";
    const SLICES = 7;
    function build() {
      box.querySelectorAll(".glitch-slice").forEach((s) => s.remove());
      const h = box.clientHeight, sliceH = h / SLICES;
      for (let i = 0; i < SLICES; i++) {
        const s = document.createElement("div");
        s.className = "glitch-slice";
        s.style.height = sliceH + "px";
        s.style.top = i * sliceH + "px";
        s.style.backgroundImage = bgUrl;
        s.style.backgroundSize = `100% ${h}px`;
        s.style.backgroundPosition = `center -${i * sliceH}px`;
        box.appendChild(s);
      }
    }
    build();
    window.addEventListener("resize", build);
    let glitching = false;
    box.addEventListener("mouseenter", () => {
      if (glitching) return;
      glitching = true;
      const slices = [...box.querySelectorAll(".glitch-slice")];
      const tl = gsap.timeline({ onComplete: () => (glitching = false) });
      slices.forEach((s) => {
        tl.to(s, { x: (Math.random() - 0.5) * 40, duration: 0.06 }, "<")
          .to(s, { x: (Math.random() - 0.5) * 20, duration: 0.06 })
          .to(s, { x: 0, duration: 0.1 });
      });
    });
  }

  /* ============================ 78 — peel-back drag reveal ============================ */
  function initPeelDrag() {
    const box = document.getElementById("peel-drag-box");
    const top = document.getElementById("peel-drag-top");
    const handle = document.getElementById("peel-drag-handle");
    if (!box) return;
    let dragging = false;
    function setReveal(pct) {
      top.style.clipPath = `polygon(${pct}% 0, 100% 0, 100% 100%, ${pct}% 100%)`;
      handle.style.left = pct + "%";
    }
    setReveal(0);
    handle.addEventListener("pointerdown", (e) => { dragging = true; handle.setPointerCapture(e.pointerId); });
    window.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const r = box.getBoundingClientRect();
      setReveal(gsap.utils.clamp(0, 100, ((e.clientX - r.left) / r.width) * 100));
    });
    window.addEventListener("pointerup", () => (dragging = false));
  }

  /* ============================ 79 — overscroll bounce indicator ============================ */
  function initOverscrollBounce() {
    const inner = document.getElementById("bounce-inner");
    const capTop = document.getElementById("bounce-cap-top");
    const capBottom = document.getElementById("bounce-cap-bottom");
    if (!inner) return;
    inner.addEventListener("wheel", (e) => {
      const atTop = inner.scrollTop <= 0;
      const atBottom = inner.scrollTop + inner.clientHeight >= inner.scrollHeight - 1;
      if ((atTop && e.deltaY < 0) || (atBottom && e.deltaY > 0)) {
        const cap = atTop ? capTop : capBottom;
        gsap.timeline().to(cap, { height: 26, duration: 0.18, ease: "power2.out" }).to(cap, { height: 0, duration: 0.35, ease: "power3.in" });
      }
    }, { passive: true });
  }

  /* ================================ boot ================================ */
  function boot() {
    initScrollProgress();
    initDotNav();
    initSkew();
    initSpotlight();
    initParallax();
    initTilt();
    buildDragGallery();
    initCompare();
    initScramble();
    initTypewriter();
    initDrawLogo();
    initStack();
    initFlipCards();
    initAccordion();
    initCustomSelect();
    initRipple();
    initConfetti();
    initToastBtn();
    initSkeleton();
    initFlipbook();
    initOdometers();
    initParticles();
    initThemeToggle();
    initMagnetic();

    // 31–49: from v1
    initMiniLoader();
    initScopedCursor();
    initPreviewListV1();
    initMaskReveal();
    initSplitChar();
    initCrossfadeV1();
    initScopedLenis();
    initV1Pin();
    initParallaxScaleV1();
    initClipWipeV1();
    initColorMorphV1();
    initCountUpV1();
    initStaggerGridV1();
    initSimpleLightbox();
    initFsMenu();
    initGrainToggle();
    initMiniBrowser();

    // 50–79: new originals
    initRepelGrid();
    initElastic();
    initRopeChain();
    initSwipeDeck();
    initGravityText();
    initWaterDistort();
    initChroma();
    initClickRipple();
    initBlobMorph();
    initVarFont();
    initMorphCursor();
    initInkTrail();
    initSparkleTrail();
    initMagnifier();
    initGhostTrail();
    initCoverflow();
    initOrigami();
    initFlip3D();
    initTunnel();
    initTornPaper();
    initExploded();
    initParticleText();
    initLiquidFill();
    initMotionPath();
    initAmbient();
    initBarChart();
    initGlitchSlice();
    initPeelDrag();
    initOverscrollBounce();

    setTimeout(() => ScrollTrigger.refresh(), 300);
  }

  whenReady(boot);
})();
