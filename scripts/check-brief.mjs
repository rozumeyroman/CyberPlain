// Механічна перевірка MD-брифу аналітики (формат — cowork/cyberplain-analytics-brief/references/brief-format.md):
// ID, дати, CVE, техніки ATT&CK, етапи, класи рішень, фази, обов'язкові розділи, «що відбувається» й «що отримує» в кроках,
// «основа» й «що на кону» у висновках звіту, ілюстрація (схема чи образ) у кожній статті. Зміст і факти перевіряє команда
// рецензентів скіла publish-analytics, не цей скрипт.
// Запуск: npm run brief:check -- <шлях до брифу.md>   (код виходу 1 — є помилки)
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const file = process.argv[2];
if (!file) { console.error('Вкажіть шлях до брифу: npm run brief:check -- brief.md'); process.exit(2); }
const text = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
const errors = [], warnings = [];
const err = (line, msg) => errors.push(`${line ? `рядок ${line}: ` : ''}${msg}`);
const warn = (line, msg) => warnings.push(`${line ? `рядок ${line}: ` : ''}${msg}`);

// ── Довідники з репозиторію ──
const ids = (p) => existsSync(join(root, p)) ? readdirSync(join(root, p)).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)) : [];
const attack = JSON.parse(readFileSync(join(root, 'data/mitre/attack.json'), 'utf8'));
const techs = new Map(attack.techniques.map((t) => [t.id, t]));
const described = new Set(ids('content/attack/techniques'));
const tactics = new Set(ids('content/attack/tactics'));
const classes = new Set(ids('content/solutions/classes'));
const vulns = new Set(ids('content/analytics/vulnerabilities'));
const taken = new Map([
  ...['reports', 'vulnerabilities', 'attacks'].flatMap((d) => ids(`content/analytics/${d}`).map((i) => [i, `content/analytics/${d}`])),
  ...[...tactics, ...described].map((i) => [i, 'ATT&CK']),
  ...[...classes].map((i) => [i, 'класи рішень']),
  ...ids('content/solutions/products').map((i) => [i, 'продукти']),
]);

