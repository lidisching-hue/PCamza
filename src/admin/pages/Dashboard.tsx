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
  const [showContentMenu, setShowContentMenu] = useState(true)

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
    // RESPONSIVE: Padding ajustado (p-4 en móvil, p-8 en PC)
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Resumen del Sistema</h1>
      <p className="text-sm md:text-base text-gray-500 mb-6 md:mb-8">Bienvenido de nuevo al panel de control.</p>
      
      {/* --- SECCIÓN 1: ESTADO DE PEDIDOS (PRIORIDAD ALTA) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
        
        {/* Card: Pedidos Pendientes */}
        <Link to="/admin/pedidos" className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-red-100 flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer">
            {stats.pedidosPendientes > 0 && (
                <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping m-2"></div>
            )}
            <div>
                <p className="text-red-400 text-[10px] md:text-xs font-bold uppercase tracking-wider group-hover:text-red-600 transition-colors">Pedidos Pendientes</p>
                {/* RESPONSIVE: Texto numérico adaptable */}
                <h3 className="text-3xl md:text-4xl font-black text-red-600 mt-2">{stats.pedidosPendientes}</h3>
            </div>
            {/* RESPONSIVE: Icono adaptable */}
            <div className="w-12 h-12 md:w-14 md:h-14 bg-red-50 rounded-full flex items-center justify-center text-red-600 text-2xl md:text-3xl group-hover:scale-110 transition-transform">🔔</div>
        </Link>

        {/* Card: Ventas Totales */}
        <Link to="/admin/pedidos" className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow group">
            <div>
                <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase tracking-wider">Historial Pedidos</p>
                <h3 className="text-3xl md:text-4xl font-black text-gray-800 mt-2">{stats.pedidosTotales}</h3>
            </div>
            <div className="w-12 h-12 md:w-14 md:h-14 bg-green-50 rounded-full flex items-center justify-center text-green-600 text-2xl md:text-3xl">📈</div>
        </Link>
      </div>

      {/* --- SECCIÓN 2: GESTIÓN DE TIENDA (PRODUCTOS) --- */}
      <h2 className="text-base md:text-lg font-bold text-gray-700 mb-4">Gestión de Tienda</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-10">
          
          {/* BOTÓN PRODUCTOS */}
          <Link to="/admin/productos" className="group block bg-white border border-gray-200 p-5 md:p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
              <div className="flex justify-between items-start mb-4">
                  <div className="p-2 md:p-3 bg-blue-50 rounded-xl text-blue-600 text-xl md:text-2xl">📦</div>
                  <span className="text-xl md:text-2xl font-bold text-gray-800">{stats.productos}</span>
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-800">Productos</h3>
              <p className="text-gray-400 text-xs md:text-sm">Gestionar inventario y precios</p>
          </Link>

          {/* BOTÓN OFERTAS / PACKS */}
          <Link to="/admin/ofertas" className="group block bg-white border border-gray-200 p-5 md:p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all">
               <div className="flex justify-between items-start mb-4">
                  <div className="p-2 md:p-3 bg-purple-50 rounded-xl text-purple-600 text-xl md:text-2xl">🎁</div>
                  <span className="text-xl md:text-2xl font-bold text-gray-800">{stats.combosActivos}</span>
              </div>
              <h3 className="text-base md:text-lg font-bold text-gray-800">Packs & Combos</h3>
              <p className="text-gray-400 text-xs md:text-sm">Crear paquetes promocionales</p>
          </Link>

          {/* ESTADÍSTICA OFERTAS */}
          {/* RESPONSIVE: En móvil ocupa todo el ancho, en tablet (sm) ocupa las 2 columnas si sobra espacio */}
          <div className="bg-white border border-gray-200 p-5 md:p-6 rounded-2xl shadow-sm flex flex-col justify-center sm:col-span-2 md:col-span-1">
               <div className="flex items-center gap-3 mb-2">
                   <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600">🏷️</div>
                   <span className="text-gray-500 text-xs md:text-sm font-semibold uppercase">En Oferta</span>
               </div>
               <h3 className="text-2xl md:text-3xl font-black text-gray-800">{stats.productosEnOferta} <span className="text-xs md:text-sm font-normal text-gray-400">productos</span></h3>
          </div>
      </div>

      {/* --- SECCIÓN 3: ADMINISTRACIÓN DE CONTENIDO (DESPLEGABLE) --- */}
      <h2 className="text-base md:text-lg font-bold text-gray-700 mb-4">Editor de Página Web</h2>
      
      <div className="bg-slate-900 rounded-2xl md:rounded-3xl overflow-hidden shadow-xl mb-10">
        {/* Cabecera del Acordeón (Clickable) */}
        <button 
            onClick={() => setShowContentMenu(!showContentMenu)}
            className="w-full flex items-center justify-between p-4 md:p-6 text-white hover:bg-slate-800 transition-colors"
        >
            <div className="flex items-center gap-3 md:gap-4">
                <div className="bg-white/10 p-2 md:p-3 rounded-xl text-xl md:text-2xl">🎨</div>
                <div className="text-left">
                    <h3 className="text-lg md:text-xl font-bold">Administración de Contenido</h3>
                    <p className="text-slate-400 text-xs md:text-sm">Editar Banners, Home, Tiendas, Contacto...</p>
                </div>
            </div>
            {/* Flecha animada */}
            <div className={`transform transition-transform duration-300 ${showContentMenu ? 'rotate-180' : ''}`}>
                🔽
            </div>
        </button>

        {/* Contenido del Desplegable */}
        <div className={`bg-slate-800 transition-all duration-300 ease-in-out overflow-hidden ${showContentMenu ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
            {/* RESPONSIVE: Grid de 1 col en móvil, 2 en tablet (sm), 4 en PC (lg) */}
            <div className="p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border-t border-slate-700">
                
                {/* 1. HOME */}
                <Link to="/admin/banners" className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-slate-700/50 hover:bg-red-600 text-slate-200 hover:text-white transition-all group border border-slate-600 hover:border-red-500">
                    <div className="h-10 w-10 rounded-full bg-slate-600 group-hover:bg-white/20 flex items-center justify-center">🏠</div>
                    <div>
                        <span className="block font-bold text-sm md:text-base">Inicio</span>
                        <span className="text-xs opacity-70">Banners</span>
                    </div>
                </Link>

                {/* 2. QUIÉNES SOMOS */}
                <Link to="/admin/nosotros" className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-slate-700/50 hover:bg-green-600 text-slate-200 hover:text-white transition-all group border border-slate-600 hover:border-green-500">
                    <div className="h-10 w-10 rounded-full bg-slate-600 group-hover:bg-white/20 flex items-center justify-center">👥</div>
                    <div>
                        <span className="block font-bold text-sm md:text-base">Nosotros</span>
                        <span className="text-xs opacity-70">Historia</span>
                    </div>
                </Link>

                {/* 3. TIENDAS */}
                <Link to="/admin/tiendas" className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-slate-700/50 hover:bg-blue-600 text-slate-200 hover:text-white transition-all group border border-slate-600 hover:border-blue-500">
                    <div className="h-10 w-10 rounded-full bg-slate-600 group-hover:bg-white/20 flex items-center justify-center">📍</div>
                    <div>
                        <span className="block font-bold text-sm md:text-base">Tiendas</span>
                        <span className="text-xs opacity-70">Mapas</span>
                    </div>
                </Link>

                {/* 4. CONTACTO */}
                <Link to="/admin/contacto" className="flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-xl bg-slate-700/50 hover:bg-purple-600 text-slate-200 hover:text-white transition-all group border border-slate-600 hover:border-purple-500">
                    <div className="h-10 w-10 rounded-full bg-slate-600 group-hover:bg-white/20 flex items-center justify-center">📞</div>
                    <div>
                        <span className="block font-bold text-sm md:text-base">Contacto</span>
                        <span className="text-xs opacity-70">Info</span>
                    </div>
                </Link>

            </div>
        </div>
      </div>
    </div>
  )
}