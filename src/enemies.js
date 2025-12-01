import { randRange } from "./math.js";
import { gainXp } from "./world.js";

// обычные волны + босс-волны + booster-боссы

export function spawnWave(world, kind = "normal") {
  if (kind === "boss") {
    spawnBoss(world);
    // небольшой шанс добавить booster вместе с боссом
    if (Math.random() < 0.4) {
      spawnBoosterBoss(world);
    }
  } else {
    const count = 6 + world.wave * 2;
    for (let i = 0; i < count; i++) {
      spawnEnemy(world);
    }
    // шанс на booster-босса
    if (Math.random() < 0.35) {
      spawnBoosterBoss(world);
    }
  }
}

export function spawnEnemy(world) {
  const p = world.player;

  const baseRadius = (world.canvasWidth / world.camera.zoom) * 0.6;
  const dist = randRange(baseRadius * 1.2, baseRadius * 2.0);
  const angle = randRange(0, Math.PI * 2);

  const hpBase = 45 + world.wave * 7;

  const e = {
    id: world.nextEnemyId++,
    type: "normal",
    x: p.x + Math.cos(angle) * dist,
    y: p.y + Math.sin(angle) * dist,
    radius: 18,
    speed: 65 + world.wave * 1.7,
    hp: hpBase,
    maxHp: hpBase,
  };
  world.enemies.push(e);
}

export function spawnBoss(world) {
  const p = world.player;

  const baseRadius = (world.canvasWidth / world.camera.zoom) * 0.7;
  const dist = randRange(baseRadius * 1.3, baseRadius * 2.2);
  const angle = randRange(0, Math.PI * 2);

  const hpBase = 420 + world.wave * 40;

  const e = {
    id: world.nextEnemyId++,
    type: "boss",
    x: p.x + Math.cos(angle) * dist,
    y: p.y + Math.sin(angle) * dist,
    radius: 32,
    speed: 52 + world.wave * 1.2,
    hp: hpBase,
    maxHp: hpBase,
  };
  world.enemies.push(e);
}

export function spawnBoosterBoss(world) {
  const p = world.player;

  const baseRadius = (world.canvasWidth / world.camera.zoom) * 0.7;
  const dist = randRange(baseRadius * 1.0, baseRadius * 1.8);
  const angle = randRange(0, Math.PI * 2);

  const hpBase = 120 + world.wave * 12;

  const e = {
    id: world.nextEnemyId++,
    type: "booster",
    x: p.x + Math.cos(angle) * dist,
    y: p.y + Math.sin(angle) * dist,
    radius: 24,
    speed: 90 + world.wave * 2.0,
    hp: hpBase,
    maxHp: hpBase,
  };
  world.enemies.push(e);
}

export function updateEnemies(world, dt) {
  const p = world.player;
  for (const e of world.enemies) {
    const dx = p.x - e.x;
    const dy = p.y - e.y;
    const dist = Math.hypot(dx, dy) || 1;
    const sp = e.speed * dt;
    e.x += (dx / dist) * sp;
    e.y += (dy / dist) * sp;

    if (dist < e.radius + p.radius) {
      p.hp -= 12 * dt;
      if (p.hp <= 0) {
        p.hp = 0;
        world.state = "gameover";
      }
    }
  }
}

export function handleEnemyDeaths(world) {
  for (let i = world.enemies.length - 1; i >= 0; i--) {
    const e = world.enemies[i];
    if (e.hp <= 0) {
      world.enemies.splice(i, 1);
      world.score += e.type === "boss" ? 120 : e.type === "booster" ? 80 : 20;
      gainXp(world, e.type === "boss" ? 80 : e.type === "booster" ? 40 : 15);

      if (e.type === "boss") {
        applyBossBuff(world);
      } else if (e.type === "booster") {
        applyBoosterBuff(world);
      } else {
        if (Math.random() < 0.25) {
          world.pickups.push({
            x: e.x,
            y: e.y,
            radius: 10,
            kind: "hp",
          });
        }
      }
    }
  }
}

// ---- Баффы ----

function applyBossBuff(world) {
  const stats = world.stats;
  const roll = Math.random();
  let text = "";

  if (roll < 0.25) {
    stats.damageMul *= 1.10;
    text = "+10% DAMAGE (perm)";
  } else if (roll < 0.5) {
    stats.fireRateMul *= 1.10;
    text = "+10% FIRE RATE (perm)";
  } else if (roll < 0.75) {
    stats.rangeMul *= 1.10;
    text = "+10% RANGE (perm)";
  } else {
    stats.moveMul *= 1.06;
    text = "+6% MOVE SPEED (perm)";
  }

  world.lastBossBuffText = text;
}

function applyBoosterBuff(world) {
  const stats = world.stats;
  const roll = Math.random();
  let text = "";

  if (roll < 0.33) {
    stats.damageMul *= 1.20;
    text = "+20% DAMAGE (short boost)";
  } else if (roll < 0.66) {
    stats.fireRateMul *= 1.20;
    text = "+20% FIRE RATE (short boost)";
  } else {
    stats.rangeMul *= 1.20;
    text = "+20% RANGE (short boost)";
  }

  world.lastBoosterBuffText = text;
}
