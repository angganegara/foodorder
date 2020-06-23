<div style="line-height: 150%; font-family: Monospace; font-size: 14px;">
  <p><b>new error log</b></p>
  <p>
    <b>IP</b>: {{ $err->ip_address }}<br />
    <b>message</b>: {{ $err->message }}<br />
    <b>request data</b>:
  </p>
  <div style="padding: 1rem; background-color: #e5e5e5; border: 1px solid #eaeaea; word-wrap: break-word;">{{ $err->request }}</div>
  <p>Log was created on <b>{{ $err->created_at }}</b></p>
</div>
