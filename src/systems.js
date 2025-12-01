import { updatePlayer } from "./player.js";
import { updateEnemies, spawnWave, handleEnemyDeaths } from "./enemies.js";
import { updateProjectiles, updateExplosions } from "./projectiles.js";
import { updatePickups } from "./pickups.js";
import { handleShooting } from "./shooting.js";

export function updateGame(world, dt) {
  if (world.state !== "playing") return;

  world.runTime += dt;
  world.spawnTimer -= dt;
  if (world.spawnTimer <= 0) {
    spawnWave(world);
    world.wave += 1;
    world.spawnTimer = 9;
  }

  updatePlayer(world, dt);
  handleShooting(world, dt);
  updateEnemies(world, dt);
  handleEnemyDeaths(world);
  updateProjectiles(world, dt);
  updateExplosions(world, dt);
  updatePickups(world, dt);
}
