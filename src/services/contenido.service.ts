import { supabase } from '../lib/supabase'

// 1. Tipos de las OFERTAS (Nuevo archivo)
import type { Oferta } from '../types/Oferta'

// 2. Tipos del CONTENIDO (Archivo existente)
import type { 
  ContenidoInicio, 
  ContenidoNosotros, 
  Tienda 
} from '../types/Contenido'


// ==========================================
// 1. SERVICIO DE OFERTAS (PACKS)
// ==========================================
export const obtenerOfertasCombos = async (): Promise<Oferta[]> => {
  const { data, error } = await supabase
    .from('ofertas') // Tabla nueva
    .select(`
      *,
      oferta_productos (
        cantidad,
        producto:productos (   
          id,
          nombre,
          precio,
          imagen_url
        )
      )
    `)
    // NOTA: "producto:productos" es un alias para que el objeto 
    // se llame "producto" (singular) y no "productos" (array)
    .eq('activo', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error al obtener ofertas:", error);
    return [];
  }
  
  return data as Oferta[];
};


// ==========================================
// 2. SERVICIO INICIO (Banners y Videos)
// ==========================================
export const obtenerContenidoInicio = async (): Promise<ContenidoInicio[]> => {
  const { data, error } = await supabase
    .from('contenidos_inicio')
    .select('*')
    .eq('activo', true)
    .order('orden', { ascending: true })

  if (error) {
    console.error('Error cargando contenido de inicio:', error)
    return []
  }

  return data as ContenidoInicio[]
}


// ==========================================
// 3. SERVICIO NOSOTROS
// ==========================================
export const obtenerContenidoNosotros = async (): Promise<ContenidoNosotros[]> => {
  const { data, error } = await supabase
    .from('contenido_nosotros')
    .select('*')
    .order('orden', { ascending: true })

  if (error) {
    console.error('Error cargando contenido nosotros:', error)
    return []
  }

  return data as ContenidoNosotros[]
}


// ==========================================
// 4. SERVICIOS TIENDAS
// ==========================================

// Obtener el banner de la página tiendas
export const obtenerBannerTiendas = async (): Promise<string> => {
  const { data, error } = await supabase
    .from('contenido_tiendas')
    .select('url')
    .limit(1)
    .single()

  if (error) {
    console.error('Error cargando banner tiendas:', error)
    return ''
  }
  return data?.url || ''
}

// Obtener la lista de sucursales
export const obtenerTiendas = async (): Promise<Tienda[]> => {
  const { data, error } = await supabase
    .from('tiendas')
    .select('*')
    .order('orden', { ascending: true })

  if (error) {
    console.error('Error cargando lista de tiendas:', error)
    return []
  }
  return data as Tienda[]
}


// ==========================================
// 5. SERVICIOS CONTACTO
// ==========================================

export const obtenerBannerContacto = async (): Promise<string> => {
  const { data, error } = await supabase
    .from('contenido_contacto')
    .select('url')
    .limit(1)
    .single()

  if (error) {
    console.error('Error cargando banner contacto:', error)
    return ''
  }
  return data?.url || ''
}

export const obtenerAjustesContacto = async (): Promise<Record<string, string>> => {
  const { data, error } = await supabase
    .from('ajustes_contacto')
    .select('clave, valor')

  if (error) {
    console.error('Error cargando ajustes contacto:', error)
    return {}
  }

  // Convertimos el array de objetos en un objeto simple: { telefono: '...', email: '...' }
  return data.reduce((acc: any, item) => {
    acc[item.clave] = item.valor
    return acc
  }, {})
}