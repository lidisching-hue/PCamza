import { useCart } from '../hooks/useCart'
import type { Producto } from '../types/Producto'

interface Props {
  producto: Producto
}

function ProductCard({ producto }: Props) {
  const { addToCart } = useCart()

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
        
        {/* 1. MARCA Y CATEGORÍA (NUEVO) */}
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

        {/* 2. PRESENTACIÓN (NUEVO) */}
        {producto.presentacion && (
             <p className="text-xs text-gray-500 mb-3">{producto.presentacion}</p>
        )}
        
        {/* PRECIO Y BOTÓN (Al final para alinear siempre abajo) */}
        <div className="mt-auto pt-3 flex items-end justify-between border-t border-gray-50">
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
          
          <button 
            onClick={() => addToCart(producto)}
            className="bg-gray-900 text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-red-600 transition-all shadow-lg active:scale-90"
            title="Agregar al carrito"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard