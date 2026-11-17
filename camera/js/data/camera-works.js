/* BLENCI LAB — CAMERA WORK CATALOG data layer.
   Single source of truth for the camera-work catalogue page
   (camera/index.html) and for the blenci-lab-web-builder Skill's
   sync_catalog.mjs, which evaluates this file to build its catalog.json.

   displayCode ("V01".."V24") and the internal id ("camera.move.001") are
   DERIVED from array order at the bottom of this file, never hand-typed.
   Like FONTS (F01..F50), the V number is a continuous serial across all
   three categories, so new entries must be appended at the END of the
   array to keep existing codes stable.

   Field guide
   - name / nameEn / nameJa : display name (uppercase) / English term / Japanese term
   - layer       : what has to change to reproduce it
                   "camera" (position/rotation), "lens" (focal length / focus),
                   "time" (playback speed / timing), "edit" (cut between shots)
   - continuousShot : true when it happens inside one continuous shot. false =
                   needs two shots (an edit), so a video-generation prompt must
                   NOT also say "one continuous shot, no cuts".
   - prompt      : English phrase for video-generation models. The subject of
                   camera motion is always "The camera". Placeholders:
                   {subject} (what is filmed) and {duration} (e.g. "3 seconds").
   - blender     : how to build it in a Blender blockout (24fps assumed).
   - parameters  : tunable values with a sensible default, appended to the
                   ID when giving instructions ("V11 FPV, 3秒, 速く, 人物に向かって"). */
window.CAMERA_WORK_CATEGORIES = [
  { id: "move", label: "CAMERA MOVE", labelJa: "カメラの動き", description: "カメラそのものをどう動かすか", order: 1 },
  { id: "time", label: "SHOOTING & TIME", labelJa: "撮り方・時間の演出", description: "レンズ・揺れ・角度と、時間の見せ方", order: 2 },
  { id: "transition", label: "TRANSITION", labelJa: "切り替え（トランジション）", description: "ショットとショットのつなぎ方", order: 3 },
];
window.CAMERA_WORK_CATEGORIES_BY_ID = Object.fromEntries(window.CAMERA_WORK_CATEGORIES.map((c) => [c.id, c]));

