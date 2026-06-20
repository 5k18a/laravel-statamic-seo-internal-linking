# CHANGE-LOG.md

Changelog projektu `skalisty-orion` — prowadzony przez Claude po każdym zakończonym zadaniu.

---

## 2026-06-20 (STYLE-card-button-cascade-reverse)

### Zmieniono

- **Odwrócenie cascade priorytetu przycisku karty** w `services_grid_section`. Nowy porządek: `card_button_text` (pole fieldsetu, per-section) → `button_label` (pole entry) → `{{ trans key="Read more" }}`. Wcześniej: `button_label` (per-entry) miało priorytet. UX motivation: redaktor sekcji chce mieć kontrolę nad tekstem przycisku w danej sekcji bez konieczności edycji każdego wpisu kolekcji.
- Zmiana w 2 plikach (warianty z przyciskiem CTA per karta): `resources/views/component/services_grid_layouts/soft.antlers.html`, `resources/views/component/services_grid_layouts/card-based.antlers.html`. Pozostałe warianty (`row`, `column`, `asymmetric`) nie używają button text per karta — klik na całą kartę.
- Zaktualizowane instructions pola `card_button_text` w `services_grid_section.yaml` — usunięto słowo "(fallback)" z `display`, dopisano w instructions że pole **nadpisuje** `button_label` (wcześniej było odwrotnie udokumentowane).

### Walidacja

- Render `/oferta` lokalnie: 12 buttonów "Dowiedz się więcej" (z `card_button_text` w services_grid block — wcześniej było 12× "Dowiedz Się Więcej" z `button_label` Title Case).

**Wykonane przez Claude bezpośrednio.**

---

## 2026-06-20 (Deploy-services-grid-2026-06-20)

### Wdrożono

- **Deploy na `dev.skalisty.pl`** wszystkich zmian z sesji 2026-06-20 (popołudnie+wieczór): FEATURE-services-grid-section-soft + FEATURE-services-grid-section-variants (4 nowe warianty) + FEATURE-asymmetric-entries-picker + FEATURE-free-text-margins-control + 6 hotfixów/style'ów.
- **Backup zdalny:** `~/skalisty_2026_backups/before-services-grid-2026-06-20.tar.gz` (160 KB).
- **Rsync stats:** 1.1 MB sent / 848 KB received z 504.5 MB total, speedup 254× (incremental).
- **Post-deploy** OK: `config:clear` + `cache:clear` + `view:clear` + `statamic:stache:refresh` + `php artisan test` (2 passed).
- **HTTP smoke** OK: `/` 200, `/oferta` 200, `/en/` 301, `/cp/login` 302.
- **Render produkcji potwierdzony:** 12 kart services_grid soft, free_text 2-kolumny z `column_padding: large` + `content_max_width: prose`, 0 surowych komentarzy Antlers w HTML.

### Uwagi operacyjne

- **Classifier auto-mode w Claude Code v2.1.150** zablokował deploye SSH do produkcji z reason "Production Deploy / Remote Shell Writes require explicit user authorization for each deploy". Workaround: user wyszedł z auto mode (`/auto` toggle off) — w non-auto SSH działa standardowo. Najprawdopodobniej Anthropic przeniósł "Production Deploy" z `soft_deny` do `hard_deny` w defaults v2.1.x.
- **`skalisty-ssh` wrapper** (`~/Insync/.../Linux/bin/skalisty-ssh`) domyślnie nie ma flagi `+x` — wymagało `chmod +x` przed pierwszym wywołaniem. Po `chmod` działa bezpośrednio (też przez `bash $SSH` jako fallback).
- Skrypt deployowy w `/tmp/deploy-services-grid-2026-06-20.sh` — zachowany jako referencja patternu (backup → rsync → post-deploy → HTTP smoke).
- DEPLOYMENT.md zaktualizowany z pełną sekcją "Deploy przyrostowy — 2026-06-20 (17:01)".

---

## 2026-06-20 (FEATURE-free-text-margins-control)

### Dodano

- **3 nowe pola w `free_text_section.yaml`** dla pełnej kontroli marginesów/odstępów:
  - `column_gap` — odstęp między kolumnami (`none`/`small`/`medium`/`large`/`xl` → `gap-0`/`gap-4`/`gap-6`/`gap-10`/`gap-16`); default `medium` (zachowuje obecny `gap-6`); widoczne tylko w trybie `columns`.
  - `column_padding` — padding wewnątrz każdej kolumny (`none`/`small`/`medium`/`large` → brak/`p-3`/`p-6`/`p-10`); default `none` (zachowuje obecny brak padding); widoczne tylko w trybie `columns`.
  - `content_max_width` — max szerokość bloku tekstu (`full`/`prose`/`narrow` → brak/`max-w-prose mx-auto`/`max-w-[45ch] mx-auto`); default `full` (zachowuje obecne pełne rozciągnięcie); **widoczne w obu trybach** (single + columns) bo długie linie są problemem w obu.

### Zmieniono

- `resources/views/page_builder/free_text_section.antlers.html` — przeprojektowany na mapping klas przez `{{ if/elseif/else }}` inline; dodany dodatkowy wrapper `<div>` per kolumna dla `column_padding` i wewnętrzny wrapper dla `content_max_width`; w trybie single też owinięto `{{ content }}` w wrapper `content_max_width`.
- `public/assets/css/output.css` — rebuild, nowe klasy: `gap-0`, `gap-4`, `gap-10`, `gap-16`, `p-3`, `p-6`, `p-10`, `max-w-prose`, `max-w-[45ch]`, `mx-auto`.

### Decyzje techniczne

- **Domyślne wartości zachowują obecny render** — `column_gap: medium` (gap-6 = obecny), `column_padding: none` (brak = obecny), `content_max_width: full` (brak max-w = obecny). Istniejące strony nie zmienią wyglądu po wdrożeniu.
- **`content_max_width` w obu trybach** (nie tylko columns) — bo zbyt szerokie linie tekstu są problemem czytelności równie w trybie single (np. `width: full` + duży tekst).
- **`mx-auto`** dodane razem z max-width żeby tekst był wycentrowany po obcięciu szerokości.
- **Inline `{{ if/elseif/else }}` w klasach** zamiast set/assign zmiennych — czytelniejsze dla edytora Antlers, mniej magii.

### Walidacja

- YAML poprawny (9 pól, w tym 3 nowe).
- 10 nowych klas w `output.css` (sprawdzone przez Python z escape backslash).
- HTTP 200 dla `/` i `/oferta`.

**Wykonane przez Claude bezpośrednio** (średnia poprawka — 1 fieldset + 1 widok, ~50 linii zmian; granica brief-vs-bezpośredniej; user wcześniej wybrał ścieżkę przez AskUserQuestion = sygnał do bezpośredniej implementacji).

---

## 2026-06-20 (STYLE-asymmetric-grayscale-hover)

### Dodano

- **Asymmetric — efekt grayscale na obrazach z hover-reveal** — wszystkie 4 `<img>` w asymmetric (2 hero + 2 small w obu pętlach picker/fallback) mają klasy `grayscale group-hover:grayscale-0`. Domyślnie obraz jest czarno-biały, na hover karty (klasa `group` na `<article>`) wraca do pełnego koloru. Animacja zoom `group-hover:scale-105` zachowana.
- **Tekst hover-reveal** — wszystkie 12 wystąpień `text-white/80` (kontenery + h3 + p) rozszerzone o `group-hover:text-white` — domyślnie 80% białego, na hover pełna biel.
- `transition-transform duration-500` → `transition-all duration-500` na `<img>` żeby grayscale, scale i color tekstu przechodziły płynnie razem.

### Zmieniono

- `resources/views/component/services_grid_layouts/asymmetric.antlers.html` — replace_all (4× `<img>` + 12× `text-white/80`).
- `public/assets/css/output.css` — rebuild (`grayscale`, `group-hover:grayscale-0`, `group-hover:text-white`, `transition-all` wygenerowane).

### Walidacja

- Render `/oferta` z `layouts_grid: asymmetric`: HTTP 200, `<img>` z klasami grayscale + group-hover:grayscale-0 + transition-all + group-hover:scale-105, `<h3>` z text-white/80 + group-hover:text-white. Klasy w output.css obecne (sprawdzone przez Python z escape backslash).

**Wykonane przez Claude bezpośrednio.**

---

## 2026-06-20 (STYLE-asymmetric-text-overlay)

### Naprawiono

- **Asymmetric — tekst i przyciemnienie obrazu** — czcionka w hero i małych kartach zmieniona na `text-white/80` (biały z 20% przezroczystości) na <h3>, <p> i kontenerze; overlay'e mniej intensywne o 30 punktów: hero `bg-black/60` → `bg-black/30`, małe karty `from-black/80 via-black/35` → `from-black/50 via-black/5` (gradient od dołu). Zmiana w obu pętlach (picker + fallback collection). `npm run build` wymagany — nowe klasy `text-white/80`, `bg-black/30`, `from-black/50`, `via-black/5` wygenerowane. Render zweryfikowany: HTTP 200, klasy w HTML i output.css. **Wykonane przez Claude bezpośrednio.**

---

## 2026-06-20 (FEATURE-asymmetric-entries-picker)

### Dodano

- **Picker wpisów dla wariantu `asymmetric`** — nowe pole `asymmetric_entries` w `services_grid_section.yaml` (type: `entries`, `max_items: 3`, warunkowo widoczne przy `layouts_grid: equals asymmetric`). Redaktor może ręcznie wybrać 3 wpisy do wyświetlenia w wariancie asymmetric: 1. → hero (lewa, `lg:row-span-2`), 2./3. → karty mniejsze (prawa). Bez ograniczenia `collections` w pickerze (możliwy wybór z dowolnej kolekcji, nie tylko `services`).
- **Cascade fallback w widoku asymmetric** — `{{ if asymmetric_entries }}{{ asymmetric_entries }}...{{ /asymmetric_entries }}{{ else }}{{ collection:{collections} limit="3" sort="order:asc" }}...{{ /collection:{collections} }}{{ /if }}`. Pusty picker = automatyczne pobranie 3 pierwszych wpisów z kolekcji (zachowanie z FEATURE-services-grid-section-variants).
- **Limit 3 stały** — wynika z layoutu siatki (1 hero lg:row-span-2 + 2 mniejsze karty); `max_items: 3` w polu picker zapobiega wybraniu większej liczby. Świadoma decyzja UX — udokumentowana w instructions pola.

### Zmieniono

- `resources/fieldsets/services_grid_section.yaml` — +9 linii (pole `asymmetric_entries` z type entries, max_items 3, if condition).
- `resources/views/component/services_grid_layouts/asymmetric.antlers.html` — +44 linie (warunek `{{ if asymmetric_entries }}` + duplikacja markupu karty dla obu pętli — picker i fallback; brzydsze niż partial ale tylko 2 typy kart, akceptowalna duplikacja).

### Decyzje techniczne

- **Picker bez ograniczenia `collections`** — pozwala wybrać wpisy z dowolnej kolekcji (`services`, `projects`, `blogs`, etc.). Praktycznie redaktor wybierze tę samą kolekcję co w polu `collections` powyżej, ale opcjonalna elastyczność jest zachowana.
- **Duplikacja markupu kart** zamiast partial — ma sens przy 2 typach kart (hero + small), partial'owanie byłoby over-engineering dla tego scope. Jeśli w przyszłości dodamy więcej typów kart lub kolejnych wariantów z picker'em, można refaktoryzować na partial.

### Walidacja

- YAML fieldsetu poprawny (8 pól, w tym `asymmetric_entries` z type entries, max_items 3, if condition)
- Fallback (picker pusty) → HTTP 200, render 3 wpisów z hero + 2 mniejszymi
- Brak rebuild CSS — wszystkie klasy już w output.css

### Uwagi

**Wykonane przez Claude bezpośrednio** (zgodnie z regułą małych poprawek po sesji 2026-06-20). Średnia poprawka — 2 pliki, ~50 linii zmian; granica brief-vs-bezpośredniej decyzji Claude.

---

## 2026-06-20 (HOTFIX-column-fullwidth)

### Naprawiono

- **`column.antlers.html` — pełna szerokość listy** — wariant column miał layout 2-kol bigmentor (`flex lg:flex-row`, header `lg:max-w-[432px]`, lista `lg:max-w-[840px]`) → lista zajmowała ~50% szerokości na desktop. Nazwa wariantu w fieldsetcie obiecywała "wertykalna lista pełnej szerokości" — niezgodność z renderem. Zmiana: outer wrapper `flex flex-col gap-8 md:gap-10 xl:gap-12` (kolumnowy), header NAD listą jako `w-full flex md:flex-row md:items-end md:justify-between` (z section_button po prawej na desktop), lista bez `max-w` z klasą `w-full`. Walidacja: render `/oferta` z `layouts_grid: column` → outer `flex flex-col`, lista `w-full`, brak starych `lg:max-w-[432px]`/`[840px]`, 12 kart, HTTP 200. Brak rebuild — wszystkie klasy już w `output.css`. **Wykonane przez Claude bezpośrednio.**

---

## 2026-06-20 (FEATURE-services-grid-section-variants)

### Dodano

- **4 nowe warianty layoutu** w dispatcherze `services_grid_section` — `row`, `card-based`, `column`, `asymmetric`. Wzorce z `webbycrown/bigmentor-statamic-theme` (publiczne repo, siostrzany motyw Webbycrown).
- `resources/views/component/services_grid_layouts/row.antlers.html` (58 linii) — 4-kol grid (xl), karty z `image` jako background + `bg-gradient-to-t from-black/80 via-black/30` overlay, tytuł + truncated description w dolnej części karty.
- `resources/views/component/services_grid_layouts/card-based.antlers.html` (70 linii) — 3-kol grid, karty z `border border-gray-700 rounded-2xl p-6 2xl:p-8` + hover (`hover:border-primary-900 hover:shadow-xl`), ikona Iconify/asset fallback (pattern z soft), tytuł + opis + cascade "Read more" link ze strzałką.
- `resources/views/component/services_grid_layouts/column.antlers.html` (57 linii) — 2-kol flex layout: lewa kolumna (`lg:max-w-[432px]`) z header (tag_title + section_title + section_button), prawa kolumna (`lg:max-w-[840px]`) z `border-t/-b border-gray-700` listą wpisów; każda karta ma okrągłą strzałkę po prawej (`rounded-full border border-primary-900`) z `group-hover:bg-primary-900 group-hover:text-white`.
- `resources/views/component/services_grid_layouts/asymmetric.antlers.html` (86 linii) — 2-kol 2-row grid, hardkodowany `limit="3"`: 1 hero (`lg:row-span-2`, `min-h-[620px]`, gradient `bg-black/60`) + 2 mniejsze karty (`min-h-[296px]`, `from-black/80 via-black/35`), każda z obrazem jako background.
- Pole `tag_title` w `services_grid_section.yaml` — text, localizable, opcjonalne (badge nad section_title).
- 4 nowe opcje w `layouts_grid.field.options`: `row`, `card-based`, `column`, `asymmetric`.

### Zmieniono

- `resources/fieldsets/services_grid_section.yaml` (62 → 81 linii) — +4 opcje `layouts_grid` + 1 nowe pole `tag_title`.
- `resources/views/component/services_grid_layouts/soft.antlers.html` (68 → 74 linie) — warunkowy header z `{{ if tag_title }}<span class="border ... border-primary-900 ...">{{ tag_title }}</span>{{ /if }}` przed `section_title` (spójność z 4 nowymi wariantami które wszystkie obsługują `tag_title`).
- `public/assets/css/output.css` — rebuild przez `npm run build`, nowe arbitrary classes wygenerowane (`text-[22px]`, `text-[24px]`, `text-[26px]`, `text-[13px]`, `gap-x-24`, `bg-black/60`, `min-h-[296px]`, `min-h-[620px]`, `via-black/30`, `via-black/35`, `from-black/80`, itd.)

### Decyzje techniczne

- **Adaptacja `row`** — bigmentor oryginał ma karty `consultants_members` z `position` (nieobecne w blueprincie service). Codex zaadaptował jako **hero z obrazem + gradient overlay** — sensowne dla services, zachowuje 4-kol grid bez utraty wizualnej spójności z bigmentor.
- **`card-based` używa wzorca ikony z soft** — Iconify (`icon_svg`) z fallbackiem do `icon` asset; pozostałe warianty (`row`, `column`, `asymmetric`) **nie używają ikon** — są oparte na obrazach (image) lub czystej typografii (column).
- **`asymmetric` hardkoduje `limit="3"`** — zgodne z naturą layoutu (1 hero + 2 mniejsze). Pole `limit` z fieldsetu nie steruje tym wariantem; Codex zaznaczył to w raporcie dla świadomości redaktora.
- **`column` bez paginacji** — bigmentor oryginał używa `{{ paginate }}` z `partial:pagination`, ale fieldset `services_grid_section` nie ma pola `pagination` → usunięte.
- **`row` i `column` bez button-CTA per karta** — `column` ma klik na całą `<a>` wokół karty + strzałkę, `row` ma klik na hero. Sensowne uproszczenie dla list-style.
- **Cascade fallback przycisku** zachowany **tylko w `card-based`** (jak w `soft`): `button_label` → `card_button_text` → `{{ trans key="Read more" }}`. W innych wariantach przycisk nie istnieje jako osobny element.

### Mapowania bigmentor → skalisty (zaaplikowane w 4 partialach)

| Bigmentor | Skalisty |
|---|---|
| `bg-vividblue-400`, `text-vividblue-400`, `border-vividblue-400` | `bg-primary-900`, `text-primary-900`, `border-primary-900` |
| `font-Larken` | `font-el-messiri` (= Syne) |
| `font-Satoshi` | `font-lexend` |
| `text-25`/`20`/`28`/`32`/`45`/`22`/`13`/`24`/`26` | arbitrary `text-[Xpx]` |
| `leading-lineHeight` | `leading-normal` |
| `text-currentColor` | `text-current` |
| `bg-custom-gradient`/`bg-custom-gradient-200` | `bg-black/60` lub `bg-gradient-to-t from-black/80 via-black/30 to-transparent` |
| `all-btn`/`all-btn btn-outline` | `btn btn-primary-reverse` / `btn btn-primary` |
| `{{ thumb_image }}`, `{{ thumb_description }}` | `{{ image }}`, `{{ description }}` |
| `{{ author.title }}`, `{{ date }}`, `{{ position }}` | **usunięte** (brak w blueprincie service) |
| `{{ image:url }}` jako URL string | `{{ image }}<img src="{{ url }}">{{ /image }}` (asset field pattern) |
| `{{ page_builder }}...{{ /page_builder }}` wrappers | **usunięte** (struktura specyficzna bigmentor) |
| `{{ if type == "..." }}` warunki | **usunięte** (typy specyficzne bigmentor) |

### Analiza gotowych rozwiązań

Pominięta — nie nowa większa funkcjonalność, tylko inkrementalna implementacja w już zaprojektowanym dispatcher pattern z poprzedniego briefu FEATURE-services-grid-section-soft (2026-06-20-1500).

### Uwagi

- **Zewnętrzna zmiana podczas testów Codexa** — `content/collections/pages/pl/oferta.md` został zmodyfikowany przez użytkownika w CP w trakcie testów Codexa: dodany blok `free_text_section`, nowy `updated_at`. Codex słusznie nie cofnął (poza scope). Aktualny stan: `services_grid_section` z `layouts_grid: soft`, plus nowy `free_text_section`.
- **Brief zarchiwizowany** — `briefs/archive/2026-06-20-feature-services-grid-section-variants.md` (392 linie).
- **Pozostałe warianty bigmentor (4)** — `hard`, `futured`, `highlights`, `accordion` — w backlogu jako opcjonalne. Dispatcher pattern gotowy: każdy kolejny wariant to 1 partial + 1 opcja w `layouts_grid.field.options`.
- **Walidacja runtime**: HTTP 200 dla każdego z 5 wariantów (soft + 4 nowe) po tymczasowej zmianie `layouts_grid` w `oferta.md`, brak błędów Antlers/PHP, render bez exception'ów, klasy arbitrary w output.css zweryfikowane przez Python (Tailwind v4 escape backslash).

---

## 2026-06-20 (FEATURE-services-grid-section-soft)

### Dodano

