/* Type Strike Arcade · Typing Battle Game */
(function () {
  'use strict';

  /* ================================================================
     🎵 背景音乐设置
  ================================================================ */
  const BGM_VIDEO_ID = 'YcgwPBwF7Dw';   // ← 换成你的 YouTube 音乐 ID
  const BGM_VOLUME = 55;                 // 0-100
  const BGM_AUTOPLAY = true;

  const gameHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Type Strike Arcade</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
:root{
  --bg:#07070f;--panel:#0f1220;--line:#1e2440;
  --text:#e8f0ff;--dim:#6a7590;
  --cyan:#00e5ff;--pink:#ff2e88;--gold:#ffd33d;
  --green:#3ff07a;--red:#ff3d5a;--purple:#b855ff;
  --orange:#ff8a3d;
}
html,body{
  height:100%;overflow:hidden;
  background:radial-gradient(ellipse at 50% 100%,#1a1f3a 0%,var(--bg) 65%);
  font-family:'Courier New',monospace;color:var(--text);
  user-select:none;
}
#stars{position:fixed;inset:0;z-index:0;pointer-events:none}
.star{position:absolute;background:white;border-radius:50%;animation:float linear infinite}
@keyframes float{from{transform:translateY(0)}to{transform:translateY(100vh)}}
#grid{
  position:fixed;bottom:0;left:0;right:0;height:45%;z-index:0;pointer-events:none;
  background:
    linear-gradient(180deg,transparent 0%,rgba(0,229,255,.06) 100%),
    repeating-linear-gradient(90deg,transparent 0 80px,rgba(0,229,255,.08) 80px 81px),
    repeating-linear-gradient(0deg,transparent 0 50px,rgba(0,229,255,.08) 50px 51px);
  transform:perspective(500px) rotateX(65deg);transform-origin:bottom;
  animation:gridMove 10s linear infinite;
}
@keyframes gridMove{
  from{background-position:0 0,0 0,0 0}
  to{background-position:0 0,0 0,0 50px}
}
#root{
  position:relative;z-index:1;
  height:100%;display:flex;flex-direction:column;
}

/* ============================================================ 
   SCREEN: DIFFICULTY SELECT
============================================================ */
#screen-select{
  flex:1;display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  padding:24px;
  animation:fadeIn .5s;
}
@keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
.title{
  font-size:clamp(40px,8vw,72px);font-weight:900;
  letter-spacing:-3px;line-height:1;
  text-shadow:0 0 20px var(--cyan),0 0 50px var(--cyan);
  margin-bottom:6px;text-align:center;
}
.title .strike{
  color:var(--pink);
  text-shadow:0 0 20px var(--pink),0 0 50px var(--pink);
}
.subtitle{
  font-size:13px;letter-spacing:8px;color:var(--dim);
  margin-bottom:38px;text-transform:uppercase;
  text-align:center;
}
.diff-grid{
  display:grid;grid-template-columns:repeat(2,1fr);
  gap:14px;max-width:620px;width:100%;
}
.diff-card{
  background:linear-gradient(145deg,rgba(20,26,45,.95),rgba(12,16,30,.95));
  border:2px solid var(--line);border-radius:16px;
  padding:20px 18px;cursor:pointer;
  transition:.25s;position:relative;overflow:hidden;
  text-align:center;
}
.diff-card::before{
  content:'';position:absolute;inset:0;
  background:linear-gradient(135deg,transparent 40%,rgba(255,255,255,.05));
  opacity:0;transition:.25s;
}
.diff-card:hover{transform:translateY(-4px);border-color:var(--cyan)}
.diff-card:hover::before{opacity:1}
.diff-card[data-diff="easy"]:hover{border-color:var(--green);box-shadow:0 0 30px rgba(63,240,122,.3)}
.diff-card[data-diff="middle"]:hover{border-color:var(--gold);box-shadow:0 0 30px rgba(255,211,61,.3)}
.diff-card[data-diff="advanced"]:hover{border-color:var(--orange);box-shadow:0 0 30px rgba(255,138,61,.3)}
.diff-card[data-diff="impossible"]:hover{border-color:var(--red);box-shadow:0 0 30px rgba(255,61,90,.4)}
.diff-icon{font-size:52px;line-height:1;margin-bottom:8px}
.diff-name{
  font-size:22px;font-weight:900;letter-spacing:3px;
  margin-bottom:6px;
}
.diff-card[data-diff="easy"] .diff-name{color:var(--green)}
.diff-card[data-diff="middle"] .diff-name{color:var(--gold)}
.diff-card[data-diff="advanced"] .diff-name{color:var(--orange)}
.diff-card[data-diff="impossible"] .diff-name{color:var(--red)}
.diff-desc{
  font-size:11px;color:var(--dim);line-height:1.6;
  letter-spacing:.5px;
}
.diff-stat{
  display:flex;justify-content:space-between;
  font-size:10px;color:var(--dim);margin-top:10px;
  padding-top:10px;border-top:1px solid rgba(255,255,255,.05);
  letter-spacing:1px;
}

@media(max-width:600px){
  .diff-grid{grid-template-columns:1fr;gap:10px}
  .diff-card{padding:14px 12px}
  .diff-icon{font-size:38px}
  .diff-name{font-size:18px}
}

/* ============================================================ 
   SCREEN: GAME
============================================================ */
#screen-game{
  flex:1;display:none;flex-direction:column;
  position:relative;overflow:hidden;
}
#screen-game.on{display:flex}

