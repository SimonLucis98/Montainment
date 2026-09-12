/* TypeVerse Arcade · Typing Speed Game with Single BGM */
(function () {
  'use strict';

  /* ================================================================
     🎵 在这里填入你的 YouTube 音乐视频 ID
     只需要填一个 ID（11 位字符）
     例如 https://www.youtube.com/watch?v=jfKfPfyJRdk → 'jfKfPfyJRdk'
  ================================================================ */
  const BGM_VIDEO_ID = 'YcgwPBwF7Dw';   // ← 换成你的音乐 ID
  const BGM_VOLUME = 55;                 // 0 - 100
  const BGM_AUTOPLAY = true;             // 进入游戏时自动播放

  const gameHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>TypeVerse Arcade</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
:root{
  --bg:#05060e;--bg2:#0a0e1a;
  --neon:#00e5ff;--neon2:#ff2e88;--gold:#ffd33d;
  --green:#3ff07a;--red:#ff4060;--purple:#b855ff;
  --text:#e8f0ff;--dim:#5a6a8a;
}
html,body{
  height:100%;overflow:hidden;
  background:radial-gradient(ellipse at 50% 0%,#151b33 0%,var(--bg) 60%);
  font-family:'Courier New',monospace;color:var(--text);
  user-select:none;
}
#stars{
  position:fixed;inset:0;z-index:0;pointer-events:none;
}
.star{
  position:absolute;background:white;border-radius:50%;
  animation:float linear infinite;
}
@keyframes float{
  from{transform:translateY(0)}
  to{transform:translateY(100vh)}
}
#grid{
  position:fixed;bottom:0;left:0;right:0;height:40%;
  z-index:0;pointer-events:none;
  background:
    linear-gradient(180deg,transparent 0%,rgba(0,229,255,.05) 100%),
    repeating-linear-gradient(90deg,transparent 0 60px,rgba(0,229,255,.08) 60px 61px),
    repeating-linear-gradient(0deg,transparent 0 40px,rgba(0,229,255,.08) 40px 41px);
  transform:perspective(400px) rotateX(60deg);
  transform-origin:bottom;
  animation:gridMove 8s linear infinite;
}
@keyframes gridMove{
  from{background-position:0 0,0 0,0 0}
  to{background-position:0 0,0 0,0 40px}
}
#wrap{
  position:relative;z-index:1;
  height:100%;display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  padding:20px;
}
#hud{
  position:fixed;top:0;left:0;right:0;z-index:10;
  display:flex;justify-content:space-between;align-items:center;
  padding:14px 24px;gap:12px;
  background:linear-gradient(180deg,rgba(5,6,14,.85),transparent);
  pointer-events:none;
  opacity:0;transition:opacity .3s;
}
#hud.on{opacity:1}
.hud-box{
  background:rgba(10,14,26,.85);
  border:1.5px solid rgba(0,229,255,.35);
  border-radius:8px;padding:8px 14px;
  min-width:80px;text-align:center;
  box-shadow:0 0 12px rgba(0,229,255,.15);
}
.hud-label{
  font-size:9px;letter-spacing:2px;color:var(--dim);
  text-transform:uppercase;font-weight:700;
}
.hud-value{
  font-size:22px;font-weight:900;letter-spacing:-.5px;
  line-height:1.1;margin-top:2px;
}
#hudScore .hud-value{color:var(--gold)}
#hudCombo .hud-value{color:var(--neon2)}
#hudWpm .hud-value{color:var(--neon)}
#hudAcc .hud-value{color:var(--green)}
#hudWave .hud-value{color:var(--purple)}
#lives{
  display:flex;gap:6px;font-size:22px;
}
.heart{
  color:var(--red);transition:.3s;
  text-shadow:0 0 8px var(--red);
}
.heart.dead{color:#2a3040;text-shadow:none}
#startScreen{
  text-align:center;
  animation:fadeIn .6s;
}
@keyframes fadeIn{from{opacity:0;transform:scale(.9)}to{opacity:1;transform:scale(1)}}
.logo{
  font-size:clamp(48px,12vw,96px);
  font-weight:900;letter-spacing:-4px;
  color:var(--text);
  text-shadow:
    0 0 20px var(--neon),
    0 0 40px var(--neon),
    0 0 80px rgba(0,229,255,.5);
  line-height:1;margin-bottom:6px;
}
.logo-sub{
  font-size:clamp(14px,2.4vw,20px);
  letter-spacing:8px;color:var(--neon2);
  text-transform:uppercase;margin-bottom:38px;
  text-shadow:0 0 10px var(--neon2);
}
.start-hint{
  font-size:14px;color:var(--dim);
  letter-spacing:1.5px;margin-bottom:30px;line-height:1.8;
}
.start-hint kbd{
  display:inline-block;
  background:rgba(0,229,255,.1);
  border:1px solid rgba(0,229,255,.4);
  border-radius:6px;padding:3px 10px;
  color:var(--neon);font-size:13px;font-weight:700;
  margin:0 3px;
}
.start-btn{
  background:linear-gradient(135deg,var(--neon),#0088cc);
  color:#001018;border:0;
  padding:18px 52px;border-radius:12px;
  font-family:inherit;font-weight:900;
  font-size:20px;letter-spacing:3px;
  cursor:pointer;
  box-shadow:
    0 0 24px rgba(0,229,255,.6),
    0 6px 0 #003a52;
  transition:.1s;
  text-transform:uppercase;
}
.start-btn:hover{filter:brightness(1.15)}
.start-btn:active{transform:translateY(4px);box-shadow:0 0 24px rgba(0,229,255,.6),0 2px 0 #003a52}
.best-row{
  display:flex;gap:30px;justify-content:center;
  margin-top:36px;
}
.best-item{
  text-align:center;
}
.best-item .lbl{
  font-size:10px;letter-spacing:2px;color:var(--dim);
  text-transform:uppercase;font-weight:700;
}
.best-item .val{
  font-size:28px;font-weight:900;margin-top:4px;
}
.best-item .val.gold{color:var(--gold);text-shadow:0 0 12px var(--gold)}
.best-item .val.cyan{color:var(--neon);text-shadow:0 0 12px var(--neon)}
.best-item .val.pink{color:var(--neon2);text-shadow:0 0 12px var(--neon2)}
#gameScreen{
  width:100%;max-width:1000px;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  min-height:100%;
}
#wordDisplay{
  width:100%;
  text-align:center;
  padding:0 20px;
  margin-bottom:40px;
  position:relative;
  min-height:180px;
  display:flex;
  align-items:center;
  justify-content:center;
  flex-wrap:wrap;
}
.wave-announce{
  position:fixed;top:50%;left:50%;
  transform:translate(-50%,-50%);
  font-size:64px;font-weight:900;
  color:var(--neon);
  text-shadow:0 0 30px var(--neon),0 0 60px var(--neon);
  letter-spacing:8px;
  z-index:50;pointer-events:none;
  opacity:0;
}
.wave-announce.show{
  animation:waveIn 1.6s ease-out;
}
@keyframes waveIn{
  0%{opacity:0;transform:translate(-50%,-50%) scale(.4)}
  30%{opacity:1;transform:translate(-50%,-50%) scale(1.1)}
  70%{opacity:1;transform:translate(-50%,-50%) scale(1)}
  100%{opacity:0;transform:translate(-50%,-50%) scale(1.4)}
}
.ch{
  display:inline-block;
  font-family:'Courier New',monospace;
  font-size:clamp(32px,6vw,56px);
  font-weight:900;
  letter-spacing:2px;
  color:#2a3a5a;
  transition:color .08s, text-shadow .08s, transform .08s;
  position:relative;
  padding:0 1px;
}
.ch.space{padding:0 10px}
.ch.done{
  color:var(--green);
  text-shadow:0 0 16px rgba(63,240,122,.7);
}
.ch.miss{
  color:var(--red);
  text-shadow:0 0 16px var(--red);
  animation:shakeCh .3s;
}
@keyframes shakeCh{
  0%,100%{transform:translateX(0)}
  25%{transform:translateX(-6px)}
  75%{transform:translateX(6px)}
}
.ch.current{
  color:white;
  text-shadow:0 0 20px var(--neon),0 0 40px var(--neon);
}
.ch.current::after{
  content:'';position:absolute;
  left:-4px;right:-4px;bottom:-6px;height:4px;
  background:var(--neon);border-radius:2px;
  box-shadow:0 0 16px var(--neon);
  animation:cursorPulse .7s ease-in-out infinite;
}
@keyframes cursorPulse{
  50%{opacity:.3}
}
#progressBar{
  width:100%;height:6px;
  background:rgba(255,255,255,.06);
  border-radius:3px;overflow:hidden;
  margin-bottom:30px;
}
#progressFill{
  height:100%;
  background:linear-gradient(90deg,var(--neon),var(--neon2));
  width:0;transition:width .2s;
  box-shadow:0 0 12px var(--neon);
}
.input-hint{
  color:var(--dim);
  font-size:13px;
  letter-spacing:1.5px;
  text-align:center;
  animation:pulse2 2s infinite;
}
@keyframes pulse2{50%{opacity:.4}}
#hiddenInput{
  position:absolute;opacity:0;
  width:1px;height:1px;
  pointer-events:none;
}
#resultScreen{
  text-align:center;
  width:100%;max-width:600px;
  animation:fadeIn .5s;
}
.rank-icon{
  font-size:88px;line-height:1;margin-bottom:16px;
  animation:rankBounce .8s ease-out;
}
@keyframes rankBounce{
  0%{transform:scale(0) rotate(-180deg)}
  70%{transform:scale(1.2) rotate(10deg)}
  100%{transform:scale(1) rotate(0)}
}
.rank-name{
  font-size:44px;font-weight:900;
  letter-spacing:4px;
  color:var(--gold);
  text-shadow:0 0 24px var(--gold);
  margin-bottom:8px;
}
.rank-desc{
  color:var(--dim);font-size:13px;letter-spacing:1.5px;
  margin-bottom:36px;
}
.result-grid{
  display:grid;grid-template-columns:repeat(2,1fr);
  gap:16px;margin-bottom:36px;
}
.res-box{
  background:rgba(10,14,26,.8);
  border:1.5px solid rgba(0,229,255,.3);
  border-radius:12px;
  padding:18px 14px;
  text-align:center;
}
.res-label{
  font-size:10px;letter-spacing:2px;
  color:var(--dim);font-weight:700;
  text-transform:uppercase;
}
.res-value{
  font-size:32px;font-weight:900;
  margin-top:6px;line-height:1;
}
.res-value.gold{color:var(--gold);text-shadow:0 0 14px var(--gold)}
.res-value.cyan{color:var(--neon);text-shadow:0 0 14px var(--neon)}
.res-value.green{color:var(--green);text-shadow:0 0 14px var(--green)}
.res-value.pink{color:var(--neon2);text-shadow:0 0 14px var(--neon2)}
.res-actions{
  display:flex;gap:14px;justify-content:center;
  flex-wrap:wrap;
}
.res-btn{
  background:transparent;
  border:2px solid var(--neon);
  color:var(--neon);
  padding:14px 32px;border-radius:10px;
  font-family:inherit;font-weight:900;
  font-size:14px;letter-spacing:2px;
  cursor:pointer;
  box-shadow:0 0 12px rgba(0,229,255,.3);
  transition:.15s;
  text-transform:uppercase;
}
.res-btn:hover{background:rgba(0,229,255,.1);box-shadow:0 0 22px var(--neon)}
.res-btn.primary{
  background:linear-gradient(135deg,var(--neon),#0088cc);
  color:#001018;
  box-shadow:0 0 24px rgba(0,229,255,.6),0 4px 0 #003a52;
}
.res-btn.primary:hover{filter:brightness(1.15)}
.res-btn.primary:active{transform:translateY(3px);box-shadow:0 0 24px rgba(0,229,255,.6),0 1px 0 #003a52}
.particle{
  position:fixed;
  pointer-events:none;
  z-index:100;
  font-family:inherit;font-weight:900;
  color:var(--green);
  text-shadow:0 0 12px var(--green);
  font-size:22px;
  animation:particleFly .8s ease-out forwards;
}
@keyframes particleFly{
  0%{opacity:1;transform:translate(0,0) scale(1)}
  100%{opacity:0;transform:translate(var(--dx),var(--dy)) scale(.3)}
}
@keyframes screenShake{
  0%,100%{transform:translate(0,0)}
  10%{transform:translate(-6px,4px)}
  20%{transform:translate(6px,-4px)}
  30%{transform:translate(-4px,-2px)}
  40%{transform:translate(4px,2px)}
  50%{transform:translate(-2px,4px)}
  60%{transform:translate(2px,-4px)}
  70%{transform:translate(-4px,0)}
  80%{transform:translate(4px,0)}
  90%{transform:translate(-2px,0)}
}
#wrap.shake{animation:screenShake .35s}
#musicBtn{
  position:fixed;bottom:20px;right:20px;
  z-index:20;
  width:52px;height:52px;
  background:rgba(10,14,26,.9);
  border:1.5px solid rgba(0,229,255,.5);
  border-radius:50%;
  color:var(--neon);
  font-size:22px;
  cursor:pointer;
  display:flex;align-items:center;justify-content:center;
  box-shadow:0 0 16px rgba(0,229,255,.4);
  transition:.2s;
}
#musicBtn:hover{background:rgba(0,229,255,.15);transform:scale(1.08)}
#musicBtn.off{color:#445;border-color:#334;box-shadow:none}
#musicBtn::after{
  content:'';position:absolute;top:-4px;right:-4px;
  width:12px;height:12px;border-radius:50%;
  background:var(--green);box-shadow:0 0 10px var(--green);
  opacity:0;transition:.3s;
}
#musicBtn.playing::after{opacity:1;animation:pulse3 1.5s infinite}
@keyframes pulse3{
  0%,100%{transform:scale(1);opacity:1}
  50%{transform:scale(1.4);opacity:.5}
}
#levelUp{
  position:fixed;
  top:50%;left:50%;
  transform:translate(-50%,-50%) scale(0);
  z-index:60;
  padding:30px 70px;
  background:linear-gradient(135deg,rgba(0,229,255,.2),rgba(255,46,136,.2));
  border:3px solid var(--neon);
  border-radius:20px;
  font-size:52px;font-weight:900;
  color:white;
  letter-spacing:6px;
  text-shadow:0 0 24px var(--neon),0 0 48px var(--neon2);
  box-shadow:0 0 60px rgba(0,229,255,.6);
  opacity:0;
  pointer-events:none;
}
#levelUp.show{
  animation:levelIn 1.4s ease-out;
}
@keyframes levelIn{
  0%{opacity:0;transform:translate(-50%,-50%) scale(.3) rotate(-10deg)}
  25%{opacity:1;transform:translate(-50%,-50%) scale(1.1) rotate(3deg)}
  70%{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(0)}
  100%{opacity:0;transform:translate(-50%,-50%) scale(1.2) rotate(0)}
}
#ytHost{
  position:fixed;bottom:-9999px;left:-9999px;
  width:1px;height:1px;opacity:0;pointer-events:none;
}
</style>
</head>
<body>

