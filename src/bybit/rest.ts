import { RestClientV5 } from "bybit-api";

// Mainnet, public endpoints only (no key needed, can't touch your funds).
const rest = new RestClientV5();

/** Full ticker for a USDT perpetual, or null if the symbol doesn't exist. */
export async function getTicker(symbol: string) {
  const res = await rest.getTickers({ category: "linear", symbol });
  return res.result?.list?.[0] ?? null;
}

export async function getLastPrice(symbol: string): Promise<number | null> {
  const ticker = await getTicker(symbol);
  return ticker ? Number(ticker.lastPrice) : null;
}
