<?php

use App\Http\Controllers\CP\CollectionRoutesController;
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
