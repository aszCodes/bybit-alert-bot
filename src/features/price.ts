import { getTicker } from "../bybit/rest.js";
import type { Feature } from "../core/command.js";
import { label, normalize } from "../utils/symbols.js";
import { getWatchlist } from "./watchlist.js";

async function fetchPrice(symbol: string): Promise<string> {
  const t = await getTicker(symbol);
  if (!t) return `**${label(symbol)}**: no data`;
  const pct = (Number(t.price24hPcnt) * 100).toFixed(2);
  const sign = Number(pct) >= 0 ? "+" : "";
  const funding = (Number(t.fundingRate) * 100).toFixed(4);
  return `**${label(symbol)}**: ${t.lastPrice} (${sign}${pct}% 24h) | mark ${t.markPrice} | funding ${funding}%`;
}

export const priceFeature: Feature = {
  title: "Prices",
  help: [
    "`!price` shows your watchlist",
    "`!price eth sol` shows any symbols (`.P` suffix optional)",
  ],
  commands: [
    {
      name: "!price",
      run: async ({ msg, args }) => {
        const symbols = args.length ? args.map(normalize) : [...getWatchlist()];
        if (symbols.length === 0) {
          await msg.reply("Your watchlist is empty. Try `!watch add btc` or `!price btc`.");
          return;
        }
        const lines = await Promise.all(symbols.map(fetchPrice));
        await msg.reply(lines.join("\n"));
      },
    },
  ],
};
