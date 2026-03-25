import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = "https://zgjzensxrftkwnojvjqw.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpnanplbnN4cmZ0a3dub2p2anF3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5OTIwNjgsImV4cCI6MjA4MDU2ODA2OH0.vPJBa0xwr90bYxbNr2jw9ZodJMglKdYUaGjQrnfzeTg";
const IMGBB_API_KEY = "18d7825e6b190dcaac01e42053affc61";

const MOV_STORE_KEY = "inventory_movements_v1";
const ALERT_CFG_KEY = "inventory_alert_config_v1";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const state = {
  categorias: [],
  marcas: [],
  productos: [],
  stockMap: {},
  movements: [],
  editCategoriaId: null,
  editMarcaId: null,
  editProductoId: null,
  editCategoriaImageUrl: null,
  editMarcaImageUrl: null,
  editProductoImageUrl: null,
  stockChart: null,
  alertasChart: null,
  categoriaChartDash: null,
  marcaChartDash: null,
  topValueChart: null,
  valorCategoriaChart: null,
  alertConfig: {
    out: true,
    low: true,
    reorder: true,
    excess: true,
  },
};

const els = {
  viewTitle: document.getElementById("viewTitle"),
  syncInfo: document.getElementById("syncInfo"),
  lowStockPill: document.getElementById("lowStockPill"),

  categoriaForm: document.getElementById("categoriaForm"),
  categoriaFormTitle: document.getElementById("categoriaFormTitle"),
  categoriaNombre: document.getElementById("categoriaNombre"),
  categoriaImagen: document.getElementById("categoriaImagen"),
  categoriaActiva: document.getElementById("categoriaActiva"),
  cancelCategoriaBtn: document.getElementById("cancelCategoriaBtn"),
  categoriaList: document.getElementById("categoriaList"),
  categoriaSearch: document.getElementById("categoriaSearch"),
  categoriaSearchBy: document.getElementById("categoriaSearchBy"),
  categoriaSearchHint: document.getElementById("categoriaSearchHint"),

  marcaForm: document.getElementById("marcaForm"),
  marcaFormTitle: document.getElementById("marcaFormTitle"),
  marcaNombre: document.getElementById("marcaNombre"),
  marcaImagen: document.getElementById("marcaImagen"),
  marcaActiva: document.getElementById("marcaActiva"),
  cancelMarcaBtn: document.getElementById("cancelMarcaBtn"),
  marcaList: document.getElementById("marcaList"),
  marcaSearch: document.getElementById("marcaSearch"),
  marcaSearchBy: document.getElementById("marcaSearchBy"),
  marcaSearchHint: document.getElementById("marcaSearchHint"),

  productoForm: document.getElementById("productoForm"),
  productoFormTitle: document.getElementById("productoFormTitle"),
  productoNombre: document.getElementById("productoNombre"),
  productoSku: document.getElementById("productoSku"),
  productoModelo: document.getElementById("productoModelo"),
  productoMarca: document.getElementById("productoMarca"),
  productoCategoria: document.getElementById("productoCategoria"),
  productoProveedor: document.getElementById("productoProveedor"),
  productoUbicacion: document.getElementById("productoUbicacion"),
  productoActivo: document.getElementById("productoActivo"),
  productoDescripcion: document.getElementById("productoDescripcion"),
  productoImagen: document.getElementById("productoImagen"),
  productoCaracteristicas: document.getElementById("productoCaracteristicas"),
  productoStock: document.getElementById("productoStock"),
  productoMinimo: document.getElementById("productoMinimo"),
  productoMaximo: document.getElementById("productoMaximo"),
  productoReorden: document.getElementById("productoReorden"),
  productoCosto: document.getElementById("productoCosto"),
  productoPrecio: document.getElementById("productoPrecio"),
  productoMargen: document.getElementById("productoMargen"),
  productoMoneda: document.getElementById("productoMoneda"),
  productoLote: document.getElementById("productoLote"),
  productoFecha: document.getElementById("productoFecha"),
  cancelProductoBtn: document.getElementById("cancelProductoBtn"),
  productoList: document.getElementById("productoList"),
  productoSearch: document.getElementById("productoSearch"),
  productoSearchBy: document.getElementById("productoSearchBy"),
  productoSearchHint: document.getElementById("productoSearchHint"),

  kpiProductos: document.getElementById("kpiProductos"),
  kpiCategorias: document.getElementById("kpiCategorias"),
  kpiMarcas: document.getElementById("kpiMarcas"),
  kpiLow: document.getElementById("kpiLow"),
  kpiValorTotal: document.getElementById("kpiValorTotal"),
  kpiMargenPromedio: document.getElementById("kpiMargenPromedio"),
  kpiAgotados: document.getElementById("kpiAgotados"),
  kpiReorden: document.getElementById("kpiReorden"),
  movementList: document.getElementById("movementList"),
  stockChart: document.getElementById("stockChart"),
  alertasChart: document.getElementById("alertasChart"),
  categoriaChartDash: document.getElementById("categoriaChartDash"),
  marcaChartDash: document.getElementById("marcaChartDash"),
  topValueChart: document.getElementById("topValueChart"),
  valorCategoria: document.getElementById("valorCategoria"),
  alertOutToggle: document.getElementById("alertOutToggle"),
  alertLowToggle: document.getElementById("alertLowToggle"),
  alertReorderToggle: document.getElementById("alertReorderToggle"),
  alertExcessToggle: document.getElementById("alertExcessToggle"),
  alertSummaryList: document.getElementById("alertSummaryList"),
};

function setSyncStatus(text) {
  if (els.syncInfo) els.syncInfo.textContent = text;
}

function showNotification(message, type = "success") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.style.position = "fixed";
    container.style.top = "18px";
    container.style.right = "18px";
    container.style.zIndex = "9999";
    container.style.display = "grid";
    container.style.gap = "8px";
    container.style.maxWidth = "340px";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  const palette = {
    success: { bg: "#ecfdf3", border: "#86efac", text: "#166534" },
    warning: { bg: "#fff7ed", border: "#fdba74", text: "#9a3412" },
    error: { bg: "#fef2f2", border: "#fca5a5", text: "#991b1b" },
    info: { bg: "#eff6ff", border: "#93c5fd", text: "#1e3a8a" },
  };
  const selected = palette[type] || palette.info;

  toast.style.background = selected.bg;
  toast.style.border = `1px solid ${selected.border}`;
  toast.style.color = selected.text;
  toast.style.borderRadius = "12px";
  toast.style.padding = "10px 12px";
  toast.style.fontSize = "0.87rem";
  toast.style.fontWeight = "600";
  toast.style.boxShadow = "0 10px 24px rgba(24, 63, 126, 0.12)";
  toast.style.opacity = "0";
  toast.style.transform = "translateY(-6px)";
  toast.style.transition = "all .2s ease";
  toast.textContent = message;

  container.appendChild(toast);
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(-6px)";
    setTimeout(() => toast.remove(), 220);
  }, 2600);
}