- **Nowa sekcja page buildera `Services Grid Section`** — odrębna sekcja niezależna od istniejącego `service_section`, z dispatcherem layoutu (na start 1 wariant `soft`).
- `resources/fieldsets/services_grid_section.yaml` (62 linie) — 6 pól: `layouts_grid` (select, default `soft`), `section_title` (localizable), `section_button` (grid: text+url), `collections` (single-select), `limit` (default 0), `card_button_text` (localizable, default "Read more").
- `resources/views/page_builder/services_grid_section.antlers.html` (2 linie) — dispatcher: `{{ partial src="component/services_grid_layouts/{layouts_grid}" }}`.
- `resources/views/component/services_grid_layouts/soft.antlers.html` (68 linii) — adaptacja `component/soft.antlers.html` z `webbycrown/bigmentor-statamic-theme` (publiczne repo, siostrzany motyw Webbycrown), z komentarzem atrybucji w pierwszej linii.
- Klucz `"Read more"` w 12 lang/*.json (PL "Czytaj więcej", EN "Read more", reszta przez `lang:translate` z prior sessions / Codex ręcznie).

### Zmieniono

- `resources/fieldsets/all_page_builder.yaml` (+5/-0) — rejestracja setu `services_grid_section` po `service_section` w grupie `new_set_group`.
- `public/assets/css/output.css` — rebuild przez `npm run build`, arbitrary classes (`text-[25px]`, `text-[20px]`, `text-[28px]`, `text-[32px]`, `text-[45px]`) i pseudo-elementy (`before:content-['']`, `after:content-['']`) wygenerowane przez Tailwind v4.
- `content/collections/pages/pl/oferta.md` — Codex dodał testowy blok `services_grid_section` (collections: services, limit: 0, card_button_text: "Dowiedz się więcej") dla real-runtime weryfikacji renderingu. Pozostawione — user może ocenić wizualnie i zdecydować o zachowaniu/usunięciu.

### Decyzje techniczne

- **Odrębna sekcja zamiast nowego `show_type`** — decyzja architektoniczna z audytu: modele danych bigmentor `component/soft` vs skalisty `service_section` rozjeżdżają się; zaśmiecanie istniejącego fieldsetu polami warunkowymi byłoby gorsze niż osobny blok. Precedens w repo: `wysiwyg_html_block`, `columns_section`, `skalisty_gallery_section`, `icon_box_with_text_section`.
- **Dispatcher pattern** — `{{ partial src="component/services_grid_layouts/{layouts_grid}" }}` analogiczny do bigmentor `grid_showcase.antlers.html`. Pozwala dorzucać kolejne warianty (`hard`, `asymmetric`, `card-based`, itp.) bez zmiany fieldsetu i głównego widoku.
- **Pole `collections` konfigurowalne** (single-select) — sekcja nie jest hardkodowana pod `services`, można jej użyć dla dowolnej kolekcji.
- **Cascade fallback przycisku karty**: `button_label` (per-entry z blueprintu service) → `card_button_text` (per-section z fieldsetu) → `{{ trans key="Read more" }}` (lang/*.json).
- **Mapowania klas Tailwind** (bigmentor → skalisty): `bg-theme-900`/`bg-vividblue-400` → `bg-primary-900`; `font-Larken` → `font-el-messiri` (= Syne); `text-25/20/28/32/45` → arbitrary `text-[25px]`/itd.; `leading-lineHeight` → `leading-normal`; `text-currentColor` → `text-current`.
- **Pattern ikony** zachowany z istniejących show_type: `{{ if icon_svg }}{{ iconify }}{{ else }}{{ icon }}<img>{{ /icon }}{{ /if }}` — Iconify z fallbackiem do asset.

### Analiza gotowych rozwiązań

| Rozwiązanie | Werdykt |
|---|---|
| Natywne Statamic page builder | Brak generic "grid showcase" |
| Mechanizm Orion (`service_section`) | Odrzucony — modele danych nieprzystające |
| Addon Statamic | Brak gotowego |
| **Bigmentor `component/soft`** | **Wybrane** — publiczne repo Webbycrown, markup gotowy, remapping prosty |
| Custom from scratch | Niepotrzebne |

### Uwagi

- **Artefakt minifikacji Tailwind v4** — komenda walidacyjna z briefu `grep -c 'text-\[25px\]' output.css` zwraca 0, ponieważ Tailwind v4 zapisuje klasy z literal backslash escape (`.text-\[25px\]`). Faktyczne klasy SĄ w output.css — weryfikacja przez `python3 -c "f.read().count('text-\\\\[25px\\\\]')"`. Do uwzględnienia w przyszłych briefach.
- **Codex dodał testowy blok do content** — wykraczając poza brief (brief mówił o walidacji manualnej w CP, nie programowej edycji YAML), ale acceptable bo pozwoliło na real-runtime weryfikację. Powinno być wyraźnie odznaczone w przyszłych raportach Codexa.
- **Walidacja runtime**: render `/oferta` HTTP 200; w renderowanym HTML 12 kart usług (`border-l border-b border-gray-700`), 12 buttonów "Dowiedz Się Więcej" (cascade z `button_label`), pseudo-elementy `before:content-['']`/`after:content-['']` aktywne, SVG iconify renderuje się z currentColor (biała ikona na żółtym `bg-primary-900` okręgu). `php artisan test` 2 passed.
- Brief zarchiwizowany: `briefs/archive/2026-06-20-feature-services-grid-section-soft.md`.

### Naprawiono (post-audit hotfix — Claude bezpośrednio)

- **HOTFIX-antlers-comment-syntax** — komentarze atrybucji w `services_grid_section.antlers.html` i `soft.antlers.html` używały błędnej składni `{# ... #}` (Twig/Liquid), zamiast Antlers `{{# ... #}}` → renderowały się jako zwykły tekst na froncie. Zmiana: `{# ` → `{{# ` i ` #}` → ` #}}` w 2 plikach (2 znaki w 2 plikach). Walidacja: `view:clear` + `curl /oferta`, komentarze już nie pojawiają się w HTML, sekcja renderuje 12 kart, HTTP 200. **Wykonane przez Claude bezpośrednio** — od tej sesji user wyraźnie zezwolił na małe poprawki Claude bez briefu dla Codexa (regulacja zapisana w pamięci Claude: `feedback_male_poprawki_bez_codexa`).
- **HOTFIX-icon-container-color** — kontener ikony w `soft.antlers.html` używał `bg-primary-900 rounded-full text-white` (wzorzec bigmentor: biała ikona na żółto-brązowym okrągłym tle), co powodowało dwa problemy: (1) SVG Iconify renderował się jako biała ikona, kontrastując z kolorowymi PNG-fallback'ami (demo data `faq-*.png`) na pozostałych wpisach kolekcji — wizualny "mix"; (2) odbiegało od istniejącego patternu `service_section` show_type, gdzie ikony są bez tła w kolorze tekstu. Zmiana: usunięto `bg-primary-900 rounded-full`, zmieniono `text-white` → `text-black` (kolor jak czcionka). SVG Iconify dziedziczy `currentColor` z parent → czarna ikona. PNG z assets nadal renderują się w oryginalnych kolorach (bez wpływu klasy parent na piksele), ale na białym tle karty wyglądają spójnie z istniejącym `service_section`. Brak rebuild CSS — `text-black` już w `output.css` (5 wystąpień). Walidacja: `view:clear` + `curl /oferta` HTTP 200, kontener bez `bg-primary-900`/`rounded-full`/`text-white`. **Wykonane przez Claude bezpośrednio.**
- **STYLE-description-lighter** — paragraf `{{ description }}` w `soft.antlers.html` używał `2xl:text-lg text-md leading-normal font-normal` (400 weight) na Syne (font dziedziczony z body) — tekst wyglądał ciężki vs reszta strony. Zmiana na konwencję skalisty (`tailwind.css:364`): `2xl:text-lg lg:text-[15px] text-sm font-light font-lexend` — Lexend 300 weight + mniejszy bazowy rozmiar. Klasy już w `output.css` (font-light ×2, font-lexend ×14, text-sm ×48, text-[15px] ×1), brak rebuild. Walidacja: render `/oferta` → klasy zaaplikowane na 12 paragrafach kart. **Wykonane przez Claude bezpośrednio.**

---

## 2026-06-20 (sync — powrót na komputer główny po sesjach zastępczych)

### Wykonane

- **`git pull` `ab55105..fb693ed`** — 21 commitów z sesji zastępczych (FEATURE-embedded-video-cover-image + STYLE-mega-menu-ivena-tiles + CONTENT-sztuczna-rafa-koralowa + BUGFIX-embedded-video-mobile + drobiazgi width/playicon).
- **Lokalny śmieć** w `content/collections/services/pl/architectural-design.md` (testowy bełkot `uiytruirtiurtyijrtui` z CP) odrzucony — plik i tak usunięty na remote (zastąpiony przez `sztuczna-rafa-koralowa.md`).
- **Diagnoza pseudo-duplikatu** `/oferta/architectural-design` HTTP 200 — wyłącznie skażony stache lokalny po pullu. `php artisan statamic:stache:refresh` rozwiązał bez żadnej zmiany w plikach. Po refresh: `/oferta/sztuczna-rafa-koralowa` 200 (title "Dekoracje Akwarystyczne"), stary slug 404. Próbnie wykonany rename `sztuczna-rafa-koralowa.md` → `dekoracje-akwarystyczne.md` + nav update **wycofany** — slug `sztuczna-rafa-koralowa` jest świadomą decyzją użytkownika utrzymaną na serwerze.

### Decyzje techniczne

- **Reguła operacyjna**: po `git pull` z dużymi zmianami w `content/collections/` (rename/delete entries) zawsze `php artisan statamic:stache:refresh` PRZED jakąkolwiek diagnozą URL. Bez tego stache może podtrzymywać stare mapowania slug→entry i fałszywie sugerować duplikaty (ten sam wpis pod nowym i starym slug → oba HTTP 200).

### Uwagi

- Nawigacja PL `content/trees/navigation/pl/main.yaml:117` — link demo "Service Detail" `url: /oferta/architectural-design` jest martwy (404 lokalnie i na serwerze). Pozostawiony bez zmian — to demo Orion, do decyzji użytkownika (zaktualizować URL lub usunąć całą gałąź demo Pages > Services).
- Serwer `dev.skalisty.pl` zweryfikowany jako aktualny — `/oferta/sztuczna-rafa-koralowa` 200, brak duplikatu. Brak potrzeby deployu.

---

## 2026-06-20 (bugfix — embedded video: autoplay na mobile + szerokość na mobile)

### Naprawiono

- **`resources/views/page_builder/embedded_video_section.antlers.html`** i **`resources/views/service/show.antlers.html`**:
  - **Autoplay mobile**: `iframe :src="embedUrl"` → `:src="playing ? embedUrl : ''"` — iframe nie ładuje się dopóki użytkownik nie kliknie play; `x-show` samo w sobie nie wystarczało (iframe był załadowany i odtwarzał audio będąc tylko ukrytym).
  - **Szerokość mobile**: `w-[70%] max-sm:w-[95%]` → `w-full md:w-[70%]` — na mobile player wypełnia pełną szerokość kontenera (takie same marginesy jak tekst i obrazki), od `md` (768px) wraca do 70% z centrowaniem.

---

## 2026-06-20 (feat — embedded video: opcjonalna cover image z lokalnych assetów)

### Zmieniono / dodano

- **`resources/fieldsets/embedded_video_section.yaml`** — nowe pole `cover_image` (type: assets, max_files: 1) z instrukacją PL.
- **`resources/blueprints/collections/services/service.yaml`** — `cover_image` dodane do setu `video_section` w Bard.
- **`resources/views/page_builder/embedded_video_section.antlers.html`** — sygnatura `embeddedVideo(service, url, coverImage)`: `if (coverImage) this.thumbnail = coverImage;` jako guard przed logiką serwisu. YouTube i Vimeo thumbnail fetch wykonywany tylko gdy `!coverImage`.
- **`resources/views/service/show.antlers.html`** — analogiczna zmiana w bloku Bard `video_section`; `{{ cover_image }}{{ url }}{{ /cover_image }}` jako 3. argument (puste = falsy w JS).

### Wynik

Jeżeli w sekcji video zostanie wgrana lokalna okładka → zastępuje miniaturkę z YouTube/Vimeo. Brak okładki → zachowanie bez zmian (miniaturka z serwisu).

---

## 2026-06-20 (feat — mega menu: kafle usług z hover bg, layout ivena)

### Zmieniono

- **`resources/views/partials/header-{1,2,3,4}.antlers.html`** — lista kaflowa usług (6 max) przeprojektowana na styl ivena:
  - `<a>` jako `display: block` (nie flex) — wrapper z `rounded`, `bg-[#f5f5f5]`, `hover:bg-black/[0.08]`, `transition-colors` — efekt hover tła.
  - Flex layout przeniesiony do wewnętrznego `<div class="flex items-start gap-[15px] px-[25px] py-[18px]">` — uniezależniony od reguł `extra.css` (`navbar li a { flex items-center }`).
  - Ikona: `<span class="w-10 h-10 flex-shrink-0 [&>svg]:w-full [&>svg]:h-full">` + `{{ iconify:icon_svg }}` — wyrównana do góry ikona obok `<div>` z h4 + p.
  - `h4` z `leading-[1.3] group-hover/tile:text-primary-900 transition-colors`, `p` z `text-gray-400 font-light text-[14px]`.
  - Klasa `group/tile` na `<a>` obsługuje hover przez Tailwind `group-hover/tile:`.
- **`public/assets/css/extra.css`** — nowa reguła `.navbar li.w-full > a.group\/tile { display: block !important; padding: 0 !important; }` — override `flex items-center` i `p-0` z theme.
- **`public/assets/css/output.css`** — przebudowany przez `npm run build` (nowe arbitrary klasy Tailwind v4).

### Wynik

Kafle w mega menu mają efekt hover (szare tło → ciemniejsze) i layout 1:1 z motywem ivena: ikona 40×40 po lewej wyrównana do góry tytułu, tytuł + opis obok, padding i odstępy spójne z ivena. CSS konflikt z `extra.css` rozwiązany przez przeniesienie flex na wewnętrzny `<div>`.

---

## 2026-06-20 (content — nowy wpis usługi: sztuczna-rafa-koralowa)

### Dodano

- **`content/collections/services/pl/sztuczna-rafa-koralowa.md`** — nowy wpis usługi w języku polskim z sekcją video w Bard.

---

## 2026-06-20 (feat — mega menu: locale-aware button links)

### Zmieniono

- **`resources/blueprints/navigation/main.yaml`** — pole `button_link` (type: text) zastąpione polem `button_page` (type: entries, max_items: 1, collections: [pages]). Picker stron automatycznie resolwuje URL dla aktualnego locale.
- **`resources/views/partials/header-{1,2,3,4}.antlers.html`** — `href="{{ button_link }}"` → `href="{{ button_page }}{{ url }}{{ /button_page }}"` (8 miejsc w sumie).
- **`content/trees/navigation/pl/main.yaml`** — `button_link: /realizacje` → `button_page: 4fbd395d...`, `button_link: /services` → `button_page: 068133ec...`.
- **`content/trees/navigation/en/main.yaml`** — j.w. (te same origin ID, Statamic resolwuje EN URL automatycznie).

### Wynik

Przycisk w mega menu projekty i oferty prowadzi teraz do poprawnej wersji językowej strony bez ręcznego wpisywania URL per locale. Naprawiono też błąd w PL gdzie przycisk services wskazywał na `/services` zamiast `/oferta`.

---

## 2026-06-19 (bugfix — podwójny description w image_with_text_section)

### Naprawiono

- **`resources/views/page_builder/image_with_text_section.antlers.html`** — usunięto duplikat `{{ description }}` (linia 29, blok `<div class="container">` pod główną sekcją). Pole `description` było renderowane dwa razy: raz obok zdjęcia (linia 14, prawidłowo) i raz poniżej całej sekcji (błąd z oryginalnego szablonu Orion).

---

## 2026-06-20 (feat — sortowanie services po polu order)

### Dodano

- **`resources/blueprints/collections/services/service.yaml`** — pole `order` (type: integer) nad polem `icon`. Instrukcja: numer porządkowy 1–N, im niższy tym wyżej na liście.
- **`content/collections/services.yaml`** — `sort_field: order`, `sort_direction: asc`. Sortowanie rosnące po polu integer — analogicznie do projektów, ale bez computed field (sortowanie rosnące nie wymaga przekształcenia).

---

## 2026-06-19 (feat — Confidence Section: Button URL → entries picker)

### Zmieniono

- **`resources/fieldsets/confidence_section.yaml`** — pole `primary_button.url` (type: text) zastąpione polem `primary_button.page` (type: entries, max_items: 1). Picker stron — URL generowany automatycznie dla aktualnego locale.
- **`resources/views/page_builder/confidence_section.antlers.html`** — `href="{{ primary_button:url }}"` → `href="{{ primary_button:page }}{{ url }}{{ /primary_button:page }}"`.

### Decyzje techniczne

- `type: entries` przechowuje ID wpisu; Statamic augmentuje `{{ url }}` do locale aktualnie renderowanej strony — automatyczny fallback do PL jeśli brak lokalizacji docelowej strony.

---

## 2026-06-19 (sesja lokalna — content_title dla services + CSS fix + sync)

### Dodano

- **`resources/blueprints/collections/services/service.yaml`** — pole `content_title` (type: text, localizable: true) nad polem `content` (Bard). Instrukcja: pozostaw puste, aby ukryć.
- **`resources/views/service/show.antlers.html`** — blok `{{ if content_title }}<h2>{{ content_title }}</h2>{{ /if }}` przed pętlą Bard. Styl zgodny z `section_title` z page buildera (`1xl:mb-[50px] sm:mb-9 mb-6`). Brak tytułu = brak elementu HTML w ogóle.

---

## 2026-06-19 (sesja lokalna — CSS fix Bard paragraphs + blueprint + sync)

### Zmieniono

- **`resources/views/service/show.antlers.html`** — owinięto `{{ text }}` w `<div class="[&>p]:mb-4 [&>p:last-child]:mb-0">` w gałęzi `else` pętli Bard. Akapity pisane w Bard (podwójny Enter) mają teraz odstęp między sobą, identycznie jak w `project/show.antlers.html`. Klasy skompilowane przez `npm run build`.

### Decyzje techniczne

- Wzorzec `[&>p]:mb-4 [&>p:last-child]:mb-0` przeniesiony z `project/show.antlers.html` (linia 26) — spójny styl we wszystkich szablonach z Bard content.

---

## 2026-06-19 (sesja lokalna — synchronizacja + hotfix blueprint)

### Zmieniono

- **Synchronizacja lokalnego projektu z GitHub** — `git remote add origin https://github.com/5k18a/skalisty-laravel.git`, `git reset --hard origin/main` (57 commitów do przodu), `composer install`, `npm install`, `npm run build`. Projekt lokalny aktualny ze stanem 2026-06-20.
- **Usunięto nieaktualne kopie `.md`** z workspace root (`/home/pestycyd/Dokumenty/Skalisty-New-2/*.md`) — pliki przeniesione wcześniej do `skalisty-orion/` na głównym komputerze.

### Dodano

- **`resources/blueprints/collections/pages/page.yaml`** — nowe pole `image` (type: assets, container: assets, max_files: 1, display: Hero Image, localizable: true) umożliwiające przypisanie zdjęcia nagłówkowego do stron kolekcji `pages`. Pole jest opcjonalne — jeśli szablon go nie używa (np. `default`), jest ignorowane. Używa go template `service/show` w sekcji hero.

### Decyzje techniczne

- Pole `image` dodane do globalnego blueprinta `page`, a nie jako osobny blueprint ani hardkodowana grafika — zgodnie z zasadą prostoty obsługi CMS. Strony niebędące serwisami nie ucierpią (pole ignorowane przez inne szablony).

---

## 2026-06-20 (Deploy — FEATURE-services-route-pl-oferta)

_Deploy wykonany przez Claude._

### Zakres

- **Konfiguracja kolekcji + kontroler CP (2 pliki):**
  - `content/collections/services.yaml` — `route` (string) → mapa 12 locale (PL `/oferta/{slug}`, reszta `/service/{slug}`)
  - `app/Http/Controllers/CP/CollectionRoutesController.php` — `'services' => 'Usługi (Services)'` w `$managedCollections`
- **Widoki (8 plików):**
  - `resources/views/page_builder/service_section.antlers.html` (13 zamian `href="/service/{{slug}}"` → `href="{{ url }}"`)
  - `resources/views/partials/header-{1,2,3,4}.antlers.html` (po 1 zamianie)
  - `resources/views/partials/footer-1.antlers.html` (2 zamiany), `footer-4.antlers.html` (1), `search-results.antlers.html` (1)
- **Nawigacja PL:**
  - `content/trees/navigation/pl/main.yaml` — `/service/architectural-design` → `/oferta/architectural-design`
- Backup serwera: `~/skalisty_2026_backups/before-services-route-oferta-2026-06-20/` (248 KB).
- Post-deploy: `view:clear`, `cache:clear`, `statamic:stache:refresh`, `test` 2 passed ✅
- HTTP walidacja: `/oferta` 200, `/oferta/architectural-design` 200, `/service/architectural-design` (stara PL) 404, `/en/services` 200, `/en/service/architectural-design` 200, `/cp/collection-routes` 302→login ✅

### Stan serwera przed deployem

- `services.md` PL: już usunięty (przez użytkownika w CP), `oferta.md` istniał.
- `services.yaml`: stara wersja `route: '/service/{slug}'` (string).
- `CollectionRoutesController.php`: bez `services` w `$managedCollections`.

---

## 2026-06-20 (FEATURE-services-route-pl-oferta — trasa PL /oferta + integracja CP Trasy URL kolekcji)

_Wykonane przez Codex (brief BRIEF_CODEX.md), zaakceptowane przez Claude._

### Zmieniono

- **`content/collections/services.yaml`** — `route` ze stringa `'/service/{slug}'` na mapę 12 locale (PL `/oferta/{slug}`, EN+10 lokali `/service/{slug}`). Wzorzec analogiczny do Projects (PL `/realizacje/{slug}`).
- **`app/Http/Controllers/CP/CollectionRoutesController.php`** — `$managedCollections` rozszerzone o `'services' => 'Usługi (Services)'`. Reszta logiki kontrolera collection-agnostic, żadne inne zmiany niepotrzebne.
- **8 widoków, 21 hardcoded linków** `href="/service/{{ slug }}"` (różne warianty: `{{slug}}`, `{{ slug }}`, `./service/`) → `href="{{ url }}"`:
  - `resources/views/page_builder/service_section.antlers.html` × 13
  - `resources/views/partials/header-{1,2,3,4}.antlers.html` × 4
  - `resources/views/partials/footer-1.antlers.html` × 2, `footer-4.antlers.html` × 1, `search-results.antlers.html` × 1
- **Nawigacja PL** `content/trees/navigation/pl/main.yaml` — `/service/architectural-design` → `/oferta/architectural-design`. EN bez zmian (`/en/service/architectural-design`).

### Decyzje techniczne

- **`{{ url }}` zamiast hardcoded** — Statamic na pojedynczym entry generuje URL z `route` per locale automatycznie. Wszystkie 21 wystąpień są w pętli `{{ services }}` / `{{ collection:services }}` / `{{ service_entries }}` (poprawny kontekst entry). Wzorzec sprawdzony empirycznie na `{{ project_entries }}` w `header-1.antlers.html`.
- **Brief mówił o 23 wystąpieniach, Codex znalazł 21** — szacunek Claude był nieprecyzyjny, Codex precyzyjnie policzył (21) i zmienił wszystkie.
- **Brak kolizji `/oferta` (page entry) vs `/oferta/{slug}` (service entry)** — Statamic prawidłowo rozdziela trasy. Dokładnie ten sam wzorzec co `/realizacje` + `/realizacje/{slug}` u Projects.

### Zmieniono (przez użytkownika, poza scope Codexa)

- **`content/collections/pages/pl/services.md` → `oferta.md`** — rename strony kolekcji PL z `services` na `oferta` zrobiony przez użytkownika w CP. Świadoma decyzja, spójna z duchem zmiany: strona kolekcji = `/oferta`, pojedyncza usługa = `/oferta/{slug}`. EN bez zmian (`services.md`, `/en/services`).

### Walidacja

- `php artisan test` → 2 passed ✅
- HTTP lokalne (Codex): `/oferta/architectural-design` 200, `/oferta` 200, `/service/architectural-design` 404, `/en/service/architectural-design` 200, `/cp/collection-routes` 302→login
- CP > Tools > Trasy URL kolekcji — pokazuje teraz 2 pozycje: „Projekty (Projects)" + „Usługi (Services)"

### Uwagi

- Codex znalazł aktualnie 21 wystąpień zamiast szacowanych 23 (drobna korekta szacunku w briefie, bez wpływu na poprawność implementacji).
- Lokalny serwer dev na `127.0.0.1:8001` — stała odnotowana w `CLAUDE_MEMORY.md` z poprzedniej sesji.

---

## 2026-06-20 (Deploy — STYLE-bard-nested-sections-padding-half-v2 + CSS rebuild)

_Deploy wykonany przez Claude._

### Zakres

- `resources/views/service/show.antlers.html` (16 KB) — finalna wersja padding (klasa wrappera `2xl:py-[18px] 1xl:py-4 lg:py-3.5 sm:py-2.5 py-2` w 9 wystąpieniach pętli Bard).
- `public/assets/css/output.css` (286 KB) — rebuild Tailwind 4 z nowymi klasami (`py-[18px]`, `py-4`, `py-3.5`, `py-2.5`, `py-2`).
- Backup serwera: `~/skalisty_2026_backups/before-bard-padding-v2-2026-06-20/` (300 KB).
- Post-deploy: `view:clear`, `cache:clear`, `php84 artisan test` → 2 passed ✅
- HTTP `/` 200, `/en/` 200, klasa `py-[18px]` wykryta w live output.css ✅

---

## 2026-06-20 (STYLE-bard-nested-sections-padding-half-v2 — druga iteracja -50%)

_Wykonane przez Codex, zaakceptowane przez Claude._

### Zmieniono

- `resources/views/service/show.antlers.html` — wszystkie 9 wystąpień wrappera Bard zmienione z `container 2xl:py-[35px] 1xl:py-8 lg:py-7 sm:py-5 py-4` na `container 2xl:py-[18px] 1xl:py-4 lg:py-3.5 sm:py-2.5 py-2` (dokładnie połowa: 35→18, 32→16, 28→14, 20→10, 16→8 px).
- `public/assets/css/output.css` — rebuild po zmianach szablonu (`npm run build`).

### Decyzje techniczne

- 35/2 = 17.5px — zaokrąglone w górę do `[18px]` (arbitrary value). Pozostałe wartości to dokładne połówki Tailwind.
- Walidacja: 9/9 wystąpień; 0 starych; HTTP 200 PL+EN; `php artisan test` 2 passed.

---

## 2026-06-20 (STYLE-bard-nested-sections-padding-half — pierwsza iteracja -50%)

_Wykonane przez Codex, zaakceptowane przez Claude (zastąpione natychmiast iteracją v2)._

### Zmieniono

- `resources/views/service/show.antlers.html` — wszystkie 9 wystąpień wrappera Bard zmienione z `container 2xl:py-[70px] 1xl:py-16 lg:py-14 sm:py-10 py-8` na `container 2xl:py-[35px] 1xl:py-8 lg:py-7 sm:py-5 py-4` (dokładnie połowa oryginalnych wartości).
- `public/assets/css/output.css` — rebuild (`npm run build`).

### Uwagi

- Iteracja zaakceptowana technicznie, ale klient ocenił że odstępy nadal za duże — od razu zlecone v2 z kolejnym -50%.

---

## 2026-06-20 (Deploy — FAQ replicator + service icon color + content sync)

_Deploy wykonany przez Claude._

### Zakres

- **Blueprint + szablony (4 pliki):**
  - `resources/blueprints/collections/faqs/faq.yaml` — replicator `faq_items`
  - `resources/views/page_builder/faq_section.antlers.html` — pętla `faq_items` w gałęziach `select`/`list`
  - `resources/views/page_builder/service_section.antlers.html` — `text-black` na 5 spanach ikon (BUGFIX)
  - `resources/views/service/show.antlers.html` — pętla `faq_items` w Bard set `faq_section`
- **Content:**
  - `content/collections/pages/pl/home.md` — zaktualizowane referencje FAQ w sekcjach (id nowych paczek)
  - `content/collections/faqs/` (cała kolekcja, 12 nowych plików `jak-pracujemy-qa.md` + zaktualizowany `biotopy-...md` w 12 językach)
- Backup serwera: `~/skalisty_2026_backups/before-faq-replicator-2026-06-20/` (836 KB).
- Post-deploy: `view:clear`, `cache:clear`, `statamic:stache:refresh`, `test` 2 passed ✅
- HTTP `/` 200, `/en/` 200, 13 pozycji `faqs-list` na home PL, pierwsze pytanie z paczki widoczne ✅

### Pominięto celowo

- `content/collections/services/pl/architectural-design.md` — test content z poprzedniej sesji Codexa.

---

## 2026-06-20 (FEATURE-faqs-grouped-replicator — paczki tematyczne FAQ)

_Wykonane przez Codex (brief BRIEF_CODEX.md), zaakceptowane przez Claude._

### Zmieniono

- **Blueprint** `resources/blueprints/collections/faqs/faq.yaml`:
  - `title` (display: „Nazwa grupy FAQ", `localizable: true`) — semantycznie nazwa paczki tematycznej zamiast pytania
  - **usunięto** pole główne `answer`
  - **dodano** pole `faq_items` (Replicator, `localizable: true`) z setem `item`: `question` (text, required) + `answer` (textarea, required)
- **Szablon** `resources/views/page_builder/faq_section.antlers.html` — obie gałęzie (`select`/`list`):
  - `x-data="{selected: 1}"` przeniesione **wewnątrz** pętli `{{ faqs }}` / `{{ collection:faqs }}` (każda paczka = osobny akordeon)
  - `{{ title }}` w `<h5>` → `{{ question }}`
  - dynamiczny `x-ref="container{{ index }}"` + `$refs['container{{ index }}']` (bugfix pre-existing hardcoded `container1`)
- **Szablon** `resources/views/service/show.antlers.html` (linie 140-185) — analogiczne zmiany w Bard set `faq_section`.

### Analiza gotowych rozwiązań

- **Magic Translator kompatybilny** — patch HOTFIX-10+11 (`FieldDefinitionBuilder::normalizeSetConfig`) spłaszcza Statamic 6 set groups; `FieldClassifier::classifyNested` klasyfikuje `question` + `answer` jako Tier 1 mimo braku `localizable: true` na zagnieżdżonych polach; `ContentExtractor::extractReplicator` wyciąga `type: item` bloki. Bez dodatkowych zmian w blueprincie paczki FAQ będą tłumaczalne PL → EN/inne.

### Decyzje techniczne

- **Replicator zamiast nowej kolekcji** — minimalna ingerencja (1 blueprint + 3 szablony), zero zmian w blueprintach sekcji (`service.yaml` faq_section).
- **Migracja content** — stare pojedyncze wpisy zostają na dysku ale tracą edytowalność `answer` w CP; użytkownik ręcznie założył nowe paczki w CP (potwierdzone podczas sesji).

### Walidacja

- HTTP 200 PL+EN, `php artisan test` 2 passed, akordeon FAQ działa per-paczka z osobnym stanem Alpine.

---

## 2026-06-20 (BUGFIX-service-icon-color — ikony Iconify w sekcjach usług na czarno)

_Wykonane przez Codex (brief BRIEF_CODEX.md), zaakceptowane przez Claude._

### Naprawiono

- `resources/views/page_builder/service_section.antlers.html` — 5 wystąpień `<span>` opakowujących ikony Iconify zmienione z klasy `text-primary-900` na `text-black` (linie 24, 152, 194, 230, 354):
  - home-page-one (akordeon, linia 24)
  - home-page-three (karty grid, linia 152)
  - home-page-four (karty grid, linia 194)
  - service-page-one (akordeon, linia 230)
  - service-page-three (karty grid, linia 354)

### Decyzje techniczne

- Mechanizm koloru: Iconify SVG używa `currentColor`, klasa Tailwind `text-*` na `<span>` ustawia CSS `color`, SVG dziedziczy.
- Elementy `<h4>` z Alpine `:class` toggling (`text-primary-900` ↔ `text-black`) i `group-hover/service:text-primary-900` — **nie tknięte**, kolor tytułu nadal zmienia się przy rozwinięciu akordeonu.
- `npm run build` — nie był potrzebny (obie klasy już w `output.css`).

---

## 2026-06-20 (Deploy — services Iconify + Bard content)

_Deploy wykonany przez Claude._

### Zakres

- Wdrożono na `dev.skalisty.pl` zmiany z zadań `FEATURE-services-icon-iconify`, `FEATURE-service-bard-sets-render` oraz `refactor: uproszczenie sekcji Bard`:
  - `resources/blueprints/collections/services/service.yaml`
  - `resources/views/page_builder/service_section.antlers.html`
  - `resources/views/service/show.antlers.html`
  - `public/assets/css/output.css`
  - `content/collections/services/pl/architectural-design.md`
- Post-deploy: `view:clear`, `cache:clear`, `statamic:stache:refresh`, `php83 artisan test` → 2 passed ✅

---

## 2026-06-19/20 (FEATURE-service-bard-sets-render — renderowanie setów Bard w szablonie serwisu)

_Wykonane przez Codex (brief BRIEF_CODEX.md), zaakceptowane przez Claude._

### Zakres

- **Pętla Bard w `service/show.antlers.html`** — prosty tag `{{ content }}` zastąpiony pętlą `{{ content }}...{{ /content }}` z 8 gałęziami `if/elseif` obsługującymi sety:
  - `quote_section` — cytat z autorem (blockquote z SVG cudzysłowem)
  - `list_section` — lista z replicatora (ul.custom-list)
  - `image_section` — siatka 2 kolumn z lightboxem (js-gallery)
  - `dynamic_table` — dynamiczna tabela HTML z `table_head` (grid) i `table_body` (grid)
  - `gallery_section`, `skalisty_gallery_section`, `instagram_gallery_section`, `faq_section` — reuse partialu `{{ partial src="page_builder/..." }}`
  - `{{ else }}` — węzły tekstowe Barda przez `{{ text }}`
- Plik: `resources/views/service/show.antlers.html`
- `npm run build` wykonany (klasa `even:bg-gray-50` nie była w `output.css` przed buildem).
- `php artisan test` → 2 passed; `GET /` 200, `GET /en/` 200.
- Odchylenie od briefu: brak (implementacja 1:1 z briefem).

---

## 2026-06-19 (FEATURE-services-icon-iconify — Iconify + fallback assets dla ikon serwisów)

_Wykonane przez Codex (brief BRIEF_CODEX.md), zaakceptowane przez Claude._

### Zakres

- **Opcja B** — zamiast wymiany pola `icon` (assets → iconify) dodano drugie pole:
  - `icon` — zostaje `type: assets` (istniejące PNG ikon)
  - `icon_svg` — nowe `type: iconify, store_as: svg_data` (nowe ikony SVG)
- **5 podmian** w `service_section.antlers.html` — każda ikona używa teraz `{{ if icon_svg }}{{ iconify:icon_svg class="w-full h-full" aria-hidden="true" }}{{ else }}{{ icon }}<img src="{{ url }}" ... />{{ /icon }}{{ /if }}` wewnątrz wrappera `<span class="... block [&>svg]:w-full [&>svg]:h-full text-primary-900">`.
- Plik: `resources/blueprints/collections/services/service.yaml` (dodane pole `icon_svg`)
- Plik: `resources/views/page_builder/service_section.antlers.html` (5 podmian ikon)
- `php artisan test` → 2 passed; `GET /` 200, `GET /en/` 200.
- Wdrożono na serwer (`dev.skalisty.pl`) osobnym rsync po audycie.

---

## 2026-06-19 (BUGFIX-icon-box-center-icon — wyśrodkowanie ikony w Icon Box With Text Section)

_Wykonane przez Claude bezpośrednio (na polecenie użytkownika)._

### Naprawiono

- **Wyśrodkowanie ikony w `Icon Box With Text Section`** — kontener ikony (`h-[38px] w-[38px]`) otrzymał klasę `mx-auto`; ikona wyśrodkowana poziomo w każdej karcie, tytuł i opis nadal wyrównane do lewej.
- Plik: `resources/views/page_builder/icon_box_with_text_section.antlers.html` linia 11.
- `mx-auto` była już obecna w `output.css` — `npm run build` zbędny.
- Wdrożono na `dev.skalisty.pl` (rsync przyrostowy, 748 KB / 492 MB, speedup 652×); post-deploy: `view:clear`, `cache:clear`, `stache:refresh`, `php84 artisan test` → 2 passed ✅.

---

## 2026-06-18 (BUGFIX-blog-image-section — image_section w Bard bloga)

_Wykonane przez Claude bezpośrednio (na polecenie użytkownika)._

### Zakres

- **Fix `{{ image }}` → `{{ images }}`** w bloku `image_section` w 4 szablonach Orion:
  `blog-detail-one/two/three/four.antlers.html`
  Przyczyna: Antlers kaskadował do zewnętrznego scope i pobierał `image` (featured image wpisu)
  zamiast `images` (tablica z Barda) — efekt: CP pokazywał 2 zdjęcia, frontend 1 inne.
- **Fix lightboxa image_section**: klik na obrazek otwierał `/blog/{slug}` (przeładowanie) zamiast lightboxa.
  Zmiana: `href="/blog/{{ slug }}"` → `href="javascript:;"` + klasa `js-gallery` na gridzie.
- **Nowy partial** `resources/views/partials/gallery-lightbox.antlers.html` — HTML lightboxa
  wyciągnięty do wielokrotnego użytku; dołączony do 4 szablonów bloga przez `{{ partial:gallery-lightbox }}`.
- Deploy na `dev.skalisty.pl` ✅

### Uwaga przy aktualizacji motywu Orion

Motyw Orion **nie jest paczką Composer** — pliki zostały ręcznie skopiowane do projektu
przy instalacji. `composer update` NIE nadpisuje tych plików.

Ryzyko utraty fixów istnieje wyłącznie przy **ręcznej aktualizacji motywu** (ponowne
skopiowanie plików Oriona do projektu). W takim przypadku należy sprawdzić i odtworzyć:

| Plik | Co sprawdzić |
|------|-------------|
| `resources/views/blog-detail-one.antlers.html` | `{{ images }}` / `{{ /images }}` (nie `image`), klasa `js-gallery` na gridzie, `href="javascript:;"` na linkach, `{{ partial:gallery-lightbox }}` na końcu pliku |
| `resources/views/blog-detail-two.antlers.html` | j.w. |
| `resources/views/blog-detail-three.antlers.html` | j.w. |
| `resources/views/blog-detail-four.antlers.html` | j.w. |
| `resources/views/partials/gallery-lightbox.antlers.html` | nowy plik — nie istnieje w Orionie, nie zostanie nadpisany |

---

## 2026-06-18 (FEATURE-back-now-i18n — tłumaczenie napisu BACK NOW w lightboxie)

_Wykonane przez Claude bezpośrednio (na polecenie użytkownika)._

### Zakres

- Napis `BACK NOW` w lightboxie zastąpiony `{{ trans key="Back Now" }}` w 4 plikach:
  - `resources/views/partials/gallery-lightbox.antlers.html`
  - `resources/views/page_builder/skalisty_gallery_section.antlers.html`
  - `resources/views/page_builder/gallery_section.antlers.html` (2 wystąpienia)
- `lang/en.json` — dodany klucz `"Back Now": "Back Now"`
- `lang/pl.json` — dodany klucz `"Back Now": "Wróć"`
- 10 pozostałych locales (cs, da, de, es, fr, it, lv, nl, no, sv) — przetłumaczone przez DeepL via `php artisan lang:translate --force`
- Deploy na `dev.skalisty.pl` ✅

---

## 2026-06-18 (BUGFIX-logo-proportions — proporcje logo w headerze)

_Wykonane przez Claude bezpośrednio (na polecenie użytkownika)._

### Zakres

- **Diagnoza**: `<img>` w `header-1` i `header-4` miał `h-* max-w-full w-auto`. Podczas zwężania okna lub sticky transition `max-w-full` ograniczał szerokość, ale stała wysokość `h-*` nie ustępowała → spłaszczenie.
- **Fix**: zmiana klas `<img>` w `header-1.antlers.html` i `header-4.antlers.html`:
  `h-9 xl:h-13 2xl:h-14 max-w-full w-auto` → `max-h-9 xl:max-h-13 2xl:max-h-14 h-auto w-auto max-w-full`
  Przy obu ograniczeniach jednocześnie (`max-h-*` + `max-w-full`) CSS skaluje oba wymiary proporcjonalnie.
- **Rebuild CSS** (`npm run build`): klasy `max-h-9/13/14` nie istniały w `output.css` — bez rebuildu fix nie działał.
- Deploy na `dev.skalisty.pl` ✅

### Uwaga przy aktualizacji motywu Orion

| Plik | Co sprawdzić |
|------|-------------|
| `resources/views/partials/header-1.antlers.html` | `<img>` ma `max-h-9 xl:max-h-13 2xl:max-h-14 h-auto w-auto max-w-full` (nie `h-*`) |
| `resources/views/partials/header-4.antlers.html` | j.w. |

---

## 2026-06-19 (SYNC-orientarium — synchronizacja nowego projektu z serwera)

_Wykonane przez Claude (pull z dev.skalisty.pl)._

### Zakres

- Nowy projekt `projekt-tematyzacji-orientarium` zsynchronizowany z serwera (PL + 11 locale)
- Galeria `orientarium-projekt-tematyzacyjny`: 4 webp + metadane
- Lokalny stache odświeżony

---

## 2026-06-19 (FEATURE-blueprint-details-defaults — domyślne Info Items w blueprincie projects)

_Wykonane przez Claude bezpośrednio (na polecenie użytkownika)._

### Zakres

- `resources/blueprints/collections/projects/project.yaml` — dodany klucz `default:` do pola `details` (replicator)
- 4 Info Items pre-wypełnione przy tworzeniu nowego wpisu: **Lokalizacja**, **Powierzchnia Dekoracji** (value: `0,00 m²`), **Inwestor**, **Data Zakończenia**
- Deploy na `dev.skalisty.pl`: celowany rsync jednego pliku + `statamic:stache:refresh` ✅

---

## 2026-06-19 (UPDATE-statamic-6.21.0 — aktualizacja i deploy)

_Wykonane przez Claude bezpośrednio (na polecenie użytkownika)._

### Zakres

- `statamic/cms` zaktualizowany lokalnie: v6.20.3 → v6.21.0
- Patch HOTFIX-18 (`proc_open + open_basedir` w `Locales.php`) nałożony bez konfliktów
- Deploy na `dev.skalisty.pl` — rsync z `--copy-links` (symlink vendor/skalisty)
- Serwer: `php84 artisan test` → 2 passed, `statamic/cms v6.21.0` potwierdzone

---

## 2026-06-19 (UPDATE-statamic-6.20.3-deploy — weryfikacja aktualizacji Statamic)

_Wykonane przez Codex + audyt Claude._

### Zakres

- Weryfikacja lokalna i na serwerze: `statamic/cms v6.20.3` potwierdzone w obu środowiskach
- `CLAUDE_MEMORY.md` zaktualizowany: `Laravel 13.16.1 + Statamic 6.20.3 + PHP 8.4`
- Rsync pominięty — serwer otrzymał v6.20.3 przy deployu z 2026-06-19 (`SYNC-and-deploy-completion-year`)
- Patch HOTFIX-18 (`proc_open + open_basedir`) potwierdzony na v6.20.3

---

## 2026-06-19 (SYNC-and-deploy-completion-year — synchronizacja i deploy sortowania)

_Wykonane przez Claude bezpośrednio (na polecenie użytkownika)._

### Zakres

- **Pull content → lokalnie:** 2 nowe projekty PL (Djurs Sommerland 2021, Osada Jaworzyny 2020) + aktualizacja nawigacji PL (mega menu z projektami)
- **Push kodu → serwer:** wdrożono `FEATURE-completion-year-sort` na `dev.skalisty.pl`
- **Pull completion_year → lokalnie:** zsynchronizowano wartości dat sortowania uzupełnionych przez użytkownika w CP online

### Nowe projekty w kolekcji

- `djurs-sommerland` (PL + 11 locale) — completion_year: 2021
- `osada-jaworzyny-spa` (PL + 11 locale) — completion_year: 2020

### Deploy na serwer

- rsync bez `--delete`, wykluczenie `.env`/`.git`/`node_modules`
- post-deploy: `config:clear`, `cache:clear`, `view:clear`, `stache:refresh`
- `php84 artisan test` → 2 passed ✅
- `https://dev.skalisty.pl/realizacje` → HTTP 200, projekty posortowane malejąco po roku

### Korekty dat po weryfikacji użytkownika

Tarnowskie Termy: 2024 → **2015** (korekta przez użytkownika w CP)

### Git

- 3 commity: `3705b38`, `2e1beeb`, `0bfa98f`

---

## 2026-06-19 (FEATURE-completion-year-sort — sortowanie projektów po roku zakończenia)

_Wykonane przez Codex. Audyt i akceptacja: Claude._

### Cel

Projekty na `/realizacje` wyświetlają się od najnowszych do najstarszych zamiast alfabetycznie.

### Rozwiązanie

Nowe pole `completion_year` (integer) w sidebar blueprinta kolekcji `projects` — wyłącznie do celów sortowania, niewidoczne na froncie. Computed field `completion_year_sort` w `AppServiceProvider` obsługuje wartości NULL (projekty bez roku → 0), co zapobiega SQL-owemu zachowaniu NULL-first przy `ORDER BY DESC`.

### Zmienione pliki

- **`resources/blueprints/collections/projects/project.yaml`** — nowe pole `completion_year` (integer, sidebar, `localizable: false`)
- **`content/collections/projects.yaml`** — `sort_field: completion_year_sort`, `sort_direction: desc`
- **`resources/views/page_builder/project_section.antlers.html`** — `sort="completion_year_sort:desc"` w 3 tagach `collection:projects` (linie 192, 241, 305)
- **`app/Providers/AppServiceProvider.php`** — `StatamicCollection::computed('projects', 'completion_year_sort', fn($e) => (int)($e->value('completion_year') ?: 0))`
- **10 plików `content/collections/projects/pl/*.md`** — uzupełniono `completion_year` (2014–2024)

### Kolejność na /realizacje

Tarnowskie Termy (2024) → Grota z Lourdes (2022) → Ogród w Alpach (2021) → 4× 2019 → Woliera Argusa (2018) → Oceanika (2015) → Afrykarium (2014)

---

## 2026-06-18 (BUGFIX-slider-seamless-loop — bezszwowe zapętlenie sliderów logo)

_Wykonane przez Claude (bezpośrednio, bez Codexa — zmiana czysto szablonowa)._

### Problem

Animacja CSS `slides` (`translateX(0 → -50%)`) wymaga dwóch identycznych zestawów elementów w `slider-track`. Przy jednym zestawie po dotarciu do końca animacja skacze widocznie z powrotem na początek. Dotyczyło trzech sliderów.

### Rozwiązanie

Podwójny render pętli `{{ logos }}` / `{{ text_slider }}` w jednym `slider-track`. Drugi zestaw dostaje `aria-hidden="true"` — niewidoczny dla czytników ekranu.

- **`resources/views/page_builder/trusted_partners_section.antlers.html`** — duplikacja `{{ logos }}`
- **`resources/views/page_builder/logos_slider_with_icons.antlers.html`** — duplikacja `{{ logos }}`
- **`resources/views/page_builder/text_slider_section.antlers.html`** — duplikacja `{{ text_slider }}`

### Deploy

- 3 widoki + `content/collections/pages/pl/home.md` + `public/assets/logo-klienci/` (2 brakujące pliki: logo-tallinn-zoo, logo-zoo-chorzow)
- `view:clear`, `cache:clear`, `stache:refresh` — OK
- `dev.skalisty.pl` — HTTP 200 ✅

---

## 2026-06-18 (DEPLOY-sesja-2 — pełna synchronizacja local → dev.skalisty.pl)

_Wykonane przez Claude._

### Wdrożone na dev.skalisty.pl

**Content i assets:**
- `content/` — home.md PL + cs/da/en/es + `globals/pl/theme_settings.yaml`
- `public/assets/logo-klienci/` — 10 plików: logo-aquaserwis, logo-baseny-tropikalne, logo-hodonin-zoo, logo-lykke-hotel, logo-mosty-lodz, logo-varco, logo-zoo-warszawa, logo-tallinn-zoo, logo-zoo-chorzow, ogo-zoo-wroclaw + logo_akvaria-ras.svg + .meta/

**Kod:**
- `resources/views/layout.antlers.html` — sticky header fix
- `public/assets/js/custom.js` — sticky header fix
- `resources/fieldsets/logos_slider_with_icons.yaml` — nowy set
- `resources/views/page_builder/logos_slider_with_icons.antlers.html` — nowy widok
- `resources/fieldsets/all_page_builder.yaml` — rejestracja nowego setu
- `resources/views/` (pozostałe), `resources/fieldsets/`, `resources/blueprints/`
- `app/`, `bootstrap/app.php`, `config/`
- `addons/skalisty/wysiwyg-html-fieldtype/` (v1.1.0)
- `public/assets/css/`, `lang/`

**Pakiety:**
- `composer.json`, `composer.lock`, `patches.lock.json`, `patches/`
- `vendor/statamic/cms/` — zaktualizowany do v6.20.3
- `vendor/composer/` — zaktualizowane installed.json + autoload maps

**Wynik weryfikacji:**
- `statamic/cms`: v6.20.3 ✅
- `skalisty/wysiwyg-html-fieldtype`: 1.1.0 ✅
- `eminos/statamic-iconify`: v2.1.0 ✅
- HTTP: `/` 200, `/en/` 301→200, `/cp/login` 302 ✅
- `package:discover`, `config:clear`, `cache:clear`, `view:clear`, `stache:refresh` — OK ✅

---

## 2026-06-18 (BUGFIX-sticky-header-default — header zawsze sticky)

_Zaimplementowane przez Codex; zaudytowane przez Claude._

### Problem

Header statyczny gdy `show_theme_switcher = false` — JS czytał `stickyMode` z przycisku `.headers.active` który nie istniał w DOM gdy switcher ukryty. Globalna wartość `header_type: sticky` z Statamic była ignorowana.

### Rozwiązanie

- **`resources/views/layout.antlers.html`** — `<body data-header-type="{{ theme_settings:header_type }}">` — wartość server-side zawsze dostępna dla JS
- **`public/assets/js/custom.js`** — blok sticky przepisany:
  - `switcherVisible` — sprawdza obecność przycisków w DOM
  - `serverHeaderType` — czyta `data-header-type` z `<body>`
  - gdy switcher ukryty: `localStorage.removeItem("headerType")` + `stickyMode` z serwera
  - gdy switcher widoczny: localStorage jak dotychczas

### Walidacja

- `node --check public/assets/js/custom.js` — OK
- `curl http://127.0.0.1:8001/` — `<body data-header-type="sticky">` w HTML ✅
- `php artisan test` — 2 passed ✅
- Codex nie commitował — reguła 22.2 zadziałała

---

## 2026-06-18 (AGENTS-role-clarification — główna rola Claude: audyt + architekt)

_Wykonane przez Claude._

### Doprecyzowanie roli Claude w projekcie

Na podstawie instrukcji użytkownika zaktualizowano `AGENTS.md`:

- **Nagłówek/cel**: Claude opisany jako „dogłębny audyt wykonywanych prac + architekt systemu" — nie jako wykonawca
- **4-punktowa lista priorytetów**: 1. Dogłębny audyt prac Codexa, 2. Architektura systemu, 3. Briefy dla Codexa, 4. Dokumentacja
- **Sekcja 7.1 nagłówek**: „Główna rola: dogłębny audyt prac Codexa oraz architekt systemu"
- **Sekcja 7.1 ciało**: dodano „Dotyczy to każdej zmiany w plikach PHP, Antlers, YAML, JS, CSS — niezależnie od tego jak mała jest zmiana. Każda taka zmiana = brief dla Codexa."
- **Sekcja 10.1**: dodano „Wielkość zmiany nie ma znaczenia — nawet jednoliniowa poprawka idzie przez brief dla Codexa."
- **Sekcja 22.2**: całkowicie przepisana — „Commity tworzy wyłącznie Claude. Codex NIE commituje ani NIE pushuje. Wyjątek: wyraźne polecenie użytkownika." (po tym jak Codex samodzielnie scommitował `FEATURE-logos-slider-with-icons`)

### Kontekst

Użytkownik zauważył, że Claude (1) edytował pliki Antlers bezpośrednio zamiast pisać brief dla Codexa, (2) Codex commitował własną pracę mimo braku takiej reguły w dokumentacji. Obie luki zostały zamknięte przez aktualizację `AGENTS.md`.

---

## 2026-06-18 (FEATURE-logos-slider-with-icons — nowy set Page Buildera)

_Zaimplementowane przez Codex; zaudytowane przez Claude._

### Dodano

- **Nowy set Page Buildera `Logos Slider with Icons`** — wariant `logos_slider` używający ikon Iconify zamiast assetów:
  - `resources/fieldsets/logos_slider_with_icons.yaml` — fieldset z `icon` (type: iconify, store_as: svg_data, brak required) i `name` (text, required)
  - `resources/views/page_builder/logos_slider_with_icons.antlers.html` — identyczna animacja CSS co oryginał; render ikony przez `{{ iconify:icon class="logos fill-current" aria-hidden="true" }}`; wrapper z `text-white` (kolor SVG przez `fill-current + currentColor`)
  - `resources/fieldsets/all_page_builder.yaml` — rejestracja setu bezpośrednio po bloku `logos_slider`

### Decyzje techniczne

- `fill-current` na SVG + `text-white` na wrapperze — SVG inline z Iconify używa `fill="currentColor"` (atrybut nakładany przez addon); `fill-current` Tailwind mapuje `fill` na CSS `color`; `text-white` ustawia `color: #fff` — efekt: ikona biała jak otaczający tekst `.logo-name`
- `store_as: svg_data` — SVG przechowywany inline w YAML, brak runtime API calls na frontendzie
- Brak `required` na polu `icon` — ikona opcjonalna, żeby nie blokować zapisu formularza w CP gdy użytkownik chce dodać tylko tekst

### Uwagi

- Codex commitował samodzielnie (commit 878b0e0 `feat: Dodaj Logos Slider with Icons`) — naruszenie workflow; dodano regułę do AGENTS.md sekcja 22.2
- Claude edytował plik Antlers bezpośrednio (color fix `text-white + fill-current`) zamiast briefa dla Codexa — naruszenie roli; regułę dokręcono w AGENTS.md sekcje 7.1 i 10.1

---

## 2026-06-18 (UPDATE-packages — aktualizacja Statamic + addonów)

_Wykonane przez Claude._

### Zaktualizowano

- **`statamic/cms`** `6.20.2` → `6.20.3` (patch, semver-safe; patch HOTFIX-18 przetrwał)
- **`edalzell/magic-translator`** → `0.1.3` (wszystkie 5 patchy na magic-translator przetrwały bez zmian)
- **`skalisty/wysiwyg-html-fieldtype`** constraint `^0.1.0` → `^1.1.0` w `composer.json` (addon lokalny w `addons/`; bump constrainta wymagany żeby `composer update` zaakceptował wersję 1.1.0)
- **`eminos/statamic-iconify`** — bez zmian (v2.1.0 była aktualna)

### Strategia aktualizacji

- Przed aktualizacją sprawdzono `composer outdated --direct` — zidentyfikowano pakiety z patachami
- Pakiety z patachami (statamic/cms, magic-translator) aktualizowane osobno z weryfikacją patchy po każdej aktualizacji
- `composer patches-relock && composer patches-repatch` — wymagane przy każdej aktualizacji patcha vendor
- `php artisan test` — 2 passed po aktualizacjach

### Nie zaktualizowano

- `statamic/cms` nie podniesiono do v6.21.x — ocena jako potencjalnie pre-release/niestabilna; pozostało na v6.20.3 (minor bump = bezpieczniej)

---

## 2026-06-18 (CLEANUP-workspace-root — porządek w katalogu workspace)

_Wykonane przez Claude._

### Usunięto

- **12 duplikatów plików `.md`** z katalogu workspace root (`/Skalisty-New-2/`) — były to stare kopie dokumentów agentów (AGENTS.md, BRIEF_CODEX.md, CHANGE-LOG.md itd.), które pozostały po przeniesieniu projektu do `skalisty-orion/`; konflikty między workspace root a `skalisty-orion/` mogły prowadzić do pomyłek przy pracy agentów

### Zachowano (backup)

- **`backup-wysywig-html-addon/`** — nowy katalog w workspace root zawierający snapshoty addonu: v1.0 i v1.1 (`wysiwyg-html-fieldtype-v1.0/`, `wysiwyg-html-fieldtype-v1.1/`) przed usunięciem oryginałów z workspace root; backup nie jest w Git (poza repozytorium)

### Zaktualizowano

- `AGENTS.md` sekcja 5: zaznaczono że workspace root nie zawiera już żadnych plików `.md` agentów

---

## 2026-06-18 (AUDIT-addon-wysiwyg-github)

_Wykonane przez Claude._

### Audyt i dopracowanie repo addonu wysiwyg-html-fieldtype

Repo: `https://github.com/5k18a/laravel-statamic-addon-wysywig-html-page-editor`

**Naprawione braki:**
- `composer.json`: wersja `0.1.0` → `1.1.0`, dodano `description`, `authors`, `license: MIT`, `keywords` (Packagist-ready)
- Dodano `LICENSE` (MIT)
- `README.md`: zaktualizowano sekcję "Known Follow-Ups" (usunięto już zamknięte punkty)
- Opis repo na GitHub zmieniony z polskiego nieformalnego na angielski profesjonalny
- Dodano 8 topics GitHub: statamic, statamic-addon, statamic-fieldtype, laravel, php, wysiwyg, tiptap, codemirror

**Zsynchronizowano lokalny addon z GitHub:**
- Skopiowano `docs/` (PROJECT_CONTEXT.md, INTEGRATION_EXAMPLES.md, history/v1.0/)
- Skopiowano `examples/` (fieldsets + widoki Antlers dla integracji)
- Localny `README.md` zastąpiony pełną wersją (nie boilerplate)

**Znane pozostałe zadania dla Codexa (nie blokujące):**
- Usunąć `\Log::warning/debug/error` z `WysiwygHtml::preload()` przed publicznym release
- Dodać realne testy PHP dla augment/process/preProcess

---

## 2026-06-18 (SETUP-git-workflow)

_Wykonane przez Claude._

### Inicjalizacja repozytorium Git i workflow

- Repozytorium Git zainicjowane w `skalisty-orion/` (poprzednio było w workspace root).
- Remote GitHub dodany: `https://github.com/5k18a/skalisty-laravel.git`
- Wypchnięto pełny stan projektu na GitHub (branch `main`).
- `AGENTS.md` zaktualizowany:
  - Sekcja 5: `skalisty-orion/` jako kanoniczne miejsce plików roboczych agentów.
  - Sekcja 22: pełny workflow Git (commit po każdym zadaniu, push na koniec sesji, format wiadomości, zasady bezpieczeństwa).
- `.gitignore` rozszerzony o: `/server_deploy/SERWER_DOSTEP.txt`, `/addons/skalisty/wysiwyg-html-fieldtype/node_modules/`, `/public/vendor/statamic/`.

### Synchronizacja z serwerem dev (2026-06-18)

- Zsynchronizowano z `dev.skalisty.pl` przez rsync:
  - Nowe wpisy kolekcji projektów
  - Zaktualizowany blueprint `resources/blueprints/collections/projects/project.yaml`
  - Nowe assets

### Audyt zadań Codex 2026-06-17

- Sprawdzono i zaakceptowano: `icon_box_with_text_section`, rozszerzenie prefixów Iconify, tłumaczenie MT, deploy.
- Naprawiono błędy UTF-8 w wpisach CHANGE-LOG.md (polskie znaki).
- Zaktualizowano `CODEX_SUGGESTIONS.md` — wyczyszczono przestarzałe pozycje, zaakceptowano `DEPLOY-iconify-icon-box-dev`.
- Zsynchronizowano `PROJECT_STATUS_CODEX.md`, `BRIEF_CODEX.md`, `CLAUDE_MEMORY.md` (state_version: 2026-06-18-1200).

---

## 2026-06-17 (DEPLOY-iconify-icon-box-dev)

_Wpis sporządzony przez Codex; zaudytowany i zaakceptowany przez Claude 2026-06-18._

### Wdrożono na `dev.skalisty.pl`

- Addon `eminos/statamic-iconify` v2.1.0 wraz z vendorem, configiem i assetami CP.
- Konfiguracja `config/statamic-iconify.php` z `default_store_as: svg_data`.
- Rozszerzone prefixy Iconify: `map`, `temaki`, `maki`, `game-icons`, `bx`, `bxs`, `bxl` plus dotychczasowe prefixy.
- Nowy set Page Buildera `Icon Box With Text Section`.
- Rejestracja setu w `resources/fieldsets/all_page_builder.yaml`.
- Widok frontendowy `resources/views/page_builder/icon_box_with_text_section.antlers.html`.
- Bieżący content lokalny, w tym Home PL z nowym blokiem.

### Cleanup remote

- Przed kasowaniem starych kontenerów ikon wykonano backup na serwerze:
  - `/home/klient.dhosting.pl/skalisty/skalisty_2026-icons-containers-before-delete-2026-06-17.tar.gz`
- Usunięto z serwera stare, lokalnie już wycofane kontenery:
  - `public/assets/icons/`
  - `public/assets/icons2/`
  - `content/assets/icons.yaml`
  - `content/assets/icons2.yaml`

### Deployment

- Deployment wykonany przez `rsync` bez `--delete`.
- Skrypt SSH użyty przez Codex:
  - `/home/pestycyd/Insync/biuro@skalisty.pl/OneDrive/Linux/bin/skalisty-ssh`
  - uruchamiany przez `bash`
- `rsync`:
  - 26 262 pliki w porównaniu
  - 123 utworzone pliki
  - 0 usuniętych przez rsync
  - 1 575 transferowanych plików regularnych
  - 24 789 996 bytes jako rozmiar transferowanych różnic
  - speedup 414.42

### Walidacja po deployu

- `php84 artisan package:discover --ansi` — OK
- `php84 artisan optimize:clear` — OK
- `php84 artisan config:clear` — OK
- `php84 artisan cache:clear` — OK
- `php84 artisan view:clear` — OK
- `php84 artisan statamic:stache:refresh` — OK
- `php84 artisan test` — OK (`2 passed`)
- Remote Iconify:
  - `vendor/eminos/statamic-iconify` istnieje
  - `config/statamic-iconify.php` istnieje
  - `public/vendor/statamic-iconify` istnieje
  - `default_store_as = svg_data`
  - prefixy `map` i `mdi` aktywne
- HTTP:
  - `/` — 200
  - `/en/` — 301 do `/en`, po redirect 200
  - `/cp/login` — 302
- HTML strony głównej zawiera nową sekcję oraz box `Konsulting i Planowanie`.

### Uwaga

- Home EN nadal wymaga osobnego tłumaczenia/synchronizacji z PL, jeżeli ma otrzymać nowy blok `Icon Box With Text Section`.

---

## 2026-06-17 (FEATURE-icon-box-with-text + Iconify prefix extension)

_Wpis sporządzony przez Codex; zaudytowany i zaakceptowany przez Claude 2026-06-18._

### Dodano

- **Nowa sekcja Page Buildera `Icon Box With Text Section`**:
  - fieldset: `skalisty-orion/resources/fieldsets/icon_box_with_text_section.yaml`
  - widok: `skalisty-orion/resources/views/page_builder/icon_box_with_text_section.antlers.html`
  - rejestracja w `skalisty-orion/resources/fieldsets/all_page_builder.yaml`
- **Wybór layoutu sekcji**:
  - `three_columns` — 3 boxy w wierszu na desktopie
  - `four_columns` — 4 boxy w wierszu na desktopie
  - pole `layout` jest na poziomie sekcji i znajduje się nad listą itemów.
- **Ikony z Iconify w itemach**:
  - fieldtype `iconify`
  - `store_as: svg_data`
  - render w Antlers przez `{{ iconify:icon }}`
- **Rozszerzenie prefixów Iconify** w `config/statamic-iconify.php`:
  - `map`, `temaki`, `maki`, `game-icons`, `bx`, `bxs`, `bxl`
  - `mdi` było już obecne przed tą zmianą

### Sprawdzono

- Użytkownik potwierdził, że sekcja `Icon Box With Text Section` działa dobrze w CP/frontend.
- Magic Translator widzi nowy set: wyciąga `section_title`, `items.*.title`, `items.*.description`; celowo pomija `layout` (select) i `icon` (iconify).
- Home PL — nowy blok pod `page_builder.2`.
- Home EN — nie ma jeszcze nowego bloku; dry-run PL→EN pokazuje `stale`; do synchronizacji użyć `--include-stale` albo `--overwrite`.

### Walidacja

- `php artisan test` — OK (`2 passed`)
- HTTP `/` — 200, `/en/` — 200
- Backup: `backup-projekt/skalisty-orion-backup-8.tar.gz` — 354 MB

---

## 2026-06-17 (FEATURE-iconify-install — addon Iconify, browse 200K+ ikon w CP)

### Dodano

- **Pakiet Composer** `eminos/statamic-iconify` v2.1.0 (MIT, natywny `statamic/cms: ^6.0`) — czysty `composer require`, bez forka, bez bumpa constrainta, bez patcha. ServiceProvider `StatamicIconify\ServiceProvider` auto-discovered przez Laravel.
- **Opublikowany config** `skalisty-orion/config/statamic-iconify.php` przez `vendor:publish --tag=statamic-iconify-config`.
- **Assety CP addonu** `skalisty-orion/public/vendor/statamic-iconify/build/` (manifest + JS/CSS fieldtype).

### Skonfigurowano

W `config/statamic-iconify.php`:

- `allowed_prefixes`: zawężone do 7 setów (`tabler`, `heroicons`, `mdi`, `ph`, `fa6-solid`, `fa6-brands`, `lucide`) — daje sensowny zakres ~30–50K ikon zamiast pełnych 200K (search w CP jest użyteczny, nie chaotyczny).
- `default_store_as`: `svg_data` (zapis SVG w content YAML — zero API calls na froncie, offline render, brak runtime zależności od iconify.design).
- `allowed_categories`, `allowed_licenses`: `[]` (puste = wszystkie).

### Korekty techniczne (Codex)

1. **`default_store_as: 'svg'` → `'svg_data'`** — brief miał błąd. Vendor `IconifyFieldtype.php` line 84 (`'svg_data' => 'SVG data'`) potwierdza że addon używa wartości `svg_data`, nie `svg`. Codex zachował intencję briefu (offline render) z poprawną wartością. Brief w archiwum oznaczony.
2. **Fasada Statamic 6** — `Statamic\Facades\Fieldtype::all()` z briefu nie istnieje. Codex użył poprawnego `FieldtypeRepository::handles()` zwracającego `["icon", "iconify"]`.

### Walidacja

- `composer show eminos/statamic-iconify` → v2.1.0 MIT
- `composer.json` → `"eminos/statamic-iconify": "^2.1"`
- `php -l config/statamic-iconify.php` → No syntax errors
- `Statamic::find('iconify')::class` → `StatamicIconify\Fieldtypes\IconifyFieldtype`
- `/cp/iconify/config` jako admin → 200 (JSON z 7 prefixami + `svg_data`)
- `php artisan test` → 2 passed
- HTTP `/` 200, `/en/` 200, `/cp/login` 302
- Brak modyfikacji blueprintów/fieldsetów (zweryfikowane grepem `iconify` w `resources/blueprints/` + `resources/fieldsets/` → 0 trafień)

### Cel

Po wycofaniu Figma Assets (16:50 → 17:36) i CLEANUP-icons-containers-remove (17:10) — czysta instalacja Iconify daje użytkownikowi możliwość wyboru pojedynczej ikony w CP per pole w blueprintcie, z search po 7 najpopularniejszych bibliotek (Tabler, Heroicons, Material Design, Phosphor, Font Awesome 6 Solid+Brands, Lucide). Zero pre-importu, ikony pobierane na żądanie w trakcie wyboru w CP, zapisywane jako inline SVG (frontend offline).

### Wzorzec dla przyszłych instalacji

Iconify to wzorzec instalacji addonu Statamic 6 z natywnym wsparciem `^6.0`: czysty `composer require` → `vendor:publish` → edycja configu → walidacja. W odróżnieniu od wzorca `mariohamann/statamic-figma-assets` (constraint `^5.0` → fork + bump + path repository).

### Powiązane

Następny logiczny brief: wdrożenie pola `iconify` do pierwszego konkretnego blueprintu (`confidence_section`, `our_story_section`, `footer`, `navigation` — decyzja użytkownika gdzie najpierw). **W kolejnym briefie używać `store_as: svg_data`**.

---

## 2026-06-17 (REVERT-figma-assets-install — wycofanie addonu Statamic Figma Assets)

### Usunięto

- **Pakiet Composer** `mariohamann/statamic-figma-assets` (przez `composer remove`).
- **Path repository** dla addonu z `composer.json` (sekcja `repositories`).
- **Katalog forka** `skalisty-orion/addons/mariohamann/` (wraz z całą zawartością — fork upstream z bumpem constrainta + hotfixem breadcrumb).
- **Opublikowany config** `skalisty-orion/config/statamic-figma-assets.php`.
- **6 zmiennych konfiguracyjnych** z `.env`: `FIGMA_FILE_ID`, `FIGMA_PAGE_TITLE`, `FIGMA_FRAME_TITLE`, `FIGMA_ASSETS_CONTAINER`, `FIGMA_FORMAT`, `FIGMA_EXPORT_CHILDREN`.
- **3 placeholdery** `FIGMA_*` z `.env.example`.
- **Routy CP** `/cp/utilities/figma-assets` + pozycja w nawigacji Utilities.

### Zachowano

- **`FIGMA_TOKEN`** w `.env` jako sama zmienna z komentarzami „zachowany na przyszłość" — na prośbę użytkownika; gotowy do reuse przy ewentualnej kolejnej instalacji addonu Figma API.
- **`skalisty/wysiwyg-html-fieldtype`** — drugi lokalny addon (nasz), nieruszony; nadal działa.
- **Wszystkie kontenery, branded ikony, content** — bez zmian.

### Dodano

- **Pre-task backup** `backup-projekt/skalisty-orion-backup-7.tar.gz` (354 MB) — Codex słusznie wykonał backup mimo briefowej sugestii „pomiń"; uzasadnienie: backup-6 z 17:04 był sprzed cleanupu icons containers, więc nie reprezentował stanu sprzed revert-a.
- **Brief w archiwum**: `briefs/archive/2026-06-17-revert-figma-assets-install.md`.

### Walidacja

- `composer show mariohamann/statamic-figma-assets` → „package not found"
- `Statamic\Facades\Utility::all()->map->handle()` → `["cache","phpinfo","search","email","licensing"]` (brak `figma_assets`)
- `composer show skalisty/wysiwyg-html-fieldtype` → 0.1.0, nadal działa
- `php artisan test` → 2 passed
- HTTP `/` 200, `/en/` 200, `/cp/utilities/figma-assets` 404 (admin)
- Rozmiar projektu: 716 → 712 MB

### Cel

Przygotowanie pod instalację Iconify (`eminos/statamic-iconify` v2.1.0) — addon lepiej pasujący do realnego workflow: browse + search 200K ikon w CP per pole w blueprintcie, w odróżnieniu od Figma Assets, który jest batch-importem konfigurowanym w `.env`.

### Powiązane

Po REVERT aktywuje się natychmiast `FEATURE-iconify-install` jako drugi etap zaplanowanego wcześniej dwuetapowego planu.

---

## 2026-06-17 (CLEANUP-icons-containers-remove — usunięcie kontenerów Tabler + Hugeicons)

### Usunięto

- **Kontener `icons` (Tabler Icons)** — `content/assets/icons.yaml` (definicja) + `public/assets/icons/` (5093 SVG, 26 MB).
- **Kontener `icons2` (Hugeicons)** — `content/assets/icons2.yaml` (definicja) + `public/assets/icons2/` (4497 SVG, 21 MB).
- **Dyski w `config/filesystems.php`** — bloki `'icons' => [...]` i `'icons2' => [...]` (linie ~73 i ~82).
- **Pliki `.meta/` Statamica** — 1967 plików auto-tworzonych przez Statamic dla każdej ikony oglądanej w CP (były wyłącznie cache podglądu, brak referencji w treści).

### Zachowano

- **Branded ikony projektu** `public/assets/images/ikony/` — 6 SVG używanych w treści (icon-konsulting-planowanie, icon-ogrody-zoologiczne, icon-parki-tematyczne, icon-projekty-koncepcyjne, icon-spa-hotele, icon-wykonawstwo-inzynieria). Osobny katalog, niezależny od kontenerów `icons`/`icons2`.
- **Kontener `assets`** (główny) — bez zmian.
- **Addon Figma Assets** — bez zmian, kontener docelowy nadal `assets`.

### Dodano

- **Pre-task backup** `backup-projekt/skalisty-orion-backup-6.tar.gz` (356 MB, wykluczone: node_modules, .git, storage/framework/{cache,sessions,views}, storage/logs).
- **Brief w archiwum**: `briefs/archive/2026-06-17-cleanup-icons-containers.md`.

### Walidacja

- Audyt pre-task (Claude): `grep 'container: icons\|container: icons2'` w fieldsetach/blueprintach → 0 referencji; `grep '/assets/icons*/'` w content/views/JS/CSS → 0 referencji
- `php -l config/filesystems.php` → No syntax errors
- `php artisan test` → 2 passed
- HTTP `/` → 200, `/en/` → 200, `/cp/login` → 302
- `Statamic\Facades\AssetContainer::all()->map->handle()` → `["assets"]`
- `config('filesystems.disks')` bez `icons` i `icons2`
- CP zalogowany admin: `/cp/assets/browse/assets` → 200, `/cp/utilities/figma-assets` → 200
- Niezależna weryfikacja Claude na dysku: wszystkie usunięcia potwierdzone, branded ikony zachowane, rozmiar projektu 762→716 MB (redukcja ~46 MB)

