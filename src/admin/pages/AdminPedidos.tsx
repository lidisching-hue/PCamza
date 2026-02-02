import { useState, useEffect, useMemo } from 'react'
import { supabase } from '../../lib/supabase'
import { Toaster, toast } from 'react-hot-toast'
import { 
  Eye, 
  Truck, 
  CheckCircle, 
  XCircle, 
  MessageCircle, 
  Clock, 
  MapPin, 
  Search,
  Trash2
} from 'lucide-react'

// Asegúrate de que en tu tabla 'pedidos' la columna 'estado' acepte estos textos exactos.
type EstadoPedido = 'pendiente' | 'en proceso' | 'entregado' | 'cancelado'

interface Pedido {
  id: string
  created_at: string
  nombre_cliente: string
  telefono: string
  direccion: string
  total: number
  estado: EstadoPedido
  productos: any[]
  enviado_whatsapp: boolean
}

export default function AdminPedidos() {
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null)
  
  // AHORA EL ESTADO INICIAL ES 'pendiente' Y SOLO MANEJAMOS LOS 4 ESTADOS
  const [activeTab, setActiveTab] = useState<EstadoPedido>('pendiente')

  useEffect(() => {
    fetchPedidos()
  }, [])

  // 1. CARGA DE DATOS
  const fetchPedidos = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('pedidos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error al cargar:', error.message)
      toast.error('Error de conexión')
    } else {
      setPedidos(data as Pedido[] || [])
    }
    setLoading(false)
  }

  // 2. GUARDADO EN BASE DE DATOS (CON VERIFICACIÓN)
  const handleEstado = async (id: string, nuevoEstado: EstadoPedido) => {
    const estadoAnterior = pedidos.find(p => p.id === id)?.estado

    // A. Actualización Optimista (Para que se vea rápido)
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p))
    
    // Si tenemos el modal abierto, actualizamos su estado interno también
    if (selectedPedido?.id === id) {
        setSelectedPedido(prev => prev ? { ...prev, estado: nuevoEstado } : null)
    }

    // B. Guardado REAL en Supabase
    try {
      const { error } = await supabase
        .from('pedidos')
        .update({ estado: nuevoEstado })
        .eq('id', id)

      if (error) {
        throw error // Forzamos a ir al catch
      }

      toast.success(`Movido a: ${nuevoEstado.toUpperCase()}`)
      
      // Si cambiamos de estado, cerramos el modal porque el pedido se "mueve" de pestaña
      if (activeTab !== nuevoEstado) {
          setSelectedPedido(null) 
      }

    } catch (error: any) {
      console.error('ERROR CRÍTICO AL GUARDAR:', error.message)
      toast.error(`No se guardó: ${error.message}`)
      
      // Revertimos el cambio visual si falló la base de datos
      if (estadoAnterior) {
        setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado: estadoAnterior } : p))
      }
    }
  }

  // 3. ELIMINAR
  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar permanentemente?')) return

    const { error } = await supabase.from('pedidos').delete().eq('id', id)

    if (error) {
      toast.error('Error al eliminar')
    } else {
      toast.success('Pedido eliminado')
      setPedidos(prev => prev.filter(p => p.id !== id))
      setSelectedPedido(null)
    }
  }

  // 4. FILTRADO: PESTAÑA ACTUAL + BUSCADOR
  const filteredPedidos = useMemo(() => {
    return pedidos.filter(pedido => {
      // FILTRO 1: Solo mostrar pedidos que coincidan con la PESTAÑA ACTIVA
      if (pedido.estado !== activeTab) return false

      // FILTRO 2: Buscador
      const term = searchTerm.toLowerCase()
      const matchNombre = pedido.nombre_cliente?.toLowerCase().includes(term)
      const matchTel = pedido.telefono?.includes(term)
      const matchId = pedido.id.toLowerCase().includes(term)
      const matchProd = pedido.productos.some((p: any) => p.nombre.toLowerCase().includes(term))

      return matchNombre || matchTel || matchId || matchProd
    })
  }, [pedidos, searchTerm, activeTab])

  // Contadores para las pestañas
  const counts = {
    pendiente: pedidos.filter(p => p.estado === 'pendiente').length,
    'en proceso': pedidos.filter(p => p.estado === 'en proceso').length,
    entregado: pedidos.filter(p => p.estado === 'entregado').length,
    cancelado: pedidos.filter(p => p.estado === 'cancelado').length,
  }

  // Configuración visual de las pestañas
  const tabsConfig = [
    { id: 'pendiente', label: 'Pendiente', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', badge: 'bg-yellow-500' },
    { id: 'en proceso', label: 'En Proceso', icon: Truck, color: 'text-blue-600', bg: 'bg-blue-50', badge: 'bg-blue-500' },
    { id: 'entregado', label: 'Entregado', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', badge: 'bg-green-500' },
    { id: 'cancelado', label: 'Cancelado', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', badge: 'bg-red-500' },
  ] as const

  return (
    <div className="p-4 md:p-10 bg-slate-50 min-h-screen font-sans">
      <Toaster position="bottom-right" />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
            <h1 className="text-3xl font-black text-gray-800 tracking-tight">📦 Gestión de Pedidos</h1>
        </div>
        <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
                type="text" 
                placeholder="Buscar pedido..." 
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-black focus:ring-0 outline-none shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* --- NUEVAS PESTAÑAS (4 SECCIONES) --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {tabsConfig.map((tab) => (
            <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col md:flex-row items-center justify-center gap-2 py-3 px-2 rounded-xl transition-all border-2 ${
                    activeTab === tab.id 
                    ? `border-${tab.color.split('-')[1]}-200 bg-white shadow-md ${tab.color}`
                    : 'border-transparent bg-white text-gray-400 hover:bg-gray-100'
                }`}
            >
                <div className="relative">
                    <tab.icon size={20} />
                    {counts[tab.id] > 0 && (
                        <span className={`absolute -top-2 -right-2 ${tab.badge} text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white`}>
                            {counts[tab.id]}
                        </span>
                    )}
                </div>
                <span className="font-bold text-sm">{tab.label}</span>
            </button>
        ))}
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden min-h-[400px]">
        {loading ? (
           <div className="p-20 text-center text-gray-400 animate-pulse">Cargando base de datos...</div>
        ) : filteredPedidos.length === 0 ? (
           <div className="p-20 text-center flex flex-col items-center justify-center text-gray-400">
               <div className="bg-slate-50 p-6 rounded-full mb-4 text-4xl opacity-50">📂</div>
               <p>No hay pedidos en <span className="font-bold">"{activeTab.toUpperCase()}"</span></p>
           </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="p-4 font-bold">Fecha / ID</th>
                  <th className="p-4 font-bold">Cliente</th>
                  <th className="p-4 font-bold">Detalle</th>
                  <th className="p-4 font-bold">Total</th>
                  <th className="p-4 font-bold text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPedidos.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                        <div className="font-bold text-gray-700 text-sm">
                            {new Date(pedido.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono">#{pedido.id.slice(0, 6)}</div>
                    </td>
                    <td className="p-4">
                        <div className="font-bold text-gray-800">{pedido.nombre_cliente}</div>
                        <div className="text-xs text-gray-500">{pedido.telefono}</div>
                    </td>
                    <td className="p-4 max-w-xs text-xs text-gray-600">
                         {pedido.productos.map((p: any) => `${p.cantidad} ${p.nombre}`).join(', ')}
                    </td>
                    <td className="p-4 font-bold text-slate-900">
                        S/ {pedido.total.toFixed(2)}
                    </td>
                    <td className="p-4 flex justify-center gap-2">
                        <button 
                          onClick={() => setSelectedPedido(pedido)}
                          className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                        >
                            <Eye size={18} />
                        </button>
                        <button 
                           onClick={() => handleDelete(pedido.id)}
                           className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                        >
                            <Trash2 size={18} />
                        </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- MODAL PARA CAMBIAR ESTADO --- */}
      {selectedPedido && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedPedido(null)}/>
            
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                    <h2 className="text-lg font-bold text-gray-800">Gestionar Pedido #{selectedPedido.id.slice(0,4)}</h2>
                    <button onClick={() => setSelectedPedido(null)}><XCircle size={24} className="text-gray-300 hover:text-red-500"/></button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {/* BOTONES DE ESTADO (ESTO ES LO QUE MUEVE EL PEDIDO DE SECCIÓN) */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                        <p className="text-xs font-bold text-slate-400 uppercase text-center mb-3">Mover Pedido a:</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            <button onClick={() => handleEstado(selectedPedido.id, 'pendiente')} className={`py-2 text-xs font-bold rounded-lg border transition-all ${selectedPedido.estado === 'pendiente' ? 'bg-yellow-100 border-yellow-400 text-yellow-800' : 'bg-white hover:bg-gray-100'}`}>⏳ Pendiente</button>
                            <button onClick={() => handleEstado(selectedPedido.id, 'en proceso')} className={`py-2 text-xs font-bold rounded-lg border transition-all ${selectedPedido.estado === 'en proceso' ? 'bg-blue-100 border-blue-400 text-blue-800' : 'bg-white hover:bg-gray-100'}`}>🛵 En Proceso</button>
                            <button onClick={() => handleEstado(selectedPedido.id, 'entregado')} className={`py-2 text-xs font-bold rounded-lg border transition-all ${selectedPedido.estado === 'entregado' ? 'bg-green-100 border-green-400 text-green-800' : 'bg-white hover:bg-gray-100'}`}>✅ Entregado</button>
                            <button onClick={() => handleEstado(selectedPedido.id, 'cancelado')} className={`py-2 text-xs font-bold rounded-lg border transition-all ${selectedPedido.estado === 'cancelado' ? 'bg-red-100 border-red-400 text-red-800' : 'bg-white hover:bg-gray-100'}`}>❌ Cancelado</button>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Info Cliente */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-gray-400 uppercase">Cliente</h3>
                            <div className="bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex items-start gap-3">
                                <MapPin className="text-blue-500 mt-1" size={16} />
                                <div>
                                    <p className="font-bold text-gray-800">{selectedPedido.nombre_cliente}</p>
                                    <p className="text-sm text-gray-500">{selectedPedido.direccion}</p>
                                </div>
                            </div>
                            <a href={`https://api.whatsapp.com/send?phone=51${selectedPedido.telefono}`} target="_blank" rel="noreferrer" 
                               className="flex items-center justify-center gap-2 bg-green-500 text-white p-3 rounded-xl font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-200">
                                <MessageCircle size={18}/> Contactar por WhatsApp
                            </a>
                        </div>

                        {/* Detalle Compra */}
                        <div>
                             <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Productos</h3>
                             <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 space-y-2 max-h-40 overflow-y-auto">
                                {selectedPedido.productos.map((prod, i) => (
                                    <div key={i} className="flex justify-between text-sm">
                                        <span><b>{prod.cantidad}x</b> {prod.nombre}</span>
                                        <span className="font-bold">S/ {((prod.preciooferta || prod.precio) * prod.cantidad).toFixed(2)}</span>
                                    </div>
                                ))}
                             </div>
                             <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                                <span className="font-bold text-gray-500">Total</span>
                                <span className="text-2xl font-black text-slate-900">S/ {selectedPedido.total.toFixed(2)}</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  )
}