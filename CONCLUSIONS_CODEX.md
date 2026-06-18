# CONCLUSIONS_CODEX

## Aktualne wnioski po hard resecie

### 1. Poprzedni kierunek należy uznać za zamknięty

- Stara ścieżka oparta o ręczną migrację HTML i własne, rozbudowane eksperymenty z builderem została świadomie porzucona.
- Nie należy do niej wracać jako do aktywnego planu wdrożeniowego.
- Jeśli jakaś stara notatka temu przeczy, obecny stan projektu ma pierwszeństwo.

### 2. Orion jest aktualną bazą projektu

- `skalisty-orion` jest obecnie właściwą bazą do dalszej pracy.
- To nie jest projekt eksperymentalny, tylko obowiązujący stan po resecie.
- Kolejne decyzje powinny zakładać rozwój właśnie tego projektu.

### 3. Multisite jest poprawnym fundamentem dla wielojęzyczności

- Zastosowanie natywnego multisite Statamic było właściwą decyzją.
- Obecny model:
  - `pl` pod `/`
  - `en` pod `/en/`
- ten układ należy utrzymać jako podstawę pod dalsze języki.

### 4. Trzeba rozdzielać dwa typy tłumaczeń

- `content translation`:
  - wpisy
  - strony
  - builder content
  - globals
  - navigation
- `string translation`:
  - napisy interfejsu motywu
  - przyciski
  - komunikaty
  - etykiety typu `Search`, `Submit`, `404`

To rozdzielenie jest kluczowe i nie powinno być mieszane w kolejnych briefach.

### 5. Magic Translator jest właściwy dla contentu

- `Magic Translator` z DeepL jest poprawnym wyborem dla tłumaczeń treści.
- Po podmianie klucza API workflow działa poprawnie.
- Należy pamiętać, że:
  - tłumaczenia są kolejkowane,
  - zmiana klucza wymaga restartu konfiguracji i queue workera.

### 6. Frontend string translation nadal wymaga osobnego wdrożenia

- Nie jest to już problem do analizy, tylko zaplanowany etap implementacyjny.
- Docelowy model jest ustalony:
  - `lang/pl/ui.php`
  - `lang/en/ui.php`
  - `{{ trans:ui.* }}`

Nie ma potrzeby szukać osobnego pluginu jako podstawy tego systemu.

### 7. Super Admin Toolbar jest wdrożony i potwierdzony

- Instalacja addonu została wykonana poprawnie technicznie.
- Wcześniejszy problem był najprawdopodobniej związany z sesją i hostem.
- `APP_URL` zostało znormalizowane do `127.0.0.1:8001`.
- Użytkownik potwierdził już, że toolbar działa na froncie.

### 8. Builder i hero editability zostały naprawione

- Problem z nieaktywnymi polami w CP nie był problemem samego motywu, tylko localizable behavior i struktury danych.
- Ten obszar można uznać za naprawiony.
- Jeśli pojawią się podobne objawy w innych sekcjach, trzeba najpierw sprawdzić:
  - `localizable`
  - `origin`
  - strukturę asset fields
  - kolizje nazw technicznych pól

### 9. Pola markdown i bard w listingach wymagają ostrożności

- Bug z `Add Link to Entry` pokazał ważny wzorzec dla Statamic.
- Jeśli kolekcje są mieszane w jednym entries pickerze, a pierwszy blueprint ma pole `type: markdown` ustawione jako listowalne, Statamic może próbować preprocessować dane innych kolekcji przez niewłaściwy fieldtype.
- Gdy druga kolekcja przechowuje pod tym samym handle dane strukturalne, np. Bard array, kończy się to type mismatch.
- Bezpieczny wniosek:
  - pola długiej treści typu `markdown` i `bard` nie powinny być listowalne domyślnie, jeśli nie są naprawdę potrzebne w listingach i pickerach.
- W tym projekcie fix polegał na dodaniu:
  - `listable: false`
  do pól `content` w blueprintach:
  - `pages/page.yaml`
  - `default.yaml`

### 10. Dla nowych locale lepszy był fallback 302 niż masowe tworzenie pustych wpisów

