# BRIEF_CODEX.md

<!-- PROJECT_SYNC_START -->
state_version: 2026-06-20-1830
active_task_id: FEATURE-services-grid-section-variants
active_task_name: Services Grid Section — 4 dodatkowe warianty (row, card-based, column, asymmetric)
active_task_status: active
active_task_source: BRIEF_CODEX.md
last_sync: 2026-06-20 18:30 Europe/Warsaw
last_synced_by: Claude
last_closed: FEATURE-services-grid-section-soft
next_after_active: Decyzja użytkownika (więcej wariantów — futured/hard/highlights/accordion — lub Formularze kontaktowe)
<!-- PROJECT_SYNC_END -->

---

## Status

**AKTYWNE**

## Cel zadania

Rozszerzyć sekcję `services_grid_section` o 4 nowe warianty layoutu w dispatcherze: **`row`**, **`card-based`**, **`column`**, **`asymmetric`**. Wzorce wizualne zaadaptowane z `webbycrown/bigmentor-statamic-theme` → `resources/views/component/{row,card-based,column,asymmetric}.antlers.html`. Dispatcher już istnieje (FEATURE-services-grid-section-soft); brief dotyczy wyłącznie nowych partiali + rozszerzenia opcji w fieldsecie + ewentualnego dodania `tag_title` do fieldsetu.

## Kontekst

Po wdrożeniu wariantu `soft` użytkownik chce dorzucić 4 kolejne layouty z bigmentor. Każdy wariant ma inny use-case:
- **`row`** — gęsta 4-kol siatka (xl), dobra dla długich list usług
- **`card-based`** — 3-kol z hover (premium look), dobre dla 6-9 usług
- **`column`** — wertykalna lista pełnej szerokości, idealna dla listingów typu case-studies (najpewniej wykorzystywana też dla kolekcji `projects` w przyszłości)
- **`asymmetric`** — 1 hero (lewa) + 2 mniejsze karty (prawa), wymaga obrazu jako tło

## Problem do rozwiązania

Markup bigmentor jest skażony **strukturą innych kolekcji** (insights, consultants_members, banner_section) — używa pól (`thumb_image`, `thumb_description`, `author.title`, `date`), które w blueprintach skalisty mogą nie istnieć lub mają inne handle. Plus zawiera warunki `{{ if type == "..." }}` na nested page_builder replicator (struktura nieobecna w naszym blueprincie service). Codex musi adaptować markup pod blueprint skalisty `service` (pola: `title`, `icon`, `icon_svg`, `image`, `description`, `button_label`).

## Analiza gotowych rozwiązań

### Czy zadanie dotyczy nowej większej funkcjonalności?

**NIE** — to rozszerzenie istniejącej sekcji (`services_grid_section`) o kolejne warianty layoutu. Dispatcher już istnieje, analiza gotowych rozwiązań została wykonana w briefie `FEATURE-services-grid-section-soft` (2026-06-20-1500). Wszystkie 4 warianty pochodzą z tego samego siostrzanego motywu Webbycrown — adaptacja jest spójna ze świadomie wybraną wcześniej strategią.

### Uzasadnienie pominięcia pełnej analizy

Wzorzec dispatcher + N partiali jest świadomą architekturą wybraną w poprzednim briefie. Dodanie kolejnych partiali to czysta inkrementalna implementacja w już zaprojektowanym mechanizmie.

## Zakres pracy

### 1. Rozszerzenie fieldsetu `resources/fieldsets/services_grid_section.yaml`

**1a) Dodać 4 opcje w polu `layouts_grid.field.options`:**

```yaml
options:
  -
    key: soft
    value: 'Soft (3 kolumny z liniami siatki)'
  -
    key: row
    value: 'Row (4 kolumny — gęsta siatka, bez wewnętrznych borderów)'
  -
    key: card-based
    value: 'Card-based (3 kolumny — karty z borderem i hover)'
  -
    key: column
    value: 'Column (wertykalna lista pełnej szerokości)'
  -
    key: asymmetric
    value: 'Asymmetric (1 hero + 2 mniejsze, z obrazami)'
```

