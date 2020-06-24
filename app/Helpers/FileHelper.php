<?php

namespace App\Helpers;

use Illuminate\Http\Request;
use Storage;

class FileHelper
{
  protected function isExtensionAllowed(String $ext)
  {
    $allowed_extensions = [
      'jpg', 'jpeg', 'gif', 'png'
    ];

    return in_array($ext, $allowed_extensions);
  }

  public function uploadPicture($file, $dest, $filename = null)
  {
    $ext = $file->getClientOriginalExtension();

    if (!$this->isExtensionAllowed($ext)) {
      return false;
    }

    $filename = $filename .'.'. $ext ?? time() .'.'. $ext;

    if ($file->isValid()) {
      $file->storeAs($dest, $filename);
      return [
        'filename' => $filename,
        'link' => asset($dest .'/'. $filename)
      ];
    }

    return false;
  }
}
