@extends('admin.admin')

@section('content')
<div class="main-content">
  <nav class="breadcrumb has-arrow-separator" aria-label="breadcrumbs">
    <ul>
      <li><a href="#">Admin</a></li>
      <li class="is-active"><a href="#">Coupons</a></li>
    </ul>
  </nav>

  <div class="body">
    <h1>view coupons</h1>
    <table width="100%" class="tbl">
      <tr>
        <th>Code</th>
        <th>Start</th>
        <th>End</th>
        <th>Type</th>
        <th>Amount</th>
        <th></th>
      </tr>
      @foreach ($coupons as $index => $coupon)
        <tr>
          <td><b>{{ $coupon->code }}</b></td>
          <td>{{ $coupon->start }}</td>
          <td>{{ $coupon->end }}</td>
          <td><span class="discount-type">{{ $coupon->discount_type }}</span></td>
          <td>{{ $coupon->amount }}{{ $coupon->discount_type == 'percent' ? '%' : '' }}</td>
          <td class="actions">
            <a href="/admin/coupons/{{ $coupon->id }}"><i class="far fa-edit"></i></a>
            <a href="/admin/coupons/{{ $coupon->id }}/delete" onClick="return window.confirm('Are you sure?')" title=""><i class="far fa-trash-alt"></i></a>
          </td>
        </tr>
      @endforeach
    </table>

  </div>
</div>
@endsection
