@extends('admin.admin', ['title' => 'RECOMMENDATION REPORT | Motion Cafe Bali | Admin'])

@section('content')
<div class="main-content">
  <nav class="breadcrumb has-arrow-separator" aria-label="breadcrumbs">
    <ul>
      <li><a href="#">Admin</a></li>
      <li><a href="/admin/orders">Orders</a></li>
      <li class="is-active"><a href="#">Recommendation</a></li>
    </ul>
  </nav>

  <div class="body">
    <h1>view recommendation report</h1>
    <div id="recommendation-app"></div>
  </div>
</div>

<script src="{{ asset('js/recommendation.js') }}"></script>
@endsection