function findDuplicateProducto({ nombre, numeroModelo, sku, excludeId = null }) {
  const normalizedNombre = normalizeText(nombre);
  const normalizedModelo = normalizeText(numeroModelo);
  const normalizedSku = normalizeText(sku);
  const excluded = excludeId ? Number(excludeId) : null;

  const duplicateProducto = state.productos.find((p) => {
    if (excluded && Number(p.id) === excluded) return false;
    return normalizeText(p.nombre) === normalizedNombre && normalizeText(p.numero_modelo) === normalizedModelo;
  });

  if (duplicateProducto) {
    return `Ya existe un producto igual: ${duplicateProducto.nombre} (${duplicateProducto.numero_modelo}).`;
  }

  const duplicateSkuEntry = Object.entries(state.stockMap).find(([productId, entry]) => {
    if (!normalizedSku) return false;
    if (excluded && Number(productId) === excluded) return false;
    return normalizeText(entry?.sku) === normalizedSku;
  });

  if (duplicateSkuEntry) {
    const duplicateId = Number(duplicateSkuEntry[0]);
    const duplicateProduct = state.productos.find((p) => Number(p.id) === duplicateId);
    return `El SKU ${sku} ya está asignado a ${duplicateProduct?.nombre || `producto #${duplicateId}`}.`;
  }

  return null;
}

async function findDuplicateProductoInDb({ nombre, numeroModelo, sku, excludeId = null }) {
  let productQuery = supabase
    .from("productos")
    .select("id,nombre,numero_modelo")
    .ilike("nombre", nombre)
    .ilike("numero_modelo", numeroModelo)
    .limit(1);

  if (excludeId) productQuery = productQuery.neq("id", Number(excludeId));

  const { data: productDup, error: productDupErr } = await productQuery;
  if (productDupErr) throw productDupErr;

  if (productDup && productDup.length > 0) {
    return `Ya existe un producto igual: ${productDup[0].nombre} (${productDup[0].numero_modelo}).`;
  }

  if (sku) {
    let skuQuery = supabase
      .from("producto_inventario")
      .select("producto_id,sku")
      .ilike("sku", sku)
      .limit(1);

    if (excludeId) skuQuery = skuQuery.neq("producto_id", Number(excludeId));

    const { data: skuDup, error: skuDupErr } = await skuQuery;
    if (skuDupErr) throw skuDupErr;

    if (skuDup && skuDup.length > 0) {
      return `El SKU ${sku} ya está registrado en inventario (producto #${skuDup[0].producto_id}).`;
    }
  }

  return null;
}

