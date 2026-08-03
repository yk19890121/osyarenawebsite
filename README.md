# BLENCI LAB — 120 Gimmicks Showcase

Webでよく使われる演出・ギミックを120種類集めた実験カタログ。架空のミニマル・オーバーサイズファッションブランド「BLENCI」のルックブック素材を使い、ひとつずつ動かしながら確認できます。

## 使用技術
- Vanilla HTML / CSS / JS(ビルド不要)
- [GSAP](https://gsap.com/) + ScrollTrigger / Draggable / Flip / Observer
- [Lenis](https://github.com/darkroomengineering/lenis) — スコープ付きスムーススクロール
- Web Audio API(トーンバー)

## 構成
- `index.html` / `css/style.css` / `js/main.js` — カタログ本体
- `js/data.js` — 72枚のルック画像メタデータ
- `assets/img/` — 最適化済みWebP画像
- `js/vendor/` — GSAP等のローカルバンドル(CDN非依存)

ギミックはA〜Sの19グループに分かれ、各セクションに `01 — 名称` のようなタグが付いています。

## ローカル確認
```bash
python -m http.server 8420
```
`http://localhost:8420` を開く。

## 画像の再生成
`サンプル画像/ファッション/` 内のPNGから `assets/img/` へWebPを生成:
```bash
python scripts/process_images.py
```
