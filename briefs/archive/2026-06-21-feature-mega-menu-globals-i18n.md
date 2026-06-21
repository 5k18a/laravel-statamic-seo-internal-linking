# BRIEF ARCHIVE: FEATURE-mega-menu-globals-i18n

**Status końcowy:** ZAMKNIĘTY / ACCEPTED (audyt Claude 2026-06-21 16:10 Europe/Warsaw)
**Aktywowany:** 2026-06-21 15:30
**Zamknięty:** 2026-06-21 16:10
**Czas implementacji + audyt:** ~40 min

---

## Cel zadania

Wprowadzić nowy global Statamic `mega_menu` z 3 tłumaczalnymi polami (`copyright_text`, `projects_button_text`, `services_button_text`) i podłączyć go do mega menu w nagłówkach (`header-1..4.antlers.html`) z **fallbackiem do override per nav item**. Auto-tłumaczenie 11 pozostałych locale przez istniejącą komendę `globals:translate`. Usunąć resztki demo Orion (`View Services`, `© All rights reserved to Orion Constructions`) z navigation trees.

## Kontekst

Magic Translator obsługuje wyłącznie entries kolekcji (`vendor/el-schneider/statamic-magic-translator/src/Commands/TranslateCommand.php`), nie navigation trees. Pola `button_text` / `copyright_text` w blueprincie nawigacji (`resources/blueprints/navigation/main.yaml`) były warunkowe (`menu_type != normal`) i zapisywane per locale w nav trees — z 12 osobnymi plikami `content/trees/navigation/{locale}/main.yaml`. PL tree miało częściowo PL wartości, EN i 10 pozostałych — demo Orion.

## Architektura (decyzja użytkownika 2026-06-21)

**Override z fallbackiem:**
- Pola `button_text` / `copyright_text` w blueprincie nav **zachowane** jako opcjonalny override per nav item
- Nowy global `mega_menu` z 3 polami `localizable: true` jako domyślne źródło wartości
- Widok: `{{ if button_text }}A{{ else }}{{ mega_menu }}{{ if X_button_text }}B{{ /if }}{{ /mega_menu }}{{ /if }}`
- Per mega menu różne pole globala: `projects_button_text` dla project-list, `services_button_text` dla service-list, `copyright_text` wspólne

## Analiza gotowych rozwiązań

Pominięta per AGENTS.md 9.7 — wykorzystywany istniejący wzorzec `touch_with_us` global + istniejąca komenda `app/Console/Commands/TranslateGlobalSet.php` (`globals:translate`).

## Zakres pracy (8 kroków)

1. **Blueprint globala** `resources/blueprints/globals/mega_menu.yaml` — 3 pola text, `localizable: true`, defaultsy PL
2. **Content meta** `content/globals/mega_menu.yaml` — origin chain (`pl: null`, 11 locale: `origin: pl`)
3. **Content PL** `content/globals/pl/mega_menu.yaml` — 3 wartości PL
4. **Rozszerzenie `TRANSLATABLE_FIELDS`** w `app/Console/Commands/TranslateGlobalSet.php` — wpis `mega_menu` z 3 kluczami
5. **Refactor 4 widoków** `header-{1,2,3,4}.antlers.html` — po 4 fallbacki per plik (2 copyright + 1 projects_button + 1 services_button), wrappery `{{ mega_menu }}...{{ /mega_menu }}` obowiązkowe (HOTFIX-14 lesson)
6. **Czystka navigation trees** — usunięcie `button_text:` i `copyright_text:` z mega menu items w 12 nav trees
7. **Auto-tłumaczenie 11 locale** — `php artisan globals:translate mega_menu --locales=en,sv,no,nl,lv,it,fr,es,de,da,cs`
8. **Walidacja end-to-end** — stache:refresh + view:clear + test + HTTP smoke + test override

## Default values PL

