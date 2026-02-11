/**
 * Internal format: YYYY-MM-DD (used for Firestore document IDs and range queries).
 * Display format: DD-MM-YYYY (shown to the user everywhere in the UI).
 */

/**
 * Get today's date string in internal format (YYYY-MM-DD).
 */
export function getTodayString(): string {
  return formatDate(new Date());
}

/**
 * Format a Date to internal YYYY-MM-DD string.
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Parse an internal YYYY-MM-DD string to a Date.
 */
export function parseDate(dateString: string): Date {
  const [year, month, day] = dateString.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Convert internal YYYY-MM-DD to display DD-MM-YYYY.
 */
export function toDisplayDate(dateString: string): string {
  const [year, month, day] = dateString.split("-");
  return `${day}-${month}-${year}`;
}

/**
 * Convert display DD-MM-YYYY to internal YYYY-MM-DD.
 */
export function fromDisplayDate(displayDate: string): string {
  const [day, month, year] = displayDate.split("-");
  return `${year}-${month}-${day}`;
}

/**
 * Format date for display (e.g., "10-02-2026").
 */
export function formatDateDisplay(dateString: string): string {
  return toDisplayDate(dateString);
}

const WEEKDAY_NAMES = ["Domingo", "Segunda-feira", "Terca-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sabado"];
const MONTH_NAMES = ["janeiro", "fevereiro", "marco", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

/**
 * Get the weekday name for an internal YYYY-MM-DD string (e.g., "Quarta-feira").
 */
export function getWeekdayName(dateString: string): string {
  const date = parseDate(dateString);
  return WEEKDAY_NAMES[date.getDay()];
}

/**
 * Format date as extended PT-BR string (e.g., "11 de fevereiro, 2026").
 */
export function formatDateExtended(dateString: string): string {
  const date = parseDate(dateString);
  const day = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  return `${day} de ${month}, ${year}`;
}

/**
 * Format date short (e.g., "10/02").
 */
export function formatDateShort(dateString: string): string {
  const [, month, day] = dateString.split("-");
  return `${day}/${month}`;
}

/**
 * Get an array of date strings (internal format) for a range.
 */
export function getDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = parseDate(startDate);
  const end = parseDate(endDate);

  while (current <= end) {
    dates.push(formatDate(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Get the date string (internal format) for N days ago.
 */
export function daysAgo(n: number): string {
  const date = new Date();
  date.setDate(date.getDate() - n);
  return formatDate(date);
}
