/**
 * matching.js —— 数字配对（连一连）
 * 支持 7 种语言，显示原文 + 罗马音
 * 每关从 1~1000 随机抽 10 个数字
 * 无限关卡，左右列完全对齐
 */
(function() {
  'use strict';

  // ================================================================
  //  🌍 语言配置
  // ================================================================
  const LANGUAGES = {
    ko: { label: '한국어', flag: '🇰🇷' },
    ja: { label: '日本語', flag: '🇯🇵' },
    zh: { label: '中文', flag: '🇨🇳' },
    en: { label: 'English', flag: '🇬🇧' },
    th: { label: 'ไทย', flag: '🇹🇭' },
    fr: { label: 'Français', flag: '🇫🇷' },
    es: { label: 'Español', flag: '🇪🇸' }
  };

  // ================================================================
  //  📚 数字生成器（1~1000）
  //  每种语言返回 { native: 原文, roman: 罗马音 }
  // ================================================================

  // ---------- 韩文 ----------
  function koNumber(num) {
    if (num === 0) return { native: '영', roman: 'yeong' };

    const units = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
    const teens = ['십', '이십', '삼십', '사십', '오십', '육십', '칠십', '팔십', '구십'];
    const hundreds = ['', '백', '이백', '삼백', '사백', '오백', '육백', '칠백', '팔백', '구백'];
    const thousands = ['', '천', '이천', '삼천', '사천', '오천', '육천', '칠천', '팔천', '구천'];

    const romUnits = ['', 'il', 'i', 'sam', 'sa', 'o', 'yuk', 'chil', 'pal', 'gu'];
    const romTeens = ['sip', 'i-sip', 'sam-sip', 'sa-sip', 'o-sip', 'yuk-sip', 'chil-sip', 'pal-sip', 'gu-sip'];
    const romHundreds = ['', 'baek', 'i-baek', 'sam-baek', 'sa-baek', 'o-baek', 'yuk-baek', 'chil-baek', 'pal-baek', 'gu-baek'];
    const romThousands = ['', 'cheon', 'i-cheon', 'sam-cheon', 'sa-cheon', 'o-cheon', 'yuk-cheon', 'chil-cheon', 'pal-cheon', 'gu-cheon'];

    let nativeParts = [], romanParts = [];
    let n = num;

    // 千位
    const t = Math.floor(n / 1000);
    if (t > 0) { nativeParts.push(thousands[t]); romanParts.push(romThousands[t]); n %= 1000; }
    // 百位
    const h = Math.floor(n / 100);
    if (h > 0) { nativeParts.push(hundreds[h]); romanParts.push(romHundreds[h]); n %= 100; }
    // 十位
    const ten = Math.floor(n / 10);
    if (ten > 0) { nativeParts.push(teens[ten - 1]); romanParts.push(romTeens[ten - 1]); n %= 10; }
    // 个位
    if (n > 0) { nativeParts.push(units[n]); romanParts.push(romUnits[n]); }

    return {
      native: nativeParts.join(''),
      roman: romanParts.join(' ')
    };
  }

  // ---------- 日文 ----------
  function jaNumber(num) {
    if (num === 0) return { native: '零', roman: 'rei' };

    // 汉字数字（原文）
    const kanUnits = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const kanTeens = ['十', '二十', '三十', '四十', '五十', '六十', '七十', '八十', '九十'];
    const kanHundreds = ['', '百', '二百', '三百', '四百', '五百', '六百', '七百', '八百', '九百'];
    const kanThousands = ['', '千', '二千', '三千', '四千', '五千', '六千', '七千', '八千', '九千'];

    // 罗马音
    const romUnits = ['', 'ichi', 'ni', 'san', 'yon', 'go', 'roku', 'nana', 'hachi', 'kyu'];
    const romTeens = ['juu', 'ni-juu', 'san-juu', 'yon-juu', 'go-juu', 'roku-juu', 'nana-juu', 'hachi-juu', 'kyu-juu'];
    const romHundreds = ['', 'hyaku', 'ni-hyaku', 'san-byaku', 'yon-hyaku', 'go-hyaku', 'roppyaku', 'nana-hyaku', 'happyaku', 'kyu-hyaku'];
    const romThousands = ['', 'sen', 'ni-sen', 'san-zen', 'yon-sen', 'go-sen', 'roku-sen', 'nana-sen', 'hassen', 'kyu-sen'];

    let nativeParts = [], romanParts = [];
    let n = num;

    const t = Math.floor(n / 1000);
    if (t > 0) { nativeParts.push(kanThousands[t]); romanParts.push(romThousands[t]); n %= 1000; }
    const h = Math.floor(n / 100);
    if (h > 0) { nativeParts.push(kanHundreds[h]); romanParts.push(romHundreds[h]); n %= 100; }
    const ten = Math.floor(n / 10);
    if (ten > 0) { nativeParts.push(kanTeens[ten - 1]); romanParts.push(romTeens[ten - 1]); n %= 10; }
    if (n > 0) { nativeParts.push(kanUnits[n]); romanParts.push(romUnits[n]); }

    return {
      native: nativeParts.join(''),
      roman: romanParts.join(' ')
    };
  }

  // ---------- 中文 ----------
  function zhNumber(num) {
    if (num === 0) return { native: '零', roman: 'líng' };
    const units = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
    const teens = ['十', '二十', '三十', '四十', '五十', '六十', '七十', '八十', '九十'];
    const hundreds = ['', '百', '二百', '三百', '四百', '五百', '六百', '七百', '八百', '九百'];
    const thousands = ['', '千', '二千', '三千', '四千', '五千', '六千', '七千', '八千', '九千'];
    let parts = [], roman = [], n = num;
    const t = Math.floor(n / 1000); if (t > 0) { parts.push(thousands[t]); roman.push(thousands[t]); n %= 1000; }
    const h = Math.floor(n / 100); if (h > 0) { parts.push(hundreds[h]); roman.push(hundreds[h]); n %= 100; }
    const ten = Math.floor(n / 10); if (ten > 0) { parts.push(teens[ten - 1]); roman.push(teens[ten - 1]); n %= 10; }
    if (n > 0) { parts.push(units[n]); roman.push(units[n]); }
    return { native: parts.join(''), roman: roman.join(' ').trim() };
  }

  // ---------- 英文 ----------
  function enNumber(num) {
    if (num === 0) return { native: 'zero', roman: 'ˈzɪə.rəʊ' };
    const units = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const teens = ['ten', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const special = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    let parts = [], n = num;
    if (n >= 1000) { parts.push('one thousand'); n -= 1000; }
    if (n >= 100) { const h = Math.floor(n / 100); parts.push(h === 1 ? 'one hundred' : units[h] + ' hundred'); n %= 100; }
    if (n >= 20) { const t = Math.floor(n / 10); parts.push(teens[t - 1]); n %= 10; }
    else if (n >= 10) { parts.push(special[n - 10]); n = 0; }
    if (n > 0) parts.push(units[n]);
    const native = parts.join(' ');
    return { native, roman: native };
  }

  // ---------- 泰文 ----------
  function thNumber(num) {
    if (num === 0) return { native: 'ศูนย์', roman: 'sǔun' };
    const units = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
    const teens = ['สิบ', 'ยี่สิบ', 'สามสิบ', 'สี่สิบ', 'ห้าสิบ', 'หกสิบ', 'เจ็ดสิบ', 'แปดสิบ', 'เก้าสิบ'];
    const hundreds = ['', 'ร้อย', 'สองร้อย', 'สามร้อย', 'สี่ร้อย', 'ห้าร้อย', 'หกร้อย', 'เจ็ดร้อย', 'แปดร้อย', 'เก้าร้อย'];
    const thousands = ['', 'พัน', 'สองพัน', 'สามพัน', 'สี่พัน', 'ห้าพัน', 'หกพัน', 'เจ็ดพัน', 'แปดพัน', 'เก้าพัน'];
    let parts = [], roman = [], n = num;
    const t = Math.floor(n / 1000); if (t > 0) { parts.push(thousands[t]); roman.push(thousands[t]); n %= 1000; }
    const h = Math.floor(n / 100); if (h > 0) { parts.push(hundreds[h]); roman.push(hundreds[h]); n %= 100; }
    const ten = Math.floor(n / 10); if (ten > 0) { parts.push(teens[ten - 1]); roman.push(teens[ten - 1]); n %= 10; }
    if (n > 0) { parts.push(units[n]); roman.push(units[n]); }
    return { native: parts.join(''), roman: roman.join(' ').trim() };
  }

  // ---------- 法语 ----------
  function frNumber(num) {
    if (num === 0) return { native: 'zéro', roman: 'ze.ʁo' };
    const units = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
    const teens = ['dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingts', 'quatre-vingt-dix'];
    const hundreds = ['', 'cent', 'deux cents', 'trois cents', 'quatre cents', 'cinq cents', 'six cents', 'sept cents', 'huit cents', 'neuf cents'];
    let parts = [], n = num;
    if (n >= 1000) { parts.push('mille'); n -= 1000; }
    if (n >= 100) { const h = Math.floor(n / 100); parts.push(hundreds[h]); n %= 100; }
    if (n >= 20) { const t = Math.floor(n / 10); parts.push(teens[t - 1]); n %= 10; }
    else if (n >= 10) { const sp = ['dix','onze','douze','treize','quatorze','quinze','seize','dix-sept','dix-huit','dix-neuf']; parts.push(sp[n-10]); n=0; }
    if (n > 0) parts.push(units[n]);
    const native = parts.join(' ');
    return { native, roman: native };
  }

  // ---------- 西班牙文 ----------
  function esNumber(num) {
    if (num === 0) return { native: 'cero', roman: 'ˈθe.ɾo' };
    const units = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
    const teens = ['diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
    const hundreds = ['', 'cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];
    let parts = [], n = num;
    if (n >= 1000) { parts.push('mil'); n -= 1000; }
    if (n >= 100) { const h = Math.floor(n / 100); parts.push(hundreds[h]); n %= 100; }
    if (n >= 20) { const t = Math.floor(n / 10); parts.push(teens[t - 1]); n %= 10; }
    else if (n >= 10) { const sp = ['diez','once','doce','trece','catorce','quince','dieciséis','diecisiete','dieciocho','diecinueve']; parts.push(sp[n-10]); n=0; }
    if (n > 0) parts.push(units[n]);
    const native = parts.join(' ');
    return { native, roman: native };
  }

  // ---------- 统一接口 ----------
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
    this.MAX_NUM = 1000;
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

  MatchingGame.prototype.shuffleArray = function(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
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
      const wordData = getWordForNumber(num, this.lang);
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

  // -------- 渲染 --------
  MatchingGame.prototype.render = function() {
    this.setupRound();
    this.container.innerHTML = '';

    const wrapper = document.createElement('div');
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

    this.renderCards();

    this.progressEl = document.getElementById('match-progress');
    this.statusEl = document.getElementById('match-status');

    this.bindEvents();
    this.updateProgress();
  };

  // ================================================================
  //  🔥 固定卡片高度 + 完美对齐
  // ================================================================
  MatchingGame.prototype.renderCards = function() {
    const leftCol = document.getElementById('match-left');
    const rightCol = document.getElementById('match-right');

    leftCol.innerHTML = '';
    rightCol.innerHTML = '';

    const CARD_HEIGHT = '60px';

    this.leftItems.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'match-card match-left-card';
      card.dataset.index = index;
      card.dataset.pairId = item.pairId;
      card.dataset.side = 'left';
      card.textContent = item.num;
      card.style.cssText = `
        padding: 8px 12px;
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
        height: ${CARD_HEIGHT};
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        box-sizing: border-box;
        flex-shrink: 0;
        line-height: 1.2;
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

    this.rightItems.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'match-card match-right-card';
      card.dataset.index = index;
      card.dataset.pairId = item.pairId;
      card.dataset.side = 'right';
      const wordData = item.wordData;
      // 显示格式：原文 (罗马音)
      let displayText = wordData.native;
      if (wordData.roman && wordData.roman.length > 0) {
        displayText = wordData.native + ' (' + wordData.roman + ')';
      }
      card.textContent = displayText;
      card.style.cssText = `
        padding: 8px 12px;
        border: 2px solid ${item.matched ? '#1f8b4c' : '#e6ecf3'};
        border-radius: 14px;
        background: ${item.matched ? '#e6f7ee' : '#fafcff'};
        font-size: 14px;
        font-weight: 600;
        text-align: center;
        cursor: ${item.matched ? 'default' : 'pointer'};
        color: ${item.matched ? '#0f5a31' : '#0b1c33'};
        transition: all 0.2s;
        opacity: ${item.matched ? '0.6' : '1'};
        user-select: none;
        height: ${CARD_HEIGHT};
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        box-sizing: border-box;
        flex-shrink: 0;
        line-height: 1.3;
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
      rightCol.appendChild(card);
    });
  };

  // -------- 事件绑定 --------
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
    if (this.selectedRight) this.attemptMatch();
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
    if (this.selectedLeft) this.attemptMatch();
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
          setTimeout(() => this.render(), 800);
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
    if (this.progressEl) this.progressEl.textContent = `${this.matchedPairs.length}/${this.totalPairs}`;
  };

  MatchingGame.prototype.updateScore = function() {
    const info = this.container.querySelector('.matching-game > div:first-child > div:last-child');
    if (info) info.textContent = `🏆 第 ${this.round} 关 · 得分 ${this.score}`;
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
