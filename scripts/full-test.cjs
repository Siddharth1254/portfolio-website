/* Full test pass for the space redesign. Run from repo root:
   node scripts/full-test.cjs
   Requires: playwright in %TEMP%/st-pw, vite on :8080, lighthouse CLI optional via npx. */
const { chromium, firefox, webkit } = require(require('path').join(
  process.env.TEMP || process.env.TMPDIR || '/tmp',
  'st-pw',
  'node_modules',
  'playwright',
));
const fs = require('fs');
const path = require('path');
const { execSync, spawnSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const OUT = path.join(ROOT, 'reference', '_test-pass');
const BASE = 'http://localhost:8080/';
const VPS = [
  { w: 390, h: 844 },
  { w: 768, h: 1024 },
  { w: 1280, h: 720 },
  { w: 1440, h: 900 },
  { w: 1920, h: 1080 },
];
const COMBOS = [
  ['night', 'en'],
  ['night', 'fr'],
  ['day', 'en'],
  ['day', 'fr'],
];

const report = { ok: [], fail: [], warn: [], console: [], overflow: [], lighthouse: null };

function log(kind, msg) {
  report[kind].push(msg);
  console.log(`[${kind}] ${msg}`);
}

async function prep(page, theme, lang) {
  await page.addInitScript(([t, l]) => {
    try {
      localStorage.setItem('st-theme', t === 'day' ? 'light' : 'dark');
      localStorage.setItem('st-lang', l);
      sessionStorage.setItem('st-loaded', '1');
    } catch {}
  }, [theme, lang]);
  const errors = [];
  const warnings = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
    if (m.type() === 'warning') warnings.push(m.text());
  });
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 60000 });
  await page.evaluate(([t, l]) => {
    document.body.classList.toggle('light', t === 'day');
    document.documentElement.lang = l;
    const loader = document.getElementById('loader');
    if (loader) loader.remove();
    const hero = document.querySelector('.hero');
    if (hero) hero.classList.add('hero-in');
  }, [theme, lang]);
  await page.waitForTimeout(800);
  return { errors, warnings };
}

async function checkOverflow(page, label) {
  const issues = await page.evaluate(() => {
    const bad = [];
    const docW = document.documentElement.clientWidth;
    if (document.documentElement.scrollWidth > docW + 1) {
      bad.push(`horizontal page overflow: scrollWidth=${document.documentElement.scrollWidth} clientWidth=${docW}`);
    }
    const sels = [
      '.hero .intro', '.hero .avail', '.hero .avail small', '.hero .btns',
      '.exp .info', '.expnav', '.pdetail', '.pctrl', '.mnav', 'nav',
      '.contact-p', '.mailrow', '.statement',
    ];
    for (const sel of sels) {
      document.querySelectorAll(sel).forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0) return;
        if (r.right > docW + 2 || r.left < -2) {
          bad.push(`${sel} overflows viewport (left=${r.left.toFixed(0)} right=${r.right.toFixed(0)} vw=${docW})`);
        }
        if (el.scrollWidth > el.clientWidth + 2) {
          bad.push(`${sel} internal overflow scrollWidth=${el.scrollWidth} clientWidth=${el.clientWidth}`);
        }
      });
    }
    return bad;
  });
  for (const i of issues) log('overflow', `${label}: ${i}`);
}

