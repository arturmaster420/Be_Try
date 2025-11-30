export function rollCrit(chance) {
  return Math.random() < chance;
}
export function computeDamage(baseDamage, isCrit, critMult) {
  return isCrit ? baseDamage * critMult : baseDamage;
}
