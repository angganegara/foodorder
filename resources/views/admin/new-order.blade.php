@extends('admin', ['title' => 'NEW MP ORDER | Motion Cafe Bali | Admin'])

@section('admin')
<div id="order-app"></div>

<script>var ACTION = 'NEW';</script>
<script src="{{ asset('js/neworder.js') }}"></script>
@endsection
