# ROADMAP — addon `wysiwyg-html-fieldtype`

## Informacje ogólne

| Klucz | Wartość |
|---|---|
| Nazwa robocza | `wysiwyg-html-fieldtype` |
| Docelowa nazwa pakietu | `skalisty/wysiwyg-html-fieldtype` |
| Typ | Statamic 6 addon — custom fieldtype |
| Stack | Laravel 13, Statamic 6, TipTap 3, CodeMirror 5, Vue 3 |
| Lokalizacja w projekcie | `skalisty-orion/addons/skalisty/wysiwyg-html-fieldtype/` |
| Projekt macierzysty | `skalisty-orion` (`/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion`) |

## Cel addonu

Fieldtype dla Statamic 6 umożliwiający przełączanie się między edytorem WYSIWYG (TipTap) a edytorem kodu HTML (CodeMirror) w obrębie jednego pola. Oba widoki operują na tych samych danych — treść jest synchronizowana przy każdym przełączeniu trybu.

Addon ma być wyodrębniany jako samodzielny pakiet Composer i instalowany w innych projektach Laravel/Statamic bez modyfikacji.

---

## Etapy

### Etap 1 — Struktura addonu

**Status:** `DONE`

- [x] Wygenerowanie boilerplate przez `php please make:addon skalisty/wysiwyg-html-fieldtype`
- [x] Wygenerowanie fieldtype przez `php please make:fieldtype WysiwygHtml`
- [x] Weryfikacja struktury katalogów
- [x] Skopiowanie `ADDON_WYSIWYG_HTML_ROADMAP.md` i `ADDON_WYSIWYG_HTML_CHANGELOG.md` do katalogu addonu
- [x] Potwierdzenie że addon ładuje się bez błędów (`php artisan statamic:stache:refresh`)
- [x] Potwierdzenie że fieldtype `wysiwyg_html` jest widoczny w runtime Statamic

#### Potwierdzona struktura po Etapie 1

```text
addons/skalisty/wysiwyg-html-fieldtype/
├── CHANGELOG.md
├── ROADMAP.md
├── README.md
├── composer.json
├── package.json
├── phpunit.xml
├── resources/
│   └── js/
│       ├── addon.js
│       └── components/
│           └── fieldtypes/
│               └── WysiwygHtml.vue
├── src/
│   ├── Fieldtypes/
│   │   └── WysiwygHtml.php
│   └── ServiceProvider.php
├── tests/
│   ├── ExampleTest.php
│   └── TestCase.php
└── vite.config.js
```

#### Notatki z Etapu 1

- `make:addon` w Statamic 6 wymaga pełnej nazwy pakietu Composer, nie krótkiego sluga.
- `make:fieldtype WysiwygHtml skalisty/wysiwyg-html-fieldtype` nie rozpoznało jeszcze nowego addonu i wygenerowało pliki w ścieżce awaryjnej.
- Pliki fieldtype oraz Vue component zostały następnie uporządkowane ręcznie do właściwego katalogu addonu.
- Addon został zarejestrowany w projekcie przez lokalny `path repository` i `composer require`.
- Dla bezpieczeństwa Etapu 1 usunięto aktywną rejestrację Vite z `ServiceProvider`, pozostawiając pliki JS/Vue gotowe do dalszej rozbudowy w Etapie 3.

---

### Etap 2 — PHP Fieldtype

**Status:** `DONE`

- [x] Klasa `WysiwygHtml` extends `Fieldtype`
- [x] `augment()` zwraca `HtmlString`
- [x] `preProcess()` i `process()` obsluguja string HTML
- [x] `configFieldItems()` — opcje konfigurowalne: `container`, `placeholder`
- [x] `defaultValue()` zwraca pusty string
- [x] Walidacja runtime przez `php artisan tinker`
- [x] Regresja projektu sprawdzona przez `php artisan test`

#### Potwierdzone zachowanie po Etapie 2

