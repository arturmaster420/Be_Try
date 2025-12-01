import { CONFIG } from "./config.js";
import { rollCrit, computeDamage } from "./crit.js";
import { dist2 } from "./math.js";

export function spawnRocket(world, eff) {
  const p = world.player;
  const dirX = Math.cos(p.facing);
  const dirY = Math.sin(p.facing);
  const isCrit = rollCrit(eff.critChance);
  const dmg = computeDamage(
    eff.damage * CONFIG.ROCKET_DIRECT_MULT,
    isCrit,
    eff.critMult
  );
  world.rockets.push({
    x: p.x + dirX * (p.radius + 8),
    y: p.y + dirY * (p.radius + 8),
    vx: dirX * CONFIG.ROCKET_SPEED,
    vy: dirY * CONFIG.ROCKET_SPEED,
    radius: CONFIG.ROCKET_RADIUS,
    damage: dmg,
    isCrit,
  });
}

export function updateRockets(world, dt) {
  for (let i = world.rockets.length - 1; i >= 0; i--) {
    const r = world.rockets[i];
    r.x += r.vx * dt;
    r.y += r.vy * dt;

    let hit = false;
    for (let j = world.enemies.length - 1; j >= 0; j--) {
      const e = world.enemies[j];
      const rr = e.radius + r.radius;
      if (dist2(r.x, r.y, e.x, e.y) <= rr * rr) {
        explodeRocket(world, r, j);
        hit = true;
        break;
      }
    }

    if (
      !hit &&
      r.x * r.x + r.y * r.y >
        (world.radius + CONFIG.ROCKET_EXPLOSION_RADIUS) ** 2
    ) {
      world.rockets.splice(i, 1);
    }
  }
}

function explodeRocket(world, rocket, directIndex) {
  const explosionR2 = CONFIG.ROCKET_EXPLOSION_RADIUS ** 2;
  for (let j = world.enemies.length - 1; j >= 0; j--) {
    const e = world.enemies[j];
    const d2 = dist2(rocket.x, rocket.y, e.x, e.y);
    if (d2 <= explosionR2) {
      const distFactor =
        j === directIndex ? 1 : CONFIG.ROCKET_SPLASH_MULT;
      e.hp -= rocket.damage * distFactor;
      world.hitEffects.push({
        x: e.x,
        y: e.y,
        radius: e.radius * 1.4,
        time: 0.16,
      });
      if (e.hp <= 0) {
        world.killEnemy(j);
        j--;
      }
    }
  }
  world.rockets.splice(world.rockets.indexOf(rocket), 1);
  world.explosions.push({
    x: rocket.x,
    y: rocket.y,
    radius: CONFIG.ROCKET_EXPLOSION_RADIUS,
    time: 0.18,
  });
}
