/**
 * game.js —— 记忆配对游戏（Memory Game）逻辑
 * 玩法：16 张卡片（8 组 emoji 配对），每次翻开两张，
 * 若图案相同则配对成功并保持翻开，否则 0.8 秒后自动翻回。
 * 统计步数（每翻开一对算一步）与计时，全部配对完成后显示通关提示。
 */

(function () {
  const board = document.getElementById("memory-board");
  if (!board) return; // 不是游戏页面则不执行

  const movesLabel = document.getElementById("game-moves");
  const timeLabel = document.getElementById("game-time");
  const matchesLabel = document.getElementById("game-matches");
  const winBanner = document.getElementById("game-win-banner");
  const restartBtn = document.getElementById("game-restart-btn");

  // 8 组 emoji 图案，寓意"教育+娱乐"（书本、火箭、星星等）
  const EMOJI_SET = ["📚", "🚀", "⭐", "🎨", "🧠", "🎵", "🌍", "🏆"];

  let cards = [];
  let flippedCards = []; // 当前翻开、尚未判断的卡片（最多 2 张）
  let matchedCount = 0;
  let moves = 0;
  let isBusy = false; // 判断动画期间锁定点击，防止连续快速点击出错
  let timerInterval = null;
  let secondsElapsed = 0;

  // ---------- 1. 初始化 / 重新开始游戏 ----------
  function initGame() {
    // 生成 16 张卡片数据并打乱顺序
    const pairData = EMOJI_SET.concat(EMOJI_SET); // 每个 emoji 出现两次
    cards = shuffleArray(
      pairData.map((emoji, i) => ({ id: i, emoji: emoji, isFlipped: false, isMatched: false }))
    );

    flippedCards = [];
    matchedCount = 0;
    moves = 0;
    isBusy = false;
    secondsElapsed = 0;

    movesLabel.textContent = "0";
    timeLabel.textContent = "00:00";
    matchesLabel.textContent = "0 / " + EMOJI_SET.length;
    winBanner.textContent = "";

    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(function () {
      secondsElapsed++;
      const mins = String(Math.floor(secondsElapsed / 60)).padStart(2, "0");
      const secs = String(secondsElapsed % 60).padStart(2, "0");
      timeLabel.textContent = mins + ":" + secs;
    }, 1000);

    renderBoard();
  }

  // ---------- 2. 渲染整个棋盘 ----------
  function renderBoard() {
    board.innerHTML = "";
    cards.forEach(function (card) {
      const cardEl = document.createElement("div");
      cardEl.className = "memory-card";
      cardEl.dataset.id = card.id;

      cardEl.innerHTML = `
        <div class="memory-card-inner">
          <div class="memory-face front">?</div>
          <div class="memory-face back">${card.emoji}</div>
        </div>
      `;

      cardEl.addEventListener("click", function () {
        handleCardClick(card.id, cardEl);
      });

      board.appendChild(cardEl);
    });
  }

  // ---------- 3. 处理卡片点击 ----------
  function handleCardClick(id, cardEl) {
    if (isBusy) return;

    const card = cards.find((c) => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    card.isFlipped = true;
    cardEl.classList.add("flipped");
    flippedCards.push({ card, el: cardEl });

    if (flippedCards.length === 2) {
      moves++;
      movesLabel.textContent = String(moves);
      isBusy = true;
      checkForMatch();
    }
  }

  // ---------- 4. 判断两张翻开的卡片是否配对 ----------
  function checkForMatch() {
    const [first, second] = flippedCards;

    if (first.card.emoji === second.card.emoji) {
      // 配对成功
      first.card.isMatched = true;
      second.card.isMatched = true;
      first.el.classList.add("matched");
      second.el.classList.add("matched");
      matchedCount++;
      matchesLabel.textContent = matchedCount + " / " + EMOJI_SET.length;

      flippedCards = [];
      isBusy = false;

      if (matchedCount === EMOJI_SET.length) {
        finishGame();
      }
    } else {
      // 配对失败，短暂展示后翻回背面
      setTimeout(function () {
        first.card.isFlipped = false;
        second.card.isFlipped = false;
        first.el.classList.remove("flipped");
        second.el.classList.remove("flipped");
        flippedCards = [];
        isBusy = false;
      }, 800);
    }
  }

  // ---------- 5. 游戏通关 ----------
  function finishGame() {
    clearInterval(timerInterval);
    winBanner.textContent =
      "🎉 恭喜通关！共用时 " + timeLabel.textContent + "，步数 " + moves + " 步。";
  }

  // ---------- 6. 工具函数：打乱数组 ----------
  function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  // ---------- 7. 事件绑定与初始化 ----------
  restartBtn.addEventListener("click", initGame);
  initGame();
})();
