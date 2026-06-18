# HOTFIX-21 — Szerokość odtwarzacza YouTube na mobile

**Zamknięte:** 2026-06-07  
**Wykonane przez:** Codex  
**Zweryfikowane przez:** Claude

## Problem

Odtwarzacz YouTube w `our_story_section` był zbyt wąski na tabletach i telefonach (< 992px) — używał breakpointu `sm` (640px) zamiast `lg` (992px), przez co zakres 640–991px nadal miał 65vw.

## Zmiana

**Plik:** `resources/views/page_builder/our_story_section.antlers.html`, linia 45

```diff
- class="w-[90vw] sm:w-[65vw] aspect-video z-[50]"
+ class="w-[90vw] lg:w-[65vw] aspect-video z-[50]"
```

## Walidacja

- `npm run build` ✅
- `output.css` zawiera `65vw` w media query dla lg ✅
- Plik zweryfikowany przez Claude ✅
