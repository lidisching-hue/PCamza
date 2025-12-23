import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Producto } from '../types/Producto'
import ProductCard from '../components/ProductCard'
import { obtenerProductos } from '../services/productos.service'
import Header from '../components/Header'
import Footer from '../components/Footer'
import QRCanal from '../components/qrcanal'

function Productos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [] = useState(0)

  useEffect(() => {
    const cargar = async () => {
      const data = await obtenerProductos()
      setProductos(data)
    }
    cargar()
  }, [])



  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

     

      {/* --- SECCIÓN PRODUCTOS MERKAT / PECAMZA --- */}
      <section className="bg-white py-12 min-h-[500px]">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Header de la sección (Limpio, solo botón Catálogo) */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b border-gray-100 pb-6">
            <div>
                <h2 className="text-3xl font-bold text-gray-800">
                Nuestros Productos
                </h2>
                <p className="text-gray-500 mt-2">Encuentra todo lo que necesitas al mejor precio</p>
            </div>
            
            <div className="flex gap-3">
               {/* Solo dejamos el botón del Catálogo como pediste */}
              <Link
                to="/catalogos"
                className="px-6 py-2.5 border-2 border-red-600 text-red-600 rounded-full font-semibold text-sm hover:bg-red-50 transition-colors flex items-center gap-2"
              >
                <span>Ver Catálogo Digital</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Grid de Productos (SIN .slice, muestra todos) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productos.map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>

          {/* Mensaje de carga / vacío */}
          {productos.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-xl mt-4">
              <div className="text-4xl mb-3">🛒</div>
              <p className="text-gray-500 text-lg">Cargando productos...</p>
            </div>
          )}
        </div>
      </section>
      <QRCanal />
      <Footer />
    </div>
  )
}

export default Productos