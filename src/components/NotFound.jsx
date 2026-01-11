export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-4xl font-bold mb-4">Página no encontrada</h1>
      <p className="mb-6 text-gray-600">
        La página que buscas no existe
      </p>
      <a
        href="/"
        className="bg-black text-white px-6 py-3 rounded"
      >
        Volver a inicio
      </a>
    </div>
  );
}
