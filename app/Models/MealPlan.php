<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MealPlan extends Model
{
	protected $casts = [
    'id' => 'integer',
    'day_1' => 'integer',
    'day_2' => 'integer',
    'day_3' => 'integer',
    'day_4' => 'integer',
    'day_5' => 'integer',
    'day_6' => 'integer',
  ];

  public function menu($day)
  {
    return $this->hasOne(\App\Models\Component::class, 'id', $day);
  }
}
