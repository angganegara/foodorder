@extends('print', ['title' => 'KITCHEN SCHEDULE | Motion Cafe Bali'])

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
          <div class="schedule--name"><i class="far fa-user"></i> {{ $sc->name }} {{ $sc->order->gender ? "({$sc->order->gender})" : '' }}</div>
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
          @if ($sc->order->comments != "")
            <div class="schedule--comments">
              <span>Comments</span>
              <span>{{ $sc->order->comments }}</span>
            </div>
          @endif
        </div>
      @endforeach

    </div>
  </div>
</div>
@endsection
