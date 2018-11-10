@extends('print')

@section('content')
<div class="main">
  <h1>
    <a href="/delivery/{{ request()->key }}?date={{ $yesterday }}" title="" class="schedule-nav"><i class="far fa-arrow-left"></i></a>
    {{ $today->format('d M Y') }}
    <a href="/delivery/{{ request()->key }}?date={{ $tomorrow }}" title="" class="schedule-nav"><i class="far fa-arrow-right"></i></a>
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
            <span>{{ $sc->snacks }}</span>
          </div>
        @endif
        <div class="schedule--delivery">
          <span>Delivery Address</span>
          {{ $sc->station }}
        </div>
        <a
          href="javascript:"
          data-id="{{ $sc->id }}"
          onClick="return window.confirm('Complete this delivery?')"
          title=""
          class="complete-delivery {{ $sc->is_delivered ? 'completed' : '' }}"
        >
          @if ($sc->is_delivered)
            <span>delivered <i class="fal fa-check"></i></span>
          @else
            <span>complete delivery <i class="fal fa-check"></i></span>
          @endif
        </a>
      </div>
    @endforeach

  </div>

  <div class="print">
    <a href="javascript:" class="btn" onClick="window.print()">PRINT PAGE</a>
  </div>

</div>
@endsection

@section('scripts')
<script>
  $('.complete-delivery').click(function (e) {
    e.preventDefault();
    var $ele = $(this);
    var id = $ele.data('id');
    $.ajax({
      type: "POST",
      url: "/delivery/{{ request()->key }}{{ request()->has('date') ? '?date='. request()->date : '' }}",
      data: {
        id: id,
        _token: "{{ csrf_token() }}"
      },
      beforeSend: function () {
        $ele.html('<span><i class="far fa-spinner-third fa-spin"></i></span>')
      }
    }).done(function (res) {
      if (res == 'OK') {
        $ele.html('<span><i class="far fa-check"></i></span>');
        setTimeout(function () {
          $ele
            .html('<span>delivered <i class="far fa-check"></i></span>')
            .addClass('completed');
        }, 1500);
      }
    })
  })
</script>
@endsection
