import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ADMIN_EMAILS } from '../config'; // 👈 Importamos la lista blanca

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

  // PROTECCIÓN DE RUTA BLINDADA
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      // 1. Si no hay sesión, fuera.
      if (!session) {
        navigate('/admin/login');
        return;
      }

      // 2. OBTENER EL CORREO DEL USUARIO
      const userEmail = session.user.email;

      // 3. VERIFICAR SI ES ADMIN (La parte importante)
      // Si el correo NO está en la lista de admins...
      if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
        console.warn(`Acceso denegado para: ${userEmail}`);
        
        // Opcional: Cerrar la sesión para que no sigan logueados como cliente
        // await supabase.auth.signOut(); 
        
        // Redirigir al home o a una página de error 403
        navigate('/'); 
        return;
      }

      // Si pasa el filtro, dejamos de cargar y mostramos el panel
      setLoading(false);
    };
    
    // Escuchar cambios en la sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/admin/login');
      } else if (session.user.email && !ADMIN_EMAILS.includes(session.user.email)) {
        // Si alguien se loguea y no es admin, lo sacamos
        navigate('/');
      }
    });

    checkUser();

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gray-100 flex-col gap-4">
       <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
       <p className="text-gray-500 font-semibold">Verificando permisos de administrador...</p>
    </div>
  );

  // ... (El resto del return del componente se mantiene IGUAL que te pasé antes) ...
  // Función auxiliar para resaltar link activo...
  const isActive = (path: string) => location.pathname.includes(path) ? 'bg-red-600 text-white shadow-md' : 'text-slate-300 hover:bg-slate-800 hover:text-white';

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
       {/* ... Pega aquí el resto del return del Sidebar y Main que te di en la respuesta anterior ... */}
      <aside className={`bg-slate-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col shadow-2xl z-10`}>
        <div className="p-4 h-20 flex items-center justify-between border-b border-slate-700">
          {isSidebarOpen ? (
            <span className="font-bold text-xl tracking-wider text-red-500">PCAMZA<span className="text-white">ADMIN</span></span>
          ) : (
            <span className="font-bold text-xl text-red-500 mx-auto">P</span>
          )}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded text-gray-400 hover:text-white transition">
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link to="/admin/dashboard" className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive('/admin/dashboard')}`}>
            <span>📊</span> {isSidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link to="/admin/productos" className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive('/admin/productos')}`}>
            <span>📦</span> {isSidebarOpen && <span>Productos</span>}
          </Link>
          {/* 3. AGREGA ESTE NUEVO BOTÓN 👇 */}
  <Link 
    to="/admin/ofertas" 
    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg font-bold"
  >
    <span>🔥</span> Packs & Ofertas
  </Link>
          <Link to="/admin/banners" className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive('/admin/banners')}`}>
            <span>🖼️</span> {isSidebarOpen && <span>Banners Home</span>}
          </Link>
          <Link to="/admin/pedidos" className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive('/admin/pedidos')}`}>
            <span>📝</span> {isSidebarOpen && <span>Pedidos</span>}
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-700 bg-slate-900">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-600 text-white p-3 rounded-xl transition-all group">
            <span>🚪</span>
            {isSidebarOpen && <span className="font-semibold">Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Contenido Principal */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar simple */}
        <header className="h-16 bg-white shadow-sm flex items-center px-8 justify-between z-0">
            <h2 className="font-bold text-gray-700">Panel de Administración</h2>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">A</div>
                <span className="text-sm text-gray-500">Administrador</span>
            </div>
        </header>

        {/* Área scrolleable */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
            <Outlet />
        </div>
      </main>
    </div>
  );
}