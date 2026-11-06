// Прев'ю статті аналітики для соцмереж (og:image, 1200×630) у стилі public/og.png.
// npm run og:analytics -- <id> [<id> …]  →  public/og/analytics/<id>.uk.png і .en.png
// Назва сайту й кольори — з site.config.ts, тексти — з content/analytics і англійського оверлею.
// Потрібен Playwright з Chromium (є в хмарних сесіях Claude Code; у залежності проєкту не входить).
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const ids = process.argv.slice(2);
if (!ids.length) { console.error('Вкажи ID статті: npm run og:analytics -- <id>'); process.exit(1); }

const config = readFileSync('site.config.ts', 'utf8');
const name = config.match(/const name = '([^']+)'/)[1];
const colors = Object.fromEntries([...config.matchAll(/'?([\w-]+)'?: '(#[0-9A-Fa-f]{6})'/g)].map((m) => [m[1], m[2]]));

const sections = { reports: { uk: 'Звіт', en: 'Report' }, vulnerabilities: { uk: 'Вразливість', en: 'Vulnerability' }, attacks: { uk: 'Атака', en: 'Attack' } };
const kicker = { uk: 'Аналітика', en: 'Analytics' };
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function load(id) {
  for (const sec of Object.keys(sections)) {
    const file = `content/analytics/${sec}/${id}.json`;
    if (!existsSync(file)) continue;
    const uk = JSON.parse(readFileSync(file, 'utf8'));
    const enFile = `content/en/analytics/${sec}/${id}.json`;
    const en = existsSync(enFile) ? { ...uk, ...JSON.parse(readFileSync(enFile, 'utf8')) } : null;
    return { sec, uk, en };
  }
  throw new Error(`Немає статті ${id} у content/analytics/`);
}

// Нижній рядок: звідки матеріал (звіт — видавець і назва оригіналу, вразливість — CVE і CVSS, атака — угруповання).
function footer(sec, d) {
  if (sec === 'reports') return [d.original.publisher, d.original.title].join(' · ');
  if (sec === 'vulnerabilities') return [d.cves.join(', '), d.cvss ? `CVSS ${d.cvss.score}` : ''].filter(Boolean).join(' · ');
  return [d.actor?.name, d.victim?.name].filter(Boolean).join(' → ');
}

const html = (sec, d, lang) => `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;600&family=JetBrains+Mono:wght@400;500&display=swap">
<style>
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;background:${colors.bg};color:${colors.text};font-family:Onest,sans-serif;position:relative;
 background-image:radial-gradient(circle at 1px 1px,${colors['line-strong']} 1px,transparent 0);background-size:16px 16px}
.glow{position:absolute;border-radius:50%;filter:blur(90px);opacity:.28}
.g1{width:520px;height:420px;right:-120px;top:-120px;background:${colors.defense}}
.g2{width:560px;height:420px;left:420px;bottom:-260px;background:${colors['attack-glow']}}
.in{position:absolute;inset:72px 80px;display:flex;flex-direction:column}
.brand{display:flex;align-items:center;gap:18px;font-size:34px;font-weight:600;letter-spacing:-.01em}
.mono{font-family:'JetBrains Mono',monospace;text-transform:uppercase;letter-spacing:.08em}
.kick{margin-top:auto;font-size:22px;color:${colors.defense}}
.kick b{font-weight:400;color:${colors.attack}}
h1{margin-top:22px;font-size:58px;line-height:1.12;font-weight:600;letter-spacing:-.02em;max-width:1040px;
 display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.foot{margin-top:34px;font-size:20px;color:${colors.muted};white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
</style></head><body><div class="glow g1"></div><div class="glow g2"></div>
<div class="in">
 <div class="brand"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="${colors.defense}" stroke-width="1.75" stroke-linecap="square"><rect x="3" y="3" width="18" height="18"/><path d="M8 12h8M8 8h8M8 16h5"/></svg>${esc(name)}</div>
 <div class="kick mono">// ${kicker[lang]} · <b>${sections[sec][lang]}</b></div>
 <h1>${esc(d.title)}</h1>
 <div class="foot mono">${esc(footer(sec, d, lang))}</div>
</div></body></html>`;

mkdirSync('public/og/analytics', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const id of ids) {
  const { sec, uk, en } = load(id);
  for (const [lang, d] of [['uk', uk], ['en', en]]) {
    if (!d) { console.warn(`${id}: немає англійського оверлею — пропускаю en`); continue; }
    await page.setContent(html(sec, d, lang), { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const clipped = await page.evaluate(() => { const h = document.querySelector('h1'); const c = h.cloneNode(true); c.style.display = 'block'; h.after(c); const lh = parseFloat(getComputedStyle(h).lineHeight); const n = Math.round(c.offsetHeight / lh); c.remove(); return n > 3; });
    if (clipped) console.warn(`${id}.${lang}: заголовок довший за 3 рядки — обрізано`);
    const out = `public/og/analytics/${id}.${lang}.png`;
    await page.screenshot({ path: out, type: 'png' });
    console.log(out);
  }
}
await browser.close();
