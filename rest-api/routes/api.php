<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UnitTypeController;
use App\Http\Middleware\GeneralMiddleware;
use App\Http\Middleware\SellerMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => '/auth',
    'middleware' => GeneralMiddleware::class,
], function($router){
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

Route::group([
    'prefix' => '/product',
    'middleware' => SellerMiddleware::class,
], function($router){
    Route::post('/',[ProductController::class, 'createProduct']);
    Route::put('/{id}',[ProductController::class,'updateProduct']);
    Route::delete('/{id}', [ProductController::class,'deleteProduct']);
    Route::get('/{id}', [ProductController::class,'getProduct']);
    Route::get('/', [ProductController::class, 'getProducts']);
    Route::get('/paginate', [ProductController::class,'getProductsPaginated']);
    Route::get('/by_name/{name}', [ProductController::class, 'getProductsByName']);
    Route::get('/by_desc/{description}',[ProductController::class, 'getProductsByDescription']);
    Route::get('/by_unit_type/{id}', [ProductController::class, 'getProductsByUnitType']);
});

Route::group([
    'prefix' => '/unit_type',
    'middleware' => SellerMiddleware::class,
], function($router){
    Route::post('/', [UnitTypeController::class, 'createUnitType']);
    Route::put('/{id}', [UnitTypeController::class, 'updateUnitType']);
    Route::get('/', [UnitTypeController::class, 'getUnitTypes']);
    Route::get('/{id}', [UnitTypeController::class, 'getUnitType']);
    Route::get('/by_name/{name}', [UnitTypeController::class, 'getUnitTypeByName']);
});

Route::group([
    'prefix' => '/supplier',
    'middleware' => SellerMiddleware::class,
], function($router) {
    Route::post('/',[SupplierController::class,'createSupplier']);
    Route::get('/', [SupplierController::class, 'getSuppliers']);
    Route::get('/{id}', [SupplierController::class, 'getSupplier']);
    Route::get('/by_ruc/{ruc}', [SupplierController::class, 'getSupplierByRUC']);
    Route::get('/by_name/{name}', [SupplierController::class, 'getSupplierByName']);
    Route::get('/by_email/{email}', [SupplierController::class, 'getSupplierByEmail']);
    Route::put('/{id}', [SupplierController::class, 'updateSupplier']);
    Route::delete('/{id}',[SupplierController::class, 'deleteSupplier']);
});

Route::group([
    'prefix' => '/customer',
    'middleware' => SellerMiddleware::class,
], function($router){
    Route::post('/', [CustomerController::class, 'createCustomer']);
    Route::get('/', [CustomerController::class, 'getCustomers']);
    Route::get('/{id}', [CustomerController::class, 'getCustomer']);
    Route::get('/by_dni/{dni}', [CustomerController::class, 'getCustomerByDNI']);
    Route::put('/{id}', [CustomerController::class, 'updateCustomer']);
    Route::delete('/{id}', [CustomerController::class, 'deleteCustomer']);
});