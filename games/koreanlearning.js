/* Learn Korean · 6-Level Korean Learning Game v2 */
(function () {
  'use strict';

  const gameHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>한국어 마스터 · Korean Master</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
:root{
  --bg:#0a0e1a;--panel:#141a28;--panel2:#1c2438;
  --line:#2a3450;--text:#e8eefc;--dim:#7a8aaa;
  --accent:#5b9eff;--accent2:#7c5cff;
  --green:#3fe08a;--red:#ff5570;--gold:#ffc857;
  --pink:#ff7eb3;--cyan:#4de0ff;
  --korean:#ff9b6a;
}
html,body{
  height:100%;overflow:hidden;
  background:radial-gradient(ellipse at 50% 0%,#1a2340 0%,var(--bg) 55%);
  font-family:'Segoe UI','Noto Sans KR',system-ui,Arial,sans-serif;
  color:var(--text);user-select:none;
}
button{border:0;cursor:pointer;color:inherit;font-family:inherit;font-weight:600}
button:disabled{opacity:.4;cursor:not-allowed}

#app{
  height:100%;display:flex;flex-direction:column;
  max-width:1200px;margin:0 auto;
  padding:16px 20px;position:relative;
}

/* TOPBAR */
.topbar{
  display:flex;justify-content:space-between;align-items:center;
  padding:8px 0 16px;flex-shrink:0;
}
.logo{
  font-size:20px;font-weight:900;letter-spacing:-.5px;
  display:flex;align-items:center;gap:8px;
}
.logo .kr{color:var(--korean);font-size:22px}
.top-stats{display:flex;gap:10px;align-items:center;font-size:12px}
.stat-chip{
  background:var(--panel);border:1px solid var(--line);
  border-radius:20px;padding:6px 14px;
  display:flex;align-items:center;gap:6px;font-weight:700;
}
.stat-chip .num{color:var(--gold);font-weight:900}
.stat-chip.lvl .num{color:var(--cyan)}

/* SCREENS */
.screen{flex:1;display:none;flex-direction:column;min-height:0}
.screen.on{display:flex}

/* HOME */
.home-scroll{
  flex:1;overflow-y:auto;padding-right:4px;
}
.home-scroll::-webkit-scrollbar{width:6px}
.home-scroll::-webkit-scrollbar-thumb{background:var(--line);border-radius:3px}
.hero{text-align:center;padding:20px 10px 26px}
.hero h1{
  font-size:clamp(32px,5.5vw,48px);font-weight:900;
  letter-spacing:-1px;line-height:1;margin-bottom:10px;
}
.hero h1 .kr{
  color:var(--korean);display:block;font-size:.7em;
  letter-spacing:4px;margin-bottom:8px;
  text-shadow:0 0 20px rgba(255,155,106,.4);
}
.hero p{color:var(--dim);font-size:14px;line-height:1.6;max-width:600px;margin:0 auto}

.level-grid{
  display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));
  gap:14px;padding-bottom:20px;
}
.level-card{
  background:linear-gradient(145deg,var(--panel2),var(--panel));
  border:1.5px solid var(--line);border-radius:18px;
  padding:20px;cursor:pointer;transition:.22s;
  position:relative;overflow:hidden;
}
.level-card:hover{transform:translateY(-3px);border-color:var(--accent)}
.level-card::after{
  content:'';position:absolute;top:0;right:0;bottom:0;width:4px;transition:.22s;
}
.level-card[data-level="1"]::after{background:var(--green)}
.level-card[data-level="2"]::after{background:var(--cyan)}
.level-card[data-level="3"]::after{background:var(--accent)}
.level-card[data-level="4"]::after{background:var(--accent2)}
.level-card[data-level="5"]::after{background:var(--pink)}
.level-card[data-level="6"]::after{background:var(--gold)}
.level-card:hover::after{width:8px}

.lv-head{
  display:flex;align-items:flex-start;justify-content:space-between;
  margin-bottom:12px;
}
.lv-num{
  font-size:12px;font-weight:800;letter-spacing:2px;
  padding:4px 10px;border-radius:8px;background:rgba(255,255,255,.06);
}
.lv-icon{font-size:36px;line-height:1;margin-bottom:6px}
.lv-title{font-size:19px;font-weight:900;margin-bottom:4px;letter-spacing:-.3px}
.lv-title .kr{
  display:block;font-size:12px;color:var(--korean);
  font-weight:700;letter-spacing:1px;margin-top:4px;opacity:.9;
}
.lv-desc{
  color:var(--dim);font-size:13px;line-height:1.55;
  margin-bottom:14px;min-height:44px;
}
.lv-meta{
  display:flex;justify-content:space-between;align-items:center;
  padding-top:12px;border-top:1px solid var(--line);
  font-size:11px;color:var(--dim);
}
.lv-meta .progress{display:flex;align-items:center;gap:8px;flex:1}
.lv-meta .bar{
  flex:1;height:5px;background:rgba(255,255,255,.06);
  border-radius:3px;overflow:hidden;
}
.lv-meta .bar-fill{height:100%;background:var(--green);border-radius:3px;transition:width .4s}
.lv-meta .pct{color:var(--green);font-weight:800;font-size:12px}

/* MODE SELECT */
.mode-head{padding:4px 0 20px;flex-shrink:0}
.back-btn{
  background:transparent;border:1.5px solid var(--line);
  padding:8px 16px;border-radius:10px;font-size:13px;color:var(--dim);
  display:inline-flex;align-items:center;gap:6px;margin-bottom:16px;
  transition:.15s;
}
.back-btn:hover{border-color:var(--accent);color:var(--accent)}
.mode-head h2{font-size:26px;font-weight:900;letter-spacing:-.5px;margin-bottom:6px}
.mode-head h2 .kr{
  color:var(--korean);font-size:.75em;font-weight:700;
  margin-left:10px;letter-spacing:1px;
}
.mode-head p{color:var(--dim);font-size:13px}

.mode-grid{
  display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
  gap:14px;
}
.mode-card{
  background:linear-gradient(145deg,var(--panel2),var(--panel));
  border:1.5px solid var(--line);border-radius:16px;
  padding:24px 20px;cursor:pointer;transition:.22s;text-align:center;
}
.mode-card:hover{
  transform:translateY(-3px);border-color:var(--accent);
  box-shadow:0 10px 30px rgba(91,158,255,.15);
}
.mode-icon{font-size:44px;line-height:1;margin-bottom:12px}
.mode-name{font-size:16px;font-weight:800;margin-bottom:6px}
.mode-name .kr{
  display:block;font-size:11px;color:var(--korean);
  font-weight:600;margin-top:4px;letter-spacing:.5px;
}
.mode-desc{font-size:12px;color:var(--dim);line-height:1.5}

/* QUIZ */
.quiz-wrap{flex:1;display:flex;flex-direction:column;min-height:0;gap:14px}
.quiz-top{
  display:flex;justify-content:space-between;align-items:center;
  padding:8px 0;flex-shrink:0;gap:10px;
}
.quiz-left{display:flex;gap:10px;align-items:center}
.quit-btn{
  background:rgba(255,85,112,.12);
  border:1.5px solid rgba(255,85,112,.35);
  color:var(--red);
  width:38px;height:38px;border-radius:10px;
  display:flex;align-items:center;justify-content:center;
  font-size:18px;font-weight:900;
  transition:.15s;
  flex-shrink:0;
}
.quit-btn:hover{background:rgba(255,85,112,.25);border-color:var(--red)}
.quiz-progress{
  display:flex;gap:6px;align-items:center;
  font-size:12px;color:var(--dim);font-weight:700;
}
.quiz-progress .big{color:var(--text);font-size:16px;font-weight:900}
.quiz-score{
  display:flex;gap:14px;align-items:center;
  font-size:12px;color:var(--dim);font-weight:700;
}
.quiz-score .v{color:var(--gold);font-size:16px;font-weight:900}
.quiz-score .combo{color:var(--pink);font-size:15px;font-weight:900}
.combo.fire{animation:comboFire .5s}
@keyframes comboFire{
  0%,100%{transform:scale(1)}
  50%{transform:scale(1.3);text-shadow:0 0 20px var(--pink)}
}

.prog-line{
  height:4px;background:rgba(255,255,255,.05);
  border-radius:2px;overflow:hidden;flex-shrink:0;
}
.prog-line .fill{
  height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));
  border-radius:2px;transition:width .4s;
}

.q-card{
  flex:1;display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  background:linear-gradient(145deg,var(--panel2),var(--panel));
  border:1.5px solid var(--line);border-radius:20px;
  padding:30px 24px;min-height:0;
  position:relative;overflow:hidden;
}
.q-card::before{
  content:'';position:absolute;inset:0;
  background:radial-gradient(circle at 50% 0%,rgba(91,158,255,.06),transparent 60%);
  pointer-events:none;
}
.q-content{
  display:flex;flex-direction:column;align-items:center;
  justify-content:center;flex:1;gap:16px;
  text-align:center;animation:qFade .35s ease-out;
  position:relative;z-index:1;
}
@keyframes qFade{
  from{opacity:0;transform:translateY(10px) scale(.98)}
  to{opacity:1;transform:translateY(0) scale(1)}
}

.q-prompt{
  font-size:11px;color:var(--dim);
  letter-spacing:2px;text-transform:uppercase;font-weight:800;
}
.q-image{
  font-size:clamp(80px,15vw,140px);line-height:1;
  filter:drop-shadow(0 6px 20px rgba(0,0,0,.4));
}
.q-text-big{
  font-size:clamp(40px,8vw,72px);font-weight:900;
  color:var(--korean);letter-spacing:2px;
  text-shadow:0 0 30px rgba(255,155,106,.4);line-height:1.1;
}
.q-text-big.small{font-size:clamp(28px,5vw,44px)}
.q-sub{font-size:13px;color:var(--dim);font-style:italic}
.q-speaker{
  width:130px;height:130px;border-radius:50%;
  background:linear-gradient(145deg,var(--accent),var(--accent2));
  border:0;color:white;font-size:58px;
  display:flex;align-items:center;justify-content:center;
  cursor:pointer;box-shadow:0 10px 40px rgba(91,158,255,.4);
  transition:.15s;
}
.q-speaker:hover{transform:scale(1.06)}
.q-speaker:active{transform:scale(.95)}
.q-speaker.playing{animation:speakerPulse .8s ease-in-out infinite}
@keyframes speakerPulse{
  0%,100%{box-shadow:0 10px 40px rgba(91,158,255,.4)}
  50%{box-shadow:0 10px 60px rgba(91,158,255,.9)}
}
.q-speaker-hint{font-size:13px;color:var(--dim);margin-top:8px}

