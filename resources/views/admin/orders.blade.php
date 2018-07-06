@extends('admin.admin')

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
        <th>Phone</th>
        <th>Referral</th>
        <th>Payment methods</th>
        <th>Status</th>
        <th></th>
      </tr>
      @foreach ($orders as $index => $order)
        <tr>
          <td><a href="/admin/orders/{{ $order->order_number }}/{{ $order->id }}" title=""><b>{{ $order->order_number }}</b></a></td>
          <td>{{ $order->date }}</td>
          <td><a href="mailto:{{ $order->email }}" target="_blank"><b>{{ $order->name }}</b></a></td>
          <td>{{ $order->phone }}</td>
          <td style="text-transform: uppercase">{{ $order->partner->name }}</td>
          <td>{{ $order->payment_formatted }}</td>
          <td><a title="" class="pill status">{{ $order->order_status }}</a></td>
          <td class="tools-wrapper">
            <a href="javascript:"><i class="far fa-cog"></i></a>
            <div class="tools">
              <a href="/admin/orders/{{ $order->id }}">View</a>
              <a href="#" title="" class="tools-delete">Delete</a>
            </div>
          </td>
        </tr>
      @endforeach
    </table>

    {{ $orders->links() }}
  </div>
</div>
@endsection
