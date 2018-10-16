<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Preset extends Model
{
	protected $casts = [
    'id' => 'integer'
  ];

  protected $guarded = [];

  public function getDataAttribute($value)
  {
    return json_decode($value, true);
  }
}
