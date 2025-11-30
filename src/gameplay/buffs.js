
export let perm={cc:0,cd:0,fr:0,rg:0,ms:0,dm:0};
export let temp=[];
export function resetBuffs(){perm={cc:0,cd:0,fr:0,rg:0,ms:0,dm:0};temp=[];}
export function updBuffs(dt){temp=temp.filter(b=>(b.t-=dt)>0);}
export function eff(cfg){
 let cc=cfg.CRIT_C+perm.cc,cd=perm.cd,fr=perm.fr,rg=perm.rg,ms=perm.ms,dm=perm.dm;
 let tcc=0,tcd=0,tfr=0,trag=0,tms=0;
 temp.forEach(b=>{tcc+=b.cc||0;tcd+=b.cd||0;tfr+=b.fr||0;trag+=b.rg||0;tms+=b.ms||0;});
 cc=Math.min(cc+tcc,cfg.TCAP);
 return{
  ms:cfg.MS*(1+ms+tms),
  fr:cfg.FR*(1+fr+tfr),
  rg:cfg.BR*(1+rg+trag),
  dmg:cfg.DMG*(1+dm),
  cc,cm:cfg.CRIT_M*(1+cd+tcd)
 };
}
