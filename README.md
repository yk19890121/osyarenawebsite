# BLENCI LAB

架空のミニマル・オーバーサイズファッションブランド「BLENCI」の素材を使った、Webデザインの実験サイト。

- **TOP** (`/`) — LAYOUTS / GIMMICKS / FONTS / BUILD への入口
- **LAYOUTS** (`/layouts/`) — 代表的なWebレイアウトパターン34種を3Dカバーフローで見比べるカタログ
- **GIMMICKS** (`/gimmicks/`) — Webでよく使う演出・ギミック120種の実験カタログ
- **FONTS** (`/fonts/`) — 書体50種のプレビューカタログ
- **BUILDER** (`/builder/`) — 上記のレイアウト・ギミック・フォントを組み合わせて、実際に動くサンプルを作り、別の開発者/AIへ引き継げる「BLUEPRINT」として書き出す実験室

## 使用技術
- Vanilla HTML / CSS / JS(ビルド不要、CDN非依存)
- [GSAP](https://gsap.com/) + ScrollTrigger / Draggable / Flip / Observer
- [Lenis](https://github.com/darkroomengineering/lenis) — スコープ付きスムーススクロール
- [JSZip](https://stuk.github.io/jszip/) — BUILDERのEXPORT BLUEPRINT機能でのZIP生成(ブラウザ内完結、サーバー/API不使用)

## 構成
```
index.html / js/top.js / css/top.css   — TOPページ
layouts/  gimmicks/  fonts/            — 各カタログ(index.html / css/style.css / js/main.js)
builder/                               — BUILDER(下記参照)
js/data.js                             — 72枚のルック画像メタデータ(LAYOUTS/GIMMICKS/FONTS共通)
js/cursor.js / css/cursor.css          — 全ページ共通のカーソル演出
assets/img/                            — 最適化済みWebP画像 + manifest.json
js/vendor/                             — GSAP・Lenis・JSZip等のローカルバンドル
scripts/dev_server.py                  — キャッシュを無効化するローカル開発サーバー
```

## BUILDER
`/builder/` は、既存カタログの資産(レイアウト・ギミック・フォント)を組み合わせて
「動くデザイン見本」を作り、EXPORT BLUEPRINTとしてZIPに書き出す機能です。
外部AI API・有料サービス・サーバーは一切使用せず、GitHub Pages上で完結します。

**現状(Version 1)の対応範囲:**
- レイアウト: 6種類(Editorial Split / Fullscreen Hero / Modular Card Grid /
  Storytelling Landing / Slide Deck Presentation / News Curation)
- ギミック: プレビューでライブに動くのは14種類(text-mask-reveal, split-character, fade-up,
  blur-reveal, clip-path-wipe, fade-in, soft-zoom, slow-parallax, magnetic-hover,
  underline-slide, fill-slide, scale-hover, noise-overlay, animated-gradient)
  — いずれも `/gimmicks/js/main.js` の既存実装から移植。
  残り106種類は「GIMMICK カタログ指定」機能でオブジェクトごとに番号指定でき、
  EXPORT BLUEPRINTの引き継ぎ資料に開発担当への指示として記載される
- プリセット: 10種類
- 未対応: モバイルでの詳細編集、スクリーンショット同梱、
  component-map.json / motion-spec.json / content-schema.json の出力
  (README.md と builder-config.json / design-tokens.json で代替)

### ディレクトリ構成
```
builder/
  index.html            シェル(3パネル: STRUCTURE / PREVIEW / INSPECTOR)
  css/builder.css
  js/
    data/layouts.js      レイアウトのメタデータ(オブジェクト一覧・初期テキスト)
    data/gimmicks.js      ギミックのメタデータ(id/event/applicableTo/defaultOptions/conflictsWith等)
    data/fonts.js          フォントのメタデータ
    data/presets.js        プリセット(レイアウト+フォント+配色+初期ギミック割当)
    layouts/editorial-split.js   レイアウトの構造HTML/CSSテンプレート
    runtime/state.js       状態管理(pageConfig) + localStorage永続化
    runtime/renderer.js     同一オリジンiframeへの反映・選択同期
    runtime/motion-engine.js ギミックの適用(entrance/hover/scroll/continuous)
    runtime/structure-panel.js / inspector.js / library-drawer.js  各UIパネル
    export/spec-generator.js       SPEC(Text/Markdown/JSON)生成
    export/blueprint-exporter.js   EXPORT BLUEPRINT ZIP生成
    main.js                初回起動フロー + 画面配線
```

### 追加方法
- **レイアウトを増やす**: `builder/js/data/layouts.js` の配列に1エントリ追加し、
  `builder/js/layouts/<id>.js` に `window.BUILDER_LAYOUT_TEMPLATES["<id>"] = { html, css }` を定義。
  `index.html` に `<script src="js/layouts/<id>.js">` を追加。
- **ギミックを増やす**: `builder/js/data/gimmicks.js` に1エントリ追加し、
  `builder/js/runtime/motion-engine.js` の該当イベントのテーブル(ENTRANCE/HOVER/SCROLL/CONTINUOUS)に
  実装を追加。可能な限り `/gimmicks/js/main.js` の既存実装を移植する。
- **フォントを増やす**: `builder/js/data/fonts.js` に1エントリ追加(Google Fontsの場合、
  `renderer.js` の `ensureFontLink` が自動でリンクを生成)。
- **プリセットを増やす**: `builder/js/data/presets.js` に1エントリ追加。
- **Export出力ファイルを増やす**: `builder/js/export/blueprint-exporter.js` の `exportBlueprint()` に
  `zip.file(...)` 呼び出しを追加。

## ローカル確認
```bash
python scripts/dev_server.py 8420
```
`http://localhost:8420` を開く。
(通常の `python -m http.server` はキャッシュ制御ヘッダーを送らず、編集後もブラウザが古いファイルを
表示し続けることがあるため、このプロジェクトでは上記のラッパーを使用しています。)

## 画像の再生成
`サンプル画像/ファッション/` 内のPNGから `assets/img/` へWebPを生成:
```bash
python scripts/process_images.py
```

## GitHub Pages公開
`main` ブランチを公開設定にすると、リポジトリ直下がそのまま配信されます。
BUILDERを含む全ページが相対パスのみで構成されているため、追加設定は不要です。
