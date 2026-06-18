# CHANGELOG — addon `wysiwyg-html-fieldtype`

Format: `[Etap X — opis] YYYY-MM-DD`

---

## Nieukończone / w toku

Brak aktywnych wpisów.

---

## Historia

### HOTFIX 5 — przycisk `📁` nie reaguje na klikniecie `2026-06-01`

- Zaktualizowano:
  - `src/Fieldtypes/WysiwygHtml.php`
  - `resources/js/components/fieldtypes/WysiwygHtml.vue`
  - `resources/dist/addon.js`
- Dodano diagnostyke i fallback dla `meta.container`:
  - `preload()` w PHP opakowane w `try/catch` z logowaniem
  - `onMounted` logujacy `props.meta`
  - `watch` na `props.meta.container`
  - `dynamicContainer` + `effectiveContainer`
  - `openBrowser()` z fallback fetch do `fields/field-meta`
- Usunieto cichy `no-op` z przycisku `📁`
- Dodano styl dla `button:disabled`
- Walidacja:
  - `npm run build` — OK
  - `php artisan test` — OK
  - `php artisan cache:clear` — OK
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan config:clear` — OK
- Uwaga:
  - brak narzedziowej walidacji runtime w CP
  - nadal trzeba recznie sprawdzic:
    - logi konsoli przegladarki
    - czy `asset-browser` otwiera modal
    - czy wybor assetu wstawia obraz do edytora

### Etap 3d — przycisk `📁` i natywny asset browser `2026-06-01`

- Zaktualizowano:
  - `src/Fieldtypes/WysiwygHtml.php`
  - `resources/js/components/fieldtypes/WysiwygHtml.vue`
  - `resources/dist/addon.js`
- Dodano `preload()` po stronie PHP, aby przekazac `meta.container` do komponentu Vue
- Dodano po stronie Vue:
  - prop `meta`
  - refy `showAssetBrowser` i `selectedAssets`
  - helper `cpUrl()`
  - handler `onAssetSelected()`
  - przycisk `📁` w toolbarze
  - teleportowany modal z globalnym `<asset-browser>`
- Dodano modal z overlayem i panelem assets
- Walidacja:
  - `npm run build` — OK
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK
- Uwaga:
  - brak narzedziowej walidacji runtime w CP
  - nadal trzeba recznie potwierdzic:
    - czy `asset-browser` rozwiazuje sie poprawnie w naszym addonie IIFE
    - czy wybor assetu zamyka modal i wstawia obraz do TipTap
    - czy tryb source pokazuje po tym poprawny `<img src="...">`

### HOTFIX 4 — zdarzenie `update:value` `2026-06-01`

- Zaktualizowano:
  - `resources/js/components/fieldtypes/WysiwygHtml.vue`
- Zmieniono komunikacje komponentu ze Statamic CP:
  - `defineEmits(['input'])` -> `defineEmits(['update:value'])`
  - `emit('input', value)` -> `emit('update:value', value)`
- Powod:
  - Statamic 6 publish form nasluchuje `update:value`, a nie `input`
- Walidacja:
  - `npm run build` — OK
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK
- Uwaga:
  - wymagane pozostaje reczne potwierdzenie w CP, ze pole zapisuje dane po ponownym otwarciu wpisu

### Etap 3c — Teleport fullscreen + rozszerzenie toolbara `2026-06-01`

- Zaktualizowano:
  - `resources/js/components/fieldtypes/WysiwygHtml.vue`
  - `resources/dist/addon.js`
- Wdrożono `<Teleport :disabled="!isFullscreen" to="body">` dla trybu fullscreen
- Zaktualizowano CSS fullscreen:
  - `overflow: hidden`
  - `min-height: 0` na dzieciach flex
  - lepsze wypelnianie przestrzeni przez `.ProseMirror`, `textarea` i `.CodeMirror`
- Dodano funkcje toolbara:
  - alignment `← ↔ →`
  - `blockquote` `❝`
  - `code inline` `` ` ``
  - `horizontal rule` `─`
  - `image` `🖼` przez prompt URL
- Walidacja:
  - `npm run build` — OK
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK
- Uwaga:
  - brak narzedziowej walidacji runtime w CP
  - nadal trzeba recznie potwierdzic:
    - czy fullscreen rzeczywiscie przykrywa caly panel
    - czy nowe przyciski sa widoczne i dzialaja
    - czy synchronizacja WYSIWYG↔HTML nie ma regresji po Teleport

### Etap 3b — naprawa edytora i rozszerzenie toolbara `2026-06-01`

- Zaktualizowano:
  - `package.json`
  - `package-lock.json`
  - `resources/js/components/fieldtypes/WysiwygHtml.vue`
  - `resources/dist/addon.js`
- Dodano devDependency:
  - `@tiptap/extension-link`
- Naprawiono przejscie WYSIWYG -> HTML przez fallback dla plain textarea, gdy `window.CodeMirror` nie jest dostepny
- Naprawiono przejscie HTML -> WYSIWYG, tak aby korzystalo z `cmInstance` lub z wartosci `textarea`
- Usunieto `theme: 'material'` z konfiguracji CodeMirror
- Dodano obsluge linkow:
  - rozszerzenie TipTap `Link`
  - przycisk `🔗`
  - prosty prompt do ustawiania / usuwania URL
