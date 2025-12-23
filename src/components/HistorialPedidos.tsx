import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Definimos qué tipo de datos vamos a recibir para que TS no se queje
interface HistorialPedidosProps {
  usuario: any; // Usamos 'any' por ahora para que sea flexible con el objeto de Supabase
  cerrar: () => void;
}

export default function HistorialPedidos({ usuario, cerrar }: HistorialPedidosProps) {
  // Definimos que pedidos es un array de cualquier cosa (any[])
  const [pedidos, setPedidos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function cargarPedidos() {
      if (!usuario) return
      
      const { data, error } = await supabase
        .from('pedidos')
        .select('*')
        .eq('user_id', usuario.id)
        .order('created_at', { ascending: false })

      if (!error && data) setPedidos(data)
      setLoading(false)
    }
    cargarPedidos()
  }, [usuario])

  // Función para dar color según el estado
  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case 'entregado': return 'bg-green-100 text-green-800'
      case 'en proceso': return 'bg-blue-100 text-blue-800'
      default: return 'bg-orange-100 text-orange-800' // Pendiente
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
        {/* Fondo oscuro */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={cerrar}></div>

      <div className="relative bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Mis Pedidos 📦</h2>
          <button onClick={cerrar} className="bg-gray-100 p-2 rounded-full hover:bg-gray-200">✕</button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Cargando historial...</p>
        ) : pedidos.length === 0 ? (
          <div className="text-center mt-10">
            <p className="text-gray-400 mb-2">No tienes pedidos registrados.</p>
            <p className="text-sm text-gray-300">Tus compras aparecerán aquí.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pedidos.map((pedido) => (
              <div key={pedido.id} className="border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wide ${getBadgeColor(pedido.estado)}`}>
                    {pedido.estado || 'Pendiente'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(pedido.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                    {/* Verificamos que 'productos' sea un array antes de mapear */}
                    {Array.isArray(pedido.productos) && pedido.productos.map((prod: any, i: number) => (
                        <div key={i}>• {prod.cantidad} x {prod.nombre}</div>
                    ))}
                </div>

                <div className="flex justify-between items-center border-t border-gray-50 pt-2 mt-2">
                    <span className="text-xs text-gray-400">Total pagado</span>
                    <span className="font-bold text-gray-800">S/ {Number(pedido.total).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}