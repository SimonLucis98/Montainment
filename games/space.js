/* Space Impact · Classic (Stable Encapsulated Version) */
(function () {
  'use strict';

  const gameHTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Space Impact · Classic</title>
  <style>
    * { box-sizing: border-box; user-select: none; }
    body {
      min-height: 100vh;
      margin: 0;
      background: #0a0f14;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Courier New', monospace;
    }
    .game-wrapper {
      background: #141c22;
      padding: 2rem 2rem 1.8rem;
      border-radius: 3rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.06);
      text-align: center;
      position: relative;
    }
    canvas {
      display: block;
      margin: 0 auto;
      background: #0b1116;
      border-radius: 1.8rem;
      box-shadow: inset 0 0 0 2px #2a3a44, 0 12px 28px rgba(0,0,0,0.6);
      width: 500px;
      height: 400px;
    }
    .info-panel {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.2rem;
      padding: 0 0.3rem;
      color: #a0c0d0;
      font-size: 1.1rem;
      font-weight: 600;
      letter-spacing: 1px;
    }
    .info-panel span { color: #f7d44a; }
    .btn {
      background: #2a3a44;
      border: none;
      padding: 0.4rem 1.2rem;
      border-radius: 2rem;
      font-weight: 600;
      font-size: 0.9rem;
      color: #e3f0e8;
      cursor: pointer;
      transition: 0.2s;
      box-shadow: 0 4px 0 #0f171d, 0 4px 10px rgba(0,0,0,0.4);
      font-family: inherit;
    }
    .btn:hover { transform: translateY(-2px); background: #3a5662; }
    .btn:active { transform: translateY(4px); box-shadow: 0 1px 0 #0f171d; }
    .btn-restart { background: #c07a5a; color: #1a1f22; box-shadow: 0 4px 0 #7a4f3a; }
    .btn-restart:hover { background: #d68f6a; }

    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(8, 16, 22, 0.88);
      backdrop-filter: blur(6px);
      border-radius: 3rem;
      display: grid;
      place-items: center;
      z-index: 20;
      padding: 20px;
    }
    .overlay.hidden { display: none; }
    .start-card {
      background: #19262e;
      border: 2px solid #3a5a66;
      border-radius: 2rem;
      padding: 2rem 2.5rem;
      max-width: 420px;
      width: 100%;
      box-shadow: 0 20px 50px rgba(0,0,0,0.8);
      text-align: center;
      color: #d0e8f0;
    }
    .start-card h1 {
      font-size: 2.6rem;
      margin: 0 0 0.2rem;
      letter-spacing: 4px;
      color: #b4e0f0;
      text-shadow: 0 0 20px #3a8aaa;
    }
    .start-card h1 small {
      display: block;
      font-size: 0.8rem;
      color: #7a9aaa;
      letter-spacing: 6px;
      margin-top: 4px;
      text-shadow: none;
    }
    .start-card .rules {
      text-align: left;
      font-size: 0.9rem;
      line-height: 1.8;
      margin: 1.5rem 0;
      color: #b0c8d0;
    }
    .start-card .rules .key {
      display: inline-block;
      background: #0f1a20;
      padding: 0 0.6rem;
      border-radius: 0.3rem;
      border: 1px solid #4a6a7a;
      font-weight: 700;
      color: #d0e8f0;
    }
    .start-card .rules .badge {
      display: inline-block;
      background: #3a5a44;
      padding: 0 0.6rem;
      border-radius: 0.3rem;
      color: #b4f0c0;
      font-weight: 700;
    }
    .btn-play {
      background: #4a8aaa;
      border: none;
      padding: 0.7rem 2.8rem;
      border-radius: 3rem;
      font-weight: 700;
      font-size: 1.4rem;
      color: #0a1a22;
      box-shadow: 0 6px 0 #1a4a5a, 0 8px 20px rgba(0,0,0,0.4);
      cursor: pointer;
      transition: 0.15s;
      font-family: inherit;
      letter-spacing: 2px;
    }
    .btn-play:hover { transform: translateY(-2px); background: #5a9aba; }
    .btn-play:active { transform: translateY(4px); box-shadow: 0 2px 0 #1a4a5a; }
    @media (max-width: 540px) {
      .game-wrapper { padding: 0.8rem; border-radius: 1.5rem; }
      canvas { width: 100%; height: auto; aspect-ratio: 5/4; }
      .start-card { padding: 1.2rem; }
      .start-card h1 { font-size: 1.8rem; }
      .info-panel { font-size: 0.8rem; flex-wrap: wrap; gap: 0.5rem; justify-content: center; }
    }
  </style>
</head>
<body>
<div class="game-wrapper" id="gameWrapper">
  <canvas id="gameCanvas" width="500" height="400"></canvas>
  <div class="info-panel">
    <div>💥 SCORE <span id="scoreDisplay">0</span></div>
    <div>❤️ <span id="livesDisplay">3</span></div>
    <div>🎯 WAVE <span id="waveDisplay">1</span></div>
    <button class="btn btn-restart" id="restartBtn">↺ Restart</button>
  </div>

  <div class="overlay" id="overlay">
    <div class="start-card">
      <h1>🛸 SPACE <small>IMPACT · CLASSIC</small></h1>
      <div class="rules">
        <p><span class="badge">🎯 MISSION</span> Destroy all enemy ships and survive.</p>
        <p><span class="key">⬆ ⬇ ⬅ ➡</span> Move your ship</p>
        <p><span class="key">␣ SPACE</span> Fire your blaster</p>
        <p><span class="badge">⚠️ RULES</span><br>
        • Avoid enemy fire and collisions.<br>
        • Every <strong>10 kills</strong> → <strong>BOSS</strong> appears!<br>
        • Boss takes <strong>5 hits</strong> to defeat.<br>
        • Lose all lives → Game Over.</p>
      </div>
      <button class="btn-play" id="playBtn">▶ PLAY</button>
    </div>
  </div>
</div>

<script>
  (function() {
    // --- DOM refs ---
    var canvas = document.getElementById('gameCanvas');
    var ctx = canvas.getContext('2d');
    var scoreSpan = document.getElementById('scoreDisplay');
    var livesSpan = document.getElementById('livesDisplay');
    var waveSpan = document.getElementById('waveDisplay');
    var overlay = document.getElementById('overlay');
    var playBtn = document.getElementById('playBtn');
    var restartBtn = document.getElementById('restartBtn');

    var W = 500, H = 400;

    // --- Game state ---
    var player, bullets, enemies, enemyBullets, stars, particles, boss;
    var score, lives, wave, killCount, gameOver, gameStarted, paused;
    var keys = {};
    var animationId = null;
    var frameCounter = 0;
    var enemySpawnTimer = 0;
    var bossActive = false;
    var bossHitCount = 0;
    var BOSS_MAX_HP = 5;

    // --- Helpers ---
    function rand(min, max) { return Math.random() * (max - min) + min; }
    function randInt(min, max) { return Math.floor(rand(min, max + 1)); }
    function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
    function rectCollide(a, b) {
      return a.x < b.x + b.w && a.x + a.w > b.x &&
             a.y < b.y + b.h && a.y + a.h > b.y;
    }

    // --- Polyfill roundRect (if needed) ---
    if (!CanvasRenderingContext2D.prototype.roundRect) {
      CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
        if (r > w/2) r = w/2;
        if (r > h/2) r = h/2;
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

    // --- Particle ---
    function spawnParticles(x, y, color, count) {
      count = count || 15;
      for (var i = 0; i < count; i++) {
        var angle = rand(0, Math.PI * 2);
        var speed = rand(1, 5);
        particles.push({
          x: x, y: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1,
          size: rand(2, 5),
          color: color,
          life: randInt(20, 50)
        });
      }
    }

    // --- Initialize ---
    function initGame() {
      player = { x: 50, y: H/2 - 15, w: 30, h: 30, speed: 4, cooldown: 0, shootDelay: 10 };
      bullets = [];
      enemies = [];
      enemyBullets = [];
      stars = [];
      particles = [];
      boss = null;
      bossActive = false;
      bossHitCount = 0;
      score = 0;
      lives = 3;
      wave = 1;
      killCount = 0;
      gameOver = false;
      paused = false;
      frameCounter = 0;
      enemySpawnTimer = 0;
      scoreSpan.textContent = '0';
      livesSpan.textContent = '3';
      waveSpan.textContent = '1';

      // Init stars
      for (var i = 0; i < 120; i++) {
        stars.push({ x: rand(0, W), y: rand(0, H), size: rand(1, 3), speed: rand(0.5, 2.5) });
      }
    }

    // --- Spawning ---
    function spawnEnemy() {
      var baseSpeed = 0.8 + wave * 0.2;
      var type = Math.random() < 0.2 ? 'tank' : 'scout';
      var hp = type === 'tank' ? 3 : 1;
      var w = type === 'tank' ? 32 : 22;
      var h = type === 'tank' ? 30 : 22;
      enemies.push({
        x: W + 10,
        y: rand(20, H - 20),
        w: w,
        h: h,
        hp: hp,
        maxHp: hp,
        speed: baseSpeed * (type === 'tank' ? 0.7 : 1.2),
        type: type,
        phase: rand(0, Math.PI * 2),
        shootTimer: randInt(30, 100),
        color: type === 'tank' ? '#c07a5a' : '#5ac0a0'
      });
    }

    function spawnBoss() {
      boss = {
        x: W + 20,
        y: H/2 - 45,
        w: 70,
        h: 70,
        hp: BOSS_MAX_HP,
        maxHp: BOSS_MAX_HP,
        speed: 1.2 + wave * 0.1,
        phase: 0,
        shootTimer: 20,
        color: '#d04a6a',
        entryPhase: true
      };
      bossActive = true;
      bossHitCount = 0;
    }

    function shoot() {
      if (gameOver || !gameStarted || paused) return;
      if (player.cooldown > 0) return;
      bullets.push({
        x: player.x + player.w,
        y: player.y + player.h/2 - 3,
        w: 14,
        h: 6,
        speed: 7,
        damage: 1
      });
      player.cooldown = player.shootDelay;
    }

    function enemyShoot(e) {
      enemyBullets.push({
        x: e.x - 8,
        y: e.y + e.h/2 - 4,
        w: 10,
        h: 8,
        speed: 2.5 + wave * 0.2,
        angle: 0
      });
    }

    // --- Update ---
    function update() {
      if (gameOver || paused || !gameStarted) return;
      frameCounter++;

      // Player cooldown
      if (player.cooldown > 0) player.cooldown--;

      // Player movement
      if (keys['ArrowUp'] || keys['w']) player.y -= player.speed;
      if (keys['ArrowDown'] || keys['s']) player.y += player.speed;
      if (keys['ArrowLeft'] || keys['a']) player.x -= player.speed;
      if (keys['ArrowRight'] || keys['d']) player.x += player.speed;
      player.x = Math.max(5, Math.min(W - player.w - 5, player.x));
      player.y = Math.max(5, Math.min(H - player.h - 5, player.y));

      // Auto-fire with space (handled by keydown)

      // Update bullets
      for (var i = bullets.length - 1; i >= 0; i--) {
        var b = bullets[i];
        b.x += b.speed;
        if (b.x > W) { bullets.splice(i, 1); continue; }

        var removed = false;
        // Check vs enemies
        for (var j = enemies.length - 1; j >= 0; j--) {
          var e = enemies[j];
          if (rectCollide(b, e)) {
            e.hp -= b.damage;
            if (e.hp <= 0) {
              spawnParticles(e.x + e.w/2, e.y + e.h/2, e.color, 12);
              enemies.splice(j, 1);
              score += (e.type === 'tank' ? 3 : 1);
              killCount++;
              if (killCount % 10 === 0) {
                wave++;
                waveSpan.textContent = wave;
                spawnBoss();
              }
              scoreSpan.textContent = score;
            }
            bullets.splice(i, 1);
            removed = true;
            break;
          }
        }
        if (removed) continue;

        // Check vs boss
        if (boss && rectCollide(b, boss)) {
          boss.hp -= b.damage;
          spawnParticles(boss.x + boss.w/2, boss.y + boss.h/2, '#ffaa66', 8);
          if (boss.hp <= 0) {
            spawnParticles(boss.x + boss.w/2, boss.y + boss.h/2, '#ff4466', 40);
            score += 50;
            scoreSpan.textContent = score;
            boss = null;
            bossActive = false;
            killCount = 0;
          }
          bullets.splice(i, 1);
        }
      }

      // Update enemies
      var enemySpeedMult = 1 + (wave - 1) * 0.08;
      for (var i2 = enemies.length - 1; i2 >= 0; i2--) {
        var e2 = enemies[i2];
        e2.phase += 0.03;
        e2.x -= e2.speed * enemySpeedMult;
        e2.y += Math.sin(e2.phase) * 1.2;
        e2.y = Math.max(10, Math.min(H - e2.h - 10, e2.y));
        e2.shootTimer--;
        if (e2.shootTimer <= 0) {
          enemyShoot(e2);
          e2.shootTimer = randInt(40, 100) / (1 + wave * 0.1);
        }
        if (e2.x < -e2.w - 10) {
          enemies.splice(i2, 1);
          continue;
        }
        if (rectCollide(player, e2)) {
          playerHit();
          enemies.splice(i2, 1);
          continue;
        }
      }

      // Update boss
      if (boss) {
        boss.phase += 0.02;
        if (boss.entryPhase) {
          boss.x -= 1.5;
          if (boss.x < W - 120) boss.entryPhase = false;
        } else {
          boss.x = W - 120 + Math.sin(boss.phase) * 30;
          boss.y = H/2 - 35 + Math.sin(boss.phase * 0.7) * 80;
        }
        boss.shootTimer--;
        if (boss.shootTimer <= 0) {
          // 3-way spread
          for (var k = -1; k <= 1; k++) {
            enemyBullets.push({
              x: boss.x - 8,
              y: boss.y + boss.h/2 - 4 + k * 18,
              w: 12,
              h: 10,
              speed: 3 + wave * 0.15,
              angle: k * 0.3
            });
          }
          boss.shootTimer = 30 - Math.min(wave * 2, 15);
        }
        if (rectCollide(player, boss)) {
          playerHit();
        }
      }

      // Update enemy bullets
      for (var i3 = enemyBullets.length - 1; i3 >= 0; i3--) {
        var eb = enemyBullets[i3];
        eb.x -= eb.speed * (1 + wave * 0.05);
        if (eb.angle) eb.y += Math.sin(eb.angle) * 0.5;
        if (eb.x < -20) { enemyBullets.splice(i3, 1); continue; }
        if (rectCollide(player, eb)) {
          playerHit();
          enemyBullets.splice(i3, 1);
        }
      }

      // Stars
      for (var i4 = 0; i4 < stars.length; i4++) {
        var s = stars[i4];
        s.x -= s.speed * (1 + wave * 0.05);
        if (s.x < 0) { s.x = W; s.y = rand(0, H); }
      }

      // Particles
      for (var i5 = particles.length - 1; i5 >= 0; i5--) {
        var p = particles[i5];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05;
        p.life--;
        if (p.life <= 0) particles.splice(i5, 1);
      }

      // Spawn enemies
      if (!bossActive) {
        var spawnRate = Math.max(20, 55 - wave * 3);
        if (frameCounter % spawnRate === 0 && enemies.length < 8 + wave) {
          spawnEnemy();
        }
      }

      if (lives <= 0) {
        gameOver = true;
      }
    }

    function playerHit() {
      lives--;
      livesSpan.textContent = lives;
      spawnParticles(player.x + player.w/2, player.y + player.h/2, '#ff8844', 20);
      if (lives <= 0) {
        gameOver = true;
      } else {
        player.x = 50;
        player.y = H/2 - 15;
      }
    }

    // --- Draw ---
    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Stars
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        ctx.fillStyle = 'rgba(200, 230, 255, ' + (0.3 + Math.random() * 0.6) + ')';
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Player
      ctx.shadowColor = '#6ac0e0';
      ctx.shadowBlur = 15;
      ctx.fillStyle = '#6ac0e0';
      ctx.beginPath();
      ctx.moveTo(player.x + player.w, player.y + player.h/2);
      ctx.lineTo(player.x, player.y + 4);
      ctx.lineTo(player.x, player.y + player.h - 4);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#3a8aaa';
      ctx.shadowBlur = 5;
      ctx.beginPath();
      ctx.arc(player.x + 8, player.y + player.h/2, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Player bullets
      for (var i2 = 0; i2 < bullets.length; i2++) {
        var b = bullets[i2];
        ctx.fillStyle = '#88ffcc';
        ctx.shadowColor = '#88ffcc';
        ctx.shadowBlur = 12;
        ctx.fillRect(b.x, b.y, b.w, b.h);
      }
      ctx.shadowBlur = 0;

      // Enemies
      for (var i3 = 0; i3 < enemies.length; i3++) {
        var e = enemies[i3];
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 10;
        ctx.fillStyle = e.color;
        ctx.beginPath();
        if (e.type === 'tank') {
          ctx.roundRect(e.x, e.y, e.w, e.h, 6);
        } else {
          ctx.moveTo(e.x + e.w, e.y + e.h/2);
          ctx.lineTo(e.x, e.y + 4);
          ctx.lineTo(e.x, e.y + e.h - 4);
          ctx.closePath();
        }
        ctx.fill();
        ctx.shadowBlur = 0;
        if (e.maxHp > 1) {
          ctx.fillStyle = '#2a3a44';
          ctx.fillRect(e.x, e.y - 6, e.w, 4);
          ctx.fillStyle = '#66ff88';
          ctx.fillRect(e.x, e.y - 6, e.w * (e.hp / e.maxHp), 4);
        }
      }

      // Boss
      if (boss) {
        ctx.shadowColor = '#ff4466';
        ctx.shadowBlur = 25;
        ctx.fillStyle = boss.color;
        ctx.beginPath();
        ctx.roundRect(boss.x, boss.y, boss.w, boss.h, 10);
        ctx.fill();
        ctx.fillStyle = '#ffaa88';
        ctx.font = 'bold 20px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('👾', boss.x + boss.w/2, boss.y + boss.h/2 + 7);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#1a2a2f';
        ctx.fillRect(boss.x, boss.y - 14, boss.w, 8);
        ctx.fillStyle = '#ff4466';
        ctx.fillRect(boss.x, boss.y - 14, boss.w * (boss.hp / boss.maxHp), 8);
        ctx.fillStyle = '#ffaa88';
        ctx.font = '10px monospace';
        ctx.fillText('BOSS', boss.x + boss.w/2, boss.y - 18);
      }

      // Enemy bullets
      for (var i4 = 0; i4 < enemyBullets.length; i4++) {
        var eb = enemyBullets[i4];
        ctx.fillStyle = '#ff6644';
        ctx.shadowColor = '#ff6644';
        ctx.shadowBlur = 10;
        ctx.fillRect(eb.x, eb.y, eb.w, eb.h);
      }
      ctx.shadowBlur = 0;

      // Particles
      for (var i5 = 0; i5 < particles.length; i5++) {
        var p = particles[i5];
        ctx.globalAlpha = p.life / 50;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
      }
      ctx.globalAlpha = 1;

      // Game Over overlay
      if (gameOver) {
        ctx.fillStyle = 'rgba(0,0,0,0.65)';
        ctx.fillRect(0, 0, W, H);
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 40px monospace';
        ctx.fillStyle = '#ff6666';
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 20;
        ctx.fillText('GAME OVER', W/2, H/2 - 20);
        ctx.font = '20px monospace';
        ctx.fillStyle = '#aac0d0';
        ctx.shadowBlur = 0;
        ctx.fillText('Score: ' + score, W/2, H/2 + 35);
        ctx.fillText('Press RESTART', W/2, H/2 + 75);
      }

      ctx.shadowBlur = 0;
    }

    // --- Game Loop ---
    function gameLoop() {
      try {
        update();
        draw();
        animationId = requestAnimationFrame(gameLoop);
      } catch (err) {
        // If any error occurs, display it on canvas
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#ff4444';
        ctx.font = '16px monospace';
        ctx.fillText('ERROR: ' + err.message, 20, 40);
        console.error(err);
      }
    }

    // --- Start / Restart ---
    function startGame() {
      overlay.classList.add('hidden');
      if (animationId) cancelAnimationFrame(animationId);
      gameStarted = true;
      initGame();
      gameLoop();
    }

    function restartGame() {
      if (animationId) cancelAnimationFrame(animationId);
      if (!gameStarted) {
        // If game not started, just reset state and show overlay
        initGame();
        overlay.classList.remove('hidden');
        return;
      }
      initGame();
      gameLoop();
    }

    // --- Event binding ---
    document.addEventListener('keydown', function(e) {
      keys[e.key] = true;
      if (e.key === ' ' || e.key.startsWith('Arrow')) {
        e.preventDefault();
      }
      if (e.key === ' ' && gameStarted && !gameOver && !paused) {
        shoot();
      }
    });
    document.addEventListener('keyup', function(e) {
      keys[e.key] = false;
    });

    playBtn.addEventListener('click', startGame);
    restartBtn.addEventListener('click', restartGame);

    // --- Initial setup ---
    initGame();
    draw(); // draw initial background
  })();
</script>
</body>
</html>`;

  window.initGame = function initGame(wrapper) {
    if (!wrapper || typeof wrapper.replaceChildren !== 'function') {
      throw new Error('initGame requires a container element.');
    }
    var frame = document.createElement('iframe');
    frame.title = 'Space Impact · Classic';
    frame.setAttribute('allow', 'autoplay; fullscreen');
    frame.style.cssText = 'display:block;width:100%;height:520px;border:0;border-radius:16px;background:#0a0f14;';
    frame.srcdoc = gameHTML;
    wrapper.replaceChildren(frame);
    return frame;
  };
})();
