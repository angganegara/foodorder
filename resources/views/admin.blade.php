<!DOCTYPE html>
<html class="{{ Request::is('admin/orders/new*') || Request::is('admin/meal-plans*') ? 'no-overflow' : '' }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-touch-fullscreen" content="yes">
  <meta id="extViewportMeta" name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
  <meta name="author" content="Motion Fitness Bali" />
  <meta name="robots" content="nofollow" />
  <link rel="apple-touch-icon-precomposed" href="/images/favicon.png" />
  <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/images/favicon.png" />
  <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/images/favicon.png" />
  <title>Motion Cafe Bali | Admin</title>
  <link rel="stylesheet" href="/css/fontawesome-all.min.css">
  <link rel="stylesheet" href="/css/backend.css" media="screen" />
  <link rel="stylesheet" href="/css/redactor.css" />
  <link rel="stylesheet" href="/css/datepicker.min.css" />
</head>
<body>

  @yield('login')

  <script src="{{ asset('js/manifest.js') }}"></script>
  <script src="{{ env('APP_ENV') == 'local' ? asset('js/vendor.js') : asset('js/vendor.js.gz') }}"></script>
  @yield('admin')
</body>
</html>
