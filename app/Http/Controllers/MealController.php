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

  public function manage()
  {
    return view('admin.mealplans');
  }

  public function newPlan(Request $request)
  {
    $name = $request->name;
    $category = $request->category;
    $items = $request->items;
    $ids = [];
    foreach ($items as $index => $item) {
      $day = intVal($index) + 1;
      $comp = new Component;
      $comp->name = $name ."_". $day;
      $comp->breakfast = $item['menu']['b'];
      $comp->breakfast_snack = $item['menu']['bs'];
      $comp->lunch = $item['menu']['l'];
      $comp->lunch_snack = $item['menu']['ls'];
      $comp->dinner = $item['menu']['d'];
      $comp->save();
      $ids["day_". $day] = $comp->id;
    }

    $mp = new MealPlan;
    $mp->name = $name;
    $mp->category = $category;
    $mp->day_1 = $ids["day_1"];
    $mp->day_2 = $ids["day_2"];
    $mp->day_3 = $ids["day_3"];
    $mp->day_4 = $ids["day_4"];
    $mp->day_5 = $ids["day_5"];
    $mp->day_6 = $ids["day_6"];
    $mp->save();

    return response('?OK'. time());
  }

  public function listPlan()
  {
    $mp = MealPlan::with(['day_1', 'day_2', 'day_3', 'day_4', 'day_5', 'day_6'])->get();
    return $mp;
  }

  public function updateComponent(Request $request)
  {
    $id = $request->id;
    $b = $request->b;
    $bs = $request->bs;
    $l = $request->l;
    $ls = $request->ls;
    $d = $request->d;

    $comp = Component::find($id);
    $comp->breakfast = $b;
    $comp->breakfast_snack = $bs;
    $comp->lunch = $l;
    $comp->lunch_snack = $ls;
    $comp->dinner = $d;
    $comp->save();

    return response($comp);
  }

  public function getPlan($id)
  {
    $mp = MealPlan::find($id);
    $days = [];
    for ($i = 1; $i <= 6; $i++) {
      $m = $mp->menu('day_'. $i)->first();
      $arr = [];
      $arr = [
        'id' => $m->id,
        'name' => $m->name,
        'menu' => [
          'b' => $m->breakfast,
          'bs' => $m->breakfast_snack,
          'l' => $m->lunch,
          'ls' => $m->lunch_snack,
          'd' => $m->dinner
        ]
      ];
      array_push($days, $arr);
    }

    return [
      'id' => $mp->id,
      'name' => $mp->name,
      'days' => $days
    ];
  }
}