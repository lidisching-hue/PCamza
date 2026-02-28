import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../hooks/useCart'
import { crearPedido, enviarPedidoWhatsApp } from '../services/pedidos'
import { supabase } from '../lib/supabase'

const WHATSAPP_TIENDA = '51912822543'

function Checkout() {
  const { items, clearCart } = useCart()
  const navigate = useNavigate()

  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [direccion, setDireccion] = useState('')
  const [loading, setLoading] = useState(false)

  // 1. Auto-rellenar nombre
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const nombreGuardado = user.user_metadata?.full_name || user.user_metadata?.name || ''
        if (nombreGuardado) setNombre(nombreGuardado)
      }
    }
    checkUser()
  }, [])

  // Calculamos el total
  const total = items.reduce((acc, item) => {
    const precio = item.precio_oferta || item.preciooferta || item.precio || 0
    return acc + (precio * item.cantidad)
  }, 0)

  // --- GENERAR MENSAJE ---
  const generarMensajeWhatsApp = () => {
    let mensaje = `👋 *NUEVO PEDIDO CONFIRMADO*\n\n`
    mensaje += `📝 *DATOS DE ENTREGA*\n`
    mensaje += `👤 *Cliente:* ${nombre}\n`
    mensaje += `📱 *Celular:* ${telefono}\n`
    if (direccion) mensaje += `🏠 *Dirección:* ${direccion}\n`
    
    mensaje += `\n🛒 *DETALLE DEL PEDIDO*\n`
    
    items.forEach(item => {
      const precio = item.precio_oferta || item.preciooferta || item.precio || 0
      const subtotal = (precio * item.cantidad).toFixed(2)
      
      const packItems = item.oferta_productos || item.contenido

      if (packItems && Array.isArray(packItems) && packItems.length > 0) {
        mensaje += `\n🎁 *${item.nombre}* (x${item.cantidad})\n`
        packItems.forEach((subItem: any) => {
          const nombreSub = subItem.producto?.nombre || subItem.nombre || 'Producto'
          const cantSub = subItem.cantidad
          mensaje += `   └─ _${cantSub}x ${nombreSub}_\n`
        })
        mensaje += `   *Subtotal:* S/ ${subtotal}\n`
      } else {
        mensaje += `✅ (${item.cantidad}) ${item.nombre} : S/ ${subtotal}\n`
      }
    })
    
    mensaje += `\n───────────────\n`
    mensaje += `💰 *TOTAL A PAGAR: S/ ${total.toFixed(2)}*\n`
    mensaje += `───────────────\n\n`
    mensaje += `_Pedido generado desde la web_`
    return mensaje
  }

  const handleFinalizarCompra = async () => {
    if (!nombre || !telefono) {
      alert('Por favor completa tu nombre y teléfono.')
      return
    }
    setLoading(true)
    try {
      const { data } = await supabase.auth.getUser()
      const idPedido = await crearPedido(data?.user?.id || null, items, { nombre, telefono, direccion })
      const mensaje = generarMensajeWhatsApp()
      await enviarPedidoWhatsApp(idPedido, WHATSAPP_TIENDA, mensaje)
      clearCart()
      navigate('/') 
    } catch (error) {
      console.error(error)
      alert('Hubo un error al procesar el pedido.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] flex justify-end">
      {/* Backdrop (Fondo oscuro) */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px] transition-opacity" 
        onClick={() => !loading && navigate(-1)}
      ></div>

      {/* Drawer (Panel Lateral) */}
      {/* w-full en móvil para evitar bordes extraños, max-w-md en desktop */}
      <div className="relative bg-white w-full sm:max-w-md h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300">
        
        {/* --- HEADER (Fijo) --- */}
        <div className="flex-none p-4 md:p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
          <div>
            <h1 className="text-lg md:text-xl font-bold text-gray-800">Finalizar pedido</h1>
            <p className="text-[10px] md:text-[11px] text-gray-400 font-bold uppercase tracking-widest">Información de entrega</p>
          </div>
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 text-gray-400 hover:text-black bg-gray-50 rounded-full transition-colors active:bg-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* --- CONTENIDO SCROLLABLE (Flexible) --- */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
          
          {/* Formulario */}
          <div className="space-y-6">
            <h2 className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-4">Datos de contacto</h2>
            
            <div className="space-y-5">
              <div className="relative group">
                <label className="text-[10px] font-bold text-gray-500 absolute -top-2 left-3 bg-white px-1 z-10 uppercase transition-colors group-focus-within:text-red-500">
                    Nombre Completo *
                </label>
                <input 
                  value={nombre} 
                  onChange={(e) => setNombre(e.target.value)} 
                  placeholder="Ej. Juan Pérez" 
                  /* text-base en móvil evita zoom automático en iOS */
                  className="w-full border-2 border-gray-100 rounded-xl p-3 md:p-3.5 outline-none focus:border-red-500 transition-colors font-medium text-base md:text-sm bg-white" 
                />
              </div>

              <div className="relative group">
                <label className="text-[10px] font-bold text-gray-500 absolute -top-2 left-3 bg-white px-1 z-10 uppercase transition-colors group-focus-within:text-red-500">
                    Celular / WhatsApp *
                </label>
                <input 
                  value={telefono} 
                  onChange={(e) => setTelefono(e.target.value)} 
                  placeholder="987 654 321" 
                  type="tel" 
                  className="w-full border-2 border-gray-100 rounded-xl p-3 md:p-3.5 outline-none focus:border-red-500 transition-colors font-medium text-base md:text-sm bg-white" 
                />
              </div>

              <div className="relative group">
                <label className="text-[10px] font-bold text-gray-500 absolute -top-2 left-3 bg-white px-1 z-10 uppercase transition-colors group-focus-within:text-red-500">
                    Dirección de Entrega
                </label>
                <textarea 
                  value={direccion} 
                  onChange={(e) => setDireccion(e.target.value)} 
                  placeholder="Calle, número, urbanización..." 
                  className="w-full border-2 border-gray-100 rounded-xl p-3 md:p-3.5 outline-none focus:border-red-500 transition-colors font-medium text-base md:text-sm h-20 md:h-24 resize-none bg-white" 
                />
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="bg-gray-50 p-4 md:p-5 rounded-2xl border border-gray-100">
             <div className="flex items-center gap-2 mb-4">
                <span className="text-sm">🛒</span>
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Resumen de tu bolsa</h3>
             </div>

             <div className="space-y-3 md:space-y-4">
              {items.map(item => {
                const precio = item.precio_oferta || item.preciooferta || item.precio || 0
                const packItems = item.oferta_productos || item.contenido
                const esPack = packItems && Array.isArray(packItems) && packItems.length > 0

                return (
                  <div key={item.id} className="flex flex-col border-b border-gray-200/50 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start gap-3">
                      <span className="text-sm font-bold text-gray-800 flex-1 leading-snug">
                        <span className="text-red-600 whitespace-nowrap mr-1">{item.cantidad}x</span> 
                        {item.nombre}
                      </span>
                      <span className="text-sm font-black text-gray-900 whitespace-nowrap">
                        S/ {(precio * item.cantidad).toFixed(2)}
                      </span>
                    </div>

                    {/* Sub-items del Pack */}
                    {esPack && (
                      <div className="mt-1.5 ml-2 border-l-2 border-red-200 pl-3 space-y-0.5">
                        {packItems.map((c: any, i: number) => {
                             const subNombre = c.producto?.nombre || c.nombre || 'Item'
                             return (
                                <p key={i} className="text-[10px] md:text-xs text-gray-500 font-medium truncate">
                                  • {c.cantidad}x {subNombre}
                                </p>
                             )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
             </div>

             <div className="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase">Subtotal</span>
                <span className="text-base font-bold text-gray-800">S/ {total.toFixed(2)}</span>
             </div>
          </div>
        </div>

        {/* --- FOOTER (Fijo) --- */}
        <div className="flex-none p-4 md:p-6 bg-white border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total a pagar</span>
            <span className="text-2xl md:text-3xl font-black text-gray-900 tracking-tighter">S/ {total.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={handleFinalizarCompra} 
            disabled={loading || items.length === 0} 
            className="w-full bg-[#25D366] text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm shadow-lg shadow-green-100 hover:bg-[#20bd5a] active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Procesando...</span>
              </div>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Confirmar por WhatsApp
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Checkout