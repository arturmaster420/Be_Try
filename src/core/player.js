import { CONFIG } from "./config.js";
import { input, isKeyDown } from "./input.js";
import { angleTo, normalize } from "./math.js";
import { getEffectiveStats } from "../gameplay/buffs.js";
import { spawnBullet } from "../gameplay/bullets.js";

export function createPlayer() {
  return {
    x: 0,
    y: 0,
    radius: CONFIG.PLAYER_RADIUS,
    hp: CONFIG.PLAYER_BASE_HP,
    maxHp: CONFIG.PLAYER_BASE_HP,
    lastShot: 0,
    facing: 0,
  };
}

export function resetPlayer(p) {
  p.x = 0;
  p.y = 0;
  p.hp = p.maxHp;
  p.lastShot = 0;
}

export function updatePlayer(player, world, dt) {
  const eff = getEffectiveStats();

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
  } else if (input.mouse.down) {
    const mx = world.camera.x + input.mouse.x;
    const my = world.camera.y + input.mouse.y;
    const dir = normalize(mx - player.x, my - player.y);
    player.x += dir.x * eff.moveSpeed * dt * 0.9;
    player.y += dir.y * eff.moveSpeed * dt * 0.9;
  }

  const r2 = player.x * player.x + player.y * player.y;
  const maxR = world.radius;
  if (r2 > maxR * maxR) {
    const len = Math.sqrt(r2) || 1;
    player.x = (player.x / len) * maxR;
    player.y = (player.y / len) * maxR;
  }

  const mx = world.camera.x + input.mouse.x;
  const my = world.camera.y + input.mouse.y;
  player.facing = angleTo(player.x, player.y, mx, my);

  player.lastShot += dt;
  const interval = 1 / eff.fireRate;
  if (input.mouse.down && player.lastShot >= interval) {
    spawnBullet(world, player, eff);
    player.lastShot = 0;
  }
}