- Rozszerzenie konfiguracji multisite o 10 nowych locale nie wystarczyło, żeby `/de/`, `/sv/`, `/fr/` itd. zaczęły działać.
- Same site'y istniały w runtime, ale nie miały localizations wpisów ani trees.
- Zamiast tworzyć od razu dużą liczbę pustych lokalizacji contentu, tymczasowo wdrożono redirect fallback do polskiej wersji.
- To daje lepszy stan operacyjny:
  - użytkownik nie trafia na obce 404
  - nowe locale mogą istnieć w switcherze i konfiguracji
  - tłumaczenia można dodawać później stopniowo

### 11. W Laravel 13 praktyczniejszy okazał się `respond(...)` niż samo `render(...)`

- Przy obsłudze fallbacku locale samo `render(NotFoundHttpException ...)` nie przejęło końcowego zachowania dla 404 tak, jak zakładał brief.
- Skuteczne rozwiązanie wymagało użycia:
  - `->withExceptions(...)`
  - `respond(...)`
  na finalnej odpowiedzi 404 w `bootstrap/app.php`
- To jest ważny wzorzec dla kolejnych podobnych przypadków w Laravel 13:
  - gdy chcemy zmienić finalną odpowiedź HTTP, a nie tylko próbować przechwycić wyjątek, `respond(...)` bywa pewniejszą ścieżką niż samo `render(...)`.

### 12. Przy zadaniach assetowych trzeba pilnować realnego celu CMS, nie tylko literalnego briefu

- W zadaniu `Tabler Icons` istotne doprecyzowanie użytkownika zmieniło sens implementacji:
  - celem było dodanie osobnego kontenera z ikonami,
  - nie automatyczna integracja z istniejącymi polami buildera.
- Po tym doprecyzowaniu właściwe rozwiązanie to:
  - nowy kontener `Icons`,
  - nowy dysk `icons`,
  - pliki SVG w `public/assets/icons/`,
  - brak zmian w istniejących polach redakcyjnych.
- Dodatkowo zadanie ujawniło historyczne pola `assets` bez jawnego `container`, które mogą pozostawać ukrytym źródłem błędów po `stache:refresh`.

### 13. Kolejne kontenery ikon można dodawać bezpiecznie jako izolowane biblioteki

- Zadanie `icons2` potwierdziło, że dla projektu najbezpieczniejszy model to:
  - osobny dysk,
  - osobny kontener Statamic,
  - katalog SVG w `public/assets/...`,
  - brak automatycznej integracji z istniejącymi fieldsetami.
- Taki model nie narusza buildera, nie wymusza migracji danych contentowych i pozwala administratorowi używać ikon ręcznie wtedy, kiedy naprawdę są potrzebne.

### 14. Integracja TipTap 3 + CodeMirror 5 w addonie Statamic 6 jest wykonalna, ale build wymaga korekt względem planu

- Warstwa frontendowa addonu `wysiwyg-html-fieldtype` daje się zbudować jako lokalny addon Statamic 6.
- Model integracji jest prosty i trafny:
  - TipTap 3 jako edytor wizualny
  - CodeMirror 5 z `window.CodeMirror` jako widok HTML
  - synchronizacja przez `editor.getHTML()` i `editor.commands.setContent(...)`
- Najbardziej niespodziewane rzeczy w praktyce:
  - briefowa wersja `@vitejs/plugin-vue` byla zbyt stara dla `vite@7`
  - `@statamic/cms/vite-plugin` nie nadawal sie wprost do lokalnego addonu opartego o `file:` dependency do vendorowego `dist-package`
- Bezpieczny wniosek roboczy:
  - dla takiego addonu lepiej utrzymac prosty, samowystarczalny `vite.config.js`
  - i jawnie externalizowac `vue` do `window.Vue`

## Wnioski robocze na przyszłość

### 1. Briefy powinny być oparte na aktualnym stanie plików

- Nie wolno zakładać prawdziwości historycznych ustaleń sprzed resetu bez weryfikacji w aktualnym repo.
- Przy kolejnych briefach stan plików projektu ma pierwszeństwo nad pamięcią rozmowy.

### 2. Najbezpieczniejszy dalszy kierunek

Najrozsądniejsza kolejność kolejnych prac to:

1. recznie zweryfikowac w CP dzialanie pola `wysiwyg_html` po Etapie 3
2. potem przejsc do Etapu 4 integracji z `Free Text Section`
3. po zamknieciu addonu wrocic do `frontend string translation`
4. osobno rozważyć audit historycznych pól `assets` bez jawnego `container`

### 3. Orion należy traktować jako system bazowy, nie materiał do kolejnego resetu

- Na teraz nie ma przesłanek, żeby znów zmieniać fundament projektu.
- Lepiej rozwijać ten stan niż rozpoczynać kolejną migrację od nowa.

### 15. Lokalny addon Statamic wymaga symlinku do `public/vendor/` — `$scripts` nie serwuje pliku automatycznie

- `$scripts` w `AddonServiceProvider` rejestruje plik przez `$this->publishes()` (Laravel publishables).
- Plik trafia do `public/vendor/{package}/js/{filename}.js` dopiero po `php artisan vendor:publish --tag={slug}`.
- Dla lokalnego dev addonu bezpieczniejszy jest symlink tworzony raz:
  ```bash
  mkdir -p public/vendor/wysiwyg-html-fieldtype/js
  ln -s ../../../../addons/skalisty/wysiwyg-html-fieldtype/resources/dist/addon.js \
        public/vendor/wysiwyg-html-fieldtype/js/addon.js
  ```
- Symlink automatycznie wskazuje aktualny plik po każdym `npm run build` — nie trzeba powtarzać vendor:publish.
- Wzorzec URL: `/vendor/{package-name}/js/{filename}.js` gdzie `package-name` = slug addonu (bez vendor prefixu).

### 16. Statamic szuka komponentu Vue fieldtype według wzorca `<handle>-fieldtype` — podkreślenia z handle'a są zachowane

- Handle fieldtype: `wysiwyg_html`
- Oczekiwana nazwa komponentu Vue: `wysiwyg_html-fieldtype` (NIE: `wysiwyg-html-fieldtype`)
- Statamic nie konwertuje underscores na hyphens przy szukaniu komponentu.
- Błędna "poprawka" w Etapie 3 zmieniła nazwę na `wysiwyg-html-fieldtype` — co blokowało CP.
- Wzorzec do zapamiętania: `Statamic.component('{handle}-fieldtype', Component)` gdzie handle jest bez modyfikacji.

### 17. Skrypt addonu Statamic musi być zbudowany jako IIFE, nie jako ES module

- Statamic ładuje skrypty addonów przez `<script src="...">` bez `type="module"`.
- Jeśli Vite buduje plik jako ES module (domyślnie dla `format: 'es'`), przeglądarka zgłasza:
  ```
  SyntaxError: import declarations may only appear at top level of a module
  ```
- Wymagana konfiguracja Vite/Rollup:
  ```js
  output: {
      format: 'iife',
      name: 'WysiwygHtmlAddon',
      globals: { vue: 'Vue' },
  }
  ```
- `vue` musi być external i zmapowany do `window.Vue`, bo Statamic udostępnia Vue globalnie.
- Wniosek: dla każdego addonu Statamic 6 ładowanego przez `$scripts` — zawsze sprawdzić format buildu przed pierwszym testem w CP.

### 18. Fieldtype Vue w Statamic 6 musi emitować `update:value`, nie `input`

- Publish form Statamic 6 odbiera zmiany pola przez zdarzenie:
  - `update:value`
- Emisja samego:
  - `input`
  nie wystarcza do zapisu wartosci fieldtype w CP.
- Dla wlasnych komponentow Vue opartych o `<script setup>` bezpieczny wzorzec to:
  - `const emit = defineEmits(['update:value'])`
  - `emit('update:value', value)`
- To jest krytyczny detal integracyjny: komponent moze wizualnie dzialac poprawnie, a mimo to nic nie zapisze, jesli emituje zly event.

### 19. `asset-browser` Statamic wymaga jawnego `:selected-path="''"` — prop bez domyślnej wartości crashuje przy montowaniu

