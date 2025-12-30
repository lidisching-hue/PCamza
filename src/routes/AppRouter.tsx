import { BrowserRouter, Routes, Route, useLocation, type Location } from 'react-router-dom'

/* ========================================================================
   1. IMPORTACIÓN DE PÁGINAS PÚBLICAS (TIENDA)
   ======================================================================== */
import Home from '../pages/Home'
import Carrito from '../pages/Carrito'
import Checkout from '../pages/Checkout'
import QuienesSomos from '../pages/QuienesSomos'
import Catalogos from '../pages/Catalogos'
import Productos from '../pages/Productos'
import Tiendas from '../pages/Tiendas'
import Contacto from '../pages/Contacto'

/* ========================================================================
   2. IMPORTACIÓN DE PÁGINAS ADMINISTRATIVAS (CMS)
   ======================================================================== */
import AdminLayout from '../admin/layouts/AdminLayout'
import LoginAdmin from '../admin/pages/LoginAdmin'
import Dashboard from '../admin/pages/Dashboard'
import AdminProductos from '../admin/pages/AdminProductos'
import AdminOfertas from '../admin/pages/AdminOfertas'
import AdminBanners from '../admin/pages/AdminBanners'
// 👇 IMPORTAMOS LA NUEVA PÁGINA (Ajusta la ruta si la guardaste en otra carpeta)
import AdminNosotros from '../admin/pages/AdminNosotros' 

/* ========================================================================
   3. COMPONENTES PLACEHOLDER (TEMPORALES)
   ======================================================================== */
const AdminPedidos = () => <div className="p-10">🚧 Gestión de Pedidos (En construcción)</div>

function AppContent() {
  const location = useLocation();

  // LÓGICA 1: Si es ruta de admin, desactivamos modales
  const isAdminRoute = location.pathname.startsWith('/admin');

  // LÓGICA 2: Fondo para Modales (Carrito/Checkout)
  const state = location.state as { background?: Location };
  const background = (state?.background && !isAdminRoute) ? state.background : location;

  return (
    <div className="relative min-h-screen bg-transparent">
      
      {/* CAPA 1: RUTAS PRINCIPALES */}
      <main className="relative z-0">
        <Routes location={isAdminRoute ? location : background}>
          
          {/* --- A. RUTAS PÚBLICAS --- */}
          <Route path="/" element={<Home />} />
          <Route path="/QuienesSomos" element={<QuienesSomos />} />
          <Route path="/catalogos" element={<Catalogos />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/tiendas" element={<Tiendas />} />
          <Route path="/contacto" element={<Contacto />} />
          
          {/* Fallbacks para modales (Pintan el Home detrás) */}
          <Route path="/carrito" element={<Home />} />
          <Route path="/checkout" element={<Home />} />

          {/* --- B. RUTAS ADMINISTRATIVAS --- */}
          
          {/* Login independiente */}
          <Route path="/admin/login" element={<LoginAdmin />} />

          {/* Panel de Control (Dentro del Layout) */}
          <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} /> 
              <Route path="dashboard" element={<Dashboard />} />
              
              {/* Módulos de gestión */}
              <Route path="productos" element={<AdminProductos />} />
              <Route path="ofertas" element={<AdminOfertas />} />
              <Route path="banners" element={<AdminBanners />} />
              
              {/* 👇 NUEVA RUTA AGREGADA */}
              <Route path="nosotros" element={<AdminNosotros />} />
              
              <Route path="pedidos" element={<AdminPedidos />} />
          </Route>

          {/* --- C. RUTA 404 --- */}
          <Route path="*" element={<div className="p-20 text-center font-bold text-xl">Página no encontrada 😕</div>} />

        </Routes>
      </main>

      {/* CAPA 2: OVERLAYS (MODALES) */}
      {!isAdminRoute && location.pathname === '/carrito' && (
        <div className="fixed inset-0 z-[9999] animate-fade-in">
           <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
           <Carrito />
        </div>
      )}
      
      {!isAdminRoute && location.pathname === '/checkout' && (
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