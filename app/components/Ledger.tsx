"use client";

import { formatSP, formatDate } from "../lib/calc";
import type { LedgerRow } from "../lib/calc";

interface Props {
  rows: LedgerRow[];
  carryOver: number;
  finalBalance: number;
  highlightId: string | null;
}

export default function Ledger({ rows, carryOver, finalBalance, highlightId }: Props) {
  return (
    <section id="ledger-section" className="mx-3 my-2">
      {/* section header */}
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className="text-brown font-heading text-sm">📒</span>
        <h2 className="font-heading text-base text-brown-dark">出納帳</h2>
        <div className="flex-1 border-t-2 border-dashed border-brown/40" />
      </div>

      <div className="rounded-2xl border-2 border-dashed border-brown overflow-hidden shadow-sm">
        {/* table header */}
        <div
          className="grid text-white text-xs font-heading"
          style={{
            backgroundColor: "#C8A96E",
            gridTemplateColumns: "3rem 1fr 4.5rem 4.5rem 4.5rem",
          }}
        >
          <div className="px-1 py-2 text-center border-r border-white/30">日付</div>
          <div className="px-2 py-2 border-r border-white/30">内容</div>
          <div className="px-1 py-2 text-right border-r border-white/30">収入(+)</div>
          <div className="px-1 py-2 text-right border-r border-white/30">支出(−)</div>
          <div className="px-1 py-2 text-right">残高</div>
        </div>

        {/* carry-over row */}
        <Row
          date=""
          label="前月繰越"
          earn={null}
          spend={null}
          balance={carryOver}
          highlight={false}
          isSpecial
        />

        {rows.length === 0 ? (
          <div className="py-10 text-center text-brown/60 font-heading text-sm bg-cream">
            まだ記録がないよ ☽
          </div>
        ) : (
          rows.map((row) => (
            <Row
              key={row.id}
              date={formatDate(row.date)}
              label={row.note ? `${row.label}（${row.note}）` : row.label}
              earn={row.type === "earn" ? row.amount : null}
              spend={row.type === "spend" ? row.amount : null}
              balance={row.balance}
              highlight={row.id === highlightId}
              isSpecial={false}
              type={row.type}
            />
          ))
        )}

        {/* carry-forward row */}
        <Row
          date=""
          label="翌月繰越"
          earn={null}
          spend={null}
          balance={finalBalance}
          highlight={false}
          isSpecial
          isFinal
        />
      </div>
    </section>
  );
}

interface RowProps {
  date: string;
  label: string;
  earn: number | null;
  spend: number | null;
  balance: number;
  highlight: boolean;
  isSpecial: boolean;
  isFinal?: boolean;
  type?: "earn" | "spend";
}

function Row({ date, label, earn, spend, balance, highlight, isSpecial, isFinal, type }: RowProps) {
  const rowBg = isSpecial
    ? "bg-yellow/50"
    : type === "earn"
    ? "bg-mint/40"
    : "bg-pink/40";

  return (
    <div
      className={[
        "grid text-xs border-t border-dashed border-brown/30",
        rowBg,
        highlight ? "animate-flash" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ gridTemplateColumns: "3rem 1fr 4.5rem 4.5rem 4.5rem" }}
    >
      <div className="px-1 py-2 text-center border-r border-dashed border-brown/20 text-brown/70 leading-tight">
        {date}
      </div>
      <div className={`px-2 py-2 border-r border-dashed border-brown/20 leading-tight ${isFinal ? "font-bold text-brown-dark" : ""}`}>
        {label}
      </div>
      <div className="px-1 py-2 text-right border-r border-dashed border-brown/20 text-green-700 font-heading">
        {earn !== null ? formatSP(earn) : ""}
      </div>
      <div className="px-1 py-2 text-right border-r border-dashed border-brown/20 text-red-500 font-heading">
        {spend !== null ? formatSP(spend) : ""}
      </div>
      <div className={`px-1 py-2 text-right font-heading ${isFinal ? "font-bold text-purple-800" : "text-brown-dark"}`}>
        {formatSP(balance)}
      </div>
    </div>
  );
}
