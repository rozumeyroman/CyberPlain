// Механічна перевірка MD-брифу вендора (формат — cowork/cyberplain-vendor-brief/references/brief-format.md):
// передмова, ID і префікс, вендор (новий / наявний), класи, таблиця доказів, лінійки й редакції, обов'язкові поля продукту.
// Зміст (чи правильні класи за таблицями пакетів) перевіряють рецензенти скіла publish-vendor.
// Запуск: npm run vendor:check -- <шлях до брифу.md>   (код виходу 1 — є помилки)
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const file = process.argv[2];
if (!file) { console.error('Вкажіть шлях до брифу: npm run vendor:check -- vendor-x.md'); process.exit(2); }
const text = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const errors = [], warnings = [];
const err = (line, msg) => errors.push(`${line ? `рядок ${line}: ` : ''}${msg}`);
const warn = (line, msg) => warnings.push(`${line ? `рядок ${line}: ` : ''}${msg}`);

const dir = (p) => readdirSync(join(root, p)).filter((f) => f.endsWith('.json')).map((f) => ({ id: f.slice(0, -5), ...JSON.parse(readFileSync(join(root, p, f), 'utf8')) }));
const classes = new Set(dir('content/solutions/classes').map((c) => c.id));
const products = dir('content/solutions/products');
const productIds = new Set(products.map((p) => p.id));
const vendors = new Set(products.map((p) => p.vendor));
const otherIds = new Set([...classes, ...dir('content/attack/tactics').map((x) => x.id), ...dir('content/attack/techniques').map((x) => x.id)]);

