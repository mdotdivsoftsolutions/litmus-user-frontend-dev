export function isCityCovered(city: string, allowedCities: string[]): boolean {
  const n = city.trim().toLowerCase();
  if (!n) return false;
  return allowedCities.some((allowed) => {
    const a = allowed.trim().toLowerCase();
    return n === a || n.includes(a) || a.includes(n);
  });
}
