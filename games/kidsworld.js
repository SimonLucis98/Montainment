/* Kids Cognition World · 宝宝认知乐园 — JS Wrapper */
(function () {
  'use strict';

  const gameHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<title>Kids Cognition World · 宝宝认知乐园</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Noto+Sans+SC:wght@600;700&family=Noto+Sans+JP:wght@600;700&family=Noto+Sans+KR:wght@600;700&family=Noto+Sans+Thai:wght@600;700&display=swap" rel="stylesheet">
<style>
  :root{
    --sky-top:#7fd0ff; --sky-bottom:#e8f8ff; --sun:#ffd166;
    --grass:#7ed957; --grass-dark:#5cbf3a;
    --coral:#ff6f61; --coral-dark:#e85c4e;
    --berry:#6a4c93; --card:#ffffff; --ink:#3a3352;
    --shadow: 0 10px 0 rgba(0,0,0,0.08);
  }
  *{box-sizing:border-box;}
  html,body{
    margin:0; padding:0; height:100%;
    font-family:'Baloo 2','Noto Sans SC','Noto Sans JP','Noto Sans KR','Noto Sans Thai', sans-serif;
    color:var(--ink); overflow:hidden;
    -webkit-tap-highlight-color: transparent; user-select:none;
  }
  body{
    background:linear-gradient(180deg,var(--sky-top) 0%, var(--sky-bottom) 65%, var(--grass) 65%, var(--grass-dark) 100%);
    position:relative; display:flex; flex-direction:column;
    height:100vh; width:100vw;
  }
  .sun{
    position:absolute; top:18px; right:26px; width:64px; height:64px; border-radius:50%;
    background:radial-gradient(circle at 35% 35%, #fff3c4, var(--sun));
    box-shadow:0 0 0 8px rgba(255,209,102,0.35); z-index:0;
  }
  .cloud{ position:absolute; z-index:0; opacity:0.9; animation: drift linear infinite; }
  .cloud svg{display:block; width:100%; height:100%;}
  @keyframes drift{ from{ transform:translateX(-140px); } to{ transform:translateX(110vw); } }
  @media (prefers-reduced-motion: reduce){ .cloud{ animation:none; display:none; } }

  .topbar{
    position:relative; z-index:2;
    display:flex; align-items:center; justify-content:space-between;
    padding:14px 16px 4px;
  }
  .stat-pill{
    background:#fff; border-radius:999px; padding:8px 16px;
    display:flex; align-items:center; gap:8px;
    box-shadow:var(--shadow); font-weight:700; font-size:18px; color:var(--berry);
  }
  .stat-pill .star-icon{font-size:20px;}
  .progress-wrap{
    flex:1; margin:0 14px; height:14px; background:rgba(255,255,255,0.6);
    border-radius:999px; overflow:hidden; box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
    max-width:220px;
  }
  .progress-bar{
    height:100%; width:0%; background:linear-gradient(90deg,#ffd166,#ff6f61);
    border-radius:999px; transition:width .5s ease;
  }
  .top-actions{ display:flex; gap:8px; }
  .icon-btn{
    background:#fff; border:none; border-radius:50%; width:46px; height:46px;
    font-size:20px; display:flex; align-items:center; justify-content:center;
    box-shadow:var(--shadow); cursor:pointer; flex-shrink:0;
  }
  .icon-btn:active{ transform:translateY(3px); box-shadow:0 4px 0 rgba(0,0,0,0.08); }

  .main{
    position:relative; z-index:1;
    flex:1; display:flex; flex-direction:column; align-items:center; justify-content:flex-start;
    padding:6px 16px 12px; overflow:hidden;
  }
  .mode-toggle{
    display:flex; background:#fff; border-radius:999px; padding:4px; box-shadow:var(--shadow);
    margin-bottom:10px; max-width:94vw;
  }
  .mode-toggle button{
    border:none; background:transparent; padding:8px 16px; border-radius:999px;
    font-family:inherit; font-weight:700; font-size:14px; color:var(--berry); cursor:pointer;
    white-space:nowrap;
  }
  .mode-toggle button.active{ background:var(--coral); color:#fff; }

  .stage-card{
    background:var(--card); border-radius:32px; box-shadow:var(--shadow);
    width:min(360px, 88vw); aspect-ratio: 1.5 / 1; max-height:32vh;
    display:flex; align-items:center; justify-content:center; position:relative;
    margin-bottom:14px;
  }
  .stage-emoji{ font-size:min(22vw, 110px); line-height:1; }
  .stage-emoji.bounce{ animation:bounceIn .5s ease; }
  @keyframes bounceIn{
    0%{ transform:scale(0.4) rotate(-8deg); opacity:0;}
    60%{ transform:scale(1.12) rotate(3deg); opacity:1;}
    100%{ transform:scale(1) rotate(0);}
  }
  .stage-color-blob{ width:56%; height:56%; border-radius:32%; box-shadow: inset 0 -8px 0 rgba(0,0,0,0.08); }
  .stage-shape svg{ width:60%; height:60%; }
  .stage-number{ display:flex; flex-direction:column; align-items:center; gap:6px; }
  .stage-number .digit{ font-size:64px; font-weight:800; color:var(--berry); }
  .stage-number .dots{ display:flex; flex-wrap:wrap; max-width:220px; gap:5px; justify-content:center; }
  .stage-number .dots span{ width:16px; height:16px; border-radius:50%; background:var(--coral); }

  .speak-stage{ display:flex; flex-direction:column; align-items:center; gap:10px; }
  .big-speaker{
    width:96px; height:96px; border-radius:50%; border:none;
    background:linear-gradient(180deg,#ff9a8b,var(--coral)); color:#fff; font-size:46px;
    box-shadow:0 8px 0 var(--coral-dark); cursor:pointer;
  }
  .big-speaker:active{ transform:translateY(6px); box-shadow:0 2px 0 var(--coral-dark); }
  .speak-hint{ color:#9a92b3; font-size:14px; font-weight:600; text-align:center; padding:0 10px; }

  .replay-row{ display:flex; align-items:center; gap:10px; margin-bottom:10px; }
  .replay-btn{
    background:#fff; border:none; border-radius:999px; padding:8px 16px;
    font-family:inherit; font-weight:700; font-size:13px; color:var(--berry);
    box-shadow:var(--shadow); cursor:pointer; display:flex; gap:6px; align-items:center;
  }

  .options{ display:grid; gap:12px; width:min(420px, 92vw); }
  .options.cols-2{ grid-template-columns:repeat(2,1fr); }
  .options.cols-3{ grid-template-columns:repeat(3,1fr); }

  .opt-btn{
    border:none; border-radius:22px; background:#fff; box-shadow:0 6px 0 rgba(0,0,0,0.08);
    padding:14px 8px; font-family:inherit; font-weight:700; cursor:pointer;
    display:flex; flex-direction:column; align-items:center; gap:6px;
    transition:transform .08s ease;
  }
  .opt-btn:active{ transform:translateY(4px); box-shadow:0 2px 0 rgba(0,0,0,0.08); }
  .opt-btn .opt-emoji{ font-size:38px; }
  .opt-btn .opt-color{ width:44px; height:44px; border-radius:14px; }
  .opt-btn .opt-shape svg{ width:44px; height:44px; }
  .opt-btn .opt-text{ font-size:15px; color:var(--ink); text-align:center; }
  .opt-btn.text-only{ padding:16px 8px; }
  .opt-btn.text-only .opt-text{ font-size:18px; }

  .opt-btn.correct{ background:#dff8e1; box-shadow:0 6px 0 #7bd88f; }
  .opt-btn.wrong{ background:#ffe1de; box-shadow:0 6px 0 #f3a79e; animation:shake .35s ease; }
  @keyframes shake{ 0%,100%{ transform:translateX(0); } 25%{ transform:translateX(-6px); } 75%{ transform:translateX(6px); } }
  .opt-btn.disabled{ opacity:0.45; pointer-events:none; }

  .toast{
    position:fixed; top:14px; left:50%; transform:translateX(-50%) translateY(-140%);
    background:var(--berry); color:#fff; padding:12px 22px; border-radius:999px;
    font-weight:700; font-size:14px; z-index:50; box-shadow:0 8px 20px rgba(0,0,0,0.2);
    transition:transform .4s cubic-bezier(.34,1.56,.64,1); max-width:90vw; text-align:center;
  }
  .toast.show{ transform:translateX(-50%) translateY(0); }

  .modal-overlay{
    position:fixed; inset:0; background:rgba(58,51,82,0.55); z-index:60;
    display:none; align-items:center; justify-content:center; padding:20px;
  }
  .modal-overlay.show{ display:flex; }
  .modal{
    background:#fff; border-radius:28px; padding:22px; width:min(420px,94vw);
    max-height:82vh; overflow-y:auto;
  }
  .modal h2{ margin:0 0 12px; color:var(--berry); font-size:22px; }
  .modal .row{
    display:flex; align-items:center; justify-content:space-between; padding:10px 4px;
    border-bottom:1px solid #f1eef8; gap:10px;
  }
  .modal .row:last-of-type{ border-bottom:none; }
  .modal .cat-name{ font-weight:700; }
  .modal .lock-note{ font-size:12px; color:#a79ecb; }
  .switch{ width:46px; height:26px; border-radius:999px; background:#ddd6f0; position:relative; border:none; cursor:pointer; flex-shrink:0; }
  .switch.on{ background:var(--coral); }
  .switch::after{ content:''; position:absolute; top:3px; left:3px; width:20px; height:20px; border-radius:50%; background:#fff; transition:left .2s ease; }
  .switch.on::after{ left:23px; }
  .switch.locked{ opacity:0.4; cursor:not-allowed; }
  .modal-btn-row{ display:flex; gap:10px; margin-top:16px; }
  .modal-btn{ flex:1; border:none; border-radius:16px; padding:12px; font-family:inherit; font-weight:700; cursor:pointer; font-size:14px; }
  .modal-btn.primary{ background:var(--coral); color:#fff; }
  .modal-btn.ghost{ background:#f1eef8; color:var(--berry); }

  .lang-row{
    display:flex; align-items:center; gap:6px; padding:10px 4px; border-radius:14px; cursor:pointer;
  }
  .lang-row:hover{ background:#f6f3fc; }
  .lang-row.selected{ background:#f1eef8; }
  .lang-flag{ font-size:26px; width:36px; text-align:center; }
  .lang-name{ font-weight:700; font-size:16px; }
  .lang-name small{ display:block; font-weight:600; color:#9a92b3; font-size:12px; }

  #langOverlay .modal{ text-align:center; }
  #langOverlay h2{ text-align:center; }
  .lang-title-sub{ color:#9a92b3; font-weight:600; font-size:13px; margin:-6px 0 14px; }

  .confetti-piece{ position:fixed; top:-20px; font-size:22px; z-index:70; pointer-events:none; animation: fall linear forwards; }
  @keyframes fall{ to{ transform:translateY(110vh) rotate(360deg); opacity:0.9; } }

  .float-star{ position:fixed; z-index:70; font-size:26px; pointer-events:none; animation: floatUp 0.9s ease-out forwards; }
  @keyframes floatUp{ 0%{ transform:translateY(0) scale(1); opacity:1; } 100%{ transform:translateY(-70px) scale(1.4); opacity:0; } }
</style>
</head>
<body>

  <div class="sun"></div>
  <div id="cloudLayer"></div>

  <div class="topbar">
    <div class="stat-pill"><span class="star-icon">⭐</span><span id="starCount">0</span></div>
    <div class="progress-wrap"><div class="progress-bar" id="progressBar"></div></div>
    <div class="top-actions">
      <button class="icon-btn" id="langBtn" title="Language">🌐</button>
      <button class="icon-btn" id="settingsBtn" title="Settings">⚙️</button>
    </div>
  </div>

  <div class="main">
    <div class="mode-toggle" id="modeToggle">
      <button data-mode="see" class="active"></button>
      <button data-mode="hear"></button>
    </div>

    <div class="replay-row">
      <button class="replay-btn" id="replayBtn">🔊 <span id="replayLabel"></span></button>
    </div>

    <div class="stage-card" id="stageCard"></div>

    <div class="options" id="optionsWrap"></div>
  </div>

  <div class="toast" id="toast"></div>

  <div class="modal-overlay" id="settingsOverlay">
    <div class="modal">
      <h2 id="settingsTitle"></h2>
      <div id="catList"></div>
      <div class="row">
        <span class="cat-name" id="autoSpeakLabel"></span>
        <button class="switch" id="autoSpeakSwitch"></button>
      </div>
      <div class="modal-btn-row">
        <button class="modal-btn ghost" id="resetBtn"></button>
        <button class="modal-btn primary" id="closeSettings"></button>
      </div>
    </div>
  </div>

  <div class="modal-overlay" id="langOverlay">
    <div class="modal">
      <h2>选择语言 · Choose Language</h2>
      <div class="lang-title-sub">言語を選ぶ · 언어 선택 · Elige idioma · เลือกภาษา · Choisir la langue</div>
      <div id="langList"></div>
    </div>
  </div>

<script>
(function(){

const LANGS = ['zh','en','ja','ko','es','th','fr'];
const LANG_INFO = {
  zh:{flag:'🇨🇳', name:'中文', speech:'zh-CN'},
  en:{flag:'🇺🇸', name:'English', speech:'en-US'},
  ja:{flag:'🇯🇵', name:'日本語', speech:'ja-JP'},
  ko:{flag:'🇰🇷', name:'한국어', speech:'ko-KR'},
  es:{flag:'🇪🇸', name:'Español', speech:'es-ES'},
  th:{flag:'🇹🇭', name:'ไทย', speech:'th-TH'},
  fr:{flag:'🇫🇷', name:'Français', speech:'fr-FR'}
};
function li(){ return LANGS.indexOf(state.lang); }

const UI = {
  modeSee:   ['看图选字','See & Choose','見て選ぶ','보고 고르기','Ver y elegir','ดูแล้วเลือก','Voir et choisir'],
  modeHear:  ['听音选图','Listen & Choose','聞いて選ぶ','듣고 고르기','Escuchar y elegir','ฟังแล้วเลือก','Écouter et choisir'],
  replay:    ['再听一次','Play again','もう一度','다시 듣기','Otra vez','ฟังอีกครั้ง','Réécouter'],
  speakHint: ['点一点，听听是什么','Tap to hear','タップして聞いてね','눌러서 들어보세요','Toca para escuchar','แตะเพื่อฟัง','Touche pour écouter'],
  settingsTitle:['家长设置','Parent Settings','保護者設定','부모 설정','Ajustes','การตั้งค่า','Réglages parents'],
  autoSpeak: ['🔊 每题自动读出','🔊 Auto read aloud','🔊 自動で読み上げ','🔊 자동 읽기','🔊 Leer en voz alta','🔊 อ่านออกเสียงอัตโนมัติ','🔊 Lecture automatique'],
  reset:     ['重新开始进度','Reset progress','リセット','진행 초기화','Reiniciar','รีเซ็ตความคืบหน้า','Réinitialiser'],
  done:      ['完成','Done','完了','완료','Listo','เสร็จสิ้น','Terminé'],
  locked:    ['🔒 待解锁','🔒 Locked','🔒 未解放','🔒 잠김','🔒 Bloqueado','🔒 ล็อกอยู่','🔒 Verrouillé'],
  unlockPre: ['🎉 解锁新主题：','🎉 New topic unlocked: ','🎉 新しいテーマ解放：','🎉 새 주제 열림: ','🎉 ¡Nuevo tema: ','🎉 ปลดล็อกหัวข้อใหม่: ','🎉 Nouveau thème : '],
  unlockSuf: ['！','!','！','!','!','!','\\u00A0!'],
  resetConfirm:['确定要清空所有星星和进度，重新开始吗？','Clear all stars and progress and start over?','スターと進み具合を全部消してやり直しますか？','별과 진행 상황을 모두 지우고 다시 시작할까요?','¿Borrar todas las estrellas y el progreso para empezar de nuevo?','ต้องการล้างดาวและความคืบหน้าทั้งหมดแล้วเริ่มใหม่หรือไม่?','Effacer toutes les étoiles et recommencer ?'],
  wrongSpeech:['再试一次','Try again','もう一回','다시 해봐','Inténtalo otra vez','ลองอีกครั้ง','Réessaie']
};
const PRAISES = [
  ['太棒了','真厉害','答对啦','你真聪明','好棒呀','答对了'],
  ['Great job','Awesome','You got it','So smart','Well done','Correct'],
  ['すごいね','やったね','せいかい','かしこいね','じょうずだね','あたり'],
  ['정말 잘했어','대단해','맞았어','똑똑하다','잘했어요','정답이야'],
  ['¡Muy bien!','¡Genial!','¡Lo lograste!','¡Qué listo!','¡Bien hecho!','¡Correcto!'],
  ['เก่งมาก','ยอดเยี่ยม','ตอบถูกแล้ว','ฉลาดจัง','ทำได้ดีมาก','ถูกต้อง'],
  ['Bravo','Super','Tu as trouvé','Trop intelligent','Bien joué','Correct']
];
function t(key){ return UI[key][li()]; }
function pickPraise(){ const arr = PRAISES[li()]; return arr[Math.floor(Math.random()*arr.length)]; }

const CATS = [
  { id:'animals', type:'emoji', label:['动物','Animals','どうぶつ','동물','Animales','สัตว์','Animaux'], items:[
    ['🐱',['猫','Cat','ネコ','고양이','Gato','แมว','Chat']],
    ['🐶',['狗','Dog','イヌ','개','Perro','หมา','Chien']],
    ['🐰',['兔子','Rabbit','ウサギ','토끼','Conejo','กระต่าย','Lapin']],
    ['🐯',['老虎','Tiger','トラ','호랑이','Tigre','เสือ','Tigre']],
    ['🦁',['狮子','Lion','ライオン','사자','León','สิงโต','Lion']],
    ['🐘',['大象','Elephant','ゾウ','코끼리','Elefante','ช้าง','Éléphant']],
    ['🐵',['猴子','Monkey','サル','원숭이','Mono','ลิง','Singe']],
    ['🐼',['熊猫','Panda','パンダ','판다','Panda','แพนด้า','Panda']],
    ['🦒',['长颈鹿','Giraffe','キリン','기린','Jirafa','ยีราฟ','Girafe']],
    ['🐟',['鱼','Fish','サカナ','물고기','Pez','ปลา','Poisson']],
    ['🐦',['小鸟','Bird','トリ','새','Pájaro','นก','Oiseau']],
    ['🐸',['青蛙','Frog','カエル','개구리','Rana','กบ','Grenouille']],
    ['🐭',['老鼠','Mouse','ネズミ','쥐','Ratón','หนู','Souris']],
    ['🐮',['奶牛','Cow','ウシ','소','Vaca','วัว','Vache']],
    ['🐷',['小猪','Pig','ブタ','돼지','Cerdo','หมู','Cochon']],
    ['🐑',['绵羊','Sheep','ヒツジ','양','Oveja','แกะ','Mouton']]
  ]},
  { id:'fruits', type:'emoji', label:['水果','Fruits','くだもの','과일','Frutas','ผลไม้','Fruits'], items:[
    ['🍎',['苹果','Apple','リンゴ','사과','Manzana','แอปเปิ้ล','Pomme']],
    ['🍌',['香蕉','Banana','バナナ','바나나','Plátano','กล้วย','Banane']],
    ['🍇',['葡萄','Grapes','ブドウ','포도','Uvas','องุ่น','Raisin']],
    ['🍉',['西瓜','Watermelon','スイカ','수박','Sandía','แตงโม','Pastèque']],
    ['🍓',['草莓','Strawberry','イチゴ','딸기','Fresa','สตรอว์เบอร์รี่','Fraise']],
    ['🍊',['橙子','Orange','オレンジ','오렌지','Naranja','ส้ม','Orange']],
    ['🍍',['菠萝','Pineapple','パイナップル','파인애플','Piña','สับปะรด','Ananas']],
    ['🍑',['桃子','Peach','モモ','복숭아','Melocotón','ลูกพีช','Pêche']],
    ['🍒',['樱桃','Cherry','サクランボ','체리','Cereza','เชอร์รี่','Cerise']],
    ['🍐',['梨','Pear','ナシ','배','Pera','ลูกแพร์','Poire']],
    ['🍋',['柠檬','Lemon','レモン','레몬','Limón','มะนาว','Citron']],
    ['🥭',['芒果','Mango','マンゴー','망고','Mango','มะม่วง','Mangue']]
  ]},
  { id:'colors', type:'color', label:['颜色','Colors','いろ','색깔','Colores','สี','Couleurs'], items:[
    ['#e74c3c',['红色','Red','あか','빨강','Rojo','สีแดง','Rouge']],
    ['#e67e22',['橙色','Orange','オレンジ','주황','Naranja','สีส้ม','Orange']],
    ['#f1c40f',['黄色','Yellow','きいろ','노랑','Amarillo','สีเหลือง','Jaune']],
    ['#2ecc71',['绿色','Green','みどり','초록','Verde','สีเขียว','Vert']],
    ['#3498db',['蓝色','Blue','あお','파랑','Azul','สีฟ้า','Bleu']],
    ['#9b59b6',['紫色','Purple','むらさき','보라','Morado','สีม่วง','Violet']],
    ['#ff8fc0',['粉色','Pink','ピンク','분홍','Rosa','สีชมพู','Rose']],
    ['#8d5a2b',['棕色','Brown','ちゃいろ','갈색','Marrón','สีน้ำตาล','Marron']]
  ]},
  { id:'shapes', type:'shape', label:['形状','Shapes','かたち','모양','Formas','รูปทรง','Formes'], items:[
    ['circle',['圆形','Circle','円','원','Círculo','วงกลม','Cercle']],
    ['square',['正方形','Square','四角','정사각형','Cuadrado','สี่เหลี่ยมจัตุรัส','Carré']],
    ['triangle',['三角形','Triangle','三角','삼각형','Triángulo','สามเหลี่ยม','Triangle']],
    ['rectangle',['长方形','Rectangle','長方形','직사각형','Rectángulo','สี่เหลี่ยมผืนผ้า','Rectangle']],
    ['star',['星形','Star','星','별','Estrella','ดาว','Étoile']],
    ['heart',['心形','Heart','ハート','하트','Corazón','หัวใจ','Cœur']]
  ]},
  { id:'vehicles', type:'emoji', label:['交通工具','Vehicles','のりもの','탈것','Vehículos','ยานพาหนะ','Véhicules'], items:[
    ['🚗',['汽车','Car','車','자동차','Coche','รถยนต์','Voiture']],
    ['🚌',['公交车','Bus','バス','버스','Autobús','รถบัส','Bus']],
    ['🚂',['火车','Train','電車','기차','Tren','รถไฟ','Train']],
    ['✈️',['飞机','Airplane','飛行機','비행기','Avión','เครื่องบิน','Avion']],
    ['🚢',['轮船','Ship','船','배','Barco','เรือ','Bateau']],
    ['🚲',['自行车','Bicycle','自転車','자전거','Bicicleta','จักรยาน','Vélo']],
    ['🏍️',['摩托车','Motorcycle','バイク','오토바이','Motocicleta','มอเตอร์ไซค์','Moto']],
    ['🚒',['消防车','Fire truck','消防車','소방차','Camión de bomberos','รถดับเพลิง','Camion de pompiers']],
    ['🚓',['警车','Police car','パトカー','경찰차','Coche de policía','รถตำรวจ','Voiture de police']],
    ['🚑',['救护车','Ambulance','救急車','구급차','Ambulancia','รถพยาบาล','Ambulance']],
    ['🚁',['直升机','Helicopter','ヘリコプター','헬리콥터','Helicóptero','เฮลิคอปเตอร์','Hélicoptère']],
    ['🚕',['出租车','Taxi','タクシー','택시','Taxi','แท็กซี่','Taxi']]
  ]},
  { id:'veggies', type:'emoji', label:['蔬菜','Vegetables','やさい','채소','Verduras','ผัก','Légumes'], items:[
    ['🥕',['胡萝卜','Carrot','ニンジン','당근','Zanahoria','แครอท','Carotte']],
    ['🍅',['西红柿','Tomato','トマト','토마토','Tomate','มะเขือเทศ','Tomate']],
    ['🌽',['玉米','Corn','トウモロコシ','옥수수','Maíz','ข้าวโพด','Maïs']],
    ['🥔',['土豆','Potato','ジャガイモ','감자','Patata','มันฝรั่ง','Pomme de terre']],
    ['🥒',['黄瓜','Cucumber','キュウリ','오이','Pepino','แตงกวา','Concombre']],
    ['🍆',['茄子','Eggplant','ナス','가지','Berenjena','มะเขือยาว','Aubergine']],
    ['🫑',['青椒','Pepper','ピーマン','피망','Pimiento','พริกหยวก','Poivron']],
    ['🍄',['蘑菇','Mushroom','キノコ','버섯','Champiñón','เห็ด','Champignon']],
    ['🎃',['南瓜','Pumpkin','カボチャ','호박','Calabaza','ฟักทอง','Citrouille']],
    ['🥦',['西兰花','Broccoli','ブロッコリー','브로콜리','Brócoli','บรอกโคลี','Brocoli']]
  ]},
  { id:'body', type:'emoji', label:['身体部位','Body','からだ','신체 부위','Cuerpo','ร่างกาย','Corps'], items:[
    ['👀',['眼睛','Eye','目','눈','Ojo','ตา','Œil']],
    ['👂',['耳朵','Ear','耳','귀','Oreja','หู','Oreille']],
    ['👃',['鼻子','Nose','鼻','코','Nariz','จมูก','Nez']],
    ['👄',['嘴巴','Mouth','口','입','Boca','ปาก','Bouche']],
    ['✋',['手','Hand','手','손','Mano','มือ','Main']],
    ['🦶',['脚','Foot','足','발','Pie','เท้า','Pied']],
    ['🦷',['牙齿','Tooth','歯','이','Diente','ฟัน','Dent']],
    ['💪',['手臂','Arm','腕','팔','Brazo','แขน','Bras']]
  ]},
  { id:'objects', type:'emoji', label:['日常用品','Objects','どうぐ','물건','Objetos','ของใช้ในบ้าน','Objets'], items:[
    ['☕',['杯子','Cup','コップ','컵','Taza','แก้ว','Tasse']],
    ['📖',['书本','Book','本','책','Libro','หนังสือ','Livre']],
    ['⚽',['皮球','Ball','ボール','공','Pelota','ลูกบอล','Ballon']],
    ['🪑',['椅子','Chair','イス','의자','Silla','เก้าอี้','Chaise']],
    ['🛏️',['小床','Bed','ベッド','침대','Cama','เตียง','Lit']],
    ['☎️',['电话','Telephone','電話','전화','Teléfono','โทรศัพท์','Téléphone']],
    ['⏰',['时钟','Clock','時計','시계','Reloj','นาฬิกา','Horloge']],
    ['☂️',['雨伞','Umbrella','傘','우산','Paraguas','ร่ม','Parapluie']],
    ['🔑',['钥匙','Key','鍵','열쇠','Llave','กุญแจ','Clé']],
    ['👓',['眼镜','Glasses','メガネ','안경','Gafas','แว่นตา','Lunettes']],
    ['🎩',['帽子','Hat','帽子','모자','Sombrero','หมวก','Chapeau']],
    ['👟',['鞋子','Shoes','靴','신발','Zapatos','รองเท้า','Chaussures']]
  ]},
  { id:'numbers', type:'number', label:['数字','Numbers','すうじ','숫자','Números','ตัวเลข','Nombres'], items:[
    [1,['一','One','一','하나','Uno','หนึ่ง','Un']],
    [2,['二','Two','二','둘','Dos','สอง','Deux']],
    [3,['三','Three','三','셋','Tres','สาม','Trois']],
    [4,['四','Four','四','넷','Cuatro','สี่','Quatre']],
    [5,['五','Five','五','다섯','Cinco','ห้า','Cinq']],
    [6,['六','Six','六','여섯','Seis','หก','Six']],
    [7,['七','Seven','七','일곱','Siete','เจ็ด','Sept']],
    [8,['八','Eight','八','여덟','Ocho','แปด','Huit']],
    [9,['九','Nine','九','아홉','Nueve','เก้า','Neuf']],
    [10,['十','Ten','十','열','Diez','สิบ','Dix']]
  ]},
  { id:'weather', type:'emoji', label:['天气','Weather','てんき','날씨','Clima','สภาพอากาศ','Météo'], items:[
    ['☀️',['太阳','Sun','太陽','해','Sol','พระอาทิตย์','Soleil']],
    ['🌧️',['下雨','Rain','雨','비','Lluvia','ฝน','Pluie']],
    ['❄️',['下雪','Snow','雪','눈','Nieve','หิมะ','Neige']],
    ['☁️',['云朵','Cloud','雲','구름','Nube','เมฆ','Nuage']],
    ['🌈',['彩虹','Rainbow','虹','무지개','Arcoíris','รุ้ง','Arc-en-ciel']],
    ['⚡',['打雷','Thunder','雷','천둥','Trueno','ฟ้าร้อง','Tonnerre']],
    ['🌬️',['大风','Wind','風','바람','Viento','ลม','Vent']]
  ]},
  { id:'emotions', type:'emoji', label:['表情','Emotions','きもち','감정','Emociones','อารมณ์','Émotions'], items:[
    ['😄',['开心','Happy','うれしい','기쁨','Feliz','มีความสุข','Content']],
    ['😢',['难过','Sad','かなしい','슬픔','Triste','เศร้า','Triste']],
    ['😠',['生气','Angry','おこっている','화남','Enfadado','โกรธ','En colère']],
    ['😲',['惊讶','Surprised','びっくり','놀람','Sorprendido','ประหลาดใจ','Surpris']],
    ['😱',['害怕','Scared','こわい','무서움','Asustado','กลัว','Effrayé']],
    ['😴',['困了','Sleepy','ねむい','졸림','Con sueño','ง่วงนอน','Fatigué']]
  ]}
];
function nm(item){ return item[1][li()]; }
function catLabel(cat){ return cat.label[li()]; }

const STORAGE_KEY = 'baby-cognition-progress-v2';
let state = {
  lang: null,
  stars: 0,
  mode: 'see',
  autoSpeak: true,
  enabled: {}
};

const store = {
  async get(key){
    try{
      if(window.storage && typeof window.storage.get === 'function'){
        const res = await window.storage.get(key);
        return res && res.value ? res.value : null;
      }
      if(window.localStorage) return localStorage.getItem(key);
    }catch(e){}
    return null;
  },
  async set(key, value){
    try{
      if(window.storage && typeof window.storage.set === 'function'){
        await window.storage.set(key, value, false);
        return;
      }
      if(window.localStorage) localStorage.setItem(key, value);
    }catch(e){}
  }
};

async function loadState(){
  try{
    const raw = await store.get(STORAGE_KEY);
    if(raw){
      const parsed = JSON.parse(raw);
      state = Object.assign(state, parsed);
    }
  }catch(e){}
  CATS.forEach(c=>{ if(!(c.id in state.enabled)) state.enabled[c.id] = true; });
}
let saveTimer=null;
function saveState(){
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async ()=>{
    try{ await store.set(STORAGE_KEY, JSON.stringify(state)); }catch(e){}
  }, 300);
}

function unlockedCount(){ return Math.min(CATS.length, 3 + Math.floor(state.stars/6)); }
function level(){ return Math.floor(state.stars/8)+1; }
function optionCount(){ return Math.min(2 + (level()-1), 5); }
function availableCats(){
  const n = unlockedCount();
  return CATS.slice(0,n).filter(c=>state.enabled[c.id]!==false);
}

let voices = [];
function loadVoices(){ voices = speechSynthesis.getVoices ? speechSynthesis.getVoices() : []; }
if('speechSynthesis' in window){
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
}
function speak(text){
  if(!('speechSynthesis' in window) || !text) return;
  try{
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const info = LANG_INFO[state.lang] || LANG_INFO.en;
    u.lang = info.speech;
    u.rate = 0.85; u.pitch = 1.1;
    let match = voices.find(v=>v.lang && v.lang.toLowerCase() === info.speech.toLowerCase());
    if(!match) match = voices.find(v=>v.lang && v.lang.toLowerCase().startsWith(state.lang));
    if(!match) match = voices.find(v=>v.lang && v.lang.toLowerCase().split('-')[0] === state.lang);
    if(match) u.voice = match;
    speechSynthesis.speak(u);
  }catch(e){}
}

let actx = null;
function ctx(){
  if(!actx){ const AC = window.AudioContext || window.webkitAudioContext; actx = new AC(); }
  if(actx.state === 'suspended') actx.resume();
  return actx;
}
function tone(freq, start, dur, type='sine', gainPeak=0.18){
  const c = ctx();
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type; osc.frequency.value = freq;
  osc.connect(gain); gain.connect(c.destination);
  const t0 = c.currentTime + start;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(gainPeak, t0+0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, t0+dur);
  osc.start(t0); osc.stop(t0+dur+0.02);
}
function playCorrect(){ tone(523.25,0,0.16); tone(659.25,0.12,0.16); tone(783.99,0.24,0.28); }
function playWrong(){ tone(300,0,0.18,'sine',0.12); tone(230,0.15,0.22,'sine',0.1); }
function playUnlock(){ [523,659,783,1046].forEach((f,i)=> tone(f, i*0.11, 0.22,'triangle',0.15)); }

function shapeSVG(kind, fill){
  const f = fill || '#ff6f61';
  switch(kind){
    case 'circle': return '<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="'+f+'"/></svg>';
    case 'square': return '<svg viewBox="0 0 100 100"><rect x="8" y="8" width="84" height="84" rx="10" fill="'+f+'"/></svg>';
    case 'triangle': return '<svg viewBox="0 0 100 100"><polygon points="50,8 92,90 8,90" fill="'+f+'"/></svg>';
    case 'rectangle': return '<svg viewBox="0 0 100 70"><rect x="4" y="4" width="92" height="62" rx="10" fill="'+f+'"/></svg>';
    case 'star': return '<svg viewBox="0 0 100 100"><polygon points="50,5 61,38 96,38 68,59 79,92 50,72 21,92 32,59 4,38 39,38" fill="'+f+'"/></svg>';
    case 'heart': return '<svg viewBox="0 0 100 90"><path d="M50 85 C 10 55, -5 25, 20 10 C 38 -2, 50 15, 50 25 C 50 15, 62 -2, 80 10 C 105 25, 90 55, 50 85 Z" fill="'+f+'"/></svg>';
    default: return '';
  }
}
function renderStageVisual(cat, item, container){
  container.innerHTML='';
  if(cat.type==='emoji'){
    const el = document.createElement('div'); el.className='stage-emoji bounce'; el.textContent = item[0];
    container.appendChild(el);
  } else if(cat.type==='color'){
    const el = document.createElement('div'); el.className='stage-color-blob'; el.style.background = item[0];
    container.appendChild(el);
  } else if(cat.type==='shape'){
    const el = document.createElement('div'); el.className='stage-shape'; el.innerHTML = shapeSVG(item[0]);
    container.appendChild(el);
  } else if(cat.type==='number'){
    const wrap = document.createElement('div'); wrap.className='stage-number';
    const digit = document.createElement('div'); digit.className='digit'; digit.textContent = item[0];
    const dots = document.createElement('div'); dots.className='dots';
    for(let i=0;i<item[0];i++){ const d=document.createElement('span'); dots.appendChild(d); }
    wrap.appendChild(digit); wrap.appendChild(dots);
    container.appendChild(wrap);
  }
}
function miniVisual(cat, item){
  if(cat.type==='emoji') return '<span class="opt-emoji">'+item[0]+'</span>';
  if(cat.type==='color') return '<span class="opt-color" style="background:'+item[0]+'"></span>';
  if(cat.type==='shape') return '<span class="opt-shape">'+shapeSVG(item[0])+'</span>';
  if(cat.type==='number') return '<span class="opt-emoji" style="font-size:30px;font-weight:800;color:var(--berry)">'+item[0]+'</span>';
  return '';
}

let round = { cat:null, item:null, options:[] };
let lockInput = false;

function pickRound(){
  const cats = availableCats();
  const pool = cats.length ? cats : CATS.slice(0,3);
  const cat = pool[Math.floor(Math.random()*pool.length)];
  const items = cat.items;
  const target = items[Math.floor(Math.random()*items.length)];
  const need = Math.min(optionCount(), items.length);
  const pickedNames = new Set([nm(target)]);
  const opts = [target];
  const shuffledItems = items.slice().sort(()=>Math.random()-0.5);
  for(const it of shuffledItems){
    if(opts.length>=need) break;
    if(!pickedNames.has(nm(it))){ opts.push(it); pickedNames.add(nm(it)); }
  }
  opts.sort(()=>Math.random()-0.5);
  round = { cat, item:target, options:opts };
}

function renderRound(){
  lockInput = false;
  const stage = document.getElementById('stageCard');
  const optWrap = document.getElementById('optionsWrap');
  optWrap.innerHTML='';

  if(state.mode==='see'){
    renderStageVisual(round.cat, round.item, stage);
    optWrap.className = 'options ' + (round.options.length<=4?'cols-2':'cols-3');
    round.options.forEach(opt=>{
      const btn = document.createElement('button');
      btn.className='opt-btn text-only';
      btn.innerHTML = '<span class="opt-text">'+nm(opt)+'</span>';
      btn.addEventListener('click', ()=>handleAnswer(opt, btn));
      optWrap.appendChild(btn);
    });
    if(state.autoSpeak){ setTimeout(()=>speak(nm(round.item)), 250); }
  } else {
    stage.innerHTML = '<div class="speak-stage"><button class="big-speaker" id="bigSpeakerBtn">🔊</button><div class="speak-hint">'+t('speakHint')+'</div></div>';
    document.getElementById('bigSpeakerBtn').addEventListener('click', ()=>speak(nm(round.item)));
    optWrap.className = 'options ' + (round.options.length<=4?'cols-2':'cols-3');
    round.options.forEach(opt=>{
      const btn = document.createElement('button');
      btn.className='opt-btn';
      btn.innerHTML = miniVisual(round.cat, opt);
      btn.addEventListener('click', ()=>handleAnswer(opt, btn));
      optWrap.appendChild(btn);
    });
    setTimeout(()=>speak(nm(round.item)), 300);
  }
}

function handleAnswer(opt, btn){
  if(lockInput) return;
  if(nm(opt) === nm(round.item)){
    lockInput = true;
    btn.classList.add('correct');
    playCorrect();
    speak(pickPraise());
    spawnStar(btn);
    confettiBurst();
    const prevUnlocked = unlockedCount();
    state.stars += 1;
    updateHeader();
    saveState();
    if(unlockedCount() > prevUnlocked){ setTimeout(showUnlockToast, 500); }
    setTimeout(nextRound, 950);
  } else {
    btn.classList.add('wrong');
    btn.classList.add('disabled');
    playWrong();
    speak(t('wrongSpeech'));
  }
}

function nextRound(){ pickRound(); renderRound(); }

function updateHeader(){
  document.getElementById('starCount').textContent = state.stars;
  const pct = ((state.stars % 6) / 6) * 100;
  document.getElementById('progressBar').style.width = pct + '%';
}

function showUnlockToast(){
  playUnlock();
  const idx = unlockedCount()-1;
  const cat = CATS[idx];
  if(!cat) return;
  const toast = document.getElementById('toast');
  toast.textContent = t('unlockPre') + catLabel(cat) + t('unlockSuf');
  toast.classList.add('show');
  setTimeout(()=> toast.classList.remove('show'), 2200);
}

function spawnStar(btn){
  const rect = btn.getBoundingClientRect();
  const s = document.createElement('div');
  s.className='float-star'; s.textContent='⭐';
  s.style.left = (rect.left + rect.width/2 - 13) + 'px';
  s.style.top = (rect.top) + 'px';
  document.body.appendChild(s);
  setTimeout(()=>s.remove(), 900);
}
const CONFETTI_EMOJI = ['🎉','✨','⭐','🎈','🌟'];
function confettiBurst(){
  for(let i=0;i<10;i++){
    const p = document.createElement('div');
    p.className='confetti-piece';
    p.textContent = CONFETTI_EMOJI[Math.floor(Math.random()*CONFETTI_EMOJI.length)];
    p.style.left = Math.random()*100 + 'vw';
    p.style.animationDuration = (1.4 + Math.random()*1.2) + 's';
    p.style.fontSize = (16 + Math.random()*14) + 'px';
    document.body.appendChild(p);
    setTimeout(()=>p.remove(), 2800);
  }
}

function makeClouds(){
  const layer = document.getElementById('cloudLayer');
  const cloudSVG = '<svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg"><ellipse cx="30" cy="40" rx="28" ry="18" fill="white"/><ellipse cx="60" cy="28" rx="32" ry="22" fill="white"/><ellipse cx="90" cy="40" rx="26" ry="16" fill="white"/></svg>';
  const configs = [
    {top:'8%', w:110, dur:46, delay:0},
    {top:'20%', w:80, dur:60, delay:-20},
    {top:'2%', w:70, dur:38, delay:-8}
  ];
  configs.forEach(cfg=>{
    const d = document.createElement('div'); d.className='cloud';
    d.style.top = cfg.top; d.style.width = cfg.w+'px'; d.style.height = (cfg.w*0.5)+'px';
    d.style.animationDuration = cfg.dur+'s'; d.style.animationDelay = cfg.delay+'s';
    d.innerHTML = cloudSVG;
    layer.appendChild(d);
  });
}

function renderLangList(){
  const list = document.getElementById('langList');
  list.innerHTML='';
  LANGS.forEach(code=>{
    const info = LANG_INFO[code];
    const row = document.createElement('div');
    row.className = 'lang-row' + (state.lang===code ? ' selected':'');
    row.innerHTML = '<span class="lang-flag">'+info.flag+'</span><span class="lang-name">'+info.name+'</span>';
    row.addEventListener('click', ()=>{
      state.lang = code;
      saveState();
      document.getElementById('langOverlay').classList.remove('show');
      applyLanguageTexts();
      renderSettings();
      nextRound();
    });
    list.appendChild(row);
  });
}

function applyLanguageTexts(){
  document.querySelector('#modeToggle button[data-mode="see"]').textContent = '👀 ' + t('modeSee');
  document.querySelector('#modeToggle button[data-mode="hear"]').textContent = '👂 ' + t('modeHear');
  document.getElementById('replayLabel').textContent = t('replay');
  document.getElementById('settingsTitle').textContent = t('settingsTitle');
  document.getElementById('autoSpeakLabel').textContent = t('autoSpeak');
  document.getElementById('resetBtn').textContent = t('reset');
  document.getElementById('closeSettings').textContent = t('done');
}

function renderSettings(){
  const list = document.getElementById('catList');
  list.innerHTML='';
  const n = unlockedCount();
  CATS.forEach((c,i)=>{
    const unlocked = i<n;
    const row = document.createElement('div');
    row.className='row';
    const on = unlocked && state.enabled[c.id]!==false;
    row.innerHTML = '<span class="cat-name">'+catLabel(c)+(unlocked?'':' <span class="lock-note">'+t('locked')+'</span>')+'</span>' +
      '<button class="switch '+(on?'on':'')+' '+(unlocked?'':'locked')+'" data-cat="'+c.id+'"></button>';
    list.appendChild(row);
  });
  list.querySelectorAll('.switch[data-cat]').forEach(sw=>{
    sw.addEventListener('click', ()=>{
      if(sw.classList.contains('locked')) return;
      const id = sw.dataset.cat;
      state.enabled[id] = !(state.enabled[id]!==false);
      sw.classList.toggle('on');
      saveState();
    });
  });
  document.getElementById('autoSpeakSwitch').classList.toggle('on', state.autoSpeak);
}

function bindEvents(){
  document.getElementById('modeToggle').addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-mode]');
    if(!btn) return;
    document.querySelectorAll('#modeToggle button').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    state.mode = btn.dataset.mode;
    saveState();
    nextRound();
  });

  document.getElementById('replayBtn').addEventListener('click', ()=>{
    ctx();
    if(round.item) speak(nm(round.item));
  });

  document.getElementById('settingsBtn').addEventListener('click', ()=>{
    renderSettings();
    document.getElementById('settingsOverlay').classList.add('show');
  });
  document.getElementById('closeSettings').addEventListener('click', ()=>{
    document.getElementById('settingsOverlay').classList.remove('show');
  });
  document.getElementById('autoSpeakSwitch').addEventListener('click', (e)=>{
    state.autoSpeak = !state.autoSpeak;
    e.currentTarget.classList.toggle('on');
    saveState();
  });
  document.getElementById('resetBtn').addEventListener('click', ()=>{
    if(confirm(t('resetConfirm'))){
      state.stars = 0;
      state.enabled = {};
      CATS.forEach(c=> state.enabled[c.id] = true);
      saveState();
      updateHeader();
      renderSettings();
      document.getElementById('settingsOverlay').classList.remove('show');
      nextRound();
    }
  });

  document.getElementById('langBtn').addEventListener('click', ()=>{
    renderLangList();
    document.getElementById('langOverlay').classList.add('show');
  });

  document.body.addEventListener('click', ()=>{ try{ ctx(); }catch(e){} }, { once:true });
}

(async function init(){
  await loadState();
  makeClouds();
  bindEvents();
  updateHeader();

  if(!state.lang){
    renderLangList();
    document.getElementById('langOverlay').classList.add('show');
    pickRound();
  } else {
    document.querySelectorAll('#modeToggle button').forEach(b=>{
      b.classList.toggle('active', b.dataset.mode===state.mode);
    });
    applyLanguageTexts();
    pickRound();
    renderRound();
  }
})();

})();
<\/script>
</body>
</html>`;

  window.initGame = function initGame(wrapper) {
    if (!wrapper || typeof wrapper.replaceChildren !== 'function') {
      throw new Error('initGame requires a container element.');
    }
    var frame = document.createElement('iframe');
    frame.title = 'Kids Cognition World';
    frame.setAttribute('allow', 'autoplay; fullscreen');
    frame.style.cssText = 'display:block;width:100%;height:100%;min-height:640px;border:0;border-radius:16px;background:#7fd0ff;overflow:hidden;';
    frame.srcdoc = gameHTML;
    wrapper.replaceChildren(frame);
    return frame;
  };
})();
