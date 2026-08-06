/* BLENCI LAB — GIMMICK CATALOG data layer.
   Single source of truth for the new category system: 11 categories, a
   short user-facing displayCode per gimmick (e.g. "T01"), and a stable
   internal id (e.g. "gimmick.text.001") for AI/tooling use.

   displayCode/id are DERIVED, not hand-typed: each entry below only needs
   `category` (and `legacyNumber` for the 119 gimmicks migrated from the
   old flat A-S numbering — see README.md's migration table). Order within
   this array is the order codes are assigned in, so entries are grouped
   by category and, within a category, ordered by legacy number first,
   then newly-added gimmicks (which is why new gimmicks always get the
   highest number in their category, e.g. a new TEXT gimmick becomes T14
   when 13 already exist).

   This file does not implement any animation itself — gimmicks/js/main.js
   still owns all 120 original implementations unchanged, and
   gimmicks/js/gimmicks-new.js owns the newly added ones. This file only
   maps legacy DOM elements (matched by their existing #gNN id) into the
   new category sections and attaches the metadata used by the catalogue
   page's sidebar, search, and cards. */
window.GIMMICK_CATEGORIES = [
  { id: "text", label: "TEXT", prefix: "T", description: "文字、見出し、文章に使用する演出", order: 1 },
  { id: "image", label: "IMAGE", prefix: "I", description: "単体画像・キービジュアルに使用する演出", order: 2 },
  { id: "gallery", label: "GALLERY", prefix: "G", description: "複数画像・作品一覧・商品一覧に使用する演出", order: 3 },
  { id: "card", label: "CARD", prefix: "C", description: "カード・パネル・記事一覧に使用する演出", order: 4 },
  { id: "scroll", label: "SCROLL", prefix: "S", description: "スクロール操作に連動する演出", order: 5 },
  { id: "cursor", label: "CURSOR", prefix: "U", description: "マウスカーソル・ポインターに連動する演出", order: 6 },
  { id: "background", label: "BACKGROUND", prefix: "B", description: "背景装飾・背景アニメーションの演出", order: 7 },
  { id: "button", label: "BUTTON", prefix: "A", description: "CTA・ボタン・操作要素の演出", order: 8 },
  { id: "navigation", label: "NAVIGATION", prefix: "N", description: "ナビゲーション・メニュー・画面移動の演出", order: 9 },
  { id: "transition", label: "TRANSITION", prefix: "R", description: "ページ遷移・セクション遷移・ローディングの演出", order: 10 },
  { id: "physics", label: "PHYSICS", prefix: "P", description: "重力・慣性・衝突・ドラッグなど物理演算的な演出", order: 11 },
];
window.GIMMICK_CATEGORIES_BY_ID = Object.fromEntries(window.GIMMICK_CATEGORIES.map((c) => [c.id, c]));

/* legacyNumber matches the existing <article class="demo" id="gNN"> in
   gimmicks/index.html ("g8g9" for the merged 08+09 pair, "g1".."g120"
   otherwise). isNew:true entries have no legacy DOM element -- their
   markup lives in gimmicks/js/gimmicks-new.js's template and is inserted
   directly into the right category section. */
