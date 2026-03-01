import { useState } from "react";
import type { GameState } from "./lib/game/types.ts";
import { makeInitialState } from "./lib/game/state.ts";
import { SetupScreen } from "./lib/components/SetupScreen.tsx";
import { GameBoard } from "./lib/components/GameBoard.tsx";

export default function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);

  function handleStart(name1: string, name2: string, winThreshold: number) {
    setGameState(makeInitialState(name1, name2, winThreshold));
  }

  return (
    <div className="app">
      {gameState === null ? (
        <SetupScreen onStart={handleStart} />
      ) : (
        <>
          <header className="app-header">
            <span className="app-header__logo">🌊 Wavelength</span>
            <button className="btn btn--ghost btn--sm" onClick={() => setGameState(null)}>
              Quit
            </button>
          </header>
          <main className="app-main">
            <GameBoard state={gameState} onChange={setGameState} />
          </main>
        </>
      )}
    </div>
  );
}