/* HUD */
#hud{
  display:flex;justify-content:space-between;align-items:center;
  padding:10px 18px;gap:10px;flex-wrap:wrap;
  background:linear-gradient(180deg,rgba(0,0,0,.5),transparent);
  z-index:5;position:relative;
}
.hud-item{
  background:rgba(15,18,32,.85);
  border:1.5px solid var(--line);
  border-radius:8px;padding:6px 12px;
  display:flex;align-items:center;gap:8px;
  font-size:11px;letter-spacing:1.5px;
  min-width:72px;justify-content:center;
}
.hud-item .lbl{color:var(--dim);font-weight:700}
.hud-item .val{font-weight:900;font-size:16px}
#hudScore .val{color:var(--gold)}
#hudWave .val{color:var(--purple)}
#hudAcc .val{color:var(--cyan)}
#hudLives .val{color:var(--red);font-size:18px;letter-spacing:1px}
.hud-item .val.dead{opacity:.2}

/* BATTLEFIELD */
#battlefield{
  flex:1;position:relative;overflow:hidden;
  min-height:200px;
}
#base{
  position:absolute;left:10px;top:50%;transform:translateY(-50%);
  font-size:60px;z-index:3;
  filter:drop-shadow(0 0 20px var(--cyan));
}
#base::after{
  content:'';position:absolute;
  top:50%;right:-30px;transform:translateY(-50%);
  width:40px;height:4px;background:var(--cyan);
  box-shadow:0 0 15px var(--cyan);
  animation:baseBeam 1.5s ease-in-out infinite;
}
@keyframes baseBeam{
  0%,100%{opacity:.4}
  50%{opacity:1}
}
.base-hp{
  position:absolute;left:18px;bottom:20%;
  width:80px;height:8px;background:rgba(0,0,0,.6);
  border:1px solid var(--line);border-radius:4px;overflow:hidden;
}
.base-hp-fill{
  height:100%;background:linear-gradient(90deg,var(--green),#2acc60);
  transition:width .3s,background .3s;
}

/* ENEMY */
.enemy{
  position:absolute;top:50%;transform:translate(-50%,-50%);
  z-index:2;
  display:flex;flex-direction:column;align-items:center;
  transition:opacity .3s;
  pointer-events:none;
}
.enemy.hit{animation:enemyHit .15s}
@keyframes enemyHit{
  0%,100%{transform:translate(-50%,-50%)}
  50%{transform:translate(-50%,-50%) scale(.9);filter:brightness(2)}
}
.enemy.hit-red .enemy-sprite{filter:drop-shadow(0 0 15px var(--red)) hue-rotate(180deg)}
.enemy.dying{animation:enemyDie .4s forwards}
@keyframes enemyDie{
  0%{transform:translate(-50%,-50%) scale(1)}
  100%{transform:translate(-50%,-50%) scale(2) rotate(45deg);opacity:0}
}
.enemy-sprite{
  font-size:52px;
  filter:drop-shadow(0 0 12px var(--pink));
  line-height:1;
}
.enemy-hp{
  width:60px;height:6px;margin-top:6px;
  background:rgba(0,0,0,.6);border:1px solid rgba(255,255,255,.15);
  border-radius:3px;overflow:hidden;
}
.enemy-hp-fill{
  height:100%;background:linear-gradient(90deg,var(--pink),#cc2050);
  transition:width .1s;
}

/* ATTACK EFFECT */
.attack-line{
  position:absolute;height:3px;
  background:linear-gradient(90deg,var(--cyan),transparent);
  box-shadow:0 0 20px var(--cyan);
  z-index:4;pointer-events:none;
  animation:attackBeam .35s ease-out forwards;
  transform-origin:left center;
}
@keyframes attackBeam{
  0%{opacity:1;transform:scaleX(0)}
  50%{opacity:1;transform:scaleX(1)}
  100%{opacity:0;transform:scaleX(1)}
}

/* DAMAGE FLASH */
.flash{
  position:fixed;inset:0;z-index:20;pointer-events:none;
  background:radial-gradient(circle at 50% 50%,transparent 30%,rgba(255,61,90,.4) 100%);
  opacity:0;
}
.flash.on{animation:flashRed .4s}
@keyframes flashRed{
  0%{opacity:0}
  30%{opacity:1}
  100%{opacity:0}
}
#wrap-shake{animation:shakeHard .4s}
@keyframes shakeHard{
  0%,100%{transform:translate(0,0)}
  10%{transform:translate(-10px,5px)}
  20%{transform:translate(10px,-5px)}
  30%{transform:translate(-8px,-3px)}
  40%{transform:translate(8px,3px)}
  50%{transform:translate(-5px,5px)}
  60%{transform:translate(5px,-5px)}
  70%{transform:translate(-3px,0)}
  80%{transform:translate(3px,0)}
  90%{transform:translate(-2px,0)}
}

/* TEXT PANEL */
#textPanel{
  padding:14px 18px 22px;
  background:linear-gradient(0deg,rgba(7,7,15,.9),rgba(7,7,15,.6) 60%,transparent);
  position:relative;z-index:5;
}
#textDisplay{
  max-width:900px;margin:0 auto;
  text-align:center;
  font-family:'Courier New',monospace;
  font-size:clamp(20px,3.5vw,30px);
  font-weight:900;line-height:1.5;
  letter-spacing:1px;
  min-height:48px;
  padding:14px 18px;
  background:rgba(10,12,22,.8);
  border:1.5px solid var(--line);
  border-radius:12px;
  word-wrap:break-word;
  position:relative;
  box-shadow:inset 0 0 30px rgba(0,229,255,.05);
}
#textDisplay::before{
  content:'';position:absolute;inset:-2px;
  border-radius:12px;pointer-events:none;
  background:linear-gradient(90deg,transparent,var(--cyan),transparent);
  background-size:200% 100%;
  opacity:.15;
  animation:borderGlow 3s linear infinite;
}
@keyframes borderGlow{
  from{background-position:200% 0}
  to{background-position:-200% 0}
}
.ch{
  display:inline;
  color:#3a4460;
  transition:color .08s;
}
.ch.done{color:var(--green);text-shadow:0 0 8px rgba(63,240,122,.5)}
.ch.wrong{
  color:var(--red);text-shadow:0 0 12px var(--red);
  background:rgba(255,61,90,.15);
  border-radius:3px;
  animation:wrongPulse .3s;
}
@keyframes wrongPulse{
  0%,100%{transform:scale(1)}
  50%{transform:scale(1.15)}
}
.ch.current{
  color:white;
  text-shadow:0 0 10px var(--cyan),0 0 20px var(--cyan);
  border-bottom:2px solid var(--cyan);
  animation:currentBlink 1s infinite;
}
@keyframes currentBlink{
  50%{opacity:.6}
}
.ch.space.done{color:var(--green)}
.ch.space.current{border-bottom-color:var(--cyan)}

