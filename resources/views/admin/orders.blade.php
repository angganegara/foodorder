@extends('admin.admin', ['title' => 'ORDERS | Motion Cafe Bali | Admin'])

@section('content')
<div class="main-content">
  <nav class="breadcrumb has-arrow-separator" aria-label="breadcrumbs">
    <ul>
      <li><a href="#">Admin</a></li>
      <li class="is-active"><a href="#">Orders</a></li>
    </ul>
  </nav>

  <div class="body">
    @if (request()->has('keyword'))
      <h1>Search result for {{ request('keyword') }}</h1>
    @endif
    @if (request()->has('date'))
      <h1>view orders from {{ $dates }}</h1>
    @endif
    @if ( ! request()->has('date') && ! request()->has('keyword') )
      <h1>view orders</h1>
    @endif
    <div class="tools">
      <div class="tools-search">
        <form action="{{ request()->url() }}" method="get">
          <div class="pt-input-group pt-round">
            <span class="pt-icon pt-icon-search"></span>
            <input type="text" class="pt-input" placeholder="Search keywords" name="keyword" value="{{ request()->has('keyword') ? request('keyword') : '' }}" />
            <button class="pt-button pt-minimal pt-intent-primary pt-icon-arrow-right"></button>
          </div>
        </form>
      </div>
      <div class="tools-date">
        <form action="{{ request()->url() }}" method="get">
          <div class="pt-input-group">
            <span class="pt-icon pt-icon-calendar"></span>
            <input
              type="text"
              name="date"
              autocomplete="off"
              value="{{ request('date') }}"
              data-date-format="dd-mm-yyyy"
              class="pt-input datepicker-here"
              placeholder="Select order dates"
              data-language="en"
              data-range="true"
              data-position="bottom right"
              data-multiple-dates-separator=" - "
              data-auto-close="true"
            />
            <button class="pt-button pt-minimal pt-intent-primary pt-icon-arrow-right"></button>
          </div>
        </form>
      </div>
    </div>
    <table width="100%" class="tbl">
      <tr>
        <th>Name</th>
        <th>Period</th>
        <th>Date</th>
        <th class="text-center">Payment</th>
        <th class="text-center">Total Amount</th>
        <th class="text-center">Open Amount</th>
        <th class="text-center">Meal Plan</th>
        <th class="text-center">MP Email</th>
        <th class="text-center">Status</th>
        <th></th>
      </tr>
      @foreach ($orders as $index => $order)
        <tr>
          <td><a href="/admin/orders/{{ $order->order_number }}/{{ $order->id }}" title="" class="order-name"><b>{{ $order->name }}</b></a></td>
          <td>
            @if ($order->ordercart->count() > 0)
              {{ date('j M', strtotime($order->ordercart[0]->start_date)) .' - '. date('j M y', strtotime($order->ordercart[0]->end_date)) }}
            @else
              <span class="order-corrupted"><i class="fa fa-exclamation-triangle"></i> CORRUPTED</span>
            @endif
          </td>
          <td>{{ $order->date }}</td>
          <td class="text-center">
            <span class="pill-{{ $order->payment_formatted }}">
              @if ($order->payment_formatted == 'cash')
                <i class="far fa-dollar-sign"></i>
              @elseif ($order->payment_formatted == 'Paypal')
                <i class="fab fa-paypal"></i>
              @elseif ($order->payment_formatted == 'bank_transfer')
                <i class="far fa-exchange"></i>
              @endif
              {{ $order->payment_formatted }}
            </span>
          </td>
          <td class="text-center">IDR <b>{{ number_format($order->total) }}</b></td>
          <td class="text-center">{!! $order->openAmount() > 0 ? 'IDR <b>'. number_format($order->openAmount()) .'</b>' : '-' !!}</td>
          <td class="text-center">
            {!! $order->backend_order ? '<i class="fal fa-check is-success"></i>' : '<i class="fal fa-times is-danger"></i>' !!}
          </td>
          <td class="text-center">
            {!! $order->menu_email_sent ? '<i class="fal fa-check is-success"></i>' : '<i class="fal fa-times is-danger"></i>' !!}
          </td>
          <td class="text-center"><a title="" class="pill status">{{ strtoupper($order->order_status) }}</a></td>
          <td class="actions">
            <a href="/admin/orders/{{ $order->order_number }}/{{ $order->id }}"><i class="far fa-eye"></i></a>
            <a href="/admin/orders/{{ $order->id }}/edit" target="_blank"><i class="far fa-pencil"></i></a>
            <a href="/admin/orders/{{ $order->order_number }}/delete" onClick="return window.confirm('Are you sure?')" title=""><i class="far fa-trash-alt"></i></a>
          </td>
        </tr>
      @endforeach
      <tr>
        <td colspan="4"></td>
        <td class="text-center">IDR <b>{{ number_format($total_amount, 0) }}</b></td>
        <td class="text-center">IDR <b>{{ number_format($total_open_amount, 0) }}</b></td>
        <td colspan="4"></td>
      </tr>
    </table>

    {{ $orders->links() }}
  </div>
</div>
@endsection
