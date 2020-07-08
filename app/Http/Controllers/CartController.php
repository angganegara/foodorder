<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Cart;

class CartController extends Controller
{
	public function save(Request $request)
	{
    $data = $request->data;

    $duplicate = 1;
    while ($duplicate > 0) {
      $cart_key = str_random(40);
      $duplicate = Cart::where('cart_key', $cart_key)->count();
    }

    $cart = new Cart;
    $cart->cart_key = $cart_key;
    $cart->cart = $data;
    $cart->save();

    return $cart_key;
  }

  public function update(Request $request)
  {
    $cartKey = $request->cartKey;
    $cart = Cart::where('cart_key', $cartKey)->first();
    if (!$cart) {
      $cart = new Cart;
      $cart->cart_key = $cartKey;
    }
    $cart->cart = $request->cartData;
    $cart->save();

    return $cart->cart_key;
  }

  public function show(Request $request)
  {
    $cartKey = $request->cartKey;
    $cart = Cart::where('cart_key', $cartKey)->first();

    if (!$cart) {
      return response('NOT_FOUND');
    }

    return response($cart);
  }

  public function delete(Request $request)
  {
    Cart::where('cart_key', $request->cartKey)->delete();

    if (session()->has('doku_request')) {
      session()->delete('doku_request');
    }
    
    return 'OK';
  }
}
