import { CONFIG } from "./config.js";
import { input, isKeyDown } from "./input.js";
import { angleTo, normalize } from "./../core/math.js";
import { getEffectiveStats } from "../gameplay/buffs.js";
import { spawnBullet } from "../gameplay/bullets.js";

export function createPlayer() {
  return {
    x: 0,
    y: 0,
    radius: CONFIG.PLAYER_RADIUS,
    hp: CONFIG.PLAYER_BASE_HP,
    maxHp: CONFIG.PLAYER_BASE_HP,
    lastShotTime: 0,
    facing: 0,
  };
}

export function resetPlayer(player) {
  player.x = 0;
  player.y = 0;
  player.hp = player.maxHp;
  player.lastShotTime = 0;
}

export function updatePlayer(player, world, dt) {
  const eff = getEffectiveStats();

  // movement
  let dx = 0;
  let dy = 0;
  if (isKeyDown("KeyW") || isKeyDown("ArrowUp")) dy -= 1;
  if (isKeyDown("KeyS") || isKeyDown("ArrowDown")) dy += 1;
  if (isKeyDown("KeyA") || isKeyDown("ArrowLeft")) dx -= 1;
  if (isKeyDown("KeyD") || isKeyDown("ArrowRight")) dx += 1;

  if (dx || dy) {
    const n = normalize(dx, dy);
    player.x += n.x * eff.moveSpeed * dt;
    player.y += n.y * eff.moveSpeed * dt;
  }

  // clamp to world radius
  const r2 = player.x * player.x + player.y * player.y;
  const maxR = world.radius;
  if (r2 > maxR * maxR) {
    const len = Math.sqrt(r2) || 1;
    player.x = (player.x / len) * maxR;
    player.y = (player.y / len) * maxR;
  }

  // aim towards mouse in world space
  const mxWorld = world.camera.x + input.mouse.x;
  const myWorld = world.camera.y + input.mouse.y;
  player.facing = angleTo(player.x, player.y, mxWorld, myWorld);

  // shooting
  player.lastShotTime += dt;
  const fireInterval = 1 / eff.fireRate;

  if (input.mouse.down && player.lastShotTime >= fireInterval) {
    spawnBullet(world, player, eff);
    player.lastShotTime = 0;
  }
}
