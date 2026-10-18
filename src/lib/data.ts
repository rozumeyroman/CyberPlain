import { getCollection, type CollectionEntry } from 'astro:content';
import attackRaw from '../../data/mitre/attack.json';
import d3fendRaw from '../../data/mitre/d3fend.json';

export type Tactic = CollectionEntry<'tactics'>;
export type Technique = CollectionEntry<'techniques'>;
export type SolutionClass = CollectionEntry<'classes'>;
export type Product = CollectionEntry<'products'>;

// Усі адреси сторінок будуються тільки тут.
export const url = {
  tactic: (id: string) => `/mitre/${id}/`,
  technique: (id: string) => `/mitre/${id}/`,
  solution: (id: string) => `/solutions/${id}/`,
  vendor: (id: string) => `/vendors/#${id}`,
  mitre: (id: string) =>
    id.startsWith('TA')
      ? `https://attack.mitre.org/tactics/${id}/`
      : `https://attack.mitre.org/techniques/${id.replace('.', '/')}/`,
  d3fendTactic: (id: string) => `/d3fend/${id}/`,
  d3fendTechnique: (id: string) => `/d3fend/${id}/`,
  d3fendOrig: (x: D3Tactic | D3Technique) => `https://d3fend.mitre.org/${'categories' in x ? 'tactic' : 'technique'}/d3f:${x.iri}/`,
};

// D3FEND: сирий запис імпорту + наш текст із content/d3fend/ (якщо є).
interface D3Raw { id: string; iri: string; en: string; definition: string; attack: string[]; children: D3Raw[] }
export interface D3Tactic {
  id: string; // model
  iri: string;
  en: string;
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
export interface Subtechnique { id: string; en: string; ua?: string }

export const d3fendSource = { version: d3fendRaw.version, releaseDate: d3fendRaw.releaseDate };

export interface StageSolution {
  cls: SolutionClass;
  products: Product[];
  techniques: Technique[];
  note?: string;
}

function assertUniqueIds(label: string, ...groups: { id: string }[][]) {
  const seen = new Set<string>();
  for (const e of groups.flat()) {
    if (seen.has(e.id)) throw new Error(`${label}: ID «${e.id}» зайнятий двічі — адреси сторінок зіткнуться`);
    seen.add(e.id);
  }
}

async function build() {
  const [tacticsRaw, techniques, classes, products, d3Tactics, d3Texts] = await Promise.all([
    getCollection('tactics'), getCollection('techniques'), getCollection('classes'), getCollection('products'),
    getCollection('d3fendTactics'), getCollection('d3fendTechniques'),
  ]);
  const tactics = tacticsRaw.sort((a, b) => a.data.order - b.data.order);
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
  if (pending.length) console.warn(`ATT&CK: без опису ${pending.length} технік — ${pending.map((t) => t.id).join(' ')}`);
  const subtechniquesOf = (t: Technique): Subtechnique[] =>
    rawTech.get(t.id)!.subtechniques.map((s) => ({ ...s, ua: t.data.subs[s.id.split('.')[1]] }));

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
      .sort((a, b) => b.techniques.length - a.techniques.length || a.cls.data.ua.localeCompare(b.cls.data.ua));
  };

  // ── D3FEND ──
  const techById = new Map(techniques.map((t) => [t.id, t]));
  const d3TacticText = new Map(d3Tactics.map((e) => [e.id, e.data]));
  const d3Text = new Map(d3Texts.map((e) => [e.id, e.data]));
  const d3byId = new Map<string, D3Technique>();
  const d3fendTactics: D3Tactic[] = d3fendRaw.tactics.map((raw, i) => {
    const tactic: D3Tactic = { id: raw.en.toLowerCase(), iri: raw.iri, en: raw.en, order: i + 1, ...d3TacticText.get(raw.en.toLowerCase()), categories: [], all: [] };
    const make = (r: D3Raw, depth: number, parent?: D3Technique): D3Technique => {
      // ID з D3FEND, яких немає в нашій версії ATT&CK (застарілі), відкидаємо; підтехніку зводимо до техніки.
      const attack = [...new Set(r.attack.map((id) => id.split('.')[0]))].flatMap((id) => techById.get(id) ?? []).sort(byName);
      const t: D3Technique = { id: r.id, iri: r.iri, en: r.en, definition: r.definition, ...d3Text.get(r.id), tactic, attack, parent, depth, children: [] };
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
      .sort((a, b) => b.techniques.length - a.techniques.length || a.cls.data.ua.localeCompare(b.cls.data.ua));
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

  return {
    vendors, vendorId,
    tactics, techniques, classes, products, classById, productsOf, techniquesOf, subtechniquesOf, techniquesDefendedBy, classesOf, tacticsOf, solutionsFor, byTactic,
    d3fendTactics, d3byId, d3fendOf, d3fendTacticsOf, d3fendSolutionsOfTechnique, d3fendSolutionsOfTactic, d3fendForAttack,
  };
}

let cache: ReturnType<typeof build> | undefined;
export const loadData = () => (cache ??= build());

export const num = (n: number) => String(n).padStart(2, '0');

// Відмінок після числа: plural(n, 'рішення', 'рішення', 'рішень') → «1 рішення», «3 рішення», «11 рішень».
export const plural = (n: number, one: string, few: string, many: string) => {
  const d = n % 10, h = n % 100;
  return `${n} ${d === 1 && h !== 11 ? one : d >= 2 && d <= 4 && (h < 12 || h > 14) ? few : many}`;
};