/* INPUT HIDDEN */
#hiddenInput{
  position:fixed;left:-9999px;top:-9999px;
  opacity:0;pointer-events:none;
}

/* ============================================================ 
   SCREEN: RESULT
============================================================ */
#screen-result{
  flex:1;display:none;flex-direction:column;
  align-items:center;justify-content:center;
  padding:30px;text-align:center;
}
#screen-result.on{display:flex;animation:fadeIn .5s}
.result-title{
  font-size:clamp(28px,6vw,52px);font-weight:900;
  letter-spacing:4px;margin-bottom:16px;
  color:var(--red);text-shadow:0 0 30px var(--red);
}
.result-sub{
  font-size:13px;letter-spacing:4px;color:var(--dim);
  margin-bottom:32px;text-transform:uppercase;
}
.result-grid{
  display:grid;grid-template-columns:repeat(2,1fr);
  gap:12px;max-width:520px;width:100%;margin-bottom:32px;
}
.res-box{
  background:linear-gradient(145deg,rgba(20,26,45,.9),rgba(12,16,30,.9));
  border:1.5px solid var(--line);border-radius:12px;
  padding:14px 12px;
}
.res-lbl{
  font-size:10px;letter-spacing:2px;color:var(--dim);
  text-transform:uppercase;font-weight:700;
}
.res-val{
  font-size:24px;font-weight:900;margin-top:4px;line-height:1;
}
.res-val.gold{color:var(--gold);text-shadow:0 0 12px var(--gold)}
.res-val.cyan{color:var(--cyan);text-shadow:0 0 12px var(--cyan)}
.res-val.green{color:var(--green);text-shadow:0 0 12px var(--green)}
.res-val.pink{color:var(--pink);text-shadow:0 0 12px var(--pink)}
.res-val.purple{color:var(--purple);text-shadow:0 0 12px var(--purple)}
.res-val.red{color:var(--red);text-shadow:0 0 12px var(--red)}
.result-actions{
  display:flex;gap:14px;flex-wrap:wrap;justify-content:center;
}
.big-btn{
  background:linear-gradient(135deg,var(--cyan),#0088cc);
  color:#001018;border:0;
  padding:16px 44px;border-radius:12px;
  font-family:inherit;font-weight:900;
  font-size:16px;letter-spacing:3px;
  cursor:pointer;text-transform:uppercase;
  box-shadow:0 0 24px rgba(0,229,255,.5),0 5px 0 #003a52;
  transition:.1s;
}
.big-btn:hover{filter:brightness(1.1)}
.big-btn:active{transform:translateY(3px);box-shadow:0 0 24px rgba(0,229,255,.5),0 2px 0 #003a52}
.big-btn.ghost{
  background:transparent;color:var(--cyan);
  border:2px solid var(--cyan);
  box-shadow:0 0 12px rgba(0,229,255,.3);
}
.big-btn.ghost:hover{background:rgba(0,229,255,.1);box-shadow:0 0 22px var(--cyan)}

/* ============================================================ 
   PARTICLES
============================================================ */
.spark{
  position:fixed;pointer-events:none;z-index:30;
  font-family:inherit;font-weight:900;
  font-size:20px;
  animation:sparkFly .7s ease-out forwards;
}
@keyframes sparkFly{
  0%{opacity:1;transform:translate(0,0) scale(1)}
  100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.4)}
}

/* MUSIC BTN */
#musicBtn{
  position:fixed;bottom:16px;right:16px;z-index:20;
  width:46px;height:46px;border-radius:50%;
  background:rgba(15,18,32,.9);
  border:1.5px solid rgba(0,229,255,.5);
  color:var(--cyan);font-size:20px;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;box-shadow:0 0 12px rgba(0,229,255,.3);
  transition:.2s;
}
#musicBtn:hover{background:rgba(0,229,255,.15);transform:scale(1.1)}
#musicBtn.muted{color:#445;border-color:#223;box-shadow:none}
#musicBtn::after{
  content:'';position:absolute;top:-3px;right:-3px;
  width:10px;height:10px;border-radius:50%;
  background:var(--green);box-shadow:0 0 8px var(--green);
  opacity:0;transition:.3s;
}
#musicBtn.playing::after{opacity:1;animation:pulseDot 1.5s infinite}
@keyframes pulseDot{
  0%,100%{transform:scale(1);opacity:1}
  50%{transform:scale(1.5);opacity:.5}
}
#ytHost{position:fixed;bottom:-9999px;left:-9999px;width:1px;height:1px;opacity:0;pointer-events:none}

