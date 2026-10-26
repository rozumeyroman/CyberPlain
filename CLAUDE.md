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
  `worker/index.js` поки лише прокидає запити сторінок у статику, щоб вони були в Workers
  Logs (Observability); `/_astro/*` минає скрипт. Динаміку (пошук, AI у v1) додаємо туди ж.
- **D1** — не потрібна для MVP (контент статичний). Вводимо у v1 для карток виявлення
  та AI. Міграції — `migrations/`, застосовуються в команді деплою.
- **Деплой з GitHub через Workers Builds** (як в інших проєктах автора):
  push у `main` → прод; інші гілки → preview-URL. Build: `npm run build`,
  deploy: `npx wrangler deploy`. Секретів у репозиторії немає.
- Node LTS, TypeScript, `npm`. Перевіряй, що все збирається командою `npm run build`.

## Структура

```
site.config.ts            # назва, слоган, домен, вкладки, кольори, тексти авторства
wrangler.jsonc  worker/index.js
content/                  # наш контент (CC BY 4.0); 1 запис = 1 JSON, ім'я файлу = ID
  attack/intro.json       # тексти сторінки /mitre і дані джерела (версія — з імпорту)
  attack/tactics/TA0043.json      # етап: order, en, ua, short, analogy, solutionNotes{класID: текст}
  attack/techniques/T1595.json    # техніка: en, ua, tactics[], pain, simple, goal, analogy,
                                  #   quote, questions[], defenses[] (ID класів рішень),
                                  #   subs{"001": укр. назва підтехніки}
  solutions/classes/vm.json       # клас рішень: ua, en, simple, d3fend[] (ID технік D3FEND або назви тактик)
  d3fend/intro.json               # тексти сторінки /d3fend і дані джерела
  d3fend/tactics/harden.json      # тактика D3FEND (ID = англ. назва малими): ua, short, analogy
  d3fend/techniques/D3-AA.json    # категорія/техніка D3FEND: ua, simple, analogy (описані всі 271)
  solutions/products/rapid7-surface-command.json  # продукт: name, vendor, classes[], simple, url
  analytics/reports/picus-blue-report-2026.json   # звіт: kind, original{}, summary, body[], figures[], findings[{techniques[], solutions[]}], vulnerabilities[]
  analytics/vulnerabilities/php2shell.json        # вразливість: cves[], cvss, affected[], remediation[], timeline[], solutions[{phase}]
  analytics/attacks/datasuckers-atb.json          # атака: actor, victim, claims[], steps[{tactic, techniques[], solutions[]}], lessons[]
scripts/sitemap-lastmod.mjs # lastmod у sitemap: дата останнього коміту JSON сторінки та пов'язаних
                          #   (техніки етапу, класи продукту тощо); без git-історії lastmod не ставиться
data/mitre/               # згенеровані імпортом сирі дані MITRE (не редагувати руками)
  attack.json             # npm run import:attack (scripts/import-attack.mjs ← STIX mitre-attack/attack-stix-data)
  d3fend.json             # npm run import:d3fend (scripts/import-d3fend.mjs ← d3fend.mitre.org/api: matrix.json
                          #   + technique/d3f:<IRI>.json → attack[]: прямі зв'язки з ATT&CK Enterprise)
src/
  content.config.ts       # схеми колекцій і посилання між ними (reference)
  lib/data.ts             # loadData(): зв'язки, обчислення, перевірки; url.* — усі адреси сторінок
  layouts/Base.astro      # шапка з вкладками з site.config, футер з авторством
  components/             # TacticPage, TechniquePage, SolutionLinks, Translator, ...
  pages/index.astro                  # Home
  pages/mitre/index.astro            # змійка 15 етапів
  pages/mitre/[id].astro             # /mitre/TA0043/ — етап, /mitre/T1595/ — техніка
  pages/solutions/index.astro        # таблиця класів рішень
  pages/solutions/[id].astro         # /solutions/vm/ — клас, /solutions/rapid7-insightvm/ — продукт
  pages/vendors/index.astro          # вендори (з product.vendor) → розгортання до їхніх продуктів
  pages/pain/index.astro             # «Часта біль»: техніки з pain: true за етапами — цитата замовника,
                                     #   опис, перші 3 класи з defenses[]; якір /pain/#T1566
  pages/d3fend/index.astro           # 7 тактик D3FEND з категоріями
  pages/d3fend/[id].astro            # /d3fend/harden/ — тактика, /d3fend/D3-AA/ — категорія чи техніка
  pages/analytics/index.astro        # /analytics/ — вхід: три блоки з останніми записами
  pages/analytics/{reports,vulnerabilities,attacks}/index.astro  # списки карток
  pages/analytics/{reports,vulnerabilities,attacks}/[id].astro   # розбір запису (components: AnalyticsSolutions, TechRefs,
                                     #   AttackChain, AnalyticsCard, SourceList)
  pages/licenses.astro
  pages/favicon.svg.ts               # іконка з кольорів site.config; public/favicon.ico і
                                     #   apple-touch-icon.png — її растрові копії (перегенерувати при зміні)
  styles/tokens.css, base.css
design/                   # референсні макети (не код сайту, див. нижче)
LICENSE  LICENSE-CONTENT  NOTICE.md
```