function loadMovementStore() {
  try {
    const raw = localStorage.getItem(MOV_STORE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveMovementStore() {
  localStorage.setItem(MOV_STORE_KEY, JSON.stringify(state.movements));
}

function loadAlertConfig() {
  try {
    const raw = localStorage.getItem(ALERT_CFG_KEY);
    if (!raw) return { ...state.alertConfig };
    const parsed = JSON.parse(raw);
    return {
      out: parsed?.out !== false,
      low: parsed?.low !== false,
      reorder: parsed?.reorder !== false,
      excess: parsed?.excess !== false,
    };
  } catch {
    return { ...state.alertConfig };
  }
}

function saveAlertConfig() {
  localStorage.setItem(ALERT_CFG_KEY, JSON.stringify(state.alertConfig));
}

function isAlertTypeEnabled(health) {
  if (health === "out") return state.alertConfig.out;
  if (health === "low") return state.alertConfig.low;
  if (health === "reorder") return state.alertConfig.reorder;
  if (health === "excess") return state.alertConfig.excess;
  return false;
}

function addMovement(productoId, nombre, delta, reason) {
  state.movements.unshift({
    productoId,
    nombre,
    delta,
    reason,
    date: new Date().toISOString(),
  });

  state.movements = state.movements.slice(0, 200);
  saveMovementStore();
  renderMovements();
}

function getStockEntry(productoId) {
  const key = String(productoId);
  if (!state.stockMap[key]) {
    state.stockMap[key] = {
      stock: 0,
      min: 5,
      max: 100,
      reorden: 10,
      costo: 0,
      precio: 0,
      moneda: "USD",
      sku: "",
      proveedor: "",
      ubicacion: "",
      lote: "",
      fechaAdquisicion: "",
      updatedAt: new Date().toISOString(),
    };
  }
  return state.stockMap[key];
}

function mapDbInventoryRow(row) {
  return {
    stock: Number(row.stock ?? 0),
    min: Number(row.stock_minimo ?? 5),
    max: Number(row.stock_maximo ?? 100),
    reorden: Number(row.punto_reorden ?? 10),
    costo: Number(row.costo ?? 0),
    precio: Number(row.precio ?? 0),
    moneda: row.moneda || "USD",
    sku: row.sku || "",
    proveedor: row.proveedor || "",
    ubicacion: row.ubicacion || "",
    lote: row.lote || "",
    fechaAdquisicion: row.fecha_adquisicion || "",
    updatedAt: row.updated_at || new Date().toISOString(),
  };
}

function buildInventoryPayload(productoId, entry) {
  return {
    producto_id: productoId,
    stock: Number(entry.stock || 0),
    stock_minimo: Number(entry.min || 0),
    stock_maximo: Number(entry.max || 0),
    punto_reorden: Number(entry.reorden || 0),
    costo: Number(entry.costo || 0),
    precio: Number(entry.precio || 0),
    moneda: entry.moneda || "USD",
    sku: entry.sku || null,
    proveedor: entry.proveedor || null,
    ubicacion: entry.ubicacion || null,
    lote: entry.lote || null,
    fecha_adquisicion: entry.fechaAdquisicion || null,
  };
}

async function updateStockEntry(productoId, patch) {
  const entry = getStockEntry(productoId);
  const next = {
    ...entry,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  state.stockMap[String(productoId)] = next;

  const payload = buildInventoryPayload(productoId, next);
  const { error } = await supabase.from("producto_inventario").upsert(payload, { onConflict: "producto_id" });
  if (error) throw error;
}

async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function uploadToImgbb(file) {
  const base64 = await fileToBase64(file);
  const formData = new FormData();
  formData.append("image", base64);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!data.success) throw new Error("No se pudo subir imagen a imgBB");
  return data.data.url;
}

async function getNextId(table) {
  const { data, error } = await supabase.from(table).select("id").order("id", { ascending: false }).limit(1);
  if (error) throw error;
  if (!data || data.length === 0) return 1;
  return data[0].id + 1;
}

async function loadAll() {
  setSyncStatus("Sincronizando...");

  const [{ data: categorias, error: catErr }, { data: marcas, error: marErr }, { data: productos, error: prodErr }] = await Promise.all([
    supabase.from("categorias").select("id,nombre,imagen,activa").order("nombre", { ascending: true }),
    supabase.from("marcas").select("id,nombre,imagen,activa").order("nombre", { ascending: true }),
    supabase
      .from("productos")
      .select("id,nombre,numero_modelo,marca_id,categoria_id,descripcion,imagen,activo")
      .order("nombre", { ascending: true }),
  ]);

  if (catErr) throw catErr;
  if (marErr) throw marErr;
  if (prodErr) throw prodErr;

  state.categorias = categorias || [];
  state.marcas = marcas || [];
  state.productos = productos || [];

  await initializeStockMap();
  renderAll();
  setSyncStatus(`Actualizado ${new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}`);
}

async function initializeStockMap() {
  const productIds = state.productos.map((p) => p.id);
  if (productIds.length === 0) {
    state.stockMap = {};
    return;
  }

  const { data, error } = await supabase
    .from("producto_inventario")
    .select(
      "producto_id,stock,stock_minimo,stock_maximo,punto_reorden,costo,precio,moneda,sku,proveedor,ubicacion,lote,fecha_adquisicion,updated_at"
    )
    .in("producto_id", productIds);

  if (error) throw error;

  const nextMap = {};
  (data || []).forEach((row) => {
    nextMap[String(row.producto_id)] = mapDbInventoryRow(row);
  });

  const missingPayload = [];
  state.productos.forEach((product) => {
    const key = String(product.id);
    if (!nextMap[key]) {
      const fallback = getStockEntry(product.id);
      nextMap[key] = fallback;
      missingPayload.push(buildInventoryPayload(product.id, fallback));
    }
  });

  if (missingPayload.length > 0) {
    const { error: upsertErr } = await supabase
      .from("producto_inventario")
      .upsert(missingPayload, { onConflict: "producto_id" });
    if (upsertErr) throw upsertErr;
  }

  state.stockMap = nextMap;
}

function productHealth(productId) {
  const entry = getStockEntry(productId);
  if (entry.stock <= 0) return "out";
  if (entry.stock <= entry.min) return "low";
  if (entry.stock > entry.max && entry.max > 0) return "excess";
  if (entry.stock <= entry.reorden && entry.reorden > 0) return "reorder";
  return "ok";
}

function lowStockProducts() {
  return state.productos.filter((p) => {
    const h = productHealth(p.id);
    return isAlertTypeEnabled(h);
  });
}

function getAlertCounts() {
  const counts = { out: 0, low: 0, reorder: 0, excess: 0 };
  state.productos.forEach((p) => {
    const h = productHealth(p.id);
    if (counts[h] !== undefined) counts[h] += 1;
  });
  return counts;
}

function renderAlertSettings() {
  if (els.alertOutToggle) els.alertOutToggle.checked = state.alertConfig.out;
  if (els.alertLowToggle) els.alertLowToggle.checked = state.alertConfig.low;
  if (els.alertReorderToggle) els.alertReorderToggle.checked = state.alertConfig.reorder;
  if (els.alertExcessToggle) els.alertExcessToggle.checked = state.alertConfig.excess;

  if (!els.alertSummaryList) return;
  const counts = getAlertCounts();
  const rows = [
    { key: "out", label: "Agotado", count: counts.out },
    { key: "low", label: "Stock mínimo", count: counts.low },
    { key: "reorder", label: "Reorden", count: counts.reorder },
    { key: "excess", label: "Exceso", count: counts.excess },
  ];

  els.alertSummaryList.innerHTML = rows
    .map((r) => {
      const enabled = state.alertConfig[r.key];
      return `
        <div class='alert-summary-item ${enabled ? "" : "disabled"}'>
          <span>${r.label} ${enabled ? "" : "(desactivada)"}</span>
          <strong>${r.count}</strong>
        </div>
      `;
    })
    .join("");
}

function setupAlertControls() {
  const map = [
    [els.alertOutToggle, "out"],
    [els.alertLowToggle, "low"],
    [els.alertReorderToggle, "reorder"],
    [els.alertExcessToggle, "excess"],
  ];

  map.forEach(([checkbox, key]) => {
    if (!checkbox) return;
    checkbox.addEventListener("change", () => {
      state.alertConfig[key] = checkbox.checked;
      saveAlertConfig();
      renderAlertSettings();
      renderDashboard();
    });
  });
}

function renderAll() {
  renderSelects();
  renderCategorias();
  renderMarcas();
  renderProductos();
  renderDashboard();
}

function renderSelects() {
  const brandOptions = ["<option value=''>Selecciona marca</option>"];
  state.marcas.forEach((m) => {
    brandOptions.push(`<option value='${m.id}'>${m.nombre}${m.activa === false ? " (inactiva)" : ""}</option>`);
  });

  const categoryOptions = ["<option value=''>Selecciona categoría</option>"];
  state.categorias.forEach((c) => {
    categoryOptions.push(`<option value='${c.id}'>${c.nombre}${c.activa === false ? " (inactiva)" : ""}</option>`);
  });

  els.productoMarca.innerHTML = brandOptions.join("");
  els.productoCategoria.innerHTML = categoryOptions.join("");
}

function normalizeText(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function includesQuery(value, query) {
  return normalizeText(value).includes(query);
}

function compareText(a, b) {
  return String(a ?? "").localeCompare(String(b ?? ""), "es", {
    sensitivity: "base",
    numeric: true,
  });
}

function categoryMatches(cat, query, mode) {
  if (!query) return true;
  const statusText = cat.activa === false ? "inactiva" : "activa";

  if (mode === "id") return includesQuery(cat.id, query);
  if (mode === "nombre") return includesQuery(cat.nombre, query);
  if (mode === "estado") return includesQuery(statusText, query);

  return [cat.id, cat.nombre, statusText].some((field) => includesQuery(field, query));
}

function marcaMatches(marca, query, mode) {
  if (!query) return true;
  const statusText = marca.activa === false ? "inactiva" : "activa";

  if (mode === "id") return includesQuery(marca.id, query);
  if (mode === "nombre") return includesQuery(marca.nombre, query);
  if (mode === "estado") return includesQuery(statusText, query);

  return [marca.id, marca.nombre, statusText].some((field) => includesQuery(field, query));
}

function productoMatches(producto, query, mode) {
  if (!query) return true;

  const stock = getStockEntry(producto.id);
  const health = productHealth(producto.id);
  const healthText = health === "out" ? "agotado" : health === "low" ? "bajo" : "ok";

  const marca = state.marcas.find((m) => m.id === producto.marca_id)?.nombre || "sin marca";
  const categoria = state.categorias.find((c) => c.id === producto.categoria_id)?.nombre || "sin categoria";

  if (mode === "id") return includesQuery(producto.id, query);
  if (mode === "nombre") return includesQuery(producto.nombre, query);
  if (mode === "modelo") return includesQuery(producto.numero_modelo, query);
  if (mode === "marca") return includesQuery(marca, query);
  if (mode === "categoria") return includesQuery(categoria, query);
  if (mode === "estado") return includesQuery(healthText, query) || includesQuery(producto.activo === false ? "inactivo" : "activo", query);
  if (mode === "stock") return includesQuery(stock.stock, query) || includesQuery(stock.min, query);

  return [
    producto.id,
    producto.nombre,
    producto.numero_modelo,
    marca,
    categoria,
    stock.stock,
    stock.min,
    healthText,
    producto.activo === false ? "inactivo" : "activo",
  ].some((field) => includesQuery(field, query));
}

function sortCategorias(items, mode) {
  const list = [...items];
  list.sort((a, b) => {
    if (mode === "id") return Number(a.id) - Number(b.id);
    if (mode === "estado") {
      const aRank = a.activa === false ? 1 : 0;
      const bRank = b.activa === false ? 1 : 0;
      return aRank - bRank || compareText(a.nombre, b.nombre);
    }
    return compareText(a.nombre, b.nombre);
  });
  return list;
}

function sortMarcas(items, mode) {
  const list = [...items];
  list.sort((a, b) => {
    if (mode === "id") return Number(a.id) - Number(b.id);
    if (mode === "estado") {
      const aRank = a.activa === false ? 1 : 0;
      const bRank = b.activa === false ? 1 : 0;
      return aRank - bRank || compareText(a.nombre, b.nombre);
    }
    return compareText(a.nombre, b.nombre);
  });
  return list;
}

function sortProductos(items, mode) {
  const list = [...items];
  list.sort((a, b) => {
    const marcaA = state.marcas.find((m) => m.id === a.marca_id)?.nombre || "";
    const marcaB = state.marcas.find((m) => m.id === b.marca_id)?.nombre || "";
    const categoriaA = state.categorias.find((c) => c.id === a.categoria_id)?.nombre || "";
    const categoriaB = state.categorias.find((c) => c.id === b.categoria_id)?.nombre || "";
    const stockA = getStockEntry(a.id);
    const stockB = getStockEntry(b.id);

    if (mode === "id") return Number(a.id) - Number(b.id);
    if (mode === "modelo") return compareText(a.numero_modelo, b.numero_modelo) || compareText(a.nombre, b.nombre);
    if (mode === "marca") return compareText(marcaA, marcaB) || compareText(a.nombre, b.nombre);
    if (mode === "categoria") return compareText(categoriaA, categoriaB) || compareText(a.nombre, b.nombre);
    if (mode === "stock") return Number(stockA.stock) - Number(stockB.stock) || Number(stockA.min) - Number(stockB.min) || compareText(a.nombre, b.nombre);
    if (mode === "estado") {
      const healthRank = { out: 0, low: 1, ok: 2 };
      const aHealth = productHealth(a.id);
      const bHealth = productHealth(b.id);
      const ar = healthRank[aHealth] ?? 3;
      const br = healthRank[bHealth] ?? 3;
      return ar - br || compareText(a.nombre, b.nombre);
    }
    return compareText(a.nombre, b.nombre);
  });
  return list;
}

function renderCategorias() {
  els.categoriaList.innerHTML = "";

  const query = normalizeText(els.categoriaSearch?.value || "");
  const mode = els.categoriaSearchBy?.value || "all";
  const filtered = state.categorias.filter((cat) => categoryMatches(cat, query, mode));
  const sorted = sortCategorias(filtered, mode);

  if (els.categoriaSearchHint) {
    els.categoriaSearchHint.textContent = `Mostrando ${sorted.length} de ${state.categorias.length} categorías · orden: ${mode}`;
  }

  if (sorted.length === 0) {
    els.categoriaList.innerHTML = "<div class='tiny'>No hay categorías que coincidan con la búsqueda.</div>";
    return;
  }

  sorted.forEach((cat) => {
    const row = document.createElement("div");
    row.className = "row";

    const badge = cat.activa === false ? "<span class='badge out'>Inactiva</span>" : "<span class='badge ok'>Activa</span>";
    const imgHtml = cat.imagen ? `<img src="${cat.imagen}" style="width:48px; height:48px; border-radius:8px; object-fit:cover; border:1px solid #dce7fd;"/>` : "<div style='width:48px; height:48px; background:#f0f4ff; border-radius:8px; border:1px solid #dce7fd; display:flex; align-items:center; justify-content:center; font-size:.8rem; color:#999;'><i class='fa-solid fa-image'></i></div>";

    row.innerHTML = `
      <div style='display:flex; gap:12px; align-items:center; min-width:0;'>
        ${imgHtml}
        <div style='min-width:0;'>
          <div class='title'>${cat.nombre} ${badge}</div>
          <div class='meta'>ID: ${cat.id}</div>
        </div>
      </div>
      <div class='row-actions'>
        <button class='btn secondary icon-only' data-action='toggle'><i class='fa-solid fa-power-off'></i></button>
        <button class='btn secondary icon-only' data-action='edit'><i class='fa-solid fa-pen'></i></button>
      </div>
    `;

    row.querySelector("[data-action='edit']")?.addEventListener("click", () => startEditCategoria(cat));
    row.querySelector("[data-action='toggle']")?.addEventListener("click", () => toggleCategoria(cat));

    els.categoriaList.appendChild(row);
  });
}

function renderMarcas() {
  els.marcaList.innerHTML = "";

  const query = normalizeText(els.marcaSearch?.value || "");
  const mode = els.marcaSearchBy?.value || "all";
  const filtered = state.marcas.filter((marca) => marcaMatches(marca, query, mode));
  const sorted = sortMarcas(filtered, mode);

  if (els.marcaSearchHint) {
    els.marcaSearchHint.textContent = `Mostrando ${sorted.length} de ${state.marcas.length} marcas · orden: ${mode}`;
  }

  if (sorted.length === 0) {
    els.marcaList.innerHTML = "<div class='tiny'>No hay marcas que coincidan con la búsqueda.</div>";
    return;
  }

  sorted.forEach((marca) => {
    const row = document.createElement("div");
    row.className = "row";

    const badge = marca.activa === false ? "<span class='badge out'>Inactiva</span>" : "<span class='badge ok'>Activa</span>";
    const imgHtml = marca.imagen ? `<img src="${marca.imagen}" style="width:48px; height:48px; border-radius:8px; object-fit:cover; border:1px solid #dce7fd;"/>` : "<div style='width:48px; height:48px; background:#f0f4ff; border-radius:8px; border:1px solid #dce7fd; display:flex; align-items:center; justify-content:center; font-size:.8rem; color:#999;'><i class='fa-solid fa-image'></i></div>";

    row.innerHTML = `
      <div style='display:flex; gap:12px; align-items:center; min-width:0;'>
        ${imgHtml}
        <div style='min-width:0;'>
          <div class='title'>${marca.nombre} ${badge}</div>
          <div class='meta'>ID: ${marca.id}</div>
        </div>
      </div>
      <div class='row-actions'>
        <button class='btn secondary icon-only' data-action='toggle'><i class='fa-solid fa-power-off'></i></button>
        <button class='btn secondary icon-only' data-action='edit'><i class='fa-solid fa-pen'></i></button>
      </div>
    `;

    row.querySelector("[data-action='edit']")?.addEventListener("click", () => startEditMarca(marca));
    row.querySelector("[data-action='toggle']")?.addEventListener("click", () => toggleMarca(marca));

    els.marcaList.appendChild(row);
  });
}

function renderProductos() {
  els.productoList.innerHTML = "";

  const query = normalizeText(els.productoSearch?.value || "");
  const mode = els.productoSearchBy?.value || "all";
  const filtered = state.productos.filter((p) => productoMatches(p, query, mode));
  const sorted = sortProductos(filtered, mode);

  if (els.productoSearchHint) {
    els.productoSearchHint.textContent = `Mostrando ${sorted.length} de ${state.productos.length} productos · orden: ${mode}`;
  }

  if (sorted.length === 0) {
    els.productoList.innerHTML = "<div class='tiny'>No hay productos que coincidan con la búsqueda.</div>";
    return;
  }

  sorted.forEach((p) => {
    const stock = getStockEntry(p.id);
    const health = productHealth(p.id);
    
    let healthBadge = "";
    if (health === "out") {
      healthBadge = "<span class='badge out'><i class='fa-solid fa-circle-xmark'></i> Agotado</span>";
    } else if (health === "low") {
      healthBadge = "<span class='badge low'><i class='fa-solid fa-exclamation-triangle'></i> Stock Bajo</span>";
    } else if (health === "reorder") {
      healthBadge = "<span class='badge warn'><i class='fa-solid fa-rotate'></i> Reorden</span>";
    } else if (health === "excess") {
      healthBadge = "<span class='badge excess'><i class='fa-solid fa-arrow-trend-up'></i> Exceso</span>";
    } else {
      healthBadge = "<span class='badge ok'><i class='fa-solid fa-circle-check'></i> OK</span>";
    }

    const marca = state.marcas.find((m) => m.id === p.marca_id)?.nombre || "Sin marca";
    const categoria = state.categorias.find((c) => c.id === p.categoria_id)?.nombre || "Sin categoría";
    
    const margen = stock.costo > 0 ? Math.round(((stock.precio - stock.costo) / stock.costo) * 100) : 0;
    const valorInventario = (stock.stock * stock.costo).toFixed(2);
    const visibilityBadge = p.activo === false ? "<span class='badge out'>Oculto</span>" : "<span class='badge ok'>Visible</span>";

    const row = document.createElement("div");
    row.className = "row product-row";
    row.innerHTML = `
      <div>
        <div class='title'>${p.nombre} ${visibilityBadge}</div>
        <div class='meta'>${stock.sku || "SKU N/D"} • ${p.numero_modelo || "Modelo N/D"} • ${categoria}</div>
        <div class='meta' style='font-size: 0.76rem; margin-top: 4px; opacity: 0.8;'>${stock.ubicacion || "Ubicación N/D"}</div>
      </div>
      <div>
        <div class='title'>${marca}</div>
        <div class='meta'>ID ${p.id}</div>
      </div>
      <div>
        <div class='title'>${stock.stock}</div>
        <div class='tiny'>Mín: ${stock.min} • Máx: ${stock.max} • Reorden: ${stock.reorden}</div>
      </div>
      <div>
        <div style='font-size: 0.82rem; font-weight: 600; color: #486196;'>${stock.precio} ${stock.moneda}</div>
        <div class='tiny'>Margen: ${margen}% • Val. ${valorInventario}</div>
      </div>
      <div>${healthBadge}</div>
      <div class='row-actions'>
        <div class='stock-controls'>
          <button class='btn secondary icon-only' data-action='minus1' title='Quitar 1'><i class='fa-solid fa-minus'></i></button>
          <button class='btn secondary icon-only' data-action='plus1' title='Agregar 1'><i class='fa-solid fa-plus'></i></button>
          <button class='btn secondary icon-only' data-action='plus5' title='Agregar 5'><i class='fa-solid fa-plus'></i><i class='fa-solid fa-5' style='font-size:.6rem;'></i></button>
        </div>
        <button class='btn secondary icon-only' data-action='reorden' title='Marcar Reorden'><i class='fa-solid fa-cart-plus'></i></button>
        <button class='btn secondary icon-only' data-action='toggle' title='Activar/Desactivar'><i class='fa-solid fa-power-off'></i></button>
        <button class='btn secondary icon-only' data-action='edit' title='Editar'><i class='fa-solid fa-pen'></i></button>
      </div>
    `;

    row.querySelector("[data-action='minus1']")?.addEventListener("click", async () => {
      try {
        await adjustStock(p, -1, "Ajuste manual");
      } catch (err) {
        console.error(err);
        alert("No se pudo actualizar el stock en la base de datos.");
      }
    });
    row.querySelector("[data-action='plus1']")?.addEventListener("click", async () => {
      try {
        await adjustStock(p, +1, "Ajuste manual");
      } catch (err) {
        console.error(err);
        alert("No se pudo actualizar el stock en la base de datos.");
      }
    });
    row.querySelector("[data-action='plus5']")?.addEventListener("click", async () => {
      try {
        await adjustStock(p, +5, "Ingreso rápido");
      } catch (err) {
        console.error(err);
        alert("No se pudo actualizar el stock en la base de datos.");
      }
    });
    row.querySelector("[data-action='reorden']")?.addEventListener("click", () => markReorden(p));
    row.querySelector("[data-action='toggle']")?.addEventListener("click", () => toggleProducto(p));
    row.querySelector("[data-action='edit']")?.addEventListener("click", () => startEditProducto(p));
    els.productoList.appendChild(row);
  });
}

function renderDashboard() {
  const low = lowStockProducts();
  const out = state.productos.filter((p) => productHealth(p.id) === "out").length;
  const reorden = state.productos.filter((p) => productHealth(p.id) === "reorder").length;

  els.kpiProductos.textContent = String(state.productos.length);
  els.kpiCategorias.textContent = String(state.categorias.length);
  els.kpiMarcas.textContent = String(state.marcas.length);
  els.kpiLow.textContent = String(low.length);
  els.kpiAgotados.textContent = String(out);
  els.kpiReorden.textContent = String(reorden);

  // Calcular valor total del inventario
  let valorTotal = 0;
  let margenTotal = 0;
  let margenCount = 0;
  
  state.productos.forEach((p) => {
    const stock = getStockEntry(p.id);
    valorTotal += stock.stock * stock.costo;
    if (stock.costo > 0) {
      const margen = ((stock.precio - stock.costo) / stock.costo) * 100;
      margenTotal += margen;
      margenCount++;
    }
  });

  els.kpiValorTotal.textContent = `$${valorTotal.toFixed(2)}`;
  els.kpiMargenPromedio.textContent = margenCount > 0 ? `${Math.round(margenTotal / margenCount)}%` : "0%";
  const enabledTypes = Object.values(state.alertConfig).filter(Boolean).length;
  els.lowStockPill.textContent =
    enabledTypes === 0
      ? "Alertas desactivadas"
      : low.length > 0
        ? `${low.length} productos en alerta`
        : "Sin alertas";

  renderMovements();
  renderAlertSettings();
  renderCharts();
}

function renderMovements() {
  els.movementList.innerHTML = "";
  if (state.movements.length === 0) {
    els.movementList.innerHTML = "<div class='tiny'>Sin movimientos registrados todavía.</div>";
    return;
  }

  state.movements.slice(0, 12).forEach((mv) => {
    const sign = mv.delta > 0 ? `+${mv.delta}` : `${mv.delta}`;
    const node = document.createElement("div");
    node.className = "movement-item";
    node.innerHTML = `
      <div>
        <strong>${mv.nombre}</strong>
        <div class='tiny'>${mv.reason}</div>
      </div>
      <div style='text-align:right;'>
        <strong style='color:${mv.delta >= 0 ? "#166534" : "#b91c1c"};'>${sign}</strong>
        <div class='tiny'>${new Date(mv.date).toLocaleString("es-MX")}</div>
      </div>
    `;
    els.movementList.appendChild(node);
  });
}

function renderCharts() {
  // ===== GRÁFICA 1: Estado de Stock =====
  const outCount = state.productos.filter((p) => productHealth(p.id) === "out").length;
  const lowCount = state.productos.filter((p) => productHealth(p.id) === "low").length;
  const reorderCount = state.productos.filter((p) => productHealth(p.id) === "reorder").length;
  const excessCount = state.productos.filter((p) => productHealth(p.id) === "excess").length;
  const okCount = state.productos.filter((p) => productHealth(p.id) === "ok").length;

  if (state.stockChart) state.stockChart.destroy();
  state.stockChart = new Chart(els.stockChart, {
    type: "doughnut",
    data: {
      labels: ["OK", "Bajo", "Reorden", "Exceso", "Agotado"],
      datasets: [
        {
          data: [okCount, lowCount, reorderCount, excessCount, outCount],
          backgroundColor: ["#22c55e", "#f59e0b", "#3b82f6", "#a78bfa", "#ef4444"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      plugins: { legend: { position: "bottom" } },
      cutout: "68%",
    },
  });

  // ===== GRÁFICA 2: Distribución de Alertas =====
  if (state.alertasChart) state.alertasChart.destroy();
  const chartOut = state.alertConfig.out ? outCount : 0;
  const chartLow = state.alertConfig.low ? lowCount : 0;
  const chartReorder = state.alertConfig.reorder ? reorderCount : 0;
  const chartExcess = state.alertConfig.excess ? excessCount : 0;

  state.alertasChart = new Chart(els.alertasChart, {
    type: "pie",
    data: {
      labels: ["Agotados", "Stock Bajo", "En Reorden", "Exceso", "Normal"],
      datasets: [
        {
          data: [chartOut, chartLow, chartReorder, chartExcess, okCount],
          backgroundColor: ["#dc2626", "#f59e0b", "#3b82f6", "#a78bfa", "#10b981"],
          borderWidth: 2,
          borderColor: "#fff",
        },
      ],
    },
    options: {
      plugins: { legend: { position: "bottom" } },
    },
  });

  // ===== GRÁFICA 3: Productos por Categoría =====
  const prodPorCat = {};
  state.productos.forEach((p) => {
    const cat = state.categorias.find((c) => c.id === p.categoria_id);
    const catName = cat?.nombre || "Sin categoría";
    prodPorCat[catName] = (prodPorCat[catName] || 0) + 1;
  });

  const catLabels = Object.keys(prodPorCat).sort();
  const catData = catLabels.map((c) => prodPorCat[c]);

  if (state.categoriaChartDash) state.categoriaChartDash.destroy();
  state.categoriaChartDash = new Chart(els.categoriaChartDash, {
    type: "bar",
    data: {
      labels: catLabels,
      datasets: [
        {
          label: "Cantidad",
          data: catData,
          backgroundColor: "#3f6df6",
          borderRadius: 6,
        },
      ],
    },
    options: {
      indexAxis: "y",
      scales: { x: { beginAtZero: true, ticks: { precision: 0 } } },
      plugins: { legend: { display: false } },
    },
  });

  // ===== GRÁFICA 4: Productos por Marca =====
  const prodPorMarca = {};
  state.productos.forEach((p) => {
    const marca = state.marcas.find((m) => m.id === p.marca_id);
    const marcaName = marca?.nombre || "Sin marca";
    prodPorMarca[marcaName] = (prodPorMarca[marcaName] || 0) + 1;
  });

  const marcaLabels = Object.keys(prodPorMarca).sort();
  const marcaData = marcaLabels.map((m) => prodPorMarca[m]);

  if (state.marcaChartDash) state.marcaChartDash.destroy();
  state.marcaChartDash = new Chart(els.marcaChartDash, {
    type: "bar",
    data: {
      labels: marcaLabels,
      datasets: [
        {
          label: "Cantidad",
          data: marcaData,
          backgroundColor: "#8b5cf6",
          borderRadius: 6,
        },
      ],
    },
    options: {
      indexAxis: "y",
      scales: { x: { beginAtZero: true, ticks: { precision: 0 } } },
      plugins: { legend: { display: false } },
    },
  });

  // ===== GRÁFICA 5: Top 5 Productos por Valor =====
  const topValue = state.productos
    .map((p) => {
      const stock = getStockEntry(p.id);
      return {
        nombre: p.nombre.length > 20 ? p.nombre.slice(0, 20) + "…" : p.nombre,
        valor: stock.stock * stock.costo,
      };
    })
    .sort((a, b) => b.valor - a.valor)
    .slice(0, 5);

  if (state.topValueChart) state.topValueChart.destroy();
  state.topValueChart = new Chart(els.topValueChart, {
    type: "bar",
    data: {
      labels: topValue.map((p) => p.nombre),
      datasets: [
        {
          label: "Valor ($)",
          data: topValue.map((p) => p.valor),
          backgroundColor: "#06b6d4",
          borderRadius: 6,
        },
      ],
    },
    options: {
      indexAxis: "y",
      scales: { x: { beginAtZero: true } },
      plugins: { legend: { display: false } },
    },
  });

  // ===== GRÁFICA 6: Valor de Inventario por Categoría =====
  const valorPorCat = {};
  state.productos.forEach((p) => {
    const cat = state.categorias.find((c) => c.id === p.categoria_id);
    const catName = cat?.nombre || "Sin categoría";
    const stock = getStockEntry(p.id);
    valorPorCat[catName] = (valorPorCat[catName] || 0) + stock.stock * stock.costo;
  });

  const valorCatLabels = Object.keys(valorPorCat).sort();
  const valorCatData = valorCatLabels.map((c) => valorPorCat[c]);

  if (state.valorCategoriaChart) state.valorCategoriaChart.destroy();
  state.valorCategoriaChart = new Chart(els.valorCategoria, {
    type: "bar",
    data: {
      labels: valorCatLabels,
      datasets: [
        {
          label: "Valor ($)",
          data: valorCatData,
          backgroundColor: "#ec4899",
          borderRadius: 6,
        },
      ],
    },
    options: {
      indexAxis: "y",
      scales: { x: { beginAtZero: true } },
      plugins: { legend: { display: false } },
    },
  });
}

function resetCategoriaForm() {
  state.editCategoriaId = null;
  state.editCategoriaImageUrl = null;
  els.categoriaFormTitle.textContent = "Agregar categoría";
  els.categoriaForm.reset();
  els.categoriaActiva.value = "true";
  const previewContainer = document.getElementById("categoriaImagePreviewContainer");
  if (previewContainer) {
    previewContainer.innerHTML = "Vista previa de imagen";
  }
}

function resetMarcaForm() {
  state.editMarcaId = null;
  state.editMarcaImageUrl = null;
  els.marcaFormTitle.textContent = "Agregar marca";
  els.marcaForm.reset();
  els.marcaActiva.value = "true";
  const previewContainer = document.getElementById("marcaImagePreviewContainer");
  if (previewContainer) {
    previewContainer.innerHTML = "Vista previa de imagen";
  }
}

function resetProductoForm() {
  state.editProductoId = null;
  state.editProductoImageUrl = null;
  els.productoFormTitle.textContent = "Agregar producto";
  els.productoForm.reset();
  els.productoActivo.value = "true";
  els.productoStock.value = "0";
  els.productoMinimo.value = "5";
  els.productoMaximo.value = "100";
  els.productoReorden.value = "10";
  els.productoCosto.value = "0";
  els.productoPrecio.value = "0";
  els.productoMargen.value = "0";
  els.productoMoneda.value = "USD";
  const previewContainer = document.getElementById("productoImagePreviewContainer");
  if (previewContainer) {
    previewContainer.innerHTML = "Vista previa de imagen";
  }
}

function startEditCategoria(cat) {
  state.editCategoriaId = cat.id;
  state.editCategoriaImageUrl = cat.imagen || null;
  els.categoriaFormTitle.textContent = `Editar categoría #${cat.id}`;
  els.categoriaNombre.value = cat.nombre || "";
  els.categoriaActiva.value = cat.activa === false ? "false" : "true";
  els.categoriaImagen.value = "";
  const previewContainer = document.getElementById("categoriaImagePreviewContainer");
  if (previewContainer && cat.imagen) {
    previewContainer.innerHTML = `<img src="${cat.imagen}" style="max-width:100%; max-height:200px; border-radius:10px; border:1px solid #dce7fd;" />`;
  }
}

function startEditMarca(marca) {
  state.editMarcaId = marca.id;
  state.editMarcaImageUrl = marca.imagen || null;
  els.marcaFormTitle.textContent = `Editar marca #${marca.id}`;
  els.marcaNombre.value = marca.nombre || "";
  els.marcaActiva.value = marca.activa === false ? "false" : "true";
  els.marcaImagen.value = "";
  const previewContainer = document.getElementById("marcaImagePreviewContainer");
  if (previewContainer && marca.imagen) {
    previewContainer.innerHTML = `<img src="${marca.imagen}" style="max-width:100%; max-height:200px; border-radius:10px; border:1px solid #dce7fd;" />`;
  }
}

async function startEditProducto(producto) {
  state.editProductoId = producto.id;
  state.editProductoImageUrl = producto.imagen || null;

  els.productoFormTitle.textContent = `Editar producto #${producto.id}`;
  els.productoNombre.value = producto.nombre || "";
  els.productoSku.value = getStockEntry(producto.id).sku || "";
  els.productoModelo.value = producto.numero_modelo || "";
  els.productoMarca.value = String(producto.marca_id || "");
  els.productoCategoria.value = String(producto.categoria_id || "");
  els.productoProveedor.value = getStockEntry(producto.id).proveedor || "";
  els.productoUbicacion.value = getStockEntry(producto.id).ubicacion || "";
  els.productoActivo.value = producto.activo === false ? "false" : "true";
  els.productoDescripcion.value = producto.descripcion || "";
  els.productoImagen.value = "";

  const previewContainer = document.getElementById("productoImagePreviewContainer");
  if (previewContainer && producto.imagen) {
    previewContainer.innerHTML = `<img src="${producto.imagen}" style="max-width:100%; max-height:200px; border-radius:10px; border:1px solid #dce7fd;" />`;
  }

  const stock = getStockEntry(producto.id);
  els.productoStock.value = String(stock.stock);
  els.productoMinimo.value = String(stock.min);
  els.productoMaximo.value = String(stock.max);
  els.productoReorden.value = String(stock.reorden);
  els.productoCosto.value = String(stock.costo);
  els.productoPrecio.value = String(stock.precio);
  els.productoMoneda.value = stock.moneda;
  els.productoLote.value = stock.lote || "";
  els.productoFecha.value = stock.fechaAdquisicion || "";
  
  updateMargen();

  const { data, error } = await supabase
    .from("producto_caracteristicas")
    .select("texto,activo")
    .eq("producto_id", producto.id)
    .order("id", { ascending: true });

  if (error) {
    console.error("Error cargando características:", error);
    els.productoCaracteristicas.value = "";
    return;
  }

  const lines = (data || [])
    .filter((r) => r.activo !== false)
    .map((r) => r.texto)
    .filter(Boolean);

  els.productoCaracteristicas.value = lines.join("\n");
}

async function toggleCategoria(cat) {
  const { error } = await supabase.from("categorias").update({ activa: cat.activa === false }).eq("id", cat.id);
  if (error) {
    alert("No se pudo cambiar estado de la categoría.");
    return;
  }
  await loadAll();
}

async function toggleMarca(marca) {
  const { error } = await supabase.from("marcas").update({ activa: marca.activa === false }).eq("id", marca.id);
  if (error) {
    alert("No se pudo cambiar estado de la marca.");
    return;
  }
  await loadAll();
}

async function toggleProducto(producto) {
  const { error } = await supabase.from("productos").update({ activo: producto.activo === false }).eq("id", producto.id);
  if (error) {
    alert("No se pudo cambiar estado del producto.");
    return;
  }
  await loadAll();
}

async function adjustStock(producto, delta, reason) {
  const current = getStockEntry(producto.id);
  const next = Math.max(0, Number(current.stock || 0) + delta);
  const applied = next - Number(current.stock || 0);

  if (applied === 0) return;

  setSyncStatus("Guardando stock...");
  await updateStockEntry(producto.id, { stock: next });
  addMovement(producto.id, producto.nombre, applied, reason);
  renderProductos();
  renderDashboard();
  setSyncStatus(`Actualizado ${new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}`);
}

function parseCaracteristicas() {
  return String(els.productoCaracteristicas.value || "")
    .split("\n")
    .map((t) => t.trim())
    .filter(Boolean);
}

function markReorden(producto) {
  addMovement(producto.id, producto.nombre, 0, "Reorden marcada");
  showNotification(`Reorden marcada para ${producto.nombre}.`, "info");
  renderProductos();
  renderDashboard();
}

function setupImagePreview(inputElement, containerElement) {
  if (!inputElement || !containerElement) return; // Verificar que existan
  inputElement.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        containerElement.innerHTML = `<img src="${event.target.result}" style="max-width:100%; max-height:200px; border-radius:10px; border:1px solid #dce7fd;" />`;
      };
      reader.readAsDataURL(file);
    }
  });
}

if (els.categoriaImagen && document.getElementById("categoriaImagePreviewContainer")) {
  setupImagePreview(els.categoriaImagen, document.getElementById("categoriaImagePreviewContainer"));
}
if (els.marcaImagen && document.getElementById("marcaImagePreviewContainer")) {
  setupImagePreview(els.marcaImagen, document.getElementById("marcaImagePreviewContainer"));
}
if (els.productoImagen && document.getElementById("productoImagePreviewContainer")) {
  setupImagePreview(els.productoImagen, document.getElementById("productoImagePreviewContainer"));
}

els.categoriaForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = els.categoriaNombre.value.trim();
  const activa = els.categoriaActiva.value === "true";
  const file = els.categoriaImagen.files[0];

  if (!nombre) return;

  const wasEditing = Boolean(state.editCategoriaId);

  try {
    setSyncStatus("Guardando categoría...");
    let imageUrl = state.editCategoriaImageUrl || null;

    if (file) imageUrl = await uploadToImgbb(file);
    if (!state.editCategoriaId && !imageUrl) {
      showNotification("Selecciona una imagen para la nueva categoría.", "warning");
      setSyncStatus("Listo");
      return;
    }

    if (state.editCategoriaId) {
      const { error } = await supabase
        .from("categorias")
        .update({ nombre, imagen: imageUrl, activa })
        .eq("id", state.editCategoriaId);
      if (error) throw error;
    } else {
      const id = await getNextId("categorias");
      const { error } = await supabase.from("categorias").insert([{ id, nombre, imagen: imageUrl, activa }]);
      if (error) throw error;
    }

    resetCategoriaForm();
    await loadAll();
    showNotification(wasEditing ? "Categoría actualizada correctamente." : "Categoría creada correctamente.", "success");
  } catch (err) {
    console.error(err);
    showNotification("Error guardando categoría.", "error");
    setSyncStatus("Error");
  }
});

els.marcaForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nombre = els.marcaNombre.value.trim();
  const activa = els.marcaActiva.value === "true";
  const file = els.marcaImagen.files[0];

  if (!nombre) return;

  const wasEditing = Boolean(state.editMarcaId);

  try {
    setSyncStatus("Guardando marca...");
    let imageUrl = state.editMarcaImageUrl || null;

    if (file) imageUrl = await uploadToImgbb(file);
    if (!state.editMarcaId && !imageUrl) {
      showNotification("Selecciona una imagen para la nueva marca.", "warning");
      setSyncStatus("Listo");
      return;
    }

    if (state.editMarcaId) {
      const { error } = await supabase
        .from("marcas")
        .update({ nombre, imagen: imageUrl, activa })
        .eq("id", state.editMarcaId);
      if (error) throw error;
    } else {
      const id = await getNextId("marcas");
      const { error } = await supabase.from("marcas").insert([{ id, nombre, imagen: imageUrl, activa }]);
      if (error) throw error;
    }

    resetMarcaForm();
    await loadAll();
    showNotification(wasEditing ? "Marca actualizada correctamente." : "Marca creada correctamente.", "success");
  } catch (err) {
    console.error(err);
    showNotification("Error guardando marca.", "error");
    setSyncStatus("Error");
  }
});

els.productoForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const nombre = els.productoNombre.value.trim();
  const sku = els.productoSku.value.trim();
  const numeroModelo = els.productoModelo.value.trim();
  const marcaId = Number(els.productoMarca.value);
  const categoriaId = Number(els.productoCategoria.value);
  const proveedor = els.productoProveedor.value.trim();
  const ubicacion = els.productoUbicacion.value.trim();
  const activo = els.productoActivo.value === "true";
  const descripcion = els.productoDescripcion.value.trim();
  const file = els.productoImagen.files[0];
  const stock = Math.max(0, Number(els.productoStock.value || 0));
  const min = Math.max(0, Number(els.productoMinimo.value || 0));
  const max = Math.max(0, Number(els.productoMaximo.value || 0));
  const reorden = Math.max(0, Number(els.productoReorden.value || 0));
  const costo = Math.max(0, Number(els.productoCosto.value || 0));
  const precio = Math.max(0, Number(els.productoPrecio.value || 0));
  const moneda = els.productoMoneda.value || "USD";
  const lote = els.productoLote.value.trim();
  const fechaAdquisicion = els.productoFecha.value;
  const caracteristicas = parseCaracteristicas();

  if (!nombre || !sku || !numeroModelo || !marcaId || !categoriaId) {
    showNotification("Completa todos los campos obligatorios del producto.", "warning");
    return;
  }

  const duplicateMessage = findDuplicateProducto({
    nombre,
    numeroModelo,
    sku,
    excludeId: state.editProductoId,
  });

  if (duplicateMessage) {
    showNotification(duplicateMessage, "warning");
    return;
  }

  let duplicateMessageDb = null;
  try {
    duplicateMessageDb = await findDuplicateProductoInDb({
      nombre,
      numeroModelo,
      sku,
      excludeId: state.editProductoId,
    });
  } catch (err) {
    console.error(err);
    showNotification("No se pudo validar duplicados en base de datos.", "error");
    return;
  }

  if (duplicateMessageDb) {
    showNotification(duplicateMessageDb, "warning");
    return;
  }

  const wasEditing = Boolean(state.editProductoId);

  try {
    setSyncStatus("Guardando producto...");

    let imageUrl = state.editProductoImageUrl;
    if (file) imageUrl = await uploadToImgbb(file);

    if (!state.editProductoId && !imageUrl) {
      showNotification("Selecciona una imagen para el nuevo producto.", "warning");
      setSyncStatus("Listo");
      return;
    }

    let productId = state.editProductoId;

    if (productId) {
      const { error } = await supabase
        .from("productos")
        .update({
          nombre,
          numero_modelo: numeroModelo,
          marca_id: marcaId,
          categoria_id: categoriaId,
          descripcion,
          imagen: imageUrl,
          activo,
        })
        .eq("id", productId);
      if (error) throw error;

      const { error: deleteCarErr } = await supabase.from("producto_caracteristicas").delete().eq("producto_id", productId);
      if (deleteCarErr) console.error(deleteCarErr);
    } else {
      productId = await getNextId("productos");
      const { error } = await supabase.from("productos").insert([
        {
          id: productId,
          nombre,
          numero_modelo: numeroModelo,
          marca_id: marcaId,
          categoria_id: categoriaId,
          descripcion,
          imagen: imageUrl,
          activo,
        },
      ]);
      if (error) throw error;
    }

    if (caracteristicas.length > 0) {
      const rows = caracteristicas.map((texto) => ({ producto_id: productId, texto, activo: true }));
      const { error: carErr } = await supabase.from("producto_caracteristicas").insert(rows);
      if (carErr) console.error("Error guardando características:", carErr);
    }

    await updateStockEntry(productId, {
      stock, 
      min, 
      max, 
      reorden, 
      costo, 
      precio, 
      moneda,
      sku,
      proveedor,
      ubicacion,
      lote,
      fechaAdquisicion,
    });
    addMovement(productId, nombre, 0, "Registro/actualización de producto");

    resetProductoForm();
    await loadAll();
    showNotification(wasEditing ? "Producto actualizado correctamente." : "Producto creado correctamente.", "success");
  } catch (err) {
    console.error(err);
    showNotification("Error guardando producto.", "error");
    setSyncStatus("Error");
  }
});

