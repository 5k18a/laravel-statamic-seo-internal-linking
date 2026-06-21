# CLAUDE_MEMORY.md
# Pamięć projektu Skalisty — plik utrzymywany przez Claude
# Lokalizacja: /home/pestycyd/Dokumenty/Skalisty-New-2/CLAUDE_MEMORY.md
# Aktualizowany po każdym zakończonym zadaniu

<!-- PROJECT_SYNC_START -->
state_version: 2026-06-21-EOD
active_task_id: none
active_task_name: Brak aktywnego zadania
active_task_status: closed
active_task_source: BRIEF_CODEX.md
last_sync: 2026-06-21 21:30 Europe/Warsaw
last_synced_by: Claude
last_closed: HOTFIX-gallery-tags-fieldtype
next_after_active: Wybór z backlogu (cleanup demo Orion content / chatbot AI PoC / Formularze kontaktowe / pozostałe warianty Services Grid)
<!-- PROJECT_SYNC_END -->

> **Stała lokalnego dev (2026-06-20)**: frontend działa na `http://127.0.0.1:8001/` (nie `8000`). Komenda PHP lokalnie: `php artisan` (na serwerze: `php84`). Te stałe stosować w briefach walidacyjnych.

---

## Aktualny stan projektu

Projekt `skalisty-orion` jest aktywną instalacją Laravel 13 + Statamic 6 opartą o motyw Orion.

- Workspace: `/home/pestycyd/Dokumenty/Skalisty-New-2/`
- Kod aplikacji: `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/`
- Frontend: `http://127.0.0.1:8001`
- CP: `http://127.0.0.1:8001/cp`
- Stack: Laravel 13.16.1 + Statamic 6.21.0 + PHP 8.4
- Motyw: `webbycrown/orion-statamic-theme`
- Git: branch `main`, remote `https://github.com/5k18a/skalisty-laravel.git`

### Wykonane etapy

