import { dist } from '../core/math.js';
import { healPlayer } from '../core/player.js';

export function updatePickups(world, dt) {
  const p = world.player;
  for (let i = world.pickups.length - 1; i >= 0; i--) {
    const pk = world.pickups[i];
    const d = dist(pk, p);
    if (d < pk.radius + p.radius) {
      if (pk.kind === 'hp') {
        healPlayer(world, 10);
      }
      world.pickups.splice(i, 1);
    }
  }
}