async function interactions(page, label) {
  // theme toggle
  const themeBtn = page.locator('button.themeBtn, .themeBtn, button:has-text("Day"), button:has-text("Night"), button:has-text("Jour"), button:has-text("Nuit")').first();
  if (await themeBtn.count()) {
    await themeBtn.click();
    await page.waitForTimeout(300);
    await themeBtn.click();
  } else log('warn', `${label}: theme button not found`);

  // language toggle
  const langBtn = page.locator('button.langToggle, .langToggle').first();
  if (await langBtn.count()) {
    await langBtn.click();
    await page.waitForTimeout(400);
    await langBtn.click();
  } else log('warn', `${label}: lang toggle not found`);

  // mobile: open hamburger if nav links are hidden
  const menuBtn = page.locator('button.menuBtn, .menuBtn').first();
  if (await menuBtn.count()) {
    const visible = await menuBtn.isVisible().catch(() => false);
    if (visible) {
      await menuBtn.click();
      await page.waitForTimeout(300);
    }
  }

  // nav links
  for (const href of ['#about', '#experience', '#projects', '#skills', '#education', '#contact']) {
    const a = page.locator(`header a[href="${href}"], .mnav a[href="${href}"], a[href="${href}"]`).first();
    if (await a.count()) {
      const vis = await a.isVisible().catch(() => false);
      if (!vis && await menuBtn.count() && await menuBtn.isVisible().catch(() => false)) {
        await menuBtn.click();
        await page.waitForTimeout(250);
      }
      await a.click({ force: true });
      await page.waitForTimeout(250);
    }
  }

  // experience: launch + next + last stop
  await page.locator('#experience').scrollIntoViewIfNeeded();
  const launch = page.locator('#experience button:has-text("Launch"), #experience button:has-text("Lancer")').first();
  if (await launch.count()) {
    await launch.click();
    await page.waitForTimeout(1200);
  }
  const next = page.locator('#experience button[aria-label*="Next"], #experience button[aria-label*="suivante"]').first();
  if (await next.count()) {
    await next.click();
    await page.waitForTimeout(600);
  }
  const substrate = page.locator('#experience button:has-text("Substrate")').first();
  if (await substrate.count()) {
    await substrate.click();
    await page.waitForTimeout(1000);
  }

  // projects: arrows + open + Escape close
  await page.locator('#projects').scrollIntoViewIfNeeded();
  const pNext = page.locator('#pNext, #projects button[aria-label*="Next"], #projects button[aria-label*="suivant"]').first();
  if (await pNext.count()) {
    await pNext.click();
    await page.waitForTimeout(400);
  }
  const card = page.locator('#ring .pcard, #projects .pcard').first();
  if (await card.count()) {
    await card.click();
    await page.waitForTimeout(500);
    await page.keyboard.press('Escape');
    await page.waitForTimeout(300);
  }

  // skills glow (pointer move)
  const sk = page.locator('#skills .sk, .skills .sk').first();
  if (await sk.count()) {
    const box = await sk.boundingBox();
    if (box) await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  }

  // cert flip via Enter
  const cert = page.locator('#certifications .flip, .cred .flip').first();
  if (await cert.count()) {
    await cert.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(400);
    // don't Enter again (would open new tab) — blur instead
    await page.locator('body').click({ position: { x: 5, y: 5 } });
  }

  // copy email
  const copy = page.locator('#copyMail, button:has-text("Copy"), button:has-text("Copier")').first();
  if (await copy.count()) {
    await page.context().grantPermissions(['clipboard-write', 'clipboard-read']).catch(() => {});
    await copy.click();
    await page.waitForTimeout(400);
    const toast = page.locator('.toast.show, #toast.show');
    if (!(await toast.count())) log('warn', `${label}: toast not visible after copy`);
  }

  // external social hrefs present
  for (const href of [
    'https://linkedin.com/in/siddharthtaurani',
    'https://github.com/Siddharth1254',
    'https://medium.com/@siddharth_1254',
    'https://siddharth-taurani.substack.com',
  ]) {
    const n = await page.locator(`a[href="${href}"]`).count();
    if (!n) log('fail', `${label}: missing social ${href}`);
  }
}

async function matrix(browserType, name) {
  const browser = await browserType.launch();
  try {
    for (const { w, h } of VPS) {
      for (const [theme, lang] of COMBOS) {
        const label = `${name} ${w}x${h} ${theme}-${lang}`;
        const page = await browser.newPage({ viewport: { width: w, height: h } });
        try {
          const { errors, warnings } = await prep(page, theme, lang);
          // force language via UI if needed
          const htmlLang = await page.evaluate(() => document.documentElement.lang);
          if (htmlLang !== lang) {
            const langBtn = page.locator('button.langToggle, .langToggle').first();
            if (await langBtn.count()) await langBtn.click();
            await page.waitForTimeout(300);
          }
          // force theme
          const isLight = await page.evaluate(() => document.body.classList.contains('light'));
          if ((theme === 'day') !== isLight) {
            const themeBtn = page.locator('button.themeBtn, .themeBtn').first();
            if (await themeBtn.count()) await themeBtn.click();
            await page.waitForTimeout(200);
          }

          await checkOverflow(page, label);

          // screenshot key sections for FR overflow visual
          if (lang === 'fr' && (w === 390 || w === 1280)) {
            fs.mkdirSync(OUT, { recursive: true });
            for (const id of ['top', 'about', 'experience', 'projects', 'contact']) {
              const el = page.locator(`#${id === 'top' ? 'top' : id}`).first();
              if (await el.count()) {
                await el.scrollIntoViewIfNeeded();
                await page.waitForTimeout(200);
                await page.screenshot({
                  path: path.join(OUT, `${name}-${w}-${theme}-fr-${id}.png`),
                  type: 'png',
                });
              }
            }
          }

          // interactions only on chromium primary sizes to save time
          if (name === 'chromium' && (w === 390 || w === 1280) && theme === 'night' && lang === 'en') {
            await interactions(page, label);
          }

          if (errors.length) {
            for (const e of errors) log('console', `${label}: ERROR ${e}`);
            log('fail', `${label}: ${errors.length} console error(s)`);
          } else {
            log('ok', `${label}: clean console`);
          }
          for (const wmsg of warnings) log('warn', `${label}: WARN ${wmsg}`);
        } catch (e) {
          log('fail', `${label}: ${e.message || e}`);
        } finally {
          await page.close();
        }
      }
    }
  } finally {
    await browser.close();
  }
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });

  // lint + build
  try {
    execSync('npm run lint', { cwd: ROOT, stdio: 'pipe' });
    log('ok', 'npm run lint');
  } catch (e) {
    log('fail', `lint: ${e.stdout?.toString() || e.message}`);
  }
  try {
    execSync('npm run build', { cwd: ROOT, stdio: 'pipe' });
    log('ok', 'npm run build');
  } catch (e) {
    log('fail', `build: ${e.stderr?.toString() || e.message}`);
  }

  // ensure server
  try {
    await fetch(BASE);
  } catch {
    log('fail', 'dev server not reachable on :8080');
    writeReport();
    process.exit(1);
  }

  await matrix(chromium, 'chromium');
  // Safari/Firefox spot-check at one size
  try {
    await matrixSpot(firefox, 'firefox');
  } catch (e) {
    log('warn', `firefox spot: ${e.message}`);
  }
  try {
    await matrixSpot(webkit, 'webkit');
  } catch (e) {
    log('warn', `webkit/safari spot: ${e.message}`);
  }

  // Lighthouse mobile on preview if available
  await runLighthouse();

  writeReport();
  console.log('\n=== SUMMARY ===');
  console.log(`ok=${report.ok.length} fail=${report.fail.length} warn=${report.warn.length} overflow=${report.overflow.length} console=${report.console.length}`);
  if (report.fail.length) process.exitCode = 1;
}

