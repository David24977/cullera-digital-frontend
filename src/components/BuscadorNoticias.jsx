import { useEffect, useState } from "react";
import { buscarNoticiasPorTitular } from "../services/api";
import { Link } from "react-router-dom";

function BuscadorNoticias() {
  const [texto, setTexto] = useState("");
  const [resultados, setResultados] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (texto.trim().length < 2) {
      setResultados([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setCargando(true);
        const data = await buscarNoticiasPorTitular(texto);
        setResultados(data);
      } catch {
        setResultados([]);
      } finally {
        setCargando(false);
      }
    }, 300); // debounce 300ms

    return () => clearTimeout(timeout);
  }, [texto]);

  return (
    <section className="bg-white rounded shadow p-6 relative">
      <h2 className="text-lg font-bold mb-4">Buscar noticias</h2>

      <input
        type="text"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe para buscar por titular..."
        className="w-full border rounded px-3 py-2"
      />

      {/* CARGANDO */}
      {cargando && (
        <p className="text-sm text-gray-500 mt-2">Buscando...</p>
      )}

      {/* RESULTADOS */}
      {resultados.length > 0 && (
        <ul className="absolute z-10 left-6 right-6 bg-white border rounded shadow mt-2 max-h-60 overflow-y-auto">
          {resultados.map((n) => (
            <li key={n.id}>
              <Link
                to={`/noticias/${n.id}`}
                onClick={() => {
                  setTexto("");
                  setResultados([]);
                }}
                className="block px-4 py-2 hover:bg-gray-100"
              >
                <p className="font-medium">{n.titular}</p>
                <p className="text-xs text-gray-500">
                  {new Date(n.fecha).toLocaleDateString("es-ES")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {/* SIN RESULTADOS */}
      {texto.length >= 2 && !cargando && resultados.length === 0 && (
        <p className="text-sm text-gray-500 mt-2">
          No se encontraron resultados
        </p>
      )}
    </section>
  );
}

export default BuscadorNoticias;
