import { useCart } from '../hooks/useCart'
import type { Producto } from '../types/Producto'

interface Props {
  producto: Producto
}

function ProductCard({ producto }: Props) {
  // 1. Extraemos todo lo necesario del hook (igual que en el Carrito)
  const { addToCart, items, increment, decrement, removeFromCart } = useCart() as any

  // 2. Lógica para detectar si este producto YA está en el carrito
  // Aseguramos que items sea un array
  const cartItems = Array.isArray(items) ? items : [];
  
  // Buscamos el item por su ID
  const itemEnCarrito = cartItems.find((item: any) => item.id === producto.id);
  const cantidad = itemEnCarrito ? (itemEnCarrito.cantidad || 1) : 0;

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
          <div className="flex items-center justify-center h-full text-gray-300 bg-gray-100">
             <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
        )}
        
        {/* Badge Oferta */}
        {producto.ofertaactiva && (
          <div className="absolute top-2 right-2 bg-red-600 text-white text-[10px] font-black px-2 py-1 rounded shadow-md animate-pulse uppercase tracking-wider">
            Oferta
          </div>
        )}
      </div>

      {/* CONTENIDO */}
      <div className="p-4 flex flex-col flex-grow">
        
        {/* 1. MARCA Y CATEGORÍA */}
        <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                {producto.categoria || 'General'}
            </span>
            {producto.marca && (
                <span className="text-[10px] font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                    {producto.marca}
                </span>
            )}
        </div>

        {/* NOMBRE */}
        <h3 className="font-bold text-gray-800 text-sm mb-1 leading-tight group-hover:text-red-600 transition-colors line-clamp-2">
          {producto.nombre}
        </h3>

        {/* 2. PRESENTACIÓN */}
        {producto.presentacion && (
             <p className="text-xs text-gray-500 mb-3">{producto.presentacion}</p>
        )}
        
        {/* PRECIO Y BOTONES (Aquí está el cambio principal) */}
        <div className="mt-auto pt-3 flex items-end justify-between border-t border-gray-50 gap-2">
          
          {/* PRECIO */}
          <div className="flex flex-col">
            {producto.ofertaactiva ? (
              <>
                <span className="text-xs text-gray-400 line-through">S/ {producto.precio.toFixed(2)}</span>
                <span className="text-lg font-black text-red-600">S/ {producto.preciooferta?.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-lg font-black text-gray-900">S/ {producto.precio.toFixed(2)}</span>
            )}
          </div>
          
          {/* --- ZONA DE BOTONES --- */}
          {cantidad > 0 ? (
            // CASO 1: EL PRODUCTO YA ESTÁ EN EL CARRITO (Mostrar controles +/-)
            <div className="flex items-center bg-gray-900 text-white rounded-full px-1 py-1 h-8 shadow-lg min-w-[80px] justify-between">
                
                {/* Botón Menos */}
                <button 
                    onClick={() => {
                        if (cantidad === 1) {
                            removeFromCart(producto.id)
                        } else {
                            decrement(producto.id)
                        }
                    }}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors"
                >
                    {/* Icono Minus o Trash */}
                    {cantidad === 1 ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                           <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                        </svg>
                    )}
                </button>

                {/* Cantidad */}
                <span className="text-xs font-bold px-1 select-none">{cantidad}</span>

                {/* Botón Más */}
                <button 
                    onClick={() => increment(producto.id)}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                       <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </button>
            </div>

          ) : (
            // CASO 2: NO ESTÁ EN CARRITO (Botón Agregar Normal)
            <button 
              onClick={() => addToCart(producto)}
              className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-lg active:scale-90"
              title="Agregar al carrito"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            </button>
          )}

        </div>
      </div>
    </div>
  )
}

export default ProductCard