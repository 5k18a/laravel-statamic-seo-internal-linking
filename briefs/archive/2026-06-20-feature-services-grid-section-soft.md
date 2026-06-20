# BRIEF_CODEX.md

<!-- PROJECT_SYNC_START -->
state_version: 2026-06-20-1500
active_task_id: FEATURE-services-grid-section-soft
active_task_name: Services Grid Section — dispatcher + wariant soft (page builder)
active_task_status: active
active_task_source: BRIEF_CODEX.md
last_sync: 2026-06-20 15:00 Europe/Warsaw
last_synced_by: Claude
last_closed: FEATURE-services-route-pl-oferta
next_after_active: Decyzja użytkownika (kolejne warianty grida lub Formularze kontaktowe)
<!-- PROJECT_SYNC_END -->

---

## Status

**AKTYWNE**

## Cel zadania

Dodać nową sekcję page buildera `services_grid_section` — listing kart kolekcji z konfigurowalnym layoutem (dispatcher), pierwszy wariant `soft`. Wzorzec wizualny zaadaptowany z motywu `webbycrown/bigmentor-statamic-theme` (publiczne repo GitHub), partial `resources/views/component/soft.antlers.html`. Sekcja jest **odrębna** od istniejącego `service_section` — niezależna w fieldsecie, widoku i rejestracji w `all_page_builder.yaml`.

Dispatcher (analogiczny do bigmentor `grid_showcase`) ma od początku konstrukcję umożliwiającą dorzucanie kolejnych wariantów (`hard`, `asymmetric`, `card-based`, `column`, itd.) w przyszłych iteracjach **bez zmiany fieldsetu i głównego widoku** — wystarczy nowy plik partiala.

## Kontekst

Użytkownik wskazał demo `https://bigmentor-statamic.webbydemo.in/services` (sekcja `grid_showcase` → `component/soft` w repo bigmentor). Bigmentor jest siostrzanym motywem Webbycrown (autor Oriona — bazy projektu), publiczne repo: `https://github.com/webbycrown/bigmentor-statamic-theme`.

Audyt Claude (rozmowa 2026-06-20) wykluczył dodanie kolejnego `show_type` w istniejącym `service_section.yaml` — model danych bigmentor różni się od skalisty (pola, klasy Tailwind, font, paleta), a `service_section.antlers.html` ma już 387 linii z 7 warunkami `elseif`. Odrębna sekcja = czysta architektura, brak zaśmiecania fieldsetu polami warunkowymi.

Precedens w repo: `wysiwyg_html_block`, `columns_section`, `skalisty_gallery_section`, `icon_box_with_text_section` — wszystkie dodane jako samodzielne sekcje page buildera.

## Problem do rozwiązania

Skalisty obecnie nie ma layoutu typu "grid 3-kolumnowy z liniami siatki dzielącymi karty" (z `soft` bigmentor). Istniejące warianty (`home-page-three`, `home-page-four`, `service-page-three`) używają shadow/border per-card — nie efektu siatki linii. Użytkownik chce dokładnie tego konkretnego layoutu.

## Analiza gotowych rozwiązań

### Czy zadanie dotyczy nowej większej funkcjonalności?

**Częściowo TAK** — nowa sekcja page buildera + nowy dispatcher partial system. Skrócona analiza:

| Rozwiązanie | Typ | Werdykt |
|---|---|---|
| Natywne Statamic page builder | Core | Nie ma "grid showcase" out-of-the-box — sekcje są customowe per-motyw |
| Mechanizm Orion (istniejący `service_section`) | Motyw | Odrzucony w audycie — modele danych nieprzystające, fieldset by się zaśmiecił |
| Addon Statamic | Addon | Brak gotowego addonu dla "grid showcase" z konfigurowalnym layoutem — sekcje page buildera tradycyjnie tworzy się per-motyw |
| Bigmentor `component/soft` (webbycrown) | Motyw siostrzany | **Wybrane** — publiczne repo, ten sam autor co Orion, paleta/font do remappingu na skalisty |
| Custom from scratch | Custom | Niepotrzebne — bigmentor dostarcza referencyjny markup |

### Rekomendacja Claude

**Adaptacja `component/soft.antlers.html` z bigmentor** + dispatcher pattern z `grid_showcase.antlers.html`. Mapowanie palety/fontu/pól na konwencje skalisty. Atrybucja w komentarzu Antlers w nowych plikach.

### Uzasadnienie rekomendacji

