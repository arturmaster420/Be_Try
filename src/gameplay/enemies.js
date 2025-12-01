import { ENEMIES, WORLD, WAVES } from './config.js';
import { randRange, normalize } from './math.js';
import { addXP, damagePlayer } from './player.js';
import { PICKUPS, XP } from './config.js';

export function spawnWave(world) {
  world.pendingSpawn = [];

  const count = WAVES.baseEnemies + (world.wave - 1) * WAVES.perWaveIncrease;
  for (let i = 0; i < count; i++) {
    const type = i % 3 === 0 ? 'fast' : i % 5 === 0 ? 'tank' : 'normal';
    world.pendingSpawn.push({ type });
  }

  // boss
  if (world.wave % WAVES.bossEvery === 0) {
    world.pendingSpawn.push({ type: 'boss' });
  }

  // booster boss chance
  if (Math.random() < WAVES.boosterChance) {
    world.pendingSpawn.push({ type: 'boosterBoss' });
  }

  world.spawnTimer = 0;
}

export function updateSpawns(world, dt) {
  world.spawnTimer -= dt;
  if (world.spawnTimer > 0) return;
  const batch = 4;
  world.spawnTimer = 1.0;

  for (let i = 0; i < batch && world.pendingSpawn.length > 0; i++) {
    const next = world.pendingSpawn.pop();
    spawnEnemy(world, next.type);
  }

  if (world.pendingSpawn.length === 0 && world.enemies.length === 0) {
    // next wave
    world.wave += 1;
    spawnWave(world);
  }
}

function spawnEnemy(world, type) {
  const data = ENEMIES[type];
  const p = world.player;

  const viewRadius = Math.min(world.canvasWidth, world.canvasHeight) * 0.7 / world.camera.zoom;
  const dist = viewRadius + 260; // spawn just outside view, not too far

  const angle = randRange(0, Math.PI * 2);
  const x = p.x + Math.cos(angle) * dist;
  const y = p.y + Math.sin(angle) * dist;

  const enemy = {
    type,
    x,
    y,
    vx: 0,
    vy: 0,
    radius: data.radius,
    speed: data.speed,
    hp: data.hp,
    damage: data.damage,
  };
  world.enemies.push(enemy);
}

export function updateEnemies(world, dt) {
  const p = world.player;

  for (let i = world.enemies.length - 1; i >= 0; i--) {
    const e = world.enemies[i];

    // move towards player
    const [nx, ny] = normalize(p.x - e.x, p.y - e.y);
    e.vx = nx * e.speed;
    e.vy = ny * e.speed;

    e.x += e.vx * dt;
    e.y += e.vy * dt;

    // collision with player
    const dx = e.x - p.x;
    const dy = e.y - p.y;
    const distSq = dx * dx + dy * dy;
    const rad = e.radius + p.radius;
    if (distSq < rad * rad) {
      damagePlayer(world, e.damage);
      // small knockback
      p.x -= nx * 18;
      p.y -= ny * 18;
    }

    if (e.hp <= 0) {
      onEnemyKilled(world, e);
      world.enemies.splice(i, 1);
    }
  }
}

function onEnemyKilled(world, enemy) {
  const p = world.player;
  world.score += 10;

  if (enemy.type === 'boss') {
    addXP(world, XP.bossXP);
    spawnRandomPermanentBuff(world, enemy.x, enemy.y);
  } else if (enemy.type === 'boosterBoss') {
    addXP(world, XP.bossXP);
    spawnBoosterBuff(world, enemy.x, enemy.y);
  } else {
    addXP(world, XP.enemyXP);
  }

  // chance to drop HP pickup
  if (Math.random() < 0.18) {
    world.pickups.push({
      kind: 'hp',
      x: enemy.x,
      y: enemy.y,
      radius: PICKUPS.hp.radius,
    });
  }
}

import { applyPermanentCritChanceBonus, applyTempCritChanceBonus, applyTempCritDamageBonus } from './crit.js';

function spawnRandomPermanentBuff(world, x, y) {
  // Each boss kill grants random permanent buff
  const options = ['critChance', 'critDamage', 'fireRate', 'range', 'move', 'damage'];
  const pick = options[Math.floor(Math.random() * options.length)];
  switch (pick) {
    case 'critChance':
      applyPermanentCritChanceBonus(world, 0.01);
      break;
    case 'critDamage':
      world.stats.critMult += 0.05;
      break;
    case 'fireRate':
      world.stats.fireRateMul += 0.01;
      break;
    case 'range':
      world.stats.rangeMul += 0.01;
      break;
    case 'move':
      world.stats.moveMul += 0.01;
      break;
    case 'damage':
      world.stats.damageMul += 0.01;
      break;
  }
}

function spawnBoosterBuff(world, x, y) {
  // booster boss -> temporary crit / crit damage buffs
  const choice = Math.random() < 0.5 ? 'critChance' : 'critDamage';
  if (choice === 'critChance') {
    applyTempCritChanceBonus(world, 0.2, 180);
  } else {
    applyTempCritDamageBonus(world, 1.5, 180);
  }
}
