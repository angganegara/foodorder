<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/
use Illuminate\Http\Request;

/**
 * DEBUG ROUTES - ONLY ACTIVE IF ENV = LOCAL
 */
if (env('APP_ENV') === 'local') {
	$app->get('/email-debug/{id}', function ($id) {
		$oh = new App\Helpers\OrderHelper;
		return $oh->sendOrder($id);
	});

	$app->get('/order/{id}', function ($id, \App\Models\Order $order) {
		$data = $order->where('id', $id);

		return ($data->with('ordercart.schedule')->get());
	});	
}

$app->post('/checkout/start', 'PaypalController@start');
$app->get('/checkout/finish/{ordernumber}', 'PaypalController@getExpressCheckout');
$app->get('/paypal-test/{ordernumber}', 'PaypalController@setData');

$app->get('/api/foods/categorize', 'FoodController@categorize');
$app->get('/api/foods', 'FoodController@index');
$app->get('/api/foods/category/{id}', 'FoodController@getItems');
$app->get('/api/foods/{id}', 'FoodController@show');
$app->get('/api/foods/{id}/type/{type}', 'FoodController@price');

$app->post('/api/create-order', 'OrderController@createOrder');
$app->post('/api/send-order', 'OrderController@sendOrder');
$app->post('/api/calculate-cart', 'CartController@calculateCart');

$app->get('/api/menus', function () {
	return \App\Models\Menu::orderBy('id', 'asc')->get();
});

$app->post('/api/auth/login', 'AuthController@postLogin');

$app->group(['prefix' => 'api/admin', 'middleware' => 'auth:api'], function () use ($app) {

	$app->get('orders', 'OrderController@index');
	$app->get('orders/{id}', 'OrderController@show');
	$app->post('orders/{id}', 'OrderController@update');
	$app->get('orders/{id}/delete', 'OrderController@delete');
	$app->get('orders/resend/{id}', 'OrderController@resendOrder');

	$app->get('schedule[/{date}]', 'ScheduleController@index');

	$app->get('fitslim/menu', 'FitSlimController@menu');
	$app->post('fitslim/menu', 'FitSlimController@saveMenu');
	$app->get('fitslim/names', 'FitSlimController@names');
	$app->post('fitslim/names', 'FitSlimController@saveNames');

	$app->get('/user', 'UserController@index');

	$app->get('check', function () { return 'OK'; });
});

$app->get('/admin', function () {
	$action = 'admin';
	return view('app', compact('action'));
});

$app->group(['prefix' => 'admin'], function () use ($app) {
	$app->get('{any:.+}', function () {
		$action = 'admin';
		return view('app', compact('action'));
	});
});

$app->get('/auth/login', function () {
	$action = 'admin';
	return view('app', compact('action'));
});

$app->get('{any:.+}', function () {
	$action = '';
	return view('app', compact('action'));
});

$app->get('/', function () {
	$action = '';
	return view('app', compact('action'));
});
