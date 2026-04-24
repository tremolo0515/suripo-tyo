"use client";

import type { CartItem } from "../lib/types";
import { formatSP } from "../lib/calc";

interface Props {
  cart: Map<string, CartItem>;
}

export default function CartSummary({ cart }: Props) {
  const items = [...cart.values()].filter((c) => c.quantity > 0);
  if (items.length === 0) return null;

  const total = items.reduce((sum, c) => sum + c.sp * c.quantity, 0);

  return (
    <div className="rounded-xl border-2 border-dashed border-lavender bg-lavender/20 p-3 space-y-1">
      <p className="font-heading text-xs text-purple-700 mb-2">🛒 消費カート</p>
      {items.map((c) => (
        <div key={c.name} className="flex justify-between text-xs text-brown-dark">
          <span>{c.name} × {c.quantity}</span>
          <span className="font-heading">{formatSP(c.sp * c.quantity)} SP</span>
        </div>
      ))}
      <div className="border-t border-dashed border-lavender/60 pt-1 mt-1 flex justify-between items-center">
        <span className="text-xs text-purple-700">合計</span>
        <span className="font-heading text-base text-purple-900 font-bold">
          {formatSP(total)} SP
        </span>
      </div>
    </div>
  );
}
