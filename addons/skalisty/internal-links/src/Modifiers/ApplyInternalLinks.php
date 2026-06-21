<?php

namespace Skalisty\InternalLinks\Modifiers;

use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Support\Collection;
use Illuminate\Support\HtmlString;
use Skalisty\InternalLinks\Support\LinkableContentParser;
use Statamic\Contracts\Entries\Entry as EntryContract;
use Statamic\Facades\Entry;
use Statamic\Facades\Site;
use Statamic\Modifiers\Modifier;

class ApplyInternalLinks extends Modifier
{
    private static array $usedTargetUrls = [];

    public function index($value, $params, $context)
    {
        $content = $this->stringValue($value);

        if ($content === null || trim($content) === '') {
            return $value;
        }

        if (! $this->isAllowedCollection($context)) {
            return $value;
        }

        $currentSite = $this->currentSite($context);

        $links = Entry::query()
            ->where('collection', 'internal_links')
            ->where('site', 'pl')
            ->where('enabled', true)
            ->orderBy('weight', 'desc')
            ->get();

        if ($links->isEmpty()) {
            return $value;
        }

        $parser = new LinkableContentParser($content);

        foreach ($links as $link) {
            $targetEntry = $this->targetEntry($link, $currentSite);
            $targetUrl = $targetEntry?->url();

            if (! is_string($targetUrl) || $targetUrl === '' || isset(self::$usedTargetUrls[$targetUrl])) {
                continue;
            }

            foreach ($link->get('keywords', []) as $keywordItem) {
                if (! is_array($keywordItem)) {
                    continue;
                }

                $keyword = $keywordItem['keyword'] ?? null;
                $locale = $keywordItem['locale'] ?? null;

                if (! is_string($keyword) || trim($keyword) === '') {
                    continue;
                }

                // Skip if this keyword is for a different locale.
                if ($locale !== null && $locale !== '' && $locale !== $currentSite) {
                    continue;
                }

                $contentBefore = $parser->getContent();

                $parser->replaceKeyword($keyword, $targetUrl, [
                    'max' => 1,
                    'nofollow' => (bool) $link->get('nofollow', false),
                    'target_blank' => (bool) $link->get('open_in_new_window', false),
                ]);

                if ($parser->getContent() !== $contentBefore) {
                    self::$usedTargetUrls[$targetUrl] = true;
                    break;
                }
            }
        }

        $linkedContent = $parser->getContent();

        return $value instanceof Htmlable ? new HtmlString($linkedContent) : $linkedContent;
    }

    private function stringValue($value): ?string
    {
        if (is_string($value)) {
            return $value;
        }

        if ($value instanceof Htmlable) {
            return $value->toHtml();
        }

        if ($value instanceof \Stringable) {
            return (string) $value;
        }

        return null;
    }

    private function isAllowedCollection($context): bool
    {
        $currentCollection = $context['collection'] ?? null;

        if ($currentCollection === null) {
            return true;
        }

        if (is_object($currentCollection) && method_exists($currentCollection, 'value')) {
            $currentCollection = $currentCollection->value();
        }

        if (is_object($currentCollection) && method_exists($currentCollection, 'handle')) {
            $currentCollection = $currentCollection->handle();
        }

        $currentCollection = (string) $currentCollection;

        // Load allowed collections from all active internal_links entries.
        $allowed = Entry::query()
            ->where('collection', 'internal_links')
            ->where('site', 'pl')
            ->where('enabled', true)
            ->get()
            ->flatMap(fn ($link) => (array) $link->get('blog_collection', []))
            ->filter()
            ->unique()
            ->values();

        // If no entry has a blog_collection configured, skip the guard.
        if ($allowed->isEmpty()) {
            return true;
        }

        return $allowed->contains($currentCollection);
    }

    private function currentSite($context): string
    {
        $site = $context['site'] ?? Site::current();

        if (is_object($site) && method_exists($site, 'handle')) {
            return $site->handle();
        }

        return (string) $site;
    }

    private function targetEntry($link, string $site): ?EntryContract
    {
        $target = $link->augmentedValue('target_entry')->value();

        if ($target instanceof Collection) {
            $target = $target->first();
        } elseif (is_array($target)) {
            $target = collect($target)->first();
        }

        if (is_string($target)) {
            $target = Entry::find($target);
        }

        if (! $target instanceof EntryContract) {
            return null;
        }

        return $target->in($site) ?: $target;
    }
}
