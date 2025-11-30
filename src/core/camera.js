
export function createCam(){return{x:0,y:0,zoom:0.75}}
export function updCam(cam,p,cfg){
 cam.x=p.x-cfg.W/2/cam.zoom;
 cam.y=p.y-cfg.H/2/cam.zoom;
}
