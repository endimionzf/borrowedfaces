document.addEventListener("DOMContentLoaded", () => {
    const loadingScreen = document.getElementById('loading-screen');
    const loadingBar = document.getElementById('loading-bar');
    const loadingStatus = document.getElementById('loading-status');
    
    // Select all preview videos in the grid
    const videos = document.querySelectorAll('.tile video');
    let videosLoaded = 0;
    const totalVideos = videos.length;

    // Function to update progress
    function checkProgress() {
        videosLoaded++;
        const percent = Math.floor((videosLoaded / totalVideos) * 100);
        
        // Update UI
        loadingBar.style.width = percent + "%";
        loadingStatus.innerText = `> LOADING MEMORY FRAGMENTS... ${percent}%`;

        // If all loaded, hide screen
        if (videosLoaded >= totalVideos) {
            setTimeout(() => {
                loadingStatus.innerText = "> SYSTEM READY. INITIALIZING...";
                setTimeout(() => {
                    loadingScreen.classList.add('fade-out');
                    // Optional: Auto-start ambient audio here if desired (and browser allows)
                }, 800);
            }, 500);
        }
    }

    if (totalVideos === 0) {
        // Fallback if no videos found
        loadingScreen.classList.add('fade-out');
    } else {
        videos.forEach(video => {
            // Check if video is already ready (cached)
            if (video.readyState >= 3) { // HAVE_FUTURE_DATA
                checkProgress();
            } else {
                // Otherwise wait for it to load enough data
                video.addEventListener('loadeddata', checkProgress, { once: true });
                video.addEventListener('error', checkProgress, { once: true }); // Count errors too so it doesn't hang
            }
        });
    }
});
const overlay = document.getElementById('video-overlay');
        const mainPlayer = document.getElementById('main-player');
        const app = document.getElementById('app');
        const ambientAudio = document.getElementById('ambient-audio');
        const muteBtn = document.getElementById('mute-btn');
        
        const confirmationOverlay = document.getElementById('confirmation-overlay');
        const confirmYesBtn = document.getElementById('confirm-yes');
        const confirmNoBtn = document.getElementById('confirm-no');
        
        const aboutBtn = document.getElementById('about-btn');
        const aboutOverlay = document.getElementById('about-overlay');
        const aboutCloseBtn = document.getElementById('about-close-btn');

        let pendingVideoSrc = '';

        // --- Ambient Audio Management ---
        let audioStarted = false;
        
        function initAudio() {
            if (!audioStarted) {
                ambientAudio.volume = 0.5;
                ambientAudio.play().then(() => {
                    audioStarted = true;
                }).catch(e => console.log("Audio autoplay blocked until interaction"));
            }
        }
        document.body.addEventListener('click', initAudio, { once: true });

        // --- About Modal Logic ---
        aboutBtn.addEventListener('click', () => {
            app.classList.add('blurred');
            aboutOverlay.style.display = 'flex';
        });

        aboutCloseBtn.addEventListener('click', () => {
            app.classList.remove('blurred');
            aboutOverlay.style.display = 'none';
        });

        // --- Interaction Flow ---
        function playVideo(src) {
            pendingVideoSrc = src;
            app.classList.add('blurred');
            confirmationOverlay.style.display = 'flex';
        }

        confirmYesBtn.addEventListener('click', () => {
            confirmationOverlay.style.display = 'none';
            startPlayback(pendingVideoSrc);
        });

        confirmNoBtn.addEventListener('click', () => {
            confirmationOverlay.style.display = 'none';
            app.classList.remove('blurred');
            pendingVideoSrc = '';
        });

        function startPlayback(src) {
            // Setup Player
            mainPlayer.src = src;
            mainPlayer.load(); 
            
            // Show Overlay
            overlay.style.display = 'flex';
            setTimeout(() => {
                overlay.classList.add('active');
            }, 10);

            // Handle Audio Fading
            fadeAudio(ambientAudio, 0, 1000); // Fade out ambient
            
            // Play Video
            mainPlayer.play();
            mainPlayer.muted = false; // Start with sound
            muteBtn.innerText = "MUTE";
        }

        function closeVideo() {
            overlay.classList.remove('active');
            setTimeout(() => {
                overlay.style.display = 'none';
                mainPlayer.pause();
                mainPlayer.src = ""; // Stop buffering
                mainPlayer.load();
            }, 500); 

            app.classList.remove('blurred');

            if(audioStarted) {
                ambientAudio.play();
                fadeAudio(ambientAudio, 0.5, 1000); // Fade in ambient
            }
        }

        function toggleMute() {
            mainPlayer.muted = !mainPlayer.muted;
            muteBtn.innerText = mainPlayer.muted ? "UNMUTE" : "MUTE";
        }

        function fadeAudio(audio, targetVolume, duration) {
            const startVolume = audio.volume;
            const steps = 20;
            const stepTime = duration / steps;
            const volumeStep = (targetVolume - startVolume) / steps;
            let currentStep = 0;

            const fadeInterval = setInterval(() => {
                currentStep++;
                let newVolume = startVolume + (volumeStep * currentStep);
                if (newVolume > 1) newVolume = 1;
                if (newVolume < 0) newVolume = 0;
                audio.volume = newVolume;

                if (currentStep >= steps) {
                    clearInterval(fadeInterval);
                    if (targetVolume === 0) audio.pause();
                }
            }, stepTime);
        }

        mainPlayer.addEventListener('ended', closeVideo);

        // --- Glitch Effect ---
        function glitchRandomly() {
            const tiles = document.querySelectorAll('.tile');
            if (tiles.length === 0) return;
            const randomTile = tiles[Math.floor(Math.random() * tiles.length)];
            randomTile.classList.add('glitched');
            setTimeout(() => {
                randomTile.classList.remove('glitched');
            }, Math.random() * 300 + 300);
            setTimeout(glitchRandomly, Math.random() * 4000 + 1000);
        }
        glitchRandomly();