Нова вкладка = запис у `site.config.ts → tabs` + папка `src/pages/[...lang]/<tab>/`. Шапка: Home · MITRE (ATT&CK, D3FEND, Часта біль) ·
Рішення (класи рішень, вендори) · Аналітика (звіти, вразливості, атаки); вкладка з `children` — випадаюче меню (`id`, пункти з `label`, `note`, `href`).

**Мови.** Українська — у корені (`/mitre/T1595/`), англійська — під `/en/` (`/en/mitre/T1595/`); сторінки лежать
в `src/pages/[...lang]/`, кожна з `getStaticPaths` на обидві мови (`langParams`/`routeLang` з `src/lib/i18n.ts`).
Тексти інтерфейсу — лише в `src/lib/i18n.ts` (`ui.uk`/`ui.en`, `plural`), назва/слоган/вкладки/футер — у
`site.config.ts` (`{ uk, en }`). Адреси — `url.*` з `pageCtx()`/`urlFor(lang)` у `data.ts`. Англійські тексти —
оверлей `content/en/<той самий шлях>/<той самий ID>.json` лише з перекладеними полями (`short`, `simple`, `goal`,
`analogy`, `quote`, `questions`, `solutionNotes`); інтро — повна копія `content/en/{attack,d3fend}/intro.json`,
ліцензії — `NOTICE.en.md`. Англійські назви — з MITRE (`en`), не з оверлеїв. `loadData(lang)` зупиняє збірку, якщо
оверлей без оригіналу, з ключем, якого немає в оригіналі, або з іншою довжиною `questions`/ключами `solutionNotes`;
відсутній переклад — поле порожнє («готується») і одне попередження зі статистикою.

Адреси — за ID, не за slug: етап `/mitre/TA0001/`, техніка `/mitre/T1566/`, підтехніка
`/mitre/T1566.001/`. Техніка має одну сторінку, навіть якщо входить у кілька етапів (у MITRE
так буває) — без дублікатів для Google. Рішення: `/solutions/<id>/`. Адреси будуються лише
через `url.*` з `src/lib/data.ts`. ID етапів і технік, класів і продуктів не повинні
збігатися — `loadData()` зупинить збірку.

## Модель контенту

Сирі поля MITRE (ID, англ. назви, тактики техніки, підтехніки) — з імпорту в `data/mitre/attack.json`
(ATT&CK Enterprise 20.0). Наш шар пояснень — у `content/`, ключується ID MITRE. `loadData()` зупиняє
збірку, якщо `en`, `order` етапу чи `tactics[]` техніки розходяться з імпортом; після нового імпорту
техніки без опису виводяться попередженням. Описані всі 227 технік; підтехніки окремих сторінок не
мають — на сторінці техніки список «Різновиди» (укр. назва з `subs` + посилання на attack.mitre.org).

**Зв'язки зберігаємо з одного боку, решту обчислюємо під час збирання:**
- техніка → етапи: `tactics[]`; список технік етапу обчислюється;
- техніка → класи рішень: `defenses[]` — **єдине місце** зв'язку з рішеннями;
- продукт → класи: `classes[]`; продукти класу обчислюються;
- вендори — не окремі файли: обчислюються з поля `vendor` продуктів (ID — назва малими з
  дефісами, `/vendors/#rapid7`). Назву вендора пиши однаково в усіх продуктах;
- таблиця «Чим захиститись на цьому етапі» = усі класи з `defenses[]` технік етапу,
  відсортовані за кількістю технік; текст «що робить» — `solutionNotes` етапу або `simple` класу;
- сторінка рішення показує техніки, які на нього посилаються (продукт — через свої класи).

**D3FEND.** Тактика → категорія (верхній рівень, напр. D3-AA Agent Authentication) → техніки
(можуть мати різновиди, D3-MFA). ID, англ. назви, визначення й ієрархія — з `data/mitre/d3fend.json`;
наш текст — у `content/d3fend/` (описані всі тактики, категорії й техніки; укр. назви робочі).
Зв'язок із рішеннями — **лише** `d3fend[]` класу: ID конкретних технік (`D3-MFA`), а назва тактики
(`Harden`) — лише якщо точної техніки немає. Мапимо явно, без успадкування: категорія в `d3fend[]`
не означає всіх її різновидів. Тактики класу обчислюються. Сторінка техніки показує класи,
зіставлені з нею або її різновидами; тактика — з будь-якою своєю технікою або з тактикою загалом.

**D3FEND ↔ ATT&CK** — офіційне зіставлення MITRE (`attack[]` в імпорті; підтехніки зводимо до
техніки, застарілі ID відкидаємо). Сторінка техніки D3FEND — «Від яких технік атаки захищає»
(разом із різновидами), сторінка техніки ATT&CK — «Захисні заходи D3FEND». Це зіставлення через
цифрові артефакти й дуже широке (бекап «захищає» від пошуку власника системи), тому в `defenses[]`
його автоматично не переносимо: `defenses[]` — практичний редакторський список рішень.

