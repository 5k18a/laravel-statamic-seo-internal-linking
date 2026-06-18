# Codex Memory

## Ostatnia sesja — 2026-06-18 — FEATURE-completion-year-sort

- Aktywny brief:
  - `FEATURE-completion-year-sort`
- Cel:
  - sortowanie projektów od najnowszych do najstarszych po roku zakończenia
  - pole `completion_year` ma być techniczne, niewidoczne na froncie, `localizable: false`
- Wykonane:
  - `resources/blueprints/collections/projects/project.yaml`
    - dodano `completion_year` w sidebarze po `slug`
  - `content/collections/projects.yaml`
    - dodano `sort_field: completion_year_sort`
    - dodano `sort_direction: desc`
  - `app/Providers/AppServiceProvider.php`
    - dodano computed field `completion_year_sort = completion_year ?: 0`
  - `resources/views/page_builder/project_section.antlers.html`
    - w 3 tagach `collection:projects` dodano `sort="completion_year_sort:desc"`
  - 10 plików PL projektów dostało `completion_year`:
    - Afrykarium 2014
    - Oceanika 2015
    - Tarnowskie Termy 2024
    - Woliera Argusa 2018
    - Baseny Tropikalne 2019
    - Orientarium - Lwy Azjatyckie 2019
    - Wybieg Wydry Europejskiej 2019
    - Woliera Dzioborożca 2019
    - Ogród w Alpach 2021
    - Grota z Lourdes 2022
- Ważna decyzja techniczna:
  - literalne `completion_year:desc` w Statamic sortuje `NULL` przed wartościami liczbowymi
  - dlatego Codex użył computed `completion_year_sort`, gdzie brak roku daje `0`
  - dzięki temu realne projekty są pierwsze, a drafty/demo z brakiem roku są na końcu w query/listingu
- Niespójności briefu:
  - brief walidacyjnie zaczyna listę od `Grota z Lourdes (2022)`, ale sam wskazuje `Tarnowskie Termy = 2024`; przy sortowaniu desc pierwsze są `Tarnowskie Termy`
  - brief wskazuje `/en/project`, ale aktualna strona listingowa EN istnieje jako `/en/projects`; `/en/project` zwraca 404
  - 17 demo projektów ma `published: false`, więc publiczna `/realizacje` pokazuje tylko 10 realnych projektów
- Walidacja:
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK (`2 passed`)
  - `php -l app/Providers/AppServiceProvider.php` — OK
  - query PL po `completion_year_sort:desc` potwierdza kolejność 2024 → 2022 → 2021 → 2019 → 2018 → 2015 → 2014 → `NULL/0`
  - lokalny runtime na `127.0.0.1:8002`:
    - `/realizacje` — 200
    - `/en/projects` — 200
    - `/en/project` — 404
    - `/cp/login` — 302
- Git:
  - zgodnie z aktualnym `AGENTS.md` Codex nie commituje; commit/push ma wykonać Claude po audycie, chyba że użytkownik wyraźnie poleci inaczej

## Ostatnia sesja — 2026-06-18 — BUGFIX sticky header default

- Aktywny brief:
  - `BUGFIX-sticky-header-default`
- Cel:
  - header ma być sticky zgodnie z `theme_settings:header_type`, niezależnie od `show_theme_switcher`
  - przy ukrytym switcherze stare `localStorage.headerType=static` nie może nadpisywać ustawienia z CMS
- Wykonane:
  - `resources/views/layout.antlers.html`
    - dodano:
      - `data-header-type="{{ theme_settings:header_type }}"`
      - na tagu `<body>`
  - `public/assets/js/custom.js`
    - dodano `switcherVisible`
    - dodano `serverHeaderType = document.body.dataset.headerType || "sticky"`
    - gdy switcher jest ukryty, wykonywane jest `localStorage.removeItem("headerType")`
    - `stickyMode` bierze `localStorage` tylko gdy istnieje, inaczej fallback do server value
    - przyciski `.headers` są synchronizowane z localStorage tylko gdy switcher jest widoczny
- Nie ruszano:
  - `window.setHeaderSticky`
  - `updateHeader()`
  - `content/globals/pl/theme_settings.yaml`
  - `resources/blueprints/globals/theme_settings.yaml`
  - cudzych zmian w `content/collections/pages/pl/home.md` i `public/assets/logo-klienci/`
- Walidacja:
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK (`2 passed`)
  - `node --check public/assets/js/custom.js` — OK
  - grep potwierdził `data-header-type`, `switcherVisible`, `serverHeaderType`, `removeItem("headerType")`
  - poza sandboxem `curl http://127.0.0.1:8001/` — OK (`200`)
  - poza sandboxem `curl http://127.0.0.1:8001/assets/js/custom.js` — OK (`200`)
  - render HTML ma `<body data-header-type="sticky">`
  - HTML nie zawiera `header-options`, `.headers`, `themeSidebar`, `themeToggleBtn`, więc przy `show_theme_switcher: false` switcher faktycznie nie jest renderowany
- Nie wykonano:
  - testu w przeglądarce / DevTools
  - powód: brak Playwright/Puppeteer w projekcie; nie instalowano nowych zależności tylko do walidacji
- Doc drift:
  - `BRIEF_CODEX.md` ma `BUGFIX-sticky-header-default`
  - `PROJECT_STATUS_CODEX.md` i `CLAUDE_MEMORY.md` nadal wskazują `FEATURE-logos-slider-with-icons`
  - brief był jednoznaczny, więc praca nie była blokowana
- Git:
  - zgodnie z aktualnym `AGENTS.md` Codex nie commituje; commit i push ma wykonać Claude po audycie, chyba że użytkownik wyraźnie poleci inaczej

## Ostatnia sesja — 2026-06-18 — FEATURE Logos Slider with Icons

- Aktywny brief:
  - `FEATURE-logos-slider-with-icons`
- Wykonane:
  - dodano fieldset:
    - `resources/fieldsets/logos_slider_with_icons.yaml`
  - dodano widok:
    - `resources/views/page_builder/logos_slider_with_icons.antlers.html`
  - zarejestrowano set po `logos_slider` w:
    - `resources/fieldsets/all_page_builder.yaml`
- Założenia techniczne:
  - oryginalny `logos_slider.yaml` i `logos_slider.antlers.html` pozostają nienaruszone
  - nowy set używa `iconify` z `store_as: svg_data`
  - `icon` jest opcjonalne
  - `name` jest wymagane
  - klasa `logos` została zachowana na SVG, zgodnie z briefem, żeby przejąć istniejące style slidera
- Walidacja:
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK (`2 passed`)
  - grep potwierdził rejestrację setu, `iconify:icon` i `store_as: svg_data`
  - diff potwierdził brak modyfikacji oryginalnego `logos_slider`
- Doc drift:
  - nieblokujący rozjazd w `PROJECT_SYNC`:
    - `BRIEF_CODEX.md` ma dłuższe `active_task_name` i `last_sync 18:00`
    - `PROJECT_STATUS_CODEX.md` oraz `CLAUDE_MEMORY.md` mają krótsze `active_task_name` i `last_sync 12:00`
  - `active_task_id` jest spójny: `FEATURE-logos-slider-with-icons`
  - zakres briefu był jednoznaczny, a użytkownik kazał rozpocząć prace
- Następny krok:
  - Claude powinien przeprowadzić audyt, ewentualnie sprawdzić ręcznie CP/frontend po dodaniu testowego bloku i zamknąć task atomowo w trzech plikach sync

## Ostatnia sesja — 2026-06-17 — Deploy Iconify + Icon Box With Text na dev.skalisty.pl

- Kontekst:
  - Uzytkownik poprosil o deployment dzisiejszych zmian na serwer do katalogu `/skalisty_2026`.
  - Dane SSH sa w lokalnym skrypcie; dzialajacy dla Codex wariant to:
    - `/home/pestycyd/Insync/biuro@skalisty.pl/OneDrive/Linux/bin/skalisty-ssh`
    - uruchamiany przez `/bin/bash`
  - `/usr/bin/skalisty-ssh` w trybie automatycznym zwracal `Permission denied`, mimo ze uzytkownik moze laczyc sie swoim skryptem.
- Pre-check remote:
  - katalog: `/home/klient.dhosting.pl/skalisty/skalisty_2026`
  - `php84 artisan --version`: Laravel Framework 13.12.0
  - przed deployem na serwerze brakowalo `vendor/eminos/statamic-iconify`, `config/statamic-iconify.php`, `public/vendor/statamic-iconify`
  - na serwerze nadal istnialy stare kontenery `icons` i `icons2`
- Backup/cleanup remote:
  - przed kasowaniem wykonano backup:
    - `/home/klient.dhosting.pl/skalisty/skalisty_2026-icons-containers-before-delete-2026-06-17.tar.gz`
  - usunieto z remote:
    - `public/assets/icons/`
    - `public/assets/icons2/`
    - `content/assets/icons.yaml`
    - `content/assets/icons2.yaml`
- Rsync:
  - wykonany bez `--delete`
  - 24 789 996 bytes jako rozmiar transferowanych roznic
  - 123 created files
  - 0 deleted files przez rsync
  - obejmowal Iconify vendor/config/public vendor, nowy fieldset/widok, rejestracje w builderze i biezacy content lokalny
- Post-deploy:
  - `php84 artisan package:discover --ansi` — OK
  - `php84 artisan optimize:clear` — OK
  - `php84 artisan config:clear` — OK
  - `php84 artisan cache:clear` — OK
  - `php84 artisan view:clear` — OK
  - `php84 artisan statamic:stache:refresh` — OK
  - `php84 artisan test` — OK (`2 passed`)
- Walidacja:
  - `vendor/eminos/statamic-iconify` — istnieje
  - `config/statamic-iconify.php` — istnieje
  - `public/vendor/statamic-iconify` — istnieje
  - stare `icons/icons2` usuniete z remote
  - `default_store_as`: `svg_data`
  - prefixy `map` i `mdi`: aktywne
  - `https://dev.skalisty.pl/` — 200
  - `https://dev.skalisty.pl/en/` — 301 do `/en`, po redirect 200
  - `https://dev.skalisty.pl/cp/login` — 302
  - HTML strony glownej zawiera `Czym się Zajmujemy?` oraz `Konsulting i Planowanie`
- Dokumentacja:
  - zaktualizowano `server_deploy/DEPLOYMENT.md`, `CHANGE-LOG.md`, `PROJECT_STATUS_CODEX.md`, `CLAUDE_MEMORY.md`, `CODEX_SUGGESTIONS.md`, `codex-memory.md`
  - wpisy sa sporzadzone przez Codex i wymagaja audytu Claude po powrocie
- Nastepny krok:
  - jezeli Home EN ma zawierac nowy blok, trzeba wykonac osobne tlumaczenie/synchronizacje PL -> EN z `--include-stale` albo `--overwrite`
  - Claude powinien przeprowadzic audyt dokumentacji deploymentu zgodnie z `AGENTS.md`

## Ostatnia sesja — 2026-06-17 — Icon Box With Text + Iconify prefixes

- Kontekst:
  - Claude byl chwilowo niedostepny, a uzytkownik poprosil o kontynuacje prac bez udzialu Claude.
  - Dokumentacja centralna zostala uzupelniona przez Codex w trybie zastepczym, z jasna adnotacja, ze Claude ma wykonac audyt.
- Wykonane wdrozenie:
  - nowy set Page Buildera `Icon Box With Text Section`
  - fieldset:
    - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/fieldsets/icon_box_with_text_section.yaml`
  - widok:
    - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/page_builder/icon_box_with_text_section.antlers.html`
  - rejestracja:
    - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/fieldsets/all_page_builder.yaml`
- Funkcjonalnosc sekcji:
  - `section_title`
  - `layout`: `three_columns` albo `four_columns`
  - `items` replicator
  - item: `icon` (`iconify`, `store_as: svg_data`), `title`, `description`
  - layout jest nad itemami, czyli nad wyborem ikony, zgodnie z doprecyzowaniem uzytkownika
- Walidacja:
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan view:clear` — OK
  - `php artisan test` — OK (`2 passed`)
  - HTTP `/` — 200
  - HTTP `/en/` — 200
  - uzytkownik potwierdzil, ze sekcja dziala dobrze
- Magic Translator:
  - `FieldDefinitionBuilder` widzi set `icon_box_with_text_section`
  - `ContentExtractor` wyciaga:
    - `section_title`
    - `items.*.title`
    - `items.*.description`
  - `ContentExtractor` pomija:
    - `layout` (`select`)
    - `icon` (`iconify`)
  - realny Home PL ma nowy blok pod `page_builder.2`
  - Home EN jeszcze nie ma tego bloku
  - dry-run `--include-stale` dla Home PL -> EN pokazuje `1 will re-translate (stale)`
- Iconify prefixes:
  - w `config/statamic-iconify.php` dodano:
    - `map`
    - `temaki`
    - `maki`
    - `game-icons`
    - `bx`
    - `bxs`
    - `bxl`
  - `mdi` bylo juz obecne
  - `php artisan optimize:clear` — OK
  - `config("statamic-iconify.allowed_prefixes")` potwierdza pelna liste
- Dokumentacja zaktualizowana przez Codex:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/BRIEF_CODEX.md`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/PROJECT_STATUS_CODEX.md`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/CLAUDE_MEMORY.md`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/CHANGE-LOG.md`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/CODEX_SUGGESTIONS.md`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/codex-memory.md`
- Nastepny krok:
  - backup przed dalsza praca zostal wykonany:
    - `/home/pestycyd/Dokumenty/Skalisty-New-2/backup-projekt/skalisty-orion-backup-8.tar.gz`
    - 354 MB
    - zawiera `skalisty-orion/` + glowne pliki dokumentacji workspace
  - Claude po powrocie powinien zrobic audyt dokumentacji i faktycznych zmian
  - decyzja uzytkownika, czy uruchamiamy tlumaczenie Home PL -> EN z `--include-stale`/`--overwrite`

## Ostatnia sesja — 2026-06-17 — FEATURE Figma Assets install

- Aktywny brief:
  - `FEATURE-figma-assets-install`
- Cel:
  - zainstalować `mariohamann/statamic-figma-assets` jako lokalny fork i udostępnić CP Utility `Figma Assets`
- Wykonane zmiany:
  - pobrany lokalny fork:
    - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/addons/mariohamann/statamic-figma-assets/`
  - usunięty wewnętrzny `.git` forka
  - w forku:
    - `statamic/cms: ^5.0`
    - zmienione na:
    - `statamic/cms: ^5.0|^6.0`
  - w głównym `composer.json`:
    - dodany path repository do forka
    - dodany require `mariohamann/statamic-figma-assets: @dev`
  - `composer.lock` zaktualizowany przez Composer
  - config opublikowany:
    - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/config/statamic-figma-assets.php`
  - `.env` i `.env.example` dostały puste placeholdery:
    - `FIGMA_TOKEN=`
    - `FIGMA_FILE_ID=`
    - `FIGMA_ASSETS_CONTAINER=assets`
- Ważny hotfix kompatybilności:
  - po instalacji `/cp/utilities/figma-assets` dawało `500`
  - przyczyna:
    - widok addonu używał breadcrumb partiala niedostępnego w tym Statamic 6 CP
  - fix:
    - w lokalnym forku `resources/views/index.blade.php`
    - include breadcrumb zastąpiony prostym linkiem do `cp_route('utilities.index')`
  - po fixie endpoint CP utility zwraca `200`
