export const DAY_MS = 86_400_000;
export const TOTAL_DAYS = 30;

export function utcDate(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function parseDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value ?? "")) return null;
  const date = new Date(`${value}T00:00:00.000Z`);
  return Number.isFinite(date.getTime()) && utcDate(date) === value ? date : null;
}

export function availableDay(start, now = new Date()) {
  const startDate = parseDate(start);
  if (!startDate || !Number.isFinite(now.getTime())) return 0;
  const today = parseDate(utcDate(now));
  return Math.max(0, Math.min(TOTAL_DAYS, Math.floor((today - startDate) / DAY_MS) + 1));
}

export function parseChallenge(url, now = new Date()) {
  const start = url.searchParams.get("inicio");
  const id = url.searchParams.get("pareja");
  if (!start && !id) return null;
  if (!parseDate(start) || !/^[0-9a-f]{32}$/.test(id ?? "") || availableDay(start, now) === 0) {
    throw new Error("Este enlace no es válido o su fecha de inicio todavía no ha llegado.");
  }
  return { start, id };
}

export function readProgress(value, unlocked) {
  if (value === null) return [];
  const parsed = JSON.parse(value);
  if (!Array.isArray(parsed) || parsed.some(day => !Number.isInteger(day) || day < 1 || day > TOTAL_DAYS)) {
    throw new Error("El progreso guardado no tiene un formato válido.");
  }
  return [...new Set(parsed)].filter(day => day <= unlocked).sort((a, b) => a - b);
}