**1b) Dodać nowe pole `tag_title`** (po `section_title`):

```yaml
-
  handle: tag_title
  field:
    type: text
    display: 'Tag Title (badge nad section_title)'
    localizable: true
    instructions: 'Opcjonalna etykieta wyświetlana jako badge nad tytułem sekcji. Wykorzystywana w wariantach row/column/asymmetric. Wariant soft ignoruje to pole.'
```

**Pozostałe pola fieldsetu (section_title, section_button, collections, limit, card_button_text) — bez zmian.**

### 2. Nowe partiale w `resources/views/component/services_grid_layouts/`

Każdy partial:
- Pierwsza linia: komentarz atrybucji w **poprawnej składni Antlers** (`{{# ... #}}`, **nie** `{# ... #}` — lekcja z poprzedniej sesji)
- Adaptacja markupu z bigmentor pliku raw (URL w każdej sekcji poniżej)
- Mapowania klas i pól z tabeli "Globalne mapowania" (dalej w briefie)
- Usunięcie warunków `{{ if type == "..." }}` i `{{ page_builder }}...{{ /page_builder }}` wrapperów (struktura specyficzna bigmentor, nieobecna w skalisty)
- Mapowanie pól wpisu na blueprint skalisty `service` (sekcje per wariant)

#### 2a) `resources/views/component/services_grid_layouts/row.antlers.html`

**Źródło:** `https://raw.githubusercontent.com/webbycrown/bigmentor-statamic-theme/main/resources/views/component/row.antlers.html` (48 linii)

**Adaptacja:**
- Usuń całe ciało `{{collection:{collections}}}` z `{{ page_builder }}{{ if type == 'consultants_members' }}...{{ /if }}{{ /page_builder }}` — zostaw tylko bezwarunkowy markup karty
- Karta zawiera obraz tła (image fullscreen) + overlay z tytułem + pozycją. Adaptacja dla services:
  - `{{ image }}` → użyj pola `image` z blueprintu service (`{{ image }}<img src="{{ url }}" ...>{{ /image }}` pattern)
  - `{{ title }}` → `{{ title }}` bez zmian
  - `{{ position }}` → **usuń** (nie ma w blueprincie service). Zamiast tego: użyj `{{ description truncate="80" }}` lub pomiń ten element
  - `{{ url }}` → `{{ url }}` bez zmian
- Grid wrapper bez zmian: `grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-7`
- Wrapper `section`: zachowaj `relative py-7 sm:py-8 md:py-10 lg:py-12 xl:py-14 2xl:py-16` + `<div class="container">`
- Header sekcji (tag_title + section_title + section_button) — zachowaj `{{ if tag_title }}...{{ /if }}` i `{{ if section_title or section_button }}...{{ /if }}`

#### 2b) `resources/views/component/services_grid_layouts/card-based.antlers.html`

**Źródło:** `https://raw.githubusercontent.com/webbycrown/bigmentor-statamic-theme/main/resources/views/component/card-based.antlers.html` (150 linii)

**Adaptacja:**
- Plik ma **dwa warianty** wewnętrzne: `{{ if card_based_grid == "post" }}` (post listing) i drugi blok (services-like). **Wybierz tylko drugą sekcję** (po `{{ /if }}` post listing) — to jest layout services-like z borderem i ikonami
- Usuń wszystkie `{{ page_builder }}{{ if type == "banner_section" }}...{{ /if }}{{ /page_builder }}` wrappery
- Usuń `paginate={pagination}` z tagu kolekcji — w fieldsecie nie mamy pola pagination (zostaw bez paginacji jak `soft`)
- Karty mają strukturę: `<div class="bg-white border border-gray-700 p-6 grid-item-append">` + ikona + tytuł + opis + button
- Mapowanie pól wpisu:
  - `{{ thumb_image }}` → **usuń** (lub jeśli używane: `{{ image }}<img>{{ /image }}` pattern)
  - `{{ title }}` → `{{ title }}`
  - `{{ thumb_description }}` → `{{ description }}`
  - `{{ url }}` → `{{ url }}`
  - `{{ block:button }}{{ text }}{{ /block:button }}` → cascade: `{{ button_label }}` → `{{ card_button_text }}` → `{{ trans key="Read more" }}` (jak w `soft.antlers.html`)
