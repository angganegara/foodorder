@extends('admin.admin')

@section('content')
<div class="main-content no-overflow">
  <nav class="breadcrumb has-arrow-separator no-border" aria-label="breadcrumbs">
    <ul>
      <li><a href="/admin">Admin</a></li>
      <li class="is-active"><a href="#">Manage Meal Plans</a></li>
    </ul>
  </nav>

  <div class="body" id="mp-app"></div>
</div>

<script src="{{ asset('js/mealplans.js') }}"></script>
@endsection
