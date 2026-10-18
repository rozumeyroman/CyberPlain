import { defineCollection, reference } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Один запис — один JSON-файл; ID = ім'я файлу (TA0043, T1566.001, edr), регістр зберігаємо.
const fromDir = (base: string) =>
  glob({ pattern: '*.json', base, generateId: ({ entry }) => entry.replace(/\.json$/, '') });

const d3fendTactic = z.enum(['Model', 'Harden', 'Detect', 'Isolate', 'Deceive', 'Evict', 'Restore']);

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
  }),
});

const classes = defineCollection({
  loader: fromDir('./content/solutions/classes'),
  schema: z.object({
    ua: z.string(),
    en: z.string().optional(),
    simple: z.string().optional(),
    d3fend: z.array(d3fendTactic).default([]),
  }),
});

const products = defineCollection({
  loader: fromDir('./content/solutions/products'),
  schema: z.object({
    name: z.string(),
    vendor: z.string(),
    classes: z.array(reference('classes')).min(1),
    simple: z.string().optional(),
  }),
});

export const collections = { tactics, techniques, classes, products };
