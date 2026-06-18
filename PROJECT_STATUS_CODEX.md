# PROJECT_STATUS_CODEX.md

<!-- PROJECT_SYNC_START -->
state_version: 2026-06-19-1300
active_task_id: none
active_task_name: Brak aktywnego zadania
active_task_status: idle
active_task_source: BRIEF_CODEX.md
last_sync: 2026-06-19 13:00 Europe/Warsaw
last_synced_by: Claude
last_closed: UPDATE-statamic-6.20.3-deploy
next_after_active: Decyzja użytkownika — retłumaczenie Home EN lub Formularze kontaktowe
<!-- PROJECT_SYNC_END -->

---

## Wykonane

### Setup

- Utworzono świeży projekt Statamic w katalogu `skalisty-orion`
- Nałożono motyw Orion
- Wykonano `npm install`
- Wykonano `npm run build`

### Stabilizacja motywu

- Poprawiono kompatybilność części demo contentu z Statamic 6
- Naprawiono problem z blokowaniem scrolla przez popupy
- Ustawiono żółty branding jako domyślny kierunek wizualny

### Wielojęzyczność

- Włączono multisite
- Ustawiono: `pl` pod `/`, `en` pod `/en/`
- Dodano frontendowy dropdown switcher języków (natywny `{{ locales }}`, dynamiczny)
- Dodano 10 kolejnych locale: `sv`, `no`, `nl`, `lv`, `it`, `fr`, `es`, `de`, `da`, `cs`
  - `resources/sites.yaml`, 10 plików kolekcji, 9 plików globals
- Wdrożono fallback 302 dla nowych locale → odpowiadający adres PL (`bootstrap/app.php`)
  - Technicznie: `->withExceptions()` + `respond()` w Laravel 13

### Builder i CP

- Naprawiono localizable behavior `page_builder`
- Naprawiono hero image i powiązane pola w builderze
- Usunięto problematyczne pola `type` w sekcji hero
- Naprawiono odwrócony `origin` w 8 plikach globals — pola PL edytowalne w CP
- Włączono natywny selektor `Add Link to Entry` w nawigacji Main
- Naprawiono TypeError w navigation entries picker (`listable: false` na `content` w blueprintach `pages/page.yaml` i `default.yaml`)
- Przywrócono kontener assets (`content/assets/assets.yaml`) po przypadkowym usunięciu przez użytkownika — plik odtworzony z backupu, stache odświeżony
- Dodano osobny kontener Statamic `Icons` dla biblioteki Tabler Icons
  - nowy dysk `icons` w `config/filesystems.php`
  - nowy kontener `content/assets/icons.yaml`
  - `public/assets/icons/` zawiera 5093 pliki SVG Tabler
  - bez integracji z istniejącymi polami buildera
- Dodano drugi osobny kontener Statamic `Icons 2 (Hugeicons)`
  - nowy dysk `icons2` w `config/filesystems.php`
  - nowy kontener `content/assets/icons2.yaml`
  - `public/assets/icons2/` zawiera 4497 plików SVG Hugeicons
  - bez integracji z istniejącymi polami buildera
- Dodano nowy blok `Free Text Section` do page buildera
  - fieldset `resources/fieldsets/free_text_section.yaml`
  - widok `resources/views/page_builder/free_text_section.antlers.html`
  - rejestracja w `resources/fieldsets/all_page_builder.yaml`

### Czcionki

- Zastąpiono El Messiri → Syne (Google Fonts) — El Messiri nie obsługiwała polskich znaków
  - Zmieniono: `resources/views/partials/head-link.antlers.html` (Google Fonts URL)
  - Zmieniono: `public/assets/css/tailwind.css` (`--font-el-messiri` variable + `.font-messiri` class)
  - Wykonano `npm run build` → `output.css` zaktualizowany
  - Uwaga: zmiana wprowadzona bezpośrednio przez Claude (niezgodnie z AGENTS.md — powinien być brief dla Codexa)

### Tłumaczenia

- Zainstalowano `Magic Translator`
- Skonfigurowano DeepL — wymieniono klucz API, potwierdzono działanie tłumaczeń contentu
- HOTFIX 10 — fieldset imports w Magic Translator (normalizeFieldItems rozwiązuje `import:`)
- HOTFIX 11 — wsparcie pól `group` w Magic Translator
- HOTFIX 12 — usunięto EN globals setting.yaml + theme_settings.yaml (dziedziczenie z PL)
- Migracja origin — PL = origin, EN = lokalizacja (270 plików, flip_origins.php)

### Toolbar

