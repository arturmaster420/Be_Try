// src/core/config.js
// Глобальные настройки игры Be_Try

export const CONFIG = {
  // HP
  infiniteHP: true,       // бесконечные HP
  hpGainPerPickup: 10,    // +HP за зелёный пикап

  // Камера и мир
  worldSize: 8000,        // базовый размер карты (потом + увеличения)
  cameraBaseZoom: 1.0,    // минимальная высота камеры
  cameraZoomPerLevel: 0.015, // как сильно камера отдаляется с уровнем

  // Враги
  enemyBaseHP: 35,
  enemyBossHP: 300,
  enemySpeed: 45,
  enemyBossSpeed: 22,

  // Волны
  waveInterval: 8,        // интервал между волнами
  waveEnemyGrowth: 2,     // увеличение количества врагов в волне
  bossChance: 0.05,       // шанс босса

  // Оружия по уровням
  weaponLevels: {
    pistol: 1,
    rifle: 5,
    shotgun: 10,
    rocket: 15,
    laser: 20
  },

  // Статы игрока
  baseDamage: 8,
  baseFireRate: 1.8,  // Пистолет замедлён
  baseRange: 600,
  baseMoveSpeed: 200,

  // Бонусы за уровни
  statPerLevel: {
    fireRate: 0.03,
    damage: 0.03,
    range: 0.04,
    move: 0.03,
    crit: 0.02,
  },

  // Криты
  baseCritChance: 0,
  baseCritMultiplier: 2,
  maxCritChance: 0.7,
  maxCritTemp: 0.9,
};
