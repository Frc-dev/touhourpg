<!DOCTYPE html>
<!-- TODO: i suspect the lang attribute is useless here -->
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
        <!-- TODO: what does "m-b-md" even mean, I know it's margin-bottom but md should be used as a breakpoint, this does not define how much margin is given either -->
        <div class="title">
            TouhouRPG
        </div>
        <h4>
            <!-- TODO: refactor all lang to use assoc arrays instead of jsons, way less cluttered IMO -->
            @lang('messages.welcome.author')
            <!-- TODO: why does ms-1 not work? check syntax or if bootstrap is being loaded properly -->
            <a href="https://github.com/Frc-dev" class="ms-1 text-decoration-none">(frc-dev)</a>
        </h4>
    </div>
@endsection
</body>
</html>
