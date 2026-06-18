# Migracja origin: PL = język bazowy, EN = lokalizacja ✅ ZAMKNIĘTY

Data: 2026-06-02
Status: ✅ Wykonane — 270 plików zmienionych, flip_origins.php uruchomiony i usunięty

## Problem

Demo-content Orion Theme był w języku angielskim. EN był originem, PL był lokalizacją — odwrotna logika. Magic Translator tłumaczył z EN→PL zamiast PL→EN.

## Fix

Skrypt `flip_origins.php` uruchomiony przez Codexa:
- 130 PL plików: usunięto `origin:` → PL stały się originami
- 130 EN plików: dodano `origin: <pl-uuid>` → EN stały się lokalizacjami
- 3 PL pages (`home.md`, `blog.md`, `author.md`): dodano `blueprint: page`

## Wynik

- 270 plików zmienionych (planowane ~260; nadwyżka 10 to EN pliki bez PL counterpart)
- `php artisan test` → 2 passed ✅
- Magic Translator tłumaczy PL→EN ✅
- `flip_origins.php` usunięty po potwierdzeniu działania

## Kolekcje objęte migracją

pages, blogs, faqs, galleries, job_positions, packages, projects, services, teams, testimonials
