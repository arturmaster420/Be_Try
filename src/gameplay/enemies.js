import { CONFIG } from "../core/config.js";
import { randRange, dist2, normalize } from "../core/math.js";
import { applyBoosterBuff, applyRandomPermanentUpgrade } from "./buffs.js";

export function spawnEnemy(world, waveIndex) {
  const angle = randRange(0, Math.PI * 2);
  const radius = randRange(world.radius * 0.7, world.radius);
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  const hpScale = 1 + waveIndex * 0.08;
  const speedScale = 1 + waveIndex * 0.03;

  const enemy = {
    x,
    y,
    radius: CONFIG.ENEMY_RADIUS,
    hp: CONFIG.ENEMY_BASE_HP * hpScale,
    maxHp: CONFIG.ENEMY_BASE_HP * hpScale,
    speed: CONFIG.ENEMY_BASE_SPEED * speedScale,
    color: CONFIG.ENEMY_COLOR,
    isBoss: false,
    isBooster: false,
    scoreValue: 5,
  };

  world.enemies.push(enemy);
}

export function spawnBoss(world, isBooster = false, waveIndex = 1) {
  const angle = randRange(0, Math.PI * 2);
  const radius = randRange(world.radius * 0.7, world.radius);
  const x = Math.cos(angle) * radius;
  const y = Math.sin(angle) * radius;

  const hpScale = CONFIG.BOSS_HP_MULT * (1 + waveIndex * 0.1);
  const speedScale = CONFIG.BOSS_SPEED_MULT * (1 + waveIndex * 0.05);

  const enemy = {
    x,
    y,
    radius: CONFIG.BOSS_RADIUS,
    hp: CONFIG.ENEMY_BASE_HP * hpScale,
    maxHp: CONFIG.ENEMY_BASE_HP * hpScale,
    speed: CONFIG.ENEMY_BASE_SPEED * speedScale,
    color: isBooster ? CONFIG.BOOSTER_BOSS_COLOR : CONFIG.BOSS_COLOR,
    isBoss: true,
    isBooster,
    scoreValue: isBooster ? 40 : 60,
  };

  world.enemies.push(enemy);
}

export function updateEnemies(world, dt) {
  const enemies = world.enemies;
  const bullets = world.bullets;
  const player = world.player;

  // move enemies
  for (const e of enemies) {
    const dir = normalize(player.x - e.x, player.y - e.y);
    e.x += dir.x * e.speed * dt;
    e.y += dir.y * e.speed * dt;
  }

  // bullets vs enemies
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    let hit = false;

    for (let j = enemies.length - 1; j >= 0; j--) {
      const e = enemies[j];
      const r = b.radius + e.radius;
      if (dist2(b.x, b.y, e.x, e.y) <= r * r) {
        e.hp -= b.damage;
        hit = true;
        if (e.hp <= 0) {
          world.score += e.scoreValue;

          if (e.isBoss) {
            if (e.isBooster) {
              applyBoosterBuff();
              world.messages.push({
                text: "+20% crit chance & +50% crit damage for 180s",
                time: 4,
                color: CONFIG.BOOSTER_BOSS_COLOR,
              });
            } else {
              applyRandomPermanentUpgrade();
              world.messages.push({
                text: "Permanent boss upgrade! (+1% to random stat)",
                time: 4,
                color: CONFIG.BOSS_COLOR,
              });
            }
          }

          // chance to drop heal pickup
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

    if (hit) {
      bullets.splice(i, 1);
    }
  }

  // enemies vs player
  for (let i = enemies.length - 1; i >= 0; i--) {
    const e = enemies[i];
    const r = e.radius + player.radius;
    if (dist2(e.x, e.y, player.x, player.y) <= r * r) {
      // simple contact damage
      player.hp -= CONFIG.ENEMY_DAMAGE * dt;
      if (player.hp <= 0) {
        player.hp = 0;
        world.gameOver = true;
      }
    }
  }
}
