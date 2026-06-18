<?php

namespace App\Http\Controllers\CP;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Statamic\Facades\Site;

class UiTranslationsController extends Controller
{
    public function index(): View
    {
        $sites = Site::all()->except('pl')->map(fn ($site) => [
            'handle' => $site->handle(),
            'name' => $site->name(),
            'url' => cp_route('ui-translations.edit', $site->handle()),
            'count' => $this->translatedCount($site->handle()),
            'total' => count($this->plKeys()),
        ]);

        return view('cp.ui_translations.index', compact('sites'));
    }

    public function edit(string $locale): View
    {
        abort_unless($locale !== 'pl' && Site::get($locale), 404);

        $pl = $this->plKeys();
        $existing = $this->readJson($locale);
        $site = Site::get($locale);

        $rows = collect($pl)->map(fn ($plValue, $key) => [
            'key' => $key,
            'pl_value' => $plValue,
            'translation' => $existing[$key] ?? '',
        ])->values();

        return view('cp.ui_translations.edit', compact('rows', 'site', 'locale'));
    }

    public function update(Request $request, string $locale): RedirectResponse
    {
        abort_unless($locale !== 'pl' && Site::get($locale), 404);

        $translations = collect($request->input('translations', []))
            ->map(fn ($value) => is_string($value) ? trim($value) : $value)
            ->filter(fn ($value) => $value !== '' && $value !== null)
            ->all();

        file_put_contents(
            lang_path("{$locale}.json"),
            json_encode($translations, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
        );

        return redirect()
            ->route('statamic.cp.ui-translations.edit', $locale)
            ->with('success', 'Tłumaczenia zapisane.');
    }

    private function plKeys(): array
    {
        $path = lang_path('pl.json');

        if (! file_exists($path)) {
            return [];
        }

        return json_decode(file_get_contents($path), true) ?? [];
    }

    private function readJson(string $locale): array
    {
        $path = lang_path("{$locale}.json");

        if (! file_exists($path)) {
            return [];
        }

        return json_decode(file_get_contents($path), true) ?? [];
    }

    private function translatedCount(string $locale): int
    {
        return count(array_filter($this->readJson($locale), fn ($value) => $value !== ''));
    }
}
