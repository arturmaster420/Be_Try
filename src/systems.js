import { updatePlayer } from "./player.js";
import { updateEnemies, spawnWave, handleEnemyDeaths } from "./enemies.js";
import { updateProjectiles, updateExplosions } from "./projectiles.js";
import { updatePickups } from "./pickups.js";
import { handleShooting } from "./shooting.js";

export function updateGame(world, dt) {
  if (world.state !== "playing") return;

  world.runTime += dt;

  // логика волн в стиле B: новая волна только после убийства последнего врага
  if (world.waveActive && world.enemies.length === 0) {
    world.waveActive = false;
    world.waveClearTimer = 1.0; // небольшая пауза перед следующей волной
  }

  if (!world.waveActive && world.waveClearTimer > 0) {
    world.waveClearTimer -= dt;
    if (world.waveClearTimer <= 0) {
      world.wave += 1;
      const isBossWave = world.wave % 5 === 0;
      const kind = isBossWave ? "boss" : "normal";
      spawnWave(world, kind);
      world.waveActive = true;
      world.waveText = isBossWave ? `BOSS WAVE ${world.wave}` : `WAVE ${world.wave}`;
      world.waveTextTimer = 2.5;
    }
  }

  updatePlayer(world, dt);
  handleShooting(world, dt);
  updateEnemies(world, dt);
  handleEnemyDeaths(world);
  updateProjectiles(world, dt);
  updateExplosions(world, dt);
  updatePickups(world, dt);

  if (world.waveTextTimer > 0) {
    world.waveTextTimer -= dt;
    if (world.waveTextTimer < 0) world.waveTextTimer = 0;
  }
}
