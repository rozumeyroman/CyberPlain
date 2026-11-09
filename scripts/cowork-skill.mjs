// Скіли для Claude Cowork «cyberplain-analytics-brief» і «cyberplain-vendor-brief»: оновлює згенеровані довідники
// (references/ обох скілів) з content/, data/mitre/ і CLAUDE.md і пакує скіли в cowork/dist/*.zip.
// Cowork читає довідники з GitHub (гілка main), тому після змін класів, продуктів чи статей їх треба перегенерувати й закомітити.
// Запуск: npm run cowork:skill   (без zip: -- --no-zip; лише перевірити, чи довідники свіжі: -- --check, код виходу 1 — застарілі)
import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// fileURLToPath, а не .pathname: інакше пробіл у шляху (My Drive) стає %20 і readFileSync падає.
const root = fileURLToPath(new URL('..', import.meta.url));
const skill = join(root, 'cowork/cyberplain-analytics-brief');
const refs = join(skill, 'references');
const read = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const dir = (p) => readdirSync(join(root, p)).filter((f) => f.endsWith('.json')).sort().map((f) => ({ id: f.slice(0, -5), ...read(join(p, f)) }));
const CHECK = process.argv.includes('--check');
const stale = [];
// У режимі --check лише порівнюємо з файлом на диску; інакше записуємо.
const writeRef = (path, content) => {
  if (!CHECK) return writeFileSync(path, content);
  if (!existsSync(path) || readFileSync(path, 'utf8') !== content) stale.push(path.slice(root.length));
};
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
writeRef(join(refs, 'portfolio.md'), md);

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
writeRef(join(refs, 'attack-v20.md'), md);

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
writeRef(join(refs, 'existing.md'), md);
if (!CHECK) console.log(`analytics: ${classes.length} класів, ${products.length} продуктів, ${attack.techniques.length} технік ATT&CK ${attack.version}`);

// ── Скіл вендорів: cowork/cyberplain-vendor-brief/references/{classes,portfolio-rules,existing-products}.md ──
const vrefs = join(root, 'cowork/cyberplain-vendor-brief/references');
md = head('Класи рішень');
md += 'Класи продукту — **лише ці** (ID у першій колонці). Ризик (`risk`) сайт показує на сторінці продукту автоматично.\n';
md += 'Мапінг на ATT&CK (`defenses[]` технік) і D3FEND (`d3fend[]`) — на рівні класу: продукт отримує його через свої класи.\n\n';
md += '| ID | Назва | Що робить | Ризик без нього | Продуктів |\n|---|---|---|---|---|\n';
const cell = (s) => (s ?? '').replace(/\|/g, '/');
for (const c of classes) md += `| \`${c.id}\` | ${c.ua} | ${cell(c.simple)} | ${cell(c.risk)} | ${products.filter((p) => p.classes.includes(c.id)).length} |\n`;
writeRef(join(vrefs, 'classes.md'), md);

const claude = readFileSync(join(root, 'CLAUDE.md'), 'utf8');
const a = claude.indexOf('## Портфель рішень'), b = claude.indexOf('## Як працювати');
md = head('Правила портфеля (розділ «Портфель рішень» з CLAUDE.md)');
md += 'Обов\'язкові правила розмежування класів і рішення по кожному наявному вендору. Нового вендора класифікуй так само\n';
md += 'суворо, а свій абзац «Рішення щодо класифікації» пиши в цьому ж стилі.\n\n';
md += claude.slice(a, b).replace(/^## Портфель рішень\n/, '');
writeRef(join(vrefs, 'portfolio-rules.md'), md);

md = head('Уже на сайті: вендори й продукти');
md += 'Назву вендора пиши так само. ID нового продукту не може збігатися з наявним (крім оновлення цього продукту).\n\n';
for (const v of [...new Set(products.map((p) => p.vendor))].sort((x, y) => x.localeCompare(y))) {
  const ps = products.filter((p) => p.vendor === v);
  md += `## ${v} (${ps.length})\n\n| ID | Назва | Лінійка · редакція | Класи |\n|---|---|---|---|\n`;
  for (const p of ps.sort((x, y) => (x.line ?? '~').localeCompare(y.line ?? '~') || (x.order ?? 0) - (y.order ?? 0) || x.id.localeCompare(y.id)))
    md += `| \`${p.id}\` | ${p.name} | ${p.line ? `${p.line} · ${p.edition}` : '—'} | ${p.classes.join(', ')} |\n`;
  md += '\n';
}
writeRef(join(vrefs, 'existing-products.md'), md);
if (!CHECK) console.log(`vendors: ${[...new Set(products.map((p) => p.vendor))].length} вендорів`);

if (CHECK) {
  if (stale.length) {
    console.warn(`⚠ Довідники Cowork застаріли (Cowork читає їх з GitHub): ${stale.join(', ')}\n  Запусти npm run cowork:skill -- --no-zip і закоміть разом зі змінами.`);
    process.exit(1);
  }
  process.exit(0);
}

if (!process.argv.includes('--no-zip')) {
  const out = join(root, 'cowork/dist');
  mkdirSync(out, { recursive: true });
  for (const name of ['cyberplain-analytics-brief', 'cyberplain-vendor-brief']) {
    const zip = join(out, `${name}.zip`);
    if (existsSync(zip)) rmSync(zip);
    execFileSync('zip', ['-r', '-q', zip, name, '-x', '*.DS_Store'], { cwd: join(root, 'cowork') });
    console.log(`zip: cowork/dist/${name}.zip`);
  }
}
