// Obtener el contenedor
const contenedor = document.getElementById('contenedor-items');

// Cargar y procesar el JSON
fetch('JSON/marcas.json') 
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      // Crear un elemento para cada item (ej. una tarjeta)
      const elemento = document.createElement('div');
      elemento.className = 'item';  // Clase para estilos CSS

      // Agregar la imagen (si existe la URL)
      if (item.imagen) {
        const imagen = document.createElement('img');
        imagen.src = item.imagen;
        imagen.alt = item.nombre;
        imagen.style.width = '1000px'; // Ajustar el ancho de la imagen
        imagen.style.height = 'auto'; // Mantener proporciones
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