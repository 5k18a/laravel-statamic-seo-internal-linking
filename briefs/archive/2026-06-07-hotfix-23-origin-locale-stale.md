# HOTFIX-23 — PL (origin) pokazuje bursztyn zamiast zieleni w MT sidebar

**Data:** 2026-06-07  
**Status:** ZAMKNIĘTE ✅  
**Wykonał:** Codex  
**Zatwierdził:** Claude  

## Problem

Patch #5 (`magic-translator-fieldtype-untranslated-stale.patch`) nie przekazywał `$originSite` do closure `map()` — przez co warunek `elseif (is_stale)` działał też dla locale origin (PL), które nigdy nie ma `magic_translator` metadata.

## Fix

1. Dodano `$originSite` do `use()` closure (linia 161)
2. Dodano guard `&& $siteHandle !== $originSite` do warunku (linia 194)
3. Patch wygenerowany ponownie jako `diff -u` od bazowego pliku pakietu

## Wynik

- PL (origin) = zielony ✓
- Inne locale bez tłumaczenia = bursztynowy ⚠
