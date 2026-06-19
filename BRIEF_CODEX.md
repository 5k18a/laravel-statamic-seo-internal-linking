# BRIEF_CODEX.md

<!-- PROJECT_SYNC_START -->
state_version: 2026-06-19-2100
active_task_id: FEATURE-services-icon-iconify
active_task_name: Zmiana pola icon w kolekcji services — assets → Iconify
active_task_status: active
active_task_source: BRIEF_CODEX.md
last_sync: 2026-06-19 21:00 Europe/Warsaw
last_synced_by: Claude
last_closed: BUGFIX-icon-box-center-icon
next_after_active: Decyzja użytkownika
<!-- PROJECT_SYNC_END -->

---

## Status

AKTYWNE

## Cel zadania

Zmienić pole `icon` w blueprincie kolekcji `services` z `type: assets` na `type: iconify` (`store_as: svg_data`), a następnie zaktualizować wszystkie miejsca renderowania tej ikony w `service_section.antlers.html`, żeby używały tagu `{{ iconify:icon }}` zamiast pętli `{{ icon }}{{ url }}{{ /icon }}` na `<img>`.

## Kontekst

Plugin Iconify (`eminos/statamic-iconify` v2.1.0) jest już zainstalowany i skonfigurowany w projekcie. Fieldtype `iconify` z `store_as: svg_data` przechowuje surowy SVG w YAML contentowym, bez potrzeby zewnętrznych wywołań API. Jest już używany w `icon_box_with_text_section` — tamten szablon to wzorzec do naśladowania.

Pole `icon` w blueprincie `service.yaml` aktualnie używa `type: assets` (selektor pliku PNG/SVG z managera assetów). Chcemy zastąpić to polem `type: iconify`, żeby redaktorzy mogli wybierać ikony z bibliotek ikonowych (tabler, heroicons, mdi, ph itd.) bezpośrednio w CP.

**Ważne:** Istniejące wartości pola `icon` w wpisach serwisów (np. `icon: images/faq-1.png`) stają się niekompatybilne po zmianie fieldtype — to oczekiwane zachowanie, zaakceptowane przez użytkownika. Redaktorzy wybiorą nowe ikony w CP po wdrożeniu.

## Pliki do zmiany

1. `resources/blueprints/collections/services/service.yaml`
2. `resources/views/page_builder/service_section.antlers.html`

**Nie zmieniać niczego innego.** Inne szablony z `{{ icon }}` (`what_we_do_section`, `why_choose_us_section`, `work_with_us`, `feature_image_with_points`) mają własne pola `icon` w swoich fieldsetach — nie są powiązane z kolekcją services.

## Wymagania techniczne

### 1. Blueprint `service.yaml`

Plik: `resources/blueprints/collections/services/service.yaml`

Zmienić pole `icon` (aktualny stan):

```yaml
          -
            handle: icon
            field:
              max_files: 1
              min_files: 1
              container: assets
              type: assets
              display: icon
```

Na:

```yaml
          -
            handle: icon
            field:
              type: iconify
              store_as: svg_data
              display: Icon
```

### 2. Template `service_section.antlers.html`

Plik: `resources/views/page_builder/service_section.antlers.html`

Są **5 miejsc** gdzie ikona serwisu jest renderowana. Każde wymaga zamiany wzorca `<img>` (lub `{{ icon }}..{{ /icon }}`) na wrapper `<span>` z tagiem `{{ iconify:icon }}`.

**Wzorzec zamiany:**
- Rozmiar przenosi się z klas na `<img>` na klasy wrappera `<span>`
- Marginesy `mb-*` (jeśli były na `<img>`) przenoszą się na `<span>`
- Do wrappera dodajemy `block [&>svg]:w-full [&>svg]:h-full text-primary-900`
- Wewnątrz: `{{ iconify:icon class="w-full h-full" aria-hidden="true" }}`

**Precedens w projekcie:** `icon_box_with_text_section.antlers.html` linia 11–13:
```html
<div class="... h-[38px] w-[38px] mx-auto flex items-start text-primary-900 [&>svg]:w-full [&>svg]:h-full">
  {{ iconify:icon class="w-full h-full" aria-hidden="true" }}
</div>
```

