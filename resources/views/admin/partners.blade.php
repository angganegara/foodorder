@extends('admin.admin', ['title' => 'VIEW PARTNERS | Motion Cafe Bali | Admin'])

@section('content')
<div class="main-content">
  <nav class="breadcrumb has-arrow-separator" aria-label="breadcrumbs">
    <ul>
      <li><a href="#">Admin</a></li>
      <li class="is-active"><a href="#">Partners</a></li>
    </ul>
  </nav>

  <div class="body">
    <h1>view partners</h1>
    <table width="100%" class="tbl">
      <tr>
        <th>Name</th>
        <th>Domain</th>
        <th>Station</th>
        <th>Profit</th>
        <th></th>
      </tr>
      @foreach ($partners as $index => $partner)
        <tr>
          <td><b>{{ $partner->name }}</b></td>
          <td><a href="//{{ $partner->domain }}" target="_blank">{{ $partner->domain }}</a></td>
          <td>{{ $partner->station }}</td>
          <td>{{ $partner->profit > 0 ? $partner->profit .'%' : '-' }}</td>
          <td class="actions">
            <a href="/admin/partners/{{ $partner->id }}"><i class="far fa-edit"></i></a>
            <a href="/admin/partners/{{ $partner->id }}/delete" onClick="return window.confirm('Are you sure?')" title=""><i class="far fa-trash-alt"></i></a>
          </td>
        </tr>
      @endforeach
    </table>

  </div>
</div>
@endsection
