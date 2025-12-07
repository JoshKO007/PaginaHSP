// producto.js – Detalle de producto desde Supabase

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Credenciales de Supabase (mismas que en pm.js)
const SUPABASE_URL = "https://zgjzensxrftkwnojvjqw.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnanplbnN4cmZ0a3dub2p2anF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5OTIwNjgsImV4cCI6MjA4MDU2ODA2OH0.vPJBa0xwr90bYxbNr2jw9ZodJMglKdYUaGjQrnfzeTg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Obtener parámetro de la URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Soportar tanto ?id= como ?producto= (por compatibilidad)
const productoIdParam = getQueryParam("id") || getQueryParam("producto");
console.log("Producto seleccionado (ID o nombre):", productoIdParam);

// Variable global para usar en WhatsApp y correo
let producto = null;
let categoriaNombre = "";

// Cargar detalle del producto desde Supabase
async function cargarProducto() {
  const contenedorDetalle = document.getElementById("producto-detalle");
  const contenedorRelacionados = document.querySelector(".productos-grid-unicos");

  if (!contenedorDetalle) {
    console.error("No se encontró el contenedor de detalle (#producto-detalle).");
    return;
  }

  if (!productoIdParam) {
    console.warn("No se recibió ?id= ni ?producto= en la URL.");
    contenedorDetalle.innerHTML = "<p>No se especificó ningún producto.</p>";
    return;
  }

  try {
    // 1) Buscar producto: primero por id, si no coincide, por nombre (ilike)
    let prodData = null;
    let prodError = null;

    const idAsNumber = Number(productoIdParam);
    if (!Number.isNaN(idAsNumber)) {
      const { data, error } = await supabase
        .from("productos")
        .select(
          "id, nombre, numero_modelo, descripcion, imagen, categoria_id, marca_id, activo"
        )
        .eq("id", idAsNumber)
        .eq("activo", true)
        .limit(1);

      prodData = data;
      prodError = error;
    }

    // Si no se encontró por id (o no era un número), intentar por nombre
    if ((!prodData || prodData.length === 0) && !prodError) {
      const { data, error } = await supabase
        .from("productos")
        .select(
          "id, nombre, numero_modelo, descripcion, imagen, categoria_id, marca_id, activo"
        )
        .ilike("nombre", productoIdParam)
        .eq("activo", true)
        .limit(1);

      prodData = data;
      prodError = error;
    }

    if (prodError) {
      console.error("Error cargando producto desde Supabase:", prodError);
      contenedorDetalle.innerHTML =
        "<p>Ocurrió un error al cargar la información del producto.</p>";
      return;
    }

    if (!prodData || prodData.length === 0) {
      console.warn("No se encontró el producto seleccionado en la tabla 'productos'.");
      contenedorDetalle.innerHTML =
        "<p>No se encontró el producto seleccionado.</p>";
      return;
    }

    producto = prodData[0];

    // 2) Cargar nombre de la categoría usando categoria_id
    categoriaNombre = "";
    if (producto.categoria_id) {
      const { data: catData, error: catError } = await supabase
        .from("categorias")
        .select("id, nombre")
        .eq("id", producto.categoria_id)
        .limit(1);

      if (catError) {
        console.error("Error cargando categoría:", catError);
      } else if (catData && catData.length > 0) {
        categoriaNombre = catData[0].nombre;
      }
    }

    // 3) Cargar características del producto
    let listaCar = [];
    const { data: caracteristicas, error: carError } = await supabase
      .from("producto_caracteristicas")
      .select("texto, activo")
      .eq("producto_id", producto.id)
      .eq("activo", true);

    if (carError) {
      console.error("Error cargando características:", carError);
    } else if (caracteristicas) {
      listaCar = caracteristicas.map((row) => row.texto);
    }

    // 4) Renderizar producto en el DOM
    contenedorDetalle.innerHTML = `
      <div class="producto-detalle">
        <img src="${producto.imagen}" alt="${producto.nombre}" class="producto-detalle-img">
        <div class="producto-detalle-info">
          <h1>${producto.nombre}</h1>
          <p><strong>Modelo:</strong> ${producto.numero_modelo || ""}</p>
          <p><strong>Categoría:</strong> ${categoriaNombre || ""}</p>
          <p><strong>Descripción:</strong> ${producto.descripcion || ""}</p>
          ${
            listaCar.length > 0
              ? `<h3>Características:</h3>
                 <ul>
                  ${listaCar.map((txt) => `<li>${txt}</li>`).join("")}
                 </ul>`
              : ""
          }
        </div>
      </div>
    `;

    // 5) Cargar productos relacionados desde Supabase
    if (contenedorRelacionados) {
      contenedorRelacionados.innerHTML = "";

      let queryRel = supabase
        .from("productos")
        .select(
          "id, nombre, numero_modelo, descripcion, imagen, categoria_id, marca_id, activo"
        )
        .eq("activo", true)
        .neq("id", producto.id);

      // Relacionados por misma marca y/o misma categoría (por categoria_id)
      let orCond = "";
      if (producto.marca_id) {
        orCond = `marca_id.eq.${producto.marca_id}`;
      }
      if (producto.categoria_id) {
        orCond += orCond
          ? `,categoria_id.eq.${producto.categoria_id}`
          : `categoria_id.eq.${producto.categoria_id}`;
      }

      if (orCond) {
        queryRel = queryRel.or(orCond);
      }

      const { data: relacionados, error: relError } = await queryRel;

      if (relError) {
        console.error("Error cargando productos relacionados:", relError);
        contenedorRelacionados.innerHTML =
          "<p>No se pudieron cargar los productos relacionados.</p>";
      } else if (relacionados && relacionados.length > 0) {
        relacionados.forEach((relacionado) => {
          const card = document.createElement("div");
          card.classList.add("producto-card-unico");
          card.innerHTML = `
            <img src="${relacionado.imagen}" alt="${relacionado.nombre}">
            <h3>${relacionado.nombre}</h3>
            <a href="producto.html?id=${encodeURIComponent(
              relacionado.id
            )}" class="ver-mas-btn">Ver más</a>
          `;
          contenedorRelacionados.appendChild(card);
        });
      } else {
        contenedorRelacionados.innerHTML =
          "<p>No se encontraron productos relacionados.</p>";
      }
    }
  } catch (err) {
    console.error("Error inesperado al cargar el producto:", err);
    contenedorDetalle.innerHTML =
      "<p>Ocurrió un error al cargar la información del producto.</p>";
  }
}

