const { chromium } = require(require('path').join(process.env.TEMP, 'st-pw', 'node_modules', 'playwright'));

(async () => {
  const browser = await chromium.launch();
  const fails = [];
  for (const [w, h] of [[390, 844], [1280, 720]]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.addInitScript(() => {
      localStorage.setItem('st-theme', 'dark');
      localStorage.setItem('st-lang', 'en');
      sessionStorage.setItem('st-loaded', '1');
    });
    const errs = [];
    page.on('pageerror', (e) => errs.push(String(e)));
    page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
    await page.goto('http://localhost:8080/', { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      document.getElementById('loader')?.remove();
      document.querySelector('.hero')?.classList.add('hero-in');
    });
    await page.waitForTimeout(600);

    const menu = page.locator('button.menuBtn');
    const mobile = await menu.count() > 0 && await menu.first().isVisible();
    for (const href of ['#about', '#experience', '#projects', '#skills', '#education', '#contact']) {
      try {
        if (mobile) {
          // desktop .links anchors are display:none on small screens — use #mnav
          if (!(await page.locator('#mnav.open, .mnav.open').count())) {
            await menu.first().click();
            await page.waitForTimeout(250);
          }
          await page.locator(`#mnav a[href="${href}"]`).click({ timeout: 5000 });
        } else {
          await page.locator(`nav.links a[href="${href}"]`).click({ timeout: 5000 });
        }
        await page.waitForTimeout(250);
      } catch (e) {
        fails.push(`${w}: nav ${href} ${e.message.split('\n')[0]}`);
      }
    }

    await page.locator('#experience').scrollIntoViewIfNeeded();
    const launch = page.locator('#experience button').filter({ hasText: /Launch|Lancer/ }).first();
    if (await launch.count()) {
      await launch.click();
      await page.waitForTimeout(1000);
    }
    const next = page.locator('button[aria-label*="Next"], button[aria-label*="suivante"]').first();
    if (await next.count()) await next.click();
    await page.waitForTimeout(500);
    const last = page.locator('#experience button').filter({ hasText: 'Substrate' }).first();
    if (await last.count()) {
      await last.click();
      await page.waitForTimeout(800);
    }

    await page.locator('#projects').scrollIntoViewIfNeeded();
    await page.locator('#pNext').click().catch(() => {});
    await page.waitForTimeout(300);
    await page.locator('#ring .pcard').first().click();
    await page.waitForTimeout(400);
    await page.keyboard.press('Escape');

    const cert = page.locator('.cred .flip').first();
    await cert.focus();
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    await page.locator('#copyMail').click();
    await page.waitForTimeout(400);
    if (!(await page.locator('.toast.show').count())) fails.push(`${w}: toast missing`);

    const ov = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    );
    if (ov) fails.push(`${w}: horizontal overflow`);
    if (errs.length) fails.push(`${w}: console ${errs.join('; ')}`);
    else console.log('OK interactions', w);
    await page.close();
  }
  await browser.close();
  if (fails.length) {
    console.log('FAILS');
    fails.forEach((f) => console.log(f));
    process.exit(1);
  }
  console.log('interaction recheck passed');
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
