<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Price extends Model
{
  protected $hidden = [
    'updated_at', 'created_at'
  ];

  protected $casts = [
    'sort' => 'integer'
  ];

  public function diet()
  {
    //return $this->belongsTo('App\Models\Diet', 'catid');
  }
}
