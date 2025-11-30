export function randRange(min, max) {
  return Math.random() * (max - min) + min;
}
export function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}
export function dist2(ax, ay, bx, by) {
  const dx = ax - bx;
  const dy = ay - by;
  return dx * dx + dy * dy;
}
export function angleTo(ax, ay, bx, by) {
  return Math.atan2(by - ay, bx - ax);
}
export function normalize(dx, dy) {
  const len = Math.hypot(dx, dy) || 1;
  return { x: dx / len, y: dy / len };
}
