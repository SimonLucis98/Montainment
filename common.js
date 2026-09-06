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

  // ---------- 语言切换按钮（与导航链接样式一致） ----------
  function addLanguageToggle() {
    const navLinksContainer = document.querySelector(".nav-links");
    if (!navLinksContainer) return;
    if (navLinksContainer.querySelector('.lang-toggle-container')) return;

    const langContainer = document.createElement('li');
    langContainer.className = 'lang-toggle-container';
    langContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 4px;
      margin-left: 12px;
      padding: 0 4px;
    `;

    // EN 按钮 - 与导航链接颜色一致（白色）
    const enBtn = document.createElement('button');
    enBtn.className = 'lang-btn';
    enBtn.setAttribute('data-lang', 'en');
    enBtn.textContent = 'EN';
    enBtn.style.cssText = `
      background: transparent;
      border: none;
      color: #ffffff;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 15px;
      font-weight: 600;
      transition: 0.2s;
      font-family: inherit;
      letter-spacing: 0.3px;
    `;

    // 中文按钮 - 与导航链接颜色一致（白色）
    const zhBtn = document.createElement('button');
    zhBtn.className = 'lang-btn';
    zhBtn.setAttribute('data-lang', 'zh');
    zhBtn.textContent = '中文';
    zhBtn.style.cssText = `
      background: transparent;
      border: none;
      color: #ffffff;
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 15px;
      font-weight: 600;
      transition: 0.2s;
      font-family: inherit;
      letter-spacing: 0.3px;
    `;

    // 分隔符（小竖线）
    const divider = document.createElement('span');
    divider.textContent = '|';
    divider.style.cssText = `
      color: rgba(255,255,255,0.25);
      font-size: 16px;
      padding: 0 2px;
    `;

    // 更新激活状态（当前语言高亮）
    function updateLangButtons() {
      const currentLang = window.i18n ? i18n.currentLang : 'en';
      [enBtn, zhBtn].forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        if (lang === currentLang) {
          btn.style.color = '#ffffff';
          btn.style.background = 'rgba(255,255,255,0.12)';
        } else {
          btn.style.color = 'rgba(255,255,255,0.6)';
          btn.style.background = 'transparent';
        }
      });
    }

    // 点击切换
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
        this.style.background = 'rgba(255,255,255,0.08)';
      });
      btn.addEventListener('mouseleave', function() {
        const lang = this.getAttribute('data-lang');
        const currentLang = window.i18n ? i18n.currentLang : 'en';
        if (lang === currentLang) {
          this.style.background = 'rgba(255,255,255,0.12)';
          this.style.color = '#ffffff';
        } else {
          this.style.background = 'transparent';
          this.style.color = 'rgba(255,255,255,0.6)';
        }
      });
    });

    langContainer.appendChild(enBtn);
    langContainer.appendChild(divider);
    langContainer.appendChild(zhBtn);
    navLinksContainer.appendChild(langContainer);

    updateLangButtons();
  }

  // 加载语言切换
  if (window.i18n) {
    addLanguageToggle();
  } else {
    document.addEventListener('i18nLoaded', addLanguageToggle);
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
