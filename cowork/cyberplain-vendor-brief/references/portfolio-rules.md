<!-- Згенеровано scripts/cowork-skill.mjs з репозиторію CyberPlain. Не редагувати руками: npm run cowork:skill -->

# Правила портфеля (розділ «Портфель рішень» з CLAUDE.md)

Обов'язкові правила розмежування класів і рішення по кожному наявному вендору. Нового вендора класифікуй так само
суворо, а свій абзац «Рішення щодо класифікації» пиши в цьому ж стилі.


На сайті пакети Rapid7 Command Platform, SentinelOne Singularity, Check Point Harmony Endpoint, Silverfort,
модулі SOCRadar XTI і продукти Segura, Dell PowerProtect Cyber Recovery, WAF Barracuda, F5, Imperva, Fortinet, платформа Picus, Palo Alto Networks Cortex XDR, XSIAM, NGFW, Idira (identity security) і Next-Gen Trust Security, Splunk Enterprise Security, CrowdStrike Falcon, а також мережеві екрани, пошта, SIEM, SOAR,
захист кінцевих точок, пастки, CTEM і CNAPP Fortinet, платформа TrendAI Vision One і мережеві пристрої Trend Micro, безпека застосунків Black Duck, моніторинг дій і DLP Teramind, DLP Trellix (рішення автора, жовтень–листопад 2026).
Класи продукту — за таблицями порівняння пакетів на сайті вендора (у `url` продукту), нічого понад них:

