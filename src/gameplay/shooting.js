import { input } from '../core/input.js';
import { WEAPONS, LASER } from '../core/config.js';
import { normalize, linePointDistance } from '../core/math.js';
import { rollCrit } from '../core/crit.js';

export function handleShooting(world, dt) {
  const p = world.player;
  const w = p.weapon;
  const stats = world.stats;

  const baseFireRate = w.baseFireRate || 1;
  const totalFireRate = baseFireRate * stats.fireRateMul;
  const cooldown = 1 / totalFireRate;

  world.fireCooldown -= dt;

  const isFiring = input.mouseDown || true; // auto-fire

  if (!isFiring) return;
  if (world.fireCooldown > 0) return;

  world.fireCooldown = cooldown;

  if (w.id === 'pistol') {
    shootBullet(world, 1, 0);
  } else if (w.id === 'rifle') {
    shootBullet(world, 1.0, 0);
  } else if (w.id === 'shotgun') {
    shootShotgun(world);
  } else if (w.id === 'rocket') {
    shootRocket(world);
  } else if (w.id === 'laser') {
    shootLaser(world);
  }
}

function getAim(world) {
  const p = world.player;
  const cam = world.camera;
  // transform mouse screen to world
  const mx = world.mouseWorldX;
  const my = world.mouseWorldY;
  const dx = mx - p.x;
  const dy = my - p.y;
  const [nx, ny] = normalize(dx, dy);
  return { nx, ny };
}

function shootBullet(world, damageMul = 1, spread = 0) {
  const p = world.player;
  const w = p.weapon;
  const stats = world.stats;
  const { nx, ny } = getAim(world);

  const speed = (w.bulletSpeed || 700);
  const range = w.baseRange * stats.rangeMul;
  const life = range / speed;

  const baseDamage = w.baseDamage * stats.damageMul * damageMul;

  const bullet = {
    x: p.x,
    y: p.y,
    vx: nx * speed,
    vy: ny * speed,
    radius: 6,
    damage: baseDamage,
    life,
  };
  world.projectiles.push(bullet);
}

function shootShotgun(world) {
  const p = world.player;
  const w = p.weapon;
  const stats = world.stats;
  const { nx, ny } = getAim(world);

  const pellets = w.pellets || 6;
  const spread = w.spread || (Math.PI / 8);
  const speed = w.bulletSpeed || 720;
  const range = w.baseRange * stats.rangeMul;
  const life = range / speed;
  const baseDamage = w.baseDamage * stats.damageMul;

  for (let i = 0; i < pellets; i++) {
    const angleOffset = (Math.random() - 0.5) * spread;
    const cos = Math.cos(angleOffset);
    const sin = Math.sin(angleOffset);
    const dx = nx * cos - ny * sin;
    const dy = nx * sin + ny * cos;

    world.projectiles.push({
      x: p.x,
      y: p.y,
      vx: dx * speed,
      vy: dy * speed,
      radius: 5,
      damage: baseDamage,
      life,
    });
  }
}

function shootRocket(world) {
  const p = world.player;
  const w = p.weapon;
  const stats = world.stats;
  const { nx, ny } = getAim(world);

  const speed = w.rocketSpeed || 520;
  const range = w.baseRange * stats.rangeMul;
  const life = range / speed;
  const baseDamage = w.baseDamage * stats.damageMul;

  world.rockets.push({
    x: p.x,
    y: p.y,
    vx: nx * speed,
    vy: ny * speed,
    radius: 10,
    damage: baseDamage,
    splashRadius: w.splashRadius || 110,
    life,
  });
}

function shootLaser(world) {
  const p = world.player;
  const w = p.weapon;
  const stats = world.stats;
  const { nx, ny } = getAim(world);

  const range = w.baseRange * stats.rangeMul;
  const x1 = p.x;
  const y1 = p.y;
  const x2 = p.x + nx * range;
  const y2 = p.y + ny * range;

  const { isCrit, mult } = rollCrit(world);
  const base = w.baseDamage * stats.damageMul * 0.5;
  const damage = base * mult;

  const enemies = world.enemies;
  const thickness = LASER.thickness;

  for (let i = 0; i < enemies.length; i++) {
    const e = enemies[i];
    const d = linePointDistance(x1, y1, x2, y2, e.x, e.y);
    if (d < e.radius + thickness * 0.5) {
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