Bigmentor jest publicznym repo siostrzanego motywu Webbycrown (autora Orion-bazy). Adaptacja layoutu z atrybucją jest najprostsza i najmniej ryzykowna — markup gotowy, klasy do zmapowania, brak nowych dependencji.

## Zakres pracy

### 1. Nowy fieldset `resources/fieldsets/services_grid_section.yaml`

```yaml
title: 'Services Grid Section'
fields:
  -
    handle: layouts_grid
    field:
      type: select
      display: 'Layout Variant'
      options:
        -
          key: soft
          value: 'Soft (3 kolumny z liniami siatki)'
      default: soft
      instructions: 'Wariant układu kart. Kolejne warianty (hard, asymmetric, card-based) będą dodawane w przyszłych iteracjach.'
  -
    handle: section_title
    field:
      type: text
      display: 'Section Title'
      localizable: true
  -
    handle: section_button
    field:
      type: grid
      display: 'Section Button (opcjonalny — w nagłówku sekcji)'
      mode: stacked
      max_rows: 1
      fields:
        -
          handle: text
          field:
            type: text
            display: 'Button Text'
            localizable: true
        -
          handle: url
          field:
            type: text
            display: 'Button URL'
            instructions: 'np. /oferta lub /services'
  -
    handle: collections
    field:
      type: collections
      display: Collections
      mode: select
      max_items: 1
      instructions: 'Wybierz kolekcję do wyświetlenia (np. services).'
  -
    handle: limit
    field:
      type: integer
      default: 0
      display: Limit
      instructions: '0 = wszystkie wpisy.'
  -
    handle: card_button_text
    field:
      type: text
      display: 'Card Button Text (fallback)'
      default: 'Read more'
      instructions: 'Tekst „czytaj więcej" pod każdą kartą. Jeśli wpis kolekcji ma własne pole button_label, ono ma priorytet.'
      localizable: true
```

### 2. Nowy dispatcher `resources/views/page_builder/services_grid_section.antlers.html`

```antlers
{# Dispatcher — ładuje partial wariantu wg pola layouts_grid. Wzorzec z webbycrown/bigmentor-statamic-theme (grid_showcase.antlers.html) #}
{{ partial src="component/services_grid_layouts/{layouts_grid}" }}
```

### 3. Nowy partial `resources/views/component/services_grid_layouts/soft.antlers.html`

Adaptacja `https://raw.githubusercontent.com/webbycrown/bigmentor-statamic-theme/main/resources/views/component/soft.antlers.html` ze **wszystkimi mapowaniami z tabeli poniżej**. Pierwsza linia pliku — komentarz atrybucji:

```antlers
{# Layout adapted from webbycrown/bigmentor-statamic-theme — resources/views/component/soft.antlers.html. Adapted for skalisty-orion: paleta primary-900 (żółto-brązowy #8f6900), font-el-messiri (Syne), iconify+asset fallback, i18n przez trans key #}
```

**Mapowanie klas i pól (obowiązujące):**

| Bigmentor | Skalisty |
|---|---|
| `bg-theme-900` | `bg-primary-900` |
| `bg-vividblue-400` / `text-vividblue-400` | `bg-primary-900` / `text-primary-900` |
| `border-gray-700` | bez zmian (`border-gray-700` istnieje w Tailwind) |
| `font-Larken` | `font-el-messiri` (`--font-el-messiri: "Syne"` w `tailwind.css` linia 54) |
| `text-25`, `text-20`, `text-28`, `text-32`, `text-45`, `text-1xl`, `text-42`, `text-22` | arbitrary values: `text-[25px]`, `text-[20px]`, `text-[28px]`, itd. — zachować dokładnie te wartości pikseli |
| `leading-lineHeight` | `leading-normal` |
| `text-currentColor` | `text-current` |
| `all-btn` (custom bigmentor) | `btn btn-primary-reverse` (skalisty istniejący komponent z `tailwind.css`) |

**Mapowanie pól wpisu kolekcji (w pętli `{{ collection:{collections} }}`):**

