import { CONFIG } from "../core/config.js";

export function drawBackground(ctx, camera) {
  const W = CONFIG.CANVAS_WIDTH;
  const H = CONFIG.CANVAS_HEIGHT;

  ctx.fillStyle = "#050509";
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.translate(-camera.x, -camera.y);

  const grid = 80;
  const minX = camera.x - (camera.x % grid) - W;
  const maxX = camera.x + W * 2;
  const minY = camera.y - (camera.y % grid) - H;
  const maxY = camera.y + H * 2;

  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;

  for (let x = minX; x < maxX; x += grid) {
    ctx.beginPath();
    ctx.moveTo(x, minY);
    ctx.lineTo(x, maxY);
    ctx.stroke();
  }
  for (let y = minY; y < maxY; y += grid) {
    ctx.beginPath();
    ctx.moveTo(minX, y);
    ctx.lineTo(maxX, y);
    ctx.stroke();
  }

  ctx.restore();
}
