// Імпорт MITRE ATT&CK Enterprise (STIX 2.1) у data/mitre/attack.json. Запуск: npm run import:attack [версія]
// Беремо лише сирі поля MITRE: ID, англійську назву, тактики, підтехніки, платформи. Наші тексти — у content/attack/.
import { writeFile } from 'node:fs/promises';

const BASE = 'https://raw.githubusercontent.com/mitre-attack/attack-stix-data/master';
const get = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url}: HTTP ${res.status}`);
  return res.json();
};

const index = await get(`${BASE}/index.json`);
const collection = index.collections.find((c) => c.name === 'Enterprise ATT&CK');
const wanted = process.argv[2];
const release = wanted ? collection.versions.find((v) => v.version === wanted) : collection.versions[0];
if (!release) throw new Error(`Версії ${wanted} немає в index.json`);
const bundle = await get(release.url);

const live = (o) => !o.revoked && !o.x_mitre_deprecated;
const extId = (o) => o.external_references?.find((r) => r.source_name === 'mitre-attack')?.external_id;
const objects = bundle.objects.filter(live);

const matrix = objects.find((o) => o.type === 'x-mitre-matrix');
const tacticByRef = new Map(objects.filter((o) => o.type === 'x-mitre-tactic').map((o) => [o.id, o]));
const tactics = matrix.tactic_refs.map((ref) => {
  const t = tacticByRef.get(ref);
  return { id: extId(t), en: t.name, shortname: t.x_mitre_shortname };
});
const tacticByShort = new Map(tactics.map((t) => [t.shortname, t.id]));

const patterns = objects.filter((o) => o.type === 'attack-pattern' && extId(o));
const item = (o) => ({
  id: extId(o),
  en: o.name,
  tactics: (o.kill_chain_phases ?? []).filter((p) => p.kill_chain_name === 'mitre-attack').map((p) => tacticByShort.get(p.phase_name)).filter(Boolean),
  platforms: o.x_mitre_platforms ?? [],
});
const subs = patterns.filter((o) => o.x_mitre_is_subtechnique).map(item);
const byId = (a, b) => a.id.localeCompare(b.id, 'en', { numeric: true });
const techniques = patterns
  .filter((o) => !o.x_mitre_is_subtechnique)
  .map((o) => {
    const t = item(o);
    return { ...t, subtechniques: subs.filter((s) => s.id.startsWith(`${t.id}.`)).sort(byId).map(({ id, en }) => ({ id, en })) };
  })
  .sort(byId);

const out = {
  source: release.url,
  version: release.version,
  modified: release.modified.slice(0, 10),
  tactics: tactics.map(({ id, en }) => ({ id, en })),
  techniques,
};
await writeFile(new URL('../data/mitre/attack.json', import.meta.url), JSON.stringify(out, null, 2) + '\n');
console.log(`ATT&CK ${out.version}: ${tactics.length} тактик, ${techniques.length} технік, ${subs.length} підтехнік`);
