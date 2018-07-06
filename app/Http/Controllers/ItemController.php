<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Category;
use App\Models\Item;

class ItemController extends Controller
{
  public function index()
  {
    return Item::orderBy('position', 'asc')->with('category')->get()->keyBy('id')->all();
  }

  public function categorize()
  {
    $categories = Category::where('id', '!=', 1)->with('items')->orderBy('sort', 'asc')->get();
    return $categories;
  }

  public function getItems($id)
  {
    $items = Category::where('id', $id)->with('items')->orderBy('sort', 'asc')->get();
    return $items;
  }

  public function show($id)
  {
    return Item::find($id);
  }
}