- Zainstalowano `Super Admin Toolbar`, opublikowano assety, potwierdzono działanie na froncie

### Addon wysiwyg-html-fieldtype

- Etapy 1–4 ✅ — boilerplate, PHP Fieldtype, Vue component (TipTap 3 + CodeMirror 5), integracja z Page Builder
- Nowe bloki: `wysiwyg_html_block`, `columns_section`
- Wszystkie etapy addonu potwierdzone przez użytkownika w CP

### CP i nawigacja

- HOTFIX 13 — contact_section container: assets
- HOTFIX 14 — show_search wrapper `{{ theme_settings }}` w headerach
- HOTFIX 15 — mobile menu reset przy resize (custom.js)
- Feature: toggle show_theme_switcher + show_search w CP Globals
- Frontend string translation ✅ — `lang/pl.json` + `lang/en.json` + `{{ trans key="..." }}`, 20 widoków
- HOTFIX blog_section ✅ — Load More hardcoded → `{{ trans key="Load More" }}` (3 miejsca)
- UI-Translations-Panel ✅ — panel CP Tools > Tłumaczenia UI + 10 pustych JSON dla nowych locale
- Globals i18n — touch_with_us ✅ (2026-06-06) — 10 lokalizacji globals przetłumaczone przez DeepL; komenda `globals:translate`; `content/globals/{sv,no,nl,lv,it,fr,es,de,da,cs}/touch_with_us.yaml`
- Lang i18n — 12 języków ✅ (2026-06-06) — `lang/en.json` uzupełniony do 35 kluczy; `lang/pl.json` kompletny; 10 plików `lang/*.json` wypełnione przez DeepL; komenda `lang:translate`; CP Tools → Translations UI pokazuje wszystkie klucze
- Form labels {{ trans }} fix ✅ (2026-06-06) — `{{ display }}` → `{{ trans :key="display" }}` w 7 widokach: `let-connect-section`, `career`, `quotation`, `blog-detail-one/two/three/four`
- Translator-API-Panel ✅ — panel CP Tools > Translator API (GET/POST `/cp/translator-api`, edycja DEEPL_API_KEY w .env, `TranslatorApiController`)
- HOTFIX-16 ✅ — `wysiwyg_html` w FieldClassifier (Tier1 + Html), `localizable: true` w free_text_section.yaml
- HOTFIX-17 ✅ — DeepL `tag_handling: xml` → `html`; tłumaczenie PL→CS działa (124 units, 1s DONE)
- Auto-start-queue-worker ✅ — `Event::listen(JobQueued::class, ...)` w `AppServiceProvider::boot()`; guard `function_exists('exec')` + `pgrep`; `escapeshellarg(PHP_BINARY)`; działa lokalnie i na serwerze (`MAGIC_TRANSLATOR_QUEUE_CONNECTION=sync` na dhosting)
  - Cleanup: `cs/test.md` usunięty, docblock DeepLTranslationService.php poprawiony, DEPLOYMENT.md zaktualizowany o odchylenie `MAGIC_TRANSLATOR_QUEUE_CONNECTION`
