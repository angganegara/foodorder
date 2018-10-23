<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('foods/categorize', 'FoodController@categorize');
Route::get('foods', 'FoodController@index');
Route::get('foods/category/{id}', 'FoodController@getItems');
Route::get('foods/{id}', 'FoodController@show');
Route::get('foods/{id}/type/{type}', 'FoodController@price');
Route::post('apply-coupon', 'CouponController@applyCoupon');

Route::get('items', 'ItemController@index');
Route::get('items/categorize', 'ItemController@categorize');

Route::post('cart/save', 'CartController@save');
Route::post('cart/content', 'CartController@show');
Route::post('cart/update', 'CartController@update');
Route::post('cart/empty', 'CartController@delete');

Route::get('detox', 'FoodController@detox');

Route::post('partners', 'PartnerController@index');

Route::post('create-order', 'OrderController@createOrder');
Route::post('send-order', 'OrderController@sendOrder');
Route::post('calculate-cart', 'CartController@calculateCart');

Route::post('long-period-order', 'OrderController@sendLongPeriodOrder');

Route::get('domain', 'FoodController@getDomain');

Route::post('error-log', 'OrderController@errorLog');

Route::get('menus', function () {
  return \App\Models\Menu::orderBy('id', 'asc')->get();
});