**Аналітика** (`/analytics/`, вкладка «Аналітика»: звіти, вразливості, атаки; 0 KB JS). Три колекції в `content/analytics/`
(`reports`, `vulnerabilities`, `attacks`), схеми — у `src/content.config.ts` (усі `.strict()`). ID записів унікальні в усіх
трьох колекціях (адреси `/analytics/<розділ>/<id>/`). Зв'язки зберігаємо з одного боку: звіт чи атака → `vulnerabilities[]`;
зворотний бік (`reportsAbout`, `attacksUsing`) і матриця «клас → кроки» (`classSteps`) обчислюються в `loadData()`.
- **Техніки** (`techniques[]`): рядок `"T1190"` = наше (редакторське) зіставлення, на сторінці з «*»; якщо джерело саме
  називає техніку — `{ "id": "T1190", "editorial": false }`; `asInSource` — як ID записаний у джерелі, коли в ATT&CK v20 його
  немає (T1562.003 → `T1690`, T1562.010 → `T1689`). Кожен ID (і підтехніка) перевіряється за `data/mitre/attack.json`; сторінка
  техніки — завжди батьківська.
- **Рішення**: `{ class, why, editorial }` — лише існуючі класи (`why` — до двох речень про конкретний висновок чи крок); `editorial: true`
  — клас додано нами, а не джерелом. Чого в портфелі немає (SAST, мікросегментація тощо) — у `gaps[]` текстом, нових класів не заводимо.
  У вразливості `solutions[].phase` = `find | protect | verify | detect`.
- **Дати** — `YYYY`, `YYYY-MM` або `YYYY-MM-DD`; `dateNote` — пояснення, коли дата неточна. Посилання (`url`) у `sources[]`,
  `original` і `advisories[]` — лише якщо вони є в самому джерелі. Заяви угруповання (`claims`) завжди з `claimsNote`.
- **Англійська**: обов'язковий оверлей `content/en/analytics/<розділ>/<той самий ID>.json` лише з текстовими полями (масиви тієї ж
  довжини, елементи об'єктів — лише перекладені ключі). `original.*`, `sources[]`, `advisories[]` не перекладаємо. `loadData('en')`
  зупиняє збірку, якщо немає оверлею, оверлей без оригіналу, ключ відсутній в оригіналі, довжини масивів різні або після злиття
  лишилась кирилиця поза `original` і `sources`. Англійські власні назви лишаються латиницею.
- Тон — як на решті сайту; звіти вендорів переказуємо своїми словами з посиланням на видавця, цифри — короткі й зі словами, що це
  дані вендора, а не незалежні вимірювання.

Неіснуючий ID у посиланні — помилка збирання (Astro `reference()` + перевірки в `loadData()`).
Порожні поля сторінки показують як «готується»; нічого не вигадуємо. Дані TA0043 перенесені з
макета `design/Tactic-TA0043.dc.html`, решта етапів написана за описами MITRE — чернетка, потребує
перевірки автором (укр. назви технік робочі).

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
  працює від 375px (ланцюжок тактик скролиться горизонтально).

Інтерактив без JS:
- **Підказки до термінів** (`Term.astro`): `<span class="term" tabindex="0">` +
  показ по `:hover` / `:focus-within`.
- **Перекладач термінів на Home**: приховані radio + `label` + `:checked ~` (як у макеті).
- **Випадаюче меню в шапці** (`Base.astro`): Popover API (`popovertarget`), закривається кліком поза ним і Esc;
  на десктопі — під вкладкою (CSS anchor positioning, без нього — смуга під шапкою), на мобільному — панель знизу.
- **Панель техніки** на сторінці тактики: нативний HTML Popover API
  (`popover` + `popovertarget`), а повна інформація — ще й на окремій сторінці техніки.
- **Фільтр «Усі / Часта біль»** і **«Просто / Технічно»**: radio + CSS.
- **Згортання** — `<details>`: секції рішень (`Fold.astro`, відкриті за замовчуванням), продукти в
  рядку таблиці (`SolutionLinks`), довгі списки ID D3FEND; на етапі ATT&CK видно 6 рішень з
  найбільшим покриттям, решта — «Показати ще». Текст «Що робить» ніколи не згортаємо.

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

Кожна сторінка сайту — за перевіркою Cloudflare (капча). Без перевірки пускаємо лише
пошукові боти (Google, Bing тощо), **AI-пошук** (ChatGPT Search, Perplexity, Claude — щоб
сайт знаходили й там) і боти прев'ю посилань. AI-навчання, AI-агенти, скрейпери й решта —
заборонені.

Як налаштовано (безкоштовний план, дашборд Cloudflare, зона `alestalab.top`):
- **Власний домен** `cyberplain.alestalab.top`; `workers_dev` і `preview_urls` вимкнені
  у `wrangler.jsonc`, бо на `*.workers.dev` WAF не діє.
- **WAF custom rule «Geography-based rule [Template]»** (перше, діє на всю зону) → **Block**:
  (континенти AS, SA, AF, Tor (`T1`), країни RU, BY) `and not cf.client.bot`. Виняток для
  верифікованих ботів обов'язковий: Googlebot часто приходить з IP, які геобаза відносить до
  Азії (TW), і без винятку Search Console не міг отримати sitemap.
