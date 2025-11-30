
import {norm,ang} from './math.js'
import {key,input} from './input.js'
export function createP(cfg){return{x:0,y:0,r:cfg.PR,hp:cfg.PHP,php:cfg.PHP,a:0,ls:0,lvl:1,xp:0,xpn:cfg.XP_BASE}}
export function updP(p,dt,cfg,cam){
 let dx=0,dy=0;
 if(key('KeyW'))dy-=1;if(key('KeyS'))dy+=1;if(key('KeyA'))dx-=1;if(key('KeyD'))dx+=1;
 if(dx||dy){let v=norm(dx,dy);p.x+=v.x*p.ms*dt;p.y+=v.y*p.ms*dt;}
 p.a=ang(p.x,p.y,cam.mx,cam.my);
}
