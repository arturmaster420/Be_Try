
export const input={keys:new Set(),mouse:{x:0,y:0,down:false}};
export function initInput(c){
 window.addEventListener('keydown',e=>input.keys.add(e.code));
 window.addEventListener('keyup',e=>input.keys.delete(e.code));
 c.addEventListener('mousedown',e=>input.mouse.down=true);
 window.addEventListener('mouseup',()=>input.mouse.down=false);
 c.addEventListener('mousemove',e=>{
   const r=c.getBoundingClientRect();
   input.mouse.x=(e.clientX-r.left)/r.width*c.width;
   input.mouse.y=(e.clientY-r.top)/r.height*c.height;
 });
}
export const key=c=>input.keys.has(c);