window.CAMERA_WORKS = [
  // ---------------- CAMERA MOVE ----------------
  {
    category: "move", name: "PAN", nameEn: "Pan", nameJa: "パン", layer: "camera", continuousShot: true, motionLevel: "low",
    shortDescription: "位置はそのまま、カメラを横に振る",
    description: "三脚に載せたまま左右に向きだけを変える。カメラの位置は動かないので、手前と奥の重なり方（視差）は変わらず、景色がそのまま横に流れる。",
    useFor: "風景や状況の紹介／人物から人物へ視線を移す",
    prompt: "Static camera position. The camera pans smoothly from left to right over {duration}, sweeping across the scene to land on {subject}. The camera only rotates horizontally; it does not travel.",
    blender: "locationは固定し、rotation_euler.Z（ヨー）だけを2点でキーする（例：+15°→-15°、72f=3秒）。補間はease in/out。視差が出ないのがトラッキングとの違い。",
    parameters: { duration: "3s", direction: "left → right", angle: "30°" },
  },
  {
    category: "move", name: "TILT", nameEn: "Tilt", nameJa: "ティルト", layer: "camera", continuousShot: true, motionLevel: "low",
    shortDescription: "位置はそのまま、カメラを縦に振る",
    description: "カメラの位置を固定したまま、上下に向きを変える。足元から顔へ、建物の根元から頂上へと、縦に長いものの大きさや高さを伝える。",
    useFor: "高さ・大きさの強調／人物の全身を下から上へ見せる",
    prompt: "Static camera position. The camera tilts up slowly over {duration}, from the ground at {subject}'s feet to the top of the tall building behind. The camera only rotates vertically; it does not travel.",
    blender: "locationは固定し、rotation_euler.X（ピッチ）だけをキーする（水平が90°。例：75°→110°）。被写体の高さに合わせて開始・終了角を決める。",
    parameters: { duration: "3s", direction: "down → up", angle: "35°" },
  },
  {
    category: "move", name: "DOLLY IN", nameEn: "Dolly in", nameJa: "ドリーイン", layer: "camera", continuousShot: true, motionLevel: "medium",
    shortDescription: "カメラごと被写体に近づく",
    description: "カメラ自体が前に進んで被写体に寄る。手前の物ほど速く大きくなり、奥の物はあまり変わらない。この視差のおかげで、ズームより「その場に入っていく」感覚が出る。",
    useFor: "感情の高まり・注目させたい瞬間／シーンへの導入",
    prompt: "The camera physically dollies forward toward {subject} at a slow, steady speed over {duration}. The focal length stays fixed at 35mm; foreground objects slide past and grow faster than the background.",
    blender: "lensは固定（例：35mm）。被写体にEmptyを置き、カメラにTrack Toを付け、カメラのlocationを前方へキーする（例：距離6m→2m）。寄る速さを一定に見せたいなら距離を対数で補間する。",
    parameters: { duration: "3s", distance: "6m → 2m", lens: "35mm" },
  },
  {
    category: "move", name: "ZOOM IN", nameEn: "Zoom in", nameJa: "ズームイン", layer: "lens", continuousShot: true, motionLevel: "low",
    shortDescription: "位置はそのまま、レンズで寄る",
    description: "カメラは動かさずに焦点距離を長くして寄る。手前と奥が同じ割合で拡大されるので視差は生まれず、背景は圧縮されて平面的になる。",
    useFor: "遠くの対象を指し示す／ドキュメンタリー・報道的な寄り",
    prompt: "The camera stays perfectly still and zooms in optically on {subject} over {duration}, from a wide 24mm framing to a tight 85mm framing. No camera movement; only the focal length changes.",
    blender: "location・rotationは固定。cam.data.lensを24→85mmでキーする。ズームの速さを一定に見せたいときはlensを対数空間で補間する。",
    parameters: { duration: "3s", lens: "24mm → 85mm" },
  },
  {
    category: "move", name: "TRACKING SHOT", nameEn: "Tracking shot", nameJa: "トラッキング", layer: "camera", continuousShot: true, motionLevel: "medium",
    shortDescription: "被写体と並んで一緒に動く",
    description: "歩く・走る被写体の横を、同じ速さで並走する。画面内の被写体の位置はほぼ変わらず、背景だけが視差つきで流れていく。",
    useFor: "移動・旅・会話しながら歩くシーン／スピード感の表現",
    prompt: "The camera tracks sideways alongside {subject} as they walk from left to right for {duration}, keeping them centered at a constant distance. The background slides past with natural parallax.",
    blender: "被写体を前進させる（歩き1.4m/s、走り4〜6m/s）。カメラを被写体Emptyの子にして横に一定距離（例：4m）で固定すると自動で並走する。手前に柱や木を置くと流れが見える。",
    parameters: { duration: "4s", speed: "1.4m/s", side: "left side", distance: "4m" },
  },
  {
    category: "move", name: "ORBIT", nameEn: "Orbit (Arc shot)", nameJa: "オービット", layer: "camera", continuousShot: true, motionLevel: "medium",
    shortDescription: "被写体の周りを回り込む",
    description: "被写体を中心に、カメラが円弧を描いて回り込む。被写体は画面中央に残ったまま、背景だけが大きく回転して見える。主役を立体的に見せる定番。",
    useFor: "ヒーローショット・商品紹介／二人の関係性の変化",
    prompt: "The camera orbits around {subject} in a smooth half circle over {duration}, keeping them centered in frame. The subject stays still and never turns; only the camera moves, so the background swings behind them.",
    blender: "被写体位置にEmptyを置き、カメラをその子にしてEmptyのrotation_euler.Zを0→180°でキーする（またはカメラ位置を角度・半径・高さの極座標で補間）。直線補間は被写体を突き抜けるので不可。",
    parameters: { duration: "5s", arc: "180°", direction: "counter-clockwise", radius: "3m" },
  },
  {
    category: "move", name: "CRANE UP", nameEn: "Crane up", nameJa: "クレーンアップ", layer: "camera", continuousShot: true, motionLevel: "medium",
    shortDescription: "カメラが上へ昇っていく",
    description: "カメラ自体が垂直に上昇し、被写体を見下ろしながら周囲の広がりを見せる。目線の高さから俯瞰へ移ることで、物語の締めくくりや場所の全体像を伝える。",
    useFor: "エンディング・場面の締め／広い空間の全体像を見せる",
    prompt: "The camera cranes up from eye level to a high overhead angle over {duration}, rising vertically while tilting down to keep {subject} in frame, revealing the wide surroundings.",
    blender: "location.Zを1.6m→8mでキーし、Track Toで被写体を狙い続ける（自然に俯瞰へ移る）。上がり切る直前にease outで減速させる。",
    parameters: { duration: "4s", height: "1.6m → 8m" },
  },
  {
    category: "move", name: "DOLLY ZOOM", nameEn: "Dolly zoom (Vertigo)", nameJa: "ドリーズーム", layer: "lens", continuousShot: true, motionLevel: "high",
    shortDescription: "人物はそのまま、背景だけ伸び縮み",
    description: "カメラを引きながら同時にズームイン（または寄りながらズームアウト）する。被写体の大きさは変わらないのに背景のパースだけが変化し、めまいのような不安感を生む。",
    useFor: "衝撃・気づき・恐怖の瞬間の心理描写",
    prompt: "Dolly zoom (vertigo effect): over {duration}, the camera dollies backward while zooming in, so {subject} stays exactly the same size in frame while the background stretches and looms closer.",
    blender: "被写体の見かけの大きさ s = lens / 距離 を一定に保つ。例：距離3m・24mm → 距離9m・72mm。毎フレーム 距離 = lens / s を計算してlocationとlensを同時にキーする。",
    parameters: { duration: "3s", distance: "3m → 9m", lens: "24mm → 72mm" },
  },

  // ---------------- SHOOTING & TIME ----------------
  {
    category: "time", name: "RACK FOCUS", nameEn: "Rack focus", nameJa: "ラックフォーカス", layer: "lens", continuousShot: true, motionLevel: "low",
    shortDescription: "ピントを手前から奥へ送る",
    description: "被写界深度の浅い画で、ピントの位置を手前の物から奥の人物へ（またはその逆へ）移す。カメラを動かさずに、見てほしいものを切り替えられる。",
    useFor: "視線誘導・伏線の提示／二つの要素の関係を見せる",
    prompt: "Shallow depth of field, static camera. Over {duration}, the focus racks from an object in the near foreground to {subject} in the background; the foreground melts into soft blur as the subject becomes sharp.",
    blender: "カメラのDepth of Fieldを有効にし、F値は1.4〜2.8にする。focus_distanceを手前の距離（0.5m）→被写体の距離（4m）でキーする（Focus Objectの切り替えでも可）。WorkbenchもDOFに対応。",
    parameters: { duration: "2s", focus: "0.5m → 4m", aperture: "f/1.8" },
  },
  {
    category: "time", name: "HANDHELD", nameEn: "Handheld", nameJa: "手持ち風", layer: "camera", continuousShot: true, motionLevel: "medium",
    shortDescription: "わざと小さく揺らす",
    description: "人がカメラを持って撮っているような、不規則で小さな揺れを加える。臨場感・ドキュメンタリー感・緊迫感が出る。揺らしすぎると酔うので、控えめが基本。",
    useFor: "ドキュメンタリー・Vlog風／緊迫したシーンの臨場感",
    prompt: "Handheld camera feel: subtle, natural shake and slight drift as if held by an operator, while framing {subject} for {duration}. Gentle and organic, no violent jitter.",
    blender: "カメラのlocationとrotationのFカーブにNoiseモディファイアを付ける（位置1〜2cm、回転0.3〜0.8°、Scale 10〜20f）。毎フレームキーを打つ方式なら、パーリンノイズの値を加算する。",
    parameters: { duration: "4s", intensity: "subtle" },
  },
  {
    category: "time", name: "FPV DRONE SHOT", nameEn: "FPV drone shot", nameJa: "FPV", layer: "camera", continuousShot: true, motionLevel: "high",
    shortDescription: "ドローンで突き進む疾走感",
    description: "一人称視点のドローンが、低い位置を高速で突き進み、傾きながら旋回して障害物の間をすり抜ける。広角レンズと速度で、強い没入感と疾走感が出る。",
    useFor: "オープニング・PR映像／施設や街を一気に見せる",
    prompt: "FPV drone shot: the camera flies fast and low toward {subject}, weaving through the scene with banking turns and smooth acceleration for {duration}. Wide-angle lens, strong sense of speed.",
    blender: "広角（14〜18mm）にする。ベジェカーブを引き、カメラにFollow Pathを付けて走らせる。旋回に合わせてrotation_euler.Y（ロール）を±10〜20°キーする。速さは秒速15〜30mが目安。手前に障害物を置くと速度感が出る。",
    parameters: { duration: "4s", speed: "fast", lens: "16mm", altitude: "low" },
  },
  {
    category: "time", name: "DUTCH ANGLE", nameEn: "Dutch angle", nameJa: "ダッチアングル", layer: "camera", continuousShot: true, motionLevel: "low",
    shortDescription: "画面を斜めに傾ける",
    description: "カメラを光軸まわりに回転（ロール）させ、水平線を斜めにする。不安定さ・違和感・緊張を視覚的に伝える。",
    useFor: "不穏・混乱・狂気の表現／ポップで勢いのある画作り",
    prompt: "Dutch angle: the camera is rolled about 15 degrees so the horizon is visibly tilted, creating unease, while framing {subject} for {duration}.",
    blender: "rotation_euler.Y（ロール）を15°前後にする。動きで傾けるなら0→15°をキーする。",
    parameters: { duration: "3s", roll: "15°" },
  },
  {
    category: "time", name: "SLOW MOTION", nameEn: "Slow motion", nameJa: "スローモーション", layer: "time", continuousShot: true, motionLevel: "low",
    shortDescription: "動きをゆっくり見せる",
    description: "ハイフレームレートで撮った映像を通常速度で再生し、一瞬の動きを引き伸ばして見せる。水しぶき・髪の揺れ・ジャンプの頂点など、普段は見えない瞬間を美しく見せる。",
    useFor: "決定的瞬間の強調／感情・余韻を持たせる",
    prompt: "Slow motion at about 25% speed: {subject} jumps and every movement unfolds slowly and smoothly over {duration}, like footage shot at 120fps.",
    blender: "被写体のアクションを通常の4倍の尺で作る（またはOutput PropertiesのTime Remappingでold 100 / new 400）。生成AIに渡すブロックアウトは、仕上がりの速度・尺で作る。",
    parameters: { duration: "4s", speed: "×0.25 (120fps)" },
  },
  {
    category: "time", name: "SPEED RAMP", nameEn: "Speed ramp", nameJa: "スピードランプ", layer: "time", continuousShot: true, motionLevel: "high",
    shortDescription: "速い→遅いと速さを変える",
    description: "1つのショットの中で再生速度を変化させる。速い動きから決定的瞬間だけ急にスローにし、また速く戻す。アクション・スポーツ・MVの定番。",
    useFor: "アクションの見せ場／リズムに合わせた緩急",
    prompt: "Speed ramp: {subject} runs in fast motion, suddenly slows down to slow motion at the key moment, then speeds back up, all within {duration} in one continuous shot.",
    blender: "被写体の位置をキーし、グラフエディタでカーブの傾き（＝速さ）を「急→緩→急」に整える。カメラを被写体に追従させると速度変化が伝わりやすい。",
    parameters: { duration: "4s", ramp: "×2.0 → ×0.3 → ×2.0" },
  },
  {
    category: "time", name: "TIME-LAPSE", nameEn: "Time-lapse", nameJa: "タイムラプス", layer: "time", continuousShot: true, motionLevel: "medium",
    shortDescription: "長い時間を早送りで見せる",
    description: "固定したカメラで長時間を撮り、早送りで見せる。太陽が弧を描き、影が回り、雲や人の流れが線になって、時間の経過そのものが主役になる。",
    useFor: "一日の移り変わり／作業・建設の経過",
    prompt: "Time-lapse: a locked-off camera watches {subject} from morning to evening, compressed into {duration}; the sun arcs across the sky, shadows sweep around, clouds and passers-by streak past quickly.",
    blender: "カメラは固定。Sunライトの回転を大きくキーし（例：-80°→+80°）、背景色・雲・群衆を高速で動かす。被写体を止めて周囲だけを速く動かすと時間経過に見える。",
    parameters: { duration: "4s", span: "06:00 → 18:00" },
  },
  {
    category: "time", name: "FREEZE FRAME", nameEn: "Freeze frame", nameJa: "フリーズフレーム", layer: "time", continuousShot: true, motionLevel: "low",
    shortDescription: "動きを一瞬止める",
    description: "動いている映像を、ある1フレームで静止させる。ジャンプの頂点やキャラクター紹介など、その瞬間を強く印象づける。テロップと組み合わせることが多い。",
    useFor: "キャラクター紹介・ツッコミ／決めのポーズ",
    prompt: "Freeze frame: {subject} jumps, and at the peak of the jump the whole image suddenly freezes completely still for one second, then the motion resumes.",
    blender: "止めたいフレームで全オブジェクトのキーを複製し、Constant補間で静止区間を作る。またはVSEでその瞬間の静止画（Freeze Frame）を挿入する。",
    parameters: { duration: "3s", hold: "1s" },
  },

  // ---------------- TRANSITION ----------------
  {
    category: "transition", name: "JUMP CUT", nameEn: "Jump cut", nameJa: "ジャンプカット", layer: "edit", continuousShot: false, motionLevel: "medium",
    shortDescription: "同じ画角のまま時間を飛ばす",
    description: "カメラ位置も構図も同じまま、途中を切り取ってつなぐ。被写体の位置やポーズが突然飛び、時間が経ったこと・テンポの速さを伝える。",
    useFor: "Vlog・トーク動画のテンポ出し／待ち時間・試行錯誤の圧縮",
    prompt: "Jump cut: the same static framing of {subject}, with abrupt cuts that skip forward in time; their position and pose change suddenly between cuts while the camera never moves.",
    blender: "カメラは完全固定。被写体のキーをConstant補間にして、数フレームごとに位置・ポーズを飛ばす。または同アングルのショットを複数作り、VSEでつなぐ。",
    parameters: { duration: "4s", cuts: "3" },
  },
  {
    category: "transition", name: "MATCH CUT", nameEn: "Match cut", nameJa: "マッチカット", layer: "edit", continuousShot: false, motionLevel: "low",
    shortDescription: "形や動きをそろえて場面を変える",
    description: "前のショットと次のショットで、形・位置・大きさ・動きの向きをそろえて切り替える。投げたボールが太陽になるように、別の場面がひとつながりに感じられる。",
    useFor: "時間・場所の大きな跳躍／アイデアや意味のつながりを見せる",
    prompt: "Match cut: shot 1 ends on {subject} tossing a round ball up into the frame; cut directly to shot 2, where the sun sits at exactly the same position and size, continuing the motion.",
    blender: "2つのショット（別シーンまたは別カメラ）を作り、切り替え前後で形・位置・大きさをそろえる。タイムラインのマーカーにカメラをバインド（Ctrl+B）すると、同じシーン内でカメラを切り替えられる。",
    parameters: { duration: "4s", matchShape: "circle" },
  },
  {
    category: "transition", name: "WHIP PAN", nameEn: "Whip pan", nameJa: "ホイップパン", layer: "edit", continuousShot: false, motionLevel: "high",
    shortDescription: "素早く振ってブレで次へ",
    description: "カメラを高速で横に振り、モーションブラーで画面が流れた勢いのまま次のショットへつなぐ。ブレがつなぎ目を隠すので、勢いを保ったまま場面転換できる。",
    useFor: "テンポの速い場面転換／同時刻の別の場所へ移る",
    prompt: "Whip pan transition: the camera swings sideways extremely fast away from {subject}, the image smears into horizontal motion blur, and it lands on the next scene.",
    blender: "rotation_euler.Zを4〜8フレームで60〜90°回し、モーションブラーを有効にする（EEVEE/Cycles）。ブレの最中にマーカーで次のカメラへ切り替えるとつなぎ目が隠れる。",
    parameters: { duration: "2s", whip: "6 frames", direction: "left → right" },
  },
  {
    category: "transition", name: "CROSS DISSOLVE", nameEn: "Cross dissolve", nameJa: "クロスディゾルブ", layer: "edit", continuousShot: false, motionLevel: "low",
    shortDescription: "前後の映像を重ねて溶かす",
    description: "前のショットがフェードアウトしながら、次のショットが同時にフェードインする。二つの画が一瞬重なり、穏やかな時間経過や余韻を感じさせる。",
    useFor: "回想・時間経過／静かなシーンのつなぎ",
    prompt: "Cross dissolve: the shot of {subject} gradually fades out while the next shot fades in over the same 1 second, the two images briefly overlapping.",
    blender: "VSEで2本のストリップを重ね、Effect Strip → Cross（またはGamma Cross）を適用する。重なりは12〜24フレーム。",
    parameters: { duration: "3s", overlap: "1s" },
  },
  {
    category: "transition", name: "WIPE", nameEn: "Wipe", nameJa: "ワイプ", layer: "edit", continuousShot: false, motionLevel: "medium",
    shortDescription: "境目が横切って画面が入れ替わる",
    description: "画面を横切る境界線を境に、前のショットが次のショットに置き換わる。手前を通る人や柱を境界に使うと、実写的で自然なワイプになる。",
    useFor: "章の区切り／レトロ・ポップな演出",
    prompt: "Wipe transition: a vertical edge sweeps from left to right across the frame, replacing the shot of {subject} with the next scene.",
    blender: "VSEでWipeエフェクト（Type: Single、方向を指定）を使う。または画面を横切る物体を前景に置き、その通過に合わせてカメラを切り替える。",
    parameters: { duration: "2s", direction: "left → right" },
  },
  {
    category: "transition", name: "SMASH CUT", nameEn: "Smash cut", nameJa: "スマッシュカット", layer: "edit", continuousShot: false, motionLevel: "high",
    shortDescription: "静かな場面から急に切り替える",
    description: "静かで穏やかなショットから、前触れなく騒がしく激しいショットへ切り替える。落差そのものが驚き・笑い・緊張を生む。",
    useFor: "ギャグのオチ・急展開／夢から現実へ引き戻す",
    prompt: "Smash cut: a quiet, calm, still shot of {subject} cuts abruptly, with no transition, to a loud, intense, high-energy shot.",
    blender: "落差のある2ショットを作る：静（固定・遅い・暗め）→ 動（広角・速い・明るい）。切り替えは1フレームのハードカット。音を合わせるなら切り替えフレームで音量を最大にする。",
    parameters: { duration: "3s", contrast: "quiet → loud" },
  },
  {
    category: "transition", name: "J-CUT", nameEn: "J-cut", nameJa: "Jカット", layer: "edit", continuousShot: false, motionLevel: "low",
    shortDescription: "次の場面の音が先に聞こえる",
    description: "映像が切り替わる前に、次のショットの音が先に聞こえ始める。タイムライン上で音声がJの字のように前へ伸びることから。観る人を自然に次の場面へ誘う。",
    useFor: "会話の受け渡し／次の場面への期待を作る",
    prompt: "J-cut: the sound of the next scene starts about one second before its picture; we still see {subject} while the next scene's audio is already audible, then the picture cuts over.",
    blender: "VSEで、次のショットの音声ストリップを映像ストリップより前（例：24f）に置く。映像のカット点はそのまま。",
    parameters: { duration: "4s", audioLead: "1s" },
  },
  {
    category: "transition", name: "L-CUT", nameEn: "L-cut", nameJa: "Lカット", layer: "edit", continuousShot: false, motionLevel: "low",
    shortDescription: "前の場面の音が後まで残る",
    description: "映像は次のショットに切り替わっても、前のショットの音がしばらく続く。タイムライン上で音声がLの字のように後ろへ伸びることから。余韻やリアクションを見せるのに使う。",
    useFor: "セリフの余韻・リアクションを見せる／自然な会話編集",
    prompt: "L-cut: the picture cuts from {subject} to the next scene while the audio from the previous shot carries on for about one second before fading.",
    blender: "VSEで、前のショットの音声ストリップを映像のカット点より後ろ（例：24f）まで伸ばす。",
    parameters: { duration: "4s", audioTail: "1s" },
  },
];

/* Derive displayCode + stable internal id in array order. V is a single
   serial across all categories (V01..V24), like FONTS' F01..F50. */
(function deriveCodes() {
  const perCategory = {};
  window.CAMERA_WORKS.forEach((w, i) => {
    perCategory[w.category] = (perCategory[w.category] || 0) + 1;
    w.displayCode = "V" + String(i + 1).padStart(2, "0");
    w.id = "camera." + w.category + "." + String(perCategory[w.category]).padStart(3, "0");
  });
  window.CAMERA_WORKS_BY_CODE = Object.fromEntries(window.CAMERA_WORKS.map((w) => [w.displayCode, w]));
})();