| Etap | Status |
|------|--------|
| Instalacja i motyw Orion | ✅ Gotowe |
| Scroll lock fix (popupy) | ✅ Gotowe |
| Yellow branding | ✅ Gotowe |
| Multisite pl/en | ✅ Gotowe |
| Language switcher (dropdown) | ✅ Gotowe |
| Page builder localizability fix | ✅ Gotowe |
| Magic Translator + DeepL | ✅ Działa |
| Super Admin Toolbar | ✅ Działa |
| Globals origin fix (8 plików) | ✅ Gotowe — pola PL edytowalne w CP |
| Navigation collections fix | ✅ Gotowe — natywny „Add Link to Entry" aktywny |
| Bug: TypeError navigation entries picker | ✅ Naprawiony — `listable: false` w blueprintach |
| Kontener assets — przywrócenie po usunięciu | ✅ Gotowe |
| Czcionka El Messiri → Syne | ✅ Gotowe — Syne obsługuje polskie znaki |
| 10 nowych locale + fallback 302 | ✅ Gotowe — `/de/` etc. → 302 do PL |
| Free Text Section (page builder) | ✅ Gotowe — fieldset + widok + wysiwyg_html z `container: assets` |
| Kontener Icons (Tabler, 5093 SVG) | ✅ Gotowe — dysk `icons`, kontener `icons` |
| Kontener Icons2 (Hugeicons, 4497 SVG) | ✅ Gotowe — dysk `icons2`, kontener `icons2` |
| Free Text Section — tryb HTML (tymczasowy) | ✅ Częściowo — 3 pola (bard/select/code), bez synchronizacji |
| Etap 3e — dropdown H1–H6 w toolbarze WYSIWYG | ✅ Gotowe — potwierdzone |
| Free Text — opcja „Pełna szerokość bez ramki" | ✅ Gotowe — zero marginesów na wszystkich stronach |
| WYSIWYG — CSS zaznaczania obrazków | ✅ Gotowe — cursor pointer + niebieski outline |
| Etap 3f — BubbleMenu dla obrazków | ✅ Gotowe — potwierdzone |
| HOTFIX 7 — dropdown ⋯ w asset-browserze (z-index reka-ui) | ✅ Gotowe — potwierdzone |
| HOTFIX 8 — WYSIWYG pełna szerokość (max-width: none) | ✅ Gotowe — potwierdzone |
| Addon wysiwyg-html-fieldtype — Etap 1 boilerplate | ✅ Gotowe |
| Addon wysiwyg-html-fieldtype — Etap 2 PHP Fieldtype | ✅ Gotowe — `augment()` → `HtmlString` |
| Addon wysiwyg-html-fieldtype — Etap 3 Vue component | ✅ Build OK, IIFE format, vue externalizowane |
| Addon wysiwyg-html-fieldtype — Etap 4 Page Builder | ✅ Gotowe — Free Text + nowy blok HTML Editor |
| HOTFIX — nazwa komponentu Vue (`wysiwyg_html-fieldtype`) | ✅ Naprawiony handle w addon.js |
| HOTFIX — symlink publiczny addon.js | ✅ `public/vendor/.../js/addon.js` → symlink |
| HOTFIX — walidacja IIFE (bez zmian kodu) | ✅ Potwierdzono IIFE format i brak `@statamic/cms` |
| Komponent rejestruje się w CP | ✅ Użytkownik potwierdził — błąd "Component does not exist" zniknął |
| Etap 3b — fix sync + link + fullscreen | ✅ Gotowe — potwierdzone |
| Etap 3c — fullscreen Teleport + 7 przycisków | ✅ Gotowe — potwierdzone |
| Etap 3d — przycisk 📁 + asset-browser (HOTFIX 4–6) | ✅ Gotowe — potwierdzone (2026-06-01) |
| Etap 6a — Columns Section (osobny blok) | ✅ Gotowe |
| Etap 6b — Układ kolumnowy w Free Text | ✅ Gotowe — layout_mode select + Replicator |
| Wdrożenie na dev.skalisty.pl | ✅ Gotowe — dhosting, PHP 8.4, MySQL, HTTPS |
| Blokada indeksacji (robots.txt + X-Robots-Tag) | ✅ Gotowe — noindex na środowisku dev |
| Hotfix: `container: assets` w 4 fieldsetach | ✅ Gotowe — lokalnie + serwer |
| Kopia bezpieczeństwa #2 | ✅ `skalisty-orion-backup-2/` (735 MB) |
| HOTFIX 10 — Magic Translator fieldset imports | ✅ Gotowe — 116 jednostek przetłumaczone |
| HOTFIX 11 — Magic Translator group type support | ✅ Gotowe — ekstrakcja potwierdzona |
| Migracja origin PL=bazowy EN=lokalizacja | ✅ Gotowe — 270 plików, flip_origins.php usunięty |
| HOTFIX 12 — EN globals dziedziczenie z PL | ✅ Gotowe — EN dziedziczy z PL, button przetłumaczony |
| HOTFIX 13 — contact_section container: assets | ✅ Gotowe (2026-06-02) — `/contact-us` status=200 |
| Feature-show-search + HOTFIX-14 — toggle search w CP | ✅ Gotowe (2026-06-02) — toggle działa |
| HOTFIX-15 — mobile menu reset przy resize | ✅ Gotowe (2026-06-02) — `hidden`/`block` reset w resize handler |
| Frontend string translation | ✅ Gotowe (2026-06-02) — lang/pl.json + 20 widoków |
| UI-Translations-Panel — panel CP + JSON dla 10 języków | ✅ Gotowe (2026-06-02) |
| HOTFIX blog_section — Load More hardcoded | ✅ Gotowe (2026-06-02) |
| HOTFIX-16 — wysiwyg_html translation support (FieldClassifier + localizable) | ✅ Gotowe (2026-06-02) |
| Translator-API-Panel — panel CP Tools > DeepL API key | ✅ Gotowe (2026-06-02) — GET/POST `/cp/translator-api`, TranslatorApiController |
| HOTFIX-17 — DeepL tag_handling xml → html | ✅ Gotowe (2026-06-05) — PL→CS działa, 124 units DONE |
| Auto-start-queue-worker — worker startuje automatycznie po JobQueued | ✅ Gotowe (2026-06-05) — działa lokalnie i na serwerze (sync mode) |
| Logo-fix — logo ucięte na laptopie | ✅ Gotowe (2026-06-05) — header max-w poszerzony, footer height-based |
| Zabezpieczenie-patchy-vendora | ✅ Gotowe (2026-06-05) — cweagans/composer-patches ^2.0, 4 patche, patches.lock.json |
| SEO-Pro | ✅ Gotowe (2026-06-05) — statamic/seo-pro ^7.10, {{ seo_pro:meta }}, Site Defaults PL+EN, sitemap |
| HOTFIX-18 — Locales proc_open fallback | ✅ Gotowe (2026-06-05) — patch statamic/cms, CP Settings > Sites działa na dhosting |
| Logo-fix CSS rebuild + xl/1xl korekta + SVG→PNG | ✅ Gotowe (2026-06-06) — header-1 `xl:max-w-[300px] 1xl:max-w-[340px]`; PNG 594×120px (Inkscape); setting.yaml zaktualizowany |
| YouTube iframe — our_story_section | ✅ Gotowe (2026-06-06) — `<iframe data-src>` + `toEmbedUrl()` w custom.js |
| Skalisty Gallery Section — nowy blok galerii | ✅ Gotowe (2026-06-06) — fieldset + widok + rejestracja w all_page_builder; max_files: 1 usunięty |
| Mobile-language-switcher-v2 — mobilny panel języków | ✅ Gotowe (2026-06-06) — `#lang-mobile-panel.mobile-nav`; emoji flags; JS toggle+viewport+overlay; zaakceptowane przez Claude |
| HOTFIX-19 — animacja lang panel (reflow + transitionend) | ✅ Gotowe (2026-06-07) — `void offsetHeight` przed `add("open")`; `transitionend { once: true }` przy zamykaniu |
| HOTFIX-20 — kolizja paneli nav i lang (guard + reset) | ✅ Gotowe (2026-06-07) — guard `!open\|\|hidden` w `closeLangPanel`; `remove("hidden","open")` w `openLangPanel` |
| Globals i18n — touch_with_us (10 języków) | ✅ Gotowe (2026-06-06) — DeepL; komenda `globals:translate`; `content/globals/{sv,no,nl,lv,it,fr,es,de,da,cs}/touch_with_us.yaml` |
| Lang i18n — 35 kluczy, 12 języków | ✅ Gotowe (2026-06-06) — `lang/en.json` 35 kluczy; `lang/pl.json` kompletny; 10 plików `lang/*.json` wypełnione DeepL; komenda `lang:translate` |
| BUGFIX-blog-image-section | ✅ Gotowe (2026-06-18) — `{{ image }}` → `{{ images }}` w 4 szablonach bloga; lightbox fix (`js-gallery`, `href="javascript:;"`); nowy partial `gallery-lightbox.antlers.html` |
| FEATURE-back-now-i18n | ✅ Gotowe (2026-06-18) — `BACK NOW` → `{{ trans key="Back Now" }}` w 4 plikach; klucz 36 w `lang/en.json` (PL: "Wróć"); 10 locales przetłumaczone DeepL |
| BUGFIX-logo-proportions | ✅ Gotowe (2026-06-18) — `header-1/4`: `h-* max-w-full w-auto` → `max-h-* h-auto w-auto max-w-full`; `npm run build` (max-h-* brakowało w output.css) |
| Form labels {{ trans }} fix — 7 widoków | ✅ Gotowe (2026-06-06) — `{{ display }}` → `{{ trans :key="display" }}` w `let-connect-section`, `career`, `quotation`, `blog-detail-one/two/three/four` |
| Lightbox-close-fix — X + click-outside | ✅ Gotowe (2026-06-07) — przycisk X obok fullscreen; `$("#galleryLightbox").on("click",...)` w `setupLightbox()`; deploy → dev.skalisty.pl |
| Project-toggles — widoczność 3 sekcji | ✅ Gotowe (2026-06-07) — `show_milestones`, `show_team_section`, `show_related_projects` w blueprint + `{{ if }}` w widoku; `default: false` |
| Content-pull + duplikat-ID fix | ✅ Gotowe (2026-06-07) — galeria strona główna, projekt Woliera Argusa; usunięto stary `aerotech-engineering-campus.md` (duplikat ID) lokalnie i SSH |
| SEO-Pro-404-fix | ✅ Gotowe (2026-06-07) — `SEO_PRO_TRACK_ERRORS=true` + `QUEUE_CONNECTION=sync` lokalnie i na serwerze; śledzenie 404 działa |
| Tailwind-plugins | ✅ Gotowe (2026-06-07) — `@tailwindcss/typography` v0.5.19 + `@tailwindcss/forms` v0.5.11; `@plugin` w `tailwind.css`; `npm run build` ✅ |
| HOTFIX-21 — szerokość wideo YouTube mobile | ✅ Gotowe (2026-06-07) — `sm:w-[65vw]` → `lg:w-[65vw]` w `our_story_section.antlers.html:45`; 90vw < 992px, 65vw ≥ 992px |
| FEATURE-collection-routes-panel | ✅ Gotowe (2026-06-07) — panel CP Tools > Trasy URL kolekcji; `CollectionRoutesController` + 2 widoki Blade; `projects.yaml`: PL `/realizacje/{slug}`, EN `/project/{slug}` |
| HOTFIX-22-project-url-hardcoded | ✅ Gotowe (2026-06-07) — zamiana `href="/project/{{ slug }}"` → `href="{{ url }}"` w 8 wskazanych plikach; renderowany HTML daje `/realizacje/{slug}` na PL i `/en/project/{slug}` na EN |
| Nawigacja CP — 12 języków (navigation trees) | ✅ Gotowe (2026-06-07) — `content/navigation/main.yaml` + klucz `sites:` z 12 locale; 10 nowych pustych plików `content/trees/navigation/{sv,no,nl,lv,it,fr,es,de,da,cs}/main.yaml` (każdy: `tree: []`); wszystkie języki widoczne w CP > Content > Navigation |
| Poprawka UX — przyciski Zapisz w panelach CP | ✅ Gotowe (2026-06-07) — 3 widoki Blade: `cp/collection_routes/edit.blade.php`, `cp/ui_translations/edit.blade.php`, `cp/translator_api/index.blade.php`; zastosowano Tailwind classes z komponentu Statamic Vue Button: `relative inline-flex items-center justify-center px-4 h-10 text-sm font-medium rounded-lg bg-linear-to-b from-primary/90 to-primary hover:bg-primary-hover text-white border border-primary-border shadow-ui-md cursor-pointer`; `--color-primary` to custom property CP z automatyczną zmianą przy zmianie motywu |
| Globals — pliki locale dla 12 języków | ✅ Gotowe (2026-06-07) — 72 puste pliki YAML dla 8 globalnych × brakujące locale; przed fix: CP Globals pokazywał tylko PL+EN w dropdownie; przyczyna identyczna jak navigation trees — Statamic wymaga fizycznego pliku per locale; pliki puste (dziedziczą z PL przez `origin`); wdrożone na serwer |
| Sync content online→offline | ✅ Gotowe (2026-06-07) — pulled: `content/globals/pl/footer.yaml`, `collections/pages/{pl,en,cs,da}/home.md`, `trees/navigation/pl/main.yaml`, `globals/pl/theme_settings.yaml`, `public/assets/images/identyfikacja-strony/marcin-skibicki-skalisty-group.jpg` |
| Sync content online→offline #2 | ✅ Gotowe (2026-06-07) — pulled: `pages/pl/home.md`, `pages/en/home.md` (edytowane w CP), 4 nowe FAQ × 12 języków (48 plików); stache:refresh + cache:clear |
| FAQ blueprint localizable fix | ✅ Gotowe (2026-06-07) — `localizable: true` na `title` i `answer` w `faq.yaml`; bez tego FieldClassifier pomijał pola i tłumaczenia FAQ nie działały; wdrożono lokalnie + serwer + stache:refresh |
| Sync content online→offline #3 | ✅ Gotowe (2026-06-07) — pulled: `public/assets/images/strony/jaszczurka-faq.webp` + meta (brakująca grafika sekcji FAQ na home); 8 tłumaczeń ES kolekcji faqs; testtest.md × 12 locale; stache:refresh + cache:clear |
| Sync content online→offline #4 | ✅ Gotowe (2026-06-07) — pulled: `pages/es/home.md` (nowy katalog ES), `trees/collections/es/pages.yaml`, zaktualizowane pages cs/da/en/pl; katalog `es/` wcześniej nie istniał lokalnie przez co rsync --update go pomijał |
| Magic Translator: untranslated locale stale fix | ✅ Gotowe (2026-06-07) — `MagicTranslatorFieldtype.php`: dodano `elseif` gdy locale istnieje ale brak `magic_translator` metadata → `is_stale: true`; patch `magic-translator-fieldtype-untranslated-stale.patch`; sekwencja: `patches-relock + patches-repatch`; wdrożono lokalnie + serwer |
| HOTFIX-23 — MT sidebar: PL origin bursztyn→zielony | ✅ Gotowe (2026-06-08) — `$originSite` dodany do `use()` closure + guard `$siteHandle !== $originSite`; patch zaktualizowany |
| HOTFIX-24 — MT sidebar: stub locale bursztyn→czerwony | ✅ Gotowe (2026-06-08) — `$isStale = true` → `$exists = false` w elseif; patch zaktualizowany; 2 passed |
| BUGFIX-cp-site-switcher — przełącznik języków w CP | ✅ Gotowe (2026-06-08) — IoC binding `Statamic\SelectSiteController` → `App\SelectSiteController`; `Entry::find()->in($site)->editUrl()` redirect; 2 passed |
| BUGFIX-cp-collection-listing-site-filter — listing pokazywał wpisy ze wszystkich locale | ✅ Gotowe (2026-06-08) — Codex: IoC binding + override `indexQuery()` z `where('site', Site::selected())`; PL=21, EN=21, DE=12 ✅; 2 passed |
| BUGFIX-cp-collection-listing-stub-filter — stuby propagate:true widoczne w listingu | ✅ Gotowe (2026-06-08) — Codex: `->whereNotNull('data->title')` (surowy frontmatter); ES 13→8, PL=22 bez strat; odchylenie od briefu: `data->title` zamiast `title` (słuszne — `title` dziedziczy przez origin) ✅; 2 passed |
| Deploy — dev.skalisty.pl (2026-06-08) | ✅ Wdrożono — rsync 1.15 MB / 463 MB, speedup 297×; stache:refresh OK |
| CSS fix — Bard paragraphs (Overview projektu) | ✅ Gotowe (2026-06-07) — `show.antlers.html:26` owinięty w `[&>p]:mb-4 [&>p:last-child]:mb-0`; `npm run build` |
| Content pull #5 — pełny sync serwer→offline | ✅ Gotowe (2026-06-07) — rsync `content/` (--delete) + `public/assets/` (excl. css/); nowe projekty afrykarium/oceanika/termy × 12 locale, galerie, nawigacja; stache:refresh OK |
| Deploy — CSS fix Bard paragraphs | ✅ Wdrożono (2026-06-07) — `show.antlers.html` + `output.css`; rsync 1 MB / 467 MB, speedup 456×; stache:refresh OK |
| Content pull #6 — sync serwer→offline | ✅ Gotowe (2026-06-08) — `content/` (--delete): 3 nowe projekty × 12 locale (baseny-tropikalne, woliera-dzioborozca-zoo-warszawa, wybieg-wydry-europejskiej), pages home (PL/EN/CS/DA/ES), realizacje PL, projects EN, footer.yaml, nawigacja PL; `public/assets/` (excl. css/): galeria/baseny-tropikalne (5 webp), images/strony (5 webp), projekty (2 webp); `users/` profil admina; post-pull: cache:clear, view:clear, stache:refresh OK |
| Backup-5 | ✅ Gotowe (2026-06-08) — `skalisty-orion-backup-5.tar.gz` (344 MB); `backup-projekt/`; wykluczone: node_modules, .git, storage/framework/{cache,sessions,views}, storage/logs |
| FEATURE-iconify-install | ✅ Gotowe (2026-06-17) — `eminos/statamic-iconify` v2.1.0; `default_store_as: svg_data`; prefixy startowe: `tabler`, `heroicons`, `mdi`, `ph`, `fa6-solid`, `fa6-brands`, `lucide` |
| FEATURE-icon-box-with-text | ✅ Gotowe (2026-06-17, Codex bez bieżącego Claude) — nowy set Page Buildera `Icon Box With Text Section`; layout 3/4; ikony z `iconify`; użytkownik potwierdził poprawne działanie |
| ICONIFY-magic-translator-check | ✅ Sprawdzone (2026-06-17, Codex) — Magic Translator widzi `section_title`, `items.*.title`, `items.*.description`; Home EN wymaga ponownego tłumaczenia z PL, jeśli ma dostać nowy blok |
| ICONIFY-prefix-extension | ✅ Gotowe (2026-06-17, Codex) — dodane prefixy `map`, `temaki`, `maki`, `game-icons`, `bx`, `bxs`, `bxl`; `mdi` było już obecne |
| Backup-8 | ✅ Gotowe (2026-06-17 20:33, Codex) — `backup-projekt/skalisty-orion-backup-8.tar.gz` (354 MB); zawiera `skalisty-orion/` + główne pliki dokumentacji workspace; wykluczone cache, logi, sesje, views, `.git`, `node_modules` |
| Deploy-2026-06-17 | ✅ Wdrożono (2026-06-17, Codex) — `dev.skalisty.pl`: Iconify + `Icon Box With Text Section` + cleanup zdalnych kontenerów `icons/icons2`; remote backup starych ikon; `php84 artisan test` 2 passed |
| BUGFIX-sticky-header-default | ✅ Gotowe (2026-06-18, Codex) — `<body data-header-type>` + przepisany blok sticky w `custom.js`; `switcherVisible` + `serverHeaderType`; czyszczenie stale localStorage; 2 passed |
| FEATURE-logos-slider-with-icons | ✅ Gotowe (2026-06-18, Codex) — nowy set Page Buildera; fieldset + widok; ikony Iconify (`fill-current` + `text-white`); rejestracja w `all_page_builder.yaml` |
| BUGFIX-slider-seamless-loop | ✅ Gotowe (2026-06-18) — duplikacja `{{ logos }}`/`{{ text_slider }}` w `trusted_partners_section`, `logos_slider_with_icons`, `text_slider_section`; drugi zestaw `aria-hidden="true"` |
| FEATURE-completion-year-sort | ✅ Gotowe (2026-06-19, Codex) — blueprint `completion_year` (integer, sidebar); computed field `completion_year_sort` w `AppServiceProvider`; `sort_field: completion_year_sort` w `projects.yaml`; 3 tagi `collection:projects`; `/realizacje` posortowane malejąco |
| UPDATE-statamic-6.20.3 | ✅ Gotowe (2026-06-19, Codex) — `statamic/cms` v6.20.3; patch HOTFIX-18 nałożony; 2 passed |
| UPDATE-statamic-6.21.0 | ✅ Gotowe (2026-06-19) — `statamic/cms` v6.21.0; patch HOTFIX-18 nałożony bez konfliktów; deploy na serwer; 2 passed |
| FEATURE-blueprint-details-defaults | ✅ Gotowe (2026-06-19) — 4 pre-wypełnione Info Items w replicatorze `details` blueprinta `projects`; deploy celowany |
| SYNC-orientarium | ✅ Gotowe (2026-06-19) — nowy projekt `orientarium` zsynchronizowany z serwera (PL + 11 locale + galeria) |
| BUGFIX-icon-box-center-icon | ✅ Gotowe (2026-06-19) — `mx-auto` na kontenerze ikony w `icon_box_with_text_section.antlers.html`; deploy na serwer; 2 passed |
| FEATURE-services-icon-iconify | ✅ Gotowe (2026-06-19, Codex) — pole `icon` w `service.yaml` przywrócono do `assets`; nowe pole `icon_svg` (type: iconify, store_as: svg_data); 5 podmian ikon w `service_section.antlers.html` na `{{ iconify:icon_svg }}` z fallbackiem `{{ icon }}<img...>{{ /icon }}`; 2 passed; deploy na serwer |
| FEATURE-service-bard-sets-render | ✅ Gotowe (2026-06-19/20, Codex) — `service/show.antlers.html`: `{{ content }}` prosty tag → pętla `{{ content }}...{{ /content }}` z 8 gałęziami `if/elseif` (quote_section, list_section, image_section, dynamic_table, gallery_section, skalisty_gallery_section, instagram_gallery_section, faq_section) + `{{ else }}{{ text }}`; `npm run build` (potrzebny dla `even:bg-gray-50`); 2 passed |
| Refactor-bard-sections-no-title | ✅ Gotowe (2026-06-20) — usunięto `section_title` z 3 setów Bard (gallery_section, skalisty_gallery_section, faq_section); zastąpiono partial page_buildera inline HTML z jednolitym wrapper `container 2xl:py-[70px]...`; dodano `{{ partial:gallery-lightbox }}`; npm run build |
| Deploy-2026-06-20 | ✅ Wdrożono (2026-06-20) — `dev.skalisty.pl`: service.yaml + service_section.antlers.html + service/show.antlers.html + output.css + architectural-design.md; view:clear, cache:clear, stache:refresh; php83 artisan test → 2 passed |

