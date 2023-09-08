<li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span class="fi fi-{{ Config::get('languages')[App::getLocale()]['flag-icon'] }}"></span> {{ Config::get('languages')[App::getLocale()]['display'] }}
    </a>
    <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
        @foreach (Config::get('languages') as $lang => $language)
            @if ($lang != App::getLocale())
                <a class="dropdown-item" href="{{ route('locale.switch', $lang) }}"><span class="fi fi-{{$language['flag-icon']}}"></span> {{$language['display']}}</a>
            @endif
        @endforeach
    </div>
</li>
