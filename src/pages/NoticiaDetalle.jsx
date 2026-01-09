import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getNoticiaById } from "../services/api";
import MediaNoticia from "../components/MediaNoticia";

const limpiarTitular = (titular = "") =>
  titular.replace("[DESTACADA]", "").trim();

function NoticiaDetalle() {
  const { id } = useParams();
  const [noticia, setNoticia] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarNoticia = async () => {
      try {
        const data = await getNoticiaById(id);
        setNoticia(data);
      } catch {
        setError("No se pudo cargar la noticia");
      }
    };

    cargarNoticia();
  }, [id]);

  // SEO dinámico
  useEffect(() => {
    if (!noticia) return;

    document.title = `${limpiarTitular(noticia.titular)} | Cullera Digital`;

    const metaDescription = document.querySelector(
      "meta[name='description']"
    );

    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        noticia.resumen || limpiarTitular(noticia.titular)
      );
    }
  }, [noticia]);

  if (error) return <p className="text-red-600">{error}</p>;
  if (!noticia) return <p>Cargando noticia...</p>;

  return (
    <article className="max-w-3xl mx-auto bg-white rounded shadow overflow-hidden">
      <MediaNoticia
        mediaUrl={noticia.imagenUrl}
        titulo={limpiarTitular(noticia.titular)}
        className="aspect-video max-h-[500px]"
      />

      <div className="p-6">
        <p className="text-sm text-blue-700 font-semibold uppercase mb-2">
          {noticia.categoria}
        </p>

        <h1 className="text-3xl font-bold mb-4">
          {limpiarTitular(noticia.titular)}
        </h1>

        <p className="text-gray-500 text-sm mb-6">
          {new Date(noticia.fecha).toLocaleDateString("es-ES")}
        </p>

        <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-line">
          {noticia.contenido}
        </p>

        <div className="mt-10">
          <Link to="/" className="text-blue-700 hover:underline text-sm">
            ← Volver a noticias
          </Link>
        </div>
      </div>
    </article>
  );
}

export default NoticiaDetalle;