---

#### Zmiana 1 — linia 24 (show_type == 'home-page-one', accordion)

**Stary kod:**
```html
              {{ icon }}<img src="{{ url }}" alt="faq-1" class="2xl:w-[60px] 2xl:h-[60px] xl:w-[50px] xl:h-[50px] sm:w-10 sm:h-10 w-[30px] h-[30px] flex-shrink-0" loading="lazy" /> {{ /icon }}
```

**Nowy kod:**
```html
              <span class="2xl:w-[60px] 2xl:h-[60px] xl:w-[50px] xl:h-[50px] sm:w-10 sm:h-10 w-[30px] h-[30px] flex-shrink-0 block [&>svg]:w-full [&>svg]:h-full text-primary-900">{{ iconify:icon class="w-full h-full" aria-hidden="true" }}</span>
```

---

#### Zmiana 2 — linia 152–153 (show_type == 'home-page-three', karty)

**Stary kod:**
```html
                <img src="{{ icon }} {{ url }} {{ /icon }}" alt="Building"
                  class="2xl:mb-9 xl:mb-7 md:mb-5 mb-4 1xl:w-21 1xl:h-21 xl:w-19 xl:h-19 md:w-15 md:h-15 sm:w-[64px] sm:h-[64px] w-[60px] h-[60px]" />
```

**Nowy kod:**
```html
                <span class="2xl:mb-9 xl:mb-7 md:mb-5 mb-4 1xl:w-21 1xl:h-21 xl:w-19 xl:h-19 md:w-15 md:h-15 sm:w-[64px] sm:h-[64px] w-[60px] h-[60px] block [&>svg]:w-full [&>svg]:h-full text-primary-900">{{ iconify:icon class="w-full h-full" aria-hidden="true" }}</span>
```

---

#### Zmiana 3 — linia 195–196 (show_type == 'home-page-four', karty)

**Stary kod:**
```html
        <img src="{{ icon }} {{ url }} {{ /icon }}" alt="Building"
        class="2xl:mb-9 xl:mb-7 md:mb-5 mb-4 2xl:w-21 2xl:h-21 xl:w-18 xl:h-18 md:w-17 md:h-17 sm:w-[64px] sm:h-[64px] w-[60px] h-[60px]" />
```

**Nowy kod:**
```html
        <span class="2xl:mb-9 xl:mb-7 md:mb-5 mb-4 2xl:w-21 2xl:h-21 xl:w-18 xl:h-18 md:w-17 md:h-17 sm:w-[64px] sm:h-[64px] w-[60px] h-[60px] block [&>svg]:w-full [&>svg]:h-full text-primary-900">{{ iconify:icon class="w-full h-full" aria-hidden="true" }}</span>
```

---

#### Zmiana 4 — linia 232 (show_type == 'service-page-one', accordion)

**Stary kod:**
```html
            <img src="{{ icon }} {{ url }} {{ /icon }}" alt="{{ title }}" class="2xl:w-[60px] 2xl:h-[60px] xl:w-[50px] xl:h-[50px] sm:w-10 sm:h-10 w-[30px] h-[30px] flex-shrink-0" loading="lazy" />
```

**Nowy kod:**
```html
            <span class="2xl:w-[60px] 2xl:h-[60px] xl:w-[50px] xl:h-[50px] sm:w-10 sm:h-10 w-[30px] h-[30px] flex-shrink-0 block [&>svg]:w-full [&>svg]:h-full text-primary-900">{{ iconify:icon class="w-full h-full" aria-hidden="true" }}</span>
```

---

#### Zmiana 5 — linia 356–357 (show_type == 'service-page-three', karty)

**Stary kod:**
```html
      <img src="{{ icon }} {{ url }} {{/icon }}" alt="Building"
      class="2xl:mb-9 xl:mb-7 md:mb-5 mb-4 1xl:w-21 1xl:h-21 xl:w-19 xl:h-19 md:w-17 md:h-17 w-[60px] h-[60px]" />
```

