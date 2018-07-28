<sidebar class="sidebar">
  <a href="javascript:" title="" class="logo"><img src="/images/M.jpg" alt="" /></a>

  <ul>
    <li class="single"><a href="/admin" title="">Dashboard</a></li>
    <li class="parent"><i class="fal fa-angle-down"></i> Order</li>
    <li class="children"><a href="/admin/orders" title="">View Orders</a></li>
    <li class="children"><a href="/admin/orders/schedule" title="" target="_blank">Schedule</a></li>
    <li class="parent"><i class="fal fa-angle-down"></i> Partner</li>
    <li class="children"><a href="/admin/partners/report" title="" {!! Request::is('admin/partners/report*') ? 'class="active"' : '' !!}>Monthly Report</a></li>
    <li class="children"><a href="/admin/partners" title="">View Partners</a></li>
    <li class="children"><a href="/admin/partners/new" title="">Add new Partner</a></li>
    <li class="parent"><i class="fal fa-angle-down"></i> Coupon</li>
    <li class="children"><a href="/admin/coupons" title="">View Coupons</a></li>
    <li class="children"><a href="/admin/coupons/new" title="">Add new Coupon</a></li>
    <li class="single"><a href="/auth/logout" title="">Logout</a></li>
  </ul>
</sidebar>
