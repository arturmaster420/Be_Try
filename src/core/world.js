import { CONFIG } from "./config.js";
import { createCamera, updateCamera } from "./camera.js";
import { createPlayer, resetPlayer, updatePlayer } from "./player.js";
import { updateBullets } from "../gameplay/bullets.js";
import { updateEnemies } from "../gameplay/enemies.js";
import { updatePickups } from "../gameplay/pickups.js";
import { initWaves, updateWaves } from "../gameplay/waves.js";
import { resetBuffs, updateBuffs } from "../gameplay/buffs.js";

export function createWorld() {
  const world = {
    state: "menu",
    radius: CONFIG.WORLD_RADIUS,
    camera: createCamera(),
    player: createPlayer(),
    bullets: [],
    enemies: [],
    pickups: [],
    messages: [],
    score: 0,
    wave: 1,
    waveKills: 0,
    waveNeeded: 0,
    waveSpawned: 0,
    enemySpawnTimer: 0,
    bossSpawnedThisWave: false,
    timeSinceLastBooster: 0,
    totalTime: 0,
    highScore: loadNumber("boxhead2_highscore"),
    bestWave: loadNumber("boxhead2_bestWave"),
    bestTime: loadNumber("boxhead2_bestTime"),
    xpPerKill: CONFIG.XP_PER_KILL,
    weaponId: "pistol",
    weaponName: "Pistol",
  };

  resetGame(world);
  world.state = "menu";
  return world;
}

export function resetGame(world) {
  world.bullets.length = 0;
  world.enemies.length = 0;
  world.pickups.length = 0;
  world.messages.length = 0;
  world.score = 0;
  world.wave = 1;
  world.waveKills = 0;
  world.totalTime = 0;
  world.waveSpawned = 0;
  world.enemySpawnTimer = 0;
  world.bossSpawnedThisWave = false;
  world.timeSinceLastBooster = 0;

  resetBuffs();
  resetPlayer(world.player);
  world.player.level = 1;
  world.player.xp = 0;
  world.player.xpToNext = CONFIG.XP_LEVEL_BASE;
  world.weaponId = "pistol";
  world.weaponName = "Pistol";

  updateCamera(world.camera, world.player);
  initWaves(world);
}

export function handleLevelUps(world, weaponSystem) {
  const p = world.player;
  while (p.xp >= p.xpToNext) {
    p.xp -= p.xpToNext;
    p.level += 1;
    p.xpToNext = Math.round(p.xpToNext * 1.35);
    weaponSystem.onLevelGained(world);
  }
}

export function updateWorld(world, dt, weaponSystem) {
  if (world.state !== "playing") return;

  world.totalTime += dt;

  updateBuffs(dt);
  updatePlayer(world, dt, weaponSystem);
  updateCamera(world.camera, world.player);
  updateBullets(world, dt);
  updateEnemies(world, dt);
  updatePickups(world, dt);
  updateWaves(world, dt);

  handleLevelUps(world, weaponSystem);

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

  const newBestTime = Math.max(world.bestTime, world.totalTime);
  world.bestTime = newBestTime;
  saveNumber("boxhead2_bestTime", newBestTime);
}

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
