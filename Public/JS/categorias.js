// URL del JSON de categorías
const categoriasJsonUrl = `JSON/categorias.json?nocache=${new Date().getTime()}`;

// Cargar las categorías y mostrarlas en el contenedor
fetch(categoriasJsonUrl)
  .then(response => response.json())
  .then(categorias => {
    const categoriasGrid = document.querySelector('.categorias-grid');

    // Ordenar las categorías alfabéticamente por el atributo "nombre"
    categorias.sort((a, b) => a.nombre.localeCompare(b.nombre));

    // Tomar solo las primeras 7 categorías
    const primerasCategorias = categorias.slice(0, 6);

    // Generar dinámicamente las primeras 7 categorías
    primerasCategorias.forEach(categoria => {
      // Crear un contenedor para la categoría
      const categoriaItem = document.createElement('div');
      categoriaItem.className = 'categoria-item'; // Clase para estilos

      // Crear el enlace que envolverá la imagen y el texto
      const link = document.createElement('a');
      link.href = `categorias.html?categoria=${encodeURIComponent(categoria.nombre)}`; // Enlace dinámico
      link.className = 'categoria-link'; // Clase para estilos

      // Crear la imagen de la categoría
      const img = document.createElement('img');
      img.src = categoria.imagen; // Ruta de la imagen desde el JSON
      img.alt = categoria.nombre; // Texto alternativo

      // Crear el texto del nombre de la categoría
      const nombre = document.createElement('p');
      nombre.textContent = categoria.nombre; // Nombre de la categoría

      // Agregar la imagen y el texto al enlace
      link.appendChild(img);
      link.appendChild(nombre);

      // Agregar el enlace al contenedor
      categoriaItem.appendChild(link);

      // Agregar el contenedor al grid
      categoriasGrid.appendChild(categoriaItem);
    });
  })
  .catch(error => console.error('Error al cargar el JSON de categorías:', error));