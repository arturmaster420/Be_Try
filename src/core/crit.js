import { clamp } from './math.js';
import { STATS } from './config.js';

export function rollCrit(world) {
  const totalChance = clamp(
    world.stats.critChancePermanent + world.stats.critChanceTemp,
    0,
    STATS.maxTotalCritChance
  );
  const isCrit = Math.random() < totalChance;
  const mult = isCrit ? world.stats.critMult : 1;
  return { isCrit, mult };
}

export function applyPermanentCritChanceBonus(world, amount) {
  world.stats.critChancePermanent = clamp(
    world.stats.critChancePermanent + amount,
    0,
    STATS.maxPermanentCritChance
  );
}

export function applyTempCritChanceBonus(world, amount, duration) {
  world.buffs.push({
    type: 'critChance',
    amount,
    remaining: duration,
  });
  world.stats.critChanceTemp += amount;
}

export function applyTempCritDamageBonus(world, multAmount, duration) {
  world.buffs.push({
    type: 'critDamage',
    amount: multAmount,
    remaining: duration,
  });
  world.stats.critMult *= multAmount;
}

export function updateBuffs(world, dt) {
  for (let i = world.buffs.length - 1; i >= 0; i--) {
    const b = world.buffs[i];
    b.remaining -= dt;
    if (b.remaining <= 0) {
      if (b.type === 'critChance') {
        world.stats.critChanceTemp -= b.amount;
      } else if (b.type === 'critDamage') {
        world.stats.critMult /= b.amount || 1;
      }
      world.buffs.splice(i, 1);
    }
  }
}
