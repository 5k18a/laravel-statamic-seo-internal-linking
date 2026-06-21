<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Collection;
use Statamic\SeoPro\Facades\Error;
use Statamic\SeoPro\Redirects\Error as SeoError;

class SeoErrorsPrune extends Command
{
    protected $signature = 'seo:errors:prune
                            {--locale= : Filtr per locale/site handle, np. pl lub en}
                            {--older-than= : Wiek wpisu, np. 30d, 2m, 1y}
                            {--hits-lt= : Tylko wpisy z liczbą hits mniejszą niż X}
                            {--all : Usuń wszystkie wpisy, nadal wymaga prompta albo --confirm}
                            {--confirm : Potwierdź usunięcie bez interaktywnego prompta}
                            {--dry-run : Pokaż co byłoby usunięte, nic nie zapisuj}';

    protected $description = 'Bulk delete SEO Pro 404 error entries with optional filters.';

    public function handle(): int
    {
        if (! $this->hasAnyFilter()) {
            $this->error('Musisz podać co najmniej jeden filtr lub --all.');

            return self::FAILURE;
        }

        $errors = Error::all();
        $original = $errors->count();
        $olderThan = $this->option('older-than');
        $olderThanThreshold = $olderThan ? $this->parseOlderThan((string) $olderThan) : null;

        if ($olderThan && ! $olderThanThreshold) {
            $this->error('Niewłaściwy format --older-than (oczekiwane: 30d, 2m, 1y).');

            return self::FAILURE;
        }

        $filtered = $this->applyFilters($errors, $olderThanThreshold);
        $count = $filtered->count();

        if ($count === 0) {
            $this->info("Brak wpisów spełniających filtry (z {$original} łącznie).");

            return self::SUCCESS;
        }

        $this->info("Wpisów do usunięcia: <fg=yellow>{$count}</> (z {$original} łącznie).");

        if ($this->option('dry-run')) {
            $this->line('--dry-run: poniżej lista wpisów, nic nie usunięto.');

            $filtered->each(function (SeoError $error): void {
                $this->line(sprintf(
                    '  %s::%s → %s (hits=%s, last=%s)',
                    $error->site(),
                    $error->id(),
                    $error->url(),
                    $error->hits(),
                    $error->lastHitAt()
                ));
            });

            return self::SUCCESS;
        }

        if (! $this->option('confirm') && ! $this->confirm("Czy na pewno usunąć {$count} wpisów?")) {
            $this->info('Anulowane.');

            return self::SUCCESS;
        }

        $deleted = 0;

        $filtered->each(function (SeoError $error) use (&$deleted): void {
            $error->delete();
            $deleted++;
        });

        $this->info("Usunięto: <fg=green>{$deleted}</>.");

        return self::SUCCESS;
    }

    private function hasAnyFilter(): bool
    {
        return (bool) (
            $this->option('all')
            || $this->option('locale')
            || $this->option('older-than')
            || $this->option('hits-lt')
        );
    }

    private function applyFilters(Collection $errors, ?Carbon $olderThanThreshold): Collection
    {
        if ($locale = $this->option('locale')) {
            $errors = $errors->filter(fn (SeoError $error) => $error->site() === $locale);
        }

        if ($olderThanThreshold) {
            $errors = $errors->filter(function (SeoError $error) use ($olderThanThreshold): bool {
                $lastHitAt = $error->lastHitAt();

                return $lastHitAt && Carbon::parse($lastHitAt)->lt($olderThanThreshold);
            });
        }

        if ($hitsLt = $this->option('hits-lt')) {
            $errors = $errors->filter(fn (SeoError $error) => (int) $error->hits() < (int) $hitsLt);
        }

        return $errors->values();
    }

    private function parseOlderThan(string $value): ?Carbon
    {
        if (! preg_match('/^(\d+)([dmy])$/', $value, $matches)) {
            return null;
        }

        $amount = (int) $matches[1];

        return match ($matches[2]) {
            'd' => Carbon::now()->subDays($amount),
            'm' => Carbon::now()->subMonths($amount),
            'y' => Carbon::now()->subYears($amount),
        };
    }
}
