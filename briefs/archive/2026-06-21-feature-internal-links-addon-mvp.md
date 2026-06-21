# BRIEF ARCHIVE: FEATURE-internal-links-addon-mvp (Wariant A: MVP)

**Status końcowy:** ZAMKNIĘTY / ACCEPTED (audyt Claude 2026-06-21 wieczór)
**Aktywowany:** 2026-06-21 23:00
**Zamknięty:** 2026-06-21 ~23:50 (sesja EOD2)
**Czas implementacji + audyt:** ~50 min (Codex MVP) + ~15 min (audyt Claude)

---

## Cel zadania

Wariant A (MVP) samodzielnego addonu Statamic `skalisty/internal-links` w `addons/skalisty/internal-links/` — auto-linkowanie słów kluczowych w content. Wzorzec adaptowany z WordPress plugin `wptypek-internal-links`, ale wykorzystujący natywne mechanizmy Statamic 6 + multilingual gratis przez Statamic Collections.

## Architektura zaimplementowana

**11 plików addonu:**
- `addons/skalisty/internal-links/composer.json` (PSR-4 autoload `Skalisty\InternalLinks\\`)
- `addons/skalisty/internal-links/src/ServiceProvider.php` (extends AddonServiceProvider, rejestruje modifier + publish blueprint)
- `addons/skalisty/internal-links/src/Modifiers/ApplyInternalLinks.php` (runtime transformer treści)
- `addons/skalisty/internal-links/src/Support/LinkableContentParser.php` (regex hide tags + replaceKeyword)
- `addons/skalisty/internal-links/resources/blueprints/collections/internal_links/internal_link.yaml` (8 pól)
- `addons/skalisty/internal-links/README.md`, `CHANGELOG.md`, `ROADMAP.md`, `LICENSE`, `VERSION.md`, `.gitignore`

**5 plików integracyjnych w głównym projekcie:**
- `composer.json` (path repository + require `skalisty/internal-links: @dev`)
- `composer.lock`
- `content/collections/internal_links.yaml` (12 sites, propagate: false)
- `resources/blueprints/collections/internal_links/internal_link.yaml` (auto-published kopia)
- `resources/views/page_builder/free_text_section.antlers.html` (2 miejsca z `{{ content | apply_internal_links }}`)
- `resources/views/page_builder/wysiwyg_html_block.antlers.html` (1 miejsce)

## Funkcjonalność MVP

- Collection-based storage z multilingual native (12 sites Statamic)
- Mapping keyword → target_entry (entries picker pages+services+projects, multilingual auto-URL)
- Antlers modifier `apply_internal_links` jako uniwersalny content transformer
- Real-time substitution (no cron — wystarcza dla <500 linków)
- Regex hide tags: h1-6, a, img, figure, iframe, WP-style embeds (port z WP plugin)
- Sortowanie po `weight desc`, filter `enabled=true`
- Per-link `max_per_page`, `nofollow`, `open_in_new_window`

## Ulepszenia Codexa względem briefu (acceptable, kierunek lepszy)

- **Unicode lookbehind `\p{L}`** w regex — wsparcie dla polskich/CEE znaków (lepszy niż WP wersja)
- **Smart sentence punctuation preservation** — `Akwarium.` zachowuje kropkę poza anchor: `<a href="...">Akwarium</a>.`
- **`htmlspecialchars` na URL + keyword** — XSS-safe
- **Re-hide po każdym replace** — zapobiega nested anchor tags (`<a>` wewnątrz `<a>`)
- **`HtmlString` return** gdy input był `Htmlable` — Bard-friendly
- **`target_blank` automatycznie dodaje `rel="noopener"`** — security best practice

## Słuszne decyzje techniczne

- `$target->in($site)` z fallback dla multilingual proper
- `currentSite()` defensive — obsługuje string handle albo `Statamic\Sites\Site` object
- Augmented value dla `target_entry` resolver (Collection / array / string handling)

## Walidacja runtime (audyt Claude)