<div id="stars"></div>
<div id="grid"></div>

<div id="hud">
  <div style="display:flex;gap:12px;align-items:center">
    <div class="hud-box" id="hudScore">
      <div class="hud-label">SCORE</div>
      <div class="hud-value" id="scoreVal">0</div>
    </div>
    <div class="hud-box" id="hudCombo">
      <div class="hud-label">COMBO</div>
      <div class="hud-value" id="comboVal">0</div>
    </div>
  </div>
  <div class="hud-box" id="hudWave">
    <div class="hud-label">WAVE</div>
    <div class="hud-value" id="waveVal">1</div>
  </div>
  <div style="display:flex;gap:12px;align-items:center">
    <div class="hud-box" id="hudWpm">
      <div class="hud-label">WPM</div>
      <div class="hud-value" id="wpmVal">0</div>
    </div>
    <div class="hud-box" id="hudAcc">
      <div class="hud-label">ACC</div>
      <div class="hud-value" id="accVal">100</div>
    </div>
  </div>
  <div id="lives">
    <div class="heart">♥</div>
    <div class="heart">♥</div>
    <div class="heart">♥</div>
  </div>
</div>

<div id="wrap">
  <div id="startScreen">
    <div class="logo">TYPE<span style="color:var(--neon)">VERSE</span></div>
    <div class="logo-sub">Arcade Typing</div>
    <div class="start-hint">
      TYPE THE WORDS AS THEY APPEAR<br>
      <kbd>DON'T</kbd> LET A WRONG KEY COST YOU A LIFE<br>
      <kbd>ESC</kbd> TO RESTART
    </div>
    <button class="start-btn" id="startBtn">▶ START</button>
    <div class="best-row">
      <div class="best-item">
        <div class="lbl">Best WPM</div>
        <div class="val gold" id="startBestWpm">0</div>
      </div>
      <div class="best-item">
        <div class="lbl">Best Score</div>
        <div class="val cyan" id="startBestScore">0</div>
      </div>
      <div class="best-item">
        <div class="lbl">Max Combo</div>
        <div class="val pink" id="startBestCombo">0</div>
      </div>
    </div>
  </div>

  <div id="gameScreen" style="display:none">
    <div id="wordDisplay"></div>
    <div id="progressBar"><div id="progressFill"></div></div>
    <div class="input-hint">START TYPING TO BEGIN</div>
  </div>

  <div id="resultScreen" style="display:none"></div>
