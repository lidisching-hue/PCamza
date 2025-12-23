import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import QRCanal from '../components/qrcanal'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { ContenidoNosotros } from '../types/Contenido'
import { obtenerContenidoNosotros } from '../services/contenido.service'

// Importamos el servicio y el tipo desde tu archivo de servicios
// Ajusta la ruta '../services/contenido' según donde guardaste el archivo anterior

function QuienesSomos() {
  // --- ESTADOS ---
  const [bannerUrl, setBannerUrl] = useState<string>('')
  // Ahora el estado usa el tipo correcto 'ContenidoNosotros'
  const [contentImages, setContentImages] = useState<ContenidoNosotros[]>([])
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  // --- EFECTO: CARGAR DATOS USANDO EL SERVICIO ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Llamamos al servicio (ya no a Supabase directo)
        const data = await obtenerContenidoNosotros()

        if (data.length > 0) {
          // 1. Filtrar Banner (buscamos por seccion = 'banner')
          const banner = data.find(item => item.seccion === 'banner')
          if (banner) setBannerUrl(banner.url)

          // 2. Filtrar Imágenes Carrusel (buscamos por seccion = 'contenido')
          // El servicio ya las trae ordenadas, pero por seguridad filtramos
          const content = data.filter(item => item.seccion === 'contenido')
          setContentImages(content)
        }

      } catch (error) {
        console.error('Error en la vista QuienesSomos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // --- FUNCIONES DEL CARRUSEL ---
  const prevSlide = () => {
    const isFirstSlide = currentSlide === 0
    const newIndex = isFirstSlide ? contentImages.length - 1 : currentSlide - 1
    setCurrentSlide(newIndex)
  }

  const nextSlide = () => {
    const isLastSlide = currentSlide === contentImages.length - 1
    const newIndex = isLastSlide ? 0 : currentSlide + 1
    setCurrentSlide(newIndex)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <main className="flex-grow">
        {/* --- PORTADA / BANNER SUPERIOR --- */}
        <section className="relative bg-[#d32f2f] text-white py-20">
          <div className="absolute inset-0 overflow-hidden opacity-20">
            <img 
              src={bannerUrl || "https://img.freepik.com/foto-gratis/pasillo-supermercado-borroso_23-2148143415.jpg"} 
              alt="Fondo Supermercado" 
              className="w-full h-full object-cover transition-opacity duration-500"
            />
          </div>
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Quiénes Somos
            </h1>
            <p className="text-lg md:text-xl font-light opacity-90 max-w-2xl mx-auto">
              Comprometidos con el ahorro y bienestar de las familias peruanas.
            </p>
          </div>
        </section>

        {/* --- HISTORIA / INTRODUCCIÓN --- */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            
            {/* --- ZONA DE IMAGEN / CARRUSEL --- */}
            <div className="md:w-1/2 relative group">
              {loading ? (
                // SKELETON LOADING
                <div className="w-full h-[400px] bg-gray-200 rounded-3xl animate-pulse flex items-center justify-center">
                   <span className="text-gray-400">Cargando...</span>
                </div>
              ) : contentImages.length > 0 ? (
                // HAY IMÁGENES
                <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-xl bg-gray-100">
                  
                  {/* Imagen Actual (usamos .url en lugar de .image_url) */}
                  <img 
                    src={contentImages[currentSlide].url} 
                    alt={contentImages[currentSlide].titulo || "Historia Tienda"} 
                    className="w-full h-full object-cover duration-500 ease-in-out"
                  />

                  {/* CONTROLES (Solo si hay > 1 imagen) */}
                  {contentImages.length > 1 && (
                    <>
                      <button 
                        onClick={prevSlide}
                        className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronLeft size={24} />
                      </button>

                      <button 
                        onClick={nextSlide}
                        className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                      >
                        <ChevronRight size={24} />
                      </button>

                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {contentImages.map((_, index) => (
                          <div 
                            key={index}
                            onClick={() => setCurrentSlide(index)}
                            className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all ${currentSlide === index ? 'bg-white scale-110' : 'bg-white/50'}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                // FALLBACK DEFAULT
                <img 
                  src="https://i.postimg.cc/brLgj4dP/tienda-quienes-somos.jpg"
                  alt="Tienda Default" 
                  className="rounded-3xl shadow-xl w-full h-auto object-cover"
                />
              )}
            </div>

            {/* --- TEXTO DE HISTORIA --- */}
            <div className="md:w-1/2 text-gray-700 space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-2">
                Nuestra Historia
              </h2>
              <p className="text-lg leading-relaxed">
                Somos una cadena de supermercados peruana perteneciente al grupo <strong>PECAMZA</strong>. 
                Nacimos con el firme propósito de acercar productos de primera necesidad y gran consumo 
                a los hogares, garantizando siempre la mejor calidad y, sobre todo, <strong>precios justos</strong>.
              </p>
              <p className="text-lg leading-relaxed">
                A lo largo de los años, nos hemos consolidado como la opción preferida de miles de familias 
                que buscan maximizar su presupuesto sin sacrificar la calidad de lo que llevan a su mesa.
              </p>
            </div>
          </div>
        </section>

        {/* --- MISIÓN Y VISIÓN --- */}
        <section className="bg-white py-16 shadow-inner">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10">
              
              {/* Misión */}
              <div className="bg-red-50 rounded-3xl p-10 border border-red-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-6 shadow-lg text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Misión</h3>
                <p className="text-gray-700 leading-relaxed">
                  Ofrecer a nuestros clientes una experiencia de compra ágil y cercana, brindando un surtido variado de productos de calidad a precios bajos todos los días, contribuyendo así a mejorar la calidad de vida de las comunidades donde operamos.
                </p>
              </div>

              {/* Visión */}
              <div className="bg-blue-50 rounded-3xl p-10 border border-blue-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-16 h-16 bg-[#1e3a5f] rounded-full flex items-center justify-center mb-6 shadow-lg text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Visión</h3>
                <p className="text-gray-700 leading-relaxed">
                  Ser la cadena de supermercados líder en el formato de cercanía y ahorro en el Perú, reconocidos por nuestra eficiencia, vocación de servicio y compromiso con el desarrollo de nuestros colaboradores y la sociedad.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* --- NUESTROS VALORES --- */}
        <section className="py-20 max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">Nuestros Valores</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { titulo: 'Integridad', icon: '💎', desc: 'Actuamos con transparencia y ética.' },
              { titulo: 'Servicio', icon: '🤝', desc: 'El cliente es el centro de todo.' },
              { titulo: 'Excelencia', icon: '🚀', desc: 'Mejoramos cada día lo que hacemos.' },
              { titulo: 'Trabajo en Equipo', icon: '👥', desc: 'Juntos logramos grandes resultados.' },
            ].map((val, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-4 group-hover:bg-red-100 group-hover:scale-110 transition-all duration-300 shadow-sm">
                  {val.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-800 mb-2">{val.titulo}</h4>
                <p className="text-sm text-gray-500">{val.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <QRCanal />
      <Footer />
    </div>
  )
}

export default QuienesSomos