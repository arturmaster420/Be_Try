import { CONFIG } from "../core/config.js";
import { dist2, normalize } from "../core/math.js";

export function updatePickups(world, dt) {
  const p = world.player;

  const magnetRadius =
    CONFIG.PICKUP_MAGNET_BASE + world.wave * CONFIG.PICKUP_MAGNET_PER_WAVE;
  const magnetR2 = magnetRadius * magnetRadius;
  const pullSpeed = 260;

  for (let i = world.pickups.length - 1; i >= 0; i--) {
    const pk = world.pickups[i];
    const dx = p.x - pk.x;
    const dy = p.y - pk.y;
    const d2 = dx * dx + dy * dy;

    if (d2 < magnetR2) {
      const dir = normalize(dx, dy);
      pk.x += dir.x * pullSpeed * dt;
      pk.y += dir.y * pullSpeed * dt;
    }

    const r = pk.radius + p.radius;
    if (dist2(pk.x, pk.y, p.x, p.y) <= r * r) {
      if (pk.type === "heal") {
        p.hp = Math.min(p.maxHp, p.hp + CONFIG.PICKUP_HEAL_AMOUNT);
        world.messages.push({ text: "+HP", time: 2, color: "#4dff88" });
      }
      world.pickups.splice(i, 1);
    }
  }
}
