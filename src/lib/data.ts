import { getCollection, type CollectionEntry } from 'astro:content';
import attackRaw from '../../data/mitre/attack.json';
import d3fendRaw from '../../data/mitre/d3fend.json';
import { langOf, localePath, plural, ui, type Lang } from './i18n';

// Запис колекції з локалізованою назвою (data.title) і текстами, яких у перекладі може не бути (K).
type Loc<E extends { data: object }, K extends keyof E['data'] = never> = Omit<E, 'data'> & {
  data: Omit<E['data'], K> & Partial<Pick<E['data'], K>> & { title: string };
};
export type Tactic = Loc<CollectionEntry<'tactics'>, 'short'>;
export type Technique = Loc<CollectionEntry<'techniques'>, 'simple'>;
export type SolutionClass = Loc<CollectionEntry<'classes'>>;
export type Product = Loc<CollectionEntry<'products'>>;

// Усі адреси сторінок будуються тільки тут; внутрішні — з префіксом мови (/en/…).
export const urlFor = (lang: Lang) => {
  const p = (path: string) => localePath(lang, path);
  return {
    page: p, // статичні сторінки: '/', '/mitre/', '/licenses/' …
    tactic: (id: string) => p(`/mitre/${id}/`),
    technique: (id: string) => p(`/mitre/${id}/`),
    solution: (id: string) => p(`/solutions/${id}/`),
    vendor: (id: string) => p(`/vendors/#${id}`),
    mitre: (id: string) =>
      id.startsWith('TA')
        ? `https://attack.mitre.org/tactics/${id}/`
        : `https://attack.mitre.org/techniques/${id.replace('.', '/')}/`,
    d3fendTactic: (id: string) => p(`/d3fend/${id}/`),
    d3fendTechnique: (id: string) => p(`/d3fend/${id}/`),
    analytics: p('/analytics/'),
    reports: p('/analytics/reports/'),
    report: (id: string) => p(`/analytics/reports/${id}/`),
    vulns: p('/analytics/vulnerabilities/'),
    vuln: (id: string) => p(`/analytics/vulnerabilities/${id}/`),
    attacks: p('/analytics/attacks/'),
    attack: (id: string) => p(`/analytics/attacks/${id}/`),
    d3fendOrig: (x: D3Tactic | D3Technique) => `https://d3fend.mitre.org/${'categories' in x ? 'tactic' : 'technique'}/d3f:${x.iri}/`,
  };
};

// D3FEND: сирий запис імпорту + наш текст із content/d3fend/ (якщо є).
interface D3Raw { id: string; iri: string; en: string; definition: string; attack: string[]; children: D3Raw[] }
export interface D3Tactic {
  id: string; // model
  iri: string;
  en: string;
  title: string; // назва для сторінки: uk — наша, en — MITRE
  order: number;
  ua?: string;
  short?: string;
  analogy?: string;
  categories: D3Technique[]; // верхній рівень технік тактики
  all: D3Technique[]; // усі техніки тактики, в порядку дерева
}
export interface D3Technique {
  id: string; // D3-MFA
  iri: string;
  en: string;
  definition: string;
  title: string;
  ua?: string;
  simple?: string;
  analogy?: string;
  tactic: D3Tactic;
  attack: Technique[]; // техніки ATT&CK, яким протидіє (за D3FEND; підтехніки зведені до техніки)
  parent?: D3Technique;
  children: D3Technique[];
  depth: number; // 0 — категорія
}
export const attackSource = { version: attackRaw.version, modified: attackRaw.modified };
export interface Subtechnique { id: string; en: string; ua?: string; title: string }

export const d3fendSource = { version: d3fendRaw.version, releaseDate: d3fendRaw.releaseDate };

export interface StageSolution {
  cls: SolutionClass;
  products: Product[];
  techniques: Technique[];
  note?: string;
}