// Ejecutar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", cargarProducto);

// ------------------------
// Lógica de modal / cotizar / WhatsApp / correo
// ------------------------

// Seleccionar elementos
const cotizarBtn = document.getElementById("cotizarBtn");
const modal = document.getElementById("cotizarModal");
const closeModal = document.getElementById("closeModal");
const whatsappBtn = document.getElementById("whatsappBtn");
const correoBtn = document.getElementById("correoBtn");

// Abrir el modal al hacer clic en el botón de Cotizar
if (cotizarBtn && modal) {
  cotizarBtn.addEventListener("click", () => {
    modal.classList.add("show"); // Mostrar el modal
  });
}

// Cerrar el modal al hacer clic en el botón de cerrar
if (closeModal && modal) {
  closeModal.addEventListener("click", () => {
    modal.classList.remove("show"); // Ocultar el modal
  });
}

// Cerrar el modal al hacer clic fuera del contenido
if (modal) {
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("show"); // Ocultar el modal
    }
  });
}

// Enviar información por WhatsApp
if (whatsappBtn) {
  whatsappBtn.addEventListener("click", () => {
    if (!producto) {
      alert("No se ha cargado la información del producto.");
      return;
    }

    const mensaje = `Hola, estoy interesado en el siguiente producto:
- *Nombre*: ${producto.nombre}
- Categoría: ${categoriaNombre || "No especificada"}

- *Modelo*: ${producto.numero_modelo || "No especificado"}
- *Descripción*: ${producto.descripcion || "Sin descripción"}
`;

    // Cambia el número por el oficial de la empresa
    const whatsappUrl = `https://wa.me/5521726585?text=${encodeURIComponent(
      mensaje
    )}`;
    window.open(whatsappUrl, "_blank"); // Abrir WhatsApp en una nueva pestaña
  });
}

// Enviar información por Correo Electrónico
if (correoBtn) {
  correoBtn.addEventListener("click", () => {
    if (!producto) {
      alert("No se ha cargado la información del producto.");
      return;
    }

    const asunto = `Cotización del producto: ${producto.nombre}`;
    const cuerpo =
      `Hola, estoy interesado en el siguiente producto:\n\n` +
      `- Nombre: ${producto.nombre}\n` +
      `- Categoría: ${categoriaNombre || "No especificada"}\n` +
      `- Modelo: ${producto.numero_modelo || "No especificado"}\n` +
      `- Descripción: ${producto.descripcion || "Sin descripción"}\n`;

    const correoUrl = `mailto:rafael_torres@yolotech.com.mx?subject=${encodeURIComponent(
      asunto
    )}&body=${encodeURIComponent(cuerpo)}`;
    window.location.href = correoUrl; // Abrir el cliente de correo
  });
}