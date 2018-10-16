@extends('admin.admin')

@section('content')
<div class="main-content no-overflow">
  <nav class="breadcrumb has-arrow-separator no-border" aria-label="breadcrumbs">
    <ul>
      <li><a href="/admin">Admin</a></li>
      <li class="is-active"><a href="#">Create New Order</a></li>
    </ul>
  </nav>

  <div class="body" id="order-app"></div>
</div>

<script src="{{ asset('js/neworder.js') }}"></script>
@endsection
