import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import type { Producto } from '../types/Producto'
import ProductCard from '../components/ProductCard'
import { obtenerProductos } from '../services/productos.service'
import Header from '../components/Header'
import Footer from '../components/Footer'

function Home() {
  const [productos, setProductos] = useState<Producto[]>([])
  const [currentSlide, setCurrentSlide] = useState(0)
  const [ofertas1Slide, setOfertas1Slide] = useState(0)
  const [ofertas2Slide, setOfertas2Slide] = useState(0)

  useEffect(() => {
    const cargar = async () => {
      const data = await obtenerProductos()
      setProductos(data)
    }
    cargar()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === 1 ? 0 : 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const bannerImages = [
    'https://maxiahorro.com.pe/wp-content/uploads/2025/12/PORTADA_BannerWeb_Maxi.jpg',
    'https://maxiahorro.com.pe/wp-content/uploads/2025/12/CONTRA_BannerWeb_Maxi.jpg'
  ]

  const ofertas1 = [
    'https://wongio.vtexassets.com/assets/vtex.file-manager-graphql/images/7e30fa76-1f01-4ed8-b2d8-7c490e41f6db___9e99a4b9e54d4a63fb57327cd462dcef.jpg',
    'https://wongio.vtexassets.com/assets/vtex.file-manager-graphql/images/4aa9637e-2159-4fcd-9531-f9921ce1bd05___c0d3e6cee81136b9ac387245aaaea47a.jpg',
    'https://wongio.vtexassets.com/assets/vtex.file-manager-graphql/images/cfef34ac-6959-46ec-b5cc-8a6373f2f2d0___b03d662598968f3553f1ed7c2c813cca.jpg',
    'https://wongio.vtexassets.com/assets/vtex.file-manager-graphql/images/0198c819-7e3a-4166-a5de-62092270cd24___c143c161b42736ebb1ce40db6370b150.jpg'
  ]

  // CORRECCIÓN 1: Agregamos &controls=1 para asegurar que salgan los botones
  const videosOfertas = [
    "https://player.vimeo.com/video/1148787918?autoplay=1&loop=1&autopause=0&muted=1&controls=1&title=0&byline=0&portrait=0",
    "https://player.vimeo.com/video/1148787925?autoplay=1&loop=1&autopause=0&muted=1&controls=1&title=0&byline=0&portrait=0"
  ]

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
        <meta name="description" content="Ahorra comprando en Pcamza. Las mejores ofertas en abarrotes, limpieza y productos de primera necesidad. Venta por mayor y menor en Trujillo, Perú." />
        <meta name="keywords" content="pecamza, abarrotes en Piura - Tambogrande - Las Lomas, supermercado mayorista, ofertas arroz, azucar, aceite, limpieza, trujillo, mercado mayorista" />
        <meta property="og:title" content="Pecamza | Donde comprar es ahorrar" />
        <meta property="og:description" content="Descubre nuestras ofertas increíbles en abarrotes por mayor y menor en Piura - Tambogrande - Las Lomas." />
        <meta property="og:image" content="https://i.postimg.cc/Rh0CgnHt/PCAMZALOGO.jpg" />
        <meta property="og:type" content="website" />
      </Helmet>

      <Header />

      {/* --- BANNER PRINCIPAL --- */}
      <section className="relative w-full">
        <div className="relative overflow-hidden w-full group">
          <div
            className="flex transition-transform duration-500 ease-in-out w-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {bannerImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Banner ${idx + 1}`}
                className="w-full flex-shrink-0 object-cover h-auto min-h-[200px] md:min-h-[400px]"
              />
            ))}
          </div>

          <button
            onClick={() => setCurrentSlide((prev) => (prev === 0 ? 1 : 0))}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-lg transition-all z-20 opacity-0 group-hover:opacity-100"
          >
            <IconoIzquierda />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev === 1 ? 0 : 1))}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-lg transition-all z-20 opacity-0 group-hover:opacity-100"
          >
            <IconoDerecha />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {bannerImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all shadow-sm ${
                  currentSlide === idx ? 'bg-red-600 w-8' : 'bg-white w-2'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* --- SECCIÓN OFERTAS INCREÍBLES --- */}
      <section className="py-12 px-4 max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-[#1e3a5f] mb-8">
          ¡Ofertas increíbles!
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[450px] md:h-[500px]">
          
          {/* 1. IZQUIERDA: Carrusel de Imágenes */}
          <div className="relative bg-[#e8dcd0] rounded-3xl overflow-hidden shadow-xl h-full border-4 border-[#e8dcd0]">
            <div className="relative w-full h-full bg-white">
              <div
                className="flex transition-transform duration-500 ease-in-out h-full"
                style={{ transform: `translateX(-${ofertas1Slide * 100}%)` }}
              >
                {ofertas1.map((img, idx) => (
                  <div key={idx} className="flex-shrink-0 w-full h-full relative">
                    <img
                      src={img}
                      alt={`Oferta Izquierda ${idx + 1}`}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setOfertas1Slide(Math.max(0, ofertas1Slide - 1))}
              disabled={ofertas1Slide === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-lg z-10 disabled:opacity-50 transition-transform hover:scale-110"
            >
              <IconoIzquierda />
            </button>
            <button
              onClick={() => setOfertas1Slide(Math.min(ofertas1.length - 1, ofertas1Slide + 1))}
              disabled={ofertas1Slide >= ofertas1.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white rounded-full p-3 shadow-lg z-10 disabled:opacity-50 transition-transform hover:scale-110"
            >
              <IconoDerecha />
            </button>
          </div>

          {/* 2. DERECHA: Video Player */}
          <div className="relative bg-gray-50 rounded-3xl h-full overflow-hidden group">
             
             <div className="w-full h-full relative">
               <iframe
                 key={ofertas2Slide} 
                 src={videosOfertas[ofertas2Slide]}
                 // CORRECCIÓN 2: Quité scale-[1.25] para que se vean los controles abajo
                 className="w-full h-full" 
                 frameBorder="0" 
                 allow="autoplay; fullscreen; picture-in-picture" 
                 allowFullScreen
                 title="Video Oferta"
               ></iframe>
               <div className="absolute inset-0 pointer-events-none border border-transparent"></div>
             </div>

             <button
              onClick={() => setOfertas2Slide(Math.max(0, ofertas2Slide - 1))}
              disabled={ofertas2Slide === 0}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-red-600/90 hover:bg-red-700 text-white rounded-full p-3 shadow-lg z-20 disabled:opacity-0 transition-all hover:scale-110 backdrop-blur-sm"
            >
              <IconoIzquierda />
            </button>
            <button
              onClick={() => setOfertas2Slide(Math.min(videosOfertas.length - 1, ofertas2Slide + 1))}
              disabled={ofertas2Slide >= videosOfertas.length - 1}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-600/90 hover:bg-red-700 text-white rounded-full p-3 shadow-lg z-20 disabled:opacity-0 transition-all hover:scale-110 backdrop-blur-sm"
            >
              <IconoDerecha />
            </button>
          </div>

        </div>
      </section>

      {/* Sección de Ofertas Maxiahorro */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <h2 className="text-3xl font-bold text-gray-800">
              Ofertas PECAMZA
            </h2>
            <div className="flex gap-3">
              <a href="/ofertas" className="px-6 py-2.5 bg-red-600 text-white rounded-full font-semibold text-sm hover:bg-red-700 transition-colors shadow-md flex items-center gap-2">
                Ver más ofertas
              </a>
              <a href="/catalogos" className="px-6 py-2.5 border-2 border-red-600 text-red-600 rounded-full font-semibold text-sm hover:bg-red-50 transition-colors flex items-center gap-2">
                <span>Catálogo</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                </svg>
              </a>
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

      {/* Banner de WhatsApp */}
      <section className="bg-gradient-to-r from-green-500 to-green-600 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-white">
            <div className="bg-white p-2 rounded-xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-300 flex-shrink-0">
              <img src="https://i.postimg.cc/SRdCH8jk/PCamza.png" alt="QR Canal WhatsApp" className="w-32 h-32 md:w-36 md:h-36 object-contain"/>
            </div>
            <div className="text-center md:text-left flex-1">
              <h3 className="text-3xl font-bold mb-2">¡Únete a nuestro Canal!</h3>
              <p className="text-green-100 text-lg leading-relaxed">
                Escanea el código QR con tu celular o usa el botón para unirte a nuestro canal. <br className="hidden md:block"/>
                Recibe ofertas exclusivas al instante.
              </p>
            </div>
            <div className="flex-shrink-0">
              <a href="https://whatsapp.com/channel/0029Vb9q1tJJZg46Segt7c04" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white text-green-600 hover:bg-green-50 font-bold py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 group">
                <span className="text-lg">Chatear ahora</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 transition-transform group-hover:translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home