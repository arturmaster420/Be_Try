
export function render(ctx,w,cam,cfg){
 ctx.clearRect(0,0,cfg.W,cfg.H);
 ctx.save();
 ctx.scale(cam.zoom,cam.zoom);
 ctx.translate(-cam.x,-cam.y);

 ctx.strokeStyle='rgba(255,255,255,0.03)';
 for(let x=-5000;x<5000;x+=180){ctx.beginPath();ctx.moveTo(x,-5000);ctx.lineTo(x,5000);ctx.stroke();}
 for(let y=-5000;y<5000;y+=180){ctx.beginPath();ctx.moveTo(-5000,y);ctx.lineTo(5000,y);ctx.stroke();}

 w.enemies.forEach(e=>{ctx.fillStyle='#ff4444';ctx.beginPath();ctx.arc(e.x,e.y,e.r,0,6.28);ctx.fill();});
 w.bullets.forEach(b=>{ctx.fillStyle=b.cr?'#fff060':'#fff';ctx.beginPath();ctx.arc(b.x,b.y,3,0,6.28);ctx.fill();});
 ctx.fillStyle='#44aaff';ctx.beginPath();ctx.arc(w.player.x,w.player.y,w.player.r,0,6.28);ctx.fill();
 ctx.restore();

 ctx.fillStyle='#fff';ctx.font='14px monospace';
 ctx.fillText(`Score:${w.score}`,10,20);
 ctx.fillText(`HP:${Math.round(w.player.hp)}`,10,40);
 ctx.fillText(`Lvl:${w.player.lvl} XP:${w.player.xp}/${w.player.xpn}`,10,60);
}
