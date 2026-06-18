# wysiwyg-html-fieldtype — v1.1

**Data:** 2026-06-02  
**Projekt:** skalisty-orion (Laravel 13 + Statamic 6)  
**Ścieżka źródłowa:** `skalisty-orion/addons/skalisty/wysiwyg-html-fieldtype/`

---

## Różnice względem v1.0

### Kod addonu (PHP + Vue + dist)

**Bez zmian.** Kod samego pakietu Composer (`src/`, `resources/`, `composer.json`) jest identyczny z v1.0.

### ROADMAP.md

Dodano opisy planowanych etapów v2.0:
- **Etap 6** — Układ kolumnowy (zaimplementowany w projekcie jako osobny blok `columns_section`)
- **Etap 7** — Rozbudowane tło sekcji (kolor z offsetem + obraz z pozycją)

---

## Co zostało zaimplementowane w projekcie (poza addonem)

Poniższe zmiany dotyczą plików projektu `skalisty-orion`, nie samego pakietu:

### `resources/fieldsets/free_text_section.yaml`
- Pole `content` zmienione z `bard` → `wysiwyg_html`
- Dodany `layout_mode` (single / columns)
- Przy `columns`: replicator z polami `wysiwyg_html` (2/3/4 kolumny)
- Nowa opcja `width: full_no_padding`

### Nowe bloki page buildera
- `resources/fieldsets/wysiwyg_html_block.yaml` + widok — samodzielny blok WYSIWYG
- `resources/fieldsets/columns_section.yaml` + widok — sekcja wielokolumnowa (Etap 6 z roadmapy)

---

## Co zawiera v1.0 (bez zmian w v1.1)

### Funkcjonalność addonu

- **Tryb WYSIWYG** — edytor TipTap 3 z pełnym toolbarem
- **Tryb HTML** — edytor CodeMirror 5 (fallback do `<textarea>`)
- **Synchronizacja** — przełączanie między trybami bez utraty treści
- **Fullscreen** — tryb pełnoekranowy przez `<Teleport to="body">`
- **Toolbar WYSIWYG:**
  - B / I / U / S (bold, italic, underline, strikethrough)
  - Dropdown nagłówków: Normalny / H1–H6
  - UL / OL (listy)
  - 🔗 Link
  - Wyrównanie: ← ↔ →
  - ❝ Blockquote / `` ` `` Kod inline / ─ Linia pozioma
  - 🖼 Wstaw obraz przez URL
  - 📁 Biblioteka mediów (natywny asset-browser Statamic)
  - ↩ / ↪ Undo/Redo
- **BubbleMenu przy obrazkach** — wyrównanie, edycja URL, usuwanie
- **Zaznaczanie obrazka** — niebieski outline, cursor pointer
- **Biblioteka mediów** — modal z `asset-browser` Statamic
- **Obsługa kontenera assets** — konfigurowalny przez `configFieldItems()`

### Integracja ze Statamic

- **Fieldtype handle:** `wysiwyg_html`
- **Build format:** IIFE, Vue externalizowane do `window.Vue`
- **`preload()`** — przekazuje kontener assets do Vue
- **`augment()`** — zwraca `HtmlString`
- **Zapis:** `emit('update:value', value)`

---

## Plany na v2.0

- **Etap 7** — Rozbudowane tło sekcji (kolor z offsetem + obraz z pozycją)
- **Etap 5** — Pakowanie jako standalone addon (README, Packagist)
