let VIDEO_MUTED = false;
let IMG_DURATION = 11;

async function startMediaLoop() {
    try {
        // 1. get list from php
        const response = await fetch('mediaplay.php');
        const mediaList = await response.json();

        console.log("MEDIA LIST from mediaplay.php:", mediaList);

        // 2. play secuence
        for (let i = 0; i < mediaList.length; i++) {
            const media = mediaList[i];
            console.log(`playing: ${media.file} [${i + 1}/${mediaList.length}]`);
            await playMedia(media, i + 1, mediaList.length);
        }

        // 3. REALOAD AT END CYCLE
        if (mediaList.length >= 1) {
            console.log("refreshing...");
            location.reload();
        } else {
            console.warn("no files to show");
        }

    } catch (error) {
        console.error('loading error:', error);
    }
}

function playMedia(media, index, total) {
    return new Promise((resolve) => {
        const container = document.getElementById('slideshow');
        container.innerHTML = ''; // clear last content
        let element;

        // ----------------------------------------------------
        //  	IMAGES
        // ----------------------------------------------------
        if (media.type === 'image') {
            element = document.createElement('img');
            element.src = media.file;

            container.appendChild(element);

            startCountdown(IMG_DURATION, media.file, index, total);
            setTimeout(resolve, IMG_DURATION * 1000);
        }

        // ----------------------------------------------------
        //  VIDEOS
        // ----------------------------------------------------
        else if (media.type === 'video') {
            element = document.createElement('video');
            element.src = media.file;
            element.autoplay = true;
            element.muted = VIDEO_MUTED;

            element.onerror = () => {
                console.error("ERROR al cargar el video:", media.file);
            };

            container.appendChild(element);

            element.addEventListener('loadedmetadata', () => {
                const duration = Math.floor(element.duration);
                console.log("video duration:", duration, "segundos");
                startCountdown(duration, media.file, index, total);
            });

            element.onended = () => {
                console.log("Video terminado:", media.file);
                resolve();
            };
        }
    });
}

// ----------------------------------------------------
//  TIME COUNTDOWN
// ----------------------------------------------------
function startCountdown(seconds, filename, index, total) {
    const countdown = document.getElementById('countdown');

    // Name without parent directory
    const shortName = filename.split('/').pop();

    let remaining = seconds;
    countdown.textContent = `${shortName} [${index}/${total}] [	${formatTime(remaining)}]`;

    clearInterval(window.countdownInterval);

    window.countdownInterval = setInterval(() => {
        remaining--;

        if (remaining >= 0) {
            countdown.textContent = `${shortName} [${index}/${total}] [${formatTime(remaining)}]`;
        }

        if (remaining <= 0) {
            clearInterval(window.countdownInterval);
        }	
    }, 1000);
}

function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

// ----------------------------------------------------
//  START
// ----------------------------------------------------
startMediaLoop();




