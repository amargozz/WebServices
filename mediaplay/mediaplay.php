<?php
$folder = 'FOLDER/WHERE/FILES/ARE/LOCATED';
$imageDuration = 5;

function getMedia($folder, $imageDuration) {
    $imagenes = glob("$folder/*.{jpg,jpeg,png,PNG,gif,bmp,webp}", GLOB_BRACE);
    $videos = glob("$folder/*.{mp4,webm,ogg}", GLOB_BRACE);

    $mediaList = [];

    // Images
    foreach ($imagenes as $img) {
        $mediaList[] = [
            'file' => $img,
            'type' => 'image'
        ];
    }
    // Videos
    foreach ($videos as $video) {
        $mediaList[] = [
            'file' => $video,
            'type' => 'video'
        ];
    }

    return $mediaList;
}

$mediaList = getMedia($folder, $imageDuration);

$content = json_encode($mediaList, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

// save json in a file
//file_put_contents("content.json", $content);
header('Content-Type: application/json');
echo $content;
?>


