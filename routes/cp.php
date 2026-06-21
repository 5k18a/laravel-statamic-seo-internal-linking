<?php

use App\Http\Controllers\CP\CollectionRoutesController;
use App\Http\Controllers\CP\SeoErrorsController;
use App\Http\Controllers\CP\TranslatorApiController;
use App\Http\Controllers\CP\UiTranslationsController;
use Illuminate\Support\Facades\Route;

Route::prefix('collection-routes')->name('collection-routes.')->group(function () {
    Route::get('/', [CollectionRoutesController::class, 'index'])->name('index');
    Route::get('/{collection}', [CollectionRoutesController::class, 'edit'])->name('edit');
    Route::post('/{collection}', [CollectionRoutesController::class, 'update'])->name('update');
});

Route::prefix('ui-translations')->name('ui-translations.')->group(function () {
    Route::get('/', [UiTranslationsController::class, 'index'])->name('index');
    Route::get('/{locale}', [UiTranslationsController::class, 'edit'])->name('edit');
    Route::post('/{locale}', [UiTranslationsController::class, 'update'])->name('update');
});

Route::prefix('translator-api')->name('translator-api.')->group(function () {
    Route::get('/', [TranslatorApiController::class, 'index'])->name('index');
    Route::post('/', [TranslatorApiController::class, 'update'])->name('update');
});

Route::prefix('seo-errors-manager')->name('seo-errors-manager.')->group(function () {
    Route::get('/', [SeoErrorsController::class, 'index'])->name('index');
    Route::delete('/{key}', [SeoErrorsController::class, 'destroy'])->name('destroy');
    Route::post('/bulk-delete', [SeoErrorsController::class, 'bulkDelete'])->name('bulk-delete');
    Route::post('/delete-all', [SeoErrorsController::class, 'deleteAll'])->name('delete-all');
    Route::post('/settings', [SeoErrorsController::class, 'updateSettings'])->name('settings');
});
