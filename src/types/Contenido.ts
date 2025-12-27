// types/contenido.ts

// --- SECCIÓN INICIO ---
export interface ContenidoInicio {
  id: number
  created_at: string
  seccion: 'banner' | 'oferta' | 'video'
  url: string
  orden: number
  titulo?: string
  activo: boolean
}

// --- SECCIÓN NOSOTROS ---
export interface ContenidoNosotros {
  id: number
  seccion: string
  url: string
  orden: number
  titulo?: string
}

// --- SECCIÓN TIENDAS ---
export interface ContenidoTiendaBanner {
  url: string
}

export interface Tienda {
  id: number
  ciudad: string
  nombre: string
  direccion: string
  horario: string
  telefono: string
  map_src: string
  orden: number
}

// --- CONTACTO ---
export interface AjusteContacto {
  id: number
  clave: string
  valor: string
}