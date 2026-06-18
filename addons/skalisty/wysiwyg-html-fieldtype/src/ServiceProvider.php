<?php

namespace Skalisty\WysiwygHtmlFieldtype;

use Statamic\Providers\AddonServiceProvider;

class ServiceProvider extends AddonServiceProvider
{
    protected $scripts = [
        __DIR__.'/../resources/dist/addon.js',
    ];

    public function bootAddon()
    {
        //
    }
}
