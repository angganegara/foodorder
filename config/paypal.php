<?php
/**
 * PayPal Setting & API Credentials
 * Created by Raza Mehdi <srmk@outlook.com>.
 */

return [
  'mode'    => 'live', // Can only be 'sandbox' Or 'live'. If empty or invalid, 'live' will be used.
  'sandbox' => [
    'username'    => env('PAYPAL_SANDBOX_API_USERNAME', 'angga_api1.me.com'),
    'password'    => env('PAYPAL_SANDBOX_API_PASSWORD', '3U3KYN8NGPDEDCUH'),
    'secret'      => env('PAYPAL_SANDBOX_API_SECRET', 'AFcWxV21C7fd0v3bYYYRCpSSRl31A1BRxxBEdEBwdIkSbi-7bBqukTfC'),
    'certificate' => env('PAYPAL_SANDBOX_API_CERTIFICATE', ''),
    'app_id'      => 'APP-80W284485P519543T', // Used for testing Adaptive Payments API in sandbox mode
  ],
  'live' => [
    'username'    => env('PAYPAL_LIVE_API_USERNAME', 'pay_api1.motionfitnessbali.com'),
    'password'    => env('PAYPAL_LIVE_API_PASSWORD', 'DFQ5DXPS3MKU5E39'),
    'secret'      => env('PAYPAL_LIVE_API_SECRET', 'An5ns1Kso7MWUdW4ErQKJJJ4qi4-Ajn4Ndod.o2iS8IpvwZRYpup9YeM'),
    'certificate' => env('PAYPAL_LIVE_API_CERTIFICATE', ''),
    'app_id'      => '', // Used for Adaptive Payments API
  ],

  'payment_action' => 'Sale', // Can only be 'Sale', 'Authorization' or 'Order'
  'currency'       => 'USD',
  'notify_url'     => '', // Change this accordingly for your application.
  'locale'         => '', // force gateway language  i.e. it_IT, es_ES, en_US ... (for express checkout only)
];