- `copyright_text`: `© Wszelkie prawa zastrzeżone przez Skalisty Group sp. z o.o.`
- `projects_button_text`: `Przeglądaj Realizacje`
- `services_button_text`: `Sprawdź Naszą Ofertę`

## Pliki dodane/zmienione (15 plików)

**Nowe (14):**
- `resources/blueprints/globals/mega_menu.yaml`
- `content/globals/mega_menu.yaml` (meta)
- `content/globals/{pl,en,sv,no,nl,lv,it,fr,es,de,da,cs}/mega_menu.yaml` (12 plików)

**Edytowane (5):**
- `app/Console/Commands/TranslateGlobalSet.php` (+5 linii)
- `resources/views/partials/header-{1,2,3,4}.antlers.html` (+36 linii per plik)
- `content/trees/navigation/{pl,en}/main.yaml` (-4 linie per plik; 10 pozostałych tree miało `tree: []`)

**Poza ścisłym scope, zaakceptowane:**
- `content/globals/en/footer.yaml` — `copyright_text`: Orion → Skalisty (konieczne dla kryterium akceptacji "brak demo Orion w HTML /en/")
- `resources/blueprints/globals/footer.yaml` — default: Orion → Skalisty (cosmetic — wszystkie 10 locale dziedziczą z PL przez origin chain)

## Tłumaczenia DeepL (przykłady)

- **EN:** `© All rights reserved by Skalisty Group sp. z o.o.` / `Browse Our Projects` / `Check Out Our Offer`
- **DE:** `© Alle Rechte vorbehalten durch Skalisty Group sp. z o.o.` / `Projekte ansehen` / `Entdecken Sie unser Angebot`
- **ES:** `© Todos los derechos reservados por Skalisty Group sp. z o.o.` / `Echa un vistazo a nuestros proyectos` / `Echa un vistazo a nuestra oferta`
- **CS:** `© Veškerá práva vyhrazena společností Skalisty Group sp. z o.o.` / `Prohlédněte si realizace` / `Prohlédněte si naši nabídku`

## Walidacja (audyt Claude)

- Tinker `GlobalSet::find("mega_menu")->in($loc)` — wszystkie 12 locale mają poprawne wartości
- HTTP `/` → 200 z PL tłumaczeniami; mega menu button (`btn-border-b btn font-messiri`) = 2 trafienia
- HTTP `/en/` → 200 z EN tłumaczeniami; demo Orion `All rights reserved to Orion` = 0 trafień
- HTTP `/cs/ /da/ /es/` → 200 (mega menu nie renderuje się — istniejący stan `tree: []`, nie problem briefu)
- HTTP `/de/ /fr/ /sv/ /no/ /it/ /nl/ /lv/` → 302 do `/` (fallback locale routing, znane zachowanie)
- Test override/fallback przez Codexa: dodanie `button_text: 'TEST OVERRIDE'` do tree → frontend pokazał override; po usunięciu fallback wrócił do globala
- `php artisan test` → 2 passed

## Werdykt Claude: ACCEPTED

Wszystkie 8 kroków wykonane 1:1. Odchylenia (footer EN + default blueprint) zasadne. Pełny audyt w `CODEX_SUGGESTIONS.md` → `RESOLVED_BY_CLAUDE` (2026-06-21).

## Linki

- Pełny raport Codexa: `CODEX_SUGGESTIONS.md` (sekcja ROZLICZONE 2026-06-21 16:10 — komentarz HTML)
- Audyt Claude: `CODEX_SUGGESTIONS.md` → `RESOLVED_BY_CLAUDE` → 2026-06-21
- Wpis CHANGE-LOG: `CHANGE-LOG.md` → 2026-06-21 (FEATURE-mega-menu-globals-i18n — closed/accepted)
- Status post-audyt: `PROJECT_STATUS_CODEX.md` → "Ostatnio zamknięte: FEATURE-mega-menu-globals-i18n"
