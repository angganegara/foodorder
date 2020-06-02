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
  @if ($action != 'admin')
  <link rel="stylesheet" href="/css/app.css?2.4">
  <link rel="stylesheet" href="/css/fontawesome-all.min.css">
  @else
  <link rel="stylesheet" href="/css/backend.css?1.3">
  <link rel="stylesheet" href="/css/redactor.css?1.3">
  @endif
  <link rel="stylesheet" href="/css/plugins.css">
  <link rel="stylesheet" href="/css/datepicker.min.css">
  <meta property="og:locale" content="en_US" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Motion Cafe Bali | Homemade &amp; Fresh, Vegan &amp; Paleo Friendly" />
  <meta property="og:url" content="https://mealplans.motionfitnessbali.com/" />
  <meta property="og:site_name" content="Motion Cafe Bali" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="Motion Cafe Bali | Homemade &amp; Fresh, Vegan &amp; Paleo Friendly" />
</head>
<body>
  <div id="app"></div>
  <!-- built files will be auto injected -->
  <script src="{{ asset('js/app.js?'. date('Ymd')) }}"></script>
  @if (env('APP_ENV') == 'local')
    <script type="text/javascript" src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key="VT-client-ynStwlFWAgbV4ZRz"></script>
  @else
    <script type="text/javascript" src="https://app.midtrans.com/snap/snap.js" data-client-key="VT-client-0_yAoB6Dgk_JND-Y"></script>
  @endif
  <noscript>
    <div class="noscript">
      <img src="/images/logo-email.jpg" alt="Motion Cafe Bali">
      <br>
      <p>For the best viewing experience, please enable Javascript in your browser.</p>
    </div>
  </noscript>

  <!--<script src="/js/datepicker.min.js" type="text/javascript"></script>
  <script src="/js/datepicker.en.js" type="text/javascript"></script>-->
  <script>
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
      (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
      m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');

    ga('create', 'UA-49735691-3', 'auto');
    ga('send', 'pageview');
  </script>
  <script>
    function initFreshChat() {
      window.fcWidget.init({
        token: "b3dba565-5d12-423a-be4b-88c5b5a1bbd2",
        host: "https://wchat.freshchat.com"
      });
    }
    function initialize(i,t){var e;i.getElementById(t)?initFreshChat():((e=i.createElement("script")).id=t,e.async=!0,e.src="https://wchat.freshchat.com/js/widget.js",e.onload=initFreshChat,i.head.appendChild(e))}function initiateCall(){initialize(document,"freshchat-js-sdk")}window.addEventListener?window.addEventListener("load",initiateCall,!1):window.attachEvent("load",initiateCall,!1);
  </script>
</body>
</html>