| Продукт | Класи |
|---|---|
| Surface Command | CAASM, EASM, SOAR |
| Exposure Command Essentials | + управління вразливостями |
| Exposure Command Ultimate | + CNAPP (хмара, контейнери, IaC, права доступу), DAST |
| Incident Command Essential | SIEM, UEBA, SOAR, CAASM, EASM, Threat Intelligence |
| Incident Command Advanced | + Deception |
| Incident Command Ultimate | + EPP + EDR, NDR, IDS, DFIR (Velociraptor) |
| Threat Command | моніторинг даркнету, захист бренду, кіберрозвідка (редакцій на сайті немає) |
| SentinelOne Singularity Complete | EPP + EDR (XDR), CWPP, контроль пристроїв і мережевий екран комп’ютера |
| SentinelOne Singularity Commercial | + ITDR |
| SentinelOne Singularity Enterprise | + DFIR (Forensic Data Collection) |
| Harmony Endpoint Advanced | VPN, EPP + EDR, контроль пристроїв і мережевий екран, DFIR, кіберрозвідка (IOC Management), вебфільтрація, захист браузера, пісочниця/CDR |
| Harmony Endpoint Complete | + шифрування дисків і флешок |
| Harmony Endpoint Elite | + управління вразливостями, DLP, SOAR (Playblocks) |
| Harmony Email (Email Only / Email & Collaboration) Advanced Protect | захист пошти, пісочниця/CDR, UEBA |
| Harmony Email … Complete Protect | + DLP |
| Harmony Email Security Awareness Training | навчання персоналу (add-on, окремий продукт) |
| Harmony Mobile, Harmony Browse | захист браузера (Zero-Phishing), вебфільтрація, пісочниця |
| Workforce AI Security Essentials / Enterprise | DLP (вебзастосунки AI / + десктоп, асистенти коду, MCP) |
| External Risk Management Essential | EASM, захист бренду |
| External Risk Management Advanced / Complete / Elite | + моніторинг даркнету, кіберрозвідка, TPRM (класи однакові; Complete і Elite — з аналітиком) |
| Threat Exposure Management Essential / IoC Management | кіберрозвідка (керування IoC) |
| Threat Exposure Management Vulnerability Remediation / Complete | + управління вразливостями |
| CloudGuard WAF | WAF, захист від DDoS |
| Quantum Spark NGFW | NGFW/IPS, VPN |
| Quantum Spark NGTP | + вебфільтрація (Anti-Bot, URL Filtering; антивірус на шлюзі — у межах NGFW) |
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
| Cortex XDR Prevent | EPP, контроль пристроїв і мережевий екран комп’ютера, шифрування дисків |
| Cortex XDR Pro per Endpoint | + EDR |
| Cortex XSIAM NG-SIEM | SIEM, UEBA, SOAR, NDR |
| Cortex XSIAM Enterprise | + EPP + EDR, контроль пристроїв і мережевий екран, шифрування дисків, управління вразливостями |
| Cortex XSIAM Premium | + CNAPP, CWPP, CIEM, WAF, кіберрозвідка, EASM |
| Splunk Enterprise Security Essentials | SIEM, кіберрозвідка, CAASM |
| Splunk Enterprise Security Premier | + SOAR, UEBA |
| CrowdStrike Falcon Go | EPP, контроль пристроїв |
| CrowdStrike Falcon Pro | + мережевий екран комп’ютера |
| CrowdStrike Falcon Enterprise | + EDR |
| Palo Alto PA-Series, VM-Series (+ Precision AI NS bundle і Prisma Access Agent) | NGFW/IPS, пісочниця, захист браузера, вебфільтрація, VPN |
| Idira Privileged Access Manager SaaS / Self-Hosted | PAM, ITDR |
| Idira Secure Infrastructure Access | PAM, JIT |
| Idira Secure Cloud Access | JIT |
| Idira Vendor PAM | PAM, JIT, доступ без VPN, MFA |
| Idira Endpoint Privilege Manager | EPM |
| Idira Identity | MFA |
| Idira Secure Web Sessions | DLP |
| Idira Workforce Password Management | менеджер паролів |
| Idira Identity Governance | IGA |
| Idira Secrets Manager, SaaS / Self-Hosted, Secrets Hub, Credential Provider, Central Credential Provider | керування секретами |
| Idira Secure AI Agents | NHI, JIT |
| Palo Alto Networks Next-Gen Trust Security, Certificate Manager, Self-Hosted | CLM |
| FortiGate ATP | NGFW/IPS, пісочниця, VPN |
| FortiGate UTP | + вебфільтрація |
| FortiGate Enterprise Protection | + DLP (до UTP) |
| FortiMail Base Bundle (апарат/VM) | захист пошти, DLP |
| FortiMail Enterprise ATP Bundle | + пісочниця/CDR |
| FortiMail Cloud SaaS (Workspace Security) | захист пошти, пісочниця, UEBA |
| FortiMail Browser Security | захист браузера, вебфільтрація, пісочниця, DLP |
| FortiMail Collaboration Security | пісочниця |
| FortiSIEM | SIEM, UEBA, CAASM |
| FortiSIEM Cloud | + кіберрозвідка |
| FortiSOAR | SOAR |
| FortiEndpoint Zero Trust Connect | доступ без VPN (ZTNA), VPN, управління вразливостями, вебфільтрація |
| FortiEndpoint Protect Core | + EPP, пісочниця |
| FortiEndpoint Protect Plus / XDR / Complete | + EDR, DLP |
| FortiEndpoint Protect Data | + DLP (без EDR) |
| FortiDeceptor | пастки |
| FortiRecon EASM | EASM, управління вразливостями (IASM) |
| FortiRecon EASM and BP | + захист бренду |
| FortiRecon EASM, BP, and ACI | + моніторинг даркнету, кіберрозвідка, TPRM |
| FortiCNAPP | CNAPP, CWPP, CIEM |
| TrendAI Vision One Endpoint Security Core / Essentials | EPP (Core) / EPP + EDR (Essentials), контроль пристроїв і мережевий екран, DLP, вебфільтрація |
| TrendAI Vision One Endpoint Security Pro | + CWPP |
| TrendAI Vision One Email and Collaboration Security Core / Essentials / Pro | захист пошти, DLP, пісочниця, UEBA (класи однакові) |
| TrendAI Vision One CREM Core | CAASM, EASM, управління вразливостями, ISPM |
| TrendAI Vision One CREM Essentials | + навчання персоналу |
| TrendAI Vision One Cloud Risk Management | CNAPP, CIEM, EASM |
| TrendAI Vision One Container Security | CWPP |
| TrendAI Vision One Agentic SIEM | SIEM, SOAR |
| TrendAI Vision One XDR for Networks | NDR |
| TrendAI Vision One Identity Security | ITDR, ISPM, UEBA |
| TrendAI Vision One Data Security | DLP |
| TrendAI Vision One ZTSA Private Access / Internet Access | доступ без VPN / вебфільтрація |
| TrendAI Vision One Threat Intelligence, Sandbox Analysis, Forensics | кіберрозвідка, пісочниця, DFIR (по одному класу) |
| Trend Micro TippingPoint Threat Protection System | NGFW/IPS, вебфільтрація (репутація IP і URL) |
| Trend Micro Deep Discovery Inspector | NDR, IDS, пісочниця |
| Black Duck Polaris Platform | SAST, SCA, DAST |
| Black Duck Coverity Static Analysis | SAST |
| Black Duck SCA | SCA |
| Black Duck Continuous Dynamic, Seeker Interactive Analysis, Defensics Fuzz Testing | DAST (DAST / IAST / фазинг) |
| Black Duck Code Sight | SAST, SCA |
| Teramind UAM | UEBA |
| Teramind DLP | + DLP |
| Teramind Enterprise & Government | те саме (+ OCR, захоплення полів, професійні послуги) |
| Trellix DLP Endpoint Complete | DLP, контроль пристроїв (без мережевого екрана) |
| Trellix Device Control | контроль пристроїв (без мережевого екрана) |
| Trellix DLP Discover, DLP Network Prevent | DLP |
| Trellix DLP Network Monitor | DLP (лише виявлення) |

