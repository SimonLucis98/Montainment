/**
 * common.js —— 全站公共脚本 · 自然大地风
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

  // ---------- 语言切换按钮（自然大地风） ----------
  function addLanguageToggle() {
    const navLinksContainer = document.querySelector(".nav-links");
    if (!navLinksContainer) {
      console.warn("未找到 .nav-links");
      return;
    }

    if (navLinksContainer.querySelector('.lang-toggle-container')) {
      return;
    }

    const langContainer = document.createElement('li');
    langContainer.className = 'lang-toggle-container';
    langContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 0px;
      margin-left: 12px;
      padding: 0;
      list-style: none;
    `;

    // EN 按钮
    const enBtn = document.createElement('button');
    enBtn.className = 'lang-btn';
    enBtn.setAttribute('data-lang', 'en');
    enBtn.textContent = 'EN';
    enBtn.style.cssText = `
      background: transparent;
      border: 2px solid rgba(138, 155, 122, 0.12);
      color: rgba(61, 58, 53, 0.7);
      padding: 6px 12px;
      border-radius: 30px 0 0 30px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      font-family: inherit;
      transition: 0.2s;
      letter-spacing: 0.3px;
    `;

    // 中文按钮
    const zhBtn = document.createElement('button');
    zhBtn.className = 'lang-btn';
    zhBtn.setAttribute('data-lang', 'zh');
    zhBtn.textContent = '中文';
    zhBtn.style.cssText = `
      background: transparent;
      border: 2px solid rgba(138, 155, 122, 0.12);
      border-left: none;
      color: rgba(61, 58, 53, 0.7);
      padding: 6px 12px;
      border-radius: 0 30px 30px 0;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      font-family: inherit;
      transition: 0.2s;
      letter-spacing: 0.3px;
    `;

    // 更新激活状态
    function updateLangButtons() {
      const currentLang = localStorage.getItem('lang') || 'en';
      [enBtn, zhBtn].forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        if (lang === currentLang) {
          btn.style.background = '#8a9b7a';
          btn.style.borderColor = '#8a9b7a';
          btn.style.color = '#ffffff';
        } else {
          btn.style.background = 'transparent';
          btn.style.borderColor = 'rgba(138, 155, 122, 0.12)';
          btn.style.color = 'rgba(61, 58, 53, 0.7)';
        }
      });
    }

    // 切换语言
    function setLang(lang) {
      localStorage.setItem('lang', lang);
      document.documentElement.lang = lang;
      updateLangButtons();
      if (window.i18n && typeof i18n.setLang === 'function') {
        i18n.setLang(lang);
      }
      if (typeof applyI18n === 'function') {
        applyI18n();
      }
      if (typeof loadGames === 'function') {
        loadGames();
      }
    }

    // 点击事件
    enBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      setLang('en');
    });

    zhBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      setLang('zh');
    });

    // 悬停效果
    [enBtn, zhBtn].forEach(btn => {
      btn.addEventListener('mouseenter', function() {
        if (!this.classList.contains('active')) {
          this.style.background = 'rgba(138, 155, 122, 0.06)';
          this.style.borderColor = 'rgba(138, 155, 122, 0.3)';
        }
      });
      btn.addEventListener('mouseleave', function() {
        const lang = this.getAttribute('data-lang');
        const currentLang = localStorage.getItem('lang') || 'en';
        if (lang !== currentLang) {
          this.style.background = 'transparent';
          this.style.borderColor = 'rgba(138, 155, 122, 0.12)';
        }
      });
    });

    langContainer.appendChild(enBtn);
    langContainer.appendChild(zhBtn);
    navLinksContainer.appendChild(langContainer);

    updateLangButtons();
    console.log("✅ 语言切换按钮已插入（自然大地风）");
  }

  addLanguageToggle();
});
