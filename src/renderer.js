import { CONFIG } from "./config.js";

export function render(ctx, world) {
  const W = CONFIG.CANVAS_WIDTH;
  const H = CONFIG.CANVAS_HEIGHT;

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, W, H);

  ctx.fillStyle = "#050509";
  ctx.fillRect(0, 0, W, H);

  ctx.save();
  ctx.translate(-world.camera.x * world.camera.zoom, -world.camera.y * world.camera.zoom);
  ctx.scale(world.camera.zoom, world.camera.zoom);

  drawGrid(ctx, world);
  drawPickups(ctx, world);
  drawEnemies(ctx, world);
  drawBullets(ctx, world);
  drawRockets(ctx, world);
  drawExplosions(ctx, world);
  drawPlayer(ctx, world);
  drawHitEffects(ctx, world);

  ctx.restore();

  drawHUD(ctx, world);
}

function drawGrid(ctx, world) {
  const step = 180;
  const minX = world.camera.x - 2000;
  const maxX = world.camera.x + CONFIG.CANVAS_WIDTH / world.camera.zoom + 2000;
  const minY = world.camera.y - 2000;
  const maxY = world.camera.y + CONFIG.CANVAS_HEIGHT / world.camera.zoom + 2000;

  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 1;

  for (let x = Math.floor(minX / step) * step; x < maxX; x += step) {
    ctx.beginPath();
    ctx.moveTo(x, minY);
    ctx.lineTo(x, maxY);
    ctx.stroke();
  }
  for (let y = Math.floor(minY / step) * step; y < maxY; y += step) {
    ctx.beginPath();
    ctx.moveTo(minX, y);
    ctx.lineTo(maxX, y);
    ctx.stroke();
  }
}

function drawPlayer(ctx, world) {
  const p = world.player;
  ctx.beginPath();
  ctx.fillStyle = "#4fa9ff";
  ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.strokeStyle = "rgba(255,255,255,0.5)";
  ctx.lineWidth = 2;
  ctx.arc(p.x, p.y, p.radius + 4, 0, Math.PI * 2);
  ctx.stroke();
}

function drawEnemies(ctx, world) {
  for (const e of world.enemies) {
    ctx.beginPath();
    ctx.fillStyle = e.color;
    ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBullets(ctx, world) {
  for (const b of world.bullets) {
    ctx.beginPath();
    ctx.fillStyle = b.isCrit ? "#ffe066" : "#ffffff";
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawRockets(ctx, world) {
  for (const r of world.rockets) {
    ctx.beginPath();
    ctx.fillStyle = "#66e0ff";
    ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPickups(ctx, world) {
  ctx.fillStyle = "#40ff88";
  for (const pk of world.pickups) {
    ctx.beginPath();
    ctx.arc(pk.x, pk.y, pk.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHitEffects(ctx, world) {
  for (const h of world.hitEffects) {
    const alpha = Math.max(h.time / 0.12, 0);
    ctx.beginPath();
    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
    ctx.lineWidth = 2;
    ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawExplosions(ctx, world) {
  for (const e of world.explosions) {
    const alpha = Math.max(e.time / 0.18, 0);
    ctx.beginPath();
    ctx.strokeStyle = `rgba(255,224,102,${alpha})`;
    ctx.lineWidth = 3;
    ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
    ctx.stroke();
  }
}

function drawHUD(ctx, world) {
  const W = CONFIG.CANVAS_WIDTH;
  const H = CONFIG.CANVAS_HEIGHT;
  const p = world.player;
  const eff = world.effectiveStats || {};

  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = "#f0f0f0";
  ctx.font = "13px system-ui, -apple-system, BlinkMacSystemFont, sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";

  ctx.fillText(`Score: ${world.score.toFixed(0)}`, 10, 10);
  ctx.fillText(`Wave: ${world.wave}`, 10, 26);
  ctx.fillText(
    `HP: ${Math.max(0, Math.ceil(p.hp))}/${p.maxHp}`,
    10,
    42
  );
  ctx.fillText(
    `Lvl: ${p.level}  XP: ${p.xp}/${p.xpToNext}`,
    10,
    58
  );
  ctx.fillText(`Weapon: ${world.weaponName || ""}`, 10, 74);
  ctx.fillText(
    `Time: ${world.time.toFixed(1)}s`,
    10,
    90
  );

  ctx.textAlign = "right";
  ctx.fillText(
    `BestScore: ${world.highScore.toFixed(0)}`,
    W - 10,
    10
  );
  ctx.fillText(
    `BestWave: ${world.bestWave}`,
    W - 10,
    26
  );
  ctx.fillText(
    `BestTime: ${world.bestTime.toFixed(1)}s`,
    W - 10,
    42
  );

  const lineBase = 70;
  const step = 14;
  ctx.fillText(
    `Crit: ${(eff.critChance || 0) * 100 >> 0}%  x${(eff.critMult || 0).toFixed(2)}`,
    W - 10,
    lineBase
  );
  ctx.fillText(
    `Fire: ${(eff.fireRate || 0).toFixed(2)}/s`,
    W - 10,
    lineBase + step
  );
  ctx.fillText(
    `Range: ${(eff.range || 0).toFixed(0)}`,
    W - 10,
    lineBase + step * 2
  );
  ctx.fillText(
    `Move: ${(eff.moveSpeed || 0).toFixed(0)}`,
    W - 10,
    lineBase + step * 3
  );
  ctx.fillText(
    `Dmg: ${(eff.damage || 0).toFixed(1)}`,
    W - 10,
    lineBase + step * 4
  );

  ctx.textAlign = "center";
  if (world.state === "menu") {
    ctx.font = "24px system-ui";
    ctx.fillText("Be_Try V3", W / 2, H / 2 - 30);
    ctx.font = "16px system-ui";
    ctx.fillText("SPACE — start", W / 2, H / 2);
  } else if (world.state === "paused") {
    ctx.font = "24px system-ui";
    ctx.fillText("PAUSED", W / 2, H / 2 - 30);
    ctx.font = "16px system-ui";
    ctx.fillText("P — resume, R — restart", W / 2, H / 2);
  } else if (world.state === "gameover") {
    ctx.font = "24px system-ui";
    ctx.fillText("GAME OVER", W / 2, H / 2 - 30);
    ctx.font = "16px system-ui";
    ctx.fillText("SPACE / R — restart", W / 2, H / 2);
  }

  ctx.textAlign = "left";
  let msgY = H - 18;
  for (let i = world.messages.length - 1; i >= 0; i--) {
    const m = world.messages[i];
    const alpha = Math.min(m.time / 0.5, 1);
    ctx.fillStyle = m.color || "#ffffff";
    ctx.globalAlpha = alpha;
    ctx.fillText(m.text, 10, msgY);
    ctx.globalAlpha = 1;
    msgY -= 16;
  }

  ctx.restore();
}
