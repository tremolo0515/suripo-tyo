"use client";

import { useState } from "react";
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
import IncomeSetup from "./components/IncomeSetup";
import BalanceScale from "./components/BalanceScale";
import ExchangeList from "./components/ExchangeList";

export default function Home() {
  const [ym, setYm] = useState(currentYearMonth());
  const [hasPremium, setHasPremium] = useState(false);
  const [supply, setSupply] = useState(() =>
    theoreticalSP(false, daysInMonth(currentYearMonth()))
  );
  const [cart, setCart] = useState<Map<string, CartItem>>(new Map());

  const days = daysInMonth(ym);
  const theoretical = theoreticalSP(hasPremium, days);

  const spendTotal = [...cart.values()].reduce(
    (s, c) => s + c.sp * c.quantity,
    0
  );

  function handleTogglePremium() {
    const next = !hasPremium;
    setHasPremium(next);
    setSupply(theoreticalSP(next, days));
  }

  function changeMonth(newYm: string) {
    setYm(newYm);
    setSupply(theoreticalSP(hasPremium, daysInMonth(newYm)));
    setCart(new Map());
  }

  function handleIncrement(item: ExchangeItem) {
    setCart((prev) => {
      const next = new Map(prev);
      const qty = next.get(item.name)?.quantity ?? 0;
      if (qty < item.limit) {
        next.set(item.name, { ...item, quantity: qty + 1 });
      }
      return next;
    });
  }

  function handleDecrement(item: ExchangeItem) {
    setCart((prev) => {
      const next = new Map(prev);
      const existing = next.get(item.name);
      if (!existing) return next;
      if (existing.quantity <= 1) {
        next.delete(item.name);
      } else {
        next.set(item.name, { ...existing, quantity: existing.quantity - 1 });
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
          <div className="flex items-center gap-1.5">
            <h1 className="font-heading text-base text-brown-dark tracking-wide">
          スリープポイントやりくり帳
            </h1>

          </div>
          {cartItemCount > 0 && (
            <div className="flex items-center gap-1 bg-lavender/60 rounded-full px-3 py-1 border border-dashed border-purple-300">
              <span className="text-xs font-heading text-purple-700">
                🛒 {formatSP(spendTotal)} SP
              </span>
            </div>
          )}
        </div>

        {/* Month nav */}
        <div className="flex items-center justify-center gap-3 mt-1.5">
          <button
            onClick={() => changeMonth(prevMonth(ym))}
            className="flex items-center justify-center w-9 h-9 rounded-full border-2 border-dashed border-brown/40 bg-yellow/50 text-brown-dark font-heading active:scale-90 transition-transform"
            aria-label="前の月"
          >
            ◀
          </button>
          <span className="font-heading text-lg text-brown-dark min-w-[8rem] text-center">
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

      <BalanceScale supply={supply} spend={spendTotal} />

      <ExchangeList
        hasPremium={hasPremium}
        cart={cart}
        onIncrement={handleIncrement}
        onDecrement={handleDecrement}
      />
    </div>
  );
}
