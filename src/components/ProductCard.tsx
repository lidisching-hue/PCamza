import { useState } from 'react'
import { useCart } from '../hooks/useCart'
import type { Producto } from '../types/Producto'

interface Props {
  producto: Producto
}

function ProductCard({ producto }: Props) {
  const { addToCart, items, increment, decrement } = useCart() as any
  
  // --- NUEVO: Estado para saber si el usuario elige Unidad o Caja ---
  const [tipoVenta, setTipoVenta] = useState<'unidad' | 'caja'>('unidad')

  const cartItems = Array.isArray(items) ? items : []
  
  // EL TRUCO: Si elige caja, le inventamos un ID temporal para que el carrito no lo mezcle con las unidades sueltas.
  const currentId = tipoVenta === 'caja' ? `${producto.id}_caja` : producto.id
  
  // Buscamos si ESTA versión (Unidad o Caja) ya está agregada al carrito
  const itemEnCarrito = cartItems.find((item: any) => item.id === currentId)
  const cantidad = itemEnCarrito ? (itemEnCarrito.cantidad || 1) : 0

  // Precios dinámicos (Cambian si tocas Unidad o Caja)
  const precioMostrar = tipoVenta === 'caja' 
      ? producto.precio_caja 
      : (producto.ofertaactiva ? producto.preciooferta : producto.precio)
      
  const precioTachado = tipoVenta === 'caja' 
      ? null 
      : (producto.ofertaactiva ? producto.precio : null)

  // --- FUNCIÓN DE AGREGAR AL CARRITO ---
  const handleAddToCart = () => {
    if (tipoVenta === 'caja') {
        // Le pasamos un clon modificado para que WhatsApp y el Carrito lo lean como una Caja
        const productoCaja = {
            ...producto,
            id: currentId,
            nombre: `${producto.nombre} (Caja x${producto.unidades_por_caja})`,
            precio: producto.precio_caja,
            ofertaactiva: false, 
            preciooferta: null
        }
        addToCart(productoCaja)
    } else {
        // Agrega normal
        addToCart(producto)
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 flex flex-col h-full">
      
      {/* IMAGEN */}
      <div className="relative aspect-square overflow-hidden bg-gray-50 p-4">
        {producto.imagen_url ? (
          <img 
            src={producto.imagen_url} 
            alt={producto.nombre} 
            className="w-full h-full object-contain mix-blend-multiply transform group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">Sin foto</div>
        )}
        
        {/* Etiquetas Superiores */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {producto.ofertaactiva && tipoVenta === 'unidad' && (
              <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase shadow-sm">Oferta</span>
            )}
            {/* Solo mostramos la etiqueta de "Por Caja" si el producto tiene esa opción en la BD */}
            {producto.precio_caja && (
              <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase shadow-sm">Venta x Caja</span>
            )}
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="p-4 flex-1 flex flex-col relative z-20 bg-white">
        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 flex justify-between">
            <span className="truncate pr-2">{producto.categoria || 'Cat.'}</span>
            <span className="text-red-600 flex-shrink-0">{producto.marca}</span>
        </div>
        
        <h3 className="font-bold text-slate-800 text-sm leading-tight mb-2 line-clamp-2">
          {producto.nombre} {producto.presentacion && `- ${producto.presentacion}`}
        </h3>
        
        <div className="mt-auto space-y-3">
            
            {/* --- NUEVO: SELECTOR DE UNIDAD / CAJA --- */}
            {/* Solo aparece si desde el Panel de Admin le pusiste Precio de Caja */}
            {producto.precio_caja && producto.unidades_por_caja && (
               <div className="flex bg-gray-100 p-1 rounded-lg">
                   <button 
                      onClick={() => setTipoVenta('unidad')}
                      className={`flex-1 text-[10px] sm:text-xs font-bold py-1.5 rounded-md transition-all ${tipoVenta === 'unidad' ? 'bg-white shadow-sm text-slate-900 border border-gray-200' : 'text-gray-500 hover:text-gray-700'}`}
                   >
                      Unidad
                   </button>
                   <button 
                      onClick={() => setTipoVenta('caja')}
                      className={`flex-1 text-[10px] sm:text-xs font-bold py-1.5 rounded-md transition-all ${tipoVenta === 'caja' ? 'bg-white shadow-sm text-blue-700 border border-blue-200' : 'text-gray-500 hover:text-gray-700'}`}
                   >
                      Caja x{producto.unidades_por_caja}
                   </button>
               </div>
            )}
            {/* -------------------------------------- */}

            <div className="flex items-center justify-between">
                <div className="flex flex-col">
                    <span className="font-black text-lg text-slate-900 leading-none">
                      S/ {Number(precioMostrar).toFixed(2)}
                    </span>
                    {precioTachado && (
                       <span className="text-[10px] text-gray-400 line-through font-medium mt-0.5">
                         S/ {Number(precioTachado).toFixed(2)}
                       </span>
                    )}
                </div>
                
                {/* BOTONES DE AGREGAR (Mantuve tu estilo de fondo negro con hover rojo) */}
                {cantidad > 0 ? (
                    <div className="flex items-center gap-2 bg-gray-900 text-white rounded-full p-1 shadow-lg">
                        <button 
                            onClick={() => decrement(currentId)} 
                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                               <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                            </svg>
                        </button>
                        <span className="text-xs font-bold px-1 select-none">{cantidad}</span>
                        <button 
                            onClick={() => increment(currentId)} 
                            className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                               <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <button 
                        onClick={handleAddToCart} 
                        className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-lg active:scale-90"
                        title={`Agregar ${tipoVenta} al carrito`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </button>
                )}
            </div>
        </div>

      </div>
    </div>
  )
}

export default ProductCard