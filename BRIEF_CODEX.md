# BRIEF_CODEX.md

<!-- PROJECT_SYNC_START -->
state_version: 2026-06-21-2300
active_task_id: FEATURE-internal-links-addon-mvp
active_task_name: Internal Links Addon — Wariant A (MVP)
active_task_status: active
active_task_source: BRIEF_CODEX.md
last_sync: 2026-06-21 23:00 Europe/Warsaw
last_synced_by: Claude
last_closed: FIX-service-section-button-entry
next_after_active: Wariant B Internal Links (production-ready: settings + cron + exclusions)
<!-- PROJECT_SYNC_END -->

---

## Status

**AKTYWNE**

## Cel zadania

Zaimplementować **Wariant A (MVP)** samodzielnego addonu Statamic `skalisty/internal-links` — auto-linkowanie słów kluczowych w content na podstawie listy mappings (keyword → entry). Wzorzec adaptowany z WordPress plugin `wptypek-internal-links` (referencja: `/home/pestycyd/Dokumenty/Skalisty-New-2/example-addon-wordpress/typek-internal-links/`), ale wykorzystujący natywne mechanizmy Statamic 6 + multilingual gratis przez Statamic Collections.

**Cel długoterminowy** (poza scope MVP): po stabilizacji v1.0 addon zostanie wydzielony do **standalone repo GitHub** (analogicznie do `5k18a/laravel-statamic-ai-chatbot` z 2026-06-20). Plus Wariant B i C w kolejnych briefach.

## Kontekst

User posługuje się WordPress plugin który robi to samo (`typek-internal-links`) — przeanalizowane przez Claude 2026-06-21. Mechanizm:

1. **Storage:** Custom Post Type per link mapping (keyword → URL + opcje)
2. **Substitution:** filter `the_content` z parserem regex ukrywającym `<h>`, `<a>`, `<img>`, `<figure>`, `<iframe>`, embeds
3. **Pre-computation:** cron batch process (poza scope MVP)
4. **Settings:** global limity per post (Wariant B)
5. **Logs / Suggestions / Custom UI:** Wariant C

W naszym projekcie:
- Statamic 6.22.0 / Laravel 13.16.1 / PHP 8.4
- Wzorzec lokalnego addonu już ugruntowany: `addons/skalisty/wysiwyg-html-fieldtype/` (v1.1.0, path repository w `composer.json`, ServiceProvider extends `AddonServiceProvider`)
- Wzorzec entries picker dla multilingual URL: `services_grid_section.section_button_entry` (2026-06-20) + `service_section.button_entry` (2026-06-21) — używać tego samego dla `target_entry` field

## Problem do rozwiązania

Aktualnie brak mechanizmu auto-linkowania w projekcie skalisty-orion. Wszystkie wewnętrzne linki w content (Bard, Free Text Section, WYSIWYG HTML, plain text fields) wymagają ręcznego dodawania `<a href="...">` — żmudne dla SEO, łatwo o pominięcie keywords, hardcoded URL nie multilingual.

**MVP rozwiązuje:** automatyczne podstawienie predefiniowanej listy keyword → entry mappings podczas renderowania content, z respektowaniem multilingual routingu (PL/EN/inne).

## Analiza gotowych rozwiązań

### Czy zadanie dotyczy nowej większej funkcjonalności?

**TAK** — nowy addon Statamic, nowa Collection, nowy Antlers modifier, nowa klasa Support, ~80-150 linii kodu w nowej strukturze.

### Sprawdzone rozwiązania (Claude, 2026-06-21)

| Rozwiązanie | Werdykt |
|---|---|
| Natywne Statamic content augmenters | Częściowo używamy — to mechanizm dostarczenia logiki podmiany. Nie rozwiązuje full problem (brak central storage keywords) |
| Statamic Marketplace addon | Brak istniejącego addonu Statamic 6 do internal linking z multilingual support i tego typu featureami |
| **WordPress plugin port** (typek-internal-links) | **Wybrane jako wzorzec architektury** — sprawdzona logika `LinkableContentParser` regex; natywny port do PHP/Statamic |
| `mariohamann/statamic-bard-mutator` | Nieadekwatne — modyfikuje Bard ProseMirror JSON, my chcemy działać na HTML output (uniwersalne dla wszystkich content types) |
| Custom from scratch bez wzorca WP | Odrzucone — istniejący sprawdzony pattern WP eliminuje większość ryzyka projektowego |

### Rekomendacja Claude

