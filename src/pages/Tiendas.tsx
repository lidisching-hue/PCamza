import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

// Importamos el servicio y el tipo
import { obtenerBannerTiendas, obtenerTiendas } from '../services/contenido.service'
import type { Tienda } from '../types/Contenido'
import QRCanal from '../components/qrcanal'

function Tiendas() {
  // --- ESTADOS ---
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<string>('piura')
  const [tiendas, setTiendas] = useState<Tienda[]>([]) // Lista completa de tiendas
  const [tiendaActiva, setTiendaActiva] = useState<Tienda | null>(null)
  const [bannerUrl, setBannerUrl] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(true)

  // --- EFECTO: CARGAR DATOS DE SUPABASE ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // 1. Cargar Banner
        const url = await obtenerBannerTiendas()
        if (url) setBannerUrl(url)

        // 2. Cargar Tiendas
        const listaTiendas = await obtenerTiendas()
        setTiendas(listaTiendas)

        // Configurar tienda inicial si hay datos
        const tiendasCiudad = listaTiendas.filter(t => t.ciudad.toLowerCase() === ciudadSeleccionada)
        if (tiendasCiudad.length > 0) {
          setTiendaActiva(tiendasCiudad[0])
        }

      } catch (error) {
        console.error('Error en vista Tiendas:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, []) 

  // --- LÓGICA DE FILTRADO ---
  const tiendasFiltradas = tiendas.filter(
    (t) => t.ciudad.toLowerCase() === ciudadSeleccionada.toLowerCase()
  )

  // Autoseleccionar tienda al cambiar ciudad
  useEffect(() => {
    if (tiendasFiltradas.length > 0) {
      const perteneceACiudad = tiendasFiltradas.find(t => t.id === tiendaActiva?.id)
      if (!perteneceACiudad) {
         setTiendaActiva(tiendasFiltradas[0])
      }
    } else {
      setTiendaActiva(null)
    }
  }, [ciudadSeleccionada, tiendasFiltradas, tiendaActiva])


  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Header />

      <main className="flex-grow">
        
        {/* --- 1. BANNER AJUSTADO (Estilo Tienda / Limpio) --- */}
        <div className="relative w-full h-[200px] md:h-[350px] group bg-gray-200">
            {loading ? (
                // Skeleton de carga para el banner
                <div className="w-full h-full animate-pulse bg-gray-300"></div>
            ) : (
                <>
                    {/* Imagen Brillante */}
                    <img 
                      src={bannerUrl || "https://maxiahorro.com.pe/wp-content/uploads/2021/08/tienda-maxi.jpg"} 
                      alt="Nuestras Tiendas Banner" 
                      className="w-full h-full object-cover object-center block animate-fadeIn"
                    />

                    {/* Overlay Sutil + Texto con Sombra */}
                    <div className="absolute inset-0 bg-black/10 flex flex-col justify-center items-center text-center px-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-tight">
                        Nuestras Tiendas
                        </h1>
                        <p className="text-lg md:text-xl text-white font-medium max-w-2xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                        Encuentra tu tienda Pcamza más cercana y visítanos hoy mismo.
                        </p>
                    </div>
                </>
            )}
        </div>

        {/* --- 2. CONTENIDO PRINCIPAL --- */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          
          {/* Selector de Ciudad (Pestañas) */}
          <div className="flex justify-center mb-10">
            <div className="bg-white p-1 rounded-full shadow-md inline-flex">
              <button
                onClick={() => setCiudadSeleccionada('piura')}
                className={`px-8 py-2 rounded-full font-semibold transition-all ${
                  ciudadSeleccionada === 'piura' 
                    ? 'bg-red-600 text-white shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Piura
              </button>
              {/* Aquí podrás agregar más botones para otras ciudades en el futuro */}
            </div>
          </div>

          {loading ? (
             // --- SKELETON DE CARGA (Para que no se vea vacío) ---
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-auto lg:h-[600px]">
                 {/* Skeleton Lista Izquierda */}
                 <div className="lg:col-span-1 bg-gray-200 rounded-2xl animate-pulse h-[400px] lg:h-full"></div>
                 {/* Skeleton Mapa Derecha */}
                 <div className="lg:col-span-2 bg-gray-200 rounded-2xl animate-pulse h-[400px] lg:h-full"></div>
             </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-auto lg:h-[600px]">
              
              {/* --- COLUMNA IZQUIERDA: LISTA DE TIENDAS --- */}
              <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
                <div className="p-6 bg-gradient-to-r from-red-700 to-red-600 text-white">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72l1.189-1.19A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                    </svg>
                    Sucursales {ciudadSeleccionada.charAt(0).toUpperCase() + ciudadSeleccionada.slice(1)}
                  </h3>
                  <p className="text-red-100 text-sm mt-1">Selecciona una para ver el mapa</p>
                </div>
                
                <div className="overflow-y-auto flex-grow p-4 space-y-3 custom-scrollbar">
                  {tiendasFiltradas.length === 0 ? (
                    <p className="text-center text-gray-400 py-4">No hay tiendas registradas.</p>
                  ) : (
                    tiendasFiltradas.map((tienda) => (
                      <button
                        key={tienda.id}
                        onClick={() => setTiendaActiva(tienda)}
                        className={`w-full text-left p-4 rounded-xl transition-all border border-transparent ${
                          tiendaActiva?.id === tienda.id
                            ? 'bg-red-50 border-red-200 shadow-sm ring-1 ring-red-200'
                            : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <h4 className={`font-bold text-lg ${tiendaActiva?.id === tienda.id ? 'text-red-700' : 'text-gray-800'}`}>
                          {tienda.nombre}
                        </h4>
                        <div className="flex items-start gap-2 mt-2 text-sm text-gray-600">
                          <span className="mt-1 flex-shrink-0 text-red-500">📍</span>
                          <p className="line-clamp-2">{tienda.direccion}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* --- COLUMNA DERECHA: INFO Y MAPA --- */}
              <div className="lg:col-span-2 flex flex-col gap-6 h-full">
                
                {tiendaActiva ? (
                  <>
                    {/* Tarjeta de Información */}
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{tiendaActiva.nombre}</h2>
                        <p className="text-gray-600 flex items-center gap-2">
                          {tiendaActiva.direccion}
                        </p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                        <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-100">
                           <span className="text-xs text-green-800 font-bold block uppercase">Horario</span>
                           <span className="text-sm text-green-900 font-medium">{tiendaActiva.horario}</span>
                        </div>
                        {tiendaActiva.telefono && (
                          <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                            <span className="text-xs text-blue-800 font-bold block uppercase">Teléfono</span>
                            <span className="text-sm text-blue-900 font-medium">{tiendaActiva.telefono}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mapa */}
                    <div className="flex-grow bg-gray-200 rounded-2xl overflow-hidden shadow-lg border border-gray-200 relative min-h-[400px]">
                      <iframe
                        title={`Mapa de ${tiendaActiva.nombre}`}
                        src={tiendaActiva.map_src}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full absolute inset-0"
                      />
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 min-h-[400px]">
                    <p className="text-gray-500">Selecciona una tienda para ver los detalles</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
        
      </main>

      <QRCanal />
      <Footer />
    </div>
  )
}

export default Tiendas