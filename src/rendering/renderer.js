import { LASER } from '../core/config.js';

export function render(world, ctx) {
  const cw = world.canvasWidth;
  const ch = world.canvasHeight;

  ctx.clearRect(0, 0, cw, ch);

  // transform
  ctx.save();
  const cam = world.camera;
  ctx.translate(cw / 2, ch / 2);
  ctx.scale(cam.zoom, cam.zoom);
  ctx.translate(-cam.x, -cam.y);

  drawBackground(world, ctx);
  drawPickups(world, ctx);
  drawEnemies(world, ctx);
  drawPlayer(world, ctx);
  drawProjectiles(world, ctx);
  drawExplosions(world, ctx);
  drawLaserBeams(world, ctx);

  ctx.restore();

  drawHUD(world, ctx);
  drawStateOverlay(world, ctx);
}

function drawBackground(world, ctx) {
  ctx.fillStyle = '#050507';
  ctx.fillRect(0, 0, world.width || 9000, world.height || 9000);

  // subtle grid
  ctx.strokeStyle = 'rgba(255,255,255,0.04)';
  ctx.lineWidth = 1;
  const step = 180;
  ctx.beginPath();
  for (let x = 0; x <= (world.width || 9000); x += step) {
    ctx.moveTo(x, 0);
    ctx.lineTo(x, world.height || 9000);
  }
  for (let y = 0; y <= (world.height || 9000); y += step) {
    ctx.moveTo(0, y);
    ctx.lineTo(world.width || 9000, y);
  }
  ctx.stroke();
}

function drawPlayer(world, ctx) {
  const p = world.player;
  ctx.fillStyle = '#4dd0ff';
  ctx.beginPath();
  ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawEnemies(world, ctx) {
  for (const e of world.enemies) {
    let color = '#ff4b4b';
    if (e.type === 'boss') color = '#ff00ff';
    else if (e.type === 'boosterBoss') color = '#00ff88';
    else if (e.type === 'fast') color = '#ff9966';
    else if (e.type === 'tank') color = '#ff3333';

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPickups(world, ctx) {
  ctx.fillStyle = '#3aff3a';
  for (const pk of world.pickups) {
    ctx.beginPath();
    ctx.arc(pk.x, pk.y, pk.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawProjectiles(world, ctx) {
  ctx.fillStyle = '#ffffff';
  for (const b of world.projectiles) {
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#ffaa00';
  for (const r of world.rockets) {
    ctx.beginPath();
    ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawExplosions(world, ctx) {
  for (const ex of world.explosions) {
    const alpha = Math.max(0, ex.ttl / 0.25);
    ctx.fillStyle = `rgba(255,200,0,${alpha})`;
    ctx.beginPath();
    ctx.arc(ex.x, ex.y, ex.radius * (1.2 - alpha * 0.2), 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawLaserBeams(world, ctx) {
  for (const beam of world.laserBeams) {
    const t = beam.ttl / LASER.beamLifetime;
    const alpha = Math.max(0, t);
    const width = LASER.thickness * (0.7 + 0.3 * t);

    ctx.save();
    ctx.strokeStyle = `rgba(120,220,255,${alpha})`;
    ctx.lineWidth = width;
    ctx.shadowColor = 'rgba(120,220,255,0.6)';
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.moveTo(beam.x1, beam.y1);
    ctx.lineTo(beam.x2, beam.y2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawHUD(world, ctx) {
  const p = world.player;
  ctx.fillStyle = '#ffffff';
  ctx.font = '18px system-ui, sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  const leftLines = [
    `Score: ${world.score.toFixed(0)}`,
    `Wave: ${world.wave}`,
    `HP: ${p.hp.toFixed(0)}`,
    `Lvl: ${p.level}  XP: ${p.xp.toFixed(0)}/${p.xpToNext}`,
    `Weapon: ${p.weapon.name}`,
    `Time: ${world.runTime.toFixed(1)}s`,
  ];
  let y = 10;
  for (const line of leftLines) {
    ctx.fillText(line, 10, y);
    y += 20;
  }

  ctx.textAlign = 'right';
  const rightLines = [
    `BestScore: ${world.bestScore.toFixed(0)}`,
    `BestWave: ${world.bestWave}`,
    `BestTime: ${world.bestTime.toFixed(1)}s`,
    `Crit: ${(100 * (world.stats.critChancePermanent + world.stats.critChanceTemp)).toFixed(0)}%  x${world.stats.critMult.toFixed(2)}`,
    `Fire: ${(world.player.weapon.baseFireRate * world.stats.fireRateMul).toFixed(2)}/s`,
    `Range: ${(world.player.weapon.baseRange * world.stats.rangeMul).toFixed(0)}`,
    `Move: ${(world.stats.moveMul * 100).toFixed(0)}%`,
    `Dmg: ${(world.stats.damageMul * 100).toFixed(0)}%`,
  ];
  y = 10;
  for (const line of rightLines) {
    ctx.fillText(line, world.canvasWidth - 10, y);
    y += 20;
  }
}

function drawStateOverlay(world, ctx) {
  const { state } = world;
  if (state === 'playing') return;

  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(0, 0, world.canvasWidth, world.canvasHeight);

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';

  if (state === 'menu') {
    ctx.font = '40px system-ui, sans-serif';
    ctx.fillText('BE_TRY : CORE RUN', world.canvasWidth / 2, world.canvasHeight / 2 - 40);
    ctx.font = '22px system-ui, sans-serif';
    ctx.fillText('SPACE — start,  P — pause', world.canvasWidth / 2, world.canvasHeight / 2 + 10);
    ctx.fillText('WASD — move,  Mouse — aim', world.canvasWidth / 2, world.canvasHeight / 2 + 40);
  } else if (state === 'paused') {
    ctx.font = '40px system-ui, sans-serif';
    ctx.fillText('PAUSED', world.canvasWidth / 2, world.canvasHeight / 2 - 30);
    ctx.font = '22px system-ui, sans-serif';
    ctx.fillText('SPACE — resume,  R — restart,  P — pause', world.canvasWidth / 2, world.canvasHeight / 2 + 10);
  } else if (state === 'gameover') {
    ctx.font = '40px system-ui, sans-serif';
    ctx.fillText('GAME OVER', world.canvasWidth / 2, world.canvasHeight / 2 - 30);
    ctx.font = '22px system-ui, sans-serif';
    ctx.fillText('SPACE / R — restart,  P — pause', world.canvasWidth / 2, world.canvasHeight / 2 + 10);
  }
}
