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
      /* 确保内容不溢出 */
      overflow: hidden;
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
    .start-lang-btn {
      background: #2a2e3a;
      border: none;
      padding: 0.2rem 0.8rem;
      border-radius: 1rem;
      color: #c0d0e0;
      cursor: pointer;
      font-size: 0.7rem;
      font-weight: 700;
      transition: 0.2s;
      margin-bottom: 0.8rem;
    }
    .start-lang-btn:hover { background: #3a4a5a; }
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
      <button class="start-lang-btn" id="startLangToggle">EN</button>
      <br>
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
        inheritInfo: '✨ 你带着前世 %s%% 的修为重生了！',
        continueBtn: '⏩ 继续',
        // 修仙故事
        storyFortune1: '✨ 你在深山偶遇一位隐世高人，他指点你修炼迷津，你顿悟大增！',
        storyFortune2: '🌿 你发现了一株千年灵芝，服下后修为暴涨，体质也得到改善。',
        storyFortune3: '📜 你捡到一本上古残卷，上面记载了失传的功法，你的资质得到升华。',
        storyFortune4: '🌸 你误入桃花源，得到了仙人的祝福，全属性小幅提升。',
        storyFortune5: '💎 你在一处古洞府中发现了极品灵石，吸收后修为大增。',
        storyCrisis1: '☠️ 你被一群妖兽围攻，虽侥幸逃脱但修为倒退，还受了重伤。',
        storyCrisis2: '🌊 渡河时遭遇暗流，你损失了一些灵药，悟性有所下降。',
        storyCrisis3: '🔥 洞府闭关时走火入魔，根骨受损，气感也减弱了。',
        storyCrisis4: '🌪️ 天降雷劫，你勉强抵挡，但机缘和魅力都受到了影响。',
        storyCrisis5: '💔 遭人暗算，经脉受损，资质和潜力都降低了。',
        storyTrain1: '⚔️ 你与同门切磋，虽然辛苦但修为有所提升。',
        storyTrain2: '🏹 你猎杀了一只灵兽，吸收了它的精元，修为增加。',
        storyTrain3: '📖 你诵读道经，心有所感，修为精进。',
        storyInsight1: '🧘 你静坐参悟天地之理，悟性有所提高。',
        storyInsight2: '🌅 观日出，感天地之气，悟性增加。',
        storyInsight3: '🍃 听风吹竹叶，心有所悟，悟性提升。',
        breakthroughSmall: '🎉 你突破了%s%s，修为更上一层楼！',
        breakthroughBig: '🌟 你成功突破至%s初期！大道可期！',
        maxRealm: '🏆 你已达神帝大圆满，三界无敌，万古流芳！',
        // 属性名翻译
        attrRealm: '境界',
        attrCultivation: '修为',
        attrTalent: '资质',
        attrComprehension: '悟性',
        attrRoot: '根骨',
        attrSense: '气感',
        attrCharm: '魅力',
        attrFortune: '机缘',
        attrPotential: '潜力',
        attrLingGen: '灵根',
        attrLevel: '等级',
        attrExp: '经验',
        attrClass: '职业',
        attrElement: '元素',
        attrWeapon: '武器',
        attrStrength: '力量',
        attrAgility: '敏捷',
        attrIntelligence: '智力',
        attrVitality: '体质',
        attrLuck: '幸运',
        // 魔法故事
        storyMagicFortune1: '✨ 你在古墓中发现了一本魔法禁书，领悟了强大的咒语！',
        storyMagicFortune2: '🌿 精灵女王赐予你祝福，你的全属性都提升了。',
        storyMagicFortune3: '💎 你找到了传说级的魔晶，力量与智力大幅增加。',
        storyMagicFortune4: '🌟 流星雨之夜，你吸收了星辰之力，魅力与幸运大涨。',
        storyMagicFortune5: '⚡ 雷神遗迹中你继承了雷电之力，敏捷与体质增强。',
        storyMagicCrisis1: '☠️ 你被暗影刺客偷袭，重伤垂死，力量和体质下降。',
        storyMagicCrisis2: '🌊 魔法风暴摧毁了你的装备，你损失了大量经验。',
        storyMagicCrisis3: '🔥 你误入火元素领域，被灼伤，智力和魅力受损。',
        storyMagicCrisis4: '🌪️ 空间裂缝撕裂了你的魔法书，你失去了部分知识。',
        storyMagicCrisis5: '💔 被同伴背叛，你的幸运和敏捷大打折扣。',
        storyMagicAdventure1: '⚔️ 你击败了一群哥布林，获得了经验。',
        storyMagicAdventure2: '🏹 你猎杀了一头狮鹫，经验大涨。',
        storyMagicAdventure3: '📜 你完成了一个悬赏任务，获得了经验和名声。',
        storyMagicStudy1: '📚 你研读魔法典籍，智力提升了。',
        storyMagicStudy2: '🧠 你练习法术控制，敏捷和智力都增加了。',
        storyMagicStudy3: '🔮 你尝试新咒语，经验增加但体力消耗。',
        storyMagicExplore1: '🧭 你探索了一片未知森林，发现了遗迹。',
        storyMagicExplore2: '🗺️ 你找到了一张藏宝图，幸运提升。',
        storyMagicExplore3: '⚱️ 你发现了一个古老传送门，经验大增。',
        storyMagicTrain1: '💪 你进行力量训练，力量增加了。',
        storyMagicTrain2: '🏋️ 你锻炼体能，体质和敏捷都有提高。',
        storyMagicTrain3: '🧘 你练习冥想，智力和魅力略微提升。',
        levelUp: '🎉 你升级了！当前等级 %s！',
        commonEffect: '属性变化: ',
        btnAdventure: '冒险',
        btnStudy: '学习',
        btnExplore: '探索',
        btnTrain: '锻炼',
        btnStart: '开始'
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
        inheritInfo: '✨ You reborn with %s%% of your previous cultivation!',
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
        maxRealm: '🏆 You have reached Divine Emperor Peak, unrivaled across the three realms!',
        attrRealm: 'Realm',
        attrCultivation: 'Cultivation',
        attrTalent: 'Talent',
        attrComprehension: 'Comprehension',
        attrRoot: 'Root Bone',
        attrSense: 'Sense',
        attrCharm: 'Charm',
        attrFortune: 'Fortune',
        attrPotential: 'Potential',
        attrLingGen: 'Ling Gen',
        attrLevel: 'Level',
        attrExp: 'Exp',
        attrClass: 'Class',
        attrElement: 'Element',
        attrWeapon: 'Weapon',
        attrStrength: 'Strength',
        attrAgility: 'Agility',
        attrIntelligence: 'Intelligence',
        attrVitality: 'Vitality',
        attrLuck: 'Luck',
        storyMagicFortune1: '✨ You discovered a forbidden magic tome in an ancient tomb, mastering powerful spells!',
        storyMagicFortune2: '🌿 The Elf Queen blessed you, all stats increased.',
        storyMagicFortune3: '💎 You found a legendary magic crystal, Strength and Intelligence greatly increased.',
        storyMagicFortune4: '🌟 During a meteor shower, you absorbed stellar power, Charm and Luck boosted.',
        storyMagicFortune5: '⚡ In the Thunder God ruins, you inherited lightning power, Agility and Vitality enhanced.',
        storyMagicCrisis1: '☠️ Ambushed by a shadow assassin, you were gravely wounded, Strength and Vitality decreased.',
        storyMagicCrisis2: '🌊 A magic storm destroyed your equipment, you lost a lot of experience.',
        storyMagicCrisis3: '🔥 You wandered into a fire elemental domain, got burned, Intelligence and Charm damaged.',
        storyMagicCrisis4: '🌪️ A space rift tore your spellbook, you lost knowledge.',
        storyMagicCrisis5: '💔 Betrayed by a companion, your Luck and Agility suffered.',
        storyMagicAdventure1: '⚔️ You defeated a group of goblins, gained experience.',
        storyMagicAdventure2: '🏹 You hunted a griffin, experience soared.',
        storyMagicAdventure3: '📜 You completed a bounty quest, gained experience and fame.',
        storyMagicStudy1: '📚 You studied magic texts, Intelligence increased.',
        storyMagicStudy2: '🧠 You practiced spell control, Agility and Intelligence increased.',
        storyMagicStudy3: '🔮 You tried new incantations, experience increased but stamina consumed.',
        storyMagicExplore1: '🧭 You explored an unknown forest, discovered ruins.',
        storyMagicExplore2: '🗺️ You found a treasure map, Luck increased.',
        storyMagicExplore3: '⚱️ You discovered an ancient portal, experience greatly increased.',
        storyMagicTrain1: '💪 You trained strength, Strength increased.',
        storyMagicTrain2: '🏋️ You exercised, Vitality and Agility improved.',
        storyMagicTrain3: '🧘 You meditated, Intelligence and Charm slightly increased.',
        levelUp: '🎉 You leveled up! Current level %s!',
        commonEffect: 'Stat changes: ',
        btnAdventure: 'Adventure',
        btnStudy: 'Study',
        btnExplore: 'Explore',
        btnTrain: 'Train',
        btnStart: 'Start'
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
    var startLangToggle = document.getElementById('startLangToggle');
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
      pendingEvent: false
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

    // ========================= 修仙世界 =========================

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

    function applyCultivationEffects(char, effects) {
      if (!effects) return;
      if (effects.修为 !== undefined) char.cultivationBase = clamp(char.cultivationBase + effects.修为, 0, 100);
      if (effects.资质 !== undefined) char.talent.资质 = clamp(char.talent.资质 + effects.资质, 0, 100);
      if (effects.悟性 !== undefined) char.talent.悟性 = clamp(char.talent.悟性 + effects.悟性, 0, 100);
      if (effects.根骨 !== undefined) char.talent.根骨 = clamp(char.talent.根骨 + effects.根骨, 0, 100);
      if (effects.气感 !== undefined) char.talent.气感 = clamp(char.talent.气感 + effects.气感, 0, 100);
      if (effects.魅力 !== undefined) char.talent.魅力 = clamp(char.talent.魅力 + effects.魅力, 0, 100);
      if (effects.机缘 !== undefined) char.talent.机缘 = clamp(char.talent.机缘 + effects.机缘, 0, 100);
      if (effects.潜力 !== undefined) char.talent.潜力 = clamp(char.talent.潜力 + effects.潜力, 0, 100);
    }

    function showCultivationEvent(story) {
      game.pendingEvent = true;
      var text = story.text;
      var changes = [];
      for (var key in story.effects) {
        var val = story.effects[key];
        var attrName = key;
        if (val > 0) changes.push('<span class="good">+' + val + ' ' + attrName + '</span>');
        else if (val < 0) changes.push('<span class="bad">' + val + ' ' + attrName + '</span>');
      }
      if (changes.length) text += '\\n\\n' + t('commonEffect') + changes.join(' ');
      render(text, [
        { label: t('continueBtn'), action: function() {
            game.pendingEvent = false;
            applyCultivationEffects(game.character, story.effects);
            if (game.character.cultivationBase <= 0) {
              deathInCultivation();
              return;
            }
            checkCultivationBreakthrough();
            renderCultivation();
          } 
        }
      ]);
    }

    function checkCultivationBreakthrough() {
      var char = game.character;
      if (char.cultivationBase >= 100) {
        if (char.stage === 3) {
          if (char.realm < REALMS.length - 1) {
            char.realm++;
            char.stage = 0;
            char.cultivationBase = 0;
            var msg = t('breakthroughBig', REALMS[char.realm]);
            render(msg, []);
            setTimeout(function() {
              if (!game.dead) renderCultivation();
            }, 1500);
            return true;
          } else {
            render(t('maxRealm'), []);
            return true;
          }
        } else {
          char.stage++;
          char.cultivationBase = 0;
          var msg2 = t('breakthroughSmall', REALMS[char.realm], STAGES[char.stage]);
          render(msg2, []);
          setTimeout(function() {
            if (!game.dead) renderCultivation();
          }, 1500);
          return true;
        }
      }
      return false;
    }

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
        var initCult = Math.floor(game.inherited * 20);
        return {
          talent: talent,
          realm: 0,
          stage: 0,
          cultivationBase: clamp(initCult, 0, 100),
          age: 16
        };
      }
      return {
        talent: talent,
        realm: 0,
        stage: 0,
        cultivationBase: 0,
        age: 16
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
      var status = {};
      status[t('attrRealm')] = realmName + ' ' + stageName;
      status[t('attrCultivation')] = char.cultivationBase + '/100';
      status[t('attrTalent')] = char.talent.资质;
      status[t('attrComprehension')] = char.talent.悟性;
      status[t('attrRoot')] = char.talent.根骨;
      status[t('attrSense')] = char.talent.气感;
      status[t('attrCharm')] = char.talent.魅力;
      status[t('attrFortune')] = char.talent.机缘;
      status[t('attrPotential')] = char.talent.潜力;
      status[t('attrLingGen')] = char.talent.灵根.map(function(l){ return l.element + l.quality; }).join(', ');
      updateStatus(status);

      var text = '🧘 ' + t('worldCultivation') + ' · ' + realmName + ' ' + stageName + '\\n\\n';
      text += '你今年' + char.age + '岁。\\n';
      text += t('attrCultivation') + '：' + char.cultivationBase + '/100\\n';

      var choices = [
        { label: '⚔️ ' + t('attrTalent') + '（历练）', action: function() { actionTrain(); } },
        { label: '📖 ' + t('attrComprehension') + '（悟道）', action: function() { actionInsight(); } },
        { label: '🍀 ' + t('attrFortune') + '（机缘）', action: function() { actionFortune(); } }
      ];
      render(text, choices);
    }

    function actionTrain() {
      if (game.pendingEvent) return;
      var char = game.character;
      var roll = Math.random();
      var story;
      if (roll < 0.1) story = cultivationStories.fortune();
      else if (roll < 0.2) story = cultivationStories.crisis();
      else story = cultivationStories.train();
      char.age += rand(1,3);
      showCultivationEvent(story);
    }

    function actionInsight() {
      if (game.pendingEvent) return;
      var char = game.character;
      var roll = Math.random();
      var story;
      if (roll < 0.1) story = cultivationStories.fortune();
      else if (roll < 0.2) story = cultivationStories.crisis();
      else story = cultivationStories.insight();
      char.age += 1;
      showCultivationEvent(story);
    }

    function actionFortune() {
      if (game.pendingEvent) return;
      var char = game.character;
      var roll = Math.random();
      var story;
      if (roll < 0.4) story = cultivationStories.fortune();
      else if (roll < 0.6) story = cultivationStories.crisis();
      else story = { text: '🍃 你在山间漫步，心旷神怡，修为略有精进。', effects: { 修为: rand(3,10) } };
      char.age += rand(1,2);
      showCultivationEvent(story);
    }

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

    // ========================= 魔法世界 =========================

    var magicStories = {
      fortune: function() {
        return pick([
          { text: t('storyMagicFortune1'), effects: { 智力: rand(3,6), 力量: rand(2,4), 魅力: rand(1,3) } },
          { text: t('storyMagicFortune2'), effects: { 力量: rand(2,4), 敏捷: rand(2,4), 智力: rand(2,4), 体质: rand(2,4), 魅力: rand(2,4), 幸运: rand(2,4) } },
          { text: t('storyMagicFortune3'), effects: { 力量: rand(4,8), 智力: rand(4,8), 幸运: rand(1,3) } },
          { text: t('storyMagicFortune4'), effects: { 魅力: rand(5,9), 幸运: rand(4,7), 智力: rand(1,3) } },
          { text: t('storyMagicFortune5'), effects: { 敏捷: rand(4,7), 体质: rand(3,6), 幸运: rand(2,4) } }
        ]);
      },
      crisis: function() {
        return pick([
          { text: t('storyMagicCrisis1'), effects: { 力量: -rand(2,5), 体质: -rand(3,6), 魅力: -rand(1,3) } },
          { text: t('storyMagicCrisis2'), effects: { 经验: -rand(10,30), 智力: -rand(1,2) } },
          { text: t('storyMagicCrisis3'), effects: { 智力: -rand(2,5), 魅力: -rand(2,4), 力量: -rand(1,2) } },
          { text: t('storyMagicCrisis4'), effects: { 智力: -rand(3,6), 幸运: -rand(2,4) } },
          { text: t('storyMagicCrisis5'), effects: { 幸运: -rand(3,6), 敏捷: -rand(2,4), 魅力: -rand(1,2) } }
        ]);
      },
      adventure: function() {
        return pick([
          { text: t('storyMagicAdventure1'), effects: { 经验: rand(10,25), 力量: rand(1,2) } },
          { text: t('storyMagicAdventure2'), effects: { 经验: rand(20,40), 敏捷: rand(1,3) } },
          { text: t('storyMagicAdventure3'), effects: { 经验: rand(15,35), 魅力: rand(1,2) } }
        ]);
      },
      study: function() {
        return pick([
          { text: t('storyMagicStudy1'), effects: { 智力: rand(3,6), 经验: rand(5,15) } },
          { text: t('storyMagicStudy2'), effects: { 敏捷: rand(2,4), 智力: rand(2,4), 经验: rand(5,10) } },
          { text: t('storyMagicStudy3'), effects: { 经验: rand(15,30), 体质: -rand(1,3) } }
        ]);
      },
      explore: function() {
        return pick([
          { text: t('storyMagicExplore1'), effects: { 经验: rand(10,25), 幸运: rand(1,3) } },
          { text: t('storyMagicExplore2'), effects: { 幸运: rand(3,6), 经验: rand(5,15) } },
          { text: t('storyMagicExplore3'), effects: { 经验: rand(25,50), 智力: rand(1,2) } }
        ]);
      },
      train: function() {
        return pick([
          { text: t('storyMagicTrain1'), effects: { 力量: rand(3,6), 体质: rand(1,2) } },
          { text: t('storyMagicTrain2'), effects: { 体质: rand(3,5), 敏捷: rand(2,4) } },
          { text: t('storyMagicTrain3'), effects: { 智力: rand(2,4), 魅力: rand(1,3) } }
        ]);
      }
    };

    function applyMagicEffects(char, effects) {
      if (!effects) return;
      if (effects.力量 !== undefined) char.strength = clamp(char.strength + effects.力量, 0, 100);
      if (effects.敏捷 !== undefined) char.agility = clamp(char.agility + effects.敏捷, 0, 100);
      if (effects.智力 !== undefined) char.intelligence = clamp(char.intelligence + effects.智力, 0, 100);
      if (effects.体质 !== undefined) char.vitality = clamp(char.vitality + effects.体质, 0, 100);
      if (effects.魅力 !== undefined) char.charm = clamp(char.charm + effects.魅力, 0, 100);
      if (effects.幸运 !== undefined) char.luck = clamp(char.luck + effects.幸运, 0, 100);
      if (effects.经验 !== undefined) char.exp = Math.max(0, char.exp + effects.经验);
    }

    function showMagicEvent(story) {
      game.pendingEvent = true;
      var text = story.text;
      var changes = [];
      for (var key in story.effects) {
        var val = story.effects[key];
        var attrName = '';
        if (key === '经验') attrName = t('attrExp');
        else if (key === '力量') attrName = t('attrStrength');
        else if (key === '敏捷') attrName = t('attrAgility');
        else if (key === '智力') attrName = t('attrIntelligence');
        else if (key === '体质') attrName = t('attrVitality');
        else if (key === '魅力') attrName = t('attrCharm');
        else if (key === '幸运') attrName = t('attrLuck');
        else attrName = key;
        if (val > 0) changes.push('<span class="good">+' + val + ' ' + attrName + '</span>');
        else if (val < 0) changes.push('<span class="bad">' + val + ' ' + attrName + '</span>');
      }
      if (changes.length) text += '\\n\\n' + t('commonEffect') + changes.join(' ');
      render(text, [
        { label: t('continueBtn'), action: function() {
            game.pendingEvent = false;
            applyMagicEffects(game.character, story.effects);
            var char = game.character;
            var levelUpCount = 0;
            while (char.exp >= char.level * 10) {
              char.exp -= char.level * 10;
              char.level++;
              levelUpCount++;
              var attrUp = pick(['strength','agility','intelligence','vitality']);
              char[attrUp] += rand(1,3);
            }
            if (levelUpCount > 0) {
              showLevelUpMessage(char.level, levelUpCount);
              return;
            }
            if (char.exp <= 0 && char.level <= 1) {
              deathInMagic();
              return;
            }
            renderMagic();
          } 
        }
      ]);
    }

    function showLevelUpMessage(newLevel, count) {
      game.pendingEvent = true;
      var msg = t('levelUp', newLevel);
      if (count && count > 1) {
        msg += ' (↑' + count + '级)';
      }
      render(msg, [
        { label: t('continueBtn'), action: function() {
            game.pendingEvent = false;
            renderMagic();
          } 
        }
      ]);
    }

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
      if (game.screen === 'death' || game.pendingEvent) return;
      var char = game.character;
      var clsName = char.class === 'mage' ? t('classMage') : char.class === 'warrior' ? t('classWarrior') : t('classDual');
      var status = {};
      status[t('attrClass')] = clsName;
      status[t('attrLevel')] = char.level;
      status[t('attrExp')] = char.exp + '/' + (char.level * 10);
      status[t('attrElement')] = char.elements.length ? char.elements.join(', ') : '无';
      status[t('attrWeapon')] = char.weapon || '无';
      status[t('attrStrength')] = char.strength;
      status[t('attrAgility')] = char.agility;
      status[t('attrIntelligence')] = char.intelligence;
      status[t('attrVitality')] = char.vitality;
      status[t('attrCharm')] = char.charm;
      status[t('attrLuck')] = char.luck;
      updateStatus(status);

      var text = '🔮 ' + t('worldMagic') + ' · ' + clsName + '\\n\\n';
      text += t('attrLevel') + ' ' + char.level + '，' + t('attrExp') + ' ' + char.exp + '/' + (char.level * 10) + '\\n';
      text += t('attrElement') + '：' + (char.elements.length ? char.elements.join('、') : '无') + '\\n';
      text += t('attrWeapon') + '：' + (char.weapon || '无') + '\\n';

      var choices = [
        { label: '⚔️ ' + t('attrStrength') + '（' + t('btnAdventure') + '）', action: function() { magicAction('adventure'); } },
        { label: '📚 ' + t('attrIntelligence') + '（' + t('btnStudy') + '）', action: function() { magicAction('study'); } },
        { label: '🧙 ' + t('attrLuck') + '（' + t('btnExplore') + '）', action: function() { magicAction('explore'); } },
        { label: '💪 ' + t('attrVitality') + '（' + t('btnTrain') + '）', action: function() { magicAction('train'); } }
      ];
      render(text, choices);
    }

    function magicAction(type) {
      if (game.pendingEvent) return;
      var char = game.character;
      var roll = Math.random();
      var story;
      if (roll < 0.1) {
        story = magicStories.fortune();
      } else if (roll < 0.2) {
        story = magicStories.crisis();
      } else {
        if (type === 'adventure') story = magicStories.adventure();
        else if (type === 'study') story = magicStories.study();
        else if (type === 'explore') story = magicStories.explore();
        else if (type === 'train') story = magicStories.train();
        else story = magicStories.adventure();
      }
      showMagicEvent(story);
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

    function switchLanguage() {
      lang = (lang === 'zh') ? 'en' : 'zh';
      var label = lang === 'zh' ? 'EN' : '中文';
      langToggle.textContent = label;
      startLangToggle.textContent = label;
      gameTitle.textContent = t('title');
      overlayTitle.textContent = lang === 'zh' ? '🌱 轮回之门' : '🌱 Reincarnation Gate';
      overlayDesc.textContent = lang === 'zh' ? '你将在两个世界间穿梭，体验不同的命运。' : 'You will travel between two worlds, experiencing different fates.';
      // 更新开始按钮
      overlayBtn.textContent = t('btnStart');
      // 重新渲染当前场景
      if (game.screen === 'death') showDeathScene();
      else if (game.screen === 'cultivation') renderCultivation();
      else if (game.screen === 'magic') renderMagic();
      else if (game.screen === 'ending') noRebirth();
    }

    langToggle.addEventListener('click', switchLanguage);
    startLangToggle.addEventListener('click', switchLanguage);

    overlayBtn.addEventListener('click', function() {
      overlay.classList.add('hidden');
      initGame();
    });

    // 初始显示overlay
    overlay.classList.remove('hidden');
    overlayTitle.textContent = '🌱 轮回之门';
    overlayDesc.textContent = '你将在两个世界间穿梭，体验不同的命运。';
    overlayBtn.textContent = t('btnStart');
    langToggle.textContent = 'EN';
    startLangToggle.textContent = 'EN';

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
    // 调整 iframe 样式：高度100%，无滚动条，最小高度600px
    frame.style.cssText = 'display:block;width:100%;height:100%;min-height:620px;border:0;border-radius:16px;background:#0a0a0c;overflow:hidden;';
    frame.srcdoc = gameHTML;
    wrapper.replaceChildren(frame);
    return frame;
  };
})();