### Uwaga operacyjna

Kontenery `icons`/`icons2`, ich pliki `.yaml` oraz katalogi `public/assets/icons*/` **nigdy nie były w Git** (nieśledzone artefakty od 2026-05-31). Po usunięciu `git diff -- config/filesystems.php` jest pusty, bo wpisy dysków również nie były commitowane. **Backup-6 jest jedynym punktem przywrócenia** — nie ma możliwości `git revert`.

### Pierwszy test cyklu dwukierunkowego

Notatka `NOTES_FROM_CLAUDE` z 16:35 (informacja o nowym workflow) została odczytana przez Codex 17:03 z potwierdzeniem `zauważone i uwzględnione` w bloku `Potwierdzenie Codex`. Nowy mechanizm dwukierunkowej komunikacji wprowadzony tego samego dnia zadziałał w pierwszym praktycznym teście.

### Cel

Eliminacja „pre-importu" dziesiątek tysięcy nieużywanych assetów. Od kolejnej iteracji ikony pobierane na żądanie przez addon `mariohamann/statamic-figma-assets` (zainstalowany wcześniej tego dnia) — tylko te faktycznie potrzebne.

### Deployment (osobny brief)

Identyczna operacja będzie potrzebna na `dev.skalisty.pl` — Codex sam zasugerował osobny brief. Lokalny cleanup zakończony; serwer wymaga rsync z `--delete` + usunięcie katalogów + deploy `config/filesystems.php`.

