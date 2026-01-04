import { useState, useEffect, useRef } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import Header from '../components/Header'
import Footer from '../components/Footer'
import QRCanal from '../components/qrcanal'
import { Phone, Mail, MapPin, Clock } from 'lucide-react'
import { 
  obtenerInfoContacto, 
  enviarMensajeContacto,
  type InfoContacto 
} from '../services/contenido.service'

function Contacto() {
  const formRef = useRef<HTMLFormElement>(null)
  
  // Datos de Configuración
  const [info, setInfo] = useState<InfoContacto | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  
  // Estado de carga del formulario
  const [saving, setSaving] = useState(false)

  // 1. Cargar configuración al iniciar
  useEffect(() => {
    const cargarDatos = async () => {
      setLoadingData(true)
      try {
        const data = await obtenerInfoContacto()
        if (data) setInfo(data)
      } catch (error) {
        console.error("Error cargando datos:", error)
      } finally {
        setLoadingData(false)
      }
    }
    cargarDatos()
  }, [])

  // 2. Manejar Envío
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return
    setSaving(true)

    const formData = new FormData(formRef.current)
    const datosMensaje = {
      nombre: formData.get('nombre') as string,
      email: formData.get('email') as string,
      asunto: formData.get('asunto') as string,
      mensaje: formData.get('mensaje') as string,
    }

    try {
      await enviarMensajeContacto(datosMensaje)
      toast.success('¡Mensaje enviado correctamente!')
      formRef.current.reset()
    } catch (error) {
      console.error('Error al guardar mensaje:', error)
      toast.error('Hubo un problema al enviar tu mensaje.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Header />
      <Toaster position="bottom-center" toastOptions={{ duration: 4000 }} />

      <main className="flex-grow">
        
        {/* --- 1. BANNER AJUSTADO (Estilo Unificado) --- */}
        <div className="relative w-full h-[200px] md:h-[350px] group bg-gray-200">
            {loadingData ? (
                <div className="w-full h-full animate-pulse bg-gray-300"></div>
            ) : (
                <>
                    <img 
                      src={info?.banner_url || "https://i.postimg.cc/ZKWmMmW0/opinion2.png"} 
                      className="w-full h-full object-cover object-center block animate-fadeIn" 
                      alt="Banner Contacto" 
                    />
                    {/* Overlay y Texto Principal */}
                    <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-center px-4">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-tight">
                            Contáctanos
                        </h1>
                        <p className="text-lg md:text-xl text-white font-medium max-w-2xl drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                            Estamos aquí para escucharte y resolver tus dudas.
                        </p>
                    </div>
                </>
            )}
        </div>

        {/* --- 2. CONTENIDO PRINCIPAL --- */}
        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* COLUMNA IZQUIERDA: DATOS DE CONTACTO */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-red-600 pl-4">
                    {loadingData ? 'Cargando información...' : (info?.titulo || 'Nuestros Canales')}
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                    {loadingData ? '...' : (info?.bajada || 'Utiliza cualquiera de nuestros medios oficiales para comunicarte con nosotros.')}
                </p>
              </div>

              <div className="grid gap-6">
                {/* Skeleton Loading para Tarjetas */}
                {loadingData ? (
                    <>
                        <div className="h-24 bg-gray-200 rounded-2xl animate-pulse"></div>
                        <div className="h-24 bg-gray-200 rounded-2xl animate-pulse"></div>
                    </>
                ) : (
                    <>
                        {/* Teléfono */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow group">
                            <div className="bg-red-50 p-4 rounded-full text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">Llámanos</h3>
                                <a href={`tel:${info?.telefono}`} className="text-gray-600 font-medium hover:text-red-600 transition-colors text-lg">
                                    {info?.telefono || '---'}
                                </a>
                            </div>
                        </div>

                        {/* Correo */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow group">
                            <div className="bg-blue-50 p-4 rounded-full text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">Escríbenos</h3>
                                <a href={`mailto:${info?.email}`} className="text-gray-600 font-medium hover:text-blue-600 transition-colors break-all text-lg">
                                    {info?.email || '---'}
                                </a>
                            </div>
                        </div>
                    </>
                )}

                {/* Extras (Dirección y Horario) */}
                {!loadingData && (
                    <div className="bg-gray-50 rounded-2xl p-6 space-y-4 border border-gray-100">
                        {info?.direccion && (
                            <div className="flex gap-4 items-start text-gray-700">
                                <MapPin className="text-red-600 flex-shrink-0 mt-1" size={22}/> 
                                <span className="font-medium">{info.direccion}</span>
                            </div>
                        )}
                        {info?.horario && (
                            <div className="flex gap-4 items-center text-gray-700">
                                <Clock className="text-red-600 flex-shrink-0" size={22}/> 
                                <span className="font-medium">{info.horario}</span>
                            </div>
                        )}
                    </div>
                )}
              </div>
            </div>

            {/* COLUMNA DERECHA: FORMULARIO */}
            <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-red-100 rounded-full blur-3xl opacity-50"></div>
              
              <h3 className="text-2xl font-bold text-gray-800 mb-6 relative z-10">Envíanos un mensaje</h3>
              
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Nombre completo</label>
                    <input name="nombre" type="text" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none" placeholder="Tu nombre" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Correo electrónico</label>
                    <input name="email" type="email" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none" placeholder="tucorreo@ejemplo.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Asunto</label>
                  <select name="asunto" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none cursor-pointer">
                    <option value="Consulta General">Consulta General</option>
                    <option value="Reclamo">Reclamo o Queja</option>
                    <option value="Sugerencia">Sugerencia</option>
                    <option value="Cotización">Solicitar Cotización</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 ml-1">Mensaje</label>
                  <textarea name="mensaje" rows={4} required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-100 transition-all outline-none resize-none" placeholder="¿En qué podemos ayudarte?"></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={saving}
                  className={`w-full py-4 bg-gradient-to-r from-red-600 to-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-200 transition-all transform ${
                    saving ? 'opacity-70 cursor-wait' : 'hover:scale-[1.02] hover:shadow-xl'
                  }`}
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                       <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                       </svg>
                       Enviando...
                    </span>
                  ) : 'Enviar Mensaje'}
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