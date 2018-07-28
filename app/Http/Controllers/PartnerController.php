<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
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
                    ->where('created_at', '<=', $finish)
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
        foreach ($orders as $order) {
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
          '', '', '', '', '', '', 'TOTAL', $total
        ]);
      });
    })->store('xlsx', public_path('excel'));

    return response(asset('excel/'. $filename .'.xlsx'));
  }
}
