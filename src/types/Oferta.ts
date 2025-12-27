// types/Oferta.ts
import type { Producto } from './Producto'

// 1. El detalle: Qué producto va y cuántos
export interface OfertaDetalle {
  cantidad: number
  // Supabase nos devolverá el objeto producto completo aquí
  producto: Producto 
}

// 2. La Oferta Principal (El Pack)
export interface Oferta {
  id: string // IMPORTANTE: String porque es UUID
  nombre: string
  slug: string
  descripcion?: string
  imagen_url?: string
  
  precio_oferta: number
  
  activo: boolean
  fecha_inicio?: string
  fecha_vencimiento?: string
  created_at: string
  
  // Relación: Una oferta tiene muchos productos dentro
  oferta_productos: OfertaDetalle[]
}