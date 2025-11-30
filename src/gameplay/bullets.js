
import {dist2} from '../core/math.js'
export function shoot(world,p,eff,w){
 for(let i=0;i<w.n;i++){
  let off=(i/(w.n-1)-0.5)*w.sp||0;
  world.bullets.push({x:p.x,y:p.y,a:p.a+off,v:600,d:eff.dmg,cr:Math.random()<eff.cc});
 }
}
export function updBullets(world,dt){
 for(let i=world.bullets.length-1;i>=0;i--){
  let b=world.bullets[i];
  b.x+=Math.cos(b.a)*b.v*dt;b.y+=Math.sin(b.a)*b.v*dt;
  world.enemies.forEach(e=>{if(dist2(b.x,b.y,e.x,e.y)<(e.r+3)**2)e.hp-=b.d;});
  b.l=(b.l||0)+dt;if(b.l>1.2)world.bullets.splice(i,1);
 }
}