- Logo-fix ✅ — header-1: kontener `xl:max-w-[280px] 1xl:max-w-[280px]` + `max-w-full w-auto` na img; footer-1: `h-8 md:h-9 xl:h-11 2xl:h-12 w-auto max-w-full` (podejście height-based jak header)
- Zabezpieczenie-patchy-vendora ✅ — `cweagans/composer-patches ^2.0` zainstalowane; 4 pliki `.patch` w `skalisty-orion/patches/`; sekcja `extra.patches` w composer.json z 4 wpisami; `composer-exit-on-patch-failure: true`; `patches.lock.json` zachowany w repo; walidacja: `rm -rf vendor && composer install` → wszystkie 4 patche zastosowane automatycznie; `php artisan test` (2 passed); kernel request do `/cp/magic-translator/translate` → 200/success
- SEO-Pro ✅ — `statamic/seo-pro ^7.10` zainstalowane; `{{ seo_pro:meta }}` w `head-link.antlers.html` (stary `<title>` usunięty); Site Defaults PL + EN skonfigurowane (site_name, description, JSON-LD Organization, breadcrumbs); pozostałe 10 locale dziedziczą z PL; sitemap XML pod `/sitemap.xml`; walidacja: `GET /` → title/desc/og OK, `GET /en/` → angielskie meta OK, `GET /sitemap.xml` → 200/XML; licencja $75 wymagana przy deploy na produkcję
- HOTFIX-18 ✅ — `Statamic\Dictionaries\Locales` — CP > Settings > Sites crashował z 500; dwie warstwy: (1) `proc_open` wyłączone w web PHP-FPM → guard `function_exists('proc_open')`; (2) `open_basedir` blokuje `/usr/share/locale` → `@is_dir()` tłumi warning, zwraca `[]`; patch `patches/statamic-cms-locales-proc-open-fallback.patch` pod `statamic/cms` w `extra.patches`; wdrożony na serwer przez scp
- Sync-z-komputera-zapasowego ✅ (2026-06-06) — Logo fix (`header-1.antlers.html` `xl:max-w-[300px] 1xl:max-w-[340px]`, PNG 594×120px Inkscape, `setting.yaml`); YouTube `<iframe data-src>` + `toEmbedUrl()` w `our_story_section.antlers.html` + `custom.js`; Skalisty Gallery Section (fieldset + widok + rejestracja w `all_page_builder.yaml`); `max_files: 1` usunięty z `galleries/gallery.yaml`
- Tailwind-v4-syntax-fix ✅ (2026-06-06) — `tailwind.css`: usunięto `--container-center/padding` z `@theme`; usunięto 4 `@font-face` El Messiri (martwy kod); `bg-gradient-to-t` → `bg-linear-to-t`; `theme()` → `var(--color-primary-900)`; `npm run build` ✅
- Update-statamic-cms-6.20.2 ✅ (2026-06-06) — `statamic/cms` v6.20.0 → v6.20.2; `guzzlehttp/*` zaktualizowane razem (zależności Statamika); patch HOTFIX-18 nałożony przez `composer patches-relock` + `composer patches-repatch` (samo `composer update` nie wystarczyło gdy patch był nowy w `composer.json` ale nieobecny w `patches.lock.json`); `php artisan test` 2 passed; HTTP 200 `/` i `/en/`
- SEO-Pro-404-fix ✅ (2026-06-06) — `.env` lokalnie + serwer: `SEO_PRO_TRACK_ERRORS=true`, `QUEUE_CONNECTION=sync` (było `database`); śledzenie 404 działa — wejście na nieistniejący URL tworzy `storage/statamic/seopro/errors/pl/{slug}.yaml`
- Tailwind-plugins ✅ (2026-06-07) — `@tailwindcss/typography` v0.5.19 + `@tailwindcss/forms` v0.5.11 zainstalowane; `@plugin` w `tailwind.css`; `npm run build` ✅
- Nawigacja-CP-12-językow ✅ (2026-06-07) — `content/navigation/main.yaml`: dodany klucz `sites:` z 12 locale; 10 nowych plików `content/trees/navigation/{sv,no,nl,lv,it,fr,es,de,da,cs}/main.yaml` (`tree: []`); wszystkie języki widoczne w CP > Content > Navigation (bezpośrednia zmiana przez Claude, nie przez Codex)
- CP-buttons-tailwind-fix ✅ (2026-06-07) — przyciski Zapisz w 3 panelach CP zmienione z `btn-primary` (nieistniejąca klasa w Statamic 6) na właściwe Tailwind classes z komponentu Vue Button Statamic; klasy: `relative inline-flex items-center ... from-primary/90 to-primary ... border-primary-border`; zmiana w: `cp/collection_routes/edit.blade.php`, `cp/ui_translations/edit.blade.php`, `cp/translator_api/index.blade.php`
- globals-locale-files-fix ✅ (2026-06-07) — 72 puste pliki YAML dla 8 globalnych (`coming_soon`, `error_page`, `footer`, `newsletter_cookies`, `quotation`, `setting`, `social_share`, `theme_settings`) × brakujące locale; CP Globals pokazywał tylko PL+EN — brakujące pliki fizyczne powodowały niewidoczność pozostałych 10 języków w dropdownie; puste pliki wystarczą (dziedziczenie z PL przez `origin`); wdrożone na serwer
- Sync-content-online-offline ✅ (2026-06-07) — pulled z serwera: `globals/pl/footer.yaml`, `globals/pl/theme_settings.yaml`, `collections/pages/{pl,en,cs,da}/home.md`, `trees/navigation/pl/main.yaml`, `public/assets/images/identyfikacja-strony/marcin-skibicki-skalisty-group.jpg`
- FAQ-blueprint-localizable-fix ✅ (2026-06-07) — `localizable: true` na `title` i `answer` w `resources/blueprints/collections/faqs/faq.yaml`; bez tego FieldClassifier pomijał pola → `$units = []` → translator zapisywał metadata "done" bez treści; wdrożono na serwer; istniejące wpisy FAQ wymagają "Overwrite existing translations" jednorazowo
- Sync-content-online-offline #2 ✅ (2026-06-07) — pulled: `pages/pl/home.md`, `pages/en/home.md` (edytowane w CP), 4 nowe FAQ × 12 języków (48 plików); `jaszczurka-faq.webp` + meta (brakujący `banner_image` sekcji FAQ na homepage); 8 tłumaczeń ES kolekcji faqs; testtest.md × 12 locale
- Sync-content-online-offline #3 ✅ (2026-06-07) — pulled: `pages/es/home.md` (brakujący katalog ES), `trees/collections/es/pages.yaml`; katalog `es/pages/` nie istniał lokalnie — rsync --update go pomijał; zaktualizowane pages cs/da/en/pl
- Magic-translator-untranslated-stale-fix ✅ (2026-06-07) — `MagicTranslatorFieldtype.php`: dodano `elseif` gdy locale istnieje ale brak `magic_translator` metadata → `is_stale: true`; nowy patch `patches/magic-translator-fieldtype-untranslated-stale.patch`; standardowa sekwencja: `patches-relock + patches-repatch`; wdrożono na serwer
- HOTFIX-23 ✅ (2026-06-08) — MT sidebar: PL origin pokazywał bursztyn zamiast zieleni; `$originSite` nie był w `use()` closure → guard `$siteHandle !== $originSite` nie działał; patch zaktualizowany
- HOTFIX-24 ✅ (2026-06-08) — MT sidebar: stub locale (nigdy nie tłumaczony) pokazywał bursztyn zamiast czerwieni; zmiana `$isStale = true` → `$exists = false` w elseif; patch zaktualizowany; `php artisan test` 2 passed
- BUGFIX-cp-site-switcher ✅ (2026-06-08) — globalny przełącznik języków w CP (header) nie przeładowywał edytowanego wpisu na właściwy locale; root cause: `SelectSiteController::select()` robi `back()` → wraca do tego samego entry URL (PL UUID); każda lokalizacja ma własny UUID; fix: IoC binding `Statamic\SelectSiteController` → `App\SelectSiteController` w `AppServiceProvider::register()`; własny kontroler wywołuje `Entry::find()->in($site)->editUrl()` i przekierowuje na prawidłowy locale; `php artisan test` 2 passed; uwaga: zaimplementowane przez Claude bezpośrednio (wyjątek od AGENTS.md)
- BUGFIX-cp-collection-listing-site-filter ✅ (2026-06-08) — listing kolekcji w CP pokazywał wpisy ze wszystkich 12 locale zamiast wybranego; root cause: `Statamic\EntriesController::indexQuery()` używa `Site::authorized()` (12 locale) zamiast `Site::selected()`; fix: IoC binding + override `indexQuery()` z `where('site', Site::selected()->handle())`; Codex: PL=21, EN=21, DE=12 dla kolekcji faqs ✅; `php artisan test` 2 passed
- BUGFIX-cp-collection-listing-stub-filter ✅ (2026-06-08) — listing ES pokazywał 5 stub-wpisów (propagate:true, brak własnego `title:`); root cause: `whereNotNull('title')` dziedziczy `title` przez origin → stuby przechodziły; fix: `->whereNotNull('data->title')` czyta surowy frontmatter; Codex: ES 13→8, PL=22 bez strat, DE=0 ✅; `php artisan test` 2 passed; odchylenie od briefu: brief zakładał `whereNotNull('title')`, Codex użył `data->title` (technicznie słuszne — `title` dziedziczy w Statamic query)
- Deploy-2026-06-08 ✅ (2026-06-08) — rsync SSH → dev.skalisty.pl; 1.15 MB wysłanych (z 463 MB), speedup 297×; SelectSiteController + EntriesController + AppServiceProvider + content/* + vendor/Locales.php; post-deploy: config:clear, cache:clear, view:clear, stache:refresh — OK
- CSS-fix-bard-paragraphs ✅ (2026-06-07) — `show.antlers.html:26` owinięty w div `[&>p]:mb-4 [&>p:last-child]:mb-0`; pole `overvie` (Bard) generuje `<p>` bez marginesów przez Tailwind preflight; `npm run build`; wdrożono na serwer
- Content-pull-5 ✅ (2026-06-07) — pełny rsync serwer→lokalnie: `content/` (--delete) + `public/assets/` (excl. css/); nowe projekty afrykarium/oceanika/tarnowskie-termy × 12 locale; galerie z assetami; nawigacja PL; stache:refresh OK
- Deploy-css-fix-2026-06-07 ✅ (2026-06-07) — rsync SSH → dev.skalisty.pl; 1 MB / 467 MB, speedup 456×; `show.antlers.html` + `output.css`; post-deploy: cache:clear, view:clear, stache:refresh — OK
- Content-pull-6 ✅ (2026-06-08) — rsync serwer→lokalnie: `content/` (--delete): 3 nowe projekty × 12 locale (baseny-tropikalne, woliera-dzioborozca-zoo-warszawa, wybieg-wydry-europejskiej), pages (home PL/EN/CS/DA/ES, realizacje PL, projects EN), footer.yaml, nawigacja PL; `public/assets/` (excl. css/): galeria/baseny-tropikalne (5 webp), images/strony (5 webp), projekty (2 webp); `users/` profil admina; post-pull: cache:clear, view:clear, stache:refresh — OK
- Backup-5 ✅ (2026-06-08) — `skalisty-orion-backup-5.tar.gz` (344 MB); `backup-projekt/`; wykluczone: node_modules, .git, storage/framework/{cache,sessions,views}, storage/logs
- FEATURE-figma-assets-install ✅ (2026-06-17) — addon `mariohamann/statamic-figma-assets` (MIT) jako lokalny fork w `addons/mariohamann/statamic-figma-assets/`; bump constrainta `statamic/cms: ^5.0` → `^5.0|^6.0` w forku; path repository + require `@dev` w głównym composer.json; config opublikowany w `config/statamic-figma-assets.php`; 3 placeholdery FIGMA_* w `.env`/`.env.example`; hotfix widoku Blade (`statamic::partials.breadcrumb` nie istnieje w Statamic 6 → zastąpiono linkiem `cp_route('utilities.index')`); CP → Utilities → Figma Assets → 200; `php artisan test` 2 passed; brief zarchiwizowany w `briefs/archive/2026-06-17-figma-assets-install.md`
- CLEANUP-icons-containers-remove ✅ (2026-06-17) — usunięcie kontenerów `icons` (Tabler, 5093 SVG, 26 MB) + `icons2` (Hugeicons, 4497 SVG, 21 MB) niewykorzystanych w treści/szablonach (audyt: 0 referencji); pre-task backup `skalisty-orion-backup-6.tar.gz` (356 MB); usunięte `content/assets/icons*.yaml`, dyski `icons`/`icons2` z `config/filesystems.php`, katalogi `public/assets/icons*/` (9590 SVG + 1967 .meta); branded `images/ikony/` (6 SVG) zachowane; redukcja projektu 762→716 MB; `AssetContainer::all()->map->handle()` → `["assets"]`; `php artisan test` 2 passed; HTTP `/`+`/en/` 200, `/cp/login` 302, CP `/cp/assets/browse/assets` + `/cp/utilities/figma-assets` 200; brief zarchiwizowany w `briefs/archive/2026-06-17-cleanup-icons-containers.md`. UWAGA: kontenery + katalogi nigdy nie były w Git — backup-6 jest jedynym punktem przywrócenia.
- REVERT-figma-assets-install ✅ (2026-06-17) — wycofanie addonu Figma Assets zainstalowanego 16:50 (decyzja użytkownika po znalezieniu Iconify); `composer remove mariohamann/statamic-figma-assets`, usunięte: path repo z `composer.json`, `addons/mariohamann/`, `config/statamic-figma-assets.php`, 6 zmiennych konfiguracyjnych z `.env`, 3 placeholdery z `.env.example`; zachowany `FIGMA_TOKEN` w `.env` (na przyszłość per prośba użytkownika); pre-task backup-7 (354 MB) — Codex słusznie wykonał mimo briefowej sugestii „pomiń" (backup-6 był sprzed cleanupu icons); `wysiwyg-html-fieldtype` nietknięty; `Statamic\Facades\Utility::all()` bez `figma_assets`; `php artisan test` 2 passed; HTTP `/` 200, `/en/` 200, `/cp/utilities/figma-assets` 404 (admin); rozmiar 716→712 MB; brief zarchiwizowany w `briefs/archive/2026-06-17-revert-figma-assets-install.md`.
- FEATURE-iconify-install ✅ (2026-06-17) — `eminos/statamic-iconify` v2.1.0 (MIT, natywny `statamic/cms: ^6.0`); czysty `composer require` bez forka; `vendor:publish` configu; `config/statamic-iconify.php` z `allowed_prefixes: [tabler, heroicons, mdi, ph, fa6-solid, fa6-brands, lucide]` + `default_store_as: svg_data` (offline render, zero API calls); assety CP `public/vendor/statamic-iconify/build/` opublikowane; fieldtype `iconify` zarejestrowany (`FieldtypeRepository::handles()` zwraca `["icon","iconify"]`); endpoint `/cp/iconify/config` jako admin → 200 (JSON z prawidłowymi wartościami); `php artisan test` 2 passed; HTTP `/` 200, `/en/` 200, `/cp/login` 302; 0 modyfikacji blueprintów; 2 korekty techniczne Codex (svg→svg_data + poprawna fasada Statamic 6); brief zarchiwizowany w `briefs/archive/2026-06-17-feature-iconify-install.md`. **WAŻNE**: w polach blueprintu używać `store_as: svg_data`.
- FEATURE-icon-box-with-text ✅ (2026-06-17) — wykonane przez Codex bez bieżącego udziału Claude na prośbę użytkownika; nowy set Page Buildera `Icon Box With Text Section`; pliki: `resources/fieldsets/icon_box_with_text_section.yaml`, `resources/views/page_builder/icon_box_with_text_section.antlers.html`, rejestracja w `resources/fieldsets/all_page_builder.yaml`; pole `layout` nad itemami/ikonami; wybór `three_columns`/`four_columns`; ikony przez `iconify` z `store_as: svg_data`; walidacja: `statamic:stache:refresh`, `view:clear`, `php artisan test` 2 passed, HTTP `/` i `/en/` 200; użytkownik potwierdził, że sekcja działa dobrze.
- ICONIFY-magic-translator-check ✅ (2026-06-17) — `FieldDefinitionBuilder` widzi set `icon_box_with_text_section`; `ContentExtractor` wyciąga `section_title`, `items.*.title`, `items.*.description`; pomija `layout` (`select`) i `icon` (`iconify`); na realnym Home PL set jest pod `page_builder.2`; dry-run PL→EN z `--include-stale` pokazuje `1 will re-translate (stale)`.
- ICONIFY-prefix-extension ✅ (2026-06-17) — `config/statamic-iconify.php` rozszerzony o `map`, `temaki`, `maki`, `game-icons`, `bx`, `bxs`, `bxl`; `mdi` było już obecne; `php artisan optimize:clear` OK; `config("statamic-iconify.allowed_prefixes")` pokazuje pełną listę: `tabler`, `heroicons`, `mdi`, `map`, `temaki`, `maki`, `game-icons`, `bx`, `bxs`, `bxl`, `ph`, `fa6-solid`, `fa6-brands`, `lucide`.
- Backup-8 ✅ (2026-06-17 20:33) — `backup-projekt/skalisty-orion-backup-8.tar.gz` (354 MB); backup przed kolejnym krokiem po dokumentacji Iconify; zawiera `skalisty-orion/` oraz główne pliki dokumentacji workspace; wykluczone: `node_modules`, `.git`, `storage/framework/{cache,sessions,views}`, `storage/logs`; kontrola `tar -tzf` potwierdziła obecność dokumentów.
- Deploy-2026-06-17 ✅ — wdrożono na `dev.skalisty.pl` Iconify + `Icon Box With Text Section` + cleanup zdalnych kontenerów `icons/icons2`; przed cleanupem wykonano zdalny backup `~/skalisty_2026-icons-containers-before-delete-2026-06-17.tar.gz`; rsync bez `--delete`, 24.8 MB różnic, 0 plików usuniętych przez rsync; post-deploy: `package:discover`, `optimize:clear`, `config:clear`, `cache:clear`, `view:clear`, `statamic:stache:refresh`, `php84 artisan test` (2 passed); HTTP `/` 200, `/en/` 301→200, `/cp/login` 302; Iconify config na serwerze `svg_data`, prefixy `map` i `mdi` aktywne. Wpis sporządzony przez Codex — Claude audit required.

### Wdrożenie serwera

- dev.skalisty.pl na dhosting — PHP 8.4, MySQL, HTTPS, DEEPL_API_KEY skonfigurowany
- Blokada indeksacji (robots.txt + X-Robots-Tag noindex)

---

## W trakcie

Brak aktywnych zadań. Ostatnie prace Iconify wykonane przez Codex zostały opisane w dokumentacji zastępczo za Claude; Claude ma po powrocie wykonać audyt dokumentacji i zgodności z `AGENTS.md`.

---

### ✅ Ostatnio zamknięte: BUGFIX-cp-collection-listing-stub-filter (2026-06-08)

- Stuby ES (propagate:true, brak `title:` w frontmatter) nie powinny być widoczne w listingu CP
- Fix: `->whereNotNull('data->title')` w `indexQuery()` — czyta surowy frontmatter (nie augmentowane/dziedziczone)
- Odchylenie od briefu: brief zakładał `whereNotNull('title')`, ale `title` w Statamic query dziedziczy z origin → stuby przechodziłyby; `data->title` = surowy frontmatter → poprawne odcięcie stubów
- Codex: ES 13→8, PL=22 bez strat; `php artisan test` 2 passed ✅

---

### ✅ Ostatnio zamknięte: BUGFIX-cp-collection-listing-site-filter (2026-06-08)

- Listing kolekcji w CP nie filtrował po wybranym locale (pokazywał wpisy ze wszystkich 12 locale)
- Fix: IoC binding + override `indexQuery()` z `where('site', Site::selected()->handle())`
- Codex skopiował logikę 1:1 z vendora zamiast wywołać `parent::` (słuszna decyzja — mniej kruche)
- Codex: PL=21, EN=21, DE=12 ✅; `php artisan test` 2 passed ✅

---

### ✅ Ostatnio zamknięte: magic-translator-untranslated-stale-fix (2026-06-07)

- Locale pliki tworzone przez `propagate: true` (tylko `origin:`, brak `magic_translator` metadata) pokazywały się jako "przetłumaczone" (zielony) zamiast "wymaga tłumaczenia" (bursztynowy)
- Fix: `elseif (is_string($currentSourceHash) && $currentSourceHash !== '') { $isStale = true; }` po bloku `if (is_array($meta))` w `MagicTranslatorFieldtype.php`
- Patch: `patches/magic-translator-fieldtype-untranslated-stale.patch` — 6. patch w projekcie; sekwencja: `patches-relock + patches-repatch`
- Runtime weryfikacja: `testtest` locale entries → `is_stale: true` ✅
- `php artisan test` 2 passed ✅; wdrożono lokalnie + serwer

---

### ✅ Ostatnio zamknięte: FAQ-blueprint-localizable-fix (2026-06-07)

- `faq.yaml` brakowało `localizable: true` na `title` i `answer` → FieldClassifier pomijał pola → `$units = []` → metadata "done" bez treści
- Naprawione przez Codex; wdrożono na serwer + stache:refresh
- Istniejące wpisy FAQ (4): użyć "Overwrite existing translations" jednorazowo w CP

---

### ✅ Ostatnio zamknięte: HOTFIX-22-project-url-hardcoded (2026-06-07)

- Zamieniono hardkodowane `href="/project/{{ slug }}"` na `href="{{ url }}"` we wszystkich 8 wskazanych plikach szablonów Antlers
- `grep -Rno 'href="/project/{{ slug }}"' resources/views` → brak wyników ✅
- Renderowany HTML po zmianie:
  - PL → linki projektów pod `/realizacje/{slug}` ✅
  - EN → linki projektów pod `/en/project/{slug}` ✅
- Zmiana bez przebudowy CSS — zgodnie z briefem

---

### ✅ Ostatnio zamknięte: FEATURE-collection-routes-panel (2026-06-07)

- Panel CP Tools > **Trasy URL kolekcji** — edycja `route` kolekcji per język bez edycji YAML ręcznie
- `CollectionRoutesController.php` + 2 widoki Blade (`index`, `edit`) + trasy w `cp.php` + nav w `AppServiceProvider`
- `content/collections/projects.yaml` zmieniony z `route: '/project/{slug}'` na mapę per-site: PL `/realizacje/{slug}`, pozostałe `/project/{slug}`
- Po wdrożeniu: `/realizacje/central-steel-yard` (PL) ✅, `/en/project/central-steel-yard` (EN) ✅

---

### ✅ Ostatnio zamknięte: HOTFIX-21-video-mobile-width (2026-06-07)

- Zmiana breakpointu szerokości odtwarzacza YouTube: `sm:w-[65vw]` → `lg:w-[65vw]` w `our_story_section.antlers.html` linia 45
- Na ekranach < 992px (mobile + tablety) odtwarzacz zajmuje 90vw; od 992px w górę 65vw
- `npm run build` ✅

---

### ✅ Ostatnio zamknięte: project-toggles-content-pull-deploy (2026-06-07)

- Togglei widoczności w blueprincie `projects` — `show_milestones`, `show_team_section`, `show_related_projects` (`default: false`, `if:` w YAML)
- Warunkowe renderowanie w `project/show.antlers.html` — 3 sekcje owinięte `{{ if }}`
- Pull contentu z serwera: galeria strona główna (9 webp), projekt Woliera Argusa (8 webp + 1 featured), nowe wpisy kolekcji, home.md z nowym blokiem galerii
- Naprawiony duplikat ID (`aerotech-engineering-campus.md` → `woliera-argusa.md`): usunięcie starego pliku lokalnie i na serwerze przez SSH
- Deploy przyrostowy → `dev.skalisty.pl` + stache:refresh ✅

---

### ✅ Ostatnio zamknięte: Lightbox-close-fix (2026-06-07)

- Przycisk X zamykający lightbox (`skalisty_gallery_section.antlers.html`) — obok fullscreen
- Click-outside-to-close (`custom.js`, `setupLightbox()`) — klik na `#galleryLightbox` lub `#lightboxMain` zamyka
- Deploy przyrostowy → `dev.skalisty.pl` + stache:refresh

