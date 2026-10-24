import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Один запис — один JSON-файл; ID = ім'я файлу (TA0043, T1566.001, edr), регістр зберігаємо.
const fromDir = (base: string) =>
  glob({ pattern: '*.json', base, generateId: ({ entry }) => entry.replace(/\.json$/, '') });

const tactics = defineCollection({
  loader: fromDir('./content/attack/tactics'),
  schema: z.object({
    order: z.number().int(),
    en: z.string(),
    ua: z.string(),
    short: z.string(),
    analogy: z.string().optional(),
    // Що клас рішень робить саме на цьому етапі: { "vm": "..." }. Ключі перевіряє сторінка етапу.
    solutionNotes: z.record(z.string(), z.string()).optional(),
  }),
});

const techniques = defineCollection({
  loader: fromDir('./content/attack/techniques'),
  schema: z.object({
    en: z.string(),
    ua: z.string(),
    tactics: z.array(reference('tactics')).min(1),
    pain: z.boolean().default(false),
    simple: z.string(),
    goal: z.string().optional(), // чого домагається зловмисник
    analogy: z.string().optional(),
    quote: z.string().optional(),
    questions: z.array(z.string()).default([]),
    defenses: z.array(reference('classes')).default([]), // єдине місце зв'язку техніка → рішення
    // Українські назви підтехнік: { "001": "Лист із вкладенням" }. ID і англ. назви — з data/mitre/attack.json.
    subs: z.record(z.string(), z.string()).default({}),
  }),
});

const classes = defineCollection({
  loader: fromDir('./content/solutions/classes'),
  schema: z.object({
    ua: z.string(),
    en: z.string().optional(),
    simple: z.string().optional(),
    // D3FEND: ID технік (D3-MFA) або назви тактик (Harden), якщо точної техніки немає. Перевіряє loadData().
    d3fend: z.array(z.string()).default([]),
  }),
});

const products = defineCollection({
  loader: fromDir('./content/solutions/products'),
  schema: z.object({
    name: z.string(),
    vendor: z.string(),
    classes: z.array(reference('classes')).min(1),
    simple: z.string().optional(),
    url: z.string().url().optional(), // першоджерело: сторінка продукту чи пакетів у вендора
  }),
});

// D3FEND: сирі ID, назви, визначення й ієрархія — з data/mitre/d3fend.json; тут лише наш шар пояснень.
// ID тактики — англійська назва малими літерами (model), техніки — ID D3FEND (D3-MFA).
const d3fendTactics = defineCollection({
  loader: fromDir('./content/d3fend/tactics'),
  schema: z.object({
    ua: z.string(),
    short: z.string(),
    analogy: z.string().optional(),
  }),
});

const d3fendTechniques = defineCollection({
  loader: fromDir('./content/d3fend/techniques'),
  schema: z.object({
    ua: z.string().optional(),
    simple: z.string().optional(),
    analogy: z.string().optional(),
  }),
});

// ── Аналітика: звіти, вразливості, атаки (content/analytics/*) ──
// ID унікальні в усіх трьох колекціях (адреси /analytics/<розділ>/<id>/; перевіряє loadData()).
// Зв'язки зберігаємо з одного боку: звіт/атака → вразливість; зворотний бік обчислюється.
const isoDate = z.string().regex(/^\d{4}(-\d{2}(-\d{2})?)?$/);
const techId = z.string().regex(/^T\d{4}(\.\d{3})?$/);
// Рядок = редакторське зіставлення (на сторінці з «*»), якщо джерело саму техніку не називає.
// Якщо джерело називає ID — об'єкт { id, editorial: false }; asInSource — як ID записаний у джерелі (коли його немає в ATT&CK).
const techRef = z.union([
  techId,
  z.object({ id: techId, asInSource: z.string().optional(), editorial: z.boolean().optional() }).strict(),
]);
const source = z.object({ label: z.string(), url: z.string().url().optional() }).strict();
const solution = z.object({ class: reference('classes'), why: z.string(), editorial: z.boolean().default(false) }).strict();
const phase = z.enum(['find', 'protect', 'verify', 'detect']);
const figure = z.object({ value: z.string(), label: z.string() }).strict();
const original = z.object({ title: z.string(), publisher: z.string(), pages: z.number().int().positive().optional(), url: z.string().url().optional() }).strict();

const reports = defineCollection({
  loader: fromDir('./content/analytics/reports'),
  schema: z.object({
    title: z.string(),
    kind: z.enum(['report', 'brief', 'note']),
    original,
    date: isoDate,
    dateNote: z.string().optional(),
    summary: z.string(),
    body: z.array(z.string()).min(1),
    figures: z.array(figure).default([]),
    caveats: z.array(z.string()).default([]),
    findings: z.array(z.object({
      title: z.string(),
      text: z.string(),
      techniques: z.array(techRef).default([]),
      solutions: z.array(solution).min(1),
    }).strict()).min(1),
    gaps: z.array(z.string()).default([]),
    vulnerabilities: z.array(reference('vulnerabilities')).default([]),
    sources: z.array(source).default([]),
  }).strict(),
});

