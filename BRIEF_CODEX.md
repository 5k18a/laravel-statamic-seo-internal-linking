# BRIEF_CODEX.md

<!-- PROJECT_SYNC_START -->
state_version: 2026-06-21-2200
active_task_id: FEATURE-seo-errors-manager
active_task_name: SEO Errors Manager (CP panel + CLI prune)
active_task_status: active
active_task_source: BRIEF_CODEX.md
last_sync: 2026-06-21 22:00 Europe/Warsaw
last_synced_by: Claude
last_closed: HOTFIX-gallery-tags-fieldtype
next_after_active: Wybór z backlogu (cleanup demo Orion content / chatbot AI PoC / Formularze kontaktowe / pozostałe warianty Services Grid)
<!-- PROJECT_SYNC_END -->

---

## Status

**AKTYWNE**

## Cel zadania

Wdrożyć w aplikacji **paralelny panel CP "SEO Errors Manager"** (sekcja Tools) do zarządzania błędami 404 logowanymi przez addon `statamic/seo-pro` — z możliwością kasowania pojedynczych wpisów + bulk delete + filtrowania po locale + sortowania, plus opcjonalny link do natywnego "Create Redirect" SEO Pro. Dodatkowo: artisan command `seo:errors:prune` do bulk delete z parametrami filtrującymi (locale, wiek, liczba hits) — dla cron jobów i batch cleanup bez UI.

**Bez modyfikacji vendora `statamic/seo-pro`** — wykorzystujemy publiczne API SEO Pro (`Statamic\SeoPro\Facades\Error::all()`, `Error::find()`, `Error::delete()`), `composer update statamic/seo-pro` ma działać normalnie po wdrożeniu.

## Kontekst

SEO Pro v7.11.0 natywnie loguje błędy 404 do `storage/statamic/seopro/errors/<locale>/<slug>.yaml` (po jednym pliku per error, format YAML z polami `url`, `hits`, `last_hit_at`). Natywny widok CP `/cp/seo-pro/errors` to **read-only listing (Vue + Inertia)** z jedynym przyciskiem "Create Redirect" w każdym wierszu — **brak akcji delete**, mimo że wewnętrznie SEO Pro ma `ErrorRepository::delete(Error $error): void` i `Error::delete(): bool` (publiczne metody na repozytorium/modelu).

User chce regularnie kasować błędy 404 które są mu znane i nieistotne (nie wymagają redirecta), żeby lista nie rozrastała się i była bardziej użyteczna do śledzenia faktycznych problemów.

## Problem do rozwiązania

Brak UI do kasowania błędów 404 w SEO Pro. Natywny widok nie wspiera Statamic Action system (Vue/Inertia hermetyzacja), więc rozszerzenie naturalnym `Action::register()` nie działa. Modyfikacja vendora ("psucie pluginu") odrzucona — chcemy zachować możliwość bezproblemowego `composer update`.

## Analiza gotowych rozwiązań

### Czy zadanie dotyczy nowej większej funkcjonalności?

TAK — nowy panel CP + nowy CLI command + zmiany w 4 plikach aplikacji.

### Dostępne rozwiązania (sprawdzone 2026-06-21)

| Rozwiązanie | Werdykt |
|---|---|
| Statamic `Action::register()` system | **Odrzucone** — SEO Pro Errors używa Inertia/Vue widok, nie standardowych Statamic Resource Listings; Action::register nie działa na tym widoku |
| JS injection do natywnego Inertia view | **Odrzucone** — Vue/Inertia jest hermetyczne, każdy update SEO Pro może złamać DOM, kruche |
| Composer-patches patch (analogicznie HOTFIX-18) | **Odrzucone** — psuje plugin, każda nowa wersja wymaga aktualizacji patcha |
| Fork SEO Pro | **Odrzucone** — overkill dla 2 endpointów |
| **Custom CP panel paralelny** w sekcji Tools (wzór: `CollectionRoutesController`, `UiTranslationsController`, `TranslatorApiController`) | **REKOMENDOWANE** — pełna kontrola, zero zależności od wewnętrznej struktury vendor, wykorzystuje publiczne API `Facades\Error::*` |
| **Artisan CLI command** dla batch operacji | **REKOMENDOWANE** jako uzupełnienie — przydatne dla cron jobów |

