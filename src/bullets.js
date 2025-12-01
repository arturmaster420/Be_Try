import { CONFIG } from "./config.js";
import { rollCrit, computeDamage } from "./crit.js";

export function spawnBulletPattern(world, eff, weapon) {
  const p = world.player;
  const baseAngle = p.facing;
  const count = weapon.bulletsPerShot || 1;
  const spread = weapon.spread || 0;

  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const offset = (t - 0.5) * spread;
    const ang = baseAngle + offset;
    const dirX = Math.cos(ang);
    const dirY = Math.sin(ang);
    const isCrit = rollCrit(eff.critChance);
    const dmg = computeDamage(
      eff.damage * weapon.damageMul,
      isCrit,
      eff.critMult
    );

    world.bullets.push({
      x: p.x + dirX * (p.radius + 6),
      y: p.y + dirY * (p.radius + 6),
      vx: dirX * CONFIG.BULLET_SPEED,
      vy: dirY * CONFIG.BULLET_SPEED,
      radius: CONFIG.BULLET_RADIUS,
      isCrit,
      damage: dmg,
      traveled: 0,
      maxDist: eff.range,
    });
  }
}

export function updateBullets(world, dt) {
  for (let i = world.bullets.length - 1; i >= 0; i--) {
    const b = world.bullets[i];
    const dx = b.vx * dt;
    const dy = b.vy * dt;
    b.x += dx;
    b.y += dy;
    b.traveled += Math.hypot(dx, dy);
    if (b.traveled >= b.maxDist) {
      world.bullets.splice(i, 1);
    }
  }
}
