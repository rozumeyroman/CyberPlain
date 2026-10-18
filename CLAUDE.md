# CyberPlain — інструкції для Claude Code

## Що це за проєкт

CyberPlain — некомерційний сайт-«перекладач» кібербезпеки на людську мову. Пояснює
MITRE ATT&CK® (як діє зловмисник) і MITRE D3FEND™ (як захищатись) простими словами,
з аналогіями, питаннями до клієнта і класами рішень.

- **Аудиторія:** менеджери з продажу та всі, хто щодня не займається безпекою.
  Тон — дружній і поважний: «навіть фахівці користуються довідниками». Ніколи не
  поблажливий.
- **Мова інтерфейсу:** українська. Терміни MITRE лишаємо англійською поруч
  (`Розвідка · Reconnaissance`), ідентифікатори (TA0043, T1595, D3-MFA) завжди видно.
- **Автор:** Роман Розумей (github.com/rozumeyroman). Ентузіастський проєкт без бюджету.

## Жорсткі обмеження

1. **Лише безкоштовний Cloudflare (Workers Free).** Жодних платних API і сервісів.
   Vectorize не використовуємо. Ліміти: 100 000 запитів/день, 10 мс CPU на виклик;
   D1 — 5 млн читань і 100 000 записів рядків на день (з 1.09.2026 перевищення блокує
   запити); Workers AI — 10 000 нейронів/день.
2. **Легкі технології.** Де можна обійтись HTML+CSS — тільки HTML+CSS. На сторінках
   контенту клієнтський JavaScript за замовчуванням = 0 KB. Не тягнути React, UI-кіти,
   анімаційні бібліотеки, іконкові пакети (іконки — інлайн SVG).
3. **Назва не вшита в код.** Назва, слоган, домен, кольори, вкладки, тексти авторства —
   лише в `site.config.ts`. Перейменування сайту = зміна цього файлу + домену в
   `wrangler.jsonc`.
4. **Інтелектуальна власність** — див. розділ «Авторство і ліцензії». Без логотипів
   MITRE, без копіювання чужого дизайну.

## Стек і деплой

- **Astro** зі статичною збіркою (`output: 'static'`, без React/Vue-інтеграцій) —
  генерує чистий HTML+CSS з контенту в репозиторії.
- **Cloudflare Workers + Static Assets**: `wrangler.jsonc` з `assets.directory = ./dist`.
  Worker-скрипт додаємо лише коли з'явиться динаміка (пошук, AI-помічник у v1).
- **D1** — не потрібна для MVP (контент статичний). Вводимо у v1 для карток виявлення
  та AI. Міграції — `migrations/`, застосовуються в команді деплою.
- **Деплой з GitHub через Workers Builds** (як в інших проєктах автора):
  push у `main` → прод; інші гілки → preview-URL. Build: `npm run build`,
  deploy: `npx wrangler deploy`. Секретів у репозиторії немає.
- Node LTS, TypeScript, `npm`. Перевіряй, що все збирається командою `npm run build`.

## Структура

```
site.config.ts            # назва, слоган, домен, вкладки, кольори, тексти авторства
wrangler.jsonc
content/
  attack/
    tactics.json          # 15 тактик: id, en, ua, order, short (просте пояснення)
    techniques/TA0043.json# техніки тактики + наші пояснення (див. нижче)
  d3fend/tactics.json     # 7 тактик D3FEND з поясненнями
  solutions.json          # класи рішень → D3FEND-тактики → продукти (чернетка)
  glossary.json           # терміни для підказок
data/mitre/               # згенеровані імпортом сирі дані MITRE (не редагувати руками)
scripts/import-attack.mjs # STIX 2.1 з github.com/mitre-attack/attack-stix-data
src/
  layouts/Base.astro      # шапка з вкладками з site.config, футер з авторством
  components/             # Term.astro, TechniqueCard.astro, Translator.astro, ...
  pages/index.astro                       # Home
  pages/mitre/index.astro                 # ланцюжок 15 тактик
  pages/mitre/[tactic]/index.astro        # сторінка тактики
  pages/mitre/[tactic]/[technique].astro  # сторінка техніки
  pages/d3fend/index.astro
  pages/licenses.astro                    # повні тексти ліцензій
  styles/tokens.css, base.css
design/                   # референсні макети (не код сайту, див. нижче)
LICENSE  LICENSE-CONTENT  NOTICE.md
```

Нова вкладка = запис у `site.config.ts → tabs` + папка `src/pages/<tab>/`.

## Модель контенту

Сирі поля MITRE (назва, опис, підтехніки, URL) — з імпорту в `data/mitre/`.
Наш шар пояснень — у `content/`, ключується ID MITRE. Поля техніки:
`id, ua, en, pain (bool, «часта біль»), simple, analogy, quote (як каже клієнт),
questions[], defenses[] (посилання на solutions.json)`. Якщо техніка є в MITRE, але
пояснення ще немає — сторінка показує дані MITRE з позначкою «пояснення готується».