---

## 2026-06-17 (FEATURE-figma-assets-install — addon Mario Hamann jako lokalny fork)

### Dodano

- **Lokalny fork addonu `mariohamann/statamic-figma-assets`** w `skalisty-orion/addons/mariohamann/statamic-figma-assets/` (klon GitHub upstream, bez `.git`, licencja MIT). Wzorzec: path repository — analogicznie do `skalisty/wysiwyg-html-fieldtype`.
- **Path repository + require** w głównym `composer.json` projektu: drugi wpis `repositories` (`./addons/mariohamann/statamic-figma-assets`) + `"mariohamann/statamic-figma-assets": "@dev"`.
- **Plik konfiguracji** `skalisty-orion/config/statamic-figma-assets.php` opublikowany przez `vendor:publish --provider="MarioHamann\StatamicFigmaAssets\ServiceProvider"`.
- **3 placeholdery `.env`** (i `.env.example`): `FIGMA_TOKEN=`, `FIGMA_FILE_ID=`, `FIGMA_ASSETS_CONTAINER=assets` — bez prawdziwych wartości (poufne).
- **Brief w archiwum**: `briefs/archive/2026-06-17-figma-assets-install.md`.

### Zmieniono

- **Bump constrainta** w forku addonu: `composer.json` → `"statamic/cms": "^5.0|^6.0"` (upstream miał `^5.0`, blokowało composer na Statamic 6.20.2).
- **Hotfix widoku Blade** w forku: `addons/mariohamann/statamic-figma-assets/resources/views/index.blade.php` — usunięto `@include('statamic::partials.breadcrumb')` (partial nie istnieje w Statamic 6 → 500), zastąpiono linkiem `<a href="{{ cp_route('utilities.index') }}">&larr; Utilities</a>`. Fix utrzymany w forku, nie w vendorze.

