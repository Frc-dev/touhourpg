<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1" charset="utf-8">
    <title>TouhouRPG</title>
    <link href="https://fonts.googleapis.com/css?family=Nunito:200,600" rel="stylesheet">
    <link href="css/welcome.css" rel="stylesheet">
</head>
<body>
@extends('layouts.app')
@section('content')
    <div class="text-center">
        <div class="title">
            TouhouRPG
        </div>
        <h4>
            <!-- TODO: refactor all lang to use assoc arrays instead of jsons, way less cluttered IMO -->
            @lang('messages.welcome.author')
            <a href="https://github.com/Frc-dev" class="ms-1 text-decoration-none">(frc-dev)</a>
        </h4>
    </div>
@endsection
</body>
</html>
