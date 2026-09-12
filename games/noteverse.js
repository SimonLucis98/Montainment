/* NoteVerse · Music Staff Master v3 — JS Wrapper */
(function () {
  'use strict';

  const gameHTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>NoteVerse · Music Staff Master v3</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--bg:#0d1117;--panel:#161b24;--line:#2a3242;--text:#f0f3f9;--muted:#8894a8;--accent:#7c5cff;--accent2:#00d4ff;--green:#35d07f;--red:#ff5573;--gold:#ffc857;--blue:#4aa3ff;--purple:#b46cff}
body{background:radial-gradient(circle at 15% 10%,rgba(124,92,255,.12),transparent 32%),radial-gradient(circle at 85% 15%,rgba(0,212,255,.08),transparent 32%),var(--bg);color:var(--text);font-family:'Segoe UI',Arial,sans-serif;min-height:100vh;overflow-x:hidden}
button{border:0;cursor:pointer;color:white;font-weight:600;font-family:inherit}
button:disabled{opacity:.4;cursor:not-allowed}
.app{display:flex;min-height:100vh}
.sidebar{width:250px;background:rgba(18,22,30,.97);border-right:1px solid var(--line);padding:20px 14px;position:fixed;left:0;top:0;bottom:0;overflow-y:auto}
.logo{font-size:22px;font-weight:900;margin-bottom:2px;letter-spacing:.5px}
.logo span{color:var(--accent)}
.subtitle{font-size:11px;color:var(--muted);margin-bottom:20px;letter-spacing:.5px}
.player-card{background:linear-gradient(135deg,#232c3d,#161b24);padding:14px;border-radius:12px;margin-bottom:18px;border:1px solid rgba(124,92,255,.15)}
.player-row{display:flex;justify-content:space-between;align-items:center}
.player-row strong{font-size:14px}
.rank{color:var(--gold);font-size:12px;font-weight:700}
.level-line{font-size:11px;color:var(--muted);margin-top:6px}
.xpbar{height:6px;background:#2a3242;border-radius:10px;margin-top:9px;overflow:hidden}
.xpfill{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));transition:width .4s}
.nav-title{font-size:10px;color:#566073;text-transform:uppercase;letter-spacing:1.2px;margin:16px 8px 6px;font-weight:700}
.nav button{width:100%;text-align:left;background:transparent;padding:10px 12px;border-radius:9px;margin-bottom:2px;color:#b8c2d1;font-size:13px;font-weight:500;transition:.15s}
.nav button:hover{background:#1e2431;color:white}
.nav button.active{background:#232b3d;color:white;box-shadow:inset 3px 0 var(--accent)}
.main{margin-left:250px;width:calc(100% - 250px);padding:26px 32px}
.topbar{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:24px;flex-wrap:wrap;gap:14px}
.page-title{font-size:26px;font-weight:800;letter-spacing:-.5px}
.page-desc{color:var(--muted);margin-top:4px;font-size:14px}
.lang-switch{display:flex;gap:4px;background:#181d27;padding:3px;border-radius:10px;border:1px solid var(--line)}
.lang-switch button{padding:6px 12px;border-radius:7px;background:transparent;color:#aeb6c5;font-size:12px}
.lang-switch button.active{background:var(--accent);color:white}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:14px}
.card{background:rgba(22,27,36,.92);border:1px solid var(--line);border-radius:14px;padding:18px}
.stat-num{font-size:28px;font-weight:900;margin-top:4px;letter-spacing:-1px}
.stat-label{color:var(--muted);font-size:12px;text-transform:uppercase;letter-spacing:.8px;font-weight:600}
.section{margin-top:26px}
.section-title{font-size:17px;font-weight:800;margin-bottom:12px;letter-spacing:-.3px}
.lesson-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}
.lesson{background:linear-gradient(145deg,#1c2230,#141a23);border:1px solid var(--line);padding:16px;border-radius:14px;transition:.2s;position:relative}
.lesson:hover{transform:translateY(-2px);border-color:#3d4a60}
.lesson.locked{opacity:.45}
.lesson-icon{font-size:30px;margin-bottom:8px}
.lesson h3{font-size:15px;margin-bottom:5px;font-weight:700}
.lesson p{color:var(--muted);font-size:12px;line-height:1.5;min-height:34px;margin-bottom:10px}
.lesson-meta{display:flex;justify-content:space-between;align-items:center;font-size:11px;color:var(--muted);margin-bottom:9px}
.lesson button.primary{background:linear-gradient(135deg,var(--accent),#6242dd);padding:8px 14px;border-radius:8px;font-size:12px;width:100%;transition:.15s}
.lesson button.primary:hover{filter:brightness(1.15)}
.staff-wrap{background:#fbf8f0;border-radius:14px;padding:16px;display:flex;justify-content:center;overflow:hidden;position:relative}
canvas.staff-canvas{display:block;max-width:100%;height:auto;background:transparent}
.staff-interactive{cursor:crosshair}
.game-wrap{max-width:860px;margin:0 auto}
.game-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;flex-wrap:wrap;gap:12px}
.timer-box{background:#1c2230;border:1px solid var(--line);border-radius:10px;padding:8px 16px;font-weight:700;font-size:18px;font-variant-numeric:tabular-nums}
.timer-box.warn{color:var(--red);animation:pulse 1s infinite}
@keyframes pulse{50%{opacity:.6}}
.score-box{background:#1c2230;border:1px solid var(--line);border-radius:10px;padding:8px 16px;font-weight:700;color:var(--gold);font-size:16px}
.question{text-align:center;font-size:19px;font-weight:600;margin:20px 0;color:#e2e8f2}
.answers{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}
.answer{background:#242b3a;border:2px solid #394153;padding:14px 10px;border-radius:11px;font-size:16px;font-weight:700;transition:.15s;position:relative}
.answer:hover:not(:disabled){border-color:var(--accent);background:#2b3242}
.answer.correct{background:#16442f;border-color:var(--green);color:#a8ffd0}
.answer.wrong{background:#4a1c28;border-color:var(--red);color:#ffc4d0}
.piano-tool{display:flex;justify-content:center;margin:20px 0;position:relative;height:160px;flex-wrap:nowrap;overflow-x:auto;padding:0 10px}
.wkey{width:48px;height:160px;background:#f8f6f0;border:1px solid #999;color:#333;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:10px;font-size:10px;font-weight:600;border-radius:0 0 6px 6px;position:relative;transition:.1s;flex-shrink:0}
.wkey:hover{background:#efece2}
.wkey.hit{background:var(--gold)}
.wkey.correct{background:var(--green)}
.wkey.wrong{background:var(--red)}
.wkey .lbl{color:#333;font-weight:700}
.wkey .note-lbl{color:#888;font-size:9px;margin-top:2px}
.wkey.no-lbl .note-lbl{visibility:hidden}
.bkey{position:absolute;top:0;right:-16px;width:32px;height:100px;background:#1a1a1a;border-radius:0 0 5px 5px;z-index:2;color:transparent;font-size:9px;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:8px;transition:.1s}
.bkey:hover{background:#2a2a2a;color:#aaa}
.bkey.hit{background:var(--gold)}
.bkey .note-lbl{visibility:hidden}
.bkey.no-lbl+.note-lbl{visibility:hidden}
.modal{position:fixed;inset:0;background:rgba(0,0,0,.78);display:none;align-items:center;justify-content:center;z-index:100;padding:20px}
.modal.open{display:flex}
.modal-content{width:min(760px,100%);max-height:88vh;overflow-y:auto;background:#161b24;border:1px solid var(--line);border-radius:18px;padding:26px;position:relative}
.modal-close{position:absolute;top:16px;right:16px;background:#2a3242;width:32px;height:32px;border-radius:50%;font-size:18px;line-height:1}
.modal h2{font-size:22px;margin-bottom:16px}
.modal h3{font-size:16px;margin:16px 0 8px;color:var(--accent2)}
.modal p{line-height:1.7;color:#c8d2e0;margin-bottom:10px;font-size:14px}
.modal ul,.modal ol{margin:8px 0 16px 20px;color:#c8d2e0;line-height:1.8;font-size:14px}
.note-example{background:#1c2230;padding:10px 14px;border-radius:8px;font-family:monospace;font-size:14px;color:var(--gold);margin:8px 0}
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
.progress{height:8px;background:#2a3242;border-radius:20px;overflow:hidden}
.progress div{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));transition:width .5s}
.notify{position:fixed;top:20px;right:20px;z-index:200;background:#232b3d;color:white;padding:12px 20px;border-radius:12px;font-weight:600;font-size:14px;box-shadow:0 10px 30px rgba(0,0,0,.5);animation:slideIn .3s ease;border-left:3px solid var(--accent)}
@keyframes slideIn{from{transform:translateX(120%)}to{transform:translateX(0)}}
.mode-picker{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:14px}
.mode-card{background:linear-gradient(145deg,#1c2230,#141a23);border:1px solid var(--line);padding:22px 18px;border-radius:14px;cursor:pointer;transition:.2s;text-align:center}
.mode-card:hover{border-color:var(--accent);transform:translateY(-3px)}
.mode-card .icon{font-size:42px;margin-bottom:10px}
.mode-card .title{font-size:15px;font-weight:700;margin-bottom:6px}
.mode-card .desc{font-size:12px;color:var(--muted);line-height:1.5}
.tab-bar{display:flex;gap:6px;margin-bottom:16px;background:#181d27;padding:4px;border-radius:12px;border:1px solid var(--line);flex-wrap:wrap}
.tab-bar button{padding:8px 16px;border-radius:8px;background:transparent;color:#aeb6c5;font-size:13px;transition:.15s}
.tab-bar button.active{background:var(--accent);color:white}
.target-note{display:inline-block;background:linear-gradient(135deg,var(--accent),#6242dd);padding:14px 32px;border-radius:14px;font-size:32px;font-weight:900;letter-spacing:1px;color:white;margin:12px 0}
.target-melody{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin:16px 0}
.melody-note{background:#1c2230;border:2px solid var(--line);padding:10px 18px;border-radius:10px;font-size:18px;font-weight:700;color:#aeb6c5;transition:.2s}
.melody-note.current{border-color:var(--gold);color:var(--gold);transform:scale(1.08)}
.melody-note.done{background:#16442f;border-color:var(--green);color:#a8ffd0}
.melody-note.failed{background:#4a1c28;border-color:var(--red);color:#ffc4d0}
@media(max-width:820px){
  .sidebar{position:relative;width:100%;height:auto;padding:14px}
  .app{display:block}
  .main{margin-left:0;width:100%;padding:18px}
  .player-card{display:none}
  .wkey{width:38px;height:130px}
  .bkey{width:26px;height:80px;right:-13px}
}
</style>
</head>
<body>
<div class="app">
<aside class="sidebar">
  <div class="logo">Note<span>Verse</span></div>
  <div class="subtitle">Music Staff Master v3</div>
  <div class="player-card">
    <div class="player-row">
      <strong id="playerName">Music Student</strong>
      <span class="rank" id="playerRank">Beginner</span>
    </div>
    <div class="level-line">Lv <span id="level">1</span> · <span id="xp">0</span> XP</div>
    <div class="xpbar"><div class="xpfill" id="xpFill"></div></div>
  </div>
  <div class="nav">
    <div class="nav-title" data-i18n="navMain">Main</div>
    <button class="active" data-page="dashboard" data-i18n="navDash">🏠 Dashboard</button>
    <button data-page="academy" data-i18n="navAcademy">📚 Academy</button>
    <button data-page="practice" data-i18n="navPractice">✏️ Practice</button>
    <button data-page="test" data-i18n="navTest">🎯 Test</button>
    <div class="nav-title" data-i18n="navTools">Tools</div>
    <button data-page="piano" data-i18n="navPiano">🎹 Piano</button>
    <button data-page="sheet" data-i18n="navSheet">✍️ Sheet</button>
    <button data-page="progress" data-i18n="navProgress">📊 Progress</button>
  </div>
</aside>
<main class="main"><div id="appContent"></div></main>
</div>
<div class="modal" id="modal"><div class="modal-content"><button class="modal-close" onclick="closeModal()">×</button><div id="modalContent"></div></div></div>
<script>
/* ============ I18N ============ */
let language = localStorage.getItem('nv_language') || 'zh';
const I18N = {
  zh: {
    navMain:'主菜单',navDash:'🏠 控制台',navAcademy:'📚 音乐学院',navPractice:'✏️ 练习',navTest:'🎯 测试',navTools:'工具',navPiano:'🎹 钢琴',navSheet:'✍️ 五线谱',navProgress:'📊 进度',
    dashTitle:'音乐大师学院',dashDesc:'学习 · 练习 · 测试 五线谱与音域',
    xp:'经验',level:'等级',accuracy:'正确率',streak:'连胜',mastery:'掌握度',
    academy:'音乐学院',academyDesc:'从零基础到大师的完整学习路径',
    practice:'练习中心',practiceDesc:'自由练习，不计时，不计分',
    test:'测试中心',testDesc:'限时测试，检验你的真实掌握程度',
    piano:'钢琴工具',pianoDesc:'看五线谱弹琴，练习音高识别',
    sheet:'五线谱工具',sheetDesc:'练习写音符，掌握五线谱位置',
    progress:'学习进度',progressDesc:'查看你的掌握情况',
    startLearn:'开始学习',startPractice:'开始练习',startTest:'开始测试',locked:'🔒 未解锁',
    lessons:'课程',practiceModes:'练习模式',testModes:'测试模式',
    staffPractice:'五线谱练习',rangePractice:'音域练习',earPractice:'听音练习',
    staffTest:'五线谱测试',rangeTest:'音域测试',earTest:'听音测试',
    readStaff:'看谱选音名',identifyRange:'判断音域',listenNote:'听音辨位',
    timeLimit:'限时',questions:'题',passScore:'通过分',startNow:'开始',
    score:'得分',time:'时间',question:'第',
    whatNote:'这是什么音？',whatRange:'这个音属于哪个音域？',
    low:'低音域',mid:'中音域',high:'高音域',
    correct:'答对了！',wrong:'答错了，正确答案是',testComplete:'完成',
    passed:'通过！',failed:'未通过',tryAgain:'再试一次',backToTests:'返回测试中心',exit:'退出',
    totalQuestions:'总题数',correctCount:'答对',wrongCount:'答错',finalScore:'最终得分',
    playNote:'▶ 播放音符',playAgain:'🔁 再听一次',replay:'再听一遍',
    reset:'重置进度',confirmReset:'确定要重置所有进度吗？',
    noteReading:'五线谱阅读',rangeRecognition:'音域识别',earTraining:'听音能力',
    beginner:'初学者',novice:'新手',apprentice:'学徒',student:'学员',performer:'演奏者',composer:'作曲家',expert:'专家',master:'大师',grandmaster:'宗师',
    treble:'高音谱号',bass:'低音谱号',
    /* Piano & Sheet */
    freePlay:'自由弹奏',practiceTab:'练习',practicalTab:'实战',
    pianoFreeTitle:'自由弹奏',pianoFreeDesc:'点击琴键听音，探索音高',
    pianoPracticeTitle:'看谱弹奏（带提示）',pianoPracticeDesc:'五线谱显示音符，琴键上显示音名标签',
    pianoPracticalTitle:'看谱弹奏（无提示）',pianoPracticalDesc:'只有五线谱，不看音名标签，凭记忆找到正确琴键',
    sheetFreeTitle:'自由写谱',sheetFreeDesc:'点击五线谱放置音符，自由创作',
    sheetPracticeTitle:'音符定位练习',sheetPracticeDesc:'把指定音符写在五线谱的正确位置',
    sheetPracticalTitle:'旋律听写实战',sheetPracticalDesc:'依次填入整段旋律，全部正确才算通过',
    targetNote:'目标音符',yourNote:'你的答案',correctAnswer:'正确答案',
    clickStaffPrompt:'点击五线谱放置音符',clickStaffToPlace:'点击五线谱的正确位置',
    pressCorrectKey:'请按下正确的琴键',pressWithoutLabels:'凭你的记忆按下正确的琴键',
    showLabels:'显示音名',hideLabels:'隐藏音名',
    submitAnswer:'提交',clear:'清空',confirmNote:'确认',
    roundXofY:'第 {0} 题 / 共 {1} 题',
    finishPractice:'完成练习',
    writeThisNote:'请在五线谱上写出：',
    writeThisMelody:'请依次写出这段旋律：',
    completedMelody:'恭喜完成旋律！',
    positionCorrect:'位置正确！',positionWrong:'位置错误，正确答案已在谱上标出',
    staffNoteCorrect:'弹对了！',staffNoteWrong:'弹错了，正确琴键已高亮'
  },
  en: {
    navMain:'Main',navDash:'🏠 Dashboard',navAcademy:'📚 Academy',navPractice:'✏️ Practice',navTest:'🎯 Test',navTools:'Tools',navPiano:'🎹 Piano',navSheet:'✍️ Sheet',navProgress:'📊 Progress',
    dashTitle:'Music Master Academy',dashDesc:'Learn · Practice · Test music staff & range',
    xp:'XP',level:'Level',accuracy:'Accuracy',streak:'Streak',mastery:'Mastery',
    academy:'Academy',academyDesc:'From zero to master — complete learning path',
    practice:'Practice',practiceDesc:'Free practice. No timer. No pressure.',
    test:'Test Center',testDesc:'Timed exams. Test your true mastery.',
    piano:'Piano Tool',pianoDesc:'Play from staff notation, train pitch recognition',
    sheet:'Sheet Tool',sheetDesc:'Practice writing notes on the staff',
    progress:'Progress',progressDesc:'Track your mastery',
    startLearn:'Learn',startPractice:'Practice',startTest:'Start Test',locked:'🔒 Locked',
    lessons:'Lessons',practiceModes:'Practice Modes',testModes:'Test Modes',
    staffPractice:'Staff Practice',rangePractice:'Range Practice',earPractice:'Ear Training',
    staffTest:'Staff Test',rangeTest:'Range Test',earTest:'Ear Test',
    readStaff:'Read the note',identifyRange:'Identify the range',listenNote:'Listen and identify',
    timeLimit:'Time',questions:'Q',passScore:'Pass',startNow:'Start',
    score:'Score',time:'Time',question:'Q',
    whatNote:'What note is this?',whatRange:'Which range does this note belong to?',
    low:'Low',mid:'Middle',high:'High',
    correct:'Correct!',wrong:'Wrong. Answer: ',testComplete:'Complete',
    passed:'Passed!',failed:'Not Passed',tryAgain:'Try Again',backToTests:'Back to Tests',exit:'Exit',
    totalQuestions:'Total',correctCount:'Correct',wrongCount:'Wrong',finalScore:'Score',
    playNote:'▶ Play Note',playAgain:'🔁 Play Again',replay:'Replay',
    reset:'Reset Progress',confirmReset:'Reset all progress?',
    noteReading:'Note Reading',rangeRecognition:'Range Recognition',earTraining:'Ear Training',
    beginner:'Beginner',novice:'Novice',apprentice:'Apprentice',student:'Student',performer:'Performer',composer:'Composer',expert:'Expert',master:'Master',grandmaster:'Grandmaster',
    treble:'Treble',bass:'Bass',
    freePlay:'Free Play',practiceTab:'Practice',practicalTab:'Practical',
    pianoFreeTitle:'Free Play',pianoFreeDesc:'Click keys to hear pitches and explore',
    pianoPracticeTitle:'Play from Staff (with labels)',pianoPracticeDesc:'Staff shows the note; keys show note-name labels',
    pianoPracticalTitle:'Play from Staff (no labels)',pianoPracticalDesc:'Only the staff is shown — find the correct key from memory',
    sheetFreeTitle:'Free Writing',sheetFreeDesc:'Click the staff to place notes freely',
    sheetPracticeTitle:'Note Placement Practice',sheetPracticeDesc:'Write the given note at the correct staff position',
    sheetPracticalTitle:'Melody Dictation',sheetPracticalDesc:'Fill in a whole melody — all correct to pass',
    targetNote:'Target Note',yourNote:'Your Answer',correctAnswer:'Correct Answer',
    clickStaffPrompt:'Click the staff to place a note',clickStaffToPlace:'Click the correct position on the staff',
    pressCorrectKey:'Press the correct key',pressWithoutLabels:'Press the correct key from memory',
    showLabels:'Show Labels',hideLabels:'Hide Labels',
    submitAnswer:'Submit',clear:'Clear',confirmNote:'Confirm',
    roundXofY:'Round {0} / {1}',
    finishPractice:'Finish Practice',
    writeThisNote:'Write this note on the staff:',
    writeThisMelody:'Write this melody one by one:',
    completedMelody:'Melody complete!',
    positionCorrect:'Correct position!',positionWrong:'Wrong. Correct position shown in red.',
    staffNoteCorrect:'Correct key!',staffNoteWrong:'Wrong. Correct key highlighted.'
  }
};
function t(k){
  const s = I18N[language][k];
  if(s === undefined) return I18N.en[k] || k;
  return s;
}

/* ============ NOTE DATA ============ */
const TREBLE_NOTES = [
  {name:'C4',pos:-2,hz:261.63,range:'mid'},
  {name:'D4',pos:-1,hz:293.66,range:'mid'},
  {name:'E4',pos:0, hz:329.63,range:'mid'},
  {name:'F4',pos:1, hz:349.23,range:'mid'},
  {name:'G4',pos:2, hz:392.00,range:'mid'},
  {name:'A4',pos:3, hz:440.00,range:'mid'},
  {name:'B4',pos:4, hz:493.88,range:'mid'},
  {name:'C5',pos:5, hz:523.25,range:'high'},
  {name:'D5',pos:6, hz:587.33,range:'high'},
  {name:'E5',pos:7, hz:659.25,range:'high'},
  {name:'F5',pos:8, hz:698.46,range:'high'},
  {name:'G5',pos:9, hz:783.99,range:'high'},
  {name:'A5',pos:10,hz:880.00,range:'high'}
];
const BASS_NOTES = [
  {name:'C2',pos:-4,hz:65.41,range:'low'},
  {name:'D2',pos:-3,hz:73.42,range:'low'},
  {name:'E2',pos:-2,hz:82.41,range:'low'},
  {name:'F2',pos:-1,hz:87.31,range:'low'},
  {name:'G2',pos:0, hz:98.00,range:'low'},
  {name:'A2',pos:1, hz:110.00,range:'low'},
  {name:'B2',pos:2, hz:123.47,range:'low'},
  {name:'C3',pos:3, hz:130.81,range:'low'},
  {name:'D3',pos:4, hz:146.83,range:'low'},
  {name:'E3',pos:5, hz:164.81,range:'low'},
  {name:'F3',pos:6, hz:174.61,range:'low'},
  {name:'G3',pos:7, hz:196.00,range:'low'},
  {name:'A3',pos:8, hz:220.00,range:'low'}
];
/* All notes mapped to treble staff positions (for sheet writing) */
const ALL_TREBLE_POSITIONS = {};
TREBLE_NOTES.forEach(n => ALL_TREBLE_POSITIONS[n.name] = n.pos);

/* Piano notes C4-B5 with black keys */
const PIANO_NOTES = [
  {n:'C4', hz:261.63, black:false},
  {n:'C#4',hz:277.18, black:true},
  {n:'D4', hz:293.66, black:false},
  {n:'D#4',hz:311.13, black:true},
  {n:'E4', hz:329.63, black:false},
  {n:'F4', hz:349.23, black:false},
  {n:'F#4',hz:369.99, black:true},
  {n:'G4', hz:392.00, black:false},
  {n:'G#4',hz:415.30, black:true},
  {n:'A4', hz:440.00, black:false},
  {n:'A#4',hz:466.16, black:true},
  {n:'B4', hz:493.88, black:false},
  {n:'C5', hz:523.25, black:false},
  {n:'C#5',hz:554.37, black:true},
  {n:'D5', hz:587.33, black:false},
  {n:'D#5',hz:622.25, black:true},
  {n:'E5', hz:659.25, black:false},
  {n:'F5', hz:698.46, black:false},
  {n:'F#5',hz:739.99, black:true},
  {n:'G5', hz:783.99, black:false},
  {n:'G#5',hz:830.61, black:true},
  {n:'A5', hz:880.00, black:false},
  {n:'A#5',hz:932.33, black:true},
  {n:'B5', hz:987.77, black:false}
];
const NATURAL_PIANO = PIANO_NOTES.filter(n => !n.black);

/* ============ PLAYER ============ */
const DEFAULT_PLAYER = {
  xp:0,level:1,streak:0,correct:0,wrong:0,totalQuestions:0,
  lessonsCompleted:[],
  skills:{noteReading:{c:0,w:0},rangeRecognition:{c:0,w:0},earTraining:{c:0,w:0}},
  testHistory:[],bestScores:{}
};
let player = JSON.parse(localStorage.getItem('nv_player_v3') || 'null') || JSON.parse(JSON.stringify(DEFAULT_PLAYER));
function save(){
  localStorage.setItem('nv_player_v3', JSON.stringify(player));
  localStorage.setItem('nv_language', language);
  updatePlayerUI();
}
function updatePlayerUI(){
  document.getElementById('xp').textContent = player.xp;
  document.getElementById('level').textContent = player.level;
  const ranks = ['beginner','novice','apprentice','student','performer','composer','expert','master','grandmaster'];
  document.getElementById('playerRank').textContent = t(ranks[Math.min(player.level-1,ranks.length-1)]);
  document.getElementById('xpFill').style.width = (player.xp % 100) + '%';
}
function addXP(n){
  player.xp += n;
  const nl = Math.floor(player.xp/100)+1;
  if(nl > player.level){ player.level = nl; notify('🎉 ' + t('level') + ' ' + nl); }
  save();
}
function recordSkill(skill, ok){
  if(!player.skills[skill]) player.skills[skill] = {c:0,w:0};
  if(ok) player.skills[skill].c++; else player.skills[skill].w++;
  player.totalQuestions++;
  if(ok){ player.correct++; player.streak++; } else { player.wrong++; player.streak=0; }
  save();
}
function skillPct(k){
  const s = player.skills[k];
  if(!s) return 0;
  const tot = s.c+s.w;
  return tot ? Math.round(s.c/tot*100) : 0;
}

/* ============ NOTIFY ============ */
function notify(msg){
  const d = document.createElement('div');
  d.className = 'notify';
  d.textContent = msg;
  document.body.appendChild(d);
  setTimeout(()=>d.remove(), 2400);
}

/* ============ AUDIO ============ */
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
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'sine';
    o.frequency.value = hz;
    o.connect(g); g.connect(c.destination);
    const t0 = c.currentTime;
    const d = dur || 0.9;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(0.25, t0 + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t0 + d);
    o.start(t0); o.stop(t0 + d + 0.05);
  }catch(e){}
}
function sfxCorrect(){
  try{
    const c = getAudio();
    [523.25,659.25,783.99].forEach((f,i)=>{
      const o = c.createOscillator(), g = c.createGain();
      o.type='sine'; o.frequency.value=f;
      o.connect(g); g.connect(c.destination);
      const t0 = c.currentTime + i*0.08;
      g.gain.setValueAtTime(0,t0);
      g.gain.linearRampToValueAtTime(0.15,t0+0.02);
      g.gain.exponentialRampToValueAtTime(0.001,t0+0.2);
      o.start(t0); o.stop(t0+0.25);
    });
  }catch(e){}
}
function sfxWrong(){
  try{
    const c = getAudio();
    const o = c.createOscillator(), g = c.createGain();
    o.type='sawtooth'; o.frequency.value=180;
    o.connect(g); g.connect(c.destination);
    const t0 = c.currentTime;
    g.gain.setValueAtTime(0.15, t0);
    g.gain.exponentialRampToValueAtTime(0.001, t0+0.25);
    o.start(t0); o.stop(t0+0.3);
  }catch(e){}
}

/* ============ STAFF RENDERER ============ */
function drawStaff(canvas, opts){
  opts = opts || {};
  const dpr = window.devicePixelRatio || 1;
  const W = canvas.clientWidth || 500;
  const H = canvas.clientHeight || 220;
  canvas.width = W*dpr;
  canvas.height = H*dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr,0,0,dpr,0,0);
  ctx.clearRect(0,0,W,H);

  const lineGap = 18;
  const step = lineGap / 2;
  const staffH = lineGap * 4;
  const staffTop = (H - staffH) / 2;
  const staffBottom = staffTop + staffH;
  const lineXStart = W * 0.16;
  const lineXEnd = W * 0.92;

  /* 5 lines */
  ctx.strokeStyle = '#1a1a1a';
  ctx.lineWidth = 1.2;
  for(let i=0;i<5;i++){
    const y = staffTop + i*lineGap;
    ctx.beginPath();
    ctx.moveTo(lineXStart, y);
    ctx.lineTo(lineXEnd, y);
    ctx.stroke();
  }

  /* clef */
  ctx.fillStyle = '#1a1a1a';
  ctx.textBaseline = 'middle';
  if(opts.clef === 'bass'){
    ctx.font = (lineGap*3.4)+'px "Times New Roman",serif';
    ctx.fillText('𝄢', lineXStart - lineGap*2, staffTop + lineGap*1);
  } else {
    ctx.font = (lineGap*4.6)+'px "Times New Roman",serif';
    ctx.fillText('𝄞', lineXStart - lineGap*2.4, staffTop + lineGap*1.9);
  }

  /* notes array */
  const notes = opts.notes || (typeof opts.notePos === 'number' ? [{pos:opts.notePos, color:'#1a1a1a'}] : []);
  const baseX = notes.length > 1 ? W*0.30 : W*0.62;
  const spacing = notes.length > 1 ? (W*0.55 / Math.max(notes.length-1,1)) : 0;

  notes.forEach((note, idx) => {
    const noteX = baseX + idx*spacing;
    const noteY = staffBottom - note.pos*step;
    const col = note.color || '#1a1a1a';

    /* ledger lines */
    if(note.pos <= -2){
      for(let p=-2; p>=note.pos; p-=2){
        const ly = staffBottom - p*step;
        ctx.beginPath();
        ctx.moveTo(noteX-18, ly);
        ctx.lineTo(noteX+18, ly);
        ctx.strokeStyle = col;
        ctx.stroke();
      }
    }
    if(note.pos >= 10){
      for(let p=10; p<=note.pos; p+=2){
        const ly = staffBottom - p*step;
        ctx.beginPath();
        ctx.moveTo(noteX-18, ly);
        ctx.lineTo(noteX+18, ly);
        ctx.strokeStyle = col;
        ctx.stroke();
      }
    }

    /* note head */
    ctx.save();
    ctx.translate(noteX, noteY);
    ctx.rotate(-0.35);
    ctx.beginPath();
    ctx.ellipse(0,0,9,6.5,0,0,Math.PI*2);
    ctx.fillStyle = col;
    ctx.fill();
    ctx.restore();

    /* stem */
    const stemUp = note.pos <= 4;
    ctx.strokeStyle = col;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    if(stemUp){
      ctx.moveTo(noteX+8, noteY);
      ctx.lineTo(noteX+8, noteY - lineGap*3.2);
    } else {
      ctx.moveTo(noteX-8, noteY);
      ctx.lineTo(noteX-8, noteY + lineGap*3.2);
    }
    ctx.stroke();
  });

  return { staffTop, staffBottom, lineGap, step, lineXStart, lineXEnd, W, H };
}

/* Convert click Y to staff position */
function yToPos(clientY, canvas, layout){
  const rect = canvas.getBoundingClientRect();
  const scaleY = layout.H / rect.height;
  const yInCanvas = (clientY - rect.top) * scaleY;
  const pos = Math.round((layout.staffBottom - yInCanvas) / layout.step);
  return pos;
}

/* ============ PAGE NAV ============ */
let currentPage = 'dashboard';
document.querySelectorAll('.nav button').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    document.querySelectorAll('.nav button').forEach(b=>b.classList.remove('active'));
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
    case 'piano': renderPianoTool('free'); break;
    case 'sheet': renderSheetTool('free'); break;
    case 'progress': renderProgress(); break;
  }
}
function refreshNavLabels(){
  document.querySelectorAll('.nav [data-i18n]').forEach(el=>{
    el.textContent = t(el.dataset.i18n);
  });
}

/* ============ DASHBOARD ============ */
function renderDashboard(){
  const acc = player.totalQuestions ? Math.round(player.correct/player.totalQuestions*100) : 0;
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
      <div class="card"><div class="stat-label">\${t('xp')}</div><div class="stat-num">\${player.xp}</div></div>
      <div class="card"><div class="stat-label">\${t('level')}</div><div class="stat-num">\${player.level}</div></div>
      <div class="card"><div class="stat-label">\${t('accuracy')}</div><div class="stat-num">\${acc}%</div></div>
      <div class="card"><div class="stat-label">\${t('streak')}</div><div class="stat-num">🔥 \${player.streak}</div></div>
    </div>
    <div class="section">
      <div class="section-title">\${t('lessons')}</div>
      <div class="lesson-grid">\${LESSONS.slice(0,3).map(l=>lessonCard(l)).join('')}</div>
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
        <button class="btn-secondary" style="padding:10px 20px;border-radius:10px;font-size:13px" onclick="resetProgress()">🔄 \${t('reset')}</button>
      </div>
    </div>
  \`;
}
function skillBar(name, pct){
  return \`<div style="margin-bottom:14px">
    <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:13px"><span>\${name}</span><strong style="color:var(--accent2)">\${pct}%</strong></div>
    <div class="progress"><div style="width:\${pct}%"></div></div>
  </div>\`;
}

/* ============ LESSONS ============ */
const LESSONS = [
  {id:'staff',icon:'🎼',level:1,zh:'五线谱基础',en:'The Staff',zhD:'认识五线谱的线与间',enD:'Learn the 5 lines and 4 spaces'},
  {id:'treble',icon:'𝄞',level:1,zh:'高音谱号',en:'Treble Clef',zhD:'高音谱号及其音高',enD:'Learn the treble clef notes'},
  {id:'bass',icon:'𝄢',level:1,zh:'低音谱号',en:'Bass Clef',zhD:'低音谱号及其音高',enD:'Learn the bass clef notes'},
  {id:'ledger',icon:'📏',level:2,zh:'加线',en:'Ledger Lines',zhD:'认识五线谱外的加线',enD:'Notes outside the staff'},
  {id:'range',icon:'🎯',level:2,zh:'音域简介',en:'Note Range',zhD:'低音域、中音域、高音域',enD:'Low, Middle and High ranges'},
  {id:'values',icon:'♩',level:3,zh:'音符时值',en:'Note Values',zhD:'全音符、二分、四分等',enD:'Whole, half, quarter notes'},
  {id:'rests',icon:'𝄽',level:3,zh:'休止符',en:'Rests',zhD:'各种休止符',enD:'Musical rests'},
  {id:'accid',icon:'♯',level:4,zh:'升降号',en:'Accidentals',zhD:'♯ ♭ ♮',enD:'Sharps, flats, naturals'},
  {id:'key',icon:'🔑',level:5,zh:'调号',en:'Key Signatures',zhD:'大调、小调',enD:'Major and minor keys'},
  {id:'scales',icon:'🎵',level:5,zh:'音阶',en:'Scales',zhD:'大调、小调音阶',enD:'Major and minor scales'}
];
function lessonCard(l){
  const unlocked = player.level >= l.level;
  const done = player.lessonsCompleted.includes(l.id);
  return \`
    <div class="lesson \${!unlocked?'locked':''}">
      <div class="lesson-icon">\${l.icon}</div>
      <h3>\${language==='zh'?l.zh:l.en} \${done?'✅':''}</h3>
      <p>\${language==='zh'?l.zhD:l.enD}</p>
      <div class="lesson-meta"><span>Lv \${l.level}</span></div>
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
    <div class="lesson-grid">\${LESSONS.map(l=>lessonCard(l)).join('')}</div>
  \`;
}

/* ============ LESSON CONTENT (fully bilingual) ============ */
function buildLessonBody(id){
  const L = language;
  const isZh = L === 'zh';

  const H2 = (s) => '<h2>' + s + '</h2>';
  const P  = (s) => '<p>' + s + '</p>';
  const H3 = (s) => '<h3>' + s + '</h3>';
  const EX = (s) => '<div class="note-example">' + s + '</div>';

  switch(id){
    case 'staff': {
      return H2(isZh?'五线谱 / The Staff':'The Staff')
        + P(isZh
            ? '五线谱由 5 条平行的线（Line）和 4 个间（Space）组成。音符的位置决定音高：越往上越高，越往下越低。'
            : 'The staff has 5 parallel lines and 4 spaces. Higher position = higher pitch.')
        + '<div class="staff-wrap" style="margin:16px 0"><canvas class="staff-canvas" id="lessonCanvas" style="width:100%;height:220px"></canvas></div>'
        + H3(isZh?'线与间':'Lines & Spaces')
        + P(isZh
            ? '音符可以写在线上，也可以写在两线之间的间上。'
            : 'Notes can be placed either on a line or in a space between lines.');
    }
    case 'treble': {
      return H2('𝄞 ' + (isZh?'高音谱号':'Treble Clef'))
        + P(isZh
            ? '高音谱号用于中高音区。常用于钢琴右手、小提琴、长笛等乐器。'
            : 'Treble clef is used for higher pitches — piano right hand, violin, flute.')
        + '<div class="staff-wrap" style="margin:16px 0"><canvas class="staff-canvas" id="lessonCanvas" style="width:100%;height:220px"></canvas></div>'
        + H3(isZh?'五条线上的音':'Notes on lines')
        + EX('E4 — G4 — B4 — D5 — F5')
        + H3(isZh?'四个间上的音':'Notes in spaces')
        + EX('F4 — A4 — C5 — E5  (FACE)');
    }
    case 'bass': {
      return H2('𝄢 ' + (isZh?'低音谱号':'Bass Clef'))
        + P(isZh
            ? '低音谱号用于低音区。常用于钢琴左手、大提琴、低音提琴等。'
            : 'Bass clef is used for lower pitches — piano left hand, cello, bass.')
        + '<div class="staff-wrap" style="margin:16px 0"><canvas class="staff-canvas" id="lessonCanvas" style="width:100%;height:220px"></canvas></div>'
        + H3(isZh?'五条线上的音':'Notes on lines')
        + EX('G2 — B2 — D3 — F3 — A3')
        + H3(isZh?'四个间上的音':'Notes in spaces')
        + EX('A2 — C3 — E3 — G3');
    }
    case 'ledger': {
      return H2('📏 ' + (isZh?'加线':'Ledger Lines'))
        + P(isZh
            ? '当音符超出五线谱的范围时，需要画加线（Ledger Line）。中央 C（C4）位于高音谱表下方，需要一条下加一线。'
            : 'Ledger lines extend the staff. Middle C (C4) sits on one ledger line below the treble staff.')
        + '<div class="staff-wrap" style="margin:16px 0"><canvas class="staff-canvas" id="lessonCanvas" style="width:100%;height:220px"></canvas></div>'
        + H3(isZh?'中央 C':'Middle C')
        + P(isZh
            ? 'C4 是连接高音谱表和低音谱表的桥：它同时是高音谱表的下加一线音，也是低音谱表的上加一线音。'
            : 'C4 is the bridge between treble and bass clefs: it sits one ledger line below the treble staff and one ledger line above the bass staff.');
    }
    case 'range': {
      return H2('🎯 ' + (isZh?'音域简介':'Note Range'))
        + P(isZh
            ? '根据音高，音符被归类为三个主要音域：低音域、中音域、高音域。'
            : 'Notes are grouped into three main ranges based on pitch: Low, Middle, High.')
        + '<div class="range-viz" style="background:#141a23;border:1px solid var(--line);border-radius:14px;padding:20px;margin:16px 0">'
        + '<div style="display:flex;justify-content:space-between;font-size:12px;color:var(--muted);margin-bottom:8px"><span>C2</span><span>C4</span><span>C6</span></div>'
        + '<div style="height:38px;background:#1c2230;border-radius:19px;position:relative;overflow:hidden">'
        + '<div style="position:absolute;left:0;top:0;bottom:0;width:33%;background:#2a4a6a;color:#a8d4ff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">' + t('low') + '</div>'
        + '<div style="position:absolute;left:33%;top:0;bottom:0;width:34%;background:#3a2a6a;color:#d4b8ff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">' + t('mid') + '</div>'
        + '<div style="position:absolute;left:67%;top:0;bottom:0;width:33%;background:#6a2a4a;color:#ffb8d4;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700">' + t('high') + '</div>'
        + '</div></div>'
        + H3(t('low') + ' — C2 ' + (isZh?'至':'to') + ' B3')
        + P(isZh
            ? '低音域：大提琴、低音提琴、钢琴左手、男低音歌手。'
            : 'Low range: cello, double bass, piano left hand, bass vocal.')
        + H3(t('mid') + ' — C4 ' + (isZh?'至':'to') + ' B4')
        + P(isZh
            ? '中音域：人声主音区、中提琴、长笛的中音区。'
            : 'Middle range: main vocal range, viola, middle register of the flute.')
        + H3(t('high') + ' — C5 ' + (isZh?'以上':'and above'))
        + P(isZh
            ? '高音域：小提琴高音、女高音、短笛。'
            : 'High range: high violin, soprano, piccolo.');
    }
    case 'values': {
      return H2('♩ ' + (isZh?'音符时值':'Note Values'))
        + P(isZh
            ? '音符的时值决定了它持续多久。'
            : 'Note value = duration of the note.')
        + EX(isZh ? '𝅝 全音符 = 4 拍'   : '𝅝 Whole Note = 4 beats')
        + EX(isZh ? '𝅗𝅥 二分音符 = 2 拍' : '𝅗𝅥 Half Note = 2 beats')
        + EX(isZh ? '♩ 四分音符 = 1 拍'   : '♩ Quarter Note = 1 beat')
        + EX(isZh ? '♪ 八分音符 = 1/2 拍' : '♪ Eighth Note = 1/2 beat')
        + EX(isZh ? '𝅘𝅥𝅯 十六分音符 = 1/4 拍' : '𝅘𝅥𝅯 Sixteenth Note = 1/4 beat');
    }
    case 'rests': {
      return H2('𝄽 ' + (isZh?'休止符':'Rests'))
        + P(isZh
            ? '休止符表示静默，但同样占用时间。'
            : 'A rest means silence — but it still occupies time.')
        + EX(isZh ? '𝄻 全休止符 = 4 拍'   : '𝄻 Whole Rest = 4 beats')
        + EX(isZh ? '𝄼 二分休止符 = 2 拍' : '𝄼 Half Rest = 2 beats')
        + EX(isZh ? '𝄽 四分休止符 = 1 拍' : '𝄽 Quarter Rest = 1 beat')
        + EX(isZh ? '𝄾 八分休止符 = 1/2 拍' : '𝄾 Eighth Rest = 1/2 beat');
    }
    case 'accid': {
      return H2('♯ ' + (isZh?'升降号':'Accidentals'))
        + EX(isZh ? '♯ 升号 — 将音高升高 1 个半音' : '♯ Sharp — raises a pitch by 1 semitone')
        + EX(isZh ? '♭ 降号 — 将音高降低 1 个半音' : '♭ Flat — lowers a pitch by 1 semitone')
        + EX(isZh ? '♮ 还原号 — 取消之前的升或降' : '♮ Natural — cancels a previous sharp or flat');
    }
    case 'key': {
      return H2('🔑 ' + (isZh?'调号':'Key Signatures'))
        + P(isZh
            ? '调号告诉你在整首曲子里哪些音要升或降。'
            : 'A key signature indicates which notes are consistently sharp or flat.')
        + EX(isZh ? 'C 大调 — 没有升降号' : 'C Major — no sharps, no flats')
        + EX(isZh ? 'G 大调 — F♯' : 'G Major — F♯')
        + EX(isZh ? 'D 大调 — F♯ C♯' : 'D Major — F♯ C♯')
        + EX(isZh ? 'F 大调 — B♭' : 'F Major — B♭');
    }
    case 'scales': {
      return H2('🎵 ' + (isZh?'音阶':'Scales'))
        + P(isZh
            ? '大调音阶的音程模式：'
            : 'Major scale interval pattern:')
        + EX('W — W — H — W — W — W — H')
        + EX(isZh ? 'C 大调：C D E F G A B C' : 'C Major: C D E F G A B C')
        + EX(isZh ? 'G 大调：G A B C D E F♯ G' : 'G Major: G A B C D E F♯ G');
    }
    default: return '<p>Lesson coming soon.</p>';
  }
}

function openLesson(id){
  const l = LESSONS.find(x=>x.id===id);
  if(!l) return;
  const title = language==='zh' ? l.zh : l.en;
  const body = buildLessonBody(id);
  document.getElementById('modalContent').innerHTML = \`
    \${body}
    <div style="margin-top:24px;text-align:right">
      <button class="btn-primary" style="padding:12px 22px;border-radius:10px" onclick="completeLesson('\${id}')">
        \${language==='zh'?'完成课程 +25 XP':'Complete +25 XP'}
      </button>
    </div>
  \`;
  document.getElementById('modal').classList.add('open');
  setTimeout(()=>{
    const cvs = document.getElementById('lessonCanvas');
    if(!cvs) return;
    if(id==='staff') drawStaff(cvs, {clef:'treble', notePos:null});
    else if(id==='treble') drawStaff(cvs, {clef:'treble', notePos:2});
    else if(id==='bass') drawStaff(cvs, {clef:'bass', notePos:4});
    else if(id==='ledger') drawStaff(cvs, {clef:'treble', notePos:-2});
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

/* ============ PRACTICE PICKER ============ */
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
        <div class="icon">🎼</div><div class="title">\${t('staffPractice')}</div><div class="desc">\${t('readStaff')}</div>
      </div>
      <div class="mode-card" onclick="startPracticeMode('range')">
        <div class="icon">🎯</div><div class="title">\${t('rangePractice')}</div><div class="desc">\${t('identifyRange')}</div>
      </div>
      <div class="mode-card" onclick="startPracticeMode('ear')">
        <div class="icon">👂</div><div class="title">\${t('earPractice')}</div><div class="desc">\${t('listenNote')}</div>
      </div>
    </div>
  \`;
}

/* ============ SESSION ============ */
let session = {mode:'practice',type:'staff',score:0,qIndex:0,qTotal:5,startTime:0,timeLimit:0,timerId:null,timeLeft:0,current:null,correctCount:0,wrongCount:0,locked:false,passScore:0};

function startPracticeMode(type){
  session.mode='practice'; session.type=type; session.qTotal=5; session.timeLimit=0;
  session.score=0; session.qIndex=0; session.correctCount=0; session.wrongCount=0;
  session.startTime = Date.now(); session.locked=false;
  renderSessionFrame(); nextQuestion();
}
function startTestMode(type, qTotal, timeLimit, passScore){
  session.mode='test'; session.type=type; session.qTotal=qTotal; session.timeLimit=timeLimit;
  session.passScore = passScore;
  session.score=0; session.qIndex=0; session.correctCount=0; session.wrongCount=0;
  session.startTime = Date.now(); session.locked=false;
  renderSessionFrame(); nextQuestion();
}
function stopAllTimers(){ if(session.timerId){ clearInterval(session.timerId); session.timerId=null; } }
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
  if(session.mode==='test' && session.timeLimit>0){
    session.timeLeft = session.timeLimit;
    document.getElementById('timerBox').style.display='';
    document.getElementById('timerVal').textContent = session.timeLeft+'s';
    session.timerId = setInterval(()=>{
      session.timeLeft--;
      const el = document.getElementById('timerVal');
      const box = document.getElementById('timerBox');
      if(el) el.textContent = session.timeLeft+'s';
      if(box && session.timeLeft<=10) box.classList.add('warn');
      if(session.timeLeft<=0){ stopAllTimers(); finishSession(); }
    }, 1000);
  }
}
function typeTitle(type){
  if(type==='staff') return t('staffPractice');
  if(type==='range') return t('rangePractice');
  if(type==='ear') return t('earPractice');
  return '';
}
function nextQuestion(){
  if(session.qIndex >= session.qTotal){ finishSession(); return; }
  const counter = document.getElementById('qCounter');
  if(counter) counter.textContent = (session.qIndex+1)+'/'+session.qTotal;
  if(session.type==='staff') renderStaffQuestion();
  else if(session.type==='range') renderRangeQuestion();
  else if(session.type==='ear') renderEarQuestion();
}
function renderStaffQuestion(){
  const clef = Math.random()<0.5 ? 'treble' : 'bass';
  const pool = clef==='bass' ? BASS_NOTES : TREBLE_NOTES;
  const note = pool[Math.floor(Math.random()*pool.length)];
  session.current = {note,clef};
  const others = pool.filter(n=>n.name!==note.name).sort(()=>Math.random()-.5).slice(0,3);
  const opts = [note,...others].sort(()=>Math.random()-.5);
  document.getElementById('questionArea').innerHTML = \`
    <div class="staff-wrap" style="margin-bottom:16px">
      <canvas id="qCanvas" class="staff-canvas" style="width:100%;height:200px"></canvas>
    </div>
    <div class="question">\${t('whatNote')} <span style="color:var(--accent2);font-size:14px">(\${clef==='treble'?t('treble'):t('bass')})</span></div>
    <div class="answers" id="answers">
      \${opts.map(o=>\`<button class="answer" data-note="\${o.name}">\${o.name}</button>\`).join('')}
    </div>
  \`;
  setTimeout(()=>{
    const cvs = document.getElementById('qCanvas');
    if(cvs) drawStaff(cvs, {clef, notePos: note.pos});
  }, 20);
  document.querySelectorAll('#answers .answer').forEach(b=>{
    b.addEventListener('click', ()=>{
      if(session.locked) return;
      session.locked = true;
      const ok = b.dataset.note === note.name;
      if(ok){
        b.classList.add('correct'); sfxCorrect();
        session.score+=10; session.correctCount++;
        recordSkill('noteReading', true);
      } else {
        b.classList.add('wrong'); sfxWrong();
        session.wrongCount++;
        recordSkill('noteReading', false);
        document.querySelectorAll('#answers .answer').forEach(x=>{
          if(x.dataset.note===note.name) x.classList.add('correct');
        });
      }
      const sv = document.getElementById('scoreVal');
      if(sv) sv.textContent = session.score;
      session.qIndex++;
      setTimeout(()=>{ session.locked=false; nextQuestion(); }, ok?550:1100);
    });
  });
}
function renderRangeQuestion(){
  const clef = Math.random()<0.5 ? 'treble' : 'bass';
  const pool = clef==='bass' ? BASS_NOTES : TREBLE_NOTES;
  const note = pool[Math.floor(Math.random()*pool.length)];
  session.current = {note,clef};
  const ranges = [
    {key:'low',  label:t('low')},
    {key:'mid',  label:t('mid')},
    {key:'high', label:t('high')}
  ];
  document.getElementById('questionArea').innerHTML = \`
    <div class="staff-wrap" style="margin-bottom:16px">
      <canvas id="qCanvas" class="staff-canvas" style="width:100%;height:200px"></canvas>
    </div>
    <div class="question">\${t('whatRange')}</div>
    <div class="answers" id="answers" style="grid-template-columns:repeat(3,1fr)">
      \${ranges.map(r=>\`<button class="answer" data-range="\${r.key}" style="background:transparent;border:2px solid \${r.key==='low'?'#4aa3ff':r.key==='mid'?'#b46cff':'#ff6ca8'}">\${r.label}</button>\`).join('')}
    </div>
  \`;
  setTimeout(()=>{
    const cvs = document.getElementById('qCanvas');
    if(cvs) drawStaff(cvs, {clef, notePos: note.pos});
  }, 20);
  document.querySelectorAll('#answers .answer').forEach(b=>{
    b.addEventListener('click', ()=>{
      if(session.locked) return;
      session.locked = true;
      const ok = b.dataset.range === note.range;
      if(ok){
        b.classList.add('correct'); sfxCorrect();
        session.score+=10; session.correctCount++;
        recordSkill('rangeRecognition', true);
      } else {
        b.classList.add('wrong'); sfxWrong();
        session.wrongCount++;
        recordSkill('rangeRecognition', false);
        document.querySelectorAll('#answers .answer').forEach(x=>{
          if(x.dataset.range===note.range) x.classList.add('correct');
        });
      }
      const sv = document.getElementById('scoreVal');
      if(sv) sv.textContent = session.score;
      session.qIndex++;
      setTimeout(()=>{ session.locked=false; nextQuestion(); }, ok?550:1100);
    });
  });
}
function renderEarQuestion(){
  const pool = TREBLE_NOTES.slice(2, 9);
  const note = pool[Math.floor(Math.random()*pool.length)];
  session.current = {note};
  const others = pool.filter(n=>n.name!==note.name).sort(()=>Math.random()-.5).slice(0,3);
  const opts = [note,...others].sort(()=>Math.random()-.5);
  document.getElementById('questionArea').innerHTML = \`
    <div class="card" style="text-align:center;padding:32px">
      <div style="font-size:64px;margin-bottom:14px">🎵</div>
      <button class="btn-primary" style="padding:14px 28px;border-radius:10px;font-size:16px" id="playBtn">\${t('playNote')}</button>
      <button class="btn-secondary" style="padding:14px 20px;border-radius:10px;font-size:14px;margin-left:8px" id="replayBtn">\${t('playAgain')}</button>
    </div>
    <div class="question">\${t('listenNote')}</div>
    <div class="answers" id="answers">
      \${opts.map(o=>\`<button class="answer" data-note="\${o.name}">\${o.name}</button>\`).join('')}
    </div>
  \`;
  const play = ()=>playNote(note.hz, 1.0);
  document.getElementById('playBtn').addEventListener('click', play);
  document.getElementById('replayBtn').addEventListener('click', play);
  setTimeout(play, 400);
  document.querySelectorAll('#answers .answer').forEach(b=>{
    b.addEventListener('click', ()=>{
      if(session.locked) return;
      session.locked = true;
      const ok = b.dataset.note === note.name;
      if(ok){
        b.classList.add('correct'); sfxCorrect();
        session.score+=10; session.correctCount++;
        recordSkill('earTraining', true);
      } else {
        b.classList.add('wrong'); sfxWrong();
        session.wrongCount++;
        recordSkill('earTraining', false);
        document.querySelectorAll('#answers .answer').forEach(x=>{
          if(x.dataset.note===note.name) x.classList.add('correct');
        });
      }
      const sv = document.getElementById('scoreVal');
      if(sv) sv.textContent = session.score;
      session.qIndex++;
      setTimeout(()=>{ session.locked=false; nextQuestion(); }, ok?550:1100);
    });
  });
}
function finishSession(){
  stopAllTimers();
  const max = session.qTotal * 10;
  const pct = max ? Math.round(session.score/max*100) : 0;
  if(session.mode === 'test'){
    const passed = pct >= (session.passScore || 80);
    const key = session.type;
    if(pct > (player.bestScores[key]||0)) player.bestScores[key] = pct;
    player.testHistory.push({type:key, pct, time:Date.now()});
    if(player.testHistory.length>30) player.testHistory.shift();
    save();
    const dur = Math.round((Date.now()-session.startTime)/1000);
    if(passed) addXP(60); else addXP(20);
    document.getElementById('appContent').innerHTML = \`
      <div class="result-screen">
        <div class="result-icon">\${passed?'🏆':'💪'}</div>
        <div class="result-title">\${passed?t('passed'):t('failed')}</div>
        <div class="result-score \${passed?'pass':'fail'}">\${pct}%</div>
        <div class="result-meta">\${t('correctCount')}: \${session.correctCount}/\${session.qTotal} · \${t('time')}: \${dur}s<br>\${passed?'+60 XP':'+20 XP'}</div>
        <div class="result-actions">
          <button class="btn-secondary" onclick="renderTestPicker()">\${t('backToTests')}</button>
          <button class="btn-primary" onclick="startTestMode('\${session.type}',\${session.qTotal},\${session.timeLimit},\${session.passScore})">\${t('tryAgain')}</button>
        </div>
      </div>
    \`;
  } else {
    document.getElementById('appContent').innerHTML = \`
      <div class="result-screen">
        <div class="result-icon">✅</div>
        <div class="result-title">\${t('testComplete')}</div>
        <div class="result-score pass">\${pct}%</div>
        <div class="result-meta">\${t('correctCount')}: \${session.correctCount}/\${session.qTotal}</div>
        <div class="result-actions">
          <button class="btn-secondary" onclick="renderPracticePicker()">\${t('exit')}</button>
          <button class="btn-primary" onclick="startPracticeMode('\${session.type}')">\${t('tryAgain')}</button>
        </div>
      </div>
    \`;
  }
}

/* ============ TEST PICKER ============ */
function renderTestPicker(){
  const tests = [
    {key:'staff', icon:'🎼', title:t('staffTest'), q:10, time:60, pass:80},
    {key:'range', icon:'🎯', title:t('rangeTest'), q:10, time:60, pass:80},
    {key:'ear',   icon:'👂', title:t('earTest'),   q:10, time:90, pass:75}
  ];
  document.getElementById('appContent').innerHTML = \`
    <div class="topbar">
      <div>
        <div class="page-title">🎯 \${t('test')}</div>
        <div class="page-desc">\${t('testDesc')}</div>
      </div>
    </div>
    <div class="mode-picker">
      \${tests.map(tt=>{
        const best = player.bestScores[tt.key] || 0;
        return \`
          <div class="mode-card" onclick="startTestMode('\${tt.key}',\${tt.q},\${tt.time},\${tt.pass})">
            <div class="icon">\${tt.icon}</div>
            <div class="title">\${tt.title}</div>
            <div class="desc">\${tt.q} \${t('questions')} · \${tt.time}s · \${t('passScore')} \${tt.pass}%</div>
            \${best?\`<div style="margin-top:8px;font-size:12px;color:var(--gold)">Best: \${best}%</div>\`:''}
          </div>
        \`;
      }).join('')}
    </div>
  \`;
}

/* ============ PIANO TOOL (Free / Practice / Practical) ============ */
function renderPianoTool(tab){
  const tabsHTML = \`
    <div class="tab-bar">
      <button class="\${tab==='free'?'active':''}" onclick="renderPianoTool('free')">🎹 \${t('freePlay')}</button>
      <button class="\${tab==='practice'?'active':''}" onclick="renderPianoTool('practice')">✏️ \${t('practiceTab')}</button>
      <button class="\${tab==='practical'?'active':''}" onclick="renderPianoTool('practical')">🎯 \${t('practicalTab')}</button>
    </div>
  \`;

  if(tab === 'free'){
    document.getElementById('appContent').innerHTML = \`
      <div class="topbar">
        <div>
          <div class="page-title">🎹 \${t('pianoFreeTitle')}</div>
          <div class="page-desc">\${t('pianoFreeDesc')}</div>
        </div>
      </div>
      \${tabsHTML}
      <div class="card" style="text-align:center">
        <div class="piano-tool" id="pianoRow"></div>
      </div>
    \`;
    buildPiano('pianoRow', {showLabels:true, onPress:null});
  } else if(tab === 'practice'){
    startPianoSession('practice', tabsHTML);
  } else if(tab === 'practical'){
    startPianoSession('practical', tabsHTML);
  }
}

/* Build piano keyboard - refactored to be reusable */
function buildPiano(containerId, opts){
  opts = opts || {};
  const row = document.getElementById(containerId);
  if(!row) return;
  row.innerHTML = '';
  const showLabels = opts.showLabels !== false;
  const onPress = opts.onPress || null;
  const targetNote = opts.targetNote || null;
  const revealAll = opts.revealAll || false;

  PIANO_NOTES.forEach(n => {
    if(n.black){
      const last = row.lastChild;
      if(last){
        const bk = document.createElement('button');
        bk.className = 'bkey' + (showLabels ? '' : ' no-lbl');
        bk.dataset.note = n.n;
        bk.dataset.hz = n.hz;
        bk.innerHTML = \`<span>\${n.n.replace(/\\d/,'')}</span><span class="note-lbl">\${n.n}</span>\`;
        bk.addEventListener('click', ()=>{
          playNote(n.hz, 0.7);
          bk.classList.add('hit');
          setTimeout(()=>bk.classList.remove('hit'), 180);
          if(onPress) onPress(n, bk);
        });
        last.appendChild(bk);
      }
    } else {
      const wk = document.createElement('button');
      wk.className = 'wkey' + (showLabels ? '' : ' no-lbl');
      wk.dataset.note = n.n;
      wk.dataset.hz = n.hz;
      wk.innerHTML = \`<span class="lbl">\${n.n.replace(/\\d/,'')}</span><span class="note-lbl">\${n.n}</span>\`;
      wk.addEventListener('click', ()=>{
        playNote(n.hz, 0.7);
        wk.classList.add('hit');
        setTimeout(()=>wk.classList.remove('hit'), 180);
        if(onPress) onPress(n, wk);
      });
      row.appendChild(wk);
    }
  });
}

/* Piano session */
let pianoSession = {mode:'practice', target:null, idx:0, total:5, correct:0, wrong:0, tabsHTML:''};

function startPianoSession(mode, tabsHTML){
  pianoSession.mode = mode;
  pianoSession.idx = 0;
  pianoSession.total = 5;
  pianoSession.correct = 0;
  pianoSession.wrong = 0;
  pianoSession.tabsHTML = tabsHTML || '';
  pianoSession.active = true;
  renderPianoSession();
}

function renderPianoSession(){
  const isPractice = pianoSession.mode === 'practice';
  const title = isPractice ? t('pianoPracticeTitle') : t('pianoPracticalTitle');
  const desc = isPractice ? t('pianoPracticeDesc') : t('pianoPracticalDesc');

  if(pianoSession.idx >= pianoSession.total){
    // done
    const pct = Math.round(pianoSession.correct / pianoSession.total * 100);
    document.getElementById('appContent').innerHTML = \`
      <div class="topbar">
        <div>
          <div class="page-title">🎹 \${title}</div>
          <div class="page-desc">\${desc}</div>
        </div>
      </div>
      \${pianoSession.tabsHTML}
      <div class="result-screen">
        <div class="result-icon">✅</div>
        <div class="result-title">\${t('testComplete')}</div>
        <div class="result-score pass">\${pct}%</div>
        <div class="result-meta">\${t('correctCount')}: \${pianoSession.correct}/\${pianoSession.total}</div>
        <div class="result-actions">
          <button class="btn-secondary" onclick="renderPianoTool('free')">\${t('exit')}</button>
          <button class="btn-primary" onclick="startPianoSession('\${pianoSession.mode}', pianoSession.tabsHTML)">\${t('tryAgain')}</button>
        </div>
      </div>
    \`;
    return;
  }

  // pick a natural note in treble staff range
  const pool = TREBLE_NOTES.slice(0, 13); // C4..A5
  const note = pool[Math.floor(Math.random()*pool.length)];
  pianoSession.target = note;
  pianoSession.locked = false;

  document.getElementById('appContent').innerHTML = \`
    <div class="topbar">
      <div>
        <div class="page-title">🎹 \${title}</div>
        <div class="page-desc">\${desc}</div>
      </div>
    </div>
    \${pianoSession.tabsHTML}
    <div class="card" style="text-align:center">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
        <div style="font-weight:700;color:var(--muted)">\${t('question')} \${pianoSession.idx+1}/\${pianoSession.total}</div>
        <div style="font-weight:700;color:var(--gold)">\${t('correctCount')}: \${pianoSession.correct}</div>
      </div>
      <div class="staff-wrap" style="margin-bottom:16px">
        <canvas id="pianoStaff" class="staff-canvas" style="width:100%;height:180px"></canvas>
      </div>
      <div style="font-weight:700;color:var(--accent2);margin-bottom:10px">\${isPractice ? t('pressCorrectKey') : t('pressWithoutLabels')}</div>
      <div class="piano-tool" id="pianoRow"></div>
    </div>
  \`;

  setTimeout(()=>{
    const cvs = document.getElementById('pianoStaff');
    if(cvs) drawStaff(cvs, {clef:'treble', notePos: note.pos});
  }, 20);

  buildPiano('pianoRow', {
    showLabels: isPractice,
    targetNote: note.name,
    onPress: (key, el) => {
      if(pianoSession.locked) return;
      pianoSession.locked = true;
      if(key.n === note.name){
        el.classList.add('correct');
        sfxCorrect();
        pianoSession.correct++;
        recordSkill('noteReading', true);
        addXP(8);
        setTimeout(()=>{ pianoSession.idx++; renderPianoSession(); }, 700);
      } else {
        el.classList.add('wrong');
        sfxWrong();
        pianoSession.wrong++;
        recordSkill('noteReading', false);
        // reveal correct
        const correctKey = document.querySelector(\`[data-note="\${note.name}"]\`);
        if(correctKey) correctKey.classList.add('correct');
        setTimeout(()=>{ pianoSession.idx++; renderPianoSession(); }, 1200);
      }
    }
  });
}

/* ============ SHEET TOOL (Free / Practice / Practical) ============ */
function renderSheetTool(tab){
  const tabsHTML = \`
    <div class="tab-bar">
      <button class="\${tab==='free'?'active':''}" onclick="renderSheetTool('free')">✍️ \${t('freePlay')}</button>
      <button class="\${tab==='practice'?'active':''}" onclick="renderSheetTool('practice')">✏️ \${t('practiceTab')}</button>
      <button class="\${tab==='practical'?'active':''}" onclick="renderSheetTool('practical')">🎯 \${t('practicalTab')}</button>
    </div>
  \`;

  if(tab === 'free'){
    document.getElementById('appContent').innerHTML = \`
      <div class="topbar">
        <div>
          <div class="page-title">✍️ \${t('sheetFreeTitle')}</div>
          <div class="page-desc">\${t('sheetFreeDesc')}</div>
        </div>
      </div>
      \${tabsHTML}
      <div class="card">
        <div style="text-align:center;color:var(--muted);margin-bottom:14px">\${t('clickStaffPrompt')}</div>
        <div class="staff-wrap">
          <canvas id="sheetCanvas" class="staff-canvas staff-interactive" style="width:100%;height:260px"></canvas>
        </div>
        <div style="text-align:center;margin-top:16px">
          <button class="btn-secondary" style="padding:10px 22px;border-radius:10px;margin-right:8px" onclick="sheetClear()">🗑️ \${t('clear')}</button>
          <button class="btn-primary" style="padding:10px 22px;border-radius:10px" onclick="sheetPlayAll()">▶ \${t('playNote')}</button>
        </div>
      </div>
    \`;
    initFreeSheet();
  } else if(tab === 'practice'){
    startSheetPractice(tabsHTML);
  } else if(tab === 'practical'){
    startSheetPractical(tabsHTML);
  }
}

/* Free sheet: users click to add notes */
let freeSheetNotes = [];
let freeSheetLayout = null;

function initFreeSheet(){
  const cvs = document.getElementById('sheetCanvas');
  if(!cvs) return;
  freeSheetLayout = drawStaff(cvs, {clef:'treble', notes:freeSheetNotes});
  cvs.addEventListener('click', (e)=>{
    if(freeSheetNotes.length >= 12) return;
    const pos = yToPos(e.clientY, cvs, freeSheetLayout);
    if(pos < -6 || pos > 14) return;
    // find nearest natural note for this position
    const found = TREBLE_NOTES.find(n => n.pos === pos);
    if(found){
      freeSheetNotes.push({pos, color:'#1a1a1a', noteName: found.name});
      playNote(found.hz, 0.6);
      freeSheetLayout = drawStaff(cvs, {clef:'treble', notes:freeSheetNotes});
    } else {
      // chromatic - use sharp
      const closest = TREBLE_NOTES.reduce((a,b)=>Math.abs(b.pos-pos)<Math.abs(a.pos-pos)?b:a);
      freeSheetNotes.push({pos, color:'#c00', noteName: closest.name + '♯'});
      freeSheetLayout = drawStaff(cvs, {clef:'treble', notes:freeSheetNotes});
    }
  });
}
function sheetClear(){
  freeSheetNotes = [];
  const cvs = document.getElementById('sheetCanvas');
  if(cvs) freeSheetLayout = drawStaff(cvs, {clef:'treble', notes:[]});
}
function sheetPlayAll(){
  freeSheetNotes.forEach((n, i)=>{
    setTimeout(()=>{
      const natural = TREBLE_NOTES.find(x => x.pos === n.pos);
      if(natural) playNote(natural.hz, 0.6);
    }, i*400);
  });
}

/* Sheet Practice: single note placement */
let spSession = {idx:0, total:5, correct:0, target:null, locked:false, tabsHTML:''};

function startSheetPractice(tabsHTML){
  spSession.idx = 0;
  spSession.total = 5;
  spSession.correct = 0;
  spSession.tabsHTML = tabsHTML;
  renderSheetPracticeRound();
}
function renderSheetPracticeRound(){
  if(spSession.idx >= spSession.total){
    const pct = Math.round(spSession.correct / spSession.total * 100);
    document.getElementById('appContent').innerHTML = \`
      <div class="topbar"><div><div class="page-title">✍️ \${t('sheetPracticeTitle')}</div><div class="page-desc">\${t('sheetPracticeDesc')}</div></div></div>
      \${spSession.tabsHTML}
      <div class="result-screen">
        <div class="result-icon">✅</div>
        <div class="result-title">\${t('testComplete')}</div>
        <div class="result-score pass">\${pct}%</div>
        <div class="result-meta">\${t('correctCount')}: \${spSession.correct}/\${spSession.total}</div>
        <div class="result-actions">
          <button class="btn-secondary" onclick="renderSheetTool('free')">\${t('exit')}</button>
          <button class="btn-primary" onclick="startSheetPractice(spSession.tabsHTML)">\${t('tryAgain')}</button>
        </div>
      </div>
    \`;
    return;
  }

  const pool = TREBLE_NOTES.slice(0, 13);
  const target = pool[Math.floor(Math.random()*pool.length)];
  spSession.target = target;
  spSession.locked = false;

  document.getElementById('appContent').innerHTML = \`
    <div class="topbar"><div><div class="page-title">✍️ \${t('sheetPracticeTitle')}</div><div class="page-desc">\${t('sheetPracticeDesc')}</div></div></div>
    \${spSession.tabsHTML}
    <div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:14px">
        <div style="color:var(--muted);font-weight:700">\${t('question')} \${spSession.idx+1}/\${spSession.total}</div>
        <div style="color:var(--gold);font-weight:700">\${t('correctCount')}: \${spSession.correct}</div>
      </div>
      <div style="text-align:center;margin-bottom:14px">
        <div style="color:var(--muted);font-size:14px;margin-bottom:8px">\${t('writeThisNote')}</div>
        <div class="target-note">\${target.name}</div>
      </div>
      <div class="staff-wrap">
        <canvas id="spCanvas" class="staff-canvas staff-interactive" style="width:100%;height:260px"></canvas>
      </div>
      <div style="text-align:center;margin-top:14px;color:var(--muted);font-size:13px">\${t('clickStaffToPlace')}</div>
    </div>
  \`;
  const cvs = document.getElementById('spCanvas');
  const layout = drawStaff(cvs, {clef:'treble', notes:[]});
  cvs.addEventListener('click', (e)=>{
    if(spSession.locked) return;
    spSession.locked = true;
    const pos = yToPos(e.clientY, cvs, layout);
    const ok = pos === target.pos;
    // draw user's note (blue) and correct note (green if correct, red if wrong)
    const userColor = ok ? '#1f9e4a' : '#d0303a';
    const notes = [{pos, color:userColor}];
    if(!ok) notes.push({pos:target.pos, color:'#1f9e4a'});
    drawStaff(cvs, {clef:'treble', notes});
    if(ok){
      sfxCorrect();
      spSession.correct++;
      recordSkill('noteReading', true);
      addXP(10);
      setTimeout(()=>{ spSession.idx++; renderSheetPracticeRound(); }, 900);
    } else {
      sfxWrong();
      recordSkill('noteReading', false);
      setTimeout(()=>{ spSession.idx++; renderSheetPracticeRound(); }, 1600);
    }
  });
}

/* Sheet Practical: melody dictation */
let sprSession = {idx:0, total:5, correct:0, melody:[], melIdx:0, results:[], locked:false, tabsHTML:''};

function startSheetPractical(tabsHTML){
  sprSession.idx = 0;
  sprSession.total = 5;
  sprSession.correct = 0;
  sprSession.tabsHTML = tabsHTML;
  renderSheetPracticalRound();
}
function renderSheetPracticalRound(){
  if(sprSession.idx >= sprSession.total){
    const pct = Math.round(sprSession.correct / sprSession.total * 100);
    document.getElementById('appContent').innerHTML = \`
      <div class="topbar"><div><div class="page-title">✍️ \${t('sheetPracticalTitle')}</div><div class="page-desc">\${t('sheetPracticalDesc')}</div></div></div>
      \${sprSession.tabsHTML}
      <div class="result-screen">
        <div class="result-icon">\${pct>=80?'🏆':'✅'}</div>
        <div class="result-title">\${t('testComplete')}</div>
        <div class="result-score \${pct>=80?'pass':'fail'}">\${pct}%</div>
        <div class="result-meta">\${t('correctCount')}: \${sprSession.correct}/\${sprSession.total}</div>
        <div class="result-actions">
          <button class="btn-secondary" onclick="renderSheetTool('free')">\${t('exit')}</button>
          <button class="btn-primary" onclick="startSheetPractical(sprSession.tabsHTML)">\${t('tryAgain')}</button>
        </div>
      </div>
    \`;
    return;
  }

  // Generate a short 3-note melody
  const pool = TREBLE_NOTES.slice(2, 11); // E4..G5
  const melody = [];
  while(melody.length < 3){
    const n = pool[Math.floor(Math.random()*pool.length)];
    if(melody.length === 0 || melody[melody.length-1].name !== n.name){
      melody.push(n);
    }
  }
  sprSession.melody = melody;
  sprSession.melIdx = 0;
  sprSession.results = [];
  sprSession.locked = false;

  document.getElementById('appContent').innerHTML = \`
    <div class="topbar"><div><div class="page-title">✍️ \${t('sheetPracticalTitle')}</div><div class="page-desc">\${t('sheetPracticalDesc')}</div></div></div>
    \${sprSession.tabsHTML}
    <div class="card">
      <div style="display:flex;justify-content:space-between;margin-bottom:14px">
        <div style="color:var(--muted);font-weight:700">\${t('question')} \${sprSession.idx+1}/\${sprSession.total}</div>
        <div style="color:var(--gold);font-weight:700">\${t('correctCount')}: \${sprSession.correct}</div>
      </div>
      <div style="text-align:center;margin-bottom:14px">
        <div style="color:var(--muted);font-size:14px;margin-bottom:8px">\${t('writeThisMelody')}</div>
        <div class="target-melody" id="melodyTarget">
          \${melody.map((n,i)=>\`<div class="melody-note \${i===0?'current':''}" data-idx="\${i}">\${n.name}</div>\`).join('')}
        </div>
      </div>
      <div class="staff-wrap">
        <canvas id="sprCanvas" class="staff-canvas staff-interactive" style="width:100%;height:280px"></canvas>
      </div>
      <div style="text-align:center;margin-top:14px;color:var(--muted);font-size:13px">\${t('clickStaffToPlace')}</div>
    </div>
  \`;
  const cvs = document.getElementById('sprCanvas');
  sprSession.layout = drawStaff(cvs, {clef:'treble', notes:[]});
  cvs.addEventListener('click', (e)=>{
    if(sprSession.locked) return;
    const pos = yToPos(e.clientY, cvs, sprSession.layout);
    const target = melody[sprSession.melIdx];
    const ok = pos === target.pos;
    sprSession.results.push({pos, ok});
    // Update visual
    const notesToDraw = sprSession.results.map(r => ({pos: r.pos, color: r.ok ? '#1f9e4a' : '#d0303a'}));
    if(!ok){
      notesToDraw.push({pos: target.pos, color:'#1f9e4a'});
    }
    drawStaff(cvs, {clef:'treble', notes:notesToDraw});
    // Update melody pills
    const pills = document.querySelectorAll('.melody-note');
    if(pills[sprSession.melIdx]){
      pills[sprSession.melIdx].classList.remove('current');
      pills[sprSession.melIdx].classList.add(ok ? 'done' : 'failed');
    }
    if(ok){
      sfxCorrect();
      sprSession.melIdx++;
      recordSkill('noteReading', true);
      if(sprSession.melIdx >= melody.length){
        // melody complete
        sprSession.locked = true;
        sprSession.correct++;
        addXP(20);
        setTimeout(()=>{ sprSession.idx++; renderSheetPracticalRound(); }, 1200);
      } else {
        // reset clickable state, keep current results
        sprSession.results = [];
        const newPills = document.querySelectorAll('.melody-note');
        if(newPills[sprSession.melIdx]) newPills[sprSession.melIdx].classList.add('current');
      }
    } else {
      sfxWrong();
      recordSkill('noteReading', false);
      sprSession.locked = true;
      setTimeout(()=>{
        sprSession.locked = true;
        // failed the melody - move to next round
        sprSession.idx++;
        renderSheetPracticalRound();
      }, 1500);
    }
  });
}

/* ============ PROGRESS ============ */
function renderProgress(){
  const acc = player.totalQuestions ? Math.round(player.correct/player.totalQuestions*100) : 0;
  document.getElementById('appContent').innerHTML = \`
    <div class="topbar">
      <div>
        <div class="page-title">📊 \${t('progress')}</div>
        <div class="page-desc">\${t('progressDesc')}</div>
      </div>
    </div>
    <div class="grid">
      <div class="card"><div class="stat-label">\${t('totalQuestions')}</div><div class="stat-num">\${player.totalQuestions}</div></div>
      <div class="card"><div class="stat-label">\${t('correctCount')}</div><div class="stat-num" style="color:var(--green)">\${player.correct}</div></div>
      <div class="card"><div class="stat-label">\${t('wrongCount')}</div><div class="stat-num" style="color:var(--red)">\${player.wrong}</div></div>
      <div class="card"><div class="stat-label">\${t('accuracy')}</div><div class="stat-num">\${acc}%</div></div>
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
          <strong>\${Math.round(player.lessonsCompleted.length/LESSONS.length*100)}%</strong>
        </div>
        <div class="progress"><div style="width:\${player.lessonsCompleted.length/LESSONS.length*100}%"></div></div>
      </div>
    </div>
    \${player.testHistory.length?\`
      <div class="section">
        <div class="section-title">\${language==='zh'?'最近测试':'Recent Tests'}</div>
        <div class="card">
          \${player.testHistory.slice(-8).reverse().map(h=>\`
            <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--line);font-size:13px">
              <span>\${typeTitle(h.type)}</span>
              <strong style="color:\${h.pct>=80?'var(--green)':h.pct>=60?'var(--gold)':'var(--red)'}">\${h.pct}%</strong>
            </div>
          \`).join('')}
        </div>
      </div>
    \`:''}
  \`;
}

/* ============ LANGUAGE ============ */
function setLanguage(lang){
  language = lang;
  save();
  refreshNavLabels();
  navigateTo(currentPage);
}

/* ============ RESET ============ */
function resetProgress(){
  if(confirm(t('confirmReset'))){
    localStorage.removeItem('nv_player_v3');
    player = JSON.parse(JSON.stringify(DEFAULT_PLAYER));
    save();
    navigateTo('dashboard');
    notify('🔄 ' + (language==='zh'?'已重置':'Reset'));
  }
}

/* ============ KEYBOARD ============ */
document.addEventListener('keydown', e => { if(e.key==='Escape') closeModal(); });

/* ============ GLOBAL API ============ */
window.openLesson = openLesson;
window.completeLesson = completeLesson;
window.closeModal = closeModal;
window.setLanguage = setLanguage;
window.startPracticeMode = startPracticeMode;
window.startTestMode = startTestMode;
window.renderPracticePicker = renderPracticePicker;
window.renderTestPicker = renderTestPicker;
window.resetProgress = resetProgress;
window.renderPianoTool = renderPianoTool;
window.renderSheetTool = renderSheetTool;
window.startPianoSession = startPianoSession;
window.startSheetPractice = startSheetPractice;
window.startSheetPractical = startSheetPractical;
window.sheetClear = sheetClear;
window.sheetPlayAll = sheetPlayAll;

/* ============ INIT ============ */
updatePlayerUI();
refreshNavLabels();
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
    frame.style.cssText = 'display:block;width:100%;height:100%;min-height:800px;border:0;border-radius:16px;background:#0d1117;overflow:hidden;';
    frame.srcdoc = gameHTML;
    wrapper.replaceChildren(frame);
    return frame;
  };
})();