</div>

<div class="wave-announce" id="waveAnnounce"></div>
<div id="levelUp"></div>
<button id="musicBtn" class="off" title="Toggle Music">♪</button>
<textarea id="hiddenInput" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
<div id="ytHost"></div>

<script>
/* ====================================================================
   CONFIG — Injected from outer wrapper
   ==================================================================== */
const BGM_VIDEO_ID = '__BGM_VIDEO_ID__';
const BGM_VOLUME = __BGM_VOLUME__;
const BGM_AUTOPLAY = __BGM_AUTOPLAY__;

/* ====================================================================
   GAME DATA
   ==================================================================== */
const WORD_POOL = (
  'the of and a to in is you that it he was for on are as with his they I at be this have from ' +
  'or one had by word but not what all were we when your can said there use an each which she do ' +
  'how their if will up other about out many then them these so some her would make like him ' +
  'into time has look two more write go see number no way could people my than first water been ' +
  'call who oil its now find long down day did get come made may part over new sound take only ' +
  'little work know place year live me back give most very after thing our just name good sentence ' +
  'man think say great where help through much before line right too mean old any same tell boy ' +
  'follow came want show also around form three small set put end does another well large must big ' +
  'even such because turn here why ask went men read need land different home us move try kind hand ' +
  'picture again change off play spell air away animal house point page letter mother answer found ' +
  'study still learn should America world high every near add food between own below country plant ' +
  'last school father keep tree never start city earth eye light thought head under story saw left ' +
  'don\\'t few while along might close something seem next hard open example begin life always those ' +
  'both paper together got group often run important until children side feel since'
).split(/\\s+/).filter(w => w.length > 0);

