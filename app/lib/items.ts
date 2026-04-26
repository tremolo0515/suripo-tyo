import type { ExchangeItem } from "./types";

// Sorted by wiki priority: ◎ → ◯ → △ → ×
export const NORMAL_ITEMS: ExchangeItem[] = [
  { id: "n:フィールドいどうチケット", name: "フィールドいどうチケット", sp: 100, limit: 1 },   // ◎
  { id: "n:マスターサブレ", name: "マスターサブレ", sp: 4000, limit: 1 },            // △
  { id: "n:ポケサブレ", name: "ポケサブレ", sp: 150, limit: 30 },                // ◯
  { id: "n:メインスキルのたね", name: "メインスキルのたね", sp: 3600, limit: 1 },        // ◯
  { id: "n:EXチケット", name: "EXチケット", sp: 200, limit: 3 },                 // ◯
  { id: "n:かみなりのいし", name: "かみなりのいし", sp: 1400, limit: 5 },            // ◯
  { id: "n:ひかりのいし", name: "ひかりのいし", sp: 1400, limit: 5 },              // ◯
  { id: "n:やみのいし", name: "やみのいし", sp: 1400, limit: 5 },                // ◯ 他入手手段なし
  { id: "n:おうじゃのしるし", name: "おうじゃのしるし", sp: 1400, limit: 5 },          // ◯ 他入手手段なし
  { id: "n:メタルコート", name: "メタルコート", sp: 1400, limit: 5 },              // ◯ 他入手手段なし
  { id: "n:めざめいし", name: "めざめいし", sp: 1400, limit: 5 },                // ◯ 他入手手段なし
  { id: "n:するどいツメ", name: "するどいツメ", sp: 1400, limit: 5 },              // ◯ 他入手手段なし
  { id: "n:まんまるいし", name: "まんまるいし", sp: 1400, limit: 5 },              // ◯ 他入手手段なし
  { id: "n:おてつだいホイッスル", name: "おてつだいホイッスル", sp: 800, limit: 3 },       // △
  { id: "n:食材チケットM", name: "食材チケットM", sp: 600, limit: 3 },              // △
  { id: "n:ばんのうアメS", name: "ばんのうアメS", sp: 140, limit: 15 },             // △
  { id: "n:ほのおのいし", name: "ほのおのいし", sp: 1400, limit: 5 },              // △
  { id: "n:みずのいし", name: "みずのいし", sp: 1400, limit: 5 },                // △
  { id: "n:リーフのいし", name: "リーフのいし", sp: 1400, limit: 5 },              // △
  { id: "n:こおりのいし", name: "こおりのいし", sp: 1400, limit: 5 },              // △
  { id: "n:つきのいし", name: "つきのいし", sp: 1400, limit: 5 },                // △
  { id: "n:かいふくのおこう", name: "かいふくのおこう", sp: 400, limit: 3 },           // ×
  { id: "n:げんきマクラ", name: "げんきマクラ", sp: 240, limit: 3 },               // ×
  { id: "n:食材チケットS", name: "食材チケットS", sp: 200, limit: 5 },              // ×
  { id: "n:つながりのヒモ", name: "つながりのヒモ", sp: 1400, limit: 5 },            // ×
];

// Sorted by wiki priority: ◎ → ◯ → △
export const PREMIUM_ITEMS: ExchangeItem[] = [
  { id: "p:メインスキルのたね", name: "メインスキルのたね", sp: 1800, limit: 1 },   // ◎
  { id: "p:サブスキルのたね", name: "サブスキルのたね", sp: 1400, limit: 1 },     // ◎
  { id: "p:ポケサブレ", name: "ポケサブレ", sp: 100, limit: 10 },            // ◎
  { id: "p:スーパーサブレ", name: "スーパーサブレ", sp: 400, limit: 5 },         // ◎
  { id: "p:ばんのうアメM", name: "ばんのうアメM", sp: 500, limit: 3 },          // ◯
  { id: "p:EXチケット", name: "EXチケット", sp: 100, limit: 1 },             // ◯
  { id: "p:ゆめのかたまりM", name: "ゆめのかたまりM", sp: 600, limit: 1 },        // △
  { id: "p:食材チケットM", name: "食材チケットM", sp: 300, limit: 3 },          // △
];
