<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Statamic\Facades\Entry;
use Carbon\Carbon;
use Statamic\Facades\Form;
use Illuminate\Support\Facades\Validator;

class SearchController extends Controller
{
   public function search(Request $request)
   {   
        // Get query parameters from the request
        $query = $request->get('q', '');
        // 'blog', 'services', or 'services'

         // Search in 'blog' collection by title or slug, then remove duplicates by title
        $blog = Entry::query()
        ->where('collection', 'blogs')
        ->where(fn($q) => $q->where('title', 'like', "%$query%")
            ->orWhere('slug', 'like', "%$query%"))
        ->get()
        ->unique('title')
        ->values();

        // Search in 'services' collection by title or slug, then remove duplicates by title
        $services = Entry::query()
        ->where('collection', 'services')
        ->where(fn($q) => $q->where('title', 'like', "%$query%")
            ->orWhere('slug', 'like', "%$query%"))
        ->get()
        ->unique('title')
        ->values();

        // Search in 'projects' collection by title or slug, then remove duplicates by title
        $projects = Entry::query()
        ->where('collection', 'projects')
        ->where(fn($q) => $q->where('title', 'like', "%$query%")
            ->orWhere('slug', 'like', "%$query%"))
        ->get()
        ->unique('title')
        ->values();
        // Otherwise, return a partial view with all result types
        return view('partials.search-results', [
            'blog' => $blog,
            'services' => $services,
            'projects' => $projects,
            'query' => $query,
        ]);
    }
}
