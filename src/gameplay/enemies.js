import { CONFIG } from "../core/config.js";
import { randRange, dist2, normalize } from "../core/math.js";
import { applyBoosterBuff, applyRandomPermanentUpgrade } from "./buffs.js";

export function spawnEnemy(world, wave) {
  const angle = randRange(0, Math.PI * 2);
  const r = randRange(world.radius * 0.6, world.radius);
  const x = Math.cos(angle) * r;
  const y = Math.sin(angle) * r;

  const hpScale = 1 + wave * 0.1;
  const speedScale = 1 + wave * 0.04;

  world.enemies.push({
    x,
    y,
    radius: CONFIG.ENEMY_RADIUS,
    hp: CONFIG.ENEMY_BASE_HP * hpScale,
    maxHp: CONFIG.ENEMY_BASE_HP * hpScale,
    speed: CONFIG.ENEMY_BASE_SPEED * speedScale,
    color: "#ff4040",
    isBoss: false,
    isBooster: false,
    boosterKind: null,
    scoreValue: 6,
  });
}

export function spawnBoss(world, kind, wave) {
  const angle = randRange(0, Math.PI * 2);
  const r = randRange(world.radius * 0.4, world.radius * 0.9);
  const x = Math.cos(angle) * r;
  const y = Math.sin(angle) * r;

  const hpScale = CONFIG.BOSS_HP_MULT * (1 + wave * 0.14);
  const speedScale = CONFIG.BOSS_SPEED_MULT * (1 + wave * 0.05);

  let color = "#e045ff";
  let isBooster = false;
  let boosterKind = null;

  if (kind === "crit") {
    color = "#30d7ff";
    isBooster = true;
    boosterKind = "crit";
  } else if (kind === "utility") {
    color = "#30ff88";
    isBooster = true;
    boosterKind = "utility";
  }

  world.enemies.push({
    x,
    y,
    radius: CONFIG.BOSS_RADIUS,
    hp: CONFIG.ENEMY_BASE_HP * hpScale,
    maxHp: CONFIG.ENEMY_BASE_HP * hpScale,
    speed: CONFIG.ENEMY_BASE_SPEED * speedScale,
    color,
    isBoss: true,
    isBooster,
    boosterKind,
    scoreValue: isBooster ? 40 : 60,
  });
}

export function updateEnemies(world, dt) {
  const p = world.player;

  for (const e of world.enemies) {
    const dir = normalize(p.x - e.x, p.y - e.y);
    e.x += dir.x * e.speed * dt;
    e.y += dir.y * e.speed * dt;
  }

  // bullets vs enemies
  for (let i = world.bullets.length - 1; i >= 0; i--) {
    const b = world.bullets[i];
    let hit = false;

    for (let j = world.enemies.length - 1; j >= 0; j--) {
      const e = world.enemies[j];
      const rr = e.radius * 1.2 + b.radius;
      if (dist2(b.x, b.y, e.x, e.y) <= rr * rr) {
        e.hp -= b.damage;
        hit = true;

        if (e.hp <= 0) {
          world.score += e.scoreValue;
          world.waveKills += 1;
          world.player.xp += world.xpPerKill;

          if (e.isBoss) {
            if (e.isBooster) {
              const msg = applyBoosterBuff(e.boosterKind || "crit");
              world.messages.push({
                text: msg,
                time: 2.5,
                color: e.boosterKind === "utility" ? "#30ff88" : "#30d7ff",
              });
            } else {
              applyRandomPermanentUpgrade();
              world.messages.push({
                text: "Permanent boss upgrade",
                time: 2.5,
                color: "#e045ff",
              });
            }
          }

          // small chance of heal pickup from normal enemies
          if (!e.isBooster && Math.random() < 0.22) {
            world.pickups.push({
              x: e.x,
              y: e.y,
              radius: CONFIG.PICKUP_RADIUS,
              type: "heal",
            });
          }

          world.enemies.splice(j, 1);
        }

        if (hit) break;
      }
    }

    if (hit) {
      world.bullets.splice(i, 1);
    }
  }

  // enemies contact damage
  for (let i = world.enemies.length - 1; i >= 0; i--) {
    const e = world.enemies[i];
    const rr = e.radius + p.radius;
    if (dist2(e.x, e.y, p.x, p.y) <= rr * rr) {
      p.hp -= CONFIG.ENEMY_CONTACT_DMG * dt;
      if (p.hp <= 0) {
        p.hp = 0;
        world.state = "gameover";
      }
    }
  }
}
