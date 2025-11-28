
<?php
function getMedia($folder = 'KIOSK_MEDIA', $imageDuration = 10) {
    $imagenes = glob("$folder/*.{jpg,jpeg,png,PNG,gif,bmp,webp}", GLOB_BRACE);
    $videos = glob("$folder/*.{mp4,webm,ogg}", GLOB_BRACE);

    $mediaList = [];

    // Agregar imágenes con duración fija
    foreach ($imagenes as $img) {
        $mediaList[] = [
            'file' => $img,
            'type' => 'image',
            'duration' => $imageDuration
        ];
    }

    // Agregar videos con duración real
    foreach ($videos as $video) {
        $duration = getVideoDuration($video);
        $mediaList[] = [
            'file' => $video,
            'type' => 'video',
            'duration' => $duration
        ];
    }

    return $mediaList;
}

// Función para obtener duración del video usando ffprobe. Requiere instalar
function getVideoDuration($file) {
    $cmd = "ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 \"$file\"";
    $duration = shell_exec($cmd);
    return round(floatval($duration)); // Duración en segundos
}

header('Content-Type: application/json');
echo json_encode(getMedia());
?>


