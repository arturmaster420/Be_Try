import { WEAPONS, getWeaponListForLevel } from "./weapons.js";
import { applyRandomPermanentUpgrade } from "./buffs.js";

export function createWeaponSystem() {
  return {
    onLevelGained(world) {
      applyRandomPermanentUpgrade();
      updateWeaponFromLevel(world);
    },
    updateCurrentWeapon(world) {
      updateWeaponFromLevel(world);
    },
    getWeapon(world) {
      return WEAPONS[world.weaponId] || WEAPONS.pistol;
    },
  };
}

function updateWeaponFromLevel(world) {
  const level = world.player.level || 1;
  const list = getWeaponListForLevel(level);
  // use highest unlocked weapon automatically
  const lastId = list[list.length - 1] || "pistol";
  world.weaponId = lastId;
  world.weaponName = WEAPONS[lastId].name;
}
