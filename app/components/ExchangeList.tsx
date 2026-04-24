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
    <div className={`flex items-center gap-2 px-3 py-1 transition-colors ${isSelected ? "bg-lavender/20" : ""}`}>
      <div className="flex-1 min-w-0 flex items-center gap-1.5">
        <span className={`text-xs truncate ${isSelected ? "text-purple-800 font-medium" : "text-brown-dark"}`}>
          {item.name}
        </span>
        <span className="text-[10px] font-heading shrink-0 tabular-nums text-purple-600">
          {isSelected ? `→ ${formatSP(item.sp * qty)} SP` : `${formatSP(item.sp)} SP`}
        </span>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onDecrement(item)}
          disabled={qty === 0}
          className="flex items-center justify-center w-7 h-7 rounded-lg border-2 border-dashed border-pink/70 bg-pink/20 text-red-600 font-heading text-sm disabled:opacity-25 active:scale-90 transition-transform"
          aria-label="減らす"
        >−</button>
        <span className={`w-6 text-center font-heading text-sm tabular-nums ${isSelected ? "text-purple-800" : "text-brown/40"}`}>
          {qty}
        </span>
        <button
          onClick={() => onIncrement(item)}
          disabled={qty >= item.limit}
          className="flex items-center justify-center w-7 h-7 rounded-lg border-2 border-dashed border-mint/70 bg-mint/20 text-green-700 font-heading text-sm disabled:opacity-25 active:scale-90 transition-transform"
          aria-label="増やす"
        >＋</button>
      </div>
    </div>
  );
}

function Section({ title, items, cart, onIncrement, onDecrement }: SectionProps) {
  return (
    <div>
      <div className="px-3 py-1.5 bg-lavender/30 border-b border-dashed border-brown/20">
        <span className="font-heading text-[11px] text-purple-800">{title}</span>
      </div>
      {items.map((item, i) => (
        <div key={item.name} className={i > 0 ? "border-t border-dashed border-brown/15" : ""}>
          <ItemRow
            item={item}
            qty={cart.get(item.name)?.quantity ?? 0}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
          />
        </div>
      ))}
    </div>
  );
}

export default function ExchangeList({ cart, onIncrement, onDecrement }: Props) {
  return (
    <div className="mx-3 my-2 mb-8">
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className="text-sm">🏪</span>
        <h2 className="font-heading text-base text-brown-dark">交換する</h2>
        <div className="flex-1 border-t-2 border-dashed border-brown/40" />
      </div>

      <div className="rounded-2xl border-2 border-dashed border-brown bg-cream shadow-sm overflow-hidden">
        <Section
          title="🏪 ノーマル交換所"
          items={NORMAL_ITEMS}
          cart={cart}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
        />
        <div className="border-t-2 border-dashed border-brown/30" />
        <Section
          title="💎 プレミアム交換所"
          items={PREMIUM_ITEMS}
          cart={cart}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
        />
      </div>
    </div>
  );
}
