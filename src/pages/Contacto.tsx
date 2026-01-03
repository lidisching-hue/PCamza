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
  
  // Datos de Configuración (Banner, textos, teléfonos)
  const [info, setInfo] = useState<InfoContacto | null>(null)
  const [loadingData, setLoadingData] = useState(true)
  
  // Estado de carga del formulario
  const [saving, setSaving] = useState(false)

  // 1. Cargar configuración al iniciar
  useEffect(() => {
    const cargarDatos = async () => {
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

  // 2. Manejar Envío (SOLO BASE DE DATOS)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formRef.current) return
    setSaving(true)

    // Obtener datos del formulario
    const formData = new FormData(formRef.current)
    const datosMensaje = {
      nombre: formData.get('nombre') as string,
      email: formData.get('email') as string,
      asunto: formData.get('asunto') as string,
      mensaje: formData.get('mensaje') as string,
    }

    try {
      // Guardar en Supabase
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
      <Toaster position="bottom-center" />

      <main className="flex-grow">
        
        {/* --- BANNER AJUSTADO (Como pediste) --- */}
        {/* ⬇️ 1. Definimos la altura del Banner (200px en móvil, 420px en PC) */}
        <div className="relative w-full h-[200px] md:h-[420px] group bg-gray-200">
            {loadingData ? (
               <div className="w-full h-full animate-pulse bg-gray-300"></div>
            ) : (
                <img 
                  src={info?.banner_url || "https://i.postimg.cc/ZKWmMmW0/opinion2.png"} 
                  className="w-full h-full object-cover object-center block animate-fadeIn shadow-sm" 
                  alt="Banner Contacto" 
                />
            )}
             {/* Opcional: Sombra interna suave para que el header blanco resalte */}
             <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none"></div>
        </div>

        <section className="max-w-7xl mx-auto px-4 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            
            {/* COLUMNA IZQUIERDA: DATOS ADMINISTRABLES */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4 border-l-4 border-red-600 pl-4">
                  {info?.titulo || 'Ponte en contacto'}
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {info?.bajada || '¿Tienes alguna duda? Utiliza cualquiera de nuestros canales de atención.'}
                </p>
              </div>

              <div className="grid gap-6">
                {/* Teléfono Dinámico */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="bg-red-50 p-3 rounded-full text-red-600">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">Llámanos</h3>
                    {loadingData ? <div className="h-6 w-32 bg-gray-200 animate-pulse rounded"/> : (
                      <a href={`tel:${info?.telefono}`} className="text-red-600 font-bold hover:underline text-lg">
                        {info?.telefono || '---'}
                      </a>
                    )}
                  </div>
                </div>

                {/* Correo Dinámico */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start gap-4 hover:shadow-md transition-shadow">
                  <div className="bg-blue-50 p-3 rounded-full text-blue-600">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-lg">Escríbenos</h3>
                    {loadingData ? <div className="h-6 w-48 bg-gray-200 animate-pulse rounded"/> : (
                      <a href={`mailto:${info?.email}`} className="text-blue-600 font-bold hover:underline break-all text-lg">
                        {info?.email || '---'}
                      </a>
                    )}
                  </div>
                </div>
                
                {/* Extras (Dirección y Horario) */}
                <div className="space-y-3 pt-2">
                    {info?.direccion && (
                        <div className="flex gap-4 items-start text-gray-600 px-2">
                            <MapPin className="text-red-600 flex-shrink-0 mt-1" size={20}/> 
                            <span>{info.direccion}</span>
                        </div>
                    )}
                    {info?.horario && (
                        <div className="flex gap-4 items-center text-gray-600 px-2">
                            <Clock className="text-red-600 flex-shrink-0" size={20}/> 
                            <span>{info.horario}</span>
                        </div>
                    )}
                </div>

              </div>
            </div>

            {/* COLUMNA DERECHA: FORMULARIO QUE CAPTURA DATOS EN DB */}
            <div className="bg-white rounded-3xl shadow-xl p-8 lg:p-10 border border-gray-100">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Envíanos un mensaje</h3>
              
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Nombre completo</label>
                    <input name="nombre" type="text" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 transition-all outline-none" placeholder="Juan Pérez" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Correo electrónico</label>
                    <input name="email" type="email" required className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:bg-white focus:border-red-500 transition-all outline-none" placeholder="juan@ejemplo.com" />
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
                  disabled={saving}
                  className={`w-full py-4 bg-red-600 text-white font-bold rounded-xl shadow-lg transition-all ${saving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-red-700 transform hover:-translate-y-1'}`}
                >
                  {saving ? 'Enviando...' : 'Enviar Mensaje'}
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