**Lokalny Statamic addon `skalisty/internal-links`** w `addons/skalisty/internal-links/` (wzorzec wysiwyg-html-fieldtype), z core MVP:
- Collection `internal_links` (storage)
- Antlers modifier `apply_internal_links` (substitution trigger)
- `LinkableContentParser` PHP class (regex hide tags, port z WP plugin)
- Real-time substitution (bez cron — Wariant B)

### Uzasadnienie rekomendacji

- **Statamic native** dla storage (Collection) + dla substitution (Antlers modifier) — zero custom DB schemas, natural CMS UX, multilingual gratis
- **Port WP `LinkableContentParser`** regex logic — sprawdzona przez user'a w produkcji na WP, nie wymyślamy nowych regexów
- **Lokalny addon** = możliwość późniejszego wydzielenia do standalone repo (jak chatbot AI 2026-06-20) bez przepisywania kodu
- **Real-time substitution bez cron** — dla <500 linków OK; cron dorzucamy w Wariancie B

## Zakres pracy

### Krok 1 — Struktura addonu

Utworzyć katalog `addons/skalisty/internal-links/` ze strukturą:

```
addons/skalisty/internal-links/
├── composer.json
├── LICENSE (MIT)
├── README.md
├── CHANGELOG.md
├── VERSION.md
├── ROADMAP.md  (etapy A → B → C wypisane)
├── .gitignore
├── src/
│   ├── ServiceProvider.php
│   ├── Modifiers/
│   │   └── ApplyInternalLinks.php
│   └── Support/
│       └── LinkableContentParser.php
└── resources/
    └── blueprints/
        └── collections/
            └── internal_links/
                └── internal_link.yaml
```

### Krok 2 — `composer.json` addonu

Analogiczny do `addons/skalisty/wysiwyg-html-fieldtype/composer.json`:

```json
{
    "name": "skalisty/internal-links",
    "description": "Statamic 6 addon — automatyczne wewnętrzne linkowanie słów kluczowych z multilingual support",
    "version": "0.1.0",
    "license": "MIT",
    "authors": [{"name": "Marcin Skibicki", "homepage": "https://skalisty.pl"}],
    "keywords": ["statamic", "statamic-addon", "internal-links", "seo", "auto-link"],
    "autoload": {
        "psr-4": {"Skalisty\\InternalLinks\\": "src"}
    },
    "extra": {
        "statamic": {
            "name": "Internal Links",
            "description": "Auto-linkowanie słów kluczowych w content"
        },
        "laravel": {
            "providers": ["Skalisty\\InternalLinks\\ServiceProvider"]
        }
    },
    "require": {
        "php": "^8.2",
        "statamic/cms": "^6.0"
    }
}
```

### Krok 3 — `ServiceProvider.php`

```php
<?php

namespace Skalisty\InternalLinks;

use Statamic\Facades\Modifier;
use Statamic\Providers\AddonServiceProvider;
use Skalisty\InternalLinks\Modifiers\ApplyInternalLinks;

class ServiceProvider extends AddonServiceProvider
{
    protected $modifiers = [
        ApplyInternalLinks::class,
    ];

    public function bootAddon()
    {
        // Auto-publish blueprint dla collection internal_links
        $this->publishes([
            __DIR__.'/../resources/blueprints' => resource_path('blueprints'),
        ], 'internal-links-blueprints');
    }
}
```

### Krok 4 — `Modifiers/ApplyInternalLinks.php`

