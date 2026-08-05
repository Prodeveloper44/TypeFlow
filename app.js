/* TypeFlow — app.js
 * Vanilla JS typing speed platform: test, results, leaderboard, stats, settings.
 * Data persists in localStorage; leaderboard is local (no backend needed).
 */
(function () {
  'use strict';

  // ─── State ────────────────────────────────────────────────────────────────
  var STORAGE_KEY = 'typeflow_v1';
  var AVATARS = ['⌨️','🚀','⚡','🔥','💎','🎯','🏆','🦅','🐺','🦊','🐉','⭐','🎮','👾','🤖','🐱'];
  var THEMES = [
    { id: 'dark', label: 'Dark', bg: 'radial-gradient(ellipse at top, #15203a, #0a0e1a)' },
    { id: 'light', label: 'Light', bg: 'radial-gradient(ellipse at top, #e8eef9, #f4f6fb)' },
    { id: 'midnight', label: 'Midnight', bg: 'radial-gradient(ellipse at top, #1a1438, #070612)' },
    { id: 'ocean', label: 'Ocean', bg: 'radial-gradient(ellipse at top, #0d2a40, #06141f)' },
    { id: 'forest', label: 'Forest', bg: 'radial-gradient(ellipse at top, #0f2a1f, #081410)' },
  ];
  var FONTS = [
    { id: 'jetbrains', label: 'JetBrains Mono', stack: "'JetBrains Mono', monospace" },
    { id: 'fira', label: 'Fira Code', stack: "'Fira Code', 'JetBrains Mono', monospace" },
    { id: 'roboto', label: 'Roboto Mono', stack: "'Roboto Mono', 'JetBrains Mono', monospace" },
  ];

  var WORDS = 'the be of to and a in that have I it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us'.split(' ');
  var LONGER = 'through however without again something another already beautiful important different together sometimes question information experience everything understand particular'.split(' ');
  var QUOTES = [
    'The only way to do great work is to love what you do.',
    'Innovation distinguishes between a leader and a follower.',
    'Your time is limited so do not waste it living someone else life.',
    'The future belongs to those who believe in the beauty of their dreams.',
    'Success is not final failure is not fatal it is the courage to continue that counts.',
    'It does not matter how slowly you go as long as you do not stop.',
    'The best way to predict the future is to invent it.',
    'Quality is not an act it is a habit.',
    'The mind is everything what you think you become.',
    'Creativity is intelligence having fun.',
    'Do not watch the clock do what it does keep going.',
    'The secret of getting ahead is getting started.',
  ];
  var CODE = [
    'const sum = (a, b) => a + b;',
    'function fib(n) { return n < 2 ? n : fib(n - 1) + fib(n - 2); }',
    'const map = arr => arr.map(x => x * 2).filter(x => x > 5);',
    'async function fetchUser(id) { const r = await fetch(id); return r.json(); }',
    'const arr = [1, 2, 3].reduce((a, x) => a + x, 0);',
    'type Result = { ok: true; value: T } | { ok: false; error: string };',
    'const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(fn, ms, ...a); }; };',
    'class Queue { constructor() { this.items = []; } push(x) { this.items.push(x); } pop() { return this.items.shift(); } }',
    'const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);',
  ];
  var NUMBERS = '7392 4810 5926 1048 3729 6481 9203 8473 2156 3987 5214 7649 0382 9156 4837 6204 1593 8472 3061 7925 4817 2639 9048 5173 8296 3501 6847 9213 5086 1749'.split(' ');
  var PARAGRAPHS = [
    'Touch typing is the ability to use a keyboard without looking at the keys. It relies on muscle memory and consistent finger placement. With practice your speed and accuracy will improve dramatically allowing you to focus on your thoughts rather than the mechanics of typing.',
    'The quick brown fox jumps over the lazy dog while the sun sets behind the mountains. Birds return to their nests as the first stars appear in the darkening sky. A gentle breeze rustles through the trees carrying the scent of pine and distant rain.',
  ];

  var ACHIEVEMENTS = [
    { id: 'first', name: 'First Steps', desc: 'Complete your first test', icon: '🎯', goal: 1, metric: 'tests', tier: '🥉' },
    { id: 'wpm50', name: 'Getting Fast', desc: 'Reach 50 WPM', icon: '⚡', goal: 50, metric: 'wpm', tier: '🥉' },
    { id: 'wpm75', name: 'Speed Demon', desc: 'Reach 75 WPM', icon: '🚀', goal: 75, metric: 'wpm', tier: '🥈' },
    { id: 'wpm100', name: 'Lightning Fingers', desc: 'Reach 100 WPM', icon: '⚡', goal: 100, metric: 'wpm', tier: '🥇' },
    { id: 'perfect', name: 'Flawless', desc: '100% accuracy', icon: '💎', goal: 100, metric: 'acc', tier: '🥇' },
    { id: 't100', name: 'Centurion', desc: 'Complete 100 tests', icon: '💯', goal: 100, metric: 'tests', tier: '🥈' },
    { id: 's7', name: 'Consistent', desc: '7-day streak', icon: '🔥', goal: 7, metric: 'streak', tier: '🥉' },
    { id: 's30', name: 'Unstoppable', desc: '30-day streak', icon: '🏆', goal: 30, metric: 'streak', tier: '🏆' },
  ];

  var defaults = {
    name: 'Guest', avatar: '⌨️', theme: 'dark', font: 'jetbrains',
    fontSize: 24, sounds: false, animations: true,
    tests: [], playerId: 'p-' + Math.random().toString(36).slice(2) + Date.now().toString(36),
  };

  function loadState() {
    try { var s = JSON.parse(localStorage.getItem(STORAGE_KEY)); if (s) return Object.assign({}, defaults, s); }
    catch (e) {}
    return Object.assign({}, defaults);
  }
  function saveState() { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {} }

  var state = loadState();

  // ─── Helpers ──────────────────────────────────────────────────────────────
  function $(id) { return document.getElementById(id); }
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function toast(msg) {
    var t = $('toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(t._timer); t._timer = setTimeout(function () { t.classList.remove('show'); }, 2500);
  }
  function fmtDate(d) { return new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' }); }

  // ─── Navigation ───────────────────────────────────────────────────────────
  function showView(name) {
    document.querySelectorAll('.view').forEach(function (v) { v.classList.remove('active'); });
    var view = $('view-' + name) || $('view-home');
    view.classList.add('active');
    document.querySelectorAll('.nav-links a, .bottom-nav a').forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('data-view') === name);
    });
    if (name === 'leaderboard') renderLeaderboard();
    if (name === 'stats') renderStats();
    if (name === 'settings') renderSettings();
    if (name === 'test') resetTest();
    window.scrollTo(0, 0);
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-view]');
    if (t) { e.preventDefault(); showView(t.getAttribute('data-view')); }
  });

  // ─── Background keys ──────────────────────────────────────────────────────
  (function initBgKeys() {
    var keys = 'QWERTYUIOPASDFGHJKLZXCVBNM';
    var container = $('bgKeys');
    for (var i = 0; i < 12; i++) {
      var k = el('div', 'bg-key', keys[Math.floor(Math.random() * keys.length)]);
      k.style.left = Math.random() * 100 + '%';
      k.style.fontSize = (14 + Math.random() * 28) + 'px';
      k.style.animationDuration = (14 + Math.random() * 10) + 's';
      k.style.animationDelay = (Math.random() * 12) + 's';
      container.appendChild(k);
    }
  })();

  // ─── Theme & Font ─────────────────────────────────────────────────────────
  function applyTheme() {
    document.body.setAttribute('data-theme', state.theme);
    var t = THEMES.find(function (x) { return x.id === state.theme; });
    if (t) document.body.style.backgroundImage = t.bg;
  }
  function applyFont() {
    var f = FONTS.find(function (x) { return x.id === state.font; });
    if (f) { document.body.style.fontFamily = f.stack; $('typeDisplay').style.fontFamily = f.stack; }
    $('typeDisplay').style.fontSize = state.fontSize + 'px';
  }
  function updateNav() {
    $('navAvatar').textContent = state.avatar;
    $('navName').textContent = state.name;
  }

  // ─── Text generation ─────────────────────────────────────────────────────
  var cfg = { duration: 30, mode: 'words', diff: 'medium' };

  function generateText() {
    if (cfg.mode === 'quotes') return QUOTES[Math.floor(Math.random() * QUOTES.length)];
    if (cfg.mode === 'code') return CODE.join(' ');
    if (cfg.mode === 'numbers') return NUMBERS.join(' ');
    if (cfg.mode === 'paragraph') return PARAGRAPHS[Math.floor(Math.random() * PARAGRAPHS.length)];
    var pool = cfg.mode === 'mixed' ? WORDS.concat(LONGER, NUMBERS) : WORDS;
    var diffPool = cfg.diff === 'easy' ? WORDS.filter(function (w) { return w.length <= 4; })
      : cfg.diff === 'medium' ? WORDS
      : cfg.diff === 'hard' ? WORDS.concat(LONGER)
      : LONGER.concat(WORDS.filter(function (w) { return w.length >= 6; }));
    var target = Math.max(40, Math.floor(cfg.duration * 2.6));
    var out = [];
    for (var i = 0; i < target; i++) out.push(diffPool[Math.floor(Math.random() * diffPool.length)]);
    return out.join(' ');
  }

  // ─── Typing test ──────────────────────────────────────────────────────────
  var test = { text: '', typed: '', startedAt: null, finished: false, timer: null, wpmSeries: [], accSeries: [], mistyped: {} };

  function resetTest() {
    if (test.timer) clearInterval(test.timer);
    test = { text: generateText(), typed: '', startedAt: null, finished: false, timer: null, wpmSeries: [], accSeries: [], mistyped: {} };
    $('liveWpm').textContent = '0';
    $('liveAcc').textContent = '100%';
    $('liveChars').textContent = '0';
    $('liveTime').textContent = cfg.duration + 's';
    $('progressBar').style.setProperty('--progress', '0%');
    $('progressBar').style.width = '0%';
    $('typeHint').style.display = 'block';
    $('typeInput').value = '';
    renderTypeDisplay();
    $('typeInput').focus();
  }

  function renderTypeDisplay() {
    var chars = test.text.split('');
    var html = '';
    for (var i = 0; i < chars.length; i++) {
      var typed = test.typed[i];
      var cls = 't-pending';
      if (typed !== undefined) cls = typed === chars[i] ? 't-correct' : 't-wrong';
      if (i === test.typed.length && !test.finished) cls += ' t-cursor';
      var ch = chars[i] === ' ' && typed !== undefined && typed !== ' ' ? '_' : chars[i];
      html += '<span class="' + cls + '">' + escapeHtml(ch) + '</span>';
    }
    $('typeDisplay').innerHTML = html;
  }
  function escapeHtml(s) { return s.replace(/[&<>"']/g, function (c) { return { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]; }); }

  function computeStats(typed, elapsed) {
    var correct = 0, errs = 0;
    for (var i = 0; i < typed.length; i++) {
      if (i < test.text.length && typed[i] === test.text[i]) correct++; else errs++;
    }
    var mins = Math.max(elapsed / 60, 1 / 60);
    var wpm = Math.round(correct / 5 / mins);
    var acc = typed.length === 0 ? 100 : Math.round(correct / typed.length * 1000) / 10;
    return { wpm: wpm, acc: acc, correct: correct, errs: errs };
  }

  function playKey() {
    if (!state.sounds) return;
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)();
      var osc = ctx.createOscillator(), g = ctx.createGain();
      osc.type = 'square'; osc.frequency.value = 1200 + Math.random() * 200;
      g.gain.setValueAtTime(0.04, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(g).connect(ctx.destination); osc.start(); osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  }

  function onInput(e) {
    var val = e.target.value;
    if (test.finished) return;
    if (val.length < test.typed.length) { test.typed = val; renderTypeDisplay(); return; }
    if (!test.startedAt && val.length > 0) {
      test.startedAt = Date.now();
      $('typeHint').style.display = 'none';
      startTimer();
    }
    var newChar = val[val.length - 1];
    if (val.length <= test.text.length && newChar !== test.text[val.length - 1]) {
      var expected = test.text[val.length - 1] || '';
      test.mistyped[expected] = (test.mistyped[expected] || 0) + 1;
    }
    playKey();
    test.typed = val;
    renderTypeDisplay();
    if (test.typed.length >= test.text.length) finishTest();
  }

  function startTimer() {
    test.timer = setInterval(function () {
      var elapsed = (Date.now() - test.startedAt) / 1000;
      var remaining = Math.max(0, cfg.duration - elapsed);
      $('liveTime').textContent = Math.ceil(remaining) + 's';
      $('progressBar').style.setProperty('--progress', ((cfg.duration - remaining) / cfg.duration * 100) + '%');
      $('progressBar').style.width = ((cfg.duration - remaining) / cfg.duration * 100) + '%';
      var s = computeStats(test.typed, elapsed);
      $('liveWpm').textContent = s.wpm;
      $('liveAcc').textContent = s.acc + '%';
      $('liveChars').textContent = test.typed.length;
      if (Math.floor(elapsed * 2) % 2 === 0) {
        test.wpmSeries.push({ t: Math.round(elapsed), wpm: s.wpm });
        test.accSeries.push({ t: Math.round(elapsed), acc: s.acc });
      }
      if (remaining <= 0) finishTest();
    }, 200);
  }

  function finishTest() {
    if (test.finished) return;
    test.finished = true;
    if (test.timer) clearInterval(test.timer);
    var elapsed = test.startedAt ? (Date.now() - test.startedAt) / 1000 : cfg.duration;
    var s = computeStats(test.typed, elapsed);
    var rawWpm = Math.round(test.typed.length / 5 / Math.max(elapsed / 60, 1 / 60));
    // word counts
    var textWords = test.text.split(' '), correctWords = 0, incorrectWords = 0, idx = 0;
    for (var w = 0; w < textWords.length; w++) {
      var wl = textWords[w].length;
      var tw = test.typed.slice(idx, idx + wl);
      if (tw === textWords[w]) correctWords++; else if (tw.length > 0) incorrectWords++;
      idx += wl + 1;
    }
    var result = {
      wpm: s.wpm, rawWpm: rawWpm, accuracy: s.acc, duration: Math.round(elapsed),
      mode: cfg.mode, difficulty: cfg.diff, mistakes: s.errs,
      correctWords: correctWords, incorrectWords: incorrectWords, characters: test.typed.length,
      wpmSeries: test.wpmSeries, accSeries: test.accSeries, mistyped: test.mistyped,
      date: new Date().toISOString(),
    };
    showResults(result);
  }

  // ─── Results ──────────────────────────────────────────────────────────────
  var lastResult = null;

  function showResults(r) {
    lastResult = r;
    var isPb = state.tests.length === 0 || r.wpm >= Math.max.apply(null, state.tests.map(function (t) { return t.wpm; }));
    $('pbBanner').style.display = isPb ? 'block' : 'none';
    if (isPb) fireConfetti();

    animateNumber($('resWpm'), r.wpm);
    animateNumber($('resAcc'), r.accuracy, '%', 1);
    animateNumber($('resCpm'), r.rawWpm * 5);
    animateNumber($('resMistakes'), r.mistakes);

    var details = [
      ['🎯', r.correctWords, 'Correct Words'], ['✖', r.incorrectWords, 'Wrong Words'],
      ['#', r.characters, 'Characters'], ['⏱', r.duration + 's', 'Time'],
      ['📈', r.rawWpm, 'Raw WPM'], ['⚠', r.mistakes, 'Errors'],
    ];
    $('resultsGrid').innerHTML = details.map(function (d) {
      return '<div class="result-detail glass"><div class="rd-icon">' + d[0] + '</div><div class="rd-value">' + d[1] + '</div><div class="rd-label">' + d[2] + '</div></div>';
    }).join('');

    drawLineChart($('wpmChart'), r.wpmSeries.length ? r.wpmSeries : [{ t: 0, wpm: 0 }, { t: r.duration, wpm: r.wpm }], 'wpm', '#3B82F6');
    drawLineChart($('accChart'), r.accSeries.length ? r.accSeries : [{ t: 0, acc: 100 }, { t: r.duration, acc: r.accuracy }], 'acc', '#22C55E', 100);

    var heat = Object.keys(r.mistyped).map(function (k) { return { key: k === ' ' ? '␣' : k, count: r.mistyped[k] }; })
      .sort(function (a, b) { return b.count - a.count; }).slice(0, 12);
    if (heat.length === 0) { $('noMistakes').style.display = 'block'; $('heatChart').style.display = 'none'; }
    else { $('noMistakes').style.display = 'none'; $('heatChart').style.display = 'block'; drawBarChart($('heatChart'), heat, 'count', '#F97316'); }

    showView('results');
  }

  function animateNumber(node, target, suffix, decimals) {
    suffix = suffix || ''; decimals = decimals || 0;
    var start = performance.now(), dur = 1200;
    function step(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      node.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ─── Charts (canvas) ──────────────────────────────────────────────────────
  function setupCanvas(canvas) {
    var ctx = canvas.getContext('2d');
    var dpr = window.devicePixelRatio || 1;
    var w = canvas.clientWidth || 600, h = parseInt(canvas.getAttribute('height')) || 200;
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.scale(dpr, dpr);
    return { ctx: ctx, w: w, h: h };
  }

  function drawLineChart(canvas, data, key, color, maxY) {
    var c = setupCanvas(canvas), ctx = c.ctx, w = c.w, h = c.h;
    var pad = 30;
    ctx.clearRect(0, 0, w, h);
    var vals = data.map(function (d) { return d[key]; });
    var max = maxY || Math.max.apply(null, vals.concat([1])) * 1.1;
    // grid
    ctx.strokeStyle = 'hsla(0,0%,100%,0.06)'; ctx.lineWidth = 1;
    for (var i = 0; i <= 4; i++) {
      var y = pad + (h - pad * 2) * i / 4;
      ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(w - pad, y); ctx.stroke();
    }
    // line
    ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.beginPath();
    data.forEach(function (d, i) {
      var x = pad + (w - pad * 2) * (i / Math.max(data.length - 1, 1));
      var y = h - pad - (h - pad * 2) * (d[key] / max);
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    });
    ctx.stroke();
    // fill
    ctx.lineTo(w - pad, h - pad); ctx.lineTo(pad, h - pad); ctx.closePath();
    ctx.fillStyle = color + '22'; ctx.fill();
    // labels
    ctx.fillStyle = '#8b94a8'; ctx.font = '11px Inter, sans-serif'; ctx.textAlign = 'center';
    data.filter(function (_, i) { return i % Math.ceil(data.length / 5) === 0; }).forEach(function (d, i) {
      var idx = data.indexOf(d);
      var x = pad + (w - pad * 2) * (idx / Math.max(data.length - 1, 1));
      ctx.fillText(d.t + 's', x, h - 8);
    });
  }

  function drawBarChart(canvas, data, key, color) {
    var c = setupCanvas(canvas), ctx = c.ctx, w = c.w, h = c.h;
    var pad = 30;
    ctx.clearRect(0, 0, w, h);
    var max = Math.max.apply(null, data.map(function (d) { return d[key]; }).concat([1]));
    var bw = (w - pad * 2) / data.length;
    data.forEach(function (d, i) {
      var x = pad + i * bw;
      var bh = (h - pad * 2) * (d[key] / max);
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect ? ctx.roundRect(x + 4, h - pad - bh, bw - 8, bh, [6, 6, 0, 0]) : ctx.rect(x + 4, h - pad - bh, bw - 8, bh);
      ctx.fill();
      ctx.fillStyle = '#8b94a8'; ctx.font = '12px JetBrains Mono, monospace'; ctx.textAlign = 'center';
      ctx.fillText(d.key, x + bw / 2, h - 8);
    });
  }

  // ─── Confetti ─────────────────────────────────────────────────────────────
  function fireConfetti() {
    var canvas = $('confettiCanvas'), ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    var colors = ['#3B82F6', '#22C55E', '#A855F7', '#F97316'];
    var particles = [];
    for (var i = 0; i < 120; i++) {
      particles.push({
        x: canvas.width / 2, y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16, vy: (Math.random() - 1) * 14,
        size: 4 + Math.random() * 6, color: colors[Math.floor(Math.random() * colors.length)],
        rot: Math.random() * 360, vr: (Math.random() - 0.5) * 10, life: 1,
      });
    }
    function frame() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var alive = false;
      particles.forEach(function (p) {
        p.vy += 0.4; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= 0.008;
        if (p.life > 0) {
          alive = true;
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
          ctx.fillStyle = p.color; ctx.globalAlpha = Math.max(p.life, 0);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
          ctx.restore();
        }
      });
      if (alive) requestAnimationFrame(frame); else ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(frame);
  }

  // ─── Save / Share ─────────────────────────────────────────────────────────
  function saveResult() {
    if (!lastResult) return;
    state.tests.push(lastResult);
    saveState();
    toast('Result saved! 🎉');
  }
  function shareResult() {
    if (!lastResult) return;
    var txt = 'I just typed ' + lastResult.wpm + ' WPM with ' + lastResult.accuracy + '% accuracy on TypeFlow! Can you beat me?';
    if (navigator.share) navigator.share({ text: txt }).catch(function () {});
    else { navigator.clipboard.copy(txt); toast('Copied to clipboard!'); }
  }

  // ─── Leaderboard ──────────────────────────────────────────────────────────
  var lbFilter = 'week', lbQuery = '';

  function renderLeaderboard() {
    var rows = state.tests.slice();
    // add some demo competitors if few results
    if (rows.length < 5) {
      rows = rows.concat([
        { player_name: 'SpeedyTyper', avatar: '🚀', wpm: 92, accuracy: 98.5, mode: 'words', date: new Date().toISOString() },
        { player_name: 'KeyboardKing', avatar: '🏆', wpm: 85, accuracy: 96.2, mode: 'quotes', date: new Date().toISOString() },
        { player_name: 'FastFingers', avatar: '⚡', wpm: 78, accuracy: 99.1, mode: 'words', date: new Date(Date.now() - 86400000).toISOString() },
        { player_name: 'TypeMaster', avatar: '💎', wpm: 71, accuracy: 95.0, mode: 'code', date: new Date(Date.now() - 3 * 86400000).toISOString() },
        { player_name: 'QuickBrownFox', avatar: '🦊', wpm: 65, accuracy: 97.8, mode: 'words', date: new Date(Date.now() - 5 * 86400000).toISOString() },
      ]);
    }
    // filter by time
    if (lbFilter !== 'all') {
      var days = lbFilter === 'today' ? 1 : lbFilter === 'week' ? 7 : 30;
      var since = Date.now() - days * 86400000;
      rows = rows.filter(function (t) { return new Date(t.date).getTime() >= since; });
    }
    // best per player
    var best = {};
    rows.forEach(function (t) {
      var name = t.player_name || state.name;
      if (!best[name] || t.wpm > best[name].wpm) best[name] = Object.assign({}, t, { player_name: name, avatar: t.avatar || state.avatar });
    });
    var ranked = Object.values(best).sort(function (a, b) { return b.wpm - a.wpm; });
    if (lbQuery) ranked = ranked.filter(function (t) { return t.player_name.toLowerCase().indexOf(lbQuery.toLowerCase()) >= 0; });

    var body = $('lbBody');
    if (ranked.length === 0) { body.innerHTML = '<tr><td colspan="5" class="lb-empty">No results yet. Be the first!</td></tr>'; return; }
    body.innerHTML = ranked.map(function (t, i) {
      var medal = i === 0 ? '👑' : i === 1 ? '🥈' : i === 2 ? '🥉' : (i + 1);
      var me = t.player_name === state.name ? ' lb-me' : '';
      return '<tr class="' + me + '"><td class="lb-rank">' + medal + '</td><td>' + (t.avatar || '⌨️') + ' ' + escapeHtml(t.player_name) + (me ? ' <span style="color:var(--primary);font-size:12px">(you)</span>' : '') + '</td><td style="color:var(--primary);font-weight:700">' + t.wpm + '</td><td style="color:var(--success)">' + Number(t.accuracy).toFixed(1) + '%</td><td style="color:var(--muted);text-transform:capitalize">' + t.mode + '</td></tr>';
    }).join('');
  }

  // ─── Stats ────────────────────────────────────────────────────────────────
  function renderStats() {
    $('statsAvatar').textContent = state.avatar;
    $('statsName').textContent = state.name;
    var tests = state.tests;
    var best = tests.length ? Math.max.apply(null, tests.map(function (t) { return t.wpm; })) : 0;
    var avg = tests.length ? Math.round(tests.reduce(function (s, t) { return s + t.wpm; }, 0) / tests.length) : 0;
    var avgAcc = tests.length ? Math.round(tests.reduce(function (s, t) { return s + t.accuracy; }, 0) / tests.length * 10) / 10 : 0;
    var totalWords = tests.reduce(function (s, t) { return s + t.correctWords; }, 0);
    var totalTime = tests.reduce(function (s, t) { return s + t.duration; }, 0);
    // streak
    var days = {}; tests.forEach(function (t) { days[new Date(t.date).toDateString()] = true; });
    var streak = 0;
    for (var d = 0; d < 365; d++) { var day = new Date(Date.now() - d * 86400000).toDateString(); if (days[day]) streak++; else if (d > 0) break; }
    var todayCount = tests.filter(function (t) { return new Date(t.date).toDateString() === new Date().toDateString(); }).length;
    $('statsMeta').textContent = tests.length + ' tests · ' + streak + ' day streak 🔥';

    var cards = [
      ['⚡', best, 'Best WPM', 'text-primary'],
      ['📊', avg, 'Average WPM', 'text-purple'],
      ['🎯', avgAcc + '%', 'Accuracy', 'text-success'],
      ['📈', totalWords, 'Total Words', 'text-warning'],
      ['⏱', Math.round(totalTime / 60) + 'm', 'Time Practiced', 'text-error'],
      ['🔥', streak + 'd', 'Streak', 'text-warning'],
    ];
    $('statsCards').innerHTML = cards.map(function (c) {
      return '<div class="stat-card glass"><div class="stat-label">' + c[2] + '</div><div class="stat-value ' + c[3] + '">' + c[1] + '</div><div style="font-size:18px">' + c[0] + '</div></div>';
    }).join('');

    var goal = 5, pct = Math.min(todayCount / goal * 100, 100);
    $('dgText').textContent = todayCount + ' / ' + goal + ' tests';
    $('dgFill').style.width = pct + '%';

    if (tests.length === 0) {
      $('statsEmpty').style.display = 'block';
      $('statsCharts').style.display = 'none';
    } else {
      $('statsEmpty').style.display = 'none';
      $('statsCharts').style.display = 'block';
      var trend = tests.slice(-20).map(function (t, i) { return { t: i + 1, wpm: t.wpm }; });
      drawLineChart($('speedTrend'), trend, 'wpm', '#3B82F6');
      // activity
      var actMap = {};
      for (var a = 13; a >= 0; a--) { actMap[new Date(Date.now() - a * 86400000).toDateString()] = 0; }
      tests.forEach(function (t) { var k = new Date(t.date).toDateString(); if (k in actMap) actMap[k]++; });
      var actData = Object.keys(actMap).map(function (k) { return { key: fmtDate(k), count: actMap[k] }; });
      drawBarChart($('activityChart'), actData, 'count', '#22C55E');
    }
  }

  // ─── Settings ─────────────────────────────────────────────────────────────
  function renderSettings() {
    $('settingsAvatar').textContent = state.avatar;
    $('nameInput').value = state.name;
    // avatars
    $('avatarGrid').innerHTML = AVATARS.map(function (a) {
      return '<button class="' + (state.avatar === a ? 'active' : '') + '" data-avatar="' + a + '">' + a + '</button>';
    }).join('');
    // themes
    $('themeGrid').innerHTML = THEMES.map(function (t) {
      return '<div class="theme-card ' + (state.theme === t.id ? 'active' : '') + '" data-theme="' + t.id + '"><div class="theme-preview" style="background:' + t.bg + '"></div><div class="theme-name">' + t.label + '</div></div>';
    }).join('');
    // fonts
    $('fontGrid').innerHTML = FONTS.map(function (f) {
      return '<div class="font-card ' + (state.font === f.id ? 'active' : '') + '" data-font="' + f.id + '"><div class="fn-name" style="font-family:' + f.stack + '">' + f.label + '</div><div class="fn-sample" style="font-family:' + f.stack + '">The quick brown fox 123</div></div>';
    }).join('');
    $('fontSizeLabel').textContent = state.fontSize + 'px';
    $('fontSizeRange').value = state.fontSize;
    $('toggleSound').classList.toggle('active', state.sounds);
    $('toggleAnim').classList.toggle('active', state.animations);
  }

  // ─── Event wiring ─────────────────────────────────────────────────────────
  $('typeInput').addEventListener('input', onInput);
  $('typingArea').addEventListener('click', function () { $('typeInput').focus(); });
  $('restartBtn').addEventListener('click', resetTest);
  $('retryBtn').addEventListener('click', function () { showView('test'); });
  $('saveBtn').addEventListener('click', saveResult);
  $('shareBtn').addEventListener('click', shareResult);

  $('soundToggle').addEventListener('click', function () {
    state.sounds = !state.sounds; saveState();
    $('soundToggle').textContent = state.sounds ? '🔊 Sounds on' : '🔇 Sounds off';
  });

  // config chips
  $('durationChips').addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    cfg.duration = parseInt(b.getAttribute('data-duration'));
    setActiveChip($('durationChips'), b); resetTest();
  });
  $('modeChips').addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    cfg.mode = b.getAttribute('data-mode');
    setActiveChip($('modeChips'), b); resetTest();
  });
  $('diffChips').addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    cfg.diff = b.getAttribute('data-diff');
    setActiveChip($('diffChips'), b); resetTest();
  });
  function setActiveChip(container, active) {
    container.querySelectorAll('.chip').forEach(function (c) { c.classList.remove('active'); });
    active.classList.add('active');
  }

  // leaderboard
  $('lbFilters').addEventListener('click', function (e) {
    var b = e.target.closest('.chip'); if (!b) return;
    lbFilter = b.getAttribute('data-lb');
    setActiveChip($('lbFilters'), b); renderLeaderboard();
  });
  $('lbSearch').addEventListener('input', function (e) { lbQuery = e.target.value; renderLeaderboard(); });

  // settings
  $('nameInput').addEventListener('input', function (e) { state.name = e.target.value || 'Guest'; saveState(); updateNav(); });
  $('avatarGrid').addEventListener('click', function (e) {
    var b = e.target.closest('[data-avatar]'); if (!b) return;
    state.avatar = b.getAttribute('data-avatar'); saveState();
    $('settingsAvatar').textContent = state.avatar; updateNav();
    $('avatarGrid').querySelectorAll('button').forEach(function (x) { x.classList.remove('active'); });
    b.classList.add('active');
  });
  $('themeGrid').addEventListener('click', function (e) {
    var c = e.target.closest('[data-theme]'); if (!c) return;
    state.theme = c.getAttribute('data-theme'); saveState(); applyTheme();
    $('themeGrid').querySelectorAll('.theme-card').forEach(function (x) { x.classList.remove('active'); });
    c.classList.add('active');
  });
  $('fontGrid').addEventListener('click', function (e) {
    var c = e.target.closest('[data-font]'); if (!c) return;
    state.font = c.getAttribute('data-font'); saveState(); applyFont();
    $('fontGrid').querySelectorAll('.font-card').forEach(function (x) { x.classList.remove('active'); });
    c.classList.add('active');
  });
  $('fontSizeRange').addEventListener('input', function (e) {
    state.fontSize = parseInt(e.target.value); saveState(); applyFont();
    $('fontSizeLabel').textContent = state.fontSize + 'px';
  });
  $('toggleSound').addEventListener('click', function () { state.sounds = !state.sounds; saveState(); $('toggleSound').classList.toggle('active', state.sounds); });
  $('toggleAnim').addEventListener('click', function () { state.animations = !state.animations; saveState(); $('toggleAnim').classList.toggle('active', state.animations); });

  // ─── Init ─────────────────────────────────────────────────────────────────
  applyTheme(); applyFont(); updateNav();
  $('soundToggle').textContent = state.sounds ? '🔊 Sounds on' : '🔇 Sounds off';
  resetTest();
})();