- **WAF custom rule** → **Managed Challenge**, вираз:
  ```
  (http.host eq "cyberplain.alestalab.top"
   and not cf.client.bot
   and not (
     (http.user_agent contains "TelegramBot" and ip.src.asnum in {62041 59930 62014 211157 44907})
     or (http.user_agent contains "facebookexternalhit" and ip.src.asnum in {32934})
     or (http.user_agent contains "WhatsApp" and ip.src.asnum in {32934})
     or (http.user_agent contains "LinkedInBot" and ip.src.asnum in {14413 8075})
   ))
  ```
  `cf.client.bot` пропускає всіх верифікованих Cloudflare ботів; прев'ю — за UA **і** ASN,
  щоб UA не можна було підробити. ASN прев'ю з пам'яті — якщо прев'ю не працює, дивись
  ASN у Security → Events. Людина проходить перевірку раз, далі діє `cf_clearance`
  (Challenge Passage).
- **AI bot policies:** Search — Allow, Agent — Block, Training — **Disallow** (не Block!).
  З 15.09.2026 Training = Block блокує й змішаних ботів (пошук + навчання), зокрема **Googlebot**
  (правило «Block AI training crawlers», 403 на sitemap у Search Console). Disallow лишає
  `ai-train=no` і `Disallow` для GPTBot, ClaudeBot, CCBot, Google-Extended тощо в robots.txt
  і блокує чистих ботів навчання, але пропускає змішаних.
- **Precursor** увімкнено: може відкликати `cf_clearance` у підозрілих сесій.
- **Bot Fight Mode не вмикаємо:** на Free його не можна обійти правилами WAF.
- **robots.txt — керований Cloudflare** (`is_robots_txt_managed`, Bot Preference Sync).
  Генерується з AI bot policies: `Content-Signal: search=yes,ai-train=no,use=reference`,
  `User-agent: *` → `Allow: /`, `Disallow: /` для AI-навчання й AI-агентів. Вміст напряму не
  редагується; власного `public/robots.txt` немає (Cloudflare не дописав би його, а
  `Allow: /` у керованому блоці все одно переважає). Sitemap подаємо в Search Console /
  Bing Webmaster Tools. robots.txt — лише прохання.
- **Turnstile-віджет** (JS) — тільки на формах і динамічних запитах у v1 (повідомлення
  про помилку, AI-помічник), токен перевіряє Worker через `siteverify`. Сторінки
  контенту лишаються з 0 KB власного JS: сторінку перевірки віддає сам Cloudflare.
- Відомий наслідок: верифіковані SEO-краулери (Ahrefs, Semrush) теж проходять без
  перевірки, і керований robots.txt їх не забороняє.
- **Early Hints вимкнено** (зона): статиці не допомагає, а службові запити давали хибні 504
  в аналітиці зони.
- Налаштування WAF і ботів — у дашборді, не в репозиторії. Змінив там — онови цей розділ.

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

## Портфель рішень

На сайті пакети Rapid7 Command Platform, SentinelOne Singularity, Check Point Harmony Endpoint, Silverfort,
модулі SOCRadar XTI і продукти Segura, Dell PowerProtect Cyber Recovery, WAF Barracuda, F5, Imperva, Fortinet, платформа Picus, Palo Alto Networks Cortex XDR і XSIAM, Splunk Enterprise Security (рішення автора, жовтень 2026).
Класи продукту — за таблицями порівняння пакетів на сайті вендора (у `url` продукту), нічого понад них:

