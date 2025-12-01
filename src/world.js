import { CONFIG } from "./config.js";
import { createPlayer, resetPlayer } from "./player.js";
import { updatePlayer } from "./player.js";
import { updateBullets } from "./bullets.js";
import { updateRockets } from "./rockets.js";
import { updateEnemies, makeKillEnemy } from "./enemies.js";
import { updatePickups } from "./pickups.js";
import { initWaves, updateWaves } from "./waves.js";
import { resetBuffs, updateBuffs, permanent, tempBuffs, getEffectiveStats } from "./buffs.js";

function loadNumber(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return 0;
    const v = parseFloat(raw);
    return Number.isFinite(v) ? v : 0;
  } catch {
    return 0;
  }
}

function saveNumber(key, value) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // ignore
  }
}

export function createWorld() {
  const world = {
    state: "menu",
    radius: CONFIG.WORLD_RADIUS,
    camera: { x: 0, y: 0, zoom: 0.75 },
    player: createPlayer(),
    bullets: [],
    rockets: [],
    enemies: [],
    pickups: [],
    hitEffects: [],
    explosions: [],
    messages: [],
    score: 0,
    time: 0,
    wave: 1,
    waveKills: 0,
    waveNeeded: 0,
    waveSpawned: 0,
    enemySpawnTimer: 0,
    bossSpawnedThisWave: false,
    timeSinceLastBooster: 0,
    weaponId: "pistol",
    weaponName: "Pistol",
    highScore: loadNumber("boxhead2_highscore"),
    bestWave: loadNumber("boxhead2_bestWave"),
    bestTime: loadNumber("boxhead2_bestTime"),
  };

  world.killEnemy = makeKillEnemy(world);

  world.onLevelGained = () => {
    // extra hook if needed in future
  };

  resetGame(world);
  world.state = "menu";
  return world;
}

export function resetGame(world) {
  world.bullets.length = 0;
  world.rockets.length = 0;
  world.enemies.length = 0;
  world.pickups.length = 0;
  world.hitEffects.length = 0;
  world.explosions.length = 0;
  world.messages.length = 0;

  world.score = 0;
  world.time = 0;
  world.wave = 1;
  world.waveKills = 0;
  world.waveSpawned = 0;
  world.enemySpawnTimer = 0;
  world.bossSpawnedThisWave = false;
  world.timeSinceLastBooster = 0;

  resetBuffs();
  resetPlayer(world.player);
  world.weaponId = "pistol";
  world.weaponName = "Pistol";

  world.camera.x = world.player.x - CONFIG.CANVAS_WIDTH / 2 / world.camera.zoom;
  world.camera.y = world.player.y - CONFIG.CANVAS_HEIGHT / 2 / world.camera.zoom;

  initWaves(world);
}

export function updateWorld(world, dt) {
  if (world.state !== "playing") return;

  world.time += dt;

  updateBuffs(dt);
  updatePlayer(world, dt);

  const eff = getEffectiveStats();
  world.effectiveStats = eff;

  const p = world.player;
  world.camera.x = p.x - CONFIG.CANVAS_WIDTH / 2 / world.camera.zoom;
  world.camera.y = p.y - CONFIG.CANVAS_HEIGHT / 2 / world.camera.zoom;

  updateBullets(world, dt);
  updateRockets(world, dt);
  updateEnemies(world, dt);
  updatePickups(world, dt);
  updateWaves(world, dt);

  for (let i = world.hitEffects.length - 1; i >= 0; i--) {
    const h = world.hitEffects[i];
    h.time -= dt;
    if (h.time <= 0) world.hitEffects.splice(i, 1);
  }
  for (let i = world.explosions.length - 1; i >= 0; i--) {
    const e = world.explosions[i];
    e.time -= dt;
    if (e.time <= 0) world.explosions.splice(i, 1);
  }
  for (let i = world.messages.length - 1; i >= 0; i--) {
    const m = world.messages[i];
    m.time -= dt;
    if (m.time <= 0) world.messages.splice(i, 1);
  }

  if (world.state === "gameover") {
    saveStats(world);
  }
}

function saveStats(world) {
  const newHigh = Math.max(world.highScore, world.score);
  world.highScore = newHigh;
  saveNumber("boxhead2_highscore", newHigh);

  const newBestWave = Math.max(world.bestWave, world.wave);
  world.bestWave = newBestWave;
  saveNumber("boxhead2_bestWave", newBestWave);

  const newBestTime = Math.max(world.bestTime, world.time);
  world.bestTime = newBestTime;
  saveNumber("boxhead2_bestTime", newBestTime);
}

export { permanent, tempBuffs, getEffectiveStats };
