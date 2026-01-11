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
  // ===== AUTH =====
  const [password, setPassword] = useState("");
  const [logged, setLogged] = useState(isLoggedIn());

  // ===== DATA =====
  const [noticias, setNoticias] = useState([]);

  // ===== FORM =====
  const [form, setForm] = useState({
    titular: "",
    resumen: "",
    contenido: "",
    categoria: "",
    imagenUrl: "",
    destacada: false, // ✅ NUEVO
  });

  const [editandoId, setEditandoId] = useState(null);

  // ===== FILTROS =====
  const [textoBusqueda, setTextoBusqueda] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [tipoFecha, setTipoFecha] = useState("");
  const [fechaExacta, setFechaExacta] = useState("");
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");

  // =====================
  // CARGA
  // =====================
  const cargarNoticias = async () => {
    const data = await getNoticiasAdmin();
    setNoticias(data.content ?? data);
  };

  const cargarNoticiasIniciales = async () => {
    try {
      const hoy = new Date();
      const inicio = new Date();
      inicio.setDate(hoy.getDate() - 3);

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

  // =====================
  // LOGIN / LOGOUT
  // =====================
  const handleLogin = async (e) => {
    e.preventDefault();

    const ok = await login(password);

    if (ok) {
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
    resetForm();
  };

  const resetForm = () => {
    setForm({
      titular: "",
      resumen: "",
      contenido: "",
      categoria: "",
      imagenUrl: "",
      destacada: false,
    });
  };

  // =====================
  // BUSCADOR VIVO
  // =====================
  const handleTextoChange = async (value) => {
    setTextoBusqueda(value);

    if (value.trim().length >= 2) {
      const data = await buscarNoticiasPorTitularAdmin(value.trim());
      setNoticias(data);
      return;
    }

    if (value.trim().length === 0) {
      await aplicarFiltros();
    }
  };

  // =====================
  // FILTROS
  // =====================
  const aplicarFiltros = async () => {
    try {
      if (categoriaFiltro) {
        setNoticias(await buscarNoticiasPorCategoriaAdmin(categoriaFiltro));
        return;
      }

      if (tipoFecha === "exacta" && fechaExacta) {
        setNoticias(await buscarNoticiasPorFechaAdmin(fechaExacta));
        return;
      }

      if (tipoFecha === "rango" && inicio && fin) {
        setNoticias(await buscarNoticiasEntreFechasAdmin(inicio, fin));
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
  // BORRAR
  // =====================
  const handleBorrar = async (id) => {
    if (!window.confirm("¿Borrar esta noticia?")) return;

    await borrarNoticia(id);

    if (textoBusqueda.trim().length >= 2) {
      setNoticias(await buscarNoticiasPorTitularAdmin(textoBusqueda.trim()));
    } else {
      await aplicarFiltros();
    }
  };

  // =====================
  // CREAR / MODIFICAR
  // =====================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editandoId) {
      await modificarNoticia(editandoId, form);
    } else {
      await crearNoticia(form);
    }

    resetForm();
    setEditandoId(null);

    if (textoBusqueda.trim().length >= 2) {
      setNoticias(await buscarNoticiasPorTitularAdmin(textoBusqueda.trim()));
    } else {
      await aplicarFiltros();
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
        <div className="flex justify-between mb-6">
          <h2 className="text-2xl font-bold">Panel de administración</h2>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Salir
          </button>
        </div>

        {/* ===================== */}
        {/* FORM CREAR / EDITAR */}
        {/* ===================== */}
        <form onSubmit={handleSubmit} className="grid gap-4 mb-10">
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

          {/* ✅ DESTACADA */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.destacada}
              onChange={(e) =>
                setForm({ ...form, destacada: e.target.checked })
              }
            />
            <span className="font-medium">Marcar como destacada</span>
          </label>

          <button className="bg-green-600 text-white py-2 rounded">
            {editandoId ? "Guardar cambios" : "Crear noticia"}
          </button>
        </form>

        {/* ===================== */}
        {/* FILTROS ADMIN */}
        {/* ===================== */}
        <section className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Buscar / filtrar</h3>

          <div className="grid gap-3 md:grid-cols-3">
            <input
              value={textoBusqueda}
              onChange={(e) => handleTextoChange(e.target.value)}
              placeholder="Buscar por titular..."
              className="border rounded p-2"
            />

            <select
              value={categoriaFiltro}
              onChange={(e) => setCategoriaFiltro(e.target.value)}
              className="border rounded p-2"
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

            <input
              type="date"
              value={fechaExacta}
              onChange={(e) => {
                setTipoFecha("exacta");
                setFechaExacta(e.target.value);
              }}
              className="border rounded p-2"
            />
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
          </div>
        </section>

        {/* ===================== */}
        {/* LISTADO */}
        {/* ===================== */}
        <ul className="space-y-2">
          {noticias.map((n) => (
            <li
              key={n.id}
              className="flex justify-between items-center border p-3 rounded"
            >
              <div>
                {n.destacada && <span className="mr-2">⭐</span>}
                {n.titular}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setForm({
                      titular: n.titular,
                      resumen: n.resumen,
                      contenido: n.contenido,
                      categoria: n.categoria,
                      imagenUrl: n.imagenUrl || "",
                      destacada: n.destacada ?? false,
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
      </div>
    </div>
  );
}
