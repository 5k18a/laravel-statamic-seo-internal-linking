# BRIEF_CODEX.md

<!-- PROJECT_SYNC_START -->
state_version: 2026-06-07-1600
active_task_id: none
active_task_name: Brak aktywnego zadania
active_task_status: none
active_task_source: BRIEF_CODEX.md
last_sync: 2026-06-07 16:00 Europe/Warsaw
last_synced_by: Claude
last_closed: FEATURE-collection-routes-panel
next_after_active: Formularze
<!-- PROJECT_SYNC_END -->

## Status

**BRAK AKTYWNEGO ZADANIA**

Ostatnie zamknięte: `FEATURE-collection-routes-panel` — zaakceptowane przez Claude (2026-06-07).  
Brief zarchiwizowany: `briefs/archive/2026-06-07-feature-collection-routes-panel.md`

Następne zadanie: **Formularze kontaktowe** — zakres do ustalenia z użytkownikiem.

---

## Cel zadania (FEATURE-collection-routes-panel — ZAMKNIĘTE)

Stworzyć narzędzie w panelu CP (Statamic Control Panel > Tools) do zarządzania trasami URL kolekcji. Panel pozwoli administratorowi ustawiać inny URL per język bez edycji plików YAML.

## Kontekst

Statamic obsługuje per-site routes w kolekcjach — klucz `route` w `content/collections/{handle}.yaml` może być stringiem (jedna trasa dla wszystkich języków) lub mapą `{locale}: '/trasa/{slug}'` (osobna trasa na język). Aktualna konfiguracja projektów ma `route: '/project/{slug}'` — użytkownik chce zmienić polską wersję na `/realizacje/{slug}`, a w przyszłości podobne zmiany będą dotyczyć kolejnych kolekcji. Edycja plików YAML bezpośrednio jest nieefektywna — stąd potrzeba panelu CP.

Projekt ma już analogiczne narzędzia CP: `Tłumaczenia UI` i `Translator API` — należy ściśle wzorować się na tym wzorcu.

## Analiza gotowych rozwiązań

### Czy istnieje gotowy addon Statamic do zarządzania trasami?

NIE — brak standardowego rozwiązania w Statamic Marketplace. Trasy kolekcji są konfiguracją pliku, nie treścią — żaden wbudowany panel CP ich nie eksponuje.

### Uzasadnienie własnej implementacji

Prosta funkcjonalność CRUD (odczyt/zapis YAML), jednolita z istniejącym wzorcem narzędzi CP projektu. Implementacja: 1 kontroler + 2 widoki Blade + 3 linie w routach + 1 wpis w nawigacji + zmiana projects.yaml.

## Zakres pracy

### Pliki do **stworzenia**

1. `app/Http/Controllers/CP/CollectionRoutesController.php`
2. `resources/views/cp/collection_routes/index.blade.php`
3. `resources/views/cp/collection_routes/edit.blade.php`

### Pliki do **modyfikacji**

4. `routes/cp.php` — dodać grupę tras `collection-routes`
5. `app/Providers/AppServiceProvider.php` — dodać wpis nawigacji w `Nav::extend`
6. `content/collections/projects.yaml` — zmienić `route` z jednego stringa na mapę per-site

---

## Plik 1 — `app/Http/Controllers/CP/CollectionRoutesController.php`

Stworzyć plik od zera:

```php
<?php

namespace App\Http\Controllers\CP;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;
use Illuminate\View\View;
use Statamic\Facades\Site;
use Symfony\Component\Yaml\Yaml;

class CollectionRoutesController extends Controller
{
    private array $managedCollections = [
        'projects' => 'Projekty (Projects)',
    ];

    public function index(): View
    {
        $collections = collect($this->managedCollections)->map(function ($label, $handle) {
            $yaml = $this->readYaml($handle);
            $route = $yaml['route'] ?? null;

            return [
                'handle'       => $handle,
                'label'        => $label,
                'route_raw'    => $route,
                'is_localized' => is_array($route),
                'url'          => cp_route('collection-routes.edit', $handle),
            ];
        });

        return view('cp.collection_routes.index', compact('collections'));
    }

    public function edit(string $collection): View
    {
        abort_unless(isset($this->managedCollections[$collection]), 404);

        $yaml   = $this->readYaml($collection);
        $sites  = Site::all();
        $rawRoute = $yaml['route'] ?? '';
        $routes = [];

        foreach ($sites as $handle => $site) {
            $routes[$handle] = is_array($rawRoute)
                ? ($rawRoute[$handle] ?? '')
                : (string) $rawRoute;
        }

        return view('cp.collection_routes.edit', [
            'collection' => $collection,
            'label'      => $this->managedCollections[$collection],
            'sites'      => $sites,
            'routes'     => $routes,
        ]);
    }

    public function update(Request $request, string $collection): RedirectResponse
    {
        abort_unless(isset($this->managedCollections[$collection]), 404);

        $yaml   = $this->readYaml($collection);
        $routes = array_map('trim', $request->input('routes', []));
        $routes = array_filter($routes, fn ($v) => $v !== '');

        $unique = array_unique(array_values($routes));
        $yaml['route'] = count($unique) === 1 ? reset($unique) : $routes;

        $this->writeYaml($collection, $yaml);

        Artisan::call('statamic:stache:refresh');

        return redirect()
            ->route('statamic.cp.collection-routes.edit', $collection)
            ->with('success', 'Trasy URL zapisane. Stache odświeżony.');
    }

    private function readYaml(string $collection): array
    {
        return Yaml::parseFile(base_path("content/collections/{$collection}.yaml")) ?? [];
    }

    private function writeYaml(string $collection, array $data): void
    {
        File::put(
            base_path("content/collections/{$collection}.yaml"),
            Yaml::dump($data, 4, 2)
        );
    }
}
```

