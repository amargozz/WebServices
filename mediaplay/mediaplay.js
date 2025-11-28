async function startMediaLoop() {
    try {
        // 1. Obtener la lista desde el PHP
        const response = await fetch('mediaplay.php');
        const mediaList = await response.json();

        // 2. Reproducir secuencialmente
        for (let i = 0; i < mediaList.length; i++) {
            const media = mediaList[i];
            await playMedia(media);
        }

        // 3. Cuando termine, refrescar y volver a empezar
        startMediaLoop(); // Recursivo
    } catch (error) {
        console.error('Error cargando medios:', error);
    }
}

function playMedia(media) {
    return new Promise((resolve) => {
        const container = document.getElementById('media-container');
        container.innerHTML = ''; // Limpiar contenido anterior

        let element;
        if (media.type === 'image') {
            element = document.createElement('img');
            element.src = media.file;
            element.style.width = '100%';
            element.style.height = '100%';
            element.style.objectFit = 'cover';
            container.appendChild(element);

            // Countdown opcional
            startCountdown(media.duration);

            setTimeout(resolve, media.duration * 1000);
        } else if (media.type === 'video') {
            element = document.createElement('video');
            element.src = media.file;
            element.autoplay = true;
            element.muted = true; // Opcional
            element.style.width = '100%';
            element.style.height = '100%';
            element.style.objectFit = 'cover';
            container.appendChild(element);

            // Countdown opcional
            startCountdown(media.duration);

            element.onended = resolve; // Cuando termine el video
        }
    });
}

function startCountdown(seconds) {
    const countdown = document.getElementById('countdown');
    countdown.textContent = seconds;

    let remaining = seconds;
    const interval = setInterval(() => {
        remaining--;
        countdown.textContent = remaining;
        if (remaining <= 0) clearInterval(interval);
    }, 1000);
}

// Iniciar el ciclo
startMediaLoop();
