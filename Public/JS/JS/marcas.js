// Obtener el contenedor
const contenedor = document.getElementById('marcas-grid'); // Cambiado de contenedor-items a marcas-grid

// Cargar y procesar el JSON
fetch('JSON/marcas.json') 
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      // Crear un elemento para cada marca
      const elemento = document.createElement('div');
      elemento.className = 'marca-item'; // Clase para estilos CSS

      // Agregar la imagen (si existe la URL)
      if (item.imagen) {
        const imagen = document.createElement('img');
        imagen.src = item.imagen;
        imagen.alt = item.nombre;
        imagen.className = 'marca-img'; // Clase para estilos de la imagen
        elemento.appendChild(imagen);
      }

      // Agregar un botón "Ver productos"
      const boton = document.createElement('button');
      boton.className = 'ver-productos-btn';
      boton.textContent = 'Ver productos';
      boton.addEventListener('click', () => {
        // Redirigir a PM.html con el nombre de la marca como parámetro
        window.location.href = `PM.html?marca=${encodeURIComponent(item.nombre)}`;
      });
      elemento.appendChild(boton);

      // Añadir el elemento al contenedor
      contenedor.appendChild(elemento);
    });
  })
  .catch(error => console.error('Error al cargar el JSON:', error));