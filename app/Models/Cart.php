<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Cart extends Model
{
  public $primarykey = 'id';

  protected $hidden = [
    'updated_at', 'created_at'
  ];

  protected $casts = [
    'id' => 'integer'
  ];
}
