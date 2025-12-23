
/**
 * NOTA: Para que el Canvas pueda mostrar el diseño, he comentado las rutas locales.
 * Descoméntalas en tu proyecto real.
 */

import { useCart } from '../hooks/useCart'
import { useNavigate } from 'react-router-dom'



function CarritoLateral() {
  const { items, increment, decrement, removeFromCart, clearCart } = useCart()
  const navigate = useNavigate()

  // 🧮 Total general
  const total = items.reduce((acc, item) => {
    const precioUnitario =
      item.ofertaactiva && item.preciooferta
        ? item.preciooferta
        : item.precio

    return acc + precioUnitario * item.cantidad
  }, 0)

  return (
    /* Fondo fijo que no bloquea eventos del mouse en las zonas vacías 
       gracias a pointer-events-none 
    */
    <div className="fixed inset-0 z-[9998] flex justify-end pointer-events-none">
      
      {/* Overlay: Oscurece ligeramente y permite cerrar al hacer click */}
      <div 
        className="absolute inset-0 bg-black/25 backdrop-blur-[1px] transition-opacity pointer-events-auto"
        onClick={() => navigate(-1)}
      ></div>

      {/* Panel Lateral (Carrito) */}
      <div className="relative bg-white w-full max-w-md h-full shadow-[0_0_50px_rgba(0,0,0,0.15)] flex flex-col transform transition-transform animate-in slide-in-from-right duration-300 pointer-events-auto">
        
        {/* Cabecera del Panel */}
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Tu Carrito</h1>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
              {items.length} {items.length === 1 ? 'ítem' : 'ítems'} seleccionados
            </p>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-black hover:bg-gray-100 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Lista de productos */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6 opacity-60">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                 <span className="text-3xl">🛍️</span>
              </div>
              <p className="text-gray-500 font-bold text-sm">Tu bolsa está vacía</p>
              <button 
                onClick={() => navigate('/')}
                className="mt-3 text-xs text-blue-600 font-black uppercase tracking-widest hover:text-blue-800 transition-colors"
              >
                Ir a la tienda
              </button>
            </div>
          ) : (
            items.map(item => {
              const precioUnitario = item.ofertaactiva && item.preciooferta ? item.preciooferta : item.precio
              
              return (
                <div
                  key={item.id}
                  className="flex gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm hover:border-gray-200 transition-all group"
                >
                  {/* Imagen */}
                  <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-50">
                    {item.imagen_url ? (
                      <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300 font-bold bg-gray-50">SIN FOTO</div>
                    )}
                  </div>

                  {/* Info y Controles */}
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex justify-between items-start">
                      <h2 className="font-bold text-gray-800 text-sm leading-tight line-clamp-2 pr-2">{item.nombre}</h2>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-black font-black text-sm">S/ {precioUnitario.toFixed(2)}</p>
                      
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-2 py-1 border border-gray-100">
                        <button
                          onClick={() => decrement(item.id)}
                          className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-black font-bold"
                        >
                          −
                        </button>
                        <span className="text-xs font-black text-gray-800 w-3 text-center">{item.cantidad}</span>
                        <button
                          onClick={() => increment(item.id)}
                          className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-black font-bold"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-15px_40px_rgba(0,0,0,0.04)]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">Total Estimado</span>
              <span className="text-2xl font-black text-gray-900 tracking-tighter">
                S/ {total.toFixed(2)}
              </span>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full py-4 rounded-2xl bg-black text-white font-bold text-sm hover:bg-gray-800 transition-all transform active:scale-[0.98] shadow-xl shadow-gray-200 flex items-center justify-center gap-2"
              >
                Ir al Checkout
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
              
              <button
                onClick={clearCart}
                className="w-full text-[10px] text-gray-400 font-bold hover:text-red-500 transition-colors uppercase tracking-widest"
              >
                Limpiar todo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CarritoLateral