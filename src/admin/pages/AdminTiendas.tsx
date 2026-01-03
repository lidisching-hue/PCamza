import { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { Save, Upload, Loader2, MapPin, Clock, Phone, Trash2, Edit, Plus, X } from 'lucide-react'

// Asumo que crearás estas funciones en tu servicio, abajo te dejo el ejemplo del servicio
import { 
  obtenerTiendas, 
  obtenerBannerTiendas, 
  crearTienda, 
  actualizarTienda, 
  eliminarTienda, 
  subirBannerTiendas 
} from '../../services/contenido.service'

import type { Tienda } from '../../types/Contenido'

export default function AdminTiendas() {
  // --- ESTADOS ---
  const [tiendas, setTiendas] = useState<Tienda[]>([])
  const [bannerUrl, setBannerUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploadingBanner, setUploadingBanner] = useState(false)

  // Estados para Modal de Crear/Editar
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | number | null>(null)
  const [formData, setFormData] = useState<Partial<Tienda>>({
    ciudad: 'piura',
    nombre: '',
    direccion: '',
    horario: '',
    telefono: '',
    map_src: ''
  })

  // --- CARGAR DATOS ---
  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const [listaTiendas, urlBanner] = await Promise.all([
        obtenerTiendas(),
        obtenerBannerTiendas()
      ])
      setTiendas(listaTiendas)
      if (urlBanner) setBannerUrl(urlBanner)
    } catch (error) {
      toast.error('Error cargando datos')
    } finally {
      setLoading(false)
    }
  }

  // --- LÓGICA DEL BANNER ---
  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]

    try {
      setUploadingBanner(true)
      const newUrl = await subirBannerTiendas(file)
      setBannerUrl(newUrl) // Actualizamos vista
      toast.success('Banner actualizado correctamente')
    } catch (error) {
      toast.error('Error subiendo el banner')
      console.error(error)
    } finally {
      setUploadingBanner(false)
    }
  }

  // --- LÓGICA DE TIENDAS (CRUD) ---
  
  // Abrir modal para crear
  const openCreate = () => {
    setEditingId(null)
    setFormData({ ciudad: 'piura', nombre: '', direccion: '', horario: '', telefono: '', map_src: '' })
    setIsModalOpen(true)
  }

  // Abrir modal para editar
  const openEdit = (tienda: Tienda) => {
    setEditingId(tienda.id)
    setFormData(tienda)
    setIsModalOpen(true)
  }

  // Guardar (Crear o Editar)
  const handleSaveTienda = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        // Editar
        await actualizarTienda(editingId, formData)
        toast.success('Tienda actualizada')
      } else {
        // Crear
        await crearTienda(formData as Tienda)
        toast.success('Tienda creada')
      }
      setIsModalOpen(false)
      cargarDatos() // Recargar lista
    } catch (error) {
      toast.error('Error al guardar tienda')
    }
  }

  // Eliminar
  const handleDelete = async (id: string | number) => {
    if (!confirm('¿Estás seguro de eliminar esta tienda?')) return
    try {
      await eliminarTienda(id)
      setTiendas(prev => prev.filter(t => t.id !== id))
      toast.success('Tienda eliminada')
    } catch (error) {
      toast.error('Error al eliminar')
    }
  }

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <div className="p-6 bg-gray-50 min-h-screen max-w-7xl mx-auto space-y-12">
      <Toaster position="top-right" />
      
      <div className="border-b pb-4 flex justify-between items-end">
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Editor: Nuestras Tiendas</h1>
            <p className="text-gray-500">Gestiona el banner principal y las sucursales.</p>
        </div>
      </div>

      {/* 1. SECCIÓN BANNER PRINCIPAL */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-6 text-red-600 flex items-center gap-2">
          📸 Banner Principal
        </h2>
        <div className="relative aspect-[3/1] bg-gray-100 rounded-lg overflow-hidden border group">
             {bannerUrl ? (
                 <img src={bannerUrl} alt="Banner Tiendas" className="w-full h-full object-cover" />
             ) : (
                 <div className="flex items-center justify-center h-full text-gray-400">Sin Banner</div>
             )}
             
             {/* Overlay de carga */}
             {uploadingBanner && (
               <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold">
                 Subiendo...
               </div>
             )}

             {/* Botón flotante para cambiar */}
             <div className="absolute bottom-4 right-4">
                <label className="cursor-pointer bg-black text-white px-4 py-2 rounded shadow-lg hover:bg-gray-800 flex items-center gap-2 transition-all">
                    <Upload size={18} /> Cambiar Banner
                    <input type="file" className="hidden" accept="image/*" onChange={handleBannerUpload} />
                </label>
             </div>
        </div>
      </section>

      {/* 2. LISTA DE TIENDAS */}
      <section>
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            🏪 Sucursales Activas ({tiendas.length})
            </h2>
            <button onClick={openCreate} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-red-700 shadow-sm transition-colors">
                <Plus size={20} /> Nueva Tienda
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tiendas.map(tienda => (
                <div key={tienda.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow relative group">
                    <div className="flex justify-between items-start mb-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${tienda.ciudad.toLowerCase() === 'piura' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                            {tienda.ciudad}
                        </span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openEdit(tienda)} className="p-1.5 bg-gray-100 text-blue-600 rounded hover:bg-blue-50"><Edit size={16} /></button>
                            <button onClick={() => handleDelete(tienda.id)} className="p-1.5 bg-gray-100 text-red-600 rounded hover:bg-red-50"><Trash2 size={16} /></button>
                        </div>
                    </div>
                    
                    <h3 className="font-bold text-lg text-gray-800 mb-2">{tienda.nombre}</h3>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-start gap-2">
                            <MapPin size={16} className="mt-0.5 text-gray-400 shrink-0" />
                            <p className="line-clamp-2">{tienda.direccion}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock size={16} className="text-gray-400 shrink-0" />
                            <p>{tienda.horario}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone size={16} className="text-gray-400 shrink-0" />
                            <p>{tienda.telefono || 'Sin teléfono'}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* MODAL (CREAR / EDITAR) */}
      {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
              <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
                  <div className="bg-gray-100 px-6 py-4 border-b flex justify-between items-center">
                      <h3 className="font-bold text-lg text-gray-700">{editingId ? 'Editar Tienda' : 'Nueva Tienda'}</h3>
                      <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-black"><X size={24}/></button>
                  </div>
                  
                  <form onSubmit={handleSaveTienda} className="p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="label">Ciudad</label>
                              <select 
                                className="input-field w-full p-2 border rounded"
                                value={formData.ciudad}
                                onChange={e => setFormData({...formData, ciudad: e.target.value})}
                              >
                                  <option value="piura">Piura</option>
                                  <option value="chiclayo">Chiclayo</option>
                                  <option value="tumbes">Tumbes</option>
                                  {/* Agrega más ciudades aquí */}
                              </select>
                          </div>
                          <div>
                              <label className="label">Nombre de la Tienda</label>
                              <input 
                                required
                                className="input-field w-full p-2 border rounded"
                                placeholder="Ej: Tienda Centro"
                                value={formData.nombre}
                                onChange={e => setFormData({...formData, nombre: e.target.value})}
                              />
                          </div>
                      </div>

                      <div>
                          <label className="label">Dirección</label>
                          <input 
                            required
                            className="input-field w-full p-2 border rounded"
                            value={formData.direccion}
                            onChange={e => setFormData({...formData, direccion: e.target.value})}
                          />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="label">Horario</label>
                            <input 
                                className="input-field w-full p-2 border rounded"
                                placeholder="Ej: Lun-Dom 7am - 10pm"
                                value={formData.horario}
                                onChange={e => setFormData({...formData, horario: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="label">Teléfono</label>
                            <input 
                                className="input-field w-full p-2 border rounded"
                                value={formData.telefono || ''}
                                onChange={e => setFormData({...formData, telefono: e.target.value})}
                            />
                        </div>
                      </div>

                      <div>
                          <label className="label flex justify-between">
                              <span>Link del Mapa (Embed Src)</span>
                              <span className="text-xs text-gray-400 font-normal">Pega solo la URL del 'src' del iframe de Google Maps</span>
                          </label>
                          <input 
                            required
                            className="input-field w-full p-2 border rounded text-sm font-mono text-gray-600"
                            placeholder="https://www.google.com/maps/embed?pb=..."
                            value={formData.map_src}
                            onChange={e => setFormData({...formData, map_src: e.target.value})}
                          />
                          {formData.map_src && (
                              <div className="mt-2 h-32 bg-gray-100 rounded overflow-hidden border">
                                  <iframe src={formData.map_src} className="w-full h-full" loading="lazy"></iframe>
                              </div>
                          )}
                      </div>

                      <div className="pt-4 flex justify-end gap-3">
                          <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancelar</button>
                          <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 flex items-center gap-2">
                              <Save size={18} /> Guardar Tienda
                          </button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  )
}