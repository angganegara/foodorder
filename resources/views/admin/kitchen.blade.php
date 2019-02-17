@extends('print', ['title' => 'KITCHEN SCHEDULE | Motion Cafe Bali'])

@section('content')
<div class="main-content schedule-parent">
  <div class="body">
    <h1>
      <a href="/admin/orders/kitchen?date={{ $yesterday }}" title="" class="schedule-nav"><i class="far fa-arrow-left"></i></a>
      KITCHEN SCHEDULE ({{ $today->format('l d F Y') }})
      <a href="/admin/orders/kitchen?date={{ $tomorrow }}" title="" class="schedule-nav"><i class="far fa-arrow-right"></i></a>
    </h1>

    <table cellpadding="0" cellspacing="0">
      <tr>
        <th width="20%">Name</th>
        <th width="15%">Menu</th>
        <th width="10%">Eco</th>
        <th width="10%">Comments</th>
        <th width="45%">Description</th>
      </tr>
      @foreach ($result as $md5)
        @foreach ($md5 as $index => $sc)
          <?php $total = count($md5); ?>
          <tr>
            <td>{{ $sc['name'] }} {{ $sc['gender'] ? "({$sc['gender']})" : '' }}</td>
            <td>{{ $sc['menu'] }}</td>
            <td>{{ $sc['eco'] > 0 ? "YES" : "NO" }}</td>
            <td>{{ $sc['comments'] }}</td>
            @if ($total > 1)
              @if ($index == 0)
                <td rowspan="{{ $total }}">
                  {!! $sc['meals'] !!}
                  {!! $sc['snacks'] ? '<hr />extra snacks : '. $sc['snacks'] : '' !!}
                </td>
              @endif
            @else
              <td>
                {!! $sc['meals'] !!}
                {!! $sc['snacks'] ? '<hr />extra snacks : '. $sc['snacks'] : '' !!}
              </td>
            @endif
          </tr>
        @endforeach
      @endforeach
    </table>

  </div>
</div>
@endsection
