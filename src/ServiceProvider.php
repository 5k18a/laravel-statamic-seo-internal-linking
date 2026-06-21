<?php

namespace Skalisty\InternalLinks;

use Skalisty\InternalLinks\Modifiers\ApplyInternalLinks;
use Statamic\Providers\AddonServiceProvider;

class ServiceProvider extends AddonServiceProvider
{
    protected $modifiers = [
        ApplyInternalLinks::class,
    ];

    public function bootAddon()
    {
        $this->publishes([
            __DIR__.'/../resources/blueprints' => resource_path('blueprints'),
        ], 'internal-links-blueprints');
    }
}
