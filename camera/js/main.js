/* BLENCI LAB — Camera Work Catalogue */
(() => {
  "use strict";

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const CATS = window.CAMERA_WORK_CATEGORIES || [];
  const WORKS = window.CAMERA_WORKS || [];
  const LAYER_LABEL = { camera: "CAMERA", lens: "LENS", time: "TIME", edit: "EDIT" };
  // Same SCROLL COLOR MORPH idea as fonts/: one muted tone per category.
  const CAT_COLORS = { move: "#1d1712", time: "#121b1e", transition: "#1b1420" };

  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

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

  /* ---------------- build cards ---------------- */
  function buildGroups() {
    const root = $("#cw-groups");
    const tabs = $("#cw-tabs");
    root.innerHTML = CATS.map((cat, ci) => {
      const items = WORKS.filter((w) => w.category === cat.id);
      const range = items.length ? `${items[0].displayCode} – ${items[items.length - 1].displayCode}` : "";
      return `<section class="cw-group" id="cat-${cat.id}" data-color="${CAT_COLORS[cat.id] || ""}">
        <div class="cw-group-head">
          <h2 class="cw-group-title">${String(ci + 1).padStart(2, "0")} ${esc(cat.label)}<span>${esc(cat.labelJa)}</span></h2>
          <span class="cw-group-range">${range} · ${esc(cat.description)}</span>
        </div>
        <div class="cw-grid">${items.map(card).join("")}</div>
      </section>`;
    }).join("");
    tabs.innerHTML = `<a class="cw-tab active" href="#cw-groups" data-cat="all"><b>ALL</b>${WORKS.length}</a>` +
      CATS.map((cat, ci) => `<a class="cw-tab" href="#cat-${cat.id}" data-cat="${cat.id}"><b>${String(ci + 1).padStart(2, "0")}</b>${esc(cat.label)}</a>`).join("");
  }

  function card(w) {
    return `<button type="button" class="cw-card" data-code="${w.displayCode}" aria-label="${w.displayCode} ${esc(w.nameJa)} の詳細を開く">
      <div class="cw-stage" data-pictogram="${w.displayCode}"></div>
      <div class="cw-meta">
        <div class="cw-title-row"><span class="tag-num">${w.displayCode}</span><span class="cw-name">${esc(w.name)}</span></div>
        <span class="cw-ja">${esc(w.nameJa)} · ${esc(w.nameEn)}</span>
        <p class="cw-short">${esc(w.shortDescription)}</p>
        <div class="cw-chips">
          <span class="cw-chip">${LAYER_LABEL[w.layer] || esc(w.layer)}</span>
          <span class="cw-chip ${w.continuousShot ? "" : "is-edit"}">${w.continuousShot ? "1 SHOT" : "2 SHOTS"}</span>
        </div>
      </div>
    </button>`;
  }

  /* ---------------- lazy mount + play only while visible ---------------- */
  function initPictograms() {
    if (!window.CameraPictograms) return;
    const stages = [...document.querySelectorAll("[data-pictogram]")];
    const ctrl = new Map();
    const ensure = (el) => {
      if (!ctrl.has(el)) ctrl.set(el, window.CameraPictograms.mount(el, el.dataset.pictogram, { autoplay: false }));
      return ctrl.get(el);
    };
    if (!("IntersectionObserver" in window)) {
      stages.forEach((el) => { const c = ensure(el); if (c && !REDUCED) c.play(); });
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        const c = ensure(e.target);
        if (!c) return;
        if (e.isIntersecting && !REDUCED) c.play(); else c.pause();
      });
    }, { rootMargin: "120px 0px" });
    stages.forEach((el) => io.observe(el));

    // Reduced motion: posters by default, play only while hovered/focused.
    if (REDUCED) {
      document.querySelectorAll(".cw-card").forEach((cardEl) => {
        const el = cardEl.querySelector("[data-pictogram]");
        const on = () => ensure(el)?.play();
        const off = () => ensure(el)?.pause();
        cardEl.addEventListener("mouseenter", on); cardEl.addEventListener("focus", on);
        cardEl.addEventListener("mouseleave", off); cardEl.addEventListener("blur", off);
      });
    }
  }

  /* ---------------- category tabs (scroll spy) ---------------- */
  function initTabs() {
    const tabs = [...document.querySelectorAll(".cw-tab")];
    const setActive = (id) => tabs.forEach((t) => t.classList.toggle("active", t.dataset.cat === id));
    tabs.forEach((t) => t.addEventListener("click", (e) => {
      e.preventDefault();
      const target = t.dataset.cat === "all" ? $("#cw-groups") : $(`#cat-${t.dataset.cat}`);
      target?.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" });
    }));
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id.replace("cat-", "")); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll(".cw-group").forEach((g) => io.observe(g));
    window.addEventListener("scroll", () => { if (window.scrollY < $("#cw-groups").offsetTop - 200) setActive("all"); }, { passive: true });
  }

  /* ---------------- scroll color morph (as in fonts/) ---------------- */
  function initColorMorph() {
    if (REDUCED || typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);
    const root = $("#cw-groups");
    document.querySelectorAll(".cw-group[data-color]").forEach((section) => {
      const color = section.dataset.color;
      ScrollTrigger.create({
        trigger: section, start: "top center", end: "bottom center",
        onEnter: () => (document.body.style.backgroundColor = color),
        onEnterBack: () => (document.body.style.backgroundColor = color),
      });
    });
    ScrollTrigger.create({
      trigger: root, start: "top bottom", end: "bottom top",
      onLeave: () => (document.body.style.backgroundColor = ""),
      onLeaveBack: () => (document.body.style.backgroundColor = ""),
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());
  }

  /* ---------------- detail modal ---------------- */
  const durationWords = (d) => {
    const m = /^([\d.]+)\s*s$/.exec(String(d || "").trim());
    return m ? `${m[1]} seconds` : "a few seconds";
  };
  const promptText = (w) => w.prompt.replaceAll("{duration}", durationWords(w.parameters?.duration));
  const orderText = (w) => {
    const params = Object.values(w.parameters || {}).join(" / ");
    return `${w.displayCode} ${w.nameJa}（${w.nameEn}）— ${params}`;
  };

  function initModal() {
    const modal = $("#cw-modal");
    if (!modal || typeof modal.showModal !== "function") return;
    const stage = $("#cw-modal-stage");
    let current = 0;
    let pic = null;

    function render(index) {
      current = (index + WORKS.length) % WORKS.length;
      const w = WORKS[current];
      const cat = window.CAMERA_WORK_CATEGORIES_BY_ID[w.category];
      $("#cw-modal-code").textContent = w.displayCode;
      $("#cw-modal-cat").textContent = `${cat.label} · ${LAYER_LABEL[w.layer] || w.layer}`;
      $("#cw-modal-name").textContent = w.name;
      $("#cw-modal-ja").textContent = `${w.nameJa} · ${w.nameEn}`;
      $("#cw-modal-desc").textContent = w.description;
      $("#cw-modal-spec").innerHTML =
        `<dt>USE</dt><dd>${esc(w.useFor)}</dd>` +
        Object.entries(w.parameters || {}).map(([k, v]) => `<dt>${esc(k.toUpperCase())}</dt><dd>${esc(v)}</dd>`).join("");
      $("#cw-modal-prompt").innerHTML = esc(promptText(w)).replace(/\{subject\}/g, "<mark>{subject}</mark>");
      $("#cw-modal-shotnote").textContent = w.continuousShot
        ? ""
        : "2ショットをつなぐ編集の技法です。生成AIには「one continuous shot, no cuts」を同時に書かず、ショットごとに生成してつなぐか、カットありの1本として指示します。";
      $("#cw-modal-blender").textContent = w.blender;
      $("#cw-modal-order").textContent = orderText(w);
      if (pic) pic.kill();
      pic = window.CameraPictograms?.mount(stage, w.displayCode, { autoplay: !REDUCED });
    }

    function open(code) {
      const i = WORKS.findIndex((w) => w.displayCode === code);
      render(i < 0 ? 0 : i);
      if (!modal.open) modal.showModal();
      if (history.replaceState) history.replaceState(null, "", `#${WORKS[current].displayCode}`);
    }
    function close() { modal.close(); }

    modal.addEventListener("close", () => {
      if (pic) { pic.kill(); pic = null; }
      if (history.replaceState) history.replaceState(null, "", location.pathname + location.search);
    });
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    $("#cw-modal-close").addEventListener("click", close);
    $("#cw-prev").addEventListener("click", () => open(WORKS[(current - 1 + WORKS.length) % WORKS.length].displayCode));
    $("#cw-next").addEventListener("click", () => open(WORKS[(current + 1) % WORKS.length].displayCode));
    modal.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") $("#cw-prev").click();
      if (e.key === "ArrowRight") $("#cw-next").click();
    });
    stage.addEventListener("click", () => pic?.tl && (pic.tl.paused() ? pic.play() : pic.pause()));

    document.querySelectorAll(".cw-card").forEach((c) => c.addEventListener("click", () => open(c.dataset.code)));

    modal.querySelectorAll(".cw-copy").forEach((btn) => btn.addEventListener("click", () => {
      const w = WORKS[current];
      copy(btn.dataset.copy === "prompt" ? promptText(w) : orderText(w));
    }));

    // Deep link: camera/index.html#V11 opens that entry.
    const hash = decodeURIComponent(location.hash.slice(1)).toUpperCase();
    if (window.CAMERA_WORKS_BY_CODE?.[hash]) open(hash);
  }

  let toastTimer = 0;
  function toast(msg) {
    const t = $("#cw-toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 1600);
  }
  function copy(text) {
    const done = () => toast("COPIED");
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
    } else fallbackCopy(text, done);
  }
  function fallbackCopy(text, done) {
    const ta = document.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    ($("#cw-modal").open ? $("#cw-modal") : document.body).appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch { toast("COPY FAILED"); }
    ta.remove();
  }

  function boot() {
    initBgCrossfade();
    buildGroups();
    initPictograms();
    initTabs();
    initColorMorph();
    initModal();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
