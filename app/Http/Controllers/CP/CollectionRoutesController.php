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
                'handle' => $handle,
                'label' => $label,
                'route_raw' => $route,
                'is_localized' => is_array($route),
                'url' => cp_route('collection-routes.edit', $handle),
            ];
        });

        return view('cp.collection_routes.index', compact('collections'));
    }

    public function edit(string $collection): View
    {
        abort_unless(isset($this->managedCollections[$collection]), 404);

        $yaml = $this->readYaml($collection);
        $sites = Site::all();
        $rawRoute = $yaml['route'] ?? '';
        $routes = [];

        foreach ($sites as $handle => $site) {
            $routes[$handle] = is_array($rawRoute)
                ? ($rawRoute[$handle] ?? '')
                : (string) $rawRoute;
        }

        return view('cp.collection_routes.edit', [
            'collection' => $collection,
            'label' => $this->managedCollections[$collection],
            'sites' => $sites,
            'routes' => $routes,
        ]);
    }

    public function update(Request $request, string $collection): RedirectResponse
    {
        abort_unless(isset($this->managedCollections[$collection]), 404);

        $yaml = $this->readYaml($collection);
        $routes = array_map('trim', $request->input('routes', []));
        $routes = array_filter($routes, fn ($value) => $value !== '');

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
