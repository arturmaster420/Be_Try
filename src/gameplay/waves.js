import { spawnWave, updateSpawns, updateEnemies } from './enemies.js';
import { updateBuffs } from '../core/crit.js';
import { updateProjectiles } from './bullets.js';
import { updatePickups } from './pickups.js';

export function startGame(world) {
  world.state = 'playing';
  world.score = 0;
  world.wave = 1;
  world.enemies = [];
  world.projectiles = [];
  world.rockets = [];
  world.explosions = [];
  world.laserBeams = [];
  world.pickups = [];
  world.buffs = [];
  world.player.hp = 100;
  world.player.level = 1;
  world.player.xp = 0;
  world.player.xpToNext = 60;
  world.runTime = 0;
  spawnWave(world);
}

export function updateGameplay(world, dt) {
  if (world.state !== 'playing') return;

  updateSpawns(world, dt);
  updateEnemies(world, dt);
  updateProjectiles(world, dt);
  updatePickups(world, dt);
  updateBuffs(world, dt);
}
