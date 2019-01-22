@extends('admin.admin', ['title' => 'NEW PARTNER | Motion Cafe Bali | Admin'])

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
    <h1>Adding new partner</h1>
    <div class="inner">

      <form action="/admin/partners/new" method="post" id="form">
        {!! csrf_field() !!}
        <div class="columns form-inputs is-multiline">

          <div class="column is-half">
            <label class="pt-label">
              Name
              <input class="pt-input pt-fill" type="text" name="name" placeholder="Partner Name" />
            </label>
          </div>
          <div class="column is-half">
            <label class="pt-label">
              Domain
              <input class="pt-input pt-fill" type="text" name="domain" placeholder="Partner domain" />
            </label>
          </div>

          <div class="column is-half">
            <label class="pt-label">
              Station Name
              <input class="pt-input pt-fill" type="text" name="station" placeholder="Station name" />
            </label>
          </div>
          <div class="column is-half">
            <label class="pt-label">
              Commission <span class="text-muted">(in percent)</span>
              <input class="pt-input pt-fill" type="text" name="profit" placeholder="Enter number only without percent" />
            </label>
          </div>

          <div class="column is-half">
            <label class="pt-label">
              Google Map address
              <textarea class="pt-input pt-fill" name="google_map" dir="auto" rows="5" placeholder="Can be left blank"></textarea>
            </label>
          </div>
          <div class="column is-half">
            <label class="pt-label">
              Email recipient list (BCC)
              <textarea class="pt-input pt-fill" name="bcc" dir="auto" rows="5" placeholder="separate with comma and space. for example: recipient@domain.com, recipient2@domain.com"></textarea>
            </label>
          </div>

          <div class="column is-full">
            <label class="custom-label">Always Visible</label>
            <label class="pt-control pt-switch">
              <input type="checkbox" name="always_visible" />
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
