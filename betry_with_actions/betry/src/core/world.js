import { CONFIG } from "./config.js";
import { createPlayer, resetPlayer, updatePlayer } from "./player.js";
import { updateCamera, createCamera } from "./camera.js";
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
    messages: [],
    radius: CONFIG.WORLD_RADIUS,
    score: 0,
    highScore: loadHighScore(),
    wave: 1,
    totalTime: 0,
    paused: false,
    gameOver: false,
    waveTimer: 0,
    timeSinceLastBoss: 0,
    timeSinceLastBooster: 0,
    enemySpawnAccumulator: 0,
  };

  resetWorld(world);
  return world;
}

export function resetWorld(world) {
  world.bullets.length = 0;
  world.enemies.length = 0;
  world.pickups.length = 0;
  world.messages.length = 0;
  world.score = 0;
  world.wave = 1;
  world.totalTime = 0;
  world.gameOver = false;
  world.paused = false;
  world.waveTimer = 0;
  world.timeSinceLastBoss = 0;
  world.timeSinceLastBooster = 0;
  world.enemySpawnAccumulator = 0;

  resetBuffs();
  resetPlayer(world.player);
  updateCamera(world.camera, world.player);
  initWaves(world);
}

export function updateWorld(world, dt) {
  if (world.paused || world.gameOver) return;

  world.totalTime += dt;

  updateBuffs(dt);
  updatePlayer(world.player, world, dt);
  updateCamera(world.camera, world.player);
  updateBullets(world, dt);
  updateEnemies(world, dt);
  updatePickups(world, dt);
  updateWaves(world, dt);

  // messages lifetime
  for (let i = world.messages.length - 1; i >= 0; i--) {
    const m = world.messages[i];
    m.time -= dt;
    if (m.time <= 0) world.messages.splice(i, 1);
  }

  if (world.gameOver) {
    saveHighScore(world.score, world);
  }
}

export function togglePause(world) {
  if (world.gameOver) return;
  world.paused = !world.paused;
}

export function saveHighScore(score, world) {
  const currentBest = world ? world.highScore : loadHighScore();
  const best = Math.max(currentBest, score);
  try {
    localStorage.setItem("boxhead2_highscore", String(best));
  } catch (e) {
    // ignore
  }
  if (world) world.highScore = best;
}

export function loadHighScore() {
  try {
    const raw = localStorage.getItem("boxhead2_highscore");
    if (!raw) return 0;
    const v = parseFloat(raw);
    return Number.isFinite(v) ? v : 0;
  } catch (e) {
    return 0;
  }
}
