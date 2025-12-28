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
  const [searchParams] = useSearchParams()
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

  // 2. EXTRAER CATEGORÍAS ÚNICAS AUTOMÁTICAMENTE
  // Esto revisa todos tus productos y crea una lista limpia de categorías disponibles
  const categorias = useMemo(() => {
    const cats = new Set(productos.map(p => p.categoria).filter(Boolean))
    return ['Todas', ...Array.from(cats)].sort()
  }, [productos])

  // 3. LÓGICA DE FILTRADO (Busqueda + Categoría)
  const productosFiltrados = productos.filter(producto => {
    // A. Filtro por Categoría
    const coincideCategoria = 
        categoriaSeleccionada === 'Todas' || 
        producto.categoria === categoriaSeleccionada

    if (!coincideCategoria) return false

    // B. Filtro por Buscador (Texto)
    if (!searchQuery) return true 

    const termino = searchQuery.toLowerCase()
    const precioStr = producto.precio.toString()
    
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

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <Header />

      {/* --- SECCIÓN PRINCIPAL CON LAYOUT DE 2 COLUMNAS --- */}
      <section className="bg-white py-8 min-h-[600px]">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* HEADER DE LA PÁGINA */}
          <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-gray-100 pb-6 gap-4">
            <div>
               <h2 className="text-3xl font-bold text-gray-800">Nuestros Productos</h2>
               {searchQuery && (
                 <p className="text-sm text-red-600 font-medium mt-1">
                   Resultados para "{searchQuery}"
                 </p>
               )}
            </div>
            
            <Link
                to="/catalogos"
                className="hidden md:flex px-6 py-2.5 border border-gray-200 text-gray-700 rounded-full font-semibold text-sm hover:bg-gray-50 hover:border-red-200 transition-colors items-center gap-2"
              >
                <span>Ver Catálogo de Ofertas</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* --- COLUMNA IZQUIERDA: MENÚ DE CATEGORÍAS --- */}
            {/* En móvil se ve como scroll horizontal, en PC como barra lateral */}
            <aside className="w-full lg:w-64 flex-shrink-0">
                <div className="sticky top-24">
                    <h3 className="font-bold text-gray-900 mb-4 px-1 hidden lg:block">Categorías</h3>
                    
                    {/* Contenedor Scrollable para Móviles / Lista Vertical para PC */}
                    <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-4 lg:pb-0 no-scrollbar">
                        {categorias.map((cat: any) => (
                            <button
                                key={cat}
                                onClick={() => setCategoriaSeleccionada(cat)}
                                className={`
                                    whitespace-nowrap px-4 py-2.5 rounded-lg text-sm font-medium transition-all text-left flex justify-between items-center group
                                    ${categoriaSeleccionada === cat 
                                        ? 'bg-red-600 text-white shadow-md shadow-red-200' 
                                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                                `}
                            >
                                <span>{cat}</span>
                                {/* Contador de productos (Opcional) */}
                                {cat !== 'Todas' && (
                                    <span className={`text-[10px] ml-2 px-2 py-0.5 rounded-full ${categoriaSeleccionada === cat ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-500 group-hover:bg-gray-300'}`}>
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
                
                {/* Header pequeño de la grilla */}
                <div className="flex justify-between items-center mb-6">
                    <span className="text-gray-500 text-sm">Mostrando <strong>{productosFiltrados.length}</strong> productos</span>
                    {/* Aquí podrías poner un ordenar por precio en el futuro */}
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
                    </div>
                ) : (
                    <>
                        {productosFiltrados.length > 0 ? (
                             <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6">
                                {productosFiltrados.map((producto) => (
                                    <ProductCard key={producto.id} producto={producto} />
                                ))}
                             </div>
                        ) : (
                            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <div className="text-4xl mb-3">🔍</div>
                                <h3 className="text-gray-900 font-bold">No se encontraron productos</h3>
                                <p className="text-gray-500 text-sm mt-1">
                                    No hay resultados en la categoría <span className="font-bold text-red-500">"{categoriaSeleccionada}"</span> con tu búsqueda.
                                </p>
                                <button 
                                    onClick={() => {setCategoriaSeleccionada('Todas'); window.history.replaceState(null, '', '/productos')}}
                                    className="mt-4 text-red-600 text-sm font-bold hover:underline"
                                >
                                    Limpiar filtros
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