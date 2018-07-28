@extends('admin.admin')

@section('content')
<div class="main-content">
  <nav class="breadcrumb has-arrow-separator" aria-label="breadcrumbs">
    <ul>
      <li><a href="#">Admin</a></li>
      <li><a href="/admin/partners">Partners</a></li>
      <li class="is-active"><a href="#">Monthly Report</a></li>
    </ul>
  </nav>

  <div class="body">
    <h1>view report</h1>
    <div id="report-app"></div>
  </div>
</div>

<script>
var partners = '{!! json_encode($partners) !!}';
</script>
<script src="{{ asset('js/report.js') }}"></script>
@endsection