## Дизайн

Референс — `design/Home.dc.html` (лендінг) і `design/Tactic-TA0043.dc.html` (сторінка
тактики). Це макети у форматі дизайн-канвасу (`<x-dc>`, `{{holes}}`, `sc-for`), а не
код сайту: бери з них структуру, тексти, дані й стилі, але перепиши на Astro + CSS.
Натхнення — естетика oxide.computer (не копіювати): лаконічно, сітка з тонких ліній.

Токени (у `src/styles/tokens.css` як CSS-змінні, значення — з `site.config.ts`):

| Токен | Значення | Роль |
|---|---|---|
| `--bg` | `#1C1C1C` | тло (палітра сайту Алести) |
| `--surface` | `#242424` | картки, панелі |
| `--line` | `#333333` | тонкі розділювачі 1px |
| `--line-strong` | `#424242` | рамки контролів |
| `--text` | `#FFFFFF` | основний текст |
| `--text-2` | `#DADADA` | другорядний |
| `--muted` | `#ABABAB` | підписи (мін. для дрібного тексту — `#8C8C8C`) |
| `--defense` / accent | `#84B765`, hover `#A3CF87` | захист, кнопки, посилання, активна вкладка |
| `--attack` | `#B99CF2` | атака, ID технік ATT&CK, «часта біль» |

- Шрифти: **Onest** (текст, кирилиця) і **JetBrains Mono** (підписи UPPERCASE з
  letter-spacing .08em, ID). Google Fonts, `display=swap`.
- Радіуси 4–6px. Без тіней-карток, без градієнтних заливок кнопок.
- Декор лише CSS: сітка з точок (`radial-gradient` 16px), м'які зелена й фіолетова
  плями на першому екрані, «+» на кутах блоків через `::before/::after`.
- Кольори атака/захист однакові на всьому сайті й завжди підкріплені словами.
- Контраст тексту ≥ 4.5:1, фокус видно (`:focus-visible`), touch-цілі ≥ 44px,
  працює від 375px (вкладки й ланцюжок тактик скролляться горизонтально).

Інтерактив без JS:
- **Підказки до термінів** (`Term.astro`): `<span class="term" tabindex="0">` +
  показ по `:hover` / `:focus-within`.
- **Перекладач термінів на Home**: приховані radio + `label` + `:checked ~` (як у макеті).
- **Панель техніки** на сторінці тактики: нативний HTML Popover API
  (`popover` + `popovertarget`), а повна інформація — ще й на окремій сторінці техніки.
- **Фільтр «Усі / Часта біль»** і **«Просто / Технічно»**: radio + CSS.

Рішення щодо макетів (погоджено з автором):
- **Єдиний стиль — як у `Home.dc.html`.** Макет тактики місцями розходиться з
  правилами вище (тіні й підйом карток при hover, радіуси 8–20px, інша шапка й
  логотип) — це не переносимо. Hover = зміна кольору рамки (`--line` → accent).
- **Шапка, логотип і футер — з Home** для всіх сторінок.
- **З макета тактики беремо структуру й тексти:** ланцюжок 15 тактик, блок «Аналогія»,
  цитати замовника, сітка карток технік, блок «Для розмови з замовником» (чесна
  відповідь, питання з чекбоксами, класи рішень, «Чого не обіцяти»), дані технік.
- **Панель техніки** — Popover без JS; на мобільному виїжджає знизу, радіус ≤ 6px.
- **Пошук у шапці — не в MVP**, переноситься у v1 (потрібна динаміка).
- Кнопки «Створити картку виявлення» / «Передати архітектору» — v1, у MVP не показуємо.

## Захист від ботів і капча (вимога автора)

Кожна сторінка сайту — за перевіркою Cloudflare (капча). Із роботів дозволені **лише
пошукові боти** (Google, Bing тощо). AI-боти, краулери, скрейпери й усе інше — заборонено.

Як це робимо на безкоштовному плані:
- Сайт працює на **власному домені із зоною в Cloudflare** — на `*.workers.dev` WAF
  не діє, тож workers.dev-маршрут вимикаємо (`workers_dev: false` у `wrangler.jsonc`).
- **WAF custom rule** (на Free їх 5) на весь хост: якщо
  `not (cf.verified_bot_category eq "Search Engine Crawler")` → **Managed Challenge**.
  Так перевірку проходить кожна людина, а без неї — лише верифіковані пошукові боти.
  Людина розв'язує її раз, далі діє cookie `cf_clearance` (час — Challenge Passage).
