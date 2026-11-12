/* EXPERIENCE — scroll-driven rocket journey (latest first).
   The experience lives in a framed box: scrolling INSIDE the box flies the rocket,
   scrolling outside it moves the page. At the first/last stop the page takes over. */
import {
  AdditiveBlending, AmbientLight, BoxGeometry, BufferAttribute, BufferGeometry, CanvasTexture, CatmullRomCurve3, Color,
  ConeGeometry, CylinderGeometry, DirectionalLight, DoubleSide, FogExp2, Group, Line, LineDashedMaterial, Material, Mesh,
  MeshBasicMaterial, MeshStandardMaterial, Object3D, PerspectiveCamera, PointLight, Points, PointsMaterial, RingGeometry,
  Scene, SphereGeometry, Sprite, SpriteMaterial, Texture, TorusGeometry, Vector3, WebGLRenderer,
} from 'three';
import { clamp, ease, isLight, mulberry32, pad, prefersReducedMotion } from './util';

export interface ExperienceElements {
  section: HTMLElement;
  stage: HTMLElement;
  canvas: HTMLCanvasElement;
  intro: HTMLElement;
  pill: HTMLElement;
  tStop: HTMLElement;
  tVel: HTMLElement;
  tStatus: HTMLElement;
  labels: HTMLElement[];
  track: HTMLElement;
  stopBtns: HTMLElement[];
  prevBtn: HTMLButtonElement;
  nextBtn: HTMLButtonElement;
}

export interface ExperienceCallbacks {
  /** Stop whose info card should be shown, or null while flying / before launch. */
  onCard: (index: number | null) => void;
  status: (kind: 'pad' | 'transit' | 'docked') => string;
}

export interface ExperienceApi {
  goTo: (i: number) => void;
  prev: () => void;
  next: () => void;
  launch: () => void;
  destroy: () => void;
}

const PLANET_COLORS = [['#f6b07a', '#9c3f2a'], ['#86e0d4', '#1c5866'], ['#c9a6ff', '#47308a'], ['#ffd677', '#a8601d'], ['#ff9db0', '#74264a'], ['#94bcff', '#1f3d7d'], ['#b8e08a', '#3d6b1f'], ['#f2b8e4', '#6b2a5c'], ['#e8d3a6', '#6e5428']];

