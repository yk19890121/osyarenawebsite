/* BLENCI BUILDER — gimmick registry (Phase 1: 14 gimmicks, ported from /gimmicks/js/main.js) */
const BUILDER_GIMMICKS = [
  // ---- text (heading / text) — entrance ----
  {
    id: "text-mask-reveal", name: "Text Mask Reveal", category: "text", event: "entrance",
    applicableTo: ["heading", "text"], dependencies: ["gsap"], mobileSupport: "full", performance: "light",
    reducedMotionFallback: "fade-in",
    defaultOptions: { duration: 0.9, delay: 0, direction: "bottom", easing: "power4.out" },
    conflictsWith: [],
    desc: "行ごとにマスクがせり上がって現れる。",
  },
  {
    id: "split-character", name: "Split Character Reveal", category: "text", event: "entrance",
    applicableTo: ["heading"], dependencies: ["gsap"], mobileSupport: "full", performance: "medium",
    reducedMotionFallback: "fade-in",
    defaultOptions: { duration: 0.7, delay: 0, easing: "power4.out" },
    conflictsWith: [],
    desc: "1文字ずつずらして立ち上がる。",
  },
  {
    id: "fade-up", name: "Fade Up", category: "text", event: "entrance",
    applicableTo: ["heading", "text"], dependencies: ["gsap"], mobileSupport: "full", performance: "light",
    reducedMotionFallback: "fade-in",
    defaultOptions: { duration: 0.8, delay: 0, distance: 24, easing: "power3.out" },
    conflictsWith: [],
    desc: "下からふわっと浮かび上がる、もっとも軽量な定番。",
  },
  {
    id: "blur-reveal", name: "Blur Reveal", category: "text", event: "entrance",
    applicableTo: ["heading", "text"], dependencies: ["gsap"], mobileSupport: "full", performance: "medium",
    reducedMotionFallback: "fade-in",
    defaultOptions: { duration: 1, delay: 0, easing: "power2.out" },
    conflictsWith: [],
    desc: "ぼけた状態からピントが合うように現れる。",
  },

  // ---- image — entrance / hover / scroll ----
  {
    id: "clip-path-wipe", name: "Clip-path Wipe", category: "image", event: "entrance",
    applicableTo: ["image"], dependencies: ["gsap"], mobileSupport: "full", performance: "light",
    reducedMotionFallback: "fade-in",
    defaultOptions: { duration: 1.2, delay: 0, direction: "bottom", easing: "power4.out" },
    conflictsWith: [],
    desc: "カーテンを開けるように下から画像が現れる。",
  },
  {
    id: "fade-in", name: "Fade In", category: "image", event: "entrance",
    applicableTo: ["image"], dependencies: ["gsap"], mobileSupport: "full", performance: "light",
    reducedMotionFallback: "fade-in",
    defaultOptions: { duration: 0.9, delay: 0, easing: "power2.out" },
    conflictsWith: [],
    desc: "もっとも控えめな、単純なフェードイン。",
  },
  {
    id: "soft-zoom", name: "Soft Zoom", category: "image", event: "hover",
    applicableTo: ["image"], dependencies: ["gsap"], mobileSupport: "partial", performance: "light",
    reducedMotionFallback: "none",
    defaultOptions: { duration: 0.6, scale: 1.06, easing: "power2.out" },
    conflictsWith: [],
    desc: "カーソルを乗せるとわずかに拡大する。",
  },
  {
    id: "slow-parallax", name: "Slow Parallax", category: "image", event: "scroll",
    applicableTo: ["image"], dependencies: ["gsap", "ScrollTrigger"], mobileSupport: "partial", performance: "medium",
    reducedMotionFallback: "none",
    defaultOptions: { intensity: 0.25 },
    conflictsWith: [],
    desc: "スクロールに合わせて画像がゆっくりずれる。",
  },

  // ---- button — hover ----
  {
    id: "magnetic-hover", name: "Magnetic Hover", category: "button", event: "hover",
    applicableTo: ["button"], dependencies: ["gsap"], mobileSupport: "none", performance: "light",
    reducedMotionFallback: "none",
    defaultOptions: { intensity: 0.35, duration: 0.5 },
    conflictsWith: ["underline-slide", "fill-slide", "scale-hover"],
    desc: "カーソルに吸い寄せられるように動く。",
  },
  {
    id: "underline-slide", name: "Underline Slide", category: "button", event: "hover",
    applicableTo: ["button"], dependencies: [], mobileSupport: "full", performance: "light",
    reducedMotionFallback: "none",
    defaultOptions: { duration: 0.4 },
    conflictsWith: ["magnetic-hover", "fill-slide", "scale-hover"],
    desc: "下線が左から右へ伸びる。",
  },
  {
    id: "fill-slide", name: "Fill Slide", category: "button", event: "hover",
    applicableTo: ["button"], dependencies: [], mobileSupport: "full", performance: "light",
    reducedMotionFallback: "none",
    defaultOptions: { duration: 0.4 },
    conflictsWith: ["magnetic-hover", "underline-slide", "scale-hover"],
    desc: "背景色が下から塗りつぶすように広がる。",
  },
  {
    id: "scale-hover", name: "Scale Hover", category: "button", event: "hover",
    applicableTo: ["button"], dependencies: [], mobileSupport: "full", performance: "light",
    reducedMotionFallback: "none",
    defaultOptions: { scale: 1.06, duration: 0.3 },
    conflictsWith: ["magnetic-hover", "underline-slide", "fill-slide"],
    desc: "わずかに拡大して押せることを示す。",
  },

  // ---- background — continuous ----
  {
    id: "noise-overlay", name: "Noise Overlay", category: "background", event: "continuous",
    applicableTo: ["background"], dependencies: [], mobileSupport: "full", performance: "medium",
    reducedMotionFallback: "none",
    defaultOptions: { intensity: 0.4 },
    conflictsWith: ["animated-gradient"],
    desc: "うっすらとフィルムグレインを重ねる。",
  },
  {
    id: "animated-gradient", name: "Animated Gradient", category: "background", event: "continuous",
    applicableTo: ["background"], dependencies: [], mobileSupport: "full", performance: "medium",
    reducedMotionFallback: "none",
    defaultOptions: { duration: 12 },
    conflictsWith: ["noise-overlay"],
    desc: "背景のグラデーションがゆっくり動き続ける。",
  },
];

const BUILDER_GIMMICKS_BY_ID = Object.fromEntries(BUILDER_GIMMICKS.map((g) => [g.id, g]));
const BUILDER_EVENTS = ["entrance", "scroll", "hover", "click", "continuous"];
