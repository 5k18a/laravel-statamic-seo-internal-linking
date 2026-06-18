<?php

namespace App\Http\Controllers\CP;

use Illuminate\Http\Request;
use Statamic\Facades\Entry;
use Statamic\Facades\Site;
use Statamic\Http\Controllers\CP\CpController;

use function Statamic\trans as __;

class SelectSiteController extends CpController
{
    public function select(Request $request, $handle)
    {
        if (! $site = Site::get($handle)) {
            return back()->withError('Invalid site.');
        }

        $this->authorize('view', $site);

        Site::setSelected($handle);

        $previous = url()->previous();

        if ($redirect = $this->localizedEntryUrl($previous, $handle)) {
            return redirect($redirect)->with('success', __('Site selected.'));
        }

        return back()->with('success', __('Site selected.'));
    }

    // When on an entry edit page, redirect to the same entry in the selected locale.
    private function localizedEntryUrl(string $previousUrl, string $siteHandle): ?string
    {
        // Match: .../cp/collections/{collection}/entries/{uuid}
        if (! preg_match('#/collections/[^/]+/entries/([a-f0-9-]+)$#i', $previousUrl, $m)) {
            return null;
        }

        $entry = Entry::find($m[1]);
        if (! $entry) {
            return null;
        }

        $localized = $entry->in($siteHandle);

        return $localized?->editUrl();
    }
}
