// pm.js – Productos por MARCA desde Supabase

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Credenciales de Supabase (mismas que usas en otros JS)
const SUPABASE_URL = "https://zgjzensxrftkwnojvjqw.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnanplbnN4cmZ0a3dub2p2anF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5OTIwNjgsImV4cCI6MjA4MDU2ODA2OH0.vPJBa0xwr90bYxbNr2jw9ZodJMglKdYUaGjQrnfzeTg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Función principal para cargar productos de una marca
async function cargarProductosPorMarca() {
  const contenedorProductos = document.getElementById("contenedor-items");
  const marcaContenedor = document.getElementById("marca-nombre"); // Contenedor del nombre o logo de la marca

  if (!contenedorProductos) {
    console.error("No se encontró el contenedor de productos (#contenedor-items).");
    return;
  }

  const marcaSeleccionada = getQueryParam("marca");
  if (!marcaSeleccionada) {
    console.warn("No se recibió ?marca= en la URL");
    return;
  }

  // Limpiar el contenedor de productos antes de agregar contenido nuevo
  contenedorProductos.innerHTML = "";

  // 1) Buscar la marca en la tabla 'marcas'
  const { data: marcas, error: marcaError } = await supabase
    .from("marcas")
    .select("id, nombre, imagen")
    .ilike("nombre", marcaSeleccionada);

  if (marcaError) {
    console.error("Error cargando marca desde Supabase:", marcaError);
    return;
  }

  if (!marcas || marcas.length === 0) {
    console.warn("No se encontró la marca seleccionada en la tabla 'marcas'.");
    if (marcaContenedor) {
      marcaContenedor.textContent = marcaSeleccionada;
    }
    return;
  }

  const marca = marcas[0];

  // 2) Mostrar logo de la marca
  if (marcaContenedor) {
    marcaContenedor.innerHTML = "";

    const logoMarca = document.createElement("img");
    logoMarca.src = marca.imagen;
    logoMarca.alt = `Logo de ${marca.nombre}`;
    logoMarca.className = "logo-marca-productos";

    marcaContenedor.appendChild(logoMarca);

    // Ajustar tamaño del logo
    logoMarca.style.maxWidth = "200px";
    logoMarca.style.maxHeight = "100px";
    logoMarca.style.objectFit = "contain";
  }

  // 3) Cargar productos de esa marca desde 'productos'
  const { data: productos, error: prodError } = await supabase
    .from("productos")
    .select("id, nombre, numero_modelo, descripcion, imagen, marca_id, activo")
    .eq("marca_id", marca.id)
    .eq("activo", true)
    .order("nombre", { ascending: true });

  if (prodError) {
    console.error("Error cargando productos:", prodError);
    return;
  }

  if (!productos || productos.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.textContent = "No se encontraron productos para esta marca.";
    contenedorProductos.appendChild(mensaje);
    return;
  }

  // 4) Cargar características para todos los productos de esta marca
  const productIds = productos.map((p) => p.id);
  let caracteristicasPorProducto = {};

  if (productIds.length > 0) {
    const { data: caracteristicas, error: carError } = await supabase
      .from("producto_caracteristicas")
      .select("producto_id, texto, activo")
      .in("producto_id", productIds)
      .eq("activo", true);

    if (carError) {
      console.error("Error cargando características:", carError);
    } else if (caracteristicas) {
      caracteristicasPorProducto = caracteristicas.reduce((acc, row) => {
        if (!acc[row.producto_id]) acc[row.producto_id] = [];
        acc[row.producto_id].push(row.texto);
        return acc;
      }, {});
    }
  }

  // 5) Ordenar productos alfabéticamente (por si acaso)
  productos.sort((a, b) => a.nombre.localeCompare(b.nombre));

  let letraActual = "";

  productos.forEach((producto, index) => {
    const primeraLetra = producto.nombre.charAt(0).toUpperCase();

    // Si la letra cambia, agregar un encabezado con la letra
    if (primeraLetra !== letraActual) {
      letraActual = primeraLetra;

      const encabezadoLetra = document.createElement("h2");
      encabezadoLetra.textContent = letraActual;
      encabezadoLetra.className = "letra-encabezado";
      encabezadoLetra.id = `letra-${letraActual}`;
      contenedorProductos.appendChild(encabezadoLetra);
    }

    // Contenedor para cada producto
    const productoCard = document.createElement("div");
    productoCard.className = `producto-card ${
      index % 2 === 0 ? "izquierda" : "derecha"
    }`;
    productoCard.setAttribute("data-nombre", producto.nombre);

    // Imagen del producto
    const productoImg = document.createElement("img");
    productoImg.src = producto.imagen;
    productoImg.alt = producto.nombre;
    productoImg.className = "producto-img";

    // Contenedor de texto
    const productoTexto = document.createElement("div");
    productoTexto.className = "producto-texto";

    // Nombre del producto
    const productoNombre = document.createElement("h3");
    productoNombre.textContent = producto.nombre;

    // Número de modelo
    const productoModelo = document.createElement("p");
    productoModelo.textContent = `Modelo: ${producto.numero_modelo || ""}`;

    // Marca (solo texto, por si quieres mostrarlo)
    const productoMarca = document.createElement("p");
    productoMarca.textContent = `Marca: ${marca.nombre}`;

    // Descripción
    const productoDescripcion = document.createElement("p");
    productoDescripcion.textContent = producto.descripcion || "";

    // Título de características
    const caracteristicasTitulo = document.createElement("h4");
    caracteristicasTitulo.textContent = "Características";
    caracteristicasTitulo.className = "caracteristicas-titulo";

    // Lista de características
    const productoCaracteristicas = document.createElement("ul");
    productoCaracteristicas.className = "caracteristicas-lista";

    const listaCar = caracteristicasPorProducto[producto.id] || [];
    listaCar.forEach((texto) => {
      const li = document.createElement("li");
      li.textContent = texto;
      productoCaracteristicas.appendChild(li);
    });

    // Botón "Ver más" (por id de producto)
    const verMasBtn = document.createElement("button");
    verMasBtn.textContent = "Ver más";
    verMasBtn.className = "ver-mas-btn-producto";
    verMasBtn.addEventListener("click", () => {
      window.location.href = `producto.html?id=${encodeURIComponent(
        producto.id
      )}`;
    });

    // Armar contenedor de texto
    productoTexto.appendChild(productoNombre);
    productoTexto.appendChild(productoModelo);
    productoTexto.appendChild(productoMarca);
    productoTexto.appendChild(productoDescripcion);
    if (listaCar.length > 0) {
      productoTexto.appendChild(caracteristicasTitulo);
      productoTexto.appendChild(productoCaracteristicas);
    }
    productoTexto.appendChild(verMasBtn);

    // Agregar imagen y texto a la card
    productoCard.appendChild(productoImg);
    productoCard.appendChild(productoTexto);

    // Agregar la tarjeta al contenedor principal
    contenedorProductos.appendChild(productoCard);
  });

  // Limitar el tamaño de las imágenes de los productos
  const productoImgs = document.querySelectorAll(".producto-img");
  productoImgs.forEach((img) => {
    img.style.maxWidth = "800px";
    img.style.maxHeight = "300px";
    img.style.objectFit = "contain";
  });

  // Ajustar vista responsive
  ajustarVistaProductos();
}

