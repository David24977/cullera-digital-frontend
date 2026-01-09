const API_URL = import.meta.env.VITE_API_URL;


export async function getNoticias(page = 0, size = 10) {
  const response = await fetch(
    `${API_URL}/noticias?page=${page}&size=${size}`
  );

  if (!response.ok) {
    throw new Error("Error al cargar noticias");
  }

  return response.json();
}

export async function getNoticiaById(id) {
  const response = await fetch(
    `${API_URL}/noticias/${id}`
  );

  if (!response.ok) {
    throw new Error("Error al cargar la noticia");
  }

  return response.json();
}

export async function buscarNoticiasPorTitular(texto) {
  const response = await fetch(
    `${API_URL}/noticias/titular?texto=${encodeURIComponent(texto)}`
  );

  if (!response.ok) {
    throw new Error("Error al buscar noticias");
  }

  return response.json();
}

export async function buscarNoticiasPorFecha(fecha) {
  const response = await fetch(
    `${API_URL}/noticias/fecha?fecha=${fecha}`
  );

  if (!response.ok) {
    throw new Error("Error al buscar por fecha");
  }

  return response.json();
}

export async function buscarNoticiasEntreFechas(inicio, fin) {
  const response = await fetch(
    `${API_URL}/noticias/entreFechas?inicio=${inicio}&fin=${fin}`
  );

  if (!response.ok) {
    throw new Error("Error al buscar entre fechas");
  }

  return response.json();
}

