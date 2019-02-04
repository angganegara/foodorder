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
    <h1>view orders</h1>
    <table width="100%" class="tbl">
      <tr>
        <th>Order</th>
        <th>Date</th>
        <th>Name</th>
        <th class="text-center">Payment</th>
        <th class="text-center">Total Amount</th>
        <th class="text-center">Open Amount</th>
        <th class="text-center">MP Email</th>
        <th class="text-center">Status</th>
        <th></th>
      </tr>
      @foreach ($orders as $index => $order)
        <tr>
          <td><a href="/admin/orders/{{ $order->order_number }}/{{ $order->id }}" title=""><b>{{ $order->order_number }}</b></a></td>
          <td>{{ $order->date }}</td>
          <td>
            @if ($order->email)
              <a href="mailto:{{ $order->email }}" target="_blank"><b>{{ $order->name }}</b></a>
            @else
              <a href="#" target="_blank"><b>{{ $order->name }}</b></a>
            @endif
          </td>
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
    </table>

    {{ $orders->links() }}
  </div>
</div>
@endsection
