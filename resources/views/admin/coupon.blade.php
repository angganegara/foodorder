@extends('admin.admin', ['title' => 'EDIT COUPON | Motion Cafe Bali | Admin'])

@section('content')
<div class="main-content">
  <nav class="breadcrumb has-arrow-separator" aria-label="breadcrumbs">
    <ul>
      <li><a href="#">Admin</a></li>
      <li><a href="/admin/coupons">Coupons</a></li>
      <li class="is-active"><a href="#">View Coupon</a></li>
    </ul>
  </nav>

  <div class="body">
    <h1>coupon {{ $coupon['code'] }}</h1>
    <div id="coupon-app"></div>
  </div>
</div>

<script src="{{ asset('js/coupon.js') }}"></script>
@endsection
