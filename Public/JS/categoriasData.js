// --- CARGA DE CATEGORÍAS DESDE SUPABASE ---

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Credenciales de Supabase
const SUPABASE_URL = "https://zgjzensxrftkwnojvjqw.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnanplbnN4cmZ0a3dub2p2anF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5OTIwNjgsImV4cCI6MjA4MDU2ODA2OH0.vPJBa0xwr90bYxbNr2jw9ZodJMglKdYUaGjQrnfzeTg";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Función principal para cargar categorías
async function cargarCategorias() {
  const categoriasGrid = document.querySelector(".categorias-grid");
  if (!categoriasGrid) return;

  // Obtener categorías activas desde Supabase
  const { data, error } = await supabase
    .from("categorias")
    .select("id, nombre, imagen")
    .eq("activa", true)
    .order("nombre", { ascending: true });

  if (error) {
    console.error("Error cargando categorías desde Supabase:", error);
    return;
  }

  categoriasGrid.innerHTML = "";

  data.forEach((categoria) => {
    const categoriaItem = document.createElement("div");
    categoriaItem.className = "categoria-item";

    const link = document.createElement("a");
    link.href = `CAT.html?categoria=${encodeURIComponent(categoria.nombre)}`;
    link.className = "categoria-link";

    const img = document.createElement("img");
    img.src = categoria.imagen;
    img.alt = categoria.nombre;

    const nombre = document.createElement("p");
    nombre.textContent = categoria.nombre;

    link.appendChild(img);
    link.appendChild(nombre);
    categoriaItem.appendChild(link);

    categoriasGrid.appendChild(categoriaItem);
  });
}

document.addEventListener("DOMContentLoaded", cargarCategorias);