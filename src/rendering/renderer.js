import { drawBackground } from "./background.js";
import { renderHUD, renderOverlays } from "./hud.js";

export function renderFrame(ctx, world) {
  drawBackground(ctx, world.camera);

  ctx.save();
  ctx.translate(-world.camera.x, -world.camera.y);

  for (const h of world.hitEffects) {
    const alpha = Math.max(0, h.time / 0.12);
    ctx.beginPath();
    ctx.fillStyle = `rgba(255,255,255,${alpha.toFixed(2)})`;
    ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const p of world.pickups) {
    ctx.beginPath();
    ctx.fillStyle = "#4dff88";
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  for (const e of world.enemies) {
    ctx.beginPath();
    ctx.fillStyle = e.color;
    ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
    ctx.fill();

    if (e.isBoss) {
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.radius + 4, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  for (const b of world.bullets) {
    ctx.beginPath();
    ctx.fillStyle = b.isCrit ? "#ffe066" : "#ffffff";
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  const p = world.player;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.facing);
  ctx.beginPath();
  ctx.fillStyle = "#4facff";
  ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = "#ffffff";
  ctx.arc(p.radius * 0.7, 0, p.radius * 0.35, -0.6, 0.6);
  ctx.fill();
  ctx.restore();

  for (const m of world.messages) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, m.time / 4);
    ctx.fillStyle = m.color || "#ffffff";
    ctx.font = "16px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(m.text, p.x, p.y - 40);
    ctx.restore();
  }

  ctx.restore();

  renderHUD(world);
  renderOverlays(world);
}
