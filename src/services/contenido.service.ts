import { supabase } from '../lib/supabase'
import type { OfertaCombo } from '../types/Contenido'; // Importación corregida

export const obtenerOfertasCombos = async (): Promise<OfertaCombo[]> => {
  const { data, error } = await supabase
    .from('ofertas')
    .select(`
      *,
      oferta_productos (
        cantidad,
        productos (
          nombre,
          precio,
          imagen_url
        )
      )
    `)
    .eq('activo', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error al obtener ofertas:", error);
    return [];
  }
  return data as OfertaCombo[];
};
// Importamos TODOS los tipos desde el archivo central
import type { 
  ContenidoInicio, 
  ContenidoNosotros, 
  Tienda 
} from '../types/Contenido'

// --- 1. SERVICIO INICIO ---
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

// --- 2. SERVICIO NOSOTROS ---
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

// --- 3. SERVICIOS TIENDAS ---

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

// ... (manten los imports y servicios anteriores)

// --- 4. SERVICIOS CONTACTO ---

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