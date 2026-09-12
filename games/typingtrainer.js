/* TypeVerse · English Typing Trainer with YouTube BGM */
(function () {
  'use strict';

  const gameHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>TypeVerse · Typing Trainer</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0d1117;--panel:#161b24;--panel2:#1c2230;--line:#2a3242;
  --text:#f0f3f9;--muted:#8894a8;
  --accent:#ff6f61;--accent2:#ff9a8b;
  --green:#35d07f;--red:#ff5573;--gold:#ffc857;
  --blue:#4aa3ff;--purple:#b46cff;
}
body{
  background:radial-gradient(circle at 20% 10%,rgba(255,111,97,.10),transparent 32%),
             radial-gradient(circle at 80% 20%,rgba(255,200,87,.06),transparent 32%),
             var(--bg);
  color:var(--text);font-family:'Segoe UI',Arial,sans-serif;
  min-height:100vh;overflow-x:hidden;
}
button{border:0;cursor:pointer;color:white;font-weight:600;font-family:inherit}
input,textarea{font-family:inherit}

.app{display:flex;min-height:100vh}

/* SIDEBAR */
.sidebar{
  width:240px;background:rgba(18,22,30,.97);
  border-right:1px solid var(--line);
  padding:20px 14px;position:fixed;left:0;top:0;bottom:0;overflow-y:auto;
}
.logo{font-size:22px;font-weight:900;margin-bottom:2px;letter-spacing:.5px}
.logo span{color:var(--accent)}
.subtitle{font-size:11px;color:var(--muted);margin-bottom:20px;letter-spacing:.5px}
.player-card{
  background:linear-gradient(135deg,#232c3d,#161b24);
  padding:14px;border-radius:12px;margin-bottom:18px;
  border:1px solid rgba(255,111,97,.15);
}
.stat-mini{
  display:flex;justify-content:space-between;
  font-size:12px;color:var(--muted);margin-bottom:6px;
}
.stat-mini:last-child{margin-bottom:0}
.stat-mini span{color:var(--gold);font-weight:700}
.nav-title{font-size:10px;color:#566073;text-transform:uppercase;letter-spacing:1.2px;margin:16px 8px 6px;font-weight:700}
.nav button{
  width:100%;text-align:left;background:transparent;
  padding:10px 12px;border-radius:9px;margin-bottom:2px;
  color:#b8c2d1;font-size:13px;font-weight:500;transition:.15s;
}
.nav button:hover{background:#1e2431;color:white}
.nav button.active{background:#232b3d;color:white;box-shadow:inset 3px 0 var(--accent)}

/* MAIN */
.main{margin-left:240px;width:calc(100% - 240px);padding:22px 28px}
.topbar{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:18px;flex-wrap:wrap;gap:14px}
.page-title{font-size:24px;font-weight:800;letter-spacing:-.5px}
.page-desc{color:var(--muted);margin-top:4px;font-size:13px}
.lang-switch{display:flex;gap:4px;background:#181d27;padding:3px;border-radius:10px;border:1px solid var(--line)}
.lang-switch button{padding:6px 12px;border-radius:7px;background:transparent;color:#aeb6c5;font-size:12px}
.lang-switch button.active{background:var(--accent);color:white}

/* MUSIC BAR */
.music-bar{
  background:linear-gradient(135deg,#1c2230,#141a23);
  border:1px solid var(--line);border-radius:14px;
  padding:12px 16px;margin-bottom:20px;
  display:flex;align-items:center;gap:12px;flex-wrap:wrap;
}
.music-bar.collapsed .music-body{display:none}
.music-label{
  font-size:11px;color:var(--muted);text-transform:uppercase;
  letter-spacing:.8px;font-weight:700;flex-shrink:0;
}
.music-toggle{
  background:#2a3242;border-radius:8px;padding:6px 10px;
  color:#aeb6c5;font-size:12px;flex-shrink:0;
}
.music-toggle:hover{background:#3a4252;color:white}
.music-body{
  display:flex;align-items:center;gap:10px;flex:1;flex-wrap:wrap;
}
.music-input{
  flex:1;min-width:200px;
  background:#0d1117;border:1px solid var(--line);
  border-radius:9px;padding:9px 12px;
  color:var(--text);font-size:13px;outline:none;
}
.music-input:focus{border-color:var(--accent)}
.music-btn{
  background:linear-gradient(135deg,var(--accent),#cc5545);
  padding:8px 16px;border-radius:9px;font-size:13px;
}
.music-btn.ghost{background:#2a3242}
.music-btn.ghost:hover{background:#3a4252}
.music-btn:active{transform:translateY(1px)}
.music-status{
  font-size:12px;color:var(--muted);padding:0 8px;
  min-width:80px;text-align:center;
}
.music-status.playing{color:var(--green)}
.music-status.paused{color:var(--gold)}
.music-status.error{color:var(--red)}
.volume-wrap{display:flex;align-items:center;gap:6px;flex-shrink:0}
.volume-wrap input{width:80px}
.volume-icon{color:var(--muted);font-size:14px}

/* STATS */
.typing-stats{
  display:grid;grid-template-columns:repeat(4,1fr);
  gap:12px;margin-bottom:20px;
}
.stat-box{
  background:rgba(22,27,36,.92);border:1px solid var(--line);
  border-radius:14px;padding:14px 16px;text-align:center;
}
.stat-box .label{
  font-size:10px;color:var(--muted);text-transform:uppercase;
  letter-spacing:1px;font-weight:700;margin-bottom:6px;
}
.stat-box .value{
  font-size:26px;font-weight:900;letter-spacing:-1px;
  font-variant-numeric:tabular-nums;
}
.stat-box .value.gold{color:var(--gold)}
.stat-box .value.green{color:var(--green)}
.stat-box .value.blue{color:var(--blue)}

/* TEXT DISPLAY */
.text-display-wrap{
  background:#fbf8f0;border-radius:16px;
  padding:28px 32px;margin-bottom:16px;
  min-height:180px;
  box-shadow:inset 0 2px 8px rgba(0,0,0,.05);
  cursor:text;position:relative;
}
.text-display{
  font-family:'Courier New','Consolas',monospace;
  font-size:22px;line-height:1.9;letter-spacing:.5px;
  color:#5a6270;word-break:break-word;
  user-select:none;
}
.text-display .ch{position:relative;transition:color .05s}
.text-display .ch.pending{color:#5a6270}
.text-display .ch.correct{color:#1f9e4a}
.text-display .ch.wrong{color:#d0303a;background:rgba(208,48,58,.12);border-radius:3px}
.text-display .ch.space.wrong{background:rgba(208,48,58,.25)}
.text-display .ch.current::before{
  content:'';position:absolute;
  left:-1px;top:-2px;bottom:-2px;width:2px;
  background:var(--accent);
  animation:blink 1s infinite;
}
@keyframes blink{50%{opacity:.25}}

.hidden-input{
  position:absolute;left:-9999px;
  width:1px;height:1px;opacity:0;
}

/* CONTROLS */
.controls{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px}
.controls button{
  padding:10px 18px;border-radius:10px;font-size:13px;
}
.btn-primary{background:linear-gradient(135deg,var(--accent),#cc5545)}
.btn-secondary{background:#2a3242}
.btn-secondary:hover{background:#3a4252}

/* RESULT */
.result-screen{text-align:center;padding:40px 20px}
.result-icon{font-size:70px;margin-bottom:12px}
.result-title{font-size:28px;font-weight:900;margin-bottom:16px}
.result-stats{
  display:grid;grid-template-columns:repeat(3,1fr);
  gap:14px;max-width:600px;margin:24px auto;
}
.result-stat{
  background:var(--panel2);padding:16px;border-radius:12px;
}
.result-stat .label{
  font-size:10px;color:var(--muted);
  text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;
}
.result-stat .value{
  font-size:28px;font-weight:900;color:var(--gold);
  font-variant-numeric:tabular-nums;
}
.result-actions{
  display:flex;gap:12px;justify-content:center;
  margin-top:24px;flex-wrap:wrap;
}
.result-actions button{
  padding:12px 26px;border-radius:10px;font-size:14px;
}

/* HISTORY */
.card{
  background:rgba(22,27,36,.92);border:1px solid var(--line);
  border-radius:14px;padding:20px;
}
table{width:100%;border-collapse:collapse}
th,td{
  padding:11px 10px;text-align:left;font-size:13px;
  border-bottom:1px solid var(--line);
}
th{
  color:var(--muted);font-size:11px;
  text-transform:uppercase;letter-spacing:.8px;
}
td.num{text-align:right;font-variant-numeric:tabular-nums;font-weight:700}
td.wpm{color:var(--gold)}
td.acc{color:var(--green)}
.empty-state{
  text-align:center;color:var(--muted);
  padding:40px 20px;font-size:14px;
}

/* SETTINGS */
.setting-row{
  display:flex;justify-content:space-between;align-items:center;
  padding:14px 0;border-bottom:1px solid var(--line);
}
.setting-row:last-child{border-bottom:none}
.setting-label{font-size:14px;font-weight:600}
.setting-desc{font-size:12px;color:var(--muted);margin-top:4px}
.switch{
  width:48px;height:26px;border-radius:999px;
  background:#2a3242;position:relative;cursor:pointer;
  transition:.2s;flex-shrink:0;
}
.switch.on{background:var(--green)}
.switch::after{
  content:'';position:absolute;top:3px;left:3px;
  width:20px;height:20px;border-radius:50%;background:white;
  transition:.2s;
}
.switch.on::after{left:25px}

/* CUSTOM INPUT */
.custom-input-area{
  background:var(--panel2);border-radius:12px;
  padding:16px;margin-bottom:16px;
}
.custom-input-area label{
  display:block;font-size:12px;color:var(--muted);
  margin-bottom:8px;font-weight:600;
}
.custom-input-area textarea{
  width:100%;min-height:100px;
  background:#0d1117;border:1px solid var(--line);
  border-radius:9px;padding:12px;
  color:var(--text);font-size:14px;resize:vertical;
  font-family:'Courier New',monospace;outline:none;
}
.custom-input-area textarea:focus{border-color:var(--accent)}

@media(max-width:820px){
  .sidebar{position:relative;width:100%;height:auto;padding:14px}
  .app{display:block}
  .main{margin-left:0;width:100%;padding:16px}
  .player-card{display:none}
  .typing-stats{grid-template-columns:repeat(2,1fr)}
  .result-stats{grid-template-columns:1fr}
  .text-display{font-size:18px}
  .music-bar{padding:10px}
  .music-input{min-width:120px}
}
</style>
</head>
<body>

<div class="app">
<aside class="sidebar">
  <div class="logo">Type<span>Verse</span></div>
  <div class="subtitle">English Typing Trainer</div>

  <div class="player-card">
    <div class="stat-mini"><span>Best WPM</span><strong id="bestWpm">0</strong></div>
    <div class="stat-mini"><span>Best Acc</span><strong id="bestAcc">0%</strong></div>
    <div class="stat-mini"><span>Tests</span><strong id="totalTests">0</strong></div>
  </div>

  <div class="nav">
    <div class="nav-title" id="navTitlePractice">Practice</div>
    <button class="active" data-mode="words">📝 <span id="lblWords">Words</span></button>
    <button data-mode="sentences">💬 <span id="lblSentences">Sentences</span></button>
    <button data-mode="quotes">✨ <span id="lblQuotes">Quotes</span></button>
    <button data-mode="custom">✏️ <span id="lblCustom">Custom</span></button>

    <div class="nav-title" id="navTitleTimed">Timed</div>
    <button data-mode="time30">⏱️ <span id="lblTime30">30s</span></button>
    <button data-mode="time60">⏱️ <span id="lblTime60">60s</span></button>
    <button data-mode="time120">⏱️ <span id="lblTime120">2min</span></button>

    <div class="nav-title" id="navTitleOther">Other</div>
    <button data-page="history">📊 <span id="lblHistory">History</span></button>
    <button data-page="settings">⚙️ <span id="lblSettings">Settings</span></button>
  </div>
</aside>

<main class="main">
  <div id="appContent"></div>
</main>
</div>

<!-- Hidden YouTube host -->
<div id="ytHost" style="position:fixed;bottom:-9999px;left:-9999px;width:1px;height:1px;"></div>

<script>
/* ============ I18N ============ */
let lang = localStorage.getItem('tv_lang') || 'zh';
const I18N = {
  zh: {
    navPractice:'练习', navTimed:'计时挑战', navOther:'其他',
    words:'单词', sentences:'句子', quotes:'名言', custom:'自定义',
    time30:'30 秒', time60:'60 秒', time120:'2 分钟',
    history:'历史成绩', settings:'设置',
    titleWords:'单词练习', descWords:'随机常用英文单词，练习打字速度',
    titleSentences:'句子练习', descSentences:'完整英文句子，练习流畅度',
    titleQuotes:'名言练习', descQuotes:'经典英文名言，练习准确度',
    titleCustom:'自定义文本', descCustom:'输入你自己想练习的文本',
    titleTimed:'计时挑战', descTimed:'在限定时间内尽可能多打字',
    titleHistory:'历史成绩', descHistory:'查看你最近的表现',
    titleSettings:'设置', descSettings:'音乐与偏好设置',
    wpm:'WPM', acc:'准确率', time:'时间', progress:'进度',
    startHint:'开始输入即可计时',
    restart:'重新开始', next:'下一段', changeText:'换一段',
    resultTitle:'测试完成', resultIcon:'🎉',
    yourStats:'你的成绩',
    accuracy:'准确率', correctChars:'正确字符', wrongChars:'错误字符',
    duration:'用时', tryAgain:'再试一次',
    music:'背景音乐', musicUrl:'YouTube 链接或视频 ID',
    musicPlay:'播放', musicPause:'暂停', musicStop:'停止',
    musicHint:'粘贴 YouTube 视频链接（watch 或 youtu.be）或 11 位视频 ID',
    musicNotReady:'播放器加载中...', musicReady:'✓ 就绪',
    musicPlaying:'♪ 播放中', musicPaused:'⏸ 已暂停', musicError:'✗ 加载失败',
    volume:'音量',
    noHistory:'暂无历史记录，去练习一次吧！',
    rank:'等级', date:'日期', mode:'模式',
    bestWpm:'最佳 WPM', bestAcc:'最佳准确率', totalTests:'总测试数',
    resetProgress:'重置所有进度', resetConfirm:'确定要重置吗？',
    saveCustom:'保存并开始', customPlaceholder:'在此粘贴或输入英文文本...',
    collapseMusic:'收起', expandMusic:'展开',
    enableMusic:'启用背景音乐'
  },
  en: {
    navPractice:'Practice', navTimed:'Timed', navOther:'Other',
    words:'Words', sentences:'Sentences', quotes:'Quotes', custom:'Custom',
    time30:'30s', time60:'60s', time120:'2min',
    history:'History', settings:'Settings',
    titleWords:'Words Practice', descWords:'Common English words for speed training',
    titleSentences:'Sentences Practice', descSentences:'Complete sentences for flow training',
    titleQuotes:'Quotes Practice', descQuotes:'Classic English quotes for accuracy',
    titleCustom:'Custom Text', descCustom:'Practice with your own text',
    titleTimed:'Timed Challenge', descTimed:'Type as much as possible in limited time',
    titleHistory:'History', descHistory:'Your recent performance',
    titleSettings:'Settings', descSettings:'Music and preferences',
    wpm:'WPM', acc:'Accuracy', time:'Time', progress:'Progress',
    startHint:'Start typing to begin the timer',
    restart:'Restart', next:'Next', changeText:'Change Text',
    resultTitle:'Test Complete', resultIcon:'🎉',
    yourStats:'Your Results',
    accuracy:'Accuracy', correctChars:'Correct', wrongChars:'Wrong',
    duration:'Duration', tryAgain:'Try Again',
    music:'Background Music', musicUrl:'YouTube URL or Video ID',
    musicPlay:'Play', musicPause:'Pause', musicStop:'Stop',
    musicHint:'Paste a YouTube URL (watch or youtu.be) or 11-char video ID',
    musicNotReady:'Loading player...', musicReady:'✓ Ready',
    musicPlaying:'♪ Playing', musicPaused:'⏸ Paused', musicError:'✗ Load failed',
    volume:'Volume',
    noHistory:'No history yet. Take a test first!',
    rank:'#', date:'Date', mode:'Mode',
    bestWpm:'Best WPM', bestAcc:'Best Acc', totalTests:'Tests',
    resetProgress:'Reset All Progress', resetConfirm:'Are you sure?',
    saveCustom:'Save & Start', customPlaceholder:'Paste or type English text here...',
    collapseMusic:'Collapse', expandMusic:'Expand',
    enableMusic:'Enable Background Music'
  }
};
function t(k){ return I18N[lang][k] || I18N.en[k] || k; }

/* ============ WORD/SENTENCE DATA ============ */
const WORDS = 'the be to of and a in that have I it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us is are was were been has had said each she which do their time if will way about many then them these so some her would make like into him has two more very what know just first also new because day two how our work first well way even new want because any these give day most us'.split(' ').filter((v,i,a)=>a.indexOf(v)===i);

const SENTENCES = [
  'The quick brown fox jumps over the lazy dog.',
  'Pack my box with five dozen liquor jugs.',
  'How vexingly quick daft zebras jump!',
  'Sphinx of black quartz, judge my vow.',
  'The five boxing wizards jump quickly.',
  'Bright vixens jump; dozy fowl quack.',
  'Jackdaws love my big sphinx of quartz.',
  'Waltz, bad nymph, for quick jigs vex.',
  'A very bad quack might jinx zippy fowls.',
  'Two driven jocks help fax my big quiz.',
  'Practice makes perfect when you train every day.',
  'Technology is best when it brings people together.',
  'The journey of a thousand miles begins with one step.',
  'Success is the sum of small efforts repeated daily.',
  'Every expert was once a beginner who never gave up.',
  'The best time to plant a tree was twenty years ago.',
  'Code is like humor. When you have to explain it, it is bad.',
  'Simplicity is the ultimate sophistication in design.',
  'Imagination is more important than knowledge alone.',
  'Stay hungry, stay foolish, and keep learning forever.'
];

const QUOTES = [
  'The only way to do great work is to love what you do.',
  'Innovation distinguishes between a leader and a follower.',
  'Stay hungry, stay foolish.',
  'Your time is limited, so do not waste it living someone else life.',
  'The people who are crazy enough to think they can change the world are the ones who do.',
  'Talk is cheap. Show me the code.',
  'Programs must be written for people to read, and only incidentally for machines to execute.',
  'Premature optimization is the root of all evil.',
  'Simplicity is prerequisite for reliability.',
  'Make it work, make it right, make it fast.',
  'First, solve the problem. Then, write the code.',
  'The best error message is the one that never shows up.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Walking on water and developing software from a specification are easy if both are frozen.',
  'There are only two hard things in computer science: cache invalidation and naming things.',
  'It always seems impossible until it is done.',
  'Believe you can and you are halfway there.',
  'The future belongs to those who believe in the beauty of their dreams.',
  'Do not watch the clock. Do what it does. Keep going.',
  'Quality is not an act, it is a habit.'
];

/* ============ STATE ============ */
let state = {
  mode: 'words',
  text: '',
  typed: '',
  running: false,
  startTime: 0,
  timerId: null,
  finished: false,
  customText: localStorage.getItem('tv_custom') || ''
};

let playerData = JSON.parse(localStorage.getItem('tv_player') || 'null') || {
  bestWpm: 0,
  bestAcc: 0,
  totalTests: 0,
  history: []
};

let musicConfig = JSON.parse(localStorage.getItem('tv_music') || 'null') || {
  videoId: '',
  volume: 60,
  enabled: false,
  collapsed: false
};

function savePlayer(){
  localStorage.setItem('tv_player', JSON.stringify(playerData));
  updatePlayerUI();
}
function saveMusic(){
  localStorage.setItem('tv_music', JSON.stringify(musicConfig));
}
function updatePlayerUI(){
  const bw = document.getElementById('bestWpm');
  const ba = document.getElementById('bestAcc');
  const tt = document.getElementById('totalTests');
  if(bw) bw.textContent = playerData.bestWpm;
  if(ba) ba.textContent = playerData.bestAcc + '%';
  if(tt) tt.textContent = playerData.totalTests;
}

/* ============ PAGE NAV ============ */
let currentPage = 'typing';

document.querySelectorAll('.nav button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    if(btn.dataset.mode){
      currentPage = 'typing';
      state.mode = btn.dataset.mode;
      startNewTest();
    } else if(btn.dataset.page){
      currentPage = btn.dataset.page;
      if(btn.dataset.page === 'history') renderHistory();
      else if(btn.dataset.page === 'settings') renderSettings();
    }
  });
});

function applyLabels(){
  const set = (id, txt) => { const el = document.getElementById(id); if(el) el.textContent = txt; };
  set('navTitlePractice', t('navPractice'));
  set('navTitleTimed', t('navTimed'));
  set('navTitleOther', t('navOther'));
  set('lblWords', t('words'));
  set('lblSentences', t('sentences'));
  set('lblQuotes', t('quotes'));
  set('lblCustom', t('custom'));
  set('lblTime30', t('time30'));
  set('lblTime60', t('time60'));
  set('lblTime120', t('time120'));
  set('lblHistory', t('history'));
  set('lblSettings', t('settings'));
}

/* ============ TEST GENERATION ============ */
function generateWordsText(count){
  const arr = [];
  for(let i = 0; i < count; i++){
    arr.push(WORDS[Math.floor(Math.random() * WORDS.length)]);
  }
  return arr.join(' ');
}

function generateFromPool(pool){
  return pool[Math.floor(Math.random() * pool.length)];
}

function getTextForMode(mode){
  if(mode === 'words') return generateWordsText(25);
  if(mode === 'sentences') return generateFromPool(SENTENCES);
  if(mode === 'quotes') return generateFromPool(QUOTES);
  if(mode === 'custom') return state.customText || generateWordsText(25);
  if(mode === 'time30' || mode === 'time60' || mode === 'time120') {
    return generateWordsText(80);
  }
  return generateWordsText(25);
}

function getTimeLimit(mode){
  if(mode === 'time30') return 30;
  if(mode === 'time60') return 60;
  if(mode === 'time120') return 120;
  return 0;
}

/* ============ TYPING PAGE ============ */
function renderTypingPage(){
  const modeTitle = {
    words: t('titleWords'), sentences: t('titleSentences'),
    quotes: t('titleQuotes'), custom: t('titleCustom'),
    time30: t('titleTimed') + ' · ' + t('time30'),
    time60: t('titleTimed') + ' · ' + t('time60'),
    time120: t('titleTimed') + ' · ' + t('time120')
  }[state.mode] || t('titleWords');

  const modeDesc = {
    words: t('descWords'), sentences: t('descSentences'),
    quotes: t('descQuotes'), custom: t('descCustom'),
    time30: t('descTimed'), time60: t('descTimed'), time120: t('descTimed')
  }[state.mode] || '';

  document.getElementById('appContent').innerHTML = \`
    <div class="topbar">
      <div>
        <div class="page-title">\${modeTitle}</div>
        <div class="page-desc">\${modeDesc}</div>
      </div>
      <div class="lang-switch">
        <button class="\${lang==='en'?'active':''}" onclick="setLang('en')">EN</button>
        <button class="\${lang==='zh'?'active':''}" onclick="setLang('zh')">中文</button>
      </div>
    </div>

    \${renderMusicBarHTML()}

    <div class="typing-stats">
      <div class="stat-box"><div class="label">\${t('wpm')}</div><div class="value gold" id="statWpm">0</div></div>
      <div class="stat-box"><div class="label">\${t('acc')}</div><div class="value green" id="statAcc">100%</div></div>
      <div class="stat-box"><div class="label">\${t('time')}</div><div class="value blue" id="statTime">0.0</div></div>
      <div class="stat-box"><div class="label">\${t('progress')}</div><div class="value" id="statProg">0%</div></div>
    </div>

    <div class="text-display-wrap" id="textWrap">
      <div class="text-display" id="textDisplay"></div>
      <textarea class="hidden-input" id="hiddenInput" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"></textarea>
    </div>

    <div class="controls">
      <button class="btn-secondary" onclick="restartTest()">🔄 \${t('restart')}</button>
      <button class="btn-secondary" onclick="changeText()">🔀 \${t('changeText')}</button>
    </div>
  \`;

  if(state.mode === 'custom'){
    document.getElementById('appContent').insertAdjacentHTML('afterbegin',
      \`<div class="custom-input-area">
        <label>\${t('customPlaceholder')}</label>
        <textarea id="customTextArea" placeholder="\${t('customPlaceholder')}">\${escapeHtml(state.customText)}</textarea>
        <div style="margin-top:10px"><button class="btn-primary" onclick="saveCustomText()">\${t('saveCustom')}</button></div>
      </div>\`
    );
  }

  bindMusicBarEvents();
  startNewTest();
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function saveCustomText(){
  const ta = document.getElementById('customTextArea');
  if(!ta) return;
  const v = ta.value.trim();
  if(!v){ alert('Please enter some text'); return; }
  state.customText = v;
  localStorage.setItem('tv_custom', v);
  startNewTest();
}

/* ============ MUSIC BAR ============ */
function renderMusicBarHTML(){
  const cls = musicConfig.collapsed ? 'collapsed' : '';
  return \`
    <div class="music-bar \${cls}" id="musicBar">
      <div class="music-label">🎵 \${t('music')}</div>
      <button class="music-toggle" onclick="toggleMusicBar()">
        \${musicConfig.collapsed ? '▼ ' + t('expandMusic') : '▲ ' + t('collapseMusic')}
      </button>
      <div class="music-body">
        <input class="music-input" id="musicInput" type="text" placeholder="\${t('musicHint')}" value="\${musicConfig.videoId}" />
        <button class="music-btn" onclick="loadMusic()">\${t('musicPlay')}</button>
        <button class="music-btn ghost" onclick="togglePlayPause()" id="pauseBtn">⏸</button>
        <button class="music-btn ghost" onclick="stopMusic()">⏹</button>
        <div class="music-status" id="musicStatus">\${t('musicNotReady')}</div>
        <div class="volume-wrap">
          <span class="volume-icon">🔊</span>
          <input type="range" min="0" max="100" id="volumeRange" value="\${musicConfig.volume}">
        </div>
      </div>
    </div>
  \`;
}

function bindMusicBarEvents(){
  const vol = document.getElementById('volumeRange');
  if(vol){
    vol.addEventListener('input', e => {
      musicConfig.volume = parseInt(e.target.value, 10);
      if(ytPlayer && ytPlayer.setVolume){
        ytPlayer.setVolume(musicConfig.volume);
      }
      saveMusic();
    });
  }
}

function toggleMusicBar(){
  musicConfig.collapsed = !musicConfig.collapsed;
  saveMusic();
  const bar = document.getElementById('musicBar');
  if(bar) bar.classList.toggle('collapsed', musicConfig.collapsed);
  const btn = bar ? bar.querySelector('.music-toggle') : null;
  if(btn) btn.textContent = musicConfig.collapsed ? '▼ ' + t('expandMusic') : '▲ ' + t('collapseMusic');
}

/* ============ YOUTUBE ============ */
let ytPlayer = null;
let ytReady = false;
let pendingVideoId = null;

function loadYTApi(){
  if(window.YT && window.YT.Player) return;
  if(document.getElementById('yt-api-script')) return;
  const tag = document.createElement('script');
  tag.id = 'yt-api-script';
  tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
}

window.onYouTubeIframeAPIReady = function(){
  ytReady = true;
  if(pendingVideoId){
    createYTPlayer(pendingVideoId);
    pendingVideoId = null;
  }
};

function extractVideoId(urlOrId){
  if(!urlOrId) return null;
  urlOrId = urlOrId.trim();
  const patterns = [
    /youtu\\.be\\/([A-Za-z0-9_-]{11})/,
    /youtube\\.com\\/watch\\?[^\\s]*v=([A-Za-z0-9_-]{11})/,
    /youtube\\.com\\/embed\\/([A-Za-z0-9_-]{11})/,
    /youtube\\.com\\/shorts\\/([A-Za-z0-9_-]{11})/,
    /^([A-Za-z0-9_-]{11})$/
  ];
  for(const p of patterns){
    const m = urlOrId.match(p);
    if(m) return m[1];
  }
  return null;
}

function createYTPlayer(videoId){
  const status = document.getElementById('musicStatus');
  if(!ytReady){
    pendingVideoId = videoId;
    if(status) status.textContent = t('musicNotReady');
    return;
  }
  if(ytPlayer && ytPlayer.loadVideoById){
    ytPlayer.loadVideoById(videoId);
    ytPlayer.setVolume(musicConfig.volume);
    if(status){ status.textContent = t('musicPlaying'); status.className = 'music-status playing'; }
    return;
  }
  try{
    ytPlayer = new YT.Player('ytHost', {
      height: '1',
      width: '1',
      videoId: videoId,
      playerVars: {
        autoplay: 1,
        controls: 0,
        disablekb: 1,
        modestbranding: 1,
        rel: 0,
        playsinline: 1
      },
      events: {
        onReady: function(e){
          e.target.setVolume(musicConfig.volume);
          e.target.playVideo();
          if(status){ status.textContent = t('musicPlaying'); status.className = 'music-status playing'; }
        },
        onStateChange: function(e){
          const st = document.getElementById('musicStatus');
          if(!st) return;
          if(e.data === 1){ st.textContent = t('musicPlaying'); st.className = 'music-status playing'; }
          else if(e.data === 2){ st.textContent = t('musicPaused'); st.className = 'music-status paused'; }
          else if(e.data === 0){ st.textContent = t('musicReady'); st.className = 'music-status'; }
        },
        onError: function(e){
          const st = document.getElementById('musicStatus');
          if(st){ st.textContent = t('musicError') + ' (' + e.data + ')'; st.className = 'music-status error'; }
        }
      }
    });
  }catch(err){
    if(status){ status.textContent = t('musicError'); status.className = 'music-status error'; }
  }
}

function loadMusic(){
  const input = document.getElementById('musicInput');
  if(!input) return;
  const raw = input.value.trim();
  if(!raw){ alert(t('musicHint')); return; }
  const vid = extractVideoId(raw);
  if(!vid){ alert(t('musicError') + ' — ' + t('musicHint')); return; }
  musicConfig.videoId = raw;
  musicConfig.enabled = true;
  saveMusic();
  loadYTApi();
  createYTPlayer(vid);
}

function togglePlayPause(){
  if(!ytPlayer || !ytPlayer.getPlayerState) return;
  const s = ytPlayer.getPlayerState();
  if(s === 1) ytPlayer.pauseVideo();
  else ytPlayer.playVideo();
}

function stopMusic(){
  if(!ytPlayer || !ytPlayer.stopVideo) return;
  ytPlayer.stopVideo();
  const st = document.getElementById('musicStatus');
  if(st){ st.textContent = t('musicReady'); st.className = 'music-status'; }
}

/* ============ TEST ENGINE ============ */
function startNewTest(){
  // regenerate text
  state.text = getTextForMode(state.mode);
  state.typed = '';
  state.running = false;
  state.finished = false;
  state.startTime = 0;
  stopTimer();
  renderText();
  updateStats();
  const inp = document.getElementById('hiddenInput');
  if(inp){
    inp.value = '';
    inp.focus();
    if(!inp.dataset.bound){
      inp.dataset.bound = '1';
      inp.addEventListener('input', onInput);
      inp.addEventListener('keydown', onKeyDown);
    }
  }
  const wrap = document.getElementById('textWrap');
  if(wrap && !wrap.dataset.bound){
    wrap.dataset.bound = '1';
    wrap.addEventListener('click', () => {
      const i = document.getElementById('hiddenInput');
      if(i) i.focus();
    });
  }
}

function changeText(){
  startNewTest();
}
function restartTest(){
  startNewTest();
}

function stopTimer(){
  if(state.timerId){
    clearInterval(state.timerId);
    state.timerId = null;
  }
}

function startTimer(){
  if(state.running) return;
  state.running = true;
  state.startTime = Date.now();
  state.timerId = setInterval(() => {
    updateStats();
    const limit = getTimeLimit(state.mode);
    if(limit > 0){
      const elapsed = (Date.now() - state.startTime) / 1000;
      if(elapsed >= limit) finishTest();
    }
  }, 100);
}

function onKeyDown(e){
  if(e.key === 'Escape'){
    startNewTest();
  }
}

function onInput(e){
  const inp = e.target;
  let v = inp.value;
  // Never allow more than text length
  if(v.length > state.text.length) v = v.slice(0, state.text.length);
  state.typed = v;

  if(!state.running && v.length > 0 && !state.finished){
    startTimer();
  }

  renderText();
  updateStats();

  // Finished if typed all characters
  if(v.length >= state.text.length){
    finishTest();
    return;
  }

  // Also finish if user typed a wrong char at current position? No - allow correction
}

function renderText(){
  const disp = document.getElementById('textDisplay');
  if(!disp) return;
  const txt = state.text;
  const typed = state.typed;
  let html = '';
  for(let i = 0; i < txt.length; i++){
    const ch = txt[i];
    let cls = 'ch';
    if(ch === ' ') cls += ' space';
    if(i < typed.length){
      if(typed[i] === ch) cls += ' correct';
      else cls += ' wrong';
    } else if(i === typed.length){
      cls += ' current';
    } else {
      cls += ' pending';
    }
    const display = ch === ' ' ? '&nbsp;' : (ch === '<' ? '&lt;' : ch === '>' ? '&gt;' : ch === '&' ? '&amp;' : ch);
    html += '<span class="' + cls + '">' + display + '</span>';
  }
  disp.innerHTML = html;
}

function computeStats(){
  const typed = state.typed;
  const text = state.text;
  let correct = 0, wrong = 0;
  for(let i = 0; i < typed.length; i++){
    if(typed[i] === text[i]) correct++;
    else wrong++;
  }
  const elapsedSec = state.running ? (Date.now() - state.startTime) / 1000 : 0;
  const minutes = elapsedSec / 60;
  const wpm = minutes > 0 ? Math.round((correct / 5) / minutes) : 0;
  const acc = typed.length > 0 ? Math.round(correct / typed.length * 100) : 100;
  const prog = text.length > 0 ? Math.round(typed.length / text.length * 100) : 0;
  return { correct, wrong, elapsedSec, wpm, acc, prog };
}

function updateStats(){
  const s = computeStats();
  const wpm = document.getElementById('statWpm');
  const acc = document.getElementById('statAcc');
  const tm = document.getElementById('statTime');
  const pg = document.getElementById('statProg');
  if(wpm) wpm.textContent = s.wpm;
  if(acc) acc.textContent = s.acc + '%';
  if(tm) tm.textContent = s.elapsedSec.toFixed(1);
  if(pg) pg.textContent = s.prog + '%';
}

function finishTest(){
  if(state.finished) return;
  state.finished = true;
  stopTimer();
  state.running = false;
  const s = computeStats();

  // Save to player data
  playerData.totalTests++;
  if(s.wpm > playerData.bestWpm) playerData.bestWpm = s.wpm;
  if(s.acc > playerData.bestAcc && s.correct > 5) playerData.bestAcc = s.acc;
  playerData.history.unshift({
    date: Date.now(),
    mode: state.mode,
    wpm: s.wpm,
    acc: s.acc,
    correct: s.correct,
    wrong: s.wrong,
    duration: Math.round(s.elapsedSec)
  });
  if(playerData.history.length > 100) playerData.history.pop();
  savePlayer();

  renderResult(s);
}

function renderResult(s){
  const accent = s.acc >= 95 ? 'var(--green)' : s.acc >= 85 ? 'var(--gold)' : 'var(--red)';
  document.getElementById('appContent').innerHTML = \`
    <div class="result-screen">
      <div class="result-icon">🎉</div>
      <div class="result-title">\${t('resultTitle')}</div>
      <div class="result-stats">
        <div class="result-stat">
          <div class="label">\${t('wpm')}</div>
          <div class="value">\${s.wpm}</div>
        </div>
        <div class="result-stat">
          <div class="label">\${t('accuracy')}</div>
          <div class="value" style="color:\${accent}">\${s.acc}%</div>
        </div>
        <div class="result-stat">
          <div class="label">\${t('duration')}</div>
          <div class="value" style="color:var(--blue)">\${s.elapsedSec.toFixed(1)}s</div>
        </div>
      </div>
      <div style="color:var(--muted);font-size:14px;margin-top:8px">
        \${t('correctChars')}: <strong style="color:var(--green)">\${s.correct}</strong>
        · \${t('wrongChars')}: <strong style="color:var(--red)">\${s.wrong}</strong>
      </div>
      <div class="result-actions">
        <button class="btn-secondary" onclick="renderTypingPage()">\${t('tryAgain')}</button>
        <button class="btn-primary" onclick="renderHistory(); document.querySelectorAll('.nav button').forEach(b=>b.classList.remove('active'))">\${t('history')}</button>
      </div>
    </div>
  \`;
}

/* ============ HISTORY ============ */
function renderHistory(){
  currentPage = 'history';
  const h = playerData.history;
  let rows = '';
  if(h.length === 0){
    rows = '<tr><td colspan="6" class="empty-state">' + t('noHistory') + '</td></tr>';
  } else {
    h.slice(0, 30).forEach((r, i) => {
      const d = new Date(r.date);
      const dateStr = d.toLocaleDateString() + ' ' + d.toLocaleTimeString().slice(0, 5);
      const modeLabel = {
        words: t('words'), sentences: t('sentences'), quotes: t('quotes'),
        custom: t('custom'), time30: t('time30'), time60: t('time60'), time120: t('time120')
      }[r.mode] || r.mode;
      rows += \`
        <tr>
          <td>\${i + 1}</td>
          <td>\${dateStr}</td>
          <td>\${modeLabel}</td>
          <td class="num wpm">\${r.wpm}</td>
          <td class="num acc">\${r.acc}%</td>
          <td class="num">\${r.duration}s</td>
        </tr>
      \`;
    });
  }

  document.getElementById('appContent').innerHTML = \`
    <div class="topbar">
      <div>
        <div class="page-title">📊 \${t('titleHistory')}</div>
        <div class="page-desc">\${t('descHistory')}</div>
      </div>
      <div class="lang-switch">
        <button class="\${lang==='en'?'active':''}" onclick="setLang('en')">EN</button>
        <button class="\${lang==='zh'?'active':''}" onclick="setLang('zh')">中文</button>
      </div>
    </div>
    <div class="card">
      <table>
        <thead>
          <tr>
            <th>\${t('rank')}</th>
            <th>\${t('date')}</th>
            <th>\${t('mode')}</th>
            <th style="text-align:right">WPM</th>
            <th style="text-align:right">ACC</th>
            <th style="text-align:right">TIME</th>
          </tr>
        </thead>
        <tbody>\${rows}</tbody>
      </table>
    </div>
  \`;
}

/* ============ SETTINGS ============ */
function renderSettings(){
  currentPage = 'settings';
  document.getElementById('appContent').innerHTML = \`
    <div class="topbar">
      <div>
        <div class="page-title">⚙️ \${t('titleSettings')}</div>
        <div class="page-desc">\${t('descSettings')}</div>
      </div>
      <div class="lang-switch">
        <button class="\${lang==='en'?'active':''}" onclick="setLang('en')">EN</button>
        <button class="\${lang==='zh'?'active':''}" onclick="setLang('zh')">中文</button>
      </div>
    </div>
    <div class="card">
      <div class="setting-row">
        <div>
          <div class="setting-label">🎵 \${t('enableMusic')}</div>
          <div class="setting-desc">\${t('musicHint')}</div>
        </div>
        <div class="switch \${musicConfig.enabled?'on':''}" onclick="toggleMusicEnabled(this)"></div>
      </div>
      <div class="setting-row">
        <div>
          <div class="setting-label">🔄 \${t('resetProgress')}</div>
          <div class="setting-desc">\${t('resetConfirm')}</div>
        </div>
        <button class="btn-secondary" style="padding:10px 18px;border-radius:9px" onclick="doReset()">Reset</button>
      </div>
    </div>
  \`;
}

function toggleMusicEnabled(el){
  musicConfig.enabled = !musicConfig.enabled;
  el.classList.toggle('on', musicConfig.enabled);
  saveMusic();
}

function doReset(){
  if(confirm(t('resetConfirm'))){
    playerData = { bestWpm: 0, bestAcc: 0, totalTests: 0, history: [] };
    savePlayer();
    alert('✓ ' + (lang==='zh'?'已重置':'Reset'));
  }
}

/* ============ LANGUAGE ============ */
function setLang(l){
  lang = l;
  localStorage.setItem('tv_lang', l);
  applyLabels();
  if(currentPage === 'typing') renderTypingPage();
  else if(currentPage === 'history') renderHistory();
  else if(currentPage === 'settings') renderSettings();
}

/* ============ INIT ============ */
applyLabels();
updatePlayerUI();
renderTypingPage();

// Pre-load YouTube API so it is ready when user pastes link
loadYTApi();

// Auto-restore music if it was enabled
if(musicConfig.enabled && musicConfig.videoId){
  setTimeout(() => {
    const input = document.getElementById('musicInput');
    if(input) input.value = musicConfig.videoId;
    loadMusic();
  }, 500);
}

// Global handlers
window.setLang = setLang;
window.loadMusic = loadMusic;
window.togglePlayPause = togglePlayPause;
window.stopMusic = stopMusic;
window.toggleMusicBar = toggleMusicBar;
window.saveCustomText = saveCustomText;
window.restartTest = restartTest;
window.changeText = changeText;
window.renderTypingPage = renderTypingPage;
window.renderHistory = renderHistory;
window.renderSettings = renderSettings;
window.toggleMusicEnabled = toggleMusicEnabled;
window.doReset = doReset;

<\/script>
</body>
</html>`;

  window.initGame = function initGame(wrapper) {
    if (!wrapper || typeof wrapper.replaceChildren !== 'function') {
      throw new Error('initGame requires a container element.');
    }
    var frame = document.createElement('iframe');
    frame.title = 'TypeVerse · Typing Trainer';
    frame.setAttribute('allow', 'autoplay; encrypted-media; fullscreen; picture-in-picture');
    frame.setAttribute('allowfullscreen', 'true');
    frame.style.cssText = 'display:block;width:100%;height:100%;min-height:760px;border:0;border-radius:16px;background:#0d1117;overflow:hidden;';
    frame.srcdoc = gameHTML;
    wrapper.replaceChildren(frame);
    return frame;
  };
})();
