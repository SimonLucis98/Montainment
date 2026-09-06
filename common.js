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
  // 查找导航栏中的 ul.nav-links
  const navLinksContainer = document.querySelector(".nav-links");
  if (navLinksContainer) {
    // 检查是否已经存在语言切换按钮，避免重复添加
    if (navLinksContainer.querySelector('.lang-toggle-container')) return;

    // 创建语言切换容器（放在 nav-links 的末尾）
    const langContainer = document.createElement('li');
    langContainer.className = 'lang-toggle-container';
    langContainer.style.cssText = `
      display: flex;
      align-items: center;
      gap: 4px;
      margin-left: 8px;
      padding: 0 4px;
    `;

    // 英文按钮
enBtn.style.cssText = `
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.85);
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 600;
  transition: 0.2s;
  font-family: inherit;
`;

// 中文按钮同样修改
zhBtn.style.cssText = `
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.85);
  padding: 4px 10px;
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
      color: rgba(255,255,255,0.15);
      font-size: 14px;
    `;

    // 更新按钮状态（高亮当前语言）
    function updateLangButtons() {
      const currentLang = window.i18n ? i18n.currentLang : 'en';
      [enBtn, zhBtn].forEach(btn => {
        const lang = btn.getAttribute('data-lang');
        if (lang === currentLang) {
          btn.style.color = '#fff';
          btn.style.background = 'rgba(255,255,255,0.12)';
        } else {
          btn.style.color = 'rgba(255,255,255,0.5)';
          btn.style.background = 'transparent';
        }
      });
    }

    // 点击切换
    enBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (window.i18n) {
        i18n.setLang('en');
        updateLangButtons();
        if (typeof applyI18n === 'function') applyI18n();
      }
    });

    zhBtn.addEventListener('click', function(e) {
      e.preventDefault();
      if (window.i18n) {
        i18n.setLang('zh');
        updateLangButtons();
        if (typeof applyI18n === 'function') applyI18n();
      }
    });

    // 悬停效果
    [enBtn, zhBtn].forEach(btn => {
      btn.addEventListener('mouseenter', function() {
        const lang = this.getAttribute('data-lang');
        if (lang !== (window.i18n ? i18n.currentLang : 'en')) {
          this.style.color = '#fff';
        }
      });
      btn.addEventListener('mouseleave', function() {
        const lang = this.getAttribute('data-lang');
        const currentLang = window.i18n ? i18n.currentLang : 'en';
        if (lang !== currentLang) {
          this.style.color = 'rgba(255,255,255,0.5)';
        }
      });
    });

    // 组装
    langContainer.appendChild(enBtn);
    langContainer.appendChild(divider);
    langContainer.appendChild(zhBtn);
    navLinksContainer.appendChild(langContainer);

    // 初始更新按钮状态
    setTimeout(updateLangButtons, 150);
  }
});
