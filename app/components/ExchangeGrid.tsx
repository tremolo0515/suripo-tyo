"use client";

import type { ExchangeItem, CartItem } from "../lib/types";
import { formatSP } from "../lib/calc";

interface Props {
  items: ExchangeItem[];
  cart: Map<string, CartItem>;
  onTap: (item: ExchangeItem) => void;
}

export default function ExchangeGrid({ items, cart, onTap }: Props) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => {
        const cartItem = cart.get(item.name);
        const qty = cartItem?.quantity ?? 0;
        const atLimit = qty >= item.limit;

        return (
          <button
            key={item.name}
            onClick={() => onTap(item)}
            className={[
              "relative flex flex-col items-start gap-1 rounded-xl p-3 text-left transition-all active:scale-95",
              "border-2 border-dashed",
              qty > 0
                ? "border-lavender bg-lavender/30 shadow-sm"
                : "border-brown/40 bg-cream hover:bg-lavender/10",
              atLimit ? "opacity-70" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span className="text-xs leading-snug text-brown-dark font-medium pr-5">
              {item.name}
            </span>
            <span className="font-heading text-sm text-purple-700">
              {formatSP(item.sp)} SP
            </span>
            <span className="text-[10px] text-brown/50">
              上限 {item.limit}個
            </span>

            {qty > 0 && (
              <span className="absolute top-1.5 right-1.5 flex items-center justify-center w-6 h-6 rounded-full bg-lavender text-purple-800 font-heading text-xs font-bold border border-purple-300 shadow-sm">
                {qty}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
