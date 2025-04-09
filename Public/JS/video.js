document.addEventListener('DOMContentLoaded', function() {
    const video = document.querySelector('.video');
    
    // Pausar/reproducir al hacer clic
    video.addEventListener('click', function() {
        if (this.paused) {
            this.play();
        } else {
            this.pause();
        }
    });
    
    // Reproducir automáticamente (con mute)
    video.play();
});