### Rekomendacja Claude

**Custom CP panel "SEO Errors Manager"** + **artisan command `seo:errors:prune`**.

### Uzasadnienie

- Panel CP nie modyfikuje wnętrza `vendor/statamic/seo-pro/` — wykorzystuje **publiczne API** (`Statamic\SeoPro\Facades\Error::all()`, `Error::find($id)`, `Error::delete()` na modelu)
- Wzór już ugruntowany w projekcie: `CollectionRoutesController`, `UiTranslationsController`, `TranslatorApiController` (sekcja Tools w nav, prefix routes, Blade views)
- Permissions SEO Pro można sprawdzić przez `ErrorPolicy` (`User::hasPermission('view seo redirects')`) — wymagamy tej samej permission do delete dla minimal-friction
- CLI command pozwala na bulk cleanup w cron jobach (np. miesięczne usuwanie errors starszych niż 30 dni z mniej niż 2 hits)

## Zakres pracy

### Krok 1 — Controller `app/Http/Controllers/CP/SeoErrorsController.php`

Nowy controller w stylu `UiTranslationsController` (extends `App\Http\Controllers\Controller`):

```php
<?php

namespace App\Http\Controllers\CP;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Statamic\Facades\User;
use Statamic\SeoPro\Facades\Error;

class SeoErrorsController extends Controller
{
    public function index(Request $request): View
    {
        $this->authorize();

        $locale = $request->get('locale');
        $sort = $request->get('sort', 'last_hit_at'); // 'last_hit_at' | 'hits' | 'url'
        $order = $request->get('order', 'desc');

        $query = Error::query();
        if ($locale) {
            $query->where('locale', $locale);
        }
        // sortowanie via collection po fetchu (Error::all() zwraca Collection)
        $errors = $query->get()
            ->sortBy($sort, SORT_REGULAR, $order === 'desc')
            ->values();

        $locales = collect($errors)->pluck('locale')->unique()->sort()->values();
        $availableSites = \Statamic\Facades\Site::all()->map->handle()->values();

        return view('cp.seo_errors.index', [
            'errors' => $errors,
            'locales' => $locales,
            'sites' => $availableSites,
            'currentLocale' => $locale,
            'currentSort' => $sort,
            'currentOrder' => $order,
        ]);
    }

    public function destroy(string $id): JsonResponse
    {
        $this->authorize();

        $error = Error::find($id);
        if (!$error) {
            return response()->json(['ok' => false, 'message' => 'Error nie znaleziony'], 404);
        }

        $error->delete();

        return response()->json(['ok' => true]);
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        $this->authorize();

        $ids = $request->input('ids', []);
        if (empty($ids) || !is_array($ids)) {
            return response()->json(['ok' => false, 'message' => 'Brak wybranych ID'], 400);
        }

        $deleted = 0;
        foreach ($ids as $id) {
            $error = Error::find($id);
            if ($error) {
                $error->delete();
                $deleted++;
            }
        }

        return response()->json(['ok' => true, 'deleted' => $deleted]);
    }

    private function authorize(): void
    {
        $user = User::current();
        if (!$user) {
            abort(401);
        }
        if ($user->isSuper()) {
            return;
        }
        if (!$user->hasPermission('view seo redirects')) {
            abort(403);
        }
    }
}
```

Uwagi:
- `Statamic\SeoPro\Facades\Error::all()` zwraca **Eloquent-style Collection of `Error` models** — sprawdzić w `vendor/statamic/seo-pro/src/Redirects/Error.php` jak konstruowany jest `id` modelu (prawdopodobnie kombinacja `locale + slug` — sprawdź `getKey()` lub `getRouteKey()`)
- Jeśli `Error::query()` nie obsługuje `->where('locale', ...)` (sprawdź `ErrorQueryBuilder.php`), filtruj w PHP po `Error::all()->where('locale', $locale)`
- `Error::find($id)` — sprawdzić sygnaturę, może być `find(string $locale, string $slug)` lub composite key

