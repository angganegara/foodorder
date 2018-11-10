@extends('print')

@section('content')
<div class="main">
  <h1>
    <a href="/kitchen/{{ request()->key }}?date={{ $yesterday }}" title="" class="schedule-nav"><i class="far fa-arrow-left"></i></a>
    {{ $today->format('d M Y') }}
    <a href="/kitchen/{{ request()->key }}?date={{ $tomorrow }}" title="" class="schedule-nav"><i class="far fa-arrow-right"></i></a>
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
@endsection