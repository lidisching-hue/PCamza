import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import { Megaphone, Save, Clock, Power } from 'lucide-react' 
import { obtenerConfigOferta, actualizarConfigOferta } from '../../services/contenido.service'

export default function AdminOfertasTitulo() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  // Estado del formulario
  const [form, setForm] = useState({
    titulo: '',
    subtitulo: '',
    fecha_fin: '', 
    activo: false
  })

  // Cargar datos al iniciar
  useEffect(() => {
    cargarConfig()
  }, [])

  const cargarConfig = async () => {
    try {
      const data = await obtenerConfigOferta()
      
      let fechaInput = ''
      if (data && data.fecha_fin) {
        // Truco para que el input datetime-local muestre la hora correcta
        const dateObj = new Date(data.fecha_fin)
        // Restamos el offset de zona horaria para que se vea en hora local
        dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset())
        fechaInput = dateObj.toISOString().slice(0, 16)
      }

      if (data) {
        setForm({
          titulo: data.titulo || '',
          subtitulo: data.subtitulo || '',
          fecha_fin: fechaInput,
          activo: data.activo || false
        })
      }
    } catch (error) {
      console.error(error)
      toast.error("Error cargando configuración")
    } finally {
      setLoading(false)
    }
  }

  const handleGuardar = async () => {
    if (!form.titulo) return toast.error("El título es obligatorio")
    setSaving(true)
    
    try {
      // PREPARAMOS EL PAYLOAD EXACTO QUE PIDE EL SERVICIO
      const payload = {
        titulo: form.titulo,
        subtitulo: form.subtitulo,
        activo: form.activo,
        // Si hay fecha en el input, la convertimos a ISO. Si no, enviamos null.
        fecha_fin: form.fecha_fin ? new Date(form.fecha_fin).toISOString() : null
      }

      await actualizarConfigOferta(payload)
      toast.success('¡Banner actualizado correctamente!')
    
    } catch (error: any) {
      console.error(error)
      toast.error('Error al guardar: ' + (error.message || 'Desconocido'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="h-40 bg-gray-900 rounded-2xl animate-pulse"></div>

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 shadow-2xl border border-slate-700 overflow-hidden relative">
      {/* Decoración de fondo */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-600 rounded-full opacity-20 blur-3xl"></div>

      {/* CABECERA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-slate-700/50 p-2 rounded-lg">
             <Megaphone className="text-yellow-400" size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold">Configuración Global</h2>
            <p className="text-slate-400 text-xs">Control del Banner y Contador</p>
          </div>
        </div>

        {/* SWITCH ACTIVO */}
        <button
          onClick={() => setForm({ ...form, activo: !form.activo })}
          className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all ${
            form.activo ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-gray-700/30 border-gray-600 text-gray-500'
          }`}
        >
          <Power size={18} />
          <span className="text-sm font-bold">{form.activo ? 'BANNER VISIBLE' : 'OCULTO'}</span>
        </button>
      </div>

      {/* FORMULARIO RESPONSIVE */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 relative z-10">
        
        {/* IZQUIERDA: Textos */}
        <div className="md:col-span-7 space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Título del Evento</label>
            <input 
              type="text"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              placeholder="Ej: CIERRA PUERTAS"
              className="w-full bg-slate-900/50 border border-slate-600 rounded-xl p-3 text-white focus:ring-2 focus:ring-red-500 outline-none font-bold"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Subtítulo</label>
            <input 
              type="text"
              value={form.subtitulo}
              onChange={(e) => setForm({ ...form, subtitulo: e.target.value })}
              placeholder="Ej: Descuentos irrepetibles..."
              className="w-full bg-slate-900/50 border border-slate-600 rounded-xl p-3 text-white focus:ring-2 focus:ring-red-500 outline-none"
            />
          </div>
        </div>

        {/* DERECHA: Fecha y Guardar */}
        <div className="md:col-span-5 flex flex-col gap-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase mb-1 flex items-center gap-2">
              <Clock size={12} /> Fin del Contador
            </label>
            <input 
              type="datetime-local"
              value={form.fecha_fin}
              onChange={(e) => setForm({ ...form, fecha_fin: e.target.value })}
              className="w-full bg-slate-900 border border-slate-600 rounded-xl p-3 text-white text-sm focus:ring-2 focus:ring-red-500 outline-none [color-scheme:dark]"
            />
          </div>

          <button
            onClick={handleGuardar}
            disabled={saving}
            className="mt-auto w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : <><Save size={18} /> Guardar Cambios</>}
          </button>
        </div>
      </div>
    </div>
  )
}