/* ============================================================ 
   WAVE BANNER
============================================================ */
#waveBanner{
  position:fixed;top:50%;left:50%;
  transform:translate(-50%,-50%);
  font-size:clamp(40px,8vw,80px);font-weight:900;
  letter-spacing:8px;color:var(--purple);
  text-shadow:0 0 30px var(--purple),0 0 60px var(--purple);
  opacity:0;pointer-events:none;z-index:40;
  text-transform:uppercase;
}
#waveBanner.on{animation:bannerIn 1.5s ease-out}
@keyframes bannerIn{
  0%{opacity:0;transform:translate(-50%,-50%) scale(.4)}
  25%{opacity:1;transform:translate(-50%,-50%) scale(1.15)}
  60%{opacity:1;transform:translate(-50%,-50%) scale(1)}
  100%{opacity:0;transform:translate(-50%,-50%) scale(1.3)}
}
</style>
</head>
<body>

<div id="stars"></div>
<div id="grid"></div>

<div id="root">
  <!-- DIFFICULTY SELECT -->
  <div id="screen-select">
    <div class="title">TYPE<span class="strike">STRIKE</span></div>
    <div class="subtitle">Arcade Typing Battle</div>
    <div class="diff-grid">
      <div class="diff-card" data-diff="easy">
        <div class="diff-icon">🐢</div>
        <div class="diff-name">EASY</div>
        <div class="diff-desc">Short words · Slow enemies<br>Perfect for warm-up</div>
        <div class="diff-stat"><span>HP 8</span><span>SPD 15s</span></div>
      </div>
      <div class="diff-card" data-diff="middle">
        <div class="diff-icon">👾</div>
        <div class="diff-name">MIDDLE</div>
        <div class="diff-desc">Medium words · Balanced<br>A real challenge</div>
        <div class="diff-stat"><span>HP 12</span><span>SPD 11s</span></div>
      </div>
      <div class="diff-card" data-diff="advanced">
        <div class="diff-icon">👹</div>
        <div class="diff-name">ADVANCED</div>
        <div class="diff-desc">Long words · Fast enemies<br>Only for skilled typists</div>
        <div class="diff-stat"><span>HP 16</span><span>SPD 8s</span></div>
      </div>
      <div class="diff-card" data-diff="impossible">
        <div class="diff-icon">💀</div>
        <div class="diff-name">IMPOSSIBLE</div>
        <div class="diff-desc">Sentences · Lightning enemies<br>Good luck</div>
        <div class="diff-stat"><span>HP 20</span><span>SPD 6s</span></div>
      </div>
    </div>
  </div>

  <!-- GAME -->
  <div id="screen-game">
    <div id="hud">
      <div class="hud-item" id="hudScore">
        <span class="lbl">SCORE</span><span class="val" id="scoreVal">0</span>
      </div>
      <div class="hud-item" id="hudWave">
        <span class="lbl">KILLS</span><span class="val" id="waveVal">0</span>
      </div>
      <div class="hud-item" id="hudAcc">
        <span class="lbl">ACC</span><span class="val" id="accVal">100%</span>
      </div>
      <div class="hud-item" id="hudLives">
        <span class="lbl">LIVES</span><span class="val" id="livesVal">♥♥♥</span>
      </div>
    </div>

    <div id="battlefield">
      <div id="base">🏰</div>
      <div class="base-hp"><div class="base-hp-fill" id="baseHp" style="width:100%"></div></div>
    </div>

    <div id="textPanel">
      <div id="textDisplay"></div>
    </div>
  </div>

  <!-- RESULT -->
  <div id="screen-result"></div>
</div>

<div class="flash" id="flash"></div>
<div id="waveBanner"></div>
<button id="musicBtn" class="muted">♪</button>
<input id="hiddenInput" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">
<div id="ytHost"></div>

<script>
/* ====================================================================
   CONFIG
   ==================================================================== */
const BGM_VIDEO_ID = '__BGM_VIDEO_ID__';
const BGM_VOLUME = __BGM_VOLUME__;
const BGM_AUTOPLAY = __BGM_AUTOPLAY__;

/* ====================================================================
   WORD POOLS
   ==================================================================== */
const EASY_WORDS = (
  'cat dog sun moon star sky fish bird tree leaf rain snow wind fire ice ' +
  'cake milk rice meat fish road shop book door lamp ball ring coin gold ' +
  'king queen love hope time year day week life home food game work play ' +
  'jump run walk talk look help need want find give make take call rise ' +
  'blue red pink gray white black green pearl ocean beach cloud stone'
).split(/\\s+/);

const MEDIUM_WORDS = (
  'garden rocket guitar pencil orange purple yellow planet forest flower ' +
  'silver marble crystal diamond wolf rabbit turtle dolphin elephant ' +
  'mountain journey library mystery whisper thunder lantern pirate ' +
  'kingdom village rainbow morning evening summer winter autumn spring ' +
  'animal letter number little father mother sister brother friend ' +
  'school garden market office window pillow coffee tea cup hand note ' +
  'guitar dance music picture paper letter money castle knight dragon'
).split(/\\s+/);

