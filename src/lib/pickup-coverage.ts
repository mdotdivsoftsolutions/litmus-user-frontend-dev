/** Lower-case words separated by single spaces: "North-Chennai,  TN" -> "north chennai tn". */
const normalizeCity = (value: string) =>
  String(value || "")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim();

/**
 * Pickup is offered when the customer's city is a covered city, or contains it as a whole
 * word ("Chennai, Tamil Nadu", "North Chennai"). Partial text such as "Ch" or "nai" never
 * matches. Must stay in sync with isPickupCityCovered in backend/src/utils/bookingRules.ts.
 */
export function isCityCovered(city: string, allowedCities: string[]): boolean {
  const n = normalizeCity(city);
  if (!n) return false;
  return allowedCities.some((allowed) => {
    const a = normalizeCity(allowed);
    return Boolean(a) && ` ${n} `.includes(` ${a} `);
  });
}
