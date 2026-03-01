/** Returns a cryptographically secure float in [0, 1) */
export function secureRandom(): number {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return arr[0]! / (0xffffffff + 1);
}

/** Random float in [min, max) */
export function randomBetween(min: number, max: number): number {
  return min + secureRandom() * (max - min);
}

/** Pick a random element from an array */
export function randomFrom<T>(arr: readonly T[]): T {
  return arr[Math.floor(secureRandom() * arr.length)]!;
}
