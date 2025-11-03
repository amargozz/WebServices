<?php
$folder = 'KioskPlay'; //Ruta de acceso a las imagenes. En este caso, carpeta KioskPlay en Raiz (linux)
$images = glob("$folder/*.{jpg,jpeg,png,gif,bmp,webp}", GLOB_BRACE);
?>

<script>
const interval = 300000; // ms por imagen
</script>

<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>KioskPlay</title>
  <style>
    html, body {
      margin: 0;
      padding: 0;
      background-color: black;
      overflow: hidden;
      height: 100%;
      width: 100%;
    }
    #slideshow {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background-size: contain;
      background-repeat: no-repeat;
      background-position: center;
      transition: background-image 1s ease-in-out;
    }
   #countdown {
      position: fixed;
      bottom: 20px;
      right: 30px;
      color: white;
      font-size: 2em;
      font-family: monospace;
      background: rgba(0, 0, 0, 0.2);
      padding: 10px 20px;
      border-radius: 10px;
	  display:block; <!-- none para no visible; block para hacerlo visible-->
    }

  </style>
</head>
<body>
  <div id="slideshow"></div>
  <div id="countdown">00:00</div>

  <script>
    const images = <?php echo json_encode($images); ?>;
    let currentIndex = 0;
    const slideshow = document.getElementById('slideshow');
    const countdown = document.getElementById('countdown');

    function formatTime(ms) {
      const totalSeconds = Math.floor(ms / 1000);
      const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
      const seconds = String(totalSeconds % 60).padStart(2, '0');
      return `${minutes}:${seconds}`;
    }

    function startCountdown(duration) {
      let remaining = duration;
      countdown.textContent = formatTime(remaining);
      const timer = setInterval(() => {
        remaining -= 1000;
        countdown.textContent = formatTime(remaining);
        if (remaining <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    }

    function showNextImage() {
      slideshow.style.backgroundImage = `url('${images[currentIndex]}')`;
      startCountdown(interval);
      currentIndex++;

      if (currentIndex <= images.length) {
        setTimeout(showNextImage, interval);
      } else {
        location.reload(); // recarga la página al terminar el ciclo
      }
    }

    showNextImage();

    // Activar pantalla completa al hacer clic
    document.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
      }
    });
  </script>
</body>
</html>
