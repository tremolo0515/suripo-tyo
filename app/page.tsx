"use client";

import { useState, useEffect } from "react";
import {
  currentYearMonth,
  prevMonth,
  nextMonth,
  formatYearMonth,
  daysInMonth,
  theoreticalSP,
  formatSP,
} from "./lib/calc";
import { NORMAL_ITEMS, PREMIUM_ITEMS } from "./lib/items";
import type { ExchangeItem, CartItem } from "./lib/types";
import { loadMonthData, saveMonthData } from "./lib/storage";
import IncomeSetup from "./components/IncomeSetup";
import BalanceScale from "./components/BalanceScale";
import ExchangeList from "./components/ExchangeList";

export default function Home() {
  const [ym, setYm] = useState(currentYearMonth());
  const [hasPremium, setHasPremium] = useState(false);
  const [supply, setSupply] = useState(() =>
    theoreticalSP(false, daysInMonth(currentYearMonth()))
  );
  const [carryover, setCarryover] = useState(() => {
    const prev = loadMonthData(prevMonth(currentYearMonth()));
    if (!prev) return 0;
    return Math.max(0, prev.carryover + prev.supply - prev.spend);
  });
  const [cart, setCart] = useState<Map<string, CartItem>>(new Map());

  const days = daysInMonth(ym);
  const theoretical = theoreticalSP(hasPremium, days);

  const spendTotal = [...cart.values()].reduce(
    (s, c) => s + c.sp * c.quantity,
    0
  );

  // 現在月のデータを保存
  useEffect(() => {
    saveMonthData(ym, { supply, spend: spendTotal, carryover });
  }, [ym, supply, spendTotal, carryover]);

  function handleTogglePremium() {
    const next = !hasPremium;
    setHasPremium(next);
    setSupply(theoreticalSP(next, days));
  }

  function changeMonth(newYm: string) {
    setYm(newYm);
    setSupply(theoreticalSP(hasPremium, daysInMonth(newYm)));
    setCart(new Map());
    const prev = loadMonthData(prevMonth(newYm));
    setCarryover(prev ? Math.max(0, prev.carryover + prev.supply - prev.spend) : 0);
  }

  function handleIncrement(item: ExchangeItem) {
    setCart((prev) => {
      const next = new Map(prev);
      const qty = next.get(item.id)?.quantity ?? 0;
      if (qty < item.limit) {
        next.set(item.id, { ...item, quantity: qty + 1 });
      }
      return next;
    });
  }

  function handleDecrement(item: ExchangeItem) {
    setCart((prev) => {
      const next = new Map(prev);
      const existing = next.get(item.id);
      if (!existing) return next;
      if (existing.quantity <= 1) {
        next.delete(item.id);
      } else {
        next.set(item.id, { ...existing, quantity: existing.quantity - 1 });
      }
      return next;
    });
  }

  const cartItemCount = [...cart.values()].reduce((s, c) => s + c.quantity, 0);

  return (
    <div className="pb-4">
      {/* ── App header ── */}
      <header className="sticky top-0 z-10 bg-cream/90 backdrop-blur-sm border-b-2 border-dashed border-brown/30 px-4 py-2">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-base text-brown-dark tracking-wide">
            スリープポイントやりくり帳
          </h1>
          <div className="flex items-center gap-2">
            {cartItemCount > 0 && (
              <div className="flex items-center gap-1 bg-lavender/60 rounded-full px-3 py-1 border border-dashed border-purple-300">
                <span className="text-xs font-heading text-purple-700">
                  🛒 {formatSP(spendTotal)} SP
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Month nav */}
        <div className="relative flex items-center justify-center mt-1.5 h-9">
          {/* 繰越バッジ：左端固定 */}
          {carryover > 0 && (
            <div className="absolute left-0 flex flex-col items-center justify-center w-12 h-9 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-[8px] text-green-600/70 leading-none">前月繰越</span>
              <span className="text-[10px] font-heading text-green-800 tabular-nums leading-tight">{formatSP(carryover)}</span>
              <span className="text-[8px] text-green-600/60 leading-none">SP</span>
            </div>
          )}

          {/* ◀ 年月 ▶：常に画面中央 */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => changeMonth(prevMonth(ym))}
              className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-dashed border-brown/40 bg-yellow/50 text-brown-dark font-heading active:scale-90 transition-transform"
              aria-label="前の月"
            >
              ◀
            </button>
            <span className="font-heading text-lg text-brown-dark whitespace-nowrap min-w-32 text-center">
              {formatYearMonth(ym)}
            </span>
            <button
              onClick={() => changeMonth(nextMonth(ym))}
              className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-dashed border-brown/40 bg-yellow/50 text-brown-dark font-heading active:scale-90 transition-transform"
              aria-label="次の月"
            >
              ▶
            </button>
          </div>
        </div>
      </header>

      {/* ── Sections ── */}
      <IncomeSetup
        hasPremium={hasPremium}
        supply={supply}
        theoreticalMax={theoretical}
        days={days}
        onTogglePremium={handleTogglePremium}
        onSetSupply={setSupply}
      />

      <BalanceScale carryover={carryover} supply={supply} spend={spendTotal} />

      <ExchangeList
        hasPremium={hasPremium}
        cart={cart}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
      />
    </div>
  );
}
