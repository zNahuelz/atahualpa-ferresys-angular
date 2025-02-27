<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UnitTypeController;
use App\Http\Controllers\VoucherController;
use App\Http\Controllers\VoucherTypeController;
use App\Http\Middleware\BlobResponseMiddleware;
use App\Http\Middleware\GeneralMiddleware;
use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => '/auth',
    'middleware' => GeneralMiddleware::class,
], function($router){
    Route::get('/', [AuthController::class, 'getUsers'])->middleware('role:ADMINISTRADOR');
    Route::get('/{id}', [AuthController::class, 'getUser'])->middleware('role:ADMINISTRADOR');
    Route::put('/u/{id}', [AuthController::class, 'forceUpdateAccData'])->middleware('role:ADMINISTRADOR');
    Route::delete('/{id}', [AuthController::class, 'deleteUser'])->middleware('role:ADMINISTRADOR');
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'createAccount'])->middleware('role:ADMINISTRADOR');
    Route::get('/p/profile', [AuthController::class, 'profile'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::post('/recover_account', [AuthController::class, 'sendRecoveryMail']);
    Route::post('/verify_token', [AuthController::class, 'verifyRecoveryToken']);
    Route::post('/change_password', [AuthController::class, 'changePasswordWithToken']);
    Route::put('/profile', [AuthController::class, 'updateAccountData'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::post('/reset/{id}', [AuthController::class, 'resetAccountPassword'])->middleware('role:ADMINISTRADOR');
});

Route::group([
    'prefix' => '/product',
], function($router){
    Route::post('/',[ProductController::class, 'createProduct'])->middleware('role:ADMINISTRADOR');
    Route::put('/{id}',[ProductController::class,'updateProduct'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::delete('/{id}', [ProductController::class,'deleteProduct'])->middleware('role:ADMINISTRADOR');
    Route::get('/{id}', [ProductController::class,'getProduct'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/', [ProductController::class, 'getProducts'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/paginate', [ProductController::class,'getProductsPaginated'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/s/p', [ProductController::class, 'getProductsInStock'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/s/by_name/{name}', [ProductController::class, 'getProductsByNameInStock'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/s/{id}', [ProductController::class, 'getProductInStock'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/by_name/{name}', [ProductController::class, 'getProductsByName'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/by_desc/{description}',[ProductController::class, 'getProductsByDescription'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/by_unit_type/{id}', [ProductController::class, 'getProductsByUnitType'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/by_supplier/{id}', [ProductController::class, 'getProductsBySupplier'])->middleware('role:ADMINISTRADOR,VENDEDOR');
});

Route::group([
    'prefix' => '/unit_type',
], function($router){
    Route::post('/', [UnitTypeController::class, 'createUnitType'])->middleware('role:ADMINISTRADOR');;
    Route::put('/{id}', [UnitTypeController::class, 'updateUnitType'])->middleware('role:ADMINISTRADOR');
    Route::get('/', [UnitTypeController::class, 'getUnitTypes'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/p', [UnitTypeController::class, 'getUnitTypesPaginated'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/{id}', [UnitTypeController::class, 'getUnitType'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/by_name/{name}', [UnitTypeController::class, 'getUnitTypeByName'])->middleware('role:ADMINISTRADOR,VENDEDOR');
});

Route::group([
    'prefix' => '/supplier',
], function($router) {
    Route::post('/',[SupplierController::class,'createSupplier'])->middleware('role:ADMINISTRADOR');
    Route::get('/', [SupplierController::class, 'getSuppliers'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/p', [SupplierController::class, 'getSuppliersPaginated'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/{id}', [SupplierController::class, 'getSupplier'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/by_ruc/{ruc}', [SupplierController::class, 'getSupplierByRUC'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/by_name/{name}', [SupplierController::class, 'getSupplierByName'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/by_email/{email}', [SupplierController::class, 'getSupplierByEmail'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::put('/{id}', [SupplierController::class, 'updateSupplier'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::delete('/{id}',[SupplierController::class, 'deleteSupplier'])->middleware('role:ADMINISTRADOR');
});

Route::group([
    'prefix' => '/customer',
], function($router){
    Route::post('/', [CustomerController::class, 'createCustomer'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/', [CustomerController::class, 'getCustomers'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/p', [CustomerController::class, 'getCustomersPaginated'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/{id}', [CustomerController::class, 'getCustomer'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/by_dni/{dni}', [CustomerController::class, 'getCustomerByDNI'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::put('/{id}', [CustomerController::class, 'updateCustomer'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::delete('/{id}', [CustomerController::class, 'deleteCustomer'])->middleware('role:ADMINISTRADOR,VENDEDOR');
});

Route::group([
    'prefix' => 'voucher',
], function($router){
    Route::post('/', [VoucherController::class, 'createVoucher'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/by_id/{id}', [VoucherController::class, 'getVoucherById'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/by_month', [VoucherController::class, 'getVouchersByMonth'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/by_dni/{dni}', [VoucherController::class, 'getVouchersByCustomerDni'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/by_range', [VoucherController::class, 'getVouchersByRange'])->middleware('role:ADMINISTRADOR,VENDEDOR');
    Route::get('/download/{id}', [VoucherController::class, 'getVoucherPdf'])->middleware(BlobResponseMiddleware::class);
});

Route::group([
    'prefix' => 'voucher_type',
], function($router){
    Route::get('/', [VoucherTypeController::class, 'getVoucherTypes'])->middleware('role:ADMINISTRADOR,VENDEDOR');
});

Route::group([
    'prefix' => 'role',
], function($router){
    Route::get('/', [RoleController::class, 'getRoles'])->middleware('role:ADMINISTRADOR,VENDEDOR');
});