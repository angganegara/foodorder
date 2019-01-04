<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Category;
use App\Models\Diet;

class FoodController extends Controller
{
  public function index()
  {
    return Diet::orderBy('name', 'asc')->with('children')->with('prices')->where('parent_id', 0)->get();
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

  public function show(Diet $diet)
  {
    return $diet;
  }

  public function price($id, $type)
  {
    $diet = Diet::find($id);
    $price = $diet->prices->where('type', $type)->first();

    return $price->price;
  }

  public function getDomain(Request $request)
  {
    return $request->getHost();
  }

  public function detox()
  {
    return Diet::where('id', 8)->with('children')->orderBy('position', 'asc')->first();
  }
}
