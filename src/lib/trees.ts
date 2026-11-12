/* Treeline silhouette — curved like a fisheye horizon. Deterministic, so it is computed once. */
import { mulberry32 } from './util';

function layer(seed: number, base: number, amp: number, hmin: number, hmax: number) {
  const r = mulberry32(seed); let d = ''; const H = 320;
  const by = (x: number) => H - (base + amp * Math.pow((x - 800) / 800, 2));
  let ground = `M -40 ${H + 5} `;
  for (let x = -40; x <= 1640; x += 20) ground += `L ${x} ${by(x).toFixed(1)} `;
  ground += `L 1640 ${H + 5} Z`; d += ground;
  for (let x = -30; x < 1640; x += 7 + r() * 11) {
    const y = by(x) + 4, h = (hmin + r() * (hmax - hmin)) * (1 + 0.6 * Math.pow((x - 800) / 800, 2)), w = h * (0.16 + r() * 0.06);
    const p: [number, number][] = [[x, y - h]];
    const tiers = 4;
    for (let j = 1; j <= tiers; j++) {
      const ty = y - h + ((h * j) / tiers) * 0.92, tw = (w * j) / tiers;
      p.push([x + tw, ty], [x + tw * 0.45, ty - (j < tiers ? h * 0.04 : 0)]);
    }
    const left = p.slice(1).map(([px, py]) => [2 * x - px, py] as [number, number]).reverse();
    const pts = [...p, [x + w * 0.12, y + 6], [x - w * 0.12, y + 6], ...left];
    d += 'M ' + pts.map(([a, b]) => a.toFixed(1) + ' ' + b.toFixed(1)).join(' L ') + ' Z ';
  }
  return d;
}

export const TREES_BACK = layer(3, 38, 95, 24, 52);
export const TREES_FRONT = layer(11, 8, 92, 30, 68);
