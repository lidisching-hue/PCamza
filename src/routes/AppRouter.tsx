import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

/* --- TUS PÁGINAS --- */
import Home from '../pages/Home'
import Carrito from '../pages/Carrito'
import Checkout from '../pages/Checkout'
import QuienesSomos from '../pages/QuienesSomos'
import Catalogos from '../pages/Catalogos'
import Productos from '../pages/Productos'
import Tiendas from '../pages/Tiendas'
import Contacto from '../pages/Contacto'

function AppContent() {
  const location = useLocation();

  // LÓGICA DE FONDO:
  // Si venimos de un enlace con 'state.background' (del Header), usamos esa ubicación para el fondo.
  // Si no (ej. recargar página en /carrito), usamos la location actual.
  const state = location.state as { background?: Location };
  const background = state?.background || location;

  return (
    <div className="relative min-h-screen bg-transparent">
      
      {/* CAPA DE FONDO:
         Usamos 'location={background}' para engañar al Switch de rutas.
         Aunque la URL real sea '/carrito', las Routes pensarán que siguen en '/QuienesSomos'
         si venimos de ahí.
      */}
      <main className="relative z-0">
        <Routes location={background}>
          <Route path="/" element={<Home />} />
          <Route path="/QuienesSomos" element={<QuienesSomos />} />
          <Route path="/catalogos" element={<Catalogos />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/tiendas" element={<Tiendas />} />
          <Route path="/contacto" element={<Contacto />} />
          
          {/* RUTAS DE RESPALDO (FALLBACK):
             Si el usuario entra directo a link.com/carrito (sin clicar en el header),
             'background' será null. Necesitamos definir qué mostrar de fondo.
             Aquí ponemos Home para que no salga pantalla blanca.
          */}
          <Route path="/carrito" element={<Home />} />
          <Route path="/checkout" element={<Home />} />
          
          <Route path="*" element={<div className="p-20 text-center">Página no encontrada</div>} />
        </Routes>
      </main>

      {/* CAPA SUPERIOR (OVERLAYS):
         Estas se renderizan SIEMPRE que la URL coincida, independientemente
         de lo que haya en el fondo.
      */}
      {location.pathname === '/carrito' && (
        <div className="fixed inset-0 z-[9999] animate-fade-in">
           {/* Un fondo semitransparente oscuro opcional para resaltar el overlay */}
           <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
           <Carrito />
        </div>
      )}
      
      {location.pathname === '/checkout' && (
        <div className="fixed inset-0 z-[9999] animate-fade-in">
           <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
           <Checkout />
        </div>
      )}
    </div>
  );
}

function AppRouter() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default AppRouter