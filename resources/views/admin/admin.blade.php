@extends('admin')

@section('admin')

<section class="admin {{ Request::is('admin/orders/schedule') || Request::is('admin/orders/kitchen') ? 'is-schedule' : '' }}">

  @include('admin.sidebar')
  @yield('content')

</section>

@endsection
