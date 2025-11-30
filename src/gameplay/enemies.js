
import {rand,dist2,norm} from '../core/math.js'
export function spawn(world,cfg){
 let a=rand(0,6.28),d=rand(550,900);
 world.enemies.push({x:world.player.x+Math.cos(a)*d,y:world.player.y+Math.sin(a)*d,
 r:cfg.ER,hp:cfg.EHP,s:cfg.ES});
}
export function upd(world,dt,cfg){
 const p=world.player;
 world.enemies.forEach((e,i)=>{
  let v=norm(p.x-e.x,p.y-e.y);e.x+=v.x*e.s*dt;e.y+=v.y*e.s*dt;
  if(dist2(e.x,e.y,p.x,p.y)<(e.r+p.r)**2)p.hp-=cfg.EC*dt;
  if(e.hp<=0) world.enemies.splice(i,1);
 });
}
