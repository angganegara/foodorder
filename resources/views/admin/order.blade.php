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
            <div class="columns form-row">
              <div class="column is-half">
                <label>Comments</label>
                {!! $order->comments != '' && $order->comments != NULL ? $order->comments : '<em>Guest did not put a comments</em>' !!}
              </div>
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
              @else
                <div class="column is-half">
                  <label>Open amount</label>
                  {!! $order->openAmount() > 0 ? 'IDR <b>'. number_format($order->openAmount(), 0) .'</b>' : '0' !!}
                </div>
              @endif
            </div>
            @if ($order->payment == 'cash')
            <div class="columns form-row">
              <div class="column is-half">
                <label class="pt-label">Date</label>
                <input
                  type="text"
                  name="payment_date"
                  autocomplete="off"
                  class="pt-input pt-fill datepicker-here"
                  data-language="en"
                  data-date-format="dd/mm/yyyy"
                  data-auto-close="true"
                  readonly
                  value="{{ $order->cash_paid_date ? date('d/m/Y', strtotime($order->cash_paid_date)) : '' }}"
                />
              </div>
              <div class="column is-half">
                <label class="pt-label">Amount paid</label>
                <input type="text" name="amount_paid" class="pt-input pt-fill" value="{{ number_format($order->cash_paid) }}">
              </div>
            </div>
            <div class="columns form-row is-multiline">
              <div class="column is-12">
                <label class="pt-label">Payment Comment</label>
                <textarea name="payment_comment" class="pt-input pt-fill" rows="5" placeholder="Enter payment comment here">{{ $order->payment_comment }}</textarea>
                <div class="update-payment-button">
                  <a href="javascript:" title="" data-id="{{ $order->id }}" data-ordernumber="{{ $order->order_number }}"><span>UPDATE</span></a>
                </div>
              </div>
            </div>
            @endif
          </div>
        </div>

        <div class="form-section">
          <h2>Extra Payment</h2>
          <div class="form-inner">
            <table class="pt-html-table pt-html-table-striped" width="100%">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th class="text-right">Amount</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                @foreach ($order->extra_payment as $extra)
                <tr class="extra-{{ $extra->id }}">
                  <td>{{ date('d M Y', strtotime($extra->date)) }}</td>
                  <td>{{ $extra->description }}</td>
                  <td class="text-right">{{ number_format($extra->amount, 0) }} IDR</td>
                  <td class="text-center">
                    <a href="javascript:" class="delete-extra" title="" data-id="{{ $extra->id }}" data-order-id="{{ $order->id }}"><i class="fal fa-times"></i></a>
                  </td>
                </tr>
                @endforeach
                <tr>
                  <td>
                    <input
                      type="text"
                      name="extra_date"
                      autocomplete="off"
                      class="pt-input pt-fill datepicker-here"
                      data-language="en"
                      data-date-format="dd/mm/yyyy"
                      data-auto-close="true"
                      data-position="top left"
                      readonly
                    />
                  </td>
                  <td>
                    <input type="text" class="pt-input pt-fill" name="extra_description" placeholder="description" autocomplete="off" />
                  </td>
                  <td>
                    <input type="text" class="pt-input pt-fill" name="extra_amount" placeholder="amount" autocomplete="off" />
                  </td>
                  <td><a href="javascript:" title="" class="extra-new"><i class="fal fa-plus"></i></a></td>
                </tr>
              </tbody>
            </table>
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
                  <div class="cart-dates">QUANTITY: {{ $cart->qty }}</div>
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
              <td width="70%">subtotal</td>
              <td width="30%">{{ number_format($order->subtotal, 0) }} IDR</td>
            </tr>
            @if ($order->coupon_value > 0)
              <tr>
                <td>discount @if ($order->coupon_code)(code: {{ $order->coupon_code }})@endif </td>
                <td>- {{ number_format($order->coupon_value) }} IDR</td>
              </tr>
            @endif
            <tr>
              <td><b>total</b></td>
              <td>{{ number_format($order->total, 0) }} IDR</td>
            </tr>
            @if ($order->payment == 'cash')
              <tr>
                <td>Amount Paid</td>
                <td>{{ number_format($order->cash_paid) }} IDR</td>
              </tr>
              @if ($order->extra_payment()->count() > 0)
                <tr>
                  <td>EXTRA PAYMENT</td>
                  <td>{{ number_format($order->total_extra(), 0) }} IDR</td>
                </tr>
              @endif
              <tr>
                <td>Open Amount</td>
                <td>{{ number_format($order->openAmount()) }} IDR</td>
              </tr>
            @endif
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
  $('input[name="amount_paid"], input[name="extra_amount"]').on('keyup', function (e) {
    var val = e.target.value;
    var isMinus = false;
    if (val != "" && val.length > 3 ) {
        if (val.search('-') !== -1) {
            val = val.replace('-', '');
            isMinus = true;
        }
        val = parseInt(val.replace(/\,/g, ''));

        if (isMinus) {
            val = val - (val * 2);
        }
        $(this).val(parseInt(val).toLocaleString('en-US'))
    }
  })
  $('.mp-email').click(function (e) {
    e.preventDefault();
    var $el = $(this);
    var buttonText = $el.html();

    if ( ! window.confirm('Send MP Email?') ) {
      return false;
    }

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
  });

  $('a.extra-new').click(function (e) {
    var date = $('input[name="extra_date"]').val();
    var description = $('input[name="extra_description"]').val();
    var amount = $('input[name="extra_amount"]').val();

    if (date == '' || description == '' || amount == '') {
      window.alert("Please enter all fields");
      return false;
    }

    axios
      .post('/admin/orders/'+ orderID +'/new-extra-payment', {
        date: date,
        description: description,
        amount: amount
      })
      .then(function (res) {
        if (res.data == 'OK') {
          window.location = window.location.href +'?'+ Math.random();
          return false;
        }
      })
  });

  $('a.delete-extra').click(function (e) {
    e.preventDefault();
    var id = $(this).data('id');

    if (window.confirm('Delete this extra payment ?')) {
      axios
        .post('/admin/orders/'+ orderID +'/delete-extra-payment', {
          id: id
        })
        .then(function (res) {
          if (res.data == 'OK') {
            window.location = window.location.href +'?'+ Math.random();
            return false;
          }
        })
    }

    return false;
  })

  $('.update-payment-button a').click(function (e) {
    var $this = $(this);
    var id = $this.data('id');
    var ordernumber = $this.data('ordernumber');
    var amount = $('input[name="amount_paid"]').val();
    var comment = $('textarea[name="payment_comment"]').val();
    var date = $('input[name="payment_date"]').val();

    if (parseInt(amount) <= 0 || amount == '') {
      alert('Please enter the amount');
      return false;
    }

    if (date == '') {
      alert('Please enter date of payment');
      return false;
    }

    amount = parseInt(amount.replace(/\,/g, ''));

    $this.html('<span><i class="fal fa-spinner-third fa-spin"></i></span>').attr('disabled', true);
    axios
      .post('/admin/orders/'+ id +'/update-payment', {
        amount: amount,
        comment: comment,
        date: date
      })
      .then(function (res) {
        if (res.data == 'OK') {
          alert("Payment updated");
          location.href = "/admin/orders/" + ordernumber + "/" + id;
        }

        $this.html('<span>UPDATE</span>').attr('disabled', false);
      })
      .catch(function (err) {
        alert("Fail updating. Please try again.");
        $this.html('<span>UPDATE</span>').attr('disabled', false);
      })
  })
</script>
@endsection
