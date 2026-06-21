<?php

namespace Skalisty\InternalLinks;

use Skalisty\InternalLinks\Console\InstallCommand;
use Skalisty\InternalLinks\Modifiers\ApplyInternalLinks;
use Statamic\Providers\AddonServiceProvider;

class ServiceProvider extends AddonServiceProvider
{
    protected $modifiers = [
        ApplyInternalLinks::class,
    ];

    protected $commands = [
        InstallCommand::class,
    ];

    public function bootAddon()
    {
        $this->mergeConfigFrom(__DIR__.'/../config/internal-links.php', 'internal-links');

        $this->publishes([
            __DIR__.'/../config/internal-links.php' => config_path('internal-links.php'),
        ], 'internal-links-config');

        $this->publishes([
            __DIR__.'/../resources/blueprints' => resource_path('blueprints'),
        ], 'internal-links-blueprints');

        $this->publishes([
            __DIR__.'/../resources/collections/internal_links.yaml' => base_path('content/collections/internal_links.yaml'),
        ], 'internal-links-collection');
    }
}
