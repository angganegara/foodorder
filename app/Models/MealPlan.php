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

  public function day_1()
  {
    return $this->hasOne(\App\Models\Component::class, 'id', 'day_1');
  }

  public function day_2()
  {
    return $this->hasOne(\App\Models\Component::class, 'id', 'day_2');
  }

  public function day_3()
  {
    return $this->hasOne(\App\Models\Component::class, 'id', 'day_3');
  }

  public function day_4()
  {
    return $this->hasOne(\App\Models\Component::class, 'id', 'day_4');
  }

  public function day_5()
  {
    return $this->hasOne(\App\Models\Component::class, 'id', 'day_5');
  }

  public function day_6()
  {
    return $this->hasOne(\App\Models\Component::class, 'id', 'day_6');
  }

}
