import { CONFIG } from "../core/config.js";
import { dist2 } from "../core/math.js";

export function updatePickups(world, dt) {
  const picks = world.pickups;
  const player = world.player;

  for (let i = picks.length - 1; i >= 0; i--) {
    const p = picks[i];
    const r = p.radius + player.radius;
    if (dist2(p.x, p.y, player.x, player.y) <= r * r) {
      if (p.type === "heal") {
        player.hp = Math.min(player.maxHp, player.hp + CONFIG.PICKUP_HEAL_AMOUNT);
        world.messages.push({
          text: "+HP",
          time: 2,
          color: "#4dff88",
        });
      }
      picks.splice(i, 1);
    }
  }
}