- **Dodaj ikonę na początku karty** — pattern jak w `soft.antlers.html`:
  ```antlers
  <div class="shrink-0 w-10 h-10 2xl:w-12 2xl:h-12 flex items-center justify-center text-black [&>svg]:w-full [&>svg]:h-full mb-4">
    {{ if icon_svg }}
      {{ iconify:icon_svg class="w-full h-full" aria-hidden="true" }}
    {{ else }}
      {{ icon }}
        <img src="{{ url }}" alt="{{ title }}" class="block w-full h-full object-contain" loading="lazy">
      {{ /icon }}
    {{ /if }}
  </div>
  ```

#### 2c) `resources/views/component/services_grid_layouts/column.antlers.html`

**Źródło:** `https://raw.githubusercontent.com/webbycrown/bigmentor-statamic-theme/main/resources/views/component/column.antlers.html` (92 linii)

**Adaptacja:**
- Bigmentor używa tego dla blog/case-studies — ma `{{ date }}` i `{{ author.title }}`. Blueprint service tych pól nie ma → **usuń** elementy date badge i "By {{author.title}}"
- Usuń `{{ page_builder }}{{ thumb_description }}{{ /page_builder }}` wrapper — zostaw tylko `{{ description }}`
- Usuń `{{ paginate }}{{ partial:pagination }}{{ /paginate }}` blok pagination — kolekcja services bez paginacji
- Mapowanie pól wpisu:
  - `{{ title }}` → `{{ title }}`
  - `{{ url }}` → `{{ url }}`
  - `{{ thumb_description }}` → `{{ description }}`
  - `{{ date }}`, `{{ author.title }}` → **usuń**
- Layout: lewa kolumna (tag_title + section_title, `max-w-[432px]`) + prawa kolumna (lista wpisów `max-w-[840px]`)
- Jeśli `tag_title` puste — warunkowo nie renderuj lewej kolumny (lub renderuj tylko `section_title`)
- Strzałka SVG → zachowaj inline SVG (mała ikona w okrągłym borderze po prawej każdej karty)

#### 2d) `resources/views/component/services_grid_layouts/asymmetric.antlers.html`

**Źródło:** `https://raw.githubusercontent.com/webbycrown/bigmentor-statamic-theme/main/resources/views/component/asymmetric.antlers.html` (55 linii)

**Adaptacja:**
- Plik **hardkoduje `limit="3"` i `sort="date:desc"`** — to dla blog/insights. **Zmień na `limit="{limit}"` i `sort="order:asc"`** (zgodnie z innymi wariantami)
- Karty wewnątrz mają warunki `{{ if count == 1 }}` (hero), `{{ if count == 2 or count == 3 }}` (small) — zachowaj logikę 1+2 ale **rozszerzony do większego N**: jeśli wpisów jest > 3, pokaż tylko pierwsze 3 albo zmień strategię (do decyzji Codexa — preferowane: hardkoduj `limit="3"` w samym wariancie, bo asymmetric **z założenia** pokazuje tylko 3 elementy; **nadpisz** pole `limit` z fieldsetu)
- Mapowanie pól wpisu:
  - `{{ image:url }}` → trzeba dostosować: `{{ image }}{{ url }}{{ /image }}` (Statamic asset field — pole `image` w blueprincie service)
  - `{{ title }}`, `{{ url }}` → bez zmian
  - `{{ date }}`, `{{ author.title }}` → **usuń** (services nie mają tych pól)
  - `{{ description truncate="150" }}` → `{{ description truncate="150" }}` (jeśli pole istnieje — sprawdź `service.yaml`)
