import { useState } from "react";
import {
  buscarNoticiasPorFecha,
  buscarNoticiasEntreFechas,
} from "../services/api";
import { Link } from "react-router-dom";

function HistoricoNoticias() {
  const [fecha, setFecha] = useState("");
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState(null);

  const buscarPorFecha = async () => {
    try {
      setError(null);
      const data = await buscarNoticiasPorFecha(fecha);
      setResultados(data);
    } catch {
      setError("No se encontraron noticias para esa fecha");
      setResultados([]);
    }
  };

  const buscarEntreFechas = async () => {
    try {
      setError(null);
      const data = await buscarNoticiasEntreFechas(inicio, fin);
      setResultados(data);
    } catch {
      setError("No se encontraron noticias en ese rango");
      setResultados([]);
    }
  };

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold">Histórico de noticias</h1>

      {/* BUSCAR POR FECHA */}
      <section className="bg-white rounded shadow p-6">
        <h2 className="font-semibold mb-4">Buscar por fecha</h2>

        <div className="flex gap-4 flex-wrap">
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="border rounded px-3 py-2"
          />

          <button
            onClick={buscarPorFecha}
            disabled={!fecha}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 disabled:opacity-50"
          >
            Buscar
          </button>
        </div>
      </section>

      {/* BUSCAR ENTRE FECHAS */}
      <section className="bg-white rounded shadow p-6">
        <h2 className="font-semibold mb-4">Buscar entre fechas</h2>

        <div className="flex gap-4 flex-wrap">
          <input
            type="date"
            value={inicio}
            onChange={(e) => setInicio(e.target.value)}
            className="border rounded px-3 py-2"
          />

          <input
            type="date"
            value={fin}
            onChange={(e) => setFin(e.target.value)}
            className="border rounded px-3 py-2"
          />

          <button
            onClick={buscarEntreFechas}
            disabled={!inicio || !fin}
            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 disabled:opacity-50"
          >
            Buscar
          </button>
        </div>
      </section>

      {/* RESULTADOS */}
      <section>
        <h2 className="text-xl font-bold mb-4">Resultados</h2>

        {error && <p className="text-red-600">{error}</p>}

        {resultados.length === 0 && !error && (
          <p className="text-gray-500">No hay resultados</p>
        )}

        <ul className="space-y-3">
          {resultados.map((n) => (
            <li
              key={n.id}
              className="bg-white rounded shadow p-4 hover:shadow-md transition"
            >
              <Link to={`/noticias/${n.id}`}>
                <h3 className="font-semibold">{n.titular}</h3>
                <p className="text-sm text-gray-600">
                  {new Date(n.fecha).toLocaleDateString("es-ES")} ·{" "}
                  {n.categoria}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  {n.resumen}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default HistoricoNoticias;
