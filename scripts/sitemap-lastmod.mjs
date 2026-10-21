// lastmod для sitemap: дата останнього коміту файлів, з яких збирається сторінка
// (власний JSON + пов'язані: техніки етапу, класи продукту тощо). Без git — без lastmod.
// Англійська сторінка /en/x/ має ті самі файли + їхні переклади з content/en/ (і NOTICE.en.md для /en/licenses/).
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

function gitDates() {
  const dates = new Map(); // файл → найновіша дата коміту
  let out;
  try {
    out = execFileSync('git', ['log', '--format=@%cI', '--name-only', '--', 'content', 'content/en', 'data/mitre', 'NOTICE.md', 'NOTICE.en.md', ':(literal)src/pages/[...lang]/licenses.astro'], {
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    });
  } catch {
    return dates;
  }
  let date;
  for (const line of out.split('\n')) {
    if (line.startsWith('@')) date = line.slice(1);
    else if (line && !dates.has(line)) dates.set(line, date);
  }
  return dates;
}

const readDir = (dir) =>
  readdirSync(dir)
    .filter((f) => f.endsWith('.json'))
    .map((f) => ({ id: f.slice(0, -5), file: `${dir}/${f}`, data: JSON.parse(readFileSync(join(dir, f), 'utf8')) }));

export function buildLastmod() {
  const dates = gitDates();
  if (dates.size === 0) return new Map();
  const d = (files) => {
    const list = files.map((f) => dates.get(f)).filter(Boolean).sort();
    return list.at(-1);
  };
  const tactics = readDir('content/attack/tactics');
  const techniques = readDir('content/attack/techniques');
  const classes = readDir('content/solutions/classes');
  const products = readDir('content/solutions/products');
  const d3Tactics = readDir('content/d3fend/tactics');
  const d3Techniques = readDir('content/d3fend/techniques');
  const files = (xs) => xs.map((x) => x.file);
  const attackData = 'data/mitre/attack.json';
  const d3Data = 'data/mitre/d3fend.json';

  const map = new Map(); // шлях сторінки → дата
  const overlay = (f) => f.replace(/^content\//, 'content/en/'); // content/attack/… → content/en/attack/…
  const set = (path, list, enExtra = []) => {
    const v = d(list);
    if (v) map.set(path, v);
    const en = d([...list, ...list.filter((f) => f.startsWith('content/')).map(overlay), ...enExtra]);
    if (en) map.set(`/en${path}`, en);
  };

  for (const t of tactics)
    set(`/mitre/${t.id}/`, [t.file, attackData, ...files(techniques.filter((x) => x.data.tactics?.includes(t.id)))]);
  for (const t of techniques) set(`/mitre/${t.id}/`, [t.file, attackData, d3Data]);
  for (const c of classes) {
    const using = techniques.filter((x) => x.data.defenses?.includes(c.id));
    const prods = products.filter((p) => p.data.classes?.includes(c.id));
    set(`/solutions/${c.id}/`, [c.file, ...files(using), ...files(prods)]);
  }
  for (const p of products) {
    const cls = classes.filter((c) => p.data.classes?.includes(c.id));
    const using = techniques.filter((x) => x.data.defenses?.some((id) => p.data.classes?.includes(id)));
    set(`/solutions/${p.id}/`, [p.file, ...files(cls), ...files(using)]);
  }
  for (const t of d3Tactics) set(`/d3fend/${t.id}/`, [t.file, d3Data, ...files(classes)]);
  for (const t of d3Techniques)
    set(`/d3fend/${t.id}/`, [t.file, d3Data, ...files(classes.filter((c) => c.data.d3fend?.includes(t.id)))]);

  set('/mitre/', ['content/attack/intro.json', attackData, ...files(tactics)]);
  set('/d3fend/', ['content/d3fend/intro.json', d3Data, ...files(d3Tactics)]);
  set('/solutions/', [...files(classes), ...files(products), ...files(techniques)]);
  set('/vendors/', files(products));
  set('/', [...files(tactics), ...files(classes)]);
  set('/licenses/', ['NOTICE.md', 'src/pages/[...lang]/licenses.astro'], ['NOTICE.en.md']);
  return map;
}
