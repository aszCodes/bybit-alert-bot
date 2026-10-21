import { onPrice, setSubscriptions } from "../../bybit/stream.js";
import { config } from "../../config.js";
import { label } from "../../utils/symbols.js";
import { noteLine } from "./format.js";
import { getAlerts, persistAlerts, removeAlerts, symbolsWithAlerts } from "./store.js";
import type { Alert, Side } from "./types.js";

type Notify = (text: string) => Promise<void>;

/** Keep live ticker subscriptions in sync with the alerts that exist. */
export const syncSubscriptions = (): void => setSubscriptions(symbolsWithAlerts());

export function startAlertEngine(notify: Notify): void {
  onPrice((symbol, price) => check(symbol, price, notify));
  syncSubscriptions();
}

function check(symbol: string, price: number, notify: Notify): void {
  const now = Date.now();
  const oneShots: Alert[] = [];
  const repeats: Alert[] = [];
  let dirty = false;

  for (const a of getAlerts()) {
    if (a.symbol !== symbol) continue;

    if (a.repeat) {
      const side: Side = price >= a.target ? "above" : "below";
      if (side !== a.side) {
        a.side = side;
        dirty = true;
        if (!a.lastFired || now - a.lastFired >= config.repeatCooldownMs) {
          a.lastFired = now;
          repeats.push(a);
        }
      }
    } else if (a.dir === "above" ? price >= a.target : price <= a.target) {
      oneShots.push(a);
    }
  }

  if (oneShots.length === 0 && !dirty) return;

  // Update state synchronously, before any await, so rapid ticks can't double-fire
  if (oneShots.length) removeAlerts(oneShots);
  persistAlerts();
  if (oneShots.length) syncSubscriptions();

  const messages = [
    ...oneShots.map(
      (a) => `🔔 **${label(a.symbol)}** hit ${a.target} (${a.dir}). Last price: ${price}${noteLine(a)}`
    ),
    ...repeats.map(
      (a) =>
        `🔁 **${label(a.symbol)}** crossed ${a.target}, now ${a.side}. Last price: ${price} (alert #${a.id})${noteLine(a)}`
    ),
  ];
  void send(notify, messages);
}

async function send(notify: Notify, messages: string[]): Promise<void> {
  try {
    for (const m of messages) await notify(m);
  } catch (err) {
    console.error("Failed to send alert DM", err);
  }
}
