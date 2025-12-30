import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { ADMIN_EMAILS } from '../config'; 

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // --- ESTADOS ---
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isContentMenuOpen, setContentMenuOpen] = useState(false); // Empieza cerrado para mantener limpieza
  const [loading, setLoading] = useState(true);

  // --- 1. PROTECCIÓN DE RUTA (Auth) ---
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        navigate('/admin/login');
        return;
      }

      const userEmail = session.user.email;

      // Verificamos si es Admin
      if (!userEmail || !ADMIN_EMAILS.includes(userEmail)) {
        console.warn(`Acceso denegado para: ${userEmail}`);
        navigate('/'); 
        return;
      }

      setLoading(false);
    };
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/admin/login');
      } else if (session.user.email && !ADMIN_EMAILS.includes(session.user.email)) {
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
       <p className="text-gray-500 font-semibold">Verificando permisos...</p>
    </div>
  );

  // --- HELPERS VISUALES ---
  
  const linkClasses = (path: string) => 
    `flex items-center gap-3 p-3 rounded-xl transition-all ${
      location.pathname === path 
      ? 'bg-red-600 text-white shadow-md font-bold' 
      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
    }`;

  const subLinkClasses = (path: string) => 
    `flex items-center gap-2 p-2 rounded-lg text-sm transition-all ${
      location.pathname === path 
      ? 'text-white bg-slate-700 font-bold' 
      : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`;

  const toggleContentMenu = () => {
    if (!isSidebarOpen) setSidebarOpen(true);
    setContentMenuOpen(!isContentMenuOpen);
  }

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className={`bg-slate-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-64' : 'w-20'} flex flex-col shadow-2xl z-10`}>
        
        {/* HEADER: LOGO */}
        <div className="p-4 h-20 flex items-center justify-between border-b border-slate-700">
          {isSidebarOpen ? (
            <span className="font-bold text-xl tracking-wider text-red-500">PECAMZA<span className="text-white">ADMIN</span></span>
          ) : (
            <span className="font-bold text-xl text-red-500 mx-auto">P</span>
          )}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded text-gray-400 hover:text-white transition">
            {isSidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        
        {/* BODY: NAVEGACIÓN */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          
          {/* GRUPO 1: GESTIÓN OPERATIVA (Lo más usado) */}
          <div className="mb-2">
              {isSidebarOpen && <p className="px-3 text-xs font-semibold text-slate-500 uppercase mb-2">Operativo</p>}
              
              <Link to="/admin/dashboard" className={linkClasses('/admin/dashboard')}>
                <span>📊</span> {isSidebarOpen && <span>Dashboard</span>}
              </Link>

              <Link to="/admin/pedidos" className={linkClasses('/admin/pedidos')}>
                <span>📝</span> {isSidebarOpen && <span>Pedidos</span>}
              </Link>

              <Link to="/admin/productos" className={linkClasses('/admin/productos')}>
                <span>📦</span> {isSidebarOpen && <span>Productos</span>}
              </Link>

              <Link to="/admin/ofertas" className={linkClasses('/admin/ofertas')}>
                <span>🔥</span> {isSidebarOpen && <span>Packs & Ofertas</span>}
              </Link>
          </div>

          <div className="border-t border-slate-700 my-2 opacity-50"></div>

          {/* GRUPO 2: GESTIÓN WEB (CMS) */}
          <div className="pt-2">
            {isSidebarOpen && <p className="px-3 text-xs font-semibold text-slate-500 uppercase mb-2">Página Web</p>}
            
            <button 
                onClick={toggleContentMenu}
                className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-slate-300 hover:bg-slate-800 hover:text-white`}
            >
                <div className="flex items-center gap-3">
                    <span>🎨</span> 
                    {isSidebarOpen && <span>Editor Web</span>}
                </div>
                {isSidebarOpen && <span className="text-xs opacity-70">{isContentMenuOpen ? '▼' : '▶'}</span>}
            </button>

            {/* Sub-Menú Desplegable */}
            {isContentMenuOpen && isSidebarOpen && (
                <div className="ml-8 mt-1 space-y-1 border-l-2 border-slate-700 pl-2 flex flex-col">
                    <Link to="/admin/banners" className={subLinkClasses('/admin/banners')}>
                        🖼️ Banners Home
                    </Link>
                    <Link to="/admin/nosotros" className={subLinkClasses('/admin/nosotros')}>
                        👥 Quiénes Somos
                    </Link>
                    
                    {/* Link Placeholder (Deshabilitado visualmente si no hay ruta) */}
                    <Link to="#" className={`${subLinkClasses('#')} opacity-50 cursor-not-allowed`}>
                        🚧 Otros (Pronto)
                    </Link>
                </div>
            )}
          </div>

        </nav>

        {/* FOOTER: LOGOUT */}
        <div className="p-4 border-t border-slate-700 bg-slate-900">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-600 text-white p-3 rounded-xl transition-all group">
            <span>🚪</span>
            {isSidebarOpen && <span className="font-semibold">Cerrar Sesión</span>}
          </button>
        </div>

      </aside>

      {/* --- CONTENIDO PRINCIPAL --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white shadow-sm flex items-center px-8 justify-between z-0">
            <h2 className="font-bold text-gray-700">Panel de Administración</h2>
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 font-bold">A</div>
                <span className="text-sm text-gray-500">Administrador</span>
            </div>
        </header>

        {/* Area de Trabajo (Outlet) */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
            <Outlet />
        </div>
      </main>

    </div>
  );
}