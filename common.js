/**
 * common.js —— 全站公共脚本
 * 功能：
 * 1. 移动端汉堡菜单开关
 * 2. 根据当前页面路径，给导航栏对应链接添加 active 高亮
 * 3. 广告位组件的初始化
 * 4. 语言切换按钮（新增）
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

  // ---------- 4. 语言切换按钮（新增） ----------
  const navBar = document.querySelector(".nav-bar");
  if (navBar) {
    // 检查是否已经存在语言切换按钮
    let existingToggle = navBar.querySelector('.lang-toggle-container');
    if (existingToggle) return;

    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'lang-toggle-container';
    toggleContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 4px;
      margin-left: 12px;
    `;

    // 英文按钮
    const enBtn = document.createElement('button');
    enBtn.className = 'lang-btn';
    enBtn.setAttribute('data-lang', 'en');
    enBtn.textContent = 'EN';
    enBtn.style.cssText = `
      background: transparent;
      border: none;
      color: rgba(255,255,255,0.6);
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      transition: 0.2s;
      font-family: inherit;
    `;

    // 中文按钮
    const zhBtn = document.createElement('button');
    zhBtn.className = 'lang-btn';
    zhBtn.setAttribute('data-lang', 'zh');
    zhBtn.textContent = '中文';
    zhBtn.style.cssText = `
      background: transparent;
      border: none;
      color: rgba(255,255,255,0.6);
      padding: 4px 8px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 600;
      transition: 0.2s;
      font-family: inherit;
    `;

    // 分隔符
    const divider = document.createElement('span');
    divider.textContent = '|';
    divider.style.cssText = `
      color: rgba(255,255,255,0.2);
      font-size: 13px;
    `;

    // 激活状态样式
    function updateLangButtons() {
      const currentLang = window.i18n ? i18n.currentLang : 'en';
      [enBtn, zhBtn].forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        if (lang === currentLang) {
          btn.style.color = '#fff';
          btn.style.background = 'rgba(255,255,255,0.12)';
        } else {
          btn.style.color = 'rgba(255,255,255,0.6)';
          btn.style.background = 'transparent';
        }
      });
    }

    // 点击事件
    enBtn.addEventListener('click', function() {
      if (window.i18n) {
        i18n.setLang('en');
        updateLangButtons();
        // 触发页面语言更新
        if (typeof applyI18n === 'function') {
          applyI18n();
        }
      }
    });

    zhBtn.addEventListener('click', function() {
      if (window.i18n) {
        i18n.setLang('zh');
        updateLangButtons();
        if (typeof applyI18n === 'function') {
          applyI18n();
        }
      }
    });

    // 鼠标悬停效果
    [enBtn, zhBtn].forEach(btn => {
      btn.addEventListener('mouseenter', function() {
        if (!this.classList.contains('active')) {
          this.style.color = '#fff';
        }
      });
      btn.addEventListener('mouseleave', function() {
        if (!this.classList.contains('active')) {
          const lang = this.getAttribute('data-lang');
          if (lang === i18n.currentLang) {
            this.style.color = '#fff';
          } else {
            this.style.color = 'rgba(255,255,255,0.6)';
          }
        }
      });
    });

    toggleContainer.appendChild(enBtn);
    toggleContainer.appendChild(divider);
    toggleContainer.appendChild(zhBtn);
    navBar.appendChild(toggleContainer);

    // 初始更新
    setTimeout(updateLangButtons, 100);
  }
});
