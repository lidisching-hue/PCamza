import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { obtenerConfigOferta, actualizarConfigOferta } from '../../services/contenido.service'

export default function AdminOfertasTitulo() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Estado del formulario
  const [form, setForm] = useState({
    titulo: '',
    subtitulo: '',
    fecha_fin: '',
    activo: true
  })

  // Cargar datos al inicio
  useEffect(() => {
    cargarConfig()
  }, [])

  const cargarConfig = async () => {
    try {
      const data = await obtenerConfigOferta()

      // TRUCO: El input datetime-local necesita el formato YYYY-MM-DDThh:mm
      // Si la fecha viene de Supabase (ISO), cortamos los segundos y la zona horaria para que el input la lea.
      let fechaFormat = ''
      if (data && data.fecha_fin) {
        const dateObj = new Date(data.fecha_fin)
        // Ajuste simple para zona horaria local en el input
        dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset())
        fechaFormat = dateObj.toISOString().slice(0, 16)
      }

      if (data) {
        setForm({
          titulo: data.titulo,
          subtitulo: data.subtitulo,
          fecha_fin: fechaFormat,
          activo: data.activo
        })
      }
    } catch (error) {
      toast.error('Error cargando configuración del banner')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      // Al guardar, convertimos de nuevo a ISO string para la base de datos
      const fechaISO = form.fecha_fin ? new Date(form.fecha_fin).toISOString() : null

      await actualizarConfigOferta({
        ...form,
        fecha_fin: fechaISO!
      })
      toast.success('¡Banner actualizado correctamente!')
    } catch (error) {
      console.error(error)
      toast.error('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="p-6 bg-white rounded-xl shadow animate-pulse">Cargando configuración...</div>

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
          📢 Configuración del Banner "Cierra Puertas"
        </h2>
        {form.activo ? (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase">Activo</span>
        ) : (
          <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-bold uppercase">Inactivo</span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* TÍTULO */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Título Principal</label>
          <input
            type="text"
            value={form.titulo}
            onChange={e => setForm({ ...form, titulo: e.target.value })}
            placeholder="Ej: CIERRA PUERTAS POR FIESTAS"
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-bold text-xl"
          />
        </div>

        {/* SUBTÍTULO */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Subtítulo</label>
          <input
            type="text"
            value={form.subtitulo}
            onChange={e => setForm({ ...form, subtitulo: e.target.value })}
            placeholder="Ej: Las mejores ofertas..."
            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* FECHA FIN */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">📅 Fecha Fin de Oferta</label>
            <input
              type="datetime-local"
              value={form.fecha_fin}
              onChange={e => setForm({ ...form, fecha_fin: e.target.value })}
              className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-red-500 outline-none"
            />
            <p className="text-xs text-gray-400 mt-1">El contador regresivo usará esta fecha.</p>
          </div>

          {/* ACTIVAR/DESACTIVAR */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <span className="block font-bold text-gray-700 text-sm">Visibilidad</span>
              <span className="text-xs text-gray-500">¿Mostrar banner en la web?</span>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, activo: !form.activo })}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${form.activo ? 'bg-green-500' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${form.activo ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </div>

        <div className="pt-4 border-t">
          <button
            type="submit"
            disabled={saving}
            className="w-full md:w-auto px-8 bg-slate-900 hover:bg-red-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? 'Guardando...' : '💾 Guardar Configuración'}
          </button>
        </div>

      </form>
    </div>
  )
}