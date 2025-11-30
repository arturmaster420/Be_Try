import { CONFIG } from "../core/config.js";
import { randRange, dist2, normalize } from "../core/math.js";
import { applyBoosterBuff, applyRandomPermanentUpgrade } from "./buffs.js";

export function spawnEnemy(world, wave) {
  const angle = randRange(0, Math.PI * 2);
  const radius = randRange(world.radius * 0.7, world.radius);
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  const hpScale = 1 + wave * 0.08;
  const speedScale = 1 + wave * 0.03;

  world.enemies.push({
    x,
    y,
    radius: CONFIG.ENEMY_RADIUS,
    hp: CONFIG.ENEMY_BASE_HP * hpScale,
    maxHp: CONFIG.ENEMY_BASE_HP * hpScale,
    speed: CONFIG.ENEMY_BASE_SPEED * speedScale,
    color: CONFIG.ENEMY_COLOR,
    isBoss: false,
    isBooster: false,
    boosterKind: null,
    scoreValue: 5,
  });
}

export function spawnBoss(world, kind = "normal", wave = 1) {
  const angle = randRange(0, Math.PI * 2);
  const radius = randRange(world.radius * 0.7, world.radius);
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  const hpScale = CONFIG.BOSS_HP_MULT * (1 + wave * 0.1);
  const speedScale = CONFIG.BOSS_SPEED_MULT * (1 + wave * 0.05);

  const isBooster = kind !== "normal";
  let color = CONFIG.BOSS_COLOR;
  if (kind === "crit") color = CONFIG.BOOSTER_CRIT_COLOR;
  if (kind === "utility") color = CONFIG.BOOSTER_UTILITY_COLOR;

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
    boosterKind: isBooster ? kind : null,
    scoreValue: isBooster ? 40 : 60,
  });
}

export function updateEnemies(world, dt) {
  const enemies = world.enemies;
  const bullets = world.bullets;
  const player = world.player;

  for (const e of enemies) {
    const d = normalize(player.x - e.x, player.y - e.y);
    e.x += d.x * e.speed * dt;
    e.y += d.y * e.speed * dt;
  }

  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    let hit = false;
    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      const r = b.radius + e.radius * 1.1;
      if (dist2(b.x, b.y, e.x, e.y) <= r * r) {
        e.hp -= b.damage;
        hit = true;
        world.hitEffects.push({ x: e.x, y: e.y, radius: e.radius * 1.3, time: 0.12 });

        if (e.hp <= 0) {
          world.score += e.scoreValue;
          world.waveKills += 1;

          if (e.isBoss) {
            if (e.isBooster) {
              const desc = applyBoosterBuff(e.boosterKind || "crit");
              world.messages.push({
                text: desc,
                time: 3.5,
                color:
                  e.boosterKind === "utility"
                    ? CONFIG.BOOSTER_UTILITY_COLOR
                    : CONFIG.BOOSTER_CRIT_COLOR,
              });
            } else {
              applyRandomPermanentUpgrade();
              world.messages.push({
                text: "Permanent boss upgrade! (+1% random stat)",
                time: 3.5,
                color: CONFIG.BOSS_COLOR,
              });
            }
          }

          if (!e.isBooster && Math.random() < 0.2) {
            world.pickups.push({
              x: e.x,
              y: e.y,
              radius: CONFIG.PICKUP_RADIUS,
              type: "heal",
            });
          }

          enemies.splice(j, 1);
        }
        break;
      }
    }
    if (hit) bullets.splice(i, 1);
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    const r = e.radius + player.radius;
    if (dist2(e.x, e.y, player.x, player.y) <= r * r) {
      player.hp -= CONFIG.ENEMY_DAMAGE * dt;
      if (player.hp <= 0) {
        player.hp = 0;
        world.gameOver = true;
      }
    }
  }
}
