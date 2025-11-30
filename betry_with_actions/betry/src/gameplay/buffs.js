import { CONFIG } from "../core/config.js";
import { clamp } from "../core/math.js";

const permanent = {
  critChance: 0,     // absolute, 0..0.70
  critDamagePct: 0,  // +% to multiplier
  fireRatePct: 0,
  rangePct: 0,
  speedPct: 0,
  damagePct: 0,
};

let tempBuffs = [];
// each temp buff: { time: remainingSeconds, critChanceAdd, critDamageAdd }

export function resetBuffs() {
  permanent.critChance = 0;
  permanent.critDamagePct = 0;
  permanent.fireRatePct = 0;
  permanent.rangePct = 0;
  permanent.speedPct = 0;
  permanent.damagePct = 0;
  tempBuffs = [];
}

export function updateBuffs(dt) {
  tempBuffs.forEach((b) => (b.time -= dt));
  tempBuffs = tempBuffs.filter((b) => b.time > 0);
}

export function applyBoosterBuff() {
  tempBuffs.push({
    time: CONFIG.BOOSTER_DURATION,
    critChanceAdd: CONFIG.BOOSTER_CRIT_CHANCE_ADD,
    critDamageAdd: CONFIG.BOOSTER_CRIT_DAMAGE_ADD,
  });
}

const PERM_UPGRADES = [
  "critChance",
  "critDamage",
  "fireRate",
  "range",
  "speed",
  "damage",
];

export function applyRandomPermanentUpgrade() {
  const key = PERM_UPGRADES[Math.floor(Math.random() * PERM_UPGRADES.length)];
  switch (key) {
    case "critChance":
      permanent.critChance = clamp(
        permanent.critChance + 0.01,
        0,
        CONFIG.MAX_PERM_CRIT_CHANCE
      );
      break;
    case "critDamage":
      permanent.critDamagePct += 0.01;
      break;
    case "fireRate":
      permanent.fireRatePct += 0.01;
      break;
    case "range":
      permanent.rangePct += 0.01;
      break;
    case "speed":
      permanent.speedPct += 0.01;
      break;
    case "damage":
      permanent.damagePct += 0.01;
      break;
  }
}

export function getPermanent() {
  return { ...permanent };
}

export function getEffectiveStats() {
  // base stats from CONFIG
  const baseMove = CONFIG.PLAYER_BASE_MOVE_SPEED;
  const baseFireRate = CONFIG.PLAYER_BASE_FIRE_RATE;
  const baseRange = CONFIG.PLAYER_BASE_BULLET_RANGE;
  const baseDamage = CONFIG.PLAYER_BASE_DAMAGE;
  const baseCritChance = CONFIG.BASE_CRIT_CHANCE;
  const baseCritMult = CONFIG.BASE_CRIT_MULT;

  let tempCritChanceAdd = 0;
  let tempCritDamageAdd = 0;
  for (const b of tempBuffs) {
    tempCritChanceAdd += b.critChanceAdd;
    tempCritDamageAdd += b.critDamageAdd;
  }

  const permCritChance = clamp(
    baseCritChance + permanent.critChance,
    0,
    CONFIG.MAX_PERM_CRIT_CHANCE
  );

  // total crit chance can not exceed MAX_TOTAL_CRIT_CHANCE
  let totalCritChance = permCritChance + tempCritChanceAdd;
  totalCritChance = clamp(
    totalCritChance,
    0,
    CONFIG.MAX_TOTAL_CRIT_CHANCE
  );

  const critMult =
    baseCritMult *
    (1 + permanent.critDamagePct + tempCritDamageAdd);

  const moveSpeed = baseMove * (1 + permanent.speedPct);
  const fireRate = baseFireRate * (1 + permanent.fireRatePct);
  const range = baseRange * (1 + permanent.rangePct);
  const damage = baseDamage * (1 + permanent.damagePct);

  return {
    moveSpeed,
    fireRate,
    range,
    damage,
    critChance: totalCritChance,
    critMult,
    tempCritTimeLeft: tempBuffs.length
      ? Math.max(...tempBuffs.map((b) => b.time))
      : 0,
  };
}
