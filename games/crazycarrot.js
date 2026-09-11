/* Zip & Pip: Carrot Quest — Original Platformer */
(function () {
  'use strict';

  const gameHTML = `<!doctype html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Zip & Pip: Carrot Quest</title>
<style>
  * { box-sizing: border-box; user-select: none; }
  html, body {
    min-height: 100vh;
    margin: 0;
    background: #0a0e18;
    display: grid;
    place-items: center;
    font-family: 'Segoe UI', system-ui, sans-serif;
    overflow: hidden;
  }
  #wrap {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 30px 70px rgba(0,0,0,0.7), 0 0 0 3px #2a3a55;
  }
  canvas { display: block; }
</style>
</head>
<body>
<div id="wrap"><canvas id="c" width="960" height="480"></canvas></div>
<script>
(function() {
  var canvas = document.getElementById('c');
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;
  var TILE = 32;
  var GRAVITY = 0.72;
  var MOVE = 4.2;
  var JUMP = -13.8;
  var MAXFALL = 16;

  // ============================================================
  // AUDIO (Web Audio synthesized music + SFX)
  // ============================================================
  var audio = (function() {
    var actx = null, musicTimer = null, musicStep = 0, musicTime = 0;
    var muted = false;
    function init() {
      if (actx) return;
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
    }
    function tone(freq, start, dur, type, vol) {
      if (!actx || muted) return;
      var o = actx.createOscillator();
      var g = actx.createGain();
      o.type = type || 'square';
      o.frequency.setValueAtTime(freq, start);
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(vol || 0.05, start + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, start + dur);
      o.connect(g); g.connect(actx.destination);
      o.start(start); o.stop(start + dur + 0.05);
    }
    // 32-step loop, upbeat chiptune
    var MEL = [
      659,784,880,784, 659,523,587,659,
      880,988,1047,988, 880,784,659,587,
      523,659,784,659, 523,440,494,523,
      659,587,523,494, 440,494,523,587
    ];
    var BASS = [
      131,131,165,165, 175,175,196,196,
      131,131,165,165, 175,175,196,196,
      110,110,131,131, 147,147,165,165,
      110,110,123,123, 131,131,147,147
    ];
    var STEP = 0.155;
    function schedule() {
      if (!actx || muted) return;
      var now = actx.currentTime;
      while (musicTime < now + 0.4) {
        var s = musicStep % 32;
        tone(MEL[s], musicTime, 0.13, 'square', 0.028);
        tone(BASS[s], musicTime, 0.14, 'triangle', 0.055);
        if (s % 4 === 0) tone(2000, musicTime, 0.03, 'square', 0.02);
        musicTime += STEP;
        musicStep++;
      }
      musicTimer = setTimeout(schedule, 80);
    }
    return {
      init: init,
      start: function() {
        init();
        if (actx && actx.state === 'suspended') actx.resume();
        if (musicTimer) return;
        musicTime = actx.currentTime + 0.1;
        musicStep = 0;
        schedule();
      },
      stop: function() {
        if (musicTimer) { clearTimeout(musicTimer); musicTimer = null; }
      },
      jump: function() { if (actx) tone(520, actx.currentTime, 0.09, 'square', 0.05); },
      collect: function() { if (actx) { tone(880, actx.currentTime, 0.06, 'square', 0.06); tone(1320, actx.currentTime + 0.05, 0.1, 'square', 0.05); } },
      hurt: function() { if (actx) { tone(220, actx.currentTime, 0.15, 'sawtooth', 0.08); tone(110, actx.currentTime + 0.08, 0.2, 'sawtooth', 0.06); } },
      win: function() { if (actx) { var t = actx.currentTime; [523,659,784,1047,1319].forEach(function(f,i){ tone(f, t + i*0.09, 0.15, 'square', 0.07); }); } },
      switch: function() { if (actx) tone(700, actx.currentTime, 0.05, 'triangle', 0.05); },
      toggle: function() { muted = !muted; return muted; }
    };
  })();

  // ============================================================
  // LEVELS  ('#'=ground  '^'=spike  'o'=carrot  'E'=enemy
  //          'P'=spawn    'F'=flag   'B'=box     'C'=checkpoint)
  // ============================================================
  var LEVELS = [
    // ---------- LEVEL 1 ----------
    [
      '                                                                                        ',
      '                                                                                        ',
      '                                                                                        ',
      '                                                                                        ',
      '                                                                                        ',
      '                      o o o                                                             ',
      '                    #########                                                           ',
      '                                                           o o                          ',
      '              o o                                    o   ######                        ',
      '          #########                              #####                                  ',
      '                                                                                        ',
      '     E          o         E       o      E          o       E           o               ',
      '  #######    ########   #######  #####   ########   ########    ########  #####         ',
      '                                                                                        ',
      'P      o       ^^^      o      ^^      o    C   o      ^^^     o    o       o    F     ',
      '########################################################################################'
    ],
    // ---------- LEVEL 2 ----------
    [
      '                                                                                                 ',
      '                                                                                                 ',
      '                                                                                                 ',
      '                                                                                                 ',
      '                          o o o                                                                  ',
      '                        #########                                                                ',
      '                                        o                                                        ',
      '                                o    ######        o o                                          ',
      '                         #######                ######                                           ',
      '                                                              o                                  ',
      '                    E            o        E             o                 E                     ',
      '         #######  ########   ######    ########   ########   ########    #######    #####       ',
      '                                                                                                 ',
      '     o        ^^        o       ^^^        o      ^^       o        C     o      o      o       ',
      'P                                                                                           F    ',
      '#################################################################################################'
    ],
    // ---------- LEVEL 3 (hardest) ----------
    [
      '                                                                                                  ',
      '                                                                                                  ',
      '                                                                                                  ',
      '                              o   o o                                                             ',
      '                           ############                                                           ',
      '                                                                                                  ',
      '                        o                       o                                                 ',
      '                  #####              o       #####                                                ',
      '                            o      #####                     o o                                  ',
      '                  E              ######                     ######                                 ',
      '          E                   E                    E                          E                   ',
      '      #########  #########  ######  #######   ##########  ########   ########  ########  #####    ',
      '                                                                                                  ',
      '  o        ^^^        o        ^^^        o   C    o        ^^^      o       ^^       o       o   ',
      'P                                                                                            F    ',
      '##################################################################################################'
    ]
  ];

  // ============================================================
  // PARSE LEVEL
  // ============================================================
  var level = null;
  var levelIndex = 0;
  var totalLevels = LEVELS.length;

  function parseLevel(lines) {
    var maxW = 0;
    for (var i = 0; i < lines.length; i++) if (lines[i].length > maxW) maxW = lines[i].length;
    var tiles = [];
    var carrots = [], enemies = [], spikes = [], boxes = [];
    var spawn = { x: 60, y: 400 };
    var flag = null, checkpoint = null;

    for (var y = 0; y < lines.length; y++) {
      var row = lines[y], tileRow = [];
      for (var x = 0; x < maxW; x++) {
        var ch = x < row.length ? row[x] : ' ';
        switch(ch) {
          case '#': tileRow.push('#'); break;
          case '^':
            tileRow.push(' ');
            spikes.push({ x: x*TILE+4, y: y*TILE+14, w: TILE-8, h: 18 });
            break;
          case 'o':
            tileRow.push(' ');
            carrots.push({ x: x*TILE+6, y: y*TILE+6, taken: false });
            break;
          case 'E':
            tileRow.push(' ');
            enemies.push({
              x: x*TILE, y: y*TILE+6, w: 26, h: 26,
              vx: 1.4, vy: 0,
              minX: Math.max(0, (x-4)*TILE), maxX: (x+4)*TILE,
              onGround: false, alive: true, phase: Math.random()*6.28,
              type: Math.random() < 0.5 ? 'walker' : 'hopper'
            });
            break;
          case 'P':
            tileRow.push(' ');
            spawn = { x: x*TILE, y: y*TILE - 8 };
            break;
          case 'F':
            tileRow.push(' ');
            flag = { x: x*TILE, y: y*TILE - 96, w: 32, h: 128 };
            break;
          case 'B':
            tileRow.push(' ');
            boxes.push({ x: x*TILE+2, y: y*TILE+2, w: 28, h: 28, vx: 0, vy: 0, onGround: false });
            break;
          case 'C':
            tileRow.push(' ');
            checkpoint = { x: x*TILE, y: y*TILE - 40, w: 32, h: 40, active: false };
            break;
          default: tileRow.push(' ');
        }
      }
      tiles.push(tileRow);
    }
    return {
      tiles: tiles,
      width: maxW * TILE,
      height: lines.length * TILE,
      carrots: carrots,
      enemies: enemies,
      spikes: spikes,
      boxes: boxes,
      checkpoint: checkpoint,
      flag: flag,
      spawn: spawn,
      totalCarrots: carrots.length,
      collected: 0
    };
  }

  // ============================================================
  // COLLISION
  // ============================================================
  function solidAt(tx, ty) {
    if (!level) return false;
    if (ty < 0 || ty >= level.tiles.length) return false;
    if (tx < 0 || tx >= level.tiles[0].length) return false;
    return level.tiles[ty][tx] === '#';
  }
  function tileCollides(x, y, w, h) {
    var x1 = Math.floor(x / TILE), y1 = Math.floor(y / TILE);
    var x2 = Math.floor((x + w - 1) / TILE), y2 = Math.floor((y + h - 1) / TILE);
    for (var ty = y1; ty <= y2; ty++) {
      for (var tx = x1; tx <= x2; tx++) {
        if (solidAt(tx, ty)) return true;
      }
    }
    return false;
  }
  function aabb(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
  }

  // ============================================================
  // PLAYER & GAME STATE
  // ============================================================
  var player = {
    x: 50, y: 400, w: 28, h: 40, vx: 0, vy: 0,
    onGround: false, facing: 1, character: 'zip',
    invuln: 0, jumpHeld: false, canDouble: true, animT: 0, hurt: 0
  };
  var camera = { x: 0, shake: 0 };
  var score = 0, lives = 3, keys = {};
  var state = 'title';        // 'title' | 'playing' | 'levelComplete' | 'gameOver' | 'win' | 'death'
  var stateTimer = 0;
  var deathX = 0, deathY = 0;
  var goalActive = false;
  var switchFlash = 0;
  var particles = [];

  function spawnParticles(x, y, color, count) {
    for (var i = 0; i < (count||8); i++) {
      var ang = Math.random() * Math.PI * 2;
      var sp = 1 + Math.random() * 4;
      particles.push({
        x: x, y: y, vx: Math.cos(ang)*sp, vy: Math.sin(ang)*sp - 1,
        life: 30 + Math.random()*20, color: color,
        size: 3 + Math.random()*4
      });
    }
  }

  // ============================================================
  // INPUT
  // ============================================================
  document.addEventListener('keydown', function(e) {
    keys[e.key] = true;
    var k = e.key;
    if ([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','W','A','S','D'].indexOf(k) !== -1) {
      e.preventDefault();
    }
    if (state === 'title' && (k === ' ' || k === 'Enter')) {
      startGame(); return;
    }
    if (state === 'gameOver' || state === 'win') {
      if (k === ' ' || k === 'Enter') { resetAll(); state = 'title'; }
      return;
    }
    if ((k === 'e' || k === 'E') && state === 'playing') {
      player.character = player.character === 'zip' ? 'pip' : 'zip';
      switchFlash = 18;
      audio.switch();
    }
    if ((k === 'm' || k === 'M')) {
      audio.toggle();
    }
  });
  document.addEventListener('keyup', function(e) { keys[e.key] = false; });

  // ============================================================
  // GAME FLOW
  // ============================================================
  function startGame() {
    levelIndex = 0; score = 0; lives = 3;
    loadLevel(0);
    state = 'playing';
    audio.start();
  }
  function loadLevel(idx) {
    level = parseLevel(LEVELS[idx]);
    player.x = level.spawn.x;
    player.y = level.spawn.y;
    player.vx = 0; player.vy = 0;
    player.character = 'zip';
    player.invuln = 0; player.hurt = 0;
    goalActive = false;
    camera.x = 0;
    particles = [];
  }
  function resetAll() {
    levelIndex = 0; score = 0; lives = 3;
    audio.stop();
  }
  function nextLevel() {
    levelIndex++;
    if (levelIndex >= totalLevels) {
      state = 'win';
      audio.win();
      audio.stop();
    } else {
      loadLevel(levelIndex);
      state = 'playing';
    }
  }
  function die() {
    if (state !== 'playing') return;
    lives--;
    audio.hurt();
    camera.shake = 20;
    spawnParticles(player.x + 14, player.y + 20, '#ff6688', 24);
    state = 'death';
    stateTimer = 60;
    if (lives <= 0) {
      setTimeout(function() { state = 'gameOver'; audio.stop(); }, 900);
    }
  }

  // ============================================================
  // UPDATE
  // ============================================================
  function update() {
    if (camera.shake > 0) camera.shake *= 0.88;

    // ---- STATE MACHINE ----
    if (state === 'death') {
      stateTimer--;
      if (stateTimer <= 0 && lives > 0) {
        loadLevel(levelIndex);
        state = 'playing';
      }
      return;
    }
    if (state === 'levelComplete') {
      stateTimer--;
      if (stateTimer <= 0) nextLevel();
      return;
    }
    if (state !== 'playing') return;

    if (switchFlash > 0) switchFlash--;
    if (player.invuln > 0) player.invuln--;
    if (player.hurt > 0) player.hurt--;

    // ---- INPUT ----
    player.vx = 0;
    var left  = keys['ArrowLeft']  || keys['a'] || keys['A'];
    var right = keys['ArrowRight'] || keys['d'] || keys['D'];
    var jump  = keys['ArrowUp']    || keys['w'] || keys['W'] || keys[' '];
    if (left)  { player.vx = -MOVE; player.facing = -1; }
    if (right) { player.vx =  MOVE; player.facing =  1; }
    if (left || right) player.animT += 0.25; else player.animT *= 0.9;

    // ---- JUMP / GLIDE ----
    if (jump && !player.jumpHeld && player.onGround) {
      player.vy = JUMP;
      player.onGround = false;
      player.canDouble = true;
      audio.jump();
    }
    player.jumpHeld = jump;

    // Pip glide
    if (player.character === 'pip' && !player.onGround && player.vy > 0 && jump) {
      player.vy = Math.min(player.vy, 2.6);
    }
    // Double jump
    if (jump && !player.jumpHeldPrev && !player.onGround && player.canDouble) {
      // handled below for accuracy
    }
    player.jumpHeldPrev = jump;

    // ---- GRAVITY ----
    player.vy += GRAVITY;
    if (player.vy > MAXFALL) player.vy = MAXFALL;

    // ---- HORIZONTAL MOVE ----
    var nx = player.x + player.vx;
    if (!tileCollides(nx, player.y, player.w, player.h)) {
      player.x = nx;
    } else {
      // try step up
      if (!tileCollides(nx, player.y - 6, player.w, player.h)) {
        player.y -= 6;
        player.x = nx;
      }
    }
    // push boxes
    if (player.character === 'zip') {
      for (var bi = 0; bi < level.boxes.length; bi++) {
        var bx = level.boxes[bi];
        if (aabb(player, bx)) {
          var pushDir = player.vx > 0 ? 1 : -1;
          var tryX = bx.x + pushDir * Math.abs(player.vx);
          if (!tileCollides(tryX, bx.y, bx.w, bx.h)) {
            // check other boxes
            var blocked = false;
            for (var bj = 0; bj < level.boxes.length; bj++) {
              if (bj === bi) continue;
              var o = level.boxes[bj];
              if (aabb({x:tryX,y:bx.y,w:bx.w,h:bx.h}, o)) blocked = true;
            }
            if (!blocked) bx.x = tryX;
          } else {
            player.x -= player.vx;
          }
        }
      }
    }

    // ---- VERTICAL MOVE ----
    player.onGround = false;
    var ny = player.y + player.vy;
    if (!tileCollides(player.x, ny, player.w, player.h)) {
      player.y = ny;
    } else {
      if (player.vy > 0) {
        // landing
        while (!tileCollides(player.x, player.y + 1, player.w, player.h)) player.y += 1;
        player.onGround = true;
        player.canDouble = true;
        player.vy = 0;
      } else {
        while (!tileCollides(player.x, player.y - 1, player.w, player.h)) player.y -= 1;
        player.vy = 0;
      }
    }

    // ---- WORLD BOUNDS ----
    if (player.x < 0) player.x = 0;
    if (player.x + player.w > level.width) player.x = level.width - player.w;
    if (player.y > level.height + 100) {
      die(); return;
    }

    // ---- SPIKES ----
    if (player.invuln <= 0) {
      for (var si = 0; si < level.spikes.length; si++) {
        if (aabb(player, level.spikes[si])) {
          // check we're actually touching (not just overlapping x)
          if (player.y + player.h > level.spikes[si].y + 6) {
            die(); return;
          }
        }
      }
    }

    // ---- ENEMIES ----
    for (var ei = 0; ei < level.enemies.length; ei++) {
      var e = level.enemies[ei];
      if (!e.alive) continue;
      e.phase += 0.08;
      e.x += e.vx;
      // gravity
      e.vy += GRAVITY;
      if (e.vy > MAXFALL) e.vy = MAXFALL;
      var eny = e.y + e.vy;
      if (!tileCollides(e.x, eny, e.w, e.h)) {
        e.y = eny; e.onGround = false;
      } else {
        if (e.vy > 0) {
          while (!tileCollides(e.x, e.y + 1, e.w, e.h)) e.y += 1;
          e.onGround = true;
        }
        e.vy = 0;
      }
      if (e.onGround) e.vy = 0;
      // turn at bounds or edges
      var aheadX = e.vx > 0 ? e.x + e.w + 2 : e.x - 2;
      if (tileCollides(aheadX, e.y, 2, e.h) || e.x <= e.minX || e.x + e.w >= e.maxX) {
        e.vx = -e.vx;
      }
      // fall avoidance
      var belowX = e.vx > 0 ? e.x + e.w : e.x - 1;
      if (!tileCollides(belowX, e.y + e.h + 2, 2, 2) && e.onGround) {
        e.vx = -e.vx;
      }
      // hopper bounce
      if (e.type === 'hopper' && e.onGround && Math.random() < 0.02) {
        e.vy = -9;
      }
      // collision with player
      if (player.invuln <= 0 && aabb(player, e)) {
        // stomp check
        if (player.vy > 1 && player.y + player.h < e.y + 14) {
          e.alive = false;
          player.vy = -8;
          score += 50;
          spawnParticles(e.x + 13, e.y + 13, '#ffcc44', 14);
          audio.collect();
        } else {
          die(); return;
        }
      }
    }

    // ---- CARROTS ----
    for (var ci = 0; ci < level.carrots.length; ci++) {
      var c = level.carrots[ci];
      if (c.taken) continue;
      if (aabb(player, {x:c.x,y:c.y,w:24,h:24})) {
        c.taken = true;
        score += 10;
        level.collected++;
        spawnParticles(c.x + 12, c.y + 12, '#ff8844', 8);
        audio.collect();
      }
    }

    // ---- CHECKPOINT ----
    if (level.checkpoint && !level.checkpoint.active && aabb(player, level.checkpoint)) {
      level.checkpoint.active = true;
      level.spawn = { x: level.checkpoint.x, y: level.checkpoint.y + 8 };
      spawnParticles(level.checkpoint.x + 16, level.checkpoint.y + 20, '#44ff88', 20);
      audio.collect();
    }

    // ---- FLAG ----
    if (level.flag && !goalActive && aabb(player, level.flag)) {
      goalActive = true;
      score += 200 + level.collected * 5;
      audio.win();
      state = 'levelComplete';
      stateTimer = 120;
    }

    // ---- PARTICLES ----
    for (var pi = particles.length - 1; pi >= 0; pi--) {
      var p = particles[pi];
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.15;
      p.life--;
      if (p.life <= 0) particles.splice(pi, 1);
    }

    // ---- CAMERA ----
    var targetX = player.x + player.w / 2 - W / 2;
    if (targetX < 0) targetX = 0;
    if (targetX > level.width - W) targetX = level.width - W;
    camera.x += (targetX - camera.x) * 0.15;
  }

  // ============================================================
  // DRAW
  // ============================================================
  function roundRect(x, y, w, h, r) {
    if (r > w/2) r = w/2;
    if (r > h/2) r = h/2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  function drawSky() {
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, '#1a3a6a');
    g.addColorStop(0.4, '#3a6ea8');
    g.addColorStop(0.7, '#6fa8d0');
    g.addColorStop(1, '#d8e8f0');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // sun
    ctx.fillStyle = 'rgba(255,230,150,0.7)';
    ctx.beginPath();
    ctx.arc(W - 120, 90, 55, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = 'rgba(255,240,180,0.95)';
    ctx.beginPath();
    ctx.arc(W - 120, 90, 40, 0, Math.PI*2);
    ctx.fill();
  }

  function drawParallax() {
    // far mountains
    ctx.save();
    ctx.translate(-camera.x * 0.25, 0);
    ctx.fillStyle = 'rgba(60,100,150,0.55)';
    for (var i = 0; i < 12; i++) {
      var mx = i * 500 + 200;
      ctx.beginPath();
      ctx.moveTo(mx - 250, 400);
      ctx.lineTo(mx, 180);
      ctx.lineTo(mx + 250, 400);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
    // mid hills
    ctx.save();
    ctx.translate(-camera.x * 0.5, 0);
    ctx.fillStyle = 'rgba(90,150,110,0.65)';
    for (var j = 0; j < 20; j++) {
      var hx = j * 350;
      ctx.beginPath();
      ctx.arc(hx + 180, 440, 180, Math.PI, 0);
      ctx.fill();
    }
    ctx.restore();
    // clouds
    ctx.save();
    ctx.translate(-camera.x * 0.15, 0);
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    for (var k = 0; k < 15; k++) {
      var cx = k * 400 + 80;
      var cy = 60 + (k % 3) * 40;
      ctx.beginPath();
      ctx.arc(cx, cy, 26, 0, Math.PI*2);
      ctx.arc(cx + 30, cy - 8, 22, 0, Math.PI*2);
      ctx.arc(cx + 55, cy + 4, 24, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawTiles() {
    if (!level) return;
    var x1 = Math.max(0, Math.floor(camera.x / TILE) - 1);
    var x2 = Math.min(level.tiles[0].length - 1, Math.ceil((camera.x + W) / TILE) + 1);
    for (var ty = 0; ty < level.tiles.length; ty++) {
      for (var tx = x1; tx <= x2; tx++) {
        if (level.tiles[ty][tx] !== '#') continue;
        var px = tx * TILE, py = ty * TILE;
        // top dirt
        var isTop = ty === 0 || level.tiles[ty-1][tx] !== '#';
        if (isTop) {
          ctx.fillStyle = '#5cb85c';
          ctx.fillRect(px, py, TILE, 8);
          ctx.fillStyle = '#8cd88c';
          ctx.fillRect(px, py, TILE, 3);
          ctx.fillStyle = '#7a4a2a';
          ctx.fillRect(px, py + 8, TILE, TILE - 8);
        } else {
          ctx.fillStyle = '#7a4a2a';
          ctx.fillRect(px, py, TILE, TILE);
        }
        // brick pattern
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fillRect(px, py + TILE - 2, TILE, 2);
        ctx.fillRect(px + TILE - 2, py, 2, TILE);
        ctx.fillStyle = 'rgba(255,255,255,0.06)';
        ctx.fillRect(px + 4, py + 12, 8, 3);
        ctx.fillRect(px + 18, py + 22, 6, 3);
      }
    }
  }

  function drawSpikes() {
    if (!level) return;
    for (var i = 0; i < level.spikes.length; i++) {
      var s = level.spikes[i];
      if (s.x + s.w < camera.x || s.x > camera.x + W) continue;
      ctx.fillStyle = '#c0c8d0';
      ctx.beginPath();
      for (var k = 0; k < 3; k++) {
        var sx = s.x + k * 10;
        ctx.moveTo(sx, s.y + s.h);
        ctx.lineTo(sx + 5, s.y);
        ctx.lineTo(sx + 10, s.y + s.h);
      }
      ctx.fill();
      ctx.fillStyle = '#8892a0';
      for (var k2 = 0; k2 < 3; k2++) {
        var sx2 = s.x + k2 * 10 + 6;
        ctx.fillRect(sx2, s.y + 6, 1, s.h - 6);
      }
    }
  }

  function drawCarrot(x, y, t) {
    var bob = Math.sin(t * 0.005 + x * 0.05) * 3;
    y += bob;
    // glow
    ctx.fillStyle = 'rgba(255,180,80,0.25)';
    ctx.beginPath();
    ctx.arc(x + 12, y + 12, 16, 0, Math.PI*2);
    ctx.fill();
    // leaves
    ctx.fillStyle = '#3aaa3a';
    ctx.beginPath();
    ctx.moveTo(x + 12, y - 2);
    ctx.lineTo(x + 5, y + 4);
    ctx.lineTo(x + 12, y + 6);
    ctx.lineTo(x + 19, y + 4);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#5cc85c';
    ctx.beginPath();
    ctx.moveTo(x + 12, y - 2);
    ctx.lineTo(x + 8, y + 5);
    ctx.lineTo(x + 12, y + 6);
    ctx.closePath();
    ctx.fill();
    // body
    var grad = ctx.createLinearGradient(x, y + 6, x + 24, y + 24);
    grad.addColorStop(0, '#ffb04a');
    grad.addColorStop(1, '#e86a20');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(x + 4, y + 6);
    ctx.lineTo(x + 20, y + 6);
    ctx.lineTo(x + 12, y + 24);
    ctx.closePath();
    ctx.fill();
    // shine
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(x + 8, y + 10, 2, 6);
  }

  function drawBox(box) {
    ctx.fillStyle = '#a06838';
    roundRect(box.x, box.y, box.w, box.h, 4);
    ctx.fill();
    ctx.fillStyle = '#c88a4a';
    ctx.fillRect(box.x + 3, box.y + 3, box.w - 6, box.h - 6);
    ctx.strokeStyle = '#6a4020';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(box.x + 4, box.y + 4);
    ctx.lineTo(box.x + box.w - 4, box.y + box.h - 4);
    ctx.moveTo(box.x + box.w - 4, box.y + 4);
    ctx.lineTo(box.x + 4, box.y + box.h - 4);
    ctx.stroke();
  }

  function drawEnemy(e) {
    if (!e.alive) return;
    if (e.x + e.w < camera.x || e.x > camera.x + W) return;
    var squish = Math.sin(e.phase) * 1.5;
    var cx = e.x + 13, cy = e.y + 13 + squish;
    // shadow
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(cx, e.y + e.h, 12, 3, 0, 0, Math.PI*2);
    ctx.fill();
    // body
    var color = e.type === 'walker' ? '#a84a6a' : '#c860a0';
    var grad = ctx.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, 14);
    grad.addColorStop(0, '#e888b0');
    grad.addColorStop(1, color);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 13, 0, Math.PI*2);
    ctx.fill();
    // eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx - 4, cy - 3, 4, 0, Math.PI*2);
    ctx.arc(cx + 4, cy - 3, 4, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#1a1a2a';
    var look = e.vx > 0 ? 1 : -1;
    ctx.beginPath();
    ctx.arc(cx - 4 + look, cy - 3, 2, 0, Math.PI*2);
    ctx.arc(cx + 4 + look, cy - 3, 2, 0, Math.PI*2);
    ctx.fill();
    // mouth
    ctx.strokeStyle = '#3a2030';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy + 5, 3, 0, Math.PI);
    ctx.stroke();
    // little feet
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(cx - 7, cy + 11, 4, 3, 0, 0, Math.PI*2);
    ctx.ellipse(cx + 7, cy + 11, 4, 3, 0, 0, Math.PI*2);
    ctx.fill();
  }

  function drawFlag() {
    if (!level || !level.flag) return;
    var f = level.flag;
    if (f.x + f.w < camera.x - 50 || f.x > camera.x + W + 50) return;
    // pole
    ctx.fillStyle = '#888';
    ctx.fillRect(f.x + 13, f.y, 4, f.h);
    ctx.fillStyle = '#aaa';
    ctx.fillRect(f.x + 13, f.y, 2, f.h);
    // top ball
    ctx.fillStyle = '#ffcc44';
    ctx.beginPath();
    ctx.arc(f.x + 15, f.y - 2, 6, 0, Math.PI*2);
    ctx.fill();
    // flag
    var wave = Math.sin(Date.now() / 200) * 3;
    var grad = ctx.createLinearGradient(f.x + 17, f.y + 8, f.x + 60, f.y + 40);
    grad.addColorStop(0, '#ff5566');
    grad.addColorStop(1, '#cc2244');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(f.x + 17, f.y + 8);
    ctx.quadraticCurveTo(f.x + 45, f.y + 15 + wave, f.x + 62, f.y + 20);
    ctx.lineTo(f.x + 62, f.y + 48);
    ctx.quadraticCurveTo(f.x + 45, f.y + 43 + wave, f.x + 17, f.y + 48);
    ctx.closePath();
    ctx.fill();
    // star
    ctx.fillStyle = '#ffee88';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★', f.x + 40, f.y + 38);
    ctx.textAlign = 'left';
  }

  function drawCheckpoint() {
    if (!level || !level.checkpoint) return;
    var cp = level.checkpoint;
    if (cp.x + cp.w < camera.x - 30 || cp.x > camera.x + W + 30) return;
    ctx.fillStyle = cp.active ? '#44ff88' : '#6688aa';
    ctx.fillRect(cp.x + 12, cp.y, 4, cp.h);
    ctx.fillStyle = cp.active ? '#88ffaa' : '#aaccdd';
    ctx.beginPath();
    ctx.moveTo(cp.x + 16, cp.y + 4);
    ctx.lineTo(cp.x + 30, cp.y + 12);
    ctx.lineTo(cp.x + 16, cp.y + 20);
    ctx.closePath();
    ctx.fill();
    if (cp.active) {
      ctx.fillStyle = 'rgba(120,255,180,0.3)';
      ctx.beginPath();
      ctx.arc(cp.x + 14, cp.y + 20, 22, 0, Math.PI*2);
      ctx.fill();
    }
  }

  function drawPlayer(p) {
    if (player.invuln > 0 && Math.floor(Date.now() / 60) % 2 === 0) return;
    var isZip = p.character === 'zip';
    var bodyCol = isZip ? '#5cb8ff' : '#ff88b8';
    var darkCol = isZip ? '#2088d0' : '#d0407a';
    var lightCol = isZip ? '#b8e0ff' : '#ffd0e8';
    var earInner = isZip ? '#d8ecff' : '#ffe0f0';
    var cx = p.x + p.w / 2, cy = p.y + p.h / 2;
    var bob = p.onGround ? Math.sin(p.animT) * 1.2 : 0;
    cy += bob;

    // shadow
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.ellipse(cx, p.y + p.h + 2, p.w / 2, 4, 0, 0, Math.PI*2);
    ctx.fill();

    // ears
    ctx.fillStyle = bodyCol;
    ctx.beginPath();
    ctx.ellipse(cx - 7, cy - 22, 5, 16, -0.12, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 7, cy - 22, 5, 16, 0.12, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = earInner;
    ctx.beginPath();
    ctx.ellipse(cx - 7, cy - 22, 2.2, 11, -0.12, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 7, cy - 22, 2.2, 11, 0.12, 0, Math.PI*2);
    ctx.fill();

    // body
    var grad = ctx.createRadialGradient(cx - 6, cy - 6, 3, cx, cy, 20);
    grad.addColorStop(0, lightCol);
    grad.addColorStop(1, bodyCol);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 16, 0, Math.PI*2);
    ctx.fill();
    // belly
    ctx.fillStyle = lightCol;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 4, 9, 7, 0, 0, Math.PI*2);
    ctx.fill();

    // eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx - 5, cy - 3, 5, 0, Math.PI*2);
    ctx.arc(cx + 5, cy - 3, 5, 0, Math.PI*2);
    ctx.fill();
    // pupils look in facing direction
    var lx = p.facing * 1.6;
    ctx.fillStyle = '#1a1a2a';
    ctx.beginPath();
    ctx.arc(cx - 5 + lx, cy - 3, 2.6, 0, Math.PI*2);
    ctx.arc(cx + 5 + lx, cy - 3, 2.6, 0, Math.PI*2);
    ctx.fill();
    // eye shine
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx - 6 + lx, cy - 4.5, 1, 0, Math.PI*2);
    ctx.arc(cx + 4 + lx, cy - 4.5, 1, 0, Math.PI*2);
    ctx.fill();

    // nose
    ctx.fillStyle = isZip ? '#ff4466' : '#ff2266';
    ctx.beginPath();
    ctx.arc(cx + lx, cy + 4, 2.4, 0, Math.PI*2);
    ctx.fill();

    // whiskers
    ctx.strokeStyle = 'rgba(40,40,60,0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy + 4); ctx.lineTo(cx - 15, cy + 2);
    ctx.moveTo(cx - 8, cy + 6); ctx.lineTo(cx - 15, cy + 8);
    ctx.moveTo(cx + 8, cy + 4); ctx.lineTo(cx + 15, cy + 2);
    ctx.moveTo(cx + 8, cy + 6); ctx.lineTo(cx + 15, cy + 8);
    ctx.stroke();

    // character badge
    if (isZip) {
      // blue cap
      ctx.fillStyle = '#204060';
      ctx.beginPath();
      ctx.arc(cx, cy - 10, 10, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(cx - 10, cy - 11, 20, 3);
    } else {
      // pink bow
      ctx.fillStyle = '#ff4488';
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy - 10);
      ctx.lineTo(cx - 4, cy - 14);
      ctx.lineTo(cx - 4, cy - 6);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + 10, cy - 10);
      ctx.lineTo(cx + 4, cy - 14);
      ctx.lineTo(cx + 4, cy - 6);
      ctx.closePath();
      ctx.fill();
    }

    // glide effect for Pip
    if (!isZip && !p.onGround && p.vy > 0 && (keys['ArrowUp']||keys['w']||keys['W']||keys[' '])) {
      ctx.fillStyle = 'rgba(255,180,220,0.6)';
      ctx.beginPath();
      ctx.ellipse(cx, cy - 20, 22, 8, 0, 0, Math.PI*2);
      ctx.fill();
    }

    // switch flash ring
    if (switchFlash > 0) {
      ctx.strokeStyle = 'rgba(255,255,180,' + (switchFlash / 18) + ')';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(cx, cy, 26 + (18 - switchFlash) * 2, 0, Math.PI*2);
      ctx.stroke();
    }
  }

  function drawParticles() {
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      ctx.globalAlpha = Math.min(1, p.life / 30);
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x - p.size/2, p.y - p.size/2, p.size, p.size);
    }
    ctx.globalAlpha = 1;
  }

  function drawHUD() {
    // top-left panel
    ctx.fillStyle = 'rgba(8,16,32,0.72)';
    roundRect(14, 14, 240, 88, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(120,180,240,0.5)';
    ctx.lineWidth = 2;
    roundRect(14, 14, 240, 88, 16);
    ctx.stroke();

    // score
    ctx.fillStyle = '#ffdd66';
    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.fillText('★ ' + String(score).padStart(4, '0'), 30, 44);
    // lives
    ctx.fillStyle = '#ff6688';
    ctx.font = 'bold 18px "Courier New", monospace';
    var hearts = '';
    for (var i = 0; i < Math.max(0, lives); i++) hearts += '♥ ';
    ctx.fillText(hearts, 30, 72);
    // level
    ctx.fillStyle = '#aac8e0';
    ctx.font = 'bold 13px "Courier New", monospace';
    ctx.fillText('LEVEL ' + (levelIndex + 1) + '/' + totalLevels, 30, 92);

    // top-right panel
    ctx.fillStyle = 'rgba(8,16,32,0.72)';
    roundRect(W - 220, 14, 206, 88, 16);
    ctx.fill();
    ctx.strokeStyle = 'rgba(120,180,240,0.5)';
    roundRect(W - 220, 14, 206, 88, 16);
    ctx.stroke();

    // carrots
    ctx.fillStyle = '#ffaa44';
    ctx.font = 'bold 22px "Courier New", monospace';
    var cCollected = level ? level.collected : 0;
    var cTotal = level ? level.totalCarrots : 0;
    ctx.fillText('🥕 ' + cCollected + '/' + cTotal, W - 205, 44);

    // character
    var isZip = player.character === 'zip';
    ctx.fillStyle = isZip ? '#5cb8ff' : '#ff88b8';
    ctx.font = 'bold 15px "Courier New", monospace';
    ctx.fillText('▶ ' + (isZip ? 'ZIP' : 'PIP'), W - 205, 72);

    // controls hint
    ctx.fillStyle = '#8898aa';
    ctx.font = '11px "Courier New", monospace';
    ctx.fillText('E=Switch  M=Mute  ←→=Move  ↑/SPACE=Jump', W - 205, 92);
  }

  function drawTitle() {
    drawSky();
    drawParallax();
    // darken
    ctx.fillStyle = 'rgba(6,10,24,0.65)';
    ctx.fillRect(0, 0, W, H);

    // Title
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffdd66';
    ctx.font = 'bold 68px "Trebuchet MS", sans-serif';
    ctx.shadowColor = '#ff8800'; ctx.shadowBlur = 20;
    ctx.fillText('Zip & Pip', W/2, 160);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#88ddff';
    ctx.font = 'bold 40px "Trebuchet MS", sans-serif';
    ctx.fillText('CARROT QUEST', W/2, 210);

    // Characters preview
    drawTitleChar(W/2 - 130, 280, 'zip');
    drawTitleChar(W/2 + 130, 280, 'pip');

    // Subtitle
    ctx.fillStyle = '#c8dae8';
    ctx.font = '16px "Courier New", monospace';
    ctx.fillText('Press SPACE or ENTER to start', W/2, 400);

    ctx.fillStyle = '#8898aa';
    ctx.font = '13px "Courier New", monospace';
    ctx.fillText('←→ / A D  Move  ·  ↑ / W / SPACE  Jump  ·  E  Switch  ·  M  Mute', W/2, 435);
    ctx.fillText('Collect carrots · Avoid spikes · Stomp enemies · Reach the flag!', W/2, 458);
    ctx.textAlign = 'left';
  }

  function drawTitleChar(x, y, type) {
    var isZip = type === 'zip';
    var bodyCol = isZip ? '#5cb8ff' : '#ff88b8';
    var lightCol = isZip ? '#b8e0ff' : '#ffd0e8';
    // shadow
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(x, y + 30, 24, 6, 0, 0, Math.PI*2);
    ctx.fill();
    // ears
    ctx.fillStyle = bodyCol;
    ctx.beginPath();
    ctx.ellipse(x - 10, y - 32, 6, 22, -0.1, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 10, y - 32, 6, 22, 0.1, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = isZip ? '#d8ecff' : '#ffe0f0';
    ctx.beginPath();
    ctx.ellipse(x - 10, y - 32, 3, 16, -0.1, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(x + 10, y - 32, 3, 16, 0.1, 0, Math.PI*2);
    ctx.fill();
    // body
    var g = ctx.createRadialGradient(x - 6, y - 6, 3, x, y, 24);
    g.addColorStop(0, lightCol);
    g.addColorStop(1, bodyCol);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI*2);
    ctx.fill();
    // eyes
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x - 7, y - 4, 7, 0, Math.PI*2);
    ctx.arc(x + 7, y - 4, 7, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#1a1a2a';
    ctx.beginPath();
    ctx.arc(x - 7, y - 4, 3.6, 0, Math.PI*2);
    ctx.arc(x + 7, y - 4, 3.6, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(x - 8, y - 6, 1.4, 0, Math.PI*2);
    ctx.arc(x + 6, y - 6, 1.4, 0, Math.PI*2);
    ctx.fill();
    // nose
    ctx.fillStyle = '#ff4466';
    ctx.beginPath();
    ctx.arc(x, y + 6, 3.2, 0, Math.PI*2);
    ctx.fill();
    // hat/bow
    if (isZip) {
      ctx.fillStyle = '#204060';
      ctx.beginPath();
      ctx.arc(x, y - 14, 13, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(x - 13, y - 15, 26, 4);
    } else {
      ctx.fillStyle = '#ff4488';
      ctx.beginPath();
      ctx.moveTo(x - 14, y - 14);
      ctx.lineTo(x - 5, y - 19);
      ctx.lineTo(x - 5, y - 9);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + 14, y - 14);
      ctx.lineTo(x + 5, y - 19);
      ctx.lineTo(x + 5, y - 9);
      ctx.closePath();
      ctx.fill();
    }
  }

  function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (state === 'title') {
      drawTitle();
      return;
    }

    drawSky();
    drawParallax();

    // shake
    var sx = 0, sy = 0;
    if (camera.shake > 1) {
      sx = (Math.random() - 0.5) * camera.shake;
      sy = (Math.random() - 0.5) * camera.shake;
    }

    ctx.save();
    ctx.translate(-camera.x + sx, sy);

    drawTiles();
    drawSpikes();
    drawCheckpoint();
    for (var bi = 0; bi < level.boxes.length; bi++) drawBox(level.boxes[bi]);
    for (var ci = 0; ci < level.carrots.length; ci++) {
      var c = level.carrots[ci];
      if (!c.taken) drawCarrot(c.x, c.y, Date.now());
    }
    for (var ei = 0; ei < level.enemies.length; ei++) drawEnemy(level.enemies[ei]);
    drawFlag();
    if (state !== 'death') drawPlayer(player);
    drawParticles();

    ctx.restore();

    // UI overlay
    drawHUD();

    // level complete banner
    if (state === 'levelComplete') {
      ctx.fillStyle = 'rgba(0,0,0,0.6)';
      ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffdd66';
      ctx.font = 'bold 56px "Trebuchet MS", sans-serif';
      ctx.shadowColor = '#ff8800'; ctx.shadowBlur = 16;
      ctx.fillText('LEVEL CLEAR!', W/2, H/2 - 20);
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 22px "Courier New", monospace';
      ctx.fillText('Carrots: ' + level.collected + '/' + level.totalCarrots, W/2, H/2 + 30);
      ctx.textAlign = 'left';
    }

    // death
    if (state === 'death') {
      ctx.fillStyle = 'rgba(120,0,0,0.35)';
      ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ff8888';
      ctx.font = 'bold 42px "Trebuchet MS", sans-serif';
      ctx.fillText('OUCH!', W/2, H/2);
      ctx.textAlign = 'left';
    }

    // game over
    if (state === 'gameOver') {
      ctx.fillStyle = 'rgba(6,10,24,0.85)';
      ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ff4466';
      ctx.font = 'bold 60px "Trebuchet MS", sans-serif';
      ctx.shadowColor = '#ff0000'; ctx.shadowBlur = 22;
      ctx.fillText('GAME OVER', W/2, H/2 - 20);
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 22px "Courier New", monospace';
      ctx.fillText('Final Score: ' + score, W/2, H/2 + 35);
      ctx.fillStyle = '#88ddff';
      ctx.font = '18px "Courier New", monospace';
      ctx.fillText('Press SPACE to return', W/2, H/2 + 80);
      ctx.textAlign = 'left';
    }

    // win
    if (state === 'win') {
      ctx.fillStyle = 'rgba(6,10,24,0.85)';
      ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffdd66';
      ctx.font = 'bold 60px "Trebuchet MS", sans-serif';
      ctx.shadowColor = '#ff8800'; ctx.shadowBlur = 24;
      ctx.fillText('🏆 YOU WIN! 🏆', W/2, H/2 - 40);
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#88ffaa';
      ctx.font = 'bold 26px "Courier New", monospace';
      ctx.fillText('All worlds cleared!', W/2, H/2 + 20);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px "Courier New", monospace';
      ctx.fillText('Final Score: ' + score, W/2, H/2 + 60);
      ctx.fillStyle = '#88ddff';
      ctx.font = '18px "Courier New", monospace';
      ctx.fillText('Press SPACE to play again', W/2, H/2 + 105);
      ctx.textAlign = 'left';
    }
  }

  // ============================================================
  // MAIN LOOP (fixed timestep for stable physics)
  // ============================================================
  var lastT = 0, acc = 0;
  var STEP = 1000 / 60;

  function loop(t) {
    if (!lastT) lastT = t;
    var delta = Math.min(t - lastT, 100);
    lastT = t;
    acc += delta;
    var safety = 0;
    while (acc >= STEP && safety < 5) {
      update();
      acc -= STEP;
      safety++;
    }
    draw();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
<\/script>
</body>
</html>`;

  // ========================= EXPOSE initGame =========================
  window.initGame = function initGame(wrapper) {
    if (!wrapper || typeof wrapper.replaceChildren !== 'function') {
      throw new Error('initGame requires a container element.');
    }
    var frame = document.createElement('iframe');
    frame.title = 'Zip & Pip: Carrot Quest';
    frame.setAttribute('allow', 'autoplay; fullscreen');
    frame.style.cssText = 'display:block;width:100%;max-width:960px;height:540px;border:0;border-radius:16px;background:#0a0e18;overflow:hidden;margin:0 auto;';
    frame.srcdoc = gameHTML;
    wrapper.replaceChildren(frame);
    return frame;
  };
})();
