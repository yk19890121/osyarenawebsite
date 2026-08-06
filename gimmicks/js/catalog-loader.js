/* BLENCI LAB — GIMMICK catalogue reorganizer.
   Runs once, synchronously, right after the full static article markup for
   all 119 original gimmicks (120 legacy numbers, #08+#09 merged into one
   demo) has been parsed -- this script tag sits at the end of body, after
   <main>. It regroups the existing <article class="demo" id="gNN">
   elements -- moved via appendChild, never re-authored, so their internal
   markup/canvases/event bindings stay untouched -- into the new 11-category
   sections defined in js/data/catalog.js, inserts the newly designed
   gimmicks from js/gimmicks-new.js, rebuilds the #dot-nav sidebar around
   the new categories, adds a mobile category tab bar, and wires search.

   Placed before js/main.js so its DOM changes (especially the rebuilt
   #dot-nav) are in place before main.js's whenReady(boot) fires on
   window "load". */
(() => {
  "use strict";

  const main = document.querySelector("main");
  const hero = document.getElementById("hero");
  if (!main || !hero || !window.GIMMICK_CATALOG) return;

  const REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ids of the 19 old flat A-S <section class="group"> wrappers this reorg replaces.
  const OLD_GROUP_IDS = [
    "group-scroll", "group-cursor", "group-text", "group-cards", "group-feedback",
    "group-bg", "group-v1", "group-force", "group-distort", "group-cursor2",
    "group-3d", "group-structure", "group-misc", "group-3d2", "group-cursor3",
    "group-physics", "group-scroll2", "group-organic", "group-play",
  ];

  function legacyDomId(legacyNumber) {
    return legacyNumber === "g8g9" ? "g8g9" : "g" + parseInt(legacyNumber, 10);
  }

  const sortedCats = [...window.GIMMICK_CATEGORIES].sort((a, b) => a.order - b.order);

  // 1. Build one category section per taxonomy entry, in order, right after the hero.
  const sections = {};
  let insertAfter = hero;
  sortedCats.forEach((cat) => {
    const count = window.GIMMICK_CATALOG.filter((g) => g.category === cat.id).length;
    const section = document.createElement("section");
    section.className = "group";
    section.id = "cat-" + cat.id;
    section.dataset.category = cat.id;
    section.innerHTML = `<h2 class="group-title"><span>${cat.prefix}</span>${cat.label}</h2><p class="cat-desc">${cat.description}<span class="cat-count">${count} GIMMICKS</span></p>`;
    insertAfter.after(section);
    insertAfter = section;
    sections[cat.id] = section;
  });

  // 2. Move every legacy article into its category section (order preserved
  //    from the catalog array); insert newly designed gimmicks via
  //    NEW_GIMMICKS. Every entry gets a displayCode badge prepended to .tag.
  window.GIMMICK_CATALOG.forEach((entry) => {
    const section = sections[entry.category];
    if (!section) return;
    let articleEl;
    if (entry.isNew) {
      const factory = window.NEW_GIMMICKS && window.NEW_GIMMICKS[entry.name];
      if (!factory) { console.error("[catalog] no NEW_GIMMICKS entry for", entry.name, "-- add one in gimmicks-new.js"); return; }
      const wrap = document.createElement("div");
      wrap.innerHTML = factory.render().trim();
      articleEl = wrap.firstElementChild;
      section.appendChild(articleEl);
      try { factory.init(articleEl); } catch (err) { console.error("[catalog] init failed:", entry.name, err); }
    } else {
      articleEl = document.getElementById(legacyDomId(entry.legacyNumber));
      if (!articleEl) { console.error("[catalog] no DOM element for legacy #" + entry.legacyNumber, entry.name); return; }
      section.appendChild(articleEl);
    }
    articleEl.dataset.gimmickCode = entry.displayCode;
    articleEl.dataset.gimmickCategory = entry.category;
    const tagEl = articleEl.querySelector(".tag");
    if (!tagEl) return;
    // Old flat numbering is superseded by displayCode -- drop it from
    // display (still searchable via entry.legacyNumber, see step 6).
    const oldNum = tagEl.querySelector(".tag-num");
    if (oldNum) oldNum.remove();
    const codeSpan = document.createElement("span");
    codeSpan.className = "tag-code";
    codeSpan.textContent = entry.displayCode;
    tagEl.insertBefore(codeSpan, tagEl.firstChild);
    if (entry.isNew) {
      const newBadge = document.createElement("span");
      newBadge.className = "tag-new";
      newBadge.textContent = "NEW";
      tagEl.appendChild(newBadge);
    }
  });

  // 3. Remove the now-empty legacy group wrappers.
  OLD_GROUP_IDS.forEach((id) => { const el = document.getElementById(id); if (el) el.remove(); });

  // 4. Rebuild #dot-nav around the new categories. Gimmick #02 (SIDE DOT
  //    NAVIGATION) and #05 (ANCHOR HIGHLIGHT FLASH) are literally this
  //    element -- main.js's initDotNav() (runs after this, on window load)
  //    reads these dots fresh, so the live demo now drives real category
  //    navigation instead of the old flat 19-group list.
  const dotNav = document.getElementById("dot-nav");
  if (dotNav) {
    const heroDot = `<a href="#hero" class="dot active" data-label="TOP"><i></i></a>`;
    const catDots = sortedCats.map((cat) => {
      const count = window.GIMMICK_CATALOG.filter((g) => g.category === cat.id).length;
      return `<a href="#cat-${cat.id}" class="dot" data-label="${cat.prefix} — ${cat.label} (${count})"><i></i></a>`;
    }).join("");
    dotNav.innerHTML = heroDot + catDots;
  }

  // 4b. .lab-header wraps onto 2-3 lines on narrow phones (crumb-nav's own
  //     flex-wrap fix), so its height isn't a fixed constant -- measure it
  //     into a CSS var so the sticky toolbar and anchor-jump clearance
  //     below always sit right under it instead of a hardcoded guess.
  const headerEl = document.querySelector(".lab-header");
  function syncHeaderHeight() {
    if (!headerEl) return;
    document.documentElement.style.setProperty("--header-h", headerEl.offsetHeight + "px");
  }
  syncHeaderHeight();
  window.addEventListener("resize", syncHeaderHeight);
  if (window.ResizeObserver) new ResizeObserver(syncHeaderHeight).observe(headerEl);

  // 5. Sticky toolbar right below the fixed header: mobile category tabs
  //    (#dot-nav is hidden below 860px) + search. A single sticky wrapper
  //    keeps both correctly clear of the header regardless of which anchor
  //    (dot-nav / cat-tab / hash) the page was scrolled to.
  const toolbar = document.createElement("div");
  toolbar.id = "cat-toolbar";
  hero.after(toolbar);

  const tabBar = document.createElement("nav");
  tabBar.id = "cat-tabs";
  tabBar.setAttribute("aria-label", "カテゴリーナビゲーション");
  tabBar.innerHTML = sortedCats.map((cat) => `<button type="button" class="cat-tab" data-target="cat-${cat.id}">${cat.prefix} ${cat.label}</button>`).join("");
  toolbar.appendChild(tabBar);
  tabBar.addEventListener("click", (e) => {
    const btn = e.target.closest(".cat-tab");
    if (!btn) return;
    const target = document.getElementById(btn.dataset.target);
    if (target) target.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth", block: "start" });
  });

  // 6. Search / filter bar -- matches display code, EN/JA name, category id.
  const searchBar = document.createElement("div");
  searchBar.id = "gimmick-search-bar";
  searchBar.innerHTML = `
    <input type="text" id="gimmick-search-input" placeholder="コードまたは名前で検索（例: T01 / カード / cursor）" aria-label="ギミック検索">
    <span id="gimmick-search-count"></span>`;
  toolbar.appendChild(searchBar);

  const allArticles = [...main.querySelectorAll("article.demo[data-gimmick-code]")];
  const total = allArticles.length;
  const countEl = searchBar.querySelector("#gimmick-search-count");
  const input = searchBar.querySelector("#gimmick-search-input");
  function applyFilter() {
    const q = input.value.trim().toLowerCase();
    let shown = 0;
    allArticles.forEach((el) => {
      const entry = window.GIMMICK_CATALOG_BY_CODE[el.dataset.gimmickCode];
      const haystack = [entry.displayCode, entry.name, entry.nameJa, entry.category, entry.legacyNumber || ""].join(" ").toLowerCase();
      const match = !q || haystack.includes(q);
      el.classList.toggle("search-hidden", !match);
      if (match) shown++;
    });
    sortedCats.forEach((cat) => {
      const section = sections[cat.id];
      const visible = section.querySelectorAll("article.demo:not(.search-hidden)").length;
      section.classList.toggle("search-hidden", visible === 0);
    });
    countEl.textContent = q ? `${shown} / ${total}` : "";
  }
  input.addEventListener("input", applyFilter);

  // 7. Hash sync: land on the right section on load, keep the hash in
  //    sync with scroll position afterwards without polluting history.
  if (location.hash) {
    const target = document.getElementById(location.hash.slice(1));
    if (target) requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
  }
  const trackedSections = [hero, ...sortedCats.map((c) => sections[c.id])];
  let hashTick = null;
  window.addEventListener("scroll", () => {
    if (hashTick) return;
    hashTick = requestAnimationFrame(() => {
      hashTick = null;
      const scrollPos = window.scrollY + window.innerHeight * 0.4;
      let current = "hero";
      trackedSections.forEach((el) => { if (el && el.offsetTop <= scrollPos) current = el.id; });
      if (location.hash.slice(1) !== current) history.replaceState(null, "", "#" + current);
    });
  }, { passive: true });
})();
