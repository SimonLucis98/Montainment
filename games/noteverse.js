/* Music Staff Master — NoteVerse (JS Wrapper) */
(function () {
  'use strict';

  const gameHTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>Music Staff Master</title>
<style>
*{box-sizing:border-box}
:root{
  --bg:#10131a; --panel:#181d27; --panel2:#202634;
  --text:#f4f6fa; --muted:#9ba5b5;
  --accent:#7c5cff; --accent2:#00d4ff;
  --green:#35d07f; --red:#ff5573; --gold:#ffc857;
  --border:#303747;
}
body{
  margin:0;
  background:
    radial-gradient(circle at 20% 10%,rgba(124,92,255,.15),transparent 30%),
    radial-gradient(circle at 80% 20%,rgba(0,212,255,.08),transparent 30%),
    var(--bg);
  color:var(--text);
  font-family:Arial,Helvetica,sans-serif;
  min-height:100vh;
}
button{border:0;cursor:pointer;color:white;font-weight:bold;}
.app{display:flex;min-height:100vh;}
.sidebar{
  width:260px;background:rgba(20,24,33,.96);
  border-right:1px solid var(--border);
  padding:22px 16px;position:fixed;left:0;top:0;bottom:0;overflow-y:auto;
}
.logo{font-size:24px;font-weight:900;margin-bottom:4px;}
.logo span{color:var(--accent);}
.subtitle{font-size:12px;color:var(--muted);margin-bottom:24px;}
.player-card{
  background:linear-gradient(135deg,#252b3a,#181d27);
  padding:15px;border-radius:14px;margin-bottom:20px;
}
.player-row{display:flex;justify-content:space-between;align-items:center;}
.rank{color:var(--gold);font-size:13px;font-weight:bold;}
.xpbar{height:7px;background:#343b4b;border-radius:10px;margin-top:10px;overflow:hidden;}
.xpfill{height:100%;width:0%;background:linear-gradient(90deg,var(--accent),var(--accent2));}
.nav-title{font-size:11px;color:#687386;text-transform:uppercase;letter-spacing:1px;margin:18px 10px 8px;}
.nav button{width:100%;text-align:left;background:transparent;padding:12px 12px;border-radius:10px;margin-bottom:3px;color:#c5ccda;}
.nav button:hover,.nav button.active{background:#272d3b;color:white;}
.nav button.active{box-shadow:inset 3px 0 var(--accent);}
.main{margin-left:260px;width:calc(100% - 260px);padding:28px;}
.topbar{display:flex;justify-content:space-between;align-items:center;margin-bottom:28px;}
.page-title{font-size:30px;font-weight:900;}
.page-description{color:var(--muted);margin-top:5px;}
.lang{display:flex;gap:5px;background:#191e28;padding:4px;border-radius:10px;}
.lang button{padding:7px 11px;border-radius:7px;background:transparent;color:#aeb6c5;}
.lang button.active{background:var(--accent);color:white;}
.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
.card{background:rgba(25,30,41,.94);border:1px solid var(--border);border-radius:16px;padding:20px;}
.stat{font-size:30px;font-weight:900;margin-top:5px;}
.stat-label{color:var(--muted);font-size:13px;}
.section{margin-top:25px;}
.section-title{font-size:20px;font-weight:800;margin-bottom:14px;}
.lesson-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px;}
.lesson{
  background:linear-gradient(145deg,#202634,#171c25);
  border:1px solid var(--border);padding:18px;border-radius:15px;transition:.2s;
}
.lesson:hover{transform:translateY(-3px);border-color:#59647a;}
.lesson.locked{opacity:.45;}
.lesson-icon{font-size:35px;margin-bottom:12px;}
.lesson h3{margin:0 0 7px;}
.lesson p{color:var(--muted);font-size:13px;min-height:36px;}
.lesson button{background:var(--accent);padding:9px 13px;border-radius:8px;}
.lesson button.secondary{background:#303746;}
.progress{height:9px;background:#303747;border-radius:20px;overflow:hidden;}
.progress div{height:100%;background:linear-gradient(90deg,var(--accent),var(--accent2));}
.game-container{max-width:1000px;margin:auto;}
.game-header{display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;}
.game-score{color:var(--gold);font-weight:bold;}
.staff-card{
  background:#f7f4eb;color:#111;border-radius:18px;padding:40px 30px;
  min-height:330px;display:flex;align-items:center;justify-content:center;
  position:relative;overflow:hidden;
}
.staff{width:80%;position:relative;height:150px;}
.staff-lines{position:absolute;left:0;right:0;top:40px;}
.staff-line{height:2px;background:#222;margin:20px 0;}
.clef{position:absolute;left:20px;top:20px;font-family:"Times New Roman",serif;font-size:110px;line-height:1;}
.note{position:absolute;width:25px;height:18px;background:#111;border-radius:50%;transform:rotate(-15deg);}
.note-stem{position:absolute;width:3px;height:70px;background:#111;top:-57px;left:21px;}
.note.flag{display:none;}
.question{text-align:center;margin:25px 0;font-size:23px;font-weight:bold;}
.answers{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;}
.answer{background:#242b38;border:1px solid #394153;padding:15px;border-radius:10px;font-size:17px;}
.answer:hover{border-color:var(--accent);background:#2b3242;}
.answer.correct{background:#174c36;border-color:var(--green);}
.answer.wrong{background:#541f2b;border-color:var(--red);}
.piano{display:flex;justify-content:center;height:180px;margin-top:30px;}
.white-key{
  width:70px;height:180px;background:#f4f4f4;border:1px solid #999;color:#111;
  display:flex;align-items:flex-end;justify-content:center;padding-bottom:15px;
  border-radius:0 0 7px 7px;position:relative;
}
.black-key{position:absolute;top:0;right:-17px;width:34px;height:110px;background:#111;z-index:2;color:white;border-radius:0 0 5px 5px;}
.rhythm-box{display:flex;justify-content:center;gap:25px;font-size:50px;margin:50px 0;}
table{width:100%;border-collapse:collapse;}
th,td{text-align:left;padding:13px;border-bottom:1px solid var(--border);}
th{color:var(--muted);font-size:12px;}
.modal{position:fixed;inset:0;background:rgba(0,0,0,.72);display:none;align-items:center;justify-content:center;z-index:100;}
.modal.open{display:flex;}
.modal-content{width:min(850px,92%);max-height:90vh;overflow:auto;background:#191e28;border:1px solid var(--border);border-radius:18px;padding:25px;}
.close{float:right;background:#303746;width:35px;height:35px;border-radius:50%;}
@media(max-width:900px){
  .sidebar{width:210px;}
  .main{margin-left:210px;width:calc(100% - 210px);}
  .grid{grid-template-columns:repeat(2,1fr);}
  .lesson-grid{grid-template-columns:repeat(2,1fr);}
}
@media(max-width:650px){
  .sidebar{position:relative;width:100%;min-height:auto;}
  .app{display:block;}
  .main{margin-left:0;width:100%;padding:18px;}
  .grid,.lesson-grid{grid-template-columns:1fr;}
  .answers{grid-template-columns:repeat(2,1fr);}
}
</style>
</head>
<body>
<div class="app">
<aside class="sidebar">
  <div class="logo">Note<span>Verse</span></div>
  <div class="subtitle">Music Staff Master</div>
  <div class="player-card">
    <div class="player-row">
      <strong id="playerName">Music Student</strong>
      <span class="rank" id="playerRank">Beginner</span>
    </div>
    <div style="font-size:12px;color:#8e98a8;margin-top:7px">
      Level <span id="level">1</span> · <span id="xp">0</span> XP
    </div>
    <div class="xpbar"><div class="xpfill" id="xpFill"></div></div>
  </div>
  <div class="nav">
    <div class="nav-title">Main</div>
    <button class="active" onclick="showPage('dashboard',this)">🏠 Dashboard</button>
    <button onclick="showPage('academy',this)">📚 Academy</button>
    <button onclick="showPage('practice',this)">🎯 Practice</button>
    <button onclick="showPage('homework',this)">📝 Homework</button>
    <button onclick="showPage('exam',this)">🎓 Exams</button>
    <div class="nav-title">Practical</div>
    <button onclick="showPage('piano',this)">🎹 Piano</button>
    <button onclick="showPage('guitar',this)">🎸 Guitar</button>
    <button onclick="showPage('drums',this)">🥁 Drums</button>
    <button onclick="showPage('ear',this)">👂 Ear Training</button>
    <div class="nav-title">Master</div>
    <button onclick="showPage('dictionary',this)">📖 Music Dictionary</button>
    <button onclick="showPage('stats',this)">📊 My Progress</button>
  </div>
</aside>
<main class="main"><div id="appContent"></div></main>
</div>
<div class="modal" id="modal">
  <div class="modal-content">
    <button class="close" onclick="closeModal()">×</button>
    <div id="modalContent"></div>
  </div>
</div>
<script>
let language = localStorage.getItem("nv_language") || "en";
const TEXT = {
  en:{dashboard:"Dashboard",academy:"Academy",practice:"Practice",homework:"Homework",exams:"Exams",piano:"Piano",guitar:"Guitar",drums:"Drums",ear:"Ear Training",dictionary:"Music Dictionary",progress:"My Progress"},
  zh:{dashboard:"控制台",academy:"音乐学院",practice:"练习",homework:"作业",exams:"考试",piano:"钢琴",guitar:"吉他",drums:"鼓",ear:"听力训练",dictionary:"音乐词典",progress:"学习进度"}
};
const defaultPlayer = {name:"Music Student",xp:0,level:1,streak:0,correct:0,wrong:0,totalQuestions:0,lessonsCompleted:[],skills:{},mistakes:{},homework:{},achievements:[]};
let player = JSON.parse(localStorage.getItem("nv_player")) || defaultPlayer;
function save(){
  localStorage.setItem("nv_player", JSON.stringify(player));
  localStorage.setItem("nv_language", language);
  updatePlayerUI();
}
function updatePlayerUI(){
  document.getElementById("xp").textContent = player.xp;
  document.getElementById("level").textContent = player.level;
  document.getElementById("playerName").textContent = player.name;
  const ranks = ["Beginner","Novice","Apprentice","Student","Performer","Composer","Expert","Master","Grandmaster"];
  document.getElementById("playerRank").textContent = ranks[Math.min(player.level-1,ranks.length-1)];
  const currentXP = player.xp % 100;
  document.getElementById("xpFill").style.width = currentXP + "%";
}
function addXP(amount){
  player.xp += amount;
  const newLevel = Math.floor(player.xp / 100) + 1;
  if(newLevel > player.level){
    player.level = newLevel;
    notify(language==="zh" ? "🎉 升级了！" : "🎉 LEVEL UP!");
  }
  save();
}
function notify(message){
  const div = document.createElement("div");
  div.textContent = message;
  div.style.position="fixed";
  div.style.top="25px";
  div.style.right="25px";
  div.style.background="#272d3b";
  div.style.padding="15px 20px";
  div.style.borderRadius="12px";
  div.style.zIndex="999";
  div.style.boxShadow="0 10px 30px rgba(0,0,0,.4)";
  document.body.appendChild(div);
  setTimeout(()=>{div.remove();},2200);
}
function showPage(page,button){
  document.querySelectorAll(".nav button").forEach(b=>b.classList.remove("active"));
  if(button) button.classList.add("active");
  switch(page){
    case "dashboard": renderDashboard(); break;
    case "academy": renderAcademy(); break;
    case "practice": startPractice(); break;
    case "homework": renderHomework(); break;
    case "exam": renderExam(); break;
    case "piano": renderPiano(); break;
    case "guitar": renderGuitar(); break;
    case "drums": renderDrums(); break;
    case "ear": renderEarTraining(); break;
    case "dictionary": renderDictionary(); break;
    case "stats": renderStats(); break;
  }
}
function renderDashboard(){
  document.getElementById("appContent").innerHTML = \`
    <div class="topbar">
      <div>
        <div class="page-title">\${language==="zh" ? "音乐大师学院" : "Music Master Academy"}</div>
        <div class="page-description">\${language==="zh" ? "学习、阅读、演奏、写作，最终成为五线谱大师。" : "Learn. Read. Play. Write. Master music notation."}</div>
      </div>
      <div class="lang">
        <button class="\${language==="en"?"active":""}" onclick="setLanguage('en')">EN</button>
        <button class="\${language==="zh"?"active":""}" onclick="setLanguage('zh')">中文</button>
      </div>
    </div>
    <div class="grid">
      <div class="card"><div class="stat-label">XP</div><div class="stat">\${player.xp}</div></div>
      <div class="card"><div class="stat-label">Level</div><div class="stat">\${player.level}</div></div>
      <div class="card"><div class="stat-label">Accuracy</div><div class="stat">\${getAccuracy()}%</div></div>
      <div class="card"><div class="stat-label">Streak</div><div class="stat">🔥 \${player.streak}</div></div>
    </div>
    <div class="section">
      <div class="section-title">\${language==="zh" ? "今日训练" : "Today's Training"}</div>
      <div class="lesson-grid">
        \${dashboardCard("🎼","Note Reading","辨认五线谱上的音符","Train your note recognition.")}
        \${dashboardCard("🥁","Rhythm","学习节奏与拍号","Master rhythm and time signatures.")}
        \${dashboardCard("🎹","Piano Practical","把五线谱连接到钢琴","Connect notation to piano.")}
      </div>
    </div>
    <div class="section">
      <div class="section-title">\${language==="zh" ? "你的学习路线" : "Your Learning Path"}</div>
      <div class="card">
        <div style="display:flex;justify-content:space-between"><span>Foundation</span><strong>\${getCourseProgress()}%</strong></div>
        <div class="progress" style="margin-top:10px"><div style="width:\${getCourseProgress()}%"></div></div>
        <div style="color:var(--muted);margin-top:10px">\${language==="zh" ? "继续完成课程以解锁更高等级。" : "Complete lessons to unlock advanced music skills."}</div>
      </div>
    </div>
  \`;
}
function dashboardCard(icon,title,zh,en){
  return \`
    <div class="lesson">
      <div class="lesson-icon">\${icon}</div>
      <h3>\${title}</h3>
      <p>\${language==="zh" ? zh : en}</p>
      <button onclick="showPage('practice')">\${language==="zh"?"开始":"Start"}</button>
    </div>
  \`;
}
const lessons = [
  {id:"staff",icon:"🎼",title:"The Staff",zh:"认识五线谱、线与间",en:"Learn the five lines and four spaces.",level:1},
  {id:"treble",icon:"𝄞",title:"Treble Clef",zh:"学习高音谱号",en:"Learn the Treble Clef.",level:1},
  {id:"bass",icon:"𝄢",title:"Bass Clef",zh:"学习低音谱号",en:"Learn the Bass Clef.",level:1},
  {id:"notes",icon:"♩",title:"Notes",zh:"认识不同音符",en:"Learn note values.",level:1},
  {id:"rests",icon:"𝄽",title:"Rests",zh:"学习休止符",en:"Learn musical rests.",level:1},
  {id:"rhythm",icon:"🥁",title:"Rhythm",zh:"节奏与拍号",en:"Rhythm and time signatures.",level:2},
  {id:"accidentals",icon:"♯",title:"Accidentals",zh:"升降号与还原号",en:"Sharps, flats and naturals.",level:2},
  {id:"key",icon:"🔑",title:"Key Signatures",zh:"调号",en:"Major and minor key signatures.",level:3},
  {id:"scales",icon:"🎵",title:"Scales",zh:"音阶",en:"Major, minor and other scales.",level:3},
  {id:"intervals",icon:"↔️",title:"Intervals",zh:"音程",en:"Learn musical intervals.",level:4},
  {id:"dynamics",icon:"🔊",title:"Dynamics",zh:"力度",en:"Learn dynamic markings.",level:4},
  {id:"articulation",icon:"✨",title:"Articulation",zh:"演奏法",en:"Learn articulation symbols.",level:4},
  {id:"tempo",icon:"⏱️",title:"Tempo",zh:"速度",en:"Tempo and BPM.",level:4},
  {id:"chords",icon:"🎹",title:"Chords",zh:"和弦",en:"Learn chord construction.",level:5},
  {id:"sight",icon:"👁️",title:"Sight Reading",zh:"视谱",en:"Read music at sight.",level:5},
  {id:"writing",icon:"✍️",title:"Writing Music",zh:"写谱",en:"Write notes and rhythms.",level:5},
  {id:"composition",icon:"📝",title:"Composition",zh:"作曲",en:"Create your own music.",level:6},
  {id:"master",icon:"👑",title:"Grandmaster",zh:"大师综合训练",en:"Ultimate notation challenge.",level:8}
];
function renderAcademy(){
  let html = \`
    <div class="topbar">
      <div>
        <div class="page-title">\${language==="zh"?"音乐学院":"Academy"}</div>
        <div class="page-description">\${language==="zh"?"从完全不会五线谱一路学习到大师。":"Progress from absolute beginner to Grandmaster."}</div>
      </div>
    </div>
    <div class="lesson-grid">
  \`;
  lessons.forEach(lesson=>{
    const unlocked = player.level >= lesson.level;
    const completed = player.lessonsCompleted.includes(lesson.id);
    html += \`
      <div class="lesson \${!unlocked?"locked":""}">
        <div class="lesson-icon">\${lesson.icon}</div>
        <h3>\${lesson.title} \${completed?"✅":""}</h3>
        <p>\${language==="zh"?lesson.zh:lesson.en}</p>
        <small style="color:var(--muted)">Level \${lesson.level}</small>
        <br><br>
        <button \${!unlocked?"disabled":""} onclick="openLesson('\${lesson.id}')">
          \${unlocked ? (language==="zh"?"学习":"Learn") : "🔒 Locked"}
        </button>
      </div>
    \`;
  });
  html += \`</div>\`;
  document.getElementById("appContent").innerHTML = html;
}
const lessonContent = {
  staff:{title:"The Staff",body:"<h2>五线谱 / The Staff</h2><p>五线谱由五条线和四个间组成。<br>The staff consists of five lines and four spaces.</p><div class='staff-card'><div class='staff'><div class='staff-lines'><div class='staff-line'></div><div class='staff-line'></div><div class='staff-line'></div><div class='staff-line'></div><div class='staff-line'></div></div></div></div><h3>Line / Space</h3><p>音符可以位于线上，也可以位于两个线之间的间上。</p>"},
  treble:{title:"Treble Clef",body:"<h2>𝄞 Treble Clef 高音谱号</h2><p>Treble Clef 常用于较高音域的乐器。</p><h3>Lines</h3><p>E – G – B – D – F</p><h3>Spaces</h3><p>F – A – C – E</p><p>Remember: FACE for the spaces.</p>"},
  bass:{title:"Bass Clef",body:"<h2>𝄢 Bass Clef 低音谱号</h2><p>Bass Clef 用于较低音域。</p><h3>Lines</h3><p>G – B – D – F – A</p><h3>Spaces</h3><p>A – C – E – G</p>"},
  notes:{title:"Notes",body:"<h2>Note Values 音符时值</h2><p>Whole Note 全音符 = 4 beats</p><p>Half Note 二分音符 = 2 beats</p><p>Quarter Note 四分音符 = 1 beat</p><p>Eighth Note 八分音符 = 1/2 beat</p><p>Sixteenth Note 十六分音符 = 1/4 beat</p>"},
  rests:{title:"Rests",body:"<h2>Rests 休止符</h2><p>音乐中的“没有声音”同样拥有时间价值。</p><p>Whole Rest = 4 beats</p><p>Half Rest = 2 beats</p><p>Quarter Rest = 1 beat</p><p>Eighth Rest = 1/2 beat</p>"},
  rhythm:{title:"Rhythm",body:"<h2>Rhythm & Time Signature</h2><p>4/4 means four quarter-note beats per measure.</p><p>3/4 is commonly associated with waltz rhythm.</p><p>6/8 contains six eighth-note beats.</p>"},
  accidentals:{title:"Accidentals",body:"<h2>♯ ♭ ♮ Accidentals</h2><p>Sharp ♯ raises a note by one semitone.</p><p>Flat ♭ lowers a note by one semitone.</p><p>Natural ♮ cancels a previous sharp or flat.</p>"},
  key:{title:"Key Signatures",body:"<h2>Key Signatures 调号</h2><p>A key signature tells you which notes are consistently sharp or flat.</p><p>C Major: no sharps, no flats.</p><p>G Major: F♯.</p><p>F Major: B♭.</p>"},
  scales:{title:"Scales",body:"<h2>Scales 音阶</h2><p>Major scale pattern:</p><p>Whole – Whole – Half – Whole – Whole – Whole – Half</p><p>C Major: C D E F G A B C</p>"},
  intervals:{title:"Intervals",body:"<h2>Intervals 音程</h2><p>An interval is the distance between two pitches.</p><p>Unison, 2nd, 3rd, 4th, 5th, 6th, 7th, Octave.</p>"},
  dynamics:{title:"Dynamics",body:"<h2>Dynamics 力度</h2><p>pp — very soft</p><p>p — soft</p><p>mp — moderately soft</p><p>mf — moderately loud</p><p>f — loud</p><p>ff — very loud</p><p>Crescendo means gradually louder.</p>"},
  articulation:{title:"Articulation",body:"<h2>Articulation 演奏法</h2><p>Staccato — short and separated.</p><p>Legato — smooth and connected.</p><p>Accent — emphasize the note.</p>"},
  tempo:{title:"Tempo",body:"<h2>Tempo 速度</h2><p>Largo — very slow</p><p>Adagio — slow</p><p>Andante — walking pace</p><p>Moderato — moderate</p><p>Allegro — fast</p><p>Presto — very fast</p>"},
  chords:{title:"Chords",body:"<h2>Chords 和弦</h2><p>C Major = C E G</p><p>C Minor = C Eb G</p><p>C7 = C E G Bb</p><p>CMaj7 = C E G B</p>"},
  sight:{title:"Sight Reading",body:"<h2>Sight Reading 视谱</h2><p>Sight reading means performing music you have not previously practiced.</p><p>Start by identifying:</p><ol><li>Clef</li><li>Key signature</li><li>Time signature</li><li>Tempo</li><li>Dynamics</li></ol>"},
  writing:{title:"Writing Music",body:"<h2>Music Writing 写谱</h2><p>Writing music requires you to understand pitch, rhythm, measure structure and notation symbols.</p><button onclick='startWritingPractice()'>Start Writing Practice</button>"},
  composition:{title:"Composition",body:"<h2>Composition 作曲</h2><p>Create a melody using notes, rhythm and structure.</p><button onclick='startComposition()'>Compose</button>"},
  master:{title:"Grandmaster",body:"<h2>👑 Grandmaster Challenge</h2><p>This challenge combines clefs, pitch, rhythm, key signatures, dynamics, articulation and reading.</p><button onclick='startMasterChallenge()'>Begin Challenge</button>"}
};
function openLesson(id){
  const lesson = lessonContent[id];
  if(!lesson){ notify("Lesson coming soon."); return; }
  document.getElementById("modalContent").innerHTML = \`
    <h1>\${lesson.title}</h1>
    \${lesson.body}
    <br>
    <button style="background:var(--accent);padding:12px 18px;border-radius:9px" onclick="completeLesson('\${id}')">
      \${language==="zh"?"完成课程 + XP":"Complete Lesson + XP"}
    </button>
  \`;
  document.getElementById("modal").classList.add("open");
}
function closeModal(){ document.getElementById("modal").classList.remove("open"); }
function completeLesson(id){
  if(!player.lessonsCompleted.includes(id)){
    player.lessonsCompleted.push(id);
    addXP(25);
    notify(language==="zh" ? "课程完成！+25 XP" : "Lesson completed! +25 XP");
  }
  closeModal();
  renderAcademy();
}
const trebleNotes = [
  {note:"C4",pos:5},{note:"D4",pos:4},{note:"E4",pos:3},{note:"F4",pos:2},
  {note:"G4",pos:1},{note:"A4",pos:0},{note:"B4",pos:-1},{note:"C5",pos:-2},
  {note:"D5",pos:-3},{note:"E5",pos:-4},{note:"F5",pos:-5},{note:"G5",pos:-6},{note:"A5",pos:-7}
];
const bassNotes = [
  {note:"C2",pos:5},{note:"D2",pos:4},{note:"E2",pos:3},{note:"F2",pos:2},
  {note:"G2",pos:1},{note:"A2",pos:0},{note:"B2",pos:-1},{note:"C3",pos:-2},
  {note:"D3",pos:-3},{note:"E3",pos:-4},{note:"F3",pos:-5},{note:"G3",pos:-6},{note:"A3",pos:-7}
];
let currentQuestion = null;
let practiceMode = "treble";
function startPractice(mode){
  if(mode) practiceMode = mode;
  renderPractice();
  nextPracticeQuestion();
}
function renderPractice(){
  document.getElementById("appContent").innerHTML = \`
    <div class="game-container">
      <div class="topbar">
        <div>
          <div class="page-title">\${language==="zh"?"五线谱训练":"Note Reading Practice"}</div>
          <div class="page-description">\${language==="zh"?"训练你真正快速辨认音符的能力。":"Train your real-time note recognition."}</div>
        </div>
        <div class="game-score">Score: <span id="practiceScore">0</span></div>
      </div>
      <div class="staff-card">
        <div class="staff">
          <div class="staff-lines">
            <div class="staff-line"></div><div class="staff-line"></div>
            <div class="staff-line"></div><div class="staff-line"></div><div class="staff-line"></div>
          </div>
          <div class="clef" id="clefSymbol">𝄞</div>
          <div class="note" id="practiceNote"><div class="note-stem"></div></div>
        </div>
      </div>
      <div class="question" id="practiceQuestion">What note is this?</div>
      <div class="answers" id="practiceAnswers"></div>
    </div>
  \`;
}
function nextPracticeQuestion(){
  const notes = practiceMode==="bass" ? bassNotes : trebleNotes;
  currentQuestion = notes[Math.floor(Math.random()*notes.length)];
  const noteElement = document.getElementById("practiceNote");
  if(!noteElement) return;
  const clef = document.getElementById("clefSymbol");
  clef.textContent = practiceMode==="bass" ? "𝄢" : "𝄞";
  noteElement.style.left = (practiceMode==="bass" ? 350 : 360) + "px";
  noteElement.style.top = (50 + currentQuestion.pos*10) + "px";
  const answerContainer = document.getElementById("practiceAnswers");
  const pool = notes.map(n=>n.note).sort(()=>Math.random()-.5).slice(0,4);
  if(!pool.includes(currentQuestion.note)){
    pool[Math.floor(Math.random()*pool.length)] = currentQuestion.note;
  }
  answerContainer.innerHTML = pool.map(note=>\`
    <button class="answer" onclick="answerPractice('\${note}',this)">\${note}</button>
  \`).join("");
}
let practiceScore = 0;
function answerPractice(answer,button){
  const correct = answer===currentQuestion.note;
  player.totalQuestions++;
  if(correct){
    player.correct++;
    player.streak++;
    practiceScore += 10;
    button.classList.add("correct");
    addXP(10);
    recordSkill(practiceMode==="bass"?"bassClef":"trebleClef", true);
    setTimeout(nextPracticeQuestion, 450);
  } else {
    player.wrong++;
    player.streak=0;
    button.classList.add("wrong");
    recordSkill(practiceMode==="bass"?"bassClef":"trebleClef", false);
    document.querySelectorAll(".answer").forEach(b=>{
      if(b.textContent.trim()===currentQuestion.note) b.classList.add("correct");
    });
    setTimeout(nextPracticeQuestion, 1000);
  }
  const score = document.getElementById("practiceScore");
  if(score) score.textContent=practiceScore;
  save();
}
function recordSkill(skill,correct){
  if(!player.skills[skill]) player.skills[skill]={correct:0,wrong:0};
  if(correct) player.skills[skill].correct++;
  else player.skills[skill].wrong++;
  if(!correct) player.mistakes[skill]=(player.mistakes[skill]||0)+1;
}
function skillAccuracy(skill){
  const s=player.skills[skill];
  if(!s) return 0;
  const total = s.correct+s.wrong;
  if(!total) return 0;
  return Math.round(s.correct/total*100);
}
function renderHomework(){
  const homework = [
    {title:"Note Recognition",desc:"Identify 20 notes.",xp:30},
    {title:"Rhythm Builder",desc:"Complete five 4/4 measures.",xp:40},
    {title:"Key Signature",desc:"Identify five major keys.",xp:50},
    {title:"Piano Practical",desc:"Find 10 notes on the piano.",xp:50}
  ];
  document.getElementById("appContent").innerHTML = \`
    <div class="topbar">
      <div>
        <div class="page-title">📝 \${language==="zh"?"今日作业":"Homework"}</div>
        <div class="page-description">\${language==="zh"?"完成作业来巩固知识。":"Strengthen your knowledge through practical assignments."}</div>
      </div>
    </div>
    <div class="lesson-grid">
      \${homework.map((h,i)=>\`
        <div class="lesson">
          <div class="lesson-icon">📝</div>
          <h3>\${h.title}</h3>
          <p>\${h.desc}</p>
          <strong style="color:var(--gold)">+\${h.xp} XP</strong>
          <br><br>
          <button onclick="doHomework(\${i})">\${language==="zh"?"开始作业":"Start"}</button>
        </div>
      \`).join("")}
    </div>
  \`;
}
function doHomework(index){
  addXP(30);
  notify(language==="zh" ? "作业完成！继续保持！" : "Homework completed!");
}
function renderExam(){
  document.getElementById("appContent").innerHTML = \`
    <div class="topbar">
      <div>
        <div class="page-title">🎓 \${language==="zh"?"音乐考试":"Music Exams"}</div>
        <div class="page-description">\${language==="zh"?"测试真正掌握程度，而不是记忆答案。":"Test mastery, not memorized answers."}</div>
      </div>
    </div>
    <div class="lesson-grid">
      \${examCard("🌱","Beginner Exam",1,80)}
      \${examCard("🟢","Intermediate Exam",3,85)}
      \${examCard("🟣","Advanced Exam",5,90)}
      \${examCard("👑","Grandmaster Exam",8,95)}
    </div>
  \`;
}
function examCard(icon,title,level,pass){
  const unlocked = player.level>=level;
  return \`
    <div class="lesson \${!unlocked?"locked":""}">
      <div class="lesson-icon">\${icon}</div>
      <h3>\${title}</h3>
      <p>Pass requirement: \${pass}%</p>
      <button \${!unlocked?"disabled":""} onclick="startExam('\${title}',\${pass})">
        \${unlocked?"Start Exam":"🔒 Locked"}
      </button>
    </div>
  \`;
}
function startExam(title,pass){
  startPractice();
  notify(\`\${title} — Pass \${pass}%\`);
}
const pianoNotes=["C","D","E","F","G","A","B","C","D","E","F","G","A","B"];
function renderPiano(){
  document.getElementById("appContent").innerHTML = \`
    <div class="topbar">
      <div>
        <div class="page-title">🎹 Piano Practical</div>
        <div class="page-description">\${language==="zh"?"把五线谱上的音符连接到真实琴键。":"Connect sheet music to piano keys."}</div>
      </div>
    </div>
    <div class="card">
      <h2>\${language==="zh"?"找到目标音符":"Find the target note"}</h2>
      <div id="pianoTarget" style="font-size:45px;text-align:center;color:var(--gold);font-weight:bold"></div>
      <div class="piano">
        \${pianoNotes.map((n,i)=>\`
          <button class="white-key" onclick="pianoPress('\${n}\${Math.floor(i/7)+4}',this)">
            \${n}\${Math.floor(i/7)+4}
          </button>
        \`).join("")}
      </div>
    </div>
  \`;
  nextPianoQuestion();
}
let pianoTarget;
function nextPianoQuestion(){
  pianoTarget = pianoNotes[Math.floor(Math.random()*pianoNotes.length)];
  const octave = Math.floor(Math.random()*2)+4;
  pianoTarget = pianoTarget+octave;
  const el = document.getElementById("pianoTarget");
  if(el) el.textContent=pianoTarget;
}
function pianoPress(note,button){
  if(note===pianoTarget){
    button.style.background="#35d07f";
    addXP(10);
    setTimeout(()=>{button.style.background="#f4f4f4";nextPianoQuestion();},400);
  } else {
    button.style.background="#ff5573";
    setTimeout(()=>{button.style.background="#f4f4f4";},400);
  }
}
function renderGuitar(){
  document.getElementById("appContent").innerHTML = \`
    <div class="topbar">
      <div>
        <div class="page-title">🎸 Guitar Practical</div>
        <div class="page-description">Learn staff notation and guitar fretboard positions.</div>
      </div>
    </div>
    <div class="card">
      <h2>Guitar Fretboard</h2>
      <p>Match the note to a string and fret.</p>
      <div id="guitarTarget" style="text-align:center;font-size:40px;color:var(--gold);font-weight:bold;margin:25px"></div>
      <div id="fretboard"></div>
    </div>
  \`;
  renderFretboard();
}
function renderFretboard(){
  const strings=["E","A","D","G","B","E"];
  let html="";
  strings.forEach(s=>{
    html += \`
      <div style="display:flex;margin-bottom:8px;align-items:center">
        <strong style="width:35px">\${s}</strong>
        \${Array.from({length:13},(_,fret)=>\`
          <button onclick="guitarPress('\${s}',\${fret},this)" style="width:55px;height:40px;background:#292f3d;margin-right:3px;border-radius:5px">\${fret}</button>
        \`).join("")}
      </div>
    \`;
  });
  document.getElementById("fretboard").innerHTML=html;
  nextGuitarQuestion();
}
let guitarTarget;
function nextGuitarQuestion(){
  const notes=["E","F","G","A","B","C","D"];
  guitarTarget = notes[Math.floor(Math.random()*notes.length)];
  document.getElementById("guitarTarget").textContent = "Find: "+guitarTarget;
}
function guitarPress(string,fret,button){
  const noteNames=["E","F","F#","G","G#","A","A#","B","C","C#","D","D#"];
  const openIndex={E:0,A:5,D:10,G:3,B:8};
  const note = noteNames[(openIndex[string]+fret)%12];
  if(note===guitarTarget){
    button.style.background="#35d07f";
    addXP(10);
    setTimeout(()=>{button.style.background="#292f3d";nextGuitarQuestion();},500);
  } else {
    button.style.background="#ff5573";
    setTimeout(()=>{button.style.background="#292f3d";},400);
  }
}
function renderDrums(){
  document.getElementById("appContent").innerHTML = \`
    <div class="topbar">
      <div>
        <div class="page-title">🥁 Drum Notation</div>
        <div class="page-description">\${language==="zh"?"阅读鼓谱并训练节奏。":"Read drum notation and train rhythm."}</div>
      </div>
    </div>
    <div class="card">
      <h2>Rhythm Challenge</h2>
      <div class="rhythm-box">♩ ♪ ♪ ♩</div>
      <div class="answers">
        <button class="answer" onclick="drumAnswer(this,true)">TAP — TAP-TAP — TAP</button>
        <button class="answer" onclick="drumAnswer(this,false)">TAP-TAP — TAP — TAP</button>
        <button class="answer" onclick="drumAnswer(this,false)">TAP — TAP — TAP-TAP</button>
        <button class="answer" onclick="drumAnswer(this,false)">TAP-TAP-TAP-TAP</button>
      </div>
    </div>
  \`;
}
function drumAnswer(button,correct){
  if(correct){ button.classList.add("correct"); addXP(15); }
  else { button.classList.add("wrong"); }
}
function renderEarTraining(){
  document.getElementById("appContent").innerHTML = \`
    <div class="topbar">
      <div>
        <div class="page-title">👂 Ear Training</div>
        <div class="page-description">Train pitch recognition with your ears.</div>
      </div>
    </div>
    <div class="card" style="text-align:center">
      <div style="font-size:80px">🎵</div>
      <button style="background:var(--accent);padding:15px 30px;border-radius:10px" onclick="playTone()">▶ Play Note</button>
      <div class="answers" style="margin-top:30px">
        \${["C","D","E","F"].map(n=>\`
          <button class="answer" onclick="earAnswer('\${n}',this)">\${n}</button>
        \`).join("")}
      </div>
    </div>
  \`;
  generateEarQuestion();
}
let earTarget;
function generateEarQuestion(){
  const notes=[["C",261.63],["D",293.66],["E",329.63],["F",349.23]];
  earTarget = notes[Math.floor(Math.random()*notes.length)];
}
function playTone(){
  if(!earTarget) generateEarQuestion();
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const ctx = new AudioContext();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.frequency.value = earTarget[1];
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();
  gain.gain.setValueAtTime(.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime+1);
  oscillator.stop(ctx.currentTime+1);
}
function earAnswer(answer,button){
  if(answer===earTarget[0]){
    button.classList.add("correct");
    addXP(15);
    setTimeout(()=>{
      generateEarQuestion();
      document.querySelectorAll(".answer").forEach(b=>{b.classList.remove("correct");});
    },600);
  } else {
    button.classList.add("wrong");
  }
}
const dictionary=[
  ["Staff","五线谱","Five lines and four spaces."],
  ["Treble Clef","高音谱号","Clef commonly used for higher pitches."],
  ["Bass Clef","低音谱号","Clef used for lower pitches."],
  ["Pitch","音高","How high or low a sound is."],
  ["Rhythm","节奏","The organization of sound in time."],
  ["Tempo","速度","The speed of music."],
  ["Dynamics","力度","How loud or soft music is."],
  ["Staccato","断奏","Short and separated."],
  ["Legato","连奏","Smooth and connected."],
  ["Sharp","升号","Raises a pitch by a semitone."],
  ["Flat","降号","Lowers a pitch by a semitone."],
  ["Natural","还原号","Cancels a sharp or flat."],
  ["Interval","音程","Distance between two pitches."],
  ["Chord","和弦","Multiple pitches sounded together."],
  ["Scale","音阶","A sequence of pitches."],
  ["Measure","小节","A section of music divided by bar lines."],
  ["Beat","拍","A basic unit of musical time."],
  ["Rest","休止符","A symbol indicating silence."]
];
function renderDictionary(){
  document.getElementById("appContent").innerHTML = \`
    <div class="topbar">
      <div>
        <div class="page-title">📖 Music Dictionary</div>
        <div class="page-description">\${language==="zh"?"音乐术语中英文词典":"Music terminology in English and Chinese"}</div>
      </div>
    </div>
    <div class="card">
      <table>
        <thead><tr><th>English</th><th>中文</th><th>Meaning</th></tr></thead>
        <tbody>
          \${dictionary.map(d=>\`
            <tr><td><strong>\${d[0]}</strong></td><td>\${d[1]}</td><td style="color:var(--muted)">\${d[2]}</td></tr>
          \`).join("")}
        </tbody>
      </table>
    </div>
  \`;
}
function renderStats(){
  document.getElementById("appContent").innerHTML = \`
    <div class="topbar">
      <div>
        <div class="page-title">📊 My Progress</div>
        <div class="page-description">Track your music mastery.</div>
      </div>
    </div>
    <div class="grid">
      <div class="card"><div class="stat-label">Total Questions</div><div class="stat">\${player.totalQuestions}</div></div>
      <div class="card"><div class="stat-label">Correct</div><div class="stat">\${player.correct}</div></div>
      <div class="card"><div class="stat-label">Wrong</div><div class="stat">\${player.wrong}</div></div>
      <div class="card"><div class="stat-label">Accuracy</div><div class="stat">\${getAccuracy()}%</div></div>
    </div>
    <div class="section">
      <div class="section-title">Skill Mastery</div>
      <div class="card">
        \${skillRow("Treble Clef",skillAccuracy("trebleClef"))}
        \${skillRow("Bass Clef",skillAccuracy("bassClef"))}
        \${skillRow("Rhythm",skillAccuracy("rhythm"))}
        \${skillRow("Pitch",skillAccuracy("pitch"))}
      </div>
    </div>
  \`;
}
function skillRow(name,value){
  return \`
    <div style="margin-bottom:18px">
      <div style="display:flex;justify-content:space-between;margin-bottom:7px">
        <span>\${name}</span><strong>\${value}%</strong>
      </div>
      <div class="progress"><div style="width:\${value}%"></div></div>
    </div>
  \`;
}
function startWritingPractice(){
  closeModal();
  document.getElementById("appContent").innerHTML = \`
    <div class="game-container">
      <div class="page-title">✍️ Writing Practice</div>
      <div class="page-description">Write a C Major scale.</div>
      <div class="staff-card" style="margin-top:25px">
        <div class="staff">
          <div class="staff-lines">
            <div class="staff-line"></div><div class="staff-line"></div>
            <div class="staff-line"></div><div class="staff-line"></div><div class="staff-line"></div>
          </div>
        </div>
      </div>
      <div style="text-align:center;margin-top:25px">
        <button style="background:var(--accent);padding:14px 25px;border-radius:10px" onclick="finishWriting()">Submit</button>
      </div>
    </div>
  \`;
}
function finishWriting(){
  addXP(40);
  notify(language==="zh" ? "写谱练习完成！" : "Writing practice completed!");
}
function startComposition(){
  closeModal();
  document.getElementById("appContent").innerHTML = \`
    <div class="game-container">
      <div class="page-title">📝 Composer</div>
      <div class="page-description">Create your own four-bar melody.</div>
      <div class="card" style="margin-top:25px">
        <div class="answers">
          \${["C","D","E","F","G","A","B"].map(n=>\`
            <button class="answer" onclick="addCompositionNote('\${n}')">\${n}</button>
          \`).join("")}
        </div>
        <div id="composition" style="font-size:40px;text-align:center;margin:40px"></div>
        <button style="background:var(--accent);padding:12px 20px;border-radius:9px" onclick="finishComposition()">Finish Composition</button>
      </div>
    </div>
  \`;
  window.compositionNotes=[];
}
function addCompositionNote(note){
  if(window.compositionNotes.length>=16) return;
  window.compositionNotes.push(note);
  document.getElementById("composition").textContent = window.compositionNotes.join(" ");
}
function finishComposition(){
  addXP(75);
  notify(language==="zh" ? "作品完成！+75 XP" : "Composition completed! +75 XP");
}
function startMasterChallenge(){
  closeModal();
  document.getElementById("appContent").innerHTML = \`
    <div class="game-container">
      <div class="topbar">
        <div>
          <div class="page-title">👑 Grandmaster Challenge</div>
          <div class="page-description">Ultimate music notation test.</div>
        </div>
      </div>
      <div class="card">
        <h2>Mission</h2>
        <p>Identify the clef, key signature, time signature and pitch.</p>
        <button style="background:var(--accent);padding:14px 25px;border-radius:10px" onclick="startPractice()">Begin</button>
      </div>
    </div>
  \`;
}
function setLanguage(lang){
  language=lang;
  save();
  renderDashboard();
}
function getAccuracy(){
  const total = player.correct+player.wrong;
  if(total===0) return 0;
  return Math.round(player.correct/total*100);
}
function getCourseProgress(){
  return Math.min(100, Math.round(player.lessonsCompleted.length / lessons.length * 100));
}
document.addEventListener("keydown", e=>{ if(e.key==="Escape") closeModal(); });
updatePlayerUI();
renderDashboard();
window.resetGame=function(){
  if(confirm("Reset all Music Staff Master progress?")){
    localStorage.removeItem("nv_player");
    location.reload();
  }
};
<\/script>
</body>
</html>`;

  window.initGame = function initGame(wrapper) {
    if (!wrapper || typeof wrapper.replaceChildren !== 'function') {
      throw new Error('initGame requires a container element.');
    }
    var frame = document.createElement('iframe');
    frame.title = 'Music Staff Master';
    frame.setAttribute('allow', 'autoplay; fullscreen');
    frame.style.cssText = 'display:block;width:100%;height:100%;min-height:750px;border:0;border-radius:16px;background:#10131a;overflow:hidden;';
    frame.srcdoc = gameHTML;
    wrapper.replaceChildren(frame);
    return frame;
  };
})();
