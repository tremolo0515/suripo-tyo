"use client";

import { formatSP } from "../lib/calc";

interface Props {
  carryover: number;
  supply: number;
  spend: number;
}

export default function BalanceScale({ carryover, supply, spend }: Props) {
  const total = carryover + supply;
  const remaining = total - spend;
  const isOver = remaining < 0;
  const isEmpty = supply === 0 && spend === 0 && carryover === 0;

  return (
    <div className="mx-3 my-2">
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className="text-sm">✦</span>
        <h2 className="font-heading text-base text-brown-dark">SP残量</h2>
        <div className="flex-1 border-t-2 border-dashed border-brown/40" />
      </div>

      <div className="rounded-2xl border-2 border-dashed border-brown bg-cream shadow-sm px-3 py-3">
        <div className="flex items-stretch gap-1.5">

          {/* ── 今月分（前月繰越 + 今月獲得） ── */}
          <div className="flex-1 bg-green-50 border border-green-200 rounded-xl px-2 py-2 flex flex-col items-center justify-center gap-0.5">
            <span className="text-[10px] text-green-700 font-heading">繰越+今月獲得</span>
            <div className="flex items-center gap-0.5">
              <span className="font-heading text-green-800 text-sm tabular-nums">{formatSP(total)}</span>
              <span className="text-[9px] text-green-600/60">SP</span>
            </div>
          </div>

          <div className="flex items-center text-brown/40 font-heading text-base px-0.5">−</div>

          {/* ── 消費 ── */}
          <div className={`flex-1 border rounded-xl px-2 py-2 flex flex-col items-center justify-center gap-0.5 ${isOver ? "bg-red-50 border-red-300" : "bg-pink-50 border-pink-200"}`}>
            <span className={`text-[10px] font-heading ${isOver ? "text-red-600" : "text-pink-600"}`}>今月消費</span>
            <div className="flex items-center gap-0.5">
              <span className={`font-heading text-sm tabular-nums ${isOver ? "text-red-600" : "text-pink-700"}`}>
                {formatSP(spend)}
              </span>
              <span className="text-[9px] text-pink-500/60">SP</span>
            </div>
          </div>

          <div className="flex items-center text-brown/40 font-heading text-base px-0.5">=</div>

          {/* ── 残量 ── */}
          <div className={`flex-1 border-2 border-dashed rounded-xl px-2 py-2 flex flex-col items-center justify-center gap-0.5 ${
            isEmpty
              ? "bg-cream border-brown/20"
              : isOver
              ? "bg-red-50 border-red-300"
              : "bg-lavender/30 border-purple-300"
          }`}>
            <span className={`text-[10px] font-heading ${isEmpty ? "text-brown/40" : isOver ? "text-red-600" : "text-purple-700"}`}>
              次月繰越
            </span>
            <div className="flex items-center gap-0.5">
              <span className={`font-heading text-sm tabular-nums ${isEmpty ? "text-brown/40" : isOver ? "text-red-600" : "text-purple-700"}`}>
                {isEmpty ? "—" : isOver ? "−" + formatSP(-remaining) : formatSP(remaining)}
              </span>
              <span className="text-[9px] text-purple-500/60">SP</span>
            </div>
            {isOver && <span className="text-[9px] text-red-500">オーバー！</span>}
          </div>

        </div>
      </div>
    </div>
  );
}
