<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\ContactController;
use Statamic\Facades\Site;
use Illuminate\Support\Facades\Session;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| Newsletter Route
|--------------------------------------------------------------------------
| Handles newsletter subscription requests.
*/

Route::get('/newsLetter', [NewsletterController::class, 'newsLetter'])->name('newsLetter');

/*
|--------------------------------------------------------------------------
| Header Search Route
|--------------------------------------------------------------------------
| Handles search functionality from the site header.
*/

Route::get('/search', [SearchController::class, 'search'])->name('header.search');

Route::post('/contact-submit', [ContactController::class, 'submit'])->name('contact.add');

/*
|--------------------------------------------------------------------------
| Dynamic Blog Category Routes per Site
|--------------------------------------------------------------------------
| Iterates through all Statamic sites and creates category routes
| for each site using Statamic's Route::statamic method.
*/

Site::all()->each(function (Statamic\Sites\Site $site) {
	Route::prefix($site->url())->group(function () {
		Route::statamic('/blog/category/{category_slug}', 'category');
	});
	Route::prefix($site->url())->group(function () {
		Route::statamic('/author/{team_slug}', 'author');
	});
});

/*
|--------------------------------------------------------------------------
| Set Job Session Route
|--------------------------------------------------------------------------
| Stores the job_id in the session via AJAX POST request.
*/

Route::post('/set-job-session', function (Request $request) {
	
    Session::put('job_id', $request->input('job_id'));
    return response()->json(['success' => true]);
});
