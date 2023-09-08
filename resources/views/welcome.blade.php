@extends('layouts.app')
<link href="css/welcome.css" rel="stylesheet">
<div>
    <x-navbar.main></x-navbar.main>
    <div class="welcome-box text-center">
        <div class="title">
            TouhouRPG
        </div>
        <h4>
            <!-- TODO: refactor all lang to use assoc arrays instead of jsons, way less cluttered IMO -->
            @lang('messages.welcome.author')
            <a href="https://github.com/Frc-dev" class="ms-1 text-decoration-none">(frc-dev)</a>
        </h4>
    </div>
</div>

