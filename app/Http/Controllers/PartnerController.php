<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Partner;

class PartnerController extends Controller
{
  protected $partners;

  public function index()
  {
    if (request()->ajax()) {
      return Partner::all();
    } else {
      $partners = Partner::all();
      return view('admin.partners', compact('partners'));
    }
  }
}
