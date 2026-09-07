/* Snake · Classic (English + Tutorial) */
(function () {
  'use strict';

  const gameHTML = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Snake · Classic</title>
  <style>
    * { box-sizing: border-box; user-select: none; }
    body {
      min-height: 100vh;
      margin: 0;
      background: #1a2a2f;
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: 'Segoe UI', system-ui, sans-serif;
    }
    .game-wrapper {
      background: #1f2e35;
      padding: 2rem 2rem 1.8rem;
      border-radius: 3rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.7), inset 0 0 0 1px rgba(255,255,255,0.06);
      text-align: center;
      position: relative;
    }
    canvas {
      display: block;
      margin: 0 auto;
      background: #1f2e35;
      border-radius: 1.8rem;
      box-shadow: inset 0 0 0 2px #2e424b, 0 12px 28px rgba(0,0,0,0.6);
      width: 400px;
      height: 400px;
    }
    .info-panel {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 1.2rem;
      padding: 0 0.3rem;
    }
    .score-box {
      background: #0f1a1e;
      padding: 0.4rem 1.2rem;
      border-radius: 3rem;
      color: #b7e4c7;
      font-weight: 600;
      font-size: 1.3rem;
      letter-spacing: 1px;
      box-shadow: inset 0 2px 6px rgba(0,0,0,0.6);
    }
    .score-box span {
      color: #f7d44a;
      font-size: 1.7rem;
      margin-left: 0.4rem;
    }
    .btn-group {
      display: flex;
      gap: 0.8rem;
    }
    .btn {
      background: #2e424b;
      border: none;
      padding: 0.5rem 1.4rem;
      border-radius: 3rem;
      font-weight: 600;
      font-size: 1rem;
      color: #e3f0e8;
      cursor: pointer;
      transition: 0.2s;
      box-shadow: 0 4px 0 #121c20, 0 6px 12px rgba(0,0,0,0.3);
    }
    .btn:hover {
      transform: translateY(-2px);
      background: #3d5662;
      box-shadow: 0 6px 0 #121c20, 0 10px 18px rgba(0,0,0,0.4);
    }
    .btn:active {
      transform: translateY(4px);
      box-shadow: 0 1px 0 #121c20;
    }
    .btn-restart {
      background: #d68a5c;
      color: #1a1f22;
      box-shadow: 0 4px 0 #8f5e3d;
    }
    .btn-restart:hover {
      background: #e7a175;
    }
    .hint {
      color: #7b9aa8;
      margin-top: 0.8rem;
      font-size: 0.9rem;
      letter-spacing: 0.5px;
    }
    /* Overlay (start / tutorial) */
    .overlay {
      position: absolute;
      inset: 0;
      background: rgba(16, 28, 30, 0.85);
      backdrop-filter: blur(4px);
      border-radius: 3rem;
      display: grid;
      place-items: center;
      z-index: 20;
      padding: 20px;
    }
    .overlay.hidden { display: none; }
    .start-card {
      background: #f5f3e8;
      border-radius: 2rem;
      padding: 2rem 3rem;
      max-width: 400px;
      width: 100%;
      box-shadow: 0 20px 50px rgba(0,0,0,0.6);
      text-align: center;
      color: #1f2e35;
    }
    .start-card h1 {
      font-size: 2.8rem;
      margin: 0 0 0.2rem;
      letter-spacing: -1px;
      color: #2d4a3e;
    }
    .start-card h1 small {
      display: block;
      font-size: 1rem;
      color: #6f8b7a;
      letter-spacing: 2px;
      margin-top: 0.2rem;
    }
    .start-card .rules {
      text-align: left;
      font-size: 0.95rem;
      line-height: 1.7;
      margin: 1.2rem 0;
      color: #3a4f45;
    }
    .start-card .rules span {
      display: inline-block;
      background: #dbe8d0;
      padding: 0.1rem 0.6rem;
      border-radius: 0.5rem;
      font-weight: 600;
      color: #1d3a2a;
    }
    .btn-play {
      background: #d68a5c;
      border: none;
      padding: 0.7rem 2.5rem;
      border-radius: 3rem;
      font-weight: 700;
      font-size: 1.4rem;
      color: #1f1a16;
      box-shadow: 0 6px 0 #8f5e3d, 0 8px 16px rgba(0,0,0,0.3);
      cursor: pointer;
      transition: 0.15s;
    }
    .btn-play:hover { transform: translateY(-2px); }
    .btn-play:active { transform: translateY(4px); box-shadow: 0 2px 0 #8f5e3d; }
    .key-hint {
      display: inline-block;
      background: #2e424b;
      color: #e3f0e8;
      padding: 0.1rem 0.6rem;
      border-radius: 0.3rem;
      font-family: monospace;
      font-weight: 700;
    }
    @media (max-width: 480px) {
      .game-wrapper { padding: 1rem; border-radius: 2rem; }
      canvas { width: 300px; height: 300px; }
      .score-box { font-size: 1rem; padding: 0.3rem 0.8rem; }
      .btn { font-size: 0.8rem; padding: 0.3rem 1rem; }
      .start-card { padding: 1.5rem; }
      .start-card h1 { font-size: 2rem; }
    }
  </style>
</head>
<body>
<div class="game-wrapper" id="gameWrapper">
  <canvas id="gameCanvas" width="400" height="400"></canvas>
  <div class="info-panel">
    <div class="score-box">🍎 <span id="scoreDisplay">0</span></div>
    <div class="btn-group">
      <button class="btn" id="pauseBtn">⏸️ Pause</button>
      <button class="btn btn-restart" id="restartBtn">🔄 Restart</button>
    </div>
  </div>
  <div class="hint">⬆ ⬇ ⬅ ➡  Arrow keys · Space to pause</div>

  <!-- Overlay (Tutorial / Start) -->
  <div class="overlay" id="overlay">
    <div class="start-card">
      <h1>🐍 SNAKE <small>Classic</small></h1>
      <div class="rules">
        <p><strong>🎯 Goal:</strong> Eat the <span>🍎</span> to grow and score.</p>
        <p><strong>🕹️ Controls:</strong> Use <span class="key-hint">⬆ ⬇ ⬅ ➡</span> to move.<br>
        Press <span class="key-hint">Space</span> to pause / resume.</p>
        <p><strong>⚠️ Rules:</strong><br>
        • Don't hit the wall or your own tail.<br>
        • Each apple gives <strong>+1</strong> point.<br>
        • The game speeds up a little every 5 points.</p>
      </div>
      <button class="btn-play" id="playBtn">▶ PLAY</button>
    </div>
  </div>
</div>

<script>
  (function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreSpan = document.getElementById('scoreDisplay');
    const overlay = document.getElementById('overlay');
    const playBtn = document.getElementById('playBtn');

    const GRID_SIZE = 20;
    const CELL_SIZE = 400 / GRID_SIZE;
    let MOVE_INTERVAL = 150; // will decrease with score

    let snake = [[8,10],[7,10],[6,10]];
    let food = { x:6, y:10 };
    let direction = 'right';
    let nextDirection = 'right';
    let score = 0;
    let gameOver = false;
    let winFlag = false;
    let paused = false;
    let gameInterval = null;
    let gameStarted = false;

    function generateFood() {
      const totalCells = GRID_SIZE * GRID_SIZE;
      if (snake.length >= totalCells) {
        winFlag = true; gameOver = true;
        clearInterval(gameInterval); gameInterval = null;
        return;
      }
      const snakeSet = new Set(snake.map(c => c[0]+','+c[1]));
      if (snakeSet.size >= totalCells) {
        winFlag = true; gameOver = true;
        clearInterval(gameInterval); gameInterval = null;
        return;
      }
      let freeCells = [];
      if (totalCells - snakeSet.size > 50) {
        let attempts = 0;
        while (attempts < 2000) {
          const fx = Math.floor(Math.random() * GRID_SIZE);
          const fy = Math.floor(Math.random() * GRID_SIZE);
          if (!snakeSet.has(fx+','+fy)) {
            food = { x:fx, y:fy };
            return;
          }
          attempts++;
        }
      }
      for (let i=0; i<GRID_SIZE; i++) {
        for (let j=0; j<GRID_SIZE; j++) {
          if (!snakeSet.has(i+','+j)) freeCells.push([i,j]);
        }
      }
      if (freeCells.length === 0) {
        winFlag = true; gameOver = true;
        clearInterval(gameInterval); gameInterval = null;
        return;
      }
      const [fx, fy] = freeCells[Math.floor(Math.random() * freeCells.length)];
      food = { x:fx, y:fy };
    }

    function moveSnake() {
      if (gameOver || paused || !gameStarted) return;
      const opposite = { 'up':'down','down':'up','left':'right','right':'left' };
      if (nextDirection && opposite[nextDirection] !== direction) {
        direction = nextDirection;
      }
      const head = snake[0];
      let newHeadX = head[0], newHeadY = head[1];
      switch (direction) {
        case 'right': newHeadX++; break;
        case 'left':  newHeadX--; break;
        case 'up':    newHeadY--; break;
        case 'down':  newHeadY++; break;
        default: return;
      }
      const isEating = (newHeadX === food.x && newHeadY === food.y);
      let newSnake = [[newHeadX, newHeadY], ...snake];
      if (!isEating) newSnake.pop();

      if (newHeadX < 0 || newHeadX >= GRID_SIZE || newHeadY < 0 || newHeadY >= GRID_SIZE) {
        gameOver = true; clearInterval(gameInterval); gameInterval = null;
        drawCanvas(); return;
      }
      for (let i=1; i<newSnake.length; i++) {
        if (newSnake[i][0] === newHeadX && newSnake[i][1] === newHeadY) {
          gameOver = true; clearInterval(gameInterval); gameInterval = null;
          drawCanvas(); return;
        }
      }
      snake = newSnake;
      if (isEating) {
        score++;
        scoreSpan.textContent = score;
        // Increase speed every 5 points (capped at 70ms)
        if (score % 5 === 0 && MOVE_INTERVAL > 70) {
          MOVE_INTERVAL -= 8;
          clearInterval(gameInterval);
          gameInterval = setInterval(moveSnake, MOVE_INTERVAL);
        }
        generateFood();
        if (gameOver) { drawCanvas(); return; }
      }
      drawCanvas();
    }

    function drawCanvas() {
      ctx.clearRect(0,0,400,400);
      ctx.strokeStyle = '#2e424b';
      ctx.lineWidth = 0.6;
      for (let i=0; i<=GRID_SIZE; i++) {
        ctx.beginPath(); ctx.moveTo(i*CELL_SIZE,0); ctx.lineTo(i*CELL_SIZE,400); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0,i*CELL_SIZE); ctx.lineTo(400,i*CELL_SIZE); ctx.stroke();
      }
      ctx.shadowColor = '#f7d44a';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#f7d44a';
      ctx.beginPath();
      ctx.arc(food.x*CELL_SIZE+CELL_SIZE/2, food.y*CELL_SIZE+CELL_SIZE/2, CELL_SIZE/2-2, 0, Math.PI*2);
      ctx.fill();
      ctx.shadowBlur = 0;

      for (let i=0; i<snake.length; i++) {
        const [x,y] = snake[i];
        const gradient = ctx.createRadialGradient(
          x*CELL_SIZE+4, y*CELL_SIZE+4, 2,
          x*CELL_SIZE+8, y*CELL_SIZE+8, CELL_SIZE/1.8
        );
        if (i===0) {
          gradient.addColorStop(0, '#8fdfb0');
          gradient.addColorStop(1, '#3f9e6a');
        } else {
          gradient.addColorStop(0, '#6fc89a');
          gradient.addColorStop(1, '#2d7a52');
        }
        ctx.fillStyle = gradient;
        ctx.shadowColor = '#6fc89a';
        ctx.shadowBlur = i===0 ? 10 : 4;
        ctx.beginPath();
        ctx.roundRect(x*CELL_SIZE+2, y*CELL_SIZE+2, CELL_SIZE-4, CELL_SIZE-4, 6);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      if (snake.length > 0) {
        const [hx,hy] = snake[0];
        ctx.fillStyle = '#f0faf5';
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#b0d8c0';
        const eyeSize = 3.5;
        let ex1, ey1, ex2, ey2;
        const cx = hx*CELL_SIZE+CELL_SIZE/2;
        const cy = hy*CELL_SIZE+CELL_SIZE/2;
        switch (direction) {
          case 'right': ex1=cx+4; ey1=cy-5; ex2=cx+4; ey2=cy+5; break;
          case 'left':  ex1=cx-4; ey1=cy-5; ex2=cx-4; ey2=cy+5; break;
          case 'up':    ex1=cx-5; ey1=cy-4; ex2=cx+5; ey2=cy-4; break;
          case 'down':  ex1=cx-5; ey1=cy+4; ex2=cx+5; ey2=cy+4; break;
          default: ex1=cx+4; ey1=cy-5; ex2=cx+4; ey2=cy+5;
        }
        ctx.beginPath(); ctx.arc(ex1, ey1, eyeSize, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(ex2, ey2, eyeSize, 0, Math.PI*2); ctx.fill();
        ctx.shadowBlur = 0;
      }

      if (gameOver) {
        ctx.fillStyle = 'rgba(10,20,22,0.7)';
        ctx.fillRect(0,0,400,400);
        ctx.font = 'bold 32px "Segoe UI", system-ui, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 16;
        ctx.fillStyle = winFlag ? '#f7d44a' : '#f28b82';
        ctx.fillText(winFlag ? '🏆 You Win!' : '💀 Game Over', 200, 190);
        ctx.shadowBlur = 0;
      }
    }

    CanvasRenderingContext2D.prototype.roundRect = function (x,y,w,h,r) {
      if (r > w/2) r = w/2;
      if (r > h/2) r = h/2;
      this.moveTo(x+r, y);
      this.lineTo(x+w-r, y);
      this.quadraticCurveTo(x+w, y, x+w, y+r);
      this.lineTo(x+w, y+h-r);
      this.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
      this.lineTo(x+r, y+h);
      this.quadraticCurveTo(x, y+h, x, y+h-r);
      this.lineTo(x, y+r);
      this.quadraticCurveTo(x, y, x+r, y);
      this.closePath();
      return this;
    };

    function togglePause() {
      if (gameOver || !gameStarted) return;
      paused = !paused;
      document.getElementById('pauseBtn').textContent = paused ? '▶️ Resume' : '⏸️ Pause';
      drawCanvas();
      if (paused) {
        ctx.fillStyle = 'rgba(10,20,22,0.5)';
        ctx.fillRect(0,0,400,400);
        ctx.font = 'bold 30px "Segoe UI", system-ui, sans-serif';
        ctx.fillStyle = '#b7e4c7';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = '#000';
        ctx.shadowBlur = 12;
        ctx.fillText('⏸ Paused', 200, 200);
        ctx.shadowBlur = 0;
      }
    }

    function restartGame() {
      clearInterval(gameInterval);
      gameInterval = null;
      initGame();
    }

    function handleKey(e) {
      const key = e.key;
      if (['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(key) || key === ' ') {
        e.preventDefault();
      }
      if (key === ' ') { togglePause(); return; }
      if (gameOver || paused || !gameStarted) return;
      switch (key) {
        case 'ArrowUp':    if (direction !== 'down')  nextDirection = 'up'; break;
        case 'ArrowDown':  if (direction !== 'up')    nextDirection = 'down'; break;
        case 'ArrowLeft':  if (direction !== 'right') nextDirection = 'left'; break;
        case 'ArrowRight': if (direction !== 'left')  nextDirection = 'right'; break;
      }
    }

    function initGame() {
      snake = [[8,10],[7,10],[6,10]];
      direction = 'right';
      nextDirection = 'right';
      score = 0;
      gameOver = false;
      winFlag = false;
      paused = false;
      MOVE_INTERVAL = 150;
      document.getElementById('pauseBtn').textContent = '⏸️ Pause';
      scoreSpan.textContent = '0';
      generateFood();
      clearInterval(gameInterval);
      gameInterval = setInterval(moveSnake, MOVE_INTERVAL);
      drawCanvas();
    }

    // Start game when PLAY is clicked
    function startGame() {
      overlay.classList.add('hidden');
      gameStarted = true;
      initGame();
    }

    playBtn.addEventListener('click', startGame);
    window.addEventListener('keydown', handleKey);
    document.getElementById('pauseBtn').addEventListener('click', togglePause);
    document.getElementById('restartBtn').addEventListener('click', restartGame);

    // Initial draw (show snake and food, but overlay covers it)
    (function setup() {
      snake = [[8,10],[7,10],[6,10]];
      direction = 'right';
      nextDirection = 'right';
      score = 0;
      gameOver = false;
      winFlag = false;
      paused = false;
      MOVE_INTERVAL = 150;
      scoreSpan.textContent = '0';
      generateFood();
      drawCanvas();
      // Don't start interval until PLAY clicked
    })();
  })();
</script>
</body>
</html>`;

  window.initGame = function initGame(wrapper) {
    if (!wrapper || typeof wrapper.replaceChildren !== 'function') {
      throw new Error('initGame requires a container element.');
    }
    const frame = document.createElement('iframe');
    frame.title = 'Snake · Classic';
    frame.setAttribute('allow', 'autoplay; fullscreen');
    frame.style.cssText = 'display:block;width:100%;height:560px;border:0;border-radius:16px;background:#1a2a2f;';
    frame.srcdoc = gameHTML;
    wrapper.replaceChildren(frame);
    return frame;
  };
})();
