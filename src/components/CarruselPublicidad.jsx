import { useEffect, useState } from "react";
import { anuncios } from "../data/anuncios";

export default function CarruselPublicidad() {
  const [indiceActual, setIndiceActual] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndiceActual((prev) => (prev + 1) % anuncios.length);
    }, 8000); // 8 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-white rounded shadow px-4 py-3 text-center">
      <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
        Publicidad
      </p>

      <a
        href={anuncios[indiceActual].link}
        target="_blank"
        rel="noopener noreferrer"
        className="flex justify-center"
      >
        
       <div className="h-24 w-full overflow-hidden rounded">
  <img
    src={anuncios[indiceActual].img} //Tamaño aconsejado 1200x300-> .jpg
    alt="Publicidad local"
    className="w-full h-full object-contain"
  />
</div>

      </a>
    </section>
  );
}
