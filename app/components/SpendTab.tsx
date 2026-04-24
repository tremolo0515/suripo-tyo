"use client";

import { useState } from "react";
import { todayStr, formatSP } from "../lib/calc";
import { NORMAL_ITEMS, PREMIUM_ITEMS } from "../lib/items";
import type { ExchangeItem, CartItem, Entry } from "../lib/types";
import ExchangeGrid from "./ExchangeGrid";
import CartSummary from "./CartSummary";

interface Props {
  onAdd: (entry: Omit<Entry, "id">) => void;
}

export default function SpendTab({ onAdd }: Props) {
  const [exchangeType, setExchangeType] = useState<"normal" | "premium">("normal");
  const [cart, setCart] = useState<Map<string, CartItem>>(new Map());
  const [date, setDate] = useState(todayStr());

  const items = exchangeType === "normal" ? NORMAL_ITEMS : PREMIUM_ITEMS;
  const cartTotal = [...cart.values()].reduce((s, c) => s + c.sp * c.quantity, 0);
  const isEmpty = cartTotal === 0;

  function handleTap(item: ExchangeItem) {
    setCart((prev) => {
      const next = new Map(prev);
      const existing = next.get(item.name);
      const qty = existing?.quantity ?? 0;
      if (qty < item.limit) {
        next.set(item.name, { ...item, quantity: qty + 1 });
      } else {
        next.delete(item.name);
      }
      return next;
    });
  }

  function handleSwitchExchange(type: "normal" | "premium") {
    setExchangeType(type);
    setCart(new Map());
  }

  function handleSubmit() {
    if (isEmpty) return;
    const cartItems = [...cart.values()].filter((c) => c.quantity > 0);
    const label = cartItems.map((c) => (c.quantity > 1 ? `${c.name}×${c.quantity}` : c.name)).join("、");
    onAdd({
      date,
      type: "spend",
      amount: cartTotal,
      label,
    });
    setCart(new Map());
    setDate(todayStr());
  }

  return (
    <div className="space-y-4 p-1">
      {/* exchange type toggle */}
      <div className="flex gap-2 p-1 rounded-xl bg-brown/10 border border-dashed border-brown/30">
        {(["normal", "premium"] as const).map((t) => (
          <button
            key={t}
            onClick={() => handleSwitchExchange(t)}
            className={[
              "flex-1 py-2 rounded-lg text-xs font-heading transition-all",
              exchangeType === t
                ? "bg-lavender text-purple-800 shadow-sm"
                : "text-brown/70 hover:bg-lavender/20",
            ].join(" ")}
          >
            {t === "normal" ? "🏪 ノーマル交換所" : "💎 プレミアム交換所"}
          </button>
        ))}
      </div>

      {/* item grid */}
      <ExchangeGrid items={items} cart={cart} onTap={handleTap} />

      {/* cart summary */}
      <CartSummary cart={cart} />

      {/* date */}
      <label className="block">
        <span className="text-xs text-brown-dark font-heading mb-1 block">📅 日付</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-xl border-2 border-dashed border-brown/50 bg-cream px-3 py-2 text-sm text-brown-dark focus:outline-none focus:border-lavender"
        />
      </label>

      {/* submit */}
      <button
        onClick={handleSubmit}
        disabled={isEmpty}
        className="w-full py-3 rounded-xl font-heading text-base bg-pink border-2 border-dashed border-pink/80 text-red-700 disabled:opacity-40 active:scale-95 transition-transform shadow-sm"
      >
        📤 消費を記録 {!isEmpty && `（${formatSP(cartTotal)} SP）`}
      </button>
    </div>
  );
}
