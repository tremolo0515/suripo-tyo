import type { AppData, Entry, MonthData } from "./types";

const STORAGE_KEY = "suripo-data";
const MONTH_KEY = (ym: string) => `suripo-month-${ym}`;

export function loadData(): AppData {
  if (typeof window === "undefined") return { entries: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { entries: [] };
    return JSON.parse(raw) as AppData;
  } catch {
    return { entries: [] };
  }
}

export function saveData(data: AppData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function loadMonthData(ym: string): MonthData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(MONTH_KEY(ym));
    if (!raw) return null;
    return JSON.parse(raw) as MonthData;
  } catch {
    return null;
  }
}

export function saveMonthData(ym: string, data: MonthData): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(MONTH_KEY(ym), JSON.stringify(data));
}

export function addEntry(entry: Entry): AppData {
  const data = loadData();
  data.entries.push(entry);
  saveData(data);
  return data;
}
