import { useEffect, useState, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Producto } from '../types/Producto'
import ProductCard from '../components/ProductCard'
import Header from '../components/Header'
import Footer from '../components/Footer'
import QRCanal from '../components/qrcanal'

function Productos() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string>('Todas')

  // 1. OBTENER PARAMETROS DE BÚSQUEDA
  const [searchParams, setSearchParams] = useSearchParams()
  const searchQuery = searchParams.get('search') || '' 

  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('productos')
      .select('*')
      .eq('activo', true)
      .order('created_at', { ascending: false })
      
    if (data) setProductos(data)
    setLoading(false)
  }

  // 2. EXTRAER CATEGORÍAS ÚNICAS
  const categorias = useMemo(() => {
    const cats = new Set(productos.map(p => p.categoria).filter(Boolean))
    return ['Todas', ...Array.from(cats)].sort()
  }, [productos])

  // 3. LÓGICA DE FILTRADO
  const productosFiltrados = productos.filter(producto => {
    // A. Filtro por Categoría
    const coincideCategoria = 
        categoriaSeleccionada === 'Todas' || 
        producto.categoria === categoriaSeleccionada

    if (!coincideCategoria) return false

    // B. Filtro por Buscador
    if (!searchQuery) return true 

    const termino = searchQuery.toLowerCase()
    // Convertimos precio a string para buscar por número
    const precioStr = producto.precio?.toString() || ''
    
    // Validamos que los campos existan antes de usar toLowerCase()
    const nombre = producto.nombre?.toLowerCase() || ''
    const descripcion = producto.descripcion?.toLowerCase() || ''
    const marca = producto.marca?.toLowerCase() || ''
    const categoria = producto.categoria?.toLowerCase() || ''
    const presentacion = producto.presentacion?.toLowerCase() || ''

    return (
      nombre.includes(termino) ||
      descripcion.includes(termino) ||
      marca.includes(termino) ||
      categoria.includes(termino) ||
      presentacion.includes(termino) ||
      precioStr.includes(termino) ||
      (termino === 'oferta' && producto.ofertaactiva)
    )
  })

  // Función para limpiar filtros
  const limpiarFiltros = () => {
    setCategoriaSeleccionada('Todas')
    setSearchParams({}) // Esto limpia el ?search= de la URL
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Header />

      {/* --- SECCIÓN PRINCIPAL --- */}
      <section className="bg-white py-6 md:py-8 flex-grow min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* HEADER DE LA PÁGINA */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 md:mb-8 border-b border-gray-100 pb-4 md:pb-6 gap-4">
            <div>
               <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Nuestros Productos</h2>
               {searchQuery && (
                 <div className="flex items-center gap-2 mt-2">
                    <p className="text-sm text-gray-600 font-medium">
                        Resultados para: <span className="text-red-600 font-bold">"{searchQuery}"</span>
                    </p>
                    <button onClick={limpiarFiltros} className="text-xs text-gray-400 underline hover:text-red-500">
                        (Limpiar)
                    </button>
                 </div>
               )}
            </div>
            
            <Link
                to="/catalogos"
                className="hidden md:flex px-5 py-2 border border-gray-200 text-gray-700 rounded-full font-semibold text-sm hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors items-center gap-2"
              >
                <span>Ver Catálogo de Ofertas</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            
            {/* --- COLUMNA IZQUIERDA: MENÚ DE CATEGORÍAS --- */}
            {/* Móvil: Scroll Horizontal | Desktop: Sidebar Vertical */}
            <aside className="w-full lg:w-64 flex-shrink-0">
                <div className="sticky top-24">
                    <h3 className="font-bold text-gray-900 mb-3 px-1 hidden lg:block uppercase text-xs tracking-wider">Categorías</h3>
                    
                    <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0 scrollbar-hide">
                        {categorias.map((cat: any) => (
                            <button
                                key={cat}
                                onClick={() => setCategoriaSeleccionada(cat)}
                                className={`
                                    whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all text-left flex justify-between items-center group border lg:border-none
                                    ${categoriaSeleccionada === cat 
                                        ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-200' 
                                        : 'bg-white lg:bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100 hover:text-gray-900'}
                                `}
                            >
                                <span>{cat}</span>
                                {/* Contador (Solo visible en desktop para no saturar móvil) */}
                                {cat !== 'Todas' && (
                                    <span className={`hidden lg:inline-block text-[10px] ml-2 px-2 py-0.5 rounded-full ${categoriaSeleccionada === cat ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500 group-hover:bg-gray-300'}`}>
                                        {productos.filter(p => p.categoria === cat).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </aside>

            {/* --- COLUMNA DERECHA: GRID DE PRODUCTOS --- */}
            <div className="flex-1">
                
                {/* Info pequeña sobre resultados */}
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500 text-xs md:text-sm">Mostrando <strong>{productosFiltrados.length}</strong> productos</span>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-red-600"></div>
                    </div>
                ) : (
                    <>
                        {productosFiltrados.length > 0 ? (
                             // Grid: 2 columnas en móvil, 3 en Tablet, 3 o 4 en Desktop
                             <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6">
                                {productosFiltrados.map((producto) => (
                                    <ProductCard key={producto.id} producto={producto} />
                                ))}
                             </div>
                        ) : (
                            // Estado Vacío (Empty State)
                            <div className="text-center py-16 md:py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <div className="text-4xl md:text-5xl mb-3 opacity-50">🔍</div>
                                <h3 className="text-gray-900 font-bold text-lg">No encontramos lo que buscas</h3>
                                <p className="text-gray-500 text-sm mt-1 max-w-xs mx-auto">
                                    No hay resultados en <span className="font-bold text-gray-700">"{categoriaSeleccionada}"</span> para tu búsqueda.
                                </p>
                                <button 
                                    onClick={limpiarFiltros}
                                    className="mt-6 px-6 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-full hover:bg-gray-50 hover:text-red-600 transition-colors shadow-sm"
                                >
                                    Limpiar todos los filtros
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

          </div>
        </div>
      </section>
      
      <QRCanal />
      <Footer />
    </div>
  )
}

export default Productos