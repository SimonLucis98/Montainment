/* Zip & Pip: Carrot Quest v4 — Logic-Fixed */
(function () {
  'use strict';

  const gameHTML = `<!doctype html>
<html lang="zh">
<head>
<meta charset="UTF-8">
<title>Zip &amp; Pip: Carrot Quest</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 100%; height: 100%; background: #0a0e18; overflow: hidden;
    font-family: 'Segoe UI', system-ui, sans-serif; display: grid; place-items: center; }
  canvas { display: block; width: 100%; max-width: 100%; height: auto;
    aspect-ratio: 2 / 1; max-height: 100vh; }
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

  // ========== AUDIO ==========
  var audio = (function() {
    var actx = null, timer = null, step = 0, nextT = 0, muted = false, theme = null;
    var TRACKS = {
      grass: { bpm: 108, mel:[659,784,880,784,659,523,587,659,880,988,1047,988,880,784,659,587,
                              523,659,784,659,523,440,494,523,659,587,523,494,440,494,523,587],
                       bass:[131,131,165,165,175,175,196,196,131,131,165,165,175,175,196,196,
                             110,110,131,131,147,147,165,165,110,110,123,123,131,131,147,147] },
      desert:{ bpm: 96,  mel:[587,698,784,880,784,698,659,587,523,587,659,784,880,784,698,659,
                              587,523,494,523,587,659,698,784,880,988,880,784,698,659,587,523],
                       bass:[110,110,147,147,165,165,175,175,110,110,147,147,165,165,175,175,
                             98,98,131,131,147,147,165,165,98,98,123,123,131,131,147,147] },
      river: { bpm: 120, mel:[784,880,988,880,1047,988,880,784,698,784,880,988,1047,1175,1047,988,
                              880,784,698,784,880,988,1047,880,784,698,659,698,784,880,988,784],
                       bass:[131,131,196,196,220,220,262,262,175,175,220,220,262,262,220,220,
                             147,147,196,196,220,220,247,247,131,131,196,196,220,220,247,247] },
      cave:  { bpm: 80,  mel:[262,311,349,415,349,311,262,233,262,311,415,466,415,349,311,262,
                              220,262,311,349,311,262,233,196,220,262,349,415,349,311,262,220],
                       bass:[65,65,82,82,87,87,98,98,65,65,82,82,87,87,98,98,
                             55,55,65,65,73,73,82,82,55,55,65,65,73,73,82,82] },
      tower: { bpm: 132, mel:[880,988,1175,988,880,784,880,988,1047,1175,1319,1175,1047,988,880,784,
                              784,880,988,1047,1175,1047,988,880,880,988,1047,1175,1319,1175,1047,988],
                       bass:[165,165,220,220,262,262,330,330,196,196,247,247,294,294,330,330,
                             147,147,196,196,247,247,294,294,165,165,220,220,262,262,294,294] },
      sky:   { bpm: 100, mel:[1047,1175,1319,1175,1047,988,880,784,880,988,1047,1175,1319,1175,1047,988,
                              784,880,988,1047,1175,1047,988,880,988,1047,1175,1319,1175,1047,988,880],
                       bass:[175,175,262,262,220,220,330,330,165,165,247,247,220,220,294,294,
                             196,196,262,262,247,247,330,330,175,175,262,262,220,220,294,294] }
    };
    function init() { if (actx) return; try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch(e){} }
    function tone(f, s, d, t, v) {
      if (!actx || muted) return;
      var o = actx.createOscillator(), g = actx.createGain();
      o.type = t || 'square'; o.frequency.setValueAtTime(f, s);
      g.gain.setValueAtTime(0, s);
      g.gain.linearRampToValueAtTime(v || 0.04, s + 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, s + d);
      o.connect(g); g.connect(actx.destination);
      o.start(s); o.stop(s + d + 0.05);
    }
    function schedule() {
      if (!actx || muted || !theme) { timer = null; return; }
      var tr = TRACKS[theme] || TRACKS.grass;
      var stepDur = 60 / tr.bpm / 2;
      var now = actx.currentTime;
      while (nextT < now + 0.4) {
        var s = step % 32;
        tone(tr.mel[s], nextT, stepDur * 0.85, 'square', 0.022);
        tone(tr.bass[s], nextT, stepDur * 0.9, 'triangle', 0.045);
        nextT += stepDur; step++;
      }
      timer = setTimeout(schedule, 80);
    }
    return {
      start: function(t) {
        init(); if (actx && actx.state === 'suspended') actx.resume();
        theme = t || 'grass';
        if (timer) clearTimeout(timer);
        step = 0; nextT = (actx ? actx.currentTime : 0) + 0.1; timer = null; schedule();
      },
      setTheme: function(t) { if (theme === t) return; this.start(t); },
      stop: function() { if (timer) { clearTimeout(timer); timer = null; } theme = null; },
      jump: function() { if (actx && !muted) tone(520, actx.currentTime, 0.09, 'square', 0.045); },
      collect: function() { if (actx && !muted) { tone(880, actx.currentTime, 0.06, 'square', 0.05); tone(1320, actx.currentTime + 0.05, 0.1, 'square', 0.045); } },
      hurt: function() { if (actx && !muted) { tone(220, actx.currentTime, 0.15, 'sawtooth', 0.07); tone(110, actx.currentTime + 0.08, 0.2, 'sawtooth', 0.05); } },
      win: function() { if (actx && !muted) { var t = actx.currentTime; [523,659,784,1047,1319].forEach(function(f,i){ tone(f, t + i*0.09, 0.15, 'square', 0.06); }); } },
      switch: function() { if (actx && !muted) tone(700, actx.currentTime, 0.05, 'triangle', 0.05); },
      checkpoint: function() { if (actx && !muted) { var t = actx.currentTime; [660,880,1100].forEach(function(f,i){ tone(f, t + i*0.08, 0.15, 'square', 0.055); }); } },
      toggle: function() {
        muted = !muted;
        if (muted) { if (timer) { clearTimeout(timer); timer = null; } }
        else if (!timer && theme) { if (actx) nextT = Math.max(nextT, actx.currentTime + 0.05); schedule(); }
        return muted;
      },
      isMuted: function() { return muted; }
    };
  })();

  // ========== THEMES ==========
  var THEMES = {
    grass:  { sky: ['#6fc5e8','#a8ddf0','#d4eef8'], top: '#5cb85c', topHi: '#8cd88c', dirt: '#7a4a2a' },
    desert: { sky: ['#f8b048','#f8d078','#f8e8c0'], top: '#e0b878', topHi: '#f0d8a0', dirt: '#b88850' },
    river:  { sky: ['#4a8ec8','#88c0e0','#d0e8f0'], top: '#4a9a6a', topHi: '#7ac88a', dirt: '#5a4030' },
    cave:   { sky: ['#0a0a18','#1a1a28','#2a2a3a'], top: '#4a4a5a', topHi: '#6a6a7a', dirt: '#2a2a3a' },
    tower:  { sky: ['#2a1a3a','#5a3a6a','#a8689a'], top: '#6a5a7a', topHi: '#8a7a9a', dirt: '#4a3a5a' },
    sky:    { sky: ['#a0d0ff','#d0e8ff','#f0f8ff'], top: '#c8e0ff', topHi: '#e8f0ff', dirt: '#a8c0e0' }
  };

  // ========== LEVEL BUILDER ==========
  // 尖刺验证: 必须放在实心地上 (groundMask[x] === true)
  function buildLevel(cfg) {
    var W_T = cfg.width, H_T = cfg.height || 15, groundY = cfg.groundY || 14;
    var tiles = [];
    for (var y = 0; y < H_T; y++) { var r = []; for (var x = 0; x < W_T; x++) r.push(' '); tiles.push(r); }
    var groundMask = [];
    for (var x = 0; x < W_T; x++) groundMask.push(false);
    (cfg.ground || [[0, W_T]]).forEach(function(seg) {
      for (var x = seg[0]; x < seg[0] + seg[1] && x < W_T; x++) groundMask[x] = true;
    });
    for (var gy = groundY; gy < H_T; gy++)
      for (var x3 = 0; x3 < W_T; x3++)
        if (groundMask[x3]) tiles[gy][x3] = '#';
    (cfg.platforms || []).forEach(function(p) {
      for (var dx = 0; dx < p.w; dx++)
        for (var dy = 0; dy < (p.h || 1); dy++) {
          var px = p.x + dx, py = p.y + dy;
          if (px >= 0 && px < W_T && py >= 0 && py < H_T) tiles[py][px] = '#';
        }
    });

    // 尖刺: 只接受放在实心地面上
    var spikes = [];
    (cfg.spikes || []).forEach(function(s) {
      var tileX = s[0];
      if (!groundMask[tileX]) return; // 拒绝放在坑里的尖刺
      for (var i = 0; i < s[1]; i++) {
        if (!groundMask[tileX + i]) break;
        spikes.push({ x: (tileX + i) * TILE + 4, y: groundY * TILE + 14, w: TILE - 8, h: 18 });
      }
    });

    var enemies = [], carrots = [], boxes = [], movers = [], water = [];
    (cfg.enemies || []).forEach(function(e) {
      var ey = (e.y !== undefined) ? e.y : groundY - 1;
      enemies.push({ x: e.x * TILE, y: ey * TILE + 6, w: 26, h: 26,
        vx: 1.4, vy: 0, minX: Math.max(0, (e.x - 4) * TILE), maxX: (e.x + 4) * TILE,
        onGround: false, alive: true, phase: Math.random()*6.28, type: e.t || 'walker' });
    });
    var goalTile = (cfg.goal !== undefined ? cfg.goal : W_T - 6);
    (cfg.carrots || []).forEach(function(c) {
      if (c[0] >= goalTile - 2) return; // 强制在旗帜前
      carrots.push({ x: c[0] * TILE + 6, y: c[1] * TILE + 6, taken: false });
    });
    // 箱子: 只接受平地
    (cfg.boxes || []).forEach(function(b) {
      if (!groundMask[b[0]]) return;
      boxes.push({ x: b[0]*TILE+2, y: b[1]*TILE+2, w: 28, h: 28, vx: 0, vy: 0, onGround: false });
    });
    var checkpoints = [];
    (cfg.checkpoints || []).forEach(function(cx) {
      if (cx >= goalTile - 2) return;
      // 检查点放在实心地面上
      checkpoints.push({ x: cx*TILE, y: (groundY-1)*TILE - 12, w: 32, h: 48,
        active: false, used: false, flash: 0 });
    });
    // 风区: 开阔地
    var wind = [];
    (cfg.wind || []).forEach(function(w) {
      var zone = { x: w.x * TILE, y: (w.y||groundY-3) * TILE,
        w: w.w * TILE, h: (w.h||4) * TILE, force: w.f || 0.5, particles: [] };
      for (var i = 0; i < 30; i++)
        zone.particles.push({ x: Math.random()*zone.w, y: Math.random()*zone.h,
          vx: zone.force * -3 - Math.random()*2, life: Math.random()*80 });
      wind.push(zone);
    });
    // 水域
    (cfg.water || []).forEach(function(w) {
      water.push({ x: w[0]*TILE, y: groundY*TILE, w: w[1]*TILE, h: TILE*1.5 });
    });
    // 移动平台
    (cfg.movers || []).forEach(function(m) {
      movers.push({ x: m.x*TILE, y: m.y*TILE, w: m.w*TILE, h: 16,
        axis: m.axis || 'x', originX: m.x*TILE, originY: m.y*TILE,
        range: (m.range || 3) * TILE, speed: m.speed || 1.2, t: Math.random()*6.28 });
    });
    var goal = { x: goalTile*TILE, y: (groundY-3)*TILE, w: 32, h: 96 };
    var spawn = { x: 2*TILE, y: (groundY-2)*TILE };
    return {
      tiles: tiles, width: W_T*TILE, height: H_T*TILE, theme: cfg.theme || 'grass',
      groundY: groundY, groundMask: groundMask,
      carrots: carrots, enemies: enemies, spikes: spikes, boxes: boxes,
      checkpoints: checkpoints, movers: movers, wind: wind, water: water,
      goal: goal, spawn: spawn, totalCarrots: carrots.length, collected: 0,
      name: cfg.name || ''
    };
  }

  // ========== LEVELS ==========
  var LEVEL_CFGS = [
    // ===== 1-2 GRASS =====
    {
      name: 'Meadow Stroll', theme: 'grass', width: 200, groundY: 14,
      ground: [[0,32],[36,22],[62,28],[94,26],[124,28],[156,44]],
      platforms: [
        {x:18,y:10,w:4},{x:40,y:9,w:4},{x:54,y:11,w:3},{x:74,y:8,w:5},
        {x:86,y:10,w:4},{x:104,y:9,w:5},{x:140,y:9,w:4},{x:170,y:9,w:5}
      ],
      // 尖刺放在实心地面上(0-31, 36-57, 62-89, 94-119, 124-151, 156-199)
      spikes: [[12,1],[48,2],[72,1],[104,2],[136,1],[168,2]],
      enemies: [{x:16,t:'walker'},{x:42,t:'walker'},{x:70,t:'hopper'},
                {x:98,t:'walker'},{x:126,t:'hopper'},{x:156,t:'walker'}],
      carrots: [
        [5,12],[14,12],[22,9],[30,12],[38,12],[46,8],[56,12],[66,12],
        [78,7],[88,12],[96,9],[108,12],[118,12],[128,12],[140,8],[148,12],
        [156,12],[164,12],[172,8],[180,12],[188,12]
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
        {x:136,y:9,w:5},{x:150,y:7,w:4},{x:166,y:9,w:4},{x:184,y:10,w:5}
      ],
      spikes: [[10,2],[40,1],[62,2],[90,1],[112,2],[140,1],[160,2],[188,1]],
      enemies: [{x:12,t:'walker'},{x:34,t:'walker'},{x:56,t:'hopper'},{x:82,t:'walker'},
                {x:104,t:'hopper'},{x:130,t:'walker'},{x:156,t:'hopper'},{x:186,t:'walker'}],
      carrots: [
        [5,12],[10,12],[16,8],[22,12],[32,12],[38,12],[46,9],[52,12],
        [60,12],[68,12],[78,8],[86,12],[92,12],[100,12],[108,7],[116,12],
        [124,12],[132,12],[142,12],[152,6],[160,12],[170,8],[178,12],
        [186,12],[194,12],[202,7]
      ],
      checkpoints: [55, 120, 175],
      goal: 200
    },
    // ===== 3-4 DESERT with WIND + BOXES =====
    {
      name: 'Windswept Dunes', theme: 'desert', width: 210, groundY: 14,
      // 大段连贯地面
      ground: [[0,200]],
      platforms: [
        {x:60,y:10,w:5},{x:100,y:10,w:5},{x:150,y:10,w:5}
      ],
      // 风区: 在开阔地面上，玩家必须推箱子过
      wind: [
        {x:40, y:11, w:20, h:4, f:0.55},
        {x:80, y:11, w:20, h:4, f:0.55},
        {x:130, y:11, w:20, h:4, f:0.55}
      ],
      // 箱子放在风区前的平地上
      boxes: [[36,13],[76,13],[126,13]],
      spikes: [[20,1],[66,1],[116,1],[170,1]],
      enemies: [{x:14,t:'walker'},{x:56,t:'walker'},{x:96,t:'hopper'},
                {x:146,t:'walker'},{x:186,t:'hopper'}],
      carrots: [
        [5,12],[12,12],[18,12],[25,12],[32,12],[38,12],[46,12],[52,12],[58,12],
        [66,12],[72,12],[78,12],[86,12],[92,12],[98,12],[106,12],[112,12],
        [118,12],[124,12],[130,12],[138,12],[144,12],[152,12],[158,12],[164,12],
        [172,12],[180,12],[188,12],[196,12]
      ],
      checkpoints: [55, 110, 165],
      goal: 200
    },
    {
      name: 'Scorching Sands', theme: 'desert', width: 220, groundY: 14,
      ground: [[0,110],[116,100]],
      platforms: [
        {x:50,y:9,w:5},{x:80,y:9,w:5},{x:150,y:9,w:5},{x:190,y:9,w:5}
      ],
      wind: [
        {x:20, y:11, w:20, h:4, f:0.55},
        {x:60, y:11, w:20, h:4, f:0.55},
        {x:130, y:11, w:20, h:4, f:0.55},
        {x:170, y:11, w:20, h:4, f:0.55}
      ],
      boxes: [[16,13],[56,13],[126,13],[166,13]],
      spikes: [[42,2],[92,2],[152,2],[198,1]],
      enemies: [{x:30,t:'walker'},{x:70,t:'hopper'},{x:100,t:'walker'},
                {x:140,t:'hopper'},{x:180,t:'walker'}],
      carrots: [
        [5,12],[12,12],[24,12],[32,12],[42,12],[50,12],[58,12],[66,12],
        [76,12],[84,12],[92,12],[100,12],[108,12],[122,12],[132,12],
        [140,12],[148,12],[158,12],[166,12],[174,12],[184,12],[192,12],[200,12],[210,12]
      ],
      checkpoints: [105, 190],
      goal: 212
    },
    // ===== 5-6 RIVER (water) =====
    {
      name: 'Riverside Hop', theme: 'river', width: 220, groundY: 14,
      ground: [[0,20],[52,10],[110,12],[160,10],[208,12]],
      platforms: [
        {x:24,y:11,w:3},{x:30,y:11,w:3},{x:36,y:11,w:3},{x:42,y:11,w:3},{x:48,y:11,w:3},
        {x:66,y:10,w:3},{x:72,y:10,w:3},{x:78,y:10,w:3},{x:84,y:10,w:3},{x:90,y:10,w:3},{x:96,y:10,w:3},{x:102,y:10,w:3},
        {x:126,y:10,w:3},{x:132,y:10,w:3},{x:138,y:10,w:3},{x:144,y:10,w:3},{x:150,y:10,w:3},{x:156,y:10,w:3},
        {x:174,y:10,w:3},{x:180,y:10,w:3},{x:186,y:10,w:3},{x:192,y:10,w:3},{x:198,y:10,w:3},
        {x:34,y:7,w:4},{x:80,y:6,w:5},{x:140,y:7,w:4},{x:186,y:7,w:4}
      ],
      water: [[20,32],[62,48],[122,38],[170,38]],
      spikes: [],
      enemies: [{x:15,t:'walker'},{x:56,t:'walker'},{x:112,t:'walker'},{x:164,t:'walker'}],
      carrots: [
        [5,12],[10,12],[15,12],[26,9],[32,9],[40,9],[46,9],[58,12],
        [70,8],[76,8],[82,8],[88,8],[94,8],[100,8],[112,12],[128,8],
        [134,8],[140,8],[146,8],[152,8],[164,12],[178,8],[184,8],[190,8],[196,8]
      ],
      checkpoints: [56, 116, 164],
      goal: 214
    },
    {
      name: 'Grand Crossing', theme: 'river', width: 240, groundY: 14,
      ground: [[0,18],[42,8],[96,10],[152,8],[210,10],[234,6]],
      platforms: [
        {x:20,y:12,w:3},{x:26,y:12,w:3},{x:32,y:12,w:3},{x:38,y:12,w:3},
        {x:56,y:11,w:3},{x:62,y:11,w:3},{x:68,y:11,w:3},{x:74,y:11,w:3},{x:80,y:11,w:3},{x:86,y:11,w:3},{x:92,y:11,w:3},
        {x:110,y:10,w:3},{x:116,y:10,w:3},{x:122,y:10,w:3},{x:128,y:10,w:3},{x:134,y:10,w:3},{x:140,y:10,w:3},{x:146,y:10,w:3},
        {x:164,y:11,w:3},{x:170,y:11,w:3},{x:176,y:11,w:3},{x:182,y:11,w:3},{x:188,y:11,w:3},{x:194,y:11,w:3},{x:200,y:11,w:3},
        {x:46,y:7,w:4},{x:100,y:6,w:4},{x:156,y:6,w:4},{x:216,y:7,w:4}
      ],
      water: [[18,24],[50,46],[106,46],[158,52],[204,30]],
      spikes: [],
      enemies: [{x:12,t:'walker'},{x:56,t:'walker'},{x:112,t:'walker'},{x:170,t:'walker'},{x:226,t:'walker'}],
      carrots: [
        [5,12],[10,12],[15,12],[22,10],[28,10],[34,10],[40,10],[48,6],
        [58,9],[64,9],[70,9],[76,9],[82,9],[88,9],[94,9],[102,5],
        [112,8],[118,8],[124,8],[130,8],[136,8],[142,8],[148,8],
        [158,5],[166,9],[172,9],[178,9],[184,9],[190,9],[196,9],[202,9],
        [216,6],[224,9],[230,9]
      ],
      checkpoints: [46, 100, 158, 216],
      goal: 234
    },
    // ===== 7-8 CAVE =====
    {
      name: 'Glowing Depths', theme: 'cave', width: 200, groundY: 14,
      ground: [[0,28],[32,22],[58,26],[88,22],[114,26],[144,26],[174,26]],
      platforms: [
        {x:16,y:9,w:4},{x:30,y:7,w:4},{x:44,y:10,w:4},{x:56,y:8,w:5},
        {x:74,y:6,w:4},{x:86,y:9,w:4},{x:102,y:7,w:5},{x:118,y:10,w:4},
        {x:134,y:8,w:4},{x:148,y:6,w:4},{x:162,y:9,w:4},{x:178,y:7,w:5}
      ],
      spikes: [[10,1],[48,2],[70,1],[96,2],[124,1],[154,2],[182,1]],
      enemies: [{x:14,t:'walker'},{x:60,t:'hopper'},{x:92,t:'walker'},{x:120,t:'hopper'},{x:150,t:'walker'},{x:180,t:'hopper'}],
      carrots: [
        [5,12],[10,12],[18,8],[24,12],[34,6],[42,12],[52,12],[60,7],
        [68,12],[76,5],[84,12],[92,12],[100,12],[106,6],[114,12],[122,12],
        [130,12],[136,7],[144,12],[152,5],[160,12],[168,12],[178,12],[184,6]
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
      spikes: [[10,1],[38,2],[64,1],[86,2],[112,1],[134,2],[154,1],[178,2]],
      enemies: [{x:14,t:'walker'},{x:40,t:'hopper'},{x:68,t:'walker'},{x:92,t:'hopper'},
                {x:118,t:'walker'},{x:140,t:'hopper'},{x:166,t:'walker'},{x:196,t:'hopper'}],
      carrots: [
        [5,12],[13,7],[22,12],[32,9],[40,12],[48,6],[56,12],[66,12],
        [72,12],[82,6],[90,12],[96,12],[104,9],[114,5],[122,12],[132,12],
        [138,8],[148,6],[156,12],[166,12],[174,9],[182,12],[188,12],[196,5]
      ],
      checkpoints: [50, 110, 165],
      goal: 204
    },
    // ===== 9-10 TOWER =====
    {
      name: 'Tower Climb', theme: 'tower', width: 200, groundY: 14,
      ground: [[0,200]],
      platforms: [
        {x:10,y:11,w:3},{x:18,y:9,w:3},{x:26,y:7,w:3},{x:34,y:5,w:3},
        {x:46,y:11,w:3},{x:54,y:9,w:3},{x:62,y:7,w:3},{x:70,y:5,w:3},
        {x:88,y:10,w:4},{x:98,y:8,w:3},{x:106,y:6,w:3},{x:114,y:4,w:3},
        {x:126,y:9,w:4},{x:136,y:7,w:3},{x:144,y:5,w:3},{x:152,y:7,w:3},
        {x:162,y:10,w:4},{x:172,y:8,w:3},{x:180,y:6,w:3},{x:188,y:4,w:3}
      ],
      movers: [
        {x:42, y:8, w:3, axis:'y', range:5, speed:1.0},
        {x:82, y:8, w:3, axis:'y', range:5, speed:1.0},
        {x:122, y:8, w:3, axis:'y', range:5, speed:1.0},
        {x:160, y:8, w:3, axis:'y', range:5, speed:1.0}
      ],
      spikes: [[20,1],[56,1],[92,1],[130,1],[168,1],[194,1]],
      enemies: [{x:15,t:'walker'},{x:60,t:'hopper'},{x:96,t:'walker'},{x:134,t:'hopper'},{x:172,t:'walker'}],
      carrots: [
        [5,12],[11,10],[19,8],[27,6],[35,4],[48,10],[56,8],[64,6],
        [72,4],[90,9],[100,7],[108,5],[116,3],[128,8],[138,6],[146,4],
        [154,6],[164,9],[174,7],[182,5],[190,3],[198,12]
      ],
      checkpoints: [46, 96, 146],
      goal: 190
    },
    {
      name: 'Sky Tower', theme: 'tower', width: 220, groundY: 14,
      ground: [[0,210]],
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
      spikes: [[20,1],[70,1],[104,1],[150,1],[196,1]],
      enemies: [{x:14,t:'walker'},{x:54,t:'hopper'},{x:88,t:'walker'},{x:132,t:'hopper'},{x:176,t:'walker'},{x:206,t:'hopper'}],
      carrots: [
        [5,12],[9,8],[17,6],[25,4],[33,2],[40,4],[48,6],[56,8],
        [68,10],[76,8],[84,6],[92,4],[100,6],[108,8],[120,10],[128,8],
        [136,6],[144,4],[152,6],[160,8],[172,10],[180,8],[188,6],[196,4],[204,6],[212,8]
      ],
      checkpoints: [48, 100, 152, 204],
      goal: 214
    },
    // ===== 11-12 SKY (glide) =====
    {
      name: 'Floating Isles', theme: 'sky', width: 220, groundY: 14,
      ground: [[0,14],[22,8],[38,10],[54,8],[68,10],[86,8],[100,10],[118,8],[132,10],[150,8],[164,10],[182,8],[196,10],[214,6]],
      platforms: [
        {x:8,y:9,w:3},{x:18,y:7,w:3},{x:28,y:9,w:3},{x:36,y:11,w:3},{x:44,y:9,w:3},
        {x:52,y:7,w:3},{x:60,y:9,w:3},{x:70,y:9,w:3},{x:78,y:7,w:3},{x:86,y:5,w:3},
        {x:94,y:7,w:3},{x:105,y:9,w:3},{x:113,y:7,w:3},{x:122,y:5,w:3},{x:130,y:7,w:3},
        {x:140,y:9,w:3},{x:150,y:7,w:3},{x:158,y:5,w:3},{x:166,y:7,w:3},{x:175,y:9,w:3},
        {x:185,y:7,w:3},{x:193,y:5,w:3},{x:202,y:7,w:3},{x:212,y:9,w:3}
      ],
      spikes: [[5,1],[44,1],[74,1],[108,1],[138,1],[176,1],[200,1]],
      enemies: [{x:12,t:'hopper'},{x:30,t:'walker'},{x:58,t:'hopper'},{x:80,t:'walker'},
                {x:98,t:'hopper'},{x:118,t:'walker'},{x:140,t:'hopper'},{x:160,t:'walker'},{x:188,t:'hopper'}],
      carrots: [
        [5,12],[9,8],[18,6],[25,8],[32,10],[42,8],[50,6],[58,8],
        [70,8],[78,6],[86,4],[94,6],[105,8],[113,6],[122,4],[130,6],
        [140,8],[150,6],[158,4],[166,6],[175,8],[185,6],[193,4],[202,6],[212,8]
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
        {x:205,y:10,w:3},{x:213,y:8,w:3},{x:221,y:6,w:3},{x:229,y:4,w:3}
      ],
      spikes: [[5,1],[40,1],[80,1],[120,1],[160,1],[200,1],[230,1]],
      enemies: [{x:12,t:'walker'},{x:44,t:'hopper'},{x:82,t:'walker'},{x:118,t:'hopper'},
                {x:154,t:'walker'},{x:190,t:'hopper'},{x:228,t:'walker'}],
      carrots: [
        [5,12],[7,9],[15,7],[23,5],[31,3],[38,5],[46,7],[55,9],
        [63,7],[71,5],[79,3],[87,5],[95,7],[105,9],[113,7],[121,5],
        [129,3],[137,5],[145,7],[155,9],[163,7],[171,5],[179,3],[187,5],
        [195,7],[205,9],[213,7],[221,5],[229,3]
      ],
      checkpoints: [40, 90, 140, 190],
      goal: 234
    }
  ];

  // ========== STATE ==========
  var level = null, levelIndex = 0, totalLevels = LEVEL_CFGS.length;
  var player = {
    x: 50, y: 400, w: 28, h: 40, vx: 0, vy: 0,
    onGround: false, facing: 1, character: 'zip',
    invuln: 0, jumpHeld: false, canDouble: true, animT: 0, coyote: 0, jumpBuffer: 0
  };
  var camera = { x: 0, shake: 0 };
  var score = 0, lives = 3, keys = {};
  var state = 'title';
  var stateTimer = 0, switchFlash = 0, toastText = '', toastTimer = 0;
  var particles = [];

  function spawnParticles(x, y, color, count) {
    for (var i = 0; i < (count||8); i++) {
      var ang = Math.random() * Math.PI * 2;
      var sp = 1 + Math.random() * 4;
      particles.push({ x: x, y: y, vx: Math.cos(ang)*sp, vy: Math.sin(ang)*sp - 1,
        life: 30 + Math.random()*20, color: color, size: 3 + Math.random()*4 });
    }
  }
  function showToast(text) { toastText = text; toastTimer = 90; }

  // ========== INPUT ==========
  document.addEventListener('keydown', function(e) {
    keys[e.key] = true;
    var k = e.key;
    if ([' ','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','w','a','s','d','W','A','S','D'].indexOf(k) !== -1) e.preventDefault();
    if (state === 'title' && (k === ' ' || k === 'Enter')) { startGame(); return; }
    if (state === 'gameOver' || state === 'win') { if (k === ' ' || k === 'Enter') { state = 'title'; audio.stop(); } return; }
    if (state === 'playing') {
      if (k === 'e' || k === 'E') { player.character = player.character === 'zip' ? 'pip' : 'zip'; switchFlash = 18; audio.switch(); }
      if (k === 'r' || k === 'R') { die(); }
    }
    if (k === 'm' || k === 'M') { audio.toggle(); }
  });
  document.addEventListener('keyup', function(e) { keys[e.key] = false; });

  // ========== FLOW ==========
  function startGame() { levelIndex = 0; score = 0; lives = 3; loadLevel(0); state = 'playing'; audio.start(LEVEL_CFGS[0].theme); }
  function loadLevel(idx) {
    level = buildLevel(LEVEL_CFGS[idx]);
    player.x = level.spawn.x; player.y = level.spawn.y;
    player.vx = 0; player.vy = 0; player.character = 'zip';
    player.invuln = 0; player.canDouble = true;
    camera.x = 0; particles = [];
    toastTimer = 0;
    audio.setTheme(LEVEL_CFGS[idx].theme);
  }
  function nextLevel() {
    levelIndex++;
    if (levelIndex >= totalLevels) { state = 'win'; audio.win(); audio.stop(); }
    else { loadLevel(levelIndex); state = 'playing'; }
  }
  function die() {
    if (state !== 'playing') return;
    lives--; audio.hurt(); camera.shake = 20;
    spawnParticles(player.x + 14, player.y + 20, '#ff6688', 24);
    if (lives <= 0) { state = 'gameOver'; audio.stop(); }
    else { state = 'death'; stateTimer = 50; }
  }

  // ========== COLLISION ==========
  function solidAt(tx, ty) {
    if (!level) return false;
    if (ty < 0 || ty >= level.tiles.length) return false;
    if (tx < 0 || tx >= level.tiles[0].length) return false;
    return level.tiles[ty][tx] === '#';
  }
  function tileCollides(x, y, w, h) {
    var x1 = Math.floor(x/TILE), y1 = Math.floor(y/TILE);
    var x2 = Math.floor((x+w-1)/TILE), y2 = Math.floor((y+h-1)/TILE);
    for (var ty = y1; ty <= y2; ty++)
      for (var tx = x1; tx <= x2; tx++)
        if (solidAt(tx, ty)) return true;
    return false;
  }
  function aabb(a, b) { return a.x < b.x+b.w && a.x+a.w > b.x && a.y < b.y+b.h && a.y+a.h > b.y; }

  // ========== UPDATE ==========
  function update() {
    if (camera.shake > 0) camera.shake *= 0.88;
    if (toastTimer > 0) toastTimer--;
    if (state === 'death') { stateTimer--; if (stateTimer <= 0) { loadLevel(levelIndex); state = 'playing'; } return; }
    if (state === 'levelComplete') { stateTimer--; if (stateTimer <= 0) nextLevel(); return; }
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

    // ====== 风: 检查玩家右侧是否有箱子遮挡 ======
    var inWindZone = null;
    for (var wi = 0; wi < level.wind.length; wi++) {
      if (aabb(player, level.wind[wi])) { inWindZone = level.wind[wi]; break; }
    }
    if (inWindZone) {
      // 检查玩家右侧是否有箱子
      var shielded = false;
      for (var bi2 = 0; bi2 < level.boxes.length; bi2++) {
        var bx2 = level.boxes[bi2];
        // 箱子在玩家右侧 40px 内，且 y 有重叠
        if (bx2.x > player.x + player.w - 4 && bx2.x < player.x + player.w + 30 &&
            bx2.y < player.y + player.h && bx2.y + bx2.h > player.y) {
          shielded = true; break;
        }
      }
      if (!shielded) {
        player.vx += inWindZone.force * -4;  // 风力向左推
        showToast('🌪️ 风力太强！躲到箱子后面！');
      } else {
        showToast('🛡️ 躲在箱子后，风被挡住了');
      }
      // 更新风粒
      inWindZone.particles.forEach(function(p) {
        p.x += p.vx; p.life--;
        if (p.x < -20 || p.life <= 0) { p.x = inWindZone.w + 10; p.life = 40 + Math.random()*40; }
      });
    }

    if (jump && !player.jumpHeld) player.jumpBuffer = 6;
    player.jumpHeld = jump;

    if (player.jumpBuffer > 0 && (player.onGround || player.coyote > 0)) {
      player.vy = JUMP; player.onGround = false; player.coyote = 0;
      player.jumpBuffer = 0; audio.jump();
    }
    if (player.character === 'pip' && !player.onGround && player.vy > 0 && jump)
      player.vy = Math.min(player.vy, 2.6);
    if (player.character === 'zip' && player.jumpBuffer > 0 && !player.onGround && player.canDouble) {
      player.vy = JUMP * 0.85; player.canDouble = false; player.jumpBuffer = 0;
      audio.jump(); spawnParticles(player.x + 14, player.y + 38, '#a8d8ff', 10);
    }

    player.vy += GRAVITY;
    if (player.vy > MAXFALL) player.vy = MAXFALL;

    var nx = player.x + player.vx;
    if (!tileCollides(nx, player.y, player.w, player.h)) player.x = nx;
    else if (!tileCollides(nx, player.y - 6, player.w, player.h)) { player.y -= 6; player.x = nx; }

    // 推箱子 (箱子也受地面碰撞限制)
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

    // 移动平台
    for (var mi = 0; mi < level.movers.length; mi++) {
      var m = level.movers[mi];
      m.t += 0.02 * m.speed;
      var prevX = m.x, prevY = m.y;
      if (m.axis === 'x') m.x = m.originX + Math.sin(m.t) * m.range;
      else m.y = m.originY + Math.sin(m.t) * m.range;
      if (player.onGround) {
        var pf = {x: player.x, y: player.y + 1, w: player.w, h: 4};
        if (aabb(pf, m)) { player.x += m.x - prevX; player.y += m.y - prevY; }
      }
    }

    player.onGround = false;
    var ny = player.y + player.vy;
    if (!tileCollides(player.x, ny, player.w, player.h)) player.y = ny;
    else {
      if (player.vy > 0) {
        while (!tileCollides(player.x, player.y + 1, player.w, player.h)) player.y += 1;
        player.onGround = true; player.canDouble = true; player.coyote = 6; player.vy = 0;
      } else {
        while (!tileCollides(player.x, player.y - 1, player.w, player.h)) player.y -= 1;
        player.vy = 0;
      }
    }
    if (!player.onGround) {
      for (var mi2 = 0; mi2 < level.movers.length; mi2++) {
        var m2 = level.movers[mi2];
        var pf2 = {x: player.x, y: player.y + player.h, w: player.w, h: 4};
        if (aabb(pf2, m2) && player.vy >= 0) {
          player.y = m2.y - player.h; player.vy = 0; player.onGround = true;
          player.canDouble = true; player.coyote = 6;
        }
      }
    }

    if (player.x < 0) player.x = 0;
    if (player.x + player.w > level.width) player.x = level.width - player.w;
    if (player.y > level.height + 150) { die(); return; }

    // 尖刺
    if (player.invuln <= 0) {
      for (var si = 0; si < level.spikes.length; si++) {
        if (aabb(player, level.spikes[si]) && player.y + player.h > level.spikes[si].y + 6) { die(); return; }
      }
    }
    // 水域
    for (var wj = 0; wj < level.water.length; wj++)
      if (aabb(player, level.water[wj])) { die(); return; }

    // 敌人
    for (var ei = 0; ei < level.enemies.length; ei++) {
      var e = level.enemies[ei];
      if (!e.alive) continue;
      e.phase += 0.08; e.x += e.vx;
      e.vy += GRAVITY; if (e.vy > MAXFALL) e.vy = MAXFALL;
      var eny = e.y + e.vy;
      if (!tileCollides(e.x, eny, e.w, e.h)) { e.y = eny; e.onGround = false; }
      else {
        if (e.vy > 0) { while (!tileCollides(e.x, e.y + 1, e.w, e.h)) e.y += 1; e.onGround = true; }
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
          e.alive = false; player.vy = -9; score += 50;
          spawnParticles(e.x + 13, e.y + 13, '#ffcc44', 14); audio.collect();
        } else { die(); return; }
      }
    }

    // 胡萝卜
    for (var ci = 0; ci < level.carrots.length; ci++) {
      var c = level.carrots[ci];
      if (c.taken) continue;
      if (aabb(player, {x:c.x,y:c.y,w:24,h:24})) {
        c.taken = true; score += 10; level.collected++;
        spawnParticles(c.x + 12, c.y + 12, '#ff8844', 8); audio.collect();
      }
    }

    // 检查点
    for (var cpi = 0; cpi < level.checkpoints.length; cpi++) {
      var cp = level.checkpoints[cpi];
      if (cp.flash > 0) cp.flash--;
      if (!cp.used && aabb(player, cp)) {
        cp.used = true; cp.active = true; cp.flash = 40;
        level.spawn = { x: cp.x, y: cp.y + 12 };
        spawnParticles(cp.x + 16, cp.y + 20, '#44ff88', 24);
        audio.checkpoint(); score += 25;
        showToast('🚩 Checkpoint activated!');
      }
    }

    if (aabb(player, level.goal)) {
      score += 200 + level.collected * 3;
      audio.win(); state = 'levelComplete'; stateTimer = 120;
    }

    for (var pi = particles.length - 1; pi >= 0; pi--) {
      var p = particles[pi];
      p.x += p.vx; p.y += p.vy; p.vy += 0.15; p.life--;
      if (p.life <= 0) particles.splice(pi, 1);
    }

    var targetX = player.x + player.w / 2 - W / 2;
    if (targetX < 0) targetX = 0;
    if (targetX > level.width - W) targetX = level.width - W;
    camera.x += (targetX - camera.x) * 0.15;
  }

  // ========== DRAW ==========
  function roundRect(x, y, w, h, r) {
    if (r > w/2) r = w/2; if (r > h/2) r = h/2;
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath();
  }
  function getTheme() { return THEMES[level ? level.theme : 'grass'] || THEMES.grass; }

  function drawSky(t) {
    var g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, t.sky[0]); g.addColorStop(0.5, t.sky[1]); g.addColorStop(1, t.sky[2]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  function drawParallax(t) {
    var isCave = level && level.theme === 'cave';
    var isSky = level && level.theme === 'sky';
    var isTower = level && level.theme === 'tower';
    var isDesert = level && level.theme === 'desert';
    if (!isCave && !isTower) {
      ctx.fillStyle = isDesert ? 'rgba(255,220,140,0.9)' : 'rgba(255,240,160,0.8)';
      ctx.beginPath(); ctx.arc(W - 130, 90, 48, 0, Math.PI*2); ctx.fill();
    }
    if (isTower) {
      ctx.fillStyle = '#fff';
      for (var si = 0; si < 40; si++) {
        var sx = (si * 137 + camera.x * 0.1) % W;
        var sy = (si * 73) % (H * 0.5);
        var ss = (si % 3) * 0.5 + 0.5;
        ctx.fillRect(sx, sy, ss, ss);
      }
    }
    ctx.save(); ctx.translate(-camera.x * 0.25, 0);
    var farCol = isCave ? 'rgba(20,20,40,0.7)' : isSky ? 'rgba(180,210,255,0.7)' :
                 isDesert ? 'rgba(200,150,80,0.4)' : isTower ? 'rgba(60,40,80,0.6)' : 'rgba(60,110,160,0.55)';
    ctx.fillStyle = farCol;
    for (var i = 0; i < 15; i++) {
      var mx = i * 500 + 200;
      ctx.beginPath(); ctx.moveTo(mx - 250, 420);
      ctx.lineTo(mx, isCave ? 200 : isDesert ? 250 : 170);
      ctx.lineTo(mx + 250, 420); ctx.closePath(); ctx.fill();
    }
    ctx.restore();
    ctx.save(); ctx.translate(-camera.x * 0.5, 0);
    var midCol = isCave ? 'rgba(40,40,60,0.5)' : isSky ? 'rgba(220,235,255,0.7)' :
                 isDesert ? 'rgba(220,180,110,0.5)' : isTower ? 'rgba(90,70,120,0.5)' : 'rgba(90,160,120,0.6)';
    ctx.fillStyle = midCol;
    for (var j = 0; j < 25; j++) {
      var hx = j * 350;
      ctx.beginPath(); ctx.arc(hx + 180, 440, 180, Math.PI, 0); ctx.fill();
    }
    ctx.restore();
    if (!isCave && !isTower) {
      ctx.save(); ctx.translate(-camera.x * 0.15, 0);
      ctx.fillStyle = isSky ? 'rgba(255,255,255,0.95)' : isDesert ? 'rgba(255,240,210,0.6)' : 'rgba(255,255,255,0.7)';
      for (var k = 0; k < 20; k++) {
        var cx = k * 380 + 80, cy = 50 + (k % 3) * 45;
        ctx.beginPath();
        ctx.arc(cx, cy, 28, 0, Math.PI*2);
        ctx.arc(cx + 32, cy - 8, 24, 0, Math.PI*2);
        ctx.arc(cx + 60, cy + 6, 26, 0, Math.PI*2);
        ctx.fill();
      }
      ctx.restore();
    }
  }
  function drawTiles(t) {
    if (!level) return;
    var x1 = Math.max(0, Math.floor(camera.x / TILE) - 1);
    var x2 = Math.min(level.tiles[0].length - 1, Math.ceil((camera.x + W) / TILE) + 1);
    for (var ty = 0; ty < level.tiles.length; ty++) {
      for (var tx = x1; tx <= x2; tx++) {
        if (level.tiles[ty][tx] !== '#') continue;
        var px = tx * TILE, py = ty * TILE;
        var isTop = ty === 0 || level.tiles[ty-1][tx] !== '#';
        if (isTop) {
          ctx.fillStyle = t.top; ctx.fillRect(px, py, TILE, 8);
          ctx.fillStyle = t.topHi; ctx.fillRect(px, py, TILE, 3);
          ctx.fillStyle = t.dirt; ctx.fillRect(px, py + 8, TILE, TILE - 8);
        } else {
          ctx.fillStyle = t.dirt; ctx.fillRect(px, py, TILE, TILE);
        }
        ctx.fillStyle = 'rgba(0,0,0,0.12)';
        ctx.fillRect(px, py + TILE - 2, TILE, 2);
        ctx.fillRect(px + TILE - 2, py, 2, TILE);
      }
    }
  }
  function drawWater() {
    if (!level) return;
    for (var i = 0; i < level.water.length; i++) {
      var w = level.water[i];
      if (w.x + w.w < camera.x || w.x > camera.x + W) continue;
      var wave = Math.sin(Date.now() / 400 + i) * 3;
      var grad = ctx.createLinearGradient(0, w.y, 0, w.y + w.h);
      grad.addColorStop(0, 'rgba(80,180,255,0.75)');
      grad.addColorStop(1, 'rgba(20,80,160,0.9)');
      ctx.fillStyle = grad;
      ctx.fillRect(w.x, w.y + wave, w.w, w.h);
      ctx.fillStyle = 'rgba(160,220,255,0.6)';
      for (var k = 0; k < w.w; k += 20) {
        var ww = Math.sin(Date.now() / 300 + k * 0.1 + i) * 3;
        ctx.fillRect(w.x + k, w.y + ww, 10, 2);
      }
    }
  }
  function drawWind() {
    if (!level) return;
    for (var i = 0; i < level.wind.length; i++) {
      var w = level.wind[i];
      if (w.x + w.w < camera.x || w.x > camera.x + W) continue;
      ctx.fillStyle = 'rgba(255,220,120,0.12)';
      ctx.fillRect(w.x, w.y, w.w, w.h);
      // 风粒
      w.particles.forEach(function(p) {
        ctx.fillStyle = 'rgba(255,240,180,' + (0.3 + p.life / 120) + ')';
        ctx.fillRect(w.x + p.x, w.y + p.y, 8, 2);
      });
      // 方向箭头
      ctx.strokeStyle = 'rgba(255,240,180,0.5)';
      ctx.lineWidth = 2;
      for (var k = 0; k < 4; k++) {
        var ax = w.x + ((k * 120 + Date.now() * 0.15) % w.w);
        var ay = w.y + 30;
        ctx.beginPath();
        ctx.moveTo(ax + 15, ay); ctx.lineTo(ax, ay);
        ctx.lineTo(ax + 5, ay - 5); ctx.moveTo(ax, ay); ctx.lineTo(ax + 5, ay + 5);
        ctx.stroke();
      }
    }
  }
  function drawSpikes() {
    if (!level) return;
    for (var i = 0; i < level.spikes.length; i++) {
      var s = level.spikes[i];
      if (s.x + s.w < camera.x || s.x > camera.x + W) continue;
      // 底座
      ctx.fillStyle = '#5a6068';
      ctx.fillRect(s.x, s.y + s.h - 4, s.w, 4);
      ctx.fillStyle = '#c0c8d0';
      ctx.beginPath();
      for (var k = 0; k < 3; k++) {
        var sx = s.x + k * 10;
        ctx.moveTo(sx, s.y + s.h); ctx.lineTo(sx + 5, s.y); ctx.lineTo(sx + 10, s.y + s.h);
      }
      ctx.fill();
      ctx.fillStyle = '#8892a0';
      for (var k2 = 0; k2 < 3; k2++)
        ctx.fillRect(s.x + k2 * 10 + 6, s.y + 6, 1, s.h - 6);
    }
  }
  function drawCarrot(x, y, t) {
    var bob = Math.sin(t * 0.005 + x * 0.05) * 3;
    y += bob;
    ctx.fillStyle = 'rgba(255,180,80,0.25)';
    ctx.beginPath(); ctx.arc(x + 12, y + 12, 16, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#3aaa3a';
    ctx.beginPath();
    ctx.moveTo(x + 12, y - 2); ctx.lineTo(x + 5, y + 4); ctx.lineTo(x + 12, y + 6);
    ctx.lineTo(x + 19, y + 4); ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#5cc85c';
    ctx.beginPath();
    ctx.moveTo(x + 12, y - 2); ctx.lineTo(x + 8, y + 5); ctx.lineTo(x + 12, y + 6);
    ctx.closePath(); ctx.fill();
    var grad = ctx.createLinearGradient(x, y + 6, x + 24, y + 24);
    grad.addColorStop(0, '#ffb04a'); grad.addColorStop(1, '#e86a20');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(x + 4, y + 6); ctx.lineTo(x + 20, y + 6); ctx.lineTo(x + 12, y + 24);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillRect(x + 8, y + 10, 2, 6);
  }
  function drawBox(box) {
    ctx.fillStyle = '#a06838';
    roundRect(box.x, box.y, box.w, box.h, 4); ctx.fill();
    ctx.fillStyle = '#c88a4a';
    ctx.fillRect(box.x + 3, box.y + 3, box.w - 6, box.h - 6);
    ctx.strokeStyle = '#6a4020'; ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(box.x + 4, box.y + 4); ctx.lineTo(box.x + box.w - 4, box.y + box.h - 4);
    ctx.moveTo(box.x + box.w - 4, box.y + 4); ctx.lineTo(box.x + 4, box.y + box.h - 4);
    ctx.stroke();
  }
  function drawMovers() {
    if (!level) return;
    for (var i = 0; i < level.movers.length; i++) {
      var m = level.movers[i];
      if (m.x + m.w < camera.x || m.x > camera.x + W) continue;
      ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      if (m.axis === 'y') {
        ctx.moveTo(m.originX + m.w/2, m.originY);
        ctx.lineTo(m.originX + m.w/2, m.originY + m.range);
      } else {
        ctx.moveTo(m.originX, m.originY + m.h/2);
        ctx.lineTo(m.originX + m.range, m.originY + m.h/2);
      }
      ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = '#8866aa';
      roundRect(m.x, m.y, m.w, m.h, 4); ctx.fill();
      ctx.fillStyle = '#b088dd';
      ctx.fillRect(m.x + 2, m.y + 2, m.w - 4, 4);
    }
  }
  function drawEnemy(e) {
    if (!e.alive) return;
    if (e.x + e.w < camera.x || e.x > camera.x + W) return;
    var sq = Math.sin(e.phase) * 1.5;
    var cx = e.x + 13, cy = e.y + 13 + sq;
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(cx, e.y + e.h, 12, 3, 0, 0, Math.PI*2); ctx.fill();
    var color = e.type === 'walker' ? '#a84a6a' : '#c860a0';
    var grad = ctx.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, 14);
    grad.addColorStop(0, '#e888b0'); grad.addColorStop(1, color);
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx, cy, 13, 0, Math.PI*2); ctx.fill();
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
    ctx.strokeStyle = '#3a2030'; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(cx, cy + 5, 3, 0, Math.PI); ctx.stroke();
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
    ctx.fillStyle = '#888'; ctx.fillRect(f.x + 13, f.y, 4, f.h);
    ctx.fillStyle = '#aaa'; ctx.fillRect(f.x + 13, f.y, 2, f.h);
    ctx.fillStyle = '#ffcc44';
    ctx.beginPath(); ctx.arc(f.x + 15, f.y - 2, 6, 0, Math.PI*2); ctx.fill();
    var wave = Math.sin(Date.now() / 200) * 3;
    var grad = ctx.createLinearGradient(f.x + 17, f.y + 8, f.x + 60, f.y + 40);
    grad.addColorStop(0, '#ff5566'); grad.addColorStop(1, '#cc2244');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(f.x + 17, f.y + 8);
    ctx.quadraticCurveTo(f.x + 45, f.y + 15 + wave, f.x + 62, f.y + 20);
    ctx.lineTo(f.x + 62, f.y + 48);
    ctx.quadraticCurveTo(f.x + 45, f.y + 43 + wave, f.x + 17, f.y + 48);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#ffee88'; ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center'; ctx.fillText('★', f.x + 40, f.y + 38);
    ctx.textAlign = 'left';
  }
  // 检查点: 明显的旗杆 + 旗子 + 光晕
  function drawCheckpoints() {
    if (!level) return;
    for (var i = 0; i < level.checkpoints.length; i++) {
      var cp = level.checkpoints[i];
      if (cp.x + cp.w < camera.x - 30 || cp.x > camera.x + W + 30) continue;
      // 光晕
      if (cp.active) {
        ctx.fillStyle = 'rgba(120,255,180,' + (0.15 + Math.sin(Date.now()/300) * 0.08) + ')';
        ctx.beginPath(); ctx.arc(cp.x + 15, cp.y + 24, 32, 0, Math.PI*2); ctx.fill();
      }
      // 旗杆
      ctx.fillStyle = cp.active ? '#44ff88' : '#6688aa';
      ctx.fillRect(cp.x + 12, cp.y, 4, cp.h);
      // 旗帜
      var flagColor = cp.active ? '#44ff88' : '#aaccdd';
      ctx.fillStyle = flagColor;
      var wave = cp.flash > 0 ? Math.sin(Date.now()/50) * 6 : 0;
      ctx.beginPath();
      ctx.moveTo(cp.x + 16, cp.y + 4);
      ctx.lineTo(cp.x + 34 + wave, cp.y + 14);
      ctx.lineTo(cp.x + 16, cp.y + 24);
      ctx.closePath(); ctx.fill();
      // 星
      ctx.fillStyle = cp.active ? '#ffffff' : '#8899aa';
      ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center';
      ctx.fillText(cp.active ? '✓' : '·', cp.x + 22, cp.y + 18);
      ctx.textAlign = 'left';
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
    ctx.beginPath(); ctx.ellipse(cx, p.y + p.h + 2, p.w/2, 4, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = bodyCol;
    ctx.beginPath();
    ctx.ellipse(cx - 7, cy - 22, 5, 16, -0.12, 0, Math.PI*2);
    ctx.ellipse(cx + 7, cy - 22, 5, 16, 0.12, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = earInner;
    ctx.beginPath();
    ctx.ellipse(cx - 7, cy - 22, 2.2, 11, -0.12, 0, Math.PI*2);
    ctx.ellipse(cx + 7, cy - 22, 2.2, 11, 0.12, 0, Math.PI*2);
    ctx.fill();
    var grad = ctx.createRadialGradient(cx - 6, cy - 6, 3, cx, cy, 20);
    grad.addColorStop(0, lightCol); grad.addColorStop(1, bodyCol);
    ctx.fillStyle = grad;
    ctx.beginPath(); ctx.arc(cx, cy, 16, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = lightCol;
    ctx.beginPath(); ctx.ellipse(cx, cy + 4, 9, 7, 0, 0, Math.PI*2); ctx.fill();
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
    ctx.beginPath(); ctx.arc(cx + lx, cy + 4, 2.4, 0, Math.PI*2); ctx.fill();
    ctx.strokeStyle = 'rgba(40,40,60,0.6)'; ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy + 4); ctx.lineTo(cx - 15, cy + 2);
    ctx.moveTo(cx - 8, cy + 6); ctx.lineTo(cx - 15, cy + 8);
    ctx.moveTo(cx + 8, cy + 4); ctx.lineTo(cx + 15, cy + 2);
    ctx.moveTo(cx + 8, cy + 6); ctx.lineTo(cx + 15, cy + 8);
    ctx.stroke();
    if (isZip) {
      ctx.fillStyle = '#204060';
      ctx.beginPath(); ctx.arc(cx, cy - 10, 10, Math.PI, 0); ctx.fill();
      ctx.fillRect(cx - 10, cy - 11, 20, 3);
    } else {
      ctx.fillStyle = '#ff4488';
      ctx.beginPath();
      ctx.moveTo(cx - 10, cy - 10); ctx.lineTo(cx - 4, cy - 14); ctx.lineTo(cx - 4, cy - 6);
      ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(cx + 10, cy - 10); ctx.lineTo(cx + 4, cy - 14); ctx.lineTo(cx + 4, cy - 6);
      ctx.closePath(); ctx.fill();
    }
    if (!isZip && !p.onGround && p.vy > 0 && (keys['ArrowUp']||keys['w']||keys['W']||keys[' '])) {
      ctx.fillStyle = 'rgba(255,180,220,0.7)';
      ctx.beginPath(); ctx.ellipse(cx, cy - 24, 26, 10, 0, 0, Math.PI*2); ctx.fill();
    }
    if (switchFlash > 0) {
      ctx.strokeStyle = 'rgba(255,255,180,' + (switchFlash / 18) + ')';
      ctx.lineWidth = 3;
      ctx.beginPath(); ctx.arc(cx, cy, 26 + (18 - switchFlash) * 2, 0, Math.PI*2); ctx.stroke();
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
  function drawCaveDarkness() {
    if (!level || level.theme !== 'cave') return;
    var cx = player.x + player.w/2 - camera.x;
    var cy = player.y + player.h/2;
    var r = 170;
    var g = ctx.createRadialGradient(cx, cy, 30, cx, cy, r);
    g.addColorStop(0, 'rgba(0,0,0,0)');
    g.addColorStop(0.7, 'rgba(0,0,0,0.6)');
    g.addColorStop(1, 'rgba(0,0,0,0.92)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  }
  function drawToast() {
    if (toastTimer <= 0 || !toastText) return;
    var alpha = Math.min(1, toastTimer / 30);
    ctx.globalAlpha = alpha;
    ctx.font = 'bold 18px "Courier New", monospace';
    var textW = ctx.measureText(toastText).width;
    ctx.fillStyle = 'rgba(8,16,32,0.85)';
    roundRect(W/2 - textW/2 - 20, 120, textW + 40, 40, 12); ctx.fill();
    ctx.strokeStyle = 'rgba(120,180,240,0.6)'; ctx.lineWidth = 2;
    roundRect(W/2 - textW/2 - 20, 120, textW + 40, 40, 12); ctx.stroke();
    ctx.fillStyle = '#ffdd66';
    ctx.textAlign = 'center';
    ctx.fillText(toastText, W/2, 146);
    ctx.textAlign = 'left';
    ctx.globalAlpha = 1;
  }
  function drawHUD() {
    ctx.fillStyle = 'rgba(8,16,32,0.72)';
    roundRect(14, 14, 280, 92, 16); ctx.fill();
    ctx.strokeStyle = 'rgba(120,180,240,0.5)'; ctx.lineWidth = 2;
    roundRect(14, 14, 280, 92, 16); ctx.stroke();
    ctx.fillStyle = '#ffdd66'; ctx.font = 'bold 22px "Courier New", monospace';
    ctx.fillText('★ ' + String(score).padStart(5, '0'), 30, 44);
    ctx.fillStyle = '#ff6688'; ctx.font = 'bold 18px "Courier New", monospace';
    var hearts = '';
    for (var i = 0; i < Math.max(0, lives); i++) hearts += '♥ ';
    ctx.fillText(hearts, 30, 72);
    ctx.fillStyle = '#aac8e0'; ctx.font = 'bold 13px "Courier New", monospace';
    ctx.fillText('LV ' + (levelIndex + 1) + '/' + totalLevels + '  ' + (level ? level.name : ''), 30, 92);

    ctx.fillStyle = 'rgba(8,16,32,0.72)';
    roundRect(W - 250, 14, 236, 92, 16); ctx.fill();
    ctx.strokeStyle = 'rgba(120,180,240,0.5)';
    roundRect(W - 250, 14, 236, 92, 16); ctx.stroke();
    ctx.fillStyle = '#ffaa44'; ctx.font = 'bold 22px "Courier New", monospace';
    var c1 = level ? level.collected : 0;
    var c2 = level ? level.totalCarrots : 0;
    ctx.fillText('🥕 ' + c1 + '/' + c2, W - 235, 44);
    var isZip = player.character === 'zip';
    ctx.fillStyle = isZip ? '#5cb8ff' : '#ff88b8';
    ctx.font = 'bold 15px "Courier New", monospace';
    ctx.fillText('▶ ' + (isZip ? 'ZIP (2x Jump)' : 'PIP (Glide)'), W - 235, 72);
    ctx.fillStyle = '#8898aa'; ctx.font = '11px "Courier New", monospace';
    ctx.fillText('E=Switch  M=Mute' + (audio.isMuted()?' [OFF]':'') + '  R=Retry', W - 235, 92);
  }
  function drawTitle() {
    drawSky(THEMES.grass); drawParallax(THEMES.grass);
    ctx.fillStyle = 'rgba(6,10,24,0.7)'; ctx.fillRect(0, 0, W, H);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#ffdd66'; ctx.font = 'bold 72px "Trebuchet MS", sans-serif';
    ctx.shadowColor = '#ff8800'; ctx.shadowBlur = 22;
    ctx.fillText('Zip & Pip', W/2, 140);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#88ddff'; ctx.font = 'bold 40px "Trebuchet MS", sans-serif';
    ctx.fillText('CARROT QUEST', W/2, 190);
    ctx.fillStyle = '#ffbb66'; ctx.font = 'bold 18px "Trebuchet MS", sans-serif';
    ctx.fillText('v4 · Themed Mechanics', W/2, 220);
    drawTitleChar(W/2 - 140, 305, 'zip');
    drawTitleChar(W/2 + 140, 305, 'pip');
    ctx.fillStyle = '#c8dae8'; ctx.font = 'bold 18px "Courier New", monospace';
    ctx.fillText('Press SPACE / ENTER to start', W/2, 415);
    ctx.fillStyle = '#8898aa'; ctx.font = '11px "Courier New", monospace';
    ctx.fillText('←→ Move  ·  ↑/W/SPACE Jump  ·  E Switch  ·  M Mute  ·  R Retry', W/2, 442);
    ctx.fillText('Push boxes in sandstorm · Glide over rivers · Climb towers · Fly sky', W/2, 462);
    ctx.textAlign = 'left';
  }
  function drawTitleChar(x, y, type) {
    var isZip = type === 'zip';
    var bodyCol = isZip ? '#5cb8ff' : '#ff88b8';
    var lightCol = isZip ? '#b8e0ff' : '#ffd0e8';
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.beginPath(); ctx.ellipse(x, y + 30, 24, 6, 0, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = bodyCol;
    ctx.beginPath();
    ctx.ellipse(x - 10, y - 32, 6, 22, -0.1, 0, Math.PI*2);
    ctx.ellipse(x + 10, y - 32, 6, 22, 0.1, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = isZip ? '#d8ecff' : '#ffe0f0';
    ctx.beginPath();
    ctx.ellipse(x - 10, y - 32, 3, 16, -0.1, 0, Math.PI*2);
    ctx.ellipse(x + 10, y - 32, 3, 16, 0.1, 0, Math.PI*2);
    ctx.fill();
    var g = ctx.createRadialGradient(x - 6, y - 6, 3, x, y, 24);
    g.addColorStop(0, lightCol); g.addColorStop(1, bodyCol);
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, 22, 0, Math.PI*2); ctx.fill();
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
    ctx.beginPath(); ctx.arc(x, y + 6, 3.2, 0, Math.PI*2); ctx.fill();
    if (isZip) {
      ctx.fillStyle = '#204060';
      ctx.beginPath(); ctx.arc(x, y - 14, 13, Math.PI, 0); ctx.fill();
      ctx.fillRect(x - 13, y - 15, 26, 4);
    } else {
      ctx.fillStyle = '#ff4488';
      ctx.beginPath();
      ctx.moveTo(x - 14, y - 14); ctx.lineTo(x - 5, y - 19); ctx.lineTo(x - 5, y - 9);
      ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(x + 14, y - 14); ctx.lineTo(x + 5, y - 19); ctx.lineTo(x + 5, y - 9);
      ctx.closePath(); ctx.fill();
    }
  }
  function draw() {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (state === 'title') { drawTitle(); return; }
    var theme = getTheme();
    drawSky(theme); drawParallax(theme);
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
    drawCaveDarkness();
    drawHUD();
    drawToast();
    if (state === 'levelComplete') {
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffdd66'; ctx.font = 'bold 56px "Trebuchet MS", sans-serif';
      ctx.shadowColor = '#ff8800'; ctx.shadowBlur = 16;
      ctx.fillText('LEVEL CLEAR!', W/2, H/2 - 20);
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff'; ctx.font = 'bold 22px "Courier New", monospace';
      ctx.fillText('Carrots: ' + level.collected + '/' + level.totalCarrots, W/2, H/2 + 30);
      ctx.textAlign = 'left';
    }
    if (state === 'death') {
      ctx.fillStyle = 'rgba(120,0,0,0.35)'; ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ff8888'; ctx.font = 'bold 42px "Trebuchet MS", sans-serif';
      ctx.fillText('OUCH!', W/2, H/2);
      ctx.textAlign = 'left';
    }
    if (state === 'gameOver') {
      ctx.fillStyle = 'rgba(6,10,24,0.88)'; ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ff4466'; ctx.font = 'bold 60px "Trebuchet MS", sans-serif';
      ctx.shadowColor = '#ff0000'; ctx.shadowBlur = 22;
      ctx.fillText('GAME OVER', W/2, H/2 - 20);
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#fff'; ctx.font = 'bold 22px "Courier New", monospace';
      ctx.fillText('Final Score: ' + score, W/2, H/2 + 35);
      ctx.fillStyle = '#88ddff'; ctx.font = '18px "Courier New", monospace';
      ctx.fillText('Press SPACE to return', W/2, H/2 + 80);
      ctx.textAlign = 'left';
    }
    if (state === 'win') {
      ctx.fillStyle = 'rgba(6,10,24,0.88)'; ctx.fillRect(0, 0, W, H);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffdd66'; ctx.font = 'bold 60px "Trebuchet MS", sans-serif';
      ctx.shadowColor = '#ff8800'; ctx.shadowBlur = 24;
      ctx.fillText('🏆 YOU WIN! 🏆', W/2, H/2 - 40);
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#88ffaa'; ctx.font = 'bold 26px "Courier New", monospace';
      ctx.fillText('All ' + totalLevels + ' levels cleared!', W/2, H/2 + 20);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 20px "Courier New", monospace';
      ctx.fillText('Final Score: ' + score, W/2, H/2 + 60);
      ctx.fillStyle = '#88ddff'; ctx.font = '18px "Courier New", monospace';
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