- `bg-custom-gradient` / `bg-custom-gradient-200` → zastąp `bg-black/60` (skalisty nie ma tych custom gradients — bezpieczny fallback)
- **Wariant wymaga obrazu** — jeśli wpis nie ma pola `image`, zaowinij hero w `{{ if image }}...{{ /if }}` żeby uniknąć pustego div'a z background-image

### 3. Globalne mapowania klas (dla wszystkich 4 partiali)

| Bigmentor | Skalisty |
|---|---|
| `bg-vividblue-400` / `border-vividblue-400` | `bg-primary-900` / `border-primary-900` |
| `text-vividblue-400` / `hover:text-vividblue-400` | `text-primary-900` / `hover:text-primary-900` |
| `hover:bg-vividblue-400` / `hover:border-vividblue-400` | `hover:bg-primary-900` / `hover:border-primary-900` |
| `font-Larken` | `font-el-messiri` (Syne, w `--font-el-messiri`) |
| `font-Satoshi` | `font-lexend` |
| `text-25` / `text-20` / `text-28` / `text-32` / `text-45` / `text-22` / `text-13` / `text-24` / `text-26` | arbitrary `[Xpx]` |
| `text-1xl` | `text-1xl` (zachowane — istnieje w skalisty `--text-1xl: 20px`) |
| `text-md` (bigmentor custom) | `text-sm` lub `text-base` (skalisty default; `text-md` w skalisty to 16px, ale lepiej trzymać Tailwind native) |
| `leading-lineHeight` | `leading-normal` |
| `text-currentColor` | `text-current` |
| `bg-custom-gradient` / `bg-custom-gradient-200` | `bg-black/60` lub `bg-gradient-to-t from-black/80 to-transparent` |
| `all-btn` (custom bigmentor) | `btn btn-primary-reverse` (skalisty istniejący komponent) |
| `all-btn btn-outline` | `btn btn-primary` |
| `rounded-2xl` | bez zmian (Tailwind standard) |

### 4. Globalne mapowania pól wpisu kolekcji (dla wszystkich 4 partiali)

Blueprint service ma pola: `title`, `icon` (assets), `icon_svg` (iconify), `image` (assets), `description` (textarea), `button_label` (text), `slug`, `order`. **Nie ma**: `thumb_image`, `thumb_description`, `author`, `date`, `position`, `category`, `tag`.

| Bigmentor | Skalisty (service) | Uwaga |
|---|---|---|
| `{{ title }}` / `{{ url }}` | bez zmian | |
| `{{ description }}` / `{{ thumb_description }}` | `{{ description }}` | |
| `{{ image:url }}` (jako URL string) | `{{ image }}{{ url }}{{ /image }}` (asset field tag) | Statamic asset field — `{{ image }}...{{ /image }}` to context tag, `{{ url }}` w środku to URL pliku |
| `{{ image }}` w `style="background-image: url('...')"` | `style="background-image: url('{{ image:url }}');"` lub `{{ image }}{{ url }}{{ /image }}` w innym miejscu | |
| `{{ icon:url }}` (w button) | usunąć lub zachować SVG inline (małe strzałki) | |
| `{{ thumb_image }}` | `{{ image }}` (z asset tag pattern) | |
| `{{ author.title }}`, `{{ date }}`, `{{ position }}` | **usunąć** (brak w blueprincie service) | |
| Ikona główna (jeśli wariant ma) | Pattern z `soft.antlers.html`: `{{ if icon_svg }}{{ iconify:icon_svg ... }}{{ else }}{{ icon }}<img>{{ /icon }}{{ /if }}` | |
| Przycisk "Read more" / button text | Cascade: `{{ button_label }}` → `{{ card_button_text }}` → `{{ trans key="Read more" }}` | Identycznie jak `soft.antlers.html` |

### 5. Header sekcji (tag_title + section_title + section_button)

Każdy z 4 wariantów ma swój own header w bigmentor. Zachowaj strukturę w naszej adaptacji, ale **opakuj warunkowo**:

