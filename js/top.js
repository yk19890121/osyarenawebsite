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
    const order = [1, 3, 5, 8, 12, 14, 13, 15, 17, 2, 10, 18];
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
    initTunnel();
    initSphereTop();
    initTransitions();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
