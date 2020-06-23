<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
  public $primarykey = 'id';

  protected $fillable = [
    'name', 'domain', 'station', 'always_visible', 'bcc', 'profit', 'google_map'
  ];

  protected $hidden = [
    'updated_at', 'created_at', 'bcc'
  ];

  protected $casts = [
    'id' => 'integer',
    'always_visible' => 'integer',
    'profit' => 'float'
  ];

  public function order()
  {
    return $this->hasMany(\App\Models\Order::class);
  }
}
