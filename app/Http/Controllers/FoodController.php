<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Category;
use App\Models\Diet;

class FoodController extends Controller
{
    public function index()
    {
        $foods = Diet::orderBy('position', 'asc')->get();
    	$arr = [];
    	foreach ($foods as $food) {
    		$arr[] = [
    			'id' => $food->id,
                'category_id' => $food->category_id,
    			'name' => $food->name,
    			'slug' => str_slug($food->name),
    			'short_description' => $food->short_description,
    			'description' => $food->description,
    			'position' => $food->position,
    			'prices' => $food->prices,
    			'price' => $food->prices->where('type', 'weekly')->first()->price
    		];
    	}
    	return $arr;
    }

	public function populateData($data)
	{
		$c = [];
        $diets = '';
        foreach ($data as $category) {
            $d = [];
            foreach ($category->diet as $food) {
        		$d[] = [
        			'id' => $food->id,
                    'category_id' => $food->category_id,
        			'name' => $food->name,
        			'slug' => str_slug($food->name),
        			'short_description' => $food->short_description,
        			'description' => $food->description,
        			'position' => $food->position,
        			'prices' => $food->prices,
        			'price' => $food->prices->where('type', 'weekly')->first()->price
        		];
        	}
            $c[] = [
                'id' => $category->id,
                'title' => $category->title,
                'diets' => $d
            ];
        }

		return $c;
	}

    public function categorize()
    {
        $categories = Category::where('id', '!=', 1)->where('id', '!=', 6)->orderBy('sort', 'asc')->get();
        return $this->populateData($categories);
    }

	public function getItems($id)
	{
		$foods = Category::where('id', $id)->get();
		return $this->populateData($foods);
	}

    public function show($id)
    {
        $food = Diet::find($id);
    	$food['price'] = $food->prices;
    	$food['weeklyprice'] = $food->prices->where('type', 'weekly')->first()->price;

        $dir = app()->basePath('public/images/foods');
        $files = glob($dir .'/*.jpg');

        $files = array_map(function($value) {
            $tmp = explode('/', $value);
            return $tmp[count($tmp)-1];
        }, $files);

        $pictures = array_filter($files, function($value) use($id) {
            return explode('_', $value)[0] === $id;
        });

        $food['pictures'] = $pictures;

    	return $food;
    }

    public function price($id, $type)
    {
        $diet = Diet::find($id);
    	$price = $diet->prices->where('type', $type)->first();

    	return $price->price;
    }
}
