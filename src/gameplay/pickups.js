import { CONFIG } from "../core/config.js";
import { dist2, normalize } from "../core/math.js";

export function updatePickups(world, dt) {
  const pcks = world.pickups;
  const player = world.player;

  const magnetRadius =
    CONFIG.PICKUP_MAGNET_BASE + world.wave * CONFIG.PICKUP_MAGNET_PER_WAVE;
  const magnetR2 = magnetRadius * magnetRadius;
  const pullSpeed = 260;

  for (let i = pcks.length - 1; i >= 0; i--) {
    const p = pcks[i];
    const dx = player.x - p.x;
    const dy = player.y - p.y;
    const d2 = dx * dx + dy * dy;

    if (d2 < magnetR2) {
      const n = normalize(dx, dy);
      p.x += n.x * pullSpeed * dt;
      p.y += n.y * pullSpeed * dt;
    }

    const r = p.radius + player.radius;
    if (dist2(p.x, p.y, player.x, player.y) <= r * r) {
      if (p.type === "heal") {
        player.hp = Math.min(player.maxHp, player.hp + CONFIG.PICKUP_HEAL_AMOUNT);
        world.messages.push({ text: "+HP", time: 2, color: "#4dff88" });
      }
      pcks.splice(i, 1);
    }
  }
}
