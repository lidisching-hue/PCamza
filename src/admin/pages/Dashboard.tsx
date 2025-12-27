import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../lib/supabase'

export default function Dashboard() {
  const [stats, setStats] = useState({
    productos: 0,
    pedidosTotales: 0,
    pedidosPendientes: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
        try {
            // 1. Contar Productos en tu catálogo
            const { count: prodCount } = await supabase
                .from('productos')
                .select('*', { count: 'exact', head: true })

            // 2. Contar Total de Pedidos históricos
            const { count: pedidosCount } = await supabase
                .from('pedidos')
                .select('*', { count: 'exact', head: true })

            // 3. Contar Pedidos que requieren atención (Pendientes)
            const { count: pendientesCount } = await supabase
                .from('pedidos')
                .select('*', { count: 'exact', head: true })
                .eq('estado', 'pendiente')

            setStats({
                productos: prodCount || 0,
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
      
      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        
        {/* Card 1: Productos */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Total Productos</p>
                <h3 className="text-4xl font-black text-gray-800 mt-2">{stats.productos}</h3>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 text-2xl">
                📦
            </div>
        </div>

        {/* Card 2: Pedidos Pendientes (Atención) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden">
            {stats.pedidosPendientes > 0 && (
                <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping m-2"></div>
            )}
            <div>
                <p className="text-red-400 text-xs font-bold uppercase tracking-wider">Por Atender</p>
                <h3 className="text-4xl font-black text-red-600 mt-2">{stats.pedidosPendientes}</h3>
            </div>
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-red-600 text-2xl">
                🔔
            </div>
        </div>

        {/* Card 3: Ventas Totales */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition-shadow">
            <div>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">Historial Pedidos</p>
                <h3 className="text-4xl font-black text-gray-800 mt-2">{stats.pedidosTotales}</h3>
            </div>
            <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-green-600 text-2xl">
                📈
            </div>
        </div>
      </div>

      {/* Accesos Rápidos */}
      <h2 className="text-xl font-bold text-gray-800 mb-4">¿Qué quieres hacer hoy?</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/admin/productos" className="group block bg-slate-900 text-white p-8 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl transform translate-x-10 -translate-y-10">📦</div>
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  Gestión de Productos
              </h3>
              <p className="text-slate-400 mb-6">Agregar nuevos productos, actualizar precios o stock.</p>
              <span className="inline-block bg-white/10 px-4 py-2 rounded-lg text-sm font-semibold group-hover:bg-white group-hover:text-slate-900 transition-colors">
                  Ir al catálogo →
              </span>
          </Link>

          <Link to="/admin/banners" className="group block bg-gradient-to-br from-red-600 to-red-700 text-white p-8 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 text-9xl transform translate-x-10 -translate-y-10">🖼️</div>
              <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  Banners Publicitarios
              </h3>
              <p className="text-red-100 mb-6">Cambiar las imágenes de la portada y ofertas.</p>
              <span className="inline-block bg-black/20 px-4 py-2 rounded-lg text-sm font-semibold group-hover:bg-white group-hover:text-red-700 transition-colors">
                  Gestionar Banners →
              </span>
          </Link>
      </div>
    </div>
  )
}