/**
 * common.js —— 全站公共脚本
 * 功能：移动端菜单、导航高亮、广告位、语言切换
 */

document.addEventListener("DOMContentLoaded", function () {
  // ---------- 1. 移动端导航菜单 ----------
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

  // ---------- 2. 当前页面导航高亮 ----------
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (link) {
    const linkPage = link.getAttribute("href");
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });

  // ---------- 3. 广告位初始化 ----------
  document.querySelectorAll(".ad-slot").forEach(function (slot, index) {
    const slotName = slot.getAttribute("data-ad-slot") || "slot-" + index;
    console.log("[Montainment 广告位] 已加载：" + slotName);
  });

  // ---------- 4. 语言切换按钮 ----------
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

    // 英文按钮
    const enBtn = document.createElement('button');
    enBtn.className = 'lang-btn';
    enBtn.setAttribute('data-lang', 'en');
    enBtn.textContent = 'EN';
    enBtn.style.cssText = `
      background: transparent;
      border: 1px solid rgba(255,255,255,0.2);
      color: #ffffff;
      padding: 2px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 700;
      transition: 0.2s;
      font-family: inherit;
      letter-spacing: 0.3px;
    `;

    // 中文按钮
    const zhBtn = document.createElement('button');
    zhBtn.className = 'lang-btn';
    zhBtn.setAttribute('data-lang', 'zh');
    zhBtn.textContent = '中文';
    zhBtn.style.cssText = `
      background: transparent;
      border: 1px solid rgba(255,255,255,0.2);
      color: #ffffff;
      padding: 2px 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 700;
      transition: 0.2s;
      font-family: inherit;
      letter-spacing: 0.3px;
    `;

    // 更新按钮状态（高亮当前语言）
    function updateLangButtons() {
      const currentLang = window.i18n ? i18n.currentLang : 'en';
      [enBtn, zhBtn].forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        if (lang === currentLang) {
          btn.style.background = 'rgba(255,255,255,0.2)';
          btn.style.borderColor = 'rgba(255,255,255,0.5)';
          btn.style.color = '#ffffff';
        } else {
          btn.style.background = 'transparent';
          btn.style.borderColor = 'rgba(255,255,255,0.2)';
          btn.style.color = 'rgba(255,255,255,0.6)';
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
        // 重新渲染游戏列表（如果在游戏大厅页面）
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
        this.style.borderColor = 'rgba(255,255,255,0.5)';
      });
      btn.addEventListener('mouseleave', function() {
        const lang = this.getAttribute('data-lang');
        const currentLang = window.i18n ? i18n.currentLang : 'en';
        if (lang !== currentLang) {
          this.style.color = 'rgba(255,255,255,0.6)';
          this.style.borderColor = 'rgba(255,255,255,0.2)';
        }
      });
    });

    langContainer.appendChild(enBtn);
    langContainer.appendChild(zhBtn);
    navLinksContainer.appendChild(langContainer);

    // 初始更新按钮状态
    setTimeout(updateLangButtons, 200);
  }

  // 等待 i18n 加载完成后再添加按钮
  if (window.i18n) {
    addLanguageToggle();
  } else {
    document.addEventListener('i18nLoaded', addLanguageToggle);
    // 兜底
    setTimeout(addLanguageToggle, 1000);
  }
});
