import { isKeyDown } from "./input.js";
import { WORLD, PLAYER } from "./config.js";
import { clamp } from "./math.js";

export function updatePlayer(world, dt) {
  const p = world.player;
  let ax = 0;
  let ay = 0;
  if (isKeyDown("w")) ay -= 1;
  if (isKeyDown("s")) ay += 1;
  if (isKeyDown("a")) ax -= 1;
  if (isKeyDown("d")) ax += 1;

  const len = Math.hypot(ax, ay) || 1;
  ax /= len;
  ay /= len;

  const speed = PLAYER.baseSpeed * world.stats.moveMul;
  p.x += ax * speed * dt;
  p.y += ay * speed * dt;

  p.x = clamp(p.x, p.radius, WORLD.width - p.radius);
  p.y = clamp(p.y, p.radius, WORLD.height - p.radius);

  const cam = world.camera;
  cam.x = p.x;
  cam.y = p.y;

  const targetZoom = clamp(1.1 - (p.level - 1) * 0.01, 0.7, 1.1);
  cam.zoom += (targetZoom - cam.zoom) * 0.05;
}
