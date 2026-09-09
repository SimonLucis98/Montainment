/**
 * quiz.js —— 数据驱动 · 从 data/papers.json 加载类别 → 科目 → 难度 → 试卷 → 题目
 * 流程：选择类别 → 选择科目 → 选择难度 → 选择试卷 → 答题
 * 界面语言可切换（中文/English）
 * 
 * 🆕 SEO 增强：支持 URL 参数直接跳转到指定试卷
 * 用法：quiz.html?cat=lang&sub=JP&diff=1&paper=1
 * 
 * 🆕 广告友好：导航步骤（类别/科目/难度/试卷）整页跳转刷新广告，
 *   答题过程（题目切换/重做）保持无刷新，兼顾体验与收入。
 * 
 * 🆕 宽屏优化：做题页选项在电脑上变为两列，填满左右空白。
 * 
 * 🆕 语言持久化：用户选择的语言会保存在 localStorage，页面跳转后自动恢复。
 */
(function() {
  'use strict';

  // ========== 状态 ==========
  let allData = null;
  
  // ===== 🆕 从 localStorage 恢复语言偏好 =====
  let currentLang = localStorage.getItem('quiz_lang') || 'zh';
  
  let selectedCategoryId = null;
  let selectedSubjectId = null;
  let selectedDifficultyLevel = null;
  let currentPaperId = null;
  let currentIndex = 0;
  let score = 0;
  let currentQuestionSolved = false;
  let uiState = 'category'; // 'category' | 'subject' | 'difficulty' | 'paper' | 'quiz' | 'result'

  // ========== DOM 引用 ==========
  const quizBody = document.getElementById('quiz-body');
  const quizFeedback = document.getElementById('quiz-feedback');
  const quizIndexLabel = document.getElementById('quiz-index');
  const quizProgressBar = document.getElementById('quiz-progress-bar');
  const quizScoreLabel = document.getElementById('quiz-score');
  const nextBtn = document.getElementById('quiz-next-btn');

  if (!quizBody || !quizFeedback || !quizIndexLabel || !quizProgressBar || !quizScoreLabel || !nextBtn) {
    console.error('quiz.js: 缺少必要的 DOM 元素');
    return;
  }

  // ========== 工具函数 ==========
  function t(zh, en) {
    return currentLang === 'zh' ? zh : en;
  }

  function getCategory(id) {
    return allData.categories.find(c => c.id === id);
  }

  function getSubject(catId, subjectId) {
    const cat = getCategory(catId);
    return cat ? cat.subjects.find(s => s.id === subjectId) : null;
  }

  function getDifficulty(catId, subjectId, level) {
    const subj = getSubject(catId, subjectId);
    return subj ? subj.difficulties.find(d => d.level === level) : null;
  }

  function getPaper(catId, subjectId, level, paperId) {
    const diff = getDifficulty(catId, subjectId, level);
    return diff ? diff.papers.find(p => p.id === paperId) : null;
  }

  function getCurrentPaper() {
    if (!selectedCategoryId || !selectedSubjectId || selectedDifficultyLevel === null || !currentPaperId) return null;
    return getPaper(selectedCategoryId, selectedSubjectId, selectedDifficultyLevel, currentPaperId);
  }

  function getCurrentQuestion() {
    const paper = getCurrentPaper();
    return paper ? paper.questions[currentIndex] : null;
  }

  function updateScoreDisplay() {
    quizScoreLabel.textContent = score;
  }

  // ========== 🆕 URL 参数管理 ==========
  function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    return {
      cat: params.get('cat'),
      sub: params.get('sub'),
      diff: params.get('diff') !== null ? parseInt(params.get('diff'), 10) : null,
      paper: params.get('paper') !== null ? parseInt(params.get('paper'), 10) : null
    };
  }

  // ========== 🆕 核心：根据 uiState 决定跳转方式 ==========
  function updateUrl() {
    // 构建参数字符串
    const params = new URLSearchParams();
    if (selectedCategoryId) params.set('cat', selectedCategoryId);
    if (selectedSubjectId) params.set('sub', selectedSubjectId);
    if (selectedDifficultyLevel !== null) params.set('diff', selectedDifficultyLevel);
    if (currentPaperId) params.set('paper', currentPaperId);

    const queryString = params.toString();
    const newUrl = queryString ? `?${queryString}` : window.location.pathname;

    // 导航步骤（类别/科目/难度/试卷）→ 整页跳转刷新广告
    // 答题/结果页 → 无刷新（保持流畅）
    if (uiState === 'category' || uiState === 'subject' || uiState === 'difficulty' || uiState === 'paper') {
      window.location.href = newUrl;
    } else {
      // quiz / result 阶段，无刷新更新 URL（不触发广告刷新）
      window.history.replaceState({}, '', newUrl);
    }
  }

  // ========== 🆕 增强：从 URL 参数恢复状态（支持部分参数） ==========
  function tryLoadFromUrl() {
    const params = getUrlParams();
    if (!params.cat) return false;

    const cat = getCategory(params.cat);
    if (!cat) return false;
    selectedCategoryId = params.cat;

    if (!params.sub) {
      // 只有类别 → 进入科目选择
      renderSubjectSelection();
      return true;
    }

    const subj = getSubject(params.cat, params.sub);
    if (!subj) {
      renderSubjectSelection();
      return true;
    }
    selectedSubjectId = params.sub;

    if (params.diff === null) {
      // 有类别+科目，无难度 → 进入难度选择
      renderDifficultySelection();
      return true;
    }

    const diff = getDifficulty(params.cat, params.sub, params.diff);
    if (!diff) {
      renderDifficultySelection();
      return true;
    }
    selectedDifficultyLevel = params.diff;

    if (params.paper === null) {
      // 有类别+科目+难度，无试卷 → 进入试卷列表
      renderPaperSelection();
      return true;
    }

    const paper = getPaper(params.cat, params.sub, params.diff, params.paper);
    if (!paper) {
      renderPaperSelection();
      return true;
    }
    currentPaperId = params.paper;

    // 全部齐全 → 直接进入答题
    currentIndex = 0;
    score = 0;
    currentQuestionSolved = false;
    updateScoreDisplay();
    renderQuestion();
    return true;
  }

  // ========== 反馈 ==========
  function showFeedback(text, isOk, explanation) {
    quizFeedback.textContent = text;
    quizFeedback.className = 'quiz-feedback ' + (isOk ? 'ok' : 'bad');
    quizFeedback.style.borderLeft = isOk ? '4px solid #1f8b4c' : '4px solid #d14c4c';
    quizFeedback.style.background = isOk ? '#e6f7ee' : '#fdeeec';
    quizFeedback.style.color = isOk ? '#0f5a31' : '#9e2d2d';
    if (explanation) {
      const expl = document.createElement('div');
      expl.className = 'explanation';
      expl.style.fontWeight = '400';
      expl.style.fontSize = '14px';
      expl.style.opacity = '0.85';
      expl.style.marginTop = '6px';
      expl.style.paddingTop = '6px';
      expl.style.borderTop = '1px dashed rgba(0,0,0,0.08)';
      expl.innerHTML = '💡 <strong>' + t('解析：', 'Explanation: ') + '</strong>' + explanation;
      quizFeedback.appendChild(expl);
    }
  }

  // ========== 渲染：类别选择 ==========
  function renderCategorySelection() {
    uiState = 'category';
    selectedCategoryId = null;
    selectedSubjectId = null;
    selectedDifficultyLevel = null;
    currentPaperId = null;
    score = 0;
    updateScoreDisplay();
    quizFeedback.textContent = '';
    quizFeedback.className = 'quiz-feedback';
    nextBtn.style.display = 'none';
    quizProgressBar.style.width = '0%';
    quizIndexLabel.textContent = t('📂 选择类别', '📂 Select Category');

    // 清除 URL 参数（回到根状态）
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }

    if (!allData || !allData.categories || allData.categories.length === 0) {
      quizBody.innerHTML = `
        <div style="padding:30px; text-align:center; color:#6b7a8f;">
          <div style="font-size:48px;">📭</div>
          <h3>${t('暂无类别数据', 'No category data')}</h3>
          <p>${t('请在后台添加类别并导出 JSON。', 'Please add categories in the admin panel and export JSON.')}</p>
        </div>
      `;
      return;
    }

    let html = `
      <div style="margin-bottom:16px; font-weight:500; color:#6b7a8f; font-size:15px;">
        ${t('选择学习类别', 'Select a learning category')}
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px,1fr)); gap:14px;">
    `;
    allData.categories.forEach(cat => {
      const name = t(cat.nameZh, cat.nameEn);
      const hasData = cat.subjects && cat.subjects.length > 0;
      const disabledStyle = hasData ? '' : 'opacity:0.5; cursor:not-allowed;';
      html += `
        <div class="cat-card" data-cat="${cat.id}" style="background:#fafcff; border:2px solid #e6ecf3; border-radius:20px; padding:20px 10px; text-align:center; cursor:${hasData ? 'pointer' : 'default'}; transition:all 0.2s; box-shadow:0 2px 6px rgba(0,0,0,0.02); ${disabledStyle}">
          <div style="font-size:28px; font-weight:700; color:#2a6df4;">📂</div>
          <div style="font-weight:600; color:#0b1c33; margin-top:4px;">${name}</div>
          <div style="font-size:12px; color:#6b7a8f;">${hasData ? cat.subjects.length + ' ' + t('个科目', 'subjects') : t('即将上线', 'Coming soon')}</div>
        </div>
      `;
    });
    html += `</div>`;
    quizBody.innerHTML = html;

    document.querySelectorAll('.cat-card').forEach(card => {
      const catId = card.dataset.cat;
      const hasData = getCategory(catId)?.subjects?.length > 0;
      if (!hasData) return;
      card.addEventListener('click', function() {
        selectedCategoryId = catId;
        updateUrl(); // 整页跳转（广告刷新）
      });
      card.addEventListener('mouseenter', function() {
        if (!hasData) return;
        this.style.borderColor = '#b8c9e0';
        this.style.background = '#f2f6fd';
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 8px 24px rgba(0,20,40,0.08)';
      });
      card.addEventListener('mouseleave', function() {
        if (!hasData) return;
        this.style.borderColor = '#e6ecf3';
        this.style.background = '#fafcff';
        this.style.transform = 'none';
        this.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)';
      });
    });
  }

  // ========== 渲染：科目选择 ==========
  function renderSubjectSelection() {
    uiState = 'subject';
    selectedSubjectId = null;
    selectedDifficultyLevel = null;
    currentPaperId = null;
    score = 0;
    updateScoreDisplay();
    quizFeedback.textContent = '';
    quizFeedback.className = 'quiz-feedback';
    nextBtn.style.display = 'none';
    quizProgressBar.style.width = '0%';

    const cat = getCategory(selectedCategoryId);
    if (!cat) { renderCategorySelection(); return; }
    const catName = t(cat.nameZh, cat.nameEn);
    quizIndexLabel.textContent = `${catName} · ${t('选择科目', 'Select Subject')}`;

    let html = `
      <div style="margin-bottom:16px; font-weight:500; color:#6b7a8f; font-size:15px;">
        ${t('选择要学习的科目', 'Select the subject to learn')}
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px,1fr)); gap:14px;">
    `;
    cat.subjects.forEach(subj => {
      const label = t(subj.labelZh, subj.labelEn);
      const hasData = subj.difficulties && subj.difficulties.length > 0;
      const disabledStyle = hasData ? '' : 'opacity:0.5; cursor:not-allowed;';
      html += `
        <div class="subject-card" data-subj="${subj.id}" style="background:#fafcff; border:2px solid #e6ecf3; border-radius:20px; padding:16px 10px; text-align:center; cursor:${hasData ? 'pointer' : 'default'}; transition:all 0.2s; box-shadow:0 2px 6px rgba(0,0,0,0.02); ${disabledStyle}">
          <div style="font-size:32px; line-height:1.2;">${subj.emoji || '📚'}</div>
          <div style="font-weight:600; color:#0b1c33; margin-top:4px;">${label}</div>
          <div style="font-size:12px; color:#6b7a8f;">${hasData ? subj.difficulties.length + ' ' + t('个难度', 'levels') : t('即将上线', 'Coming soon')}</div>
        </div>
      `;
    });
    html += `</div>
      <div style="margin-top:16px;">
        <button class="btn btn-secondary" id="back-to-cat" style="display:inline-flex; align-items:center; gap:6px; padding:8px 20px; border:none; border-radius:40px; font-size:14px; font-weight:600; cursor:pointer; background:#eef2f7; color:#0b1c33;">← ${t('返回类别', 'Back to categories')}</button>
      </div>
    `;
    quizBody.innerHTML = html;

    document.querySelectorAll('.subject-card').forEach(card => {
      const subjId = card.dataset.subj;
      const hasData = getSubject(selectedCategoryId, subjId)?.difficulties?.length > 0;
      if (!hasData) return;
      card.addEventListener('click', function() {
        selectedSubjectId = subjId;
        updateUrl(); // 整页跳转
      });
      card.addEventListener('mouseenter', function() {
        if (!hasData) return;
        this.style.borderColor = '#b8c9e0';
        this.style.background = '#f2f6fd';
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 8px 24px rgba(0,20,40,0.08)';
      });
      card.addEventListener('mouseleave', function() {
        if (!hasData) return;
        this.style.borderColor = '#e6ecf3';
        this.style.background = '#fafcff';
        this.style.transform = 'none';
        this.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)';
      });
    });

    document.getElementById('back-to-cat').addEventListener('click', function() {
      renderCategorySelection();
    });
  }

  // ========== 渲染：难度选择 ==========
  function renderDifficultySelection() {
    uiState = 'difficulty';
    selectedDifficultyLevel = null;
    currentPaperId = null;
    score = 0;
    updateScoreDisplay();
    quizFeedback.textContent = '';
    quizFeedback.className = 'quiz-feedback';
    nextBtn.style.display = 'none';
    quizProgressBar.style.width = '0%';

    const subj = getSubject(selectedCategoryId, selectedSubjectId);
    if (!subj) { renderSubjectSelection(); return; }
    const cat = getCategory(selectedCategoryId);
    const catName = t(cat.nameZh, cat.nameEn);
    const subjLabel = t(subj.labelZh, subj.labelEn);
    quizIndexLabel.textContent = `${catName} · ${subjLabel} · ${t('选择难度', 'Select Difficulty')}`;

    const availableDiffs = subj.difficulties.map(d => d.level);

    let html = `
      <div style="margin-bottom:16px; font-weight:500; color:#6b7a8f; font-size:15px;">
        ${t('选择难度等级', 'Choose your level')}
        <span style="display:block; font-size:13px; margin-top:4px; color:#9aabbf;">
          ${t('已支持：', 'Available: ')} ${availableDiffs.join('、')}
        </span>
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px,1fr)); gap:14px;">
    `;
    for (let level = 0; level <= 5; level++) {
      const hasData = availableDiffs.includes(level);
      const diffObj = subj.difficulties.find(d => d.level === level);
      const label = diffObj ? t(diffObj.labelZh, diffObj.labelEn) : `${level}${t('级', '级')}`;
      const disabledStyle = hasData ? '' : 'opacity:0.5; cursor:not-allowed;';
      html += `
        <div class="diff-card" data-level="${level}" style="background:#fafcff; border:2px solid #e6ecf3; border-radius:20px; padding:16px 10px; text-align:center; cursor:${hasData ? 'pointer' : 'default'}; transition:all 0.2s; box-shadow:0 2px 6px rgba(0,0,0,0.02); ${disabledStyle}">
          <div style="font-size:22px; font-weight:700; color:#2a6df4;">${level}</div>
          <div style="font-weight:600; color:#0b1c33; font-size:14px; line-height:1.3;">${label}</div>
          ${!hasData ? `<div style="font-size:11px; color:#d14c4c; margin-top:4px;">${t('即将上线', 'Coming soon')}</div>` : ''}
        </div>
      `;
    }
    html += `</div>
      <div style="margin-top:16px;">
        <button class="btn btn-secondary" id="back-to-subj" style="display:inline-flex; align-items:center; gap:6px; padding:8px 20px; border:none; border-radius:40px; font-size:14px; font-weight:600; cursor:pointer; background:#eef2f7; color:#0b1c33;">← ${t('返回科目', 'Back to subjects')}</button>
      </div>
    `;
    quizBody.innerHTML = html;

    document.querySelectorAll('.diff-card').forEach(card => {
      const level = parseInt(card.dataset.level, 10);
      const hasData = availableDiffs.includes(level);
      if (!hasData) return;
      card.addEventListener('click', function() {
        selectedDifficultyLevel = level;
        updateUrl(); // 整页跳转
      });
      card.addEventListener('mouseenter', function() {
        if (!hasData) return;
        this.style.borderColor = '#b8c9e0';
        this.style.background = '#f2f6fd';
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 8px 24px rgba(0,20,40,0.08)';
      });
      card.addEventListener('mouseleave', function() {
        if (!hasData) return;
        this.style.borderColor = '#e6ecf3';
        this.style.background = '#fafcff';
        this.style.transform = 'none';
        this.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)';
      });
    });

    document.getElementById('back-to-subj').addEventListener('click', function() {
      renderSubjectSelection();
    });
  }

  // ========== 渲染：试卷列表 ==========
  function renderPaperSelection() {
    uiState = 'paper';
    currentPaperId = null;
    currentIndex = 0;
    score = 0;
    currentQuestionSolved = false;
    updateScoreDisplay();
    quizFeedback.textContent = '';
    quizFeedback.className = 'quiz-feedback';
    nextBtn.style.display = 'none';
    quizProgressBar.style.width = '0%';

    const subj = getSubject(selectedCategoryId, selectedSubjectId);
    if (!subj) { renderSubjectSelection(); return; }
    const diff = getDifficulty(selectedCategoryId, selectedSubjectId, selectedDifficultyLevel);
    if (!diff) { renderDifficultySelection(); return; }
    const cat = getCategory(selectedCategoryId);
    const catName = t(cat.nameZh, cat.nameEn);
    const subjLabel = t(subj.labelZh, subj.labelEn);
    const diffLabel = t(diff.labelZh, diff.labelEn);
    quizIndexLabel.textContent = `${catName} · ${subjLabel} · ${diffLabel} · ${t('选择试卷', 'Select Paper')}`;

    const papers = diff.papers;
    if (!papers || papers.length === 0) {
      quizBody.innerHTML = `
        <div style="padding:24px; text-align:center; color:#6b7a8f;">
          ${t('该组合暂无试卷，请返回重新选择。', 'No papers for this combination, please go back.')}
          <div style="margin-top:12px;">
            <button class="btn btn-secondary" id="back-to-diff" style="display:inline-flex; align-items:center; gap:6px; padding:8px 20px; border:none; border-radius:40px; font-size:14px; font-weight:600; cursor:pointer; background:#eef2f7; color:#0b1c33;">← ${t('返回选难度', 'Back to difficulty')}</button>
          </div>
        </div>
      `;
      document.getElementById('back-to-diff').addEventListener('click', function() {
        renderDifficultySelection();
      });
      return;
    }

    let html = `
      <div style="margin-bottom:16px; font-weight:500; color:#6b7a8f; font-size:15px;">
        ${t('请选择一份试卷', 'Please select a paper')}
      </div>
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px,1fr)); gap:16px;">
    `;
    papers.forEach(p => {
      const title = t(p.titleZh, p.titleEn);
      html += `
        <div class="paper-card" data-paper-id="${p.id}" style="background:#fafcff; border:2px solid #e6ecf3; border-radius:20px; padding:18px 12px 16px; text-align:center; cursor:pointer; transition:all 0.2s; box-shadow:0 2px 6px rgba(0,0,0,0.02);">
          <span style="font-size:28px; font-weight:800; color:#2a6df4; display:block; margin-bottom:4px;">${p.id}</span>
          <div style="font-weight:600; color:#0b1c33; font-size:15px; line-height:1.4;">${title}</div>
          <div style="font-size:13px; color:#6b7a8f; margin-top:4px;">${p.questions ? p.questions.length + ' ' + t('道选择题', 'MC questions') : ''}</div>
        </div>
      `;
    });
    html += `</div>
      <div style="margin-top:16px; display:flex; gap:10px; flex-wrap:wrap;">
        <button class="btn btn-secondary" id="back-to-diff-from-paper" style="display:inline-flex; align-items:center; gap:6px; padding:8px 20px; border:none; border-radius:40px; font-size:14px; font-weight:600; cursor:pointer; background:#eef2f7; color:#0b1c33;">← ${t('返回选难度', 'Back to difficulty')}</button>
        <button class="btn btn-secondary" id="back-to-subj-from-paper" style="display:inline-flex; align-items:center; gap:6px; padding:8px 20px; border:none; border-radius:40px; font-size:14px; font-weight:600; cursor:pointer; background:#eef2f7; color:#0b1c33;">← ${t('返回科目', 'Back to subjects')}</button>
      </div>
    `;
    quizBody.innerHTML = html;

    document.querySelectorAll('.paper-card').forEach(card => {
      card.addEventListener('click', function() {
        const id = parseInt(this.dataset.paperId, 10);
        currentPaperId = id;
        currentIndex = 0;
        score = 0;
        currentQuestionSolved = false;
        updateScoreDisplay();
        updateUrl(); // 导航步骤，整页跳转
      });
      card.addEventListener('mouseenter', function() {
        this.style.borderColor = '#b8c9e0';
        this.style.background = '#f2f6fd';
        this.style.transform = 'translateY(-3px)';
        this.style.boxShadow = '0 8px 24px rgba(0,20,40,0.08)';
      });
      card.addEventListener('mouseleave', function() {
        this.style.borderColor = '#e6ecf3';
        this.style.background = '#fafcff';
        this.style.transform = 'none';
        this.style.boxShadow = '0 2px 6px rgba(0,0,0,0.02)';
      });
    });

    document.getElementById('back-to-diff-from-paper').addEventListener('click', function() {
      renderDifficultySelection();
    });
    document.getElementById('back-to-subj-from-paper').addEventListener('click', function() {
      renderSubjectSelection();
    });
  }

  // ========== 渲染：题目 ==========
  function renderQuestion() {
    uiState = 'quiz';
    const paper = getCurrentPaper();
    if (!paper) { renderPaperSelection(); return; }

    currentQuestionSolved = false;
    quizFeedback.textContent = '';
    quizFeedback.className = 'quiz-feedback';
    nextBtn.style.display = 'none';

    const q = getCurrentQuestion();
    if (!q) { renderPaperSelection(); return; }

    const total = paper.questions.length;
    const paperTitle = t(paper.titleZh, paper.titleEn);
    quizIndexLabel.textContent = `${paperTitle} · ${t('第', 'Q')} ${currentIndex+1}/${total}`;
    quizProgressBar.style.width = ((currentIndex) / total * 100) + '%';

    renderMultipleChoice(q);
  }

  // ========== 选择题渲染 ==========
  function renderMultipleChoice(q) {
    const letters = ['A', 'B', 'C', 'D'];
    const questionText = t(q.q.zh, q.q.en);
    const options = t(q.opts.zh, q.opts.en);

    quizBody.innerHTML = `
      <span style="display:inline-block; background:#eef2f7; padding:2px 16px; border-radius:20px; font-size:12px; font-weight:600; color:#2c3e5c; letter-spacing:0.3px; align-self:flex-start; margin-bottom:4px;">
        ${t('选择题', 'Multiple Choice')}
      </span>
      <div style="font-size:18px; font-weight:600; color:#0b1c33; line-height:1.6; padding:4px 0 2px;">${questionText}</div>
      <div class="quiz-options-grid">
        ${options.map((opt, i) => `
          <button class="quiz-option" data-index="${i}" style="display:flex; align-items:center; gap:12px; padding:14px 18px; border:2px solid #e6ecf3; border-radius:16px; background:#fafcff; font-size:16px; font-weight:500; color:#0b1c33; cursor:pointer; transition:all 0.15s; text-align:left; font-family:inherit; line-height:1.4; width:100%;">
            <span style="display:inline-flex; align-items:center; justify-content:center; width:28px; height:28px; border-radius:50%; background:#e6ecf3; font-size:13px; font-weight:700; color:#2c3e5c; flex-shrink:0; transition:0.15s;">${letters[i]}</span>
            ${opt}
          </button>
        `).join('')}
      </div>
      <div style="margin-top:16px;">
        <button class="btn btn-secondary" id="back-to-papers-from-quiz" style="display:inline-flex; align-items:center; gap:6px; padding:8px 20px; border:none; border-radius:40px; font-size:14px; font-weight:600; cursor:pointer; background:#eef2f7; color:#0b1c33;">← ${t('返回试卷列表', 'Back to papers')}</button>
      </div>
    `;

    const optionButtons = quizBody.querySelectorAll('.quiz-option');
    optionButtons.forEach((btn) => {
      btn.addEventListener('click', function() {
        if (currentQuestionSolved) return;
        currentQuestionSolved = true;

        const chosenIndex = parseInt(this.dataset.index, 10);
        const isCorrect = chosenIndex === q.ans;

        optionButtons.forEach((b) => b.disabled = true);

        if (isCorrect) {
          this.classList.add('correct');
          this.style.borderColor = '#1f8b4c';
          this.style.background = '#e6f7ee';
          this.style.color = '#0f5a31';
          this.querySelector('span').style.background = '#1f8b4c';
          this.querySelector('span').style.color = '#fff';
          score += 10;
          updateScoreDisplay();
          showFeedback(
            t('✅ 回答正确！ +10 分', '✅ Correct! +10 pts'),
            true,
            t(q.exp.zh, q.exp.en)
          );
        } else {
          this.classList.add('wrong');
          this.style.borderColor = '#d14c4c';
          this.style.background = '#fdeeec';
          this.style.color = '#9e2d2d';
          this.querySelector('span').style.background = '#d14c4c';
          this.querySelector('span').style.color = '#fff';
          const correctBtn = optionButtons[q.ans];
          correctBtn.style.borderColor = '#1f8b4c';
          correctBtn.style.background = '#e6f7ee';
          correctBtn.style.color = '#0f5a31';
          correctBtn.querySelector('span').style.background = '#1f8b4c';
          correctBtn.querySelector('span').style.color = '#fff';
          const correctText = t(q.opts.zh, q.opts.en)[q.ans];
          showFeedback(
            t('❌ 答错了，正确答案是：', '❌ Wrong, correct answer is: ') + correctText,
            false,
            t(q.exp.zh, q.exp.en)
          );
        }

        const total = getCurrentPaper().questions.length;
        nextBtn.style.display = 'inline-flex';
        nextBtn.textContent = (currentIndex === total - 1) ? t('完成试卷', 'Finish Paper') : t('下一题', 'Next');
      });

      btn.addEventListener('mouseenter', function() {
        if (!this.disabled) {
          this.style.borderColor = '#b8c9e0';
          this.style.background = '#f2f6fd';
        }
      });
      btn.addEventListener('mouseleave', function() {
        if (!this.disabled) {
          this.style.borderColor = '#e6ecf3';
          this.style.background = '#fafcff';
        }
      });
    });

    document.getElementById('back-to-papers-from-quiz').addEventListener('click', function() {
      currentPaperId = null;
      uiState = 'paper';
      updateUrl();
    });
  }

  // ========== 结果页 ==========
  function renderResult() {
    uiState = 'result';
    const paper = getCurrentPaper();
    if (!paper) return;

    const total = paper.questions.length;
    const maxScore = total * 10;
    quizProgressBar.style.width = '100%';
    quizFeedback.textContent = '';
    nextBtn.style.display = 'none';
    quizIndexLabel.textContent = t('🎉 完成！', '🎉 Completed!');

    let msg = '';
    if (score === maxScore) msg = t('🌟 太厉害了，满分通过！', '🌟 Perfect score! Excellent!');
    else if (score >= maxScore * 0.7) msg = t('💪 很不错，继续加油！', '💪 Great job! Keep it up!');
    else msg = t('📖 再练练，你一定能更好！', '📖 Practice more, you\'ll get better!');

    quizBody.innerHTML = `
      <div class="quiz-result" style="display:flex; flex-direction:column; align-items:center; text-align:center; padding:12px 0 8px;">
        <span style="display:inline-block; background:#eef2f7; padding:2px 16px; border-radius:20px; font-size:12px; font-weight:600; color:#2c3e5c; letter-spacing:0.3px; align-self:flex-start; margin-bottom:4px;">
          ${t('试卷完成', 'Paper Completed')}
        </span>
        <div style="font-size:18px; font-weight:600; color:#0b1c33; margin-top:6px;">${t('你的最终成绩', 'Your Final Score')}</div>
        <div style="font-size:56px; font-weight:800; color:#0b1c33; letter-spacing:-0.02em; margin:12px 0 4px;">${score} <span style="font-size:24px; font-weight:500; color:#6b7a8f;">/ ${maxScore}</span></div>
        <p style="color:#6b7a8f; margin-bottom:24px; font-size:16px;">${msg}</p>
        <div style="display:flex; gap:12px; flex-wrap:wrap; justify-content:center;">
          <button class="btn btn-outline" id="retry-paper-btn" style="display:inline-flex; align-items:center; justify-content:center; padding:10px 28px; border:2px solid #dce4ef; border-radius:40px; font-size:15px; font-weight:600; font-family:inherit; cursor:pointer; transition:all 0.2s; background:transparent; color:#0b1c33; gap:6px;">🔄 ${t('重做此卷', 'Retry this paper')}</button>
          <button class="btn btn-secondary" id="back-to-papers-from-result" style="display:inline-flex; align-items:center; justify-content:center; padding:10px 28px; border:none; border-radius:40px; font-size:15px; font-weight:600; font-family:inherit; cursor:pointer; transition:all 0.2s; background:#eef2f7; color:#0b1c33; gap:6px;">📋 ${t('返回试卷列表', 'Back to papers')}</button>
        </div>
      </div>
    `;

    document.getElementById('retry-paper-btn').addEventListener('click', function() {
      score = 0;
      currentIndex = 0;
      currentQuestionSolved = false;
      updateScoreDisplay();
      renderQuestion();
    });

    document.getElementById('back-to-papers-from-result').addEventListener('click', function() {
      currentPaperId = null;
      uiState = 'paper';
      updateUrl();
    });
  }

  // ========== 下一题按钮 ==========
  nextBtn.addEventListener('click', function() {
    if (!currentQuestionSolved) return;
    const paper = getCurrentPaper();
    if (!paper) return;
    if (currentIndex + 1 < paper.questions.length) {
      currentIndex++;
      renderQuestion();
    } else {
      renderResult();
    }
  });

  // ========== 🆕 界面语言切换（持久化到 localStorage） ==========
  function createLangToggle() {
    const placeholder = document.getElementById('lang-toggle-placeholder');
    if (!placeholder) return;
    const toggle = document.createElement('div');
    toggle.className = 'lang-toggle';
    toggle.style.cssText = 'display:flex; background:#eef2f7; border-radius:40px; padding:3px; gap:2px; margin-bottom:16px;';
    toggle.innerHTML = `
      <button class="lang-btn" data-lang="zh" style="border:none; background:transparent; padding:6px 18px; border-radius:30px; font-size:14px; font-weight:600; color:#6b7a8f; cursor:pointer; font-family:inherit; transition:all 0.2s;">中文</button>
      <button class="lang-btn" data-lang="en" style="border:none; background:transparent; padding:6px 18px; border-radius:30px; font-size:14px; font-weight:600; color:#6b7a8f; cursor:pointer; font-family:inherit; transition:all 0.2s;">English</button>
    `;
    placeholder.appendChild(toggle);

    function setActive(lang) {
      toggle.querySelectorAll('.lang-btn').forEach(b => {
        const isActive = b.dataset.lang === lang;
        b.classList.toggle('active', isActive);
        if (isActive) {
          b.style.background = '#ffffff';
          b.style.color = '#0b1c33';
          b.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)';
        } else {
          b.style.background = 'transparent';
          b.style.color = '#6b7a8f';
          b.style.boxShadow = 'none';
        }
      });
    }

    // 🆕 恢复保存的语言
    setActive(currentLang);

    toggle.addEventListener('click', function(e) {
      const btn = e.target.closest('.lang-btn');
      if (!btn) return;
      const lang = btn.dataset.lang;
      if (lang === currentLang) return;
      
      // 🆕 保存到 localStorage
      currentLang = lang;
      localStorage.setItem('quiz_lang', lang);
      setActive(lang);
      
      // 重新渲染当前界面
      switch (uiState) {
        case 'category': renderCategorySelection(); break;
        case 'subject': renderSubjectSelection(); break;
        case 'difficulty': renderDifficultySelection(); break;
        case 'paper': renderPaperSelection(); break;
        case 'quiz': renderQuestion(); break;
        case 'result': renderResult(); break;
        default: renderCategorySelection();
      }
    });
  }

  // ========== 加载数据并初始化 ==========
  function loadData() {
    fetch('data/papers.json')
      .then(res => {
        if (!res.ok) throw new Error('数据加载失败，请确保 data/papers.json 存在');
        return res.json();
      })
      .then(data => {
        allData = data;
        createLangToggle();

        // 尝试从 URL 参数恢复状态
        const loadedFromUrl = tryLoadFromUrl();

        // 如果没有从 URL 加载成功，显示类别选择
        if (!loadedFromUrl) {
          renderCategorySelection();
        }
      })
      .catch(err => {
        console.error('加载数据出错:', err);
        allData = { categories: [] };
        quizBody.innerHTML = `
          <div style="padding:40px; text-align:center; color:#d14c4c;">
            <div style="font-size:48px; margin-bottom:16px;">⚠️</div>
            <h3>数据加载失败</h3>
            <p style="color:#6b7a8f; margin-top:8px;">请确保 data/papers.json 文件存在且格式正确。</p>
            <p style="color:#6b7a8f; font-size:14px;">${err.message}</p>
          </div>
        `;
        createLangToggle();
      });
  }

  // 启动
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadData);
  } else {
    loadData();
  }

})();
