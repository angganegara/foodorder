@extends('admin.admin')

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
        <th></th>
      </tr>
      @foreach ($partners as $index => $partner)
        <tr>
          <td><b>{{ $partner->name }}</b></td>
          <td><a href="//{{ $partner->domain }}" target="_blank">{{ $partner->domain }}</a></td>
          <td>{{ $partner->station }}</td>
          <td class="tools-wrapper">
            <a href="javascript:"><i class="far fa-cog"></i></a>
            <div class="tools">
              <a href="/admin/partners/{{ $partner->id }}">View</a>
              <a href="#" title="" class="tools-delete">Delete</a>
            </div>
          </td>
        </tr>
      @endforeach
    </table>

  </div>
</div>
@endsection
