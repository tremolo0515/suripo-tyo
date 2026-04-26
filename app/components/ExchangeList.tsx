"use client";

import { useState } from "react";
import { NORMAL_ITEMS, PREMIUM_ITEMS } from "../lib/items";
import { formatSP } from "../lib/calc";
import type { ExchangeItem, CartItem } from "../lib/types";

interface Props {
  hasPremium: boolean;
  cart: Map<string, CartItem>;
  onIncrement: (item: ExchangeItem) => void;
  onDecrement: (item: ExchangeItem) => void;
}

function ItemRow({ item, qty, locked, onIncrement, onDecrement }: {
  item: ExchangeItem;
  qty: number;
  locked?: boolean;
  onIncrement: (item: ExchangeItem) => void;
  onDecrement: (item: ExchangeItem) => void;
}) {
  const isSelected = qty > 0;
  return (
    <div className={`flex items-center gap-1 px-2 py-1 transition-colors ${isSelected ? "bg-lavender/20" : ""}`}>
      <span className={`flex-1 min-w-0 truncate ${item.name.length > 9 ? "text-[9px]" : "text-[11px]"} ${isSelected ? "text-purple-800 font-medium" : "text-brown-dark"}`}>
        {item.name}
      </span>
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={() => onDecrement(item)}
          disabled={qty === 0 || locked}
          className={`flex items-center justify-center w-6 h-6 rounded-md border border-dashed font-heading text-xs disabled:opacity-25 active:scale-90 transition-transform ${locked ? "border-gray-400 bg-gray-200 text-gray-500" : "border-pink/70 bg-pink/20 text-red-600"}`}
          aria-label="減らす"
        >−</button>
        <span className={`w-5 text-center font-heading text-[11px] tabular-nums ${isSelected ? "text-purple-800" : "text-brown/40"}`}>
          {qty}
        </span>
        <button
          onClick={() => onIncrement(item)}
          disabled={qty >= item.limit || locked}
          className={`flex items-center justify-center w-6 h-6 rounded-md border border-dashed font-heading text-xs disabled:opacity-25 active:scale-90 transition-transform ${locked ? "border-gray-400 bg-gray-200 text-gray-500" : "border-mint/70 bg-mint/20 text-green-700"}`}
          aria-label="増やす"
        >＋</button>
      </div>
    </div>
  );
}

function ItemGrid({ items, cart, locked, onIncrement, onDecrement }: {
  items: ExchangeItem[];
  cart: Map<string, CartItem>;
  locked?: boolean;
  onIncrement: (item: ExchangeItem) => void;
  onDecrement: (item: ExchangeItem) => void;
}) {
  return (
    <div className="relative">
      <div className="grid grid-cols-2">
        {items.map((item, i) => (
          <div
            key={item.id}
            className={[
              i % 2 === 1 ? "border-l border-dashed border-brown/15" : "",
              i >= 2 ? "border-t border-dashed border-brown/15" : "",
            ].join(" ")}
          >
            <ItemRow
              item={item}
              qty={cart.get(item.id)?.quantity ?? 0}
              locked={locked}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
            />
          </div>
        ))}
      </div>
      {locked && (
        <div className="absolute inset-0 bg-gray-400/30 pointer-events-auto" aria-hidden />
      )}
    </div>
  );
}

export default function ExchangeList({ hasPremium, cart, onIncrement, onDecrement }: Props) {
  const [tab, setTab] = useState<"normal" | "premium">("normal");

  const normalTotal = NORMAL_ITEMS.reduce((s, item) => s + item.sp * (cart.get(item.id)?.quantity ?? 0), 0);
  const premiumTotal = PREMIUM_ITEMS.reduce((s, item) => s + item.sp * (cart.get(item.id)?.quantity ?? 0), 0);

  return (
    <div className="mx-3 my-2 mb-8">
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className="text-sm">🏪</span>
        <h2 className="font-heading text-base text-brown-dark">交換</h2>
        <div className="flex-1 border-t-2 border-dashed border-brown/40" />
      </div>

      <div className="rounded-2xl border-2 border-dashed border-brown bg-cream shadow-sm overflow-hidden">
        {/* タブ */}
        <div className="flex border-b-2 border-dashed border-brown/30">
          <button
            onClick={() => setTab("normal")}
            className={[
              "flex-1 flex items-center justify-center gap-1.5 py-2 font-heading text-xs transition-colors",
              tab === "normal"
                ? "bg-cream text-brown-dark border-b-2 border-brown -mb-0.5"
                : "bg-brown/5 text-brown/50",
            ].join(" ")}
          >
            <span>🏪</span>
            <span>ノーマル</span>
            {normalTotal > 0 && (
              <span className="text-[10px] text-purple-600 tabular-nums">{formatSP(normalTotal)}SP</span>
            )}
          </button>
          <div className="w-px bg-brown/20" />
          <button
            onClick={() => setTab("premium")}
            className={[
              "flex-1 flex items-center justify-center gap-1.5 py-2 font-heading text-xs transition-colors",
              tab === "premium"
                ? "bg-cream text-brown-dark border-b-2 border-brown -mb-0.5"
                : "bg-brown/5 text-brown/50",
            ].join(" ")}
          >
            <span>💎</span>
            <span>プレミアム</span>
            {premiumTotal > 0 && (
              <span className="text-[10px] text-purple-600 tabular-nums">{formatSP(premiumTotal)}SP</span>
            )}
            {!hasPremium && <span className="text-[9px] text-brown/40">🔒</span>}
          </button>
        </div>

        {/* コンテンツ */}
        {tab === "normal" ? (
          <ItemGrid
            items={NORMAL_ITEMS}
            cart={cart}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
        ) : (
          <ItemGrid
            items={PREMIUM_ITEMS}
            cart={cart}
            locked={!hasPremium}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
        )}
      </div>
    </div>
  );
}
