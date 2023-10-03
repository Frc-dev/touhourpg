<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\View;

class SetLocale
{
    public function handle($request, Closure $next)
    {
        $locale = $request->get('locale', 'en');

        App::setLocale($locale);

        return $next($request);
    }
}
