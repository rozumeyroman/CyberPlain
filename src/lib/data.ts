import { getCollection, type CollectionEntry } from 'astro:content';

export type Tactic = CollectionEntry<'tactics'>;
export type Technique = CollectionEntry<'techniques'>;
export type SolutionClass = CollectionEntry<'classes'>;
export type Product = CollectionEntry<'products'>;

// Усі адреси сторінок будуються тільки тут.
export const url = {
  tactic: (id: string) => `/mitre/${id}/`,
  technique: (id: string) => `/mitre/${id}/`,
  solution: (id: string) => `/solutions/${id}/`,
  mitre: (id: string) =>
    id.startsWith('TA')
      ? `https://attack.mitre.org/tactics/${id}/`
      : `https://attack.mitre.org/techniques/${id.replace('.', '/')}/`,
};

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
  const [tacticsRaw, techniques, classes, products] = await Promise.all([
    getCollection('tactics'), getCollection('techniques'), getCollection('classes'), getCollection('products'),
  ]);
  const tactics = tacticsRaw.sort((a, b) => a.data.order - b.data.order);
  // Тактики й техніки ділять /mitre/<id>/, класи й продукти — /solutions/<id>/.
  assertUniqueIds('mitre', tactics, techniques);
  assertUniqueIds('solutions', classes, products);

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

  return { tactics, techniques, classes, products, classById, productsOf, techniquesOf, techniquesDefendedBy, classesOf, tacticsOf, solutionsFor, byTactic };
}

let cache: ReturnType<typeof build> | undefined;
export const loadData = () => (cache ??= build());

export const num = (n: number) => String(n).padStart(2, '0');
