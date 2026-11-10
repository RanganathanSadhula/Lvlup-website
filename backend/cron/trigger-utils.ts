import type { JobTrigger } from "./types";

/**
 * Evaluates whether a given value matches a cron field segment.
 * Supports: '*', '5', '1-5', 'star/10', '1,2,5'
 */
function matchesField(field: string, value: number, min: number, max: number): boolean {
  if (field === "*") return true;

  // Handle lists e.g. "1,3,5"
  if (field.includes(",")) {
    return field.split(",").some((part) => matchesField(part.trim(), value, min, max));
  }

  // Handle steps e.g. "*/5" or "10-20/2"
  if (field.includes("/")) {
    const parts = field.split("/");
    const rangePart = parts[0] ?? "*";
    const stepStr = parts[1] ?? "";
    const step = parseInt(stepStr, 10);
    if (isNaN(step) || step <= 0) return false;

    if (rangePart === "*") {
      return (value - min) % step === 0;
    }
    const rangeSplits = rangePart.split("-");
    const start = parseInt(rangeSplits[0] ?? "0", 10);
    const end = rangeSplits[1] ? parseInt(rangeSplits[1], 10) : max;
    if (value < start || value > end) return false;
    return (value - start) % step === 0;
  }

  // Handle ranges e.g. "1-5"
  if (field.includes("-")) {
    const rangeSplits = field.split("-");
    const start = parseInt(rangeSplits[0] ?? "0", 10);
    const end = parseInt(rangeSplits[1] ?? String(max), 10);
    return value >= start && value <= end;
  }

  // Handle exact number
  const exact = parseInt(field, 10);
  return value === exact;
}

const weekdayMap: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
};

function getDateFields(date: Date, timezone?: string) {
  if (!timezone) {
    return {
      minute: date.getMinutes(),
      hour: date.getHours(),
      dom: date.getDate(),
      month: date.getMonth() + 1,
      dow: date.getDay(),
    };
  }

  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      weekday: "short",
    });

    const parts = formatter.formatToParts(date);
    let minute = date.getMinutes();
    let hour = date.getHours();
    let dom = date.getDate();
    let month = date.getMonth() + 1;
    let dow = date.getDay();

    for (const part of parts) {
      if (part.type === "minute") minute = parseInt(part.value, 10);
      else if (part.type === "hour") hour = parseInt(part.value, 10);
      else if (part.type === "day") dom = parseInt(part.value, 10);
      else if (part.type === "month") month = parseInt(part.value, 10);
      else if (part.type === "weekday") dow = weekdayMap[part.value] ?? 0;
    }

    return { minute, hour, dom, month, dow };
  } catch {
    return {
      minute: date.getMinutes(),
      hour: date.getHours(),
      dom: date.getDate(),
      month: date.getMonth() + 1,
      dow: date.getDay(),
    };
  }
}

/**
 * Calculates the next matching Date for a 5-field cron expression:
 * minute (0-59) hour (0-23) dayOfMonth (1-31) month (1-12) dayOfWeek (0-6)
 */
export function getNextCronDate(
  expression: string,
  fromDate: Date = new Date(),
  timezone?: string
): Date | null {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    throw new Error(`Invalid cron expression '${expression}': requires 5 fields (min hour dom month dow)`);
  }

  const minField = parts[0]!;
  const hourField = parts[1]!;
  const domField = parts[2]!;
  const monthField = parts[3]!;
  const dowField = parts[4]!;

  // Start from the next full minute
  const candidate = new Date(fromDate.getTime());
  candidate.setSeconds(0, 0);
  candidate.setMinutes(candidate.getMinutes() + 1);

  // Search forward up to 525,600 minutes (1 year max lookahead)
  const maxIterations = 525600;
  for (let i = 0; i < maxIterations; i++) {
    const fields = getDateFields(candidate, timezone);

    if (!matchesField(monthField, fields.month, 1, 12)) {
      candidate.setMonth(candidate.getMonth() + 1, 1);
      candidate.setHours(0, 0, 0, 0);
      continue;
    }

    if (!matchesField(domField, fields.dom, 1, 31) || !matchesField(dowField, fields.dow, 0, 6)) {
      candidate.setDate(candidate.getDate() + 1);
      candidate.setHours(0, 0, 0, 0);
      continue;
    }

    if (!matchesField(hourField, fields.hour, 0, 23)) {
      candidate.setHours(candidate.getHours() + 1, 0, 0, 0);
      continue;
    }

    if (!matchesField(minField, fields.minute, 0, 59)) {
      candidate.setMinutes(candidate.getMinutes() + 1);
      continue;
    }

    return candidate;
  }

  return null;
}

/**
 * Resolves the next run timestamp for any supported JobTrigger
 */
export function getNextRun(trigger: JobTrigger, fromDate: Date = new Date()): Date | null {
  switch (trigger.type) {
    case "interval":
      return new Date(fromDate.getTime() + trigger.intervalMs);
    case "date":
      return trigger.runAt > fromDate ? trigger.runAt : null;
    case "cron":
      return getNextCronDate(trigger.expression, fromDate, trigger.timezone);
    default:
      return null;
  }
}
