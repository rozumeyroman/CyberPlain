// Усе, що стосується назви й вигляду сайту, — тільки тут.
const name = 'CyberPlain';
const repo = 'https://github.com/rozumeyroman/CyberPlain';

export const site = {
  name,
  // Тексти, що залежать від мови, — об'єктами { uk, en }.
  tagline: { uk: 'кібербезпека простими словами', en: 'cybersecurity in plain language' },
  description: {
    uk: `${name} пояснює MITRE ATT&CK® і D3FEND™ простими словами: як діють зловмисники, чим це загрожує бізнесу і які рішення зупиняють атаку.`,
    en: `${name} explains MITRE ATT&CK® and D3FEND™ in plain language: how attackers operate, what it means for the business and which solutions stop an attack.`,
  },
  ogImage: '/og.png', // 1200×630; при зміні назви чи кольорів — перегенерувати
  domain: 'cyberplain.alestalab.top', // разом із ним оновити routes у wrangler.jsonc
  repo,
  author: { name: { uk: 'Роман Розумей', en: 'Roman Rozumey' }, url: 'https://github.com/rozumeyroman' },

  // href — без мовного префікса: його додає url.page() з src/lib/data.ts.
  // Вкладка з children — випадаюче меню (Popover без JS); note — підпис під пунктом меню.
  tabs: [
    { label: { uk: 'Home', en: 'Home' }, href: '/' },
    {
      id: 'mitre',
      label: { uk: 'MITRE', en: 'MITRE' },
      children: [
        { label: { uk: 'MITRE ATT&CK', en: 'MITRE ATT&CK' }, note: { uk: 'Як діє зловмисник: етапи й техніки атак', en: 'How attackers operate: stages and techniques' }, href: '/mitre/' },
        { label: { uk: 'MITRE D3FEND', en: 'MITRE D3FEND' }, note: { uk: 'Як захищатись: тактики й техніки захисту', en: 'How to defend: tactics and countermeasures' }, href: '/d3fend/' },
        { label: { uk: 'Часта біль', en: 'Common pain points' }, note: { uk: 'Типові скарги замовника і чим допомогти', en: 'Typical customer complaints and how to help' }, href: '/pain/' },
      ],
    },
    {
      id: 'solutions',
      label: { uk: 'Рішення', en: 'Solutions' },
      children: [
        { label: { uk: 'Класи рішень', en: 'Solution classes' }, note: { uk: 'Що робить кожен клас і від яких атак захищає', en: 'What each class does and which attacks it stops' }, href: '/solutions/' },
        { label: { uk: 'Вендори', en: 'Vendors' }, note: { uk: 'Виробники та їхні продукти', en: 'Vendors and their products' }, href: '/vendors/' },
      ],
    },
  ],

  // Стають CSS-змінними --<ключ> у Base.astro.
  colors: {
    bg: '#1C1C1C',
    surface: '#242424',
    line: '#333333',
    'line-strong': '#424242',
    'line-hover': '#555555',
    text: '#FFFFFF',
    'text-2': '#DADADA',
    muted: '#ABABAB',
    'muted-2': '#8C8C8C',
    defense: '#84B765',
    'defense-hover': '#A3CF87',
    attack: '#B99CF2',
    'attack-glow': '#7E4AD2',
  },

  footer: {
    // Внутрішні href (з «/») локалізуються через url.page(); зовнішні лишаються як є.
    links: [
      { label: { uk: 'Ліцензії та авторство', en: 'Licenses and credits' }, href: '/licenses/' },
      { label: { uk: 'Про проєкт', en: 'About the project' }, href: repo },
      { label: { uk: 'Повідомити про помилку', en: 'Report a problem' }, href: `${repo}/issues` },
    ],
    // HTML: статичний текст із цього файлу, не ввід користувача.
    notes: {
      uk: [
        `${name} — незалежний некомерційний проєкт. Він не пов’язаний із The MITRE Corporation і не схвалений нею. Пояснення простими словами — авторська адаптація; оригінальні визначення доступні за посиланнями біля кожного терміна.`,
        'Матеріали MITRE ATT&amp;CK®: © 2026 The MITRE Corporation. This work is reproduced and distributed with the permission of The MITRE Corporation. <a href="https://attack.mitre.org/resources/legal-and-branding/terms-of-use/">Умови використання ATT&amp;CK</a>.',
        'Матеріали MITRE D3FEND™: © 2025 The MITRE Corporation. Approved for Public Release; Distribution Unlimited #20-2338 and #23-1207. <a href="https://d3fend.mitre.org/tou">Умови використання D3FEND</a>.',
        'MITRE ATT&amp;CK® і ATT&amp;CK® — зареєстровані торговельні марки, а MITRE D3FEND™ — торговельна марка The MITRE Corporation. Назви продуктів і компаній — торговельні марки їхніх власників. Шрифти Onest і JetBrains Mono — SIL Open Font License 1.1.',
      ],
      en: [
        `${name} is an independent, non-commercial project. It is not affiliated with The MITRE Corporation and is not endorsed by it. The plain-language explanations are an original adaptation; the original definitions are available through the links next to each term.`,
        'MITRE ATT&amp;CK® materials: © 2026 The MITRE Corporation. This work is reproduced and distributed with the permission of The MITRE Corporation. <a href="https://attack.mitre.org/resources/legal-and-branding/terms-of-use/">ATT&amp;CK Terms of Use</a>.',
        'MITRE D3FEND™ materials: © 2025 The MITRE Corporation. Approved for Public Release; Distribution Unlimited #20-2338 and #23-1207. <a href="https://d3fend.mitre.org/tou">D3FEND Terms of Use</a>.',
        'MITRE ATT&amp;CK® and ATT&amp;CK® are registered trademarks, and MITRE D3FEND™ is a trademark, of The MITRE Corporation. Product and company names are trademarks of their respective owners. The Onest and JetBrains Mono fonts are licensed under the SIL Open Font License 1.1.',
      ],
    },
  },
};
