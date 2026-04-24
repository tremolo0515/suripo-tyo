import type { ExchangeItem } from "./types";

// Sorted by wiki priority: ◎ → ◯ → △ → ×
export const NORMAL_ITEMS: ExchangeItem[] = [
  { name: "フィールドいどうチケット", sp: 100, limit: 1 },   // ◎
  { name: "ポケサブレ", sp: 150, limit: 30 },                // ◯
  { name: "メインスキルのたね", sp: 3600, limit: 1 },        // ◯
  { name: "EXチケット", sp: 200, limit: 3 },                 // ◯
  { name: "かみなりのいし", sp: 1400, limit: 5 },            // ◯
  { name: "ひかりのいし", sp: 1400, limit: 5 },              // ◯
  { name: "やみのいし", sp: 1400, limit: 5 },                // ◯ 他入手手段なし
  { name: "おうじゃのしるし", sp: 1400, limit: 5 },          // ◯ 他入手手段なし
  { name: "メタルコート", sp: 1400, limit: 5 },              // ◯ 他入手手段なし
  { name: "めざめいし", sp: 1400, limit: 5 },                // ◯ 他入手手段なし
  { name: "するどいツメ", sp: 1400, limit: 5 },              // ◯ 他入手手段なし
  { name: "まんまるいし", sp: 1400, limit: 5 },              // ◯ 他入手手段なし
  { name: "マスターサブレ", sp: 4000, limit: 1 },            // △
  { name: "おてつだいホイッスル", sp: 800, limit: 3 },       // △
  { name: "食材チケットM", sp: 600, limit: 3 },              // △
  { name: "ばんのうアメS", sp: 140, limit: 15 },             // △
  { name: "ほのおのいし", sp: 1400, limit: 5 },              // △
  { name: "みずのいし", sp: 1400, limit: 5 },                // △
  { name: "リーフのいし", sp: 1400, limit: 5 },              // △
  { name: "こおりのいし", sp: 1400, limit: 5 },              // △
  { name: "つきのいし", sp: 1400, limit: 5 },                // △
  { name: "かいふくのおこう", sp: 400, limit: 3 },           // ×
  { name: "げんきマクラ", sp: 240, limit: 3 },               // ×
  { name: "食材チケットS", sp: 200, limit: 5 },              // ×
  { name: "つながりのヒモ", sp: 1400, limit: 5 },            // ×
];

// Sorted by wiki priority: ◎ → ◯ → △
export const PREMIUM_ITEMS: ExchangeItem[] = [
  { name: "メインスキルのたね", sp: 1800, limit: 1 },   // ◎
  { name: "サブスキルのたね", sp: 1400, limit: 1 },     // ◎
  { name: "ポケサブレ", sp: 100, limit: 10 },            // ◎
  { name: "スーパーサブレ", sp: 400, limit: 5 },         // ◎
  { name: "ばんのうアメM", sp: 500, limit: 3 },          // ◯
  { name: "EXチケット", sp: 100, limit: 1 },             // ◯
  { name: "ゆめのかたまりM", sp: 600, limit: 1 },        // △
  { name: "食材チケットM", sp: 300, limit: 3 },          // △
];
