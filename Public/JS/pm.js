function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// URLs de los JSON
const productosJsonUrl = `JSON/Productos.json?nocache=${new Date().getTime()}`;
const marcasJsonUrl = `JSON/Marcas.json?nocache=${new Date().getTime()}`;

// Obtener la marca seleccionada
const marcaSeleccionada = getQueryParam('marca');

// Mostrar el nombre de la marca seleccionada
fetch(marcasJsonUrl)
  .then(response => response.json())
  .then(marcas => {
    const marcaContenedor = document.getElementById('marca-nombre'); // Contenedor del texto
    const marca = marcas.find(m => m.nombre === marcaSeleccionada); // Buscar la marca seleccionada en el JSON

    if (marcaContenedor) {
      if (marca) {
        // Asignar el nombre de la marca al contenedor
        marcaContenedor.textContent = `${marcaSeleccionada}`;
      } else {
        console.error('No se encontró la marca seleccionada.');
        marcaContenedor.textContent = 'Marca no encontrada.';
      }
    } else {
      console.error('El contenedor del nombre de la marca no se encontró.');
    }
  })
  .catch(error => {
    console.error('Error al cargar el JSON de marcas:', error);
  });

// Mostrar los productos de la marca seleccionada
fetch(productosJsonUrl)
  .then(response => response.json())
  .then(data => {
    const contenedorProductos = document.getElementById('contenedor-items');

    // Limpiar el contenedor de productos antes de agregar contenido nuevo
    contenedorProductos.innerHTML = '';

    // Agregar la imagen de la marca, las instrucciones y el índice de letras al inicio del contenedor
    fetch(marcasJsonUrl)
      .then(response => response.json())
      .then(marcas => {
        const marca = marcas.find(m => m.nombre === marcaSeleccionada); // Buscar la marca seleccionada en el JSON

        if (marca && marca.imagen) {
          // Crear la imagen de la marca
          const imagenMarca = document.createElement('img');
          imagenMarca.src = marca.imagen; // Ruta de la imagen
          imagenMarca.alt = `Logo de ${marcaSeleccionada}`; // Texto alternativo
          imagenMarca.className = 'imagen-marca-productos'; // Clase para estilos
          contenedorProductos.appendChild(imagenMarca); // Agregar al inicio del contenedor
        } else {
          console.error('No se encontró la imagen para la marca seleccionada.');
        }

        // Crear las instrucciones del índice de filtro
        const instrucciones = document.createElement('p');
        instrucciones.textContent = 'Seleccione una letra para explorar los productos disponibles que comienzan con ella:';
        instrucciones.className = 'letra-instrucciones'; // Clase para estilos
        contenedorProductos.appendChild(instrucciones); // Agregar después de la imagen

        // Crear el índice de letras
        const contenedorLetras = document.createElement('ul');
        contenedorLetras.className = 'letra-lista'; // Clase para estilos

        const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        letras.forEach(letra => {
          const li = document.createElement('li');
          li.textContent = letra;
          li.className = 'letra-item'; // Clase para estilos

          li.addEventListener('click', () => {
            const target = document.getElementById(`letra-${letra}`);
            if (target) {
              target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            } else {
              console.warn(`No se encontró la sección para la letra: ${letra}`);
            }
          });

          contenedorLetras.appendChild(li);
        });

        contenedorProductos.appendChild(contenedorLetras); // Agregar después de las instrucciones
      })
      .catch(error => console.error('Error al cargar el JSON de marcas:', error));

    // Filtrar productos por la marca seleccionada
    const productosFiltrados = data.filter(producto => producto.marca === marcaSeleccionada);

    if (productosFiltrados.length > 0) {
      // Ordenar los productos alfabéticamente por nombre
      productosFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));

      let letraActual = ''; // Variable para rastrear la letra actual

      productosFiltrados.forEach((producto, index) => {
        const primeraLetra = producto.nombre.charAt(0).toUpperCase(); // Obtener la primera letra del nombre

        // Si la letra cambia, agregar un encabezado con la letra
        if (primeraLetra !== letraActual) {
          letraActual = primeraLetra;

          const encabezadoLetra = document.createElement('h2');
          encabezadoLetra.textContent = letraActual;
          encabezadoLetra.className = 'letra-encabezado'; // Clase para estilos
          encabezadoLetra.id = `letra-${letraActual}`; // Agregar ID para desplazamiento
          contenedorProductos.appendChild(encabezadoLetra);
        }

        // Crear un contenedor para cada producto
        const productoCard = document.createElement('div');
        productoCard.className = `producto-card ${index % 2 === 0 ? 'izquierda' : 'derecha'}`; // Alternar clases
        productoCard.setAttribute('data-nombre', producto.nombre); // Agregar atributo data-nombre

        // Imagen del producto
        const productoImg = document.createElement('img');
        productoImg.src = producto.imagen;
        productoImg.alt = producto.nombre;
        productoImg.className = 'producto-img';

        // Contenedor de texto
        const productoTexto = document.createElement('div');
        productoTexto.className = 'producto-texto';

        // Nombre del producto
        const productoNombre = document.createElement('h3');
        productoNombre.textContent = producto.nombre;

        // Número de modelo
        const productoModelo = document.createElement('p');
        productoModelo.textContent = `Modelo: ${producto.numeroModelo}`;

        // Marca
        const productoMarca = document.createElement('p');
        productoMarca.textContent = `Marca: ${producto.marca}`;

        // Descripción
        const productoDescripcion = document.createElement('p');
        productoDescripcion.textContent = producto.descripcion;

        // Título de características
        const caracteristicasTitulo = document.createElement('h4');
        caracteristicasTitulo.textContent = 'Características';
        caracteristicasTitulo.className = 'caracteristicas-titulo';

        // Crear la lista de características
        const productoCaracteristicas = document.createElement('ul');
        productoCaracteristicas.className = 'caracteristicas-lista';

        for (let i = 1; i <= 10; i++) {
          const caracteristica = producto[`caracteristica${i}`];
          if (caracteristica) {
            const li = document.createElement('li');
            li.textContent = caracteristica;
            productoCaracteristicas.appendChild(li);
          }
        }

        // Botón "Ver más"
        const verMasBtn = document.createElement('button');
        verMasBtn.textContent = 'Ver más';
        verMasBtn.className = 'ver-mas-btn-producto';
        verMasBtn.addEventListener('click', () => {
          alert(`Más información sobre: ${producto.nombre}`);
        });

        // Agregar elementos al contenedor de texto
        productoTexto.appendChild(productoNombre);
        productoTexto.appendChild(productoModelo);
        productoTexto.appendChild(productoMarca);
        productoTexto.appendChild(productoDescripcion);
        productoTexto.appendChild(caracteristicasTitulo);
        productoTexto.appendChild(productoCaracteristicas);
        productoTexto.appendChild(verMasBtn);

        // Agregar imagen y texto al contenedor principal
        productoCard.appendChild(productoImg);
        productoCard.appendChild(productoTexto);

        // Agregar la tarjeta al contenedor principal
        contenedorProductos.appendChild(productoCard);
      });
    } else {
      // Mostrar mensaje si no hay productos para la marca seleccionada
      const mensaje = document.createElement('p');
      mensaje.textContent = 'No se encontraron productos para esta marca.';
      contenedorProductos.appendChild(mensaje);
    }
  })
  .catch(error => console.error('Error al cargar el JSON de productos:', error));