- `composer show skalisty/internal-links` → 0.1.0 (path package) ✅
- Collection `internal_links` zarejestrowane (12 sites, propagate: false) ✅
- Parser test (`<h2>akwarium tytuł</h2><p>Akwarium w paragrafie. Inne sztuczne skały.</p>`):
  ```
  <h2>akwarium tytuł</h2><p><a href="/oferta/sztuczna-rafa-koralowa">Akwarium</a> w paragrafie. Inne <a href="/oferta/sztuczne-skaly" rel="nofollow">sztuczne skały</a>.</p>
  ```
  - H2 wyłączony ✅
  - P zlinkowany ✅
  - Capitalization preserved (`Akwarium` → `Akwarium`) ✅
  - Polskie znaki działają (`sztuczne skały`) ✅
  - `rel="nofollow"` działa ✅
  - Kropka poza linkiem ✅
- `php artisan test` → 2 passed ✅

## Walidacja Codexa (raport ACTIVE_FOR_CLAUDE_REVIEW)

- `php -l` (3 pliki source) → OK
- `php artisan vendor:publish --tag=internal-links-blueprints --force` → OK
- `php artisan statamic:stache:refresh` + `view:clear` + `cache:clear` → OK
- `composer validate --no-check-publish` → valid (z 2 znanymi ostrzeżeniami: `license` w root, `@dev` wersja path package, oba acceptable)
- HTTP `/` `/en/` `/cp/auth/login` → 200
- Real render `page_builder.free_text_section` z tymczasowym wpisem `internal_links` → poprawne podlinkowanie

## Reguła respektowana (`feedback_internal_links_local_only.md`)

- **NIE deployowano** na `dev.skalisty.pl` ✅
- Testy wyłącznie lokalnie ✅
- Push do `5k18a/laravel-statamic-seo-internal-linking` (VCS, nie deploy) ✅

## Push do standalone repo

- `cd addons/skalisty/internal-links/`
- `git init` + `git branch -M main`
- `git remote add origin https://github.com/5k18a/laravel-statamic-seo-internal-linking.git`
- `git add -A && git commit -m "feat: initial release Wariant A (MVP)"`
- `git push -u origin main` → **`[new branch] main -> main`** ✅
- Po push: `.git/` w `addons/skalisty/internal-links/` usunięte (skalisty-orion traktuje katalog jako zwykły katalog; standalone repo zachowuje historię)

## Werdykt Claude: ACCEPTED

11 plików addonu + 5 integracyjnych, runtime test pass, push do standalone repo wykonany, reguła "lokalnie tylko" respektowana.

## Manualne testy do walidacji przez user'a (po Codexie)

- Czy "Internal Links" collection pokazuje się w lewej belce Content w CP
- Czy replicator `keywords` edytowalny w CP (sets format)
- Czy entries picker `target_entry` działa multilingual
- Czy toggles `enabled`, `nofollow`, `open_in_new_window` zapisują się poprawnie

## Kolejne etapy roll-out

- **Wariant B (production-ready)** — kolejny brief po feedbacku z lokalnych testów MVP. Settings global + Laravel Scheduler pre-computation + exclusions per entry. Push do tego samego repo `5k18a/laravel-statamic-seo-internal-linking`.
- **Wariant C (pełna parytet WP plugin)** — 1-2 sprinty. Logs DB + custom CP panel + auto-suggestions + import/export CSV.
- **Po stabilizacji v1.0** — pełna publikacja na repo + ewentualnie Packagist.

## Linki

- Pełny raport Codexa: `CODEX_SUGGESTIONS.md` (sekcja ACTIVE_FOR_CLAUDE_REVIEW 2026-06-21 18:00)
- Audyt Claude: `CODEX_SUGGESTIONS.md` → `RESOLVED_BY_CLAUDE` → 2026-06-21
- Wpis CHANGE-LOG: `CHANGE-LOG.md` → 2026-06-21 (FEATURE-internal-links-addon-mvp — closed/accepted)
- Standalone repo: https://github.com/5k18a/laravel-statamic-seo-internal-linking
