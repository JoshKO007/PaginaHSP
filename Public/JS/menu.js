const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const hamburgerMenu = document.getElementById('hamburgerMenu');
const dropdown = document.querySelector('.dropdown');
const dropdownContent = document.querySelector('.dropdown-content');

// Alternar el menú hamburguesa al hacer clic en el botón
menuToggle.addEventListener('click', () => {
    hamburgerMenu.classList.toggle('active'); // Alternar la clase para mostrar/ocultar el menú
});

// Alternar el contenido del menú desplegable al hacer clic en "Categorías"
dropdown.addEventListener('click', (event) => {
    event.stopPropagation(); // Evitar que el clic se propague
    dropdownContent.classList.toggle('active'); // Alternar la clase para mostrar/ocultar el contenido
});

// Cerrar el menú hamburguesa al hacer clic fuera de él
document.addEventListener('click', (event) => {
    if (!menuToggle.contains(event.target) && !hamburgerMenu.contains(event.target)) {
        hamburgerMenu.classList.remove('active'); // Ocultar el menú
    }
    if (!dropdown.contains(event.target)) {
        dropdownContent.classList.remove('active'); // Ocultar el contenido del menú desplegable
    }
});

// Función para manejar el cambio de tamaño de la ventana
function handleResize() {
    if (window.innerWidth > 768) {
        hamburgerMenu.classList.remove('active'); // Ocultar el menú en pantallas grandes
        dropdownContent.classList.remove('active'); // Asegurarse de que el contenido del menú desplegable esté oculto
    }
}

// Escuchar el evento de cambio de tamaño de la ventana
window.addEventListener('resize', handleResize);
