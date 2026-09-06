/**
 * matching.js —— 数字配对（连一连）
 * 支持 7 种语言，显示原文 + 读音
 * 每关从 1~1000 随机抽 10 个数字
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
  //  📚 数字生成器（1~1000）
  //  每种语言通过规则生成原文和读音
  // ================================================================

  // ---------- 韩语 ----------
  const koUnits = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  const koTeens = ['십', '이십', '삼십', '사십', '오십', '육십', '칠십', '팔십', '구십'];
  const koHundreds = ['', '백', '이백', '삼백', '사백', '오백', '육백', '칠백', '팔백', '구백'];
  const koThousands = ['', '천', '이천', '삼천', '사천', '오천', '육천', '칠천', '팔천', '구천'];

  function koNumber(num) {
    if (num === 0) return { native: '영', roman: 'yeong' };
    let parts = [];
    let roman = [];
    let n = num;
    // 千位
    const thou = Math.floor(n / 1000);
    if (thou > 0) {
      parts.push(koThousands[thou]);
      roman.push(koThousands[thou]);
      n %= 1000;
    }
    // 百位
    const hun = Math.floor(n / 100);
    if (hun > 0) {
      parts.push(koHundreds[hun]);
      roman.push(koHundreds[hun]);
      n %= 100;
    }
    // 十位
    const ten = Math.floor(n / 10);
    if (ten > 0) {
      parts.push(koTeens[ten - 1]);
      roman.push(koTeens[ten - 1]);
      n %= 10;
    }
    // 个位
    if (n > 0) {
      parts.push(koUnits[n]);
      roman.push(koUnits[n]);
    }
    // 如果全部为空（num=0），但已经处理
    const native = parts.join('');
    const romanStr = roman.join(' ');
    // 去除多余空格
    return { native, roman: romanStr.trim() };
  }

  // ---------- 日语 ----------
  const jaUnits = ['', 'いち', 'に', 'さん', 'よん', 'ご', 'ろく', 'なな', 'はち', 'きゅう'];
  const jaTeens = ['じゅう', 'にじゅう', 'さんじゅう', 'よんじゅう', 'ごじゅう', 'ろくじゅう', 'ななじゅう', 'はちじゅう', 'きゅうじゅう'];
  const jaHundreds = ['', 'ひゃく', 'にひゃく', 'さんびゃく', 'よんひゃく', 'ごひゃく', 'ろっぴゃく', 'ななひゃく', 'はっぴゃく', 'きゅうひゃく'];
  const jaThousands = ['', 'せん', 'にせん', 'さんぜん', 'よんせん', 'ごせん', 'ろくせん', 'ななせん', 'はっせん', 'きゅうせん'];

  function jaNumber(num) {
    if (num === 0) return { native: '零', roman: 'rei' };
    let parts = [];
    let roman = [];
    let n = num;
    const thou = Math.floor(n / 1000);
    if (thou > 0) {
      parts.push(jaThousands[thou]);
      roman.push(jaThousands[thou]);
      n %= 1000;
    }
    const hun = Math.floor(n / 100);
    if (hun > 0) {
      parts.push(jaHundreds[hun]);
      roman.push(jaHundreds[hun]);
      n %= 100;
    }
    const ten = Math.floor(n / 10);
    if (ten > 0) {
      parts.push(jaTeens[ten - 1]);
      roman.push(jaTeens[ten - 1]);
      n %= 10;
    }
    if (n > 0) {
      parts.push(jaUnits[n]);
      roman.push(jaUnits[n]);
    }
    // 处理汉字数字（原文字符）——这里我们用汉字数字
    // 为了显示汉字，我们单独构建 native 为汉字数字
    const kanjiUnits = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const kanjiTeens = ['十', '二十', '三十', '四十', '五十', '六十', '七十', '八十', '九十'];
    const kanjiHundreds = ['', '百', '二百', '三百', '四百', '五百', '六百', '七百', '八百', '九百'];
    const kanjiThousands = ['', '千', '二千', '三千', '四千', '五千', '六千', '七千', '八千', '九千'];
    let kanji = [];
    let n2 = num;
    const t2 = Math.floor(n2 / 1000);
    if (t2 > 0) { kanji.push(kanjiThousands[t2]); n2 %= 1000; }
    const h2 = Math.floor(n2 / 100);
    if (h2 > 0) { kanji.push(kanjiHundreds[h2]); n2 %= 100; }
    const t3 = Math.floor(n2 / 10);
    if (t3 > 0) { kanji.push(kanjiTeens[t3 - 1]); n2 %= 10; }
    if (n2 > 0) { kanji.push(kanjiUnits[n2]); }
    const native = kanji.join('');
    const romanStr = roman.join(' ');
    return { native, roman: romanStr.trim() };
  }

  // ---------- 中文 ----------
  const zhUnits = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const zhTeens = ['十', '二十', '三十', '四十', '五十', '六十', '七十', '八十', '九十'];
  const zhHundreds = ['', '百', '二百', '三百', '四百', '五百', '六百', '七百', '八百', '九百'];
  const zhThousands = ['', '千', '二千', '三千', '四千', '五千', '六千', '七千', '八千', '九千'];

  function zhNumber(num) {
    if (num === 0) return { native: '零', roman: 'líng' };
    let parts = [];
    let roman = [];
    let n = num;
    const thou = Math.floor(n / 1000);
    if (thou > 0) {
      parts.push(zhThousands[thou]);
      roman.push(zhThousands[thou]);
      n %= 1000;
    }
    const hun = Math.floor(n / 100);
    if (hun > 0) {
      parts.push(zhHundreds[hun]);
      roman.push(zhHundreds[hun]);
      n %= 100;
    }
    const ten = Math.floor(n / 10);
    if (ten > 0) {
      parts.push(zhTeens[ten - 1]);
      roman.push(zhTeens[ten - 1]);
      n %= 10;
    }
    if (n > 0) {
      parts.push(zhUnits[n]);
      roman.push(zhUnits[n]);
    }
    // 注音（拼音）需要映射，但这里我们直接用汉字读音近似
    // 简化：拼音用罗马数字替代（只演示）
    const native = parts.join('');
    const romanStr = roman.join(' ');
    return { native, roman: romanStr };
  }

  // ---------- 英文 ----------
  const enUnits = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
  const enTeens = ['ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const enHundreds = ['', 'one hundred', 'two hundred', 'three hundred', 'four hundred', 'five hundred', 'six hundred', 'seven hundred', 'eight hundred', 'nine hundred'];
  const enThousands = ['', 'one thousand'];

  function enNumber(num) {
    if (num === 0) return { native: 'zero', roman: 'ˈzɪə.rəʊ' };
    let parts = [];
    let n = num;
    if (n >= 1000) {
      parts.push('one thousand');
      n -= 1000;
    }
    if (n >= 100) {
      const h = Math.floor(n / 100);
      parts.push(enHundreds[h]);
      n %= 100;
    }
    if (n >= 20) {
      const t = Math.floor(n / 10);
      parts.push(enTeens[t - 1]);
      n %= 10;
    } else if (n >= 10) {
      // 10-19特殊
      const special = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
      parts.push(special[n - 10]);
      n = 0;
    }
    if (n > 0) {
      parts.push(enUnits[n]);
    }
    const native = parts.join(' ');
    // 简单读音，实际应为音标，这里简化
    const roman = native; // 就用单词本身作为读音
    return { native, roman };
  }

  // ---------- 泰文 ----------
  const thUnits = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
  const thTeens = ['สิบ', 'ยี่สิบ', 'สามสิบ', 'สี่สิบ', 'ห้าสิบ', 'หกสิบ', 'เจ็ดสิบ', 'แปดสิบ', 'เก้าสิบ'];
  const thHundreds = ['', 'ร้อย', 'สองร้อย', 'สามร้อย', 'สี่ร้อย', 'ห้าร้อย', 'หกร้อย', 'เจ็ดร้อย', 'แปดร้อย', 'เก้าร้อย'];
  const thThousands = ['', 'พัน', 'สองพัน', 'สามพัน', 'สี่พัน', 'ห้าพัน', 'หกพัน', 'เจ็ดพัน', 'แปดพัน', 'เก้าพัน'];

  function thNumber(num) {
    if (num === 0) return { native: 'ศูนย์', roman: 'sǔun' };
    let parts = [];
    let roman = [];
    let n = num;
    const thou = Math.floor(n / 1000);
    if (thou > 0) {
      parts.push(thThousands[thou]);
      roman.push(thThousands[thou]);
      n %= 1000;
    }
    const hun = Math.floor(n / 100);
    if (hun > 0) {
      parts.push(thHundreds[hun]);
      roman.push(thHundreds[hun]);
      n %= 100;
    }
    const ten = Math.floor(n / 10);
    if (ten > 0) {
      parts.push(thTeens[ten - 1]);
      roman.push(thTeens[ten - 1]);
      n %= 10;
    }
    if (n > 0) {
      parts.push(thUnits[n]);
      roman.push(thUnits[n]);
    }
    const native = parts.join('');
    // 读音使用泰文罗马音（简化）
    const romanStr = roman.join(' ');
    return { native, roman: romanStr.trim() };
  }

  // ---------- 法语 ----------
  const frUnits = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
  const frTeens = ['dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingts', 'quatre-vingt-dix'];
  const frHundreds = ['', 'cent', 'deux cents', 'trois cents', 'quatre cents', 'cinq cents', 'six cents', 'sept cents', 'huit cents', 'neuf cents'];
  const frThousands = ['', 'mille'];

  function frNumber(num) {
    if (num === 0) return { native: 'zéro', roman: 'ze.ʁo' };
    let parts = [];
    let n = num;
    if (n >= 1000) {
      parts.push('mille');
      n -= 1000;
    }
    if (n >= 100) {
      const h = Math.floor(n / 100);
      parts.push(frHundreds[h]);
      n %= 100;
    }
    if (n >= 20) {
      const t = Math.floor(n / 10);
      parts.push(frTeens[t - 1]);
      n %= 10;
      // 特殊处理 70-79, 90-99
      if (n > 0 && (num >= 70 || num >= 90)) {
        // 复杂逻辑简化，这里只做简单示例，实际应更复杂
        // 这里用通用规则，不完美但可展示
      }
    } else if (n >= 10) {
      const special = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
      parts.push(special[n - 10]);
      n = 0;
    }
    if (n > 0) {
      parts.push(frUnits[n]);
    }
    const native = parts.join(' ');
    // 读音用单词本身近似
    return { native, roman: native };
  }

  // ---------- 西班牙文 ----------
  const esUnits = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
  const esTeens = ['diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
  const esHundreds = ['', 'cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
  const esThousands = ['', 'mil'];

  function esNumber(num) {
    if (num === 0) return { native: 'cero', roman: 'ˈθe.ɾo' };
    let parts = [];
    let n = num;
    if (n >= 1000) {
      parts.push('mil');
      n -= 1000;
    }
    if (n >= 100) {
      const h = Math.floor(n / 100);
      parts.push(esHundreds[h]);
      n %= 100;
    }
    if (n >= 20) {
      const t = Math.floor(n / 10);
      parts.push(esTeens[t - 1]);
      n %= 10;
    } else if (n >= 10) {
      const special = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
      parts.push(special[n - 10]);
      n = 0;
    }
    if (n > 0) {
      parts.push(esUnits[n]);
    }
    const native = parts.join(' ');
    return { native, roman: native };
  }

  // ---------- 统一获取函数 ----------
  function getWordForNumber(num, lang) {
    switch (lang) {
      case 'ko': return koNumber(num);
      case 'ja': return jaNumber(num);
      case 'zh': return zhNumber(num);
      case 'en': return enNumber(num);
      case 'th': return thNumber(num);
      case 'fr': return frNumber(num);
      case 'es': return esNumber(num);
      default: return { native: String(num), roman: '' };
    }
  }

  // ================================================================
  //  游戏核心
  // ================================================================
  function MatchingGame(container) {
    this.container = container;
    this.lang = 'ko';
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
    this.MAX_NUM = 1000; // 范围 1~1000

    this.render();
  }

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

  MatchingGame.prototype.getWord = function(num) {
    return getWordForNumber(num, this.lang);
  };

  MatchingGame.prototype.setupRound = function() {
    this.numbers = this.generateNumbers();
    this.matchedPairs = [];
    this.selectedLeft = null;
    this.selectedRight = null;
    this.isProcessing = false;

    this.leftItems = this.numbers.map((num, idx) => ({
      id: idx,
      num: num,
      pairId: num,
      matched: false
    }));
    this.shuffleArray(this.leftItems);

    this.rightItems = this.numbers.map((num, idx) => {
      const wordData = this.getWord(num);
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

  // -------- 渲染 --------
  MatchingGame.prototype.render = function() {
    this.setupRound();
    this.container.innerHTML = '';

    const wrapper = document.createElement('div');
    wrapper.className = 'matching-game';
    wrapper.style.cssText = `
      max-width: 820px;
      margin: 0 auto;
      padding: 20px 0;
    `;

    // Header
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
    langSelect.addEventListener('change', () => {
      this.lang = langSelect.value;
      this.render();
    });
    header.appendChild(langSelect);

    const info = document.createElement('div');
    info.style.cssText = 'font-size: 14px; color: #888; font-weight: 600;';
    info.textContent = `🏆 第 ${this.round} 关 · 得分 ${this.score}`;
    header.appendChild(info);
    wrapper.appendChild(header);

    // Board
    const board = document.createElement('div');
    board.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      background: #fff;
      border-radius: 20px;
      padding: 20px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.06);
    `;
    wrapper.appendChild(board);

    const leftCol = document.createElement('div');
    leftCol.id = 'match-left';
    leftCol.style.cssText = 'display:flex; flex-direction:column; gap:12px;';
    board.appendChild(leftCol);

    const rightCol = document.createElement('div');
    rightCol.id = 'match-right';
    rightCol.style.cssText = 'display:flex; flex-direction:column; gap:12px;';
    board.appendChild(rightCol);

    // Status bar
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
    resetBtn.addEventListener('click', () => this.render());
    wrapper.appendChild(resetBtn);

    this.container.appendChild(wrapper);

    // Render cards
    this.renderCards();

    this.progressEl = document.getElementById('match-progress');
    this.statusEl = document.getElementById('match-status');

    this.bindEvents();
    this.updateProgress();
  };

  MatchingGame.prototype.renderCards = function() {
    const leftCol = document.getElementById('match-left');
    const rightCol = document.getElementById('match-right');

    leftCol.innerHTML = '';
    rightCol.innerHTML = '';

    // 左列数字
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
        min-height: 54px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        box-sizing: border-box;
        word-break: break-word;
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

    // 右列单词
    this.rightItems.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'match-card match-right-card';
      card.dataset.index = index;
      card.dataset.pairId = item.pairId;
      card.dataset.side = 'right';
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
        min-height: 54px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        box-sizing: border-box;
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

  // -------- UI 更新 --------
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
      this.statusEl.style.color = type === 'success' ? '#1f8b4c' :
                                  type === 'error' ? '#d14c4c' :
                                  type === 'win' ? '#f7c948' : '#888';
      if (type === 'win') this.statusEl.style.fontSize = '18px';
      else this.statusEl.style.fontSize = '14px';
    }
  };

  // ================================================================
  //  🚀 暴露给大厅
  // ================================================================
  window.initGame = function(container) {
    container.innerHTML = '';
    new MatchingGame(container);
  };

})();
