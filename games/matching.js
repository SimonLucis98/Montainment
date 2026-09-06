// games/matching_numbers.js
(function() {
  // 数字转换函数库
  const numberToWords = {
    // 中文
    zh: function(num) {
      if (num === 0) return '零';
      const digits = ['零','一','二','三','四','五','六','七','八','九'];
      const units = ['', '十', '百', '千', '万'];
      // 简单实现1-9999，但这里只到1000
      // 为了简单，采用标准的数字读法，但只到999
      if (num < 0 || num > 999) return '';
      let result = '';
      const hundreds = Math.floor(num / 100);
      const remainder = num % 100;
      if (hundreds > 0) {
        result += (hundreds === 1 ? '百' : digits[hundreds] + '百');
        if (remainder > 0) result += '零';
      }
      if (remainder > 0) {
        const tens = Math.floor(remainder / 10);
        const ones = remainder % 10;
        if (tens > 0) {
          result += (tens === 1 ? '十' : digits[tens] + '十');
          if (ones > 0) result += digits[ones];
        } else {
          result += digits[ones];
        }
      }
      return result;
    },
    // 英文
    en: function(num) {
      if (num === 0) return 'zero';
      if (num < 0 || num > 999) return '';
      const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
      const teens = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
      const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
      if (num < 10) return ones[num];
      if (num < 20) return teens[num - 10];
      if (num < 100) {
        const t = Math.floor(num / 10);
        const o = num % 10;
        return tens[t] + (o > 0 ? '-' + ones[o] : '');
      }
      // 100-999
      const h = Math.floor(num / 100);
      const rest = num % 100;
      let result = ones[h] + ' hundred';
      if (rest > 0) result += ' ' + numberToWords.en(rest);
      return result;
    },
    // 日文（音读）
    ja: function(num) {
      if (num === 0) return 'zero';
      if (num < 0 || num > 999) return '';
      const ones = ['', 'ichi', 'ni', 'san', 'yon', 'go', 'roku', 'nana', 'hachi', 'kyuu'];
      const tens = ['', 'juu', 'ni-juu', 'san-juu', 'yon-juu', 'go-juu', 'roku-juu', 'nana-juu', 'hachi-juu', 'kyuu-juu'];
      const hundreds = ['', 'hyaku', 'ni-hyaku', 'san-byaku', 'yon-hyaku', 'go-hyaku', 'roppyaku', 'nana-hyaku', 'happyaku', 'kyuu-hyaku'];
      // 简化处理
      if (num < 10) return ones[num];
      if (num < 100) {
        const t = Math.floor(num / 10);
        const o = num % 10;
        return (t === 1 ? 'juu' : tens[t]) + (o > 0 ? ' ' + ones[o] : '');
      }
      const h = Math.floor(num / 100);
      const rest = num % 100;
      let result = hundreds[h];
      if (rest > 0) result += ' ' + numberToWords.ja(rest);
      return result;
    },
    // 韩文（音译）
    ko: function(num) {
      if (num === 0) return 'yeong';
      if (num < 0 || num > 999) return '';
      const ones = ['', 'il', 'i', 'sam', 'sa', 'o', 'yuk', 'chil', 'pal', 'gu'];
      const tens = ['', 'sip', 'i-sip', 'sam-sip', 'sa-sip', 'o-sip', 'yuk-sip', 'chil-sip', 'pal-sip', 'gu-sip'];
      const hundreds = ['', 'baek', 'i-baek', 'sam-baek', 'sa-baek', 'o-baek', 'yuk-baek', 'chil-baek', 'pal-baek', 'gu-baek'];
      if (num < 10) return ones[num];
      if (num < 100) {
        const t = Math.floor(num / 10);
        const o = num % 10;
        return (t === 1 ? 'sip' : tens[t]) + (o > 0 ? ' ' + ones[o] : '');
      }
      const h = Math.floor(num / 100);
      const rest = num % 100;
      let result = hundreds[h];
      if (rest > 0) result += ' ' + numberToWords.ko(rest);
      return result;
    },
    // 法文
    fr: function(num) {
      if (num === 0) return 'zéro';
      if (num < 0 || num > 999) return '';
      const ones = ['', 'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit', 'neuf'];
      const teens = ['dix', 'onze', 'douze', 'treize', 'quatorze', 'quinze', 'seize', 'dix-sept', 'dix-huit', 'dix-neuf'];
      const tens = ['', 'dix', 'vingt', 'trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingt', 'quatre-vingt-dix'];
      // 简化，对于复杂数字仍用规则
      if (num < 10) return ones[num];
      if (num < 20) return teens[num - 10];
      if (num < 100) {
        const t = Math.floor(num / 10);
        const o = num % 10;
        let result = tens[t];
        if (o === 1 && t !== 8) result += ' et un';
        else if (o > 0) result += '-' + ones[o];
        return result;
      }
      const h = Math.floor(num / 100);
      const rest = num % 100;
      let result = (h === 1 ? 'cent' : ones[h] + ' cents');
      if (rest > 0) result += ' ' + numberToWords.fr(rest);
      return result;
    },
    // 西班牙文
    es: function(num) {
      if (num === 0) return 'cero';
      if (num < 0 || num > 999) return '';
      const ones = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
      const teens = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
      const tens = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
      if (num < 10) return ones[num];
      if (num < 20) return teens[num - 10];
      if (num < 100) {
        const t = Math.floor(num / 10);
        const o = num % 10;
        if (t === 2 && o > 0) return 'veinti' + ones[o]; // 特殊
        let result = tens[t];
        if (o > 0) result += ' y ' + ones[o];
        return result;
      }
      const h = Math.floor(num / 100);
      const rest = num % 100;
      let result = (h === 1 ? 'cien' : ones[h] + 'cientos');
      if (rest > 0) result += ' ' + numberToWords.es(rest);
      return result;
    },
    // 泰文
    th: function(num) {
      if (num === 0) return 'ศูนย์';
      if (num < 0 || num > 999) return '';
      const ones = ['', 'หนึ่ง', 'สอง', 'สาม', 'สี่', 'ห้า', 'หก', 'เจ็ด', 'แปด', 'เก้า'];
      const tens = ['', 'สิบ', 'ยี่สิบ', 'สามสิบ', 'สี่สิบ', 'ห้าสิบ', 'หกสิบ', 'เจ็ดสิบ', 'แปดสิบ', 'เก้าสิบ'];
      const hundreds = ['', 'ร้อย', 'สองร้อย', 'สามร้อย', 'สี่ร้อย', 'ห้าร้อย', 'หกร้อย', 'เจ็ดร้อย', 'แปดร้อย', 'เก้าร้อย'];
      if (num < 10) return ones[num];
      if (num < 100) {
        const t = Math.floor(num / 10);
        const o = num % 10;
        let result = tens[t];
        if (o > 0) result += (o === 1 && t > 1 ? 'เอ็ด' : ones[o]); // 特殊
        return result;
      }
      const h = Math.floor(num / 100);
      const rest = num % 100;
      let result = hundreds[h];
      if (rest > 0) result += ' ' + numberToWords.th(rest);
      return result;
    }
  };

  // 游戏主类
  class MatchingNumbersGame {
    constructor(container, options = {}) {
      this.container = container;
      this.language = options.language || 'zh'; // 默认中文
      this.round = 0;
      this.correctPairs = 0;
      this.totalAttempts = 0;
      this.pairsCount = 10;
      this.selectedLeft = null;
      this.selectedRight = null;
      this.isProcessing = false;
      this.isCompleted = false;
      this.numbers = [];
      this.words = [];
      this.matched = [];
      this.gameData = null; // {left: [{num, word, matched}], right: [{num, word, matched}]}

      this.render();
    }

    // 生成随机不重复数字（1-1000）
    generateNumbers(count) {
      const nums = [];
      while (nums.length < count) {
        const n = Math.floor(Math.random() * 1000) + 1;
        if (!nums.includes(n)) nums.push(n);
      }
      return nums;
    }

    // 获取对应语言的数字单词
    getWords(nums, lang) {
      const convert = numberToWords[lang];
      if (!convert) return nums.map(n => n.toString()); // fallback
      return nums.map(n => convert(n));
    }

    // 准备一轮数据
    prepareRound() {
      this.numbers = this.generateNumbers(this.pairsCount);
      this.words = this.getWords(this.numbers, this.language);
      // 构建左右数据：左侧数字，右侧单词（打乱顺序）
      const left = this.numbers.map((num, idx) => ({
        id: idx,
        num: num,
        word: this.words[idx],
        matched: false
      }));
      const right = this.words.map((word, idx) => ({
        id: idx,
        num: this.numbers[idx],
        word: word,
        matched: false
      }));
      // 打乱右侧
      this.shuffleArray(right);
      this.matched = [];
      this.gameData = { left, right };
    }

    shuffleArray(arr) {
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }

    // 渲染游戏界面
    render() {
      // 每次重新渲染前，清空容器并重置状态
      this.container.innerHTML = '';
      this.selectedLeft = null;
      this.selectedRight = null;
      this.isProcessing = false;
      this.isCompleted = false;

      // 语言选择器（位于顶部）
      const langSelector = document.createElement('div');
      langSelector.style.cssText = 'margin-bottom:16px; display:flex; gap:12px; align-items:center; flex-wrap:wrap;';
      langSelector.innerHTML = `
        <label style="font-weight:600; color:#0b1c33;">🌐 语言：</label>
        <select id="matching-lang-select" style="padding:6px 12px; border:2px solid #e6ecf3; border-radius:8px; font-size:14px; background:#fafcff;">
          <option value="zh" ${this.language==='zh'?'selected':''}>中文</option>
          <option value="en" ${this.language==='en'?'selected':''}>English</option>
          <option value="ja" ${this.language==='ja'?'selected':''}>日本語</option>
          <option value="ko" ${this.language==='ko'?'selected':''}>한국어</option>
          <option value="fr" ${this.language==='fr'?'selected':''}>Français</option>
          <option value="es" ${this.language==='es'?'selected':''}>Español</option>
          <option value="th" ${this.language==='th'?'selected':''}>ภาษาไทย</option>
        </select>
        <span style="font-size:14px; color:#6b7a8f; margin-left:8px;">轮次: <span id="round-display">${this.round}</span> | 正确: <span id="correct-display">${this.correctPairs}</span> / ${this.totalAttempts}</span>
      `;
      this.container.appendChild(langSelector);

      // 游戏板
      const board = document.createElement('div');
      board.style.cssText = 'display:grid; grid-template-columns:1fr 1fr; gap:24px; background:#fff; border-radius:20px; padding:24px; box-shadow:0 4px 20px rgba(0,0,0,0.06);';
      this.container.appendChild(board);

      // 左侧列（数字）
      const leftCol = document.createElement('div');
      leftCol.id = 'match-left';
      leftCol.style.cssText = 'display:flex; flex-direction:column; gap:10px;';
      board.appendChild(leftCol);

      // 右侧列（单词）
      const rightCol = document.createElement('div');
      rightCol.id = 'match-right';
      rightCol.style.cssText = 'display:flex; flex-direction:column; gap:10px;';
      board.appendChild(rightCol);

      // 状态信息
      const statusBar = document.createElement('div');
      statusBar.style.cssText = 'margin-top:16px; padding:12px 20px; background:#f6f8fc; border-radius:12px; font-weight:600; color:#0b1c33; text-align:center;';
      statusBar.id = 'matching-status';
      statusBar.textContent = '点击左侧数字，再点击右侧单词配对';
      this.container.appendChild(statusBar);

      // 准备数据并渲染卡片
      this.prepareRound();
      this.renderCards();

      // 绑定语言切换事件
      const langSelect = document.getElementById('matching-lang-select');
      langSelect.addEventListener('change', (e) => {
        this.language = e.target.value;
        this.round = 0;
        this.correctPairs = 0;
        this.totalAttempts = 0;
        this.render();
      });

      // 绑定点击事件（事件委托）
      this.container.addEventListener('click', (e) => {
        const card = e.target.closest('.match-card');
        if (!card) return;
        if (card.classList.contains('matched')) return;
        if (this.isProcessing) return;
        if (this.isCompleted) return;

        const side = card.dataset.side;
        const id = parseInt(card.dataset.id);

        if (side === 'left') {
          this.handleLeftClick(card, id);
        } else {
          this.handleRightClick(card, id);
        }
      });
    }

    renderCards() {
      const leftCol = document.getElementById('match-left');
      const rightCol = document.getElementById('match-right');
      if (!leftCol || !rightCol) return;

      leftCol.innerHTML = '';
      rightCol.innerHTML = '';

      const leftData = this.gameData.left;
      const rightData = this.gameData.right;

      leftData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'match-card';
        card.dataset.side = 'left';
        card.dataset.id = item.id;
        card.dataset.num = item.num;
        card.textContent = item.num;
        card.style.cssText = `
          padding: 14px 18px;
          border: 2px solid ${item.matched ? '#1f8b4c' : '#e6ecf3'};
          border-radius: 14px;
          background: ${item.matched ? '#e6f7ee' : '#fafcff'};
          font-size: 20px;
          font-weight: 700;
          text-align: center;
          cursor: ${item.matched ? 'default' : 'pointer'};
          color: ${item.matched ? '#0f5a31' : '#0b1c33'};
          transition: all 0.2s;
          opacity: ${item.matched ? '0.6' : '1'};
          user-select: none;
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

      rightData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'match-card';
        card.dataset.side = 'right';
        card.dataset.id = item.id;
        card.dataset.word = item.word;
        card.textContent = item.word;
        card.style.cssText = `
          padding: 14px 18px;
          border: 2px solid ${item.matched ? '#1f8b4c' : '#e6ecf3'};
          border-radius: 14px;
          background: ${item.matched ? '#e6f7ee' : '#fafcff'};
          font-size: 18px;
          font-weight: 600;
          text-align: center;
          cursor: ${item.matched ? 'default' : 'pointer'};
          color: ${item.matched ? '#0f5a31' : '#0b1c33'};
          transition: all 0.2s;
          opacity: ${item.matched ? '0.6' : '1'};
          user-select: none;
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
    }

    handleLeftClick(card, id) {
      // 如果已经配对或正在处理，忽略
      if (this.gameData.left.find(item => item.id === id)?.matched) return;

      // 取消之前选中的左侧
      document.querySelectorAll('#match-left .match-card.selected').forEach(el => {
        el.classList.remove('selected');
        el.style.borderColor = '#e6ecf3';
        el.style.background = '#fafcff';
        el.style.boxShadow = 'none';
      });

      card.classList.add('selected');
      card.style.borderColor = '#2a6df4';
      card.style.background = '#e5edfe';
      card.style.boxShadow = '0 0 0 4px rgba(42,109,244,0.15)';

      this.selectedLeft = { card, id };
      this.updateStatus('已选左侧，请点击右侧配对');

      if (this.selectedRight) {
        this.attemptMatch();
      }
    }

    handleRightClick(card, id) {
      if (this.gameData.right.find(item => item.id === id)?.matched) return;

      document.querySelectorAll('#match-right .match-card.selected').forEach(el => {
        el.classList.remove('selected');
        el.style.borderColor = '#e6ecf3';
        el.style.background = '#fafcff';
        el.style.boxShadow = 'none';
      });

      card.classList.add('selected');
      card.style.borderColor = '#2a6df4';
      card.style.background = '#e5edfe';
      card.style.boxShadow = '0 0 0 4px rgba(42,109,244,0.15)';

      this.selectedRight = { card, id };
      this.updateStatus('已选右侧，请点击左侧配对');

      if (this.selectedLeft) {
        this.attemptMatch();
      }
    }

    attemptMatch() {
      if (!this.selectedLeft || !this.selectedRight) return;
      this.isProcessing = true;

      const leftId = this.selectedLeft.id;
      const rightId = this.selectedRight.id;
      const leftItem = this.gameData.left.find(item => item.id === leftId);
      const rightItem = this.gameData.right.find(item => item.id === rightId);

      const isMatch = (leftItem.num === rightItem.num);

      // 更新尝试次数
      this.totalAttempts++;
      if (isMatch) this.correctPairs++;

      if (isMatch) {
        // 配对成功
        leftItem.matched = true;
        rightItem.matched = true;
        this.matched.push(leftId);

        // 更新UI样式
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

        this.updateStatus('✅ 配对正确！', 'success');
        this.updateScore();

        this.selectedLeft = null;
        this.selectedRight = null;
        this.isProcessing = false;

        // 检查是否所有配对完成
        if (this.matched.length === this.pairsCount) {
          this.isCompleted = true;
          this.updateStatus('🎉 全部配对完成！即将进入下一轮...', 'win');
          // 延迟后进入下一轮
          setTimeout(() => {
            this.round++;
            this.render(); // 重新渲染，自动进入下一轮
          }, 1500);
        }
      } else {
        // 配对失败
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
          this.selectedLeft = null;
          this.selectedRight = null;
          this.isProcessing = false;
          this.updateStatus('点击左侧数字，再点击右侧单词配对');
        }, 500);
      }

      // 更新得分显示
      this.updateScore();
    }

    updateStatus(msg, type) {
      const statusEl = document.getElementById('matching-status');
      if (!statusEl) return;
      statusEl.textContent = msg;
      if (type === 'success') statusEl.style.color = '#1f8b4c';
      else if (type === 'error') statusEl.style.color = '#d14c4c';
      else if (type === 'win') {
        statusEl.style.color = '#f7c948';
        statusEl.style.fontSize = '18px';
      } else {
        statusEl.style.color = '#0b1c33';
        statusEl.style.fontSize = '14px';
      }
    }

    updateScore() {
      const correctEl = document.getElementById('correct-display');
      const roundEl = document.getElementById('round-display');
      if (correctEl) correctEl.textContent = this.correctPairs;
      if (roundEl) roundEl.textContent = this.round;
    }
  }

  // ================================================================
  //  🚀 暴露给大厅的初始化函数
  // ================================================================
  window.initGame = function(container, options = {}) {
    container.innerHTML = '';
    const game = new MatchingNumbersGame(container, options);
    return game;
  };

})();
