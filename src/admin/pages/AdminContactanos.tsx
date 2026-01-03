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
    <div className="p-6 bg-gray-50 min-h-screen max-w-6xl mx-auto">
      <Toaster position="top-right" />

      <div className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Administrar Contacto</h1>
            <p className="text-gray-500">Gestiona la página de contacto y lee los mensajes recibidos.</p>
        </div>
        <div className="flex bg-white p-1 rounded-lg shadow-sm border">
            <button 
                onClick={() => setActiveTab('config')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 ${activeTab === 'config' ? 'bg-blue-100 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                <Settings size={18} /> Configuración Web
            </button>
            <button 
                onClick={() => setActiveTab('mensajes')}
                className={`px-4 py-2 rounded-md flex items-center gap-2 ${activeTab === 'mensajes' ? 'bg-red-100 text-red-700 font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
            >
                <Inbox size={18} /> Buzón de Mensajes ({mensajes.length})
            </button>
        </div>
      </div>

      {/* --- PESTAÑA 1: CONFIGURACIÓN --- */}
      {activeTab === 'config' && (
        <form onSubmit={handleSaveConfig} className="space-y-8 animate-fadeIn">
          {/* BANNER */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
             <h2 className="font-bold mb-4 text-gray-700">Banner Principal</h2>
             <div className="relative aspect-[3/1] bg-gray-100 rounded-lg overflow-hidden border group">
                {formData.banner_url ? <img src={formData.banner_url} className="w-full h-full object-cover"/> : <div className="h-full flex items-center justify-center text-gray-400">Sin Banner</div>}
                <div className="absolute bottom-4 right-4">
                   <label className="cursor-pointer bg-black text-white px-4 py-2 rounded shadow hover:bg-gray-800 flex items-center gap-2">
                       <Upload size={18} /> Cambiar Imagen
                       <input type="file" className="hidden" accept="image/*" onChange={handleBannerUpload} />
                   </label>
                </div>
             </div>
          </section>

          {/* DATOS DE CONTACTO */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-6">
             <h2 className="col-span-2 font-bold text-gray-700 text-xl">Información de Contacto (Visible en Web)</h2>
             
             <div>
                <label className="label">Título Página</label>
                <input className="input-field w-full p-2 border rounded" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} />
             </div>
             <div>
                <label className="label">Bajada (Subtítulo)</label>
                <input className="input-field w-full p-2 border rounded" value={formData.bajada} onChange={e => setFormData({...formData, bajada: e.target.value})} />
             </div>
             
             <div className="md:col-span-2 border-t my-2"></div>

             <div>
                <label className="label flex gap-2"><Phone size={16}/> Teléfono para llamadas</label>
                <input className="input-field w-full p-2 border rounded" value={formData.telefono} onChange={e => setFormData({...formData, telefono: e.target.value})} placeholder="(01) 123-4567" />
             </div>
             <div>
                <label className="label flex gap-2"><Mail size={16}/> Correo Electrónico (Visible)</label>
                <input className="input-field w-full p-2 border rounded" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="contacto@tuweb.com" />
             </div>
             <div>
                <label className="label flex gap-2"><MapPin size={16}/> Dirección</label>
                <input className="input-field w-full p-2 border rounded" value={formData.direccion} onChange={e => setFormData({...formData, direccion: e.target.value})} />
             </div>
             <div>
                <label className="label">Horario</label>
                <input className="input-field w-full p-2 border rounded" value={formData.horario} onChange={e => setFormData({...formData, horario: e.target.value})} />
             </div>
          </section>

          <div className="flex justify-end">
             <button type="submit" className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 flex gap-2 items-center">
                <Save size={20} /> Guardar Cambios
             </button>
          </div>
        </form>
      )}

      {/* --- PESTAÑA 2: MENSAJES --- */}
      {activeTab === 'mensajes' && (
        <div className="animate-fadeIn space-y-4">
            {mensajes.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed">
                    <p className="text-gray-400 text-lg">No hay mensajes nuevos</p>
                </div>
            ) : (
                <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 text-gray-600 font-semibold text-sm">
                            <tr>
                                <th className="p-4">Fecha</th>
                                <th className="p-4">Nombre / Email</th>
                                <th className="p-4">Asunto</th>
                                <th className="p-4">Mensaje</th>
                                <th className="p-4 text-right">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {mensajes.map((m) => (
                                <tr key={m.id} className="hover:bg-gray-50">
                                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                                        {new Date(m.created_at!).toLocaleDateString()} <br/>
                                        <span className="text-xs">{new Date(m.created_at!).toLocaleTimeString()}</span>
                                    </td>
                                    <td className="p-4">
                                        <p className="font-bold text-gray-800">{m.nombre}</p>
                                        <p className="text-sm text-blue-600">{m.email}</p>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            m.asunto === 'Reclamo' ? 'bg-red-100 text-red-700' :
                                            m.asunto === 'Sugerencia' ? 'bg-green-100 text-green-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>
                                            {m.asunto}
                                        </span>
                                    </td>
                                    <td className="p-4 text-gray-700 max-w-md">
                                        {m.mensaje}
                                    </td>
                                    <td className="p-4 text-right">
                                        <button 
                                            onClick={() => handleDeleteMensaje(m.id!)}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
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
            )}
        </div>
      )}
    </div>
  )
}