/* Project reels: animated covers drawn on a 480x270 logical stage, ported unchanged from the design reference.
   draw(g, p, t): p = loop progress 0..1, t = ms into the loop. */
const scope = {
  ReelsTheme: undefined,
  get devicePixelRatio() { return typeof window !== 'undefined' ? window.devicePixelRatio : 1; },
};
(function (root) {
const W = 480, H = 270;
const THEMES = {
  dark:  { bg:'#0A0C10', panel:'#10141B', panel2:'#161B24', line:'#232B37', fg:'#ECE7DF', muted:'#8C95A2', dim:'#5B6472', acc:'#F4A640', cool:'#6FC3C9', hot:'#E86A5B', ok:'#8BCF8E', onAcc:'#14110B', sheen:'#FFFFFF' },
  light: { bg:'#F4F1EB', panel:'#FFFFFF', panel2:'#ECE7DF', line:'#DCD5CA', fg:'#1A1D23', muted:'#5C636D', dim:'#8E949C', acc:'#C9741A', cool:'#1D8791', hot:'#C8473A', ok:'#2E8B4A', onAcc:'#FFFFFF', sheen:'#1A1D23' }
};
const P = Object.assign({}, THEMES.dark);
const F = { mono:'"JetBrains Mono", ui-monospace, Menlo, monospace', body:'"IBM Plex Sans", system-ui, -apple-system, sans-serif', disp:'"Bricolage Grotesque", system-ui, sans-serif' };

/* ---------- helpers ---------- */
const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const seg = (p, a, b) => cl((p - a) / (b - a));
const eo = x => 1 - Math.pow(1 - cl(x), 3);
const eio = x => (x = cl(x), x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);
const lerp = (a, b, k) => a + (b - a) * k;
const A = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16 & 255},${n >> 8 & 255},${n & 255},${a})`; };
const typ = (s, k) => s.slice(0, Math.round(s.length * cl(k)));
function rng(seed) { return () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function font(g, o) { g.font = `${o.w || 400} ${o.s || 11}px ${o.f || F.body}`; }
function T(g, s, x, y, o = {}) {
  font(g, o); g.fillStyle = o.c || P.fg; g.textAlign = o.a || 'left'; g.textBaseline = 'alphabetic';
  const pa = g.globalAlpha; g.globalAlpha = pa * (o.al == null ? 1 : o.al); g.fillText(s, x, y); g.globalAlpha = pa;
}
function TW(g, s, o = {}) { font(g, o); return g.measureText(s).width; }
function R(g, x, y, w, h, r, fill, stroke, lw = 1) {
  g.beginPath(); if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h);
  if (fill) { g.fillStyle = fill; g.fill(); }
  if (stroke) { g.strokeStyle = stroke; g.lineWidth = lw; g.stroke(); }
}
function line(g, x1, y1, x2, y2, c, lw = 1, dash) { g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.strokeStyle = c; g.lineWidth = lw; if (dash) g.setLineDash(dash); g.stroke(); g.setLineDash([]); }
function dot(g, x, y, r, c) { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fillStyle = c; g.fill(); }
function ring(g, x, y, r, c, lw = 1) { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.strokeStyle = c; g.lineWidth = lw; g.stroke(); }
function check(g, x, y, s, c) { g.beginPath(); g.moveTo(x - s * .5, y); g.lineTo(x - s * .1, y + s * .4); g.lineTo(x + s * .55, y - s * .4); g.strokeStyle = c; g.lineWidth = 1.6; g.lineCap = 'round'; g.stroke(); g.lineCap = 'butt'; }
function cross(g, x, y, s, c) { line(g, x - s, y - s, x + s, y + s, c, 1.6); line(g, x - s, y + s, x + s, y - s, c, 1.6); }
function spinner(g, x, y, r, t, c) { g.beginPath(); g.arc(x, y, r, t * .008, t * .008 + 4.2); g.strokeStyle = c; g.lineWidth = 1.6; g.stroke(); }
/* scene alpha: fades in at a, out at b */
function sa(p, a, b, f = .025) { return (a <= 0 ? 1 : eo(seg(p, a, a + f))) * (b >= 1 ? 1 : 1 - seg(p, b - f, b)); }
function scene(g, al, fn) { if (al <= .001) return; g.save(); g.globalAlpha *= al; fn(); g.restore(); }
function card(g, x, y, w, h) { R(g, x, y, w, h, 10, P.panel, P.line); }
function label(g, s, x, y, c = P.acc) { T(g, s, x, y, { f: F.mono, s: 8, c }); }
function chip(g, s, x, y, o = {}) {
  const s9 = o.s || 8.5, w = o.w || TW(g, s, { f: F.mono, s: s9 }) + 14;
  R(g, x, y, w, 16, 8, o.bg || A(P.muted, .12), o.stroke);
  T(g, s, x + w / 2, y + 11.5, { f: F.mono, s: s9, c: o.c || P.fg, a: 'center' });
  return w;
}
function stage(g) {
  g.fillStyle = P.bg; g.fillRect(0, 0, W, H);
  g.fillStyle = A(P.dim, .22);
  for (let x = 12; x < W; x += 20) for (let y = 12; y < H; y += 20) g.fillRect(x, y, 1, 1);
}
function caption(g, c, p) {
  let i = 0; c.chapters.forEach((ch, k) => { if (p >= ch[1]) i = k; });
  dot(g, 19, 15.5, 2.6, P.acc);
  T(g, c.chapters[i][0].toUpperCase(), 27, 19, { f: F.mono, s: 8.5, c: P.acc, w: 500 });
  T(g, `${i + 1} / ${c.chapters.length}`, 464, 19, { f: F.mono, s: 8.5, c: P.dim, a: 'right' });
}

/* ===================================================================== */
const COVERS = {};

/* 1 ─ Meeting-to-Action: n8n + Claude tool use → Slack recap + Sheets */
COVERS.meeting = {
  dur: 5200,
  chapters: [['Transcript', 0], ['n8n workflow', .25], ['Slack recap', .52], ['Sheets + run log', .79]],
  draw(g, p, t) {
    /* left: transcript */
    card(g, 16, 30, 176, 230);
    T(g, 'transcript.txt', 27, 48, { f: F.mono, s: 8.5, c: P.dim });
    const wc = Math.round(412 * eo(seg(p, .02, .24)));
    T(g, wc + ' words', 181, 48, { f: F.mono, s: 8.5, c: wc >= 50 ? P.cool : P.dim, a: 'right' });
    line(g, 16, 56, 192, 56, P.line);
    const L = [['TOM', 'cut the Pro plan to $39?'], ['ANA', 'no, keep $49 for now'], ['DEV', "I'll fix the login bug"], ['LENA', 'survey results by Thursday'], ['TOM', 'roadmap to the board, 10th'], ['LENA', 'beta email… sometime next week'], ['???', 'someone book the venue?']];
    L.forEach(([sp, tx], i) => {
      const k = seg(p, .03 + i * .027, .065 + i * .027); if (k <= 0) return;
      const y = 72 + i * 27;
      let c = P.fg;
      if (i === 1 && p > .56) c = P.acc;
      if (i === 5 && p > .66) c = P.acc;
      if (i === 6 && p > .69) c = P.hot;
      T(g, sp, 27, y, { f: F.mono, s: 7.5, c: sp === '???' ? P.hot : P.cool, al: k });
      const s = tx.length > 27 ? 'beta email… next week' : tx;
      T(g, typ(s, k * 1.2), 27, y + 13, { s: 10.5, c });
      if (i === 0) { const ks = eo(seg(p, .55, .58)); if (ks > 0) line(g, 26, y + 9, 26 + TW(g, s, { s: 10.5 }) * ks, y + 9, P.hot, 1.4); }
      if (i === 1 && p > .56) R(g, 20, y - 8, 2, 24, 1, P.acc);
    });

    /* right scene 1: n8n form trigger */
    scene(g, sa(p, 0, .26), () => {
      card(g, 204, 30, 260, 230);
      T(g, 'n8n · Form trigger', 216, 48, { f: F.mono, s: 8.5, c: P.dim });
      [['Title', 'Weekly product sync'], ['Date', '2026-11-02'], ['Participants', 'Tom, Ana, Dev, Lena']].forEach(([l, v], i) => {
        const y = 68 + i * 40, k = seg(p, .02 + i * .035, .06 + i * .035);
        label(g, l.toUpperCase(), 216, y, P.dim);
        R(g, 216, y + 5, 236, 22, 6, P.bg, k > 0 && k < 1 ? P.acc : P.line);
        T(g, typ(v, k), 224, y + 20, { s: 10.5 });
      });
      label(g, 'TRANSCRIPT', 216, 188, P.dim);
      R(g, 216, 193, 236, 22, 6, P.bg, P.line);
      const tk = seg(p, .12, .22);
      R(g, 216, 193, 236 * tk, 22, 6, A(P.cool, .12));
      T(g, tk >= 1 ? '412 words ✓' : tk > 0 ? 'pasting…' : '', 224, 208, { f: F.mono, s: 9, c: P.cool });
      const press = seg(p, .225, .245);
      R(g, 372, 226, 80, 24, 7, press > 0 ? P.acc : P.panel2, P.line);
      T(g, 'Submit', 412, 242, { s: 10.5, w: 600, c: press > 0 ? P.onAcc : P.fg, a: 'center' });
    });

    /* right scene 2: workflow graph */
    scene(g, sa(p, .25, .53), () => {
      card(g, 204, 30, 260, 230);
      const N = [['Form', 216, 46], ['Clean', 302, 46], ['Guard', 388, 46], ['Claude', 388, 102], ['Validate', 302, 102], ['Slack', 216, 158], ['Sheets', 302, 158], ['Run log', 388, 158]];
      const lit = i => p >= .27 + Math.min(i, 5) * .034;
      const E = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [4, 6], [4, 7]];
      const cx = i => N[i][1] + 32, cy = i => N[i][2] + 12;
      E.forEach(([a, b]) => line(g, cx(a), cy(a), cx(b), cy(b), lit(b) ? A(P.cool, .7) : P.line, 1.2));
      N.forEach(([n, x, y], i) => {
        const on = lit(i), isC = i === 3;
        R(g, x, y, 64, 24, 7, P.panel); R(g, x, y, 64, 24, 7, on ? (isC ? A(P.acc, .18) : A(P.cool, .12)) : P.bg, on ? (isC ? P.acc : P.cool) : P.line);
        T(g, n, x + 32, y + 16, { f: F.mono, s: 9, a: 'center', c: on ? P.fg : P.dim });
      });
      if (lit(2)) T(g, '≥ 50 words ✓', 420, 84, { f: F.mono, s: 8, c: P.cool, a: 'center' });
      if (lit(3)) T(g, 'tool_use', 420, 140, { f: F.mono, s: 8, c: P.acc, a: 'center' });
      /* packet */
      const q = (p - .27) / .034;
      if (q >= 0 && q < 4) { const i = Math.floor(q), f = eio(q - i); dot(g, lerp(cx(i), cx(i + 1), f), lerp(cy(i), cy(i + 1), f), 3.2, P.acc); }
      if (q >= 4 && q < 5) { const f = eio(q - 4); [5, 6, 7].forEach(j => dot(g, lerp(cx(4), cx(j), f), lerp(cy(4), cy(j), f), 3.2, P.cool)); }
      /* JSON preview */
      R(g, 216, 196, 236, 54, 7, P.bg, P.line);
      const jk = seg(p, .38, .47);
      ['save_meeting_summary → {', '  summary, decisions[2],', '  actions[5], open_questions[1] }'].forEach((s, i) =>
        T(g, typ(s, jk * 3 - i), 224, 212 + i * 14, { f: F.mono, s: 8.5, c: i ? P.fg : P.acc }));
    });

    /* right scene 3: Slack recap */
    scene(g, sa(p, .52, .8), () => {
      card(g, 204, 30, 260, 230);
      T(g, '#product-sync', 216, 50, { f: F.mono, s: 10, w: 500 });
      T(g, 'Weekly product sync · 2026-11-02', 216, 65, { s: 9.5, c: P.muted });
      label(g, 'DECISIONS', 216, 86);
      ['Pro plan stays at $49', 'Launch webinar dropped'].forEach((s, i) => { const k = seg(p, .55 + i * .02, .57 + i * .02); T(g, '• ' + s, 216, 101 + i * 14, { s: 10, al: k }); });
      label(g, 'ACTIONS', 216, 138);
      const rows = [['Fix mobile login bug', 'Dev', '11-03'], ['Share survey results', 'Lena', '11-06'], ['Roadmap to the board', 'Tom', '11-10'], ['Beta users email', 'Lena', 'no due date'], ['Book December venue', 'no owner', 'no due date']];
      rows.forEach(([task, own, due], i) => {
        const k = eo(seg(p, .6 + i * .025, .63 + i * .025)); if (k <= 0) return;
        const y = 154 + i * 21, dx = (1 - k) * 10;
        g.save(); g.globalAlpha *= k;
        T(g, task, 216 + dx, y, { s: 10 });
        const bad = own === 'no owner';
        R(g, 342 + dx, y - 11, 50, 15, 7, bad ? A(P.hot, .18) : A(P.cool, .13));
        T(g, own, 367 + dx, y, { f: F.mono, s: 8.5, c: bad ? P.hot : P.cool, a: 'center' });
        T(g, due, 456 + dx, y, { f: F.mono, s: 8, c: due === 'no due date' ? P.acc : P.muted, a: 'right' });
        g.restore();
      });
    });

    /* right scene 4: Google Sheet + run log */
    scene(g, sa(p, .79, 1), () => {
      card(g, 204, 30, 260, 142);
      T(g, 'Sheet1', 216, 48, { f: F.mono, s: 8.5, c: P.dim });
      [['task', 216], ['owner', 330], ['due', 376], ['status', 420]].forEach(([h, x]) => T(g, h, x, 64, { f: F.mono, s: 8, c: P.dim }));
      line(g, 204, 70, 464, 70, P.line);
      const rows = [['Fix mobile login bug', 'Dev', '11-03'], ['Share survey results', 'Lena', '11-06'], ['Roadmap to board', 'Tom', '11-10'], ['Beta users email', 'Lena', '—'], ['Book Dec. venue', '—', '—']];
      rows.forEach(([a, b, c], i) => {
        const k = eo(seg(p, .81 + i * .018, .835 + i * .018)); if (k <= 0) return;
        const y = 85 + i * 18;
        g.save(); g.globalAlpha *= k; g.translate(0, (1 - k) * -6);
        T(g, a, 216, y, { s: 9.5 }); T(g, b, 330, y, { f: F.mono, s: 8.5, c: b === '—' ? P.hot : P.muted }); T(g, c, 376, y, { f: F.mono, s: 8.5, c: P.muted });
        chip(g, 'open', 418, y - 11, { w: 36, c: P.ok, bg: A(P.ok, .14), s: 8 });
        g.restore();
      });
      const k = eo(seg(p, .88, .95));
      [['18/18', 'actions found'], ['0', 'invented'], ['$0.02', 'per meeting']].forEach(([v, l], i) => {
        const x = 204 + i * 89;
        card(g, x, 180, 82, 80);
        T(g, i === 0 ? `${Math.round(18 * k)}/18` : i === 2 ? `$${(0.02 * k).toFixed(2)}` : v, x + 10, 214, { f: F.disp, s: 22, w: 600, c: i === 1 ? P.ok : P.fg });
        T(g, l, x + 10, 232, { s: 9, c: P.muted });
        T(g, i === 0 ? 'eval run, v3' : i === 1 ? 'owners or dates' : 'measured run', x + 10, 246, { f: F.mono, s: 7.5, c: P.dim });
      });
    });
  }
};

/* 2 ─ AlternaGenie: job + CV → Gemini → 4 drafts + match score */
COVERS.genie = {
  dur: 4600,
  chapters: [['Job + profile', 0], ['Gemini pipeline', .24], ['Four drafts', .46], ['Match score', .78]],
  draw(g, p, t) {
    const match = p > .78;
    /* job card */
    card(g, 16, 30, 152, 120);
    label(g, 'JOB POSTING', 27, 48);
    T(g, typ('AI Engineer', seg(p, .02, .06)), 27, 68, { f: F.disp, s: 15, w: 600 });
    T(g, typ('Alternance · Paris · 3 / 1', seg(p, .05, .09)), 27, 83, { s: 9.5, c: P.muted });
    const J = [['Python', 27, 96], ['RAG', 76, 96], ['FastAPI', 109, 96], ['LLM eval', 27, 118], ['Docker', 89, 118]];
    J.forEach(([s, x, y], i) => { const k = seg(p, .07 + i * .02, .09 + i * .02); if (k <= 0) return; g.save(); g.globalAlpha *= k;
      const hit = match && i < 3; chip(g, s, x, y, { bg: hit ? A(P.cool, .2) : undefined, c: hit ? P.cool : P.fg, stroke: hit ? A(P.cool, .6) : undefined }); g.restore(); });
    /* profile card */
    card(g, 16, 158, 152, 102);
    label(g, 'PROFILE', 27, 176);
    R(g, 27, 184, 20, 26, 3, P.bg, P.line); line(g, 41, 184, 47, 190, P.line);
    T(g, 'CV.pdf', 55, 196, { s: 10.5 });
    if (p > .13) T(g, 'parsed ✓', 55, 208, { f: F.mono, s: 8, c: P.cool });
    const Pc = [['Python', 27, 220], ['RAG', 76, 220], ['FastAPI', 109, 220], ['React', 27, 240], ['n8n', 76, 240]];
    Pc.forEach(([s, x, y], i) => { const k = seg(p, .14 + i * .02, .16 + i * .02); if (k <= 0) return; g.save(); g.globalAlpha *= k;
      const hit = match && i < 3; chip(g, s, x, y, { bg: hit ? A(P.cool, .2) : undefined, c: hit ? P.cool : P.fg, stroke: hit ? A(P.cool, .6) : undefined }); g.restore(); });

    /* pipeline column */
    const S = [['inputs', 'merged'], ['prompt_engine', '.py'], ['Gemini', '2.0 Flash'], ['JSON', 'validated']];
    S.forEach(([a, b], i) => {
      const y = 36 + i * 46, on = p >= .25 + i * .05, gem = i === 2;
      if (i) { line(g, 213, y - 16, 213, y, on ? P.cool : P.line, 1.2); }
      const pulse = gem && p > .35 && p < .46 ? .15 + .1 * Math.sin(t * .02) : 0;
      R(g, 178, y, 70, 30, 7, on ? A(gem ? P.acc : P.cool, (gem ? .16 : .1) + pulse) : P.bg, on ? (gem ? P.acc : P.cool) : P.line);
      T(g, a, 213, y + 13, { f: F.mono, s: 8.5, a: 'center', c: on ? P.fg : P.dim });
      T(g, b, 213, y + 24, { f: F.mono, s: 7.5, a: 'center', c: on ? (gem ? P.acc : P.cool) : P.dim });
    });
    label(g, 'ELAPSED', 178, 232, P.dim);
    T(g, (14.2 * eo(seg(p, .24, .52))).toFixed(1) + ' s', 178, 254, { f: F.disp, s: 18, w: 600 });

    /* outputs */
    card(g, 258, 30, 206, 180);
    const tabs = ['CV', 'Letter', 'Email', 'LinkedIn'];
    let ai = p < .46 ? 0 : Math.min(3, Math.floor(seg(p, .46, .78) * 4));
    tabs.forEach((s, i) => { const x = 258 + i * 51.5; T(g, s, x + 25.75, 49, { f: F.mono, s: 8.5, a: 'center', c: i === ai && p >= .46 ? P.fg : P.dim }); if (i === ai && p >= .46) R(g, x + 8, 55, 35.5, 2, 1, P.acc); });
    line(g, 258, 57, 464, 57, P.line);
    const C = [
      ['• Delivered a compliance RAG', '  assistant to a client', '• FastAPI backend + React UI', '• Evaluation, guardrails, logs'],
      ['Madame, Monsieur,', "Votre offre d'alternance en IA", 'correspond à ce que je construis', 'depuis 2025 : des assistants RAG…'],
      ['Subject: AI Engineer alternance', 'Bonjour Mme Martin,', 'I build RAG systems that cite', 'their sources. Available now.'],
      ['Hi Claire, I saw your AI', 'Engineer alternance post and', 'would love to connect.', '— Siddharth   (182 / 300)']
    ];
    if (p < .46) {
      for (let i = 0; i < 5; i++) { const w = [150, 170, 120, 160, 90][i]; const sh = (t * .25 + i * 40) % 260 - 60;
        R(g, 270, 72 + i * 22, w, 9, 4, A(P.muted, .1));
        g.save(); g.beginPath(); g.rect(270, 72 + i * 22, w, 9); g.clip(); const gr = g.createLinearGradient(270 + sh, 0, 330 + sh, 0); gr.addColorStop(0, A(P.sheen, 0)); gr.addColorStop(.5, A(P.sheen, .08)); gr.addColorStop(1, A(P.sheen, 0)); g.fillStyle = gr; g.fillRect(270, 72 + i * 22, w, 9); g.restore(); }
    } else {
      const k = p >= .78 ? 1 : seg(p, .46 + ai * .08, .52 + ai * .08);
      C[ai].forEach((s, i) => T(g, typ(s, k * 4 - i), 270, 80 + i * 18, { s: 10, c: i === 0 && ai === 2 ? P.acc : P.fg }));
      if (k < 1) { const li = Math.min(3, Math.floor(k * 4)); const s = typ(C[ai][li], k * 4 - li); R(g, 271 + TW(g, s, { s: 10 }), 70 + li * 18, 1.5, 12, 0, P.acc); }
    }
    T(g, 'structured output · retry on quota', 270, 196, { f: F.mono, s: 7.5, c: P.dim });

    /* match + tone */
    card(g, 258, 216, 206, 44);
    const sc = Math.round(87 * eo(seg(p, .8, .92)));
    g.beginPath(); g.arc(281, 238, 13, 0, Math.PI * 2); g.strokeStyle = P.line; g.lineWidth = 3; g.stroke();
    g.beginPath(); g.arc(281, 238, 13, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * sc / 100); g.strokeStyle = P.cool; g.stroke(); g.lineWidth = 1;
    T(g, String(sc), 281, 241.5, { f: F.mono, s: 9, w: 500, a: 'center' });
    T(g, 'match score', 302, 233, { s: 9.5, c: P.muted });
    label(g, 'TONE', 302, 250, P.dim);
    line(g, 330, 247, 452, 247, P.line, 2);
    const kx = lerp(340, 440, .5 + .45 * Math.sin(seg(p, .46, .78) * Math.PI * 2));
    dot(g, kx, 247, 4.5, P.acc);
    /* match beams */
    if (match) T(g, '3 skills matched', 452, 233, { f: F.mono, s: 7.5, c: P.cool, a: 'right', al: eo(seg(p, .8, .84)) });
  }
};

/* 3 ─ MCP Debugging Agent: ingest → detect → correlate → summarize */
const LANES = [
  { n: 'app.log', f: 'plaintext', ev: [[1,'I'],[5,'I'],[9,'I'],[14,'I'],[20,'I'],[27,'I'],[33,'I'],[41,'I'],[50,'I'],[58,'I'],[66,'I'],[72,'I'],[74.97,'W'],[75.0,'E'],[75.017,'E'],[75.33,'E'],[76.5,'E'],[80,'W']] },
  { n: 'api.jsonl', f: 'jsonl', ev: [[3,'I'],[12,'I'],[25,'I'],[38,'I'],[52,'I'],[63,'I'],[84,'I'],[74.967,'E'],[75.05,'W'],[75.7,'E'],[76.2,'E'],[77,'I']] },
  { n: 'errors.log', f: 'plaintext', ev: [[2,'I'],[10,'E'],[18,'W'],[22,'E'],[30,'I'],[40.5,'E'],[41.2,'E'],[42.8,'E'],[44.1,'E'],[48,'W'],[55,'E'],[61,'E'],[68,'I'],[86,'I']] }
];
COVERS.mcp = {
  dur: 5200,
  chapters: [['ingest_log', 0], ['detect_anomalies', .27], ['correlate_events', .51], ['get_error_summary', .77]],
  draw(g, p, t) {
    const cmds = [[0, 'ingest_log("samples/*", format="auto")'], [.27, 'detect_anomalies(window_minutes=5)'], [.51, 'correlate_events("14:15:01", window_seconds=30)'], [.77, 'get_error_summary()']];
    let ci = 0; cmds.forEach((c, i) => { if (p >= c[0]) ci = i; });
    R(g, 16, 28, 448, 24, 6, P.bg, P.line);
    T(g, '›', 25, 44, { f: F.mono, s: 10, c: P.acc });
    T(g, typ(cmds[ci][1], seg(p, cmds[ci][0] + .005, cmds[ci][0] + .05)), 37, 44, { f: F.mono, s: 9 });
    T(g, 'MCP · stdio', 456, 44, { f: F.mono, s: 7.5, c: P.dim, a: 'right' });

    /* domain zoom (minutes after 13:00) */
    const z = eio(seg(p, .53, .61)) - eio(seg(p, .77, .83));
    const c0 = lerp(45, 75.3, z), wd = 90 * Math.pow(3.6 / 90, z), d0 = c0 - wd / 2;
    const X0 = 104, XW = 360, xOf = m => X0 + (m - d0) / wd * XW;
    const ys = [86, 114, 142];
    /* lane labels */
    LANES.forEach((L, i) => {
      const done = p > .04 + i * .07 + .06;
      T(g, L.n, 16, ys[i] - 1, { f: F.mono, s: 9 });
      T(g, done ? `${L.f} · ${L.ev.length}` : 'reading…', 16, ys[i] + 11, { f: F.mono, s: 7.5, c: done ? P.cool : P.dim, al: p > .03 + i * .07 ? 1 : 0 });
    });
    g.save(); g.beginPath(); g.rect(X0, 60, XW, 104); g.clip();
    R(g, X0, 64, XW, 96, 6, A(P.panel, .9));
    /* axis ticks */
    const step = wd > 30 ? 15 : wd > 8 ? 5 : 1;
    for (let m = Math.ceil(d0 / step) * step; m <= d0 + wd; m += step) {
      const x = xOf(m); line(g, x, 64, x, 160, A(P.line, .8));
    }
    /* detect windows */
    scene(g, sa(p, .27, .53), () => {
      const sw = seg(p, .29, .45) * 18;
      for (let w = 0; w < 18; w++) {
        if (w > sw) break;
        let n = 0; LANES.forEach(L => L.ev.forEach(([m, l]) => { if (l === 'E' && m >= w * 5 && m < w * 5 + 5) n++; }));
        const x = xOf(w * 5), x2 = xOf(w * 5 + 5);
        if (n >= 3) R(g, x, 64, x2 - x, 96, 0, A(P.hot, .16));
        if (Math.floor(sw) === w && sw < 18) R(g, x, 64, x2 - x, 96, 0, null, P.cool);
      }
    });
    /* correlate bracket */
    const bk = sa(p, .6, .78) * eo(seg(p, .6, .66));
    if (bk > 0) {
      const xc = xOf(75.0167), xa = xOf(75.0167 - .5), xb = xOf(75.0167 + .5);
      g.save(); g.globalAlpha *= bk;
      R(g, xa, 64, xb - xa, 96, 0, A(P.acc, .1)); line(g, xa, 64, xa, 160, A(P.acc, .6), 1, [3, 3]); line(g, xb, 64, xb, 160, A(P.acc, .6), 1, [3, 3]); line(g, xc, 64, xc, 160, P.acc, 1.2);
      g.restore();
    }
    /* events */
    LANES.forEach((L, i) => {
      const scan = X0 + XW * eo(seg(p, .03 + i * .07, .1 + i * .07));
      L.ev.forEach(([m, l]) => {
        const x = xOf(m); if (x > scan && p < .27) return;
        const y = ys[i], hgt = l === 'E' ? 16 : l === 'W' ? 11 : 7, c = l === 'E' ? P.hot : l === 'W' ? P.acc : A(P.muted, .55);
        line(g, x, y - hgt / 2, x, y + hgt / 2, c, l === 'I' ? 1 : 2);
        if (l === 'E') dot(g, x, y - hgt / 2 - 2, 2, P.hot);
        if (bk > .5 && Math.abs(m - 75.0167) <= .5) ring(g, x, y - hgt / 2 - 2, 5 + 2 * Math.sin(t * .012), A(P.acc, .8));
      });
      if (p < .27 && scan < X0 + XW) line(g, scan, 64, scan, 160, A(P.cool, .7));
    });
    g.restore();
    /* burst labels (outside clip) */
    scene(g, sa(p, .27, .53) * eo(seg(p, .4, .44)), () => {
      [[40, '4 errors'], [75, '6 errors']].forEach(([m, s]) => T(g, s, xOf(m + 2.5), 61, { f: F.mono, s: 7.5, c: P.hot, a: 'center' }));
    });
    /* axis labels */
    for (let m = Math.ceil(d0 / step) * step; m <= d0 + wd + .001; m += step) {
      const x = xOf(m); if (x < X0 + 10 || x > X0 + XW - 10) continue;
      const hh = 13 + Math.floor(m / 60), mm = Math.floor(m % 60);
      T(g, `${hh}:${String(mm).padStart(2, '0')}`, x, 174, { f: F.mono, s: 7.5, c: P.dim, a: 'center' });
    }

    /* results panel */
    card(g, 16, 182, 448, 78);
    const rows = (al, title, lines) => scene(g, al, () => {
      T(g, title, 28, 199, { f: F.mono, s: 8.5, c: P.acc });
      lines.forEach(([s, c], i) => T(g, s, 28, 216 + i * 14, { f: F.mono, s: 8.5, c: c || P.fg }));
    });
    rows(sa(p, .1, .28) * (p > .1 ? 1 : 0), '3 files ingested · format auto-detected', [['✓ app.log      plaintext   entries_added 18', P.fg], ['✓ api.jsonl    jsonl       entries_added 12'], ['✓ errors.log   plaintext   entries_added 14']]);
    scene(g, sa(p, 0, .11), () => { T(g, 'auto-detecting formats…', 28, 199, { f: F.mono, s: 8.5, c: P.acc }); LANES.forEach((L, i) => { const k = seg(p, .03 + i * .07, .1 + i * .07); T(g, `${L.n.padEnd(12)} lines_read ${Math.round(L.ev.length * k)}`, 28, 216 + i * 14, { f: F.mono, s: 8.5, c: k > 0 ? P.fg : P.dim }); }); });
    scene(g, sa(p, .28, .45), () => { const n = Math.min(18, Math.floor(seg(p, .29, .45) * 18) + 1); T(g, `scanning 5-min windows… ${n}/18`, 28, 199, { f: F.mono, s: 8.5, c: P.acc }); R(g, 28, 210, 420, 6, 3, P.panel2); R(g, 28, 210, 420 * seg(p, .29, .45), 6, 3, P.cool); T(g, 'threshold: 3+ errors per window', 28, 236, { f: F.mono, s: 8.5, c: P.muted }); });
    rows(sa(p, .44, .52), 'anomalies: 2   (3+ errors in a 5-min window)', [['13:40 → 13:45   4 errors   errors.log', P.fg], ['14:15 → 14:20   6 errors   app.log, api.jsonl', P.hot]]);
    rows(sa(p, .64, .78), 'events within ±30 s of 14:15:01', [['14:14:58  ERROR  Upstream timeout             api.jsonl:6', P.hot], ['14:15:00  ERROR  Database connection timeout  app.log:14', P.hot], ['14:15:03  WARN   Circuit breaker open         api.jsonl:7', P.acc]]);
    scene(g, sa(p, .79, 1), () => {
      T(g, '15 errors → 3 unique patterns', 28, 199, { f: F.mono, s: 8.5, c: P.acc });
      const k = eo(seg(p, .82, .9));
      [['Connection refused to <IP>:<NUM>', 5], ['NullPointerException', 3]].forEach(([s, n], i) => {
        const y = 212 + i * 20;
        T(g, s, 28, y + 8, { f: F.mono, s: 8.5 });
        R(g, 250, y, 180 * n / 5 * k, 10, 3, i ? A(P.acc, .8) : A(P.hot, .85));
        T(g, '×' + Math.round(n * k), 440, y + 8.5, { f: F.mono, s: 8.5, c: P.muted });
      });
      T(g, '+ 1 more pattern', 28, 252, { f: F.mono, s: 7.5, c: P.dim });
    });
  }
};

/* 4 ─ AI Cold Email Generator (PitchCraft AI) */
COVERS.mail = {
  dur: 5000,
  chapters: [['Personalize', 0], ['Tone control', .22], ['Circuit breaker', .48], ['Send + analytics', .75]],
  draw(g, p, t) {
    const tones = ['Formal', 'Friendly', 'Startup'];
    const ti = p < .22 ? 0 : p < .48 ? Math.min(2, Math.floor(seg(p, .22, .48) * 3)) : 1;
    /* left: form (scenes 1–3) */
    scene(g, sa(p, 0, .76) * (p > .48 && p < .76 ? .55 : 1), () => {
      card(g, 16, 30, 180, 230);
      [['COMPANY', 'Northwind Labs'], ['COMPANY INSIGHT', 'open-source LLM tooling'], ['ONE-LINER', 'I build RAG systems'], ['HOW YOU FOUND THEM', 'your VivaTech talk']].forEach(([l, v], i) => {
        const y = 50 + i * 43, k = seg(p, .02 + i * .025, .045 + i * .025);
        label(g, l, 27, y, P.dim);
        R(g, 27, y + 5, 158, 22, 5, P.bg, k > 0 && k < 1 ? P.acc : P.line);
        T(g, typ(v, k), 34, y + 20, { s: 10 });
      });
      label(g, 'TONE', 27, 228, P.dim);
      R(g, 27, 233, 158, 20, 6, P.bg, P.line);
      tones.forEach((s, i) => { const x = 27 + i * 52.7; if (i === ti) R(g, x + 2, 235, 48.7, 16, 5, P.acc); T(g, s, x + 26.3, 247, { f: F.mono, s: 8, a: 'center', c: i === ti ? P.onAcc : P.muted }); });
    });
    /* left scene 4: send */
    scene(g, sa(p, .75, 1), () => {
      card(g, 16, 30, 180, 230);
      label(g, 'ATTACHMENT', 27, 50, P.dim);
      R(g, 27, 57, 158, 40, 7, P.bg, P.line);
      R(g, 35, 64, 20, 26, 3, A(P.hot, .2), P.hot); T(g, 'PDF', 45, 80, { f: F.mono, s: 6.5, c: P.hot, a: 'center' });
      T(g, 'resume.pdf', 63, 75, { s: 10 }); T(g, '182 KB', 63, 88, { f: F.mono, s: 8, c: P.dim });
      label(g, 'VIA', 27, 118, P.dim); T(g, 'Gmail SMTP · app password', 27, 133, { f: F.mono, s: 8.5, c: P.muted });
      const pr = seg(p, .79, .81), sent = p > .83;
      R(g, 27, 150, 158, 30, 8, sent ? A(P.ok, .16) : pr > 0 ? P.acc : P.panel2, sent ? P.ok : P.line);
      T(g, sent ? 'Sent ✓' : 'Send email', 106, 169, { s: 11, w: 600, c: sent ? P.ok : pr > 0 ? P.onAcc : P.fg, a: 'center' });
      const fk = seg(p, .81, .87);
      if (fk > 0 && fk < 1) { const x = lerp(106, 330, eio(fk)), y = 165 - Math.sin(fk * Math.PI) * 60; R(g, x - 10, y - 7, 20, 14, 2, P.fg); line(g, x - 10, y - 7, x, y, P.bg); line(g, x + 10, y - 7, x, y, P.bg); }
      T(g, 'edit subject & body before', 27, 208, { s: 9.5, c: P.muted }); T(g, 'sending · no locked templates', 27, 222, { s: 9.5, c: P.muted });
    });
    /* right scenes 1–2: email preview */
    const E = [
      ['Application: AI Engineer alternance', ['Dear Ms. Martin,', 'I recently followed your VivaTech talk on', 'open-source LLM tooling. I build RAG', 'systems and would value a short call.']],
      ['Loved your VivaTech talk!', ['Hi Claire,', 'Your VivaTech talk on open-source LLM', 'tooling stuck with me. I build RAG', "systems too, and I'd love to chat."]],
      ['RAG builder → Northwind?', ['Hey Claire,', 'Quick one: saw your VivaTech talk.', 'I build RAG systems. 15 min this week', 'to see if I can help you ship?']]
    ];
    scene(g, sa(p, 0, .49), () => {
      card(g, 206, 30, 258, 230);
      label(g, 'TO', 218, 50, P.dim); T(g, 'claire.martin@northwind.example', 240, 50, { f: F.mono, s: 8.5, c: P.muted });
      const lk = p < .22 ? seg(p, .12, .2) : seg(p, .22 + ti * .0867, .27 + ti * .0867);
      label(g, 'SUBJECT', 218, 70, P.dim); T(g, typ(E[ti][0], lk * 1.5), 218, 86, { s: 11.5, w: 600 });
      line(g, 218, 96, 452, 96, P.line);
      E[ti][1].forEach((s, i) => T(g, typ(s, lk * 5 - i - .5), 218, 116 + i * 18, { s: 10, c: i ? P.fg : P.muted }));
      if (lk >= 1 && Math.floor(t / 400) % 2) R(g, 218 + TW(g, E[ti][1][3], { s: 10 }) + 2, 180, 1.5, 12, 0, P.acc);
      T(g, typ('Siddharth Taurani', lk * 5 - 4), 218, 206, { s: 10, c: P.muted });
      chip(g, 'mistral', 218, 230, { c: P.cool, bg: A(P.cool, .12) });
      chip(g, tones[ti].toLowerCase(), 276, 230, { c: P.acc, bg: A(P.acc, .12) });
      if (p > .22) T(g, 'editable ✎', 452, 242, { f: F.mono, s: 8, c: P.dim, a: 'right' });
    });
    /* right scene 3: circuit breaker */
    scene(g, sa(p, .48, .76), () => {
      card(g, 206, 30, 258, 230);
      R(g, 218, 64, 64, 26, 7, P.bg, P.cool); T(g, 'request', 250, 80.5, { f: F.mono, s: 9, a: 'center' });
      const open = p > .62;
      R(g, 352, 48, 100, 28, 7, open ? A(P.hot, .1) : P.bg, open ? P.hot : P.line); T(g, 'mistral', 402, 60, { f: F.mono, s: 9, a: 'center' }); T(g, 'primary', 402, 71, { f: F.mono, s: 7.5, a: 'center', c: P.dim });
      const fb = p > .655;
      R(g, 352, 128, 100, 28, 7, fb ? A(P.ok, .12) : P.bg, fb ? P.ok : P.line); T(g, 'fallback', 402, 140, { f: F.mono, s: 9, a: 'center' }); T(g, 'model', 402, 151, { f: F.mono, s: 7.5, a: 'center', c: P.dim });
      /* breaker */
      line(g, 282, 77, 302, 77, P.muted, 1.4); dot(g, 302, 77, 3, P.fg);
      const ang = lerp(-.42, -1.3, eio(seg(p, .62, .645)));
      line(g, 302, 77, 302 + Math.cos(ang) * 34, 77 + Math.sin(ang) * 34, open ? P.hot : P.cool, 2.2);
      dot(g, 333, 62, 3, P.fg); line(g, 333, 62, 352, 62, P.muted, 1.4);
      T(g, open ? 'OPEN' : 'CLOSED', 318, 98, { f: F.mono, s: 8.5, w: 500, a: 'center', c: open ? P.hot : P.cool });
      /* fallback route */
      g.beginPath(); g.moveTo(250, 90); g.bezierCurveTo(250, 142, 300, 142, 352, 142); g.strokeStyle = fb ? A(P.ok, .7) : P.line; g.setLineDash([4, 4]); g.lineWidth = 1.2; g.stroke(); g.setLineDash([]);
      /* failing attempts */
      [.505, .545, .585].forEach((s0, i) => { const k = seg(p, s0, s0 + .035); if (k > 0 && k < 1) { const f = k < .6 ? k / .6 : 1 - (k - .6) / .4; dot(g, lerp(282, 352, f), lerp(77, 62, f), 3.2, k < .6 ? P.acc : P.hot); } if (p > s0 + .021) cross(g, 362 + i * 12, 87, 3, P.hot); });
      const fk = seg(p, .66, .7); if (fk > 0 && fk < 1) { const u = eio(fk); const bx = (1 - u) ** 3 * 250 + 3 * (1 - u) ** 2 * u * 250 + 3 * (1 - u) * u * u * 300 + u ** 3 * 352, by = (1 - u) ** 3 * 90 + 3 * (1 - u) ** 2 * u * 142 + 3 * (1 - u) * u * u * 142 + u ** 3 * 142; dot(g, bx, by, 3.2, P.ok); }
      if (p > .7) check(g, 444, 142, 9, P.ok);
      T(g, `failures ${Math.min(3, [.526, .566, .606].filter(s => p > s).length)}/3`, 402, 104, { f: F.mono, s: 8, c: P.muted, a: 'center' });
      line(g, 218, 170, 452, 170, P.line);
      [['WARN ', 'mistral timeout (1/3)', .53], ['WARN ', 'mistral 503 (2/3)', .57], ['WARN ', 'mistral timeout (3/3)', .61], ['ERROR', 'breaker OPEN → fallback', .63], ['INFO ', 'generated via fallback ✓', .705]].forEach(([lv, s, s0], i) => {
        if (p < s0) return; const y = 186 + i * 14;
        T(g, lv, 218, y, { f: F.mono, s: 8, c: lv === 'ERROR' ? P.hot : lv === 'INFO ' ? P.ok : P.acc }); T(g, s, 252, y, { f: F.mono, s: 8 });
      });
    });
    /* right scene 4: analytics */
    scene(g, sa(p, .75, 1), () => {
      card(g, 206, 30, 258, 230);
      label(g, 'ANALYTICS', 218, 50);
      const k = eo(seg(p, .84, .94));
      [['generated', 42], ['sent', 27]].forEach(([l, v], i) => { const x = 218 + i * 120; T(g, String(Math.round(v * k) + (i && p > .83 ? 0 : 0)), x, 82, { f: F.disp, s: 26, w: 600 }); T(g, l, x, 98, { s: 9.5, c: P.muted }); });
      label(g, 'TONE USAGE', 218, 124, P.dim);
      [['Formal', 12], ['Friendly', 19], ['Startup', 11]].forEach(([l, v], i) => { const y = 136 + i * 18; T(g, l, 218, y + 8, { f: F.mono, s: 8.5 }); R(g, 278, y, 160 * v / 19 * k, 10, 3, i === 1 ? P.acc : A(P.cool, .7)); T(g, String(Math.round(v * k)), 452, y + 8.5, { f: F.mono, s: 8.5, c: P.muted, a: 'right' }); });
      label(g, 'LAST 7 DAYS', 218, 204, P.dim);
      const D = [3, 5, 4, 8, 6, 9, 7]; g.beginPath(); D.forEach((d, i) => { const x = 218 + i * 39, y = 250 - d * 3.6 * k; i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.strokeStyle = P.cool; g.lineWidth = 1.6; g.stroke(); g.lineWidth = 1;
      dot(g, 218 + 6 * 39, 250 - 7 * 3.6 * k, 3, P.cool);
    });
  }
};

/* 5 ─ Student Performance + MVTec defects */
const G3 = [38, 0, 0, 0, 1, 7, 15, 9, 32, 28, 56, 47, 31, 31, 27, 33, 16, 6, 12, 5, 1];
const CORR = [[1, .85, .8, -.03, -.35, .16], [.85, 1, .9, -.03, -.36, .14], [.8, .9, 1, .03, -.36, .1], [-.03, -.03, .03, 1, .06, -.06], [-.35, -.36, -.36, .06, 1, -.17], [.16, .14, .1, -.06, -.17, 1]];
const SC = (() => { const r = rng(7), a = []; for (let i = 0; i < 90; i++) { let v = 0, u = r() * 395; for (let k = 0; k < 21; k++) { u -= G3[k]; if (u <= 0) { v = k; break; } } a.push([v, (r() + r() + r() - 1.5) * 2, (r() + r() - 1) * 2]); } return a; })();
const KM = (() => { const r = rng(11), a = []; for (let i = 0; i < 36; i++) { const bad = i % 4 === 0; a.push({ x0: r(), y0: r(), x: bad ? .78 + (r() - .5) * .22 : .3 + (r() - .5) * .38, y: bad ? .35 + (r() - .5) * .4 : .55 + (r() - .5) * .45, bad }); } return a; })();
COVERS.score = {
  dur: 5200,
  chapters: [['EDA', 0], ['10 regressors', .25], ['Key predictors', .49], ['U-Net defects', .72]],
  draw(g, p, t) {
    /* scene 1: histogram + correlation */
    scene(g, sa(p, 0, .26), () => {
      card(g, 16, 30, 222, 230);
      label(g, 'G3 FINAL GRADE · student-mat', 27, 48, P.dim);
      G3.forEach((v, i) => { const k = eo(seg(p, .02 + i * .006, .07 + i * .006)); const h = v / 56 * 150 * k, x = 28 + i * 9.6;
        R(g, x, 232 - h, 7.4, h, 1.5, i === 0 ? A(P.hot, .8) : A(P.cool, .75)); });
      [0, 10, 20].forEach(v => T(g, String(v), 31.7 + v * 9.6, 246, { f: F.mono, s: 7.5, c: P.dim, a: 'center' }));
      if (p > .1) T(g, 'G3 = 0', 34, 70, { f: F.mono, s: 7.5, c: P.hot });
      card(g, 246, 30, 218, 230);
      label(g, 'CORRELATION', 258, 48, P.dim);
      const lab = ['G1', 'G2', 'G3', 'abs', 'fail', 'study'];
      lab.forEach((l, i) => { T(g, l, 296, 74 + i * 28, { f: F.mono, s: 7.5, c: P.muted, a: 'right' }); T(g, l, 315 + i * 25, 238, { f: F.mono, s: 7, c: P.muted, a: 'center' }); });
      CORR.forEach((row, i) => row.forEach((v, j) => { const k = eo(seg(p, .06 + (i + j) * .012, .1 + (i + j) * .012));
        R(g, 303 + j * 25, 59 + i * 28, 23, 26, 3, A(v >= 0 ? P.cool : P.hot, Math.abs(v) * .85 * k + .04));
        if (Math.abs(v) >= .35 && i !== j) T(g, v.toFixed(2).replace('0.', '.'), 314.5 + j * 25, 75.5 + i * 28, { f: F.mono, s: 6.5, a: 'center', c: P.fg, al: k }); }));
    });
    /* scene 2: predicted vs actual */
    scene(g, sa(p, .25, .5), () => {
      card(g, 16, 30, 222, 230);
      label(g, 'PREDICTED vs ACTUAL G3', 27, 48, P.dim);
      const q = eio(seg(p, .27, .44)), X = v => 36 + v / 20 * 190, Y = v => 236 - v / 20 * 170;
      line(g, X(0), Y(0), X(20), Y(20), A(P.acc, .6), 1, [4, 4]);
      line(g, 36, 66, 36, 236, P.line); line(g, 36, 236, 226, 236, P.line);
      SC.forEach(([a, n1, n2]) => { const sp = lerp(4.2, 1.6, q); dot(g, X(a + n2 * .3), Y(cl(a + n1 * sp, 0, 20)), 2.3, A(P.cool, .75)); });
      T(g, 'actual', 226, 250, { f: F.mono, s: 7.5, c: P.dim, a: 'right' });
      card(g, 246, 30, 218, 230);
      label(g, '10 REGRESSION MODELS', 258, 48, P.dim);
      ['Linear regression', 'Random Forest', 'XGBoost', '+ 7 more compared'].forEach((s, i) => { const k = seg(p, .27 + i * .035, .29 + i * .035); if (k <= 0) return;
        T(g, s, 278, 72 + i * 20, { s: 10, c: i === 3 ? P.muted : P.fg, al: k }); if (i < 3) check(g, 265, 68 + i * 20, 8, P.ok); });
      const r2 = .827 * eo(seg(p, .39, .46));
      T(g, 'R²', 258, 182, { f: F.mono, s: 9, c: P.muted });
      T(g, r2.toFixed(3), 258, 214, { f: F.disp, s: 36, w: 600, c: P.acc });
      T(g, 'best, with G1 & G2 included', 258, 232, { s: 9.5, c: P.muted });
    });
    /* scene 3: key predictors */
    scene(g, sa(p, .49, .73), () => {
      card(g, 16, 30, 222, 230);
      label(g, 'PREVIOUS FAILURES → G3', 27, 48, P.dim);
      const k = eo(seg(p, .51, .58));
      [[11.3, 6, 15], [8.1, 4, 11], [6.2, 0, 10], [5.7, 0, 9]].forEach(([m, lo, hi], i) => { const x = 50 + i * 46, Y = v => 230 - v / 20 * 160;
        line(g, x + 12, Y(lo * k), x + 12, Y(hi * k), P.dim); R(g, x, Y((m + 2) * k), 24, (Y((m - 2) * k) - Y((m + 2) * k)), 3, A(i ? P.hot : P.cool, .35), i ? P.hot : P.cool);
        line(g, x, Y(m * k), x + 24, Y(m * k), P.fg, 1.4); T(g, String(i), x + 12, 246, { f: F.mono, s: 8, c: P.muted, a: 'center' }); });
      chip(g, 'key predictor', 130, 58, { c: P.acc, bg: A(P.acc, .14) });
      card(g, 246, 30, 218, 230);
      label(g, 'ABSENCES → G3', 258, 48, P.dim);
      const r = rng(3); for (let i = 0; i < 70; i++) { const a = Math.pow(r(), 2.2) * 40, gr = cl(12 - a * .09 + (r() - .5) * 8, 0, 20) * (r() < .08 ? 0 : 1); const kk = seg(p, .52 + i * .002, .55 + i * .002); if (kk <= 0) continue; dot(g, 264 + a / 40 * 185, 230 - gr / 20 * 160, 2.1, A(gr === 0 ? P.hot : P.cool, .7 * kk)); }
      chip(g, 'key predictor', 366, 58, { c: P.acc, bg: A(P.acc, .14) });
      T(g, 'absences →', 452, 250, { f: F.mono, s: 7.5, c: P.dim, a: 'right' });
    });
    /* scene 4: MVTec metal nut + U-Net + K-means */
    scene(g, sa(p, .72, 1), () => {
      card(g, 16, 30, 222, 230);
      label(g, 'MVTec · metal_nut', 27, 48, P.dim);
      const cx = 127, cy = 148;
      g.save(); g.translate(cx, cy);
      for (let i = 0; i < 4; i++) { g.save(); g.rotate(i * Math.PI / 2 + Math.PI / 4); R(g, -16, -78, 32, 30, 6, '#5b636e'); g.restore(); }
      const mg = g.createRadialGradient(-20, -24, 6, 0, 0, 66); mg.addColorStop(0, '#a7aeb7'); mg.addColorStop(.6, '#6b737e'); mg.addColorStop(1, '#3d434c');
      dot(g, 0, 0, 62, mg); ring(g, 0, 0, 44, 'rgba(255,255,255,.12)', 2); dot(g, 0, 0, 26, P.bg); ring(g, 0, 0, 26, 'rgba(255,255,255,.25)', 1.5);
      g.restore();
      /* scratch */
      g.beginPath(); g.moveTo(cx + 20, cy - 50); g.quadraticCurveTo(cx + 38, cy - 34, cx + 48, cy - 12); g.strokeStyle = 'rgba(30,20,20,.75)'; g.lineWidth = 2.2; g.stroke(); g.lineWidth = 1;
      const sx = lerp(40, 220, seg(p, .74, .84));
      const inMask = (x, y) => { for (let u = 0; u <= 1; u += .1) { const qx = (1 - u) ** 2 * (cx + 20) + 2 * (1 - u) * u * (cx + 38) + u * u * (cx + 48), qy = (1 - u) ** 2 * (cy - 50) + 2 * (1 - u) * u * (cy - 34) + u * u * (cy - 12); if (Math.hypot(x - qx, y - qy) < 7) return true; } return false; };
      for (let x = 40; x < sx; x += 6) for (let y = 70; y < 230; y += 6) if (inMask(x + 3, y + 3)) R(g, x, y, 5, 5, 1, A(P.hot, .8));
      if (p < .845) line(g, sx, 64, sx, 236, P.cool, 1.4);
      if (p > .845) { chip(g, 'defect mask', 28, 236, { c: P.hot, bg: A(P.hot, .15) }); }
      card(g, 246, 30, 218, 124);
      label(g, 'U-NET', 258, 48, P.dim);
      const B = []; for (let i = 0; i < 4; i++) B.push([262 + i * 24, 58 + i * 16, 74 - i * 18]); for (let i = 2; i >= 0; i--) B.push([262 + (6 - i) * 24, 58 + i * 16, 74 - i * 18]);
      const flow = seg(p, .74, .9) * 7;
      for (let i = 0; i < 3; i++) line(g, B[i][0] + 12, B[i][1] - 3, B[6 - i][0], B[i][1] - 3, A(P.acc, .35), 1, [2, 3]);
      B.forEach(([x, y, h], i) => R(g, x, y, 12, h, 2, i < flow ? A(i < 3 ? P.cool : i === 3 ? P.acc : P.hot, .75) : A(P.muted, .15)));
      card(g, 246, 160, 218, 100);
      label(g, 'VGG16 → PCA → K-MEANS', 258, 177, P.dim);
      const kq = eio(seg(p, .82, .93));
      KM.forEach(d => dot(g, 262 + lerp(d.x0, d.x, kq) * 186, 186 + lerp(d.y0, d.y, kq) * 66, 2.6, kq > .5 ? A(d.bad ? P.hot : P.cool, .85) : A(P.muted, .6)));
      if (kq > .9) { cross(g, 262 + .3 * 186, 186 + .55 * 66, 3.5, P.fg); cross(g, 262 + .78 * 186, 186 + .35 * 66, 3.5, P.fg); }
    });
  }
};

/* 6 ─ Sentiment Analysis with BERT: tokenize → infer → CI → Docker */
COVERS.bert = {
  dur: 4600,
  chapters: [['Tokenize', 0], ['Inference', .22], ['GitHub Actions', .47], ['Docker', .75]],
  draw(g, p, t) {
    const TK = [['[CLS]', 101], ['i', 1045], ['love', 2293], ['this', 2023], ['product', 4031], ['[SEP]', 102]];
    const tx = i => 29 + i * 72;
    scene(g, sa(p, 0, .48), () => {
      const ink = sa(p, 0, .26);
      T(g, typ('“I love this product”', seg(p, .01, .07)), 240, 70, { f: F.disp, s: 24, w: 500, a: 'center', al: ink });
      T(g, 'WordPiece tokenizer', 240, 90, { f: F.mono, s: 8.5, c: P.dim, a: 'center', al: ink });
      TK.forEach(([s, id], i) => {
        const k = eo(seg(p, .08 + i * .018, .12 + i * .018)); if (k <= 0) return;
        const y = lerp(80, 150, k), foc = p > .22 && p < .4 && i === 2;
        R(g, tx(i), y, 62, 26, 7, foc ? A(P.acc, .18) : P.panel, foc ? P.acc : P.line);
        T(g, s, tx(i) + 31, y + 17, { f: F.mono, s: 10, a: 'center', c: s[0] === '[' ? P.cool : P.fg });
        T(g, String(id), tx(i) + 31, y + 40, { f: F.mono, s: 8, a: 'center', c: P.dim });
      });
      /* attention */
      const ak = sa(p, .22, .48) * eo(seg(p, .23, .3));
      if (ak > 0) {
        const f = Math.floor(seg(p, .23, .42) * 6) % 6;
        TK.forEach((_, i) => TK.forEach((__, j) => { if (j <= i) return; const w = (i === 2 || j === 2 ? 1 : .25) * (.35 + .65 * Math.abs(Math.sin(i * 2.1 + j * 1.3 + f)));
          const x1 = tx(i) + 31, x2 = tx(j) + 31; g.beginPath(); g.moveTo(x1, 148); g.quadraticCurveTo((x1 + x2) / 2, 148 - (j - i) * 18, x2, 148);
          g.strokeStyle = A(i === 2 || j === 2 ? P.acc : P.cool, w * .75 * ak); g.lineWidth = w * 2.6; g.stroke(); }));
        g.lineWidth = 1;
        T(g, `layer ${1 + Math.floor(seg(p, .23, .4) * 11)}/12`, 452, 58, { f: F.mono, s: 8.5, c: P.muted, a: 'right', al: ak });
      }
      /* logits */
      const lk = sa(p, .34, .48) * eo(seg(p, .34, .4));
      if (lk > 0) {
        g.save(); g.globalAlpha *= lk;
        T(g, 'NEGATIVE', 29, 216, { f: F.mono, s: 8.5, c: P.muted }); R(g, 100, 208, 50 * lk, 10, 3, A(P.hot, .7));
        T(g, 'POSITIVE', 29, 236, { f: F.mono, s: 8.5, c: P.muted }); R(g, 100, 228, 210 * lk, 10, 3, P.ok);
        R(g, 344, 210, 106, 30, 8, A(P.ok, .15), P.ok); T(g, 'POSITIVE', 397, 230, { f: F.mono, s: 11, w: 500, c: P.ok, a: 'center' });
        T(g, '$ python src/inference.py --text "I love this product"', 29, 258, { f: F.mono, s: 7.5, c: P.dim });
        g.restore();
      }
    });
    /* CI */
    scene(g, sa(p, .47, .76), () => {
      T(g, 'git push → main', 30, 52, { f: F.mono, s: 9, c: P.muted }); dot(g, 22, 49, 3.5, P.acc);
      const J = [['test.yml', 'pytest -v', .49, .56], ['evaluate.yml', 'accuracy · F1', .56, .63], ['build.yml', 'docker build + push', .63, .7]];
      J.forEach(([n, s, a, b], i) => {
        const x = 22 + i * 150, run = p >= a && p < b, done = p >= b;
        if (i) { line(g, x - 22, 112, x, 112, done || run ? P.cool : P.line, 1.2); }
        R(g, x, 76, 128, 72, 9, P.panel, run ? P.acc : done ? A(P.ok, .7) : P.line);
        T(g, n, x + 12, 98, { f: F.mono, s: 10, w: 500 });
        T(g, s, x + 12, 116, { f: F.mono, s: 8.5, c: P.muted });
        if (run) spinner(g, x + 112, 94, 6, t, P.acc); else if (done) { dot(g, x + 112, 94, 8, A(P.ok, .2)); check(g, x + 112, 94, 8, P.ok); } else ring(g, x + 112, 94, 6, P.line, 1.5);
        R(g, x + 12, 128, 104, 4, 2, P.panel2); R(g, x + 12, 128, 104 * seg(p, a, b), 4, 2, done ? P.ok : P.acc);
      });
      [['on: push, pull_request', .49], ['metrics.json uploaded as artifact', .6], ['needs: test ✓ → push to Docker Hub', .67]].forEach(([s, s0], i) => { if (p >= s0) T(g, s, 30, 180 + i * 18, { f: F.mono, s: 8.5, c: i === 2 ? P.cool : P.fg }); });
      T(g, 'team of 3 · my part: tests workflow + Docker Compose', 30, 248, { f: F.mono, s: 8, c: P.dim });
    });
    /* Docker */
    scene(g, sa(p, .75, 1), () => {
      card(g, 16, 30, 448, 230);
      T(g, '$ docker push prathmesh210/sentiment-app:latest', 28, 52, { f: F.mono, s: 8.5 });
      ['3f1a9c2e', 'b7d04e19', '52c8aa07', 'e90f3b6d'].forEach((h, i) => { const k = eo(seg(p, .77 + i * .02, .82 + i * .02)); const y = 72 + i * 17;
        T(g, h + ':', 28, y + 7, { f: F.mono, s: 8.5, c: P.muted }); R(g, 100, y, 240, 8, 3, P.panel2); R(g, 100, y, 240 * k, 8, 3, k >= 1 ? A(P.ok, .7) : P.cool);
        T(g, k >= 1 ? 'Pushed' : k > 0 ? 'Pushing' : 'Waiting', 352, y + 7.5, { f: F.mono, s: 8.5, c: k >= 1 ? P.ok : P.dim }); });
      line(g, 28, 148, 452, 148, P.line);
      const r1 = seg(p, .87, .9), r2 = seg(p, .9, .93);
      T(g, typ('$ docker compose up --build', r1 * 1.4), 28, 168, { f: F.mono, s: 8.5 });
      T(g, typ('$ docker run --rm prathmesh210/sentiment-app --text "I love this project"', r2 * 1.2), 28, 186, { f: F.mono, s: 7.8 });
      if (p > .94) { R(g, 28, 202, 150, 30, 8, A(P.ok, .15), P.ok); T(g, 'label: POSITIVE', 103, 222, { f: F.mono, s: 10.5, w: 500, c: P.ok, a: 'center' }); }
      /* whale-ish container stack */
      for (let i = 0; i < 3; i++) for (let j = 0; j <= i; j++) R(g, 380 + j * 20 - i * 10 + 10, 230 - i * 16, 17, 13, 2, A(P.cool, .3 + .2 * (p > .8 + i * .03 ? 1 : 0)), P.cool);
    });
  }
};

/* 7 ─ Gaming Market Insights: VGChartz sales */
const REL = [9, 46, 36, 17, 14, 14, 21, 16, 15, 17, 16, 41, 43, 60, 121, 219, 263, 289, 379, 338, 349, 482, 829, 775, 763, 941, 1008, 1202, 1428, 1431, 1259, 1139, 657, 546, 582, 614, 344];
const HEAT = { g: ['Action', 'Sports', 'Shooter', 'Platform', 'Role-Playing', 'Racing'], v: [[877.8, 525, 159.9], [683.4, 376.9, 135.4], [582.6, 313.3, 38.3], [447.1, 201.6, 130.8], [327.3, 188.1, 352.3], [359.4, 238.4, 56.7]] };
const PUB = (() => { const r = rng(21), a = []; for (let i = 0; i < 28; i++) { const t = i < 6 ? 'G' : i < 12 ? 'S' : 'O'; const tx = t === 'G' ? .72 + r() * .22 : t === 'S' ? .1 + r() * .2 : .15 + r() * .6, ty = t === 'G' ? .55 + r() * .2 : t === 'S' ? .76 + r() * .18 : .1 + r() * .45; a.push({ t, x0: r(), y0: r(), x: tx, y: ty, s: t === 'G' ? 4 + r() * 3 : t === 'S' ? 2.5 + r() * 1.5 : 1.8 + r() }); } return a; })();
COVERS.market = {
  dur: 5000,
  chapters: [['Clean 16,598 rows', 0], ['Releases per year', .25], ['Regional affinity', .5], ['Market Power Index', .75]],
  draw(g, p, t) {
    /* scene 1: table */
    scene(g, sa(p, 0, .26), () => {
      card(g, 16, 30, 448, 172);
      const cols = [['Rank', 26], ['Name', 64], ['Platform', 170], ['Year', 230], ['Genre', 276], ['Publisher', 340], ['Global', 418]];
      cols.forEach(([h, x]) => T(g, h, x, 48, { f: F.mono, s: 8, c: P.dim })); line(g, 16, 55, 464, 55, P.line);
      const r = rng(5), pl = ['PS2', 'Wii', 'DS', 'X360', 'PS3', 'GBA', 'PS'], ge = ['Action', 'Sports', 'Shooter', 'RPG', 'Racing', 'Platform', 'Misc'];
      const off = seg(p, .02, .22) * 60;
      g.save(); g.beginPath(); g.rect(16, 57, 448, 142); g.clip();
      for (let i = 0; i < 12; i++) {
        const y = 72 + i * 17 - (off % 17), row = i + Math.floor(off / 17);
        const rr = rng(row * 13 + 1); const nanY = row % 5 === 2, nanP = row % 7 === 4; const fixed = p > .16;
        T(g, String(row * 37 + 1), 26, y, { f: F.mono, s: 8.5, c: P.muted });
        R(g, 64, y - 7, 50 + rr() * 50, 7, 3, A(P.muted, .25));
        T(g, pl[Math.floor(rr() * pl.length)], 170, y, { f: F.mono, s: 8.5 });
        if (nanY) { T(g, 'NaN', 230, y, { f: F.mono, s: 8.5, c: P.hot, al: fixed ? .25 : 1 }); if (fixed) line(g, 229, y - 3, 250, y - 3, P.hot); }
        else T(g, String(1996 + Math.floor(rr() * 18)), 230, y, { f: F.mono, s: 8.5 });
        T(g, ge[Math.floor(rr() * ge.length)], 276, y, { f: F.mono, s: 8.5 });
        if (nanP) { T(g, 'NaN', 340, y, { f: F.mono, s: 8.5, c: P.hot, al: fixed ? .25 : 1 }); if (fixed) line(g, 339, y - 3, 360, y - 3, P.hot); }
        else R(g, 340, y - 7, 30 + rr() * 34, 7, 3, A(P.muted, .25));
        T(g, (rr() * 9 + .2).toFixed(2), 418, y, { f: F.mono, s: 8.5, c: P.cool });
      }
      g.restore();
      const k = seg(p, .16, .22);
      [['rows', '16,598', P.fg], ['Year NaN', String(Math.round(271 * (1 - k))), k >= 1 ? P.ok : P.hot], ['Publisher NaN', String(Math.round(58 * (1 - k))), k >= 1 ? P.ok : P.hot], ['Year dtype', p > .2 ? 'Int64' : 'float', p > .2 ? P.ok : P.muted]].forEach(([l, v, c], i) => {
        const x = 16 + i * 114; card(g, x, 208, 106, 52);
        T(g, v, x + 10, 236, { f: F.disp, s: 18, w: 600, c }); T(g, l, x + 10, 251, { f: F.mono, s: 7.5, c: P.muted });
      });
    });
    /* scene 2: releases per year */
    scene(g, sa(p, .25, .51), () => {
      card(g, 16, 30, 448, 230);
      label(g, 'TITLES RELEASED PER YEAR · 1980–2016', 28, 48, P.dim);
      const X = i => 40 + i / 36 * 410, Y = v => 236 - v / 1431 * 160, k = eio(seg(p, .27, .42));
      [1980, 1990, 2000, 2010, 2016].forEach(yr => T(g, String(yr), X(yr - 1980), 252, { f: F.mono, s: 7.5, c: P.dim, a: 'center' }));
      line(g, 40, 236, 450, 236, P.line);
      g.save(); g.beginPath(); g.rect(30, 50, 10 + 410 * k + 2, 200); g.clip();
      g.beginPath(); g.moveTo(X(0), 236); REL.forEach((v, i) => g.lineTo(X(i), Y(v))); g.lineTo(X(36), 236); g.closePath();
      const gr = g.createLinearGradient(0, 70, 0, 236); gr.addColorStop(0, A(P.cool, .35)); gr.addColorStop(1, A(P.cool, 0)); g.fillStyle = gr; g.fill();
      g.beginPath(); REL.forEach((v, i) => i ? g.lineTo(X(i), Y(v)) : g.moveTo(X(i), Y(v))); g.strokeStyle = P.cool; g.lineWidth = 1.8; g.stroke(); g.lineWidth = 1;
      g.restore();
      if (p > .42) { const pk = eo(seg(p, .42, .46)); dot(g, X(29), Y(1431), 4 * pk, P.acc); ring(g, X(29), Y(1431), 8 * pk, A(P.acc, .5));
        T(g, 'peak: 2008–09', X(29) - 13, Y(1431) - 5, { f: F.mono, s: 8.5, c: P.acc, a: 'right', al: pk }); }
      if (p > .44) { label(g, 'MOST GLOBAL SALES', 28, 72, P.dim); ['PS2', 'DS', 'Wii'].forEach((s, i) => chip(g, s, 28 + i * 42, 78, { c: P.acc, bg: A(P.acc, .13), w: 36 })); }
    });
    /* scene 3: heatmap */
    scene(g, sa(p, .5, .76), () => {
      card(g, 16, 30, 280, 230);
      label(g, 'GENRE SHARE OF REGIONAL SALES', 28, 48, P.dim);
      const sums = [0, 1, 2].map(j => HEAT.v.reduce((a, r) => a + r[j], 0));
      ['NA', 'EU', 'JP'].forEach((r, j) => T(g, r, 140 + j * 50, 244, { f: F.mono, s: 8.5, c: j === 2 ? P.acc : P.muted, a: 'center' }));
      HEAT.g.forEach((gn, i) => {
        T(g, gn, 110, 74 + i * 28, { s: 9.5, c: i === 4 ? P.acc : P.fg, a: 'right' });
        HEAT.v[i].forEach((v, j) => { const sh = v / sums[j], k = eo(seg(p, .52 + (i + j) * .01, .56 + (i + j) * .01));
          R(g, 116 + j * 50, 58 + i * 28, 46, 25, 4, A(P.cool, Math.min(.95, sh / .4) * k + .03));
          });
      });
      if (p > .62) { const pk = .6 + .4 * Math.sin(t * .008); R(g, 216, 170, 46, 25, 4, null, A(P.acc, pk), 2); }
      card(g, 304, 30, 160, 230);
      label(g, 'FINDINGS', 316, 48);
      const fk = eo(seg(p, .62, .68));
      g.save(); g.globalAlpha *= fk;
      T(g, 'JP × RPG', 316, 76, { f: F.disp, s: 18, w: 600, c: P.acc });
      ['Japan over-indexes on', 'role-playing games vs', 'Western markets'].forEach((s, i) => T(g, s, 316, 94 + i * 14, { s: 9.5, c: P.muted }));
      g.restore();
      const fk2 = eo(seg(p, .67, .72)); g.save(); g.globalAlpha *= fk2;
      T(g, 'NA & EU', 316, 164, { f: F.disp, s: 18, w: 600 });
      ['Action, Sports and', 'Shooter lead titles', 'and revenue'].forEach((s, i) => T(g, s, 316, 182 + i * 14, { s: 9.5, c: P.muted }));
      g.restore();
    });
    /* scene 4: Market Power Index */
    scene(g, sa(p, .75, 1), () => {
      card(g, 16, 30, 290, 230);
      label(g, 'PUBLISHER ARCHETYPES', 28, 48, P.dim);
      const X = v => 40 + v * 250, Y = v => 236 - v * 168, k = eio(seg(p, .77, .88));
      line(g, 40, 236, 292, 236, P.line); line(g, 40, 64, 40, 236, P.line);
      T(g, 'genre diversity →', 292, 250, { f: F.mono, s: 7.5, c: P.dim, a: 'right' });
      g.save(); g.translate(30, 236); g.rotate(-Math.PI / 2); T(g, 'hit rate →', 0, 0, { f: F.mono, s: 7.5, c: P.dim }); g.restore();
      const hk = eo(seg(p, .87, .92));
      if (hk > 0) { g.save(); g.globalAlpha *= hk; g.setLineDash([3, 4]);
        g.beginPath(); g.ellipse(X(.83), Y(.65), 42, 26, 0, 0, 7); g.strokeStyle = P.acc; g.stroke();
        g.beginPath(); g.ellipse(X(.2), Y(.85), 36, 22, 0, 0, 7); g.strokeStyle = P.cool; g.stroke(); g.setLineDash([]);
        T(g, 'Diversified Giants', X(.83), Y(.65) - 32, { f: F.mono, s: 8, c: P.acc, a: 'center' });
        T(g, 'Genre Specialists', X(.2) + 4, Y(.85) + 34, { f: F.mono, s: 8, c: P.cool, a: 'center' }); g.restore(); }
      PUB.forEach(d => dot(g, X(lerp(d.x0, d.x, k)), Y(lerp(d.y0 * .9, d.y, k)), d.s, d.t === 'G' ? A(P.acc, .85) : d.t === 'S' ? A(P.cool, .85) : A(P.muted, .45)));
      card(g, 314, 30, 150, 230);
      label(g, 'MARKET POWER INDEX', 326, 48);
      [['genre diversity', P.cool], ['regional consistency', P.cool], ['hit rate', P.cool], ['market share', P.cool]].forEach(([s, c], i) => { const kk = eo(seg(p, .78 + i * .025, .8 + i * .025)); if (kk <= 0) return;
        g.save(); g.globalAlpha *= kk; dot(g, 330, 70 + i * 24, 3, c); T(g, s, 340, 73.5 + i * 24, { s: 9.5 }); g.restore(); });
      const lk = eo(seg(p, .86, .9)); if (lk > 0) { line(g, 330, 74, 330, 70 + 72 + 4 + 14 * lk, A(P.cool, .5)); line(g, 330, 160, 389, 160, A(P.acc, .5 * lk)); line(g, 389, 160, 389, 172, A(P.acc, .5 * lk)); }
      const mk = eo(seg(p, .88, .92));
      R(g, 340, 176, 98, 30, 8, A(P.acc, .15 * mk), A(P.acc, mk)); T(g, 'MPI', 389, 196, { f: F.disp, s: 15, w: 600, c: P.acc, a: 'center', al: mk });
      T(g, 'custom metric', 389, 228, { f: F.mono, s: 7.5, c: P.dim, a: 'center' });
    });
  }
};

/* ---------- render ---------- */
function render(canvas, key, p, opts = {}) {
  Object.assign(P, THEMES[opts.theme || root.ReelsTheme || 'dark']);
  const c = COVERS[key], dpr = opts.dpr || Math.min(2, root.devicePixelRatio || 1);
  const w = opts.width || canvas.clientWidth || W, h = w * H / W;
  const bw = Math.round(w * dpr), bh = Math.round(h * dpr);
  if (canvas.width !== bw || canvas.height !== bh) { canvas.width = bw; canvas.height = bh; }
  const g = canvas.getContext('2d');
  g.setTransform(bw / W, 0, 0, bh / H, 0, 0);
  g.globalAlpha = 1;
  stage(g);
  g.save(); c.draw(g, p, p * c.dur); g.restore();
  caption(g, c, p);
  const fade = 1 - Math.min(seg(p, 0, .025), 1 - seg(p, .975, 1));
  if (fade > 0) { g.fillStyle = A(P.bg, fade); g.fillRect(0, 24, W, H - 24); }
}
root.Reels = { COVERS, render, W, H, THEMES };
})(scope);

export const Reels = scope.Reels;
