/**
 * common.js —— 全站公共脚本
 */
document.addEventListener("DOMContentLoaded", function () {
  // ---------- 移动端导航菜单 ----------
  const navToggle = document.querySelector(".nav-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (navToggle && navLinks) {
    navToggle.addEventListener("click", function () {
      navLinks.classList.toggle("open");
      const isOpen = navLinks.classList.contains("open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      navToggle.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("open");
        navToggle.textContent = "☰";
      });
    });
  }

  // ---------- 当前页面导航高亮 ----------
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });

  // ---------- 广告位 ----------
  document.querySelectorAll(".ad-slot").forEach(function (slot, index) {
    const slotName = slot.getAttribute("data-ad-slot") || "slot-" + index;
    console.log("[Montainment 广告位] 已加载：" + slotName);
  });

  // ---------- 语言切换按钮 ----------
  function addLanguageToggle() {
    const navLinksContainer = document.querySelector(".nav-links");
    if (!navLinksContainer) return;
    if (navLinksContainer.querySelector('.lang-toggle-container')) return;

    const langContainer = document.createElement('li');
    langContainer.className = 'lang-toggle-container';
    langContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 2px;
      margin-left: 12px;
      padding: 0 4px;
    `;

    // EN 按钮 - 白色文字，与导航链接一致
    const enBtn = document.createElement('button');
    enBtn.className = 'lang-btn';
    enBtn.setAttribute('data-lang', 'en');
    enBtn.textContent = 'EN';
    enBtn.style.cssText = `
      background: transparent;
      border: 1px solid rgba(255,255,255,0.25);
      color: #ffffff;
      padding: 4px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 15px;
      font-weight: 600;
      transition: 0.2s;
      font-family: inherit;
      letter-spacing: 0.3px;
      line-height: 1.4;
    `;

    // 中文按钮 - 白色文字，与导航链接一致
    const zhBtn = document.createElement('button');
    zhBtn.className = 'lang-btn';
    zhBtn.setAttribute('data-lang', 'zh');
    zhBtn.textContent = '中文';
    zhBtn.style.cssText = `
      background: transparent;
      border: 1px solid rgba(255,255,255,0.25);
      color: #ffffff;
      padding: 4px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 15px;
      font-weight: 600;
      transition: 0.2s;
      font-family: inherit;
      letter-spacing: 0.3px;
      line-height: 1.4;
    `;

    // 更新按钮状态（高亮当前语言）
    function updateLangButtons() {
      const currentLang = window.i18n ? i18n.currentLang : 'en';
      [enBtn, zhBtn].forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        if (lang === currentLang) {
          btn.style.background = 'rgba(255,255,255,0.15)';
          btn.style.borderColor = 'rgba(255,255,255,0.5)';
          btn.style.color = '#ffffff';
        } else {
          btn.style.background = 'transparent';
          btn.style.borderColor = 'rgba(255,255,255,0.2)';
          btn.style.color = 'rgba(255,255,255,0.7)';
        }
      });
    }

    // 点击切换语言
    enBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (window.i18n) {
        i18n.setLang('en');
        updateLangButtons();
        if (typeof applyI18n === 'function') applyI18n();
        if (typeof loadGames === 'function') loadGames();
      }
    });

    zhBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      if (window.i18n) {
        i18n.setLang('zh');
        updateLangButtons();
        if (typeof applyI18n === 'function') applyI18n();
        if (typeof loadGames === 'function') loadGames();
      }
    });

    // 悬停效果
    [enBtn, zhBtn].forEach(btn => {
      btn.addEventListener('mouseenter', function() {
        this.style.color = '#ffffff';
        this.style.borderColor = 'rgba(255,255,255,0.6)';
        this.style.background = 'rgba(255,255,255,0.08)';
      });
      btn.addEventListener('mouseleave', function() {
        const lang = this.getAttribute('data-lang');
        const currentLang = window.i18n ? i18n.currentLang : 'en';
        if (lang === currentLang) {
          this.style.background = 'rgba(255,255,255,0.15)';
          this.style.borderColor = 'rgba(255,255,255,0.5)';
          this.style.color = '#ffffff';
        } else {
          this.style.background = 'transparent';
          this.style.borderColor = 'rgba(255,255,255,0.2)';
          this.style.color = 'rgba(255,255,255,0.7)';
        }
      });
    });

    langContainer.appendChild(enBtn);
    langContainer.appendChild(zhBtn);
    navLinksContainer.appendChild(langContainer);

    // 立即更新按钮状态
    updateLangButtons();
  }

  // 尝试添加语言切换按钮
  if (window.i18n) {
    addLanguageToggle();
  } else {
    document.addEventListener('i18nLoaded', addLanguageToggle);
    // 兜底：如果 i18n 还没加载，等待后重试
    let retries = 0;
    const interval = setInterval(function() {
      if (window.i18n) {
        addLanguageToggle();
        clearInterval(interval);
      } else if (retries > 5) {
        clearInterval(interval);
      }
      retries++;
    }, 300);
  }
});
