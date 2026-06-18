<?php

declare(strict_types=1);

namespace App\Console\Commands;

use DeepL\Translator;
use DeepL\TranslateTextOptions;
use Illuminate\Console\Command;
use Symfony\Component\Yaml\Yaml;

class TranslateLangFiles extends Command
{
    protected $signature = 'lang:translate
                            {--source=en : Source locale handle}
                            {--locales= : Comma-separated target locales (default: all missing/empty)}
                            {--force : Re-translate even if file already has content}
                            {--dry-run : Show what would be translated without writing files}';

    protected $description = 'Translate lang/*.json UI strings to all configured locales using DeepL';

    public function handle(): int
    {
        $sourceLocale = $this->option('source');
        $dryRun       = $this->option('dry-run');
        $force        = $this->option('force');

        $apiKey = env('DEEPL_API_KEY');
        if (! $apiKey) {
            $this->error('DEEPL_API_KEY is not set in .env');
            return self::FAILURE;
        }

        $sourceFile = base_path("lang/{$sourceLocale}.json");
        if (! file_exists($sourceFile)) {
            $this->error("Source file not found: {$sourceFile}");
            return self::FAILURE;
        }

        $sourceStrings = json_decode(file_get_contents($sourceFile), true);
        if (empty($sourceStrings)) {
            $this->error("Source file is empty.");
            return self::FAILURE;
        }

        $sites = Yaml::parseFile(base_path('resources/sites.yaml'));

        $targetLocales = $this->option('locales')
            ? explode(',', $this->option('locales'))
            : $this->resolveTargetLocales($sites, $sourceLocale, $force);

        if (empty($targetLocales)) {
            $this->info('All lang files are up to date. Nothing to do.');
            return self::SUCCESS;
        }

        $this->info("Source: <fg=cyan>{$sourceLocale}</> ({$sourceFile})");
        $this->info("Translating " . count($sourceStrings) . " strings to: <fg=cyan>" . implode(', ', $targetLocales) . "</>");

        $translator = new Translator($apiKey);
        $sourceDeepL = strtoupper($sourceLocale);

        foreach ($targetLocales as $targetLocale) {
            $this->line('');
            $this->info("→ <fg=yellow>{$targetLocale}</>");

            $siteLocale  = $sites[$targetLocale]['locale'] ?? $targetLocale;
            $targetDeepL = $this->mapToDeepLTarget($siteLocale);

            $keys   = array_keys($sourceStrings);
            $values = array_values($sourceStrings);

            if ($dryRun) {
                foreach ($keys as $i => $key) {
                    $this->line("  [dry-run] {$key}: {$values[$i]}");
                }
                continue;
            }

            try {
                $results = $translator->translateText(
                    $values,
                    $sourceDeepL,
                    $targetDeepL,
                    [TranslateTextOptions::TAG_HANDLING => 'html']
                );
            } catch (\Throwable $e) {
                $this->error("  DeepL error: " . $e->getMessage());
                continue;
            }

            $translated = [];
            foreach ($keys as $i => $key) {
                $translatedValue = $results[$i]->text;
                $translated[$key] = $translatedValue;
                $this->line("  <fg=green>✓</> {$key}: <fg=gray>{$values[$i]}</> → {$translatedValue}");
            }

            if (! $dryRun) {
                $outFile = base_path("lang/{$targetLocale}.json");
                file_put_contents($outFile, json_encode($translated, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE) . "\n");
                $this->info("  Saved: lang/{$targetLocale}.json");
            }
        }

        $this->line('');
        $this->info($dryRun ? 'Dry-run complete.' : 'Done.');

        return self::SUCCESS;
    }

    private function resolveTargetLocales(array $sites, string $sourceLocale, bool $force): array
    {
        $targets = [];
        foreach (array_keys($sites) as $locale) {
            if ($locale === $sourceLocale) {
                continue;
            }
            $file    = base_path("lang/{$locale}.json");
            $isEmpty = ! file_exists($file) || trim(file_get_contents($file)) === '{}' || trim(file_get_contents($file)) === '';
            if ($force || $isEmpty) {
                $targets[] = $locale;
            }
        }
        return $targets;
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