### Krok 2 — Widok Blade `resources/views/cp/seo_errors/index.blade.php`

Wzór z `resources/views/cp/collection_routes/index.blade.php`. Tabela z checkboxami, bulk delete button w toolbar, delete button per row, filter dropdown locale, sort linki w nagłówkach kolumn, link "Create Redirect" do natywnego `/cp/seo-pro/redirects/create?source=<url>` per row.

Wymagania UI:
- `@extends('statamic::layout')`
- `@section('title', 'SEO Errors Manager')`
- Toolbar:
  - Bulk delete button (disabled gdy nic nie wybrane)
  - Filter dropdown locale (12 site handles + opcja "Wszystkie")
  - Licznik: "Wyświetlono X błędów (Y zaznaczonych)"
- Tabela `data-table`:
  - Checkbox "select all" w nagłówku
  - Kolumny: checkbox, URL (sortowalna), Locale, Hits (sortowalna), Last Hit At (sortowalna), Akcje
  - Akcje per row: Delete (czerwony) + Create Redirect (link do `/cp/seo-pro/redirects/create?source={{ $error->url }}`)
- Confirm modal dla pojedynczego delete: standardowy `confirm()` JS lub Statamic's `confirmation-modal` component
- AJAX delete (fetch z CSRF token z `meta[name=csrf-token]`)
- Po delete: usunąć wiersz z DOM bez przeładowania strony (lub przeładować — minimalizm)
- Bulk delete: zbierz wszystkie `checked` checkboxes, POST do `bulk-delete` endpoint, po success usunąć wiersze
- Empty state: "Brak błędów 404. Świetna robota!" gdy filter zwraca 0 wyników

Klasy Tailwind CP używać tych samych co istniejące widoki (`card`, `data-table`, `btn btn-danger`, `btn btn-primary`, `text-grey-60`, `font-mono text-sm`).

JS może być vanilla (bez Vue/Alpine — wzór CollectionRoutes). Z mojej strony rekomendacja: vanilla `<script>` na końcu widoku z `addEventListener` na buttonach.

### Krok 3 — Routes w `routes/cp.php`

Dodać na końcu pliku:

```php
use App\Http\Controllers\CP\SeoErrorsController;

Route::prefix('seo-errors-manager')->name('seo-errors-manager.')->group(function () {
    Route::get('/', [SeoErrorsController::class, 'index'])->name('index');
    Route::delete('/{id}', [SeoErrorsController::class, 'destroy'])->name('destroy');
    Route::post('/bulk-delete', [SeoErrorsController::class, 'bulkDelete'])->name('bulk-delete');
});
```

**WAŻNE (lekcja UI-Translations-Panel z 2026-06-02):** `routes/cp.php` NIE jest auto-ładowany w Statamic 6 — wymaga ręcznej rejestracji przez `Statamic::pushCpRoutes()` w `AppServiceProvider::boot()`. Sprawdzić w `app/Providers/AppServiceProvider.php` czy jest już wywołanie `Statamic::pushCpRoutes(function () { require __DIR__ . '/../../routes/cp.php'; });` (powinno być z poprzednich paneli). Jeśli jest — nic nie trzeba dodawać, wystarczy dopisać routes.

### Krok 4 — Nav item w `app/Providers/AppServiceProvider.php`

Wewnątrz istniejącego `Nav::extend()` (po `Translator API`) dodać:

```php
$nav->create('SEO Errors')
    ->section('Tools')
    ->url(cp_route('seo-errors-manager.index'))
    ->icon('alert');
```

Ikona `alert` (Statamic ma `alert`, `alert-triangle`, `bug`, `error` — wybrać semantycznie pasującą do błędów).

### Krok 5 — Artisan command `app/Console/Commands/SeoErrorsPrune.php`

Nowa komenda do bulk cleanup w cron / CLI:

```php
<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Statamic\SeoPro\Facades\Error;
use Carbon\Carbon;

class SeoErrorsPrune extends Command
{
    protected $signature = 'seo:errors:prune
                            {--locale= : Filtr per locale (np. pl, en)}
                            {--older-than= : Wiek (np. 30d, 7d, 1y)}
                            {--hits-lt= : Tylko wpisy z liczbą hits mniejszą niż X}
                            {--all : Usuń wszystkie wpisy (wymaga --confirm)}
                            {--confirm : Potwierdź usunięcie bez interaktywnego prompta}
                            {--dry-run : Pokaż co byłoby usunięte, nic nie zapisuj}';

    protected $description = 'Bulk delete SEO Pro 404 error entries with filtering';

    public function handle(): int
    {
        $errors = Error::all();
        $original = $errors->count();

        if ($this->option('locale')) {
            $errors = $errors->where('locale', $this->option('locale'));
        }

        if ($this->option('older-than')) {
            $threshold = $this->parseOlderThan($this->option('older-than'));
            if (!$threshold) {
                $this->error('Niewłaściwy format --older-than (oczekiwane: 30d, 7d, 1y)');
                return self::FAILURE;
            }
            $errors = $errors->filter(fn($e) => Carbon::parse($e->last_hit_at)->lt($threshold));
        }

        if ($this->option('hits-lt')) {
            $errors = $errors->filter(fn($e) => (int) $e->hits < (int) $this->option('hits-lt'));
        }

        if (!$this->option('all') && !$this->option('locale') && !$this->option('older-than') && !$this->option('hits-lt')) {
            $this->error('Musisz podać co najmniej jeden filtr lub --all');
            return self::FAILURE;
        }

        $count = $errors->count();

        if ($count === 0) {
            $this->info('Brak wpisów spełniających filtry (z ' . $original . ' łącznie).');
            return self::SUCCESS;
        }

        $this->info("Wpisów do usunięcia: <fg=yellow>{$count}</> (z {$original} łącznie).");

        if ($this->option('dry-run')) {
            $this->line('--dry-run: poniżej lista wpisów, nic nie usunięto');
            foreach ($errors as $e) {
                $this->line("  {$e->locale} → {$e->url} (hits={$e->hits}, last={$e->last_hit_at})");
            }
            return self::SUCCESS;
        }

        if (!$this->option('confirm') && !$this->confirm("Czy na pewno usunąć {$count} wpisów?")) {
            $this->info('Anulowane.');
            return self::SUCCESS;
        }

        $deleted = 0;
        foreach ($errors as $error) {
            $error->delete();
            $deleted++;
        }

        $this->info("Usunięto: <fg=green>{$deleted}</>");
        return self::SUCCESS;
    }

    private function parseOlderThan(string $value): ?Carbon
    {
        if (preg_match('/^(\d+)([dmy])$/', $value, $m)) {
            $n = (int) $m[1];
            return match ($m[2]) {
                'd' => Carbon::now()->subDays($n),
                'm' => Carbon::now()->subMonths($n),
                'y' => Carbon::now()->subYears($n),
            };
        }
        return null;
    }
}
```

Komenda Laravelowa auto-rejestruje się przez `app/Console/Kernel.php` → `commands($this->load(...))` (default Laravel). Sprawdzić — jeśli używamy `app/Console/Commands/` katalog, default load go pickuje.

Przykłady użycia:
- `php artisan seo:errors:prune --dry-run --older-than=30d`
- `php artisan seo:errors:prune --locale=pl --hits-lt=2 --confirm`
- `php artisan seo:errors:prune --all --confirm` (z `--confirm` żeby ominąć prompt — niebezpieczne, dla cron)

### Krok 6 — Sanity check + Stache

Po wdrożeniu plików:

```bash
php artisan view:clear
php artisan cache:clear
php artisan route:list | grep seo-errors
# Oczekiwane: 3 routy (index GET, destroy DELETE, bulk-delete POST)
php artisan list seo:errors
# Oczekiwane: seo:errors:prune
```