- Dodano fullscreen:
  - przycisk `⊡ / ⊠`
  - klasy i style `is-fullscreen`
- Dodano minimalna wysokosc:
  - `.ProseMirror`
  - `textarea`
  - `.CodeMirror`
- Walidacja:
  - `npm install` — OK
  - `npm run build` — OK
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK
- Uwaga:
  - reczna walidacja w CP nie zostala wykonana narzedziowo w tej sesji
  - nie potwierdzono runtime, czy `window.CodeMirror` jest rzeczywiscie dostepny globalnie w aktualnym CP
  - fallback textarea zostal dodany niezaleznie od tej niewiadomej

### HOTFIX — publiczny symlink dla `addon.js` `2026-06-01`

- Utworzono katalog:
  - `public/vendor/wysiwyg-html-fieldtype/js`
- Utworzono symlink:
  - `public/vendor/wysiwyg-html-fieldtype/js/addon.js`
  - wskazujacy na:
  - `addons/skalisty/wysiwyg-html-fieldtype/resources/dist/addon.js`
- Walidacja:
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK
  - `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:8001/vendor/wysiwyg-html-fieldtype/js/addon.js` — `200`

### HOTFIX 6 — `asset-browser` crash przy otwarciu `2026-06-01`

- Zaktualizowano:
  - `resources/js/components/fieldtypes/WysiwygHtml.vue`
- Dodano brakujacy prop do komponentu:
  - `:selected-path="''"`
- Powod:
  - wewnetrzny watcher w Statamic `asset-browser` zakladal string w `selectedPath`
  - bez propsa dochodzilo do crasha `undefined.endsWith()`
- Walidacja:
  - `npm run build` — OK
  - `php artisan test` — OK
- Uwaga:
  - runtime w CP nadal wymaga recznego potwierdzenia

### Etap 3e — dropdown naglowkow H1–H6 `2026-06-01`

- Zaktualizowano:
  - `resources/js/components/fieldtypes/WysiwygHtml.vue`
- Zmiany:
  - `StarterKit` skonfigurowany z headingami `1..6`
  - dodany `currentHeadingLevel`
  - dodana funkcja `setHeading(level)`
  - przyciski `H1/H2/H3` zastapione jednym dropdownem `Normalny / H1–H6`
  - dodane style `.toolbar-select`
- Walidacja:
  - `npm run build` — OK
  - `php artisan test` — OK
- Uwaga:
  - dropdown wymaga jeszcze recznej walidacji w CP

### WYSIWYG — wizualne zaznaczanie obrazkow `2026-06-01`

- Zaktualizowano:
  - `resources/js/components/fieldtypes/WysiwygHtml.vue`
- Dodano CSS:
  - `img` w `.ProseMirror` ma `cursor: pointer`
  - `img.ProseMirror-selectednode` ma outline zaznaczenia
- Walidacja:
  - `npm run build` — OK
  - `php artisan test` — OK
- Uwaga:
  - zachowanie zaznaczenia wymaga jeszcze recznej walidacji w CP

### Etap 3f — BubbleMenu dla obrazkow `2026-06-01`

- Zaktualizowano:
  - `resources/js/components/fieldtypes/WysiwygHtml.vue`
- Dodano:
  - import `BubbleMenu` z `@tiptap/vue-3/menus`
  - rozszerzenie `Image` o atrybut `style`
  - akcje `setImageAlign()` i `editImageUrl()`
  - pasek BubbleMenu nad zaznaczonym obrazkiem
  - CSS dla `.wysiwyg-bubble-menu`
- Walidacja:
  - `npm run build` — OK
  - `php artisan test` — OK
- Uwaga:
  - zachowanie BubbleMenu i zapis `style=` wymagaja jeszcze recznej walidacji w CP

### HOTFIX 7 — dropdown `⋯` w asset-browserze `2026-06-01`

- Zaktualizowano:
  - `resources/js/components/fieldtypes/WysiwygHtml.vue`
- Dodano:
  - nieskopowany blok `<style>` podnoszacy `z-index` dla `[data-reka-popper-content-wrapper]` gdy aktywny jest `.wysiwyg-asset-overlay`
- Walidacja:
  - `npm run build` — OK
  - `php artisan test` — OK
- Uwaga:
  - zachowanie dropdownu `⋯` nadal wymaga recznej walidacji w CP

### HOTFIX 8 — pelna szerokosc obszaru WYSIWYG `2026-06-01`

- Zaktualizowano:
  - `resources/js/components/fieldtypes/WysiwygHtml.vue`
- Dodano:
  - `.wysiwyg-html-content { max-width: none; }`
- Walidacja:
  - `npm run build` — OK
  - `php artisan test` — OK
- Uwaga:
  - realna szerokosc obszaru WYSIWYG wymaga jeszcze recznej walidacji w CP

### Etap 4 — Integracja z Page Builder `2026-06-01`

