import { CONFIG } from "../core/config.js";
import { spawnEnemy, spawnBoss } from "./enemies.js";

export function initWaves(world) {
  world.wave = 1;
  world.waveTimer = 0;
  world.timeSinceLastBoss = 0;
  world.timeSinceLastBooster = 0;
}

export function updateWaves(world, dt) {
  world.waveTimer += dt;
  world.timeSinceLastBoss += dt;
  world.timeSinceLastBooster += dt;

  // approximate wave index by time
  const targetWave = 1 + Math.floor(world.totalTime / CONFIG.WAVE_BASE_DURATION);
  if (targetWave > world.wave) {
    world.wave = targetWave;
    world.messages.push({
      text: `Wave ${world.wave}`,
      time: 3,
      color: "#ffffff",
    });
  }

  // continuously spawn regular enemies based on wave
  const desiredCount =
    CONFIG.WAVE_BASE_ENEMIES * Math.pow(CONFIG.WAVE_ENEMY_GROWTH, world.wave - 1);
  const maxEnemies = Math.round(desiredCount);
  if (world.enemies.length < maxEnemies) {
    // spawn gradually
    world.enemySpawnAccumulator = (world.enemySpawnAccumulator || 0) + dt;
    const spawnInterval = 1.0 / (1 + 0.15 * world.wave);
    while (
      world.enemySpawnAccumulator > spawnInterval &&
      world.enemies.length < maxEnemies
    ) {
      spawnEnemy(world, world.wave);
      world.enemySpawnAccumulator -= spawnInterval;
    }
  }

  // normal boss every few waves
  if (
    world.timeSinceLastBoss > CONFIG.WAVE_BASE_DURATION * CONFIG.WAVE_BOSS_INTERVAL
  ) {
    spawnBoss(world, false, world.wave);
    world.timeSinceLastBoss = 0;
    world.messages.push({
      text: "Boss incoming!",
      time: 3,
      color: CONFIG.BOSS_COLOR,
    });
  }

  // booster bosses: no global cap, just random chance
  if (world.timeSinceLastBooster > CONFIG.BOOSTER_MIN_INTERVAL) {
    if (Math.random() < CONFIG.BOOSTER_RANDOM_CHANCE) {
      spawnBoss(world, true, world.wave);
      world.messages.push({
        text: "Booster boss!",
        time: 3,
        color: CONFIG.BOOSTER_BOSS_COLOR,
      });
    }
    world.timeSinceLastBooster = 0;
  }
}