/* ====================================================================
   PLAYER PROGRESS
   ==================================================================== */
let progress = JSON.parse(localStorage.getItem('tv_arcade_progress') || 'null') || {
  bestWpm: 0,
  bestScore: 0,
  bestCombo: 0,
  totalGames: 0
};
function saveProgress(){
  localStorage.setItem('tv_arcade_progress', JSON.stringify(progress));
}

/* ====================================================================
   GAME STATE
   ==================================================================== */
const state = {
  running: false,
  paused: false,
  wave: 1,
  waveTarget: 5,
  waveProgress: 0,
  lives: 3,
  score: 0,
  combo: 0,
  maxCombo: 0,
  totalKeystrokes: 0,
  correctKeystrokes: 0,
  wrongKeystrokes: 0,
  startTime: 0,
  currentWord: '',
  currentIndex: 0
};

/* ====================================================================
   DOM REFS
   ==================================================================== */
const $ = id => document.getElementById(id);
const el = {
  startScreen: $('startScreen'),
  gameScreen: $('gameScreen'),
  resultScreen: $('resultScreen'),
  wordDisplay: $('wordDisplay'),
  progressFill: $('progressFill'),
  scoreVal: $('scoreVal'),
  comboVal: $('comboVal'),
  wpmVal: $('wpmVal'),
  accVal: $('accVal'),
  waveVal: $('waveVal'),
  hud: $('hud'),
  lives: document.querySelectorAll('.heart'),
  hiddenInput: $('hiddenInput'),
  musicBtn: $('musicBtn'),
  wrap: $('wrap'),
  waveAnnounce: $('waveAnnounce'),
  levelUp: $('levelUp'),
  startBestWpm: $('startBestWpm'),
  startBestScore: $('startBestScore'),
  startBestCombo: $('startBestCombo'),
  startBtn: $('startBtn')
};

