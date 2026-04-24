import type { Entry } from "./types";

export interface LedgerRow extends Entry {
  balance: number;
}

export function prevMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return m === 1
    ? `${y - 1}-12`
    : `${y}-${String(m - 1).padStart(2, "0")}`;
}

export function nextMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return m === 12
    ? `${y + 1}-01`
    : `${y}-${String(m + 1).padStart(2, "0")}`;
}

export function formatYearMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return `${y}年 ${m}月`;
}

export function todayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function currentYearMonth(): string {
  return todayStr().slice(0, 7);
}

export function getMonthEntries(entries: Entry[], yearMonth: string): Entry[] {
  return entries
    .filter((e) => e.date.startsWith(yearMonth))
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function getCarryOver(entries: Entry[], yearMonth: string): number {
  return entries
    .filter((e) => e.date.slice(0, 7) < yearMonth)
    .reduce((sum, e) => sum + (e.type === "earn" ? e.amount : -e.amount), 0);
}

export function buildLedger(
  entries: Entry[],
  yearMonth: string
): { carryOver: number; rows: LedgerRow[]; finalBalance: number } {
  const carryOver = getCarryOver(entries, yearMonth);
  const monthEntries = getMonthEntries(entries, yearMonth);

  let balance = carryOver;
  const rows: LedgerRow[] = monthEntries.map((e) => {
    balance += e.type === "earn" ? e.amount : -e.amount;
    return { ...e, balance };
  });

  return { carryOver, rows, finalBalance: balance };
}

export function getCurrentBalance(entries: Entry[], yearMonth: string): number {
  return buildLedger(entries, yearMonth).finalBalance;
}

export function formatSP(n: number): string {
  return n.toLocaleString("ja-JP");
}

export function formatDate(dateStr: string): string {
  const [, m, d] = dateStr.split("-");
  return `${Number(m)}/${Number(d)}`;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

export function daysInMonth(ym: string): number {
  const [y, m] = ym.split("-").map(Number);
  return new Date(y, m, 0).getDate();
}

// SP income model (source: Pokémon Sleep wiki)
//   Without premium: 100pt/day + 2,000pt Good Sleep Day bonus → 5,000pt/30days
//   With premium:    200pt/day + 1,000pt continuation bonus + 2,000pt Good Sleep Day → 9,000pt/30days
export const DAILY_SP_NORMAL = 100;
export const DAILY_SP_PREMIUM = 200;
export const GOOD_SLEEP_BONUS = 2000;
export const PREMIUM_CONTINUATION_BONUS = 1000;

export function theoreticalSP(hasPremium: boolean, days: number): number {
  const daily = hasPremium ? DAILY_SP_PREMIUM : DAILY_SP_NORMAL;
  const fixed = GOOD_SLEEP_BONUS + (hasPremium ? PREMIUM_CONTINUATION_BONUS : 0);
  return daily * days + fixed;
}