| Продукт | Класи |
|---|---|
| Surface Command | CAASM, EASM, SOAR |
| Exposure Command Essentials | + управління вразливостями |
| Exposure Command Ultimate | + CNAPP (хмара, контейнери, IaC, права доступу), DAST |
| Incident Command Essential | SIEM, UEBA, SOAR, CAASM, EASM, Threat Intelligence |
| Incident Command Advanced | + Deception |
| Incident Command Ultimate | + EDR, NDR, IDS, DFIR (Velociraptor) |
| Threat Command | моніторинг даркнету, захист бренду, кіберрозвідка (редакцій на сайті немає) |
| SentinelOne Singularity Complete | EDR (EPP + XDR), CWPP, контроль пристроїв і мережевий екран комп’ютера |
| SentinelOne Singularity Commercial | + ITDR |
| SentinelOne Singularity Enterprise | + DFIR (Forensic Data Collection) |
| Harmony Endpoint Advanced | VPN, EDR, контроль пристроїв і мережевий екран, DFIR, кіберрозвідка, захист браузера, пісочниця/CDR |
| Harmony Endpoint Complete | + шифрування дисків і флешок |
| Harmony Endpoint Elite | + управління вразливостями, DLP, SOAR (Playblocks) |
| Harmony Email (Email Only / Email & Collaboration) Advanced Protect | захист пошти, пісочниця/CDR, UEBA |
| Harmony Email … Complete Protect | + DLP |
| Harmony Email Security Awareness Training | навчання персоналу (add-on, окремий продукт) |
| CloudGuard WAF | WAF, захист від DDoS |
| Quantum Spark NGFW | NGFW/IPS, VPN |
| Quantum Spark NGTP | + кіберрозвідка (Anti-Bot, URL Filtering, антивірус за ThreatCloud) |
| Quantum Spark SNBT | + пісочниця, захист від фішингу (Zero Phishing) |
| Silverfort Core | ISPM, MFA |
| Silverfort Plus | + NHI (сервісні облікові записи) |
| Silverfort Advanced | + ITDR (разом з Authentication Firewall) |
| Silverfort Enterprise | + JIT (Privileged Access Security); Access Intelligence — лише в тексті |
| Barracuda Web Application Firewall | WAF, DAST (Vulnerability Remediation Service) |
| Barracuda WAF-as-a-Service Advanced | WAF, захист від DDoS, DAST |
| Barracuda WAF-as-a-Service Premium | + доступ без VPN (CloudGen Access) |
| F5 Distributed Cloud Services Essentials / Enterprise | WAF, захист від DDoS, DAST, EASM (класи однакові) |
| F5 WAF for BIG-IP | WAF |
| Imperva Cloud WAF, Imperva WAF Gateway | WAF |
| FortiWeb Standard | WAF, DAST (вбудований сканер) |
| FortiWeb Advanced / Enterprise | + пісочниця (FortiWeb Cloud Sandbox) |
| FortiAppSec Cloud WAF Standard | WAF, захист від DDoS |
| FortiAppSec Cloud WAF Advanced / Enterprise | + DAST, пісочниця |
| Picus Breach and Attack Simulation, Exposure Validation, Detection Rule Validation | BAS |
| Picus Autonomous Penetration Testing | автоматизований пентест |
| Picus Attack Surface Validation | CAASM |
| Picus Cloud Security Validation | CIEM, BAS |
| Cortex XDR Prevent | EDR, контроль пристроїв і мережевий екран комп’ютера, шифрування дисків |
| Cortex XDR Pro per Endpoint | ті самі класи (+ виявлення, розслідування, реагування — у тексті) |
| Cortex XSIAM NG-SIEM | SIEM, UEBA, SOAR, NDR |
| Cortex XSIAM Enterprise | + EDR, контроль пристроїв і мережевий екран, шифрування дисків, управління вразливостями |
| Cortex XSIAM Premium | + CNAPP, CWPP, CIEM, WAF, кіберрозвідка, EASM |
| Splunk Enterprise Security Essentials | SIEM, кіберрозвідка, CAASM |
| Splunk Enterprise Security Premier | + SOAR, UEBA, пісочниця |

Threat Command (Digital Risk Protection, ex-IntSights) — таблиці пакетів немає, класи за сторінкою продукту
й брифом Remediation Services. Модулі VRA і Third Party — окремі, не враховані.

InsightIDR (у всіх Incident Command) — готові виявлення з даташиту Pre-Built Detections: ABA/UBA-правила й
телеметрія агента Rapid7 (рядок «Rapid7 Agent» у таблиці пакетів) — це клас `siem`/`ueba`, не `edr` (без
реагування на хості). Пастки з даташиту рахуємо лише з Advanced (так у таблиці пакетів). «Account Leak»
(витік облікових даних у відкритий доступ) — не `dark-web`, лише в тексті.

