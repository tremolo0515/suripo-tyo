import type { AppData, Entry } from "./types";

const STORAGE_KEY = "suripo-data";

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

export function addEntry(entry: Entry): AppData {
  const data = loadData();
  data.entries.push(entry);
  saveData(data);
  return data;
}
