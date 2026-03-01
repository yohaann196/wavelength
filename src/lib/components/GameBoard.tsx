import { useState, useCallback } from "react";
import type { GameState } from "../game/types.ts";
import { confirmClue, acknowledgeHandoff, submitGuess, advanceRound } from "../game/state.ts";
import { calculateScore } from "../game/scoring.ts";
import { Slider } from "./Slider.tsx";
import { Scoreboard } from "./Scoreboard.tsx";

interface Props {
  state: GameState;
  onChange: (s: GameState) => void;
}

export function GameBoard({ state, onChange }: Props) {
  const [guessValue, setGuessValue] = useState(50);

  const psychic = state.players[state.psychicIdx];
  const guesserIdx = state.psychicIdx === 0 ? 1 : 0;
  const guesser = state.players[guesserIdx];

  const handleGuessSubmit = useCallback(() => {
    onChange(submitGuess(state, guessValue));
  }, [state, guessValue, onChange]);

  const handleNextRound = useCallback(() => {
    onChange(advanceRound(state));
    setGuessValue(50);
  }, [state, onChange]);

  const scoreResult =
    state.phase === "REVEALING" && state.guessPct !== null
      ? calculateScore(state.targetPct, state.guessPct)
      : null;

  // ── GAME OVER ────────────────────────────────────────────────────────────
  if (state.phase === "GAME_OVER") {
    const [p0, p1] = state.players;
    const winner = p0.score > p1.score ? p0 : p1.score > p0.score ? p1 : null;

    return (
      <div className="screen game-over-screen">
        <div className="game-over__trophy">{winner ? "🏆" : "🤝"}</div>
        <h2 className="game-over__title">
          {winner ? `${winner.name} wins!` : "It's a tie!"}
        </h2>
        <div className="game-over__scores">
          {state.players.map((p, i) => (
            <div key={i} className={`game-over__score${p === winner ? " game-over__score--winner" : ""}`}>
              <span>{p.name}</span>
              <strong>{p.score}</strong>
            </div>
          ))}
        </div>
        {state.history.length > 0 && (
          <details className="history">
            <summary className="history__toggle">Round history ({state.history.length} rounds)</summary>
            <div className="history__list">
              {[...state.history].reverse().map(r => (
                <div key={r.round} className="history-row">
                  <span className="history-row__round">R{r.round}</span>
                  <span className="history-row__spectrum">{r.leftLabel} ↔ {r.rightLabel}</span>
                  <span className={`history-row__pts pts--${r.label.toLowerCase()}`}>
                    +{r.points} {r.label}
                  </span>
                </div>
              ))}
            </div>
          </details>
        )}
        <button className="btn btn--primary" onClick={() => window.location.reload()}>
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="game-board">
      <Scoreboard state={state} />

      {/* ── CLUE GIVING ──────────────────────────────────────────────────── */}
      {state.phase === "CLUE_GIVING" && (
        <div className="screen">
          <div className="phase-header">
            <div className="phase-header__who">{psychic.name}</div>
            <div className="phase-header__action">🎙 You're the Psychic — don't show anyone!</div>
          </div>

          <div className="target-preview">
            <Slider
              value={state.targetPct}
              disabled
              leftLabel={state.leftLabel}
              rightLabel={state.rightLabel}
            />
          </div>

          <p className="instruction">
            Say your clue out loud, then tap the button below.
          </p>

          <button className="btn btn--primary btn--full"
            onClick={() => onChange(confirmClue(state))}>
            I said my clue →
          </button>
        </div>
      )}

      {/* ── HANDOFF ──────────────────────────────────────────────────────── */}
      {state.phase === "HANDOFF_CLUE" && (
        <div className="screen handoff-screen">
          <div className="handoff-screen__icon">📱</div>
          <h2 className="handoff-screen__title">Pass the device</h2>
          <p className="handoff-screen__desc">
            Face down! Hand it to <strong>{guesser.name}</strong>.
          </p>
          <button className="btn btn--primary btn--full"
            onClick={() => onChange(acknowledgeHandoff(state))}>
            I'm {guesser.name}, I'm ready →
          </button>
        </div>
      )}

      {/* ── GUESSING ─────────────────────────────────────────────────────── */}
      {state.phase === "GUESSING" && (
        <div className="screen">
          <div className="phase-header">
            <div className="phase-header__who">{guesser.name}</div>
            <div className="phase-header__action">🎯 Make your guess</div>
          </div>

          <Slider
            value={guessValue}
            onChange={setGuessValue}
            leftLabel={state.leftLabel}
            rightLabel={state.rightLabel}
          />

          <button className="btn btn--primary btn--full" onClick={handleGuessSubmit}>
            Lock In →
          </button>
        </div>
      )}

      {/* ── REVEALING ────────────────────────────────────────────────────── */}
      {state.phase === "REVEALING" && state.guessPct !== null && (
        <div className="screen">
          <div className="phase-header">
            <div className="phase-header__who">Reveal!</div>
            <div className="phase-header__action">{psychic.name} shows the target</div>
          </div>

          <Slider
            value={state.guessPct}
            disabled
            targetPct={state.targetPct}
            showZones
            leftLabel={state.leftLabel}
            rightLabel={state.rightLabel}
          />

          {scoreResult && (
            <div className={`score-result score-result--${scoreResult.label.toLowerCase()}`}>
              <span className="score-result__pts">+{scoreResult.points}</span>
              <div>
                <span className="score-result__label">{scoreResult.label}</span>
                <span className="score-result__dist">{scoreResult.distancePct.toFixed(1)}% away</span>
              </div>
            </div>
          )}

          <button className="btn btn--primary btn--full" onClick={handleNextRound}>
            Next Round →
          </button>
        </div>
      )}
    </div>
  );
}