---

## Plik 2 — `resources/views/cp/collection_routes/index.blade.php`

Stworzyć plik od zera. Wzorować się na `resources/views/cp/ui_translations/index.blade.php`.

```blade
@extends('statamic::layout')

@section('title', 'Trasy URL kolekcji')

@section('content')
    <div class="flex items-center justify-between mb-6">
        <h1 class="text-3xl font-bold">Trasy URL kolekcji</h1>
    </div>

    <div class="card p-0 overflow-hidden">
        <table class="data-table">
            <thead>
                <tr>
                    <th>Kolekcja</th>
                    <th>Aktualna trasa</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                @foreach ($collections as $item)
                    <tr>
                        <td class="font-medium">{{ $item['label'] }}</td>
                        <td class="font-mono text-sm">
                            @if ($item['is_localized'])
                                <span class="text-grey-60 italic">wielojęzyczna (per język)</span>
                            @else
                                {{ $item['route_raw'] ?? '—' }}
                            @endif
                        </td>
                        <td class="text-right">
                            <a href="{{ $item['url'] }}" class="btn btn-sm">Edytuj</a>
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    </div>
@endsection
```

---

## Plik 3 — `resources/views/cp/collection_routes/edit.blade.php`

Stworzyć plik od zera. Wzorować się na `resources/views/cp/ui_translations/edit.blade.php`.

```blade
@extends('statamic::layout')

@section('title', 'Trasy URL — ' . $label)

@section('content')
    <div class="flex items-center justify-between mb-6">
        <div>
            <a href="{{ cp_route('collection-routes.index') }}" class="text-sm text-grey mb-1 block">&larr; Trasy URL kolekcji</a>
            <h1 class="text-3xl font-bold">{{ $label }}</h1>
        </div>
    </div>

    @if (session('success'))
        <div class="card p-4 mb-6 bg-green-100 text-green-800">
            {{ session('success') }}
        </div>
    @endif

    <form method="POST" action="{{ cp_route('collection-routes.update', $collection) }}">
        @csrf

        <div class="card p-0 overflow-hidden">
            <table class="data-table">
                <thead>
                    <tr>
                        <th class="w-28">Język</th>
                        <th>Trasa URL</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach ($sites as $handle => $site)
                        <tr>
                            <td>
                                <span class="font-medium">{{ strtoupper($handle) }}</span>
                                <div class="text-xs text-grey-60">{{ $site->name() }}</div>
                            </td>
                            <td>
                                <input
                                    type="text"
                                    name="routes[{{ $handle }}]"
                                    value="{{ $routes[$handle] ?? '' }}"
                                    class="input-text w-full font-mono"
                                    placeholder="/{slug}"
                                >
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>

        <div class="mt-6 flex justify-end">
            <button type="submit" class="btn-primary">Zapisz trasy</button>
        </div>
    </form>
@endsection
```

---

## Plik 4 — `routes/cp.php` (modyfikacja)

Dodać na końcu pliku, po istniejących trasach:

```php
use App\Http\Controllers\CP\CollectionRoutesController;

Route::prefix('collection-routes')->name('collection-routes.')->group(function () {
    Route::get('/', [CollectionRoutesController::class, 'index'])->name('index');
    Route::get('/{collection}', [CollectionRoutesController::class, 'edit'])->name('edit');
    Route::post('/{collection}', [CollectionRoutesController::class, 'update'])->name('update');
});
```

**Uwaga:** `use App\Http\Controllers\CP\CollectionRoutesController;` dodać na górze pliku razem z innymi importami.

---

## Plik 5 — `app/Providers/AppServiceProvider.php` (modyfikacja)

W istniejącym bloku `Nav::extend(function ($nav) { ... })` dodać **trzeci wpis** (po `Tłumaczenia UI` i `Translator API`):

