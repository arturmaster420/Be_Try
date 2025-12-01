import { CONFIG } from "./config.js";
import { clamp } from "./math.js";

export const permanent = {
  critChance: 0,
  critDamagePct: 0,
  fireRatePct: 0,
  rangePct: 0,
  speedPct: 0,
  damagePct: 0,
};

export let tempBuffs = [];

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

export function applyBoosterBuff(kind) {
  if (kind === "utility") {
    const roll = Math.random();
    if (roll < 1 / 3) {
      tempBuffs.push({
        time: CONFIG.BOOSTER_UTILITY_DURATION,
        fireRatePct: CONFIG.BOOSTER_UTILITY_FIRE_ADD,
        rangePct: 0,
        speedPct: 0,
        critChanceAdd: 0,
        critDamageAdd: 0,
      });
      return "+20% fire rate (60s)";
    }
    if (roll < 2 / 3) {
      tempBuffs.push({
        time: CONFIG.BOOSTER_UTILITY_DURATION,
        fireRatePct: 0,
        rangePct: CONFIG.BOOSTER_UTILITY_RANGE_ADD,
        speedPct: 0,
        critChanceAdd: 0,
        critDamageAdd: 0,
      });
      return "+20% range (60s)";
    }
    tempBuffs.push({
      time: CONFIG.BOOSTER_UTILITY_DURATION,
      fireRatePct: 0,
      rangePct: 0,
      speedPct: CONFIG.BOOSTER_UTILITY_SPEED_ADD,
      critChanceAdd: 0,
      critDamageAdd: 0,
    });
    return "+10% move speed (60s)";
  }

  if (Math.random() < 0.5) {
    tempBuffs.push({
      time: CONFIG.BOOSTER_CRIT_DURATION,
      critChanceAdd: CONFIG.BOOSTER_CRIT_CHANCE_ADD,
      critDamageAdd: 0,
      fireRatePct: 0,
      rangePct: 0,
      speedPct: 0,
    });
    return "+20% crit chance (180s)";
  }
  tempBuffs.push({
    time: CONFIG.BOOSTER_CRIT_DURATION,
    critChanceAdd: 0,
    critDamageAdd: CONFIG.BOOSTER_CRIT_DAMAGE_ADD,
    fireRatePct: 0,
    rangePct: 0,
    speedPct: 0,
  });
  return "+50% crit damage (180s)";
}

const PERM_KEYS = ["critChance", "critDamage", "fireRate", "range", "speed", "damage"];

export function applyRandomPermanentUpgrade() {
  const key = PERM_KEYS[Math.floor(Math.random() * PERM_KEYS.length)];
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

export function getEffectiveStats() {
  const baseMove = CONFIG.PLAYER_BASE_MOVE_SPEED;
  const baseFire = CONFIG.PLAYER_BASE_FIRE_RATE;
  const baseRange = CONFIG.PLAYER_BASE_BULLET_RANGE;
  const baseDmg = CONFIG.PLAYER_BASE_DAMAGE;

  let tempCritChanceAdd = 0;
  let tempCritDamageAdd = 0;
  let tempFireRatePct = 0;
  let tempRangePct = 0;
  let tempSpeedPct = 0;

  for (const b of tempBuffs) {
    tempCritChanceAdd += b.critChanceAdd || 0;
    tempCritDamageAdd += b.critDamageAdd || 0;
    tempFireRatePct += b.fireRatePct || 0;
    tempRangePct += b.rangePct || 0;
    tempSpeedPct += b.speedPct || 0;
  }

  const permCritChance = clamp(
    CONFIG.BASE_CRIT_CHANCE + permanent.critChance,
    0,
    CONFIG.MAX_PERM_CRIT_CHANCE
  );

  let totalCritChance = permCritChance + tempCritChanceAdd;
  totalCritChance = clamp(totalCritChance, 0, CONFIG.MAX_TOTAL_CRIT_CHANCE);

  const critMult =
    CONFIG.BASE_CRIT_MULT *
    (1 + permanent.critDamagePct + tempCritDamageAdd);

  const moveSpeed = baseMove * (1 + permanent.speedPct + tempSpeedPct);
  const fireRate = baseFire * (1 + permanent.fireRatePct + tempFireRatePct);
  const range = baseRange * (1 + permanent.rangePct + tempRangePct);
  const damage = baseDmg * (1 + permanent.damagePct);

  const tempTimeLeft = tempBuffs.length
    ? Math.max(...tempBuffs.map((b) => b.time))
    : 0;

  return {
    moveSpeed,
    fireRate,
    range,
    damage,
    critChance: totalCritChance,
    critMult,
    tempCritTimeLeft: tempTimeLeft,
  };
}
