import type { GameState, PlayerIndex, RoundResult } from "./types.ts";
import { calculateScore } from "./scoring.ts";

export const WIN_THRESHOLD_DEFAULT = 10;

const SPECTRA: [string, string][] = [
  ["Hot","Cold"],["Fast","Slow"],["Loud","Quiet"],["Big","Small"],["Funny","Serious"],
  ["Old","New"],["Simple","Complex"],["Safe","Dangerous"],["Good","Evil"],["Beautiful","Ugly"],
  ["Rich","Poor"],["Strong","Weak"],["Natural","Artificial"],["Rare","Common"],["Wet","Dry"],
  ["Boring","Exciting"],["Formal","Casual"],["Happy","Sad"],["Wild","Tame"],["Ancient","Modern"],
  ["Cheap","Expensive"],["Healthy","Unhealthy"],["Famous","Unknown"],["Brave","Cowardly"],
  ["Sweet","Bitter"],["Relaxing","Stressful"],["Crowded","Empty"],["Bright","Dark"],
  ["Optimistic","Pessimistic"],["Urban","Rural"],["Fragile","Sturdy"],["Tasty","Disgusting"],
  ["Lucky","Unlucky"],["Trendy","Timeless"],["Overrated","Underrated"],["Predictable","Surprising"],
  ["Digital","Analog"],["Easy","Hard"],["Young","Old"],["Popular","Obscure"],
  ["Elegant","Tacky"],["Spicy","Mild"],["Obvious","Subtle"],["Magical","Mundane"],
  ["Loud","Soft"],["Serious","Playful"],["Clean","Messy"],["Selfish","Generous"],
  ["Mainstream","Niche"],["Timid","Bold"],
];

// Keep track of recently used spectra to avoid repeats
const recentSpectra: number[] = [];

function randomSpectrum(): [string, string] {
  const available = SPECTRA.map((_, i) => i).filter(i => !recentSpectra.includes(i));
  const pool = available.length > 0 ? available : SPECTRA.map((_, i) => i);
  const idx = pool[Math.floor(Math.random() * pool.length)]!;
  recentSpectra.push(idx);
  if (recentSpectra.length > 8) recentSpectra.shift();
  return SPECTRA[idx]!;
}

function randomTarget(): number {
  return 10 + Math.random() * 80;
}

export function makeInitialState(
  name1: string,
  name2: string,
  winThreshold = WIN_THRESHOLD_DEFAULT,
): GameState {
  const [left, right] = randomSpectrum();
  return {
    phase: "CLUE_GIVING",
    round: 1,
    psychicIdx: 0,
    players: [
      { name: name1, score: 0 },
      { name: name2, score: 0 },
    ],
    leftLabel: left,
    rightLabel: right,
    targetPct: randomTarget(),
    guessPct: null,
    history: [],
    winThreshold,
  };
}

/** Psychic taps "I said my clue" — move to handoff screen */
export function confirmClue(state: GameState): GameState {
  return { ...state, phase: "HANDOFF_CLUE" };
}

/** Guesser taps "Ready" on the handoff screen */
export function acknowledgeHandoff(state: GameState): GameState {
  return { ...state, phase: "GUESSING" };
}

/** Guesser locks in their position */
export function submitGuess(state: GameState, guessPct: number): GameState {
  return { ...state, guessPct, phase: "REVEALING" };
}

/** Score and advance to next round */
export function advanceRound(state: GameState): GameState {
  if (state.guessPct === null) return state;

  const { points, label } = calculateScore(state.targetPct, state.guessPct);

  const result: RoundResult = {
    round: state.round,
    psychicIdx: state.psychicIdx,
    leftLabel: state.leftLabel,
    rightLabel: state.rightLabel,
    targetPct: state.targetPct,
    guessPct: state.guessPct,
    points,
    label,
  };

  const newPlayers: GameState["players"] = [
    { ...state.players[0] },
    { ...state.players[1] },
  ];
  newPlayers[state.psychicIdx].score += points;

  const nextPsychic: PlayerIndex = state.psychicIdx === 0 ? 1 : 0;
  const winner = newPlayers.some(p => p.score >= state.winThreshold);
  const [nextLeft, nextRight] = randomSpectrum();

  return {
    ...state,
    phase: winner ? "GAME_OVER" : "CLUE_GIVING",
    round: state.round + 1,
    psychicIdx: nextPsychic,
    players: newPlayers,
    leftLabel: nextLeft,
    rightLabel: nextRight,
    targetPct: randomTarget(),
    guessPct: null,
    history: [...state.history, result],
  };
}
