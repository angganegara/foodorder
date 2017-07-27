<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    public $primarykey = 'id';

    protected $hidden = [
        'updated_at', 'created_at'
    ];

    public function diet()
    {
        return $this->hasMany('App\Models\Diet', 'category_id')->orderBy('position', 'asc');
    }
}
