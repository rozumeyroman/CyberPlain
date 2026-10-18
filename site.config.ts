// Усе, що стосується назви й вигляду сайту, — тільки тут.
const name = 'CyberPlain';
const repo = 'https://github.com/rozumeyroman/CyberPlain';

export const site = {
  name,
  tagline: 'кібербезпека простими словами',
  domain: 'cyberplain.alestalab.top', // разом із ним оновити routes у wrangler.jsonc
  repo,
  author: { name: 'Роман Розумей', url: 'https://github.com/rozumeyroman' },

  tabs: [
    { label: 'Home', href: '/' },
    { label: 'MITRE ATT&CK', href: '/mitre/' },
    { label: 'D3FEND', href: '/d3fend/' },
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
    links: [
      { label: 'Ліцензії та авторство', href: '/licenses/' },
      { label: 'Про проєкт', href: repo },
      { label: 'Повідомити про помилку', href: `${repo}/issues` },
    ],
    // HTML: статичний текст із цього файлу, не ввід користувача.
    notes: [
      `${name} — незалежний некомерційний проєкт. Він не пов’язаний із The MITRE Corporation і не схвалений нею. Пояснення простими словами — авторська адаптація; оригінальні визначення доступні за посиланнями біля кожного терміна.`,
      'Матеріали MITRE ATT&amp;CK®: © 2026 The MITRE Corporation. This work is reproduced and distributed with the permission of The MITRE Corporation. <a href="https://attack.mitre.org/resources/legal-and-branding/terms-of-use/">Умови використання ATT&amp;CK</a>.',
      'Матеріали MITRE D3FEND™: © 2025 The MITRE Corporation. Approved for Public Release; Distribution Unlimited #20-2338 and #23-1207. <a href="https://d3fend.mitre.org/tou">Умови використання D3FEND</a>.',
      'MITRE ATT&amp;CK® і ATT&amp;CK® — зареєстровані торговельні марки, а MITRE D3FEND™ — торговельна марка The MITRE Corporation. Назви продуктів і компаній — торговельні марки їхніх власників. Шрифти Onest і JetBrains Mono — SIL Open Font License 1.1.',
    ],
  },
};
