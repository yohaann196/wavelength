import { useState } from "react";
import { WIN_THRESHOLD_DEFAULT } from "../game/state.ts";

interface Props {
  onStart: (name1: string, name2: string, winThreshold: number) => void;
}

export function SetupScreen({ onStart }: Props) {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [threshold, setThreshold] = useState(WIN_THRESHOLD_DEFAULT);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onStart(name1.trim() || "Player 1", name2.trim() || "Player 2", threshold);
  }

  return (
    <div className="setup-screen">
      <div className="setup-screen__hero">
        <h1 className="logo">Wavelength</h1>
        <p className="tagline">pass-and-play · 2 players · irl</p>
      </div>

      <form className="setup-form" onSubmit={handleSubmit}>
        <div className="setup-form__players">
          <div className="field">
            <label className="field__label">Player 1</label>
            <input
              className="input"
              type="text"
              value={name1}
              onChange={e => setName1(e.target.value)}
              placeholder="e.g. Alex"
              maxLength={20}
              autoFocus
            />
          </div>
          <div className="setup-form__vs">vs</div>
          <div className="field">
            <label className="field__label">Player 2</label>
            <input
              className="input"
              type="text"
              value={name2}
              onChange={e => setName2(e.target.value)}
              placeholder="e.g. Jordan"
              maxLength={20}
            />
          </div>
        </div>

        <div className="field">
          <label className="field__label">Points to win</label>
          <div className="stepper">
            <button type="button" className="stepper__btn"
              onClick={() => setThreshold(Math.max(5, threshold - 5))}>−</button>
            <span className="stepper__val">{threshold}</span>
            <button type="button" className="stepper__btn"
              onClick={() => setThreshold(Math.min(50, threshold + 5))}>+</button>
          </div>
        </div>

        <button className="btn btn--primary btn--full" type="submit">
          Start Game →
        </button>
      </form>

      <div className="how-to-play">
        <h2 className="how-to-play__title">How to play</h2>
        <ol className="how-to-play__steps">
          <li><strong>Psychic</strong> secretly sees where the target sits on a random spectrum.</li>
          <li>They say a clue out loud — a person, object, or concept — then pass the device face down.</li>
          <li><strong>Guesser</strong> drags the dial to their best guess based on the clue.</li>
          <li>Reveal together. Points go to the Psychic based on accuracy.</li>
          <li>Roles swap every round. First to {threshold} points wins!</li>
        </ol>
        <div className="scoring-legend">
          <span className="score-chip score-chip--4">🎯 &lt;5% = 4 pts</span>
          <span className="score-chip score-chip--3">⚡ &lt;15% = 3 pts</span>
          <span className="score-chip score-chip--2">✨ &lt;30% = 2 pts</span>
          <span className="score-chip score-chip--1">· &lt;50% = 1 pt</span>
        </div>
      </div>
    </div>
  );
}
