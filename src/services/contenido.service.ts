// src/services/contenido.service.ts
import { supabase } from '../lib/supabase'

// ==========================================
// IMPORTACIÓN DE TIPOS
// ==========================================
// Asegúrate de que estos tipos existan en tu carpeta types
import type { Oferta } from '../types/Oferta'
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
    // Solo mostramos las activas en la web pública
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
    // Asumiendo que tienes una columna 'orden' o 'id'
    .order('id', { ascending: true })

  if (error) return []
  return data as ContenidoNosotros[]
}


// ==========================================
// 4. SERVICIOS TIENDAS (ACTUALIZADO)
// ==========================================

// --- LECTURA ---

// A. Obtener el banner superior (desde config_tiendas)
export const obtenerBannerTiendas = async (): Promise<string> => {
  const { data, error } = await supabase
    .from('config_tiendas') 
    .select('banner_url')
    .single()

  if (error) return ''
  return data?.banner_url || ''
}

// B. Obtener la lista de tiendas (desde contenido_tiendas)
export const obtenerTiendas = async (): Promise<Tienda[]> => {
  const { data, error } = await supabase
    .from('contenido_tiendas') // ✅ Nombre de tabla actualizado
    .select('*')
    .order('orden', { ascending: true }) // ✅ Ordenar por columna 'orden'

  if (error) {
    console.error('Error al obtener tiendas:', error)
    return []
  }
  return data as Tienda[]
}

// --- ESCRITURA (ADMIN) ---

// 1. Crear Tienda
export const crearTienda = async (tienda: Omit<Tienda, 'id'>) => {
  const { data, error } = await supabase
    .from('contenido_tiendas') // ✅ Tabla correcta
    .insert(tienda)
    .select()
    
  if (error) throw error
  return data
}

// 2. Actualizar Tienda
export const actualizarTienda = async (id: string | number, tienda: Partial<Tienda>) => {
  const { error } = await supabase
    .from('contenido_tiendas') // ✅ Tabla correcta
    .update(tienda)
    .eq('id', id)
    
  if (error) throw error
}

// 3. Eliminar Tienda
export const eliminarTienda = async (id: string | number) => {
  const { error } = await supabase
    .from('contenido_tiendas') // ✅ Tabla correcta
    .delete()
    .eq('id', id)
    
  if (error) throw error
}

// 4. Subir Banner Tiendas (Guardar en carpeta específica)
export const subirBannerTiendas = async (file: File) => {
  // ✅ Generamos ruta con carpeta 'contenido_tiendas/'
  const fileName = `contenido_tiendas/banner-${Date.now()}`
  
  // 1. Subir al Storage (Bucket: 'contenido')
  const { error: uploadError } = await supabase.storage
    .from('contenido')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    })
  
  if (uploadError) throw uploadError
  
  // 2. Obtener URL pública
  const { data: publicData } = supabase.storage
    .from('contenido')
    .getPublicUrl(fileName)
  
  // 3. Guardar referencia en la base de datos (config_tiendas)
  const { error: dbError } = await supabase
    .from('config_tiendas')
    .update({ banner_url: publicData.publicUrl })
    .eq('id', 1) 
    
  if (dbError) throw dbError
  
  return publicData.publicUrl
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

  if (error) return ''
  return data?.url || ''
}

export const obtenerAjustesContacto = async (): Promise<Record<string, string>> => {
  const { data, error } = await supabase
    .from('ajustes_contacto')
    .select('clave, valor')

  if (error) return {}

  // Convertimos array de objetos a un solo objeto clave:valor
  return data.reduce((acc: any, item) => {
    acc[item.clave] = item.valor
    return acc
  }, {})
}


// ==========================================
// 6. CONFIGURACIÓN OFERTAS (Contador/Banner Home)
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
// --- AGREGAR AL FINAL DE contenido.service.ts ---

// Definimos la interfaz aquí mismo o muévela a tu archivo de types
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

// 1. OBTENER DATOS CONTACTO
export const obtenerInfoContacto = async (): Promise<InfoContacto | null> => {
  const { data, error } = await supabase
    .from('contenido_contactanos')
    .select('*')
    .single() // Solo queremos una fila

  if (error) {
    console.error('Error al obtener contacto:', error)
    return null
  }
  return data as InfoContacto
}

// 2. ACTUALIZAR DATOS CONTACTO (Texto)
export const actualizarInfoContacto = async (datos: Partial<InfoContacto>) => {
  const { error } = await supabase
    .from('contenido_contactanos')
    .update(datos)
    .eq('id', 1) // Siempre actualizamos la fila 1

  if (error) throw error
}

// 3. SUBIR BANNER CONTACTO (Carpeta específica)
export const subirBannerContacto = async (file: File) => {
  // ✅ AQUÍ ESTÁ LA CARPETA QUE PEDISTE
  const fileName = `contenido_contactanos/banner-${Date.now()}`
  
  // A. Subir al Storage
  const { error: uploadError } = await supabase.storage
    .from('contenido')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    })
  
  if (uploadError) throw uploadError
  
  // B. Obtener URL
  const { data: publicData } = supabase.storage
    .from('contenido')
    .getPublicUrl(fileName)
  
  // C. Guardar URL en la base de datos
  const { error: dbError } = await supabase
    .from('contenido_contactanos')
    .update({ banner_url: publicData.publicUrl })
    .eq('id', 1)
    
  if (dbError) throw dbError
  
  return publicData.publicUrl
}

// --- AGREGAR A contenido.service.ts ---

// Interfaz para los mensajes
export interface MensajeContacto {
  id?: number;
  created_at?: string;
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  leido?: boolean;
}

// 1. ENVIAR MENSAJE (Desde el formulario público)
export const enviarMensajeContacto = async (datos: MensajeContacto) => {
  const { error } = await supabase
    .from('mensajes_contacto')
    .insert([datos])

  if (error) throw error
}

// 2. OBTENER MENSAJES (Para el Admin)
export const obtenerMensajesContacto = async () => {
  const { data, error } = await supabase
    .from('mensajes_contacto')
    .select('*')
    .order('created_at', { ascending: false }) // Los más nuevos primero

  if (error) throw error
  return data as MensajeContacto[]
}

// 3. BORRAR MENSAJE (Opcional, para limpiar bandeja)
export const eliminarMensaje = async (id: number) => {
  const { error } = await supabase
    .from('mensajes_contacto')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}