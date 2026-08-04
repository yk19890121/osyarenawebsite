/* BLENCI BUILDER — motion engine. Applies gimmick effects to elements
   inside the same-origin preview iframe. Ported from equivalent
   implementations in gimmicks/js/main.js where noted. */
window.Builder = window.Builder || {};

(() => {
  "use strict";

  function cleanupEl(el) {
    if (el.__bpCleanup) { el.__bpCleanup.forEach((fn) => { try { fn(); } catch (e) {} }); }
    el.__bpCleanup = [];
  }

  function wrapLines(el) {
    const text = el.__bpRawText != null ? el.__bpRawText : el.textContent;
    el.__bpRawText = text;
    el.innerHTML = text.split("\n").map(
      (line) => `<span class="bp-mask-line"><span class="bp-mask-inner">${escapeHtml(line) || "&nbsp;"}</span></span>`
    ).join("");
    return [...el.querySelectorAll(".bp-mask-inner")];
  }

  function wrapChars(el) {
    const text = el.__bpRawText != null ? el.__bpRawText : el.textContent;
    el.__bpRawText = text;
    el.innerHTML = [...text].map((c) => c === "\n" ? "<br>" : `<span class="bp-char">${c === " " ? "&nbsp;" : escapeHtml(c)}</span>`).join("");
    return [...el.querySelectorAll(".bp-char")];
  }

  function escapeHtml(s) { return s.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c])); }

  function ensureStyleTag(doc) {
    let tag = doc.getElementById("bp-motion-style");
    if (!tag) {
      tag = doc.createElement("style");
      tag.id = "bp-motion-style";
      tag.textContent = `
        .bp-mask-line{display:block;overflow:hidden;}
        .bp-mask-inner{display:inline-block;will-change:transform;}
        .bp-char{display:inline-block;will-change:transform;}
      `;
      doc.head.appendChild(tag);
    }
    return tag;
  }

  // ---- entrance effects ----
  const ENTRANCE = {
    "text-mask-reveal": (win, el, opt) => {
      ensureStyleTag(el.ownerDocument);
      const lines = wrapLines(el);
      win.gsap.set(lines, { yPercent: 115 });
      win.gsap.to(lines, { yPercent: 0, duration: opt.duration, delay: opt.delay, stagger: 0.12, ease: opt.easing });
    },
    "split-character": (win, el, opt) => {
      ensureStyleTag(el.ownerDocument);
      const chars = wrapChars(el);
      win.gsap.fromTo(chars, { yPercent: 115 }, { yPercent: 0, duration: opt.duration, delay: opt.delay, stagger: 0.03, ease: opt.easing });
    },
    "fade-up": (win, el, opt) => {
      win.gsap.fromTo(el, { opacity: 0, y: opt.distance }, { opacity: 1, y: 0, duration: opt.duration, delay: opt.delay, ease: opt.easing });
    },
    "blur-reveal": (win, el, opt) => {
      win.gsap.fromTo(el, { opacity: 0, filter: "blur(14px)" }, { opacity: 1, filter: "blur(0px)", duration: opt.duration, delay: opt.delay, ease: opt.easing });
    },
    "clip-path-wipe": (win, el, opt) => {
      const box = el.closest("figure") || el;
      win.gsap.set(box, { clipPath: "inset(0% 0% 100% 0%)" });
      win.gsap.to(box, { clipPath: "inset(0% 0% 0% 0%)", duration: opt.duration, delay: opt.delay, ease: opt.easing });
    },
    "fade-in": (win, el, opt) => {
      win.gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: opt.duration, delay: opt.delay, ease: opt.easing });
    },
  };
  const ENTRANCE_FALLBACK = (win, el) => { win.gsap.set(el, { opacity: 1, y: 0, filter: "none", clipPath: "none" }); };

  // ---- hover effects ----
  const HOVER = {
    "soft-zoom": (win, el, opt) => {
      const img = el.querySelector("img") || el;
      const enter = () => win.gsap.to(img, { scale: opt.scale, duration: opt.duration, ease: "power2.out" });
      const leave = () => win.gsap.to(img, { scale: 1, duration: opt.duration, ease: "power2.out" });
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      return () => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); win.gsap.set(img, { scale: 1 }); };
    },
    "magnetic-hover": (win, el, opt) => {
      const setX = win.gsap.quickTo(el, "x", { duration: opt.duration, ease: "power3" });
      const setY = win.gsap.quickTo(el, "y", { duration: opt.duration, ease: "power3" });
      const move = (e) => {
        const r = el.getBoundingClientRect();
        setX((e.clientX - (r.left + r.width / 2)) * opt.intensity);
        setY((e.clientY - (r.top + r.height / 2)) * opt.intensity);
      };
      const leave = () => { setX(0); setY(0); };
      el.addEventListener("mousemove", move);
      el.addEventListener("mouseleave", leave);
      return () => { el.removeEventListener("mousemove", move); el.removeEventListener("mouseleave", leave); win.gsap.set(el, { x: 0, y: 0 }); };
    },
    "underline-slide": (win, el, opt) => {
      const line = el.querySelector(".es-button__underline");
      if (!line) return () => {};
      win.gsap.set(line, { scaleX: 0 });
      const enter = () => win.gsap.to(line, { scaleX: 1, duration: opt.duration, ease: "power2.out" });
      const leave = () => win.gsap.to(line, { scaleX: 0, duration: opt.duration, ease: "power2.out" });
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      return () => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); win.gsap.set(line, { scaleX: 0 }); };
    },
    "fill-slide": (win, el, opt) => {
      const fill = el.querySelector(".es-button__fill");
      const label = el.querySelector(".es-button__label");
      if (!fill) return () => {};
      win.gsap.set(fill, { yPercent: 101 });
      const enter = () => { win.gsap.to(fill, { yPercent: 0, duration: opt.duration, ease: "power2.out" }); win.gsap.to(label, { color: "var(--bp-bg)", duration: opt.duration }); };
      const leave = () => { win.gsap.to(fill, { yPercent: 101, duration: opt.duration, ease: "power2.out" }); win.gsap.to(label, { color: "var(--bp-text)", duration: opt.duration }); };
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      return () => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); win.gsap.set(fill, { yPercent: 101 }); win.gsap.set(label, { color: "" }); };
    },
    "scale-hover": (win, el, opt) => {
      const enter = () => win.gsap.to(el, { scale: opt.scale, duration: opt.duration, ease: "power2.out" });
      const leave = () => win.gsap.to(el, { scale: 1, duration: opt.duration, ease: "power2.out" });
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
      return () => { el.removeEventListener("mouseenter", enter); el.removeEventListener("mouseleave", leave); win.gsap.set(el, { scale: 1 }); };
    },
  };

  // ---- scroll effects ----
  const SCROLL = {
    "slow-parallax": (win, el, opt) => {
      const img = el.querySelector("img") || el;
      const tween = win.gsap.to(img, {
        yPercent: opt.intensity * 40, ease: "none",
        scrollTrigger: { trigger: el, scrub: true, start: "top bottom", end: "bottom top" },
      });
      return () => { if (tween.scrollTrigger) tween.scrollTrigger.kill(); tween.kill(); win.gsap.set(img, { yPercent: 0 }); };
    },
  };

  // ---- continuous effects ----
  const CONTINUOUS = {
    "noise-overlay": (win, el, opt) => {
      const layer = el.querySelector(".es-noise");
      if (!layer) return () => {};
      layer.style.opacity = String(opt.intensity);
      return () => { layer.style.opacity = "0"; };
    },
    "animated-gradient": (win, el, opt) => {
      const tween = win.gsap.fromTo(
        el, { backgroundPosition: "0% 50%" }, { backgroundPosition: "200% 50%", duration: opt.duration, ease: "none", repeat: -1 }
      );
      el.style.backgroundImage = "linear-gradient(120deg, var(--bp-bg), var(--bp-accent), var(--bp-bg))";
      el.style.backgroundSize = "300% 300%";
      return () => { tween.kill(); el.style.backgroundImage = ""; el.style.backgroundSize = ""; };
    },
  };

  function applyEvent(win, el, event, effect, reducedMotion) {
    if (!effect) return;
    const meta = BUILDER_GIMMICKS_BY_ID[effect.id];
    if (!meta) return;
    const opt = { ...meta.defaultOptions, ...effect };
    if (reducedMotion) {
      if (event === "entrance") ENTRANCE_FALLBACK(win, el);
      return; // hover/scroll/continuous fallbacks are simply "off"
    }
    if (event === "entrance" && ENTRANCE[effect.id]) { ENTRANCE[effect.id](win, el, opt); return; }
    if (event === "hover" && HOVER[effect.id]) { const c = HOVER[effect.id](win, el, opt); if (c) el.__bpCleanup.push(c); return; }
    if (event === "scroll" && SCROLL[effect.id]) { const c = SCROLL[effect.id](win, el, opt); if (c) el.__bpCleanup.push(c); return; }
    if (event === "continuous" && CONTINUOUS[effect.id]) { const c = CONTINUOUS[effect.id](win, el, opt); if (c) el.__bpCleanup.push(c); return; }
  }

  function applyObjectEffects(win, doc, objectId, effects, reducedMotion) {
    const el = doc.querySelector(`[data-object-id="${objectId}"]`);
    if (!el) return;
    cleanupEl(el);
    if (reducedMotion) { ENTRANCE_FALLBACK(win, el); return; }
    Object.keys(effects || {}).forEach((event) => applyEvent(win, el, event, effects[event], reducedMotion));
  }

  function applyAll(win, doc, state) {
    Object.keys(state.objects).forEach((id) => {
      applyObjectEffects(win, doc, id, state.objects[id].effects, state.reducedMotion);
    });
  }

  function replayEntrances(win, doc, state) {
    Object.keys(state.objects).forEach((id) => {
      const effects = state.objects[id].effects || {};
      if (!effects.entrance) return;
      const el = doc.querySelector(`[data-object-id="${id}"]`);
      if (!el) return;
      applyEvent(win, el, "entrance", effects.entrance, state.reducedMotion);
    });
  }

  window.Builder.motion = { applyObjectEffects, applyAll, replayEntrances };
})();
