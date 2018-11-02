@extends('admin.admin')

@section('content')
<div class="main-content schedule-parent">
  <div class="body">
    <h1>
      <a href="/admin/orders/kitchen?date={{ $yesterday }}" title="" class="schedule-nav"><i class="far fa-arrow-left"></i></a>
      SCHEDULE {{ $today->format('d M Y') }}
      <a href="/admin/orders/kitchen?date={{ $tomorrow }}" title="" class="schedule-nav"><i class="far fa-arrow-right"></i></a>
    </h1>

    <div class="schedule-wrapper schedule">

      @foreach ($schedules as $sc)
        <div class="schedule--card">
          <div class="schedule--name"><i class="far fa-user"></i> {{ $sc->name }}</div>
          <div class="schedule--meals">
            <span>MEALS</span>
            {!! $sc->meals !!}
          </div>
          @if ($sc->snacks)
            <div class="schedule--snacks">
              <span>Snacks</span>
              <span>{{ $sc->snacks }}</span>
            </div>
          @endif
        </div>
      @endforeach

    </div>
  </div>
</div>
@endsection