**Nowy kod:**
```html
      <span class="2xl:mb-9 xl:mb-7 md:mb-5 mb-4 1xl:w-21 1xl:h-21 xl:w-19 xl:h-19 md:w-17 md:h-17 w-[60px] h-[60px] block [&>svg]:w-full [&>svg]:h-full text-primary-900">{{ iconify:icon class="w-full h-full" aria-hidden="true" }}</span>
```

---

## Ograniczenia

- NIE zmieniać blueprintów ani szablonów innych sekcji.
- NIE zmieniać pola `image` w `service.yaml` — zostaje `type: assets`.
- NIE deployować na serwer — deploy osobno po akceptacji przez Claude.
- NIE commitować (AGENTS.md 22.2).
- NIE modyfikować istniejących wpisów w `content/collections/services/` — stare wartości pola `icon` będą stale, ale to oczekiwane.

## Kolejność działań

1. Edytuj `service.yaml` — podmień pole `icon`
2. Edytuj `service_section.antlers.html` — 5 podmian (każda z osobna, żeby uniknąć błędów)
3. `php artisan view:clear`
4. `npm run build` — wymagany, nowe klasy Tailwind na wrapperzach `<span>` mogą nie być w `output.css`
5. `php artisan statamic:stache:refresh`
6. `php artisan test` (oczekiwane: 2 passed)
7. Smoke test HTTP: `GET /` → 200, `GET /en/` → 200

## Kryteria akceptacji

- [ ] `service.yaml`: pole `icon` ma `type: iconify` i `store_as: svg_data`; pole `image` niezmienione
- [ ] `service_section.antlers.html`: 5 podmian wykonanych — brak `{{ icon }}{{ url }}{{ /icon }}` i brak `<img src="{{ icon }}...{{ /icon }}">`
- [ ] `php artisan test` → 2 passed
- [ ] `GET /` → 200, `GET /en/` → 200
- [ ] `npm run build` zakończony bez błędów
- [ ] Żadna inna sekcja strony nie naruszona (brak zmian w innych plikach)

## Testowanie (po stronie Codexa)

```bash
# Weryfikacja blueprintu
grep -A5 "handle: icon" resources/blueprints/collections/services/service.yaml

# Weryfikacja braku starego wzorca w szablonie
grep "icon }}{{ url }}\|icon }} {{ url }}" resources/views/page_builder/service_section.antlers.html
# → brak wyników = OK

# Weryfikacja nowego wzorca (5 wystąpień)
grep -c "iconify:icon" resources/views/page_builder/service_section.antlers.html
# → 5

# Build i testy
php artisan view:clear
npm run build
php artisan statamic:stache:refresh
php artisan test
```

## Synchronizacja dokumentacji

Po zakończeniu zapisz w `CODEX_SUGGESTIONS.md` sekcja `ACTIVE_FOR_CLAUDE_REVIEW`:
- lista zmienionych plików
- czy `npm run build` był potrzebny (tak/nie)
- wynik `php artisan test`
- ewentualne odchylenia od briefu

**Nie aktualizować** `PROJECT_STATUS_CODEX.md` ani `CLAUDE_MEMORY.md` — to robi Claude po audycie.

---

## Ostatnio zamknięte

- `BUGFIX-icon-box-center-icon` ✅ zamknięty przez Claude (2026-06-19)
- `SYNC-orientarium` ✅ zamknięty przez Claude (2026-06-19)
- `FEATURE-blueprint-details-defaults` ✅ zamknięty przez Claude (2026-06-19)
- `UPDATE-statamic-6.21.0` ✅ zamknięty przez Claude (2026-06-19)
- `FEATURE-completion-year-sort` ✅ accepted (2026-06-19)
- `BUGFIX-sticky-header-default` ✅ accepted (2026-06-18)
- `BUGFIX-slider-seamless-loop` ✅ accepted (2026-06-18)
- `FEATURE-logos-slider-with-icons` ✅ accepted (2026-06-18)

## Następne po aktywnym

- Decyzja użytkownika
