/* BLENCI BUILDER — layout registry (Phase 1: 1 layout) */
const BUILDER_LAYOUTS = [
  {
    id: "editorial-split",
    name: "Editorial Split",
    thumbnail: "../assets/img/look-01-0-thumb.webp",
    description: "テキストと写真を非対称の2カラムに構成する型。ブランドストーリーやポートフォリオに向く。",
    sectionCount: 1,
    objectCount: 6,
    use: "Brand story / Corporate / Portfolio",
    objects: [
      { id: "hero-background", type: "background", role: "primary-background", label: "Background" },
      { id: "eyebrow", type: "text", role: "eyebrow", label: "Eyebrow" },
      { id: "hero-title", type: "heading", role: "primary-heading", label: "Main Title" },
      { id: "hero-description", type: "text", role: "body-copy", label: "Description" },
      { id: "hero-button", type: "button", role: "primary-cta", label: "CTA Button" },
      { id: "hero-image", type: "image", role: "primary-visual", label: "Main Image" },
    ],
    defaults: {
      "eyebrow": { content: "BLENCI LAB" },
      "hero-title": { content: "DESIGN THE\nEXPERIENCE" },
      "hero-description": { content: "Explore layouts, typography and motion — then combine them into a working sample." },
      "hero-button": { content: "EXPLORE", url: "#" },
      "hero-image": { source: "../assets/img/look-14-0.webp", alt: "Editorial fashion photograph" },
    },
  },
];
