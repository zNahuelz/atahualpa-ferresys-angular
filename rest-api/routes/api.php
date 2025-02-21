<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UnitTypeController;
use App\Http\Controllers\VoucherController;
use App\Http\Controllers\VoucherTypeController;
use App\Http\Middleware\AdminMiddleware;
use App\Http\Middleware\AdminOrSellerMiddleware;
use App\Http\Middleware\BlobResponseMiddleware;
use App\Http\Middleware\GeneralMiddleware;
use App\Http\Middleware\SellerMiddleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::group([
    'prefix' => '/auth',
    'middleware' => GeneralMiddleware::class,
], function($router){
    Route::get('/', [AuthController::class, 'getUsers'])->middleware(AdminOrSellerMiddleware::class);
    Route::delete('/{id}', [AuthController::class, 'deleteUser'])->middleware(AdminMiddleware::class);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'createAccount'])->middleware(AdminMiddleware::class);
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/recover_account', [AuthController::class, 'sendRecoveryMail']);
    Route::post('/verify_token', [AuthController::class, 'verifyRecoveryToken']);
    Route::post('/change_password', [AuthController::class, 'changePasswordWithToken']);
    Route::put('/profile', [AuthController::class, 'updateAccountData'])->middleware(AdminOrSellerMiddleware::class);
    Route::post('/reset/{id}', [AuthController::class, 'resetAccountPassword'])->middleware(AdminMiddleware::class);
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
    Route::get('/s/p', [ProductController::class, 'getProductsInStock']);
    Route::get('/s/by_name/{name}', [ProductController::class, 'getProductsByNameInStock']);
    Route::get('/s/{id}', [ProductController::class, 'getProductInStock']);
    Route::get('/by_name/{name}', [ProductController::class, 'getProductsByName']);
    Route::get('/by_desc/{description}',[ProductController::class, 'getProductsByDescription']);
    Route::get('/by_unit_type/{id}', [ProductController::class, 'getProductsByUnitType']);
    Route::get('/by_supplier/{id}', [ProductController::class, 'getProductsBySupplier']);
});

Route::group([
    'prefix' => '/unit_type',
    'middleware' => SellerMiddleware::class,
], function($router){
    Route::post('/', [UnitTypeController::class, 'createUnitType']);
    Route::put('/{id}', [UnitTypeController::class, 'updateUnitType']);
    Route::get('/', [UnitTypeController::class, 'getUnitTypes']);
    Route::get('/p', [UnitTypeController::class, 'getUnitTypesPaginated']);
    Route::get('/{id}', [UnitTypeController::class, 'getUnitType']);
    Route::get('/by_name/{name}', [UnitTypeController::class, 'getUnitTypeByName']);
});

Route::group([
    'prefix' => '/supplier',
    'middleware' => SellerMiddleware::class,
], function($router) {
    Route::post('/',[SupplierController::class,'createSupplier']);
    Route::get('/', [SupplierController::class, 'getSuppliers']);
    Route::get('/p', [SupplierController::class, 'getSuppliersPaginated']);
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
    Route::get('/p', [CustomerController::class, 'getCustomersPaginated']);
    Route::get('/{id}', [CustomerController::class, 'getCustomer']);
    Route::get('/by_dni/{dni}', [CustomerController::class, 'getCustomerByDNI']);
    Route::put('/{id}', [CustomerController::class, 'updateCustomer']);
    Route::delete('/{id}', [CustomerController::class, 'deleteCustomer']);
});

Route::group([
    'prefix' => 'voucher',
    'middleware' => SellerMiddleware::class,
], function($router){
    Route::post('/', [VoucherController::class, 'createVoucher']);
    Route::get('/by_id/{id}', [VoucherController::class, 'getVoucherById']);
    Route::get('/by_month', [VoucherController::class, 'getVouchersByMonth']);
    Route::get('/by_dni/{dni}', [VoucherController::class, 'getVouchersByCustomerDni']);
    Route::get('/by_range', [VoucherController::class, 'getVouchersByRange']);
    Route::get('/download/{id}', [VoucherController::class, 'getVoucherPdf'])->middleware(BlobResponseMiddleware::class);
});

Route::group([
    'prefix' => 'voucher_type',
    'middleware' => SellerMiddleware::class,
], function($router){
    Route::get('/', [VoucherTypeController::class, 'getVoucherTypes']);
});

Route::group([
    'prefix' => 'role',
    'middleware' => AdminOrSellerMiddleware::class,
], function($router){
    Route::get('/', [RoleController::class, 'getRoles']);
});