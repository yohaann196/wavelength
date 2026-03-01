import { useCallback, useRef, useState } from "react";
import { SCORE_ZONES } from "../game/scoring.ts";

interface Props {
  value: number;
  onChange?: (v: number) => void;
  disabled?: boolean;
  targetPct?: number | null;
  showZones?: boolean;
  leftLabel: string;
  rightLabel: string;
}

export function Slider({
  value, onChange, disabled = false,
  targetPct = null, showZones = false,
  leftLabel, rightLabel,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const clamp = (v: number) => Math.max(0, Math.min(100, v));

  const getPct = useCallback((clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return value;
    return clamp(((clientX - rect.left) / rect.width) * 100);
  }, [value]);

  const onDown = useCallback((e: React.PointerEvent) => {
    if (disabled) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    onChange?.(getPct(e.clientX));
  }, [disabled, onChange, getPct]);

  const onMove = useCallback((e: React.PointerEvent) => {
    if (!dragging || disabled) return;
    onChange?.(getPct(e.clientX));
  }, [dragging, disabled, onChange, getPct]);

  const onUp = useCallback(() => setDragging(false), []);

  const onKey = useCallback((e: React.KeyboardEvent) => {
    if (disabled) return;
    const step = e.shiftKey ? 10 : 1;
    if (e.key === "ArrowLeft")  onChange?.(clamp(value - step));
    if (e.key === "ArrowRight") onChange?.(clamp(value + step));
    if (e.key === "Home") onChange?.(0);
    if (e.key === "End")  onChange?.(100);
  }, [disabled, value, onChange]);

  const hint = disabled
    ? showZones ? `Guess landed at ${Math.round(value)}%` : "Waiting…"
    : positionHint(value, leftLabel, rightLabel);

  return (
    <div className="slider-wrap">
      <div className="slider-poles">
        <span className="pole pole--left">{leftLabel}</span>
        <span className="pole pole--right">{rightLabel}</span>
      </div>

      <div
        ref={trackRef}
        className={`slider-track${disabled ? " slider-track--disabled" : ""}${dragging ? " slider-track--active" : ""}`}
        role="slider"
        aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(value)}
        tabIndex={disabled ? -1 : 0}
        onPointerDown={onDown} onPointerMove={onMove}
        onPointerUp={onUp} onPointerCancel={onUp}
        onKeyDown={onKey}
      >
        {/* Scoring zones shown after reveal */}
        {showZones && targetPct !== null &&
          [...SCORE_ZONES].reverse().map(z => {
            const l = Math.max(0, targetPct - z.halfWidth);
            const w = Math.min(100, targetPct + z.halfWidth) - l;
            return (
              <div key={z.points} className="slider-zone"
                style={{ left: `${l}%`, width: `${w}%`, background: z.color }} />
            );
          })}

        {/* Target line after reveal */}
        {showZones && targetPct !== null && (
          <div className="slider-target" style={{ left: `${targetPct}%` }}>
            <div className="slider-target__stem" />
            <div className="slider-target__flag">Target</div>
          </div>
        )}

        <div
          className={`slider-handle${dragging ? " slider-handle--active" : ""}`}
          style={{ left: `${value}%` }}
        />
      </div>

      <p className="slider-hint">{hint}</p>
    </div>
  );
}

function positionHint(pct: number, left: string, right: string) {
  if (pct < 10)  return `Very close to "${left}"`;
  if (pct < 30)  return `Leaning "${left}"`;
  if (pct < 45)  return `Slightly left of center`;
  if (pct <= 55) return `Right in the middle`;
  if (pct < 70)  return `Slightly right of center`;
  if (pct < 90)  return `Leaning "${right}"`;
  return `Very close to "${right}"`;
}
