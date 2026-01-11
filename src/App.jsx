import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect } from "react";
import Noticias from "./pages/Noticias";
import NoticiaDetalle from "./pages/NoticiaDetalle";
import HistoricoNoticias from "./pages/HistoricoNoticias";
import QuienesSomos from "./pages/QuienesSomos";
import Admin from "./admin/Admin";
import NotFound from "./components/NotFound";

function App() {
  useEffect(() => {
  document.title = "Cullera Digital – Noticias locales de Cullera";

  const metaDescription = document.querySelector("meta[name='description']");
  if (metaDescription) {
    metaDescription.setAttribute(
      "content",
      "Cullera Digital: noticias locales, avisos, sucesos, deportes, cultura y actualidad de Cullera."
    );
  }
}, []);

  return (
    <BrowserRouter>

      <div className="min-h-screen bg-gray-100">
        <header className="bg-blue-700 text-white shadow">
          <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Cullera Digital</h1>
              <p className="text-sm text-blue-200">
                Noticias locales de Cullera
              </p>
            </div>

            <nav className="flex gap-6 text-sm">
              <Link to="/" className="hover:underline">
                Inicio
              </Link>

              <Link to="/historico" className="hover:underline">
                Histórico
              </Link>

              <Link to="/quienes-somos" className="hover:underline">
                Quiénes somos
              </Link>
            </nav>
          </div>
        </header>

        <main className="max-w-6xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Noticias />} />
            <Route path="/noticias/:id" element={<NoticiaDetalle />} />
            <Route path="/historico" element={<HistoricoNoticias />} />
            <Route path="/quienes-somos" element={<QuienesSomos />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<NotFound />} />

          </Routes>
        </main>

        <footer id="quienes-somos" className="bg-gray-900 text-gray-300 mt-16">
          <div className="max-w-6xl mx-auto px-4 py-10 grid gap-8 sm:grid-cols-3">
            <div>
              <h3 className="font-bold text-white mb-2">Cullera Digital</h3>
              <p className="text-sm">
                Medio digital independiente con información local, avisos y
                actualidad de Cullera.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">Contacto</h4>
              <p className="text-sm">📧 contacto@culleradigital.es</p>
              <p className="text-sm">📞 600 000 000</p>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-2">Redes sociales</h4>
              <p className="text-sm">Instagram</p>
              <p className="text-sm">Facebook</p>
              <p className="text-sm">X (Twitter)</p>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 pb-4">
            © {new Date().getFullYear()} Cullera Digital
          </div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