/* ====================================================================
   STARFIELD
   ==================================================================== */
(function makeStars(){
  const layer = $('stars');
  for(let i = 0; i < 80; i++){
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 2 + 0.5;
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    s.style.left = Math.random() * 100 + 'vw';
    s.style.top = -Math.random() * 100 + 'vh';
    s.style.opacity = 0.2 + Math.random() * 0.7;
    s.style.animationDuration = (5 + Math.random() * 15) + 's';
    s.style.animationDelay = -Math.random() * 15 + 's';
    layer.appendChild(s);
  }
})();

/* ====================================================================
   YOUTUBE MUSIC (single track, looping)
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
  if(BGM_AUTOPLAY && BGM_VIDEO_ID && !ytPlayer){
    createYTPlayer();
  }
};

function createYTPlayer(){
  if(!ytApiReady) return;
  if(!BGM_VIDEO_ID) return;
  try{
    ytPlayer = new YT.Player('ytHost', {
      height: '1',
      width: '1',
      videoId: BGM_VIDEO_ID,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        loop: 1,
        playlist: BGM_VIDEO_ID   /* loop 必须搭配 playlist */
      },
      events: {
        onReady: e => {
          e.target.setVolume(BGM_VOLUME);
          e.target.playVideo();
        },
        onStateChange: e => {
          /* 播放结束时重新播放（保底循环） */
          if(e.data === 0){
            ytPlayer.seekTo(0);
            ytPlayer.playVideo();
          }
        }
      }
    });
    musicOn = true;
    el.musicBtn.classList.add('playing');
    el.musicBtn.classList.remove('off');
  }catch(err){
    console.warn('YT init error', err);
  }
}

