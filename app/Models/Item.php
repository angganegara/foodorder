<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
  public $primarykey = 'id';

  protected $hidden = [
    'updated_at', 'created_at'
  ];

  public function category()
  {
    return $this->belongsTo('App\Models\Category');
  }
}