```php
<?php

namespace Skalisty\InternalLinks\Modifiers;

use Statamic\Modifiers\Modifier;
use Statamic\Facades\Entry;
use Skalisty\InternalLinks\Support\LinkableContentParser;

class ApplyInternalLinks extends Modifier
{
    /**
     * Usage:
     *   {{ content | apply_internal_links }}
     *   {{ free_text_content | apply_internal_links }}
     *
     * Pobiera wszystkie published wpisy z collection `internal_links` w aktualnym site,
     * iteruje keywords i podmienia w content na <a href="{entry url}">.
     * Respektuje hide tags (h1-6, a, img, figure, iframe, embeds).
     */
    public function index($value, $params, $context)
    {
        if (! is_string($value) || empty($value)) {
            return $value;
        }

        $currentSite = $context['site'] ?? \Statamic\Facades\Site::current()->handle();

        $links = Entry::query()
            ->where('collection', 'internal_links')
            ->where('site', $currentSite)
            ->where('enabled', true)
            ->orderBy('weight', 'desc')  // wyższy weight = pierwszy
            ->get();

        if ($links->isEmpty()) {
            return $value;
        }

        $parser = new LinkableContentParser($value);

        foreach ($links as $link) {
            $targetEntry = $link->augmentedValue('target_entry')->value();
            $targetEntry = is_iterable($targetEntry) ? collect($targetEntry)->first() : $targetEntry;

            if (! $targetEntry) continue;

            $targetUrl = $targetEntry->url();
            $maxPerPage = (int) $link->get('max_per_page', 1);
            $nofollow = (bool) $link->get('nofollow', false);
            $openInNewWindow = (bool) $link->get('open_in_new_window', false);

            $keywords = $link->get('keywords', []);
            // keywords to replicator: [{keyword: 'foo', amount: 1}, ...]
            foreach ($keywords as $kwItem) {
                $keyword = $kwItem['keyword'] ?? null;
                if (! $keyword) continue;

                $parser->replaceKeyword($keyword, $targetUrl, [
                    'max' => $maxPerPage,
                    'nofollow' => $nofollow,
                    'target_blank' => $openInNewWindow,
                ]);
            }
        }

        return $parser->getContent();
    }
}
```

### Krok 5 — `Support/LinkableContentParser.php`

Port z WP `LinkableContentParser` (WP plugin file: `example-addon-wordpress/typek-internal-links/includes/class-linkablecontentparser.php`):

```php
<?php

namespace Skalisty\InternalLinks\Support;

class LinkableContentParser
{
    private const HIDE_REGEXES = [
        'headings' => '/<h[1-6][^>]*>.*?<\/h[1-6]>/is',
        'links'    => '/<a[^>]*>.*?<\/a>/is',
        'figures'  => '/<figure[^>]*>.*?<\/figure>/is',
        'images'   => '/<img[^>]*>/is',
        'iframes'  => '/<iframe[^>]*>.*?<\/iframe>/is',
    ];

    private string $content;
    private array $hidden = [];

    public function __construct(string $content)
    {
        $this->content = $content;
        $this->hideTags();
    }

    public function replaceKeyword(string $keyword, string $url, array $options = []): self
    {
        $max = $options['max'] ?? 1;
        $nofollow = $options['nofollow'] ?? false;
        $targetBlank = $options['target_blank'] ?? false;

        $attrs = [];
        if ($nofollow) $attrs[] = 'rel="nofollow"';
        if ($targetBlank) $attrs[] = 'target="_blank"';

        $href = sprintf(
            '<a href="%s"%s>%s</a>',
            htmlspecialchars($url, ENT_QUOTES),
            $attrs ? ' '.implode(' ', $attrs) : '',
            '$0'  // preg_replace zachowuje original match
        );

        // case-insensitive, word boundary, max N replacements
        $pattern = '/\b' . preg_quote($keyword, '/') . '\b/i';
        $this->content = preg_replace($pattern, $href, $this->content, $max);

        return $this;
    }

    public function getContent(): string
    {
        // restore hidden tags
        foreach ($this->hidden as $hash => $original) {
            $this->content = str_replace($hash, $original, $this->content);
        }
        return $this->content;
    }

    private function hideTags(): void
    {
        foreach (self::HIDE_REGEXES as $type => $regex) {
            preg_match_all($regex, $this->content, $matches);
            if (empty($matches[0])) continue;

            foreach ($matches[0] as $match) {
                $hash = '###IL_HIDDEN_' . md5($match . microtime(true)) . '###';
                $this->hidden[$hash] = $match;
                $this->content = str_replace($match, $hash, $this->content);
            }
        }
    }
}
```

### Krok 6 — Blueprint `internal_link.yaml`

`addons/skalisty/internal-links/resources/blueprints/collections/internal_links/internal_link.yaml`:

