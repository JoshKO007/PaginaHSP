const canvas = document.getElementById('backgroundCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const particlesArray = [];

// Crear partículas
class Particle {
    constructor(x, y, size, color, speedX, speedY) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.color = color;
        this.speedX = speedX;
        this.speedY = speedY;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Rebotar en los bordes
        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Inicializar partículas
function initParticles() {
    particlesArray.length = 0;
    const numberOfParticles = 100;
    for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 5 + 1;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = (Math.random() - 0.5) * 2;
        const speedY = (Math.random() - 0.5) * 2;
        const color = `rgba(42, 122, 233, ${Math.random()})`;
        particlesArray.push(new Particle(x, y, size, color, speedX, speedY));
    }
}

// Animar partículas
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach((particle) => {
        particle.update();
        particle.draw();
    });
    requestAnimationFrame(animateParticles);
}

// Ajustar tamaño del canvas al cambiar el tamaño de la ventana
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
});

// Iniciar animación
initParticles();
animateParticles();