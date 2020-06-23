<?php

namespace App\Http\Middleware;

use Closure;

class Staff
{
  /**
   * Handle an incoming request.
   *
   * @param  \Illuminate\Http\Request  $request
   * @param  \Closure  $next
   * @return mixed
   */
  public function handle($request, Closure $next)
  {
    $access_key = 'mp5xt8uu31k5';
    $params = $request->route()->parameters();

    if (!array_key_exists('key', $params) || $request->key !== $access_key) {
      return redirect('/');
    }

    return $next($request);
  }
}