// Función para ajustar la vista en pantallas pequeñas
function ajustarVistaProductos() {
  const productosCards = document.querySelectorAll('.producto-card');

  productosCards.forEach(card => {
    const productoTexto = card.querySelector('.producto-texto');
    const productoNombre = card.querySelector('h3');
    const verMasBtn = card.querySelector('.ver-mas-btn-producto');

    // Obtener el nombre del producto desde el atributo data-nombre
    const nombreProducto = card.getAttribute('data-nombre');

    if (window.innerWidth <= 1000) {
      // Ocultar el contenedor de texto y mostrar solo el nombre y el botón
      if (productoTexto) productoTexto.style.display = 'none';

      // Mostrar o crear dinámicamente el título
      if (productoNombre) {
        productoNombre.style.display = 'block';
        productoNombre.textContent = nombreProducto; // Asegurarse de que tenga el texto correcto
        productoNombre.style.textAlign = 'center';
        productoNombre.style.fontSize = '1.2rem';
        productoNombre.style.marginBottom = '10px';
        productoNombre.style.fontWeight = 'bold';
      }

      // Mostrar el botón
      if (verMasBtn) {
        verMasBtn.style.display = 'block';
        verMasBtn.style.marginTop = '10px';
        verMasBtn.style.padding = '8px 16px';
        verMasBtn.style.fontSize = '0.9rem';
        verMasBtn.style.cursor = 'pointer';
      }
    } else {
      // Restaurar la vista completa en pantallas grandes
      if (productoTexto) productoTexto.style.display = 'flex'; // Mostrar el texto completo
      if (productoNombre) {
        productoNombre.style.display = 'block'; // Mostrar el título completo
        productoNombre.style.textAlign = ''; // Restaurar estilos originales
        productoNombre.style.fontSize = '';
        productoNombre.style.marginBottom = '';
        productoNombre.style.fontWeight = '';
      }
      if (verMasBtn) {
        verMasBtn.style.display = 'block'; // Mostrar el botón original
        verMasBtn.style.marginTop = ''; // Restaurar estilos originales
        verMasBtn.style.padding = '';
        verMasBtn.style.fontSize = '';
        verMasBtn.style.cursor = '';
      }
    }
  });
}

// Llamar a la función al redimensionar la ventana
window.addEventListener('resize', ajustarVistaProductos);

document.addEventListener('DOMContentLoaded', () => {
  const contenedorLetras = document.querySelector('.letra-lista');

  if (!contenedorLetras) {
    console.error('El contenedor de letras no se encontró.');
    return;
  }

  // Limpiar el contenedor de letras antes de generar contenido nuevo
  contenedorLetras.innerHTML = '';

  // Generar letras de la A a la Z
  const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  letras.forEach(letra => {
    const li = document.createElement('li');
    li.textContent = letra;
    li.className = 'letra-item';

    li.addEventListener('click', () => {
      const target = document.getElementById(`letra-${letra}`);
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      } else {
        console.warn(`No se encontró la sección para la letra: ${letra}`);
      }
    });

    contenedorLetras.appendChild(li);
  });
});