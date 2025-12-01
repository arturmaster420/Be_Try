export const WORLD = {
  width: 9000,
  height: 9000,
};

export const PLAYER = {
  radius: 22,
  baseSpeed: 220,
};

export const WEAPON_ORDER = [
  "pistol",
  "rifle",
  "shotgun",
  "rocket",
  "laser",
];

export const WEAPONS = {
  pistol: {
    id: "pistol",
    name: "Pistol",
    baseDamage: 26,
    baseFireRate: 1.4,
    baseRange: 680,
    bulletSpeed: 820,
    type: "bullet",
  },
  rifle: {
    id: "rifle",
    name: "Rifle",
    baseDamage: 16,
    baseFireRate: 3.5,
    baseRange: 780,
    bulletSpeed: 980,
    type: "bullet",
  },
  shotgun: {
    id: "shotgun",
    name: "Shotgun",
    baseDamage: 10,
    baseFireRate: 1.5,
    baseRange: 520,
    bulletSpeed: 880,
    pellets: 7,
    spread: Math.PI / 7,
    type: "shotgun",
  },
  rocket: {
    id: "rocket",
    name: "Rocket Launcher",
    baseDamage: 95,
    baseFireRate: 0.8,
    baseRange: 820,
    rocketSpeed: 620,
    splashRadius: 130,
    type: "rocket",
  },
  laser: {
    id: "laser",
    name: "Laser Beam",
    baseDamage: 40,
    baseFireRate: 2.0,
    baseRange: 700,
    type: "laser",
  },
};

export const LASER = {
  thickness: 8,
  beamLifetime: 0.08,
};

export const STATS_BASE = {
  damageMul: 1.0,
  fireRateMul: 1.0,
  rangeMul: 1.0,
  moveMul: 1.0,
  critChancePermanent: 0.0,
  critChanceTemp: 0.0,
  critChanceTempTimer: 0,
  critMult: 2.0,
};
