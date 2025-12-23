import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import QRCanal from '../components/qrcanal'
// Importamos el servicio y el tipo
import { obtenerBannerTiendas, obtenerTiendas } from '../services/contenido.service'
import type { Tienda } from '../types/Contenido'

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
  // Filtramos las tiendas disponibles según la ciudad seleccionada
  const tiendasFiltradas = tiendas.filter(
    (t) => t.ciudad.toLowerCase() === ciudadSeleccionada.toLowerCase()
  )

  // Si cambiamos de ciudad, autoseleccionar la primera tienda de esa ciudad
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
        
        {/* --- BANNER SUPERIOR --- */}
        <section className="relative h-64 md:h-80 bg-gray-800 flex items-center justify-center overflow-hidden">
          {/* Imagen de fondo (Supabase o Fallback) */}
          <div className="absolute inset-0 z-0">
            <img 
              src={bannerUrl || "https://maxiahorro.com.pe/wp-content/uploads/2021/08/tienda-maxi.jpg"} 
              alt="Nuestras Tiendas Banner" 
              className="w-full h-full object-cover opacity-60 transition-opacity duration-500"
            />
          </div>
          
          <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
              Nuestras Tiendas
            </h1>
            <p className="text-gray-200 text-lg md:text-xl max-w-2xl mx-auto">
              Encuentra tu tienda Pecamza más cercano y visítanos hoy mismo.
            </p>
          </div>
        </section>

        {/* --- CONTENIDO PRINCIPAL --- */}
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
             <div className="text-center py-20 text-gray-500">Cargando sucursales...</div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-auto lg:h-[600px]">
              
              {/* --- COLUMNA IZQUIERDA: LISTA DE TIENDAS --- */}
              <div className="lg:col-span-1 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
                <div className="p-6 bg-red-600 text-white">
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                    </svg>
                    Sucursales en {ciudadSeleccionada.charAt(0).toUpperCase() + ciudadSeleccionada.slice(1)}
                  </h3>
                  <p className="text-red-100 text-sm mt-1">Selecciona una tienda para ver el mapa</p>
                </div>
                
                <div className="overflow-y-auto flex-grow p-4 space-y-3">
                  {tiendasFiltradas.length === 0 ? (
                    <p className="text-center text-gray-400 py-4">No hay tiendas registradas.</p>
                  ) : (
                    tiendasFiltradas.map((tienda) => (
                      <button
                        key={tienda.id}
                        onClick={() => setTiendaActiva(tienda)}
                        className={`w-full text-left p-4 rounded-xl transition-all border-2 ${
                          tiendaActiva?.id === tienda.id
                            ? 'border-red-600 bg-red-50 shadow-md'
                            : 'border-transparent bg-gray-50 hover:bg-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <h4 className={`font-bold text-lg ${tiendaActiva?.id === tienda.id ? 'text-red-700' : 'text-gray-800'}`}>
                          {tienda.nombre}
                        </h4>
                        <div className="flex items-start gap-2 mt-2 text-sm text-gray-600">
                          <span className="mt-1">📍</span>
                          <p>{tienda.direccion}</p>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* --- COLUMNA DERECHA: INFO Y MAPA --- */}
              <div className="lg:col-span-2 flex flex-col gap-6">
                
                {tiendaActiva ? (
                  <>
                    {/* Tarjeta de Información Detallada */}
                    <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{tiendaActiva.nombre}</h2>
                        <p className="text-gray-600 flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {tiendaActiva.direccion}
                        </p>
                      </div>
                      
                      <div className="flex flex-col gap-2 w-full md:w-auto">
                        <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-100 flex items-center gap-2">
                          <span className="text-green-600">🕒</span>
                          <div>
                            <span className="text-xs text-green-800 font-bold block">HORARIO</span>
                            <span className="text-sm text-green-900">{tiendaActiva.horario}</span>
                          </div>
                        </div>
                        {tiendaActiva.telefono && (
                          <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 flex items-center gap-2">
                            <span className="text-blue-600">📞</span>
                            <div>
                              <span className="text-xs text-blue-800 font-bold block">TELÉFONO</span>
                              <span className="text-sm text-blue-900">{tiendaActiva.telefono}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contenedor del Mapa */}
                    <div className="flex-grow bg-gray-200 rounded-2xl overflow-hidden shadow-lg relative h-[400px] lg:h-auto">
                      <iframe
                        title={`Mapa de ${tiendaActiva.nombre}`}
                        src={tiendaActiva.map_src}
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        className="w-full h-full"
                      />
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300">
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