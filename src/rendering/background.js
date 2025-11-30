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

  ctx.restore();
}
