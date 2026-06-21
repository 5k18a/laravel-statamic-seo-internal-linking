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
    /**
     * Usage: {{ content | apply_internal_links }}
     */
    public function index($value, $params, $context)
    {
        $content = $this->stringValue($value);

        if ($content === null || trim($content) === '') {
            return $value;
        }

        $currentSite = $this->currentSite($context);

        $links = Entry::query()
            ->where('collection', 'internal_links')
            ->where('site', $currentSite)
            ->where('enabled', true)
            ->orderBy('weight', 'desc')
            ->get();

        if ($links->isEmpty()) {
            return $value;
        }

        $parser = new LinkableContentParser($content);

        foreach ($links as $link) {
            $targetEntry = $this->targetEntry($link, $currentSite);

            if (! $targetEntry || ! $targetEntry->url()) {
                continue;
            }

            foreach ($link->get('keywords', []) as $keywordItem) {
                $keyword = is_array($keywordItem) ? ($keywordItem['keyword'] ?? null) : null;

                if (! is_string($keyword) || trim($keyword) === '') {
                    continue;
                }

                $parser->replaceKeyword($keyword, $targetEntry->url(), [
                    'max' => (int) $link->get('max_per_page', 1),
                    'nofollow' => (bool) $link->get('nofollow', false),
                    'target_blank' => (bool) $link->get('open_in_new_window', false),
                ]);
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
