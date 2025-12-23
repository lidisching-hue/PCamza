import type { Producto } from '../types/Producto'
import { useCart } from '../hooks/useCart'

interface Props {
  producto: Producto
}

function ProductCard({ producto }: Props) {
  const { addToCart } = useCart()

  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden relative">

      {producto.ofertaactiva && (
        <div className="absolute top-3 left-3 z-10 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
          ⭐ OFERTA
        </div>
      )}

      <div className="w-full aspect-square bg-gray-100 flex items-center justify-center">
        {producto.imagen_url ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="max-h-full max-w-full object-contain p-2"
          />
        ) : (
          <span className="text-gray-400 text-sm">
            Sin imagen
          </span>
        )}
      </div>

      <div className="p-4">
        <h2 className="font-semibold text-lg text-gray-800 line-clamp-2">
          {producto.nombre}
        </h2>

        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
          {producto.descripcion}
        </p>

        <div className="mt-3">
          {producto.ofertaactiva ? (
            <div className="flex items-center gap-2">
              <span className="text-sm line-through text-gray-400">
                S/ {producto.precio}
              </span>
              <span className="text-xl font-bold text-red-600">
                S/ {producto.preciooferta}
              </span>
            </div>
          ) : (
            <span className="text-xl font-bold text-green-600">
              S/ {producto.precio}
            </span>
          )}
        </div>

        <button
          onClick={() => addToCart(producto)}
          className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition"
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  )
}

export default ProductCard
