import { supabase } from '../lib/supabase'

export interface DataNosotros {
  id: number
  seccion: string
  subseccion: string | null
  tipo: string | null
  titulo: string | null
  contenido: string | null
  imagen_url: string | null
  orden: number
}

// 1. OBTENER TODO EL CONTENIDO
export const getNosotros = async () => {
  const { data, error } = await supabase
    .from('contenido_nosotros')
    .select('*')
    .order('orden', { ascending: true })
    .order('id', { ascending: true })

  if (error) throw error
  return data as DataNosotros[]
}

// 2. ACTUALIZAR TEXTOS (Título, Contenido, Emojis, etc.)
export const updateNosotrosTexto = async (id: number, updates: Partial<DataNosotros>) => {
  const { error } = await supabase
    .from('contenido_nosotros')
    .update(updates)
    .eq('id', id)

  if (error) throw error
}

// 3. SUBIR IMAGEN (A la carpeta 'contenido-nosotros')
export const uploadImagenNosotros = async (file: File, idRow: number) => {
  try {
    // A) Definir ruta: contenido/contenido-nosotros/timestamp_nombre.jpg
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}_${Math.floor(Math.random() * 1000)}.${fileExt}`
    const filePath = `contenido-nosotros/${fileName}` // <--- AQUÍ ESTÁ LA CARPETA

    // B) Subir al Storage (Bucket 'contenido')
    const { error: uploadError } = await supabase.storage
      .from('contenido')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // C) Obtener URL Pública
    const { data: { publicUrl } } = supabase.storage
      .from('contenido')
      .getPublicUrl(filePath)

    // D) Guardar URL en la Base de Datos
    const { error: dbError } = await supabase
      .from('contenido_nosotros')
      .update({ imagen_url: publicUrl })
      .eq('id', idRow)

    if (dbError) throw dbError

    return publicUrl

  } catch (error) {
    console.error('Error subiendo imagen:', error)
    throw error
  }
}