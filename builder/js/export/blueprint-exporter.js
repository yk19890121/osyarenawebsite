/* BLENCI BUILDER — EXPORT BLUEPRINT. Bundles a working standalone preview
   plus design-token / config JSON and a handoff prompt into one ZIP,
   entirely in-browser (JSZip, Blob, fetch of same-origin files — no
   server, no API). */
window.Builder = window.Builder || {};

(() => {
  "use strict";

  async function fetchText(url) { return (await fetch(url)).text(); }
  async function fetchBlob(url) { return (await fetch(url)).blob(); }

  function extFromMime(mime) {
    if (mime === "image/png") return "png";
    if (mime === "image/webp") return "webp";
    if (mime === "image/jpeg") return "jpg";
    if (mime === "image/gif") return "gif";
    return "jpg";
  }

  async function resolveImageAsset(zip, objectId, source) {
    if (!source) return null;
    const blob = await fetchBlob(source);
    let filename;
    if (source.startsWith("blob:")) filename = `${objectId}.${extFromMime(blob.type)}`;
    else filename = source.split("/").pop();
    zip.file(`preview/assets/${filename}`, blob);
    return `assets/${filename}`;
  }

  function bakedObjectHtml(tpl, state) {
    // Parse the layout's template HTML, bake final content, drop the raw
    // template's placeholder emptiness so the exported file looks right
    // with zero JS (motion still needs JS, but content/layout do not).
    const doc = new DOMParser().parseFromString(`<div id="bp-root">${tpl.html}</div>`, "text/html");
    Object.keys(state.objects).forEach((id) => {
      const obj = state.objects[id];
      const el = doc.querySelector(`[data-object-id="${id}"]`);
      if (!el) return;
      if (obj.type === "heading" || obj.type === "text") {
        el.textContent = obj.content;
      } else if (obj.type === "button") {
        el.innerHTML = `<span class="es-button__fill"></span><span class="es-button__label">${obj.content}</span><span class="es-button__underline"></span>`;
        el.setAttribute("href", obj.url || "#");
      } else if (obj.type === "image") {
        const img = el.querySelector("img");
        if (img) { img.setAttribute("src", obj.__resolvedSrc || ""); img.setAttribute("alt", obj.alt || ""); }
      }
      if (obj.style && obj.style.objectPosition) {
        const img = el.querySelector("img");
        if (img) img.style.objectPosition = obj.style.objectPosition;
      }
    });
    return doc.getElementById("bp-root").innerHTML;
  }

  function bakedCss(tpl, state) {
    const headingFont = BUILDER_FONTS_BY_ID[state.fonts.heading];
    const bodyFont = BUILDER_FONTS_BY_ID[state.fonts.body];
    return tpl.css.replace(
      ":root{",
      `:root{--bp-bg:${state.palette.background};--bp-surface:${state.palette.surface || state.palette.background};` +
      `--bp-text:${state.palette.text};--bp-accent:${state.palette.accent};` +
      `--bp-ff-heading:${headingFont.family};--bp-ff-body:${bodyFont.family};`
    );
  }

  function googleFontsHref(state) {
    const families = [state.fonts.heading, state.fonts.body]
      .map((id) => BUILDER_FONTS_BY_ID[id]).filter(Boolean)
      .map((f) => f.name.replace(/ /g, "+") + ":wght@400;500;700;900");
    return "https://fonts.googleapis.com/css2?" + families.map((f) => "family=" + f).join("&") + "&display=swap";
  }

  function trimmedStateForRuntime(state) {
    const objects = {};
    Object.keys(state.objects).forEach((id) => { objects[id] = { effects: state.objects[id].effects }; });
    return { objects, reducedMotion: state.reducedMotion };
  }

  function buildBuilderConfig(state) {
    const objects = {};
    Object.keys(state.objects).forEach((id) => {
      const o = state.objects[id];
      objects[id] = {
        type: o.type, role: o.role,
        motion: Object.fromEntries(Object.keys(o.effects || {}).map((ev) => [ev, o.effects[ev].id])),
        catalogGimmicksToImplement: (o.catalogGimmicks || []).map((g) => ({ number: g.num, name: g.name, group: g.group })),
      };
    });
    return { version: 1, layout: state.layout, preset: state.preset, fonts: state.fonts, palette: state.palette, objects };
  }

  function buildDesignTokens(state) {
    const headingFont = BUILDER_FONTS_BY_ID[state.fonts.heading];
    const bodyFont = BUILDER_FONTS_BY_ID[state.fonts.body];
    return {
      colors: { background: state.palette.background, surface: state.palette.surface || state.palette.background, textPrimary: state.palette.text, accent: state.palette.accent },
      typography: { headingFamily: headingFont.name, bodyFamily: bodyFont.name, heroSize: "clamp(40px, 6vw, 80px)", bodySize: "16px" },
      spacing: { sectionDesktop: "96px", sectionMobile: "56px", contentGap: "32px" },
      breakpoints: { mobile: "767px", tablet: "1023px" },
    };
  }

  function buildReadme(state, layout) {
    const headingFont = BUILDER_FONTS_BY_ID[state.fonts.heading];
    const bodyFont = BUILDER_FONTS_BY_ID[state.fonts.body];
    const motionLines = [];
    Object.keys(state.objects).forEach((id) => {
      const obj = state.objects[id];
      const events = Object.keys(obj.effects || {});
      if (!events.length) return;
      motionLines.push(`${obj.label}:`);
      events.forEach((ev) => motionLines.push(`  ${ev}: ${BUILDER_GIMMICKS_BY_ID[obj.effects[ev].id].name}`));
    });
    const catalogLines = [];
    Object.keys(state.objects).forEach((id) => {
      const obj = state.objects[id];
      const picks = obj.catalogGimmicks || [];
      if (!picks.length) return;
      catalogLines.push(`${obj.label}:`);
      picks.forEach((g) => catalogLines.push(`  - #${g.num} ${g.name} (${g.group})`));
    });
    const catalogSection = catalogLines.length ? `

## 追加で実装してほしいギミック（カタログ参考指定）
以下は、このBLUEPRINTのプレビューには含まれていません（このBuilderでは実際に動かせない、
または今回のBuilder側で未実装のギミックのため）。ただし、本番制作では以下のオブジェクトに
以下のギミックを実装してください。番号は BLENCI LAB の /gimmicks/ カタログのものです。

${catalogLines.join("\n")}` : "";
    return `# DESIGN BLUEPRINT

## 基本構成
使用レイアウト: ${layout.name}
想定用途: ${layout.use}

## デザイン方針
- ${layout.description}
- 背景 ${state.palette.background} / 文字 ${state.palette.text} / アクセント ${state.palette.accent}
- 見出し: ${headingFont.name} / 本文: ${bodyFont.name}

## モーション
${motionLines.join("\n")}
${catalogSection}

## 本番制作で変更するもの
- サイト名、タイトル、本文、画像、ロゴ、CTA
- ページ数、ナビゲーション、実際のリンク

## 原則維持するもの
- 基本レイアウトと情報の優先順位
- 余白と画像比率
- フォントの方向性とカラーバランス
- モーションの速度と強さ

## Version 1 の制約 (このBLUEPRINTに含まれないもの)
- レイアウトは6種類から選択可能 (Editorial Split / Fullscreen Hero / Modular Card Grid /
  Storytelling Landing / Slide Deck Presentation / News Curation)
- このプレビューでライブに動くギミックは14種類のみ。残り106種類は実際には動かせないが、
  「GIMMICK カタログ指定」機能でオブジェクトごとに番号指定でき、上の「追加で実装してほしい
  ギミック」に記載される
- component-map.json / motion-spec.json / content-schema.json / スクリーンショットは未生成
  (builder-config.json と design-tokens.json、この README で代替してください)
`;
  }

  function buildHandoffPrompt(state) {
    const catalogPicks = [];
    Object.keys(state.objects).forEach((id) => {
      const obj = state.objects[id];
      (obj.catalogGimmicks || []).forEach((g) => catalogPicks.push(`${obj.label}: #${g.num} ${g.name}`));
    });
    const catalogNote = catalogPicks.length ? `

## 追加実装が必要なギミック（重要）
このプレビューには含まれていませんが、以下のオブジェクトには以下のギミックを追加で
実装してください（README.md の「追加で実装してほしいギミック」に詳細があります）。
${catalogPicks.map((l) => `- ${l}`).join("\n")}
` : "";
    return `添付されたBLENCI LABのサンプルを、今回制作するWebサイトの
デザインおよびインタラクションの基準として使用してください。

最初に以下を確認してください。

1. preview/index.html を実行し、デスクトップおよびモバイルで確認する
2. README.md を読み、維持すべきデザイン方針を把握する
3. blueprint/builder-config.json と design-tokens.json を読み、
   オブジェクトの役割・配色・タイポグラフィ・モーション・追加実装ギミック(catalogGimmicksToImplement)を確認する
4. 私が追加で渡す原稿、画像、ロゴ、要件を適用する
${catalogNote}

サンプル内の仮テキストや仮画像を、そのまま使用する必要はありません。
実際の原稿、画像、ロゴへ置き換えてください。

ただし、以下は可能な限り維持してください。
- レイアウトの基本構造 / 情報の優先順位
- 余白と比率 / タイポグラフィの方向性 / カラーバランス
- オブジェクトごとのモーションと、その速度・強さ
- レスポンシブ時のデザイン意図

単純にサンプルHTMLの文字と画像を差し替えるのではなく、
今回の目的、ページ数、情報量に合わせて本番サイトとして再設計してください。
サンプルでオブジェクトが少なく、本番の情報量が多い場合などは、
デザイン思想を維持しながら、実際のコンテンツ数に対応した構造へ拡張してください。

本番サイトに必要な以下の項目も実装してください。
- 正式なナビゲーション / SEO情報 / アクセシビリティ / レスポンシブ対応
- 実際のリンク / フォーム / 必要な機能 / パフォーマンス最適化

実装後は、サンプルとの視覚的・動作的な差異を比較し、
意図しない差異があれば修正してください。
`;
  }

  async function exportBlueprint(onProgress) {
    const state = Builder.state.get();
    const layout = BUILDER_LAYOUTS.find((l) => l.id === state.layout);
    const tpl = BUILDER_LAYOUT_TEMPLATES[state.layout];
    const zip = new JSZip();

    onProgress && onProgress("画像を収集しています…");
    for (const id of Object.keys(state.objects)) {
      const obj = state.objects[id];
      if (obj.type === "image" && obj.source) {
        obj.__resolvedSrc = await resolveImageAsset(zip, id, obj.source);
      }
    }

    onProgress && onProgress("プレビューを書き出しています…");
    const bodyHtml = bakedObjectHtml(tpl, state);
    const css = bakedCss(tpl, state);
    zip.file("preview/style.css", css);

    const runtimeJs = await fetchText("js/data/gimmicks.js") + "\n" + await fetchText("js/runtime/motion-engine.js");
    const bootJs = `\n(function(){\n  var STATE = ${JSON.stringify(trimmedStateForRuntime(state))};\n  window.addEventListener('DOMContentLoaded', function(){\n    if (window.gsap && window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);\n    Builder.motion.applyAll(window, document, STATE);\n  });\n})();\n`;
    zip.file("preview/script.js", runtimeJs + bootJs);

    onProgress && onProgress("ライブラリを同梱しています…");
    zip.file("preview/vendor/gsap.min.js", await fetchBlob("../js/vendor/gsap.min.js"));
    zip.file("preview/vendor/ScrollTrigger.min.js", await fetchBlob("../js/vendor/ScrollTrigger.min.js"));

    const html = `<!doctype html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${layout.name} — BLENCI Blueprint Preview</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="${googleFontsHref(state)}" rel="stylesheet">
<link rel="stylesheet" href="style.css">
</head>
<body>
${bodyHtml}
<script src="vendor/gsap.min.js"></script>
<script src="vendor/ScrollTrigger.min.js"></script>
<script src="script.js"></script>
</body>
</html>`;
    zip.file("preview/index.html", html);

    onProgress && onProgress("設計情報を書き出しています…");
    zip.file("blueprint/builder-config.json", JSON.stringify(buildBuilderConfig(state), null, 2));
    zip.file("blueprint/design-tokens.json", JSON.stringify(buildDesignTokens(state), null, 2));
    zip.file("README.md", buildReadme(state, layout));
    zip.file("HANDOFF_PROMPT.md", buildHandoffPrompt(state));

    onProgress && onProgress("ZIPを生成しています…");
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blenci-blueprint.zip";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  window.Builder.blueprintExporter = { exportBlueprint };
})();
