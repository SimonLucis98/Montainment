/* Reincarnation · Dual Worlds (Cultivation & Magic) */
(function () {
  'use strict';

  const gameHTML = `<!doctype html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>轮回 · 双界</title>
  <style>
    * { box-sizing: border-box; user-select: none; }
    body {
      min-height: 100vh;
      margin: 0;
      background: #0a0a0c;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Segoe UI', 'PingFang SC', system-ui, sans-serif;
    }
    .game-wrapper {
      background: #14161a;
      padding: 1.5rem;
      border-radius: 2.5rem;
      box-shadow: 0 20px 50px rgba(0,0,0,0.9);
      max-width: 680px;
      width: 100%;
      position: relative;
      border: 1px solid #2a2e3a;
    }
    .screen { display: block; }
    .screen.hidden { display: none; }

    /* Top bar */
    .top-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #8a9aaa;
      font-size: 0.8rem;
      padding: 0 0.2rem 0.8rem;
      border-bottom: 1px solid #2a2e3a;
      margin-bottom: 1rem;
    }
    .lang-btn {
      background: #2a2e3a;
      border: none;
      padding: 0.2rem 0.8rem;
      border-radius: 1rem;
      color: #c0d0e0;
      cursor: pointer;
      font-size: 0.7rem;
      font-weight: 700;
      transition: 0.2s;
    }
    .lang-btn:hover { background: #3a4a5a; }

    .story-box {
      background: #1a1e24;
      border-radius: 1.8rem;
      padding: 1.8rem;
      min-height: 320px;
      border: 1px solid #2a2e3a;
      box-shadow: inset 0 4px 12px rgba(0,0,0,0.6);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .story-text {
      color: #e0e8f0;
      font-size: 1.05rem;
      line-height: 1.8;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .story-text .em { color: #f5c542; font-weight: 700; }
    .story-text .bad { color: #e07c6c; font-weight: 700; }
    .story-text .good { color: #8bcb8b; font-weight: 700; }

    .choices {
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
      margin-top: 1.5rem;
    }
    .choice-btn {
      background: #242a32;
      border: 1px solid #3a4250;
      border-radius: 1.2rem;
      padding: 0.8rem 1.2rem;
      color: #d0dce8;
      font-size: 1rem;
      text-align: left;
      cursor: pointer;
      transition: 0.2s;
      font-family: inherit;
      box-shadow: 0 2px 0 #0a0c10;
    }
    .choice-btn:hover { background: #34404e; border-color: #6a8aaa; }
    .choice-btn:active { transform: scale(0.98); }

    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(100px,1fr));
      gap: 0.3rem;
      background: #12161c;
      border-radius: 1rem;
      padding: 0.6rem 0.8rem;
      margin-bottom: 0.8rem;
      font-size: 0.75rem;
      color: #8a9aaa;
      border: 1px solid #2a2e3a;
    }
    .status-grid .val { color: #f0e8d0; font-weight: 600; }

    .btn {
      background: #4a6a8a;
      border: none;
      padding: 0.7rem 2rem;
      border-radius: 3rem;
      font-weight: 700;
      font-size: 1rem;
      color: #0a0c10;
      cursor: pointer;
      transition: 0.2s;
      box-shadow: 0 4px 0 #1a2a3a;
      font-family: inherit;
    }
    .btn:hover { transform: translateY(-2px); background: #5a7a9a; }
    .btn:active { transform: translateY(4px); box-shadow: 0 1px 0 #1a2a3a; }

    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(8,10,14,0.92);
      backdrop-filter: blur(8px);
      border-radius: 2.5rem;
      display: grid;
      place-items: center;
      z-index: 20;
      padding: 20px;
    }
    .overlay.hidden { display: none; }
    .start-card {
      background: #1a1e24;
      border: 1px solid #3a4a5a;
      border-radius: 2rem;
      padding: 2rem;
      max-width: 400px;
      color: #d0dce8;
      text-align: center;
    }
    .start-card h2 { color: #f5c542; font-size: 2.2rem; margin: 0.2rem 0; }
    .start-card p { font-size: 0.95rem; line-height: 1.6; color: #8a9aaa; }

    @media (max-width: 480px) {
      .game-wrapper { padding: 0.8rem; border-radius: 1.5rem; }
      .story-box { padding: 1.2rem; min-height: 240px; }
      .story-text { font-size: 0.95rem; }
      .choice-btn { padding: 0.6rem 1rem; font-size: 0.9rem; }
      .status-grid { grid-template-columns: repeat(2,1fr); }
    }
  </style>
</head>
<body>
<div class="game-wrapper" id="gameWrapper">
  <div class="top-bar">
    <span id="gameTitle">🌌 轮回·双界</span>
    <button class="lang-btn" id="langToggle">EN</button>
  </div>

  <!-- status area (dynamic) -->
  <div id="statusArea" class="status-grid hidden"></div>

  <!-- story box -->
  <div class="story-box">
    <div id="storyText" class="story-text">点击「开始」进入轮回...</div>
    <div id="choicesContainer" class="choices"></div>
  </div>

  <!-- Overlay for start / death / reincarnation -->
  <div class="overlay" id="overlay">
    <div class="start-card">
      <h2 id="overlayTitle">🌱 轮回之门</h2>
      <p id="overlayDesc">你将在两个世界间穿梭，体验不同的命运。</p>
      <button class="btn" id="overlayBtn">开始</button>
    </div>
  </div>
</div>

<script>
  (function() {
    // -------------------- LANGUAGE DATA --------------------
    const LANG = {
      zh: {
        title: '🌌 轮回·双界',
        deathScene: '💀 你闭上了双眼，眼前一片漆黑，意识逐渐消散……\n你，死了。',
        reincarnatePrompt: '⚡ 一道金光闪过，你获得了重生的机会！\n选择你的新世界：',
        worldCultivation: '🧘 修仙世界',
        worldMagic: '🔮 魔法世界',
        worldNo: '🕊️ 不重生（生死有命）',
        noRebirthMsg: '你闭上双眼，眼前一片黑暗，你道别离开了。',
        // more...
        // We'll embed most strings inside the game logic using a function.
      },
      en: {
        title: '🌌 Reincarnation · Dual Worlds',
        deathScene: '💀 You close your eyes, darkness swallows you...\nYou are dead.',
        reincarnatePrompt: '⚡ A golden light shines — you have a chance to be reborn!\nChoose your new world:',
        worldCultivation: '🧘 Cultivation World',
        worldMagic: '🔮 Magic World',
        worldNo: '🕊️ Accept Death',
        noRebirthMsg: 'You close your eyes, darkness engulfs you, and you depart.',
      }
    };

    // We'll use a global lang variable, default 'zh'
    let lang = 'zh';
    function t(key) { return LANG[lang][key] || key; }

    // -------------------- GAME STATE --------------------
    let gameState = {
      screen: 'death', // death, worldSelect, cultivation, magic, ending
      world: null, // 'cultivation' or 'magic'
      character: null,
      turn: 0,
      maxTurns: 999,
      dead: false,
      inheritedStats: null, // from previous death
      // For cultivation
      cultivation: {
        realm: 0, // index into realms
        stage: 0, // 0:初期,1:中期,2:后期,3:大圆满
        cultivationBase: 0, // progress within stage
        // attributes
        talent: {}, // 资质,悟性,灵根,根骨,气感,魅力,机缘,潜力
        // events
      },
      // For magic
      magic: {
        level: 1,
        exp: 0,
        class: null, // 'mage','warrior','dual'
        element: [], // array of elements
        weapon: null, // 'sword','greatsword','bow','dagger'
        // attributes similar
      }
    };

    // -------------------- REALMS (Cultivation) --------------------
    const REALMS = [
      '炼气', '筑基', '金丹', '元婴', '化神', '炼虚',
      '合体', '大乘', '渡劫', '真仙', '天仙', '金仙', '神帝'
    ];
    const STAGES = ['初期', '中期', '后期', '大圆满'];

    // -------------------- DOM refs --------------------
    const storyText = document.getElementById('storyText');
    const choicesContainer = document.getElementById('choicesContainer');
    const statusArea = document.getElementById('statusArea');
    const overlay = document.getElementById('overlay');
    const overlayTitle = document.getElementById('overlayTitle');
    const overlayDesc = document.getElementById('overlayDesc');
    const overlayBtn = document.getElementById('overlayBtn');
    const langToggle = document.getElementById('langToggle');
    const gameTitle = document.getElementById('gameTitle');

    // -------------------- UTILITY --------------------
    function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function pick(arr) { return arr[rand(0, arr.length-1)]; }
    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

    // -------------------- LANGUAGE SWITCH --------------------
    langToggle.addEventListener('click', function() {
      lang = (lang === 'zh') ? 'en' : 'zh';
      langToggle.textContent = lang === 'zh' ? 'EN' : '中文';
      gameTitle.textContent = t('title');
      // re-render current screen
      renderCurrentScreen();
    });

    // -------------------- RENDER ENGINE --------------------
    function render(text, choices) {
      storyText.innerHTML = text;
      choicesContainer.innerHTML = '';
      if (choices) {
        choices.forEach(function(c) {
          const btn = document.createElement('button');
          btn.className = 'choice-btn';
          btn.textContent = c.label;
          btn.addEventListener('click', c.action);
          choicesContainer.appendChild(btn);
        });
      }
    }

    function updateStatus(data) {
      // data is an object of key:value
      statusArea.classList.remove('hidden');
      let html = '';
      for (let k in data) {
        html += \`<div>\${k}: <span class="val">\${data[k]}</span></div>\`;
      }
      statusArea.innerHTML = html;
    }

    function hideStatus() { statusArea.classList.add('hidden'); }

    // -------------------- SCENES --------------------
    // We'll have a global function to render current screen based on gameState.screen

    function renderCurrentScreen() {
      const s = gameState;
      if (s.screen === 'death') {
        showDeathScene();
      } else if (s.screen === 'worldSelect') {
        showWorldSelect();
      } else if (s.screen === 'cultivation') {
        renderCultivation();
      } else if (s.screen === 'magic') {
        renderMagic();
      } else if (s.screen === 'ending') {
        showEnding();
      } else {
        // fallback
        render('Unknown state', []);
      }
    }

    // ----- Death Scene -----
    function showDeathScene() {
      hideStatus();
      const msg = t('deathScene') + '\n\n' + t('reincarnatePrompt');
      render(msg, [
        { label: t('worldCultivation'), action: function() { startCultivation(); } },
        { label: t('worldMagic'), action: function() { startMagic(); } },
        { label: t('worldNo'), action: function() { noRebirth(); } }
      ]);
    }

    function noRebirth() {
      gameState.screen = 'ending';
      render(t('noRebirthMsg'), []);
      hideStatus();
    }

    // ----- Start Cultivation -----
    function startCultivation() {
      gameState.world = 'cultivation';
      gameState.screen = 'cultivation';
      // Generate character
      const char = generateCultivationChar();
      gameState.character = char;
      // Show initial status
      renderCultivation();
    }

    function generateCultivationChar() {
      // random attributes
      const talent = {
        资质: rand(10, 30),
        悟性: rand(10, 30),
        灵根: generateLingGen(),
        根骨: rand(10, 30),
        气感: rand(10, 30),
        魅力: rand(10, 30),
        机缘: rand(5, 25),
        潜力: rand(30, 70)
      };
      // 灵根 is an array of objects { element, quality }
      return { talent: talent, realm: 0, stage: 0, cultivationBase: 0, age: 16, events: [] };
    }

    function generateLingGen() {
      const elements = ['金','木','水','火','土'];
      const qualities = ['低级','中级','高级','极品'];
      const count = rand(1, 5); // 1-5灵根
      const selected = [];
      const pool = elements.slice();
      for (let i=0; i<count && pool.length>0; i++) {
        const idx = rand(0, pool.length-1);
        const el = pool.splice(idx,1)[0];
        selected.push({ element: el, quality: qualities[rand(0,3)] });
      }
      return selected;
    }

    function renderCultivation() {
      const char = gameState.character;
      const realmName = REALMS[char.realm] || '???';
      const stageName = STAGES[char.stage] || '';
      const status = {
        '境界': realmName + ' ' + stageName,
        '修为': char.cultivationBase,
        '资质': char.talent.资质,
        '悟性': char.talent.悟性,
        '根骨': char.talent.根骨,
        '气感': char.talent.气感,
        '魅力': char.talent.魅力,
        '机缘': char.talent.机缘,
        '潜力': char.talent.潜力,
        '灵根': char.talent.灵根.map(l => l.element + l.quality).join(', ')
      };
      updateStatus(status);

      // Story: show realm and options
      let text = \`🧘 修仙世界 · \${realmName} \${stageName}\n\n`;
      text += \`你今年\${char.age}岁，正在\${realmName}\${stageName}苦苦修炼。\n\`;
      text += \`修为：\${char.cultivationBase}/100 (当前阶段进度)\n\`;
      // Add random event possibilities
      const choices = [
        { label: '⚔️ 历练（提升修为）', action: function() { cultivationPractice(); } },
        { label: '📖 悟道（提升悟性）', action: function() { cultivationInsight(); } },
        { label: '💊 寻药（机缘）', action: function() { cultivationSeek(); } },
        { label: '🏔️ 闭关（突破瓶颈）', action: function() { cultivationBreakthrough(); } }
      ];
      // If at大圆满, show突破选项
      if (char.stage === 3 && char.cultivationBase >= 100) {
        choices.push({ label: '⚡ 突破境界！', action: function() { cultivationAdvance(); } });
      }
      render(text, choices);
    }

    // ---- Cultivation actions ----
    function cultivationPractice() {
      const char = gameState.character;
      const gain = rand(5, 15) + Math.floor(char.talent.悟性/5);
      char.cultivationBase = clamp(char.cultivationBase + gain, 0, 100);
      char.age += rand(1,3);
      // chance of random event
      if (Math.random() < 0.2) triggerCultivationEvent();
      renderCultivation();
    }

    function cultivationInsight() {
      const char = gameState.character;
      const gain = rand(1,5);
      char.talent.悟性 = clamp(char.talent.悟性 + gain, 0, 100);
      char.age += 1;
      renderCultivation();
    }

    function cultivationSeek() {
      const char = gameState.character;
      const chance = rand(1,100);
      if (chance <= char.talent.机缘) {
        // 奇遇
        const gain = rand(10, 30);
        char.cultivationBase = clamp(char.cultivationBase + gain, 0, 100);
        // also may increase attributes
        const attr = pick(['资质','根骨','气感','魅力']);
        char.talent[attr] = clamp(char.talent[attr] + rand(1,5), 0, 100);
        render('✨ 奇遇！你找到了一株千年灵草，修为大增！', []);
        // Continue after a moment
        setTimeout(renderCultivation, 1000);
      } else {
        // 危机
        const loss = rand(5, 15);
        char.cultivationBase = clamp(char.cultivationBase - loss, 0, 100);
        char.age += 2;
        render('💀 你误入险地，受伤了，修为倒退。', []);
        setTimeout(renderCultivation, 1000);
      }
    }

    function cultivationBreakthrough() {
      const char = gameState.character;
      if (char.stage < 3) {
        char.stage++;
        char.cultivationBase = 0;
        render('🎉 你突破到' + REALMS[char.realm] + STAGES[char.stage] + '！', []);
        setTimeout(renderCultivation, 1000);
      } else if (char.realm < REALMS.length-1) {
        // 突破大境界
        char.realm++;
        char.stage = 0;
        char.cultivationBase = 0;
        render('🌟 你成功突破到' + REALMS[char.realm] + '初期！', []);
        setTimeout(renderCultivation, 1000);
      } else {
        // 已到神帝大圆满
        render('🏆 你已经达到神帝大圆满，三界无敌！', []);
        // maybe win condition
      }
    }

    function cultivationAdvance() {
      // same as breakthrough but called separately
      cultivationBreakthrough();
    }

    function triggerCultivationEvent() {
      // more complex events can be added
    }

    // ----- Start Magic -----
    function startMagic() {
      gameState.world = 'magic';
      gameState.screen = 'magic';
      const char = generateMagicChar();
      gameState.character = char;
      renderMagic();
    }

    function generateMagicChar() {
      const classType = pick(['mage','warrior','dual']);
      let elements = [];
      let weapon = null;
      if (classType === 'mage' || classType === 'dual') {
        const allElements = ['雷','木','水','火','土','光','暗'];
        const count = rand(1, 4);
        const pool = allElements.slice();
        for (let i=0; i<count && pool.length>0; i++) {
          const idx = rand(0, pool.length-1);
          elements.push(pool.splice(idx,1)[0]);
        }
      }
      if (classType === 'warrior' || classType === 'dual') {
        const weapons = ['单手剑','双手剑','弓箭','短剑'];
        weapon = pick(weapons);
      }
      return {
        class: classType,
        level: 1,
        exp: 0,
        elements: elements,
        weapon: weapon,
        // attributes
        strength: rand(5,20),
        agility: rand(5,20),
        intelligence: rand(5,20),
        vitality: rand(5,20),
        charm: rand(5,20),
        luck: rand(5,20)
      };
    }

    function renderMagic() {
      const char = gameState.character;
      const cls = char.class === 'mage' ? '魔法师' : char.class === 'warrior' ? '炼体师' : '魔武双修';
      const status = {
        '职业': cls,
        '等级': char.level,
        '经验': char.exp + '/' + (char.level * 10),
        '元素': char.elements.length ? char.elements.join(', ') : '无',
        '武器': char.weapon || '无',
        '力量': char.strength,
        '敏捷': char.agility,
        '智力': char.intelligence,
        '体质': char.vitality,
        '魅力': char.charm,
        '幸运': char.luck
      };
      updateStatus(status);

      let text = \`🔮 魔法世界 · \${cls}\n\n`;
      text += \`等级 \${char.level}，经验 \${char.exp}/\${char.level*10}\n\`;
      text += \`元素：\${char.elements.length ? char.elements.join('、') : '无'}\n\`;
      text += \`武器：\${char.weapon || '无'}\n\`;

      const choices = [
        { label: '⚔️ 冒险（获得经验）', action: function() { magicAdventure(); } },
        { label: '📚 学习（提升技能）', action: function() { magicStudy(); } },
        { label: '🧙 探索（机缘）', action: function() { magicExplore(); } },
        { label: '💪 锻炼（提升属性）', action: function() { magicTrain(); } }
      ];
      render(text, choices);
    }

    function magicAdventure() {
      const char = gameState.character;
      const gain = rand(5, 15) + Math.floor(char.level/2);
      char.exp += gain;
      // check level up
      while (char.exp >= char.level * 10) {
        char.exp -= char.level * 10;
        char.level++;
        // attribute gain
        const attr = pick(['strength','agility','intelligence','vitality']);
        char[attr] += rand(1,3);
        render('🎉 你升级了！当前等级 ' + char.level, []);
        setTimeout(renderMagic, 800);
        return;
      }
      // random event
      if (Math.random() < 0.15) triggerMagicEvent();
      renderMagic();
    }

    function magicStudy() {
      const char = gameState.character;
      // 学习新元素或提升等级
      if (char.elements.length < 7 && Math.random() < 0.3) {
        const all = ['雷','木','水','火','土','光','暗'];
        const available = all.filter(e => !char.elements.includes(e));
        if (available.length) {
          const newEl = pick(available);
          char.elements.push(newEl);
          render('📖 你领悟了新的元素：' + newEl, []);
          setTimeout(renderMagic, 800);
          return;
        }
      }
      // else gain intelligence
      char.intelligence += rand(1,3);
      render('📖 你刻苦学习，智力提升了。', []);
      setTimeout(renderMagic, 800);
    }

    function magicExplore() {
      const char = gameState.character;
      if (Math.random() < 0.3) {
        // 奇遇
        const gain = rand(10, 30);
        char.exp += gain;
        render('✨ 你发现了古代遗迹，获得大量经验！', []);
        setTimeout(renderMagic, 800);
      } else {
        // 危机
        const loss = rand(5, 15);
        char.exp = Math.max(0, char.exp - loss);
        render('💀 你遭遇了陷阱，损失了一些经验。', []);
        setTimeout(renderMagic, 800);
      }
    }

    function magicTrain() {
      const char = gameState.character;
      const attr = pick(['strength','agility','vitality']);
      char[attr] += rand(1,4);
      render('💪 你锻炼了' + attr + '，属性提升。', []);
      setTimeout(renderMagic, 800);
    }

    function triggerMagicEvent() {
      // can be expanded
    }

    // ----- ENDING -----
    function showEnding() {
      hideStatus();
      // show a nice ending message
      render('🌟 你的故事结束了...', []);
    }

    // ----- OVERLAY / INIT -----
    function initGame() {
      // show death scene by default
      gameState.screen = 'death';
      hideStatus();
      overlay.classList.add('hidden');
      renderCurrentScreen();
    }

    overlayBtn.addEventListener('click', function() {
      overlay.classList.add('hidden');
      initGame();
    });

    // show overlay on load
    overlay.classList.remove('hidden');
    overlayTitle.textContent = '🌱 轮回之门';
    overlayDesc.textContent = '你将在两个世界间穿梭，体验不同的命运。';

    // initial language
    langToggle.textContent = 'EN';
    gameTitle.textContent = '🌌 轮回·双界';

    // Expose to global for debugging
    window.gameState = gameState;

  })();
</script>
</body>
</html>`;

  window.initGame = function initGame(wrapper) {
    if (!wrapper || typeof wrapper.replaceChildren !== 'function') {
      throw new Error('initGame requires a container element.');
    }
    const frame = document.createElement('iframe');
    frame.title = '轮回 · 双界';
    frame.setAttribute('allow', 'autoplay; fullscreen');
    frame.style.cssText = 'display:block;width:100%;height:620px;border:0;border-radius:16px;background:#0a0a0c;';
    frame.srcdoc = gameHTML;
    wrapper.replaceChildren(frame);
    return frame;
  };
})();
