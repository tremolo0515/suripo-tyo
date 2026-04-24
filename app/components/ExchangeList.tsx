"use client";

import { useState } from "react";
import { NORMAL_ITEMS, PREMIUM_ITEMS } from "../lib/items";
import { formatSP } from "../lib/calc";
import type { ExchangeItem, CartItem } from "../lib/types";

interface Props {
  cart: Map<string, CartItem>;
  onIncrement: (item: ExchangeItem) => void;
  onDecrement: (item: ExchangeItem) => void;
}

export default function ExchangeList({ cart, onIncrement, onDecrement }: Props) {
  const [tab, setTab] = useState<"normal" | "premium">("normal");
  const items = tab === "normal" ? NORMAL_ITEMS : PREMIUM_ITEMS;

  return (
    <div className="mx-3 my-2 mb-8">
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className="text-sm">🏪</span>
        <h2 className="font-heading text-base text-brown-dark">交換する</h2>
        <div className="flex-1 border-t-2 border-dashed border-brown/40" />
      </div>

      <div className="rounded-2xl border-2 border-dashed border-brown bg-cream shadow-sm overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b-2 border-dashed border-brown/30">
          {(["normal", "premium"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={[
                "flex-1 py-3 font-heading text-xs transition-colors",
                tab === t
                  ? "bg-lavender/60 text-purple-800 border-b-2 border-purple-400"
                  : "text-brown/60 hover:bg-lavender/10",
              ].join(" ")}
            >
              {t === "normal" ? "🏪 ノーマル交換所" : "💎 プレミアム交換所"}
            </button>
          ))}
        </div>

        {/* Item list */}
        <div>
          {items.map((item, i) => {
            const qty = cart.get(item.name)?.quantity ?? 0;
            const isSelected = qty > 0;

            return (
              <div
                key={item.name}
                className={[
                  "flex items-center gap-2 px-3 py-3",
                  i > 0 ? "border-t border-dashed border-brown/20" : "",
                  isSelected ? "bg-lavender/20" : "",
                  "transition-colors",
                ].join(" ")}
              >
                {/* Item info */}
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-snug truncate ${isSelected ? "text-purple-800 font-medium" : "text-brown-dark"}`}>
                    {item.name}
                  </p>
                  <p className="text-[10px] text-brown/50 mt-0.5">
                    上限 {item.limit}個
                    {qty > 0 && (
                      <span className="ml-1 text-purple-600 font-heading">
                        → {formatSP(item.sp * qty)} SP
                      </span>
                    )}
                  </p>
                </div>

                {/* SP cost */}
                <span className="font-heading text-xs text-purple-700 w-[4.5rem] text-right shrink-0">
                  {formatSP(item.sp)} SP
                </span>

                {/* Qty controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onDecrement(item)}
                    disabled={qty === 0}
                    className="flex items-center justify-center w-8 h-8 rounded-lg border-2 border-dashed border-pink/70 bg-pink/20 text-red-600 font-heading text-base disabled:opacity-25 active:scale-90 transition-transform"
                    aria-label="減らす"
                  >
                    −
                  </button>
                  <span
                    className={`w-7 text-center font-heading text-sm tabular-nums ${
                      isSelected ? "text-purple-800" : "text-brown/50"
                    }`}
                  >
                    {qty}
                  </span>
                  <button
                    onClick={() => onIncrement(item)}
                    disabled={qty >= item.limit}
                    className="flex items-center justify-center w-8 h-8 rounded-lg border-2 border-dashed border-mint/70 bg-mint/20 text-green-700 font-heading text-base disabled:opacity-25 active:scale-90 transition-transform"
                    aria-label="増やす"
                  >
                    ＋
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