```antlers
{{ if tag_title or section_title or section_button }}
  <div class="...">
    {{ if tag_title }}
      <span class="border uppercase py-1 px-5 border-primary-900 rounded-2xl text-sm font-bold inline-block">{{ tag_title }}</span>
    {{ /if }}
    {{ if section_title }}
      <h2 class="...">{{ section_title }}</h2>
    {{ /if }}
    {{ section_button }}
      {{ if text and url }}
        <a href="{{ url }}" class="btn btn-primary-reverse">{{ text }}</a>
      {{ /if }}
    {{ /section_button }}
  </div>
{{ /if }}
```

Klasy header'a per wariant zachowaj z bigmentor (są różne — `flex-col md:flex-row`, gap, mb itd.).

### 6. Aktualizacja `soft.antlers.html` (mała zmiana)

W aktualnym `soft.antlers.html` dodać obsługę `tag_title` w header sekcji (przed `section_title`):

```antlers
{{ if tag_title or section_title or section_button }}
  <div class="mb-8 md:mb-10 xl:mb-14">
    <div class="flex items-center justify-between flex-wrap gap-5">
      <div class="inline-block">
        {{ if tag_title }}
          <span class="border uppercase py-1 px-5 border-primary-900 rounded-2xl text-sm font-bold mb-3 md:mb-5 inline-block">{{ tag_title }}</span>
        {{ /if }}
        {{ if section_title }}
          <h2 class="...">{{ section_title }}</h2>
        {{ /if }}
      </div>
      {{ section_button }}
        {{ if text and url }}
          <a href="{{ url }}" class="btn btn-primary-reverse">{{ text }}</a>
        {{ /if }}
      {{ /section_button }}
    </div>
  </div>
{{ /if }}
```

### 7. Build CSS

Po wszystkich zmianach — **obowiązkowo**:
```bash
npm run build
```

Każdy z 4 nowych partiali wprowadzi nowe arbitrary classes (`text-[Xpx]`, `pt-[60px]`, itd.) — Tailwind v4 musi rebuilować on-demand.

## Pliki do sprawdzenia (przed edycją)

- `resources/views/component/services_grid_layouts/soft.antlers.html` — wzorzec po HOTFIX-antlers-comment-syntax + HOTFIX-icon-container-color + STYLE-description-lighter
- `resources/fieldsets/services_grid_section.yaml` — aktualny stan fieldsetu
- `resources/blueprints/collections/services/service.yaml` — pola dostępne w blueprintcie service
- `content/collections/services.yaml` — sprawdzić czy `date_behavior` jest włączony (jeśli NIE, `{{ date }}` nie zadziała w żadnym wariancie)
- `public/assets/css/tailwind.css` — referencja dla `--color-primary-900`, `--font-el-messiri`, `.btn`, `.btn-primary-reverse`, `.btn-primary`, `font-light font-lexend` (paragrafy default)
- 4 raw URL bigmentor (każdy wariant ma URL podany w sekcji 2)

## Pliki do zmiany

- **EDIT**: `resources/fieldsets/services_grid_section.yaml` (+4 opcje w `layouts_grid`, +1 pole `tag_title`)
- **EDIT**: `resources/views/component/services_grid_layouts/soft.antlers.html` (warunkowy header z `tag_title`)
- **NOWE 4 PARTIALE**:
  - `resources/views/component/services_grid_layouts/row.antlers.html`
  - `resources/views/component/services_grid_layouts/card-based.antlers.html`
  - `resources/views/component/services_grid_layouts/column.antlers.html`
  - `resources/views/component/services_grid_layouts/asymmetric.antlers.html`
- **REBUILD**: `public/assets/css/output.css` (przez `npm run build`)

## Wymagania techniczne

- **Składnia komentarzy Antlers**: `{{# ... #}}` (dwa nawiasy, lekcja z HOTFIX-antlers-comment-syntax z tej sesji). **NIE** `{# ... #}` (Twig).
- Każdy partial ma komentarz atrybucji w pierwszej linii: `{{# Layout adapted from webbycrown/bigmentor-statamic-theme — resources/views/component/{nazwa}.antlers.html. ... #}}`
- Brak nowych dependencji npm/composer
- Nie modyfikować blueprintu `service` ani kolekcji `services.yaml`
- Multisite-safe: `{{ url }}` w Antlers automatyczny per-locale
- Pełna i18n: każdy hardcoded string → `{{ trans key="..." }}` (jeśli pojawi się w markupie)
- Wszystkie klasy `text-[Xpx]` zachowane z bigmentor dla wierności wizualnej

