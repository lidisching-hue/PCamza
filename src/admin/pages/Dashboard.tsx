import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  // --- ESTADOS DE ESTADÍSTICAS ---
  const [stats, setStats] = useState({
    productos: 0,
    productosEnOferta: 0,
    combosActivos: 0,
    pedidosTotales: 0,
    pedidosPendientes: 0
  })
  const [loading, setLoading] = useState(true)

  // --- NUEVO ESTADO PARA EL MENÚ DESPLEGABLE ---
  const [showContentMenu, setShowContentMenu] = useState(false)

  useEffect(() => {
    async function loadStats() {
        try {
            // 1. Contar Productos Totales
            const { count: prodCount } = await supabase.from('productos').select('*', { count: 'exact', head: true })
            // 2. Contar Productos en Oferta
            const { count: ofertaIndivCount } = await supabase.from('productos').select('*', { count: 'exact', head: true }).eq('ofertaactiva', true)
            // 3. Contar Combos Activos
            const { count: combosCount } = await supabase.from('ofertas').select('*', { count: 'exact', head: true }).eq('activo', true)
            // 4. Pedidos Totales
            const { count: pedidosCount } = await supabase.from('pedidos').select('*', { count: 'exact', head: true })
            // 5. Pedidos Pendientes
            const { count: pendientesCount } = await supabase.from('pedidos').select('*', { count: 'exact', head: true }).eq('estado', 'pendiente')

            setStats({
                productos: prodCount || 0,
                productosEnOferta: ofertaIndivCount || 0,
                combosActivos: combosCount || 0,
                pedidosTotales: pedidosCount || 0,
                pedidosPendientes: pendientesCount || 0
            })
        } catch (error) {
            console.error('Error cargando estadísticas:', error)
        } finally {
            setLoading(false)
        }
    }
    loadStats()
  }, [])

  if (loading) return <div className="p-10 text-center text-gray-500 animate-pulse">Cargando métricas...</div>

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Resumen del Sistema</h1>
      <p className="text-gray-500 mb-8">Bienvenido de nuevo al panel de control.</p>
      
      {/* --- SECCIÓN 1: ESTADO DE PEDIDOS (PRIORIDAD ALTA) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Card: Pedidos Pendientes */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden">
            {stats.pedidosPendientes > 0 && (
                <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping m-2"></div>
            )}
            <div>
                <p className="text-red-400 text-xs font-bold uppercase tracking-wider">Pedidos Pendientes</p>
                <h3 className="text-4xl font-black text-red-600 mt-2">{stats.pedidosPendientes}</h3>
            </div>
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-600 text-3xl">🔔</div>
        </div>

        {/* Card: Ventas Totales */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Historial Pedidos</p>
                <h3 className="text-4xl font-black text-gray-800 mt-2">{stats.pedidosTotales}</h3>
            </div>
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-600 text-3xl">📈</div>
        </div>
      </div>

      {/* --- SECCIÓN 2: GESTIÓN DE TIENDA (PRODUCTOS) --- */}
      <h2 className="text-lg font-bold text-gray-700 mb-4">Gestión de Tienda</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* BOTÓN PRODUCTOS */}
          <Link to="/admin/productos" className="group block bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 rounded-xl text-blue-600 text-2xl">📦</div>
                  <span className="text-2xl font-bold text-gray-800">{stats.productos}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Productos</h3>
              <p className="text-gray-400 text-sm">Gestionar inventario y precios</p>
          </Link>

          {/* BOTÓN OFERTAS / PACKS */}
          <Link to="/admin/ofertas" className="group block bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-purple-50 rounded-xl text-purple-600 text-2xl">🎁</div>
                  <span className="text-2xl font-bold text-gray-800">{stats.combosActivos}</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800">Packs & Combos</h3>
              <p className="text-gray-400 text-sm">Crear paquetes promocionales</p>
          </Link>

          {/* ESTADÍSTICA OFERTAS */}
          <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex flex-col justify-center">
               <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">🏷️</div>
                   <span className="text-gray-500 text-sm font-semibold uppercase">En Oferta</span>
               </div>
               <h3 className="text-3xl font-black text-gray-800">{stats.productosEnOferta} <span className="text-sm font-normal text-gray-400">productos</span></h3>
          </div>
      </div>

      {/* --- SECCIÓN 3: ADMINISTRACIÓN DE CONTENIDO (DESPLEGABLE) --- */}
      <h2 className="text-lg font-bold text-gray-700 mb-4">Editor de Página Web</h2>
      
      <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-xl mb-10">
        {/* Cabecera del Acordeón (Clickable) */}
        <button 
            onClick={() => setShowContentMenu(!showContentMenu)}
            className="w-full flex items-center justify-between p-6 text-white hover:bg-slate-800 transition-colors"
        >
            <div className="flex items-center gap-4">
                <div className="bg-white/10 p-3 rounded-xl text-2xl">🎨</div>
                <div className="text-left">
                    <h3 className="text-xl font-bold">Administración de Contenido</h3>
                    <p className="text-slate-400 text-sm">Editar Banners, Home, Quiénes Somos...</p>
                </div>
            </div>
            {/* Flecha animada */}
            <div className={`transform transition-transform duration-300 ${showContentMenu ? 'rotate-180' : ''}`}>
                🔽
            </div>
        </button>

        {/* Contenido del Desplegable */}
        <div className={`bg-slate-800 transition-all duration-300 ease-in-out overflow-hidden ${showContentMenu ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-slate-700">
                
                {/* 1. HOME (Ya lo tienes) */}
                <Link to="/admin/banners" className="flex items-center gap-4 p-4 rounded-xl bg-slate-700/50 hover:bg-blue-600 text-slate-200 hover:text-white transition-all group">
                    <div className="h-10 w-10 rounded-full bg-slate-600 group-hover:bg-white/20 flex items-center justify-center">🏠</div>
                    <div>
                        <span className="block font-bold">Página de Inicio</span>
                        <span className="text-xs opacity-70">Banners y Videos</span>
                    </div>
                </Link>

                {/* 2. QUIÉNES SOMOS (Nuevo) */}
                <Link to="/admin/contenido/quienes-somos" className="flex items-center gap-4 p-4 rounded-xl bg-slate-700/50 hover:bg-green-600 text-slate-200 hover:text-white transition-all group">
                    <div className="h-10 w-10 rounded-full bg-slate-600 group-hover:bg-white/20 flex items-center justify-center">👥</div>
                    <div>
                        <span className="block font-bold">Quiénes Somos</span>
                        <span className="text-xs opacity-70">Historia y Misión</span>
                    </div>
                </Link>

                {/* 3. FUTURAS SECCIONES (Placeholder) */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-700/20 text-slate-500 cursor-not-allowed border border-dashed border-slate-600">
                    <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center">➕</div>
                    <div>
                        <span className="block font-bold">Próximamente...</span>
                        <span className="text-xs">Más secciones</span>
                    </div>
                </div>

            </div>
        </div>
      </div>
    </div>
  )
}