<?php

declare(strict_types=1);

namespace App\Console\Commands;

use DeepL\Translator;
use DeepL\TranslateTextOptions;
use Illuminate\Console\Command;
use Symfony\Component\Yaml\Yaml;

class TranslateGlobalSet extends Command
{
    protected $signature = 'globals:translate
                            {global : Handle of the global set (e.g. touch_with_us)}
                            {--source=pl : Source locale handle}
                            {--locales= : Comma-separated target locales (default: all missing)}
                            {--dry-run : Show what would be translated without writing files}';

    protected $description = 'Translate a Statamic global set to all configured locales using DeepL';

    // Fields to translate per global (handle => list of dot-paths supporting wildcards)
    private const TRANSLATABLE_FIELDS = [
        'touch_with_us' => [
            'sub_title',
            'heading',
            'subheading',
            'content_title',
            'offices.*.country',
            'offices.*.address',
        ],
        'mega_menu' => [
            'copyright_text',
            'projects_button_text',
            'services_button_text',
        ],
    ];

    public function handle(): int
    {
        $globalHandle = $this->argument('global');
        $sourceLocale = $this->option('source');
        $dryRun = $this->option('dry-run');

        $apiKey = config('app.deepl_api_key') ?: env('DEEPL_API_KEY');
        if (! $apiKey) {
            $this->error('DEEPL_API_KEY is not set in .env');
            return self::FAILURE;
        }

        $sitesPath = base_path('resources/sites.yaml');
        $sites = Yaml::parseFile($sitesPath);
        $allLocales = array_keys($sites);

        $targetLocales = $this->option('locales')
            ? explode(',', $this->option('locales'))
            : $this->resolveMissingLocales($globalHandle, $allLocales, $sourceLocale);

        if (empty($targetLocales)) {
            $this->info('All locales already have files. Nothing to do.');
            return self::SUCCESS;
        }

        $sourceFile = base_path("content/globals/{$sourceLocale}/{$globalHandle}.yaml");
        if (! file_exists($sourceFile)) {
            $this->error("Source file not found: {$sourceFile}");
            return self::FAILURE;
        }

        $sourceData = Yaml::parseFile($sourceFile);
        $translatablePaths = self::TRANSLATABLE_FIELDS[$globalHandle] ?? [];

        if (empty($translatablePaths)) {
            $this->warn("No translatable field definitions for '{$globalHandle}'. Copying source as-is.");
        }

        $translator = new Translator($apiKey);
        $sourceDeepL = strtoupper(explode('_', $sourceLocale)[0]);

        $this->info("Source: <fg=cyan>{$sourceLocale}</> → Targets: <fg=cyan>" . implode(', ', $targetLocales) . "</>");

        foreach ($targetLocales as $targetLocale) {
            $this->line('');
            $this->info("Translating to <fg=yellow>{$targetLocale}</> ...");

            $siteLocale = $sites[$targetLocale]['locale'] ?? $targetLocale;
            $targetDeepL = $this->mapToDeepLTarget($siteLocale);

            // Collect all text values to translate
            $texts = [];
            $paths = [];
            foreach ($translatablePaths as $pattern) {
                foreach ($this->resolvePaths($sourceData, $pattern) as $path => $value) {
                    if ($value !== null && $value !== '') {
                        $texts[] = (string) $value;
                        $paths[] = $path;
                    }
                }
            }

            if (empty($texts)) {
                $this->warn("  No translatable content found.");
                continue;
            }

            $translatedData = $sourceData;

            if (! $dryRun) {
                try {
                    $results = $translator->translateText(
                        $texts,
                        $sourceDeepL,
                        $targetDeepL,
                        [TranslateTextOptions::TAG_HANDLING => 'html']
                    );

                    foreach ($paths as $i => $path) {
                        $translated = is_array($results) ? $results[$i]->text : $results->text;
                        $translatedData = $this->setNestedValue($translatedData, $path, $translated);
                        $this->line("  <fg=green>✓</> {$path}: <fg=gray>{$texts[$i]}</> → {$translated}");
                    }
                } catch (\Throwable $e) {
                    $this->error("  DeepL error: " . $e->getMessage());
                    continue;
                }
            } else {
                foreach ($paths as $i => $path) {
                    $this->line("  [dry-run] {$path}: {$texts[$i]}");
                }
            }

            if (! $dryRun) {
                $dir = base_path("content/globals/{$targetLocale}");
                if (! is_dir($dir)) {
                    mkdir($dir, 0755, true);
                }

                $outFile = "{$dir}/{$globalHandle}.yaml";
                file_put_contents($outFile, Yaml::dump($translatedData, 6, 2, Yaml::DUMP_MULTI_LINE_LITERAL_BLOCK));
                $this->info("  Saved: content/globals/{$targetLocale}/{$globalHandle}.yaml");
            }
        }

        $this->line('');
        $this->info($dryRun ? 'Dry-run complete.' : 'Done.');

        return self::SUCCESS;
    }

    private function resolveMissingLocales(string $globalHandle, array $allLocales, string $sourceLocale): array
    {
        $missing = [];
        foreach ($allLocales as $locale) {
            if ($locale === $sourceLocale) {
                continue;
            }
            $file = base_path("content/globals/{$locale}/{$globalHandle}.yaml");
            if (! file_exists($file)) {
                $missing[] = $locale;
            }
        }
        return $missing;
    }

    /**
     * Resolve a dot-path pattern (supports wildcard *) against $data.
     * Returns [ 'resolved.path' => value ] pairs.
     */
    private function resolvePaths(array $data, string $pattern): array
    {
        $parts = explode('.', $pattern);
        return $this->resolvePathParts($data, $parts, '');
    }

    private function resolvePathParts(mixed $data, array $parts, string $prefix): array
    {
        if (empty($parts)) {
            return [$prefix => $data];
        }

        $key = array_shift($parts);

        if ($key === '*') {
            if (! is_array($data)) {
                return [];
            }
            $results = [];
            foreach ($data as $i => $item) {
                $subPrefix = $prefix !== '' ? "{$prefix}.{$i}" : (string) $i;
                foreach ($this->resolvePathParts($item, $parts, $subPrefix) as $path => $value) {
                    $results[$path] = $value;
                }
            }
            return $results;
        }

        if (! is_array($data) || ! array_key_exists($key, $data)) {
            return [];
        }

        $subPrefix = $prefix !== '' ? "{$prefix}.{$key}" : $key;
        return $this->resolvePathParts($data[$key], $parts, $subPrefix);
    }

    /**
     * Set a value at a dot-path in a nested array.
     */
    private function setNestedValue(array $data, string $path, mixed $value): array
    {
        $parts = explode('.', $path);
        $ref = &$data;
        foreach ($parts as $part) {
            if (! isset($ref[$part]) && ! array_key_exists($part, $ref)) {
                $ref[$part] = [];
            }
            $ref = &$ref[$part];
        }
        $ref = $value;
        return $data;
    }

    private function mapToDeepLTarget(string $locale): string
    {
        $normalized = strtolower(str_replace('_', '-', $locale));
        return match ($normalized) {
            'en', 'en-us' => 'EN-US',
            'en-gb'       => 'EN-GB',
            'pt', 'pt-pt' => 'PT-PT',
            'pt-br'       => 'PT-BR',
            'zh', 'zh-cn', 'zh-hans' => 'ZH-HANS',
            'zh-tw', 'zh-hant'       => 'ZH-HANT',
            default => strtoupper(explode('-', $normalized)[0]),
        };
    }
}
