<?php

namespace App\Http\Controllers\CP\Collections;

use Statamic\Facades\Site;

class EntriesController extends \Statamic\Http\Controllers\CP\Collections\EntriesController
{
    protected function indexQuery($collection)
    {
        $query = $collection->queryEntries();

        if ($search = request('search')) {
            if ($collection->hasSearchIndex()) {
                return $collection
                    ->searchIndex()
                    ->ensureExists()
                    ->search($search)
                    ->where('collection', $collection->handle());
            }

            $query->where('title', 'like', '%'.$search.'%');
        }

        if (Site::multiEnabled()) {
            $query
                ->where('site', Site::selected()->handle())
                ->whereNotNull('data->title');
        }

        return $query;
    }
}