---

## Kluczowe decyzje

1. **Multisite, nie wtyczka** — wielojęzyczność oparta wyłącznie o natywny Statamic multisite. PL = `/`, EN = `/en/`.
2. **Content translation vs string translation** — rozdzielone. Magic Translator + DeepL tylko dla treści CMS. Napisy UI przez `lang/pl.json` + `{{ trans key="..." }}` (JSON approach, analogiczny do WordPress .po/.pot).
3. **Orion jako baza** — motyw Orion nie jest zastępowany, tylko adaptowany. Nie wracamy do ręcznej migracji HTML.
4. **Origin globals: pl = origin, en = dziedziczy** — po naprawa 8 plików globals pola PL są edytowalne w CP.
5. **Natywny selector entries w nawigacji** — wystarczyło dodać `collections:` do `content/navigation/main.yaml`. Nie trzeba było modyfikować blueprintu ani renderera.
6. **Git z remote — `origin` → `https://github.com/5k18a/skalisty-laravel.git`; push na koniec sesji** — do czasu decyzji użytkownika.
7. **`.gitignore` rozszerzony** — `ADMIN_ACCESS.txt` i `/users/*.yaml` są ignorowane przez git.
8. **APP_URL = `127.0.0.1`, nie `localhost`** — unikanie problemów z sesją i toolbarem.
9. **Logo PNG zamiast SVG** — SVG renderowało inaczej w Firefox (font Overpass nie ładowany przez stronę); PNG 594×120px 2x generowane Inkscape.
10. **Skalisty Gallery Section jako własny blok** — modyfikacja oryginalnego gallery_section Oriona ryzykowna przy aktualizacji motywu; własne pliki `skalisty_*` są bezpieczne.
11. **EspoCRM Lead Capture** — wybrany mechanizm integracji dla formularzy: `POST /api/v1/LeadCapture/{apiKey}` bez auth headers; apiKey z EspoCRM Administration → Lead Capture.

