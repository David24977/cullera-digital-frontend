const API_URL = import.meta.env.VITE_API_URL;


// ===== GET (públicos, usados en admin) =====
export async function getNoticiasAdmin(page = 0, size = 50) {
  const response = await fetch(`${API_URL}/noticias?page=${page}&size=${size}`);
  if (!response.ok) throw new Error("Error al cargar noticias (admin)");
  return response.json();
}

export async function buscarNoticiasPorTitularAdmin(texto) {
  const response = await fetch(
    `${API_URL}/noticias/titular?texto=${encodeURIComponent(texto)}`
  );
  if (!response.ok) throw new Error("Error buscando por titular");
  return response.json();
}

export async function buscarNoticiasPorCategoriaAdmin(categoria) {
  const response = await fetch(
    `${API_URL}/noticias/categoria?categoria=${categoria}`
  );
  if (!response.ok) throw new Error("Error buscando por categoría");
  return response.json();
}

export async function buscarNoticiasPorFechaAdmin(fecha) {
  const response = await fetch(`${API_URL}/noticias/fecha?fecha=${fecha}`);
  if (!response.ok) throw new Error("Error buscando por fecha");
  return response.json();
}

export async function buscarNoticiasEntreFechasAdmin(inicio, fin) {
  const response = await fetch(
    `${API_URL}/noticias/entreFechas?inicio=${inicio}&fin=${fin}`
  );
  if (!response.ok) throw new Error("Error buscando entre fechas");
  return response.json();
}

// ===== ACCIONES PROTEGIDAS =====
export async function crearNoticia(noticia) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/noticias`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(noticia),
  });

  if (!response.ok) throw new Error("Error al crear la noticia");
  return response.json();
}

export async function modificarNoticia(id, noticia) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/noticias/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(noticia),
  });

  if (!response.ok) throw new Error("Error al modificar la noticia");
  return response.json();
}

export async function borrarNoticia(id) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}/noticias/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) throw new Error("Error al borrar la noticia");
}
