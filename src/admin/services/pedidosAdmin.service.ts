import { supabase } from '../../lib/supabase'

export interface Pedido {
  id: string
  created_at: string
  nombre_cliente: string
  telefono: string
  direccion: string
  total: number
  estado: 'pendiente' | 'en proceso' | 'entregado' | 'cancelado'
  productos: any[] // Array JSON de productos
  enviado_whatsapp: boolean
}

// 1. Obtener todos los pedidos (Más recientes primero)
export const obtenerTodosLosPedidos = async () => {
  const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Pedido[]
}

// 2. Actualizar el estado (Ej: de 'pendiente' a 'entregado')
export const actualizarEstadoPedido = async (id: string, nuevoEstado: string) => {
  const { error } = await supabase
    .from('pedidos')
    .update({ estado: nuevoEstado })
    .eq('id', id)

  if (error) throw error
}

// 3. Eliminar pedido (Opcional, solo para limpieza)
export const eliminarPedido = async (id: string) => {
  const { error } = await supabase
    .from('pedidos')
    .delete()
    .eq('id', id)

  if (error) throw error
}