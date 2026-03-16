import puppeteer from 'C:/Users/alexb/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';
import { readdir, mkdir } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const outDir = join(__dirname, 'temporary screenshots');

const url   = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

await mkdir(outDir, { recursive: true });

// Find next available index
const existing = await readdir(outDir).catch(() => []);
const nums = existing
  .map(f => parseInt(f.match(/^screenshot-(\d+)/)?.[1]))
  .filter(Boolean);
const next = nums.length ? Math.max(...nums) + 1 : 1;
const filename = label
  ? `screenshot-${next}-${label}.png`
  : `screenshot-${next}.png`;
const outPath = join(outDir, filename);

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/alexb/.cache/puppeteer/chrome/win64-136.0.7103.92/chrome-win64/chrome.exe',
  headless: true,
  args: ['--no-sandbox'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });
await page.screenshot({ path: outPath, fullPage: false });
await browser.close();

console.log(`Saved: ${outPath}`);
