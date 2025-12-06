// --- CARGA DE CATEGORÍAS DESDE SUPABASE ---

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Credenciales de Supabase
const SUPABASE_URL = "https://zgjzensxrftkwnojvjqw.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnanplbnN4cmZ0a3dub2p2anF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5OTIwNjgsImV4cCI6MjA4MDU2ODA2OH0.vPJBa0xwr90bYxbNr2jw9ZodJMglKdYUaGjQrnfzeTg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Obtener contenedor correcto ---
const contenedor = document.getElementById("categorias-grid");

// --- Cargar categorías desde la base de datos ---
async function cargarCategorias() {
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .eq("visible", true);

  if (error) {
    console.error("Error cargando categorías:", error);
    return;
  }

  contenedor.innerHTML = "";

  data.forEach(item => {
    const elemento = document.createElement("div");
    elemento.className = "categoria-item";

    // Imagen
    if (item.imagen) {
      const imagen = document.createElement("img");
      imagen.src = item.imagen;
      imagen.alt = item.nombre;
      imagen.className = "categoria-img";
      elemento.appendChild(imagen);
    }

    // Nombre
    const nombre = document.createElement("h5");
    nombre.textContent = item.nombre;
    nombre.className = "categoria-nombre";
    elemento.appendChild(nombre);

    // Botón
    const boton = document.createElement("button");
    boton.className = "ver-productos-btn";
    boton.textContent = "Ver productos";
    boton.addEventListener("click", () => {
      window.location.href = `CAT.html?categoria=${encodeURIComponent(item.nombre)}`;
    });
    elemento.appendChild(boton);

    contenedor.appendChild(elemento);
  });
}

cargarCategorias();