const LONG_WORDS = (
  'adventure challenge celebrate discovery electricity experience ' +
  'fantastic generation imagination incredible javascript knowledge ' +
  'landscape mysterious necessary opportunity performance ' +
  'question remember signature technology understand victory ' +
  'wilderness yesterday zookeeper achievement brilliant ' +
  'communicate demonstrate environment fascinating ' +
  'hospital important libraries magnificent neighborhood ' +
  'organization preparation responsible satisfaction temperature ' +
  'university vocabulary helicopter restaurant comfortable'
).split(/\\s+/);

const HARD_PHRASES = [
  "What's 2 + 2? It's 4 - obviously!",
  "The 2024 report shows a 15% increase!",
  "She said, 'I can't believe it worked!'",
  "Update 3.0.1 is live - check it out.",
  "Why didn't you call? I waited 45 minutes!!",
  "The $1,234,567 deal was closed yesterday.",
  "Wait... really? That's amazing - good job!",
  "It's 9:00 AM - time to start working.",
  "Don't forget: the meeting is at 3:30 PM.",
  "He asked, 'Who's there?' Nobody answered.",
  "Try again - you'll get it right this time!",
  "Code, coffee, code, coffee - repeat forever."
];

/* ====================================================================
   DIFFICULTY CONFIG
   ==================================================================== */
const DIFFS = {
  easy: {
    label: 'EASY',
    icon: '🐢',
    enemyHp: 8,
    enemyDuration: 15000,
    spawnInterval: 6500,
    pool: EASY_WORDS,
    scorePerHit: 10,
    scorePerKill: 100,
    color: '#3ff07a'
  },
  middle: {
    label: 'MIDDLE',
    icon: '👾',
    enemyHp: 12,
    enemyDuration: 11000,
    spawnInterval: 5200,
    pool: MEDIUM_WORDS,
    scorePerHit: 15,
    scorePerKill: 200,
    color: '#ffd33d'
  },
  advanced: {
    label: 'ADVANCED',
    icon: '👹',
    enemyHp: 16,
    enemyDuration: 8000,
    spawnInterval: 4200,
    pool: LONG_WORDS,
    scorePerHit: 20,
    scorePerKill: 350,
    color: '#ff8a3d'
  },
  impossible: {
    label: 'IMPOSSIBLE',
    icon: '💀',
    enemyHp: 20,
    enemyDuration: 6000,
    spawnInterval: 3500,
    pool: HARD_PHRASES,
    scorePerHit: 30,
    scorePerKill: 500,
    color: '#ff3d5a'
  }
};

/* ====================================================================
   STATE
   ==================================================================== */
const state = {
  running: false,
  difficulty: null,
  cfg: null,
  score: 0,
  kills: 0,
  lives: 3,
  totalKeys: 0,
  correctKeys: 0,
  enemyId: 0,
  enemies: [],
  currentText: '',
  currentIdx: 0,
  wrongChar: false,
  spawnTimer: null,
  rafId: null,
  lastTime: 0,
  paused: false,
  startTime: 0
};

/* ====================================================================
   DOM
   ==================================================================== */
const $ = id => document.getElementById(id);
const dom = {
  screenSelect: $('screen-select'),
  screenGame: $('screen-game'),
  screenResult: $('screen-result'),
  battlefield: $('battlefield'),
  textDisplay: $('textDisplay'),
  scoreVal: $('scoreVal'),
  waveVal: $('waveVal'),
  accVal: $('accVal'),
  livesVal: $('livesVal'),
  baseHp: $('baseHp'),
  hiddenInput: $('hiddenInput'),
  flash: $('flash'),
  waveBanner: $('waveBanner'),
  musicBtn: $('musicBtn')
};

/* ====================================================================
   STARS BACKGROUND
   ==================================================================== */
(function(){
  const layer = $('stars');
  for(let i = 0; i < 90; i++){
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 2 + 0.5;
    s.style.cssText =
      'width:' + size + 'px;height:' + size + 'px;' +
      'left:' + Math.random() * 100 + 'vw;' +
      'top:' + (-Math.random() * 100) + 'vh;' +
      'opacity:' + (0.2 + Math.random() * 0.7) + ';' +
      'animation-duration:' + (8 + Math.random() * 20) + 's;' +
      'animation-delay:' + (-Math.random() * 20) + 's;';
    layer.appendChild(s);
  }
})();

/* ====================================================================
   YOUTUBE MUSIC
   ==================================================================== */
let ytPlayer = null;
let ytApiReady = false;
let musicOn = false;

function loadYTApi(){
  if(window.YT && window.YT.Player) return;
  if(document.getElementById('yt-api')) return;
  const s = document.createElement('script');
  s.id = 'yt-api';
  s.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(s);
}

window.onYouTubeIframeAPIReady = function(){
  ytApiReady = true;
  if(BGM_AUTOPLAY && BGM_VIDEO_ID) createYTPlayer();
};

function createYTPlayer(){
  if(!ytApiReady || !BGM_VIDEO_ID) return;
  try{
    ytPlayer = new YT.Player('ytHost', {
      height: '1', width: '1',
      videoId: BGM_VIDEO_ID,
      playerVars: {
        autoplay: 1, controls: 0, disablekb: 1,
        modestbranding: 1, rel: 0, playsinline: 1,
        loop: 1, playlist: BGM_VIDEO_ID
      },
      events: {
        onReady: e => {
          e.target.setVolume(BGM_VOLUME);
          e.target.playVideo();
          musicOn = true;
          dom.musicBtn.classList.remove('muted');
          dom.musicBtn.classList.add('playing');
        },
        onStateChange: e => {
          if(e.data === 0){
            ytPlayer.seekTo(0);
            ytPlayer.playVideo();
          }
        }
      }
    });
  }catch(err){}
}

