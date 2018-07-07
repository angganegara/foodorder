@extends('admin')

@section('admin')

<section class="admin {{ Request::is('admin/orders/schedule') ? 'is-schedule' : '' }}">

  @include('admin.sidebar')
  @yield('content')

</section>

@endsection
