export const pad = (n: number) => String(n).padStart(2, '0');
export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const ease = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2);
export const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const gauss = (r: () => number) => (r() + r() + r() + r() - 2) / 1.15;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isLight = () => document.body.classList.contains('light');
