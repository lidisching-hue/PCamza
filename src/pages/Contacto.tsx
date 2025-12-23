import Header from '../components/Header'
import Footer from '../components/Footer'

function Contacto() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Header />

      <main className="flex-grow">
        
{/* --- BANNER SUPERIOR RESPONSIVO (Se adapta al tamaño de la imagen) --- */}
      <section className="relative w-full bg-gray-900">
          <img 
            src="https://i.postimg.cc/ZKWmMmW0/opinion2.png" 
            alt="Contáctanos Banner" 
            className="w-full h-auto block"
          />
      </section>

        {/* --- CONTENIDO PRINCIPAL --- */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* COLUMNA IZQUIERDA: INFORMACIÓN */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-red-600 pl-4">
                  Ponte en contacto
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  ¿Tienes alguna duda sobre nuestros productos, horarios o servicios? 
                  Utiliza cualquiera de nuestros canales de atención. Tu opinión es muy importante para nosotros.
                </p>
              </div>

              {/* Tarjetas de Info */}
              <div className="grid gap-6">
                
                {/* Teléfono */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="bg-red-50 p-3 rounded-full text-red-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">Llámanos</h3>
                    <p className="text-gray-500 mb-1">Atención al cliente</p>
                    <a href="tel:+51999999999" className="text-red-600 font-bold hover:underline text-lg">
                      (01) 700-6700
                    </a>
                  </div>
                </div>

                {/* Correo */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">Escríbenos</h3>
                    <p className="text-gray-500 mb-1">Consultas y sugerencias</p>
                    <a href="mailto:atencionalcliente@pecamza.com.pe" className="text-blue-600 font-bold hover:underline break-all">
                      atencionalcliente@pecamza.com.pe
                    </a>
                  </div>
                </div>

                {/* Dirección */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="bg-green-50 p-3 rounded-full text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">Oficina Central</h3>
                    <p className="text-gray-500">
                      Av. Panamericana Norte Km. 1000<br/>
                      Piura, Perú
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* COLUMNA DERECHA: FORMULARIO */}
            <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 border border-gray-100 relative overflow-hidden">
               {/* Decoración fondo */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-bl-full opacity-50 -z-0"></div>

              <h3 className="text-2xl font-bold text-gray-800 mb-6 relative z-10">Envíanos un mensaje</h3>
              
              <form className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="nombre" className="text-sm font-semibold text-gray-700">Nombre completo</label>
                    <input 
                      type="text" 
                      id="nombre"
                      placeholder="Juan Pérez"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-semibold text-gray-700">Correo electrónico</label>
                    <input 
                      type="email" 
                      id="email"
                      placeholder="juan@ejemplo.com"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="asunto" className="text-sm font-semibold text-gray-700">Asunto</label>
                  <select 
                    id="asunto"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none appearance-none cursor-pointer"
                  >
                    <option value="" disabled selected>Selecciona un motivo</option>
                    <option value="consulta">Consulta General</option>
                    <option value="reclamo">Reclamo o Queja</option>
                    <option value="sugerencia">Sugerencia</option>
                    <option value="proveedores">Proveedores</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="mensaje" className="text-sm font-semibold text-gray-700">Mensaje</label>
                  <textarea 
                    id="mensaje"
                    rows={4}
                    placeholder="Escribe tu mensaje aquí..."
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none resize-none"
                  ></textarea>
                </div>

                <button 
                  type="button" // Cambiar a submit cuando conectes backend
                  className="w-full py-4 bg-red-600 text-white font-bold rounded-xl shadow-lg hover:bg-red-700 hover:shadow-red-200 transition-all transform hover:-translate-y-1 active:scale-95"
                >
                  Enviar Mensaje
                </button>
              </form>
            </div>

          </div>
        </section>

        {/* --- MAPA EMBEBIDO (REFERENCIAL) --- */}
        <section className="h-96 w-full bg-gray-200">
            <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127237.96225916035!2d-80.6272559!3d-5.196395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x904a107c790d937d%3A0x280d00936162391!2sPiura!5e0!3m2!1ses!2spe!4v1700000000000!5m2!1ses!2spe" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Mapa Ubicación"
            ></iframe>
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

export default Contacto