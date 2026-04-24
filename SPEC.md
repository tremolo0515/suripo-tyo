# スリポやりくり帳 — 実装仕様書

> 実装前提知識: Next.js 16.2.4 (App Router) / React 19.2.4 / Tailwind CSS v4 / TypeScript

---

## 1. ファイル構成

```
app/
  layout.tsx          ← フォント設定・グローバルCSS読み込み（既存を上書き）
  page.tsx            ← メインページ（単一ページアプリ）
  globals.css         ← Tailwind v4 @import + CSS変数定義（既存を上書き）
  components/
    MonthHeader.tsx        ← Section 1: 月ヘッダー
    Ledger.tsx             ← Section 2: 出納帳テーブル
    InputForm.tsx          ← Section 3: 記録フォーム（タブ切り替え）
    EarnTab.tsx            ← 獲得タブの中身
    SpendTab.tsx           ← 消費タブの中身
    ExchangeGrid.tsx       ← アイテム選択グリッド
    CartSummary.tsx        ← 消費選択サマリー
  lib/
    types.ts               ← 型定義
    storage.ts             ← localStorage読み書き
    calc.ts                ← 残高計算・繰越計算
    items.ts               ← 交換所アイテムデータ（ハードコード）
```

---

## 2. 型定義 (`app/lib/types.ts`)

```typescript
export type EntryType = "earn" | "spend";

export interface Entry {
  id: string;
  date: string;       // YYYY-MM-DD
  type: EntryType;
  amount: number;     // SP数（常に正の値）
  label: string;      // 内容テキスト
  note?: string;
}

export interface AppData {
  entries: Entry[];
}

export interface ExchangeItem {
  name: string;
  sp: number;
  limit: number;      // 月間上限数
}

// SpendTabで使うカート状態
export interface CartItem extends ExchangeItem {
  quantity: number;
}
```

---

## 3. データ永続化 (`app/lib/storage.ts`)

- キー: `suripo-data`
- 読み込み: `localStorage.getItem("suripo-data")` → JSON.parse → `AppData`
- 書き込み: `JSON.stringify(data)` → `localStorage.setItem`
- SSR注意: `typeof window !== "undefined"` ガードが必須（Next.js App RouterはデフォルトでServer Component）

```typescript
const STORAGE_KEY = "suripo-data";

export function loadData(): AppData { ... }
export function saveData(data: AppData): void { ... }
export function addEntry(entry: Entry): void { ... }
```

---

## 4. 計算ロジック (`app/lib/calc.ts`)

```typescript
// 指定月(YYYY-MM)のエントリを抽出、日付昇順ソート
export function getMonthEntries(entries: Entry[], yearMonth: string): Entry[]

// 前月末時点の残高（繰越額）を計算
// → 対象月より前の全エントリを集計（earn: +, spend: -）
export function getCarryOver(entries: Entry[], yearMonth: string): number

// 出納帳テーブル用: 各行に running balance を付与した配列を生成
export interface LedgerRow extends Entry {
  balance: number;
}
export function buildLedger(entries: Entry[], yearMonth: string): {
  carryOver: number;
  rows: LedgerRow[];
  finalBalance: number;
}

// 当月の現在残高
export function getCurrentBalance(entries: Entry[], yearMonth: string): number
```

---

## 5. 交換所アイテムデータ (`app/lib/items.ts`)

`ExchangeItem[]` 型で以下を export:

- `NORMAL_ITEMS`: ノーマル交換所（26件）
- `PREMIUM_ITEMS`: プレミアム交換所（8件）

データは仕様書記載の通り。

---

## 6. グローバルスタイル (`app/globals.css`)

Tailwind v4 では `tailwind.config.js` は不要。CSS変数で直接テーマ拡張する。

```css
@import "tailwindcss";

@theme inline {
  /* カラーパレット */
  --color-cream:    #FFF8F0;
  --color-mint:     #B2EBD9;
  --color-lavender: #D4C5F9;
  --color-pink:     #FFD6E0;
  --color-yellow:   #FFF3B0;

  /* フォント変数（layout.tsxで注入される CSS変数を参照） */
  --font-heading: var(--font-dot-gothic);
  --font-body:    var(--font-kosugi-maru);
}

body {
  background-color: var(--color-cream);
  font-family: var(--font-body), sans-serif;
  max-width: 430px;
  margin: 0 auto;
}
```

