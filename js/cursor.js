/* BLENCI LAB — shared rope-chain cursor + click shockwave (all pages) */
(() => {
  "use strict";

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE_POINTER = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  function boot() {
    const canvas = document.getElementById("rope-cursor-canvas");
    const shockLayer = document.getElementById("shockwave-layer");
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

    let hidden = false;
    document.addEventListener("mouseover", (e) => { if (e.target.closest(".local-cursor")) { hidden = true; canvas.style.opacity = "0"; } });
    document.addEventListener("mouseout", (e) => { if (e.target.closest(".local-cursor")) { hidden = false; canvas.style.opacity = "1"; } });

    function draw() {
      points[0].x += (target.x - points[0].x) * 0.35;
      points[0].y += (target.y - points[0].y) * 0.35;
      for (let i = 1; i < N; i++) {
        points[i].x += (points[i - 1].x - points[i].x) * 0.35;
        points[i].y += (points[i - 1].y - points[i].y) * 0.35;
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!hidden) {
        ctx.strokeStyle = "rgba(255,120,71,.75)";
        ctx.lineWidth = 2.5 * DPR;
        ctx.lineCap = "round";
        ctx.beginPath();
        points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
        ctx.stroke();
        ctx.fillStyle = "#ff7847";
        ctx.beginPath(); ctx.arc(points[0].x, points[0].y, 3 * DPR, 0, Math.PI * 2); ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    if (!REDUCED) draw();

    if (shockLayer) {
      document.addEventListener("click", (e) => {
        if (e.target.closest(".local-cursor")) return;
        for (let i = 0; i < 2; i++) {
          const ring = document.createElement("div");
          ring.className = "shock-ring";
          ring.style.left = e.clientX + "px";
          ring.style.top = e.clientY + "px";
          ring.style.width = ring.style.height = "10px";
          const dur = 0.9 + i * 0.2;
          ring.style.transition = `width ${dur}s ease-out, height ${dur}s ease-out, opacity ${dur}s ease-out`;
          shockLayer.appendChild(ring);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              ring.style.width = ring.style.height = 260 + i * 50 + "px";
              ring.style.opacity = "0";
            });
          });
          setTimeout(() => ring.remove(), dur * 1000 + 200);
        }
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