---

## Środowisko produkcyjne / staging

| Parametr | Wartość |
|----------|---------|
| URL | https://dev.skalisty.pl |
| Hosting | dhosting.pl |
| SSH | `skalisty-ssh` (lokalny skrypt z sshpass) |
| Katalog na serwerze | `~/skalisty_2026/` |
| Document root | `~/skalisty_2026/public/` |
| PHP | 8.4 (binarka: `/opt/alt/php84/usr/bin/php`) |
| DB | MySQL — dane w `server_deploy/SERWER_DOSTEP.txt` |
| APP_ENV | `local` (świadoma decyzja — pomija licencję Statamic Pro) |
| Statamic na serwerze | v6.21.0 (zaktualizowane 2026-06-19) |
| Ostatni deploy | 2026-06-19 — BUGFIX-icon-box-center-icon (rsync 748 KB); wcześniej: statamic 6.21.0 + completion-year-sort + blueprint-defaults |
| Ostatni content pull | 2026-06-19 — orientarium (PL + 11 locale + galeria) + completion_year daty |
| Ostatni backup lokalny | 2026-06-17 — `skalisty-orion-backup-8.tar.gz` (354 MB) |
| Dokumentacja | `server_deploy/DEPLOYMENT.md` |

Kluczowe decyzje deploymentu:
- `APP_ENV=local` na serwerze — Statamic Pro wymaga licencji na `production`; `local` pomija ten check
- `STATAMIC_PRO_ENABLED=true` wymagane w `.env` dla multisajtu (brakowało w `.env.production`)
- `storage/framework/{views,sessions,cache/data}/` wykluczone z rsync — muszą mieć `.gitkeep` lokalnie
- Po każdym deployu: `vendor:publish --tag=wysiwyg-html-fieldtype` + `statamic:stache:refresh`
- Na dhosting zawsze używać pełnej ścieżki PHP: `/opt/alt/php84/usr/bin/php` (nie `php` ani `php84`)
- `MAGIC_TRANSLATOR_QUEUE_CONNECTION=sync` na serwerze (exec/shell_exec niedostępne w web PHP-FPM)

---

## Aktualna architektura

```
/home/pestycyd/Dokumenty/Skalisty-New-2/
├── .git/                         ← git repo (na poziomie workspace)
├── skalisty-orion/               ← AKTYWNY PROJEKT
│   ├── .git                      ← plik tekstowy: "gitdir: ../.git"
│   ├── public/.htaccess          ← Force HTTPS + X-Robots-Tag noindex (bezpieczne lokalnie — php artisan serve ignoruje)
│   ├── lang/
│   │   ├── en/validation.php     ← walidacja Laravel
│   │   ├── en.json               ← 35 kluczy UI (źródło dla CP Translations UI)
│   │   ├── pl.json               ← 35 polskich tłumaczeń
│   │   └── {sv,no,nl,lv,it,fr,es,de,da,cs}.json ← 35 kluczy per język (DeepL)
│   ├── app/Console/Commands/
│   │   ├── TranslateGlobalSet.php ← `globals:translate {global}` — tłumaczy globals przez DeepL
│   │   └── TranslateLangFiles.php ← `lang:translate` — tłumaczy lang/*.json przez DeepL
│   ├── resources/
│   │   ├── sites.yaml            ← multisite config
│   │   └── views/                ← widoki Antlers
│   ├── content/
│   │   ├── globals/              ← globals (origin fix wykonany)
│   │   └── navigation/main.yaml  ← nawigacja (collections fix wykonany)
│   ├── config/statamic/
│   │   ├── system.php            ← multisite, locale
│   │   └── magic-translator.php  ← DeepL config
│   └── public/assets/js/custom.js ← scroll fix, theme persistence
├── skalisty-orion-backup/        ← kopia zapasowa z 2026-05-31 (v1.0)
├── skalisty-orion-backup-2/      ← kopia zapasowa z 2026-06-01 (po deployu)
├── server_deploy/
│   ├── DEPLOYMENT.md             ← dokumentacja wdrożenia (OBOWIĄZKOWA aktualizacja po każdej zmianie na serwerze)
│   ├── SERWER_DOSTEP.txt         ← dane dostępowe serwera (WRAŻLIWE)
│   └── www/                      ← paczka do deployu (rsync z skalisty-orion/)
└── CLAUDE_MEMORY.md              ← ten plik
```

Multisite:
- `pl` pod `/` — primary, null origin
- `en` pod `/en/` — origin: pl

---

## Otwarte pytania

1. Kiedy użytkownik zdecyduje o wdrożeniu formularzy i zakresie integracji z EspoCRM?

## Zaplanowane zadania (kolejność)