**EPP ≠ EDR, вебфільтрація ≠ кіберрозвідка (рішення автора, жовтень 2026); контроль пристроїв ≠ мережевий екран комп’ютера (листопад 2026).**
- `epp` — антивірус нового покоління (NGAV): блокує шкідливі файли, вимагачів, експлойти, безфайлові атаки до виконання. `edr` — постійний
  запис подій, виявлення, розслідування й реагування. Продукт лише з антивірусом (у таблиці вендора EDR «—») — `epp` без `edr`; продукт з EDR —
  `epp` + `edr` (усі EDR-пакети мають і запобігання). `defenses[]` `epp` — лише техніки, де запобігання справді спрацьовує (виконання шкідливого
  файлу, експлойти, ін’єкції, вимагачі й вайпери, крадіжка паролів із пам’яті, захист агента від вимкнення); дослідження мережі, збір даних —
  лише `edr`.
- `web-filtering` — вебфільтрація, DNS-захист і блокування за репутацією IP/URL/доменів (URL Filtering, Web Reputation, SWG, DNS Security,
  Anti-Bot/C2) на шлюзі, у хмарі чи агентом. `ti` — лише кіберрозвідка як продукт: стрічки IoC, профілі угруповань, звіти, TIP/керування
  індикаторами. Антивірус і репутація IP на шлюзі NGFW — у межах `ngfw`.
- `device-control` — лише зовнішні пристрої (флешки, диски, Bluetooth; D3-IOPR). `host-firewall` — мережевий екран на самому комп’ютері
  чи сервері (D3-ITF, D3-OTF; T1021, T1210, T1570 — переміщення між комп’ютерами). Продукт без мережевого екрана (Falcon Go, Trellix) —
  лише `device-control`.

Threat Command (Digital Risk Protection, ex-IntSights) — таблиці пакетів немає, класи за сторінкою продукту
й брифом Remediation Services. Модулі VRA і Third Party — окремі, не враховані.

InsightIDR (у всіх Incident Command) — готові виявлення з даташиту Pre-Built Detections: ABA/UBA-правила й
телеметрія агента Rapid7 (рядок «Rapid7 Agent» у таблиці пакетів) — це клас `siem`/`ueba`, не `edr` (без
реагування на хості). Пастки з даташиту рахуємо лише з Advanced (так у таблиці пакетів). «Account Leak»
(витік облікових даних у відкритий доступ) — не `dark-web`, лише в тексті.

