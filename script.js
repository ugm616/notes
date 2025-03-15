document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.grid-button');
    const modal = document.getElementById('modal');
    const closeButton = document.querySelector('.close-button');
    const audioElement = document.getElementById('audio-element');
    const audioTitle = document.querySelector('.audio-title');
    
    // Audio player elements
    const playPauseButton = document.getElementById('play-pause-button');
    const playIcon = playPauseButton.querySelector('.play-icon');
    const pauseIcon = playPauseButton.querySelector('.pause-icon');
    const progressBar = document.querySelector('.progress-fill');
    const progressContainer = document.querySelector('.progress-bar');
    const currentTimeDisplay = document.querySelector('.current-time');
    const totalTimeDisplay = document.querySelector('.total-time');
    const volumeSlider = document.querySelector('.volume-slider');
    
    // Track the currently active button
    let activeButton = null;

    // Format time in MM:SS
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    }

    // Update progress bar and time display
    function updateProgress() {
        const percent = (audioElement.currentTime / audioElement.duration) * 100;
        progressBar.style.width = `${percent}%`;
        currentTimeDisplay.textContent = formatTime(audioElement.currentTime);
    }

    // Add click event to all buttons
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Reset previous active button if exists
            if (activeButton) {
                activeButton.classList.remove('active-button');
            }
            
            // Set this button as active
            this.classList.add('active-button');
            activeButton = this;
            
            // Get the mp3 file path from data attribute
            const mp3File = this.getAttribute('data-mp3');
            const buttonText = this.textContent;
            
            // Set the audio title
            audioTitle.textContent = buttonText;
            
            // Set audio source
            audioElement.src = mp3File;
            
            // Reset player state
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline-block';
            
            // Start playing
            audioElement.play();
            
            // Show modal
            modal.style.display = 'flex';
        });
    });
    
    // Play/Pause button
    playPauseButton.addEventListener('click', function() {
        if (audioElement.paused) {
            audioElement.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'inline-block';
        } else {
            audioElement.pause();
            playIcon.style.display = 'inline-block';
            pauseIcon.style.display = 'none';
        }
    });
    
    // Progress bar click
    progressContainer.addEventListener('click', function(e) {
        const rect = progressContainer.getBoundingClientRect();
        const clickPosition = (e.clientX - rect.left) / rect.width;
        audioElement.currentTime = clickPosition * audioElement.duration;
    });
    
    // Volume slider
    volumeSlider.addEventListener('input', function() {
        audioElement.volume = this.value;
    });
    
    // Audio events
    audioElement.addEventListener('timeupdate', updateProgress);
    
    audioElement.addEventListener('loadedmetadata', function() {
        totalTimeDisplay.textContent = formatTime(audioElement.duration);
    });
    
    audioElement.addEventListener('ended', function() {
        playIcon.style.display = 'inline-block';
        pauseIcon.style.display = 'none';
        progressBar.style.width = '0%';
        currentTimeDisplay.textContent = '0:00';
    });
    
    // Close modal when clicking the X
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';
        audioElement.pause();
    });
    
    // Close modal when clicking outside content
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
            audioElement.pause();
        }
    });
});