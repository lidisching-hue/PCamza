import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

// Definimos el tipo de dato
interface Contenido {
  id: string
  seccion: 'banner' | 'oferta' | 'video'
  url: string
}

export default function AdminBanners() {
  const [contenidos, setContenidos] = useState<Contenido[]>([])
  const [, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)

  // Cargar datos al iniciar
  useEffect(() => {
    fetchContenido()
  }, [])

  const fetchContenido = async () => {
    // CAMBIO: Ahora leemos de 'contenido_home'
    const { data } = await supabase
      .from('contenido_home') 
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setContenidos(data as Contenido[])
    setLoading(false)
  }

  // --- FUNCIÓN DE SUBIDA ---
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, seccion: string) => {
    if (!e.target.files || e.target.files.length === 0) return

    setUploading(true)
    const file = e.target.files[0]
    const fileExt = file.name.split('.').pop()
    
    // CAMBIO: Estructura de carpetas -> contenido (bucket) / contenido_home (carpeta) / banner (subcarpeta)
    const fileName = `contenido_home/${seccion}/${Date.now()}.${fileExt}`

    try {
      // 1. Subir al Storage (Bucket 'contenido')
      const { error: uploadError } = await supabase.storage
        .from('contenido') 
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // 2. Obtener URL Pública
      const { data: { publicUrl } } = supabase.storage
        .from('contenido')
        .getPublicUrl(fileName)

      // 3. Guardar referencia en Base de Datos
      // CAMBIO: Ahora guardamos en 'contenido_home'
      const { error: dbError } = await supabase
        .from('contenido_home')
        .insert({ seccion, url: publicUrl })

      if (dbError) throw dbError

      // 4. Recargar la lista
      await fetchContenido()
      alert('¡Subido correctamente!')

    } catch (error: any) {
      console.error(error)
      alert('Error al subir: ' + error.message)
    } finally {
      setUploading(false)
      e.target.value = '' // Limpiar input
    }
  }

  // --- FUNCIÓN ELIMINAR ---
  const handleDelete = async (id: string, url: string) => {
    if (!confirm('¿Estás seguro de eliminar este elemento?')) return

    try {
      // 1. Borrar del Storage
      // Extraemos la ruta relativa después del nombre del bucket
      const pathPart = url.split('/contenido/')[1] 
      
      if (pathPart) {
        await supabase.storage.from('contenido').remove([pathPart])
      }

      // 2. Borrar de la Base de Datos
      // CAMBIO: Borramos de 'contenido_home'
      const { error } = await supabase
        .from('contenido_home')
        .delete()
        .eq('id', id)

      if (error) throw error

      setContenidos(prev => prev.filter(c => c.id !== id))

    } catch (error) {
      console.error(error)
      alert('Error al eliminar')
    }
  }

  // Filtros para mostrar en secciones
  const banners = contenidos.filter(c => c.seccion === 'banner')
  const ofertas = contenidos.filter(c => c.seccion === 'oferta')
  const videos = contenidos.filter(c => c.seccion === 'video')

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Contenido Home</h1>
      <p className="text-gray-500 mb-8">Administra los banners, imágenes de ofertas y videos promocionales.</p>

      {uploading && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="font-bold text-gray-700">Subiendo archivo...</span>
          </div>
        </div>
      )}

      {/* --- SECCIÓN 1: BANNERS PRINCIPALES --- */}
      <section className="mb-12 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            🖼️ Banner Principal (Carrusel)
          </h2>
          <label className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-md flex items-center gap-2">
            <span>+ Subir Banner</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'banner')} />
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map(item => (
            <div key={item.id} className="relative group rounded-xl overflow-hidden shadow-md border border-gray-200">
              <img src={item.url} alt="Banner" className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button 
                  onClick={() => handleDelete(item.id, item.url)}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold hover:scale-105 transition-transform"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
          {banners.length === 0 && <p className="text-gray-400 italic col-span-2 text-center py-10">No hay banners subidos.</p>}
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* --- SECCIÓN 2: IMÁGENES DE OFERTA --- */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              🏷️ Ofertas (Izquierda)
            </h2>
            <label className="cursor-pointer bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-green-700 transition shadow-md">
              + Subir Imagen
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleUpload(e, 'oferta')} />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {ofertas.map(item => (
              <div key={item.id} className="relative group rounded-lg overflow-hidden shadow-sm border border-gray-200 aspect-square">
                <img src={item.url} alt="Oferta" className="w-full h-full object-cover" />
                <button 
                  onClick={() => handleDelete(item.id, item.url)}
                  className="absolute top-2 right-2 bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                >
                  ✕
                </button>
              </div>
            ))}
            {ofertas.length === 0 && <p className="text-gray-400 italic text-center col-span-2 py-8">Sin imágenes de oferta.</p>}
          </div>
        </section>

        {/* --- SECCIÓN 3: VIDEOS --- */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              🎥 Videos (Derecha)
            </h2>
            <label className="cursor-pointer bg-purple-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-purple-700 transition shadow-md">
              + Subir Video (MP4)
              <input type="file" accept="video/mp4,video/webm" className="hidden" onChange={(e) => handleUpload(e, 'video')} />
            </label>
          </div>

          <div className="space-y-4">
            {videos.map(item => (
              <div key={item.id} className="relative group bg-gray-900 rounded-lg overflow-hidden shadow-md">
                <video src={item.url} className="w-full h-40 object-contain bg-black" controls />
                <button 
                  onClick={() => handleDelete(item.id, item.url)}
                  className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 text-xs font-bold rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Eliminar Video
                </button>
              </div>
            ))}
            {videos.length === 0 && <p className="text-gray-400 italic text-center py-8">Sin videos promocionales.</p>}
          </div>
        </section>

      </div>
    </div>
  )
}