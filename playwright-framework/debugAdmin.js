const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  await page.goto('https://opensource-demo.orangehrmlive.com/', { waitUntil: 'load', timeout: 60000 });
  await page.locator('[name="username"]').fill('Admin');
  await page.locator('[name="password"]').fill('admin123');
  await page.locator("//button[@type='submit']").click();
  await page.waitForTimeout(4000);
  await page.locator("//span[text()='Admin']/parent::a[@class='oxd-main-menu-item']").click();
  await page.waitForTimeout(4000);
  const cardCount = await page.locator('div.oxd-table-card').count();
  console.log('cardCount=', cardCount);
  for (let i = 0; i < Math.min(3, cardCount); i++) {
    const text = await page.locator('div.oxd-table-card').nth(i).textContent();
    console.log('CARD', i, JSON.stringify(text));
  }
  const rowSel = "div.oxd-table-card";
  const rows = page.locator(rowSel);
  const allTexts = [];
  for (let i = 0; i < await rows.count(); i++) {
    allTexts.push(await rows.nth(i).textContent());
  }
  console.log('TEXT SAMPLE', allTexts.slice(0, 3).map(t => t && t.substring(0, 200)));
  const roleText = await page.locator('text=ESS').first().count();
  console.log('ESS count=', roleText);
  const enabledText = await page.locator('text=Enabled').first().count();
  console.log('Enabled count=', enabledText);
  await browser.close();
})();
