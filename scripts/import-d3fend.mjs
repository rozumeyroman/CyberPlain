// Імпорт матриці MITRE D3FEND у data/mitre/d3fend.json. Запуск: npm run import:d3fend
// Беремо лише сирі поля MITRE: ID, англійську назву, визначення, ієрархію і зв'язки з ATT&CK
// (def_to_off з API кожної техніки — лише прямі, лише ATT&CK Enterprise). Наші тексти — у content/d3fend/.
import { writeFile } from 'node:fs/promises';

const API = 'https://d3fend.mitre.org/api';
const get = async (path) => {
  const res = await fetch(`${API}/${path}`);
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.json();
};

const [version, matrix] = await Promise.all([get('version.json'), get('matrix.json')]);
const slug = (iri) => iri.replace(/^d3f:/, '');
const int = (v) => Number(v?.['@value'] ?? 0);

// Вузол без d3fend-id (у 1.6.0 — «Particle Radiation Hardening») не має сторінки на d3fend.mitre.org — пропускаємо.
const technique = (n) =>
  n['d3f:d3fend-id']
    ? [{
        id: n['d3f:d3fend-id'],
        iri: slug(n['@id']),
        en: n['rdfs:label'],
        definition: n['d3f:definition'] ?? '',
        attack: [],
        children: (n.children ?? []).flatMap(technique),
      }]
    : [];

// Техніки ATT&CK, яким протидіє сама техніка D3FEND (без успадкованих від батьків і дітей).
const ENTERPRISE = 'http://d3fend.mitre.org/ontologies/d3fend.owl#ATTACKEnterpriseTechnique';
const attackOf = async (iri) => {
  const data = await get(`technique/d3f:${iri}.json`);
  const own = `http://d3fend.mitre.org/ontologies/d3fend.owl#${iri}`;
  const ids = data.def_to_off.results.bindings
    .filter((b) => b.def_tech?.value === own && b.framework_root_iri?.value === ENTERPRISE && b.off_tech_id)
    .map((b) => b.off_tech_id.value);
  return [...new Set(ids)].sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
};

const tactics = matrix
  .sort((a, b) => int(a['d3f:display-order']) - int(b['d3f:display-order']))
  .map((t) => ({ en: t['rdfs:label'], iri: slug(t['@id']), techniques: (t.children ?? []).flatMap(technique) }));

// Зв'язки з ATT&CK — по кілька запитів паралельно, щоб не навантажувати d3fend.mitre.org.
const all = [];
const walk = (t) => { all.push(t); t.children.forEach(walk); };
tactics.forEach((ta) => ta.techniques.forEach(walk));
for (let i = 0; i < all.length; i += 6) {
  await Promise.all(all.slice(i, i + 6).map(async (t) => { t.attack = await attackOf(t.iri); }));
}

const out = {
  source: 'https://d3fend.mitre.org/api/matrix.json',
  version: version.version,
  releaseDate: version.release_date.slice(0, 10),
  tactics,
};
await writeFile(new URL('../data/mitre/d3fend.json', import.meta.url), JSON.stringify(out, null, 2) + '\n');

const count = (list) => list.reduce((s, t) => s + 1 + count(t.children), 0);
console.log(`D3FEND ${out.version}: ${tactics.length} тактик, ${count(tactics.flatMap((t) => t.techniques))} технік, ${all.filter((t) => t.attack.length).length} зі зв'язками ATT&CK`);
