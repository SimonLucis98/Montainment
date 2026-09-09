/* Reincarnation · Dual Worlds — Full Story Events & Realm Advancement */
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
    // ========================= 语言数据 =========================
    var LANG = {
      zh: {
        title: '🌌 轮回·双界',
        deathScene: '💀 你闭上了双眼，眼前一片漆黑，意识逐渐消散……\\n你，死了。',
        reincarnatePrompt: '⚡ 一道金光闪过，你获得了重生的机会！\\n选择你的新世界：',
        worldCultivation: '🧘 修仙世界',
        worldMagic: '🔮 魔法世界',
        worldNo: '🕊️ 不重生（生死有命）',
        noRebirthMsg: '你闭上双眼，眼前一片黑暗，你道别离开了。',
        backHome: '🏠 回到首页',
        realmNames: ['炼气','筑基','金丹','元婴','化神','炼虚','合体','大乘','渡劫','真仙','天仙','金仙','神帝'],
        stageNames: ['初期','中期','后期','大圆满'],
        classMage: '魔法师',
        classWarrior: '炼体师',
        classDual: '魔武双修',
        elements: ['雷','木','水','火','土','光','暗'],
        weapons: ['单手剑','双手剑','弓箭','短剑'],
        deathCultivation: '💀 你修炼走火入魔，修为尽毁，身死道消……',
        deathMagic: '💀 你冒险失败，被怪物击杀……',
        rebirthOption: '♻️ 重生（继承部分属性）',
        noRebirthOption: '🕊️ 不重生（离开轮回）',
        inheritInfo: '✨ 你带着前世 %d%% 的修为重生了！',
        continueBtn: '⏩ 继续',
        // 故事事件（中英双语）
        // 机缘事件
        storyFortune1: '✨ 你在深山偶遇一位隐世高人，他指点你修炼迷津，你顿悟大增！',
        storyFortune2: '🌿 你发现了一株千年灵芝，服下后修为暴涨，体质也得到改善。',
        storyFortune3: '📜 你捡到一本上古残卷，上面记载了失传的功法，你的资质得到升华。',
        storyFortune4: '🌸 你误入桃花源，得到了仙人的祝福，全属性小幅提升。',
        storyFortune5: '💎 你在一处古洞府中发现了极品灵石，吸收后修为大增。',
        // 危机事件
        storyCrisis1: '☠️ 你被一群妖兽围攻，虽侥幸逃脱但修为倒退，还受了重伤。',
        storyCrisis2: '🌊 渡河时遭遇暗流，你损失了一些灵药，悟性有所下降。',
        storyCrisis3: '🔥 洞府闭关时走火入魔，根骨受损，气感也减弱了。',
        storyCrisis4: '🌪️ 天降雷劫，你勉强抵挡，但机缘和魅力都受到了影响。',
        storyCrisis5: '💔 遭人暗算，经脉受损，资质和潜力都降低了。',
        // 普通历练故事
        storyTrain1: '⚔️ 你与同门切磋，虽然辛苦但修为有所提升。',
        storyTrain2: '🏹 你猎杀了一只灵兽，吸收了它的精元，修为增加。',
        storyTrain3: '📖 你诵读道经，心有所感，修为精进。',
        // 普通悟道故事
        storyInsight1: '🧘 你静坐参悟天地之理，悟性有所提高。',
        storyInsight2: '🌅 观日出，感天地之气，悟性增加。',
        storyInsight3: '🍃 听风吹竹叶，心有所悟，悟性提升。',
        // 突破信息
        breakthroughSmall: '🎉 你突破了%s%s，修为更上一层楼！',
        breakthroughBig: '🌟 你成功突破至%s初期！大道可期！',
        maxRealm: '🏆 你已达神帝大圆满，三界无敌，万古流芳！'
      },
      en: {
        title: '🌌 Reincarnation · Dual Worlds',
        deathScene: '💀 You close your eyes, darkness swallows you...\\nYou are dead.',
        reincarnatePrompt: '⚡ A golden light shines — you have a chance to be reborn!\\nChoose your new world:',
        worldCultivation: '🧘 Cultivation World',
        worldMagic: '🔮 Magic World',
        worldNo: '🕊️ Accept Death',
        noRebirthMsg: 'You close your eyes, darkness engulfs you, and you depart.',
        backHome: '🏠 Back to Home',
        realmNames: ['Qi Condensation','Foundation','Core','Nascent Soul','Spirit','Void','Integration','Mahayana','Tribulation','True Immortal','Heavenly Immortal','Golden Immortal','Divine Emperor'],
        stageNames: ['Early','Middle','Late','Peak'],
        classMage: 'Mage',
        classWarrior: 'Warrior',
        classDual: 'Dual Cultivator',
        elements: ['Thunder','Wood','Water','Fire','Earth','Light','Dark'],
        weapons: ['One-Handed Sword','Greatsword','Bow','Dagger'],
        deathCultivation: '💀 You went berserk while cultivating, your cultivation collapsed...',
        deathMagic: '💀 You failed your adventure, slain by a monster...',
        rebirthOption: '♻️ Rebirth (inherit part of stats)',
        noRebirthOption: '🕊️ Accept Death (leave the cycle)',
        inheritInfo: '✨ You reborn with %d%% of your previous cultivation!',
        continueBtn: '⏩ Continue',
        storyFortune1: '✨ You met a hermit sage who guided your cultivation, your enlightenment soared!',
        storyFortune2: '🌿 You found a millennium lingzhi, your cultivation and physique improved greatly.',
        storyFortune3: '📜 You discovered an ancient scroll with a lost art, your talent ascended.',
        storyFortune4: '🌸 You wandered into a peach blossom source, blessed by immortals, all stats slightly increased.',
        storyFortune5: '💎 You found a supreme spirit stone in an ancient cave, cultivation skyrocketed.',
        storyCrisis1: '☠️ Attacked by demon beasts, you barely escaped, cultivation regressed and you were injured.',
        storyCrisis2: '🌊 Crossing a river, you lost some elixirs, wisdom decreased.',
        storyCrisis3: '🔥 Suffered qi deviation during secluded cultivation, root bone and sense weakened.',
        storyCrisis4: '🌪️ A heavenly thunderbolt struck, you barely survived, fortune and charm affected.',
        storyCrisis5: '💔 Betrayed and ambushed, your meridians damaged, talent and potential reduced.',
        storyTrain1: '⚔️ You sparred with fellow disciples, cultivation increased despite the hard work.',
        storyTrain2: '🏹 You hunted a spirit beast and absorbed its essence, cultivation increased.',
        storyTrain3: '📖 You recited Taoist scriptures, gaining insight, cultivation improved.',
        storyInsight1: '🧘 You meditated on the principles of heaven and earth, wisdom increased.',
        storyInsight2: '🌅 Watched sunrise and felt the cosmic energy, wisdom increased.',
        storyInsight3: '🍃 Listened to wind through bamboo, wisdom increased.',
        breakthroughSmall: '🎉 You broke through to %s %s, your power grows!',
        breakthroughBig: '🌟 You successfully reached %s Early stage! The Dao is within reach!',
        maxRealm: '🏆 You have reached Divine Emperor Peak, unrivaled across the three realms!'
      }
    };

    var lang = 'zh';
    function t(key, p1, p2) {
      var str = LANG[lang][key] || key;
      if (p1 !== undefined) str = str.replace('%s', p1);
      if (p2 !== undefined) str = str.replace('%s', p2);
      return str;
    }

    // ========================= DOM =========================
    var storyText = document.getElementById('storyText');
    var choicesContainer = document.getElementById('choicesContainer');
    var statusArea = document.getElementById('statusArea');
    var overlay = document.getElementById('overlay');
    var overlayTitle = document.getElementById('overlayTitle');
    var overlayDesc = document.getElementById('overlayDesc');
    var overlayBtn = document.getElementById('overlayBtn');
    var langToggle = document.getElementById('langToggle');
    var gameTitle = document.getElementById('gameTitle');

    // ========================= 工具 =========================
    function rand(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
    function pick(arr) { return arr[rand(0, arr.length-1)]; }
    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

    // ========================= 游戏状态 =========================
    var game = {
      screen: 'death',
      world: null,
      character: null,
      turn: 0,
      maxTurns: 999,
      dead: false,
      inherited: 0,
      pendingEvent: false  // 是否正在展示事件
    };

    // ========================= 常量 =========================
    var REALMS = t('realmNames');
    var STAGES = t('stageNames');

    // ========================= 渲染引擎 =========================
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

    // ========================= 场景函数 =========================

    // ----- 死亡场景（初始） -----
    function showDeathScene() {
      hideStatus();
      game.screen = 'death';
      var msg = t('deathScene') + '\\n\\n' + t('reincarnatePrompt');
      render(msg, [
        { label: t('worldCultivation'), action: function() { startCultivation(); } },
        { label: t('worldMagic'), action: function() { startMagic(); } },
        { label: t('worldNo'), action: function() { noRebirth(); } }
      ]);
    }

    function noRebirth() {
      game.screen = 'ending';
      render(t('noRebirthMsg'), [
        { label: t('backHome'), action: function() { showDeathScene(); } }
      ]);
      hideStatus();
    }

    // ========================= 修仙世界（核心改进） =========================

    // 故事事件池（每次行动随机抽取）
    var cultivationStories = {
      fortune: function() {
        return pick([
          { text: t('storyFortune1'), effects: { 修为: rand(15,30), 悟性: rand(2,5), 资质: rand(1,3), 根骨: rand(1,3) } },
          { text: t('storyFortune2'), effects: { 修为: rand(20,40), 根骨: rand(2,4), 气感: rand(1,3) } },
          { text: t('storyFortune3'), effects: { 修为: rand(10,25), 资质: rand(2,5), 悟性: rand(1,3), 潜力: rand(1,3) } },
          { text: t('storyFortune4'), effects: { 修为: rand(10,20), 魅力: rand(2,4), 机缘: rand(1,3), 资质: rand(1,2) } },
          { text: t('storyFortune5'), effects: { 修为: rand(30,50), 气感: rand(2,4), 根骨: rand(1,2) } }
        ]);
      },
      crisis: function() {
        return pick([
          { text: t('storyCrisis1'), effects: { 修为: -rand(10,25), 根骨: -rand(1,3), 气感: -rand(1,2) } },
          { text: t('storyCrisis2'), effects: { 修为: -rand(5,15), 悟性: -rand(1,3), 机缘: -rand(1,2) } },
          { text: t('storyCrisis3'), effects: { 修为: -rand(10,20), 根骨: -rand(1,4), 气感: -rand(1,3) } },
          { text: t('storyCrisis4'), effects: { 修为: -rand(10,20), 魅力: -rand(1,3), 机缘: -rand(1,3) } },
          { text: t('storyCrisis5'), effects: { 修为: -rand(10,20), 资质: -rand(1,3), 潜力: -rand(1,3) } }
        ]);
      },
      train: function() {
        return pick([
          { text: t('storyTrain1'), effects: { 修为: rand(5,15) } },
          { text: t('storyTrain2'), effects: { 修为: rand(8,20) } },
          { text: t('storyTrain3'), effects: { 修为: rand(6,18) } }
        ]);
      },
      insight: function() {
        return pick([
          { text: t('storyInsight1'), effects: { 悟性: rand(2,5), 修为: rand(3,10) } },
          { text: t('storyInsight2'), effects: { 悟性: rand(3,6), 修为: rand(2,8) } },
          { text: t('storyInsight3'), effects: { 悟性: rand(2,4), 修为: rand(4,12) } }
        ]);
      }
    };

    // 应用效果到角色
    function applyEffects(char, effects) {
      if (!effects) return;
      if (effects.修为 !== undefined) char.cultivationBase = clamp(char.cultivationBase + effects.修为, 0, 100);
      if (effects.资质 !== undefined) char.talent.资质 = clamp(char.talent.资质 + effects.资质, 0, 100);
      if (effects.悟性 !== undefined) char.talent.悟性 = clamp(char.talent.悟性 + effects.悟性, 0, 100);
      if (effects.根骨 !== undefined) char.talent.根骨 = clamp(char.talent.根骨 + effects.根骨, 0, 100);
      if (effects.气感 !== undefined) char.talent.气感 = clamp(char.talent.气感 + effects.气感, 0, 100);
      if (effects.魅力 !== undefined) char.talent.魅力 = clamp(char.talent.魅力 + effects.魅力, 0, 100);
      if (effects.机缘 !== undefined) char.talent.机缘 = clamp(char.talent.机缘 + effects.机缘, 0, 100);
      if (effects.潜力 !== undefined) char.talent.潜力 = clamp(char.talent.潜力 + effects.潜力, 0, 100);
      // 灵根暂时不通过常规事件改变（可留作扩展）
    }

    // 显示事件并等待点击“继续”
    function showEventStory(story, callback) {
      game.pendingEvent = true;
      // 显示事件文本，并添加“继续”按钮
      var text = story.text;
      // 美化显示属性变化
      var changes = [];
      for (var key in story.effects) {
        var val = story.effects[key];
        if (val > 0) changes.push('<span class="good">+' + val + ' ' + key + '</span>');
        else if (val < 0) changes.push('<span class="bad">' + val + ' ' + key + '</span>');
      }
      if (changes.length) text += '\\n\\n属性变化: ' + changes.join(' ');
      render(text, [
        { label: t('continueBtn'), action: function() {
            game.pendingEvent = false;
            // 应用效果
            applyEffects(game.character, story.effects);
            // 检查修为归零死亡
            if (game.character.cultivationBase <= 0) {
              deathInCultivation();
              return;
            }
            // 检查突破条件
            checkBreakthrough();
            // 回到主界面
            renderCultivation();
          } 
        }
      ]);
    }

    // 检查突破
    function checkBreakthrough() {
      var char = game.character;
      // 如果修为达到100且当前是大圆满阶段
      if (char.cultivationBase >= 100) {
        if (char.stage === 3) {
          // 大圆满突破大境界
          if (char.realm < REALMS.length - 1) {
            char.realm++;
            char.stage = 0;
            char.cultivationBase = 0;
            // 显示突破信息
            var msg = t('breakthroughBig', REALMS[char.realm]);
            render(msg, []);
            // 短暂延迟后自动继续
            setTimeout(function() {
              if (!game.dead) renderCultivation();
            }, 1500);
            return true;
          } else {
            // 已达最高境界
            render(t('maxRealm'), []);
            return true;
          }
        } else {
          // 小境界突破
          char.stage++;
          char.cultivationBase = 0;
          var msg = t('breakthroughSmall', REALMS[char.realm], STAGES[char.stage]);
          render(msg, []);
          setTimeout(function() {
            if (!game.dead) renderCultivation();
          }, 1500);
          return true;
        }
      }
      return false;
    }

    // 启动修仙
    function startCultivation() {
      game.world = 'cultivation';
      game.screen = 'cultivation';
      game.character = generateCultivationChar();
      game.pendingEvent = false;
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
      if (game.inherited > 0) {
        var bonus = Math.floor(game.inherited * 100);
        talent.资质 = clamp(talent.资质 + bonus, 0, 100);
        talent.悟性 = clamp(talent.悟性 + bonus, 0, 100);
        // 继承部分修为（直接增加修为）
        // 这里我们在生成后手动加一点修为
        var initCult = Math.floor(game.inherited * 20);
        return {
          talent: talent,
          realm: 0,
          stage: 0,
          cultivationBase: clamp(initCult, 0, 100),
          age: 16,
          events: []
        };
      }
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
      if (game.screen === 'death' || game.pendingEvent) return;
      var char = game.character;
      var realmName = REALMS[char.realm] || '???';
      var stageName = STAGES[char.stage] || '';
      var status = {
        '境界': realmName + ' ' + stageName,
        '修为': char.cultivationBase + '/100',
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
      text += '你今年' + char.age + '岁。\\n';
      text += '修为进度：' + char.cultivationBase + '/100\\n';

      var choices = [
        { label: '⚔️ 历练', action: function() { actionTrain(); } },
        { label: '📖 悟道', action: function() { actionInsight(); } },
        { label: '🍀 机缘', action: function() { actionFortune(); } }
      ];
      // 只有当修为达到100且是大圆满时才显示突破按钮，但我们让系统自动突破，所以不显示额外按钮
      render(text, choices);
    }

    // 行动函数：历练
    function actionTrain() {
      if (game.pendingEvent) return;
      var char = game.character;
      // 随机选择普通训练事件（80%几率）或奇遇/危机（各10%）
      var roll = Math.random();
      var story;
      if (roll < 0.1) {
        // 奇遇
        story = cultivationStories.fortune();
      } else if (roll < 0.2) {
        // 危机
        story = cultivationStories.crisis();
      } else {
        // 普通历练
        story = cultivationStories.train();
      }
      char.age += rand(1,3);
      showEventStory(story, function() {
        // callback 在继续按钮中处理
      });
    }

    // 行动：悟道
    function actionInsight() {
      if (game.pendingEvent) return;
      var char = game.character;
      var roll = Math.random();
      var story;
      if (roll < 0.1) {
        story = cultivationStories.fortune();
      } else if (roll < 0.2) {
        story = cultivationStories.crisis();
      } else {
        story = cultivationStories.insight();
      }
      char.age += 1;
      showEventStory(story, function() {});
    }

    // 行动：机缘（原寻药）
    function actionFortune() {
      if (game.pendingEvent) return;
      var char = game.character;
      // 机缘行动有更高概率触发奇遇，但也有可能遇到危机
      var roll = Math.random();
      var story;
      if (roll < 0.4) {
        story = cultivationStories.fortune();
      } else if (roll < 0.6) {
        story = cultivationStories.crisis();
      } else {
        // 普通事件（也可能是一些小收获）
        story = { 
          text: '🍃 你在山间漫步，心旷神怡，修为略有精进。',
          effects: { 修为: rand(3,10) }
        };
      }
      char.age += rand(1,2);
      showEventStory(story, function() {});
    }

    // ----- 修仙死亡 -----
    function deathInCultivation() {
      game.screen = 'death';
      hideStatus();
      var msg = t('deathCultivation') + '\\n\\n' + t('reincarnatePrompt');
      var inheritRatio = 0.2;
      game.inherited = inheritRatio;
      render(msg, [
        { label: t('rebirthOption'), action: function() {
            game.inherited = inheritRatio;
            startCultivation();
          } 
        },
        { label: t('noRebirthOption'), action: function() {
            game.inherited = 0;
            noRebirth();
          } 
        }
      ]);
    }

    // ========================= 魔法世界（简化版，保持一致性） =========================
    function startMagic() {
      game.world = 'magic';
      game.screen = 'magic';
      game.character = generateMagicChar();
      game.pendingEvent = false;
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
      var baseExp = 0;
      if (game.inherited > 0) {
        baseExp = Math.floor(game.inherited * 50);
      }
      return {
        class: classType,
        level: 1,
        exp: baseExp,
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
      if (game.screen === 'death') return;
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
        { label: '⚔️ 冒险', action: function() { magicAdventure(); } },
        { label: '📚 学习', action: function() { magicStudy(); } },
        { label: '🧙 探索', action: function() { magicExplore(); } },
        { label: '💪 锻炼', action: function() { magicTrain(); } }
      ];
      render(text, choices);
    }

    function magicAdventure() {
      if (game.pendingEvent) return;
      var char = game.character;
      var gain = rand(5, 15) + Math.floor(char.level/2);
      char.exp += gain;
      // 升级处理
      while (char.exp >= char.level * 10) {
        char.exp -= char.level * 10;
        char.level++;
        var attr = pick(['strength','agility','intelligence','vitality']);
        char[attr] += rand(1,3);
        render('🎉 你升级了！当前等级 ' + char.level, []);
        setTimeout(renderMagic, 800);
        return;
      }
      // 随机事件
      if (Math.random() < 0.15) {
        if (Math.random() < 0.5) {
          // 奇遇
          var gain2 = rand(10, 30);
          char.exp += gain2;
          render('✨ 奇遇！你发现了宝藏，经验大增！', []);
          setTimeout(renderMagic, 800);
        } else {
          var loss = rand(5, 15);
          char.exp = Math.max(0, char.exp - loss);
          if (char.exp <= 0 && char.level <= 1) {
            deathInMagic();
            return;
          }
          render('💀 你遭遇了危险，损失了一些经验。', []);
          setTimeout(renderMagic, 800);
        }
        return;
      }
      renderMagic();
    }

    function magicStudy() {
      if (game.pendingEvent) return;
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
      if (game.pendingEvent) return;
      var char = game.character;
      if (Math.random() < 0.3) {
        var gain = rand(10, 30);
        char.exp += gain;
        render('✨ 你发现了古代遗迹，获得大量经验！', []);
        setTimeout(renderMagic, 800);
      } else {
        var loss = rand(5, 15);
        char.exp = Math.max(0, char.exp - loss);
        if (char.exp <= 0 && char.level <= 1) {
          deathInMagic();
          return;
        }
        render('💀 你遭遇了陷阱，损失了一些经验。', []);
        setTimeout(renderMagic, 800);
      }
    }

    function magicTrain() {
      if (game.pendingEvent) return;
      var char = game.character;
      var attr = pick(['strength','agility','vitality']);
      char[attr] += rand(1,4);
      render('💪 你锻炼了' + attr + '，属性提升。', []);
      setTimeout(renderMagic, 800);
    }

    function deathInMagic() {
      game.screen = 'death';
      hideStatus();
      var msg = t('deathMagic') + '\\n\\n' + t('reincarnatePrompt');
      var inheritRatio = 0.2;
      game.inherited = inheritRatio;
      render(msg, [
        { label: t('rebirthOption'), action: function() {
            game.inherited = inheritRatio;
            startMagic();
          } 
        },
        { label: t('noRebirthOption'), action: function() {
            game.inherited = 0;
            noRebirth();
          } 
        }
      ]);
    }

    // ========================= 界面切换与初始化 =========================
    function initGame() {
      game.screen = 'death';
      game.inherited = 0;
      game.pendingEvent = false;
      hideStatus();
      overlay.classList.add('hidden');
      showDeathScene();
    }

    langToggle.addEventListener('click', function() {
      lang = (lang === 'zh') ? 'en' : 'zh';
      langToggle.textContent = lang === 'zh' ? 'EN' : '中文';
      gameTitle.textContent = t('title');
      if (game.screen === 'death') showDeathScene();
      else if (game.screen === 'cultivation') renderCultivation();
      else if (game.screen === 'magic') renderMagic();
      else if (game.screen === 'ending') noRebirth();
    });

    overlayBtn.addEventListener('click', function() {
      overlay.classList.add('hidden');
      initGame();
    });

    overlay.classList.remove('hidden');
    overlayTitle.textContent = '🌱 轮回之门';
    overlayDesc.textContent = '你将在两个世界间穿梭，体验不同的命运。';

    window.game = game;
  })();
</script>
</body>
</html>`;

  // ========================= 暴露 initGame =========================
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
