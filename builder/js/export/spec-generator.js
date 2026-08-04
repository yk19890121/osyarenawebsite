/* BLENCI BUILDER — human-readable SPEC generator (Plain Text / Markdown / JSON). */
window.Builder = window.Builder || {};

(() => {
  "use strict";

  function objectSpecLines(id, obj) {
    const lines = [];
    lines.push(obj.label.toUpperCase());
    Object.keys(obj.effects || {}).forEach((event) => {
      const eff = obj.effects[event];
      const meta = BUILDER_GIMMICKS_BY_ID[eff.id];
      if (!meta) return;
      lines.push(`  ${event.toUpperCase()}: ${meta.name}`);
      Object.keys(meta.defaultOptions).forEach((k) => {
        if (k === "direction" || k === "easing") return;
        const v = eff[k] != null ? eff[k] : meta.defaultOptions[k];
        lines.push(`    ${k}: ${v}`);
      });
    });
    (obj.catalogGimmicks || []).forEach((g) => lines.push(`  CATALOG REF: #${g.num} ${g.name}`));
    return lines;
  }

  function toPlainText(state) {
    const layout = BUILDER_LAYOUTS.find((l) => l.id === state.layout);
    const lines = [];
    lines.push("LAYOUT", "  " + layout.name, "");
    lines.push("FONTS", `  Heading: ${BUILDER_FONTS_BY_ID[state.fonts.heading].name}`, `  Body: ${BUILDER_FONTS_BY_ID[state.fonts.body].name}`, "");
    lines.push("COLORS", `  Background: ${state.palette.background}`, `  Text: ${state.palette.text}`, `  Accent: ${state.palette.accent}`, "");
    Object.keys(state.objects).forEach((id) => {
      const objLines = objectSpecLines(id, state.objects[id]);
      if (objLines.length > 1) { lines.push(...objLines, ""); }
    });
    return lines.join("\n").trim() + "\n";
  }

  function toMarkdown(state) {
    const layout = BUILDER_LAYOUTS.find((l) => l.id === state.layout);
    const md = [];
    md.push(`# DESIGN SPEC — ${layout.name}`, "");
    md.push("## Fonts", `- Heading: ${BUILDER_FONTS_BY_ID[state.fonts.heading].name}`, `- Body: ${BUILDER_FONTS_BY_ID[state.fonts.body].name}`, "");
    md.push("## Colors", `- Background: \`${state.palette.background}\``, `- Text: \`${state.palette.text}\``, `- Accent: \`${state.palette.accent}\``, "");
    md.push("## Motion");
    Object.keys(state.objects).forEach((id) => {
      const obj = state.objects[id];
      const events = Object.keys(obj.effects || {});
      const catalogPicks = obj.catalogGimmicks || [];
      if (!events.length && !catalogPicks.length) return;
      md.push(`### ${obj.label}`);
      events.forEach((event) => {
        const eff = obj.effects[event];
        const meta = BUILDER_GIMMICKS_BY_ID[eff.id];
        if (!meta) return;
        md.push(`- **${event}**: ${meta.name}`);
      });
      catalogPicks.forEach((g) => md.push(`- **catalog ref**: #${g.num} ${g.name} _(to implement, not live in this preview)_`));
      md.push("");
    });
    return md.join("\n").trim() + "\n";
  }

  function toJSON(state) {
    return JSON.stringify(state, null, 2);
  }

  window.Builder.specGenerator = { toPlainText, toMarkdown, toJSON };
})();
