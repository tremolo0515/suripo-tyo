"use client";

import { formatSP, DAILY_SP_NORMAL, DAILY_SP_PREMIUM, GOOD_SLEEP_BONUS, PREMIUM_CONTINUATION_BONUS } from "../lib/calc";

interface Props {
  hasPremium: boolean;
  supply: number;
  theoreticalMax: number;
  days: number;
  onTogglePremium: () => void;
  onSetSupply: (n: number) => void;
}

export default function IncomeSetup({
  hasPremium,
  supply,
  theoreticalMax,
  onTogglePremium,
  onSetSupply,
}: Props) {
  const isDirty = supply !== theoreticalMax;
  const daily = hasPremium ? DAILY_SP_PREMIUM : DAILY_SP_NORMAL;

  return (
    <div className="mx-3 my-2">
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className="text-sm">💰</span>
        <h2 className="font-heading text-base text-brown-dark">SP獲得量</h2>
        <div className="flex-1 border-t-2 border-dashed border-brown/40" />
      </div>

      <div className="rounded-2xl border-2 border-dashed border-brown bg-cream shadow-sm px-4 py-3 space-y-2">
        {/* SP amount control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-heading text-xs text-brown-dark">今月の入手SP</span>
            <div className="flex items-center gap-2">
              {isDirty && (
                <button
                  onClick={() => onSetSupply(theoreticalMax)}
                  className="text-[11px] text-purple-600 underline underline-offset-2"
                >
                  ↩ 理論値に戻す
                </button>
              )}
              {/* プレパス トグル */}
              <div className="flex items-center gap-1">
                <span className="font-heading text-[11px] text-brown-dark">プレパス</span>
                <button
                  onClick={onTogglePremium}
                  role="switch"
                  aria-checked={hasPremium}
                  className={[
                    "relative flex items-center h-5 w-9 rounded-full px-0.5",
                    "border border-dashed transition-colors duration-300 focus:outline-none",
                    hasPremium ? "bg-lavender border-purple-400" : "bg-brown/10 border-brown/30",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "block h-3.5 w-3.5 rounded-full bg-white shadow-sm",
                      "transition-transform duration-300",
                      hasPremium ? "translate-x-4" : "translate-x-0",
                    ].join(" ")}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 min-w-0">
            <button
              onClick={() => onSetSupply(Math.max(0, supply - 10))}
              className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl border-2 border-dashed border-pink/80 bg-pink/30 text-red-700 font-heading text-lg active:scale-90 transition-transform"
              aria-label="10 SP減らす"
            >
              −
            </button>
            <input
              type="number"
              value={supply}
              min={0}
              onChange={(e) => onSetSupply(Math.max(0, Number(e.target.value) || 0))}
              className="flex-1 min-w-0 text-center font-heading text-lg text-purple-800 rounded-xl border-2 border-dashed border-lavender bg-lavender/20 py-2 px-2 focus:outline-none focus:border-purple-400 tabular-nums"
            />
            <button
              onClick={() => onSetSupply(supply + 10)}
              className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl border-2 border-dashed border-mint/80 bg-mint/30 text-green-700 font-heading text-lg active:scale-90 transition-transform"
              aria-label="10 SP増やす"
            >
              ＋
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
