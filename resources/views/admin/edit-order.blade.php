@extends('admin')

@section('admin')
<div id="order-app"></div>

<script>
var ACTION = 'EDIT';
var ORDER = '<?php echo json_encode($order); ?>';
</script>
<script src="{{ asset('js/neworder.js') }}"></script>
@endsection
