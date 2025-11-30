import { CONFIG } from "../core/config.js";

export function drawBackground(ctx, camera) {
  const { CANVAS_WIDTH: W, CANVAS_HEIGHT: H } = CONFIG;
  ctx.fillStyle = "#050509";
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  const gridSize = 80;
  const minX = camera.x - (camera.x % gridSize) - W;
  const maxX = camera.x + W * 2;
  const minY = camera.y - (camera.y % gridSize) - H;
  const maxY = camera.y + H * 2;

  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;

  for (let x = minX; x < maxX; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, minY);
    ctx.lineTo(x, maxY);
    ctx.stroke();
  }
  for (let y = minY; y < maxY; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(minX, y);
    ctx.lineTo(maxX, y);
    ctx.stroke();
  }

  // soft radial vignette in world space
  const grd = ctx.createRadialGradient(
    camera.x,
    camera.y,
    0,
    camera.x,
    camera.y,
    CONFIG.WORLD_RADIUS * 1.1
  );
  grd.addColorStop(0, "rgba(0,0,0,0)");
  grd.addColorStop(1, "rgba(0,0,0,0.9)");
  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.rect(camera.x - W * 2, camera.y - H * 2, W * 4, H * 4);
  ctx.fill();

  ctx.restore();
}
