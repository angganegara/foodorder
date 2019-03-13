<!doctype html>
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
  <title>{{ isset($title) ? $title : "Motion Cafe Bali | Admin" }}</title>
  <link rel="stylesheet" href="/css/fontawesome-all.min.css">
  <link rel="stylesheet" href="/css/backend.css?{{ date('Ymdh') }}" media="screen" />
  <link rel="stylesheet" href="/css/redactor.css" />
  <link rel="stylesheet" href="/css/datepicker.min.css" />
  <link rel="stylesheet" href="/css/print.css?{{ date('Ymdh') }}" media="all" />
</head>
<body>

  @yield('login')

  <script src="{{ asset('js/manifest.js') }}"></script>
  <script src="{{ asset('js/vendor.js') }}"></script>
  <script src="{{ asset('js/admin.js?'. date('Ymdh')) }}"></script>
  <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
  <script src="/js/datepicker.min.js"></script>
  <script src="/js/datepicker.en.js"></script>

  @yield('admin')
  @yield('scripts')
</body>
</html>
