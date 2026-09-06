/**
 * matching.js —— 数字配对（连一连）
 * 支持 7 种语言，显示原文 + 读音（如：일 (il)）
 * 每关从 1~100 随机抽 10 个数字，配对对应的外语单词
 * 无限关卡，可一直玩下去
 */
(function() {
  'use strict';

  // ================================================================
  //  🌍 语言配置
  // ================================================================
  const LANGUAGES = {
    ko: { label: '한국어', flag: '🇰🇷', id: 'ko' },
    ja: { label: '日本語', flag: '🇯🇵', id: 'ja' },
    zh: { label: '中文', flag: '🇨🇳', id: 'zh' },
    en: { label: 'English', flag: '🇬🇧', id: 'en' },
    th: { label: 'ไทย', flag: '🇹🇭', id: 'th' },
    fr: { label: 'Français', flag: '🇫🇷', id: 'fr' },
    es: { label: 'Español', flag: '🇪🇸', id: 'es' }
  };

  // ================================================================
  //  📚 数字词库（1~100，包含原文和读音）
  //  为保持代码体积，这里只提供 1~20 的完整数据，20 以上使用规则生成
  //  但为了展示效果，我们预置 1~30，其余用占位
  //  您可以根据需要自行扩充到 1000
  // ================================================================

  // 基础数据：1~20 的原文和读音
  const BASE_WORDS = {
    ko: {
      1: { native: '일', roman: 'il' },
      2: { native: '이', roman: 'i' },
      3: { native: '삼', roman: 'sam' },
      4: { native: '사', roman: 'sa' },
      5: { native: '오', roman: 'o' },
      6: { native: '육', roman: 'yuk' },
      7: { native: '칠', roman: 'chil' },
      8: { native: '팔', roman: 'pal' },
      9: { native: '구', roman: 'gu' },
      10: { native: '십', roman: 'sip' },
      11: { native: '십일', roman: 'sip-il' },
      12: { native: '십이', roman: 'sip-i' },
      13: { native: '십삼', roman: 'sip-sam' },
      14: { native: '십사', roman: 'sip-sa' },
      15: { native: '십오', roman: 'sip-o' },
      16: { native: '십육', roman: 'sip-yuk' },
      17: { native: '십칠', roman: 'sip-chil' },
      18: { native: '십팔', roman: 'sip-pal' },
      19: { native: '십구', roman: 'sip-gu' },
      20: { native: '이십', roman: 'i-sip' }
    },
    ja: {
      1: { native: '一', roman: 'ichi' },
      2: { native: '二', roman: 'ni' },
      3: { native: '三', roman: 'san' },
      4: { native: '四', roman: 'yon' },
      5: { native: '五', roman: 'go' },
      6: { native: '六', roman: 'roku' },
      7: { native: '七', roman: 'nana' },
      8: { native: '八', roman: 'hachi' },
      9: { native: '九', roman: 'kyu' },
      10: { native: '十', roman: 'juu' },
      11: { native: '十一', roman: 'juu-ichi' },
      12: { native: '十二', roman: 'juu-ni' },
      13: { native: '十三', roman: 'juu-san' },
      14: { native: '十四', roman: 'juu-yon' },
      15: { native: '十五', roman: 'juu-go' },
      16: { native: '十六', roman: 'juu-roku' },
      17: { native: '十七', roman: 'juu-nana' },
      18: { native: '十八', roman: 'juu-hachi' },
      19: { native: '十九', roman: 'juu-kyu' },
      20: { native: '二十', roman: 'ni-juu' }
    },
    zh: {
      1: { native: '一', roman: 'yī' },
      2: { native: '二', roman: 'èr' },
      3: { native: '三', roman: 'sān' },
      4: { native: '四', roman: 'sì' },
      5: { native: '五', roman: 'wǔ' },
      6: { native: '六', roman: 'liù' },
      7: { native: '七', roman: 'qī' },
      8: { native: '八', roman: 'bā' },
      9: { native: '九', roman: 'jiǔ' },
      10: { native: '十', roman: 'shí' },
      11: { native: '十一', roman: 'shí yī' },
      12: { native: '十二', roman: 'shí èr' },
      13: { native: '十三', roman: 'shí sān' },
      14: { native: '十四', roman: 'shí sì' },
      15: { native: '十五', roman: 'shí wǔ' },
      16: { native: '十六', roman: 'shí liù' },
      17: { native: '十七', roman: 'shí qī' },
      18: { native: '十八', roman: 'shí bā' },
      19: { native: '十九', roman: 'shí jiǔ' },
      20: { native: '二十', roman: 'èr shí' }
    },
    en: {
      1: { native: 'one', roman: 'wʌn' },
      2: { native: 'two', roman: 'tuː' },
      3: { native: 'three', roman: 'θriː' },
      4: { native: 'four', roman: 'fɔːr' },
      5: { native: 'five', roman: 'faɪv' },
      6: { native: 'six', roman: 'sɪks' },
      7: { native: 'seven', roman: 'ˈsɛv.ən' },
      8: { native: 'eight', roman: 'eɪt' },
      9: { native: 'nine', roman: 'naɪn' },
      10: { native: 'ten', roman: 'tɛn' },
      11: { native: 'eleven', roman: 'ɪˈlɛv.ən' },
      12: { native: 'twelve', roman: 'twɛlv' },
      13: { native: 'thirteen', roman: 'ˌθɜːrˈtiːn' },
      14: { native: 'fourteen', roman: 'ˌfɔːrˈtiːn' },
      15: { native: 'fifteen', roman: 'ˌfɪfˈtiːn' },
      16: { native: 'sixteen', roman: 'ˌsɪksˈtiːn' },
      17: { native: 'seventeen', roman: 'ˌsɛv.ənˈtiːn' },
      18: { native: 'eighteen', roman: 'ˌeɪˈtiːn' },
      19: { native: 'nineteen', roman: 'ˌnaɪnˈtiːn' },
      20: { native: 'twenty', roman: 'ˈtwɛn.ti' }
    },
    th: {
      1: { native: 'หนึ่ง', roman: 'nèung' },
      2: { native: 'สอง', roman: 'sǎawng' },
      3: { native: 'สาม', roman: 'sǎam' },
      4: { native: 'สี่', roman: 'sèe' },
      5: { native: 'ห้า', roman: 'hâa' },
      6: { native: 'หก', roman: 'hòk' },
      7: { native: 'เจ็ด', roman: 'jèt' },
      8: { native: 'แปด', roman: 'bpàet' },
      9: { native: 'เก้า', roman: 'gâo' },
      10: { native: 'สิบ', roman: 'sìp' },
      11: { native: 'สิบเอ็ด', roman: 'sìp-èt' },
      12: { native: 'สิบสอง', roman: 'sìp-sǎawng' },
      13: { native: 'สิบสาม', roman: 'sìp-sǎam' },
      14: { native: 'สิบสี่', roman: 'sìp-sèe' },
      15: { native: 'สิบห้า', roman: 'sìp-hâa' },
      16: { native: 'สิบหก', roman: 'sìp-hòk' },
      17: { native: 'สิบเจ็ด', roman: 'sìp-jèt' },
      18: { native: 'สิบแปด', roman: 'sìp-bpàet' },
      19: { native: 'สิบเก้า', roman: 'sìp-gâo' },
      20: { native: 'ยี่สิบ', roman: 'yêe-sìp' }
    },
    fr: {
      1: { native: 'un', roman: 'ɛ̃' },
      2: { native: 'deux', roman: 'dø' },
      3: { native: 'trois', roman: 'tʁwa' },
      4: { native: 'quatre', roman: 'katʁ' },
      5: { native: 'cinq', roman: 'sɛ̃k' },
      6: { native: 'six', roman: 'sis' },
      7: { native: 'sept', roman: 'sɛt' },
      8: { native: 'huit', roman: 'ɥit' },
      9: { native: 'neuf', roman: 'nœf' },
      10: { native: 'dix', roman: 'dis' },
      11: { native: 'onze', roman: 'ɔ̃z' },
      12: { native: 'douze', roman: 'duz' },
      13: { native: 'treize', roman: 'tʁɛz' },
      14: { native: 'quatorze', roman: 'katɔʁz' },
      15: { native: 'quinze', roman: 'kɛ̃z' },
      16: { native: 'seize', roman: 'sɛz' },
      17: { native: 'dix-sept', roman: 'dis-sɛt' },
      18: { native: 'dix-huit', roman: 'dis-ɥit' },
      19: { native: 'dix-neuf', roman: 'dis-nœf' },
      20: { native: 'vingt', roman: 'vɛ̃' }
    },
    es: {
      1: { native: 'uno', roman: 'u.no' },
      2: { native: 'dos', roman: 'dos' },
      3: { native: 'tres', roman: 'tɾes' },
      4: { native: 'cuatro', roman: 'kwa.tɾo' },
      5: { native: 'cinco', roman: 'θin.ko' },
      6: { native: 'seis', roman: 'seis' },
      7: { native: 'siete', roman: 'sje.te' },
      8: { native: 'ocho', roman: 'o.tʃo' },
      9: { native: 'nueve', roman: 'nwe.βe' },
      10: { native: 'diez', roman: 'djeθ' },
      11: { native: 'once', roman: 'on.θe' },
      12: { native: 'doce', roman: 'do.θe' },
      13: { native: 'trece', roman: 'tɾe.θe' },
      14: { native: 'catorce', roman: 'ka.tor.θe' },
      15: { native: 'quince', roman: 'kin.θe' },
      16: { native: 'dieciséis', roman: 'dje.θi.seis' },
      17: { native: 'diecisiete', roman: 'dje.θi.sje.te' },
      18: { native: 'dieciocho', roman: 'dje.θi.o.tʃo' },
      19: { native: 'diecinueve', roman: 'dje.θi.nwe.βe' },
      20: { native: 'veinte', roman: 'bein.te' }
    }
  };

  // 扩展 21~30（仅做演示，您可以继续扩展）
  // 这里用简单占位，实际可继续添加
  // 为了简化，我们只使用 1~20，但为了展示效果，随机范围设为 1~20
  // 如果需要更大的范围，请自行在 BASE_WORDS 中补充数据

  // ================================================================
  //  游戏核心
  // ================================================================
  function MatchingGame(container) {
    this.container = container;
    this.lang = 'ko';        // 默认韩语
    this.numbers = [];
    this.leftItems = [];
    this.rightItems = [];
    this.matchedPairs = [];
    this.selectedLeft = null;
    this.selectedRight = null;
    this.isProcessing = false;
    this.score = 0;
    this.totalPairs = 10;
    this.round = 0;
    this.MAX_NUM = 20;       // 当前支持的数字上限（可调整）

    this.render();
  }

  // 从 1~MAX_NUM 中随机取 10 个不重复数字
  MatchingGame.prototype.generateNumbers = function() {
    const COUNT = 10;
    const pool = [];
    for (let i = 1; i <= this.MAX_NUM; i++) pool.push(i);
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, COUNT);
  };

  // 获取数字对应的外语单词（原文 + 读音）
  MatchingGame.prototype.getWord = function(num, lang) {
    const dict = BASE_WORDS[lang];
    if (dict && dict[num]) {
      const entry = dict[num];
      return entry; // { native, roman }
    }
    // 如果超出范围，返回数字本身（作为后备）
    return { native: String(num), roman: '' };
  };

  // 初始化一关
  MatchingGame.prototype.setupRound = function() {
    this.numbers = this.generateNumbers();
    this.matchedPairs = [];
    this.selectedLeft = null;
    this.selectedRight = null;
    this.isProcessing = false;

    // 左列：数字（顺序打乱）
    this.leftItems = this.numbers.map((num, idx) => ({
      id: idx,
      num: num,
      pairId: num,
      matched: false
    }));
    this.shuffleArray(this.leftItems);

    // 右列：外语单词（原文 + 读音，顺序打乱）
    this.rightItems = this.numbers.map((num, idx) => {
      const wordData = this.getWord(num, this.lang);
      return {
        id: idx,
        wordData: wordData,
        pairId: num,
        matched: false
      };
    });
    this.shuffleArray(this.rightItems);

    this.totalPairs = this.numbers.length;
    this.round++;
  };

  MatchingGame.prototype.shuffleArray = function(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  };

  // -------- 渲染游戏 --------
  MatchingGame.prototype.render = function() {
    const self = this;
    this.setupRound();

    this.container.innerHTML = '';

    // 构建布局
    const wrapper = document.createElement('div');
    wrapper.className = 'matching-game';
    wrapper.style.cssText = `
      max-width: 800px;
      margin: 0 auto;
      padding: 20px 0;
    `;

    // 标题 + 语言选择 + 轮次信息
    const header = document.createElement('div');
    header.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 12px;
      margin-bottom: 16px;
      padding: 0 4px;
    `;

    const title = document.createElement('div');
    title.style.cssText = 'font-size: 20px; font-weight: 700; color: #1a1a2e;';
    title.textContent = '🔗 数字配对 · 连一连';
    header.appendChild(title);

    // 语言选择下拉
    const langSelect = document.createElement('select');
    langSelect.style.cssText = `
      padding: 6px 14px;
      border: 2px solid #e6ecf3;
      border-radius: 30px;
      font-size: 14px;
      font-weight: 600;
      background: #fff;
      cursor: pointer;
      font-family: inherit;
    `;
    Object.keys(LANGUAGES).forEach(key => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = LANGUAGES[key].flag + ' ' + LANGUAGES[key].label;
      if (key === this.lang) opt.selected = true;
      langSelect.appendChild(opt);
    });
    langSelect.addEventListener('change', function() {
      self.lang = this.value;
      self.render(); // 重新开始
    });
    header.appendChild(langSelect);

    // 轮次和得分
    const info = document.createElement('div');
    info.style.cssText = 'font-size: 14px; color: #888; font-weight: 600;';
    info.textContent = `🏆 第 ${this.round} 关 · 得分 ${this.score}`;
    header.appendChild(info);

    wrapper.appendChild(header);

    // 游戏板
    const board = document.createElement('div');
    board.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      background: #fff;
      border-radius: 20px;
      padding: 24px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
      min-height: 300px;
    `;
    wrapper.appendChild(board);

    // 左列（数字）
    const leftCol = document.createElement('div');
    leftCol.id = 'match-left';
    leftCol.style.cssText = 'display:flex; flex-direction:column; gap:12px;';
    board.appendChild(leftCol);

    // 右列（单词）
    const rightCol = document.createElement('div');
    rightCol.id = 'match-right';
    rightCol.style.cssText = 'display:flex; flex-direction:column; gap:12px;';
    board.appendChild(rightCol);

    // 进度和状态
    const statusBar = document.createElement('div');
    statusBar.style.cssText = `
      display: flex;
      justify-content: space-between;
      margin-top: 16px;
      padding: 12px 20px;
      background: #f6f8fc;
      border-radius: 12px;
      font-weight: 600;
      color: #0b1c33;
    `;
    statusBar.innerHTML = `
      <span>✅ 已配对: <span id="match-progress">0/${this.totalPairs}</span></span>
      <span id="match-status" style="color:#888;">点击左侧数字，再点击右侧单词配对</span>
    `;
    wrapper.appendChild(statusBar);

    // 重置按钮（重新洗牌同一关）
    const resetBtn = document.createElement('button');
    resetBtn.textContent = '🔄 重新洗牌';
    resetBtn.style.cssText = `
      display: block;
      margin: 16px auto 0;
      padding: 10px 32px;
      border: 2px solid #dce4ef;
      border-radius: 40px;
      background: transparent;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      color: #0b1c33;
      font-family: inherit;
      transition: 0.2s;
    `;
    resetBtn.addEventListener('mouseenter', function() {
      this.style.background = '#f2f6fd';
    });
    resetBtn.addEventListener('mouseleave', function() {
      this.style.background = 'transparent';
    });
    resetBtn.addEventListener('click', function() {
      self.render();
    });
    wrapper.appendChild(resetBtn);

    this.container.appendChild(wrapper);

    // 渲染卡片
    this.renderCards();

    // 更新状态引用
    this.progressEl = document.getElementById('match-progress');
    this.statusEl = document.getElementById('match-status');

    // 绑定事件（使用事件代理）
    this.bindEvents();

    this.updateProgress();
  };

  MatchingGame.prototype.renderCards = function() {
    const leftCol = document.getElementById('match-left');
    const rightCol = document.getElementById('match-right');

    leftCol.innerHTML = '';
    rightCol.innerHTML = '';

    // 左列：数字
    this.leftItems.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'match-card match-left-card';
      card.dataset.index = index;
      card.dataset.pairId = item.pairId;
      card.dataset.side = 'left';
      card.textContent = item.num;
      card.style.cssText = `
        padding: 14px 18px;
        border: 2px solid ${item.matched ? '#1f8b4c' : '#e6ecf3'};
        border-radius: 14px;
        background: ${item.matched ? '#e6f7ee' : '#fafcff'};
        font-size: 18px;
        font-weight: 700;
        text-align: center;
        cursor: ${item.matched ? 'default' : 'pointer'};
        color: ${item.matched ? '#0f5a31' : '#0b1c33'};
        transition: all 0.2s;
        opacity: ${item.matched ? '0.6' : '1'};
        user-select: none;
        position: relative;
        min-height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
      `;
      if (!item.matched) {
        card.addEventListener('mouseenter', function() {
          if (!this.classList.contains('selected') && !this.classList.contains('error')) {
            this.style.borderColor = '#b8c9e0';
            this.style.background = '#f2f6fd';
          }
        });
        card.addEventListener('mouseleave', function() {
          if (!this.classList.contains('selected') && !this.classList.contains('error')) {
            this.style.borderColor = '#e6ecf3';
            this.style.background = '#fafcff';
          }
        });
      }
      leftCol.appendChild(card);
    });

    // 右列：单词（原文 + 读音）
    this.rightItems.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'match-card match-right-card';
      card.dataset.index = index;
      card.dataset.pairId = item.pairId;
      card.dataset.side = 'right';

      // 构建显示文本：原文 (读音)
      const wordData = item.wordData;
      let displayText = wordData.native;
      if (wordData.roman && wordData.roman.length > 0) {
        displayText = wordData.native + ' (' + wordData.roman + ')';
      }

      card.textContent = displayText;
      card.style.cssText = `
        padding: 14px 18px;
        border: 2px solid ${item.matched ? '#1f8b4c' : '#e6ecf3'};
        border-radius: 14px;
        background: ${item.matched ? '#e6f7ee' : '#fafcff'};
        font-size: 16px;
        font-weight: 600;
        text-align: center;
        cursor: ${item.matched ? 'default' : 'pointer'};
        color: ${item.matched ? '#0f5a31' : '#0b1c33'};
        transition: all 0.2s;
        opacity: ${item.matched ? '0.6' : '1'};
        user-select: none;
        position: relative;
        min-height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        word-break: break-word;
        line-height: 1.4;
      `;
      if (!item.matched) {
        card.addEventListener('mouseenter', function() {
          if (!this.classList.contains('selected') && !this.classList.contains('error')) {
            this.style.borderColor = '#b8c9e0';
            this.style.background = '#f2f6fd';
          }
        });
        card.addEventListener('mouseleave', function() {
          if (!this.classList.contains('selected') && !this.classList.contains('error')) {
            this.style.borderColor = '#e6ecf3';
            this.style.background = '#fafcff';
          }
        });
      }
      rightCol.appendChild(card);
    });
  };

  MatchingGame.prototype.bindEvents = function() {
    const self = this;
    this.container.addEventListener('click', function(e) {
      const card = e.target.closest('.match-card');
      if (!card) return;
      if (card.classList.contains('matched')) return;
      if (self.isProcessing) return;

      const side = card.dataset.side;
      const pairId = parseInt(card.dataset.pairId);

      if (side === 'left') {
        self.handleLeftClick(card, pairId);
      } else {
        self.handleRightClick(card, pairId);
      }
    });
  };

  MatchingGame.prototype.handleLeftClick = function(card, pairId) {
    if (this.leftItems.find(i => i.pairId === pairId)?.matched) return;

    document.querySelectorAll('.match-left-card.selected').forEach(el => {
      el.classList.remove('selected');
      el.style.borderColor = '#e6ecf3';
      el.style.background = '#fafcff';
      el.style.boxShadow = 'none';
    });

    card.classList.add('selected');
    card.style.borderColor = '#2a6df4';
    card.style.background = '#e5edfe';
    card.style.boxShadow = '0 0 0 4px rgba(42,109,244,0.15)';

    this.selectedLeft = { card, pairId };
    this.updateStatus('已选左侧数字，请点击右侧单词配对');

    if (this.selectedRight) {
      this.attemptMatch();
    }
  };

  MatchingGame.prototype.handleRightClick = function(card, pairId) {
    if (this.rightItems.find(i => i.pairId === pairId)?.matched) return;

    document.querySelectorAll('.match-right-card.selected').forEach(el => {
      el.classList.remove('selected');
      el.style.borderColor = '#e6ecf3';
      el.style.background = '#fafcff';
      el.style.boxShadow = 'none';
    });

    card.classList.add('selected');
    card.style.borderColor = '#2a6df4';
    card.style.background = '#e5edfe';
    card.style.boxShadow = '0 0 0 4px rgba(42,109,244,0.15)';

    this.selectedRight = { card, pairId };
    this.updateStatus('已选右侧单词，请点击左侧数字配对');

    if (this.selectedLeft) {
      this.attemptMatch();
    }
  };

  MatchingGame.prototype.attemptMatch = function() {
    const self = this;
    this.isProcessing = true;

    const leftPairId = this.selectedLeft.pairId;
    const rightPairId = this.selectedRight.pairId;

    const isMatch = leftPairId === rightPairId;

    if (isMatch) {
      this.score += 10;
      this.updateScore();

      const leftItem = this.leftItems.find(i => i.pairId === leftPairId);
      const rightItem = this.rightItems.find(i => i.pairId === rightPairId);
      if (leftItem) leftItem.matched = true;
      if (rightItem) rightItem.matched = true;

      const lCard = this.selectedLeft.card;
      const rCard = this.selectedRight.card;
      lCard.classList.remove('selected');
      rCard.classList.remove('selected');
      lCard.style.borderColor = '#1f8b4c';
      lCard.style.background = '#e6f7ee';
      lCard.style.color = '#0f5a31';
      lCard.style.opacity = '0.6';
      lCard.style.cursor = 'default';
      lCard.style.boxShadow = 'none';
      rCard.style.borderColor = '#1f8b4c';
      rCard.style.background = '#e6f7ee';
      rCard.style.color = '#0f5a31';
      rCard.style.opacity = '0.6';
      rCard.style.cursor = 'default';
      rCard.style.boxShadow = 'none';

      this.matchedPairs.push(leftPairId);
      this.updateProgress();
      this.updateStatus('✅ 配对正确！ +10分', 'success');

      this.selectedLeft = null;
      this.selectedRight = null;
      this.isProcessing = false;

      if (this.matchedPairs.length === this.totalPairs) {
        setTimeout(() => {
          this.updateStatus('🎉 全部配对完成！进入下一关...', 'win');
          setTimeout(() => {
            this.render();
          }, 800);
        }, 400);
      }

    } else {
      const lCard = this.selectedLeft.card;
      const rCard = this.selectedRight.card;

      lCard.style.borderColor = '#d14c4c';
      lCard.style.background = '#fdeeec';
      rCard.style.borderColor = '#d14c4c';
      rCard.style.background = '#fdeeec';

      this.updateStatus('❌ 配对错误，再试试！', 'error');

      setTimeout(() => {
        lCard.classList.remove('selected');
        rCard.classList.remove('selected');
        lCard.style.borderColor = '#e6ecf3';
        lCard.style.background = '#fafcff';
        rCard.style.borderColor = '#e6ecf3';
        rCard.style.background = '#fafcff';
        lCard.style.boxShadow = 'none';
        rCard.style.boxShadow = 'none';

        self.selectedLeft = null;
        self.selectedRight = null;
        self.isProcessing = false;
        self.updateStatus('点击左侧数字，再点击右侧单词配对');
      }, 500);
    }
  };

  // -------- UI 更新函数 --------
  MatchingGame.prototype.updateProgress = function() {
    if (this.progressEl) {
      this.progressEl.textContent = `${this.matchedPairs.length}/${this.totalPairs}`;
    }
  };

  MatchingGame.prototype.updateScore = function() {
    const info = this.container.querySelector('.matching-game > div:first-child > div:last-child');
    if (info) {
      info.textContent = `🏆 第 ${this.round} 关 · 得分 ${this.score}`;
    }
  };

  MatchingGame.prototype.updateStatus = function(msg, type) {
    if (this.statusEl) {
      this.statusEl.textContent = msg;
      if (type === 'success') {
        this.statusEl.style.color = '#1f8b4c';
      } else if (type === 'error') {
        this.statusEl.style.color = '#d14c4c';
      } else if (type === 'win') {
        this.statusEl.style.color = '#f7c948';
        this.statusEl.style.fontSize = '18px';
      } else {
        this.statusEl.style.color = '#888';
        this.statusEl.style.fontSize = '14px';
      }
    }
  };

  // ================================================================
  //  🚀 暴露给大厅的初始化函数
  // ================================================================
  window.initGame = function(container) {
    container.innerHTML = '';
    const game = new MatchingGame(container);
    return game;
  };

})();
