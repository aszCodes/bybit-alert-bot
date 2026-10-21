import { loadJson, saveJson } from "../../core/storage.js";
import type { Alert } from "./types.js";

const FILE = "alerts.json";

let alerts: Alert[] = [];
let nextId = 1;

export function loadAlerts(): void {
  alerts = loadJson<Alert[]>(FILE, []);
  nextId = alerts.reduce((max, a) => Math.max(max, a.id), 0) + 1;
}

export const getAlerts = (): readonly Alert[] => alerts;

/** Call after mutating an alert in place (e.g. repeat state). */
export const persistAlerts = (): void => saveJson(FILE, alerts);

export function addAlert(data: Omit<Alert, "id">): Alert {
  const alert: Alert = { id: nextId++, ...data };
  alerts.push(alert);
  persistAlerts();
  return alert;
}

/** Removes alerts without persisting; caller decides when to save. */
export function removeAlerts(toRemove: readonly Alert[]): void {
  alerts = alerts.filter((a) => !toRemove.includes(a));
}

export function removeAlertById(id: number): boolean {
  const before = alerts.length;
  alerts = alerts.filter((a) => a.id !== id);
  persistAlerts();
  return alerts.length < before;
}

export const symbolsWithAlerts = (): Set<string> => new Set(alerts.map((a) => a.symbol));
