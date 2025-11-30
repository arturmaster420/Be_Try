
export function updPk(world,dt,cfg){
 world.pickups.forEach((p,i)=>{
  if((p.x-world.player.x)**2+(p.y-world.player.y)**2<40*40){
   world.player.hp=Math.min(world.player.hp+cfg.PK_H,world.player.php);
   world.pickups.splice(i,1);
  }
 });
}