---

## 7. フォント設定 (`app/layout.tsx`)

`next/font/google` で DotGothic16 と Kosugi Maru を読み込む。

```typescript
import { DotGothic16, Kosugi_Maru } from "next/font/google";

const dotGothic = DotGothic16({
  weight: "400",
  subsets: ["latin"],          // 日本語サブセットは自動
  variable: "--font-dot-gothic",
});

const kosugiMaru = Kosugi_Maru({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-kosugi-maru",
});
```

`<html>` タグに `className={`${dotGothic.variable} ${kosugiMaru.variable}`}` を付与。

metadata: `title: "スリポやりくり帳"`, `lang="ja"`, viewport に `user-scalable=no` は入れない（アクセシビリティ）

---

## 8. メインページ (`app/page.tsx`)

- **`"use client"` ディレクティブが必要**（localStorage・useState・useEffect を使うため）
- state:
  - `currentYearMonth: string` — `"YYYY-MM"` 形式、初期値は今月
  - `data: AppData` — localStorage から読み込み
  - `newRowId: string | null` — 追加直後のrow IDを保持（ハイライトアニメ用）
- 月移動: currentYearMonth を ±1ヶ月する関数（`dayjs` なし、手計算で可）

```typescript
function prevMonth(ym: string): string  // "2026-04" → "2026-03"
function nextMonth(ym: string): string
function formatYearMonth(ym: string): string  // "2026年 4月"
```

- `addEntry(entry)` → storage.addEntry → state更新 → `newRowId` セット → 500ms後クリア

---

## 9. Section 1: MonthHeader コンポーネント

Props:
```typescript
interface Props {
  yearMonth: string;
  balance: number;
  carryOver: number;
  onPrev: () => void;
  onNext: () => void;
}
```

表示内容:
- タイトル: "スリポやりくり帳" (DotGothic16)
- 月表示: "2026年 4月" + 左右矢印ボタン (`◀` / `▶`)
- 残高: "残高 ✦ 1,240 SP" — 大きめフォント、ラベンダー背景のバッジ
- 繰越: "前月繰越: XXX SP" — 小さめグレーテキスト

スタイル指針:
- カード: cream背景、dashed border、border-radius 16px
- 矢印ボタン: タップ領域を十分に（min 44x44px）

---

## 10. Section 2: Ledger コンポーネント

Props:
```typescript
interface Props {
  rows: LedgerRow[];
  carryOver: number;
  finalBalance: number;
  highlightId: string | null;
}
```

テーブル構造:
```
| 日付 | 内容 | 収入(+) | 支出(−) | 残高 |
```

- ヘッダー行: ブラウン系（#C8A96E）背景、白文字
- earn行: mint背景（`bg-mint/40`）
- spend行: pink背景（`bg-pink/40`）
- 先頭行: "前月繰越" — balance = carryOver
- 末尾行: "翌月繰越" — bold、finalBalance 表示
- `highlightId` に一致する行: `animate-flash` クラス付与

カスタムアニメーション（globals.cssに追加）:
```css
@keyframes flash {
  0%, 100% { background-color: transparent; }
  50% { background-color: var(--color-yellow); }
}
.animate-flash { animation: flash 0.8s ease 2; }
```

空状態: エントリゼロの場合、テーブルの代わりに中央に "まだ記録がないよ ☽" テキスト表示。

金額フォーマット: `toLocaleString("ja-JP")` で3桁区切り。

---

## 11. Section 3: InputForm コンポーネント

Props:
```typescript
interface Props {
  yearMonth: string;
  onAdd: (entry: Omit<Entry, "id">) => void;
}
```

タブ切り替え state: `activeTab: "earn" | "spend"`

タブボタン: "📥 獲得" / "📤 消費" — アクティブ側はラベンダー背景

---

## 12. EarnTab コンポーネント

Props: `{ yearMonth: string; onAdd: (entry: Omit<Entry, "id">) => void }`

フォーム要素:
1. **日付選択** — `<input type="date">` デフォルト値: 今日
2. **スリープスコア** — `<input type="range" min=0 max=100>` + 数値表示ラベル
   - スライダー値 → スリープポイント獲得数に自動反映
