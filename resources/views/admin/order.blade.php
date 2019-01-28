@extends('admin.admin', ['title' => 'VIEW ORDER | Motion Cafe Bali | Admin'])

@section('content')
<div class="main-content">
  <nav class="breadcrumb has-arrow-separator" aria-label="breadcrumbs">
    <ul>
      <li><a href="#">Admin</a></li>
      <li><a href="/admin/orders">Orders</a></li>
      <li class="is-active"><a href="#">View Order</a></li>
    </ul>
  </nav>

  <div class="body">
    <div class="title-flex">
      <h1># {{ $order->order_number }} ({{ $order->name }})</h1>
      <div class="title-buttons">
        <a href="/admin/orders/{{ $order->id }}/edit" title="" class="button is-info"><i class="fa fa-pencil"></i> &nbsp;<span>UPDATE MEAL PLAN</span></a>
        &nbsp;
        <a href="javascript:" title="" class="button is-info mp-email">
          <i class="fa fa-envelope"></i> &nbsp;<span>{{ $order->menu_email_sent ? 'RESEND MP EMAIL' : 'SEND MP EMAIL' }}</span>
        </a>
      </div>
    </div>
    <div class="columns">
      <div class="column is-half">
        <div class="form-section">
          <h2>Personal Data</h2>
          <div class="form-inner">
            <div class="columns form-row">
              <div class="column is-half">
                <label>First name</label>
                {{ $order->fname }}
              </div>
              <div class="column is-half">
                <label>Surname</label>
                {{ $order->lname }}
              </div>
            </div>
            <div class="columns form-row">
              <div class="column is-half">
                <label>Email address</label>
                {{ $order->email }}
              </div>
              <div class="column is-half">
                <label>Phone number</label>
                {{ $order->phone }}
              </div>
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2>Comments</h2>
          <div class="form-inner">
            <div class="form-row">
              <label>Comments</label>
              {!! $order->comments != '' && $order->comments != NULL ? $order->comments : '<em>Guest did not put a comments</em>' !!}
            </div>
          </div>
        </div>

        <div class="form-section">
          <h2>Payment</h2>
          <div class="form-inner">
            <div class="columns form-row">
              <div class="column is-half">
                <label>Payment methods</label>
                {{ $order->payment_formatted }}
              </div>
              @if ($order->payment != 'cash')
                <div class="column is-half">
                  <label>Payment Status</label>
                  {{ $order->order_status }}
                </div>
              @endif
            </div>
          </div>
        </div>

        <a class="button is-info" href="/admin/orders"><i class="fal fa-angle-left"></i> &nbsp;Return</a>

      </div>
      <div class="column is-half">

        <div class="form-section">
          <h2>Order overview</h2>
          @foreach ($order->ordercart as $cart)
            <div class="cart-row">
              <div class="cart-wrap">
                <div class="cart-body">
                  <div class="cart-title">{{ $cart->meals }} {!! $cart->eco_price > 0 ? '- with Eco pack' : '' !!}</div>
                  <div class="cart-package">{{ $cart->package_name }}</div>
                  <div class="cart-dates">{{ $cart->date_period }}</div>
                  @if ($cart->slimsunday == 1)<div class="cart-slimsunday">+ Slim Sunday</div>@endif
                </div>
                <div class="cart-subtotal">
                  <label>subtotal</label>
                  {{ $cart->parsed_price }} IDR
                </div>
              </div>
              <div class="cart-schedule"><i class="fal fa-fw fa-angle-down"></i> schedule</div>
              <div class="schedule-wrap">
                <table>
                  <tr>
                    <th>Date</th>
                    <th>Station</th>
                    <th>Snacks</th>
                  </tr>
                @foreach ($cart->schedule as $schedule)
                  <tr>
                    <td><b>{{ $schedule->nice_date }}</b></td>
                    <td>{{ $schedule->station }} {{ $schedule->area ? '('. $schedule->area .')' : '' }}</td>
                    <td>{{ $schedule->snacks ? $schedule->snacks : '-' }}</td>
                  </tr>
                @endforeach
                </table>
              </div>
            </div>
          @endforeach
        </div>

        <div class="form-section">
          <h2>order total</h2>
          <table class="total">
            <tr>
              <td width="75%">subtotal</td>
              <td width="25%">{{ number_format($order->subtotal, 0) }} IDR</td>
            </tr>
            <tr>
              <td>discount @if ($order->coupon_code)(code: {{ $order->coupon_code }})@endif </td>
              <td>- {{ number_format($order->coupon_value) }} IDR</td>
            </tr>
            <tr>
              <td>total</td>
              <td>{{ number_format($order->total) }} IDR</td>
            </tr>
          </table>
        </div>

      </div>
    </div>
  </div>
</div>
@endsection

@section('scripts')
<script>
  var orderID = {{ $order->id }};
  $('.mp-email').click(function (e) {
    e.preventDefault();
    var $el = $(this);
    var buttonText = $el.html();

    $el.html('<i class="fal fa-spinner-third fa-spin"></i> &nbsp;<span>SENDING</span>').attr('disabled', true);
    axios
      .post('/admin/orders/'+ orderID +'/send-mp-email', {
        orderID: orderID
      })
      .then(function (res) {
        if (res.data == 'OK') {
          alert("MP Email sent");
        }

        $el.html('<i class="fa fa-envelope"></i> &nbsp;<span>RESEND MP EMAIL</span>').attr('disabled', false);
      })
      .catch(function (err) {
        alert("Fail to send email. Please try again");
        $el.html(buttonText);
      })
  })
</script>
@endsection