| Bigmentor | Skalisty (pola blueprintu `service`) |
|---|---|
| `{{icon:url}}` | Pattern z istniejących `service_section` (sprawdź linie 24, 152, 194 obecnego `service_section.antlers.html`): `{{ if icon_svg }}{{ iconify:icon_svg class="w-full h-full" aria-hidden="true" }}{{ else }}{{ icon }}<img src="{{ url }}" alt="{{ title }}" class="w-full h-full object-contain" loading="lazy" />{{ /icon }}{{ /if }}` |
| `{{title}}` | `{{ title }}` (bez zmian) |
| `{{url}}` | `{{ url }}` (bez zmian — Statamic generuje per-locale URL) |
| `{{hero_short_description}}` | `{{ description }}` (pole `description` w blueprincie `service.yaml`) |
| `{{block}}.{{button}}.{{text}}` | `{{ button_label or card_button_text or trans:key="Read more" }}` — uproszczenie: blueprint kolekcji service ma pole `button_label` (default "Read More"); fallback do pola fieldsetu `card_button_text`; ostateczny fallback do tłumaczenia z `lang/*.json` |
| `{{block}}.{{button}}.{{icon}}` (SVG arrow) | Inline SVG arrow z `component/soft.antlers.html` zachować 1:1 (mała strzałka 16×16, `stroke="currentColor"`) — to standardowy ikona, nie obciąża repo |
| `{{section_title}}` | `{{ section_title }}` (pole fieldsetu) |
| `{{section_button}}.{{text}}` / `{{link}}` | `{{ section_button }}{{ text }}` / `{{ url }}` (pole grid w fieldsecie) |

**Sortowanie kolekcji**: użyć `sort="order:asc"` (analogicznie do istniejącego `service_section` — kolekcja `services` ma pole `order` w sidebarze).

**Limit**: dynamiczny z pola fieldsetu (`limit="{limit}"`).

**Pattern pętli** (jak w bigmentor, ale z `sort="order:asc"`):
```antlers
{{ collection:{collections} limit="{limit}" sort="order:asc" }}
  …karta…
{{ /collection:{collections} }}
```

### 4. Rejestracja w `resources/fieldsets/all_page_builder.yaml`

Dodać kolejny `set` w sekcji `new_set_group`, obok `service_section`:

```yaml
services_grid_section:
  display: 'Services Grid Section'
  fields:
    -
      import: services_grid_section
```

