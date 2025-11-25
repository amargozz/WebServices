<?php
function getMedia($folder = 'KIOSK_MEDIA') {                                     //Path of directory
    $imagenes = glob("$folder/*.{jpg,jpeg,png,PNG,gif,bmp,webp}", GLOB_BRACE);
    $videos = glob("$folder/*.{mp4,webm,ogg}", GLOB_BRACE);
    return array_merge($imagenes, $videos);
}
?>


