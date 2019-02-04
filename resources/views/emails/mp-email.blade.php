<html>
<head>
  <title>Custom Package Confirmation</title>
</head>

<BODY style="margin: 0; padding: 0; width: 100%; background-color: #eee">

<table width="100%" align="center" valign="top" cellpadding="0" cellspacing="0">
  <tr>
    <td align="center" valign="top">
      <table width="100%" align="center" cellpadding="0" cellspacing="0">
        <tr>
          <td width="100%" style="background-color: #fff; border: 0 solid #ddd">
            <table width="100%" align="center" cellpadding="0" cellspacing="0" style="
              font-family: Arial, sans-serif; font-size: 12px;
              line-height: 140%; color: #222;">
              <tr>
                <td style="width: 36px;"><img src="{{ url('images/email-logo-small.jpg') }}" alt="" style="display: block;"/></td>
                <td valign="middle" style="
                  background-color: #b5e1ed; color: #222;
                  text-transform: uppercase; font-weight: bold;
                  padding: 15px 20px;
                  letter-spacing: 1px; font-size: 12px">
                  Motion Meal Plan - your menu
                </td>
              </tr>
            </table>
            <table width="100%" align="center" cellpadding="0" cellspacing="0" style="
              font-family: Arial, sans-serif; font-size: 12px;
              line-height: 140%; color: #222;">
              <tr>
                <td width="100%" colspan="2" valign="middle" style="padding: 20px; font-weight: bold;">
                  <p>Dear {{ $order->fname }} {{ $order->lname }}</p>
                  <p>please find below your detailed menu for your food order.</p>
                  <p>Enjoy smart eating!<br />Your Motion Team</p>
                </td>
              </tr>
              <tr>
                <td valign="middle" colspan="2" style="
                  background-color: #b5e1ed; color: #222;
                  text-transform: uppercase; font-weight: bold;
                  padding: 15px 20px;
                  letter-spacing: 1px; font-size: 12px">
                  order details
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tbody>
                      <?php $total = 0; ?>
                      @foreach ($order->ordercart as $key => $item) @if ($key !== 'total')
                        <tr>
                          <th width="70%" style="padding: 10px 20px;
                            font-size: 12px; text-transform: uppercase;
                            border-bottom: 1px solid #b5e1ed; color: #222;
                            background-color: #f3f3f3; text-align: left">
                            Items
                          </th>
                          <th width="5%" style="padding: 10px 20px;
                            font-size: 12px; text-transform: uppercase;
                            border-bottom: 1px solid #b5e1ed; color: #222;
                            background-color: #f3f3f3; text-align: center">
                            QTY
                          </th>
                          <th width="25%" style="padding: 10px 20px;
                            font-size: 12px; text-transform: uppercase;
                            border-bottom: 1px solid #b5e1ed; color: #222;
                            background-color: #f3f3f3; text-align: right">
                            Price
                          </th>
                        </tr>
                        <tr>
                          <td style="padding: 10px 20px 10px 20px; font-size: 12px; line-height: 150%;">
                            <strong>{{ $item['meals'] }}</strong>
                            <br />
                            <span>{{ $item['package'] == 1 ? '6-day package' : 'Single days' }} {!! $item['eco_price'] > 0 ? '- with Eco pack' : '' !!}</span>
                            <br />
                            <span>
                              {{ Carbon\Carbon::parse($item['start_date'])->format('D, M jS') }}
                              @if ($item['package'] == 1)
                                &mdash; {{ Carbon\Carbon::parse($item['end_date'])->format('D, M jS') }}
                              @endif
                            </span>
                            @if ($item['slimsunday'] == 1)<br /><span>With SlimSunday</span>@endif
                          </td>
                          <td style="padding: 10px 20px 10px 20px; font-size: 12px; text-align: center; line-height: 150%;">
                            <div class="qty-number">
                              <span>{{ $item['qty'] }}</span>
                            </div>
                          </td>
                          <td style="padding: 10px 20px 10px 20px; font-size: 12px; text-align: right; line-height: 150%;">
                            {{ number_format($item['subtotal'], 0) }} IDR
                          </td>
                        </tr>
                        @if ($item['snacks_price'] > 0)
                        <tr>
                          <td style="padding: 5px 20px; font-size: 12px; line-height: 150%;"><b>Snacks</b></td>
                          <td style="padding: 5px 20px; font-size: 12px; line-height: 150%;"></td>
                          <td style="padding: 5px 20px; font-size: 12px; line-height: 150%; text-align: right">
                            {{ number_format($item['snacks_price'], 0) }} IDR
                          </td>
                        </tr>
                        @endif
                        @if ($item['slimsunday_price'] > 0)
                        <tr>
                          <td style="padding: 5px 20px; font-size: 12px; line-height: 150%;"><b>Slim Sunday</b></td>
                          <td style="padding: 5px 20px; font-size: 12px; line-height: 150%;">1</td>
                          <td style="padding: 5px 20px; font-size: 12px; line-height: 150%; text-align: right">
                            {{ number_format($item['slimsunday_price'], 0) }} IDR
                          </td>
                        </tr>
                        @endif
                        @if ($item['eco_price'] > 0)
                        <tr>
                          <td style="padding: 5px 20px; font-size: 12px; line-height: 150%;"><b>ECO Pack</b></td>
                          <td style="padding: 5px 20px; font-size: 12px; line-height: 150%;"></td>
                          <td style="padding: 5px 20px; font-size: 12px; line-height: 150%; text-align: right">
                            {{ number_format($item['eco_price'], 0) }} IDR
                          </td>
                        </tr>
                        @endif
                        @if ($item['snacks_price'] > 0)
                        <tr>
                          <td style="padding: 5px 20px; font-size: 12px; line-height: 150%;"><b>Delivery</b></td>
                          <td style="padding: 5px 20px; font-size: 12px; line-height: 150%;"></td>
                          <td style="padding: 5px 20px; font-size: 12px; line-height: 150%; text-align: right">
                            {{ number_format($item['delivery_price'], 0) }} IDR
                          </td>
                        </tr>
                        @endif
                        <tr>
                          <td style="padding: 5px 20px 10px 20px; font-size: 12px; line-height: 150%;">&nbsp;</td>
                          <td style="padding: 5px 20px 10px 20px; font-size: 12px; line-height: 150%;"><b>SUBTOTAL</b></td>
                          <td style="padding: 5px 20px 10px 20px; font-size: 12px; line-height: 150%; text-align: right">
                            <b>{{ number_format($item['total_price'], 0) }} IDR</b>
                          </td>
                        </tr>
                        <tr>
                          <td colspan="3">
                            <table width="100%" cellpadding="0" cellspacing="0">
                              @foreach ($item['schedule'] as $sch)
                                <tr>
                                  <th colspan="2" style="#222;padding: 7px 20px; font-size: 12px; border-top: 1px solid #ddd;color: #222;
                                    border-bottom: 1px solid #f6f6f6; background-color: #b5e1ed; text-align: left">
                                    {{ Carbon\Carbon::parse($sch->date)->format('D, M jS') }}
                                    @if (($item['slimsunday'] == 1) && (Carbon\Carbon::parse($sch->date)->format('D') == "Sat"))
                                      (Include Slim Sunday)
                                    @endif
                                  </th>
                                </tr>
                                <tr>
                                  <td width="75%" style="background-color: #fff; color: #222; line-height: 170%;
                                    #222;padding: 7px 20px; font-size: 12px;border-bottom: 1px solid #f5f5f5;">
                                    @if ($order->backend_order)
                                      <b>{!! str_replace('<hr />', '<hr style="border-top: 1px solid #eee; border-bottom: 0"/>', $sch->meals) !!}</b>
                                      <br />
                                    @else
                                      MEALS: <b>{{ $sch->ordercart->meals }}</b>
                                    @endif
                                    @if ($sch->snacks != '')
                                      <br />SNACKS: <b>{{ $sch->snacks }}</b>
                                    @endif
                                    <br />
                                    PICKUP STATION: <b>{{ $sch->station }}</b> {{ $sch->area ? '('. $sch->area .')' : '' }}
                                  </td>
                                </tr>
                              @endforeach
                            </table>
                          </td>
                        </tr>
                        @if (!$loop->last)
                          <tr>
                            <td colspan="3" style="background-color: #b5e1ed; height: 5px;"></td>
                          </tr>
                        @endif
                        <?php $total += $item['total_price']; ?>
                      @endif @endforeach
                    </tbody>
                  </table>
                  <br />
                  <table width="100%" align="center" cellpadding="0" cellspacing="0">
                    <tr>
                      <td width="100%" style="padding: 15px; font-size: 12px; color: #444; line-height: 160%; text-align: center">
                        <p>
                          <img src="{{ url('images/logo-email.jpg') }}" alt="Motion Fitness" style="display: block; margin: 0 auto; border-radius: 4px;">
                          <p><strong>CONTACT MOTION MEAL PLANS</strong></p>
                          <p>
                            Phone/WA: <strong>+62 821 4425 2606</strong> (Mon. - Fri. 08:00 - 17:00)<br />
                            Email: <a href="mailto:foodorder@motionfitnessbali.com" title="">foodorder@motionfitnessbali.com</a><br />
                          </p>
                          <p>
                            <a href="{{ url('terms-and-conditions#privacy') }}" title="">Privacy Policy</a> &middot; <a href="{{ url('terms-and-conditions#top') }}" title="">Terms and Conditions</a>
                          </p>
                          <p className="social">
                            <a href="https://www.facebook.com/motioncafebali" title=""><img src="{{ url('images/email-fb.jpg') }}" alt="Facebook" style="border-radius: 4px;"/></a>
                            <a href="http://instagram.com/avocadocafebali" title=""><img src="{{ url('images/email-in.jpg') }}" alt="Instagram" style="border-radius: 4px;" /></i></a>
                            <a href="http://www.tripadvisor.com/Restaurant_Review-g311298-d6903656-Reviews-Avocado_Cafe-Canggu_Bali.html" title=""><img src="{{ url('images/email-trip.jpg') }}" alt="Trip Advisor" style="border-radius: 4px;" /></a>
                          </p>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
