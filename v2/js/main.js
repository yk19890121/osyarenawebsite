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
      const setRY = gsap.quickTo(card, "rotateY", { duration: 0.5, ease: "power3" });
      const setRX = gsap.quickTo(card, "rotateX", { duration: 0.5, ease: "power3" });
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        setRY(px * 18);
        setRX(-py * 18);
      });
      card.addEventListener("mouseleave", () => { setRY(0); setRX(0); });
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

    setTimeout(() => ScrollTrigger.refresh(), 300);
  }

  whenReady(boot);
})();
