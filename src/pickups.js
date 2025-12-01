export function updatePickups(world, dt) {
  const p = world.player;
  for (let i = world.pickups.length - 1; i >= 0; i--) {
    const pk = world.pickups[i];
    const d = Math.hypot(pk.x - p.x, pk.y - p.y);
    if (d < pk.radius + p.radius) {
      if (pk.kind === "hp") {
        p.hp += 10;
      }
      world.pickups.splice(i, 1);
    }
  }
}