// ── Аналітика ──
export type Phase = 'find' | 'protect' | 'verify' | 'detect';
export interface ASolution { cls: SolutionClass; products: Product[]; why: string; editorial: boolean; phase?: Phase }
// Посилання на техніку ATT&CK: сторінка — батьківська техніка; sub — підтехніка, якщо є.
export interface ATech {
  id: string; technique: Technique; sub?: Subtechnique; title: string;
  asInSource?: string; // як ID записаний у джерелі, якщо в ATT&CK його немає
  editorial: boolean; // зіставлення зробили ми (на сторінці з «*»)
}
export interface AFinding { title: string; text: string; techniques: ATech[]; solutions: ASolution[] }
export interface AStep {
  n: number; title: string; tactic: Tactic; what: string; tools: string[];
  techniques: ATech[]; solutions: ASolution[]; gaps: string[];
}
type Src = { label: string; url?: string };
type Fig = { value: string; label: string };
type Orig = { title: string; publisher: string; pages?: number; url?: string };
export interface AReport {
  id: string; title: string; kind: 'report' | 'brief' | 'note'; original: Orig; date: string; dateNote?: string;
  summary: string; body: string[]; figures: Fig[]; caveats: string[]; findings: AFinding[]; gaps: string[];
  vulnerabilities: AVuln[]; sources: Src[];
}
export interface AVuln {
  id: string; title: string; cves: string[]; cvss?: { version: string; score: number }; date: string; exploitedSince?: string;
  summary: string; description: string[];
  affected: { product: string; versions: string; fixed?: string; note?: string }[];
  impact: string[]; remediation: string[]; advisories: { issuer: string; label: string; url?: string }[];
  timeline: { date: string; text: string }[]; caveats: string[]; techniques: ATech[]; solutions: ASolution[];
  gaps: string[]; sources: Src[];
}
export interface AAttack {
  id: string; title: string; date: string; dateNote?: string; original?: Orig;
  actor: { name: string; profile: string[] }; victim: { name: string; sector: string; country: string };
  summary: string; body: string[]; claims: Fig[]; claimsNote?: string; steps: AStep[]; lessons: string[];
  caveats: string[]; vulnerabilities: AVuln[]; sources: Src[];
}

// Англійський оверлей поверх українського запису: рядок замінює рядок, масиви однакової довжини, ключі мають існувати в оригіналі.
function mergeEn(where: string, src: any, over: any): any {
  if (typeof over === 'string') {
    if (typeof src !== 'string') throw new Error(`${where}: переклад — рядок, а в оригіналі інший тип`);
    return over;
  }
  if (Array.isArray(over)) {
    if (!Array.isArray(src)) throw new Error(`${where}: переклад — масив, а в оригіналі ні`);
    if (src.length !== over.length) throw new Error(`${where}: у перекладі ${over.length} елементів, в оригіналі ${src.length}`);
    return src.map((x, i) => mergeEn(`${where}[${i}]`, x, over[i]));
  }
  if (over && typeof over === 'object') {
    if (!src || typeof src !== 'object' || Array.isArray(src)) throw new Error(`${where}: переклад — об'єкт, а в оригіналі інший тип`);
    const out: Record<string, any> = { ...src };
    for (const [k, v] of Object.entries(over)) {
      if (v === undefined) continue;
      if (!(k in src)) throw new Error(`${where}.${k}: цього поля немає в оригіналі`);
      out[k] = mergeEn(`${where}.${k}`, src[k], v);
    }
    return out;
  }
  throw new Error(`${where}: у перекладі можуть бути лише текстові поля`);
}

const CYRILLIC = /[Ѐ-ӿ]/;
function findCyrillic(v: unknown, path: string): string | undefined {
  if (typeof v === 'string') return CYRILLIC.test(v) ? `${path}: «${v.length > 60 ? v.slice(0, 60) + '…' : v}»` : undefined;
  if (Array.isArray(v)) for (let i = 0; i < v.length; i++) { const r = findCyrillic(v[i], `${path}[${i}]`); if (r) return r; }
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) { const r = findCyrillic(x, `${path}.${k}`); if (r) return r; }
  return undefined;
}