```php
$nav->create('Trasy URL')
    ->section('Tools')
    ->url(cp_route('collection-routes.index'))
    ->icon('link');
```

Cały blok po modyfikacji:

```php
Nav::extend(function ($nav) {
    $nav->create('Tłumaczenia UI')
        ->section('Tools')
        ->url(cp_route('ui-translations.index'))
        ->icon('translate');

    $nav->create('Translator API')
        ->section('Tools')
        ->url(cp_route('translator-api.index'))
        ->icon('key');

    $nav->create('Trasy URL')
        ->section('Tools')
        ->url(cp_route('collection-routes.index'))
        ->icon('link');
});
```

---

## Plik 6 — `content/collections/projects.yaml` (modyfikacja)

Zmienić linię `route: '/project/{slug}'` na mapę per-site. Wynikowy plik:

```yaml
title: Projects
template: project/show
revisions: false
route:
  pl: '/realizacje/{slug}'
  en: '/project/{slug}'
  sv: '/project/{slug}'
  no: '/project/{slug}'
  nl: '/project/{slug}'
  lv: '/project/{slug}'
  it: '/project/{slug}'
  fr: '/project/{slug}'
  es: '/project/{slug}'
  de: '/project/{slug}'
  da: '/project/{slug}'
  cs: '/project/{slug}'
date_behavior:
  past: public
  future: private
sites:
  - en
  - pl
  - sv
  - no
  - nl
  - lv
  - it
  - fr
  - es
  - de
  - da
  - cs
propagate: true
```

---

## Wymagania techniczne

- `Symfony\Component\Yaml\Yaml` — już dostępny w projekcie (Statamic go używa)
- `Statamic\Facades\Site` — dostępny, zwraca Collection keyed by handle
- `Artisan::call('statamic:stache:refresh')` — wymagane po zapisie aby trasy weszły w życie
- Widoki Blade: `@extends('statamic::layout')` — identycznie jak `ui_translations`
- Routing: nazwy tras muszą mieć prefiks `statamic.cp.` — zapewnia to `Statamic::pushCpRoutes` w AppServiceProvider

## Ograniczenia

- Nie modyfikować innych plików YAML kolekcji niż `projects.yaml`
- `$managedCollections` w kontrolerze to lista zarządzana programowo — aby dodać nową kolekcję do panelu, dopisuje się nowy wpis do tej tablicy (nie przez UI)
- Nie dodawać walidacji formatu trasy — administrator jest odpowiedzialny za poprawność
- Nie zmieniać struktury istniejących narzędzi CP

## Kryteria akceptacji

- [ ] CP > Tools pokazuje pozycję "Trasy URL"
- [ ] Po kliknięciu: widoczna tabela z jedną kolumną "Projekty (Projects)" i przyciskiem "Edytuj"
- [ ] Po kliknięciu "Edytuj": tabela z 12 językami (PL, EN, SV, NO, NL, LV, IT, FR, ES, DE, DA, CS), każdy z polem tekstowym z aktualną trasą
- [ ] PL ma wstępnie wypełnione `/realizacje/{slug}`, pozostałe `/project/{slug}`
- [ ] Po kliknięciu "Zapisz trasy": przekierowanie z komunikatem "Trasy URL zapisane. Stache odświeżony."
- [ ] Po zapisie `content/collections/projects.yaml` zawiera `route:` jako mapę (nie pojedynczy string)
- [ ] URL `/realizacje/central-steel-yard` zwraca 200 (PL)
- [ ] URL `/project/central-steel-yard` (EN) nadal działa

## Testowanie

Codex powinien:

1. Uruchomić lokalny serwer (`php artisan serve --port=8001`)
2. Wejść do CP > Tools — sprawdzić czy "Trasy URL" widoczne
3. Kliknąć "Trasy URL" → "Edytuj" przy Projektach — sprawdzić czy 12 języków wyświetla się poprawnie z wypełnionymi polami
4. Wpisać `/realizacje/{slug}` dla PL (jeśli już nie ma) i kliknąć "Zapisz trasy"
5. Sprawdzić zawartość `content/collections/projects.yaml` — `route` powinno być mapą
6. Zweryfikować przez Playwright MCP (`http://127.0.0.1:8001`): wejść na `/realizacje/central-steel-yard` — powinno zwrócić 200

## Synchronizacja dokumentacji

Po zakończeniu Codex aktualizuje:
- `BRIEF_CODEX.md` — zamknąć task: `active_task_id: none`, `last_closed: FEATURE-collection-routes-panel`
- `PROJECT_STATUS_CODEX.md` — przenieść do sekcji Wykonane: `FEATURE-collection-routes-panel`
- `CLAUDE_MEMORY.md` — zaktualizować state_version i etapy
- Zsynchronizować `state_version` we wszystkich trzech plikach
