// Скіл для Claude Cowork «cyberplain-analytics-brief»: оновлює згенеровані довідники
// (cowork/cyberplain-analytics-brief/references/{portfolio,attack-v20,existing}.md) з content/ і data/mitre/
// і пакує папку скіла в cowork/dist/cyberplain-analytics-brief.zip для завантаження в Cowork.
// Запуск: npm run cowork:skill   (без zip: npm run cowork:skill -- --no-zip)
import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const skill = join(root, 'cowork/cyberplain-analytics-brief');
const refs = join(skill, 'references');
const read = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const dir = (p) => readdirSync(join(root, p)).filter((f) => f.endsWith('.json')).sort().map((f) => ({ id: f.slice(0, -5), ...read(join(p, f)) }));
const head = (title) => `<!-- Згенеровано scripts/cowork-skill.mjs з репозиторію CyberPlain. Не редагувати руками: npm run cowork:skill -->\n\n# ${title}\n\n`;

// ── Класи рішень і продукти ──
const classes = dir('content/solutions/classes');
const products = dir('content/solutions/products');
let md = head('Портфель: класи рішень і продукти');
md += 'Рішення в статті — **лише ці класи** (поле `class` = ID у першій колонці). Нових класів не вигадуємо: чого немає — у «Прогалини».\n';
md += 'Продукти тут — довідка, щоб зрозуміти, що клас означає в портфелі; у брифі пишемо клас, а продукт називаємо в `why`, лише якщо джерело саме про нього каже.\n\n';
md += '| ID класу | Назва | Що робить | Продукти в портфелі |\n|---|---|---|---|\n';
for (const c of classes) {
  const ps = products.filter((p) => p.classes.includes(c.id));
  const byVendor = {};
  for (const p of ps) (byVendor[p.vendor] ??= []).push(p.name);
  const list = Object.entries(byVendor).sort(([a], [b]) => a.localeCompare(b)).map(([v, n]) => `${v}: ${n.join(', ')}`).join('; ') || '—';
  md += `| \`${c.id}\` | ${c.ua}${c.en && !c.ua.includes('(') ? ` (${c.en})` : ''} | ${(c.simple ?? '').replace(/\|/g, '/')} | ${list} |\n`;
}
const vendors = [...new Set(products.map((p) => p.vendor))].sort((a, b) => a.localeCompare(b));
md += `\nВендори (${vendors.length}): ${vendors.join(', ')}. Продуктів: ${products.length}, класів: ${classes.length}.\n`;
writeFileSync(join(refs, 'portfolio.md'), md);

// ── ATT&CK Enterprise з імпорту ──
const attack = read('data/mitre/attack.json');
const tacticsUa = Object.fromEntries(dir('content/attack/tactics').map((t) => [t.id, t]));
const techUa = Object.fromEntries(dir('content/attack/techniques').map((t) => [t.id, t.ua]));
md = head(`MITRE ATT&CK Enterprise ${attack.version} (версія, на якій працює сайт)`);
md += 'Кожен ID техніки чи підтехніки в брифі має бути в цьому списку. Якщо джерело пише ID, якого тут немає (стара версія ATT&CK), —\n';
md += 'знайди відповідник за назвою й запиши обидва: `T1690 (у джерелі T1562.003)`.\n\n## Етапи (тактики)\n\n| ID | English | Українська |\n|---|---|---|\n';
const orderedTactics = [...attack.tactics].sort((a, b) => (tacticsUa[a.id]?.order ?? 99) - (tacticsUa[b.id]?.order ?? 99));
for (const t of orderedTactics) md += `| ${t.id} | ${t.en} | ${tacticsUa[t.id]?.ua ?? ''} |\n`;
md += '\n## Техніки й підтехніки\n\nФормат: `ID` English — українська робоча назва · етапи. Підтехніки — з відступом.\n\n';
for (const t of [...attack.techniques].sort((a, b) => a.id.localeCompare(b.id))) {
  md += `- \`${t.id}\` ${t.en}${techUa[t.id] ? ` — ${techUa[t.id]}` : ''} · ${t.tactics.join(', ')}\n`;
  for (const s of t.subtechniques ?? []) md += `  - \`${s.id}\` ${s.en}\n`;
}
writeFileSync(join(refs, 'attack-v20.md'), md);

// ── Уже опубліковані статті ──
md = head('Уже опубліковано в «Аналітиці»');
md += 'Перевір, що нова стаття не дублює наявну, і чи варто послатися на опубліковану вразливість (поле «Пов\'язані вразливості»). ID нової статті не може збігатися з жодним нижче.\n\n';
const sections = [['vulnerabilities', 'Вразливості'], ['attacks', 'Атаки'], ['reports', 'Звіти']];
for (const [d, label] of sections) {
  md += `## ${label}\n\n`;
  for (const e of dir(`content/analytics/${d}`).sort((a, b) => b.date.localeCompare(a.date))) {
    const extra = e.cves ? ` · ${e.cves.join(', ')}` : e.actor ? ` · ${e.actor.name} → ${e.victim.name}` : e.original ? ` · ${e.original.publisher}` : '';
    md += `- \`${e.id}\` (${e.date}) — ${e.title}${extra}\n`;
  }
  md += '\n';
}
writeFileSync(join(refs, 'existing.md'), md);
console.log(`references оновлено: ${classes.length} класів, ${products.length} продуктів, ${attack.techniques.length} технік ATT&CK ${attack.version}`);

if (!process.argv.includes('--no-zip')) {
  const out = join(root, 'cowork/dist');
  mkdirSync(out, { recursive: true });
  const zip = join(out, 'cyberplain-analytics-brief.zip');
  if (existsSync(zip)) rmSync(zip);
  execFileSync('zip', ['-r', '-q', zip, 'cyberplain-analytics-brief', '-x', '*.DS_Store'], { cwd: join(root, 'cowork') });
  console.log(`zip: cowork/dist/cyberplain-analytics-brief.zip`);
}
