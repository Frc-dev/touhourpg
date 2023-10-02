@extends('layouts.app')
<script type="module" src="{{asset('js/register.js')}}"></script>
<div class="container">
    <div class="row justify-content-center mt-4">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">@lang('messages.auth.register.title')</div>
                <div class="card-body d-flex justify-content-between w-100">
                    <form method="POST" action="{{ route('register') }}" class="w-100">
                        @csrf
                        <x-auth.register.username></x-auth.register.username>
                        <x-auth.register.email></x-auth.register.email>
                        <x-auth.register.password></x-auth.register.password>
                        <x-auth.register.password_confirm></x-auth.register.password_confirm>
                        <x-auth.register.register></x-auth.register.register>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>

