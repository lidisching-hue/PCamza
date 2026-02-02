import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import QRCanal from '../components/qrcanal'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'

// 1. Interfaz de datos
interface DataNosotros {
  id: number
  seccion: string
  subseccion: string | null
  tipo: string | null
  titulo: string | null
  contenido: string | null
  imagen_url: string | null
  orden: number
}

function QuienesSomos() {
  // --- ESTADOS ---
  const [data, setData] = useState<DataNosotros[]>([])
  const [loadingData, setLoadingData] = useState<boolean>(true)
  const [currentSlide, setCurrentSlide] = useState<number>(0)

  // --- EFECTO: CARGAR DATOS ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingData(true)
        const { data: result, error } = await supabase
          .from('contenido_nosotros')
          .select('*')
          .order('orden', { ascending: true })

        if (error) throw error
        if (result) setData(result)

      } catch (error) {
        console.error('Error cargando datos:', error)
      } finally {
        setLoadingData(false)
      }
    }
    fetchData()
  }, [])

  // --- HELPERS ---
  const getSection = (seccion: string) => data.filter(item => item.seccion === seccion)
  const getOne = (seccion: string, subseccion: string) => data.find(item => item.seccion === seccion && item.subseccion === subseccion)

  // Datos procesados
  const portada = getOne('portada', 'banner_principal')
  const historiaTitulo = getOne('historia', 'titulo_principal')
  const historiaParrafos = getSection('historia').filter(item => item.tipo === 'parrafo')
  const carrusel = getSection('carrusel_historia')
  const mision = getOne('mision_vision', 'mision')
  const vision = getOne('mision_vision', 'vision')
  const valores = getSection('valores')

  // --- LOGICA CARRUSEL ---
  const prevSlide = () => {
    if (carrusel.length === 0) return
    const isFirstSlide = currentSlide === 0
    setCurrentSlide(isFirstSlide ? carrusel.length - 1 : currentSlide - 1)
  }

  const nextSlide = () => {
    if (carrusel.length === 0) return
    const isLastSlide = currentSlide === carrusel.length - 1
    setCurrentSlide(isLastSlide ? 0 : currentSlide + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <main className="flex-grow">
        
        {/* --- 1. PORTADA / BANNER RESPONSIVE --- */}
        {/* Móvil: 250px alto, Escritorio: 400px alto */}
        <div className="relative w-full h-[250px] md:h-[400px] group bg-gray-200">
            {loadingData ? (
               <div className="w-full h-full animate-pulse bg-gray-300"></div>
            ) : (
               <>
                 <img 
                   src={portada?.imagen_url || ''} 
                   className="w-full h-full object-cover object-center block animate-fadeIn" 
                   alt="Banner Quiénes Somos" 
                 />

                 <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-center px-4">
                     {/* Texto escala de 3xl a 5xl */}
                     <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-2 md:mb-3 drop-shadow-lg tracking-tight">
                        {portada?.titulo || 'Quiénes Somos'}
                     </h1>
                     <p className="text-base sm:text-lg md:text-xl text-white font-medium max-w-xl md:max-w-2xl drop-shadow-md">
                        {portada?.contenido || ''}
                     </p>
                 </div>
               </>
            )}
        </div>

        {/* --- 2. HISTORIA --- */}
        <section className="py-10 md:py-16 px-4 max-w-7xl mx-auto">
          {/* Flex-col en móvil (uno debajo del otro), Flex-row en escritorio (lado a lado) */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8 md:gap-12">
            
            {/* Carrusel */}
            <div className="w-full md:w-1/2 relative group">
              {loadingData ? (
                 <div className="w-full h-[250px] md:h-[400px] bg-gray-200 animate-pulse rounded-2xl md:rounded-3xl"></div>
              ) : carrusel.length > 0 ? (
                <div className="relative w-full h-[250px] md:h-[400px] rounded-2xl md:rounded-3xl overflow-hidden shadow-lg bg-white border border-gray-100">
                  <img 
                    src={carrusel[currentSlide]?.imagen_url || ''} 
                    alt="Historia Slide" 
                    className="w-full h-full object-cover transition-transform duration-700"
                  />
                  {/* Flechas de navegación */}
                  {carrusel.length > 1 && (
                    <>
                      <button 
                        onClick={prevSlide} 
                        className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 md:p-2 rounded-full shadow backdrop-blur-sm transition-all"
                      >
                        <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                      </button>
                      <button 
                        onClick={nextSlide} 
                        className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-1.5 md:p-2 rounded-full shadow backdrop-blur-sm transition-all"
                      >
                        <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                      </button>
                    </>
                  )}
                </div>
              ) : (
                <div className="w-full h-[250px] md:h-[400px] bg-gray-100 rounded-2xl md:rounded-3xl flex items-center justify-center text-gray-400">
                  Sin imágenes
                </div>
              )}
            </div>

            {/* Texto Historia */}
            <div className="w-full md:w-1/2 text-gray-700 space-y-4 md:space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-2">
                {historiaTitulo?.titulo || 'Nuestra Historia'}
              </h2>
              
              {loadingData ? (
                 <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
                 </div>
              ) : historiaParrafos.length > 0 ? (
                <div className="space-y-4">
                    {historiaParrafos.map((parrafo) => (
                      <p key={parrafo.id} className="text-base md:text-lg leading-relaxed text-justify md:text-left">
                        {parrafo.contenido}
                      </p>
                    ))}
                </div>
              ) : (
                <p className="text-gray-400 italic">Información no disponible.</p>
              )}
            </div>
          </div>
        </section>

        {/* --- 3. MISION / VISION --- */}
        <section className="bg-white py-10 md:py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              
              {/* Misión */}
              {/* Padding ajustado: p-6 en móvil, p-10 en escritorio */}
              <div className="bg-red-50 rounded-3xl p-6 md:p-10 border border-red-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-red-600 rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-md text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">{mision?.titulo || 'Misión'}</h3>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">{mision?.contenido || '...'}</p>
              </div>

              {/* Visión */}
              <div className="bg-blue-50 rounded-3xl p-6 md:p-10 border border-blue-100 hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-[#1e3a5f] rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-md text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 md:w-8 md:h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2 md:mb-4">{vision?.titulo || 'Visión'}</h3>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">{vision?.contenido || '...'}</p>
              </div>

            </div>
          </div>
        </section>

        {/* --- 4. VALORES --- */}
        <section className="py-12 md:py-20 max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 md:mb-12">Nuestros Valores</h2>
          
          {loadingData ? (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {[1,2,3,4].map(i => (
                    <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-xl"></div>
                ))}
             </div>
          ) : valores.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8 md:gap-8">
              {valores.map((val) => (
                <div key={val.id} className="flex flex-col items-center group">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center text-3xl md:text-4xl mb-3 md:mb-4 group-hover:bg-red-50 group-hover:scale-110 transition-all duration-300 shadow-md border border-gray-100">
                    {val.imagen_url || '✨'}
                  </div>
                  <h4 className="text-lg md:text-xl font-bold text-gray-800 mb-1 md:mb-2">{val.titulo}</h4>
                  <p className="text-xs md:text-sm text-gray-500 max-w-[200px] leading-snug">{val.contenido}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No se encontraron valores.</p>
          )}
        </section>

      </main>
      <QRCanal />
      <Footer />
    </div>
  )
}

export default QuienesSomos