```yaml
title: 'Internal Link'
tabs:
  main:
    display: Main
    sections:
      -
        fields:
          -
            handle: title
            field:
              type: text
              required: true
              display: 'Nazwa (administracyjna, nie wyświetlana)'
              instructions: 'Np. "Skały do akwarium → Strona Dekoracje Akwarystyczne"'
              validate: [required]
          -
            handle: target_entry
            field:
              type: entries
              display: 'Strona docelowa'
              instructions: 'Wybierz wpis do którego linki będą podstawiane. URL dopasuje się automatycznie do języka.'
              max_items: 1
              collections: [pages, services, projects]
              required: true
              validate: [required]
          -
            handle: keywords
            field:
              type: replicator
              display: 'Słowa kluczowe'
              instructions: 'Lista słów które będą zamieniane na link.'
              sets:
                main:
                  sets:
                    keyword:
                      display: 'Słowo kluczowe'
                      fields:
                        -
                          handle: keyword
                          field:
                            type: text
                            display: 'Słowo'
                            instructions: 'Np. "akwarium", "sztuczne skały"'
                            required: true
                            validate: [required]
              required: true
              validate: [required]
              min_sets: 1
          -
            handle: max_per_page
            field:
              type: integer
              display: 'Max wystąpień na stronie'
              instructions: 'Ile razy ten link może wystąpić na pojedynczej stronie.'
              default: 1
              min: 1
              max: 10
              localizable: false
          -
            handle: weight
            field:
              type: integer
              display: 'Priorytet (waga)'
              instructions: 'Wyższy = pierwszy podmieniany przy konflikcie keywords.'
              default: 0
              localizable: false
          -
            handle: nofollow
            field:
              type: toggle
              display: 'nofollow'
              default: false
              localizable: false
          -
            handle: open_in_new_window
            field:
              type: toggle
              display: 'Otwieraj w nowej karcie'
              default: false
              localizable: false
          -
            handle: enabled
            field:
              type: toggle
              display: 'Aktywne'
              default: true
              localizable: false
```

### Krok 7 — Rejestracja Collection + path repository

W głównym `composer.json` projektu skalisty-orion dodać:

```json
"repositories": [
    ...
    {
        "type": "path",
        "url": "./addons/skalisty/internal-links"
    }
],
"require": {
    ...
    "skalisty/internal-links": "@dev"
}
```

Plus `composer require skalisty/internal-links @dev`.

Plus utworzyć `content/collections/internal_links.yaml`:

```yaml
title: 'Internal Links'
revisions: false
sites: [pl, en, sv, no, nl, lv, it, fr, es, de, da, cs]
propagate: false  # każdy locale ma osobne mappingi
template: null  # nie ma frontu - tylko CP
```

### Krok 8 — Walidacja

```bash
composer require skalisty/internal-links @dev
php artisan vendor:publish --tag=internal-links-blueprints --force
php artisan statamic:stache:refresh
php artisan test  # 2 passed expected
```

**Manualny test w CP:**
1. Otwórz `/cp` → w lewej belce powinna pojawić się "Internal Links" Collection (sekcja Content)
2. Klik "Create Entry" → wypełnij:
   - Title: "Test: akwarium → Sztuczna rafa koralowa"
   - Target Entry: wybierz `sztuczna-rafa-koralowa`
   - Keywords: dodaj `akwarium`
   - Max per page: 1
   - Enabled: true
3. Save

**Test w widoku Antlers:**
1. Edytuj widok `resources/views/page_builder/free_text_section.antlers.html` (lub inny używający content) — zamień `{{ content }}` na `{{ content | apply_internal_links }}`
2. W CP dodaj do strony Free Text Section z tekstem zawierającym "akwarium"
3. Render strony → słowo "akwarium" powinno być linkiem do `/oferta/sztuczna-rafa-koralowa` (PL) lub locale-specific URL

**Test exclusion regex:**
1. Dodaj tekst w Free Text z `<h2>akwarium w nagłówku</h2>` + `<p>akwarium w paragrafie</p>`
2. Render: w `<h2>` keyword NIE powinno być zlinkowane, w `<p>` powinno być

## Pliki do sprawdzenia

- `/home/pestycyd/Dokumenty/Skalisty-New-2/example-addon-wordpress/typek-internal-links/includes/class-linkablecontentparser.php` — source regex logic (port)
- `/home/pestycyd/Dokumenty/Skalisty-New-2/example-addon-wordpress/typek-internal-links/includes/class-linker.php` — substitution logic
- `addons/skalisty/wysiwyg-html-fieldtype/composer.json` — wzorzec composer manifest
- `addons/skalisty/wysiwyg-html-fieldtype/src/ServiceProvider.php` — wzorzec service provider
- `composer.json` (głównego projektu) — gdzie dodać path repository (jest sekcja "repositories" z istniejącym `./addons/skalisty/wysiwyg-html-fieldtype`)
- `resources/views/page_builder/free_text_section.antlers.html` + inne views z `{{ content }}` — gdzie aplikować modifier

## Pliki do zmiany

