<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;

class AuthController extends Controller
{
  public function index()
  {
    return view('admin.login');
  }

  public function login(Request $request)
  {
    if (Auth::attempt(['username' => $request->username, 'password' => $request->password])) {
      return redirect('admin');
    } else {
      return response()->json('error');
    }
  }

  public function logout()
  {
    Auth::logout();
    return redirect('auth/login');
  }
}
