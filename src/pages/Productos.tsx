import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom' // 👈 Importamos useSearchParams para leer la URL
import { supabase } from '../lib/supabase' // Usamos supabase directo para asegurar filtros
import type { Producto } from '../types/Producto'
import ProductCard from '../components/ProductCard'
import Header from '../components/Header'
import Footer from '../components/Footer'
import QRCanal from '../components/qrcanal'

function Productos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)

  // 1. OBTENER PARAMETROS DE BÚSQUEDA (?search=...)
  const [searchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || '' 

  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    setLoading(true)
    // Traemos todo el inventario activo
    const { data } = await supabase
      .from('productos')
      .select('*')
      .eq('activo', true)
      .order('created_at', { ascending: false })
      
    if (data) setProductos(data)
    setLoading(false)
  }

  // 2. LÓGICA DE FILTRADO INTELIGENTE
  const productosFiltrados = productos.filter(producto => {
    if (!searchQuery) return true // Si no hay búsqueda, mostramos todo

    const termino = searchQuery.toLowerCase()
    const precioStr = producto.precio.toString()
    const precioOfertaStr = producto.preciooferta?.toString() || ''

    return (
      // A. Buscar por Nombre
      producto.nombre.toLowerCase().includes(termino) ||
      
      // B. Buscar por Descripción
      (producto.descripcion && producto.descripcion.toLowerCase().includes(termino)) ||
      
      // C. Buscar por Precio
      precioStr.includes(termino) ||
      precioOfertaStr.includes(termino) ||

      // D. Buscar palabra "oferta"
      (termino === 'oferta' && producto.ofertaactiva)
    )
  })

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      {/* --- SECCIÓN PRODUCTOS --- */}
      <section className="bg-white py-12 min-h-[500px]">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* HEADER DE LA SECCIÓN */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 border-b border-gray-100 pb-6">
            <div>
                {/* 3. TÍTULO DINÁMICO SEGÚN BÚSQUEDA */}
                {searchQuery ? (
                    <>
                        <h2 className="text-3xl font-bold text-gray-800">
                           Resultados para: <span className="text-red-600">"{searchQuery}"</span>
                        </h2>
                        <p className="text-gray-500 mt-2">Encontramos {productosFiltrados.length} coincidencias</p>
                    </>
                ) : (
                    <>
                        <h2 className="text-3xl font-bold text-gray-800">Nuestros Productos</h2>
                        <p className="text-gray-500 mt-2">Encuentra todo lo que necesitas al mejor precio</p>
                    </>
                )}
            </div>
            
            <div className="flex gap-3">
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

          {/* ESTADO DE CARGA */}
          {loading && (
             <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
             </div>
          )}

          {/* GRID DE PRODUCTOS (Filtrados) */}
          {!loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {productosFiltrados.map((producto) => (
                  <ProductCard key={producto.id} producto={producto} />
                ))}
              </div>
          )}

          {/* MENSAJE DE VACÍO O SIN RESULTADOS */}
          {!loading && productosFiltrados.length === 0 && (
            <div className="text-center py-20 bg-gray-50 rounded-xl mt-4 border border-gray-100">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-700">No encontramos resultados</h3>
              <p className="text-gray-500 mt-2">Intenta buscar con otras palabras o revisa la ortografía.</p>
              
              {searchQuery && (
                  <button 
                    onClick={() => window.location.href='/productos'} 
                    className="mt-6 text-red-600 font-bold hover:underline"
                  >
                    Ver todos los productos
                  </button>
              )}
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