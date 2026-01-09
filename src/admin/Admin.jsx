import { useState } from "react";
import { login, logout, isLoggedIn } from "../services/auth";
import {
  getNoticiasAdmin,
  borrarNoticia,
  crearNoticia,
  modificarNoticia,
  buscarNoticiasPorTitularAdmin,
  buscarNoticiasPorCategoriaAdmin,
  buscarNoticiasPorFechaAdmin,
  buscarNoticiasEntreFechasAdmin,
} from "../services/adminApi";

export default function Admin() {
  // ✅ Mantener sesión: si ya hay token válido, entras directo
  const [password, setPassword] = useState("");
  const [logged, setLogged] = useState(isLoggedIn());

  const [noticias, setNoticias] = useState([]);

  // Form crear/editar
  const [form, setForm] = useState({
    titular: "",
    resumen: "",
    contenido: "",
    categoria: "",
    imagenUrl: "",
  });
  const [editandoId, setEditandoId] = useState(null);

  // Filtros (Admin)
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");

  // tipoFecha: "" | "exacta" | "rango"
  const [tipoFecha, setTipoFecha] = useState("");
  const [fechaExacta, setFechaExacta] = useState("");
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");

  // =====================
  // CARGAR / APLICAR FILTROS
  // =====================
  const cargarNoticias = async () => {
    const data = await getNoticiasAdmin();
    setNoticias(data.content ?? data);
  };

  const cargarNoticiasIniciales = async () => {
  try {
    const hoy = new Date();
    const inicio = new Date();
    inicio.setDate(hoy.getDate() - 3); // últimos 3 días

    const toISO = (d) => d.toISOString().slice(0, 10);

    const data = await buscarNoticiasEntreFechasAdmin(
      toISO(inicio),
      toISO(hoy)
    );

    setNoticias(data);
  } catch {
    alert("Error cargando noticias recientes");
  }
};


  const aplicarFiltros = async () => {
    try {
      // Prioridad: titular (cuando no hay texto, aplica resto)
      if (categoriaFiltro) {
        const data = await buscarNoticiasPorCategoriaAdmin(categoriaFiltro);
        setNoticias(data);
        return;
      }

      if (tipoFecha === "exacta" && fechaExacta) {
        const data = await buscarNoticiasPorFechaAdmin(fechaExacta);
        setNoticias(data);
        return;
      }

      if (tipoFecha === "rango" && inicio && fin) {
        const data = await buscarNoticiasEntreFechasAdmin(inicio, fin);
        setNoticias(data);
        return;
      }

      await cargarNoticias();
    } catch {
      alert("Error aplicando filtros");
    }
  };

  const limpiarFiltros = async () => {
    setTextoBusqueda("");
    setCategoriaFiltro("");
    setTipoFecha("");
    setFechaExacta("");
    setInicio("");
    setFin("");
    await cargarNoticias();
  };

  // =====================
  // LOGIN / LOGOUT
  // =====================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (login(password)) {
      setLogged(true);
      await cargarNoticiasIniciales();
    } else {
      alert("Contraseña incorrecta");
    }
  };

  const handleLogout = () => {
    logout();
    setLogged(false);
    setNoticias([]);
    setEditandoId(null);
    setForm({
      titular: "",
      resumen: "",
      contenido: "",
      categoria: "",
      imagenUrl: "",
    });
    setTextoBusqueda("");
    setCategoriaFiltro("");
    setTipoFecha("");
    setFechaExacta("");
    setInicio("");
    setFin("");
  };

  // =====================
  // BUSCADOR VIVO TITULAR (>=2 letras)
  // =====================
  const handleTextoChange = async (value) => {
    setTextoBusqueda(value);

    // Con 2 letras ya busca
    if (value.trim().length >= 2) {
      try {
        const data = await buscarNoticiasPorTitularAdmin(value.trim());
        setNoticias(data);
      } catch {
        alert("Error buscando por titular");
      }
      return;
    }

    // Si borras el texto (0), vuelve a filtros (categoría/fechas) o listado
    if (value.trim().length === 0) {
      await aplicarFiltros();
    }
  };

  // =====================
  // BORRAR
  // =====================
  const handleBorrar = async (id) => {
    if (!window.confirm("¿Borrar esta noticia?")) return;

    try {
      await borrarNoticia(id);
      // Si hay búsqueda por texto activa (>=2), re-busca; si no, reaplica filtros
      if (textoBusqueda.trim().length >= 2) {
        const data = await buscarNoticiasPorTitularAdmin(textoBusqueda.trim());
        setNoticias(data);
      } else {
        await aplicarFiltros();
      }
    } catch {
      alert("No se pudo borrar");
    }
  };

  // =====================
  // CREAR / MODIFICAR
  // =====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editandoId) {
        await modificarNoticia(editandoId, form);
      } else {
        await crearNoticia(form);
      }

      setForm({
        titular: "",
        resumen: "",
        contenido: "",
        categoria: "",
        imagenUrl: "",
      });
      setEditandoId(null);

      // refresco según estado actual
      if (textoBusqueda.trim().length >= 2) {
        const data = await buscarNoticiasPorTitularAdmin(textoBusqueda.trim());
        setNoticias(data);
      } else {
        await aplicarFiltros();
      }
    } catch {
      alert("Error guardando la noticia");
    }
  };

  // =====================
  // LOGIN VIEW
  // =====================
  if (!logged) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded-xl shadow w-full max-w-sm"
        >
          <h2 className="text-xl font-bold mb-4 text-center">
            Acceso administrador
          </h2>

          <input
            type="password"
            placeholder="Contraseña admin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded p-2 mb-4"
          />

          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Entrar
          </button>
        </form>
      </div>
    );
  }

  // =====================
  // PANEL ADMIN
  // =====================
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white p-6 rounded-xl shadow">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-6">
          <h2 className="text-2xl font-bold">Panel de administración</h2>

          <div className="flex gap-2">
            {/* Ir a público sin desloguear */}
            <a
              href="/"
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
            >
              Ver web pública
            </a>

            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Salir
            </button>
          </div>
        </div>

        {/* ===================== */}
        {/* FORM CREAR/EDITAR */}
        {/* ===================== */}
        <section className="mb-10">
          <h3 className="text-xl font-semibold mb-4">
            {editandoId ? "Editar noticia" : "Crear noticia"}
          </h3>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <input
              placeholder="Titular"
              value={form.titular}
              onChange={(e) => setForm({ ...form, titular: e.target.value })}
              className="border rounded p-2"
            />

            <input
              placeholder="Resumen"
              value={form.resumen}
              onChange={(e) => setForm({ ...form, resumen: e.target.value })}
              className="border rounded p-2"
            />

            <textarea
              placeholder="Contenido"
              value={form.contenido}
              onChange={(e) => setForm({ ...form, contenido: e.target.value })}
              className="border rounded p-2 h-32"
            />

            <select
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              className="border rounded p-2"
            >
              <option value="">-- Categoría --</option>
              <option value="GENERAL">General</option>
              <option value="SUCESOS">Sucesos</option>
              <option value="EVENTOS">Eventos</option>
              <option value="DEPORTES">Deportes</option>
              <option value="CULTURA">Cultura</option>
              <option value="FALLAS">Fallas</option>
              <option value="POLITICA">Política</option>
              <option value="AVISOS">Avisos</option>
              <option value="SOCIEDAD">Sociedad</option>
            </select>

            <input
              placeholder="URL imagen (opcional)"
              value={form.imagenUrl}
              onChange={(e) => setForm({ ...form, imagenUrl: e.target.value })}
              className="border rounded p-2"
            />

            <div className="flex gap-2">
              <button className="bg-green-600 text-white py-2 px-4 rounded">
                {editandoId ? "Guardar cambios" : "Crear"}
              </button>

              {editandoId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditandoId(null);
                    setForm({
                      titular: "",
                      resumen: "",
                      contenido: "",
                      categoria: "",
                      imagenUrl: "",
                    });
                  }}
                  className="bg-gray-200 py-2 px-4 rounded"
                >
                  Cancelar edición
                </button>
              )}
            </div>
          </form>
        </section>

        {/* ===================== */}
        {/* FILTROS ADMIN */}
        {/* ===================== */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Buscar / filtrar</h3>

          <div className="grid gap-3 md:grid-cols-3">
            {/* Buscador vivo */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1">
                Titular (escribe 2 letras)
              </label>
              <input
                value={textoBusqueda}
                onChange={(e) => handleTextoChange(e.target.value)}
                placeholder="Ej: fa, ay, de..."
                className="w-full border rounded p-2"
              />
              <p className="text-xs text-gray-500 mt-1">
                Si escribes 2+ letras, busca automáticamente.
              </p>
            </div>

            {/* Categoría */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1">Categoría</label>
              <select
                value={categoriaFiltro}
                onChange={async (e) => {
                  setCategoriaFiltro(e.target.value);

                  // Si estás escribiendo texto (>=2), lo mandamos por titular (prioridad)
                  // Si no, aplica categoría al instante
                  if (textoBusqueda.trim().length < 2) {
                    // peq. truco: esperamos a que React actualice estado
                    const cat = e.target.value;
                    if (cat) {
                      try {
                        const data = await buscarNoticiasPorCategoriaAdmin(cat);
                        setNoticias(data);
                      } catch {
                        alert("Error buscando por categoría");
                      }
                    } else {
                      await aplicarFiltros();
                    }
                  }
                }}
                className="w-full border rounded p-2"
              >
                <option value="">(todas)</option>
                <option value="GENERAL">General</option>
                <option value="SUCESOS">Sucesos</option>
                <option value="EVENTOS">Eventos</option>
                <option value="DEPORTES">Deportes</option>
                <option value="CULTURA">Cultura</option>
                <option value="FALLAS">Fallas</option>
                <option value="POLITICA">Política</option>
                <option value="AVISOS">Avisos</option>
                <option value="SOCIEDAD">Sociedad</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Si seleccionas solo categoría, filtra sin más.
              </p>
            </div>

            {/* Fechas (usables) */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-1">Fechas</label>

              <div className="flex gap-3 items-center mb-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="tipoFecha"
                    checked={tipoFecha === "exacta"}
                    onChange={() => setTipoFecha("exacta")}
                  />
                  Fecha exacta
                </label>

                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="tipoFecha"
                    checked={tipoFecha === "rango"}
                    onChange={() => setTipoFecha("rango")}
                  />
                  Entre fechas
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setTipoFecha("");
                    setFechaExacta("");
                    setInicio("");
                    setFin("");
                  }}
                  className="text-sm underline text-gray-600"
                >
                  quitar
                </button>
              </div>

              {tipoFecha === "exacta" && (
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Selecciona una fecha
                  </label>
                  <input
                    type="date"
                    value={fechaExacta}
                    onChange={(e) => setFechaExacta(e.target.value)}
                    className="w-full border rounded p-2"
                  />
                </div>
              )}

              {tipoFecha === "rango" && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Desde
                    </label>
                    <input
                      type="date"
                      value={inicio}
                      onChange={(e) => setInicio(e.target.value)}
                      className="w-full border rounded p-2"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Hasta
                    </label>
                    <input
                      type="date"
                      value={fin}
                      onChange={(e) => setFin(e.target.value)}
                      className="w-full border rounded p-2"
                    />
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-1">
                Pulsa “Aplicar” para filtrar por fechas.
              </p>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={aplicarFiltros}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Aplicar
            </button>

            <button
              type="button"
              onClick={limpiarFiltros}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Limpiar
            </button>

            <button
              type="button"
              onClick={cargarNoticias}
              className="bg-gray-200 px-4 py-2 rounded"
            >
              Recargar
            </button>
          </div>
        </section>

        {/* ===================== */}
        {/* LISTADO */}
        {/* ===================== */}
        <section>
          <h3 className="text-xl font-semibold mb-4">Noticias</h3>

          <ul className="space-y-2">
            {noticias.map((n) => (
              <li
                key={n.id}
                className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border p-3 rounded"
              >
                <div className="font-medium">{n.titular}</div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setForm({
                        titular: n.titular,
                        resumen: n.resumen,
                        contenido: n.contenido,
                        categoria: n.categoria,
                        imagenUrl: n.imagenUrl || "",
                      });
                      setEditandoId(n.id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="px-3 py-1 bg-yellow-400 rounded"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() => handleBorrar(n.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
