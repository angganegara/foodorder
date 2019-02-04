@extends('print', ['title' => 'DELIVERY SCHEDULE | Motion Cafe Bali'])

@section('content')
<div class="main-content schedule-parent">
  <div class="body">
    <h1>
      <a href="/admin/orders/schedule?date={{ $yesterday }}" title="" class="schedule-nav"><i class="far fa-arrow-left"></i></a>
      DELIVERY SCHEDULE {{ $today->format('d M Y') }}
      <a href="/admin/orders/schedule?date={{ $tomorrow }}" title="" class="schedule-nav"><i class="far fa-arrow-right"></i></a>
    </h1>

    <table cellpadding="0" cellspacing="0">
      <tr>
        <th width="25%">Name</th>
        <th width="15%">Menu</th>
        <th width="10%">Eco Pack</th>
        <th width="15%">Total</th>
        <th width="15%">Open</th>
        <th>Delivered to</th>
      </tr>
      @foreach ($result as $md5)
        @foreach ($md5 as $index => $sc)
          <?php $total = count($md5); ?>
          <tr>
            <td>{{ $sc['name'] }} {{ $sc['gender'] ? "({$sc['gender']})" : '' }}</td>
            <td>{{ $sc['menu'] }}</td>
            <td>{{ $sc['eco'] > 0 ? "YES" : "NO" }}</td>
            @if ($sc['payment'] == 'cash')
              <td>
                {{ $sc['payment'] == 'cash' ? 'IDR '. number_format($sc['total']) : '' }}
              </td>
              <td>
                {{ $sc['payment'] == 'cash' && $sc['open'] > 0 ? 'IDR '. number_format($sc['open']) : '' }}
              </td>
            @else
              <td colspan="2"></td>
            @endif
            @if ($total > 1)
              @if ($index == 0)
                <td rowspan="{{ $total }}">
                  {!! $sc['address'] !!}
                </td>
              @endif
            @else
              <td>
                {!! $sc['address'] !!}
              </td>
            @endif
          </tr>
        @endforeach
      @endforeach
    </table>
  </div>
</div>
@endsection
