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
                  Motion Meal Plan - Payment Reminder
                </td>
              </tr>
            </table>
            <table width="100%" align="center" cellpadding="0" cellspacing="0" style="
              font-family: Arial, sans-serif; font-size: 12px;
              line-height: 140%; color: #222;">
              <tr>
                <td width="100%" colspan="2" valign="middle" style="padding: 20px; font-weight: bold; border-bottom: 1px solid #ddd">
                  <p>Dear Customer,</p>
                  <p>unfortunately we did not receive any payment for your food order today. Please make sure to pay for your food upon next delivery, otherwise we might not be able to continue our service.</p>
                  <p>Thank you for your understanding,<br />Your Motion Team</p>
                </td>
              </tr>

              <tr>
                <td colspan="2">
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
