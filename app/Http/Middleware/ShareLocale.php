<?php

namespace App\Http\Middleware;


use Closure;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\View;

class ShareLocale
{
    public function handle($request, Closure $next)
    {
        $locale = Session::get('locale') ?? 'en';

        View::share('_locale', $locale);
        App::setLocale($locale);

        return $next($request);
    }
}
