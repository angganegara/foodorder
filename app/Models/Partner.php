<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Partner extends Model
{
  public $primarykey = 'id';

  protected $hidden = [
    'updated_at', 'created_at', 'bcc'
  ];

  public function order()
  {
    return $this->hasMany(\App\Models\Order::class);
  }
}
