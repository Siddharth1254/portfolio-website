/* SKY — procedural Milky Way night + matching daytime sky.
   Same composition: the Milky Way band (night) becomes a band of high cirrus (day);
   the purple horizon glow (night) becomes the sunrise glow (day). */
import { gauss, isLight, mulberry32, prefersReducedMotion } from './util';

interface TwStar { x: number; y: number; sz: number; col: string; ph: number; sp: number }

function bandGeom(w: number, h: number) {
  const A = { x: w * 0.12, y: h * 1.08 }, B = { x: w * 0.82, y: -h * 0.08 };
  const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy);
  return { A, B, dx, dy, L, ux: dx / L, uy: dy / L, px: -dy / L, py: dx / L, ang: Math.atan2(dy, dx) };
}

export function createSky(skyNight: HTMLCanvasElement, skyDay: HTMLCanvasElement, tw: HTMLCanvasElement) {
  let twStars: TwStar[] = [];
  let shooting: { x: number; y: number; t: number } | null = null;
  const RM = prefersReducedMotion();

  function drawNight() {
    const dpr = Math.min(devicePixelRatio, 1.5), w = innerWidth, h = innerHeight;
    skyNight.width = w * dpr; skyNight.height = h * dpr;
    const c = skyNight.getContext('2d')!; c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const r = mulberry32(7);
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#03040c'); g.addColorStop(0.5, '#0a0f2e'); g.addColorStop(1, '#171a4a');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    // horizon glows (purple right, teal left)
    const glow = (x: number, y: number, rad: number, col: string) => {
      const q = c.createRadialGradient(x, y, 0, x, y, rad); q.addColorStop(0, col); q.addColorStop(1, 'rgba(0,0,0,0)');
      c.fillStyle = q; c.fillRect(0, 0, w, h);
    };
    glow(w * 0.98, h * 1.02, h * 0.85, 'rgba(170,60,255,.55)');
    glow(w * 1.0, h * 0.95, h * 0.35, 'rgba(255,90,200,.25)');
    glow(w * 0.02, h * 1.05, h * 0.7, 'rgba(40,170,190,.22)');
    // Milky Way band
    const b = bandGeom(w, h), bw = Math.min(w, h) * 0.13;
    c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 1500; i++) {
      const s = r(), widen = 0.55 + 0.9 * Math.sin(s * Math.PI);
      const off = gauss(r) * bw * widen;
      const x = b.A.x + b.dx * s + b.px * off, y = b.A.y + b.dy * s + b.py * off;
      const rad = 14 + r() * 60, a = 0.018 + r() * 0.03;
      const tint = r() < 0.2 ? '200,170,255' : r() < 0.5 ? '170,200,255' : '225,230,255';
      const q = c.createRadialGradient(x, y, 0, x, y, rad); q.addColorStop(0, `rgba(${tint},${a})`); q.addColorStop(1, `rgba(${tint},0)`);
      c.fillStyle = q; c.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    c.globalCompositeOperation = 'source-over';
    // dust lanes
    for (let i = 0; i < 520; i++) {
      const s = r(); const off = (gauss(r) * 0.35 + Math.sin(s * 11) * 0.18) * bw;
      const x = b.A.x + b.dx * s + b.px * off, y = b.A.y + b.dy * s + b.py * off, rad = 8 + r() * 32;
      const q = c.createRadialGradient(x, y, 0, x, y, rad); q.addColorStop(0, 'rgba(6,7,22,.10)'); q.addColorStop(1, 'rgba(6,7,22,0)');
      c.fillStyle = q; c.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
    // stars (denser near the band)
    const n = Math.floor((w * h) / 700); twStars = [];
    for (let i = 0; i < n; i++) {
      let x: number, y: number;
      if (r() < 0.45) { const s = r(), off = gauss(r) * bw * 1.5; x = b.A.x + b.dx * s + b.px * off; y = b.A.y + b.dy * s + b.py * off; }
      else { x = r() * w; y = r() * h; }
      const sz = Math.pow(r(), 3) * 1.3 + 0.25, a = 0.35 + r() * 0.65;
      const t = r(); const col = t < 0.12 ? '255,215,180' : t < 0.3 ? '190,210,255' : '255,255,255';
      c.fillStyle = `rgba(${col},${a})`; c.beginPath(); c.arc(x, y, sz, 0, Math.PI * 2); c.fill();
      if (sz > 1.2 && twStars.length < 180) twStars.push({ x, y, sz, col, ph: r() * 6.28, sp: 0.6 + r() * 1.6 });
    }
    for (let i = 0; i < 45; i++) { // bright glowing stars
      const x = r() * w, y = r() * h * 0.85, rad = 4 + r() * 8;
      const q = c.createRadialGradient(x, y, 0, x, y, rad); q.addColorStop(0, 'rgba(255,255,255,.9)'); q.addColorStop(0.2, 'rgba(200,215,255,.35)'); q.addColorStop(1, 'rgba(200,215,255,0)');
      c.fillStyle = q; c.fillRect(x - rad, y - rad, rad * 2, rad * 2);
      twStars.push({ x, y, sz: 1.1, col: '255,255,255', ph: r() * 6.28, sp: 0.8 + r() * 1.4 });
    }
  }

  function drawDay() {
    const dpr = Math.min(devicePixelRatio, 1.5), w = innerWidth, h = innerHeight;
    skyDay.width = w * dpr; skyDay.height = h * dpr;
    const c = skyDay.getContext('2d')!; c.setTransform(dpr, 0, 0, dpr, 0, 0);
    const r = mulberry32(7);
    const g = c.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#2b6acb'); g.addColorStop(0.45, '#6eaaf0'); g.addColorStop(0.8, '#bcdcf6'); g.addColorStop(1, '#ffe5c2');
    c.fillStyle = g; c.fillRect(0, 0, w, h);
    const glow = (x: number, y: number, rad: number, stops: [number, string][]) => {
      const q = c.createRadialGradient(x, y, 0, x, y, rad); stops.forEach(([o, col]) => q.addColorStop(o, col));
      c.fillStyle = q; c.fillRect(0, 0, w, h);
    };
    // sunrise where the purple glow is at night
    glow(w * 0.97, h * 1.0, h * 0.9, [[0, 'rgba(255,248,225,.95)'], [0.18, 'rgba(255,214,160,.55)'], [1, 'rgba(255,200,150,0)']]);
    glow(w * 0.02, h * 1.05, h * 0.6, [[0, 'rgba(255,255,255,.35)'], [1, 'rgba(255,255,255,0)']]);
    // pale daytime moon
    const mx = w * 0.16, my = h * 0.2, mr = Math.min(w, h) * 0.022;
    c.fillStyle = 'rgba(255,255,255,.55)'; c.beginPath(); c.arc(mx, my, mr, 0, Math.PI * 2); c.fill();
    c.fillStyle = 'rgba(120,170,235,.35)'; c.beginPath(); c.arc(mx + mr * 0.45, my - mr * 0.2, mr * 0.92, 0, Math.PI * 2); c.fill();
    // cirrus band along the same diagonal as the Milky Way
    const b = bandGeom(w, h), bw = Math.min(w, h) * 0.13;
    for (let i = 0; i < 260; i++) {
      const s = r(), off = gauss(r) * bw * (0.6 + 0.8 * Math.sin(s * Math.PI));
      const x = b.A.x + b.dx * s + b.px * off, y = b.A.y + b.dy * s + b.py * off, rad = 18 + r() * 60;
      c.save(); c.translate(x, y); c.rotate(b.ang + (r() - 0.5) * 0.3); c.scale(3.2, 1);
      const q = c.createRadialGradient(0, 0, 0, 0, 0, rad); q.addColorStop(0, `rgba(255,255,255,${0.05 + r() * 0.09})`); q.addColorStop(1, 'rgba(255,255,255,0)');
      c.fillStyle = q; c.fillRect(-rad, -rad, rad * 2, rad * 2); c.restore();
    }
    // a few soft cumulus low in the sky
    for (let k = 0; k < 4; k++) {
      const cx = r() * w, cy = h * (0.55 + r() * 0.2), n = 8 + Math.floor(r() * 8);
      for (let i = 0; i < n; i++) {
        const x = cx + (r() - 0.5) * 160, y = cy + (r() - 0.5) * 30, rad = 26 + r() * 40;
        const q = c.createRadialGradient(x, y, 0, x, y, rad); q.addColorStop(0, 'rgba(255,255,255,.28)'); q.addColorStop(1, 'rgba(255,255,255,0)');
        c.fillStyle = q; c.fillRect(x - rad, y - rad, rad * 2, rad * 2);
      }
    }
  }

  function drawStaticStars() {
    const c = tw.getContext('2d')!;
    twStars.forEach((s) => { c.fillStyle = `rgba(${s.col},.9)`; c.beginPath(); c.arc(s.x, s.y, s.sz, 0, 7); c.fill(); });
  }

  // the visible sky is drawn first; the hidden one follows in a separate task to keep tasks short
  let otherTimer = 0;
  let otherPending: (() => void) | null = null;
  function drawSky() {
    if (innerWidth < 2 || innerHeight < 2) return;
    clearTimeout(otherTimer);
    try {
      const light = isLight();
      (light ? drawDay : drawNight)();
      tw.width = innerWidth; tw.height = innerHeight;
      if (RM && !light) drawStaticStars();
      otherPending = light ? drawNight : drawDay;
      otherTimer = window.setTimeout(flushOther, 120);
    } catch (e) {
      console.error('sky', e);
    }
  }
  function flushOther() {
    const fn = otherPending;
    otherPending = null;
    if (!fn) return;
    try {
      fn();
      if (RM && fn === drawNight) drawStaticStars();
    } catch (e) {
      console.error('sky', e);
    }
  }
  // switching theme before the hidden sky is painted: paint it now
  const themeObserver = new MutationObserver(() => {
    if (otherPending) { clearTimeout(otherTimer); flushOther(); }
  });
  themeObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });

  let raf = 0;
  function twinkleFrame(now: number) {
    raf = requestAnimationFrame(twinkleFrame);
    const c = tw.getContext('2d')!; c.clearRect(0, 0, tw.width, tw.height);
    if (isLight()) return;
    for (const s of twStars) {
      const a = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(now * 0.001 * s.sp + s.ph));
      c.fillStyle = `rgba(${s.col},${a})`; c.beginPath(); c.arc(s.x, s.y, s.sz, 0, Math.PI * 2); c.fill();
    }
    // occasional shooting star
    if (!shooting && Math.random() < 0.003) shooting = { x: Math.random() * tw.width * 0.7, y: Math.random() * tw.height * 0.4, t: 0 };
    if (shooting) {
      shooting.t += 1 / 60; const k = shooting.t / 0.9;
      const x = shooting.x + k * 260, y = shooting.y + k * 120;
      const q = c.createLinearGradient(x - 120, y - 55, x, y); q.addColorStop(0, 'rgba(255,255,255,0)'); q.addColorStop(1, `rgba(255,255,255,${0.9 * (1 - k)})`);
      c.strokeStyle = q; c.lineWidth = 1.4; c.beginPath(); c.moveTo(x - 120, y - 55); c.lineTo(x, y); c.stroke();
      if (k >= 1) shooting = null;
    }
  }

  drawSky();
  // canvases can start at zero size: re-check until the viewport has a real size
  const sizeCheck = window.setInterval(() => {
    const want = Math.round(innerWidth * Math.min(devicePixelRatio, 1.5));
    if (innerWidth > 1 && Math.abs(skyNight.width - want) > 2) drawSky();
  }, 600);
  let resizeTimer = 0;
  const onResize = () => { clearTimeout(resizeTimer); resizeTimer = window.setTimeout(drawSky, 200); };
  addEventListener('resize', onResize);
  if (!RM) raf = requestAnimationFrame(twinkleFrame);

  return () => {
    cancelAnimationFrame(raf);
    clearInterval(sizeCheck);
    clearTimeout(resizeTimer);
    clearTimeout(otherTimer);
    themeObserver.disconnect();
    removeEventListener('resize', onResize);
  };
}