### Krok 7 — Walidacja end-to-end

- `php artisan test` — 2 passed (smoke)
- Lokalnie zalogowany w `/cp`:
  - `/cp/seo-errors-manager` — 200, tabela renderuje istniejące błędy (lokalnie powinno być kilka — `storage/statamic/seopro/errors/pl/*.yaml` ma kilka wpisów)
  - Klik Delete na pojedynczym wierszu → confirm → usuwa wpis (sprawdzić że plik YAML w storage znika)
  - Wybór 2-3 checkboxów → Bulk Delete → znika z listy + storage
  - Filter po locale → tylko PL/EN/etc.
  - Sort po kolumnach (URL/Hits/Last Hit At) działa
  - Link "Create Redirect" otwiera `/cp/seo-pro/redirects/create?source=...` (natywny widok SEO Pro z prefilled source)
- CLI: `php artisan seo:errors:prune --dry-run --older-than=30d` — pokazuje listę, nic nie usuwa
- CLI: `php artisan seo:errors:prune --locale=cs --confirm` — usuwa wpisy CS, raportuje liczbę

## Pliki do sprawdzenia

- `vendor/statamic/seo-pro/src/Redirects/Error.php` — model, klucze (`getKey()`, `getRouteKey()`), atrybuty (`locale`, `url`, `hits`, `last_hit_at`), metoda `delete(): bool`
- `vendor/statamic/seo-pro/src/Redirects/ErrorRepository.php` — `all()`, `find($id)`, `delete(Error)`, czy `query()` jest dostępne
- `vendor/statamic/seo-pro/src/Redirects/ErrorQueryBuilder.php` — czy `->where('locale', ...)` jest możliwe na queryBuilderze, czy filtruje się na Collection
- `vendor/statamic/seo-pro/src/Facades/Error.php` — facade, jakie metody są publiczne (`Error::all()`, `Error::find()`, `Error::query()`)
- `vendor/statamic/seo-pro/src/Policies/ErrorPolicy.php` — permission `'view seo redirects'`
- `vendor/statamic/seo-pro/routes/cp.php` — natywna route `redirects/create` (dla linku "Create Redirect")
- `storage/statamic/seopro/errors/<locale>/*.yaml` — format pliku error (url, hits, last_hit_at)
- `app/Http/Controllers/CP/UiTranslationsController.php` — **wzór controller pattern** (namespace, View return, Statamic facades, route)
- `app/Http/Controllers/CP/CollectionRoutesController.php` — **wzór controller pattern** (alternatywny)
- `resources/views/cp/collection_routes/index.blade.php` — **wzór Blade view** (Tailwind classes, data-table, btn classes)
- `routes/cp.php` — istniejące routes per panel, wzór prefix+name group
- `app/Providers/AppServiceProvider.php` — istniejące `Nav::extend()` z 3 panelami Tools, `Statamic::pushCpRoutes()` rejestracja

## Pliki do zmiany

**Nowe:**
- `app/Http/Controllers/CP/SeoErrorsController.php` (~100 linii)
- `app/Console/Commands/SeoErrorsPrune.php` (~90 linii)
- `resources/views/cp/seo_errors/index.blade.php` (~150 linii — Blade + inline `<script>`)

**Edytowane:**
- `routes/cp.php` — dodać 3 routy (~6 linii)
- `app/Providers/AppServiceProvider.php` — dodać 1 nav item (~4 linie)

## Wymagania techniczne

- **Bez modyfikacji `vendor/statamic/seo-pro/`** — pełne wykorzystanie publicznych API:
  - `Statamic\SeoPro\Facades\Error::all()` — kolekcja wszystkich errors
  - `Statamic\SeoPro\Facades\Error::find($id)` — pojedynczy error po ID
  - `$error->delete()` — instance method
