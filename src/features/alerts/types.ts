export type Side = "above" | "below";

export interface Alert {
  id: number;
  symbol: string;
  target: number;
  /** One-time alerts: which way price must go to trigger. */
  dir: Side;
  /** Optional reminder shown when it fires. */
  note?: string;
  /** Repeating alerts fire on every crossing of the level. */
  repeat?: boolean;
  /** Repeating alerts: which side of the level price was last on. */
  side?: Side;
  /** Repeating alerts: timestamp of the last notification. */
  lastFired?: number;
}
