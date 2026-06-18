# Brief archiwum: FEATURE-iconify-install

**Data aktywacji:** 2026-06-17 17:45
**Data zamknięcia:** 2026-06-17 17:55
**Status końcowy:** ✅ Wykonane (Codex) + accepted (Claude) z 2 drobnymi korektami technicznymi

## Cel zadania

Zainstalować i wstępnie skonfigurować addon `eminos/statamic-iconify` v2.1.0 (MIT, natywny `statamic/cms: ^6.0`) tak, aby fieldtype `iconify` był dostępny do użycia w blueprintach. Bez modyfikowania istniejących blueprintów — wdrożenie pola w konkretnych miejscach to osobne zadanie po decyzji użytkownika.

## Zakres pracy (7 kroków)

1. `composer require eminos/statamic-iconify`
2. `php artisan vendor:publish --tag=statamic-iconify-config`
3. Edycja `config/statamic-iconify.php`: `allowed_prefixes` (tabler, heroicons, mdi, ph, fa6-solid, fa6-brands, lucide) + `default_store_as: 'svg'`
4. `optimize:clear`, `stache:refresh`, `view:clear`
5. Walidacja rejestracji fieldtype
6. `php artisan test` + HTTP smoke
7. CP sanity (`/cp/utilities`)

## Faktyczne wykonanie (Codex)

Wszystkie 7 kroków wykonane.

**Korekty techniczne (Codex)**:

1. **`default_store_as: 'svg'` → `'svg_data'`** — brief miał błąd, vendor `vendor/eminos/statamic-iconify/src/Fieldtypes/IconifyFieldtype.php` line 84 pokazuje że addon używa wartości `svg_data`, nie `svg`. Intencja briefu (offline render, zero API calls) zachowana z poprawną wartością.
2. **`Statamic\Facades\Fieldtype::all()` z briefu nie istnieje w Statamic 6** — Codex użył poprawnego `FieldtypeRepository::handles()`, otrzymał `["icon", "iconify"]`.

## Wyniki

- `composer show eminos/statamic-iconify` → v2.1.0 MIT
- `composer.json` → `eminos/statamic-iconify: ^2.1`
- `config/statamic-iconify.php`:
  - `allowed_prefixes`: 7 setów
  - `default_store_as`: `svg_data`
  - `allowed_categories`, `allowed_licenses`: `[]`
- Assety CP opublikowane: `public/vendor/statamic-iconify/build/`
- `Statamic::find('iconify')::class` → `StatamicIconify\Fieldtypes\IconifyFieldtype`
- `/cp/iconify/config` jako admin → 200 (JSON z prawidłowymi wartościami)
- `php artisan test` → 2 passed
- HTTP `/`, `/en/`: 200, 200
- `/cp/login`: 302
- Brak modyfikacji blueprintów/fieldsetów (zweryfikowane grepem `iconify`)

## Audyt Claude (2026-06-17 17:55)

Decyzja: **accepted**

Weryfikacja niezależna potwierdziła wszystkie kryteria akceptacji + obie korekty techniczne Codex (vendor sprawdzony — `svg_data` faktycznie poprawna wartość).

## Następne (decyzja użytkownika)

Wdrożenie pola `iconify` do pierwszych blueprintów. Sugerowane miejsca:

- `confidence_section` (3 boxy „why us" — naturalnie z ikonami)
- `our_story_section` (sekcja about — ikony branżowe)
- `footer` (social media — `fa6-brands`)
- `navigation` (mobile menu)
- `services` (kolekcje ofertowe)

**WAŻNE dla kolejnego briefu**: w polach blueprintu używać `store_as: svg_data` (nie `svg`).

## Wzorzec instalacji addonu Statamic 6 z natywnym wsparciem

Ten brief jest wzorcem dla przyszłych instalacji addonów Statamic 6, które mają natywne `^6.0` w composer.json — bez konieczności forka/bumpa/patcha:

1. `composer require <vendor>/<package>`
2. `vendor:publish --tag=<config-tag>`
3. Edycja configu (zawężenie scope per use case)
4. `optimize:clear` + `stache:refresh`
5. Walidacja przez `FieldtypeRepository::handles()` (poprawny endpoint Statamic 6) + tinker
6. `artisan test` + HTTP smoke
7. CP sanity — brak regresji innych utility/funkcji

W odróżnieniu od wzorca z `mariohamann/statamic-figma-assets` (constraint `^5.0` → fork z bumpem `^5.0|^6.0`), Iconify pasuje od ręki.
