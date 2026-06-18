# ROADMAP — addon `wysiwyg-html-fieldtype`

## Informacje ogólne

| Klucz | Wartość |
|---|---|
| Nazwa robocza | `wysiwyg-html-fieldtype` |
| Docelowa nazwa pakietu | `skalisty/wysiwyg-html-fieldtype` (do ustalenia) |
| Typ | Statamic 6 addon — custom fieldtype |
| Stack | Laravel 13, Statamic 6, TipTap 3, CodeMirror 5, Vue 3 |
| Lokalizacja w projekcie | `skalisty-orion/addons/wysiwyg-html/` |
| Projekt macierzysty | `skalisty-orion` (`/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion`) |

## Cel addonu

Fieldtype dla Statamic 6 umożliwiający przełączanie się między edytorem WYSIWYG (TipTap) a edytorem kodu HTML (CodeMirror) w obrębie jednego pola. Oba widoki operują na tych samych danych — treść jest synchronizowana przy każdym przełączeniu trybu.

Addon ma być wyodrębniany jako samodzielny pakiet Composer i instalowany w innych projektach Laravel/Statamic bez modyfikacji.

---

## Etapy

### Etap 1 — Struktura addonu

**Status:** `DONE` ✅ `2026-06-01`

- [x] Wygenerowanie boilerplate przez `php please make:addon skalisty/wysiwyg-html-fieldtype`
- [x] Wygenerowanie fieldtype `WysiwygHtml`
- [x] Weryfikacja struktury katalogów — zgodna z planem
- [x] Skopiowanie ROADMAP.md i CHANGELOG.md do `addons/skalisty/wysiwyg-html-fieldtype/`
- [x] Potwierdzenie że addon ładuje się bez błędów
- [x] Fieldtype `wysiwyg_html` widoczny w runtime Statamic

**Rzeczywisty namespace:** `Skalisty\WysiwygHtmlFieldtype` (nie `Skalisty\WysiwygHtml`)
**Lokalizacja:** `addons/skalisty/wysiwyg-html-fieldtype/` (nie `addons/wysiwyg-html/`)

---

### Etap 2 — PHP Fieldtype

**Status:** `TODO`

- [ ] Klasa `WysiwygHtml` extends `Fieldtype`
- [ ] `augment()` zwraca `HtmlString`
- [ ] `preProcess()` i `process()` obsługują string HTML
- [ ] `configFieldItems()` — opcje konfigurowalne: `buttons`, `container`, `placeholder`
- [ ] Rejestracja fieldtype w `ServiceProvider`
- [ ] Testy jednostkowe PHP (opcjonalne na tym etapie)

---

### Etap 3 — Vue Component (WYSIWYG + Source Toggle)

**Status:** `TODO`

- [ ] Podstawowy komponent `WysiwygHtmlFieldtype.vue`
- [ ] TipTap 3 instance z `@tiptap/starter-kit`
- [ ] Konfigurowalne przyciski toolbara (odpowiedź na `buttons` z PHP config)
- [ ] CodeMirror 5 mode (`window.CodeMirror` dostępny w Statamic CP) dla widoku HTML
- [ ] Przycisk toggle WYSIWYG ↔ HTML w toolbarze
- [ ] Synchronizacja przy przełączeniu: `editor.getHTML()` → CodeMirror i vice versa
- [ ] Integracja z Statamic asset browser (przycisk image → picker assets)
- [ ] Emitowanie `input` event przy każdej zmianie
- [ ] Obsługa `read-only` mode

---

### Etap 4 — Integracja z Free Text Section

**Status:** `TODO`

- [ ] Podmiana pól `content` (bard) + `editor_mode` + `html_content` na jedno pole `wysiwyg_html` w `free_text_section.yaml`
- [ ] Migracja istniejących danych (weryfikacja czy `content` jest zgodny z nowym formatem)
- [ ] Aktualizacja widoku `free_text_section.antlers.html` — uproszczenie do `{{ content }}`
- [ ] Test CP: zapis, reload, render frontend
- [ ] Usunięcie tymczasowej logiki warunkowej z widoku

---

### Etap 5 — Pakowanie jako standalone addon

**Status:** `TODO`

- [ ] `composer.json` z metadanymi (name, description, authors, license, require)
- [ ] `README.md` z instrukcją instalacji i konfiguracji
- [ ] Weryfikacja że addon instaluje się czysto przez `composer require` w testowym projekcie
- [ ] Opcjonalnie: publikacja na Packagist

