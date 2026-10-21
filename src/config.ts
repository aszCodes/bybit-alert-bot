import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name} in .env`);
  return value;
}

export const config = {
  discordToken: required("DISCORD_TOKEN"),
  ownerId: required("OWNER_ID"),

  /** Where alerts.json, watchlist.json etc. are stored. */
  dataDir: "data",

  /** Watchlist used on first run, before you add/remove anything. */
  defaultSymbols: ["BTCUSDT", "XAUUSDT"],

  /** Repeating alerts won't notify more often than this. */
  repeatCooldownMs: 60_000,

  maxNoteLength: 200,
};