**Nowe (10 plików):**
- `addons/skalisty/internal-links/composer.json`
- `addons/skalisty/internal-links/LICENSE` (MIT)
- `addons/skalisty/internal-links/README.md`
- `addons/skalisty/internal-links/CHANGELOG.md`
- `addons/skalisty/internal-links/VERSION.md`
- `addons/skalisty/internal-links/ROADMAP.md` (etapy A → B → C)
- `addons/skalisty/internal-links/.gitignore`
- `addons/skalisty/internal-links/src/ServiceProvider.php`
- `addons/skalisty/internal-links/src/Modifiers/ApplyInternalLinks.php`
- `addons/skalisty/internal-links/src/Support/LinkableContentParser.php`
- `addons/skalisty/internal-links/resources/blueprints/collections/internal_links/internal_link.yaml`
- `content/collections/internal_links.yaml` (rejestracja collection w głównym projekcie)

**Edytowane (2 pliki):**
- `composer.json` (głównego projektu) — path repository + require
- `composer.lock` (auto regenerowany)

**Opcjonalnie (przykład użycia):**
- `resources/views/page_builder/free_text_section.antlers.html` — zamiana `{{ content }}` → `{{ content | apply_internal_links }}` (lub osobny brief po testach MVP)

## Wymagania techniczne

- Statamic 6.22+, Laravel 13, PHP 8.4
- PSR-4 autoload `Skalisty\InternalLinks\\` → `src/`
- AddonServiceProvider extends pattern
- Brak nowych dependencies composer/npm (czysty PHP/Statamic)
- Multilingual native przez Statamic Collection (osobne entries per locale lub `propagate: false`)
- Regex hide tags: h1-6, a, img, figure, iframe — port z WP plugin (`LinkableContentParser.php`)
- Modyfikator Antlers `apply_internal_links` — uniwersalny dla wszystkich string content

## Ograniczenia

- **Nie** modyfikować `vendor/statamic/cms/` (HOTFIX-18 pattern — patches tylko jeśli must-have)
- **Nie** dotykać Bard ProseMirror JSON — działamy na HTML output przez Antlers modifier (uniwersalne dla wszystkich content sources)
- **Nie** dodawać nowych dependencies composer/npm (czysty PHP-only)
- **Nie** robić cron / pre-computation w MVP — to Wariant B
- **Nie** robić custom CP panel ani logs — to Wariant C
- **Nie** robić auto-suggestions z analizy slugów — to backlog #4 (PROJECT_STATUS_CODEX) integrowane w Wariancie C
- Kod ma być **łatwo wydzielalny do standalone repo GitHub** — `addons/skalisty/internal-links/` ma być pełnym standalone projektem (composer.json, README, LICENSE, etc.) bez zewnętrznych zależności od plików w `skalisty-orion/`
- Texty UI w blueprintcie po polsku (zgodnie z konwencją skalisty-orion); nazwy klas/metod po angielsku (zgodnie z PSR)

## Kryteria akceptacji

- [ ] Katalog `addons/skalisty/internal-links/` z 12 plikami (10 nowych + 2 edytowane)
- [ ] `composer.json` addonu zgodny ze wzorcem `wysiwyg-html-fieldtype` (autoload, statamic.name, laravel.providers)
- [ ] `ServiceProvider` extends `AddonServiceProvider`, rejestruje modifier
- [ ] `ApplyInternalLinks` modifier (Statamic Modifier class) z metodą `index($value, $params, $context)`
- [ ] `LinkableContentParser` PHP class z `hideTags()` regex (5 typów) + `replaceKeyword()` + `getContent()` (restore hidden)
- [ ] Blueprint `internal_link.yaml` z polami: title, target_entry (entries picker pages+services+projects, single), keywords (replicator), max_per_page (default 1), weight (default 0), nofollow, open_in_new_window, enabled (default true)
- [ ] Collection `internal_links.yaml` w głównym `content/collections/` z 12 sites
- [ ] Path repository + require w głównym `composer.json`
- [ ] `composer require skalisty/internal-links @dev` przeszło bez błędów
- [ ] `php artisan vendor:publish --tag=internal-links-blueprints --force` skopiowało blueprint
- [ ] `php artisan stache:refresh` widzi Collection
- [ ] CP `/cp` lewa belka pokazuje "Internal Links" Collection
- [ ] Manualny test create entry → save → reload → entry istnieje
- [ ] Manualny test render: dodać Internal Link "akwarium" → modyfikator w widoku Free Text → render strony → "akwarium" zamienione na `<a href="/oferta/sztuczna-rafa-koralowa">akwarium</a>` (PL)
- [ ] Test exclusion: `<h2>akwarium</h2>` w content → NIE zostaje zlinkowane; `<p>akwarium</p>` → zostaje zlinkowane
- [ ] Multilingual: ten sam Internal Link w EN ma keyword "aquarium" → URL `/services/coral-reef-decoration` (lub locale-specific)
- [ ] README.md addonu zawiera: instalacja, użycie modyfikatora, przykład blueprintu, planowane etapy A → B → C
- [ ] ROADMAP.md addonu z opisem etapów
- [ ] `php artisan test` 2 passed
- [ ] HTTP `/` 200, `/en/` 200 (lub 301→200), `/cp/auth/login` 200