/* ANSWERS — centered */
.answers{
  display:grid;gap:10px;width:100%;max-width:700px;
  flex-shrink:0;
  margin:0 auto;                /* ← 居中 */
  align-self:center;            /* ← 保险 */
}
.answers.cols-2{grid-template-columns:repeat(2,1fr)}
.answers.cols-3{grid-template-columns:repeat(3,1fr)}
.answers.cols-4{grid-template-columns:repeat(2,1fr)}

.ans-btn{
  background:linear-gradient(145deg,var(--panel2),var(--panel));
  border:2px solid var(--line);border-radius:14px;
  padding:16px 14px;font-size:16px;font-weight:700;
  cursor:pointer;transition:.15s;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  gap:4px;min-height:66px;
  line-height:1.35;text-align:center;
  width:100%;
}
.ans-btn:hover:not(:disabled){
  border-color:var(--accent);background:var(--panel2);
  transform:translateY(-2px);
}
.ans-btn .kr{
  font-size:18px;font-weight:800;color:var(--korean);
  display:block;
}
.ans-btn .sub{
  font-size:12px;color:var(--dim);font-weight:600;
  display:block;
}
.ans-btn .ans-text{
  display:block;font-size:15px;font-weight:700;
  color:var(--text);line-height:1.4;
}
.ans-btn .ans-text .zh{color:var(--text)}
.ans-btn .ans-text .sep{color:var(--dim);margin:0 4px}
.ans-btn .ans-text .en{color:var(--cyan);font-weight:600}

.ans-btn.correct{
  background:linear-gradient(145deg,rgba(63,224,138,.15),rgba(63,224,138,.08));
  border-color:var(--green);
  box-shadow:0 0 24px rgba(63,224,138,.3);
  animation:correctPop .4s;
}
.ans-btn.correct .kr{color:var(--green)}
.ans-btn.correct .ans-text{color:var(--green)}
@keyframes correctPop{
  0%{transform:scale(1)}
  40%{transform:scale(1.05)}
  100%{transform:scale(1)}
}
.ans-btn.wrong{
  background:linear-gradient(145deg,rgba(255,85,112,.15),rgba(255,85,112,.08));
  border-color:var(--red);
  animation:wrongShake .4s;
}
.ans-btn.wrong .kr{color:var(--red)}
.ans-btn.wrong .ans-text{color:var(--red)}
@keyframes wrongShake{
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-8px)}
  40%{transform:translateX(8px)}
  60%{transform:translateX(-4px)}
  80%{transform:translateX(4px)}
}
.ans-btn.reveal{
  border-color:var(--green);
  background:linear-gradient(145deg,rgba(63,224,138,.08),transparent);
}
.ans-btn.reveal .kr{color:var(--green)}
.ans-btn.reveal .ans-text{color:var(--green)}
.ans-btn:disabled{cursor:default}

/* FEEDBACK */
.feedback{
  position:absolute;top:20px;left:50%;
  transform:translateX(-50%);
  padding:8px 20px;border-radius:20px;
  font-size:14px;font-weight:800;letter-spacing:1px;
  animation:fbIn .5s;pointer-events:none;z-index:10;
}
.feedback.good{
  background:rgba(63,224,138,.2);
  border:1.5px solid var(--green);color:var(--green);
}
.feedback.bad{
  background:rgba(255,85,112,.2);
  border:1.5px solid var(--red);color:var(--red);
}
@keyframes fbIn{
  0%{opacity:0;transform:translate(-50%,-10px)}
  30%{opacity:1;transform:translate(-50%,0)}
  100%{opacity:0;transform:translate(-50%,-6px)}
}

/* RESULT */
.result-wrap{
  flex:1;display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  text-align:center;padding:20px;
  animation:qFade .5s;
}
.result-icon{
  font-size:88px;line-height:1;margin-bottom:14px;
  animation:resultBounce .7s;
}
@keyframes resultBounce{
  0%{transform:scale(0) rotate(-180deg)}
  60%{transform:scale(1.2) rotate(10deg)}
  100%{transform:scale(1) rotate(0)}
}
.result-title{font-size:32px;font-weight:900;letter-spacing:-.5px;margin-bottom:6px}
.result-sub{color:var(--dim);font-size:13px;margin-bottom:32px}
.result-grid{
  display:grid;grid-template-columns:repeat(3,1fr);
  gap:12px;max-width:520px;width:100%;margin-bottom:32px;
}
.res-box{
  background:var(--panel2);border:1.5px solid var(--line);
  border-radius:12px;padding:14px;
}
.res-label{
  font-size:10px;color:var(--dim);font-weight:800;
  letter-spacing:2px;text-transform:uppercase;margin-bottom:6px;
}
.res-value{font-size:24px;font-weight:900;line-height:1}
.res-value.gold{color:var(--gold)}
.res-value.green{color:var(--green)}
.res-value.cyan{color:var(--cyan)}
.res-actions{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}
.res-btn{
  padding:14px 32px;border-radius:12px;
  font-size:14px;font-weight:800;letter-spacing:1px;
  cursor:pointer;transition:.15s;
  background:linear-gradient(135deg,var(--accent),var(--accent2));
  color:white;border:0;
  box-shadow:0 6px 20px rgba(91,158,255,.3);
}
.res-btn:hover{filter:brightness(1.1);transform:translateY(-2px)}
.res-btn.ghost{
  background:transparent;color:var(--dim);
  border:1.5px solid var(--line);box-shadow:none;
}
.res-btn.ghost:hover{border-color:var(--accent);color:var(--accent)}

/* AUDIO HINT */
.audio-hint{
  font-size:11px;color:var(--red);
  margin-top:8px;padding:4px 10px;
  background:rgba(255,85,112,.1);
  border-radius:8px;display:none;
}
.audio-hint.on{display:block}

@media (max-width:560px){
  #app{padding:10px 12px}
  .logo{font-size:16px}
  .stat-chip{padding:5px 10px;font-size:11px}
  .level-grid{grid-template-columns:1fr}
  .answers.cols-3{grid-template-columns:repeat(2,1fr)}
  .answers.cols-4{grid-template-columns:1fr}
  .q-speaker{width:100px;height:100px;font-size:44px}
  .result-grid{grid-template-columns:1fr 1fr}
  .res-btn{padding:12px 22px;font-size:13px}
}
</style>
</head>
<body>

<div id="app">

  <div class="topbar">
    <div class="logo">
      <span>한국어</span> Korean Master
    </div>
    <div class="top-stats" id="topStats"></div>
  </div>

  <div class="screen on" id="screenHome">
    <div class="home-scroll">
      <div class="hero">
        <h1>
          <span class="kr">한국어 배우기</span>
          Learn Korean
        </h1>
        <p id="heroDesc"></p>
      </div>
      <div class="level-grid" id="levelGrid"></div>
    </div>
  </div>

  <div class="screen" id="screenMode">
    <div class="mode-head">
      <button class="back-btn" onclick="goHome()">← <span id="backLabel"></span></button>
      <h2 id="modeTitle"></h2>
      <p id="modeDesc"></p>
    </div>
    <div class="mode-grid" id="modeGrid"></div>
  </div>

  <div class="screen" id="screenQuiz">
    <div class="quiz-wrap">
      <div class="quiz-top">
        <div class="quiz-left">
          <button class="quit-btn" onclick="quitQuiz()" title="Back">✕</button>
          <div class="quiz-progress">
            <span class="big" id="qCurrent">1</span>
            <span>/</span>
            <span id="qTotal">10</span>
          </div>
        </div>
        <div class="quiz-score">
          <span>Score <span class="v" id="qScore">0</span></span>
          <span class="combo" id="qCombo"></span>
        </div>
      </div>
      <div class="prog-line"><div class="fill" id="qProg" style="width:0%"></div></div>
      <div class="q-card">
        <div id="feedbackBox"></div>
        <div class="q-content" id="qContent"></div>
      </div>
      <div class="answers" id="answers"></div>
    </div>
  </div>

  <div class="screen" id="screenResult">
    <div class="result-wrap" id="resultWrap"></div>
  </div>

</div>

<script>
/* ============================================================
   UI LANGUAGE
   ============================================================ */
let lang = localStorage.getItem('km_lang') || 'zh';
const UI = {
  zh: {
    heroDesc: '选择你的等级。每个等级都有自己的词汇、短句和对话，每次进入都会随机出题。',
    back: '返回',
    modeImage: '看图选韩语',
    modeImageDesc: '看图片，选择正确的韩语单词',
    modeText: '看韩语选意思',
    modeTextDesc: '看韩语字词，选择正确的意思（中英对照）',
    modeListen: '听音选字',
    modeListenDesc: '听韩语发音，选出正确的韩语',
    modeMix: '混合挑战',
    modeMixDesc: '三种题型随机出现，检验真实水平',
    correct: '✓ 正确',
    wrong: '✗ 错误',
    againBtn: '再来一轮',
    backBtn: '返回选单',
    noAudio: '⚠️ 此设备没有韩语语音，请检查系统设置'
  },
  en: {
    heroDesc: 'Choose your level. Each level has its own vocabulary, phrases and dialogue. Questions are randomized every time you enter.',
    back: 'Back',
    modeImage: 'Image → Korean',
    modeImageDesc: 'Look at the image, pick the correct Korean word',
    modeText: 'Korean → Meaning',
    modeTextDesc: 'Read the Korean, pick the correct meaning (CN / EN)',
    modeListen: 'Listen & Pick',
    modeListenDesc: 'Listen to the Korean, pick the correct word',
    modeMix: 'Mixed Challenge',
    modeMixDesc: 'All three modes mixed randomly',
    correct: '✓ Correct',
    wrong: '✗ Wrong',
    againBtn: 'Play Again',
    backBtn: 'Back to Levels',
    noAudio: '⚠️ Korean voice not available on this device'
  }
};
function t(k){ return UI[lang][k]; }

/* ============================================================
   DATA
   ============================================================ */

