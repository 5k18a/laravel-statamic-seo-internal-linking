<?php

namespace App\Http\Controllers\CP;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Illuminate\View\View;
use Statamic\Facades\Site;
use Statamic\Facades\User;
use Statamic\SeoPro\Facades\Error;
use Statamic\SeoPro\Redirects\Error as SeoError;

class SeoErrorsController extends Controller
{
    private const PER_PAGE_OPTIONS = [10, 20, 50, 100, 500];
    private const AUTO_PRUNE_DAYS_OPTIONS = [0, 3, 7, 15, 20, 30];
    private const SETTINGS_FILE = 'seo-errors-settings.json';

    public function index(Request $request): View
    {
        $this->authorizeAccess();
        $settings = $this->loadSettings();

        $sites = Site::authorized();
        $siteHandles = $sites->map->handle()->values()->all();
        $currentLocale = $request->string('locale')->toString();
        $currentSort = $this->validSort($request->string('sort')->toString());
        $currentOrder = $this->validOrder($request->string('order')->toString());
        $currentSearch = trim($request->string('search')->toString());
        $perPage = $this->validPerPage($request->integer('per_page', 20));
        $page = max(1, $request->integer('page', 1));

        $query = Error::query()->whereIn('site', $siteHandles);

        if ($currentLocale !== '') {
            abort_unless(in_array($currentLocale, $siteHandles, true), 404);

            $query->where('site', $currentLocale);
        }

        $all = $query->get();

        // Total without search filter (for "X / Y" indicator)
        $totalUnfiltered = $all->count();

        // Server-side search filter (case-insensitive substring match on URL)
        if ($currentSearch !== '') {
            $needle = mb_strtolower($currentSearch);
            $all = $all->filter(fn (SeoError $e) => str_contains(mb_strtolower((string) $e->url()), $needle));
        }

        $sorted = $this->sortErrors($all, $currentSort, $currentOrder);
        $totalFiltered = $sorted->count();

        // Paginate
        $paged = $sorted->forPage($page, $perPage)->values();
        $items = $paged->map(fn (SeoError $error) => $this->formatError($error))->values();

        $paginator = new LengthAwarePaginator(
            $items,
            $totalFiltered,
            $perPage,
            $page,
            [
                'path' => $request->url(),
                'query' => $request->query(),
            ]
        );

        return view('cp.seo_errors.index', [
            'errors' => $items,
            'paginator' => $paginator,
            'totalFiltered' => $totalFiltered,
            'totalUnfiltered' => $totalUnfiltered,
            'sites' => $sites,
            'currentLocale' => $currentLocale,
            'currentSort' => $currentSort,
            'currentOrder' => $currentOrder,
            'currentSearch' => $currentSearch,
            'currentPerPage' => $perPage,
            'perPageOptions' => self::PER_PAGE_OPTIONS,
            'settings' => $settings,
            'autoPruneDaysOptions' => self::AUTO_PRUNE_DAYS_OPTIONS,
        ]);
    }

    public function updateSettings(Request $request): JsonResponse
    {
        $this->authorizeAccess();

        $days = $request->integer('auto_prune_days');

        if (! in_array($days, self::AUTO_PRUNE_DAYS_OPTIONS, true)) {
            return response()->json([
                'ok' => false,
                'message' => 'Niewłaściwa wartość auto_prune_days.',
            ], 422);
        }

        $settings = $this->loadSettings();
        $settings['auto_prune_days'] = $days;
        $this->saveSettings($settings);

        return response()->json(['ok' => true, 'auto_prune_days' => $days]);
    }

    public function destroy(string $key): JsonResponse
    {
        $this->authorizeAccess();

        $error = $this->findByKey($key);

        if (! $error) {
            return response()->json([
                'ok' => false,
                'message' => 'Błąd 404 nie został znaleziony.',
            ], 404);
        }

        $error->delete();

        return response()->json(['ok' => true]);
    }

    public function bulkDelete(Request $request): JsonResponse
    {
        $this->authorizeAccess();

        $ids = $request->input('ids', []);

        if (! is_array($ids) || $ids === []) {
            return response()->json([
                'ok' => false,
                'message' => 'Nie wybrano żadnych błędów do usunięcia.',
            ], 422);
        }

        $deleted = 0;

        foreach ($ids as $key) {
            if (! is_string($key)) {
                continue;
            }

            $error = $this->findByKey($key);

            if (! $error) {
                continue;
            }

            $error->delete();
            $deleted++;
        }

        return response()->json([
            'ok' => true,
            'deleted' => $deleted,
        ]);
    }