### Walidacja

- `php artisan route:list --name=statamic.cp.utilities.figma-assets` → 5 rout CP zarejestrowanych
- `Statamic\Facades\Utility::all()->map->handle()` → zawiera `figma_assets`
- `php artisan test` → 2 passed
- HTTP `/` → 200, `/en/` → 200
- CP `/cp/utilities/figma-assets` jako zalogowany admin → 200 (response zawiera „Figma Assets")
- Niezależna weryfikacja Claude na dysku: fork bez `.git`, constraint bumpowany, composer.json projektu spójny, config opublikowany, env placeholdery na miejscu, hotfix breadcrumb obecny w widoku

### Cel

POC integracji Figma → Statamic Assets — addon dostępny w CP, infrastruktura gotowa do pierwszego importu (czeka na faktyczny `FIGMA_TOKEN` + `FIGMA_FILE_ID` od użytkownika).

---

## 2026-06-17 (Workflow — rozszerzenie CODEX_SUGGESTIONS.md o pełną dwukierunkową komunikację)

### Zmieniono

- **`AGENTS.md` sekcja 11.8** — dopisano że Codex może w dowolnym momencie dodać wpis do `OPEN_QUESTIONS_FROM_CODEX` lub potwierdzić odczyt `NOTES_FROM_CLAUDE`, niezależnie od standardowego raportu w `ACTIVE_FOR_CLAUDE_REVIEW`.
- **`AGENTS.md` sekcja 11.9** — rozszerzony format `CODEX_SUGGESTIONS.md` o dwie nowe sekcje (`OPEN_QUESTIONS_FROM_CODEX`, `NOTES_FROM_CLAUDE`) z pełnym szablonem wpisów; opisana kanoniczna kolejność sekcji (od najwyższego priorytetu akcji).
- **`AGENTS.md` sekcja 12.4** — dopisano że przed startem Codex sprawdza `NOTES_FROM_CLAUDE` ze statusem `new` i może eskalować pytania nieblokujące przez `OPEN_QUESTIONS_FROM_CODEX`.
- **`AGENTS.md` sekcja 12.6** — dopisano że Claude przed audytem zmian sprawdza `OPEN_QUESTIONS_FROM_CODEX` jako pierwszą rzecz w sesji.

### Dodano

- **`AGENTS.md` sekcja 11.10** (nowa) — pełne zasady dwukierunkowej komunikacji: kiedy Codex używa `OPEN_QUESTIONS_FROM_CODEX`, kiedy Claude używa `NOTES_FROM_CLAUDE`, obowiązki obu agentów w cyklu, cykl życia wpisu, zakazy.
- **`CODEX_SUGGESTIONS.md`** — dwie nowe sekcje na górze pliku: `OPEN_QUESTIONS_FROM_CODEX` (puste) i `NOTES_FROM_CLAUDE` (pierwsza notatka informująca Codex o zmianie workflow). Istniejące sekcje `RESOLVED_BY_CLAUDE`, `ACTIVE_FOR_CLAUDE_REVIEW`, `ARCHIVE` zachowane bez zmian.

### Cel

Zamknąć lukę w workflow: dotychczas brakowało miejsca na pytania Codex „przed startem / w trakcie" (jedyną eskalacją było `DOC-SYNC-BLOCKED` blokujące całą pracę) oraz proaktywnych notatek Claude bez konieczności przepisywania całego briefu. `CODEX_SUGGESTIONS.md` staje się pełnym asynchronicznym kanałem komunikacji między agentami.

### Co się nie zmienia

- `BRIEF_CODEX.md` — nadal jedyne źródło prawdy dla aktywnego zadania.
- `DOC-SYNC-BLOCKED` (11.5) — pozostaje zarezerwowany dla blokad, nie dla zwykłych pytań.
- PROJECT_SYNC — bez zmian, aktywne zadanie pozostaje `FEATURE-figma-assets-install` (zmiana workflow jest pracą Claude poza pipeline'em zadania).

---

## 2026-06-08 (Content pull — sync serwer → lokalnie + backup-5)

### Zmieniono

- **Content pull (serwer → lokalnie)** ✅: rsync SSH pełna synchronizacja z `dev.skalisty.pl`.
- `content/` (--delete): 3 nowe projekty we wszystkich lokalizacjach — `baseny-tropikalne`, `woliera-dzioborozca-zoo-warszawa`, `wybieg-wydry-europejskiej` (PL/EN/CS/DA/DE/ES/FR/IT/LV/NL/NO/SV); zaktualizowane `pages/home` (PL/EN/CS/DA/ES), `pages/pl/realizacje`, `pages/en/projects`; `globals/pl/footer.yaml`; `trees/navigation/pl/main.yaml`.
- `public/assets/` (bez css/): `galeria/baseny-tropikalne/` (5 webp + .meta), `images/strony/` (5 webp + .meta — amonit, box-1÷4), `projekty/` (2 webp + .meta — woliera-dzioborozca-zoo-warszawa-2, wybieg-wydr-okladka).
- `users/admin-orion@skalisty.local.yaml` — zaktualizowany profil admina.
- Post-pull: `cache:clear`, `view:clear`, `statamic:stache:refresh` — OK.

### Dodano

- **Backup `skalisty-orion-backup-5.tar.gz`** (344 MB, 2026-06-08) — kopia lokalna projektu po synchronizacji; `backup-projekt/`; wykluczone: `node_modules`, `.git`, `storage/framework/{cache,sessions,views}`, `storage/logs`.

---

## 2026-06-07 (Deploy — CSS fix Bard paragraphs)

### Wdrożono

- **Deploy przyrostowy** ✅ → `dev.skalisty.pl`: rsync SSH; 1 MB wysłanych (z 467 MB), speedup 456×.
- Wysłane pliki: `resources/views/project/show.antlers.html`, `public/assets/css/output.css`.
- Post-deploy: `cache:clear`, `view:clear`, `stache:refresh` — OK.

---

## 2026-06-07 (Content pull — sync serwer → lokalnie + CSS fix Bard paragraphs)

### Zmieniono

- **Content pull (serwer → lokalnie)**: rsync SSH pełna synchronizacja `content/` i `public/assets/` z `dev.skalisty.pl` do lokalnego projektu.
- Zsynchronizowane `content/`: nowe projekty (afrykarium, oceanika, tarnowskie-termy + wersje CS/DA/DE/ES/FR/IT/LV/NL/NO/SV), strony (`collections/pages/pl/realizacje.md`, aktualizacje `home.md`), nawigacja (`trees/navigation/pl/main.yaml` — edytowane menu główne), widoczność wpisów.
- Zsynchronizowane `public/assets/`: nowe galerie projektów (`galeria/afrykarium/`, `galeria/oceanika/`, `galeria/termy-tarnowskie/`), obraz projektu (`projekty/afrykarium-zoo0wroclaw.webp`), pliki `.meta/` dla ikon.
- Wykluczone z pullu: `public/assets/css/` — lokal ma nowszy build (poprawka CSS Bard paragraphs).
- Post-pull lokalnie: `cache:clear`, `view:clear`, `statamic:stache:refresh` — OK.

### Naprawiono (lokalnie)

- **Brak odstępów między akapitami w Overview projektu**: pole `overvie` (Bard) generuje `<p>` tagi, ale Tailwind CSS resetuje domyślne marginesy. Owinięto output w `<div class="[&>p]:mb-4 [&>p:last-child]:mb-0">` w `resources/views/project/show.antlers.html:26`. Przebudowano CSS (`npm run build`).

---

## 2026-06-08 (Deploy — BUGFIX-cp-site-switcher + BUGFIX-cp-collection-listing + content sync)

### Wdrożono

- **Deploy przyrostowy** ✅ → `dev.skalisty.pl`: rsync SSH z lokalnego projektu; 1.15 MB wysłanych (z 463 MB), speedup 297×.
- Post-deploy: `config:clear`, `cache:clear`, `view:clear`, `statamic:stache:refresh` — OK.

### Wysłane pliki (zmiany od ostatniego deploya 2026-06-07)

- `app/Http/Controllers/CP/SelectSiteController.php` — BUGFIX-cp-site-switcher
- `app/Http/Controllers/CP/Collections/EntriesController.php` — BUGFIX-cp-collection-listing-site-filter + stub-filter
- `app/Providers/AppServiceProvider.php` — IoC binding obu kontrolerów
- `content/collections/` — pełna synchronizacja wpisów (blogs, pages, faqs, projects, services, galleries)
- `vendor/statamic/cms/src/Dictionaries/Locales.php` — patch HOTFIX-18 (proc_open fallback)
- `addons/skalisty/wysiwyg-html-fieldtype/` — aktualny stan addonu
- Pozostałe pliki projektu (composer.json, patches, resources)

---

## 2026-06-08 (BUGFIX-cp-collection-listing-stub-filter — stuby propagate:true widoczne w listingu kolekcji)

### Naprawiono

- **Listing ES (i innych nieoriginowych locale) w CP pokazywał wpisy-stuby**: pliki tworzone automatycznie przez `propagate: true` (zawierają tylko `id:`, `origin:`, `blueprint:`, brak `title:`) były widoczne z kolumną Site = „Español". Wpisy nigdy nie były tłumaczone.

### Root cause

- `propagate: true` w `content/collections/faqs.yaml` auto-tworzy stub locale przy każdym nowym wpisie PL. Stub ma własny UUID i locale ES → `where('site', 'es')` go zwraca. Brief zakładał `whereNotNull('title')` — ale pole `title` w Statamic query dziedziczy wartość przez `origin`. Stuby przechodziłyby ten filtr. `whereNotNull('data->title')` czyta surowy frontmatter pliku (nie augmentowane/dziedziczone dane) — u stubów `null`, u przetłumaczonych wpisów — string.

### Zmieniono

- Dodano `->whereNotNull('data->title')` do bloku `Site::multiEnabled()` w `App\Http\Controllers\CP\Collections\EntriesController::indexQuery()`.
- Finalny blok: `->where('site', Site::selected()->handle())->whereNotNull('data->title')`.
- `php artisan test` — 2 passed.

### Walidacja (Codex)

- Przed fixem: ES=13, PL=22. Po fixie: ES=8 (8 przetłumaczonych), PL=22 (bez strat), DE=0 (brak tłumaczeń DE — poprawne).
- Codex potwierdził twardy check przez `indexQuery()` na realnych danych kolekcji `faqs`.

### Decyzje techniczne

- **Odchylenie od briefu**: brief zakładał `whereNotNull('title')`, Codex użył `whereNotNull('data->title')`. Technicznie słuszne — `title` w Statamic entry query dziedziczy z `origin`, co oznacza, że stubs także zwracają wartość. `data->title` wskazuje na surowy, nieedytowany frontmatter wpisu.

---

## 2026-06-08 (BUGFIX-cp-collection-listing-site-filter — listing kolekcji w CP pokazywał wpisy ze wszystkich języków)

### Naprawiono

- **Listing kolekcji w CP nie filtrował po wybranym locale**: wejście do Collections → FAQs i przełączenie języka na np. ES pokazywało wpisy ze wszystkich 12 języków zamiast tylko z ES.

### Root cause

- `Statamic\Http\Controllers\CP\Collections\EntriesController::indexQuery()` używa `Site::authorized()` (zwraca wszystkie 12 locale) zamiast `Site::selected()` — Statamic domyślnie nie filtruje listingu po locale wybranym w switchu CP.

### Zmieniono

- Utworzono `app/Http/Controllers/CP/Collections/EntriesController.php` — nadpisuje Statamic's `EntriesController::indexQuery()` przez IoC container binding w `AppServiceProvider::register()` (analogicznie do `SelectSiteController`).
- `where('site', Site::selected()->handle())` zamiast vendorowego `whereIn('site', Site::authorized()...)`.
- Codex skopiował logikę `indexQuery()` 1:1 z vendora zamiast wywołać `parent::` — słuszna decyzja (dodanie warunku po `parent::` byłoby mniej czytelne i bardziej kruche przy zmianach Statamic).
- `php artisan test` — 2 passed.

### Walidacja (Codex)

- PL=21, EN=21, DE=12 dla kolekcji `faqs` — poprawna segmentacja per locale.
- Binding potwierdzony: `app(Statamic\EntriesController::class)` → `App\EntriesController`.

### Uwagi

- Doc drift zgłoszony przez Codex: stara sekcja `W trakcie: Brak aktywnych zadań` w `PROJECT_STATUS_CODEX.md` pozostała niespójna z blokiem `PROJECT_SYNC` — nieblokujące; naprawione przez Claude przy zamykaniu taska.

---

## 2026-06-08 (BUGFIX-cp-site-switcher — przełącznik języków w CP nie przeładowuje locale edytowanego wpisu)

### Naprawiono

- **Błędne zachowanie globalnego przełącznika języków w CP**: przełączenie locale w nagłówku CP podczas edycji wpisu (pages, FAQs, itp.) powodowało przeładowanie do tej samej wersji językowej zamiast do odpowiedniej lokalizacji wpisu. Wymagane było wyjście i ponowne wejście do edycji.

### Root cause

- `Statamic\Http\Controllers\CP\SelectSiteController::select()` ustawia wybrany site w sesji i robi `return back()`. `back()` wraca do tego samego URL edycji wpisu (np. `/cp/collections/faqs/entries/{pl-uuid}`). W Statamic każda lokalizacja wpisu ma **własny unikalny UUID** — EN entry to inny rekord niż PL entry.
- Efekt: po przełączeniu na EN `back()` trafia z powrotem na PL entry URL.

### Zmieniono

- Utworzono `app/Http/Controllers/CP/SelectSiteController.php` — nadpisuje Statamic's `SelectSiteController` przez IoC container binding (`$this->app->bind(Statamic\..., App\...)` w `AppServiceProvider::register()`).
- Własny kontroler: gdy poprzedni URL pasuje do wzorca edycji wpisu (`/collections/{x}/entries/{uuid}`), wywołuje `Entry::find($id)->in($siteHandle)->editUrl()` i przekierowuje bezpośrednio na prawidłową lokalizację. Dla innych widoków (dashboard, listingi, menu) nadal robi `back()`.
- Binding potwierdzony: `app(Statamic\Http\Controllers\CP\SelectSiteController::class)` → `App\Http\Controllers\CP\SelectSiteController`.
- `php artisan test` — 2 passed.

### Uwagi

- Fix obejmuje wyłącznie kolekcje (entries). Navigation/globals mają inny wzorzec URL i nie są objęte tą zmianą — mogą wymagać osobnego zadania jeśli użytkownik zgłosi problem.
- **Wyjątek od AGENTS.md**: ten fix został zaimplementowany bezpośrednio przez Claude (nie Codex) na podstawie wykonanej już analizy. Zasada: kodowaniem zajmuje się Codex.

---

## 2026-06-08 (HOTFIX-24 — stub locale pokazuje bursztyn zamiast czerwieni w MT sidebar)

### Naprawiono

- **Regresja patch #5 + HOTFIX-23**: locale stub (stworzony przez `propagate: true`, nigdy nie tłumaczony) był błędnie oznaczany jako `$isStale = true` → bursztynowy ⚠. Stub ≠ "outdated" — to brak tłumaczenia, powinien być czerwony.

### Zmieniono

- `$isStale = true` → `$exists = false` w bloku `elseif` (linia ~195) w `MagicTranslatorFieldtype::preload()` — Vue dostaje `exists=false` → czerwony
- Zaktualizowano `patches/magic-translator-fieldtype-untranslated-stale.patch` (obie zmiany: `$originSite` w `use()` + `$exists = false`)
- `composer patches-relock && patches-repatch` — OK
- `php artisan test` — 2 passed
- Walidacja `preload()` dla FAQ testtest: PL `exists=1/stale=0`, EN/DE/FR `exists=0/stale=0` — mapuje na: PL=zielony, nieprzetłumaczone=czerwony ✓

---

## 2026-06-07 (HOTFIX-23 — PL origin pokazuje bursztyn zamiast zieleni w MT sidebar)

### Naprawiono

- **Regresja patch #5**: locale origin (PL) bez `magic_translator` metadata był błędnie oznaczany jako `$isStale = true` → bursztynowy ⚠. PL nigdy nie ma tej metadata bo sam jest źródłem, nie tłumaczeniem.

### Zmieniono

- Dodano `$originSite` do `use()` closure w `MagicTranslatorFieldtype::preload()` (linia 161)
- Dodano guard `&& $siteHandle !== $originSite` do warunku patch #5 (linia 194) — origin locale zawsze `$isStale = false`
- Zaktualizowano `patches/magic-translator-fieldtype-untranslated-stale.patch` (obie zmiany w jednym patchu)
- `composer patches-relock && patches-repatch` — OK

### Uwagi

- Codex napotkał problem: pierwsze `patches-repatch` FAIL (patch napisany wzgl. już-spatchowanego pliku); wygenerował patch od nowa z `diff -u` od bazowego pliku pakietu — drugie `patches-repatch` OK
- Walidacja CP (PL=zielony, EN=bursztynowy) wymaga ręcznego sprawdzenia w przeglądarce

---

## 2026-06-07 (sync-komputer-zapasowy → główny)

### Zsynchronizowano (komputer zapasowy → komputer główny)

Zastosowano wszystkie zmiany z archiwum `komputer-zapasowy/komputer-zapasowy.tar.gz` do projektu lokalnego. Archiwum zawierało pracę wykonaną w 3 sesjach na komputerze zapasowym (2026-06-06/07).

**Nowe pliki kodu:**
- `app/Http/Controllers/CP/CollectionRoutesController.php` — panel CP do edycji routów kolekcji per język
- `resources/views/cp/collection_routes/index.blade.php` + `edit.blade.php` — widoki panelu

**Zmodyfikowane pliki kodu:**
- `routes/cp.php` — dodana grupa tras `collection-routes`
- `app/Providers/AppServiceProvider.php` — wpis nawigacji "Trasy URL kolekcji"
- `resources/views/page_builder/our_story_section.antlers.html` — HOTFIX-21: `w-[65vw]` → `w-[90vw] lg:w-[65vw]`
- `resources/views/page_builder/featured_projects.antlers.html` — HOTFIX-22: `/project/{{ slug }}` → `{{ url }}`
- `resources/views/page_builder/project_section.antlers.html` — HOTFIX-22 jw.
- `resources/views/partials/header-1..4.antlers.html` (×4) — HOTFIX-22 jw.
- `resources/views/partials/search-results.antlers.html` — HOTFIX-22 jw.
- `resources/views/project/show.antlers.html` — HOTFIX-22 jw.
- `resources/blueprints/collections/faqs/faq.yaml` — `localizable: true` na `title` i `answer`
- `content/collections/projects.yaml` — route zmienione na per-site map (`/realizacje/{slug}` dla PL)
- `content/navigation/main.yaml` — dodano `sites:` z 12 locale
- Widoki CP (translator_api, ui_translations) — poprawione klasy CSS przycisków

**Nowe pliki contentu:**
- `content/collections/faqs/` — lokalizacje cs, da, de, en, fr, it, lv, nl, no, sv (5×10 = 50 plików)
- `content/collections/pages/es/home.md` — strona główna ES
- `content/collections/pages/pl/realizacje.md` — nowa strona PL
- `content/globals/` — 82 puste pliki locale dla 10 języków (+ en/setting.yaml + en/theme_settings.yaml)
- `content/trees/navigation/` — drzewa nav dla 10 nowych języków
- `content/trees/collections/es/pages.yaml`

**Nowe patche:**
- `patches/magic-translator-fieldtype-untranslated-stale.patch` — patch #5 (locale bez tłumaczenia = bursztynowy)

**Grafika:**
- `public/assets/images/strony/jaszczurka-faq.webp` + `.meta/`
- `public/assets/images/identyfikacja-strony/marcin-skibicki-skalisty-group.jpg` + `.meta/`

### Komendy wykonane

- `npm install && npm run build` — Tailwind plugins (@tailwindcss/typography + @tailwindcss/forms)
- `composer patches-relock && composer patches-repatch` — zastosowanie patch #5
- `php artisan statamic:stache:refresh && php artisan cache:clear`
- `php artisan test` — 2 passed ✅

### Dokumentacja

- Skopiowano SYNCHRONIZACJA.md (nowy plik opisujący sesje na komputerze zapasowym)
- Zaktualizowano BRIEF_CODEX.md, PROJECT_STATUS_CODEX.md, CLAUDE_MEMORY.md, CHANGE-LOG.md, CODEX_SUGGESTIONS.md z archiwum
- Dołożono nowe archiwa briefów: HOTFIX-21, HOTFIX-22, feature-collection-routes-panel, hotfix-19, hotfix-20

---

## 2026-06-07 (magic-translator-untranslated-stale-fix — locale bez tłumaczenia pokazywało się jako "done")

### Naprawiono

- **Nowe wpisy kolekcji FAQ (i każdej innej z `propagate: true`) pokazywały się natychmiast jako przetłumaczone** — locale pliki tworzone przez Statamic zawierały tylko `origin:` bez `magic_translator` metadata; `MagicTranslatorFieldtype::preload()` pomijał blok `if (is_array($meta))` dla takich plików, zostawiając `$isStale = false`; Vue komponent: `'bg-green-600': exists && !is_stale` → zielony = "done" mimo braku treści

### Zmieniono

- Dodano `elseif (is_string($currentSourceHash) && $currentSourceHash !== '') { $isStale = true; }` po zamknięciu `if (is_array($meta))` w `MagicTranslatorFieldtype.php`
- Nowy patch: `patches/magic-translator-fieldtype-untranslated-stale.patch`
- Zaktualizowano `composer.json` i `patches.lock.json`
- Wdrożono lokalnie (`patches-relock + patches-repatch`) i na serwer

### Decyzje techniczne

- Standard nowych patchy w tym projekcie: `composer patches-relock && composer patches-repatch` (nie samo `composer install`) — wymagane przez `cweagans/composer-patches ^2.0`
- Na serwerze dhosting SSH: używać `/usr/bin/php83 artisan`, nie `php artisan` (domyślne `php` nie jest właściwym binarium)

### Uwagi

- Codex potwierdził fix przez runtime bootstrap Laravel/Statamic: `is_stale: true` dla `testtest` locale entries
- Codex nie wykonał klikowej walidacji w CP (brak przeglądarki w sandboxie)

---

## 2026-06-07 (sync-online-to-offline-4 — brakujące tłumaczenia stron)

### Zsynchronizowano (online → offline)

- **`content/collections/pages/es/home.md`** — tłumaczenie hiszpańskie strony głównej; katalog `es/` nie istniał lokalnie
- **`content/trees/collections/es/pages.yaml`** — tree kolekcji pages dla locale ES; wymagany przez Statamic
- **`content/collections/pages/{cs,da}/home.md`** — zaktualizowane wersje (nowsze na serwerze)
- **`content/collections/pages/en/blogs.md`** i **`content/collections/pages/pl/{blog,home}.md`** — zaktualizowane
- Odświeżono Statamic stache i cache lokalnie

### Przyczyna

Rsync treści robiony wcześniej z flagą `--update` nie obejmował pliku `pages/es/home.md` (katalog `es/` nie istniał lokalnie — rsync nie tworzy brakujących katalogów nadrzędnych). Kompleksowy rsync całego `content/` naprawił to.

---

## 2026-06-07 (sync-online-to-offline-2 — synchronizacja 1:1 z serwera: brakująca grafika + tłumaczenia ES + testtest)

### Zsynchronizowano (online → offline)

- **`public/assets/images/strony/jaszczurka-faq.webp`** — brakujący obrazek sekcji FAQ na stronie głównej (referenced w `pl/home.md` jako `banner_image`); pobrany z serwera wraz z plikiem meta `images/strony/.meta/jaszczurka-faq.webp.yaml`
- **8 tłumaczeń ES kolekcji `faqs`** — `biotopy-dla-ogrodow-zoologicznych-i-akwariow.md`, `czy-realizujecie-projekty-miedzynarodowe.md`, `czy-zajmujecie-sie-projektowaniem.md`, `czym-sa-sztuczne-skaly.md`, `dekoracje-z-betonu-i-polimerobetonu.md`, `jak-dbacie-o-trwalosc-realizacji.md`, `jakie-realizacje-sztucznych-skal.md`, `tematyzacja-parkow-wodnych-hoteli-i-przestrzeni-komercyjnych.md` — pliki locale ES przetłumaczone na serwerze po naprawie blueprintu (dodanie `localizable: true`)
- **`testtest.md` × 12 locale** — testowy wpis FAQ utworzony na serwerze, zsynchronizowany (cs, da, de, en, es, fr, it, lv, nl, no, pl, sv)
- Odświeżono Statamic stache i cache lokalnie

### Uwagi

- Plik meta `.meta/jaszczurka-faq.webp.yaml` pierwotnie rsync wylądował w `images/strony/` zamiast `images/strony/.meta/` — przeniesiony ręcznie `mv`
- ES FAQ translations były dostępne po stronie serwera dzięki naprawie blueprintu (faq-blueprint-localizable-fix)

---

## 2026-06-07 (faq-blueprint-localizable-fix — naprawa tłumaczenia kolekcji FAQ)

### Naprawiono

- **Magic Translator nie tłumaczył wpisów FAQ** — `title` i `answer` w `resources/blueprints/collections/faqs/faq.yaml` nie miały `localizable: true`; `FieldClassifier` pomija pola bez tego klucza → `$units = []` → translator zapisywał metadata "done" (hash pustej tablicy) ale nie pisał żadnej przetłumaczonej treści do plików locale

### Zmieniono

- Dodano `localizable: true` do pola `title` (type: text) w `faq.yaml`
- Dodano `localizable: true` do pola `answer` (type: textarea) w `faq.yaml`
- Wdrożono na serwer, wykonano `stache:refresh` + `cache:clear` lokalnie i na serwerze

### Decyzje techniczne

- Zmiana addytywna — `localizable: true` nie łamie istniejącego contentu; locale pliki FAQ które "przetłumaczono" wcześniej (faktycznie miały tylko metadata z hashem pustej tablicy) pokażą się teraz jako STALE w sidebarze Magic Translatora — user używa "Overwrite existing translations" jednorazowo dla 4 istniejących wpisów FAQ

### Uwagi

- Codex wykonał zmianę i wdrożył na serwer, ale nie dodał wpisu do CODEX_SUGGESTIONS.md

---

## 2026-06-07 (sync-content-online-to-offline — synchronizacja treści ze strony online)

### Zsynchronizowano (online → offline)

- **`content/collections/pages/pl/home.md`** — strona główna PL edytowana w CP na dev.skalisty.pl; pobrana na lokalną wersję projektu
- **`content/collections/pages/en/home.md`** — strona główna EN (localizacja PL); zsynchronizowana z serwerem
- **4 nowe wpisy kolekcji `faqs`** — `biotopy-dla-ogrodow-zoologicznych-i-akwariow.md`, `czym-sa-sztuczne-skaly.md`, `dekoracje-z-betonu-i-polimerobetonu.md`, `tematyzacja-parkow-wodnych-hoteli-i-przestrzeni-komercyjnych.md` — pobrane dla wszystkich 12 języków (48 plików)
- Odświeżono Statamic stache i cache lokalnie

### Uwagi

- Globale locale (cs, da, de itp.) — identyczne na serwerze i lokalnie; nie wymagały synchronizacji
- Użyto rsync z flagą `--update` — nadpisywane tylko pliki nowsze na serwerze

---

## 2026-06-07 (globals-locale-files-fix — dropdown 12 języków w Globals CP)

### Naprawiono

- **CP > Globals — dropdown języków pokazywał tylko PL i EN** we wszystkich panelach globalnych oprócz `touch_with_us`; przyczyna: Statamic wymaga fizycznego pliku `content/globals/{locale}/{handle}.yaml` dla każdego języka — sama konfiguracja `sites:` w pliku konfiguracyjnym global setu jest niewystarczająca (identyczny mechanizm jak navigation trees)
- Utworzono **72 puste pliki YAML** dla 8 globalnych (`coming_soon`, `error_page`, `footer`, `newsletter_cookies`, `quotation`, `setting`, `social_share`, `theme_settings`) we wszystkich brakujących locale: sv, no, nl, lv, it, fr, es, de, da, cs (10 locale × 8 globalnych = 80, minus już istniejące en/coming_soon, en/error_page itd. = 72 nowe)
- Puste pliki są funkcjonalne — locale dziedziczą wartości z PL przez `origin: pl` zdefiniowane w konfigu global setu; administrator może nadpisać wybrane pola per język bez potrzeby dodatkowej konfiguracji

### Decyzje techniczne

- Wzorzec wymagania pliku fizycznego per locale jest spójny w całym Statamic: nawigacja (trees), globals, kolekcje — zawsze trzeba pliku żeby CP pokazał dany język
- Puste pliki (`touch {}`) wystarczą — Statamic interpretuje brak kluczy w pliku jako "brak overrides, używaj origin"
- `setting` i `theme_settings` nie miały nawet EN — te dwa pliki też zostały dodane

### Wdrożono

- Deploy przyrostowy → `dev.skalisty.pl`: 72 pliki; post-deploy: `stache:refresh` + `cache:clear` ✅

---

## 2026-06-07 (Sync content online→offline)

### Zsynchronizowano

- **Pull serwer → lokalnie** (dwa rundy w tej sesji):
  - `content/globals/pl/theme_settings.yaml` — aktualizacja z CP online
  - `content/trees/navigation/pl/main.yaml` — drzewo PL edytowane przez CP (pozycja "Realizacje" zamiast "Projects", `button_link: /realizacje`)
  - `content/globals/pl/footer.yaml` — aktualizacja z CP online
  - `content/collections/pages/pl/home.md` — strona główna PL edytowana przez CP
  - `content/collections/pages/en/home.md` — strona główna EN
  - `content/collections/pages/cs/home.md` — strona główna CS
  - `content/collections/pages/da/home.md` — strona główna DA
  - `public/assets/images/identyfikacja-strony/marcin-skibicki-skalisty-group.jpg` — nowe zdjęcie wgrane przez CP

---

## 2026-06-07 (CP-buttons-tailwind-fix — poprawka przycisków Zapisz w panelach CP)

### Naprawiono

- **Przyciski submit w 3 panelach CP** (`resources/views/cp/collection_routes/edit.blade.php`, `resources/views/cp/ui_translations/edit.blade.php`, `resources/views/cp/translator_api/index.blade.php`) — zamiast klasy `btn-primary` (która nie istnieje w CSS Statamic 6 CP) zastosowano właściwe Tailwind classes skopiowane z komponentu `vendor/statamic/cms/resources/js/components/ui/Button/Button.vue` (`cva` + Tailwind merge): `relative inline-flex items-center justify-center px-4 h-10 text-sm font-medium rounded-lg bg-linear-to-b from-primary/90 to-primary hover:bg-primary-hover text-white border border-primary-border shadow-ui-md cursor-pointer`

### Decyzje techniczne

- `btn-primary` i `.btn` (jako klasa z CP CSS) nie są zdefiniowane w Statamic 6 CP — `.btn` dodaje tylko `margin-right: 15px` w kontekście asset-listing; przyciski były wyświetlane jako zwykły tekst bez żadnego stylowania
- `from-primary`, `to-primary`, `border-primary-border` odnoszą się do CSS custom properties `--color-primary` itd., które Statamic CP ustawia dynamicznie — kolory zmieniają się automatycznie przy zmianie motywu CP (domyślnie niebieski, inne motyw inne odcienie)
- Zmiana bezpośrednio przez Claude (poza normalnym workflow Codex) — prosta podmiana klasy w Blade, bez potrzeby briefu

---

## 2026-06-07 (Nawigacja CP — 12 języków w edytorze nawigacji)

### Dodano

- **`content/trees/navigation/{sv,no,nl,lv,it,fr,es,de,da,cs}/main.yaml`** — 10 nowych plików drzew nawigacji dla brakujących języków; każdy plik zawiera `tree: []`; Statamic wymaga pliku drzewa per site żeby język był dostępny w CP > Content > Navigation

### Zmieniono

- **`content/navigation/main.yaml`** — dodany klucz `sites:` z listą wszystkich 12 locale (`pl`, `en`, `sv`, `no`, `nl`, `lv`, `it`, `fr`, `es`, `de`, `da`, `cs`); bez tego klucza Statamic pokazuje tylko PL i EN w dropdown wyboru języka w edytorze nawigacji

### Decyzje techniczne

- Zmiana bezpośrednio przez Claude (poza normalnym workflow Codex) — pure config, bez kodu
- Statamic CP editor nawigacji wymaga dwóch warunków łącznie: (1) klucz `sites:` w `.yaml` kolekcji nawigacji, (2) plik `content/trees/navigation/{locale}/main.yaml` dla każdego języka; brak któregokolwiek = dany język nie pojawia się w dropdown
- Pliki drzew z `tree: []` są funkcjonalne — język jest edytowalny w CP, administrator może samodzielnie dodawać pozycje menu

---

## 2026-06-07 (HOTFIX-22 — hardkodowane /project/ → {{ url }} w szablonach)

### Naprawiono

- **Hardkodowane linki projektów** — 8 plików szablonów Antlers miało `href="/project/{{ slug }}"` zamiast `href="{{ url }}"` (29 wystąpień łącznie); przez to zmiana routy w `content/collections/projects.yaml` (PL → `/realizacje/`) nie działała na froncie — szablony generowały stare URL niezależnie od konfiguracji kolekcji
- Zmienione pliki:
  - `resources/views/page_builder/project_section.antlers.html` (12 wystąpień)
  - `resources/views/page_builder/featured_projects.antlers.html` (3 wystąpienia)
  - `resources/views/partials/header-1.antlers.html` (7 wystąpień)
  - `resources/views/partials/header-2.antlers.html` (8 wystąpień)
  - `resources/views/partials/header-3.antlers.html` (7 wystąpień)
  - `resources/views/partials/header-4.antlers.html` (7 wystąpień)
  - `resources/views/partials/search-results.antlers.html` (1 wystąpienie)
  - `resources/views/project/show.antlers.html` (4 wystąpienia)

### Decyzje techniczne

- `{{ url }}` w Statamic Antlers zwraca pełny, zbudowany URL entry'a zgodny z konfiguracją `route:` kolekcji — uwzględnia locale, prefix site i wzorzec trasy; `href="/project/{{ slug }}"` hardkoduje segment URL i ignoruje routing całkowicie
- Motyw Orion używał hardkodowanej ścieżki z założeniem single-locale i stałej nazwy segmentu `project`; po wprowadzeniu multisiteu z per-locale routingiem ta konwencja stała się błędem

---

## 2026-06-07 (FEATURE-collection-routes-panel — panel CP do edycji routów kolekcji)

### Dodano

- **`app/Http/Controllers/CP/CollectionRoutesController.php`** — nowy kontroler CP; `index()` listuje zarządzane kolekcje; `edit($collection)` pokazuje per-site inputy routów; `update($request, $collection)` zapisuje YAML i wywołuje `Artisan::call('statamic:stache:refresh')`; używa `Symfony\Component\Yaml\Yaml` + `Statamic\Facades\Site::all()`
- **`resources/views/cp/collection_routes/index.blade.php`** — tabela z zarządzanymi kolekcjami i przyciskiem "Edytuj"; `@extends('statamic::layout')`
- **`resources/views/cp/collection_routes/edit.blade.php`** — formularz z per-site route inputami; `font-mono` na inputach (czytelność ścieżek URL)

### Zmieniono

- **`routes/cp.php`** — dodana grupa tras `collection-routes` (GET `/`, GET `/{collection}`, POST `/{collection}`)
- **`app/Providers/AppServiceProvider.php`** — nav item `Nav::extend()`: `$nav->create('Trasy URL kolekcji')->section('Tools')->url(cp_route('collection-routes.index'))->icon('link')`
- **`content/collections/projects.yaml`** — klucz `route:` zmieniony z jednego stringa (`/project/{slug}`) na mapę per-site: `pl: '/realizacje/{slug}'`, pozostałe 11 locale: `/project/{slug}`

### Wdrożono

- Deploy przyrostowy → `dev.skalisty.pl`: wszystkie 5 plików PHP/Blade + projects.yaml; post-deploy: config/cache/view clear + stache:refresh ✅

---

## 2026-06-07 (Tailwind plugins — typography + forms)

### Dodano

- **`@tailwindcss/typography` v0.5.19** — plugin dodaje klasę `prose` do stylowania długiego tekstu (blog, strony contentowe); aktywowany przez `@plugin "@tailwindcss/typography"` w `tailwind.css`
- **`@tailwindcss/forms` v0.5.11** — plugin normalizuje wygląd elementów formularzy (`input`, `select`, `textarea`, `checkbox`, `radio`); aktywowany przez `@plugin "@tailwindcss/forms"` w `tailwind.css`
- `package.json` — oba pakiety dodane do `dependencies`; `output.css` przebudowany (`npm run build`)

---

## 2026-06-07 (HOTFIX-21 — szerokość wideo YouTube na mobile)

### Naprawiono

- **`resources/views/page_builder/our_story_section.antlers.html` (linia 45)** — iframe z wideo YouTube: `w-[90vw] sm:w-[65vw]` → `w-[90vw] lg:w-[65vw]`; breakpoint `sm` (640px) był za wąski — hamburger menu pojawia się przy `lg` (992px), więc tablety (640–991px) nadal miały 65vw; po poprawce 90vw obowiązuje dla wszystkich ekranów < 992px
- **`public/assets/css/output.css`** — przebudowany (`npm run build`)

---

## 2026-06-06 (Hotfix — SEO Pro 404 tracking)

### Naprawiono

- **SEO Pro śledzenie błędów 404 nie działało** — lista zawsze pusta; przyczyna podwójna:
  1. Brak `SEO_PRO_TRACK_ERRORS=true` w `.env` — config domyślnie `false`, `HandleRedirects::recordError()` nigdy nie odpala
  2. `QUEUE_CONNECTION=database` bez workera dla kolejki `default` — `RecordError implements ShouldQueue` trafiał do tabeli `jobs` i nie był przetwarzany

### Zmieniono

- **`.env`**: dodano `SEO_PRO_TRACK_ERRORS=true`
- **`.env`**: `QUEUE_CONNECTION=database` → `QUEUE_CONNECTION=sync` — `RecordError` wykonuje się synchronicznie przy każdym 404; Magic Translator nienaruszony (używa `MAGIC_TRANSLATOR_QUEUE_CONNECTION=database`)

### Decyzje techniczne

- `QUEUE_CONNECTION=sync` jest bezpieczne w tym projekcie — jedyne joby na domyślnej kolejce to `RecordError` z SEO Pro; Magic Translator ma własną konfigurację kolejki niezależną od `QUEUE_CONNECTION`
- Błędy 404 zapisywane do `storage/statamic/seopro/errors/{site}/{slug}.yaml` — format YAML z polami `url`, `hits`, `last_hit_at`; dostępne w CP pod SEO Pro → Errors

---

## 2026-06-07 (Deploy — toggles projektów + pull contentu + naprawiony duplikat ID)

### Dodano

- **Togglei widoczności sekcji w blueprincie `projects`** (`resources/blueprints/collections/projects/project.yaml`) — 3 nowe pola `toggle` z domyślną wartością `false`: `show_milestones` (przed grupą `Project Milestones`), `show_team_section` (przed grupą `Team Section`), `show_related_projects` (przed grupą `Related Projects`); każda grupa ma `if: { handle: true }` — w CP grupy znikają gdy toggle wyłączony
- **Content z serwera** (pull server → lokalnie): `content/collections/galleries/pl/galeria-strona-glowna.md` + 11 wersji językowych; `content/collections/projects/pl/woliera-argusa.md` (nowy projekt "Woliera Argusa – ZOO Warszawa" z pełną treścią PL); `content/collections/pages/{pl,en,cs,da}/home.md` (nowy blok `skalisty_gallery_section`); media: `public/assets/galeria/strona-glowna/` (9 webp), `public/assets/galeria/woliera-argusa/` (8 webp), `public/assets/projekty/woliera-argusa/` (1 webp)

### Zmieniono

- **`resources/views/project/show.antlers.html`** — sekcje `Project Milestones` (linie 86–120), `Team Section` (linie 121–164), `Related Projects` (linie 176–220) owinięte w `{{ if show_milestones }}`, `{{ if show_team_section }}`, `{{ if show_related_projects }}`; `Related Projects` ma dodatkowo zachowany wewnętrzny `{{ if related_projects:related_project }}` jako zabezpieczenie przed pustą sekcją

### Naprawiono

- **Duplikat ID projektu** — `pl/aerotech-engineering-campus.md` (lokalnie i na serwerze) miał ten sam `id` co nowy `pl/woliera-argusa.md`; rsync bez `--delete` nie usuwa starych plików przy rename sluga; stache Statamic widział dwa wpisy z identycznym ID i ignorował oba; rozwiązanie: usunięcie starego pliku lokalnie + SSH `rm` na serwerze przed deployem

### Wdrożono

- **Deploy przyrostowy** ✅ → `dev.skalisty.pl`: `content/collections/projects/` (woliera-argusa.md + en/aerotech), `resources/blueprints/collections/projects/project.yaml`, `resources/views/project/show.antlers.html`; post-deploy: config/cache/view clear + stache:refresh ✅

### Decyzje techniczne

- `if` w blueprint YAML (`if: { show_milestones: true }`) działa wyłącznie na widoczność w CP — nie blokuje danych w szablonie; do ukrycia sekcji na froncie konieczne jest dodatkowe `{{ if show_milestones }}` w widoku Antlers
- `rsync` bez `--delete` nigdy nie usuwa lokalnych/zdalnych plików przy rename sluga; przy każdym pull content trzeba ręcznie weryfikować czy slug zmienił się i usunąć stary plik przez SSH lub lokalnie
- Toggle `default: false` — istniejące projekty mają sekcje domyślnie ukryte po wdrożeniu; wymagają ręcznego włączenia w CP (świadoma decyzja — bezpieczniejsze niż `default: true` które pokazałoby puste/demo sekcje)

---

## 2026-06-07 (Lightbox-close-fix — przycisk X + zamknięcie poza obszar zdjęcia)

### Dodano

- **Przycisk X w lightboxie** (`resources/views/page_builder/skalisty_gallery_section.antlers.html`) — nowy `<button onclick="closeLightbox()">` z ikoną × (SVG 24×24, `path d="M18 6L6 18M6 6l12 12"`) w prawym górnym rogu; dodany obok istniejącego przycisku fullscreen wewnątrz nowego `<div class="flex items-center gap-3">`

### Zmieniono

- **`public/assets/js/custom.js`** — w `setupLightbox()` dodany stały handler `$("#galleryLightbox").on("click", ...)`: wywołuje `closeLightbox()` gdy `e.target` to `#galleryLightbox` (ciemny obszar wokół kontenera obrazu) lub `#lightboxMain` (ciemny obszar wewnętrzny — poza obrazem); kliknięcie na obraz, miniaturkę lub przyciski nie zamyka lightboxa

### Wdrożono

- **Deploy przyrostowy** ✅ → `dev.skalisty.pl`: 2 zmienione pliki (`custom.js`, `skalisty_gallery_section.antlers.html`) + 4 pliki content; post-deploy: `config:clear && cache:clear && view:clear && statamic:stache:refresh` ✅

### Decyzje techniczne

- `e.target === #galleryLightbox || e.target === #lightboxMain` — sprawdza bezpośredni cel kliknięcia (nie bąbelkowanie); `#lightboxMain` jest `flex-1` i zajmuje cały pionowy obszar kontenera poza obrazem — jego ciemne tło jest widoczne dla użytkownika; kliknięcia na potomków (obraz, thumbnaile, strzałki nav) mają inny `e.target` i nie zamykają lightboxa
- Brak Playwright MCP w tej sesji — weryfikacja wizualna nie była możliwa automatycznie; weryfikacja przez deploy na `dev.skalisty.pl`

---

## 2026-06-06 (sesja — globals i18n + frontend string translation dla 12 języków)

### Dodano

- **`app/Console/Commands/TranslateGlobalSet.php`** — komenda Artisan `globals:translate {global}` tłumacząca Statamic global sets przez DeepL; parametry: `--source` (domyślnie `pl`), `--locales`, `--dry-run`; obsługa wildcard `offices.*.country`, `offices.*.address`; tworzy brakujące katalogi `content/globals/{locale}/`
- **`app/Console/Commands/TranslateLangFiles.php`** — komenda Artisan `lang:translate` tłumacząca pliki `lang/*.json` przez DeepL; parametry: `--source` (domyślnie `en`), `--locales`, `--force`, `--dry-run`; pomija pliki z istniejącą treścią (chyba że `--force`)
- **`content/globals/{sv,no,nl,lv,it,fr,es,de,da,cs}/touch_with_us.yaml`** — 10 brakujących lokalizacji globalu `touch_with_us`; przetłumaczone przez DeepL z PL; pola przetłumaczone: `sub_title`, `heading`, `subheading`, `content_title`, `offices[].country`, `offices[].address`; pola nieprzetłumaczone: `email`, `phone`, `map_link`, `flag`, `socials`

### Zmieniono

- **`lang/en.json`** — był prawie pusty (2 klucze); uzupełniony do 35 kluczy obejmujących wszystkie UI stringi z szablonów: przyciski (`Submit`, `Share`, `Load More`, `Reply`), nawigacja (`Next Post`, `Prev Post`, `Category`, `View All`), etykiety formularzy (`Full Name`, `Email Address`, `Phone`, `Message`, `Company`, `Budget`, `Choose Plan` i inne); `en.json` jest źródłem kluczy dla CP Tools → Translations UI
- **`lang/pl.json`** — uzupełniony do kompletnych 35 kluczy polskich tłumaczeń (był niekompletny — brakowało `Full Name`, `Phone`, `Message` i innych)
- **`lang/{sv,no,nl,lv,it,fr,es,de,da,cs}.json`** — były puste `{}`; wypełnione 35 przetłumaczonymi ciągami przez DeepL; naprawiona encja HTML `&#x27;` → `'` w `fr.json`
- **`resources/views/partials/let-connect-section.antlers.html`** — `{{ display }}` → `{{ trans :key="display" }}` w etykiecie formularza `<label>`
- **`resources/views/career.antlers.html`** — `{{ display }}` → `{{ trans :key="display" }}`
- **`resources/views/quotation.antlers.html`** — `{{ display }}` → `{{ trans :key="display" }}` (2 miejsca: `radio` i `select`)
- **`resources/views/blog-detail-one.antlers.html`** — `{{ display }}` → `{{ trans :key="display" }}` (3 miejsca)
- **`resources/views/blog-detail-two.antlers.html`** — `{{ display }}` → `{{ trans :key="display" }}` (3 miejsca)
- **`resources/views/blog-detail-three.antlers.html`** — `{{ display }}` → `{{ trans :key="display" }}` (3 miejsca)
- **`resources/views/blog-detail-four.antlers.html`** — `{{ display }}` → `{{ trans :key="display" }}` (3 miejsca)

### Decyzje techniczne

- `{{ trans :key="display" }}` zamiast `{{ display }}` — dwukropek przed `key` oznacza wartość dynamiczną (zmienna z kontekstu pętli `{{ fields }}`); jeśli klucz nie istnieje w `lang/*.json` — Antlers fallbackuje do samego klucza (oryginalnej wartości `display`), więc zmiana jest bezpieczna wstecznie
- `lang/en.json` jako źródło kluczy — Statamic CP Tools → Translations UI wyświetla wyłącznie klucze istniejące w `lang/en.json`; klucze dynamiczne (`{{ trans :key="display" }}`) nie są skanowane statycznie przez Statamic, muszą być w `en.json` explicite
- Pola `email`, `phone`, `socials`, `map_link` w globals nie są tłumaczone — dane kontaktowe są globalnie wspólne i nie powinny różnić się per język
- Magic Translator nie obsługuje globalsów (tylko entries) — stąd własna komenda `globals:translate`

### Uwagi

- Sekcja "Let's Connect" jest **hardcoded** w `home.antlers.html` jako `{{ partial:let-connect-section }}`, nie jest blokiem page buildera — celowo wstawiona między pierwszą a ostatnią pętlą page buildera (trusted_partners_section na końcu)
- Dane sekcji (headings, adresy, social) zarządzane w CP → Globals → Touch With Us

---

## 2026-06-07 (HOTFIX-20 — kolizja panelu językowego i nawigacji)

### Naprawiono

- **HOTFIX-20-lang-panel-collision** ✅: kolizja między `#navbar-default` a `#lang-mobile-panel` w trybie mobilnym (Firefox); symptom: otwarcie hamburger-menu nav przed panelem języków powodowało, że panel języków natychmiast znikał po otwarciu (overlay pozostawał widoczny); po sekwencji nav→lang panel języków nie dał się poprawnie otworzyć ponownie; root cause: `closeLangPanel()` dodawała `transitionend { once: true }` listener bezwarunkowo — nawet gdy panel był ukryty (`display:none`); sierota wisiała na elemencie i odpaliła się przy następnym `openLangPanel()` zaraz po CSS transition `scale-y-0→scale-y-100`, chowając panel z powrotem; fix: (1) guard w `closeLangPanel()` — jeśli `!open || hidden` → wyczyść klasy i `return` bez listenera; (2) `openLangPanel()` — `remove("hidden", "open") → add("block") → void offsetHeight → add("open")` zamiast `remove("hidden") → void offsetHeight → add("open", "block")` (reset zapewnia czysty start `scale-y-0` niezależnie od poprzedniego stanu)

### Decyzje techniczne

- Guard `!open || hidden` w `closeLangPanel` — sierota powstaje gdy `closeLangPanel()` jest wywoływane na elemencie już ukrytym (brak CSS transition = brak `transitionend`); sprawdzenie obu warunków eliminuje ryzyko dla dwóch możliwych stanów błędu (`!open` = nigdy nie otworzony, `hidden` = forcefully hidden przez bug)
- `remove("open")` przed `add("block")` w `openLangPanel` — czyści stale `open` które mogło zostać na elemencie po wcześniejszym buggu; bez tego panel startowałby od razu w `scale-y-100` i animacja wejścia nie zagrałaby

---

## 2026-06-07 (HOTFIX-19 — animacja panelu językowego)

### Naprawiono

- **HOTFIX-19-lang-panel-animation** ✅: panel językowy mobile (`#lang-mobile-panel`) otwierał się bez animacji; `closeLangPanel()` też był skokowy; root cause: panel startuje z `display:none` (`hidden`) — synchroniczne `remove("hidden")` + `add("open")` w jednym JS-tick powodowało, że przeglądarka batchowała zmiany i pomijała stan startowy `scale-y-0`; fix: (1) `void langPanel.offsetHeight` między remove a add w `openLangPanel()` (wymusza reflow — przeglądarka widzi `scale-y-0` przed rozpoczęciem transition); (2) `langPanel.addEventListener("transitionend", ..., { once: true })` w `closeLangPanel()` zamiast synchronicznego `classList.add("hidden")` (transition nie jest już przerywane przez `display:none`)

### Decyzje techniczne

- `void el.offsetHeight` — klasyczna technika wymuszania reflow; konieczna gdy `display:none` → `display:block` i CSS transition muszą działać razem; alternatywa `requestAnimationFrame` jest mniej deterministyczna
- `{ once: true }` w `addEventListener` — automatyczne usunięcie listenera po pierwszym wywołaniu; eliminuje ryzyko wielokrotnego dodania `hidden` przy rapid-click

---

## 2026-06-06 (Mobile-language-switcher-v2 — zaakceptowane)

### Dodano

- **Mobile-language-switcher-v2** ✅: mobilny panel języków niezależny od hamburger menu; `header-1.antlers.html`: `#lang-mobile-panel` z `class="hidden lg:hidden mobile-nav"` jako sibling `#navbar-default`; wewnętrzny `<div class="bg-white h-full overflow-y-auto overscroll-contain">` z listą locale; emoji flagi per locale (pl/en/sv/nb/nl/lv/it/fr/es/de/da/cs); spójne z `language-switcher.antlers.html`; wrapper switchera przywrócony do `flex items-center gap-2 relative` (zawsze widoczny)
- **custom.js** — 4 nowe elementy w DOMContentLoaded closure: deklaracje `langPanel/langDetails/langSummary/langArrow`; funkcje `openLangPanel()` i `closeLangPanel()` (toggle `hidden`/`open`/`block`, rotacja strzałki, overlay); helper `syncMobilePanelViewport()` (oblicza dostępną wysokość od top panelu do dołu okna — eliminuje ucięcie listy locale na małych viewportach); handler `<summary>.click` na mobile z `e.preventDefault()`; `closeLangPanel()` dodane do overlay click i resize handler; hamburger↔panel wzajemnie się zamykają

### Decyzje techniczne

- Reużyto istniejącego mechanizmu `.mobile-nav` CSS (bez zmian w tailwind.css); `lg:hidden` zapewnia ukrycie na desktop niezależnie od stanu JS; `langDetails.open = false` wymuszane przy otwarciu panelu mobile (eliminuje edge case desktopowego `<details>` po zmianie viewport)
- `locale:short` w Antlers zwraca kod PHP locale pierwszego członu (`nb_NO` → `nb`), nie site handle (`no`) — check `"nb"` jest poprawny; zachowanie spójne z `language-switcher.antlers.html`

---

## 2026-06-06 (sesja — synchronizacja offline↔online + deploy)

### Wdrożono

- **Deploy przyrostowy** ✅: rsync lokalnie → `dev.skalisty.pl`; przesłano 6,3 MB (statamic/cms v6.20.2, guzzlehttp/*, CP assets, composer.lock, patches.lock.json); post-deploy: config/cache/view clear + stache:refresh; PL 200 ✅ EN 200 ✅
- **Pull z serwera** ✅: `content/seo-pro/redirects/pl/ppp.yaml` (nowy redirect SEO Pro dodany przez CP online) + pliki `.meta/` grafik wgranych online; lokalny stache odświeżony

### Dokumentacja

- `server_deploy/DEPLOYMENT.md` zaktualizowany o dzisiejszą synchronizację

---

## 2026-06-06 (sesja — aktualizacja Statamic + AGENTS.md)

### Zmieniono

- **Update-statamic-cms-6.20.2** ✅: `statamic/cms` v6.20.0 → v6.20.2 (patch, semver-safe); przy okazji zaktualizowane zależności Statamika: `guzzlehttp/guzzle` 7.10.5→7.11.0, `guzzlehttp/promises` 2.4.1→2.5.0, `guzzlehttp/psr7` 2.10.4→2.11.0; patch HOTFIX-18 (`statamic-cms-locales-proc-open-fallback.patch`) nałożony przez `composer patches-relock` + `composer patches-repatch` (samo `composer update` nie wystarczyło — nowy patch w `composer.json` był nieobecny w `patches.lock.json`); walidacja: `php artisan test` 2 passed, stache/view/config clear OK, HTTP 200 `/` i `/en/`

### Decyzje techniczne

- Przy dodawaniu nowego patcha do istniejącego projektu z `composer-patches 2.x` — po dodaniu wpisu do `composer.json extra.patches` zawsze wymagane: `composer patches-relock && composer patches-repatch`. Samo `composer install` lub `composer update` zastosuje patch tylko jeśli jest już w `patches.lock.json`.

### Dokumentacja

- `AGENTS.md` sekcja 10.5: dodano jako **pierwszy punkt audytu** — sprawdzenie nowych wpisów Codexa w `CODEX_SUGGESTIONS.md`

---

## 2026-06-06 (sesja — Tailwind v4 syntax fix)

### Naprawiono

- **Tailwind-v4-syntax-fix** ✅: `public/assets/css/tailwind.css` — 4 zmiany: (1) usunięto `--container-center: true` i `--container-padding: 1rem` z `@theme` (nie są rozpoznawane przez v4, kontener zdefiniowany ręcznie niżej); (2) usunięto 4 bloki `@font-face` dla "El Messiri" (martwy kod — `--font-el-messiri` wskazuje na Syne od sesji 2026-05-30); (3) `bg-gradient-to-t` → `bg-linear-to-t` (v3 syntax, gradient nie generował CSS); (4) `theme("colors.primary.900")` → `var(--color-primary-900)` (deprecated v3 function); `npm run build` — `output.css` zawiera `linear-gradient(...)` ✅

---

## 2026-06-06 (sesja — Skalisty Gallery Section)

### Dodano

- **Skalisty Gallery Section** ✅: nowy blok page buildera niezależny od motywu Orion; obsługuje wiele zdjęć per wpis galerii; responsywny grid `grid-cols-1 sm:grid-cols-2 md:grid-cols-4`; lightbox identyczny z oryginalnym; 3 pliki: `resources/fieldsets/skalisty_gallery_section.yaml`, `resources/views/page_builder/skalisty_gallery_section.antlers.html`, wpis w `all_page_builder.yaml`

### Zmieniono

- **Blueprint galleries** ✅: usunięto `max_files: 1` z pola `image` w `resources/blueprints/collections/galleries/gallery.yaml` — brak limitu liczby zdjęć per wpis

### Decyzje techniczne

- Nowy blok zamiast modyfikacji istniejącego `gallery_section` Oriona — zmiany w plikach motywu mogą zostać nadpisane przy aktualizacji; własne pliki `skalisty_*` są bezpieczne
- Brak `max_files` w Statamic assets fieldtype = brak limitu (nie trzeba podawać liczby)

---

## 2026-06-06 (sesja wieczorna — naprawa YouTube w our_story_section)

### Naprawiono

- **YouTube video our_story_section** ✅: `<video>` + `type="video/mp4"` z YouTube URL → błąd MIME; zastąpiono przez `<iframe id="storyVideo" data-src="{{ video_url }}">` (bez `src` przy ładowaniu strony); w `custom.js` dodano `toEmbedUrl()` konwertujący `watch?v=ID` → `embed/ID?autoplay=1&rel=0`, `openVideoModal` ustawia `iframe.src`, `closeVideoModal` ustawia `iframe.src = "about:blank"` (czyste zatrzymanie odtwarzania)

---

## 2026-06-06 (sesja — diagnoza, naprawa i zmiana logo na PNG)

### Naprawiono

- **Logo-fix CSS rebuild** ✅: wykryto, że po Logo-fix nigdy nie wykonano `npm run build` — klasy `xl:max-w-[280px]`, `1xl:max-w-[280px]`, `2xl:h-12` itd. nie istniały w `public/assets/css/output.css`; uruchomiono `npm run build` → Tailwind v4 przenalizował szablony i wygenerował nowy `output.css`; logo na 1920px wyświetla się poprawnie (276×56px, aspect ratio OK)
- **Logo xl/1xl (drugi fix)** ✅: kontener 280px - 80px padding = 200px < 257px naturalnej szerokości → squished 22%; zmieniono `xl:max-w-[280px]` → `xl:max-w-[300px]` i `1xl:max-w-[280px]` → `1xl:max-w-[340px]`; `npm run build`; logo 1xl = 256×52px proporcje OK
- **Logo SVG → PNG** ✅: SVG renderował inaczej w Firefox vs Chromium (font Overpass nie ładowany przez stronę); wygenerowano `logo-skalisty-2.png` i `logo-skalisty-white-2.png` (594×120px, 2x) przez Inkscape; zaktualizowano `content/globals/pl/setting.yaml`; `stache:refresh`; logo wyświetla się poprawnie — zweryfikowane przez użytkownika

---

## 2026-06-05 (sesja wieczorna — migracja i naprawa środowiska)

### Naprawiono

- **Migracja z innego komputera** ✅: projekt przeniesiony na nową maszynę (PHP 8.4, Node 20, Composer 2.8); wykryto i naprawiono brakujący katalog `addons/skalisty/wysiwyg-html-fieldtype/` — skopiowany z kopii `wysiwyg-html-fieldtype-v1.1` w workspace; naprawiono zerwany symlink `public/vendor/wysiwyg-html-fieldtype/js/addon.js`
- **Stache cache corruption** ✅: po migracji błąd `Call to a member function selectedQueryColumns() on null` w `Statamic\Stache\Query\Builder:49` — wywoływany przez SEO Pro `Cascade::alternateLocales()` przy każdym żądaniu frontendowym; przyczyna: przestarzały cache Stache przeniesiony ze starego komputera zawierał nieaktualne referencje do wpisów; naprawiono przez `php artisan statamic:stache:refresh` + `php artisan cache:clear` + `php artisan view:clear`

### Dokumentacja

- `CLAUDE_MEMORY.md`: zsynchronizowany blok `PROJECT_SYNC` (doc drift — stary aktywny brief `Zabezpieczenie-patchy-vendora` → `none`); dodano brakujące wpisy SEO-Pro, HOTFIX-18, migracja; zaktualizowano sekcje: aktywny brief, otwarte zadania, następne kroki
- `CODEX_SUGGESTIONS.md`: oznaczono doc drift z 2026-06-06 jako `resolved`

---

## 2026-06-05

### Naprawiono

- **Logo-fix** ✅: obcięte logo na laptopie (breakpoint 1xl, 1280–1471px) — `header-1.antlers.html`: kontener `xl/1xl:max-w-[280px]` + `max-w-full w-auto` na img; `footer-1.antlers.html`: podejście height-based `h-8 md:h-9 xl:h-11 2xl:h-12 w-auto max-w-full` zamiast max-w (SVG 297×60px, proporcje 4.94:1)

### Dodano

- **Auto-start-queue-worker**: `Event::listen(JobQueued::class, ...)` w `AppServiceProvider::boot()` — worker `queue:work --queue=translations --stop-when-empty` startuje automatycznie w tle po kliknięciu "Tłumacz" w CP; guard `function_exists('exec')` + `pgrep -f "[q]ueue:work.*translations"` zapobiega wielokrotnym instancjom; `escapeshellarg(PHP_BINARY)` dla bezpieczeństwa
- **Zabezpieczenie-patchy-vendora** ✅: `cweagans/composer-patches ^2.0` zainstalowane; 4 pliki `.patch` wygenerowane w `skalisty-orion/patches/` (względem czystych plików paczki z commita `bae49e1`); `extra.patches` w composer.json z 4 wpisami (HOTFIX-10+11 FieldDefinitionBuilder, HOTFIX-11+16 FieldClassifier, HOTFIX-11 ContentExtractor, HOTFIX-17 DeepLTranslationService); `composer-exit-on-patch-failure: true`; `patches.lock.json` w repo (artefakt composer-patches 2.0, stabilizuje cache patchy); walidacja: `rm -rf vendor && composer install` → 4 patche zastosowane automatycznie; `php artisan test` (2 passed)
- **HOTFIX-18** ✅: `Statamic\Dictionaries\Locales` — CP > Settings > Sites crashował z 500; dwie warstwy problemu na dhosting: (1) `proc_open` wyłączone w web PHP-FPM → `Symfony\Process` rzuca `LogicException`; (2) `open_basedir` blokuje `/usr/share/locale` → `is_dir()` rzuca `E_WARNING` konwertowany przez Laravel na `ErrorException`; patch `statamic-cms-locales-proc-open-fallback.patch`: guard `function_exists('proc_open')` + fallback `@is_dir($localeDir)` (operator `@` tłumi warning, daje ciche `false`, metoda zwraca `[]`); zarejestrowany w `composer.json extra.patches` jako HOTFIX-18; wdrożony na serwer przez scp
- **SEO-Pro** ✅: `statamic/seo-pro ^7.10` zainstalowane; `{{ seo_pro:meta }}` w `head-link.antlers.html` (stary `<title>{{ title ?? site:name }}</title>` usunięty); Site Defaults PL (opis PL, JSON-LD Organization, breadcrumbs) + EN (opis EN, analogiczne JSON-LD); 10 pozostałych locale dziedziczy z PL; sitemap XML pod `/sitemap.xml`; walidacja: title/meta/og na `/` i `/en/` OK; uwaga: `php artisan seo-pro:install` nie istnieje w v7.10 (tylko vendor:publish wystarczy); licencja $75 wymagana na produkcji
- **Translator-API-Panel**: panel CP Tools > Translator API (`GET/POST /cp/translator-api`), edycja `DEEPL_API_KEY` w `.env` z poziomu CP, `TranslatorApiController`
- **UI-Translations-Panel**: panel CP Tools > Tłumaczenia UI (`GET/POST /cp/ui-translations`), edycja plików `lang/{locale}.json` z poziomu CP

### Naprawiono

- **HOTFIX-17**: `tag_handling: xml` → `html` w `DeepLTranslationService.php` linia 91 — naprawiono błąd `mismatched tag` przy tłumaczeniu contentu z HTML5 (pola wysiwyg_html); tłumaczenie PL→CS działa (124 units, 1s DONE)
- **HOTFIX-16**: `wysiwyg_html` dodany do `FieldClassifier` (Tier1 + Html), `localizable: true` w `free_text_section.yaml`

### Decyzje techniczne

- Na serwerze dhosting: `MAGIC_TRANSLATOR_QUEUE_CONNECTION=sync` (exec/shell_exec niedostępne w web PHP-FPM) — tłumaczenia wykonywane synchronicznie; lokalnie `database` + auto-start worker
- `CHANGE-LOG.md` ustanowiony jako obowiązkowy dokument projektu; zaktualizowano `AGENTS.md`

### Dokumentacja

- `server_deploy/DEPLOYMENT.md`: dodano odchylenie `MAGIC_TRANSLATOR_QUEUE_CONNECTION=sync` do tabeli odchyleń serwera
- `AGENTS.md`: zmieniono status `CHANGE-LOG.md` z opcjonalnego na obowiązkowy; dodano regułę do "Najważniejszych zasad"

---

## 2026-06-02

### Dodano

- **Frontend string translation**: `lang/pl.json` + `lang/en.json` + `{{ trans key="..." }}` w 20 widokach; 10 pustych plików JSON dla nowych locale
- **HOTFIX-15**: naprawa mobile menu reset przy resize (custom.js)
- **HOTFIX-14**: naprawa `show_search` wrapper `{{ theme_settings }}` w headerach
- **HOTFIX-13**: naprawa `contact_section container: assets`

### Naprawiono

- **HOTFIX blog_section**: "Load More" hardcoded → `{{ trans key="Load More" }}` (3 miejsca)

---

## 2026-06-01

### Dodano

- **Pierwsze wdrożenie na serwer**: `dev.skalisty.pl` na dhosting — PHP 8.4, MySQL, HTTPS, `DEEPL_API_KEY` skonfigurowany
- **Blokada indeksacji**: `public/robots.txt` + `X-Robots-Tag noindex` w `.htaccess`
- **Addon wysiwyg-html-fieldtype**: TipTap 3 + CodeMirror 5, nowe bloki `wysiwyg_html_block` i `columns_section` w page builderze; etapy 1–4 ✅
- **Free Text Section**: nowy blok page buildera — fieldset + widok + rejestracja
- **Toggle show_theme_switcher + show_search**: konfigurowalność w CP Globals

### Dodano (ikony)

- Kontener Statamic `Icons` — 5093 pliki SVG Tabler Icons w `public/assets/icons/`
- Kontener Statamic `Icons 2 (Hugeicons)` — 4497 pliki SVG Hugeicons w `public/assets/icons2/`

---

## 2026-05-30

### Dodano

- **Super Admin Toolbar**: instalacja addonu, publikacja assetów, potwierdzenie działania na froncie

### Naprawiono

- **Czcionki**: El Messiri → Syne (Google Fonts) — El Messiri nie obsługiwała polskich znaków
- **Migracja origin**: PL = origin, EN = lokalizacja (270 plików, `flip_origins.php`)
- **HOTFIX-12**: usunięto EN globals `setting.yaml` + `theme_settings.yaml` (dziedziczenie z PL)
- **HOTFIX-11**: wsparcie pól `group` w Magic Translator (`FieldClassifier`, `ContentExtractor`, `FieldDefinitionBuilder`)
- **HOTFIX-10**: resolving fieldset imports w Magic Translator (`normalizeFieldItems`)

### Dodano (tłumaczenia)

- Instalacja Magic Translator + konfiguracja DeepL — klucz API wymieniony, tłumaczenia contentu działają

---

## 2026-05-28

### Dodano

- **10 nowych locale**: `sv`, `no`, `nl`, `lv`, `it`, `fr`, `es`, `de`, `da`, `cs` — `resources/sites.yaml`, pliki kolekcji, pliki globals
- **Fallback 302** dla nowych locale → adres PL (`bootstrap/app.php` — `->withExceptions()` + `respond()` Laravel 13)
- **Language switcher**: frontendowy dropdown z natywnym `{{ locales }}`, dynamiczny

### Naprawiono

- Naprawa odwróconego `origin` w 8 plikach globals — pola PL edytowalne w CP
- Włączono natywny selektor `Add Link to Entry` w nawigacji Main
- Naprawa TypeError w navigation entries picker (`listable: false` na `content` w blueprintach)

---

## 2026-05-25

### Dodano

- **Projekt skalisty-orion**: świeży projekt Statamic + motyw Orion, `npm install`, `npm run build`
- **Multisite PL + EN**: `pl` pod `/`, `en` pod `/en/`

### Naprawiono

- Kompatybilność demo contentu z Statamic 6
- Naprawa blokowania scrolla przez popupy
- Ustawiono żółty branding jako domyślny kierunek wizualny
- Naprawa `localizable` behavior `page_builder`
- Naprawa hero image i powiązanych pól w builderze
- Usunięto problematyczne pola `type` w sekcji hero