// ── Передмова ──
const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
if (!fm) { console.error('Немає передмови між --- на початку файлу'); process.exit(1); }
const get = (k) => { const l = fm[1].split('\n').find((x) => x.startsWith(`${k}:`)); return l?.slice(k.length + 1).replace(/\s+#.*$/, '').trim().replace(/^"(.*)"$/, '$1'); };
if (get('type') !== 'vendor') err(0, 'type має бути vendor');
const vendor = get('vendor') ?? '';
const prefix = get('id-prefix') ?? '';
const mode = get('mode');
if (!vendor) err(0, 'немає vendor');
if (!/^[a-z0-9-]+$/.test(prefix)) err(0, `id-prefix «${prefix}» — латиниця малими, цифри й дефіси`);
if (!['new', 'update'].includes(mode)) err(0, 'mode має бути new | update');
if (mode === 'new' && vendors.has(vendor)) err(0, `вендор «${vendor}» уже є на сайті — це mode: update`);
if (mode === 'update' && !vendors.has(vendor)) err(0, `вендора «${vendor}» на сайті немає — це mode: new (або назва пишеться інакше: ${[...vendors].join(', ')})`);
const lower = [...vendors].find((v) => v.toLowerCase() === vendor.toLowerCase() && v !== vendor);
if (lower) err(0, `на сайті вендор пишеться «${lower}», а не «${vendor}»`);

// ── Розділи й продукти ──
const lines = text.split('\n');
const offset = fm[0].split('\n').length - 1;
const headings = [];
const ps = [];
let h2 = '', cur = null, inList = null, inEvidence = false;
lines.slice(offset).forEach((raw, i) => {
  const line = i + offset + 1, l = raw.trim();
  if (l.startsWith('## ')) { h2 = l.slice(3).trim(); headings.push(h2); cur = null; inList = null; inEvidence = false; return; }
  if (h2 !== 'Продукти') return;
  const h3 = l.match(/^### ([^\s·]+)\s*·\s*(.+)$/);
  if (h3) { cur = { line, id: h3[1], name: h3[2], f: {}, value: 0, notIncluded: 0, classification: 0, evidence: [], summary: '', details: false }; ps.push(cur); inList = null; inEvidence = false; return; }
  if (l.startsWith('### ')) { err(line, `заголовок продукту має бути «### <id> · <назва>»: ${l}`); return; }
  if (!cur) return;
  const f = l.match(/^- (Лінійка|Редакція|Порядок|Класи|URL):\s*(.*?)\s*(#.*)?$/);
  if (f && !inList) { cur.f[f[1]] = f[2]; return; }
  if (/^Коротко:\s*\S/.test(l)) { cur.summary = l.replace(/^Коротко:\s*/, ''); inList = null; return; }
  if (/^Детально:\s*\S/.test(l)) { cur.details = true; inList = null; return; }
  if (/^Що дає замовнику:/.test(l)) { inList = 'value'; return; }
  if (/^Чого немає:/.test(l)) { inList = 'notIncluded'; return; }
  if (/^Як класифікували:/.test(l)) { inList = 'classification'; return; }
  if (l.startsWith('|')) {
    const cells = l.replace(/^\||\|$/g, '').split('|').map((c) => c.trim().replace(/^`|`$/g, ''));
    if (cells[0] === 'Клас' && /Функція/.test(cells[1] ?? '')) { inEvidence = true; inList = null; return; }
    if (cells.every((c) => /^:?-+:?$/.test(c))) return;
    if (inEvidence && cells[0]) cur.evidence.push({ line, cls: cells[0], fn: cells[1], proof: cells[2] });
    return;
  }
  if (inList && /^- \S/.test(l) && !/^- —\s*$/.test(l)) cur[inList]++;
});

for (const h of ['Джерела', 'Лінійки', 'Продукти', 'Рішення щодо класифікації', 'Пропозиції змін класів', 'Питання до автора', 'Перевірка фактів'])
  if (!headings.includes(h)) err(0, `немає розділу «## ${h}» (назва має збігатися дослівно)`);
if (!ps.length) err(0, 'Продукти: немає жодного «### <id> · <назва>»');

const seen = new Set();
const lineEditions = new Map();
for (const p of ps) {
  const at = `${p.id}`;
  if (!/^[a-z0-9-]+$/.test(p.id)) err(p.line, `${at}: ID — латиниця малими, цифри й дефіси`);
  if (!p.id.startsWith(`${prefix}-`) && p.id !== prefix) err(p.line, `${at}: ID має починатися з «${prefix}-»`);
  if (seen.has(p.id)) err(p.line, `${at}: ID повторюється в брифі`);
  seen.add(p.id);
  if (otherIds.has(p.id)) err(p.line, `${at}: ID збігається з класом, етапом чи технікою`);
  if (productIds.has(p.id)) (mode === 'update' ? warn : err)(p.line, `${at}: продукт уже є на сайті${mode === 'update' ? ' — буде оновлено' : ''}`);
  const cls = (p.f['Класи'] ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!cls.length) err(p.line, `${at}: немає «- Класи:»`);
  const dup = cls.filter((c, i) => cls.indexOf(c) !== i);
  if (dup.length) err(p.line, `${at}: класи повторюються: ${dup.join(', ')}`);
  for (const c of cls) if (!classes.has(c)) err(p.line, `${at}: класу «${c}» немає (дивись classes.md)`);
  const ev = new Set(p.evidence.map((e) => e.cls));
  for (const c of cls) if (!ev.has(c)) err(p.line, `${at}: для класу «${c}» немає рядка в таблиці доказів`);
  for (const e of p.evidence) {
    if (!cls.includes(e.cls)) warn(e.line, `${at}: клас «${e.cls}» у доказах, але не в «Класи»`);
    if (!e.fn || !e.proof) err(e.line, `${at}: рядок доказу для «${e.cls}» без функції чи джерела`);
  }
  const ln = p.f['Лінійка'], ed = p.f['Редакція'], ord = p.f['Порядок'];
  const has = (v) => v && v !== '—';
  if (has(ln) !== has(ed)) err(p.line, `${at}: «Лінійка» і «Редакція» — або обидві, або «—»`);
  if (has(ln)) {
    if (!/^\d+$/.test(ord ?? '')) err(p.line, `${at}: «Порядок» — ціле число для продукту в лінійці`);
    const eds = lineEditions.get(ln) ?? [];
    if (eds.includes(ed)) err(p.line, `${at}: у лінійці «${ln}» редакція «${ed}» повторюється`);
    lineEditions.set(ln, [...eds, ed]);
  }
  if (!/^https:\/\/\S+$/.test(p.f['URL'] ?? '')) err(p.line, `${at}: немає «- URL: https://…» (першоджерело редакції)`);
  if (!p.summary) err(p.line, `${at}: немає «Коротко: …»`);
  else if (p.summary.length > 300) warn(p.line, `${at}: «Коротко» довше 300 символів (${p.summary.length})`);
  if (!p.details) err(p.line, `${at}: немає «Детально: …»`);
  if (p.value === 0) err(p.line, `${at}: немає «Що дає замовнику» (3–4 пункти)`);
  else if (p.value < 3 || p.value > 4) warn(p.line, `${at}: «Що дає замовнику» — ${p.value} пункт(и), зазвичай 3–4`);
  if (p.classification === 0) warn(p.line, `${at}: порожнє «Як класифікували»`);
}
for (const [ln, eds] of lineEditions) if (eds.length === 1) warn(0, `лінійка «${ln}» має одну редакцію — тоді «Лінійка: —»`);

for (const w of warnings) console.log(`⚠ ${w}`);
for (const e of errors) console.log(`✗ ${e}`);
console.log(errors.length ? `\n${errors.length} помилок, ${warnings.length} попереджень` : `\nФормат брифу гаразд: ${ps.length} продуктів, ${lineEditions.size} лінійок (${warnings.length} попереджень)`);
process.exit(errors.length ? 1 : 0);