function toggleMusic(){
  if(!ytPlayer){
    if(ytApiReady){
      createYTPlayer();
    } else {
      loadYTApi();
    }
    return;
  }
  if(musicOn){
    ytPlayer.pauseVideo();
    musicOn = false;
    el.musicBtn.classList.remove('playing');
    el.musicBtn.classList.add('off');
  } else {
    ytPlayer.playVideo();
    musicOn = true;
    el.musicBtn.classList.add('playing');
    el.musicBtn.classList.remove('off');
  }
}
el.musicBtn.addEventListener('click', toggleMusic);

/* ====================================================================
   GAME LOGIC
   ==================================================================== */
function pickRandomWord(){
  return WORD_POOL[Math.floor(Math.random() * WORD_POOL.length)].toUpperCase();
}

function newWord(){
  state.currentWord = pickRandomWord();
  state.currentIndex = 0;
  renderWord();
}

function renderWord(){
  const word = state.currentWord;
  const idx = state.currentIndex;
  let html = '';
  for(let i = 0; i < word.length; i++){
    let cls = 'ch';
    if(word[i] === ' ') cls += ' space';
    if(i < idx) cls += ' done';
    else if(i === idx) cls += ' current';
    const display = word[i] === ' ' ? '&nbsp;' : word[i];
    html += '<span class="' + cls + '">' + display + '</span>';
  }
  el.wordDisplay.innerHTML = html;
}

function updateHUD(){
  el.scoreVal.textContent = state.score;
  el.comboVal.textContent = state.combo;
  el.waveVal.textContent = state.wave;

  const elapsedMin = state.startTime ? (Date.now() - state.startTime) / 60000 : 0;
  const wpm = elapsedMin > 0.001 ? Math.round((state.correctKeystrokes / 5) / elapsedMin) : 0;
  el.wpmVal.textContent = wpm;

  const acc = state.totalKeystrokes > 0
    ? Math.round(state.correctKeystrokes / state.totalKeystrokes * 100)
    : 100;
  el.accVal.textContent = acc;

  const prog = (state.waveProgress / state.waveTarget) * 100;
  el.progressFill.style.width = prog + '%';
}

function updateLives(){
  el.lives.forEach((h, i) => {
    h.classList.toggle('dead', i >= state.lives);
  });
}

function spawnParticle(char, x, y){
  const p = document.createElement('div');
  p.className = 'particle';
  p.textContent = char;
  p.style.left = x + 'px';
  p.style.top = y + 'px';
  p.style.setProperty('--dx', (Math.random() - 0.5) * 100 + 'px');
  p.style.setProperty('--dy', -Math.random() * 80 - 30 + 'px');
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 800);
}

function screenShake(){
  el.wrap.classList.add('shake');
  setTimeout(() => el.wrap.classList.remove('shake'), 350);
}

