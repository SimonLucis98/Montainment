/**
 * common.js —— 全站公共脚本
 * 功能：
 * 1. 移动端汉堡菜单开关
 * 2. 根据当前页面路径，给导航栏对应链接添加 active 高亮
 * 3. 广告位组件的初始化（真实上线时，这里可以替换成
 *    广告平台 SDK 的初始化调用，例如 AdSense 的 (adsbygoogle = ...).push({})）
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

    // 点击导航链接后，在移动端自动收起菜单
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

  // ---------- 3. 广告位初始化（占位逻辑） ----------
  // 说明：目前只是在控制台记录一次"曝光"，方便你确认广告位在页面上正确渲染。
  // 接入真实广告平台时，把下面这段替换成对应平台的初始化代码即可，
  // HTML 结构（.ad-slot 容器）不需要改动。
  document.querySelectorAll(".ad-slot").forEach(function (slot, index) {
    const slotName = slot.getAttribute("data-ad-slot") || "slot-" + index;
    console.log("[Montainment 广告位] 已加载：" + slotName);
  });
});
