/* Zip & Pip: Carrot Quest v2 — 12 Themed Levels */
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

  // ============== AUDIO ==============
  var audio = (function() {
    var actx = null, musicTimer = null, musicStep = 0, musicTime = 0, muted = false;
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
    var MEL = [659,784,880,784, 659,523,587,659, 880,988,1047,988, 880,784,659,587,
               523,659,784,659, 523,440,494,523, 659,587,523,494, 440,494,523,587];
    var BASS = [131,131,165,165, 175,175,196,196, 131,131,165,165, 175,175,196,196,
                110,110,131,131, 147,147,165,165, 110,110,123,123, 131,131,147,147];
    var STEP = 0.155;
    function schedule() {
      if (!actx || muted) return;
      var now = actx.currentTime;
      while (musicTime < now + 0.4) {
        var s = musicStep % 32;
        tone(MEL[s], musicTime, 0.13, 'square', 0.024);
        tone(BASS[s], musicTime, 0.14, 'triangle', 0.05);
        if (s % 4 === 0) tone(2000, musicTime, 0.03, 'square', 0.018);
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
        musicTime = actx.currentTime + 0.1; musicStep = 0; schedule();
      },
      stop: function() { if (musicTimer) { clearTimeout(musicTimer); musicTimer = null; } },
      jump: function() { if (actx) tone(520, actx.currentTime, 0.09, 'square', 0.045); },
      collect: function() { if (actx) { tone(880, actx.currentTime, 0.06, 'square', 0.05); tone(1320, actx.currentTime + 0.05, 0.1, 'square', 0.045); } },
      hurt: function() { if (actx) { tone(220, actx.currentTime, 0.15, 'sawtooth', 0.07); tone(110, actx.currentTime + 0.08, 0.2, 'sawtooth', 0.05); } },
      win: function() { if (actx) { var t = actx.currentTime; [523,659,784,1047,1319].forEach(function(f,i){ tone(f, t + i*0.09, 0.15, 'square', 0.06); }); } },
      switch: function() { if (actx) tone(700, actx.currentTime, 0.05, 'triangle', 0.05); },
      toggle: function() { muted = !muted; return muted; }
    };
  })();

  // ============== THEMES ==============
  var THEMES = {
    grass: { sky: ['#6fc5e8','#a8ddf0','#d4eef8'], dirtTop: '#5cb85c', dirtTopHi: '#8cd88c', dirt: '#7a4a2a', deco: 'tree' },
    desert: { sky: ['#f8c878','#f8e0a8','#f8f0d0'], dirtTop: '#e0b878', dirtTopHi: '#f0d8a0', dirt: '#b88850', deco: 'cactus' },
    river: { sky: ['#4a8ec8','#88c0e0','#d0e8f0'], dirtTop: '#4a9a6a', dirtTopHi: '#7ac88a', dirt: '#5a4030', deco: 'rock' },
    cave: { sky: ['#1a1a28','#2a2a3a','#3a3a4a'], dirtTop: '#4a4a5a', dirtTopHi: '#6a6a7a', dirt: '#2a2a3a', deco: 'crystal' },
    tower: { sky: ['#2a1a3a','#5a3a6a','#a8689a'], dirtTop: '#6a5a7a', dirtTopHi: '#8a7a9a', dirt: '#4a3a5a', deco: 'brick' },
    sky: { sky: ['#a0d0ff','#d0e8ff','#f0f8ff'], dirtTop: '#c8e0ff', dirtTopHi: '#e8f0ff', dirt: '#a8c0e0', deco: 'cloud' }
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
    // 地面
    var groundMask = [];
    for (var x = 0; x < W_T; x++) groundMask.push(false);
    (cfg.ground || []).forEach(function(seg) {
      var sx = seg[0], sw = seg[1];
      for (var x = sx; x < sx + sw && x < W_T; x++) groundMask[x] = true;
    });
    // 如果没提供 ground，就整条铺满
    if (!cfg.ground) for (var x2 = 0; x2 < W_T; x2++) groundMask[x2] = true;
    for (var gy = groundY; gy < H_T; gy++) {
      for (var x3 = 0; x3 < W_T; x3++) {
        if (groundMask[x3]) tiles[gy][x3] = '#';
      }
    }
    // 平台
    (cfg.platforms || []).forEach(function(p) {
      for (var dx = 0; dx < p.w; dx++) {
        for (var dy = 0; dy < (p.h || 1); dy++) {
          var px = p.x + dx, py = p.y + dy;
          if (px >= 0 && px < W_T && py >= 0 && py < H_T) tiles[py][px] = '#';
        }
      }
    });
    // 收集
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
    (cfg.carrots || []).forEach(function(c) {
      carrots.push({ x: c[0] * TILE + 6, y: c[1] * TILE + 6, taken: false });
    });
    (cfg.boxes || []).forEach(function(b) {
      boxes.push({ x: b[0]*TILE+2, y: b[1]*TILE+2, w: 28, h: 28, vx: 0, vy: 0, onGround: false });
    });
    // 检查点
    var checkpoints = [];
    (cfg.checkpoints || []).forEach(function(cx) {
      checkpoints.push({ x: cx*TILE, y: (groundY-1)*TILE - 8, w: 32, h: 40, active: false, used: false });
    });
    // 移动平台
    (cfg.movers || []).forEach(function(m) {
      movers.push({
        x: m.x*TILE, y: m.y*TILE, w: m.w*TILE, h: 16,
        axis: m.axis || 'x', from: m.from*TILE, to: m.to*TILE,
        speed: m.speed || 1, dir: 1
      });
    });
    var goal = { x: (cfg.goal !== undefined ? cfg.goal : W_T - 6)*TILE, y: (groundY-3)*TILE, w: 32, h: 96 };
    // spawn
    var spawn = { x: 2*TILE, y: (groundY-2)*TILE };
    return {
      tiles: tiles, width: W_T*TILE, height: H_T*TILE,
      theme: cfg.theme || 'grass',
      groundY: groundY,
      carrots: carrots, enemies: enemies, spikes: spikes, boxes: boxes,
      checkpoints: checkpoints, movers: movers, goal: goal, spawn: spawn,
      totalCarrots: carrots.length, collected: 0
    };
  }

  // ============== LEVELS ==============
  // 每关宽约 240 瓦片 (7680px)
  var LEVEL_CFGS = [
    // --- 1-2: GRASS ---
    {
      name: 'Green Hills 1', theme: 'grass', width: 220, groundY: 14,
      ground: [[0,30],[33,25],[61,30],[94,28],[125,30],[158,30],[191,29]],
      platforms: [
        {x:20,y:10,w:4},{x:40,y:9,w:4},{x:55,y:11,w:3},{x:75,y:8,w:5},
        {x:88,y:10,w:4},{x:105,y:9,w:5},{x:118,y:11,w:3},{x:140,y:9,w:4},
        {x:150,y:7,w:4},{x:170,y:9,w:5},{x:185,y:11,w:4}
      ],
      spikes: [[68,2],[130,2],[175,1]],
      enemies: [
        {x:15,t:'walker'},{x:42,t:'walker'},{x:66,t:'hopper'},
        {x:95,t:'walker'},{x:125,t:'hopper'},{x:155,t:'walker'},{x:185,t:'hopper'}
      ],
      carrots: [
        [5,12],[12,12],[20,9],[25,12],[32,12],[40,8],[46,12],[55,10],
        [62,12],[68,12],[75,7],[82,12],[88,9],[96,12],[105,8],[112,12],
        [118,10],[125,12],[132,12],[140,8],[148,12],[155,12],[163,12],[170,8],[178,12],[185,10],[195,12],[205,12],[215,12]
      ],
      checkpoints: [70, 130, 190],
      goal: 213
    },
    {
      name: 'Green Hills 2', theme: 'grass', width: 230, groundY: 14,
      ground: [[0,25],[28,22],[52,20],[76,25],[104,22],[130,26],[160,22],[186,26],[214,16]],
      platforms: [
        {x:15,y:9,w:4},{x:34,y:8,w:4},{x:46,y:10,w:4},{x:58,y:7,w:5},
        {x:80,y:9,w:5},{x:94,y:10,w:4},{x:110,y:8,w:4},{x:122,y:10,w:5},
        {x:142,y:9,w:5},{x:156,y:7,w:4},{x:172,y:9,w:4},{x:190,y:10,w:5},
        {x:206,y:8,w:4}
      ],
      spikes: [[36,3],[88,2],[146,2],[196,2]],
      enemies: [
        {x:12,t:'walker'},{x:30,t:'walker'},{x:50,t:'hopper'},{x:68,t:'walker'},
        {x:88,t:'hopper'},{x:108,t:'walker'},{x:125,t:'walker'},{x:145,t:'hopper'},
        {x:165,t:'walker'},{x:185,t:'hopper'},{x:205,t:'walker'},{x:222,t:'walker'}
      ],
      carrots: [
        [5,12],[10,12],[16,8],[22,12],[30,12],[36,12],[42,12],[48,9],
        [55,12],[62,12],[70,12],[80,8],[86,12],[93,12],[100,12],[107,9],
        [115,12],[122,12],[130,12],[140,12],[148,12],[156,6],[163,12],
        [172,8],[180,12],[190,12],[196,12],[204,12],[212,12],[222,12]
      ],
      checkpoints: [55, 115, 175],
      goal: 224
    },
    // --- 3-4: DESERT ---
    {
      name: 'Desert Dunes', theme: 'desert', width: 220, groundY: 14,
      ground: [[0,28],[31,22],[56,28],[87,25],[115,28],[146,25],[174,28],[205,15]],
      platforms: [
        {x:14,y:9,w:4},{x:35,y:8,w:4},{x:48,y:10,w:3},{x:65,y:8,w:5},
        {x:82,y:11,w:4},{x:96,y:9,w:5},{x:112,y:7,w:4},{x:125,y:9,w:5},
        {x:142,y:8,w:4},{x:155,y:10,w:4},{x:170,y:8,w:5},{x:188,y:9,w:4},
        {x:200,y:7,w:4}
      ],
      spikes: [[40,2],[70,2],[105,2],[160,2],[195,2]],
      enemies: [
        {x:15,t:'walker'},{x:38,t:'hopper'},{x:60,t:'walker'},{x:80,t:'hopper'},
        {x:100,t:'walker'},{x:120,t:'hopper'},{x:140,t:'walker'},{x:165,t:'hopper'},
        {x:185,t:'walker'},{x:210,t:'hopper'}
      ],
      carrots: [
        [5,12],[14,8],[20,12],[30,12],[36,7],[43,12],[50,12],[58,12],
        [66,7],[73,12],[80,12],[88,10],[96,8],[105,12],[113,6],[122,12],
        [128,8],[137,12],[143,7],[152,12],[160,12],[170,7],[178,12],
        [186,12],[193,12],[200,6],[210,12],[218,12]
      ],
      checkpoints: [50, 105, 165],
      goal: 213
    },
    {
      name: 'Desert Ruins', theme: 'desert', width: 230, groundY: 14,
      ground: [[0,22],[26,20],[50,22],[76,20],[100,22],[126,20],[152,22],[182,20],[208,22]],
      platforms: [
        {x:12,y:8,w:4},{x:28,y:10,w:4},{x:40,y:7,w:5},{x:56,y:9,w:4},
        {x:70,y:7,w:4},{x:84,y:10,w:5},{x:100,y:8,w:4},{x:115,y:6,w:4},
        {x:128,y:9,w:5},{x:144,y:7,w:4},{x:158,y:10,w:4},{x:172,y:8,w:5},
        {x:190,y:6,w:4},{x:205,y:9,w:4},{x:220,y:7,w:4}
      ],
      spikes: [[32,2],[62,3],[90,2],[138,2],[178,3],[200,2]],
      enemies: [
        {x:14,t:'walker'},{x:30,t:'hopper'},{x:48,t:'walker'},{x:66,t:'hopper'},
        {x:82,t:'walker'},{x:100,t:'hopper'},{x:118,t:'walker'},{x:136,t:'hopper'},
        {x:155,t:'walker'},{x:172,t:'hopper'},{x:195,t:'walker'},{x:215,t:'hopper'}
      ],
      carrots: [
        [5,12],[13,7],[20,12],[29,9],[36,12],[43,6],[50,12],[58,12],
        [64,12],[72,6],[80,12],[88,12],[96,12],[102,7],[110,12],[118,5],
        [125,12],[132,8],[140,12],[148,12],[156,12],[164,9],[172,7],
        [180,12],[188,12],[193,5],[202,12],[212,12],[222,6],[228,12]
      ],
      checkpoints: [55, 115, 180],
      goal: 224
    },
    // --- 5-6: RIVER ---
    {
      name: 'River Rapids', theme: 'river', width: 230, groundY: 14,
      ground: [[0,18],[22,15],[42,14],[61,15],[82,12],[99,15],[120,12],[138,15],[159,12],[178,15],[199,15],[220,10]],
      platforms: [
        {x:14,y:10,w:3},{x:32,y:9,w:4},{x:50,y:8,w:3},{x:68,y:9,w:4},
        {x:88,y:10,w:3},{x:108,y:9,w:4},{x:126,y:8,w:3},{x:146,y:9,w:4},
        {x:166,y:10,w:3},{x:186,y:9,w:4},{x:206,y:8,w:3}
      ],
      spikes: [],
      enemies: [
        {x:15,t:'walker'},{x:35,t:'hopper'},{x:55,t:'walker'},{x:75,t:'hopper'},
        {x:95,t:'walker'},{x:115,t:'hopper'},{x:135,t:'walker'},{x:155,t:'hopper'},
        {x:175,t:'walker'},{x:200,t:'hopper'}
      ],
      carrots: [
        [5,12],[10,12],[14,9],[20,12],[26,12],[32,8],[38,12],[45,12],
        [50,7],[56,12],[62,12],[68,8],[74,12],[80,12],[88,9],[94,12],
        [100,12],[108,8],[115,12],[122,12],[126,7],[132,12],[140,12],
        [146,8],[152,12],[160,12],[166,9],[172,12],[180,12],[186,8],
        [192,12],[200,12],[206,7],[212,12],[222,12]
      ],
      checkpoints: [55, 115, 180],
      goal: 224
    },
    {
      name: 'River Crossing', theme: 'river', width: 240, groundY: 14,
      ground: [[0,20],[24,14],[42,12],[58,15],[77,12],[93,15],[112,12],[130,14],[148,12],[166,15],[185,12],[204,15],[222,18]],
      platforms: [
        {x:12,y:9,w:3},{x:28,y:8,w:4},{x:44,y:7,w:3},{x:60,y:8,w:4},
        {x:78,y:9,w:3},{x:96,y:8,w:4},{x:114,y:7,w:3},{x:132,y:8,w:4},
        {x:150,y:9,w:3},{x:168,y:8,w:4},{x:186,y:7,w:3},{x:204,y:8,w:4},{x:222,y:9,w:3}
      ],
      spikes: [],
      enemies: [
        {x:14,t:'walker'},{x:30,t:'walker'},{x:48,t:'hopper'},{x:65,t:'walker'},
        {x:82,t:'hopper'},{x:100,t:'walker'},{x:118,t:'hopper'},{x:136,t:'walker'},
        {x:155,t:'hopper'},{x:172,t:'walker'},{x:190,t:'hopper'},{x:210,t:'walker'}
      ],
      carrots: [
        [5,12],[10,12],[13,8],[20,12],[26,12],[30,7],[36,12],[44,6],
        [52,12],[60,7],[68,12],[76,12],[80,8],[88,12],[96,7],[104,12],
        [112,12],[116,6],[124,12],[132,7],[140,12],[148,12],[152,8],
        [160,12],[168,7],[176,12],[184,12],[188,6],[196,12],[204,7],
        [212,12],[220,12],[224,8],[232,12]
      ],
      checkpoints: [55, 120, 190],
      goal: 234
    },
    // --- 7-8: CAVE ---
    {
      name: 'Dark Cave', theme: 'cave', width: 220, groundY: 14,
      ground: [[0,35],[38,25],[66,32],[101,28],[132,30],[165,30],[198,22]],
      platforms: [
        {x:16,y:9,w:4},{x:30,y:7,w:4},{x:48,y:10,w:4},{x:60,y:8,w:5},
        {x:78,y:6,w:4},{x:90,y:9,w:4},{x:105,y:7,w:5},{x:122,y:10,w:4},
        {x:140,y:8,w:4},{x:155,y:6,w:4},{x:170,y:9,w:4},{x:185,y:7,w:5},{x:200,y:10,w:4}
      ],
      spikes: [[25,2],[58,2],[90,3],[140,2],[175,2],[205,2]],
      enemies: [
        {x:12,t:'walker'},{x:32,t:'walker'},{x:52,t:'hopper'},{x:75,t:'walker'},
        {x:96,t:'hopper'},{x:115,t:'walker'},{x:135,t:'hopper'},{x:158,t:'walker'},
        {x:180,t:'hopper'},{x:200,t:'walker'},{x:215,t:'hopper'}
      ],
      carrots: [
        [5,12],[12,12],[16,8],[24,12],[30,6],[38,12],[44,12],[50,9],
        [58,12],[65,12],[72,12],[80,5],[88,12],[94,12],[102,12],[108,6],
        [116,12],[125,12],[132,12],[140,7],[148,12],[156,5],[164,12],
        [172,12],[178,8],[186,12],[194,12],[202,12],[208,9],[215,12]
      ],
      checkpoints: [48, 105, 165],
      goal: 213
    },
    {
      name: 'Crystal Caverns', theme: 'cave', width: 230, groundY: 14,
      ground: [[0,25],[28,18],[50,22],[75,20],[98,22],[124,20],[148,22],[174,20],[198,22],[224,6]],
      platforms: [
        {x:12,y:8,w:4},{x:28,y:10,w:4},{x:44,y:7,w:5},{x:62,y:9,w:4},
        {x:78,y:7,w:4},{x:94,y:10,w:4},{x:110,y:6,w:5},{x:128,y:9,w:4},
        {x:145,y:7,w:5},{x:162,y:10,w:4},{x:178,y:8,w:4},{x:194,y:6,w:5},{x:212,y:9,w:4}
      ],
      spikes: [[32,2],[68,3],[102,2],[138,2],[180,2],[210,2]],
      enemies: [
        {x:14,t:'walker'},{x:30,t:'hopper'},{x:48,t:'walker'},{x:66,t:'hopper'},
        {x:82,t:'walker'},{x:100,t:'hopper'},{x:118,t:'walker'},{x:135,t:'hopper'},
        {x:152,t:'walker'},{x:170,t:'hopper'},{x:190,t:'walker'},{x:215,t:'hopper'}
      ],
      carrots: [
        [5,12],[13,7],[20,12],[30,9],[36,12],[46,6],[54,12],[64,12],
        [72,12],[80,6],[88,12],[96,12],[104,9],[112,5],[120,12],[130,12],
        [137,8],[147,6],[155,12],[164,12],[172,9],[180,12],[188,12],
        [196,5],[204,12],[214,12],[222,8],[228,12]
      ],
      checkpoints: [55, 120, 185],
      goal: 224
    },
    // --- 9-10: TOWER ---
    {
      name: 'Tower Ascent', theme: 'tower', width: 220, groundY: 14,
      ground: [[0,30],[33,25],[60,30],[93,25],[120,28],[150,25],[177,28],[207,13]],
      platforms: [
        // 密集垂直平台
        {x:10,y:11,w:3},{x:18,y:9,w:3},{x:26,y:7,w:3},{x:34,y:5,w:3},
        {x:44,y:11,w:3},{x:52,y:9,w:3},{x:60,y:7,w:3},{x:68,y:5,w:3},{x:76,y:7,w:3},
        {x:88,y:10,w:4},{x:98,y:8,w:3},{x:106,y:6,w:3},{x:114,y:4,w:3},
        {x:126,y:9,w:4},{x:136,y:7,w:3},{x:144,y:5,w:3},{x:152,y:7,w:3},
        {x:162,y:10,w:4},{x:172,y:8,w:3},{x:180,y:6,w:3},{x:188,y:4,w:3},
        {x:198,y:8,w:4},{x:208,y:6,w:3}
      ],
      spikes: [[42,2],[84,2],[130,2],[166,2],[200,2]],
      enemies: [
        {x:15,t:'walker'},{x:40,t:'hopper'},{x:65,t:'walker'},{x:90,t:'hopper'},
        {x:110,t:'walker'},{x:135,t:'hopper'},{x:160,t:'walker'},{x:185,t:'hopper'},{x:210,t:'walker'}
      ],
      carrots: [
        [5,12],[11,10],[19,8],[27,6],[35,4],[44,10],[52,8],[60,6],
        [68,4],[76,6],[88,9],[98,7],[106,5],[114,3],[126,8],[136,6],
        [144,4],[152,6],[162,9],[172,7],[180,5],[188,3],[198,7],[208,5],[216,12]
      ],
      checkpoints: [45, 95, 145, 195],
      goal: 213
    },
    {
      name: 'Cloud Tower', theme: 'tower', width: 240, groundY: 14,
      ground: [[0,20],[24,12],[40,20],[64,15],[83,18],[105,15],[124,18],[146,15],[165,18],[187,15],[206,18],[228,12]],
      platforms: [
        {x:8,y:9,w:3},{x:18,y:7,w:3},{x:28,y:5,w:3},{x:38,y:3,w:3},{x:48,y:5,w:3},{x:58,y:7,w:3},{x:68,y:9,w:3},
        {x:80,y:11,w:3},{x:90,y:9,w:3},{x:100,y:7,w:3},{x:110,y:5,w:3},{x:120,y:7,w:3},{x:130,y:9,w:3},
        {x:142,y:11,w:3},{x:152,y:9,w:3},{x:162,y:7,w:3},{x:172,y:5,w:3},{x:182,y:7,w:3},{x:192,y:9,w:3},
        {x:204,y:11,w:3},{x:214,y:9,w:3},{x:224,y:7,w:3}
      ],
      spikes: [[25,2],[85,2],[140,2],[200,2]],
      enemies: [
        {x:15,t:'walker'},{x:35,t:'hopper'},{x:55,t:'walker'},{x:75,t:'hopper'},
        {x:95,t:'walker'},{x:115,t:'hopper'},{x:135,t:'walker'},{x:155,t:'hopper'},
        {x:175,t:'walker'},{x:195,t:'hopper'},{x:215,t:'walker'}
      ],
      carrots: [
        [5,12],[9,8],[18,6],[28,4],[38,2],[48,4],[58,6],[68,8],
        [80,10],[90,8],[100,6],[110,4],[120,6],[130,8],[142,10],[152,8],
        [162,6],[172,4],[182,6],[192,8],[204,10],[214,8],[224,6],[232,12]
      ],
      checkpoints: [50, 105, 160, 210],
      goal: 233
    },
    // --- 11-12: SKY ---
    {
      name: 'Sky Islands', theme: 'sky', width: 240, groundY: 14,
      ground: [[0,15],[20,10],[35,12],[52,10],[67,12],[84,10],[99,12],[116,10],[131,12],[148,10],[163,12],[180,10],[195,12],[212,10],[228,12]],
      platforms: [
        {x:8,y:9,w:3},{x:15,y:7,w:3},{x:25,y:9,w:3},{x:32,y:11,w:3},{x:42,y:9,w:3},
        {x:50,y:7,w:3},{x:58,y:9,w:3},{x:70,y:9,w:3},{x:78,y:7,w:3},{x:86,y:5,w:3},
        {x:94,y:7,w:3},{x:105,y:9,w:3},{x:113,y:7,w:3},{x:122,y:5,w:3},{x:130,y:7,w:3},
        {x:140,y:9,w:3},{x:150,y:7,w:3},{x:158,y:5,w:3},{x:166,y:7,w:3},{x:175,y:9,w:3},
        {x:185,y:7,w:3},{x:193,y:5,w:3},{x:202,y:7,w:3},{x:212,y:9,w:3},{x:222,y:7,w:3},{x:230,y:5,w:3}
      ],
      spikes: [],
      enemies: [
        {x:12,t:'hopper'},{x:30,t:'walker'},{x:48,t:'hopper'},{x:65,t:'walker'},
        {x:82,t:'hopper'},{x:100,t:'walker'},{x:118,t:'hopper'},{x:135,t:'walker'},
        {x:152,t:'hopper'},{x:170,t:'walker'},{x:188,t:'hopper'},{x:205,t:'walker'},{x:225,t:'hopper'}
      ],
      carrots: [
        [5,12],[9,8],[16,6],[25,8],[32,10],[42,8],[50,6],[58,8],
        [70,8],[78,6],[86,4],[94,6],[105,8],[113,6],[122,4],[130,6],
        [140,8],[150,6],[158,4],[166,6],[175,8],[185,6],[193,4],[202,6],
        [212,8],[222,6],[230,4],[236,12]
      ],
      checkpoints: [45, 95, 145, 200],
      goal: 234
    },
    {
      name: 'Final Sky Temple', theme: 'sky', width: 250, groundY: 14,
      ground: [[0,15],[20,10],[35,12],[50,10],[65,15],[84,10],[98,12],[115,10],[130,15],[150,10],[165,12],[182,10],[197,12],[214,10],[228,15]],
      platforms: [
        {x:6,y:10,w:3},{x:14,y:8,w:3},{x:22,y:6,w:3},{x:30,y:4,w:3},{x:38,y:6,w:3},{x:46,y:8,w:3},
        {x:55,y:10,w:3},{x:63,y:8,w:3},{x:71,y:6,w:3},{x:79,y:4,w:3},{x:87,y:6,w:3},{x:95,y:8,w:3},
        {x:105,y:10,w:3},{x:113,y:8,w:3},{x:121,y:6,w:3},{x:129,y:4,w:3},{x:137,y:6,w:3},{x:145,y:8,w:3},
        {x:155,y:10,w:3},{x:163,y:8,w:3},{x:171,y:6,w:3},{x:179,y:4,w:3},{x:187,y:6,w:3},{x:195,y:8,w:3},
        {x:205,y:10,w:3},{x:213,y:8,w:3},{x:221,y:6,w:3},{x:229,y:4,w:3},{x:237,y:6,w:3}
      ],
      spikes: [[25,2],[60,2],[100,2],[145,2],[185,2],[220,2]],
      enemies: [
        {x:12,t:'walker'},{x:28,t:'hopper'},{x:45,t:'walker'},{x:65,t:'hopper'},
        {x:82,t:'walker'},{x:100,t:'hopper'},{x:118,t:'walker'},{x:135,t:'hopper'},
        {x:155,t:'walker'},{x:172,t:'hopper'},{x:190,t:'walker'},{x:210,t:'hopper'},{x:235,t:'walker'}
      ],
      carrots: [
        [5,12],[7,9],[15,7],[23,5],[31,3],[38,5],[46,7],[55,9],
        [63,7],[71,5],[79,3],[87,5],[95,7],[105,9],[113,7],[121,5],
        [129,3],[137,5],[145,7],[155,9],[163,7],[171,5],[179,3],[187,5],
        [195,7],[205,9],[213,7],[221,5],[229,3],[237,5],[245,12]
      ],
      checkpoints: [40, 90, 140, 195],
      goal: 244
    }
  ];

  // ============== STATE ==============
  var level = null;
  var levelIndex = 0;
  var totalLevels = LEVEL_CFGS.length;
  var player = {
    x: 50, y: 400, w: 28, h: 40, vx: 0, vy: 0,
    onGround: false, facing: 1, character: 'zip',
    invuln: 0, jumpHeld: false, canDouble: true, animT: 0, coyote: 0, jumpBuffer: 0
  };
  var camera = { x: 0, shake: 0 };
  var score = 0, lives = 3, keys = {};
  var state = 'title';
  var stateTimer = 0, switchFlash = 0;
  var particles = [];
  var deathX = 0, deathY = 0;
  var totalCarrotsAll = 0;
  var collectedAll = 0;

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
    totalCarrotsAll = 0; collectedAll = 0;
    LEVEL_CFGS.forEach(function(cfg) {
      var lv = buildLevel(cfg);
      totalCarrotsAll += lv.totalCarrots;
    });
    loadLevel(0);
    state = 'playing';
    audio.start();
  }
  function loadLevel(idx) {
    level = buildLevel(LEVEL_CFGS[idx]);
    player.x = level.spawn.x;
    player.y = level.spawn.y;
    player.vx = 0; player.vy = 0;
    player.character = 'zip';
    player.invuln = 0;
    player.canDouble = true;
    camera.x = 0;
    particles = [];
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
    if (lives <= 0) {
      state = 'gameOver';
      audio.stop();
    } else {
      state = 'death';
      stateTimer = 50;
    }
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

    // 跳跃 + 缓冲
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
      player.vy = Math.min(player.vy, 2.8);
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
        collectedAll++;
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
        audio.collect();
        score += 20;
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

  function getTheme() {
    return THEMES[level ? level.theme : 'grass'] || THEMES.grass;
  }

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
    if (!isCave && !isSky) {
      // 太阳
      ctx.fillStyle = 'rgba(255,240,160,0.8)';
      ctx.beginPath();
      ctx.arc(W - 130, 90, 48, 0, Math.PI*2);
      ctx.fill();
    }
    // 远山
    ctx.save();
    ctx.translate(-camera.x * 0.25, 0);
    var farCol = isCave ? 'rgba(20,20,40,0.7)' : isSky ? 'rgba(180,210,255,0.7)' : 'rgba(60,110,160,0.55)';
    ctx.fillStyle = farCol;
    for (var i = 0; i < 15; i++) {
      var mx = i * 500 + 200;
      ctx.beginPath();
      ctx.moveTo(mx - 250, 420);
      ctx.lineTo(mx, isCave ? 200 : 170);
      ctx.lineTo(mx + 250, 420);
      ctx.closePath();
      ctx.fill();
    }
    ctx.restore();
    // 中景
    ctx.save();
    ctx.translate(-camera.x * 0.5, 0);
    var midCol = isCave ? 'rgba(40,40,60,0.5)' : isSky ? 'rgba(220,235,255,0.7)' : 'rgba(90,160,120,0.6)';
    ctx.fillStyle = midCol;
    for (var j = 0; j < 25; j++) {
      var hx = j * 350;
      ctx.beginPath();
      ctx.arc(hx + 180, 440, 180, Math.PI, 0);
      ctx.fill();
    }
    ctx.restore();
    // 云（除洞穴外）
    if (!isCave) {
      ctx.save();
      ctx.translate(-camera.x * 0.15, 0);
      ctx.fillStyle = isSky ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.7)';
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
      if (cp.active) {
        ctx.fillStyle = 'rgba(120,255,180,0.3)';
        ctx.beginPath();
        ctx.arc(cp.x + 14, cp.y + 20, 22, 0, Math.PI*2);
        ctx.fill();
      }
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
    // eyes
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
    // whiskers
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
      ctx.fillStyle = 'rgba(255,180,220,0.6)';
      ctx.beginPath();
      ctx.ellipse(cx, cy - 20, 22, 8, 0, 0, Math.PI*2);
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
  }

  function drawHUD() {
    // 左上
    ctx.fillStyle = 'rgba(8,16,32,0.72)';
    roundRect(14, 14, 260, 92, 16); ctx.fill();
    ctx.strokeStyle = 'rgba(120,180,240,0.5)';
    ctx.lineWidth = 2;
    roundRect(14, 14, 260, 92, 16); ctx.stroke();
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
    ctx.fillText('LV ' + (levelIndex + 1) + '/' + totalLevels + '  ' + (LEVEL_CFGS[levelIndex] ? LEVEL_CFGS[levelIndex].name : ''), 30, 92);

    // 右上
    ctx.fillStyle = 'rgba(8,16,32,0.72)';
    roundRect(W - 240, 14, 226, 92, 16); ctx.fill();
    ctx.strokeStyle = 'rgba(120,180,240,0.5)';
    roundRect(W - 240, 14, 226, 92, 16); ctx.stroke();
    ctx.fillStyle = '#ffaa44';
    ctx.font = 'bold 22px "Courier New", monospace';
    var c1 = level ? level.collected : 0;
    var c2 = level ? level.totalCarrots : 0;
    ctx.fillText('🥕 ' + c1 + '/' + c2, W - 225, 44);
    var isZip = player.character === 'zip';
    ctx.fillStyle = isZip ? '#5cb8ff' : '#ff88b8';
    ctx.font = 'bold 15px "Courier New", monospace';
    ctx.fillText('▶ ' + (isZip ? 'ZIP' : 'PIP'), W - 225, 72);
    ctx.fillStyle = '#8898aa';
    ctx.font = '11px "Courier New", monospace';
    ctx.fillText('E=Switch M=Mute R=Retry', W - 225, 92);
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
    ctx.fillText('Zip & Pip', W/2, 150);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#88ddff';
    ctx.font = 'bold 44px "Trebuchet MS", sans-serif';
    ctx.fillText('CARROT QUEST', W/2, 205);
    drawTitleChar(W/2 - 140, 290, 'zip');
    drawTitleChar(W/2 + 140, 290, 'pip');
    ctx.fillStyle = '#c8dae8';
    ctx.font = '18px "Courier New", monospace';
    ctx.fillText('Press SPACE / ENTER to start', W/2, 400);
    ctx.fillStyle = '#8898aa';
    ctx.font = '12px "Courier New", monospace';
    ctx.fillText('←→ / A D  Move  ·  ↑ / W / SPACE  Jump  ·  E  Switch  ·  M  Mute  ·  R  Retry', W/2, 435);
    ctx.fillText('12 levels across 6 themed worlds  ·  Collect carrots · Avoid spikes · Stomp enemies · Reach the flag', W/2, 458);
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
    drawSpikes();
    drawCheckpoints();
    for (var bi = 0; bi < level.boxes.length; bi++) drawBox(level.boxes[bi]);
    for (var ci = 0; ci < level.carrots.length; ci++) {
      var c = level.carrots[ci];
      if (!c.taken) drawCarrot(c.x, c.y, Date.now());
    }
    for (var ei = 0; ei < level.enemies.length; ei++) drawEnemy(level.enemies[ei]);
    drawGoal();
    if (state !== 'death') drawPlayer(player);
    drawParticles();
    ctx.restore();
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

  // ============== MAIN LOOP ==============
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

  // ============== EXPOSE initGame ==============
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
