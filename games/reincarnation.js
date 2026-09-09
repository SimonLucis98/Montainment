/* Reincarnation · Dual Worlds (Cultivation & Magic) — Fixed */
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
      grid-template-columns: repeat(auto-fill, minmax(110px,1fr));
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

  <div id="statusArea" class="status-grid hidden"></div>

  <div class="story-box">
    <div id="storyText" class="story-text">点击「开始」进入轮回...</div>
    <div id="choicesContainer" class="choices"></div>
  </div>

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
    // ------------------------------------------------------------
    // 1. 语言数据
    // ------------------------------------------------------------
    var LANG = {
      zh: {
        title: '🌌 轮回·双界',
        deathScene: '💀 你闭上了双眼，眼前一片漆黑，意识逐渐消散……\\n你，死了。',
        reincarnatePrompt: '⚡ 一道金光闪过，你获得了重生的机会！\\n选择你的新世界：',
        worldCultivation: '🧘 修仙世界',
        worldMagic: '🔮 魔法世界',
        worldNo: '🕊️ 不重生（生死有命）',
        noRebirthMsg: '你闭上双眼，眼前一片黑暗，你道别离开了。',
        realmNames: ['炼气','筑基','金丹','元婴','化神','炼虚','合体','大乘','渡劫','真仙','天仙','金仙','神帝'],
        stageNames: ['初期','中期','后期','大圆满'],
        classMage: '魔法师',
        classWarrior: '炼体师',
        classDual: '魔武双修',
        elements: ['雷','木','水','火','土','光','暗'],
        weapons: ['单手剑','双手剑','弓箭','短剑']
      },
      en: {
        title: '🌌 Reincarnation · Dual Worlds',
        deathScene: '💀 You close your eyes, darkness swallows you...\\nYou are dead.',
        reincarnatePrompt: '⚡ A golden light shines — you have a chance to be reborn!\\nChoose your new world:',
        worldCultivation: '🧘 Cultivation World',
        worldMagic: '🔮 Magic World',
        worldNo: '🕊️ Accept Death',
        noRebirthMsg: 'You close your eyes, darkness engulfs you, and you depart.',
        realmNames: ['Qi Condensation','Foundation','Core','Nascent Soul','Spirit','Void','Integration','Mahayana','Tribulation','True Immortal','Heavenly Immortal','Golden Immortal','Divine Emperor'],
        stageNames: ['Early','Middle','Late','Peak'],
        classMage: 'Mage',
        classWarrior: 'Warrior',
        classDual: 'Dual Cultivator',
        elements: ['Thunder','Wood','Water','Fire','Earth','Light','Dark'],
        weapons: ['One-Handed Sword','Greatsword','Bow','Dagger']
      }
    };

    var lang = 'zh';
    function t(key) { return LANG[lang][key] || key; }

    // ------------------------------------------------------------
    // 2. DOM 引用
    // ------------------------------------------------------------
    var storyText = document.getElementById('storyText');
    var choicesContainer = document.getElementById('choicesContainer');
    var statusArea = document.getElementById('statusArea');
    var overlay = document.getElementById('overlay');
    var overlayTitle = document.getElementById('overlayTitle');
    var overlayDesc = document.getElementById('overlayDesc');
    var overlayBtn = document.getElementById('overlayBtn');
    var langToggle = document.getElementById('langToggle');
    var gameTitle = document.getElementById('gameTitle');

    // ------------------------------------------------------------
    // 3. 工具函数
    // ------------------------------------------------------------
    function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function pick(arr) { return arr[rand(0, arr.length-1)]; }
    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

    // ------------------------------------------------------------
    // 4. 游戏状态
    // ------------------------------------------------------------
    var game = {
      screen: 'death',        // 'death', 'worldSelect', 'cultivation', 'magic', 'ending'
      world: null,
      character: null,
      turn: 0,
      maxTurns: 999,
      dead: false
    };

    // ------------------------------------------------------------
    // 5. 常量
    // ------------------------------------------------------------
    var REALMS = t('realmNames');
    var STAGES = t('stageNames');

    // ------------------------------------------------------------
    // 6. 渲染引擎
    // ------------------------------------------------------------
    function render(text, choices) {
      storyText.innerHTML = text.replace(/\\n/g, '<br>');
      choicesContainer.innerHTML = '';
      if (choices && choices.length) {
        choices.forEach(function(c) {
          var btn = document.createElement('button');
          btn.className = 'choice-btn';
          btn.textContent = c.label;
          btn.addEventListener('click', c.action);
          choicesContainer.appendChild(btn);
        });
      }
    }

    function updateStatus(data) {
      statusArea.classList.remove('hidden');
      var html = '';
      for (var k in data) {
        html += '<div>' + k + ': <span class="val">' + data[k] + '</span></div>';
      }
      statusArea.innerHTML = html;
    }

    function hideStatus() { statusArea.classList.add('hidden'); }

    // ------------------------------------------------------------
    // 7. 场景函数
    // ------------------------------------------------------------

    // 7.1 死亡场景
    function showDeathScene() {
      hideStatus();
      var msg = t('deathScene') + '\\n\\n' + t('reincarnatePrompt');
      render(msg, [
        { label: t('worldCultivation'), action: function() { startCultivation(); } },
        { label: t('worldMagic'), action: function() { startMagic(); } },
        { label: t('worldNo'), action: function() { noRebirth(); } }
      ]);
    }

    function noRebirth() {
      game.screen = 'ending';
      render(t('noRebirthMsg'), []);
      hideStatus();
    }

    // 7.2 修仙世界
    function startCultivation() {
      game.world = 'cultivation';
      game.screen = 'cultivation';
      game.character = generateCultivationChar();
      renderCultivation();
    }

    function generateCultivationChar() {
      var talent = {
        资质: rand(10, 30),
        悟性: rand(10, 30),
        灵根: generateLingGen(),
        根骨: rand(10, 30),
        气感: rand(10, 30),
        魅力: rand(10, 30),
        机缘: rand(5, 25),
        潜力: rand(30, 70)
      };
      return {
        talent: talent,
        realm: 0,
        stage: 0,
        cultivationBase: 0,
        age: 16,
        events: []
      };
    }

    function generateLingGen() {
      var elements = ['金','木','水','火','土'];
      var qualities = ['低级','中级','高级','极品'];
      var count = rand(1, 5);
      var selected = [];
      var pool = elements.slice();
      for (var i=0; i<count && pool.length>0; i++) {
        var idx = rand(0, pool.length-1);
        var el = pool.splice(idx,1)[0];
        selected.push({ element: el, quality: qualities[rand(0,3)] });
      }
      return selected;
    }

    function renderCultivation() {
      var char = game.character;
      var realmName = REALMS[char.realm] || '???';
      var stageName = STAGES[char.stage] || '';
      var status = {
        '境界': realmName + ' ' + stageName,
        '修为': char.cultivationBase,
        '资质': char.talent.资质,
        '悟性': char.talent.悟性,
        '根骨': char.talent.根骨,
        '气感': char.talent.气感,
        '魅力': char.talent.魅力,
        '机缘': char.talent.机缘,
        '潜力': char.talent.潜力,
        '灵根': char.talent.灵根.map(function(l){ return l.element + l.quality; }).join(', ')
      };
      updateStatus(status);

      var text = '🧘 修仙世界 · ' + realmName + ' ' + stageName + '\\n\\n';
      text += '你今年' + char.age + '岁，正在' + realmName + stageName + '苦苦修炼。\\n';
      text += '修为：' + char.cultivationBase + '/100 (当前阶段进度)\\n';

      var choices = [
        { label: '⚔️ 历练（提升修为）', action: function() { cultivationPractice(); } },
        { label: '📖 悟道（提升悟性）', action: function() { cultivationInsight(); } },
        { label: '💊 寻药（机缘）', action: function() { cultivationSeek(); } }
      ];
      if (char.stage === 3 && char.cultivationBase >= 100) {
        choices.push({ label: '⚡ 突破境界！', action: function() { cultivationBreakthrough(); } });
      }
      render(text, choices);
    }

    function cultivationPractice() {
      var char = game.character;
      var gain = rand(5, 15) + Math.floor(char.talent.悟性/5);
      char.cultivationBase = clamp(char.cultivationBase + gain, 0, 100);
      char.age += rand(1,3);
      if (Math.random() < 0.2) triggerCultivationEvent();
      renderCultivation();
    }

    function cultivationInsight() {
      var char = game.character;
      var gain = rand(1,5);
      char.talent.悟性 = clamp(char.talent.悟性 + gain, 0, 100);
      char.age += 1;
      renderCultivation();
    }

    function cultivationSeek() {
      var char = game.character;
      var chance = rand(1,100);
      if (chance <= char.talent.机缘) {
        var gain = rand(10, 30);
        char.cultivationBase = clamp(char.cultivationBase + gain, 0, 100);
        var attr = pick(['资质','根骨','气感','魅力']);
        char.talent[attr] = clamp(char.talent[attr] + rand(1,5), 0, 100);
        render('✨ 奇遇！你找到了一株千年灵草，修为大增！', []);
        setTimeout(renderCultivation, 1000);
      } else {
        var loss = rand(5, 15);
        char.cultivationBase = clamp(char.cultivationBase - loss, 0, 100);
        char.age += 2;
        render('💀 你误入险地，受伤了，修为倒退。', []);
        setTimeout(renderCultivation, 1000);
      }
    }

    function cultivationBreakthrough() {
      var char = game.character;
      if (char.stage < 3) {
        char.stage++;
        char.cultivationBase = 0;
        render('🎉 你突破到' + REALMS[char.realm] + STAGES[char.stage] + '！', []);
        setTimeout(renderCultivation, 1000);
      } else if (char.realm < REALMS.length-1) {
        char.realm++;
        char.stage = 0;
        char.cultivationBase = 0;
        render('🌟 你成功突破到' + REALMS[char.realm] + '初期！', []);
        setTimeout(renderCultivation, 1000);
      } else {
        render('🏆 你已经达到神帝大圆满，三界无敌！', []);
        // 可触发结局
      }
    }

    function triggerCultivationEvent() {
      // 可扩展更多事件
    }

    // 7.3 魔法世界
    function startMagic() {
      game.world = 'magic';
      game.screen = 'magic';
      game.character = generateMagicChar();
      renderMagic();
    }

    function generateMagicChar() {
      var classType = pick(['mage','warrior','dual']);
      var elements = [];
      var weapon = null;
      if (classType === 'mage' || classType === 'dual') {
        var allEl = t('elements');
        var count = rand(1, Math.min(4, allEl.length));
        var pool = allEl.slice();
        for (var i=0; i<count && pool.length>0; i++) {
          var idx = rand(0, pool.length-1);
          elements.push(pool.splice(idx,1)[0]);
        }
      }
      if (classType === 'warrior' || classType === 'dual') {
        weapon = pick(t('weapons'));
      }
      return {
        class: classType,
        level: 1,
        exp: 0,
        elements: elements,
        weapon: weapon,
        strength: rand(5,20),
        agility: rand(5,20),
        intelligence: rand(5,20),
        vitality: rand(5,20),
        charm: rand(5,20),
        luck: rand(5,20)
      };
    }

    function renderMagic() {
      var char = game.character;
      var clsName = char.class === 'mage' ? t('classMage') : char.class === 'warrior' ? t('classWarrior') : t('classDual');
      var status = {
        '职业': clsName,
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

      var text = '🔮 魔法世界 · ' + clsName + '\\n\\n';
      text += '等级 ' + char.level + '，经验 ' + char.exp + '/' + (char.level * 10) + '\\n';
      text += '元素：' + (char.elements.length ? char.elements.join('、') : '无') + '\\n';
      text += '武器：' + (char.weapon || '无') + '\\n';

      var choices = [
        { label: '⚔️ 冒险（获得经验）', action: function() { magicAdventure(); } },
        { label: '📚 学习（提升技能）', action: function() { magicStudy(); } },
        { label: '🧙 探索（机缘）', action: function() { magicExplore(); } },
        { label: '💪 锻炼（提升属性）', action: function() { magicTrain(); } }
      ];
      render(text, choices);
    }

    function magicAdventure() {
      var char = game.character;
      var gain = rand(5, 15) + Math.floor(char.level/2);
      char.exp += gain;
      while (char.exp >= char.level * 10) {
        char.exp -= char.level * 10;
        char.level++;
        var attr = pick(['strength','agility','intelligence','vitality']);
        char[attr] += rand(1,3);
        render('🎉 你升级了！当前等级 ' + char.level, []);
        setTimeout(renderMagic, 800);
        return;
      }
      if (Math.random() < 0.15) triggerMagicEvent();
      renderMagic();
    }

    function magicStudy() {
      var char = game.character;
      var allEl = t('elements');
      if (char.elements.length < allEl.length && Math.random() < 0.3) {
        var available = allEl.filter(function(e) { return char.elements.indexOf(e) === -1; });
        if (available.length) {
          var newEl = pick(available);
          char.elements.push(newEl);
          render('📖 你领悟了新的元素：' + newEl, []);
          setTimeout(renderMagic, 800);
          return;
        }
      }
      char.intelligence += rand(1,3);
      render('📖 你刻苦学习，智力提升了。', []);
      setTimeout(renderMagic, 800);
    }

    function magicExplore() {
      var char = game.character;
      if (Math.random() < 0.3) {
        var gain = rand(10, 30);
        char.exp += gain;
        render('✨ 你发现了古代遗迹，获得大量经验！', []);
        setTimeout(renderMagic, 800);
      } else {
        var loss = rand(5, 15);
        char.exp = Math.max(0, char.exp - loss);
        render('💀 你遭遇了陷阱，损失了一些经验。', []);
        setTimeout(renderMagic, 800);
      }
    }

    function magicTrain() {
      var char = game.character;
      var attr = pick(['strength','agility','vitality']);
      char[attr] += rand(1,4);
      render('💪 你锻炼了' + attr + '，属性提升。', []);
      setTimeout(renderMagic, 800);
    }

    function triggerMagicEvent() {
      // 可扩展
    }

    // 7.4 结局
    function showEnding() {
      hideStatus();
      render('🌟 你的故事结束了...', []);
    }

    // ------------------------------------------------------------
    // 8. 界面切换与初始化
    // ------------------------------------------------------------
    function initGame() {
      game.screen = 'death';
      hideStatus();
      overlay.classList.add('hidden');
      showDeathScene();
    }

    // 语言切换
    langToggle.addEventListener('click', function() {
      lang = (lang === 'zh') ? 'en' : 'zh';
      langToggle.textContent = lang === 'zh' ? 'EN' : '中文';
      gameTitle.textContent = t('title');
      // 重新渲染当前场景
      if (game.screen === 'death') showDeathScene();
      else if (game.screen === 'worldSelect') showDeathScene(); // 实际只用在death
      else if (game.screen === 'cultivation') renderCultivation();
      else if (game.screen === 'magic') renderMagic();
      else if (game.screen === 'ending') showEnding();
    });

    // 开始按钮
    overlayBtn.addEventListener('click', function() {
      overlay.classList.add('hidden');
      initGame();
    });

    // 初始显示overlay
    overlay.classList.remove('hidden');
    overlayTitle.textContent = '🌱 轮回之门';
    overlayDesc.textContent = '你将在两个世界间穿梭，体验不同的命运。';

    // 暴露给外部（用于调试）
    window.game = game;

  })();
</script>
</body>
</html>`;

  // ------------------------------------------------------------
  // 9. 暴露 initGame 函数
  // ------------------------------------------------------------
  window.initGame = function initGame(wrapper) {
    if (!wrapper || typeof wrapper.replaceChildren !== 'function') {
      throw new Error('initGame requires a container element.');
    }
    var frame = document.createElement('iframe');
    frame.title = '轮回 · 双界';
    frame.setAttribute('allow', 'autoplay; fullscreen');
    frame.style.cssText = 'display:block;width:100%;height:620px;border:0;border-radius:16px;background:#0a0a0c;';
    frame.srcdoc = gameHTML;
    wrapper.replaceChildren(frame);
    return frame;
  };
})();