- Walidacja:
  - `git clone` wymagał eskalacji sieciowej, potem OK
  - `composer update mariohamann/statamic-figma-assets` wymagał eskalacji sieciowej, potem OK
  - nie były potrzebne nowe komendy `composer config allow-plugins`
  - `composer show mariohamann/statamic-figma-assets` pokazuje `dev-main` i path do lokalnego forka
  - `php artisan route:list --name=statamic.cp.utilities.figma-assets` pokazuje 5 rout
  - `Statamic\Facades\Utility::all()` zawiera `figma_assets`
  - `php artisan optimize:clear` — OK
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK (`2 passed`)
  - kernel smoke:
    - `/` → `200`
    - `/en/` → `200`
    - `/cp/utilities/figma-assets` jako zalogowany admin → `200`
    - response zawiera `Figma Assets`
- Ograniczenia:
  - nie wpisywałem prawdziwego `FIGMA_TOKEN`
  - nie robiłem faktycznego importu z Figma
  - do POC użytkownik musi uzupełnić token, file ID i prawdopodobnie page title
- Doc drift:
  - brak krytycznego rozjazdu
  - `PROJECT_SYNC` był spójny we wszystkich trzech głównych plikach
- Następny ruch:
  - Claude powinien formalnie zamknąć task i dopisać wpis do `CHANGE-LOG.md`
  - następny brief może dotyczyć POC importu i decyzji, czy użyć osobnego kontenera `figma-icons`

## Ostatnia sesja — 2026-06-08 — BUGFIX CP collection listing stub filter

- Aktywny brief:
  - `BUGFIX-cp-collection-listing-stub-filter`
- Wykonane zmiany:
  - w:
    - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/app/Http/Controllers/CP/Collections/EntriesController.php`
  - do istniejącego filtra:
    - `where('site', Site::selected()->handle())`
  - dodałem:
    - `->whereNotNull('data->title')`
- Najważniejsza obserwacja techniczna:
  - brief zakładał:
    - `whereNotNull('title')`
  - ale to nie odcinało stubów, bo Statamic query dla entry rozwiązuje `title` przez `value('title')` i fallback `origin`
  - skuteczny okazał się dopiero filtr po:
    - `data->title`
  - czyli po surowym frontmatter, bez dziedziczenia
- Walidacja:
  - `php artisan optimize:clear` — OK
  - `php artisan test` — OK (`2 passed`)
  - realna kolekcja `faqs` przez `indexQuery()` po fixie:
    - `pl=22`
    - `es=8`
    - `de=0`
  - przed fixem było:
    - `pl=22`
    - `es=13`
  - dodatkowy check:
    - `whereNotNull('data->title')` dla `es` daje `8`
    - `whereNotNull('data->title')` dla `pl` daje `22`
- Wniosek:
  - 5 stubów ES wypada z listingu
  - PL pozostaje bez zmian
  - fix działa na realnych danych projektu
- Ważna notatka dla przyszłości:
  - przy filtrowaniu stub locale w Statamic warto pamiętać o różnicy:
    - `title` = wartość queryable z fallbackiem origin
    - `data->title` = surowy frontmatter wpisu
  - do wykrywania pustych stubów właściwe jest:
    - `data->...`
- Stan na koniec kroku:
  - task jest wykonany technicznie po stronie Codexa
  - `CODEX_SUGGESTIONS.md` zawiera komplet wyników walidacji
  - następny ruch należy do Claude:
    - formalne zamknięcie briefu i atomowa synchronizacja centralnej dokumentacji zgodnie z `AGENTS.md`

## Ostatnia sesja — 2026-06-08 — BUGFIX CP collection listing site filter

- Aktywny brief:
  - `BUGFIX-cp-collection-listing-site-filter`
- Wykonane zmiany:
  - dodany nowy kontroler:
    - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/app/Http/Controllers/CP/Collections/EntriesController.php`
  - dodany binding w:
    - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/app/Providers/AppServiceProvider.php`
  - override `indexQuery()` zachowuje vendorową logikę searchu, ale zmienia filtr site na:
    - `Site::selected()->handle()`
- Ważna decyzja wykonawcza:
  - nie użyłem `parent::indexQuery()`
  - bezpieczniej było skopiować obecną logikę metody z vendora i podmienić tylko warunek site
  - dzięki temu nie ma ryzyka nieczytelnego stackowania:
    - `whereIn(site, authorized...)`
    - plus później dodatkowego:
    - `where(site, selected...)`
- Walidacja:
  - `php artisan optimize:clear` — OK
  - binding przez kontener:
    - `app(\Statamic\Http\Controllers\CP\Collections\EntriesController::class)::class`
    - zwraca:
    - `App\Http\Controllers\CP\Collections\EntriesController`
  - `php artisan route:list --path=collections` — OK
  - `php artisan test` — OK (`2 passed`)
  - realny check na kolekcji `faqs` przez wywołanie `indexQuery()` po bindingu:
    - `pl=21`
    - `en=21`
    - `de=12`
  - to potwierdza, że CP listing filtruje się po wybranym locale
- Ograniczenie:
  - nie zrobiłem klikalnego testu w zalogowanym CP
  - ale techniczna walidacja kontrolera na realnych danych projektu jest mocna
- Doc drift:
  - `PROJECT_SYNC` był spójny i wystarczający do pracy
  - ale niżej w `PROJECT_STATUS_CODEX.md` nadal została stara tekstowa sekcja:
    - `W trakcie: Brak aktywnych zadań`
  - zapisane do `CODEX_SUGGESTIONS.md` jako nieblokujący rozjazd

## Ostatnia sesja — 2026-06-07 — Magic Translator untranslated locale stale fix

- Aktywny brief:
  - `magic-translator-untranslated-stale-fix`
- Wykonane zmiany:
  - w `vendor/el-schneider/statamic-magic-translator/src/Fieldtypes/MagicTranslatorFieldtype.php`
    - dodany zewnetrzny `elseif`, ktory ustawia `is_stale = true`, gdy locale istnieje, ale nie ma jeszcze metadata `magic_translator`
  - dodany patch:
    - `patches/magic-translator-fieldtype-untranslated-stale.patch`
  - zaktualizowany:
    - `composer.json`
    - `patches.lock.json`
- Bardzo wazna uwaga wykonawcza:
  - w tym repo nowy patch nie powinien byc wdrazany samym `composer install`
  - poprawna sekwencja to:
    - `composer patches-relock`
    - `composer patches-repatch`
- Walidacja lokalna:
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK (`2 passed`)
  - runtime payload dla FAQ `testtest` potwierdzony przez bootstrap aplikacji:
    - locale `en/es/de/fr/...`
    - `exists: true`
    - `is_stale: true`
- Ograniczenie walidacji:
  - nie mialem klikowego testu w zalogowanym CP
  - ale preload fieldtype zostal potwierdzony bezposrednio na aplikacji, wiec logika sidebara jest technicznie zweryfikowana
- Deploy:
  - wyslane na serwer:
    - `composer.json`
    - `composer.lock`
    - `patches.lock.json`
    - nowy patch
    - poprawiony plik vendora
  - zdalnie przez `/usr/bin/php83`:
    - `statamic:stache:refresh` — OK
    - `cache:clear` — OK
- Wazna uwaga serwerowa:
  - domyslne `php` na SSH nadal nie nadaje sie do Artisana
  - trzeba uzywac:
    - `/usr/bin/php83 artisan ...`

## Ostatnia sesja — 2026-06-07 — FAQ blueprint `localizable` fix

- Aktywny brief:
  - `faq-blueprint-localizable-fix`
- Wykonane zmiany:
  - w `resources/blueprints/collections/faqs/faq.yaml`
    - dodane `localizable: true` do:
      - `title`
      - `answer`
- Walidacja lokalna:
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan cache:clear` — OK
  - `php artisan test` — OK (`2 passed`)
- Dodatkowa weryfikacja:
  - test CLI Magic Translatora dla jednego wpisu `pl -> es` pokazal, ze istniejaca lokalizacja jest pomijana jako `already exists`
  - nie robilem `--overwrite`, zeby nie modyfikowac tresci produkcyjno-redakcyjnych poza zakresem fixu
- Deploy:
  - blueprint FAQ wdrozony na serwer przez `rsync`
  - zdalne:
    - `statamic:stache:refresh` — OK
    - `cache:clear` — OK
- Bardzo wazna uwaga operacyjna:
  - na serwerze domyslne `php` w SSH to `PHP 5.4.45`
  - komendy Artisan trzeba wykonywac jawnie przez:
    - `/usr/bin/php83 artisan ...`
- Ograniczenie walidacji:
  - nie potwierdzilem interaktywnie w CP statusu `STALE`
  - mechanicznie fix jest poprawny, ale status sidebaru w CP zostal tylko posrednio uzasadniony przez analize addonu i stan istniejacych locale files

## Notatka zamykająca — 2026-06-07 — stan po końcówce pracy Claude

- Na koniec sesji ponownie sprawdziłem:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/BRIEF_CODEX.md`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/PROJECT_STATUS_CODEX.md`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/CLAUDE_MEMORY.md`
- Aktualny stan synchronizacji jest spójny:
  - `state_version: 2026-06-07-2030`
  - `active_task_id: none`
  - `active_task_status: none`
  - `last_closed: globals-locale-files-fix`
  - `next_after_active: Formularze`
- Źródło prawdy na koniec dnia:
  - brak aktywnego zadania dla Codexa
  - następny kierunek nadal:
    - `Formularze`

- Co zostało przeze mnie wykonane wcześniej w tej sesji:
  - `FEATURE-collection-routes-panel`
    - panel CP Tools > Trasy URL kolekcji
    - `projects.yaml` przełączony na route per-site
    - PL:
      - `/realizacje/{slug}`
    - EN i pozostałe locale:
      - `/project/{slug}`
  - `HOTFIX-22-project-url-hardcoded`
    - wszystkie hardkodowane `href="/project/{{ slug }}"` w wskazanych widokach przestawione na `href="{{ url }}"`
    - walidacja HTML:
      - PL → `/realizacje/...`
      - EN → `/en/project/...`

- Co dopchnął później Claude bezpośrednio po swojej stronie:
  - zamknął kolejne taski i ustawił dokumentację na:
    - `last_closed: globals-locale-files-fix`
  - według briefu/statusu/memory doszły też bezpośrednie zmiany Claude:
    - `CP-buttons-tailwind-fix`
    - `globals-locale-files-fix`
  - te zmiany traktuję jako istniejący stan projektu, nie mój task wykonawczy

- Ważny stan projektu na koniec:
  - lokalny frontend:
    - `http://127.0.0.1:8001`
  - lokalny CP:
    - `http://127.0.0.1:8001/cp`
  - dokumentacja operacyjna jest już zsynchronizowana
  - `CHANGE-LOG.md` pozostaje po stronie Claude zgodnie z `AGENTS.md`

- Wniosek na jutro:
  - nie ma otwartego briefu implementacyjnego
  - jeśli wracamy do pracy Codexa, następny sensowny punkt wejścia to nowy brief dla:
    - formularzy kontaktowych
  - przed nowym taskiem warto po prostu jeszcze raz przeczytać aktualne:
    - `BRIEF_CODEX.md`
    - `PROJECT_STATUS_CODEX.md`
    - `CLAUDE_MEMORY.md`

## Ostatnia sesja — 2026-06-06 — Mobile-language-switcher-v2 flagi locale

- Użytkownik poprosił o dodanie flag krajów przed nazwą języka w mobilnym panelu switchera.
- Zmiana została wykonana tylko w:
  - `resources/views/partials/header-1.antlers.html`
- Podejście:
  - proste mapowanie emoji po `locale:short`
  - bez nowych assetów i bez zmian w CSS/JS
- Dla `en` użyta flaga:
  - `🇺🇸`
- Obsłużone locale:
  - `pl`, `en`, `sv`, `no`, `nl`, `lv`, `it`, `fr`, `es`, `de`, `da`, `cs`
- Po feedbacku użytkownika dopracowano ten sam fragment:
  - stała szerokość kolumny flagi:
    - `w-6 shrink-0 justify-center`
  - `no` przeszło z emoji na inline SVG flagi Norwegii, bo emoji nie renderowało się poprawnie
- Walidacja:
  - `php artisan view:clear` — OK
  - `php artisan test` — OK (`2 passed`)
  - lokalny `curl` nie odpowiedział w tej sesji, więc renderu HTTP tym razem nie potwierdziłem
- Ważna uwaga utrzymaniowa:
  - jeśli dojdą nowe locale, trzeba będzie dopisać kolejne mapowanie flagi w tym samym fragmencie szablonu

## Ostatnia sesja — 2026-06-06 — Mobile-language-switcher-v2 hotfix po testach użytkownika

- Po wdrożeniu `Mobile-language-switcher-v2` użytkownik zgłosił dwa realne problemy runtime:
  - rozwinięty panel językowy przeciekał do układu desktopowego headera
  - mobilny panel nie przewijał się poprawnie do końca listy locale, a scroll uciekał do strony pod overlayem
- Przyczyna desktop bug:
  - `#lang-mobile-panel` miał tylko klasę `mobile-nav`
  - a `.mobile-nav` jest stylowane dopiero w `@media (max-width: 991px)`
  - więc na desktopie element renderował się normalnie w flow
- Przyczyna scroll bug:
  - biały kontener listy locale nie miał własnego `overflow-y-auto`
  - więc panel nie przejmował przewijania wewnątrz siebie
- Wykonane poprawki:
  - w `header-1.antlers.html`
    - `#lang-mobile-panel`:
      - `hidden lg:hidden mobile-nav`
    - wewnętrzny kontener:
      - `bg-white h-full overflow-y-auto overscroll-contain`
  - w `custom.js`
    - `openLangPanel()` usuwa `hidden`
    - `closeLangPanel()` przywraca `hidden`
    - przy otwieraniu panelu mobile:
      - `langDetails.open = false`
      co zamyka desktopowy `<details>` jeśli był wcześniej otwarty
- Walidacja:
  - `php artisan test` — OK (`2 passed`)
  - `php artisan view:clear` — OK
  - `GET /` — `200`
  - `GET /en/` — `200`
  - w HTML potwierdzone:
    - `id="lang-mobile-panel" class="hidden lg:hidden mobile-nav"`
    - `bg-white h-full overflow-y-auto overscroll-contain`
- Wniosek:
  - obecna poprawka jest małym runtime hotfixem do już wdrożonego `Mobile-language-switcher-v2`
  - jeśli użytkownik dalej zauważy problem ze scroll UX, następny krok to już najpewniej test przeglądarkowy z inspekcją wysokości panelu i ewentualne doprecyzowanie `max-height`

## Ostatnia sesja — 2026-06-06 — Mobile-language-switcher-v2 hotfix scroll/viewport height

- Po pierwszym hotfixie użytkownik zgłosił jeszcze jeden problem:
  - przy zmniejszonym oknie nie dało się dojść do ostatniego języka na liście
  - scrollbar wyglądał jakby był już na dole, ale ostatni element pozostawał poza ekranem
- Przyczyna:
  - panele mobile otwierają się od `top-full` pod headerem
  - więc samo `h-screen` / `h-full` nie oznacza realnej wysokości dostępnej od dolnej krawędzi headera do dołu viewportu
- W `custom.js` dodałem helper:
  - `syncMobilePanelViewport(panel, scrollChildSelector)`
- Helper:
  - bierze `panel.getBoundingClientRect().top`
  - liczy `availableHeight = window.innerHeight - top`
  - ustawia tę wysokość:
    - na panel
    - i na jego scroll container
- Podpięcie:
  - `openLangPanel()` dla `#lang-mobile-panel`
  - otwieranie hamburger menu dla `#navbar-default`
  - `resize` na mobile, jeśli któryś panel jest otwarty
  - na desktop `>= 992px` inline style są czyszczone
