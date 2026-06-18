# HOTFIX-20: lang-panel-collision

**Status: ZAMKNIĘTE (2026-06-07)**
**Implementacja: Codex**
**Weryfikacja: Claude + potwierdzenie użytkownika**

## Problem

Kolizja między `#navbar-default` a `#lang-mobile-panel` w trybie mobilnym (Firefox).

1. Nav → Lang: otwarcie hamburger-menu nav, a potem panel języków → panel języków natychmiast znikał. Overlay pozostawał widoczny.
2. Lang → Nav → Lang: po przejściu przez nav panel języków nie otwierał się poprawnie (brak animacji lub nie reagował).

## Root cause

`closeLangPanel()` dodawała `transitionend { once: true }` listener bezwarunkowo — nawet gdy panel był ukryty (`display:none`). Sierota wisiała na elemencie i odpaliła się przy następnym `openLangPanel()` zaraz po CSS transition `scale-y-0→scale-y-100`, chowając panel z powrotem.

Drugi bug pochodny: `open` class zostawała na elemencie po bugu, więc kolejny `openLangPanel()` startował od `scale-y-100` — brak animacji wejścia.

## Rozwiązanie

### Fix 1: `closeLangPanel` — guard

```js
const closeLangPanel = () => {
  if (!langPanel) return;
  if (
    !langPanel.classList.contains("open") ||
    langPanel.classList.contains("hidden")
  ) {
    langPanel.classList.remove("open");
    if (langArrow) langArrow.style.transform = "";
    return;
  }
  langPanel.classList.remove("open");
  if (langArrow) langArrow.style.transform = "";
  langPanel.addEventListener("transitionend", () => {
    langPanel.classList.remove("block");
    langPanel.classList.add("hidden");
  }, { once: true });
};
```

### Fix 2: `openLangPanel` — reset `open` przed reflow

```js
langPanel.classList.remove("hidden", "open");  // reset stanu
langPanel.classList.add("block");              // widoczny, scale-y-0
void langPanel.offsetHeight;                   // reflow
langPanel.classList.add("open");              // transition
```

## Plik

`skalisty-orion/public/assets/js/custom.js` — tylko funkcje `openLangPanel` i `closeLangPanel`

## Testy

- `php artisan test` → 2 passed ✅
- UX: użytkownik potwierdził działanie ✅