export function createExperience(els: ExperienceElements, N: number, cb: ExperienceCallbacks): ExperienceApi {
  const { section: sec, stage, intro: expIntro, pill, tStop, tVel, tStatus, track, stopBtns, prevBtn, nextBtn } = els;
  const V = Vector3, UP = new V(0, 1, 0);
  const textures: Texture[] = [];

  const renderer = new WebGLRenderer({ canvas: els.canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new Scene();
  const FOG_DARK = new Color(0x0a0d26), FOG_LIGHT = new Color(0xc4def7);
  const fog = new FogExp2(FOG_DARK.getHex(), 0.0052);
  scene.fog = fog;
  const camera = new PerspectiveCamera(60, 1, 0.1, 3000);
  function sizeStage() {
    const w = stage.clientWidth, h = stage.clientHeight;
    if (w < 1 || h < 1) return false;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
    return true;
  }
  let sized = sizeStage();
  addEventListener('resize', sizeStage);

  const ambient = new AmbientLight(0xffffff, 0.35); scene.add(ambient);
  const sun = new DirectionalLight(0xdfe8ff, 1.15); sun.position.set(-1, 0.7, 0.5); scene.add(sun);

  const SX = [0, -14, 13, -11, 15, -9, 11], SY = [0, 4, -3, 6, -2, 5, 1];
  const ctrl = [new V(0, 0, 30)];
  for (let i = 0; i < N; i++) ctrl.push(new V(SX[(i + 1) % SX.length], SY[(i + 1) % SY.length], -i * 72 - 40));
  const lastP = ctrl[ctrl.length - 1]; ctrl.push(new V(lastP.x * 0.4, lastP.y, lastP.z - 70));
  const curve = new CatmullRomCurve3(ctrl, false, 'centripetal');
  const SEG = ctrl.length - 1, stopT = Array.from({ length: N }, (_, i) => (i + 1) / SEG);

  const pathGeo = new BufferGeometry().setFromPoints(curve.getPoints(900));
  const pathMat = new LineDashedMaterial({ color: 0x8ab4ff, dashSize: 1.1, gapSize: 1.3, transparent: true, opacity: 0.5 });
  const pathLine = new Line(pathGeo, pathMat); pathLine.computeLineDistances(); scene.add(pathLine);

  function glowTexture() {
    const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d')!;
    const g = x.createRadialGradient(64, 64, 0, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.25, 'rgba(255,255,255,.45)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    const t = new CanvasTexture(c); textures.push(t); return t;
  }
  const GLOW = glowTexture();
  function planetTexture(c1: string, c2: string, seed: number) {
    const rnd = mulberry32(seed * 97);
    const c = document.createElement('canvas'); c.width = 512; c.height = 256; const x = c.getContext('2d')!;
    const g = x.createLinearGradient(0, 0, 0, 256); g.addColorStop(0, c1); g.addColorStop(0.55, c2); g.addColorStop(1, c1); x.fillStyle = g; x.fillRect(0, 0, 512, 256);
    for (let i = 0; i < 46; i++) { x.fillStyle = `rgba(255,255,255,${rnd() * 0.13})`; x.fillRect(0, rnd() * 256, 512, 2 + rnd() * 16); }
    for (let i = 0; i < 30; i++) { x.fillStyle = `rgba(0,0,0,${rnd() * 0.16})`; x.fillRect(0, rnd() * 256, 512, 1 + rnd() * 10); }
    for (let i = 0; i < 8; i++) { x.fillStyle = `rgba(255,255,255,${0.05 + rnd() * 0.08})`; x.beginPath(); x.ellipse(rnd() * 512, rnd() * 256, 10 + rnd() * 40, 4 + rnd() * 10, 0, 0, Math.PI * 2); x.fill(); }
    const t = new CanvasTexture(c); textures.push(t); return t;
  }

  const planets: { mesh: Mesh; glow: Sprite; el: HTMLElement; anchor: Vector3 }[] = [];
  const rings: Mesh<TorusGeometry, MeshBasicMaterial>[] = [];
  for (let i = 0; i < N; i++) {
    const t = stopT[i], p = curve.getPoint(t), tan = curve.getTangent(t).normalize();
    const side = new V().crossVectors(tan, UP).normalize(), sgn = i % 2 === 0 ? -1 : 1;
    const r = 5 + (i % 3), [c1, c2] = PLANET_COLORS[i % PLANET_COLORS.length], g = new Group();
    const mesh = new Mesh(new SphereGeometry(r, 48, 32), new MeshStandardMaterial({ map: planetTexture(c1, c2, i + 1), roughness: 0.85, metalness: 0.05, emissive: new Color(c2), emissiveIntensity: 0.12 }));
    mesh.rotation.z = 0.35; g.add(mesh);
    const glow = new Sprite(new SpriteMaterial({ map: GLOW, color: new Color(c1), transparent: true, opacity: 0.42, blending: AdditiveBlending, depthWrite: false }));
    glow.scale.set(r * 3.4, r * 3.4, 1); g.add(glow);
    if (i % 2 === 1) {
      const ring = new Mesh(new RingGeometry(r * 1.35, r * 2.05, 96), new MeshBasicMaterial({ color: new Color(c1), side: DoubleSide, transparent: true, opacity: 0.38 }));
      ring.rotation.x = Math.PI / 2.35; ring.rotation.y = 0.25; g.add(ring);
    }
    g.position.copy(p).addScaledVector(tan, 17).addScaledVector(side, sgn * 10).addScaledVector(UP, 1.5); scene.add(g);
    planets.push({ mesh, glow, el: els.labels[i], anchor: g.position.clone().addScaledVector(UP, r * 1.05 + 1.2) });
    const gate = new Mesh(new TorusGeometry(2.2, 0.05, 8, 64), new MeshBasicMaterial({ color: 0x8ab4ff, transparent: true, opacity: 0.5 }));
    gate.position.copy(p); gate.lookAt(p.clone().add(tan)); scene.add(gate); rings.push(gate);
  }

  // 3D star layer adds parallax in front of the painted sky
  const N_STARS = 1800, sp = new Float32Array(N_STARS * 3);
  for (let i = 0; i < N_STARS; i++) {
    const u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, rr = 500 + Math.random() * 700, q = Math.sqrt(1 - u * u);
    sp[i * 3] = rr * q * Math.cos(th); sp[i * 3 + 1] = rr * u; sp[i * 3 + 2] = rr * q * Math.sin(th);
  }
  const starGeo = new BufferGeometry(); starGeo.setAttribute('position', new BufferAttribute(sp, 3));
  const starMat = new PointsMaterial({ size: 1.4, color: 0xffffff, transparent: true, opacity: 0.6, fog: false, depthWrite: false });
  const stars = new Points(starGeo, starMat); scene.add(stars);
  const N_DUST = 1600, dp = new Float32Array(N_DUST * 3);
  for (let i = 0; i < N_DUST; i++) {
    const p = curve.getPoint(Math.random());
    dp[i * 3] = p.x + (Math.random() - 0.5) * 60; dp[i * 3 + 1] = p.y + (Math.random() - 0.5) * 36; dp[i * 3 + 2] = p.z + (Math.random() - 0.5) * 40;
  }
  const dustGeo = new BufferGeometry(); dustGeo.setAttribute('position', new BufferAttribute(dp, 3));
  const dustMat = new PointsMaterial({ size: 0.18, color: 0xbcc8ff, transparent: true, opacity: 0.7, depthWrite: false });
  scene.add(new Points(dustGeo, dustMat));

  // rocket (nose +Z)
  const rocket = new Group();
  const white = new MeshStandardMaterial({ color: 0xeef0f6, metalness: 0.35, roughness: 0.35 });
  const red = new MeshStandardMaterial({ color: 0xff6a45, metalness: 0.25, roughness: 0.45 });
  const dark = new MeshStandardMaterial({ color: 0x2a2f45, metalness: 0.6, roughness: 0.4 });
  const glass = new MeshStandardMaterial({ color: 0x7fd4ff, emissive: 0x2a7fb0, emissiveIntensity: 0.6, metalness: 0.2, roughness: 0.1 });
  const body = new Mesh(new CylinderGeometry(0.55, 0.62, 3, 28), white); body.rotation.x = Math.PI / 2; rocket.add(body);
  const nose = new Mesh(new ConeGeometry(0.55, 1.5, 28), red); nose.rotation.x = Math.PI / 2; nose.position.z = 2.25; rocket.add(nose);
  const band = new Mesh(new CylinderGeometry(0.6, 0.6, 0.25, 28), red); band.rotation.x = Math.PI / 2; band.position.z = -0.9; rocket.add(band);
  const win = new Mesh(new SphereGeometry(0.22, 20, 14), glass); win.position.set(0, 0.5, 0.6); win.scale.set(1, 0.5, 1); rocket.add(win);
  for (let k = 0; k < 4; k++) {
    const a = (k * Math.PI) / 2 + Math.PI / 4; const fin = new Mesh(new BoxGeometry(0.07, 0.8, 1.1), red);
    fin.position.set(Math.cos(a) * 0.9, Math.sin(a) * 0.9, -1.15); fin.rotation.z = a - Math.PI / 2; rocket.add(fin);
  }
  const nozzle = new Mesh(new CylinderGeometry(0.42, 0.32, 0.45, 24), dark); nozzle.rotation.x = Math.PI / 2; nozzle.position.z = -1.72; rocket.add(nozzle);
  const flameOuter = new Mesh(new ConeGeometry(0.42, 2, 20, 1, true), new MeshBasicMaterial({ color: 0xff7a2e, transparent: true, opacity: 0.75, blending: AdditiveBlending, depthWrite: false }));
  flameOuter.rotation.x = -Math.PI / 2; rocket.add(flameOuter);
  const flameInner = new Mesh(new ConeGeometry(0.22, 1.2, 16, 1, true), new MeshBasicMaterial({ color: 0xfff1b0, transparent: true, opacity: 0.95, blending: AdditiveBlending, depthWrite: false }));
  flameInner.rotation.x = -Math.PI / 2; rocket.add(flameInner);
  const flameGlow = new Sprite(new SpriteMaterial({ map: GLOW, color: 0xff9a4a, transparent: true, opacity: 0.8, blending: AdditiveBlending, depthWrite: false }));
  flameGlow.position.z = -2.4; flameGlow.scale.set(2.6, 2.6, 1); rocket.add(flameGlow);
  const engineLight = new PointLight(0xff8a3d, 1.3, 14); engineLight.position.z = -2.6; rocket.add(engineLight);
  scene.add(rocket);

  /* --- interaction --- */
  let from = 0, target = 0, flyStart = 0, flyDur = 1, flying = false, current = -1, started = false, hovered = false;
  let cardIdx = -1, cardShown = false, navShown = -2;
  let t = 0, speedN = 0, themeK = isLight() ? 1 : 0;

  function goTo(i: number) {
    i = clamp(i, 0, N - 1);
    if (!started) { started = true; expIntro.classList.add('hide'); pill.classList.add('on'); }
    if (i === current && !flying) return;
    from = t; target = stopT[i]; current = i;
    const dist = Math.abs(target - from) * SEG;
    flyDur = prefersReducedMotion() ? 350 : 1400 + Math.min(dist, 4) * 600;
    flyStart = performance.now(); flying = true;
  }
  function launch() {
    scrollTo({ top: sec.offsetTop + sec.offsetHeight / 2 - innerHeight / 2, behavior: 'smooth' });
    goTo(0);
  }

  const onEnter = () => { hovered = true; };
  const onLeave = () => { hovered = false; };
  let wAcc = 0, wLock = 0;
  const onWheel = (e: WheelEvent) => {
    const dir = Math.sign(e.deltaY); if (!dir) return;
    if (!flying && ((dir > 0 && current >= N - 1) || (dir < 0 && current <= 0))) return; // ends: let the page scroll on
    e.preventDefault();
    const now = performance.now(); if (now < wLock) return;
    wAcc += e.deltaY; if (Math.abs(wAcc) > 40) { wAcc = 0; wLock = now + 900; goTo(current + dir); }
  };
  // touch: swipe sideways inside the box to fly (vertical swipes still scroll the page)
  let tX: number | null = null, tY: number | null = null;
  const onTouchStart = (e: TouchEvent) => { tX = e.touches[0].clientX; tY = e.touches[0].clientY; };
  const onTouchEnd = (e: TouchEvent) => {
    if (tX === null || tY === null) return;
    const dx = tX - e.changedTouches[0].clientX, dy = tY - e.changedTouches[0].clientY; tX = null;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) goTo(current + (dx > 0 ? 1 : -1));
  };
  const onKey = (e: KeyboardEvent) => {
    if (!hovered) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
  };
  stage.addEventListener('pointerenter', onEnter);
  stage.addEventListener('pointerleave', onLeave);
  stage.addEventListener('wheel', onWheel, { passive: false });
  stage.addEventListener('touchstart', onTouchStart, { passive: true });
  stage.addEventListener('touchend', onTouchEnd, { passive: true });
  addEventListener('keydown', onKey);

  function expVisible() { const r = sec.getBoundingClientRect(); return r.bottom > -100 && r.top < innerHeight + 100; }

  const camPos = new V(), lookCur = new V(), tmp = new V();
  const PATH_DARK = new Color(0x8ab4ff), PATH_LIGHT = new Color(0x2f6fe0), DUST_DARK = new Color(0xbcc8ff), DUST_LIGHT = new Color(0xffffff);
  {
    const p = curve.getPoint(0), tan = curve.getTangent(0);
    camPos.copy(p).addScaledVector(tan, -11).addScaledVector(UP, 3.4); camera.position.copy(camPos);
    lookCur.copy(p).addScaledVector(tan, 10).addScaledVector(UP, -1.2);
  }

  let last = performance.now(), raf = 0;
  function frame(now: number) {
    const dt = clamp((now - last) / 1000, 0, 0.05); last = now;
    raf = requestAnimationFrame(frame);
    if (!expVisible()) return;
    if (!sized) { sized = sizeStage(); if (!sized) return; }

    const prevT = t;
    if (flying) { const kk = Math.min(1, (now - flyStart) / flyDur); t = from + (target - from) * ease(kk); if (kk >= 1) { t = target; flying = false; } }
    const v = (Math.abs(t - prevT) / Math.max(dt, 1e-4)) * SEG; speedN += (Math.min(1, v / 1.2) - speedN) * 0.15;
    if (!Number.isFinite(speedN)) speedN = 0;
    const arrived = started && !flying;
    const k = Math.max(current, 0);

    // card + nav state
    if (arrived && (!cardShown || cardIdx !== k)) { cb.onCard(k); cardIdx = k; cardShown = true; }
    if (!arrived && cardShown) { cb.onCard(null); cardShown = false; }
    stopBtns.forEach((b, i) => { b.classList.toggle('active', started && i === current); b.classList.toggle('visited', started && i < current); });
    if (current !== navShown) {
      navShown = current; const ab = stopBtns[Math.max(current, 0)];
      if (ab) { const left = ab.offsetLeft - track.offsetLeft - (track.clientWidth - ab.offsetWidth) / 2; track.scrollTo({ left: Math.max(0, left), behavior: 'smooth' }); }
    }
    prevBtn.disabled = current <= 0; nextBtn.disabled = current >= N - 1;
    tStop.textContent = started ? `${pad(k + 1)}/${pad(N)}` : '—';
    tStatus.textContent = cb.status(!started ? 'pad' : flying ? 'transit' : 'docked');
    tVel.textContent = (speedN * 11.2).toFixed(1);

    // rocket — path progress is always clamped to 0..1
    if (!Number.isFinite(t)) t = 0; t = Math.min(1, Math.max(0, t));
    const p = curve.getPoint(t), tan = curve.getTangent(t).normalize();
    rocket.position.copy(p); if (speedN < 0.05) rocket.position.y += Math.sin(now * 0.0018) * 0.12;
    rocket.lookAt(tmp.copy(rocket.position).add(tan));
    rocket.rotateZ(Math.sin(now * 0.0011) * 0.06 + speedN * Math.sin(now * 0.004) * 0.08);
    const fl = 0.55 + speedN * 1.3 + Math.sin(now * 0.05) * 0.06;
    flameOuter.scale.set(1, fl, 1); flameOuter.position.z = -1.9 - fl;
    flameInner.scale.set(1, fl * 0.9, 1); flameInner.position.z = -1.95 - fl * 0.55;
    flameGlow.material.opacity = 0.45 + speedN * 0.5; engineLight.intensity = 0.8 + speedN * 1.6;

    // chase camera
    const a = 1 - Math.exp(-dt * 4);
    tmp.copy(p).addScaledVector(tan, -11 - speedN * 2.5).addScaledVector(UP, 3.4); camPos.lerp(tmp, a); camera.position.copy(camPos);
    tmp.copy(p).addScaledVector(tan, 10).addScaledVector(UP, -1.2); lookCur.lerp(tmp, a); camera.lookAt(lookCur);
    const fov = 60 + speedN * 14; if (Math.abs(camera.fov - fov) > 0.01) { camera.fov = fov; camera.updateProjectionMatrix(); }
    stars.position.copy(camera.position);

    // theme blend
    const themeTarget = isLight() ? 1 : 0;
    themeK += (themeTarget - themeK) * Math.min(1, dt * 3);
    starMat.opacity = 0.6 * (1 - themeK);
    fog.color.copy(FOG_DARK).lerp(FOG_LIGHT, themeK); fog.density = 0.0052 - themeK * 0.0016;
    ambient.intensity = 0.35 + themeK * 0.55; sun.intensity = 1.15 + themeK * 0.35;
    pathMat.color.copy(PATH_DARK).lerp(PATH_LIGHT, themeK); pathMat.opacity = 0.5 + themeK * 0.15;
    dustMat.color.copy(DUST_DARK).lerp(DUST_LIGHT, themeK); dustMat.opacity = 0.7 - themeK * 0.25;

    // planets, labels, gates
    const W = stage.clientWidth, H = stage.clientHeight;
    planets.forEach((pl, i) => {
      pl.mesh.rotation.y += dt * 0.12;
      pl.glow.material.opacity = (0.42 + (i === k && arrived ? 0.18 : 0)) * (1 - themeK * 0.55);
      tmp.copy(pl.anchor).project(camera);
      let op = clamp((175 - camera.position.distanceTo(pl.anchor)) / 60, 0, 1);
      if (!started) op = 0;
      if (tmp.z > 1 || tmp.z < -1 || !Number.isFinite(tmp.x) || !Number.isFinite(tmp.y)) op = 0;
      pl.el.style.opacity = String(op);
      if (op > 0) {
        const lx = clamp(((tmp.x + 1) / 2) * W, 90, W - 90), ly = Math.max(((1 - tmp.y) / 2) * H, 70);
        pl.el.style.transform = `translate(${lx}px,${ly}px) translate(-50%,-100%)`;
      }
      pl.el.classList.toggle('active', i === k && arrived);
    });
    rings.forEach((r, i) => {
      const on = i === k && started;
      r.material.color.set(on ? 0xffb36b : themeK > 0.5 ? 0x2f6fe0 : 0x8ab4ff); r.material.opacity = on ? 0.85 : 0.35;
      const s = on ? 1 + Math.sin(now * 0.004) * 0.06 : 1; r.scale.set(s, s, s);
    });

    renderer.render(scene, camera);
  }
  raf = requestAnimationFrame(frame);

  function destroy() {
    cancelAnimationFrame(raf);
    removeEventListener('resize', sizeStage);
    removeEventListener('keydown', onKey);
    stage.removeEventListener('pointerenter', onEnter);
    stage.removeEventListener('pointerleave', onLeave);
    stage.removeEventListener('wheel', onWheel);
    stage.removeEventListener('touchstart', onTouchStart);
    stage.removeEventListener('touchend', onTouchEnd);
    scene.traverse((o: Object3D) => {
      const m = o as Mesh;
      if (m.geometry) m.geometry.dispose();
      const mat = m.material as Material | Material[] | undefined;
      if (mat) (Array.isArray(mat) ? mat : [mat]).forEach((x) => x.dispose());
    });
    textures.forEach((tx) => tx.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
  }

  return { goTo, prev: () => goTo(current - 1), next: () => goTo(current + 1), launch, destroy };
}
