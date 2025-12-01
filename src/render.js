import { LASER } from "./config.js";

export function render(world, ctx) {
  const cw = world.canvasWidth;
  const ch = world.canvasHeight;

  ctx.clearRect(0, 0, cw, ch);

  ctx.save();
  const cam = world.camera;
  ctx.translate(cw / 2, ch / 2);
  ctx.scale(cam.zoom, cam.zoom);
  ctx.translate(-cam.x, -cam.y);

  drawBackground(world, ctx);
  drawPickups(world, ctx);
  drawEnemies(world, ctx);
  drawPlayer(world, ctx);
  drawBullets(world, ctx);
  drawRockets(world, ctx);
  drawExplosions(world, ctx);
  drawLasers(world, ctx);

  ctx.restore();

  drawHUD(world, ctx);
  drawStateOverlay(world, ctx);
}

function drawBackground(world, ctx) {
  ctx.fillStyle = "#050508";
  ctx.fillRect(0, 0, world.canvasWidth, world.canvasHeight);

  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  const step = 180;
  ctx.beginPath();
  for (let x = -5000; x <= 5000; x += step) {
    ctx.moveTo(x, -5000);
    ctx.lineTo(x, 5000);
  }
  for (let y = -5000; y <= 5000; y += step) {
    ctx.moveTo(-5000, y);
    ctx.lineTo(5000, y);
  }
  ctx.stroke();
  ctx.restore();
}

function drawPlayer(world, ctx) {
  const p = world.player;
  ctx.fillStyle = "#4dd0ff";
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawEnemies(world, ctx) {
  ctx.fillStyle = "#ff5555";
  for (const e of world.enemies) {
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBullets(world, ctx) {
  ctx.fillStyle = "#ffffff";
  for (const b of world.bullets) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawRockets(world, ctx) {
  ctx.fillStyle = "#ffaa33";
  for (const r of world.rockets) {
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawExplosions(world, ctx) {
  for (const ex of world.explosions) {
    const alpha = Math.max(0, ex.ttl / 0.25);
    ctx.fillStyle = `rgba(255,200,64,${alpha})`;
    ctx.beginPath();
    ctx.arc(ex.x, ex.y, ex.radius * (1.1 + (0.3 - alpha * 0.3)), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawLasers(world, ctx) {
  for (const beam of world.laserBeams) {
    const t = beam.ttl / LASER.beamLifetime;
    const alpha = Math.max(0, t);
    ctx.save();
    ctx.strokeStyle = `rgba(140,220,255,${alpha})`;
    ctx.lineWidth = LASER.thickness * (0.7 + 0.3 * t);
    ctx.shadowColor = "rgba(140,220,255,0.7)";
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(beam.x1, beam.y1);
    ctx.lineTo(beam.x2, beam.y2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawPickups(world, ctx) {
  ctx.fillStyle = "#3aff6b";
  for (const pk of world.pickups) {
    ctx.beginPath();
    ctx.arc(pk.x, pk.y, pk.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHUD(world, ctx) {
  const p = world.player;
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.font = "18px system-ui, sans-serif";

  const left = [
    `Score: ${world.score.toFixed(0)}`,
    `Wave: ${world.wave}`,
    `HP: ${p.hp.toFixed(0)}`,
    `Lvl: ${p.level}  XP: ${p.xp.toFixed(0)}/${p.xpToNext}`,
    `Weapon: ${world.currentWeapon ? world.currentWeapon.name : "?"}`,
    `Time: ${world.runTime.toFixed(1)}s`,
  ];
  let y = 10;
  for (const line of left) {
    ctx.fillText(line, 10, y);
    y += 20;
  }

  ctx.textAlign = "right";
  const stats = world.stats;
  const weapon = world.currentWeapon;
  const right = [
    `BestScore: ${world.bestScore.toFixed(0)}`,
    `BestWave: ${world.bestWave}`,
    `BestTime: ${world.bestTime.toFixed(1)}s`,
    `Crit: ${(100 * (stats.critChancePermanent + stats.critChanceTemp)).toFixed(0)}%  x${stats.critMult.toFixed(2)}`,
    weapon
      ? `Fire: ${(weapon.baseFireRate * stats.fireRateMul).toFixed(2)}/s`
      : "Fire: -",
    weapon
      ? `Range: ${(weapon.baseRange * stats.rangeMul).toFixed(0)}`
      : "Range: -",
    `Move: ${(stats.moveMul * 100).toFixed(0)}%`,
    `Dmg: ${(stats.damageMul * 100).toFixed(0)}%`,
  ];
  y = 10;
  for (const line of right) {
    ctx.fillText(line, world.canvasWidth - 10, y);
    y += 20;
  }
}

function drawStateOverlay(world, ctx) {
  const { state } = world;
  if (state === "playing") return;

  ctx.fillStyle = "rgba(0,0,0,0.55)";
  ctx.fillRect(0, 0, world.canvasWidth, world.canvasHeight);

  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";

  if (state === "menu") {
    ctx.font = "40px system-ui, sans-serif";
    ctx.fillText("BE_TRY : CORE RUN", world.canvasWidth / 2, world.canvasHeight / 2 - 40);
    ctx.font = "22px system-ui, sans-serif";
    ctx.fillText("SPACE — start", world.canvasWidth / 2, world.canvasHeight / 2 + 4);
    ctx.fillText("WASD — move, mouse — aim", world.canvasWidth / 2, world.canvasHeight / 2 + 32);
  } else if (state === "paused") {
    ctx.font = "40px system-ui, sans-serif";
    ctx.fillText("PAUSED", world.canvasWidth / 2, world.canvasHeight / 2 - 40);
    ctx.font = "22px system-ui, sans-serif";
    ctx.fillText("SPACE — resume, R — restart", world.canvasWidth / 2, world.canvasHeight / 2 + 4);
  } else if (state === "gameover") {
    ctx.font = "40px system-ui, sans-serif";
    ctx.fillText("GAME OVER", world.canvasWidth / 2, world.canvasHeight / 2 - 40);
    ctx.font = "22px system-ui, sans-serif";
    ctx.fillText("SPACE / R — restart", world.canvasWidth / 2, world.canvasHeight / 2 + 4);
  }
}