SentinelOne (https://www.sentinelone.com/platform-packages/): класи `cwpp`, `device-control`, `itdr`
заведено під ці пакети. CWPP — не CNAPP (без CSPM/IaC). ITDR у пакеті — виявлення й реагування;
пастки Singularity Identity (Identity Deception) і ISPM у таблиці пакетів не названі — `deception` не
ставимо. Network Discovery (Enterprise) — інвентаризація мережі агентами, не CAASM: лише в тексті.
Purple AI, AI SOC-аналітик, Managed Threat Hunting, MDR — сервіси/AI, не класи; add-on не рахуємо.

Harmony Endpoint (https://sc1.checkpoint.com/uc/pdf/Har_EP_Pricing_Packages.pdf): лише чинні редакції Advanced,
Complete, Elite; Data Protection і Basic (Prevent) не продаються — не додаємо (рішення автора). Класи `browser-protection`,
`sandbox`, `encryption` заведено під Harmony. «Forensic collection» — `dfir` (як Forensic Data Collection у SentinelOne);
«Threat Cloud» + «IOC Management» (розділ Threat Intelligence таблиці) — `ti`; Firewall + Port Protection — `device-control`;
Posture Management — `vm`; Endpoint XDR — `edr` уже є, Infinity Playblocks — `soar`. Application Control, Endpoint Compliance —
лише в тексті. Posture Management, DLP і XDR в Advanced/Complete — add-on, класом не рахуємо.

Harmony Email & Collaboration (https://www.checkpoint.com/harmony/email-security/plans-and-packages/): 4 продукти —
обсяг Email Only (M365, Gmail) або Email & Collaboration (+ Teams, файлові сховища, Slack) × Advanced / Complete Protect.
«Account takeover prevention (anomalies)» — `ueba`; Sandboxing + CDR — `sandbox`; Shadow IT — лише в тексті. Add-on
(Archiving, IRaaS, DMARC, Leaked Credentials, SSPM, Browse) класом не рахуємо; Security Awareness Training (AI Phishing
Training) — окремий продукт `checkpoint-harmony-email-sat` з класом `awareness` (рішення автора).

CloudGuard WAF (https://www.checkpoint.com/cloudguard/waf/): редакцій немає — ліцензія за обсягом запитів
(окремо, у складі CloudGuard Workloads або PAYG), тому один продукт. DDoS Protection — функція WAF-as-a-Service, рахуємо
`ddos`. GenAI-захист (ін’єкції в промпти) і API Discovery — у межах `waf`; `waf` доповнено D3-APCA.

Quantum Spark (https://www.checkpoint.com/downloads/products/quantum-spark-2500-datasheet.pdf): лінійка, не окремі моделі
(рішення автора); продукт = рівень підписки NGFW / NGTP / SNBT (таблиця Subscription Services). Anti-Bot, URL Filtering,
антивірус — блокування за репутацією ThreatCloud → `ti`; антиспам на шлюзі — не `email`, лише в тексті; Zero Phishing
на шлюзі — `browser-protection` (опис класу розширено: «у браузері або на шлюзі»). IoT, SD-WAN — лише в тексті.

Клас `vpn` (рішення автора): зашифрований тунель для віддалених працівників і між офісами; D3-ET перенесено з `ngfw`.
Є в усіх Quantum Spark і Harmony Endpoint (Remote Access VPN). Не плутати з `vpnless` (доступ без VPN). T1133 класу
`vpn` не ставимо — сам VPN-шлюз часто і є точкою входу.

Dell PowerProtect Cyber Recovery (сторінка продукту на dell.com; огляд Alesta — лише як вторинне джерело): редакцій
немає, один продукт — `backup` + `cyber-recovery` (клас заведено під нього: ізольоване незмінне сховище з перевіркою
цілісності). Cyber Detect (CyberSense) — частина рішення на сторінці Dell → D3-FCOA і T1565 у класі `cyber-recovery`.

Barracuda WAF (даташит https://assets.barracuda.com/assets/docs/dms/Barracuda_Web_Application_Firewall_DS_US_1-8_pdf.pdf):
апаратний/віртуальний пристрій — один продукт, моделі (360–1060) лише в тексті. Add-on (Advanced Bot Protection, Active DDoS
Prevention, Advanced Threat Protection) класом не рахуємо, тому без `ddos` (DDoS застосунку — у межах `waf`) і без `ueba`.
WAF-as-a-Service (https://www.barracuda.com/products/application-protection/waf-as-a-service/plans) — 2 продукти за планами
Advanced / Premium. Vulnerability Remediation Service (є в усіх; сканує сайти й закриває знайдене правилами WAF) — `dast`.
Unmetered DDoS (L3–7) — `ddos` в обох планах. Premium: ZTNA (ліцензії CloudGen Access) — `vpnless`; Privileged Account
Protection (поведінка входу у вебзастосунок) — не `ueba`, лише в тексті (рішення автора). Data Leak Prevention (маскування карток у
відповідях сайту) — не `dlp`; IP Reputation / Active Threat Intelligence — не `ti`; Client-Side Protection (CSP/SRI), CDN,
DNS Security, AAA (SAML, OIDC, JWT, MFA через RADIUS) — лише в тексті. `waf` доповнено D3-ITF і D3-CSPP.

F5 (https://www.f5.com/products/waf): родина «F5 WAF» — WAF for BIG-IP (ex-Advanced WAF; апарат/VM/хмара), WAF for Distributed Cloud
(SaaS), WAF for NGINX (ex-NGINX App Protect; не додано). Distributed Cloud — 2 продукти за пакетами Essentials / Enterprise
(https://www.f5.com/products/get-f5/compare): «External attack surface management» — `easm`, DAST — `dast`, L3–4 і L7 DDoS — `ddos`.
Add-on (Advanced Bot Protection, Routed DDoS, API discovery в Essentials) не рахуємо. Enterprise: malware detection — не `sandbox`,
Malicious User Detection — не `ueba`, Sensitive Data Masking — не `dlp`, Client-side protection — лише в тексті. BIG-IP: імпорт
результатів DAST — не `dast`; Behavioral DoS — у межах `waf`; IP Intelligence / Threat Campaigns — підписки, не `ti`.

Imperva (https://www.imperva.com/products/web-application-firewall-waf/): актуальні назви — Cloud WAF (SaaS), WAF Gateway (апарат/VM;
ex-SecureSphere), Elastic WAF (Kubernetes; не додано). Продаються в планах FlexProtect Pro / Plus / Premier (https://www.imperva.com/products/pricing/),
які змішують захист застосунків і даних, — тому продукти за WAF, а не за планами. DDoS Protection for Websites — add-on (у Premier
включено), Advanced Bot Protection, Client-Side Protection, RASP — лише Premier: `ddos` не ставимо, решта — лише в тексті.

Fortinet: FortiWeb Cloud перейменовано на **FortiAppSec Cloud** (з 1.12.2024; WAF + ABP + GSLB + Threat Analytics). Продукти за
ордеринг-гайдами: FortiWeb (апарат/VM, https://www.fortinet.com/content/dam/fortinet/assets/data-sheets/og-fortiweb.pdf) — бандли
Standard / Advanced / Enterprise; FortiAppSec Cloud WAF (https://www.fortinet.com/content/dam/fortinet/assets/data-sheets/og-fortiappsec.pdf) —
плани Standard / Advanced / Enterprise. Built-in Vulnerability Scanner FortiWeb і «DAST Scanning» FortiAppSec (з Advanced) — `dast`;
FortiWeb Cloud Sandbox / Sandboxing for File Uploads (з Advanced) — `sandbox`; L3–4 і L7 DDoS FortiAppSec (усі плани) — `ddos`
(у FortiWeb — лише DoS застосунку, у межах `waf`). DLP FortiWeb Enterprise — у вебвідповідях, не `dlp` (як Barracuda); IP reputation — не `ti`;
Credential Stuffing Defense, ABP, Client-Side Security, Threat Analytics, SOCaaS — лише в тексті.

Picus (https://www.picussecurity.com/autonomous-exposure-validation-platform; one-pager модулів і даташит ATT&CK від автора):
6 продуктів за модулями, назви — з сайту (жовтень 2026): Breach and Attack Simulation (ex-Security Control Validation, SCV),
Autonomous Penetration Testing (ex-Attack Path Validation, APV), Exposure Validation (EXV), Detection Rule Validation (DRV,
«powered by BAS»), Attack Surface Validation (ASV, «Easy-to-deploy CAASM» — `caasm`), Cloud Security Validation (CSV). Редакцій
і таблиці пакетів немає. Класи `bas` і `pentest` заведено під Picus: вони не захищають самі, а перевіряють захист, тому
`defenses[]` — лише техніки, які модулі імітують явно: `bas` — модулі атак SCV (фішинг T1566, завантаження шкідливих файлів T1105/T1204,
вебатаки T1190, URL-фільтрація T1189/T1071, експлуатація вразливостей T1203/T1210/T1068, викрадення даних T1041/T1048/T1567,
вимагачі T1486); `pentest` — сценарії APV (T1003, T1021, T1046, T1068, T1069, T1078, T1087, T1110, T1210, T1550, T1557, T1558).
D3FEND: `bas` — D3-SYSVA; `pentest` — D3-SYSVA, D3-NVA, D3-AM. EXV і DRV — `bas` (EXV проганяє TTP-ланцюжки CVE проти захисту;
не `vm` — сам не сканує). CSV: аудит налаштувань і симулятор IAM-політик — `ciem`, симуляція атак у AWS — `bas`; не `cnapp`
(без захисту робочих навантажень і контейнерів). AI Security Validation — частина BAS, лише в тексті.

Palo Alto Networks Cortex XDR (даташит https://www.paloaltonetworks.com/apps/pan/public/downloadResource?pagePath=/content/pan/en_US/resources/datasheets/cortex-xdr,
березень 2026, таблиця Licensing Options): 2 продукти — XDR Prevent і XDR Pro per Endpoint. Prevent — лише запобігання (NGAV: ML,
поведінковий захист, захист від експлойтів) + Endpoint Controls (Device control, host firewall — `device-control`; BitLocker/FileVault —
`encryption`); виявлення й реагування в ньому «—», але `edr` ставимо (рішення автора: блокування на агенті — як «EDR (EPP + XDR)» у SentinelOne).
Pro — ті самі класи (детектори, кейси, 100+ плейбуків, Live Terminal — у тексті). «Extended Detection Analytics (network, cloud, identity)» — аналітика підключених даних, не `ndr`
(Network Traffic Analysis за документацією 3.x — лише Pro per GB) і не `ueba` (поведінка користувачів — у add-on ITDR); плейбуки — не `soar`
(SOAR — у XSIAM). Add-on (Cloud Runtime Security, ITDR, Advanced Email Security, Host Insights, Forensics, DLP, Exposure Management, ASM,
MDR, MTH, XTH) класом не рахуємо; Mobile security, Cortex Agentic Assistant — лише в тексті. Pro per GB / Cloud per Host і нові назви
документації 5.x (Enterprise Runtime Security) не додано.

Cortex XSIAM (таблиця тарифів https://cortex-docs.paloaltonetworks.com/cortex-xsiam/learn-about-cortex-xsiam/cortex-xsiam-product-licenses;
даташит березня 2026 — лише опис): 3 продукти за тарифами NG-SIEM / Enterprise / Premium. NG-SIEM: Core Analytics, Automation, UEBA —
`siem`, `ueba`, `soar`; `ndr` — бо даташит називає NDR базовою можливістю платформи (аналітика журналів мережевих екранів і потоків,
власних сенсорів немає; у XDR Pro per Endpoint такого збору немає, тому там без `ndr`). Enterprise: агент XDR (Enterprise Runtime Security:
NGAV, Endpoint Controls) — `edr`, `device-control`, `encryption`; Host Insights (Vulnerability Management) — `vm`. Premium: Cloud Posture
Security (CSPM, CIEM, DSPM, безагентне сканування, ASPM, CI/CD) — `cnapp` + `ciem`; Cloud Runtime Security (CWP, CDR, WAAS) — `cwpp` +
`waf`; XTI і Threat Intel Management — `ti`; Attack Surface Management (інтернет-ресурси) — `easm`. Add-on у всіх тарифах (ITDR, Forensics,
Advanced Email Security, Exposure Management, DLP, Code Security) класом не рахуємо. CDR (аналітика хмарних журналів) — лише в тексті.
Старий тариф Enterprise Plus не додано.

Splunk Enterprise Security (https://www.splunk.com/en_us/products/enterprise-security.html, таблиця редакцій — там і на
https://help.splunk.com/en/splunk-enterprise-security-8/enterprise-security-editions; бриф ES — 2024, ще з SOAR за окремою підпискою): 2 продукти —
ES Essentials і ES Premier. Essentials: SIEM (RBA, 1 700+ виявлень, Detection Studio) — `siem`; Threat Intelligence Management — `ti`;
Exposure Analytics (безперервне виявлення активів і облікових записів із журналів, наповнює Asset & Identity) — `caasm`. Premier: + Splunk SOAR
— `soar`, UEBA — `ueba`, Automated Threat Analysis (Splunk Attack Analyzer: детонація файлів і посилань, лише хмара) — `sandbox`. AI Assistant
і AI-агенти — лише в тексті. Splunk Enterprise / Splunk Cloud Platform — платформа даних, на якій працює ES, окремим продуктом не додано.

Silverfort (https://www.silverfort.com/pricing/): класи `ispm`, `nhi` заведено під нього. Authentication
Firewall (сегментація доступу) — частина `itdr` (рішення автора); `itdr` доповнено D3-ST і D3-UAP. AI Agent Security — разом із NHI, лише в тексті; Identity Graph
& Inventory і Access Intelligence — не CAASM, лише в тексті. PAS (JIT і «огородження» без сейфа паролів) — не `pam`,
а клас `jit` (рішення автора).

Segura (https://segura.security/products/): основний продукт — PAM Core (одна ліцензія «все включено», без редакцій;
MySafe, менеджер паролів, входить до нього) — `pam` + `jit` + `password-manager`. Решта — окремі продукти, що
докуповуються до PAM Core; класи за сторінками модулів: Domum Remote Access — `pam` + `vpnless` (віддалений доступ без VPN; JIT
прибрано — рішення автора); Cloud IAM — `pam`;
DevOps Secret Manager — `secrets`; Certificate Manager — `clm`; EPM — `epm`; Cloud Entitlements — `ciem` (класи
`secrets`, `clm`, `epm`, `ciem`, `password-manager`, `vpnless` заведено під Segura). Segura Appliance — апаратна платформа для
PAM, не додаємо. «ITDR» Segura — сторінка рішення з комбінації модулів (PAM, UEBA, CIEM, інтеграції з SIEM/SOAR),
не окремий продукт: `itdr` не ставимо.

SOCRadar (https://socradar.io/pricing/) — 5 модулів, кожна редакція окремим продуктом (`socradar-<модуль>-<редакція>`):

| Модуль | Редакції | Класи |
|---|---|---|
| Advanced Dark Web Monitoring | Essential, Business, Ultimate | `dark-web` |
| Cyber Threat Intelligence | Essential, Ultimate | `ti` |
| Attack Surface Management | Essential, Business, Ultimate | `easm` |
| Brand Protection | Essential; Business і Ultimate (+ `dark-web`) | `brand-protection` |
| Supply Chain Intelligence | одна ліцензія (`socradar-sci`) | `tprm` |

«Flexible» у таблиці SOCRadar = функція входить у редакцію, а її обсяг (домени, IP, інтеграції тощо)
ліцензується гнучко: рахуємо як включену (тому BP Ultimate має `dark-web`). Активне сканування вразливостей в ASM Ultimate — зовнішнє, не `vm`.
Відстеження постачальників у CTI — не `tprm`. Класи `dark-web`, `brand-protection`, `tprm` заведено під SOCRadar.

Усі класи, додані для повноти карти ATT&CK (`backup`, `pam`, `dlp`, `ddos`), уже мають продукти.
ABA (Attacker Behavior Analytics) — стара назва Detection Rule Library в SIEM Rapid7, окремим
класом не заводимо. Ransomware Prevention — у Ultimate, в Essential/Advanced за доплату (add-on не
рахуємо класом). Класи без продуктів лишаються, якщо на них
посилаються техніки ATT&CK. Опис продукту (`simple`) — самодостатній: без «усе з X плюс», щоб сейлу не треба було
відкривати інші сторінки. Нові продукти — лише за першоджерелом вендора;
де продукту немає — `[уточнити в портфелі]`.

## Як працювати

- Порядок роботи над контентом: тактики по черзі від TA0043 до TA0040.
- Перед великими змінами — короткий план. Автор працює сам: коміть і пуш одразу в `main` (`main` = прод), без окремих гілок і PR.
- Не вигадуй факти про MITRE чи продукти: бери з імпорту/першоджерел або питай автора.
- Автор може помилятися в термінах (напр. тактика/техніка) — уточнюй і поправляй, а не
  виконуй буквально.
- Після кожного етапу: `npm run build` без помилок, перевір сторінку на 375px і 1440px.
