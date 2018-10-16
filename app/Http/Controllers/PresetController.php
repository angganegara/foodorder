<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Preset;
use Carbon\Carbon;

class PresetController extends Controller
{
  public function index()
  {
    $presets = Preset::all();
    return response($presets);
  }

  public function show($id)
  {
    $preset = Preset::find($id);
    return response($preset);
  }

  public function insert(Request $request)
  {
    $overwrite = $request->overwrite;

    $preset = Preset::where('preset_name', $request->preset_name)->first();
    if ($preset) {
      if (!$overwrite) {
        //return response('EXIST');
        return response('OK');
      } else {
        // update
        $preset->update($request->except(['overwrite']));
        return response('OK');
      }
    }

    $new = Preset::create($request->except(['overwrite']));
    $presets = Preset::all();
    return response($presets);
  }
}
