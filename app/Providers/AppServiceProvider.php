<?php

namespace App\Providers;

use App\Http\Controllers\CP\Collections\EntriesController;
use App\Http\Controllers\CP\SelectSiteController;
use Illuminate\Queue\Events\JobQueued;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Statamic\Facades\Collection as StatamicCollection;
use Statamic\Facades\CP\Nav;
use Statamic\Statamic;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->bind(
            \Statamic\Http\Controllers\CP\Collections\EntriesController::class,
            EntriesController::class,
        );

        // Replace Statamic's SelectSiteController with ours so the site switcher
        // redirects to the correct localized entry URL instead of just going back().
        $this->app->bind(
            \Statamic\Http\Controllers\CP\SelectSiteController::class,
            SelectSiteController::class,
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        StatamicCollection::computed('projects', 'completion_year_sort', function ($entry) {
            return (int) ($entry->value('completion_year') ?: 0);
        });

        Statamic::pushCpRoutes(function () {
            Route::group([], base_path('routes/cp.php'));
        });

        Event::listen(JobQueued::class, function (JobQueued $event): void {
            if (($event->queue ?? null) !== 'translations') {
                return;
            }

            if (! function_exists('exec')) {
                return;
            }

            exec('pgrep -f "[q]ueue:work.*translations"', $pids);

            if (! empty($pids)) {
                return;
            }

            $command = sprintf(
                '%s %s queue:work --queue=translations --stop-when-empty > /dev/null 2>&1 &',
                escapeshellarg(PHP_BINARY),
                escapeshellarg(base_path('artisan')),
            );

            exec($command);
        });

        Nav::extend(function ($nav) {
            $nav->create('Trasy URL kolekcji')
                ->section('Tools')
                ->url(cp_route('collection-routes.index'))
                ->icon('link');

            $nav->create('Tłumaczenia UI')
                ->section('Tools')
                ->url(cp_route('ui-translations.index'))
                ->icon('translate');

            $nav->create('Translator API')
                ->section('Tools')
                ->url(cp_route('translator-api.index'))
                ->icon('key');
        });
    }
}
