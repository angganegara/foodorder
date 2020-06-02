<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use Mail;
use Excel;

use App\Models\Partner;
use App\Models\Order;

class PartnerController extends Controller
{
  protected $partners;

  public function index(Request $request)
  {
    if ($request->ajax()) {
      return Partner::all();
    } else {
      $partners = Partner::all();
      return view('admin.partners', compact('partners'));
    }
  }

  public function create()
  {
    return view('admin.new-partner');
  }

  public function insert(Request $request)
  {
    $data = $request->all();
    $data['always_visible'] = (isset($data['always_visible']) && ($data['always_visible'] == 'on')) ? 1 : 0;

    $partner = Partner::create($data);

    // send email to let me know
    try {
      Mail::send('emails.partner', compact('partner'), function ($m) use ($partner) {
        $m
          ->from('no-reply@motionfitnessbali.com', 'Motion - Meal Plans')
          ->to('angga@me.com', 'Angga Negara')
          ->subject('MOTION Meal Plans - New partner added');
      });
    } catch (\Exception $e) {
      // ... krik krik krik
    }

    request()->session()->flash('status', 'success');
    return redirect('/admin/partners/'. $partner->id);
  }

  public function show($id)
  {
    $partner = Partner::find($id);

    return view('admin.partner', compact('partner'));
  }

  public function update(Request $request, $id)
  {
    $data = $request->all();
    $partner = Partner::find($id);
    $data['always_visible'] = (isset($data['always_visible']) && ($data['always_visible'] == 'on')) ? 1 : 0;

    $partner->update($data);

    request()->session()->flash('status', 'success');
    return redirect('/admin/partners/'. $id);
  }

  public function delete($id)
  {
    Partner::destroy($id);
    return redirect('/admin/partners');
  }

  public function report()
  {
    $partners = Partner::where('profit', '>', 0)->get()->toArray();
    return view('admin.report', compact('partners'));
  }

  public function formatDates($dates)
  {
    return [
      Carbon::parse($dates[0])->format('Y-m-d'),
      Carbon::parse($dates[1])->format('Y-m-d')
    ];
  }

  public function getReport($request)
  {
    $orders = null;
    if ($request->partner == '') { return response('Please select partner', 500); }
    if ($request->dates == '') { return response('Please select the dates', 500); }

    list ($start, $finish) = $this->formatDates($request->dates);

    $orders = Order::where('partner_id', $request->partner)
                    ->where('paid', 1)
                    ->where('created_at', '>=', $start)
                    ->where('created_at', '<=', $finish .' 23:59:59')
                    ->get();

    return $orders;
  }

  public function showReport(Request $request)
  {
    if (!$request->ajax()) {
      exit;
    }

    $orders = $this->getReport($request);
    return response($orders->toArray());
  }

  public function exportExcel(Request $request)
  {
    $format = $request->format;
    $orders = $this->getReport($request);
    $partner = Partner::find($request->partner);
    list ($start, $finish) = $this->formatDates($request->dates);

    $filename = str_replace(' ', '-', $partner->name) .'-'. Carbon::parse($start)->format('d-M-Y') .'-to-'. Carbon::parse($finish)->format('d-M-Y');

    Excel::create($filename, function ($excel) use ($filename, $orders) {
      $excel->setTitle($filename);
      $excel->sheet('Sheet 1', function ($sheet) use ($orders) {
        $sheet->setColumnFormat(['D' => '0']);
        $sheet->row(1, [
          'Order number',
          'Date',
          'Name',
          'Phone',
          'Payment Methods',
          'Total',
          '%',
          'Profit'
        ]);
        $total = 0;
        $grand_total = 0;
        foreach ($orders as $order) {
          $grand_total += intVal($order->total);
          $total_profit = intVal($order->total) * ($order->partner->profit / 100);
          $total += $total_profit;
          $sheet->appendRow([
            $order->order_number,
            $order->date,
            $order->name,
            $order->phone,
            $order->payment_formatted,
            $order->total,
            $order->partner->profit,
            $total_profit
          ]);
        }
        $sheet->appendRow([
          '', '', '', '', 'TOTAL', $grand_total, '', $total
        ]);
      });
    })->store($format, public_path('excel'));

    return response(asset('excel/'. $filename .'.'. $format));
  }
}