- `augment(null)` zwraca `Illuminate\Support\HtmlString('')`
- `augment('<h2>Test</h2>')` zwraca `Illuminate\Support\HtmlString`
- `preProcess(null)` zwraca pusty string
- `process(null)` zwraca pusty string
- `configFieldItems()` udostepnia dwa klucze:
  - `container`
  - `placeholder`

#### Notatki z Etapu 2

- Briefowa komenda testowa z `FieldtypeRepository::make()` byla nieaktualna dla tej wersji Statamic.
- Poprawna walidacja runtime uzywa:
  - `app(\Statamic\Fields\FieldtypeRepository::class)->find('wysiwyg_html')`
- Etap 2 nie rusza jeszcze Vue component ani integracji Vite.

---

### Etap 3 — Vue Component (WYSIWYG + Source Toggle)

**Status:** `DONE`

- [x] Podstawowy komponent `WysiwygHtml.vue`
- [x] TipTap 3 instance z `@tiptap/starter-kit`
- [x] Toolbar z podstawowymi przyciskami formatowania
- [x] CodeMirror 5 przez `window.CodeMirror` dla widoku HTML
- [x] Przycisk toggle WYSIWYG ↔ HTML w toolbarze
- [x] Synchronizacja przy przełączeniu: `editor.getHTML()` → CodeMirror i vice versa
- [x] Emitowanie zmian przez `Fieldtype.use(...).update(...)`
- [x] Obsługa `read-only` mode
- [x] Rejestracja skryptu addonu przez `$scripts`
- [x] Build do `resources/dist/addon.js`

#### Potwierdzone zachowanie po Etapie 3

- `resources/dist/addon.js` i `resources/dist/addon.css` sa generowane przez `npm run build`
- komponent rejestruje sie jako:
  - `wysiwyg-html-fieldtype`
- build korzysta z:
  - external Vue przez `window.Vue`
  - TipTap 3 bundlowanego do addonu
  - CodeMirror 5 dostepnego runtime z CP Statamic

#### Notatki z Etapu 3

- Briefowa wersja `@vitejs/plugin-vue` (`^5.0.0`) byla niekompatybilna z `vite@^7`, dlatego podniesiono ja do `^6.0.0`.
- Briefowy import `@statamic/cms/vite-plugin` nie przechodzil w lokalnym addonie opartym o `file:` dependency do vendorowego `dist-package`, bo plugin nie potrafil rozwiazac swoich zaleznosci z kontekstu tej sciezki.
- W efekcie `vite.config.js` zostal zaadaptowany do lokalnego, samowystarczalnego wariantu:
  - `vue()` z `@vitejs/plugin-vue`
  - wlasny plugin `statamic-externals`, odtwarzajacy kluczowe zachowanie externalizacji `vue` do `window.Vue`
- Manualna walidacja w CP nie zostala wykonana narzedziowo w tym etapie; technicznie potwierdzono tylko build, obecność artefaktow i brak regresji backendu.

---

### Etap 3b — naprawa edytora i rozszerzenie toolbara

**Status:** `DONE`

- [x] Fallback dla trybu HTML, gdy `window.CodeMirror` nie jest dostepny
- [x] Usuniecie `theme: 'material'` z konfiguracji CodeMirror
- [x] Naprawa przejscia HTML -> WYSIWYG bez zalozenia, ze `cmInstance` istnieje
- [x] Obsluga `@input` dla plain textarea fallbacku
- [x] Minimalna wysokosc `.ProseMirror`, `textarea` i `.CodeMirror`
- [x] Dodanie przycisku `🔗` i rozszerzenia TipTap `Link`
- [x] Dodanie przycisku fullscreen i stylow `is-fullscreen`
- [x] Rebuild addonu
- [x] Regresja projektu sprawdzona przez `php artisan test`

#### Potwierdzone zachowanie po Etapie 3b

- `resources/dist/addon.js` zostalo przebudowane po zmianach komponentu
- zaleznosc `@tiptap/extension-link` jest obecna w `package.json`
- komponent ma teraz dwa bezpieczne tory dla trybu HTML:
  - CodeMirror, jesli `window.CodeMirror` istnieje
  - zwykle `textarea`, jesli global nie jest dostepny
