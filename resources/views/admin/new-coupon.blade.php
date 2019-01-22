@extends('admin.admin', ['title' => 'NEW COUPON | Motion Cafe Bali | Admin'])

@section('content')
<div class="main-content">
  <nav class="breadcrumb has-arrow-separator" aria-label="breadcrumbs">
    <ul>
      <li><a href="#">Admin</a></li>
      <li><a href="/admin/coupons">Coupons</a></li>
      <li class="is-active"><a href="#">New Coupon</a></li>
    </ul>
  </nav>

  <div class="body">
    <h1>Add new coupon</h1>
    <div id="coupon-app"></div>
  </div>
</div>

<script src="{{ asset('js/coupon.js') }}"></script>
@endsection
