import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import type { Producto } from '../types/Producto'
import type { ContenidoInicio } from '../types/Contenido' // <--- Importamos el tipo
import ProductCard from '../components/ProductCard'
import { obtenerProductos } from '../services/productos.service'
import { obtenerContenidoInicio } from '../services/contenido.service'
import Header from '../components/Header'
import Footer from '../components/Footer'
import QRCanal from '../components/qrcanal'
 // TypeScript infiere la extensión .tsx

function Home() {
  const [productos, setProductos] = useState<Producto[]>([])
  
  // ESTADOS TIPADOS PARA CONTENIDO DINÁMICO
  const [banners, setBanners] = useState<string[]>([])
  const [ofertasImages, setOfertasImages] = useState<string[]>([])
  const [videosOfertas, setVideosOfertas] = useState<string[]>([])

  // Estados de los carruseles (números)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [ofertas1Slide, setOfertas1Slide] = useState(0)
  const [ofertas2Slide, setOfertas2Slide] = useState(0)

  // 1. CARGA DE DATOS
  useEffect(() => {
    const cargarTodo = async () => {
      // Cargar productos
      const dataProds = await obtenerProductos()
      setProductos(dataProds || [])

      // Cargar contenidos del home desde Supabase
      const dataContenidos: ContenidoInicio[] = await obtenerContenidoInicio()
      
      if (dataContenidos.length > 0) {
        // TypeScript ahora sabe que 'c.seccion' y 'c.url' existen
        setBanners(
          dataContenidos.filter(c => c.seccion === 'banner').map(c => c.url)
        )
        setOfertasImages(
          dataContenidos.filter(c => c.seccion === 'oferta').map(c => c.url)
        )
        setVideosOfertas(
          dataContenidos.filter(c => c.seccion === 'video').map(c => c.url)
        )
      }
    }
    cargarTodo()
  }, [])

  // 2. ROTACIÓN AUTOMÁTICA DEL BANNER
  useEffect(() => {
    if (banners.length === 0) return
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length) 
    }, 5000)
    
    return () => clearInterval(interval)
  }, [banners]) // Dependencia: si cambian los banners, reinicia el timer

  // Iconos SVG (Componentes funcionales simples)
  const IconoIzquierda = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  );

  const IconoDerecha = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>PCamza | Abarrotes Mayoristas</title>
        <meta name="description" content="Ahorra comprando en Pcamza..." />
      </Helmet>

      <Header />

      {/* --- BANNER PRINCIPAL --- */}
      <section className="relative w-full">
        {banners.length > 0 ? (
          <div className="relative overflow-hidden w-full group">
            <div
              className="flex transition-transform duration-500 ease-in-out w-full"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {banners.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Banner ${idx + 1}`}
                  className="w-full flex-shrink-0 object-cover h-auto min-h-[200px] md:min-h-[400px]"
                />
              ))}
            </div>

            {/* Botones de navegación (solo si hay más de 1 imagen) */}
            {banners.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-lg transition-all z-20 opacity-0 group-hover:opacity-100"
                >
                  <IconoIzquierda />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-lg transition-all z-20 opacity-0 group-hover:opacity-100"
                >
                  <IconoDerecha />
                </button>

                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-2 rounded-full transition-all shadow-sm ${
                        currentSlide === idx ? 'bg-red-600 w-8' : 'bg-white w-2'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
           /* Placeholder mientras carga */
           <div className="w-full h-[300px] bg-gray-200 animate-pulse flex items-center justify-center text-gray-400">
             Cargando Banners...
           </div>
        )}
      </section>

      {/* --- SECCIÓN OFERTAS INCREÍBLES --- */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-[#1e3a5f] mb-8">
          ¡Ofertas increíbles!
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[450px] md:h-[500px]">
          
          {/* 1. IZQUIERDA: Carrusel de Imágenes */}
          <div className="relative bg-[#e8dcd0] rounded-3xl overflow-hidden shadow-xl h-full border-4 border-[#e8dcd0]">
            {ofertasImages.length > 0 ? (
              <div className="relative w-full h-full bg-white">
                <div
                  className="flex transition-transform duration-500 ease-in-out h-full"
                  style={{ transform: `translateX(-${ofertas1Slide * 100}%)` }}
                >
                  {ofertasImages.map((img, idx) => (
                    <div key={idx} className="flex-shrink-0 w-full h-full relative">
                      <img
                        src={img}
                        alt={`Oferta ${idx + 1}`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>

                {ofertasImages.length > 1 && (
                  <>
                    <button
                      onClick={() => setOfertas1Slide(Math.max(0, ofertas1Slide - 1))}
                      disabled={ofertas1Slide === 0}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-lg z-10 disabled:opacity-50 transition-transform hover:scale-110"
                    >
                      <IconoIzquierda />
                    </button>
                    <button
                      onClick={() => setOfertas1Slide(Math.min(ofertasImages.length - 1, ofertas1Slide + 1))}
                      disabled={ofertas1Slide >= ofertasImages.length - 1}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-lg z-10 disabled:opacity-50 transition-transform hover:scale-110"
                    >
                      <IconoDerecha />
                    </button>
                  </>
                )}
              </div>
            ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Sin ofertas disponibles
                </div>
            )}
          </div>

          {/* 2. DERECHA: Video Player (Nativo para MP4) */}
          <div className="relative bg-black rounded-3xl h-full overflow-hidden group">
             {videosOfertas.length > 0 ? (
               <>
                <div className="w-full h-full relative flex items-center justify-center">
                  <video
                    key={videosOfertas[ofertas2Slide]} 
                    src={videosOfertas[ofertas2Slide]}
                    className="w-full h-full object-contain" 
                    controls
                    autoPlay
                    muted
                    loop
                    playsInline
                  >
                    Tu navegador no soporta la reproducción de videos.
                  </video>
                </div>

                {videosOfertas.length > 1 && (
                  <>
                    <button
                      onClick={() => setOfertas2Slide(Math.max(0, ofertas2Slide - 1))}
                      disabled={ofertas2Slide === 0}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-red-600/80 hover:bg-red-700 text-white rounded-full p-3 shadow-lg z-20 disabled:opacity-0 transition-all hover:scale-110 backdrop-blur-sm"
                    >
                      <IconoIzquierda />
                    </button>
                    <button
                      onClick={() => setOfertas2Slide(Math.min(videosOfertas.length - 1, ofertas2Slide + 1))}
                      disabled={ofertas2Slide >= videosOfertas.length - 1}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-600/80 hover:bg-red-700 text-white rounded-full p-3 shadow-lg z-20 disabled:opacity-0 transition-all hover:scale-110 backdrop-blur-sm"
                    >
                      <IconoDerecha />
                    </button>
                  </>
                )}
              </>
             ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                    Sin videos disponibles
                </div>
             )}
          </div>

        </div>
      </section>

      {/* Sección de Productos y Footer (Igual que antes) */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <h2 className="text-3xl font-bold text-gray-800">
              Ofertas PECAMZA
            </h2>
             {/* ... Botones ver más ... */}
             <div className="flex gap-3">
               <a href="/ofertas" className="px-6 py-2.5 bg-red-600 text-white rounded-full font-semibold text-sm hover:bg-red-700 transition-colors shadow-md flex items-center gap-2">Ver más ofertas</a>
             </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productos.slice(0, 8).map((producto) => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
          {productos.length === 0 && (
            <div className="text-center py-12">
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

export default Home