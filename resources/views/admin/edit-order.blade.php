@extends('admin', ['title' => 'EDIT MP ORDER | Motion Cafe Bali | Admin'])

@section('admin')
<div id="order-app"></div>

<?php
$json = str_replace("'", "\'", json_encode($order));
$json = str_replace('\n', '', $json);
?>
<script>
var ACTION = 'EDIT';
var ORDER = '<?php echo $json; ?>';
</script>
<script src="{{ asset('js/neworder.js') }}"></script>
@endsection