const L1_CONSONANTS = [
  { kr:'ㄱ', roman:'g/k', name:'기역', en:'giyeok' },
  { kr:'ㄴ', roman:'n',   name:'니은', en:'nieun' },
  { kr:'ㄷ', roman:'d/t', name:'디귿', en:'digeut' },
  { kr:'ㄹ', roman:'r/l', name:'리을', en:'rieul' },
  { kr:'ㅁ', roman:'m',   name:'미음', en:'mieum' },
  { kr:'ㅂ', roman:'b/p', name:'비읍', en:'bieup' },
  { kr:'ㅅ', roman:'s',   name:'시옷', en:'siot' },
  { kr:'ㅇ', roman:'ng',  name:'이응', en:'ieung' },
  { kr:'ㅈ', roman:'j',   name:'지읒', en:'jieut' },
  { kr:'ㅊ', roman:'ch',  name:'치읓', en:'chieut' },
  { kr:'ㅋ', roman:'k',   name:'키읔', en:'kieuk' },
  { kr:'ㅌ', roman:'t',   name:'티읕', en:'tieut' },
  { kr:'ㅍ', roman:'p',   name:'피읖', en:'pieup' },
  { kr:'ㅎ', roman:'h',   name:'히읗', en:'hieut' },
  { kr:'ㄲ', roman:'kk',  name:'쌍기역', en:'ssang-giyeok' },
  { kr:'ㄸ', roman:'tt',  name:'쌍디귿', en:'ssang-digeut' },
  { kr:'ㅃ', roman:'pp',  name:'쌍비읍', en:'ssang-bieup' },
  { kr:'ㅆ', roman:'ss',  name:'쌍시옷', en:'ssang-siot' },
  { kr:'ㅉ', roman:'jj',  name:'쌍지읒', en:'ssang-jieut' }
];

const L1_VOWELS = [
  { kr:'ㅏ', roman:'a',   name:'아', en:'a' },
  { kr:'ㅑ', roman:'ya',  name:'야', en:'ya' },
  { kr:'ㅓ', roman:'eo',  name:'어', en:'eo' },
  { kr:'ㅕ', roman:'yeo', name:'여', en:'yeo' },
  { kr:'ㅗ', roman:'o',   name:'오', en:'o' },
  { kr:'ㅛ', roman:'yo',  name:'요', en:'yo' },
  { kr:'ㅜ', roman:'u',   name:'우', en:'u' },
  { kr:'ㅠ', roman:'yu',  name:'유', en:'yu' },
  { kr:'ㅡ', roman:'eu',  name:'으', en:'eu' },
  { kr:'ㅣ', roman:'i',   name:'이', en:'i' },
  { kr:'ㅐ', roman:'ae',  name:'애', en:'ae' },
  { kr:'ㅔ', roman:'e',   name:'에', en:'e' },
  { kr:'ㅒ', roman:'yae', name:'얘', en:'yae' },
  { kr:'ㅖ', roman:'ye',  name:'예', en:'ye' },
  { kr:'ㅘ', roman:'wa',  name:'와', en:'wa' },
  { kr:'ㅙ', roman:'wae', name:'왜', en:'wae' },
  { kr:'ㅚ', roman:'oe',  name:'외', en:'oe' },
  { kr:'ㅝ', roman:'wo',  name:'워', en:'wo' },
  { kr:'ㅞ', roman:'we',  name:'웨', en:'we' },
  { kr:'ㅟ', roman:'wi',  name:'위', en:'wi' },
  { kr:'ㅢ', roman:'ui',  name:'의', en:'ui' }
];

