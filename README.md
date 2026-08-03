# BLENCI — SS26 Lookbook

架空のミニマル・オーバーサイズファッションブランド「BLENCI」の、ギミック多用のティザー/ルックブックサイト。

## 使用技術
- Vanilla HTML / CSS / JS(ビルド不要)
- [GSAP](https://gsap.com/) + ScrollTrigger — スクロール連動アニメーション
- [Lenis](https://github.com/darkroomengineering/lenis) — スムーススクロール

## ギミック一覧
- プログレスローダー → カーテン開き
- カスタムカーソル(ホバーで拡大 / 画像プレビュー追従)
- マグネティックボタン
- ヒーローの文字マスクリビール & 背景クロスフェード
- 無限スクロールマーキー
- ピン留め横スクロールギャラリー
- スクロール連動の背景カラーモーフ(Featuredセクション)
- カウントアップ数字
- ホバー追従プレビュー付きインデックスリスト
- ルックブックグリッド + ライトボックス(4バリアント切り替え)

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
