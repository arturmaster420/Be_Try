import { CONFIG } from "../core/config.js";

export function renderFrame(ctx, world) {
  const W = CONFIG.CANVAS_WIDTH;
  const H = CONFIG.CANVAS_HEIGHT;

  ctx.fillStyle = "#050509";
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.translate(-world.camera.x, -world.camera.y);

  // pickups
  ctx.fillStyle = "#40ff88";
  for (const pk of world.pickups) {
    ctx.beginPath();
    ctx.arc(pk.x, pk.y, pk.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // enemies
  for (const e of world.enemies) {
    ctx.beginPath();
    ctx.fillStyle = e.color;
    ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // bullets
  for (const b of world.bullets) {
    ctx.beginPath();
    ctx.fillStyle = b.isCrit ? "#ffe066" : "#ffffff";
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  // player
  const p = world.player;
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.facing);
  ctx.beginPath();
  ctx.fillStyle = "#4fa9ff";
  ctx.arc(0, 0, p.radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore();

  // HUD (simple text)
  ctx.fillStyle = "#f0f0f0";
  ctx.font = "13px monospace";
  ctx.textAlign = "left";
  ctx.fillText(`Score: ${world.score.toFixed(0)}`, 10, 18);
  ctx.fillText(`Wave: ${world.wave}`, 10, 34);
  ctx.fillText(`HP: ${Math.ceil(p.hp)}/${p.maxHp}`, 10, 50);
  ctx.fillText(`Lvl: ${p.level}  XP: ${p.xp}/${p.xpToNext}`, 10, 66);
  ctx.fillText(`Weapon: ${world.weaponName}`, 10, 82);

  ctx.textAlign = "right";
  ctx.fillText(
    `BestScore: ${world.highScore.toFixed(0)}`,
    W - 10,
    18
  );
  ctx.fillText(
    `BestWave: ${world.bestWave}`,
    W - 10,
    34
  );
  ctx.fillText(
    `BestTime: ${world.bestTime.toFixed(1)}s`,
    W - 10,
    50
  );

  if (world.state !== "playing") {
    ctx.textAlign = "center";
    ctx.font = "24px system-ui";
    const title =
      world.state === "menu"
        ? "BE_TRY — XP Core"
        : world.state === "paused"
        ? "PAUSED"
        : "GAME OVER";
    ctx.fillText(title, W / 2, H / 2 - 10);
    ctx.font = "16px system-ui";
    ctx.fillText("SPACE — start / resume,  R — restart,  P — pause", W / 2, H / 2 + 16);
  }
}
