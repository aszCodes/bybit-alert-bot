import { startBot } from "./core/bot.js";
import { features } from "./features/index.js";

startBot(features).catch((err) => {
  console.error("Fatal error", err);
  process.exit(1);
});
