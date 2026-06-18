# BRIEF: Mobile-language-switcher-v2

**Status:** ZAMKNIĘTY ✅ (zaakceptowany przez Claude 2026-06-06)
**Wykonał:** Codex (2026-06-06)

---

## Cel

Poprawić mobilny switcher języków:
- Przycisk switcher zawsze widoczny (desktop + mobile)
- Desktop (≥ 992px): kliknięcie otwiera istniejący `<details>` dropdown — bez zmian
- Mobile (< 992px): kliknięcie otwiera `#lang-mobile-panel` (`.mobile-nav` CSS) — pełnoekranowy panel z listą języków

## Zmienione pliki

- `resources/views/partials/header-1.antlers.html`
- `public/assets/js/custom.js`

## Co zostało zrobione

1. **Main brief** — cofnięto poprzednią implementację (lista locale w `#navbar-default`); dodano `#lang-mobile-panel.mobile-nav`; button wrapper przywrócony do `flex`
2. **Emoji flags** — flagi emoji per locale (pl/en/sv/nb/nl/lv/it/fr/es/de/da/cs); spójne z `language-switcher.antlers.html`
3. **Hotfix desktop/scroll** — `hidden lg:hidden` na panelu; `h-full overflow-y-auto overscroll-contain` w kontenerze; `langDetails.open = false` przy otwieraniu
4. **Hotfix viewport height** — `syncMobilePanelViewport()` oblicza dostępną wysokość od top panelu

## Kluczowe decyzje

- `locale:short` zwraca pierwszy człon PHP locale (`nb_NO` → `nb`), nie site handle (`no`) — check `"nb"` poprawny
- Reużyto `.mobile-nav` CSS bez zmian w `tailwind.css`
- `lg:hidden` jako belt-and-suspenders na desktop; `hidden` zarządzany przez JS
