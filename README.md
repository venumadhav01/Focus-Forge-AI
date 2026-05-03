# ⚡ FocusForge — AI-Powered Student Productivity Dashboard

<div align="center">

![FocusForge Banner](https://img.shields.io/badge/FocusForge-AI%20Dashboard-6c63ff?style=for-the-badge&logo=lightning&logoColor=white)
![Version](https://img.shields.io/badge/version-1.0.0-00d4ff?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-39ff14?style=for-the-badge)
![HTML](https://img.shields.io/badge/HTML-Pure-ff6b35?style=for-the-badge&logo=html5)
![CSS](https://img.shields.io/badge/CSS-Glassmorphism-6c63ff?style=for-the-badge&logo=css3)
![JS](https://img.shields.io/badge/JavaScript-Vanilla-ffd23f?style=for-the-badge&logo=javascript)

**A premium, futuristic student productivity dashboard — no frameworks, no backend, no installs.**

[🚀 Live Demo](https://venumadhav01.github.io/Focus-Forge-AI/#) · [📖 Features](#-features) · [🛠 Setup](#-setup) · [🤝 Contributing](#-contributing)

</div>

---

## ✨ What is FocusForge?

FocusForge is a fully client-side, offline-capable **AI-style student productivity dashboard** built with pure HTML, CSS, and JavaScript. Designed with a dark futuristic glassmorphism UI, it helps students manage their time, track goals, build study habits, and stay motivated — all in one beautiful interface.

> No Node.js. No frameworks. No server. Just open `index.html` and forge your focus.

---

## 🎯 Features

### ⏱ Pomodoro Timer
- Customizable Focus / Short Break / Long Break durations
- Animated circular ring progress indicator
- Start, Pause, Resume, Reset, and Skip controls
- Auto-switches modes after each session
- Session dot tracker (4 sessions = long break)
- Session history log (last 30 sessions)

### 🎯 Goal Management
- Add, edit, delete goals with drag-and-drop reordering
- Priority levels: High 🔴 / Medium 🟡 / Low 🟢
- Real-time search/filter
- Task completion percentage bar
- Persistent via localStorage

### 📊 Analytics & Stats
- Daily minutes studied counter
- Session count tracker
- Weekly bar chart (last 7 days)
- Study heatmap (last 52 weeks, GitHub-style)
- All-time stats panel
- Export all data as JSON

### 📚 Subject Tracker
- Add subjects with custom color
- Adjustable progress bars (0–100%)
- Visual color-coded cards

### 🏆 Achievement Badges
- 10 unlockable achievements
- Animated unlock popup
- Tracks sessions, streaks, goals, minutes, subjects

### 💬 Motivation System
- 15 curated motivational quotes (auto-rotate every 5 min)
- 15 productivity tips (random + manual cycle)
- Push-style toast notifications
- AI-style dynamic greeting

### 🗓 Calendar & Heatmap
- Interactive mini calendar widget (navigate months)
- Study day highlights on calendar
- Full 52-week heatmap with intensity levels

### 🎵 Music & Ambient
- Spotify and YouTube lo-fi playlist links
- Built-in ambient sounds: Rain 🌧, Forest 🌿, Café ☕ (Web Audio API, no files needed)

### 🌙 Theming
- Dark / Light mode toggle
- 6 accent color presets (Purple, Pink, Cyan, Green, Orange, Red)
- All settings saved to localStorage

### ⌨️ Keyboard Shortcuts
| Key | Action |
|-----|--------|
| `Space` | Start / Pause timer |
| `R` | Reset timer |
| `F` | Toggle Focus Mode |
| `T` | Toggle Dark/Light theme |
| `Esc` | Exit Focus Mode |

### 🔮 Focus Mode & Fullscreen
- Distraction-free overlay with giant timer display
- True browser fullscreen mode

### 💾 Offline Support
- All data stored in `localStorage`
- No internet required after first load (except Google Fonts + links)
- Export stats as JSON backup

---

## 🗂 Project Structure

```
focusforge/
├── index.html      # App shell — all HTML structure & layout
├── style.css       # All styles — glassmorphism, animations, responsive
├── script.js       # All logic — timer, goals, heatmap, audio, etc.
├── README.md       # This file
└── LICENSE         # MIT License
```

---

## 🛠 Setup

### Option 1: Just Open It
```bash
# Clone the repo
git clone https://github.com/yourusername/focusforge.git
cd focusforge

# Open in your browser
open index.html   # macOS
start index.html  # Windows
xdg-open index.html  # Linux
```

### Option 2: GitHub Pages (Free Hosting)
1. Fork or push this repo to GitHub
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)` folder
4. Your dashboard is live at `https://yourusername.github.io/focusforge`

### Option 3: Any Static Host
Upload the three files (`index.html`, `style.css`, `script.js`) to:
- Netlify Drop
- Vercel
- Cloudflare Pages
- Any web host

---

## 📸 Screenshots

> *(Add your own screenshots here)*

| Dashboard | Pomodoro | Goals |
|-----------|----------|-------|
| ![dash]() | ![pomo]() | ![goals]() |

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch: `git checkout -b feature/AmazingFeature`
3. Commit your changes: `git commit -m 'feat: Add AmazingFeature'`
4. Push to the branch: `git push origin feature/AmazingFeature`
5. Open a Pull Request

---

## 🚀 Suggested Future Improvements

- [ ] **IndexedDB** storage for larger datasets
- [ ] **PWA support** (service worker + manifest) for installable app
- [ ] **Cloud sync** via Firebase or Supabase
- [ ] **Multiple profiles** / student accounts
- [ ] **Study group** feature with shared goals
- [ ] **Notion integration** to import tasks
- [ ] **AI study planner** using real Claude/GPT API
- [ ] **Custom sound upload** for ambient audio
- [ ] **More chart types** (pie chart for subject breakdown)
- [ ] **PDF export** for weekly reports
- [ ] **Reminder notifications** via Web Notifications API
- [ ] **Pomodoro statistics** per subject
- [ ] **Voice commands** via Web Speech API

---

## 📋 Good Commit Message Examples

```
feat: Add drag-and-drop goal reordering
fix: Correct timer display on mobile screens
style: Improve glassmorphism card hover effects
perf: Optimize particle animation with requestAnimationFrame
chore: Update README with setup instructions
feat(badges): Add 3-day streak achievement
fix(audio): Prevent AudioContext errors on Safari
refactor: Extract quote rendering into standalone function
docs: Add keyboard shortcuts table to README
feat(heatmap): Show study days on calendar widget
```

---

## 📝 License

Distributed under the **MIT License**. See `LICENSE` for full text.

---

## 🌟 GitHub Repository Description

> ⚡ FocusForge — AI-powered student productivity dashboard with Pomodoro timer, goal tracking, study heatmap, achievements, and ambient sounds. Built with pure HTML/CSS/JS. No frameworks. Offline-ready. Deploy instantly to GitHub Pages.

### Suggested Topics / Tags
```
productivity  pomodoro  student  dashboard  glassmorphism  javascript
study-tracker  dark-theme  offline  html-css-js  no-framework  github-pages
```

---

<div align="center">
  Made with ❤️ and ⚡ by the FocusForge project<br/>
  <em>Study hard. Forge your future.</em>
</div>
