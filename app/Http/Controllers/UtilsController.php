<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Redirect;

class UtilsController extends Controller
{
    public function setLocale(string $locale): RedirectResponse
    {
        if (in_array($locale, array_keys(Config::get('languages')))) {
            session(['locale' => $locale]);
        }

        return Redirect::back();
    }
}
