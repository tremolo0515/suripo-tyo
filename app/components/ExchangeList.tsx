"use client";

import { NORMAL_ITEMS, PREMIUM_ITEMS } from "../lib/items";
import { formatSP } from "../lib/calc";
import type { ExchangeItem, CartItem } from "../lib/types";

interface Props {
  cart: Map<string, CartItem>;
  onIncrement: (item: ExchangeItem) => void;
  onDecrement: (item: ExchangeItem) => void;
}

interface SectionProps {
  title: string;
  emoji: string;
  items: ExchangeItem[];
  cart: Map<string, CartItem>;
  onIncrement: (item: ExchangeItem) => void;
  onDecrement: (item: ExchangeItem) => void;
}

function ItemRow({ item, qty, onIncrement, onDecrement }: {
  item: ExchangeItem;
  qty: number;
  onIncrement: (item: ExchangeItem) => void;
  onDecrement: (item: ExchangeItem) => void;
}) {
  const isSelected = qty > 0;
  return (
    <div className={`flex items-center gap-1 px-2 py-1 transition-colors ${isSelected ? "bg-lavender/20" : ""}`}>
      <span className={`flex-1 min-w-0 text-[11px] truncate ${isSelected ? "text-purple-800 font-medium" : "text-brown-dark"}`}>
        {item.name}
      </span>
      <div className="flex items-center gap-0.5 shrink-0">
        <button
          onClick={() => onDecrement(item)}
          disabled={qty === 0}
          className="flex items-center justify-center w-6 h-6 rounded-md border border-dashed border-pink/70 bg-pink/20 text-red-600 font-heading text-xs disabled:opacity-25 active:scale-90 transition-transform"
          aria-label="減らす"
        >−</button>
        <span className={`w-5 text-center font-heading text-[11px] tabular-nums ${isSelected ? "text-purple-800" : "text-brown/40"}`}>
          {qty}
        </span>
        <button
          onClick={() => onIncrement(item)}
          disabled={qty >= item.limit}
          className="flex items-center justify-center w-6 h-6 rounded-md border border-dashed border-mint/70 bg-mint/20 text-green-700 font-heading text-xs disabled:opacity-25 active:scale-90 transition-transform"
          aria-label="増やす"
        >＋</button>
      </div>
    </div>
  );
}

function Section({ title, emoji, items, cart, onIncrement, onDecrement }: SectionProps) {
  const sectionTotal = items.reduce((sum, item) => {
    const qty = cart.get(item.name)?.quantity ?? 0;
    return sum + item.sp * qty;
  }, 0);

  return (
    <div>
      <div className="px-3 py-1.5 bg-lavender/30 border-b border-dashed border-brown/20 flex items-center justify-between">
        <span className="font-heading text-[11px] text-purple-800">{emoji} {title}</span>
        {sectionTotal > 0 && (
          <span className="font-heading text-[11px] text-purple-700 tabular-nums">{formatSP(sectionTotal)} SP</span>
        )}
      </div>
      <div className="grid grid-cols-2">
        {items.map((item, i) => (
          <div
            key={item.name}
            className={[
              i % 2 === 1 ? "border-l border-dashed border-brown/15" : "",
              i >= 2 ? "border-t border-dashed border-brown/15" : "",
            ].join(" ")}
          >
            <ItemRow
              item={item}
              qty={cart.get(item.name)?.quantity ?? 0}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ExchangeList({ cart, onIncrement, onDecrement }: Props) {
  return (
    <div className="mx-3 my-2 mb-8">
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className="text-sm">🏪</span>
        <h2 className="font-heading text-base text-brown-dark">交換</h2>
        <div className="flex-1 border-t-2 border-dashed border-brown/40" />
      </div>

      <div className="rounded-2xl border-2 border-dashed border-brown bg-cream shadow-sm overflow-hidden">
        <Section
          title="ノーマル交換所"
          emoji="🏪"
          items={NORMAL_ITEMS}
          cart={cart}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
        />
        <div className="border-t-2 border-dashed border-brown/30" />
        <Section
          title="プレミアム交換所"
          emoji="💎"
          items={PREMIUM_ITEMS}
          cart={cart}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
        />
      </div>
    </div>
  );
}
