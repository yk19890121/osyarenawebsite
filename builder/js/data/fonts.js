/* BLENCI BUILDER — font registry (Phase 1: 15 curated Google Fonts) */
const BUILDER_FONTS = [
  { id: "bodoni-moda", name: "Bodoni Moda", family: "'Bodoni Moda', serif", category: "SERIF" },
  { id: "playfair-display", name: "Playfair Display", family: "'Playfair Display', serif", category: "SERIF" },
  { id: "cormorant-garamond", name: "Cormorant Garamond", family: "'Cormorant Garamond', serif", category: "SERIF" },
  { id: "outfit", name: "Outfit", family: "'Outfit', sans-serif", category: "SANS-SERIF" },
  { id: "space-grotesk", name: "Space Grotesk", family: "'Space Grotesk', sans-serif", category: "SANS-SERIF" },
  { id: "inter", name: "Inter", family: "'Inter', sans-serif", category: "SANS-SERIF" },
  { id: "manrope", name: "Manrope", family: "'Manrope', sans-serif", category: "SANS-SERIF" },
  { id: "bebas-neue", name: "Bebas Neue", family: "'Bebas Neue', sans-serif", category: "DISPLAY" },
  { id: "archivo-black", name: "Archivo Black", family: "'Archivo Black', sans-serif", category: "DISPLAY" },
  { id: "zen-kaku-gothic-new", name: "Zen Kaku Gothic New", family: "'Zen Kaku Gothic New', sans-serif", category: "日本語" },
  { id: "noto-sans-jp", name: "Noto Sans JP", family: "'Noto Sans JP', sans-serif", category: "日本語" },
  { id: "shippori-mincho", name: "Shippori Mincho", family: "'Shippori Mincho', serif", category: "日本語" },
  { id: "jetbrains-mono", name: "JetBrains Mono", family: "'JetBrains Mono', monospace", category: "MONOSPACE" },
  { id: "space-mono", name: "Space Mono", family: "'Space Mono', monospace", category: "MONOSPACE" },
  { id: "caveat", name: "Caveat", family: "'Caveat', cursive", category: "HANDWRITING" },
];
const BUILDER_FONTS_BY_ID = Object.fromEntries(BUILDER_FONTS.map((f) => [f.id, f]));