// ── Передмова ──
const fm = text.match(/^---\n([\s\S]*?)\n---\n/);
if (!fm) { console.error('Немає передмови між --- на початку файлу'); process.exit(1); }
const fmLines = fm[1].split('\n');
const get = (k) => { const l = fmLines.find((x) => x.startsWith(`${k}:`)); return l === undefined ? undefined : l.slice(k.length + 1).replace(/\s+#.*$/, '').trim().replace(/^"(.*)"$/, '$1'); };
const list = (v) => (v ?? '').replace(/^\[|\]$/g, '').split(',').map((s) => s.trim().replace(/^"|"$/g, '')).filter(Boolean);
const type = get('type');
const dir = { vulnerability: 'vulnerabilities', attack: 'attacks', report: 'reports' }[type];
if (!dir) err(0, `type має бути vulnerability | attack | report, а не «${type}»`);
const id = get('id') ?? '';
if (!/^[a-z0-9-]+$/.test(id)) err(0, `id «${id}» — лише латиниця малими, цифри й дефіси`);
else if (taken.has(id)) warn(0, `id «${id}» уже зайнятий (${taken.get(id)}) — це оновлення наявного запису чи помилка?`);
const isoDate = /^\d{4}(-\d{2}(-\d{2})?)?$/;
for (const k of ['date', 'exploitedSince']) { const v = get(k); if (v && !isoDate.test(v)) err(0, `${k} «${v}» — формат YYYY, YYYY-MM або YYYY-MM-DD`); }
if (!get('date')) err(0, 'немає date');
if (type === 'vulnerability') {
  const cves = list(get('cves'));
  if (!cves.length) err(0, 'немає cves');
  for (const c of cves) if (!/^CVE-\d{4}-\d{4,}$/.test(c)) err(0, `CVE «${c}» — формат CVE-РРРР-NNNN`);
}
if (type === 'attack' && !get('actor')) err(0, 'немає actor');
if (type === 'attack' && !/name:/.test(get('victim') ?? '')) err(0, 'немає victim { name, sector, country }');
if (type === 'report') {
  if (!['report', 'brief', 'note'].includes(get('kind'))) err(0, 'kind має бути report | brief | note');
  if (!fmLines.some((l) => /^\s+title:/.test(l)) || !fmLines.some((l) => /^\s+publisher:/.test(l))) err(0, 'original потребує title і publisher');
}
for (const v of list(get('related-vulnerabilities'))) if (!vulns.has(v)) err(0, `related-vulnerabilities: вразливості «${v}» немає на сайті`);

// ── Тіло: розділи й таблиці ──
const lines = text.split('\n');
const offset = fm[0].split('\n').length - 1;
const headings = [];
let h2 = '', h3 = '', table = null, tableLine = 0, rows = [];
// Кроки атаки: «## Кроки» в атаці і «## Ланцюжок атаки» у вразливості.
const stepSection = () => (type === 'attack' && h2 === 'Кроки') || (type === 'vulnerability' && h2 === 'Ланцюжок атаки');
const phased = () => type === 'vulnerability' && h2 === 'Рішення'; // фази — лише в загальній таблиці рішень вразливості
const flush = () => {
  if (!table) return;
  const where = h3 ? `${h2} → ${h3}` : h2;
  if (table === 'tech') {
    if (stepSection() && h3 && rows.length === 0) err(tableLine, `${where}: у кроці немає жодної техніки`);
    for (const r of rows) {
      const [tid, who, asIn] = r.cells;
      if (!/^T\d{4}(\.\d{3})?$/.test(tid)) { err(r.line, `${where}: «${tid}» — не ID техніки`); continue; }
      const parent = techs.get(tid.split('.')[0]);
      if (!parent) err(r.line, `${where}: техніки ${tid} немає в ATT&CK ${attack.version}${asIn ? '' : ' (якщо це ID з джерела — колонка «Як у джерелі»)'}`);
      else if (tid.includes('.') && !parent.subtechniques.some((s) => s.id === tid)) err(r.line, `${where}: підтехніки ${tid} немає в ATT&CK ${attack.version}`);
      else if (!described.has(parent.id)) err(r.line, `${where}: для ${parent.id} немає опису в content/attack/techniques`);
      if (!['джерело', 'редакція'].includes(who)) err(r.line, `${where}: «Хто зіставив» = джерело | редакція, а не «${who}»`);
      if (asIn && !/^T\d{4}(\.\d{3})?$/.test(asIn)) warn(r.line, `${where}: «Як у джерелі» «${asIn}» не схоже на ID ATT&CK`);
    }
  } else {
    const seen = new Set();
    if (rows.length === 0 && (type !== 'attack' || h3)) err(tableLine, `${where}: немає жодного рішення`);
    for (const r of rows) {
      const [cls, phase, who, why] = r.cells;
      if (!classes.has(cls)) err(r.line, `${where}: класу «${cls}» немає (дивись portfolio.md)`);
      if (phased() && !['find', 'protect', 'verify', 'detect'].includes(phase)) err(r.line, `${where}: фаза «${phase}» — find | protect | verify | detect`);
      if (!phased() && phase) warn(r.line, `${where}: фаза тут ігнорується (вона лише в загальній таблиці «Рішення» вразливості)`);
      const key = `${cls}/${phased() ? phase : ''}`;
      if (seen.has(key)) err(r.line, `${where}: клас «${cls}» повторюється в одному списку`);
      seen.add(key);
      if (!['джерело', 'редакція'].includes(who)) err(r.line, `${where}: «Хто» = джерело | редакція, а не «${who}»`);
      if (!why) err(r.line, `${where}: порожнє «Чому (why)» для ${cls}`);
      else if ((why.match(/[.!?](\s|$)/g) ?? []).length > 2) warn(r.line, `${where}: why для ${cls} довше двох речень`);
    }
  }
  table = null; rows = [];
};
const blocks = []; // кроки атаки й висновки звіту: які таблиці в них є
let claimsRows = 0, claimsNote = false, inClaims = false;
const ill = {};
lines.slice(offset).forEach((raw, i) => {
  const line = i + offset + 1, l = raw.trim();
  if (/^#{1,3} /.test(l)) { flush(); }
  if (l.startsWith('## ')) { h2 = l.slice(3).trim(); h3 = ''; headings.push(h2); inClaims = /^(Заяви й цифри|Цифри зі звіту)$/.test(h2); return; }
  if (l.startsWith('### ')) {
    h3 = l.slice(4).trim();
    if (stepSection() || (type === 'report' && h2 === 'Висновки')) blocks.push({ line, name: h3, step: stepSection(), finding: type === 'report', tech: false, sol: false, what: false, result: false, status: false, basis: false, risk: false });
    return;
  }
  if (l.startsWith('|')) {
    const cells = l.replace(/^\||\|$/g, '').split('|').map((c) => c.trim().replace(/^`|`$/g, ''));
    if (/^Хто зіставив$/.test(cells[1] ?? '')) { flush(); table = 'tech'; tableLine = line; if (h3 && blocks.length) blocks.at(-1).tech = true; return; }
    if (cells[0] === 'Клас' && cells[1] === 'Фаза') { flush(); table = 'sol'; tableLine = line; if (h3 && blocks.length) blocks.at(-1).sol = true; return; }
    if (cells.every((c) => /^:?-+:?$/.test(c))) return;
    if (table) { if (cells.some(Boolean)) rows.push({ line, cells }); return; }
    if (inClaims && cells[0] !== 'Значення' && cells[0]) claimsRows++;
    if (h2 === 'Хронологія' && cells[0] && cells[0] !== 'Дата' && !isoDate.test(cells[0])) err(line, `Хронологія: дата «${cells[0]}» — формат YYYY[-MM[-DD]]`);
    return;
  }
  if (table && l) flush();
  if (inClaims && /^Примітка:\s*\S/.test(l)) claimsNote = true;
  if (h3 && blocks.length && stepSection()) {
    if (/^Що відбувається:\s*\S/.test(l)) blocks.at(-1).what = true;
    if (/^Що отримує зловмисник:\s*\S/.test(l)) blocks.at(-1).result = true;
    const st = l.match(/^- Статус:\s*([^#\s]+)/);
    if (st) {
      blocks.at(-1).status = true;
      if (!['підтверджено', 'ймовірно'].includes(st[1])) err(line, `${h3}: «Статус» = підтверджено | ймовірно, а не «${st[1]}»`);
    }
  }
  if (h3 && blocks.length && blocks.at(-1).finding) {
    if (/^Що на кону:\s*\S/.test(l)) blocks.at(-1).risk = true;
    const bs = l.match(/^- Основа:\s*([^#]+?)\s*(#.*)?$/);
    if (bs) {
      blocks.at(-1).basis = true;
      if (!['дані звіту', 'рекомендація автора', 'наш висновок'].includes(bs[1])) err(line, `${h3}: «Основа» = дані звіту | рекомендація автора | наш висновок, а не «${bs[1]}»`);
    }
  }
  const step = l.match(/^- Етап:\s*(\S+)/);
  if (step && !tactics.has(step[1])) err(line, `${h3}: етапу «${step[1]}» немає (TA… з attack-v20.md)`);
  const m = h2 === 'Ілюстрація' && l.match(/^- (Вид|Файл|Alt|Підпис):\s*(.*?)\s*(#.*)?$/);
  if (m) ill[m[1]] = m[2].trim();
});
flush();

for (const b of blocks) {
  if (b.step && !b.tech) err(b.line, `${b.name}: немає таблиці технік`);
  if (b.step && !b.what) err(b.line, `${b.name}: немає «Що відбувається: …»`);
  if (b.step && !b.result) err(b.line, `${b.name}: немає «Що отримує зловмисник: …» (проміжний результат кроку)`);
  if (b.step && type === 'vulnerability' && !b.status) err(b.line, `${b.name}: немає «- Статус: підтверджено | ймовірно»`);
  if (b.finding && !b.basis) err(b.line, `${b.name}: немає «- Основа: дані звіту | рекомендація автора | наш висновок»`);
  if (b.finding && !b.risk) err(b.line, `${b.name}: немає «Що на кону: …» (ризик для компанії, де ця прогалина є)`);
  if (!b.sol) err(b.line, `${b.name}: немає таблиці рішень`);
}
if (type === 'attack' && headings.includes('Кроки') && !blocks.length) err(0, 'Кроки: немає жодного «### Крок N. …»');
const chainSteps = blocks.filter((b) => b.step).length;
if (type === 'vulnerability' && headings.includes('Ланцюжок атаки') && !chainSteps) err(0, 'Ланцюжок атаки: немає жодного «### Крок N. …»');
if (type === 'vulnerability' && chainSteps > 0 && chainSteps < 3) warn(0, `Ланцюжок атаки: лише ${chainSteps} крок(и) — зазвичай 4–7 (від пошуку вразливих систем до мети)`);
if (type === 'report' && headings.includes('Висновки') && !blocks.length) err(0, 'Висновки: немає жодного «### …»');

// ── Обов'язкові розділи ──
const need = {
  common: ['Коротко', 'Джерела', 'Питання до автора', 'Перевірка фактів'],
  vulnerability: ['Простими словами', 'Уражені версії', 'Наслідки', 'Ланцюжок атаки', 'Що робити', 'Бюлетені', 'Хронологія', 'Рішення', 'Техніки ATT&CK', 'Прогалини', 'Застереження', 'Ілюстрація'],
  attack: ['Простими словами', 'Заяви й цифри', 'Хто атакував', 'Кроки', 'Висновки', 'Застереження', 'Ілюстрація'],
  report: ['Про що звіт', 'Цифри зі звіту', 'Як отримано дані', 'Висновки', 'Прогалини', 'Питання до замовника', 'Застереження', 'Ілюстрація'],
};
for (const h of [...need.common, ...(need[type] ?? [])]) if (!headings.includes(h)) err(0, `немає розділу «## ${h}» (назва має збігатися дослівно)`);
if (!/^# \S/m.test(text.slice(fm[0].length))) err(0, 'немає заголовка «# …»');
if (claimsRows > 0 && type === 'attack' && !claimsNote) err(0, 'Заяви й цифри: є рядки, але немає «Примітка: …»');
if (headings.includes('Ілюстрація')) {
  // Ілюстрація обов'язкова в кожній статті: схема, коли є механіка, інакше образ.
  if (!['схема', 'образ'].includes(ill['Вид'])) err(0, `Ілюстрація: «Вид» = схема | образ, а не «${ill['Вид'] ?? ''}»`);
  if (!ill['Файл'] || ill['Файл'] === '—') err(0, 'Ілюстрація: немає «Файл» — ілюстрація потрібна в кожній статті (схема чи образ)');
  else if (!/^[a-z0-9-]+$/.test(ill['Файл'])) err(0, `Ілюстрація: файл «${ill['Файл']}» — латиниця малими, цифри, дефіси`);
  if (!ill['Alt']) err(0, 'Ілюстрація: порожній Alt');
  if (!ill['Підпис']) err(0, 'Ілюстрація: порожній Підпис (має назвати джерела ілюстрації)');
}
if (type === 'report') {
  const q = text.split('\n## Питання до замовника')[1]?.split('\n## ')[0] ?? '';
  const n = (q.match(/^\s*\d+\.\s+\S/gm) ?? []).filter((x) => !/^\s*\d+\.\s+—/.test(x)).length;
  if (headings.includes('Питання до замовника') && (n < 3 || n > 6)) warn(0, `Питання до замовника: ${n} — зазвичай 3–5`);
}
if (/\b(?:\d{1,3}\.){3}\d{1,3}\b/.test(text.replace(/\b\d+\.\d+\.\d+\.\d+\b(?=\s*\/)/g, ''))) warn(0, 'схоже на IP-адресу в тексті — IoC на сайт не переносимо (перевір, чи це не номер версії)');
if (/\b[a-f0-9]{32,64}\b/i.test(text)) warn(0, 'схоже на хеш у тексті — IoC на сайт не переносимо');

for (const w of warnings) console.log(`⚠ ${w}`);
for (const e of errors) console.log(`✗ ${e}`);
console.log(errors.length ? `\n${errors.length} помилок, ${warnings.length} попереджень` : `\nФормат брифу гаразд (${warnings.length} попереджень)`);
process.exit(errors.length ? 1 : 0);