dom.musicBtn.addEventListener('click', () => {
  if(!ytPlayer){
    if(ytApiReady) createYTPlayer();
    else loadYTApi();
    return;
  }
  if(musicOn){
    ytPlayer.pauseVideo();
    musicOn = false;
    dom.musicBtn.classList.remove('playing');
    dom.musicBtn.classList.add('muted');
  } else {
    ytPlayer.playVideo();
    musicOn = true;
    dom.musicBtn.classList.add('playing');
    dom.musicBtn.classList.remove('muted');
  }
});

/* ====================================================================
   TEXT GENERATION
   ==================================================================== */
function pickText(cfg){
  return cfg.pool[Math.floor(Math.random() * cfg.pool.length)];
}

function renderText(){
  const text = state.currentText;
  const idx = state.currentIdx;
  const wrong = state.wrongChar;
  let html = '';
  for(let i = 0; i < text.length; i++){
    const ch = text[i];
    let cls = 'ch';
    if(ch === ' ') cls += ' space';
    if(i < idx) cls += ' done';
    else if(i === idx){
      cls += wrong ? ' wrong' : ' current';
    }
    const disp = ch === ' ' ? '&nbsp;' : (ch === '<' ? '&lt;' : ch === '>' ? '&gt;' : ch === '&' ? '&amp;' : ch);
    html += '<span class="' + cls + '">' + disp + '</span>';
  }
  dom.textDisplay.innerHTML = html;
}

function nextText(){
  state.currentText = pickText(state.cfg);
  state.currentIdx = 0;
  state.wrongChar = false;
  renderText();
}

/* ====================================================================
   ENEMY MANAGEMENT
   ==================================================================== */
function spawnEnemy(){
  if(!state.running || state.paused) return;

  const cfg = state.cfg;
  const id = ++state.enemyId;

  const enemyEl = document.createElement('div');
  enemyEl.className = 'enemy';
  enemyEl.dataset.id = id;
  enemyEl.innerHTML =
    '<div class="enemy-sprite">' + cfg.icon + '</div>' +
    '<div class="enemy-hp"><div class="enemy-hp-fill" style="width:100%"></div></div>';

  /* Random vertical position ±20% */
  const offsetY = (Math.random() - 0.5) * 30;
  enemyEl.style.top = (50 + offsetY) + '%';

  /* Start at right edge */
  enemyEl.style.left = '95%';
  dom.battlefield.appendChild(enemyEl);

  const enemy = {
    id: id,
    el: enemyEl,
    hpBar: enemyEl.querySelector('.enemy-hp-fill'),
    hp: cfg.enemyHp,
    maxHp: cfg.enemyHp,
    startTime: performance.now(),
    duration: cfg.enemyDuration,
    dead: false
  };
  state.enemies.push(enemy);
}

function updateEnemies(now){
  if(!state.running) return;
  const cfg = state.cfg;
  /* Field width: base at left 10px, enemies from 95% to ~8% */
  const endPos = 8;   /* 到达基地位置 */
  const startPos = 95;

  for(let i = state.enemies.length - 1; i >= 0; i--){
    const e = state.enemies[i];
    if(e.dead){
      state.enemies.splice(i, 1);
      continue;
    }
    const elapsed = now - e.startTime;
    const t = Math.min(elapsed / e.duration, 1);
    const pos = startPos - t * (startPos - endPos);
    e.el.style.left = pos + '%';

    if(t >= 1){
      /* Enemy reached base */
      enemyReachedBase(e);
    }
  }
}

function enemyReachedBase(enemy){
  if(enemy.dead) return;
  enemy.dead = true;
  enemy.el.remove();
  const idx = state.enemies.indexOf(enemy);
  if(idx >= 0) state.enemies.splice(idx, 1);

  state.lives--;
  updateHUD();
  damageFlash();
  screenShake();

  if(state.lives <= 0){
    endGame();
  }
}

function damageFlash(){
  dom.flash.classList.remove('on');
  void dom.flash.offsetWidth;
  dom.flash.classList.add('on');
}

function screenShake(){
  const root = document.getElementById('root');
  root.style.animation = 'none';
  void root.offsetWidth;
  root.style.animation = 'shakeHard .4s';
  setTimeout(() => { root.style.animation = ''; }, 450);
}

/* ====================================================================
   COMBAT
   ==================================================================== */
function getTargetEnemy(){
  /* Closest to base = smallest left percentage */
  if(state.enemies.length === 0) return null;
  let target = null;
  let minLeft = Infinity;
  for(const e of state.enemies){
    if(e.dead) continue;
    const left = parseFloat(e.el.style.left) || 100;
    if(left < minLeft){
      minLeft = left;
      target = e;
    }
  }
  return target;
}

function damageEnemy(enemy, amount){
  if(!enemy || enemy.dead) return;
  enemy.hp -= amount;
  if(enemy.hp < 0) enemy.hp = 0;
  enemy.hpBar.style.width = (enemy.hp / enemy.maxHp * 100) + '%';

  /* Hit flash */
  enemy.el.classList.remove('hit');
  void enemy.el.offsetWidth;
  enemy.el.classList.add('hit');
  setTimeout(() => enemy.el.classList.remove('hit'), 160);

  if(enemy.hp <= 0){
    killEnemy(enemy);
  }
}