---

### ✅ Ostatnio zamknięte: HOTFIX-20-lang-panel-collision (2026-06-07)

- Guard w `closeLangPanel()` — `!open || hidden` → return bez listenera; eliminuje sierotę przy zamykaniu ukrytego panelu
- Reset w `openLangPanel()` — `remove("hidden", "open") → add("block") → void offsetHeight → add("open")`; zapewnia czysty start od `scale-y-0`
- Plik: tylko `public/assets/js/custom.js`; `php artisan test` 2 passed ✅; UX potwierdzone przez użytkownika ✅

---

### ✅ Ostatnio zamknięte: HOTFIX-19-lang-panel-animation (2026-06-07)

- `void langPanel.offsetHeight` w `openLangPanel()` — reflow przed `add("open")`, animacja otwierania działa
- `transitionend { once: true }` w `closeLangPanel()` — `hidden` dodawane po CSS transition, animacja zamykania działa
- Plik: tylko `public/assets/js/custom.js`; `php artisan test` 2 passed ✅

---

### ✅ Ostatnio zamknięte: Mobile-language-switcher-v2 (2026-06-06)

- Status: zaakceptowane przez Claude
- `header-1.antlers.html`: `#lang-mobile-panel.mobile-nav hidden lg:hidden`; emoji flags; biały kontener z `h-full overflow-y-auto overscroll-contain`
- `custom.js`: `openLangPanel()` / `closeLangPanel()` / `syncMobilePanelViewport()`; `e.preventDefault()` na `<summary>` na mobile; overlay + resize handlers; obustronne zamykanie z hamburger menu

