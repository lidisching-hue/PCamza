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

  // 1. Auto-rellenar nombre si hay usuario logueado
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
    // Si es oferta, usamos precio_oferta (o preciooferta según tu base anterior)
    // Si usaste mi SQL nuevo, la propiedad suele ser 'precio_oferta'. 
    // Aquí hacemos un chequeo seguro:
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
      
      // DETECTAR SI ES PACK (Combo)
      // Buscamos si tiene 'oferta_productos' (nuevo) o 'contenido' (viejo)
      const packItems = item.oferta_productos || item.contenido

      if (packItems && Array.isArray(packItems) && packItems.length > 0) {
        // ES UN PACK
        mensaje += `\n🎁 *${item.nombre}* (x${item.cantidad})\n`
        
        packItems.forEach((subItem: any) => {
          // Adaptador: En la nueva DB el nombre está dentro de 'producto.nombre'
          const nombreSub = subItem.producto?.nombre || subItem.nombre || 'Producto'
          const cantSub = subItem.cantidad
          
          mensaje += `   └─ _${cantSub}x ${nombreSub}_\n`
        })
        mensaje += `   *Subtotal:* S/ ${subtotal}\n`
      } else {
        // ES PRODUCTO INDIVIDUAL
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
    <div className="fixed inset-0 z-[9999] flex justify-end pointer-events-none">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity pointer-events-auto" onClick={() => !loading && navigate(-1)}></div>

      <div className="relative bg-white w-full max-w-md h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-300 pointer-events-auto">
        {/* HEADER */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Finalizar pedido</h1>
            <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest">Información de entrega</p>
          </div>
          <button onClick={() => navigate(-1)} className="p-2 text-gray-400 hover:text-black bg-gray-50 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
               <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* CONTENIDO FORMULARIO */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          <div className="space-y-5">
            <h2 className="text-[10px] font-black text-red-600 uppercase tracking-widest">Datos de contacto</h2>
            
            <div className="space-y-4">
              <div className="relative">
                <label className="text-[10px] font-black text-gray-400 absolute -top-2 left-3 bg-white px-1 z-10 uppercase">Nombre Completo *</label>
                <input 
                  value={nombre} 
                  onChange={(e) => setNombre(e.target.value)} 
                  placeholder="Ej. Juan Pérez" 
                  className="w-full border-2 border-gray-100 rounded-xl p-3 outline-none focus:border-red-500 transition-colors font-medium text-sm" 
                />
              </div>

              <div className="relative">
                <label className="text-[10px] font-black text-gray-400 absolute -top-2 left-3 bg-white px-1 z-10 uppercase">Celular / WhatsApp *</label>
                <input 
                  value={telefono} 
                  onChange={(e) => setTelefono(e.target.value)} 
                  placeholder="987 654 321" 
                  type="tel" 
                  className="w-full border-2 border-gray-100 rounded-xl p-3 outline-none focus:border-red-500 transition-colors font-medium text-sm" 
                />
              </div>

              <div className="relative">
                <label className="text-[10px] font-black text-gray-400 absolute -top-2 left-3 bg-white px-1 z-10 uppercase">Dirección de Entrega</label>
                <textarea 
                  value={direccion} 
                  onChange={(e) => setDireccion(e.target.value)} 
                  placeholder="Dirección exacta y alguna referencia..." 
                  className="w-full border-2 border-gray-100 rounded-xl p-3 outline-none focus:border-red-500 transition-colors font-medium text-sm h-24 resize-none" 
                />
              </div>
            </div>
          </div>

          {/* RESUMEN DE COMPRA ELEGANTE */}
          <div className="bg-gray-50 p-5 rounded-3xl border border-gray-100">
             <div className="flex items-center gap-2 mb-4">
                <span className="text-sm">🛒</span>
                <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Resumen de tu bolsa</h3>
             </div>

             <div className="space-y-4">
              {items.map(item => {
                const precio = item.precio_oferta || item.preciooferta || item.precio || 0
                // Detectamos si es pack para el renderizado visual
                const packItems = item.oferta_productos || item.contenido
                const esPack = packItems && Array.isArray(packItems) && packItems.length > 0

                return (
                  <div key={item.id} className="flex flex-col">
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-bold text-gray-800 flex-1 leading-tight">
                        <span className="text-red-600 mr-1">{item.cantidad}x</span> {item.nombre}
                      </span>
                      <span className="text-sm font-black text-gray-900 ml-2">
                        S/ {(precio * item.cantidad).toFixed(2)}
                      </span>
                    </div>

                    {/* Renderizado condicional de items del pack */}
                    {esPack && (
                      <div className="mt-1.5 ml-2 border-l-2 border-red-200 pl-3 space-y-0.5">
                        {packItems.map((c: any, i: number) => {
                             // Adaptador visual
                             const subNombre = c.producto?.nombre || c.nombre || 'Item'
                             return (
                                <p key={i} className="text-[10px] text-gray-500 font-medium">
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

             <div className="mt-5 pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="text-xs font-bold text-gray-400 uppercase">Subtotal</span>
                <span className="text-lg font-bold text-gray-800">S/ {total.toFixed(2)}</span>
             </div>
          </div>
        </div>

        {/* BOTÓN FINAL */}
        <div className="p-8 bg-white border-t border-gray-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Total a pagar</span>
            <span className="text-3xl font-black text-gray-900 tracking-tighter">S/ {total.toFixed(2)}</span>
          </div>
          
          <button 
            onClick={handleFinalizarCompra} 
            disabled={loading || items.length === 0} 
            className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold text-sm shadow-xl shadow-green-100 hover:bg-[#20bd5a] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
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