    public function deleteAll(Request $request): JsonResponse
    {
        $this->authorizeAccess();

        // Confirmation token from JS (must match expected value)
        if ($request->input('confirm') !== 'USUN') {
            return response()->json([
                'ok' => false,
                'message' => 'Brak prawidłowego potwierdzenia.',
            ], 422);
        }

        $sites = Site::authorized();
        $siteHandles = $sites->map->handle()->values()->all();
        $locale = trim((string) $request->input('locale', ''));
        $search = trim((string) $request->input('search', ''));

        $query = Error::query()->whereIn('site', $siteHandles);

        if ($locale !== '') {
            if (! in_array($locale, $siteHandles, true)) {
                return response()->json(['ok' => false, 'message' => 'Niewłaściwy locale.'], 422);
            }
            $query->where('site', $locale);
        }

        $errors = $query->get();

        if ($search !== '') {
            $needle = mb_strtolower($search);
            $errors = $errors->filter(fn (SeoError $e) => str_contains(mb_strtolower((string) $e->url()), $needle));
        }

        $deleted = 0;
        foreach ($errors as $error) {
            $error->delete();
            $deleted++;
        }

        return response()->json([
            'ok' => true,
            'deleted' => $deleted,
        ]);
    }

    private function authorizeAccess(): void
    {
        $user = User::current();

        if (! $user) {
            abort(401);
        }

        if ($user->isSuper() || $user->hasPermission('view seo redirects')) {
            return;
        }

        abort(403);
    }

    private function validSort(string $sort): string
    {
        return in_array($sort, ['last_hit_at', 'hits', 'url'], true) ? $sort : 'last_hit_at';
    }

    private function validOrder(string $order): string
    {
        return $order === 'asc' ? 'asc' : 'desc';
    }

    private function validPerPage(int $perPage): int
    {
        return in_array($perPage, self::PER_PAGE_OPTIONS, true) ? $perPage : 20;
    }

    private function sortErrors(Collection $errors, string $sort, string $order): Collection
    {
        $sorted = $errors->sortBy(function (SeoError $error) use ($sort) {
            return match ($sort) {
                'hits' => (int) $error->hits(),
                'url' => mb_strtolower((string) $error->url()),
                default => (string) $error->lastHitAt(),
            };
        }, SORT_REGULAR, $order === 'desc');

        return $sorted->values();
    }

    private function formatError(SeoError $error): array
    {
        $key = $this->makeKey($error);

        return [
            'key' => $key,
            'id' => $error->id(),
            'locale' => $error->site(),
            'url' => $error->url(),
            'hits' => (int) $error->hits(),
            'last_hit_at' => $error->lastHitAt(),
            'delete_url' => cp_route('seo-errors-manager.destroy', ['key' => $key]),
            'create_redirect_url' => cp_route('seo-pro.redirects.create', [
                'source' => $error->url(),
            ]),
        ];
    }

    private function makeKey(SeoError $error): string
    {
        return $error->site().'::'.$error->id();
    }

    private function findByKey(string $key): ?SeoError
    {
        $key = rawurldecode($key);

        if (! str_contains($key, '::')) {
            return Error::find($key);
        }

        [$site, $id] = explode('::', $key, 2);

        return Error::query()
            ->where('site', $site)
            ->where('id', $id)
            ->first();
    }

    public static function settingsPath(): string
    {
        return storage_path('app/'.self::SETTINGS_FILE);
    }

    public static function loadSettingsStatic(): array
    {
        $path = self::settingsPath();
        $defaults = ['auto_prune_days' => 0, 'last_pruned_at' => null, 'last_prune_count' => 0];

        if (! file_exists($path)) {
            return $defaults;
        }

        $raw = @file_get_contents($path);
        $data = json_decode($raw ?: '{}', true);

        return array_merge($defaults, is_array($data) ? $data : []);
    }

    private function loadSettings(): array
    {
        return self::loadSettingsStatic();
    }

    private function saveSettings(array $settings): void
    {
        $path = self::settingsPath();
        $dir = dirname($path);

        if (! is_dir($dir)) {
            @mkdir($dir, 0775, true);
        }

        file_put_contents($path, json_encode($settings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }

    public static function recordPruneRun(int $count): void
    {
        $settings = self::loadSettingsStatic();
        $settings['last_pruned_at'] = now()->toIso8601String();
        $settings['last_prune_count'] = $count;
        $path = self::settingsPath();
        @mkdir(dirname($path), 0775, true);
        file_put_contents($path, json_encode($settings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }
}