- **Security → Bots → Block AI bots: «on all pages»** — додатково блокує AI-краулерів.
- **Bot Fight Mode не вмикаємо:** на Free його не можна обійти правилами WAF, тож він
  не дасть налаштувати винятки; правило вище вже закриває цю задачу.
- **`public/robots.txt`**: `Allow` лише пошуковим ботам (Googlebot, Bingbot, DuckDuckBot
  тощо), `Disallow: /` для `User-agent: *`, окремо `Disallow: /` для AI-токенів
  (`Google-Extended`, `Applebot-Extended`, `GPTBot`, `ClaudeBot`, `CCBot` тощо).
  robots.txt — лише прохання; блокує правило WAF.
- **Turnstile-віджет** (JS) — тільки на формах і динамічних запитах у v1 (повідомлення
  про помилку, AI-помічник), токен перевіряє Worker через `siteverify`. Сторінки
  контенту лишаються з 0 KB власного JS: сторінку перевірки віддає сам Cloudflare.
- Наслідок, про який знає автор: прев'ю посилань у месенджерах і соцмережах
  (Telegram, Facebook, LinkedIn) теж будуть заблоковані — це не пошукові боти.
- Налаштування WAF і бот-блокування робиться в дашборді Cloudflare, не в репозиторії —
  після змін перевір, що назви полів і опції досі доступні на Free.

## Авторство і ліцензії (обов'язково)

- `LICENSE` — MIT (код). `LICENSE-CONTENT` — CC BY 4.0 (наші тексти в `content/`).
- `NOTICE.md` і сторінка `/licenses` — копірайти й **повні тексти ліцензій MITRE**,
  взяті з першоджерел (не вигадувати текст):
  - ATT&CK: https://attack.mitre.org/resources/legal-and-branding/terms-of-use/ —
    рядок: «© 2026 The MITRE Corporation. This work is reproduced and distributed with
    the permission of The MITRE Corporation.»
  - D3FEND: https://d3fend.mitre.org/tou — «© 2025 The MITRE Corporation. Approved for
    Public Release; Distribution Unlimited #20-2338 and #23-1207.»
- Футер на кожній сторінці: незалежний проєкт, не пов'язаний із MITRE і не схвалений
  нею; ATT&CK® — зареєстрована ТМ, D3FEND™ — ТМ The MITRE Corporation; назви продуктів —
  ТМ власників; шрифти — SIL OFL 1.1. Готовий текст — у `design/Home.dc.html`.
- Біля кожної техніки/тактики — ID і посилання на оригінал на attack.mitre.org /
  d3fend.mitre.org.

## Довідка: 15 тактик ATT&CK Enterprise (v20, жовтень 2026)

TA0043 Reconnaissance — Розвідка · TA0042 Resource Development — Підготовка ресурсів ·
TA0001 Initial Access — Початковий доступ · TA0002 Execution — Виконання ·
TA0003 Persistence — Закріплення · TA0004 Privilege Escalation — Підвищення привілеїв ·
TA0005 Stealth — Приховування · TA0112 Defense Impairment — Виведення захисту з ладу ·
TA0006 Credential Access — Крадіжка облікових даних · TA0007 Discovery — Дослідження
мережі · TA0008 Lateral Movement — Переміщення мережею · TA0009 Collection — Збір даних ·
TA0011 Command and Control — Керування (C2) · TA0010 Exfiltration — Викрадення даних ·
TA0040 Impact — Удар.
Українські назви — робочі, автор може змінити. Список тактик бери з імпорту STIX,
а не з цього файлу, коли імпорт готовий.

D3FEND-тактики: Model, Harden, Detect, Isolate, Deceive, Evict, Restore.

## Портфель рішень (чернетка, потребує перевірки автором)

EDR/XDR (CrowdStrike Falcon, Trellix, Trend Micro, Rapid7 InsightIDR) · SIEM (Splunk,
Rapid7 InsightIDR) · управління вразливостями (Rapid7 InsightVM) · NGFW/WAF/пошта/MFA
(Fortinet: FortiGate, FortiWeb, FortiMail, FortiAuthenticator) · захист ідентичностей
(Silverfort) · OT (Nozomi Networks) · бекап і кібервідновлення (Dell PowerProtect Cyber
Recovery). Де продукту немає — `[уточнити в портфелі]`, нічого не вигадувати.

## Як працювати

- Порядок роботи над контентом: тактики по черзі від TA0043 до TA0040.
- Перед великими змінами — короткий план. Автор працює сам: коміть і пуш одразу в `main` (`main` = прод), без окремих гілок і PR.
- Не вигадуй факти про MITRE чи продукти: бери з імпорту/першоджерел або питай автора.
- Після кожного етапу: `npm run build` без помилок, перевір сторінку на 375px і 1440px.