- `Browser.vue` (komponent `asset-browser`) ma prop `selectedPath: String` **bez wartości domyślnej**.
- Watcher z `immediate: true` uruchamia się natychmiast i próbuje wywołać `newPath.endsWith(...)`:
  ```js
  selectedPath: {
      immediate: true,
      handler(newPath) {
          if (!newPath.endsWith('/edit')) { this.path = newPath; }
      },
  }
  ```
- Jeśli `selectedPath` nie jest przekazany → `newPath = undefined` → `TypeError: can't access property "endsWith", newPath is undefined`.
- **Fix**: zawsze przekazywać `:selected-path="''"` do `<asset-browser>`:
  ```html
  <asset-browser
      :container="effectiveContainer"
      :selected-assets="selectedAssets"
      :max-files="1"
      :selected-path="''"
      @selections-updated="onAssetSelected"
  />
  ```
- Błąd jest niemym crashem — overlay Teleportu znika zanim stanie się widoczny, użytkownik widzi "nic się nie dzieje".
- Diagnostyka: browser console, error `Uncaught (in promise) TypeError: ... newPath is undefined, handler Selector-*.js`.

### 20. TipTap 3 BubbleMenu w Statamic addonie działa przez `@tiptap/vue-3/menus`, a obraz wymaga własnego `style` attribute

- Import ścieżki dla Vue jest poprawny jako:
  - `import { BubbleMenu } from '@tiptap/vue-3/menus'`
- W tym wariancie BubbleMenu korzysta z:
  - `@floating-ui/dom`
  a nie z `tippy.js`, więc właściwy prop to:
  - `options`
  a nie `tippyOptions`
- W `shouldShow` bezpiecznie jest zmienić nazwę parametru:
  - `({ editor: ed })`
  żeby nie kolidował z refem `editor` ze scope komponentu
- Domyślne rozszerzenie `Image` nie obsługuje atrybutu `style`, więc dla wyrównywania obrazka trzeba je rozszerzyć przez:
  - `.extend({ addAttributes() { ... } })`
- Dopiero wtedy komenda:
  - `updateAttributes('image', { style: '...' })`
  ma szansę zapisać wyrównanie jako `style=` na `<img>`
- Na etapie technicznym build i testy przeszły, ale runtime w CP nadal trzeba potwierdzić ręcznie:
  - czy BubbleMenu pojawia się nad obrazkiem,
  - czy zapis `style=` trafia do finalnego HTML.

### 21. Dropdowny `reka-ui` w teleportowanym asset-browserze przegrywają z overlayem, jeśli portal nie dostanie wyższego `z-index`

- W asset-browserze Statamic przycisk `⋯` korzysta z komponentu `Dropdown` opartego o `reka-ui`.
- Zawartość dropdownu jest portalowana do `<body>` przez wrapper:
  - `[data-reka-popper-content-wrapper]`
- Jeśli własny modal ma wysoki `z-index` (u nas `10000`), a wrapper `reka-ui` zostaje na domyślnym `z-index: auto`, menu renderuje się poprawnie, ale jest schowane pod overlayem.
- Bezpieczny hotfix lokalny to nieskopowany CSS:
  ```css
  body:has(.wysiwyg-asset-overlay) [data-reka-popper-content-wrapper] {
      z-index: 10001 !important;
  }
  ```
- Ten wzorzec jest spójny z tym, jak sam Statamic podbija portale przy aktywnych modalach.
- Ważne: taki fix trzeba trzymać jako **non-scoped `<style>`**, bo portal renderuje się poza komponentem Vue.

### 22. `prose` w CP moze ograniczyc szerokosc edytora, nawet jesli w template jest `max-w-none`

- W naszym komponencie WYSIWYG wrapper mial klasy:
  - `prose max-w-none`
- W runtime Statamic CP klasa `prose` pochodzi z Typography i ustawia:
  - `max-width: 65ch`
- Sama obecność `max-w-none` w template nie gwarantuje override, jeśli ta klasa nie została wygenerowana w skompilowanym CSS CP.
- Bezpieczny lokalny fix po stronie addonu to jawny override w komponencie:
  ```css
  .wysiwyg-html-content {
      max-width: none;
  }
  ```
- To pozwala zachować zalety `prose` (typografia), ale zdjąć limit szerokości obszaru edycji.
