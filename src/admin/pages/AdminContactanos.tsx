import { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { Save, Upload, Loader2, Mail, Phone, MapPin, Trash2, Inbox, Settings } from 'lucide-react'

import { 
  obtenerInfoContacto, 
  actualizarInfoContacto, 
  subirBannerContacto,
  obtenerMensajesContacto,
  eliminarMensaje,
  type InfoContacto,
  type MensajeContacto
} from '../../services/contenido.service'

export default function AdminContactanos() {
  const [activeTab, setActiveTab] = useState<'config' | 'mensajes'>('config')
  const [loading, setLoading] = useState(true)
  
  // Datos Configuración
  const [formData, setFormData] = useState<InfoContacto>({
    id: 1, banner_url: '', titulo: '', bajada: '', direccion: '', telefono: '', 
    email: '', horario: '', facebook: '', instagram: '', tiktok: '', whatsapp: ''
  })
  
  // Datos Mensajes
  const [mensajes, setMensajes] = useState<MensajeContacto[]>([])

  useEffect(() => {
    cargarTodo()
  }, [])

  const cargarTodo = async () => {
    setLoading(true)
    try {
      const info = await obtenerInfoContacto()
      if (info) setFormData(info)
      
      const msjs = await obtenerMensajesContacto()
      setMensajes(msjs || [])
    } catch (error) {
      toast.error('Error cargando datos')
    } finally {
      setLoading(false)
    }
  }

  // --- LÓGICA CONFIGURACIÓN ---
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return
    const promise = subirBannerContacto(e.target.files[0])
    toast.promise(promise, {
        loading: 'Subiendo banner...',
        success: (url) => {
            setFormData(prev => ({ ...prev, banner_url: url }))
            return 'Banner actualizado'
        },
        error: 'Error al subir imagen'
    })
  }

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault()
    toast.promise(actualizarInfoContacto(formData), {
        loading: 'Guardando...',
        success: 'Información actualizada',
        error: 'Error al guardar'
    })
  }

  // --- LÓGICA MENSAJES ---
  const handleDeleteMensaje = async (id: number) => {
    if(!window.confirm('¿Seguro que quieres borrar este mensaje?')) return
    try {
        await eliminarMensaje(id)
        setMensajes(prev => prev.filter(m => m.id !== id))
        toast.success('Mensaje eliminado')
    } catch (e) { toast.error('Error al eliminar') }
  }

  if (loading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin" /></div>

  return (
    // RESPONSIVE: Padding reducido en móvil (p-4), normal en PC (md:p-6)
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen max-w-6xl mx-auto">
      <Toaster position="top-right" />

      {/* RESPONSIVE: Flex columna en móvil, fila en PC */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Administrar Contacto</h1>
            <p className="text-sm md:text-base text-gray-500">Gestiona la página de contacto y lee los mensajes recibidos.</p>
        </div>
        
        {/* RESPONSIVE: Botones de ancho completo en móvil */}
        <div className="flex w-full md:w-auto bg-white p-1 rounded-lg shadow-sm border">
            <button 
                onClick={() => setActiveTab('config')}
                className={`flex-1 md:flex-none justify-center px-4 py-2 rounded-md flex items-center gap-2 text-sm md:text-base transition-colors ${activeTab === 'config' ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                <Settings size={18} /> Configuración
            </button>
            <button 
                onClick={() => setActiveTab('mensajes')}
                className={`flex-1 md:flex-none justify-center px-4 py-2 rounded-md flex items-center gap-2 text-sm md:text-base transition-colors ${activeTab === 'mensajes' ? 'bg-red-100 text-red-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                <Inbox size={18} /> Buzón <span className="hidden sm:inline">Mensajes</span> ({mensajes.length})
            </button>
        </div>
      </div>

      {/* --- PESTAÑA 1: CONFIGURACIÓN --- */}
      {activeTab === 'config' && (
        <form onSubmit={handleSaveConfig} className="space-y-6 md:space-y-8 animate-fadeIn">
          {/* BANNER */}
          <section className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200">
             <h2 className="font-bold mb-4 text-gray-700">Banner Principal</h2>
             {/* RESPONSIVE: Aspect ratio cambia para que en móvil se vea bien */}
             <div className="relative aspect-video md:aspect-[3/1] bg-gray-100 rounded-lg overflow-hidden border group">
                {formData.banner_url ? <img src={formData.banner_url} className="w-full h-full object-cover"/> : <div className="h-full flex items-center justify-center text-gray-400">Sin Banner</div>}
                
                <div className="absolute bottom-4 right-4 left-4 md:left-auto">
                   <label className="cursor-pointer bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800 flex items-center justify-center gap-2 text-sm w-full md:w-auto">
                       <Upload size={18} /> Cambiar Imagen
                       <input type="file" className="hidden" accept="image/*" onChange={handleBannerUpload} />
                   </label>
                </div>
             </div>
          </section>

          {/* DATOS DE CONTACTO */}
          <section className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
             <h2 className="col-span-1 md:col-span-2 font-bold text-gray-700 text-lg md:text-xl">Información de Contacto</h2>
             
             <div>
                <label className="label block mb-1 text-sm font-semibold text-gray-600">Título Página</label>
                <input className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} />
             </div>
             <div>
                <label className="label block mb-1 text-sm font-semibold text-gray-600">Bajada (Subtítulo)</label>
                <input className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" value={formData.bajada} onChange={e => setFormData({...formData, bajada: e.target.value})} />
             </div>
             
             <div className="col-span-1 md:col-span-2 border-t my-2"></div>

             <div>
                <label className="label flex gap-2 mb-1 text-sm font-semibold text-gray-600"><Phone size={16}/> Teléfono para llamadas</label>
                <input className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} placeholder="(01) 123-4567" />
             </div>
             <div>
                <label className="label flex gap-2 mb-1 text-sm font-semibold text-gray-600"><Mail size={16}/> Correo Electrónico</label>
                <input className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="contacto@tuweb.com" />
             </div>
             <div>
                <label className="label flex gap-2 mb-1 text-sm font-semibold text-gray-600"><MapPin size={16}/> Dirección</label>
                <input className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} />
             </div>
             <div>
                <label className="label block mb-1 text-sm font-semibold text-gray-600">Horario</label>
                <input className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-100 outline-none" value={formData.horario} onChange={e => setFormData({...formData, horario: e.target.value})} />
             </div>
          </section>

          <div className="flex justify-end">
             {/* RESPONSIVE: Botón full width en móvil */}
             <button type="submit" className="w-full md:w-auto bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 flex gap-2 items-center justify-center shadow-lg hover:shadow-xl transition-all">
                <Save size={20} /> Guardar Cambios
             </button>
          </div>
        </form>
      )}

      {/* --- PESTAÑA 2: MENSAJES --- */}
      {activeTab === 'mensajes' && (
        <div className="animate-fadeIn space-y-4">
            {mensajes.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-400 text-lg">No hay mensajes nuevos</p>
                </div>
            ) : (
                // RESPONSIVE: Wrapper para hacer scroll horizontal en la tabla
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[800px]">
                            <thead className="bg-gray-100 text-gray-600 font-semibold text-sm">
                                <tr>
                                    <th className="p-4">Fecha</th>
                                    <th className="p-4">Nombre / Email</th>
                                    <th className="p-4">Asunto</th>
                                    <th className="p-4">Mensaje</th>
                                    <th className="p-4 text-right">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {mensajes.map((m) => (
                                    <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 text-sm text-gray-500 whitespace-nowrap align-top">
                                            {new Date(m.created_at!).toLocaleDateString()} <br/>
                                            <span className="text-xs text-gray-400">{new Date(m.created_at!).toLocaleTimeString()}</span>
                                        </td>
                                        <td className="p-4 align-top">
                                            <p className="font-bold text-gray-800">{m.nombre}</p>
                                            <p className="text-sm text-blue-600">{m.email}</p>
                                        </td>
                                        <td className="p-4 align-top">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                m.asunto === 'Reclamo' ? 'bg-red-100 text-red-700' :
                                                m.asunto === 'Sugerencia' ? 'bg-green-100 text-green-700' :
                                                'bg-blue-100 text-blue-700'
                                            }`}>
                                                {m.asunto}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-700 max-w-md align-top text-sm">
                                            {m.mensaje}
                                        </td>
                                        <td className="p-4 text-right align-top">
                                            <button 
                                                onClick={() => handleDeleteMensaje(m.id!)}
                                                className="text-gray-400 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg"
                                                title="Eliminar mensaje"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
      )}
    </div>
  )
}