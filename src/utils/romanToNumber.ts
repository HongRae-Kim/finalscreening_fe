const romanToNumberMap: Record<string, number> = {
  I: 1,
  II: 2,
  III: 3,
  IV: 4,
};

export function romanToNumber(roman: string): number | null {
  return romanToNumberMap[roman] ?? null;
}
