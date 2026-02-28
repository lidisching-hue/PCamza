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
  precio_oferta?: number | null  
  ofertaactiva?: boolean

  // --- NUEVO: PRECIOS POR CAJA / PAQUETE ---
  precio_caja?: number | null
  unidades_por_caja?: number | null

  // Propiedades de Combo
  esCombo?: boolean
  contenido?: any[]       
  oferta_productos?: any[] 
  
  // Campos para categorias 
  marca?: string
  presentacion?: string
  categoria?: string
}