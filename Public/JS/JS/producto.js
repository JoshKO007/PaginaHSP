// Obtener el parámetro "producto" de la URL
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// URL del JSON de productos
const productosJsonUrl = `JSON/Productos.json?nocache=${new Date().getTime()}`;

// Obtener el nombre del producto seleccionado
const productoSeleccionado = getQueryParam('producto');
console.log('Producto seleccionado:', productoSeleccionado);

// Variable para almacenar los datos del producto seleccionado
let producto = null;

// Mostrar los datos del producto seleccionado
fetch(productosJsonUrl)
    .then(response => response.json())
    .then(productos => {
        producto = productos.find(p => p.nombre.toUpperCase() === productoSeleccionado.toUpperCase());
        console.log('Producto encontrado:', producto);

        const contenedorDetalle = document.getElementById('producto-detalle');
        const contenedorRelacionados = document.querySelector('.productos-grid-unicos');

        if (producto) {
            // Crear el contenido del producto
            contenedorDetalle.innerHTML = `
                <div class="producto-detalle">
                    <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-detalle-img">
                    <div class="producto-detalle-info">
                        <h1>${producto.nombre}</h1>
                        <p><strong>Modelo:</strong> ${producto.numeroModelo}</p>
                        <p><strong>Marca:</strong> ${producto.marca}</p>
                        <p><strong>Categoría:</strong> ${producto.categoria}</p>
                        <p><strong>Descripción:</strong> ${producto.descripcion}</p>
                        <h3>Características:</h3>
                        <ul>
                            ${Object.keys(producto)
                                .filter(key => key.startsWith('caracteristica') && producto[key])
                                .map(key => `<li>${producto[key]}</li>`)
                                .join('')}
                        </ul>
                    </div>
                </div>
            `;

            // Filtrar productos relacionados por marca y categoría
            const relacionados = productos.filter(p =>
                (p.marca === producto.marca || p.categoria === producto.categoria) && p.id !== producto.id
            );

            // Crear las tarjetas de productos relacionados
            contenedorRelacionados.innerHTML = ''; // Limpiar productos relacionados anteriores
            relacionados.forEach(relacionado => {
                const card = document.createElement('div');
                card.classList.add('producto-card-unico');
                card.innerHTML = `
                    <img src="${relacionado.imagen}" alt="${relacionado.nombre}">
                    <h3>${relacionado.nombre}</h3>
                    <p><strong>Marca:</strong> ${relacionado.marca}</p>
                    <p><strong>Categoría:</strong> ${relacionado.categoria}</p>
                    <a href="producto.html?producto=${encodeURIComponent(relacionado.nombre)}" class="ver-mas-btn">Ver más</a>
                `;
                contenedorRelacionados.appendChild(card);
            });
        } else {
            console.error('No se encontró el producto:', productoSeleccionado);
            contenedorDetalle.innerHTML = `<p>No se encontró el producto seleccionado.</p>`;
        }
    })
    .catch(error => console.error('Error al cargar los datos del producto:', error));

// Seleccionar elementos
const cotizarBtn = document.getElementById('cotizarBtn');
const modal = document.getElementById('cotizarModal');
const closeModal = document.getElementById('closeModal');
const whatsappBtn = document.getElementById('whatsappBtn');
const correoBtn = document.getElementById('correoBtn');

// Abrir el modal al hacer clic en el botón de Cotizar
cotizarBtn.addEventListener('click', () => {
    modal.classList.add('show'); // Mostrar el modal
});

// Cerrar el modal al hacer clic en el botón de cerrar
closeModal.addEventListener('click', () => {
    modal.classList.remove('show'); // Ocultar el modal
});

// Cerrar el modal al hacer clic fuera del contenido
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.remove('show'); // Ocultar el modal
    }
});

// Enviar información por WhatsApp
whatsappBtn.addEventListener('click', () => {
    if (!producto) {
        alert('No se ha cargado la información del producto.');
        return;
    }

    // Generar la URL completa de la imagen
    const imagenUrl = `https://www.yolotech.com.mx/${producto.imagen || 'No disponible'}`;
    const mensaje = `Hola, estoy interesado en el siguiente producto:
- *Nombre*: ${producto.nombre}
- Categoría: ${producto.categoria}\n
- *Modelo*: ${producto.numeroModelo}
- *Marca*: ${producto.marca}
- *Descripción*: ${producto.descripcion}
`;
    const whatsappUrl = `https://wa.me/5521726585?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank'); // Abrir WhatsApp en una nueva pestaña
});

// Enviar información por Correo Electrónico
correoBtn.addEventListener('click', () => {
    if (!producto) {
        alert('No se ha cargado la información del producto.');
        return;
    }

    // Generar la URL completa de la imagen
    const imagenUrl = `https://www.yolotech.com.mx/${producto.imagen || 'No disponible'}`;
    const asunto = `Cotización del producto: ${producto.nombre}`;
    const cuerpo = `Hola, estoy interesado en el siguiente producto:\n\n` +
        `- Nombre: ${producto.nombre}\n` +
        '- Categoría: ${producto.categoria}\n' +
        `- Modelo: ${producto.numeroModelo}\n` +
        `- Marca: ${producto.marca}\n` +
        `- Descripción: ${producto.descripcion}\n`;
        const correoUrl = `mailto:rafael_torres@yolotech.com.mx?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`;
    window.location.href = correoUrl; // Abrir el cliente de correo
});