document.addEventListener('DOMContentLoaded', function () {
    const video = document.querySelector('.video');

    // Prevenir que el video entre en pantalla completa al hacer doble clic
    video.addEventListener('dblclick', function (event) {
        event.preventDefault();
    });

    // Asegurarse de que los controles estén deshabilitados
    video.controls = false;

    // Pausar/reproducir al hacer clic
    video.addEventListener('click', function () {
        if (this.paused) {
            this.play();
        } else {
            this.pause();
        }
    });
});