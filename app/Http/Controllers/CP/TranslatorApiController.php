<?php

namespace App\Http\Controllers\CP;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\View\View;

class TranslatorApiController extends Controller
{
    public function index(): View
    {
        return view('cp.translator_api.index', [
            'apiKey' => env('DEEPL_API_KEY', ''),
            'service' => env('MAGIC_TRANSLATOR_SERVICE', 'prism'),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'deepl_api_key' => ['present', 'string', 'max:100'],
        ]);

        $this->setEnvValue('DEEPL_API_KEY', trim($validated['deepl_api_key']));

        Artisan::call('config:clear');

        return redirect()
            ->route('statamic.cp.translator-api.index')
            ->with('success', 'Klucz API zapisany.');
    }

    private function setEnvValue(string $key, string $value): void
    {
        $path = base_path('.env');
        $content = file_get_contents($path);
        $pattern = '/^'.preg_quote($key, '/').'=.*$/m';

        if (preg_match($pattern, $content)) {
            $content = preg_replace_callback($pattern, fn () => "{$key}={$value}", $content);
        } else {
            $content .= rtrim($content) === $content ? PHP_EOL : '';
            $content .= "{$key}={$value}".PHP_EOL;
        }

        file_put_contents($path, $content);
    }
}
