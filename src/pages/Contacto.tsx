import { useState, useEffect, useRef } from 'react'
import emailjs from '@emailjs/browser'
import Header from '../components/Header'
import Footer from '../components/Footer'
import QRCanal from '../components/qrcanal'
import { obtenerBannerContacto, obtenerAjustesContacto } from '../services/contenido.service'

function Contacto() {
  const formRef = useRef<HTMLFormElement>(null)
  
  // Estados para datos de Supabase
  const [bannerUrl, setBannerUrl] = useState<string>('')
  const [ajustes, setAjustes] = useState<Record<string, string>>({})
  const [loadingData, setLoadingData] = useState(true)
  
  // Estado para envío de EmailJS
  const [sending, setSending] = useState(false)

  // 1. Cargar datos de Supabase al montar el componente
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [url, dataAjustes] = await Promise.all([
          obtenerBannerContacto(),
          obtenerAjustesContacto()
        ])
        setBannerUrl(url)
        setAjustes(dataAjustes)
      } catch (error) {
        console.error("Error cargando datos:", error)
      } finally {
        setLoadingData(false)
      }
    }
    cargarDatos()
  }, [])

  // 2. Función para enviar correo con EmailJS
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return

    setSending(true)

    // IDs de EmailJS
    const SERVICE_ID = 'service_wvy664x'; // IMPORTANTE: Verifica este ID en tu panel (Email Services)
    const TEMPLATE_ID = 'template_h8l47vr';
    const PUBLIC_KEY = '2srQTyAEud8-CzhQe';

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, formRef.current, PUBLIC_KEY)
      .then(() => {
        alert('¡Mensaje enviado con éxito! Nos contactaremos pronto.')
        formRef.current?.reset()
      })
      .catch((error) => {
        console.error('Error al enviar:', error)
        alert('Hubo un error al enviar el mensaje. Inténtalo de nuevo.')
      })
      .finally(() => setSending(false))
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Header />

      <main className="flex-grow">
        {/* --- BANNER DINÁMICO --- */}
        <section className="relative w-full bg-gray-200 min-h-[150px]">
          {!loadingData && (
            <img 
              src={bannerUrl || "https://i.postimg.cc/ZKWmMmW0/opinion2.png"} 
              className="w-full h-auto block animate-fadeIn" 
              alt="Banner" 
            />
          )}
        </section>

        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* COLUMNA IZQUIERDA: INFORMACIÓN DESDE SUPABASE */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-red-600 pl-4">
                  Ponte en contacto
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  ¿Tienes alguna duda? Utiliza cualquiera de nuestros canales de atención.
                </p>
              </div>

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
                    {loadingData ? (
                      <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                      <a href={`tel:${ajustes.telefono}`} className="text-red-600 font-bold hover:underline text-lg">
                        {ajustes.telefono || '(01) 700-6700'}
                      </a>
                    )}
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
                    {loadingData ? (
                      <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"></div>
                    ) : (
                      <a href={`mailto:${ajustes.email}`} className="text-blue-600 font-bold hover:underline break-all text-lg">
                        {ajustes.email || 'atencionalcliente@pecamza.com.pe'}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMNA DERECHA: FORMULARIO (EMAILJS) */}
            <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Envíanos un mensaje</h3>
              
              <form ref={formRef} onSubmit={handleSendEmail} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Nombre completo</label>
                    <input name="nombre" type="text" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none" placeholder="Juan Pérez" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Correo electrónico</label>
                    <input name="email" type="email" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none" placeholder="juan@ejemplo.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Asunto</label>
                  <select name="asunto" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 transition-all outline-none">
                    <option value="Consulta General">Consulta General</option>
                    <option value="Reclamo">Reclamo o Queja</option>
                    <option value="Sugerencia">Sugerencia</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Mensaje</label>
                  <textarea name="mensaje" rows={4} required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 transition-all outline-none resize-none" placeholder="Escribe tu mensaje aquí..."></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={sending}
                  className={`w-full py-4 bg-red-600 text-white font-bold rounded-xl shadow-lg transition-all ${sending ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700 transform hover:-translate-y-1'}`}
                >
                  {sending ? 'Enviando...' : 'Enviar Mensaje'}
                </button>
              </form>
            </div>

          </div>
        </section>
      </main>

      <QRCanal />
      <Footer />
    </div>
  )
}

export default Contacto