/* Bugs & Lola: Carrot Crazy - Web Mini */
(function () {
  'use strict';

  const gameHTML = `<!doctype html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Bugs & Lola: Carrot Crazy - Mini</title>
<style>
  * { box-sizing: border-box; user-select: none; }
  body {
    min-height: 100vh;
    margin: 0;
    background: #1a1a1a;
    display: grid;
    place-items: center;
    font-family: 'Segoe UI', system-ui, sans-serif;
  }
  canvas {
    display: block;
    background: #87ceeb;
    border-radius: 12px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  }
</style>
</head>
<body>
<canvas id="c" width="800" height="480"></canvas>
<script>
(function() {
  var canvas = document.getElementById('c');
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;

  // ==================== 世界 ====================
  var worldWidth = 2400;

  var platforms = [
    { x: 0, y: 440, w: 2400, h: 40 },
    { x: 300, y: 360, w: 120, h: 20 },
    { x: 500, y: 280, w: 120, h: 20 },
    { x: 700, y: 360, w: 150, h: 20 },
    { x: 950, y: 320, w: 100, h: 20 },
    { x: 1150, y: 240, w: 100, h: 20 },
    { x: 1350, y: 360, w: 150, h: 20 },
    { x: 1600, y: 300, w: 100, h: 20 },
    { x: 1800, y: 240, w: 120, h: 20 },
    { x: 2000, y: 360, w: 120, h: 20 }
  ];

  var carrots = [
    { x: 150, y: 416 }, { x: 800, y: 416 }, { x: 1300, y: 416 }, { x: 1700, y: 416 },
    { x: 340, y: 336 }, { x: 540, y: 256 }, { x: 760, y: 336 },
    { x: 990, y: 296 }, { x: 1190, y: 216 }, { x: 1420, y: 336 },
    { x: 1650, y: 276 }, { x: 1850, y: 216 }, { x: 2050, y: 336 }
  ];

  var goalX = 2280, goalY = 380;

  // ==================== 常量 ====================
  var GRAVITY = 0.7;
  var MOVE_SPEED = 4.5;
  var JUMP_POWER = -13.5;
  var MAX_FALL = 15;
  var LOLA_FLOAT = 3;

  // ==================== 状态 ====================
  var player = {
    x: 50, y: 400, w: 32, h: 40,
    vx: 0, vy: 0,
    onGround: false,
    character: 'bugs',
    facing: 1
  };
  var camera = { x: 0 };
  var score = 0;
  var totalCarrots = carrots.length;
  var win = false;
  var switchFlash = 0;
  var keys = {};

  // ==================== 输入 ====================
  document.addEventListener('keydown', function(e) {
    keys[e.key] = true;
    if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.key) !== -1) {
      e.preventDefault();
    }
    if (e.key === 'e' || e.key === 'E') {
      player.character = player.character === 'bugs' ? 'lola' : 'bugs';
      switchFlash = 15;
    }
  });
  document.addEventListener('keyup', function(e) {
    keys[e.key] = false;
  });

  // ==================== 工具 ====================
  function aabb(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x &&
           a.y < b.y + b.h && a.y + a.h > b.y;
  }

  // ==================== 更新 ====================
  function update() {
    if (win) return;
    if (switchFlash > 0) switchFlash--;

    // 水平输入
    player.vx = 0;
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) { player.vx = -MOVE_SPEED; player.facing = -1; }
    if (keys['ArrowRight'] || keys['d'] || keys['D']) { player.vx = MOVE_SPEED; player.facing = 1; }

    // 跳跃
    var jumpPressed = keys['ArrowUp'] || keys['w'] || keys['W'] || keys[' '];
    if (jumpPressed && player.onGround) {
      player.vy = JUMP_POWER;
      player.onGround = false;
    }

    // 重力
    player.vy += GRAVITY;

    // Lola 飘浮
    if (player.character === 'lola' && player.vy > 0 && jumpPressed) {
      if (player.vy > LOLA_FLOAT) player.vy = LOLA_FLOAT;
    }

    if (player.vy > MAX_FALL) player.vy = MAX_FALL;

    // X 轴移动 + 碰撞
    player.x += player.vx;
    for (var i = 0; i < platforms.length; i++) {
      var p = platforms[i];
      if (aabb(player, p)) {
        if (player.vx > 0) player.x = p.x - player.w;
        else if (player.vx < 0) player.x = p.x + p.w;
      }
    }

    // Y 轴移动 + 碰撞
    player.onGround = false;
    player.y += player.vy;
    for (var j = 0; j < platforms.length; j++) {
      var q = platforms[j];
      if (aabb(player, q)) {
        if (player.vy > 0) {
          player.y = q.y - player.h;
          player.vy = 0;
          player.onGround = true;
        } else if (player.vy < 0) {
          player.y = q.y + q.h;
          player.vy = 0;
        }
      }
    }

    // 边界
    if (player.x < 0) player.x = 0;
    if (player.x + player.w > worldWidth) player.x = worldWidth - player.w;

    // 掉出世界
    if (player.y > H + 200) {
      player.x = 50;
      player.y = 400;
      player.vy = 0;
    }

    // 收集胡萝卜
    for (var k = carrots.length - 1; k >= 0; k--) {
      var c = carrots[k];
      if (aabb(player, { x: c.x, y: c.y, w: 24, h: 24 })) {
        carrots.splice(k, 1);
        score += 10;
      }
    }

    // 胜利
    if (player.x + player.w > goalX) {
      win = true;
    }

    // 相机
    camera.x = player.x + player.w / 2 - W / 2;
    if (camera.x < 0) camera.x = 0;
    if (camera.x > worldWidth - W) camera.x = worldWidth - W;
  }

  // ==================== 绘制 ====================
  if (!CanvasRenderingContext2D.prototype.roundRect) {
    CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
      if (r > w / 2) r = w / 2;
      if (r > h / 2) r = h / 2;
      this.moveTo(x + r, y);
      this.lineTo(x + w - r, y);
      this.quadraticCurveTo(x + w, y, x + w, y + r);
      this.lineTo(x + w, y + h - r);
      this.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
      this.lineTo(x + r, y + h);
      this.quadraticCurveTo(x, y + h, x, y + h - r);
      this.lineTo(x, y + r);
      this.quadraticCurveTo(x, y, x + r, y);
      this.closePath();
      return this;
    };
  }

  function drawCarrot(x, y) {
    ctx.fillStyle = '#4caf50';
    ctx.beginPath();
    ctx.moveTo(x + 12, y - 4);
    ctx.lineTo(x + 6, y + 4);
    ctx.lineTo(x + 18, y + 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ff8800';
    ctx.beginPath();
    ctx.moveTo(x + 2, y + 4);
    ctx.lineTo(x + 22, y + 4);
    ctx.lineTo(x + 12, y + 24);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(x + 6, y + 8, 3, 8);
  }

  function drawPlayer() {
    var p = player;
    // 阴影
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.beginPath();
    ctx.ellipse(p.x + p.w / 2, p.y + p.h + 2, p.w / 2, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    var isBugs = p.character === 'bugs';
    var bodyColor = isBugs ? '#a8a8a8' : '#f4c2d8';
    var earColor = isBugs ? '#8a8a8a' : '#e8a8c0';
    var earInner = isBugs ? '#f0c8d8' : '#ffe0ec';

    // 耳朵
    ctx.fillStyle = earColor;
    ctx.beginPath();
    ctx.ellipse(p.x + 8, p.y - 12, 4, 14, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(p.x + 24, p.y - 12, 4, 14, 0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = earInner;
    ctx.beginPath();
    ctx.ellipse(p.x + 8, p.y - 12, 2, 10, -0.15, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(p.x + 24, p.y - 12, 2, 10, 0.15, 0, Math.PI * 2);
    ctx.fill();

    // 身体
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.roundRect(p.x, p.y, p.w, p.h, 10);
    ctx.fill();

    // 腹部
    ctx.fillStyle = isBugs ? '#e0e0e0' : '#ffe8f0';
    ctx.beginPath();
    ctx.roundRect(p.x + 6, p.y + 18, p.w - 12, p.h - 22, 6);
    ctx.fill();

    // 眼睛
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(p.x + 11, p.y + 14, 5, 0, Math.PI * 2);
    ctx.arc(p.x + 21, p.y + 14, 5, 0, Math.PI * 2);
    ctx.fill();

    // 瞳孔
    ctx.fillStyle = '#1a1a1a';
    ctx.beginPath();
    ctx.arc(p.x + 11 + p.facing * 1.5, p.y + 14, 2.5, 0, Math.PI * 2);
    ctx.arc(p.x + 21 + p.facing * 1.5, p.y + 14, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 鼻子
    ctx.fillStyle = '#ff9999';
    ctx.beginPath();
    ctx.arc(p.x + 16, p.y + 21, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 胡须
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(p.x + 4, p.y + 21); ctx.lineTo(p.x - 4, p.y + 19);
    ctx.moveTo(p.x + 4, p.y + 23); ctx.lineTo(p.x - 4, p.y + 24);
    ctx.moveTo(p.x + 28, p.y + 21); ctx.lineTo(p.x + 36, p.y + 19);
    ctx.moveTo(p.x + 28, p.y + 23); ctx.lineTo(p.x + 36, p.y + 24);
    ctx.stroke();

    // 切换闪光
    if (switchFlash > 0) {
      ctx.strokeStyle = 'rgba(255,255,200,' + (switchFlash / 15) + ')';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x + p.w / 2, p.y + p.h / 2, 30 + (15 - switchFlash) * 2, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function drawGoal() {
    ctx.fillStyle = '#555';
    ctx.fillRect(goalX, goalY, 6, 100);
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.moveTo(goalX + 6, goalY);
    ctx.lineTo(goalX + 70, goalY + 18);
    ctx.lineTo(goalX + 6, goalY + 36);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px sans-serif';
    ctx.fillText('🏁', goalX + 18, goalY + 24);
  }

  function draw() {
    // 天空
    var sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#6fc5e8');
    sky.addColorStop(0.6, '#a8ddf0');
    sky.addColorStop(1, '#d4eef8');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // 远山
    ctx.save();
    ctx.translate(-camera.x * 0.3, 0);
    ctx.fillStyle = '#8bc99d';
    for (var i = 0; i < 6; i++) {
      var hx = i * 500;
      ctx.beginPath();
      ctx.arc(hx + 250, 380, 200, Math.PI, 0);
      ctx.fill();
    }
    ctx.restore();

    // 云
    ctx.save();
    ctx.translate(-camera.x * 0.5, 0);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    for (var ci = 0; ci < 8; ci++) {
      var cx = ci * 400 + 100;
      var cy = 60 + (ci % 3) * 30;
      ctx.beginPath();
      ctx.arc(cx, cy, 30, 0, Math.PI * 2);
      ctx.arc(cx + 35, cy - 8, 25, 0, Math.PI * 2);
      ctx.arc(cx + 60, cy + 5, 28, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();

    // 世界坐标
    ctx.save();
    ctx.translate(-camera.x, 0);

    // 平台
    for (var pi = 0; pi < platforms.length; pi++) {
      var p = platforms[pi];
      ctx.fillStyle = '#7cb342';
      ctx.fillRect(p.x, p.y, p.w, p.h);
      ctx.fillStyle = '#aed581';
      ctx.fillRect(p.x, p.y, p.w, 4);
      ctx.fillStyle = '#558b2f';
      ctx.fillRect(p.x, p.y + p.h - 4, p.w, 4);
      ctx.fillStyle = 'rgba(0,0,0,0.08)';
      for (var dx = 10; dx < p.w; dx += 30) {
        ctx.fillRect(p.x + dx, p.y + 8, 6, 3);
        ctx.fillRect(p.x + dx + 15, p.y + 14, 5, 3);
      }
    }

    // 胡萝卜
    for (var ki = 0; ki < carrots.length; ki++) {
      var c = carrots[ki];
      var bob = Math.sin(Date.now() / 400 + ki) * 3;
      drawCarrot(c.x, c.y + bob);
    }

    // 终点旗
    drawGoal();

    // 玩家
    drawPlayer();

    ctx.restore();

    // UI
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.beginPath();
    ctx.roundRect(15, 15, 270, 95, 15);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = 'bold 18px monospace';
    ctx.fillText('🥕 ' + score, 30, 45);

    ctx.fillStyle = player.character === 'bugs' ? '#c0c0c0' : '#f4a8c8';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('Character: ' + (player.character === 'bugs' ? 'Bugs 🐰' : 'Lola 🌸'), 30, 70);

    ctx.fillStyle = '#aaa';
    ctx.font = '11px monospace';
    ctx.fillText('← → / A D move · Space jump · E switch', 30, 90);

    // 胡萝卜计数
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.beginPath();
    ctx.roundRect(W - 155, 15, 140, 40, 15);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 14px monospace';
    ctx.fillText('🥕 ' + (totalCarrots - carrots.length) + '/' + totalCarrots, W - 140, 40);

    // 胜利画面
    if (win) {
      ctx.fillStyle = 'rgba(0,0,0,0.75)';
      ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 56px sans-serif';
      ctx.fillText('🎉 YOU WIN! 🎉', W / 2, H / 2 - 30);
      ctx.fillStyle = '#fff';
      ctx.font = '24px monospace';
      ctx.fillText('Final Score: ' + score, W / 2, H / 2 + 30);
      ctx.fillText('Carrots: ' + (totalCarrots - carrots.length) + '/' + totalCarrots, W / 2, H / 2 + 65);
      ctx.textAlign = 'left';
    }
  }

  // ==================== 主循环（固定 60fps 步进） ====================
  var lastTime = 0;
  var accumulator = 0;
  var STEP = 1000 / 60;

  function loop(t) {
    var delta = Math.min(t - lastTime, 100);
    lastTime = t;
    accumulator += delta;
    while (accumulator >= STEP) {
      update();
      accumulator -= STEP;
    }
    draw();
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(function(t) {
    lastTime = t;
    requestAnimationFrame(loop);
  });
})();
<\/script>
</body>
</html>`;

  // ========================= 暴露 initGame =========================
  window.initGame = function initGame(wrapper) {
    if (!wrapper || typeof wrapper.replaceChildren !== 'function') {
      throw new Error('initGame requires a container element.');
    }
    var frame = document.createElement('iframe');
    frame.title = 'Bugs & Lola: Carrot Crazy - Mini';
    frame.setAttribute('allow', 'autoplay; fullscreen');
    frame.style.cssText = 'display:block;width:100%;height:520px;border:0;border-radius:16px;background:#1a1a1a;overflow:hidden;';
    frame.srcdoc = gameHTML;
    wrapper.replaceChildren(frame);
    return frame;
  };
})();