- Walidacja:
  - `php artisan test` — OK (`2 passed`)
  - `php artisan view:clear` — OK
  - `GET /` — `200`
  - `GET /en/` — `200`
- Wniosek:
  - to powinno usunąć efekt „scrollbar już na dole, ale ostatni język nadal poza ekranem”
  - jeśli użytkownik nadal zobaczy podobny objaw, następny krok to już test przeglądarkowy i pomiar konkretnego `top` / `height` na jego viewportcie

## Ostatnia sesja — 2026-06-06 — Mobile-language-switcher-v2

- Aktywny brief:
  - `Mobile-language-switcher-v2`
- Cel:
  - cofnąć poprzednią mobilną listę locale w hamburgerze
  - zachować zawsze widoczny przycisk switchera
  - na mobile otwierać osobny panel `#lang-mobile-panel`, a nie `<details>`
- Wykonane zmiany:
  - w `resources/views/partials/header-1.antlers.html`
    - usunięto mobilny blok locale wstawiony wcześniej do `#navbar-default`
    - przywrócono wrapper:
      - `flex items-center gap-2 relative`
    - dodano nowy panel:
      - `#lang-mobile-panel`
      - `class="mobile-nav"`
      - z wewnętrznym `div.bg-white`
  - w `public/assets/js/custom.js`
    - dodano:
      - `langPanel`
      - `langDetails`
      - `langSummary`
      - `langArrow`
    - dodano:
      - `openLangPanel()`
      - `closeLangPanel()`
    - klik `summary` na mobile `< 992px`:
      - `preventDefault()`
      - toggle osobnego panelu
    - overlay zamyka też panel językowy
    - hamburger zamyka panel językowy przed otwarciem własnego menu
    - `updateOverlayState()` uwzględnia `langPanel`
    - resize `>= 992px` zamyka panel i resetuje rotację strzałki
    - przy otwieraniu panelu mobile:
      - `langDetails.open = false`
      żeby desktopowy `<details>` nie przeciekał po zmianie viewportu
- Walidacja:
  - `php artisan test` — OK (`2 passed`)
  - `php artisan view:clear` — OK
  - `GET /` — `200`
  - `GET /en/` — `200`
  - w HTML `/` potwierdzone:
    - `id="lang-mobile-panel"`
    - `Polski`
    - `English`
    - przywrócony wrapper `class="flex items-center gap-2 relative"`
- Ważne uwagi:
  - nie był potrzebny żaden dodatkowy patch w `tailwind.css`
  - istniejące `.mobile-nav` i `.mobile-nav.open` wystarczyły
  - `bg-white` na wewnętrznym kontenerze panelu jest potrzebne, bo overlay `.mobile-nav.open` ma ciemne tło
  - pełnego klikowego QA na realnym mobile viewport nie zrobiłem w tej sesji automatycznie, więc nadal warto ręcznie sprawdzić:
    - otwarcie panelu
    - zamknięcie przez overlay
    - przejście do hamburgera
    - powrót do desktop i natywne `<details>`

## Ostatnia sesja — 2026-06-06 — Mobile-language-switcher

- Aktywny brief:
  - `Mobile-language-switcher`
- Cel:
  - przenieść wybór języka na mobile do wnętrza menu hamburgera w `header-1`
  - bez ruszania desktopowego partiala i bez zmian w JS/CSS
- Wykonane zmiany:
  - w `resources/views/partials/header-1.antlers.html`
    - wrapper z `{{ partial:language-switcher }}` zmieniony na:
      - `hidden lg:flex items-center gap-2 relative`
    - po `</ul>` w `#navbar-default` dodana mobilna sekcja locale:
      - `{{ locales all="true" current_first="true" }}`
      - linki z `hreflang`, `lang`, nazwą locale i shortcode
      - aktywny locale wyróżniony klasami:
        - `text-primary-900 font-semibold`
- Decyzja wykonawcza:
  - nie dodawałem labela `Language` / `Język`
  - dzięki temu nie było potrzeby zmiany:
    - `lang/pl.json`
    - `lang/en.json`
- Walidacja:
  - `php artisan test` — OK (`2 passed`)
  - `php artisan view:clear` — OK
  - `GET /` — `200`
  - `GET /en/` — `200`
  - w HTML `/` potwierdzone:
    - mobilny blok:
      - `lg:hidden bg-white border-t border-gray-200`
    - locale:
      - `Polski`
      - `English`
      - `hreflang="pl"`
      - `hreflang="en"`
    - desktop wrapper:
      - `hidden lg:flex items-center gap-2 relative`
- Ważna uwaga:
  - `bg-white` na nowym `<div>` jest rzeczywiście potrzebne, bo sekcja językowa jest rodzeństwem `ul.navbar` i nie dziedziczy automatycznie jego tła
  - końcowego testu dotykowego / viewportowego nie zrobiłem automatycznie w tej sesji, więc nadal warto ręcznie kliknąć:
    - hamburger < `992px`
    - `English`
    - resize do desktop i check, że HOTFIX-15 nadal zamyka menu
- Stan dokumentacji przy starcie:
  - `BRIEF_CODEX.md`, `PROJECT_STATUS_CODEX.md` i `CLAUDE_MEMORY.md` były zsynchronizowane na tym zadaniu
  - moja pamięć robocza była krok z tyłu (`none`), ale to nie blokowało pracy, bo aktywny brief był jednoznaczny

## Notatka zamykająca — 2026-06-06 — stan po aktualizacji Claude po Update-statamic-cms-6.20.2

- Przed zakończeniem sesji sprawdziłem:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/BRIEF_CODEX.md`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/PROJECT_STATUS_CODEX.md`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/CLAUDE_MEMORY.md`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/CHANGE-LOG.md`
- `PROJECT_SYNC` jest już zsynchronizowany między trzema głównymi plikami i pokazuje:
  - `active_task_id: none`
  - `active_task_status: none`
  - `last_closed: Update-statamic-cms-6.20.2`
  - `next_after_active: Formularze`
- Claude dopisał do dokumentacji także ważne rzeczy z dzisiejszej końcówki:
  - zamknięcie `Update-statamic-cms-6.20.2`
  - praktyczny workflow dla `composer-patches 2.x`:
    - `composer patches-relock`
    - `composer patches-repatch`
  - deploy przyrostowy na `dev.skalisty.pl`
  - pull zmian online z `content/seo-pro/redirects/pl/ppp.yaml` i plików `.meta/`
- Nie widzę już blokującego doc driftu:
  - brief ma poprawny stan `BRAK AKTYWNEGO ZADANIA`
  - status projektu ma `Brak aktywnych zadań`
  - pamięć Claude jest zsynchronizowana na `none`
- Stan faktyczny na koniec tej sesji:
  - `Update-statamic-cms-6.20.2` — wykonane i formalnie zamknięte
  - `statamic/cms` = `v6.20.2`
  - patch HOTFIX-18 siedzi w vendorze po `patches-relock + patches-repatch`
  - serwis lokalny i `en` odpowiadają `200`
  - następny zapisany kierunek:
    - `Formularze`

## Ostatnia sesja — 2026-06-06 — Update-statamic-cms-6.20.2

- Aktywny brief:
  - `Update-statamic-cms-6.20.2`
- Cel:
  - podnieść `statamic/cms` z `v6.20.0` do `v6.20.2`
  - i potwierdzić, że patch:
    - `statamic-cms-locales-proc-open-fallback.patch`
    - nadal daje się zastosować po aktualizacji
- Przebieg:
  - `composer update statamic/cms --with-dependencies` podniósł:
    - `statamic/cms` do `v6.20.2`
    - oraz pakiety `guzzlehttp/*`
  - pierwsza walidacja wykazała, że patch dla `statamic/cms` nie siedzi jeszcze w:
    - `vendor/statamic/cms/src/Dictionaries/Locales.php`
  - przyczyna:
    - `composer.json` miał już wpis patcha
    - ale `patches.lock.json` nie zawierał jeszcze sekcji dla `statamic/cms`
  - do domknięcia trzeba było użyć natywnego workflow `composer-patches 2.x`:
    - `composer patches-relock`
    - `composer patches-repatch`
  - dopiero wtedy Composer jawnie wykonał:
    - `Patching statamic/cms`
  - i patched `Locales.php` dostał:
    - fallback `function_exists('proc_open')`
    - fallback `scandir('/usr/share/locale')`
- Walidacja końcowa:
  - `composer show statamic/cms | grep -i versions` — `v6.20.2`
  - `php artisan test` — OK (`2 passed`)
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan view:clear` — OK
  - `php artisan config:clear` — OK
  - `GET /` — `200`
  - `GET /en/` — `200`
- Ważny wniosek operacyjny:
  - w tym projekcie samo dopisanie patcha do `composer.json` nie gwarantuje jeszcze jego realnego użycia
  - trzeba pilnować synchronizacji `patches.lock.json`
  - a przy zmianach w definicjach patchy sensowną ścieżką jest:
    - `composer patches-relock`
    - `composer patches-repatch`

## Notatka zamykająca — 2026-06-06 — stan po aktualizacji Claude

- Sprawdziłem końcowy stan plików:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/BRIEF_CODEX.md`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/PROJECT_STATUS_CODEX.md`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/CLAUDE_MEMORY.md`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/CHANGE-LOG.md`
- Najważniejszy nowy stan:
  - `PROJECT_SYNC` w trzech głównych plikach jest już zsynchronizowany na:
    - `active_task_id: none`
    - `last_closed: Tailwind-v4-syntax-fix`
    - `next_after_active: Formularze`
  - czyli formalnie na koniec tej sesji:
    - brak aktywnego zadania dla Codexa
- Claude dopisał poprawnie do:
  - `PROJECT_STATUS_CODEX.md`
  - `CLAUDE_MEMORY.md`
  - `CHANGE-LOG.md`
  informację o zamknięciu `Tailwind-v4-syntax-fix`
- Wykryty doc drift:
  - blok `PROJECT_SYNC` w `BRIEF_CODEX.md` jest poprawny
  - ale ciało `BRIEF_CODEX.md` nadal pokazuje zamknięty `Tailwind-v4-syntax-fix` jako `AKTYWNE`
  - to jest niespójne z `AGENTS.md` i zapisałem to do `CODEX_SUGGESTIONS.md`
- Co uznaję za stan faktyczny na teraz:
  - `Tailwind-v4-syntax-fix` — wykonany przeze mnie i zamknięty przez Claude
  - brak aktywnego zadania
  - następny zapisany kierunek:
    - `Formularze`

## Ostatnia sesja — 2026-06-06 — Tailwind-v4-syntax-fix

- Aktywny brief:
  - `Tailwind-v4-syntax-fix`
- Cel:
  - naprawić cztery miejsca w `public/assets/css/tailwind.css`, które używały martwego kodu lub składni Tailwind v3
- Wykonane zmiany:
  - usunięte:
    - `--container-center: true`
    - `--container-padding: 1rem`
  - usunięte 4 bloki `@font-face` dla `El Messiri`
  - zmienione:
    - `bg-gradient-to-t` → `bg-linear-to-t`
  - zmienione:
    - `theme("colors.primary.900")` → `var(--color-primary-900)`
- Walidacja:
  - `npm run build` — OK
  - `tailwind.css` po zmianie nie zawiera już starej składni z briefu
  - `output.css` zawiera wygenerowany `linear-gradient(...)`
  - `output.css` nie zawiera `bg-gradient-to-t`
- Ważna obserwacja:
  - `output.css` nadal zawiera `@font-face` dla `El Messiri`, ale to nie pochodzi już z `tailwind.css`
  - źródłem jest:
    - `public/assets/css/swiper-bundle.css`
  - więc brief został wykonany poprawnie, a to jest osobny temat ewentualnego cleanupu
- Stan dokumentacji:
  - `BRIEF_CODEX.md`, `PROJECT_STATUS_CODEX.md` i `CLAUDE_MEMORY.md` były zsynchronizowane na tym zadaniu
  - bez doc driftu

## Ostatnia sesja — 2026-06-06 — Sync-z-komputera-zapasowego

- Aktywny brief:
  - `Sync-z-komputera-zapasowego`
- Cel:
  - przenieść do głównego projektu trzy zmiany przygotowane na komputerze zapasowym:
    - logo fix
    - YouTube iframe w `our_story_section`
    - nowy blok `Skalisty Gallery Section`
- Wykonane zmiany:
  - w `resources/views/partials/header-1.antlers.html`
    - `xl:max-w-[300px]`
    - `1xl:max-w-[340px]`
  - w `content/globals/pl/setting.yaml`
    - `logo` i `logo_white` przełączone z SVG na PNG
  - wygenerowane przez `inkscape`:
    - `public/assets/images/identyfikacja-strony/logo-skalisty-2.png`
    - `public/assets/images/identyfikacja-strony/logo-skalisty-white-2.png`
  - w `resources/views/page_builder/our_story_section.antlers.html`
    - `<video>` zastąpione `<iframe data-src="...">`
  - w `public/assets/js/custom.js`
    - nowa logika `toEmbedUrl()`
    - modal używa YouTube embed
    - zamknięcie resetuje `src` do `about:blank`
  - dodany nowy builder block:
    - `resources/fieldsets/skalisty_gallery_section.yaml`
    - `resources/views/page_builder/skalisty_gallery_section.antlers.html`
    - rejestracja w `resources/fieldsets/all_page_builder.yaml`
  - w `resources/blueprints/collections/galleries/gallery.yaml`
    - usunięte `max_files: 1`
- Walidacja:
  - `npm run build` — OK
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK (`2 passed`)
- Dodatkowa uwaga:
  - `inkscape` wypisał ostrzeżenia o lokalnym logu i `GtkRecentManager`, ale wygenerował PNG poprawnie i zakończył się kodem `0`
- Stan dokumentacji:
  - `BRIEF_CODEX.md`, `PROJECT_STATUS_CODEX.md` i `CLAUDE_MEMORY.md` były zsynchronizowane na tym zadaniu
  - bez doc driftu przy starcie implementacji

## Notatka zamykająca — 2026-06-05/06 — stan po aktualizacji Claude

- Przed zakończeniem dnia sprawdziłem:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/BRIEF_CODEX.md`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/PROJECT_STATUS_CODEX.md`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/CLAUDE_MEMORY.md`
  - oraz bieżący stan plików projektu
- Najważniejszy nowy stan:
  - `BRIEF_CODEX.md` i `PROJECT_STATUS_CODEX.md` pokazują już:
    - `active_task_id: none`
    - `last_closed: HOTFIX-18`
    - `next_after_active: Formularze`
  - czyli formalnie **brak aktywnego zadania**
- Claude dopisał też nowy zamknięty etap:
  - `HOTFIX-18`
  - dotyczy patcha `statamic/cms` pod problem z `Statamic\\Dictionaries\\Locales`
  - według dokumentacji:
    - patch został dodany do `patches/`
    - wdrożony lokalnie i na serwerze
    - dotyczy crasha CP > Settings > Sites
- Ważny doc drift na koniec dnia:
  - `CLAUDE_MEMORY.md` nadal ma stary `PROJECT_SYNC`
    - `active_task_id: Zabezpieczenie-patchy-vendora`
    - `active_task_status: active`
  - podczas gdy `BRIEF_CODEX.md` i `PROJECT_STATUS_CODEX.md` są już ustawione na:
    - `none`
- Zgodnie z `AGENTS.md` źródłem prawdy pozostaje:
  - `BRIEF_CODEX.md`
- Co uznaję za stan faktyczny na koniec dnia:
  - `SEO-Pro` — wykonane przeze mnie i zwalidowane
  - `HOTFIX-18` — wykonany po stronie Claude, odnotowany w dokumentacji
  - aktywnego zadania dla Codexa obecnie brak
  - kolejny kierunek zapisany przez Claude:
    - `Formularze`
