const video = document.querySelector('.video');
const videoContainer = document.querySelector('.video-container');

// Evento cuando el video termina
video.addEventListener('ended', () => {
    videoContainer.classList.add('fade-to-black'); // Agrega la clase para la transición a negro
});

// Evento cuando el video comienza a reproducirse
video.addEventListener('play', () => {
    videoContainer.classList.remove('fade-to-black'); // Quita la clase de transición a negro
    videoContainer.classList.add('fade-from-black'); // Agrega la clase para la transición desde negro

    // Elimina la clase después de la transición
    setTimeout(() => {
        videoContainer.classList.remove('fade-from-black');
    }, 10000); // Duración de la transición (10 segundos)
});