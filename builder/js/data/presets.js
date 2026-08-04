/* BLENCI BUILDER — preset registry (Phase 1: 1 preset) */
const BUILDER_PRESETS = [
  {
    id: "quiet-luxury",
    name: "Quiet Luxury",
    layout: "editorial-split",
    fonts: { heading: "bodoni-moda", body: "noto-sans-jp" },
    palette: { background: "#111111", surface: "#181818", text: "#F3EFE6", accent: "#8B1E2D" },
    assignments: {
      "hero-title": { entrance: { id: "text-mask-reveal" } },
      "hero-description": { entrance: { id: "fade-up" } },
      "hero-image": { entrance: { id: "clip-path-wipe" }, hover: { id: "soft-zoom" }, scroll: { id: "slow-parallax" } },
      "hero-button": { hover: { id: "magnetic-hover" } },
      "hero-background": { continuous: { id: "noise-overlay" } },
    },
  },
];
const BUILDER_PRESETS_BY_ID = Object.fromEntries(BUILDER_PRESETS.map((p) => [p.id, p]));
