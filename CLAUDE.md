# CLAUDE.md

## Overview

Pass-and-play local Wavelength game. Two players share one device and take turns being Psychic and Guesser.

## Game Flow

```
SETUP → CONFIGURING → CLUE_GIVING → HANDOFF_CLUE → GUESSING → REVEALING → (next round)
                                                                           → GAME_OVER
```

- **SETUP**: Name entry, win threshold (handled by SetupScreen, not in GameState)
- **CONFIGURING**: Psychic sets spectrum poles
- **CLUE_GIVING**: Psychic sees target, enters clue
- **HANDOFF_CLUE**: Interstitial asking them to pass the device to the guesser
- **GUESSING**: Guesser drags slider
- **REVEALING**: Both see result together

## Key Invariants

1. `targetPct` is set at `CONFIGURING` time and **never shown to the guesser** (it only appears in `CLUE_GIVING` and `REVEALING` phases)
2. Points go to the **Psychic** (clue-giver), not the guesser
3. All state transitions are **pure functions** in `state.ts` — no mutations
4. `psychicIdx` alternates each round via `advanceRound()`

## Commands

```bash
npm run dev      # dev server at localhost:5173
npm run build    # typecheck + build
npm run preview  # preview prod build
npm run lint     # eslint
```

## Adding Spectra

Add pairs to the `SPECTRA` array in `src/lib/game/state.ts`.

## Changing Scoring

Edit `calculateScore()` and `SCORE_ZONES` in `src/lib/game/scoring.ts`.
