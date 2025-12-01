import { linePointDistance, normalize } from "./math.js";
import { LASER } from "./config.js";

export function updateProjectiles(world, dt) {
  const bullets = world.bullets;
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.life -= dt;
    if (b.life <= 0) {
      bullets.splice(i, 1);
      continue;
    }

    for (const e of world.enemies) {
      const d = Math.hypot(e.x - b.x, e.y - b.y);
      if (d < e.radius + b.radius) {
        e.hp -= b.damage;
        b.life = -1;
        break;
      }
    }
    if (b.life <= 0) bullets.splice(i, 1);
  }

  const rockets = world.rockets;
  for (let i = rockets.length - 1; i >= 0; i--) {
    const r = rockets[i];
    r.x += r.vx * dt;
    r.y += r.vy * dt;
    r.life -= dt;
    if (r.life <= 0) {
      explodeRocket(world, r);
      rockets.splice(i, 1);
      continue;
    }

    for (const e of world.enemies) {
      const d = Math.hypot(e.x - r.x, e.y - r.y);
      if (d < e.radius + r.radius) {
        explodeRocket(world, r);
        rockets.splice(i, 1);
        break;
      }
    }
  }

  for (let i = world.laserBeams.length - 1; i >= 0; i--) {
    const beam = world.laserBeams[i];
    beam.ttl -= dt;
    if (beam.ttl <= 0) world.laserBeams.splice(i, 1);
  }
}

function explodeRocket(world, r) {
  world.explosions.push({
    x: r.x,
    y: r.y,
    radius: r.splashRadius,
    ttl: 0.25,
  });

  for (const e of world.enemies) {
    const d = Math.hypot(e.x - r.x, e.y - r.y);
    if (d < r.splashRadius + e.radius) {
      e.hp -= r.damage;
    }
  }
}

export function updateExplosions(world, dt) {
  for (let i = world.explosions.length - 1; i >= 0; i--) {
    const ex = world.explosions[i];
    ex.ttl -= dt;
    if (ex.ttl <= 0) world.explosions.splice(i, 1);
  }
}

export function fireLaser(world, damage, range) {
  const p = world.player;
  const mx = world.mouseWorldX;
  const my = world.mouseWorldY;
  const dx = mx - p.x;
  const dy = my - p.y;
  const [nx, ny] = normalize(dx, dy);
  const x1 = p.x;
  const y1 = p.y;
  const x2 = p.x + nx * range;
  const y2 = p.y + ny * range;

  for (const e of world.enemies) {
    const d = linePointDistance(x1, y1, x2, y2, e.x, e.y);
    if (d < e.radius + LASER.thickness * 0.5) {
      e.hp -= damage;
    }
  }

  world.laserBeams.push({
    x1,
    y1,
    x2,
    y2,
    ttl: LASER.beamLifetime,
  });
}
