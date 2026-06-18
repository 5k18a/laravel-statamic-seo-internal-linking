# Archiwalny brief: Update-statamic-cms-6.20.2

**Data zamknięcia:** 2026-06-06
**Status:** ZAMKNIĘTE / DONE

---

## Cel

Zaktualizować `statamic/cms` z v6.20.0 do v6.20.2 i zweryfikować że patch HOTFIX-18 (`statamic-cms-locales-proc-open-fallback.patch`) zastosował się poprawnie.

## Wynik

- `statamic/cms` v6.20.0 → v6.20.2 ✅
- `guzzlehttp/guzzle` 7.10.5 → 7.11.0, `guzzlehttp/promises` 2.4.1 → 2.5.0, `guzzlehttp/psr7` 2.10.4 → 2.11.0
- Patch HOTFIX-18 nałożony przez `composer patches-relock` + `composer patches-repatch` ✅
- `php artisan test` → 2 passed ✅
- HTTP 200 PL + EN ✅

## Ważna uwaga operacyjna

Samo `composer update statamic/cms --with-dependencies` nie wystarczyło gdy patch był nowy w `composer.json` ale nieobecny w `patches.lock.json`. Wymagane: `composer patches-relock` + `composer patches-repatch`.
