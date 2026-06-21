<?php

namespace Skalisty\InternalLinks\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class InstallCommand extends Command
{
    protected $signature = 'internal-links:install';

    protected $description = 'Install the Blog Internal Linking addon (collection + blueprint)';

    public function handle(): int
    {
        $this->publishCollection();
        $this->publishBlueprint();
        $this->call('statamic:stache:refresh');

        $this->components->info('Blog Internal Linking installed successfully.');
        $this->line('');
        $this->line('  Add the modifier to your Bard blog templates:');
        $this->line('  <fg=green>{{ text | apply_internal_links }}</>');

        return self::SUCCESS;
    }

    private function publishCollection(): void
    {
        $target = base_path('content/collections/internal_links.yaml');

        if (File::exists($target)) {
            $this->components->warn('Collection already exists, skipping: content/collections/internal_links.yaml');

            return;
        }

        File::ensureDirectoryExists(dirname($target));
        File::copy(__DIR__.'/../../resources/collections/internal_links.yaml', $target);

        $this->components->info('Created: content/collections/internal_links.yaml');
    }

    private function publishBlueprint(): void
    {
        $target = resource_path('blueprints/collections/internal_links/internal_link.yaml');

        if (File::exists($target)) {
            $this->components->warn('Blueprint already exists, skipping: resources/blueprints/collections/internal_links/internal_link.yaml');

            return;
        }

        File::ensureDirectoryExists(dirname($target));
        File::copy(
            __DIR__.'/../../resources/blueprints/collections/internal_links/internal_link.yaml',
            $target
        );

        $this->components->info('Created: resources/blueprints/collections/internal_links/internal_link.yaml');
    }
}
