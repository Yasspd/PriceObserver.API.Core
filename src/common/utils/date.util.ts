export function addHours(date: Date, hours: number): Date {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

export function isPast(date?: Date | null): boolean {
  return !!date && date.getTime() < Date.now();
}
