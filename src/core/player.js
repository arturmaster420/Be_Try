import { PLAYER, CAMERA, XP } from './config.js';
import { clamp, normalize } from './math.js';
import { isKeyDown, input } from './input.js';
import { updateWeaponByLevel } from './weapons.js';

export function updatePlayer(world, dt) {
  const p = world.player;

  // movement input
  let ax = 0;
  let ay = 0;
  if (isKeyDown('w') || isKeyDown('arrowup')) ay -= 1;
  if (isKeyDown('s') || isKeyDown('arrowdown')) ay += 1;
  if (isKeyDown('a') || isKeyDown('arrowleft')) ax -= 1;
  if (isKeyDown('d') || isKeyDown('arrowright')) ax += 1;

  if (ax !== 0 || ay !== 0) {
    const [nx, ny] = normalize(ax, ay);
    const accel = PLAYER.accel * world.stats.moveMul;
    p.vx += nx * accel * dt;
    p.vy += ny * accel * dt;
  }

  // apply friction
  p.vx *= PLAYER.friction;
  p.vy *= PLAYER.friction;

  const maxSpeed = PLAYER.maxSpeed * world.stats.moveMul;
  const speed = Math.hypot(p.vx, p.vy);
  if (speed > maxSpeed) {
    const [nx, ny] = [p.vx / speed, p.vy / speed];
    p.vx = nx * maxSpeed;
    p.vy = ny * maxSpeed;
  }

  p.x += p.vx * dt;
  p.y += p.vy * dt;

  // clamp to world bounds
  p.x = clamp(p.x, 0, world.width || 9000);
  p.y = clamp(p.y, 0, world.height || 9000);

  // camera follows
  world.camera.x = p.x;
  world.camera.y = p.y;

  // camera zoom based on level: more level => more view => smaller zoom
  const lvl = p.level;
  const factor = CAMERA.zoomLevelFactor;
  world.camera.zoom = 1 / (1 + lvl * factor);

  world.runTime += dt;
}

// XP / leveling
export function addXP(world, amount) {
  const p = world.player;
  p.xp += amount;
  while (p.xp >= p.xpToNext) {
    p.xp -= p.xpToNext;
    p.level += 1;
    p.xpToNext = Math.floor(p.xpToNext * XP.levelScale);
    updateWeaponByLevel(world);
  }
}

// Damage / HP
export function damagePlayer(world, amount) {
  const p = world.player;
  p.hp -= amount;
  if (p.hp <= 0) {
    p.hp = 0;
    world.state = 'gameover';
    // update highscores
    world.bestScore = Math.max(world.bestScore, world.score);
    world.bestWave = Math.max(world.bestWave, world.wave);
    world.bestTime = Math.max(world.bestTime, world.runTime);
  }
}

export function healPlayer(world, amount) {
  const p = world.player;
  // no max HP cap
  p.hp += amount;
}
