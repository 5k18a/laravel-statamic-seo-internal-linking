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
