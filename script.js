/* ═══════════════════════════════════════════════════════
   FOCUSFORGE — script.js
   All app logic: timer, goals, heatmap, analytics, etc.
   Author: FocusForge Project
═══════════════════════════════════════════════════════ */

'use strict';

/* ─────────────────────────────────────────
   1. CONSTANTS & DATA
───────────────────────────────────────── */

const QUOTES = [
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Success is not final, failure is not fatal — it is the courage to continue that counts.", author: "Winston Churchill" },
  { text: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
  { text: "Hard work beats talent when talent doesn't work hard.", author: "Tim Notke" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela" },
  { text: "An investment in knowledge pays the best interest.", author: "Benjamin Franklin" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Anonymous" },
  { text: "Great things never come from comfort zones.", author: "Neil Strauss" },
  { text: "Study hard, for the well is deep and our brains are shallow.", author: "Richard Baxter" },
  { text: "Do something today that your future self will thank you for.", author: "Sean Patrick Flanery" },
  { text: "Strive for progress, not perfection.", author: "Anonymous" },
];

const TIPS = [
  "Use the Pomodoro Technique: 25 min focus, 5 min break. Your brain thrives on rhythm.",
  "Study in a distraction-free environment — even closing one browser tab helps.",
  "Spaced repetition beats cramming every time. Review yesterday's notes today.",
  "Drink water! Dehydration cuts cognitive performance by up to 15%.",
  "The best time to study is whenever you can stay consistently focused.",
  "Teaching someone else what you learned is the fastest way to master it.",
  "Write your goals on paper — you're 42% more likely to achieve written goals.",
  "Take a 5-min walk between study sessions. Movement improves memory consolidation.",
  "Break big tasks into micro-tasks. 'Study Chapter 3' → 'Read pages 45–60'.",
  "Use active recall (self-testing) instead of passive re-reading.",
  "Sleep is not optional — memory solidifies during deep sleep stages.",
  "Start with the hardest subject when your willpower is highest.",
  "Silence your phone, not just set it to vibrate — notifications hijack focus for 23 min.",
  "Review new material within 24 hours to boost retention by 80%.",
  "Celebrate small wins. Your brain rewards momentum.",
];

const GREETINGS = [
  "Welcome back, Scholar! 👋",
  "Ready to level up today? 🚀",
  "Your future self is watching. 🔭",
  "Let's forge some focus! ⚡",
  "Knowledge is power — charge up! 💡",
  "Great students ship great effort. 📚",
  "Another day, another breakthrough. 🌟",
];

const NOTIFICATIONS = [
  "🔥 You're on fire! Keep this streak alive.",
  "💪 Small steps lead to big victories.",
  "⏱ Time to get back to focus mode!",
  "🏆 You're closer to your goal than yesterday.",
  "🌟 Consistency is your superpower.",
  "🧠 Your brain is getting stronger with every session.",
  "✅ One more goal completed — legend!",
];

const ACHIEVEMENTS_DEF = [
  { id: 'first_session', icon: '🚀', name: 'First Launch',     desc: 'Complete your first Pomodoro session', condition: s => s.totalSessions >= 1 },
  { id: 'five_sessions', icon: '🔥', name: 'On Fire',          desc: 'Complete 5 Pomodoro sessions',          condition: s => s.totalSessions >= 5 },
  { id: 'ten_sessions',  icon: '💎', name: 'Diamond Focus',    desc: 'Complete 10 Pomodoro sessions',         condition: s => s.totalSessions >= 10 },
  { id: 'streak_3',      icon: '📅', name: '3-Day Streak',     desc: 'Study 3 days in a row',                 condition: s => s.streak >= 3 },
  { id: 'streak_7',      icon: '🏅', name: 'Weekly Warrior',   desc: 'Study 7 days in a row',                 condition: s => s.streak >= 7 },
  { id: 'goals_5',       icon: '🎯', name: 'Goal Crusher',     desc: 'Complete 5 goals total',                condition: s => s.totalGoalsDone >= 5 },
  { id: 'goals_20',      icon: '🏆', name: 'Goal Master',      desc: 'Complete 20 goals total',               condition: s => s.totalGoalsDone >= 20 },
  { id: 'minutes_60',    icon: '⏱',  name: 'Hour Scholar',     desc: 'Study 60 minutes in one day',           condition: s => s.todayMinutes >= 60 },
  { id: 'minutes_120',   icon: '🎓', name: 'Deep Learner',     desc: 'Study 120 minutes in one day',          condition: s => s.todayMinutes >= 120 },
  { id: 'subjects_3',    icon: '📚', name: 'Polymath',         desc: 'Track 3 or more subjects',              condition: s => s.subjectCount >= 3 },
];

const ACCENT_THEMES = [
  { name: 'Purple',  accent: '#6c63ff', accent2: '#00d4ff' },
  { name: 'Pink',    accent: '#ff3cac', accent2: '#ff9a3c' },
  { name: 'Cyan',    accent: '#00d4ff', accent2: '#39ff14' },
  { name: 'Green',   accent: '#39ff14', accent2: '#00d4ff' },
  { name: 'Orange',  accent: '#ff6b35', accent2: '#ffd23f' },
  { name: 'Red',     accent: '#ff4040', accent2: '#ff9a3c' },
];

/* ─────────────────────────────────────────
   2. STATE (loaded from / saved to localStorage)
───────────────────────────────────────── */

function defaultState() {
  return {
    streak: 0,
    lastStudyDate: null,
    totalSessions: 0,
    totalGoalsDone: 0,
    todayMinutes: 0,
    sessionHistory: [],
    goals: [],
    subjects: [],
    heatmap: {},       // { 'YYYY-MM-DD': minutes }
    weekly: {},        // { 'YYYY-MM-DD': minutes }
    unlockedBadges: [],
    notificationsOn: true,
    theme: 'dark',
    accentIndex: 0,
    pomoDurations: { focus: 25, short: 5, long: 15 },
    todayDate: todayKey(),
  };
}

function todayKey() {
  return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'
}

let state = {};

function loadState() {
  try {
    const raw = localStorage.getItem('focusforge_state');
    state = raw ? { ...defaultState(), ...JSON.parse(raw) } : defaultState();
  } catch {
    state = defaultState();
  }
  // Reset daily minutes if new day
  if (state.todayDate !== todayKey()) {
    state.todayMinutes = 0;
    state.todayDate = todayKey();
  }
}

function saveState() {
  try {
    localStorage.setItem('focusforge_state', JSON.stringify(state));
  } catch (e) {
    console.warn('localStorage save failed:', e);
  }
}

/* ─────────────────────────────────────────
   3. PARTICLE BACKGROUND
───────────────────────────────────────── */

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animationId;

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.5,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    alpha: Math.random() * 0.5 + 0.1,
  };
}

function initParticles() {
  particles = Array.from({ length: 120 }, createParticle);
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Get current accent color
  const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#6c63ff';

  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;

    // Wrap around edges
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width) p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = accent + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
    ctx.fill();
  }

  // Draw lines between nearby particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = accent + Math.floor((1 - dist / 100) * 25).toString(16).padStart(2, '0');
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }

  animationId = requestAnimationFrame(animateParticles);
}

