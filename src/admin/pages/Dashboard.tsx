import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({
    productos: 0,
    productosEnOferta: 0, // Nuevo
    combosActivos: 0,     // Nuevo
    pedidosTotales: 0,
    pedidosPendientes: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
        try {
            // 1. Contar Productos Totales
            const { count: prodCount } = await supabase
                .from('productos')
                .select('*', { count: 'exact', head: true })

            // 2. Contar Productos Individuales en OFERTA
            const { count: ofertaIndivCount } = await supabase
                .from('productos')
                .select('*', { count: 'exact', head: true })
                .eq('ofertaactiva', true)

            // 3. Contar Combos/Packs Activos
            const { count: combosCount } = await supabase
                .from('ofertas')
                .select('*', { count: 'exact', head: true })
                .eq('activo', true)

            // 4. Contar Total de Pedidos históricos
            const { count: pedidosCount } = await supabase
                .from('pedidos')
                .select('*', { count: 'exact', head: true })

            // 5. Contar Pedidos que requieren atención (Pendientes)
            const { count: pendientesCount } = await supabase
                .from('pedidos')
                .select('*', { count: 'exact', head: true })
                .eq('estado', 'pendiente')

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
        
        {/* Card: Pedidos Pendientes (Atención) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden">
            {stats.pedidosPendientes > 0 && (
                <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping m-2"></div>
            )}
            <div>
                <p className="text-red-400 text-xs font-bold uppercase tracking-wider">Pedidos Pendientes</p>
                <h3 className="text-4xl font-black text-red-600 mt-2">{stats.pedidosPendientes}</h3>
            </div>
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center text-red-600 text-3xl">
                🔔
            </div>
        </div>

        {/* Card: Ventas Totales */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Historial Pedidos</p>
                <h3 className="text-4xl font-black text-gray-800 mt-2">{stats.pedidosTotales}</h3>
            </div>
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center text-green-600 text-3xl">
                📈
            </div>
        </div>
      </div>

      <h2 className="text-lg font-bold text-gray-700 mb-4">Estado del Catálogo</h2>

      {/* --- SECCIÓN 2: ESTADO DEL CATÁLOGO --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Card: Total Productos */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">Inventario Total</p>
                <h3 className="text-3xl font-black text-gray-700 mt-1">{stats.productos}</h3>
            </div>
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 text-xl">
                📦
            </div>
        </div>

        {/* Card: Productos en Oferta Individual */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-yellow-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-yellow-600 text-[10px] font-bold uppercase tracking-wider">Ofertas Individuales</p>
                <h3 className="text-3xl font-black text-yellow-500 mt-1">{stats.productosEnOferta}</h3>
            </div>
            <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center text-yellow-500 text-xl">
                🏷️
            </div>
        </div>

        {/* Card: Combos Activos */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-purple-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-purple-500 text-[10px] font-bold uppercase tracking-wider">Combos Activos</p>
                <h3 className="text-3xl font-black text-purple-600 mt-1">{stats.combosActivos}</h3>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 text-xl">
                🎁
            </div>
        </div>

      </div>

      {/* --- SECCIÓN 3: ACCESOS RÁPIDOS --- */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">Gestión Rápida</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* BOTÓN PRODUCTOS */}
          <Link to="/admin/productos" className="group block bg-slate-900 text-white p-6 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl transform translate-x-4 -translate-y-4">📦</div>
              <h3 className="text-xl font-bold mb-1 flex items-center gap-2">Productos</h3>
              <p className="text-slate-400 text-sm mb-4">Agregar, editar precios y stock.</p>
              <span className="inline-block bg-white/10 px-3 py-1 rounded-lg text-xs font-semibold group-hover:bg-white group-hover:text-slate-900 transition-colors">
                  Ir al inventario →
              </span>
          </Link>

          {/* BOTÓN OFERTAS / PACKS (NUEVO) */}
          <Link to="/admin/ofertas" className="group block bg-gradient-to-br from-purple-700 to-indigo-900 text-white p-6 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl transform translate-x-4 -translate-y-4">🎁</div>
              <h3 className="text-xl font-bold mb-1 flex items-center gap-2">Packs & Combos</h3>
              <p className="text-purple-200 text-sm mb-4">Crear canastas y ofertas agrupadas.</p>
              <span className="inline-block bg-white/10 px-3 py-1 rounded-lg text-xs font-semibold group-hover:bg-white group-hover:text-purple-900 transition-colors">
                  Gestionar Packs →
              </span>
          </Link>

          {/* BOTÓN BANNERS */}
          <Link to="/admin/banners" className="group block bg-gradient-to-br from-red-600 to-red-700 text-white p-6 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-8xl transform translate-x-4 -translate-y-4">🖼️</div>
              <h3 className="text-xl font-bold mb-1 flex items-center gap-2">Banners</h3>
              <p className="text-red-100 text-sm mb-4">Cambiar imágenes de portada.</p>
              <span className="inline-block bg-black/20 px-3 py-1 rounded-lg text-xs font-semibold group-hover:bg-white group-hover:text-red-700 transition-colors">
                  Ver Banners →
              </span>
          </Link>

      </div>
    </div>
  )
}