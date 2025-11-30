import { getEffectiveStats, getPermanent } from "../gameplay/buffs.js";

export function renderHUD(world) {
  const ui = document.getElementById("ui");
  if (!ui) return;

  const eff = getEffectiveStats();
  const perm = getPermanent();

  ui.innerHTML = "";

  const line1 = document.createElement("div");
  line1.className = "line";

  const left = document.createElement("div");
  left.className = "left";
  left.innerHTML = `
    <span class="badge">Score: ${world.score.toFixed(0)}</span>
    <span class="badge">Best: ${world.highScore.toFixed(0)}</span>
    <span class="badge">Wave: ${world.wave}</span>
  `;

  const hpPct = (world.player.hp / world.player.maxHp) * 100;
  const right = document.createElement("div");
  right.className = "right";
  right.innerHTML = `
    <span class="badge">HP: ${Math.ceil(world.player.hp)}/${world.player.maxHp} (${hpPct.toFixed(0)}%)</span>
    <span class="badge">Crit: ${(eff.critChance * 100).toFixed(1)}%</span>
    <span class="badge">xCrit: ${eff.critMult.toFixed(2)}x</span>
  `;

  line1.appendChild(left);
  line1.appendChild(right);
  ui.appendChild(line1);

  const line2 = document.createElement("div");
  line2.className = "line";

  const left2 = document.createElement("div");
  left2.className = "left";
  left2.innerHTML = `
    <span class="badge perm">+Crit%: ${(perm.critChance * 100).toFixed(1)}</span>
    <span class="badge perm">+CritDmg%: ${(perm.critDamagePct * 100).toFixed(1)}</span>
    <span class="badge perm">+FireRate%: ${(perm.fireRatePct * 100).toFixed(1)}</span>
    <span class="badge perm">+Range%: ${(perm.rangePct * 100).toFixed(1)}</span>
    <span class="badge perm">+Speed%: ${(perm.speedPct * 100).toFixed(1)}</span>
    <span class="badge perm">+Damage%: ${(perm.damagePct * 100).toFixed(1)}</span>
  `;

  const right2 = document.createElement("div");
  right2.className = "right";

  const tempTime = eff.tempCritTimeLeft;
  right2.innerHTML =
    tempTime > 0
      ? `<span class="badge buff">Booster: ${tempTime.toFixed(0)}s</span>`
      : `<span class="badge">Booster: none</span>`;

  line2.appendChild(left2);
  line2.appendChild(right2);
  ui.appendChild(line2);

  const line3 = document.createElement("div");
  line3.className = "line";
  const left3 = document.createElement("div");
  left3.className = "left";
  left3.innerHTML = `
    <span class="badge">Best wave: ${world.bestWave}</span>
    <span class="badge">Best time: ${formatTime(world.bestTime)}</span>
  `;
  line3.appendChild(left3);
  ui.appendChild(line3);
}

function formatTime(t) {
  if (!t || t <= 0) return "0:00";
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function renderOverlays(world) {
  document.querySelectorAll(".overlay").forEach((el) => el.remove());

  if (!world.started) {
    const ov = document.createElement("div");
    ov.className = "overlay menu";
    ov.innerHTML = `
      <span>
        <h1>BE_TRY</h1>
        <p>Best score: ${world.highScore.toFixed(0)}</p>
        <p>Best wave: ${world.bestWave}</p>
        <p>Best time: ${formatTime(world.bestTime)}</p>
        <p class="small">Press SPACE or CLICK to play</p>
        <p class="small">WASD / Arrows + Mouse, or tap & drag on mobile</p>
      </span>
    `;
    document.body.appendChild(ov);
    return;
  }

  if (world.paused) {
    const ov = document.createElement("div");
    ov.className = "overlay";
    ov.innerHTML = "<span>PAUSED</span>";
    document.body.appendChild(ov);
  } else if (world.gameOver) {
    const ov = document.createElement("div");
    ov.className = "overlay";
    ov.innerHTML = "<span>GAME OVER</span>";
    document.body.appendChild(ov);

    const hint = document.createElement("div");
    hint.className = "overlay small";
    hint.innerHTML = "<span>Press SPACE or R to restart</span>";
    document.body.appendChild(hint);
  }
}