async function matrixSpot(browserType, name) {
  const browser = await browserType.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  try {
    const { errors } = await prep(page, 'night', 'en');
    await checkOverflow(page, `${name} 1280 night-en`);
    if (errors.length) log('fail', `${name}: console ${errors.join(' | ')}`);
    else log('ok', `${name} 1280 night-en: clean`);
    await interactions(page, `${name} spot`);
  } finally {
    await page.close();
    await browser.close();
  }
}

async function runLighthouse() {
  // use production preview if running, else skip with note
  const url = 'http://localhost:4173/';
  let up = false;
  try {
    await fetch(url);
    up = true;
  } catch {
    // start preview briefly
    const child = spawnSync('npx', ['vite', 'preview', '--port', '4173', '--strictPort'], {
      cwd: ROOT,
      encoding: 'utf8',
      timeout: 3000,
    });
    // spawnSync with timeout will kill — better use detached
  }
  // try npx lighthouse against 8080 as fallback (dev is ok for a11y/seo; perf less meaningful)
  const target = up ? url : BASE;
  try {
    const outJson = path.join(OUT, 'lighthouse.json');
    execSync(
      `npx --yes lighthouse@12 "${target}" --only-categories=performance,accessibility,best-practices,seo --form-factor=mobile --screenEmulation.mobile --chrome-flags="--headless --no-sandbox" --output=json --output-path="${outJson}" --quiet`,
      { cwd: ROOT, stdio: 'pipe', timeout: 180000 },
    );
    const data = JSON.parse(fs.readFileSync(outJson, 'utf8'));
    const cats = data.categories;
    const scores = {
      performance: Math.round((cats.performance?.score || 0) * 100),
      accessibility: Math.round((cats.accessibility?.score || 0) * 100),
      bestPractices: Math.round((cats['best-practices']?.score || 0) * 100),
      seo: Math.round((cats.seo?.score || 0) * 100),
      url: target,
    };
    report.lighthouse = scores;
    log('ok', `lighthouse mobile @ ${target}: P${scores.performance} A${scores.accessibility} BP${scores.bestPractices} SEO${scores.seo}`);
    for (const [k, v] of Object.entries(scores)) {
      if (k === 'url') continue;
      if (v < 90) log('warn', `lighthouse ${k}=${v} (<90)`);
    }
  } catch (e) {
    log('warn', `lighthouse failed: ${e.message}`);
  }
}

function writeReport() {
  const md = [
    '# Test pass report',
    '',
    `Generated: ${new Date().toISOString()}`,
    '',
    `## Summary`,
    `- ok: ${report.ok.length}`,
    `- fail: ${report.fail.length}`,
    `- warn: ${report.warn.length}`,
    `- overflow: ${report.overflow.length}`,
    `- console issues: ${report.console.length}`,
    report.lighthouse ? `- lighthouse: ${JSON.stringify(report.lighthouse)}` : '- lighthouse: n/a',
    '',
    '## Failures',
    ...(report.fail.length ? report.fail.map((x) => `- ${x}`) : ['- none']),
    '',
    '## Overflow',
    ...(report.overflow.length ? report.overflow.map((x) => `- ${x}`) : ['- none']),
    '',
    '## Console',
    ...(report.console.length ? report.console.map((x) => `- ${x}`) : ['- none']),
    '',
    '## Warnings',
    ...(report.warn.length ? report.warn.map((x) => `- ${x}`) : ['- none']),
    '',
  ].join('\n');
  fs.writeFileSync(path.join(OUT, 'report.md'), md);
  console.log('wrote', path.join(OUT, 'report.md'));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
