/* Learn Japanese · 6-Level Japanese Learning Game */
(function () {
  'use strict';

  const gameHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>日本語マスター · Japanese Master</title>
<style>
*{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
:root{
  --bg:#0a0e1a;--panel:#141a28;--panel2:#1c2438;
  --line:#2a3450;--text:#e8eefc;--dim:#7a8aaa;
  --accent:#5b9eff;--accent2:#7c5cff;
  --green:#3fe08a;--red:#ff5570;--gold:#ffc857;
  --pink:#ff7eb3;--cyan:#4de0ff;
  --japanese:#ff8fab;
}
html,body{
  height:100%;overflow:hidden;
  background:radial-gradient(ellipse at 50% 0%,#2a1f38 0%,var(--bg) 55%);
  font-family:'Segoe UI','Noto Sans JP',system-ui,Arial,sans-serif;
  color:var(--text);user-select:none;
}
button{border:0;cursor:pointer;color:inherit;font-family:inherit;font-weight:600}
button:disabled{opacity:.4;cursor:not-allowed}

#app{
  height:100%;display:flex;flex-direction:column;
  max-width:1200px;margin:0 auto;
  padding:16px 20px;position:relative;
}
.topbar{
  display:flex;justify-content:space-between;align-items:center;
  padding:8px 0 16px;flex-shrink:0;
}
.logo{
  font-size:20px;font-weight:900;letter-spacing:-.5px;
  display:flex;align-items:center;gap:8px;
}
.logo .jp{color:var(--japanese);font-size:22px}
.top-stats{display:flex;gap:10px;align-items:center;font-size:12px}
.stat-chip{
  background:var(--panel);border:1px solid var(--line);
  border-radius:20px;padding:6px 14px;
  display:flex;align-items:center;gap:6px;font-weight:700;
}
.stat-chip .num{color:var(--gold);font-weight:900}
.stat-chip.lvl .num{color:var(--cyan)}

.screen{flex:1;display:none;flex-direction:column;min-height:0}
.screen.on{display:flex}

/* HOME */
.home-scroll{flex:1;overflow-y:auto;padding-right:4px}
.home-scroll::-webkit-scrollbar{width:6px}
.home-scroll::-webkit-scrollbar-thumb{background:var(--line);border-radius:3px}
.hero{text-align:center;padding:20px 10px 26px}
.hero h1{
  font-size:clamp(32px,5.5vw,48px);font-weight:900;
  letter-spacing:-1px;line-height:1;margin-bottom:10px;
}
.hero h1 .jp{
  color:var(--japanese);display:block;font-size:.7em;
  letter-spacing:4px;margin-bottom:8px;
  text-shadow:0 0 20px rgba(255,143,171,.4);
}
.hero p{color:var(--dim);font-size:14px;line-height:1.7;max-width:720px;margin:0 auto}

.level-grid{
  display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));
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
.lv-title{
  font-size:19px;font-weight:900;margin-bottom:4px;letter-spacing:-.3px;
  line-height:1.35;
}
.lv-title .jp{
  display:block;font-size:12px;color:var(--japanese);
  font-weight:700;letter-spacing:1px;margin-top:4px;opacity:.9;
}
.lv-desc{
  color:var(--dim);font-size:13px;line-height:1.6;
  margin-bottom:14px;min-height:60px;
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
.mode-head h2{
  font-size:24px;font-weight:900;letter-spacing:-.5px;margin-bottom:8px;
  line-height:1.35;
}
.mode-head h2 .jp{
  color:var(--japanese);font-size:.75em;font-weight:700;
  margin-left:10px;letter-spacing:1px;
}
.mode-head p{color:var(--dim);font-size:13px;line-height:1.7}

.mode-grid{
  display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
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
.mode-name{font-size:15px;font-weight:800;margin-bottom:6px;line-height:1.4}
.mode-name .jp{
  display:block;font-size:11px;color:var(--japanese);
  font-weight:600;margin-top:4px;letter-spacing:.5px;
}
.mode-desc{font-size:12px;color:var(--dim);line-height:1.6}

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
  transition:.15s;flex-shrink:0;
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
  background:radial-gradient(circle at 50% 0%,rgba(255,143,171,.08),transparent 60%);
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
  line-height:1.6;
}
.q-image{
  font-size:clamp(80px,15vw,140px);line-height:1;
  filter:drop-shadow(0 6px 20px rgba(0,0,0,.4));
}
.q-text-big{
  font-size:clamp(40px,8vw,72px);font-weight:900;
  color:var(--japanese);letter-spacing:2px;
  text-shadow:0 0 30px rgba(255,143,171,.4);line-height:1.1;
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
.q-speaker-hint{font-size:13px;color:var(--dim);margin-top:8px;line-height:1.6}

.answers{
  display:grid;gap:10px;width:100%;max-width:700px;
  flex-shrink:0;margin:0 auto;align-self:center;
}
.answers.cols-2{grid-template-columns:repeat(2,1fr)}
.answers.cols-3{grid-template-columns:repeat(3,1fr)}
.answers.cols-4{grid-template-columns:repeat(2,1fr)}

.ans-btn{
  background:linear-gradient(145deg,var(--panel2),var(--panel));
  border:2px solid var(--line);border-radius:14px;
  padding:16px 14px;font-size:15px;font-weight:700;
  cursor:pointer;transition:.15s;
  display:flex;flex-direction:column;
  align-items:center;justify-content:center;
  gap:4px;min-height:66px;
  line-height:1.4;text-align:center;
  width:100%;
}
.ans-btn:hover:not(:disabled){
  border-color:var(--accent);background:var(--panel2);
  transform:translateY(-2px);
}
.ans-btn .jp{
  font-size:18px;font-weight:800;color:var(--japanese);
  display:block;
}
.ans-btn .sub{
  font-size:12px;color:var(--dim);font-weight:600;
  display:block;margin-top:2px;
}
.ans-btn .ans-text{
  display:block;font-size:14px;font-weight:700;
  color:var(--text);line-height:1.5;
}
.ans-btn .ans-text .zh{color:var(--text)}
.ans-btn .ans-text .sep{color:var(--dim);margin:0 6px;font-weight:400}
.ans-btn .ans-text .en{color:var(--cyan);font-weight:600}

.ans-btn.correct{
  background:linear-gradient(145deg,rgba(63,224,138,.15),rgba(63,224,138,.08));
  border-color:var(--green);
  box-shadow:0 0 24px rgba(63,224,138,.3);
  animation:correctPop .4s;
}
.ans-btn.correct .jp{color:var(--green)}
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
.ans-btn.wrong .jp{color:var(--red)}
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
.ans-btn.reveal .jp{color:var(--green)}
.ans-btn.reveal .ans-text{color:var(--green)}
.ans-btn:disabled{cursor:default}

.feedback{
  position:absolute;top:20px;left:50%;
  transform:translateX(-50%);
  padding:8px 20px;border-radius:20px;
  font-size:14px;font-weight:800;letter-spacing:.5px;
  animation:fbIn .5s;pointer-events:none;z-index:10;
  white-space:nowrap;
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
.result-title{
  font-size:30px;font-weight:900;letter-spacing:-.5px;margin-bottom:8px;
  line-height:1.35;
}
.result-sub{color:var(--dim);font-size:13px;margin-bottom:32px;line-height:1.6}
.result-grid{
  display:grid;grid-template-columns:repeat(3,1fr);
  gap:12px;max-width:560px;width:100%;margin-bottom:32px;
}
.res-box{
  background:var(--panel2);border:1.5px solid var(--line);
  border-radius:12px;padding:14px;
}
.res-label{
  font-size:10px;color:var(--dim);font-weight:800;
  letter-spacing:1.2px;text-transform:uppercase;margin-bottom:6px;
  line-height:1.4;
}
.res-value{font-size:24px;font-weight:900;line-height:1}
.res-value.gold{color:var(--gold)}
.res-value.green{color:var(--green)}
.res-value.cyan{color:var(--cyan)}
.res-actions{display:flex;gap:12px;flex-wrap:wrap;justify-content:center}
.res-btn{
  padding:14px 32px;border-radius:12px;
  font-size:14px;font-weight:800;letter-spacing:.5px;
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

.audio-hint{
  font-size:11px;color:var(--red);
  margin-top:8px;padding:4px 10px;
  background:rgba(255,85,112,.1);
  border-radius:8px;display:none;
  line-height:1.5;
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
  .feedback{font-size:12px;padding:6px 14px}
}
</style>
</head>
<body>

<div id="app">

  <div class="topbar">
    <div class="logo">
      <span>日本語</span> Japanese Master
    </div>
    <div class="top-stats" id="topStats"></div>
  </div>

  <div class="screen on" id="screenHome">
    <div class="home-scroll">
      <div class="hero">
        <h1>
          <span class="jp">日本語を学ぼう</span>
          Learn Japanese
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
   UI (bilingual: 中文 · English)
   ============================================================ */
const UI = {
  heroDesc: '选择你的等级 · 每个等级都有自己的词汇、短句和对话，每次进入都会随机出题。<br>Choose your level · Each level has its own vocabulary, phrases and dialogue. Questions are randomized every time.',
  back: '返回 · Back',
  modeImage: '看图选字 · Image → Japanese',
  modeImageDesc: '看图片选正确的日语 · Look at the image, pick the correct Japanese',
  modeText: '看日语选意思 · Japanese → Meaning',
  modeTextDesc: '看日语字词选正确的中英意思 · Read the Japanese, pick the correct meaning',
  modeListen: '听音选字 · Listen & Pick',
  modeListenDesc: '听日语发音选正确的日语 · Listen to the Japanese, pick the correct word',
  modeMix: '混合挑战 · Mixed Challenge',
  modeMixDesc: '三种题型随机出现 · All three modes mixed randomly',
  correct: '✓ 正确 · Correct',
  wrong: '✗ 错误 · Wrong',
  againBtn: '再来一轮 · Play Again',
  backBtn: '返回选单 · Back to Levels',
  noAudio: '⚠️ 此设备没有日语语音 · Japanese voice not available on this device',
  score: '得分 · Score',
  accuracy: '正确率 · Accuracy',
  maxCombo: '最大连击 · Max Combo',
  played: '已玩 · Played',
  quitConfirm: '确定要退出本轮测试吗？\\n\\nQuit this round?',
  perfectTitle: '完美！ · Perfect!',
  perfectSub: '你已经完全掌握这个等级了 · You have mastered this level',
  greatTitle: '很棒！ · Great!',
  greatSub: '再练几次就能满分 · A few more rounds to perfection',
  goodTitle: '还不错 · Good Effort',
  goodSub: '继续努力 · Keep practicing',
  keepTitle: '继续加油 · Keep Trying',
  keepSub: '反复练习很重要 · Repetition is the key'
};
function t(k){ return UI[k] || k; }

/* ============================================================
   DATA — HIRAGANA & KATAKANA (Level 1)
   ============================================================ */
const L1_HIRAGANA = [
  { kr:'あ', roman:'a',   en:'a' },   { kr:'い', roman:'i',   en:'i' },
  { kr:'う', roman:'u',   en:'u' },   { kr:'え', roman:'e',   en:'e' },
  { kr:'お', roman:'o',   en:'o' },   { kr:'か', roman:'ka',  en:'ka' },
  { kr:'き', roman:'ki',  en:'ki' },  { kr:'く', roman:'ku',  en:'ku' },
  { kr:'け', roman:'ke',  en:'ke' },  { kr:'こ', roman:'ko',  en:'ko' },
  { kr:'さ', roman:'sa',  en:'sa' },  { kr:'し', roman:'shi', en:'shi' },
  { kr:'す', roman:'su',  en:'su' },  { kr:'せ', roman:'se',  en:'se' },
  { kr:'そ', roman:'so',  en:'so' },  { kr:'た', roman:'ta',  en:'ta' },
  { kr:'ち', roman:'chi', en:'chi' }, { kr:'つ', roman:'tsu', en:'tsu' },
  { kr:'て', roman:'te',  en:'te' },  { kr:'と', roman:'to',  en:'to' },
  { kr:'な', roman:'na',  en:'na' },  { kr:'に', roman:'ni',  en:'ni' },
  { kr:'ぬ', roman:'nu',  en:'nu' },  { kr:'ね', roman:'ne',  en:'ne' },
  { kr:'の', roman:'no',  en:'no' },  { kr:'は', roman:'ha',  en:'ha' },
  { kr:'ひ', roman:'hi',  en:'hi' },  { kr:'ふ', roman:'fu',  en:'fu' },
  { kr:'へ', roman:'he',  en:'he' },  { kr:'ほ', roman:'ho',  en:'ho' },
  { kr:'ま', roman:'ma',  en:'ma' },  { kr:'み', roman:'mi',  en:'mi' },
  { kr:'む', roman:'mu',  en:'mu' },  { kr:'め', roman:'me',  en:'me' },
  { kr:'も', roman:'mo',  en:'mo' },  { kr:'や', roman:'ya',  en:'ya' },
  { kr:'ゆ', roman:'yu',  en:'yu' },  { kr:'よ', roman:'yo',  en:'yo' },
  { kr:'ら', roman:'ra',  en:'ra' },  { kr:'り', roman:'ri',  en:'ri' },
  { kr:'る', roman:'ru',  en:'ru' },  { kr:'れ', roman:'re',  en:'re' },
  { kr:'ろ', roman:'ro',  en:'ro' },  { kr:'わ', roman:'wa',  en:'wa' },
  { kr:'を', roman:'wo',  en:'wo' },  { kr:'ん', roman:'n',   en:'n' },
  /* voiced */
  { kr:'が', roman:'ga',  en:'ga' },  { kr:'ぎ', roman:'gi',  en:'gi' },
  { kr:'ぐ', roman:'gu',  en:'gu' },  { kr:'げ', roman:'ge',  en:'ge' },
  { kr:'ご', roman:'go',  en:'go' },  { kr:'ざ', roman:'za',  en:'za' },
  { kr:'じ', roman:'ji',  en:'ji' },  { kr:'ず', roman:'zu',  en:'zu' },
  { kr:'ぜ', roman:'ze',  en:'ze' },  { kr:'ぞ', roman:'zo',  en:'zo' },
  { kr:'だ', roman:'da',  en:'da' },  { kr:'ぢ', roman:'ji',  en:'ji' },
  { kr:'づ', roman:'zu',  en:'zu' },  { kr:'で', roman:'de',  en:'de' },
  { kr:'ど', roman:'do',  en:'do' },  { kr:'ば', roman:'ba',  en:'ba' },
  { kr:'び', roman:'bi',  en:'bi' },  { kr:'ぶ', roman:'bu',  en:'bu' },
  { kr:'べ', roman:'be',  en:'be' },  { kr:'ぼ', roman:'bo',  en:'bo' },
  { kr:'ぱ', roman:'pa',  en:'pa' },  { kr:'ぴ', roman:'pi',  en:'pi' },
  { kr:'ぷ', roman:'pu',  en:'pu' },  { kr:'ぺ', roman:'pe',  en:'pe' },
  { kr:'ぽ', roman:'po',  en:'po' }
];

const L1_KATAKANA = [
  { kr:'ア', roman:'a',   en:'a' },   { kr:'イ', roman:'i',   en:'i' },
  { kr:'ウ', roman:'u',   en:'u' },   { kr:'エ', roman:'e',   en:'e' },
  { kr:'オ', roman:'o',   en:'o' },   { kr:'カ', roman:'ka',  en:'ka' },
  { kr:'キ', roman:'ki',  en:'ki' },  { kr:'ク', roman:'ku',  en:'ku' },
  { kr:'ケ', roman:'ke',  en:'ke' },  { kr:'コ', roman:'ko',  en:'ko' },
  { kr:'サ', roman:'sa',  en:'sa' },  { kr:'シ', roman:'shi', en:'shi' },
  { kr:'ス', roman:'su',  en:'su' },  { kr:'セ', roman:'se',  en:'se' },
  { kr:'ソ', roman:'so',  en:'so' },  { kr:'タ', roman:'ta',  en:'ta' },
  { kr:'チ', roman:'chi', en:'chi' }, { kr:'ツ', roman:'tsu', en:'tsu' },
  { kr:'テ', roman:'te',  en:'te' },  { kr:'ト', roman:'to',  en:'to' },
  { kr:'ナ', roman:'na',  en:'na' },  { kr:'ニ', roman:'ni',  en:'ni' },
  { kr:'ヌ', roman:'nu',  en:'nu' },  { kr:'ネ', roman:'ne',  en:'ne' },
  { kr:'ノ', roman:'no',  en:'no' },  { kr:'ハ', roman:'ha',  en:'ha' },
  { kr:'ヒ', roman:'hi',  en:'hi' },  { kr:'フ', roman:'fu',  en:'fu' },
  { kr:'ヘ', roman:'he',  en:'he' },  { kr:'ホ', roman:'ho',  en:'ho' },
  { kr:'マ', roman:'ma',  en:'ma' },  { kr:'ミ', roman:'mi',  en:'mi' },
  { kr:'ム', roman:'mu',  en:'mu' },  { kr:'メ', roman:'me',  en:'me' },
  { kr:'モ', roman:'mo',  en:'mo' },  { kr:'ヤ', roman:'ya',  en:'ya' },
  { kr:'ユ', roman:'yu',  en:'yu' },  { kr:'ヨ', roman:'yo',  en:'yo' },
  { kr:'ラ', roman:'ra',  en:'ra' },  { kr:'リ', roman:'ri',  en:'ri' },
  { kr:'ル', roman:'ru',  en:'ru' },  { kr:'レ', roman:'re',  en:'re' },
  { kr:'ロ', roman:'ro',  en:'ro' },  { kr:'ワ', roman:'wa',  en:'wa' },
  { kr:'ヲ', roman:'wo',  en:'wo' },  { kr:'ン', roman:'n',   en:'n' }
];

/* ============================================================
   LEVEL 2 — Basic vocabulary (with emoji images)
   ============================================================ */
const L2 = [
  /* Animals */
  { img:'🐶', kr:'犬',    roman:'inu',      zh:'狗',    en:'dog' },
  { img:'🐱', kr:'猫',    roman:'neko',     zh:'猫',    en:'cat' },
  { img:'🐰', kr:'兎',    roman:'usagi',    zh:'兔子',  en:'rabbit' },
  { img:'🐯', kr:'虎',    roman:'tora',     zh:'老虎',  en:'tiger' },
  { img:'🦁', kr:'獅子',  roman:'shishi',   zh:'狮子',  en:'lion' },
  { img:'🐘', kr:'象',    roman:'zou',      zh:'大象',  en:'elephant' },
  { img:'🐵', kr:'猿',    roman:'saru',     zh:'猴子',  en:'monkey' },
  { img:'🐼', kr:'パンダ', roman:'panda',    zh:'熊猫',  en:'panda' },
  { img:'🐟', kr:'魚',    roman:'sakana',   zh:'鱼',    en:'fish' },
  { img:'🐦', kr:'鳥',    roman:'tori',     zh:'鸟',    en:'bird' },
  { img:'🐸', kr:'蛙',    roman:'kaeru',    zh:'青蛙',  en:'frog' },
  { img:'🐭', kr:'鼠',    roman:'nezumi',   zh:'老鼠',  en:'mouse' },
  { img:'🐮', kr:'牛',    roman:'ushi',     zh:'牛',    en:'cow' },
  { img:'🐷', kr:'豚',    roman:'buta',     zh:'猪',    en:'pig' },
  { img:'🐑', kr:'羊',    roman:'hitsuji',  zh:'羊',    en:'sheep' },
  { img:'🐴', kr:'馬',    roman:'uma',      zh:'马',    en:'horse' },
  { img:'🐻', kr:'熊',    roman:'kuma',     zh:'熊',    en:'bear' },
  { img:'🦊', kr:'狐',    roman:'kitsune',  zh:'狐狸',  en:'fox' },
  { img:'🐺', kr:'狼',    roman:'ookami',   zh:'狼',    en:'wolf' },
  { img:'🐔', kr:'鶏',    roman:'niwatori', zh:'鸡',    en:'chicken' },

  /* Numbers */
  { img:'1️⃣', kr:'一', roman:'ichi',  zh:'一', en:'one' },
  { img:'2️⃣', kr:'二', roman:'ni',    zh:'二', en:'two' },
  { img:'3️⃣', kr:'三', roman:'san',   zh:'三', en:'three' },
  { img:'4️⃣', kr:'四', roman:'shi',   zh:'四', en:'four' },
  { img:'5️⃣', kr:'五', roman:'go',    zh:'五', en:'five' },
  { img:'6️⃣', kr:'六', roman:'roku',  zh:'六', en:'six' },
  { img:'7️⃣', kr:'七', roman:'shichi',zh:'七', en:'seven' },
  { img:'8️⃣', kr:'八', roman:'hachi', zh:'八', en:'eight' },
  { img:'9️⃣', kr:'九', roman:'kyuu',  zh:'九', en:'nine' },
  { img:'🔟', kr:'十', roman:'juu',   zh:'十', en:'ten' },
  { img:'💯', kr:'百', roman:'hyaku', zh:'百', en:'hundred' },
  { img:'🔢', kr:'千', roman:'sen',   zh:'千', en:'thousand' },

  /* Weather & sky */
  { img:'☀️', kr:'太陽', roman:'taiyou',  zh:'太阳',  en:'sun' },
  { img:'🌧️', kr:'雨',  roman:'ame',     zh:'雨',    en:'rain' },
  { img:'❄️', kr:'雪',  roman:'yuki',    zh:'雪',    en:'snow' },
  { img:'☁️', kr:'雲',  roman:'kumo',    zh:'云',    en:'cloud' },
  { img:'🌈', kr:'虹',  roman:'niji',    zh:'彩虹',  en:'rainbow' },
  { img:'⚡', kr:'雷',  roman:'kaminari',zh:'雷',    en:'thunder' },
  { img:'🌬️', kr:'風',  roman:'kaze',    zh:'风',    en:'wind' },
  { img:'🌙', kr:'月',  roman:'tsuki',   zh:'月亮',  en:'moon' },
  { img:'⭐', kr:'星',  roman:'hoshi',   zh:'星星',  en:'star' },

  /* Colors */
  { img:'🔴', kr:'赤',  roman:'aka',     zh:'红色', en:'red' },
  { img:'🔵', kr:'青',  roman:'ao',      zh:'蓝色', en:'blue' },
  { img:'🟡', kr:'黄',  roman:'kiiro',   zh:'黄色', en:'yellow' },
  { img:'🟢', kr:'緑',  roman:'midori',  zh:'绿色', en:'green' },
  { img:'⚫', kr:'黒',  roman:'kuro',    zh:'黑色', en:'black' },
  { img:'⚪', kr:'白',  roman:'shiro',   zh:'白色', en:'white' },
  { img:'🟣', kr:'紫',  roman:'murasaki',zh:'紫色', en:'purple' },
  { img:'🟠', kr:'橙',  roman:'daidai',  zh:'橙色', en:'orange' },

  /* People */
  { img:'👨', kr:'男',    roman:'otoko',    zh:'男人', en:'man' },
  { img:'👩', kr:'女',    roman:'onna',     zh:'女人', en:'woman' },
  { img:'👦', kr:'男の子', roman:'otokonoko',zh:'男孩', en:'boy' },
  { img:'👧', kr:'女の子', roman:'onnanoko', zh:'女孩', en:'girl' },
  { img:'👨', kr:'父',    roman:'chichi',   zh:'父亲', en:'father' },
  { img:'👩', kr:'母',    roman:'haha',     zh:'母亲', en:'mother' },
  { img:'👦', kr:'息子',  roman:'musuko',   zh:'儿子', en:'son' },
  { img:'👧', kr:'娘',    roman:'musume',   zh:'女儿', en:'daughter' },
  { img:'👨', kr:'兄',    roman:'ani',      zh:'哥哥', en:'older brother' },
  { img:'👩', kr:'姉',    roman:'ane',      zh:'姐姐', en:'older sister' },
  { img:'👦', kr:'弟',    roman:'otouto',   zh:'弟弟', en:'younger brother' },
  { img:'👧', kr:'妹',    roman:'imouto',   zh:'妹妹', en:'younger sister' },
  { img:'🤝', kr:'友達',  roman:'tomodachi',zh:'朋友', en:'friend' },
  { img:'🧑', kr:'人',    roman:'hito',     zh:'人',   en:'person' },

  /* Food */
  { img:'🍚', kr:'ご飯',   roman:'gohan',    zh:'饭',   en:'rice / meal' },
  { img:'💧', kr:'水',     roman:'mizu',     zh:'水',   en:'water' },
  { img:'🍞', kr:'パン',   roman:'pan',      zh:'面包', en:'bread' },
  { img:'🍎', kr:'りんご', roman:'ringo',    zh:'苹果', en:'apple' },
  { img:'🍌', kr:'バナナ', roman:'banana',   zh:'香蕉', en:'banana' },
  { img:'🥛', kr:'牛乳',   roman:'gyuunyuu', zh:'牛奶', en:'milk' },
  { img:'🍵', kr:'お茶',   roman:'ocha',     zh:'茶',   en:'tea' },
  { img:'☕', kr:'コーヒー',roman:'koohii',   zh:'咖啡', en:'coffee' },
  { img:'🍜', kr:'麺',     roman:'men',      zh:'面条', en:'noodles' },
  { img:'🥩', kr:'肉',     roman:'niku',     zh:'肉',   en:'meat' },
  { img:'🍣', kr:'寿司',   roman:'sushi',    zh:'寿司', en:'sushi' },
  { img:'🍙', kr:'おにぎり',roman:'onigiri',  zh:'饭团', en:'rice ball' },

  /* Body */
  { img:'👁️', kr:'目', roman:'me',    zh:'眼睛', en:'eye' },
  { img:'👂', kr:'耳', roman:'mimi',  zh:'耳朵', en:'ear' },
  { img:'👃', kr:'鼻', roman:'hana',  zh:'鼻子', en:'nose' },
  { img:'👄', kr:'口', roman:'kuchi', zh:'嘴',   en:'mouth' },
  { img:'✋', kr:'手', roman:'te',    zh:'手',   en:'hand' },
  { img:'🦶', kr:'足', roman:'ashi',  zh:'脚',   en:'foot' },
  { img:'🦷', kr:'歯', roman:'ha',    zh:'牙',   en:'tooth' },
  { img:'💇', kr:'頭', roman:'atama', zh:'头',   en:'head' },

  /* Objects */
  { img:'📱', kr:'携帯',   roman:'keitai',    zh:'手机',   en:'phone' },
  { img:'📖', kr:'本',     roman:'hon',       zh:'书',     en:'book' },
  { img:'⚽', kr:'ボール', roman:'booru',     zh:'球',     en:'ball' },
  { img:'🪑', kr:'椅子',   roman:'isu',       zh:'椅子',   en:'chair' },
  { img:'🛏️', kr:'ベッド', roman:'beddo',     zh:'床',     en:'bed' },
  { img:'☎️', kr:'電話',   roman:'denwa',     zh:'电话',   en:'telephone' },
  { img:'⌚', kr:'時計',   roman:'tokei',     zh:'钟表',   en:'watch' },
  { img:'☂️', kr:'傘',     roman:'kasa',      zh:'雨伞',   en:'umbrella' },
  { img:'🔑', kr:'鍵',     roman:'kagi',      zh:'钥匙',   en:'key' },
  { img:'🎩', kr:'帽子',   roman:'boushi',    zh:'帽子',   en:'hat' },
  { img:'👟', kr:'靴',     roman:'kutsu',     zh:'鞋子',   en:'shoes' },
  { img:'🕶️', kr:'眼鏡',   roman:'megane',    zh:'眼镜',   en:'glasses' },
  { img:'🚗', kr:'車',     roman:'kuruma',    zh:'汽车',   en:'car' },

  /* Places */
  { img:'🏠', kr:'家',     roman:'ie',        zh:'家',     en:'house' },
  { img:'🏫', kr:'学校',   roman:'gakkou',    zh:'学校',   en:'school' },
  { img:'🏥', kr:'病院',   roman:'byouin',    zh:'医院',   en:'hospital' },
  { img:'🏪', kr:'店',     roman:'mise',      zh:'商店',   en:'shop' },
  { img:'🏢', kr:'会社',   roman:'kaisha',    zh:'公司',   en:'company' },
  { img:'🚉', kr:'駅',     roman:'eki',       zh:'车站',   en:'station' },
  { img:'🍽️', kr:'レストラン',roman:'resutoran',zh:'餐厅',  en:'restaurant' },
  { img:'🚻', kr:'トイレ', roman:'toire',     zh:'洗手间', en:'restroom' }
];

/* ============================================================
   LEVEL 3 — Daily phrases
   ============================================================ */
const L3 = [
  { kr:'こんにちは',           roman:'konnichiwa',          zh:'你好',           en:'Hello / Good afternoon' },
  { kr:'おはようございます',   roman:'ohayou gozaimasu',    zh:'早上好',         en:'Good morning' },
  { kr:'こんばんは',           roman:'konbanwa',            zh:'晚上好',         en:'Good evening' },
  { kr:'ありがとうございます', roman:'arigatou gozaimasu',  zh:'谢谢',           en:'Thank you' },
  { kr:'すみません',           roman:'sumimasen',           zh:'对不起/不好意思', en:'Sorry / Excuse me' },
  { kr:'ごめんなさい',         roman:'gomen nasai',         zh:'对不起',         en:'I am sorry' },
  { kr:'大丈夫です',           roman:'daijoubu desu',       zh:'没关系',         en:'It is okay' },
  { kr:'はい',                 roman:'hai',                 zh:'是',             en:'Yes' },
  { kr:'いいえ',               roman:'iie',                 zh:'不是',           en:'No' },
  { kr:'さようなら',           roman:'sayounara',           zh:'再见',           en:'Goodbye' },
  { kr:'またね',               roman:'mata ne',             zh:'再见(口语)',     en:'See you (casual)' },
  { kr:'はじめまして',         roman:'hajimemashite',       zh:'初次见面',       en:'Nice to meet you' },
  { kr:'よろしくお願いします', roman:'yoroshiku onegaishimasu', zh:'请多指教',   en:'Please treat me well' },
  { kr:'お願いします',         roman:'onegaishimasu',       zh:'拜托了',         en:'Please' },
  { kr:'お名前は何ですか？',   roman:'onamae wa nan desu ka?',zh:'你叫什么名字？', en:'What is your name?' },
  { kr:'私は___です',          roman:'watashi wa ___ desu',  zh:'我是___',        en:'I am ___' },
  { kr:'お元気ですか？',       roman:'ogenki desu ka?',      zh:'你好吗？',       en:'How are you?' },
  { kr:'元気です',             roman:'genki desu',          zh:'我很好',         en:'I am fine' },
  { kr:'お久しぶりです',       roman:'ohisashiburi desu',   zh:'好久不见',       en:'Long time no see' },
  { kr:'いらっしゃいませ',     roman:'irasshaimase',        zh:'欢迎光临',       en:'Welcome (shop)' },
  { kr:'いただきます',         roman:'itadakimasu',         zh:'我开动了',       en:'Before eating' },
  { kr:'ごちそうさまでした',   roman:'gochisousama deshita', zh:'我吃饱了',       en:'After eating' },
  { kr:'お誕生日おめでとう',   roman:'otanjoubi omedetou',   zh:'生日快乐',       en:'Happy birthday' },
  { kr:'愛してる',             roman:'aishiteru',           zh:'我爱你',         en:'I love you' },
  { kr:'会いたい',             roman:'aitai',               zh:'想见你',         en:'I want to see you' },
  { kr:'頑張って',             roman:'ganbatte',            zh:'加油',           en:'Do your best' },
  { kr:'おやすみなさい',       roman:'oyasuminasai',        zh:'晚安',           en:'Good night' },
  { kr:'おめでとうございます', roman:'omedetou gozaimasu',  zh:'恭喜',           en:'Congratulations' },
  { kr:'お大事に',             roman:'odaiji ni',           zh:'保重',           en:'Take care' },
  { kr:'いいですね',           roman:'ii desu ne',          zh:'真不错',         en:'That is nice' },
  { kr:'本当ですか？',         roman:'hontou desu ka?',     zh:'真的吗？',       en:'Really?' },
  { kr:'もちろん',             roman:'mochiron',            zh:'当然',           en:'Of course' },
  { kr:'わかりません',         roman:'wakarimasen',         zh:'我不懂',         en:'I do not understand' },
  { kr:'わかりました',         roman:'wakarimashita',       zh:'我明白了',       en:'I understand' },
  { kr:'もう一度お願いします', roman:'mou ichido onegaishimasu', zh:'请再说一次', en:'Please say again' },
  { kr:'ゆっくり話してください',roman:'yukkuri hanashite kudasai', zh:'请说慢一点', en:'Please speak slowly' },
  { kr:'日本語が話せません',   roman:'nihongo ga hanasemasen', zh:'我不会说日语', en:'I cannot speak Japanese' },
  { kr:'英語を話せますか？',   roman:'eigo o hanasemasu ka?', zh:'你会说英语吗？', en:'Do you speak English?' },
  { kr:'助けてください',       roman:'tasukete kudasai',    zh:'请帮帮我',       en:'Please help me' },
  { kr:'すみません、ちょっといいですか？', roman:'sumimasen, chotto ii desu ka?', zh:'打扰一下可以吗？', en:'Excuse me, may I ask?' }
];

/* ============================================================
   LEVEL 4 — Short dialogue
   ============================================================ */
const L4 = [
  { kr:'トイレはどこですか？',   roman:'toire wa doko desu ka?',    zh:'洗手间在哪里？',   en:'Where is the restroom?' },
  { kr:'これはいくらですか？',   roman:'kore wa ikura desu ka?',    zh:'这个多少钱？',     en:'How much is this?' },
  { kr:'高すぎます',             roman:'takasugimasu',              zh:'太贵了',           en:'Too expensive' },
  { kr:'安くしてください',       roman:'yasuku shite kudasai',      zh:'请便宜一点',       en:'Please discount' },
  { kr:'カードで払えますか？',   roman:'kaado de haraemasu ka?',    zh:'可以刷卡吗？',     en:'Can I pay by card?' },
  { kr:'現金で払います',         roman:'genkin de haraimasu',       zh:'我用现金',         en:'I will pay cash' },
  { kr:'袋をください',           roman:'fukuro o kudasai',          zh:'请给我一个袋子',   en:'Please give me a bag' },
  { kr:'メニューをください',     roman:'menyuu o kudasai',          zh:'请给我菜单',       en:'Please give me the menu' },
  { kr:'注文します',             roman:'chuumon shimasu',           zh:'我要点餐',         en:'I would like to order' },
  { kr:'おすすめは何ですか？',   roman:'osusume wa nan desu ka?',   zh:'你推荐什么？',     en:'What do you recommend?' },
  { kr:'これは辛いですか？',     roman:'kore wa karai desu ka?',    zh:'这个辣吗？',       en:'Is this spicy?' },
  { kr:'おいしいです',           roman:'oishii desu',               zh:'好吃',             en:'Delicious' },
  { kr:'水をください',           roman:'mizu o kudasai',            zh:'请给我水',         en:'Please give me water' },
  { kr:'お会計をお願いします',   roman:'okaikei o onegaishimasu',   zh:'请结账',           en:'Check please' },
  { kr:'すみません！',           roman:'sumimasen!',                zh:'喂服务员！',       en:'Excuse me! (to server)' },
  { kr:'持ち帰りでお願いします', roman:'mochikaeri de onegaishimasu', zh:'请打包',         en:'Please pack it to go' },
  { kr:'道に迷いました',         roman:'michi ni mayoimashita',      zh:'我迷路了',         en:'I am lost' },
  { kr:'ここはどこですか？',     roman:'koko wa doko desu ka?',     zh:'这是哪里？',       en:'Where am I?' },
  { kr:'タクシーを呼んでください',roman:'takushii o yonde kudasai', zh:'请帮我叫出租车',   en:'Please call a taxi' },
  { kr:'今何時ですか？',         roman:'ima nanji desu ka?',        zh:'几点了？',         en:'What time is it?' },
  { kr:'今日はいい天気ですね',   roman:'kyou wa ii tenki desu ne',   zh:'今天天气真好',     en:'Nice weather today' },
  { kr:'明日は時間がありますか？',roman:'ashita wa jikan ga arimasu ka?', zh:'明天有时间吗？', en:'Do you have time tomorrow?' },
  { kr:'一緒に行きませんか？',   roman:'issho ni ikimasen ka?',     zh:'要一起去吗？',     en:'Want to go together?' },
  { kr:'電話番号は何ですか？',   roman:'denwa bangou wa nan desu ka?', zh:'电话号码是多少？', en:'What is your phone number?' },
  { kr:'メールを送ってください', roman:'meeru o okutte kudasai',   zh:'请发邮件给我',     en:'Please send me an email' },
  { kr:'何名様ですか？',         roman:'nanmei sama desu ka?',      zh:'几位？',           en:'How many people?' },
  { kr:'予約したいです',         roman:'yoyaku shitai desu',        zh:'我想预订',         en:'I would like to make a reservation' },
  { kr:'写真を撮ってください',   roman:'shashin o totte kudasai',   zh:'请帮我拍照',       en:'Please take a photo' },
  { kr:'これは何ですか？',       roman:'kore wa nan desu ka?',      zh:'这是什么？',       en:'What is this?' },
  { kr:'ゆっくりお願いします',   roman:'yukkuri onegaishimasu',     zh:'请慢一点',         en:'Please slow down' },
  { kr:'もう一度言ってください', roman:'mou ichido itte kudasai',  zh:'请再说一次',       en:'Please say it again' },
  { kr:'理解できません',         roman:'rikai dekimasen',           zh:'我不理解',         en:'I do not understand' },
  { kr:'日本語を勉強しています', roman:'nihongo o benkyou shite imasu', zh:'我在学日语',  en:'I am learning Japanese' },
  { kr:'どのくらいかかりますか？',roman:'dono kurai kakarimasu ka?', zh:'要多久？',        en:'How long does it take?' },
  { kr:'いつ出発しますか？',     roman:'itsu shuppatsu shimasu ka?',zh:'什么时候出发？',   en:'When does it depart?' },
  { kr:'どこで会いましょうか？', roman:'doko de aimashou ka?',     zh:'在哪里见面？',     en:'Where shall we meet?' },
  { kr:'何番のバスですか？',     roman:'nanban no basu desu ka?',   zh:'几号公交车？',     en:'Which bus number?' },
  { kr:'ここから近いですか？',   roman:'koko kara chikai desu ka?', zh:'离这里近吗？',     en:'Is it close from here?' },
  { kr:'日本料理が好きです',     roman:'nihon ryouri ga suki desu', zh:'我喜欢日本料理',   en:'I like Japanese food' },
  { kr:'辛いものが苦手です',     roman:'karai mono ga nigate desu', zh:'我不能吃辣',       en:'I cannot eat spicy food' }
];

/* ============================================================
   LEVEL 5 — Advanced conversation
   ============================================================ */
const L5 = [
  { kr:'今日はとても忙しかったです',           roman:'kyou wa totemo isogashikatta desu',           zh:'今天真的很忙',           en:'Today was really busy' },
  { kr:'週末は何をしますか？',                 roman:'shuumatsu wa nani o shimasu ka?',            zh:'周末要做什么？',         en:'What will you do on the weekend?' },
  { kr:'一緒に映画を見に行きませんか？',       roman:'issho ni eiga o mi ni ikimasen ka?',         zh:'要一起去看电影吗？',     en:'Want to go watch a movie together?' },
  { kr:'最近どうですか？',                     roman:'saikin dou desu ka?',                         zh:'最近怎么样？',           en:'How have you been lately?' },
  { kr:'そのニュース聞きましたか？',           roman:'sono nyuusu kikimashita ka?',                zh:'你听说那个消息了吗？',   en:'Did you hear that news?' },
  { kr:'本当に驚きました',                     roman:'hontou ni odorokimashita',                   zh:'真让我吃惊',             en:'I was really surprised' },
  { kr:'思ったより難しかったです',             roman:'omotta yori muzukashikatta desu',            zh:'比想象中难',             en:'It was harder than expected' },
  { kr:'もう一度考えてみます',                 roman:'mou ichido kangaete mimasu',                 zh:'我再考虑一下',           en:'Let me think about it again' },
  { kr:'私はいいと思います',                   roman:'watashi wa ii to omoimasu',                  zh:'我觉得不错',             en:'I think it would be good' },
  { kr:'それはちょっと難しいと思います',       roman:'sore wa chotto muzukashii to omoimasu',      zh:'那个可能有点难',         en:'That might be difficult' },
  { kr:'時間があれば一緒に行きましょう',       roman:'jikan ga areba issho ni ikimashou',          zh:'有时间的话一起去',       en:'If you have time, let us go together' },
  { kr:'手伝ってもらえますか？',               roman:'tetsudatte moraemasu ka?',                   zh:'能帮我一下吗？',         en:'Could you help me?' },
  { kr:'私が間違っていたようです',             roman:'watashi ga machigatte ita you desu',         zh:'我好像做错了',           en:'I think I made a mistake' },
  { kr:'また今度会いましょう',                 roman:'mata kondo aimashou',                        zh:'下次再见',               en:'See you next time' },
  { kr:'今日はどうでしたか？',                 roman:'kyou wa dou deshita ka?',                    zh:'今天过得怎么样？',       en:'How was your day?' },
  { kr:'最近仕事が多いです',                   roman:'saikin shigoto ga ooi desu',                 zh:'最近工作很多',           en:'I have a lot of work lately' },
  { kr:'ストレスをためないでください',         roman:'sutoresu o tamenaide kudasai',               zh:'别给自己压力',           en:'Do not stress' },
  { kr:'健康が一番大切です',                   roman:'kenkou ga ichiban taisetsu desu',            zh:'健康最重要',             en:'Health is most important' },
  { kr:'ゆっくり休んでください',               roman:'yukkuri yasunde kudasai',                    zh:'好好休息',               en:'Get some rest' },
  { kr:'よくやっていますね',                   roman:'yoku yatte imasu ne',                        zh:'你做得好',               en:'You are doing well' },
  { kr:'もう少し頑張ってください',             roman:'mou sukoshi ganbatte kudasai',               zh:'再坚持一下',             en:'Hang in there a bit more' },
  { kr:'私から連絡します',                     roman:'watashi kara renraku shimasu',               zh:'我会联系您的',           en:'I will contact you' },
  { kr:'約束を忘れないでください',             roman:'yakusoku o wasurenaide kudasai',             zh:'别忘了约定',             en:'Do not forget the appointment' },
  { kr:'何があったのですか？',                 roman:'nani ga atta no desu ka?',                   zh:'发生了什么事？',         en:'What happened?' },
  { kr:'私の話がわかりましたか？',             roman:'watashi no hanashi ga wakarimashita ka?',    zh:'你听懂我说的话了吗？',   en:'Did you understand what I said?' },
  { kr:'もっと詳しく説明してください',         roman:'motto kuwashiku setsumei shite kudasai',     zh:'请更详细地说明',         en:'Please explain in more detail' },
  { kr:'他の意見はありますか？',               roman:'hoka no iken wa arimasu ka?',                zh:'有其他意见吗？',         en:'Any other opinions?' },
  { kr:'賛成です',                             roman:'sansei desu',                                zh:'我同意',                 en:'I agree' },
  { kr:'反対です',                             roman:'hantai desu',                                zh:'我反对',                 en:'I disagree' },
  { kr:'はっきりとはわかりません',             roman:'hakkiri to wa wakarimasen',                  zh:'不太确定',               en:'I am not sure' },
  { kr:'また連絡します',                       roman:'mata renraku shimasu',                       zh:'我再联系您',             en:'I will get back to you' },
  { kr:'前もって教えてください',               roman:'maemotte oshiete kudasai',                   zh:'请提前通知我',           en:'Please let me know in advance' },
  { kr:'いつが空いていますか？',               roman:'itsu ga aite imasu ka?',                     zh:'您什么时候有空？',       en:'When are you free?' },
  { kr:'予約をお手伝いします',                 roman:'yoyaku o otetsudai shimasu',                 zh:'我帮您预订',             en:'I will help you with the reservation' },
  { kr:'問題が発生しました',                   roman:'mondai ga hassei shimashita',                zh:'出问题了',               en:'There is a problem' },
  { kr:'すぐ解決すると思います',               roman:'sugu kaiketsu suru to omoimasu',             zh:'很快会解决的',           en:'It will be solved soon' },
  { kr:'少しお待ちください',                   roman:'sukoshi omachi kudasai',                     zh:'请稍等',                 en:'Please wait a moment' },
  { kr:'もう一度試してみてください',           roman:'mou ichido tameshite mite kudasai',          zh:'请再试一次',             en:'Please try again' },
  { kr:'結局うまくいくと思います',             roman:'kekkyoku umaku iku to omoimasu',             zh:'最终会好的',             en:'It will work out in the end' },
  { kr:'一緒にできて楽しかったです',           roman:'issho ni dekite tanoshikatta desu',           zh:'一起很开心',             en:'It was fun doing it together' }
];

/* ============================================================
   LEVEL 6 — Fluent communication
   ============================================================ */
const L6 = [
  { kr:'日本に来てどのくらいになりますか？',           roman:'nihon ni kite dono kurai ni narimasu ka?',   zh:'来日本多久了？',               en:'How long have you been in Japan?' },
  { kr:'日本の生活に慣れるのは簡単ではありません',     roman:'nihon no seikatsu ni nareru no wa kantan dewa arimasen', zh:'适应日本生活不容易', en:'Adapting to life in Japan is not easy' },
  { kr:'日本語を学ぶのは難しいですが楽しいです',       roman:'nihongo o manabu no wa muzukashii desu ga tanoshii desu', zh:'学日语虽难但很有趣', en:'Learning Japanese is hard but fun' },
  { kr:'毎日少しずつ練習すれば上達します',             roman:'mainichi sukoshi zutsu renshuu sureba joutatsu shimasu', zh:'每天练习一点就会进步', en:'Practice a bit every day and you will improve' },
  { kr:'言語を学ぶ最良の方法は話し続けることです',     roman:'gengo o manabu sairyou no houhou wa hanashitsuzukeru koto desu', zh:'学语言最好的方法就是不停地说', en:'The best way to learn a language is to keep speaking' },
  { kr:'間違えても大丈夫です、それも学びの過程です',   roman:'machigaete mo daijoubu desu, sore mo manabi no katei desu', zh:'犯错也没关系，那也是学习过程', en:'It is okay to make mistakes, that is part of learning' },
  { kr:'最近日本の文化に夢中です',                     roman:'saikin nihon no bunka ni muchuu desu',       zh:'最近迷上了日本文化',           en:'I am really into Japanese culture these days' },
  { kr:'今週末に特別な予定はありますか？',             roman:'konshuumatsu ni tokubetsu na yotei wa arimasu ka?', zh:'这周末有什么特别计划吗？', en:'Any special plans for this weekend?' },
  { kr:'仕事が多すぎて休む時間がありません',           roman:'shigoto ga oosugite yasumu jikan ga arimasen', zh:'工作太多没时间休息',           en:'Too much work, no time to rest' },
  { kr:'健康のために運動を始めました',                 roman:'kenkou no tame ni undou o hajimemashita',     zh:'为了健康开始运动了',           en:'I started exercising for my health' },
  { kr:'料理は初めてですが習いたいです',               roman:'ryouri wa hajimete desu ga naraitai desu',   zh:'虽然第一次做菜但想学',         en:'It is my first time cooking but I want to learn' },
  { kr:'明日の会議資料を準備しなければなりません',     roman:'ashita no kaigi shiryou o junbi shinakereba narimasen', zh:'明天要准备会议资料', en:'I need to prepare meeting materials for tomorrow' },
  { kr:'寒くなってきたので暖かくしてください',         roman:'samuku natte kita node atatakaku shite kudasai', zh:'天气变冷了要多穿点',         en:'It is getting cold so dress warmly' },
  { kr:'この問題についてどう思いますか？',             roman:'kono mondai ni tsuite dou omoimasu ka?',     zh:'你对这个问题怎么看？',         en:'What do you think about this issue?' },
  { kr:'私の意見を言ってもいいですか？',               roman:'watashi no iken o itte mo ii desu ka?',      zh:'我可以发表一下意见吗？',       en:'May I share my opinion?' },
  { kr:'その決定は慎重にすべきだと思います',           roman:'sono kettei wa shinchou ni subeki da to omoimasu', zh:'那个决定要慎重考虑',       en:'That decision should be made carefully' },
  { kr:'他の人の意見も聞いた方がいいと思います',       roman:'hoka no hito no iken mo kiita hou ga ii to omoimasu', zh:'最好也听听别人的意见',   en:'It would be good to hear other opinions too' },
  { kr:'この件は私が責任を持って対応します',           roman:'kono ken wa watashi ga sekinin o motte taiou shimasu', zh:'这件事我会负责处理',   en:'I will take responsibility for this' },
  { kr:'一緒に協力すればもっといい結果が出ます',       roman:'issho ni kyouryoku sureba motto ii kekka ga demasu', zh:'一起合作会有更好的结果', en:'Working together will yield better results' },
  { kr:'最善を尽くしたので後悔はありません',           roman:'saizen o tsukushita node koukai wa arimasen', zh:'尽力了所以没有遗憾',           en:'I did my best so no regrets' },
  { kr:'これからもよろしくお願いします',               roman:'korekara mo yoroshiku onegaishimasu',        zh:'以后也请多关照',               en:'Please continue to support me' },
  { kr:'時間が経てば大丈夫です',                       roman:'jikan ga tateba daijoubu desu',              zh:'随着时间会好起来的',           en:'It will all be okay with time' },
  { kr:'今この瞬間を大切にしましょう',                 roman:'ima kono shunkan o taisetsu ni shimashou',   zh:'珍惜当下',                     en:'Cherish this moment' },
  { kr:'幸せは遠くにあるものではありません',           roman:'shiawase wa tooku ni aru mono dewa arimasen', zh:'幸福并不遥远',                 en:'Happiness is not far away' },
  { kr:'毎日感謝の気持ちで生きています',               roman:'mainichi kansha no kimochi de ikite imasu',  zh:'每天怀着感恩的心生活',         en:'I live with gratitude every day' },
  { kr:'お互いを理解しようとする努力が大切です',       roman:'otagai o rikai shiyou to suru doryoku ga taisetsu desu', zh:'互相努力理解很重要', en:'It is important to try to understand each other' },
  { kr:'問題を解決するには対話が必要です',             roman:'mondai o kaiketsu suru ni wa taiwa ga hitsuyou desu', zh:'要解决问题需要沟通',   en:'Dialogue is needed to solve problems' },
  { kr:'小さなミスで大きな問題が起こることがあります', roman:'chiisana misu de ookina mondai ga okoru koto ga arimasu', zh:'小错误可能导致大问题', en:'Small mistakes can cause big problems' },
  { kr:'この経験から多くを学びました',                 roman:'kono keiken kara ooku o manabimashita',      zh:'通过这次经历学到了很多',       en:'I learned a lot from this experience' },
  { kr:'今後の計画を立ててみました',                   roman:'kongo no keikaku o tatete mimashita',        zh:'制定了未来的计划',             en:'I made plans for the future' },
  { kr:'目標に向かって一歩ずつ進んでいます',           roman:'mokuhyou ni mukatte ippo zutsu susunde imasu', zh:'一步步朝着目标前进',         en:'I am moving toward my goal step by step' },
  { kr:'諦めないでください、必ず達成できます',         roman:'akiramenaide kudasai, kanarazu tassei dekimasu', zh:'别放弃，一定能实现',       en:'Do not give up, you can achieve it' },
  { kr:'今日も良い一日をお過ごしください',             roman:'kyou mo yoi ichinichi o osugoshi kudasai',   zh:'祝你今天也是美好的一天',       en:'Have a great day today' },
  { kr:'お会いできて本当に嬉しかったです',             roman:'oai dekite hontou ni ureshikatta desu',      zh:'见到你真的很高兴',             en:'It was really nice meeting you' },
  { kr:'また機会があればお会いしましょう',             roman:'mata kikai ga areba oai shimashou',          zh:'下次有机会再见',               en:'Hope to see you again when there is a chance' },
  { kr:'いつも応援しています',                         roman:'itsumo ouen shite imasu',                    zh:'一直支持你',                   en:'Always cheering for you' },
  { kr:'一緒にいて心強かったです',                     roman:'issho ni ite kokorozuyokatta desu',          zh:'有你在很安心',                 en:'I felt reassured being with you' },
  { kr:'お互いに良い友達になれたらいいですね',         roman:'otagai ni yoi tomodachi ni naretara ii desu ne', zh:'希望我们成为好朋友',       en:'Hope we become good friends' },
  { kr:'今日の会話は本当に楽しかったです',             roman:'kyou no kaiwa wa hontou ni tanoshikatta desu', zh:'今天的对话真的很愉快',       en:'I really enjoyed our conversation today' },
  { kr:'またお会いできる日を楽しみにしています',       roman:'mata oai dekiru hi o tanoshimi ni shite imasu', zh:'期待再次相见',             en:'Looking forward to seeing you again' }
];

/* ============================================================
   LEVEL META — bilingual
   ============================================================ */
const LEVEL_META = {
  1: {
    icon:'🔤',
    kr:'入門',
    name:'初学者 · Beginner',
    desc:'日语假名：平假名、片假名、浊音。建立发音基础。<br>Japanese kana: hiragana, katakana and voiced sounds. Build your pronunciation foundation.'
  },
  2: {
    icon:'📚',
    kr:'基礎',
    name:'基础词汇 · Basic Vocabulary',
    desc:'动物、数字、天气、颜色、人物、食物、身体、日常物品。全部配图。<br>Animals, numbers, weather, colors, people, food, body, objects. All with pictures.'
  },
  3: {
    icon:'💬',
    kr:'日常',
    name:'日常短句 · Daily Phrases',
    desc:'问候、感谢、道歉、请求等日常交流短语，可以简短回复。<br>Greetings, thanks, apologies and requests — enough to reply briefly.'
  },
  4: {
    icon:'🗣️',
    kr:'会話',
    name:'简短对话 · Short Dialogue',
    desc:'点餐、购物、问路、时间等实用对话表达。<br>Ordering, shopping, directions and time — practical conversation.'
  },
  5: {
    icon:'🎯',
    kr:'高級',
    name:'高级会话 · Advanced Conversation',
    desc:'表达意见、约定、情绪、建议。可以进行较好的日常交流。<br>Opinions, appointments, emotions and suggestions. Comfortable daily talk.'
  },
  6: {
    icon:'👑',
    kr:'流暢',
    name:'流利交流 · Fluent Communication',
    desc:'复杂表达、抽象讨论、人生哲理。达到流利沟通的水平。<br>Complex expression, abstract discussion and life topics. Fluent level.'
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
  progress: JSON.parse(localStorage.getItem('jm_progress') || 'null') || {
    1:{plays:0, best:0}, 2:{plays:0, best:0}, 3:{plays:0, best:0},
    4:{plays:0, best:0}, 5:{plays:0, best:0}, 6:{plays:0, best:0}
  }
};
function saveProgress(){
  localStorage.setItem('jm_progress', JSON.stringify(state.progress));
}

function getPool(level){
  if(level === 1){
    return [
      ...L1_HIRAGANA.map(x => ({ kr:x.kr, sub:'ひ · '+x.roman, roman:x.roman, hint:'Hiragana', group:'hiragana' })),
      ...L1_KATAKANA.map(x => ({ kr:x.kr, sub:'カ · '+x.roman, roman:x.roman, hint:'Katakana', group:'katakana' }))
    ];
  }
  if(level === 2) return L2.slice();
  if(level === 3) return L3.slice();
  if(level === 4) return L4.slice();
  if(level === 5) return L5.slice();
  if(level === 6) return L6.slice();
  return [];
}

/* Level 1 and Level 2 both support image mode (Level 2 has emoji, Level 1 shows kana) */
function getModesForLevel(level){
  if(level === 1 || level === 2) return ['image', 'text', 'listen', 'mix'];
  return ['text', 'listen', 'mix'];
}

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

function buildQuestions(level, mode, count){
  const pool = getPool(level);
  if(pool.length === 0) return [];
  const availableModes = getModesForLevel(level);
  const modes = mode === 'mix' ? availableModes.filter(m => m !== 'mix') : [mode];
  const usedKr = new Set();
  const shuffledPool = shuffle(pool);
  const questions = [];
  let attempt = 0;
  while(questions.length < count && attempt < pool.length * 3){
    const q = shuffledPool[attempt % shuffledPool.length];
    attempt++;
    if(usedKr.has(q.kr)) continue;
    usedKr.add(q.kr);
    const m = modes[Math.floor(Math.random() * modes.length)];
    const wrongs = pickN(pool, 3, q);
    if(wrongs.length < 3) continue;
    questions.push({ mode: m, answer: q, options: shuffle([q, ...wrongs]) });
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
    html += \`
      <div class="level-card" data-level="\${lv}" onclick="selectLevel(\${lv})">
        <div class="lv-head">
          <div>
            <div class="lv-icon">\${meta.icon}</div>
            <div class="lv-title">
              \${meta.name}
              <span class="jp">LV \${lv} · \${meta.kr}</span>
            </div>
          </div>
          <div class="lv-num">LV \${lv}</div>
        </div>
        <div class="lv-desc">\${meta.desc}</div>
        <div class="lv-meta">
          <div class="progress">
            <div class="bar"><div class="bar-fill" style="width:\${p.best}%"></div></div>
            <span class="pct">\${p.best}%</span>
          </div>
          <span>\${t('played')} \${p.plays}</span>
        </div>
      </div>
    \`;
  }
  grid.innerHTML = html;
}

function renderModeSelect(){
  const meta = LEVEL_META[state.level];
  $('modeTitle').innerHTML = \`\${meta.icon} \${meta.name}<span class="jp">LV \${state.level} · \${meta.kr}</span>\`;
  $('modeDesc').innerHTML = meta.desc;

  const grid = $('modeGrid');
  const modes = getModesForLevel(state.level);
  let html = '';

  if(modes.indexOf('image') >= 0){
    html += \`
      <div class="mode-card" onclick="startQuiz('image')">
        <div class="mode-icon">🖼️</div>
        <div class="mode-name">\${t('modeImage')}<span class="jp">絵を見て選ぶ</span></div>
        <div class="mode-desc">\${t('modeImageDesc')}</div>
      </div>
    \`;
  }
  if(modes.indexOf('text') >= 0){
    html += \`
      <div class="mode-card" onclick="startQuiz('text')">
        <div class="mode-icon">📖</div>
        <div class="mode-name">\${t('modeText')}<span class="jp">意味を選ぶ</span></div>
        <div class="mode-desc">\${t('modeTextDesc')}</div>
      </div>
    \`;
  }
  if(modes.indexOf('listen') >= 0){
    html += \`
      <div class="mode-card" onclick="startQuiz('listen')">
        <div class="mode-icon">🔊</div>
        <div class="mode-name">\${t('modeListen')}<span class="jp">聞いて選ぶ</span></div>
        <div class="mode-desc">\${t('modeListenDesc')}</div>
      </div>
    \`;
  }
  if(modes.indexOf('mix') >= 0){
    html += \`
      <div class="mode-card" onclick="startQuiz('mix')">
        <div class="mode-icon">🎲</div>
        <div class="mode-name">\${t('modeMix')}<span class="jp">まとめて挑戦</span></div>
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
  if(confirm(t('quitConfirm'))) goHome();
};

window.selectLevel = function(lv){
  state.level = lv;
  showScreen('screenMode');
  renderModeSelect();
};

window.startQuiz = function(mode){
  state.mode = mode;
  state.questions = buildQuestions(state.level, mode, 10);
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
  $('topStats').innerHTML = \`<div class="stat-chip lvl">LV <span class="num">\${state.level}</span></div>\`;
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
    /* === Image mode === */
    if(state.level === 1){
      /* Level 1: show large kana, choose romanization */
      content.innerHTML = \`
        <div class="q-prompt">Look and choose the sound<br>看图选发音</div>
        <div class="q-text-big">\${q.answer.kr}</div>
      \`;
      answers.className = 'answers cols-2';
      answers.innerHTML = q.options.map((opt, i) => \`
        <button class="ans-btn" data-idx="\${i}">
          <span class="jp">\${opt.roman}</span>
        </button>
      \`).join('');
    } else {
      /* Level 2: show emoji image, choose Japanese */
      content.innerHTML = \`
        <div class="q-prompt">Look and choose the Japanese<br>看图选日语</div>
        <div class="q-image">\${q.answer.img || '📷'}</div>
      \`;
      answers.className = 'answers cols-2';
      answers.innerHTML = q.options.map((opt, i) => \`
        <button class="ans-btn" data-idx="\${i}">
          <span class="jp">\${opt.kr}</span>
          \${opt.roman ? '<span class="sub">' + opt.roman + '</span>' : ''}
        </button>
      \`).join('');
    }
  }
  else if(q.mode === 'text'){
    /* === Text mode: Japanese → meaning (CN + EN) === */
    content.innerHTML = \`
      <div class="q-prompt">What does this mean? · 这是什么意思？</div>
      <div class="q-text-big \${q.answer.kr.length > 8 ? 'small' : ''}">\${q.answer.kr}</div>
      \${q.answer.roman ? '<div class="q-sub">' + q.answer.roman + '</div>' : ''}
    \`;
    answers.className = 'answers cols-2';
    answers.innerHTML = q.options.map((opt, i) => {
      let inner = '';
      if(opt.zh && opt.en){
        inner = \`<span class="ans-text"><span class="zh">\${opt.zh}</span><span class="sep">/</span><span class="en">\${opt.en}</span></span>\`;
      } else if(opt.zh){
        inner = \`<span class="ans-text">\${opt.zh}</span>\`;
      } else if(opt.en){
        inner = \`<span class="ans-text"><span class="en">\${opt.en}</span></span>\`;
      } else {
        inner = \`<span class="jp">\${opt.roman || opt.kr}</span>\`;
      }
      return \`<button class="ans-btn" data-idx="\${i}">\${inner}</button>\`;
    }).join('');
  }
  else if(q.mode === 'listen'){
    /* === Listen mode === */
    content.innerHTML = \`
      <div class="q-prompt">Listen and choose · 听音选字</div>
      <button class="q-speaker" id="speakerBtn">🔊</button>
      <div class="q-speaker-hint">Tap to replay · 点击重播</div>
      <div class="audio-hint" id="audioHint">\${t('noAudio')}</div>
    \`;
    setTimeout(() => speakJapanese(q.answer.kr, true), 300);
    const sp = $('speakerBtn');
    if(sp) sp.addEventListener('click', () => speakJapanese(q.answer.kr, false));
    answers.className = 'answers cols-2';
    answers.innerHTML = q.options.map((opt, i) => \`
      <button class="ans-btn" data-idx="\${i}">
        <span class="jp">\${opt.kr}</span>
      </button>
    \`).join('');
  }

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
    if(q.mode !== 'listen') speakJapanese(q.answer.kr, false);
  } else {
    btn.classList.add('wrong');
    state.wrong++;
    state.combo = 0;
    document.querySelectorAll('.ans-btn').forEach(b => {
      const i = parseInt(b.dataset.idx, 10);
      if(q.options[i].kr === q.answer.kr) b.classList.add('reveal');
    });
    showFeedback(t('wrong'), 'bad');
    sfxWrong();
    speakJapanese(q.answer.kr, false);
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

function showResult(){
  const pct = state.totalQ ? Math.round(state.correct / state.totalQ * 100) : 0;

  const p = state.progress[state.level] || { plays:0, best:0 };
  p.plays++;
  if(pct > p.best) p.best = pct;
  state.progress[state.level] = p;
  saveProgress();

  let icon = '🎉', title, sub;
  if(pct >= 90){ icon = '🏆'; title = t('perfectTitle'); sub = t('perfectSub'); }
  else if(pct >= 70){ icon = '🌟'; title = t('greatTitle'); sub = t('greatSub'); }
  else if(pct >= 50){ icon = '💪'; title = t('goodTitle'); sub = t('goodSub'); }
  else { icon = '📚'; title = t('keepTitle'); sub = t('keepSub'); }

  $('resultWrap').innerHTML = \`
    <div class="result-icon">\${icon}</div>
    <div class="result-title">\${title}</div>
    <div class="result-sub">\${sub}</div>
    <div class="result-grid">
      <div class="res-box">
        <div class="res-label">\${t('score')}</div>
        <div class="res-value gold">\${state.score}</div>
      </div>
      <div class="res-box">
        <div class="res-label">\${t('accuracy')}</div>
        <div class="res-value green">\${pct}%</div>
      </div>
      <div class="res-box">
        <div class="res-label">\${t('maxCombo')}</div>
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
   SPEECH — Japanese
   ============================================================ */
let voices = [];
let jaVoice = null;
function loadVoices(){
  if(!('speechSynthesis' in window)) return;
  voices = speechSynthesis.getVoices() || [];
  jaVoice = voices.find(v => v.lang && v.lang.toLowerCase().indexOf('ja') === 0) || null;
}
if('speechSynthesis' in window){
  loadVoices();
  speechSynthesis.onvoiceschanged = loadVoices;
  setTimeout(loadVoices, 400);
  setTimeout(loadVoices, 1200);
}

function speakJapanese(text, isAuto){
  if(!('speechSynthesis' in window) || !text) return;
  try{
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'ja-JP';
    u.rate = 0.9;
    u.pitch = 1.0;
    if(jaVoice) u.voice = jaVoice;
    speechSynthesis.speak(u);
    const hint = $('audioHint');
    if(hint){
      if(!jaVoice && voices.length > 0) hint.classList.add('on');
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
$('heroDesc').innerHTML = t('heroDesc');
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
    frame.title = 'Japanese Master';
    frame.setAttribute('allow', 'autoplay; fullscreen');
    frame.style.cssText = 'display:block;width:100%;height:100%;min-height:720px;border:0;border-radius:16px;background:#0a0e1a;overflow:hidden;';
    frame.srcdoc = gameHTML;
    wrapper.replaceChildren(frame);
    return frame;
  };
})();