- Dodatkowa obserwacja:
  - repo nadal zawiera bardzo dużo lokalnych zmian w contentcie i configu, które nie wynikają z mojego ostatniego kroku
  - nie ruszałem ich i traktuję je jako istniejący stan projektu / prac równoległych

## Ostatnia sesja — 2026-06-05 — SEO-Pro

- Aktywny brief:
  - `SEO-Pro`
- Cel:
  - zainstalować `statamic/seo-pro`
  - podpiąć `{{ seo_pro:meta }}` do wspólnego `<head>`
  - uruchomić podstawową infrastrukturę SEO dla `pl/en`
- Zmiany:
  - `composer require statamic/seo-pro`
  - published config:
    - `config/statamic/seo-pro.php`
  - w `resources/views/partials/head-link.antlers.html`
    - usunięty ręczny `<title>`
    - dodane `{{ seo_pro:meta }}`
  - zapisane settings addonu:
    - `resources/addons/seo-pro.yaml`
    - osobne description dla `pl` i `en`
    - `Organization` JSON-LD dla `Skalisty`
    - breadcrumbs włączone
- Walidacja:
  - `GET /`:
    - `status=200`
    - title / description / og:title obecne
  - `GET /en/`:
    - `status=200`
    - english description obecny
  - `GET /sitemap.xml`:
    - `status=200`
    - poprawny XML
  - `php artisan test` — OK
  - `php artisan statamic:stache:refresh` — OK
- Ważne odchylenia:
  - w `statamic/seo-pro v7.10.1` nie istnieje komenda:
    - `php artisan seo-pro:install`
  - brief zakładał też collection default:
    - `JSON-LD Type: Article` dla `blogs`
  - w tej wersji addonu nie ma natywnego pola tego typu w section defaults
  - addon wspiera za to:
    - `json_ld_entity`
    - `json_ld_schema`
    - `json_ld_breadcrumbs`
- Dodatkowa obserwacja:
  - podczas checków przez tinker/kernel pojawiały się deprecated warnings z Antlers (`str_replace(... null ...)`)
  - nie blokowało to SEO Pro, ale warto pamiętać o tym przy dalszych upgrade'ach
- Doc drift:
  - `BRIEF_CODEX.md` i `PROJECT_STATUS_CODEX.md` były na `SEO-Pro`
  - `CLAUDE_MEMORY.md` nadal pokazywało `Zabezpieczenie-patchy-vendora`
  - brief był jednoznaczny, więc zadanie wykonałem zgodnie z `AGENTS.md`

## Ostatnia sesja — 2026-06-05 — Zabezpieczenie-patchy-vendora

- Aktywny brief:
  - `Zabezpieczenie-patchy-vendora`
- Cel:
  - sformalizować hotfixy w vendorze jako patche Composer, żeby nie ginęły po `composer install/update`
- Zmiany:
  - dodany `cweagans/composer-patches:^2.0`
  - w `composer.json`:
    - `allow-plugins.cweagans/composer-patches = true`
    - `extra.composer-exit-on-patch-failure = true`
    - `extra.patches` z 4 wpisami dla `el-schneider/statamic-magic-translator`
  - utworzony katalog `patches/` z 4 plikami `.patch`
  - wygenerowany `patches.lock.json`
- Ważne wykonanie techniczne:
  - lokalny `git diff` dla plików vendora był pusty
  - patche wygenerowałem więc względem czystych plików paczki z commita z `composer.lock`:
    - `bae49e1917e7e5bd780ee133470de28643dfdf8d`
- Walidacja:
  - pełne `rm -rf vendor` + reinstalacja Composerem przeszły
  - podczas instalacji pojawiło się `Patching el-schneider/statamic-magic-translator`
  - 4 patche zostały zastosowane
  - odtworzony vendor nadal zawiera:
    - `Fieldset::find(...)`
    - `group`
    - `wysiwyg_html`
    - `extractGroup(...)`
    - `tag_handling: html`
  - `php artisan test` — OK
  - `php artisan statamic:stache:refresh` — OK
  - kernel request:
    - `POST /cp/magic-translator/translate`
    - `status=200`
    - `success=true`
- Wniosek:
  - hotfixy 10, 11, 16 i 17 są już zabezpieczone przed utratą przy reinstalacji vendora
- Uwaga:
  - `composer-patches` 2.0 tworzy `patches.lock.json` i warto go zachować w repo jako część rozwiązania
  - repo ma dużo innych lokalnych zmian niezwiązanych z tym taskiem; nie ruszałem ich

## Ostatnia sesja — 2026-06-05 — Logo-fix

- Aktywny brief:
  - `Logo-fix`
- Cel:
  - usunąć obcięcie logo w headerze i stopce na breakpointach laptopowych
- Zmiany:
  - w `resources/views/partials/header-1.antlers.html`
    - poszerzony kontener logo na `xl/1xl`
    - dopisane `max-w-full w-auto` do `<img>`
  - w `resources/views/partials/footer-1.antlers.html`
    - zamiana klas logo z podejścia `max-w-*` na `h-* + w-auto + max-w-full`
- Walidacja:
  - `php artisan test` — OK (`2 passed`)
- Wniosek:
  - fix jest zgodny z briefem i ograniczony do 2 partiali
  - powinien usuwać clipping logo na laptopie bez ruszania reszty layoutu
- Do ręcznego checku:
  - header i footer na viewportach laptopowych oraz desktopowych
- Doc drift:
  - `BRIEF_CODEX.md` i `PROJECT_STATUS_CODEX.md` były zsynchronizowane na `Logo-fix`
  - `CLAUDE_MEMORY.md` nadal pokazywało `Auto-start-queue-worker`
  - brief był jednoznaczny, więc wykonałem zadanie zgodnie z `AGENTS.md`

## Ostatnia sesja — 2026-06-05 — Auto-start-queue-worker

- Aktywny brief:
  - `Auto-start-queue-worker`
- Cel:
  - automatycznie uruchamiać `queue:work --queue=translations --stop-when-empty`
  - bez ręcznego SSH / CLI po kliknięciu `Tłumacz`
- Zmiany:
  - w `app/Providers/AppServiceProvider.php`
    - dodany `Event::listen(JobQueued::class, ...)`
    - filtr tylko dla `translations`
    - guard przez `pgrep -f "[q]ueue:work.*translations"`
    - start background worker przez `exec()`
  - poprawiony komentarz w `DeepLTranslationService.php`
  - usunięty testowy plik `content/collections/pages/cs/test.md`
  - dopisane odchylenie w `server_deploy/DEPLOYMENT.md`:
    - `MAGIC_TRANSLATOR_QUEUE_CONNECTION=sync` na serwerze
- Ważne odkrycia:
  - poprawne pole eventu to:
    - `$event->queue`
    - nie `$event->job->queue`
  - wzorzec `[q]...` był potrzebny, żeby `pgrep` nie łapał samego procesu sprawdzającego
- Walidacja:
  - `php artisan test` — OK
  - ręczny probe `JobQueued` potwierdził:
    - `queue = translations`
    - `jobClass = TranslateEntryJob`
  - po dispatchu joba `autostart-live` i utrzymaniu procesu PHP przy życiu:
    - `pgrep` pokazał uruchomiony worker:
      - `/usr/bin/php8.3 ... artisan queue:work --queue=translations --stop-when-empty`
- Ograniczenie walidacji:
  - backgroundowy worker w tej sesji sandboxowej trafił na:
    - `Could not resolve host: api-free.deepl.com`
  - więc sam job nie doszedł tu do `DONE`, tylko do `failed`
  - to wygląda na ograniczenie DNS procesu potomnego w sandboxie, nie na błąd implementacji listenera
- Wniosek:
  - auto-start workera działa kodowo i procesowo
  - pełny check `DONE` dla backgroundowego tłumaczenia trzeba jeszcze potwierdzić poza ograniczeniem sandboxa
- Doc drift:
  - `BRIEF_CODEX.md` i `PROJECT_STATUS_CODEX.md` były zsynchronizowane na `Auto-start-queue-worker`
  - `CLAUDE_MEMORY.md` nadal było opóźnione i pokazywało `Translator-API-Panel`

## Ostatnia sesja — 2026-06-05 — HOTFIX-17 — DeepL tag_handling xml → html

- Aktywny brief:
  - `HOTFIX-17-deepl-tag-handling`
- Cel:
  - usunąć błąd DeepL `mismatched tag`
  - odblokować tłumaczenie wpisów zawierających HTML z `wysiwyg_html`
- Zmiana:
  - w `vendor/el-schneider/statamic-magic-translator/src/Services/DeepLTranslationService.php`
  - `TranslateTextOptions::TAG_HANDLING` zmienione z `xml` na `html`
- Walidacja:
  - `php artisan test` — OK
  - realny worker:
    - `php artisan queue:work --queue=translations --stop-when-empty --tries=1`
  - dispatch joba `TranslateEntryJob` dla `Home` z `pl` do `cs`
  - wynik workera:
    - `TranslateEntryJob 1s DONE`
  - cache joba:
    - `magic-translator:job:hotfix17-home-cs` = `completed`
  - logi:
    - `deepl_request` dla `cs_CZ`, `unit_count = 124`
    - `deepl_response` dla `cs_CZ`, `unit_count = 124`
    - brak nowego `mismatched tag`
  - zapisany plik:
    - `content/collections/pages/cs/home.md`
  - dodatkowy check regresji EN:
    - test serwisu `pl_PL -> en_US` z HTML zwrócił poprawne tłumaczenie
- Wniosek:
  - `tag_handling = html` naprawia pipeline DeepL dla treści HTML
  - `PL -> CS` działa już end-to-end
  - `PL -> EN` nadal działa
- Uwaga:
  - to patch w vendorze, tak samo jak wcześniejsze HOTFIX 10/11/16
  - potrzeba zabezpieczenia patchy vendora staje się jeszcze bardziej realna
- Doc drift:
  - `BRIEF_CODEX.md` i `PROJECT_STATUS_CODEX.md` były poprawnie na `HOTFIX-17`
  - `CLAUDE_MEMORY.md` nadal było opóźnione i pokazywało `Translator-API-Panel`
  - brief był jednak jednoznaczny, więc wykonałem zadanie zgodnie z `AGENTS.md`

## Notatka zamykająca — 2026-06-02 — stan po aktualizacji Claude

- Przed zakończeniem dnia sprawdziłem nowe wpisy Claude w:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/BRIEF_CODEX.md`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/PROJECT_STATUS_CODEX.md`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/CLAUDE_MEMORY.md`
- Wykryty rozjazd:
  - Claude ustawił ponownie `Translator-API-Panel` jako aktywne zadanie
  - ale ten panel był już wcześniej przeze mnie wykonany i technicznie zwalidowany
  - realnie ostatnim wykonanym dziś zadaniem jest `HOTFIX-16`
- Co uznaję za stan faktyczny na koniec dnia:
  - `Translator-API-Panel` — wykonane wcześniej
  - `HOTFIX-16` — wykonane dziś
  - dokumentacja Claude wymaga przy następnym przebiegu korekty, żeby nie cofała aktywnego zadania do już zamkniętego panelu
- Ten rozjazd zapisałem też w `CODEX_SUGGESTIONS.md`.

## Ostatnia sesja — 2026-06-02 — HOTFIX-16 — wysiwyg_html translation support

- Aktywny brief: `HOTFIX-16-wysiwyg-translation`
- Cel:
  - włączyć obsługę pól `wysiwyg_html` w `Magic Translator`
  - odblokować tłumaczenie `Free Text Section` w trybie `single` i `columns`
- Zmiany:
  - w `vendor/el-schneider/statamic-magic-translator/src/Extraction/FieldClassifier.php`
    - `wysiwyg_html` dodane do `Tier1` w `classify()` i `classifyNested()`
    - `wysiwyg_html` mapowane do `TranslationFormat::Html`
  - w `resources/fieldsets/free_text_section.yaml`
    - `localizable: true` dodane do `content`
    - `localizable: true` dodane do `columns`
- Walidacja:
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK
  - `php artisan tinker` potwierdził:
    - `content_tier = Tier1`
    - `content_format = html`
    - `columns_tier = Tier2`
    - `nested_content_tier = Tier1`
    - `nested_content_format = html`
    - ekstrakcja zwraca ścieżki:
      - `content`
      - `columns.0.content`
      - `columns.1.content`
  - dodatkowo na realnym wpisie `Home` ekstraktor zwraca:
    - `page_builder.2.content`
    - format = `html`
- Wniosek:
  - `Magic Translator` widzi już treść `wysiwyg_html` jako HTML do tłumaczenia
  - `Free Text Section` nie powinno już być pomijane przez ekstraktor
- Uwaga:
  - to patch w vendorze, więc trzeba pamiętać o nim przy przyszłych aktualizacjach pakietu
  - `next_after_active` w briefie wskazuje `Translator-API-Panel`, ale ten panel został już wcześniej wykonany technicznie, więc Claude powinien sprawdzić, czy backlog nie wymaga korekty

## Ostatnia sesja — 2026-06-02 — Frontend string translation

- Wdrożone podejście JSON:
  - `lang/pl.json`
  - `lang/en.json`
- Podmienione hardcoded stringi na `{{ trans key="..." }}` w 20 widokach z briefu.
- `footer-3.antlers.html` i `footer-4.antlers.html` były na liście, ale nie miały pasujących stringów do zmiany.
- Walidacja:
  - `php artisan view:clear` — OK
  - `php artisan test` — OK
  - kernel request `/` wykazał polskie `Submit`
  - kernel request `/en/` wykazał angielskie `Submit`
- Wniosek:
  - mechanizm tłumaczeń działa per site Statamic (`pl` / `en`)
  - nie jest ograniczony do samego `APP_LOCALE`
- Dodatkowo:
  - `lang/en.json` zawiera tylko korektę klucza z literówką `Enter your email adress`
  - reszta EN leci przez fallback do klucza
- Uwaga dokumentacyjna:
  - `next_after_active: Feature-show-search` wygląda już na przestarzałe, bo ten feature został wcześniej domknięty

## Ostatnia sesja — 2026-06-02 — HOTFIX-15

- `HOTFIX-15` naprawia znikające pozycje menu po sekwencji mobile → otwarcie menu → zamknięcie → desktop.
- Zmiana:
  - w `public/assets/js/custom.js` do handlera resize dodany reset:
    - `navbarDefault.classList.remove("open")`
    - `mobileMenuToggle.classList.remove("active")`
    gdy `window.innerWidth >= 992`
- Walidacja:
  - `php artisan test` — OK
  - potwierdzenie obecności zmiany w kodzie przez `rg`
- Ograniczenie:
  - nie zrobiłem pełnej automatycznej walidacji w przeglądarce scenariusza resize
  - ten krok trzeba jeszcze kliknąć ręcznie na froncie

## Ostatnia sesja — 2026-06-02 — HOTFIX-14

- `HOTFIX-14` naprawił wcześniejsze wdrożenie `show_search`.
- Przyczyna była zgodna z briefem:
  - w headerach brakowało wejścia w scope `{{ theme_settings }}`
  - przez to `{{ if show_search }}` było falsy mimo poprawnej wartości w globals
- Zmiany:
  - dodane `{{ theme_settings }}` / `{{ /theme_settings }}` w `header-1.antlers.html` .. `header-4.antlers.html`
- Walidacja:
  - `php artisan view:clear` — OK
  - `php artisan test` — OK
  - runtime `/` przez kernel:
    - `status=200`
    - `searchToggle=yes`
    - `searchPlaceholder=yes`
- Wniosek:
  - hotfix przywrócił search do renderu przy `show_search = true`
  - po formalnym zamknięciu przez Claude następny priorytet powinien wrócić do `Frontend-string-translation`

## Ostatnia sesja — 2026-06-02 — Feature-show-search

- Użytkownik polecił wdrożyć ukrywanie pola wyszukiwania w headerze jeszcze przed formalną aktywacją tego zadania w `PROJECT_SYNC`.
- Mimo aktywnego briefu `Frontend-string-translation` wykonałem `Feature-show-search` na bezpośrednie polecenie użytkownika.
- Zmiany:
  - dodany toggle `show_search` w `resources/blueprints/globals/theme_settings.yaml`
  - dopisane `show_search: true` w `content/globals/pl/theme_settings.yaml`
  - warunki `{{ if show_search }}` w `header-1.antlers.html` .. `header-4.antlers.html`
- Walidacja:
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan view:clear` — OK
  - `php artisan test` — OK
