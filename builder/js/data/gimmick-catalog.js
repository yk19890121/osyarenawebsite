/* BLENCI BUILDER — full GIMMICKS catalogue (reference only), derived from
   the single source of truth at /gimmicks/js/data/catalog.js (loaded via
   <script> just before this file in builder/index.html). These entries are
   NOT rendered live in the Builder preview -- selecting one just records an
   instruction ("use gimmick T01 / GRADIENT SWEEP TEXT on this object") that
   flows into the EXPORT BLUEPRINT hand-off materials. Field names (num/
   name/group) are kept stable so library-drawer.js / blueprint-exporter.js
   / spec-generator.js don't need to know about the category system --
   `num` is now the short display code (e.g. "T01") instead of the old
   flat 1-120 number, and `group` is the category label. */
window.BUILDER_GIMMICK_CATALOG = window.GIMMICK_CATALOG.map((g) => ({
  num: g.displayCode,
  name: g.name,
  group: window.GIMMICK_CATEGORIES_BY_ID[g.category].label,
  category: g.category,
  isNew: !!g.isNew,
}));
window.BUILDER_GIMMICK_CATALOG_GROUPS = Array.from(new Set(window.BUILDER_GIMMICK_CATALOG.map((g) => g.group)));
