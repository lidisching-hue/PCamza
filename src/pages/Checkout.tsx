import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { crearPedido, enviarPedidoWhatsApp } from '../services/pedidos'
import { supabase } from '../lib/supabase'

const WHATSAPP_TIENDA = '51994166419'

function Checkout() {
  const { items, clearCart } = useCart()
  const navigate = useNavigate()

  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [loading, setLoading] = useState(false)

  // Protección: Si no hay items, volver al inicio
  useEffect(() => {
    if (items.length === 0) {
       // navigate('/') // Descomenta esto si quieres que los saque de la pantalla
    }
  }, [items])

  const total = items.reduce((acc, item) => {
    const precio = item.ofertaactiva && item.preciooferta ? item.preciooferta : item.precio
    return acc + precio * item.cantidad
  }, 0)

  // --- GENERAR MENSAJE ---
  const generarMensajeWhatsApp = () => {
    let mensaje = `👋 Hola, deseo confirmar mi pedido:\n\n`
    
    mensaje += `📝 *DATOS DE ENTREGA*\n`
    mensaje += `👤 Cliente: ${nombre}\n`
    mensaje += `📱 Celular: ${telefono}\n`
    if (direccion) mensaje += `🏠 Dirección: ${direccion}\n`
    
    mensaje += `\n🛒 *MIS PRODUCTOS*\n`
    items.forEach(item => {
      const precio = item.ofertaactiva && item.preciooferta ? item.preciooferta : item.precio
      const subtotal = (precio * item.cantidad).toFixed(2)
      // Usamos guion para evitar caracteres raros
      mensaje += `- (${item.cantidad}) ${item.nombre} : S/ ${subtotal}\n`
    })
    
    mensaje += `\n💰 *TOTAL A PAGAR: S/ ${total.toFixed(2)}*`
    return mensaje
  }

  // --- FINALIZAR COMPRA ---
  const handleFinalizarCompra = async () => {
    if (!nombre || !telefono) {
      alert('Por favor completa tu nombre y teléfono.')
      return
    }
    
    setLoading(true)
    
    try {
      // 1. Usuario
      const { data } = await supabase.auth.getUser()
      
      // 2. Guardar en BD
      const idPedido = await crearPedido(data?.user?.id || null, items, { 
        nombre, 
        telefono, 
        direccion 
      })
      
      // 3. Enviar WhatsApp
      const mensaje = generarMensajeWhatsApp()
      await enviarPedidoWhatsApp(idPedido, WHATSAPP_TIENDA, mensaje)

      // 4. Limpiar y salir
      clearCart()
      navigate('/') 
      
    } catch (error) {
      console.error(error)
      alert('Hubo un error al procesar el pedido. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end pointer-events-none">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity pointer-events-auto"
        onClick={() => !loading && navigate(-1)}
      ></div>

      <div className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300 pointer-events-auto">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Finalizar pedido</h1>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Información de entrega</p>
          </div>
          <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-black bg-gray-50 rounded-full">
            ✕
          </button>
        </div>

        {/* Formulario */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <div className="space-y-4">
            <h2 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Datos de contacto</h2>
            
            <div className="group">
              <label className="text-[11px] font-bold text-gray-400 ml-1 uppercase">Nombre *</label>
              <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Juan Pérez" className="w-full border-b-2 border-gray-100 p-3 outline-none focus:border-black font-medium" />
            </div>

            <div className="group">
              <label className="text-[11px] font-bold text-gray-400 ml-1 uppercase">Celular *</label>
              <input value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="987 654 321" type="tel" className="w-full border-b-2 border-gray-100 p-3 outline-none focus:border-black font-medium" />
            </div>

            <div className="group">
              <label className="text-[11px] font-bold text-gray-400 ml-1 uppercase">Dirección</label>
              <textarea value={direccion} onChange={e => setDireccion(e.target.value)} placeholder="Referencia..." className="w-full border-b-2 border-gray-100 p-3 outline-none focus:border-black font-medium h-20 resize-none" />
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
             <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Resumen</h3>
             <div className="space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>({item.cantidad}) {item.nombre}</span>
                  <span className="font-bold">S/ {( (item.ofertaactiva && item.preciooferta ? item.preciooferta : item.precio) * item.cantidad).toFixed(2)}</span>
                </div>
              ))}
             </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-8 bg-white border-t border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total</span>
            <span className="text-3xl font-black text-gray-900">S/ {total.toFixed(2)}</span>
          </div>

          <button
            onClick={handleFinalizarCompra}
            disabled={loading || items.length === 0}
            className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold text-sm shadow-xl hover:bg-[#20bd5a] flex items-center justify-center gap-2"
          >
            {loading ? 'Procesando...' : 'Confirmar y Enviar a WhatsApp'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Checkout