---

## Do wykonania

### 1. Formularze kontaktowe

- Zacząć od natywnych Statamic Forms, addon dobrać do konkretnej potrzeby
- Zakres do ustalenia z użytkownikiem

### 2. EspoCRM Lead Capture

- Integracja formularzy kontaktowych z EspoCRM przez API
- Po wdrożeniu formularzy (punkt 1)

### 3. SEO — wdrożenie batch na końcu projektu ⚡ niski priorytet

Robić jako ostatnie, gdy struktura strony jest gotowa. Całość jednym podejściem batch.

**Etap A — YAML/CP (bez Codexa):**
- `seo-pro.yaml`: `site_name` → `sKalisty`, opisy PL/EN ze starej strony, `twitter_handle: @sztuczne_skaly`, `json_ld_organization_name`, `json_ld_schema` z pełnym Organization (sameAs FB/YT/X, contactPoint, address Wrocław)
- CP per-page: meta descriptions dla stron główna, kontakt, blog, oferta/usługi, realizacje/projekty (treści z audytu 2026-06-06)

**Etap B — Codex:**
- `head-link.antlers.html`: dodać `robots` extended directives (`max-image-preview:large, max-snippet:-1, max-video-preview:-1`) + `apple-touch-icon` 180px
- Stworzyć domyślny OG image 1200×630px + skonfigurować w SEO Pro
- Dla każdej strony docelowej: weryfikacja title template (długość 30–60 znaków)

**Źródło danych:** audyt Claude z 2026-06-06 — wszystkie wartości z żywej strony skalisty.pl udokumentowane w historii sesji.

---

## Status operacyjny

- Frontend: `http://127.0.0.1:8001`
- CP: `http://127.0.0.1:8001/cp`
- Dane administratora: `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/ADMIN_ACCESS.txt`
- Serwer: `dev.skalisty.pl` — ostatni deploy 2026-06-17 (Iconify + Icon Box With Text + cleanup remote icons/icons2)
- Ostatni backup lokalny: `backup-projekt/skalisty-orion-backup-8.tar.gz` (354 MB, 2026-06-17)
- Uwagi:
  - Serwer: `php artisan serve --host=127.0.0.1 --port=8001`
  - Magic Translator wymaga queue worker: `php artisan queue:work`
  - Nie mieszać `localhost` i `127.0.0.1`
