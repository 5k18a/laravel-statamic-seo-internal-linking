# HOTFIX-19: lang-panel-animation

**Status: ZAMKNIĘTE (2026-06-07)**
**Implementacja: Codex**
**Weryfikacja: Claude**

## Problem

Mobilny panel języków (`#lang-mobile-panel`) otwierał się bez animacji (momentalnie), podczas gdy panel nawigacji (`#navbar-default`) ma animację zjazdu z góry (`scale-y-0 → scale-y-100`).

Zamykanie panelu języków też nie miało animacji — `hidden` było dodawane synchronicznie po `remove("open")`.

## Root cause

`#lang-mobile-panel` startuje z klasą `hidden` (`display:none`). Synchroniczne:
1. `remove("hidden")` — element staje się widoczny
2. `add("open")` — w tej samej operacji JS

Przeglądarka batchuje obie zmiany i nie widzi przejścia `scale-y-0 → scale-y-100`.

## Rozwiązanie

**Otwieranie:** `void langPanel.offsetHeight` (wymuszone reflow) między `remove("hidden")` a `add("open", "block")`.

**Zamykanie:** `transitionend { once: true }` — `hidden` dodawane dopiero po zakończeniu CSS transition.

## Zmiany

Plik: `skalisty-orion/public/assets/js/custom.js`

```js
const openLangPanel = () => {
  // ...
  langPanel.classList.remove("hidden");
  void langPanel.offsetHeight;   // ← HOTFIX-19
  langPanel.classList.add("open", "block");
  // ...
};

const closeLangPanel = () => {
  if (!langPanel) return;
  langPanel.classList.remove("open");
  if (langArrow) langArrow.style.transform = "";
  langPanel.addEventListener("transitionend", () => {   // ← HOTFIX-19
    langPanel.classList.remove("block");
    langPanel.classList.add("hidden");
  }, { once: true });
};
```

## Testy

- `php artisan test` → 2 passed ✅
- HTTP 200 `/` i `/en/` ✅