## Testowanie

Codex powinien wykonać:

```bash
# Po utworzeniu plików
composer require skalisty/internal-links @dev --no-interaction
php artisan vendor:publish --tag=internal-links-blueprints --force
php artisan statamic:stache:refresh
php artisan view:clear
php artisan test

# Smoke tests
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8001/
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8001/en/
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8001/cp/auth/login

# Manual CP test wymaga sesji admina:
# 1. /cp/collections/internal_links/entries/create
# 2. Wypełnij formularz, save
# 3. Sprawdź storage/.../internal_links/pl/*.md utworzony
```

Jeżeli testów manualnych w CP nie da się uruchomić w sandboxie Codexa (brak sesji admin), Codex zapisuje w `CODEX_SUGGESTIONS.md` jakie testy zostawia do walidacji przez Claude i user'a.

## Synchronizacja dokumentacji

- [x] `PROJECT_STATUS_CODEX.md` ma `active_task_id: FEATURE-internal-links-addon-mvp`
- [x] `PROJECT_STATUS_CODEX.md` pokazuje to zadanie w `W trakcie`
- [x] `CLAUDE_MEMORY.md` ma `active_task_id`
- [x] `CLAUDE_MEMORY.md` pokazuje ten brief jako ostatni brief dla Codex
- [x] Poprzedni `last_closed: FIX-service-section-button-entry` zachowany

## Informacje do zapisania w CODEX_SUGGESTIONS.md (ACTIVE_FOR_CLAUDE_REVIEW)

- Co wykonane (lista 8 kroków + status)
- Zmienione/dodane pliki (12 plików + struktura katalogu)
- Czy `composer require skalisty/internal-links @dev` przeszło bez konfliktów (zgłosić jeśli wystąpiły)
- Czy blueprint replicator dla `keywords` był edytowalny w CP (replicator sets format może wymagać tweakowania)
- Próbka HTML przed/po `apply_internal_links` modifier — z exclusion test (h2 vs p)
- Czy `target_entry` (entries picker) zwraca proper Augmented entry — wzorzec z services_grid_section
- Multilingual: czy PL/EN linki działają poprawnie
- Doc drift (jeśli wystąpił)
- Sugestie dla Claude (np. czy ROADMAP zawiera proper opis etapów A/B/C)

## Informacje do zapisania w codex-memory.md

- Wzorzec lokalnego addonu Statamic (`addons/skalisty/internal-links/`) z full standalone strukturą — łatwe wydzielenie do osobnego repo GitHub w przyszłości
- Mechanizm Antlers modifier ` apply_internal_links` jako uniwersalny content transformer (działa dla Free Text, WYSIWYG HTML, Bard augmented HTML, plain text)
- `LinkableContentParser` regex hide tags pattern — port z WP plugin sprawdzony w produkcji

## Informacje do zapisania w CONCLUSIONS_CODEX.md (jeśli warto)

- Czy odkryte alternatywne mechanizmy podmiany content w Statamic 6.22 (np. nowe hooks, Bard mutator API)
- Performance observation: ile czasu zajmuje `apply_internal_links` dla X linków × Y długości content (do oceny czy cron z Wariantu B będzie konieczny w realnych warunkach skalisty-orion)

---

*Brief utrzymywany przez Claude. Wzór adaptowany z WordPress plugin `typek-internal-links` (`example-addon-wordpress/`). Lokalny dev: frontend `http://127.0.0.1:8001/`, PHP `php artisan` (na dhosting: `php84`).*

*Po acceptance MVP: kolejny brief dla Wariant B (production-ready: settings global + Laravel Scheduler pre-computation + exclusions per entry). Po B: Wariant C (logs DB + custom CP panel + auto-suggestions — integracja z backlog #4).*

*Po stabilizacji v1.0 (Wariant C zaakceptowany): wydzielenie do standalone repo GitHub (analogicznie do `5k18a/laravel-statamic-ai-chatbot` z 2026-06-20).*
