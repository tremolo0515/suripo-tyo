export type EntryType = "earn" | "spend";

export interface Entry {
  id: string;
  date: string;
  type: EntryType;
  amount: number;
  label: string;
  note?: string;
}

export interface AppData {
  entries: Entry[];
}

export interface MonthData {
  supply: number;
  spend: number;
  carryover: number;
}

export interface ExchangeItem {
  id: string;
  name: string;
  sp: number;
  limit: number;
}

export interface CartItem extends ExchangeItem {
  quantity: number;
}
