export function normalizePrice(value?: number | string | null): number | null {
  if (value === null || value === undefined) {
    return null;
  }

  const parsed = typeof value === 'number' ? value : Number.parseFloat(value);
  return Number.isNaN(parsed) ? null : Number(parsed.toFixed(2));
}

export function calculatePercentDrop(
  previousPrice?: number | null,
  currentPrice?: number | null,
): number | null {
  if (
    previousPrice === null ||
    previousPrice === undefined ||
    currentPrice === null ||
    currentPrice === undefined ||
    previousPrice <= 0 ||
    currentPrice >= previousPrice
  ) {
    return null;
  }

  const diff = previousPrice - currentPrice;
  return Number(((diff / previousPrice) * 100).toFixed(2));
}
