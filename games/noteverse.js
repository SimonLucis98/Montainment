/* NoteVerse · Music Staff Master v2 — JS Wrapper */
(function () {
  'use strict';

  const gameHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>NoteVerse · Music Staff Master</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#0d1117; --panel:#161b24; --panel2:#1c2230; --line:#2a3242;
  --text:#f0f3f9; --muted:#8894a8; --accent:#7c5cff; --accent2:#00d4ff;
  --green:#35d07f; --red:#ff5573; --gold:#ffc857; --blue:#4aa3ff; --purple:#b46cff;
}
body{
  background:
    radial-gradient(circle at 15% 10%,rgba(124,92,255,.12),transparent 32%),
    radial-gradient(circle at 85% 15%,rgba(0,212,255,.08),transparent 32%),
    var(--bg);
  color:var(--text); font-family:'Segoe UI',Arial,sans-serif;
  min-height:100vh; overflow-x:hidden;
}
button{border:0;cursor:pointer;color:white;font-weight:600;font-family:inherit}
button:disabled{opacity:.4;cursor:not-allowed}
.app{display:flex;min-height:100vh}

/* SIDEBAR */
.sidebar{
  width:250px; background:rgba(18,22,30,.97);
  border-right:1px solid var(--line);
  padding:20px 14px; position:fixed; left:0; top:0; bottom:0; overflow-y:auto;
}
.logo{font-size:22px;font-weight:900;margin-bottom:2px;letter-spacing:.5px}
.logo span{color:var(--accent)}
.subtitle{font-size:11px;color:var(--muted);margin-bottom:20px;letter-spacing:.5px}
.player-card{
  background:linear-gradient(135deg,#232c3d,#161b24);
  padding:14px;border-radius:12px;margin-bottom:18px;
  border:1px solid rgba(124,92,255,.15);
}
.player-row{display:flex;justify-content:space-between;align-items:center}
.player-row strong{font-size:14px}
.rank{color:var(--gold);font-size:12px;font-weight:700}
.level-line{font-size:11px;color:var(--muted);margin-top:6px}
.xpbar{height:6px;background:#2a3242;border-radius:10px;margin-top:9px;overflow:hidden}
.xpfill{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));transition:width .4s}
.nav-title{font-size:10px;color:#566073;text-transform:uppercase;letter-spacing:1.2px;margin:16px 8px 6px;font-weight:700}
.nav button{
  width:100%;text-align:left;background:transparent;
  padding:10px 12px;border-radius:9px;margin-bottom:2px;
  color:#b8c2d1;font-size:13px;font-weight:500;transition:.15s;
}
.nav button:hover{background:#1e2431;color:white}
.nav button.active{background:#232b3d;color:white;box-shadow:inset 3px 0 var(--accent)}

/* MAIN */
.main{margin-left:250px;width:calc(100% - 250px);padding:26px 32px}
.topbar{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;flex-wrap:wrap;gap:14px}
.page-title{font-size:26px;font-weight:800;letter-spacing:-.5px}
.page-desc{color:var(--muted);margin-top:4px;font-size:14px}
.lang-switch{display:flex;gap:4px;background:#181d27;padding:3px;border-radius:10px;border:1px solid var(--line)}
.lang-switch button{padding:6px 12px;border-radius:7px;background:transparent;color:#aeb6c5;font-size:12px}
.lang-switch button.active{background:var(--accent);color:white}

/* CARDS */
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px}
.card{
  background:rgba(22,27,36,.92);border:1px solid var(--line);
  border-radius:14px;padding:18px;
}
.stat-num{font-size:28px;font-weight:900;margin-top:4px;letter-spacing:-1px}
.stat-label{color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.8px;font-weight:600}
.section{margin-top:26px}
.section-title{font-size:17px;font-weight:800;margin-bottom:12px;letter-spacing:-.3px}

/* LESSON CARDS */
.lesson-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}
.lesson{
  background:linear-gradient(145deg,#1c2230,#141a23);
  border:1px solid var(--line);padding:16px;border-radius:14px;
  transition:.2s;position:relative;
}
.lesson:hover{transform:translateY(-2px);border-color:#3d4a60}
.lesson.locked{opacity:.45}
.lesson-icon{font-size:30px;margin-bottom:8px}
.lesson h3{font-size:15px;margin-bottom:5px;font-weight:700}
.lesson p{color:var(--muted);font-size:12px;line-height:1.5;min-height:34px;margin-bottom:10px}
.lesson-meta{display:flex;justify-content:space-between;align-items:center;font-size:11px;color:var(--muted);margin-bottom:9px}
.lesson button.primary{
  background:linear-gradient(135deg,var(--accent),#6242dd);
  padding:8px 14px;border-radius:8px;font-size:12px;
  width:100%;transition:.15s;
}
.lesson button.primary:hover{filter:brightness(1.15)}

/* 五线谱 CANVAS */
.staff-wrap{
  background:#fbf8f0;
  border-radius:14px;
  padding:16px;
  display:flex;
  justify-content:center;
  overflow:hidden;
  position:relative;
}
canvas.staff-canvas{
  display:block;
  max-width:100%;
  height:auto;
  background:transparent;
}

/* PRACTICE/GAME */
.game-wrap{max-width:820px;margin:0 auto}
.game-header{
  display:flex;justify-content:space-between;align-items:center;
  margin-bottom:18px;flex-wrap:wrap;gap:12px;
}
.timer-box{
  background:#1c2230;border:1px solid var(--line);border-radius:10px;
  padding:8px 16px;font-weight:700;font-size:18px;font-variant-numeric:tabular-nums;
}
.timer-box.warn{color:var(--red);animation:pulse 1s infinite}
@keyframes pulse{50%{opacity:.6}}
.score-box{
  background:#1c2230;border:1px solid var(--line);border-radius:10px;
  padding:8px 16px;font-weight:700;color:var(--gold);font-size:16px;
}
.question{
  text-align:center;font-size:19px;font-weight:600;
  margin:20px 0;color:#e2e8f2;
}
.answers{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}
.answer{
  background:#242b3a;border:2px solid #394153;
  padding:14px 10px;border-radius:11px;font-size:16px;font-weight:700;
  transition:.15s;position:relative;
}
.answer:hover:not(:disabled){border-color:var(--accent);background:#2b3242}
.answer.correct{background:#16442f;border-color:var(--green);color:#a8ffd0}
.answer.wrong{background:#4a1c28;border-color:var(--red);color:#ffc4d0}

/* RANGE BADGE */
.range-badge{
  display:inline-block;padding:5px 14px;border-radius:20px;
  font-size:13px;font-weight:700;margin:4px;
}
.range-low{background:#2a4a6a;color:#a8d4ff}
.range-mid{background:#3a2a6a;color:#d4b8ff}
.range-high{background:#6a2a4a;color:#ffb8d4}

/* RANGE VISUALIZER */
.range-viz{
  background:#141a23;border:1px solid var(--line);
  border-radius:14px;padding:20px;margin-bottom:16px;
}
.range-bar{
  height:38px;background:#1c2230;border-radius:19px;
  position:relative;overflow:hidden;margin:10px 0;
}
.range-seg{
  position:absolute;top:0;bottom:0;
  display:flex;align-items:center;justify-content:center;
  font-size:11px;font-weight:700;color:rgba(255,255,255,.85);
}
.range-marker{
  position:absolute;top:-4px;bottom:-4px;
  width:4px;background:var(--gold);border-radius:2px;
  box-shadow:0 0 12px var(--gold);
  transition:left .4s cubic-bezier(.34,1.4,.64,1);
}

/* PIANO KEYBOARD */
.piano{
  display:flex;justify-content:center;
  margin:20px 0;position:relative;height:140px;
}
.white-key{
  width:44px;height:140px;background:#f8f6f0;
  border:1px solid #999;color:#333;
  display:flex;align-items:flex-end;justify-content:center;
  padding-bottom:10px;font-size:11px;font-weight:600;
  border-radius:0 0 6px 6px;position:relative;
  transition:.1s;
}
.white-key:hover{background:#efece2}
.white-key.hit{background:var(--gold)}
.white-key:active{transform:translateY(2px)}
.black-key{
  position:absolute;top:0;right:-14px;
  width:28px;height:88px;background:#1a1a1a;
  border-radius:0 0 5px 5px;z-index:2;
  color:white;font-size:9px;
  display:flex;align-items:flex-end;justify-content:center;
  padding-bottom:6px;
}
.black-key:hover{background:#2a2a2a}
.black-key.hit{background:var(--accent)}

/* MODAL */
.modal{
  position:fixed;inset:0;background:rgba(0,0,0,.78);
  display:none;align-items:center;justify-content:center;z-index:100;
  padding:20px;
}
.modal.open{display:flex}
.modal-content{
  width:min(760px,100%);max-height:88vh;overflow-y:auto;
  background:#161b24;border:1px solid var(--line);
  border-radius:18px;padding:26px;position:relative;
}
.modal-close{
  position:absolute;top:16px;right:16px;
  background:#2a3242;width:32px;height:32px;border-radius:50%;
  font-size:18px;line-height:1;
}
.modal h2{font-size:22px;margin-bottom:16px}
.modal h3{font-size:16px;margin:16px 0 8px;color:var(--accent2)}
.modal p{line-height:1.7;color:#c8d2e0;margin-bottom:10px;font-size:14px}
.modal ul{margin:8px 0 16px 20px;color:#c8d2e0;line-height:1.8;font-size:14px}
.modal .note-example{
  background:#1c2230;padding:10px 14px;border-radius:8px;
  font-family:monospace;font-size:14px;color:var(--gold);
  margin:8px 0;
}

/* TEST RESULT */
.result-screen{text-align:center;padding:40px 20px}
.result-icon{font-size:80px;margin-bottom:16px}
.result-title{font-size:32px;font-weight:900;margin-bottom:10px}
.result-score{font-size:60px;font-weight:900;margin:20px 0;letter-spacing:-2px}
.result-score.pass{color:var(--green)}
.result-score.fail{color:var(--red)}
.result-meta{color:var(--muted);margin:12px 0 26px;font-size:15px}
.result-actions{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.result-actions button{padding:12px 26px;border-radius:10px;font-size:14px}
.btn-primary{background:linear-gradient(135deg,var(--accent),#6242dd)}
.btn-secondary{background:#2a3242}

/* PROGRESS BAR */
.progress{height:8px;background:#2a3242;border-radius:20px;overflow:hidden}
.progress div{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));transition:width .5s}

/* NOTIFY */
.notify{
  position:fixed;top:20px;right:20px;z-index:200;
  background:#232b3d;color:white;padding:12px 20px;
  border-radius:12px;font-weight:600;font-size:14px;
  box-shadow:0 10px 30px rgba(0,0,0,.5);
  animation:slideIn .3s ease;border-left:3px solid var(--accent);
}
@keyframes slideIn{from{transform:translateX(120%)}to{transform:translateX(0)}}

/* MODE PICKER */
.mode-picker{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px}
.mode-card{
  background:linear-gradient(145deg,#1c2230,#141a23);
  border:1px solid var(--line);padding:22px 18px;border-radius:14px;
  cursor:pointer;transition:.2s;text-align:center;
}
.mode-card:hover{border-color:var(--accent);transform:translateY(-3px)}
.mode-card .icon{font-size:42px;margin-bottom:10px}
.mode-card .title{font-size:15px;font-weight:700;margin-bottom:6px}
.mode-card .desc{font-size:12px;color:var(--muted);line-height:1.5}

/* MOBILE */
@media(max-width:820px){
  .sidebar{position:relative;width:100%;height:auto;padding:14px}
  .app{display:block}
  .main{margin-left:0;width:100%;padding:18px}
  .player-card{display:none}
}
</style>
</head>
<body>

<div class="app">
<aside class="sidebar">
  <div class="logo">Note<span>Verse</span></div>
  <div class="subtitle">Music Staff Master v2</div>

  <div class="player-card">
    <div class="player-row">
      <strong id="playerName">Music Student</strong>
      <span class="rank" id="playerRank">Beginner</span>
    </div>
    <div class="level-line">
      Lv <span id="level">1</span> · <span id="xp">0</span> XP
    </div>
    <div class="xpbar"><div class="xpfill" id="xpFill"></div></div>
  </div>

  <div class="nav">
    <div class="nav-title">Main</div>
    <button class="active" data-page="dashboard">🏠 Dashboard</button>
    <button data-page="academy">📚 Academy</button>
    <button data-page="practice">✏️ Practice</button>
    <button data-page="test">🎯 Test</button>
    <div class="nav-title">Tools</div>
    <button data-page="piano">🎹 Piano</button>
    <button data-page="progress">📊 Progress</button>
  </div>
</aside>

<main class="main">
  <div id="appContent"></div>
</main>
</div>

<div class="modal" id="modal">
  <div class="modal-content">
    <button class="modal-close" onclick="closeModal()">×</button>
    <div id="modalContent"></div>
  </div>
</div>

<script>
/* ============================================================
   NoteVerse · Music Staff Master v2
   Complete rewrite with accurate staff rendering and range system
============================================================ */

/* ---------- I18N ---------- */
let language = localStorage.getItem('nv_language') || 'zh';

const I18N = {
  zh: {
    dashTitle: '音乐大师学院',
    dashDesc: '学习、练习、测试五线谱与音域，成为真正的音乐大师',
    xp: '经验',
    level: '等级',
    accuracy: '正确率',
    streak: '连胜',
    academy: '音乐学院',
    academyDesc: '从零开始，逐步掌握五线谱和音域知识',
    practice: '练习中心',
    practiceDesc: '自由练习，不计时，不计分',
    test: '测试中心',
    testDesc: '限时测试，检验你的真实掌握程度',
    piano: '钢琴工具',
    pianoDesc: '点击琴键听音，学习音高',
    progress: '学习进度',
    progressDesc: '查看你的掌握情况',
    startLearn: '学习',
    startPractice: '开始练习',
    startTest: '开始测试',
    locked: '🔒 未解锁',
    lessons: '课程',
    practiceModes: '练习模式',
    testModes: '测试模式',
    staffPractice: '五线谱练习',
    rangePractice: '音域练习',
    earPractice: '听音练习',
    staffTest: '五线谱测试',
    rangeTest: '音域测试',
    comprehensiveTest: '综合测试',
    readStaff: '看谱选音名',
    identifyRange: '判断音域',
    listenNote: '听音辨位',
    timeLimit: '限时',
    questions: '题',
    passScore: '通过分',
    startNow: '开始',
    score: '得分',
    time: '时间',
    question: '第',
    whatNote: '这是什么音？',
    whatRange: '这个音属于哪个音域？',
    low: '低音域',
    mid: '中音域',
    high: '高音域',
    correct: '答对了！',
    wrong: '答错了，正确答案是',
    testComplete: '测试完成',
    passed: '通过！',
    failed: '未通过',
    tryAgain: '再试一次',
    backToTests: '返回测试中心',
    totalQuestions: '总题数',
    correctCount: '答对',
    wrongCount: '答错',
    finalScore: '最终得分',
    playNote: '▶ 播放音符',
    playAgain: '🔁 再听一次',
    yourAnswer: '你的答案',
    correctAnswer: '正确答案',
    replay: '再听一遍',
    dashboard: '控制台',
    reset: '重置进度',
    confirmReset: '确定要重置所有进度吗？',
    noteReading: '五线谱阅读',
    rangeRecognition: '音域识别',
    earTraining: '听音能力',
    mastery: '掌握度',
    beginner: '初学者',
    novice: '新手',
    apprentice: '学徒',
    student: '学员',
    performer: '演奏者',
    composer: '作曲家',
    expert: '专家',
    master: '大师',
    grandmaster: '宗师',
    treble: '高音谱号',
    bass: '低音谱号',
    selectClef: '选择谱号',
    practiceInProgress: '练习中',
    exit: '退出'
  },
  en: {
    dashTitle: 'Music Master Academy',
    dashDesc: 'Learn, practice and test music staff & range. Become a true master.',
    xp: 'XP',
    level: 'Level',
    accuracy: 'Accuracy',
    streak: 'Streak',
    academy: 'Academy',
    academyDesc: 'From zero to music notation mastery.',
    practice: 'Practice',
    practiceDesc: 'Free practice. No timer. No pressure.',
    test: 'Test Center',
    testDesc: 'Timed exams. Test your true mastery.',
    piano: 'Piano Tool',
    pianoDesc: 'Click keys to hear pitches.',
    progress: 'Progress',
    progressDesc: 'Track your mastery.',
    startLearn: 'Learn',
    startPractice: 'Start Practice',
    startTest: 'Start Test',
    locked: '🔒 Locked',
    lessons: 'Lessons',
    practiceModes: 'Practice Modes',
    testModes: 'Test Modes',
    staffPractice: 'Staff Practice',
    rangePractice: 'Range Practice',
    earPractice: 'Ear Training',
    staffTest: 'Staff Test',
    rangeTest: 'Range Test',
    comprehensiveTest: 'Comprehensive Test',
    readStaff: 'Read the note',
    identifyRange: 'Identify the range',
    listenNote: 'Listen and identify',
    timeLimit: 'Time',
    questions: 'questions',
    passScore: 'Pass',
    startNow: 'Start',
    score: 'Score',
    time: 'Time',
    question: 'Q',
    whatNote: 'What note is this?',
    whatRange: 'Which range does this note belong to?',
    low: 'Low',
    mid: 'Middle',
    high: 'High',
    correct: 'Correct!',
    wrong: 'Wrong. Answer: ',
    testComplete: 'Test Complete',
    passed: 'Passed!',
    failed: 'Not Passed',
    tryAgain: 'Try Again',
    backToTests: 'Back to Tests',
    totalQuestions: 'Total',
    correctCount: 'Correct',
    wrongCount: 'Wrong',
    finalScore: 'Final Score',
    playNote: '▶ Play Note',
    playAgain: '🔁 Play Again',
    yourAnswer: 'Your answer',
    correctAnswer: 'Correct answer',
    replay: 'Replay',
    dashboard: 'Dashboard',
    reset: 'Reset Progress',
    confirmReset: 'Reset all progress?',
    noteReading: 'Note Reading',
    rangeRecognition: 'Range Recognition',
    earTraining: 'Ear Training',
    mastery: 'Mastery',
    beginner: 'Beginner',
    novice: 'Novice',
    apprentice: 'Apprentice',
    student: 'Student',
    performer: 'Performer',
    composer: 'Composer',
    expert: 'Expert',
    master: 'Master',
    grandmaster: 'Grandmaster',
    treble: 'Treble Clef',
    bass: 'Bass Clef',
    selectClef: 'Select Clef',
    practiceInProgress: 'Practice',
    exit: 'Exit'
  }
};

function t(key){ return I18N[language][key] || key; }

/* ---------- STAFF NOTE DATA ---------- */
/*
   Position system: position 0 = bottom line of the staff.
   Each +1 position = one step up (line→space→line...)
   Treble: pos 0 = E4, pos 8 = F5 (top line)
   Bass:   pos 0 = G2, pos 8 = A3 (top line)
*/
const TREBLE_NOTES = [
  { midi:60, name:'C4', pos:-2, hz:261.63, range:'mid' },   // ledger below
  { midi:62, name:'D4', pos:-1, hz:293.66, range:'mid' },
  { midi:64, name:'E4', pos: 0, hz:329.63, range:'mid' },   // line 1
  { midi:65, name:'F4', pos: 1, hz:349.23, range:'mid' },
  { midi:67, name:'G4', pos: 2, hz:392.00, range:'mid' },   // line 2
  { midi:69, name:'A4', pos: 3, hz:440.00, range:'mid' },
  { midi:71, name:'B4', pos: 4, hz:493.88, range:'mid' },   // line 3
  { midi:72, name:'C5', pos: 5, hz:523.25, range:'high' },
  { midi:74, name:'D5', pos: 6, hz:587.33, range:'high' },  // line 4
  { midi:76, name:'E5', pos: 7, hz:659.25, range:'high' },
  { midi:77, name:'F5', pos: 8, hz:698.46, range:'high' },  // line 5
  { midi:79, name:'G5', pos: 9, hz:783.99, range:'high' },  // ledger above
  { midi:81, name:'A5', pos:10, hz:880.00, range:'high' }
];

const BASS_NOTES = [
  { midi:36, name:'C2', pos:-4, hz:65.41,  range:'low' },   // ledger below
  { midi:38, name:'D2', pos:-3, hz:73.42,  range:'low' },
  { midi:40, name:'E2', pos:-2, hz:82.41,  range:'low' },
  { midi:41, name:'F2', pos:-1, hz:87.31,  range:'low' },
  { midi:43, name:'G2', pos: 0, hz:98.00,  range:'low' },   // line 1
  { midi:45, name:'A2', pos: 1, hz:110.00, range:'low' },
  { midi:47, name:'B2', pos: 2, hz:123.47, range:'low' },   // line 2
  { midi:48, name:'C3', pos: 3, hz:130.81, range:'low' },
  { midi:50, name:'D3', pos: 4, hz:146.83, range:'low' },   // line 3
  { midi:52, name:'E3', pos: 5, hz:164.81, range:'low' },
  { midi:53, name:'F3', pos: 6, hz:174.61, range:'low' },   // line 4
  { midi:55, name:'G3', pos: 7, hz:196.00, range:'low' },
  { midi:57, name:'A3', pos: 8, hz:220.00, range:'low' },   // line 5
  { midi:59, name:'B3', pos: 9, hz:246.94, range:'low' },   // ledger above
  { midi:60, name:'C4', pos:10, hz:261.63, range:'mid' }
];

/* ---------- PLAYER ---------- */
const DEFAULT_PLAYER = {
  xp: 0, level: 1, streak: 0,
  correct: 0, wrong: 0, totalQuestions: 0,
  lessonsCompleted: [],
  skills: { noteReading: {c:0,w:0}, rangeRecognition: {c:0,w:0}, earTraining: {c:0,w:0} },
  testHistory: [],
  bestScores: {}
};

let player = JSON.parse(localStorage.getItem('nv_player_v2') || 'null') || JSON.parse(JSON.stringify(DEFAULT_PLAYER));

function save(){
  localStorage.setItem('nv_player_v2', JSON.stringify(player));
  localStorage.setItem('nv_language', language);
  updatePlayerUI();
}

function updatePlayerUI(){
  document.getElementById('xp').textContent = player.xp;
  document.getElementById('level').textContent = player.level;
  const ranks = ['beginner','novice','apprentice','student','performer','composer','expert','master','grandmaster'];
  document.getElementById('playerRank').textContent = t(ranks[Math.min(player.level-1, ranks.length-1)]);
  document.getElementById('xpFill').style.width = (player.xp % 100) + '%';
}

function addXP(amount){
  player.xp += amount;
  const nl = Math.floor(player.xp / 100) + 1;
  if(nl > player.level){ player.level = nl; notify('🎉 Level Up! ' + t('level') + ' ' + nl); }
  save();
}

function recordSkill(skill, correct){
  if(!player.skills[skill]) player.skills[skill] = {c:0, w:0};
  if(correct) player.skills[skill].c++; else player.skills[skill].w++;
  player.totalQuestions++;
  if(correct){ player.correct++; player.streak++; }
  else { player.wrong++; player.streak = 0; }
  save();
}

function skillPct(skill){
  const s = player.skills[skill];
  if(!s) return 0;
  const tot = s.c + s.w;
  return tot ? Math.round(s.c / tot * 100) : 0;
}

/* ---------- NOTIFY ---------- */
function notify(msg){
  const d = document.createElement('div');
  d.className = 'notify';
  d.textContent = msg;
  document.body.appendChild(d);
  setTimeout(() => d.remove(), 2400);
}

/* ---------- AUDIO ---------- */
let actx = null;
function getAudio(){
  if(!actx){
    const AC = window.AudioContext || window.webkitAudioContext;
    actx = new AC();
  }
  if(actx.state === 'suspended') actx.resume();
  return actx;
}

function playNote(hz, dur){
  try{
    const c = getAudio();
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.type = 'sine';
    osc.frequency.value = hz;
    osc.connect(g); g.connect(c.destination);
    const t0 = c.currentTime;
    const d = dur || 0.9;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(0.25, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + d);
    osc.start(t0); osc.stop(t0 + d + 0.05);
  }catch(e){}
}

function sfxCorrect(){
  try{
    const c = getAudio();
    [523.25, 659.25, 783.99].forEach((f, i) => {
      const o = c.createOscillator(), g = c.createGain();
      o.type = 'sine'; o.frequency.value = f;
      o.connect(g); g.connect(c.destination);
      const t0 = c.currentTime + i * 0.08;
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(0.15, t0 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.2);
      o.start(t0); o.stop(t0 + 0.25);
    });
  }catch(e){}
}

function sfxWrong(){
  try{
    const c = getAudio();
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'sawtooth'; o.frequency.value = 180;
    o.connect(g); g.connect(c.destination);
    const t0 = c.currentTime;
    g.gain.setValueAtTime(0.15, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + 0.25);
    o.start(t0); o.stop(t0 + 0.3);
  }catch(e){}
}

/* ---------- STAFF RENDERING (Canvas) ---------- */
function drawStaff(canvas, opts){
  /*
    opts = {
      clef: 'treble' | 'bass',
      notePos: number (position on staff, 0 = bottom line),
      color: '#111' (note color),
      showLabels: false,
      highlight: false
    }
  */
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.clientWidth || 500;
  const H = canvas.clientHeight || 220;
  canvas.width = W * dpr;
  canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const lineGap = 18;                 // distance between staff lines
  const step = lineGap / 2;           // half-step (one position)
  const staffH = lineGap * 4;         // total height of 5 lines = 4 gaps
  const staffTop = (H - staffH) / 2;
  const staffBottom = staffTop + staffH;
  const lineXStart = W * 0.16;
  const lineXEnd = W * 0.92;

  // --- 5 staff lines ---
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1.2;
  for(let i = 0; i < 5; i++){
    const y = staffTop + i * lineGap;
    ctx.beginPath();
    ctx.moveTo(lineXStart, y);
    ctx.lineTo(lineXEnd, y);
    ctx.stroke();
  }

  // --- Draw clef ---
  ctx.fillStyle = '#1a1a1a';
  ctx.font = (lineGap * 4.6) + 'px "Times New Roman", serif';
  ctx.textBaseline = 'middle';
  if(opts.clef === 'treble'){
    ctx.fillText('𝄞', lineXStart - lineGap * 2.4, staffTop + lineGap * 1.9);
  } else {
    ctx.font = (lineGap * 3.4) + 'px "Times New Roman", serif';
    ctx.fillText('𝄢', lineXStart - lineGap * 2, staffTop + lineGap * 1);
  }

  // --- Ledger lines ---
  if(typeof opts.notePos === 'number'){
    const noteX = W * 0.62;
    const noteY = staffBottom - opts.notePos * step;
    // ledger lines below (pos <= -2 even)
    if(opts.notePos <= -2){
      for(let p = -2; p >= opts.notePos; p -= 2){
        const ly = staffBottom - p * step;
        ctx.beginPath();
        ctx.moveTo(noteX - 18, ly);
        ctx.lineTo(noteX + 18, ly);
        ctx.stroke();
      }
    }
    // ledger above (pos >= 10 even)
    if(opts.notePos >= 10){
      for(let p = 10; p <= opts.notePos; p += 2){
        const ly = staffBottom - p * step;
        ctx.beginPath();
        ctx.moveTo(noteX - 18, ly);
        ctx.lineTo(noteX + 18, ly);
        ctx.stroke();
      }
    }

    // --- Note head ---
    ctx.save();
    ctx.translate(noteX, noteY);
    ctx.rotate(-0.35);
    ctx.beginPath();
    ctx.ellipse(0, 0, 9, 6.5, 0, 0, Math.PI * 2);
    ctx.fillStyle = opts.color || '#1a1a1a';
    ctx.fill();
    ctx.restore();

    // --- Stem ---
    const stemUp = opts.notePos <= 4;
    ctx.beginPath();
    ctx.strokeStyle = opts.color || '#1a1a1a';
    ctx.lineWidth = 1.8;
    if(stemUp){
      ctx.moveTo(noteX + 8, noteY);
      ctx.lineTo(noteX + 8, noteY - lineGap * 3.2);
    } else {
      ctx.moveTo(noteX - 8, noteY);
      ctx.lineTo(noteX - 8, noteY + lineGap * 3.2);
    }
    ctx.stroke();
  }
}

/* ---------- PAGE NAV ---------- */
let currentPage = 'dashboard';

document.querySelectorAll('.nav button').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav button').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    navigateTo(btn.dataset.page);
  });
});

function navigateTo(page){
  currentPage = page;
  stopAllTimers();
  switch(page){
    case 'dashboard': renderDashboard(); break;
    case 'academy': renderAcademy(); break;
    case 'practice': renderPracticePicker(); break;
    case 'test': renderTestPicker(); break;
    case 'piano': renderPiano(); break;
    case 'progress': renderProgress(); break;
  }
}

/* ---------- DASHBOARD ---------- */
function renderDashboard(){
  const acc = player.totalQuestions ? Math.round(player.correct / player.totalQuestions * 100) : 0;
  const coursePct = Math.min(100, Math.round(player.lessonsCompleted.length / LESSONS.length * 100));

  document.getElementById('appContent').innerHTML = \`
    <div class="topbar">
      <div>
        <div class="page-title">\${t('dashTitle')}</div>
        <div class="page-desc">\${t('dashDesc')}</div>
      </div>
      <div class="lang-switch">
        <button class="\${language==='en'?'active':''}" onclick="setLanguage('en')">EN</button>
        <button class="\${language==='zh'?'active':''}" onclick="setLanguage('zh')">中文</button>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <div class="stat-label">\${t('xp')}</div>
        <div class="stat-num">\${player.xp}</div>
      </div>
      <div class="card">
        <div class="stat-label">\${t('level')}</div>
        <div class="stat-num">\${player.level}</div>
      </div>
      <div class="card">
        <div class="stat-label">\${t('accuracy')}</div>
        <div class="stat-num">\${acc}%</div>
      </div>
      <div class="card">
        <div class="stat-label">\${t('streak')}</div>
        <div class="stat-num">🔥 \${player.streak}</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">\${t('lessons')}</div>
      <div class="lesson-grid">
        \${LESSONS.slice(0,3).map(l => lessonCard(l)).join('')}
      </div>
    </div>

    <div class="section">
      <div class="section-title">\${t('mastery')}</div>
      <div class="card">
        \${skillBar(t('noteReading'), skillPct('noteReading'))}
        \${skillBar(t('rangeRecognition'), skillPct('rangeRecognition'))}
        \${skillBar(t('earTraining'), skillPct('earTraining'))}
      </div>
    </div>

    <div class="section">
      <div class="card" style="text-align:center">
        <button class="btn-secondary" style="padding:10px 20px;border-radius:10px;font-size:13px" onclick="resetProgress()">
          🔄 \${t('reset')}
        </button>
      </div>
    </div>
  \`;
}

function skillBar(name, pct){
  return \`
    <div style="margin-bottom:14px">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px">
        <span>\${name}</span><strong style="color:var(--accent2)">\${pct}%</strong>
      </div>
      <div class="progress"><div style="width:\${pct}%"></div></div>
    </div>
  \`;
}

/* ---------- LESSONS ---------- */
const LESSONS = [
  { id:'staff',   icon:'🎼', level:1, zh:'五线谱基础', en:'The Staff',      zhD:'认识五线谱的线与间', enD:'Learn the 5 lines and 4 spaces' },
  { id:'treble',  icon:'𝄞', level:1, zh:'高音谱号',   en:'Treble Clef',    zhD:'高音谱号及其音高',   enD:'Learn the treble clef notes' },
  { id:'bass',    icon:'𝄢', level:1, zh:'低音谱号',   en:'Bass Clef',      zhD:'低音谱号及其音高',   enD:'Learn the bass clef notes' },
  { id:'ledger',  icon:'📏', level:2, zh:'加线',       en:'Ledger Lines',   zhD:'认识五线谱外的加线',  enD:'Notes outside the staff' },
  { id:'range',   icon:'🎯', level:2, zh:'音域简介',   en:'Note Range',     zhD:'低音域、中音域、高音域', enD:'Low, Middle and High ranges' },
  { id:'values',  icon:'♩', level:3, zh:'音符时值',   en:'Note Values',    zhD:'全音符、二分、四分等', enD:'Whole, half, quarter notes' },
  { id:'rests',   icon:'𝄽', level:3, zh:'休止符',     en:'Rests',          zhD:'各种休止符',        enD:'Musical rests' },
  { id:'accid',   icon:'♯', level:4, zh:'升降号',     en:'Accidentals',    zhD:'♯ ♭ ♮',             enD:'Sharps, flats, naturals' },
  { id:'key',     icon:'🔑', level:5, zh:'调号',       en:'Key Signatures', zhD:'大调、小调',         enD:'Major and minor keys' },
  { id:'scales',  icon:'🎵', level:5, zh:'音阶',       en:'Scales',         zhD:'大调、小调音阶',     enD:'Major and minor scales' }
];

function lessonCard(l){
  const unlocked = player.level >= l.level;
  const done = player.lessonsCompleted.includes(l.id);
  return \`
    <div class="lesson \${!unlocked?'locked':''}">
      <div class="lesson-icon">\${l.icon}</div>
      <h3>\${language==='zh'?l.zh:l.en} \${done?'✅':''}</h3>
      <p>\${language==='zh'?l.zhD:l.enD}</p>
      <div class="lesson-meta">
        <span>Lv \${l.level}</span>
      </div>
      <button class="primary" \${!unlocked?'disabled':''} onclick="openLesson('\${l.id}')">
        \${unlocked ? t('startLearn') : t('locked')}
      </button>
    </div>
  \`;
}

function renderAcademy(){
  document.getElementById('appContent').innerHTML = \`
    <div class="topbar">
      <div>
        <div class="page-title">📚 \${t('academy')}</div>
        <div class="page-desc">\${t('academyDesc')}</div>
      </div>
    </div>
    <div class="lesson-grid">
      \${LESSONS.map(l => lessonCard(l)).join('')}
    </div>
  \`;
}

/* ---------- LESSON CONTENT ---------- */
function openLesson(id){
  const l = LESSONS.find(x => x.id === id);
  if(!l) return;
  const title = language === 'zh' ? l.zh : l.en;
  let body = '';

  switch(id){
    case 'staff':
      body = \`
        <h2>\${title}</h2>
        <p>\${language==='zh'
          ? '五线谱由 5 条平行的线和 4 个间组成。音符的位置决定了音高：越往上越高，越往下越低。'
          : 'The staff has 5 parallel lines and 4 spaces. Higher position = higher pitch.'}</p>
        <div class="staff-wrap" style="margin:16px 0">
          <canvas class="staff-canvas" id="lessonCanvas" style="width:100%;height:220px"></canvas>
        </div>
        <h3>\${language==='zh'?'线与间':'Lines & Spaces'}</h3>
        <p>\${language==='zh'
          ? '音符既可以写在线上，也可以写在两线之间的间上。'
          : 'Notes can be placed either on a line or in a space between lines.'}</p>
      \`;
      break;

    case 'treble':
      body = \`
        <h2>𝄞 \${title}</h2>
        <p>\${language==='zh'
          ? '高音谱号用于中高音区。常用于钢琴右手、小提琴、长笛等。'
          : 'Treble clef is used for higher pitches — right hand of piano, violin, flute.'}</p>
        <div class="staff-wrap" style="margin:16px 0">
          <canvas class="staff-canvas" id="lessonCanvas" style="width:100%;height:220px"></canvas>
        </div>
        <h3>\${language==='zh'?'五条线的音':'Notes on lines'}</h3>
        <div class="note-example">E4 — G4 — B4 — D5 — F5</div>
        <h3>\${language==='zh'?'四个间的音':'Notes in spaces'}</h3>
        <div class="note-example">F4 — A4 — C5 — E5  (FACE)</div>
      \`;
      break;

    case 'bass':
      body = \`
        <h2>𝄢 \${title}</h2>
        <p>\${language==='zh'
          ? '低音谱号用于低音区。常用于钢琴左手、大提琴、低音提琴等。'
          : 'Bass clef is used for lower pitches — left hand of piano, cello, bass.'}</p>
        <div class="staff-wrap" style="margin:16px 0">
          <canvas class="staff-canvas" id="lessonCanvas" style="width:100%;height:220px"></canvas>
        </div>
        <h3>\${language==='zh'?'五条线的音':'Notes on lines'}</h3>
        <div class="note-example">G2 — B2 — D3 — F3 — A3</div>
        <h3>\${language==='zh'?'四个间的音':'Notes in spaces'}</h3>
        <div class="note-example">A2 — C3 — E3 — G3</div>
      \`;
      break;

    case 'ledger':
      body = \`
        <h2>📏 \${title}</h2>
        <p>\${language==='zh'
          ? '当音符超出五线谱范围时，需要画加线（Ledger Lines）。中央 C（C4）就在高音谱表下方，需要一条下加一线。'
          : 'Ledger lines extend the staff. Middle C (C4) sits one ledger line below the treble staff.'}</p>
        <div class="staff-wrap" style="margin:16px 0">
          <canvas class="staff-canvas" id="lessonCanvas" style="width:100%;height:220px"></canvas>
        </div>
        <h3>\${language==='zh'?'中央 C':'Middle C'}</h3>
        <p>\${language==='zh'
          ? 'C4 是连接高音谱表和低音谱表的桥：它在高音谱表下加一线，也是低音谱表的上加一线。'
          : 'C4 sits on one ledger line below the treble staff and one ledger line above the bass staff.'}</p>
      \`;
      break;

    case 'range':
      body = \`
        <h2>🎯 \${title}</h2>
        <p>\${language==='zh'
          ? '根据音高，音符可以被归类为三个主要音域。'
          : 'Notes are grouped into three main ranges based on pitch.'}</p>

        <div class="range-viz">
          <div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:8px">
            <span>C2</span><span>C4</span><span>C6</span>
          </div>
          <div class="range-bar">
            <div class="range-seg range-low"  style="left:0%;  width:33%;">\${t('low')}</div>
            <div class="range-seg range-mid"  style="left:33%; width:34%;">\${t('mid')}</div>
            <div class="range-seg range-high" style="left:67%; width:33%;">\${t('high')}</div>
          </div>
        </div>

        <h3>\${t('low')} — C2 至 B3</h3>
        <p>\${language==='zh'?'低音域：大提琴、低音提琴、钢琴左手、男低音。':'Low: cello, bass, piano LH, bass vocal.'}</p>

        <h3>\${t('mid')} — C4 至 B4</h3>
        <p>\${language==='zh'?'中音域：人声、中提琴、长笛中音区。':'Middle: voice, viola, middle register of flute.'}</p>

        <h3>\${t('high')} — C5 以上</h3>
        <p>\${language==='zh'?'高音域：小提琴高音、女高音、短笛。':'High: high violin, soprano, piccolo.'}</p>
      \`;
      break;

    case 'values':
      body = \`
        <h2>♩ \${title}</h2>
        <p>\${language==='zh'?'音符的时值决定了它持续多久。':'Note value = duration.'}</p>
        <div class="note-example">𝅝 Whole Note = 4 beats</div>
        <div class="note-example">𝅗𝅥 Half Note = 2 beats</div>
        <div class="note-example">♩ Quarter Note = 1 beat</div>
        <div class="note-example">♪ Eighth Note = 1/2 beat</div>
        <div class="note-example">𝅘𝅥𝅯 Sixteenth = 1/4 beat</div>
      \`;
      break;

    case 'rests':
      body = \`
        <h2>𝄽 \${title}</h2>
        <p>\${language==='zh'?'休止符表示静默，但同样占用时间。':'A rest means silence — but it still occupies time.'}</p>
        <div class="note-example">𝄻 Whole Rest = 4 beats</div>
        <div class="note-example">𝄼 Half Rest = 2 beats</div>
        <div class="note-example">𝄽 Quarter Rest = 1 beat</div>
        <div class="note-example">𝄾 Eighth Rest = 1/2 beat</div>
      \`;
      break;

    case 'accid':
      body = \`
        <h2>♯ \${title}</h2>
        <div class="note-example">♯ Sharp — raises a pitch by 1 semitone</div>
        <div class="note-example">♭ Flat — lowers a pitch by 1 semitone</div>
        <div class="note-example">♮ Natural — cancels a previous sharp or flat</div>
      \`;
      break;

    case 'key':
      body = \`
        <h2>🔑 \${title}</h2>
        <p>\${language==='zh'?'调号告诉你在整首曲子里哪些音要升或降。':'A key signature indicates which notes are consistently sharp or flat.'}</p>
        <div class="note-example">C Major — no sharps, no flats</div>
        <div class="note-example">G Major — F♯</div>
        <div class="note-example">D Major — F♯ C♯</div>
        <div class="note-example">F Major — B♭</div>
      \`;
      break;

    case 'scales':
      body = \`
        <h2>🎵 \${title}</h2>
        <p>\${language==='zh'?'大调音阶的音程模式：':'Major scale interval pattern:'}</p>
        <div class="note-example">W — W — H — W — W — W — H</div>
        <div class="note-example">C Major: C D E F G A B C</div>
        <div class="note-example">G Major: G A B C D E F♯ G</div>
      \`;
      break;
  }

  document.getElementById('modalContent').innerHTML = \`
    \${body}
    <div style="margin-top:24px;text-align:right">
      <button class="btn-primary" style="padding:12px 22px;border-radius:10px" onclick="completeLesson('\${id}')">
        \${language==='zh'?'完成课程 +25 XP':'Complete +25 XP'}
      </button>
    </div>
  \`;
  document.getElementById('modal').classList.add('open');

  // Draw a sample staff depending on lesson
  setTimeout(() => {
    const cvs = document.getElementById('lessonCanvas');
    if(!cvs) return;
    if(id === 'staff'){
      drawStaff(cvs, { clef: 'treble', notePos: null });
    } else if(id === 'treble'){
      drawStaff(cvs, { clef: 'treble', notePos: 2 });
    } else if(id === 'bass'){
      drawStaff(cvs, { clef: 'bass', notePos: 4 });
    } else if(id === 'ledger'){
      drawStaff(cvs, { clef: 'treble', notePos: -2 });
    }
  }, 30);
}

function completeLesson(id){
  if(!player.lessonsCompleted.includes(id)){
    player.lessonsCompleted.push(id);
    addXP(25);
    notify('✅ +25 XP');
  }
  closeModal();
  if(currentPage === 'academy') renderAcademy();
  else renderDashboard();
}

function closeModal(){ document.getElementById('modal').classList.remove('open'); }

/* ---------- PRACTICE PICKER ---------- */
function renderPracticePicker(){
  document.getElementById('appContent').innerHTML = \`
    <div class="topbar">
      <div>
        <div class="page-title">✏️ \${t('practice')}</div>
        <div class="page-desc">\${t('practiceDesc')}</div>
      </div>
    </div>
    <div class="mode-picker">
      <div class="mode-card" onclick="startPracticeMode('staff')">
        <div class="icon">🎼</div>
        <div class="title">\${t('staffPractice')}</div>
        <div class="desc">\${t('readStaff')}</div>
      </div>
      <div class="mode-card" onclick="startPracticeMode('range')">
        <div class="icon">🎯</div>
        <div class="title">\${t('rangePractice')}</div>
        <div class="desc">\${t('identifyRange')}</div>
      </div>
      <div class="mode-card" onclick="startPracticeMode('ear')">
        <div class="icon">👂</div>
        <div class="title">\${t('earPractice')}</div>
        <div class="desc">\${t('listenNote')}</div>
      </div>
    </div>
  \`;
}

/* ---------- PRACTICE SESSION ---------- */
let session = {
  mode: 'practice',   // 'practice' | 'test'
  type: 'staff',      // 'staff' | 'range' | 'ear'
  score: 0,
  qIndex: 0,
  qTotal: 5,          // practice default, test overrides
  startTime: 0,
  timeLimit: 0,       // seconds, 0 = no limit
  timerId: null,
  timeLeft: 0,
  current: null,
  correctCount: 0,
  wrongCount: 0
};

function startPracticeMode(type){
  session.mode = 'practice';
  session.type = type;
  session.qTotal = 5;
  session.timeLimit = 0;
  session.score = 0;
  session.qIndex = 0;
  session.correctCount = 0;
  session.wrongCount = 0;
  session.startTime = Date.now();
  renderSessionFrame();
  nextQuestion();
}

function stopAllTimers(){
  if(session.timerId){ clearInterval(session.timerId); session.timerId = null; }
}

function renderSessionFrame(){
  document.getElementById('appContent').innerHTML = \`
    <div class="game-wrap">
      <div class="game-header">
        <div>
          <div class="page-title">\${typeTitle(session.type)}</div>
          <div class="page-desc">\${t('question')} <span id="qCounter">1/\${session.qTotal}</span></div>
        </div>
        <div style="display:flex;gap:10px;align-items:center">
          <div class="score-box">\${t('score')}: <span id="scoreVal">0</span></div>
          <div class="timer-box" id="timerBox" style="display:none">\${t('time')}: <span id="timerVal">--</span></div>
        </div>
      </div>
      <div id="questionArea"></div>
    </div>
  \`;

  if(session.mode === 'test' && session.timeLimit > 0){
    session.timeLeft = session.timeLimit;
    document.getElementById('timerBox').style.display = '';
    document.getElementById('timerVal').textContent = session.timeLeft + 's';
    session.timerId = setInterval(() => {
      session.timeLeft--;
      const el = document.getElementById('timerVal');
      const box = document.getElementById('timerBox');
      if(el) el.textContent = session.timeLeft + 's';
      if(box && session.timeLeft <= 10) box.classList.add('warn');
      if(session.timeLeft <= 0){
        stopAllTimers();
        finishSession();
      }
    }, 1000);
  }
}

function typeTitle(type){
  if(type === 'staff') return t('staffPractice');
  if(type === 'range') return t('rangePractice');
  if(type === 'ear') return t('earPractice');
  return '';
}

function pickRandomNote(clef){
  const pool = clef === 'bass' ? BASS_NOTES : TREBLE_NOTES;
  return pool[Math.floor(Math.random() * pool.length)];
}

function nextQuestion(){
  if(session.qIndex >= session.qTotal){ finishSession(); return; }

  const counter = document.getElementById('qCounter');
  if(counter) counter.textContent = (session.qIndex + 1) + '/' + session.qTotal;

  if(session.type === 'staff'){
    renderStaffQuestion();
  } else if(session.type === 'range'){
    renderRangeQuestion();
  } else if(session.type === 'ear'){
    renderEarQuestion();
  }
}

/* --- Staff question --- */
function renderStaffQuestion(){
  const clef = Math.random() < 0.5 ? 'treble' : 'bass';
  const note = pickRandomNote(clef);
  session.current = { note, clef };
  const pool = clef === 'bass' ? BASS_NOTES : TREBLE_NOTES;

  // Build 4 unique options including the correct one
  const others = pool.filter(n => n.name !== note.name)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);
  const opts = [note, ...others].sort(() => Math.random() - 0.5);

  document.getElementById('questionArea').innerHTML = \`
    <div class="staff-wrap" style="margin-bottom:16px">
      <canvas id="qCanvas" style="width:100%;height:200px"></canvas>
    </div>
    <div class="question">\${t('whatNote')} <span style="color:var(--accent2);font-size:14px">(\${clef==='treble'?t('treble'):t('bass')})</span></div>
    <div class="answers" id="answers">
      \${opts.map(o => \`<button class="answer" data-note="\${o.name}">\${o.name}</button>\`).join('')}
    </div>
  \`;

  setTimeout(() => {
    const cvs = document.getElementById('qCanvas');
    if(cvs) drawStaff(cvs, { clef, notePos: note.pos });
  }, 20);

  document.querySelectorAll('#answers .answer').forEach(b => {
    b.addEventListener('click', () => {
      if(session.locked) return;
      session.locked = true;
      const correct = b.dataset.note === note.name;
      if(correct){
        b.classList.add('correct'); sfxCorrect();
        session.score += 10; session.correctCount++;
        recordSkill('noteReading', true);
      } else {
        b.classList.add('wrong'); sfxWrong();
        session.wrongCount++;
        recordSkill('noteReading', false);
        document.querySelectorAll('#answers .answer').forEach(x => {
          if(x.dataset.note === note.name) x.classList.add('correct');
        });
      }
      const sv = document.getElementById('scoreVal');
      if(sv) sv.textContent = session.score;
      session.qIndex++;
      setTimeout(() => { session.locked = false; nextQuestion(); }, correct ? 550 : 1100);
    });
  });
}

/* --- Range question --- */
function renderRangeQuestion(){
  const clef = Math.random() < 0.5 ? 'treble' : 'bass';
  const pool = clef === 'bass' ? BASS_NOTES : TREBLE_NOTES;
  const note = pool[Math.floor(Math.random() * pool.length)];
  session.current = { note, clef };

  const ranges = [
    { key: 'low',  label: t('low') },
    { key: 'mid',  label: t('mid') },
    { key: 'high', label: t('high') }
  ];

  document.getElementById('questionArea').innerHTML = \`
    <div class="staff-wrap" style="margin-bottom:16px">
      <canvas id="qCanvas" style="width:100%;height:200px"></canvas>
    </div>
    <div class="question">\${t('whatRange')}</div>
    <div class="answers" id="answers" style="grid-template-columns:repeat(3,1fr)">
      \${ranges.map(r => \`<button class="answer range-\${r.key}" data-range="\${r.key}" style="background:transparent;border:2px solid \${r.key==='low'?'#4aa3ff':r.key==='mid'?'#b46cff':'#ff6ca8'}">\${r.label}</button>\`).join('')}
    </div>
  \`;

  setTimeout(() => {
    const cvs = document.getElementById('qCanvas');
    if(cvs) drawStaff(cvs, { clef, notePos: note.pos });
  }, 20);

  document.querySelectorAll('#answers .answer').forEach(b => {
    b.addEventListener('click', () => {
      if(session.locked) return;
      session.locked = true;
      const correct = b.dataset.range === note.range;
      if(correct){
        b.classList.add('correct'); sfxCorrect();
        session.score += 10; session.correctCount++;
        recordSkill('rangeRecognition', true);
      } else {
        b.classList.add('wrong'); sfxWrong();
        session.wrongCount++;
        recordSkill('rangeRecognition', false);
        document.querySelectorAll('#answers .answer').forEach(x => {
          if(x.dataset.range === note.range) x.classList.add('correct');
        });
      }
      const sv = document.getElementById('scoreVal');
      if(sv) sv.textContent = session.score;
      session.qIndex++;
      setTimeout(() => { session.locked = false; nextQuestion(); }, correct ? 550 : 1100);
    });
  });
}

/* --- Ear question --- */
function renderEarQuestion(){
  const pool = TREBLE_NOTES.slice(2, 9); // C5-ish, safer range
  const note = pool[Math.floor(Math.random() * pool.length)];
  session.current = { note };

  const others = pool.filter(n => n.name !== note.name)
    .sort(() => Math.random() - 0.5).slice(0, 3);
  const opts = [note, ...others].sort(() => Math.random() - 0.5);

  document.getElementById('questionArea').innerHTML = \`
    <div class="card" style="text-align:center;padding:32px">
      <div style="font-size:64px;margin-bottom:14px">🎵</div>
      <button class="btn-primary" style="padding:14px 28px;border-radius:10px;font-size:16px" id="playBtn">
        \${t('playNote')}
      </button>
      <button class="btn-secondary" style="padding:14px 20px;border-radius:10px;font-size:14px;margin-left:8px" id="replayBtn">
        \${t('playAgain')}
      </button>
    </div>
    <div class="question">\${t('listenNote')}</div>
    <div class="answers" id="answers">
      \${opts.map(o => \`<button class="answer" data-note="\${o.name}">\${o.name}</button>\`).join('')}
    </div>
  \`;

  const play = () => playNote(note.hz, 1.0);
  document.getElementById('playBtn').addEventListener('click', play);
  document.getElementById('replayBtn').addEventListener('click', play);
  setTimeout(play, 400);

  document.querySelectorAll('#answers .answer').forEach(b => {
    b.addEventListener('click', () => {
      if(session.locked) return;
      session.locked = true;
      const correct = b.dataset.note === note.name;
      if(correct){
        b.classList.add('correct'); sfxCorrect();
        session.score += 10; session.correctCount++;
        recordSkill('earTraining', true);
      } else {
        b.classList.add('wrong'); sfxWrong();
        session.wrongCount++;
        recordSkill('earTraining', false);
        document.querySelectorAll('#answers .answer').forEach(x => {
          if(x.dataset.note === note.name) x.classList.add('correct');
        });
      }
      const sv = document.getElementById('scoreVal');
      if(sv) sv.textContent = session.score;
      session.qIndex++;
      setTimeout(() => { session.locked = false; nextQuestion(); }, correct ? 550 : 1100);
    });
  });
}

/* ---------- TEST PICKER ---------- */
function renderTestPicker(){
  const tests = [
    { key:'staff', icon:'🎼', title:t('staffTest'), q:10, time:60, pass:80 },
    { key:'range', icon:'🎯', title:t('rangeTest'), q:10, time:60, pass:80 },
    { key:'ear',   icon:'👂', title:t('earPractice') + ' ' + t('test'), q:10, time:90, pass:75 }
  ];

  document.getElementById('appContent').innerHTML = \`
    <div class="topbar">
      <div>
        <div class="page-title">🎯 \${t('test')}</div>
        <div class="page-desc">\${t('testDesc')}</div>
      </div>
    </div>
    <div class="mode-picker">
      \${tests.map(tt => {
        const key = tt.key;
        const best = player.bestScores[key] || 0;
        return \`
          <div class="mode-card" onclick="startTestMode('\${key}', \${tt.q}, \${tt.time}, \${tt.pass})">
            <div class="icon">\${tt.icon}</div>
            <div class="title">\${tt.title}</div>
            <div class="desc">\${tt.q} \${t('questions')} · \${tt.time}s · \${t('passScore')} \${tt.pass}%</div>
            \${best ? \`<div style="margin-top:8px;font-size:12px;color:var(--gold)">Best: \${best}%</div>\` : ''}
          </div>
        \`;
      }).join('')}
    </div>
  \`;
}

function startTestMode(type, qTotal, timeLimit, passScore){
  session.mode = 'test';
  session.type = type;
  session.qTotal = qTotal;
  session.timeLimit = timeLimit;
  session.passScore = passScore;
  session.score = 0;
  session.qIndex = 0;
  session.correctCount = 0;
  session.wrongCount = 0;
  session.startTime = Date.now();
  renderSessionFrame();
  nextQuestion();
}

/* ---------- SESSION FINISH ---------- */
function finishSession(){
  stopAllTimers();
  const maxScore = session.qTotal * 10;
  const pct = maxScore ? Math.round(session.score / maxScore * 100) : 0;

  if(session.mode === 'test'){
    const passed = pct >= (session.passScore || 80);
    const key = session.type;
    if(pct > (player.bestScores[key] || 0)) player.bestScores[key] = pct;
    player.testHistory.push({ type: key, pct, time: Date.now() });
    if(player.testHistory.length > 30) player.testHistory.shift();
    save();

    const dur = Math.round((Date.now() - session.startTime) / 1000);
    if(passed) addXP(60); else addXP(20);

    document.getElementById('appContent').innerHTML = \`
      <div class="result-screen">
        <div class="result-icon">\${passed ? '🏆' : '💪'}</div>
        <div class="result-title">\${passed ? t('passed') : t('failed')}</div>
        <div class="result-score \${passed ? 'pass' : 'fail'}">\${pct}%</div>
        <div class="result-meta">
          \${t('correctCount')}: \${session.correctCount} / \${session.qTotal} · \${t('time')}: \${dur}s<br>
          \${passed ? '+60 XP' : '+20 XP'}
        </div>
        <div class="result-actions">
          <button class="btn-secondary" onclick="renderTestPicker()">\${t('backToTests')}</button>
          <button class="btn-primary" onclick="startTestMode('\${session.type}', \${session.qTotal}, \${session.timeLimit}, \${session.passScore})">\${t('tryAgain')}</button>
        </div>
      </div>
    \`;
  } else {
    // Practice finished
    document.getElementById('appContent').innerHTML = \`
      <div class="result-screen">
        <div class="result-icon">✅</div>
        <div class="result-title">\${t('testComplete')}</div>
        <div class="result-score pass">\${pct}%</div>
        <div class="result-meta">
          \${t('correctCount')}: \${session.correctCount} / \${session.qTotal}
        </div>
        <div class="result-actions">
          <button class="btn-secondary" onclick="renderPracticePicker()">\${t('exit')}</button>
          <button class="btn-primary" onclick="startPracticeMode('\${session.type}')">\${t('tryAgain')}</button>
        </div>
      </div>
    \`;
  }
}

/* ---------- PIANO ---------- */
function renderPiano(){
  const notes = [
    { n:'C4', hz:261.63, black:false },
    { n:'C#4', hz:277.18, black:true },
    { n:'D4', hz:293.66, black:false },
    { n:'D#4', hz:311.13, black:true },
    { n:'E4', hz:329.63, black:false },
    { n:'F4', hz:349.23, black:false },
    { n:'F#4', hz:369.99, black:true },
    { n:'G4', hz:392.00, black:false },
    { n:'G#4', hz:415.30, black:true },
    { n:'A4', hz:440.00, black:false },
    { n:'A#4', hz:466.16, black:true },
    { n:'B4', hz:493.88, black:false },
    { n:'C5', hz:523.25, black:false },
    { n:'C#5', hz:554.37, black:true },
    { n:'D5', hz:587.33, black:false },
    { n:'D#5', hz:622.25, black:true },
    { n:'E5', hz:659.25, black:false }
  ];

  document.getElementById('appContent').innerHTML = \`
    <div class="topbar">
      <div>
        <div class="page-title">🎹 \${t('piano')}</div>
        <div class="page-desc">\${t('pianoDesc')}</div>
      </div>
    </div>
    <div class="card" style="text-align:center">
      <h3 style="margin-bottom:18px">\${language==='zh'?'点击琴键听音':'Click keys to hear pitches'}</h3>
      <div class="piano" id="pianoRow"></div>
    </div>
  \`;

  const row = document.getElementById('pianoRow');
  notes.forEach(n => {
    if(n.black){
      const last = row.lastChild;
      if(last){
        const bk = document.createElement('button');
        bk.className = 'black-key';
        bk.textContent = n.n.replace('4','').replace('5','');
        bk.dataset.hz = n.hz;
        bk.addEventListener('click', () => {
          playNote(n.hz, 0.8);
          bk.classList.add('hit');
          setTimeout(() => bk.classList.remove('hit'), 180);
        });
        last.appendChild(bk);
      }
    } else {
      const wk = document.createElement('button');
      wk.className = 'white-key';
      wk.textContent = n.n;
      wk.dataset.hz = n.hz;
      wk.addEventListener('click', () => {
        playNote(n.hz, 0.8);
        wk.classList.add('hit');
        setTimeout(() => wk.classList.remove('hit'), 180);
      });
      row.appendChild(wk);
    }
  });
}

/* ---------- PROGRESS ---------- */
function renderProgress(){
  const acc = player.totalQuestions ? Math.round(player.correct / player.totalQuestions * 100) : 0;

  document.getElementById('appContent').innerHTML = \`
    <div class="topbar">
      <div>
        <div class="page-title">📊 \${t('progress')}</div>
        <div class="page-desc">\${t('progressDesc')}</div>
      </div>
    </div>

    <div class="grid">
      <div class="card">
        <div class="stat-label">\${t('totalQuestions')}</div>
        <div class="stat-num">\${player.totalQuestions}</div>
      </div>
      <div class="card">
        <div class="stat-label">\${t('correctCount')}</div>
        <div class="stat-num" style="color:var(--green)">\${player.correct}</div>
      </div>
      <div class="card">
        <div class="stat-label">\${t('wrongCount')}</div>
        <div class="stat-num" style="color:var(--red)">\${player.wrong}</div>
      </div>
      <div class="card">
        <div class="stat-label">\${t('accuracy')}</div>
        <div class="stat-num">\${acc}%</div>
      </div>
    </div>

    <div class="section">
      <div class="section-title">\${t('mastery')}</div>
      <div class="card">
        \${skillBar(t('noteReading'), skillPct('noteReading'))}
        \${skillBar(t('rangeRecognition'), skillPct('rangeRecognition'))}
        \${skillBar(t('earTraining'), skillPct('earTraining'))}
      </div>
    </div>

    <div class="section">
      <div class="section-title">\${t('lessons')}</div>
      <div class="card">
        <div style="display:flex;justify-content:space-between;margin-bottom:10px">
          <span>\${player.lessonsCompleted.length} / \${LESSONS.length}</span>
          <strong>\${Math.round(player.lessonsCompleted.length / LESSONS.length * 100)}%</strong>
        </div>
        <div class="progress">
          <div style="width:\${player.lessonsCompleted.length / LESSONS.length * 100}%"></div>
        </div>
      </div>
    </div>

    \${player.testHistory.length ? \`
      <div class="section">
        <div class="section-title">\${language==='zh'?'最近测试':'Recent Tests'}</div>
        <div class="card">
          \${player.testHistory.slice(-8).reverse().map(h => \`
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--line);font-size:13px">
              <span>\${typeTitle(h.type)}</span>
              <strong style="color:\${h.pct >= 80 ? 'var(--green)' : h.pct >= 60 ? 'var(--gold)' : 'var(--red)'}">\${h.pct}%</strong>
            </div>
          \`).join('')}
        </div>
      </div>
    \` : ''}
  \`;
}

/* ---------- LANGUAGE ---------- */
function setLanguage(lang){
  language = lang;
  save();
  // Re-render current page
  navigateTo(currentPage);
}

/* ---------- RESET ---------- */
function resetProgress(){
  if(confirm(t('confirmReset'))){
    localStorage.removeItem('nv_player_v2');
    player = JSON.parse(JSON.stringify(DEFAULT_PLAYER));
    save();
    navigateTo('dashboard');
    notify('🔄 ' + (language === 'zh' ? '已重置' : 'Reset'));
  }
}

/* ---------- KEYBOARD ---------- */
document.addEventListener('keydown', e => {
  if(e.key === 'Escape') closeModal();
});

/* ---------- RESIZE ---------- */
window.addEventListener('resize', () => {
  // Re-draw any visible staff canvases
  const cvs = document.querySelectorAll('.staff-canvas, #qCanvas, #lessonCanvas');
  cvs.forEach(c => {
    if(c.id === 'qCanvas' && session.current){
      drawStaff(c, { clef: session.current.clef, notePos: session.current.note.pos });
    }
  });
});

/* ---------- INIT ---------- */
window.openLesson = openLesson;
window.completeLesson = completeLesson;
window.closeModal = closeModal;
window.setLanguage = setLanguage;
window.startPracticeMode = startPracticeMode;
window.startTestMode = startTestMode;
window.renderPracticePicker = renderPracticePicker;
window.renderTestPicker = renderTestPicker;
window.resetProgress = resetProgress;

updatePlayerUI();
renderDashboard();

<\/script>
</body>
</html>`;

  window.initGame = function initGame(wrapper) {
    if (!wrapper || typeof wrapper.replaceChildren !== 'function') {
      throw new Error('initGame requires a container element.');
    }
    var frame = document.createElement('iframe');
    frame.title = 'NoteVerse · Music Staff Master';
    frame.setAttribute('allow', 'autoplay; fullscreen');
    frame.style.cssText = 'display:block;width:100%;height:100%;min-height:780px;border:0;border-radius:16px;background:#0d1117;overflow:hidden;';
    frame.srcdoc = gameHTML;
    wrapper.replaceChildren(frame);
    return frame;
  };
})();
