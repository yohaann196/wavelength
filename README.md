# Wavelength 🌊

A pass-and-play local Wavelength guessing game for 2 players in the same room. Built with React + TypeScript + Vite. No backend, no accounts — just open it and play.

## 🎮 Play Now

**Live Demo:** https://your-username.github.io/wavelength/

## How to Play

1. Enter both player names and set a points-to-win threshold
2. The **Psychic** sets the spectrum poles (e.g. "Hot" ↔ "Cold") and sees the secret target position
3. They give a clue — a person, object, or concept — then pass the device
4. The **Guesser** drags the dial to their best guess
5. Reveal together and score based on accuracy
6. Roles swap every round — first to the threshold wins!

## Scoring

| Distance | Points | Label   |
|----------|--------|---------|
| < 5%     | 4      | Perfect |
| < 15%    | 3      | Close   |
| < 30%    | 2      | Near    |
| < 50%    | 1      | Far     |
| ≥ 50%    | 0      | Miss    |

## Tech Stack

- **React 18** + **TypeScript** — UI and logic
- **Vite** — build tool
- **CSS** — custom design system, no framework
- **GitHub Pages** — static hosting via GitHub Actions

## Development

```bash
npm install
npm run dev       # localhost:5173
npm run build     # production build
npm run preview   # preview build
```

## Deployment

Push to `main` — GitHub Actions builds and deploys automatically to GitHub Pages.

Enable Pages in your repo: **Settings → Pages → Source: GitHub Actions**

## Project Structure

```
src/
├── lib/
│   ├── game/
│   │   ├── types.ts      # GameState, phases, types
│   │   ├── state.ts      # Pure state transitions + spectrum list
│   │   └── scoring.ts    # Score calculation + zone definitions
│   ├── components/
│   │   ├── SetupScreen.tsx   # Name entry + win threshold
│   │   ├── GameBoard.tsx     # Orchestrates all game phases
│   │   ├── Slider.tsx        # Draggable spectrum slider
│   │   └── Scoreboard.tsx    # Live scores + progress bars
│   └── utils/
│       └── random.ts         # Crypto-secure random
├── styles/global.css          # Full design system
├── App.tsx
└── main.tsx
```

## License

MIT
