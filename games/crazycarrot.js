/* Zip & Pip: Carrot Quest v3 — Themed Mechanics */
(function () {
  'use strict';

  const gameHTML = `<!doctype html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Zip &amp; Pip: Carrot Quest</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body {
    width: 100%; height: 100%;
    background: #0a0e18;
    overflow: hidden;
    font-family: 'Segoe UI', system-ui, sans-serif;
  }
  body { display: grid; place-items: center; }
  canvas {
    display: block;
    width: 100%;
    max-width: 100%;
    height: auto;
    aspect-ratio: 2 / 1;
    max-height: 100vh;
    background: #6fa8d0;
  }
</style>
</head>
<body>
<canvas id="c" width="960" height="480"></canvas>
<script>
(function() {
  var canvas = document.getElementById('c');
  var ctx = canvas.getContext('2d');
  var W = canvas.width, H = canvas.height;
  var TILE = 32;
  var GRAVITY = 0.72, MOVE = 4.4, JUMP = -14.2, MAXFALL = 16;

  // ============== AUDIO (theme music + mute recovery) ==============
  var audio = (function() {
    var actx = null, timer = null, step = 0, nextT = 0, muted = false, currentTheme = null;

    // 每个主题不同旋律
    var TRACKS = {
      grass: {
        bpm: 108,
        mel: [659,784,880,784, 659,523,587,659, 880,988,1047,988, 880,784,659,587,
              523,659,784,659, 523,440,494,523, 659,587,523,494, 440,494,523,587],
        bass:[131,131,165,165, 175,175,196,196, 131,131,165,165, 175,175,196,196,
              110,110,131,131, 147,147,165,165, 110,110,123,123, 131,131,147,147]
      },
      desert: {
        bpm: 96,
        mel: [587,698,784,880, 784,698,659,587, 523,587,659,784, 880,784,698,659,
              587,523,494,523, 587,659,698,784, 880,988,880,784, 698,659,587,523],
        bass:[110,110,147,147, 165,165,175,175, 110,110,147,147, 165,165,175,175,
              98,98,131,131, 147,147,165,165, 98,98,123,123, 131,131,147,147]
      },
      river: {
        bpm: 120,
        mel: [784,880,988,880, 1047,988,880,784, 698,784,880,988, 1047,1175,1047,988,
              880,784,698,784, 880,988,1047,880, 784,698,659,698, 784,880,988,784],
        bass:[131,131,196,196, 220,220,262,262, 175,175,220,220, 262,262,220,220,
              147,147,196,196, 220,220,247,247, 131,131,196,196, 220,220,247,247]
      },
      cave: {
        bpm: 80,
        mel: [262,311,349,415, 349,311,262,233, 262,311,415,466, 415,349,311,262,
              220,262,311,349, 311,262,233,196, 220,262,349,415, 349,311,262,220],
        bass:[65,65,82,82, 87,87,98,98, 65,65,82,82, 87,87,98,98,
              55,55,65,65, 73,73,82,82, 55,55,65,65, 73,73,82,82]
      },
      tower: {
        bpm: 132,
        mel: [880,988,1175,988, 880,784,880,988, 1047,1175,1319,1175, 1047,988,880,784,
              784,880,988,1047, 1175,1047,988,880, 880,988,1047,1175, 1319,1175,1047,988],
        bass:[165,165,220,220, 262,262,330,330, 196,196,247,247, 294,294,330,330,
              147,147,196,196, 247,247,294,294, 165,165,220,220, 262,262,294,294]
      },
      sky: {
        bpm: 100,
        mel: [1047,1175,1319,1175, 1047,988,880,784, 880,988,1047,1175, 1319,1175,1047,988,
              784,880,988,1047, 1175,1047,988,880, 988,1047,1175,1319, 1175,1047,988,880],
        bass:[175,175,262,262, 220,220,330,330, 165,165,247,247, 220,220,294,294,
              196,196,262,262, 247,247,330,330, 175,175,262,262, 220,220,294,294]
      }
    };

    function init() {
      if (actx) return;
      try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e) {}
    }
    function tone(freq, start, dur, type, vol) {
      if (!actx || muted) return;
      var o = actx.createOscillator(), g = actx.createGain();
      o.type = type || 'square';
      o.frequency.setValueAtTime(freq, start);
      g.gain.setValueAtTime(0, start);
      g.gain.linearRampToValueAtTime(vol || 0.04, start + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, start + dur);
      o.connect(g); g.connect(actx.destination);
      o.start(start); o.stop(start + dur + 0.05);
    }
    function schedule() {
      if (!actx || muted || !currentTheme) { timer = null; return; }
      var track = TRACKS[currentTheme] || TRACKS.grass;
      var stepDur = 60 / track.bpm / 2;
      var now = actx.currentTime;
      while (nextT < now + 0.4) {
        var s = step % 32;
        tone(track.mel[s], nextT, stepDur * 0.85, 'square', 0.022);
        tone(track.bass[s], nextT, stepDur * 0.9, 'triangle', 0.045);
        if (s % 4 === 0) tone(2000, nextT, 0.025, 'square', 0.014);
        nextT += stepDur;
        step++;
      }
      timer = setTimeout(schedule, 80);
    }
    function start(theme) {
      init();
      if (actx && actx.state === 'suspended') actx.resume();
      currentTheme = theme || 'grass';
      if (timer) clearTimeout(timer);
      step = 0;
      nextT = (actx ? actx.currentTime : 0) + 0.1;
      timer = null;
      schedule();
    }
    return {
      init: init,
      setTheme: function(theme) {
        if (currentTheme === theme) return;
        start(theme);
      },
      start: start,
      stop: function() {
        if (timer) { clearTimeout(timer); timer = null; }
        currentTheme = null;
      },
      jump: function() { if (actx && !muted) tone(520, actx.currentTime, 0.09, 'square', 0.045); },
      collect: function() { if (actx && !muted) { tone(880, actx.currentTime, 0.06, 'square', 0.05); tone(1320, actx.currentTime + 0.05, 0.1, 'square', 0.045); } },
      hurt: function() { if (actx && !muted) { tone(220, actx.currentTime, 0.15, 'sawtooth', 0.07); tone(110, actx.currentTime + 0.08, 0.2, 'sawtooth', 0.05); } },
      win: function() { if (actx && !muted) { var t = actx.currentTime; [523,659,784,1047,1319].forEach(function(f,i){ tone(f, t + i*0.09, 0.15, 'square', 0.06); }); } },
      switch: function() { if (actx && !muted) tone(700, actx.currentTime, 0.05, 'triangle', 0.05); },
      toggle: function() {
        muted = !muted;
        if (muted) {
          if (timer) { clearTimeout(timer); timer = null; }
        } else {
          // 恢复音乐
          if (!timer && currentTheme) {
            if (actx) nextT = Math.max(nextT, actx.currentTime + 0.05);
            schedule();
          }
        }
        return muted;
      },
      isMuted: function() { return muted; }
    };
  })();

  // ============== THEMES ==============
  var THEMES = {
    grass: { sky: ['#6fc5e8','#a8ddf0','#d4eef8'], dirtTop: '#5cb85c', dirtTopHi: '#8cd88c', dirt: '#7a4a2a', accent: '#88ff88' },
    desert: { sky: ['#f8b048','#f8d078','#f8e8c0'], dirtTop: '#e0b878', dirtTopHi: '#f0d8a0', dirt: '#b88850', accent: '#ffdd88' },
    river: { sky: ['#4a8ec8','#88c0e0','#d0e8f0'], dirtTop: '#4a9a6a', dirtTopHi: '#7ac88a', dirt: '#5a4030', accent: '#88ddff' },
    cave: { sky: ['#0a0a18','#1a1a28','#2a2a3a'], dirtTop: '#4a4a5a', dirtTopHi: '#6a6a7a', dirt: '#2a2a3a', accent: '#aa88ff' },
    tower: { sky: ['#2a1a3a','#5a3a6a','#a8689a'], dirtTop: '#6a5a7a', dirtTopHi: '#8a7a9a', dirt: '#4a3a5a', accent: '#ff88dd' },
    sky: { sky: ['#a0d0ff','#d0e8ff','#f0f8ff'], dirtTop: '#c8e0ff', dirtTopHi: '#e8f0ff', dirt: '#a8c0e0', accent: '#ffffff' }
  };

  // ============== LEVEL BUILDER ==============
  function buildLevel(cfg) {
    var W_T = cfg.width, H_T = cfg.height || 15;
    var groundY = cfg.groundY || 14;
    var tiles = [];
    for (var y = 0; y < H_T; y++) {
      var row = [];
      for (var x = 0; x < W_T; x++) row.push(' ');
      tiles.push(row);
    }
    var groundMask = [];
    for (var x = 0; x < W_T; x++) groundMask.push(false);
    (cfg.ground || [[0, W_T]]).forEach(function(seg) {
      var sx = seg[0], sw = seg[1];
      for (var x = sx; x < sx + sw && x < W_T; x++) groundMask[x] = true;
    });
    for (var gy = groundY; gy < H_T; gy++) {
      for (var x3 = 0; x3 < W_T; x3++) {
        if (groundMask[x3]) tiles[gy][x3] = '#';
      }
    }
    (cfg.platforms || []).forEach(function(p) {
      for (var dx = 0; dx < p.w; dx++) {
        for (var dy = 0; dy < (p.h || 1); dy++) {
          var px = p.x + dx, py = p.y + dy;
          if (px >= 0 && px < W_T && py >= 0 && py < H_T) tiles[py][px] = '#';
        }
      }
    });
    var spikes = [], enemies = [], carrots = [], boxes = [], movers = [];
    (cfg.spikes || []).forEach(function(s) {
      for (var i = 0; i < s[1]; i++) {
        spikes.push({ x: (s[0]+i)*TILE+4, y: groundY*TILE+14, w: TILE-8, h: 18 });
      }
    });
    (cfg.enemies || []).forEach(function(e) {
      var ey = (e.y !== undefined) ? e.y : groundY - 1;
      enemies.push({
        x: e.x * TILE, y: ey * TILE + 6, w: 26, h: 26,
        vx: 1.4, vy: 0,
        minX: Math.max(0, (e.x - 4) * TILE), maxX: (e.x + 4) * TILE,
        onGround: false, alive: true, phase: Math.random()*6.28,
        type: e.t || 'walker'
      });
    });
    var goalTile = (cfg.goal !== undefined ? cfg.goal : W_T - 6);
    (cfg.carrots || []).forEach(function(c) {
      // 强制胡萝卜在旗帜之前
      if (c[0] >= goalTile - 2) return;
      carrots.push({ x: c[0] * TILE + 6, y: c[1] * TILE + 6, taken: false });
    });
    (cfg.boxes || []).forEach(function(b) {
      boxes.push({ x: b[0]*TILE+2, y: b[1]*TILE+2, w: 28, h: 28, vx: 0, vy: 0, onGround: false });
    });
    var checkpoints = [];
    (cfg.checkpoints || []).forEach(function(cx) {
      if (cx >= goalTile - 2) return;
      checkpoints.push({ x: cx*TILE, y: (groundY-1)*TILE - 8, w: 32, h: 40, active: false, used: false });
    });
    // 风区 (沙漠)
    var wind = [];
    (cfg.wind || []).forEach(function(w) {
      wind.push({
        x: w.x * TILE, y: (w.y||groundY-3) * TILE,
        w: w.w * TILE, h: (w.h||3) * TILE,
        force: w.f || 0.35,   // 正数向右, 负数向左
        particles: []
      });
      // 初始化沙粒
      var last = wind[wind.length-1];
      for (var i = 0; i < 20; i++) {
        last.particles.push({
          x: Math.random() * last.w, y: Math.random() * last.h,
          vx: last.force * 4 + Math.random() * 2, life: Math.random() * 100
        });
      }
    });
    // 水域 (河流) - 死亡区域
    var water = [];
    (cfg.water || []).forEach(function(w) {
      water.push({
        x: w[0]*TILE, y: groundY*TILE, w: w[1]*TILE, h: TILE*1.5
      });
    });
    // 移动平台
    (cfg.movers || []).forEach(function(m) {
      movers.push({
        x: m.x*TILE, y: m.y*TILE, w: m.w*TILE, h: 16,
        axis: m.axis || 'x',
        originX: m.x*TILE, originY: m.y*TILE,
        range: (m.range || 3) * TILE,
        speed: m.speed || 1.2, t: Math.random() * 6.28
      });
    });
    var goal = { x: goalTile*TILE, y: (groundY-3)*TILE, w: 32, h: 96 };
    var spawn = { x: 2*TILE, y: (groundY-2)*TILE };
    return {
      tiles: tiles, width: W_T*TILE, height: H_T*TILE,
      theme: cfg.theme || 'grass',
      groundY: groundY,
      carrots: carrots, enemies: enemies, spikes: spikes, boxes: boxes,
      checkpoints: checkpoints, movers: movers, wind: wind, water: water,
      goal: goal, spawn: spawn,
      totalCarrots: carrots.length, collected: 0,
      name: cfg.name || ''
    };
  }

  // ============== LEVELS (12) ==============
  // 尖刺只放在有威胁的位置（跳跃落点/敌人区域），胡萝卜全部在旗帜前
  var LEVEL_CFGS = [
    // --------- 1-2 GRASS ---------
    {
      name: 'Meadow Stroll', theme: 'grass', width: 200, groundY: 14,
      ground: [[0,32],[36,22],[62,28],[94,26],[124,28],[156,44]],
      platforms: [
        {x:18,y:10,w:4},{x:40,y:9,w:4},{x:54,y:11,w:3},{x:74,y:8,w:5},
        {x:86,y:10,w:4},{x:104,y:9,w:5},{x:116,y:11,w:3},{x:140,y:9,w:4},
        {x:150,y:7,w:4},{x:170,y:9,w:5}
      ],
      spikes: [[33,2],[60,1],[92,1],[122,1]],  // 放在地面缺口边缘
      enemies: [
        {x:16,t:'walker'},{x:42,t:'walker'},{x:70,t:'hopper'},
        {x:98,t:'walker'},{x:126,t:'hopper'},{x:156,t:'walker'}
      ],
      carrots: [
        [5,12],[12,12],[20,9],[26,12],[34,12],[42,8],[48,12],[56,10],
        [64,12],[74,7],[82,12],[88,9],[98,12],[106,8],[114,12],[122,12],
        [130,12],[140,8],[148,12],[156,12],[164,12],[172,8],[180,12],[188,12]
      ],
      checkpoints: [60, 120, 170],
      goal: 190
    },
    {
      name: 'Rabbits Run', theme: 'grass', width: 210, groundY: 14,
      ground: [[0,26],[30,20],[54,22],[80,18],[102,22],[128,20],[152,22],[180,30]],
      platforms: [
        {x:14,y:9,w:4},{x:32,y:8,w:4},{x:44,y:10,w:4},{x:58,y:7,w:5},
        {x:74,y:9,w:5},{x:88,y:10,w:4},{x:106,y:8,w:4},{x:118,y:10,w:5},
        {x:136,y:9,w:5},{x:150,y:7,w:4},{x:166,y:9,w:4},{x:184,y:10,w:5},
        {x:198,y:8,w:4}
      ],
      spikes: [[27,1],[52,2],[78,1],[100,2],[126,1],[150,2],[178,1]],
      enemies: [
        {x:12,t:'walker'},{x:34,t:'walker'},{x:56,t:'hopper'},{x:82,t:'walker'},
        {x:104,t:'hopper'},{x:130,t:'walker'},{x:156,t:'hopper'},{x:186,t:'walker'}
      ],
      carrots: [
        [5,12],[10,12],[16,8],[22,12],[32,12],[38,12],[46,9],[52,12],
        [60,12],[68,12],[78,8],[86,12],[92,12],[100,12],[108,7],[116,12],
        [124,12],[132,12],[142,12],[152,6],[160,12],[170,8],[178,12],
        [188,12],[194,12],[200,7],[206,12]
      ],
      checkpoints: [55, 120, 175],
      goal: 200
    },
    // --------- 3-4 DESERT (Wind + Boxes) ---------
    {
      name: 'Windswept Dunes', theme: 'desert', width: 210, groundY: 14,
      ground: [[0,30],[34,24],[62,28],[94,26],[124,28],[156,30],[190,20]],
      platforms: [
        {x:14,y:9,w:4},{x:30,y:8,w:4},{x:46,y:10,w:3},{x:68,y:8,w:5},
        {x:86,y:11,w:4},{x:100,y:9,w:5},{x:118,y:7,w:4},{x:134,y:9,w:5},
        {x:152,y:8,w:4},{x:168,y:10,w:4},{x:184,y:9,w:4}
      ],
      // 风区会推玩家向左，必须推箱子挡风
      wind: [
        {x:35, y:10, w:20, h:4, f:0.42},
        {x:95, y:10, w:22, h:4, f:0.42},
        {x:157, y:10, w:20, h:4, f:0.42}
      ],
      // 箱子放在风区前，供 Zip 推动形成掩体
      boxes: [[33,13],[93,13],[155,13],[33,13],[93,13]],
      spikes: [[60,2],[122,1],[188,1]],
      enemies: [
        {x:16,t:'walker'},{x:48,t:'walker'},{x:76,t:'hopper'},
        {x:110,t:'walker'},{x:140,t:'hopper'},{x:178,t:'walker'}
      ],
      carrots: [
        [5,12],[10,12],[14,8],[22,12],[28,12],[36,12],[42,12],[48,9],
        [56,12],[64,12],[72,12],[80,12],[86,10],[94,12],[102,8],[110,12],
        [116,12],[124,12],[130,8],[140,12],[146,12],[154,7],[162,12],
        [172,12],[180,12],[188,12],[196,12]
      ],
      checkpoints: [50, 110, 170],
      goal: 200
    },
    {
      name: 'Scorching Sands', theme: 'desert', width: 220, groundY: 14,
      ground: [[0,26],[28,22],[52,24],[78,22],[102,24],[128,22],[152,24],[178,26],[206,14]],
      platforms: [
        {x:12,y:8,w:4},{x:28,y:10,w:4},{x:44,y:7,w:5},{x:62,y:9,w:4},
        {x:76,y:7,w:4},{x:92,y:10,w:5},{x:110,y:8,w:4},{x:124,y:6,w:4},
        {x:138,y:9,w:5},{x:154,y:7,w:4},{x:168,y:10,w:4},{x:184,y:8,w:5},
        {x:202,y:6,w:4}
      ],
      wind: [
        {x:27, y:10, w:24, h:4, f:0.44},
        {x:77, y:10, w:26, h:4, f:0.44},
        {x:127, y:10, w:26, h:4, f:0.44},
        {x:177, y:10, w:24, h:4, f:0.44}
      ],
      boxes: [[25,13],[75,13],[125,13],[175,13]],
      spikes: [[50,2],[100,2],[150,1],[204,1]],
      enemies: [
        {x:14,t:'walker'},{x:40,t:'hopper'},{x:66,t:'walker'},{x:90,t:'hopper'},
        {x:116,t:'walker'},{x:142,t:'hopper'},{x:166,t:'walker'},{x:194,t:'hopper'}
      ],
      carrots: [
        [5,12],[10,12],[14,7],[20,12],[26,12],[30,9],[36,12],[44,6],
        [52,12],[58,12],[64,12],[72,12],[78,6],[86,12],[94,9],[102,12],
        [108,12],[116,7],[122,5],[130,12],[138,8],[146,12],[154,12],
        [162,12],[170,9],[178,7],[186,12],[194,12],[202,5],[210,12],[218,12]
      ],
      checkpoints: [52, 108, 165],
      goal: 210
    },
    // --------- 5-6 RIVER (Water + Glide) ---------
    {
      name: 'Riverside Hop', theme: 'river', width: 220, groundY: 14,
      // 大段水域，必须用浮木/Pip 滑翔过去
      ground: [[0,20],[52,10],[110,12],[160,10],[208,12]],
      platforms: [
        // 每个浮木平台
        {x:24,y:11,w:3,h:1},{x:30,y:11,w:3,h:1},{x:36,y:11,w:3,h:1},{x:42,y:11,w:3,h:1},{x:48,y:11,w:3,h:1},
        {x:66,y:10,w:3,h:1},{x:72,y:10,w:3,h:1},{x:78,y:10,w:3,h:1},{x:84,y:10,w:3,h:1},{x:90,y:10,w:3,h:1},{x:96,y:10,w:3,h:1},{x:102,y:10,w:3,h:1},
        {x:126,y:10,w:3,h:1},{x:132,y:10,w:3,h:1},{x:138,y:10,w:3,h:1},{x:144,y:10,w:3,h:1},{x:150,y:10,w:3,h:1},{x:156,y:10,w:3,h:1},
        {x:174,y:10,w:3,h:1},{x:180,y:10,w:3,h:1},{x:186,y:10,w:3,h:1},{x:192,y:10,w:3,h:1},{x:198,y:10,w:3,h:1},
        // 高台
        {x:34,y:7,w:4},{x:80,y:6,w:5},{x:140,y:7,w:4},{x:186,y:7,w:4}
      ],
      // 大面积水域
      water: [[20,32],[62,48],[122,38],[170,38]],
      spikes: [],
      enemies: [
        {x:15,t:'walker'},{x:32,t:'walker'},{x:56,t:'walker'},{x:88,t:'hopper'},
        {x:116,t:'walker'},{x:134,t:'hopper'},{x:164,t:'walker'},{x:200,t:'hopper'}
      ],
      carrots: [
        [5,12],[10,12],[15,12],[26,9],[32,9],[40,9],[46,9],[58,12],
        [70,8],[76,8],[82,8],[88,8],[94,8],[100,8],[112,12],[128,8],
        [134,8],[140,8],[146,8],[152,8],[164,12],[178,8],[184,8],[190,8],
        [196,8],[210,12],[214,12]
      ],
      checkpoints: [56, 116, 164],
      goal: 214
    },
    {
      name: 'Grand Crossing', theme: 'river', width: 240, groundY: 14,
      ground: [[0,18],[42,8],[96,10],[152,8],[210,10],[234,6]],
      platforms: [
        // 一系列浮木
        {x:20,y:12,w:3,h:1},{x:26,y:12,w:3,h:1},{x:32,y:12,w:3,h:1},{x:38,y:12,w:3,h:1},
        {x:56,y:11,w:3,h:1},{x:62,y:11,w:3,h:1},{x:68,y:11,w:3,h:1},{x:74,y:11,w:3,h:1},{x:80,y:11,w:3,h:1},{x:86,y:11,w:3,h:1},{x:92,y:11,w:3,h:1},
        {x:110,y:10,w:3,h:1},{x:116,y:10,w:3,h:1},{x:122,y:10,w:3,h:1},{x:128,y:10,w:3,h:1},{x:134,y:10,w:3,h:1},{x:140,y:10,w:3,h:1},{x:146,y:10,w:3,h:1},
        {x:164,y:11,w:3,h:1},{x:170,y:11,w:3,h:1},{x:176,y:11,w:3,h:1},{x:182,y:11,w:3,h:1},{x:188,y:11,w:3,h:1},{x:194,y:11,w:3,h:1},{x:200,y:11,w:3,h:1},
        {x:222,y:11,w:3,h:1},{x:228,y:11,w:3,h:1},
        // 高台挑战
        {x:46,y:7,w:4},{x:100,y:6,w:4},{x:156,y:6,w:4},{x:216,y:7,w:4}
      ],
      water: [[18,24],[50,46],[106,46],[158,52],[204,30]],
      spikes: [],
      enemies: [
        {x:12,t:'walker'},{x:30,t:'hopper'},{x:66,t:'walker'},{x:88,t:'hopper'},
        {x:112,t:'walker'},{x:136,t:'hopper'},{x:170,t:'walker'},{x:194,t:'hopper'},{x:226,t:'walker'}
      ],
      carrots: [
        [5,12],[10,12],[15,12],[22,10],[28,10],[34,10],[40,10],[48,6],
        [58,9],[64,9],[70,9],[76,9],[82,9],[88,9],[94,9],[102,5],
        [112,8],[118,8],[124,8],[130,8],[136,8],[142,8],[148,8],
        [158,5],[166,9],[172,9],[178,9],[184,9],[190,9],[196,9],[202,9],
        [216,6],[224,9],[230,9],[236,12]
      ],
      checkpoints: [46, 100, 158, 216],
      goal: 234
    },
    // --------- 7-8 CAVE (Darkness + Crystal) ---------
    {
      name: 'Glowing Depths', theme: 'cave', width: 200, groundY: 14,
      ground: [[0,28],[32,22],[58,26],[88,22],[114,26],[144,26],[174,26]],
      platforms: [
        {x:16,y:9,w:4},{x:30,y:7,w:4},{x:44,y:10,w:4},{x:56,y:8,w:5},
        {x:74,y:6,w:4},{x:86,y:9,w:4},{x:102,y:7,w:5},{x:118,y:10,w:4},
        {x:134,y:8,w:4},{x:148,y:6,w:4},{x:162,y:9,w:4},{x:178,y:7,w:5}
      ],
      spikes: [[30,1],[56,2],[86,1],[112,2],[142,1],[172,1]],
      enemies: [
        {x:14,t:'walker'},{x:36,t:'walker'},{x:60,t:'hopper'},
        {x:92,t:'walker'},{x:120,t:'hopper'},{x:150,t:'walker'},{x:180,t:'hopper'}
      ],
      carrots: [
        [5,12],[10,12],[18,8],[26,12],[32,6],[38,12],[46,12],[58,7],
        [66,12],[74,5],[82,12],[90,12],[100,12],[104,6],[112,12],[120,12],
        [128,12],[134,7],[142,12],[150,5],[158,12],[166,12],[176,12],[182,6],[190,12]
      ],
      checkpoints: [44, 100, 156],
      goal: 190
    },
    {
      name: 'Crystal Labyrinth', theme: 'cave', width: 210, groundY: 14,
      ground: [[0,24],[28,20],[52,22],[76,20],[98,22],[122,20],[144,22],[168,20],[190,20]],
      platforms: [
        {x:12,y:8,w:4},{x:28,y:10,w:4},{x:44,y:7,w:5},{x:62,y:9,w:4},
        {x:78,y:7,w:4},{x:94,y:10,w:4},{x:110,y:6,w:5},{x:128,y:9,w:4},
        {x:144,y:7,w:5},{x:160,y:10,w:4},{x:176,y:8,w:4},{x:192,y:6,w:5}
      ],
      spikes: [[26,1],[50,2],[74,1],[96,2],[120,1],[142,2],[166,1],[188,1]],
      enemies: [
        {x:14,t:'walker'},{x:32,t:'hopper'},{x:54,t:'walker'},{x:80,t:'hopper'},
        {x:104,t:'walker'},{x:126,t:'hopper'},{x:148,t:'walker'},{x:172,t:'hopper'},{x:196,t:'walker'}
      ],
      carrots: [
        [5,12],[13,7],[20,12],[30,9],[36,12],[46,6],[54,12],[64,12],
        [70,12],[80,6],[88,12],[96,12],[102,9],[112,5],[120,12],[130,12],
        [136,8],[146,6],[154,12],[164,12],[172,9],[180,12],[188,12],[194,5],[204,12]
      ],
      checkpoints: [50, 110, 165],
      goal: 204
    },
    // --------- 9-10 TOWER (Vertical + Movers) ---------
    {
      name: 'Tower Climb', theme: 'tower', width: 200, groundY: 14,
      ground: [[0,32],[36,24],[62,28],[94,24],[122,28],[154,28],[184,16]],
      platforms: [
        // 垂直平台链
        {x:10,y:11,w:3},{x:18,y:9,w:3},{x:26,y:7,w:3},{x:34,y:5,w:3},
        {x:44,y:11,w:3},{x:52,y:9,w:3},{x:60,y:7,w:3},{x:68,y:5,w:3},{x:76,y:7,w:3},
        {x:88,y:10,w:4},{x:98,y:8,w:3},{x:106,y:6,w:3},{x:114,y:4,w:3},
        {x:126,y:9,w:4},{x:136,y:7,w:3},{x:144,y:5,w:3},{x:152,y:7,w:3},
        {x:162,y:10,w:4},{x:172,y:8,w:3},{x:180,y:6,w:3},{x:188,y:4,w:3}
      ],
      // 移动平台
      movers: [
        {x:38, y:8, w:3, axis:'y', range:5, speed:1.0},
        {x:82, y:8, w:3, axis:'y', range:5, speed:1.0},
        {x:122, y:8, w:3, axis:'y', range:5, speed:1.0},
        {x:160, y:8, w:3, axis:'y', range:5, speed:1.0}
      ],
      spikes: [[42,1],[84,1],[124,1],[162,1]],
      enemies: [
        {x:15,t:'walker'},{x:46,t:'hopper'},{x:74,t:'walker'},
        {x:106,t:'hopper'},{x:140,t:'walker'},{x:176,t:'hopper'}
      ],
      carrots: [
        [5,12],[11,10],[19,8],[27,6],[35,4],[44,10],[52,8],[60,6],
        [68,4],[76,6],[88,9],[98,7],[106,5],[114,3],[126,8],[136,6],
        [144,4],[152,6],[162,9],[172,7],[180,5],[188,3],[196,12]
      ],
      checkpoints: [46, 96, 146],
      goal: 190
    },
    {
      name: 'Sky Tower', theme: 'tower', width: 220, groundY: 14,
      ground: [[0,22],[26,16],[46,20],[70,14],[88,18],[110,14],[130,18],[152,14],[172,18],[194,16],[214,6]],
      platforms: [
        {x:8,y:9,w:3},{x:16,y:7,w:3},{x:24,y:5,w:3},{x:32,y:3,w:3},{x:40,y:5,w:3},{x:48,y:7,w:3},{x:56,y:9,w:3},
        {x:68,y:11,w:3},{x:76,y:9,w:3},{x:84,y:7,w:3},{x:92,y:5,w:3},{x:100,y:7,w:3},{x:108,y:9,w:3},
        {x:120,y:11,w:3},{x:128,y:9,w:3},{x:136,y:7,w:3},{x:144,y:5,w:3},{x:152,y:7,w:3},{x:160,y:9,w:3},
        {x:172,y:11,w:3},{x:180,y:9,w:3},{x:188,y:7,w:3},{x:196,y:5,w:3},{x:204,y:7,w:3},{x:212,y:9,w:3}
      ],
      movers: [
        {x:60, y:8, w:3, axis:'y', range:6, speed:1.1},
        {x:112, y:8, w:3, axis:'y', range:6, speed:1.1},
        {x:164, y:8, w:3, axis:'y', range:6, speed:1.1}
      ],
      spikes: [[22,1],[68,1],[110,1],[152,1],[192,1]],
      enemies: [
        {x:14,t:'walker'},{x:36,t:'hopper'},{x:54,t:'walker'},{x:86,t:'hopper'},
        {x:104,t:'walker'},{x:132,t:'hopper'},{x:158,t:'walker'},{x:188,t:'hopper'},{x:210,t:'walker'}
      ],
      carrots: [
        [5,12],[9,8],[17,6],[25,4],[33,2],[40,4],[48,6],[56,8],
        [68,10],[76,8],[84,6],[92,4],[100,6],[108,8],[120,10],[128,8],
        [136,6],[144,4],[152,6],[160,8],[172,10],[180,8],[188,6],
        [196,4],[204,6],[212,8],[218,12]
      ],
      checkpoints: [48, 100, 152, 204],
      goal: 214
    },
    // --------- 11-12 SKY (Force glide) ---------
    {
      name: 'Floating Isles', theme: 'sky', width: 220, groundY: 14,
      // 大量空隙，需要 Pip 滑翔或精确跳跃
      ground: [[0,14],[22,8],[38,10],[54,8],[68,10],[86,8],[100,10],[118,8],[132,10],[150,8],[164,10],[182,8],[196,10],[214,6]],
      platforms: [
        {x:8,y:9,w:3},{x:18,y:7,w:3},{x:28,y:9,w:3},{x:36,y:11,w:3},{x:44,y:9,w:3},
        {x:52,y:7,w:3},{x:60,y:9,w:3},{x:70,y:9,w:3},{x:78,y:7,w:3},{x:86,y:5,w:3},
        {x:94,y:7,w:3},{x:105,y:9,w:3},{x:113,y:7,w:3},{x:122,y:5,w:3},{x:130,y:7,w:3},
        {x:140,y:9,w:3},{x:150,y:7,w:3},{x:158,y:5,w:3},{x:166,y:7,w:3},{x:175,y:9,w:3},
        {x:185,y:7,w:3},{x:193,y:5,w:3},{x:202,y:7,w:3},{x:212,y:9,w:3}
      ],
      spikes: [],
      enemies: [
        {x:12,t:'hopper'},{x:30,t:'walker'},{x:48,t:'hopper'},{x:64,t:'walker'},
        {x:80,t:'hopper'},{x:98,t:'walker'},{x:118,t:'hopper'},{x:138,t:'walker'},
        {x:156,t:'hopper'},{x:176,t:'walker'},{x:196,t:'hopper'}
      ],
      carrots: [
        [5,12],[9,8],[18,6],[25,8],[32,10],[42,8],[50,6],[58,8],
        [70,8],[78,6],[86,4],[94,6],[105,8],[113,6],[122,4],[130,6],
        [140,8],[150,6],[158,4],[166,6],[175,8],[185,6],[193,4],[202,6],[212,8],[218,12]
      ],
      checkpoints: [42, 90, 140, 190],
      goal: 213
    },
    {
      name: 'Celestial Temple', theme: 'sky', width: 240, groundY: 14,
      ground: [[0,14],[20,10],[34,12],[50,10],[64,14],[82,10],[96,12],[114,10],[128,14],[148,10],[162,12],[180,10],[194,12],[212,10],[226,14]],
      platforms: [
        {x:6,y:10,w:3},{x:14,y:8,w:3},{x:22,y:6,w:3},{x:30,y:4,w:3},{x:38,y:6,w:3},{x:46,y:8,w:3},
        {x:55,y:10,w:3},{x:63,y:8,w:3},{x:71,y:6,w:3},{x:79,y:4,w:3},{x:87,y:6,w:3},{x:95,y:8,w:3},
        {x:105,y:10,w:3},{x:113,y:8,w:3},{x:121,y:6,w:3},{x:129,y:4,w:3},{x:137,y:6,w:3},{x:145,y:8,w:3},
        {x:155,y:10,w:3},{x:163,y:8,w:3},{x:171,y:6,w:3},{x:179,y:4,w:3},{x:187,y:6,w:3},{x:195,y:8,w:3},
        {x:205,y:10,w:3},{x:213,y:8,w:3},{x:221,y:6,w:3},{x:229,y:4,w:3},{x:237,y:6,w:3}
      ],
      spikes: [[24,1],[58,1],[100,1],[142,1],[184,1],[218,1]],
      enemies: [
        {x:12,t:'walker'},{x:28,t:'hopper'},{x:44,t:'walker'},{x:64,t:'hopper'},
        {x:82,t:'walker'},{x:100,t:'hopper'},{x:118,t:'walker'},{x:136,t:'hopper'},
        {x:154,t:'walker'},{x:172,t:'hopper'},{x:190,t:'walker'},{x:208,t:'hopper'},{x:228,t:'walker'}
      ],
      carrots: [
        [5,12],[7,9],[15,7],[23,5],[31,3],[38,5],[46,7],[55,9],
        [63,7],[71,5],[79,3],[87,5],[95,7],[105,9],[113,7],[121,5],
        [129,3],[137,5],[145,7],[155,9],[163,7],[171,5],[179,3],[187,5],
        [195,7],[205,9],[213,7],[221,5],[229,3],[237,5],[243,12]
      ],
      checkpoints: [40, 90, 140, 190],
      goal: 234
    }
  ];

  // ============== STATE ==============
  var level = null;
  var levelIndex = 0;
  var totalLevels = LEVEL_CFGS.length;
  var player = {
    x: 50, y: 400, w: 28, h: 40, vx: 0, vy: 0,
    onGround: false, facing: 1, character: 'zip',
    invuln: 0, jumpHeld: false, canDouble: true, animT: 0, coyote: 0, jumpBuffer: 0,
    ridingMover: null
  };
  var camera = { x: 0, shake: 0 };
  var score = 0, lives = 3, keys = {};
  var state = 'title';
  var stateTimer = 0, switchFlash = 0;
  var particles = [];
  var grassParticles = [];

  function spawnParticles(x, y, color, count) {
    for (var i = 0; i < (count||8); i++) {
      var ang = Math.random() * Math.PI * 2;
      var sp = 1 + Math.random() * 4;
      particles.push({
        x: x, y: y, vx: Math.cos(ang)*sp, vy: Math.sin(ang)*sp - 1,
        life: 30 + Math.random()*20, color: color, size: 3 + Math.random()*4
      });
    }
  }

  // ============== INPUT ==============
  document.addEventListener('keydown', function(e) {
    keys[e.key] = true;
    var k = e.key;
    if ([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','W','A','S','D'].indexOf(k) !== -1) e.preventDefault();
    if (state === 'title' && (k === ' ' || k === 'Enter')) { startGame(); return; }
    if (state === 'gameOver' || state === 'win') { if (k === ' ' || k === 'Enter') { state = 'title'; audio.stop(); } return; }
    if (state === 'playing') {
      if (k === 'e' || k === 'E') {
        player.character = player.character === 'zip' ? 'pip' : 'zip';
        switchFlash = 18; audio.switch();
      }
      if (k === 'r' || k === 'R') { die(); }
    }
    if (k === 'm' || k === 'M') { audio.toggle(); }
  });
  document.addEventListener('keyup', function(e) { keys[e.key] = false; });

  // ============== FLOW ==============
  function startGame() {
    levelIndex = 0; score = 0; lives = 3;
    loadLevel(0);
    state = 'playing';
    audio.start(LEVEL_CFGS[0].theme);
  }
  function loadLevel(idx) {
    level = buildLevel(LEVEL_CFGS[idx]);
    player.x = level.spawn.x;
    player.y = level.spawn.y;
    player.vx = 0; player.vy = 0;
    player.character = 'zip';
    player.invuln = 0;
    player.canDouble = true;
    player.ridingMover = null;
    camera.x = 0;
    particles = [];
    grassParticles = [];
    // 切主题音乐
    audio.setTheme(LEVEL_CFGS[idx].theme);
  }
  function nextLevel() {
    levelIndex++;
    if (levelIndex >= totalLevels) {
      state = 'win'; audio.win(); audio.stop();
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
    if (lives <= 0) { state = 'gameOver'; audio.stop(); }
    else { state = 'death'; stateTimer = 50; }
  }

  // ============== COLLISION ==============
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

  // ============== UPDATE ==============
  function update() {
    if (camera.shake > 0) camera.shake *= 0.88;
    if (state === 'death') {
      stateTimer--;
      if (stateTimer <= 0) { loadLevel(levelIndex); state = 'playing'; }
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
    if (player.coyote > 0) player.coyote--;
    if (player.jumpBuffer > 0) player.jumpBuffer--;

    var left  = keys['ArrowLeft']  || keys['a'] || keys['A'];
    var right = keys['ArrowRight'] || keys['d'] || keys['D'];
    var jump  = keys['ArrowUp']    || keys['w'] || keys['W'] || keys[' '];

    player.vx = 0;
    if (left)  { player.vx = -MOVE; player.facing = -1; }
    if (right) { player.vx =  MOVE; player.facing =  1; }
    if (left || right) player.animT += 0.25; else player.animT *= 0.9;

    // 风区推力
    for (var wi = 0; wi < level.wind.length; wi++) {
      var wz = level.wind[wi];
      if (aabb(player, wz)) {
        player.vx += wz.force * 4;
        // 风粒
        wz.particles.forEach(function(p) {
          p.x += p.vx; p.life -= 1;
          if (p.x > wz.w) { p.x = 0; p.life = 40 + Math.random()*40; }
          if (p.life < 0) p.life = 40 + Math.random()*40;
        });
      }
    }

    // 跳跃
    if (jump && !player.jumpHeld) player.jumpBuffer = 6;
    player.jumpHeld = jump;

    if (player.jumpBuffer > 0 && (player.onGround || player.coyote > 0)) {
      player.vy = JUMP;
      player.onGround = false;
      player.coyote = 0;
      player.jumpBuffer = 0;
      audio.jump();
    }
    // Pip 滑翔
    if (player.character === 'pip' && !player.onGround && player.vy > 0 && jump) {
      player.vy = Math.min(player.vy, 2.6);
    }
    // Zip 二段跳
    if (player.character === 'zip' && player.jumpBuffer > 0 && !player.onGround && player.canDouble) {
      player.vy = JUMP * 0.85;
      player.canDouble = false;
      player.jumpBuffer = 0;
      audio.jump();
      spawnParticles(player.x + 14, player.y + 38, '#a8d8ff', 10);
    }

    player.vy += GRAVITY;
    if (player.vy > MAXFALL) player.vy = MAXFALL;

    // 水平移动
    var nx = player.x + player.vx;
    if (!tileCollides(nx, player.y, player.w, player.h)) {
      player.x = nx;
    } else if (!tileCollides(nx, player.y - 6, player.w, player.h)) {
      player.y -= 6; player.x = nx;
    }
    // 推箱子
    for (var bi = 0; bi < level.boxes.length; bi++) {
      var bx = level.boxes[bi];
      if (aabb(player, bx)) {
        var pushDir = player.vx > 0 ? 1 : -1;
        var tryX = bx.x + pushDir * Math.abs(player.vx);
        if (!tileCollides(tryX, bx.y, bx.w, bx.h)) {
          var blocked = false;
          for (var bj = 0; bj < level.boxes.length; bj++) {
            if (bj === bi) continue;
            if (aabb({x:tryX,y:bx.y,w:bx.w,h:bx.h}, level.boxes[bj])) blocked = true;
          }
          if (!blocked) bx.x = tryX;
        } else { player.x -= player.vx; }
      }
    }

    // 移动平台更新
    for (var mi = 0; mi < level.movers.length; mi++) {
      var m = level.movers[mi];
      m.t += 0.02 * m.speed;
      var prevX = m.x, prevY = m.y;
      if (m.axis === 'x') {
        m.x = m.originX + Math.sin(m.t) * m.range;
      } else {
        m.y = m.originY + Math.sin(m.t) * m.range;
      }
      // 玩家站在上面跟随
      if (player.onGround) {
        var pFeet = {x: player.x, y: player.y + 1, w: player.w, h: 4};
        if (aabb(pFeet, m)) {
          player.x += m.x - prevX;
          player.y += m.y - prevY;
        }
      }
    }

    // 垂直
    player.onGround = false;
    var ny = player.y + player.vy;
    if (!tileCollides(player.x, ny, player.w, player.h)) {
      player.y = ny;
    } else {
      if (player.vy > 0) {
        while (!tileCollides(player.x, player.y + 1, player.w, player.h)) player.y += 1;
        player.onGround = true;
        player.canDouble = true;
        player.coyote = 6;
        player.vy = 0;
      } else {
        while (!tileCollides(player.x, player.y - 1, player.w, player.h)) player.y -= 1;
        player.vy = 0;
      }
    }
    // 站移动平台上
    if (!player.onGround) {
      for (var mi2 = 0; mi2 < level.movers.length; mi2++) {
        var m2 = level.movers[mi2];
        var pFeet2 = {x: player.x, y: player.y + player.h, w: player.w, h: 4};
        var mBox = {x: m2.x, y: m2.y, w: m2.w, h: m2.h};
        if (aabb(pFeet2, mBox) && player.vy >= 0) {
          player.y = m2.y - player.h;
          player.vy = 0;
          player.onGround = true;
          player.canDouble = true;
          player.coyote = 6;
        }
      }
    }

    if (player.x < 0) player.x = 0;
    if (player.x + player.w > level.width) player.x = level.width - player.w;
    if (player.y > level.height + 150) { die(); return; }

    // 尖刺
    if (player.invuln <= 0) {
      for (var si = 0; si < level.spikes.length; si++) {
        var sp = level.spikes[si];
        if (aabb(player, sp)) {
          if (player.y + player.h > sp.y + 6) { die(); return; }
        }
      }
    }
    // 水域
    for (var wj = 0; wj < level.water.length; wj++) {
      var wa = level.water[wj];
      if (aabb(player, wa)) { die(); return; }
    }

    // 敌人
    for (var ei = 0; ei < level.enemies.length; ei++) {
      var e = level.enemies[ei];
      if (!e.alive) continue;
      e.phase += 0.08;
      e.x += e.vx;
      e.vy += GRAVITY;
      if (e.vy > MAXFALL) e.vy = MAXFALL;
      var eny = e.y + e.vy;
      if (!tileCollides(e.x, eny, e.w, e.h)) { e.y = eny; e.onGround = false; }
      else {
        if (e.vy > 0) {
          while (!tileCollides(e.x, e.y + 1, e.w, e.h)) e.y += 1;
          e.onGround = true;
        }
        e.vy = 0;
      }
      if (e.onGround) e.vy = 0;
      var aheadX = e.vx > 0 ? e.x + e.w + 2 : e.x - 2;
      if (tileCollides(aheadX, e.y, 2, e.h) || e.x <= e.minX || e.x + e.w >= e.maxX) e.vx = -e.vx;
      var belowX = e.vx > 0 ? e.x + e.w : e.x - 1;
      if (!tileCollides(belowX, e.y + e.h + 2, 2, 2) && e.onGround) e.vx = -e.vx;
      if (e.type === 'hopper' && e.onGround && Math.random() < 0.02) e.vy = -9;
      if (player.invuln <= 0 && aabb(player, e)) {
        if (player.vy > 1 && player.y + player.h < e.y + 14) {
          e.alive = false; player.vy = -9;
          score += 50;
          spawnParticles(e.x + 13, e.y + 13, '#ffcc44', 14);
          audio.collect();
        } else { die(); return; }
      }
    }

    // 胡萝卜
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

    // 检查点
    for (var cpi = 0; cpi < level.checkpoints.length; cpi++) {
      var cp = level.checkpoints[cpi];
      if (!cp.used && aabb(player, cp)) {
        cp.used = true; cp.active = true;
        level.spawn = { x: cp.x, y: cp.y + 8 };
        spawnParticles(cp.x + 16, cp.y + 20, '#44ff88', 20);
        audio.collect(); score += 20;
      }
    }

    // 终点
    if (aabb(player, level.goal)) {
      score += 200 + level.collected * 3;
      audio.win();
      state = 'levelComplete';
      stateTimer = 120;
    }

    // 粒子
    for (var pi = particles.length - 1; pi >= 0; pi--) {
      var p = particles[pi];
      p.x += p.vx; p.y += p.vy;
      p.vy += 0.15;
      p.life--;
      if (p.life <= 0) particles.splice(pi, 1);
    }
    // 草粒
    if (level.theme === 'grass' && Math.random() < 0.3) {
      grassParticles.push({
        x: camera.x + Math.random() * W,
        y: -10,
        vx: 0.5 + Math.random(),
        vy: 0.5 + Math.random() * 0.5,
        r: 1 + Math.random() * 2,
        life: 200
      });
    }
    for (var gi = grassParticles.length - 1; gi >= 0; gi--) {
      var gp = grassParticles[gi];
      gp.x += gp.vx; gp.y += gp.vy; gp.life--;
      if (gp.life <= 0) grassParticles.splice(gi, 1);
    }

    // 相机
    var targetX = player.x + player.w / 2 - W / 2;
    if (targetX < 0) targetX = 0;
    if (targetX > level.width - W) targetX = level.width - W;
    camera.x += (targetX - camera.x) * 0.15;
  }

  // ============== DRAW ==============
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
  function getTheme() { return THEMES[level ? level.theme : 'grass'] || THEMES.grass; }

  function drawSky(theme) {
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, theme.sky[0]);
    g.addColorStop(0.5, theme.sky[1]);
    g.addColorStop(1, theme.sky[2]);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function drawParallax(theme) {
    var isCave = level && level.theme === 'cave';
    var isSky = level && level.theme === 'sky';
    var isTower = level && level.theme === 'tower';
    var isDesert = level && level.theme === 'desert';
    if (!isCave && !isTower) {
      ctx.fillStyle = isDesert ? 'rgba(255,220,140,0.9)' : 'rgba(255,240,160,0.8)';
      ctx.beginPath();
      ctx.arc(W - 130, 90, 48, 0, Math.PI*2);
      ctx.fill();
    }
    if (isTower) {
      // 塔内星空
      ctx.fillStyle = '#fff';
      for (var si = 0; si < 40; si++) {
        var sx = (si * 137 + camera.x * 0.1) % W;
        var sy = (si * 73) % (H * 0.5);
        var ss = (si % 3) * 0.5 + 0.5;
        ctx.fillRect(sx, sy, ss, ss);
      }
    }
    ctx.save();
    ctx.translate(-camera.x * 0.25, 0);
    var farCol = isCave ? 'rgba(20,20,40,0.7)' : isSky ? 'rgba(180,210,255,0.7)' : isDesert ? 'rgba(200,150,80,0.4)' : isTower ? 'rgba(60,40,80,0.6)' : 'rgba(60,110,160,0.55)';
    ctx.fillStyle = farCol;
    for (var i = 0; i < 15; i++) {
      var mx = i * 500 + 200;
      ctx.beginPath();
      ctx.moveTo(mx - 250, 420);
      ctx.lineTo(mx, isCave ? 200 : isDesert ? 250 : 170);
      ctx.lineTo(mx + 250, 420);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
    ctx.save();
    ctx.translate(-camera.x * 0.5, 0);
    var midCol = isCave ? 'rgba(40,40,60,0.5)' : isSky ? 'rgba(220,235,255,0.7)' : isDesert ? 'rgba(220,180,110,0.5)' : isTower ? 'rgba(90,70,120,0.5)' : 'rgba(90,160,120,0.6)';
    ctx.fillStyle = midCol;
    for (var j = 0; j < 25; j++) {
      var hx = j * 350;
      ctx.beginPath();
      ctx.arc(hx + 180, 440, 180, Math.PI, 0);
      ctx.fill();
    }
    ctx.restore();
    if (!isCave && !isTower) {
      ctx.save();
      ctx.translate(-camera.x * 0.15, 0);
      ctx.fillStyle = isSky ? 'rgba(255,255,255,0.95)' : isDesert ? 'rgba(255,240,210,0.6)' : 'rgba(255,255,255,0.7)';
      for (var k = 0; k < 20; k++) {
        var cx = k * 380 + 80;
        var cy = 50 + (k % 3) * 45;
        ctx.beginPath();
        ctx.arc(cx, cy, 28, 0, Math.PI*2);
        ctx.arc(cx + 32, cy - 8, 24, 0, Math.PI*2);
        ctx.arc(cx + 60, cy + 6, 26, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawTiles(theme) {
    if (!level) return;
    var x1 = Math.max(0, Math.floor(camera.x / TILE) - 1);
    var x2 = Math.min(level.tiles[0].length - 1, Math.ceil((camera.x + W) / TILE) + 1);
    for (var ty = 0; ty < level.tiles.length; ty++) {
      for (var tx = x1; tx <= x2; tx++) {
        if (level.tiles[ty][tx] !== '#') continue;
        var px = tx * TILE, py = ty * TILE;
        var isTop = ty === 0 || level.tiles[ty-1][tx] !== '#';
        if (isTop) {
          ctx.fillStyle = theme.dirtTop;
          ctx.fillRect(px, py, TILE, 8);
          ctx.fillStyle = theme.dirtTopHi;
          ctx.fillRect(px, py, TILE, 3);
          ctx.fillStyle = theme.dirt;
          ctx.fillRect(px, py + 8, TILE, TILE - 8);
        } else {
          ctx.fillStyle = theme.dirt;
          ctx.fillRect(px, py, TILE, TILE);
        }
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fillRect(px, py + TILE - 2, TILE, 2);
        ctx.fillRect(px + TILE - 2, py, 2, TILE);
      }
    }
  }

  // 水域绘制
  function drawWater() {
    if (!level) return;
    for (var i = 0; i < level.water.length; i++) {
      var w = level.water[i];
      if (w.x + w.w < camera.x || w.x > camera.x + W) continue;
      var wave = Math.sin(Date.now() / 400 + i) * 3;
      // 水面
      var grad = ctx.createLinearGradient(0, w.y, 0, w.y + w.h);
      grad.addColorStop(0, 'rgba(80,180,255,0.75)');
      grad.addColorStop(1, 'rgba(20,80,160,0.9)');
      ctx.fillStyle = grad;
      ctx.fillRect(w.x, w.y + wave, w.w, w.h);
      // 水波
      ctx.fillStyle = 'rgba(160,220,255,0.6)';
      for (var k = 0; k < w.w; k += 20) {
        var ww = Math.sin(Date.now() / 300 + k * 0.1 + i) * 3;
        ctx.fillRect(w.x + k, w.y + ww, 10, 2);
      }
    }
  }

  // 风区绘制
  function drawWind() {
    if (!level) return;
    for (var i = 0; i < level.wind.length; i++) {
      var w = level.wind[i];
      if (w.x + w.w < camera.x || w.x > camera.x + W) continue;
      // 半透明黄色区域
      ctx.fillStyle = 'rgba(255,220,120,0.12)';
      ctx.fillRect(w.x, w.y, w.w, w.h);
      // 流向箭头
      ctx.strokeStyle = 'rgba(255,240,180,0.6)';
      ctx.lineWidth = 2;
      for (var k = 0; k < 6; k++) {
        var ax = w.x + ((k * 80 + Date.now() * 0.2) % w.w);
        var ay = w.y + 20 + (k % 2) * 40;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(ax + 20, ay);
        ctx.lineTo(ax + 14, ay - 4);
        ctx.moveTo(ax + 20, ay);
        ctx.lineTo(ax + 14, ay + 4);
        ctx.stroke();
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
    ctx.fillStyle = 'rgba(255,180,80,0.25)';
    ctx.beginPath();
    ctx.arc(x + 12, y + 12, 16, 0, Math.PI*2);
    ctx.fill();
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
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(x + 8, y + 10, 2, 6);
  }

  function drawBox(box) {
    ctx.fillStyle = '#a06838';
    roundRect(box.x, box.y, box.w, box.h, 4); ctx.fill();
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

  function drawMovers() {
    if (!level) return;
    for (var i = 0; i < level.movers.length; i++) {
      var m = level.movers[i];
      if (m.x + m.w < camera.x || m.x > camera.x + W) continue;
      // 平台轨道
      ctx.strokeStyle = 'rgba(255,255,255,0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      if (m.axis === 'y') {
        ctx.moveTo(m.originX + m.w/2, m.originY);
        ctx.lineTo(m.originX + m.w/2, m.originY + m.range);
      } else {
        ctx.moveTo(m.originX, m.originY + m.h/2);
        ctx.lineTo(m.originX + m.range, m.originY + m.h/2);
      }
      ctx.stroke();
      ctx.setLineDash([]);
      // 平台本身
      ctx.fillStyle = '#8866aa';
      roundRect(m.x, m.y, m.w, m.h, 4);
      ctx.fill();
      ctx.fillStyle = '#b088dd';
      ctx.fillRect(m.x + 2, m.y + 2, m.w - 4, 4);
    }
  }

  function drawEnemy(e) {
    if (!e.alive) return;
    if (e.x + e.w < camera.x || e.x > camera.x + W) return;
    var squish = Math.sin(e.phase) * 1.5;
    var cx = e.x + 13, cy = e.y + 13 + squish;
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath();
    ctx.ellipse(cx, e.y + e.h, 12, 3, 0, 0, Math.PI*2);
    ctx.fill();
    var color = e.type === 'walker' ? '#a84a6a' : '#c860a0';
    var grad = ctx.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, 14);
    grad.addColorStop(0, '#e888b0');
    grad.addColorStop(1, color);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 13, 0, Math.PI*2);
    ctx.fill();
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
    ctx.strokeStyle = '#3a2030';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy + 5, 3, 0, Math.PI);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(cx - 7, cy + 11, 4, 3, 0, 0, Math.PI*2);
    ctx.ellipse(cx + 7, cy + 11, 4, 3, 0, 0, Math.PI*2);
    ctx.fill();
  }

  function drawGoal() {
    if (!level || !level.goal) return;
    var f = level.goal;
    if (f.x + f.w < camera.x - 50 || f.x > camera.x + W + 50) return;
    ctx.fillStyle = '#888';
    ctx.fillRect(f.x + 13, f.y, 4, f.h);
    ctx.fillStyle = '#aaa';
    ctx.fillRect(f.x + 13, f.y, 2, f.h);
    ctx.fillStyle = '#ffcc44';
    ctx.beginPath();
    ctx.arc(f.x + 15, f.y - 2, 6, 0, Math.PI*2);
    ctx.fill();
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
    ctx.fillStyle = '#ffee88';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('★', f.x + 40, f.y + 38);
    ctx.textAlign = 'left';
  }

  function drawCheckpoints() {
    if (!level) return;
    for (var i = 0; i < level.checkpoints.length; i++) {
      var cp = level.checkpoints[i];
      if (cp.x + cp.w < camera.x - 30 || cp.x > camera.x + W + 30) continue;
      ctx.fillStyle = cp.active ? '#44ff88' : '#6688aa';
      ctx.fillRect(cp.x + 12, cp.y, 4, cp.h);
      ctx.fillStyle = cp.active ? '#88ffaa' : '#aaccdd';
      ctx.beginPath();
      ctx.moveTo(cp.x + 16, cp.y + 4);
      ctx.lineTo(cp.x + 30, cp.y + 12);
      ctx.lineTo(cp.x + 16, cp.y + 20);
      ctx.closePath();
      ctx.fill();
    }
  }

  function drawPlayer(p) {
    if (player.invuln > 0 && Math.floor(Date.now() / 60) % 2 === 0) return;
    var isZip = p.character === 'zip';
    var bodyCol = isZip ? '#5cb8ff' : '#ff88b8';
    var lightCol = isZip ? '#b8e0ff' : '#ffd0e8';
    var earInner = isZip ? '#d8ecff' : '#ffe0f0';
    var cx = p.x + p.w / 2, cy = p.y + p.h / 2;
    var bob = p.onGround ? Math.sin(p.animT) * 1.2 : 0;
    cy += bob;
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath();
    ctx.ellipse(cx, p.y + p.h + 2, p.w / 2, 4, 0, 0, Math.PI*2);
    ctx.fill();
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
    var grad = ctx.createRadialGradient(cx - 6, cy - 6, 3, cx, cy, 20);
    grad.addColorStop(0, lightCol);
    grad.addColorStop(1, bodyCol);
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, 16, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = lightCol;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 4, 9, 7, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx - 5, cy - 3, 5, 0, Math.PI*2);
    ctx.arc(cx + 5, cy - 3, 5, 0, Math.PI*2);
    ctx.fill();
    var lx = p.facing * 1.6;
    ctx.fillStyle = '#1a1a2a';
    ctx.beginPath();
    ctx.arc(cx - 5 + lx, cy - 3, 2.6, 0, Math.PI*2);
    ctx.arc(cx + 5 + lx, cy - 3, 2.6, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cx - 6 + lx, cy - 4.5, 1, 0, Math.PI*2);
    ctx.arc(cx + 4 + lx, cy - 4.5, 1, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = isZip ? '#ff4466' : '#ff2266';
    ctx.beginPath();
    ctx.arc(cx + lx, cy + 4, 2.4, 0, Math.PI*2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(40,40,60,0.6)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy + 4); ctx.lineTo(cx - 15, cy + 2);
    ctx.moveTo(cx - 8, cy + 6); ctx.lineTo(cx - 15, cy + 8);
    ctx.moveTo(cx + 8, cy + 4); ctx.lineTo(cx + 15, cy + 2);
    ctx.moveTo(cx + 8, cy + 6); ctx.lineTo(cx + 15, cy + 8);
    ctx.stroke();
    if (isZip) {
      ctx.fillStyle = '#204060';
      ctx.beginPath();
      ctx.arc(cx, cy - 10, 10, Math.PI, 0);
      ctx.fill();
      ctx.fillRect(cx - 10, cy - 11, 20, 3);
    } else {
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
    if (!isZip && !p.onGround && p.vy > 0 && (keys['ArrowUp']||keys['w']||keys['W']||keys[' '])) {
      ctx.fillStyle = 'rgba(255,180,220,0.7)';
      ctx.beginPath();
      ctx.ellipse(cx, cy - 24, 26, 10, 0, 0, Math.PI*2);
      ctx.fill();
    }
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
    for (var g = 0; g < grassParticles.length; g++) {
      var gp = grassParticles[g];
      ctx.globalAlpha = Math.min(1, gp.life / 200);
      ctx.fillStyle = '#88dd66';
      ctx.beginPath();
      ctx.arc(gp.x, gp.y, gp.r, 0, Math.PI*2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  // 洞穴黑暗覆盖
  function drawCaveDarkness() {
    if (!level || level.theme !== 'cave') return;
    var cx = player.x + player.w/2 - camera.x;
    var cy = player.y + player.h/2;
    var r = 160;
    var g = ctx.createRadialGradient(cx, cy, 30, cx, cy, r);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(0.7, 'rgba(0,0,0,0.6)');
    g.addColorStop(1, 'rgba(0,0,0,0.92)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
  }

  function drawHUD() {
    ctx.fillStyle = 'rgba(8,16,32,0.72)';
    roundRect(14, 14, 280, 92, 16); ctx.fill();
    ctx.strokeStyle = 'rgba(120,180,240,0.5)';
    ctx.lineWidth = 2;
    roundRect(14, 14, 280, 92, 16); ctx.stroke();
    ctx.fillStyle = '#ffdd66';
    ctx.font = 'bold 22px "Courier New", monospace';
    ctx.fillText('★ ' + String(score).padStart(5, '0'), 30, 44);
    ctx.fillStyle = '#ff6688';
    ctx.font = 'bold 18px "Courier New", monospace';
    var hearts = '';
    for (var i = 0; i < Math.max(0, lives); i++) hearts += '♥ ';
    ctx.fillText(hearts, 30, 72);
    ctx.fillStyle = '#aac8e0';
    ctx.font = 'bold 13px "Courier New", monospace';
    ctx.fillText('LV ' + (levelIndex + 1) + '/' + totalLevels + '  ' + (level ? level.name : ''), 30, 92);

    ctx.fillStyle = 'rgba(8,16,32,0.72)';
    roundRect(W - 250, 14, 236, 92, 16); ctx.fill();
    ctx.strokeStyle = 'rgba(120,180,240,0.5)';
    roundRect(W - 250, 14, 236, 92, 16); ctx.stroke();
    ctx.fillStyle = '#ffaa44';
    ctx.font = 'bold 22px "Courier New", monospace';
    var c1 = level ? level.collected : 0;
    var c2 = level ? level.totalCarrots : 0;
    ctx.fillText('🥕 ' + c1 + '/' + c2, W - 235, 44);
    var isZip = player.character === 'zip';
    ctx.fillStyle = isZip ? '#5cb8ff' : '#ff88b8';
    ctx.font = 'bold 15px "Courier New", monospace';
    ctx.fillText('▶ ' + (isZip ? 'ZIP (2x Jump)' : 'PIP (Glide)'), W - 235, 72);
    ctx.fillStyle = '#8898aa';
    ctx.font = '11px "Courier New", monospace';
    ctx.fillText('E=Switch  M=Mute' + (audio.isMuted()?' [OFF]':'') + '  R=Retry', W - 235, 92);
  }

  function drawTitle() {
    drawSky(THEMES.grass);
    drawParallax(THEMES.grass);
    ctx.fillStyle = 'rgba(6,10,24,0.7)';
    ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffdd66';
    ctx.font = 'bold 72px "Trebuchet MS", sans-serif';
    ctx.shadowColor = '#ff8800'; ctx.shadowBlur = 22;
    ctx.fillText('Zip & Pip', W/2, 140);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#88ddff';
    ctx.font = 'bold 40px "Trebuchet MS", sans-serif';
    ctx.fillText('CARROT QUEST', W/2, 190);
    ctx.fillStyle = '#ffbb66';
    ctx.font = 'bold 20px "Trebuchet MS", sans-serif';
    ctx.fillText('v3 · Themed Worlds', W/2, 222);
    drawTitleChar(W/2 - 140, 305, 'zip');
    drawTitleChar(W/2 + 140, 305, 'pip');
    ctx.fillStyle = '#c8dae8';
    ctx.font = 'bold 18px "Courier New", monospace';
    ctx.fillText('Press SPACE / ENTER to start', W/2, 415);
    ctx.fillStyle = '#8898aa';
    ctx.font = '11px "Courier New", monospace';
    ctx.fillText('←→ Move  ·  ↑/W/SPACE Jump  ·  E Switch  ·  M Mute  ·  R Retry', W/2, 442);
    ctx.fillText('12 levels · 6 themed worlds · Wind · Water · Darkness · Movers · Glide', W/2, 462);
    ctx.textAlign = 'left';
  }

  function drawTitleChar(x, y, type) {
    var isZip = type === 'zip';
    var bodyCol = isZip ? '#5cb8ff' : '#ff88b8';
    var lightCol = isZip ? '#b8e0ff' : '#ffd0e8';
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath();
    ctx.ellipse(x, y + 30, 24, 6, 0, 0, Math.PI*2);
    ctx.fill();
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
    var g = ctx.createRadialGradient(x - 6, y - 6, 3, x, y, 24);
    g.addColorStop(0, lightCol);
    g.addColorStop(1, bodyCol);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, 22, 0, Math.PI*2);
    ctx.fill();
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
    ctx.fillStyle = '#ff4466';
    ctx.beginPath();
    ctx.arc(x, y + 6, 3.2, 0, Math.PI*2);
    ctx.fill();
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
    if (state === 'title') { drawTitle(); return; }
    var theme = getTheme();
    drawSky(theme);
    drawParallax(theme);
    var sx = 0, sy = 0;
    if (camera.shake > 1) {
      sx = (Math.random() - 0.5) * camera.shake;
      sy = (Math.random() - 0.5) * camera.shake;
    }
    ctx.save();
    ctx.translate(-camera.x + sx, sy);
    drawTiles(theme);
    drawWater();
    drawWind();
    drawSpikes();
    drawCheckpoints();
    for (var bi = 0; bi < level.boxes.length; bi++) drawBox(level.boxes[bi]);
    drawMovers();
    for (var ci = 0; ci < level.carrots.length; ci++) {
      var c = level.carrots[ci];
      if (!c.taken) drawCarrot(c.x, c.y, Date.now());
    }
    for (var ei = 0; ei < level.enemies.length; ei++) drawEnemy(level.enemies[ei]);
    drawGoal();
    if (state !== 'death') drawPlayer(player);
    drawParticles();
    ctx.restore();
    // 洞穴黑暗覆盖（世界绘制后）
    drawCaveDarkness();
    drawHUD();
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
    if (state === 'death') {
      ctx.fillStyle = 'rgba(120,0,0,0.35)';
      ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ff8888';
      ctx.font = 'bold 42px "Trebuchet MS", sans-serif';
      ctx.fillText('OUCH!', W/2, H/2);
      ctx.textAlign = 'left';
    }
    if (state === 'gameOver') {
      ctx.fillStyle = 'rgba(6,10,24,0.88)';
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
    if (state === 'win') {
      ctx.fillStyle = 'rgba(6,10,24,0.88)';
      ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffdd66';
      ctx.font = 'bold 60px "Trebuchet MS", sans-serif';
      ctx.shadowColor = '#ff8800'; ctx.shadowBlur = 24;
      ctx.fillText('🏆 YOU WIN! 🏆', W/2, H/2 - 40);
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#88ffaa';
      ctx.font = 'bold 26px "Courier New", monospace';
      ctx.fillText('All ' + totalLevels + ' levels cleared!', W/2, H/2 + 20);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 20px "Courier New", monospace';
      ctx.fillText('Final Score: ' + score, W/2, H/2 + 60);
      ctx.fillStyle = '#88ddff';
      ctx.font = '18px "Courier New", monospace';
      ctx.fillText('Press SPACE to play again', W/2, H/2 + 105);
      ctx.textAlign = 'left';
    }
  }

  var lastT = 0, acc = 0;
  var STEP = 1000 / 60;
  function loop(t) {
    if (!lastT) lastT = t;
    var delta = Math.min(t - lastT, 100);
    lastT = t;
    acc += delta;
    var safety = 0;
    while (acc >= STEP && safety < 5) { update(); acc -= STEP; safety++; }
    draw();
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
<\/script>
</body>
</html>`;

  window.initGame = function initGame(wrapper) {
    if (!wrapper || typeof wrapper.replaceChildren !== 'function') {
      throw new Error('initGame requires a container element.');
    }
    var frame = document.createElement('iframe');
    frame.title = 'Zip & Pip: Carrot Quest';
    frame.setAttribute('allow', 'autoplay; fullscreen');
    frame.style.cssText = 'display:block;width:100%;max-width:100%;aspect-ratio:2/1;border:0;border-radius:16px;background:#0a0e18;overflow:hidden;margin:0 auto;';
    frame.srcdoc = gameHTML;
    wrapper.replaceChildren(frame);
    return frame;
  };
})();