const vulnerabilities = defineCollection({
  loader: fromDir('./content/analytics/vulnerabilities'),
  schema: z.object({
    title: z.string(),
    cves: z.array(z.string().regex(/^CVE-\d{4}-\d{4,}$/)).min(1),
    cvss: z.object({ version: z.string(), score: z.number().min(0).max(10) }).strict().optional(),
    date: isoDate,
    exploitedSince: isoDate.optional(),
    summary: z.string(),
    description: z.array(z.string()),
    affected: z.array(z.object({ product: z.string(), versions: z.string(), fixed: z.string().optional(), note: z.string().optional() }).strict()).min(1),
    impact: z.array(z.string()),
    remediation: z.array(z.string()),
    advisories: z.array(z.object({ issuer: z.string(), label: z.string(), url: z.string().url().optional() }).strict()).default([]),
    timeline: z.array(z.object({ date: isoDate, text: z.string() }).strict()).default([]),
    caveats: z.array(z.string()).default([]),
    techniques: z.array(techRef).default([]),
    solutions: z.array(solution.extend({ phase }).strict()).min(1),
    gaps: z.array(z.string()).default([]),
    sources: z.array(source).default([]),
  }).strict(),
});

const attacks = defineCollection({
  loader: fromDir('./content/analytics/attacks'),
  schema: z.object({
    title: z.string(),
    date: isoDate,
    dateNote: z.string().optional(),
    original: original.optional(),
    actor: z.object({ name: z.string(), profile: z.array(z.string()) }).strict(),
    victim: z.object({ name: z.string(), sector: z.string(), country: z.string() }).strict(),
    summary: z.string(),
    body: z.array(z.string()),
    claims: z.array(figure).default([]),
    claimsNote: z.string().optional(),
    steps: z.array(z.object({
      title: z.string(),
      tactic: reference('tactics'),
      what: z.string(),
      tools: z.array(z.string()).default([]),
      techniques: z.array(techRef).min(1),
      solutions: z.array(solution).min(1), // why = як саме клас зупиняє або компенсує ЦЕЙ крок
      gaps: z.array(z.string()).default([]),
    }).strict()).min(1),
    lessons: z.array(z.string()).default([]),
    caveats: z.array(z.string()).default([]),
    vulnerabilities: z.array(reference('vulnerabilities')).default([]),
    sources: z.array(source).default([]),
  }).strict(),
});

// Англійський шар: content/en/<той самий шлях>/<той самий ID>.json лише з перекладеними полями.
// Ключі, яких немає в дозволеному списку, — помилка схеми (strict); зв'язок із джерелом перевіряє loadData().
const overlay = (dir: string, shape: z.ZodRawShape) =>
  defineCollection({ loader: fromDir(`./content/en/${dir}`), schema: z.object(shape).partial().strict() });

const str = z.string();
const enTactics = overlay('attack/tactics', { short: str, analogy: str, solutionNotes: z.record(z.string(), z.string()) });
const enTechniques = overlay('attack/techniques', { simple: str, goal: str, analogy: str, quote: str, questions: z.array(z.string()) });
const enClasses = overlay('solutions/classes', { simple: str });
const enProducts = overlay('solutions/products', { simple: str });
const enD3fendTactics = overlay('d3fend/tactics', { short: str, analogy: str });
const enD3fendTechniques = overlay('d3fend/techniques', { simple: str, analogy: str });

// Аналітика: лише текстові поля; масиви — тієї ж довжини й порядку, елементи об'єктів містять лише перекладені ключі.
// original.*, sources[] і advisories[] не перекладаємо.
const part = (shape: z.ZodRawShape) => z.object(shape).partial().strict();
const arr = (shape: z.ZodRawShape) => z.array(part(shape));
const strs = z.array(str);
const enReports = overlay('analytics/reports', {
  title: str, dateNote: str, summary: str, body: strs, figures: arr({ value: str, label: str }), caveats: strs,
  findings: arr({ title: str, text: str, solutions: arr({ why: str }) }), gaps: strs,
});
const enVulnerabilities = overlay('analytics/vulnerabilities', {
  title: str, summary: str, description: strs, affected: arr({ product: str, versions: str, fixed: str, note: str }),
  impact: strs, remediation: strs, timeline: arr({ text: str }), caveats: strs, solutions: arr({ why: str }), gaps: strs,
});
const enAttacks = overlay('analytics/attacks', {
  title: str, dateNote: str, summary: str, body: strs, claims: arr({ value: str, label: str }), claimsNote: str,
  actor: part({ name: str, profile: strs }), victim: part({ name: str, sector: str, country: str }),
  steps: arr({ title: str, what: str, tools: strs, solutions: arr({ why: str }), gaps: strs }),
  lessons: strs, caveats: strs,
});

export const collections = {
  tactics, techniques, classes, products, d3fendTactics, d3fendTechniques,
  enTactics, enTechniques, enClasses, enProducts, enD3fendTactics, enD3fendTechniques,
  reports, vulnerabilities, attacks, enReports, enVulnerabilities, enAttacks,
};
