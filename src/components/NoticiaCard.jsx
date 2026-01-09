import { Link } from "react-router-dom";

function NoticiaCard({ noticia }) {
  const limpiarTitular = (titular = "") =>
    titular.replace("[DESTACADA]", "").trim();

  return (
    <Link to={`/noticias/${noticia.id}`}>
      <article className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden cursor-pointer">
        {noticia.imagenUrl && (
          <img
            src={noticia.imagenUrl}
            alt={limpiarTitular(noticia.titular)}
            className="w-full h-48 object-cover"
          />
        )}

        <div className="p-4">
          <h2 className="text-lg font-bold mb-2">
            {limpiarTitular(noticia.titular)}
          </h2>

          <p className="text-gray-600 text-sm mb-4">
            {noticia.resumen}
          </p>

          <span className="text-xs text-gray-400">
            {new Date(noticia.fecha).toLocaleDateString("es-ES")}
          </span>
        </div>
      </article>
    </Link>
  );
}

export default NoticiaCard;
