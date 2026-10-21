import { getLastPrice } from "../../bybit/rest.js";
import type { Feature } from "../../core/command.js";
import { label } from "../../utils/symbols.js";
import { startAlertEngine, syncSubscriptions } from "./engine.js";
import { describe, noteLine } from "./format.js";
import { parseAlertArgs } from "./parse.js";
import { addAlert, getAlerts, loadAlerts, removeAlertById } from "./store.js";
import type { Side } from "./types.js";

const USAGE =
  'Usage: `!alert btc 70000`, `!alert btc 70000 repeat`, or `!alert btc 70000 "your note"`';

export const alertsFeature: Feature = {
  title: "Alerts",
  help: [
    "`!alert btc 70000` one-time alert (fires once, then deleted)",
    "`!alert btc 70000 repeat` fires every time price crosses the level",
    '`!alert btc 70000 "range high, look for short"` adds a note (works with `repeat` too)',
    "`!alerts` lists active alerts",
    "`!delalert 3` deletes alert #3",
  ],

  init(app) {
    loadAlerts();
    console.log(`Loaded ${getAlerts().length} alert(s)`);
    startAlertEngine(app.notify);
  },

  commands: [
    {
      name: "!alert",
      run: async ({ msg, rest }) => {
        const parsed = parseAlertArgs(rest);
        if (!parsed) {
          await msg.reply(USAGE);
          return;
        }

        const { symbol, target, repeat, note } = parsed;
        const current = await getLastPrice(symbol);
        if (current === null) {
          await msg.reply(`No data for ${symbol}`);
          return;
        }
        if (target === current) {
          await msg.reply("Target equals the current price.");
          return;
        }

        const dir: Side = target > current ? "above" : "below";
        const startSide: Side = dir === "above" ? "below" : "above";
        const alert = addAlert({
          symbol,
          target,
          dir,
          ...(note ? { note } : {}),
          ...(repeat ? { repeat: true, side: startSide } : {}),
        });
        syncSubscriptions();

        const desc = repeat
          ? `every time price crosses ${target}`
          : `once when price goes ${dir} ${target}`;
        await msg.reply(
          `✅ Alert #${alert.id}: **${label(symbol)}** ${desc} (now ${current})${noteLine(alert)}`
        );
      },
    },
    {
      name: "!alerts",
      run: async ({ msg }) => {
        const alerts = getAlerts();
        await msg.reply(alerts.length ? alerts.map(describe).join("\n") : "No active alerts.");
      },
    },
    {
      name: "!delalert",
      run: async ({ msg, args }) => {
        const id = Number(args[0]);
        const removed = removeAlertById(id);
        syncSubscriptions();
        await msg.reply(removed ? `🗑️ Deleted alert #${id}` : `No alert #${args[0]}`);
      },
    },
  ],
};
