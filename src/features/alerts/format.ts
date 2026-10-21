import { label } from "../../utils/symbols.js";
import type { Alert } from "./types.js";

export const noteLine = (a: Alert): string => (a.note ? `\n📝 ${a.note}` : "");

/** One line for the !alerts list. */
export function describe(a: Alert): string {
  const base = a.repeat
    ? `#${a.id} 🔁 **${label(a.symbol)}** every cross of ${a.target}`
    : `#${a.id} 1️⃣ **${label(a.symbol)}** ${a.dir} ${a.target}`;
  return a.note ? `${base} — 📝 ${a.note}` : base;
}
