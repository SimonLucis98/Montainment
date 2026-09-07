// game.js - 贪吃蛇完整逻辑（独立模块，自执行）
(function() {
    // ---------- DOM 引用 ----------
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreSpan = document.getElementById('scoreDisplay');

    // ---------- 常量 ----------
    const GRID_SIZE = 20;
    const CELL_SIZE = 400 / GRID_SIZE;
    const MOVE_INTERVAL = 150;

    // ---------- 游戏状态 ----------
    let snake = [];
    let food = { x: 6, y: 10 };
    let direction = 'right';
    let nextDirection = 'right';
    let score = 0;
    let gameOver = false;
    let winFlag = false;
    let paused = false;
    let gameInterval = null;

    // ---------- 核心逻辑 ----------
    function generateFood() {
        const totalCells = GRID_SIZE * GRID_SIZE;
        if (snake.length >= totalCells) {
            winFlag = true;
            gameOver = true;
            clearInterval(gameInterval);
            gameInterval = null;
            return;
        }

        const snakeSet = new Set(snake.map(cell => `${cell[0]},${cell[1]}`));
        if (snakeSet.size >= totalCells) {
            winFlag = true;
            gameOver = true;
            clearInterval(gameInterval);
            gameInterval = null;
            return;
        }

        let freeCells = [];
        if (totalCells - snakeSet.size > 50) {
            let attempts = 0;
            while (attempts < 2000) {
                const fx = Math.floor(Math.random() * GRID_SIZE);
                const fy = Math.floor(Math.random() * GRID_SIZE);
                if (!snakeSet.has(`${fx},${fy}`)) {
                    food = { x: fx, y: fy };
                    return;
                }
                attempts++;
            }
        }

        for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
                if (!snakeSet.has(`${i},${j}`)) {
                    freeCells.push([i, j]);
                }
            }
        }
        if (freeCells.length === 0) {
            winFlag = true;
            gameOver = true;
            clearInterval(gameInterval);
            gameInterval = null;
            return;
        }
        const randIdx = Math.floor(Math.random() * freeCells.length);
        food = { x: freeCells[randIdx][0], y: freeCells[randIdx][1] };
    }

    function moveSnake() {
        if (gameOver || paused) return;

        const opposite = { 'up': 'down', 'down': 'up', 'left': 'right', 'right': 'left' };
        if (nextDirection && opposite[nextDirection] !== direction) {
            direction = nextDirection;
        }

        const head = snake[0];
        let newHeadX = head[0];
        let newHeadY = head[1];
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

        // 撞墙检测
        if (newHeadX < 0 || newHeadX >= GRID_SIZE || newHeadY < 0 || newHeadY >= GRID_SIZE) {
            gameOver = true;
            clearInterval(gameInterval);
            gameInterval = null;
            drawCanvas();
            return;
        }

        // 撞自身检测
        for (let i = 1; i < newSnake.length; i++) {
            if (newSnake[i][0] === newHeadX && newSnake[i][1] === newHeadY) {
                gameOver = true;
                clearInterval(gameInterval);
                gameInterval = null;
                drawCanvas();
                return;
            }
        }

        snake = newSnake;

        if (isEating) {
            score++;
            scoreSpan.textContent = score;
            generateFood();
            if (gameOver) {
                drawCanvas();
                return;
            }
        }

        drawCanvas();
    }

    // ---------- 渲染 ----------
    function drawCanvas() {
        ctx.clearRect(0, 0, 400, 400);

        // 网格
        ctx.strokeStyle = '#2e424b';
        ctx.lineWidth = 0.6;
        for (let i = 0; i <= GRID_SIZE; i++) {
            ctx.beginPath();
            ctx.moveTo(i * CELL_SIZE, 0);
            ctx.lineTo(i * CELL_SIZE, 400);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(0, i * CELL_SIZE);
            ctx.lineTo(400, i * CELL_SIZE);
            ctx.stroke();
        }

        // 食物
        ctx.shadowColor = '#f7d44a';
        ctx.shadowBlur = 12;
        ctx.fillStyle = '#f7d44a';
        ctx.beginPath();
        ctx.arc(food.x * CELL_SIZE + CELL_SIZE / 2, food.y * CELL_SIZE + CELL_SIZE / 2, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;

        // 蛇身
        for (let i = 0; i < snake.length; i++) {
            const [x, y] = snake[i];
            const gradient = ctx.createRadialGradient(
                x * CELL_SIZE + 4, y * CELL_SIZE + 4, 2,
                x * CELL_SIZE + 8, y * CELL_SIZE + 8, CELL_SIZE / 1.8
            );
            if (i === 0) {
                gradient.addColorStop(0, '#8fdfb0');
                gradient.addColorStop(1, '#3f9e6a');
            } else {
                gradient.addColorStop(0, '#6fc89a');
                gradient.addColorStop(1, '#2d7a52');
            }
            ctx.fillStyle = gradient;
            ctx.shadowColor = '#6fc89a';
            ctx.shadowBlur = i === 0 ? 10 : 4;
            ctx.beginPath();
            ctx.roundRect(x * CELL_SIZE + 2, y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4, 6);
            ctx.fill();
        }
        ctx.shadowBlur = 0;

        // 蛇眼
        if (snake.length > 0) {
            const [hx, hy] = snake[0];
            ctx.fillStyle = '#f0faf5';
            ctx.shadowBlur = 6;
            ctx.shadowColor = '#b0d8c0';
            const eyeSize = 3.5;
            let ex1, ey1, ex2, ey2;
            const cx = hx * CELL_SIZE + CELL_SIZE / 2;
            const cy = hy * CELL_SIZE + CELL_SIZE / 2;
            switch (direction) {
                case 'right': ex1 = cx + 4; ey1 = cy - 5; ex2 = cx + 4; ey2 = cy + 5; break;
                case 'left':  ex1 = cx - 4; ey1 = cy - 5; ex2 = cx - 4; ey2 = cy + 5; break;
                case 'up':    ex1 = cx - 5; ey1 = cy - 4; ex2 = cx + 5; ey2 = cy - 4; break;
                case 'down':  ex1 = cx - 5; ey1 = cy + 4; ex2 = cx + 5; ey2 = cy + 4; break;
                default: ex1 = cx + 4; ey1 = cy - 5; ex2 = cx + 4; ey2 = cy + 5;
            }
            ctx.beginPath();
            ctx.arc(ex1, ey1, eyeSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.arc(ex2, ey2, eyeSize, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        // 结束/胜利遮罩
        if (gameOver) {
            ctx.fillStyle = 'rgba(10, 20, 22, 0.7)';
            ctx.fillRect(0, 0, 400, 400);
            ctx.font = 'bold 32px "Segoe UI", system-ui, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = '#000';
            ctx.shadowBlur = 16;
            ctx.fillStyle = winFlag ? '#f7d44a' : '#f28b82';
            ctx.fillText(winFlag ? '🏆 你赢了！' : '💀 游戏结束', 200, 190);
            ctx.shadowBlur = 0;
        }
    }

    // roundRect 扩展
    CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
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

    // ---------- 控制 ----------
    function togglePause() {
        if (gameOver) return;
        paused = !paused;
        document.getElementById('pauseBtn').textContent = paused ? '▶️ 继续' : '⏸️ 暂停';
        drawCanvas();
        if (paused) {
            ctx.fillStyle = 'rgba(10, 20, 22, 0.5)';
            ctx.fillRect(0, 0, 400, 400);
            ctx.font = 'bold 30px "Segoe UI", system-ui, sans-serif';
            ctx.fillStyle = '#b7e4c7';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.shadowColor = '#000';
            ctx.shadowBlur = 12;
            ctx.fillText('⏸ 暂停中', 200, 200);
            ctx.shadowBlur = 0;
        }
    }

    function restartGame() {
        clearInterval(gameInterval);
        gameInterval = null;
        initGame();
        drawCanvas();
    }

    function handleKey(e) {
        const key = e.key;
        const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '];
        if (arrowKeys.includes(key) || key === ' ') {
            e.preventDefault();
        }
        if (key === ' ') {
            togglePause();
            return;
        }
        if (gameOver || paused) return;
        switch (key) {
            case 'ArrowUp':    if (direction !== 'down')  nextDirection = 'up'; break;
            case 'ArrowDown':  if (direction !== 'up')    nextDirection = 'down'; break;
            case 'ArrowLeft':  if (direction !== 'right') nextDirection = 'left'; break;
            case 'ArrowRight': if (direction !== 'left')  nextDirection = 'right'; break;
        }
    }

    // ---------- 初始化 ----------
    function initGame() {
        snake = [
            [8, 10],
            [7, 10],
            [6, 10]
        ];
        direction = 'right';
        nextDirection = 'right';
        score = 0;
        gameOver = false;
        winFlag = false;
        paused = false;
        document.getElementById('pauseBtn').textContent = '⏸️ 暂停';
        scoreSpan.textContent = '0';
        generateFood();
        clearInterval(gameInterval);
        gameInterval = setInterval(moveSnake, MOVE_INTERVAL);
        drawCanvas();
    }

    // ---------- 挂载事件 & 启动 ----------
    window.addEventListener('keydown', handleKey);
    document.getElementById('pauseBtn').addEventListener('click', togglePause);
    document.getElementById('restartBtn').addEventListener('click', restartGame);

    // DOM 加载完成后启动游戏
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initGame);
    } else {
        initGame();
    }
})();
