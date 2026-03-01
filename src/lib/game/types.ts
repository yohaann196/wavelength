// ─── Game state machine ───────────────────────────────────────────────────
export type GamePhase =
  | "CLUE_GIVING"    // psychic sees target + spectrum, says clue out loud
  | "HANDOFF_CLUE"   // interstitial: pass device face-down to guesser
  | "GUESSING"       // guesser drags slider
  | "REVEALING"      // both see result together
  | "GAME_OVER";

export type PlayerIndex = 0 | 1;

export interface Player {
  name: string;
  score: number;
}

export interface RoundResult {
  round: number;
  psychicIdx: PlayerIndex;
  leftLabel: string;
  rightLabel: string;
  targetPct: number;
  guessPct: number;
  points: number;
  label: ScoreLabel;
}

export type ScoreLabel = "Perfect" | "Close" | "Near" | "Far" | "Miss";

export interface GameState {
  phase: GamePhase;
  round: number;
  psychicIdx: PlayerIndex;
  players: [Player, Player];
  leftLabel: string;
  rightLabel: string;
  targetPct: number;
  guessPct: number | null;
  history: RoundResult[];
  winThreshold: number;
}
