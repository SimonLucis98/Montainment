/**
 * i18n.js —— 全站多语言支持（中/英）
 * 默认语言：英文
 * 使用方式：<span data-i18n="key">默认文字</span>
 */

const i18n = {
  currentLang: 'en',

  messages: {
    en: {
      // ===== 导航 =====
      'nav.home': 'Home',
      'nav.quiz': 'Language Quiz',
      'nav.game': 'Games',
      'nav.story': 'Story Workshop',

      // ===== 首页 =====
      'index.eyebrow': 'Learn + Play',
      'index.title': 'Turn learning into a fun adventure',
      'index.desc': 'At Montainment, you can take a language quiz, play a memory matching game, or let the story workshop create a personalized tale for you.',
      'index.quiz_btn': 'Start Quiz',
      'index.game_btn': 'Play a Game',
      'index.feature_quiz_title': 'Language Learning Quiz',
      'index.feature_quiz_desc': 'Word matching + multiple choice, learn vocabulary while playing with instant feedback.',
      'index.feature_game_title': 'Memory Matching Game',
      'index.feature_game_desc': 'Classic flip-card memory game, test your memory and challenge the fewest moves.',
      'index.feature_story_title': 'Story Workshop',
      'index.feature_story_desc': 'Enter a few keywords, choose a story style, and the workshop will find a story for you.',
      'index.feature_quiz_link': 'Go to Quiz →',
      'index.feature_game_link': 'Start Game →',
      'index.feature_story_link': 'Start Searching →',

      // ===== 测验页 =====
      'quiz.badge': 'Language Quiz',
      'quiz.title': '🌍 Select Language · Start Challenge',
      'quiz.desc': 'First select the language to learn, then the difficulty, and finally pick a paper.',
      'quiz.score': 'Score:',
      'quiz.next_btn': 'Next →',
      'quiz.select_language': '🌍 Select Language',
      'quiz.select_language_prompt': 'Which language do you want to learn?',
      'quiz.select_difficulty': 'Select Difficulty',
      'quiz.select_difficulty_prompt': 'Choose your level',
      'quiz.select_paper': 'Select Paper',
      'quiz.select_paper_prompt': 'Please select a paper',
      'quiz.coming_soon': 'Coming soon',
      'quiz.back_to_lang': 'Back to languages',
      'quiz.back_to_diff': 'Back to difficulty',
      'quiz.back_to_papers': 'Back to papers',
      'quiz.finish_paper': 'Finish Paper',
      'quiz.correct': '✅ Correct! +10 pts',
      'quiz.wrong': '❌ Wrong, correct answer is:',
      'quiz.explanation': 'Explanation:',
      'quiz.result_title': 'Paper Completed',
      'quiz.result_score': 'Your Final Score',
      'quiz.result_perfect': '🌟 Perfect score! Excellent!',
      'quiz.result_great': '💪 Great job! Keep it up!',
      'quiz.result_practice': '📖 Practice more, you\'ll get better!',
      'quiz.retry': 'Retry this paper',
      'quiz.back_to_papers_result': 'Back to papers',
      'quiz.no_data': 'No language data',
      'quiz.no_data_prompt': 'Please add languages in the admin panel and export JSON.',
      'quiz.loading_failed': 'Data loading failed',
      'quiz.loading_failed_prompt': 'Please ensure data/papers.json exists and is properly formatted.',

      // ===== 游戏大厅 =====
      'game.badge': '🎮 Game Hall',
      'game.title': 'Select Game · Start Challenge',
      'game.desc': 'Click on any game card to enter the standalone game page and enjoy the full ad experience!',
      'game.empty_title': 'No Games Available',
      'game.empty_desc': 'Please add games in the admin panel 🚧',
      'game.native_badge': 'Native Game',
      'game.h5_badge': 'H5 Game',
      'game.play_hint': 'Start Game →',

      // ===== 游戏独立页 =====
      'gameplay.back': '← Back to Game Hall',
      'gameplay.loading': '⏳ Loading game...',
      'gameplay.loading_spinner': 'Loading game...',
      'gameplay.error_title': 'Missing game parameter',
      'gameplay.error_desc': 'Please select a game from the game hall.',
      'gameplay.error_back': 'Back to Game Hall',
      'gameplay.not_found': 'Game not found',
      'gameplay.offline': 'This game is offline',
      'gameplay.script_error': 'Game script failed to expose initGame function',
      'gameplay.script_load_error': 'Script loading failed',
      'gameplay.unsupported': 'Unsupported game type',

      // ===== 故事列表 =====
      'story.title': '📚 Story Workshop',
      'story.desc': 'Select a novel to start reading',
      'story.empty_title': 'No Novels Available',
      'story.empty_desc': 'Please add novels in the admin panel 🚧',
      'story.author_prefix': 'Author:',
      'story.unknown_author': 'Unknown Author',
      'story.no_desc': '📝 No description available',
      'story.likes': '❤️',
      'story.chapters': 'chapters',
      'story.updated': '🕒',
      'story.unknown_time': 'Unknown',

      // ===== 小说阅读页 =====
      'storyread.back_to_list': '← Back to Novel List',
      'storyread.back_to_catalog': '← Back to Catalog',
      'storyread.author_prefix': 'Author:',
      'storyread.unknown_author': 'Unknown Author',
      'storyread.no_desc': '📝 No description available',
      'storyread.likes': '❤️',
      'storyread.chapters_label': 'chapters',
      'storyread.updated_prefix': '🕒 Updated on',
      'storyread.unknown_time': 'Unknown',
      'storyread.chapter_list': '📖 Chapter List',
      'storyread.chapters_count': 'chapters',
      'storyread.no_chapters': '📝 No chapters yet, please wait for updates',
      'storyread.empty_hero_title': 'Loading failed',
      'storyread.empty_hero_desc': 'Unable to load story data.',
      'storyread.back_to_list_link': 'Back to list',
      'storyread.loading_failed': 'Loading failed',
      'storyread.story_not_found': 'Story not found',
      'storyread.prev_chapter': 'Previous Chapter',
      'storyread.next_chapter': 'Next Chapter',
      'storyread.back_to_top': 'Back to top',

      // ===== 通用 =====
      'common.footer': '© 2026 Montainment · A static website that makes learning more fun',
      'common.lang_switch': 'EN',
    },

    zh: {
      // ===== 导航 =====
      'nav.home': '首页',
      'nav.quiz': '语言测验',
      'nav.game': '游戏',
      'nav.story': '故事工坊',

      // ===== 首页 =====
      'index.eyebrow': '学习 + 娱乐，两不耽误',
      'index.title': '把学习变成一场好玩的探险',
      'index.desc': '在 Montainment，你可以做一套语言小测验、玩一局记忆配对游戏，或者让故事工坊为你生成专属故事。',
      'index.quiz_btn': '开始测验',
      'index.game_btn': '玩个游戏',
      'index.feature_quiz_title': '语言学习测验',
      'index.feature_quiz_desc': '单词配对 + 选择题，边玩边巩固词汇量，答对还有即时反馈。',
      'index.feature_game_title': '记忆配对游戏',
      'index.feature_game_desc': '经典翻牌配对小游戏，考验你的记忆力，挑战最少步数通关。',
      'index.feature_story_title': '故事工坊',
      'index.feature_story_desc': '输入几个关键词，选一个故事风格，工坊就能为你生成一段属于你的故事。',
      'index.feature_quiz_link': '去测验 →',
      'index.feature_game_link': '开始游戏 →',
      'index.feature_story_link': '开始搜索 →',

      // ===== 测验页 =====
      'quiz.badge': '语言测验',
      'quiz.title': '🌍 选择语言 · 开始挑战',
      'quiz.desc': '先选择要学习的语言，再选择难度，最后挑选试卷。',
      'quiz.score': '得分：',
      'quiz.next_btn': '下一题 →',
      'quiz.select_language': '🌍 选择语言',
      'quiz.select_language_prompt': '你想学习哪种语言？',
      'quiz.select_difficulty': '选择难度',
      'quiz.select_difficulty_prompt': '选择难度等级',
      'quiz.select_paper': '选择试卷',
      'quiz.select_paper_prompt': '请选择一份试卷',
      'quiz.coming_soon': '即将上线',
      'quiz.back_to_lang': '返回选语言',
      'quiz.back_to_diff': '返回选难度',
      'quiz.back_to_papers': '返回试卷列表',
      'quiz.finish_paper': '完成试卷',
      'quiz.correct': '✅ 回答正确！ +10 分',
      'quiz.wrong': '❌ 答错了，正确答案是：',
      'quiz.explanation': '解析：',
      'quiz.result_title': '试卷完成',
      'quiz.result_score': '你的最终成绩',
      'quiz.result_perfect': '🌟 太厉害了，满分通过！',
      'quiz.result_great': '💪 很不错，继续加油！',
      'quiz.result_practice': '📖 再练练，你一定能更好！',
      'quiz.retry': '重做此卷',
      'quiz.back_to_papers_result': '返回试卷列表',
      'quiz.no_data': '暂无语言数据',
      'quiz.no_data_prompt': '请在后台添加语言并导出 JSON。',
      'quiz.loading_failed': '数据加载失败',
      'quiz.loading_failed_prompt': '请确保 data/papers.json 文件存在且格式正确。',

      // ===== 游戏大厅 =====
      'game.badge': '🎮 游戏大厅',
      'game.title': '选择游戏 · 开始挑战',
      'game.desc': '点击任意游戏卡片，进入独立游戏页面，享受完整广告体验！',
      'game.empty_title': '暂无游戏',
      'game.empty_desc': '请在后台添加游戏内容 🚧',
      'game.native_badge': '原生游戏',
      'game.h5_badge': 'H5 游戏',
      'game.play_hint': '开始游戏 →',

      // ===== 游戏独立页 =====
      'gameplay.back': '← 返回游戏大厅',
      'gameplay.loading': '⏳ 加载游戏中...',
      'gameplay.loading_spinner': '加载游戏中...',
      'gameplay.error_title': '缺少游戏参数',
      'gameplay.error_desc': '请从游戏大厅选择游戏进入。',
      'gameplay.error_back': '返回游戏大厅',
      'gameplay.not_found': '找不到游戏',
      'gameplay.offline': '该游戏已下架',
      'gameplay.script_error': '游戏脚本未正确暴露 initGame 函数',
      'gameplay.script_load_error': '脚本加载失败',
      'gameplay.unsupported': '不支持的遊戲類型',

      // ===== 故事列表 =====
      'story.title': '📚 故事工坊',
      'story.desc': '选择一部小说，开始阅读',
      'story.empty_title': '暂无小说',
      'story.empty_desc': '请在后台添加小说内容 🚧',
      'story.author_prefix': '作者：',
      'story.unknown_author': '未知作者',
      'story.no_desc': '📝 暂无简介',
      'story.likes': '❤️',
      'story.chapters': '章',
      'story.updated': '🕒',
      'story.unknown_time': '未知',

      // ===== 小说阅读页 =====
      'storyread.back_to_list': '← 返回小说列表',
      'storyread.back_to_catalog': '← 返回目录',
      'storyread.author_prefix': '作者：',
      'storyread.unknown_author': '未知作者',
      'storyread.no_desc': '📝 暂无简介',
      'storyread.likes': '❤️',
      'storyread.chapters_label': '章',
      'storyread.updated_prefix': '🕒 更新于',
      'storyread.unknown_time': '未知',
      'storyread.chapter_list': '📖 章节列表',
      'storyread.chapters_count': '章',
      'storyread.no_chapters': '📝 暂无章节，请等待更新',
      'storyread.empty_hero_title': '加载失败',
      'storyread.empty_hero_desc': '无法加载小说数据。',
      'storyread.back_to_list_link': '返回列表',
      'storyread.loading_failed': '加载失败',
      'storyread.story_not_found': '找不到该小说',
      'storyread.prev_chapter': '上一章',
      'storyread.next_chapter': '下一章',
      'storyread.back_to_top': '回到顶部',

      // ===== 通用 =====
      'common.footer': '© 2026 Montainment · 一个让学习更好玩的静态网站',
      'common.lang_switch': '中文',
    }
  },

  // -------- 获取文本 --------
  t(key) {
    return this.messages[this.currentLang]?.[key] || key;
  },

  // -------- 切换语言 --------
  setLang(lang) {
    if (!this.messages[lang]) return;
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.dispatchEvent(new CustomEvent('languageChanged'));
  },

  // -------- 初始化（从 localStorage 读取） --------
  init() {
    const saved = localStorage.getItem('lang');
    if (saved && this.messages[saved]) {
      this.currentLang = saved;
    } else {
      this.currentLang = 'en'; // 默认英文
    }
    document.documentElement.lang = this.currentLang;
  }
};

// -------- 应用语言到页面元素 --------
function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    el.textContent = i18n.t(key);
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    el.placeholder = i18n.t(key);
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    el.innerHTML = i18n.t(key);
  });
}

// -------- 更新语言切换按钮状态 --------
function updateLangToggle() {
  const btns = document.querySelectorAll('.lang-btn');
  btns.forEach(btn => {
    const lang = btn.getAttribute('data-lang');
    if (lang === i18n.currentLang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

// -------- 监听语言变化 --------
document.addEventListener('languageChanged', function() {
  applyI18n();
  updateLangToggle();
});

// -------- DOM 加载完成后执行 --------
document.addEventListener('DOMContentLoaded', function() {
  i18n.init();
  applyI18n();
  updateLangToggle();
});

// 暴露给全局
window.i18n = i18n;
window.applyI18n = applyI18n;
window.updateLangToggle = updateLangToggle;
