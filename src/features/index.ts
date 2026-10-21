import type { Feature } from "../core/command.js";
import { pingFeature } from "./ping.js";
import { helpFeature } from "./help.js";
import { priceFeature } from "./price.js";
import { watchlistFeature } from "./watchlist.js";
import { alertsFeature } from "./alerts/index.js";

/** To add a feature: create a file exporting a Feature, then list it here. */
export const features: Feature[] = [
  priceFeature,
  watchlistFeature,
  alertsFeature,
  pingFeature,
  helpFeature,
];