3. **ボーナスSP** — `<input type="number" min=0>` 任意入力
4. **メモ** — `<input type="text">` placeholder: "グッドスリープデー" 任意入力
5. **合計SP表示** — "スリープスコア + ボーナス = X SP"（リアルタイム計算）
6. **"記録する" ボタン**

送信時: `label = "スリープ記録"` (+ note があれば付加)、`amount = score + bonus`、`type = "earn"`

---

## 13. SpendTab コンポーネント

Props: `{ yearMonth: string; onAdd: (entry: Omit<Entry, "id">) => void }`

State:
- `exchangeType: "normal" | "premium"`
- `cart: Map<string, CartItem>` — itemName → CartItem

要素:
1. **交換所切り替えトグル** — "ノーマル交換所" / "プレミアム交換所" ボタン切り替え
2. **ExchangeGrid** — アイテム選択グリッド（下記）
3. **CartSummary** — 選択中アイテムと合計（下記）
4. **日付選択** — `<input type="date">` デフォルト: 今日
5. **"消費を記録" ボタン** — cart が空のとき disabled

送信時: `label = カート内アイテム名をカンマ結合`、`amount = 合計SP`、`type = "spend"`
送信後: cart をクリア

---

## 14. ExchangeGrid コンポーネント

Props:
```typescript
interface Props {
  items: ExchangeItem[];
  cart: Map<string, CartItem>;
  onTap: (item: ExchangeItem) => void;
}
```

- グリッド: `grid grid-cols-2 gap-2`（モバイルで2列）
- 各セル:
  - 上段: アイテム名
  - 下段: "XX SP" (limit表示は任意)
  - 選択中: ラベンダー border + 右上に数量バッジ
  - タップ: quantity +1 → limit到達で +1 を無効化 → 次のタップで 0 にリセット（0→1→2→...→limit→0の循環）
- クリーム背景、rounded-xl、dashed border

---

## 15. CartSummary コンポーネント

Props: `{ cart: Map<string, CartItem> }`

- cart が空なら非表示
- 選択アイテム一覧: "アイテム名 × N = XXX SP"
- 区切り線
- 合計: "合計 XXXX SP" — 大きめ bold

---

## 16. 実装上の注意点

### Next.js App Router における Client Component
- localStorage / useState / useEffect は全て Client Component でのみ使用可能
- `page.tsx` に `"use client"` を付与すれば、その子コンポーネントは全てクライアントとして動作する
- コンポーネントファイル個別に `"use client"` を付与してもよい

### Tailwind v4 の注意点
- `tailwind.config.js` は不要（`@theme` ブロックを globals.css に書く）
- カスタムカラーは `--color-xxx` 変数名で定義すれば `bg-xxx` / `text-xxx` クラスで参照可能
- `@tailwindcss/postcss` が既にインストール済み、`postcss.config.mjs` も設定済み

### 月計算（dayjs不使用）
```typescript
function prevMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return m === 1
    ? `${y - 1}-12`
    : `${y}-${String(m - 1).padStart(2, "0")}`;
}
```

### ID生成
```typescript
const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
```

### スクロール＆ハイライト
- 追加後: `document.getElementById("ledger-section")?.scrollIntoView({ behavior: "smooth" })`
- 新行IDを `highlightId` として Ledger に渡し、500ms後に null へリセット

---

## 17. 実装順序（推奨）

1. `app/lib/types.ts` — 型定義
2. `app/lib/items.ts` — アイテムデータ
3. `app/lib/storage.ts` — localStorage読み書き
4. `app/lib/calc.ts` — 計算ロジック（+ 単体テストで動作確認）
5. `app/globals.css` — テーマ変数・アニメーション定義
6. `app/layout.tsx` — フォント設定・metadata
7. `app/page.tsx` — 状態管理・各セクションの組み立て
8. `app/components/MonthHeader.tsx`
9. `app/components/Ledger.tsx`
10. `app/components/EarnTab.tsx`
11. `app/components/ExchangeGrid.tsx` + `CartSummary.tsx`
12. `app/components/SpendTab.tsx`
13. `app/components/InputForm.tsx`（タブ統合）
14. 結合・動作確認

---

## 18. 未対応スコープ（今バージョンのスコープ外）

- ユーザー認証
- クラウド同期
- プッシュ通知
- 月間上限のリセット追跡（交換所limitは UI上の操作制限のみ、履歴からの自動チェックは行わない）
