# TypeFlow — Master Your Typing Speed

A beautiful, responsive, and fast **Typing Speed Challenge** website with a premium dark glassmorphism UI, smooth animations, and a full feature set. Built as a single-page application with vanilla HTML, CSS, and JavaScript — no build tools or dependencies required.

## Features

### Landing Page
- Large hero section with animated gradient title
- Floating keyboard key background animation
- Live typing preview card
- Feature highlights grid

### Typing Test
- **Durations:** 15s, 30s, 60s, 120s
- **Modes:** Words, Quotes, Code, Numbers, Mixed, Paragraph
- **Difficulty:** Easy, Medium, Hard, Expert
- **Live stats:** WPM, accuracy, characters typed, time remaining
- Color-coded letters (green = correct, red = wrong)
- Animated blue cursor underline
- Real-time progress bar
- Optional keyboard click sounds

### Results Screen
- Large animated counters: WPM, accuracy, CPM, mistakes
- Detailed breakdown: correct/incorrect words, characters, time, raw WPM, errors
- **WPM over time** line chart
- **Accuracy graph** line chart
- **Most mistyped keys** bar chart (typing heatmap)
- Confetti animation on new personal best
- Retry, Save Result, and Share buttons

### Leaderboard
- Global rankings with rank medals (gold/silver/bronze)
- Player avatars, WPM, accuracy, and mode
- Filters: Today, Week, Month, All Time
- Search players by name
- Your own row is highlighted

### Stats / Dashboard
- Profile header with avatar and streak
- Animated stat cards: best WPM, average WPM, accuracy, total words, time practiced, streak
- Daily goal progress bar
- Speed improvement trend chart
- Daily activity bar chart (last 14 days)

### Settings
- **Themes:** Dark, Light, Midnight, Ocean, Forest
- **Fonts:** JetBrains Mono, Fira Code, Roboto Mono (with live preview)
- Adjustable font size (16–36px)
- Keyboard sounds toggle
- Animations toggle
- Profile customization: display name + avatar picker (16 emojis)

## Design
- Dark theme with glassmorphism (blurred cards, translucent backgrounds)
- Primary color: `#3B82F6`
- Accent colors: green, purple, orange
- Rounded corners, smooth transitions, gradient text
- Fully responsive with mobile bottom navigation
- Custom canvas-based charts (no chart library needed)
- Custom confetti animation

## Tech
- **HTML** — semantic single-page structure
- **CSS** — custom properties, glassmorphism, animations, responsive grid
- **JavaScript** — vanilla JS, no frameworks or libraries
- **Storage** — `localStorage` for all data (profile, settings, test history)
- **Fonts** — Google Fonts (Inter + JetBrains Mono) via CDN

## File Structure
```
typeflow/
├── index.html    # App structure and views
├── style.css     # All styling, themes, animations
├── app.js        # All logic: test engine, charts, state, navigation
└── readme.md     # This file
```

## How to Run
1. Open `index.html` in any modern browser.
2. That's it — no server, no build step, no dependencies.

Or serve locally:
```bash
npx serve .
# or
python3 -m http.server 8000
```

## Data Storage
All data is stored locally in the browser via `localStorage` under the key `typeflow_v1`:
- Player profile (name, avatar, ID)
- Settings (theme, font, font size, sounds, animations)
- Test history (WPM, accuracy, mode, difficulty, timestamps, chart series)

The leaderboard includes demo competitors so it's never empty. Your saved results appear alongside them, highlighted as "you".

## Keyboard Shortcuts
- Click the typing area or press any key to focus the input
- Type to start the timer automatically
- Click **Restart** (or navigate to the test view) to reset

## Browser Support
Works in all modern browsers (Chrome, Firefox, Safari, Edge). Requires `localStorage` and canvas support.