SentinelOne (https://www.sentinelone.com/platform-packages/): класи `cwpp`, `device-control`, `host-firewall`, `itdr`
заведено під ці пакети. CWPP — не CNAPP (без CSPM/IaC). ITDR у пакеті — виявлення й реагування;
пастки Singularity Identity (Identity Deception) і ISPM у таблиці пакетів не названі — `deception` не
ставимо. Network Discovery (Enterprise) — інвентаризація мережі агентами, не CAASM: лише в тексті.
Purple AI, AI SOC-аналітик, Managed Threat Hunting, MDR — сервіси/AI, не класи; add-on не рахуємо.

Harmony Endpoint (https://sc1.checkpoint.com/uc/pdf/Har_EP_Pricing_Packages.pdf): лише чинні редакції Advanced,
Complete, Elite; Data Protection і Basic (Prevent) не продаються — не додаємо (рішення автора). Класи `browser-protection`,
`sandbox`, `encryption` заведено під Harmony. «Forensic collection» — `dfir` (як Forensic Data Collection у SentinelOne);
«Threat Cloud» + «IOC Management» (розділ Threat Intelligence таблиці) — `ti`; Port Protection — `device-control`, Firewall — `host-firewall`;
Posture Management — `vm`; Endpoint XDR — `edr` уже є, Infinity Playblocks — `soar`. Application Control, Endpoint Compliance —
лише в тексті. Posture Management, DLP і XDR в Advanced/Complete — add-on, класом не рахуємо.

Harmony Email & Collaboration (https://www.checkpoint.com/harmony/email-security/plans-and-packages/): 4 продукти —
обсяг Email Only (M365, Gmail) або Email & Collaboration (+ Teams, файлові сховища, Slack) × Advanced / Complete Protect.
«Account takeover prevention (anomalies)» — `ueba`; Sandboxing + CDR — `sandbox`; Shadow IT — лише в тексті. Add-on
(Archiving, IRaaS, DMARC, Leaked Credentials, SSPM, Browse) класом не рахуємо; Security Awareness Training (AI Phishing
Training) — окремий продукт `checkpoint-harmony-email-sat` з класом `awareness` (рішення автора).

Check Point, розширення (жовтень 2026, рішення автора): Harmony Mobile (бриф https://www.checkpoint.com/downloads/products/harmony-mobile-solution-brief.pdf;
Mobile Threat Defense) — Zero-Phishing — `browser-protection`, Safe Browsing / URL Filtering / Anti-Bot — `web-filtering`, хмарна пісочниця застосунків
і файлів — `sandbox`; блокування шкідливих застосунків — не `epp` (клас описує комп’ютери, мобільні техніки — поза ATT&CK Enterprise), CVE ОС,
захист від MitM, Conditional Access — лише в тексті. Harmony Browse (даташит) — `browser-protection`, `web-filtering`, `sandbox` (Sandbox + CDR).
Workforce AI Security (https://www.checkpoint.com/ai-security/ai-workforce-security/; описи редакцій — від автора, підтверджені admin guide):
Essentials (вебзастосунки AI) і Enterprise (+ десктоп, IDE-асистенти, агентні інструменти, MCP) — `dlp`. Exposure Management:
External Risk Management (ex-Cyberint; таблиця пакетів від автора + даташити EM_ERM_*_Package.pdf) — Essential: ASM — `easm`, Brand Protection — `brand-protection`;
Credentials & Account Takeover monitoring — не `dark-web` (як Account Leak у Rapid7), новини, звіти Check Point Research, пошук IoC — лише в тексті. Advanced /
Complete / Elite: + даркнет-джерела й витоки — `dark-web`, Global Threat Intelligence Knowledgebase — `ti`, Supply Chain Intelligence — `tprm`; керований
сервіс аналітика (Complete, Elite) — лише в тексті. Розбіжність: даташит Essential включає Social Media impersonation, таблиця автора — ні; на класи не
впливає. Threat Exposure Management (Exposure Prioritization & Remediation, ex-Veriti; даташити EM-TEM-*.pdf, назви пакетів — з таблиці автора): керування
IoC (вручну, між засобами захисту, зі стрічок) — `ti`; Vulnerability Prioritization and Remediation (оновлення й віртуальні латки) — `vm` (Vulnerability
Remediation, Complete); перевірка й посилення налаштувань мережевих екранів і засобів захисту комп’ютерів, пошук хибних спрацювань — лише в тексті.

CloudGuard WAF (https://www.checkpoint.com/cloudguard/waf/): редакцій немає — ліцензія за обсягом запитів
(окремо, у складі CloudGuard Workloads або PAYG), тому один продукт. DDoS Protection — функція WAF-as-a-Service, рахуємо
`ddos`. GenAI-захист (ін’єкції в промпти) і API Discovery — у межах `waf`; `waf` доповнено D3-APCA.

Quantum Spark (https://www.checkpoint.com/downloads/products/quantum-spark-2500-datasheet.pdf): лінійка, не окремі моделі
(рішення автора); продукт = рівень підписки NGFW / NGTP / SNBT (таблиця Subscription Services). Anti-Bot, URL Filtering,
Anti-Bot і URL Filtering — `web-filtering`, антивірус на шлюзі — у межах `ngfw` (раніше `ti`); антиспам на шлюзі — не `email`, лише в тексті; Zero Phishing
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
поведінковий захист, захист від експлойтів) + Endpoint Controls (Device control — `device-control`, host firewall — `host-firewall`; BitLocker/FileVault —
`encryption`); виявлення й реагування в ньому «—», тому `epp`, без `edr`.
Pro — `epp` + `edr` (детектори, кейси, 100+ плейбуків, Live Terminal — у тексті). «Extended Detection Analytics (network, cloud, identity)» — аналітика підключених даних, не `ndr`
(Network Traffic Analysis за документацією 3.x — лише Pro per GB) і не `ueba` (поведінка користувачів — у add-on ITDR); плейбуки — не `soar`
(SOAR — у XSIAM). Add-on (Cloud Runtime Security, ITDR, Advanced Email Security, Host Insights, Forensics, DLP, Exposure Management, ASM,
MDR, MTH, XTH) класом не рахуємо; Mobile security, Cortex Agentic Assistant — лише в тексті. Pro per GB / Cloud per Host і нові назви
документації 5.x (Enterprise Runtime Security) не додано.

Cortex XSIAM (таблиця тарифів https://cortex-docs.paloaltonetworks.com/cortex-xsiam/learn-about-cortex-xsiam/cortex-xsiam-product-licenses;
даташит березня 2026 — лише опис): 3 продукти за тарифами NG-SIEM / Enterprise / Premium. NG-SIEM: Core Analytics, Automation, UEBA —
`siem`, `ueba`, `soar`; `ndr` — бо даташит називає NDR базовою можливістю платформи (аналітика журналів мережевих екранів і потоків,
власних сенсорів немає; у XDR Pro per Endpoint такого збору немає, тому там без `ndr`). Enterprise: агент XDR (Enterprise Runtime Security:
NGAV, Endpoint Controls) — `edr`, `device-control`, `host-firewall`, `encryption`; Host Insights (Vulnerability Management) — `vm`. Premium: Cloud Posture
Security (CSPM, CIEM, DSPM, безагентне сканування, ASPM, CI/CD) — `cnapp` + `ciem`; Cloud Runtime Security (CWP, CDR, WAAS) — `cwpp` +
`waf`; XTI і Threat Intel Management — `ti`; Attack Surface Management (інтернет-ресурси) — `easm`. Add-on у всіх тарифах (ITDR, Forensics,
Advanced Email Security, Exposure Management, DLP, Code Security) класом не рахуємо. CDR (аналітика хмарних журналів) — лише в тексті.
Старий тариф Enterprise Plus не додано.

Splunk Enterprise Security (https://www.splunk.com/en_us/products/enterprise-security.html, таблиця редакцій — там і на
https://help.splunk.com/en/splunk-enterprise-security-8/enterprise-security-editions; бриф ES — 2024, ще з SOAR за окремою підпискою): 2 продукти —
ES Essentials і ES Premier. Essentials: SIEM (RBA, 1 700+ виявлень, Detection Studio) — `siem`; Threat Intelligence Management — `ti`;
Exposure Analytics (безперервне виявлення активів і облікових записів із журналів, наповнює Asset & Identity) — `caasm`. Premier: + Splunk SOAR
— `soar`, UEBA — `ueba`, Automated Threat Analysis (Splunk Attack Analyzer: детонація файлів і посилань, лише хмара) — не `sandbox` (клас включає очищення файлів/CDR, якого в Splunk немає; рішення автора), лише в тексті. AI Assistant
і AI-агенти — лише в тексті. Splunk Enterprise / Splunk Cloud Platform — платформа даних, на якій працює ES, окремим продуктом не додано.

CrowdStrike (таблиця пакетів https://www.crowdstrike.com/en-us/pricing/, жовтень 2026; даташит Falcon Endpoint Protection Pro 2024 —
опис можливостей Pro, його таблиця з Falcon Elite застаріла): 3 продукти — Falcon Go, Pro, Enterprise. NGAV (Falcon Prevent) — `epp` у всіх; Device Control (у всіх) — `device-control`, Firewall Management (з Pro) — `host-firewall`. Enterprise: EDR (Falcon Insight XDR) — `edr`;
«Threat Intelligence & Hunting» — це Falcon Adversary OverWatch (полювання силами експертів, сервіс) — не `ti`, лише в тексті. Mobile Device
Protection, Express Support — лише в тексті. Identity Protection, IT Hygiene (Falcon Discover), Next-Gen SIEM — у всіх пакетах «✗», класом не
рахуємо. Falcon Complete — сервіс MDR, не додано; Falcon Flex — модель ліцензування, не пакет.

Palo Alto Networks NGFW (https://www.paloaltonetworks.com/network-security/next-generation-firewall-hardware, даташити серій): 2 продукти —
PA-Series (апаратна лінійка PA-500 – PA-7500, PA-50R; моделі лише в тексті, як Quantum Spark) і VM-Series. Офіційної таблиці пакетів на сайті
вендора немає, підписки CDSS продаються окремо, тому **рішення автора: NGFW Palo Alto на сайті завжди з двома підписками** і про це сказано в
описі — Precision AI Network Security Subscription Bundle (Advanced Threat Prevention, Advanced URL Filtering, Advanced WildFire, Advanced DNS
Security, Advanced SD-WAN, Advanced IP Defense, Device Security) і Prisma Access Agent (за документацією замінює ліцензію шлюзу GlobalProtect).
Класи: ATP — `ngfw`; WildFire — `sandbox`; URL Filtering — `web-filtering` + `browser-protection` (інлайн-фішинг); DNS Security, IP Defense — `web-filtering`; Prisma
Access Agent — `vpn`. Device Security (виявлення IoT) — не CAASM, SD-WAN — лише в тексті. CN-Series і Cloud NGFW не додано.

Palo Alto Networks Idira (ex-CyberArk; платформа identity security, GA 12.05.2026; сторінки https://www.paloaltonetworks.com/idira/…,
назви — за офіційним crosswalk https://github.com/cyberark/Idira-Partner-Integration-Docs/blob/main/docs/naming-crosswalk.md; досьє автора
`idira_products_v2.md`, листопад 2026). Таблиць пакетів на сайті немає, тому продукт = продукт із crosswalk чи сторінки (редакції за SKU —
лише в тексті). Назви: PAM — завжди з типом розгортання без коми (*Idira Privileged Access Manager SaaS*), Secrets Manager — з комою
(*Idira Secrets Manager, SaaS*). SIA — ex-Dynamic Privileged Access (не Alero); Alero → Remote Access → **Idira Vendor PAM**. 18 продуктів:
- PAM SaaS (ex-Privilege Cloud) і Self-Hosted (ex-PAS): сховище, ротація, ізоляція й запис сесій — `pam`; вбудована аналітика ITDR / PTA (Golden Ticket,
  DCSync, PtH, vault sweeping) — `itdr`. Adaptive MFA і VPN-less з опису SKU Standard User — лише в тексті (їх дають Idira Identity і Vendor PAM).
- SIA (add-on до PAM SaaS): ZSP до серверів, БД, Kubernetes — `jit`, сесії з записом і vaulted-доступ — `pam`; «без VPN» на сторінці лише для
  хмари/K8s — `vpnless` не ставимо. SCA: JIT-ролі в AWS/Azure/GCP — `jit`; аналізу надмірних прав немає — не `ciem`.
- Vendor PAM (лише до PAM SaaS/Self-Hosted): `pam`, ZSP для зовнішніх — `jit`, без VPN — `vpnless`, біометрична MFA — `mfa`; ITDR — лише в тексті.
- EPM: `epm`; контроль застосунків, захист від вимагачів і крадіжки паролів (QuickStart), Endpoint Sign-in (add-on) — лише в тексті (контроль
  застосунків — не `epp`). Identity (ex-Idaptive): SSO, адаптивна й безпарольна MFA — `mfa`; Lifecycle, App Gateway, Identity Flows — у тексті
  (Identity Flows окремим продуктом не додано). Secure Web Sessions: запис дій у вебзастосунках + блокування копіювання й завантаження — `dlp`
  (як FortiMail Browser Security). WPM — `password-manager`.
- Identity Governance (ex-Zilla): клас `iga` заведено під нього (реєстр прав, перегляди доступів, JML, SoD, покинуті облікові записи);
  `defenses[]` — T1078, T1098; D3FEND — D3-AM, D3-UAP, D3-UGPH, D3-CR.
- ITDR окремим продуктом не додано («built into the platform», окремої SKU немає). Machine: Secrets Manager SaaS / Self-Hosted, Secrets Hub,
  Credential Provider (агент, ex-AIM), Central Credential Provider (REST, ex-AAM) — `secrets`; Idira Conjur (open source, безкоштовний) — лише в тексті.
- Secure AI Agents: реєстр агентів і MCP-серверів — `nhi` (AI-агенти разом із NHI, як у Silverfort), Agent Identity Broker і Kill Switch — `jit`.
- Next-Gen Trust Security (ex-CyberArk Certificate Manager SaaS / Venafi) і Certificate Manager, Self-Hosted (ex-Venafi TPP) — поза брендом Idira,
  вендор той самий — `clm`. SSH Manager і CodeSign Manager не додано.
- Під Idira уточнено `defenses[]` класів (загальні для всього класу): `epm` + T1136 (створення локального облікового запису) і T1490 (видалення тіньових
  копій) — обидва вимагають прав адміністратора; `pam` + T1110 (унікальні паролі, що змінюються, марнять підбір).

Fortinet (продукти за ордеринг-гайдами https://www.fortinet.com/content/dam/fortinet/assets/data-sheets/og-<продукт>.pdf, жовтень 2026):
- **FortiGate** (таблиця https://www.fortinet.com/support/support-services/fortiguard-security-subscriptions/fortigate-security-bundles) — 3 продукти
  за пакетами FortiGuard ATP / UTP / Enterprise Protection (апарат і FortiGate-VM, моделі лише в тексті). FortiOS: мережевий екран, IPsec/SSL VPN —
  `ngfw`, `vpn`. ATP: IPS — `ngfw`; антивірус і Botnet (репутація IP) на шлюзі — у межах `ngfw`; Sandbox SaaS (лише виявлення) — `sandbox`. UTP: веб- і
  DNS-фільтрація, Anti-Botnet & C2 — `web-filtering`. Enterprise: DLP — `dlp`; AI-based Inline Malware
  Prevention, Attack Surface Security Rating, IoT Security, CASB — лише в тексті. OT Security, SD-WAN/SASE, FortiAnalyzer Cloud, SOCaaS — à la carte.
- **FortiMail** (апарат FML-xxxF і VM): пакети Base і Enterprise ATP — 2 продукти. Email DLP є в усіх пакетах — `dlp`; CDR, URL Click Protection,
  Impersonation Analysis, Cloud Sandboxing — `sandbox` (Enterprise ATP). Пакет з Cloud Email API — лише в тексті Enterprise ATP. FortiMail Cloud
  (хостинговий шлюз Gateway / Premium) не додано — автор просив хмарний захист як Workspace Security.
- **FortiMail Workspace Security** (ex-Perception Point, https://www.fortinet.com/products/fortimail-workspace-security) — 3 компоненти, що
  продаються разом або окремо: Cloud SaaS (ICES для M365/Google: `email`, динамічний аналіз HAP — `sandbox`, захоплення облікових записів — `ueba`,
  як Harmony Email), Browser Security (розширення: `browser-protection`, `sandbox`, контроль копіювання/завантаження/GenAI — `dlp`), Collaboration
  Security (Teams, Slack, сховища: `sandbox`). Цілодобова служба реагування входить у пакет — сервіс, лише в тексті.
- **FortiSIEM**: 2 продукти — локальний (апарат/VM; Device + EPS або GB/день) і FortiSIEM Cloud. Discovery/CMDB — `caasm` (як Exposure Analytics
  Splunk), Log-based UEBA включено — `ueba`; Cloud ще включає агентів, endpoint UEBA та IOC — `ti` (у локальному — add-on). Remediation Actions і
  Security Automation Service — не `soar` (SOAR — окремий FortiSOAR).
- **FortiSOAR**: один продукт (Enterprise і Starter Edition — класи однакові; Multi-Tenant для MSSP не додано) — `soar`; TIM — add-on.
- **FortiEndpoint** (єдиний агент FortiClient + FortiEDR + FortiDLP, лише хмарне керування): 6 продуктів за редакціями Zero Trust Connect, Protect
  Core, Protect Plus, Protect XDR, Protect Data, Complete. ZTNA — `vpnless`, VPN — `vpn`, Vulnerability Scan — `vm`, FortiGuard Web Filtering — `web-filtering`
  (у всіх). EPP — `epp` (з Core), EDR — `edr` (Plus, XDR, Complete), Sandbox — `sandbox` (з Core). DLP повна — `dlp` з Plus (у Core «базова»). Threat Hunting, XDR,
  DLP Advanced/Insider Risk — лише в тексті. FortiGuard Endpoint Forensics Service, SOCaaS — сервіси,
  лише в тексті; FortiIdentity Cloud Basic — не `mfa`, лише в тексті. Окремі FortiEDR і FortiClient не додано.
- **FortiDeceptor**: один продукт (апарат/VM і Deception as a Service) — `deception`; виявлення активів для розстановки пасток — лише в тексті.
- **FortiRecon** (CTEM): 3 продукти за пакетами EASM / EASM and BP / EASM, BP, and ACI. EASM — `easm`; IASM (агент сканує внутрішні підмережі на
  вразливості) — `vm`; Leaked Credentials, Orchestration (SOAR, 100 запусків) — лише в тексті. BP — `brand-protection`. ACI: даркнет і ринки
  стілерів — `dark-web`, технічна розвідка й IoC — `ti`, Vendor Risk Assessment (25) — `tprm`. Red Teaming — окрема послуга.
- **FortiCNAPP** (ex-Lacework): один продукт — ліцензія Risk & Threat (за ресурсами, усі можливості): CSPM/KSPM, IaC, DSPM — `cnapp`; агент із
  runtime-моніторингом, FIM і K8s admission — `cwpp`; CIEM — `ciem`. FortiDAST — add-on (без `dast`); Code Security (SCA, секрети в коді) —
  окрема покупка, не додано; legacy-тарифи за vCPU не додано.

Trend Micro: бізнес-напрям з 2026 — **TrendAI** (trendaisecurity.com), платформа — **TrendAI Vision One** (раніше Trend Vision One); вендор на
сайті — «Trend Micro», назви продуктів — «TrendAI Vision One …». Ліцензування — кредити TrendAI Flex; пакети й функції — за таблицею
https://docs.trendmicro.com/en-us/documentation/article/trend-vision-one-credit-req-for-apps-services (жовтень 2026), продукт = пакет чи рішення
з таблиці. Endpoint Security Core / Essentials / Pro: антивірус — `epp`, XDR for Endpoints (з Essentials) — `edr`, контроль пристроїв —
`device-control`, мережевий екран — `host-firewall`, DLP — `dlp`, Web Reputation — `web-filtering`; Pro (контроль цілісності,
аналіз журналів, серверний IPS, контейнери — колишній Deep Security) — `cwpp`; IPS для комп’ютерів, контроль застосунків — лише в тексті.
Email and Collaboration Security Core / Essentials / Pro: `email`, DLP — `dlp`, File Sandboxing — `sandbox`, Account Takeover — `ueba` (як
Harmony Email); URL Sandboxing, Continuity, шифрування, DMARC (Essentials), XDR for Email (Pro) — у тексті. CREM Core: Cyber Risk Overview
(інвентар активів) — `caasm`, Attack Surface Discovery — `easm`, Threat and Exposure Management і Network Vulnerability Scanner — `vm`, Identity
Security Posture — `ispm`; Essentials: Security Awareness — `awareness`, Attack Path Prediction і Compliance — у тексті. Cloud account assessment
(CSPM, EASM, DSPM, ASPM, безагентне сканування, cloud identity entitlement) — продукт «Cloud Risk Management» за назвою на сторінці Cloud Security:
`cnapp`, `ciem`, `easm`. Container Security — `cwpp`. Agentic SIEM — `siem` + `soar` (Agentic SOAR названо на сторінці Security Operations;
окремого рядка в таблиці кредитів немає). XDR for Networks (Virtual Network Sensor, сенсор на TippingPoint / DDI) — `ndr`. Identity Security
(ISPM + ITDR, UEBA в даташиті) і Data Security (DSPM, data lineage, Data Control) — у таблиці кредитів окремих рядків немає, класи за
сторінками й брифами: `itdr` + `ispm` + `ueba`; `dlp`. ZTSA Private Access — `vpnless`; Internet Access (SWG за Web Reputation, CASB) — `web-filtering`;
AI Secure Access, Send to Sandbox — лише в тексті. Threat Intelligence (Hub) — `ti`; Sandbox Analysis — `sandbox`; Forensics (Evidence
Collection, потрібен EDR) — `dfir`. Поза кредитами: TippingPoint TPS (апаратний IPS, Digital Vaccine/ZDI, репутація IP і URL) — `ngfw` + `web-filtering`;
Deep Discovery Inspector (пасивний аналіз трафіку з власною пісочницею) — `ndr`, `ids`, `sandbox`. Не додано: XDR for Email/Cloud/Data окремо
(входять у пакети чи без класу), Mobile Security, File Security, AI Application Security, Code Security, Cloud IPS, Deep Discovery Analyzer /
Email Inspector, ScanMail, PortalProtect, сервіси (MDR, IR).

Black Duck (ex-Synopsys Software Integrity Group, з жовтня 2024; сайт https://www.blackduck.com віддає 403 скриптам — читати через WebFetch):
таблиць пакетів немає (ціни — «Get pricing»), продукт = продукт зі сторінки вендора. Класи `sast` і `sca` заведено під Black Duck (рішення автора:
SAST перестав бути «gap» в аналітиці); `dast` розширено до динамічного тестування застосунків — DAST, IAST, фазинг (D3-SYSVA). Polaris Platform
(SaaS: fAST Static, fAST SCA, fAST Dynamic, IaC, секрети; оплата за споживанням) — `sast`, `sca`, `dast`. Coverity Static Analysis — `sast`.
Black Duck SCA — `sca`, один продукт: Standard Edition і старший план без назви на сторінці (сніпети, бінарні файли й прошивки, AI-моделі) — у тексті.
Continuous Dynamic (DAST, ex-WhiteHat), Seeker Interactive Analysis (IAST), Defensics Fuzz Testing (фазинг протоколів) — `dast`. Code Sight
(плагін IDE) — `sast`, `sca`. Не додано: Software Risk Manager (ASPM — зводить знахідки інших сканерів, класу немає), Black Duck Signal
(агентний AI), Black Duck Assist, ContextAI, Detect / Bridge CLI (інтеграції).

Teramind (таблиця планів https://www.teramind.co/services/price/, листопад 2026; сторінки DLP, Insider Risk Management, AI Governance):
3 продукти лінійки «Teramind» за планами UAM / DLP / Enterprise & Government. Агент на комп’ютерах (запис екрана й аудіо, клавіші, пошта,
месенджери, файли, друк, консоль, камера, геолокація) — сам по собі не клас, лише в тексті; у текстах — речення про правову підставу й
повідомлення працівників (рішення автора). UAM: Anomaly detection і Dynamic risk scoring — `ueba`; AI-функції (AI Conversations Recording,
AI Data Exfiltration Control, Agentic AI Governance) — з UAM за карткою плану, але без аналізу вмісту (розділ Data Loss Prevention «✗») —
не `dlp`, лише в тексті (рішення автора; на відміну від Workforce AI Security). DLP і Enterprise: розділ Data Loss Prevention (правила за вмістом
і файловими операціями, класифікація, відбитки) і Clipboard — `dlp`, + `ueba`. USB і друк — канали витоку зі сторінки Insider Risk (план не
вказано), у тексті DLP; `device-control` не ставимо. Audit & Forensics — не `dfir`; Activity blocking — не `web-filtering`; Remote control,
In-app fraud detection, OCR, захоплення полів, професійні послуги, AWS GovCloud / Azure Government — лише в тексті. Starter (правила без аномалій)
— жодного класу, не додано; клас `uam` не заводимо — дублює `dlp`/`ueba` (рішення автора). NextGen поки лише в хмарі — не в текстах.

Trellix DLP (https://www.trellix.com/products/dlp/, пакети — https://www.trellix.com/products/data-security-suites/ і даташит пакетів,
листопад 2026; trellix.com віддає 403 скриптам — склад пакетів і окремі SKU звірено за прайс-оглядом дистриб’ютора Infinigate, 2025): 5 продуктів
за компонентами — Endpoint Complete, Device Control, Discover, Network Monitor, Network Prevent (окремі модулі без лінійок; у дистриб’ютора в кожного
власний SKU). Пакети Data Security Suites (Data Loss Prevention Network Suite / у даташиті Data Security Network Suite = Monitor + Prevent + Discover;
Data Loss Prevention Suite; Data Security Endpoint Protection Suite; Data Security Suite; Data Encryption Suite) — комбінації компонентів, лише в тексті.
Пошук, класифікація й блокування передачі — `dlp` (Network Monitor лише виявляє — теж `dlp`); вбудований і окремий Device Control — `device-control`
(без мережевого екрана — сказано в «Чого немає», як Falcon Go). Фільтрація вмісту на флешки в Device Control — не `dlp` (один канал, без пошуку
даних; межовий випадок). Шифрування файлу під час передачі — не `encryption`; Network Monitor — не `ndr`/`ids`, Network Prevent — не `email`/
`web-filtering`. OCR Suite — add-on (у Data Security Suite включено); AI Data Risk Dashboard, Skyhigh Security — лише в тексті. Trellix Data
Encryption і Database Security не додано (рішення автора).

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