---

### Etap 6 — Układ kolumnowy w Free Text Section

**Status:** `TODO (v2.0)`

**Opis:**
Możliwość podzielenia bloku Free Text Section na 2, 3 lub 4 równe kolumny. Każda kolumna ma osobne pole `wysiwyg_html`.

**Rekomendacja techniczna:**
Nowy blok page buildera „Kolumny" (osobny set, nie modyfikacja istniejącego Free Text Section) z Replikatorem wewnątrz:
- pole `columns` (Replicator) — każdy element = jedna kolumna z polem `wysiwyg_html`
- Antlers renderuje: `<div class="grid grid-cols-{{ columns | count }} gap-6">`
- Responsywność: `grid-cols-1 md:grid-cols-{{ columns | count }}` — na mobile kolumny się składają

Tailwind CSS Grid (`grid grid-cols-2 gap-6`, `grid-cols-3`, `grid-cols-4`) — wbudowane w Statamic CP, zero dodatkowych zależności.

**Zakres zmian:**
- Nowy fieldset `resources/fieldsets/columns_section.yaml`
- Nowy widok `resources/views/page_builder/columns_section.antlers.html`
- Rejestracja w `resources/fieldsets/all_page_builder.yaml`

---

### Etap 7 — Rozbudowane tło sekcji (kolor z offsetem + obraz z pozycją)

**Status:** `TODO (v2.0)`

**Opis:**
Zastąpienie obecnego pojedynczego pola `background_color` pełnym systemem tła z wyborem trybu:
- **Brak tła** — sekcja przezroczysta
- **Kolor** — obecne zachowanie + opcjonalne przesunięcie od góry (N px)
- **Obraz** — asset z biblioteki mediów + rozmiar + pozycja

**Uwaga o Tailwind:** Nie stosować Tailwind utilities dla dynamicznych wartości tła z CMS. Inline CSS jest jedynym pewnym rozwiązaniem.

---

**Pola Statamic (fieldset `free_text_section.yaml`):**

| Pole | Typ | Opcje |
|------|-----|-------|
| `background_type` | `select` | `none` / `color` / `image` |
| `background_color` | `color` | `if: background_type == color` |
| `background_top_offset` | `integer` | px, default: 0; `if: background_type == color` |
| `background_image` | `assets`, max: 1 | `if: background_type == image` |
| `background_size` | `select` | `cover` / `contain` / `auto` |
| `background_position` | `select` | 9 opcji bez powtórzeń |

**Opcje `background_position` (9, bez duplikatów):**
`left top` / `center top` / `right top` / `left center` / `center` / `right center` / `left bottom` / `center bottom` / `right bottom`

Klucze = wartości CSS `background-position`, wstawiane inline bez dodatkowego mapowania.

**Zakres zmian:**
- `resources/fieldsets/free_text_section.yaml`
- `resources/views/page_builder/free_text_section.antlers.html`
- Fallback dla istniejących wpisów z `background_color`

---

## Decyzje architektoniczne

| Decyzja | Wybór | Uzasadnienie |
|---|---|---|
| WYSIWYG engine | TipTap 3 | Statamic 6 używa TipTap 3 — spójna wersja |
| Source editor | CodeMirror 5 via `window.CodeMirror` | Już zbundlowany w Statamic CP — zero dodatkowych zależności |
| Synchronizacja | `editor.getHTML()` + `editor.commands.setContent()` | Natywne API TipTap 3 |
| Toolbar | `@tiptap/starter-kit` + selektywne rozszerzenia | Nie duplikuje Bard — własna instancja |
| Packaging | Composer addon w `addons/` | Statamic standard, gotowy do Packagist |

---

## Zależności zewnętrzne

| Pakiet | Wersja | Cel | Czy gotowy |
|---|---|---|---|
| `@tiptap/vue-3` | ^3.0.0 | Vue 3 integration | npm install |
| `@tiptap/starter-kit` | ^3.0.0 | Podstawowe rozszerzenia | npm install |
| `CodeMirror 5` | 5.65.x | Source editor | już w Statamic CP |
| element-tiptap CodeView logic | — | Wzorzec synchronizacji (MIT) | przepisać |

---

## Notatki

- Addon nie modyfikuje istniejącego fieldtype `bard` — działa niezależnie
- Każde pole `wysiwyg_html` w fieldsetach to osobna instancja — bez efektów ubocznych
- Pliki dokumentacji docelowo w `addons/wysiwyg-html/` po Etapie 1
