// src/types/Producto.ts
export interface Producto {
  id: string
  nombre: string
  descripcion: string | null
  precio: number
  imagen_url: string | null
  activo: boolean
  
  // Soporte para ambos nombres (viejo y nuevo)
  preciooferta?: number | null
  precio_oferta?: number | null  // <--- Nuevo
  ofertaactiva?: boolean

  // Propiedades de Combo
  esCombo?: boolean
  contenido?: any[]       // Legacy
  oferta_productos?: any[] // Nuevo
   // nuevos campos para categrias 
  marca?: string
  presentacion?: string
  categoria?: string
}