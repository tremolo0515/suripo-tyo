"use client";

import { formatSP } from "../lib/calc";

interface Props {
  supply: number;
  spend: number;
}

export default function BalanceScale({ supply, spend }: Props) {
  const angle =
    supply > 0
      ? Math.max(-15, Math.min(22, (spend / supply - 0.5) * 40))
      : spend > 0
      ? 22
      : -10;

  const isOver = spend > supply;
  const remaining = supply - spend;

  const px = 150;
  const py = 62;

  return (
    <div className="mx-3 my-2">
      <div className="flex items-center gap-2 mb-2 px-1">
        <span className="text-sm">⚖️</span>
        <h2 className="font-heading text-base text-brown-dark">SP残量</h2>
        <div className="flex-1 border-t-2 border-dashed border-brown/40" />
      </div>

      <div className="rounded-2xl border-2 border-dashed border-brown bg-cream shadow-sm px-3 pt-3 pb-4">
        <svg
          viewBox="0 0 300 138"
          className="w-full"
          style={{ overflow: "visible", maxHeight: 160 }}
          aria-hidden
        >
          <rect x={px - 2} y={py} width={4} height={34} rx={2} fill="#A0784A" />
          <polygon
            points={`${px},${py + 34} ${px - 14},${py + 58} ${px + 14},${py + 58}`}
            fill="#C8A96E"
          />
          <ellipse cx={px} cy={py + 59} rx={18} ry={4} fill="#A0784A" opacity={0.25} />

          <g
            style={{
              transform: `rotate(${angle}deg)`,
              transformOrigin: `${px}px ${py}px`,
              transition: "transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
          >
            <rect x={44} y={py - 4} width={212} height={8} rx={4} fill="#C8A96E" />
            <circle cx={px} cy={py} r={7} fill="#A0784A" />
            <circle cx={46} cy={py} r={5} fill="#A0784A" />
            <circle cx={254} cy={py} r={5} fill="#A0784A" />

            <line x1={36} y1={py + 4} x2={24} y2={py + 50} stroke="#A0784A" strokeWidth={1.5} />
            <line x1={56} y1={py + 4} x2={68} y2={py + 50} stroke="#A0784A" strokeWidth={1.5} />

            <path
              d={`M ${46 - 30},${py + 52} Q ${46},${py + 70} ${46 + 30},${py + 52}`}
              fill="none"
              stroke="#5cc8a0"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            <ellipse cx={46} cy={py + 52} rx={30} ry={8} fill="#B2EBD9" stroke="#5cc8a0" strokeWidth={2} />

            <line x1={244} y1={py + 4} x2={232} y2={py + 50} stroke="#A0784A" strokeWidth={1.5} />
            <line x1={264} y1={py + 4} x2={276} y2={py + 50} stroke="#A0784A" strokeWidth={1.5} />

            <path
              d={`M ${254 - 30},${py + 52} Q ${254},${py + 70} ${254 + 30},${py + 52}`}
              fill="none"
              stroke={isOver ? "#ff6666" : "#ffb3c6"}
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            <ellipse
              cx={254}
              cy={py + 52}
              rx={30}
              ry={8}
              fill={isOver ? "#ffb3b3" : "#FFD6E0"}
              stroke={isOver ? "#ff6666" : "#ffb3c6"}
              strokeWidth={2}
            />
          </g>
        </svg>

        <div className="flex items-end justify-between px-2 -mt-1">
          <div className="flex flex-col items-center gap-0.5">
            <span className="text-[10px] text-green-700 font-heading">💚 収入</span>
            <span className="font-heading text-base text-green-800 tabular-nums">
              {formatSP(supply)} SP
            </span>
          </div>

          <div
            className={`font-heading text-xs text-center px-2 py-1 rounded-xl border border-dashed transition-colors ${
              supply === 0 && spend === 0
                ? "text-brown/50 border-brown/20"
                : isOver
                ? "text-red-600 border-red-300 bg-red-50"
                : "text-purple-700 border-lavender bg-lavender/20"
            }`}
          >
            {supply === 0 && spend === 0 ? (
              "☽ アイテムを選ぼう"
            ) : isOver ? (
              <>⚠️ {formatSP(spend - supply)} SP<br />オーバー！</>
            ) : (
              <>✦ 残り<br />{formatSP(remaining)} SP</>
            )}
          </div>

          <div className="flex flex-col items-center gap-0.5">
            <span
              className={`text-[10px] font-heading ${
                isOver ? "text-red-600" : "text-red-400"
              }`}
            >
              🩷 消費
            </span>
            <span
              className={`font-heading text-base tabular-nums ${
                isOver ? "text-red-600" : "text-red-500"
              }`}
            >
              {formatSP(spend)} SP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
