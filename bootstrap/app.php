<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        //
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $newLocales = ['sv', 'no', 'nl', 'lv', 'it', 'fr', 'es', 'de', 'da', 'cs'];

        $exceptions->render(function (NotFoundHttpException $e, \Illuminate\Http\Request $request) use ($newLocales) {
            $path = $request->path();

            foreach ($newLocales as $locale) {
                if ($path === $locale || str_starts_with($path, $locale.'/')) {
                    $remainder = ltrim(substr($path, strlen($locale)), '/');

                    return redirect('/'.$remainder, 302);
                }
            }
        });

        $exceptions->respond(function ($response, \Throwable $e, \Illuminate\Http\Request $request) use ($newLocales) {
            if ($response->getStatusCode() !== 404) {
                return $response;
            }

            $path = $request->path();

            foreach ($newLocales as $locale) {
                if ($path === $locale || str_starts_with($path, $locale.'/')) {
                    $remainder = ltrim(substr($path, strlen($locale)), '/');

                    return redirect('/'.$remainder, 302);
                }
            }

            return $response;
        });
    })->create();
