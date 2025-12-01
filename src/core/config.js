// Global game configuration

export const WORLD = {
  width: 9000,
  height: 9000,
};

export const CAMERA = {
  baseZoom: 1.0,
  zoomLevelFactor: 0.03, // each level slightly zooms out
};

export const PLAYER = {
  radius: 18,
  baseMoveSpeed: 220,
  accel: 1800,
  maxSpeed: 320,
  friction: 0.9,
  startHP: 100,
};

export const WEAPONS = {
  pistol: {
    id: 'pistol',
    name: 'Pistol',
    baseDamage: 10,
    baseFireRate: 1.5, // reduced, used with global fireRate multiplier
    baseRange: 650,
    bulletSpeed: 680,
  },
  rifle: {
    id: 'rifle',
    name: 'Rifle',
    baseDamage: 7,
    baseFireRate: 4.0,
    baseRange: 750,
    bulletSpeed: 880,
  },
  shotgun: {
    id: 'shotgun',
    name: 'Shotgun',
    pellets: 6,
    spread: Math.PI / 8,
    baseDamage: 5,
    baseFireRate: 1.2,
    baseRange: 520,
    bulletSpeed: 720,
  },
  rocket: {
    id: 'rocket',
    name: 'Rocket',
    baseDamage: 40,
    splashRadius: 110,
    baseFireRate: 0.8,
    baseRange: 900,
    rocketSpeed: 520,
  },
  laser: {
    id: 'laser',
    name: 'Laser',
    baseDamage: 10, // will be multiplied by 0.5 and crit etc.
    baseFireRate: 2.0,
    baseRange: 650,
  },
};

export const STATS = {
  baseCritChance: 0.0,
  baseCritMult: 2.0,
  maxPermanentCritChance: 0.7,
  maxTotalCritChance: 0.9,
  baseFireRateMul: 1.0,
  baseRangeMul: 1.0,
  baseMoveMul: 1.0,
  baseDamageMul: 1.0,
};

export const XP = {
  baseToLevel: 60,
  levelScale: 1.25,
  enemyXP: 8,
  bossXP: 50,
};

export const ENEMIES = {
  normal: {
    radius: 16,
    speed: 120,
    hp: 30,
    damage: 10,
  },
  fast: {
    radius: 13,
    speed: 200,
    hp: 20,
    damage: 8,
  },
  tank: {
    radius: 22,
    speed: 80,
    hp: 85,
    damage: 18,
  },
  boss: {
    radius: 38,
    speed: 90,
    hp: 400,
    damage: 30,
  },
  boosterBoss: {
    radius: 30,
    speed: 120,
    hp: 260,
    damage: 18,
  },
};

export const PICKUPS = {
  hp: {
    radius: 10,
    healAmount: 10, // unlimited HP, +10 per pickup
  },
  xpOrb: {
    radius: 9,
  },
};

export const WAVES = {
  baseEnemies: 10,
  perWaveIncrease: 4,
  bossEvery: 5,
  boosterChance: 0.2,
};

export const LASER = {
  beamLifetime: 0.08,
  thickness: 8,
};
