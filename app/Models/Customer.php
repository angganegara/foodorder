<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
	protected $casts = [
    'id' => 'integer'
  ];

  public function address()
  {
    return $this->hasOne(\App\Models\Address::class);
  }
}
