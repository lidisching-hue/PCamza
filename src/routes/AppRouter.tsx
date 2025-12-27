import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'

/* ========================================================================
   1. IMPORTACIÓN DE PÁGINAS PÚBLICAS (TIENDA)
   Estas son las vistas que ven tus clientes.
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
   Estas son las vistas protegidas para gestionar el negocio.
   ======================================================================== */
import AdminLayout from '../admin/layouts/AdminLayout' // El esqueleto (Sidebar + Topbar)
import LoginAdmin from '../admin/pages/LoginAdmin'     // La puerta de entrada
import Dashboard from '../admin/pages/Dashboard'       // Vista principal de estadísticas
import AdminProductos from '../admin/pages/AdminProductos' // 👈 GESTIÓN REAL DE PRODUCTOS
import AdminOfertas from '../admin/pages/AdminOfertas'

/* ========================================================================
   3. COMPONENTES PLACEHOLDER (TEMPORALES)
   Usamos esto para las páginas que aún no hemos programado (Banners y Pedidos).
   Así el router no falla mientras terminas esas secciones.
   ======================================================================== */
const AdminBanners = () => <div className="p-10">🚧 Gestión de Banners (En construcción)</div>
const AdminPedidos = () => <div className="p-10">🚧 Gestión de Pedidos (En construcción)</div>

function AppContent() {
  const location = useLocation();

  // --------------------------------------------------------------------------
  // LÓGICA 1: DETECCIÓN DE ENTORNO
  // Verificamos si la URL actual empieza con "/admin".
  // Si es así, desactivamos los efectos visuales de la tienda (modales, carritos flotantes).
  // --------------------------------------------------------------------------
  const isAdminRoute = location.pathname.startsWith('/admin');

  // --------------------------------------------------------------------------
  // LÓGICA 2: FONDO DE LOS MODALES (BACKGROUND LOCATION)
  // Este es el truco para que el Carrito y Checkout se abran "encima" del Home.
  // 
  // 1. Si venimos navegando desde un link con `state.background` (ej. desde el Header),
  //    usamos esa ubicación como fondo.
  // 2. Si recargamos la página directamente en /carrito, no hay historial, 
  //    así que usamos la ubicación actual (location).
  // 3. Forzamos que si es ruta admin, ignore esta lógica.
  // --------------------------------------------------------------------------
  const state = location.state as { background?: Location };
  const background = (state?.background && !isAdminRoute) ? state.background : location;

  return (
    <div className="relative min-h-screen bg-transparent">
      
      {/* ======================================================================
         CAPA 1: RUTAS PRINCIPALES (EL FONDO)
         Aquí se decide qué página se renderiza "al fondo" o como página principal.
         ======================================================================
      */}
      <main className="relative z-0">
        {/* Usamos 'background' en lugar de 'location' para engañar al Router 
            y mantener la página anterior visible cuando abrimos un modal */}
        <Routes location={isAdminRoute ? location : background}>
          
          {/* --- A. RUTAS PÚBLICAS (TIENDA) --- */}
          <Route path="/" element={<Home />} />
          <Route path="/QuienesSomos" element={<QuienesSomos />} />
          <Route path="/catalogos" element={<Catalogos />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/tiendas" element={<Tiendas />} />
          <Route path="/contacto" element={<Contacto />} />
          
          {/* RUTAS DE RESPALDO (FALLBACKS):
             Si el usuario entra directo a link.com/carrito y recarga la página,
             el "overlay" necesita un fondo. Aquí le decimos que pinte el Home
             detrás del carrito para que no se vea blanco. */}
          <Route path="/carrito" element={<Home />} />
          <Route path="/checkout" element={<Home />} />


          {/* --- B. RUTAS ADMINISTRATIVAS (PANEL DE CONTROL) --- */}
          
          {/* 1. Login: Es una página suelta, ocupa toda la pantalla, no lleva Sidebar */}
          <Route path="/admin/login" element={<LoginAdmin />} />

          {/* 2. Rutas Protegidas: Todas viven DENTRO de AdminLayout.
                 AdminLayout tiene el <Outlet /> donde se pintan estos hijos. */}
          <Route path="/admin" element={<AdminLayout />}>
              {/* index: Lo que se ve al entrar a /admin */}
              <Route index element={<Dashboard />} /> 
              
              {/* Rutas hijas específicas */}
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="productos" element={<AdminProductos />} /> {/* 👈 Aquí carga tu tabla */}
              {/* 2. AGREGA ESTA LÍNEA AQUÍ 👇 */}
        <Route path="ofertas" element={<AdminOfertas />} />
              <Route path="banners" element={<AdminBanners />} />     {/* Placeholder */}
              <Route path="pedidos" element={<AdminPedidos />} />     {/* Placeholder */}
          </Route>

          {/* --- C. RUTA 404 (NO ENCONTRADO) --- */}
          <Route path="*" element={<div className="p-20 text-center font-bold text-xl">Página no encontrada 😕</div>} />

        </Routes>
      </main>

      {/* ======================================================================
         CAPA 2: OVERLAYS (VENTANAS MODALES) - SOLO TIENDA
         Estas ventanas flotan encima de la aplicación.
         
         Condición: (!isAdminRoute) -> Si estamos en el admin, NO mostrar esto nunca.
         ======================================================================
      */}
      
      {/* MODAL CARRITO */}
      {!isAdminRoute && location.pathname === '/carrito' && (
        <div className="fixed inset-0 z-[9999] animate-fade-in">
           {/* Fondo oscuro semitransparente */}
           <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
           {/* El componente Carrito flotando */}
           <Carrito />
        </div>
      )}
      
      {/* MODAL CHECKOUT */}
      {!isAdminRoute && location.pathname === '/checkout' && (
        <div className="fixed inset-0 z-[9999] animate-fade-in">
           <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
           <Checkout />
        </div>
      )}
    </div>
  );
}

// Componente Principal que envuelve todo con el Router del navegador
function AppRouter() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default AppRouter