import { CONFIG } from "./config.js";
import { spawnEnemy, spawnBoss } from "./enemies.js";

function waveNeed(wave) {
  return Math.round(
    CONFIG.WAVE_BASE_ENEMIES * Math.pow(CONFIG.WAVE_ENEMY_GROWTH, wave - 1)
  );
}

export function initWaves(world) {
  world.wave = 1;
  world.waveKills = 0;
  world.waveNeeded = waveNeed(1);
  world.waveSpawned = 0;
  world.enemySpawnTimer = 0;
  world.bossSpawnedThisWave = false;
  world.timeSinceLastBooster = 0;
}

export function updateWaves(world, dt) {
  world.timeSinceLastBooster += dt;

  const need = world.waveNeeded;
  const maxAlive = Math.min(need + 6, 50 + world.wave * 4);

  if (world.waveSpawned < need && world.enemies.length < maxAlive) {
    world.enemySpawnTimer += dt;
    const spawnInterval = 1.05 / (1 + 0.16 * world.wave);
    while (
      world.enemySpawnTimer >= spawnInterval &&
      world.waveSpawned < need &&
      world.enemies.length < maxAlive
    ) {
      spawnEnemy(world, world.wave);
      world.waveSpawned += 1;
      world.enemySpawnTimer -= spawnInterval;
    }
  }

  if (
    world.wave > 0 &&
    world.wave % CONFIG.WAVE_BOSS_INTERVAL === 0 &&
    !world.bossSpawnedThisWave
  ) {
    spawnBoss(world, "normal", world.wave);
    world.bossSpawnedThisWave = true;
    world.messages.push({
      text: "Boss wave!",
      time: 3,
      color: "#e045ff",
    });
  }

  if (world.timeSinceLastBooster >= CONFIG.BOOSTER_MIN_INTERVAL) {
    if (Math.random() < CONFIG.BOOSTER_RANDOM_CHANCE) {
      const kind = Math.random() < 0.5 ? "crit" : "utility";
      spawnBoss(world, kind, world.wave);
      world.messages.push({
        text:
          kind === "crit" ? "Crit booster boss!" : "Utility booster boss!",
        time: 3,
        color: kind === "crit" ? "#30d7ff" : "#30ff88",
      });
    }
    world.timeSinceLastBooster = 0;
  }

  if (world.waveKills >= need && world.enemies.length === 0) {
    world.wave += 1;
    world.waveKills = 0;
    world.waveNeeded = waveNeed(world.wave);
    world.waveSpawned = 0;
    world.enemySpawnTimer = 0;
    world.bossSpawnedThisWave = false;

    world.messages.push({
      text: `Wave ${world.wave}`,
      time: 3,
      color: "#ffffff",
    });
  }
}
