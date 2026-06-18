# CHANGELOG — addon `wysiwyg-html-fieldtype`

Format: `[Etap X — opis] YYYY-MM-DD`

---

## Nieukończone / w toku

Brak aktywnych wpisów.

---

## Historia

### Etap 0 — Decyzja i projektowanie `2026-06-01`

- Zdiagnozowano brak natywnego WYSIWYG↔HTML toggle w Statamic 6 Bard
- Potwierdzono że przycisk `source` nie istnieje w `buttons.js` Statamic 6
- Przeprowadzono research: brak gotowego marketplace addonu dla tej funkcji
- Sprawdzono stos techniczny: Statamic 6 używa TipTap 3 + CodeMirror 5
- Podjęto decyzję o budowie własnego fieldtype addonu
- Zdefiniowano architekturę: jedno pole HTML string, dwa widoki (TipTap + CodeMirror), synchronizacja przez `getHTML()` / `setContent()`
- Przygotowano roadmapę 5 etapów
- Wymaganie: addon ma być standalone Composer package, reużywalny w innych projektach