window.GIMMICK_CATALOG = [
  // ---------------- TEXT ----------------
  { legacyNumber: "12", category: "text", name: "TEXT SCRAMBLE", nameJa: "文字スクランブル収束", shortDescription: "ランダム文字から正しい文字列へ収束する", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "13", category: "text", name: "TYPEWRITER EFFECT", nameJa: "タイプライター表示", shortDescription: "1文字ずつ打ち込まれるように表示する", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "25", category: "text", name: "ODOMETER COUNTER", nameJa: "オドメーターカウンター", shortDescription: "スロット風に数字が回って止まる", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "35", category: "text", name: "TEXT MASK REVEAL", nameJa: "文字マスクリベール", shortDescription: "行ごとにマスクがせり上がって現れる", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "36", category: "text", name: "SPLIT CHARACTER REVEAL", nameJa: "文字分割ライズ", shortDescription: "1文字ずつずらして立ち上がる", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "38", category: "text", name: "INFINITE MARQUEE", nameJa: "無限マーキー", shortDescription: "電光掲示板のような無限スクロール文字", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "44", category: "text", name: "COUNT-UP NUMBER", nameJa: "カウントアップ数字", shortDescription: "0からゆっくり数字が増える", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "59", category: "text", name: "VARIABLE FONT MORPH", nameJa: "可変フォントモーフ", shortDescription: "マウス位置で文字の太さが連続変化する", motionLevel: "medium", performanceCost: "medium", mobileSupport: false },
  { legacyNumber: "68", category: "text", name: "3D CHARACTER FLIP-IN", nameJa: "文字の立体反転出現", shortDescription: "1文字ずつ立体的に回転して現れる", motionLevel: "high", performanceCost: "medium", mobileSupport: true },
  { legacyNumber: "72", category: "text", name: "PARTICLE TEXT FORMATION", nameJa: "粒子文字フォーメーション", shortDescription: "粒子が集まって文字になる", motionLevel: "high", performanceCost: "high", mobileSupport: false },
  { legacyNumber: "83", category: "text", name: "FLIP-CLOCK DIGIT", nameJa: "フリップクロック数字", shortDescription: "空港表示板のようにめくれる数字", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "92", category: "text", name: "EYE-TRACKING LETTERS", nameJa: "文字の視線追従", shortDescription: "文字がカーソルの方を見る", motionLevel: "medium", performanceCost: "low", mobileSupport: false },
  { legacyNumber: "105", category: "text", name: "SCROLL WAVE TEXT", nameJa: "スクロール波形文字", shortDescription: "スクロールに合わせて文字が波打つ", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { isNew: true, category: "text", name: "GRADIENT SWEEP TEXT", nameJa: "グラデーションスイープ文字", shortDescription: "見出しの上をグラデーションの光が一度だけ通り過ぎる", motionLevel: "low", performanceCost: "low", mobileSupport: true,
    description: "見出しテキストにグラデーションのハイライトが左から右へ一度だけ流れ、注目を集めながらも静かな印象を保つ。",
    mood: ["premium", "clean", "modern"], impact: "medium",
    parameters: { duration: { type: "number", default: 1.4, min: 0.6, max: 3 }, width: { type: "number", default: 35, min: 10, max: 80 }, angle: { type: "number", default: 20, min: -45, max: 45 } } },
  { isNew: true, category: "text", name: "STICKER POP TEXT", nameJa: "ステッカーポップ文字", shortDescription: "画面に入ると、見出しに硬いオフセット影がポンと飛び出す", motionLevel: "low", performanceCost: "low", mobileSupport: true,
    description: "通常はフラットな見出しが、スクロールで画面に入ると硬いオフセットシャドウがついてステッカーのように飛び出す。ポップな印象を一瞬で与える。",
    mood: ["playful", "bold", "modern"], impact: "medium",
    parameters: { offset: { type: "number", default: 6, min: 2, max: 14 }, duration: { type: "number", default: 0.5, min: 0.2, max: 1.2 } } },

  // ---------------- IMAGE ----------------
  { legacyNumber: "11", category: "image", name: "BEFORE / AFTER SLIDER", nameJa: "ビフォーアフタースライダー", shortDescription: "境界線をドラッグして2枚の写真を比較する", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "15", category: "image", name: "SVG LINE DRAWING", nameJa: "SVGライン描画", shortDescription: "線が線をなぞるように出現する", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "24", category: "image", name: "HOVER FLIPBOOK", nameJa: "ホバーフリップブック", shortDescription: "ホバー中だけ複数カットが高速切替する", motionLevel: "medium", performanceCost: "low", mobileSupport: false },
  { legacyNumber: "28", category: "image", name: "KEN BURNS EFFECT", nameJa: "ケンバーンズ効果", shortDescription: "静止画がゆっくりズーム・移動し続ける", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "42", category: "image", name: "CLIP-PATH WIPE REVEAL", nameJa: "ワイプリベール", shortDescription: "下からカーテンを開けるように画像が現れる", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "48", category: "image", name: "GRAIN OVERLAY", nameJa: "グレインオーバーレイ", shortDescription: "うっすらノイズを重ねてフィルム質感にする", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "57", category: "image", name: "CLICK SCREEN RIPPLE", nameJa: "クリック水面リップル", shortDescription: "クリックした位置から水面のように歪む", motionLevel: "medium", performanceCost: "medium", mobileSupport: true },
  { legacyNumber: "63", category: "image", name: "MAGNIFIER LENS", nameJa: "マグニファイアレンズ", shortDescription: "虫眼鏡のように写真の一部を拡大する", motionLevel: "low", performanceCost: "low", mobileSupport: false },
  { legacyNumber: "70", category: "image", name: "TORN PAPER REVEAL", nameJa: "破れ紙リベール", shortDescription: "破れた紙の縁から画像が現れる", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "71", category: "image", name: "EXPLODED VIEW DIAGRAM", nameJa: "分解図ダイアグラム", shortDescription: "パーツが分解した状態から組み上がる", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "77", category: "image", name: "GLITCH SLICE HOVER", nameJa: "グリッチスライスホバー", shortDescription: "ホバーでVHS風にスライスがズレる", motionLevel: "high", performanceCost: "low", mobileSupport: false },
  { legacyNumber: "78", category: "image", name: "PEEL-BACK DRAG REVEAL", nameJa: "ピールバックリベール", shortDescription: "角をドラッグしてめくり取るように見せる", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "115", category: "image", name: "SCRATCH-TO-REVEAL", nameJa: "スクラッチリベール", shortDescription: "削って中の写真を見せる", motionLevel: "medium", performanceCost: "medium", mobileSupport: true },
  { isNew: true, category: "image", name: "DUOTONE HOVER REVEAL", nameJa: "デュオトーンホバーリベール", shortDescription: "静止画はデュオトーン、ホバーで実写のフルカラーに戻る", motionLevel: "low", performanceCost: "low", mobileSupport: true,
    description: "通常時はブランドカラーの2色調で表示し、ホバー（タッチ端末はタップ）すると滑らかにフルカラー写真へ切り替わる。一覧性と高級感を両立する。",
    mood: ["premium", "editorial", "minimal"], impact: "medium",
    parameters: { duration: { type: "number", default: 0.6, min: 0.2, max: 1.5 }, colorA: { type: "color", default: "#1c1a17" }, colorB: { type: "color", default: "#ff7847" } } },
  { isNew: true, category: "image", name: "PARALLAX TILT IMAGE", nameJa: "パララックスチルト画像", shortDescription: "カーソルに合わせて画像がわずかに傾き、ガラスのような光沢が動く", motionLevel: "medium", performanceCost: "low", mobileSupport: false,
    description: "画像単体にカーソル追従の3D傾きを付け、表面を横切るハイライト（グレア）が連動して動く。単体画像を主役にしたいキービジュアル向け。",
    mood: ["premium", "technology", "clean"], impact: "medium",
    parameters: { maxTilt: { type: "number", default: 10, min: 2, max: 25 } } },

  // ---------------- GALLERY ----------------
  { legacyNumber: "10", category: "gallery", name: "DRAG-SCROLL GALLERY", nameJa: "ドラッグスクロールギャラリー", shortDescription: "掴んで引っ張る横スクロールギャラリー", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "16", category: "gallery", name: "STICKY STACKING CARDS", nameJa: "スティッキースタック", shortDescription: "カードが順番に貼りついて積み上がる", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "40", category: "gallery", name: "PINNED HORIZONTAL GALLERY", nameJa: "ピン留め横移動ギャラリー", shortDescription: "縦スクロールが横移動に変わる", motionLevel: "medium", performanceCost: "medium", mobileSupport: true },
  { legacyNumber: "45", category: "gallery", name: "STAGGERED FADE-IN GRID", nameJa: "スタガードフェードグリッド", shortDescription: "順番にずれて浮かび上がるグリッド", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "46", category: "gallery", name: "LIGHTBOX MODAL", nameJa: "ライトボックスモーダル", shortDescription: "クリックで写真を全画面表示する", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "65", category: "gallery", name: "3D COVERFLOW CAROUSEL", nameJa: "3Dカバーフローカルーセル", shortDescription: "中央を軸に立体的に並ぶカルーセル", motionLevel: "high", performanceCost: "medium", mobileSupport: true },
  { legacyNumber: "80", category: "gallery", name: "3D CUBE GALLERY", nameJa: "3Dキューブギャラリー", shortDescription: "ドラッグで回る立方体ギャラリー", motionLevel: "high", performanceCost: "medium", mobileSupport: true },
  { legacyNumber: "85", category: "gallery", name: "3D SPHERE GALLERY", nameJa: "3Dスフィアギャラリー", shortDescription: "球体の表面を回る写真たち", motionLevel: "high", performanceCost: "medium", mobileSupport: false },
  { legacyNumber: "87", category: "gallery", name: "3D BOOK PAGE TURN", nameJa: "3Dページターン", shortDescription: "本のページをめくるように写真を見せる", motionLevel: "high", performanceCost: "medium", mobileSupport: true },
  { legacyNumber: "88", category: "gallery", name: "DEPTH-PARALLAX GRID", nameJa: "デプスパララックスグリッド", shortDescription: "カーソルに近いタイルが浮き上がる", motionLevel: "medium", performanceCost: "low", mobileSupport: false },
  { legacyNumber: "89", category: "gallery", name: "3D ORBIT RING CAROUSEL", nameJa: "3Dオービットリング", shortDescription: "軌道を描いて回るリング状ギャラリー", motionLevel: "high", performanceCost: "medium", mobileSupport: false },
  { legacyNumber: "113", category: "gallery", name: "DRAG-REORDER LIST", nameJa: "ドラッグ並び替えリスト", shortDescription: "ドラッグして一覧の並び順を変える", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { isNew: true, category: "gallery", name: "BENTO GRID REVEAL", nameJa: "ベントーグリッドリベール", shortDescription: "大小不揃いのグリッドが、スクロールで升目ごとに順番に現れる", motionLevel: "medium", performanceCost: "low", mobileSupport: true,
    description: "雑誌のようなベント―ボックス配置（大小混在のグリッド）で作品を並べ、スクロールで画面に入るごとに升目単位でフェード＋わずかな拡大で現れる。",
    mood: ["editorial", "modern", "bold"], impact: "medium",
    parameters: { stagger: { type: "number", default: 0.08, min: 0, max: 0.3 }, distance: { type: "number", default: 24, min: 0, max: 80 } } },
  { isNew: true, category: "gallery", name: "MASONRY HOVER SPREAD", nameJa: "メイソンリーホバースプレッド", shortDescription: "ホバーした画像だけが横に広がり、隣が押しやられる", motionLevel: "medium", performanceCost: "low", mobileSupport: false,
    description: "横並びの画像列で、カーソルを乗せた1枚だけが幅を広げて主役になり、両隣は押しやられるように縮む。一覧性と一点集中を両立するギャラリー演出。",
    mood: ["editorial", "modern", "bold"], impact: "medium",
    parameters: { growFlex: { type: "number", default: 3, min: 1.5, max: 5 }, duration: { type: "number", default: 0.5, min: 0.2, max: 1 } } },

  // ---------------- CARD ----------------
  { legacyNumber: "g8g9", category: "card", name: "3D TILT CARD / SHINE SWEEP", nameJa: "3Dチルト＆シャインスイープ", shortDescription: "マウス位置でカードが傾き、光が一度だけ走る", motionLevel: "medium", performanceCost: "low", mobileSupport: false },
  { legacyNumber: "17", category: "card", name: "FLIP CARD EXPAND", nameJa: "フリップカード展開", shortDescription: "クリックでその場から滑らかに拡大展開する", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "53", category: "card", name: "SWIPE CARD DECK", nameJa: "スワイプカードデッキ", shortDescription: "左右にスワイプして次のカードへ送る", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "64", category: "card", name: "MOTION GHOST TRAIL", nameJa: "モーションゴーストトレイル", shortDescription: "ドラッグすると残像が伸びて追従する", motionLevel: "high", performanceCost: "medium", mobileSupport: true },
  { legacyNumber: "66", category: "card", name: "PAGE CORNER PEEL", nameJa: "ページコーナーピール", shortDescription: "ホバーでカードの角がめくれる", motionLevel: "low", performanceCost: "low", mobileSupport: false },
  { legacyNumber: "81", category: "card", name: "LAYERED PARALLAX 3D CARD", nameJa: "レイヤードパララックスカード", shortDescription: "複数レイヤーが立体的に浮くカード", motionLevel: "medium", performanceCost: "low", mobileSupport: false },
  { legacyNumber: "86", category: "card", name: "ISOMETRIC HOVER CARD", nameJa: "アイソメトリックホバーカード", shortDescription: "ホバーで等角投影のまま浮き上がる", motionLevel: "low", performanceCost: "low", mobileSupport: false },
  { legacyNumber: "95", category: "card", name: "CARD FAN RIFFLE", nameJa: "カードファンリフル", shortDescription: "カーソルでトランプの束をめくるように広がる", motionLevel: "medium", performanceCost: "low", mobileSupport: false },
  { legacyNumber: "107", category: "card", name: "JELLY WOBBLE CARD", nameJa: "ジェリーウォブルカード", shortDescription: "ホバーでぷるぷると揺れるカード", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { isNew: true, category: "card", name: "EDGE GLOW CARD", nameJa: "エッジグロウカード", shortDescription: "カーソルに合わせてカードの縁だけが柔らかく光る", motionLevel: "low", performanceCost: "low", mobileSupport: false,
    description: "カード内でカーソルを動かすと、その位置に応じてカードの外周（ボーダー）だけが柔らかく発光する。中身の写真やテキストを邪魔しない控えめな存在感の演出。",
    mood: ["premium", "technology", "clean"], impact: "low",
    parameters: { radius: { type: "number", default: 160, min: 60, max: 320 }, intensity: { type: "number", default: 0.6, min: 0.1, max: 1 } } },
  { isNew: true, category: "card", name: "CARD STACK PEEK", nameJa: "カードスタックピーク", shortDescription: "重なったカードにホバーすると、一番上がずれて下のカードが覗く", motionLevel: "low", performanceCost: "low", mobileSupport: true,
    description: "少しずつずらして重ねたカードの束。ホバー（タップ）すると一番上のカードが斜めにずれて、下に隠れていたカードが覗く。関連コンテンツの束を仄めかす演出。",
    mood: ["editorial", "playful", "minimal"], impact: "low",
    parameters: { peekAngle: { type: "number", default: 6, min: 2, max: 14 } } },

  // ---------------- SCROLL ----------------
  { legacyNumber: "01", category: "scroll", name: "SCROLL PROGRESS BAR", nameJa: "スクロールプログレスバー", shortDescription: "ページ全体に対する現在位置を上部バーで可視化する", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "03", category: "scroll", name: "SCROLL SNAP", nameJa: "スクロールスナップ", shortDescription: "ピタッと1枚ずつ止まるスクロール", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "04", category: "scroll", name: "SCROLL VELOCITY SKEW", nameJa: "スクロール速度スキュー", shortDescription: "スクロール速度に応じて画像が歪む", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "39", category: "scroll", name: "SMOOTH SCROLL (LENIS)", nameJa: "スムーススクロール", shortDescription: "慣性のついたヌルッとしたスクロール", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "41", category: "scroll", name: "SCROLL PARALLAX SCALE", nameJa: "パララックススケール", shortDescription: "スクロールで画像が等倍に戻っていく", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "43", category: "scroll", name: "SCROLL COLOR MORPH", nameJa: "スクロールカラーモーフ", shortDescription: "セクションを通過するたびに背景色が変わる", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "56", category: "scroll", name: "CHROMATIC ABERRATION SCROLL", nameJa: "色収差スクロール", shortDescription: "速いスクロールでRGBチャンネルがズレる", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "74", category: "scroll", name: "MOTION PATH SCROLL", nameJa: "モーションパススクロール", shortDescription: "SVGの曲線に沿って要素が移動する", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "76", category: "scroll", name: "ANIMATED BAR CHART", nameJa: "アニメーテッドバーチャート", shortDescription: "スクロールで棒グラフが伸びる", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "79", category: "scroll", name: "OVERSCROLL BOUNCE", nameJa: "オーバースクロールバウンス", shortDescription: "端まで来るとぐにゃっと弾む", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "102", category: "scroll", name: "SCROLL MAGNETIC SNAP", nameJa: "スクロールマグネットスナップ", shortDescription: "スクロールで要素が引き寄せられる", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "103", category: "scroll", name: "SCROLL JIGSAW ASSEMBLY", nameJa: "スクロールジグソー組立", shortDescription: "スクロールでパズルのピースが組み上がる", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "104", category: "scroll", name: "SCROLL-SCRUBBED 3D ROTATION", nameJa: "スクロール連動3D回転", shortDescription: "スクロール量に合わせて立方体が回る", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "106", category: "scroll", name: "NEWSPAPER PARALLAX COLUMNS", nameJa: "段組みパララックス", shortDescription: "段組みごとに違う速さで動く", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { isNew: true, category: "scroll", name: "SCROLL SCRUB COUNTER", nameJa: "スクロールスクラブカウンター", shortDescription: "数字がスクロール位置そのものに連動して増減する（一度きりではない）", motionLevel: "low", performanceCost: "low", mobileSupport: true,
    description: "既存のCOUNT-UP NUMBERは一度だけ0から目標値へカウントするのに対し、こちらはスクロール位置に直接スクラブ連動し、上下スクロールで数字が増減する。実績数値や統計セクション向け。",
    mood: ["modern", "technology", "corporate"], impact: "low",
    parameters: { target: { type: "number", default: 100, min: 1, max: 100000 }, decimals: { type: "number", default: 0, min: 0, max: 2 } } },
  { isNew: true, category: "scroll", name: "SCROLL PIN LABEL", nameJa: "スクロールピンラベル", shortDescription: "枠内をスクロールすると、いま見ている項目名がラベルに表示され続ける", motionLevel: "low", performanceCost: "low", mobileSupport: true,
    description: "縦スクロールの枠内で、現在ビューポート内にある項目の名前を上部のラベルが常に表示し続ける。長いリストの現在地表示に使える。",
    mood: ["modern", "corporate", "clean"], impact: "low",
    parameters: {} },

  // ---------------- CURSOR ----------------
  { legacyNumber: "06", category: "cursor", name: "SPOTLIGHT CURSOR", nameJa: "スポットライトカーソル", shortDescription: "カーソルの光で暗闇を照らす", motionLevel: "low", performanceCost: "low", mobileSupport: false },
  { legacyNumber: "07", category: "cursor", name: "MOUSE PARALLAX LAYERS", nameJa: "マウスパララックスレイヤー", shortDescription: "マウス位置でレイヤーが逆方向に動く", motionLevel: "medium", performanceCost: "low", mobileSupport: false },
  { legacyNumber: "32", category: "cursor", name: "CUSTOM CURSOR", nameJa: "カスタムカーソル", shortDescription: "ドット＋リングがマウスに追従する", motionLevel: "low", performanceCost: "low", mobileSupport: false },
  { legacyNumber: "33", category: "cursor", name: "CURSOR-FOLLOW PREVIEW", nameJa: "カーソル追従プレビュー", shortDescription: "ホバーでカーソル脇に画像が追従する", motionLevel: "low", performanceCost: "low", mobileSupport: false },
  { legacyNumber: "51", category: "cursor", name: "ELASTIC CONNECTOR LINE", nameJa: "エラスティックコネクター", shortDescription: "カーソルとつながる伸縮するゴムひも", motionLevel: "medium", performanceCost: "low", mobileSupport: false },
  { legacyNumber: "52", category: "cursor", name: "ROPE CHAIN FOLLOW", nameJa: "ロープチェーンフォロー", shortDescription: "縄跳びのようにしなって追いかける", motionLevel: "medium", performanceCost: "medium", mobileSupport: false },
  { legacyNumber: "55", category: "cursor", name: "CURSOR WATER DISTORTION", nameJa: "カーソル水面ディストーション", shortDescription: "カーソルで生地が波打つ", motionLevel: "medium", performanceCost: "medium", mobileSupport: false },
  { legacyNumber: "60", category: "cursor", name: "MORPHING CURSOR SHAPE", nameJa: "モーフィングカーソル", shortDescription: "対象によってカーソルの形が変わる", motionLevel: "low", performanceCost: "low", mobileSupport: false },
  { legacyNumber: "61", category: "cursor", name: "INK BLOT TRAIL", nameJa: "インクブロットトレイル", shortDescription: "カーソルの軌跡ににじむインク", motionLevel: "medium", performanceCost: "medium", mobileSupport: false },
  { legacyNumber: "62", category: "cursor", name: "SPARKLE TRAIL", nameJa: "スパークルトレイル", shortDescription: "カーソルにキラキラが舞う", motionLevel: "medium", performanceCost: "medium", mobileSupport: false },
  { legacyNumber: "90", category: "cursor", name: "CURSOR-REPEL ICON SWARM", nameJa: "カーソル反発アイコン群", shortDescription: "カーソルから逃げて跳ね返るアイコン", motionLevel: "medium", performanceCost: "low", mobileSupport: false },
  { legacyNumber: "91", category: "cursor", name: "CURSOR PET FOLLOWER", nameJa: "カーソルペットフォロワー", shortDescription: "ペットのように追いかけてくる", motionLevel: "medium", performanceCost: "low", mobileSupport: false },
  { legacyNumber: "93", category: "cursor", name: "CURSOR SHOCKWAVE BURST", nameJa: "カーソルショックウェーブ", shortDescription: "クリックで衝撃波が広がる", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "94", category: "cursor", name: "CURSOR MAGNET SNAP", nameJa: "カーソルマグネットスナップ", shortDescription: "近づくとカーソルごと吸着する", motionLevel: "medium", performanceCost: "low", mobileSupport: false },
  { legacyNumber: "110", category: "cursor", name: "WATER DROPLET CURSOR", nameJa: "水滴カーソル", shortDescription: "ガラスの上を転がる水滴のように動く", motionLevel: "medium", performanceCost: "medium", mobileSupport: false },
  { legacyNumber: "114", category: "cursor", name: "VELOCITY INK BRUSH", nameJa: "ベロシティインクブラシ", shortDescription: "動く速さで筆致の太さが変わる", motionLevel: "medium", performanceCost: "medium", mobileSupport: false },
  { legacyNumber: "120", category: "cursor", name: "NEON CURSOR TRAIL", nameJa: "ネオンカーソルトレイル", shortDescription: "光る軌跡がカーソルについてくる", motionLevel: "medium", performanceCost: "medium", mobileSupport: false },
  { isNew: true, category: "cursor", name: "CURSOR ORBIT DOTS", nameJa: "カーソルオービットドット", shortDescription: "小さな粒がカーソルの周りを衛星のように回り続ける", motionLevel: "low", performanceCost: "low", mobileSupport: false,
    description: "カーソル移動中、数個の小さなドットが少し遅れて追従しながら、カーソルを中心に緩やかに公転する。停止中は静かに漂う。",
    mood: ["playful", "futuristic", "clean"], impact: "low",
    parameters: { count: { type: "number", default: 4, min: 2, max: 10 }, radius: { type: "number", default: 22, min: 10, max: 60 }, speed: { type: "number", default: 1, min: 0.3, max: 3 } } },
  { isNew: true, category: "cursor", name: "CURSOR TRAIL RIBBON", nameJa: "カーソルトレイルリボン", shortDescription: "カーソルの軌跡が滑らかなリボン状の帯として尾を引く", motionLevel: "medium", performanceCost: "medium", mobileSupport: false,
    description: "直近のカーソル位置を曲線でつなぎ、幅が先端に向かって細くなるリボン状の軌跡をcanvasで描く。ロープ状の#52とは異なり、絹のような滑らかな帯として表現する。",
    mood: ["premium", "cinematic", "futuristic"], impact: "medium",
    parameters: { trailLength: { type: "number", default: 18, min: 6, max: 40 } } },

  // ---------------- BACKGROUND ----------------
  { legacyNumber: "26", category: "background", name: "PARTICLE NETWORK", nameJa: "パーティクルネットワーク", shortDescription: "点が線で繋がって漂うcanvas演出", motionLevel: "medium", performanceCost: "high", mobileSupport: false },
  { legacyNumber: "27", category: "background", name: "ANIMATED MESH GRADIENT", nameJa: "アニメーテッドメッシュグラデーション", shortDescription: "漂う色のかたまりがゆっくり形を変える", motionLevel: "low", performanceCost: "medium", mobileSupport: true },
  { legacyNumber: "29", category: "background", name: "EQUALIZER BARS", nameJa: "イコライザーバー", shortDescription: "音楽再生風に揺れる棒グラフ", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "37", category: "background", name: "BACKGROUND CROSSFADE", nameJa: "背景クロスフェード", shortDescription: "背景写真が自然に切り替わる", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "50", category: "background", name: "REPEL DOT GRID", nameJa: "リペルドットグリッド", shortDescription: "カーソルから逃げるように反発するドットの面", motionLevel: "medium", performanceCost: "medium", mobileSupport: false },
  { legacyNumber: "58", category: "background", name: "MORPHING LIQUID BLOB", nameJa: "モーフィングリキッドブロブ", shortDescription: "液体のように形を変え続ける図形", motionLevel: "medium", performanceCost: "medium", mobileSupport: true },
  { legacyNumber: "75", category: "background", name: "AMBIENT FLOATING ICONS", nameJa: "アンビエントフローティングアイコン", shortDescription: "近づくと反応する浮遊アイコン", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "111", category: "background", name: "REACTIVE CELL GRID", nameJa: "リアクティブセルグリッド", shortDescription: "カーソルの気配で波紋のように反応する面", motionLevel: "medium", performanceCost: "medium", mobileSupport: false },
  { legacyNumber: "112", category: "background", name: "DISSOLVING ORBS", nameJa: "ディゾルビングオーブ", shortDescription: "触れると粒子になって溶ける浮遊体", motionLevel: "medium", performanceCost: "medium", mobileSupport: false },
  { legacyNumber: "117", category: "background", name: "KALEIDOSCOPE DRAG", nameJa: "カレイドスコープドラッグ", shortDescription: "ドラッグで対称模様が万華鏡のように変化する", motionLevel: "high", performanceCost: "medium", mobileSupport: true },
  { legacyNumber: "118", category: "background", name: "TONE BARS", nameJa: "トーンバー", shortDescription: "触れると音と光が生まれる柱（音が出ます）", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { isNew: true, category: "background", name: "AURORA DRIFT", nameJa: "オーロラドリフト", shortDescription: "淡い光の帯がゆっくり形を変えながら漂うアンビエント背景", motionLevel: "low", performanceCost: "medium", mobileSupport: true,
    description: "CSSのグラデーション＋ブラーだけで実装した、オーロラのような淡い光の帯が緩やかに漂う背景演出。canvasを使わないため軽量で、`prefers-reduced-motion`環境では静止状態になる。",
    mood: ["premium", "cinematic", "organic"], impact: "low",
    parameters: { speed: { type: "number", default: 18, min: 8, max: 40 }, hue: { type: "number", default: 220, min: 0, max: 360 } } },
  { isNew: true, category: "background", name: "NOISE GRAIN DRIFT", nameJa: "ノイズグレインドリフト", shortDescription: "細かい粒状ノイズがゆっくり流れ続けるフィルム質感の背景", motionLevel: "low", performanceCost: "low", mobileSupport: true,
    description: "canvasで生成した細かい粒状ノイズのタイル画像を、CSSのbackground-positionでゆっくり流し続ける。静止画のGRAIN OVERLAY(#48)と異なり、常時わずかに動き続ける背景専用の演出。",
    mood: ["cinematic", "organic", "minimal"], impact: "low",
    parameters: { opacity: { type: "number", default: 0.12, min: 0.02, max: 0.3 }, speed: { type: "number", default: 12, min: 4, max: 30 } } },

  // ---------------- BUTTON ----------------
  { legacyNumber: "14", category: "button", name: "SVG UNDERLINE DRAW", nameJa: "SVGアンダーライン描画", shortDescription: "ホバーで下線が手描きのように伸びる", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "20", category: "button", name: "CLICK RIPPLE", nameJa: "クリックリップル", shortDescription: "クリックした場所から波紋が広がる", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "21", category: "button", name: "CONFETTI BURST", nameJa: "コンフェッティバースト", shortDescription: "クリックで紙吹雪の粒子が飛び散る", motionLevel: "high", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "34", category: "button", name: "MAGNETIC BUTTONS", nameJa: "マグネティックボタン", shortDescription: "カーソルに吸い寄せられるボタン", motionLevel: "medium", performanceCost: "low", mobileSupport: false },
  { legacyNumber: "100", category: "button", name: "ELASTIC RUBBER-BAND BUTTON", nameJa: "エラスティックラバーバンドボタン", shortDescription: "引っ張ると伸びて跳ね返る", motionLevel: "high", performanceCost: "low", mobileSupport: false },
  { legacyNumber: "101", category: "button", name: "ROTARY DIAL KNOB", nameJa: "ロータリーダイヤルノブ", shortDescription: "円を描くようにドラッグして回す", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "109", category: "button", name: "GOO SLIME BUTTON", nameJa: "グーライムボタン", shortDescription: "ぷにっと合体するグミのようなボタン", motionLevel: "high", performanceCost: "medium", mobileSupport: false },
  { isNew: true, category: "button", name: "OUTLINE TRACE BUTTON", nameJa: "アウトライントレースボタン", shortDescription: "ホバーで枠線がペンでなぞるように描かれる", motionLevel: "low", performanceCost: "low", mobileSupport: true,
    description: "通常時は枠線なしのテキストボタン。ホバー（タッチはフォーカス）すると、四辺の枠線がSVGのstroke-dashoffsetで一筆書きのように描かれる。",
    mood: ["minimal", "clean", "premium"], impact: "low",
    parameters: { duration: { type: "number", default: 0.5, min: 0.2, max: 1.2 }, thickness: { type: "number", default: 1, min: 1, max: 3 } } },
  { isNew: true, category: "button", name: "SPLIT FILL BUTTON", nameJa: "スプリットフィルボタン", shortDescription: "ホバーで斜めに切れた塗りが右下から広がって埋まる", motionLevel: "low", performanceCost: "low", mobileSupport: true,
    description: "ホバーすると、右下の角から斜めにカットされた塗りがボタン全体へ広がる。文字はmix-blend-modeで自動的に反転し、塗りとの境界でも読みやすさを保つ。",
    mood: ["bold", "modern", "premium"], impact: "medium",
    parameters: { duration: { type: "number", default: 0.45, min: 0.2, max: 1 }, angle: { type: "number", default: 30, min: 0, max: 60 } } },

  // ---------------- NAVIGATION ----------------
  { legacyNumber: "02", category: "navigation", name: "SIDE DOT NAVIGATION", nameJa: "サイドドットナビゲーション", shortDescription: "現在地がひと目でわかるドット、クリックでジャンプ", motionLevel: "low", performanceCost: "low", mobileSupport: false },
  { legacyNumber: "05", category: "navigation", name: "ANCHOR HIGHLIGHT FLASH", nameJa: "アンカーハイライトフラッシュ", shortDescription: "ジャンプ先の見出しが一瞬光って知らせる", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "18", category: "navigation", name: "ACCORDION", nameJa: "アコーディオン", shortDescription: "滑らかに開閉するリスト", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "19", category: "navigation", name: "CUSTOM DROPDOWN", nameJa: "カスタムドロップダウン", shortDescription: "独自デザインの開閉メニュー", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "22", category: "navigation", name: "TOAST NOTIFICATION", nameJa: "トースト通知", shortDescription: "端にスッと出て自動で消える通知", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "30", category: "navigation", name: "DARK / LIGHT THEME", nameJa: "ダーク/ライトテーマ切替", shortDescription: "ヘッダーのスイッチでテーマを切り替える", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "47", category: "navigation", name: "FULLSCREEN NAV MENU", nameJa: "フルスクリーンナビメニュー", shortDescription: "円が広がるように展開するメニュー", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "49", category: "navigation", name: "HEADER SCROLL BLUR", nameJa: "ヘッダースクロールブラー", shortDescription: "スクロールでヘッダーの背景がぼやける", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "69", category: "navigation", name: "PERSPECTIVE SCROLL TUNNEL", nameJa: "パースペクティブトンネルメニュー", shortDescription: "奥から手前へ流れてくる立体的なメニュー", motionLevel: "high", performanceCost: "medium", mobileSupport: false },
  { isNew: true, category: "navigation", name: "STACKED LABEL MENU", nameJa: "スタックドラベルメニュー", shortDescription: "ホバーでラベルが上下2段でスライドし、複製された文字に切り替わる", motionLevel: "low", performanceCost: "low", mobileSupport: false,
    description: "メニュー項目のラベルを同じテキストで上下2段用意し、ホバー時に上段が上へ抜け、下段が下から上がって重なる。控えめだが確実に伝わるホバーフィードバック。",
    mood: ["modern", "corporate", "clean"], impact: "low",
    parameters: { duration: { type: "number", default: 0.4, min: 0.15, max: 1 } } },
  { isNew: true, category: "navigation", name: "UNDERLINE FOLLOW NAV", nameJa: "アンダーライン追従ナビ", shortDescription: "ホバーした項目の下へ、共有の下線インジケーターが滑らかに移動する", motionLevel: "low", performanceCost: "low", mobileSupport: false,
    description: "ナビ全体で1本の下線インジケーターを共有し、どの項目にホバーしてもその項目の幅・位置へ滑らかにスライドする。個別下線の点滅よりも連続性のある高級感を演出。",
    mood: ["premium", "clean", "corporate"], impact: "low",
    parameters: { duration: { type: "number", default: 0.35, min: 0.15, max: 0.8 } } },

  // ---------------- TRANSITION ----------------
  { legacyNumber: "23", category: "transition", name: "SKELETON LOADING", nameJa: "スケルトンローディング", shortDescription: "読み込み中はシマーでプレースホルダー表示する", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "31", category: "transition", name: "PROGRESS LOADER", nameJa: "プログレスローダー", shortDescription: "カウントアップしてからカーテンが開く", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "67", category: "transition", name: "ORIGAMI FOLD-OUT", nameJa: "オリガミフォールドアウト", shortDescription: "折り紙のように順番に開く", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "73", category: "transition", name: "LIQUID FILL INDICATOR", nameJa: "リキッドフィルインジケーター", shortDescription: "液体が満ちるように進捗を表示する", motionLevel: "low", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "82", category: "transition", name: "3D BELLOWS FOLD", nameJa: "3Dベローズフォールド", shortDescription: "蛇腹のように畳まれて開く", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "84", category: "transition", name: "3D DOOR OPEN REVEAL", nameJa: "3Dドアオープンリベール", shortDescription: "両開きの扉が立体的に開く", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "108", category: "transition", name: "LIQUID POUR BAR", nameJa: "リキッドポアバー", shortDescription: "波打ちながら液体が注がれるように進捗表示する", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { isNew: true, category: "transition", name: "IRIS WIPE TRANSITION", nameJa: "アイリスワイプ遷移", shortDescription: "円形の絞りが広がって次の状態を見せる", motionLevel: "medium", performanceCost: "low", mobileSupport: true,
    description: "clip-pathのcircle()を使い、クリック位置を中心に円形の絞り（アイリス）が広がって遷移する。既存のクリップワイプ（直線）とは異なる、カメラの絞りのような演出。",
    mood: ["cinematic", "bold", "modern"], impact: "high",
    parameters: { duration: { type: "number", default: 0.9, min: 0.4, max: 2 } } },
  { isNew: true, category: "transition", name: "SHUTTER SLICE TRANSITION", nameJa: "シャッタースライス遷移", shortDescription: "縦のスライスが交互に上下へ開き、シャッターのように次の状態を見せる", motionLevel: "medium", performanceCost: "low", mobileSupport: true,
    description: "画像の上に等間隔の縦スライスを重ね、クリックすると各スライスが交互に上下方向へずれてスタガード表示で開く。単一カーテンのワイプ(#42)より視覚的な密度が高い遷移。",
    mood: ["bold", "cinematic", "modern"], impact: "high",
    parameters: { slices: { type: "number", default: 6, min: 4, max: 10 }, stagger: { type: "number", default: 0.05, min: 0, max: 0.15 } } },

  // ---------------- PHYSICS ----------------
  { legacyNumber: "54", category: "physics", name: "GRAVITY DROP TEXT", nameJa: "グラビティドロップテキスト", shortDescription: "文字が重力で落ちて弾む", motionLevel: "high", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "96", category: "physics", name: "PINBALL DRAG LAUNCH", nameJa: "ピンボールドラッグランチ", shortDescription: "引っ張って弾を発射する", motionLevel: "high", performanceCost: "medium", mobileSupport: true },
  { legacyNumber: "97", category: "physics", name: "PENDULUM DRAG SWING", nameJa: "ペンデュラムドラッグスイング", shortDescription: "ドラッグして振り子を揺らす", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "98", category: "physics", name: "TOPPLING BLOCK STACK", nameJa: "トップリングブロックスタック", shortDescription: "押すと積み木が崩れる", motionLevel: "high", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "99", category: "physics", name: "WEIGHTED MOMENTUM SLIDER", nameJa: "ウェイテッドモーメンタムスライダー", shortDescription: "慣性で滑り続けるスライダー", motionLevel: "medium", performanceCost: "low", mobileSupport: true },
  { legacyNumber: "116", category: "physics", name: "BILLIARD BALL COLLISION", nameJa: "ビリヤードボールコリジョン", shortDescription: "カーソルで玉を弾いて衝突させる", motionLevel: "high", performanceCost: "medium", mobileSupport: true },
  { legacyNumber: "119", category: "physics", name: "ELASTIC LAUNCH", nameJa: "エラスティックランチ", shortDescription: "引き伸ばした運動エネルギーを放つ", motionLevel: "high", performanceCost: "medium", mobileSupport: true },
  { isNew: true, category: "physics", name: "MAGNET FIELD BUTTONS", nameJa: "マグネットフィールドボタン", shortDescription: "複数のボタンがカーソルに向けて連動して微妙に引き寄せられる", motionLevel: "medium", performanceCost: "low", mobileSupport: false,
    description: "既存のMAGNETIC BUTTONSが単体ボタンの吸着なのに対し、こちらは複数ボタンが並ぶグループ全体がひとつの磁場のように反応し、カーソルに近いものほど強く、遠いものほど弱く引き寄せられる。",
    mood: ["playful", "futuristic", "bold"], impact: "medium",
    parameters: { intensity: { type: "number", default: 0.3, min: 0.05, max: 0.6 }, radius: { type: "number", default: 220, min: 80, max: 400 } } },
  { isNew: true, category: "physics", name: "SPRING DRAG CARD", nameJa: "スプリングドラッグカード", shortDescription: "自由にドラッグでき、離すとバネのように弾んで元の位置へ戻る", motionLevel: "high", performanceCost: "low", mobileSupport: true,
    description: "カードを好きな方向にドラッグでき、指を離すとオーバーシュートを伴うバネの動きで元の位置に戻る。GSAP Draggable + elasticイージングで実装。",
    mood: ["playful", "bold", "futuristic"], impact: "medium",
    parameters: { elasticity: { type: "number", default: 0.4, min: 0.1, max: 0.8 }, duration: { type: "number", default: 1, min: 0.4, max: 2 } } },
];

/* Derive displayCode + stable internal id for every entry, in array order
   (grouped by category above -- migrated gimmicks first, new ones last
   within each category, so adding a gimmick later never changes anyone
   else's code). */
(() => {
  const counters = {};
  window.GIMMICK_CATALOG.forEach((g) => {
    counters[g.category] = (counters[g.category] || 0) + 1;
    const cat = window.GIMMICK_CATEGORIES_BY_ID[g.category];
    g.displayCode = cat.prefix + String(counters[g.category]).padStart(2, "0");
    g.id = "gimmick." + g.category + "." + String(counters[g.category]).padStart(3, "0");
  });
  window.GIMMICK_CATALOG_BY_CODE = Object.fromEntries(window.GIMMICK_CATALOG.map((g) => [g.displayCode, g]));
  window.GIMMICK_CATALOG_BY_LEGACY = Object.fromEntries(
    window.GIMMICK_CATALOG.filter((g) => g.legacyNumber).map((g) => [g.legacyNumber, g])
  );
})();
