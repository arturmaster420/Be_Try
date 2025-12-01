export const WEAPONS = {
  pistol: {
    id: "pistol",
    name: "Pistol",
    fireRateMul: 1.0,
    damageMul: 1.0,
    bulletsPerShot: 1,
    spread: 0.02,
  },
  rifle: {
    id: "rifle",
    name: "Rifle",
    fireRateMul: 1.8,
    damageMul: 0.75,
    bulletsPerShot: 1,
    spread: 0.03,
  },
  shotgun: {
    id: "shotgun",
    name: "Shotgun",
    fireRateMul: 0.6,
    damageMul: 0.9,
    bulletsPerShot: 6,
    spread: 0.28,
  },
  rocket: {
    id: "rocket",
    name: "Rocket Launcher",
    fireRateMul: 0.55,
    damageMul: 1.3,
    bulletsPerShot: 1,
    spread: 0,
  },
};

export function weaponForLevel(level) {
  if (level >= 15) return "rocket";
  if (level >= 10) return "shotgun";
  if (level >= 5) return "rifle";
  return "pistol";
}
