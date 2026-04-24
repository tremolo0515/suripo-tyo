"use client";

import { useState } from "react";
import EarnTab from "./EarnTab";
import SpendTab from "./SpendTab";
import type { Entry } from "../lib/types";

interface Props {
  onAdd: (entry: Omit<Entry, "id">) => void;
}

export default function InputForm({ onAdd }: Props) {
  const [activeTab, setActiveTab] = useState<"earn" | "spend">("earn");

  return (
    <section className="mx-3 my-2 mb-8">
      {/* section header */}
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className="font-heading text-sm text-brown">✏️</span>
        <h2 className="font-heading text-base text-brown-dark">記録する</h2>
        <div className="flex-1 border-t-2 border-dashed border-brown/40" />
      </div>

      <div className="rounded-2xl border-2 border-dashed border-brown bg-cream shadow-sm overflow-hidden">
        {/* tab bar */}
        <div className="flex border-b-2 border-dashed border-brown/30">
          {(["earn", "spend"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={[
                "flex-1 py-3 font-heading text-sm transition-colors",
                activeTab === tab
                  ? tab === "earn"
                    ? "bg-mint/60 text-green-800 border-b-2 border-green-400"
                    : "bg-pink/60 text-red-700 border-b-2 border-red-300"
                  : "text-brown/60 hover:bg-brown/5",
              ].join(" ")}
            >
              {tab === "earn" ? "📥 獲得" : "📤 消費"}
            </button>
          ))}
        </div>

        {/* tab content */}
        <div className="p-3">
          {activeTab === "earn" ? (
            <EarnTab onAdd={onAdd} />
          ) : (
            <SpendTab onAdd={onAdd} />
          )}
        </div>
      </div>
    </section>
  );
}