- Standard Statamic CP layout (`@extends('statamic::layout')`)
- Statamic Permissions check (`User::current()->hasPermission('view seo redirects')` lub `isSuper()`)
- CSRF token w POST/DELETE requests (`@csrf` lub `<meta name="csrf-token">` + JS)
- Bez nowych dependencies composer/npm
- AJAX requests (delete + bulk-delete) — vanilla `fetch()` z CSRF, response JSON `{ok: bool, ...}`
- Vanilla JS na końcu widoku (bez Vue/Alpine — wzór z innych paneli)

## Ograniczenia

- **Nie** modyfikować `vendor/statamic/seo-pro/` (główna decyzja architektoniczna — bez patcha composer-patches)
- **Nie** dodawać nowych zależności composer/npm
- **Nie** dotykać istniejących panels CP (CollectionRoutes, UiTranslations, TranslatorApi)
- **Nie** dotykać natywnego widoku SEO Pro `/cp/seo-pro/errors` (panel paralelny, nie alternatywa)
- **Nie** zmieniać konfiguracji SEO Pro (`config/statamic/seo-pro.php`)
- **Nie** zmieniać formatu plików storage SEO Pro (`storage/statamic/seopro/errors/`)
- Wszystkie teksty UI **po polsku** (zgodnie z konwencją innych Tools panels — "Trasy URL kolekcji", "Tłumaczenia UI", "Translator API")
- Klasy CSS Tailwind: tylko te które są w `output.css` (wzór z innych Blade views)
- Permission check: minimum `'view seo redirects'` (taka sama jak natywny listing) — dla delete nie tworzymy osobnej permission (uproszczenie)

## Kryteria akceptacji

- [ ] Plik `app/Http/Controllers/CP/SeoErrorsController.php` z metodami `index`, `destroy`, `bulkDelete` + private `authorize()`
- [ ] Plik `app/Console/Commands/SeoErrorsPrune.php` z signature `seo:errors:prune {--locale=} {--older-than=} {--hits-lt=} {--all} {--confirm} {--dry-run}`
- [ ] Plik `resources/views/cp/seo_errors/index.blade.php` — Blade view z tabelą, checkboxami, bulk delete button, filter, sort, akcjami per row
- [ ] `routes/cp.php` zawiera 3 routy w prefix `seo-errors-manager` z properly named (`seo-errors-manager.index`, `.destroy`, `.bulk-delete`)
- [ ] `AppServiceProvider::boot()` `Nav::extend` zawiera nowy item "SEO Errors" w sekcji Tools
- [ ] `php artisan route:list | grep seo-errors` — pokazuje 3 routy
- [ ] `php artisan list seo:errors` — pokazuje komendę `seo:errors:prune`
- [ ] `php artisan test` — 2 passed
- [ ] HTTP `/cp/seo-errors-manager` (zalogowany super-admin) → 200, tabela renderuje istniejące błędy z `storage/statamic/seopro/errors/`
- [ ] Delete pojedynczy: klik → confirm → AJAX DELETE → JSON `{ok: true}` → wiersz znika + plik YAML w storage usunięty
- [ ] Bulk delete: zaznacz 2-3 → klik Bulk Delete → AJAX POST → JSON `{ok: true, deleted: N}` → wiersze znikają + pliki usunięte
- [ ] Filter locale: dropdown zmienia query string, listing pokazuje tylko wybrane locale
- [ ] Sort: klik na nagłówek kolumny zmienia order (ASC/DESC toggle)
- [ ] Link "Create Redirect": klik otwiera `/cp/seo-pro/redirects/create?source=<URL>` (natywny SEO Pro)
- [ ] Empty state: jeśli filter zwraca 0 wyników, widok pokazuje "Brak błędów 404"
- [ ] CLI `seo:errors:prune --dry-run --older-than=30d` — pokazuje listę, nic nie usuwa
- [ ] CLI `seo:errors:prune --locale=pl --hits-lt=2 --confirm` — usuwa, raportuje liczbę
- [ ] CLI bez żadnego filtra ani `--all` → error "Musisz podać co najmniej jeden filtr lub --all"
- [ ] Po `composer update statamic/seo-pro` (jeśli pojawi się update) — panel nadal działa (zero modyfikacji vendora)

## Testowanie

Codex powinien wykonać:

