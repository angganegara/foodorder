<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Carbon\Carbon;
use DB;

use App\Models\Menu;
use App\Models\Diet;

class FitSlimController extends Controller
{
    public function menu()
    {
        return Menu::all();
    }

    public function saveMenu(Request $request)
    {
        $menus = $request->menus;
        foreach ($menus as $menu) {
            $data = Menu::find($menu['id']);
            $data->content = $menu['content'];
            $data->save();
        }

        return 'OK';
    }

    public function names()
    {
        return Diet::find(3);
    }

    public function saveNames(Request $request)
    {
        $thumb = $request->thumb;
        $full = $request->full;
        if ($request->hasFile('thumb') != '') {
            // upload thumbnails
            $filename = 'thumb_3.jpg';
            $path = app()->basePath('public/images/foods');
            if ($thumb->isValid()) {
                $thumb->move($path, $filename);
            }
        }
        if ($request->hasFile('full') != '') {
            // upload thumbnails
            $filename = '3_1.jpg';
            $path = app()->basePath('public/images/foods');
            if ($full->isValid()) {
                $full->move($path, $filename);
            }
        }
        $data = Diet::find(3);
        $data->name = $request->name;
        $data->subname = $request->subname;
        $data->save();

        return 'OK';
    }
}
