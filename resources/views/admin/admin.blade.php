@extends('admin')

@section('admin')

<section class="admin">

  @include('admin.sidebar')
  @yield('content')

</section>

@endsection
