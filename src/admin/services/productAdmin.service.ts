import { supabase } from '../../lib/supabase'
import type { Producto } from '../../types/Producto'
import imageCompression from 'browser-image-compression'

/**
 * 1. Subir imagen al Bucket 'productos' con compresión optimizada
 */
export const uploadProductImage = async (file: File): Promise<string | null> => {
  try {
    // --- CONFIGURACIÓN DE COMPRESIÓN ---
    const opciones = {
      maxSizeMB: 0.5,          // 500 KB: Equilibrio perfecto calidad/peso
      maxWidthOrHeight: 1200,   // Un poco más de resolución para pantallas modernas
      useWebWorker: true,      // Evita que la web se congele durante el proceso
    }

    // Comprimimos el archivo
    const archivoComprimido = await imageCompression(file, opciones)

    // --- GENERACIÓN DE NOMBRE ÚNICO ---
    // Usamos el nombre original para la extensión y añadimos un random para evitar duplicados
    const fileExt = file.name.split('.').pop() || 'jpg'
    const randomId = Math.random().toString(36).substring(2, 8)
    const fileName = `${Date.now()}-${randomId}.${fileExt}`
    const filePath = `${fileName}`

    // --- SUBIDA A SUPABASE ---
    const { error: uploadError } = await supabase.storage
      .from('productos')
      .upload(filePath, archivoComprimido)

    if (uploadError) throw uploadError

    // Obtener URL pública
    const { data } = supabase.storage
      .from('productos')
      .getPublicUrl(filePath)

    return data.publicUrl
  } catch (error) {
    console.error('Error en el proceso de imagen:', error)
    return null
  }
}

/**
 * 2. Crear Producto en la base de datos
 */
export const createProduct = async (producto: Omit<Producto, 'id'>) => {
  const { data, error } = await supabase
    .from('productos')
    .insert([producto])
    .select()
    .single()
  
  if (error) throw error
  return data
}

/**
 * 3. Actualizar Producto existente
 */
export const updateProduct = async (id: string, updates: Partial<Producto>) => {
  const { data, error } = await supabase
    .from('productos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * 4. Eliminar Producto y su imagen física del Storage
 */
export const deleteProduct = async (id: string, imagenUrl?: string) => {
  try {
    // 1. Si existe URL, extraemos el nombre del archivo para borrarlo del Storage
    if (imagenUrl) {
      // Extrae solo el nombre del archivo después de la carpeta /productos/
      const filePath = imagenUrl.split('/productos/').pop()
      if (filePath) {
        await supabase.storage.from('productos').remove([filePath])
      }
    }

    // 2. Borramos el registro de la base de datos
    const { error } = await supabase
      .from('productos')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (error) {
    console.error('Error al eliminar producto:', error)
    throw error
  }
}