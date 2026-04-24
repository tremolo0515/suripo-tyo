"use client";

import { useState } from "react";
import { todayStr, formatSP } from "../lib/calc";
import type { Entry } from "../lib/types";

interface Props {
  onAdd: (entry: Omit<Entry, "id">) => void;
}

export default function EarnTab({ onAdd }: Props) {
  const [date, setDate] = useState(todayStr());
  const [score, setScore] = useState(70);
  const [bonus, setBonus] = useState(0);
  const [note, setNote] = useState("");

  const total = score + bonus;

  function handleSubmit() {
    if (total <= 0) return;
    onAdd({
      date,
      type: "earn",
      amount: total,
      label: "スリープ記録",
      note: note || undefined,
    });
    setScore(70);
    setBonus(0);
    setNote("");
    setDate(todayStr());
  }

  return (
    <div className="space-y-4 p-1">
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

      {/* sleep score slider */}
      <label className="block">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-brown-dark font-heading">😴 スリープスコア</span>
          <span className="font-heading text-lg text-purple-800 tabular-nums">{score}</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="w-full"
          style={{
            background: `linear-gradient(to right, #D4C5F9 0%, #D4C5F9 ${score}%, #e8d8c8 ${score}%, #e8d8c8 100%)`,
          }}
        />
        <div className="flex justify-between text-[10px] text-brown/50 mt-1">
          <span>0</span>
          <span>50</span>
          <span>100</span>
        </div>
      </label>

      {/* bonus */}
      <label className="block">
        <span className="text-xs text-brown-dark font-heading mb-1 block">🎁 ボーナスSP</span>
        <input
          type="number"
          min={0}
          value={bonus || ""}
          placeholder="0"
          onChange={(e) => setBonus(Math.max(0, Number(e.target.value) || 0))}
          className="w-full rounded-xl border-2 border-dashed border-brown/50 bg-cream px-3 py-2 text-sm text-brown-dark focus:outline-none focus:border-lavender"
        />
      </label>

      {/* note */}
      <label className="block">
        <span className="text-xs text-brown-dark font-heading mb-1 block">📝 メモ（任意）</span>
        <input
          type="text"
          value={note}
          placeholder="グッドスリープデー"
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-xl border-2 border-dashed border-brown/50 bg-cream px-3 py-2 text-sm text-brown-dark placeholder-brown/30 focus:outline-none focus:border-lavender"
        />
      </label>

      {/* total display */}
      <div className="flex items-center justify-between rounded-xl bg-mint/40 border-2 border-dashed border-mint px-4 py-3">
        <span className="text-xs text-green-800">スコア {score} + ボーナス {bonus} =</span>
        <span className="font-heading text-lg text-green-800 font-bold">
          {formatSP(total)} SP
        </span>
      </div>

      {/* submit */}
      <button
        onClick={handleSubmit}
        disabled={total <= 0}
        className="w-full py-3 rounded-xl font-heading text-base bg-mint border-2 border-dashed border-green-400 text-green-800 disabled:opacity-40 active:scale-95 transition-transform shadow-sm"
      >
        💾 記録する
      </button>
    </div>
  );
}
