/**
 * quiz.js —— 语言学习测验逻辑
 * 题库中每道题有两种类型：
 *   1. "mc"    单项选择题：question + options + answerIndex
 *   2. "match" 单词配对题：pairs（英文-中文词对数组），
 *              用户需要通过点选把左右两栏一一对应
 * 每答完一题（选择题选中即完成 / 配对题全部配对完成），
 * 显示反馈并解锁"下一题"按钮，全部完成后展示最终得分页。
 */

(function () {
  // ---------- 1. 题库数据 ----------
  const QUESTIONS = [
    {
      type: "mc",
      question: '"Apple" 的中文意思是？',
      options: ["苹果", "香蕉", "橙子", "葡萄"],
      answerIndex: 0,
    },
    {
      type: "match",
      pairs: [
        { en: "Sun", zh: "太阳" },
        { en: "Moon", zh: "月亮" },
        { en: "Star", zh: "星星" },
        { en: "Sky", zh: "天空" },
      ],
    },
    {
      type: "mc",
      question: '"Library" 是指？',
      options: ["医院", "图书馆", "游乐场", "餐厅"],
      answerIndex: 1,
    },
    {
      type: "mc",
      question: '哪个单词的意思是"勇敢的"？',
      options: ["Brave", "Boring", "Busy", "Blue"],
      answerIndex: 0,
    },
    {
      type: "match",
      pairs: [
        { en: "Cat", zh: "猫" },
        { en: "Dog", zh: "狗" },
        { en: "Bird", zh: "鸟" },
        { en: "Fish", zh: "鱼" },
      ],
    },
    {
      type: "mc",
      question: '"Journey" 最贴切的中文意思是？',
      options: ["旅程", "早餐", "杂志", "工作"],
      answerIndex: 0,
    },
    {
      type: "mc",
      question: '哪个单词表示"好奇的"？',
      options: ["Curious", "Careless", "Cautious", "Cold"],
      answerIndex: 0,
    },
    {
      type: "match",
      pairs: [
        { en: "Happy", zh: "开心" },
        { en: "Sad", zh: "难过" },
        { en: "Angry", zh: "生气" },
        { en: "Calm", zh: "平静" },
      ],
    },
  ];

  // ---------- 2. 状态变量 ----------
  let currentIndex = 0;
  let score = 0;
  let currentQuestionSolved = false; // 当前题目是否已完成作答

  // ---------- 3. DOM 引用 ----------
  const quizBody = document.getElementById("quiz-body");
  const quizFeedback = document.getElementById("quiz-feedback");
  const quizIndexLabel = document.getElementById("quiz-index");
  const quizProgressBar = document.getElementById("quiz-progress-bar");
  const quizScoreLabel = document.getElementById("quiz-score");
  const nextBtn = document.getElementById("quiz-next-btn");

  // 页面上不一定存在这些元素（保险判断，避免脚本报错）
  if (!quizBody) return;

  // ---------- 4. 渲染当前题目 ----------
  function renderQuestion() {
    currentQuestionSolved = false;
    quizFeedback.textContent = "";
    quizFeedback.className = "quiz-feedback";
    nextBtn.style.display = "none";

    const q = QUESTIONS[currentIndex];
    quizIndexLabel.textContent = "第 " + (currentIndex + 1) + " / " + QUESTIONS.length + " 题";
    quizProgressBar.style.width = ((currentIndex) / QUESTIONS.length) * 100 + "%";

    if (q.type === "mc") {
      renderMultipleChoice(q);
    } else if (q.type === "match") {
      renderMatch(q);
    }
  }

  // ---------- 5. 渲染选择题 ----------
  function renderMultipleChoice(q) {
    quizBody.innerHTML = `
      <span class="quiz-type-tag">选择题</span>
      <div class="quiz-question">${q.question}</div>
      <div class="quiz-options">
        ${q.options
          .map(
            (opt, i) =>
              `<button class="quiz-option" data-index="${i}">${opt}</button>`
          )
          .join("")}
      </div>
    `;

    const optionButtons = quizBody.querySelectorAll(".quiz-option");
    optionButtons.forEach((btn) => {
      btn.addEventListener("click", function () {
        if (currentQuestionSolved) return; // 防止重复作答
        currentQuestionSolved = true;

        const chosenIndex = parseInt(btn.getAttribute("data-index"), 10);
        const isCorrect = chosenIndex === q.answerIndex;

        // 禁用所有按钮，并标记正确/错误状态
        optionButtons.forEach((b) => (b.disabled = true));
        if (isCorrect) {
          btn.classList.add("correct");
          score += 10;
          showFeedback("回答正确！+10 分", true);
        } else {
          btn.classList.add("wrong");
          optionButtons[q.answerIndex].classList.add("correct");
          showFeedback("答错了，正确答案是：" + q.options[q.answerIndex], false);
        }

        quizScoreLabel.textContent = score;
        nextBtn.style.display = "inline-flex";
      });
    });
  }

  // ---------- 6. 渲染单词配对题 ----------
  function renderMatch(q) {
    // 分别打乱左右两栏顺序，增加游戏性
    const leftItems = q.pairs.map((p, i) => ({ text: p.en, pairId: i }));
    const rightItems = shuffleArray(
      q.pairs.map((p, i) => ({ text: p.zh, pairId: i }))
    );

    quizBody.innerHTML = `
      <span class="quiz-type-tag">单词配对</span>
      <div class="quiz-question">点击左右两侧，把英文和对应的中文配成一对</div>
      <div class="match-board">
        <div class="match-col" id="match-left"></div>
        <div class="match-col" id="match-right"></div>
      </div>
    `;

    const leftCol = quizBody.querySelector("#match-left");
    const rightCol = quizBody.querySelector("#match-right");

    leftItems.forEach((item) => {
      const el = document.createElement("button");
      el.className = "match-item";
      el.textContent = item.text;
      el.dataset.pairId = item.pairId;
      el.dataset.side = "left";
      leftCol.appendChild(el);
    });

    rightItems.forEach((item) => {
      const el = document.createElement("button");
      el.className = "match-item";
      el.textContent = item.text;
      el.dataset.pairId = item.pairId;
      el.dataset.side = "right";
      rightCol.appendChild(el);
    });

    let selectedLeft = null;
    let selectedRight = null;
    let matchedCount = 0;

    function handleSelect(el) {
      if (el.classList.contains("matched")) return;

      const side = el.dataset.side;
      if (side === "left") {
        if (selectedLeft) selectedLeft.classList.remove("selected");
        selectedLeft = el;
        el.classList.add("selected");
      } else {
        if (selectedRight) selectedRight.classList.remove("selected");
        selectedRight = el;
        el.classList.add("selected");
      }

      // 左右都已选中，判断是否配对成功
      if (selectedLeft && selectedRight) {
        const isMatch = selectedLeft.dataset.pairId === selectedRight.dataset.pairId;
        if (isMatch) {
          selectedLeft.classList.remove("selected");
          selectedRight.classList.remove("selected");
          selectedLeft.classList.add("matched");
          selectedRight.classList.add("matched");
          selectedLeft.disabled = true;
          selectedRight.disabled = true;
          matchedCount++;
          score += 5;
          quizScoreLabel.textContent = score;
          showFeedback("配对正确！+5 分", true);

          selectedLeft = null;
          selectedRight = null;

          if (matchedCount === q.pairs.length) {
            currentQuestionSolved = true;
            showFeedback("全部配对完成！本题得分 +" + q.pairs.length * 5, true);
            nextBtn.style.display = "inline-flex";
          }
        } else {
          showFeedback("配对不正确，再试试～", false);
          const wrongLeft = selectedLeft;
          const wrongRight = selectedRight;
          setTimeout(() => {
            wrongLeft.classList.remove("selected");
            wrongRight.classList.remove("selected");
          }, 400);
          selectedLeft = null;
          selectedRight = null;
        }
      }
    }

    quizBody.querySelectorAll(".match-item").forEach((el) => {
      el.addEventListener("click", () => handleSelect(el));
    });
  }

  // ---------- 7. 工具函数 ----------
  function shuffleArray(arr) {
    const copy = arr.slice();
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function showFeedback(text, isOk) {
    quizFeedback.textContent = text;
    quizFeedback.className = "quiz-feedback " + (isOk ? "ok" : "bad");
  }

  // ---------- 8. 结果页 ----------
  function renderResult() {
    quizIndexLabel.textContent = "已完成";
    quizProgressBar.style.width = "100%";
    quizFeedback.textContent = "";
    nextBtn.style.display = "none";

    const maxScore = QUESTIONS.reduce((sum, q) => {
      return sum + (q.type === "mc" ? 10 : q.pairs.length * 5);
    }, 0);

    quizBody.innerHTML = `
      <div class="quiz-result">
        <span class="quiz-type-tag">测验完成</span>
        <div class="quiz-question">你的最终成绩</div>
        <div class="score-big">${score} / ${maxScore}</div>
        <p style="color: var(--ink-soft); margin-bottom: 24px;">
          ${score === maxScore ? "太厉害了，满分通过！" : "继续加油，再挑战一次试试？"}
        </p>
        <button class="btn btn-primary" id="quiz-restart-btn">再测一次</button>
      </div>
    `;

    document.getElementById("quiz-restart-btn").addEventListener("click", function () {
      currentIndex = 0;
      score = 0;
      quizScoreLabel.textContent = "0";
      renderQuestion();
    });
  }

  // ---------- 9. 下一题按钮 ----------
  nextBtn.addEventListener("click", function () {
    if (!currentQuestionSolved) return;
    currentIndex++;
    if (currentIndex >= QUESTIONS.length) {
      renderResult();
    } else {
      renderQuestion();
    }
  });

  // ---------- 10. 初始化 ----------
  renderQuestion();
})();