function killEnemy(enemy){
  if(enemy.dead) return;
  enemy.dead = true;
  state.kills++;
  state.score += state.cfg.scorePerKill;
  updateHUD();

  /* Visual: explosion */
  const r = enemy.el.getBoundingClientRect();
  for(let i = 0; i < 8; i++){
    spawnSpark(
      r.left + r.width / 2,
      r.top + r.height / 2,
      ['⭐', '✨', '💥', '✦'][Math.floor(Math.random() * 4)],
      state.cfg.color
    );
  }
  enemy.el.classList.add('dying');
  setTimeout(() => enemy.el.remove(), 400);

  const idx = state.enemies.indexOf(enemy);
  if(idx >= 0) state.enemies.splice(idx, 1);
}

function spawnSpark(x, y, char, color){
  const s = document.createElement('div');
  s.className = 'spark';
  s.textContent = char;
  s.style.left = x + 'px';
  s.style.top = y + 'px';
  s.style.color = color || '#3ff07a';
  s.style.textShadow = '0 0 12px ' + (color || '#3ff07a');
  s.style.setProperty('--dx', (Math.random() - 0.5) * 120 + 'px');
  s.style.setProperty('--dy', (-Math.random() * 100 - 30) + 'px');
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 700);
}

/* ====================================================================
   ATTACK BEAM VISUAL
   ==================================================================== */
function showAttackBeam(enemy){
  if(!enemy) return;
  const base = $('base').getBoundingClientRect();
  const target = enemy.el.getBoundingClientRect();
  const beam = document.createElement('div');
  beam.className = 'attack-line';
  const x1 = base.right;
  const y1 = base.top + base.height / 2;
  const x2 = target.left;
  const y2 = target.top + target.height / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;

  beam.style.left = x1 + 'px';
  beam.style.top = (y1 - 1.5) + 'px';
  beam.style.width = dist + 'px';
  beam.style.transform = 'rotate(' + angle + 'deg)';
  document.body.appendChild(beam);
  setTimeout(() => beam.remove(), 400);
}

/* ====================================================================
   KEY HANDLING
   ==================================================================== */
function handleKey(key){
  if(!state.running || state.paused) return;

  const target = state.currentText[state.currentIdx];
  if(target === undefined) return;

  state.totalKeys++;

  if(key === target){
    /* Correct */
    state.correctKeys++;
    state.currentIdx++;
    state.wrongChar = false;

    /* Damage the closest enemy */
    const enemy = getTargetEnemy();
    if(enemy){
      damageEnemy(enemy, 1);
      showAttackBeam(enemy);
      state.score += state.cfg.scorePerHit;
      updateHUD();
    }

    /* Visual: spark on correct key */
    const textEl = dom.textDisplay;
    const textRect = textEl.getBoundingClientRect();
    spawnSpark(
      textRect.left + textRect.width / 2,
      textRect.top,
      '✦',
      '#00e5ff'
    );

    if(state.currentIdx >= state.currentText.length){
      nextText();
    } else {
      renderText();
    }
  } else {
    /* Wrong */
    state.wrongChar = true;
    renderText();

    /* No damage, no score */
    const textEl = dom.textDisplay;
    const textRect = textEl.getBoundingClientRect();
    spawnSpark(
      textRect.left + textRect.width / 2,
      textRect.top,
      '✗',
      '#ff3d5a'
    );
  }
}

/* ====================================================================
   HUD UPDATE
   ==================================================================== */
function updateHUD(){
  dom.scoreVal.textContent = state.score;
  dom.waveVal.textContent = state.kills;

  const acc = state.totalKeys > 0
    ? Math.round(state.correctKeys / state.totalKeys * 100)
    : 100;
  dom.accVal.textContent = acc + '%';

  let livesStr = '';
  for(let i = 0; i < 3; i++){
    livesStr += i < state.lives ? '♥' : '♡';
  }
  dom.livesVal.textContent = livesStr;

  /* Base HP = lives */
  dom.baseHp.style.width = (state.lives / 3 * 100) + '%';
  dom.baseHp.style.background = state.lives <= 1
    ? 'linear-gradient(90deg,#ff3d5a,#cc2040)'
    : 'linear-gradient(90deg,#3ff07a,#2acc60)';
}

/* ====================================================================
   GAME LOOP
   ==================================================================== */
function gameLoop(now){
  if(!state.running) return;
  state.lastTime = now;
  updateEnemies(now);
  state.rafId = requestAnimationFrame(gameLoop);
}

/* ====================================================================
   GAME START
   ==================================================================== */
function startGame(diffKey){
  state.running = true;
  state.difficulty = diffKey;
  state.cfg = DIFFS[diffKey];
  state.score = 0;
  state.kills = 0;
  state.lives = 3;
  state.totalKeys = 0;
  state.correctKeys = 0;
  state.enemyId = 0;
  state.enemies = [];
  state.paused = false;
  state.startTime = Date.now();

  /* Clear battlefield */
  dom.battlefield.querySelectorAll('.enemy').forEach(e => e.remove());

  /* Switch screens */
  dom.screenSelect.style.display = 'none';
  dom.screenResult.classList.remove('on');
  dom.screenGame.classList.add('on');

  /* Show banner */
  showWaveBanner(state.cfg.label);

  updateHUD();
  nextText();

  /* Focus input */
  setTimeout(() => dom.hiddenInput.focus(), 100);

  /* First enemy spawn delayed */
  setTimeout(() => {
    if(!state.running) return;
    spawnEnemy();
  }, 1800);

  /* Spawn loop */
  state.spawnTimer = setInterval(() => {
    if(state.running && !state.paused) spawnEnemy();
  }, state.cfg.spawnInterval);

  /* Start loop */
  state.rafId = requestAnimationFrame(gameLoop);

  /* Music */
  if(BGM_AUTOPLAY && !musicOn && ytApiReady){
    createYTPlayer();
  }
}

