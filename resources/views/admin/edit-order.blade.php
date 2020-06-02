@extends('admin', ['title' => 'EDIT MP ORDER | Motion Cafe Bali | Admin'])

@section('admin')
<div id="order-app"></div>

<?php
$json = json_encode($order);
?>
<script>
var ACTION = 'EDIT';
var USER = '{{ Auth::user()->username }}';
var ORDER = <?php echo $json; ?>;
</script>
<script src="{{ asset('js/neworder.js?'. date('Ymdh')) }}"></script>
@endsection
