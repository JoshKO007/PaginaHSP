// Seleccionar elementos
const cotizarBtn = document.querySelector('.cotizar-btn'); // Asegúrate de que esta clase exista en el HTML
const modal = document.getElementById('cotizarModal');
const closeBtn = document.querySelector('.close-btn');
const whatsappBtn = document.querySelector('.modal-option.whatsapp');
const correoBtn = document.querySelector('.modal-option.correo');

// Verificar si el botón de "Cotizar" existe antes de agregar el evento
if (cotizarBtn) {
    // Abrir el modal al hacer clic en el botón de Cotizar
    cotizarBtn.addEventListener('click', () => {
        modal.classList.add('show'); // Mostrar el modal
    });
}

// Cerrar el modal al hacer clic en el botón de cerrar
if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('show'); // Ocultar el modal
    });
}

// Cerrar el modal al hacer clic fuera del contenido
if (modal) {
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('show'); // Ocultar el modal
        }
    });
}

// Obtener el parámetro "producto" de la URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// URL del JSON de productos
const productosJsonUrl = `JSON/Productos.json?nocache=${new Date().getTime()}`;

// Obtener el nombre del producto seleccionado
const productoSeleccionado = getQueryParam('producto');

// Variable para almacenar los datos del producto seleccionado
let producto = null;

// Cargar los datos del producto desde el JSON
fetch(productosJsonUrl)
    .then((response) => response.json())
    .then((productos) => {
        // Buscar el producto por nombre
        producto = productos.find(
            (p) => p.nombre.toUpperCase() === productoSeleccionado.toUpperCase()
        );

        if (!producto) {
            console.error('Producto no encontrado en el JSON.');
        } else {
            console.log('Producto cargado:', producto);
        }
    })
    .catch((error) => console.error('Error al cargar el JSON:', error));

// Enviar información por WhatsApp
if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
        if (!producto) {
            alert('No se ha cargado la información del producto.');
            return;
        }

        const mensaje = `Hola, estoy interesado en el siguiente producto:
- *Nombre*: ${producto.nombre}
- *Modelo*: ${producto.numeroModelo || 'No especificado'}
- *Marca*: ${producto.marca || 'No especificado'}
- *Descripción*: ${producto.descripcion || 'No especificado'}
- *Imagen*: ${producto.imagen || 'No disponible'}
`;
        const whatsappUrl = `https://wa.me/5634674986?text=${encodeURIComponent(mensaje)}`;
        window.open(whatsappUrl, '_blank'); // Abrir WhatsApp en una nueva pestaña
    });
}

// Enviar información por Correo Electrónico
if (correoBtn) {
    correoBtn.addEventListener('click', () => {
        if (!producto) {
            alert('No se ha cargado la información del producto.');
            return;
        }

        const asunto = `Cotización del producto: ${producto.nombre}`;
        const cuerpo = `Hola, estoy interesado en el siguiente producto:\n\n` +
            `- Nombre: ${producto.nombre}\n` +
            `- Modelo: ${producto.numeroModelo || 'No especificado'}\n` +
            `- Marca: ${producto.marca || 'No especificado'}\n` +
            `- Descripción: ${producto.descripcion || 'No especificado'}\n` +
            `- Imagen: ${producto.imagen || 'No disponible'}\n\n`;
        const correoUrl = `mailto:correo@ejemplo.com?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
        window.location.href = correoUrl; // Abrir el cliente de correo
    });
}