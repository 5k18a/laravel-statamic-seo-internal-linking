# Brief archiwum: FEATURE-figma-assets-install

**Data aktywacji:** 2026-06-17
**Data zamknięcia:** 2026-06-17
**Status końcowy:** ✅ Wykonane (Codex) + accepted (Claude)

## Cel zadania

Zainstalować i wstępnie skonfigurować addon `mariohamann/statamic-figma-assets` w projekcie tak, aby był widoczny w CP → Utilities → Figma Assets. Cel: umożliwić import ikon z plików Figma do osobnego kontenera Statamic Assets (4. kontener obok `assets`, `icons` (Tabler), `icons2` (Hugeicons)).

## Analiza gotowych rozwiązań (per AGENTS.md 9)

BUY z lokalnym forkiem — addon Mario Hamann pokrywa potrzebę, licencja MIT, kod ~380 linii (Controller + ServiceProvider + config + Blade). Constraint upstream `statamic/cms: ^5.0` blokował composer na 6, więc lokalny fork z bumpem `^5.0|^6.0` analogicznie do wzorca `wysiwyg-html-fieldtype`.

**Źródło:**
- https://statamic.com/addons/mariohamann/figma-assets
- https://github.com/mariohamann/statamic-figma-assets
- Licencja: MIT

## Zakres pracy (8 kroków)

1. `git clone` upstreamu do `addons/mariohamann/statamic-figma-assets/`, usunąć `.git`
2. Bump constrainta w forku: `statamic/cms: ^5.0` → `^5.0|^6.0`
3. Dodać path repository + require `mariohamann/statamic-figma-assets: @dev` do głównego composer.json
4. `composer require`
5. `vendor:publish --provider="MarioHamann\StatamicFigmaAssets\ServiceProvider"`
6. `.env` + `.env.example`: placeholdery `FIGMA_TOKEN=`, `FIGMA_FILE_ID=`, `FIGMA_ASSETS_CONTAINER=assets`
7. `optimize:clear`, `stache:refresh`, `php artisan test`
8. Smoke test: CP → Utilities → Figma Assets

## Faktyczne wykonanie (Codex)

Wszystkie 8 kroków wykonane zgodnie z briefem.

**Dodatkowo (poza briefem, słusznie):** hotfix widoku CP — Blade `index.blade.php` używał `@include('statamic::partials.breadcrumb')`, który nie istnieje w Statamic 6 → 500 przy pierwszym wejściu. Codex zastąpił partial linkiem `cp_route('utilities.index')`. Fix wpisuje się w cel briefu (kryterium akceptacji „strona ładuje się bez 500"), nie w rozszerzenie scope.

## Wyniki

- `git clone` + `composer update` — OK (po eskalacji DNS w sandboxie)
- `composer show mariohamann/statamic-figma-assets` — `dev-main` z path repository
- `php artisan route:list --name=statamic.cp.utilities.figma-assets` — 5 rout CP zarejestrowanych
- `Statamic\Facades\Utility::all()->map->handle()` — zawiera `figma_assets`
- `php artisan test` — 2 passed
- HTTP `/` → 200, `/en/` → 200
- CP `/cp/utilities/figma-assets` jako zalogowany admin → 200, response zawiera `Figma Assets`
- Doc drift: brak

## Audyt Claude (2026-06-17 16:50)

Decyzja: **accepted**

Weryfikacja niezależna na dysku:
- ✅ fork w `addons/mariohamann/statamic-figma-assets/`, bez `.git`
- ✅ constraint `^5.0|^6.0` w composer.json forka
- ✅ main composer.json: drugi wpis `repositories` + `require: @dev`
- ✅ config opublikowany: `config/statamic-figma-assets.php`
- ✅ `.env` + `.env.example`: 3 placeholdery FIGMA_*
- ✅ hotfix breadcrumb obecny w widoku
- ✅ `php artisan test` — 2 passed
- ✅ HTTP 200 dla `/` i `/en/`
- ✅ `/cp/login` → 302 (auth wall działa)

## Następne kroki (decyzja użytkownika)

- POC z faktycznym `FIGMA_TOKEN` + `FIGMA_FILE_ID` (potrzebny plik Figma)
- LUB osobny kontener `figma-icons` zamiast domyślnego `assets`
- LUB powrót do priorytetu Formularzy
