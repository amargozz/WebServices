
<?php
require 'mediaplay_func.php';
$media = obtenerMedia();
file_put_contents('media_content.txt', json_encode($media));
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>KioskMedia</title>
	<link rel="stylesheet" href="style.css">
    style.css
</head>
<body>
    <div id="slideshow"></div>
    <div id="countdown">00:00</div>

    <script>
    const media = <?php echo json_encode($media, JSON_UNESCAPED_SLASHES); ?>;
    const interval = 9000; // tiempo para imágenes
    let currentIndex = 0;
    const slideshow = document.getElementById('slideshow');
    const countdown = document.getElementById('countdown');

    function formatTime(ms) {
        const totalSeconds = Math.floor(ms / 1000);
        const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
        const seconds = String(totalSeconds % 60).padStart(2, '0');
        const fileName = media[currentIndex];
        return `${fileName} ${currentIndex + 1}/${media.length} ${minutes}:${seconds}`;
    }

    function startCountdown(duration) {
        let remaining = duration;
        countdown.textContent = formatTime(remaining);
        const timer = setInterval(() => {
            remaining -= 1000;
            countdown.textContent = formatTime(remaining);
            if (remaining <= 0) clearInterval(timer);
        }, 1000);
    }

    function showNextMedia() {
        slideshow.innerHTML = '';
        const file = media[currentIndex];
        let duration = interval;

        if (/\.(mp4|webm|ogg)$/i.test(file)) {
            const video = document.createElement('video');
            video.src = file;
            video.autoplay = true;
            video.controls = false;
            video.muted = false;
            video.playsInline = true;
            slideshow.appendChild(video);

            video.onloadedmetadata = () => {
                video.currentTime = 0;
                video.play();
                duration = video.duration * 1000;
                startCountdown(duration);
                setTimeout(nextMedia, duration);
				console.log(video.duration);
            };
        } else {
            const img = document.createElement('img');
            img.src = file;
            slideshow.appendChild(img);
            startCountdown(duration);
            setTimeout(nextMedia, duration);
        }
    }

    function nextMedia() {
        currentIndex++;
        if (currentIndex < media.length) {
            showNextMedia();
        } else {
            location.reload();
        }
    }

    showNextMedia();

    document.addEventListener('click', () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        }
    });
    </script>
</body>
</html>

