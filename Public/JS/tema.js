// Referencias a elementos
const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll(".nav-links a");

// Lista de colores para los temas
const themes = {
    day: {
        bodyBg: "#f5f7fa",
        textColor: "#333",
        navbarBg: "white",
        linkColor: "#333",
    },
    night: {
        bodyBg: "#2c3e50",
        textColor: "#ecf0f1",
        navbarBg: "#34495e",
        linkColor: "#ecf0f1",
    },
};

// Estado inicial
let isNight = false;

// Cambiar tema con animación
function toggleTheme() {
    isNight = !isNight;
    const theme = isNight ? "night" : "day";

    // Cambiar clases de tema
    body.classList.toggle("night", isNight);
    body.classList.toggle("day", !isNight);
    navbar.classList.toggle("night", isNight);
    navbar.classList.toggle("day", !isNight);
    navLinks.forEach(link => {
        link.classList.toggle("night", isNight);
        link.classList.toggle("day", !isNight);
    });

    // Cambiar ícono del botón
    themeToggle.classList.toggle("night", isNight);
    const icon = themeToggle.querySelector("i");
    icon.classList.toggle("fa-sun", !isNight);
    icon.classList.toggle("fa-moon", isNight);
}

// Evento de clic en el botón
themeToggle.addEventListener("click", toggleTheme);