els.cancelCategoriaBtn.addEventListener("click", resetCategoriaForm);
els.cancelMarcaBtn.addEventListener("click", resetMarcaForm);
els.cancelProductoBtn.addEventListener("click", resetProductoForm);

function updateMargen() {
  const costo = Number(els.productoCosto.value || 0);
  const precio = Number(els.productoPrecio.value || 0);
  let margen = 0;
  
  if (costo > 0) {
    margen = Math.round(((precio - costo) / costo) * 100);
  }
  
  els.productoMargen.value = margen;
}

function setupNavigation() {
  const titleMap = {
    dashboardView: "Dashboard de Inventario",
    categoriasView: "Gestión de Categorías",
    marcasView: "Gestión de Marcas",
    productosView: "Gestión de Productos y Stock",
  };

  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-view");
      document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));
      document.getElementById(target)?.classList.add("active");

      if (els.viewTitle) els.viewTitle.textContent = titleMap[target] || "Inventario";
    });
  });
}

function setupSearchHandlers() {
  const map = [
    [els.categoriaSearch, renderCategorias],
    [els.categoriaSearchBy, renderCategorias],
    [els.marcaSearch, renderMarcas],
    [els.marcaSearchBy, renderMarcas],
    [els.productoSearch, renderProductos],
    [els.productoSearchBy, renderProductos],
  ];

  map.forEach(([element, handler]) => {
    if (!element) return;
    element.addEventListener("input", handler);
    element.addEventListener("change", handler);
  });
}

async function bootstrap() {
  state.stockMap = {};
  state.movements = loadMovementStore();
  state.alertConfig = loadAlertConfig();

  setupNavigation();
  setupSearchHandlers();
  setupAlertControls();
  resetCategoriaForm();
  resetMarcaForm();
  resetProductoForm();
  renderMovements();

  try {
    await loadAll();
  } catch (err) {
    console.error(err);
    alert("No se pudo inicializar el inventario. Revisa las credenciales de Supabase.");
    setSyncStatus("Error de conexión");
  }
}

bootstrap();
