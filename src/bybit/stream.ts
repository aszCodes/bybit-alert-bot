import { WebsocketClient } from "bybit-api";

type PriceListener = (symbol: string, price: number) => void;

const ws = new WebsocketClient({ market: "v5" });
const listeners: PriceListener[] = [];
const subscribed = new Set<string>();

const topic = (symbol: string) => `tickers.${symbol}`;

/** Register a callback that receives every live last-price update. */
export function onPrice(listener: PriceListener): void {
  listeners.push(listener);
}

/** Make the live ticker subscriptions match exactly this set of symbols. */
export function setSubscriptions(symbols: Iterable<string>): void {
  const needed = new Set(symbols);
  const toAdd = [...needed].filter((s) => !subscribed.has(s));
  const toRemove = [...subscribed].filter((s) => !needed.has(s));

  if (toAdd.length) {
    ws.subscribeV5(toAdd.map(topic), "linear");
    toAdd.forEach((s) => subscribed.add(s));
    console.log("Subscribed:", toAdd.join(", "));
  }
  if (toRemove.length) {
    ws.unsubscribeV5(toRemove.map(topic), "linear");
    toRemove.forEach((s) => subscribed.delete(s));
    console.log("Unsubscribed:", toRemove.join(", "));
  }
}

ws.on("update", (msg: any) => {
  if (typeof msg.topic !== "string" || !msg.topic.startsWith("tickers.")) return;
  const symbol = msg.topic.slice("tickers.".length);
  // Delta messages only include fields that changed, so lastPrice may be absent
  const raw = msg.data?.lastPrice;
  if (raw === undefined) return;
  const price = Number(raw);
  if (!Number.isFinite(price)) return;
  for (const listener of listeners) listener(symbol, price);
});

ws.on("open", () => console.log("WS connected"));
ws.on("reconnected", () => console.log("WS reconnected"));
ws.on("exception", (err: unknown) => console.error("WS error", err));
