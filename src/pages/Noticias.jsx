import { useEffect, useState } from "react";
import { getNoticias, buscarNoticiasPorTitular } from "../services/api";
import MediaNoticia from "../components/MediaNoticia";
import { Link } from "react-router-dom";
import CarruselPublicidad from "../components/CarruselPublicidad";

function Noticias() {
  const [hoy, setHoy] = useState([]);
  const [categoria, setCategoria] = useState("TODAS");
  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState(null);

  // ===== HISTÓRICO PAGEABLE =====
  const [historico, setHistorico] = useState([]);
  const [pageHistorico, setPageHistorico] = useState(0);
  const [hasMoreHistorico, setHasMoreHistorico] = useState(true);
  const [loadingHistorico, setLoadingHistorico] = useState(false);

  const categorias = [
    "TODAS",
    "GENERAL",
    "SUCESOS",
    "EVENTOS",
    "DEPORTES",
    "CULTURA",
    "FALLAS",
    "POLITICA",
    "AVISOS",
    "SOCIEDAD",
  ];

  // =====================
  // CARGA INICIAL
  // =====================
  useEffect(() => {
    const cargarNoticias = async () => {
      try {
        const data = await getNoticias(0, 20);

        const hoyStr = new Date().toISOString().split("T")[0];

        const noticiasHoy = data.content.filter(
          (n) => n.fecha === hoyStr
        );

        setHoy(noticiasHoy);
      } catch {
        setError("No se pudieron cargar las noticias");
      }
    };

    cargarNoticias();
  }, []);

  // =====================
  // BUSCADOR EN TIEMPO REAL
  // =====================
  useEffect(() => {
    if (busqueda.trim().length < 2) return;

    const buscar = async () => {
      try {
        const data = await buscarNoticiasPorTitular(busqueda);
        setResultados(data);
      } catch {
        setResultados([]);
      }
    };

    buscar();
  }, [busqueda]);

  // =====================
  // HISTÓRICO PAGEABLE
  // =====================
  const cargarHistorico = async () => {
    if (loadingHistorico || !hasMoreHistorico) return;

    try {
      setLoadingHistorico(true);

      const data = await getNoticias(pageHistorico, 10);
      const nuevas = data.content ?? [];

      setHistorico((prev) => [...prev, ...nuevas]);
      setPageHistorico((prev) => prev + 1);

      if (data.last || nuevas.length === 0) {
        setHasMoreHistorico(false);
      }
    } catch {
      setHasMoreHistorico(false);
    } finally {
      setLoadingHistorico(false);
    }
  };

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  // =====================
  // FILTRADO
  // =====================
  const hoyFiltradas =
    categoria === "TODAS"
      ? hoy
      : hoy.filter((n) => n.categoria === categoria);

  const noticiaDestacada =
    categoria === "TODAS"
      ? hoyFiltradas.find((n) => n.destacada) || null
      : null;

  const restoNoticias = noticiaDestacada
    ? hoyFiltradas.filter((n) => n.id !== noticiaDestacada.id)
    : hoyFiltradas;

  return (
    <div className="space-y-12">
      {/* BUSCADOR */}
      <section>
        <input
          type="text"
          value={busqueda}
          onChange={(e) => {
            const value = e.target.value;
            setBusqueda(value);
            if (value.trim().length < 2) setResultados([]);
          }}
          placeholder="Buscar noticias por titular..."
          className="w-full border rounded px-4 py-2"
        />

        {resultados.length > 0 && (
          <ul className="bg-white border rounded shadow mt-2 divide-y">
            {resultados.map((n) => (
              <li key={n.id}>
                <Link
                  to={`/noticias/${n.id}`}
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setBusqueda("")}
                >
                  <span className="font-medium">{n.titular}</span>
                  <span className="block text-sm text-gray-500">
                    {new Date(n.fecha).toLocaleDateString("es-ES")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* CATEGORÍAS */}
      <section>
        <div className="flex flex-wrap gap-2">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoria(cat)}
              className={`px-4 py-1 rounded-full text-sm border ${
                categoria === cat
                  ? "bg-blue-700 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* NOTICIAS DE HOY */}
      <section>
        <h2 className="text-xl font-bold mb-6">Noticias de hoy</h2>

        {noticiaDestacada && (
          <Link
            to={`/noticias/${noticiaDestacada.id}`}
            className="block mb-10 bg-white rounded shadow overflow-hidden"
          >
            <MediaNoticia
              mediaUrl={noticiaDestacada.imagenUrl}
              titulo={noticiaDestacada.titular}
              className="w-full aspect-[16/9] object-cover"
            />

            <div className="p-6">
              <span className="text-xs uppercase text-blue-700 font-semibold">
                Noticia destacada
              </span>
              <h3 className="text-2xl font-bold mt-2">
                {noticiaDestacada.titular}
              </h3>
              <p className="text-gray-700">{noticiaDestacada.resumen}</p>
            </div>
          </Link>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {restoNoticias.map((n) => (
            <Link
              key={n.id}
              to={`/noticias/${n.id}`}
              className="bg-white rounded shadow overflow-hidden"
            >
              <MediaNoticia
                mediaUrl={n.imagenUrl}
                titulo={n.titular}
                className="h-48 w-full object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold">{n.titular}</h3>
                <p className="text-sm text-gray-600">{n.resumen}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* HISTÓRICO */}
      <section>
        <h2 className="text-xl font-bold mb-4">Noticias anteriores</h2>

        <details
          className="bg-white rounded shadow p-4"
          onToggle={(e) => {
            if (e.target.open && historico.length === 0) {
              cargarHistorico();
            }
          }}
        >
          <summary className="cursor-pointer font-medium">
            Ver histórico
          </summary>

          <ul className="mt-4 space-y-2">
            {historico.map((n) => (
              <li key={n.id}>
                <Link to={`/noticias/${n.id}`}>
                  {new Date(n.fecha).toLocaleDateString("es-ES")} – {n.titular}
                </Link>
              </li>
            ))}
          </ul>

          {hasMoreHistorico && (
            <div className="mt-4">
              <button
                onClick={cargarHistorico}
                disabled={loadingHistorico}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                {loadingHistorico ? "Cargando..." : "Cargar más"}
              </button>
            </div>
          )}
        </details>
      </section>

      {/* PUBLICIDAD */}
      <CarruselPublicidad />
    </div>
  );
}

export default Noticias;
