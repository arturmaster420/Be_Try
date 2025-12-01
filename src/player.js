import { CONFIG } from "./config.js";
import { angleTo, normalize } from "./math.js";
import { input, isKeyDown } from "./input.js";
import { getEffectiveStats } from "./buffs.js";
import { WEAPONS, weaponForLevel } from "./weapons.js";
import { spawnBulletPattern } from "./bullets.js";
import { spawnRocket } from "./rockets.js";

export function createPlayer() {
  return {
    x: 0,
    y: 0,
    radius: CONFIG.PLAYER_RADIUS,
    hp: CONFIG.PLAYER_BASE_HP,
    maxHp: CONFIG.PLAYER_BASE_HP,
    facing: 0,
    lastShot: 0,
    level: 1,
    xp: 0,
    xpToNext: CONFIG.XP_LEVEL_BASE,
  };
}

export function resetPlayer(p) {
  p.x = 0;
  p.y = 0;
  p.hp = p.maxHp;
  p.facing = 0;
  p.lastShot = 0;
  p.level = 1;
  p.xp = 0;
  p.xpToNext = CONFIG.XP_LEVEL_BASE;
}

export function updatePlayer(world, dt) {
  const p = world.player;
  const eff = getEffectiveStats();

  let dx = 0;
  let dy = 0;
  if (isKeyDown("KeyW") || isKeyDown("ArrowUp")) dy -= 1;
  if (isKeyDown("KeyS") || isKeyDown("ArrowDown")) dy += 1;
  if (isKeyDown("KeyA") || isKeyDown("ArrowLeft")) dx -= 1;
  if (isKeyDown("KeyD") || isKeyDown("ArrowRight")) dx += 1;

  if (dx || dy) {
    const n = normalize(dx, dy);
    p.x += n.x * eff.moveSpeed * dt;
    p.y += n.y * eff.moveSpeed * dt;
  }

  const r2 = p.x * p.x + p.y * p.y;
  if (r2 > world.radius * world.radius) {
    const len = Math.sqrt(r2) || 1;
    p.x = (p.x / len) * world.radius;
    p.y = (p.y / len) * world.radius;
  }

  const mxWorld = world.camera.x + input.mouse.x / world.camera.zoom;
  const myWorld = world.camera.y + input.mouse.y / world.camera.zoom;
  p.facing = angleTo(p.x, p.y, mxWorld, myWorld);

  const weaponId = weaponForLevel(p.level);
  world.weaponId = weaponId;
  world.weaponName = WEAPONS[weaponId].name;

  p.lastShot += dt;
  const weapon = WEAPONS[weaponId];
  const fireInterval = 1 / (eff.fireRate * weapon.fireRateMul);

  if (input.mouse.down && p.lastShot >= fireInterval) {
    if (weaponId === "rocket") {
      spawnRocket(world, eff);
    } else {
      spawnBulletPattern(world, eff, weapon);
    }
    p.lastShot = 0;
  }
}

export function grantXP(world, amount) {
  const p = world.player;
  p.xp += amount;
  while (p.xp >= p.xpToNext) {
    p.xp -= p.xpToNext;
    p.level += 1;
    p.xpToNext = Math.round(p.xpToNext * 1.35);
    world.messages.push({
      text: "Level up!",
      time: 2,
      color: "#ffd966",
    });
    world.onLevelGained();
  }
}
