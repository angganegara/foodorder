<!doctype html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-touch-fullscreen" content="yes">
    <meta id="extViewportMeta" name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
    <meta name="description" content="The best solution for an overall healthy body is the combination of fitness and nutrition. We need to be active and eat the right food. Preparing and cooking can be stressful and needs a lot of time. With our food delivery service you not only save your valid time, but also get the best nutrition for your body." />
    <meta name="keywords" content="Food Order, Healthy Food Order, Motion Cafe, Motion Cafe Bali, Food Order Bali, Healthy Food Bali, Healthy Food" />
    <meta name="author" content="Motion Fitness Bali" />
    <meta name="robots" content="index, follow" />
    <link rel="apple-touch-icon-precomposed" href="/images/favicon.png">
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="/images/favicon.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="/images/favicon.png">
    <title>Motion Cafe Bali | Homemade &amp; Fresh, Vegan &amp; Paleo Friendly</title>
    <link rel="stylesheet" href="{{ asset('css/payment.css') }}">
    <link rel="stylesheet" href="{{ asset('css/fontawesome-all.min.css') }}">
    <meta property="og:locale" content="en_US" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="Motion Cafe Bali | Homemade &amp; Fresh, Vegan &amp; Paleo Friendly" />
    <meta property="og:url" content="https://mealplans.motionfitnessbali.com/" />
    <meta property="og:site_name" content="Motion Cafe Bali" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="Motion Cafe Bali | Homemade &amp; Fresh, Vegan &amp; Paleo Friendly" />
</head>
<body>

    <!-- built files will be auto injected -->
    <script>window.order_number = '{{ $ordernumber }}';</script>
    <script>window.order_key = '{{ $key }}';</script>
    <script>window.payment = {{ $total_payment }};</script>
    <script src="{{ asset('js/payment_confirmation.js?'. date('Ymd')) }}"></script>

</body>
</html>
