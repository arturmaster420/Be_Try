import { fireLaser } from "./projectiles.js";

export function handleShooting(world, dt) {
  const weapon = world.currentWeapon;
  if (!weapon) return;

  if (world.fireCooldown > 0) {
    world.fireCooldown -= dt;
  }

  const isFiring = true;

  if (!isFiring || world.fireCooldown > 0) return;

  const totalFireRate = weapon.baseFireRate * world.stats.fireRateMul;
  const cooldown = 1 / totalFireRate;
  world.fireCooldown = cooldown;

  if (weapon.type === "bullet") fireBullet(world, weapon);
  else if (weapon.type === "shotgun") fireShotgun(world, weapon);
  else if (weapon.type === "rocket") fireRocket(world, weapon);
  else if (weapon.type === "laser") fireLaserWeapon(world, weapon);
}

function getAim(world) {
  const p = world.player;
  const mx = world.mouseWorldX;
  const my = world.mouseWorldY;
  const dx = mx - p.x;
  const dy = my - p.y;
  const len = Math.hypot(dx, dy) || 1;
  return { nx: dx / len, ny: dy / len };
}

function fireBullet(world, weapon) {
  const p = world.player;
  const { nx, ny } = getAim(world);
  const speed = weapon.bulletSpeed;
  const range = weapon.baseRange * world.stats.rangeMul;
  const life = range / speed;
  const damage = weapon.baseDamage * world.stats.damageMul;

  world.bullets.push({
    x: p.x,
    y: p.y,
    vx: nx * speed,
    vy: ny * speed,
    radius: 6,
    damage,
    life,
  });
}

function fireShotgun(world, weapon) {
  const p = world.player;
  const { nx, ny } = getAim(world);
  const pellets = weapon.pellets || 6;
  const spread = weapon.spread || Math.PI / 8;
  const speed = weapon.bulletSpeed;
  const range = weapon.baseRange * world.stats.rangeMul;
  const life = range / speed;
  const baseDamage = weapon.baseDamage * world.stats.damageMul;

  for (let i = 0; i < pellets; i++) {
    const angleOffset = (Math.random() - 0.5) * spread;
    const cos = Math.cos(angleOffset);
    const sin = Math.sin(angleOffset);
    const dx = nx * cos - ny * sin;
    const dy = nx * sin + ny * cos;
    world.bullets.push({
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

function fireRocket(world, weapon) {
  const p = world.player;
  const { nx, ny } = getAim(world);
  const speed = weapon.rocketSpeed;
  const range = weapon.baseRange * world.stats.rangeMul;
  const life = range / speed;
  const damage = weapon.baseDamage * world.stats.damageMul;

  world.rockets.push({
    x: p.x,
    y: p.y,
    vx: nx * speed,
    vy: ny * speed,
    radius: 10,
    splashRadius: weapon.splashRadius,
    damage,
    life,
  });
}

function fireLaserWeapon(world, weapon) {
  const damage = weapon.baseDamage * world.stats.damageMul * 0.5;
  const range = weapon.baseRange * world.stats.rangeMul;
  fireLaser(world, damage, range);
}
