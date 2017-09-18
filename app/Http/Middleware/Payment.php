<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class Payment
{
    public function handle(Request $request, Closure $next)
    {
		return $request->has('key')
			? $request->key == '4f4jgz50259cgpt67snd8c01kx39fmc'
			? $next($request)
			: redirect('/')
			: redirect('/');
    }
}
