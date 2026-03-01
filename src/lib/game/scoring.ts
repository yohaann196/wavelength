import type { ScoreLabel } from "./types.ts";

export interface ScoreResult {
  points: number;
  label: ScoreLabel;
  distancePct: number;
}

export function calculateScore(targetPct: number, guessPct: number): ScoreResult {
  const distancePct = Math.abs(targetPct - guessPct);
  let points: number;
  let label: ScoreLabel;

  if (distancePct < 5)       { points = 4; label = "Perfect"; }
  else if (distancePct < 15) { points = 3; label = "Close"; }
  else if (distancePct < 30) { points = 2; label = "Near"; }
  else if (distancePct < 50) { points = 1; label = "Far"; }
  else                       { points = 0; label = "Miss"; }

  return { points, label, distancePct };
}

/** Zone half-widths as %, outermost first — used to paint the slider reveal */
export const SCORE_ZONES = [
  { halfWidth: 50, points: 1, label: "Far",     color: "rgba(126,184,247,0.20)" },
  { halfWidth: 30, points: 2, label: "Near",    color: "rgba(126,184,247,0.38)" },
  { halfWidth: 15, points: 3, label: "Close",   color: "rgba(255,209,102,0.55)" },
  { halfWidth: 5,  points: 4, label: "Perfect", color: "rgba(6,214,160,0.82)"   },
] as const;
