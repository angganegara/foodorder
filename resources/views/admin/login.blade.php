@extends('admin')

@section('login')
<section class="login">
  <div class="login-wrap">
    <form action="/auth/login" method="post">
      <div class="field">
        <label class="label">Username</label>
        <div class="control has-icons-left has-icons-right">
          <input class="input" type="text" name="username" placeholder="Username" />
          <span class="icon is-small is-left">
            <i class="fas fa-user"></i>
          </span>
        </div>
      </div>
      <div class="field">
        <label class="label">Password</label>
        <div class="control has-icons-left has-icons-right">
          <input class="input" type="password" name="password" placeholder="password" />
          <span class="icon is-small is-left">
            <i class="fas fa-lock"></i>
          </span>
        </div>
      </div>
      {{ csrf_field() }}
      <br />
      <div class="field">
        <div class="control">
          <button class="button is-link">Login</button>
        </div>
      </div>
    </form>
  </div>
</section>
@endsection