function assertUniqueIds(label: string, ...groups: { id: string }[][]) {
  const seen = new Set<string>();
  for (const e of groups.flat()) {
    if (seen.has(e.id)) throw new Error(`${label}: ID «${e.id}» зайнятий двічі — адреси сторінок зіткнуться`);
    seen.add(e.id);
  }
}

type Row = { id: string; data: Record<string, any> };
const hasText = (v: unknown) =>
  v === undefined ? false : Array.isArray(v) ? v.length > 0 : typeof v === 'object' ? Object.keys(v!).length > 0 : v !== '';

async function build(lang: Lang) {
  const [tacticsSrc, techniquesSrc, classesSrc, productsSrc, d3TacticsSrc, d3TextsSrc] = await Promise.all([
    getCollection('tactics'), getCollection('techniques'), getCollection('classes'), getCollection('products'),
    getCollection('d3fendTactics'), getCollection('d3fendTechniques'),
  ]);

  const [reportsSrc, vulnsSrc, attacksSrc] = await Promise.all([getCollection('reports'), getCollection('vulnerabilities'), getCollection('attacks')]);

  // ── Мовний шар: uk — як є; en — тексти з content/en/ замість українських (чого немає — undefined) ──
  const gaps: string[] = [];
  const localize = <E extends Row>(dir: string, src: E[], over: Row[], keys: readonly string[], title: (e: E) => string) => {
    if (lang === 'uk') return src.map((e) => ({ ...e, data: { ...e.data, title: title(e) } }));
    const overById = new Map(over.map((o) => [o.id, o]));
    const srcById = new Map(src.map((e) => [e.id, e]));
    for (const o of over) {
      const where = `content/en/${dir}/${o.id}.json`;
      const s = srcById.get(o.id);
      if (!s) throw new Error(`${where}: у content/${dir} немає запису ${o.id}`);
      for (const [k, v] of Object.entries(o.data)) {
        if (v !== undefined && !hasText(s.data[k])) throw new Error(`${where}: поле «${k}» є в перекладі, але немає в оригіналі`);
      }
      const { questions: q, solutionNotes: n } = o.data;
      if (q && q.length !== s.data.questions.length) throw new Error(`${where}: questions — ${q.length} пунктів, в оригіналі ${s.data.questions.length}`);
      if (n && Object.keys(n).sort().join() !== Object.keys(s.data.solutionNotes).sort().join()) throw new Error(`${where}: ключі solutionNotes не збігаються з оригіналом`);
    }
    const missing = src.filter((e) => keys.some((k) => hasText(e.data[k]) && !hasText(overById.get(e.id)?.data[k]))).length;
    if (missing) gaps.push(`${dir} ${missing}/${src.length}`);
    return src.map((e) => {
      const data: Record<string, any> = { ...e.data };
      for (const k of [...keys, 'ua']) delete data[k];
      for (const [k, v] of Object.entries(overById.get(e.id)?.data ?? {})) if (v !== undefined) data[k] = v;
      if ('questions' in e.data) data.questions ??= [];
      return { ...e, data: { ...data, title: title(e) } };
    });
  };
  const over = async (name: 'enTactics' | 'enTechniques' | 'enClasses' | 'enProducts' | 'enD3fendTactics' | 'enD3fendTechniques') =>
    lang === 'en' ? ((await getCollection(name)) as Row[]) : [];
  const [oTactics, oTechniques, oClasses, oProducts, oD3Tactics, oD3Techniques] = await Promise.all([
    over('enTactics'), over('enTechniques'), over('enClasses'), over('enProducts'), over('enD3fendTactics'), over('enD3fendTechniques'),
  ]);
  const pick = (uk: string | undefined, en: string) => (lang === 'en' ? en : uk ?? en);

  const tacticsAll = localize('attack/tactics', tacticsSrc, oTactics, ['short', 'analogy', 'solutionNotes'], (e) => pick(e.data.ua, e.data.en)) as unknown as Tactic[];
  const tactics = tacticsAll.sort((a, b) => a.data.order - b.data.order);
  const techniques = localize('attack/techniques', techniquesSrc, oTechniques, ['simple', 'goal', 'analogy', 'quote', 'questions'], (e) => pick(e.data.ua, e.data.en)) as unknown as Technique[];
  const classes = localize('solutions/classes', classesSrc, oClasses, ['simple'], (e) => pick(e.data.ua, e.data.en ?? e.data.ua)) as unknown as SolutionClass[];
  const products = localize('solutions/products', productsSrc, oProducts, ['simple'], (e) => e.data.name) as unknown as Product[];
  const d3Tactics = localize('d3fend/tactics', d3TacticsSrc, oD3Tactics, ['short', 'analogy'], () => '');
  const d3Texts = localize('d3fend/techniques', d3TextsSrc, oD3Techniques, ['simple', 'analogy'], () => '');
  if (gaps.length) console.warn(`EN: тексти без перекладу (записів) — ${gaps.join('; ')}`);
  // Тактики й техніки ділять /mitre/<id>/, класи й продукти — /solutions/<id>/.
  assertUniqueIds('mitre', tactics, techniques);
  assertUniqueIds('solutions', classes, products);

  // ── ATT&CK: наш шар має збігатися з імпортом (ID, англ. назви, порядок етапів, тактики техніки) ──
  const rawTech = new Map(attackRaw.techniques.map((t) => [t.id, t]));
  attackRaw.tactics.forEach((raw, i) => {
    const t = tactics.find((x) => x.id === raw.id);
    if (!t) throw new Error(`content/attack/tactics/${raw.id}.json: немає тексту для тактики ${raw.id} ${raw.en} з імпорту ATT&CK`);
    if (t.data.en !== raw.en || t.data.order !== i + 1) throw new Error(`${raw.id}.json: має бути en «${raw.en}», order ${i + 1} — як в імпорті ATT&CK`);
  });
  if (tactics.length !== attackRaw.tactics.length) throw new Error('content/attack/tactics: є тактики, яких немає в імпорті ATT&CK');
  for (const t of techniques) {
    const raw = rawTech.get(t.id);
    if (!raw) throw new Error(`content/attack/techniques/${t.id}.json: техніки немає в імпорті ATT&CK ${attackRaw.version}`);
    const ours = t.data.tactics.map((r) => r.id).sort().join(), theirs = [...raw.tactics].sort().join();
    if (t.data.en !== raw.en || ours !== theirs) throw new Error(`${t.id}.json: має бути en «${raw.en}», tactics [${theirs}] — як в імпорті ATT&CK`);
    for (const key of Object.keys(t.data.subs)) {
      if (!raw.subtechniques.some((s) => s.id === `${t.id}.${key}`)) throw new Error(`${t.id}.json → subs: підтехніки ${t.id}.${key} немає в імпорті`);
    }
  }
  const pending = attackRaw.techniques.filter((t) => !techniques.some((x) => x.id === t.id));
  if (pending.length && lang === 'uk') console.warn(`ATT&CK: без опису ${pending.length} технік — ${pending.map((t) => t.id).join(' ')}`);
  const subtechniquesOf = (t: Technique): Subtechnique[] =>
    rawTech.get(t.id)!.subtechniques.map((s) => {
      const ua = t.data.subs[s.id.split('.')[1]];
      return { ...s, ua, title: pick(ua, s.en) };
    });

  const classById = new Map(classes.map((c) => [c.id, c]));
  const byName = (a: Technique, b: Technique) => a.id.localeCompare(b.id);

  const productsOf = (classId: string) =>
    products.filter((p) => p.data.classes.some((c) => c.id === classId)).sort((a, b) => a.data.name.localeCompare(b.data.name));
  const techniquesOf = (tacticId: string) =>
    techniques.filter((t) => t.data.tactics.some((r) => r.id === tacticId)).sort(byName);
  const techniquesDefendedBy = (classId: string) =>
    techniques.filter((t) => t.data.defenses.some((r) => r.id === classId)).sort(byName);
  const classesOf = (t: Technique) => t.data.defenses.map((r) => classById.get(r.id)!);
  const tacticsOf = (t: Technique) => tactics.filter((ta) => t.data.tactics.some((r) => r.id === ta.id));

  // Техніки, розкладені по етапах у порядку атаки (для сторінок рішень).
  const byTactic = (list: Technique[]) =>
    tactics
      .map((tactic) => ({ tactic, techniques: list.filter((t) => t.data.tactics.some((r) => r.id === tactic.id)) }))
      .filter((g) => g.techniques.length > 0);

  // Рішення етапу = класи з defenses[] його технік; найкорисніші (більше технік) — першими.
  const solutionsFor = (tactic: Tactic): StageSolution[] => {
    const notes = tactic.data.solutionNotes ?? {};
    for (const key of Object.keys(notes)) {
      if (!classById.has(key)) throw new Error(`${tactic.id}.json → solutionNotes: класу рішень «${key}» немає`);
    }
    const own = techniquesOf(tactic.id);
    return classes
      .map((cls) => ({ cls, products: productsOf(cls.id), techniques: own.filter((t) => t.data.defenses.some((r) => r.id === cls.id)), note: notes[cls.id] }))
      .filter((s) => s.techniques.length > 0)
      .sort((a, b) => b.techniques.length - a.techniques.length || a.cls.data.title.localeCompare(b.cls.data.title));
  };

  // ── D3FEND ──
  const techById = new Map(techniques.map((t) => [t.id, t]));
  const d3TacticText = new Map(d3Tactics.map((e) => [e.id, e.data]));
  const d3Text = new Map(d3Texts.map((e) => [e.id, e.data]));
  const d3byId = new Map<string, D3Technique>();
  const d3fendTactics: D3Tactic[] = d3fendRaw.tactics.map((raw, i) => {
    const text = d3TacticText.get(raw.en.toLowerCase());
    const tactic: D3Tactic = { id: raw.en.toLowerCase(), iri: raw.iri, en: raw.en, order: i + 1, ...text, title: pick(text?.ua, raw.en), categories: [], all: [] };
    const make = (r: D3Raw, depth: number, parent?: D3Technique): D3Technique => {
      // ID з D3FEND, яких немає в нашій версії ATT&CK (застарілі), відкидаємо; підтехніку зводимо до техніки.
      const attack = [...new Set(r.attack.map((id) => id.split('.')[0]))].flatMap((id) => techById.get(id) ?? []).sort(byName);
      const text = d3Text.get(r.id);
      const t: D3Technique = { id: r.id, iri: r.iri, en: r.en, definition: r.definition, ...text, title: pick(text?.ua, r.en), tactic, attack, parent, depth, children: [] };
      d3byId.set(t.id, t);
      tactic.all.push(t);
      t.children = r.children.map((c) => make(c, depth + 1, t));
      return t;
    };
    tactic.categories = (raw.techniques as D3Raw[]).map((r) => make(r, 0));
    return tactic;
  });
  for (const id of d3TacticText.keys()) {
    if (!d3fendTactics.some((t) => t.id === id)) throw new Error(`content/d3fend/tactics/${id}.json: тактики D3FEND «${id}» немає в імпорті`);
  }
  for (const id of d3Text.keys()) {
    if (!d3byId.has(id)) throw new Error(`content/d3fend/techniques/${id}.json: техніки «${id}» немає в імпорті D3FEND`);
  }
  // /d3fend/<id>/ спільна для тактик і технік.
  assertUniqueIds('d3fend', d3fendTactics, [...d3byId.values()]);

  // Клас → D3FEND: d3fend[] містить ID технік або англійські назви тактик.
  const d3TacticByEn = new Map(d3fendTactics.map((t) => [t.en, t]));
  const d3ofClass = new Map(classes.map((cls) => {
    const techs: D3Technique[] = [], whole: D3Tactic[] = [];
    for (const ref of cls.data.d3fend) {
      const t = d3byId.get(ref), ta = d3TacticByEn.get(ref);
      if (t) techs.push(t);
      else if (ta) whole.push(ta);
      else throw new Error(`solutions/classes/${cls.id}.json → d3fend: «${ref}» — це не ID техніки й не тактика D3FEND`);
    }
    return [cls.id, { techniques: techs, wholeTactics: whole }];
  }));
  const d3fendOf = (cls: SolutionClass) => d3ofClass.get(cls.id)!;
  // Тактики класу в порядку D3FEND: явно вказані + тактики його технік.
  const d3fendTacticsOf = (cls: SolutionClass) => {
    const { techniques: ts, wholeTactics } = d3fendOf(cls);
    return d3fendTactics.filter((ta) => wholeTactics.includes(ta) || ts.some((t) => t.tactic === ta));
  };
  const d3subtree = (t: D3Technique): D3Technique[] => [t, ...t.children.flatMap(d3subtree)];
  // Рішення техніки D3FEND = класи, зіставлені з нею або з її різновидами.
  const solutionsForD3 = (scope: D3Technique[], tactic?: D3Tactic) =>
    classes
      .map((cls) => {
        const { techniques: ts, wholeTactics } = d3fendOf(cls);
        return { cls, products: productsOf(cls.id), techniques: ts.filter((t) => scope.includes(t)), whole: !!tactic && wholeTactics.includes(tactic) };
      })
      .filter((s) => s.techniques.length > 0 || s.whole)
      .sort((a, b) => b.techniques.length - a.techniques.length || a.cls.data.title.localeCompare(b.cls.data.title));
  const d3fendSolutionsOfTechnique = (t: D3Technique) => solutionsForD3(d3subtree(t));
  const d3fendSolutionsOfTactic = (ta: D3Tactic) => solutionsForD3(ta.all, ta);
  // Зворотний зв'язок: якими техніками D3FEND протидіють техніці ATT&CK.
  const d3all = [...d3byId.values()];
  const d3fendForAttack = (t: Technique) => d3all.filter((x) => x.attack.includes(t));

  // Вендори обчислюються з product.vendor; ID — назва малими літерами з дефісами (rapid7, sentinelone).
  const vendorId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const vendors = [...new Set(products.map((p) => p.data.vendor))]
    .map((name) => ({ id: vendorId(name), name, products: products.filter((p) => p.data.vendor === name).sort((a, b) => a.data.name.localeCompare(b.data.name)) }))
    .sort((a, b) => a.name.localeCompare(b.name));
  assertUniqueIds('vendors', vendors);


  // ── Аналітика: звіти, вразливості, атаки ──
  const tacticById = new Map(tactics.map((ta) => [ta.id, ta]));
  const withEn = async <E extends Row>(dir: string, src: E[], name: 'enReports' | 'enVulnerabilities' | 'enAttacks') => {
    if (lang === 'uk') return src.map((e) => ({ id: e.id, file: `content/analytics/${dir}/${e.id}.json`, data: e.data }));
    const over = (await getCollection(name)) as Row[];
    const srcIds = new Set(src.map((e) => e.id));
    for (const o of over) if (!srcIds.has(o.id)) throw new Error(`content/en/analytics/${dir}/${o.id}.json: у content/analytics/${dir} немає запису ${o.id}`);
    const byId = new Map(over.map((o) => [o.id, o]));
    return src.map((e) => {
      const file = `content/en/analytics/${dir}/${e.id}.json`;
      const o = byId.get(e.id);
      if (!o) throw new Error(`${file}: немає англійського перекладу запису ${e.id}`);
      const data = mergeEn(file, e.data, o.data);
      const { original: _o, sources: _s, ...rest } = data;
      const left = findCyrillic(rest, 'content');
      if (left) throw new Error(`${file}: після злиття лишився український текст — ${left}`);
      return { id: e.id, file, data };
    });
  };
  const [rSrc, vSrc, aSrc] = await Promise.all([
    withEn('reports', reportsSrc as Row[], 'enReports'),
    withEn('vulnerabilities', vulnsSrc as Row[], 'enVulnerabilities'),
    withEn('attacks', attacksSrc as Row[], 'enAttacks'),
  ]);
  assertUniqueIds('analytics', rSrc, vSrc, aSrc);

  const resolveSolutions = (file: string, where: string, list: any[]): ASolution[] => {
    const seen = new Set<string>();
    return list.map((s, i) => {
      const cls = classById.get(s.class.id);
      if (!cls) throw new Error(`${file} → ${where}[${i}]: класу рішень «${s.class.id}» немає`);
      const key = `${s.class.id}/${s.phase ?? ''}`;
      if (seen.has(key)) throw new Error(`${file} → ${where}[${i}]: клас «${s.class.id}» повторюється в одному списку`);
      seen.add(key);
      return { cls, products: productsOf(cls.id), why: s.why, editorial: !!s.editorial, phase: s.phase };
    });
  };
  const resolveTechs = (file: string, where: string, list: any[]): ATech[] =>
    list.map((r, i) => {
      const ref = typeof r === 'string' ? { id: r } : r;
      const at = `${file} → ${where}[${i}]`;
      const [parent] = ref.id.split('.');
      const raw = rawTech.get(parent);
      if (!raw) throw new Error(`${at}: техніки ${parent} немає в імпорті ATT&CK ${attackRaw.version} (якщо в джерелі інший ID — вкажіть asInSource)`);
      if (ref.id.includes('.') && !raw.subtechniques.some((x) => x.id === ref.id)) throw new Error(`${at}: підтехніки ${ref.id} немає в імпорті ATT&CK ${attackRaw.version}`);
      const technique = techById.get(parent);
      if (!technique) throw new Error(`${at}: для техніки ${parent} немає опису в content/attack/techniques`);
      const sub = ref.id.includes('.') ? subtechniquesOf(technique).find((x) => x.id === ref.id) : undefined;
      return {
        id: ref.id, technique, sub, title: sub ? sub.title : technique.data.title,
        asInSource: ref.asInSource, editorial: typeof r === 'string' ? true : r.editorial ?? false,
      };
    });
  const sortNew = <T extends { id: string; date: string }>(xs: T[]) => xs.sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id));
  const needNotes = (file: string, e: { claims: unknown[]; claimsNote?: string }) => {
    if (e.claims.length > 0 && !e.claimsNote) throw new Error(`${file}: є claims, але немає claimsNote`);
  };

  const vulnerabilitiesAll: AVuln[] = sortNew(vSrc.map(({ id, file, data: v }) => ({
    ...v, id,
    techniques: resolveTechs(file, 'techniques', v.techniques),
    solutions: resolveSolutions(file, 'solutions', v.solutions),
  })));
  const vulnById = new Map(vulnerabilitiesAll.map((v) => [v.id, v]));
  const resolveVulns = (file: string, refs: { id: string }[]) =>
    refs.map((r) => {
      const v = vulnById.get(r.id);
      if (!v) throw new Error(`${file} → vulnerabilities: запису «${r.id}» немає в content/analytics/vulnerabilities`);
      return v;
    });
  const reportsAll: AReport[] = sortNew(rSrc.map(({ id, file, data: r }) => ({
    ...r, id,
    findings: r.findings.map((f: any, i: number) => ({
      ...f,
      techniques: resolveTechs(file, `findings[${i}].techniques`, f.techniques),
      solutions: resolveSolutions(file, `findings[${i}].solutions`, f.solutions),
    })),
    vulnerabilities: resolveVulns(file, r.vulnerabilities),
  })));
  const attacksAll: AAttack[] = sortNew(aSrc.map(({ id, file, data: a }) => {
    needNotes(file, a);
    return {
      ...a, id,
      steps: a.steps.map((st: any, i: number): AStep => {
        const tactic = tacticById.get(st.tactic.id);
        if (!tactic) throw new Error(`${file} → steps[${i}].tactic: етапу «${st.tactic.id}» немає`);
        return {
          ...st, n: i + 1, tactic,
          techniques: resolveTechs(file, `steps[${i}].techniques`, st.techniques),
          solutions: resolveSolutions(file, `steps[${i}].solutions`, st.solutions),
        };
      }),
      vulnerabilities: resolveVulns(file, a.vulnerabilities),
    };
  }));
  const reportsAbout = (vulnId: string) => reportsAll.filter((r) => r.vulnerabilities.some((v) => v.id === vulnId));
  const attacksUsing = (vulnId: string) => attacksAll.filter((a) => a.vulnerabilities.some((v) => v.id === vulnId));
  // Клас рішень → кроки атаки, які він зупиняє (для матриці «клас → кроки»).
  const classSteps = (attack: AAttack) => {
    const m = new Map<string, { cls: SolutionClass; products: Product[]; steps: AStep[] }>();
    for (const st of attack.steps) for (const s of st.solutions) {
      if (!m.has(s.cls.id)) m.set(s.cls.id, { cls: s.cls, products: s.products, steps: [] });
      m.get(s.cls.id)!.steps.push(st);
    }
    return [...m.values()].sort((a, b) => b.steps.length - a.steps.length || a.cls.data.title.localeCompare(b.cls.data.title));
  };
  const analytics = { reports: reportsAll, vulnerabilities: vulnerabilitiesAll, attacks: attacksAll };

  return {
    analytics, reportsAbout, attacksUsing, classSteps,
    vendors, vendorId,
    tactics, techniques, classes, products, classById, productsOf, techniquesOf, subtechniquesOf, techniquesDefendedBy, classesOf, tacticsOf, solutionsFor, byTactic,
    d3fendTactics, d3byId, d3fendOf, d3fendTacticsOf, d3fendSolutionsOfTechnique, d3fendSolutionsOfTactic, d3fendForAttack,
  };
}

