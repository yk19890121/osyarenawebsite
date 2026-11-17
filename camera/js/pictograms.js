/* BLENCI LAB — Camera Work pictograms.
   Each V-code gets a small looping SVG "viewfinder" built only from flat
   pictogram shapes (figure, city blocks, mountains, trees, a car), the
   same visual language as a blockout: no photos, no detail. The scene is
   described as SVG markup plus a GSAP timeline builder.

   window.CameraPictograms.mount(el, code) -> { play(), pause(), kill() }

   Coordinate system: viewBox 0 0 320 180 (16:9). Horizon y = 128, the
   figure's feet stand at y = 152. Colours come from CSS classes (pg-*)
   so the page's design tokens own the palette. */
(() => {
  "use strict";

  const W = 320, H = 180, HZ = 128, FEET = 152;
  let uidSeq = 0;

  /* ---------------- deterministic helpers ---------------- */
  function rng(seed) {
    let a = seed >>> 0;
    return () => {
      a |= 0; a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const r1 = (n) => Math.round(n * 10) / 10;

  /* ---------------- primitives (SVG strings) ---------------- */
  // City blocks between x0..x1. `period` makes the strip repeat exactly,
  // so a layer can scroll by one period and loop without a visible jump.
  function city(x0, x1, seed = 3, { period = 0, base = HZ, cls = "pg-mid", hMin = 16, hMax = 60 } = {}) {
    const rand = rng(seed);
    const blocks = [];
    const span = period || x1 - x0;
    let x = 0;
    while (x < span) {
      const w = 11 + rand() * 18;
      const h = hMin + rand() * (hMax - hMin);
      blocks.push([x, Math.min(w, span - x), h]);
      x += w + 1.5;
    }
    let out = "";
    const start = period ? Math.floor(x0 / period) * period : x0;
    for (let off = start; off < x1; off += span) {
      blocks.forEach(([bx, bw, bh]) => {
        if (bw < 4) return;
        out += `<rect class="${cls}" x="${r1(off + bx)}" y="${r1(base - bh)}" width="${r1(bw)}" height="${r1(bh)}" rx="1"/>`;
      });
      if (!period) break;
    }
    return out;
  }

  function mountains(x0, x1, { period = 160, base = HZ, cls = "pg-far", peak = 44 } = {}) {
    const start = Math.floor(x0 / period) * period;
    let d = `M${start} ${base}`;
    for (let x = start; x < x1; x += period) {
      d += ` L${x + period * 0.3} ${base - peak} L${x + period * 0.5} ${base - peak * 0.55} L${x + period * 0.72} ${base - peak * 0.85} L${x + period} ${base}`;
    }
    return `<path class="${cls}" d="${d} Z"/>`;
  }

  function tree(x, y, s = 1, cls = "pg-near") {
    return `<g class="${cls}" transform="translate(${r1(x)} ${r1(y)}) scale(${s})"><rect x="-1.6" y="-14" width="3.2" height="14" rx="1"/><circle cx="0" cy="-19" r="8"/></g>`;
  }

  function ground(cls = "") {
    return `<g class="pg-groundwrap ${cls}"><rect class="pg-ground" x="-1200" y="${HZ}" width="2800" height="400"/><line class="pg-horizon" x1="-1200" y1="${HZ}" x2="1600" y2="${HZ}"/></g>`;
  }

  function person({ x = 160, y = FEET, s = 1, cls = "", face = false } = {}) {
    return `<g class="pg-person ${cls}" transform="translate(${x} ${y}) scale(${s})">
      <ellipse class="pg-shadow" cx="0" cy="0" rx="11" ry="2.4"/>
      <g class="pg-body">
        <rect class="pg-subj pg-legL" x="-6" y="-14" width="5" height="14" rx="2.5"/>
        <rect class="pg-subj pg-legR" x="1" y="-14" width="5" height="14" rx="2.5"/>
        <rect class="pg-subj pg-armL" x="-11" y="-29" width="4" height="15" rx="2"/>
        <rect class="pg-subj pg-armR" x="7" y="-29" width="4" height="15" rx="2"/>
        <rect class="pg-subj" x="-7" y="-30" width="14" height="18" rx="6"/>
        <circle class="pg-subj" cx="0" cy="-38.5" r="6.5"/>
        ${face ? '<rect class="pg-face" x="-1.6" y="-41.5" width="3.2" height="5" rx="1.6"/>' : ""}
      </g>
    </g>`;
  }

  function car({ x = 160, y = FEET, s = 1, cls = "" } = {}) {
    return `<g class="pg-car ${cls}" transform="translate(${x} ${y}) scale(${s})">
      <ellipse class="pg-shadow" cx="0" cy="0" rx="28" ry="2.6"/>
      <rect class="pg-subj2" x="-14" y="-26" width="27" height="11" rx="4"/>
      <rect class="pg-subj2" x="-26" y="-17" width="52" height="12" rx="4"/>
      <circle class="pg-wheel" cx="-14" cy="-4" r="5"/><circle class="pg-wheel" cx="14" cy="-4" r="5"/>
    </g>`;
  }

  function flower(x, y, s = 1, cls = "") {
    let petals = "";
    for (let i = 0; i < 6; i += 1) {
      const a = (i / 6) * Math.PI * 2;
      petals += `<circle cx="${r1(Math.cos(a) * 6)}" cy="${r1(-24 + Math.sin(a) * 6)}" r="4.4"/>`;
    }
    return `<g class="pg-flower ${cls}" transform="translate(${x} ${y}) scale(${s})"><rect class="pg-stem" x="-1" y="-20" width="2" height="20"/><g class="pg-subj2">${petals}</g><circle class="pg-flower-core" cx="0" cy="-24" r="3.4"/></g>`;
  }

  // A complete backdrop (sun, mountains, city, ground) wide enough to pan.
  function world({ x0 = -500, x1 = 900, seed = 7, sunX = 250, sun = true } = {}) {
    return `<g class="ly-sky">${sun ? `<circle class="pg-sun" cx="${sunX}" cy="42" r="9"/>` : ""}</g>
      <g class="ly-far">${mountains(x0, x1)}</g>
      <g class="ly-mid">${city(x0, x1, seed)}</g>
      ${ground()}`;
  }

  // Self-contained shots for transitions (each paints its own background).
  function shotCity(id, { px = 160, seed = 11, extra = "" } = {}) {
    return `<g class="${id}"><rect class="pg-bg" x="-20" y="-20" width="${W + 40}" height="${H + 40}"/>
      <g>${mountains(-40, 400, { period: 140 })}</g><g>${city(-40, 400, seed)}</g>${ground()}
      ${person({ x: px })}${extra}</g>`;
  }
  function shotStreet(id, { cx = 160, extra = "" } = {}) {
    return `<g class="${id}"><rect class="pg-bg pg-bg-alt" x="-20" y="-20" width="${W + 40}" height="${H + 40}"/>
      <g>${city(-40, 400, 29, { hMin: 40, hMax: 96, cls: "pg-mid" })}</g>${ground()}
      <rect class="pg-road" x="-40" y="${FEET - 6}" width="400" height="3" rx="1.5"/>
      ${car({ x: cx })}${extra}</g>`;
  }

  /* ---------------- shared animation helpers ---------------- */
  function walk(tl, root, { at = 0, duration = 4, step = 0.25, swing = 26 } = {}) {
    const reps = Math.max(1, Math.round(duration / step)) - 1;
    const legL = root.querySelector(".pg-legL"), legR = root.querySelector(".pg-legR");
    const armL = root.querySelector(".pg-armL"), armR = root.querySelector(".pg-armR");
    const body = root.querySelector(".pg-body");
    const o = { transformOrigin: "50% 0%" };
    tl.fromTo(legL, { rotation: swing, ...o }, { rotation: -swing, duration: step, ease: "sine.inOut", repeat: reps, yoyo: true }, at);
    tl.fromTo(legR, { rotation: -swing, ...o }, { rotation: swing, duration: step, ease: "sine.inOut", repeat: reps, yoyo: true }, at);
    tl.fromTo(armL, { rotation: -swing * 0.8, ...o }, { rotation: swing * 0.8, duration: step, ease: "sine.inOut", repeat: reps, yoyo: true }, at);
    tl.fromTo(armR, { rotation: swing * 0.8, ...o }, { rotation: -swing * 0.8, duration: step, ease: "sine.inOut", repeat: reps, yoyo: true }, at);
    tl.fromTo(body, { y: 0 }, { y: -1.4, duration: step / 2, ease: "sine.inOut", repeat: reps * 2 + 1, yoyo: true }, at);
  }
  function armsUp(tl, root, at, up = true, duration = 0.35) {
    const o = { transformOrigin: "50% 8%" };
    tl.to(root.querySelector(".pg-armL"), { rotation: up ? 150 : 0, duration, ease: "power2.out", ...o }, at);
    tl.to(root.querySelector(".pg-armR"), { rotation: up ? -150 : 0, duration, ease: "power2.out", ...o }, at);
  }
  // Tween a plain number and print it to the HUD readout while it moves.
  function counter(tl, ctx, from, to, fmt, vars, at) {
    const o = { v: from };
    tl.fromTo(o, { v: from }, { v: to, ...vars, onUpdate: () => ctx.readout(fmt(o.v)) }, at);
  }
  const hold = (tl, d) => tl.to({}, { duration: d });

  /* ---------------- 24 scenes ---------------- */
  const SCENES = {
    // 01 PAN — every layer slides by the same amount (rotation: no parallax)
    V01: {
      body: () => `<g class="pan">${world({ sunX: 330 })}${person({ x: 228 })}</g>`,
      readout: "-15°",
      build({ q, tl, ctx }) {
        tl.fromTo(q(".pan"), { x: 120 }, { x: -70, duration: 2.6, ease: "sine.inOut" }, 0);
        counter(tl, ctx, -15, 15, (v) => `${v > 0 ? "+" : ""}${Math.round(v)}°`, { duration: 2.6, ease: "sine.inOut" }, 0);
        tl.to({}, { duration: 0.6 });
        tl.to(q(".pan"), { x: 120, duration: 2.6, ease: "sine.inOut" });
        counter(tl, ctx, 15, -15, (v) => `${v > 0 ? "+" : ""}${Math.round(v)}°`, { duration: 2.6, ease: "sine.inOut" }, "<");
        hold(tl, 0.6);
      },
    },

    // 02 TILT — scene slides vertically, revealing a tall tower
    V02: {
      body: () => `<g class="tilt">${world({ sunX: 270 })}
        <g class="pg-mid2"><rect x="138" y="-118" width="44" height="246" rx="2"/><rect x="152" y="-136" width="16" height="20" rx="1"/><rect x="159" y="-160" width="2" height="26"/></g>
        ${person({ x: 160 })}</g>`,
      readout: "-5°",
      build({ q, tl, ctx }) {
        tl.fromTo(q(".tilt"), { y: 0 }, { y: 175, duration: 2.6, ease: "sine.inOut" }, 0.3);
        counter(tl, ctx, -5, 32, (v) => `${v > 0 ? "+" : ""}${Math.round(v)}°`, { duration: 2.6, ease: "sine.inOut" }, 0.3);
        hold(tl, 0.6);
        tl.to(q(".tilt"), { y: 0, duration: 2.6, ease: "sine.inOut" });
        counter(tl, ctx, 32, -5, (v) => `${v > 0 ? "+" : ""}${Math.round(v)}°`, { duration: 2.6, ease: "sine.inOut" }, "<");
        hold(tl, 0.3);
      },
    },

    // 03 DOLLY IN — near things grow faster than far things (parallax)
    V03: {
      body: () => `${world()}<g class="subj">${person({ x: 160 })}</g>
        <g class="near">${tree(40, 175, 2.2)}${tree(282, 178, 2.4)}</g>`,
      readout: "35mm · 6.0m",
      build({ q, tl, ctx }) {
        const o = { svgOrigin: "160 118" };
        const d = { duration: 3, ease: "power1.inOut" };
        tl.fromTo(q(".ly-far"), { scale: 1, ...o }, { scale: 1.08, ...d }, 0);
        tl.fromTo(q(".ly-mid"), { scale: 1, ...o }, { scale: 1.3, ...d }, 0);
        tl.fromTo(q(".pg-groundwrap"), { scale: 1, ...o }, { scale: 1.3, ...d }, 0);
        tl.fromTo(q(".subj"), { scale: 1, ...o }, { scale: 2.3, ...d }, 0);
        tl.fromTo(q(".near"), { scale: 1, ...o }, { scale: 3.4, ...d }, 0);
        counter(tl, ctx, 6, 2, (v) => `35mm · ${v.toFixed(1)}m`, d, 0);
        hold(tl, 0.8);
        tl.set([q(".ly-far"), q(".ly-mid"), q(".pg-groundwrap"), q(".subj"), q(".near")], { scale: 1 });
        tl.set({}, {}, "+=0.25");
      },
    },

    // 04 ZOOM IN — the whole frame magnifies uniformly
    V04: {
      body: () => `<g class="cam">${world()}${tree(48, 160, 1.6)}${tree(276, 163, 1.8)}${person({ x: 160 })}</g>`,
      readout: "24mm",
      build({ q, tl, ctx }) {
        const d = { duration: 3, ease: "power1.inOut" };
        tl.fromTo(q(".cam"), { scale: 1, svgOrigin: "160 128" }, { scale: 2.6, ...d }, 0.2);
        counter(tl, ctx, 24, 85, (v) => `${Math.round(v)}mm`, d, 0.2);
        hold(tl, 0.8);
        tl.to(q(".cam"), { scale: 1, duration: 1.2, ease: "power2.inOut" });
        counter(tl, ctx, 85, 24, (v) => `${Math.round(v)}mm`, { duration: 1.2, ease: "power2.inOut" }, "<");
        hold(tl, 0.3);
      },
    },

    // 05 TRACKING — subject stays centred and walks; layers stream past
    V05: {
      body: () => `<g class="ly-far">${mountains(-160, 640, { period: 160 })}</g>
        <g class="ly-mid">${city(-320, 960, 5, { period: 320 })}</g>${ground()}
        ${person({ x: 160 })}
        <g class="ly-near">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => `<rect class="pg-near" x="${i * 80 - 6}" y="70" width="8" height="120" rx="2"/>`).join("")}</g>`,
      readout: "→ 1.4m/s",
      build({ q, tl }) {
        const d = { duration: 4, ease: "none" };
        tl.fromTo(q(".ly-far"), { x: 0 }, { x: -160, ...d }, 0);
        tl.fromTo(q(".ly-mid"), { x: 0 }, { x: -320, ...d }, 0);
        tl.fromTo(q(".ly-near"), { x: 0 }, { x: -320, ...d }, 0);
        walk(tl, q(".pg-person"), { duration: 4, step: 0.25 });
      },
    },

    // 06 ORBIT — camera circles; subject turns relative to us; bg swings
    V06: {
      body: () => `<g class="ly-far">${mountains(-500, 900)}</g><g class="ly-mid">${city(-500, 900, 9)}</g>${ground()}
        <ellipse class="pg-orbit" cx="160" cy="${FEET}" rx="34" ry="7"/>
        ${person({ x: 160, face: true })}
        <circle class="pg-orbit-dot" cx="160" cy="${FEET + 7}" r="2.6"/>`,
      readout: "0°",
      build({ q, tl, ctx }) {
        const face = q(".pg-face"), body = q(".pg-person .pg-body"), dot = q(".pg-orbit-dot");
        const o = { a: -70 };
        const apply = () => {
          const rad = (o.a * Math.PI) / 180;
          gsap.set(q(".ly-far"), { x: -o.a * 2.2 });
          gsap.set(q(".ly-mid"), { x: -o.a * 1.6 });
          gsap.set(face, { x: Math.sin(rad) * -5, opacity: Math.cos(rad) > 0 ? 1 : 0.15 });
          gsap.set(body, { scaleX: 0.78 + Math.abs(Math.cos(rad)) * 0.22, transformOrigin: "50% 100%" });
          gsap.set(dot, { attr: { cx: 160 + Math.sin(rad) * 34, cy: FEET + Math.cos(rad) * 7 } });
          ctx.readout(`${o.a > 0 ? "+" : ""}${Math.round(o.a)}°`);
        };
        tl.fromTo(o, { a: -70 }, { a: 70, duration: 3.2, ease: "sine.inOut", onUpdate: apply }, 0);
        hold(tl, 0.4);
        tl.to(o, { a: -70, duration: 3.2, ease: "sine.inOut", onUpdate: apply });
        hold(tl, 0.4);
      },
    },

    // 07 CRANE UP — camera rises and looks down: horizon climbs, subject shrinks
    V07: {
      body: () => `${world()}${tree(70, 158, 1.2, "pg-mid2")}${tree(250, 160, 1.3, "pg-mid2")}${person({ x: 160 })}`,
      readout: "H 1.6m",
      build({ q, tl, ctx }) {
        const d = { duration: 3.2, ease: "power2.inOut" };
        tl.fromTo(q(".ly-sky"), { y: 0 }, { y: -90, ...d }, 0.3);
        tl.fromTo(q(".ly-far"), { y: 0 }, { y: -80, ...d }, 0.3);
        tl.fromTo(q(".ly-mid"), { y: 0, scaleY: 1, svgOrigin: "160 128" }, { y: -86, scaleY: 0.7, ...d }, 0.3);
        tl.fromTo(q(".pg-groundwrap"), { y: 0 }, { y: -86, ...d }, 0.3);
        tl.fromTo(q(".pg-mid2"), { y: 0, scale: 1, transformOrigin: "50% 100%" }, { y: -40, scale: 0.6, ...d }, 0.3);
        tl.fromTo(q(".pg-person"), { y: FEET, scale: 1, transformOrigin: "50% 100%" }, { y: FEET - 30, scale: 0.55, ...d }, 0.3);
        counter(tl, ctx, 1.6, 8, (v) => `H ${v.toFixed(1)}m`, d, 0.3);
        hold(tl, 0.8);
        tl.to([q(".ly-sky"), q(".ly-far"), q(".ly-mid"), q(".pg-groundwrap")], { y: 0, scaleY: 1, duration: 1.2, ease: "power2.inOut" });
        tl.to(q(".pg-mid2"), { y: 0, scale: 1, duration: 1.2, ease: "power2.inOut" }, "<");
        tl.to(q(".pg-person"), { y: FEET, scale: 1, duration: 1.2, ease: "power2.inOut" }, "<");
        counter(tl, ctx, 8, 1.6, (v) => `H ${v.toFixed(1)}m`, { duration: 1.2, ease: "power2.inOut" }, "<");
        hold(tl, 0.3);
      },
    },

    // 08 DOLLY ZOOM — subject constant, background stretches
    V08: {
      body: () => `${world({ sunX: 230 })}
        <line class="pg-guide" x1="128" y1="${FEET - 45}" x2="192" y2="${FEET - 45}"/><line class="pg-guide" x1="128" y1="${FEET}" x2="192" y2="${FEET}"/>
        ${person({ x: 160 })}`,
      readout: "24mm",
      build({ q, tl, ctx }) {
        const d = { duration: 2.8, ease: "sine.inOut" };
        const o = { svgOrigin: "160 128" };
        tl.fromTo(q(".ly-far"), { scale: 1, ...o }, { scale: 2.1, ...d }, 0.2);
        tl.fromTo(q(".ly-mid"), { scale: 1, ...o }, { scale: 1.7, ...d }, 0.2);
        tl.fromTo(q(".ly-sky"), { scale: 1, ...o }, { scale: 2.2, ...d }, 0.2);
        counter(tl, ctx, 24, 72, (v) => `${Math.round(v)}mm`, d, 0.2);
        hold(tl, 0.5);
        tl.to([q(".ly-far"), q(".ly-mid"), q(".ly-sky")], { scale: 1, ...d });
        counter(tl, ctx, 72, 24, (v) => `${Math.round(v)}mm`, d, "<");
        hold(tl, 0.3);
      },
    },

    // 09 RACK FOCUS — blur moves from background to foreground
    V09: {
      body: (u) => `<defs><filter id="${u}-bf" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur class="blur-fg" stdDeviation="0"/></filter>
          <filter id="${u}-bb" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur class="blur-bg" stdDeviation="3.5"/></filter></defs>
        <g filter="url(#${u}-bb)">${world()}${person({ x: 214, s: 0.85 })}</g>
        <g filter="url(#${u}-bf)">${flower(78, 182, 2.4)}</g>
        <g class="pg-focus"><path d="M-14 -10 V-14 H-10 M10 -14 H14 V-10 M14 10 V14 H10 M-10 14 H-14 V10"/></g>`,
      readout: "FOCUS 0.5m",
      build({ q, tl, ctx }) {
        const focus = q(".pg-focus");
        gsap.set(focus, { x: 78, y: 124, scale: 1.6 });
        hold(tl, 0.8);
        tl.to(q(".blur-fg"), { attr: { stdDeviation: 5 }, duration: 1.4, ease: "power2.inOut" });
        tl.to(q(".blur-bg"), { attr: { stdDeviation: 0 }, duration: 1.4, ease: "power2.inOut" }, "<");
        tl.to(focus, { x: 214, y: 128, scale: 1.25, duration: 1.4, ease: "power2.inOut" }, "<");
        counter(tl, ctx, 0.5, 4, (v) => `FOCUS ${v.toFixed(1)}m`, { duration: 1.4, ease: "power2.inOut" }, "<");
        hold(tl, 1.2);
        tl.to(q(".blur-fg"), { attr: { stdDeviation: 0 }, duration: 1.4, ease: "power2.inOut" });
        tl.to(q(".blur-bg"), { attr: { stdDeviation: 3.5 }, duration: 1.4, ease: "power2.inOut" }, "<");
        tl.to(focus, { x: 78, y: 124, scale: 1.6, duration: 1.4, ease: "power2.inOut" }, "<");
        counter(tl, ctx, 4, 0.5, (v) => `FOCUS ${v.toFixed(1)}m`, { duration: 1.4, ease: "power2.inOut" }, "<");
        hold(tl, 0.4);
      },
    },

    // 10 HANDHELD — organic micro-shake of the whole frame
    V10: {
      body: () => `<g class="cam">${world()}${person({ x: 160 })}</g>`,
      readout: "HANDHELD",
      build({ q, tl }) {
        const cam = q(".cam");
        gsap.set(cam, { scale: 1.08, svgOrigin: "160 90" });
        const rand = rng(42);
        for (let i = 0; i < 22; i += 1) {
          const last = i === 21;
          tl.to(cam, {
            x: last ? 0 : (rand() - 0.5) * 6, y: last ? 0 : (rand() - 0.5) * 4.5, rotation: last ? 0 : (rand() - 0.5) * 1.6,
            duration: 0.16 + rand() * 0.14, ease: "sine.inOut",
          });
        }
      },
    },

    // 11 FPV — rushing forward, banking, trees whipping past
    V11: {
      body: () => `<g class="cam">
        <rect class="pg-bg" x="-200" y="-200" width="720" height="${HZ + 200 - 95}"/>
        <g transform="translate(0 -33)">${mountains(-300, 700, { period: 120, peak: 30 })}</g>
        <rect class="pg-ground" x="-300" y="95" width="920" height="300"/>
        <line class="pg-horizon" x1="-300" y1="95" x2="620" y2="95"/>
        <path class="pg-roadedge" d="M150 95 L-120 300 M170 95 L440 300"/>
        <line class="pg-lane" x1="160" y1="95" x2="160" y2="300"/>
        <g class="trees">${Array.from({ length: 10 }, () => tree(0, 0, 1, "pg-near fpv-tree")).join("")}</g>
      </g>`,
      readout: "120km/h",
      build({ q, qa, tl }) {
        const cam = q(".cam"), lane = q(".pg-lane");
        const trees = qa(".fpv-tree");
        const o = { t: 0 };
        const place = () => {
          trees.forEach((el, i) => {
            const ph = (o.t * 2 + i / trees.length) % 1;
            const e = Math.pow(ph, 1.9);
            const side = i % 2 ? 1 : -1;
            el.setAttribute("transform", `translate(${r1(160 + side * (14 + e * 250))} ${r1(97 + e * 120)}) scale(${(0.12 + e * 4.2).toFixed(3)})`);
            el.style.opacity = Math.min(1, ph * 5);
          });
        };
        tl.fromTo(o, { t: 0 }, { t: 1, duration: 4, ease: "none", onUpdate: place }, 0);
        tl.fromTo(lane, { attr: { "stroke-dashoffset": 0 } }, { attr: { "stroke-dashoffset": -240 }, duration: 4, ease: "none" }, 0);
        tl.fromTo(cam, { rotation: 0, scale: 1.12, svgOrigin: "160 95" }, { rotation: -11, duration: 1.2, ease: "sine.inOut" }, 0);
        tl.to(cam, { rotation: 9, duration: 1.6, ease: "sine.inOut" }, 1.2);
        tl.to(cam, { rotation: 0, duration: 1.2, ease: "sine.inOut" }, 2.8);
      },
    },

    // 12 DUTCH ANGLE — the world rolls, the HUD level line stays put
    V12: {
      body: () => `<g class="cam">${world({ x0: -700, x1: 1000 })}${person({ x: 160 })}</g>
        <line class="pg-level" x1="120" y1="90" x2="200" y2="90"/>`,
      readout: "ROLL 0°",
      build({ q, tl, ctx }) {
        const cam = q(".cam");
        gsap.set(cam, { svgOrigin: "160 110", scale: 1.25 });
        hold(tl, 0.6);
        tl.to(cam, { rotation: -15, duration: 1.4, ease: "power2.inOut" });
        counter(tl, ctx, 0, 15, (v) => `ROLL ${Math.round(v)}°`, { duration: 1.4, ease: "power2.inOut" }, "<");
        hold(tl, 1.6);
        tl.to(cam, { rotation: 0, duration: 1.4, ease: "power2.inOut" });
        counter(tl, ctx, 15, 0, (v) => `ROLL ${Math.round(v)}°`, { duration: 1.4, ease: "power2.inOut" }, "<");
        hold(tl, 0.4);
      },
    },

    // 13 SLOW MOTION — a jump stretched over seconds
    V13: {
      body: () => `${world()}${person({ x: 160 })}<g class="dust">${[0, 1, 2, 3, 4, 5].map((i) => `<circle class="pg-near" cx="${148 + i * 5}" cy="${FEET}" r="1.6"/>`).join("")}</g>`,
      readout: "120fps ×0.25",
      build({ q, qa, tl }) {
        const p = q(".pg-person"), body = q(".pg-person .pg-body");
        tl.to(body, { scaleY: 0.86, transformOrigin: "50% 100%", duration: 0.5, ease: "sine.inOut" }, 0);
        tl.to(body, { scaleY: 1, y: -46, duration: 2, ease: "sine.out" }, 0.5);
        armsUp(tl, p, 0.5, true, 1.4);
        tl.to(body, { y: 0, duration: 1.8, ease: "sine.in" }, 2.5);
        armsUp(tl, p, 3.2, false, 1);
        const dust = qa(".dust circle");
        tl.fromTo(dust, { opacity: 0.9, x: 0, y: 0 }, { opacity: 0, x: (i) => (i - 2.5) * 6, y: -6, duration: 1.4, ease: "sine.out", stagger: 0.02 }, 4.3);
        tl.set(dust, { opacity: 0 }, 0);
      },
    },

    // 14 SPEED RAMP — fast → slow → fast with a speed curve
    V14: {
      body: () => `${world({ sunX: 300 })}${person({ x: -20 })}`,
      hud: `<path class="pg-graph" d="M16 151 L34 151 C42 151 44 165 52 165 L66 165 C74 165 76 151 84 151 L98 151"/><circle class="pg-graph-dot" cx="16" cy="151" r="2.4"/>`,
      readout: "×2.0",
      build({ q, tl, ctx }) {
        const p = q(".pg-person"), path = q(".pg-graph"), dot = q(".pg-graph-dot");
        const len = path.getTotalLength();
        const prog = { v: 0 };
        const segs = [[-20, 110, 0.55, 3.2], [110, 210, 2.4, 0.4], [210, 345, 0.55, 3.2]];
        let at = 0;
        segs.forEach(([x0, x1, d, rate], i) => {
          tl.fromTo(p, { x: x0 }, { x: x1, duration: d, ease: "none" }, at);
          walk(tl, p, { at, duration: d, step: 0.25 / rate, swing: 30 });
          tl.call(() => ctx.readout(i === 1 ? "×0.3" : "×2.0"), null, at);
          at += d;
        });
        tl.fromTo(prog, { v: 0 }, {
          v: 1, duration: at, ease: "none",
          onUpdate: () => { const pt = path.getPointAtLength(prog.v * len); dot.setAttribute("cx", pt.x); dot.setAttribute("cy", pt.y); },
        }, 0);
        hold(tl, 0.5);
      },
    },

    // 15 TIME-LAPSE — sun arcs, shadow sweeps, clouds and people streak
    V15: {
      body: () => `<rect class="pg-dusk" x="0" y="0" width="${W}" height="${HZ}"/>
        <circle class="pg-sun tl-sun" cx="0" cy="0" r="9"/>
        <g class="clouds">${[0, 1, 2].map((i) => `<rect class="pg-cloud" x="${i * 120}" y="${26 + i * 13}" width="46" height="8" rx="4"/>`).join("")}</g>
        <g class="ly-far">${mountains(-200, 600)}</g><g class="ly-mid">${city(-200, 600, 13)}</g>${ground()}
        <rect class="pg-castshadow" x="160" y="${FEET - 1.5}" width="34" height="3" rx="1.5"/>
        ${person({ x: 160 })}
        <g class="crowd">${[0, 1, 2, 3, 4].map((i) => `<rect class="pg-mid2 tl-walker" x="0" y="${FEET - 9 + (i % 2) * 8}" width="3" height="8" rx="1.5"/>`).join("")}</g>`,
      readout: "06:00",
      build({ q, qa, tl, ctx }) {
        const sun = q(".tl-sun"), sh = q(".pg-castshadow"), dusk = q(".pg-dusk");
        const walkers = qa(".tl-walker"), clouds = qa(".pg-cloud");
        const o = { t: 0 };
        const apply = () => {
          const a = Math.PI * (1 - o.t);
          sun.setAttribute("cx", r1(160 + Math.cos(a) * 150));
          sun.setAttribute("cy", r1(HZ - Math.sin(a) * 105));
          const len = 8 + Math.abs(Math.cos(a)) * 42;
          gsap.set(sh, { attr: { width: len, x: Math.cos(a) > 0 ? 160 - len : 160 } });
          dusk.style.opacity = (0.12 * (1 - Math.sin(a))).toFixed(3);
          walkers.forEach((w, i) => w.setAttribute("x", r1(((o.t * 6 + i / walkers.length) % 1) * 360 - 20)));
          clouds.forEach((c, i) => c.setAttribute("x", r1(((o.t * 2.5 + i / clouds.length) % 1) * 400 - 60)));
          const mins = 360 + o.t * 720;
          ctx.readout(`${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(Math.floor(mins % 60)).padStart(2, "0")}`);
        };
        tl.fromTo(o, { t: 0 }, { t: 1, duration: 4.4, ease: "none", onUpdate: apply }, 0);
        hold(tl, 0.4);
      },
    },

    // 16 FREEZE FRAME — the jump stops dead at its peak
    V16: {
      body: () => `<g class="clouds">${[0, 1].map((i) => `<rect class="pg-cloud" x="${40 + i * 150}" y="${30 + i * 10}" width="46" height="8" rx="4"/>`).join("")}</g>
        ${world({ sun: false })}${person({ x: 160 })}`,
      hud: `<rect class="pg-freeze" x="4" y="4" width="312" height="172" rx="3"/><g class="pg-freeze-badge"><rect x="139" y="156" width="42" height="13" rx="3"/><rect class="pg-freeze-ico" x="146" y="159.5" width="2.6" height="6"/><rect class="pg-freeze-ico" x="150.6" y="159.5" width="2.6" height="6"/><text x="157" y="165.6">STOP</text></g>`,
      readout: "PLAY",
      build({ q, qa, tl, ctx }) {
        const p = q(".pg-person"), body = q(".pg-person .pg-body"), freeze = [q(".pg-freeze"), q(".pg-freeze-badge")];
        const clouds = qa(".pg-cloud");
        gsap.set(freeze, { opacity: 0 });
        tl.call(() => ctx.readout("PLAY"), null, 0);
        tl.to(clouds, { x: "+=14", duration: 0.9, ease: "none" }, 0);
        tl.to(body, { scaleY: 0.86, transformOrigin: "50% 100%", duration: 0.25, ease: "sine.inOut" }, 0.1);
        tl.to(body, { scaleY: 1, y: -46, duration: 0.55, ease: "power2.out" }, 0.35);
        armsUp(tl, p, 0.35, true, 0.4);
        tl.set(freeze, { opacity: 1 }, 0.9);
        tl.call(() => ctx.readout("FREEZE"), null, 0.9);
        tl.set(freeze, { opacity: 0 }, 2.3);
        tl.call(() => ctx.readout("PLAY"), null, 2.3);
        tl.to(clouds, { x: "+=14", duration: 0.9, ease: "none" }, 2.3);
        tl.to(body, { y: 0, duration: 0.5, ease: "power2.in" }, 2.3);
        armsUp(tl, p, 2.5, false, 0.3);
        tl.set(clouds, { x: 0 }, 3.4);
        hold(tl, 0.5);
      },
    },

    // 17 JUMP CUT — same framing, the subject jumps between states
    V17: {
      body: () => `${world({ sunX: 270 })}${person({ x: 110 })}`,
      readout: "10:02",
      build({ q, tl, ctx }) {
        const p = q(".pg-person"), body = q(".pg-person .pg-body");
        const o50 = { transformOrigin: "50% 8%" };
        const states = [
          { at: 0, x: 110, arms: 0, rot: 0, tc: "10:02" },
          { at: 1.1, x: 196, arms: 150, rot: 0, tc: "10:17" },
          { at: 2.2, x: 150, arms: 40, rot: 0, tc: "10:41" },
          { at: 3.3, x: 226, arms: 0, rot: -8, tc: "11:05" },
        ];
        states.forEach((s) => {
          tl.set(p, { x: s.x }, s.at);
          tl.set(p.querySelector(".pg-armL"), { rotation: s.arms, ...o50 }, s.at);
          tl.set(p.querySelector(".pg-armR"), { rotation: -s.arms, ...o50 }, s.at);
          tl.set(body, { rotation: s.rot, transformOrigin: "50% 100%" }, s.at);
          tl.call(() => ctx.readout(s.tc), null, s.at);
        });
        tl.set({}, {}, 4.4);
      },
    },

    // 18 MATCH CUT — a tossed ball becomes the sun
    V18: {
      body: () => `${shotCity("shotA", { px: 130 })}
        <circle class="pg-sun ball" cx="142" cy="120" r="7"/>
        <g class="shotB"><rect class="pg-bg pg-bg-alt" x="-20" y="-20" width="360" height="220"/>
          <g>${mountains(-40, 400, { period: 200, peak: 60 })}</g>${ground()}
          ${tree(60, 150, 1.2, "pg-mid2")}${tree(270, 152, 1.4, "pg-mid2")}
          <circle class="pg-sun bsun" cx="196" cy="46" r="7"/></g>`,
      readout: "SHOT 1",
      build({ q, tl, ctx }) {
        const A = q(".shotA"), B = q(".shotB"), ball = q(".ball"), sun = q(".bsun"), p = q(".shotA .pg-person");
        tl.set(B, { opacity: 0 }, 0);
        tl.set(ball, { opacity: 1, attr: { cx: 142, cy: 120 } }, 0);
        tl.set([A], { opacity: 1 }, 0);
        tl.call(() => ctx.readout("SHOT 1"), null, 0);
        armsUp(tl, p, 0.2, true, 0.3);
        tl.to(ball, { attr: { cx: 196, cy: 46 }, duration: 1.1, ease: "power2.out" }, 0.3);
        tl.set([A, ball], { opacity: 0 }, 1.4);
        tl.set(B, { opacity: 1 }, 1.4);
        tl.set(sun, { attr: { cx: 196, cy: 46, r: 7 } }, 1.4);
        tl.call(() => ctx.readout("SHOT 2"), null, 1.4);
        tl.to(sun, { attr: { cy: 40, r: 11 }, duration: 2, ease: "sine.out" }, 1.4);
        armsUp(tl, p, 3.4, false, 0.01);
        tl.set({}, {}, 3.8);
      },
    },

    // 19 WHIP PAN — A smears sideways into B
    V19: {
      body: (u) => `<defs><filter id="${u}-mb" x="-30%" y="-10%" width="160%" height="120%"><feGaussianBlur class="mb" stdDeviation="0 0"/></filter></defs>
        <g filter="url(#${u}-mb)"><g class="strip">${shotCity("shotA")}<g transform="translate(360 0)">${shotStreet("shotB")}</g></g></g>`,
      readout: "SHOT A",
      build({ q, tl, ctx }) {
        const strip = q(".strip"), mb = q(".mb");
        hold(tl, 1.1);
        tl.to(strip, { x: -360, duration: 0.36, ease: "power3.inOut" });
        tl.to(mb, { attr: { stdDeviation: "18 0" }, duration: 0.18, ease: "power2.in" }, "<");
        tl.to(mb, { attr: { stdDeviation: "0 0" }, duration: 0.18, ease: "power2.out" }, "<0.18");
        tl.call(() => ctx.readout("SHOT B"), null, "<");
        hold(tl, 1.3);
        tl.to(strip, { x: 0, duration: 0.36, ease: "power3.inOut" });
        tl.to(mb, { attr: { stdDeviation: "18 0" }, duration: 0.18, ease: "power2.in" }, "<");
        tl.to(mb, { attr: { stdDeviation: "0 0" }, duration: 0.18, ease: "power2.out" }, "<0.18");
        tl.call(() => ctx.readout("SHOT A"), null, "<");
        hold(tl, 0.2);
      },
    },

    // 20 CROSS DISSOLVE — the two shots overlap
    V20: {
      body: () => `${shotCity("shotA")}${shotStreet("shotB")}`,
      readout: "A",
      build({ q, tl, ctx }) {
        const B = q(".shotB");
        tl.set(B, { opacity: 0 }, 0);
        tl.call(() => ctx.readout("A"), null, 0);
        tl.to(B, { opacity: 1, duration: 1.4, ease: "sine.inOut" }, 1);
        tl.call(() => ctx.readout("A + B"), null, 1.2);
        tl.call(() => ctx.readout("B"), null, 2.4);
        tl.to(B, { opacity: 0, duration: 1.4, ease: "sine.inOut" }, 3.6);
        tl.call(() => ctx.readout("A + B"), null, 3.8);
        tl.call(() => ctx.readout("A"), null, 5);
        tl.set({}, {}, 5.4);
      },
    },

    // 21 WIPE — a hard edge sweeps across
    V21: {
      body: (u) => `<defs><clipPath id="${u}-wc"><rect class="wclip" x="0" y="0" width="0" height="${H}"/></clipPath></defs>
        ${shotCity("shotA")}<g clip-path="url(#${u}-wc)">${shotStreet("shotB")}</g>
        <line class="pg-wipe" x1="0" y1="0" x2="0" y2="${H}"/>`,
      readout: "A",
      build({ q, tl, ctx }) {
        const clip = q(".wclip"), edge = q(".pg-wipe");
        tl.set(clip, { attr: { x: 0, width: 0 } }, 0);
        tl.set(edge, { opacity: 0, x: 0 }, 0);
        tl.call(() => ctx.readout("A"), null, 0);
        tl.set(edge, { opacity: 1 }, 1);
        tl.to(clip, { attr: { width: W }, duration: 0.9, ease: "power2.inOut" }, 1);
        tl.to(edge, { x: W, duration: 0.9, ease: "power2.inOut" }, 1);
        tl.call(() => ctx.readout("B"), null, 1.5);
        tl.set(edge, { opacity: 0, x: 0 }, 1.9);
        tl.set(edge, { opacity: 1 }, 3.1);
        tl.to(clip, { attr: { x: W, width: 0 }, duration: 0.9, ease: "power2.inOut" }, 3.1);
        tl.to(edge, { x: W, duration: 0.9, ease: "power2.inOut" }, 3.1);
        tl.call(() => ctx.readout("A"), null, 3.6);
        tl.set(edge, { opacity: 0 }, 4);
        tl.set({}, {}, 4.3);
      },
    },

    // 22 SMASH CUT — calm shot, then an instant loud one
    V22: {
      body: () => `<g class="calm"><rect class="pg-bg pg-bg-dim" x="-20" y="-20" width="360" height="220"/>
          <g>${mountains(-40, 400, { period: 180, peak: 36 })}</g>${ground()}
          <g transform="translate(160 ${FEET - 4}) rotate(-90)">${person({ x: 0, y: 0 })}</g>
          <g class="zz"><text class="pg-z" x="186" y="122">z</text><text class="pg-z" x="194" y="110">z</text><text class="pg-z" x="203" y="97">Z</text></g></g>
        <g class="loud"><rect class="pg-bg pg-bg-alt" x="-20" y="-20" width="360" height="220"/>
          <g class="burst">${Array.from({ length: 18 }, (_, i) => { const a = (i / 18) * Math.PI * 2; return `<line class="pg-burst" x1="${r1(160 + Math.cos(a) * 70)}" y1="${r1(100 + Math.sin(a) * 70)}" x2="${r1(160 + Math.cos(a) * 220)}" y2="${r1(100 + Math.sin(a) * 220)}"/>`; }).join("")}</g>
          <g class="big">${person({ x: 160, y: 196, s: 2.9 })}</g></g>`,
      hud: `<g class="pg-meter">${[0, 1, 2, 3, 4, 5, 6].map((i) => `<rect class="mbar" x="${16 + i * 5}" y="150" width="3" height="18" rx="1"/>`).join("")}</g>`,
      readout: "♪ 静か",
      build({ q, qa, tl, ctx }) {
        const calm = q(".calm"), loud = q(".loud"), big = q(".big .pg-person"), bars = qa(".mbar"), zz = qa(".pg-z");
        const level = (n) => bars.forEach((b, i) => gsap.set(b, { scaleY: i < n ? 1 : 0.18, transformOrigin: "50% 100%", opacity: i < n ? 1 : 0.35 }));
        tl.call(() => { level(1); ctx.readout("♪ 静か"); }, null, 0);
        tl.set(loud, { opacity: 0 }, 0);
        tl.set(calm, { opacity: 1 }, 0);
        tl.fromTo(zz, { opacity: 0, y: 4 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.35, ease: "sine.out" }, 0.1);
        tl.set(calm, { opacity: 0 }, 1.9);
        tl.set(loud, { opacity: 1 }, 1.9);
        tl.call(() => { level(7); ctx.readout("♪ 大音量"); }, null, 1.9);
        armsUp(tl, big, 1.9, true, 0.01);
        tl.fromTo(q(".burst"), { scale: 0.9, svgOrigin: "160 100" }, { scale: 1.08, duration: 0.12, repeat: 7, yoyo: true, ease: "none" }, 1.9);
        tl.fromTo(loud, { x: -3 }, { x: 3, duration: 0.06, repeat: 13, yoyo: true, ease: "none" }, 1.9);
        tl.set(loud, { x: 0 }, 2.75);
        tl.set({}, {}, 3.4);
        armsUp(tl, big, 3.4, false, 0.01);
      },
    },
  };

  // 23 J-CUT / 24 L-CUT — picture on top, a two-track timeline below
  function splitCut(kind) {
    const vCut = 150;
    const aCut = kind === "J" ? 112 : 192;
    return {
      body: (u) => `<defs><clipPath id="${u}-pic"><rect x="67" y="6" width="186" height="104.4"/></clipPath></defs>
        <g clip-path="url(#${u}-pic)"><g class="pic"><g class="picA">${shotCity("sA")}</g><g class="picB">${shotStreet("sB")}</g></g></g>
        <rect class="pg-picframe" x="67" y="6" width="186" height="104.4" rx="1"/>
        <g class="tlpanel"><rect class="pg-panel" x="0" y="118" width="${W}" height="62"/>
          <text class="pg-track" x="12" y="138">映像</text><text class="pg-track" x="12" y="160">音声</text>
          <rect class="pg-clip clipVA" x="40" y="128" width="${vCut - 41}" height="13" rx="2"/><rect class="pg-clip pg-clipB clipVB" x="${vCut}" y="128" width="${296 - vCut}" height="13" rx="2"/>
          <rect class="pg-clip clipAA" x="40" y="150" width="${aCut - 41}" height="13" rx="2"/><rect class="pg-clip pg-clipB clipAB" x="${aCut}" y="150" width="${296 - aCut}" height="13" rx="2"/>
          <text class="pg-cliplabel" x="46" y="137.6">A</text><text class="pg-cliplabel" x="${vCut + 6}" y="137.6">B</text>
          <text class="pg-cliplabel" x="46" y="159.6">♪ A</text><text class="pg-cliplabel" x="${aCut + 6}" y="159.6">♪ B</text>
          <line class="pg-playhead" x1="40" y1="122" x2="40" y2="174"/></g>`,
      bodyClass: "is-split",
      readout: "♪ A",
      build({ q, tl, ctx }) {
        const ph = q(".pg-playhead"), A = q(".picA"), B = q(".picB");
        gsap.set(q(".pic"), { scale: 0.58, x: 67, y: 6, svgOrigin: "0 0" });
        const clips = { VA: q(".clipVA"), VB: q(".clipVB"), AA: q(".clipAA"), AB: q(".clipAB") };
        const o = { x: 40 };
        const apply = () => {
          ph.setAttribute("x1", r1(o.x)); ph.setAttribute("x2", r1(o.x));
          const showB = o.x >= vCut, hearB = o.x >= aCut;
          A.style.opacity = showB ? 0 : 1; B.style.opacity = showB ? 1 : 0;
          clips.VA.classList.toggle("on", !showB); clips.VB.classList.toggle("on", showB);
          clips.AA.classList.toggle("on", !hearB); clips.AB.classList.toggle("on", hearB);
          ctx.readout(hearB ? "♪ B" : "♪ A");
        };
        tl.fromTo(o, { x: 40 }, { x: 296, duration: 4.2, ease: "none", onUpdate: apply }, 0);
        hold(tl, 0.6);
      },
    };
  }
  SCENES.V23 = splitCut("J");
  SCENES.V24 = splitCut("L");

  /* ---------------- mount ---------------- */
  const HUD = (readout, extra = "") => `<g class="pg-hud">
      <path class="pg-corners" d="M9 21 V9 H21 M299 9 H311 V21 M311 159 V171 H299 M21 171 H9 V159"/>
      <circle class="pg-rec" cx="17" cy="16.5" r="2.4"/><text class="pg-hudtext" x="23" y="19">REC</text>
      <text class="pg-hudtext pg-readout" x="305" y="19" text-anchor="end">${readout || ""}</text>
      ${extra}
    </g>`;

  function mount(el, code, { autoplay = true } = {}) {
    const scene = SCENES[code];
    if (!scene || typeof gsap === "undefined") return null;
    uidSeq += 1;
    const u = `pg${uidSeq}`;
    el.innerHTML = `<svg class="pg-svg ${scene.bodyClass || ""}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${code} pictogram">
      <defs><clipPath id="${u}-frame"><rect x="0" y="0" width="${W}" height="${H}"/></clipPath></defs>
      <rect class="pg-bg" x="0" y="0" width="${W}" height="${H}"/>
      <g clip-path="url(#${u}-frame)">${scene.body(u)}</g>
      ${HUD(scene.readout, scene.hud)}
    </svg>`;
    const svg = el.firstElementChild;
    const readoutEl = svg.querySelector(".pg-readout");
    const ctx = { readout: (t) => { if (readoutEl.textContent !== t) readoutEl.textContent = t; } };
    const q = (s) => svg.querySelector(s);
    const qa = (s) => [...svg.querySelectorAll(s)];
    const tl = gsap.timeline({ repeat: -1, paused: true });
    scene.build({ q, qa, tl, ctx, svg });
    tl.progress(scene.poster ?? 0.35, false).pause();
    if (autoplay) tl.restart();
    return {
      tl,
      play() { if (tl.paused()) tl.play(); },
      pause() { tl.pause(); },
      restart() { tl.restart(); },
      kill() { tl.kill(); el.innerHTML = ""; },
    };
  }

  window.CameraPictograms = { mount, codes: Object.keys(SCENES) };
})();
