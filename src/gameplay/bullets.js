import { dist } from '../core/math.js';
import { rollCrit } from '../core/crit.js';
import { LASER } from '../core/config.js';

export function updateProjectiles(world, dt) {
  const bullets = world.projectiles;
  const enemies = world.enemies;

  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;

    if (b.life <= 0) {
      bullets.splice(i, 1);
      continue;
    }

    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      const d = dist(b, e);
      if (d < e.radius + b.radius) {
        const { isCrit, mult } = rollCrit(world);
        const dmg = b.damage * mult;
        e.hp -= dmg;
        bullets.splice(i, 1);
        break;
      }
    }
  }

  // rockets
  updateRockets(world, dt);
  // laser beams lifetime
  for (let i = world.laserBeams.length - 1; i >= 0; i--) {
    const beam = world.laserBeams[i];
    beam.ttl -= dt;
    if (beam.ttl <= 0) world.laserBeams.splice(i, 1);
  }
}

// Rockets with splash damage
export function updateRockets(world, dt) {
  const rockets = world.rockets;
  const enemies = world.enemies;

  for (let i = rockets.length - 1; i >= 0; i--) {
    const r = rockets[i];
    r.x += r.vx * dt;
    r.y += r.vy * dt;
    r.life -= dt;

    if (r.life <= 0) {
      explode(world, r);
      rockets.splice(i, 1);
      continue;
    }

    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      const d = dist(r, e);
      if (d < e.radius + r.radius) {
        explode(world, r);
        rockets.splice(i, 1);
        break;
      }
    }
  }
}

function explode(world, rocket) {
  const enemies = world.enemies;
  const radius = rocket.splashRadius;
  const { isCrit, mult } = rollCrit(world);

  for (let j = enemies.length - 1; j >= 0; j--) {
    const e = enemies[j];
    const d = dist(rocket, e);
    if (d < radius + e.radius) {
      const falloff = 1 - d / (radius + e.radius);
      const dmg = rocket.damage * falloff * mult;
      e.hp -= dmg;
    }
  }

  world.explosions.push({
    x: rocket.x,
    y: rocket.y,
    radius,
    ttl: 0.25,
  });
}

// Laser damage is handled when firing