// Дані збираються окремо для кожної мови й кешуються.
const cache = new Map<Lang, ReturnType<typeof build>>();
export const loadData = (lang: Lang = 'uk') => {
  if (!cache.has(lang)) cache.set(lang, build(lang));
  return cache.get(lang)!;
};

// Усе, що потрібно сторінці чи компоненту: мова за адресою, тексти інтерфейсу, адреси, дані, відмінок.
export const pageCtx = async (u: URL) => {
  const lang = langOf(u);
  return { lang, t: ui[lang], url: urlFor(lang), d: await loadData(lang), pl: (n: number, forms: readonly string[]) => plural(lang, n, forms) };
};

// Вступні тексти сторінок /mitre/ і /d3fend/ (джерело + intro); en — з content/en/, без нього — українські з попередженням.
export interface Intro {
  source: { name: string; url: string; note: string };
  intro: {
    title: string; lead: string; body: string; sectionTitle: string; sectionLead: string; caveat: string;
    terms: { term: string; title: string; text: string }[];
    example: { label: string; id: string }[];
  };
}
const introFiles = import.meta.glob<Intro>(['/content/{attack,d3fend}/intro.json', '/content/en/{attack,d3fend}/intro.json'], { eager: true, import: 'default' });
const introWarned = new Set<string>();
export const introOf = (kind: 'attack' | 'd3fend', lang: Lang): Intro => {
  const uk = introFiles[`/content/${kind}/intro.json`];
  if (lang === 'uk') return uk;
  const en = introFiles[`/content/en/${kind}/intro.json`];
  if (!en) {
    if (!introWarned.has(kind)) console.warn(`EN: немає content/en/${kind}/intro.json — беремо українську версію`);
    introWarned.add(kind);
    return uk;
  }
  if (en.intro.terms.length !== uk.intro.terms.length || en.intro.example.length !== uk.intro.example.length)
    throw new Error(`content/en/${kind}/intro.json: terms/example мають збігатися за кількістю з content/${kind}/intro.json`);
  return en;
};

export const num = (n: number) => String(n).padStart(2, '0');