```bash
php artisan view:clear
php artisan cache:clear
php artisan route:list | grep seo-errors
php artisan list seo:errors
php artisan test

# Sanity check storage przed/po delete (lokalnie):
ls storage/statamic/seopro/errors/pl/  # przed
# (manualnie w CP) Delete 1 wpis
ls storage/statamic/seopro/errors/pl/  # po — jeden mniej

# CLI dry-run:
php artisan seo:errors:prune --dry-run --older-than=1d  # pokazuje wszystkie (lokalne są starsze niż 1d)

# CLI prune (na własnym ryzyku w lokalnym storage):
php artisan seo:errors:prune --locale=de --confirm
```

Jeżeli testów manualnych w CP nie da się uruchomić w sandboxie Codexa (brak sesji admina), Codex zapisuje w `CODEX_SUGGESTIONS.md` jakie testy zostawia do walidacji przez Claude i user'a.

## Synchronizacja dokumentacji

- [x] `PROJECT_STATUS_CODEX.md` ma `active_task_id: FEATURE-seo-errors-manager`
- [x] `PROJECT_STATUS_CODEX.md` pokazuje to zadanie w `W trakcie`
- [x] `CLAUDE_MEMORY.md` ma `active_task_id: FEATURE-seo-errors-manager`
- [x] `CLAUDE_MEMORY.md` pokazuje ten brief jako ostatni brief dla Codex
- [x] Poprzedni `last_closed: HOTFIX-gallery-tags-fieldtype` zachowany
- [x] Nie ma wpisu "Brak aktywnych zadań" gdy brief jest aktywny

## Informacje do zapisania w CODEX_SUGGESTIONS.md (ACTIVE_FOR_CLAUDE_REVIEW)

Po zakończeniu Codex dopisuje:

- Co wykonane (lista 7 kroków + status każdego)
- Zmienione/dodane pliki (5 plików: 3 nowe + 2 edytowane)
- Sygnatura `Error::find($id)` (po sprawdzeniu vendora) — jak konstruowany jest ID, czy composite key
- Czy `Error::query()->where('locale', $locale)` zadziałało, czy trzeba było filtrować w Collection
- Permissions: czy minimal `'view seo redirects'` wystarczyło, czy wymagana inna
- Czy `Statamic::pushCpRoutes()` było już zarejestrowane (powinno być z poprzednich paneli)
- Próbka HTTP requestów: status code z `/cp/seo-errors-manager`, DELETE response body
- CLI: testowe wywołanie z `--dry-run` — pełen output
- Doc drift (jeśli wystąpił)
- Gotowe rozwiązania zauważone podczas pracy (jeśli warto rozważyć w przyszłości)
- Sugestie dla Claude

## Informacje do zapisania w codex-memory.md

- Wzorzec rozszerzania funkcjonalności addonu bez modyfikacji vendora — własny CP panel + endpoints + CLI command, wykorzystując publiczne facade addonu
- Konwencja paneli Tools w projekcie skalisty: prefix routes, name group, nav item w `AppServiceProvider::boot()` z `Nav::extend`, Blade view w `resources/views/cp/<name>/index.blade.php`, vanilla JS
- Statamic Facade SEO Pro: `Statamic\SeoPro\Facades\Error::*` jako stabilne publiczne API
- Wzór permission check minimal: `User::current()->isSuper() || hasPermission('view seo redirects')`

## Informacje do zapisania w CONCLUSIONS_CODEX.md (jeśli istotne)

Jeśli pojawi się odkrycie:
- Czy istnieje sposób na rozszerzenie natywnego widoku Inertia SEO Pro przez Statamic hook (raczej nie, ale warto zaznaczyć w wnioskach)
- Czy SEO Pro w przyszłych wersjach planuje dodać delete UI (sprawdzić GitHub issues addonu jeśli ma znaczenie dla architektury)

---

*Brief utrzymywany przez Claude. Lokalny dev: frontend `http://127.0.0.1:8001/`, PHP `php artisan` (na dhosting: `php84`).*
