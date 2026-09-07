/* MBTI · Cognitive Functions Adventure (Encapsulated) */
(function () {
  'use strict';

  const gameHTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MBTI · Star Command</title>
  <style>
    * { box-sizing: border-box; user-select: none; }
    body {
      min-height: 100vh;
      margin: 0;
      background: #0b0e17;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Segoe UI', system-ui, sans-serif;
    }
    .game-wrapper {
      background: #141a26;
      padding: 2rem 1.5rem 1.8rem;
      border-radius: 3rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05);
      text-align: center;
      position: relative;
      max-width: 580px;
      width: 100%;
    }
    .screen { display: block; }
    .screen.hidden { display: none; }

    h1 { color: #b7c9e2; font-weight: 300; letter-spacing: 3px; font-size: 2.2rem; margin: 0 0 0.2rem; }
    h1 strong { color: #a78bfa; font-weight: 700; }
    .subtitle { color: #6b7f9a; letter-spacing: 2px; font-size: 0.8rem; margin-bottom: 1.5rem; }

    .card {
      background: #1e2738;
      border-radius: 2rem;
      padding: 2rem;
      border: 1px solid #2e3a50;
      box-shadow: inset 0 2px 0 #2e3a50;
      min-height: 320px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .question-text { font-size: 1.4rem; color: #e2e8f0; font-weight: 500; margin-bottom: 2rem; line-height: 1.4; }
    .options { display: flex; flex-direction: column; gap: 0.8rem; }
    .opt-btn {
      background: #111a26;
      border: 1px solid #2a3a50;
      border-radius: 1.2rem;
      padding: 0.9rem 1.2rem;
      color: #cbd5e1;
      font-size: 1rem;
      text-align: left;
      cursor: pointer;
      transition: 0.2s;
      font-family: inherit;
    }
    .opt-btn:hover { background: #28344a; border-color: #6b8aaa; transform: scale(1.02); }
    .opt-btn:active { transform: scale(0.98); }

    .progress { color: #4a5a72; font-size: 0.9rem; margin-top: 1.5rem; letter-spacing: 1px; }

    /* Result */
    .result-type { font-size: 3rem; font-weight: 800; color: #a78bfa; letter-spacing: 4px; }
    .result-name { font-size: 1.8rem; color: #e2e8f0; margin: 0.2rem 0 0.5rem; }
    .result-desc { color: #94a3b8; font-size: 1rem; line-height: 1.6; margin-bottom: 1.5rem; }
    .func-bar { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; margin: 1rem 0; }
    .func-tag {
      background: #111a26;
      padding: 0.3rem 0.8rem;
      border-radius: 2rem;
      font-size: 0.8rem;
      font-weight: 700;
      color: #94a3b8;
      border: 1px solid #2a3a50;
    }
    .func-tag.high { border-color: #a78bfa; color: #c4b5fd; background: #1e1a3a; }

    .btn {
      background: #a78bfa;
      border: none;
      padding: 0.8rem 2.5rem;
      border-radius: 3rem;
      font-weight: 700;
      font-size: 1.1rem;
      color: #0b0e17;
      cursor: pointer;
      transition: 0.2s;
      box-shadow: 0 4px 0 #5b3d9a;
      font-family: inherit;
      margin-top: 1rem;
    }
    .btn:hover { transform: translateY(-2px); background: #b8a0ff; }
    .btn:active { transform: translateY(4px); box-shadow: 0 1px 0 #5b3d9a; }

    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(8, 12, 22, 0.92);
      backdrop-filter: blur(6px);
      border-radius: 3rem;
      display: grid;
      place-items: center;
      z-index: 20;
      padding: 20px;
    }
    .overlay.hidden { display: none; }
    .start-card { background: #141a26; border: 1px solid #2a3a50; border-radius: 2rem; padding: 2rem; max-width: 400px; color: #cbd5e1; }
    .start-card h2 { color: #a78bfa; font-size: 2rem; margin: 0; }
    .start-card p { font-size: 0.95rem; line-height: 1.6; color: #94a3b8; }
    .start-card .highlight { color: #fcd34d; font-weight: 700; }

    @media (max-width: 480px) {
      .game-wrapper { padding: 1rem; border-radius: 1.5rem; }
      .card { padding: 1.2rem; min-height: 250px; }
      .question-text { font-size: 1.1rem; }
      .opt-btn { padding: 0.7rem 1rem; font-size: 0.9rem; }
      .result-type { font-size: 2rem; }
    }
  </style>
</head>
<body>
<div class="game-wrapper" id="gameWrapper">
  <!-- START SCREEN -->
  <div id="startScreen" class="screen">
    <h1>🧠 <strong>PERSONA</strong>CODE</h1>
    <div class="subtitle">STAR COMMAND · COGNITIVE DECODER</div>
    <div class="card">
      <p style="color:#94a3b8;font-size:1rem;line-height:1.6;">
        You are the captain of the starship <strong style="color:#e2e8f0;">"Intuition"</strong>.
        <br>Your choices in 10 critical scenarios will decode your <strong style="color:#a78bfa;">Cognitive Function</strong> stack.
      </p>
      <p style="color:#6b7f9a;font-size:0.85rem;">⚡ Based on Jungian Psychology (Ni, Ne, Ti, Te, Fi, Fe, Si, Se)</p>
      <button class="btn" id="startBtn">BEGIN MISSION</button>
    </div>
  </div>

  <!-- QUIZ SCREEN -->
  <div id="quizScreen" class="screen hidden">
    <div style="display:flex;justify-content:space-between;color:#4a5a72;font-size:0.9rem;margin-bottom:0.5rem;">
      <span id="qCounter">1 / 10</span>
      <span id="qProgress">⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡ ⬡</span>
    </div>
    <div class="card">
      <div id="questionText" class="question-text">Loading...</div>
      <div id="optionsContainer" class="options"></div>
    </div>
  </div>

  <!-- RESULT SCREEN -->
  <div id="resultScreen" class="screen hidden">
    <div style="margin-bottom: 0.5rem; color: #fcd34d; font-size: 0.8rem; letter-spacing: 2px;">✦ MISSION COMPLETE ✦</div>
    <div class="card">
      <div class="result-type" id="resultType">INTJ</div>
      <div class="result-name" id="resultName">The Mastermind</div>
      <div class="result-desc" id="resultDesc">Strategic, logical, and future-oriented. You trust your inner vision.</div>
      <div class="func-bar" id="funcBar"></div>
      <button class="btn" id="restartBtn">↺ RESTART MISSION</button>
    </div>
  </div>

  <!-- Overlay (Tutorial) -->
  <div class="overlay" id="overlay">
    <div class="start-card">
      <h2>🛸 WELCOME</h2>
      <p><span class="highlight">📋 RULES</span><br>
      • Choose the option that feels most <strong>natural</strong> to you.<br>
      • Don't overthink — your instinct reveals your type.<br>
      • 10 questions · 5 minutes.</p>
      <p style="font-size:0.8rem;color:#6b7f9a;">This tool uses the 8 cognitive functions (Jungian) for deep typing.</p>
      <button class="btn" id="playBtn" style="margin-top:0.5rem;">▶ LAUNCH</button>
    </div>
  </div>
</div>

<script>
  (function() {
    // --- DOM refs ---
    var startScreen = document.getElementById('startScreen');
    var quizScreen = document.getElementById('quizScreen');
    var resultScreen = document.getElementById('resultScreen');
    var overlay = document.getElementById('overlay');
    var playBtn = document.getElementById('playBtn');
    var startBtn = document.getElementById('startBtn');
    var restartBtn = document.getElementById('restartBtn');

    var questionText = document.getElementById('questionText');
    var optionsContainer = document.getElementById('optionsContainer');
    var qCounter = document.getElementById('qCounter');
    var qProgress = document.getElementById('qProgress');

    var resultType = document.getElementById('resultType');
    var resultName = document.getElementById('resultName');
    var resultDesc = document.getElementById('resultDesc');
    var funcBar = document.getElementById('funcBar');

    // --- MBTI Data (Cognitive Functions Mapping) ---
    // 8 functions: Te, Ti, Fe, Fi, Ne, Ni, Se, Si
    var questions = [
      {
        text: "A critical system failure occurs. Your crew panics. What do you do?",
        options: [
          { text: "Immediately analyze the data logs to find the root cause.", func: "Ti" },
          { text: "Calmly issue direct, step-by-step orders to fix it.", func: "Te" },
          { text: "Check on the emotional state of the crew first to stabilize morale.", func: "Fe" },
          { text: "Trust your gut feeling about which wire to pull, ignoring the manual.", func: "Ni" }
        ]
      },
      {
        text: "You encounter an unknown alien species. How do you approach them?",
        options: [
          { text: "Observe their patterns, rituals, and traditions carefully.", func: "Si" },
          { text: "Try to connect emotionally to build a rapid bridge of trust.", func: "Fi" },
          { text: "Brainstorm 100 different theories about their biology on the spot.", func: "Ne" },
          { text: "Politely negotiate a trade deal based on mutual benefit.", func: "Te" }
        ]
      },
      {
        text: "During a quiet night shift, you find yourself thinking about:",
        options: [
          { text: "The underlying patterns of the universe and how everything connects.", func: "Ni" },
          { text: "The practical tasks you need to complete tomorrow morning.", func: "Te" },
          { text: "A funny joke you heard, and how to tell it better next time.", func: "Ne" },
          { text: "A past mission and how it made you feel.", func: "Fi" }
        ]
      },
      {
        text: "Your first officer disagrees with your plan. They have a good point. You:",
        options: [
          { text: "Feel hurt, but stick to your vision if it feels right.", func: "Fi" },
          { text: "Objectively weigh both plans using a logical framework.", func: "Ti" },
          { text: "Change your plan immediately to keep the peace and harmony.", func: "Fe" },
          { text: "Compromise by integrating the best parts of both strategies.", func: "Te" }
        ]
      },
      {
        text: "How do you prefer to absorb information about a new planet?",
        options: [
          { text: "Read the scientific reports and check the hard data.", func: "Te" },
          { text: "Explore it yourself, touching the soil and feeling the wind.", func: "Se" },
          { text: "Imagine the potential stories and histories hidden in its ruins.", func: "Ni" },
          { text: "Ask the locals about their daily lives and feelings.", func: "Fe" }
        ]
      },
      {
        text: "Your ship is running low on fuel. You must decide who to help. You:",
        options: [
          { text: "Calculate the most efficient route that saves the most lives mathematically.", func: "Ti" },
          { text: "Listen to your personal values about who deserves to be saved.", func: "Fi" },
          { text: "Consult the crew to make a democratic, consensus-based decision.", func: "Fe" },
          { text: "Take a risk and dive into an uncharted nebula for fuel.", func: "Se" }
        ]
      },
      {
        text: "You are given a complex puzzle box. What is your first move?",
        options: [
          { text: "Rotate it in your hands, looking for physical weak points.", func: "Se" },
          { text: "Think about the abstract rules of how such puzzles usually work.", func: "Ni" },
          { text: "Try random combinations to see what happens.", func: "Ne" },
          { text: "Check if there are any existing instructions or similar puzzles in the database.", func: "Si" }
        ]
      },
      {
        text: "During a heated debate, you are most likely to:",
        options: [
          { text: "Stay calm and pick apart the logic of their argument.", func: "Ti" },
          { text: "Express your personal truth, even if it offends others.", func: "Fi" },
          { text: "Try to find a middle ground to keep the group cohesive.", func: "Fe" },
          { text: "Quickly research the facts to prove you're right.", func: "Te" }
        ]
      },
      {
        text: "What motivates you the most in your career?",
        options: [
          { text: "Achieving excellence and being recognized for results.", func: "Te" },
          { text: "Making a meaningful difference in people's lives.", func: "Fi" },
          { text: "Understanding the fundamental 'why' behind everything.", func: "Ti" },
          { text: "Experiencing new sensations and living in the moment.", func: "Se" }
        ]
      },
      {
        text: "You're asked to design a new city. Your approach is:",
        options: [
          { text: "Create a futuristic, symbolic layout that flows with nature.", func: "Ni" },
          { text: "Design it based on classic, proven city blueprints.", func: "Si" },
          { text: "Make it a chaotic, inspiring maze that encourages discovery.", func: "Ne" },
          { text: "Make it highly efficient, with fast transport and clear zones.", func: "Te" }
        ]
      }
    ];

    // --- MBTI Type Dictionary (Function stacks) ---
    var typeMap = {
      'INTJ': { name: 'The Architect', desc: 'Strategic, logical, and future-oriented. You trust your inner vision (Ni) and execute with efficiency (Te).', stack: ['Ni','Te','Fi','Se'] },
      'INTP': { name: 'The Logician', desc: 'Innovative, analytical, and curious. You seek truth through internal frameworks (Ti) and explore possibilities (Ne).', stack: ['Ti','Ne','Si','Fe'] },
      'ENTJ': { name: 'The Commander', desc: 'Assertive, decisive, and charismatic. You lead with external thinking (Te) and visionary insight (Ni).', stack: ['Te','Ni','Se','Fi'] },
      'ENTP': { name: 'The Debater', desc: 'Quick, clever, and enthusiastic. You explore ideas (Ne) and deconstruct logic (Ti).', stack: ['Ne','Ti','Fe','Si'] },
      'INFJ': { name: 'The Advocate', desc: 'Quiet, mystical, and inspiring. You understand future patterns (Ni) and care deeply about others (Fe).', stack: ['Ni','Fe','Ti','Se'] },
      'INFP': { name: 'The Mediator', desc: 'Empathetic, idealistic, and authentic. You follow inner values (Fi) and see endless potential (Ne).', stack: ['Fi','Ne','Si','Te'] },
      'ENFJ': { name: 'The Protagonist', desc: 'Charismatic, diplomatic, and passionate. You lead with empathy (Fe) and vision (Ni).', stack: ['Fe','Ni','Se','Ti'] },
      'ENFP': { name: 'The Campaigner', desc: 'Enthusiastic, creative, and social. You explore possibilities (Ne) and follow your heart (Fi).', stack: ['Ne','Fi','Te','Si'] },
      'ISTJ': { name: 'The Logistician', desc: 'Practical, responsible, and dutiful. You rely on past experience (Si) and factual logic (Te).', stack: ['Si','Te','Fi','Ne'] },
      'ISFJ': { name: 'The Defender', desc: 'Supportive, caring, and meticulous. You honor tradition (Si) and care for others (Fe).', stack: ['Si','Fe','Ti','Ne'] },
      'ESTJ': { name: 'The Executive', desc: 'Organized, decisive, and tough. You enforce order (Te) and rely on practical experience (Si).', stack: ['Te','Si','Ne','Fi'] },
      'ESFJ': { name: 'The Consul', desc: 'Friendly, helpful, and social. You care for harmony (Fe) and draw on concrete details (Si).', stack: ['Fe','Si','Ne','Ti'] },
      'ISTP': { name: 'The Virtuoso', desc: 'Action-oriented, analytical, and bold. You solve immediate problems (Ti) with hands-on skill (Se).', stack: ['Ti','Se','Ni','Fe'] },
      'ISFP': { name: 'The Adventurer', desc: 'Gentle, artistic, and spontaneous. You follow your feelings (Fi) and savor the present (Se).', stack: ['Fi','Se','Ni','Te'] },
      'ESTP': { name: 'The Entrepreneur', desc: 'Energetic, perceptive, and persuasive. You act on impulse (Se) and think on your feet (Ti).', stack: ['Se','Ti','Fe','Ni'] },
      'ESFP': { name: 'The Entertainer', desc: 'Spontaneous, enthusiastic, and lively. You live in the moment (Se) and connect with people (Fi).', stack: ['Se','Fi','Te','Ni'] }
    };

    // --- State ---
    var currentQuestion = 0;
    var scores = { 'Te':0, 'Ti':0, 'Fe':0, 'Fi':0, 'Ne':0, 'Ni':0, 'Se':0, 'Si':0 };
    var totalQuestions = questions.length;
    var gameActive = false;

    // --- Helpers ---
    function shuffleArray(arr) {
      for (var i = arr.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
      }
      return arr;
    }

    // Shuffle questions for variety, but keep them consistent for the session.
    var shuffledQuestions = shuffleArray(questions.slice());

    // --- Render Quiz ---
    function renderQuestion(index) {
      if (index >= totalQuestions) {
        showResult();
        return;
      }
      var q = shuffledQuestions[index];
      questionText.textContent = q.text;
      optionsContainer.innerHTML = '';
      
      // Shuffle options to avoid bias
      var shuffledOpts = shuffleArray(q.options.slice());
      for (var i = 0; i < shuffledOpts.length; i++) {
        var opt = shuffledOpts[i];
        var btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.textContent = String.fromCharCode(65 + i) + '. ' + opt.text; // A, B, C, D
        btn.dataset.func = opt.func;
        btn.addEventListener('click', function(e) {
          var func = this.dataset.func;
          scores[func] = (scores[func] || 0) + 1;
          currentQuestion++;
          updateProgress();
          renderQuestion(currentQuestion);
        });
        optionsContainer.appendChild(btn);
      }

      qCounter.textContent = (index + 1) + ' / ' + totalQuestions;
    }

    function updateProgress() {
      var total = totalQuestions;
      var done = currentQuestion;
      var filled = '⬢'.repeat(Math.min(done, total));
      var empty = '⬡'.repeat(Math.max(0, total - done));
      qProgress.textContent = filled + empty;
    }

    // --- Show Result ---
    function showResult() {
      // Find dominant and auxiliary functions
      var sorted = Object.keys(scores).sort(function(a, b) {
        return scores[b] - scores[a];
      });

      var dom = sorted[0];
      var aux = sorted[1];
      
      // Find the MBTI type match
      var matchedType = null;
      var matchedScore = 0;

      for (var type in typeMap) {
        var stack = typeMap[type].stack;
        var score = 0;
        // Check if dom and aux are in the top 2 of the stack
        if (stack[0] === dom) score += 3;
        else if (stack[1] === dom) score += 2;
        if (stack[0] === aux) score += 2;
        else if (stack[1] === aux) score += 1;
        // Bonus if both match exactly
        if (stack[0] === dom && stack[1] === aux) score += 5;
        
        if (score > matchedScore) {
          matchedScore = score;
          matchedType = type;
        }
      }

      // Fallback if no match (shouldn't happen)
      if (!matchedType) {
        // Simple dichotomy fallback
        var e = (scores['Te'] + scores['Fe']) > (scores['Ti'] + scores['Fi']) ? 'E' : 'I';
        var n = (scores['Ne'] + scores['Ni']) > (scores['Se'] + scores['Si']) ? 'N' : 'S';
        var t = (scores['Te'] + scores['Ti']) > (scores['Fe'] + scores['Fi']) ? 'T' : 'F';
        var j = (scores['Te'] + scores['Fe'] + scores['Ni'] + scores['Si']) > (scores['Ti'] + scores['Fi'] + scores['Ne'] + scores['Se']) ? 'J' : 'P';
        matchedType = e + n + t + j;
      }

      var data = typeMap[matchedType] || typeMap['INTJ'];
      
      // Display result
      resultType.textContent = matchedType;
      resultName.textContent = data.name;
      resultDesc.textContent = data.desc;

      // Display function bars
      funcBar.innerHTML = '';
      var sortedFuncs = Object.keys(scores).sort(function(a, b) {
        return scores[b] - scores[a];
      });
      for (var i = 0; i < sortedFuncs.length; i++) {
        var f = sortedFuncs[i];
        var tag = document.createElement('span');
        tag.className = 'func-tag';
        if (i < 2) tag.classList.add('high');
        tag.textContent = f + ' (' + scores[f] + ')';
        funcBar.appendChild(tag);
      }

      // Switch screens
      startScreen.classList.add('hidden');
      quizScreen.classList.add('hidden');
      resultScreen.classList.remove('hidden');
    }

    // --- Reset Game ---
    function resetGame() {
      currentQuestion = 0;
      scores = { 'Te':0, 'Ti':0, 'Fe':0, 'Fi':0, 'Ne':0, 'Ni':0, 'Se':0, 'Si':0 };
      shuffledQuestions = shuffleArray(questions.slice());
      gameActive = false;
      
      startScreen.classList.remove('hidden');
      quizScreen.classList.add('hidden');
      resultScreen.classList.add('hidden');
      overlay.classList.add('hidden');
      updateProgress();
    }

    // --- Start Quiz ---
    function startQuiz() {
      resetGame();
      // Ensure we start fresh
      currentQuestion = 0;
      scores = { 'Te':0, 'Ti':0, 'Fe':0, 'Fi':0, 'Ne':0, 'Ni':0, 'Se':0, 'Si':0 };
      shuffledQuestions = shuffleArray(questions.slice());
      
      startScreen.classList.add('hidden');
      quizScreen.classList.remove('hidden');
      resultScreen.classList.add('hidden');
      overlay.classList.add('hidden');
      gameActive = true;
      updateProgress();
      renderQuestion(0);
    }

    // --- Event Bindings ---
    playBtn.addEventListener('click', function() {
      overlay.classList.add('hidden');
      startQuiz();
    });

    startBtn.addEventListener('click', startQuiz);
    restartBtn.addEventListener('click', function() {
      resetGame();
      overlay.classList.remove('hidden'); // Show welcome again
    });

    // Initial state: show overlay and start screen
    resetGame();
    overlay.classList.remove('hidden');

    // Handle keyboard shortcuts (numbers 1-4 for quick selection)
    document.addEventListener('keydown', function(e) {
      if (!gameActive) return;
      var key = parseInt(e.key);
      if (key >= 1 && key <= 4) {
        var btns = optionsContainer.querySelectorAll('.opt-btn');
        if (btns[key - 1]) btns[key - 1].click();
      }
    });

  })();
</script>
</body>
</html>`;

  window.initGame = function initGame(wrapper) {
    if (!wrapper || typeof wrapper.replaceChildren !== 'function') {
      throw new Error('initGame requires a container element.');
    }
    var frame = document.createElement('iframe');
    frame.title = 'MBTI · Persona Code';
    frame.setAttribute('allow', 'autoplay; fullscreen');
    frame.style.cssText = 'display:block;width:100%;height:580px;border:0;border-radius:16px;background:#0b0e17;';
    frame.srcdoc = gameHTML;
    wrapper.replaceChildren(frame);
    return frame;
  };
})();
