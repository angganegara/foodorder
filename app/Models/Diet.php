<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Diet extends Model
{
    public $primarykey = 'id';

    protected $hidden = [
        'updated_at', 'created_at', 'price_type', 'price', 'slug'
    ];

    protected $appends = [
        'slug'
    ];

    public function getPriceFormattedAttribute()
    {
        return number_format($this->price_w, 0);
    }

    public function getSlugAttribute()
    {
        return str_slug($this->name);
    }

    public function category()
    {
        return $this->belongsTo('App\Models\Category');
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
