<?php

namespace Skalisty\WysiwygHtmlFieldtype\Tests;

use Skalisty\WysiwygHtmlFieldtype\ServiceProvider;
use Statamic\Testing\AddonTestCase;

abstract class TestCase extends AddonTestCase
{
    protected string $addonServiceProvider = ServiceProvider::class;
}
