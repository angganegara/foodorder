<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MealPlan;
use App\Models\Component;
use Carbon\Carbon;

class MealController extends Controller
{
	public function index() {
    return view('dragdrop');
  }

  public function getData() {
    $mp = MealPlan::find(1);
    $days = [];
    for ($i = 1; $i <= 6; $i++) {
      $m = $mp->menu('day_'. $i)->first();
      $days[$i] = [
        'NAME' => $m->name,
        'B' => $m->breakfast,
        'BS' => $m->breakfast_snack,
        'L' => $m->lunch,
        'LS' => $m->lunch_snack,
        'D' => $m->dinner,
      ];
    }

    return [
      'name' => $mp->name,
      'days' => $days
    ];
  }
}
