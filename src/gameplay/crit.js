export function rollCrit(critChance) {
  return Math.random() < critChance;
}

export function computeDamage(baseDamage, isCrit, critMult) {
  return isCrit ? baseDamage * critMult : baseDamage;
}
