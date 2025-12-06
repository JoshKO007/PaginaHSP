// --- CAT.js: Carga de productos por CATEGORÍA desde Supabase ---

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Credenciales de Supabase (mismas que usas en categorias.js)
const SUPABASE_URL = "https://zgjzensxrftkwnojvjqw.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnanplbnN4cmZ0a3dub2p2anF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5OTIwNjgsImV4cCI6MjA4MDU2ODA2OH0.vPJBa0xwr90bYxbNr2jw9ZodJMglKdYUaGjQrnfzeTg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Carga productos según la categoría seleccionada
async function cargarProductosPorCategoria() {
  const contenedorProductos = document.getElementById("contenedor-items");
  const marcaContenedor = document.getElementById("marca-nombre"); // aquí mostramos el nombre de la categoría

  if (!contenedorProductos) {
    console.error("No se encontró el contenedor de productos (#contenedor-items).");
    return;
  }

  // Leer parámetros de la URL
  let categoriaId = getQueryParam("categoria_id");
  const categoriaNombreParam = getQueryParam("categoria");

  // Si no viene categoria_id pero sí nombre, intentar resolverlo
  if (!categoriaId && categoriaNombreParam) {
    const { data: catPorNombre, error: catNombreError } = await supabase
      .from("categorias")
      .select("id, nombre")
      .ilike("nombre", categoriaNombreParam);

    if (catNombreError) {
      console.error("Error buscando categoría por nombre:", catNombreError);
      return;
    }

    if (catPorNombre && catPorNombre.length > 0) {
      categoriaId = catPorNombre[0].id;
    }
  }

  if (!categoriaId) {
    console.warn("No se encontró categoria_id en la URL.");
    return;
  }

  // Asegurar que sea número
  categoriaId = parseInt(categoriaId, 10);

  contenedorProductos.innerHTML = "";

  // 1) Obtener datos de la categoría
  const { data: categoria, error: catError } = await supabase
    .from("categorias")
    .select("id, nombre")
    .eq("id", categoriaId)
    .single();

  if (catError) {
    console.error("Error cargando categoría:", catError);
  } else if (categoria && marcaContenedor) {
    marcaContenedor.textContent = categoria.nombre;
  }

  // 2) Obtener productos de esa categoría
  const { data: productos, error: prodError } = await supabase
    .from("productos")
    .select("id, nombre, numero_modelo, marca_id, descripcion, imagen, activo")
    .eq("categoria_id", categoriaId)
    .eq("activo", true)
    .order("nombre", { ascending: true });

  if (prodError) {
    console.error("Error cargando productos:", prodError);
    return;
  }

  if (!productos || productos.length === 0) {
    const mensaje = document.createElement("p");
    mensaje.textContent = "No se encontraron productos para esta categoría.";
    contenedorProductos.appendChild(mensaje);
    return;
  }

  // 3) Obtener marcas (para mostrar el nombre de la marca en cada producto)
  const { data: marcas, error: marcasError } = await supabase
    .from("marcas")
    .select("id, nombre");

  if (marcasError) {
    console.error("Error cargando marcas:", marcasError);
  }

  const marcaMap = {};
  if (marcas) {
    marcas.forEach((m) => {
      marcaMap[m.id] = m.nombre;
    });
  }

  // 4) Obtener características de todos los productos en esta categoría
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

  // Ordenar por nombre (por si acaso)
  productos.sort((a, b) => a.nombre.localeCompare(b.nombre));

  let letraActual = "";

  productos.forEach((producto, index) => {
    const primeraLetra = producto.nombre.charAt(0).toUpperCase();

    // Encabezado de letra (A, B, C...)
    if (primeraLetra !== letraActual) {
      letraActual = primeraLetra;

      const encabezadoLetra = document.createElement("h2");
      encabezadoLetra.textContent = letraActual;
      encabezadoLetra.className = "letra-encabezado";
      encabezadoLetra.id = `letra-${letraActual}`;
      contenedorProductos.appendChild(encabezadoLetra);
    }

    // Tarjeta de producto
    const productoCard = document.createElement("div");
    productoCard.className = `producto-card ${index % 2 === 0 ? "izquierda" : "derecha"}`;
    productoCard.setAttribute("data-nombre", producto.nombre);

    // Imagen
    const productoImg = document.createElement("img");
    productoImg.src = producto.imagen;
    productoImg.alt = producto.nombre;
    productoImg.className = "producto-img";

    // Contenedor de texto
    const productoTexto = document.createElement("div");
    productoTexto.className = "producto-texto";

    // Nombre
    const productoNombre = document.createElement("h3");
    productoNombre.textContent = producto.nombre;

    // Modelo
    const productoModelo = document.createElement("p");
    productoModelo.textContent = `Modelo: ${producto.numero_modelo || ""}`;

    // Marca
    const productoMarca = document.createElement("p");
    const marcaNombre = marcaMap[producto.marca_id] || "";
    productoMarca.textContent = marcaNombre ? `Marca: ${marcaNombre}` : "";

    // Descripción
    const productoDescripcion = document.createElement("p");
    productoDescripcion.textContent = producto.descripcion || "";

    // Título características
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

    // Botón "Ver más" (ahora por id de producto)
    const verMasBtn = document.createElement("button");
    verMasBtn.textContent = "Ver más";
    verMasBtn.className = "ver-mas-btn-producto";
    verMasBtn.addEventListener("click", () => {
      window.location.href = `producto.html?id=${encodeURIComponent(producto.id)}`;
    });

    // Armar tarjeta
    productoTexto.appendChild(productoNombre);
    productoTexto.appendChild(productoModelo);
    if (marcaNombre) productoTexto.appendChild(productoMarca);
    productoTexto.appendChild(productoDescripcion);
    if (listaCar.length > 0) {
      productoTexto.appendChild(caracteristicasTitulo);
      productoTexto.appendChild(productoCaracteristicas);
    }
    productoTexto.appendChild(verMasBtn);

    productoCard.appendChild(productoImg);
    productoCard.appendChild(productoTexto);
    contenedorProductos.appendChild(productoCard);
  });

  // Limitar tamaño de las imágenes de productos
  const productoImgs = document.querySelectorAll(".producto-img");
  productoImgs.forEach((img) => {
    img.style.maxWidth = "800px";
    img.style.maxHeight = "300px";
    img.style.objectFit = "contain";
  });

  // Ajustar vista responsiva después de cargar
  ajustarVistaProductos();
}

