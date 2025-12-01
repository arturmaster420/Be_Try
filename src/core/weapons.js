import { WEAPONS } from './config.js';

export function getWeaponForLevel(level) {
  if (level >= 20) return WEAPONS.laser;
  if (level >= 15) return WEAPONS.rocket;
  if (level >= 10) return WEAPONS.shotgun;
  if (level >= 5) return WEAPONS.rifle;
  return WEAPONS.pistol;
}

export function updateWeaponByLevel(world) {
  const w = getWeaponForLevel(world.player.level);
  world.player.weapon = w;
}
