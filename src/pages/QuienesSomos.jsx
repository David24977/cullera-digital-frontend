function QuienesSomos() {
  return (
    <div className="bg-white rounded shadow p-8 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Quiénes somos</h2>

      <p className="text-gray-700 mb-4">
        <strong>Cullera Digital</strong> es un medio digital independiente
        centrado en la actualidad local de Cullera.
      </p>

      <p className="text-gray-700 mb-4">
        Nuestro objetivo es informar de manera clara, cercana y veraz sobre
        noticias, avisos, eventos y todo aquello que afecta a la vida diaria
        del municipio.
      </p>

      <p className="text-gray-700 mb-4">
        Este espacio se irá ampliando con más información sobre el proyecto,
        el equipo y la línea editorial.
      </p>

      <p className="text-sm text-gray-500 mt-8">
        Última actualización: {new Date().toLocaleDateString("es-ES")}
      </p>
    </div>
  );
}

export default QuienesSomos;
