# BRIEF_CODEX.md

<!-- PROJECT_SYNC_START -->
state_version: 2026-06-19-1930
active_task_id: BUGFIX-icon-box-center-icon
active_task_name: Wyśrodkowanie ikony w Icon Box With Text Section
active_task_status: active
active_task_source: BRIEF_CODEX.md
last_sync: 2026-06-19 19:30 Europe/Warsaw
last_synced_by: Claude
last_closed: SYNC-orientarium
next_after_active: Decyzja użytkownika — retłumaczenie Home EN lub Formularze kontaktowe
<!-- PROJECT_SYNC_END -->

---

## Status

AKTYWNE

## Cel zadania

Wyśrodkować ikonę w każdej karcie sekcji `Icon Box With Text Section` w page builderze. Tytuł i opis mają zostać wyrównane do lewej — wyśrodkowana jest wyłącznie ikona.

## Kontekst

Sekcja `icon_box_with_text_section` wyświetla siatkę kart (3 lub 4 kolumny). Każda karta ma ikonę Iconify na górze, tytuł i opis. Ikona renderuje się do lewej krawędzi karty przez brak `mx-auto` na jej kontenerze.

## Problem do rozwiązania

Kontener ikony (div z klasami `h-[38px] w-[38px]`) ma stałą szerokość 38px i nie ma `mx-auto` — nie jest wyśrodkowany poziomo w karcie.

## Analiza gotowych rozwiązań

### Czy zadanie dotyczy nowej większej funkcjonalności?

NIE

### Uzasadnienie pominięcia analizy

Kosmetyczna zmiana klasy Tailwind w istniejącym szablonie Antlers.

## Zakres pracy

Jeden plik, jedna linia.

## Pliki do zmiany

- `resources/views/page_builder/icon_box_with_text_section.antlers.html`

## Wymagania techniczne

W pliku `icon_box_with_text_section.antlers.html`, **linia 11**, div kontenera ikony:

```html
<div class="1xl:mb-[33px] xl:mb-7 sm:mb-5 mb-4 h-[38px] w-[38px] flex items-start text-primary-900 [&>svg]:w-full [&>svg]:h-full">
```

Dodać klasę `mx-auto`:

```html
<div class="1xl:mb-[33px] xl:mb-7 sm:mb-5 mb-4 h-[38px] w-[38px] mx-auto flex items-start text-primary-900 [&>svg]:w-full [&>svg]:h-full">
```

Nie zmieniać nic więcej — tytuł (`h5`) i opis (`p`) pozostają bez klas centrowania.

## Ograniczenia

- Nie centrować tytułu ani opisu.
- Nie zmieniać struktury HTML ani innych sekcji.
- Nie modyfikować fieldsetów ani blueprintów.

## Kryteria akceptacji

- [ ] Ikona jest wyśrodkowana poziomo w każdej karcie (weryfikacja wizualna na froncie)
- [ ] Tytuł i opis są nadal wyrównane do lewej
- [ ] Plik Antlers zmieniony wyłącznie w jednej linii (dodanie `mx-auto`)
- [ ] Brak regresji na pozostałych sekcjach strony

## Testowanie

- `php artisan view:clear`
- Otworzyć stronę z sekcją `Icon Box With Text Section` na froncie (np. strona główna)
- Sprawdzić wizualnie że ikona jest wyśrodkowana, tekst — z lewej
- `php artisan test` (2 passed)

Uwaga: `mx-auto` jest bazową klasą Tailwind — `npm run build` prawdopodobnie zbędny, ale jeśli ikona nadal jest z lewej po view:clear, uruchomić build.

## Synchronizacja dokumentacji

- [ ] `PROJECT_STATUS_CODEX.md` ma ten sam `active_task_id`
- [ ] `CLAUDE_MEMORY.md` ma ten sam `active_task_id`

## Informacje do zapisania w CODEX_SUGGESTIONS.md

Po zakończeniu:
- status wykonania
- czy `npm run build` był potrzebny
- wynik `php artisan test`

---

## Ostatnio zamknięte

- `SYNC-orientarium` ✅ zamknięty przez Claude (2026-06-19)
- `FEATURE-blueprint-details-defaults` ✅ zamknięty przez Claude (2026-06-19)
- `UPDATE-statamic-6.21.0` ✅ zamknięty przez Claude (2026-06-19)
- `UPDATE-statamic-6.20.3-deploy` ✅ zamknięty przez Claude (2026-06-19)
- `SYNC-and-deploy-completion-year` ✅ zamknięty przez Claude (2026-06-19)
- `FEATURE-completion-year-sort` ✅ accepted (2026-06-19)
- `BUGFIX-sticky-header-default` ✅ accepted (2026-06-18)
- `BUGFIX-slider-seamless-loop` ✅ accepted (2026-06-18)
- `FEATURE-logos-slider-with-icons` ✅ accepted (2026-06-18)

## Następne po aktywnym

- Decyzja użytkownika: retłumaczenie Home EN lub Formularze kontaktowe
