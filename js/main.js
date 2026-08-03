/* BLENCI — SS26 — main.js */
(() => {
  "use strict";

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE_POINTER = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (!FINE_POINTER) document.body.classList.add("no-cursor");

  gsap.registerPlugin(ScrollTrigger);

  const pad = (n) => String(n).padStart(2, "0");

  const LOOK_META = [
    { en: "OVERSIZED CHECK SHIRTING", jp: "オーバーサイズ・チェックシャツ" },
    { en: "TAILORED SUIT / BLEACHED",  jp: "脱色調セットアップ" },
    { en: "PLEATED WORKWEAR",          jp: "プリーツワークウェア" },
    { en: "DRAPED KNIT LAYER",         jp: "ドレープニットレイヤー" },
    { en: "MUSTARD WOOL COAT",         jp: "マスタードウールコート" },
    { en: "STRUCTURED OVERCOAT",       jp: "ストラクチャードコート" },
    { en: "DENIM DECONSTRUCTED",       jp: "デニム・脱構築" },
    { en: "COBALT SHIRTING SET",       jp: "コバルトシャツセット" },
    { en: "RUST TONE TRENCH",          jp: "ラストトーン・トレンチ" },
    { en: "EARTH TONE LAYERING",       jp: "アーストーン・レイヤード" },
    { en: "TEAL SILK BLOUSE",          jp: "ティールシルクブラウス" },
    { en: "AMBER CARGO SET",           jp: "アンバーカーゴセット" },
    { en: "CRIMSON WOOL BLAZER",       jp: "クリムゾンウールブレザー" },
    { en: "COBALT PUFFER",             jp: "コバルトパファー" },
    { en: "SCARLET MINIMAL COAT",      jp: "スカーレット・ミニマルコート" },
    { en: "CHARCOAL DRAPE SUIT",       jp: "チャコール・ドレープスーツ" },
    { en: "OCHRE UTILITY JACKET",      jp: "オーカー・ユーティリティジャケット" },
    { en: "SIENNA WRAP COAT",          jp: "シエナ・ラップコート" },
  ];

  /* ============================== LOADER ============================== */
  function initLoader(onDone) {
    const countEl = document.getElementById("loader-count");
    const fillEl = document.getElementById("loader-bar-fill");
    const loader = document.getElementById("loader");
    const dur = REDUCED ? 150 : 1600;
    const start = performance.now();
    let finished = false;

    // setTimeout-driven (not rAF) so content still builds even if the tab
    // is backgrounded/not compositing — rAF can be suspended, timers can't.
    function tick() {
      const p = Math.min(1, (performance.now() - start) / dur);
      const n = Math.floor(p * 100);
      countEl.textContent = pad(n);
      fillEl.style.width = n + "%";
      if (p < 1) setTimeout(tick, 16);
      else finish();
    }
    function finish() {
      if (finished) return;
      finished = true;
      onDone();
      loader.classList.add("done");
      gsap.to(loader, {
        yPercent: -100,
        duration: REDUCED ? 0.2 : 1,
        ease: "power4.inOut",
        delay: 0.1,
      });
      setTimeout(() => (loader.style.display = "none"), REDUCED ? 350 : 1300);
    }
    setTimeout(tick, 16);
  }

  /* =========================== CUSTOM CURSOR =========================== */
  function initCursor() {
    if (!FINE_POINTER) return;
    const dot = document.getElementById("cursor-dot");
    const ring = document.getElementById("cursor-ring");
    const preview = document.getElementById("cursor-preview");
    const previewImg = preview.querySelector("img");

    const setDot = gsap.quickTo(dot, "x", { duration: 0.05, ease: "none" });
    const setDotY = gsap.quickTo(dot, "y", { duration: 0.05, ease: "none" });
    const setRing = gsap.quickTo(ring, "x", { duration: 0.35, ease: "power3" });
    const setRingY = gsap.quickTo(ring, "y", { duration: 0.35, ease: "power3" });
    const setPrev = gsap.quickTo(preview, "x", { duration: 0.45, ease: "power3" });
    const setPrevY = gsap.quickTo(preview, "y", { duration: 0.45, ease: "power3" });

    window.addEventListener("mousemove", (e) => {
      setDot(e.clientX); setDotY(e.clientY);
      setRing(e.clientX); setRingY(e.clientY);
      setPrev(e.clientX); setPrevY(e.clientY);
    });

    document.addEventListener("mouseover", (e) => {
      const t = e.target.closest("a,button,[data-magnetic],.lookbook-item,.index-row");
      if (t) ring.classList.add(t.matches("a,button,[data-magnetic]") ? "link" : "hover");
    });
    document.addEventListener("mouseout", (e) => {
      const t = e.target.closest("a,button,[data-magnetic],.lookbook-item,.index-row");
      if (t) ring.classList.remove("link", "hover");
    });

    window.showCursorPreview = (src) => {
      previewImg.src = src;
      preview.classList.add("visible");
    };
    window.hideCursorPreview = () => preview.classList.remove("visible");
  }

  /* ============================ MAGNETIC UI ============================ */
  function initMagnetic() {
    if (!FINE_POINTER || REDUCED) return;
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const setX = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
      const setY = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const relX = e.clientX - (r.left + r.width / 2);
        const relY = e.clientY - (r.top + r.height / 2);
        setX(relX * 0.35);
        setY(relY * 0.35);
      });
      el.addEventListener("mouseleave", () => { setX(0); setY(0); });
    });
  }

  /* ============================ LENIS SCROLL ============================ */
  function initLenis() {
    if (REDUCED) return null;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    return lenis;
  }

  /* ============================== HEADER ============================== */
  function initHeader() {
    const header = document.getElementById("site-header");
    ScrollTrigger.create({
      start: 10,
      onUpdate: (self) => header.classList.toggle("scrolled", self.scroll() > 10 || window.scrollY > 10),
    });
    window.addEventListener("scroll", () => header.classList.toggle("scrolled", window.scrollY > 10));
  }

  /* ================================ MENU ================================ */
  function initMenu(lenis) {
    const toggle = document.getElementById("menu-toggle");
    const overlay = document.getElementById("menu-overlay");
    const links = overlay.querySelectorAll(".menu-link");
    gsap.set(links, { yPercent: 130 });
    let open = false;
    toggle.addEventListener("click", () => {
      open = !open;
      toggle.setAttribute("aria-expanded", String(open));
      overlay.classList.toggle("open", open);
      overlay.setAttribute("aria-hidden", String(!open));
      if (open) {
        if (lenis) lenis.stop();
        gsap.to(links, { yPercent: 0, duration: 0.9, stagger: 0.06, ease: "power4.out", delay: 0.15 });
      } else {
        if (lenis) lenis.start();
        gsap.set(links, { yPercent: 130 });
      }
    });
    overlay.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => { toggle.click(); })
    );
  }

  /* ================================ HERO ================================ */
  function initHero() {
    const slides = document.querySelectorAll(".hero-slide");
    let i = 0;
    if (slides.length > 1 && !REDUCED) {
      setInterval(() => {
        slides[i].classList.remove("active");
        i = (i + 1) % slides.length;
        slides[i].classList.add("active");
      }, 5000);
    }

    gsap.set(".ht-char", { yPercent: 115 });
    gsap.set(".hero-eyebrow span, .hero-sub span", { yPercent: 115 });
    const tl = gsap.timeline({ delay: 0.1 });
    tl.to(".ht-char", { yPercent: 0, duration: 1.1, ease: "power4.out", stagger: 0.04 }, 0)
      .to(".hero-eyebrow span", { yPercent: 0, duration: 0.9, ease: "power4.out" }, 0.2)
      .to(".hero-sub span", { yPercent: 0, duration: 0.9, ease: "power4.out" }, 0.35);
  }

  /* ============================ REVEAL TEXT ============================ */
  function initReveals() {
    document.querySelectorAll(".reveal-line > span").forEach((span) => {
      if (span.closest("#hero")) return;
      gsap.set(span, { yPercent: 115 });
      gsap.to(span, {
        yPercent: 0,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: { trigger: span, start: "top 92%" },
      });
    });
  }

  /* ============================ MARQUEE PAUSE ============================ */
  function initMarqueePause() {
    document.querySelectorAll(".marquee-band").forEach((band) => {
      const track = band.querySelector(".marquee-track");
      band.addEventListener("mouseenter", () => (track.style.animationPlayState = "paused"));
      band.addEventListener("mouseleave", () => (track.style.animationPlayState = "running"));
    });
  }

  /* ============================ COLLECTION GALLERY ============================ */
  function buildGallery() {
    const order = [2, 3, 4, 5, 7, 8, 9, 10, 12, 13];
    const track = document.getElementById("gallery-track");
    track.innerHTML = order
      .map((n) => {
        const v = LOOKS[n - 1].variants[0];
        const meta = LOOK_META[n - 1];
        return `<div class="gallery-item" data-look="${n}">
          <div class="gallery-item-frame"><img src="assets/img/${v.full}" alt="LOOK ${pad(n)} — ${meta.en}" loading="lazy"></div>
          <div class="gallery-item-meta"><span>LOOK ${pad(n)}</span><span>${meta.en}</span></div>
        </div>`;
      })
      .join("");

    track.querySelectorAll(".gallery-item").forEach((el) =>
      el.addEventListener("click", () => openModal(Number(el.dataset.look)))
    );

    ScrollTrigger.matchMedia({
      "(min-width: 981px)": function () {
        if (REDUCED) return;
        const distance = () => track.scrollWidth - window.innerWidth + window.innerWidth * 0.06;
        const st = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: ".gallery-pin-wrap",
            start: "top top",
            end: () => "+=" + distance(),
            scrub: 0.6,
            pin: true,
            invalidateOnRefresh: true,
          },
        });
        return () => st.scrollTrigger && st.scrollTrigger.kill();
      },
    });
  }

  /* ============================ FEATURED COLOR MORPH ============================ */
  function initFeatured() {
    const backdrop = document.getElementById("featured");
    const baseColor = "#0b0a09";
    document.querySelectorAll(".feature").forEach((feature) => {
      const lookNum = Number(feature.dataset.look);
      const color = LOOKS[lookNum - 1].variants[0].bg;
      const wrap = feature.querySelector(".feature-img-wrap");
      const img = feature.querySelector("img");

      gsap.set(wrap, { clipPath: "inset(0% 0% 100% 0%)" });
      ScrollTrigger.create({
        trigger: feature,
        start: "top 78%",
        onEnter: () => gsap.to(wrap, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "power4.out" }),
        once: true,
      });

      if (!REDUCED) {
        gsap.fromTo(
          img,
          { scale: 1.22 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: feature, start: "top bottom", end: "bottom top", scrub: true },
          }
        );
      }

      ScrollTrigger.create({
        trigger: feature,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => gsap.to(backdrop, { backgroundColor: color, duration: 0.8 }),
        onEnterBack: () => gsap.to(backdrop, { backgroundColor: color, duration: 0.8 }),
        onLeaveBack: () => gsap.to(backdrop, { backgroundColor: baseColor, duration: 0.8 }),
      });
    });
    ScrollTrigger.create({
      trigger: "#featured",
      start: "bottom 40%",
      onLeave: () => gsap.to(backdrop, { backgroundColor: baseColor, duration: 0.8 }),
    });
  }

  /* ============================ PHILOSOPHY COUNTERS ============================ */
  function initCounters() {
    document.querySelectorAll(".num[data-count]").forEach((el) => {
      const target = Number(el.dataset.count);
      const obj = { v: 0 };
      ScrollTrigger.create({
        trigger: el,
        start: "top 88%",
        once: true,
        onEnter: () =>
          gsap.to(obj, {
            v: target,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => (el.textContent = Math.floor(obj.v)),
          }),
      });
    });
  }

  /* ============================ INDEX LIST ============================ */
  function buildIndexList() {
    const wrap = document.getElementById("index-rows");
    wrap.innerHTML = LOOKS.map((look, i) => {
      const n = i + 1;
      const meta = LOOK_META[i];
      return `<div class="index-row" data-look="${n}">
        <div class="index-row-left">
          <span class="index-row-num">${pad(n)}</span>
          <span class="index-row-title">${meta.en}</span>
        </div>
        <span class="index-row-tag">${meta.jp}</span>
      </div>`;
    }).join("");

    wrap.querySelectorAll(".index-row").forEach((row) => {
      const n = Number(row.dataset.look);
      const thumb = "assets/img/" + LOOKS[n - 1].variants[0].thumb;
      row.addEventListener("mouseenter", () => window.showCursorPreview && window.showCursorPreview(thumb));
      row.addEventListener("mouseleave", () => window.hideCursorPreview && window.hideCursorPreview());
      row.addEventListener("click", () => openModal(n));
    });
  }

  /* ============================ LOOKBOOK GRID ============================ */
  function buildLookbook() {
    const grid = document.getElementById("lookbook-grid");
    grid.innerHTML = LOOKS.map((look, i) => {
      const n = i + 1;
      const meta = LOOK_META[i];
      const v = look.variants[0];
      return `<button class="lookbook-item" data-look="${n}" style="transition-delay:${(i % 4) * 0.07}s">
        <img src="assets/img/${v.thumb}" alt="LOOK ${pad(n)} — ${meta.en}" loading="lazy">
        <div class="lookbook-item-overlay">
          <span class="lookbook-item-num">LOOK ${pad(n)}</span>
          <span class="lookbook-item-view">VIEW +</span>
        </div>
      </button>`;
    }).join("");

    grid.querySelectorAll(".lookbook-item").forEach((btn) =>
      btn.addEventListener("click", () => openModal(Number(btn.dataset.look)))
    );

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in-view");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    grid.querySelectorAll(".lookbook-item").forEach((el) => io.observe(el));
  }

  /* ============================ MODAL VIEWER ============================ */
  let currentLook = 1;
  let currentVariant = 0;
  let modalLenis = null;

  function renderModal() {
    const look = LOOKS[currentLook - 1];
    const meta = LOOK_META[currentLook - 1];
    document.getElementById("modal-look-num").textContent = `LOOK ${pad(currentLook)}`;
    document.getElementById("modal-look-name").textContent = meta.en;

    const stage = document.getElementById("modal-stage");
    stage.innerHTML = look.variants
      .map((v, idx) => `<img src="assets/img/${v.full}" class="${idx === currentVariant ? "active" : ""}" data-idx="${idx}" alt="LOOK ${pad(currentLook)} variant ${idx + 1}">`)
      .join("");

    const dots = document.getElementById("modal-variants");
    dots.innerHTML = look.variants
      .map((v, idx) => `<button class="modal-variant-dot ${idx === currentVariant ? "active" : ""}" data-idx="${idx}"><img src="assets/img/${v.thumb}" alt=""></button>`)
      .join("");
    dots.querySelectorAll(".modal-variant-dot").forEach((d) =>
      d.addEventListener("click", (e) => {
        e.stopPropagation();
        setVariant(Number(d.dataset.idx));
      })
    );

    stage.addEventListener("click", () => setVariant((currentVariant + 1) % look.variants.length));
  }

  function setVariant(idx) {
    currentVariant = idx;
    document.querySelectorAll("#modal-stage img").forEach((img) => img.classList.toggle("active", Number(img.dataset.idx) === idx));
    document.querySelectorAll(".modal-variant-dot").forEach((d) => d.classList.toggle("active", Number(d.dataset.idx) === idx));
  }

  function openModal(lookNum) {
    currentLook = lookNum;
    currentVariant = 0;
    renderModal();
    const modal = document.getElementById("modal-viewer");
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    if (modalLenis) modalLenis.stop();
  }

  function closeModal() {
    const modal = document.getElementById("modal-viewer");
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    if (modalLenis) modalLenis.start();
  }

  function stepLook(dir) {
    currentLook = ((currentLook - 1 + dir + LOOKS.length) % LOOKS.length) + 1;
    currentVariant = 0;
    renderModal();
  }

  function initModal(lenis) {
    modalLenis = lenis;
    document.getElementById("modal-close").addEventListener("click", closeModal);
    document.getElementById("modal-prev").addEventListener("click", (e) => { e.stopPropagation(); stepLook(-1); });
    document.getElementById("modal-next").addEventListener("click", (e) => { e.stopPropagation(); stepLook(1); });
    const modal = document.getElementById("modal-viewer");
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    window.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("open")) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") stepLook(1);
      if (e.key === "ArrowLeft") stepLook(-1);
    });
  }

  /* ============================ BACK TO TOP ============================ */
  function initBackToTop(lenis) {
    document.getElementById("back-to-top").addEventListener("click", () => {
      if (lenis) lenis.scrollTo(0, { duration: 1.4 });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ================================ INIT ================================ */
  function boot() {
    const lenis = initLenis();
    initCursor();
    initHeader();
    initMenu(lenis);
    initHero();
    initReveals();
    initMarqueePause();
    buildGallery();
    initFeatured();
    initCounters();
    buildIndexList();
    buildLookbook();
    initModal(lenis);
    initBackToTop(lenis);
    initMagnetic();

    window.addEventListener("load", () => ScrollTrigger.refresh());
    setTimeout(() => ScrollTrigger.refresh(), 600);
  }

  initLoader(boot);
})();
