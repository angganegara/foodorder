<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Diet extends Model
{
  public $primarykey = 'id';

  protected $hidden = [
    'updated_at', 'created_at', 'price_type', 'price'
  ];

  protected $appends = [
    'slug'
  ];

  protected $casts = [
    'id' => 'integer',
    'category_id' => 'integer',
    'parent_id' => 'integer',
    'position' => 'integer',
    'visible' => 'integer'
  ];

  public function getPriceFormattedAttribute()
  {
    return number_format($this->price_w, 0);
  }

  public function getSlugAttribute()
  {
    return $this->attributes['slug'] = str_slug($this->name);
  }

  public function category()
  {
    return $this->belongsTo('App\Models\Category');
  }

  public function children()
  {
    return $this->hasMany('App\Models\Diet', 'parent_id');
  }

  public function prices()
  {
    return $this->hasMany('App\Models\Price', 'category', 'price');
  }

  public function priceByType($type, $column)
  {
    $data = $this->hasMany('App\Models\Price', 'category', 'price')->where('type', $type)->first();
    return $data->{$column};
  }
}
