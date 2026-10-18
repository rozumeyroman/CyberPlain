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

export const collections = { tactics, techniques, classes, products, d3fendTactics, d3fendTechniques };
