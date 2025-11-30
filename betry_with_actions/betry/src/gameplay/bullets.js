import { CONFIG } from "../core/config.js";
import { computeDamage, rollCrit } from "./crit.js";

export function spawnBullet(world, player, eff) {
  const dirX = Math.cos(player.facing);
  const dirY = Math.sin(player.facing);
  const isCrit = rollCrit(eff.critChance);
  const dmg = computeDamage(eff.damage, isCrit, eff.critMult);

  const bullet = {
    x: player.x + dirX * (player.radius + 6),
    y: player.y + dirY * (player.radius + 6),
    vx: dirX * CONFIG.BULLET_SPEED,
    vy: dirY * CONFIG.BULLET_SPEED,
    radius: CONFIG.BULLET_RADIUS,
    damage: dmg,
    isCrit,
    traveled: 0,
    maxDist: eff.range,
  };

  world.bullets.push(bullet);
}

export function updateBullets(world, dt) {
  const bullets = world.bullets;
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    const dx = b.vx * dt;
    const dy = b.vy * dt;
    b.traveled += Math.hypot(dx, dy);
    if (b.traveled >= b.maxDist) {
      bullets.splice(i, 1);
      continue;
    }
  }
}
