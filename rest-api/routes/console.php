<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;

Route::get('/', function () {
    return json(['message' => 'API Working!']);
});
