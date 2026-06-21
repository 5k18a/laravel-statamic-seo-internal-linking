<?php

use App\Http\Controllers\CP\SeoErrorsController;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

// SEO Errors auto-prune: daily at 03:00 if auto_prune_days > 0 in settings JSON.
// Reads dynamic setting written by CP UI (storage/app/seo-errors-settings.json).
Schedule::call(function () {
    $settings = SeoErrorsController::loadSettingsStatic();
    $days = (int) ($settings['auto_prune_days'] ?? 0);

    if ($days <= 0) {
        return;
    }

    $before = \Statamic\SeoPro\Facades\Error::query()->get()->count();
    Artisan::call('seo:errors:prune', [
        '--older-than' => $days.'d',
        '--confirm' => true,
    ]);
    $after = \Statamic\SeoPro\Facades\Error::query()->get()->count();
    SeoErrorsController::recordPruneRun(max(0, $before - $after));
})
    ->daily()
    ->at('03:00')
    ->name('seo-errors-auto-prune')
    ->withoutOverlapping()
    ->onOneServer();
