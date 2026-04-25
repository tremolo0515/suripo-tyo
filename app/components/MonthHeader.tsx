"use client";

import { formatYearMonth, formatSP } from "../lib/calc";

interface Props {
  yearMonth: string;
  balance: number;
  carryOver: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function MonthHeader({ yearMonth, balance, carryOver, onPrev, onNext }: Props) {
  return (
    <div className="relative mx-3 mt-4 mb-2 rounded-2xl border-2 border-dashed border-brown bg-cream overflow-hidden shadow-sm">
      {/* decorative top strip */}
      <div className="h-2 bg-gradient-to-r from-mint via-lavender to-pink" />

      {/* title row */}
      <div className="flex items-center justify-center gap-2 pt-3 pb-1 px-4">
        <h1 className="font-heading text-xl text-brown-dark tracking-wide">
          スリープポイントやりくり帳
        </h1>
      </div>

      {/* month navigator */}
      <div className="flex items-center justify-center gap-4 py-2 px-4">
        <button
          onClick={onPrev}
          className="flex items-center justify-center w-11 h-11 rounded-full border-2 border-dashed border-brown bg-yellow hover:bg-yellow/70 active:scale-95 transition-transform text-brown-dark text-lg font-bold"
          aria-label="前の月"
        >
          ◀
        </button>
        <span className="font-heading text-2xl text-brown-dark min-w-[8rem] text-center">
          {formatYearMonth(yearMonth)}
        </span>
        <button
          onClick={onNext}
          className="flex items-center justify-center w-11 h-11 rounded-full border-2 border-dashed border-brown bg-yellow hover:bg-yellow/70 active:scale-95 transition-transform text-brown-dark text-lg font-bold"
          aria-label="次の月"
        >
          ▶
        </button>
      </div>

      {/* balance badge */}
      <div className="flex justify-center pb-3 px-4">
        <div className="flex flex-col items-center gap-1">
          <div className="inline-flex items-center gap-2 px-6 py-2 rounded-2xl bg-lavender border-2 border-dashed border-lavender/80 shadow-sm">
            <span className="text-sm text-purple-700">残高</span>
            <span className="font-heading text-2xl text-purple-900 tracking-wide">
              ✦ {formatSP(balance)} SP
            </span>
          </div>
          <p className="text-xs text-brown/80 mt-1">
            前月繰越: {formatSP(carryOver)} SP
          </p>
        </div>
      </div>

      {/* decorative stars */}
      <span className="absolute top-3 right-4 text-yellow text-lg select-none">★</span>
      <span className="absolute bottom-3 left-4 text-pink text-sm select-none">✦</span>
    </div>
  );
}