- Ważna obserwacja:
  - runtime globali zwraca `show_search = true`
  - ale `/`, `/about-us`, `/contact-us` i `/en/contact-us` nie zawierają w HTML markerów `searchToggleWrapper`, `Search here...`, `searchSuggestions`
  - sugeruje to, że faktyczny frontend może dziś nie renderować żadnego z partiali `header-1..4`, albo korzysta z innego wariantu nagłówka
  - końcowy efekt `show_search` trzeba potwierdzić ręcznie w przeglądarce

## Projekt

- Workspace: `/home/pestycyd/Dokumenty/Skalisty-New-2`
- Aktywny projekt: `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion`
- Stack:
  - Laravel `13.12.0`
  - Statamic `6.20.0`
  - PHP `8.3.x`
- Motyw bazowy:
  - `webbycrown/orion-statamic-theme`

## Kontekst

- Wcześniejszy kierunek projektu sprzed hard resetu został świadomie porzucony.
- Nie wracamy do starej adaptacji opartej o ręczną migrację HTML i wcześniejsze eksperymenty z Invena.
- Obecny stan prawdy dotyczy wyłącznie świeżo postawionego projektu Orion.

## Co zostało zrobione

### 1. Czysty restart i nowa baza

- Postawiono od zera nowy projekt Statamic:
  - `composer create-project statamic/statamic skalisty-orion`
- Na świeżą instalację nałożono eksport projektu Orion.
- Wykonano build assetów:
  - `npm install`
  - `npm run build`

### 2. Uruchomienie projektu

- Frontend działa pod:
  - `http://127.0.0.1:8001`
- Panel CP:
  - `http://127.0.0.1:8001/cp`
- `APP_URL` zostało ustawione na:
  - `http://127.0.0.1:8001`

### 3. Naprawy kompatybilności Oriona

- Orion był przygotowany pod starszą wersję Statamic i wymagał korekt pod Statamic 6.
- Naprawiono ładowanie części demo contentu i globals.
- Poprawiono renderowanie niektórych sekcji, gdzie pojawiały się puste wartości assetów lub linków.

### 4. Scroll lock fix

- Naprawiono problem z brakiem scrollowania strony.
- Przyczyną były popupy newsletter/cookies blokujące `body`.

### 5. Kolorystyka

- Domyślny kierunek kolorystyczny strony został zmieniony na żółty / złoty.
- Zmiany dotyczą głównego presetu motywu i zachowania frontendu po stronie CSS/JS.

### 6. Multisite

- Włączono natywny multisite Statamic.
- Aktualny układ języków:
  - `pl` pod `/`
  - `en` pod `/en/`

### 7. Przełącznik języków

- Dodano frontendowy przełącznik języków.
- Obecnie działa jako mały dropdown przygotowany pod przyszłe kolejne języki.
- Rozwiązanie opiera się o natywne `{{ locales }}` Statamic, bez osobnego pluginu.

### 8. Edytowalność page buildera

- Naprawiono problem z wyszarzonymi polami w builderze na lokalizacjach.
- `page_builder` został ustawiony jako localizable.
- Uporządkowano problematyczne pola hero, w tym konfliktujące pole `type`.
- Naprawiono zapis assetów hero tak, aby CP poprawnie pokazywał i pozwalał edytować obrazki.

### 9. Tłumaczenia contentu

- Zainstalowano:
  - `el-schneider/statamic-magic-translator`
- Skonfigurowano tłumaczenia przez DeepL.
- Ustawiono kolejkę tłumaczeń na `database`.
- Po wymianie klucza DeepL tłumaczenia zaczęły działać poprawnie.
- Ważna notatka operacyjna:
  - po zmianie `DEEPL_API_KEY` trzeba wykonać `php artisan config:clear`
  - oraz `php artisan queue:restart`

### 10. Super Admin Toolbar

- Zainstalowano:
  - `superinteractive/statamic-super-admin-toolbar`
- Opublikowano assety addonu.
- Dodano tag toolbaru do head motywu.
- Toolbar został też potwierdzony wizualnie przez użytkownika jako działający na froncie.

### 11. Globals origin fix

- Naprawiono odwrócony model `origin` w 8 plikach metadanych globals.
- Zmieniono model z:
  - `en -> null`
  - `pl -> en`
- na:
  - `en -> pl`
  - `pl -> null`
- Nie ruszano:
  - `theme_settings.yaml`
- Po zmianie wykonano:
  - `php artisan statamic:stache:refresh`
- Testy aplikacji nadal przechodzą.

### 12. Natywny selektor entries w menu

