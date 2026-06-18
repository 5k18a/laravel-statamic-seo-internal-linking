# wysiwyg-html-fieldtype — v1.0

**Data:** 2026-06-01  
**Projekt:** skalisty-orion (Laravel 13 + Statamic 6.20.0)  
**Ścieżka źródłowa:** `skalisty-orion/addons/skalisty/wysiwyg-html-fieldtype/`

---

## Co zawiera ta wersja

### Funkcjonalność

- **Tryb WYSIWYG** — edytor TipTap 3 z pełnym toolbarem
- **Tryb HTML** — edytor CodeMirror 5 (fallback do `<textarea>` gdy CodeMirror niedostępny)
- **Synchronizacja** — przełączanie między trybami bez utraty treści
- **Fullscreen** — tryb pełnoekranowy przez `<Teleport to="body">`
- **Toolbar WYSIWYG:**
  - B / I / U / S (bold, italic, underline, strikethrough)
  - Dropdown nagłówków: Normalny / H1–H6
  - UL / OL (listy)
  - 🔗 Link (wstawianie/edycja/usuwanie)
  - Wyrównanie: ← ↔ → (left/center/right)
  - ❝ Blockquote / `` ` `` Kod inline / ─ Linia pozioma
  - 🖼 Wstaw obraz przez URL (window.prompt)
  - 📁 Biblioteka mediów (natywny asset-browser Statamic)
  - ↩ / ↪ Undo/Redo
- **BubbleMenu przy obrazkach** — pojawia się po kliknięciu obrazka:
  - ⬅ Wyrównaj do lewej / ⬛ Wyśrodkuj / ➡ Wyrównaj do prawej
  - ✏ Edytuj URL / ✕ Usuń
- **Zaznaczanie obrazka** — niebieski outline przy selekcji, cursor pointer
- **Biblioteka mediów** — modal z natywnym `asset-browser` Statamic (teleportowany)
- **Obsługa kontenera assets** — konfigurowalny przez `configFieldItems()`, domyślnie `assets`

### Integracja ze Statamic

- **Fieldtype handle:** `wysiwyg_html`
- **Rejestracja komponentu:** `Statamic.component('wysiwyg_html-fieldtype', ...)`
- **Build format:** IIFE (wymagany dla Statamic CP), Vue externalizowane do `window.Vue`
- **`preload()`** — przekazuje dane kontenera assets jako prop `meta` do Vue
- **`augment()`** — zwraca `HtmlString` (safe rendering w Antlers)
- **Zapis treści:** `emit('update:value', value)` — wymagane w Statamic 6 CP

### Znane ograniczenia / uwagi techniczne

- `asset-browser` wymaga `:selected-path="''"` — prop bez defaultu crashuje w `immediate` watcher
- Dropdown ⋯ w asset-browserze wymaga non-scoped CSS: `body:has(.wysiwyg-asset-overlay) [data-reka-popper-content-wrapper] { z-index: 10001 }` — reka-ui portal renderuje do body z z-index: auto (niższy niż overlay)
- `max-w-none` Tailwind nie istnieje w skompilowanym CSS Statamic CP — override `prose { max-width: 65ch }` przez scoped CSS: `.wysiwyg-html-content { max-width: none }`
- Import BubbleMenu: `@tiptap/vue-3/menus` (subpath), nie `@tiptap/vue-3`
- BubbleMenu używa `@floating-ui/dom`, nie tippy.js — prop `options`, nie `tippyOptions`

---

## Jak uruchomić

```bash
# Zainstalować zależności (po skopiowaniu do nowej lokalizacji)
cd wysiwyg-html-fieldtype-v1.0
npm install

# Zbudować addon
npm run build
```

Skompilowany plik: `resources/dist/addon.js` (już zawarty w tym archiwum).

---

## Pliki

| Plik | Rola |
|------|------|
| `src/ServiceProvider.php` | Rejestracja fieldtype w Statamic |
| `src/Fieldtypes/WysiwygHtml.php` | PHP fieldtype: augment, preload, configFieldItems |
| `resources/js/addon.js` | Entry point IIFE — rejestruje komponent Vue |
| `resources/js/components/fieldtypes/WysiwygHtml.vue` | Główny komponent Vue (TipTap + CodeMirror) |
| `resources/dist/addon.js` | **Skompilowany bundle** — ten plik ładuje Statamic CP |
| `composer.json` | Metadata paczki Composer |
| `package.json` | Zależności npm |
| `vite.config.js` | Konfiguracja buildu (IIFE, Vue external) |
| `CHANGELOG_FULL.md` | Pełny dziennik zmian z całego procesu |
| `ROADMAP_FULL.md` | Roadmapa i planowane funkcje |