/* ─────────────────────────────────────────
   4. INTRO SCREEN
───────────────────────────────────────── */

const INTRO_TEXT = 'FocusForge';

function runIntro() {
  const el = document.getElementById('typingText');
  el.classList.add('typing-cursor');
  let i = 0;

  function typeNext() {
    if (i <= INTRO_TEXT.length) {
      el.textContent = INTRO_TEXT.slice(0, i);
      i++;
      setTimeout(typeNext, 110);
    } else {
      // After 1s more, hide intro and show app
      setTimeout(() => {
        document.getElementById('introScreen').style.opacity = '0';
        document.getElementById('introScreen').style.transition = 'opacity 0.5s';
        setTimeout(() => {
          document.getElementById('introScreen').style.display = 'none';
          document.getElementById('app').classList.remove('hidden');
          onAppReady();
        }, 500);
      }, 1000);
    }
  }

  typeNext();
}

/* ─────────────────────────────────────────
   5. REAL-TIME CLOCK
───────────────────────────────────────── */

function updateClock() {
  const now = new Date();
  const h  = String(now.getHours()).padStart(2, '0');
  const m  = String(now.getMinutes()).padStart(2, '0');
  const s  = String(now.getSeconds()).padStart(2, '0');
  document.getElementById('realTimeClock').textContent = `${h}:${m}:${s}`;
  document.getElementById('realTimeDate').textContent  =
    now.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

/* ─────────────────────────────────────────
   6. GREETING (AI-style)
───────────────────────────────────────── */

function updateGreeting() {
  const hour = new Date().getHours();
  let timeGreet = 'Good morning';
  if (hour >= 12 && hour < 17) timeGreet = 'Good afternoon';
  else if (hour >= 17) timeGreet = 'Good evening';

  const random = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
  document.getElementById('greetingText').textContent = `${timeGreet}! ${random}`;
}

/* ─────────────────────────────────────────
   7. MOTIVATION QUOTE
───────────────────────────────────────── */

let quoteIndex = 0;

function loadNewQuote() {
  quoteIndex = (quoteIndex + 1) % QUOTES.length;
  const q = QUOTES[quoteIndex];
  const el = document.getElementById('motivationQuote');
  const au = document.getElementById('quoteAuthor');
  el.style.opacity = '0';
  setTimeout(() => {
    el.textContent = `"${q.text}"`;
    au.textContent = `— ${q.author}`;
    el.style.transition = 'opacity 0.5s';
    el.style.opacity = '1';
  }, 300);
}

/* ─────────────────────────────────────────
   8. PRODUCTIVITY TIP
───────────────────────────────────────── */

let tipIndex = 0;

function loadNewTip() {
  tipIndex = (tipIndex + 1) % TIPS.length;
  document.getElementById('productivityTip').textContent = TIPS[tipIndex];
}

/* ─────────────────────────────────────────
   9. POMODORO TIMER
───────────────────────────────────────── */

let pomoMode    = 'focus'; // 'focus' | 'short' | 'long'
let pomoRunning = false;
let pomoInterval = null;
let pomoSeconds = 0;
let pomoTotal   = 0;
let pomoCycle   = 0;   // completed focus cycles (4 = long break)
let sessionsDoneToday = 0;

function getPomoModeName(mode) {
  if (mode === 'focus') return 'FOCUS TIME';
  if (mode === 'short') return 'SHORT BREAK';
  return 'LONG BREAK';
}

function getRingColor(mode) {
  if (mode === 'focus') return 'var(--accent)';
  if (mode === 'short') return 'var(--accent3)';
  return 'var(--accent2)';
}

function setPomoMode(mode, auto = false) {
  pomoMode = mode;
  const dur = state.pomoDurations;
  const mins = mode === 'focus' ? dur.focus : mode === 'short' ? dur.short : dur.long;
  pomoSeconds = mins * 60;
  pomoTotal   = mins * 60;

  if (!auto) { clearInterval(pomoInterval); pomoRunning = false; }

  document.getElementById('startBtn').textContent = '▶';
  updateTimerDisplay();

  // Tab highlights
  document.getElementById('tabFocus').classList.toggle('active', mode === 'focus');
  document.getElementById('tabShort').classList.toggle('active', mode === 'short');
  document.getElementById('tabLong').classList.toggle('active', mode === 'long');
  document.getElementById('timerMode').textContent = getPomoModeName(mode);

  // Ring color
  document.getElementById('ringFill').style.stroke = getRingColor(mode);
  // Focus overlay ring color
  if (document.getElementById('focusOverlay').style.display !== 'none') {
    document.getElementById('focusTimerDisplay').textContent = formatTime(pomoSeconds);
  }
}

function updateTimerDisplay() {
  const t = formatTime(pomoSeconds);
  document.getElementById('timerDisplay').textContent     = t;
  document.getElementById('focusTimerDisplay').textContent = t;

  // Ring animation: circumference = 2π × 96 ≈ 603
  const circ = 603;
  const offset = circ - (circ * (pomoSeconds / pomoTotal));
  document.getElementById('ringFill').style.strokeDashoffset = offset;
}

function formatTime(sec) {
  const m = String(Math.floor(sec / 60)).padStart(2, '0');
  const s = String(sec % 60).padStart(2, '0');
  return `${m}:${s}`;
}

function toggleTimer() {
  if (pomoRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  pomoRunning = true;
  document.getElementById('startBtn').textContent = '⏸';
  pomoInterval = setInterval(tick, 1000);
}

function pauseTimer() {
  pomoRunning = false;
  clearInterval(pomoInterval);
  document.getElementById('startBtn').textContent = '▶';
}

function resetTimer() {
  pauseTimer();
  setPomoMode(pomoMode);
}

function skipTimer() {
  pauseTimer();
  onTimerEnd();
}

function tick() {
  if (pomoSeconds > 0) {
    pomoSeconds--;
    // If focus mode, add to today's minutes every 60 ticks
    if (pomoMode === 'focus' && pomoSeconds % 60 === 0 && pomoSeconds < pomoTotal) {
      state.todayMinutes++;
      addHeatmapMinutes(1);
      addWeeklyMinutes(1);
      updateDashboardStats();
      saveState();
    }
    updateTimerDisplay();
  } else {
    onTimerEnd();
  }
}

function onTimerEnd() {
  clearInterval(pomoInterval);
  pomoRunning = false;
  document.getElementById('startBtn').textContent = '▶';

  if (pomoMode === 'focus') {
    // A focus session completed
    pomoCycle++;
    sessionsDoneToday++;
    state.totalSessions++;
    state.todayMinutes += state.pomoDurations.focus; // rough credit
    addHeatmapMinutes(state.pomoDurations.focus);
    addWeeklyMinutes(state.pomoDurations.focus);

    addSessionHistory('focus');
    updateSessionDots();
    updateDashboardStats();
    updateStreakOnSession();
    checkAchievements();
    saveState();

    showNotification('🎉 Focus session complete! Take a break.');

    // Auto-switch to break
    if (pomoCycle % 4 === 0) {
      setPomoMode('long', true);
    } else {
      setPomoMode('short', true);
    }
  } else {
    // Break ended — switch back to focus
    showNotification('⚡ Break over! Time to focus again.');
    setPomoMode('focus', true);
  }

  document.getElementById('pomoCount').textContent = sessionsDoneToday;
}

function updateDurations() {
  state.pomoDurations.focus = parseInt(document.getElementById('editFocus').value) || 25;
  state.pomoDurations.short = parseInt(document.getElementById('editShort').value) || 5;
  state.pomoDurations.long  = parseInt(document.getElementById('editLong').value) || 15;
  saveState();
  setPomoMode(pomoMode);
}

function updateSessionDots() {
  const dots = document.getElementById('sessionDots');
  dots.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    const d = document.createElement('div');
    d.className = 'session-dot' + (i < (pomoCycle % 4) || (pomoCycle % 4 === 0 && pomoCycle > 0 && i === 0 ? false : i < pomoCycle % 4) ? ' done' : '');
    // Simpler: mark done for current cycle index
    if (i < (pomoCycle % 4 === 0 && pomoCycle > 0 ? 4 : pomoCycle % 4)) d.classList.add('done');
    dots.appendChild(d);
  }
}

function addSessionHistory(type) {
  const now = new Date();
  const entry = {
    type,
    time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    duration: type === 'focus' ? state.pomoDurations.focus : (type === 'short' ? state.pomoDurations.short : state.pomoDurations.long),
  };
  state.sessionHistory.unshift(entry);
  if (state.sessionHistory.length > 30) state.sessionHistory.pop();
  renderSessionHistory();
}

function renderSessionHistory() {
  const cont = document.getElementById('sessionHistory');
  if (!state.sessionHistory.length) {
    cont.innerHTML = '<div class="empty-state">No sessions yet. Start focusing! 🚀</div>';
    return;
  }
  cont.innerHTML = state.sessionHistory.map(s => `
    <div class="session-entry">
      <span class="ses-icon">${s.type === 'focus' ? '⏱' : '☕'}</span>
      <span class="ses-type">${s.type === 'focus' ? 'Focus' : s.type === 'short' ? 'Short Break' : 'Long Break'}</span>
      <span class="ses-time">${s.duration} min · ${s.time}</span>
    </div>
  `).join('');
}

function clearSessionHistory() {
  state.sessionHistory = [];
  saveState();
  renderSessionHistory();
}

/* ─────────────────────────────────────────
   10. STREAK TRACKER
───────────────────────────────────────── */

function updateStreakOnSession() {
  const today = todayKey();
  const last  = state.lastStudyDate;

  if (last === today) return; // Already counted today

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yKey = yesterday.toISOString().slice(0, 10);

  if (last === yKey) {
    state.streak++;
  } else if (last !== today) {
    state.streak = 1;
  }

  state.lastStudyDate = today;
  updateStreakDisplay();
}

function updateStreakDisplay() {
  document.getElementById('streakCount').textContent = state.streak;
  document.getElementById('statStreak2').textContent = state.streak;
  const pct = Math.min(state.streak / 30 * 100, 100);
  document.getElementById('statStreakBar').style.width = pct + '%';
}

/* ─────────────────────────────────────────
   11. HEATMAP & WEEKLY
───────────────────────────────────────── */

function addHeatmapMinutes(mins) {
  const k = todayKey();
  state.heatmap[k] = (state.heatmap[k] || 0) + mins;
}

function addWeeklyMinutes(mins) {
  const k = todayKey();
  state.weekly[k] = (state.weekly[k] || 0) + mins;
}

function renderHeatmap() {
  const grid = document.getElementById('heatmapGrid');
  grid.innerHTML = '';

  // Build 52 weeks × 7 days grid
  const end   = new Date();
  const start = new Date(end);
  start.setDate(start.getDate() - 364);

  // Align to Sunday
  start.setDate(start.getDate() - start.getDay());

  let cur = new Date(start);
  while (cur <= end) {
    const week = document.createElement('div');
    week.className = 'heatmap-week';

    for (let d = 0; d < 7; d++) {
      const key  = cur.toISOString().slice(0, 10);
      const mins = state.heatmap[key] || 0;
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';

      if (mins > 0)   cell.classList.add('l1');
      if (mins >= 30) cell.classList.add('l2');
      if (mins >= 60) cell.classList.add('l3');
      if (mins >= 90) cell.classList.add('l4');

      cell.title = `${key}: ${mins} min`;
      week.appendChild(cell);
      cur.setDate(cur.getDate() + 1);
    }

    grid.appendChild(week);
  }
}

/* ─────────────────────────────────────────
   12. CALENDAR WIDGET
───────────────────────────────────────── */

let calYear  = new Date().getFullYear();
let calMonth = new Date().getMonth();

function renderCalendar() {
  const widget = document.getElementById('calendarWidget');
  const today  = new Date();

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  let html = `
    <div class="cal-header">
      <button onclick="calNav(-1)">‹</button>
      <span>${monthNames[calMonth]} ${calYear}</span>
      <button onclick="calNav(1)">›</button>
    </div>
    <div class="cal-grid">
      <div class="cal-day-name">Su</div><div class="cal-day-name">Mo</div>
      <div class="cal-day-name">Tu</div><div class="cal-day-name">We</div>
      <div class="cal-day-name">Th</div><div class="cal-day-name">Fr</div>
      <div class="cal-day-name">Sa</div>
  `;

  // Empty cells before month start
  for (let i = 0; i < firstDay; i++) {
    html += '<div class="cal-day other-month"></div>';
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const isToday = (day === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear());
    const dateKey = `${calYear}-${String(calMonth+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    const hasStudy = state.heatmap[dateKey] > 0;
    let cls = 'cal-day';
    if (isToday)  cls += ' today';
    if (hasStudy && !isToday) cls += ' has-study';
    html += `<div class="${cls}">${day}</div>`;
  }

  html += '</div>';
  widget.innerHTML = html;
}

function calNav(dir) {
  calMonth += dir;
  if (calMonth > 11) { calMonth = 0; calYear++; }
  if (calMonth < 0)  { calMonth = 11; calYear--; }
  renderCalendar();
}

/* ─────────────────────────────────────────
   13. DASHBOARD STATS
───────────────────────────────────────── */

function updateDashboardStats() {
  // Minutes today
  document.getElementById('statTotalMinutes').textContent = state.todayMinutes;
  document.getElementById('statMinBar').style.width = Math.min(state.todayMinutes / 180 * 100, 100) + '%';

  // Sessions
  document.getElementById('statSessions').textContent = state.totalSessions;
  document.getElementById('statSesBar').style.width = Math.min(state.totalSessions / 20 * 100, 100) + '%';

  // Goals %
  const goals  = state.goals || [];
  const done   = goals.filter(g => g.done).length;
  const total  = goals.length;
  const pct    = total ? Math.round(done / total * 100) : 0;
  document.getElementById('statGoalsCompPct').textContent = pct + '%';
  document.getElementById('statGoalBar').style.width = pct + '%';

  // Goal progress card
  document.getElementById('goalProgressPct').textContent = pct + '%';
  document.getElementById('goalProgressBar').style.width = pct + '%';

  // Streak
  updateStreakDisplay();
}

/* ─────────────────────────────────────────
   14. GOALS
───────────────────────────────────────── */

function addGoal() {
  const input    = document.getElementById('goalInput');
  const priority = document.getElementById('goalPriority').value;
  const text     = input.value.trim();
  if (!text) return;

  const goal = {
    id:       Date.now().toString(),
    text,
    priority,
    done: false,
    order: state.goals.length,
  };

  state.goals.push(goal);
  input.value = '';
  saveState();
  renderGoals();
  updateDashboardStats();
}

function toggleGoal(id) {
  const g = state.goals.find(g => g.id === id);
  if (!g) return;
  g.done = !g.done;
  if (g.done) {
    state.totalGoalsDone++;
    showNotification(NOTIFICATIONS[Math.floor(Math.random() * NOTIFICATIONS.length)]);
  }
  saveState();
  renderGoals();
  updateDashboardStats();
  checkAchievements();
}

function deleteGoal(id) {
  state.goals = state.goals.filter(g => g.id !== id);
  saveState();
  renderGoals();
  updateDashboardStats();
}

function editGoal(id) {
  const g   = state.goals.find(g => g.id === id);
  if (!g) return;
  const newText = prompt('Edit goal:', g.text);
  if (newText !== null && newText.trim()) {
    g.text = newText.trim();
    saveState();
    renderGoals();
  }
}

function renderGoals() {
  const cont    = document.getElementById('goalsContainer');
  const search  = document.getElementById('searchGoals')?.value?.toLowerCase() || '';
  let goals = state.goals.filter(g => !search || g.text.toLowerCase().includes(search));

  if (!goals.length) {
    cont.innerHTML = '<div class="empty-state">No goals found. Add one above! 🎯</div>';
    return;
  }

  cont.innerHTML = goals.map(g => `
    <div class="goal-item" draggable="true" data-id="${g.id}"
         ondragstart="dragStart(event)" ondragover="dragOver(event)" ondrop="drop(event)">
      <div class="goal-check ${g.done ? 'done' : ''}" onclick="toggleGoal('${g.id}')"></div>
      <span class="goal-text ${g.done ? 'done' : ''}">${escapeHtml(g.text)}</span>
      <span class="goal-priority priority-${g.priority}">${g.priority.charAt(0).toUpperCase() + g.priority.slice(1)}</span>
      <div class="goal-actions">
        <button class="goal-btn edit-btn" onclick="editGoal('${g.id}')" title="Edit">✏</button>
        <button class="goal-btn" onclick="deleteGoal('${g.id}')" title="Delete">🗑</button>
      </div>
    </div>
  `).join('');
}

/* ─────────────────────────────────────────
   15. DRAG-AND-DROP GOALS
───────────────────────────────────────── */

let dragId = null;

function dragStart(e) {
  dragId = e.currentTarget.dataset.id;
  e.currentTarget.classList.add('dragging');
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  e.preventDefault();
  const targetId = e.currentTarget.dataset.id;
  if (!dragId || dragId === targetId) return;

  const fromIdx = state.goals.findIndex(g => g.id === dragId);
  const toIdx   = state.goals.findIndex(g => g.id === targetId);
  if (fromIdx === -1 || toIdx === -1) return;

  // Swap in array
  const [moved] = state.goals.splice(fromIdx, 1);
  state.goals.splice(toIdx, 0, moved);
  dragId = null;
  saveState();
  renderGoals();
}

/* ─────────────────────────────────────────
   16. SUBJECTS
───────────────────────────────────────── */

function addSubject() {
  const name  = document.getElementById('subjectInput').value.trim();
  const color = document.getElementById('subjectColor').value;
  if (!name) return;

  const sub = {
    id:       Date.now().toString(),
    name,
    color,
    progress: 0,
  };

  state.subjects.push(sub);
  document.getElementById('subjectInput').value = '';
  saveState();
  renderSubjects();
  checkAchievements();
}

function updateSubjectProgress(id, val) {
  const sub = state.subjects.find(s => s.id === id);
  if (!sub) return;
  sub.progress = Math.min(Math.max(parseInt(val) || 0, 0), 100);
  saveState();
  renderSubjects();
}

function deleteSubject(id) {
  state.subjects = state.subjects.filter(s => s.id !== id);
  saveState();
  renderSubjects();
}

function renderSubjects() {
  const cont = document.getElementById('subjectsContainer');
  if (!state.subjects.length) {
    cont.innerHTML = '<div class="empty-state">No subjects yet. Add one above! 📚</div>';
    return;
  }

  cont.innerHTML = state.subjects.map(s => `
    <div class="subject-card">
      <div class="subject-header">
        <div class="subject-dot" style="background:${s.color};box-shadow:0 0 8px ${s.color}"></div>
        <span class="subject-name">${escapeHtml(s.name)}</span>
        <button class="goal-btn" onclick="deleteSubject('${s.id}')" title="Delete">🗑</button>
      </div>
      <div class="subject-pct" style="color:${s.color}">${s.progress}%</div>
      <div class="subject-progress">
        <div class="subject-progress-fill" style="width:${s.progress}%;background:${s.color};box-shadow:0 0 8px ${s.color}60"></div>
      </div>
      <div class="subject-actions">
        <input type="number" class="subject-input" value="${s.progress}" min="0" max="100"
               onchange="updateSubjectProgress('${s.id}', this.value)" placeholder="0-100"/>
        <span style="font-size:0.78rem;color:var(--text-muted)">%</span>
      </div>
    </div>
  `).join('');
}

/* ─────────────────────────────────────────
   17. WEEKLY ANALYTICS BAR CHART
───────────────────────────────────────── */

function renderWeeklyChart() {
  const cont = document.getElementById('weeklyBarChart');
  cont.innerHTML = '';

  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const today = new Date();

  let maxMins = 1; // avoid division by zero

  // Build last 7 days data
  const data = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const key  = d.toISOString().slice(0, 10);
    const mins = state.weekly[key] || 0;
    if (mins > maxMins) maxMins = mins;
    data.push({ label: days[d.getDay()], mins, key });
  }

  const MAX_H = 150; // px

  for (const d of data) {
    const pct = Math.round(d.mins / maxMins * MAX_H);
    const col = document.createElement('div');
    col.className = 'bar-col';
    col.innerHTML = `
      <div class="bar-value">${d.mins}m</div>
      <div class="bar-fill" style="height:${pct}px" title="${d.label}: ${d.mins} min"></div>
      <div class="bar-label">${d.label}</div>
    `;
    cont.appendChild(col);
  }
}

function renderAllTimeStats() {
  const el = document.getElementById('allTimeStats');
  const totalMin = Object.values(state.weekly).reduce((a, b) => a + b, 0);
  const heatMin  = Object.values(state.heatmap).reduce((a, b) => a + b, 0);
  el.innerHTML = `
    <li><span>🔥 Longest Streak</span>     <strong>${state.streak} days</strong></li>
    <li><span>⏱ Minutes Today</span>       <strong>${state.todayMinutes} min</strong></li>
    <li><span>📊 Total Sessions</span>      <strong>${state.totalSessions}</strong></li>
    <li><span>✅ Goals Completed</span>     <strong>${state.totalGoalsDone}</strong></li>
    <li><span>📚 Subjects Tracked</span>    <strong>${state.subjects.length}</strong></li>
    <li><span>🏆 Badges Unlocked</span>     <strong>${state.unlockedBadges.length}/${ACHIEVEMENTS_DEF.length}</strong></li>
    <li><span>📅 All-time Study Min</span>  <strong>${heatMin} min</strong></li>
  `;
}

/* ─────────────────────────────────────────
   18. ACHIEVEMENTS / BADGES
───────────────────────────────────────── */

function getStatsForAchievements() {
  return {
    totalSessions:  state.totalSessions,
    streak:         state.streak,
    totalGoalsDone: state.totalGoalsDone,
    todayMinutes:   state.todayMinutes,
    subjectCount:   state.subjects.length,
  };
}

function checkAchievements() {
  const stats = getStatsForAchievements();
  for (const ach of ACHIEVEMENTS_DEF) {
    if (!state.unlockedBadges.includes(ach.id) && ach.condition(stats)) {
      state.unlockedBadges.push(ach.id);
      saveState();
      showAchievementPopup(ach);
    }
  }
  renderBadges();
}

function showAchievementPopup(ach) {
  const popup = document.getElementById('achievementPopup');
  document.getElementById('achIcon').textContent = ach.icon;
  document.getElementById('achName').textContent = ach.name;
  popup.classList.remove('hidden');
  setTimeout(() => popup.classList.add('hidden'), 3000);
}

function renderBadges() {
  const grid = document.getElementById('badgesGrid');
  grid.innerHTML = ACHIEVEMENTS_DEF.map(a => {
    const unlocked = state.unlockedBadges.includes(a.id);
    return `
      <div class="badge-card ${unlocked ? 'unlocked' : 'locked'}">
        <div class="badge-icon">${a.icon}</div>
        <div class="badge-name">${a.name}</div>
        <div class="badge-desc">${a.desc}</div>
        ${unlocked ? '<div style="color:var(--accent3);font-size:0.72rem;margin-top:0.4rem;font-weight:700;">✓ UNLOCKED</div>' : ''}
      </div>
    `;
  }).join('');
}

/* ─────────────────────────────────────────
   19. NOTIFICATIONS
───────────────────────────────────────── */

function showNotification(msg) {
  if (!state.notificationsOn) return;
  const toast = document.getElementById('notificationToast');
  document.getElementById('notifText').textContent = msg;
  toast.classList.remove('hidden');
  clearTimeout(showNotification._timer);
  showNotification._timer = setTimeout(() => toast.classList.add('hidden'), 4500);
}

function closeNotif() {
  document.getElementById('notificationToast').classList.add('hidden');
}

function toggleNotifications() {
  state.notificationsOn = !state.notificationsOn;
  const btn = document.getElementById('notifsToggle');
  btn.textContent = state.notificationsOn ? 'ON' : 'OFF';
  btn.classList.toggle('off', !state.notificationsOn);
  saveState();
}

/* ─────────────────────────────────────────
   20. THEME TOGGLE
───────────────────────────────────────── */

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const newTheme = isDark ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  state.theme = newTheme;
  saveState();

  // Update button labels
  const btn1 = document.querySelector('.sidebar-footer .icon-btn');
  if (btn1) btn1.textContent = newTheme === 'dark' ? '🌙' : '☀️';
  const btn2 = document.getElementById('themeToggleBtn');
  if (btn2) btn2.textContent = newTheme === 'dark' ? 'Dark' : 'Light';
}

/* ─────────────────────────────────────────
   21. FOCUS MODE
───────────────────────────────────────── */

let focusActive = false;

function toggleFocusMode() {
  focusActive = !focusActive;
  const overlay = document.getElementById('focusOverlay');
  overlay.classList.toggle('hidden', !focusActive);
  if (focusActive) updateTimerDisplay();
}

/* ─────────────────────────────────────────
   22. FULLSCREEN
───────────────────────────────────────── */

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

/* ─────────────────────────────────────────
   23. COLOR THEMES / SWATCHES
───────────────────────────────────────── */

function renderSwatches() {
  const cont = document.getElementById('colorSwatches');
  cont.innerHTML = ACCENT_THEMES.map((t, i) => `
    <div class="swatch ${state.accentIndex === i ? 'active' : ''}"
         style="background:${t.accent}"
         onclick="applyAccent(${i})"
         title="${t.name}"></div>
  `).join('');
}

function applyAccent(idx) {
  state.accentIndex = idx;
  const t = ACCENT_THEMES[idx];
  document.documentElement.style.setProperty('--accent',  t.accent);
  document.documentElement.style.setProperty('--accent2', t.accent2);
  saveState();
  renderSwatches();
}

/* ─────────────────────────────────────────
   24. AMBIENT SOUNDS (Web Audio API)
───────────────────────────────────────── */

let audioCtx  = null;
let noiseNode = null;
let gainNode  = null;
let ambientActive = false;

function getAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function playAmbient(type) {
  stopAmbient();
  const ac = getAudioCtx();
  gainNode = ac.createGain();
  gainNode.gain.setValueAtTime(0.08, ac.currentTime);
  gainNode.connect(ac.destination);

  // Create white/pink noise buffer
  const bufSize = ac.sampleRate * 2;
  const buf = ac.createBuffer(1, bufSize, ac.sampleRate);
  const data = buf.getChannelData(0);

  if (type === 'rain') {
    // White noise with low-pass for rain
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    noiseNode = ac.createBufferSource();
    noiseNode.buffer = buf;
    noiseNode.loop = true;
    const filter = ac.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ac.currentTime);
    noiseNode.connect(filter);
    filter.connect(gainNode);
  } else if (type === 'forest') {
    // Pink noise approximation
    for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * 0.6;
    noiseNode = ac.createBufferSource();
    noiseNode.buffer = buf;
    noiseNode.loop = true;
    const filter = ac.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, ac.currentTime);
    filter.Q.setValueAtTime(0.5, ac.currentTime);
    noiseNode.connect(filter);
    filter.connect(gainNode);
  } else {
    // Café: white noise + rumble
    for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
    noiseNode = ac.createBufferSource();
    noiseNode.buffer = buf;
    noiseNode.loop = true;
    noiseNode.connect(gainNode);
  }

  noiseNode.start();
  ambientActive = true;

  // Highlight active button
  document.querySelectorAll('.ambient-btn').forEach(b => b.classList.remove('active'));
  const map = { rain: 0, forest: 1, cafe: 2 };
  const btns = document.querySelectorAll('.ambient-btn');
  if (btns[map[type]]) btns[map[type]].classList.add('active');

  const toggle = document.getElementById('ambientToggle');
  if (toggle) { toggle.textContent = 'ON'; toggle.classList.remove('off'); }
}

function stopAmbient() {
  if (noiseNode) { try { noiseNode.stop(); } catch {} noiseNode = null; }
  ambientActive = false;
  document.querySelectorAll('.ambient-btn').forEach(b => b.classList.remove('active'));
  const toggle = document.getElementById('ambientToggle');
  if (toggle) { toggle.textContent = 'OFF'; toggle.classList.add('off'); }
}

function toggleAmbient() {
  ambientActive ? stopAmbient() : playAmbient('rain');
}

/* ─────────────────────────────────────────
   25. NAVIGATION
───────────────────────────────────────── */

function switchSection(name, el) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  document.getElementById('section-' + name).classList.add('active');
  if (el) el.classList.add('active');

  // Refresh data-driven sections
  if (name === 'analytics')    { renderWeeklyChart(); renderAllTimeStats(); }
  if (name === 'achievements') { checkAchievements(); renderBadges(); }
  if (name === 'settings')     { renderSwatches(); }
  if (name === 'dashboard')    { renderHeatmap(); renderCalendar(); }

  // Close mobile sidebar
  if (window.innerWidth <= 700) closeSidebar();
}

/* ─────────────────────────────────────────
   26. SIDEBAR (mobile)
───────────────────────────────────────── */

function toggleSidebar() {
  document.getElementById('sidebar').classList.toggle('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
}

/* ─────────────────────────────────────────
   27. EXPORT STATS
───────────────────────────────────────── */

function exportStats() {
  const exportData = {
    exported: new Date().toISOString(),
    totalSessions:  state.totalSessions,
    totalGoalsDone: state.totalGoalsDone,
    streak:         state.streak,
    todayMinutes:   state.todayMinutes,
    goals:          state.goals,
    subjects:       state.subjects,
    sessionHistory: state.sessionHistory,
    heatmap:        state.heatmap,
    weekly:         state.weekly,
    unlockedBadges: state.unlockedBadges,
  };

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `focusforge_stats_${todayKey()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showNotification('📤 Stats exported successfully!');
}

/* ─────────────────────────────────────────
   28. RESET ALL DATA
───────────────────────────────────────── */

function resetAllData() {
  if (!confirm('Are you sure? This will erase ALL your FocusForge data permanently.')) return;
  localStorage.removeItem('focusforge_state');
  location.reload();
}

/* ─────────────────────────────────────────
   29. KEYBOARD SHORTCUTS
───────────────────────────────────────── */

document.addEventListener('keydown', e => {
  // Ignore when typing in input fields
  if (['INPUT','TEXTAREA','SELECT'].includes(e.target.tagName)) return;

  if (e.code === 'Space') { e.preventDefault(); toggleTimer(); }
  if (e.key  === 'r' || e.key === 'R') resetTimer();
  if (e.key  === 'f' || e.key === 'F') toggleFocusMode();
  if (e.key  === 't' || e.key === 'T') toggleTheme();
  if (e.key  === 'Escape') { if (focusActive) toggleFocusMode(); closeSidebar(); }
});

/* ─────────────────────────────────────────
   30. UTILITY
───────────────────────────────────────── */

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

/* ─────────────────────────────────────────
   31. ON APP READY — main init after intro
───────────────────────────────────────── */

function onAppReady() {
  // Apply saved theme
  document.documentElement.setAttribute('data-theme', state.theme || 'dark');

  // Apply saved accent
  if (state.accentIndex !== undefined) applyAccent(state.accentIndex);

  // Greeting
  updateGreeting();

  // Clock — update every second
  updateClock();
  setInterval(updateClock, 1000);

  // Quote — update every 5 minutes
  quoteIndex = Math.floor(Math.random() * QUOTES.length);
  const q = QUOTES[quoteIndex];
  document.getElementById('motivationQuote').textContent = `"${q.text}"`;
  document.getElementById('quoteAuthor').textContent     = `— ${q.author}`;
  setInterval(loadNewQuote, 5 * 60 * 1000);

  // Productivity tip
  tipIndex = Math.floor(Math.random() * TIPS.length);
  document.getElementById('productivityTip').textContent = TIPS[tipIndex];

  // Pomodoro — init
  document.getElementById('editFocus').value = state.pomoDurations.focus;
  document.getElementById('editShort').value = state.pomoDurations.short;
  document.getElementById('editLong').value  = state.pomoDurations.long;
  setPomoMode('focus');
  updateSessionDots();
  sessionsDoneToday = 0;
  document.getElementById('pomoCount').textContent = 0;

  // Session history
  renderSessionHistory();

  // Goals
  renderGoals();

  // Subjects
  renderSubjects();

  // Dashboard stats
  updateDashboardStats();

  // Heatmap & Calendar (dashboard is active by default)
  renderHeatmap();
  renderCalendar();

  // Badges
  renderBadges();

  // Streak display
  updateStreakDisplay();

  // Periodic random notification (every 20 min)
  setInterval(() => {
    if (!pomoRunning) return;
    showNotification(NOTIFICATIONS[Math.floor(Math.random() * NOTIFICATIONS.length)]);
  }, 20 * 60 * 1000);

  // Notification toggle button state
  const nb = document.getElementById('notifsToggle');
  if (nb) {
    nb.textContent = state.notificationsOn ? 'ON' : 'OFF';
    nb.classList.toggle('off', !state.notificationsOn);
  }

  // Swatches
  renderSwatches();

  // Greet notification after 2 seconds
  setTimeout(() => showNotification('⚡ FocusForge ready! Let\'s crush your goals today.'), 2000);
}

/* ─────────────────────────────────────────
   32. BOOT SEQUENCE
───────────────────────────────────────── */

window.addEventListener('DOMContentLoaded', () => {
  // Load state from localStorage
  loadState();

  // Start particle animation
  resizeCanvas();
  initParticles();
  animateParticles();
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

  // Run intro
  runIntro();
});
