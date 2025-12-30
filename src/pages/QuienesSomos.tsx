import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import QRCanal from '../components/qrcanal'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'

// 1. Definimos la interfaz aquí mismo para evitar errores de importación
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
  const [loading, setLoading] = useState<boolean>(true)
  const [currentSlide, setCurrentSlide] = useState<number>(0)

  // --- EFECTO: CARGAR DATOS DESDE SUPABASE ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Pedimos TODO el contenido de la tabla contenido_nosotros
        const { data: result, error } = await supabase
          .from('contenido_nosotros')
          .select('*')
          .order('orden', { ascending: true })

        if (error) throw error
        if (result) setData(result)

      } catch (error) {
        console.error('Error cargando Quiénes Somos:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // --- HELPERS PARA FILTRAR EL CONTENIDO ---
  // Estos atajos nos ayudan a buscar datos específicos en el array 'data'
  const getSection = (seccion: string) => data.filter(item => item.seccion === seccion)
  const getOne = (seccion: string, subseccion: string) => data.find(item => item.seccion === seccion && item.subseccion === subseccion)

  // Datos procesados para uso fácil en el render:
  const portada = getOne('portada', 'banner_principal')
  const historiaTitulo = getOne('historia', 'titulo_principal')
  const historiaParrafos = getSection('historia').filter(item => item.tipo === 'parrafo')
  const carrusel = getSection('carrusel_historia') // Array de imágenes
  const mision = getOne('mision_vision', 'mision')
  const vision = getOne('mision_vision', 'vision')
  const valores = getSection('valores')

  // --- FUNCIONES DEL CARRUSEL ---
  const prevSlide = () => {
    if (carrusel.length === 0) return
    const isFirstSlide = currentSlide === 0
    const newIndex = isFirstSlide ? carrusel.length - 1 : currentSlide - 1
    setCurrentSlide(newIndex)
  }

  const nextSlide = () => {
    if (carrusel.length === 0) return
    const isLastSlide = currentSlide === carrusel.length - 1
    const newIndex = isLastSlide ? 0 : currentSlide + 1
    setCurrentSlide(newIndex)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-gray-300 rounded-full mb-4"></div>
          <p className="text-gray-400 font-medium">Cargando nuestra historia...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Header />

      <main className="flex-grow">
        
        {/* --- 1. PORTADA / BANNER SUPERIOR --- */}
        <section className="relative bg-[#d32f2f] text-white py-20">
          <div className="absolute inset-0 overflow-hidden opacity-30">
            {portada?.imagen_url && (
              <img 
                src={portada.imagen_url} 
                alt="Banner Quiénes Somos" 
                className="w-full h-full object-cover transition-opacity duration-500"
              />
            )}
          </div>
          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg">
              {portada?.titulo || 'Quiénes Somos'}
            </h1>
            <p className="text-lg md:text-xl font-light opacity-95 max-w-2xl mx-auto drop-shadow-md">
              {portada?.contenido || 'Cargando descripción...'}
            </p>
          </div>
        </section>

        {/* --- 2. HISTORIA / INTRODUCCIÓN --- */}
        <section className="py-16 px-4 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            
            {/* ZONA DE CARRUSEL DE IMÁGENES */}
            <div className="md:w-1/2 relative group w-full">
              {carrusel.length > 0 ? (
                <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-xl bg-gray-100">
                  {/* Imagen Actual */}
                  <img 
                    src={carrusel[currentSlide]?.imagen_url || ''} 
                    alt="Historia Slide" 
                    className="w-full h-full object-cover duration-500 ease-in-out"
                  />

                  {/* Flechas (Solo si hay más de 1 imagen) */}
                  {carrusel.length > 1 && (
                    <>
                      <button onClick={prevSlide} className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
                        <ChevronLeft size={24} />
                      </button>
                      <button onClick={nextSlide} className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-red-600 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100">
                        <ChevronRight size={24} />
                      </button>
                      
                      {/* Puntos indicadores */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {carrusel.map((_, index) => (
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
                <div className="w-full h-[400px] bg-gray-200 rounded-3xl flex items-center justify-center text-gray-400">
                  Sin imágenes
                </div>
              )}
            </div>

            {/* TEXTO DE HISTORIA */}
            <div className="md:w-1/2 text-gray-700 space-y-6">
              <h2 className="text-3xl font-bold text-gray-800 border-b-4 border-red-600 inline-block pb-2">
                {historiaTitulo?.titulo || 'Nuestra Historia'}
              </h2>
              
              {/* Mapeamos los párrafos dinámicamente */}
              {historiaParrafos.length > 0 ? (
                historiaParrafos.map((parrafo) => (
                  <p key={parrafo.id} className="text-lg leading-relaxed">
                    {parrafo.contenido}
                  </p>
                ))
              ) : (
                <p className="text-gray-400 italic">No hay información de historia disponible.</p>
              )}
            </div>
          </div>
        </section>

        {/* --- 3. MISIÓN Y VISIÓN --- */}
        <section className="bg-white py-16 shadow-inner">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-10">
              
              {/* Card Misión */}
              <div className="bg-red-50 rounded-3xl p-10 border border-red-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mb-6 shadow-lg text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{mision?.titulo || 'Misión'}</h3>
                <p className="text-gray-700 leading-relaxed">
                  {mision?.contenido || 'Cargando misión...'}
                </p>
              </div>

              {/* Card Visión */}
              <div className="bg-blue-50 rounded-3xl p-10 border border-blue-100 shadow-sm hover:shadow-md transition-all">
                <div className="w-16 h-16 bg-[#1e3a5f] rounded-full flex items-center justify-center mb-6 shadow-lg text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{vision?.titulo || 'Visión'}</h3>
                <p className="text-gray-700 leading-relaxed">
                  {vision?.contenido || 'Cargando visión...'}
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* --- 4. NUESTROS VALORES --- */}
        <section className="py-20 max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-12">Nuestros Valores</h2>
          
          {valores.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {valores.map((val) => (
                <div key={val.id} className="flex flex-col items-center group">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-4 group-hover:bg-red-100 group-hover:scale-110 transition-all duration-300 shadow-sm border border-gray-200">
                    {/* Renderizamos el Emoji guardado en imagen_url */}
                    {val.imagen_url || '✨'}
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 mb-2">{val.titulo}</h4>
                  <p className="text-sm text-gray-500 max-w-[200px]">{val.contenido}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">Cargando valores...</p>
          )}

        </section>
      </main>
      <QRCanal />
      <Footer />
    </div>
  )
}

export default QuienesSomos