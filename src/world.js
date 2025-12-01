import { WORLD, PLAYER, STATS_BASE, WEAPONS } from "./config.js";

const HS_KEY = "be_try_core_highscore";

export function createWorld() {
  const w = {
    state: "menu",
    canvasWidth: 800,
    canvasHeight: 600,
    mouseWorldX: 0,
    mouseWorldY: 0,

    score: 0,
    wave: 1,
    runTime: 0,

    bestScore: 0,
    bestWave: 0,
    bestTime: 0,

    enemies: [],
    bullets: [],
    rockets: [],
    explosions: [],
    laserBeams: [],
    pickups: [],

    nextEnemyId: 1,

    // волны
    waveActive: false,
    waveClearTimer: 0,
    waveText: "",
    waveTextTimer: 0,

    // бафы от боссов
    lastBossBuffText: "",
    lastBoosterBuffText: "",

    stats: { ...STATS_BASE },

    player: {
      x: WORLD.width / 2,
      y: WORLD.height / 2,
      radius: PLAYER.radius,
      hp: 100,
      level: 1,
      xp: 0,
      xpToNext: 60,
      weaponId: "pistol",
    },

    camera: {
      x: WORLD.width / 2,
      y: WORLD.height / 2,
      zoom: 1.0,
    },

    currentWeapon: WEAPONS["pistol"],
    fireCooldown: 0,
  };

  loadHighscore(w);
  applyWeaponStats(w);

  return w;
}

export function setCanvasSize(world, w, h) {
  world.canvasWidth = w;
  world.canvasHeight = h;
}

export function startGame(world) {
  // сброс всего ранна
  world.state = "playing";
  world.score = 0;
  world.wave = 1;
  world.runTime = 0;

  world.enemies.length = 0;
  world.bullets.length = 0;
  world.rockets.length = 0;
  world.explosions.length = 0;
  world.laserBeams.length = 0;
  world.pickups.length = 0;

  world.nextEnemyId = 1;

  world.stats = { ...STATS_BASE };
  world.lastBossBuffText = "";
  world.lastBoosterBuffText = "";

  const p = world.player;
  p.x = WORLD.width / 2;
  p.y = WORLD.height / 2;
  p.hp = 100;
  p.level = 1;
  p.xp = 0;
  p.xpToNext = 60;
  p.weaponId = "pistol";

  applyWeaponStats(world);

  // первая волна сразу
  world.waveActive = true;
  world.waveClearTimer = 0;
  world.waveText = "WAVE 1";
  world.waveTextTimer = 2.5;
}

export function loadHighscore(world) {
  try {
    const raw = localStorage.getItem(HS_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    world.bestScore = data.bestScore ?? 0;
    world.bestWave = data.bestWave ?? 0;
    world.bestTime = data.bestTime ?? 0;
  } catch (e) {
    console.warn("HS load error", e);
  }
}

export function saveHighscore(world) {
  world.bestScore = Math.max(world.bestScore, world.score);
  world.bestWave = Math.max(world.bestWave, world.wave);
  world.bestTime = Math.max(world.bestTime, world.runTime);
  const data = {
    bestScore: world.bestScore,
    bestWave: world.bestWave,
    bestTime: world.bestTime,
  };
  try {
    localStorage.setItem(HS_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn("HS save error", e);
  }
}

export function applyWeaponStats(world) {
  const p = world.player;
  const weapon = WEAPONS[p.weaponId];
  world.currentWeapon = weapon;
}

export function levelUp(world) {
  const p = world.player;
  p.level += 1;
  p.xp = 0;
  p.xpToNext = Math.floor(p.xpToNext * 1.4);

  // лёгкий рост параметров
  world.stats.damageMul *= 1.03;
  world.stats.fireRateMul *= 1.02;
  world.stats.rangeMul *= 1.01;
  world.stats.moveMul *= 1.01;

  updateWeaponByLevel(world);
}

function updateWeaponByLevel(world) {
  const p = world.player;
  const lvl = p.level;

  let newId = "pistol";
  if (lvl >= 20) newId = "laser";
  else if (lvl >= 15) newId = "rocket";
  else if (lvl >= 10) newId = "shotgun";
  else if (lvl >= 5) newId = "rifle";

  p.weaponId = newId;
  applyWeaponStats(world);
}

export function gainXp(world, amount) {
  const p = world.player;
  p.xp += amount;
  while (p.xp >= p.xpToNext) {
    p.xp -= p.xpToNext;
    levelUp(world);
  }
}
