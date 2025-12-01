import { randRange } from "./math.js";
import { gainXp } from "./world.js";

export function spawnWave(world) {
  const count = 6 + world.wave * 2;
  for (let i = 0; i < count; i++) {
    spawnEnemy(world);
  }
}

export function spawnEnemy(world) {
  const p = world.player;

  const baseRadius = (world.canvasWidth / world.camera.zoom) * 0.6;
  const dist = randRange(baseRadius * 1.2, baseRadius * 2.0);
  const angle = randRange(0, Math.PI * 2);

  const e = {
    id: world.nextEnemyId++,
    x: p.x + Math.cos(angle) * dist,
    y: p.y + Math.sin(angle) * dist,
    radius: 18,
    speed: 55 + world.wave * 1.5,
    hp: 50 + world.wave * 8,
    maxHp: 50 + world.wave * 8,
  };
  world.enemies.push(e);
}

export function updateEnemies(world, dt) {
  const p = world.player;
  for (const e of world.enemies) {
    const dx = p.x - e.x;
    const dy = p.y - e.y;
    const dist = Math.hypot(dx, dy) || 1;
    const sp = e.speed * dt;
    e.x += (dx / dist) * sp;
    e.y += (dy / dist) * sp;

    if (dist < e.radius + p.radius) {
      p.hp -= 12 * dt;
      if (p.hp <= 0) {
        p.hp = 0;
        world.state = "gameover";
      }
    }
  }
}

export function handleEnemyDeaths(world) {
  for (let i = world.enemies.length - 1; i >= 0; i--) {
    const e = world.enemies[i];
    if (e.hp <= 0) {
      world.enemies.splice(i, 1);
      world.score += 20;
      gainXp(world, 15);
      if (Math.random() < 0.25) {
        world.pickups.push({
          x: e.x,
          y: e.y,
          radius: 10,
          kind: "hp",
        });
      }
    }
  }
}
