# BRIEF_CODEX.md

<!-- PROJECT_SYNC_START -->
state_version: 2026-06-18-1800
active_task_id: FEATURE-logos-slider-with-icons
active_task_name: Logos Slider with Icons — nowy set Page Buildera
active_task_status: ready
active_task_source: BRIEF_CODEX.md
last_sync: 2026-06-18 18:00 Europe/Warsaw
last_synced_by: Claude
last_closed: AUDYT-2026-06-17-tasks
next_after_active: Decyzja użytkownika — retłumaczenie Home EN lub Formularze kontaktowe
<!-- PROJECT_SYNC_END -->

---

# AKTYWNY BRIEF: FEATURE-logos-slider-with-icons

## Cel

Stworzyć nowy set Page Buildera **Logos Slider with Icons** — wariant istniejącego `logos_slider`, w którym zamiast pola `assets` (obraz) używane jest pole `iconify` z `store_as: svg_data`.

Każdy element slidera będzie miał: **ikonę Iconify** + **nazwę/opis** (text). Slider zachowuje identyczną animację CSS co oryginał.

---

## Pliki do stworzenia

### 1. `resources/fieldsets/logos_slider_with_icons.yaml`

Wzorzec: `resources/fieldsets/logos_slider.yaml` — zmień tylko pole `image` na `icon`:

```yaml
title: 'Logos Slider with Icons'
fields:
  -
    handle: logos
    field:
      type: replicator
      display: 'Logos Slider Items'
      instructions: 'Add icons and their labels for the slider'
      sets:
        main:
          display: Main
          sets:
            logo_item:
              display: 'Logo Item'
              fields:
                -
                  handle: icon
                  field:
                    type: iconify
                    display: Icon
                    store_as: svg_data
                -
                  handle: name
                  field:
                    type: text
                    display: 'Name / Label'
                    validate:
                      - required
```

**Kluczowe różnice względem `logos_slider.yaml`:**
- Pole `image` (type: assets) zastąpione polem `icon` (type: iconify, store_as: svg_data)
- Pole `image` miało `validate: required` — pole `icon` **bez** required (ikona opcjonalna, żeby nie blokować zapisania)
- Pole `name` bez zmian

### 2. `resources/views/page_builder/logos_slider_with_icons.antlers.html`

Wzorzec: `resources/views/page_builder/logos_slider.antlers.html` — zmień rendering ikony.

Oryginał renderuje obraz tak:
```antlers
{{ image }}<img src="{{ url }}" class="logos" />{{ /image }}
```

Zamień na rendering ikony Iconify — wzorzec z `icon_box_with_text_section.antlers.html`:
```antlers
{{ if icon }}
  {{ iconify:icon class="logos" aria-hidden="true" }}
{{ /if }}
```

Pełny widok:

```antlers
<section class="2xl:mb-[100px] 1xl:mb-20 lg:mb-[70px] md:mb-[50px] mb-8 z-1">
  <div class="text-slider overflow-hidden">
    <div class="slider-track flex animate-slides items-center 1xl:gap-7 md:gap-5 gap-4 flex-nowrap shrink-0">
      <!-- original set -->
      {{ logos }}
      <div class="flex items-center 1xl:gap-7 md:gap-5 gap-4 flex-shrink-0">
        {{ if icon }}
          {{ iconify:icon class="logos" aria-hidden="true" }}
        {{ /if }}
        <h5 class="logo-name">{{ name }}</h5>
      </div>
      {{ /logos }}
    </div>
  </div>
</section>
```

**Uwaga:** klasa `logos` na SVG zachowuje te same style CSS co `<img class="logos" />` w oryginale — nie zmieniać.

### 3. `resources/fieldsets/all_page_builder.yaml`

Dodaj rejestrację nowego setu **bezpośrednio po** bloku `logos_slider`:

```yaml
            logos_slider_with_icons:
              display: 'Logos Slider with Icons'
              fields:
                -
                  import: logos_slider_with_icons
```

Wstaw po linii:
```yaml
                  import: logos_slider
```
(po całym bloku `logos_slider`, przed `image_with_text_section`)

---

## Czego NIE robić

- Nie modyfikować `logos_slider.yaml` ani `logos_slider.antlers.html` — oryginał pozostaje nienaruszony
- Nie dodawać `localizable: true` do fieldów — dziedziczone z `page_builder` replicatora w `all_page_builder.yaml`
- Nie dodawać `duplicate: false` — logos slider nie wymaga ograniczenia duplikatów
- Nie zmieniać klas CSS animacji slidera (`animate-slides`, `slider-track`, `text-slider`) — są globalne
- Nie używać `store_as: svg` — wymagane jest `store_as: svg_data` (addon Iconify v2.1.0)

---

## Walidacja po implementacji

```bash
php artisan statamic:stache:refresh
php artisan test
```

Następnie w CP (http://127.0.0.1:8001/cp):
1. Otwórz dowolną stronę z Page Builderem
2. Dodaj nowy blok → potwierdź że "Logos Slider with Icons" jest na liście
3. Dodaj 2–3 itemy z ikonami Iconify i nazwami
4. Wejdź na frontend — sprawdź że slider animuje się poprawnie i ikony SVG są widoczne

---

## Commit po zakończeniu

```
feat: Dodaj Logos Slider with Icons do page buildera

- resources/fieldsets/logos_slider_with_icons.yaml
- resources/views/page_builder/logos_slider_with_icons.antlers.html
- resources/fieldsets/all_page_builder.yaml (rejestracja setu)
```

---

## Ostatnio zamknięte

- `ICONIFY-prefix-extension` ✅ accepted (2026-06-17)
- `FEATURE-icon-box-with-text` ✅ accepted (2026-06-17)
- `ICONIFY-magic-translator-check` ✅ verified (2026-06-17)
- `FEATURE-iconify-install` ✅ accepted (2026-06-17)
- `AUDYT-2026-06-17-tasks` ✅ zamknięty przez Claude (2026-06-18)
- `SETUP-git-workflow` ✅ zamknięty przez Claude (2026-06-18)

## Następne po aktywnym

- Decyzja użytkownika: retłumaczenie Home EN lub Formularze kontaktowe
