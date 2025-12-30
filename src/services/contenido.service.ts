// src/services/contenido.service.ts
import { supabase } from '../lib/supabase'

// 1. Tipos de las OFERTAS
import type { Oferta } from '../types/Oferta'

// 2. Tipos del CONTENIDO
import type { 
  ContenidoHome, 
  ContenidoNosotros, 
  Tienda 
} from '../types/Contenido'


// ==========================================
// 1. SERVICIO DE OFERTAS (PACKS)
// ==========================================
export const obtenerOfertasCombos = async (): Promise<Oferta[]> => {
  const { data, error } = await supabase
    .from('ofertas') 
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
    // Asumiendo que la tabla 'ofertas' tiene la columna 'activo'
    .eq('activo', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error al obtener ofertas:", error);
    return [];
  }
  
  return data as Oferta[];
};


// ==========================================
// 2. SERVICIO HOME (Banners y Videos)
// ==========================================
export const obtenerContenidoHome = async (): Promise<ContenidoHome[]> => {
  // ⚠️ AQUÍ APUNTAMOS A LA TABLA CORRECTA
  const { data, error } = await supabase
    .from('contenido_home') 
    .select('*')
    // .eq('activo', true) // Comentado porque la tabla aún no tiene esta columna
    .order('created_at', { ascending: false }) 

  if (error) {
    console.error('Error cargando contenido home:', error)
    return []
  }

  return (data as ContenidoHome[]) || []
}


// ==========================================
// 3. SERVICIO NOSOTROS (Futuro)
// ==========================================
export const obtenerContenidoNosotros = async (): Promise<ContenidoNosotros[]> => {
  const { data, error } = await supabase
    .from('contenido_nosotros')
    .select('*')
    .order('orden', { ascending: true })

  if (error) return []
  return data as ContenidoNosotros[]
}


// ==========================================
// 4. SERVICIOS TIENDAS (Futuro)
// ==========================================
export const obtenerBannerTiendas = async (): Promise<string> => {
  const { data, error } = await supabase
    .from('contenido_tiendas')
    .select('url')
    .limit(1)
    .single()

  if (error) return ''
  return data?.url || ''
}

export const obtenerTiendas = async (): Promise<Tienda[]> => {
  const { data, error } = await supabase
    .from('tiendas')
    .select('*')
    .order('orden', { ascending: true })

  if (error) return []
  return data as Tienda[]
}


// ==========================================
// 5. SERVICIOS CONTACTO (Futuro)
// ==========================================
export const obtenerBannerContacto = async (): Promise<string> => {
  const { data, error } = await supabase
    .from('contenido_contacto')
    .select('url')
    .limit(1)
    .single()

  if (error) return ''
  return data?.url || ''
}

export const obtenerAjustesContacto = async (): Promise<Record<string, string>> => {
  const { data, error } = await supabase
    .from('ajustes_contacto')
    .select('clave, valor')

  if (error) return {}

  return data.reduce((acc: any, item) => {
    acc[item.clave] = item.valor
    return acc
  }, {})
}