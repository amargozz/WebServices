<?php
$directory = __DIR__;

$folders = array_diff(scandir($directory), array('..', '.'));

// Iniciar el HTML de la página
echo "<!DOCTYPE html>";
echo "<html lang='es'>";
echo "<head>";
echo "<meta charset='UTF-8'>";
echo "<meta name='viewport' content='width=device-width, initial-scale=1.0'>";
echo "<title>Projects</title>";
echo "<link rel='stylesheet' href='style.css'>";
echo "</head>";
echo "<body>";
echo "<h1>Select</h1>";
echo "<div>";

// Recorrer las carpetas y crear un botón por cada una
foreach ($folders as $folder) {
    if (is_dir($folder)) {
        // Comprobar si existe index.php o index.html en la carpeta
        $index_php = $folder . '/index.php';
        $index_html = $folder . '/index.html';

        // Determinar qué archivo usar como inicio
        if (file_exists($index_php)) {
            $link = '/' . $folder . '/index.php';
        } elseif (file_exists($index_html)) {
            $link = '/' . $folder . '/index.html';
        } else {
            $link = '/' . $folder; // Si no existe index, redirigir a la carpeta (por defecto)
        }

        // Crear un botón para cada carpeta (proyecto)
        echo "<form action='$link' method='get'>";
        echo "<button type='submit'>$folder</button>";
        echo "</form>";
    }
}

echo "</div>";
echo "</body>";
echo "</html>";
?>
