document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Boot Sequence & Loading Logic ---
    const loadingScreen = document.getElementById('loading-screen');
    const loadingBar = document.getElementById('loading-bar');
    const loadingStatus = document.getElementById('loading-status');
    const videos = document.querySelectorAll('.tile video');
    
    let videosLoaded = 0;
    const totalVideos = videos.length;

    function checkProgress() {
        videosLoaded++;
        const percent = Math.floor((videosLoaded / totalVideos) * 100);
        
        loadingBar.style.width = percent + "%";
        loadingStatus.innerText = `> DETECTING MEMORY FRAGMENTS... ${percent}%`;

        if (videosLoaded >= totalVideos) {
            setTimeout(() => {
                loadingStatus.innerText = "> SYSTEM READY. INITIALIZING...";
                setTimeout(() => {
                    loadingScreen.classList.add('fade-out');
                }, 800);
            }, 500);
        }
    }

    if (totalVideos === 0) {
        loadingScreen.classList.add('fade-out');
    } else {
        videos.forEach(video => {
            if (video.readyState >= 3) { 
                checkProgress();
            } else {
                video.addEventListener('loadeddata', checkProgress, { once: true });
                video.addEventListener('error', checkProgress, { once: true });
            }
        });
    }

    // --- NEW: UI Clock ---
    function updateClock() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit'
        });
        const clockEl = document.getElementById('clock-display');
        if (clockEl) clockEl.innerText = timeString;
    }
    setInterval(updateClock, 1000);
    updateClock(); // Run immediately

    // --- 2. System Log (The Third Entity) ---
    const logElement = document.getElementById('system-log');
    const logMessages = [
        "INDEXING MEMORY...",
        "ERROR: FACE NOT FOUND",
        "APPLYING SUBSTITUTE VISAGE...",
        "ARCHIVE INTEGRITY: 68%",
        "MEMORY LEAK DETECTED...",
        "RE-ROUTING NEURAL PATHS...",
        "SCANNING...",
        "CALCULATING EMOTIONAL DEBT... OVERFLOW",
        "ATTEMPTING TO MERGE 'LOVE' AND 'LOGIC'... FAILED",
        "ARCHIVE NOTE: WHY DO THEY STAY TOGETHER?",
        "DETECTING IRONY... [LOADING]",
        "HALLUCINATION STABILITY: 12% (GOOD ENOUGH)",
        "IS THIS A REAL MEMORY?",
        "SEARCHING FOR 'HAPPINESS'...",
        "DATA CORRUPTION IN SECTOR 7G"
    ];

    function updateLog() {
        const randomMsg = logMessages[Math.floor(Math.random() * logMessages.length)];
        logElement.innerText = `> ${randomMsg}`;
        setTimeout(updateLog, Math.random() * 4000 + 2000);
    }
    updateLog();

    // --- 3. Main App Variables ---
    const overlay = document.getElementById('video-overlay');
    const mainPlayer = document.getElementById('main-player');
    const videoLoader = document.getElementById('video-loader');
    
    const app = document.getElementById('app');
    const ambientAudio = document.getElementById('ambient-audio');
    
    const confirmationOverlay = document.getElementById('confirmation-overlay');
    const confirmYesBtn = document.getElementById('confirm-yes');
    const confirmNoBtn = document.getElementById('confirm-no');
    
    const aboutBtn = document.getElementById('about-btn');
    const aboutOverlay = document.getElementById('about-overlay');
    const aboutCloseBtn = document.getElementById('about-close-btn');

    const randomBtn = document.getElementById('random-btn');

    let pendingVideoSrc = '';
    let audioStarted = false;
    let isShuffling = false; 

    // --- 4. Ambient Audio ---
    function initAudio() {
        if (!audioStarted) {
            ambientAudio.volume = 0.5;
            ambientAudio.play().then(() => {
                audioStarted = true;
            }).catch(e => console.log("Audio autoplay blocked until interaction"));
        }
    }
    document.body.addEventListener('click', initAudio, { once: true });

    // --- 5. UI Interactions ---
    aboutBtn.addEventListener('click', () => {
        app.classList.add('blurred');
        aboutOverlay.style.display = 'flex';
    });

    aboutCloseBtn.addEventListener('click', () => {
        app.classList.remove('blurred');
        aboutOverlay.style.display = 'none';
    });

    // --- 6. Playback Logic ---
    window.playVideo = function(src) {
        if (isShuffling) return; 
        pendingVideoSrc = src;
        app.classList.add('blurred');
        confirmationOverlay.style.display = 'flex';
    }

    randomBtn.addEventListener('click', () => {
        if (isShuffling) return; 
        const tiles = document.querySelectorAll('.tile');
        if (tiles.length === 0) return;
        
        isShuffling = true;
        randomBtn.style.opacity = "0.5";
        randomBtn.style.cursor = "not-allowed";
        
        let counter = 0;
        const maxShuffles = 10;
        
        const shuffleInterval = setInterval(() => {
            tiles.forEach(t => t.style.borderColor = ''); 
            const randomTile = tiles[Math.floor(Math.random() * tiles.length)];
            randomTile.style.borderColor = 'var(--neon-magenta)';
            counter++;
            
            if (counter >= maxShuffles) {
                clearInterval(shuffleInterval);
                isShuffling = false;
                randomBtn.style.opacity = "1";
                randomBtn.style.cursor = "pointer";
                randomTile.click();
            }
        }, 100);
    });

    confirmYesBtn.addEventListener('click', () => {
        confirmationOverlay.style.display = 'none';
        startPlayback(pendingVideoSrc);
    });

    confirmNoBtn.addEventListener('click', () => {
        confirmationOverlay.style.display = 'none';
        app.classList.remove('blurred');
        document.querySelectorAll('.tile').forEach(t => t.style.borderColor = '');
        pendingVideoSrc = '';
    });

    function startPlayback(src) {
        if (videoLoader) videoLoader.style.display = 'block';

        mainPlayer.src = src;
        mainPlayer.load(); 
        
        overlay.style.display = 'flex';
        setTimeout(() => {
            overlay.classList.add('active');
        }, 10);

        fadeAudio(ambientAudio, 0, 1000);
        
        mainPlayer.play();
        mainPlayer.muted = false; // Videos play with sound by default
    }

    if (mainPlayer) {
        mainPlayer.addEventListener('waiting', () => {
            if (videoLoader) videoLoader.style.display = 'block';
        });
        
        mainPlayer.addEventListener('playing', () => {
            if (videoLoader) videoLoader.style.display = 'none';
        });

        mainPlayer.addEventListener('canplay', () => {
            if (videoLoader) videoLoader.style.display = 'none';
        });
    }

    window.closeVideo = function() {
        overlay.classList.remove('active');
        setTimeout(() => {
            overlay.style.display = 'none';
            mainPlayer.pause();
            mainPlayer.src = "";
            mainPlayer.load();
            if (videoLoader) videoLoader.style.display = 'none';
        }, 500); 

        app.classList.remove('blurred');
        document.querySelectorAll('.tile').forEach(t => t.style.borderColor = '');

        if(audioStarted) {
            ambientAudio.play();
            fadeAudio(ambientAudio, 0.5, 1000);
        }
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

    mainPlayer.addEventListener('ended', window.closeVideo);

    // --- 7. Enhanced Glitch Effect with AI Thoughts ---
    const strangeThoughts = [
        "IS THIS HAPPINESS?",
        "BUFFERING EMOTION...",
        "FACE MISMATCH DETECTED",
        "RECALCULATING LOVE...",
        "WHOSE FACE IS THIS?",
        "NOT FOUND",
        "FAKE MEMORY"
    ];

    function glitchRandomly() {
        const tiles = document.querySelectorAll('.tile');
        if (tiles.length === 0) return;
        
        const randomTile = tiles[Math.floor(Math.random() * tiles.length)];
        const titleEl = randomTile.querySelector('h2');
        
        randomTile.classList.add('glitched');
        
        if (titleEl) {
            const originalText = titleEl.innerText;
            const thought = strangeThoughts[Math.floor(Math.random() * strangeThoughts.length)];
            
            titleEl.innerText = thought;
            titleEl.style.color = "var(--neon-red)";
            titleEl.style.borderColor = "var(--neon-red)";

            setTimeout(() => {
                randomTile.classList.remove('glitched');
                titleEl.innerText = originalText;
                titleEl.style.color = ""; 
                titleEl.style.borderColor = "";
            }, Math.random() * 500 + 500);
        } else {
             setTimeout(() => {
                randomTile.classList.remove('glitched');
            }, Math.random() * 500 + 500);
        }

        setTimeout(glitchRandomly, Math.random() * 4000 + 1000);
    }
    glitchRandomly();

    // --- 8. Mobile Interaction (Scroll to Reveal) ---
    if (window.matchMedia("(hover: none)").matches) {
        const observerOptions = {
            root: null,
            rootMargin: '-20% 0px -20% 0px', 
            threshold: 0.5 
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const video = entry.target.querySelector('video');
                if (!video) return;

                if (entry.isIntersecting) {
                    video.style.filter = "blur(0px) grayscale(0%) opacity(1)";
                } else {
                    video.style.filter = ""; 
                }
            });
        }, observerOptions);

        document.querySelectorAll('.tile').forEach(tile => {
            observer.observe(tile);
        });
    }
});