function showWaveBanner(text){
  dom.waveBanner.textContent = text;
  dom.waveBanner.classList.remove('on');
  void dom.waveBanner.offsetWidth;
  dom.waveBanner.classList.add('on');
}

/* ====================================================================
   GAME END
   ==================================================================== */
function endGame(){
  state.running = false;
  if(state.spawnTimer) clearInterval(state.spawnTimer);
  if(state.rafId) cancelAnimationFrame(state.rafId);
  state.spawnTimer = null;
  state.rafId = null;

  /* Clear remaining enemies */
  dom.battlefield.querySelectorAll('.enemy').forEach(e => e.remove());
  state.enemies = [];

  const acc = state.totalKeys > 0
    ? Math.round(state.correctKeys / state.totalKeys * 100)
    : 100;
  const duration = Math.round((Date.now() - state.startTime) / 1000);
  const mm = Math.floor(duration / 60);
  const ss = duration % 60;
  const timeStr = mm + ':' + String(ss).padStart(2, '0');

  dom.screenGame.classList.remove('on');
  dom.screenResult.classList.add('on');
  dom.screenResult.innerHTML =
    '<div class="result-title">GAME OVER</div>' +
    '<div class="result-sub">' + state.cfg.label + ' MODE</div>' +
    '<div class="result-grid">' +
      '<div class="res-box"><div class="res-lbl">SCORE</div><div class="res-val gold">' + state.score + '</div></div>' +
      '<div class="res-box"><div class="res-lbl">KILLS</div><div class="res-val pink">' + state.kills + '</div></div>' +
      '<div class="res-box"><div class="res-lbl">ACCURACY</div><div class="res-val cyan">' + acc + '%</div></div>' +
      '<div class="res-box"><div class="res-lbl">TIME</div><div class="res-val purple">' + timeStr + '</div></div>' +
    '</div>' +
    '<div class="result-actions">' +
      '<button class="big-btn" id="againBtn">▶ PLAY AGAIN</button>' +
      '<button class="big-btn ghost" id="menuBtn">⌂ CHANGE MODE</button>' +
    '</div>';

  document.getElementById('againBtn').addEventListener('click', () => {
    startGame(state.difficulty);
  });
  document.getElementById('menuBtn').addEventListener('click', () => {
    showMenu();
  });
}

/* ====================================================================
   SHOW MENU
   ==================================================================== */
function showMenu(){
  state.running = false;
  if(state.spawnTimer) clearInterval(state.spawnTimer);
  if(state.rafId) cancelAnimationFrame(state.rafId);
  state.spawnTimer = null;
  state.rafId = null;
  dom.battlefield.querySelectorAll('.enemy').forEach(e => e.remove());
  state.enemies = [];

  dom.screenGame.classList.remove('on');
  dom.screenResult.classList.remove('on');
  dom.screenSelect.style.display = 'flex';
}

/* ====================================================================
   INPUT
   ==================================================================== */
dom.hiddenInput.addEventListener('input', e => {
  const v = e.target.value;
  if(v){
    for(const ch of v) handleKey(ch.toUpperCase ? ch.toUpperCase() : ch);
    e.target.value = '';
  }
});

document.addEventListener('keydown', e => {
  if(e.ctrlKey || e.metaKey || e.altKey) return;

  if(e.key === 'Escape'){
    if(state.running) endGame();
    return;
  }
  if(!state.running) return;
  if(e.key.length === 1){
    e.preventDefault();
    handleKey(e.key);
  }
});

/* Keep focus on hidden input */
document.addEventListener('click', () => {
  if(state.running) dom.hiddenInput.focus();
});

/* ====================================================================
   DIFFICULTY CARDS
   ==================================================================== */
document.querySelectorAll('.diff-card').forEach(card => {
  card.addEventListener('click', () => {
    startGame(card.dataset.diff);
  });
});

/* ====================================================================
   INIT
   ==================================================================== */
loadYTApi();

<\/script>
</body>
</html>`;

  const finalHTML = gameHTML
    .replace('__BGM_VIDEO_ID__', BGM_VIDEO_ID)
    .replace('__BGM_VOLUME__', String(BGM_VOLUME))
    .replace('__BGM_AUTOPLAY__', String(BGM_AUTOPLAY));

  window.initGame = function initGame(wrapper) {
    if (!wrapper || typeof wrapper.replaceChildren !== 'function') {
      throw new Error('initGame requires a container element.');
    }
    var frame = document.createElement('iframe');
    frame.title = 'Type Strike Arcade';
    frame.setAttribute('allow', 'autoplay; encrypted-media; fullscreen');
    frame.setAttribute('allowfullscreen', 'true');
    frame.style.cssText = 'display:block;width:100%;height:100%;min-height:720px;border:0;border-radius:16px;background:#07070f;overflow:hidden;';
    frame.srcdoc = finalHTML;
    wrapper.replaceChildren(frame);
    return frame;
  };
})();
