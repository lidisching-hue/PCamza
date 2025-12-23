import { supabase } from '../lib/supabase'

// 1. Función para guardar el pedido en la Base de Datos
export const crearPedido = async (userId: string | null, items: any[], datosCliente: any) => {

  const montoTotal = items.reduce((acc, item) => {
    const precio = item.ofertaactiva && item.preciooferta 
      ? item.preciooferta 
      : item.precio
    return acc + (precio * item.cantidad)
  }, 0)

  // Mapeo exacto a tus columnas (todo minúsculas)
  const { data, error } = await supabase
    .from('pedidos')
    .insert([
      {
        user_id: userId,                      
        nombre_cliente: datosCliente.nombre,
        telefono: datosCliente.telefono,
        direccion: datosCliente.direccion,
        productos: items,                     
        total: montoTotal,                    
        estado: 'pendiente'                   
      }
    ])
    .select()
    .single()

  if (error) {
    console.error("Error Supabase:", error.message)
    throw error
  }

  return data.id
}

// 2. Función para abrir WhatsApp (CORREGIDA PARA PC Y MÓVIL)
export const enviarPedidoWhatsApp = async (id: string, telefonoTienda: string, mensaje: string) => {
    // 🔴 CAMBIO IMPORTANTE:
    // Usamos api.whatsapp.com en lugar de wa.me para que funcione en PC
    const url = `https://api.whatsapp.com/send?phone=${telefonoTienda}&text=${encodeURIComponent(mensaje)}`
    
    // Abrimos en una nueva pestaña
    window.open(url, '_blank')
    
    // Actualizamos el estado en la base de datos
    try {
        await supabase.from('pedidos').update({ enviado_whatsapp: true }).eq('id', id)
    } catch (err) {
        console.log("No se pudo actualizar el flag de whatsapp, pero el mensaje se envió.")
    }
}
export interface Producto {
  id: string
  nombre: string
  precio: number
  imagen_url: string
  // Agregamos estas dos como opcionales (?) para los combos
  esCombo?: boolean
  contenido?: { nombre: string; cantidad: number }[]
}