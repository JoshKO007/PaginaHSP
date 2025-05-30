document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
const dropdowns = document.querySelectorAll('.dropdown'); 

// Ensure dropdowns do not overflow
dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('a');
    
    link.addEventListener('click', function(e) {
        if (window.innerWidth <= 992) {
            e.preventDefault();
            dropdown.classList.toggle('active');
            
            // Cerrar otros dropdowns
            dropdowns.forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
        }
    });
    
    // Close dropdown if clicked outside
    document.addEventListener('click', function(event) {
        if (!dropdown.contains(event.target) && !link.contains(event.target)) {
            dropdown.classList.remove('active');
        }
    });
});
    
    // Menú hamburguesa
    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });
    
    // Dropdowns en móvil
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                dropdown.classList.toggle('active');
                
                // Cerrar otros dropdowns
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
            }
        });
    });
    
    // Cerrar menú al hacer clic en un enlace
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 992) {
                navLinks.classList.remove('active');
            }
        });
    });
});