function handleKey(key){
  if(!state.running || state.paused) return;
  const expected = state.currentWord[state.currentIndex];
  if(expected === undefined) return;

  state.totalKeystrokes++;

  if(key === expected){
    state.correctKeystrokes++;
    state.currentIndex++;

    const chars = el.wordDisplay.querySelectorAll('.ch');
    const ch = chars[state.currentIndex - 1];
    if(ch){
      const r = ch.getBoundingClientRect();
      spawnParticle(expected, r.left + r.width / 2, r.top);
    }

    if(state.currentIndex >= state.currentWord.length){
      state.combo++;
      if(state.combo > state.maxCombo) state.maxCombo = state.combo;
      const bonus = Math.min(state.combo, 10) * 5;
      const wordScore = state.currentWord.length * 10 + bonus;
      state.score += wordScore;

      state.waveProgress++;

      if(state.waveProgress >= state.waveTarget){
        completeWave();
      } else {
        newWord();
      }
    } else {
      renderWord();
    }
    updateHUD();
  } else {
    state.wrongKeystrokes++;
    state.combo = 0;

    const chars = el.wordDisplay.querySelectorAll('.ch');
    const ch = chars[state.currentIndex];
    if(ch){
      ch.classList.add('miss');
      const r = ch.getBoundingClientRect();
      spawnParticle('✗', r.left + r.width / 2, r.top);
    }
    screenShake();

    state.lives--;
    updateLives();

    if(state.lives <= 0){
      setTimeout(() => endGame(), 400);
    }
    updateHUD();
  }
}

function completeWave(){
  const waveBonus = state.wave * 100;
  state.score += waveBonus;
  state.wave++;
  state.waveProgress = 0;
  state.waveTarget = Math.min(5 + state.wave, 12);

  showLevelUp('WAVE ' + state.wave);

  state.paused = true;
  setTimeout(() => {
    if(!state.running) return;
    state.paused = false;
    newWord();
    updateHUD();
  }, 900);
}

function showLevelUp(text){
  el.levelUp.textContent = text;
  el.levelUp.classList.remove('show');
  void el.levelUp.offsetWidth;
  el.levelUp.classList.add('show');
}

function showWaveAnnounce(text){
  el.waveAnnounce.textContent = text;
  el.waveAnnounce.classList.remove('show');
  void el.waveAnnounce.offsetWidth;
  el.waveAnnounce.classList.add('show');
}

/* ====================================================================
   GAME FLOW
   ==================================================================== */
function startGame(){
  state.running = true;
  state.paused = false;
  state.wave = 1;
  state.waveTarget = 5;
  state.waveProgress = 0;
  state.lives = 3;
  state.score = 0;
  state.combo = 0;
  state.maxCombo = 0;
  state.totalKeystrokes = 0;
  state.correctKeystrokes = 0;
  state.wrongKeystrokes = 0;
  state.startTime = Date.now();

  el.startScreen.style.display = 'none';
  el.resultScreen.style.display = 'none';
  el.gameScreen.style.display = 'flex';
  el.hud.classList.add('on');
  updateLives();

  newWord();
  updateHUD();
  showWaveAnnounce('WAVE 1');

  setTimeout(() => el.hiddenInput.focus(), 100);

  /* 自动播放音乐（如果尚未播放） */
  if(BGM_AUTOPLAY && !musicOn && ytApiReady){
    createYTPlayer();
  }
}

