@extends('print', ['title' => 'KITCHEN SCHEDULE | Motion Meal Plans'])

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
        <div class="schedule--name">{{ $sc->name }}</div>
        <div class="schedule--meals">
          {!! $sc->meals !!}
        </div>
        @if ($sc->snacks)
          <div class="schedule--snacks">
            <span>Snacks</span>
            {{ $sc->snacks }}
          </div>
        @endif
      </div>
    @endforeach

  </div>

  <div class="print">
    <a href="javascript:" class="btn" onClick="window.print()">PRINT PAGE</a>
  </div>

</div>
@endsection
