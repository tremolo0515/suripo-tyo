"use client";

import {
  formatSP,
  DAILY_SP_NORMAL,
  DAILY_SP_PREMIUM,
  GOOD_SLEEP_BONUS,
  PREMIUM_CONTINUATION_BONUS,
} from "../lib/calc";

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
  days,
  onTogglePremium,
  onSetSupply,
}: Props) {
  const isDirty = supply !== theoreticalMax;
  const daily = hasPremium ? DAILY_SP_PREMIUM : DAILY_SP_NORMAL;
  const fixedBonus = GOOD_SLEEP_BONUS + (hasPremium ? PREMIUM_CONTINUATION_BONUS : 0);

  return (
    <div className="mx-3 my-2">
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className="text-sm">💰</span>
        <h2 className="font-heading text-base text-brown-dark">月間SP見込み</h2>
        <div className="flex-1 border-t-2 border-dashed border-brown/40" />
      </div>

      <div className="rounded-2xl border-2 border-dashed border-brown bg-cream shadow-sm p-4 space-y-4">
        {/* Premium pass toggle */}
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="font-heading text-sm text-brown-dark">💎 プレミアムパス</p>
            <p className="text-[11px] text-brown/60 mt-0.5 leading-snug">
              {hasPremium ? (
                <>
                  {daily}pt/日 + 継続特典{formatSP(PREMIUM_CONTINUATION_BONUS)}pt
                  + グッドスリープ{formatSP(GOOD_SLEEP_BONUS)}pt
                </>
              ) : (
                <>
                  {daily}pt/日 + グッドスリープ{formatSP(GOOD_SLEEP_BONUS)}pt
                </>
              )}
            </p>
          </div>

          {/* iOS-style toggle */}
          <button
            onClick={onTogglePremium}
            role="switch"
            aria-checked={hasPremium}
            className={[
              "relative shrink-0 flex items-center h-8 w-[3.5rem] rounded-full px-1",
              "border-2 border-dashed transition-colors duration-300 focus:outline-none",
              hasPremium
                ? "bg-lavender border-purple-400"
                : "bg-brown/10 border-brown/30",
            ].join(" ")}
          >
            <span
              className={[
                "block h-5 w-5 rounded-full bg-white shadow-md",
                "transition-transform duration-300",
                hasPremium ? "translate-x-6" : "translate-x-0",
              ].join(" ")}
            />
          </button>
        </div>

        {/* SP amount control */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-heading text-xs text-brown-dark">今月の入手SP予定</span>
            {isDirty && (
              <button
                onClick={() => onSetSupply(theoreticalMax)}
                className="text-[11px] text-purple-600 underline underline-offset-2"
              >
                ↩ 理論値に戻す
              </button>
            )}
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

          <p className="text-[10px] text-brown/50 text-center">
            理論値: {formatSP(theoreticalMax)} SP
            （{days}日 × {daily}pt + ボーナス{formatSP(fixedBonus)}pt）
          </p>
        </div>
      </div>
    </div>
  );
}