function endGame(){
  if(!state.running) return;
  state.running = false;

  const elapsedMin = (Date.now() - state.startTime) / 60000;
  const wpm = elapsedMin > 0.001 ? Math.round((state.correctKeystrokes / 5) / elapsedMin) : 0;
  const acc = state.totalKeystrokes > 0
    ? Math.round(state.correctKeystrokes / state.totalKeystrokes * 100)
    : 0;

  if(wpm > progress.bestWpm) progress.bestWpm = wpm;
  if(state.score > progress.bestScore) progress.bestScore = state.score;
  if(state.maxCombo > progress.bestCombo) progress.bestCombo = state.maxCombo;
  progress.totalGames++;
  saveProgress();

  el.gameScreen.style.display = 'none';
  el.hud.classList.remove('on');

  const rank = getRank(wpm, acc);

  el.resultScreen.innerHTML = \`
    <div class="rank-icon">\${rank.icon}</div>
    <div class="rank-name">\${rank.name}</div>
    <div class="rank-desc">\${rank.desc}</div>
    <div class="result-grid">
      <div class="res-box"><div class="res-label">SCORE</div><div class="res-value gold">\${state.score}</div></div>
      <div class="res-box"><div class="res-label">WPM</div><div class="res-value cyan">\${wpm}</div></div>
      <div class="res-box"><div class="res-label">ACCURACY</div><div class="res-value green">\${acc}%</div></div>
      <div class="res-box"><div class="res-label">MAX COMBO</div><div class="res-value pink">×\${state.maxCombo}</div></div>
      <div class="res-box"><div class="res-label">WAVE REACHED</div><div class="res-value cyan">\${state.wave}</div></div>
      <div class="res-box"><div class="res-label">TOTAL KEYS</div><div class="res-value">\${state.totalKeystrokes}</div></div>
    </div>
    <div class="res-actions">
      <button class="res-btn primary" id="playAgainBtn">▶ PLAY AGAIN</button>
      <button class="res-btn" id="homeBtn">⌂ HOME</button>
    </div>
  \`;
  el.resultScreen.style.display = 'block';

  document.getElementById('playAgainBtn').addEventListener('click', startGame);
  document.getElementById('homeBtn').addEventListener('click', showStart);
}

function getRank(wpm, acc){
  if(wpm >= 100 && acc >= 97) return { icon:'👑', name:'LEGEND', desc:'Absolute master of the keyboard' };
  if(wpm >= 80 && acc >= 95) return { icon:'🏆', name:'GRANDMASTER', desc:'Elite typing performance' };
  if(wpm >= 60 && acc >= 90) return { icon:'⚡', name:'EXPERT', desc:'Impressive speed and accuracy' };
  if(wpm >= 45 && acc >= 85) return { icon:'🔥', name:'SKILLED', desc:'Solid typing foundation' };
  if(wpm >= 30 && acc >= 80) return { icon:'⭐', name:'APPRENTICE', desc:'You are getting there' };
  if(wpm >= 20) return { icon:'🌱', name:'NOVICE', desc:'Keep practicing to improve' };
  return { icon:'🐢', name:'BEGINNER', desc:'Every master starts here' };
}

function showStart(){
  state.running = false;
  el.gameScreen.style.display = 'none';
  el.resultScreen.style.display = 'none';
  el.hud.classList.remove('on');
  el.startScreen.style.display = 'block';

  el.startBestWpm.textContent = progress.bestWpm;
  el.startBestScore.textContent = progress.bestScore;
  el.startBestCombo.textContent = progress.bestCombo;
}

/* ====================================================================
   INPUT HANDLING
   ==================================================================== */
el.hiddenInput.addEventListener('input', e => {
  const val = e.target.value;
  if(!val) return;
  for(const ch of val){
    handleKey(ch.toUpperCase());
  }
  e.target.value = '';
});

document.addEventListener('keydown', e => {
  if(e.ctrlKey || e.metaKey || e.altKey) return;

  if(e.key === 'Escape'){
    if(state.running) endGame();
    return;
  }
  if(e.key === 'Enter' && !state.running && el.startScreen.style.display !== 'none'){
    startGame();
    return;
  }
  if(e.key === ' ' && !state.running) return;
  if(!state.running) return;
  if(e.key.length === 1){
    e.preventDefault();
    handleKey(e.key.toUpperCase());
  }
});

el.startBtn.addEventListener('click', startGame);

/* ====================================================================
   INIT
   ==================================================================== */
loadYTApi();
showStart();

document.addEventListener('click', () => {
  if(state.running) el.hiddenInput.focus();
});

<\/script>
</body>
</html>`;

  /* Replace config placeholders */
  const finalHTML = gameHTML
    .replace('__BGM_VIDEO_ID__', BGM_VIDEO_ID)
    .replace('__BGM_VOLUME__', String(BGM_VOLUME))
    .replace('__BGM_AUTOPLAY__', String(BGM_AUTOPLAY));

  window.initGame = function initGame(wrapper) {
    if (!wrapper || typeof wrapper.replaceChildren !== 'function') {
      throw new Error('initGame requires a container element.');
    }
    var frame = document.createElement('iframe');
    frame.title = 'TypeVerse Arcade';
    frame.setAttribute('allow', 'autoplay; encrypted-media; fullscreen');
    frame.setAttribute('allowfullscreen', 'true');
    frame.style.cssText = 'display:block;width:100%;height:100%;min-height:700px;border:0;border-radius:16px;background:#05060e;overflow:hidden;';
    frame.srcdoc = finalHTML;
    wrapper.replaceChildren(frame);
    return frame;
  };
})();
