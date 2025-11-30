
import {dist2} from '../core/math.js';
export function spawnRocket(world,p,eff,w){
 world.rockets.push({x:p.x,y:p.y,a:p.a,v:300,d:eff.dmg*2});
}
export function updRockets(wr,dt,world){
 for(let i=wr.length-1;i>=0;i--){
  let r=wr[i];r.x+=Math.cos(r.a)*r.v*dt;r.y+=Math.sin(r.a)*r.v*dt;
  world.enemies.forEach(e=>{
    if(dist2(r.x,r.y,e.x,e.y)<(e.r+8)*(e.r+8)){e.hp-=r.d;explode(world,r);wr.splice(i,1);}
  });
 }
}
function explode(world,r){
 world.enemies.forEach(e=>{
  if(dist2(r.x,r.y,e.x,e.y)<120*120)e.hp-=r.d*0.7;
 });
}
