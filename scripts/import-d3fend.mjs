// Імпорт матриці MITRE D3FEND у data/mitre/d3fend.json. Запуск: npm run import:d3fend
// Беремо лише сирі поля MITRE: ID, англійську назву, визначення, ієрархію. Наші тексти — у content/d3fend/.
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
        children: (n.children ?? []).flatMap(technique),
      }]
    : [];

const tactics = matrix
  .sort((a, b) => int(a['d3f:display-order']) - int(b['d3f:display-order']))
  .map((t) => ({ en: t['rdfs:label'], iri: slug(t['@id']), techniques: (t.children ?? []).flatMap(technique) }));

const out = {
  source: 'https://d3fend.mitre.org/api/matrix.json',
  version: version.version,
  releaseDate: version.release_date.slice(0, 10),
  tactics,
};
await writeFile(new URL('../data/mitre/d3fend.json', import.meta.url), JSON.stringify(out, null, 2) + '\n');

const count = (list) => list.reduce((s, t) => s + 1 + count(t.children), 0);
console.log(`D3FEND ${out.version}: ${tactics.length} тактик, ${count(tactics.flatMap((t) => t.techniques))} технік`);
