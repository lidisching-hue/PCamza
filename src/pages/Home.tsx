import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'

// Tipos
import type { Producto } from '../types/Producto'
import type { ContenidoHome } from '../types/Contenido' 

// Componentes
import ProductCard from '../components/ProductCard'
import Header from '../components/Header'
import Footer from '../components/Footer'
import QRCanal from '../components/qrcanal'

// Servicios
import { obtenerProductos } from '../services/productos.service'
import { obtenerContenidoHome } from '../services/contenido.service' 

function Home() {
  const [productos, setProductos] = useState<Producto[]>([])
  
  // ESTADOS PARA CONTENIDO DINÁMICO
  const [banners, setBanners] = useState<string[]>([])
  const [ofertasImages, setOfertasImages] = useState<string[]>([])
  const [videosOfertas, setVideosOfertas] = useState<string[]>([])

  // Estados de los carruseles (índices)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [ofertas1Slide, setOfertas1Slide] = useState(0)
  const [ofertas2Slide, setOfertas2Slide] = useState(0)

  // 1. CARGA DE DATOS
  useEffect(() => {
    const cargarTodo = async () => {
      // A. Cargar productos
      const dataProds = await obtenerProductos()
      setProductos(dataProds || [])

      // B. Cargar contenidos del home
      const dataContenidos: ContenidoHome[] = await obtenerContenidoHome() 
      
      if (dataContenidos.length > 0) {
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
  }, [banners])

  // Iconos SVG
  const IconoIzquierda = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
  );

  const IconoDerecha = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <Helmet>
        <title>PCamza | Abarrotes Mayoristas</title>
        <meta name="description" content="Ahorra comprando en Pcamza..." />
      </Helmet>

      <Header />

      {/* --- BANNER PRINCIPAL --- */}
      <section className="relative w-full">
        {banners.length > 0 ? (
          // ⬇️ RESPONSIVE: Altura dinámica según dispositivo
          <div className="relative w-full h-[180px] sm:h-[300px] md:h-[450px] lg:h-[550px] group">
            
            {/* Contenedor del Slide */}
            <div className="overflow-hidden w-full h-full">
                <div
                className="flex transition-transform duration-500 ease-in-out w-full h-full"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                {banners.map((img, idx) => (
                    <div key={idx} className="w-full h-full flex-shrink-0">
                        <img
                        src={img}
                        alt={`Banner ${idx + 1}`}
                        className="w-full h-full object-fill" 
                        />
                    </div>
                ))}
                </div>
            </div>

            {/* Navegación Banner */}
            {banners.length > 1 && (
              <>
                {/* Botones laterales (Ocultos en móvil muy pequeño si se desea, o ajustados) */}
                <button
                  onClick={() => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)}
                  className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-red-600/90 hover:bg-red-700 text-white rounded-full p-2 md:p-3 shadow-lg transition-all z-20 opacity-0 group-hover:opacity-100"
                >
                  <IconoIzquierda />
                </button>
                <button
                  onClick={() => setCurrentSlide((prev) => (prev + 1) % banners.length)}
                  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-red-600/90 hover:bg-red-700 text-white rounded-full p-2 md:p-3 shadow-lg transition-all z-20 opacity-0 group-hover:opacity-100"
                >
                  <IconoDerecha />
                </button>

                {/* Indicadores inferiores */}
                <div className="absolute bottom-2 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`h-1.5 md:h-2 rounded-full transition-all shadow-sm ${
                        currentSlide === idx ? 'bg-red-600 w-6 md:w-8' : 'bg-white/80 w-1.5 md:w-2'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        ) : (
           <div className="w-full h-[180px] md:h-[450px] bg-gray-200 animate-pulse flex items-center justify-center text-gray-400">
             Cargando Banners...
           </div>
        )}
      </section>

      {/* --- SECCIÓN OFERTAS INCREÍBLES --- */}
      <section className="py-8 md:py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-center text-[#1e3a5f] mb-6 md:mb-8">
          ¡Ofertas increíbles!
        </h2>

        {/* ⬇️ RESPONSIVE LAYOUT:
            - Móvil: h-auto (altura flexible) y grid-cols-1 (uno debajo del otro)
            - Desktop: h-[500px] (altura fija) y grid-cols-2 (lado a lado)
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 h-auto md:h-[500px]">
          
          {/* 1. IZQUIERDA: Carrusel de Imágenes */}
          {/* En móvil tiene altura fija (300px), en desktop llena el padre (h-full) */}
          <div className="relative bg-[#e8dcd0] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl h-[300px] md:h-full border-4 border-[#e8dcd0]">
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
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 md:p-3 shadow-lg z-10 disabled:opacity-50 transition-transform hover:scale-110"
                    >
                      <IconoIzquierda />
                    </button>
                    <button
                      onClick={() => setOfertas1Slide(Math.min(ofertasImages.length - 1, ofertas1Slide + 1))}
                      disabled={ofertas1Slide >= ofertasImages.length - 1}
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white rounded-full p-2 md:p-3 shadow-lg z-10 disabled:opacity-50 transition-transform hover:scale-110"
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

          {/* 2. DERECHA: Video Player */}
          {/* En móvil tiene altura fija (300px), en desktop llena el padre (h-full) */}
          <div className="relative bg-black rounded-2xl md:rounded-3xl h-[300px] md:h-full overflow-hidden group">
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
                      className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-red-600/80 hover:bg-red-700 text-white rounded-full p-2 md:p-3 shadow-lg z-20 disabled:opacity-0 transition-all hover:scale-110 backdrop-blur-sm"
                    >
                      <IconoIzquierda />
                    </button>
                    <button
                      onClick={() => setOfertas2Slide(Math.min(videosOfertas.length - 1, ofertas2Slide + 1))}
                      disabled={ofertas2Slide >= videosOfertas.length - 1}
                      className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-red-600/80 hover:bg-red-700 text-white rounded-full p-2 md:p-3 shadow-lg z-20 disabled:opacity-0 transition-all hover:scale-110 backdrop-blur-sm"
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

      {/* Sección Productos */}
      <section className="bg-white py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-10 gap-4">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center md:text-left">
              Productos Pcamza
            </h2>
             <div className="flex gap-3">
               <a href="/catalogos" className="px-5 py-2 md:px-6 md:py-2.5 bg-red-600 text-white rounded-full font-semibold text-sm hover:bg-red-700 transition-colors shadow-md flex items-center gap-2">
                 Ver más ofertas
               </a>
             </div>
          </div>
          
          {/* ⬇️ RESPONSIVE GRID:
             - gap-3 en móvil (espacio ajustado)
             - gap-6 en escritorio (espacio normal)
          */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
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