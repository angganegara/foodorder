@extends('admin.admin', ['title' => 'EDIT PARTNERS | Motion Cafe Bali | Admin'])

@section('content')
<div class="main-content">
  <nav class="breadcrumb has-arrow-separator" aria-label="breadcrumbs">
    <ul>
      <li><a href="#">Admin</a></li>
      <li><a href="/admin/partners">Partners</a></li>
      <li class="is-active"><a href="#">View Partner</a></li>
    </ul>
  </nav>

  <div class="body">
    <h1>Viewing {{ $partner->name }}</h1>
    <div class="inner">

      @if (session('status') == 'success')
        <div class="pt-callout pt-intent-success pt-callout-icon mb">
          <svg class="pt-icon" data-icon="tick" width="20" height="20" viewBox="0 0 20 20"><title>tick</title><path d="M17 4c-.28 0-.53.11-.71.29L7 13.59 3.71 10.3A.965.965 0 0 0 3 10a1.003 1.003 0 0 0-.71 1.71l4 4c.18.18.43.29.71.29s.53-.11.71-.29l10-10A1.003 1.003 0 0 0 17 4z" fill-rule="evenodd"></path></svg>
          Partner Info updated
        </div>
      @endif

      <form action="/admin/partners/{{ $partner->id }}" method="post" id="form">
        {!! csrf_field() !!}
        <div class="columns form-inputs is-multiline">

          <div class="column is-half">
            <label class="pt-label">
              Name
              <input class="pt-input pt-fill" type="text" name="name" placeholder="Name" value="{{ $partner->name }}" />
            </label>
          </div>
          <div class="column is-half">
            <label class="pt-label">
              Domain
              <input class="pt-input pt-fill" type="text" name="domain" placeholder="Domain" value="{{ $partner->domain }}" />
            </label>
          </div>

          <div class="column is-half">
            <label class="pt-label">
              Station Name
              <input class="pt-input pt-fill" type="text" name="station" placeholder="Station" value="{{ $partner->station }}" />
            </label>
          </div>
          <div class="column is-half">
            <label class="pt-label">
              Commission <span class="text-muted">(in percent)</span>
              <input class="pt-input pt-fill" type="text" name="profit" placeholder="Commission" value="{{ $partner->profit }}" />
            </label>
          </div>

          <div class="column is-half">
            <label class="pt-label">
              Google Map address
              <textarea class="pt-input pt-fill" name="google_map" dir="auto" rows="5">{{ $partner->google_map }}</textarea>
            </label>
          </div>
          <div class="column is-half">
            <label class="pt-label">
              Email recipient list (BCC)
              <textarea class="pt-input pt-fill" name="bcc" dir="auto" rows="5">{{ $partner->bcc }}</textarea>
            </label>
            <span class="help">Separate with comma and space for each recipient</span>
          </div>

          <div class="column is-full">
            <label class="custom-label">Always Visible</label>
            <label class="pt-control pt-switch">
              <input type="checkbox" name="always_visible" {{ $partner->always_visible ? 'checked' : '' }} />
              <span class="pt-control-indicator"></span>
              On
            </label>
            <span class="help">Turning this on will always show this station no matter what the domain is</span>
            <span class="help">Turning this off will only show this station in the domain its assigned to</span>
          </div>

        </div>
      </form>

      <div class="save-button">
        <button form="form" type="submit" class="pt-button pt-icon-tick pt-intent-primary">SUBMIT</button>
      </div>

    </div>
  </div>
</div>
@endsection