Pozycję w pliku wybrać w sąsiedztwie `service_section` (logiczna grupa „Services").

### 5. Tłumaczenia `lang/*.json`

Klucz **`"Read more"`** ma już szansę istnieć w `lang/pl.json` / `lang/en.json` — sprawdź najpierw:
```bash
grep -l '"Read more"' lang/*.json
```

Jeżeli brak:
- `lang/pl.json` — dodać `"Read more": "Czytaj więcej"`
- `lang/en.json` — dodać `"Read more": "Read more"`
- Pozostałe 10 locale: po dodaniu PL/EN uruchomić `php artisan lang:translate --locales=cs,da,de,es,fr,it,lv,nl,no,sv --force` (komenda istnieje w projekcie z poprzedniej sesji 2026-06-06)

### 6. Build CSS

Po zmianach w widoku — **obowiązkowo**:
```bash
npm run build
```

**Powód** (lekcja z BUGFIX-logo-proportions, 2026-06-18): Tailwind v4 generuje klasy on-demand z `@source`. Nowe arbitrary classes (`text-[25px]`, `text-[20px]`, itp.) i kompozyty pseudo-elementów (`before:content-[''] before:bg-white`) nie trafią do `output.css` bez rebuilda — przeglądarka cicho je zignoruje.

## Pliki do sprawdzenia (przed edycją)

- `resources/fieldsets/service_section.yaml` — referencja dla pól `collections`/`limit`/`sub_title`
- `resources/views/page_builder/service_section.antlers.html` — referencja dla patternu `{{ if icon_svg }}...{{ else }}{{ icon }}...{{ /if }}` (linie 24, 152, 194, 230, 354)
- `resources/blueprints/collections/services/service.yaml` — sprawdzenie dostępnych pól wpisu (`title`, `icon`, `icon_svg`, `image`, `description`, `button_label`, `order`)
- `resources/fieldsets/all_page_builder.yaml` — wzorzec rejestracji setu
- `public/assets/css/tailwind.css` — sprawdzenie `--color-primary-900: #8f6900`, `--font-el-messiri: "Syne"`, klas `.btn`, `.btn-primary-reverse`
- `lang/pl.json` + `lang/en.json` — sprawdzenie czy klucz `"Read more"` już istnieje

## Pliki do zmiany

- **NOWE**: `resources/fieldsets/services_grid_section.yaml`
- **NOWE**: `resources/views/page_builder/services_grid_section.antlers.html`
- **NOWE**: `resources/views/component/services_grid_layouts/soft.antlers.html`
- **EDIT**: `resources/fieldsets/all_page_builder.yaml` (+1 set)
- **EDIT (warunkowe)**: `lang/pl.json` + `lang/en.json` (klucz `Read more` jeśli nie istnieje)
- **EDIT (warunkowe)**: 10× `lang/*.json` przez `php artisan lang:translate` (po dodaniu klucza w PL+EN)
- **REBUILD**: `public/assets/css/output.css` (przez `npm run build`)

## Wymagania techniczne

- Zachować kompatybilność z istniejącym blueprintem `service` (nie dodawać nowych pól do blueprintu)
- Dispatcher pattern: `{{ partial src="component/services_grid_layouts/{layouts_grid}" }}` — dynamiczna ścieżka per pole fieldsetu
- Pełna i18n: każdy hardcoded tekst owinięty w `{{ trans key="..." }}` lub pobrany z pola fieldsetu/wpisu
- Multisite-safe: `{{ url }}` w Antlers generuje per-locale (Statamic native), nie hardkodować ścieżek
- Komentarz atrybucji w pierwszej linii nowych widoków (audit-trail)
- Nazewnictwo: `services_grid_section` (handle/set/file), display label "Services Grid Section"
- Brak nowych dependencji npm/composer

## Ograniczenia

- **NIE commitować** (AGENTS.md 22.2 — commity wykonuje Claude po audycie)
- **NIE modyfikować** `service_section.yaml` ani `service_section.antlers.html` — to osobna sekcja
- **NIE dodawać** pozostałych 9 wariantów (`hard`, `asymmetric`, `card-based`, `column`, `futured`, `gutters`, `highlights`, `row`, `accordion`) — odłożone do kolejnych iteracji
- **NIE modyfikować** blueprintu `service` — `button_label` istnieje, pozostałe pola są wystarczające
- **NIE używać** klas spoza Tailwind v4 (np. `font-Larken`, `text-25` bez nawiasów) — wszystkie klasy bigmentor muszą być remapowane wg tabeli powyżej
- Atrybucja w komentarzu Antlers — obowiązkowa (audit-trail dla pochodnych prac z innego repo)

## Kryteria akceptacji

- [ ] Plik `resources/fieldsets/services_grid_section.yaml` istnieje, zawiera pola: `layouts_grid` (select, default soft), `section_title`, `section_button` (grid), `collections`, `limit`, `card_button_text`
- [ ] Plik `resources/views/page_builder/services_grid_section.antlers.html` istnieje i jest dispatcherem (`{{ partial src="component/services_grid_layouts/{layouts_grid}" }}`)
- [ ] Plik `resources/views/component/services_grid_layouts/soft.antlers.html` istnieje, ma komentarz atrybucji w pierwszej linii, używa skalisty palety (`bg-primary-900`, `text-primary-900`, `font-el-messiri`) i pattern iconify+asset fallback
- [ ] `all_page_builder.yaml` zawiera nowy `set` o handle `services_grid_section`
- [ ] Klucz `"Read more"` istnieje w `lang/pl.json` ("Czytaj więcej") i `lang/en.json` ("Read more"), 10 pozostałych locale wypełnione przez `lang:translate`
- [ ] `npm run build` wykonany — `output.css` zawiera arbitrary klasy (`text-[25px]`, itp.) — weryfikacja: `grep -c 'text-\[25px\]' public/assets/css/output.css` ≥ 1
- [ ] `php artisan statamic:stache:refresh && php artisan view:clear && php artisan cache:clear` — OK bez błędów
- [ ] `php artisan test` — 2 passed
- [ ] HTTP smoke: `curl -sI http://127.0.0.1:8001/` → 200, `/en/` → 200, `/cp/login` → 302
- [ ] W CP > Pages → edycja dowolnej strony → page builder → opcja „Services Grid Section" widoczna na liście setów
- [ ] Po dodaniu sekcji do strony testowej (collection=services, limit=0): renderuje grid 3-kolumnowy z liniami siatki, ikony renderują się (iconify lub asset), tytuły linkują do `{{ url }}` per locale, przycisk „Read more"/„Czytaj więcej" pod każdą kartą

## Testowanie

Codex powinien wykonać:

```bash
# Sprawdzenie istniejących klas i pól
grep -n "primary-900" public/assets/css/tailwind.css | head -5
grep -n "font-el-messiri\|--font-el-messiri" public/assets/css/tailwind.css | head -5
grep -l '"Read more"' lang/pl.json lang/en.json

# Po implementacji
php artisan statamic:stache:refresh
php artisan view:clear
php artisan cache:clear
php artisan test
npm run build

# Weryfikacja rebuilda
grep -c 'text-\[25px\]' public/assets/css/output.css

# HTTP smoke
curl -sI http://127.0.0.1:8001/ | head -1
curl -sI http://127.0.0.1:8001/en/ | head -1
curl -sI http://127.0.0.1:8001/cp/login | head -1
```

**Walidacja manualna w CP** (do potwierdzenia przez użytkownika):
1. Otwórz dowolną stronę w CP (np. PL home), kliknij „Add Section" w page builderze
2. Sekcja „Services Grid Section" widoczna na liście → wybierz
3. Wypełnij: `section_title: "Nasze usługi"`, `section_button.text: "Wszystkie"`, `section_button.url: "/oferta"`, `collections: services`, `limit: 0`, `card_button_text: "Czytaj więcej"`
4. Zapisz, otwórz frontend PL → grid 3-kol z liniami siatki, ikony, tytuły, „Czytaj więcej" pod każdą kartą
5. Przełącz na `/en/` → ten sam blok, ale tytuły/opisy z EN locale

**Weryfikacja Playwright** (jeśli środowisko dostępne): screenshoty na breakpointach 360px/640px/1024px/1280px/1920px po dodaniu testowej sekcji.

Jeżeli testów nie da się uruchomić, Codex ma opisać powód w `CODEX_SUGGESTIONS.md`.

## Synchronizacja dokumentacji

- [x] `PROJECT_STATUS_CODEX.md` ma ten sam `active_task_id` (`FEATURE-services-grid-section-soft`)
- [x] `PROJECT_STATUS_CODEX.md` pokazuje to zadanie w sekcji `W trakcie`
- [x] `CLAUDE_MEMORY.md` ma ten sam `active_task_id`
- [x] `CLAUDE_MEMORY.md` pokazuje ten brief jako ostatni brief dla Codex
- [x] poprzedni priorytet (Decyzja użytkownika) przeniesiony do `next_after_active`
- [x] state_version = `2026-06-20-1500` w 3 plikach

## Informacje do zapisania w CODEX_SUGGESTIONS.md

Codex po zakończeniu pracy ma dopisać w `ACTIVE_FOR_CLAUDE_REVIEW`:

- co zostało wykonane (lista 5–7 plików)
- jakie pliki zostały zmienione (z liczbami linii dodanych/usuniętych)
- jakie problemy wykryto (np. czy klucz `Read more` już istniał, czy `lang:translate` wymagał DeepL queue)
- jakie ryzyka istnieją (np. czy pseudo-elementy `before:`/`after:` z `content-['']` poprawnie się renderują w Tailwind v4)
- jakie dalsze kroki sugeruje (np. który wariant `component/*` z bigmentor jako następny — `hard`, `card-based`?)
- jakie testy zostały wykonane (artisan test, grep, curl)
- czy zauważył gotowe rozwiązania lepsze od założonej implementacji
- czy wystąpił `Doc drift`

## Informacje do zapisania w codex-memory.md

Notatki operacyjne dla Codex (do dopisania w sekcji „Notatki operacyjne"):
- Dispatcher pattern: `{{ partial src="component/services_grid_layouts/{layouts_grid}" }}` umożliwia dorzucanie kolejnych wariantów bez zmiany fieldsetu
- Mapping bigmentor → skalisty udokumentowany w briefie — wartości pikselowe (np. `text-[25px]`) zachowane z bigmentor dla wierności wizualnej
- Pseudo-elementy `before:`/`after:` z `content-['']` — w Tailwind v4 wymagają obecności klas w widoku przy każdym buildzie

## Informacje do zapisania w CONCLUSIONS_CODEX.md

(opcjonalnie) Sekcja „Gotowe rozwiązania warte rozważenia":
- W przyszłości można rozważyć rozszerzenie dispatcher pattern na inne sekcje (faqs, projects) — bigmentor ma analogiczne `grid_section` z 8 wariantami w `component/grid_section/`

---

*Brief napisany przez Claude, 2026-06-20 15:00 Europe/Warsaw. Stała lokalnego dev: frontend `http://127.0.0.1:8001/`, PHP lokalnie `php artisan` (na dhosting: `php84`).*
