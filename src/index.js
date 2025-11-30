
import {CONFIG} from './core/config.js'
import {initInput,input} from './core/input.js'
import {createCam,updCam} from './core/camera.js'
import {createP,updP} from './core/player.js'
import {updBuffs,eff} from './gameplay/buffs.js'
import {Weapons,weaponForLvl} from './gameplay/weapons.js'
import {shoot,updBullets} from './gameplay/bullets.js'
import {spawn,upd} from './gameplay/enemies.js'

const c=document.getElementById('game'),ctx=c.getContext('2d');
c.width=CONFIG.W;c.height=CONFIG.H;
initInput(c);

const w={player:createP(CONFIG),enemies:[],bullets:[],pickups:[],score:0};
const cam=createCam();

let last=performance.now();
function loop(n){
 let dt=Math.min((n-last)/1000,0.1);last=n;

 let p=w.player;
 let efs=eff(CONFIG);
 p.ms=efs.ms;
 cam.mx=input.mouse.x/cam.zoom+cam.x;
 cam.my=input.mouse.y/cam.zoom+cam.y;

 updP(p,dt,CONFIG,cam);
 if(input.mouse.down){
  let wid=weaponForLvl(p.lvl);let W=Weapons[wid];
  p.ls+=dt;if(p.ls>1/(efs.fr*W.fr)){shoot(w,p,efs,W);p.ls=0;}
 }
 updBuffs(dt);
 updBullets(w,dt);
 upd(w,dt,CONFIG);

 if(Math.random()<0.02)spawn(w,CONFIG);
 updCam(cam,p,CONFIG);

 import('./rendering/renderer.js').then(m=>m.render(ctx,w,cam,CONFIG));
 requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
