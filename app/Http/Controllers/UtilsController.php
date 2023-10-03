<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\View;

class UtilsController extends Controller
{
    public function setLocale(string $locale): RedirectResponse
    {
        if (in_array($locale, array_keys(Config::get('languages')))) {
            Session::put('locale', $locale);
        }

        return Redirect::back();
    }
}
