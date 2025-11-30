export function rollCrit(chance) {
  return Math.random() < chance;
}

export function computeDamage(base, isCrit, mult) {
  return isCrit ? base * mult : base;
}