- Zaktualizowano:
  - `resources/fieldsets/free_text_section.yaml`
  - `resources/views/page_builder/free_text_section.antlers.html`
  - `resources/fieldsets/all_page_builder.yaml`
- Dodano:
  - `resources/fieldsets/wysiwyg_html_block.yaml`
  - `resources/views/page_builder/wysiwyg_html_block.antlers.html`
- `Free Text Section` zostal uproszczony do jednego pola:
  - `content`
  - `type: wysiwyg_html`
- Usunieto tymczasowe pola:
  - `editor_mode`
  - `content` typu `bard`
  - `html_content`
- Dodano nowy, samodzielny blok:
  - `HTML Editor Block`
- Walidacja:
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK
- Uwaga:
  - manualna walidacja runtime w CP nie zostala wykonana narzedziowo w tej sesji
  - technicznie potwierdzono tylko poprawny stan plikow i brak regresji backendu

### Etap 3 — Vue component, build i rejestracja skryptu `2026-06-01`

- Zaktualizowano:
  - `package.json`
  - `vite.config.js`
  - `src/ServiceProvider.php`
  - `resources/js/addon.js`
  - `resources/js/components/fieldtypes/WysiwygHtml.vue`
- Dodano zaleznosci TipTap 3 i Vue plugin do builda addonu
- Zmieniono nazwe komponentu na:
  - `wysiwyg-html-fieldtype`
- Wdrożono dzialajacy komponent z:
  - trybem WYSIWYG (TipTap 3)
  - trybem HTML (CodeMirror 5 przez `window.CodeMirror`)
  - synchronizacja przy przelaczaniu trybow
  - podstawowym toolbarem
- Zarejestrowano skrypt addonu przez:
  - `protected $scripts = [__DIR__.'/../resources/dist/addon.js']`
- Wykonano build:
  - `resources/dist/addon.js`
  - `resources/dist/addon.css`
- Walidacja:
  - `npm install` — OK
  - `npm run build` — OK
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK
- Ważne odchylenia od briefu:
  - `@vitejs/plugin-vue@^5.0.0` bylo niekompatybilne z `vite@^7`, wiec uzyto `^6.0.0`
  - `@statamic/cms/vite-plugin` nie dzialal poprawnie w tym lokalnym setupie z `file:` dependency do vendorowego `dist-package`
  - `vite.config.js` zostal zastapiony lokalnym wariantem z wlasnym pluginem externalizujacym `vue` do `window.Vue`

### Etap 2 — PHP Fieldtype class `2026-06-01`

- Uzupełniono backendową klasę:
  - `addons/skalisty/wysiwyg-html-fieldtype/src/Fieldtypes/WysiwygHtml.php`
- Dodano:
  - `protected $categories = ['text']`
  - `protected $icon = 'code'`
- `defaultValue()` zwraca teraz pusty string zamiast `null`
- `preProcess()` i `process()` są null-safe i zwracają string
- `augment()` zwraca `Illuminate\Support\HtmlString`
- Dodano `configFieldItems()` z opcjami:
  - `container`
  - `placeholder`
- Walidacja:
  - `php artisan tinker` — OK
  - `php artisan test` — OK
- Ważna korekta do briefu:
  - w tej wersji Statamic `FieldtypeRepository` nie ma metody `make()`
  - test runtime wykonano przez `find('wysiwyg_html')`

### Etap 1 — Boilerplate addonu i rejestracja `2026-06-01`

- Wygenerowano addon przez `php please make:addon skalisty/wysiwyg-html-fieldtype`
- Wygenerowano pusty fieldtype `WysiwygHtml`
- Uporządkowano strukturę addonu do katalogu:
  - `addons/skalisty/wysiwyg-html-fieldtype/`
- Dodano:
  - `src/Fieldtypes/WysiwygHtml.php`
  - `resources/js/addon.js`
  - `resources/js/components/fieldtypes/WysiwygHtml.vue`
  - `package.json`
  - `vite.config.js`
- Dodano lokalny `path repository` do `composer.json` projektu
- Wykonano `composer require skalisty/wysiwyg-html-fieldtype:^0.1.0`
- Potwierdzono, że addon jest odkrywany przez Statamic i fieldtype rejestruje się jako `wysiwyg_html`
- Skopiowano `ROADMAP.md` i `CHANGELOG.md` do katalogu addonu
- Walidacja:
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK

### Etap 0 — Decyzja i projektowanie `2026-06-01`

- Zdiagnozowano brak natywnego WYSIWYG↔HTML toggle w Statamic 6 Bard
- Potwierdzono że przycisk `source` nie istnieje w `buttons.js` Statamic 6
- Przeprowadzono research: brak gotowego marketplace addonu dla tej funkcji
- Sprawdzono stos techniczny: Statamic 6 używa TipTap 3 + CodeMirror 5
- Podjęto decyzję o budowie własnego fieldtype addonu
- Zdefiniowano architekturę: jedno pole HTML string, dwa widoki (TipTap + CodeMirror), synchronizacja przez `getHTML()` / `setContent()`
- Przygotowano roadmapę 5 etapów
- Wymaganie: addon ma być standalone Composer package, reużywalny w innych projektach
