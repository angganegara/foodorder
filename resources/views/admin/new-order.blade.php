@extends('admin', ['title' => 'NEW MP ORDER | Motion Cafe Bali | Admin'])

@section('admin')
<div id="order-app"></div>

<script>
var ACTION = 'NEW';
var USER = '{{ Auth::user()->username }}';
var ORDER = {};
</script>
<script src="{{ asset('js/neworder.js?'. date('Ymdh')) }}"></script>
@endsection
