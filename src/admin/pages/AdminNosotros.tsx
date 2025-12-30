import { useEffect, useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import { Save, Upload, Loader2, Image as ImageIcon } from 'lucide-react'
import { getNosotros, updateNosotrosTexto, uploadImagenNosotros, type DataNosotros,  } from '../../services/nosotros.service'

export default function AdminNosotros() {
  const [items, setItems] = useState<DataNosotros[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadingId, setUploadingId] = useState<number | null>(null)

  // Cargar datos al iniciar
  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      const data = await getNosotros()
      setItems(data)
    } catch (error) {
      toast.error('Error cargando datos')
    } finally {
      setLoading(false)
    }
  }

  // Manejar cambios en inputs de texto (localmente)
  const handleChange = (id: number, field: keyof DataNosotros, value: string) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  // Guardar cambios en BD
  const handleSave = async (item: DataNosotros) => {
    try {
      await updateNosotrosTexto(item.id, {
        titulo: item.titulo,
        contenido: item.contenido,
        imagen_url: item.imagen_url // Por si acaso editamos el emoji en valores
      })
      toast.success('Guardado correctamente')
    } catch (error) {
      toast.error('Error al guardar')
    }
  }

  // Subir imagen
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]

    try {
      setUploadingId(id)
      const url = await uploadImagenNosotros(file, id)
      
      // Actualizar estado local
      setItems(prev => prev.map(item => item.id === id ? { ...item, imagen_url: url } : item))
      toast.success('Imagen actualizada')
    } catch (error) {
      toast.error('Error subiendo imagen')
    } finally {
      setUploadingId(null)
    }
  }

  // --- HELPERS DE FILTRADO ---
  const getSection = (seccion: string) => items.filter(i => i.seccion === seccion)
  const getItem = (seccion: string, sub: string) => items.find(i => i.seccion === seccion && i.subseccion === sub)

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <div className="p-6 bg-gray-50 min-h-screen max-w-6xl mx-auto space-y-12">
      <Toaster position="top-right" />
      
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold text-gray-800">Editor: Quiénes Somos</h1>
        <p className="text-gray-500">Gestiona textos, imágenes y valores de la empresa.</p>
      </div>

      {/* 1. PORTADA (BANNER) */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-6 text-red-600 flex items-center gap-2">
          📸 Portada Principal
        </h2>
        {(() => {
          const banner = getItem('portada', 'banner_principal')
          if (!banner) return null
          return (
            <div className="grid md:grid-cols-2 gap-8">
              {/* Imagen */}
              <div>
                <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border mb-2 group">
                  <img src={banner.imagen_url || ''} alt="Banner" className="w-full h-full object-cover" />
                  {uploadingId === banner.id && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">Subiendo...</div>
                  )}
                </div>
                <label className="btn-upload inline-flex items-center gap-2 text-sm text-blue-600 cursor-pointer hover:underline">
                  <Upload size={16} /> Cambiar Imagen
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, banner.id)} />
                </label>
              </div>
              {/* Textos */}
              <div className="space-y-4">
                <div>
                  <label className="label">Título Principal</label>
                  <input 
                    className="input-field w-full p-2 border rounded"
                    value={banner.titulo || ''}
                    onChange={(e) => handleChange(banner.id, 'titulo', e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Descripción Corta</label>
                  <textarea 
                    className="input-field w-full p-2 border rounded h-24"
                    value={banner.contenido || ''}
                    onChange={(e) => handleChange(banner.id, 'contenido', e.target.value)}
                  />
                </div>
                <button onClick={() => handleSave(banner)} className="btn-save bg-black text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-gray-800">
                  <Save size={16} /> Guardar Cambios
                </button>
              </div>
            </div>
          )
        })()}
      </section>

      {/* 2. HISTORIA (Texto e Imágenes Carrusel) */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-6 text-red-600">📖 Historia</h2>
        
        {/* Titulo Historia */}
        {(() => {
           const titulo = getItem('historia', 'titulo_principal')
           if(titulo) return (
             <div className="flex gap-4 mb-6">
                <input 
                  className="w-full p-2 border rounded font-bold text-lg" 
                  value={titulo.titulo || ''} 
                  onChange={(e) => handleChange(titulo.id, 'titulo', e.target.value)}
                />
                <button onClick={() => handleSave(titulo)} className="bg-gray-100 p-2 rounded hover:bg-gray-200"><Save size={20}/></button>
             </div>
           )
        })()}

        {/* Párrafos */}
        <div className="space-y-4 mb-8">
          <h3 className="font-semibold text-gray-700">Párrafos de Historia:</h3>
          {getSection('historia').filter(i => i.tipo === 'parrafo').map(p => (
            <div key={p.id} className="flex gap-4">
              <textarea 
                className="w-full p-3 border rounded h-24 text-sm"
                value={p.contenido || ''}
                onChange={(e) => handleChange(p.id, 'contenido', e.target.value)}
              />
              <button onClick={() => handleSave(p)} className="self-start mt-2 text-blue-600 hover:text-blue-800"><Save size={20}/></button>
            </div>
          ))}
        </div>

        {/* Carrusel */}
        <h3 className="font-semibold text-gray-700 mb-4">Imágenes del Carrusel:</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {getSection('carrusel_historia').map(slide => (
            <div key={slide.id} className="border p-2 rounded bg-gray-50">
              <div className="relative h-32 bg-gray-200 rounded overflow-hidden mb-2">
                {slide.imagen_url ? (
                  <img src={slide.imagen_url} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full"><ImageIcon className="text-gray-400"/></div>
                )}
                {uploadingId === slide.id && <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xs">...</div>}
              </div>
              <label className="block text-center cursor-pointer bg-white border border-gray-300 rounded py-1 text-xs hover:bg-gray-50">
                Cambiar
                <input type="file" className="hidden" onChange={(e) => handleImageUpload(e, slide.id)} />
              </label>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MISIÓN Y VISIÓN */}
      <section className="grid md:grid-cols-2 gap-6">
        {['mision', 'vision'].map(sub => {
          const item = getItem('mision_vision', sub)
          if (!item) return null
          return (
            <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-bold text-lg capitalize">{sub}</h3>
                 <button onClick={() => handleSave(item)} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full"><Save size={20}/></button>
              </div>
              <input 
                className="w-full mb-2 p-2 border rounded font-semibold"
                value={item.titulo || ''}
                onChange={(e) => handleChange(item.id, 'titulo', e.target.value)}
              />
              <textarea 
                className="w-full p-2 border rounded h-32 text-sm"
                value={item.contenido || ''}
                onChange={(e) => handleChange(item.id, 'contenido', e.target.value)}
              />
            </div>
          )
        })}
      </section>

      {/* 4. VALORES */}
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold mb-6 text-red-600">💎 Nuestros Valores</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {getSection('valores').map(val => (
            <div key={val.id} className="flex gap-4 border p-4 rounded-lg bg-gray-50">
              {/* Emoji Input */}
              <div className="flex flex-col items-center gap-2">
                <input 
                  className="w-12 h-12 text-center text-2xl border rounded-full"
                  value={val.imagen_url || ''} // Usamos el campo imagen_url para guardar el emoji
                  onChange={(e) => handleChange(val.id, 'imagen_url', e.target.value)}
                  title="Pega aquí un Emoji"
                />
                <span className="text-[10px] text-gray-400">Emoji</span>
              </div>
              
              {/* Textos */}
              <div className="flex-grow space-y-2">
                <input 
                  className="w-full p-1 px-2 border rounded font-bold"
                  value={val.titulo || ''}
                  onChange={(e) => handleChange(val.id, 'titulo', e.target.value)}
                />
                <textarea 
                  className="w-full p-1 px-2 border rounded text-sm h-16"
                  value={val.contenido || ''}
                  onChange={(e) => handleChange(val.id, 'contenido', e.target.value)}
                />
              </div>
              
              <button onClick={() => handleSave(val)} className="self-center text-gray-400 hover:text-green-600">
                <Save size={24} />
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}