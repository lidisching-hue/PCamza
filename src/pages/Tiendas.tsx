import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

// Datos de las tiendas (Puedes agregar más ciudades aquí en el futuro)
const DATA_TIENDAS = {
  piura: [
    {
      id: 1,
      nombre: 'Las Lomas',
      direccion: 'Av. Panamericana Norte 456, Las Lomas, Piura',
      horario: 'Lunes a Domingo: 7:00 am - 9:00 pm',
      telefono: '(073) 123-4567',
      // URL del mapa embebido de Google Maps (Las Lomas)
      mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.46782345678!2d-80.25!3d-4.65!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x904aaf0000000001%3A0x0!2sLas+Lomas+Piura!5e0!3m2!1ses-419!2spe!4v1625000000000!5m2!1ses-419!2spe'
    },
    {
      id: 2,
      nombre: 'Tambogrande',
      direccion: 'Jr. Tumbes 123, Plaza de Armas, Tambogrande',
      horario: 'Lunes a Domingo: 7:30 am - 9:30 pm',
      telefono: '(073) 987-6543',
      // URL del mapa embebido de Google Maps (Tambogrande)
      mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3975.2!2d-80.34!3d-4.93!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x904a6f0000000001%3A0x0!2sTambogrande!5e0!3m2!1ses-419!2spe!4v1625000000000!5m2!1ses-419!2spe'
    }
  ]
}

function Tiendas() {
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState<'piura'>('piura')
  const [tiendaActiva, setTiendaActiva] = useState(DATA_TIENDAS['piura'][0])

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Header />

      <main className="flex-grow">
        
        {/* --- BANNER SUPERIOR --- */}
        <section className="relative h-64 md:h-80 bg-gray-800 flex items-center justify-center overflow-hidden">
          {/* Imagen de fondo oscurecida */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://maxiahorro.com.pe/wp-content/uploads/2021/08/tienda-maxi.jpg" 
              alt="Nuestras Tiendas Banner" 
              className="w-full h-full object-cover opacity-60"
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

        {/* --- CONTENIDO PRINCIPAL (SELECTOR Y MAPA) --- */}
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
              {/* Aquí podrías agregar otro botón para 'Lima' en el futuro */}
            </div>
          </div>

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
                {DATA_TIENDAS[ciudadSeleccionada].map((tienda) => (
                  <button
                    key={tienda.id}
                    onClick={() => setTiendaActiva(tienda)}
                    className={`w-full text-left p-4 rounded-xl transition-all border-2 ${
                      tiendaActiva.id === tienda.id
                        ? 'border-red-600 bg-red-50 shadow-md'
                        : 'border-transparent bg-gray-50 hover:bg-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <h4 className={`font-bold text-lg ${tiendaActiva.id === tienda.id ? 'text-red-700' : 'text-gray-800'}`}>
                      {tienda.nombre}
                    </h4>
                    <div className="flex items-start gap-2 mt-2 text-sm text-gray-600">
                      <span className="mt-1">📍</span>
                      <p>{tienda.direccion}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* --- COLUMNA DERECHA: INFO Y MAPA --- */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              
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
                  <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100 flex items-center gap-2">
                    <span className="text-blue-600">📞</span>
                    <div>
                      <span className="text-xs text-blue-800 font-bold block">TELÉFONO</span>
                      <span className="text-sm text-blue-900">{tiendaActiva.telefono}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contenedor del Mapa */}
              <div className="flex-grow bg-gray-200 rounded-2xl overflow-hidden shadow-lg relative h-[400px] lg:h-auto">
                <iframe
                  title={`Mapa de ${tiendaActiva.nombre}`}
                  src={tiendaActiva.mapSrc}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full"
                />
              </div>
            </div>

          </div>
        </section>






{/* Banner de WhatsApp con QR, Texto y Botón a la derecha */}
      <section className="bg-gradient-to-r from-green-500 to-green-600 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-white">
            
            {/* 1. LADO IZQUIERDO: Imagen QR */}
            <div className="bg-white p-2 rounded-xl shadow-2xl transform -rotate-2 hover:rotate-0 transition-transform duration-300 flex-shrink-0">
              <img 
                src="https://i.postimg.cc/SRdCH8jk/PCamza.png" 
                alt="QR Canal WhatsApp" 
                className="w-32 h-32 md:w-36 md:h-36 object-contain"
              />
            </div>

            {/* 2. CENTRO: Texto Informativo (ocupa el espacio disponible) */}
            <div className="text-center md:text-left flex-1">
              <h3 className="text-3xl font-bold mb-2">
                ¡Únete a nuestro Canal!
              </h3>
              <p className="text-green-100 text-lg leading-relaxed">
                Escanea el código QR con tu celular o usa el botón para unirte a nuestro canal. <br className="hidden md:block"/>
                Recibe ofertas exclusivas al instante.
              </p>
            </div>

            {/* 3. LADO DERECHO: Botón de acción */}
            <div className="flex-shrink-0">
              <a
                href="https://whatsapp.com/channel/0029Vb9q1tJJZg46Segt7c04"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white text-green-600 hover:bg-green-50 font-bold py-4 px-8 rounded-full transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 group"
              >
                <span className="text-lg">Chatear ahora</span>
                {/* Flecha animada al hacer hover */}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6 transition-transform group-hover:translate-x-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
            </div>

          </div>
        </div>
      </section>




        
      </main>

      <Footer />
    </div>
  )
}

export default Tiendas