import { CONFIG } from "./config.js";
import { createPlayer, resetPlayer } from "./player.js";
import { createCamera, updateCamera } from "./camera.js";
import { updateBullets } from "../gameplay/bullets.js";
import { updateEnemies } from "../gameplay/enemies.js";
import { updatePickups } from "../gameplay/pickups.js";
import { initWaves, updateWaves } from "../gameplay/waves.js";
import { resetBuffs, updateBuffs } from "../gameplay/buffs.js";

export function createWorld() {
  const player = createPlayer();
  const camera = createCamera();

  const world = {
    player,
    camera,
    bullets: [],
    enemies: [],
    pickups: [],
    hitEffects: [],
    messages: [],
    radius: CONFIG.WORLD_RADIUS,
    score: 0,
    highScore: loadHighScore(),
    bestWave: loadBestWave(),
    bestTime: loadBestTime(),
    wave: 1,
    totalTime: 0,
    paused: false,
    gameOver: false,
    started: false,
    waveKills: 0,
    waveNeededKills: 0,
    waveSpawned: 0,
    enemySpawnAccumulator: 0,
    bossSpawnedThisWave: false,
    timeSinceLastBooster: 0,
  };

  resetWorld(world);
  world.started = false;
  return world;
}

export function resetWorld(world) {
  world.bullets.length = 0;
  world.enemies.length = 0;
  world.pickups.length = 0;
  world.hitEffects.length = 0;
  world.messages.length = 0;
  world.score = 0;
  world.wave = 1;
  world.totalTime = 0;
  world.gameOver = false;
  world.paused = false;

  world.waveKills = 0;
  world.waveNeededKills = 0;
  world.waveSpawned = 0;
  world.enemySpawnAccumulator = 0;
  world.bossSpawnedThisWave = false;
  world.timeSinceLastBooster = 0;

  resetBuffs();
  resetPlayer(world.player);
  updateCamera(world.camera, world.player);
  initWaves(world);
}

export function updateWorld(world, dt) {
  if (!world.started || world.paused || world.gameOver) return;

  world.totalTime += dt;

  updateBuffs(dt);
  updatePlayer(world.player, world, dt);
  updateCamera(world.camera, world.player);
  updateBullets(world, dt);
  updateEnemies(world, dt);
  updatePickups(world, dt);
  updateWaves(world, dt);

  for (let i = world.messages.length - 1; i >= 0; i--) {
    const m = world.messages[i];
    m.time -= dt;
    if (m.time <= 0) world.messages.splice(i, 1);
  }

  for (let i = world.hitEffects.length - 1; i >= 0; i--) {
    const h = world.hitEffects[i];
    h.time -= dt;
    if (h.time <= 0) world.hitEffects.splice(i, 1);
  }

  if (world.gameOver) {
    saveStats(world);
  }
}

export function saveStats(world) {
  const currentBestScore = loadHighScore();
  const newBestScore = Math.max(currentBestScore, world.score);
  try {
    localStorage.setItem("boxhead2_highscore", String(newBestScore));
  } catch {}
  world.highScore = newBestScore;

  const currentBestWave = loadBestWave();
  const newBestWave = Math.max(currentBestWave, world.wave);
  try {
    localStorage.setItem("boxhead2_bestWave", String(newBestWave));
  } catch {}
  world.bestWave = newBestWave;

  const currentBestTime = loadBestTime();
  const newBestTime = Math.max(currentBestTime, world.totalTime);
  try {
    localStorage.setItem("boxhead2_bestTime", String(newBestTime));
  } catch {}
  world.bestTime = newBestTime;
}

export function loadHighScore() {
  try {
    const raw = localStorage.getItem("boxhead2_highscore");
    if (!raw) return 0;
    const v = parseFloat(raw);
    return Number.isFinite(v) ? v : 0;
  } catch {
    return 0;
  }
}

export function loadBestWave() {
  try {
    const raw = localStorage.getItem("boxhead2_bestWave");
    if (!raw) return 0;
    const v = parseFloat(raw);
    return Number.isFinite(v) ? v : 0;
  } catch {
    return 0;
  }
}

export function loadBestTime() {
  try {
    const raw = localStorage.getItem("boxhead2_bestTime");
    if (!raw) return 0;
    const v = parseFloat(raw);
    return Number.isFinite(v) ? v : 0;
  } catch {
    return 0;
  }
}
