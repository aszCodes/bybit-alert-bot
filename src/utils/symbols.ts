/** "btc" -> BTCUSDT, "xauusdt.p" -> XAUUSDT, "ETHUSDT" -> ETHUSDT */
export function normalize(input: string): string {
  let s = input.toUpperCase().replace(/\.P$/, "");
  if (!s.endsWith("USDT")) s += "USDT";
  return s;
}

/** TradingView-style display name: BTCUSDT -> BTCUSDT.P */
export const label = (symbol: string): string => `${symbol}.P`;