| # | Zadanie | Priorytet |
|---|---------|-----------|
| 1 | Formularze kontaktowe (Statamic Forms) | normalny |
| 2 | EspoCRM Lead Capture | normalny (po #1) |
| 3 | SEO batch — po ukończeniu struktury strony | **niski — na koniec** |
| 4 | AI Meta Descriptions — `meta:generate` Artisan, Claude API, batch SEO Pro | pomysł — niepodjęty |
| 5 | Smart Search — Meilisearch Scout driver + AI sugestie fraz | pomysł — niepodjęty |
| 6 | Tracking fraz wyszukiwania + linki w stopce | pomysł — niepodjęty |

SEO zadanie #3: audyt wykonany 2026-06-06, dane z skalisty.pl udokumentowane w PROJECT_STATUS_CODEX.md → sekcja "Do wykonania / 3. SEO".

Zadania #4–6: pomysły zgłoszone 2026-06-19 w kontekście SEO 100/100. Szczegóły techniczne w PROJECT_STATUS_CODEX.md → sekcja "Do wykonania / 4–6". Użytkownik jeszcze nie podjął decyzji o wdrożeniu.

---

## Ryzyka

1. **Brak remote git** — utrata lokalnych plików = utrata historii. Backup w `skalisty-orion-backup/` zabezpiecza tylko aktualny stan.
2. **SEO Pro licencja** — $75 wymagana przy deploy na produkcję (obecnie `APP_ENV=local` na serwerze dev).

---

## Aktywny brief

Brak aktywnego zadania. Sesja 2026-06-21 zamknięta — 6 zadań + 5 deployów + sync z serwera. Last closed: `HOTFIX-gallery-tags-fieldtype`. Czeka na decyzję usera o kolejnym priorytecie z backlogu.

## Ostatnio zamknięte

**BUGFIX-icon-box-center-icon** ✅ 2026-06-19 — `mx-auto` na kontenerze ikony (h-[38px] w-[38px]) w `icon_box_with_text_section.antlers.html:11`; ikona wyśrodkowana poziomo, tytuł i opis z lewej; `mx-auto` była już w `output.css`; deploy + 2 passed.

**SYNC-orientarium** ✅ 2026-06-19 — nowy projekt tematyzacji orientarium zsynchronizowany z serwera.

**FEATURE-blueprint-details-defaults** ✅ 2026-06-19 — 4 Info Items domyślne w replicatorze `details` blueprinta `projects`.

**UPDATE-statamic-6.21.0** ✅ 2026-06-19 — `statamic/cms` v6.21.0 lokalnie + serwer; patch HOTFIX-18 bez konfliktów.

**Content-pull-6 + Backup-5** ✅ 2026-06-08 — rsync serwer→lokalnie: `content/` (--delete): 3 nowe projekty × 12 locale (baseny-tropikalne, woliera-dzioborozca-zoo-warszawa, wybieg-wydry-europejskiej); `public/assets/` (excl. css/): galeria/baseny-tropikalne (5 webp), images/strony (5 webp), projekty (2 webp); `users/` profil admina; post-pull: stache:refresh OK. Backup `skalisty-orion-backup-5.tar.gz` 344 MB.

**BUGFIX-cp-collection-listing-stub-filter** ✅ 2026-06-08 — Codex: `->whereNotNull('data->title')` ukrywa stuby z propagate:true; ES 13→8, PL=22 bez strat; odchylenie od briefu: `data->title` zamiast `title` (słuszne — `title` w Statamic query dziedziczy przez origin, `data->title` czyta surowy frontmatter); `php artisan test` 2 passed.

**BUGFIX-cp-collection-listing-site-filter** ✅ 2026-06-08 — Codex: IoC binding `Statamic\EntriesController` → `App\EntriesController`; override `indexQuery()` z `where('site', Site::selected()->handle())`; PL=21, EN=21, DE=12 dla kolekcji faqs ✅; `php artisan test` 2 passed.

**BUGFIX-cp-site-switcher** ✅ 2026-06-08 — globalny przełącznik języków w CP nie przeładowywał edytowanego wpisu; IoC binding `Statamic\SelectSiteController` → `App\SelectSiteController`; `Entry::find()->in($site)->editUrl()` redirect dla entry edit URLs; fallback `back()` dla pozostałych widoków. Zaimplementowane przez Claude bezpośrednio (wyjątek od AGENTS.md).

**HOTFIX-24** ✅ 2026-06-08 — stub locale (brak `magic_translator` metadata) pokazywał bursztyn ⚠ zamiast czerwieni — `$isStale = true` → `$exists = false` w elseif; patch zaktualizowany przez Codex.

**HOTFIX-23** ✅ 2026-06-08 — PL origin locale pokazywał bursztyn zamiast zieleni — `$originSite` nie był w `use()` closure; patch zaktualizowany przez Codex.

## Ostatnie zamknięte briefy

**globals-i18n-lang-translations** ✅ 2026-06-06 — touch_with_us global przetłumaczony na 10 języków przez DeepL (`globals:translate`); `lang/en.json` uzupełniony do 35 kluczy; `lang/pl.json` kompletny; 10 plików `lang/*.json` wypełnione przez `lang:translate`; `{{ display }}` → `{{ trans :key="display" }}` w 7 widokach formularzowych; CP Tools → Translations UI pokazuje pełną listę kluczy.

**Update-statamic-cms-6.20.2** ✅ 2026-06-06 — `statamic/cms` v6.20.0 → v6.20.2; `guzzlehttp/*` zaktualizowane razem; patch HOTFIX-18 nałożony przez `composer patches-relock` + `composer patches-repatch`; `php artisan test` 2 passed; HTTP 200 PL+EN. Uwaga operacyjna: nowy patch w `composer.json` nieobecny w `patches.lock.json` wymaga ręcznego `patches-relock` + `patches-repatch`.

**Sync-z-komputera-zapasowego** ✅ 2026-06-06 — Logo fix (`xl:max-w-[300px] 1xl:max-w-[340px]` + PNG 594×120px); YouTube `<iframe data-src>` + `toEmbedUrl()`; Skalisty Gallery Section (nowy blok page buildera); max_files usunięty z galleries/gallery.yaml.

**HOTFIX-18** ✅ 2026-06-05 — `Statamic\Dictionaries\Locales` crash na dhosting; patch `statamic-cms-locales-proc-open-fallback.patch` pod `statamic/cms`; wdrożony lokalnie i na serwerze.

**SEO-Pro** ✅ 2026-06-05 — `statamic/seo-pro ^7.10`; `{{ seo_pro:meta }}` w head; Site Defaults PL+EN; sitemap `/sitemap.xml`.

**Zabezpieczenie-patchy-vendora** ✅ 2026-06-05 — `cweagans/composer-patches ^2.0`; 4 patche w `patches/`; patches.lock.json w repo.

**Logo-fix** ✅ 2026-06-05 — header-1: kontener `xl/1xl:max-w-[280px]` + `max-w-full w-auto` na img; footer-1: podejście height-based `h-8 md:h-9 xl:h-11 2xl:h-12 w-auto max-w-full`. SVG 297×60px (4.94:1) teraz mieści się w kontenerze na laptopie.

**Auto-start-queue-worker** ✅ 2026-06-05 — listener `JobQueued` w AppServiceProvider; `$event->queue`, guard `pgrep -f "[q]ueue:work.*translations"`, `escapeshellarg(PHP_BINARY)`, `function_exists('exec')`; na serwerze `MAGIC_TRANSLATOR_QUEUE_CONNECTION=sync`.

**HOTFIX-17** ✅ 2026-06-05 — `tag_handling: xml` → `html` w `DeepLTranslationService.php`. PL→CS: 124 units, 1s DONE. Brak regresji EN.

**Translator-API-Panel** ✅ 2026-06-02 — `GET/POST /cp/translator-api`, `TranslatorApiController`, widok Blade, nav item Tools. Edycja `DEEPL_API_KEY` w `.env` + `config:clear`.

**HOTFIX-16** ✅ 2026-06-02 — `wysiwyg_html` w `FieldClassifier` (Tier1 + Html), `localizable: true` w `free_text_section.yaml`.

**HOTFIX 11** ✅ 2026-06-02 — Magic Translator group type: `FieldClassifier` + `ContentExtractor.extractGroup()` + `FieldDefinitionBuilder` normalizeGridConfig dla group.

**HOTFIX 10** ✅ 2026-06-02 — Magic Translator fieldset imports: `normalizeFieldItems()` rozwiązuje `import:` przez `Fieldset::find()`. 116 jednostek przetłumaczone.

**Kluczowy wniosek (globals):** Plik danych EN (`content/globals/en/setting.yaml`) istniejący z danymi nadpisuje `origin: pl` z kontenera. Usunięcie pliku EN przywraca inheritance z PL.

**Kluczowy wniosek (Theme Switcher):** `default: true` w blueprincie NIE zapisuje wartości do istniejących globals — trzeba dopisać ręcznie do `content/globals/pl/*.yaml`. Składnia warunku: `{{ theme_settings }}{{ if show_theme_switcher }}...{{ /if }}{{ /theme_settings }}`.

---

## Ostatni feedback Codex

Z `CODEX_SUGGESTIONS.md` (2026-06-05, Auto-start-queue-worker):
- Mechanizm auto-startu workera działa: event poprawny, guard działa, worker startuje automatycznie w tle
- Pełna walidacja background DeepL nie była możliwa w sandboxie Codexa (błąd DNS procesu potomnego)

Z `CODEX_SUGGESTIONS.md` (2026-06-05, SEO-Pro):
- `php artisan seo-pro:install` nie istnieje w v7.10 — tylko `vendor:publish` wystarczy
- JSON-LD Type: Article dla kolekcji blogs nie jest wspierane natywnie przez SEO Pro v7.10.1
- Deprecated warnings z Antlers przy `str_replace(): Passing null` — nie blokuje działania

---

## Otwarte zadania

| # | Zadanie | Status |
|---|---------|--------|
| 1 | **Wtyczka chatbota AI multi-provider** (DeepSeek / OpenAI / Claude / Ollama configurable) — kandydat do osobnego repo GitHub po stabilizacji | 🔮 Duża inicjatywa — szczegółowa specyfikacja w PROJECT_STATUS_CODEX.md sekcja "Do wykonania" #1. Pierwszy etap: PoC z DeepSeek (jednoprovider) → walidacja jakości PL → multi-provider abstrakcja (Prism PHP?) → CP panel → widget UI → MySQL chat_logs → wydzielenie do addonu |
| 2 | Pozostałe warianty Services Grid (futured / hard / highlights / accordion) | 🔮 Opcjonalne — dispatcher gotowy, tani dodatek |
| 3 | Formularze kontaktowe (Statamic Forms) | 🔮 Zakres do ustalenia z użytkownikiem |
| 4 | Integracja formularzy z EspoCRM (Lead Capture) | 🔮 Do zrobienia w ramach zadania Formularze |

## Ostatnio zamknięte

**FEATURE-services-grid-section-soft** (2026-06-20, ACCEPTED) — nowa sekcja page buildera `Services Grid Section` z dispatcherem layoutu (wariant `soft`). Pliki: `resources/fieldsets/services_grid_section.yaml`, `resources/views/page_builder/services_grid_section.antlers.html`, `resources/views/component/services_grid_layouts/soft.antlers.html`, rejestracja w `all_page_builder.yaml`, klucz "Read more" w 12 lang/*.json, output.css rebuild. Render zweryfikowany na `/oferta` (12 kart, ikony iconify, pseudo-elementy siatki, button cascade `button_label`→`card_button_text`→trans).

### Ostatnia analiza gotowych rozwiązań

`FEATURE-services-grid-section-soft` — skrócona (adaptacja istniejącego layoutu z motywu siostrzanego):

| Rozwiązanie | Werdykt |
|---|---|
| Natywne Statamic page builder | Brak generic "grid showcase" — sekcje page buildera są customowe per-motyw |
| Mechanizm Orion (`service_section`) | Odrzucony — modele danych nieprzystające, fieldset zaśmieciłby się polami warunkowymi |
| Addon Statamic | Brak gotowego addonu dla configurable grid showcase |
| **Bigmentor `component/soft`** | **Wybrane** — publiczne repo Webbycrown (siostrzany motyw), markup gotowy, paleta/font do prostego remappingu |
| Custom from scratch | Niepotrzebne |

### Ostatni brief dla Codex

`BRIEF_CODEX.md` (state_version 2026-06-21-EOD, **HOTFIX-gallery-tags-fieldtype**) — ZAMKNIĘTY 2026-06-21 21:30. W sesji 2026-06-21 zamknięto łącznie 6 zadań: `HOTFIX-gallery-tags-fieldtype` (terms zamiast taxonomy), `FEATURE-gallery-tags-taxonomy` (natywny Statamic), `HOTFIX-services-icon-svg-store-as` (przywrócony svg_data), `FEATURE-services-pagebuilder-defaults` (5 default setów), sync 12 nowych usług + 24 lokalizacji galerii, `FEATURE-mega-menu-globals-i18n` (główne ACCEPTED). 5 deployów w sesji. Pełen brief mega_menu zarchiwizowany w `briefs/archive/2026-06-21-feature-mega-menu-globals-i18n.md`.

### Ostatni feedback Codex

`FEATURE-services-grid-section-soft` (2026-06-20) — pełny raport w `CODEX_SUGGESTIONS.md` (ACTIVE_FOR_CLAUDE_REVIEW → RESOLVED_BY_CLAUDE accepted). Codex zrealizował wszystkie wymagania briefu + bonus dodał testowy blok do `content/collections/pages/pl/oferta.md` dla real-runtime weryfikacji renderingu. Wykrył też artefakt minifikacji Tailwind v4 (klasy z escape backslash w CSS — komenda walidacyjna z briefu zwracała 0, faktyczne klasy obecne).

## Następne kroki

1. **Wybór następnego priorytetu** — decyzja użytkownika:
   - (a) kolejny wariant Services Grid (`hard`/`card-based`/`asymmetric`) — tani, dispatcher gotowy
   - (b) **Formularze kontaktowe** — backlog od dawna, wymaga analizy gotowych rozwiązań (natywne Statamic Forms vs addon vs autorskie), brief dla Codex
   - (c) coś innego wskazanego przez użytkownika
2. **Po Formularzach: EspoCRM Lead Capture** — listener `FormSubmitted` → `Http::post()` do `/api/v1/LeadCapture/{apiKey}`

---

## Kluczowe pliki projektu

| Plik | Rola |
|------|------|
| `resources/sites.yaml` | Konfiguracja multisajtu |
| `config/statamic/system.php` | System Statamic + multisite |
| `config/statamic/magic-translator.php` | DeepL translator config |
| `resources/views/layout.antlers.html` | Master layout |
| `resources/views/partials/head-link.antlers.html` | Head, SEO Pro meta |
| `resources/views/partials/header-1.antlers.html` | Aktywny header z language switcherem |
| `resources/views/partials/language-switcher.antlers.html` | Dropdown switcher języków |
| `resources/fieldsets/all_page_builder.yaml` | Page builder fieldset |
| `resources/fieldsets/hero_slide_section.yaml` | Hero slide fieldset |
| `public/assets/css/tailwind.css` | Yellow branding |
| `public/assets/js/custom.js` | Scroll fix, theme persistence, video modal |
| `content/globals/*.yaml` | Globals metadata (origin fix wykonany) |
| `content/navigation/main.yaml` | Nawigacja (collections fix wykonany) |
| `lang/en/validation.php` | Istniejący plik językowy |
| `ADMIN_ACCESS.txt` | Dane admina — WRAŻLIWE, nie commitować |
| `storage/logs/laravel.log` | Logi diagnostyczne |

---

## Uruchamianie projektu

```bash
# Serwer aplikacji
php artisan serve --host=127.0.0.1 --port=8001

# Kolejka (Magic Translator) — od 2026-06-05 startuje automatycznie po kliknięciu "Tłumacz" w CP
# Ręczne uruchomienie (awaryjnie lub na serwerze przed wdrożeniem auto-start):
php artisan queue:work --queue=translations --stop-when-empty

# Build assetów
npm run build

# Diagnostyka Statamic
php artisan statamic:stache:refresh
php artisan cache:clear
php artisan view:clear

# Po zmianie DEEPL_API_KEY
php artisan config:clear
php artisan queue:restart
```

---

## Zasady współpracy

1. Claude NIE pisze kodu samodzielnie — tylko na bezpośrednie polecenie użytkownika
2. Brief dla Codexa zawsze zapisywany do `BRIEF_CODEX.md` w workspace
3. Przed każdym briefem Claude czyta `CONCLUSIONS_CODEX.md` i `CODEX_SUGGESTIONS.md`
4. Po każdym zakończonym zadaniu Claude aktualizuje ten plik i `PROJECT_STATUS_CODEX.md`
5. Git z remote — `origin` → `https://github.com/5k18a/skalisty-laravel.git`; push na koniec sesji

---

## Bezpieczeństwo

Pliki wrażliwe — nigdy nie commitować:

- `ADMIN_ACCESS.txt`
- `/users/*.yaml`
- `.env`

Dodane do `.gitignore`: `ADMIN_ACCESS.txt`, `/users/*.yaml`

---

## Dziennik sesji

### 2026-06-21 (cała sesja — 6 zadań + 5 deployów + sync)

**Główne wydarzenia:**

1. **FEATURE-mega-menu-globals-i18n** (ACCEPTED) — Codex zaimplementował brief, audyt PASSED. Nowy global `mega_menu` (3 pola `localizable: true`), refactor 4 headerów na override-z-globalem, 11 locale DeepL, czystka demo Orion z nav trees PL/EN + footer EN. Deploy 23 plików.
2. **Sync z serwera** — 12 nowych usług PL+EN demo Orion + 2 polskie (`sztuczne-skaly`, `sztuczna-rafa-koralowa`) + 24 lokalizacji galerii + edycja nav PL Oferta (7 demo→2 realne) + edycja `oferta.md` `section_title: 'Lista Usług'`. **Regresja blueprintu service.yaml**: user usunął `store_as: svg_data` z `icon_svg` przy edycji CP.
3. **Diagnoza `confidence_section` duplicate field** (NIE wprowadzono zmian) — user próbował dodać confidence_section do blueprintu service przez CP Blueprint Editor, dostawał `DuplicateFieldException` na polach `description`/`image`. Przyczyna: confidence_section.yaml top-level pola kolidowały z service top-level. User samodzielnie usunie próby.
4. **FEATURE-services-pagebuilder-defaults** — `config.page_builder.default` z 5 setami (overview/image_with_text/how_it_works/skalisty_gallery/confidence). Mechanizm: `import: + config: <handle>: <overrides>` per Statamic Fields.php:286-291.
5. **HOTFIX-services-icon-svg-store-as** — przywrócone `store_as: svg_data` w `icon_svg`.
6. **FEATURE-gallery-tags-taxonomy** — natywny Statamic taxonomy + pole w sidebar galleries. Decyzje user: `gallery_tags`, bez route, nie multilingual, demo `categories` zostawione.
7. **HOTFIX-gallery-tags-fieldtype** — `type: taxonomy` → `type: terms` (Statamic nie ma fieldtype `taxonomy`).

**Wnioski techniczne (do pamięci):**
- **Override import config** wymaga mapy per handle pola: `config: <handle>: <overrides>`, nie flat (vendor Fields.php:286-291)
- **Fieldtype dla termów taxonomy w blueprintcie = `terms`**, nie `taxonomy`
- **`default:` dla replicatora** = lista obiektów setów `- type: <handle>, enabled: true` (wzór jak `projects.details` z 2026-06-19)
- **`store_as: svg_data` w polach Iconify**: jawnie zawsze, nawet jeśli config global ma default
- **Auto-mode Claude Code v2.1.15x blokuje SSH writes na production** — user wyłącza `/auto` przed deployem

**Otwarte (na następną sesję):**
- 12 demo Orion PL services `published: false` — zachować/usunąć?
- `architectural-design` EN-only — decyzja
- Cleanup demo Orion content (testimoniale + cookie popup + newsletter)
- Re-zapis 2 PL services przez CP → `icon_svg` jako inline SVG

**Stan na koniec sesji:**
- `state_version: 2026-06-21-EOD`, `active_task_id: none`, `last_closed: HOTFIX-gallery-tags-fieldtype`
- Lokalny stan = serwer dev.skalisty.pl (po 5 deployach + pull sync)
- 5 deployów udokumentowane w `server_deploy/DEPLOYMENT.md`

---

### 2026-06-20

**BUGFIX-service-icon-color**: 5 spanów ikon Iconify w `service_section.antlers.html` (linie 24, 152, 194, 230, 354) — klasa `text-primary-900` → `text-black`. Mechanizm: SVG dziedziczy `currentColor` przez `<span>`. `<h4>` z Alpine `:class` toggling nienaruszone. Zaakceptowane.

**FEATURE-faqs-grouped-replicator**: kolekcja `faqs` przebudowana z 1-entry=1-pytanie na **paczki tematyczne**. Blueprint: pole `title` → „Nazwa grupy FAQ", usunięto pole `answer`, dodano replicator `faq_items` z setem `item` (`question` + `answer`, oba required). Szablony (`page_builder/faq_section.antlers.html` + `service/show.antlers.html` linie 140-185): `x-data="{selected:1}"` przeniesione wewnątrz pętli paczek, `{{ title }}` → `{{ question }}`, dynamiczny `x-ref="container{{ index }}"` (bugfix pre-existing hardcoded). Magic Translator kompatybilny dzięki patch HOTFIX-10+11 (set groups → flat, `classifyNested` Tier 1). User ręcznie założył nowe paczki w CP po deployu.

**STYLE-bard-nested-sections-padding-half (v1)**: 9 wystąpień wrappera Bard w `service/show.antlers.html` zmienione z `2xl:py-[70px] 1xl:py-16 lg:py-14 sm:py-10 py-8` na `2xl:py-[35px] 1xl:py-8 lg:py-7 sm:py-5 py-4` (dokładnie połowa). `npm run build` wymagany (Tailwind 4 generuje on-demand z `@source`). Iteracja zaakceptowana ale natychmiast zastąpiona v2.

**STYLE-bard-nested-sections-padding-half-v2**: kolejne -50%: `2xl:py-[18px] 1xl:py-4 lg:py-3.5 sm:py-2.5 py-2` (35→18, 32→16, 28→14, 20→10, 16→8 px). Zaakceptowane + zdeployowane.

**Deploy 1 (FAQ + service icon + home + faqs/)**: rsync per plik + cała kolekcja `content/collections/faqs/` (bez `--delete`). Backup serwera `~/skalisty_2026_backups/before-faq-replicator-2026-06-20/` (836 KB). HTTP 200 PL+EN, 13 pozycji `faqs-list` na home PL.

**Deploy 2 (padding v2 + output.css)**: rsync 2 plików. Backup `~/skalisty_2026_backups/before-bard-padding-v2-2026-06-20/` (300 KB). HTTP 200 + klasa `py-[18px]` wykryta na produkcji.

**Doc drift sprzątnięty (po dwóch interwencjach Codexa)**: (1) wpis DOC-SYNC dla STYLE-bard-padding-half-v2 — frontmatter `PROJECT_SYNC` w 3 plikach nie był synchronizowany po zamykaniu zadań; (2) wpis DOC-SYNC dla sekcji `## W trakcie` w `PROJECT_STATUS_CODEX.md` — tekstowa sekcja niezgodna z frontmatterem. Oba rozwiązane atomowo. **Lesson learned (do odnotowania): po każdym deployu/akceptacji synchronizować nie tylko frontmatter, ale również sekcję tekstową `## W trakcie` / `## Ostatnio zamknięte` w `PROJECT_STATUS_CODEX.md`.**

**Stałe lokalnego dev (odnotowane przez Codexa)**:
- Frontend: `http://127.0.0.1:8001/` (nie `8000`)
- PHP lokalnie: `php artisan` (serwer dhosting: `php84`)
- W przyszłych briefach walidacyjnych stosować te wartości.

**Zamknięcie sesji**: CHANGE-LOG (6 wpisów: 4 zadania + 2 deploye), DEPLOYMENT (2 wpisy), CLAUDE_MEMORY (ten wpis), PROJECT_STATUS_CODEX zaktualizowane. Commit + push na `origin/main`.

### 2026-06-20 (sesja nocna)

**BUGFIX-embedded-video-mobile**: dwa problemy w player video (page builder + Bard): (1) autoplay na mobile — `x-show` ukrywa element ale iframe z `src` już załadowany odtwarza audio; fix: `:src="playing ? embedUrl : ''"`. (2) szerokość na mobile — `max-sm:w-[95%]` nie pokrywało wszystkich telefonów (viewport >640px); fix: `w-full md:w-[70%]`. Deploy: 2 pliki rsync, view:clear + cache:clear.

### 2026-06-20 (sesja wieczorna)

**FEATURE-embedded-video-cover-image**: opcjonalne pole `cover_image` (type: assets) w sekcji Embedded Video — zarówno dla page buildera (`embedded_video_section.yaml`, `page_builder/embedded_video_section.antlers.html`) jak i Bard (`service.yaml` blueprint, `service/show.antlers.html`). JS `embeddedVideo(service, url, coverImage)`: jeśli `coverImage` podany → `this.thumbnail = coverImage`, pomijamy YouTube thumbnail i Vimeo oEmbed. Antlers `{{ cover_image }}{{ url }}{{ /cover_image }}` → puste string gdy brak = falsy w JS.

**STYLE-mega-menu-ivena-tiles**: kafle usług w mega menu header-{1,2,3,4} przeprojektowane 1:1 z motywu ivena. Kluczowe odkrycie: `extra.css` `.navbar li a { @apply flex items-center; }` konfliktowało z każdym `<a>` wewnątrz `.navbar`. Rozwiązanie ivena: `<a>` = `display: block` (wrapper), flex na wewnętrznym `<div>` — CSS reguły na `<a>` nie dotyczą layoutu contentu. Dodano `.navbar li.w-full > a.group\/tile { display: block !important; padding: 0 !important; }` do `extra.css`. Efekt hover tła: `hover:bg-black/[0.08]`, ikona 40×40 wyrównana do góry, `group/tile` + `group-hover/tile:text-primary-900` na h4. `sed` z nawiasami `[&>svg]` → corrupcja — fix przez Python `re.sub()`.

**CONTENT-sztuczna-rafa-koralowa**: nowy wpis usługi PL z sekcją video w Bard.

**Deploy**: rsync 11 plików (partials, blueprints, fieldsets, views, extra.css, output.css, content). HTTP 200 na `dev.skalisty.pl`. Kafle mega menu z efektem hover, cover image aktywna.

**Zamknięcie sesji**: CHANGE-LOG (3 wpisy: cover image, kafle, content), DEPLOYMENT (1 wpis), CLAUDE_MEMORY (ten wpis). Commit + push na `origin/main`.

### 2026-06-20 (powrót na komputer główny — sync z remote)

**Kontekst**: po dwóch sesjach na komputerze zastępczym (FAQ replicator, services route /oferta, embedded video, mega menu kafle, content sztuczna-rafa-koralowa, BUGFIX-embedded-video-mobile) trzeba było dogonić remote.

**SYNC**: `git pull ab55105..fb693ed` — 21 commitów / 86 plików / +1073 -373. Composer i npm bez różnic; Laravel 13.16.1, Statamic 6.21.0. Lokalny testowy bełkot w `architectural-design.md` (Bard sety z "uiytruirtiurtyijrtui", "uyituyi" w polach quote_text i client_name) odrzucony przez `git checkout --`; plik i tak usunięty na remote (zastąpiony przez `sztuczna-rafa-koralowa.md`).

**Diagnoza pseudo-duplikatu `/oferta/architectural-design`**: HTTP 200 lokalnie po pullu, mimo że plik usunięty. Przyczyna: stache lokalny nadal trzymał stare mapowanie slug→entry (slug `architectural-design` wskazywał na ten sam wpis co nowy `sztuczna-rafa-koralowa`). Po `php artisan statamic:stache:refresh` stary URL → 404, nowy `/oferta/sztuczna-rafa-koralowa` 200 (title "Dekoracje Akwarystyczne"). **Próba rename pliku na `dekoracje-akwarystyczne.md` + nav update wycofana** — slug `sztuczna-rafa-koralowa` to świadoma decyzja użytkownika utrzymana na serwerze (`dev.skalisty.pl` zweryfikowany: `/oferta/sztuczna-rafa-koralowa` 200, `/oferta/dekoracje-akwarystyczne` 404).

**Kluczowy wniosek (do CLAUDE_MEMORY → Kluczowe decyzje)**: po `git pull` zawierającym zmiany w `content/collections/` (rename, delete, slug changes) ZAWSZE `php artisan statamic:stache:refresh` PRZED jakąkolwiek diagnozą URL. Stache trzyma cached mapping slug→entry i bez refresh ten sam entry może odpowiadać pod dwoma URL — co fałszywie wygląda jak duplikat w content/blueprintach.

**Stan operacyjny po sesji**: brak aktywnego zadania, last_closed pozostaje FEATURE-services-route-pl-oferta. Lokalny stan = `origin/main` = stan serwera.

**Uwaga długoterminowa**: nawigacja PL `content/trees/navigation/pl/main.yaml:117` ma martwy link demo "Service Detail" `url: /oferta/architectural-design` (404 lokalnie i na serwerze). Demo Orion, niewykorzystywane; do decyzji użytkownika (zaktualizować URL na działający `/oferta/sztuczna-rafa-koralowa` lub usunąć całą gałąź demo Pages > Services z nawigacji).

### 2026-06-20 (sesja popołudniowa)

**FEATURE-services-route-pl-oferta**: zlokalizowanie trasy URL dla kolekcji `services`. `content/collections/services.yaml`: `route` ze stringa `/service/{slug}` na mapę 12 locale (PL `/oferta/{slug}`, reszta `/service/{slug}`); wzorzec analogiczny do Projects (`/realizacje/{slug}` PL). `CollectionRoutesController::$managedCollections`: dodane `'services' => 'Usługi (Services)'` — w CP > Tools > Trasy URL kolekcji widać teraz Projekty + Usługi. 21 hardcoded `href="/service/{{slug}}"` zamienionych na `href="{{ url }}"` w 8 widokach (`service_section.antlers.html` × 13, header-1/2/3/4 × 1, footer-1 × 2, footer-4 × 1, search-results × 1) — Statamic generuje URL z `route` per locale automatycznie. Nawigacja PL: `/oferta/architectural-design`. **Rename strony PL `services.md` → `oferta.md`** zrobiony przez użytkownika w CP — świadoma decyzja spójna z duchem zmiany (strona kolekcji = `/oferta`, pojedyncza usługa = `/oferta/{slug}`). EN bez zmian.

**Deploy**: 11 plików rsync, backup serwera `~/skalisty_2026_backups/before-services-route-oferta-2026-06-20/` (248 KB). HTTP walidacja: `/oferta` 200, `/oferta/architectural-design` 200, stara PL `/service/architectural-design` 404, `/en/services` 200, `/en/service/architectural-design` 200, `/cp/collection-routes` 302→login. Brak kolizji `/oferta` (page entry) vs `/oferta/{slug}` (service entry) — Statamic prawidłowo rozdziela.

**Zamknięcie sesji**: CHANGE-LOG (2 nowe wpisy: zadanie + deploy), DEPLOYMENT (1 wpis deploya), CLAUDE_MEMORY (ten wpis), PROJECT_STATUS_CODEX (sekcja Wykonane + Ostatnio zamknięte zsynchronizowane z frontmatterem). Commit + push na `origin/main`.

### 2026-06-19

**BUGFIX-icon-box-center-icon**: `mx-auto` na kontenerze ikony w `icon_box_with_text_section.antlers.html`. Deploy na `dev.skalisty.pl` (748 KB, 2 passed). Wykonane przez Claude bezpośrednio na polecenie użytkownika.

**Audyt i zamknięcie zadań z poprzednich sesji**: SYNC-orientarium, FEATURE-blueprint-details-defaults, UPDATE-statamic-6.21.0, UPDATE-statamic-6.20.3-deploy, SYNC-and-deploy-completion-year, FEATURE-completion-year-sort. Wszystkie zaakceptowane.

**LOGO-SVG-SWITCH**: Logo zmienione z PNG na SVG (`setting.yaml`: `logo-skalisty-2.png` → `logo-skalisty-2.svg`). Nowy SVG skopiowany z `logo/skalisty-logo.svg` — 100% paths, zero `<text>` (stary SVG miał live Overpass text). Header-1 + header-4: mobilny rozmiar wyrównany do md breakpointu (`max-w-[190px]/[180px]`, `max-h-[42px]`). `npm run build` — output.css przebudowany. Deploy na `dev.skalisty.pl`.

**AI features — zapisane jako pomysły**: 3 koncepcje SEO/AI (meta generation Claude API, Meilisearch search, search phrase tracking) zapisane w sekcji "Do wykonania / 4–6" w PROJECT_STATUS_CODEX.md + tabela Zaplanowane zadania. Nie podjęto decyzji o wdrożeniu.

**Zamknięcie sesji**: CHANGE-LOG uzupełniony, CLAUDE_MEMORY zaktualizowana, sync dokumentacji, push na `origin/main`.

### 2026-06-18

**FEATURE-back-now-i18n**: `BACK NOW` hardcoded → `{{ trans key="Back Now" }}` w 4 widokach (gallery-lightbox, skalisty_gallery_section, gallery_section); `lang/en.json` + `lang/pl.json` klucz 36; 10 języków przetłumaczone przez `php artisan lang:translate --force`. Deploy na `dev.skalisty.pl`.

**BUGFIX-logo-proportions**: Logo spłaszczało się przy zwężaniu. Fix: `max-h-9 xl:max-h-13 2xl:max-h-14 h-auto w-auto max-w-full` na img w header-1 + header-4; kontener `shrink-0 max-w-[150px/190px/300px/340px/full]`. Kluczowe: `npm run build` wymagany — klasy nie były w `output.css` przez Tailwind tree-shaking (silent failure). Deploy na `dev.skalisty.pl`.

**Sync offline←online**: Pobrano brakujące assety (galeria djurs-sommerland, osada-jaworzyny, logo-klienci, patch magic-translator-untranslated-stale). Lokalnie teraz w pełni zsynchronizowane z serwerem.

**Git**: Wszystkie zmiany sesji scommitowane + push na `origin/main`.
