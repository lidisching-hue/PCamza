import { supabase } from '../../lib/supabase'
import type { Producto } from '../../types/Producto'

// 1. Subir imagen al Bucket 'productos'
export const uploadProductImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}` // Nombre único por fecha
    const filePath = `${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('productos')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // Obtener URL pública
    const { data } = supabase.storage
      .from('productos')
      .getPublicUrl(filePath)

    return data.publicUrl
  } catch (error) {
    console.error('Error subiendo imagen:', error)
    return null
  }
}

// 2. Crear Producto
export const createProduct = async (producto: Omit<Producto, 'id'>) => {
  const { data, error } = await supabase
    .from('productos')
    .insert([producto])
    .select()
    .single()
  
  if (error) throw error
  return data
}

// 3. Actualizar Producto
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

// 4. Eliminar Producto
export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('productos')
    .delete()
    .eq('id', id)

  if (error) throw error
  return true
}