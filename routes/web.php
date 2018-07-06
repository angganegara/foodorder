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

  Route::get('/order/{id}', function ($id, \App\Models\Order $order) {
    $data = $order->where('id', $id);

    return ($data->with('ordercart.schedule')->get());
  });
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

  Route::get('orders', 'OrderController@index');
  Route::get('orders/{id}', 'OrderController@show');
  Route::post('orders/{id}', 'OrderController@update');
  Route::get('orders/{id}/delete', 'OrderController@delete');
  Route::get('orders/resend/{id}', 'OrderController@resendOrder');

  Route::get('partners', 'PartnerController@index');

});

Route::get('auth/login', 'AuthController@index')->name('login');
Route::post('auth/login', 'AuthController@login');
Route::get('auth/logout', 'AuthController@logout');

Route::any('{all}', function () {
  $action = '';
  return view('app', compact('action'));
})->where(['all' => '.*']);
