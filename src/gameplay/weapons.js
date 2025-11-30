export const WEAPONS = {
  pistol: {
    id: "pistol",
    name: "Pistol",
    fireRateMul: 1.0,
    damageMul: 1.0,
    bulletsPerShot: 1,
    spread: 0.02
  },
  rifle: {
    id: "rifle",
    name: "Rifle",
    fireRateMul: 1.8,
    damageMul: 0.75,
    bulletsPerShot: 1,
    spread: 0.03
  },
  shotgun: {
    id: "shotgun",
    name: "Shotgun",
    fireRateMul: 0.6,
    damageMul: 0.9,
    bulletsPerShot: 6,
    spread: 0.25
  }
};

export function getWeaponListForLevel(level) {
  const list = ["pistol"];
  if (level >= 2) list.push("rifle");
  if (level >= 4) list.push("shotgun");
  return list;
}