// Función para ajustar la vista en pantallas pequeñas
function ajustarVistaProductos() {
  const productosCards = document.querySelectorAll(".producto-card");

  productosCards.forEach((card) => {
    const productoTexto = card.querySelector(".producto-texto");
    const productoNombre = card.querySelector("h3");
    const verMasBtn = card.querySelector(".ver-mas-btn-producto");

    // Obtener el nombre del producto desde el atributo data-nombre
    const nombreProducto = card.getAttribute("data-nombre");

    if (window.innerWidth <= 1000) {
      // Ocultar el contenedor de texto y mostrar solo el nombre y el botón
      if (productoTexto) productoTexto.style.display = "none";

      if (productoNombre) {
        productoNombre.style.display = "block";
        productoNombre.textContent = nombreProducto;
        productoNombre.style.textAlign = "center";
        productoNombre.style.fontSize = "1.2rem";
        productoNombre.style.marginBottom = "10px";
        productoNombre.style.fontWeight = "bold";
      }

      if (verMasBtn) {
        verMasBtn.style.display = "block";
        verMasBtn.style.marginTop = "10px";
        verMasBtn.style.padding = "8px 16px";
        verMasBtn.style.fontSize = "0.9rem";
        verMasBtn.style.cursor = "pointer";
      }
    } else {
      // Restaurar la vista completa en pantallas grandes
      if (productoTexto) productoTexto.style.display = "flex";
      if (productoNombre) {
        productoNombre.style.display = "block";
        productoNombre.style.textAlign = "";
        productoNombre.style.fontSize = "";
        productoNombre.style.marginBottom = "";
        productoNombre.style.fontWeight = "";
      }
      if (verMasBtn) {
        verMasBtn.style.display = "block";
        verMasBtn.style.marginTop = "";
        verMasBtn.style.padding = "";
        verMasBtn.style.fontSize = "";
        verMasBtn.style.cursor = "";
      }
    }
  });
}

// Llamar a la función al redimensionar la ventana
window.addEventListener("resize", ajustarVistaProductos);

document.addEventListener("DOMContentLoaded", () => {
  const contenedorLetras = document.querySelector(".letra-lista");

  if (!contenedorLetras) {
    console.error("El contenedor de letras no se encontró.");
  } else {
    // Limpiar el contenedor de letras antes de generar contenido nuevo
    contenedorLetras.innerHTML = "";

    // Generar letras de la A a la Z
    const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    letras.forEach((letra) => {
      const li = document.createElement("li");
      li.textContent = letra;
      li.className = "letra-item";

      li.addEventListener("click", () => {
        const target = document.getElementById(`letra-${letra}`);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        } else {
          console.warn(`No se encontró la sección para la letra: ${letra}`);
        }
      });

      contenedorLetras.appendChild(li);
    });
  }

  // Cargar productos de la marca desde Supabase
  cargarProductosPorMarca();
});