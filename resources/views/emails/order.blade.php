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
                                <td valign="middle" colspan="2" style="
                                    background-color: #b5e1ed; color: #222;
                                    text-transform: uppercase; font-weight: bold;
                                    padding: 15px 20px;
                                    letter-spacing: 1px; font-size: 12px">
                                    MOTION CAFE - Confirmation Food Delivery
                                </td>
                            </tr>
                        </table>
                        <table width="100%" align="center" cellpadding="0" cellspacing="0">
                            <tr>
                                <td width="100%" height="259" align="center" style="padding: 20px 0;">
                                    <img src="{{ url('images/header-email.jpg?1') }}" alt="Motion Fitness">
                                </td>
                            </tr>
                        </table>
                        <table width="100%" align="center" cellpadding="0" cellspacing="0" style="
                            font-family: Arial, sans-serif; font-size: 12px;
                            line-height: 140%; color: #222;">
                            <tr>
                                <td width="100%" colspan="2" valign="middle" style="padding: 20px;">
                                    <p><b>Dear {{ $order->fname }} {{ $order->lname }},</b></p>
                                    <p>
                                        <b>Thank you for your food order. Please recheck your booking details below {{ $order->payment != 'paypal' ? 'and click
                                        the button below to see the payment details.' : '' }}</b>
                                    </p>
                                    <p>
                                        <b>Enjoy your food,<br>
                                        Your Motion Cafe Team</b>
                                    </p>
                                    <p>PS: In case you have booked a Special Diet such as Ayurveda Diet, Detox, High
                                        Protein Diet, or Customized Menu, please <b>check the attachment for important information</b> on those diets.</p>
                                </td>
                            </tr>
                            <tr>
                                <td valign="middle" colspan="2" style="
                                    background-color: #b5e1ed; color: #222;
                                    text-transform: uppercase; font-weight: bold;
                                    padding: 15px 20px;
                                    letter-spacing: 1px; font-size: 12px">
                                    personal data
                                </td>
                            </tr>
                            <tr>
                                <td width="50%" align="left" valign="top" style="padding: 10px 20px; border-bottom: 1px solid #eee">
                                    <p style="font-size: 12px; margin-bottom: 0">
                                        <span style="color: #222; text-transform: uppercase; font-size: 12px; font-weight: bold; display: block; margin-bottom: 5px">First name</span>
                                        {{ ucwords($order->fname) }}
                                    </p>
                                </td>
                                <td width="50%" align="left" valign="top" style="padding: 10px 20px; border-bottom: 1px solid #eee">
                                    <p style="font-size: 12px; margin-bottom: 0">
                                        <span style="color: #222; text-transform: uppercase; font-size: 12px; font-weight: bold; display: block; margin-bottom: 5px">Surname</span>
                                        {{ ucwords($order->lname) }}
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td width="50%" align="left" valign="top" style="padding: 10px 20px; border-bottom: 1px solid #eee">
                                    <p style="font-size: 12px; margin-bottom: 0">
                                        <span style="color: #222; text-transform: uppercase; font-size: 12px; font-weight: bold; display: block; margin-bottom: 5px">Email address</span>
                                        {{ $order->email }}
                                    </p>
                                </td>
                                <td width="50%" align="left" valign="top" style="padding: 10px 20px; border-bottom: 1px solid #eee">
                                    <p style="font-size: 12px; margin-bottom: 0">
                                        <span style="color: #222; text-transform: uppercase; font-size: 12px; font-weight: bold; display: block; margin-bottom: 5px">Phone number</span>
                                        {{ $order->phone }}
                                    </p>
                                </td>
                            </tr>
                            <tr>
                                <td width="100%" colspan="2" align="left" valign="top" style="padding: 10px 20px; border-bottom: 1px solid #eee">
                                    <p style="font-size: 12px; margin-bottom: 0">
                                        <span style="color: #222; text-transform: uppercase; font-size: 12px; font-weight: bold; display: block; margin-bottom: 5px">Comments</span>
                                        {{ $order->comments == '' ? 'none' : $order->comments }}
                                    </p>
                                </td>
                            </tr>
							@if ($order->coupon != '' && $order->coupon_value <= 0)
							<tr>
                                <td width="50%" align="left" valign="top" style="padding: 10px 20px; border-bottom: 1px solid #eee">
                                    <p style="font-size: 12px; margin-bottom: 0">
                                        <span style="color: #222; text-transform: uppercase; font-size: 12px; font-weight: bold; display: block; margin-bottom: 5px">Coupon Code</span>
										{{ $order->coupon }}
                                    </p>
                                </td>
								<td width="50%" align="left" valign="top" style="padding: 10px 20px; border-bottom: 1px solid #eee">
                                    <p style="font-size: 12px; margin-bottom: 0">
                                        <span style="color: #222; text-transform: uppercase; font-size: 12px; font-weight: bold; display: block; margin-bottom: 5px">Free Item</span>
										{{ $order->coupon_item }}
                                    </p>
                                </td>
                            </tr>
							@endif
                            <tr>
                                <td valign="middle" colspan="2" style="
                                    background-color: #b5e1ed; color: #222;
                                    text-transform: uppercase; font-weight: bold;
                                    padding: 15px 20px;
                                    letter-spacing: 1px; font-size: 12px">
                                    cart overview
                                </td>
                            </tr>
                            <tr>
                                <td colspan="2">
                                    <table width="100%" cellpadding="0" cellspacing="0">
                                        <thead>

                                        </thead>
                                        <tbody>
                                            <?php $total = 0; ?>
                                        	@foreach ($order->ordercart as $key => $item) @if ($key !== 'total')
                                                <tr>
                                                    <th width="50%" style="padding: 10px 20px;
                                                        font-size: 12px; text-transform: uppercase;
                                                        border-bottom: 1px solid #b5e1ed; color: #222;
                                                        background-color: #f3f3f3; text-align: left">
                                                        Items
                                                    </th>
                                                    <th width="20%" style="padding: 10px 20px;
                                                        font-size: 12px; text-transform: uppercase;
                                                        border-bottom: 1px solid #b5e1ed; color: #222;
                                                        background-color: #f3f3f3; text-align: center">
                                                        Type
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
									                    <strong>
									                        {{ $item['name'] }}
									                        @if($item['subname'] != '')<span><br>{{ $item['subname'] }}</span>@endif
									                        @if($item['typeraw'] == 'fullday' || $item['typeraw'] == 'singlemeal')
									                        	<span> for {{ $item['totaldays'] }} day(s)</span>
									                        @endif
									                    </strong>
									                </td>
									                <td style="padding: 10px 20px 10px 20px; font-size: 12px; text-align: center; line-height: 150%;">{{ $item['type'] }}</td>
									                <td style="padding: 10px 20px 10px 20px; font-size: 12px; text-align: center; line-height: 150%;">
									                    <div class="qty-number">
									                        <span>{{ $item['qty'] }}</span>
									                    </div>
									                </td>
									                <td style="padding: 10px 20px 10px 20px; font-size: 12px; text-align: right; line-height: 150%;">
                                                        {{ number_format($item['price'] * $item['qty'], 0) }} IDR
                                                    </td>
									            </tr>
                                                <tr>
                                                    <td colspan="4">
                                                        <table width="100%" cellpadding="0" cellspacing="0">
                                                            @foreach ($item['schedule'] as $sch)
                                                                <tr>
                                                                    <th colspan="2" style="#222;padding: 10px 20px 10px 20px;
                                                                        font-size: 12px; border-top: 1px solid #ddd;color: #222;
                                                                        border-bottom: 1px solid #f6f6f6;
                                                                        background-color: #b5e1ed; text-align: left">{{ $sch->date }}
                                                                    </th>
                                                                </tr>
                                                                @if ($sch->breakfast_location != '')
                                                                    <tr>
                                                                        <td width="75%" style="background-color: #fff; color: #222; line-height: 150%;
                                                                            #222;padding: 10px 20px; font-size: 12px;border-bottom: 1px solid #f5f5f5;">
                                                                            <b>Breakfast</b>
                                                                            <br>
                                                                            {!! $that->getLocation($sch->breakfast_location, $order) !!}
                                                                            {!! $that->isExtraDelivery($sch->breakfast_location, $order) !!}
                                                                        </td>
                                                                        <td width="25%" style="background-color: #fff; color: #222; text-align: right;
                                                                            padding: 10px 20px; font-size: 12px;border-bottom: 1px solid #f5f5f5;">
                                                                            {{ $sch->breakfast_time }}
                                                                        </td>
                                                                    </tr>
                                                                @endif
                                                                @if ($sch->lunch_location != '')
                                                                    <tr>
                                                                        <td width="75%" style="background-color: #fff; color: #222; line-height: 150%;
                                                                            #222;padding: 10px 20px; font-size: 12px;border-bottom: 1px solid #f5f5f5;">
                                                                            <b>Lunch</b>
                                                                            <br>
                                                                            {!! $that->getLocation($sch->lunch_location, $order) !!}
                                                                            {!! $that->isExtraDelivery($sch->lunch_location, $order) !!}
                                                                        </td>
                                                                        <td width="25%" style="background-color: #fff; color: #222; text-align: right;
                                                                            padding: 10px 20px; font-size: 12px;border-bottom: 1px solid #f5f5f5;">
                                                                            {{ $sch->lunch_time }}
                                                                        </td>
                                                                    </tr>
                                                                @endif
                                                                @if ($sch->dinner_location != '')
                                                                    <tr>
                                                                        <td width="75%" style="background-color: #fff; color: #222; line-height: 150%;
                                                                            #222;padding: 10px 20px; font-size: 12px;border-bottom: 1px solid #f5f5f5;">
                                                                            <b>Dinner</b>
                                                                            <br>
                                                                            {!! $that->getLocation($sch->dinner_location, $order) !!}
                                                                            {!! $that->isExtraDelivery($sch->dinner_location, $order) !!}
                                                                        </td>
                                                                        <td width="25%" style="background-color: #fff; color: #222; text-align: right;
                                                                            padding: 10px 20px; font-size: 12px;border-bottom: 1px solid #f5f5f5;">
                                                                            {{ $sch->dinner_time }}
                                                                        </td>
                                                                    </tr>
                                                                @endif
                                                            @endforeach
                                                        </table>
                                                    </td>
                                                </tr>
                                                @if (!$loop->last)
                                                    <tr>
                                                        <td colspan="4" style="background-color: #b5e1ed; height: 5px;"></td>
                                                    </tr>
                                                @endif
                                                <?php $total += $item['price'] * $item['qty']; ?>
								            @endif @endforeach
                                        </tbody>
                                        <tfoot>
                                            @if ($order->extraprice > 0)
                                            <tr>
                                                <td style="border-top: 1px solid #b5e1ed; color: #222; background-color: #f3f3f3; padding: 10px 20px 5px 20px; font-size: 14px; font-weight: bold; text-align: right; line-height: 150%;" colspan="3">Extra delivery</td>
                                                <td style="border-top: 1px solid #b5e1ed; color: #222; background-color: #f3f3f3; padding: 10px 20px 5px 20px; font-size: 14px; font-weight: bold; text-align: right; line-height: 150%;">{{ number_format($order->extraprice, 0) }} IDR</td>
                                            </tr>
                                            @endif
											@if ($order->coupon_value > 0)
                                            <tr>
                                                <td style="border-top: 1px solid #b5e1ed; color: #222; background-color: #f3f3f3; padding: 10px 20px 5px 20px; font-size: 14px; font-weight: bold; text-align: right; line-height: 150%;" colspan="3">Discount (coupon: {{ $order->coupon }})</td>
                                                <td style="border-top: 1px solid #b5e1ed; color: #222; background-color: #f3f3f3; padding: 10px 20px 5px 20px; font-size: 14px; font-weight: bold; text-align: right; line-height: 150%;">- {{ number_format($order->coupon_value, 0) }} IDR</td>
                                            </tr>
                                            @endif
                                            @if ($order->discount > 0)
                                            <tr>
                                                <td style="border-top: 1px solid #b5e1ed; color: #222; background-color: #f3f3f3; padding: 10px 20px 5px 20px; font-size: 14px; font-weight: bold; text-align: right; line-height: 150%;" colspan="3">Delivery discount</td>
                                                <td style="border-top: 1px solid #b5e1ed; color: #222; background-color: #f3f3f3; padding: 10px 20px 5px 20px; font-size: 14px; font-weight: bold; text-align: right; line-height: 150%;">- {{ number_format($order->discount, 0) }} IDR</td>
                                            </tr>
                                            @endif
                                        	<tr>
                                        		<td style="border-top: 1px solid #b5e1ed; color: #222; background-color: #f3f3f3; padding: 10px 20px 5px 20px; font-size: 14px; font-weight: bold; text-align: right; line-height: 150%;" colspan="3">TOTAL</td>
                                        		<td style="border-top: 1px solid #b5e1ed; color: #222; background-color: #f3f3f3; padding: 10px 20px 5px 20px; font-size: 14px; font-weight: bold; text-align: right; line-height: 150%;">{{ number_format($total + $order->extraprice - $order->coupon_value - $order->discount, 0) }} IDR</td>
                                        	</tr>
											<tr>
                                        		<td style="border-top: 1px solid #b5e1ed; color: #222; background-color: #f3f3f3; padding: 10px 20px 5px 20px; font-size: 14px; font-weight: bold; text-align: right; line-height: 150%;" colspan="3">PAYMENT METHOD</td>
                                        		<td style="border-top: 1px solid #b5e1ed; color: #222; background-color: #f3f3f3; padding: 10px 20px 5px 20px; font-size: 14px; font-weight: bold; text-align: right; line-height: 150%;">{{ $order->payment }}</td>
                                        	</tr>
                                        </tfoot>
                                    </table>
                                     <table width="100%" align="center" cellpadding="0" cellspacing="0">
                                        <tr>
                                            <td width="100%" style="padding: 15px; font-size: 12px; color: #444; line-height: 160%; text-align: center">
                                                <p>
                                                    <img src="{{ url('images/logo-email.jpg') }}" alt="Motion Fitness" style="display: block; margin: 0 auto;">
                                                    <strong>MOTION CAFE</strong><br>
                                                    Jl. Raya Batu Bolong 69B, Canggu, Bali
                                                    <br>Phone Cafe: <a href="tel:+628113999411">+62 811 3999 411</a>
                                                    <br>Phone Meal Plans: <a href="tel:+6281337629983">+62 813 3762 9983</a> (Mon - Sat 08:00 - 17:00)
                                                    <br>Email Meal Plans: <a href="mailto:foodorder@motionfitnessbali.com">foodorder@motionfitnessbali.com</a>
                                                    <br><a href="http://cafe.motionfitnessbali.com" title="" target="_blank">http://cafe.motionfitnessbali.com</a>
                                                </p>
												@if ($order->payment != 'paypal')
													<a style="background-color: #5bc0de; margin: 10px 0; padding: 10px 25px; display: inline-block; border: 1px solid #46a2bd;
													color: #222; font-weight: bold; text-decoration: none; border-radius: 3px; font-size: 16px;"
													href="{{ url('pdf/payment-details.pdf') }}">PAYMENT DETAILS</a>
												@endif
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