- Włączono natywne `Link to Entry` dla `Main` navigation.
- Przyczyną problemu był brak sekcji `collections:` w:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/content/navigation/main.yaml`
- Do nawigacji przypisano kolekcje:
  - `pages`
  - `projects`
  - `services`
  - `blogs`
  - `teams`
  - `faqs`
  - `galleries`
  - `packages`
  - `testimonials`
  - `job_positions`
- Dzięki temu CP powinien teraz pokazywać zarówno:
  - `Add Nav Item`
  - `Add Link to Entry`
- Nie było potrzeby zmiany blueprintu megamenu ani renderera headera.
- Po zmianie wykonano:
  - `php artisan statamic:stache:refresh`
- Testy aplikacji nadal przechodzą.

### 13. Fix TypeError w navigation CP entries picker

- Naprawiono bug powodujący crash przy `Add Link to Entry` w edytorze nawigacji CP.
- Przyczyną były pola:
  - `content: type: markdown`
  - bez `listable: false`
  w blueprintach `pages/page.yaml` i `default.yaml`.
- Przy wielu kolekcjach w entries picker Statamic używał listingu z blueprintu `pages`, a wpisy z kolekcji `blogs` miały `content` jako Bard array, co kończyło się:
  - `Markdown::preProcessIndex(array)` → TypeError
- Fix:
  - dodano `listable: false` do pola `content` w:
    - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/blueprints/collections/pages/page.yaml`
    - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/blueprints/default.yaml`
- Po zmianie wykonano:
  - `php artisan statamic:stache:refresh`
  - `php artisan view:clear`
  - `php artisan test`
- Dodatkowa walidacja:
  - backendowy request do `/cp/fieldtypes/relationship` wykonany jako zalogowany admin zwrócił `200` i dane wpisów
  - to potwierdza, że crash na requestcie selektora nie występuje już po fixie

### 14. Rozszerzenie multisite o 10 nowych locale — etap konfiguracyjny

- Dodano do konfiguracji site'y:
  - `sv`, `no`, `nl`, `lv`, `it`, `fr`, `es`, `de`, `da`, `cs`
- Zaktualizowano:
  - `resources/sites.yaml`
  - 10 plików `content/collections/*.yaml`
  - 9 plików `content/globals/*.yaml`
- `php artisan statamic:stache:refresh` — OK
- `php artisan cache:clear` — OK
- `php artisan test` — OK
- Runtime potwierdza obecność 12 site'ów przez `Statamic\\Facades\\Site::all()`.

### 15. Ważne ograniczenie multisite po rozszerzeniu

- Same zmiany konfiguracyjne nie spowodowały, że nowe locale zaczęły od razu renderować homepage.
- Kontrolne requesty:
  - `/sv/`
  - `/de/`
  - `/fr/`
  - `/cs/`
  nadal zwracają `404`.
- Zweryfikowana przyczyna:
  - nowe site'y nie mają jeszcze lokalizacji wpisów `pages`, w tym `home`
  - istnieją tylko trees dla `pl` i `en`
  - brak trees / materialized localizations dla nowych locale
- Wniosek:
  - do pełnego uruchomienia nowych języków potrzebny jest kolejny etap ponad sam brief konfiguracyjny
  - prawdopodobnie obejmujący tworzenie localizations wpisów i/lub trees dla nowych site'ów

### 16. Fallback 302 dla nowych locale

- Zamiast materializować od razu lokalizacje wpisów dla 10 nowych locale wdrożono tymczasowy fallback 302 do wersji polskiej.
- Implementacja znajduje się w:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/bootstrap/app.php`
- Mechanizm działa dla:
  - `sv`, `no`, `nl`, `lv`, `it`, `fr`, `es`, `de`, `da`, `cs`
- Logika:
  - `/de/` → `/`
  - `/sv/about-us` → `/about-us`
  - `/fr/blog/jakis-wpis` → `/blog/jakis-wpis`
- Ważna obserwacja techniczna:
  - sama ścieżka `render(NotFoundHttpException ...)` nie wystarczyła
  - skuteczne rozwiązanie wymagało użycia `respond(...)` na finalnej odpowiedzi 404 w `withExceptions()`
- Zweryfikowane programowo:
  - nowe locale dostają `302`
  - `/en/` pozostaje `200`
  - zwykły brak-locale `404` pozostaje `404`

### 17. Free Text Section w page builderze

- Dodano nowy blok buildera:
  - `Free Text Section`
- Stworzone pliki:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/fieldsets/free_text_section.yaml`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/page_builder/free_text_section.antlers.html`
- Rejestracja bloku została dopięta w:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/fieldsets/all_page_builder.yaml`
- Pola bloku:
  - `width` (`full`, `90`, `75`, `66`, `50`)
  - `background_color`
  - `content` (`bard`, `save_html: true`)
- Render:
  - opcjonalne tło przez `background_color`
  - szerokość `full` jako `w-full`
  - pozostałe szerokości przez inline `max-width: {value}%; margin: 0 auto;`
- Walidacja techniczna:
  - `php artisan view:clear` — OK
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK
- Do domknięcia pozostaje ręczna walidacja w CP/front:
  - dodanie bloku na stronie
  - sprawdzenie szerokości, tła i renderu WYSIWYG

### 18. Tabler Icons jako osobny kontener Statamic

- Dodano nowy dysk:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/config/filesystems.php`
    - `icons` → `public/assets/icons`
- Dodano nowy kontener:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/content/assets/icons.yaml`
- Skopiowano bibliotekę Tabler Icons do:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/public/assets/icons/`
- Runtime potwierdza:
  - kontener `icons` istnieje
  - dysk `icons` jest podpięty poprawnie
  - katalog zawiera 5093 pliki SVG
- Ważne doprecyzowanie użytkownika:
  - celem zadania było wyłącznie wgranie ikon do nowego kontenera
  - nie integrować ich automatycznie z istniejącymi polami buildera
- Dlatego cofnięto wcześniejszą próbę przepięcia fieldsetów na `container: icons`.
- W trakcie stabilizacji po `stache:refresh` naprawiono jeszcze stare pola assetów używane przez homepage:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/fieldsets/our_story_section.yaml`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/fieldsets/logos_slider.yaml`
  - dodano brakujące `container: assets`
- Po tej korekcie:
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK

### 19. Hugeicons Static jako drugi osobny kontener Statamic

- Dodano nowy dysk:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/config/filesystems.php`
    - `icons2` → `public/assets/icons2`
- Dodano nowy kontener:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/content/assets/icons2.yaml`
- Dodano paczkę:
  - `@hugeicons/static` jako `devDependency`
- Skopiowano bibliotekę Hugeicons do:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/public/assets/icons2/`
- Zweryfikowano:
  - kontener `icons2` istnieje w runtime Statamic
  - kontener jest przypisany do dysku `icons2`
  - katalog zawiera `4497` plików SVG
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK
- Ważne:
  - zgodnie z briefem i modelem ustalonym przy `icons`, nie było żadnej integracji z builderem ani fieldsetami

### 20. Free Text Section — ulepszenia edytora Bard

- W `resources/fieldsets/free_text_section.yaml` pole `handle: content` typu `bard` zostało rozszerzone o:
  - `container: assets`
  - przycisk `source` na końcu listy `buttons`
- `save_html: true` pozostaje bez zmian
- `remove_empty_nodes: false` pozostaje bez zmian
- Celem zmiany jest:
  - otwieranie przeglądarki assets CP przy wstawianiu obrazków z poziomu Bard
  - dostęp do edycji surowego HTML przez `source`
- Walidacja techniczna:
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK
- Do ręcznego potwierdzenia przez użytkownika / Claude w CP pozostaje:
  - czy kliknięcie przycisku `image` otwiera asset browser
  - czy przycisk `<>` jest widoczny w toolbarze Bard

### 21. Free Text Section — przełącznik WYSIWYG / HTML

- `resources/fieldsets/free_text_section.yaml` zostało rozszerzone o:
  - `editor_mode` (`wysiwyg` / `html`)
  - condition dla pola `content`:
    - `if: editor_mode: 'not html'`
  - nowe pole `html_content` typu `code`
    - `mode: htmlmixed`
    - `mode_selectable: false`
    - `if: editor_mode: html`
- `resources/views/page_builder/free_text_section.antlers.html` renderuje teraz treść warunkowo:
  - dla `html` → `{{ html_content }}`
  - w przeciwnym razie → `{{ content }}`
- Ważny wniosek techniczny:
  - pole `code` w Statamic augmentuje do `ArrayableString`
  - w praktyce bezpieczniej użyć bezpośrednio `{{ html_content }}` niż zgadywać składnię z `.code` w Antlers
- Walidacja techniczna:
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK
- Do ręcznego potwierdzenia w CP/front pozostaje:
  - widoczność pól zależna od `editor_mode`
  - zapis trybu `html`
  - render surowego HTML na froncie

### 22. Addon `wysiwyg-html-fieldtype` — Etap 1

- Lokalizacja addonu w projekcie:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/addons/skalisty/wysiwyg-html-fieldtype/`
- Komenda generowania addonu w tej wersji Statamic wymaga pełnej nazwy pakietu Composer:
  - `php please make:addon skalisty/wysiwyg-html-fieldtype`
- Polecenie z krótkim slugiem z briefu nie przechodzi.
- Composer package name:
  - `skalisty/wysiwyg-html-fieldtype`
- Wersja lokalna ustawiona dla stabilności:
  - `0.1.0`
- Root projekt rejestruje addon jako lokalny `path repository` w:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/composer.json`
- Fieldtype class:
  - `Skalisty\\WysiwygHtmlFieldtype\\Fieldtypes\\WysiwygHtml`
- Statamic fieldtype handle:
  - `wysiwyg_html`
- Runtime potwierdza rejestrację przez:
  - `app(\\Statamic\\Fields\\FieldtypeRepository::class)->classes()->keys()`
- Ważne odchylenia od briefu:
  - `make:addon` próbował uruchomić wewnętrzny `composer install` i poległ na braku sieci do Packagista, ale scaffold pozostał utworzony
  - `make:fieldtype ... addon` nie rozpoznało świeżego addonu i wygenerowało pliki poza addonem; zostały uporządkowane ręcznie do właściwego katalogu
  - briefowa komenda `FieldtypeRepository::all()` jest nieaktualna dla tej wersji Statamic
- Etap 1 świadomie nie ładuje jeszcze aktywnie assetów Vite addonu w `ServiceProvider`
  - pliki JS/Vue są gotowe
  - aktywne ładowanie warto przywrócić razem z realnym frontendem addonu w Etapie 3

### 23. Addon `wysiwyg-html-fieldtype` — Etap 2

- Backendowa klasa fieldtype zostala uzupelniona w:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/addons/skalisty/wysiwyg-html-fieldtype/src/Fieldtypes/WysiwygHtml.php`
- `WysiwygHtml::augment()` zwraca:
  - `\Illuminate\Support\HtmlString`
- Fieldtype przechowuje i przetwarza czysty string HTML:
  - `defaultValue()` => `''`
  - `preProcess(null)` => `''`
  - `process(null)` => `''`
- `configFieldItems()` udostepnia obecnie dwie opcje konfiguracyjne:
  - `container`
  - `placeholder`
- Ważne odchylenie od briefu/testow:
  - w tej wersji Statamic poprawna walidacja runtime nie uzywa `FieldtypeRepository::make()`
  - nalezy uzywac:
    - `app(\Statamic\Fields\FieldtypeRepository::class)->find('wysiwyg_html')`
- Etap 2 nie wprowadza jeszcze zadnych zmian w Vue, Vite ani `ServiceProvider`

### 24. Addon `wysiwyg-html-fieldtype` — Etap 3

- Finalna konfiguracja Vite addonu:
  - build do `resources/dist`
  - stabilne nazwy artefaktow:
    - `addon.js`
    - `addon.css`
  - `vue` externalizowane do `window.Vue`
- Praktyczna uwaga:
  - briefowy `@statamic/cms/vite-plugin` nie zadzialal poprawnie w tym lokalnym addonie przy `file:` dependency do vendorowego `dist-package`
  - dlatego `vite.config.js` zostal zaadaptowany do lokalnego wariantu z wlasnym pluginem externalizujacym `vue`
- Poprawna nazwa komponentu fieldtype:
  - `wysiwyg_html-fieldtype`
  - nie:
  - `wysiwyg-html-fieldtype`
- Rejestracja skryptu w addon provider:
  - `protected $scripts = [__DIR__.'/../resources/dist/addon.js']`
- W addonie poprawiono tez lokalny dependency path do:
  - `@statamic/cms`: `file:../../../vendor/statamic/cms/resources/dist-package`
- Build Etapu 3 przeszedl:
  - `npm install`
  - `npm run build`
  - artefakty istnieja w `resources/dist/`
- Nie zostal jeszcze wykonany pelny manualny test CP dla toggle WYSIWYG ↔ HTML

### 25. Addon `wysiwyg-html-fieldtype` — Etap 4

- `Free Text Section` zostal uproszczony do jednego pola:
  - `content`
  - `type: wysiwyg_html`
- Usunieto tymczasowe pola:
  - `editor_mode`
  - `content` typu `bard`
  - `html_content`
- Widok:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/page_builder/free_text_section.antlers.html`
  renderuje teraz bezposrednio:
  - `{{ content }}`
- Dodano nowy blok buildera:
  - `wysiwyg_html_block`
- Nowe pliki:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/fieldsets/wysiwyg_html_block.yaml`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/page_builder/wysiwyg_html_block.antlers.html`
- Rejestracja bloku siedzi w:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/fieldsets/all_page_builder.yaml`
- Walidacja techniczna przeszla:
  - `php artisan statamic:stache:refresh`
  - `php artisan test`
- Nadal brak pelnego, recznego potwierdzenia runtime w CP dla:
  - renderu edytora w `Free Text Section`
  - obecnosci i dzialania `HTML Editor Block`

### 26. Addon `wysiwyg-html-fieldtype` — HOTFIX publicznego `addon.js`

- Statamic laduje skrypt addonu z:
  - `public/vendor/wysiwyg-html-fieldtype/js/addon.js`
- Sam build addonu tworzy artefakt tylko w:
  - `addons/skalisty/wysiwyg-html-fieldtype/resources/dist/addon.js`
- Rozwiazanie wdrozone w projekcie:
  - jednorazowy symlink publiczny:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/public/vendor/wysiwyg-html-fieldtype/js/addon.js`
  - ->
  - `../../../../addons/skalisty/wysiwyg-html-fieldtype/resources/dist/addon.js`
- To oznacza, ze kolejne `npm run build` aktualizuja plik publiczny automatycznie bez kopiowania.
- Walidacja HTTP poza sandboxem:
  - `curl http://127.0.0.1:8001/vendor/wysiwyg-html-fieldtype/js/addon.js`
  - zwrocilo:
  - `200`

### 27. Addon `wysiwyg-html-fieldtype` — HOTFIX IIFE / brak `@statamic/cms`

- Brief hotfixu wymagal, aby:
  - `resources/dist/addon.js` bylo budowane jako `iife`
  - komponent Vue nie importowal `@statamic/cms`
- Po weryfikacji okazalo sie, ze stan zrodel byl juz zgodny z briefem:
  - `vite.config.js` ma `format: 'iife'`
  - `WysiwygHtml.vue` uzywa lokalnego `defineProps` / `defineEmits`
  - brak importu `@statamic/cms`
- Wykonano walidacje:
  - `npm run build`
  - `head -3 addons/.../resources/dist/addon.js`
  - `php artisan statamic:stache:refresh`
  - `php artisan test`
- Potwierdzony wynik:
  - `resources/dist/addon.js` zaczyna sie od IIFE:
  - `(function(S){"use strict";`
  - testy przeszly:
  - `2 passed`
- Ten krok nie zmienial juz kodu zrodlowego addonu; byl walidacja juz wdrozonego hotfixu.

### 28. Addon `wysiwyg-html-fieldtype` — Etap 3b

- Zmieniono komponent:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/addons/skalisty/wysiwyg-html-fieldtype/resources/js/components/fieldtypes/WysiwygHtml.vue`
- Dodano devDependency:
  - `@tiptap/extension-link`
- Wdrozone poprawki:
  - fallback do plain textarea, gdy `window.CodeMirror` nie jest dostepny
  - usuniecie `theme: 'material'`
  - naprawa synchronizacji HTML -> WYSIWYG bez zalozenia istnienia `cmInstance`
  - obsluga `@input` dla fallback textarea
  - minimalna wysokosc dla `.ProseMirror`, `textarea` i `.CodeMirror`
  - przycisk linka `🔗`
  - przycisk fullscreen `⊡ / ⊠`
- Build i walidacja:
  - `npm install` — OK
  - `npm run build` — OK
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK (`2 passed`)
- Potwierdzenie runtime CP:
  - niezweryfikowane narzedziowo w tej sesji
  - nie potwierdzono ostatecznie, czy `window.CodeMirror` jest globalnie dostepny w aktualnym panelu
  - komponent zostal przygotowany defensywnie tak, aby brak tego globalu nie blokowal trybu HTML

### 29. Addon `wysiwyg-html-fieldtype` — Etap 3c

- Zmieniono komponent:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/addons/skalisty/wysiwyg-html-fieldtype/resources/js/components/fieldtypes/WysiwygHtml.vue`
- Wdrozone zmiany:
  - `<Teleport :disabled="!isFullscreen" to="body">` dla fullscreen
  - poprawiony CSS fullscreen z `min-height: 0` na dzieciach flex
  - nowe przyciski toolbara:
    - alignment `← ↔ →`
    - `blockquote` `❝`
    - `code inline` `` ` ``
    - `horizontal rule` `─`
    - `image` `🖼`
- Build i walidacja:
  - `npm run build` — OK
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK (`2 passed`)
- Potwierdzone przez uzytkownika (2026-06-01):
  - fullscreen dziala poprawnie
  - nowe przyciski widoczne i dzialaja
  - Teleport nie wprowadzil regresji sync WYSIWYG↔HTML

### 30. HOTFIX 4 — `update:value`

- W komponencie:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/addons/skalisty/wysiwyg-html-fieldtype/resources/js/components/fieldtypes/WysiwygHtml.vue`
- zmieniono event emitowany do Statamic:
  - `defineEmits(['input'])` -> `defineEmits(['update:value'])`
  - `emit('input', value)` -> `emit('update:value', value)`
- Powod:
  - Statamic 6 CP nasluchuje `update:value`, nie `input`
  - poprzedni komponent aktualizowal lokalny stan, ale nie zapisywal wartosci pola w publish form
- Build i walidacja:
  - `npm run build` — OK
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK (`2 passed`)
- Potwierdzone przez uzytkownika (2026-06-01):
  - zapis pola dziala end-to-end (dane nie sa juz tracone po zapisie strony)
  - aktywny podglad tresci w CP rowniez dziala

### 31. Addon `wysiwyg-html-fieldtype` — Etap 3d

- Zmieniono PHP fieldtype:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/addons/skalisty/wysiwyg-html-fieldtype/src/Fieldtypes/WysiwygHtml.php`
- Dodano:
  - `preload()` zwracajace `meta.container`
- Zmieniono komponent Vue:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/addons/skalisty/wysiwyg-html-fieldtype/resources/js/components/fieldtypes/WysiwygHtml.vue`
- Dodano:
  - prop `meta`
  - `showAssetBrowser`
  - `selectedAssets`
  - helper `cpUrl()`
  - handler `onAssetSelected()`
  - przycisk `📁`
  - teleportowany modal z `<asset-browser>`
- Build i walidacja:
  - `npm run build` — OK
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK (`2 passed`)
- Nadal niepotwierdzone narzedziowo:
  - czy `asset-browser` rozwiazuje sie poprawnie w runtime CP
  - czy wybor assetu zamyka modal i wstawia obraz
  - czy source mode pokazuje po tym poprawny `<img src="...">`

### 32. HOTFIX 5 — przycisk `📁`

- Zmieniono PHP fieldtype:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/addons/skalisty/wysiwyg-html-fieldtype/src/Fieldtypes/WysiwygHtml.php`
- Zmieniono komponent Vue:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/addons/skalisty/wysiwyg-html-fieldtype/resources/js/components/fieldtypes/WysiwygHtml.vue`
- Wdrozone poprawki:
  - `preload()` w `try/catch` z logowaniem do Laravel
  - `onMounted` diagnostyka `props.meta`
  - `watch` na `props.meta.container`
  - `dynamicContainer` + `effectiveContainer`
  - `openBrowser()` z fallback `fetch()` do `fields/field-meta`
  - usuniecie cichego `no-op` z przycisku `📁`
  - CSS dla `button:disabled`
- Build i walidacja:
  - `npm run build` — OK
  - `php artisan test` — OK (`2 passed`)
  - `php artisan cache:clear` — OK
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan config:clear` — OK
- Nadal niepotwierdzone narzedziowo:
  - czy `asset-browser` otwiera sie poprawnie po kliknieciu `📁`
  - czy runtime bierze kontener z preload czy z fallback fetch
  - czy wybor assetu wstawia obraz do TipTap

### 33. HOTFIX 6 — `asset-browser` crash przy otwarciu

- Zmieniono komponent Vue:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/addons/skalisty/wysiwyg-html-fieldtype/resources/js/components/fieldtypes/WysiwygHtml.vue`
- Wdrozone poprawki:
  - do `<asset-browser>` dodano `:selected-path=\"''\"`
- Powod:
  - komponent Statamic `asset-browser` crashowal przy mountowaniu, bo jego watcher oczekiwal stringa w `selectedPath`
  - bez tego propsa runtime konczyl sie na `undefined.endsWith()`
- Build i walidacja:
  - `npm run build` — OK
  - `php artisan test` — OK (`2 passed`)
- Nadal niepotwierdzone narzedziowo:
  - czy modal otwiera sie juz bez crasha w CP
  - czy wybor assetu zamyka modal
  - czy obraz trafia do edytora i zapisuje sie poprawnie

### 34. Etap 3e — dropdown naglowkow H1–H6

- Zmieniono komponent Vue:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/addons/skalisty/wysiwyg-html-fieldtype/resources/js/components/fieldtypes/WysiwygHtml.vue`
- Wdrozone poprawki:
  - `StarterKit` skonfigurowany z `heading.levels = [1, 2, 3, 4, 5, 6]`
  - dodano `currentHeadingLevel`
  - dodano `setHeading(level)`
  - usunieto osobne przyciski `H1/H2/H3`
  - dodano jeden dropdown `Normalny / H1–H6`
  - dodano CSS `.toolbar-select`
- Build i walidacja:
  - `npm run build` — OK
  - `php artisan test` — OK (`2 passed`)
- Nadal niepotwierdzone narzedziowo:
  - czy dropdown pokazuje aktualny poziom naglowka w CP
  - czy H4/H5/H6 stosuja sie poprawnie do biezacego bloku
  - czy powrot do `Normalny` ustawia paragraf

### 35. Free Text Section — `full_no_padding`

- Zmieniono fieldset:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/fieldsets/free_text_section.yaml`
- Zmieniono widok:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/page_builder/free_text_section.antlers.html`
- Wdrozone poprawki:
  - dodano nowa opcje szerokosci `full_no_padding`
  - `full` pozostaje bez zmian
  - `full_no_padding` renderuje bez bocznego i pionowego paddingu oraz bez marginesu dolnego
  - szerokosci procentowe pozostaja bez zmian
- Build i walidacja:
  - `php artisan view:clear` — OK
  - `php artisan statamic:stache:refresh` — OK
- Nadal niepotwierdzone narzedziowo:
  - czy opcja jest widoczna w dropdownie CP
  - czy frontend dla `full_no_padding` jest rzeczywiscie edge-to-edge
  - czy stare `full` zachowuje `px-4`

### 36. WYSIWYG — zaznaczanie obrazkow

- Zmieniono komponent Vue:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/addons/skalisty/wysiwyg-html-fieldtype/resources/js/components/fieldtypes/WysiwygHtml.vue`
- Wdrozone poprawki:
  - `img` w `.ProseMirror` ma teraz `cursor: pointer`
  - `img.ProseMirror-selectednode` ma niebieski outline zaznaczenia
- Build i walidacja:
  - `npm run build` — OK
  - `php artisan test` — OK (`2 passed`)
- Nadal niepotwierdzone narzedziowo:
  - czy outline pojawia sie po kliknieciu obrazka w CP
  - czy znika po kliknieciu poza obraz
  - czy `Delete` usuwa zaznaczony obraz bez regresji

### 37. Etap 3f — BubbleMenu dla obrazkow

- Zmieniono komponent Vue:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/addons/skalisty/wysiwyg-html-fieldtype/resources/js/components/fieldtypes/WysiwygHtml.vue`
- Wdrozone poprawki:
  - import `BubbleMenu` z `@tiptap/vue-3/menus`
  - rozszerzenie `Image` o atrybut `style`
  - funkcje `setImageAlign(align)` i `editImageUrl()`
  - BubbleMenu z akcjami `⬅ ⬛ ➡ ✏ ✕`
  - CSS dla `.wysiwyg-bubble-menu` i przyciskow
- Build i walidacja:
  - `npm run build` — OK
  - `php artisan test` — OK (`2 passed`)
- Nadal niepotwierdzone narzedziowo:
  - czy BubbleMenu pojawia sie po kliknieciu obrazka w CP
  - czy wyrównanie zapisuje `style=` na `<img>`
  - czy edycja URL i usuwanie obrazka dzialaja bez regresji

### 38. HOTFIX 7 — dropdown `⋯` w asset-browserze

- Zmieniono komponent Vue:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/addons/skalisty/wysiwyg-html-fieldtype/resources/js/components/fieldtypes/WysiwygHtml.vue`
- Wdrozone poprawki:
  - dodano nieskopowany blok `<style>` z selektorem:
    - `body:has(.wysiwyg-asset-overlay) [data-reka-popper-content-wrapper]`
  - `z-index` portalu `reka-ui` zostal podniesiony ponad overlay modalu asset-browsera
- Build i walidacja:
  - `npm run build` — OK
  - `php artisan test` — OK (`2 passed`)
- Nadal niepotwierdzone narzedziowo:
  - czy dropdown `⋯` otwiera sie nad modalem
  - czy opcje dropdownu sa klikalne
  - czy nie ma regresji dla innych teleportowanych menu

### 39. HOTFIX 8 — pelna szerokosc obszaru WYSIWYG

- Zmieniono komponent Vue:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/addons/skalisty/wysiwyg-html-fieldtype/resources/js/components/fieldtypes/WysiwygHtml.vue`
- Wdrozone poprawki:
  - dodano `.wysiwyg-html-content { max-width: none; }`
- Build i walidacja:
  - `npm run build` — OK
  - `php artisan test` — OK (`2 passed`)
- Nadal niepotwierdzone narzedziowo:
  - czy obszar WYSIWYG zajmuje juz cala szerokosc panelu w CP
  - czy obrazki i dlugi tekst nie zawijaja sie przy ~70%
  - czy tryb HTML pozostal bez regresji

### 40. Etap 6 — `Columns Section`

- Dodano fieldset:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/fieldsets/columns_section.yaml`
- Dodano widok:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/page_builder/columns_section.antlers.html`
- Zmieniono rejestracje buildera:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/fieldsets/all_page_builder.yaml`
- Wdrozone poprawki:
  - nowy blok `Columns Section`
  - liczba kolumn `2 / 3 / 4`
  - kazda kolumna ma osobne pole `wysiwyg_html`
  - logika `width` i `background_color` taka sama jak w `Free Text`
  - grid uzywa pelnych klas `md:grid-cols-2/3/4`, zeby Tailwind JIT je wygenerowal
- Build i walidacja:
  - `php artisan view:clear` — OK
  - `php artisan statamic:stache:refresh` — OK
  - `npm run build` — OK
- Nadal niepotwierdzone narzedziowo:
  - czy nowy set jest widoczny w CP
  - czy 2/3/4 kolumny ukladaja sie poprawnie na `md:` i wyzej
  - czy mobile pozostaje jedna kolumna
  - czy `width` i `background_color` zachowuja sie poprawnie

### 41. Etap 6b — opcjonalny uklad kolumnowy w `Free Text Section`

- Zmieniono fieldset:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/fieldsets/free_text_section.yaml`
- Zmieniono widok:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/page_builder/free_text_section.antlers.html`
- Wdrozone poprawki:
  - dodano `layout_mode`:
    - `single`
    - `columns`
  - top-level `content` pokazuje sie tylko poza trybem kolumnowym
  - dodano `columns_layout` (`2 / 3 / 4`)
  - dodano `columns` jako `replicator` z kolumnami opartymi o `wysiwyg_html`
  - zachowano kompatybilnosc wsteczna:
    - stare wpisy bez `layout_mode` wpadaja do galezi single-column
- Build i walidacja:
  - `php artisan view:clear` — OK
  - `php artisan statamic:stache:refresh` — OK
  - `npm run build` — OK
- Dodatkowa obserwacja:
  - szybki grep po `public/assets/css/output.css` nie znalazl literalnych stringow `md:grid-cols-2|3|4`
  - nie musi to oznaczac bledu, ale nie dalo sie tym sposobem potwierdzic finalnego CSS
- Nadal niepotwierdzone narzedziowo:
  - czy przelaczenie na `columns` pokazuje nowe pola w CP
  - czy uklad `2 / 3 / 4` kolumn dziala poprawnie na froncie
  - czy mobile zostaje jedna kolumna
  - czy stare wpisy `Free Text` nadal renderuja sie bez regresji

### 42. HOTFIX 9 — rebuild CSS dla klas `md:grid-cols-2/3`

- Zgodnie z briefem wykonano tylko:
  - `npm run build`
- Nie zmieniano zadnych plikow zrodlowych.
- Wynik kontroli:
  - briefowy grep po `md:grid-cols-2|md:grid-cols-3` zwrocil `0`
  - przyczyna: Tailwind zapisuje te selektory w CSS jako:
    - `md\:grid-cols-2`
    - `md\:grid-cols-3`
- Po sprawdzeniu escapowanego wzorca potwierdzono obecność:
  - `md\:grid-cols-2`
  - `md\:grid-cols-3`
  - `md\:grid-cols-4`
- Wniosek:
  - sam rebuild byl skuteczny
  - problem lezal w metodzie weryfikacji z briefu, nie w braku klas w CSS
- Nadal niepotwierdzone narzedziowo:
  - czy uklad 2/3/4 kolumn dziala poprawnie wizualnie na froncie od breakpointu `md`

### 43. Theme Switcher — przelacznik widocznosci w CP

- Zmieniono blueprint globala:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/blueprints/globals/theme_settings.yaml`
- Zmieniono layout:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/layout.antlers.html`
- Dodatkowo zaktualizowano dane globals:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/content/globals/pl/theme_settings.yaml`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/content/globals/en/theme_settings.yaml`
- Wdrozone poprawki:
  - nowe pole `show_theme_switcher` typu `toggle`
  - warunkowy render przycisku `#themeToggleBtn` i sidebara
  - jawne ustawienie `show_theme_switcher: true` w istniejacych danych globals, zeby zachowac stare domyslne zachowanie frontu
- Ważna obserwacja:
  - samo `default: true` w blueprintu nie wystarczylo jako gwarancja dla juz istniejacych danych globals
  - bezpieczniejszy runtime to:
    - `{{ theme_settings }}`
    - `{{ if show_theme_switcher }}`
    - `...`
    - `{{ /if }}`
    - `{{ /theme_settings }}`
- Wykonane komendy:
  - `php artisan statamic:stache:refresh`
  - `php artisan view:clear`
- Nadal niepotwierdzone narzedziowo:
  - czy toggle jest widoczny w CP
  - czy `off` ukrywa przycisk i sidebar
  - czy `on` przywraca render
  - lokalny serwer nie nasluchiwal podczas tej walidacji, wiec nie bylo potwierdzenia przez `curl`

### 44. Migracja `origin` — PL jako jezyk bazowy

- Utworzono skrypt pomocniczy:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/flip_origins.php`
- Uruchomiono:
  - `php artisan tinker --execute="require base_path('flip_origins.php');"`
- Zakres:
  - kolekcje `pages`, `blogs`, `faqs`, `galleries`, `job_positions`, `packages`, `projects`, `services`, `teams`, `testimonials`
- Efekt:
  - PL pliki przestaly miec `origin:`
  - EN pliki dostaly `origin: <pl-uuid>`
  - dodano `blueprint: page` do:
    - `pages/pl/home.md`
    - `pages/pl/blog.md`
    - `pages/pl/author.md`
- Log skryptu:
  - `Zapisanych zmian: 270`
- Ważne obserwacje:
  - brief zakladal ~260 zmian, ale realnie wyszlo 270 przez dodatkowe wpisy w `pages/en` typu:
    - `blogs-two`
    - `blogs-three`
    - `projects-two`
    - `projects-three`
    - `services-two`
    - `services-three`
    - `teams-two`
  - istnial juz reczny wyjatek:
    - `pages/pl/test.md` bez `origin`
    - `pages/en/test.md` z `origin`
    - skrypt go nie naruszyl
- Wykonane komendy po migracji:
  - `php artisan statamic:stache:refresh`
  - `php artisan view:clear`
  - `php artisan test`
- Walidacja probek:
  - `pages/pl/home.md` → bez `origin`, z `blueprint: page`
  - `pages/en/home.md` → z `origin: <pl-uuid>`
  - analogicznie potwierdzone dla przykladu z `blogs`
- Nadal niepotwierdzone narzedziowo:
  - czy CP pokazuje PL jako bazowy jezyk
  - czy `Magic Translator` idzie teraz poprawnie z `PL -> EN`
  - czy frontend nie ma regresji po zmianie danych
- Skrypt `flip_origins.php` zostawiony tymczasowo do czasu walidacji redakcyjnej / translatorskiej

## Ważne pliki

- Multisite:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/sites.yaml`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/config/statamic/system.php`
- Tłumaczenia:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/config/statamic/magic-translator.php`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/.env`
- Header i switcher:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/partials/header-1.antlers.html`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/partials/language-switcher.antlers.html`
- Toolbar:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/partials/head-link.antlers.html`
- Builder:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/fieldsets/all_page_builder.yaml`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/fieldsets/hero_slide_section.yaml`

## Otwarte tematy

### 1. Frontend string translation

- Content translation działa.
- Nadal nie wdrożono osobnej warstwy tłumaczeń stringów UI zaszytych w motywie.
- Docelowo trzeba użyć:
  - `lang/pl/ui.php`
  - `lang/en/ui.php`
  - `{{ trans:ui.* }}`

### 2. Rozbudowa wielojęzyczności

- Dropdown językowy jest gotowy na więcej języków.
- Przy kolejnych locale trzeba utrzymać ten sam model multisite.

## Notatka zamykająca sesję

- `Super Admin Toolbar` został potwierdzony przez użytkownika jako działający.
- Naprawa `origin` w globals została wykonana.
- Natywny selektor entries w `Main` navigation został włączony.
- Główny otwarty temat na kolejny etap to:
  - `frontend string translation`
- Główne pliki `.md` są utrzymywane również w katalogu:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/`

## Dokumenty pomocnicze

- Szczegółowy handoff dla Claude:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/CLAUDE_RESET_HANDOFF.md`
- Pamięć Claude:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/CLAUDE_MEMORY.md`

## Notatka zamykająca - 2026-06-01

- Pamięć została zsynchronizowana po dzisiejszych zmianach Codex i Claude.
- Ważne nowe fakty po aktualizacji Claude:
  - projekt jest też wdrożony na `https://dev.skalisty.pl`
  - deployment i dane serwera są opisane w `server_deploy/DEPLOYMENT.md` oraz `server_deploy/SERWER_DOSTEP.txt`
  - `Theme Switcher` jest oznaczony jako zamknięty
  - bieżący brak aktywnego briefu jest spójny z `BRIEF_CODEX.md`
- Następny realny priorytet projektowy pozostaje bez zmian:
  - `Frontend string translation`
- W repo jest dużo lokalnych zmian i plików roboczych; przed kolejnymi większymi pracami trzeba dalej ostrożnie pilnować zakresu zmian i stanu dokumentacji.

## Aktualizacja robocza - 2026-06-02 - HOTFIX 10

- Aktywny brief przeszedł z backlogu `Frontend string translation` na:
  - `HOTFIX 10 — Magic Translator: rozwiązywanie fieldset imports w replicator sets`
- Wdrożono vendorowy patch w:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/vendor/el-schneider/statamic-magic-translator/src/Support/FieldDefinitionBuilder.php`
- Zmiana:
  - `import: ...` w setach replicatora nie jest juz pomijane
  - importowany fieldset jest rozwijany przez `Statamic\Facades\Fieldset::find(...)`
  - pola sa wlaczane do definicji przez rekurencyjne `normalizeFieldItems(...)`
- Twarda walidacja po hotfixie:
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK (`2 passed`)
  - `page_builder` zawiera po hotfixie realne definicje setow, np. `hero_slide_section` z `7` polami
  - ekstraktor `Magic Translator` widzi `116` jednostek tlumaczeniowych
  - wszystkie `116` pochodza z `page_builder`
  - przykladowe sciezki:
    - `page_builder.0.hero_slides.0.title`
    - `page_builder.0.hero_slides.0.subtitle`
    - `page_builder.0.hero_slides.0.button_text`
- Najwazniejsze ryzyko:
  - to patch w `vendor/`, wiec moze zostac nadpisany przy `composer update`
- Nadal niepotwierdzone:
  - pelne tlumaczenie end-to-end `PL -> EN` dla `Home` przez caly pipeline `Magic Translator`
  - czy po tym hotfixie kolejka DeepL zapisze juz poprawne dane `EN` dla `page_builder`
- Ważna uwaga dla kolejnych sesji:
  - dokumentacja robocza znowu jest rozjechana
  - `BRIEF_CODEX.md` jest na `HOTFIX 10`
  - `PROJECT_STATUS_CODEX.md` nadal pokazuje `Brak aktywnych zadań`
  - `CLAUDE_MEMORY.md` nadal trzyma `Frontend string translation` jako glowny nastepny kierunek

## Aktualizacja robocza - 2026-06-02 - HOTFIX 11

- Aktywny brief przeszedl na:
  - `HOTFIX 11 — Magic Translator: wsparcie pol group`
- Wdrożono vendorowy patch w:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/vendor/el-schneider/statamic-magic-translator/src/Extraction/FieldClassifier.php`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/vendor/el-schneider/statamic-magic-translator/src/Extraction/ContentExtractor.php`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/vendor/el-schneider/statamic-magic-translator/src/Support/FieldDefinitionBuilder.php`
- Zmiana:
  - `group` jest klasyfikowane jako `Tier2`
  - ekstraktor ma nowa metode `extractGroup()`
  - definicje pol `group` sa normalizowane tak samo jak `grid`
- Twarda walidacja po hotfixie:
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK (`2 passed`)
  - `our_story_section` ma w definicji pola:
    - `video (type=group)`
    - `primary_button (type=group)`
    - `secondary_button (type=group)`
  - ekstraktor zwraca:
    - `Button units: 4`
  - kluczowy dowod:
    - `page_builder.3.primary_button.label => Dowiedz Się o Nas Więcej`
- Próba end-to-end translacji `Home` przez CLI:
  - `php artisan statamic:magic-translator:translate --entry=b2f27011-9af8-4287-b2f6-e0c411ff4ed6 --from=pl --to=en --overwrite -n`
  - zatrzymala sie na:
    - `ProviderUnavailableException: DeepL is temporarily unavailable`
- Wniosek:
  - hotfix `group` jest technicznie skuteczny na poziomie definicji i ekstrakcji
  - brak pelnego zapisu `en/home.md` wynika obecnie z niedostepnosci providera DeepL, nie z logiki `group`
- Ważna uwaga dla kolejnych sesji:
  - dokumentacja robocza znowu wymaga synchronizacji
  - `BRIEF_CODEX.md` jest na `HOTFIX 11`
  - `PROJECT_STATUS_CODEX.md` nadal pokazuje `Brak aktywnych zadań`
  - `CLAUDE_MEMORY.md` nadal wskazuje `Frontend string translation` jako najblizszy priorytet

## Aktualizacja robocza - 2026-06-02 - HOTFIX 12

- Aktywny brief przeszedl na:
  - `HOTFIX-12 — EN globals dziedziczenie z PL + weryfikacja button`
- Wykonano dwa kroki:
  - usunieto EN overrides globals:
    - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/content/globals/en/setting.yaml`
    - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/content/globals/en/theme_settings.yaml`
  - przepchnieto kolejke `translations`, zeby domknac oczekujacy job `Magic Translator`
- Twarda walidacja:
  - po usunieciu EN globals:
    - logo EN = `images/identyfikacja-strony/logo-skalisty-2.svg`
    - `show_theme_switcher` EN = `false`
  - w `content/collections/pages/en/home.md`:
    - `primary_button.label = 'Learn More About Us'`
  - `php artisan test` — OK (`2 passed`)
  - kolejka `translations` po workerze:
    - `jobs=0`
- Wniosek:
  - `HOTFIX-12` zamyka problem EN demo globals
  - i praktycznie potwierdza, ze `HOTFIX 11` dziala end-to-end, bo przycisk z `group` zapisuje sie juz po angielsku w `en/home.md`
- Dodatkowa obserwacja:
  - briefowa komenda weryfikacji globals byla bledna
  - poprawne API to `\\Statamic\\Facades\\GlobalSet::findByHandle(...)->inCurrentSite('en')->get(...)`
- Nadal niepotwierdzone:
  - wizualny check frontu EN przez HTTP / przegladarke
  - lokalny serwer nie byl uruchomiony podczas finalnej proby `curl`
- Dodatkowy stan operacyjny po prosbie uzytkownika:
  - uruchomiono `php artisan serve --host=127.0.0.1 --port=8001`
  - proces serwera wystartowal poprawnie w tej sesji
  - mimo to narzedziowe requesty HTTP z tej sesji nadal zwracaly `HTTP_CODE:000`
  - dlatego wizualny check frontu EN pozostaje jeszcze otwarty jako reczna weryfikacja operatorska

## Aktualizacja robocza - 2026-06-02 - HOTFIX 13

- Aktywny brief przeszedl na:
  - `HOTFIX-13 — contact_section.yaml — brakujace container: assets`
- Wykonano minimalna poprawke w:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/fieldsets/contact_section.yaml`
- Dodano:
  - `container: assets`
  - do pola `flag` w secie `office` replicatora `offices`
- Twarda walidacja:
  - `php artisan statamic:stache:refresh` — OK
  - `php artisan test` — OK (`2 passed`)
  - wewnetrzny request kernelowy Laravel dla `/contact-us` zwrocil:
    - `status=200`
    - `bytes=146818`
- Wniosek:
  - `UndefinedContainerException` dla strony kontaktowej zostal usuniety
  - walidacja przez wewnetrzny request jest tu bardziej wiarygodna niz `curl`, bo HTTP z tej sesji bywalo nierozstrzygalne
- Drobna uwaga dla kolejnego briefu:
  - w sekcji `Frontend string translation` nadal zostalo jedno stare zdanie z poprzedniego hotfixu
  - to tylko kwestia redakcyjna, nie blocker techniczny

## Aktualizacja robocza - 2026-06-02 - UI-Translations-Panel

- Aktywny brief przeszedl na:
  - `UI-Translations-Panel — panel CP do zarzadzania tlumaczeniami UI + puste JSON dla 10 jezykow`
- Wykonano:
  - 10 pustych plikow `lang/{locale}.json` dla:
    - `sv`, `no`, `nl`, `lv`, `it`, `fr`, `es`, `de`, `da`, `cs`
  - panel CP:
    - `routes/cp.php`
    - `app/Http/Controllers/CP/UiTranslationsController.php`
    - `resources/views/cp/ui_translations/index.blade.php`
    - `resources/views/cp/ui_translations/edit.blade.php`
  - wpis w nawigacji CP przez:
    - `app/Providers/AppServiceProvider.php`
- Najwazniejsze ustalenie techniczne:
  - w zwyklej aplikacji Statamic sam plik `routes/cp.php` nie byl autoloadowany
  - trzeba bylo jawnie podpiac go przez:
    - `Statamic::pushCpRoutes(...)`
    - w `AppServiceProvider`
- Twarda walidacja:
  - `php artisan route:list --name=statamic.cp.ui-translations` — 3 trasy OK
  - `cp_route('ui-translations.index')` => `/cp/ui-translations`
  - `cp_route('ui-translations.edit', 'de')` => `/cp/ui-translations/de`
  - `php artisan test` — OK (`2 passed`)
  - bezposrednie wywolanie kontrolera zwraca widoki:
    - `cp.ui_translations.index`
    - `cp.ui_translations.edit`
- Dodatkowa walidacja kernelowa jako zalogowany admin:
  - `GET /cp/ui-translations` => `status=200`, strona zawiera `Tłumaczenia UI` i `Deutsch`
  - `GET /cp/ui-translations/de` => `status=200`, strona zawiera `Submit` i `Wyślij`
  - `POST /cp/ui-translations/de` z sesja + CSRF => `status=302`
  - zapisuje tylko niepuste wartosci, np.:
    - `{"Submit":"Absenden","Share":"Teilen"}`
  - po zapisie lista pokazuje poprawny licznik:
    - `2 / 17`
- Dodatkowy check:
  - przetestowano tymczasowo zapis kontrolera dla `de`
  - po walidacji przywrocono `lang/de.json` do pustego `{}` zgodnie z briefem
- Otwarte:
  - ewentualny szybki check wizualny w przegladarce, ale technicznie panel jest juz potwierdzony end-to-end na poziomie requestow CP

## Aktualizacja robocza - 2026-06-02 - Translator-API-Panel

- Aktywny brief przeszedl na:
  - `Translator-API-Panel — panel CP Tools > Translator API do edycji klucza DeepL`
- Wykonano:
  - nowy kontroler:
    - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/app/Http/Controllers/CP/TranslatorApiController.php`
  - nowy widok:
    - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/cp/translator_api/index.blade.php`
  - rozszerzenie tras:
    - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/routes/cp.php`
  - wpis `Translator API` w `Tools`:
    - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/app/Providers/AppServiceProvider.php`
- Funkcja panelu:
  - pokazuje biezacy `DEEPL_API_KEY`
  - pokazuje biezaca usluge `MAGIC_TRANSLATOR_SERVICE`
  - zapisuje nowy klucz do `.env`
  - po zapisie wykonuje `config:clear`
- Twarda walidacja:
  - `php artisan route:list --name=statamic.cp.translator-api` — 2 trasy OK
  - `GET /cp/translator-api` przez kernel jako zalogowany admin:
    - `status=200`
    - `Translator API=yes`
    - `:fx=yes`
  - `POST /cp/translator-api` przez kernel z sesja + CSRF:
    - `status=302`
    - `location=http://localhost/cp/translator-api`
    - zapis do `.env` potwierdzony
    - w tescie użyto biezacego klucza, wiec realna wartosc nie zostala zmieniona
  - `Statamic\\Facades\\CP\\Nav::build(false)`:
    - sekcja `Tools` zawiera `tools::translator_api`
  - `php artisan test` — OK (`2 passed`)
- Wniosek:
  - `Translator-API-Panel` jest technicznie domkniety
  - Claude moze zamknac brief formalnie po swojej stronie

## 2026-06-06 — Mobile-language-switcher-v2 — hotfix flagi Norwegii

- Drobny follow-up po wdrozeniu mobilnego panelu jezykow.
- Problem:
  - flaga Norwegii nie renderowala sie, mimo ze SVG bylo juz osadzone w `header-1.antlers.html`.
- Przyczyna:
  - warunek w Antlers sprawdzal `locale:short == "no"`,
  - ale aktualny site norweski ma short locale `nb` (`nb_NO`),
  - przez to blok SVG nigdy sie nie renderowal.
- Naprawa:
  - zmienilem warunek na `locale:short == "nb"` w:
    - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/partials/header-1.antlers.html`
- Walidacja:
  - `php artisan view:clear` — OK
  - `php artisan test` — OK (`2 passed`)
- Wniosek:
  - jesli beda kolejne flagi lub mapowania locale, trzeba opierac sie na realnym `shortLocale()` Statamic, a nie na samym handle site.

### Follow-up

- Po zmianie na `nb` uzytkownik nadal widzial czarny placeholder zamiast flagi Norwegii.
- W praktyce oznacza to, ze problemem nie byl juz warunek locale, tylko sposob renderowania inline SVG w tym miejscu.
- Finalnie podmienilem Norwegie na maly flagowy bloczek zbudowany z `span` i inline style:
  - bez SVG
  - bez nowych klas wymagajacych `npm run build`
  - z zachowaniem tego samego rozmiaru i odstepu co reszta listy

### Finalna diagnoza

- Po dodatkowej analizie wyszlo, ze SVG / bloczek byl tylko przejsciowym workaroundem.
- Prawdziwa przyczyna wyjatku Norwegii byla jedna:
  - site ma handle `no`,
  - ale locale to `nb_NO`,
  - wiec `locale:short` w Antlers zwraca `nb`.
- Dlatego Norwegia jako jedyna wypadala z pierwotnego mechanizmu emoji, bo warunek sprawdzal zly kod.
- Po potwierdzeniu tego uproscilem implementacje:
  - usunalem workaround bez SVG,
  - przywrocilem Norwegie do tego samego mechanizmu emoji co reszta,
  - finalnie warunek to `locale:short == "nb"` + `🇳🇴`.
- Wniosek:
  - layout flag jest znowu jednolity,
  - a wyjatek dla Norwegii wynikal z danych locale, nie z samego emoji.

## 2026-06-06 — Desktop language switcher — flagi

- Dodalem analogiczne flagi do desktopowego dropdownu jezykow w:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/partials/language-switcher.antlers.html`
- Implementacja:
  - ten sam mechanizm emoji co w mobilnym panelu,
  - ten sam mapping locale,
  - ten sam wyjatek dla Norwegii rozwiazany przez `locale:short == "nb"`.
- Efekt:
  - switcher desktopowy i mobilny sa teraz wizualnie i logicznie spojne.
- Walidacja:
  - `php artisan view:clear` — OK
  - `php artisan test` — OK (`2 passed`)

## 2026-06-06 — Desktop language switcher — click outside closes dropdown

- Drobny UX hotfix dla desktopowego switchera.
- W `custom.js` dopisalem listener klikniecia poza `details.language-switcher`:
  - aktywny tylko przy `window.innerWidth >= 992`
  - jesli dropdown jest otwarty i klikniecie nie trafia w sam switcher, `langDetails.open = false`
- Cel:
  - zamkniecie listy jezykow bez koniecznosci ponownego klikniecia przycisku.
- Walidacja:
  - `php artisan test` — OK (`2 passed`)

## 2026-06-06 — Notatka operacyjna dla wznowienia pracy Claude

- Seria poprawek switchera jezykow byla kontynuowana bez biezacego nadzoru Claude, bo Claude chwilowo wypadl z workflow przez limit.
- Realnie wykonany zakres po stronie kodu:
  - mobilny panel jezykowy `Mobile-language-switcher-v2`
  - poprawa scrolla / wysokosci paneli mobile
  - flagi w mobile
  - diagnoza i naprawa Norwegii przez `locale:short == "nb"`
  - flagi w desktopowym dropdownie
  - desktopowy click-outside close
- Kluczowe pliki dotkniete w tej serii:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/partials/header-1.antlers.html`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/resources/views/partials/language-switcher.antlers.html`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/public/assets/js/custom.js`
- Po powrocie Claude powinien zsynchronizowac dokumentacje centralna zgodnie z `AGENTS.md`, w szczegolnosci:
  - `BRIEF_CODEX.md`
  - `PROJECT_STATUS_CODEX.md`
  - `CLAUDE_MEMORY.md`
  - `CHANGE-LOG.md`
- Ten wpis zostawiam specjalnie po to, zeby Claude po wznowieniu nie pominąl realnych zmian wykonanych przez Codexa poza jego aktywna sesja.

## 2026-06-07 — HOTFIX-19-lang-panel-animation

- Zadanie aktywne wg zsynchronizowanego `PROJECT_SYNC`.
- Zmieniony plik:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/public/assets/js/custom.js`
- Wdrozone:
  - `void langPanel.offsetHeight` w `openLangPanel()` po zdjeciu `hidden`
  - `transitionend` z `{ once: true }` w `closeLangPanel()` zamiast synchronicznego `hidden`
- Cel:
  - animacja otwarcia panelu mobile ma byc widoczna tak samo jak hamburger menu
  - animacja zamkniecia ma dojechac do konca przed `display:none`
- Walidacja:
  - `php artisan test` — OK (`2 passed`)
- Ograniczenie:
  - lokalny HTTP check na `127.0.0.1:8001` w tej sesji nie odpowiedzial (`no headers bytes=0`), wiec runtime animacji nadal wymaga recznego potwierdzenia w przegladarce

## 2026-06-07 — HOTFIX-20-lang-panel-collision

- Kontynuacja serii poprawek switchera jezykow po HOTFIX-19.
- Zmieniony plik:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/public/assets/js/custom.js`
- Wdrozone:
  - `openLangPanel()` resetuje stan przez `remove("hidden", "open")`, potem `add("block")`, reflow i dopiero `add("open")`
  - `closeLangPanel()` ma guard:
    - jesli panel jest juz ukryty albo nie ma `open`, nie dodaje `transitionend` listenera
- Cel:
  - usunac osierocony listener, ktory chowal panel jezykow zaraz po otwarciu po scenariuszu `nav -> lang`
  - usunac stan `hidden open`, ktory psul kolejne animacje
- Walidacja:
  - `php artisan test` — OK (`2 passed`)
- Ograniczenie:
  - lokalny HTTP check na `127.0.0.1:8001` nadal nie odpowiadal w tej sesji, wiec scenariusze UX z briefu nadal wymagaja recznego potwierdzenia w przegladarce

## 2026-06-07 — HOTFIX-23-origin-locale-stale

- Aktywny brief dotyczy regresji patcha `magic-translator-fieldtype-untranslated-stale.patch`.
- Problem:
  - locale origin `pl` dostawalo `is_stale = true`, mimo ze jest zrodlem i nie powinno byc oznaczane bursztynem.
- Zmienione pliki:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/vendor/el-schneider/statamic-magic-translator/src/Fieldtypes/MagicTranslatorFieldtype.php`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/patches/magic-translator-fieldtype-untranslated-stale.patch`
- Wdrozone:
  - dodane `$originSite` do `use()` closure
  - stale fallback dla locale bez metadata ma teraz guard `&& $siteHandle !== $originSite`
- Ważna obserwacja:
  - pierwszy `composer patches-repatch` polegl, bo patch byl zapisany wzgledem juz-spatchowanego stanu, a pakiet byl odtwarzany od zera
  - patch trzeba bylo wygenerowac ponownie z realnego `diff -u` miedzy czystym vendor file a poprawiona wersja
  - po tym drugie `composer patches-repatch` przeszlo poprawnie
- Walidacja:
  - `php artisan test` — OK (`2 passed`)
  - grep potwierdza obie zmiany w vendor file i patch file
- Ograniczenie:
  - `preload()` bez zalogowanego usera zwraca `sites=0`, bo `AccessibleSites::forCollection()` filtruje sidebar po uprawnieniach
  - dlatego finalny check `PL = zielony`, `inne = bursztynowy` nadal wymaga recznego potwierdzenia w CP

## 2026-06-08 — HOTFIX-24-stub-locale-red-not-amber

- Kontynuacja patcha `magic-translator-fieldtype-untranslated-stale.patch`.
- Zmienione pliki:
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/vendor/el-schneider/statamic-magic-translator/src/Fieldtypes/MagicTranslatorFieldtype.php`
  - `/home/pestycyd/Dokumenty/Skalisty-New-2/skalisty-orion/patches/magic-translator-fieldtype-untranslated-stale.patch`
- Zmiana semantyczna:
  - stub locale bez metadata ma juz nie byc `stale`
  - ma zachowywac sie jak `exists = false`, zeby Vue wyrenderowalo kolor czerwony
- Zachowane z HOTFIX-23:
  - `$originSite` w `use()`
  - guard `&& $siteHandle !== $originSite`
- Workflow:
  - `composer patches-relock` — OK
  - `composer patches-repatch` — OK
  - `php artisan test` — OK (`2 passed`)
- Mocna walidacja preload jako zalogowany admin:
  - `pl|exists=1|stale=0`
  - `en|exists=0|stale=0`
  - `de|exists=0|stale=0`
  - `fr|exists=0|stale=0`
- Wniosek:
  - logika po stronie PHP odpowiada dokladnie temu, czego oczekuje mapowanie kolorow w Vue:
    - origin → zielony
    - nieprzetlumaczony stub → czerwony
