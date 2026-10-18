# CyberPlain

**Кібербезпека простими словами.** Некомерційний сайт-«перекладач», який пояснює
[MITRE ATT&CK®](https://attack.mitre.org) (як діє зловмисник) і
[MITRE D3FEND™](https://d3fend.mitre.org) (як захищатись) людською мовою: з аналогіями,
питаннями до клієнта й класами рішень.

Для менеджерів з продажу та всіх, хто щодня не займається безпекою. Сотні технік атак
не тримають у голові навіть фахівці — вони теж користуються довідниками.

## Статус

Ранній етап: є дизайн-макети в [`design/`](design/), каркас сайту ще не створено.

## Стек

- [Astro](https://astro.build), статична збірка — чистий HTML+CSS, 0 KB JS на сторінках контенту.
- Cloudflare Workers + Static Assets, безкоштовний план.
- Деплой з GitHub через Workers Builds: push у `main` → прод.
- Захист: перевірка Cloudflare на кожній сторінці; дозволені лише пошукові боти.

Збірка (коли з'явиться каркас):

```bash
npm install
npm run build
```

Правила роботи над проєктом — у [`CLAUDE.md`](CLAUDE.md).

## Ліцензії

- Код — [MIT](LICENSE).
- Наші тексти в `content/` — [CC BY 4.0](LICENSE-CONTENT).
- Матеріали MITRE ATT&CK® і D3FEND™ — за умовами MITRE, див. [NOTICE.md](NOTICE.md).

Незалежний проєкт, не пов'язаний із The MITRE Corporation і не схвалений нею.
ATT&CK® — зареєстрована торговельна марка, D3FEND™ — торговельна марка The MITRE Corporation.

## Автор

Роман Розумей — [github.com/rozumeyroman](https://github.com/rozumeyroman)
