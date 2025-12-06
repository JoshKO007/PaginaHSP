// --- CARGA DE MARCAS DESDE SUPABASE ---

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Credenciales de Supabase
const SUPABASE_URL = "https://zgjzensxrftkwnojvjqw.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnanplbnN4cmZ0a3dub2p2anF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5OTIwNjgsImV4cCI6MjA4MDU2ODA2OH0.vPJBa0xwr90bYxbNr2jw9ZodJMglKdYUaGjQrnfzeTg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Contenedor donde se mostrarán las marcas
const contenedor = document.getElementById("marcas-grid");

// Función para cargar las marcas desde Supabase
async function cargarMarcas() {
  if (!contenedor) return;

  // Consulta a la tabla "marcas"
  const { data, error } = await supabase
    .from("marcas")
    .select("id, nombre, imagen, activa")
    .eq("activa", true)
    .order("nombre", { ascending: true });

  if (error) {
    console.error("Error al cargar las marcas desde Supabase:", error);
    return;
  }

  contenedor.innerHTML = "";

  data.forEach((item) => {
    const elemento = document.createElement("div");
    elemento.className = "marca-item";

    // Imagen de la marca
    if (item.imagen) {
      const imagen = document.createElement("img");
      imagen.src = item.imagen;
      imagen.alt = item.nombre;
      imagen.setAttribute("data-nombre", item.nombre.toUpperCase());
      imagen.className = "marca-img";
      elemento.appendChild(imagen);
    }

    // Botón para ver productos de esa marca
    const boton = document.createElement("button");
    boton.className = "ver-productos-btn";
    boton.textContent = "Ver productos";
    boton.addEventListener("click", () => {
      window.location.href = `PM.html?marca=${encodeURIComponent(item.nombre)}`;
    });
    elemento.appendChild(boton);

    // Agregar elemento al contenedor
    contenedor.appendChild(elemento);
  });
}

document.addEventListener("DOMContentLoaded", cargarMarcas);