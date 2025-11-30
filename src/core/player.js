import { CONFIG } from "./config.js";
import { angleTo, normalize } from "./math.js";
import { input, isKeyDown } from "./input.js";
import { getEffectiveStats } from "../gameplay/buffs.js";
import { spawnBulletPattern } from "../gameplay/bullets.js";

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
  p.lastShot = 0;
  p.level = 1;
  p.xp = 0;
  p.xpToNext = CONFIG.XP_LEVEL_BASE;
}

export function updatePlayer(world, dt, weaponSystem) {
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

  const mxWorld = world.camera.x + input.mouse.x;
  const myWorld = world.camera.y + input.mouse.y;
  p.facing = angleTo(p.x, p.y, mxWorld, myWorld);

  weaponSystem.updateCurrentWeapon(world);

  p.lastShot += dt;
  const weapon = weaponSystem.getWeapon(world);
  const fireInterval = 1 / (eff.fireRate * weapon.fireRateMul);

  if (input.mouse.down && p.lastShot >= fireInterval) {
    spawnBulletPattern(world, eff, weapon);
    p.lastShot = 0;
  }
}
