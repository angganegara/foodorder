@extends('admin.admin')

@section('content')
<div class="main-content">
  <div class="body">
    <h1>{{ $today->format('d F Y') }}</h1>

    <div class="schedule-wrapper schedule">

      @foreach ($schedules as $sc)
        <div class="schedule--card">
          <div class="schedule--name"><i class="far fa-user"></i> {{ $sc->name }}</div>
          <div class="schedule--meals">
            <span>MEALS</span>
            {{ $sc->meals }}
          </div>
          @if ($sc->snacks)
            <div class="schedule--snacks">
              <span>Snacks</span>
              <span>{{ $sc->snacks }}</span>
            </div>
          @endif
          <div class="schedule--station">
            <span>{{ $sc->station_id ? 'Pickup at' : 'Deliver to' }}</span>
            <span>{{ $sc->station }}</span>
          </div>
        </div>
      @endforeach

    </div>
  </div>
</div>
@endsection
