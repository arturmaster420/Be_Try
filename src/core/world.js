import { WORLD, PLAYER, STATS, XP, WEAPONS } from './config.js';

export function createInitialWorld() {
  const centerX = WORLD.width / 2;
  const centerY = WORLD.height / 2;

  const world = {
    time: 0,
    state: 'menu', // menu, playing, paused, gameover
    canvasWidth: 800,
    canvasHeight: 600,

    player: {
      x: centerX,
      y: centerY,
      vx: 0,
      vy: 0,
      radius: PLAYER.radius,
      hp: PLAYER.startHP,
      weapon: WEAPONS.pistol,
      level: 1,
      xp: 0,
      xpToNext: XP.baseToLevel,
    },

    stats: {
      damageMul: STATS.baseDamageMul,
      fireRateMul: STATS.baseFireRateMul,
      rangeMul: STATS.baseRangeMul,
      moveMul: STATS.baseMoveMul,
      critChancePermanent: STATS.baseCritChance,
      critChanceTemp: 0,
      critMult: STATS.baseCritMult,
    },

    enemies: [],
    projectiles: [],
    rockets: [],
    explosions: [],
    laserBeams: [],
    pickups: [],
    buffs: [],

    wave: 1,
    pendingSpawn: [],
    spawnTimer: 0,

    score: 0,
    bestScore: 0,
    bestWave: 0,
    bestTime: 0,
    runTime: 0,

    fireCooldown: 0,

    camera: {
      x: centerX,
      y: centerY,
      zoom: 1,
    },
  };

  loadHighscore(world);
  return world;
}

export function loadHighscore(world) {
  try {
    const raw = localStorage.getItem('boxhead2_highscore');
    if (!raw) return;
    const data = JSON.parse(raw);
    world.bestScore = data.bestScore || 0;
    world.bestWave = data.bestWave || 0;
    world.bestTime = data.bestTime || 0;
  } catch (e) {
    console.warn('Failed to load highscore', e);
  }
}

export function saveHighscore(world) {
  const payload = {
    bestScore: world.bestScore,
    bestWave: world.bestWave,
    bestTime: world.bestTime,
  };
  try {
    localStorage.setItem('boxhead2_highscore', JSON.stringify(payload));
  } catch (e) {
    console.warn('Failed to save highscore', e);
  }
}

export function setCanvasSize(world, w, h) {
  world.canvasWidth = w;
  world.canvasHeight = h;
}