const SYLLABLE_CONSONANTS = ['ㄱ','ㄴ','ㄷ','ㄹ','ㅁ','ㅂ','ㅅ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const SYLLABLE_VOWELS = ['ㅏ','ㅑ','ㅓ','ㅕ','ㅗ','ㅛ','ㅜ','ㅠ','ㅡ','ㅣ'];
const SYLLABLE_ROMAN = {
  'ㄱ':'g','ㄴ':'n','ㄷ':'d','ㄹ':'r','ㅁ':'m','ㅂ':'b','ㅅ':'s',
  'ㅇ':'','ㅈ':'j','ㅊ':'ch','ㅋ':'k','ㅌ':'t','ㅍ':'p','ㅎ':'h'
};
const VOWEL_ROMAN = {
  'ㅏ':'a','ㅑ':'ya','ㅓ':'eo','ㅕ':'yeo','ㅗ':'o','ㅛ':'yo',
  'ㅜ':'u','ㅠ':'yu','ㅡ':'eu','ㅣ':'i'
};

function buildSyllableList(){
  const list = [];
  for(const c of SYLLABLE_CONSONANTS){
    for(const v of SYLLABLE_VOWELS){
      const choIdx = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'].indexOf(c);
      const jungIdx = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'].indexOf(v);
      if(choIdx < 0 || jungIdx < 0) continue;
      const code = 0xAC00 + (choIdx * 21 + jungIdx) * 28;
      const kr = String.fromCharCode(code);
      const roman = SYLLABLE_ROMAN[c] + VOWEL_ROMAN[v];
      list.push({ kr, roman, sub: roman, name: kr, en: roman });
    }
  }
  return list;
}
const L1_SYLLABLES = buildSyllableList();

const L2 = [
  { img:'🐶', kr:'개',    roman:'gae',    zh:'狗',    en:'dog' },
  { img:'🐱', kr:'고양이', roman:'goyangi', zh:'猫',    en:'cat' },
  { img:'🐰', kr:'토끼',   roman:'tokki',   zh:'兔子',  en:'rabbit' },
  { img:'🐯', kr:'호랑이', roman:'horangi', zh:'老虎',  en:'tiger' },
  { img:'🦁', kr:'사자',   roman:'saja',    zh:'狮子',  en:'lion' },
  { img:'🐘', kr:'코끼리', roman:'kokkiri', zh:'大象',  en:'elephant' },
  { img:'🐵', kr:'원숭이', roman:'wonsungi',zh:'猴子',  en:'monkey' },
  { img:'🐼', kr:'판다',   roman:'panda',   zh:'熊猫',  en:'panda' },
  { img:'🐟', kr:'물고기', roman:'mulgogi', zh:'鱼',    en:'fish' },
  { img:'🐦', kr:'새',    roman:'sae',     zh:'鸟',    en:'bird' },
  { img:'🐸', kr:'개구리', roman:'gaeguri', zh:'青蛙',  en:'frog' },
  { img:'🐭', kr:'쥐',    roman:'jwi',     zh:'老鼠',  en:'mouse' },
  { img:'🐮', kr:'소',    roman:'so',      zh:'牛',    en:'cow' },
  { img:'🐷', kr:'돼지',   roman:'dwaeji',  zh:'猪',    en:'pig' },
  { img:'🐑', kr:'양',    roman:'yang',    zh:'羊',    en:'sheep' },
  { img:'🐴', kr:'말',    roman:'mal',     zh:'马',    en:'horse' },
  { img:'🐻', kr:'곰',    roman:'gom',     zh:'熊',    en:'bear' },
  { img:'🦊', kr:'여우',   roman:'yeou',    zh:'狐狸',  en:'fox' },
  { img:'🐺', kr:'늑대',   roman:'neukdae', zh:'狼',    en:'wolf' },
  { img:'🐔', kr:'닭',    roman:'dak',     zh:'鸡',    en:'chicken' },

  { img:'1️⃣', kr:'일',   roman:'il',   zh:'一',  en:'one' },
  { img:'2️⃣', kr:'이',   roman:'i',    zh:'二',  en:'two' },
  { img:'3️⃣', kr:'삼',   roman:'sam',  zh:'三',  en:'three' },
  { img:'4️⃣', kr:'사',   roman:'sa',   zh:'四',  en:'four' },
  { img:'5️⃣', kr:'오',   roman:'o',    zh:'五',  en:'five' },
  { img:'6️⃣', kr:'육',   roman:'yuk',  zh:'六',  en:'six' },
  { img:'7️⃣', kr:'칠',   roman:'chil', zh:'七',  en:'seven' },
  { img:'8️⃣', kr:'팔',   roman:'pal',  zh:'八',  en:'eight' },
  { img:'9️⃣', kr:'구',   roman:'gu',   zh:'九',  en:'nine' },
  { img:'🔟', kr:'십',   roman:'sip',  zh:'十',  en:'ten' },
  { img:'💯', kr:'백',   roman:'baek', zh:'百',  en:'hundred' },
  { img:'🔢', kr:'천',   roman:'cheon',zh:'千',  en:'thousand' },

  { img:'☀️', kr:'해',   roman:'hae',    zh:'太阳',  en:'sun' },
  { img:'🌧️', kr:'비',   roman:'bi',     zh:'雨',    en:'rain' },
  { img:'❄️', kr:'눈',   roman:'nun',    zh:'雪',    en:'snow' },
  { img:'☁️', kr:'구름', roman:'gureum', zh:'云',    en:'cloud' },
  { img:'🌈', kr:'무지개', roman:'mujigae', zh:'彩虹',  en:'rainbow' },
  { img:'⚡', kr:'번개', roman:'beongae',zh:'闪电',  en:'lightning' },
  { img:'🌬️', kr:'바람', roman:'baram',  zh:'风',    en:'wind' },
  { img:'🌙', kr:'달',   roman:'dal',    zh:'月亮',  en:'moon' },
  { img:'⭐', kr:'별',   roman:'byeol',  zh:'星星',  en:'star' },

  { img:'🔴', kr:'빨강', roman:'ppalgang', zh:'红色', en:'red' },
  { img:'🔵', kr:'파랑', roman:'parang',   zh:'蓝色', en:'blue' },
  { img:'🟡', kr:'노랑', roman:'norang',   zh:'黄色', en:'yellow' },
  { img:'🟢', kr:'초록', roman:'chorok',   zh:'绿色', en:'green' },
  { img:'⚫', kr:'검정', roman:'geomjeong',zh:'黑色', en:'black' },
  { img:'⚪', kr:'하양', roman:'hayang',   zh:'白色', en:'white' },
  { img:'🟣', kr:'보라', roman:'bora',     zh:'紫色', en:'purple' },
  { img:'🟠', kr:'주황', roman:'juhwang',  zh:'橙色', en:'orange' },

  { img:'👨', kr:'남자',  roman:'namja',   zh:'男人',  en:'man' },
  { img:'👩', kr:'여자',  roman:'yeoja',   zh:'女人',  en:'woman' },
  { img:'👦', kr:'소년',  roman:'sonyeon', zh:'男孩',  en:'boy' },
  { img:'👧', kr:'소녀',  roman:'sonyeo',  zh:'女孩',  en:'girl' },
  { img:'👨', kr:'아버지', roman:'abeoji',  zh:'父亲',  en:'father' },
  { img:'👩', kr:'어머니', roman:'eomeoni', zh:'母亲',  en:'mother' },
  { img:'👦', kr:'아들',  roman:'adeul',   zh:'儿子',  en:'son' },
  { img:'👧', kr:'딸',    roman:'ttal',    zh:'女儿',  en:'daughter' },
  { img:'👨', kr:'형',    roman:'hyeong',  zh:'哥哥(男称)', en:'older brother (M)' },
  { img:'👩', kr:'누나',  roman:'nuna',    zh:'姐姐(男称)', en:'older sister (M)' },
  { img:'👦', kr:'동생',  roman:'dongsaeng',zh:'弟弟妹妹', en:'younger sibling' },
  { img:'👨', kr:'친구',  roman:'chingu',  zh:'朋友',  en:'friend' },

  { img:'🍚', kr:'밥',    roman:'bap',    zh:'饭',    en:'rice / meal' },
  { img:'💧', kr:'물',    roman:'mul',    zh:'水',    en:'water' },
  { img:'🍞', kr:'빵',    roman:'ppang',  zh:'面包',  en:'bread' },
  { img:'🍎', kr:'사과',  roman:'sagwa',  zh:'苹果',  en:'apple' },
  { img:'🍌', kr:'바나나', roman:'banana', zh:'香蕉',  en:'banana' },
  { img:'🥛', kr:'우유',  roman:'uyu',    zh:'牛奶',  en:'milk' },
  { img:'🍵', kr:'차',    roman:'cha',    zh:'茶',    en:'tea' },
  { img:'☕', kr:'커피',  roman:'keopi',  zh:'咖啡',  en:'coffee' },
  { img:'🍜', kr:'국수',  roman:'guksu',  zh:'面条',  en:'noodles' },
  { img:'🥩', kr:'고기',  roman:'gogi',   zh:'肉',    en:'meat' },

  { img:'👁️', kr:'눈',   roman:'nun',    zh:'眼睛',  en:'eye' },
  { img:'👂', kr:'귀',   roman:'gwi',    zh:'耳朵',  en:'ear' },
  { img:'👃', kr:'코',   roman:'ko',     zh:'鼻子',  en:'nose' },
  { img:'👄', kr:'입',   roman:'ip',     zh:'嘴',    en:'mouth' },
  { img:'✋', kr:'손',   roman:'son',    zh:'手',    en:'hand' },
  { img:'🦶', kr:'발',   roman:'bal',    zh:'脚',    en:'foot' },
  { img:'🦷', kr:'이',   roman:'i',      zh:'牙',    en:'tooth' },
  { img:'💇', kr:'머리', roman:'meori',  zh:'头/头发', en:'head / hair' },

  { img:'📱', kr:'핸드폰', roman:'haendeupon', zh:'手机',  en:'phone' },
  { img:'📖', kr:'책',    roman:'chaek',   zh:'书',    en:'book' },
  { img:'⚽', kr:'공',    roman:'gong',    zh:'球',    en:'ball' },
  { img:'🪑', kr:'의자',  roman:'uija',    zh:'椅子',  en:'chair' },
  { img:'🛏️', kr:'침대',  roman:'chimdae', zh:'床',    en:'bed' },
  { img:'☎️', kr:'전화',  roman:'jeonhwa', zh:'电话',  en:'telephone' },
  { img:'⌚', kr:'시계',  roman:'sigye',   zh:'钟表',  en:'watch' },
  { img:'☂️', kr:'우산',  roman:'usan',    zh:'雨伞',  en:'umbrella' },
  { img:'🔑', kr:'열쇠',  roman:'yeolssoe',zh:'钥匙',  en:'key' },
  { img:'🎩', kr:'모자',  roman:'moja',    zh:'帽子',  en:'hat' },
  { img:'👟', kr:'신발',  roman:'sinbal',  zh:'鞋子',  en:'shoes' },
  { img:'🕶️', kr:'안경',  roman:'angyeong',zh:'眼镜',  en:'glasses' },

  { img:'🏠', kr:'집',    roman:'jip',     zh:'家',    en:'house' },
  { img:'🏫', kr:'학교',  roman:'hakgyo',  zh:'学校',  en:'school' },
  { img:'🏥', kr:'병원',  roman:'byeongwon',zh:'医院',  en:'hospital' },
  { img:'🏪', kr:'가게',  roman:'gage',    zh:'商店',  en:'shop' },
  { img:'🏢', kr:'회사',  roman:'hoesa',   zh:'公司',  en:'company' },
  { img:'🚉', kr:'역',    roman:'yeok',    zh:'车站',  en:'station' },
  { img:'🍽️', kr:'식당',  roman:'sikdang', zh:'餐厅',  en:'restaurant' },
  { img:'🚻', kr:'화장실', roman:'hwajangsil',zh:'洗手间', en:'restroom' }
];

const L3 = [
  { kr:'안녕하세요',       roman:'annyeonghaseyo',       zh:'你好',           en:'Hello' },
  { kr:'감사합니다',       roman:'gamsahamnida',         zh:'谢谢',           en:'Thank you' },
  { kr:'죄송합니다',       roman:'joesonghamnida',       zh:'对不起',         en:'I am sorry' },
  { kr:'괜찮아요',         roman:'gwaenchanayo',         zh:'没关系',         en:'It is okay' },
  { kr:'네',               roman:'ne',                   zh:'是',             en:'Yes' },
  { kr:'아니요',           roman:'aniyo',                zh:'不是',           en:'No' },
  { kr:'안녕히 가세요',    roman:'annyeonghi gaseyo',    zh:'再见(对离开者)', en:'Goodbye (to leaving)' },
  { kr:'안녕히 계세요',    roman:'annyeonghi gyeseyo',   zh:'再见(对留下者)', en:'Goodbye (to staying)' },
  { kr:'반갑습니다',       roman:'bangapseumnida',       zh:'很高兴认识你',   en:'Nice to meet you' },
  { kr:'실례합니다',       roman:'sillyehamnida',        zh:'打扰一下',       en:'Excuse me' },
  { kr:'잠시만요',         roman:'jamsimanyo',           zh:'请等一下',       en:'Just a moment' },
  { kr:'이름이 뭐예요?',   roman:'ireumi mwoyeyo?',      zh:'你叫什么名字？', en:'What is your name?' },
  { kr:'저는 ___이에요',   roman:'jeoneun ___ieyo',      zh:'我是___',        en:'I am ___' },
  { kr:'만나서 반가워요',  roman:'mannaseo bangawoyo',   zh:'很高兴见到你',   en:'Nice to meet you' },
  { kr:'잘 먹겠습니다',    roman:'jal meokgetseumnida',  zh:'我开动了',       en:'Enjoy the meal (before)' },
  { kr:'잘 먹었습니다',    roman:'jal meogeotseumnida',  zh:'我吃好了',       en:'Thanks for the meal (after)' },
  { kr:'생일 축하해요',    roman:'saengil chukhahaeyo',  zh:'生日快乐',       en:'Happy birthday' },
  { kr:'사랑해요',         roman:'saranghaeyo',          zh:'我爱你',         en:'I love you' },
  { kr:'보고 싶어요',      roman:'bogo sipeoyo',         zh:'我想你',         en:'I miss you' },
  { kr:'힘내세요',         roman:'himnaeseyo',           zh:'加油',           en:'Cheer up' },
  { kr:'잘 자요',          roman:'jal jayo',             zh:'晚安',           en:'Good night' },
  { kr:'좋은 아침이에요',  roman:'joeun achimi-eyo',     zh:'早上好',         en:'Good morning' },
  { kr:'어떻게 지내세요?', roman:'eotteoke jinaeseyo?',  zh:'你最近怎么样？', en:'How are you?' },
  { kr:'잘 지내요',        roman:'jal jinaeyo',          zh:'我很好',         en:'I am doing well' },
  { kr:'오랜만이에요',     roman:'oraenmanieyo',         zh:'好久不见',       en:'Long time no see' },
  { kr:'환영합니다',       roman:'hwanyeonghamnida',     zh:'欢迎',           en:'Welcome' },
  { kr:'축하드려요',       roman:'chukadeuryeoyo',       zh:'恭喜您',         en:'Congratulations' },
  { kr:'건강하세요',       roman:'geonganghaseyo',       zh:'保持健康',       en:'Stay healthy' },
  { kr:'행운을 빌어요',    roman:'haenguneul bireoyo',   zh:'祝你好运',       en:'Good luck' },
  { kr:'다시 만나요',      roman:'dasi mannayo',         zh:'下次见',         en:'See you again' },
  { kr:'정말요?',          roman:'jeongmallyo?',         zh:'真的吗？',       en:'Really?' },
  { kr:'물론이죠',         roman:'mullonijyo',           zh:'当然',           en:'Of course' },
  { kr:'모르겠어요',       roman:'moreugesseoyo',        zh:'我不知道',       en:'I do not know' },
  { kr:'알겠습니다',       roman:'algetseumnida',        zh:'我明白了',       en:'I understand' },
  { kr:'다시 말해 주세요', roman:'dasi malhae juseyo',   zh:'请再说一次',     en:'Please say again' },
  { kr:'천천히 말해 주세요',roman:'cheoncheonhi malhae juseyo', zh:'请说慢一点', en:'Please speak slowly' },
  { kr:'한국어를 못해요',  roman:'hangugeoreul motaeyo', zh:'我不会韩语',     en:'I cannot speak Korean' },
  { kr:'영어 하세요?',     roman:'yeongeo haseyo?',      zh:'你会说英语吗？', en:'Do you speak English?' },
  { kr:'도와주세요',       roman:'dowajuseyo',           zh:'请帮帮我',       en:'Please help me' },
  { kr:'미안해요',         roman:'mianhaeyo',            zh:'抱歉',           en:'Sorry (casual)' }
];

const L4 = [
  { kr:'화장실이 어디예요?',      roman:'hwajangsiri eodiyeyo?',      zh:'洗手间在哪里？',       en:'Where is the restroom?' },
  { kr:'이거 얼마예요?',          roman:'igeo eolmayeyo?',            zh:'这个多少钱？',         en:'How much is this?' },
  { kr:'너무 비싸요',             roman:'neomu bissayo',              zh:'太贵了',               en:'Too expensive' },
  { kr:'깎아 주세요',             roman:'kkakka juseyo',              zh:'请便宜一点',           en:'Please discount' },
  { kr:'카드로 될까요?',          roman:'kadeuro doelkkayo?',         zh:'可以刷卡吗？',         en:'Can I pay by card?' },
  { kr:'현금으로 할게요',         roman:'hyeongeumeuro halgeyo',      zh:'我用现金',             en:'I will pay cash' },
  { kr:'봉투 하나 주세요',        roman:'bongtu hana juseyo',         zh:'请给我一个袋子',       en:'Please give me a bag' },
  { kr:'메뉴 좀 주세요',          roman:'menyu jom juseyo',           zh:'请给我菜单',           en:'Please give me the menu' },
  { kr:'주문할게요',              roman:'jumunhalgeyo',               zh:'我要点餐',             en:'I would like to order' },
  { kr:'추천해 주세요',           roman:'chucheonhae juseyo',         zh:'请推荐一下',           en:'Please recommend' },
  { kr:'이거 매워요?',            roman:'igeo maewoyo?',              zh:'这个辣吗？',           en:'Is this spicy?' },
  { kr:'맛있어요',                roman:'masisseoyo',                 zh:'好吃',                 en:'Delicious' },
  { kr:'물 좀 주세요',            roman:'mul jom juseyo',             zh:'请给我水',             en:'Please give me water' },
  { kr:'계산해 주세요',           roman:'gyesanhae juseyo',           zh:'请结账',               en:'Check please' },
  { kr:'여기요',                  roman:'yeogiyo',                    zh:'这里(招呼服务员)',     en:'Excuse me (to call server)' },
  { kr:'포장해 주세요',           roman:'pojanghae juseyo',           zh:'请打包',               en:'Please pack it' },
  { kr:'길을 잃었어요',           roman:'gireul irheosseoyo',         zh:'我迷路了',             en:'I am lost' },
  { kr:'여기가 어디예요?',        roman:'yeogiga eodiyeyo?',          zh:'这是哪里？',           en:'Where am I?' },
  { kr:'택시를 불러 주세요',      roman:'taeksireul bulleo juseyo',   zh:'请帮我叫出租车',       en:'Please call a taxi' },
  { kr:'몇 시예요?',              roman:'myeot siyeyo?',              zh:'几点了？',             en:'What time is it?' },
  { kr:'오늘 날씨 좋네요',        roman:'oneul nalssi jonneyo',       zh:'今天天气真好',         en:'Nice weather today' },
  { kr:'내일 시간 있어요?',       roman:'naeil sigan isseoyo?',       zh:'明天有时间吗？',       en:'Do you have time tomorrow?' },
  { kr:'같이 갈래요?',            roman:'gachi gallaeyo?',            zh:'要一起去吗？',         en:'Want to go together?' },
  { kr:'전화번호가 뭐예요?',      roman:'jeonhwabeonhoga mwoyeyo?',   zh:'电话号码是多少？',     en:'What is your phone number?' },
  { kr:'이메일 보내 주세요',      roman:'imeil bonae juseyo',         zh:'请发邮件给我',         en:'Please send me an email' },
  { kr:'몇 명이에요?',            roman:'myeot myeongieyo?',          zh:'几位？',               en:'How many people?' },
  { kr:'예약하고 싶어요',         roman:'yeyakhago sipeoyo',          zh:'我想预订',             en:'I would like to make a reservation' },
  { kr:'사진 찍어 주세요',        roman:'sajin jjigeo juseyo',        zh:'请帮我拍照',           en:'Please take a photo' },
  { kr:'이거 뭐예요?',            roman:'igeo mwoyeyo?',              zh:'这是什么？',           en:'What is this?' },
  { kr:'천천히 부탁드려요',       roman:'cheoncheonhi butakdeuryeoyo',zh:'请慢一点',             en:'Please slow down' },
  { kr:'다시 한번 말씀해 주세요', roman:'dasi hanbeon malsseumhae juseyo', zh:'请再说一次',      en:'Please say it again' },
  { kr:'이해가 안 돼요',          roman:'ihaega an dwaeyo',           zh:'我不理解',             en:'I do not understand' },
  { kr:'한국어를 배우고 있어요',  roman:'hangugeoreul baeugo isseoyo',zh:'我在学韩语',           en:'I am learning Korean' },
  { kr:'얼마나 걸려요?',          roman:'eolmana geollyeoyo?',        zh:'要多久？',             en:'How long does it take?' },
  { kr:'언제 출발해요?',          roman:'eonje chulbalhaeyo?',        zh:'什么时候出发？',       en:'When does it depart?' },
  { kr:'어디에서 만나요?',        roman:'eodieseo mannayo?',          zh:'在哪里见面？',         en:'Where shall we meet?' },
  { kr:'몇 번 버스예요?',         roman:'myeot beon beoseuyeyo?',     zh:'几号公交车？',         en:'Which bus number?' },
  { kr:'여기에서 가까워요?',      roman:'yeogieseo gakkawoyo?',       zh:'离这里近吗？',         en:'Is it close from here?' },
  { kr:'한국 음식 좋아해요',      roman:'hanguk eumsik joahaeyo',     zh:'我喜欢韩国料理',       en:'I like Korean food' },
  { kr:'매운 거 못 먹어요',       roman:'maeun geo mot meogeoyo',     zh:'我不能吃辣',           en:'I cannot eat spicy food' }
];

const L5 = [
  { kr:'오늘 정말 바빴어요',              roman:'oneul jeongmal bappasseoyo',           zh:'今天真的很忙',                en:'Today was really busy' },
  { kr:'주말에 뭐 할 거예요?',            roman:'jumare mwo hal geoyeyo?',              zh:'周末要做什么？',              en:'What will you do on the weekend?' },
  { kr:'같이 영화 보러 갈래요?',          roman:'gachi yeonghwa boreo gallaeyo?',      zh:'要一起去看电影吗？',          en:'Want to go watch a movie together?' },
  { kr:'요즘 어떻게 지내세요?',           roman:'yojeum eotteoke jinaeseyo?',           zh:'最近过得怎么样？',            en:'How have you been lately?' },
  { kr:'그 소식 들었어요?',               roman:'geu sosik deureosseoyo?',              zh:'你听说那个消息了吗？',        en:'Did you hear that news?' },
  { kr:'정말 놀랐어요',                   roman:'jeongmal nollasseoyo',                 zh:'真让我吃惊',                  en:'I was really surprised' },
  { kr:'생각보다 어려웠어요',             roman:'saenggakboda eoryeowosseoyo',          zh:'比想象中难',                  en:'It was harder than expected' },
  { kr:'다시 한번 생각해 볼게요',         roman:'dasi hanbeon saenggakhae bolgeyo',     zh:'我再考虑一下',                en:'Let me think about it again' },
  { kr:'제 생각에는 좋을 것 같아요',      roman:'je saenggageneun joeul geot gatayo',   zh:'我觉得会不错',                en:'I think it would be good' },
  { kr:'그건 좀 어려울 것 같아요',        roman:'geugeon jom eoryeoul geot gatayo',     zh:'那个可能有点难',              en:'That might be difficult' },
  { kr:'시간이 있으면 같이 가요',         roman:'sigani isseumyeon gachi gayo',         zh:'有时间的话一起去',            en:'If you have time, let us go together' },
  { kr:'혹시 도와주실 수 있나요?',        roman:'hoksi dowajusil su innayo?',           zh:'能帮我一下吗？',              en:'Could you help me?' },
  { kr:'제가 잘못한 것 같아요',           roman:'jega jalmothan geot gatayo',           zh:'我好像做错了',                en:'I think I made a mistake' },
  { kr:'다음에 또 만나요',                roman:'daeume tto mannayo',                   zh:'下次再见',                    en:'See you next time' },
  { kr:'오늘 하루 어땠어요?',             roman:'oneul haru eottaesseoyo?',             zh:'今天过得怎么样？',            en:'How was your day?' },
  { kr:'요즘 일이 많아요',                roman:'yojeum iri manayo',                    zh:'最近工作很多',                en:'I have a lot of work lately' },
  { kr:'스트레스 받지 마세요',            roman:'seuteureseu batji maseyo',             zh:'别给自己压力',                en:'Do not stress' },
  { kr:'건강이 제일 중요해요',            roman:'geongangi jeil jungyohaeyo',           zh:'健康最重要',                  en:'Health is most important' },
  { kr:'푹 쉬세요',                       roman:'puk swiseyo',                          zh:'好好休息',                    en:'Get some rest' },
  { kr:'잘 하고 있어요',                  roman:'jal hago isseoyo',                     zh:'你做得好',                    en:'You are doing well' },
  { kr:'조금만 더 힘내세요',              roman:'jogeumman deo himnaeseyo',             zh:'再坚持一下',                  en:'Hang in there a bit more' },
  { kr:'제가 연락드릴게요',               roman:'jega yeollakdeurilgeyo',               zh:'我会联系您的',                en:'I will contact you' },
  { kr:'약속을 잊지 마세요',              roman:'yaksogeul itji maseyo',                zh:'别忘了约定',                  en:'Do not forget the appointment' },
  { kr:'무슨 일이 있었어요?',             roman:'museun iri isseosseoyo?',              zh:'发生了什么事？',              en:'What happened?' },
  { kr:'제 말을 이해하셨나요?',           roman:'je mareul ihaehasyeonnayo?',           zh:'你听懂我说的话了吗？',        en:'Did you understand what I said?' },
  { kr:'더 자세히 설명해 주세요',         roman:'deo jasehi seolmyeonghae juseyo',      zh:'请更详细地说明',              en:'Please explain in more detail' },
  { kr:'다른 의견 있으세요?',             roman:'dareun uigyeon isseuseyo?',            zh:'有其他意见吗？',              en:'Any other opinions?' },
  { kr:'동의합니다',                      roman:'donguihamnida',                        zh:'我同意',                      en:'I agree' },
  { kr:'반대합니다',                      roman:'bandaehamnida',                        zh:'我反对',                      en:'I disagree' },
  { kr:'확실하지 않아요',                 roman:'hwaksilhaji anayo',                    zh:'不太确定',                    en:'I am not sure' },
  { kr:'다시 연락드릴게요',               roman:'dasi yeollakdeurilgeyo',               zh:'我再联系您',                  en:'I will get back to you' },
  { kr:'미리 알려 주세요',                roman:'miri allyeo juseyo',                   zh:'请提前通知我',                en:'Please let me know in advance' },
  { kr:'언제 시간이 되세요?',             roman:'eonje sigani doeseyo?',                zh:'您什么时候有空？',            en:'When are you free?' },
  { kr:'제가 예약을 도와드릴게요',        roman:'jega yeyageul dowadeurilgeyo',         zh:'我帮您预订',                  en:'I will help you with the reservation' },
  { kr:'문제가 생겼어요',                 roman:'munjega saenggyeosseoyo',              zh:'出问题了',                    en:'There is a problem' },
  { kr:'곧 해결될 거예요',                roman:'got haegyeoldoel geoyeyo',             zh:'很快会解决的',                en:'It will be solved soon' },
  { kr:'조금만 기다려 주세요',            roman:'jogeumman gidaryeo juseyo',            zh:'请稍等',                      en:'Please wait a moment' },
  { kr:'다시 시도해 보세요',              roman:'dasi sidohae boseyo',                  zh:'请再试一次',                  en:'Please try again' },
  { kr:'결국 잘 될 거예요',               roman:'gyeolguk jal doel geoyeyo',            zh:'最终会好的',                  en:'It will work out in the end' },
  { kr:'함께 해서 즐거웠어요',            roman:'hamkke haeseo jeulgeowosseoyo',        zh:'一起很开心',                  en:'It was fun doing it together' }
];

const L6 = [
  { kr:'한국에 온 지 얼마나 됐어요?',                   roman:'hanguge on ji eolmana dwaesseoyo?',              zh:'来韩国多久了？',                 en:'How long have you been in Korea?' },
  { kr:'한국 생활에 적응하는 게 쉽지 않아요',           roman:'hanguk saenghware jeogeunghaneun ge swipji anayo', zh:'适应韩国生活不容易',             en:'Adapting to life in Korea is not easy' },
  { kr:'한국어를 배우는 게 어렵지만 재미있어요',        roman:'hangugeoreul baeuneun ge eoryeopjiman jaemiisseoyo', zh:'学韩语虽难但很有趣',             en:'Learning Korean is hard but fun' },
  { kr:'매일 조금씩 연습하면 실력이 늘 거예요',         roman:'maeil jogeumssik yeonseuphamyeon sillyeogi neul geoyeyo', zh:'每天练习一点就会进步',           en:'Practice a bit every day and you will improve' },
  { kr:'언어를 배우는 가장 좋은 방법은 계속 말하는 거예요', roman:'eoneoreul baeuneun gajang joeun bangbeobeun gyesok malhaneun geoyeyo', zh:'学语言最好的方法就是不停地说', en:'The best way to learn a language is to keep speaking' },
  { kr:'실수해도 괜찮아요, 그것도 배우는 과정이에요',   roman:'silsuhaedo gwaenchanayo, geugeotdo baeuneun gwajeongieyo', zh:'犯错也没关系，那也是学习过程',    en:'It is okay to make mistakes, that is part of learning' },
  { kr:'요즘 한국 문화에 푹 빠져 있어요',              roman:'yojeum hanguk munhwae puk ppajyeo isseoyo',       zh:'最近迷上了韩国文化',              en:'I am really into Korean culture these days' },
  { kr:'이번 주말에 뭐 특별한 계획 있어요?',           roman:'ibeon jumare mwo teukbyeolhan gyehoek isseoyo?',  zh:'这周末有什么特别计划吗？',        en:'Any special plans for this weekend?' },
  { kr:'일이 너무 많아서 쉴 시간이 없어요',            roman:'iri neomu manaseo swil sigani eopseoyo',          zh:'工作太多没时间休息',              en:'Too much work, no time to rest' },
  { kr:'건강을 위해서 운동을 시작했어요',              roman:'geongangeul wihaeseo undongeul sijakhaesseoyo',   zh:'为了健康开始运动了',              en:'I started exercising for my health' },
  { kr:'요리는 처음이지만 배우고 싶어요',              roman:'yorineun cheoeumijiman baeugo sipeoyo',           zh:'虽然第一次做菜但想学',            en:'It is my first time cooking but I want to learn' },
  { kr:'내일 회의 자료를 준비해야 해요',                roman:'naeil hoeui jaryoreul junbihaeya haeyo',          zh:'明天要准备会议资料',              en:'I need to prepare meeting materials for tomorrow' },
  { kr:'날씨가 추워지니까 옷을 따뜻하게 입으세요',     roman:'nalssiga chuwojinikka oseul ttatteuthage ibeuseyo', zh:'天气变冷了要多穿点',            en:'It is getting cold so dress warmly' },
  { kr:'이 문제에 대해 어떻게 생각하세요?',            roman:'i munjee daehae eotteoke saenggakhaseyo?',        zh:'你对这个问题怎么看？',            en:'What do you think about this issue?' },
  { kr:'제 의견을 말씀드려도 될까요?',                 roman:'je uigyeoneul malsseumdeuryeodo doelkkayo?',      zh:'我可以发表一下意见吗？',          en:'May I share my opinion?' },
  { kr:'그 결정은 신중하게 해야 할 것 같아요',         roman:'geu gyeoljeongeun sinjunghage haeya hal geot gatayo', zh:'那个决定要慎重考虑',           en:'That decision should be made carefully' },
  { kr:'다른 사람의 의견도 들어보는 게 좋을 것 같아요', roman:'dareun saramui uigyeondo deureoboneun ge joeul geot gatayo', zh:'最好也听听别人的意见', en:'It would be good to hear other opinions too' },
  { kr:'이 일은 제가 책임지고 처리하겠습니다',         roman:'i ireun jega chaegimjigo cheorihagetseumnida',     zh:'这件事我会负责处理',              en:'I will take responsibility for this' },
  { kr:'함께 협력하면 더 좋은 결과가 나올 거예요',     roman:'hamkke hyeomnyeokhamyeon deo joeun gyeolgwaga naol geoyeyo', zh:'一起合作会有更好的结果', en:'Working together will yield better results' },
  { kr:'최선을 다했으니 후회는 없어요',                roman:'choeseoneul dahaesseuni huhoeneun eopseoyo',      zh:'尽力了所以没有遗憾',              en:'I did my best so no regrets' },
  { kr:'앞으로도 잘 부탁드립니다',                     roman:'apeurodo jal butakdeurimnida',                    zh:'以后也请多关照',                  en:'Please continue to support me' },
  { kr:'시간이 지나면 다 괜찮아질 거예요',             roman:'sigani jinamyeon da gwaenchanhajil geoyeyo',      zh:'随着时间会好起来的',              en:'It will all be okay with time' },
  { kr:'지금 이 순간을 소중히 여기세요',               roman:'jigeum i sunganeul sojunghi yeogiseyo',           zh:'珍惜当下',                        en:'Cherish this moment' },
  { kr:'행복은 멀리 있는 게 아니에요',                 roman:'haengbogeun meolli inneun ge anieyo',             zh:'幸福并不遥远',                    en:'Happiness is not far away' },
  { kr:'매일 감사한 마음으로 살아요',                  roman:'maeil gamsahan maeumeuro sarayo',                 zh:'每天怀着感恩的心生活',            en:'I live with gratitude every day' },
  { kr:'서로 이해하려고 노력하는 게 중요해요',         roman:'seoro ihaeharyeogo noryeokhaneun ge jungyohaeyo', zh:'互相努力理解很重要',              en:'It is important to try to understand each other' },
  { kr:'문제를 해결하려면 대화가 필요해요',            roman:'munjereul haegyeolharyeomyeon daehwaga piryohaeyo', zh:'要解决问题需要沟通',            en:'Dialogue is needed to solve problems' },
  { kr:'작은 실수로 큰 문제가 생길 수 있어요',         roman:'jageun silsuro keun munjega saenggil su isseoyo', zh:'小错误可能导致大问题',            en:'Small mistakes can cause big problems' },
  { kr:'이 경험을 통해 많이 배웠어요',                 roman:'i gyeongheomeul tonghae mani baewosseoyo',        zh:'通过这次经历学到了很多',          en:'I learned a lot from this experience' },
  { kr:'앞으로의 계획을 세워 봤어요',                  roman:'apeuroui gyehoegeul sewo bwasseoyo',              zh:'制定了未来的计划',                en:'I made plans for the future' },
  { kr:'목표를 향해 한 걸음씩 나아가고 있어요',       roman:'mokpyoreul hyanghae han georeumssik naagago isseoyo', zh:'一步步朝着目标前进',          en:'I am moving toward my goal step by step' },
  { kr:'포기하지 마세요, 반드시 이룰 수 있어요',       roman:'pogihaji maseyo, bandeusi irul su isseoyo',       zh:'别放弃，一定能实现',              en:'Do not give up, you can achieve it' },
  { kr:'오늘도 좋은 하루 되세요',                      roman:'oneuldo joeun haru doeseyo',                      zh:'祝你今天也是美好的一天',          en:'Have a great day today' },
  { kr:'만나서 정말 반가웠어요',                       roman:'mannaseo jeongmal bangawosseoyo',                 zh:'见到你真的很高兴',                en:'It was really nice meeting you' },
  { kr:'다음에 기회가 되면 또 뵙겠습니다',             roman:'daeume gihoega doemyeon tto boepgetseumnida',     zh:'下次有机会再见',                  en:'Hope to see you again when there is a chance' },
  { kr:'항상 응원하고 있어요',                         roman:'hangsang eungwonhago isseoyo',                    zh:'一直支持你',                      en:'Always cheering for you' },
  { kr:'함께여서 든든했어요',                          roman:'hamkkeyeoseo deundeunhaesseoyo',                  zh:'有你在很安心',                    en:'I felt reassured being with you' },
  { kr:'서로에게 좋은 친구가 되었으면 좋겠어요',       roman:'seoroege joeun chinguga doeeosseumyeon jokesseoyo', zh:'希望我们成为好朋友',            en:'Hope we become good friends' },
  { kr:'오늘 대화 정말 즐거웠어요',                    roman:'oneul daehwa jeongmal jeulgeowosseoyo',           zh:'今天的对话真的很愉快',            en:'I really enjoyed our conversation today' },
  { kr:'다시 만날 날을 기대할게요',                    roman:'dasi mannal nareul gidaehalgeyo',                 zh:'期待再次相见',                    en:'Looking forward to seeing you again' }
];

/* ============================================================
   LEVEL META
   ============================================================ */
const LEVEL_META = {
  1: {
    icon:'🔤',
    zh:{ name:'初学者', desc:'韩文字母：辅音、元音、基础音节组合。建立发音基础。' },
    en:{ name:'Beginner', desc:'Hangul: consonants, vowels, basic syllable combinations.' }
  },
  2: {
    icon:'📚',
    zh:{ name:'基础词汇', desc:'动物、数字、天气、颜色、人物、食物、身体、日常物品。' },
    en:{ name:'Basic Vocabulary', desc:'Animals, numbers, weather, colors, people, food, body, objects.' }
  },
  3: {
    icon:'💬',
    zh:{ name:'日常短句', desc:'问候、感谢、道歉、请求等日常交流短语。' },
    en:{ name:'Daily Phrases', desc:'Greetings, thanks, apologies, requests for daily conversation.' }
  },
  4: {
    icon:'🗣️',
    zh:{ name:'简短对话', desc:'点餐、购物、问路、时间等实用对话表达。' },
    en:{ name:'Short Dialogue', desc:'Ordering, shopping, directions, time — practical conversation.' }
  },
  5: {
    icon:'🎯',
    zh:{ name:'高级会话', desc:'表达意见、约定、情绪、建议。舒适进行日常交流。' },
    en:{ name:'Advanced Conversation', desc:'Opinions, appointments, emotions, suggestions. Comfortable daily talk.' }
  },
  6: {
    icon:'👑',
    zh:{ name:'流利交流', desc:'复杂表达、抽象讨论、人生哲理。达到流利沟通的水平。' },
    en:{ name:'Fluent Communication', desc:'Complex expression, abstract discussion. Fluent level.' }
  }
};

/* ============================================================
   STATE
   ============================================================ */
const state = {
  level: 1,
  mode: 'text',
  questions: [],
  current: 0,
  score: 0,
  correct: 0,
  wrong: 0,
  combo: 0,
  maxCombo: 0,
  totalQ: 10,
  locked: false,
  progress: JSON.parse(localStorage.getItem('km_progress') || 'null') || {
    1:{plays:0, best:0}, 2:{plays:0, best:0}, 3:{plays:0, best:0},
    4:{plays:0, best:0}, 5:{plays:0, best:0}, 6:{plays:0, best:0}
  }
};
function saveProgress(){
  localStorage.setItem('km_progress', JSON.stringify(state.progress));
}

/* ============================================================
   POOL
   ============================================================ */
function getPool(level){
  if(level === 1){
    return [
      ...L1_CONSONANTS.map(x => ({ kr:x.kr, sub:x.roman, roman:x.roman, hint:x.en, group:'consonant' })),
      ...L1_VOWELS.map(x => ({ kr:x.kr, sub:x.roman, roman:x.roman, hint:x.en, group:'vowel' })),
      ...L1_SYLLABLES.map(x => ({ kr:x.kr, sub:x.roman, roman:x.roman, hint:x.roman, group:'syllable' }))
    ];
  }
  if(level === 2) return L2.slice();
  if(level === 3) return L3.slice();
  if(level === 4) return L4.slice();
  if(level === 5) return L5.slice();
  if(level === 6) return L6.slice();
  return [];
}

/* 该等级可用的模式 */
function getModesForLevel(level){
  if(level === 1) return ['image', 'text', 'listen', 'mix'];
  return ['text', 'listen', 'mix'];
}

/* ============================================================
   RANDOM
   ============================================================ */
function shuffle(arr){
  const a = arr.slice();
  for(let i = a.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pickN(arr, n, exclude){
  const pool = arr.filter(x => !exclude || x.kr !== exclude.kr);
  return shuffle(pool).slice(0, n);
}

/* ============================================================
   QUESTIONS
   ============================================================ */
function buildQuestions(level, mode, count){
  const pool = getPool(level);
  if(pool.length === 0) return [];

  const questions = [];
  const availableModes = getModesForLevel(level);
  const modes = mode === 'mix'
    ? availableModes.filter(m => m !== 'mix')
    : [mode];

  const usedKr = new Set();
  const shuffledPool = shuffle(pool);
  let attempt = 0;

  while(questions.length < count && attempt < pool.length * 3){
    const q = shuffledPool[attempt % shuffledPool.length];
    attempt++;
    if(usedKr.has(q.kr)) continue;
    usedKr.add(q.kr);

    const m = modes[Math.floor(Math.random() * modes.length)];
    const wrongs = pickN(pool, 3, q);
    if(wrongs.length < 3) continue;

    questions.push({
      mode: m,
      answer: q,
      options: shuffle([q, ...wrongs])
    });
  }
  return questions;
}

/* ============================================================
   RENDER
   ============================================================ */
const $ = id => document.getElementById(id);

function renderLevelGrid(){
  const grid = $('levelGrid');
  let html = '';
  for(let lv = 1; lv <= 6; lv++){
    const meta = LEVEL_META[lv];
    const p = state.progress[lv] || { plays:0, best:0 };
    const name = meta[lang].name;
    const desc = meta[lang].desc;
    const krName = ['입문','기초','일상','대화','고급','유창'][lv-1];
    html += \`
      <div class="level-card" data-level="\${lv}" onclick="selectLevel(\${lv})">
        <div class="lv-head">
          <div>
            <div class="lv-icon">\${meta.icon}</div>
            <div class="lv-title">
              \${name}
              <span class="kr">\${krName}</span>
            </div>
          </div>
          <div class="lv-num">LV \${lv}</div>
        </div>
        <div class="lv-desc">\${desc}</div>
        <div class="lv-meta">
          <div class="progress">
            <div class="bar"><div class="bar-fill" style="width:\${p.best}%"></div></div>
            <span class="pct">\${p.best}%</span>
          </div>
          <span>Played \${p.plays}</span>
        </div>
      </div>
    \`;
  }
  grid.innerHTML = html;
}

function renderModeSelect(){
  const meta = LEVEL_META[state.level];
  $('modeTitle').innerHTML = \`\${meta.icon} \${meta[lang].name} <span class="kr">LV \${state.level}</span>\`;
  $('modeDesc').textContent = meta[lang].desc;

  const grid = $('modeGrid');
  const modes = getModesForLevel(state.level);
  let html = '';

  /* 只有第 1 级有看图模式 */
  if(modes.indexOf('image') >= 0){
    html += \`
      <div class="mode-card" onclick="startQuiz('image')">
        <div class="mode-icon">🖼️</div>
        <div class="mode-name">\${t('modeImage')}<span class="kr">그림 보고 고르기</span></div>
        <div class="mode-desc">\${t('modeImageDesc')}</div>
      </div>
    \`;
  }
  if(modes.indexOf('text') >= 0){
    html += \`
      <div class="mode-card" onclick="startQuiz('text')">
        <div class="mode-icon">📖</div>
        <div class="mode-name">\${t('modeText')}<span class="kr">뜻 고르기</span></div>
        <div class="mode-desc">\${t('modeTextDesc')}</div>
      </div>
    \`;
  }
  if(modes.indexOf('listen') >= 0){
    html += \`
      <div class="mode-card" onclick="startQuiz('listen')">
        <div class="mode-icon">🔊</div>
        <div class="mode-name">\${t('modeListen')}<span class="kr">듣고 고르기</span></div>
        <div class="mode-desc">\${t('modeListenDesc')}</div>
      </div>
    \`;
  }
  if(modes.indexOf('mix') >= 0){
    html += \`
      <div class="mode-card" onclick="startQuiz('mix')">
        <div class="mode-icon">🎲</div>
        <div class="mode-name">\${t('modeMix')}<span class="kr">섞어서 도전</span></div>
        <div class="mode-desc">\${t('modeMixDesc')}</div>
      </div>
    \`;
  }
  grid.innerHTML = html;
}

function showScreen(id){
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('on'));
  $(id).classList.add('on');
}

/* ============================================================
   FLOW
   ============================================================ */
window.goHome = function(){
  showScreen('screenHome');
  renderLevelGrid();
  renderTopStats();
};

window.quitQuiz = function(){
  if(confirm(lang === 'zh' ? '确定要退出本轮测试吗？' : 'Quit this round?')){
    goHome();
  }
};

window.selectLevel = function(lv){
  state.level = lv;
  showScreen('screenMode');
  renderModeSelect();
};

window.startQuiz = function(mode){
  state.mode = mode;
  state.totalQ = 10;
  state.questions = buildQuestions(state.level, mode, state.totalQ);
  if(state.questions.length === 0){
    alert('Not enough content.');
    return;
  }
  state.totalQ = state.questions.length;
  state.current = 0;
  state.score = 0;
  state.correct = 0;
  state.wrong = 0;
  state.combo = 0;
  state.maxCombo = 0;
  state.locked = false;

  showScreen('screenQuiz');
  renderQuestion();
};

function renderTopStats(){
  const top = $('topStats');
  top.innerHTML = \`<div class="stat-chip lvl">LV <span class="num">\${state.level}</span></div>\`;
}

function renderQuestion(){
  const q = state.questions[state.current];
  if(!q) return;

  $('qCurrent').textContent = state.current + 1;
  $('qTotal').textContent = state.totalQ;
  $('qScore').textContent = state.score;
  $('qCombo').textContent = state.combo >= 2 ? '×' + state.combo : '';
  $('qProg').style.width = ((state.current / state.totalQ) * 100) + '%';
  $('feedbackBox').innerHTML = '';

  const content = $('qContent');
  const answers = $('answers');

  if(q.mode === 'image'){
    /* === Image mode — Level 1 only === */
    if(state.level === 1){
      /* Show Hangul letter big, choose the romanization */
      content.innerHTML = \`
        <div class="q-prompt">Look at the letter · choose the sound</div>
        <div class="q-text-big">\${q.answer.kr}</div>
      \`;
      answers.className = 'answers cols-2';
      answers.innerHTML = q.options.map((opt, i) => \`
        <button class="ans-btn" data-idx="\${i}">
          <span class="kr">\${opt.sub || opt.roman}</span>
        </button>
      \`).join('');
    } else {
      /* Show image, choose Korean (fallback for future use) */
      content.innerHTML = \`
        <div class="q-prompt">Look and choose the Korean</div>
        <div class="q-image">\${q.answer.img || '🔤'}</div>
      \`;
      answers.className = 'answers cols-2';
      answers.innerHTML = q.options.map((opt, i) => \`
        <button class="ans-btn" data-idx="\${i}">
          <span class="kr">\${opt.kr}</span>
          \${opt.roman ? '<span class="sub">' + opt.roman + '</span>' : ''}
        </button>
      \`).join('');
    }
  }
  else if(q.mode === 'text'){
    /* === Text mode: show Korean, pick meaning (CN + EN) === */
    content.innerHTML = \`
      <div class="q-prompt">What does this mean?</div>
      <div class="q-text-big \${q.answer.kr.length > 8 ? 'small' : ''}">\${q.answer.kr}</div>
      \${q.answer.roman ? '<div class="q-sub">' + q.answer.roman + '</div>' : ''}
    \`;
    answers.className = 'answers cols-2';
    answers.innerHTML = q.options.map((opt, i) => {
      /* Build CN + EN meaning */
      let innerHTML = '';
      if(opt.zh && opt.en){
        innerHTML = \`<span class="ans-text"><span class="zh">\${opt.zh}</span><span class="sep">/</span><span class="en">\${opt.en}</span></span>\`;
      } else if(opt.zh){
        innerHTML = \`<span class="ans-text">\${opt.zh}</span>\`;
      } else if(opt.en){
        innerHTML = \`<span class="ans-text"><span class="en">\${opt.en}</span></span>\`;
      } else {
        /* L1 fallback — show roman */
        innerHTML = \`<span class="kr">\${opt.sub || opt.roman || opt.kr}</span>\`;
      }
      return \`<button class="ans-btn" data-idx="\${i}">\${innerHTML}</button>\`;
    }).join('');
  }
  else if(q.mode === 'listen'){
    /* === Listen mode === */
    content.innerHTML = \`
      <div class="q-prompt">Listen and choose</div>
      <button class="q-speaker" id="speakerBtn">🔊</button>
      <div class="q-speaker-hint">Tap to replay</div>
      <div class="audio-hint" id="audioHint">\${t('noAudio')}</div>
    \`;
    setTimeout(() => speakKorean(q.answer.kr, true), 300);
    const sp = $('speakerBtn');
    if(sp) sp.addEventListener('click', () => speakKorean(q.answer.kr, false));

    answers.className = 'answers cols-2';
    answers.innerHTML = q.options.map((opt, i) => \`
      <button class="ans-btn" data-idx="\${i}">
        <span class="kr">\${opt.kr}</span>
      </button>
    \`).join('');
  }

  /* Bind clicks */
  answers.querySelectorAll('.ans-btn').forEach(btn => {
    btn.addEventListener('click', () => onAnswer(parseInt(btn.dataset.idx, 10), btn));
  });
}

function onAnswer(idx, btn){
  if(state.locked) return;
  state.locked = true;

  const q = state.questions[state.current];
  const chosen = q.options[idx];
  const isCorrect = chosen.kr === q.answer.kr;

  document.querySelectorAll('.ans-btn').forEach(b => { b.disabled = true; });

  if(isCorrect){
    btn.classList.add('correct');
    state.correct++;
    state.combo++;
    if(state.combo > state.maxCombo) state.maxCombo = state.combo;
    const gain = 10 + Math.min(state.combo - 1, 9) * 2;
    state.score += gain;

    const combo = $('qCombo');
    if(state.combo >= 2){
      combo.classList.remove('fire');
      void combo.offsetWidth;
      combo.classList.add('fire');
    }
    showFeedback(t('correct'), 'good');
    sfxCorrect();

    if(q.mode !== 'listen') speakKorean(q.answer.kr, false);
  } else {
    btn.classList.add('wrong');
    state.wrong++;
    state.combo = 0;

    document.querySelectorAll('.ans-btn').forEach(b => {
      const i = parseInt(b.dataset.idx, 10);
      if(q.options[i].kr === q.answer.kr){
        b.classList.add('reveal');
      }
    });

    showFeedback(t('wrong'), 'bad');
    sfxWrong();
    speakKorean(q.answer.kr, false);
  }

  $('qScore').textContent = state.score;
  $('qCombo').textContent = state.combo >= 2 ? '×' + state.combo : '';
  $('qProg').style.width = (((state.current + 1) / state.totalQ) * 100) + '%';

  setTimeout(() => {
    state.current++;
    state.locked = false;
    if(state.current >= state.totalQ){
      showResult();
    } else {
      renderQuestion();
    }
  }, isCorrect ? 900 : 1500);
}

function showFeedback(text, type){
  $('feedbackBox').innerHTML = \`<div class="feedback \${type}">\${text}</div>\`;
}

/* ============================================================
   RESULT
   ============================================================ */
function showResult(){
  const pct = state.totalQ ? Math.round(state.correct / state.totalQ * 100) : 0;

  const p = state.progress[state.level] || { plays:0, best:0 };
  p.plays++;
  if(pct > p.best) p.best = pct;
  state.progress[state.level] = p;
  saveProgress();

  let icon = '🎉', title, sub;
  if(pct >= 90){ icon = '🏆'; title = lang === 'zh' ? '完美！' : 'Perfect!'; sub = lang === 'zh' ? '你已经完全掌握这个等级了' : 'You have mastered this level'; }
  else if(pct >= 70){ icon = '🌟'; title = lang === 'zh' ? '很棒！' : 'Great!'; sub = lang === 'zh' ? '再练几次就能满分' : 'A few more rounds to perfection'; }
  else if(pct >= 50){ icon = '💪'; title = lang === 'zh' ? '还不错' : 'Good Effort'; sub = lang === 'zh' ? '继续努力' : 'Keep practicing'; }
  else { icon = '📚'; title = lang === 'zh' ? '继续加油' : 'Keep Trying'; sub = lang === 'zh' ? '反复练习很重要' : 'Repetition is the key'; }

  $('resultWrap').innerHTML = \`
    <div class="result-icon">\${icon}</div>
    <div class="result-title">\${title}</div>
    <div class="result-sub">\${sub}</div>
    <div class="result-grid">
      <div class="res-box">
        <div class="res-label">Score</div>
        <div class="res-value gold">\${state.score}</div>
      </div>
      <div class="res-box">
        <div class="res-label">Accuracy</div>
        <div class="res-value green">\${pct}%</div>
      </div>
      <div class="res-box">
        <div class="res-label">Max Combo</div>
        <div class="res-value cyan">×\${state.maxCombo}</div>
      </div>
    </div>
    <div class="res-actions">
      <button class="res-btn" onclick="startQuiz('\${state.mode}')">\${t('againBtn')}</button>
      <button class="res-btn ghost" onclick="goHome()">\${t('backBtn')}</button>
    </div>
  \`;
  showScreen('screenResult');
}

/* ============================================================
   SPEECH
   ============================================================ */
let voices = [];
let koVoice = null;
function loadVoices(){
  if(!('speechSynthesis' in window)) return;
  voices = speechSynthesis.getVoices() || [];
  koVoice = voices.find(v => v.lang && v.lang.toLowerCase().indexOf('ko') === 0) || null;
}
if('speechSynthesis' in window){
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
  setTimeout(loadVoices, 400);
  setTimeout(loadVoices, 1200);
}

function speakKorean(text, isAuto){
  if(!('speechSynthesis' in window) || !text) return;
  try{
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ko-KR';
    u.rate = 0.85;
    u.pitch = 1.0;
    if(koVoice) u.voice = koVoice;
    speechSynthesis.speak(u);

    const hint = $('audioHint');
    if(hint){
      if(!koVoice && voices.length > 0) hint.classList.add('on');
      else hint.classList.remove('on');
    }
  }catch(e){}
}

/* ============================================================
   SFX
   ============================================================ */
let actx = null;
function getAudio(){
  if(!actx){
    const AC = window.AudioContext || window.webkitAudioContext;
    actx = new AC();
  }
  if(actx.state === 'suspended') actx.resume();
  return actx;
}
function tone(freq, start, dur, type, vol){
  try{
    const c = getAudio();
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = type || 'sine';
    o.frequency.value = freq;
    o.connect(g); g.connect(c.destination);
    const t0 = c.currentTime + start;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol || 0.15, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + dur);
    o.start(t0); o.stop(t0 + dur + 0.05);
  }catch(e){}
}
function sfxCorrect(){
  tone(523.25, 0, 0.12, 'sine', 0.15);
  tone(659.25, 0.08, 0.12, 'sine', 0.13);
  tone(783.99, 0.16, 0.2, 'sine', 0.12);
}
function sfxWrong(){
  tone(280, 0, 0.15, 'sawtooth', 0.1);
  tone(180, 0.1, 0.2, 'sawtooth', 0.08);
}

/* ============================================================
   INIT
   ============================================================ */
$('heroDesc').textContent = t('heroDesc');
$('backLabel').textContent = t('back');

renderLevelGrid();
renderTopStats();
document.body.addEventListener('click', () => {
  try{ getAudio(); }catch(e){}
}, { once: true });

window.state = state;
<\/script>
</body>
</html>`;

  window.initGame = function initGame(wrapper) {
    if (!wrapper || typeof wrapper.replaceChildren !== 'function') {
      throw new Error('initGame requires a container element.');
    }
    var frame = document.createElement('iframe');
    frame.title = 'Korean Master';
    frame.setAttribute('allow', 'autoplay; fullscreen');
    frame.style.cssText = 'display:block;width:100%;height:100%;min-height:720px;border:0;border-radius:16px;background:#0a0e1a;overflow:hidden;';
    frame.srcdoc = gameHTML;
    wrapper.replaceChildren(frame);
    return frame;
  };
})();