## Ograniczenia

- **NIE commitować** (AGENTS.md 22.2)
- **NIE modyfikować** dispatcher (`services_grid_section.antlers.html`) — działa generycznie
- **NIE modyfikować** blueprintu service ani innych blueprintów
- **NIE dodawać** pól `date`, `author`, `position` do blueprintu service — usuwamy te elementy w markupie zamiast dopinać do CMS
- **NIE zmieniać** istniejących wariantów soft (tylko `tag_title` jeśli `tag_title` zostaje dodany do fieldsetu)
- **NIE dodawać** paginacji do fieldsetu — sekcja nadal renderuje bez paginacji (jak `soft`)

## Kryteria akceptacji

- [ ] `services_grid_section.yaml` ma 5 opcji w `layouts_grid` (`soft`, `row`, `card-based`, `column`, `asymmetric`) + pole `tag_title` (text, localizable, opcjonalne)
- [ ] 4 nowe partiale istnieją w `resources/views/component/services_grid_layouts/` (każdy z komentarzem atrybucji w **poprawnej** składni Antlers `{{# ... #}}`)
- [ ] Mapowania klas zaaplikowane wg tabeli (sekcja 3) — w żadnym partial nie ma `vividblue`, `Larken`, `Satoshi`, `custom-gradient`, `text-25`/`text-20`/`text-28` (bez nawiasów), `leading-lineHeight`, `text-currentColor`
- [ ] Mapowania pól zaaplikowane wg tabeli (sekcja 4) — w żadnym partial nie ma `thumb_image`, `thumb_description`, `author`, `date`, `position` (z wyjątkiem inline SVG arrows które używają hardkodowanych path'ów — bez zmian)
- [ ] Usunięte warunki `{{ if type == "..." }}` i `{{ page_builder }}` wrappers w każdym partial
- [ ] `soft.antlers.html` ma warunkowy header z `tag_title` przed `section_title`
- [ ] `npm run build` wykonany — output.css zawiera nowe arbitrary classes (`text-[22px]`, `text-[24px]`, `text-[26px]`, `text-[13px]`, `gap-12`, `gap-x-24`, itd.); weryfikacja przez `python3 -c "f.read().count('text-\\\\[26px\\\\]')"` (NIE przez literal grep — artefakt minifikacji Tailwind v4)
- [ ] `php artisan statamic:stache:refresh && php artisan view:clear && php artisan cache:clear` — OK
- [ ] `php artisan test` — 2 passed
- [ ] HTTP smoke: `curl -sI http://127.0.0.1:8001/oferta` → 200, `/en/` → 200
- [ ] Manualnie w CP: zmiana `layouts_grid` na stronie `/oferta` (już ma testowy blok) na każdy z 4 nowych wariantów → render frontend działa, brak błędów PHP/Antlers w `storage/logs/laravel.log`

## Testowanie

```bash
# Pre-implementation check
grep -n "layouts_grid\|tag_title" resources/fieldsets/services_grid_section.yaml
ls resources/views/component/services_grid_layouts/

# Post-implementation
php artisan statamic:stache:refresh
php artisan view:clear
php artisan cache:clear
php artisan test
npm run build

# Verify each variant by editing oferta.md (manualnie lub przez Statamic CLI):
# zmieniaj `layouts_grid: soft` → `row` → `card-based` → `column` → `asymmetric`
# i sprawdzaj curl http://127.0.0.1:8001/oferta

# Weryfikacja klas w output.css (przez Python — NIE literal grep):
python3 -c "
with open('public/assets/css/output.css') as f: css = f.read()
for cls in ['text-[26px]', 'text-[22px]', 'text-[24px]', 'gap-x-24', 'bg-black/60']:
    escaped = cls.replace('[', '\\\\[').replace(']', '\\\\]').replace('/', '\\\\/')
    print(f'{cls}: {css.count(escaped)}')
"

# Sprawdź czy nie ma referencji do nieistniejących pól w żadnym partial:
for v in row card-based column asymmetric soft; do
  echo "--- $v ---"
  grep -E "thumb_image|thumb_description|author\.|date|position|vividblue|Larken|Satoshi|custom-gradient" \
    resources/views/component/services_grid_layouts/$v.antlers.html || echo "(czysto)"
done
```

**Walidacja manualna** (do potwierdzenia przez użytkownika):
1. Edycja `content/collections/pages/pl/oferta.md` — zmiana `layouts_grid: soft` na każdy z 4 nowych wariantów po kolei
2. `php artisan statamic:stache:refresh` po każdej zmianie YAML
3. Odśwież `http://127.0.0.1:8001/oferta` — render zgodny z bigmentor demo (`row` → 4-kol, `card-based` → 3-kol z hover, `column` → wertykalna lista, `asymmetric` → hero + 2 mniejsze)

Jeżeli testów nie da się uruchomić, Codex ma opisać powód w `CODEX_SUGGESTIONS.md`.

## Synchronizacja dokumentacji

- [x] `PROJECT_STATUS_CODEX.md` ma `active_task_id: FEATURE-services-grid-section-variants`
- [x] `PROJECT_STATUS_CODEX.md` pokazuje to zadanie w sekcji `W trakcie`
- [x] `CLAUDE_MEMORY.md` ma ten sam `active_task_id`
- [x] state_version = `2026-06-20-1830` w 3 plikach
- [x] Poprzedni `last_closed: FEATURE-services-grid-section-soft` zachowany

## Informacje do zapisania w CODEX_SUGGESTIONS.md

Codex po zakończeniu pracy ma dopisać w `ACTIVE_FOR_CLAUDE_REVIEW`:

- co zostało wykonane (4 partiale + edycja fieldsetu + edycja soft.antlers.html)
- jakie pliki zostały zmienione (z liczbami linii dodanych/usuniętych)
- jakie problemy wykryto (np. czy w bigmentor markupie były niespodziewane zależności np. `partial:pagination`, jakie konkretnie usunięto)
- jakie ryzyka istnieją (np. czy któryś wariant wymaga obrazu — `asymmetric` — i co się dzieje gdy wpis nie ma `image`)
- jakie testy zostały wykonane (artisan test, npm run build, render każdego wariantu na `/oferta`)
- czy zauważył gotowe rozwiązania lepsze od założonej implementacji
- czy wystąpił `Doc drift`

## Informacje do zapisania w codex-memory.md

- Dispatcher pattern działa idealnie — dodawanie nowych wariantów to teraz 1 partial + 1 opcja w `layouts_grid.field.options`
- Mapowania bigmentor→skalisty udokumentowane w 2 briefach (soft + variants) — przyszłe warianty (`hard`, `futured`, `highlights`, `accordion`) będą używać tych samych mapowań
- Pola wpisu service są ograniczone (brak `date`, `author`, `position`, `thumb_image`) — warianty bigmentor zaprojektowane dla blog/insights kolekcji wymagają adaptacji pól

## Informacje do zapisania w CONCLUSIONS_CODEX.md

Opcjonalnie — sekcja "Rekomendowana kolejność dalszych prac":
- Po tym briefie, kolejne 4 warianty (`hard`, `futured`, `highlights`, `accordion`) możemy dodać w jednym kolejnym briefie albo per case
- Alternatywnie: dispatcher pattern można replikować dla kolekcji `projects` (analogiczna sekcja `projects_grid_section`)

---

*Brief napisany przez Claude, 2026-06-20 18:30 Europe/Warsaw. Stała lokalnego dev: frontend `http://127.0.0.1:8001/`, PHP lokalnie `php artisan` (na dhosting: `php84`).*
