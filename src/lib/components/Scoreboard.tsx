import type { GameState } from "../game/types.ts";

interface Props {
  state: GameState;
}

export function Scoreboard({ state }: Props) {
  const { players, psychicIdx, winThreshold, round } = state;

  return (
    <div className="scoreboard">
      {players.map((p, i) => {
        const isPsychic = i === psychicIdx;
        const pct = Math.min(100, (p.score / winThreshold) * 100);
        return (
          <div key={i} className={`score-card${isPsychic ? " score-card--active" : ""}`}>
            <div className="score-card__top">
              <span className="score-card__name">{p.name}</span>
              {isPsychic && <span className="score-card__badge">🎙 Psychic</span>}
            </div>
            <div className="score-card__pts">{p.score}</div>
            <div className="score-card__bar-wrap">
              <div className="score-card__bar" style={{ width: `${pct}%` }} />
            </div>
            <div className="score-card__goal">/ {winThreshold}</div>
          </div>
        );
      })}
      <div className="scoreboard__round">R{round}</div>
    </div>
  );
}
