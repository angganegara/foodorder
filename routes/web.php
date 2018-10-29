<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

if (env('APP_ENV') === 'local') {
  Route::get('/email-debug/{id}', function ($id) {
    $oh = new App\Helpers\OrderHelper;
    return $oh->sendOrder($id);
  });

  Route::get('/order/{number}', function ($number, \App\Models\Order $order) {
    $data = $order->with('ordercart.schedule')->where('order_number', $number)->first();

    return ($data);
  });

  Route::get('meal-plans', 'MealController@index');
}
Route::get('/snap', 'SnapController@snap');
Route::get('/snaptoken', 'SnapController@token');
Route::post('/snapfinish', 'SnapController@finish');

Route::post('/payment/approve/{order_number}', 'PaymentController@approveChallenge');
Route::post('/payment/confirm/{order_number}', 'PaymentController@confirm');
Route::post('/payment/process', 'PaymentController@process');
Route::post('/payment/delete', 'PaymentController@deleteOrder');
Route::post('/checkout/start', 'PaymentController@start');
Route::get('/checkout/cancel/{order_number}', 'PaymentController@cancelPaypal');
Route::get('/checkout/finish/{order_number}', 'PaymentController@getExpressCheckout');

Route::group(['prefix' => 'admin', 'middleware' => 'auth'], function () {
  Route::get('/', 'AdminController@index');

  Route::get('meal-plans', 'MealController@manage');
  Route::post('meal-plans/new', 'MealController@newPlan');
  Route::get('meal-plans/all', 'MealController@listPlan');
  Route::get('meal-plans/{id}', 'MealController@getPlan');
  Route::post('meal-plans/{id}/component-update', 'MealController@updateComponent');

  Route::post('presets/new', 'PresetController@insert');
  Route::get('presets/all', 'PresetController@index');
  Route::get('presets/{id}', 'PresetController@show');

  Route::get('orders', 'OrderController@index');
  Route::get('orders/new', 'OrderController@create');
  Route::post('orders/new', 'OrderController@createMPOrder');
  Route::get('orders/schedule', 'OrderController@schedule');
  Route::get('orders/{id}/delete', 'OrderController@delete');
  Route::get('orders/{id}/edit', 'OrderController@edit');
  Route::get('orders/{ordernumber}/{id}', 'OrderController@show');
  Route::post('orders/{ordernumber}/{id}', 'OrderController@update');

  Route::get('partners', 'PartnerController@index');
  Route::get('partners/report', 'PartnerController@report');
  Route::get('partners/new', 'PartnerController@create');
  Route::post('partners/new', 'PartnerController@insert');
  Route::post('partners/report', 'PartnerController@showReport');
  Route::post('partners/export', 'PartnerController@exportExcel');
  Route::get('partners/{id}', 'PartnerController@show');
  Route::post('partners/{id}', 'PartnerController@update');
  Route::get('partners/{id}/delete', 'PartnerController@delete');

  Route::get('coupons', 'CouponController@index');
  Route::get('coupons/new', 'CouponController@create');
  Route::post('coupons/new', 'CouponController@insert');
  Route::get('coupons/{id}', 'CouponController@show');
  Route::post('coupons/{id}', 'CouponController@update');
  Route::get('coupons/{id}/delete', 'CouponController@delete');
});

Route::get('auth/login', 'AuthController@index')->name('login');
Route::post('auth/login', 'AuthController@login');
Route::get('auth/logout', 'AuthController@logout');

Route::any('{all}', function () {
  $action = '';
  return view('app', compact('action'));
})->where(['all' => '.*']);
