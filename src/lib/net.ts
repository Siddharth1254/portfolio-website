/* Hero constellation network — dots drift, lean towards the cursor, link up, ripple on click. */
import { isLight, prefersReducedMotion } from './util';

interface Pt { x: number; y: number; vx: number; vy: number; r: number; warm: boolean }

export function createNet(cv: HTMLCanvasElement, hero: HTMLElement) {
  const ctx = cv.getContext('2d')!;
  const RM = prefersReducedMotion();
  const dpr = Math.min(devicePixelRatio || 1, 2);
  let W = 0, H = 0, pts: Pt[] = [], pulses: { a: Pt; b: Pt; t: number }[] = [], waves: { x: number; y: number; r: number }[] = [];
  let vis = true;
  const mouse = { x: -9999, y: -9999 };
  const LINK = 125;

  function resize() {
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(120, Math.floor((W * H) / 12000));
    pts = Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H * 0.82,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.6, warm: Math.random() < 0.22,
    }));
  }
  const onMove = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; };
  const onLeave = () => { mouse.x = mouse.y = -9999; };
  const onClick = (e: MouseEvent) => {
    if ((e.target as Element).closest('a,button')) return;
    const r = cv.getBoundingClientRect(); waves.push({ x: e.clientX - r.left, y: e.clientY - r.top, r: 0 });
  };
  hero.addEventListener('pointermove', onMove);
  hero.addEventListener('pointerleave', onLeave);
  hero.addEventListener('click', onClick);
  const io = new IntersectionObserver(([en]) => { vis = en.isIntersecting; });
  io.observe(hero);

  let raf = 0;
  function frame() {
    raf = requestAnimationFrame(frame);
    if (!vis) return;
    // the hero can report zero size while the page is still laying out
    if (W < 1 || H < 1) { if (cv.clientWidth > 0 && cv.clientHeight > 0) resize(); else return; }
    const day = isLight();
    const COOL = day ? '16,32,61' : '226,232,255', WARM = day ? '217,98,43' : '255,190,120';
    ctx.clearRect(0, 0, W, H);
    for (const w of waves) w.r += 9;
    waves = waves.filter((w) => w.r < Math.max(W, H));
    for (const p of pts) {
      if (!RM) { p.x += p.vx; p.y += p.vy; }
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H * 0.85) p.vy *= -1;
      const dx = mouse.x - p.x, dy = mouse.y - p.y, d = Math.hypot(dx, dy);
      if (d < 200 && d > 1) { p.x += (dx / d) * 0.6; p.y += (dy / d) * 0.6; }
      for (const w of waves) {
        const wx = p.x - w.x, wy = p.y - w.y, wd = Math.hypot(wx, wy) || 1;
        if (Math.abs(wd - w.r) < 50) { p.x += (wx / wd) * 6; p.y += (wy / wd) * 6; }
      }
    }
    for (let i = 0; i < pts.length; i++) {
      const a = pts[i];
      for (let j = i + 1; j < pts.length; j++) {
        const b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) {
          const near = Math.hypot(mouse.x - a.x, mouse.y - a.y) < 200;
          ctx.strokeStyle = `rgba(${near ? WARM : COOL},${(1 - d / LINK) * (near ? 0.7 : day ? 0.2 : 0.3)})`; ctx.lineWidth = near ? 1.05 : 0.7;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          if (!RM && pulses.length < 30 && Math.random() < 0.0008) pulses.push({ a, b, t: 0 });
        }
      }
      const md = Math.hypot(mouse.x - a.x, mouse.y - a.y);
      if (md < 200) {
        ctx.strokeStyle = `rgba(${WARM},${(1 - md / 200) * 0.45})`; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
      }
    }
    pulses = pulses.filter((p) => (p.t += 0.025) < 1);
    for (const p of pulses) {
      const x = p.a.x + (p.b.x - p.a.x) * p.t, y = p.a.y + (p.b.y - p.a.y) * p.t;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 7);
      g.addColorStop(0, day ? 'rgba(16,32,61,.8)' : 'rgba(255,255,255,.95)'); g.addColorStop(1, `rgba(${WARM},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 7, 0, 6.283); ctx.fill();
    }
    for (const p of pts) { ctx.fillStyle = `rgba(${p.warm ? WARM : COOL},${day ? 0.75 : 0.9})`; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill(); }
    for (const w of waves) { ctx.strokeStyle = `rgba(${WARM},${Math.max(0, 0.5 - w.r / 1200)})`; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.arc(w.x, w.y, w.r, 0, 6.283); ctx.stroke(); }
  }

  resize();
  addEventListener('resize', resize);
  frame();

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    removeEventListener('resize', resize);
    hero.removeEventListener('pointermove', onMove);
    hero.removeEventListener('pointerleave', onLeave);
    hero.removeEventListener('click', onClick);
  };
}
