<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
  public $primarykey = 'id';

  protected $hidden = [
    'updated_at', 'created_at'
  ];

  protected $casts = [
    'id' => 'integer',
    'category_id' => 'integer',
    'price' => 'float',
    'position' => 'integer',
    'visible' => 'integer'
  ];

  public function category()
  {
    return $this->belongsTo('App\Models\Category');
  }
}
