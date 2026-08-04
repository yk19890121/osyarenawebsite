/* BLENCI BUILDER — preset registry (10 presets).
   Assignments are keyed by object ROLE, not object id, so one preset's
   motion choices apply across every layout — roles like "card-heading" or
   "article-heading" are reused by every layout that has that kind of
   object. See runtime/state.js `resolveAssignment` for the matching logic
   and its per-type fallback for any role a preset doesn't mention. */
const BUILDER_PRESETS = (() => {
  const HEADING_ROLES = ["primary-heading", "secondary-heading", "card-heading", "story-heading", "slide-title", "featured-heading", "article-heading"];
  const TEXT_ROLES = ["body-copy", "card-body", "story-body", "slide-body", "featured-body", "article-summary"];
  const VISUAL_ROLES = ["primary-visual", "card-visual", "story-visual", "slide-visual", "featured-visual", "article-visual"];
  const BUTTON_ROLES = ["primary-cta", "secondary-cta", "featured-cta"];

  function assignRoles(roles, effects) {
    const out = {};
    roles.forEach((r) => { out[r] = effects; });
    return out;
  }

  function buildAssignments(opt) {
    const visualEffects = { entrance: { id: opt.visualEntrance } };
    if (opt.visualHover) visualEffects.hover = { id: opt.visualHover };
    if (opt.visualScroll) visualEffects.scroll = { id: opt.visualScroll };
    return {
      ...assignRoles(HEADING_ROLES, { entrance: { id: opt.headingEntrance } }),
      ...assignRoles(TEXT_ROLES, { entrance: { id: opt.textEntrance } }),
      ...assignRoles(VISUAL_ROLES, visualEffects),
      ...(opt.buttonHover ? assignRoles(BUTTON_ROLES, { hover: { id: opt.buttonHover } }) : {}),
      ...(opt.backgroundContinuous ? { "primary-background": { continuous: { id: opt.backgroundContinuous } } } : {}),
    };
  }

  const presets = [
    {
      id: "quiet-luxury", name: "Quiet Luxury", layout: "editorial-split",
      fonts: { heading: "bodoni-moda", body: "noto-sans-jp" },
      palette: { background: "#111111", surface: "#181818", text: "#F3EFE6", accent: "#8B1E2D" },
      opt: { headingEntrance: "text-mask-reveal", textEntrance: "fade-up", visualEntrance: "clip-path-wipe", visualHover: "soft-zoom", visualScroll: "slow-parallax", buttonHover: "magnetic-hover", backgroundContinuous: "noise-overlay" },
    },
    {
      id: "bold-editorial", name: "Bold Editorial", layout: "storytelling-landing",
      fonts: { heading: "playfair-display", body: "inter" },
      palette: { background: "#0B0B0B", surface: "#161616", text: "#FFFFFF", accent: "#E63946" },
      opt: { headingEntrance: "split-character", textEntrance: "fade-up", visualEntrance: "fade-in", visualHover: "soft-zoom", buttonHover: "underline-slide" },
    },
    {
      id: "soft-pastel-minimal", name: "Soft Pastel Minimal", layout: "editorial-split",
      fonts: { heading: "cormorant-garamond", body: "manrope" },
      palette: { background: "#FAF6F2", surface: "#FFFFFF", text: "#2B2620", accent: "#C9A0A6" },
      opt: { headingEntrance: "fade-up", textEntrance: "fade-up", visualEntrance: "fade-in", visualHover: "soft-zoom", visualScroll: "slow-parallax", buttonHover: "scale-hover" },
    },
    {
      id: "tech-mono", name: "Tech Mono", layout: "slide-presentation",
      fonts: { heading: "jetbrains-mono", body: "space-grotesk" },
      palette: { background: "#0A0E12", surface: "#10161C", text: "#D8F0E8", accent: "#33FFC7" },
      opt: { headingEntrance: "blur-reveal", textEntrance: "fade-up", visualEntrance: "fade-in", visualHover: "soft-zoom", visualScroll: "slow-parallax", buttonHover: "fill-slide", backgroundContinuous: "noise-overlay" },
    },
    {
      id: "warm-terracotta", name: "Warm Terracotta", layout: "storytelling-landing",
      fonts: { heading: "cormorant-garamond", body: "noto-sans-jp" },
      palette: { background: "#2B1B14", surface: "#3A2419", text: "#F2E2CF", accent: "#D97B4F" },
      opt: { headingEntrance: "text-mask-reveal", textEntrance: "fade-up", visualEntrance: "clip-path-wipe", visualHover: "soft-zoom", visualScroll: "slow-parallax", buttonHover: "underline-slide" },
    },
    {
      id: "corporate-trust", name: "Corporate Trust", layout: "modular-grid",
      fonts: { heading: "manrope", body: "inter" },
      palette: { background: "#0E1526", surface: "#16203A", text: "#EDEFF5", accent: "#4C7CF0" },
      opt: { headingEntrance: "fade-up", textEntrance: "fade-up", visualEntrance: "fade-in", visualHover: "soft-zoom", buttonHover: "scale-hover" },
    },
    {
      id: "streetwear-bold", name: "Streetwear Bold", layout: "fullscreen-hero",
      fonts: { heading: "bebas-neue", body: "space-grotesk" },
      palette: { background: "#0A0A0A", surface: "#161616", text: "#F5F5F0", accent: "#E6FF3C" },
      opt: { headingEntrance: "split-character", textEntrance: "fade-up", visualEntrance: "fade-in", visualHover: "soft-zoom", visualScroll: "slow-parallax", buttonHover: "fill-slide", backgroundContinuous: "animated-gradient" },
    },
    {
      id: "vintage-paper", name: "Vintage Paper", layout: "news-curation",
      fonts: { heading: "shippori-mincho", body: "zen-kaku-gothic-new" },
      palette: { background: "#EDE6D6", surface: "#F5F0E4", text: "#2A2420", accent: "#8A6A4F" },
      opt: { headingEntrance: "blur-reveal", textEntrance: "fade-up", visualEntrance: "fade-in", visualScroll: "slow-parallax", buttonHover: "underline-slide" },
    },
    {
      id: "neo-brutalist", name: "Neo Brutalist", layout: "fullscreen-hero",
      fonts: { heading: "archivo-black", body: "jetbrains-mono" },
      palette: { background: "#F5F0E8", surface: "#FFFFFF", text: "#0A0A0A", accent: "#FF3B1F" },
      opt: { headingEntrance: "split-character", textEntrance: "fade-up", visualEntrance: "fade-in", visualHover: "soft-zoom", buttonHover: "fill-slide" },
    },
    {
      id: "nature-organic", name: "Nature Organic", layout: "modular-grid",
      fonts: { heading: "manrope", body: "noto-sans-jp" },
      palette: { background: "#1B2419", surface: "#242F20", text: "#EFEAD9", accent: "#7A9B6E" },
      opt: { headingEntrance: "fade-up", textEntrance: "fade-up", visualEntrance: "clip-path-wipe", visualHover: "soft-zoom", visualScroll: "slow-parallax", buttonHover: "scale-hover", backgroundContinuous: "noise-overlay" },
    },
  ];

  return presets.map((p) => ({
    id: p.id, name: p.name, layout: p.layout, fonts: p.fonts, palette: p.palette,
    assignments: buildAssignments(p.opt),
  }));
})();
const BUILDER_PRESETS_BY_ID = Object.fromEntries(BUILDER_PRESETS.map((p) => [p.id, p]));
