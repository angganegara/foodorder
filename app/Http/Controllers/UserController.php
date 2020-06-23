<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;

class UserController extends Controller
{
	public function index(Request $request)
	{
		$data = [];
		$data['id'] = $request->user()->id;
		$data['username'] = $request->user()->username;
		return response()->json([
			'data' => $data,
		]);
	}
}
