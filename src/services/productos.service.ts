import { supabase } from '../lib/supabase'
import type { Producto } from '../types/Producto'

export const obtenerProductos = async (): Promise<Producto[]> => {
  const { data, error } = await supabase
    .from('productos')
    .select('*')

  if (error) {
    console.error('Error al obtener productos:', error.message)
    return []
  }

  return data ?? []
}
