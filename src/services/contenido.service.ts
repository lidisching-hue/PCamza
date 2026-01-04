// src/services/contenido.service.ts
import { supabase } from '../lib/supabase'

// ==========================================
// TIPOS E INTERFACES
// ==========================================
import type { Oferta } from '../types/Oferta'
import type { 
  ContenidoHome, 
  ContenidoNosotros, 
  Tienda 
} from '../types/Contenido'

// Definimos tipos locales si no están en la carpeta types
export interface InfoContacto {
  id: number;
  banner_url: string;
  titulo: string;
  bajada: string;
  direccion: string;
  telefono: string;
  email: string;
  horario: string;
  facebook: string;
  instagram: string;
  tiktok: string;
  whatsapp: string;
}

export interface MensajeContacto {
  id?: number;
  created_at?: string;
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  leido?: boolean;
}

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
  const { data, error } = await supabase
    .from('contenido_home') 
    .select('*')
    .order('created_at', { ascending: false }) 

  if (error) {
    console.error('Error cargando contenido home:', error)
    return []
  }

  return (data as ContenidoHome[]) || []
}

// ==========================================
// 3. SERVICIO NOSOTROS
// ==========================================
export const obtenerContenidoNosotros = async (): Promise<ContenidoNosotros[]> => {
  const { data, error } = await supabase
    .from('contenido_nosotros')
    .select('*')
    .order('id', { ascending: true })

  if (error) return []
  return data as ContenidoNosotros[]
}

// ==========================================
// 4. SERVICIOS TIENDAS
// ==========================================

// --- LECTURA ---
export const obtenerBannerTiendas = async (): Promise<string> => {
  const { data, error } = await supabase
    .from('config_tiendas') 
    .select('banner_url')
    .single()

  if (error) return ''
  return data?.banner_url || ''
}

export const obtenerTiendas = async (): Promise<Tienda[]> => {
  const { data, error } = await supabase
    .from('contenido_tiendas') 
    .select('*')
    .order('orden', { ascending: true })

  if (error) {
    console.error('Error al obtener tiendas:', error)
    return []
  }
  return data as Tienda[]
}

// --- ESCRITURA (ADMIN) ---
export const crearTienda = async (tienda: Omit<Tienda, 'id'>) => {
  const { data, error } = await supabase
    .from('contenido_tiendas')
    .insert(tienda)
    .select()
    
  if (error) throw error
  return data
}

export const actualizarTienda = async (id: string | number, tienda: Partial<Tienda>) => {
  const { error } = await supabase
    .from('contenido_tiendas')
    .update(tienda)
    .eq('id', id)
    
  if (error) throw error
}

export const eliminarTienda = async (id: string | number) => {
  const { error } = await supabase
    .from('contenido_tiendas')
    .delete()
    .eq('id', id)
    
  if (error) throw error
}

export const subirBannerTiendas = async (file: File) => {
  const fileName = `contenido_tiendas/banner-${Date.now()}`
  
  const { error: uploadError } = await supabase.storage
    .from('contenido')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    })
  
  if (uploadError) throw uploadError
  
  const { data: publicData } = supabase.storage
    .from('contenido')
    .getPublicUrl(fileName)
  
  const { error: dbError } = await supabase
    .from('config_tiendas')
    .update({ banner_url: publicData.publicUrl })
    .eq('id', 1) 
    
  if (dbError) throw dbError
  
  return publicData.publicUrl
}

// ==========================================
// 5. SERVICIOS CONTACTO Y CONFIGURACIÓN
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

  return data.reduce((acc: any, item: any) => {
    acc[item.clave] = item.valor
    return acc
  }, {})
}

// ==========================================
// 6. CONFIGURACIÓN OFERTAS (Home)
// ==========================================
export const obtenerConfigOferta = async () => {
  const { data, error } = await supabase
    .from('config_ofertas')
    .select('*')
    .single()
  
  if (error) throw error
  return data
}

export const actualizarConfigOferta = async (datos: {
  titulo: string, 
  subtitulo: string, 
  fecha_fin: string,
  activo: boolean
}) => {
  const { error } = await supabase
    .from('config_ofertas')
    .update(datos)
    .eq('id', 1)

  if (error) throw error
}

// ==========================================
// 7. INFO DE CONTACTO (Página Contacto)
// ==========================================
export const obtenerInfoContacto = async (): Promise<InfoContacto | null> => {
  const { data, error } = await supabase
    .from('contenido_contactanos')
    .select('*')
    .single()

  if (error) {
    console.error('Error al obtener contacto:', error)
    return null
  }
  return data as InfoContacto
}

export const actualizarInfoContacto = async (datos: Partial<InfoContacto>) => {
  const { error } = await supabase
    .from('contenido_contactanos')
    .update(datos)
    .eq('id', 1)

  if (error) throw error
}

export const subirBannerContacto = async (file: File) => {
  const fileName = `contenido_contactanos/banner-${Date.now()}`
  
  const { error: uploadError } = await supabase.storage
    .from('contenido')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    })
  
  if (uploadError) throw uploadError
  
  const { data: publicData } = supabase.storage
    .from('contenido')
    .getPublicUrl(fileName)
  
  const { error: dbError } = await supabase
    .from('contenido_contactanos')
    .update({ banner_url: publicData.publicUrl })
    .eq('id', 1)
    
  if (dbError) throw dbError
  
  return publicData.publicUrl
}

// ==========================================
// 8. MENSAJERÍA DE CONTACTO
// ==========================================
export const enviarMensajeContacto = async (datos: MensajeContacto) => {
  const { error } = await supabase
    .from('mensajes_contacto')
    .insert([datos])

  if (error) throw error
}

export const obtenerMensajesContacto = async () => {
  const { data, error } = await supabase
    .from('mensajes_contacto')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as MensajeContacto[]
}

export const eliminarMensaje = async (id: number) => {
  const { error } = await supabase
    .from('mensajes_contacto')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}