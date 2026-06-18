# Brief archiwum: BUGFIX-cp-collection-listing-stub-filter

**Data aktywacji:** 2026-06-08
**Data zamknięcia:** 2026-06-08
**Status końcowy:** ✅ Wykonane (Codex)

## Cel zadania

Ukryć wpisy-stuby z listingu kolekcji w CP. Stub to plik locale stworzony przez `propagate: true` zawierający wyłącznie `origin:` — bez własnej treści, bez tłumaczenia.

## Problem

Po wdrożeniu BUGFIX-cp-collection-listing-site-filter listing poprawnie filtruje po wybranym locale. Jednak dla ES (i innych języków) nadal widoczne były wpisy które NIGDY nie były tłumaczone — zostały auto-stworzone przez `propagate: true`. W kolumnie site pokazywały "Español", ale de facto to puste stuby.

Przykład: `content/collections/faqs/es/testtest.md` — 4 linie, tylko `id`, `origin`, `blueprint`. Brak `title:`, brak `magic_translator`.

## Root cause

`propagate: true` w `content/collections/faqs.yaml` automatycznie tworzy plik locale (stub) przy każdym nowym wpisie PL. Stub ma własny UUID i locale ES, więc `where('site', 'es')` go zwraca. Nie ma jednak własnego `title:` w frontmatter — Stache indeksuje `null` dla tego pola.

## Analiza gotowych rozwiązań

NIE — jednolinijkowe rozszerzenie istniejącego override.

`whereNotNull('title')` w Statamic Stache query sprawdza surowe dane z indeksu pliku (nie augmentowane/dziedziczone). Dla stubów Stache indeksuje `null` dla `title`. Dla przetłumaczonych wpisów i wpisów origin (PL) — wartość string. Metoda `filterWhereNotNull` w `Stache/Query/Builder.php` linia 193: `return $value !== null`. Bezpieczne i pewne.

## Zakres pracy (brief)

### Jedyna zmiana — `app/Http/Controllers/CP/Collections/EntriesController.php`

Aktualny plik (po BUGFIX-cp-collection-listing-site-filter):

```php
if (Site::multiEnabled()) {
    $query->where('site', Site::selected()->handle());
}
```

Zmienić na:

```php
if (Site::multiEnabled()) {
    $query->where('site', Site::selected()->handle())
          ->whereNotNull('title');
}
```

## Faktyczne wykonanie

Odchylenie od briefu: brief zakładał `whereNotNull('title')`, Codex użył `whereNotNull('data->title')` — technicznie słuszne, bo `title` w Statamic Stache query dziedziczy przez `origin` → stuby przechodziłyby filtr; `data->title` = surowy frontmatter (null dla stubów).

## Wyniki

- ES: 13 → 8 wpisów (5 stubów testtest/test2/test3/test5/test6 ukryte)
- PL: 22 wpisów (bez strat)
- DE: 0 wpisów
- `php artisan test`: 2 passed ✅

## Wdrożenie

Deploy 2026-06-08 (rsync SSH → dev.skalisty.pl) razem z BUGFIX-cp-site-switcher + BUGFIX-cp-collection-listing-site-filter.
