import { getLastPrice } from "../bybit/rest.js";
import { config } from "../config.js";
import type { Feature } from "../core/command.js";
import { loadJson, saveJson } from "../core/storage.js";
import { label, normalize } from "../utils/symbols.js";

const FILE = "watchlist.json";

let watchlist: string[] = [...config.defaultSymbols];

export const getWatchlist = (): readonly string[] => watchlist;

const save = () => saveJson(FILE, watchlist);
const show = (list: readonly string[]) => list.map(label).join(", ") || "(empty)";

export const watchlistFeature: Feature = {
  title: "Watchlist",
  help: [
    "`!watch` shows your watchlist",
    "`!watch add sol eth` adds symbols",
    "`!watch remove sol` removes symbols",
  ],

  init() {
    watchlist = loadJson<string[]>(FILE, [...config.defaultSymbols]);
  },

  commands: [
    {
      name: "!watch",
      run: async ({ msg, args }) => {
        const [sub, ...rest] = args;
        const symbols = [...new Set(rest.map(normalize))];
        const action = sub?.toLowerCase();

        if (!action || action === "list") {
          await msg.reply(`👀 Watchlist: ${show(watchlist)}`);
          return;
        }

        if (action === "add") {
          if (symbols.length === 0) {
            await msg.reply("Usage: `!watch add sol eth`");
            return;
          }
          const added: string[] = [];
          const skipped: string[] = [];
          const invalid: string[] = [];
          for (const s of symbols) {
            if (watchlist.includes(s)) skipped.push(s);
            else if ((await getLastPrice(s)) === null) invalid.push(s);
            else {
              watchlist.push(s);
              added.push(s);
            }
          }
          save();
          const parts: string[] = [];
          if (added.length) parts.push(`✅ Added ${show(added)}`);
          if (skipped.length) parts.push(`Already on list: ${skipped.join(", ")}`);
          if (invalid.length) parts.push(`Not found: ${invalid.join(", ")}`);
          await msg.reply(parts.join("\n"));
          return;
        }

        if (action === "remove" || action === "rm" || action === "del") {
          if (symbols.length === 0) {
            await msg.reply("Usage: `!watch remove sol`");
            return;
          }
          const before = watchlist.length;
          watchlist = watchlist.filter((s) => !symbols.includes(s));
          save();
          await msg.reply(
            watchlist.length < before
              ? `🗑️ Removed. Watchlist: ${show(watchlist)}`
              : "None of those were on your watchlist."
          );
          return;
        }

        await msg.reply("Usage: `!watch`, `!watch add sol`, `!watch remove sol`");
      },
    },
  ],
};