// Función para ajustar la vista en pantallas pequeñas
function ajustarVistaProductos() {
  const productosCards = document.querySelectorAll(".producto-card");

  productosCards.forEach((card) => {
    const productoTexto = card.querySelector(".producto-texto");
    const productoNombre = card.querySelector("h3");
    const verMasBtn = card.querySelector(".ver-mas-btn-producto");

    const nombreProducto = card.getAttribute("data-nombre");

    if (window.innerWidth <= 1000) {
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

// Ajustar tamaño del texto en el contenedor de la "marca" (en realidad categoría)
function ajustarTextoResponsive() {
  const marcaContenedor = document.getElementById("marca-nombre");
  if (!marcaContenedor) {
    return;
  }

  const anchoVentana = window.innerWidth;
  const tamañoTexto = Math.max(16, anchoVentana / 30);

  marcaContenedor.style.fontSize = `${tamañoTexto}px`;
}

// Generar lista de letras A-Z para el índice lateral
function generarIndiceLetras() {
  const contenedorLetras = document.querySelector(".letra-lista");

  if (!contenedorLetras) {
    console.error("El contenedor de letras (.letra-lista) no se encontró.");
    return;
  }

  contenedorLetras.innerHTML = "";

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

// Eventos
window.addEventListener("resize", ajustarTextoResponsive);
window.addEventListener("resize", ajustarVistaProductos);

document.addEventListener("DOMContentLoaded", () => {
  ajustarTextoResponsive();
  generarIndiceLetras();
  cargarProductosPorCategoria();
});