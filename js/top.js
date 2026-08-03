/* BLENCI LAB — TOP hub page */
(() => {
  "use strict";

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE_POINTER = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  /* ---------------- background crossfade ---------------- */
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

  /* ---------------- rope-chain cursor (full page) ---------------- */
  function initRopeCursor() {
    const canvas = document.getElementById("rope-cursor-canvas");
    if (!canvas || !FINE_POINTER) return;
    document.body.classList.add("cursor-ready");
    const ctx = canvas.getContext("2d");
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    function resize() { canvas.width = window.innerWidth * DPR; canvas.height = window.innerHeight * DPR; }
    window.addEventListener("resize", resize);
    resize();
    const N = 16;
    const points = Array.from({ length: N }, () => ({ x: (window.innerWidth / 2) * DPR, y: (window.innerHeight / 2) * DPR }));
    const target = { x: points[0].x, y: points[0].y };
    window.addEventListener("mousemove", (e) => { target.x = e.clientX * DPR; target.y = e.clientY * DPR; });
    function draw() {
      points[0].x += (target.x - points[0].x) * 0.35;
      points[0].y += (target.y - points[0].y) * 0.35;
      for (let i = 1; i < N; i++) {
        points[i].x += (points[i - 1].x - points[i].x) * 0.35;
        points[i].y += (points[i - 1].y - points[i].y) * 0.35;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(255,120,71,.75)";
      ctx.lineWidth = 2.5 * DPR;
      ctx.lineCap = "round";
      ctx.beginPath();
      points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
      ctx.stroke();
      ctx.fillStyle = "#fff";
      ctx.beginPath(); ctx.arc(points[0].x, points[0].y, 3 * DPR, 0, Math.PI * 2); ctx.fill();
      requestAnimationFrame(draw);
    }
    draw();
  }

  /* ---------------- click shockwave (full page) ---------------- */
  function initShockwave() {
    const layer = document.getElementById("shockwave-layer");
    if (!layer) return;
    document.addEventListener("click", (e) => {
      for (let i = 0; i < 2; i++) {
        const ring = document.createElement("div");
        ring.className = "shock-ring";
        ring.style.left = e.clientX + "px";
        ring.style.top = e.clientY + "px";
        ring.style.width = ring.style.height = "10px";
        layer.appendChild(ring);
        gsap.to(ring, { width: 260 + i * 50, height: 260 + i * 50, opacity: 0, duration: 0.9 + i * 0.2, ease: "power2.out", delay: i * 0.1, onComplete: () => ring.remove() });
      }
    });
  }

  /* ---------------- tunnel menu (mouse-driven depth) ---------------- */
  function initTunnel() {
    const wrap = document.querySelector(".tunnel-menu");
    const items = [...document.querySelectorAll(".tunnel-item")];
    if (!wrap || !items.length) return;
    const H = 360;
    const anchors = items.map((_, i) => ((i + 0.5) / items.length) * H);
    items.forEach((el, i) => (el.style.top = anchors[i] + "px"));

    function update(my) {
      items.forEach((el, i) => {
        const dist = Math.abs(my - anchors[i]);
        const norm = gsap.utils.clamp(0, 1, 1 - dist / 220);
        gsap.to(el, {
          z: -160 + norm * 160,
          scale: 0.75 + norm * 0.35,
          opacity: 0.35 + norm * 0.65,
          filter: `blur(${(1 - norm) * 3}px)`,
          duration: 0.4,
          overwrite: "auto",
        });
      });
    }
    if (FINE_POINTER) {
      wrap.addEventListener("mousemove", (e) => { const r = wrap.getBoundingClientRect(); update(e.clientY - r.top); });
      wrap.addEventListener("mouseleave", () => update(H / 2));
    }
    update(H / 2);
  }

  /* ---------------- 3D sphere gallery (right) ---------------- */
  function initSphereTop() {
    const inner = document.getElementById("sphere-inner-top");
    if (!inner || typeof LOOKS === "undefined") return;
    const order = [1, 3, 5, 7, 9, 11, 13, 15, 17, 2, 10, 16];
    const N = order.length, radius = 190;
    const base = order.map((n, i) => {
      const el = document.createElement("div");
      el.className = "sphere-item-top";
      el.innerHTML = `<img src="assets/img/${LOOKS[n - 1].variants[0].thumb}" alt="">`;
      inner.appendChild(el);
      const phi = Math.acos(1 - (2 * (i + 0.5)) / N);
      const theta0 = Math.PI * (1 + Math.sqrt(5)) * i;
      return { el, by: radius * Math.cos(phi), r: radius * Math.sin(phi), theta0 };
    });
    let angle = 0;
    function place() {
      base.forEach((item) => {
        const t = angle * 2 * Math.PI + item.theta0;
        const x = item.r * Math.cos(t), z = item.r * Math.sin(t);
        const scaleF = ((z + radius) / (radius * 2)) * 0.7 + 0.5;
        gsap.set(item.el, { x, y: item.by, z, scale: scaleF, opacity: scaleF, zIndex: Math.round(z) });
      });
    }
    if (REDUCED) { place(); return; }
    function loop() { angle += 0.004; place(); requestAnimationFrame(loop); }
    loop();
  }

  /* ---------------- fullscreen circle-reveal transition ---------------- */
  function initTransitions() {
    const overlay = document.getElementById("transition-overlay");
    const label = document.getElementById("transition-label");
    document.querySelectorAll(".tunnel-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const href = item.getAttribute("href");
        const rect = item.getBoundingClientRect();
        const cx = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
        const cy = ((rect.top + rect.height / 2) / window.innerHeight) * 100;
        overlay.style.clipPath = `circle(0% at ${cx}% ${cy}%)`;
        overlay.classList.add("active");
        label.textContent = item.dataset.label;
        requestAnimationFrame(() => {
          gsap.to(overlay, { clipPath: `circle(150% at ${cx}% ${cy}%)`, duration: 0.9, ease: "power3.inOut" });
          gsap.to(label, { opacity: 1, y: 0, duration: 0.6, delay: 0.25, ease: "power3.out" });
        });
        setTimeout(() => { window.location.href = href; }, 750);
      });
    });
  }

  function boot() {
    initBgCrossfade();
    initRopeCursor();
    initShockwave();
    initTunnel();
    initSphereTop();
    initTransitions();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
