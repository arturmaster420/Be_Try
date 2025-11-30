
export const dist2=(a,b,x,y)=>{let dx=a-x,dy=b-y;return dx*dx+dy*dy;}
export const rand=(a,b)=>Math.random()*(b-a)+a;
export const norm=(x,y)=>{let l=Math.hypot(x,y)||1;return {x:x/l,y:y/l};}
export const ang=(ax,ay,bx,by)=>Math.atan2(by-ay,bx-ax);