- toolbar zawiera dodatkowo:
  - przycisk linka
  - przycisk fullscreen

#### Notatki z Etapu 3b

- Brief sugerowal krotka diagnostyke przez `console.log`, ale finalnie nie zostal on pozostawiony w kodzie zgodnie z ograniczeniami briefu.
- W tej sesji nie wykonano narzedziowej walidacji CP, wiec nie potwierdzono recznie:
  - czy `window.CodeMirror` jest dostepny w runtime CP
  - czy fullscreen nie wchodzi w konflikt z `z-index` panelu
  - czy prompt linka dziala poprawnie na zywej instancji
- Kod zostal przygotowany defensywnie tak, aby brak `window.CodeMirror` nie blokowal edycji HTML.

---

### Etap 3c — fullscreen przez Teleport + rozszerzenie toolbara

**Status:** `DONE`

- [x] Owiniecie root komponentu w `<Teleport :disabled="!isFullscreen" to="body">`
- [x] Aktualizacja CSS fullscreen dla flex layoutu i `min-height: 0`
- [x] Dodanie przyciskow alignmentu `← ↔ →`
- [x] Dodanie przycisku `blockquote` `❝`
- [x] Dodanie przycisku `code inline` `` ` ``
- [x] Dodanie przycisku `horizontal rule` `─`
- [x] Dodanie przycisku `image` `🖼`
- [x] Rebuild addonu
- [x] Regresja projektu sprawdzona przez `php artisan test`

#### Potwierdzone zachowanie po Etapie 3c

- komponent korzysta z `Teleport`, gdy aktywny jest fullscreen
- toolbar zostal rozszerzony o:
  - alignment
  - blockquote
  - code inline
  - horizontal rule
  - image
- `resources/dist/addon.js` zostalo przebudowane po zmianach

#### Notatki z Etapu 3c

- W tej sesji nie wykonano narzedziowej walidacji CP, wiec nadal nie ma twardego potwierdzenia:
  - czy fullscreen rzeczywiscie przykrywa caly panel CP
  - czy wszystkie nowe przyciski dzialaja poprawnie na zywej instancji
  - czy po Teleport nie ma regresji synchronizacji WYSIWYG↔HTML
- Implementacja pozostaje zgodna z briefem i nie wymaga nowych paczek npm.

---

### HOTFIX 4 — `update:value`

**Status:** `DONE`

- [x] Zmiana `defineEmits(['input'])` na `defineEmits(['update:value'])`
- [x] Zmiana `emit('input', value)` na `emit('update:value', value)`
- [x] Rebuild addonu
- [x] Regresja projektu sprawdzona przez `php artisan test`

#### Potwierdzone zachowanie po HOTFIX 4

- komponent emituje juz zdarzenie zgodne z publish form Statamic 6
- `resources/dist/addon.js` zostalo przebudowane po hotfixie

#### Notatki z HOTFIX 4

- To byl krytyczny detal integracyjny z CP Statamic:
  - wizualnie dzialajacy komponent nie zapisywal wartosci, bo emitowal zly event Vue
- Nadal potrzebne jest reczne potwierdzenie w CP, ze zapis pola dziala end-to-end.

---

### Etap 3d — przycisk `📁` i natywny asset browser

**Status:** `DONE`

- [x] Dodanie `preload()` w `WysiwygHtml.php`
- [x] Dodanie propsa `meta` w komponencie Vue
- [x] Dodanie refow `showAssetBrowser` i `selectedAssets`
- [x] Dodanie helpera `cpUrl()` i handlera `onAssetSelected()`
- [x] Dodanie przycisku `📁` w toolbarze
- [x] Dodanie teleportowanego modalu z globalnym `<asset-browser>`
- [x] Rebuild addonu
- [x] Regresja projektu sprawdzona przez `php artisan test`

#### Potwierdzone zachowanie po Etapie 3d

- po stronie PHP fieldtype jest preloadable przez nadpisane `preload()`
- komponent Vue otrzymuje `meta.container`
- `resources/dist/addon.js` zostalo przebudowane po wdrozeniu modalu assets

#### Notatki z Etapu 3d

- W tej sesji nie wykonano narzedziowej walidacji runtime w CP, wiec nadal nie ma twardego potwierdzenia:
  - czy globalny `<asset-browser>` rozwiazuje sie poprawnie w addonie IIFE
  - czy klikniecie assetu zamyka modal i wstawia obraz do edytora
  - czy source mode pokazuje po tym poprawny `<img src="...">`
- Poniewaz runtime nie zostal potwierdzony, nie dopisano jeszcze silniejszego wniosku do `CONCLUSIONS_CODEX.md` o globalnym resolverze `asset-browser`.

---

### HOTFIX 5 — przycisk `📁` nie reaguje

**Status:** `DONE`

- [x] `preload()` opakowane w `try/catch` i logging
- [x] `onMounted` diagnostyka `props.meta`
- [x] `watch` na `props.meta.container`
- [x] `dynamicContainer` + `effectiveContainer`
- [x] `openBrowser()` z fallback `fetch()` do `fields/field-meta`
- [x] Usuniecie cichego `no-op` z handlera przycisku `📁`
- [x] CSS dla `button:disabled`
- [x] `cache:clear` + `stache:refresh` + `config:clear`
- [x] Rebuild addonu i regresja testow

#### Potwierdzone zachowanie po HOTFIX 5

- komponent ma teraz dwa zrodla kontenera assets:
  - preload `meta.container`
  - fallback dynamicznie pobierany przez `fields/field-meta`
- `resources/dist/addon.js` zostalo przebudowane po hotfixie

#### Notatki z HOTFIX 5

- W tej sesji nie wykonano narzedziowej walidacji CP, wiec nadal nie ma twardego potwierdzenia:
  - czy `asset-browser` rzeczywiscie otwiera sie po kliknieciu `📁`
  - ktora sciezka zostala uzyta w runtime:
    - preload
    - fallback fetch
  - czy wybor assetu wstawia obraz do TipTap
- Poniewaz runtime nie zostal potwierdzony, nie dopisano jeszcze mocniejszego wniosku do `CONCLUSIONS_CODEX.md`.

---

### HOTFIX 6 — `asset-browser` crash przy otwarciu

**Status:** `DONE`

- [x] Dodano `:selected-path="''"` do `<asset-browser>`
- [x] Rebuild addonu
- [x] Regresja testow

#### Potwierdzone zachowanie po HOTFIX 6

- Komponent `asset-browser` dostaje juz jawnie pusty string w `selectedPath`
- Kod jest zgodny z diagnoza briefu: watcher w runtime nie powinien juz dostawac `undefined`

#### Notatki z HOTFIX 6

- To jest bardzo waski fix zgodny z briefem — jedna zmiana w template komponentu Vue
- Nadal brakuje recznej walidacji w CP:
  - czy modal otwiera sie bez crasha
  - czy wybor assetu zamyka modal
  - czy obraz trafia do edytora

---

### Etap 3e — dropdown naglowkow H1–H6

**Status:** `DONE`

- [x] `StarterKit` rozszerzony o headingi `H1–H6`
- [x] Dodany `currentHeadingLevel`
- [x] Dodana funkcja `setHeading(level)`
- [x] Przyciski `H1/H2/H3` zastapione dropdownem `Normalny / H1–H6`
- [x] Dodane style `.toolbar-select`
- [x] Rebuild addonu
- [x] Regresja testow

#### Potwierdzone zachowanie po Etapie 3e

- Toolbar ma teraz jeden kompaktowy dropdown dla naglowkow zamiast trzech osobnych przyciskow
- TipTap akceptuje poziomy headingow `1..6`

#### Notatki z Etapu 3e

- Nadal brakuje recznej walidacji w CP:
  - czy dropdown pokazuje aktualny poziom headingu
  - czy H4/H5/H6 stosuja sie poprawnie
  - czy `Normalny` przywraca paragraf

---

### Etap 3f — BubbleMenu dla obrazkow

**Status:** `DONE`

- [x] Import `BubbleMenu` z `@tiptap/vue-3/menus`
- [x] Rozszerzenie `Image` o atrybut `style`
- [x] Dodane `setImageAlign(align)`
- [x] Dodane `editImageUrl()`
- [x] Dodany `<BubbleMenu>` nad `EditorContent`
- [x] Dodane style `.wysiwyg-bubble-menu`, `.bubble-btn`, `.bubble-btn--danger`, `.bubble-sep`
- [x] Rebuild addonu
- [x] Regresja testow

#### Potwierdzone zachowanie po Etapie 3f

- Bundling z `@tiptap/vue-3/menus` dziala poprawnie
- Addon buduje sie bez instalowania nowych paczek npm

#### Notatki z Etapu 3f

- Nadal brakuje recznej walidacji w CP:
  - czy BubbleMenu pojawia sie po kliknieciu obrazka
  - czy wyrównanie zapisuje `style=` na `<img>`
  - czy edycja URL i usuwanie obrazka dzialaja bez regresji

---

### Etap 4 — Integracja z Free Text Section

**Status:** `DONE`

- [x] Podmiana pól `content` (bard) + `editor_mode` + `html_content` na jedno pole `wysiwyg_html` w `free_text_section.yaml`
- [x] Aktualizacja widoku `free_text_section.antlers.html` — uproszczenie do `{{ content }}`
- [x] Dodanie nowego, samodzielnego bloku `wysiwyg_html_block`
- [x] Rejestracja `wysiwyg_html_block` w `all_page_builder.yaml`
- [x] Walidacja techniczna przez `php artisan statamic:stache:refresh`
- [x] Regresja projektu sprawdzona przez `php artisan test`

#### Potwierdzone zachowanie po Etapie 4

- `free_text_section.yaml` nie zawiera juz:
  - `editor_mode`
  - `content` typu `bard`
  - `html_content`
- `free_text_section.antlers.html` renderuje bezposrednio:
  - `{{ content }}`
- Istnieje nowy fieldset:
  - `resources/fieldsets/wysiwyg_html_block.yaml`
- Istnieje nowy widok:
  - `resources/views/page_builder/wysiwyg_html_block.antlers.html`
- `all_page_builder.yaml` zawiera rejestracje:
  - `wysiwyg_html_block`

#### Notatki z Etapu 4

- Zmiana jest zgodna z briefem i dotyczy tylko page buildera, bez modyfikacji samego addonu.
- Brief dopuszczal utrate starej tresci z tymczasowego 3-polowego modelu w srodowisku deweloperskim.
- Manualna walidacja w CP nie zostala wykonana narzedziowo w tym etapie; technicznie potwierdzono tylko:
  - poprawna strukture YAML
  - brak bledow stache
  - brak regresji testow

---

### Etap 5 — Pakowanie jako standalone addon

**Status:** `TODO`

- [ ] `composer.json` z metadanymi (name, description, authors, license, require)
- [ ] `README.md` z instrukcją instalacji i konfiguracji
- [ ] Weryfikacja że addon instaluje się czysto przez `composer require` w testowym projekcie
- [ ] Opcjonalnie: publikacja na Packagist

---

### Etap 6 — Układ kolumnowy w Free Text Section

**Status:** `DONE (2026-06-02)`

**Opis:**
Możliwość podzielenia bloku Free Text Section na 2, 3 lub 4 równe kolumny. Każda kolumna ma osobne pole `wysiwyg_html`.

Zaimplementowane jako dwa osobne bloki page buildera (zamiast rozbudowy Free Text Section):

**`free_text_section`** — rozszerzony o `layout_mode` (single/columns), przy trybie columns: Replicator z polami `wysiwyg_html`.

**`columns_section`** — nowy samodzielny blok z wyborem 2/3/4 kolumn i Replikatorem.

**Zrealizowane pliki:**
- `resources/fieldsets/free_text_section.yaml` — zaktualizowany (columns layout + layout_mode)
- `resources/fieldsets/columns_section.yaml` — nowy
- `resources/views/page_builder/columns_section.antlers.html` — nowy
- Rejestracja w `resources/fieldsets/all_page_builder.yaml`

---

### Etap 7 — Rozbudowane tło sekcji (kolor z offsetem + obraz z pozycją)

**Status:** `TODO (v2.0)`

**Opis:**
Zastąpienie obecnego pojedynczego pola `background_color` pełnym systemem tła z wyborem trybu:
- **Brak tła** — sekcja przezroczysta
- **Kolor** — obecne zachowanie + opcjonalne przesunięcie od góry (N px)
- **Obraz** — asset z biblioteki mediów + rozmiar + pozycja

**Uwaga o Tailwind:** Nie stosować Tailwind utilities dla dynamicznych wartości tła z CMS. `bg-position-*` klasy wymagają whitelisty w purge config. Inline CSS jest jedynym pewnym rozwiązaniem dla wartości wpisywanych przez redaktora.

---

**Pola Statamic (fieldset `free_text_section.yaml`):**

| Pole | Typ Statamic | Opcje / uwagi |
|------|-------------|---------------|
| `background_type` | `select` | `none` = Brak, `color` = Kolor, `image` = Obraz |
| `background_color` | `color` | `if: background_type == color` |
| `background_top_offset` | `integer` | px, default: 0; `if: background_type == color` |
| `background_image` | `assets`, max: 1 | `if: background_type == image` |
| `background_size` | `select` | `cover` / `contain` / `auto`; `if: background_type == image` |
| `background_position` | `select` | 9 opcji (patrz niżej); `if: background_type == image` |

**Opcje `background_position` (9 bez powtórzeń):**

```
key: left top      value: Góra-Lewo
key: center top    value: Góra-Centrum
key: right top     value: Góra-Prawo
key: left center   value: Lewo
key: center        value: Centrum
key: right center  value: Prawo
key: left bottom   value: Dół-Lewo
key: center bottom value: Dół-Centrum
key: right bottom  value: Dół-Prawo
```

Wartości kluczy to dokładne wartości CSS `background-position` — wstawiane inline bez mapowania.

---

**Antlers template (`free_text_section.antlers.html`):**

```antlers
{{ if background_type == 'color' && background_color }}
style="background: linear-gradient(to bottom,
    transparent {{ background_top_offset or 0 }}px,
    {{ background_color }} {{ background_top_offset or 0 }}px);"
{{ elseif background_type == 'image' && background_image }}
style="background-image: url('{{ background_image:url }}');
    background-size: {{ background_size or 'cover' }};
    background-position: {{ background_position or 'center' }};
    background-repeat: no-repeat;"
{{ /if }}
```

Gdy `background_top_offset = 0` gradient degeneruje do jednorodnego koloru — brak wizualnej różnicy.

---

**Zakres zmian:**
- `resources/fieldsets/free_text_section.yaml` — zastąpienie `background_color` systemem 6 pól
- `resources/views/page_builder/free_text_section.antlers.html` — nowa logika inline style
- Istniejące wpisy CMS z `background_color` wymagają ręcznej migracji lub obsługi fallbacku w template

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
- Po pierwszym `npm run build` trzeba raz utworzyc publiczny symlink dla skryptu addonu:
  - `mkdir -p public/vendor/wysiwyg-html-fieldtype/js`
  - `ln -s ../../../../addons/skalisty/wysiwyg-html-fieldtype/resources/dist/addon.js public/vendor/wysiwyg-html-fieldtype/js/addon.js`
- Dzięki temu kazdy kolejny build automatycznie odswieza plik dostepny publicznie bez recznego kopiowania.
