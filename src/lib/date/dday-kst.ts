const DAY_IN_MS = 24 * 60 * 60 * 1000;

function parseYmd(value: string): { year: number; month: number; day: number } {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    throw new Error(`Invalid date format: ${value}. Expected YYYY-MM-DD.`);
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  return { year, month, day };
}

function toUtcDaySerial(parts: { year: number; month: number; day: number }): number {
  return Math.floor(Date.UTC(parts.year, parts.month - 1, parts.day) / DAY_IN_MS);
}

function getKstYmdParts(now: Date): { year: number; month: number; day: number } {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(now);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  const day = Number(parts.find((part) => part.type === "day")?.value);

  if (!year || !month || !day) {
    throw new Error("Failed to extract KST date parts.");
  }

  return { year, month, day };
}

export function getDdayLabelFromKst(eventDateKst: string, now: Date = new Date()): string {
  const eventDay = toUtcDaySerial(parseYmd(eventDateKst));
  const todayKst = toUtcDaySerial(getKstYmdParts(now));
  const diff = eventDay - todayKst;

  if (diff === 0) return "D-Day";
  if (diff > 0) return `D-${diff}`;
  return `D+${Math.abs(diff)}`;
}
